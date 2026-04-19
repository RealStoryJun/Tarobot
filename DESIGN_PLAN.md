# Tarobot 디자인 리파인 플랜

_작성일: 2026-04-20 · 스코프: `style.css`, `index.html`, `admin.html`, `app.js` 애니메이션_

## 0. 목표

현재의 **신비·차분·골드×딥퍼플** 정서는 유지하되:
1. **애니메이션 연속성** — 페이즈 간 단절 없이 하나의 의식(ritual)처럼 흐르게
2. **타이포 체계** — 크기·행간·가중치의 규칙 부재 → 모듈러 스케일 기반으로 재정렬
3. **톤앤매너 일관성** — 3종 파편화된 이징/컬러/버튼 스타일을 하나의 언어로 수렴

**훼손하지 않을 것 (재료):**
- 배경 (`BG/BGIMG.png`, 모바일 `BGmobile.png`)
- 카드 뒷면 SVG, 카드 일러스트 (78장)
- 핵심 의식 흐름: 질문 → 셔플 → 선택 → 켈틱크로스 공개 → 해석
- 금색 `#f0e68c` × 딥퍼플 `#0c0a18` 메인 팔레트

---

## 1. 현재 진단 (증거 기반)

### 1.1 타이포 스케일 — 10+ 개 사이즈가 서로 무관하게 존재

| 위치 | 사이즈 | 문제 |
|---|---|---|
| `h1` | `clamp(1.5rem, 5vw, 2.5rem)` | 스케일 ratio 없이 설정 |
| `p` | `clamp(0.85rem, 2vw, 1rem)` | 규칙 없는 clamp |
| `.interpretation-item .pos-title` | `0.55rem` (≈ 8.8px) | **한글 가독성 하한** 미달 |
| `.interpretation-item .meaning-line` | `0.65rem` | 2줄 클램프로 정보 손실 |
| 모바일 `.final-card-name` | `0.65rem` | 이름 잘림 현상 유발 |
| 마크다운 `h1/h2/h3` | `1.5/1.25/1.1rem` | 본문과 분리된 스케일 |
| 버튼류 | 지정 없음 → Tailwind 기본 | 맥락별 들쭉날쭉 |

→ 한글 UI 의 최소 가독선은 **12px (0.75rem)**. 현재 55-65% 의 텍스트가 그 아래.

### 1.2 색상 — 톤 이탈 6곳 확인

| 값 | 어디서 | 이탈 근거 |
|---|---|---|
| `#2563eb` (blue-600) | `#controlButton`, `#newReading` | 신비·오컬트 톤에 플랫 Tailwind 블루가 이질적 |
| `bg-yellow-300` | `#nav-join-btn` hover 원본 | 금색 톤에 개나리색 hover 충돌 |
| `#ffd700` | 마크다운 `h2` | 메인 `--accent-gold #f0e68c` 와 거의 같지만 미묘하게 다른 금색 |
| `#ef4444` (red-400) | 로그아웃 버튼 | 경고 색상이지만 전체 팔레트 밖 |
| `#94a3b8`/`#cbd5e1`/`#e0e0e0`/`#e2e8f0` | 본문 텍스트 4곳 | 회색 단계가 토큰화 안 돼서 제각각 |
| `rgba(10,15,35)` vs `rgba(15,25,55)` | interpretation-item 배경/호버 | 미세하게 다른 블루 — 기준 없음 |

### 1.3 애니메이션 이징·듀레이션 — 5종 이상 혼용

```
cubic-bezier(0.4, 0, 0.2, 1)        Material standard
cubic-bezier(0.19, 1, 0.22, 1)      Quart easeOut
cubic-bezier(0.5, 0, 0.5, 1)        임의
cubic-bezier(0.34, 1.56, 0.64, 1)   Back overshoot
cubic-bezier(0.165, 0.84, 0.44, 1)  임의
ease / ease-out / linear            프리셋 혼입
```

듀레이션: 0.2 / 0.3 / 0.4 / 0.5 / 0.7 / 0.8 / 1 / 1.2 / 1.5 s — **9단계**. 타로의 "호흡" 리듬이 부재.

