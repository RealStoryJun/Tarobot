# 리팩토링 플랜 & 실행 기록

_작성: 2026-04-20 · 트리거: 30 페이즈 직후 발견된 5개 회귀 버그 + 전반 재검토 요구_

## 1. 진단 — 왜 회귀가 났는가

이번 세션 5개 버그의 공통 패턴:

| 버그 | 근본 원인 | 교훈 |
|---|---|---|
| BG 미표시 | P24 크리티컬 CSS 가 `html, body` 모두 `background: #0c0a18` 로 덮어 body::before 가리움 | 캔버스 전파(body bg → canvas) 매커니즘 암묵 의존 — **명시 주석 필요** |
| 스크롤 불가 | 같은 크리티컬 CSS 의 `html { overflow: hidden }` 가 `body.reading-mode { overflow-y: auto }` 를 무효화 | 스크롤 제어는 **body 단 한 곳에서만**, html 은 건들지 말 것 |
| 셔플 위치 위쪽 | `transform: translateY(100px)` 를 연속성 수정 중 제거 → 공간감 붕괴 | 시각 의도(의식 공간 구성) 는 **코드에 주석으로** 기록 |
| 플립 갑자기 팍 | `backface-visibility: hidden` 의 50% 전환 특성이 "팍" 느낌을 유발 | 신비 톤 UI 에는 3D 플립보다 **페이드 기반 reveal** 이 더 어울림 |
| 다시섞기 UX 마찰 | 필요 없는 기능을 추가함 | 기능 추가 전 **필요성 확인** 필수 |

⇒ 공통 주제: **"암묵 의존 구조"가 명시되지 않아 후속 편집이 깨뜨림**.

## 2. 재발 방지 원칙

1. **단일 책임 소스**: `overflow` 는 body 에서만, 배경색은 html 에서만, 애니메이션 듀레이션은 토큰에서만
2. **시각 의도 주석**: "왜 이 값인가" 를 코드 옆에 남김 (예: "의식 공간 하단 예약")
3. **기능 추가는 사용자 요청 선행**: 투기성 기능(reshuffle 등) 금지
4. **3D 효과는 최소화**: 신비 톤은 3D 보다 2D 페이드 + 빛이 더 적합

## 3. 전체 리팩토링 체크리스트

### 3.1 즉시 실행 (이번 세션)
- [x] **H01**: 5개 버그 수정 (commit 별도)
- [ ] **H02-A**: `REFACTOR_PLAN.md` 작성 (이 문서)
- [ ] **H02-B**: `anim.js` 에 긴 애니메이션 함수 추출 (morphCardsToGrid, revealCards, animateCardSelection, renderWheel, initSelectionArea)
- [ ] **H02-C**: `app.js` 의 `elements` 참조 패턴을 **lazy getter** 로 바꿔서 getElements() 호출 전에도 접근 가능하게
- [ ] **H02-D**: `style.css` 상단에 **레이어 / 의도 가이드 주석** 추가 (다음 편집자를 위한 지도)
- [ ] **H02-E**: `CLAUDE.md` 갱신 — 이번에 확정된 "암묵 의존" 목록 명시

### 3.2 다음 세션 권장 (본 세션 범위 밖)

- **CSS 분리**: `style.css` (현재 ~1100 줄) → `tokens.css` / `base.css` / `layout.css` / `components.css` / `animations.css`
- **app.js 분리**: 애니메이션 / 이벤트 / 상태 머신 3개 파일로 (현재도 한 파일이지만 로직이 많음)
- **타입 안전**: JSDoc `@typedef` 도입 → IDE 도움말 활성
- **테스트**: Playwright smoke (홈 → 질문 → 카드 선택 → 해석 표시) 1건만이라도
- **admin.html 모듈화**: 인라인 script 를 별도 `admin.js` 로
- **data.js 카드 인덱스**: 카드 조회용 Map 추가 (이름 → 객체)

### 3.3 장기 과제
- i18n (ko / en)
- PWA 오프라인 지원 (Service Worker)
- Rate limiting (Cloudflare KV)
- Groq 캐싱 (질문 + 카드셋 해시 키)
- 공유 링크 (`/r/:id`)
- PDF 내보내기

## 4. 이번 세션 실행 결과

### 4.1 5개 버그 수정 요약

| # | 문제 | 해결 |
|---|---|---|
| 1 | BG 미표시 | `html` 만 솔리드 배경, `body` 는 transparent → `body::before` 가 BG 이미지 표시 가능 |
| 2 | 셔플 위쪽 | `translateY(80px)` 초기 + `is-ascending` 클래스로 중앙 상승 애니 |
| 3 | 다시섞기 버튼 | 삭제 (HTML/CSS/JS 전부) |
| 4 | 플립 팍 | `backface-visibility` 제거 → 뒷면 opacity + scale 페이드 → 앞면 자연 reveal |
| 5 | 스크롤 불가 | 크리티컬 CSS 에서 `html { overflow: hidden }` 제거 → body.reading-mode 정상 동작 |

### 4.2 회귀 방지 코드 주석 (추가됨)

- `style.css` body 블록에 **"body 는 투명, html 만 솔리드"** 주석
- `#shuffling-container` 에 **"초기 80px 아래, is-ascending 으로 중앙 상승"** 주석
- `.card-face--back` 에 **"플립 시 페이드+스케일로 앞면 reveal"** 주석

### 4.3 startNewReading 보강

두 번째 리딩 진입 시 상태 누락 방지:
- `shufflingContainer` classes/inline style 리셋
- `cardWheelContainer` + `cardWheel` DOM 정리
- `selectedCardsArea` innerHTML 비우기
- `app` / `selectionContainer` inline style 원복

---

## 5. 암묵 의존 목록 (향후 유지)

**절대 바꾸지 말 것** — 이 중 하나라도 어기면 BG/스크롤/플립이 깨짐:

1. `html` 은 솔리드 배경(`var(--c-bg)`), `body` 는 **transparent**
2. `overflow: hidden` 은 **body 에만**, html 에는 없음
3. `body.reading-mode { overflow-y: auto }` 가 스크롤 on 스위치
4. `body::before` (BG 이미지) 는 `z-index: -1` + `body.bg-active` 로 등장
5. `body::after` (별빛 커튼) 는 `z-index: 0` + `pointer-events: none` 필수
6. `gameState` 3단계: `START | SELECTING | READING`
7. 카드 플립은 **container 회전 없음** — back face 페이드만
8. 셔플 → 휠 전환은 **같은 중앙** 에서 오버랩 (position absolute inset 0)
9. Master's Insight 는 **처음부터 렌더됨** (display:none 금지), 텍스트만 크로스페이드

## 6. 다음 액션

이 문서 커밋 후 H02-B 이후 실행.
