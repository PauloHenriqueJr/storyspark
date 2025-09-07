-- RPC de busca Full-Text Search (Português) em public.copies
-- Idempotente; respeita RLS (security invoker padrão)

create or replace function public.search_copies_fts(
  p_query text,
  p_platform text default null,
  p_copy_type text default null,
  p_limit int default 20,
  p_offset int default 0
)
returns table (
  id uuid,
  created_at timestamptz,
  user_id uuid,
  workspace_id uuid,
  title text,
  content text,
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
  metadata jsonb,
  total_count bigint
)
language sql
stable
set search_path = public
as $$
  select
    c.id,
    c.created_at,
    c.user_id,
    c.workspace_id,
    c.title,
    c.content,
    c.platform,
    c.copy_type,
    c.persona_id,
    c.brand_voice_id,
    c.campaign_id,
    c.model,
    c.temperature,
    c.tokens_input,
    c.tokens_output,
    c.cost_usd,
    c.metadata,
    count(*) over() as total_count
  from public.copies c
  where (p_platform is null or c.platform = p_platform)
    and (p_copy_type is null or c.copy_type = p_copy_type)
    and to_tsvector('portuguese', coalesce(c.title,'') || ' ' || coalesce(c.content,'')) @@ plainto_tsquery('portuguese', p_query)
  order by ts_rank_cd(
            to_tsvector('portuguese', coalesce(c.title,'') || ' ' || coalesce(c.content,'')),
            plainto_tsquery('portuguese', p_query)
          ) desc,
           c.created_at desc
  limit p_limit offset p_offset;
$$;

-- Comentário para documentação
comment on function public.search_copies_fts(text, text, text, int, int)
  is 'Busca FTS (pt) em copies, com filtros opcionais de plataforma e tipo, retorno paginado e total_count via window function.';
