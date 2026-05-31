create table if not exists palmistry_rule_tuning (
  rule_id text primary key,
  title text not null,
  category text not null,
  recommendation text not null,
  action text not null,
  current_confidence_base numeric,
  suggested_confidence_base numeric,
  current_report_priority int,
  suggested_report_priority int,
  delta_confidence numeric,
  delta_priority int,
  sample_size int default 0,
  accuracy_score numeric default 0,
  avg_rating numeric default 0,
  avg_confidence numeric default 0,
  reason text,
  status text not null default 'pending',
  metadata jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists palmistry_rule_tuning_status_idx
on palmistry_rule_tuning(status);

create index if not exists palmistry_rule_tuning_recommendation_idx
on palmistry_rule_tuning(recommendation);

create index if not exists palmistry_rule_tuning_category_idx
on palmistry_rule_tuning(category);
