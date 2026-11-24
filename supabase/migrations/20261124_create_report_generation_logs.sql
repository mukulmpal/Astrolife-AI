-- ==============================================================================
-- Migration: Create report_generation_logs table
-- Provides a tamper-proof audit trail for every PDF and Dossier generated.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.report_generation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_code TEXT NOT NULL UNIQUE,
  report_type TEXT NOT NULL,
  report_title TEXT NOT NULL,
  page_count TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT NOT NULL,
  is_admin_generated BOOLEAN NOT NULL DEFAULT false,
  is_sample BOOLEAN NOT NULL DEFAULT false,
  native_name TEXT NOT NULL,
  native_dob TEXT NOT NULL,
  native_tob TEXT NOT NULL,
  native_city TEXT NOT NULL,
  native_lat NUMERIC,
  native_lon NUMERIC,
  native_tz NUMERIC,
  lagna_rashi TEXT,
  moon_sign TEXT,
  nakshatra TEXT,
  pdf_engine TEXT DEFAULT 'chromium',
  generation_duration_ms INTEGER,
  status TEXT NOT NULL DEFAULT 'success',
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Fast lookup indexes
CREATE INDEX IF NOT EXISTS idx_report_gen_code ON public.report_generation_logs(report_code);
CREATE INDEX IF NOT EXISTS idx_report_gen_user_email ON public.report_generation_logs(user_email);
CREATE INDEX IF NOT EXISTS idx_report_gen_native_name ON public.report_generation_logs(native_name);
CREATE INDEX IF NOT EXISTS idx_report_gen_created_at ON public.report_generation_logs(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.report_generation_logs ENABLE ROW LEVEL SECURITY;

-- Regular users can only read their own reports
CREATE POLICY "Users can view own report logs"
  ON public.report_generation_logs
  FOR SELECT
  USING (auth.uid() = user_id);

-- Service role full access for backend logging & admin API
CREATE POLICY "Service role full access on report logs"
  ON public.report_generation_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
