# Tarobot — AI 타로 마스터

켈틱 크로스 배열 기반 AI 타로 리딩 웹앱. 정적 프론트 + Cloudflare Worker + Supabase Edge Functions 구성.

## 아키텍처

```
브라우저 (정적 HTML/JS)
  └─ fetch ─▶ Cloudflare Worker (tarobot-api)
              ├─ Groq API (AI 리딩)
              └─ Supabase (Auth, DB, Edge Functions)
```

| 레이어 | 역할 |
|---|---|
| `index.html` / `app.js` / `auth.js` / `api.js` / `utils.js` / `data.js` / `style.css` | 프론트 (정적) |
| `admin.html` | 관리자 대시보드 |
| `workers/tarobot-api/` | API 게이트웨이. Groq 중계 + Supabase 중계 + 권한 체크 |
| `supabase/functions/` | Edge Functions (Auth 중계, 리딩 저장) |
| `supabase/schema.sql` | DB 스키마 + RLS 정책 |

## 로컬 실행

```bash
npm run dev   # 정적 파일 서빙 (http://localhost:3000)
```

프론트는 `api.js` 의 `DEFAULT_WORKER_URL` 로 배포된 Worker에 직접 붙음.
로컬에서 다른 Worker URL을 쓰려면 HTML 상단에 아래 스니펫 추가:

```html
<script>window.CONFIG = { WORKER_URL: 'http://127.0.0.1:8787' };</script>
```

## 시크릿 등록

`API's.example.md` 참고. 모든 키는 런타임 환경변수/시크릿으로만 주입:

- **Cloudflare Worker** (`wrangler secret put ...`)
  - `AI_API_KEY` — Groq API 키
  - `AI_MODEL_NAME` — 예: `openai/gpt-oss-120b`
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
- **Supabase Edge Functions** (Dashboard > Settings > Edge Functions > Secrets)
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`

> ⚠️ `API's.md` 는 `.gitignore` 로 차단되어 있음. 절대 커밋 금지.

## 배포

### 자동 배포 — 이원화

| 대상 | 트리거 | 담당 |
|---|---|---|
| Cloudflare Worker | push (자동) | **Cloudflare Workers Builds** (네이티브 Git 연동) |
| Supabase Edge Functions | push (자동) | GitHub Actions (`.github/workflows/deploy.yml`) |

**왜 이원화**: Cloudflare 는 자체 Git 연동으로 시크릿을 대시보드에 두고 관리 가능 (안전·단순). Supabase 는 비슷한 기능이 없어서 Actions 로 처리.

#### 1) Cloudflare Workers Builds 설정 (최초 1회)

Cloudflare Dashboard → **Workers & Pages → `taroai` → Settings → Build → Connect** 클릭 후:

| 항목 | 값 |
|---|---|
| Repository | `RealStoryJun/Tarobot` |
| Branch | `main` |
| Root directory | `/` (repo root) |
| Build command | `npm install` |
| Deploy command | `npx wrangler deploy --config workers/tarobot-api/wrangler.toml` |
| Path filters (optional) | `workers/**` |

시크릿은 이미 Worker Settings → Variables 에 등록되어 있어 빌드 시 자동 주입 (`AI_API_KEY`, `AI_MODEL_NAME`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`).

#### 2) Supabase Edge Functions — GitHub Actions

GitHub → **Settings → Secrets and variables → Actions** 에 2개만 등록:

| 이름 | 값 |
|---|---|
| `SUPABASE_ACCESS_TOKEN` | https://supabase.com/dashboard/account/tokens |
| `SUPABASE_PROJECT_REF` | 예: `uugspizbsnbzwwgqowel` |

`supabase/functions/**` 또는 `supabase/config.toml` 변경 시 자동 배포. `workflow_dispatch` 로 수동 재배포도 가능.

### 수동 배포 (로컬)

```bash
npm run cf:login            # 최초 1회 — Cloudflare 로그인
npm run sb:login            # 최초 1회 — Supabase 로그인
SUPABASE_PROJECT_REF=uugspizbsnbzwwgqowel npm run sb:link

npm run deploy:worker       # Worker만
npm run deploy:functions    # Edge Functions만
npm run deploy:all          # 전부
npm run deploy:schema       # DB 마이그레이션 (supabase/migrations 가 있을 때)
```

### DB 스키마 & 관리자

- 최초 1회: `supabase/schema.sql` 을 Supabase SQL Editor 에서 실행
- 관리자 역할 부여: `supabase/admin_setup.sql` 참고
- 프론트 정적 호스팅: Cloudflare Pages / 정적 호스팅 아무거나

## 주요 엔드포인트 (Worker)

| Method | Path | 인증 | 설명 |
|---|---|---|---|
| POST | `/api/interpret` | ❌ | AI 타로 해석 생성 |
| POST | `/api/auth/{signup,login,reset,update}` | 부분 | Supabase Auth 중계 |
| GET  | `/api/auth/me` | ✅ | 현재 세션 유저 |
| POST | `/api/readings` | 선택 | 리딩 저장 (비회원은 session_id 사용) |
| GET  | `/api/my-readings` | ✅ | 내 리딩 이력 |
| GET  | `/api/admin/check` | ✅ | 관리자 여부 확인 |
| GET  | `/api/admin/readings?page=N` | 관리자 | 전체 리딩 목록 |
| GET  | `/api/admin/users` | 관리자 | 유저 통계 (RPC: `get_user_stats`) |

## 보안 메모

- 클라이언트 저장 payload 는 Edge Function에서 `{question, cards, interpretation}` 화이트리스트.
- `user_id` 는 서버가 JWT 검증 후에만 주입. 클라이언트 공급분은 무시.
- CORS origin 은 정확 일치 (`ALLOWED_ORIGINS`).
- RLS 로 회원/세션 격리. `session_id` 는 요청 헤더에서만 신뢰.
