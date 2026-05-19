-- Allow anonymous (non-logged-in) chat messages
ALTER TABLE chat_messages ALTER COLUMN user_id DROP NOT NULL;
