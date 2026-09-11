-- Phase 8 launch hardening: make billing/profile gating reliable.
-- Every Supabase Auth user must have a public.profiles row because
-- subscription_tier is the source of truth for Premium and Elite access.

create or replace function public.handle_new_auth_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    name,
    phone,
    subscription_tier,
    onboarding_completed,
    created_at,
    updated_at
  )
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'name',
      new.raw_user_meta_data ->> 'full_name',
      split_part(coalesce(new.email, ''), '@', 1),
      'AstroLife User'
    ),
    new.phone,
    'free',
    false,
    now(),
    now()
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_create_profile on auth.users;

create trigger on_auth_user_created_create_profile
after insert on auth.users
for each row execute function public.handle_new_auth_user_profile();

insert into public.profiles (
  id,
  name,
  phone,
  subscription_tier,
  onboarding_completed,
  created_at,
  updated_at
)
select
  users.id,
  coalesce(
    users.raw_user_meta_data ->> 'name',
    users.raw_user_meta_data ->> 'full_name',
    split_part(coalesce(users.email, ''), '@', 1),
    'AstroLife User'
  ) as name,
  users.phone,
  'free' as subscription_tier,
  false as onboarding_completed,
  now() as created_at,
  now() as updated_at
from auth.users
left join public.profiles profiles on profiles.id = users.id
where profiles.id is null;
