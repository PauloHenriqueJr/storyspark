# 📄 Product Requirements Document (PRD) - StorySpark

## 1. Introdução

### 1.1 Visão Geral do Projeto
O **StorySpark** é uma plataforma SaaS (Software as a Service) impulsionada por Inteligência Artificial (IA), projetada para revolucionar a criação de conteúdo digital, especificamente copies otimizadas para redes sociais. A plataforma combina IA avançada com análise de personas, otimização por plataforma e ferramentas de planejamento e análise, permitindo que agências de marketing, e-commerces e empreendedores criem conteúdo de alta performance de forma eficiente e escalável.

O frontend da aplicação está 100% implementado e funcional, com todas as páginas, componentes e interações prontas para produção. A integração com backend (Supabase para banco de dados e autenticação) e APIs de IA (OpenAI/Claude) está em fase final, aguardando apenas conexões reais para persistência de dados e geração de conteúdo.

### 1.2 Objetivos do Produto
- **Principal**: Democratizar o acesso a copies profissionais otimizadas por IA, reduzindo o tempo de criação de conteúdo em até 80% e aumentando o engajamento em redes sociais.
- **Secundários**:
  - Fornecer um design system moderno e responsivo para UX intuitiva.
  - Suportar integrações com redes sociais e ferramentas de automação.
  - Garantir escalabilidade para equipes colaborativas.
  - Alcançar conformidade com WCAG 2.1 AA para acessibilidade.
  - Implementar PWA para uso offline e instalação em dispositivos móveis.

### 1.3 Escopo
- **Incluído**: Frontend completo (React + TypeScript), design system (Tailwind + Shadcn), roteamento (React Router), animações (Framer Motion), PWA, modais interativos, dashboards e analytics mockados (prontos para backend).
- **Excluído**: Integrações backend reais (aguardando Supabase), APIs de IA (mockadas), pagamentos (Stripe simulado).
- **Versão**: 1.0.0 (MVP Frontend Completo).

### 1.4 Equipe e Responsáveis
- **Desenvolvedor Principal**: Especialista Full Stack (React, TypeScript, Supabase).
- **Design**: UI/UX baseado em padrões modernos (Shadcn/ui).
- **Testes**: Playwright para E2E (configurado).

## 2. Público-Alvo e Personas

### 2.1 Segmentos de Mercado
- **Agências de Marketing Digital** (35%): Equipes que precisam escalar produção de conteúdo.
- **E-commerces** (25%): Otimização de copies para vendas online.
- **Startups/SaaS** (20%): Criação rápida de conteúdo para lançamento.
- **Freelancers** (15%): Ferramentas acessíveis para profissionais independentes.
- **Corporações** (5%): Integrações enterprise para grandes equipes.

### 2.2 Personas Detalhadas (Exemplos Implementados)
- **Ana Silva - CMO de Tech** (35-45 anos, São Paulo):
  - Dor: Tempo excessivo em criação de copies personalizadas.
  - Necessidade: Análise de personas e otimização A/B.
  - Uso: Diariamente para campanhas de awareness.
- **João Santos - Empreendedor Digital** (28-35 anos, Rio de Janeiro):
  - Dor: Falta de expertise em copywriting.
  - Necessidade: Templates prontos e IA para geração rápida.
  - Uso: Semanal para posts em redes sociais.

## 3. Funcionalidades Principais

### 3.1 Core Features (100% Implementadas no Frontend)
#### 3.1.1 Composer (Editor de IA)
- Interface de chat com IA para geração de copies.
- Seleção de personas, brand voices e templates.
- Preview em tempo real para diferentes plataformas (Instagram, LinkedIn, etc.).
- Exportação para formatos nativos (texto, imagem com overlay).
- Histórico de versões e salvamento automático.

#### 3.1.2 Sistema de Personas
- CRUD completo para criação/edição de personas.
- Templates por segmento (ex: e-commerce, B2B).
- Análise de tom, linguagem e canais preferidos.
- Integração direta com Composer para personalização.

#### 3.1.3 Brand Voices
- Editor de voz da marca com abas (tom, linguagem, exemplos).
- Testador interativo (Voice Tester) com feedback em tempo real.
- Métricas de uso (progress bars, analytics).
- Versionamento e biblioteca de templates.

#### 3.1.4 Campanhas
- Criação de campanhas com modal completo (orçamento, duração, objetivos).
- Estados: rascunho, ativa, pausada, finalizada.
- Associação com copies, calendário e integrações.
- Métricas detalhadas (CTR, conversões, ROI).

#### 3.1.5 Calendário Editorial
- Visualizações: mês/semana/dia com drag & drop.
- Integração com campanhas e posts sociais.
- Filtros por plataforma e tipo de conteúdo.
- Lembretes e notificações automáticas.

#### 3.1.6 Analytics
- Dashboards interativos com gráficos (Recharts: AreaChart, PieChart).
- Filtros de data, campanha e plataforma.
- Comparação de períodos e drill-down.
- Exportação de relatórios (PDF/CSV).

#### 3.1.7 Templates
- Biblioteca categorizada por abas (plataforma, tipo).
- Preview interativo e editor de templates.
- Sistema de tags, variáveis e favoritos.
- Métricas de performance (likes, usos).

#### 3.1.8 Integrações
- Fluxo OAuth para redes sociais (Facebook, Instagram, LinkedIn).
- Teste de conexões e configuração de automações.
- Logs de sincronização e webhooks customizados.

