-- Idempotent Supabase chart setup
-- Safe to run multiple times. Recommended: backup DB before running.
BEGIN;

-- 1) profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY,
  full_name text,
  email text,
  avatar_url text,
  locale text,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2) charts
CREATE TABLE IF NOT EXISTS public.charts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid,
  name text,
  data jsonb,
  kind text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3) saved_charts
CREATE TABLE IF NOT EXISTS public.saved_charts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid,
  chart_id uuid,
  title text,
  description text,
  meta jsonb,
  is_shared boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4) other optional tables (minimal shapes) - create if missing
CREATE TABLE IF NOT EXISTS public.usage_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid,
  limits jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid,
  title text,
  state jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ai_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid,
  role text,
  content jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid,
  provider text,
  plan text,
  meta jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid,
  provider text,
  amount numeric,
  meta jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ai_memory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid,
  memory jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid,
  type text,
  payload jsonb,
  created_at timestamptz DEFAULT now()
);

-- 5) update timestamp trigger function (create or replace)
CREATE OR REPLACE FUNCTION public.fn_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Attach trigger to tables (drop existing triggers if present and recreate)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_trigger t JOIN pg_class c ON t.tgrelid = c.oid WHERE t.tgname = 'set_timestamp_profiles' AND c.relname = 'profiles') THEN
    PERFORM pg_catalog.pg_trigger_drop(tgname => 'set_timestamp_profiles');
  END IF;
EXCEPTION WHEN others THEN
  -- ignore
END$$;

-- Instead of trying to drop with helper above (which may not be available), use DROP TRIGGER IF EXISTS
DROP TRIGGER IF EXISTS set_timestamp_profiles ON public.profiles;
CREATE TRIGGER set_timestamp_profiles
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.fn_set_updated_at();

DROP TRIGGER IF EXISTS set_timestamp_charts ON public.charts;
CREATE TRIGGER set_timestamp_charts
BEFORE UPDATE ON public.charts
FOR EACH ROW EXECUTE FUNCTION public.fn_set_updated_at();

DROP TRIGGER IF EXISTS set_timestamp_saved_charts ON public.saved_charts;
CREATE TRIGGER set_timestamp_saved_charts
BEFORE UPDATE ON public.saved_charts
FOR EACH ROW EXECUTE FUNCTION public.fn_set_updated_at();

-- 6) Enable Row Level Security and policies (DROP policy if exists then CREATE)
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.saved_charts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.charts ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "profiles_select_owner" ON public.profiles;
CREATE POLICY "profiles_select_owner" ON public.profiles
FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_owner" ON public.profiles;
CREATE POLICY "profiles_update_owner" ON public.profiles
FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Saved charts policies
DROP POLICY IF EXISTS "saved_charts_select_owner" ON public.saved_charts;
CREATE POLICY "saved_charts_select_owner" ON public.saved_charts
FOR SELECT USING (auth.uid() = profile_id);

DROP POLICY IF EXISTS "saved_charts_insert" ON public.saved_charts;
CREATE POLICY "saved_charts_insert" ON public.saved_charts
FOR INSERT WITH CHECK (auth.uid() = profile_id);

DROP POLICY IF EXISTS "saved_charts_update_owner" ON public.saved_charts;
CREATE POLICY "saved_charts_update_owner" ON public.saved_charts
FOR UPDATE USING (auth.uid() = profile_id) WITH CHECK (auth.uid() = profile_id);

DROP POLICY IF EXISTS "saved_charts_delete_owner" ON public.saved_charts;
CREATE POLICY "saved_charts_delete_owner" ON public.saved_charts
FOR DELETE USING (auth.uid() = profile_id);

-- Charts policies (owner_id should match auth.uid())
DROP POLICY IF EXISTS "charts_select_owner" ON public.charts;
CREATE POLICY "charts_select_owner" ON public.charts
FOR SELECT USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "charts_insert" ON public.charts;
CREATE POLICY "charts_insert" ON public.charts
FOR INSERT WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "charts_update_owner" ON public.charts;
CREATE POLICY "charts_update_owner" ON public.charts
FOR UPDATE USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "charts_delete_owner" ON public.charts;
CREATE POLICY "charts_delete_owner" ON public.charts
FOR DELETE USING (auth.uid() = owner_id);

COMMIT;

-- Notes:
-- 1) This script intentionally avoids strict foreign-key constraints to reduce false failures if auth schema differs.
-- 2) Back up the database before running if you have important data (use Supabase backups or pg_dump).
-- 3) After running, verify policies and table shapes match application expectations and adjust types/columns if your app needs extra fields.
-- 4) If your project previously created partial objects, running this script will not fail on "relation already exists" and will create missing objects.
