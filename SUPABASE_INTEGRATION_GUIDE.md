# 📋 Guia Completo de Integração Supabase - StorySpark

## 🎯 Visão Geral

Este guia detalha como conectar seu projeto Lovable ao banco Supabase existente, configurar todas as policies de segurança, edge functions e sistema de roles.

---

## 📊 Estrutura do Banco (Análise)

### ✅ **Estrutura Atual Identificada:**

#### 🏢 **Workspaces & Usuários**
- `profiles` - Perfis completos com planos e tokens
- `workspaces` - Espaços de trabalho multi-tenant
- `workspace_members` - Roles: OWNER, ADMIN, MEMBER
- `user_preferences` - Configurações personalizadas

#### 👑 **Sistema Admin (Multi-nível)**
- `admin_managers` - Admins com roles: super_admin, admin, blog_admin, analytics_admin, support_admin
- `admin_users_overview` - Dashboard de usuários
- `admin_integrations` - APIs (Stripe, SendGrid, Google, Facebook, etc)
- `admin_llm_settings` - Configurações IA (OpenAI, Anthropic, Gemini, etc)
- `admin_audit_logs` - Auditoria completa
- `admin_role_permissions` - Permissões granulares

#### 🎨 **Conteúdo & IA**
- `campaigns` - Campanhas dos usuários
- `generated_copies` - Conteúdo gerado por IA
- `templates` - Templates públicos/privados
- `brand_voices` - Tom de voz da marca
- `target_personas` - Personas de marketing
- `ai_usage_logs` - Logs detalhados de uso IA

#### 📈 **Analytics & Monitoramento**
- `admin_analytics` - Métricas de negócio
- `system_metrics` - Performance do sistema
- `system_logs` - Logs de sistema
- `usage_events` - Eventos de uso
- `metrics_cache` - Cache de métricas

#### 💳 **Billing & Segurança**
- `billing_events` - Eventos Stripe
- `security_settings` - Configurações de segurança
- `admin_invites` - Convites de admin

---

## 🔐 1. CONFIGURAÇÃO DE RLS POLICIES

### **1.1 Profiles (Usuários)**
```sql
-- Política: Usuários podem ver/editar apenas próprio perfil
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Política: Admins podem ver todos os perfis
CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_managers 
            WHERE user_id = auth.uid() 
            AND status = 'active'
        )
    );
```

### **1.2 Admin Managers (Controle Super Admin)**
```sql
-- Política: Apenas super_admin pode gerenciar outros admins
CREATE POLICY "Super admin can manage admins" ON admin_managers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_managers 
            WHERE user_id = auth.uid() 
            AND role = 'super_admin' 
            AND status = 'active'
        )
    );

-- Política: Admins podem ver próprio registro
CREATE POLICY "Admins can view own record" ON admin_managers
    FOR SELECT USING (user_id = auth.uid());
```

### **1.3 Workspaces (Multi-tenant)**
```sql
-- Política: Membros podem ver workspace
CREATE POLICY "Members can view workspace" ON workspaces
    FOR SELECT USING (
        id IN (
            SELECT workspace_id FROM workspace_members 
            WHERE user_id = auth.uid()
        )
        OR owner_id = auth.uid()
    );

-- Política: Apenas owner pode editar workspace
CREATE POLICY "Owner can update workspace" ON workspaces
    FOR UPDATE USING (owner_id = auth.uid());
```

### **1.4 Admin Analytics (Dados Sensíveis)**
```sql
-- Política: Apenas analytics_admin e super_admin
CREATE POLICY "Analytics admin access" ON admin_analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_managers 
            WHERE user_id = auth.uid() 
            AND role IN ('super_admin', 'analytics_admin')
            AND status = 'active'
        )
    );
```

### **1.5 System Logs (Auditoria)**
```sql
-- Política: Apenas super_admin e support_admin
CREATE POLICY "System logs admin access" ON system_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_managers 
            WHERE user_id = auth.uid() 
            AND role IN ('super_admin', 'support_admin')
            AND status = 'active'
        )
    );
```

---

## ⚡ 2. EDGE FUNCTIONS NECESSÁRIAS

