import { apiCall } from './api.js';
import { tarotDeck, spreadPositions } from './data.js';

// Motion timing — style.css 의 --d-* 토큰과 대응
const T = {
    SNAP: 200,    // --d-snap
    BASE: 500,    // --d-base
    SLOW: 900,    // --d-slow
    RITUAL: 1400, // --d-ritual
};

// State
let gameState = 'START';
let shuffledDeck = [];
let selectedCards = [];
let sessionId = null;

// Elements
const getElements = () => ({
    selectionContainer: document.getElementById('selection-container'),
    initialUiGroup: document.getElementById('initial-ui-group'),
    controlButton: document.getElementById('controlButton'),
    questionInput: document.getElementById('questionInput'),
    statusMessage: document.getElementById('status-message'),
    cardWheelContainer: document.getElementById('card-wheel-container'),
    cardWheel: document.getElementById('card-wheel'),
    shufflingContainer: document.getElementById('shuffling-container'),
    selectionZone: document.getElementById('selection-zone'),
    selectionInstruction: document.getElementById('selection-instruction'),
    selectedCardsArea: document.getElementById('selected-cards-area'),
    readingPhase: document.getElementById('reading-phase'),
    celticCrossGrid: document.getElementById('celticCross'),
    interpretationText: document.getElementById('interpretationText'),
    aiAdviceSection: document.getElementById('ai-advice-section'),
    recommendationTextContainer: document.getElementById('recommendationTextContainer'),
    recommendationText: document.getElementById('recommendationText'),
    newReadingButton: document.getElementById('newReading'),
    newReadingBar: document.getElementById('new-reading-bar'),
    questionFocusDisplay: document.getElementById('question-focus-display'),
    focusQuestionText: document.getElementById('focusQuestionText'),
    finalAdviceQuestion: document.getElementById('finalAdviceQuestion'),
    micButton: document.getElementById('micButton'),
});

let elements = {};

const sleep = ms => new Promise(res => setTimeout(res, ms));

// === 엔터 키 & 버튼 플로우 ===

function handleEnterKey(e) {
    if (e.key !== 'Enter') return;
    e.preventDefault();

    if (gameState !== 'START') return;
    
    const question = elements.questionInput.value.trim();
    if (!question) {
        showStatus('질문을 먼저 입력해주세요!', true);
        return;
    }

    // 단계 축소: 엔터 한 번으로 바로 시작
    handleStart();
}

function showStatus(message, isError = false) {
    elements.statusMessage.textContent = message;
    if (isError) {
        elements.statusMessage.classList.add('text-red-400');
        setTimeout(() => {
            elements.statusMessage.textContent = '당신의 질문을 입력하고 리딩을 시작하세요.';
            elements.statusMessage.classList.remove('text-red-400');
        }, 2500);
    }
}

// === 메인 시작 플로우 ===

