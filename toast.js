// 경량 토스트 + 전역 에러 캡처
// import 만으로 자동으로 컨테이너 삽입 + window error 리스너 등록

let container = null;

function ensureContainer() {
    if (container) return container;
    container = document.createElement('div');
    container.className = 'toast-container';
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-atomic', 'true');
    document.body.appendChild(container);
    return container;
}

/**
 * @param {string} message
 * @param {'info'|'success'|'error'|'warning'} type
 * @param {number} duration ms
 */
export function toast(message, type = 'info', duration = 3500) {
    const host = ensureContainer();
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.setAttribute('role', type === 'error' ? 'alert' : 'status');
    el.textContent = message;
    host.appendChild(el);

    requestAnimationFrame(() => el.classList.add('toast-in'));

    const remove = () => {
        el.classList.remove('toast-in');
        el.classList.add('toast-out');
        setTimeout(() => el.remove(), 400);
    };

    const timer = setTimeout(remove, duration);
    el.addEventListener('click', () => {
        clearTimeout(timer);
        remove();
    });

    return remove;
}

// 전역 에러 캡처 — 한 번만 등록
let installed = false;
export function installGlobalErrorHandler() {
    if (installed) return;
    installed = true;

    window.addEventListener('error', (e) => {
        if (!e || !e.message) return;
        console.error('[global error]', e.message, e.error);
        toast(`오류: ${e.message}`, 'error', 5000);
    });

    window.addEventListener('unhandledrejection', (e) => {
        const reason = e?.reason;
        const msg =
            (reason && (reason.message || String(reason))) || '알 수 없는 비동기 오류';
        console.error('[unhandled promise]', reason);
        toast(`오류: ${msg}`, 'error', 5000);
    });
}
