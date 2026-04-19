# ☁️ Cloudflare Worker 통합 설정 가이드 (CORS 수정본)

브라우저에서 "결과를 준비합니다..." 화면에서 멈추는 주 원인인 **CORS(교차 출처 리소스 공유) 오류를 완벽하게 해결**한 버전입니다. 모든 응답(에러 포함)에 보안 헤더를 강제 적용했습니다.

## 🛠️ 워커 환경 변수 설정 (Variables) 재확인
워커 설정의 `Settings` > `Variables` 메뉴에서 다음 값이 등록되어 있는지 꼭 확인하세요:
- `AI_API_KEY`, `AI_MODEL_NAME`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`

---

## 📄 통합 워커 소스코드 (index.js)

```javascript
export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const origin = request.headers.get("Origin") || "*";

        // 공통 응답 헤더 (CORS 해결의 핵심)
        const corsHeaders = {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, x-session-id",
        };

        // 1. OPTIONS 요청(Preflight) 즉시 처리
        if (request.method === "OPTIONS") {
            return new Response(null, { headers: corsHeaders });
        }

        // 공통 응답 함수 (헤더 누락 방지)
        const jsonResponse = (data, status = 200) => {
            return new Response(JSON.stringify(data), {
                status,
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            });
        };

        try {
            // --- A. AI 리딩 엔드포인트 (/api/interpret) ---
            if (url.pathname.endsWith("/api/interpret") && request.method === "POST") {
                const { question, cards, spreadPositions } = await request.json();

                const cardInfo = cards.map((c, i) => 
                    `${i + 1}. ${spreadPositions[i].title}: ${c.name} (${c.isReversed ? '역방향' : '정방향'}) - 의미: ${c.isReversed ? c.reversed : c.upright}`
                ).join('\n');

                const systemPrompt = `당신은 깊이 있는 통찰력을 가진 전문 타로 마스터입니다.
사용자의 질문: "${question}"
뽑힌 카드 (켈틱 크로스 배열):\n${cardInfo}

위 정보를 바탕으로 전문적인 리딩을 한국어로 작성하세요. 질문자에게 도움이 될 조언도 포함해 주세요.`;

                const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${env.AI_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        model: env.AI_MODEL_NAME || "llama3-70b-8192",
                        messages: [
                            { role: "system", content: "당신은 타로 마스터입니다." },
                            { role: "user", content: systemPrompt }
                        ],
                        temperature: 0.7,
                    }),
                });

                const data = await response.json();
                if (!response.ok) return jsonResponse({ error: "AI 에러", details: data }, 500);

                return jsonResponse({ interpretation: data.choices[0].message.content });
            }

            // --- B. 인증 중계 (/api/auth/*) ---
            if (url.pathname.includes("/api/auth/")) {
                const action = url.pathname.split("/").pop();
                const body = await request.json();
                body.action = action;

                const edgeRes = await fetch(`${env.SUPABASE_URL}/functions/v1/handle-auth`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": request.headers.get("Authorization") || "",
                        "apikey": env.SUPABASE_ANON_KEY
                    },
                    body: JSON.stringify(body)
                });

                return jsonResponse(await edgeRes.json(), edgeRes.status);
            }

            // --- C. 데이터베이스 중계 (/api/readings) ---
            if (url.pathname.endsWith("/api/readings") && request.method === "POST") {
                const edgeRes = await fetch(`${env.SUPABASE_URL}/functions/v1/handle-readings`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": request.headers.get("Authorization") || "",
                        "x-session-id": request.headers.get("x-session-id") || "",
                        "apikey": env.SUPABASE_ANON_KEY
                    },
                    body: JSON.stringify(await request.json())
                });

                return jsonResponse(await edgeRes.json(), edgeRes.status);
            }

            // 일치하는 엔드포인트 없음
            return jsonResponse({ error: "경로를 찾을 수 없습니다: " + url.pathname }, 404);

        } catch (error) {
            return jsonResponse({ error: error.message }, 500);
        }
    },
};
```