### **2.1 Autenticação e Roles**
```typescript
// functions/auth-role-check/index.ts
import { createClient } from '@supabase/supabase-js'

export default async function handler(req: Request) {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_KEY')!
  )
  
  const { data: { user }, error } = await supabase.auth.getUser(
    req.headers.get('Authorization')?.replace('Bearer ', '')
  )
  
  if (!user) return new Response('Unauthorized', { status: 401 })
  
  // Verificar role admin
  const { data: adminRole } = await supabase
    .from('admin_managers')
    .select('role, status, permissions')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()
  
  return new Response(JSON.stringify({
    user_id: user.id,
    is_admin: !!adminRole,
    admin_role: adminRole?.role,
    permissions: adminRole?.permissions
  }), {
    headers: { 'Content-Type': 'application/json' }
  })
}
```

### **2.2 Admin Dashboard Metrics**
```typescript
// functions/admin-dashboard-metrics/index.ts
import { createClient } from '@supabase/supabase-js'

export default async function handler(req: Request) {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_KEY')!
  )
  
  // Verificar permissão admin
  const authHeader = req.headers.get('Authorization')
  // ... verificação de auth ...
  
  // Buscar métricas do dashboard
  const [users, campaigns, revenue, aiUsage] = await Promise.all([
    supabase.from('admin_users_overview').select('*', { count: 'exact' }),
    supabase.from('campaigns').select('*', { count: 'exact' }),
    supabase.from('billing_events').select('amount').eq('processed', true),
    supabase.from('ai_usage_logs').select('tokens_used, cost')
  ])
  
  return new Response(JSON.stringify({
    total_users: users.count,
    active_campaigns: campaigns.count,
    total_revenue: revenue.data?.reduce((sum, event) => sum + event.amount, 0),
    ai_tokens_used: aiUsage.data?.reduce((sum, log) => sum + log.tokens_used, 0)
  }))
}
```

### **2.3 User Management**
```typescript
// functions/admin-user-management/index.ts
export default async function handler(req: Request) {
  const { method } = req
  const supabase = createClient(...)
  
  switch (method) {
    case 'GET':
      // Listar usuários com filtros
      return getUsersList()
    case 'PUT':
      // Atualizar usuário (ban, upgrade, etc)
      return updateUser()
    case 'DELETE':
      // Deletar usuário
      return deleteUser()
  }
}
```

### **2.4 Billing Integration**
```typescript
// functions/stripe-webhook/index.ts
import Stripe from 'stripe'

export default async function handler(req: Request) {
  const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!)
  const signature = req.headers.get('stripe-signature')!
  
  const event = stripe.webhooks.constructEvent(
    await req.text(),
    signature,
    Deno.env.get('STRIPE_WEBHOOK_SECRET')!
  )
  
  // Processar eventos Stripe
  switch (event.type) {
    case 'customer.subscription.created':
      await handleSubscriptionCreated(event.data.object)
      break
    case 'invoice.payment_succeeded':
      await handlePaymentSucceeded(event.data.object)
      break
  }
  
  return new Response('OK')
}
```

---

## 🛠 3. CONFIGURAÇÃO INICIAL

### **3.1 Variáveis de Ambiente (Supabase Secrets)**
```bash
# IA Providers
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GEMINI_API_KEY=...

# Email
SENDGRID_API_KEY=SG....
RESEND_API_KEY=re_...

# Pagamentos
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Analytics
GOOGLE_ANALYTICS_ID=GA...
MIXPANEL_TOKEN=...

# Social Login
GOOGLE_CLIENT_SECRET=...
FACEBOOK_APP_SECRET=...

# Monitoramento
SENTRY_DSN=https://...
```

### **3.2 Primeiro Super Admin**
```sql
-- Inserir primeiro super admin manualmente
INSERT INTO admin_managers (
    user_id,
    email,
    full_name,
    role,
    status,
    permissions,
    activated_at
) VALUES (
    '[SEU_USER_ID]',
    '[SEU_EMAIL]',
    '[SEU_NOME]',
    'super_admin',
    'active',
    '["*"]'::jsonb,
    NOW()
);
```

---

## 🔒 4. SISTEMA DE PERMISSÕES

### **4.1 Estrutura de Roles**
```typescript
type AdminRole = 
  | 'super_admin'    // Acesso total
  | 'admin'          // Acesso geral exceto system settings
  | 'blog_admin'     // Apenas gestão de conteúdo
  | 'analytics_admin' // Apenas dashboards e métricas  
  | 'support_admin'  // Apenas usuários e tickets

type Permission = 
  | 'users.read' | 'users.write' | 'users.delete'
  | 'campaigns.read' | 'campaigns.moderate'
  | 'analytics.read' | 'analytics.export'
  | 'system.read' | 'system.write'
  | 'integrations.read' | 'integrations.write'
  | 'audit.read'
```

