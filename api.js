const DEFAULT_WORKER_URL = 'https://taroai.god8night.workers.dev';

export const CONFIG = {
    WORKER_URL: (typeof window !== 'undefined' && window.CONFIG?.WORKER_URL) || DEFAULT_WORKER_URL
};

export async function apiCall(path, method = 'POST', body = null, tokenOverride = null) {
    const token = tokenOverride || localStorage.getItem('sb-token');
    const headers = { 'Content-Type': 'application/json' };

    if (token) headers['Authorization'] = `Bearer ${token}`;

    const sessionId = localStorage.getItem('tarobot_session_id');
    if (sessionId && path.includes('/api/readings')) {
        headers['x-session-id'] = sessionId;
    }

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    const res = await fetch(`${CONFIG.WORKER_URL}${path}`, options);

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: { message: `HTTP status ${res.status}` } }));
        if (res.status === 401 && token) localStorage.removeItem('sb-token');
        return { error: errorData.error || errorData, status: res.status };
    }

    return await res.json();
}
