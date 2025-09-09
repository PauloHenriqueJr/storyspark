# 📧 Roadmap de Integração com Email Marketing

## 🎯 Objetivo
Implementar um sistema completo de email marketing para gerenciar campanhas da waitlist e comunicação com usuários, permitindo testes de mercado antes do lançamento oficial.

## 📊 Situação Atual

### ✅ Já Implementado
- Sistema de waitlist funcional
- Templates de campanha funcionais
- Modal de criação de campanhas
- Estrutura de banco de dados para convites
- Interface administrativa completa

### 🔧 Configurações Existentes
- **SMTP**: Configuração básica em `AdminSettings.tsx`
- **SendGrid**: Integração parcial em `AdminIntegrations.tsx`
- **Templates**: Templates de email em `seed_templates.sql`
- **Componentes**: `CreateEmailCampaignModal.tsx` e `EmailMarketing.tsx`

## 🚀 Plano de Implementação

### Fase 1: Configuração Básica (1-2 dias)

#### 1.1 Estratégia de Email por Fases

**Fase de Testes (Atual): Supabase + SMTP Configurado**
- ✅ **Vantagem**: Já integrado e funcionando
- ✅ **Configuração**: SMTP configurado em `AdminSettings.tsx`
- ✅ **Custo**: Incluído no plano Supabase atual
- ✅ **Ideal para**: Validação inicial, testes de templates, primeiros usuários

**Fase de Lançamento: Migração para Resend**
- 🚀 **Quando**: Após validação e crescimento da base de usuários
- 🚀 **Vantagens**: API simples, melhor deliverabilidade, analytics avançados
- 🚀 **Custo**: $0/mês até 3.000 emails, depois $20/mês até 50.000 emails
- 🚀 **Alternativas**: SendGrid, Mailgun (caso necessário)

#### 1.2 Configuração Atual no Supabase
```sql
-- Configurações de email já existentes (AdminSettings.tsx)
-- SMTP Host: smtp.storyspark.com
-- SMTP Port: 587
-- SMTP User: notifications@storyspark.com
-- Emails Enabled: true

-- Adicionar configurações específicas para campanhas
INSERT INTO app_settings (key, value, description) VALUES
('email_service', 'supabase_smtp', 'Serviço de email ativo'),
('from_email', 'notifications@storyspark.com', 'Email remetente padrão'),
('from_name', 'StorySpark', 'Nome do remetente'),
('campaign_email_enabled', 'true', 'Campanhas de email habilitadas');
```

#### 1.3 Implementação da API de Email
```typescript
// services/emailService.ts
export class EmailService {
  private emailProvider: 'supabase' | 'resend';
  private config: any;
  
  constructor() {
    // Usar configuração atual do Supabase para testes
    this.emailProvider = 'supabase';
    this.config = {
      smtpHost: 'smtp.storyspark.com',
      smtpPort: 587,
      smtpUser: 'notifications@storyspark.com',
      fromEmail: 'notifications@storyspark.com',
      fromName: 'StorySpark'
    };
  }
  
  async sendWaitlistInvite(email: string, inviteCode: string) {
    if (this.emailProvider === 'supabase') {
      return this.sendViaSupabase(email, 'waitlist_invite', { inviteCode });
    }
    // Implementar Resend para fase de lançamento
  }
  
  async sendCampaignEmail(campaign: Campaign, recipients: string[]) {
    if (this.emailProvider === 'supabase') {
      return this.sendBulkViaSupabase(recipients, campaign);
    }
    // Implementar Resend para fase de lançamento
  }
  
  private async sendViaSupabase(email: string, template: string, data: any) {
    // Implementar envio via Edge Functions do Supabase
  }
}
```

### Fase 2: Templates e Automação (2-3 dias)

#### 2.1 Templates de Email Funcionais
- **Template de Convite**: Email personalizado com código de acesso
- **Template de Boas-vindas**: Confirmação de entrada na waitlist
- **Template de Lançamento**: Anúncio do lançamento da plataforma
- **Template VIP**: Comunicação exclusiva para usuários premium

#### 2.2 Sistema de Filas
```typescript
// Implementar fila de emails para evitar spam
interface EmailQueue {
  id: string;
  recipient: string;
  template: string;
  data: any;
  status: 'pending' | 'sent' | 'failed';
  scheduled_at: string;
  sent_at?: string;
}
```

### Fase 3: Analytics e Tracking (1-2 dias)

#### 3.1 Métricas de Email
- Taxa de abertura
- Taxa de clique
- Taxa de conversão
- Bounces e unsubscribes

#### 3.2 Pixel de Tracking
```html
<!-- Adicionar aos templates -->
<img src="https://api.storyspark.com/track/open/{email_id}" width="1" height="1" />
```

### Fase 4: Integração com Facebook Ads (1 dia)

#### 4.1 Pixel do Facebook
```html
<!-- Adicionar ao componente de waitlist -->
<script>
  fbq('track', 'Lead', {
    content_name: 'Waitlist Signup',
    content_category: 'SaaS'
  });
</script>
```

#### 4.2 Eventos Customizados
- `WaitlistSignup`: Inscrição na waitlist
- `InviteAccepted`: Aceitação de convite
- `PlatformAccess`: Primeiro acesso à plataforma

## 💰 Estimativa de Custos

### Fase de Testes (0-1.000 usuários)
- **Resend**: Gratuito (até 3.000 emails/mês)
- **Facebook Ads**: $50-200/mês (teste de mercado)
- **Total**: $50-200/mês

