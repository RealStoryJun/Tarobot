# Tarobot UI/UX Design Snapshot (v1.0 Rollback Point)

이 문서는 1차적으로 완성된 Tarobot의 레이아웃, CSS, 그리고 애니메이션(DOM 제어 로직)의 롤백 기준점을 기록합니다. 나중에 디자인을 이전 상태로 되돌리고 싶을 때 참고할 수 있는 명세서 및 핵심 코드 스니펫입니다.

## 1. 글로벌 레이아웃 전략 (Single Stage & Morphing)

Tarobot은 여러 HTML 페이지를 이동하지 않고 **단일 컨테이너(Single Stage Container)** 내에서 여러 Phase(질문 입력 -> 카드 선택 -> 결과 리딩)를 전환하는 **SPA(Single Page Application) 방식** 구성을 가집니다.

- **Phase 1 (질문 입력칸)**: 화면의 수직 중앙(살짝 아래)에 위치. 배경의 타로 마스터 캐릭터가 손을 내미는 위치에 딱 맞게 정렬.
- **Phase 2 (셔플 & 카드 선택)**: 질문을 입력하면, 입력창이 투명해지며 사라지고 그 자리에서 카드가 셔플된 후 원형 덱(Wheel)으로 펼쳐짐.
- **Phase 3 (결과 창)**: 카드를 모두 뽑으면 선택 화면이 즉시 사라지고 결과 격자(Celtic Cross Grid)가 준비되며, 화면 하단 슬롯에 있던 카드들이 격자 위치로 날아가는(Morphing) 애니메이션 수행.

### 1-1. 스크롤 제어 정책
- Phase 1, Phase 2에서는 화면 스크롤이 불가능하도록 브라우저 뷰포트에 꽉 차게 고정.
- Phase 3(리딩 결과)부터 문서 내용이 길어지므로 동적으로 스크롤을 풀어줌 (`body.reading-mode`).

## 2. 핵심 CSS (레이아웃 & 애니메이션)

```css
/* 글로벌 컨테이너 고정 (스크롤 방지) */
body {
    width: 100%;
    height: 100dvh;
    overflow: hidden; 
    position: relative;
    /* ...폰트 및 배경... */
}

/* 리딩 단계 진입 시 동적 스크롤 허용 */
body.reading-mode {
    height: auto;
    overflow-y: auto;
    overflow-x: hidden;
}

.stage-container {
    position: relative;
    z-index: 1;
    height: 100dvh; /* 정확히 뷰포트 높이에 맞춤 */
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden; 
}

/* 중앙 정렬되는 이너 컨테이너 */
.stage-inner {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center; /* 수직 중앙 정렬! */
    align-items: center;
    padding: 1.5rem;
    padding-top: 60px; /* 헤더 높이 보정용 */
    width: 100%;
    margin: 0 auto;
}

/* 카드 휠과 하단 슬롯이 한 화면에 나오도록 공간 분배 */
.wheel-stage {
    width: 100%;
    flex: 1; /* 남은 공간을 모두 차지하게 하여 휠 영역 확보 */
    min-height: 160px;
    max-height: 320px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    margin: 0.5rem 0;
}
```

## 3. 핵심 모핑 애니메이션 (`app.js` - `morphCardsToGrid`)

카드 10장을 다 고른 후 켈틱 크로스 격자로 날아가는 로직입니다. 
좌표 밀림이나 흔들림(Layout Thrashing)을 방지하기 위해 **1) 출발지 좌표 확보 -> 2) 가상 DOM 렌더링 -> 3) 레이아웃 전환(스크롤 차단 해제 및 0점 고정) -> 4) 도착지 좌표 재확보 -> 5) 위치 이동**의 완벽한 순서를 보장합니다.

