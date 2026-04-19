import { apiCall } from './api.js';
import { escapeHtml } from './utils.js';

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
function openModal(modal) {
    if (!elements.overlay) return;
    elements.overlay.classList.add('is-active');
    [elements.loginModal, elements.signupModal, elements.resetModal, elements.profileModal].forEach(m => m.classList.add('hidden'));
    modal.classList.remove('hidden');
}

function closeModal() {
    if (!elements.overlay) return;
    elements.overlay.classList.remove('is-active');
}

// --- Auth Logic via Worker Proxy ---

async function handleSignup() {
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-password-confirm').value;

    if (!email || !password) return alert('모두 입력해 주세요.');
    if (password !== confirm) return alert('비밀번호 불일치');
    if (!validatePassword(password)) return alert('보안 규칙 위반 (8자 이상, 특수문자 포함)');

    const result = await apiCall('/api/auth/signup', 'POST', { email, password });
    if (result.error) {
        alert('가입 실패: ' + result.error.message);
    } else {
        alert('회원가입 성공! 메일 확인이 필요할 수 있습니다.');
        closeModal();
    }
}

async function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const result = await apiCall('/api/auth/login', 'POST', { email, password });
    if (result.error) {
        alert('로그인 실패: ' + result.error.message);
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
        alert('실패: ' + result.error.message);
    } else {
        alert('이메일 확인해 보세요.');
        closeModal();
    }
}

async function handlePasswordChange() {
    const password = document.getElementById('change-password').value;
    const confirm = document.getElementById('change-password-confirm').value;

    if (password !== confirm) return alert('불일치');
    if (!validatePassword(password)) return alert('규칙 미준수');

    const result = await apiCall('/api/auth/update', 'POST', { password });
    if (result.error) {
        alert('변경 실패: ' + result.error.message);
    } else {
        alert('비밀번호 변경 완료');
        closeModal();
    }
}

// --- UI Updates ---
function updateAuthStateUI(user) {
    if (!elements.navLoginBtn) return;
    if (user) {
        elements.navLoginBtn.classList.add('hidden');
        elements.navJoinBtn.classList.add('hidden');
        elements.navUserInfo.classList.remove('hidden');
        elements.navUserInfo.style.display = 'flex';
        elements.userNameDisplay.textContent = user.email.split('@')[0];
        // 관리자 링크 표시 여부 확인
        checkAdminStatus();
    } else {
        elements.navLoginBtn.classList.remove('hidden');
        elements.navJoinBtn.classList.remove('hidden');
        elements.navUserInfo.classList.add('hidden');
    }
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

// 내 리딩 이력 로드
async function loadMyHistory() {
    const historyOverlay = document.getElementById('history-modal-overlay');
    const historyList = document.getElementById('history-list');
    if (!historyOverlay || !historyList) return;

    historyOverlay.classList.add('is-active');
    historyList.innerHTML = '<p class="text-center text-gray-400 py-8">로딩 중...</p>';

    try {
        const res = await apiCall('/api/my-readings', 'GET');
        const readings = res.data || [];

        if (readings.length === 0) {
            historyList.innerHTML = '<p class="text-center text-gray-500 py-8">아직 리딩 기록이 없습니다.</p>';
            return;
        }

        historyList.innerHTML = readings.map(r => {
            const date = new Date(r.created_at).toLocaleString('ko-KR', {
                year: 'numeric', month: 'short', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });
            const questionText = r.question || '질문 없음';
            return `
                <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(240,230,140,0.1); border-radius: 12px; padding: 1rem; cursor: pointer;" 
                     onclick="this.querySelector('.detail').classList.toggle('hidden')">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <p style="color: white; font-weight: 600; font-size: 0.9rem;">${escapeHtml(questionText)}</p>
                        <span style="color: #9ca3af; font-size: 0.7rem; flex-shrink: 0; margin-left: 0.5rem;">${date}</span>
                    </div>
                    <div class="detail hidden" style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid rgba(255,255,255,0.05);">
                        <p style="color: #cbd5e1; font-size: 0.8rem; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(r.interpretation || '해석 없음').substring(0, 500)}${(r.interpretation || '').length > 500 ? '...' : ''}</p>
                    </div>
                </div>
            `;
        }).join('');
    } catch (e) {
        historyList.innerHTML = `<p class="text-center text-red-400 py-8">이력을 불러오지 못했습니다: ${e.message}</p>`;
    }
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
                openModal(elements.profileModal);
            }
        });
    }

    if (elements.overlay) {
        elements.overlay.addEventListener('click', (e) => {
            if (e.target === elements.overlay) closeModal();
        });
    }
    
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
