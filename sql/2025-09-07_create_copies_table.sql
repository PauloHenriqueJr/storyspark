-- Extensão necessária para UUID (idempotente)
create extension if not exists pgcrypto;

-- Tabela de histórico de copies geradas por IA (idempotente)
create table if not exists public.copies (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workspace_id uuid not null,
  title text,
  content text not null,
  platform text,
  copy_type text,
  persona_id uuid,
  brand_voice_id uuid,
  campaign_id uuid,
  model text,
  temperature numeric,
  tokens_input integer,
  tokens_output integer,
  cost_usd numeric,
  metadata jsonb default '{}'::jsonb
);

-- Índices (idempotentes)
create index if not exists idx_copies_user_created on public.copies(user_id, created_at desc);
create index if not exists idx_copies_workspace_created on public.copies(workspace_id, created_at desc);
create index if not exists idx_copies_platform on public.copies(platform);
create index if not exists idx_copies_copy_type on public.copies(copy_type);
create index if not exists idx_copies_fts on public.copies using gin (
  to_tsvector('portuguese', coalesce(title,'') || ' ' || coalesce(content,''))
);

-- RLS e políticas (idempotentes)
alter table public.copies enable row level security;

do $$ begin
  create policy copies_select_own on public.copies for select
    using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy copies_insert_own on public.copies for insert
    with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy copies_update_own on public.copies for update
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy copies_delete_own on public.copies for delete
    using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
