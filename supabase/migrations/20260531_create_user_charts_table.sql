-- Create user_charts table for saving multiple birth charts per user
CREATE TABLE IF NOT EXISTS user_charts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Birth Details
  name TEXT NOT NULL,
  dob DATE NOT NULL,
  tob TIME NOT NULL,
  city TEXT NOT NULL,
  country TEXT,
  timezone TEXT DEFAULT 'IST',
  latitude FLOAT,
  longitude FLOAT,

  -- Chart Data
  chart_data JSONB, -- Full kundli chart object
  engines_data JSONB, -- All engine calculations

  -- Metadata
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Prevent duplicate charts for same user
  UNIQUE(user_id, dob, tob, city)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_charts_user_id ON user_charts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_charts_created_at ON user_charts(created_at DESC);

-- Enable Row Level Security
ALTER TABLE user_charts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can view only their own charts
CREATE POLICY "Users can view own charts"
  ON user_charts FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert only their own charts
CREATE POLICY "Users can insert own charts"
  ON user_charts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update only their own charts
CREATE POLICY "Users can update own charts"
  ON user_charts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete only their own charts
CREATE POLICY "Users can delete own charts"
  ON user_charts FOR DELETE
  USING (auth.uid() = user_id);
