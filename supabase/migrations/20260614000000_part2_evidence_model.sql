create table if not exists public.regions (
  id text primary key,
  name text not null,
  level text not null check (
    level in ('country', 'metro', 'province', 'city', 'district', 'neighborhood')
  ),
  parent_id text references public.regions(id) on delete set null,
  aliases text[] not null default '{}',
  external_refs jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.complexes (
  id text primary key,
  name text not null,
  region_id text references public.regions(id) on delete set null,
  address text,
  road_address text,
  jibun_address text,
  latitude numeric,
  longitude numeric,
  external_refs jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.buildings (
  id text primary key,
  complex_id text references public.complexes(id) on delete set null,
  region_id text references public.regions(id) on delete set null,
  name text,
  address text,
  building_register_pk text,
  external_refs jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.units (
  id text primary key,
  building_id text not null references public.buildings(id) on delete cascade,
  label text,
  area_m2 numeric,
  floor text,
  external_refs jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.data_observations (
  id uuid primary key default gen_random_uuid(),
  dedupe_key text not null unique,
  source text not null check (
    source in ('sample', 'naver', 'ecos', 'data_go_kr', 'reb', 'law', 'admin')
  ),
  kind text not null check (
    kind in (
      'news_context',
      'interest_rate',
      'trade',
      'rent',
      'market_stat',
      'law',
      'policy',
      'subscription',
      'source_status'
    )
  ),
  title text not null,
  summary text not null,
  source_url text,
  observed_at timestamptz not null default now(),
  region_id text references public.regions(id) on delete set null,
  complex_id text references public.complexes(id) on delete set null,
  building_id text references public.buildings(id) on delete set null,
  unit_id text references public.units(id) on delete set null,
  region_name text,
  entity_label text,
  metric_label text,
  metric_value numeric,
  metric_unit text,
  payload jsonb not null default '{}'::jsonb,
  is_sample boolean not null default false,
  confidence numeric not null default 0.7 check (confidence >= 0 and confidence <= 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.link_observations (
  link_id text not null references public.links(id) on delete cascade,
  observation_id uuid not null references public.data_observations(id) on delete cascade,
  relevance smallint not null default 60 check (relevance between 1 and 100),
  created_at timestamptz not null default now(),
  primary key (link_id, observation_id)
);

alter table public.links
  add column if not exists evidence_count integer not null default 0 check (evidence_count >= 0),
  add column if not exists evidence_updated_at timestamptz,
  add column if not exists grounding_notes text[] not null default '{}',
  add column if not exists uncertainties text[] not null default '{}';

alter table public.summaries
  add column if not exists grounding_notes text[] not null default '{}',
  add column if not exists uncertainties text[] not null default '{}',
  add column if not exists source_observation_ids uuid[] not null default '{}';

drop trigger if exists regions_touch_updated_at on public.regions;
create trigger regions_touch_updated_at
before update on public.regions
for each row execute function public.touch_updated_at();

drop trigger if exists complexes_touch_updated_at on public.complexes;
create trigger complexes_touch_updated_at
before update on public.complexes
for each row execute function public.touch_updated_at();

drop trigger if exists buildings_touch_updated_at on public.buildings;
create trigger buildings_touch_updated_at
before update on public.buildings
for each row execute function public.touch_updated_at();

drop trigger if exists units_touch_updated_at on public.units;
create trigger units_touch_updated_at
before update on public.units
for each row execute function public.touch_updated_at();

drop trigger if exists data_observations_touch_updated_at on public.data_observations;
create trigger data_observations_touch_updated_at
before update on public.data_observations
for each row execute function public.touch_updated_at();

alter table public.regions enable row level security;
alter table public.complexes enable row level security;
alter table public.buildings enable row level security;
alter table public.units enable row level security;
alter table public.data_observations enable row level security;
alter table public.link_observations enable row level security;

drop policy if exists "regions public read" on public.regions;
create policy "regions public read"
on public.regions for select
using (true);

drop policy if exists "regions admin write" on public.regions;
create policy "regions admin write"
on public.regions for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "complexes public read" on public.complexes;
create policy "complexes public read"
on public.complexes for select
using (true);

drop policy if exists "complexes admin write" on public.complexes;
create policy "complexes admin write"
on public.complexes for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "buildings public read" on public.buildings;
create policy "buildings public read"
on public.buildings for select
using (true);

drop policy if exists "buildings admin write" on public.buildings;
create policy "buildings admin write"
on public.buildings for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "units public read" on public.units;
create policy "units public read"
on public.units for select
using (true);

drop policy if exists "units admin write" on public.units;
create policy "units admin write"
on public.units for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "data observations public read" on public.data_observations;
create policy "data observations public read"
on public.data_observations for select
using (true);

drop policy if exists "data observations admin write" on public.data_observations;
create policy "data observations admin write"
on public.data_observations for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "link observations public read published links" on public.link_observations;
create policy "link observations public read published links"
on public.link_observations for select
using (
  exists (
    select 1 from public.links
    where links.id = link_observations.link_id
      and (links.status = 'published' or links.created_by = auth.uid() or public.is_admin())
  )
);

drop policy if exists "link observations admin write" on public.link_observations;
create policy "link observations admin write"
on public.link_observations for all
using (public.is_admin())
with check (public.is_admin());

create index if not exists regions_parent_idx on public.regions (parent_id);
create index if not exists regions_level_name_idx on public.regions (level, name);
create index if not exists complexes_region_idx on public.complexes (region_id);
create index if not exists buildings_complex_idx on public.buildings (complex_id);
create index if not exists buildings_region_idx on public.buildings (region_id);
create index if not exists units_building_idx on public.units (building_id);
create index if not exists data_observations_source_idx on public.data_observations (source, observed_at desc);
create index if not exists data_observations_region_idx on public.data_observations (region_id, observed_at desc);
create index if not exists data_observations_kind_idx on public.data_observations (kind, observed_at desc);
create index if not exists link_observations_link_idx on public.link_observations (link_id, relevance desc);
create index if not exists link_observations_observation_idx on public.link_observations (observation_id);
