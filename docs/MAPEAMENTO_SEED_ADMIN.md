# 📋 Mapeamento de Dados SEED para Conta Admin

Este documento mapeia todos os dados que estão sendo gerados dinamicamente (mock) no código e que precisam ser inseridos como dados reais no banco para a conta admin `paulojack2011@gmail.com`.

## 🎯 Objetivo
Substituir dados mockados/aleatórios por dados reais no banco para que a aplicação exiba informações consistentes e realistas.

---

## 📊 **1. BRAND VOICES** - `brand_voices` table

### Dados Mockados Atualmente:
- **Localização**: `src/services/brandVoicesService.ts` linha 43-47
- **Problema**: 
  ```javascript
  campaigns: Math.floor(Math.random() * 30) + 5, // Mock temporário
  avgEngagement: Number((Math.random() * 10 + 5).toFixed(1)), // Mock temporário
  ```

### ✅ Seeds Já Preparados:
O arquivo `insert_seeds_safe.sql` já contém 5 brand voices prontas para inserção:

1. **Tech Inovadora** - Tom profissional/direto (156 usos)
2. **Casual Amigável** - Tom casual/conversacional (203 usos) 
3. **Corporativo Premium** - Tom formal/persuasivo (89 usos)
4. **Startup Disruptiva** - Tom energético/provocativo (127 usos)
5. **E-commerce Persuasivo** - Tom persuasivo/urgente (312 usos)

### 🔧 Ação Necessária:
- Executar script `insert_seeds_safe.sql` ou `insert_seeds_supabase.js`
- Remover código de mock do `brandVoicesService.ts`

---

## 🎭 **2. PERSONAS** - `target_personas` table

### Dados Já Preparados:
O arquivo `insert_seeds_safe.sql` contém 2 personas detalhadas:

1. **Ana Silva - CMO Tech** (35-45 anos, São Paulo)
   - Demographics, psychographics, pain points, goals completos
   
2. **João Santos - Empreendedor Digital** (28-35 anos, Rio de Janeiro)
   - Perfil completo de empreendedor bootstrap

### 🔧 Ação Necessária:
- Seeds já prontos no script principal
- Nenhum mock identificado nos serviços

---

## 🎯 **3. CAMPANHAS** - `campaigns` table

### Dados Mockados Atualmente:
- **Localização**: `src/services/campaignsService.ts` linhas 34-42
- **Problema**:
  ```javascript
  spent: Math.floor(Math.random() * (campaign.budget || 5000) * 0.8),
  impressions: `${(Math.random() * 50 + 10).toFixed(1)}K`,
  clicks: Math.floor(Math.random() * 2000 + 500),
  ctr: `${(Math.random() * 3 + 2).toFixed(2)}%`,
  conversions: Math.floor(Math.random() * 200 + 50),
  progress: Math.floor(Math.random() * 80 + 20),
  ```

### ✅ Seeds Já Preparados:
3 campanhas no `insert_seeds_safe.sql`:

1. **Black Friday 2024 - E-commerce** (ATIVA, R$ 5.000)
2. **Lançamento Produto SaaS** (ATIVA, R$ 3.500) 
3. **Awareness Brand - Q4 2024** (PAUSADA, R$ 8.000)

### 🔧 Ação Necessária:
1. Executar seeds das campanhas
2. Criar tabela `campaign_stats` com dados reais:
   ```sql
   CREATE TABLE campaign_stats (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     campaign_id uuid REFERENCES campaigns(id),
     spent decimal(10,2),
     impressions bigint,
     clicks integer,
     conversions integer,
     ctr decimal(5,2), -- Taxa de clique
     progress integer, -- Percentual 0-100
     updated_at timestamp DEFAULT now()
   );
   ```

---

## 📝 **4. TEMPLATES** - `templates` table

### Dados Mockados Atualmente:
- **Localização**: `src/services/templatesService.ts` linhas 62-68, 95-100, 230-235, 251-256
- **Problema**:
  ```javascript
  performance: `${(Math.random() * 15 + 5).toFixed(1)}%`,
  likes: Math.floor(Math.random() * 200 + 20),
  lastUsed: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  averageLikes: Math.floor(Math.random() * 100 + 50),
  averagePerformance: `${(Math.random() * 10 + 10).toFixed(1)}%`
  ```

