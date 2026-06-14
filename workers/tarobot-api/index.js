// Cloudflare Worker: Tarobot API Gateway
// - Groq AI 리딩 (무인증)
// - Supabase Auth / Readings 중계
// - 관리자 엔드포인트
// - 구조화 로깅 (console.log → CF Logs)
// - 표준 에러 스키마: { error: { code, message, hint? } }

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://tarot.realstoryjun.co.kr",
  "https://realstoryjun.co.kr",
];

const ALLOWED_ORIGIN_SUFFIXES = [".pages.dev"];

function isOriginAllowed(origin) {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  try {
    const host = new URL(origin).hostname;
    return ALLOWED_ORIGIN_SUFFIXES.some((suffix) => host.endsWith(suffix));
  } catch {
    return false;
  }
}

function buildCors(origin) {
  const allowOrigin = isOriginAllowed(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-session-id",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function json(cors, body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

function errorResponse(cors, code, message, status, hint) {
  const body = { error: { code, message } };
  if (hint) body.error.hint = hint;
  return json(cors, body, status);
}

async function getUser(request, env) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) return null;
  try {
    const res = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
      headers: { Authorization: authHeader, apikey: env.SUPABASE_ANON_KEY },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

const isAdmin = (user) => user?.app_metadata?.role === "admin";

async function proxyJson(targetUrl, request, env, body) {
  const res = await fetch(targetUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: request.headers.get("Authorization") || "",
      "x-session-id": request.headers.get("x-session-id") || "",
      apikey: env.SUPABASE_ANON_KEY,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return { data, status: res.status };
}

// Supabase GoTrue(Auth) REST 직접 호출 — Edge Function 우회로 레이턴시 단축
async function gotrueRequest(env, path, method, extraHeaders, body) {
  const res = await fetch(`${env.SUPABASE_URL}/auth/v1${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      apikey: env.SUPABASE_ANON_KEY,
      ...extraHeaders,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let parsed;
  try { parsed = text ? JSON.parse(text) : {}; }
  catch { parsed = { msg: text }; }
  return { status: res.status, body: parsed };
}

// GoTrue 응답을 Supabase JS SDK 형태 `{ data: { user, session }, error }` 로 정규화
// 프론트(auth.js) 가 기대하는 shape 를 깨지 않기 위함
function wrapAuthResponse(gotrue) {
  const { status, body } = gotrue;
  if (status >= 400) {
    return {
      data: { user: null, session: null },
      error: {
        message: body?.msg || body?.error_description || body?.error || "Authentication error",
        status,
        code: body?.error_code || body?.code || null,
      },
    };
  }
  let user = null;
  let session = null;
  if (body?.access_token) {
    session = {
      access_token: body.access_token,
      token_type: body.token_type,
      expires_in: body.expires_in,
      expires_at: body.expires_at,
      refresh_token: body.refresh_token,
    };
    user = body.user || null;
  } else if (body?.user || body?.session) {
    user = body.user || null;
    session = body.session || null;
  } else if (body?.id && body?.email) {
    user = body;
  }
  return { data: { user, session }, error: null };
}

async function dispatch(request, env, url, cors) {
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: cors });
  }

  // ===== AI 리딩 (무인증) =====
  if (url.pathname === "/api/interpret" && request.method === "POST") {
    const { question, cards, spreadPositions } = await request.json();

    const cardInfo = cards
      .map((c, i) => `[${i + 1}번 자리: ${spreadPositions[i].title}] ${c.name} (${c.isReversed ? '역방향' : '정방향'})`)
      .join('\n');

    const prompt = `당신은 30년 경력의 타로 마스터입니다. 지금 손님 한 분이 당신 앞에 앉아 켈틱 크로스 10장을 펼쳤습니다.

손님의 고민: "${question}"

펼쳐진 카드:
${cardInfo}

[중요한 규칙]
1. 절대로 **, ##, *, - 같은 마크다운 기호를 사용하지 마세요. 순수한 한국어 문장으로만 작성하세요.
2. "1번 카드는... 2번 카드는..." 식으로 번호를 매겨 나열하지 마세요.
3. 대신, 카드들의 이야기를 하나의 자연스러운 흐름으로 엮어서 들려주세요.
4. 마치 실제로 손님 앞에서 카드를 바라보며 이야기하듯, 따뜻하고 친밀한 말투로 해주세요.
5. 과거→현재→미래의 흐름을 자연스럽게 풀어가며, 중간중간 "여기 이 카드를 보세요" 같은 현장감 있는 표현을 써주세요.
6. 마지막에는 손님의 마음에 힘이 되는 따뜻한 한마디로 마무리해 주세요.
7. 전체 분량은 반드시 800자에서 1200자 사이여야 합니다. 800자 미만으로 짧게 끝내지 마세요. 각 카드의 의미와 카드들 간의 관계를 충분히 풀어쓰세요.
8. 답변은 반드시 손님이 한 질문 "${question}" 에 직접 답하는 형태여야 합니다. 카드 일반론이나 추상적 인생론으로 흐르지 말고, 모든 카드 해석이 이 질문의 맥락 안에서 의미를 갖도록 풀어쓰세요. 마지막 한두 문장은 이 질문에 대한 명확하고 구체적인 답으로 마무리하세요.`;

    const aiResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.AI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: env.AI_MODEL_NAME || "llama3-70b-8192",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    const aiData = await aiResponse.json();
    if (!aiData?.choices?.[0]?.message?.content) {
      return errorResponse(cors, "AI_EMPTY", "AI 응답이 비어있습니다.", 502,
        "Groq 응답 구조를 확인하세요. env.AI_API_KEY / AI_MODEL_NAME 점검 필요.");
    }
    return json(cors, { interpretation: aiData.choices[0].message.content });
  }

  // ===== 현재 세션 유저 =====
  if (url.pathname === "/api/auth/me" && request.method === "GET") {
    const user = await getUser(request, env);
    if (!user) return errorResponse(cors, "UNAUTHORIZED", "세션 만료", 401);
    return json(cors, { user });
  }

  // ===== 인증: GoTrue 직접 호출 (Edge Function 우회) =====
  if (url.pathname.startsWith("/api/auth/") && request.method === "POST") {
    const action = url.pathname.replace("/api/auth/", "");
    const reqBody = await request.json();

    if (action === "signup") {
      const r = await gotrueRequest(env, "/signup", "POST", {}, { email: reqBody.email, password: reqBody.password });
      return json(cors, wrapAuthResponse(r), 200);
    }
    if (action === "login") {
      const r = await gotrueRequest(env, "/token?grant_type=password", "POST", {}, { email: reqBody.email, password: reqBody.password });
      return json(cors, wrapAuthResponse(r), 200);
    }
    if (action === "reset") {
      const redirectQ = reqBody.redirectTo ? `?redirect_to=${encodeURIComponent(reqBody.redirectTo)}` : "";
      const r = await gotrueRequest(env, `/recover${redirectQ}`, "POST", {}, { email: reqBody.email });
      if (r.status >= 400) {
        return json(cors, { data: null, error: { message: r.body?.msg || "Reset failed", status: r.status } }, 200);
      }
      return json(cors, { data: {}, error: null }, 200);
    }
    if (action === "update") {
      const authHeader = request.headers.get("Authorization");
      if (!authHeader) {
        return json(cors, { data: { user: null }, error: { message: "No authorization header" } }, 200);
      }
      const r = await gotrueRequest(env, "/user", "PUT", { Authorization: authHeader }, { password: reqBody.password });
      return json(cors, wrapAuthResponse(r), 200);
    }
    return errorResponse(cors, "UNKNOWN_ACTION", `알 수 없는 인증 액션: ${action}`, 400);
  }

  // ===== 리딩 저장 =====
  if (url.pathname === "/api/readings" && request.method === "POST") {
    const body = await request.json();
    const { data, status } = await proxyJson(
      `${env.SUPABASE_URL}/functions/v1/handle-readings`, request, env, body
    );
    return json(cors, data, status);
  }

  // ===== 내 리딩 이력 =====
  if (url.pathname === "/api/my-readings" && request.method === "GET") {
    const user = await getUser(request, env);
    if (!user) {
      return errorResponse(cors, "UNAUTHORIZED", "로그인이 필요합니다.", 401,
        "Supabase 세션 토큰을 Authorization 헤더에 포함시키세요.");
    }
    const res = await fetch(
      `${env.SUPABASE_URL}/rest/v1/readings?user_id=eq.${user.id}&order=created_at.desc&limit=50`,
      { headers: { apikey: env.SUPABASE_ANON_KEY, Authorization: request.headers.get("Authorization") } }
    );
    const data = await res.json();
    return json(cors, { data });
  }

  // ===== 관리자: 권한 체크 =====
  if (url.pathname === "/api/admin/check" && request.method === "GET") {
    const user = await getUser(request, env);
    return json(cors, { isAdmin: isAdmin(user), email: user?.email || null });
  }

  // ===== 관리자: 전체 리딩 =====
  if (url.pathname === "/api/admin/readings" && request.method === "GET") {
    const user = await getUser(request, env);
    if (!isAdmin(user)) return errorResponse(cors, "FORBIDDEN", "관리자 권한이 필요합니다.", 403);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = 30;
    const offset = (page - 1) * limit;
    const res = await fetch(
      `${env.SUPABASE_URL}/rest/v1/readings?order=created_at.desc&limit=${limit}&offset=${offset}&select=id,question,created_at,user_id,session_id`,
      { headers: { apikey: env.SUPABASE_ANON_KEY, Authorization: request.headers.get("Authorization"), Prefer: "count=exact" } }
    );
    const data = await res.json();
    const total = parseInt(res.headers.get("content-range")?.split("/")[1] || "0", 10);
    return json(cors, { data, total });
  }

  // ===== 관리자: 유저 통계 =====
  if (url.pathname === "/api/admin/users" && request.method === "GET") {
    const user = await getUser(request, env);
    if (!isAdmin(user)) return errorResponse(cors, "FORBIDDEN", "관리자 권한이 필요합니다.", 403);
    const res = await fetch(`${env.SUPABASE_URL}/rest/v1/rpc/get_user_stats`, {
      method: "POST",
      headers: { apikey: env.SUPABASE_ANON_KEY, Authorization: request.headers.get("Authorization"), "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    return json(cors, { data });
  }

  return errorResponse(cors, "NOT_FOUND", `경로를 찾을 수 없습니다: ${url.pathname}`, 404);
}

function logRequest(request, url, response, started, extra = {}) {
  const entry = {
    level: extra.level || "info",
    ts: new Date().toISOString(),
    method: request.method,
    path: url.pathname,
    status: response?.status ?? 0,
    duration_ms: Date.now() - started,
    ip: request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For") || null,
    origin: request.headers.get("Origin") || null,
    ua: request.headers.get("User-Agent") || null,
    ...extra,
  };
  if (entry.level === "error") console.error(JSON.stringify(entry));
  else console.log(JSON.stringify(entry));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = buildCors(request.headers.get("Origin"));
    const started = Date.now();

    try {
      const response = await dispatch(request, env, url, cors);
      logRequest(request, url, response, started);
      return response;
    } catch (error) {
      const response = errorResponse(cors, "INTERNAL", error.message || "서버 오류", 500);
      logRequest(request, url, response, started, { level: "error", error: error.message, stack: error.stack });
      return response;
    }
  },

  // Supabase 무료 플랜 inactivity pause 방지 — Cron Trigger 로 매일 1회
  // 가벼운 REST 쿼리를 보내 DB 활동을 발생시킨다. (wrangler.toml [triggers].crons)
  async scheduled(event, env, ctx) {
    ctx.waitUntil(
      fetch(`${env.SUPABASE_URL}/rest/v1/readings?select=id&limit=1`, {
        headers: { apikey: env.SUPABASE_ANON_KEY },
      })
        .then((r) => console.log(JSON.stringify({ level: "info", cron: "supabase-keepalive", status: r.status, ts: new Date().toISOString() })))
        .catch((e) => console.error(JSON.stringify({ level: "error", cron: "supabase-keepalive", error: e.message })))
    );
  },
};
