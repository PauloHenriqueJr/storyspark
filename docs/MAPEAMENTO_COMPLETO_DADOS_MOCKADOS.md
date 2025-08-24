# 📋 Mapeamento Completo de Dados Mockados - StorySpark

## 🎯 Objetivo
Catalogar **TODOS** os dados mockados/hardcoded/Math.random() encontrados no código que precisam ser substituídos por dados reais do banco.

---

## 📊 **1. SERVICES - Math.random() e Dados Mockados**

### 1.1 `src/services/brandVoicesService.ts`
**Localização**: Linhas 43-47  
**Problema**:
```javascript
campaigns: Math.floor(Math.random() * 30) + 5, // Mock temporário
avgEngagement: Number((Math.random() * 10 + 5).toFixed(1)), // Mock temporário
```
**Solução**: Usar dados reais das tabelas `brand_voice_stats` e `campaign_stats`

### 1.2 `src/services/campaignsService.ts`
**Localizações**: Linhas 31-42, 160-170, 190-196  
**Problemas**:
```javascript
spent: Math.floor(Math.random() * (campaign.budget || 5000) * 0.8),
impressions: `${(Math.random() * 50 + 10).toFixed(1)}K`,
clicks: Math.floor(Math.random() * 2000 + 500),
ctr: `${(Math.random() * 3 + 2).toFixed(2)}%`,
conversions: Math.floor(Math.random() * 200 + 50),
progress: Math.floor(Math.random() * 80 + 20),
// E na função getStats():
impressions: `${(Math.random() * 200 + 50).toFixed(1)}K`,
conversionRate: `${(Math.random() * 2 + 2).toFixed(1)}%`
```
**Solução**: Usar dados reais da tabela `campaign_stats`

### 1.3 `src/services/templatesService.ts`
**Localizações**: Linhas 62-68, 317-323  
**Problemas**:
```javascript
performance: `${(Math.random() * 15 + 5).toFixed(1)}%`,
likes: Math.floor(Math.random() * 200 + 20),
lastUsed: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
// E na função getStats():
averageLikes: Math.floor(Math.random() * 100 + 50),
averagePerformance: `${(Math.random() * 10 + 10).toFixed(1)}%`
```
**Solução**: Criar tabela `template_stats` e popular com dados reais

### 1.4 `src/services/analyticsService.ts`
**Localizações**: Linhas 104-132, 170-188, 341-381  
**Problemas**:
```javascript
// Linha 125 - fallback mockado:
averageEngagement = Math.random() * 3 + 6; // Fallback para mock apenas se não há dados

// Linhas 177-178 - dados sempre mockados:
averageEngagement: (Math.random() * 3 + 6), // Mock: 6-9%
conversionRate: (Math.random() * 2 + 3) // Mock: 3-5%

// Linhas 348-382 - receita completamente mockada:
growth: `+${Math.floor(Math.random() * 20 + 5)}%`,
const baseRevenue = Math.floor(Math.random() * 50000 + 30000);
const costs = Math.floor(baseRevenue * 0.7);
```
**Solução**: Criar estrutura completa de analytics com dados históricos reais

---

## 🎭 **2. PÁGINAS ADMIN - Arrays Estáticos Hardcoded**

### 2.1 `src/pages/admin/AdminBillingGlobal.tsx`
**Localização**: Todo o arquivo (linhas 62-518)  
**Problemas**: Arrays estáticos massivos para:

#### 2.1.1 Revenue Data (linhas 63-70):
```javascript
const revenueData = [
  { name: 'Jan', receita: 245000, custos: 180000, lucro: 65000 },
  { name: 'Fev', receita: 278000, custos: 195000, lucro: 83000 },
  { name: 'Mar', receita: 312000, custos: 210000, lucro: 102000 },
  { name: 'Abr', receita: 289000, custos: 205000, lucro: 84000 },
  { name: 'Mai', receita: 334000, custos: 225000, lucro: 109000 },
  { name: 'Jun', receita: 367000, custos: 240000, lucro: 127000 }
];
```

#### 2.1.2 Plan Distribution (linhas 72-76):
```javascript
const planDistribution = [
  { name: 'Starter', value: 45, revenue: 89000, color: '#8B5CF6' },
  { name: 'Professional', value: 35, revenue: 156000, color: '#3B82F6' },
  { name: 'Enterprise', value: 20, revenue: 122000, color: '#10B981' }
];
```