### 1.4 연속성 단절 지점 (`app.js` handleStart 시퀀스)

```
T=0ms   initialUiGroup opacity→0  (500ms)
T=200   questionFocusDisplay 준비
T=800   focus 표시 지속 1000ms   ← 첫 번째 정체
T=2400  focus fade out 600ms
T=3000  selectionZone 등장 + shuffling 시작
T=4500  shuffling fade 1000ms    ← 셔플 끝과 휠 시작 사이 블랙박스 200ms
T=5500  wheel 등장 1000ms
T=6700  slots 등장 + instruction 800ms
                                 ← 여기까지 ~7.5초. 유저가 "지금 뭐 하는 중?" 느낌 받는 구간
```

각 구간은 `sleep(ms)` + `classList` 토글로 이어지지만 **시각적 연결 모티프(공통 움직임·공통 요소)가 없음**. 셔플덱이 작아지며 사라지고 → 휠이 새로 나타남 → 슬롯이 튀어나옴. "같은 대상의 상태 변화"가 아니라 "다른 요소의 교체" 로 읽힘.

### 1.5 컴포넌트 스타일 믹스

| 컴포넌트 | 배경 방식 | 결론 |
|---|---|---|
| `.reading-text-side` | Glassmorphism (`backdrop-filter: blur`) | ✅ 신비 톤 일치 |
| `.interpretation-item` | 반투명 블루 `rgba(10,15,35,0.3)` | ✅ 일관 |
| `.auth-modal` | 단색 `var(--deep-purple)` | ❌ Glassmorphism 아님 |
| 인증 모달 오버레이 | `rgba(0,0,0,0.85) + blur(8px)` | ✅ |
| `.card-slot` | Glassmorphism | ✅ |
| `#controlButton` | 플랫 블루 | ❌ 완전 이탈 |
| `#newReading` | 플랫 블루 | ❌ 이탈 |
| `.auth-btn` | 솔리드 금색 | ⚠️ OK지만 hover 옐로 변경은 부조화 |

---

## 2. 원칙 (결정 기준)

1. **"의식(ritual) 비주얼 언어"**: 모든 전환은 "카드(1)가 상태를 바꾸는 것" 또는 "빛/별/안개가 매개하는 것" 두 메타포로만 표현. 팝/슬라이드/페이드 교체는 지양.
2. **연속 모티프**: 매 페이즈에 걸쳐 **같은 시각 요소**(금색 원, 별 파티클, 카드 뒷면 텍스처) 중 하나는 반드시 이어진다. 단절 대신 "변태(metamorphosis)".
3. **한글 UX 가독 하한 준수**: 본문 14px (0.875rem) 이상, 보조텍스트 12px (0.75rem) 이상. 모바일도 동일.
4. **3이 최대**: 한 페이즈에 보이는 컴포넌트 유형 3종 이하. 색상 변주도 3단계 이내.
5. **토큰 first**: 매직넘버 추가 금지 → 디자인 토큰(CSS variable) 통해서만 조립.

---

## 3. 페이즈별 작업 단위

각 페이즈는 **독립적으로 머지 가능**하도록 쪼갬. 실패 시 되돌리기 쉽게.

### 🌑 Phase 1 — 디자인 토큰 정리 (1일, 위험도 낮음)

**목표:** 파편화된 값들을 `:root` 변수로 결집. CSS 외 파일 수정 없음.

