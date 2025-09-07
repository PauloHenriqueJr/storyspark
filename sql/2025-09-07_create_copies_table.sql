-- Create copies table for generated content history
create table if not exists public.copies (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  workspace_id text not null default 'default',
  title text,
  content text not null,
  platform text,
  copy_type text,
  persona_id uuid references public.target_personas(id) on delete set null,
  brand_voice_id uuid references public.brand_voices(id) on delete set null,
  campaign_id uuid references public.campaigns(id) on delete set null,
  model text,
  temperature numeric,
  tokens_input int,
  tokens_output int,
  cost_usd numeric(10,5),
  metadata jsonb default '{}'::jsonb
);

-- Indexes
create index if not exists idx_copies_user_created on public.copies(user_id, created_at desc);
create index if not exists idx_copies_workspace_created on public.copies(workspace_id, created_at desc);
create index if not exists idx_copies_platform_type on public.copies(platform, copy_type);

-- Full-text search index (optional but handy)
create index if not exists idx_copies_fts on public.copies using gin (to_tsvector('portuguese', coalesce(title,'') || ' ' || coalesce(content,'')));

-- RLS
alter table public.copies enable row level security;

-- Allow owner
create policy if not exists copies_owner_select on public.copies
  for select using (auth.uid() = user_id);
create policy if not exists copies_owner_insert on public.copies
  for insert with check (auth.uid() = user_id);
create policy if not exists copies_owner_update on public.copies
  for update using (auth.uid() = user_id);
create policy if not exists copies_owner_delete on public.copies
  for delete using (auth.uid() = user_id);
