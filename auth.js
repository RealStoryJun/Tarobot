import { apiCall } from './api.js';
import { escapeHtml } from './utils.js';
import { toast } from './toast.js';

// State: Global Auth State
let currentUser = null;
let authToken = localStorage.getItem('sb-token') || null;

// UI Elements
const elements = {
    overlay: document.getElementById('auth-modal-overlay'),
    loginModal: document.getElementById('login-modal'),
    signupModal: document.getElementById('signup-modal'),
    resetModal: document.getElementById('reset-modal'),
    profileModal: document.getElementById('profile-modal'),
    
    navLoginBtn: document.getElementById('nav-login-btn'),
    navJoinBtn: document.getElementById('nav-join-btn'),
    navUserInfo: document.getElementById('nav-user-info'),
    navProfileBtn: document.getElementById('nav-profile-btn'),
    navLogoutBtn: document.getElementById('nav-logout-btn'),
    userNameDisplay: document.getElementById('user-display-name'),
    profileEmailDisplay: document.getElementById('profile-email-display'),
    
    goReset: document.getElementById('go-reset-btn'),
    goJoin: document.getElementById('go-join-btn'),
    goLogin: document.getElementById('go-login-btn'),
    backToLogin: document.getElementById('back-to-login'),
    
    doLogin: document.getElementById('do-login-btn'),
    doSignup: document.getElementById('do-signup-btn'),
    doReset: document.getElementById('do-reset-btn'),
    doChangePw: document.getElementById('do-change-pw-btn')
};

// Helper: Validation
const validatePassword = (pw) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return regex.test(pw);
};

// GoTrue / Supabase Auth 영문 에러를 한국어로 매핑.
// 알 수 없는 코드는 원본 메시지를 그대로 노출해 디버그 흔적을 남김.
function mapAuthError(err) {
    if (!err) return '알 수 없는 오류가 발생했습니다.';
    const code = (err.code || '').toString();
    const msg = (err.message || '').toString();
    const m = msg.toLowerCase();

    if (code === 'invalid_credentials' || m.includes('invalid login credentials')) {
        return '이메일 또는 비밀번호가 올바르지 않습니다.';
    }
    if (code === 'email_not_confirmed' || m.includes('email not confirmed')) {
        return '이메일 인증이 완료되지 않았습니다. 받으신 메일의 인증 링크를 확인해 주세요.';
    }
    if (code === 'user_already_exists' || m.includes('already registered') || m.includes('user already')) {
        return '이미 가입된 이메일입니다. 로그인해 주세요.';
    }
    if (code === 'weak_password' || m.includes('password should be')) {
        return '비밀번호가 너무 약합니다. 영문+숫자+특수문자 8자 이상으로 설정해 주세요.';
    }
    if (m.includes('unable to validate email') || m.includes('invalid email')) {
        return '이메일 형식이 올바르지 않습니다.';
    }
    if (code === 'over_email_send_rate_limit' || m.includes('email rate limit')) {
        return '이메일 발송 제한에 도달했어요. 잠시 후 다시 시도해 주세요.';
    }
    if (m.includes('for security purposes') || m.includes('rate limit')) {
        return '잠시 후 다시 시도해 주세요. (보안 제한)';
    }
    if (code === 'same_password' || m.includes('new password should be different')) {
        return '기존 비밀번호와 다른 새 비밀번호를 입력해 주세요.';
    }
    return msg || '인증 중 오류가 발생했습니다.';
}

// 모달 인라인 에러 표시 — 토스트와 별개로 모달 안 시선에서 바로 보이게.
// modalKey: 'login' | 'signup' | 'reset' | 'change-pw'
const ERROR_FIELDS = {
    'login':     { errorEl: 'login-error',     inputs: ['login-email', 'login-password'] },
    'signup':    { errorEl: 'signup-error',    inputs: ['signup-email', 'signup-password', 'signup-password-confirm'] },
    'reset':     { errorEl: 'reset-error',     inputs: ['reset-email'] },
    'change-pw': { errorEl: 'change-pw-error', inputs: ['change-password', 'change-password-confirm'] },
};

