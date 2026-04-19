-- ============================================
-- Tarobot 관리자 기능 설정 SQL
-- Supabase SQL Editor에서 실행하세요
-- ============================================

-- 1. 관리자용 RLS 정책 추가
-- 관리자(app_metadata.role = 'admin')는 모든 readings를 조회할 수 있음
CREATE POLICY "Admins can view all readings"
ON public.readings
FOR SELECT
USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

-- 2. 사용자 통계 함수 (관리자 전용)
-- 관리자 대시보드에서 사용자별 리딩 통계를 보여주기 위한 함수
CREATE OR REPLACE FUNCTION public.get_user_stats()
RETURNS TABLE (
    user_id TEXT,
    reading_count BIGINT,
    last_reading TIMESTAMPTZ
)
LANGUAGE sql
SECURITY DEFINER
AS $$
    -- 관리자 권한 확인
    SELECT 
        COALESCE(r.user_id::text, '비회원-' || r.session_id::text) as user_id,
        COUNT(*) as reading_count,
        MAX(r.created_at) as last_reading
    FROM public.readings r
    WHERE (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    GROUP BY COALESCE(r.user_id::text, '비회원-' || r.session_id::text)
    ORDER BY reading_count DESC
    LIMIT 100;
$$;

-- 3. 특정 사용자를 관리자로 지정하기
-- 아래 SQL에서 이메일을 본인 이메일로 변경한 후 실행하세요!
-- ⚠️ 반드시 본인 이메일로 변경한 후 실행!
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'god8night@naver.com';

-- 확인: 관리자가 잘 설정되었는지 확인
-- SELECT id, email, raw_app_meta_data FROM auth.users WHERE email = '이메일';
