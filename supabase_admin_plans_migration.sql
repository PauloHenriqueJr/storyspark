-- Migração para criar sistema de gerenciamento de planos dinâmico
-- Execute este SQL no Supabase SQL Editor

-- Criar tabela admin_plans
CREATE TABLE IF NOT EXISTS admin_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  price_brl DECIMAL(10,2) NOT NULL DEFAULT 0,
  monthly_credits INTEGER,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  is_popular BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_admin_plans_slug ON admin_plans(slug);
CREATE INDEX IF NOT EXISTS idx_admin_plans_active ON admin_plans(is_active);
CREATE INDEX IF NOT EXISTS idx_admin_plans_order ON admin_plans(display_order);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_admin_plans_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
DROP TRIGGER IF EXISTS trigger_admin_plans_updated_at ON admin_plans;
CREATE TRIGGER trigger_admin_plans_updated_at
  BEFORE UPDATE ON admin_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_admin_plans_updated_at();

-- Inserir planos padrão (baseado na configuração atual)
INSERT INTO admin_plans (name, slug, price_brl, monthly_credits, features, description, is_active, is_popular, display_order) VALUES
(
  'Free', 
  'free', 
  0, 
  0, 
  '["0 créditos/mês", "Acesso limitado", "Suporte via documentação", "1 usuário"]'::jsonb,
  'Plano gratuito para teste',
  true,
  false,
  1
),
(
  'Starter', 
  'starter', 
  97, 
  150, 
  '["150 créditos de IA por mês", "3 integrações", "Analytics básicos", "1 usuário", "Templates básicos"]'::jsonb,
  'Perfeito para começar',
  true,
  false,
  2
),
(
  'Pro', 
  'pro', 
  297, 
  800, 
  '["800 créditos de IA por mês", "10 integrações", "Analytics avançados", "Até 5 usuários", "Templates premium", "Brand voices ilimitadas"]'::jsonb,
  'Para equipes em crescimento',
  true,
  true,
  3
),
(
  'Business', 
  'business', 
  697, 
  3000, 
  '["3.000 créditos de IA por mês", "Integrações avançadas", "Analytics enterprise", "Usuários ilimitados", "API personalizada", "Suporte prioritário"]'::jsonb,
  'Para alto volume',
  true,
  false,
  4
),
(
  'Enterprise', 
  'enterprise', 
  1200, 
  NULL, 
  '["Créditos ilimitados", "Integrações ilimitadas", "Analytics enterprise", "Usuários ilimitados", "API personalizada", "Suporte dedicado 24/7"]'::jsonb,
  'Para grandes empresas',
  true,
  false,
  5
);

-- RLS Policies para admin_plans
ALTER TABLE admin_plans ENABLE ROW LEVEL SECURITY;

-- Policy: Todos podem ler planos ativos (para mostrar na landing page e billing)
CREATE POLICY "Anyone can view active plans" ON admin_plans
  FOR SELECT USING (is_active = true);

-- Policy: Apenas admins podem gerenciar planos
CREATE POLICY "Admins can manage plans" ON admin_plans
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_managers 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'admin')
      AND status = 'active'
    )
  );

-- Comentários na tabela
COMMENT ON TABLE admin_plans IS 'Configuração dinâmica de planos de assinatura';
COMMENT ON COLUMN admin_plans.monthly_credits IS 'NULL = ilimitado, 0 = sem créditos, número = limite mensal';
COMMENT ON COLUMN admin_plans.features IS 'Array JSON com lista de features do plano';
COMMENT ON COLUMN admin_plans.display_order IS 'Ordem de exibição nos componentes (1 = primeiro)';

-- Verificar se inseriu corretamente
SELECT name, slug, price_brl, monthly_credits, is_active, is_popular 
FROM admin_plans 
ORDER BY display_order;
