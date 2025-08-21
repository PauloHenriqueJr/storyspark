-- Correção dos problemas de segurança críticos

-- 1. Habilitar RLS nas tabelas necessárias
ALTER TABLE public._prisma_migrations ENABLE ROW LEVEL SECURITY;

-- 2. Corrigir search_path nas funções críticas
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url);
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_initial_workspace()
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = 'public'
AS $$
BEGIN
  -- Criar workspace inicial
  INSERT INTO public.workspaces (owner_id, name, slug, plan)
  VALUES (
    NEW.id,
    'Workspace Principal',
    'principal-' || NEW.id,
    'FREE'
  );
  
  -- Adicionar usuário como membro do workspace
  INSERT INTO public.workspace_members (user_id, workspace_id, role, status)
  SELECT 
    NEW.id,
    w.id,
    'OWNER',
    'active'
  FROM public.workspaces w 
  WHERE w.owner_id = NEW.id 
  LIMIT 1;
  
  RETURN NEW;
END;
$$;

-- 3. Política para a tabela _prisma_migrations (apenas super admins podem acessar)
CREATE POLICY "Only super admins can access migrations" 
ON public._prisma_migrations 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE id = auth.uid() AND role = 'super_admin'
));