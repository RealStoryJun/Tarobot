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
    // 첫 포커스 가능한 요소로 이동
    requestAnimationFrame(() => {
        const focusables = getFocusables(modal);
        if (focusables[0]) focusables[0].focus();
    });
    document.addEventListener('keydown', trapFocusHandler);
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
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-password-confirm').value;

    if (!email || !password) return toast('모두 입력해 주세요.', 'warning');
    if (password !== confirm) return toast('비밀번호가 일치하지 않습니다.', 'warning');
    if (!validatePassword(password)) return toast('비밀번호 규칙 위반 — 영문+숫자+특수문자 8자 이상', 'warning');

    const result = await apiCall('/api/auth/signup', 'POST', { email, password });
    if (result.error) {
        toast('가입 실패: ' + result.error.message, 'error');
    } else {
        toast('회원가입 성공! 메일 확인이 필요할 수 있습니다.', 'success');
        closeModal();
    }
}

async function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const result = await apiCall('/api/auth/login', 'POST', { email, password });
    if (result.error) {
        toast('로그인 실패: ' + result.error.message, 'error');
    } else {
        if (result.data?.session) {
            authToken = result.data.session.access_token;
            localStorage.setItem('sb-token', authToken);
            currentUser = result.data.user;
            updateAuthStateUI(currentUser);
        }
        closeModal();
    }
}

async function handleLogout() {
    localStorage.removeItem('sb-token');
    authToken = null;
    currentUser = null;
    window.location.reload();
}

async function handleResetPassword() {
    const email = document.getElementById('reset-email').value;
    const result = await apiCall('/api/auth/reset', 'POST', { 
        email, 
        redirectTo: window.location.origin + window.location.pathname + '?type=recovery' 
    });
    
    if (result.error) {
        toast('실패: ' + result.error.message, 'error');
    } else {
        toast('이메일을 확인해 주세요.', 'success');
        closeModal();
    }
}

async function handlePasswordChange() {
    const password = document.getElementById('change-password').value;
    const confirm = document.getElementById('change-password-confirm').value;

    if (password !== confirm) return toast('비밀번호가 일치하지 않습니다.', 'warning');
    if (!validatePassword(password)) return toast('비밀번호 규칙 위반', 'warning');

    const result = await apiCall('/api/auth/update', 'POST', { password });
    if (result.error) {
        toast('변경 실패: ' + result.error.message, 'error');
    } else {
        toast('비밀번호 변경 완료', 'success');
        closeModal();
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

    // 저장된 토큰으로 현재 세션 확인
    if (authToken) {
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

window.addEventListener('DOMContentLoaded', initAuth);