### Fase de Crescimento (1.000-10.000 usuários)
- **Resend**: $20/mês (até 50.000 emails/mês)
- **Facebook Ads**: $200-500/mês
- **Total**: $220-520/mês

## 🔄 Integração com Usuários Existentes

### Situação dos Usuários Atuais
Os usuários já cadastrados na tabela `waitlist_signups` **NÃO precisam ser recriados**. Eles se integram automaticamente:

#### 1. Estrutura Atual Compatível
```sql
-- Tabela existente já tem todos os campos necessários
SELECT 
  id,
  email,
  consent,           -- Para segmentação de campanhas
  utm_source,        -- Para tracking de origem
  utm_campaign,      -- Para análise de campanhas
  created_at         -- Para priorização por data
FROM waitlist_signups;
```

#### 2. Migração Automática
```sql
-- Script para criar convites para usuários existentes
INSERT INTO waitlist_invites (
  waitlist_signup_id,
  email,
  status,
  invite_code,
  priority,
  expires_at
)
SELECT 
  ws.id,
  ws.email,
  'pending',
  UPPER(SUBSTRING(MD5(RANDOM()::text) FROM 1 FOR 8)),
  CASE 
    WHEN ws.consent = true THEN 1
    ELSE 2
  END,
  NOW() + INTERVAL '30 days'
FROM waitlist_signups ws
WHERE NOT EXISTS (
  SELECT 1 FROM waitlist_invites wi 
  WHERE wi.waitlist_signup_id = ws.id
);
```

#### 3. Segmentação Inteligente
- **Usuários com Consentimento**: Prioridade alta para campanhas
- **Usuários por Data**: Primeiros inscritos têm prioridade
- **Usuários por Origem**: Segmentação por UTM para campanhas específicas

## 📈 Estratégia de Teste de Mercado

### 1. Configuração da Campanha Facebook
```javascript
// Configuração do pixel para landing page
fbq('init', 'SEU_PIXEL_ID');
fbq('track', 'PageView');

// Evento de conversão na waitlist
fbq('track', 'Lead', {
  content_name: 'StorySpark Waitlist',
  content_category: 'SaaS',
  value: 0.00,
  currency: 'BRL'
});
```

### 2. Métricas para Acompanhar
- **CPL (Custo por Lead)**: Meta < R$ 5,00
- **Taxa de Conversão**: Meta > 15%
- **Qualidade do Lead**: Taxa de abertura de email > 25%
- **Interesse Geográfico**: Concentração por região

### 3. Testes A/B
- **Landing Pages**: Diferentes propostas de valor
- **Formulários**: Campos obrigatórios vs opcionais
- **CTAs**: "Entrar na Lista" vs "Acesso Antecipado"

## 🛠️ Implementação Técnica

### 1. Variáveis de Ambiente
```env
# .env.local
RESEND_API_KEY=re_xxxxxxxxxx
FROM_EMAIL=noreply@storyspark.com
FROM_NAME=StorySpark
FACEBOOK_PIXEL_ID=xxxxxxxxxx
```

### 2. Configuração do Resend
```typescript
// lib/resend.ts
import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

export const sendWaitlistEmail = async ({
  to,
  subject,
  template,
  data
}: {
  to: string;
  subject: string;
  template: string;
  data: any;
}) => {
  return await resend.emails.send({
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to,
    subject,
    html: renderTemplate(template, data)
  });
};
```

### 3. Webhook para Tracking
```typescript
// pages/api/email/webhook.ts
export default async function handler(req: Request) {
  const { type, data } = req.body;
  
  switch (type) {
    case 'email.opened':
      await trackEmailOpen(data.email_id);
      break;
    case 'email.clicked':
      await trackEmailClick(data.email_id, data.link);
      break;
  }
}
```

## 📅 Cronograma de Implementação

### Semana 1 - Fase de Testes com Supabase
- [x] Templates funcionais implementados
- [ ] Configuração do serviço de email via Supabase
- [ ] Templates de email básicos funcionais
- [ ] Sistema de envio de convites via SMTP atual
- [ ] Testes de envio com usuários reais

### Semana 2 - Validação e Métricas
- [ ] Sistema de filas de email
- [ ] Analytics básicos de abertura/clique
- [ ] Pixel do Facebook para tracking
- [ ] Dashboard de métricas de campanha
- [ ] Coleta de feedback dos usuários

### Semana 3 - Otimização e Preparação
- [ ] Campanhas automatizadas
- [ ] Testes A/B da landing page
- [ ] Análise de performance do Supabase
- [ ] Preparação para migração (se necessário)
- [ ] Documentação do processo
- [ ] Lançamento da campanha Facebook

### Semana 4
- [ ] Otimização baseada em dados
- [ ] Segmentação avançada
- [ ] Preparação para lançamento

## 🎯 Próximos Passos Imediatos

1. **Criar conta no Resend** (gratuita)
2. **Configurar domínio de email** (ex: noreply@storyspark.com)
3. **Implementar serviço de email** no código
4. **Criar templates de email** responsivos
5. **Configurar pixel do Facebook** na landing page
6. **Testar envio de emails** com usuários existentes
7. **Lançar campanha Facebook** com orçamento baixo ($5-10/dia)

## 📞 Suporte e Recursos

- **Documentação Resend**: https://resend.com/docs
- **Facebook Business**: https://business.facebook.com
- **Templates de Email**: https://github.com/resendlabs/react-email
- **Analytics**: Google Analytics 4 + Facebook Analytics

---

**Resumo**: Com este roadmap, você terá um sistema completo de email marketing funcionando em 2-3 semanas, gastando menos de $200/mês na fase de testes, e poderá validar seu produto com dados reais antes do lançamento oficial.