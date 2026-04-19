# Tarobot Celtic Cross 10-card Layout Refactoring Plan

최근 10장짜리 켈틱 크로스 업데이트 이후 발생한 레이아웃 불안정성(갑작스런 상단 이동, 스크롤 먹통)을 해결하기 위한 전체 리팩토링 계획입니다.

## 1. 문제 분석 (Root Cause Analysis)
- **레이아웃 고정**: `style.css`에서 `body`와 `.stage-container`에 적용된 `overflow: hidden`과 `height: 100dvh`가 10장의 카드와 긴 해석 텍스트를 감당하지 못하고 컨텐츠를 잘라버림.
- **전이 지터(Jitter)**: `app.js`의 `initiateReadingProcess`에서 `position: absolute`와 `top: 50%`를 사용하여 중앙 정렬을 시도하는 과정에서 레이아웃 계산이 꼬여 상단으로 점프하는 현상 발생.
- **스크롤 잠금**: `index.html`의 `reading-layout`에 적용된 `overflow-hidden`이 자식 요소의 스크롤을 방해함.

## 2. 제안하는 변경 사항

### [A] @Planner (System Architect) - 기술 명세

#### [CSS] 스타일 시스템 복구 (`style.css`)
- `body` 및 `.stage-container`: `overflow: hidden` 제거, `min-height: 100dvh`로 변경하여 자연스러운 스크롤 허용.
- `.reading-layout`: `overflow: hidden` 제거 및 내부 요소들이 높이에 따라 유동적으로 늘어나도록 수정.
- `.celtic-cross-grid`: 10장 배치(4x4 그리드)의 시각적 균형 최적화 및 모바일 대응 강화.
- `.reading-text-side`: 고정 높이(`max-height: 85vh`) 대신 컨텐츠에 맞춰 확장되도록 수정.

#### [JS] 애플리케이션 로직 안정화 (`app.js`)
- `initiateReadingProcess`: `position: absolute`를 사용하는 모핑 과정을 더 안정적인 `transform` 기반으로 리팩토링.
- `morphCardsToGrid`: 스크롤이 있는 상태에서도 정확한 위치(`getBoundingClientRect`)를 계산하도록 보정 로직 추가.
- ` revelarCards`: 카드 뒤집기 애니메이션과 해석 텍스트 노출 순서의 유기적 연결 강화.

#### [HTML] 구조 최적화 (`index.html`)
- `reading-phase` 내부의 `reading-layout`과 `reading-footer-area` 구조를 개선하여 스크롤 흐름이 끊기지 않게 조정.

---

## 3. 검증 계획 (Verification Plan)

### 자동화 테스트 (Evaluator 협업)
- 브라우저 서브에이전트를 통해 10장 선택 후 결과 페이지 진입 시 Console 에러 확인.
- `window.scrollY`가 전이 과정에서 비정상적으로 튀는지 체크.

### 수동 검증
- 데스크탑/모바일 환경에서 전체 점사 프로세스(질문->셔플->선택->결과) 완주 테스트.
- 긴 해석 결과가 나올 때 하단까지 스크롤이 원활한지 확인.

## 4. 사용자 결정 필요 (Decision Required)
- **스크롤 방식**: 카드 그리드는 왼쪽에 고정(Sticky)하고 텍스트만 스크롤할지, 아니면 전체 페이지가 같이 스크롤되는 방식 중 선호하는 방식 확인 필요. (현재는 전체 페이지 스크롤 추천)
