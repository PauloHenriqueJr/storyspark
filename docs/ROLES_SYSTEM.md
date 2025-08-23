# 🛡️ Sistema de Roles - StorySpark

## 📋 Visão Geral

O StorySpark utiliza um sistema de roles baseado em banco de dados para controlar permissões e acesso a funcionalidades. Este sistema é **completamente baseado na coluna `role` da tabela `profiles`**, não utilizando verificações por email.

## 🎭 Tipos de Roles

### 1. **user** (Padrão)
- Role padrão para todos os novos usuários
- Acesso a funcionalidades básicas da plataforma
- Dashboard, criação de campanhas, analytics básicos

### 2. **admin** 
- Acesso administrativo intermediário
- Pode acessar dashboard administrativo
- Gerenciar configurações gerais
- **NÃO** pode gerenciar usuários ou outros admins

### 3. **super_admin**
- Acesso administrativo completo
- Todas as permissões de admin +
- Gerenciar usuários e outros admins
- Configurações críticas do sistema

## 🔧 Implementação Técnica

### Hook `useRole`

O hook principal para verificação de roles:

```typescript
import { useRole } from '@/hooks/useRole';

const MyComponent = () => {
  const { 
    currentRole,           // Role atual: 'user' | 'admin' | 'super_admin' | 'guest'
    isUser,               // () => boolean
    isAdmin,              // () => boolean  
    isSuperAdmin,         // () => boolean
    hasAdminAccess,       // () => boolean (admin OU super_admin)
    hasSuperAdminAccess,  // () => boolean (apenas super_admin)
    hasRole,              // (role: string) => boolean
    hasAnyRole,           // (roles: string[]) => boolean
    getRoleBadgeColor,    // () => string (cor do badge)
    getRoleDisplayName    // () => string (nome para exibição)
  } = useRole();

  return (
    <div>
      {hasAdminAccess() && <AdminPanel />}
      {isSuperAdmin() && <SuperAdminTools />}
    </div>
  );
};
```

### Componente `ProtectedRoute`

Proteção de rotas baseada em roles:

```typescript
// Proteção básica (apenas autenticado)
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>

// Apenas admins (admin OU super_admin)
<ProtectedRoute adminOnly>
  <AdminDashboard />
</ProtectedRoute>

// Apenas super admins
<ProtectedRoute superAdminOnly>
  <UserManagement />
</ProtectedRoute>

// Role específico
<ProtectedRoute requiredRole="admin">
  <AdminSettings />
</ProtectedRoute>

// Múltiplos roles permitidos
<ProtectedRoute requiredRole={["admin", "super_admin"]}>
  <AdminTools />
</ProtectedRoute>
```

## 🗄️ Estrutura do Banco de Dados

### Tabela `profiles`

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index para performance
CREATE INDEX idx_profiles_role ON profiles(role);
```

### Trigger Automático

O sistema possui trigger que cria automaticamente o perfil quando um usuário se autentica:

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url',
    'user' -- Role padrão
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 🔄 Fluxo de Autenticação

1. **Login**: Usuário faz login via Google ou email
2. **Trigger**: Sistema cria/atualiza perfil automaticamente 
3. **AuthProvider**: Busca perfil no banco de dados
4. **Role Assignment**: Usa APENAS o campo `role` da tabela
5. **Verificação**: Hook `useRole` disponibiliza funções de verificação

## 📝 Exemplo de Uso Completo

```typescript
import { useRole } from '@/hooks/useRole';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Página com diferentes níveis de acesso
const AdminPage = () => {
  const { currentRole, hasAdminAccess, isSuperAdmin } = useRole();

  return (
    <div>
      <h1>Painel Administrativo</h1>
      <p>Seu role: {currentRole}</p>
      
      {hasAdminAccess() && (
        <div>
          <h2>Ferramentas de Admin</h2>
          {/* Funcionalidades para admin e super_admin */}
        </div>
      )}
      
      {isSuperAdmin() && (
        <div>
          <h2>Ferramentas de Super Admin</h2>
          {/* Funcionalidades APENAS para super_admin */}
        </div>
      )}
    </div>
  );
};

// Uso em rotas
<Route path="/admin" element={
  <ProtectedRoute adminOnly>
    <AdminPage />
  </ProtectedRoute>
} />
```

## 🛠️ Gerenciamento de Roles

### Como Alterar Role de um Usuário

Para alterar o role de um usuário, atualize diretamente no banco:

```sql
-- Promover usuário para admin
UPDATE profiles 
SET role = 'admin', updated_at = NOW() 
WHERE email = 'usuario@exemplo.com';

-- Promover para super_admin
UPDATE profiles 
SET role = 'super_admin', updated_at = NOW() 
WHERE email = 'admin@exemplo.com';

-- Voltar para user
UPDATE profiles 
SET role = 'user', updated_at = NOW() 
WHERE email = 'antigo-admin@exemplo.com';
```

### Verificar Usuários por Role

```sql
-- Listar todos os admins
SELECT email, full_name, role, created_at 
FROM profiles 
WHERE role IN ('admin', 'super_admin');

-- Contar usuários por role
SELECT role, COUNT(*) 
FROM profiles 
GROUP BY role;
```

## 🚨 Principais Diferenças do Sistema Anterior

| Aspecto | ❌ Sistema Anterior | ✅ Sistema Atual |
|---------|-------------------|------------------|
| **Verificação** | Por email hardcoded | Por role no banco |
| **Flexibilidade** | Apenas 1 super admin | Múltiplos admins/roles |
| **Segurança** | Email no código | Role criptografado no banco |
| **Manutenção** | Requer mudança de código | Apenas SQL |
| **Escalabilidade** | Limitada | Ilimitada |

## 🔒 Segurança

- ✅ **Roles no banco**: Impossível de manipular pelo frontend
- ✅ **Verificação server-side**: Supabase RLS pode usar roles
- ✅ **Auditoria**: Todas as mudanças ficam registradas
- ✅ **Princípio do menor privilégio**: Cada role tem acesso mínimo necessário

## 📚 Referências

- **Hook**: `/src/hooks/useRole.tsx`
- **AuthProvider**: `/src/components/auth/AuthProvider.tsx`
- **ProtectedRoute**: `/src/components/auth/ProtectedRoute.tsx`
- **Migração**: `/supabase/migrations/20250821234500_add_role_to_profiles.sql`
- **Exemplos de uso**: `/src/App.tsx` (rotas protegidas)

---

*📅 Atualizado em: 21 de Agosto de 2025*  
*🔄 Versão: 2.0 - Sistema baseado em roles*