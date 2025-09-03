# 🚀 StorySpark - Plataforma de IA para Criação de Copies

<div align="center">
  <img src="https://img.shields.io/badge/Status-Em%20Produção-green" alt="Status">
  <img src="https://img.shields.io/badge/Versão-1.0.0-blue" alt="Versão">
  <img src="https://img.shields.io/badge/React-18.3.1-blue" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-3.4-blue" alt="Tailwind">
</div>

---

## 📋 Sobre o Projeto

**StorySpark** é uma plataforma SaaS de inteligência artificial focada na criação de copies otimizadas para redes sociais. A solução combina IA avançada com análise de personas para gerar conteúdo personalizado que maximiza o engajamento e conversões.

### 🎯 Missão
Democratizar a criação de conteúdo de alta qualidade, permitindo que empresas de todos os tamanhos tenham acesso a copies profissionais e otimizadas através da inteligência artificial.

### 🌟 Visão
Ser a principal plataforma de IA para criação de conteúdo no mercado brasileiro, revolucionando como as empresas se comunicam com seu público nas redes sociais.

---

## 🏢 Modelo de Negócio

### 💰 Estratégia SaaS B2B
- **Receita Recorrente**: Assinaturas mensais/anuais
- **Segmentação**: Pequenas, médias e grandes empresas
- **Escalonamento**: Planos baseados em volume de uso

### 📊 Planos de Assinatura

| Plano          | Preço      | Copies/Mês | Usuários  | Integrações |
| -------------- | ---------- | ---------- | --------- | ----------- |
| **Starter**    | R$ 97/mês  | 10.000     | 1         | 3           |
| **Pro**        | R$ 297/mês | 50.000     | 5         | 10          |
| **Enterprise** | R$ 697/mês | Ilimitado  | Ilimitado | Ilimitado   |

### 🎯 Público-Alvo
- **Agências de Marketing Digital**
- **E-commerces e Marketplaces**
- **Empresas SaaS e Startups**
- **Consultores e Freelancers**
- **Departamentos de Marketing Corporativo**

---

## 🛠️ Stack Tecnológica

### 🎨 Frontend
- **Framework**: React 18.3.1 + TypeScript
- **Build Tool**: Vite (desenvolvimento rápido)
- **Styling**: Tailwind CSS + CSS Variables
- **UI Components**: Shadcn/ui (componentes modernos)
- **Roteamento**: React Router DOM v6
- **Estado**: Context API + React Query (preparado)
- **Animações**: Framer Motion
- **Icons**: Lucide React

### 🔧 Ferramentas de Desenvolvimento
- **Linting**: ESLint + Prettier
- **Tipagem**: TypeScript Strict Mode
- **Bundling**: Vite + Rollup
- **Deploy**: Vercel/Netlify (preparado)

### 🔮 Backend (Planejado)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **AI**: OpenAI GPT-4 / Anthropic Claude
- **APIs**: RESTful + Real-time subscriptions

### 🔌 Integrações Externas
- **Redes Sociais**: Meta API, Twitter API, LinkedIn API
- **Analytics**: Google Analytics, Facebook Insights
- **Pagamentos**: Stripe
- **Automação**: Zapier, Webhooks customizados

---

## 🎨 Design System

### 🌈 Paleta de Cores

#### Cores Primárias
```css
--primary: 22 100% 55%        /* #FF6B35 - Laranja Vibrante */
--primary-glow: 22 100% 65%   /* #FF8A5B - Laranja Claro */
--foreground: 0 0% 3.9%       /* #0A0A0A - Texto Principal */
--background: 0 0% 100%       /* #FFFFFF - Fundo Claro */
```

#### Cores Secundárias
```css
--muted: 210 40% 98%          /* #F8FAFC - Cinza Claro */
--muted-foreground: 215 13.8% 34.1%  /* #64748B - Texto Secundário */
--border: 214.3 31.8% 91.4%   /* #E2E8F0 - Bordas */
--success: 142 76% 36%        /* #16A34A - Verde Sucesso */
--warning: 38 92% 50%         /* #F59E0B - Amarelo Alerta */
--destructive: 0 72% 51%      /* #DC2626 - Vermelho Erro */
```

