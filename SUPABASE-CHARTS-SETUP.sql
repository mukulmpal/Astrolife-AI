-- 2026-09-11: Create profiles and saved_charts tables and RLS policies for AstroLife
-- Run this in your Supabase SQL editor (or as part of a migration pipeline)

-- REQUIREMENTS: the Supabase project must have the auth extension (auth.users table)
-- NOTE: adjust types or constraints to match your existing schema if you already have charts/profiles tables

-- 1) Enable pgcrypto for gen_random_uuid() if not present
create extension if not exists pgcrypto;

-- 2) Profiles table (one row per user, keyed by auth.users.id)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  dob date,
  tob text,
  city text,
  lat double precision,
  lon double precision,
  tz double precision,
  onboarding_completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3) Saved charts table (user-owned library)
create table if not exists public.saved_charts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  chart_type text not null default 'self', -- e.g. self, family, saved
  name text not null,
  birth_date date not null,
  birth_time text not null,
  birth_place text not null,
  latitude double precision,
  longitude double precision,
  timezone text,
  chart_payload jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4) Optional legacy charts table (if repo still references 'charts')
create table if not exists public.charts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  chart_type text default 'self',
  name text,
  dob date,
  tob text,
  city text,
  lat double precision,
  lon double precision,
  chart_json jsonb,
  is_primary boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5) Row Level Security (RLS) — enforce per-user access
alter table public.profiles enable row level security;
alter table public.saved_charts enable row level security;
alter table public.charts enable row level security;

-- Profiles RLS: user can read/update their own profile
drop policy if exists profiles_self_access on public.profiles;
create policy profiles_self_access
  on public.profiles
  for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Saved charts RLS: user can only read/modify their own saved_charts
drop policy if exists saved_charts_self_access on public.saved_charts;
create policy saved_charts_self_access
  on public.saved_charts
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Charts (legacy) RLS
drop policy if exists charts_self_access on public.charts;
create policy charts_self_access
  on public.charts
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 6) Helpful indexes
create index if not exists idx_saved_charts_user_updated_at on public.saved_charts (user_id, updated_at desc);
create index if not exists idx_charts_user_primary on public.charts (user_id, is_primary desc, updated_at desc);

-- 7) Trigger to auto-update updated_at columns
create or replace function public.set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql stable;

drop trigger if exists trg_saved_charts_updated_at on public.saved_charts;
create trigger trg_saved_charts_updated_at
  before update on public.saved_charts
  for each row execute procedure public.set_updated_at();

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

drop trigger if exists trg_charts_updated_at on public.charts;
create trigger trg_charts_updated_at
  before update on public.charts
  for each row execute procedure public.set_updated_at();

-- End of migration