**작업:**
- `style.css :root` 에 다음 토큰 추가:
  ```css
  /* 타이포 — 1.25 minor third 스케일 */
  --font-size-xs:   0.75rem;    /* 12px — 보조 */
  --font-size-sm:   0.875rem;   /* 14px — 본문 */
  --font-size-base: 1rem;       /* 16px — 기본 */
  --font-size-md:   1.25rem;    /* 20px */
  --font-size-lg:   1.5625rem;  /* 25px */
  --font-size-xl:   1.953rem;   /* 31px */
  --font-size-display: 2.441rem;/* 39px — h1 */

  /* 행간 */
  --lh-tight: 1.25;
  --lh-base: 1.6;
  --lh-relaxed: 1.8;

  /* 컬러 — 신비주의 3톤 */
  --c-gold:       #f0e68c;   /* 메인 액센트 */
  --c-gold-soft:  #d4c76a;   /* 호버/보더 — 톤 다운 */
  --c-gold-glow:  rgba(240, 230, 140, 0.35);
  --c-bg:         #0c0a18;   /* 딥 퍼플 */
  --c-bg-raised:  #15122b;   /* 카드/모달 베이스 */
  --c-bg-ink:     rgba(10, 15, 35, 0.35);  /* 해석 카드 */
  --c-text:       #e8e6f2;   /* 본문 (순수 흰색 X) */
  --c-text-soft:  #9ca3b5;   /* 보조 */
  --c-text-dim:   #6b7390;   /* 비활성 */
  --c-danger:     #f3a3a3;   /* 경고 — 톤 내리기 */

  /* 유리 효과 */
  --glass-bg:     rgba(255, 255, 255, 0.035);
  --glass-border: rgba(240, 230, 140, 0.12);
  --glass-blur:   blur(14px);

  /* 이징 — 오직 3종 */
  --ease-out:    cubic-bezier(0.22, 1, 0.36, 1);  /* 모든 등장 */
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);    /* 상태 변화 */
  --ease-ritual: cubic-bezier(0.19, 1, 0.22, 1);  /* 의식적 전환 — 느리게 떨어지는 */

  /* 듀레이션 — 4단계 */
  --d-snap: 200ms;     /* hover, 작은 반응 */
  --d-base: 500ms;     /* 일반 전환 */
  --d-slow: 900ms;     /* 페이즈 전환 */
  --d-ritual: 1400ms;  /* 카드 모핑, 의식적 순간 */

  /* 간격 — 1.5 ratio */
  --s-1: 0.25rem;
  --s-2: 0.5rem;
  --s-3: 0.75rem;
  --s-4: 1rem;
  --s-5: 1.5rem;
  --s-6: 2.25rem;
  --s-7: 3.375rem;

  /* 라운딩 */
  --r-sm: 8px;
  --r-md: 14px;
  --r-lg: 20px;
  --r-xl: 28px;
  ```
- 기존 `--accent-gold`, `--deep-purple` 등은 위 신규 토큰으로 **alias** 유지 (점진 교체용)

**산출물:** 전체 CSS 는 리팩토링 없이 토큰만 추가된 상태. 시각적 변화 거의 없음.

---

### 🌒 Phase 2 — 타이포그래피 재구성 (1일, 위험도 낮음)

**목표:** 크기·가중치·행간을 토큰 기반 6단계로 수렴. 가독성 하한 확보.

**작업:**
- `h1`, `p` 등 기본 선택자를 토큰 기반으로 교체
- `.interpretation-item` 계열 사이즈 상향:
  - `.pos-title`: `0.55rem → var(--font-size-xs)` (12px) + `letter-spacing: 0.08em`
  - `.card-name-line`: `0.85rem → var(--font-size-sm)` (14px) + `font-weight: 700`
  - `.meaning-line`: `0.65rem → var(--font-size-xs)` (12px) + `-webkit-line-clamp: 3` (2 → 3)
- 마크다운 본문 (`#interpretationText`, `#recommendationText`):
  - `h1/h2/h3` 를 토큰 스케일 `lg/md/base` 로 교체
  - `line-height: var(--lh-relaxed)` 로 호흡 확보
- 한글 body 가중치: `Gowun Dodum` 은 레귤러만 있으므로 강조는 **크기·색**으로만 (bold 의존 금지)
- `font-feature-settings: "kern" 1, "palt" 1;` 한글 공간 최적화

**검증:** Chrome Lighthouse → Accessibility "Tap targets"·"Document has a contrast" 점수 유지/상승 확인.

---

### 🌓 Phase 3 — 애니메이션 연속성 (2-3일, 위험도 중간)

**목표:** 페이즈 간 "같은 것이 변하는" 감각 부여. 이징·듀레이션을 토큰으로 단일화.

#### 3.1 공통 모티프 도입

