import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-session-id',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { action, email, password, redirectTo } = await req.json()

    let result;
    if (action === 'signup') {
      result = await supabaseClient.auth.signUp({ email, password })
    } else if (action === 'login') {
      result = await supabaseClient.auth.signInWithPassword({ email, password })
    } else if (action === 'reset') {
      result = await supabaseClient.auth.resetPasswordForEmail(email, { redirectTo })
    } else if (action === 'update') {
      // Get the JWT from the Authorization header
      const authHeader = req.headers.get('Authorization')
      if (!authHeader) throw new Error('No authorization header')
      const token = authHeader.replace('Bearer ', '')
      
      const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)
      if (userError || !user) throw userError || new Error('User not found')

      result = await supabaseClient.auth.updateUser({ password })
    } else {
      throw new Error('Invalid action')
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: { message: error.message } }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
