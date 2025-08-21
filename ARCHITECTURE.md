# StorySpark - Plataforma de IA para Criação de Copies

## 📋 Visão Geral
Plataforma completa de inteligência artificial para criação de copies otimizadas para redes sociais, com sistema de personas, integrações externas e analytics avançados.

## 🏗️ Arquitetura de Rotas

### 🌐 Site Público
- **/** - Landing page principal
- **/blog** - Blog corporativo
- **/blog/:slug** - Posts individuais do blog

### 🔐 Autenticação
- **/auth** - Login/registro de usuários
- **/auth/callback** - Callback OAuth
- **/admin/login** - Login administrativo

### 📱 Aplicação do Cliente (Protegida)
**Dashboard Principal:**
- **/app** - Overview geral da aplicação
- **/dashboard** - Dashboard principal com métricas e shortcuts

**Criação de Conteúdo:**
- **/composer** - Editor de IA para criação de copies
- **/campaigns** - Gerenciamento de campanhas
- **/templates** - Biblioteca de templates

**Personalização:**
- **/brand-voices** - Configuração de vozes da marca
- **/personas** - Gerenciamento de personas de cliente
- **/integrations** - Conexões com redes sociais e APIs

**Planejamento:**
- **/calendar** - Calendário editorial
- **/analytics** - Relatórios e métricas de performance

**Gerenciamento:**
- **/team** - Gestão de equipe e colaboradores
- **/billing** - Faturamento e planos
- **/settings** - Configurações pessoais

### 🛡️ Painel Administrativo (Super Protegido)
**Gestão Principal:**
- **/admin** - Dashboard administrativo
- **/admin/users** - Gerenciamento de usuários
- **/admin/managers** - Gestão de gerentes

**Controle de Conteúdo:**
- **/admin/campaigns** - Campanhas globais
- **/admin/campaigns/new** - Criação de campanhas
- **/admin/blog** - Gestão do blog
- **/admin/templates** - Templates globais

**Configurações Avançadas:**
- **/admin/analytics** - Analytics globais
- **/admin/integrations** - Integrações do sistema
- **/admin/billing** - Faturamento global
- **/admin/settings** - Configurações do sistema

**Segurança:**
- **/admin/logs** - Logs do sistema
- **/admin/security** - Configurações de segurança

## 🎨 Design System

### Cores Principais
- **Primary**: HSL(22, 100%, 55%) - Laranja vibrante
- **Primary Glow**: HSL(22, 100%, 65%) - Laranja claro
- **Background**: HSL(0, 0%, 100%) / HSL(0, 0%, 2%) (dark)
- **Foreground**: HSL(0, 0%, 3.9%) / HSL(0, 0%, 98%) (dark)

### Gradientes
- **Primary**: linear-gradient(135deg, primary, primary-glow)
- **Hero**: Gradiente sutil para fundos
- **Radial**: Efeito de brilho radial

### Animações
- Framer Motion para transições
- Efeitos float e glow-pulse
- Transições suaves com cubic-bezier

## 🚀 Componentes da Dashboard

### 1. Layout Principal (AppLayout)
- Sidebar responsiva com mini-collapse
- Header com breadcrumbs e perfil do usuário
- Área de conteúdo principal
- Sistema de notificações/toast

### 2. Dashboard Overview
- Cards de métricas principais
- Gráficos de performance
- Atividades recentes
- Shortcuts para ações frequentes

### 3. Composer (Editor de IA)
- Interface de chat com IA
- Painel de configuração de persona
- Preview em tempo real
- Exportação para múltiplas plataformas

### 4. Sistema de Personas
- Criação e edição de personas
- Templates de persona por segmento
- Análise de tom e linguagem
- Integração com o Composer

### 5. Integrações
- Conectores para redes sociais
- APIs de análise de conteúdo
- Automação de postagens
- Sincronização de métricas

## 🔧 Tecnologias Utilizadas
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Animações**: Framer Motion
- **Roteamento**: React Router DOM
- **UI Components**: Shadcn/ui
- **Icons**: Lucide React
- **Estado**: React Query para cache/sync
- **Formulários**: React Hook Form + Zod

## 📊 Funcionalidades Principais

### IA para Criação de Copies
- Análise de público-alvo
- Otimização por plataforma
- A/B testing automático
- Sugestões de hashtags e timing

### Sistema de Personas
- Perfis detalhados de cliente
- Análise psicográfica
- Linguagem e tom personalizados
- Histórico de performance

### Analytics Avançados
- ROI por campanha
- Engagement por persona
- Análise de sentimento
- Métricas cross-platform

### Integrações Externas
- Facebook/Instagram APIs
- Twitter/X API
- LinkedIn API
- TikTok Business API
- Google Analytics
- Webhook personalizados

## 🎯 Objetivos de UX/UI
- **Intuitivo**: Interface auto-explicativa
- **Responsivo**: Perfeito em mobile e desktop
- **Moderno**: Design system consistente
- **Performático**: Carregamento rápido
- **Acessível**: WCAG 2.1 compliance
- **Escalável**: Componentes reutilizáveis