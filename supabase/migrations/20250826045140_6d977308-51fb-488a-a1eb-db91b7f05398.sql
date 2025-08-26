-- Create waitlist table
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

-- Enable RLS and allow anonymous inserts
alter table public.waitlist enable row level security;
create policy "Allow anonymous insert" on public.waitlist
  for insert
  with check (true);
