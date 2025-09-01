-- Waitlist + Feedback (Suggestions/Votes) schema for StorySpark landing

-- Enable pgcrypto for gen_random_uuid if not already
create extension if not exists pgcrypto;

-- Waitlist signups
create table if not exists public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  consent boolean not null default false,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  referrer text,
  variant text,
  created_at timestamptz not null default now()
);

alter table public.waitlist_signups enable row level security;

-- Ensure roles have basic privileges (RLS still applies)
grant usage on schema public to anon, authenticated;
grant insert on public.waitlist_signups to anon, authenticated;

-- Allow anonymous and authenticated inserts (frontend) without exposing selects
do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='waitlist_signups' and policyname='waitlist_insert_any'
  ) then
    create policy waitlist_insert_any on public.waitlist_signups
      for insert to anon, authenticated
      with check (true);
  end if;
end $$;

-- Helpful indexes
create index if not exists idx_waitlist_signups_created_at on public.waitlist_signups(created_at desc);
create index if not exists idx_waitlist_signups_utm on public.waitlist_signups(utm_source, utm_medium, utm_campaign);

-- Suggestions (feedback wall / word cloud)
create table if not exists public.suggestions (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  author_meta jsonb,
  created_at timestamptz not null default now()
);

alter table public.suggestions enable row level security;
grant select, insert on public.suggestions to anon, authenticated;

-- Votes for suggestions (simple dedupe by suggestion_id + user_key)
create table if not exists public.suggestion_votes (
  id uuid primary key default gen_random_uuid(),
  suggestion_id uuid not null references public.suggestions(id) on delete cascade,
  user_key text not null,
  created_at timestamptz not null default now(),
  unique (suggestion_id, user_key)
);

alter table public.suggestion_votes enable row level security;
grant select, insert, delete on public.suggestion_votes to anon, authenticated;

-- Policies (permissive MVP – consider adding rate limits/server functions later)
do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='suggestions' and policyname='suggestions_select_any'
  ) then
    create policy suggestions_select_any on public.suggestions for select to anon, authenticated using (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='suggestions' and policyname='suggestions_insert_any'
  ) then
    create policy suggestions_insert_any on public.suggestions for insert to anon, authenticated with check (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='suggestion_votes' and policyname='votes_select_any'
  ) then
    create policy votes_select_any on public.suggestion_votes for select to anon, authenticated using (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='suggestion_votes' and policyname='votes_insert_any'
  ) then
    create policy votes_insert_any on public.suggestion_votes for insert to anon, authenticated with check (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='suggestion_votes' and policyname='votes_delete_any'
  ) then
    create policy votes_delete_any on public.suggestion_votes for delete to anon, authenticated using (true);
  end if;
end $$;

-- Indexes for feedback
create index if not exists idx_suggestions_created_at on public.suggestions(created_at desc);
create index if not exists idx_votes_suggestion on public.suggestion_votes(suggestion_id);
