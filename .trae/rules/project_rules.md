# 📋 Regras do Projeto StorySpark

## ⚠️ REGRA CRÍTICA - CONTROLE DO SERVIDOR

**IMPORTANTE**: O assistente JAMAIS deve iniciar, parar ou controlar o servidor de desenvolvimento. O controle do servidor (`npm run dev`, `npm start`, etc.) é de responsabilidade EXCLUSIVA do usuário. O assistente deve apenas sugerir comandos quando necessário, mas nunca executá-los automaticamente.

---

## 📂 PASTA DE REFERÊNCIA AUXILIAR - spark-copy-fast-79

**IMPORTANTE**: A pasta `spark-copy-fast-79` serve como **referência auxiliar** para aprimoramento do código principal do StorySpark. Esta pasta contém implementações de referência que devem ser utilizadas **EXCLUSIVAMENTE** quando solicitado especificamente.

### Regras de Uso:
- **Uso Condicional**: Os códigos desta pasta devem ser consultados APENAS quando explicitamente solicitado
- **Não Substituição**: Nunca substituir código principal sem autorização específica
- **Referência**: Utilizar como base para melhorias e otimizações quando indicado
- **Consulta Auxiliar**: Serve como apoio para entender padrões e implementações alternativas

### Quando Consultar:
- Quando o usuário mencionar explicitamente "consultar pasta auxiliar"
- Para comparação de implementações quando solicitado
- Como referência para melhorias específicas quando indicado
- Para análise de padrões alternativos quando requisitado

**ATENÇÃO**: Esta pasta NÃO faz parte da estrutura principal do projeto e deve ser tratada apenas como material de referência auxiliar.

---

## 🎯 Visão Geral do Projeto

**StorySpark** é uma plataforma SaaS de criação de copies com IA para marketing digital. O projeto utiliza React 18 + TypeScript com foco em performance, acessibilidade e experiência do usuário moderna.

---

## 🛠️ Stack Tecnológica

### Frontend Principal
- **Framework**: React 18.3.1 com TypeScript (modo strict)
- **Build Tool**: Vite com SWC para compilação rápida
- **Roteamento**: React Router DOM v6
- **Estilização**: Tailwind CSS + CSS Variables
- **UI Components**: Shadcn/ui (Radix UI primitives)
- **Ícones**: Lucide React
- **Animações**: Framer Motion
- **PWA**: Vite PWA Plugin

### Backend e Dados
- **Database**: Supabase (PostgreSQL)
- **Autenticação**: Supabase Auth com PKCE flow
- **Storage**: Supabase Storage
- **Estado**: Context API + Custom Hooks
- **Cache**: React Query (preparado)

### Ferramentas de Desenvolvimento
- **Linting**: ESLint + TypeScript ESLint
- **Bundling**: Vite + Rollup
- **Tipagem**: TypeScript com configuração strict
- **Testes**: Playwright (configurado)

---

## 📁 Estrutura de Arquivos

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base (shadcn/ui)
│   ├── layout/         # Componentes de layout
│   ├── auth/           # Componentes de autenticação
│   ├── modals/         # Modais da aplicação
│   ├── analytics/      # Componentes de analytics
│   ├── calendar/       # Componentes de calendário
│   ├── floating/       # Componentes flutuantes
│   ├── help/           # Sistema de ajuda
│   ├── notifications/  # Sistema de notificações
│   ├── onboarding/     # Tutorial/onboarding
│   ├── performance/    # Componentes de performance
│   ├── pwa/            # Componentes PWA
│   ├── search/         # Busca global
│   ├── templates/      # Templates
│   ├── upload/         # Upload de arquivos
│   ├── StorySpark/     # Componentes específicos do StorySpark
│   └── debug/          # Componentes de debug
├── pages/              # Páginas da aplicação
│   └── admin/          # Páginas administrativas
├── hooks/              # Custom hooks
├── services/           # Serviços e APIs
├── contexts/           # Contextos React
├── lib/                # Utilitários e configurações
├── types/              # Definições de tipos
├── utils/              # Funções utilitárias
├── data/               # Dados e hooks de dados
└── integrations/       # Integrações externas
    └── supabase/       # Configuração Supabase