**"별빛 커튼 (star veil)"** 레이어 추가:
- `body::after` 에 고정 SVG 파티클 레이어 (금색 점 7-12개, 랜덤 위치)
- `@keyframes shimmer` 로 12-18초 주기 opacity 0.2 ↔ 0.6 호흡
- 각 페이즈 전환 시 파티클 개수·속도가 미세하게 변화 (CSS 변수로 제어)

이 레이어는 **모든 페이즈에 걸쳐 계속 보임** → 연속성 앵커.

#### 3.2 이징·듀레이션 전면 교체

`style.css` 의 모든 `transition` / `animation-duration` 을 아래 규칙으로 재작성:

| 현재 | 교체 |
|---|---|
| `0.2-0.3s ease` | `var(--d-snap) var(--ease-out)` |
| `0.5-0.8s cubic-bezier(...)` | `var(--d-base) var(--ease-in-out)` |
| `0.8-1.2s` 페이즈 전환 | `var(--d-slow) var(--ease-ritual)` |
| `1.2-1.5s` 모핑 | `var(--d-ritual) var(--ease-ritual)` |

`app.js` 의 `sleep(ms)` 값도 동일 토큰 기반으로 상수화:
```js
const TIMING = {
    SNAP: 200, BASE: 500, SLOW: 900, RITUAL: 1400
};
```

#### 3.3 핵심 시퀀스 리디자인 — `handleStart`

**Before** (정체/단절 지점 3곳):
```
질문 fade out → focus overlay in/out → selection zone 등장 → shuffling → wheel → slots
```

**After** (한 호흡으로):
```
1. 질문 요소가 중앙 focus 로 "응축"됨 (scale down 0.9 + blur 0→4px). sleep SLOW
2. 질문이 유지되는 동안 **같은 위치**에서 카드덱이 "생성"됨 (scale up from 0.2 + glow). sleep RITUAL
3. 덱이 shuffling (기존 애니). 끝나며 덱이 그대로 **확장 → 휠로 펼쳐짐** (덱 카드 5장이 휠 카드 78장으로 "증식"하는 착시). sleep RITUAL
4. 휠이 회전 시작, 하단에서 슬롯이 "별가루가 내려앉듯" 등장 (stagger 50ms * 10).
```

구현 포인트:
- 덱 → 휠 변태: 덱 5장이 `transform: scale(1.5) rotate(360deg)` 하면서 fade out 되는 동시에 휠이 `scale(0) → scale(1)` 로 들어옴. 두 애니의 중심점이 동일해야 **같은 것의 변화**로 읽힘.
- 슬롯 등장 스태거: `animation-delay: calc(var(--i) * 50ms)` 로 1번부터 10번까지 순차.
- `focusQuestionDisplay` 는 제거하거나, 배경 블러로 남아 있다가 서서히 흐려지는 "잔상"으로.

#### 3.4 카드 공개(`revealCards`) 개선

현재: 플립 후 텍스트 등장.
개선:
- 플립 직전에 `box-shadow` 로 금색 글로우 짧게 번쩍 (duration 200ms) → "계시" 느낌
- 각 카드 플립 완료 시 해당 `interpretation-item` 이 **카드 위치로부터 이어지듯** 텍스트 사이드로 슬라이드 (현재는 각자 페이드). 거리가 멀면 FLIP 기법 축소 버전 적용.

#### 3.5 (선택) View Transitions API 점진 도입

Chrome/Edge/Firefox 144+ 대응. `@supports (view-transition-name: a)` 로 progressive enhancement:
- 카드 선택 → 슬롯 이동: `view-transition-name: card-N` 자동 모핑
- 미지원 브라우저는 기존 `morphCardsToGrid` 수동 로직 폴백

이 항목은 Phase 3 말미에 **실험 트랙**으로 진행. 체감 효과 확인 후 정식 채택 여부 결정.

---

### 🌕 Phase 4 — 컴포넌트 톤앤매너 정렬 (1일, 위험도 낮음)

**목표:** 버튼·모달·해석 패널을 단일 비주얼 언어로.

**작업:**