function showAuthError(modalKey, message, opts = {}) {
    const cfg = ERROR_FIELDS[modalKey];
    if (!cfg) return;
    const el = document.getElementById(cfg.errorEl);
    if (el) {
        el.textContent = message;
        el.classList.remove('hidden');
        // shake 재트리거
        el.classList.remove('is-shake');
        void el.offsetWidth;
        el.classList.add('is-shake');
    }
    const fields = opts.fields || cfg.inputs;
    fields.forEach((id) => {
        const input = document.getElementById(id);
        if (input) input.classList.add('is-error');
    });
}

function clearAuthError(modalKey) {
    const cfg = ERROR_FIELDS[modalKey];
    if (!cfg) return;
    const el = document.getElementById(cfg.errorEl);
    if (el) {
        el.textContent = '';
        el.classList.add('hidden');
        el.classList.remove('is-shake');
    }
    cfg.inputs.forEach((id) => {
        const input = document.getElementById(id);
        if (input) input.classList.remove('is-error');
    });
}

// 버튼 로딩 상태 토글 — 클릭 즉시 비활성화 + 텍스트/스피너로 응답성 시그널.
// CSS 의 `auth-btn[aria-busy=true]` 가 스피너를 그리고, disabled 가 hover/클릭을 막음.
function setBusy(btn, busy, busyLabel) {
    if (!btn) return;
    if (busy) {
        if (!btn.dataset.originalLabel) btn.dataset.originalLabel = btn.textContent;
        if (busyLabel) btn.textContent = busyLabel;
        btn.setAttribute('aria-busy', 'true');
        btn.disabled = true;
    } else {
        btn.removeAttribute('aria-busy');
        btn.disabled = false;
        if (btn.dataset.originalLabel) {
            btn.textContent = btn.dataset.originalLabel;
            delete btn.dataset.originalLabel;
        }
    }
}

// JWT payload decode — 서명 검증 없이 UI 힌트용으로만 사용. 실제 권한 검증은 Worker 가 Supabase 에 재검증.
function decodeJwtPayload(token) {
    try {
        const part = token.split('.')[1];
        if (!part) return null;
        const b64 = part.replace(/-/g, '+').replace(/_/g, '/');
        const padded = b64 + '==='.slice((b64.length + 3) % 4);
        const bytes = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
        return JSON.parse(new TextDecoder('utf-8').decode(bytes));
    } catch { return null; }
}

// --- Modal Controls ---
let _lastFocusBeforeModal = null;
let _trappedModal = null;

function getFocusables(root) {
    return Array.from(
        root.querySelectorAll(
            'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
    ).filter((el) => !el.hasAttribute('hidden') && el.offsetParent !== null);
}

function trapFocusHandler(e) {
    if (!_trappedModal || e.key !== 'Tab') return;
    const focusables = getFocusables(_trappedModal);
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
    }
}

function openModal(modal) {
    if (!elements.overlay) return;
    _lastFocusBeforeModal = document.activeElement;
    elements.overlay.classList.add('is-active');
    [elements.loginModal, elements.signupModal, elements.resetModal, elements.profileModal].forEach(m => m.classList.add('hidden'));
    modal.classList.remove('hidden');
    _trappedModal = modal;

    // 다른 모달에서 남은 에러 잔재 정리
    ['login', 'signup', 'reset', 'change-pw'].forEach(clearAuthError);
    // 첫 포커스 가능한 요소로 이동
    requestAnimationFrame(() => {
        const focusables = getFocusables(modal);
        if (focusables[0]) focusables[0].focus();
    });
    document.addEventListener('keydown', trapFocusHandler);

    // 인증 모달(로그인/가입/리셋)이 열리는 순간 Worker prewarm — 사용자가 입력하는 동안
    // cold start 비용을 흡수해 실제 제출 시점엔 warm path 로 떨어지게 함.
    if (modal === elements.loginModal || modal === elements.signupModal || modal === elements.resetModal) {
        apiCall('/api/auth/me', 'GET').catch(() => { /* prewarm; 응답은 버림 */ });
    }
}

