# API 키 등록 안내 (실제 값은 커밋 금지)

실제 키는 아래 위치에 **직접 등록**하고, 이 파일을 `API's.md`로 복사해 값만 로컬에 보관하세요.
`API's.md`는 `.gitignore`에 등록되어 있어 저장소에 올라가지 않습니다.

## 1. Groq (AI)
- 등록처: Cloudflare Worker → `wrangler secret put AI_API_KEY` / `AI_MODEL_NAME`
- 값 예시:
  - AI_API_KEY = `<Groq API Key>`
  - AI_MODEL_NAME = `openai/gpt-oss-120b`

## 2. Supabase
- 등록처:
  - Cloudflare Worker → `wrangler secret put SUPABASE_URL` / `SUPABASE_ANON_KEY`
  - Supabase Edge Functions → Dashboard > Settings > Edge Functions > Secrets
- 값 예시:
  - SUPABASE_URL = `https://<project-ref>.supabase.co`
  - SUPABASE_ANON_KEY = `<anon JWT>`