### 3.2 Features Avançadas (Implementadas)
- **Equipe**: Gestão de membros, permissões granulares, auditoria.
- **Faturamento**: Planos, calculadora de uso, histórico de pagamentos.
- **Blog Corporativo**: CMS com comentários e SEO.
- **PWA**: Instalável, offline mode, service workers.
- **Onboarding e Ajuda**: Tutorial interativo e sistema de ajuda.

### 3.3 Funcionalidades Especializadas (Implementadas)
- AB Tests, AI Ideas, Call Scripts, Content Library, CRM, Email Marketing, Funnels, Landing Pages, Push WhatsApp, Social Scheduler, Trending Hooks, Voices, Feedback.

### 3.4 Área Administrativa (Implementada)
- Dashboard admin, gestão de usuários/gerentes, controle de conteúdo, analytics globais, logs, segurança.

## 4. Requisitos Técnicos

### 4.1 Requisitos de Frontend
- **Framework**: React 18.3.1 + TypeScript 5.8.3.
- **Build Tool**: Vite 5.4.19 com code splitting e bundle optimization.
- **Styling**: Tailwind CSS 3.4.17 + Shadcn/ui.
- **Roteamento**: React Router DOM 6.30.1 com protected routes.
- **Estado**: Context API + React Query para cache.
- **Animações**: Framer Motion 12.23.12.
- **Formulários**: React Hook Form + Zod para validação.
- **Testes**: Playwright 1.55.0 para E2E.
- **PWA**: Vite Plugin PWA 1.0.3 com manifest e service worker.
- **Performance**: Lazy loading, skeletons, infinite scroll.
- **Acessibilidade**: WCAG 2.1 AA (keyboard navigation, screen readers).

### 4.2 Requisitos de Backend (Planejado)
- **Database**: Supabase (PostgreSQL) com RLS para segurança.
- **Auth**: Supabase Auth com roles (user, admin, super_admin).
- **Storage**: Supabase Storage para assets.
- **Real-time**: Supabase Subscriptions para notificações.
- **IA**: Integração com OpenAI GPT-4 ou Claude para geração de copies.
- **APIs Externas**: OAuth para redes sociais, Stripe para pagamentos.

### 4.3 Requisitos Não-Funcionais
- **Performance**: Carregamento < 2s, Lighthouse score > 90.
- **Segurança**: GDPR/LGPD compliance, XSS protection, rate limiting.
- **Escalabilidade**: Suporte a 1.000+ usuários simultâneos.
- **Disponibilidade**: 99.9% uptime.
- **Mobile**: Responsivo e PWA instalável.

## 5. Design e UX

### 5.1 Design System
- **Cores**: Primary (HSL(22, 100%, 55%) - Laranja), Background (branco/preto), Success/Warning/Destructive.
- **Tipografia**: Inter font, escala hierárquica (h1: 36px, body: 14px).
- **Componentes**: Radix UI para acessibilidade, Tailwind para customização.
- **Animações**: Transições suaves, micro-interações (hover, loading).
- **Temas**: Light/Dark mode com Next Themes.

### 5.2 Fluxos de Usuário
- **Onboarding**: Tutorial interativo pós-registro.
- **Criação de Copy**: Composer → Seleção Persona/Voice → Geração IA → Preview/Export.
- **Gestão de Campanha**: Criação → Agendamento Calendário → Publicação via Integrações → Análise Analytics.
- **Admin**: Login Super Admin → Dashboard → Gestão Usuários/Campanhas.

### 5.3 Responsividade e Acessibilidade
- Breakpoints: Mobile (320px), Tablet (768px), Desktop (1024px).
- WCAG: Alt texts, ARIA labels, keyboard navigation, high contrast.

## 6. Monetização e Modelo de Negócio

### 6.1 Planos de Assinatura
- **Starter**: R$ 97/mês - 10.000 copies, 1 usuário, 3 integrações.
- **Pro**: R$ 297/mês - 50.000 copies, 5 usuários, 10 integrações.
- **Enterprise**: R$ 697/mês - Ilimitado, suporte prioritário.

### 6.2 Métricas de Sucesso
- **KPIs**: MRR > R$ 10.000 (3 meses), Churn < 5%, Activation Rate > 70%.
- **Engajamento**: Copies geradas/mês > 100.000, ROI médio > 300%.
- **Retenção**: Usuários ativos > 80% após 30 dias.

## 7. Roadmap e Cronograma

### 7.1 Fases Implementadas (100% Frontend)
- Fase 1: Sistema Administrativo (Completo).
- Fase 2: Navegação e Core Features (Completo).
- Fase 3: Blog e Landing Pages (Completo).
- Fase 4: Interações Avançadas (Completo).
- Fase 5: UX/UI e Performance (Completo).

### 7.2 Fases Pendentes (Backend)
- Fase 6: Integração Backend/IA (Estimativa: 2-4 semanas).
- Deploy e Lançamento (Estimativa: 1 semana).

### 7.3 Riscos e Mitigações
- **Risco**: Atraso em APIs de IA → Mitigação: Mock data avançado.
- **Risco**: Problemas de escalabilidade → Mitigação: Testes de carga com Supabase.
- **Risco**: Conformidade legal → Mitigação: Auditoria GDPR/LGPD.

## 8. Conclusão
O StorySpark representa uma solução inovadora e escalável para criação de conteúdo com IA. Com o frontend 100% completo e pronto para produção, o foco agora é na integração backend para lançamento. Este PRD serve como guia definitivo para desenvolvimento, garantindo alinhamento entre visão de produto e implementação técnica.

**Data de Criação**: Setembro 2025  
**Versão**: 1.0  
**Autor**: Especialista Full Stack (Kilo Code)