-- Tabelas de suporte para workflows (idempotente)

-- Fila de e-mails
CREATE TABLE IF NOT EXISTS public.email_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  email_type TEXT NOT NULL,
  template_data JSONB,
  status TEXT NOT NULL DEFAULT 'pending',
  attempts INT NOT NULL DEFAULT 0,
  max_attempts INT NOT NULL DEFAULT 3,
  error_message TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.email_queue ENABLE ROW LEVEL SECURITY;
DO $$BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE polname = 'email_queue_insert_any'
  ) THEN
    CREATE POLICY email_queue_insert_any ON public.email_queue FOR INSERT TO anon, authenticated WITH CHECK (TRUE);
  END IF;
END$$;

CREATE INDEX IF NOT EXISTS idx_email_queue_status ON public.email_queue(status, scheduled_at);

-- Jobs de processamento de documentos
CREATE TABLE IF NOT EXISTS public.document_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  storage_path TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  result JSONB,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.document_jobs ENABLE ROW LEVEL SECURITY;
DO $$BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE polname = 'document_jobs_insert_any'
  ) THEN
    CREATE POLICY document_jobs_insert_any ON public.document_jobs FOR INSERT TO authenticated WITH CHECK (TRUE);
  END IF;
END$$;

CREATE INDEX IF NOT EXISTS idx_document_jobs_status ON public.document_jobs(status, created_at);

-- Agendamento de posts em redes sociais
CREATE TABLE IF NOT EXISTS public.scheduled_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  platform TEXT NOT NULL, -- e.g., 'meta', 'linkedin', 'twitter'
  content TEXT NOT NULL,
  media JSONB,
  status TEXT NOT NULL DEFAULT 'scheduled',
  scheduled_for TIMESTAMPTZ NOT NULL,
  published_at TIMESTAMPTZ,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.scheduled_posts ENABLE ROW LEVEL SECURITY;
DO $$BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE polname = 'scheduled_posts_crud_auth'
  ) THEN
    CREATE POLICY scheduled_posts_crud_auth ON public.scheduled_posts
      FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
END$$;

CREATE INDEX IF NOT EXISTS idx_scheduled_posts_due ON public.scheduled_posts(status, scheduled_for);