# Estrutura Raiz do Projeto:
├── .github/workflows/   # GitHub Actions e CI/CD
├── .kiro/steering/     # Documentos de direcionamento
├── .qoder/quests/      # Tarefas e quests do projeto
├── .trae/rules/        # Regras do projeto
├── backup/             # Backups de componentes
├── backups/            # Backups adicionais
├── docs/               # Documentação completa
├── landpage/           # Landing page separada
├── n8n/                # Automações e workflows
├── public/             # Assets públicos
├── scripts/            # Scripts de automação
├── sql/                # Scripts SQL e migrações
└── supabase/           # Configuração Supabase
```

---

## 🎨 Padrões de Estilização

### Tailwind CSS
- **Função `cn()`**: Sempre usar `cn()` de `@/lib/utils` para combinar classes
- **CSS Variables**: Usar variáveis CSS para cores e temas
- **Responsividade**: Mobile-first approach
- **Dark Mode**: Suporte completo com `next-themes`

### Design System
- **Cores Principais**: 
  - Primary: HSL(22, 100%, 55%) - Laranja vibrante
  - Primary Glow: HSL(22, 100%, 65%)
- **Gradientes**: Usar variáveis CSS definidas
- **Animações**: Framer Motion + animações CSS customizadas
- **Componentes**: Shadcn/ui como base, customizados conforme necessário

### Exemplo de Uso:
```tsx
import { cn } from "@/lib/utils"

const Button = ({ className, ...props }) => (
  <button 
    className={cn(
      "bg-primary text-primary-foreground hover:bg-primary/90",
      "transition-colors duration-200",
      className
    )}
    {...props}
  />
)
```

### Componentes Específicos do StorySpark
- **AIControls**: Controles de IA para geração de conteúdo
- **ActiveIndicators**: Indicadores de status ativo
- **BrazilianToneSelector**: Seletor de tom brasileiro
- **CopyResultActions**: Ações para resultados de copy
- **FloatingActiveIndicator**: Indicador flutuante de atividade
- **FreeModeComposer**: Compositor em modo livre
- **FunnelStageSelector**: Seletor de estágio de funil
- **HookCard/HookFilters/HooksLibrary**: Sistema de hooks de marketing
- **PersonaSelector**: Seletor de personas
- **PromptEditor**: Editor de prompts
- **QuickConfigSelector**: Seletor de configuração rápida
- **ReferralWidget**: Widget de indicações
- **TestimonialForm/TestimonialsGrid**: Sistema de depoimentos
- **VariableManager**: Gerenciador de variáveis

---

## ⚛️ Padrões de Componentes React

### Estrutura de Componentes
- **Functional Components**: Sempre usar function components com hooks
- **TypeScript**: Tipagem explícita para props e estados
- **Lazy Loading**: Usar `React.lazy()` para páginas principais
- **Error Boundaries**: Implementar para componentes críticos

### Exemplo de Componente:
```tsx
import React from 'react'
import { cn } from '@/lib/utils'

interface ComponentProps {
  title: string
  description?: string
  className?: string
  children?: React.ReactNode
}

export const Component: React.FC<ComponentProps> = ({ 
  title, 
  description, 
  className,
  children 
}) => {
  return (
    <div className={cn("p-4 rounded-lg", className)}>
      <h2 className="text-xl font-semibold">{title}</h2>
      {description && (
        <p className="text-muted-foreground mt-2">{description}</p>
      )}
      {children}
    </div>
  )
}
```

### Custom Hooks
- **Nomenclatura**: Sempre começar com `use`
- **Responsabilidade única**: Um hook por funcionalidade
- **Tipagem**: Interfaces explícitas para retorno
- **Error Handling**: Tratamento de erros consistente

### Exemplo de Hook:
```tsx
import { useState, useEffect } from 'react'

