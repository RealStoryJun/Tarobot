# Supabase & Cloudflare 클라우드 이중 보안 가이드

본 프로젝트는 보안을 위해 **Cloudflare Worker(Gateway)**와 **Supabase Edge Functions(Internal Logic)**를 연동한 이중 보안 프록시 아키텍처를 사용합니다. 
브라우저는 오직 워커 주소만 알 수 있으며, 실제 수파베이스 프로젝트 정보는 서버사이드에서 완벽하게 은폐됩니다.

## 🚀 설정 방법

1. [Supabase Dashboard](https://supabase.com/dashboard)에 접속하여 프로젝트를 선택합니다.
2. 왼쪽 메뉴에서 **SQL Editor**를 클릭합니다.
3. **+ New query**를 눌러 빈 에디터를 엽니다.
4. 아래의 SQL 코드를 전체 복사하여 붙여넣고 **Run** 버튼을 클릭합니다.

## 📝 통합 SQL 코드

```sql
-- 1. 기존 정책 및 테이블 초기화 (있을 경우)
DROP TABLE IF EXISTS public.readings;

-- 2. 점술 기록 테이블 생성
CREATE TABLE public.readings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- 회원용 (옵션)
    session_id UUID NOT NULL, -- 기기별 익명 세션 ID (필수)
    question TEXT NOT NULL,
    cards JSONB NOT NULL,
    interpretation TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 테이블 보안(RLS) 활성화
ALTER TABLE public.readings ENABLE ROW LEVEL SECURITY;

-- 4. 보안 정책(Policy) 설정

-- [회원] 자신의 Auth ID가 기록된 데이터는 모든 권한 허용
CREATE POLICY "Logged-in users can manage their readings" 
ON public.readings 
FOR ALL
USING (auth.uid() = user_id);

-- [비회원/익명] 본인의 기기(Session ID)로 생성한 데이터만 조회 가능
-- 앱에서 보낸 'x-session-id' 헤더 값을 검증합니다.
CREATE POLICY "Anon can view their own session readings"
ON public.readings
FOR SELECT
USING (
  auth.role() = 'anon' 
  AND session_id = (current_setting('request.headers')::json->>'x-session-id')::uuid
);

-- [비회원/익명] 데이터 생성은 누구나 가능
CREATE POLICY "Anon can insert readings"
ON public.readings
FOR INSERT
WITH CHECK (auth.role() = 'anon');

-- 5. 타로 카드 정보 테이블 (조회 전용)
CREATE TABLE IF NOT EXISTS public.tarot_cards (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    upright TEXT,
    reversed TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.tarot_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view tarot cards" ON public.tarot_cards FOR SELECT USING (true);

-- 설정 완료 메시지 출력
SELECT '타로봇 보안 설정이 성공적으로 완료되었습니다!' as status;
```

## 🔐 인증(Auth) 추가 설정 (필수)

로그인과 회원가입이 정상적으로 작동하려면 Supabase 대시보드에서 다음 설정을 반드시 확인해야 합니다.

### 1. 이메일 확인(Confirm Email) 비활성화 (테스트용)
기본적으로 Supabase는 가입 후 이메일 인증을 거쳐야 로그인이 가능합니다. 인증 없이 바로 테스트하려면 이 기능을 꺼주세요.
1. `Authentication` > `Providers` > `Email` 메뉴로 들어갑니다.
2. **Confirm email** 옵션과 **Secure email change** 옵션을 **OFF**로 설정합니다.
3. 상단의 **Save**를 누릅니다.

### 2. 사이트 URL 설정 (비밀번호 재설정용)
비밀번호 찾기 메일 등이 올바른 주소로 돌아오게 하려면 URL을 등록해야 합니다.
1. `Authentication` > `URL Configuration`으로 이동합니다.
2. **Site URL**에 로컬 주소(예: `http://localhost:3000` 또는 `http://127.0.0.1:5500`)를 입력합니다.
3. 배포 후에는 실제 도메인 주소로 변경해 주세요.

## 🛡️ 백엔드(Worker & Edge) 웹 UI 설정 가이드 (CLI 불필요)

터미널이나 CLI 설치 없이, 수파베이스와 클라우드플레어 대시보드(웹 화면)에서 직접 설정하는 방법입니다.

### 1단계: Supabase Edge Functions 설정 (대시보드)
1.  **수파베이스 대시보드** 접속 > `Edge Functions` 메뉴 클릭.
2.  `Create a new function` 버튼을 눌러 함수를 생성합니다. (이름: `handle-auth`, `handle-readings` 각각 생성)
3.  함수 에디터 창에 아래 제공되는 각 함수의 **[전체 코드]**를 복사하여 붙여넣고 `Save` 하세요.
4.  **비밀값(Secrets) 등록**: `Settings` > `Edge Functions` 메뉴에서 `Add Secret`을 눌러 `SUPABASE_URL`과 `SUPABASE_ANON_KEY`를 각각 등록합니다.

---

### 2단계: Cloudflare Workers 설정 (대시보드)
1.  **클라우드플레어 대시보드** 접속 > `Workers & Pages` 클릭.
2.  `Create application` > `Create Worker`를 눌러 새 워커를 만듭니다.
3.  `Edit Code`를 클릭하여 기본 코드를 모두 지우고, 아래 **[워커 전체 코드]**를 붙여넣은 뒤 `Save and deploy` 하세요.
4.  **비밀값(Secrets) 등록**: 워커 페이지의 `Settings` > `Variables` 섹션에서 `Add variable`을 누르되, 반드시 **[Encrypt]** 버튼을 눌러 Secret으로 만듭니다.
    - `SUPABASE_URL`: 수파베이스 주소
    - `SUPABASE_ANON_KEY`: 수파베이스 anon 키
    - `AI_API_KEY`: Groq API 키

---

## 📄 복사용 전체 코드 (Copy & Paste)

<details>
<summary>👉 [Supabase] handle-auth 코드 보기</summary>

```typescript
// handle-auth/index.ts 내용
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-session-id',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const supabaseClient = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '')
    const { action, email, password, redirectTo } = await req.json()
    let result;
    if (action === 'signup') result = await supabaseClient.auth.signUp({ email, password })
    else if (action === 'login') result = await supabaseClient.auth.signInWithPassword({ email, password })
    else if (action === 'reset') result = await supabaseClient.auth.resetPasswordForEmail(email, { redirectTo })
    else if (action === 'update') {
      const authHeader = req.headers.get('Authorization')
      if (!authHeader) throw new Error('No authorization header')
      const token = authHeader.replace('Bearer ', '')
      const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)
      if (userError || !user) throw userError || new Error('User not found')
      result = await supabaseClient.auth.updateUser({ password })
    } else throw new Error('Invalid action')
    return new Response(JSON.stringify(result), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: { message: error.message } }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 })
  }
})
```
</details>

<details>
<summary>👉 [Supabase] handle-readings 코드 보기</summary>

```typescript
// handle-readings/index.ts 내용
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-session-id',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const supabaseClient = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '')
    const payload = await req.json()
    const sessionId = req.headers.get('x-session-id')
    const authHeader = req.headers.get('Authorization')
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
      if (authError || !user) throw new Error('Unauthorized')
      payload.user_id = user.id
    }
    payload.session_id = sessionId
    const { data, error } = await supabaseClient.from('readings').insert([payload]).select()
    if (error) throw error
    return new Response(JSON.stringify({ data }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: { message: error.message } }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 })
  }
})
```
</details>

<details>
<summary>👉 [Cloudflare] Worker 게이트웨이 코드 보기</summary>

```javascript
// Cloudflare Worker index.js 내용
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "*";
    const corsHeaders = {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, x-session-id",
    };
    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    try {
      if (url.pathname === "/api/interpret" && request.method === "POST") {
        const body = await request.json();
        const { question, cards, spreadPositions } = body;
        const prompt = `질문: ${question}\n카드: ${cards.map((c, i) => `${spreadPositions[i].title}: ${c.name}`).join(', ')}\n켈틱 크로스 깊은 리딩을 한국어로 작성하세요.`;
        const aiRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: { "Authorization": `Bearer ${env.AI_API_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({ model: "llama3-70b-8192", messages: [{ role: "user", content: prompt }] })
        });
        const aiData = await aiRes.json();
        return new Response(JSON.stringify({ interpretation: aiData.choices[0].message.content }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      if (url.pathname.startsWith("/api/auth/")) {
        const action = url.pathname.replace("/api/auth/", "");
        const body = await request.json();
        body.action = action;
        const edgeRes = await fetch(`${env.SUPABASE_URL}/functions/v1/handle-auth`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": request.headers.get("Authorization") || "", "apikey": env.SUPABASE_ANON_KEY },
          body: JSON.stringify(body)
        });
        return new Response(JSON.stringify(await edgeRes.json()), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: edgeRes.status });
      }

      if (url.pathname === "/api/readings" && request.method === "POST") {
        const edgeRes = await fetch(`${env.SUPABASE_URL}/functions/v1/handle-readings`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": request.headers.get("Authorization") || "", "x-session-id": request.headers.get("x-session-id") || "", "apikey": env.SUPABASE_ANON_KEY },
          body: JSON.stringify(await request.json())
        });
        return new Response(JSON.stringify(await edgeRes.json()), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: edgeRes.status });
      }
      return new Response("Not Found", { status: 404 });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
  }
};
```
</details>

---

## ✅ 최종 확인
이 구조는 **브라우저 -> Cloudflare -> Supabase**로 이어지는 완벽한 은폐 체계입니다. 웹 대시보드에서 `Save`만 하면 즉시 적용됩니다.