function closeModal() {
    if (!elements.overlay) return;
    elements.overlay.classList.remove('is-active');
    _trappedModal = null;
    document.removeEventListener('keydown', trapFocusHandler);
    if (_lastFocusBeforeModal && typeof _lastFocusBeforeModal.focus === 'function') {
        _lastFocusBeforeModal.focus();
    }
}

// --- Auth Logic via Worker Proxy ---

async function handleSignup() {
    clearAuthError('signup');
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-password-confirm').value;

    if (!email || !password) {
        const empty = [];
        if (!email) empty.push('signup-email');
        if (!password) empty.push('signup-password');
        showAuthError('signup', '이메일과 비밀번호를 모두 입력해 주세요.', { fields: empty });
        return;
    }
    if (password !== confirm) {
        showAuthError('signup', '비밀번호가 일치하지 않습니다.', { fields: ['signup-password', 'signup-password-confirm'] });
        return;
    }
    if (!validatePassword(password)) {
        showAuthError('signup', '비밀번호는 영문+숫자+특수문자(@$!%*#?&) 포함 8자 이상이어야 합니다.', { fields: ['signup-password'] });
        return;
    }

    setBusy(elements.doSignup, true, '가입 중...');
    try {
        const result = await apiCall('/api/auth/signup', 'POST', { email, password });
        if (result.error) {
            const msg = mapAuthError(result.error);
            showAuthError('signup', msg);
            toast('가입 실패: ' + msg, 'error');
        } else {
            toast('회원가입 성공! 메일 확인이 필요할 수 있습니다.', 'success');
            closeModal();
        }
    } finally {
        setBusy(elements.doSignup, false);
    }
}

async function handleLogin() {
    clearAuthError('login');
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        const empty = [];
        if (!email) empty.push('login-email');
        if (!password) empty.push('login-password');
        showAuthError('login', '이메일과 비밀번호를 모두 입력해 주세요.', { fields: empty });
        return;
    }

    setBusy(elements.doLogin, true, '로그인 중...');
    try {
        const result = await apiCall('/api/auth/login', 'POST', { email, password });
        if (result.error) {
            const msg = mapAuthError(result.error);
            // 자격증명 오류는 두 인풋 모두 강조, 그 외는 텍스트만
            const code = (result.error.code || '').toString();
            const m = (result.error.message || '').toLowerCase();
            const credError = code === 'invalid_credentials' || m.includes('invalid login credentials');
            showAuthError('login', msg, credError ? undefined : { fields: [] });
            toast('로그인 실패: ' + msg, 'error');
        } else {
            if (result.data?.session) {
                authToken = result.data.session.access_token;
                localStorage.setItem('sb-token', authToken);
                currentUser = result.data.user;
                updateAuthStateUI(currentUser);
            }
            closeModal();
        }
    } finally {
        setBusy(elements.doLogin, false);
    }
}

async function handleLogout() {
    localStorage.removeItem('sb-token');
    authToken = null;
    currentUser = null;
    window.location.reload();
}

async function handleResetPassword() {
    clearAuthError('reset');
    const email = document.getElementById('reset-email').value.trim();
    if (!email) {
        showAuthError('reset', '이메일을 입력해 주세요.');
        return;
    }
    setBusy(elements.doReset, true, '메일 보내는 중...');
    try {
        const result = await apiCall('/api/auth/reset', 'POST', {
            email,
            redirectTo: window.location.origin + window.location.pathname + '?type=recovery'
        });

        if (result.error) {
            const msg = mapAuthError(result.error);
            showAuthError('reset', msg);
            toast('실패: ' + msg, 'error');
        } else {
            toast('이메일을 확인해 주세요.', 'success');
            closeModal();
        }
    } finally {
        setBusy(elements.doReset, false);
    }
}

