-- ===============================================
-- Configuração de Variáveis de Ambiente para Email
-- ===============================================
-- Execute este script no Supabase SQL Editor para configurar
-- as variáveis de ambiente necessárias para o sistema de email

-- Criar secrets no vault para as Edge Functions
-- IMPORTANTE: Substitua os valores abaixo pelos seus valores reais

-- Token do Resend (substitua pelo seu token)
INSERT INTO vault.secrets (name, secret, description)
VALUES (
  'RESEND_API_KEY',
  're_g2jbn5Pg_8pVbqLrhnxMfZ4c3ucABUzJG', -- SUBSTITUA pelo seu token
  'Token da API do Resend para envio de emails'
)
ON CONFLICT (name) 
DO UPDATE SET 
  secret = EXCLUDED.secret,
  updated_at = NOW();

-- Modo de operação (development ou production)
INSERT INTO vault.secrets (name, secret, description)
VALUES (
  'EMAIL_MODE',
  'development', -- Mude para 'production' quando o domínio estiver verificado
  'Modo de operação do sistema de email'
)
ON CONFLICT (name) 
DO UPDATE SET 
  secret = EXCLUDED.secret,
  updated_at = NOW();

-- Email de teste para modo desenvolvimento
INSERT INTO vault.secrets (name, secret, description)
VALUES (
  'TEST_EMAIL',
  'paulojack2011@gmail.com', -- SUBSTITUA pelo seu email de teste
  'Email para receber mensagens em modo desenvolvimento'
)
ON CONFLICT (name) 
DO UPDATE SET 
  secret = EXCLUDED.secret,
  updated_at = NOW();

-- Configurações do remetente
INSERT INTO vault.secrets (name, secret, description)
VALUES (
  'EMAIL_FROM',
  'suporte@storyspark.com.br', -- SUBSTITUA pelo seu email
  'Email remetente padrão'
)
ON CONFLICT (name) 
DO UPDATE SET 
  secret = EXCLUDED.secret,
  updated_at = NOW();

INSERT INTO vault.secrets (name, secret, description)
VALUES (
  'EMAIL_FROM_NAME',
  'StorySpark',
  'Nome do remetente padrão'
)
ON CONFLICT (name) 
DO UPDATE SET 
  secret = EXCLUDED.secret,
  updated_at = NOW();

-- ===============================================
-- Verificar configurações
-- ===============================================
SELECT 
  name,
  CASE 
    WHEN name = 'RESEND_API_KEY' THEN CONCAT(LEFT(secret, 10), '...')
    ELSE secret
  END as value,
  description,
  created_at,
  updated_at
FROM vault.secrets
WHERE name IN (
  'RESEND_API_KEY',
  'EMAIL_MODE',
  'TEST_EMAIL',
  'EMAIL_FROM',
  'EMAIL_FROM_NAME'
)
ORDER BY name;

-- ===============================================
-- Instruções Pós-Instalação
-- ===============================================
-- 1. Execute este script no Supabase SQL Editor
-- 2. Verifique se as variáveis foram criadas corretamente
-- 3. Para produção, atualize EMAIL_MODE para 'production'
-- 4. Certifique-se de verificar seu domínio no Resend
-- 5. Atualize RESEND_API_KEY com token de produção quando disponível
