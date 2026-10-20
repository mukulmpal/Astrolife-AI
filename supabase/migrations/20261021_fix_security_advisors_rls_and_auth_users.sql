-- Migration: 20261021_fix_security_advisors_rls_and_auth_users.sql
-- Description: Resolve Supabase Security Advisor critical alerts & warnings:
--   1. auth_users_exposed: Drop insecure public view exposing auth.users (public.admin_user_summary)
--   2. rls_disabled_in_public: Enable RLS on all public tables (palmistry_rule_tuning, cities, etc.)
--   3. Policy Hardening: Tighten user_charts & chat_messages to prevent user_id spoofing
--   4. function_search_path_mutable: Lock down search_path = '' on trigger functions

BEGIN;

-- ----------------------------------------------------------------------------
-- 1. FIX: auth_users_exposed (Critical)
-- ----------------------------------------------------------------------------
DROP VIEW IF EXISTS public.admin_user_summary CASCADE;

CREATE SCHEMA IF NOT EXISTS admin;

CREATE OR REPLACE VIEW admin.user_summary AS
SELECT
  u.id                                                        AS user_id,
  u.email,
  u.created_at                                                AS joined_at,
  COUNT(DISTINCT c.id)                                        AS chart_count,
  COUNT(DISTINCT m.id)                                        AS message_count,
  COUNT(DISTINCT CASE WHEN m.role = 'user' THEN m.id END)    AS question_count,
  MAX(m.created_at)                                           AS last_chat_at,
  MAX(e.created_at)                                           AS last_active_at
FROM auth.users u
LEFT JOIN public.user_charts   c ON c.user_id = u.id
LEFT JOIN public.chat_messages m ON m.user_id = u.id
LEFT JOIN public.user_events   e ON e.user_id = u.id
GROUP BY u.id, u.email, u.created_at
ORDER BY last_active_at DESC NULLS LAST;

REVOKE ALL ON SCHEMA admin FROM anon, authenticated, public;
REVOKE ALL ON admin.user_summary FROM anon, authenticated, public;
GRANT ALL ON SCHEMA admin TO postgres, service_role;
GRANT ALL ON admin.user_summary TO postgres, service_role;


-- ----------------------------------------------------------------------------
-- 2. FIX: rls_disabled_in_public (Critical)
-- ----------------------------------------------------------------------------

-- A. palmistry_rule_tuning
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'palmistry_rule_tuning') THEN
    ALTER TABLE public.palmistry_rule_tuning ENABLE ROW LEVEL SECURITY;
    REVOKE ALL ON TABLE public.palmistry_rule_tuning FROM PUBLIC;
    REVOKE ALL ON TABLE public.palmistry_rule_tuning FROM anon;
    GRANT ALL ON TABLE public.palmistry_rule_tuning TO service_role;

    DROP POLICY IF EXISTS "palmistry_rule_tuning_service_role" ON public.palmistry_rule_tuning;
    CREATE POLICY "palmistry_rule_tuning_service_role"
      ON public.palmistry_rule_tuning
      FOR ALL
      TO authenticated
      USING (auth.role() = 'service_role')
      WITH CHECK (auth.role() = 'service_role');
  END IF;
END $$;

-- B. cities
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'cities') THEN
    ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Allow public read access on cities" ON public.cities;
    CREATE POLICY "Allow public read access on cities"
      ON public.cities
      FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;
END $$;

-- C. Enforce RLS on all known application tables
DO $$
DECLARE
  tbl text;
  app_tables text[] := ARRAY[
    'profiles', 'charts', 'saved_charts', 'user_charts',
    'chat_messages', 'user_events', 'palmistry_sessions',
    'palmistry_feedback', 'usage_limits', 'ai_conversations',
    'ai_messages', 'ai_memory', 'subscriptions', 'payments',
    'reports', 'chart_readings', 'education_progress', 'user_preferences'
  ];
BEGIN
  FOREACH tbl IN ARRAY app_tables
  LOOP
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = tbl) THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', tbl);
    END IF;
  END LOOP;
END $$;

-- D. Universal safety sweep: Enable RLS on ANY table in 'public' schema
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
      AND rowsecurity = false
  ) LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', r.tablename);
    RAISE NOTICE 'Enabled RLS on un-secured table: public.%', r.tablename;
  END LOOP;
END $$;


-- ----------------------------------------------------------------------------
-- 3. FIX: Policy Hardening
-- ----------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_charts') THEN
    DROP POLICY IF EXISTS "Anyone can insert charts" ON public.user_charts;
    DROP POLICY IF EXISTS "Users can insert own charts" ON public.user_charts;

    CREATE POLICY "Users can insert own charts"
      ON public.user_charts
      FOR INSERT
      WITH CHECK (user_id IS NULL OR (SELECT auth.uid()) = user_id);
  END IF;

  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'chat_messages') THEN
    DROP POLICY IF EXISTS "Anyone can insert messages" ON public.chat_messages;
    DROP POLICY IF EXISTS "Users can insert own messages" ON public.chat_messages;

    CREATE POLICY "Users can insert own messages"
      ON public.chat_messages
      FOR INSERT
      WITH CHECK (user_id IS NULL OR (SELECT auth.uid()) = user_id);
  END IF;
END $$;


-- ----------------------------------------------------------------------------
-- 4. FIX: function_search_path_mutable (Warning)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_saved_charts_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.fn_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_auth_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    name,
    phone,
    subscription_tier,
    onboarding_completed,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data ->> 'name',
      NEW.raw_user_meta_data ->> 'full_name',
      split_part(COALESCE(NEW.email, ''), '@', 1),
      'AstroLife User'
    ),
    NEW.phone,
    'free',
    false,
    now(),
    now()
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

COMMIT;