async function handlePasswordChange() {
    clearAuthError('change-pw');
    const password = document.getElementById('change-password').value;
    const confirm = document.getElementById('change-password-confirm').value;

    if (!password) {
        showAuthError('change-pw', '새 비밀번호를 입력해 주세요.', { fields: ['change-password'] });
        return;
    }
    if (password !== confirm) {
        showAuthError('change-pw', '비밀번호가 일치하지 않습니다.', { fields: ['change-password', 'change-password-confirm'] });
        return;
    }
    if (!validatePassword(password)) {
        showAuthError('change-pw', '비밀번호는 영문+숫자+특수문자(@$!%*#?&) 포함 8자 이상이어야 합니다.', { fields: ['change-password'] });
        return;
    }

    setBusy(elements.doChangePw, true, '변경 중...');
    try {
        const result = await apiCall('/api/auth/update', 'POST', { password });
        if (result.error) {
            const msg = mapAuthError(result.error);
            showAuthError('change-pw', msg);
            toast('변경 실패: ' + msg, 'error');
        } else {
            toast('비밀번호 변경 완료', 'success');
            closeModal();
        }
    } finally {
        setBusy(elements.doChangePw, false);
    }
}

function getDisplayName(user) {
    return localStorage.getItem('tarobot_display_name') || user.email.split('@')[0];
}

// --- UI Updates ---
function updateAuthStateUI(user) {
    if (!elements.navLoginBtn) return;
    if (user) {
        elements.navLoginBtn.classList.add('hidden');
        elements.navJoinBtn.classList.add('hidden');
        elements.navUserInfo.classList.remove('hidden');
        elements.navUserInfo.style.display = 'flex';
        elements.userNameDisplay.textContent = getDisplayName(user);
        // 관리자 링크 표시 여부 확인
        checkAdminStatus();
    } else {
        elements.navLoginBtn.classList.remove('hidden');
        elements.navJoinBtn.classList.remove('hidden');
        elements.navUserInfo.classList.add('hidden');
    }
}

function saveDisplayName() {
    const input = document.getElementById('display-name-input');
    if (!input) return;
    const name = input.value.trim();
    if (!name) {
        localStorage.removeItem('tarobot_display_name');
    } else {
        localStorage.setItem('tarobot_display_name', name);
    }
    if (currentUser) {
        elements.userNameDisplay.textContent = getDisplayName(currentUser);
    }
    toast('표시 이름이 저장되었습니다.', 'success');
}

// 관리자 권한 비동기 확인
async function checkAdminStatus() {
    try {
        const res = await apiCall('/api/admin/check', 'GET');
        const adminLink = document.getElementById('nav-admin-link');
        if (res.isAdmin && adminLink) {
            adminLink.classList.remove('hidden');
        }
    } catch (e) { /* 무시 */ }
}

// 내 리딩 이력 로드 + 클라이언트 검색
let _allHistory = [];

