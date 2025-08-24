-- =====================================================
-- SCRIPT DE CONFIGURAÇÃO - SISTEMA DE UPLOAD COM IA
-- =====================================================
-- Execute este script no SQL Editor do Supabase
-- Data: $(date)
-- Versão: 1.0.0

-- =====================================================
-- 1. CRIAR TABELA DE JOBS DE PROCESSAMENTO
-- =====================================================

CREATE TABLE IF NOT EXISTS ai_processing_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  extracted_data JSONB,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. CRIAR ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_ai_processing_jobs_user_id ON ai_processing_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_processing_jobs_status ON ai_processing_jobs(status);
CREATE INDEX IF NOT EXISTS idx_ai_processing_jobs_created_at ON ai_processing_jobs(created_at DESC);

-- =====================================================
-- 3. CRIAR BUCKET PARA UPLOAD DE DOCUMENTOS
-- =====================================================

-- Nota: Execute isso no Storage do Supabase se o bucket não existir
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'document-uploads', 
  'document-uploads', 
  false, 
  10485760, -- 10MB
  ARRAY['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 4. CRIAR POLÍTICAS RLS PARA A TABELA
-- =====================================================

ALTER TABLE ai_processing_jobs ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem apenas seus próprios jobs
DROP POLICY IF EXISTS "Users can view their own processing jobs" ON ai_processing_jobs;
CREATE POLICY "Users can view their own processing jobs" ON ai_processing_jobs
  FOR SELECT USING (auth.uid() = user_id);

-- Política para usuários criarem seus próprios jobs
DROP POLICY IF EXISTS "Users can create their own processing jobs" ON ai_processing_jobs;
CREATE POLICY "Users can create their own processing jobs" ON ai_processing_jobs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para usuários atualizarem seus próprios jobs
DROP POLICY IF EXISTS "Users can update their own processing jobs" ON ai_processing_jobs;
CREATE POLICY "Users can update their own processing jobs" ON ai_processing_jobs
  FOR UPDATE USING (auth.uid() = user_id);

-- Política para usuários deletarem seus próprios jobs
DROP POLICY IF EXISTS "Users can delete their own processing jobs" ON ai_processing_jobs;
CREATE POLICY "Users can delete their own processing jobs" ON ai_processing_jobs
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 5. CRIAR FUNÇÃO PARA ATUALIZAR UPDATED_AT
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- =====================================================
-- 6. CRIAR TRIGGER PARA ATUALIZAR UPDATED_AT
-- =====================================================

DROP TRIGGER IF EXISTS update_ai_processing_jobs_updated_at ON ai_processing_jobs;
CREATE TRIGGER update_ai_processing_jobs_updated_at 
  BEFORE UPDATE ON ai_processing_jobs 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 7. CRIAR POLÍTICAS PARA O BUCKET DE STORAGE
-- =====================================================

-- Política para usuários fazerem upload de seus próprios arquivos
DROP POLICY IF EXISTS "Users can upload their own files" ON storage.objects;
CREATE POLICY "Users can upload their own files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'document-uploads' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Política para usuários verem seus próprios arquivos
DROP POLICY IF EXISTS "Users can view their own files" ON storage.objects;
CREATE POLICY "Users can view their own files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'document-uploads' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Política para usuários deletarem seus próprios arquivos
DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;
CREATE POLICY "Users can delete their own files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'document-uploads' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- =====================================================
-- 8. VERIFICAR CONFIGURAÇÃO DE IA
-- =====================================================

-- Verificar se existe configuração de IA
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM admin_llm_settings LIMIT 1) THEN
    RAISE NOTICE '⚠️  ATENÇÃO: Tabela admin_llm_settings não encontrada ou vazia.';
    RAISE NOTICE '   Configure a IA no painel administrativo antes de usar o upload.';
  ELSE
    RAISE NOTICE '✅ Configuração de IA encontrada.';
  END IF;
END $$;

-- =====================================================
-- 9. CRIAR COMENTÁRIOS PARA DOCUMENTAÇÃO
-- =====================================================

COMMENT ON TABLE ai_processing_jobs IS 'Tabela para armazenar jobs de processamento de documentos com IA';
COMMENT ON COLUMN ai_processing_jobs.user_id IS 'ID do usuário que criou o job';
COMMENT ON COLUMN ai_processing_jobs.file_path IS 'Caminho do arquivo no storage';
COMMENT ON COLUMN ai_processing_jobs.file_name IS 'Nome original do arquivo';
COMMENT ON COLUMN ai_processing_jobs.file_type IS 'Tipo MIME do arquivo';
COMMENT ON COLUMN ai_processing_jobs.status IS 'Status do processamento: pending, processing, completed, failed';
COMMENT ON COLUMN ai_processing_jobs.extracted_data IS 'Dados extraídos pela IA em formato JSON';
COMMENT ON COLUMN ai_processing_jobs.error_message IS 'Mensagem de erro caso o processamento falhe';

-- =====================================================
-- 10. VERIFICAÇÃO FINAL
-- =====================================================

-- Verificar se tudo foi criado corretamente
SELECT 
  'Tabela ai_processing_jobs' as item,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ai_processing_jobs') 
    THEN '✅ Criada' 
    ELSE '❌ Não encontrada' 
  END as status
UNION ALL
SELECT 
  'Bucket document-uploads' as item,
  CASE WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'document-uploads') 
    THEN '✅ Criado' 
    ELSE '❌ Não encontrado' 
  END as status
UNION ALL
SELECT 
  'RLS habilitado' as item,
  CASE WHEN EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'ai_processing_jobs' AND rowsecurity = true) 
    THEN '✅ Habilitado' 
    ELSE '❌ Desabilitado' 
  END as status
UNION ALL
SELECT 
  'Trigger updated_at' as item,
  CASE WHEN EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_ai_processing_jobs_updated_at') 
    THEN '✅ Criado' 
    ELSE '❌ Não encontrado' 
  END as status;

-- =====================================================
-- SCRIPT CONCLUÍDO
-- =====================================================

RAISE NOTICE '🎉 Configuração do sistema de upload com IA concluída!';
RAISE NOTICE '📋 Próximos passos:';
RAISE NOTICE '   1. Configure a IA no painel administrativo';
RAISE NOTICE '   2. Teste o upload com um documento';
RAISE NOTICE '   3. Monitore os logs de processamento';