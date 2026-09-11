create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists avatar_url text;

create table if not exists public.saved_charts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  gender text,
  birth_date date not null,
  birth_time time not null,
  birth_place text not null,
  latitude numeric,
  longitude numeric,
  timezone text,
  chart_payload jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists saved_charts_user_created_idx
  on public.saved_charts(user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.saved_charts enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "saved_charts_select_own" on public.saved_charts;
drop policy if exists "saved_charts_insert_own" on public.saved_charts;
drop policy if exists "saved_charts_update_own" on public.saved_charts;
drop policy if exists "saved_charts_delete_own" on public.saved_charts;

create policy "saved_charts_select_own"
  on public.saved_charts for select
  using (auth.uid() = user_id);

create policy "saved_charts_insert_own"
  on public.saved_charts for insert
  with check (auth.uid() = user_id);

create policy "saved_charts_update_own"
  on public.saved_charts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "saved_charts_delete_own"
  on public.saved_charts for delete
  using (auth.uid() = user_id);

create or replace function public.set_saved_charts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_saved_charts_updated_at on public.saved_charts;
create trigger set_saved_charts_updated_at
  before update on public.saved_charts
  for each row
  execute function public.set_saved_charts_updated_at();

create or replace function public.handle_new_auth_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(public.profiles.full_name, excluded.full_name),
    avatar_url = coalesce(public.profiles.avatar_url, excluded.avatar_url);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
  after insert on auth.users
  for each row
  execute function public.handle_new_auth_user_profile();
