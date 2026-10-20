-- ============================================================================
-- ASTROLIFE AI — FINAL LINTER & WARNINGS RESOLUTION SCRIPT (SAFE & IDEMPOTENT)
-- ============================================================================
-- Target Project: Astrolife AI (nzenettizeocqzpziuuq)
-- ============================================================================

BEGIN;

-- 1. Permissive "WITH CHECK (true)" policies ko safe condition se replace karein
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_charts') THEN
    DROP POLICY IF EXISTS "Anyone can insert charts" ON public.user_charts;
    DROP POLICY IF EXISTS "Users can insert own charts" ON public.user_charts;
    CREATE POLICY "Users can insert own charts"
      ON public.user_charts FOR INSERT TO anon, authenticated
      WITH CHECK (user_id IS NULL OR (SELECT auth.uid()) = user_id);
  END IF;

  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'chat_messages') THEN
    DROP POLICY IF EXISTS "Anyone can insert messages" ON public.chat_messages;
    DROP POLICY IF EXISTS "Users can insert own messages" ON public.chat_messages;
    CREATE POLICY "Users can insert own messages"
      ON public.chat_messages FOR INSERT TO anon, authenticated
      WITH CHECK (user_id IS NULL OR (SELECT auth.uid()) = user_id);
  END IF;

  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_events') THEN
    DROP POLICY IF EXISTS "Anyone can insert events" ON public.user_events;
    DROP POLICY IF EXISTS "Allow insert events" ON public.user_events;
    CREATE POLICY "Allow insert events"
      ON public.user_events FOR INSERT TO anon, authenticated
      WITH CHECK (user_id IS NULL OR (SELECT auth.uid()) = user_id);
  END IF;
END $$;

-- 2. Trigger functions ko normal function banayein aur API execution revoke karein
CREATE OR REPLACE FUNCTION public.fn_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE OR REPLACE FUNCTION public.set_saved_charts_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Revoke execute permissions safely
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'fn_set_updated_at') THEN
    REVOKE ALL ON FUNCTION public.fn_set_updated_at() FROM PUBLIC, anon, authenticated;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'set_saved_charts_updated_at') THEN
    REVOKE ALL ON FUNCTION public.set_saved_charts_updated_at() FROM PUBLIC, anon, authenticated;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'set_updated_at') THEN
    REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
  END IF;
END $$;

COMMIT;