#### 4.1 버튼 통일 (3 variant 만 존재)

```css
.btn-primary   /* 금색 계열 — 주요 CTA */
.btn-secondary /* 유리 + 금색 보더 — 보조 */
.btn-ghost     /* 텍스트만 + hover 밑줄 — 최소 강조 */
```

- `#controlButton`, `#newReading` → `.btn-primary` (파란색 완전 제거)
  - 채움: `linear-gradient(135deg, var(--c-gold), var(--c-gold-soft))`
  - 텍스트: `var(--c-bg)` (딥 퍼플)
  - hover: `box-shadow: 0 0 24px var(--c-gold-glow)` + `transform: translateY(-1px)`
- `#nav-login-btn` → `.btn-ghost`
- `#nav-join-btn` → `.btn-secondary`
- `.auth-btn` → `.btn-primary` (재사용)
- `.page-btn`(admin) → `.btn-secondary`

#### 4.2 모달 Glassmorphism 통일

`.auth-modal`:
- 단색 배경 → `background: rgba(21, 18, 43, 0.6)` + `backdrop-filter: var(--glass-blur)`
- 금색 보더 0.3 → `var(--glass-border)`
- 내부 여백 `var(--s-6)` 로 재조정

#### 4.3 해석 카드 & 상태 배지 통일

`admin.html` 의 `.badge-member`/`.badge-anon` 팔레트 재정의:
- member: 금색 계열 (`--c-gold` 20% alpha)
- anon: 회색 (`--c-text-soft` 20% alpha)
- 플랫 블루 파란배지 → 제거

`.stat-box` linear-gradient 도 금색 기반으로 교체.

#### 4.4 로그아웃 버튼 톤 조정

`text-red-400` → `var(--c-danger)` (톤 다운된 `#f3a3a3`). 경고 성격 유지하되 금속 팔레트와 조화.

---

### ✧ Phase 5 — 디테일 폴리싱 (1일, 위험도 낮음)

**목표:** 완성도 있는 "숨겨진 디테일" 층.

**작업:**

#### 5.1 앰비언트 모션

- 카드 선택 대기 중 `#card-wheel` 회전에 미세한 `filter: drop-shadow(...)` 펄스 (주기 6초)
- `.reading-text-side::after` 의 `✧` 가 5초 주기로 `opacity: 0.05 ↔ 0.12` 호흡
- 메인 h1 "AI 타로 마스터" 에 `text-shadow` 3겹 깊이감 + 4초 주기 `opacity: 0.92 ↔ 1` 호흡

#### 5.2 마이크로 인터랙션

- 카드 슬롯 hover: 현재 `translateY(-5px)` → `translateY(-3px) + rotate(-0.5deg)` (미세한 물성)
- 질문 input focus: 현재 ring → 금색 글로우 + `::placeholder` fade out
- 스크롤바: 두께 4→3px, opacity 0.3 → hover 시 0.7

#### 5.3 로더 교체

현재 `.loader` (테두리 회전) → 오각별 회전 + 펄스 (`@keyframes starspin` + `animation-timing-function: linear`).

#### 5.4 에러/로딩 상태 언어 통일

- "타로 마스터가 당신의 카드를 깊이 읽고 있습니다..." 등 상태 문구의 이탤릭·`var(--c-text-soft)` 표준화
- 모든 alert 를 `showStatus()` 헬퍼 경유로 변경 (현재 `alert()` 혼재)

---

### 🔭 Phase 6 — 접근성·성능 하드닝 (0.5일, 위험도 낮음)

- `prefers-reduced-motion: reduce` 미디어쿼리 추가 → 모든 애니메이션을 `duration: 0.01ms` 로 단축
- `prefers-contrast: more` 시 `--c-text` 를 순백으로 상향
- 애니메이션 `will-change` 정리 (과다 선언 방지)
- 큰 배경 이미지 `fetchpriority="high"` / `decoding="async"`
- `@layer` 로 스타일 계층 분리 (reset → tokens → base → components → utilities)

---

## 4. 우선순위 & 일정 제안

