-- AstroLife Phase 0 SaaS schema blueprint.
-- Apply manually in Supabase SQL editor after reviewing RLS policies for production.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  phone text,
  gender text,
  dob date,
  tob time,
  city text,
  lat double precision,
  lon double precision,
  onboarding_completed boolean not null default false,
  subscription_tier text not null default 'free' check (subscription_tier in ('free', 'premium', 'elite')),
  subscription_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.charts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  chart_type text not null default 'self' check (chart_type in ('self', 'family', 'partner', 'business')),
  name text not null,
  dob date not null,
  tob time not null,
  city text not null,
  lat double precision,
  lon double precision,
  chart_json jsonb not null,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan text not null check (plan in ('free', 'premium', 'elite')),
  status text not null default 'active' check (status in ('active', 'past_due', 'cancelled', 'expired')),
  provider text not null default 'razorpay',
  provider_subscription_id text,
  started_at timestamptz not null default now(),
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan text not null check (plan in ('premium', 'elite')),
  provider text not null default 'razorpay',
  provider_order_id text,
  provider_payment_id text,
  amount_paise integer not null,
  currency text not null default 'INR',
  status text not null default 'created' check (status in ('created', 'paid', 'failed', 'refunded')),
  raw_payload jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.usage_limits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  period_key text not null,
  ai_questions_used integer not null default 0,
  charts_created integer not null default 0,
  reports_generated integer not null default 0,
  updated_at timestamptz not null default now(),
  unique (user_id, period_key)
);

create table if not exists public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  chart_id uuid references public.charts(id) on delete set null,
  agent_id text not null default 'general',
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.ai_conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  model text,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_memory (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  memory_type text not null default 'preference',
  content text not null,
  confidence numeric(4, 3) not null default 0.700,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  chart_id uuid references public.charts(id) on delete set null,
  report_type text not null,
  status text not null default 'queued' check (status in ('queued', 'processing', 'ready', 'failed')),
  file_url text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.charts enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payments enable row level security;
alter table public.usage_limits enable row level security;
alter table public.ai_conversations enable row level security;
alter table public.ai_messages enable row level security;
alter table public.ai_memory enable row level security;
alter table public.reports enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);

create policy "charts_select_own" on public.charts for select using (auth.uid() = user_id);
create policy "charts_insert_own" on public.charts for insert with check (auth.uid() = user_id);
create policy "charts_update_own" on public.charts for update using (auth.uid() = user_id);
create policy "charts_delete_own" on public.charts for delete using (auth.uid() = user_id);

create policy "subscriptions_select_own" on public.subscriptions for select using (auth.uid() = user_id);
create policy "payments_select_own" on public.payments for select using (auth.uid() = user_id);

create policy "usage_select_own" on public.usage_limits for select using (auth.uid() = user_id);
create policy "usage_insert_own" on public.usage_limits for insert with check (auth.uid() = user_id);
create policy "usage_update_own" on public.usage_limits for update using (auth.uid() = user_id);

create policy "ai_conversations_select_own" on public.ai_conversations for select using (auth.uid() = user_id);
create policy "ai_conversations_insert_own" on public.ai_conversations for insert with check (auth.uid() = user_id);
create policy "ai_conversations_update_own" on public.ai_conversations for update using (auth.uid() = user_id);
create policy "ai_conversations_delete_own" on public.ai_conversations for delete using (auth.uid() = user_id);

create policy "ai_messages_select_own" on public.ai_messages for select using (auth.uid() = user_id);
create policy "ai_messages_insert_own" on public.ai_messages for insert with check (auth.uid() = user_id);

create policy "ai_memory_select_own" on public.ai_memory for select using (auth.uid() = user_id);
create policy "ai_memory_insert_own" on public.ai_memory for insert with check (auth.uid() = user_id);
create policy "ai_memory_update_own" on public.ai_memory for update using (auth.uid() = user_id);
create policy "ai_memory_delete_own" on public.ai_memory for delete using (auth.uid() = user_id);

create policy "reports_select_own" on public.reports for select using (auth.uid() = user_id);
create policy "reports_insert_own" on public.reports for insert with check (auth.uid() = user_id);

create index if not exists charts_user_id_idx on public.charts(user_id);
create index if not exists charts_primary_idx on public.charts(user_id, is_primary);
create index if not exists usage_limits_user_period_idx on public.usage_limits(user_id, period_key);
create index if not exists ai_conversations_user_idx on public.ai_conversations(user_id, updated_at desc);
create index if not exists ai_messages_conversation_idx on public.ai_messages(conversation_id, created_at);
create index if not exists reports_user_idx on public.reports(user_id, created_at desc);
