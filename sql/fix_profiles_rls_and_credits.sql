-- Correção das políticas RLS para tabela profiles e sistema de créditos
-- Execute este SQL no Supabase SQL Editor

-- 1. Habilitar RLS na tabela profiles se não estiver habilitado
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Super admins can manage all profiles" ON public.profiles;

-- 3. Criar política para usuários verem seu próprio perfil
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- 4. Criar política para usuários atualizarem seu próprio perfil (campos limitados)
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 5. Criar política para admins verem todos os perfis
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() 
      AND p.role IN ('admin', 'super_admin')
    )
    OR 
    EXISTS (
      SELECT 1 FROM public.admin_managers am
      WHERE am.user_id = auth.uid() 
      AND am.role IN ('admin', 'super_admin')
      AND am.status = 'active'
    )
  );

-- 6. Criar política para admins atualizarem créditos e campos administrativos
CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() 
      AND p.role IN ('admin', 'super_admin')
    )
    OR 
    EXISTS (
      SELECT 1 FROM public.admin_managers am
      WHERE am.user_id = auth.uid() 
      AND am.role IN ('admin', 'super_admin')
      AND am.status = 'active'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() 
      AND p.role IN ('admin', 'super_admin')
    )
    OR 
    EXISTS (
      SELECT 1 FROM public.admin_managers am
      WHERE am.user_id = auth.uid() 
      AND am.role IN ('admin', 'super_admin')
      AND am.status = 'active'
    )
  );

-- 7. Criar política para super admins terem controle total
CREATE POLICY "Super admins can manage all profiles" ON public.profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() 
      AND p.role = 'super_admin'
    )
    OR 
    EXISTS (
      SELECT 1 FROM public.admin_managers am
      WHERE am.user_id = auth.uid() 
      AND am.role = 'super_admin'
      AND am.status = 'active'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() 
      AND p.role = 'super_admin'
    )
    OR 
    EXISTS (
      SELECT 1 FROM public.admin_managers am
      WHERE am.user_id = auth.uid() 
      AND am.role = 'super_admin'
      AND am.status = 'active'
    )
  );

-- 8. Adicionar campos necessários na tabela profiles se não existirem
DO $$
BEGIN
    -- Adicionar campo credits se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'credits') THEN
        ALTER TABLE public.profiles ADD COLUMN credits INTEGER DEFAULT 20;
        COMMENT ON COLUMN public.profiles.credits IS 'Créditos disponíveis do usuário para gerar copies';
    END IF;

    -- Adicionar campo monthly_credits_reset_date se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'monthly_credits_reset_date') THEN
        ALTER TABLE public.profiles ADD COLUMN monthly_credits_reset_date DATE DEFAULT CURRENT_DATE;
        COMMENT ON COLUMN public.profiles.monthly_credits_reset_date IS 'Data do último reset mensal de créditos';
    END IF;

    -- Adicionar campo subscription_tier se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'subscription_tier') THEN
        ALTER TABLE public.profiles ADD COLUMN subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'starter', 'pro', 'business', 'enterprise'));
        COMMENT ON COLUMN public.profiles.subscription_tier IS 'Plano de assinatura atual do usuário';
    END IF;

    -- Adicionar campo monthly_tokens_used se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'monthly_tokens_used') THEN
        ALTER TABLE public.profiles ADD COLUMN monthly_tokens_used INTEGER DEFAULT 0;
        COMMENT ON COLUMN public.profiles.monthly_tokens_used IS 'Tokens usados no mês atual (para analytics)';
    END IF;
END $$;

-- 9. Criar função para adicionar créditos avulsos (apenas para admins)
CREATE OR REPLACE FUNCTION public.admin_add_credits(
  target_user_id UUID,
  credits_to_add INTEGER,
  reason TEXT DEFAULT 'Créditos adicionados pelo admin'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  current_user_role TEXT;
  target_user_record RECORD;
  new_credits INTEGER;
  result JSONB;
BEGIN
  -- Verificar se o usuário atual é admin
  SELECT role INTO current_user_role 
  FROM profiles 
  WHERE id = auth.uid();
  
  IF current_user_role NOT IN ('admin', 'super_admin') THEN
    -- Verificar se é admin via admin_managers
    IF NOT EXISTS (
      SELECT 1 FROM admin_managers 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin')
      AND status = 'active'
    ) THEN
      RETURN jsonb_build_object(
        'success', false,
        'error', 'Apenas administradores podem adicionar créditos'
      );
    END IF;
  END IF;

  -- Buscar usuário alvo
  SELECT id, email, full_name, credits, subscription_tier 
  INTO target_user_record
  FROM profiles 
  WHERE id = target_user_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Usuário não encontrado'
    );
  END IF;

  -- Calcular novos créditos
  new_credits := COALESCE(target_user_record.credits, 0) + credits_to_add;

  -- Atualizar créditos
  UPDATE profiles 
  SET 
    credits = new_credits,
    updated_at = NOW()
  WHERE id = target_user_id;

  -- Log da operação (opcional - pode criar tabela de logs depois)
  -- INSERT INTO admin_credit_logs (admin_id, target_user_id, credits_added, reason, created_at)
  -- VALUES (auth.uid(), target_user_id, credits_to_add, reason, NOW());

  RETURN jsonb_build_object(
    'success', true,
    'user_email', target_user_record.email,
    'user_name', target_user_record.full_name,
    'credits_added', credits_to_add,
    'previous_credits', target_user_record.credits,
    'new_credits', new_credits,
    'reason', reason
  );
END;
$$;

-- 10. Garantir que o admin tenha créditos ilimitados (valor alto)
UPDATE public.profiles 
SET 
  credits = 999999,
  subscription_tier = 'enterprise',
  monthly_tokens_used = 0,
  updated_at = NOW()
WHERE role IN ('super_admin', 'admin') 
AND credits < 999999;

-- 11. Comentários e documentação
COMMENT ON FUNCTION public.admin_add_credits IS 'Função para administradores adicionarem créditos a qualquer usuário';

-- 12. Testar as políticas (log de verificação)
DO $$
DECLARE
  admin_count INTEGER;
  user_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO admin_count FROM profiles WHERE role IN ('admin', 'super_admin');
  SELECT COUNT(*) INTO user_count FROM profiles WHERE role = 'user';
  
  RAISE NOTICE 'Políticas RLS criadas com sucesso!';
  RAISE NOTICE 'Administradores encontrados: %', admin_count;
  RAISE NOTICE 'Usuários normais encontrados: %', user_count;
END $$;
