create table if not exists palmistry_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  hand_side text not null,
  dominant_hand text,
  report_style text not null default 'luxury',
  user_tier text not null default 'free',
  image_url text,
  image_quality jsonb,
  features jsonb not null,
  result jsonb not null,
  summary text,
  top_categories text[],
  total_hits int default 0,
  engine_version text,
  created_at timestamptz default now()
);

create table if not exists palmistry_feedback (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references palmistry_sessions(id) on delete cascade,
  user_id uuid,
  rating int check (rating >= 1 and rating <= 5),
  accurate_sections text[],
  inaccurate_sections text[],
  feedback text,
  created_at timestamptz default now()
);

create index if not exists palmistry_sessions_user_id_idx
on palmistry_sessions(user_id);

create index if not exists palmistry_sessions_created_at_idx
on palmistry_sessions(created_at desc);

create index if not exists palmistry_feedback_session_id_idx
on palmistry_feedback(session_id);

alter table palmistry_sessions enable row level security;
alter table palmistry_feedback enable row level security;

drop policy if exists "Users can read own palmistry sessions" on palmistry_sessions;
create policy "Users can read own palmistry sessions"
on palmistry_sessions
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own palmistry sessions" on palmistry_sessions;
create policy "Users can insert own palmistry sessions"
on palmistry_sessions
for insert
with check (auth.uid() = user_id or user_id is null);

drop policy if exists "Users can read own palmistry feedback" on palmistry_feedback;
create policy "Users can read own palmistry feedback"
on palmistry_feedback
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own palmistry feedback" on palmistry_feedback;
create policy "Users can insert own palmistry feedback"
on palmistry_feedback
for insert
with check (auth.uid() = user_id or user_id is null);
