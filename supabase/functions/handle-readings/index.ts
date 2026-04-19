// 리딩 저장 Edge Function
// - 클라이언트 payload 화이트리스트 (임의 컬럼 주입 차단)
// - 인증된 경우에만 user_id 기록 (클라이언트 제공 user_id는 무시)
// - session_id 는 반드시 헤더에서만 전달

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-session-id',
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status,
  })

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const authHeader = req.headers.get('Authorization') || ''
    const sessionId = req.headers.get('x-session-id') || ''

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader, 'x-session-id': sessionId },
        },
      },
    )

    const raw = await req.json()
    const row: Record<string, unknown> = {
      question: raw.question,
      cards: raw.cards,
      interpretation: raw.interpretation,
    }

    if (!row.question || !row.cards || !row.interpretation) {
      return json({ error: { message: 'question/cards/interpretation 는 필수입니다.' } }, 400)
    }

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user } } = await supabaseClient.auth.getUser(token)
      if (user) row.user_id = user.id
    }

    if (sessionId) row.session_id = sessionId

    const { data, error } = await supabaseClient
      .from('readings')
      .insert([row])
      .select()

    if (error) throw error

    return json({ data })
  } catch (error) {
    return json({ error: { message: (error as Error).message } }, 400)
  }
})