async function handleStart() {
    const question = elements.questionInput.value.trim();
    if (!question) {
        showStatus('질문을 먼저 입력해주세요!', true);
        return;
    }

    elements.finalAdviceQuestion.textContent = `"${question}"`;
    elements.focusQuestionText.textContent = `"${question}"`;

    // Phase 1 → 사라짐
    elements.initialUiGroup.style.opacity = '0';
    document.body.classList.remove('bg-active');
    
    // 로그인/가입 헤더 숨기기 (유저 피드백: 입력 후 사라지게)
    const topHeader = document.querySelector('header');
    if (topHeader) {
        topHeader.style.transition = 'opacity 0.8s ease';
        topHeader.style.opacity = '0';
        setTimeout(() => { topHeader.style.display = 'none'; }, 800);
    }
    
    // 질문 강조 오버레이 미리 준비
    elements.questionFocusDisplay.classList.remove('hidden');
    await sleep(200); // 겹침 시간 부여
    
    elements.questionFocusDisplay.style.opacity = '1';
    await sleep(600); // 총 800ms 대기

    elements.initialUiGroup.classList.add('hidden');

    // 질문 강조 표시 지속
    await sleep(1000);
    elements.questionFocusDisplay.style.opacity = '0';
    await sleep(600);
    elements.questionFocusDisplay.classList.add('hidden');

    // Phase 2 등장 & 시퀀스 시작
    elements.selectionZone.classList.remove('hidden');
    shuffledDeck = shuffleDeck([...tarotDeck]);
    elements.shufflingContainer.style.display = 'flex';
    elements.shufflingContainer.classList.add('is-shuffling');

    await sleep(1500);
    elements.shufflingContainer.style.opacity = '0'; // 셔플이 끝나기 시작할 때 텍스트부터 서서히 숨김
    elements.shufflingContainer.classList.remove('is-shuffling');

    await sleep(200);
    const shufflingDeckEl = elements.shufflingContainer.querySelector('.shuffling-deck');
    
    // 유기적인 연결: 셔플 덱이 작아지며 사라지는 동안 휠이 그 자리에서 펼쳐지기 시작
    if (shufflingDeckEl) {
        shufflingDeckEl.classList.add('is-transitioning');
    }

    await sleep(800); // 셔플 카드가 작아지는 시간을 충분히 벌어줌 (매끄러운 연계)
    elements.shufflingContainer.style.display = 'none'; // 휠 등장 직전에 완전 제거
    
    renderWheel();
    const wheelCards = document.querySelectorAll('.wheel-card');
    wheelCards.forEach(card => card.style.setProperty('--radius', '0px'));
    elements.cardWheelContainer.classList.add('is-visible');
    
    // 휠의 크기를 하단의 5칸 슬롯들의 전체 너비와 정확히 일치시킴
    // 5칸 슬롯은 max-width: 480px. 약간 더 넓게(변경 크기 반영) 조정
    const slotAreaWidth = elements.selectedCardsArea ? elements.selectedCardsArea.getBoundingClientRect().width : 480;
    const finalRadius = (slotAreaWidth / 2) + 20; 
    wheelCards.forEach(card => card.style.setProperty('--radius', `${finalRadius}px`));

    // 휠이 펼쳐지는 피크 시점에서 무대 전체를 상승시키며 슬롯을 동시에 노출
    await sleep(400);
    elements.cardWheelContainer.classList.add('is-raised');
    
    // 슬롯 생성 및 등장 (휠 상승과 동일한 easing 적용됨)
    initSelectionArea();
    elements.selectedCardsArea.classList.add('is-visible');
    
    elements.shufflingContainer.style.display = 'none';

    await sleep(800);
    elements.selectionInstruction.textContent = '회전하는 카드를 눌러 10장을 선택하세요.';
    elements.selectionInstruction.style.opacity = '1';
    gameState = 'SELECTING';
}

// === 카드 선택 ===

function handleSelectCard() {
    if (gameState !== 'SELECTING' || selectedCards.length >= 10) return;

    let cardToHideRect = null;
    const visibleWheelCards = document.querySelectorAll('.wheel-card:not(.is-hidden)');
    if (visibleWheelCards.length > 0) {
        const randomIndex = Math.floor(Math.random() * visibleWheelCards.length);
        const cardToHide = visibleWheelCards[randomIndex];
        cardToHideRect = cardToHide.getBoundingClientRect();
        cardToHide.classList.add('is-hidden');
    }

    const cardData = shuffledDeck.pop();
    if (!cardData) return;
    selectedCards.push(cardData);
    
    elements.selectionInstruction.textContent = `카드 ${selectedCards.length} / 10장 선택됨`;
    animateCardSelection(selectedCards.length - 1, cardToHideRect);

    if (selectedCards.length === 10) {
        gameState = 'READING';
        elements.selectionInstruction.style.opacity = '0';
        setTimeout(() => initiateReadingProcess(), 600);
    }
}

// === 리딩 프로세스 (Phase 2 → Phase 3, 같은 공간에서) ===

async function initiateReadingProcess() {
    // 1. AI 호출 시작 (병렬)
    const aiPromise = apiCall('/api/interpret', 'POST', {
        question: elements.questionInput.value,
        cards: selectedCards,
        spreadPositions: spreadPositions
    });

    // 3. 휠 스테이지 정리 (투명화 및 살짝 회전)
    elements.cardWheelContainer.style.opacity = '0';
    elements.cardWheelContainer.style.transform = 'scale(1.1) rotate(5deg)';
    await sleep(400);

    // 4. 결과 레이아웃 준비 (그리드 렌더링)
    displayFinalCards();
    
    // 5. 모핑 및 페이즈 전환 통합 실행
    await morphCardsToGrid();

    await sleep(200);

    // 7. 카드 순차 뒤집기
    await revealCards();

    // 8. AI 응답 처리
    elements.aiAdviceSection.classList.remove('hidden');
    elements.newReadingBar.classList.remove('hidden');
    elements.recommendationTextContainer.innerHTML = `<div class="loader"></div><p class="text-left text-gray-400 w-full">타로 마스터가 당신의 카드를 깊이 읽고 있습니다...</p>`;

    try {
        const data = await aiPromise;
        if (data.error) throw new Error(data.error.message || data.error);

        elements.recommendationTextContainer.innerHTML = '';
        if (window.marked) {
            elements.recommendationText.innerHTML = marked.parse(data.interpretation);
        } else {
            elements.recommendationText.textContent = data.interpretation;
        }
        elements.recommendationTextContainer.appendChild(elements.recommendationText);

        const summaryArea = document.getElementById('interpretation-summary');
        const summaryText = document.getElementById('summary-text');
        if (summaryArea && summaryText) {
            summaryText.textContent = data.interpretation.split('\n')[0] || "운명의 흐름이 당신을 새로운 방향으로 안내하고 있습니다.";
            summaryArea.classList.add('is-visible');
        }

        saveReadingToSupabase(elements.questionInput.value, selectedCards, data.interpretation);
    } catch (error) {
        console.error('Reading Error:', error);
        elements.recommendationTextContainer.innerHTML = `<p class="text-red-400 text-center">오류 발생: ${error.message}</p>`;
    }
}