### **4.2 Middleware de Verificação**
```typescript
// lib/auth-middleware.ts
export function requireAdminRole(allowedRoles: AdminRole[]) {
  return async (req: Request) => {
    const { user_id, admin_role } = await checkAuthRole(req)
    
    if (!admin_role || !allowedRoles.includes(admin_role)) {
      throw new Error('Insufficient permissions')
    }
    
    return { user_id, admin_role }
  }
}

// Uso nas rotas
app.get('/admin/users', requireAdminRole(['super_admin', 'admin']), handler)
```

---

## 📝 5. PASSOS DE INTEGRAÇÃO

### **Passo 1: Conectar Supabase**
1. Click no botão verde "Supabase" no Lovable
2. Conectar ao projeto existente
3. Verificar detecção das tabelas

### **Passo 2: Aplicar Policies**
```sql
-- Execute todas as policies RLS listadas acima
-- Importante: testar com usuário não-admin primeiro
```

### **Passo 3: Deploy Edge Functions**
```bash
# Deploy functions
supabase functions deploy auth-role-check
supabase functions deploy admin-dashboard-metrics
supabase functions deploy admin-user-management
supabase functions deploy stripe-webhook
```

### **Passo 4: Configurar Secrets**
```bash
# Adicionar secrets via Supabase Dashboard
supabase secrets set OPENAI_API_KEY=sk-...
supabase secrets set STRIPE_SECRET_KEY=sk-...
# ... outros secrets
```

### **Passo 5: Criar Primeiro Admin**
```sql
-- Executar INSERT do primeiro super_admin
-- Usar seu user_id do auth.users
```

### **Passo 6: Testar Integrações**
- [ ] Login/logout funciona
- [ ] Dashboard admin carrega métricas
- [ ] Permissões funcionam por role
- [ ] Webhook Stripe processa eventos
- [ ] IA providers conectados

---

## ⚠️ SEGURANÇA CRÍTICA

### **🔐 Checklist de Segurança**
- [ ] RLS habilitado em TODAS as tabelas sensíveis
- [ ] Policies testadas com usuários diferentes
- [ ] Secrets nunca no código (apenas Supabase Secrets)
- [ ] Admin audit logs capturando ações críticas
- [ ] Rate limiting nas edge functions
- [ ] Validação de input em todos endpoints
- [ ] CORS configurado adequadamente

### **🚨 Tabelas Críticas (RLS Obrigatório)**
- `admin_managers` - Controle de acesso admin
- `admin_integrations` - API keys sensíveis  
- `admin_llm_settings` - Configurações IA
- `billing_events` - Dados financeiros
- `security_settings` - Configurações sistema
- `admin_audit_logs` - Logs de auditoria

---

## 📊 6. MONITORAMENTO PÓS-DEPLOY

### **Métricas para Acompanhar:**
- Response time das edge functions
- Taxa de erro nas integrações
- Uso de tokens IA por usuário
- Eventos de billing processados
- Tentativas de acesso não autorizado

### **Logs Importantes:**
- `admin_audit_logs` - Ações administrativas
- `system_logs` - Erros de sistema  
- `ai_usage_logs` - Custos de IA
- `billing_events` - Status pagamentos

---

## 🎯 RESULTADO FINAL

Após a integração, você terá:

✅ **Dashboard Admin Completo** com métricas em tempo real  
✅ **Sistema de Roles Granular** (5 tipos de admin)  
✅ **Integração Multi-Provider** (Stripe, OpenAI, SendGrid, etc)  
✅ **Auditoria Completa** de todas ações administrativas  
✅ **Billing Automatizado** via Stripe webhooks  
✅ **Monitoramento Sistema** com métricas de performance  
✅ **Segurança Enterprise** com RLS e permissões  

---

## 📞 PRÓXIMOS PASSOS

1. **Conectar Supabase** no Lovable (botão verde)
2. **Aplicar RLS Policies** (copiar/colar SQLs acima)
3. **Deploy Edge Functions** (4 functions principais)
4. **Configurar Secrets** (API keys via dashboard)
5. **Criar Primeiro Admin** (INSERT manual)
6. **Testar Integração** (checklist de segurança)

**Tempo estimado:** 2-3 horas para setup completo

---

*Documento criado para StorySpark SaaS - Versão 1.0*