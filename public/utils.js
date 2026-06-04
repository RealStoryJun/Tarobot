// 공용 유틸 — app.js / auth.js / admin.html 에서 import

export function escapeHtml(str) {
    const d = document.createElement('div');
    d.textContent = str ?? '';
    return d.innerHTML;
}

export const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

// style.css 의 --d-* 듀레이션 토큰과 동기화
export const TIMING = {
    SNAP: 200,
    BASE: 500,
    SLOW: 900,
    RITUAL: 1400,
};

// Fisher-Yates shuffle + 역방향 랜덤
export function shuffleDeck(deck) {
    const arr = deck.map((card) => ({ ...card, isReversed: Math.random() < 0.5 }));
    for (let k = 0; k < 5; k++) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    return arr;
}

export const isMobile = () => window.innerWidth <= 768;
