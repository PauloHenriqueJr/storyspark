-- Configurar secrets para o sistema de email com domínio storyspark.com.br
-- IMPORTANTE: Substitua os valores abaixo com suas credenciais reais

-- Limpar secrets antigos se existirem
DELETE FROM vault.secrets WHERE name IN ('EMAIL_FROM', 'EMAIL_FROM_NAME', 'TEST_EMAIL', 'EMAIL_MODE', 'RESEND_API_KEY');

-- Configurar novos secrets para o sistema de email
INSERT INTO vault.secrets (name, secret, description) VALUES
  ('RESEND_API_KEY', 're_g2jbn5Pg_8pVbqLrhnxMfZ4c3ucABUzJG', 'API key do Resend para envio de emails'),
  ('EMAIL_MODE', 'development', 'Modo de operação do email (development ou production)'),
  ('TEST_EMAIL', 'paulojack2011@gmail.com', 'Email para receber todos os emails em modo desenvolvimento'),
  ('EMAIL_FROM', 'suporte@storyspark.com.br', 'Email remetente padrão para emails do sistema'),
  ('EMAIL_FROM_NAME', 'StorySpark', 'Nome do remetente padrão para emails do sistema')
ON CONFLICT (name) DO UPDATE 
SET secret = EXCLUDED.secret, 
    description = EXCLUDED.description,
    updated_at = NOW();

-- Confirmar que os secrets foram criados
SELECT 
  name, 
  description,
  CASE 
    WHEN name = 'RESEND_API_KEY' THEN LEFT(secret, 10) || '...' 
    ELSE secret 
  END as valor_configurado,
  created_at,
  updated_at
FROM vault.secrets 
WHERE name IN ('EMAIL_FROM', 'EMAIL_FROM_NAME', 'TEST_EMAIL', 'EMAIL_MODE', 'RESEND_API_KEY')
ORDER BY name;
