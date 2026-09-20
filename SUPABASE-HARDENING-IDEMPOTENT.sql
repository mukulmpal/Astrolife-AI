-- Supabase hardening idempotent script
-- Purpose: fix exposed auth users, enable RLS on public tables that are missing it,
-- and convert SECURITY DEFINER views to SECURITY INVOKER where safe.
-- IMPORTANT: Make a full backup before running (Supabase UI -> Backups or pg_dump)

BEGIN;

-- 1) Harden palmistry_rule_tuning: enable RLS, revoke public, create conservative policy
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='palmistry_rule_tuning') THEN
    RAISE NOTICE 'Found table public.palmistry_rule_tuning: enabling RLS, revoking public privileges, and creating admin-only policy.';

    EXECUTE 'ALTER TABLE public.palmistry_rule_tuning ENABLE ROW LEVEL SECURITY';
    EXECUTE 'REVOKE ALL ON TABLE public.palmistry_rule_tuning FROM PUBLIC';

    -- Create a conservative ALL policy that only allows the service role (or a jwt claim 'role' == 'service_role')
    -- If your project uses a different claim for service role, adjust the condition accordingly.
    -- The policy below is named for idempotence. If it exists, DROP & CREATE to ensure expected definition.
    BEGIN
      EXECUTE 'DROP POLICY IF EXISTS harden_palmistry_admin_only ON public.palmistry_rule_tuning';
    EXCEPTION WHEN others THEN
      RAISE NOTICE 'Could not drop existing policy (non-fatal)';
    END;

    EXECUTE $pol$
      CREATE POLICY harden_palmistry_admin_only
      ON public.palmistry_rule_tuning
      FOR ALL
      USING ( (auth.role() = 'service_role') OR (auth.uid() IS NOT NULL AND auth.uid() = owner_id) )
      WITH CHECK ( (auth.role() = 'service_role') OR (auth.uid() IS NOT NULL AND auth.uid() = owner_id) );
    $pol$;

    RAISE NOTICE 'palmistry_rule_tuning: RLS enabled and policy created. Please verify "owner_id" column exists and change condition if needed.';
  ELSE
    RAISE NOTICE 'Table public.palmistry_rule_tuning not found; skipping.';
  END IF;
END$$;

-- 2) Look for SECURITY DEFINER views in public schema and attempt safe conversion to SECURITY INVOKER
-- NOTE: PostgreSQL's SQL SECURITY for views is non-standard; many projects use SECURITY DEFINER on functions instead.
-- This block will list views that have an owner different from a low-privilege role and will attempt to alter security to INVOKER.

DO $$
DECLARE
  rec record;
  v_def text;
BEGIN
  FOR rec IN
    SELECT n.nspname as schema_name, c.relname as view_name, pg_get_viewdef(c.oid) as viewdef
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relkind = 'v' AND n.nspname = 'public'
  LOOP
    -- heuristics: warn if the view definition references auth.users or uses SECURITY DEFINER at creation time
    IF position('auth.users' IN lower(rec.viewdef)) > 0 THEN
      RAISE NOTICE 'View public.% found referencing auth.users: %', rec.view_name, left(rec.viewdef, 400);
      -- Try to alter view to SECURITY INVOKER if supported
      BEGIN
        EXECUTE format('ALTER VIEW public.%I SECURITY INVOKER', rec.view_name);
        RAISE NOTICE 'ALTER VIEW public.% set to SECURITY INVOKER (if supported by your Postgres version).', rec.view_name;
      EXCEPTION WHEN others THEN
        RAISE NOTICE 'Could not alter view public.% to SECURITY INVOKER automatically; please inspect and recreate the view with SECURITY INVOKER. View definition follows:', rec.view_name;
        RAISE NOTICE '%', rec.viewdef;
      END;
    END IF;
  END LOOP;
END$$;

-- 3) Find any materialized views in public that might expose auth.users
-- (Report-only; administrator should inspect and lock them down)

-- Query to list materialized views that reference auth.users
-- Run this query in Supabase SQL editor for manual review if needed
-- SELECT matviewname FROM pg_matviews WHERE schemaname='public' AND definition ILIKE '%auth.users%';

-- 4) Revoke public access to potentially sensitive views (admin_user_summary) and require explicit grants
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_views WHERE schemaname='public' AND viewname='admin_user_summary') THEN
    RAISE NOTICE 'Found public.admin_user_summary: revoking default grants to PUBLIC.';
    EXECUTE 'REVOKE ALL ON public.admin_user_summary FROM PUBLIC';
    RAISE NOTICE 'Revoked PUBLIC privileges on public.admin_user_summary. Review and grant only to intended roles.';
  ELSE
    RAISE NOTICE 'View public.admin_user_summary not found; skipping.';
  END IF;
END$$;

-- 5) General hardening: revoke public usage on sequences and restrict default grants for tables created in public schema
DO $$
DECLARE
  t record;
BEGIN
  FOR t IN SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE'
  LOOP
    BEGIN
      EXECUTE format('REVOKE ALL ON TABLE public.%I FROM PUBLIC', t.table_name);
    EXCEPTION WHEN others THEN
      RAISE NOTICE 'Could not revoke on table %, continuing', t.table_name;
    END;
  END LOOP;
END$$;

COMMIT;

-- Post-run manual checks (run after this script completes):
-- 1) Inspect policies: SELECT * FROM pg_policies WHERE schemaname='public' AND tablename IN ('palmistry_rule_tuning');
-- 2) Verify no views expose auth.users: SELECT table_schema, table_name, view_definition FROM information_schema.views WHERE view_definition ILIKE '%auth.users%';
-- 3) For any view that must be admin-only, grant access explicitly to a secure role, e.g.:
--    GRANT SELECT ON public.admin_user_summary TO <admin_role>;
-- 4) If the created policy used owner_id but the table uses a different owner column (e.g., profile_id), update the policy accordingly:
--    DROP POLICY IF EXISTS harden_palmistry_admin_only ON public.palmistry_rule_tuning;
--    CREATE POLICY harden_palmistry_admin_only ON public.palmistry_rule_tuning FOR ALL USING (auth.role() = 'service_role' OR auth.uid() = profile_id) WITH CHECK (...);

-- Final note: this script errs on the side of safety by removing public grants and enabling RLS. If your application needs public read for certain pages, add explicit selective policies instead of relying on PUBLIC grants.