interface UseDataReturn<T> {
  data: T[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export const useData = <T>(): UseDataReturn<T> => {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = async () => {
    // Implementação
  }

  useEffect(() => {
    refetch()
  }, [])

  return { data, loading, error, refetch }
}
```

---

## 🔗 Padrões de Roteamento

### Estrutura de Rotas
- **Rotas Públicas**: `/`, `/modern`, `/blog`, `/auth`
- **Rotas Protegidas**: `/dashboard`, `/composer`, `/campaigns`, etc.
- **Rotas Admin**: `/admin/*` (requer permissão especial)
- **Lazy Loading**: Todas as páginas principais são lazy loaded
- **Layout Wrapper**: `AppLayout` para páginas protegidas

### Proteção de Rotas:
```tsx
<Route path="/dashboard" element={
  <ProtectedRoute>
    <AppLayout>
      <LazyLoadWrapper>
        <Dashboard />
      </LazyLoadWrapper>
    </AppLayout>
  </ProtectedRoute>
} />
```

---

## 🗄️ Gerenciamento de Estado

### Context API
- **ToastContext**: Para notificações da aplicação
- **ThemeProvider**: Para gerenciamento de temas
- **Workspace Context**: Para dados do workspace atual

### Custom Hooks para Estado
- **useWorkspace**: Gerenciamento de workspace
- **useNotifications**: Sistema de notificações
- **useCampaigns**: Gerenciamento de campanhas
- **usePersonas**: Gerenciamento de personas
- **useAnalytics**: Dados de analytics
- **useCalendar**: Gerenciamento de calendário
- **useMobile**: Detecção de dispositivos móveis
- **usePWA**: Funcionalidades PWA
- **useRole**: Gerenciamento de roles e permissões
- **useStats**: Estatísticas e métricas
- **useUTM**: Parâmetros UTM e tracking

### Padrão de Service:
```tsx
// services/campaignsService.ts
export const campaignsService = {
  getAll: async (workspaceId: string) => {
    // Implementação
  },
  create: async (data: CreateCampaignInput) => {
    // Implementação
  },
  update: async (id: string, data: UpdateCampaignInput) => {
    // Implementação
  },
  delete: async (id: string) => {
    // Implementação
  }
}
```

---

## 🔐 Autenticação e Segurança

### Supabase Auth
- **Flow Type**: PKCE (Proof Key for Code Exchange)
- **Persistência**: localStorage com auto-refresh
- **OAuth**: Suporte para Google OAuth
- **Proteção**: ProtectedRoute component para rotas privadas

### Configuração:
```tsx
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
})
```

---

## 📱 Progressive Web App (PWA)

### Configuração
- **Service Worker**: Auto-update com Vite PWA
- **Manifest**: Configurado para instalação
- **Caching**: Cache-first para recursos estáticos
- **Offline**: Suporte básico offline

### Ícones e Assets
- **Favicon**: `/favicon2.ico`
- **PWA Icons**: 192x192 e 512x512 pixels
- **Theme Color**: `#f97316` (laranja)

---

## 🎯 Performance e Otimização

### Lazy Loading
- **Páginas**: Todas as páginas principais são lazy loaded
- **Componentes**: Componentes pesados com `React.lazy()`
- **Wrapper**: `LazyLoadWrapper` para loading states

### Bundle Optimization
- **Vite**: Build otimizado com tree-shaking
- **SWC**: Compilação rápida em desenvolvimento
- **Code Splitting**: Automático por rota

---

## 🧪 Testes e Qualidade

### ESLint Configuration
- **TypeScript**: Regras específicas para TS
- **React Hooks**: Validação de hooks rules
- **Unused Variables**: Desabilitado (desenvolvimento)

### Playwright
- **E2E Testing**: Configurado para testes end-to-end
- **Cross-browser**: Suporte para múltiplos navegadores

---

## 📦 Scripts e Comandos

```bash
# Desenvolvimento
npm run dev              # Servidor desenvolvimento (porta 8080)

# Build
npm run build            # Build produção
npm run build:dev        # Build desenvolvimento
npm run preview          # Preview build

# Qualidade
npm run lint             # ESLint
npm run type-check       # Verificação TypeScript
```

---

## 🌐 Integrações Externas

### Integrações Externas

### APIs Suportadas
- **Supabase**: Database e autenticação
- **OpenAI/Anthropic**: IA para geração de copies (implementado)
- **Social Media APIs**: Facebook, Instagram, Twitter, LinkedIn
- **Analytics**: Google Analytics integration
- **N8N**: Automações e workflows

### Webhooks
- **Sistema**: Suporte para webhooks customizados
- **Integrações**: Zapier e automações externas
- **N8N Workflows**: Processamento de documentos, email marketing, onboarding

---

## 📝 Convenções de Código

### Nomenclatura
- **Componentes**: PascalCase (`UserProfile`)
- **Hooks**: camelCase com prefixo `use` (`useUserData`)
- **Arquivos**: kebab-case para utilitários, PascalCase para componentes
- **Variáveis**: camelCase (`userName`)
- **Constantes**: UPPER_SNAKE_CASE (`API_BASE_URL`)

### Imports
- **Ordem**: React imports → Third-party → Internal → Relative
- **Alias**: Usar `@/` para imports absolutos
- **Tipos**: Importar tipos explicitamente quando necessário

### Comentários
- **JSDoc**: Para funções públicas e componentes complexos
- **Inline**: Para lógica complexa
- **TODO**: Marcar itens pendentes claramente

---

## 🚀 Deploy e Ambiente

### Variáveis de Ambiente
- **Supabase**: URL e chave anônima
- **APIs**: Chaves para integrações externas
- **Ambiente**: Development/Production flags

### Build Configuration
- **Vite**: Configuração otimizada para produção
- **PWA**: Service worker e manifest
- **Assets**: Otimização automática de imagens

---

## 📚 Documentação e Recursos

### Documentação Interna
- `ARCHITECTURE.md`: Arquitetura detalhada
- `README.md`: Setup e visão geral
- `PROJECT_INDEX.md`: Índice completo do projeto
- `docs/ARCHITECTURE.md`: Arquitetura expandida
- `docs/RESUMO_EXECUTIVO.md`: Resumo executivo do projeto
- `docs/ROLES_SYSTEM.md`: Sistema de roles e permissões
- `docs/IMPLEMENTATION_STATUS.md`: Status de implementação
- `docs/ROADMAP_IMPLEMENTACAO.md`: Roadmap de implementação
- `docs/NOTIFICATIONS_SYSTEM.md`: Sistema de notificações
- `docs/CONTINGENCY_SYSTEM.md`: Sistema de contingência
- `ROADMAP_EMAIL_MARKETING.md`: Roadmap de email marketing
- `FLOATING_COPY_BUTTON_ROADMAP.md`: Roadmap do botão flutuante

### Recursos Externos
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Supabase Docs](https://supabase.com/docs)

---

## ⚠️ Pontos de Atenção

### Desenvolvimento
1. **Performance**: Sempre considerar lazy loading para componentes pesados
2. **Acessibilidade**: Seguir padrões WCAG 2.1
3. **Responsividade**: Testar em múltiplos dispositivos
4. **Tipagem**: Manter tipagem TypeScript rigorosa
5. **Error Handling**: Implementar tratamento de erros consistente

### Produção
1. **Bundle Size**: Monitorar tamanho do bundle
2. **Performance**: Core Web Vitals
3. **SEO**: Meta tags e estrutura semântica
4. **Security**: Validação de inputs e sanitização
5. **Monitoring**: Logs e analytics de erro

---

## 🔄 Fluxo de Desenvolvimento

1. **Feature Branch**: Criar branch para nova funcionalidade
2. **Development**: Desenvolver seguindo os padrões estabelecidos
3. **Testing**: Testar funcionalidade e responsividade
4. **Code Review**: Revisar código seguindo as convenções
5. **Merge**: Integrar à branch principal
6. **Deploy**: Deploy automático ou manual conforme ambiente

---

*Este documento deve ser atualizado conforme o projeto evolui. Sempre consulte a documentação mais recente antes de implementar novas funcionalidades.*