function renderHistoryItems(items) {
    const historyList = document.getElementById('history-list');
    if (!historyList) return;
    if (items.length === 0) {
        historyList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon" aria-hidden="true">✧</div>
                <p class="empty-state-msg">일치하는 리딩이 없습니다.</p>
            </div>
        `;
        return;
    }
    historyList.innerHTML = items.map(r => {
        const date = new Date(r.created_at).toLocaleString('ko-KR', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
        const questionText = r.question || '질문 없음';
        const preview = (r.interpretation || '해석 없음').substring(0, 500);
        const hasMore = (r.interpretation || '').length > 500;
        return `
            <div class="history-item" role="button" tabindex="0" onclick="this.querySelector('.detail').classList.toggle('hidden')">
                <div class="history-item-head">
                    <p class="history-item-q">${escapeHtml(questionText)}</p>
                    <span class="history-item-date">${date}</span>
                </div>
                <div class="detail hidden history-item-body">
                    <p>${escapeHtml(preview)}${hasMore ? '...' : ''}</p>
                </div>
            </div>
        `;
    }).join('');
}

async function loadMyHistory() {
    const historyOverlay = document.getElementById('history-modal-overlay');
    const historyList = document.getElementById('history-list');
    if (!historyOverlay || !historyList) return;

    historyOverlay.classList.add('is-active');
    historyList.innerHTML = `
        <div class="history-search-wrap">
            <input id="history-search" type="search" placeholder="질문·해석 키워드로 검색..." aria-label="이력 검색">
        </div>
        <div class="empty-state"><div class="empty-state-icon" aria-hidden="true">✧</div><p class="empty-state-msg">로딩 중...</p></div>
    `;

    try {
        const res = await apiCall('/api/my-readings', 'GET');
        _allHistory = res.data || [];

        const searchInput = document.getElementById('history-search');
        const listHost = document.createElement('div');
        listHost.id = 'history-list-items';
        historyList.appendChild(listHost);

        if (_allHistory.length === 0) {
            listHost.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon" aria-hidden="true">✧</div>
                    <p class="empty-state-msg">아직 리딩 기록이 없습니다.<br>첫 점사를 시작해보세요.</p>
                </div>
            `;
            return;
        }

        // 초기 렌더
        renderHistoryItemsInto(listHost, _allHistory);

        if (searchInput) {
            searchInput.addEventListener('input', () => {
                const q = searchInput.value.trim().toLowerCase();
                if (!q) {
                    renderHistoryItemsInto(listHost, _allHistory);
                    return;
                }
                const filtered = _allHistory.filter(r =>
                    (r.question || '').toLowerCase().includes(q) ||
                    (r.interpretation || '').toLowerCase().includes(q)
                );
                renderHistoryItemsInto(listHost, filtered);
            });
        }
    } catch (e) {
        historyList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon" aria-hidden="true">✦</div>
                <p class="empty-state-msg" style="color: var(--c-danger);">이력을 불러오지 못했습니다: ${escapeHtml(e.message)}</p>
            </div>
        `;
    }
}

function renderHistoryItemsInto(host, items) {
    if (items.length === 0) {
        host.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon" aria-hidden="true">✧</div>
                <p class="empty-state-msg">일치하는 리딩이 없습니다.</p>
            </div>
        `;
        return;
    }
    host.innerHTML = items.map(r => {
        const date = new Date(r.created_at).toLocaleString('ko-KR', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
        const questionText = r.question || '질문 없음';
        const preview = (r.interpretation || '해석 없음').substring(0, 500);
        const hasMore = (r.interpretation || '').length > 500;
        return `
            <div class="history-item" role="button" tabindex="0" onclick="this.querySelector('.detail').classList.toggle('hidden')">
                <div class="history-item-head">
                    <p class="history-item-q">${escapeHtml(questionText)}</p>
                    <span class="history-item-date">${date}</span>
                </div>
                <div class="detail hidden history-item-body">
                    <p>${escapeHtml(preview)}${hasMore ? '...' : ''}</p>
                </div>
            </div>
        `;
    }).join('');
}

