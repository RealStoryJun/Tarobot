// Cloudflare Worker: Tarobot API Gateway
// - Groq AI 리딩 (무인증)
// - Supabase Auth / Readings 중계
// - 관리자 엔드포인트

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://ai.realstoryjun.co.kr",
  "https://realstoryjun.co.kr",
];

// Pages 미리보기/기본 도메인 (*.pages.dev) 도 허용
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
    "Vary": "Origin",
  };
}

function json(cors, body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
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

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = buildCors(request.headers.get("Origin"));

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    try {
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
7. 전체 분량은 800자에서 1200자 사이로 해주세요.`;

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
        return json(cors, { interpretation: aiData.choices[0].message.content });
      }

      // ===== 현재 세션 유저 정보 =====
      if (url.pathname === "/api/auth/me" && request.method === "GET") {
        const user = await getUser(request, env);
        if (!user) return json(cors, { user: null }, 401);
        return json(cors, { user });
      }

      // ===== 인증 중계 =====
      if (url.pathname.startsWith("/api/auth/")) {
        const action = url.pathname.replace("/api/auth/", "");
        const body = await request.json();
        body.action = action;

        const { data, status } = await proxyJson(
          `${env.SUPABASE_URL}/functions/v1/handle-auth`,
          request,
          env,
          body,
        );
        return json(cors, data, status);
      }

      // ===== 리딩 저장 =====
      if (url.pathname === "/api/readings" && request.method === "POST") {
        const body = await request.json();
        const { data, status } = await proxyJson(
          `${env.SUPABASE_URL}/functions/v1/handle-readings`,
          request,
          env,
          body,
        );
        return json(cors, data, status);
      }

      // ===== 내 리딩 이력 =====
      if (url.pathname === "/api/my-readings" && request.method === "GET") {
        const user = await getUser(request, env);
        if (!user) return json(cors, { error: "로그인이 필요합니다." }, 401);

        const res = await fetch(
          `${env.SUPABASE_URL}/rest/v1/readings?user_id=eq.${user.id}&order=created_at.desc&limit=50`,
          {
            headers: {
              apikey: env.SUPABASE_ANON_KEY,
              Authorization: request.headers.get("Authorization"),
            },
          },
        );
        const data = await res.json();
        return json(cors, { data });
      }

      // ===== 관리자 권한 확인 =====
      if (url.pathname === "/api/admin/check" && request.method === "GET") {
        const user = await getUser(request, env);
        return json(cors, { isAdmin: isAdmin(user), email: user?.email || null });
      }

      // ===== 관리자: 전체 리딩 =====
      if (url.pathname === "/api/admin/readings" && request.method === "GET") {
        const user = await getUser(request, env);
        if (!isAdmin(user)) return json(cors, { error: "관리자 권한이 필요합니다." }, 403);

        const page = parseInt(url.searchParams.get("page") || "1", 10);
        const limit = 30;
        const offset = (page - 1) * limit;

        const res = await fetch(
          `${env.SUPABASE_URL}/rest/v1/readings?order=created_at.desc&limit=${limit}&offset=${offset}&select=id,question,created_at,user_id,session_id`,
          {
            headers: {
              apikey: env.SUPABASE_ANON_KEY,
              Authorization: request.headers.get("Authorization"),
              Prefer: "count=exact",
            },
          },
        );
        const data = await res.json();
        const total = parseInt(res.headers.get("content-range")?.split("/")[1] || "0", 10);
        return json(cors, { data, total });
      }

      // ===== 관리자: 유저 통계 =====
      if (url.pathname === "/api/admin/users" && request.method === "GET") {
        const user = await getUser(request, env);
        if (!isAdmin(user)) return json(cors, { error: "관리자 권한이 필요합니다." }, 403);

        const res = await fetch(`${env.SUPABASE_URL}/rest/v1/rpc/get_user_stats`, {
          method: "POST",
          headers: {
            apikey: env.SUPABASE_ANON_KEY,
            Authorization: request.headers.get("Authorization"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });
        const data = await res.json();
        return json(cors, { data });
      }

      return new Response("Not Found", { status: 404, headers: cors });
    } catch (error) {
      return json(cors, { error: error.message }, 500);
    }
  },
};