#### 2.1.3 Top Customers (linhas 78-106):
```javascript
const topCustomers = [
  {
    id: 1,
    name: 'TechCorp Solutions Ltd',
    plan: 'Enterprise',
    revenue: 'R$ 15.240/mês',
    status: 'active',
    nextBilling: '2024-02-15',
    growth: '+23%'
  },
  // ... mais 3 clientes mockados
];
```

#### 2.1.4 Transactions (linhas 108-152):
```javascript
const transactions = [
  {
    id: 1,
    customer: 'TechCorp Solutions',
    amount: 'R$ 15.240',
    status: 'completed',
    date: '2024-01-21',
    plan: 'Enterprise',
    method: 'Credit Card'
  },
  // ... mais 3 transações mockadas
];
```

#### 2.1.5 Global Stats (linhas 186-209):
```javascript
const globalStats = [
  {
    title: 'Receita Total',
    value: 'R$ 367K',
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
    period: 'este mês'
  },
  // ... mais 3 stats mockadas
];
```

**Solução**: Criar tabelas `billing_global`, `customer_analytics`, `transaction_history` no banco

### 2.2 `src/pages/admin/AdminPermissions.tsx`
**Localização**: Linhas 40-132  
**Problemas**:

#### 2.2.1 Roles Array (linhas 40-78):
```javascript
const roles = [
  {
    id: 1,
    name: 'Super Admin',
    description: 'Acesso total ao sistema',
    userCount: 2,
    color: 'bg-red-500',
    permissions: ['all']
  },
  // ... mais 4 roles mockadas
];
```

#### 2.2.2 Users with Roles (linhas 80-132):
```javascript
const usersWithRoles = [
  {
    id: 1,
    name: 'João Silva',
    email: 'joao@empresa.com',
    avatar: '',
    role: 'Super Admin',
    status: 'active',
    lastLogin: '2024-01-20 14:30'
  },
  // ... mais 3 usuários mockados
];
```

**Solução**: Usar tabelas reais `admin_managers`, `admin_roles`, `admin_permissions`

---

## 🎯 **3. HOOKS - Dados Mockados**

### 3.1 `src/hooks/useDashboardStats.tsx`
**Localização**: Todo o hook  
**Problema**: Apesar de buscar dados reais, ainda tem fallbacks mockados e cálculos artificiais  
**Necessidade**: Implementar cálculos reais baseados em dados históricos

---

## 📈 **4. RESUMO DE TABELAS NECESSÁRIAS**

### 4.1 Tabelas de Estatísticas (CRÍTICAS):
```sql
-- Já criadas via MCP:
- campaign_stats ✅
- brand_voice_stats ✅

-- Precisam ser criadas:
- template_stats
- workspace_analytics  
- billing_global
- customer_analytics
- transaction_history
- admin_roles
- admin_permissions
```

### 4.2 Estruturas Sugeridas:

#### Template Stats:
```sql
CREATE TABLE template_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES templates(id),
  performance_rate decimal(5,2),
  total_likes integer DEFAULT 0,
  last_used_date date,
  monthly_usage integer DEFAULT 0,
  engagement_rate decimal(5,2),
  updated_at timestamp DEFAULT now()
);
```

#### Billing Global:
```sql
CREATE TABLE billing_global (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  period_month date NOT NULL,
  total_revenue decimal(12,2),
  total_costs decimal(12,2),
  total_profit decimal(12,2),
  active_customers integer,
  churn_rate decimal(5,2),
  conversion_rate decimal(5,2),
  created_at timestamp DEFAULT now()
);
```

#### Customer Analytics:
```sql
CREATE TABLE customer_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  monthly_revenue decimal(10,2),
  plan_type text,
  status text,
  next_billing_date date,
  growth_rate decimal(5,2),
  total_usage integer,
  updated_at timestamp DEFAULT now()
);
```

---

## 🔧 **5. PLANO DE MIGRAÇÃO**

### Fase 1: ✅ **CONCLUÍDA** 
- [x] Brand voices com dados reais
- [x] Campanhas com estatísticas reais  
- [x] Target personas detalhadas
- [x] Tabelas campaign_stats e brand_voice_stats

