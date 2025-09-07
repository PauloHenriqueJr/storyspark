-- Create feature_flags table and policies
-- Safe, idempotent migration

-- 1) Table
create table if not exists public.feature_flags (
  id uuid primary key default gen_random_uuid(),
  group_name text not null,
  page_path text not null,
  enabled boolean not null default true,
  description text,
  updated_by uuid null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint feature_flags_group_path_unique unique (group_name, page_path)
);

-- Helpful indexes
create index if not exists idx_feature_flags_page_path on public.feature_flags (page_path);
create index if not exists idx_feature_flags_group_page on public.feature_flags (group_name, page_path);

-- Optional FK to auth.users for updated_by (auth schema exists in Supabase)
-- This may fail if permissions disallow cross-schema FK; keep it best-effort
do $$
begin
  if exists (select 1 from pg_namespace where nspname = 'auth') then
    begin
      alter table public.feature_flags
        add constraint feature_flags_updated_by_fkey
        foreign key (updated_by) references auth.users(id);
    exception when duplicate_object then
      -- ignore if FK already exists
      null;
    end;
  end if;
end $$;

-- 2) Trigger helpers (idempotent)
-- updated_at trigger function
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- updated_by trigger function (best-effort when auth.uid() is available)
create or replace function public.set_updated_by()
returns trigger
language plpgsql
as $$
begin
  begin
    new.updated_by = auth.uid();
  exception when others then
    -- ignore if auth extension not available in this context
    null;
  end;
  return new;
end;
$$;

-- Attach triggers
do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'feature_flags'
  ) then
    -- updated_at
    drop trigger if exists set_feature_flags_updated_at on public.feature_flags;
    create trigger set_feature_flags_updated_at
      before update on public.feature_flags
      for each row execute procedure public.set_updated_at();

    -- updated_by on insert and update
    drop trigger if exists set_feature_flags_updated_by_ins on public.feature_flags;
    create trigger set_feature_flags_updated_by_ins
      before insert on public.feature_flags
      for each row execute procedure public.set_updated_by();

    drop trigger if exists set_feature_flags_updated_by_upd on public.feature_flags;
    create trigger set_feature_flags_updated_by_upd
      before update on public.feature_flags
      for each row execute procedure public.set_updated_by();
  end if;
end $$;

-- 3) RLS and policies (idempotent)
alter table public.feature_flags enable row level security;

-- Allow SELECT for everyone (even anon)
drop policy if exists feature_flags_select_all on public.feature_flags;
create policy feature_flags_select_all
  on public.feature_flags
  for select
  using (true);

-- Admin write policies via profiles.role or admin_managers
-- INSERT
drop policy if exists feature_flags_insert_admins on public.feature_flags;
create policy feature_flags_insert_admins
  on public.feature_flags
  for insert
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin','super_admin')
    )
    or exists (
      select 1 from public.admin_managers am
      where (am.user_id = auth.uid() or am.profile_id = auth.uid())
        and am.status = 'active'
        and am.role in ('admin','super_admin')
    )
  );

-- UPDATE
drop policy if exists feature_flags_update_admins on public.feature_flags;
create policy feature_flags_update_admins
  on public.feature_flags
  for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin','super_admin')
    )
    or exists (
      select 1 from public.admin_managers am
      where (am.user_id = auth.uid() or am.profile_id = auth.uid())
        and am.status = 'active'
        and am.role in ('admin','super_admin')
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin','super_admin')
    )
    or exists (
      select 1 from public.admin_managers am
      where (am.user_id = auth.uid() or am.profile_id = auth.uid())
        and am.status = 'active'
        and am.role in ('admin','super_admin')
    )
  );

-- DELETE
drop policy if exists feature_flags_delete_admins on public.feature_flags;
create policy feature_flags_delete_admins
  on public.feature_flags
  for delete
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin','super_admin')
    )
    or exists (
      select 1 from public.admin_managers am
      where (am.user_id = auth.uid() or am.profile_id = auth.uid())
        and am.status = 'active'
        and am.role in ('admin','super_admin')
    )
  );

-- 4) Realtime publication (idempotent)
-- Add table to supabase_realtime publication if not already present
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime'
        AND schemaname = 'public'
        AND tablename = 'feature_flags'
    ) THEN
      EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.feature_flags';
    END IF;
  END IF;
END $$;
