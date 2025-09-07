-- RPC: Full-text search for copies with optional filters and pagination (idempotent)
-- Uses Portuguese text search over title + content. RLS applies (SECURITY INVOKER default).

create or replace function public.search_copies_fts(
  q text,
  p_platform text default null,
  p_copy_type text default null,
  p_limit integer default 20,
  p_offset integer default 0
)
returns setof public.copies
language sql
stable
as $$
  select *
  from public.copies
  where (
    q is null or q = '' or to_tsvector('portuguese', coalesce(title,'') || ' ' || coalesce(content,'')) @@ plainto_tsquery('portuguese', q)
  )
  and (p_platform is null or platform = p_platform)
  and (p_copy_type is null or copy_type = p_copy_type)
  order by created_at desc
  limit p_limit offset p_offset;
$$;

-- Separate count helper to get total rows for the same filters (idempotent)
create or replace function public.search_copies_fts_count(
  q text,
  p_platform text default null,
  p_copy_type text default null
)
returns integer
language sql
stable
as $$
  select count(*)::int
  from public.copies
  where (
    q is null or q = '' or to_tsvector('portuguese', coalesce(title,'') || ' ' || coalesce(content,'')) @@ plainto_tsquery('portuguese', q)
  )
  and (p_platform is null or platform = p_platform)
  and (p_copy_type is null or copy_type = p_copy_type);
$$;

-- Optional: grant execute to anon/authenticated (PostgREST handles RLS)
do $$ begin
  grant execute on function public.search_copies_fts(text, text, text, integer, integer) to anon, authenticated;
exception when undefined_object then null; end $$;

do $$ begin
  grant execute on function public.search_copies_fts_count(text, text, text) to anon, authenticated;
exception when undefined_object then null; end $$;
