-- Trigger para criar perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar o trigger se não existir
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Criar workspace inicial para novos usuários
CREATE OR REPLACE FUNCTION public.create_initial_workspace()
RETURNS trigger AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar workspace inicial
DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;
CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.create_initial_workspace();