#### Dark Mode
```css
--background: 0 0% 2%         /* #050505 - Fundo Escuro */
--foreground: 0 0% 98%        /* #FAFAFA - Texto Claro */
--muted: 217.2 32.6% 17.5%    /* #1E293B - Cinza Escuro */
```

### 🔤 Tipografia

#### Fonte Principal
- **Família**: Inter (Google Fonts)
- **Fallback**: -apple-system, BlinkMacSystemFont, 'Segoe UI'
- **Pesos**: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)

#### Escala Tipográfica
```css
/* Headings */
h1: 2.25rem (36px) | font-bold
h2: 1.875rem (30px) | font-semibold  
h3: 1.5rem (24px) | font-semibold
h4: 1.25rem (20px) | font-medium

/* Body */
body: 0.875rem (14px) | font-normal
small: 0.75rem (12px) | font-normal
```

### 🎭 Componentes Visuais

#### Gradientes
```css
--gradient-primary: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-glow)))
--gradient-subtle: linear-gradient(180deg, hsl(var(--background)), hsl(var(--muted)))
--gradient-radial: radial-gradient(circle, hsl(var(--primary) / 0.1), transparent)
```

#### Sombras
```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1)
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1)
--shadow-elegant: 0 10px 30px -10px hsl(var(--primary) / 0.3)
```

#### Animações
```css
--transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)
--animation-float: float 6s ease-in-out infinite
--animation-glow-pulse: glow-pulse 2s ease-in-out infinite alternate
```

---

## 🏗️ Arquitetura da Aplicação

### 📁 Estrutura de Pastas
```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base (shadcn)
│   ├── layout/         # Layouts e estrutura
│   └── auth/           # Componentes de autenticação
├── pages/              # Páginas da aplicação
├── hooks/              # Custom hooks
├── lib/                # Utilitários e configurações
├── assets/             # Imagens e recursos estáticos
└── types/              # Definições TypeScript
```

### 🌐 Domínios e Infraestrutura

A aplicação StorySpark é estruturada em múltiplos domínios para otimizar performance, segurança e experiência do usuário:

| Domínio                     | Função        | Descrição                        |
| --------------------------- | ------------- | -------------------------------- |
| **www.storyspark.com.br**   | Landing page  | Site principal e institucional   |
| **app.storyspark.com.br**   | Frontend SaaS | Interface do usuário (dashboard) |
| **api.storyspark.com.br**   | Backend API   | Endpoints das APIs REST          |
| **admin.storyspark.com.br** | Painel Admin  | Interface administrativa         |
| **docs.storyspark.com.br**  | Documentação  | Documentação pública da API      |

### 🔐 Sistema de Rotas

#### 🌐 Rotas Públicas
- `/` - Landing page principal
- `/blog` - Blog corporativo
- `/blog/:slug` - Posts individuais

#### 🔒 Rotas Protegidas (Cliente)
- `/dashboard` - Dashboard principal
- `/composer` - Editor de IA
- `/campaigns` - Gerenciamento de campanhas
- `/calendar` - Calendário editorial
- `/analytics` - Relatórios e métricas
- `/personas` - Gestão de personas
- `/brand-voices` - Vozes da marca
- `/templates` - Biblioteca de templates
- `/integrations` - Integrações externas
- `/team` - Gestão de equipe
- `/billing` - Faturamento e planos
- `/settings` - Configurações pessoais

#### 🛡️ Rotas Admin (Super Protegidas)
- `/admin` - Dashboard administrativo
- `/admin/users` - Gestão de usuários
- `/admin/campaigns` - Campanhas globais
- `/admin/analytics` - Analytics do sistema
- `/admin/billing` - Faturamento global
- `/admin/settings` - Configurações do sistema

---

## ✨ Funcionalidades Principais

### 🤖 IA para Criação de Copies
- **Análise de Público-alvo**: IA identifica padrões e preferências
- **Otimização por Plataforma**: Adapta conteúdo para cada rede social
- **A/B Testing Automático**: Sugere variações para teste
- **Análise de Performance**: Aprende com resultados anteriores

