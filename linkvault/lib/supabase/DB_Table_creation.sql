-- Step 1: Create table
create table public.bookmarks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  url         text not null,
  description text not null default '',
  group_name  text not null default '',
  created_at  timestamptz not null default now()
);

-- Step 2: Enable Row Level Security
alter table public.bookmarks enable row level security;

-- Step 3: RLS Policy (users only see their own bookmarks)
create policy "Users can manage own bookmarks"
  on public.bookmarks
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Step 4: Index for fast queries
create index bookmarks_user_id_idx
  on public.bookmarks (user_id, created_at desc);