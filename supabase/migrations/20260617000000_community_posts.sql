create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 5 and 140),
  body text not null check (char_length(body) between 10 and 2000),
  post_type text not null check (
    post_type in ('question', 'local_signal', 'link_tip', 'my_situation')
  ),
  region text not null default '전국',
  category text,
  source_url text,
  related_link_id text references public.links(id) on delete set null,
  status public.radar_link_status not null default 'pending',
  created_by uuid references auth.users(id) on delete set null,
  author_email text not null default '',
  vote_count integer not null default 0 check (vote_count >= 0),
  comment_count integer not null default 0 check (comment_count >= 0),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists community_posts_touch_updated_at on public.community_posts;
create trigger community_posts_touch_updated_at
before update on public.community_posts
for each row execute function public.touch_updated_at();

alter table public.community_posts enable row level security;

drop policy if exists "community posts public read" on public.community_posts;
create policy "community posts public read"
on public.community_posts for select
using (status = 'published' or created_by = auth.uid() or public.is_admin());

drop policy if exists "community posts authenticated insert pending" on public.community_posts;
create policy "community posts authenticated insert pending"
on public.community_posts for insert
with check (
  auth.uid() is not null
  and created_by = auth.uid()
  and status = 'pending'
);

drop policy if exists "community posts admin update" on public.community_posts;
create policy "community posts admin update"
on public.community_posts for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "community posts admin delete" on public.community_posts;
create policy "community posts admin delete"
on public.community_posts for delete
using (public.is_admin());

create index if not exists community_posts_status_created_idx
on public.community_posts (status, created_at desc);

create index if not exists community_posts_type_created_idx
on public.community_posts (post_type, created_at desc);

create index if not exists community_posts_region_created_idx
on public.community_posts (region, created_at desc);

create index if not exists community_posts_created_by_idx
on public.community_posts (created_by, created_at desc);
