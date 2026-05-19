-- ============================================================
-- AstroLife — Full Schema: Charts + Chat + Events
-- Safe to re-run — drops existing policies first
-- ============================================================

-- 0. USER CHARTS TABLE
CREATE TABLE IF NOT EXISTS user_charts (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT        NOT NULL,
  dob         TEXT        NOT NULL,
  tob         TEXT        NOT NULL,
  city        TEXT        NOT NULL,
  lat         DOUBLE PRECISION,
  lon         DOUBLE PRECISION,
  tz          TEXT,
  chart_data  JSONB       DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Make user_id nullable (anonymous chart tracking)
ALTER TABLE user_charts ALTER COLUMN user_id DROP NOT NULL;

CREATE INDEX IF NOT EXISTS idx_user_charts_user    ON user_charts (user_id);
CREATE INDEX IF NOT EXISTS idx_user_charts_created ON user_charts (created_at DESC);

ALTER TABLE user_charts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own charts"   ON user_charts;
DROP POLICY IF EXISTS "Users can insert own charts" ON user_charts;
DROP POLICY IF EXISTS "Users can delete own charts" ON user_charts;
DROP POLICY IF EXISTS "Anyone can insert charts"    ON user_charts;

CREATE POLICY "Users can read own charts"   ON user_charts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can insert charts"    ON user_charts FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can delete own charts" ON user_charts FOR DELETE USING (auth.uid() = user_id);


-- 1. CHAT MESSAGES TABLE (user_id nullable = anonymous users allowed)
CREATE TABLE IF NOT EXISTS chat_messages (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID        REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id   TEXT        NOT NULL,
  agent_id     TEXT        NOT NULL,
  role         TEXT        NOT NULL CHECK (role IN ('user', 'assistant')),
  content      TEXT        NOT NULL,
  chart_name   TEXT,
  tokens_used  INTEGER     DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Make user_id nullable if table existed with NOT NULL
ALTER TABLE chat_messages ALTER COLUMN user_id DROP NOT NULL;

CREATE INDEX IF NOT EXISTS idx_chat_messages_user    ON chat_messages (user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages (session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created ON chat_messages (created_at DESC);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own messages"   ON chat_messages;
DROP POLICY IF EXISTS "Users can insert own messages" ON chat_messages;
DROP POLICY IF EXISTS "Anyone can insert messages"    ON chat_messages;

CREATE POLICY "Users can read own messages" ON chat_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can insert messages"  ON chat_messages FOR INSERT WITH CHECK (true);


-- 2. USER EXPERIENCE EVENTS TABLE
CREATE TABLE IF NOT EXISTS user_events (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID        REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type   TEXT        NOT NULL,
  page         TEXT,
  feature      TEXT,
  event_data   JSONB       DEFAULT '{}',
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_events_user    ON user_events (user_id);
CREATE INDEX IF NOT EXISTS idx_user_events_type    ON user_events (event_type);
CREATE INDEX IF NOT EXISTS idx_user_events_created ON user_events (created_at DESC);

ALTER TABLE user_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert own events" ON user_events;
DROP POLICY IF EXISTS "Anyone can insert events"    ON user_events;

CREATE POLICY "Anyone can insert events" ON user_events FOR INSERT WITH CHECK (true);


-- 3. ADMIN SUMMARY VIEW
CREATE OR REPLACE VIEW admin_user_summary AS
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
LEFT JOIN user_charts   c ON c.user_id = u.id
LEFT JOIN chat_messages m ON m.user_id = u.id
LEFT JOIN user_events   e ON e.user_id = u.id
GROUP BY u.id, u.email, u.created_at
ORDER BY last_active_at DESC NULLS LAST;