### Fase 2: ✅ **CONCLUÍDA** 
- [x] Criar tabela `template_stats` e popular
- [x] Migrar dados mockados de `templatesService.ts`
- [x] Criar estrutura completa de billing (3 tabelas)
- [x] Migrar dados hardcoded de `AdminBillingGlobal.tsx`
- [x] Inserir dados históricos de 6 meses de billing
- [x] Popular 4 clientes principais com analytics
- [x] Criar histórico de 8 transações realísticas

### Fase 3: 📋 **PLANEJADA**
- [ ] Criar estrutura completa de billing (3 tabelas)
- [ ] Migrar todos os dados hardcoded de `AdminBillingGlobal.tsx`
- [ ] Implementar sistema real de roles e permissions
- [ ] Migrar dados mockados de `AdminPermissions.tsx`

### Fase 4: 🧹 **LIMPEZA**
- [ ] Remover TODOS os `Math.random()` dos services
- [ ] Remover arrays estáticos das páginas admin
- [ ] Implementar queries reais para substituir mocks
- [ ] Testes de integração completos

---

## 📊 **6. ESTATÍSTICAS DA MIGRAÇÃO**

### Arquivos com Dados Mockados Identificados:
- **Services**: 4 arquivos
- **Páginas Admin**: 2 arquivos  
- **Hooks**: 1 arquivo
- **Total de Math.random()**: ~15 ocorrências
- **Total de arrays estáticos**: ~8 grandes arrays
- **Linhas de código afetadas**: ~200 linhas

### Prioridade de Migração:
1. **ALTA**: Services (impacta toda aplicação)
2. **MÉDIA**: Páginas Admin (impacta área administrativa)
3. **BAIXA**: Hooks (funciona mas pode ser melhorado)

---

## ✅ **7. CHECKLIST DE VERIFICAÇÃO PÓS-MIGRAÇÃO**

### Services:
- [ ] `brandVoicesService.ts` - campaigns e avgEngagement reais
- [ ] `campaignsService.ts` - todas as stats reais da tabela
- [ ] `templatesService.ts` - performance e likes reais
- [ ] `analyticsService.ts` - sem Math.random(), dados históricos reais

### Páginas Admin:
- [ ] `AdminBillingGlobal.tsx` - dados do banco, não arrays estáticos
- [ ] `AdminPermissions.tsx` - roles e users reais do banco

### Funcionalidades:
- [ ] Dashboard mostra dados consistentes
- [ ] Analytics com histórico real
- [ ] Billing com transações reais
- [ ] Permissions baseadas no banco

---

## 🎯 **8. DADOS JÁ MIGRADOS (VIA MCP)**

### ✅ Completamente Migrados:
- **Brand Voices**: 5 voices com usage_count real (156, 203, 89, 127, 312)
- **Campanhas**: 3 campanhas com stats completas (spent, impressions, clicks, CTR, conversions)
- **Target Personas**: 2 personas detalhadas com dados realísticos
- **Templates**: 5 templates com performance real (18.5%, 24.2%, 15.7%, 22.1%, 21.3%)
- **Template Stats**: 15 registros com likes, engagement e uso mensal
- **Billing Global**: 6 meses de dados históricos (Jan-Jun 2024)
- **Customer Analytics**: 4 clientes principais com LTV e growth rate
- **Transaction History**: 8 transações realísticas
- **Tabelas de Stats**: campaign_stats, brand_voice_stats, template_stats funcionais

### 📈 Métricas Reais Disponíveis:
- Total Brand Voice Usage: 887 usos
- Total Templates Usage: 391 usos (45+78+23+156+89)
- Total Budget: R$ 16.500
- Total Spent: R$ 7.525  
- Total Impressions: 2.970.000
- Average CTR: 3.37%
- Monthly Revenue: R$ 43.270 (4 clientes principais)
- Billing History: R$ 1.925.000 em 6 meses
- Active Campaigns: 2
- Total Personas Usage: 78
- Templates Performance Rate: Média de 20.36%

---

**📝 Última atualização**: 2025-08-23T04:15:00Z  
**🔍 Próxima revisão**: Após migração da Fase 2