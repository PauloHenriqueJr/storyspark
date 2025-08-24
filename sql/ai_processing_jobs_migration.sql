-- Migração para criar tabela de jobs de processamento de IA
-- Execute este SQL no seu banco Supabase

-- 1. Criar tabela de jobs de processamento
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

-- 2. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_ai_processing_jobs_user_id ON ai_processing_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_processing_jobs_status ON ai_processing_jobs(status);
CREATE INDEX IF NOT EXISTS idx_ai_processing_jobs_created_at ON ai_processing_jobs(created_at DESC);

-- 3. Criar bucket para upload de documentos (se não existir)
-- Nota: Execute isso no Storage do Supabase
-- INSERT INTO storage.buckets (id, name, public) VALUES ('document-uploads', 'document-uploads', false);

-- 4. Criar política RLS para a tabela
ALTER TABLE ai_processing_jobs ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem apenas seus próprios jobs
CREATE POLICY "Users can view their own processing jobs" ON ai_processing_jobs
  FOR SELECT USING (auth.uid() = user_id);

-- Política para usuários criarem seus próprios jobs
CREATE POLICY "Users can create their own processing jobs" ON ai_processing_jobs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para usuários atualizarem seus próprios jobs
CREATE POLICY "Users can update their own processing jobs" ON ai_processing_jobs
  FOR UPDATE USING (auth.uid() = user_id);

-- Política para usuários deletarem seus próprios jobs
CREATE POLICY "Users can delete their own processing jobs" ON ai_processing_jobs
  FOR DELETE USING (auth.uid() = user_id);

-- 5. Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Criar trigger para atualizar updated_at
CREATE TRIGGER update_ai_processing_jobs_updated_at 
  BEFORE UPDATE ON ai_processing_jobs 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- 7. Comentários para documentação
COMMENT ON TABLE ai_processing_jobs IS 'Tabela para armazenar jobs de processamento de documentos com IA';
COMMENT ON COLUMN ai_processing_jobs.user_id IS 'ID do usuário que criou o job';
COMMENT ON COLUMN ai_processing_jobs.file_path IS 'Caminho do arquivo no storage';
COMMENT ON COLUMN ai_processing_jobs.file_name IS 'Nome original do arquivo';
COMMENT ON COLUMN ai_processing_jobs.file_type IS 'Tipo MIME do arquivo';
COMMENT ON COLUMN ai_processing_jobs.status IS 'Status do processamento: pending, processing, completed, failed';
COMMENT ON COLUMN ai_processing_jobs.extracted_data IS 'Dados extraídos pela IA em formato JSON';
COMMENT ON COLUMN ai_processing_jobs.error_message IS 'Mensagem de erro caso o processamento falhe';