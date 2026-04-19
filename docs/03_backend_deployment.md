# Cloudflare Worker 백엔드 배포 가이드

Cloudflare Workers 대시보드[`https://taroai.god8night.workers.dev/`]에 적용할 최종 소스 코드입니다.

## 1. 백엔드 소스 코드 (index.js)

아래 코드를 전체 복사하여 Cloudflare Worker 에디터에 붙여넣으세요.

```javascript
export default {
    async fetch(request, env, ctx) {
        // 1. CORS Preflight 핸들링
        if (request.method === "OPTIONS") {
            return new Response(null, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                },
            });
        }

        if (request.method !== "POST") {
            return new Response("Method Not Allowed", { status: 405 });
        }

        try {
            const { question, cards, spreadPositions } = await request.json();

            // 10장의 카드 정보를 텍스트로 변환
            const cardInfo = cards.map((c, i) => 
                `${i + 1}. ${spreadPositions[i].title}: ${c.name} (${c.isReversed ? '역방향' : '정방향'}) - 의미: ${c.isReversed ? c.reversed : c.upright}`
            ).join('\n');

            // 프롬프트 구성 (보안을 위해 서버사이드에서 정의)
            const systemPrompt = `당신은 깊이 있는 통찰력을 가진 전문 타로 마스터입니다.
사용자의 질문: "${question}"
뽑힌 카드 (켈틱 크로스 배열):\n${cardInfo}

위 정보를 바탕으로 다음 규칙을 지켜 전문적인 리딩을 제공하세요:
1. 각 카드의 상징과 질문자의 상황을 연결하여 구체적이고 논리적인 해석을 제공할 것.
2. 전체적인 상황의 흐름(과거-현재-미래)을 짚어주고, 질문자에게 도움이 될 조언을 포함할 것.
3. 말투는 공손하되 신비롭고 확신에 찬 어조를 유지할 것.
4. 답변은 한국어로 작성할 것.`;

            // OpenAI 호환 API 호출 (Groq 등)
            // Settings > Variables > Environment Variables에서 설정한 값을 가져옵니다.
            const api_key = env.AI_API_KEY; 
            const model_name = env.AI_MODEL_NAME || "openai/gpt-oss-120b";
            
            const API_URL = "https://api.groq.com/openai/v1/chat/completions"; 

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${api_key}`,
                },
                body: JSON.stringify({
                    model: model_name,
                    messages: [
                        { role: "system", content: "당신은 타로 리프레젠테이션 전문가입니다." },
                        { role: "user", content: systemPrompt }
                    ],
                    temperature: 0.7,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                return new Response(JSON.stringify({ error: "AI 리딩 중 오류가 발생했습니다.", details: data }), {
                    status: response.status,
                    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
                });
            }

            const interpretation = data.choices[0].message.content;

            return new Response(JSON.stringify({ interpretation }), {
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            });

        } catch (err) {
            return new Response(JSON.stringify({ error: err.message }), {
                status: 500,
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
            });
        }
    },
};
```

## 2. 시크릿 키(Secret) 설정 방법

Cloudflare 대시보드에서 다음 순서로 키를 입력하세요.

1. Cloudflare Workers 대시보드 접속
2. `taroai` 워커 선택
3. **Settings** 탭 클릭
4. **Variables** 메뉴 클릭
5. **Environment Variables** 항목에서 `Add variable` 클릭
6. 다음 두 개의 변수를 추가하고 **Encrypt**를 눌러 보호하세요.
   - 명칭: `AI_API_KEY` / 값: `<Groq API Key>` (실제 값은 `API's.md` 에서 확인)
   - 명칭: `AI_MODEL_NAME` / 값: `openai/gpt-oss-120b`
7. **Save and deploy** 클릭

이제 백엔드 설정이 완료되었습니다!
