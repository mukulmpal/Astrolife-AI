create table if not exists public.cities (
  id bigserial primary key,
  geoname_id bigint unique not null,
  name text not null,
  ascii_name text,
  alternate_names text,
  country_code text not null,
  admin1_code text,
  admin2_code text,
  latitude double precision not null,
  longitude double precision not null,
  population bigint default 0,
  timezone text,
  search_text text,
  created_at timestamptz default now()
);

create index if not exists cities_search_text_idx
on public.cities using gin (to_tsvector('simple', coalesce(search_text, '')));

create index if not exists cities_country_code_idx
on public.cities(country_code);

create index if not exists cities_population_idx
on public.cities(population desc);

create index if not exists cities_name_lower_idx
on public.cities(lower(name));

create index if not exists cities_ascii_name_lower_idx
on public.cities(lower(ascii_name));
