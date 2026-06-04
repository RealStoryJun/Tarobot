// same-origin: 정적 자산과 API 를 같은 Worker 가 서빙하므로 기본값은 상대경로('').
// 로컬 분리 실행 등에서는 window.CONFIG.WORKER_URL 로 절대 origin override 가능.
const DEFAULT_WORKER_URL = '';
const WORKER_URL = (typeof window !== 'undefined' && window.CONFIG?.WORKER_URL) || DEFAULT_WORKER_URL;

export async function apiCall(path, method = 'POST', body = null) {
    const token = localStorage.getItem('sb-token');
    const headers = { 'Content-Type': 'application/json' };

    if (token) headers['Authorization'] = `Bearer ${token}`;

    const sessionId = localStorage.getItem('tarobot_session_id');
    if (sessionId && path.includes('/api/readings')) {
        headers['x-session-id'] = sessionId;
    }

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    const res = await fetch(`${WORKER_URL}${path}`, options);

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: { message: `HTTP status ${res.status}` } }));
        if (res.status === 401 && token) localStorage.removeItem('sb-token');
        return { error: errorData.error || errorData, status: res.status };
    }

    return await res.json();
}
