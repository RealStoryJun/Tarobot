# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 아키텍처 한눈에

```
브라우저 (정적 HTML/JS @ tarot.realstoryjun.co.kr, Cloudflare Pages)
  └─ fetch ─▶ Cloudflare Worker "taroai" (workers/tarobot-api/)
                ├─ Groq API (AI 리딩, /api/interpret)
                └─ Supabase
                    ├─ Auth REST (/auth/v1/user, /rest/v1/readings)
                    └─ Edge Functions (handle-auth, handle-readings)
```

핵심 흐름: **프론트는 Worker 에만 말하고**, Worker 가 Groq / Supabase 를 중계한다. 프론트에서 Supabase 를 직접 호출하는 경로는 **없다**.

## 레이어별 책임 (경계를 흐리지 말 것)

| 레이어 | 맡는 것 | 맡지 않는 것 |
|---|---|---|
| 프론트 (`app.js`, `auth.js`, `admin.html`) | UI, 사용자 입력, `apiCall` 호출, localStorage 토큰/세션 | 직접 Supabase/Groq 호출, 시크릿 보관 |
| Worker (`workers/tarobot-api/index.js`) | 라우팅, CORS, JWT 검증 후 `isAdmin` 판단, Groq 프롬프트 조립 | 비즈니스 DB 로직 (Edge Functions 로 위임) |
| Edge Functions (`supabase/functions/*/index.ts`) | DB 쓰기/검증, payload 화이트리스트, `user_id` 서버측 주입 | CORS (Worker 가 프론트 대면) |
| DB (`supabase/schema.sql`) | RLS 로 회원/세션 격리 | 클라이언트 신뢰 |

**동일 파일이 두 군데** 있을 때 주의: `supabase/functions/handle-auth/index.ts` 가 Supabase CLI 가 실제로 배포하는 파일. 과거 `handle-auth.ts` 같은 평평한 파일이 있었고 지금은 제거됨 — 다시 생기지 않게.

## 보안 불변 조건 (절대 깨지 말 것)

1. **`user_id` 는 서버에서만 결정**. 클라이언트 payload 의 `user_id` 는 무시 — `handle-readings/index.ts` 에서 JWT 검증 성공한 경우에만 `row.user_id = user.id` 로 덮어씀.
2. **DB insert 는 화이트리스트**: `{question, cards, interpretation, user_id, session_id}` 외 컬럼은 받지 않음 (raw payload 그대로 insert 금지).
3. **CORS 는 정확 일치 + `.pages.dev` suffix 만**. `startsWith` 패턴은 우회 가능하므로 쓰지 말 것 (`workers/tarobot-api/index.js:16 isOriginAllowed`).
4. **시크릿은 코드에 없음**: Groq/Supabase 키는 Cloudflare Worker Settings (대시보드) + Supabase Edge Function Secrets 에만 존재. `API's.md` 는 `.gitignore` 차단 (로컬 메모용).

## 자동 배포 경로

| 변경 경로 | 배포 엔진 | 트리거 |
|---|---|---|
| `workers/**` | Cloudflare Workers Builds (Git 연동) | `main` push |
| `supabase/functions/**`, `supabase/config.toml` | GitHub Actions (`.github/workflows/deploy.yml`) | `main` push |
| 프론트 정적 파일 (루트) | Cloudflare Pages (Git 연동) | `main` push |

**중요**: 코드 수정 후 수동 배포 커맨드를 돌릴 필요 없음. `git push` 가 유일한 트리거. 로컬에서만 돌려보고 싶을 때는 `npm run dev:worker` (wrangler dev) / `npm run dev` (정적 서버).

## 개발/배포 커맨드

```bash
npm run dev              # 정적 파일 로컬 서빙 (프론트)
npm run dev:worker       # Worker 로컬 실행 (wrangler dev)
npm run deploy:worker    # 수동 Worker 배포 (Git 연동이 정석)
npm run deploy:functions # 수동 Edge Function 배포
npm run deploy:schema    # supabase db push (마이그레이션 있을 때)

# 최초 1회 로컬 셋업
npm run cf:login
npm run sb:login
SUPABASE_PROJECT_REF=uugspizbsnbzwwgqowel npm run sb:link
```

테스트 스위트는 **없음** (정적 프론트 + 작은 API). 추가 시 여기에 기입.

## Worker 엔드포인트 매핑

`workers/tarobot-api/index.js` 에서 pathname 분기로 라우팅. 대응 프론트 사용처:

| Path | Method | 프론트 호출처 | 인증 |
|---|---|---|---|
| `/api/interpret` | POST | `app.js:initiateReadingProcess` | ❌ |
| `/api/auth/me` | GET | `auth.js:initAuth` (세션 복원) | ✅ |
| `/api/auth/{signup,login,reset,update}` | POST | `auth.js:handle*` | 부분 |
| `/api/readings` | POST | `app.js:saveReadingToSupabase` | 선택 |
| `/api/my-readings` | GET | `auth.js:loadMyHistory` | ✅ |
| `/api/admin/{check,readings,users}` | GET | `admin.html`, `auth.js:checkAdminStatus` | 관리자 |

`auth.js` 가 세션 복원 목적으로 `/api/auth/update` 를 공백 body 로 호출하던 버그는 이미 `/api/auth/me` 로 분리됨 — 다시 update 로 돌리지 말 것.

## 프론트 상태머신 (`app.js`)

```
START → (Enter 또는 버튼) → handleStart
  → 셔플 애니메이션 → 휠 펼침
SELECTING → 10장 선택 → initiateReadingProcess (AI 호출 병렬)
  → morphCardsToGrid (슬롯→그리드 모핑)
  → revealCards (뒤집기) + appendInterpretation (텍스트)
READING → 결과 표시 + `/api/readings` 저장 → '새로운 점사 보기' 로 reload
```

`gameState` 는 `'START' | 'SELECTING' | 'READING'` 문자열. 타이머/애니메이션 경합 방지를 위해 `sleep(ms)` + `requestAnimationFrame` 으로 시퀀싱됨. 이 안무는 손대면 금방 깨지므로 — UI 수정 시 **브라우저에서 직접 확인**할 것.

## 커스텀 도메인 / CORS 추가 시

새 도메인이 생기면 `workers/tarobot-api/index.js` 의 `ALLOWED_ORIGINS` 에 **정확 일치 문자열**로 추가 후 push. Pages 프리뷰(`*.pages.dev`) 는 `ALLOWED_ORIGIN_SUFFIXES` 로 이미 커버됨.

## 데이터 고정값

`data.js` 의 `tarotDeck` (78장) / `spreadPositions` (10장 켈틱크로스) 는 서버에도 보관되지 않음 — 프론트가 카드 객체를 Worker 로 그대로 전달하고, Worker 가 프롬프트에 박아 Groq 로 보냄. 카드 meta 변경은 `data.js` 만 수정하면 전 파이프에 반영됨.

## graphify-ts

This project has a graphify-ts knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- Use only Node.js / TypeScript tooling in this repository. Do not install or invoke Python, pip, a legacy Python package, or a deleted reference checkout.
- After modifying code files in this session, refresh graph artifacts with this repository's TypeScript graphify-ts workflow only.
