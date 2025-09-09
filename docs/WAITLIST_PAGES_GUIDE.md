# Páginas de Waitlist - StorySpark

Este documento detalha as três páginas de waitlist criadas para diferentes estratégias de conversão e validação de MVP.

## 📋 Páginas Disponíveis

### 1. Landing Waitlist (`/waitlist`)
**Propósito**: Página completa de landing com storytelling e educação do usuário
- **Estratégia**: Conversão por educação e confiança
- **Público**: Usuários que precisam entender o produto antes de se cadastrar
- **Conteúdo**: História da dor, como funciona, social proof, features detalhadas
- **CTA**: Lista de espera gratuita

### 2. Waitlist AB (`/waitlist-ab`) 
**Propósito**: Página focada em escassez e simplicidade
- **Estratégia**: Conversão por urgência e FOMO (Fear of Missing Out)
- **Público**: Usuários que já conhecem o problema e querem solução rápida
- **Conteúdo**: Benefícios diretos, escassez ("50 vagas"), CTA claro
- **CTA**: Lista de espera + link para oferta premium

### 3. Founder's Offer (`/founders-offer`)
**Propósito**: Validação de MVP com clientes pagantes (70% OFF vitalício)
- **Estratégia**: Conversão por valor econômico e exclusividade
- **Público**: Clientes validados dispostos a pagar antecipadamente
- **Conteúdo**: Oferta exclusiva, countdown, pricing, garantias
- **CTA**: Pagamento antecipado com desconto vitalício

## 🎯 Estratégia de Funil

```
Traffic → Landing Waitlist (educação) → Waitlist AB (urgência) → Founder's Offer (pagamento)
```

### Fluxo Recomendado:
1. **Traffic frio**: Direcionar para `/waitlist` (educação completa)
2. **Traffic morno**: Direcionar para `/waitlist-ab` (conversão rápida)  
3. **Leads qualificados**: Direcionar para `/founders-offer` (validação pagante)

## 🔧 Componentes Criados

### Countdown Component (`/src/components/ui/countdown.tsx`)
- Timer em tempo real até data específica
- Auto-atualiza a cada segundo
- Formatação "DD:HH:MM:SS"
- Usado na página Founder's Offer para criar urgência

### useFounderSpots Hook (`/src/hooks/useFounderSpots.ts`)
- Gerencia número de vagas restantes (simulado)
- Persiste no localStorage
- Reduz vagas automaticamente ao longo do tempo
- Função `reserveSpot()` para reservar vaga
- Calcula `percentageLeft` para barra de progresso

## 📊 Analytics e Tracking

Todas as páginas implementam tracking via `analytics.track()`:
- `waitlist_submit_attempt`: Tentativa de cadastro
- `waitlist_success`: Cadastro realizado
- `founder_offer_submitted`: Oferta de fundador submetida
- `founder_spot_reserved`: Vaga de fundador reservada

## 🎨 Design e UX

### Elementos de Conversão:
- **Escassez**: Contadores de vagas, timers, badges de "últimas vagas"
- **Social Proof**: Depoimentos, número de cadastrados, logos
- **Urgência**: Countdown timers, ofertas por tempo limitado
- **Garantias**: 30 dias de garantia, política de reembolso
- **Exclusividade**: Status de "fundador", acesso antecipado

### Gradientes Customizados:
- `bg-gradient-primary`: Gradiente principal da marca
- `bg-gradient-subtle`: Fundo sutil para páginas
- `bg-gradient-success`: Confirmações e sucessos

## 🚀 Como Testar

### 1. Servidor de Desenvolvimento
```bash
npm run dev
```

### 2. URLs de Teste
- http://localhost:8080/waitlist
- http://localhost:8080/waitlist-ab  
- http://localhost:8080/founders-offer

### 3. Menu de Desenvolvimento
No ambiente de desenvolvimento, há um menu "🚧 Test Pages" no header para navegação rápida entre as páginas.

## 📈 Métricas Sugeridas

### Para cada página, acompanhar:
- **Taxa de Conversão**: Visitantes → Cadastros
- **Tempo na Página**: Engagement e interesse
- **Taxa de Rejeição**: Qualidade do tráfego
- **Origem do Tráfego**: UTM tracking implementado

### Específico Founder's Offer:
- **Intent to Pay**: Formulários preenchidos vs cadastros efetivados
- **Ticket Médio**: Planos escolhidos pelos fundadores
- **Conversion Rate**: Leads → Paying Customers

## 🔄 Próximos Passos

1. **A/B Testing**: Testar diferentes headlines, CTAs e layouts
2. **Integração Stripe**: Implementar pagamento real na Founder's Offer
3. **Email Automation**: Nurturing sequences para cada tipo de lead
4. **Analytics Dashboard**: Visualizar performance das páginas
5. **Mobile Optimization**: Garantir UX perfeita em dispositivos móveis

## 📝 Notas Técnicas

- Todas as páginas são responsivas (mobile-first)
- Lazy loading implementado para performance
- Error boundaries para recuperação de erros
- Form validation com Zod e React Hook Form
- Dark/Light mode suportado
- SEO-friendly com meta tags apropriadas

---

**Última atualização**: Janeiro 2025
**Versão**: 1.0.0
**Status**: MVP Ready 🚀
