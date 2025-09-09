# StorySpark

Uma plataforma completa de marketing de conteúdo com IA integrada para criação de cópias, campanhas e análise de performance.

## 🚀 Tecnologias

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Shadcn/ui + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **IA**: Google Gemini + OpenAI
- **Estado**: React Query + Context API
- **Testes**: Vitest + Playwright
- **Deploy**: Vercel/Netlify

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Core da aplicação
│   ├── providers/         # Context providers consolidados
│   ├── router/            # Sistema de rotas otimizado
│   └── store/             # Estado global (futuro)
├── components/
│   ├── ui/               # Componentes Shadcn/ui
│   ├── common/           # Componentes reutilizáveis
│   ├── layout/           # Layouts e headers
│   └── features/         # Componentes específicos de features
├── pages/
│   ├── public/           # Páginas públicas
│   ├── app/              # Páginas da aplicação
│   └── admin/            # Páginas administrativas
├── hooks/                # Custom hooks
├── lib/                  # Utilitários e configurações
├── types/                # TypeScript types
└── assets/              # Assets estáticos

docs/
├── technical/           # Documentação técnica
├── features/            # Documentação de features
├── development/         # Guias de desenvolvimento
└── planning/            # Roadmaps e planejamento
```

## 🛠️ Desenvolvimento

### Pré-requisitos

- Node.js 18+
- npm ou bun
- Conta Supabase

### Instalação

```bash
# Instalar dependências
npm install

# Configurar ambiente
cp .env.Example .env
# Editar .env com suas credenciais

# Executar migrações do banco
npm run db:apply:copies

# Iniciar desenvolvimento
npm run dev
```

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Servidor de desenvolvimento
npm run build           # Build de produção
npm run preview         # Preview do build

# Qualidade de código
npm run lint            # Executar ESLint
npm run lint:fix        # Corrigir problemas do ESLint
npm run type-check      # Verificar tipos TypeScript

# Testes
npm run test            # Executar testes
npm run test:run        # Executar testes uma vez
npm run test:coverage   # Testes com cobertura
npm run e2e             # Testes end-to-end

# Performance
npm run bundle-analyze  # Analisar tamanho do bundle
npm run performance     # Executar Lighthouse

# Banco de dados
npm run db:apply:copies  # Aplicar migração de cópias
npm run db:apply:stats   # Aplicar migração de estatísticas
```

## 📊 Métricas de Performance

| Métrica           | Atual  | Objetivo | Status |
| ----------------- | ------ | -------- | ------ |
| Bundle Size       | ~2.5MB | ~800KB   | 🔴      |
| First Load        | ~3.2s  | ~1.5s    | 🔴      |
| Code Coverage     | ~15%   | ~80%     | 🔴      |
| TypeScript Strict | ❌      | ✅        | 🔴      |

## 🔧 Configuração do Ambiente

### Variáveis de Ambiente (.env)

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Email
VITE_RESEND_API_KEY=your_resend_api_key
VITE_EMAIL_MODE=production

# IA
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

### Configuração do Supabase

1. Criar projeto no [Supabase](https://supabase.com)
2. Executar migrações em `supabase/migrations/`
3. Configurar Row Level Security (RLS)
4. Configurar Storage buckets

## 🚀 Deploy

### Produção

```bash
# Build otimizado
npm run build

# Deploy no Vercel
vercel --prod

# Ou deploy manual
npm run preview
```

### Desenvolvimento

```bash
# Servidor local
npm run dev

# Com HMR e análise
npm run dev -- --mode development
```

## 📚 Documentação

- [Arquitetura Técnica](./docs/technical/ARCHITECTURE.md)
- [Guia de Desenvolvimento](./docs/development/)
- [Roadmap](./docs/planning/)
- [API Reference](./docs/technical/API.md)

## 🤝 Contribuição

1. Fork o projeto
2. Criar branch para feature (`git checkout -b feature/nova-feature`)
3. Commit das mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para branch (`git push origin feature/nova-feature`)
5. Abrir Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🎨 Design System

### 🌈 Paleta de Cores

#### Cores Primárias
- **Laranja Vibrante**: `#FF6B35` - hsl(22 100% 55%)
- **Laranja Claro**: `#FF8A5B` - hsl(22 100% 65%)
- **Texto Principal**: `#0A0A0A` - hsl(0 0% 3.9%)
- **Fundo Claro**: `#FFFFFF` - hsl(0 0% 100%)

#### Cores Secundárias
- **Cinza Claro**: `#F8FAFC` - hsl(210 40% 98%)
- **Texto Secundário**: `#64748B` - hsl(215 13.8% 34.1%)
- **Bordas**: `#E2E8F0` - hsl(214.3 31.8% 91.4%)
- **Sucesso**: `#16A34A` - hsl(142 76% 36%)
- **Alerta**: `#F59E0B` - hsl(38 92% 50%)
- **Erro**: `#DC2626` - hsl(0 72% 51%)

### 🔤 Tipografia

#### Fonte Principal
- **Família**: Inter (Google Fonts)
- **Fallback**: -apple-system, BlinkMacSystemFont, 'Segoe UI'
- **Pesos**: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)

#### Escala Tipográfica
- **h1**: 2.25rem (36px) - font-bold
- **h2**: 1.875rem (30px) - font-semibold
- **h3**: 1.5rem (24px) - font-semibold
- **h4**: 1.25rem (20px) - font-medium
- **body**: 0.875rem (14px) - font-normal
- **small**: 0.75rem (12px) - font-normal

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

## 📞 Suporte
## 📞 Suporte

- 📧 Email: [A definir]
- 💬 Discord: [Em construção]
- 📖 Docs: Veja a pasta `/docs` neste repositório