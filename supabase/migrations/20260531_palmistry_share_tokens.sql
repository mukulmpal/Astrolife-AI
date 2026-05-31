alter table palmistry_sessions
add column if not exists share_token text unique,
add column if not exists is_share_enabled boolean default false,
add column if not exists shared_at timestamptz;

create index if not exists palmistry_sessions_share_token_idx
on palmistry_sessions(share_token);
