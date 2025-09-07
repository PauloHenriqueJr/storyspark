-- FKs opcionais para melhorar integridade sem quebrar fluxos existentes
-- As colunas já são NULLable; usamos ON DELETE SET NULL

do $$ begin
  alter table public.copies
    add constraint copies_persona_id_fkey
    foreign key (persona_id) references public.personas(id)
    on delete set null;
exception when duplicate_object then null; end $$;

do $$ begin
  alter table public.copies
    add constraint copies_brand_voice_id_fkey
    foreign key (brand_voice_id) references public.brand_voices(id)
    on delete set null;
exception when duplicate_object then null; end $$;

do $$ begin
  alter table public.copies
    add constraint copies_campaign_id_fkey
    foreign key (campaign_id) references public.campaigns(id)
    on delete set null;
exception when duplicate_object then null; end $$;
