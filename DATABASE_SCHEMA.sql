-- Phase 4: Database Schema for AstroLife
-- Run these SQL commands in Supabase

-- User Charts Table (stores birth charts)
CREATE TABLE IF NOT EXISTS user_charts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dob DATE NOT NULL,
  tob TIME NOT NULL,
  city TEXT NOT NULL,
  lat DECIMAL(10, 6),
  lon DECIMAL(10, 6),
  tz DECIMAL(4, 2),
  chart_data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_charts_user_id ON user_charts(user_id);
CREATE INDEX idx_user_charts_created_at ON user_charts(created_at DESC);

-- Chart Readings Table (stores engine results)
CREATE TABLE IF NOT EXISTS chart_readings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chart_id UUID NOT NULL REFERENCES user_charts(id) ON DELETE CASCADE,
  engine_type TEXT NOT NULL, -- 'remedy', 'prashna', 'medical', 'sarvatobhadra', 'transit', etc
  result_data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_chart_readings_chart_id ON chart_readings(chart_id);
CREATE INDEX idx_chart_readings_engine ON chart_readings(engine_type);

-- Education Progress Table (tracks which terms user has learned)
CREATE TABLE IF NOT EXISTS education_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  term_slug TEXT NOT NULL,
  viewed_count INT DEFAULT 1,
  first_viewed TIMESTAMP DEFAULT NOW(),
  last_viewed TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_education_progress_unique ON education_progress(user_id, term_slug);

-- User Preferences (favorite engines, education level, etc)
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  education_level TEXT DEFAULT 'beginner', -- 'beginner', 'intermediate', 'advanced'
  favorite_engines TEXT[] DEFAULT ARRAY['kundli', 'yogas', 'dasha'],
  dark_mode BOOLEAN DEFAULT TRUE,
  show_tooltips BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE user_charts ENABLE ROW LEVEL SECURITY;
ALTER TABLE chart_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE education_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own charts"
  ON user_charts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own charts"
  ON user_charts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own readings"
  ON chart_readings FOR SELECT
  USING (
    chart_id IN (
      SELECT id FROM user_charts WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own readings"
  ON chart_readings FOR INSERT
  WITH CHECK (
    chart_id IN (
      SELECT id FROM user_charts WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own education progress"
  ON education_progress FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own preferences"
  ON user_preferences FOR ALL
  USING (auth.uid() = user_id);