// === 모핑 애니메이션 핵심 로직 ===
async function morphCardsToGrid() {
    const slots = document.querySelectorAll('.card-slot');
    const targetCards = document.querySelectorAll('.final-card-container');
    
    // 1. 애니메이션 시작 좌표(슬롯) 읽기
    const slotRects = Array.from(slots).map(slot => slot.getBoundingClientRect());
    
    // 2. 고정 위치(fixed)에 모핑용 더미 카드 생성 및 부착
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

    // 3. 레이아웃 전환: 선택창을 완전히 숨기고 리딩창을 표시하여 실제 목적지 타겟의 정상 좌표 확보
    elements.selectionZone.classList.add('hidden');
    
    elements.readingPhase.classList.remove('hidden');
    elements.readingPhase.style.opacity = '1';
    elements.readingPhase.style.pointerEvents = 'none';

    // 4. 스크롤 허용 해제 및 즉각 Top으로 리셋 (부드러운 스크롤 시 좌표 밀림)
    document.body.classList.add('reading-mode');
    const appEl = document.getElementById('app');
    if (appEl) { appEl.style.height = 'auto'; appEl.style.overflow = 'visible'; }
    elements.selectionContainer.style.height = 'auto';
    elements.selectionContainer.style.overflow = 'visible';
    window.scrollTo({ top: 0, behavior: 'instant' });

    // 브라우저 렌더링 프레임 대기
    await new Promise(res => requestAnimationFrame(res));
    await new Promise(res => requestAnimationFrame(res));

    // 5. 정확해진 도착 좌표 읽기
    const targetRects = Array.from(targetCards).map(target => target.getBoundingClientRect());
    
    // 6. 비행 프라미스 실행
    const morphPromises = morphCards.map((morphCard, i) => {
        return new Promise(async (resolve) => {
            const slotRect = slotRects[i];
            const targetRect = targetRects[i];
            const target = targetCards[i];
            
            await sleep(i * 80);
            
            requestAnimationFrame(() => {
                morphCard.style.width = `${targetRect.width}px`;
                morphCard.style.height = `${targetRect.height}px`;
                const xMove = targetRect.left - slotRect.left;
                const yMove = targetRect.top - slotRect.top;
                morphCard.style.transform = `translate(${xMove}px, ${yMove}px) ${target.classList.contains('pos2') ? 'rotate(90deg)' : ''}`;
            });
            
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

// === 카드 순차 뒤집기 ===

async function revealCards() {
    const finalCards = document.querySelectorAll('.final-card-container');
    
    // 이미 모핑으로 나타났으므로(is-visible) 뒤집기만 수행
    for (let i = 0; i < finalCards.length; i++) {
        await sleep(i === 0 ? 0 : 300);
        finalCards[i].classList.add('is-flipped');
        appendInterpretation(i);
    }
}

// === 유틸리티 함수들 ===

function renderWheel() {
    elements.cardWheel.innerHTML = '';
    const cardCount = 78; // 기존 카드 개수 복구 (원래 78장)
    const angleIncrement = 360 / cardCount;
    for (let i = 0; i < cardCount; i++) {
        const cardEl = document.createElement('div');
        cardEl.className = 'wheel-card';
        cardEl.style.setProperty('--angle', `${i * angleIncrement}deg`);
        cardEl.innerHTML = `<div class="wheel-card-face wheel-card-face--front"></div>`;
        elements.cardWheel.appendChild(cardEl);
    }
}

function initSelectionArea() {
    elements.selectedCardsArea.innerHTML = '';
    for (let i = 0; i < 10; i++) {
        const slot = document.createElement('div');
        slot.className = 'card-slot';
        slot.id = `slot-${i}`;
        elements.selectedCardsArea.appendChild(slot);
    }
}

function animateCardSelection(index, startRect) {
    const targetSlot = document.getElementById(`slot-${index}`);
    if (!targetSlot || !startRect) return;
    const targetSlotRect = targetSlot.getBoundingClientRect();
    const animCard = document.createElement('div');
    animCard.className = 'selected-card-animation';
    animCard.style.width = `${startRect.width}px`;
    animCard.style.height = `${startRect.height}px`;
    animCard.style.top = `${startRect.top}px`;
    animCard.style.left = `${startRect.left}px`;
    
    const img = document.createElement('div');
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.borderRadius = '8px';
    img.style.backgroundImage = 'var(--card-back-image)';
    img.style.backgroundSize = 'cover';
    animCard.appendChild(img);
    document.body.appendChild(animCard);

    requestAnimationFrame(() => {
        animCard.style.width = `${targetSlotRect.width}px`;
        animCard.style.height = `${targetSlotRect.height}px`;
        animCard.style.transform = `translate(${targetSlotRect.left - startRect.left}px, ${targetSlotRect.top - startRect.top}px)`;
    });

    animCard.addEventListener('transitionend', () => {
        targetSlot.innerHTML = `<div style="width: 100%; height: 100%; background-image: var(--card-back-image); background-size: cover; border-radius: 8px;"></div>`;
        animCard.remove();
    }, { once: true });
}

function appendInterpretation(index) {
    const card = selectedCards[index];
    const meaning = card.isReversed ? card.reversed : card.upright;
    const position = spreadPositions[index];
    const orientation = card.isReversed ? '역방향' : '정방향';

    const div = document.createElement('div');
    div.className = 'interpretation-item opacity-0 transition-all duration-500';
    div.innerHTML = `
        <div class="pos-title">${index + 1}. ${position.title}</div>
        <div class="card-name-line" title="${card.name}">${card.name} <span class="text-[10px] text-yellow-500 opacity-60 ml-0.5">[${orientation}]</span></div>
        <div class="meaning-line" title="${meaning}">${meaning}</div>
    `;
    
    elements.interpretationText.appendChild(div);
    setTimeout(() => {
        div.classList.remove('opacity-0');
    }, 50);
}

function displayFinalCards() {
    elements.celticCrossGrid.innerHTML = '';
    elements.interpretationText.innerHTML = '';
    selectedCards.forEach((card, index) => {
        const positionClass = `pos${index + 1}`;
        const orientation = card.isReversed ? '역방향' : '정방향';
        const cardElement = document.createElement('div');
        cardElement.className = `final-card-container ${positionClass}`;

        const isLocal = card.image.startsWith('./');
        const optimizedImage = isLocal ? card.image : `https://images.weserv.nl/?url=${encodeURIComponent(card.image.replace(/^http:\/\//i, 'https://'))}&w=200&q=70&output=webp`;

        const imageHtml = `<img src="${optimizedImage}" alt="${card.name}" style="${card.isReversed ? 'transform: rotate(180deg);' : ''}">`;

        cardElement.innerHTML = `
            <div class="card-face card-face--back"></div>
            <div class="card-face card-face--front">
                ${imageHtml}
                <div class="final-card-overlay">
                    <div class="final-card-name">${card.name}</div>
                    <div class="final-card-orientation">${orientation}</div>
                </div>
            </div>`;
        elements.celticCrossGrid.appendChild(cardElement);
    });
}

async function saveReadingToSupabase(question, cards, interpretation) {
    try {
        // 토큰이 없더라도 apiCall에서 session-id를 처리하므로 항상 호출 시도
        const res = await apiCall('/api/readings', 'POST', { question, cards, interpretation });

        if (res.error) {
            if (res.status === 401) {
                console.error('Unauthorized focus: Token might be expired.');
                return;
            }
            throw new Error('저장 실패');
        }
    } catch (err) {
        console.error('Failed to save reading:', err.message);
    }
}

function shuffleDeck(deck) {
    let newDeck = deck.map(card => ({ ...card, isReversed: Math.random() < 0.5 }));
    for (let k = 0; k < 5; k++) {
        for (let i = newDeck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
        }
    }
    return newDeck;
}

// === 앱 초기화 ===

function initializeApp() {
    elements = getElements();
    sessionId = localStorage.getItem('tarobot_session_id') || crypto.randomUUID();
    localStorage.setItem('tarobot_session_id', sessionId);
    
    document.body.classList.add('bg-active');
    
    // 버튼 클릭 (모바일용)
    if (elements.controlButton) {
        elements.controlButton.addEventListener('click', handleStart);
    }
    
    // 데스크탑 엔터키 플로우
    if (elements.questionInput) {
        elements.questionInput.addEventListener('keydown', handleEnterKey);
    }
    
    elements.cardWheelContainer.addEventListener('click', handleSelectCard);
    elements.newReadingButton.addEventListener('click', () => window.location.reload());
}

window.onload = initializeApp;