| 순서 | 페이즈 | 이유 |
|---|---|---|
| 1 | **Phase 1 토큰** | 이후 모든 작업의 기반. 시각 변화 없음 = 안전. |
| 2 | **Phase 2 타이포** | 가독성 문제는 즉시 체감. 독립 머지 가능. |
| 3 | **Phase 4 컴포넌트** | 파란 버튼 등 이탈 요소 제거로 톤 즉시 정리. |
| 4 | **Phase 3 애니메이션** | 가장 리스크 크지만 감동 포인트. 3.1→3.2→3.3→3.4 순. |
| 5 | **Phase 5 폴리싱** | 3 이후에 올리는 디저트. |
| 6 | **Phase 6 하드닝** | 마지막에 일괄. |

총 예상: **6-7 일** (풀타임 기준). 분할 머지로 진행하며 각 페이즈 후 실제 브라우저에서 체감 점검.

---

## 5. 성공 지표 (주관·객관 병행)

**객관:**
- 본문 폰트 12px 미만 0건
- 이징·듀레이션 리터럴 0건 (모두 토큰)
- Lighthouse Accessibility ≥ 95
- Chrome DevTools Rendering → Paint flashing 으로 리플로우 구간 추적, 페이즈 전환 중 layout shift < 0.05

**주관:**
- 첫 방문 유저가 "질문 입력 → 결과" 까지 **중간에 어색한 정지 없이** 한 호흡으로 흘러갔다고 느끼는가
- 마스터의 조언 영역에 머무르는 시간이 체감 증가 (가독성 체크)
- 모바일에서도 데스크탑과 **같은 리듬**으로 느껴지는가

---

## 6. 회귀(regression) 방지 룰

수정 중 지켜야 할 것:
- **기존 카드 이미지·배경 이미지 건드리지 말 것.**
- `app.js` 의 `gameState` 상태 머신(`START/SELECTING/READING`) 의미 바꾸지 말 것.
- Worker API 호출 흐름(`apiCall`) 유지.
- 각 페이즈 끝에 **실제 브라우저**에서 리딩 한 번 끝까지 돌려보기. 자동 테스트 없음 — 육안 검증이 유일.
- 수정 후 `graphify . --update` 돌려 그래프 갱신.

---

## 7. 참고 자료 (조사에서 차용한 개념)

- **FLIP 기법** — 현재 `morphCardsToGrid` 가 이미 이 방식. 공식 명칭·원칙 적용: [css-tricks.com/animating-layouts-with-the-flip-technique](https://css-tricks.com/animating-layouts-with-the-flip-technique/)
- **View Transitions API** — Baseline (2025.10 Firefox 144 합류) 크로스 브라우저. Phase 3.5 후보: [developer.mozilla.org/en-US/docs/Web/API/View_Transition_API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)
- **Shared Element Transitions** — "object changed state, not identity" 원칙: [css-tricks.com/shared-element-transitions](https://css-tricks.com/shared-element-transitions/)
- **Modular Type Scale** — 1.25 (minor third) ratio 채택: [modularscale.com](https://www.modularscale.com/)
- **Dark Mode Typography** — 순백×순흑 회피·본문 톤 다운 원칙: [IxDF Readability](https://ixdf.org/literature/topics/readability-in-ux-design)
- **Spring / linear() timing** — 필요 시 Phase 3 말미 검토 (현 쿠빅 베지어 체계로 충분 판단): [joshwcomeau.com/animation/linear-timing-function](https://www.joshwcomeau.com/animation/linear-timing-function/)
- **UI Animation 2026** — "better motion logic, continuity · depth · spatial cues": [ripplix.com/blog/ultimate-ui-animation-guide-for-2026](https://www.ripplix.com/blog/ultimate-ui-animation-guide-for-2026)

---

## 8. 다음 액션

1. 이 문서 리뷰 → 페이즈 순서/범위 확정
2. 확정 후 **Phase 1 시작** — `style.css` 상단에 토큰 블록 추가 + alias 처리
3. Phase 1 머지 후 시각 회귀 없음을 확인 → Phase 2 진행

각 페이즈 머지는 별도 커밋. 필요 시 되돌리기 쉬움.