```javascript
// === 모핑 애니메이션 핵심 로직 ===
async function morphCardsToGrid() {
    const slots = document.querySelectorAll('.card-slot');
    const targetCards = document.querySelectorAll('.final-card-container');
    
    // 1. 애니메이션 시작 좌표(화면 하단 슬롯) 읽기
    const slotRects = Array.from(slots).map(slot => slot.getBoundingClientRect());
    
    // 2. 고정 위치(fixed)에 가상 모핑용 더미(Dummy) 카드 생성
    const morphCards = slotRects.map(slotRect => {
        const morphCard = document.createElement('div');
        morphCard.className = 'card-morphing';
        morphCard.style.width = `${slotRect.width}px`;
        morphCard.style.height = `${slotRect.height}px`;
        morphCard.style.top = `${slotRect.top}px`;
        morphCard.style.left = `${slotRect.left}px`;
        morphCard.style.backgroundImage = 'var(--card-back-image)';
        morphCard.style.backgroundSize = 'cover';
        morphCard.style.borderRadius = '8px';
        morphCard.style.border = '1px solid var(--accent-gold)';
        document.body.appendChild(morphCard);
        return morphCard;
    });

    // 3. 레이아웃 전환: 선택창을 완전히 숨기고 리딩창(Phase3)으로 교체
    elements.selectionZone.classList.add('hidden');
    elements.readingPhase.classList.remove('hidden');
    elements.readingPhase.style.opacity = '1';
    elements.readingPhase.style.pointerEvents = 'none';

    // 4. 스크롤 허용 해제 및 즉각 Top으로 리셋 (부드러운 스크롤 시 날아가는 도중 좌표가 어긋남 방지)
    document.body.classList.add('reading-mode');
    const appEl = document.getElementById('app');
    if (appEl) { appEl.style.height = 'auto'; appEl.style.overflow = 'visible'; }
    elements.selectionContainer.style.height = 'auto';
    elements.selectionContainer.style.overflow = 'visible';
    
    // 위치를 확실히 잡기 위해 스크롤 제일 위로 강제 고정 
    window.scrollTo({ top: 0, behavior: 'instant' });

    // 브라우저 렌더링 프레임 대기 (실제 레이아웃이 적용될 시간을 벌어줌)
    await new Promise(res => requestAnimationFrame(res));
    await new Promise(res => requestAnimationFrame(res));

    // 5. 정확해진 도착 좌표(새로운 격자 레이아웃 위에서의 좌표) 읽기
    const targetRects = Array.from(targetCards).map(target => target.getBoundingClientRect());
    
    // 6. 비행 프라미스 실행
    const morphPromises = morphCards.map((morphCard, i) => {
        return new Promise(async (resolve) => {
            const slotRect = slotRects[i];
            const targetRect = targetRects[i];
            const target = targetCards[i];
            
            await sleep(i * 80); // 카드가 순차적으로 날아가도록 간격(Delay) 부여
            
            requestAnimationFrame(() => {
                morphCard.style.width = `${targetRect.width}px`;
                morphCard.style.height = `${targetRect.height}px`;
                const xMove = targetRect.left - slotRect.left;
                const yMove = targetRect.top - slotRect.top;
                
                // 가로로 누워있는 장애물 카드(Pos 2)에 대한 각도 회전 처리 포함
                morphCard.style.transform = `translate(${xMove}px, ${yMove}px) ${target.classList.contains('pos2') ? 'rotate(90deg)' : ''}`;
            });
            
            // 날아오기가 끝나면, 실제 격자 카드를 노출시키고 임시 더미 카드는 삭제
            morphCard.addEventListener('transitionend', () => {
                target.classList.add('is-visible');
                morphCard.classList.add('arrived');
                setTimeout(() => {
                    morphCard.remove();
                    resolve();
                }, 400);
            }, { once: true });
        });
    });

    await Promise.all(morphPromises);
    elements.readingPhase.style.pointerEvents = '';
}
```

## 4. 백업 포인트 의미
이 백업 문서는 `2026-04-18` 시점에 안정화된 UI의 1차 완성본을 의미합니다. 스크롤 버그, 렌더링 겹침, 카드 모핑 애니메이션의 엇나감 문제가 모두 해결된, **가장 이상적인 CSS/DOM 조작 상태**입니다.
후에 새로운 기능을 추가하다가 UI가 깨어지면 가장 먼저 참조해야 할 기준 레이아웃입니다.
