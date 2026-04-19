-- Tarobot Supabase Schema

-- 1. Readings Table (타로 점술 기록)
CREATE TABLE IF NOT EXISTS public.readings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- 회원용
    session_id UUID NOT NULL, -- 비회원/익명 세션 식별자
    question TEXT NOT NULL,
    cards JSONB NOT NULL,
    interpretation TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE public.readings ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies

-- [회원] 자신의 점술 기록만 조회/생성 가능
CREATE POLICY "Users can manage their own readings" 
ON public.readings 
FOR ALL
USING (auth.uid() = user_id);

-- [비회원/익명] 자신의 session_id와 일치하는 기록만 조회 가능
CREATE POLICY "Anon can view their own session readings"
ON public.readings
FOR SELECT
USING (auth.role() = 'anon' AND session_id = (current_setting('request.headers')::json->>'x-session-id')::uuid);

-- [비회원/익명] 기록 생성 가능 (세션 ID 필수)
CREATE POLICY "Anon can insert readings"
ON public.readings
FOR INSERT
WITH CHECK (auth.role() = 'anon');

-- 4. Tarot Cards Reference Table (선택 사항 - 관리용)
CREATE TABLE IF NOT EXISTS public.tarot_cards (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    upright TEXT,
    reversed TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 카드 테이블은 모두가 조회 가능
ALTER TABLE public.tarot_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view tarot cards" ON public.tarot_cards FOR SELECT USING (true);
