-- Run in Supabase SQL Editor (Dashboard → SQL) for production security.
-- Enables prayer requests + tightens sermon/storage access to authenticated pastors.

-- Prayer & counselling submissions
create table if not exists public.prayer_request (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.prayer_request enable row level security;

drop policy if exists "Anyone can submit prayer requests" on public.prayer_request;
create policy "Anyone can submit prayer requests"
  on public.prayer_request for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Authenticated users read prayer requests" on public.prayer_request;
create policy "Authenticated users read prayer requests"
  on public.prayer_request for select
  to authenticated
  using (true);

drop policy if exists "Authenticated users delete prayer requests" on public.prayer_request;
create policy "Authenticated users delete prayer requests"
  on public.prayer_request for delete
  to authenticated
  using (true);

-- Sermon metadata: track storage object path for safe deletes
alter table public.sermon add column if not exists storage_path text;

alter table public.sermon enable row level security;

drop policy if exists "Public read sermons" on public.sermon;
create policy "Public read sermons"
  on public.sermon for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated insert sermons" on public.sermon;
create policy "Authenticated insert sermons"
  on public.sermon for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated update sermons" on public.sermon;
create policy "Authenticated update sermons"
  on public.sermon for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated delete sermons" on public.sermon;
create policy "Authenticated delete sermons"
  on public.sermon for delete
  to authenticated
  using (true);

-- Storage bucket `sermon-audio`: public read, authenticated write/delete
-- (Adjust if your bucket id differs.)
drop policy if exists "Public read sermon audio" on storage.objects;
create policy "Public read sermon audio"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'sermon-audio');

drop policy if exists "Authenticated upload sermon audio" on storage.objects;
create policy "Authenticated upload sermon audio"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'sermon-audio');

drop policy if exists "Authenticated delete sermon audio" on storage.objects;
create policy "Authenticated delete sermon audio"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'sermon-audio');
