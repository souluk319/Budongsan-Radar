create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'radar_link_status') then
    create type public.radar_link_status as enum ('pending', 'published', 'rejected');
  end if;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.links (
  id text primary key,
  title text not null,
  source_name text not null default '사용자 제출',
  source_url text not null unique,
  submitted_at timestamptz not null default now(),
  published_at timestamptz,
  category text not null,
  regions text[] not null default array['전국'],
  summary_bullets text[] not null default '{}',
  why_it_matters text not null default '',
  audience_impact jsonb not null default '{}'::jsonb,
  checkpoints text[] not null default '{}',
  score integer not null default 50 check (score between 1 and 100),
  is_daily_pick boolean not null default false,
  impact_line text not null default '',
  reading_minutes integer not null default 3 check (reading_minutes between 1 and 30),
  is_sample boolean not null default false,
  status public.radar_link_status not null default 'pending',
  created_by uuid references auth.users(id) on delete set null,
  source_type text not null default 'user' check (source_type in ('sample', 'user', 'rss', 'admin')),
  raw_excerpt text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.summaries (
  id uuid primary key default gen_random_uuid(),
  link_id text not null references public.links(id) on delete cascade,
  model text not null,
  summary_bullets text[] not null,
  why_it_matters text not null,
  audience_impact jsonb not null,
  checkpoints text[] not null,
  confidence numeric not null check (confidence >= 0 and confidence <= 1),
  created_at timestamptz not null default now()
);

create table if not exists public.rss_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text not null unique,
  enabled boolean not null default true,
  category text not null,
  default_regions text[] not null default array['전국'],
  last_fetched_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.saved_links (
  user_id uuid not null references auth.users(id) on delete cascade,
  link_id text not null references public.links(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, link_id)
);

create table if not exists public.link_votes (
  user_id uuid not null references auth.users(id) on delete cascade,
  link_id text not null references public.links(id) on delete cascade,
  value smallint not null default 1 check (value in (1)),
  created_at timestamptz not null default now(),
  primary key (user_id, link_id)
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
before update on public.profiles
for each row execute function public.touch_updated_at();

drop trigger if exists links_touch_updated_at on public.links;
create trigger links_touch_updated_at
before update on public.links
for each row execute function public.touch_updated_at();

drop trigger if exists rss_sources_touch_updated_at on public.rss_sources;
create trigger rss_sources_touch_updated_at
before update on public.rss_sources
for each row execute function public.touch_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, coalesce(new.email, ''))
  on conflict (id) do update
    set email = excluded.email,
        updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.links enable row level security;
alter table public.summaries enable row level security;
alter table public.rss_sources enable row level security;
alter table public.saved_links enable row level security;
alter table public.link_votes enable row level security;

drop policy if exists "profiles self read" on public.profiles;
create policy "profiles self read"
on public.profiles for select
using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles admin update" on public.profiles;
create policy "profiles admin update"
on public.profiles for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "links public read published" on public.links;
create policy "links public read published"
on public.links for select
using (status = 'published' or created_by = auth.uid() or public.is_admin());

drop policy if exists "links authenticated insert pending" on public.links;
create policy "links authenticated insert pending"
on public.links for insert
with check (
  auth.uid() is not null
  and created_by = auth.uid()
  and status = 'pending'
);

drop policy if exists "links admin update" on public.links;
create policy "links admin update"
on public.links for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "links admin delete" on public.links;
create policy "links admin delete"
on public.links for delete
using (public.is_admin());

drop policy if exists "summaries public read published links" on public.summaries;
create policy "summaries public read published links"
on public.summaries for select
using (
  exists (
    select 1 from public.links
    where links.id = summaries.link_id
      and (links.status = 'published' or links.created_by = auth.uid() or public.is_admin())
  )
);

drop policy if exists "summaries admin write" on public.summaries;
create policy "summaries admin write"
on public.summaries for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "rss sources admin read" on public.rss_sources;
create policy "rss sources admin read"
on public.rss_sources for select
using (public.is_admin());

drop policy if exists "rss sources admin write" on public.rss_sources;
create policy "rss sources admin write"
on public.rss_sources for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "saved links self read" on public.saved_links;
create policy "saved links self read"
on public.saved_links for select
using (auth.uid() = user_id);

drop policy if exists "saved links self insert" on public.saved_links;
create policy "saved links self insert"
on public.saved_links for insert
with check (auth.uid() = user_id);

drop policy if exists "saved links self delete" on public.saved_links;
create policy "saved links self delete"
on public.saved_links for delete
using (auth.uid() = user_id);

drop policy if exists "link votes self read" on public.link_votes;
create policy "link votes self read"
on public.link_votes for select
using (auth.uid() = user_id);

drop policy if exists "link votes self insert" on public.link_votes;
create policy "link votes self insert"
on public.link_votes for insert
with check (auth.uid() = user_id);

drop policy if exists "link votes self update" on public.link_votes;
create policy "link votes self update"
on public.link_votes for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "link votes self delete" on public.link_votes;
create policy "link votes self delete"
on public.link_votes for delete
using (auth.uid() = user_id);

create index if not exists links_status_submitted_idx on public.links (status, submitted_at desc);
create index if not exists links_category_idx on public.links (category);
create index if not exists links_regions_idx on public.links using gin (regions);
create index if not exists links_daily_score_idx on public.links (is_daily_pick, score desc);
create index if not exists summaries_link_created_idx on public.summaries (link_id, created_at desc);