### 👥 Sistema de Personas
- **Perfis Detalhados**: Demografia, psicografia, comportamento
- **Análise de Tom**: Define linguagem e estilo de comunicação  
- **Templates Personalizados**: Personas por segmento de mercado
- **Histórico de Performance**: Tracking de efetividade

### 📊 Analytics Avançados
- **ROI por Campanha**: Retorno detalhado de cada ação
- **Engagement por Persona**: Performance segmentada
- **Análise de Sentimento**: Feedback qualitativo automático
- **Métricas Cross-platform**: Visão unificada de todas as redes

### 🔗 Integrações Nativas
- **Meta Business**: Instagram e Facebook
- **LinkedIn API**: Conteúdo corporativo
- **Twitter/X API**: Microblogging otimizado
- **Google Analytics**: Tracking de conversões
- **Zapier**: Automações personalizadas

---

## 🚀 Como Executar o Projeto

### 📋 Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Git

### 🐳 Deploy com Docker

#### Desenvolvimento Local
```bash
# Clone o repositório
git clone https://github.com/PauloHenriqueJr/storyspark.git
cd storyspark

# Build e execução com Docker
make build-docker

# Ou executar diretamente
docker-compose up --build -d
```

#### Deploy em Produção
```bash
# 1. Configure DNS apontando para sua VPS
# 2. Execute script de setup na VPS
wget https://raw.githubusercontent.com/PauloHenriqueJr/storyspark/main/scripts/deploy-vps.sh
chmod +x deploy-vps.sh && ./deploy-vps.sh

# 3. Configure secrets no GitHub Actions
# 4. Faça push para main - deploy automático!
```

**📖 Documentação completa**: [DEPLOY.md](./DEPLOY.md)

### 💻 Desenvolvimento Local

### ⚡ Instalação Rápida
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/storyspark.git

# Entre na pasta
cd storyspark

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev

# Acesse no navegador
http://localhost:5173
```

### 🔧 Scripts Disponíveis
```bash
npm run dev          # Desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview da build
npm run lint         # Linting do código
npm run type-check   # Verificação de tipos
```

---

## 📈 Roadmap de Desenvolvimento

### ✅ Fase 1: Concluída (Março 2024)
- [x] Setup inicial do projeto
- [x] Design system implementado
- [x] Todas as interfaces criadas
- [x] Sistema de rotas configurado
- [x] Componentes base funcionais

### 🔄 Fase 2: Em Andamento (Abril 2024)
- [ ] Sistema administrativo completo
- [ ] Navegação interna funcional
- [ ] Modais e formulários interativos
- [ ] Estados de loading e erro

### 🎯 Fase 3: Planejada (Maio 2024)
- [ ] Blog corporativo
- [ ] Landing pages otimizadas
- [ ] SEO implementation
- [ ] Performance optimization

### 🚀 Fase 4: Backend Integration (Junho 2024)
- [ ] Supabase integration
- [ ] IA APIs connection
- [ ] Real-time features
- [ ] Production deployment

---

## 📞 Contato e Suporte

### 🏢 Empresa
**StorySpark Technology Ltda.**
- **CNPJ**: 00.000.000/0001-00
- **Endereço**: São Paulo, SP - Brasil

### 👥 Equipe
- **CEO & Founder**: [Nome do CEO]
- **CTO**: [Nome do CTO]  
- **Head of Product**: [Nome do Head]
- **Lead Developer**: [Nome do Dev]

### 📧 Contatos
- **Comercial**: comercial@storyspark.com.br
- **Suporte**: suporte@storyspark.com.br
- **Técnico**: dev@storyspark.com.br

### 🌐 Links
- **Website**: https://storyspark.com.br
- **Blog**: https://storyspark.com.br/blog
- **LinkedIn**: https://linkedin.com/company/storyspark
- **GitHub**: https://github.com/storyspark

---

## 📄 Licença

Este projeto está sob licença proprietária. Todos os direitos reservados à **StorySpark Technology Ltda.**

Para mais informações sobre licenciamento e uso comercial, entre em contato conosco.

---

<div align="center">
  <p><strong>🚀 Construído com ❤️ e IA pela equipe StorySpark</strong></p>
  <p><em>"Transformando ideias em copies que convertem"</em></p>
</div>