// --- Initialization ---
async function initAuth() {
    // Listeners for Opening/Switching
    if (elements.navLoginBtn) elements.navLoginBtn.addEventListener('click', () => openModal(elements.loginModal));
    if (elements.navJoinBtn) elements.navJoinBtn.addEventListener('click', () => openModal(elements.signupModal));
    if (elements.goJoin) elements.goJoin.addEventListener('click', () => openModal(elements.signupModal));
    if (elements.goReset) elements.goReset.addEventListener('click', () => openModal(elements.resetModal));
    if (elements.goLogin) elements.goLogin.addEventListener('click', () => openModal(elements.loginModal));
    if (elements.backToLogin) elements.backToLogin.addEventListener('click', () => openModal(elements.loginModal));
    
    // Actions
    if (elements.doSignup) elements.doSignup.addEventListener('click', handleSignup);
    if (elements.doLogin) elements.doLogin.addEventListener('click', handleLogin);
    if (elements.doReset) elements.doReset.addEventListener('click', handleResetPassword);
    if (elements.doChangePw) elements.doChangePw.addEventListener('click', handlePasswordChange);
    if (elements.navLogoutBtn) elements.navLogoutBtn.addEventListener('click', handleLogout);

    // 내 이력 버튼
    const historyBtn = document.getElementById('nav-history-btn');
    if (historyBtn) historyBtn.addEventListener('click', loadMyHistory);

    // 이력 모달 닫기
    const historyOverlay = document.getElementById('history-modal-overlay');
    if (historyOverlay) {
        historyOverlay.addEventListener('click', (e) => {
            if (e.target === historyOverlay) historyOverlay.classList.remove('is-active');
        });
    }

    if (elements.navProfileBtn) {
        elements.navProfileBtn.addEventListener('click', () => {
            if (currentUser) {
                elements.profileEmailDisplay.textContent = currentUser.email;
                const nameInput = document.getElementById('display-name-input');
                if (nameInput) nameInput.value = getDisplayName(currentUser);
                openModal(elements.profileModal);
            }
        });
    }

    const saveNameBtn = document.getElementById('save-display-name-btn');
    if (saveNameBtn) saveNameBtn.addEventListener('click', saveDisplayName);

    if (elements.overlay) {
        elements.overlay.addEventListener('click', (e) => {
            if (e.target === elements.overlay) closeModal();
        });
    }

    // 전역 Esc — 모든 모달 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        if (elements.overlay && elements.overlay.classList.contains('is-active')) closeModal();
        const historyOverlay = document.getElementById('history-modal-overlay');
        if (historyOverlay && historyOverlay.classList.contains('is-active')) {
            historyOverlay.classList.remove('is-active');
        }
    });
    
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    // 인풋 입력 시 해당 모달의 에러 자동 클리어 (사용자가 수정 시작했음을 신호)
    Object.entries(ERROR_FIELDS).forEach(([modalKey, cfg]) => {
        cfg.inputs.forEach((id) => {
            const input = document.getElementById(id);
            if (!input) return;
            input.addEventListener('input', () => {
                if (input.classList.contains('is-error')) clearAuthError(modalKey);
            });
            // Enter 키로 제출 (모달 안에서 자연스럽게)
            input.addEventListener('keydown', (e) => {
                if (e.key !== 'Enter') return;
                e.preventDefault();
                const submitMap = {
                    'login': elements.doLogin,
                    'signup': elements.doSignup,
                    'reset': elements.doReset,
                    'change-pw': elements.doChangePw,
                };
                const btn = submitMap[modalKey];
                if (btn && !btn.disabled) btn.click();
            });
        });
    });

    // 저장된 토큰으로 현재 세션 확인 — optimistic 복원 (JWT exp 기반) + 백그라운드 재검증
    if (authToken) {
        const payload = decodeJwtPayload(authToken);
        const stillValid = payload && typeof payload.exp === 'number' && payload.exp * 1000 > Date.now();
        if (stillValid) {
            // 즉시 UI 반영 — /api/auth/me 왕복 대기 없음
            currentUser = {
                id: payload.sub,
                email: payload.email,
                app_metadata: payload.app_metadata || {},
                user_metadata: payload.user_metadata || {}
            };
            updateAuthStateUI(currentUser);
            // 백그라운드 재검증: 서버쪽 무효화/rotation 감지
            apiCall('/api/auth/me', 'GET').then((res) => {
                if (res?.user) {
                    currentUser = res.user;
                } else {
                    localStorage.removeItem('sb-token');
                    authToken = null;
                    currentUser = null;
                    updateAuthStateUI(null);
                }
            }).catch(() => { /* 네트워크 오류 — optimistic 유지 */ });
        } else {
            // 토큰 만료 or 파싱 실패 — 서버에 한번 더 확인 후 판정
            const res = await apiCall('/api/auth/me', 'GET');
            if (res?.user) {
                currentUser = res.user;
                updateAuthStateUI(currentUser);
            } else {
                localStorage.removeItem('sb-token');
                authToken = null;
            }
        }
    }
}

window.addEventListener('DOMContentLoaded', initAuth);