### 🔧 Ação Necessária:
1. Criar tabela `template_stats` para dados reais:
   ```sql
   CREATE TABLE template_stats (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     template_id uuid REFERENCES templates(id),
     performance_rate decimal(5,2),
     total_likes integer DEFAULT 0,
     last_used_date date,
     monthly_usage integer DEFAULT 0,
     updated_at timestamp DEFAULT now()
   );
   ```

---

## 📈 **5. DASHBOARD STATS** - `useDashboardStats.tsx`

### Dados Mockados Atualmente:
- **Localização**: `src/hooks/useDashboardStats.tsx` linhas 115-117
- **Problema**:
  ```javascript
  const engagementGrowth = Math.round(Math.random() * 10 + 5);
  const conversionGrowth = Math.round(Math.random() * 15 + 5);
  ```

### 🔧 Ação Necessária:
1. Criar tabela `workspace_analytics`:
   ```sql
   CREATE TABLE workspace_analytics (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     workspace_id uuid REFERENCES workspaces(id),
     date date NOT NULL,
     engagement_rate decimal(5,2),
     conversion_rate decimal(5,2),
     total_impressions bigint,
     total_clicks integer,
     revenue decimal(10,2),
     created_at timestamp DEFAULT now()
   );
   ```
2. Popular com dados dos últimos 3 meses

---

## 💰 **6. ANALYTICS SERVICE** - Revenue e Stats Gerais

### Dados Mockados Atualmente:
- **Localização**: `src/services/analyticsService.ts` múltiplas linhas
- **Problemas**:
  ```javascript
  // Linhas 177-178: Engagement e conversion mockados
  averageEngagement: (Math.random() * 3 + 6), // Mock: 6-9%
  conversionRate: (Math.random() * 2 + 3) // Mock: 3-5%
  
  // Linhas 348-382: Revenue data completamente mockado
  const baseRevenue = Math.floor(Math.random() * 50000 + 30000);
  growth: `+${Math.floor(Math.random() * 20 + 5)}%`
  ```

### 🔧 Ação Necessária:
1. Criar estrutura de analytics mais robusta
2. Popular dados históricos realistas
3. Remover todos os `Math.random()`

---

## 🎯 **7. ADMIN PERMISSIONS** - Mock Data

### Dados Mockados:
- **Localização**: `src/pages/admin/AdminPermissions.tsx`
- **Problema**: Roles e usuários completamente mockados

### 🔧 Ação Necessária:
1. Criar estrutura real de roles no banco
2. Inserir dados reais de usuários e permissões

---

## 📋 **PLANO DE EXECUÇÃO**

### Fase 1: ✅ Seeds Básicos (Já Prontos)
```bash
# Executar no Supabase ou via MCP
node insert_seeds_supabase.js
# OU
psql < insert_seeds_safe.sql
```

### Fase 2: 🔧 Estruturas Adicionais
1. Criar tabelas de stats (`campaign_stats`, `template_stats`, `workspace_analytics`)
2. Popular com dados realistas dos últimos 3-6 meses

### Fase 3: 🧹 Limpeza do Código
1. Remover todos os `Math.random()` dos serviços
2. Substituir por queries reais às tabelas de stats
3. Implementar cache adequado

### Fase 4: ✅ Validação
1. Testar todas as páginas da aplicação
2. Verificar se dados aparecem consistentemente
3. Validar performance das queries

---

## 📊 **DADOS NUMÉRICOS SUGERIDOS**

Para manter realismo, sugestões de valores fixos:

### Brand Voices:
- Tech Inovadora: 156 campanhas, 12.4% engagement
- Casual Amigável: 203 campanhas, 15.8% engagement  
- Corporativo Premium: 89 campanhas, 8.9% engagement
- Startup Disruptiva: 127 campanhas, 18.2% engagement
- E-commerce Persuasivo: 312 campanhas, 9.7% engagement

### Campanhas (últimos 6 meses):
- Total gasto: R$ 45.000
- Impressões totais: 2.3M
- CTR médio: 3.2%
- Taxa de conversão: 4.1%
- ROI médio: 280%

### Templates:
- Total: 87 templates
- Uso médio por template: 23 vezes
- Performance média: 11.4%
- Likes médios: 67 por template

---

## 🚀 **PRÓXIMOS PASSOS**

1. **IMEDIATO**: Executar `insert_seeds_supabase.js` 
2. **EM SEGUIDA**: Criar tabelas de estatísticas adicionais
3. **DEPOIS**: Remover código mock dos serviços
4. **FINAL**: Popular dados históricos para dashboard

**Tempo estimado**: 2-3 horas para implementação completa.