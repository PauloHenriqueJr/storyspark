# FloatingAIAssistant - Fase 2 - Arquitetura Modular

## Visão Geral

O FloatingAIAssistant foi completamente refatorado para uma arquitetura modular e contextual que se adapta dinamicamente à página atual do usuário, oferecendo ações e insights relevantes para cada contexto específico.

## Estrutura de Arquivos

```
src/components/floating/
├── FloatingAIAssistant.tsx          # Componente principal orquestrador
├── index.ts                         # Arquivo de exportação centralizado
├── utils/
│   ├── contextDetector.ts           # Detecção e configuração de contextos
│   └── actionMapper.ts              # Mapeamento de ações por contexto
├── contexts/
│   ├── AnalyticsContext.tsx         # Contexto para página de analytics
│   ├── ComposerContext.tsx          # Contexto para página de criação
│   ├── CampaignsContext.tsx         # Contexto para página de campanhas
│   ├── PersonasContext.tsx          # Contexto para página de personas
│   └── BrandVoicesContext.tsx       # Contexto para página de brand voices
└── actions/
    ├── CopyGeneration.tsx           # Componente de geração de copy
    └── DocumentUpload.tsx           # Componente de upload de documentos
```

## Arquitetura Modular

### 1. Componente Principal (FloatingAIAssistant.tsx)

O componente principal atua como um orquestrador que:
- Detecta automaticamente o contexto da página atual
- Carrega o componente de contexto apropriado
- Gerencia modais de ações
- Fornece uma interface consistente

**Principais responsabilidades:**
- Detecção automática de contexto via URL
- Carregamento dinâmico de componentes contextuais
- Gerenciamento de estado global do assistente
- Interface de comunicação entre contextos e ações

### 2. Sistema de Detecção de Contexto (utils/contextDetector.ts)

Mapeia URLs para contextos específicos com configurações detalhadas:

```typescript
interface PageContext {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType;
  color: string;
  primaryAction: string;
  secondaryActions: string[];
  suggestions: string[];
  modalConfig: {
    showPlatformSelector: boolean;
    showBrandVoiceSelector: boolean;
    showPersonaSelector: boolean;
    showScheduler: boolean;
  };
}
```

**Contextos implementados:**
- `/analytics` - Analytics e métricas
- `/composer` - Criação de conteúdo
- `/campaigns` - Gestão de campanhas
- `/personas` - Gerenciamento de personas
- `/brand-voices` - Brand voices
- E mais 15+ contextos específicos

### 3. Sistema de Mapeamento de Ações (utils/actionMapper.ts)

Define ações disponíveis e suas configurações:

```typescript
interface ActionConfig {
  id: string;
  title: string;
  description: string;
  component: string;
  priority: number;
  dataRequirements: string[];
  platforms: string[];
}
```

**Ações implementadas:**
- `generate_copy` - Geração de copy com IA
- `upload_document` - Upload e processamento de documentos
- `schedule_post` - Agendamento de posts
- `analyze_performance` - Análise de performance
- E mais...

### 4. Componentes de Contexto

Cada página tem seu componente contextual específico que oferece:

#### AnalyticsContext.tsx
- Insights de performance em tempo real
- Métricas de engajamento
- Recomendações baseadas em dados
- Ações: gerar copy baseada em insights, criar relatórios

#### ComposerContext.tsx
- Geração rápida de ideias
- Sugestões de otimização
- Aplicação de brand voices
- Ações: geração de variações, otimização para plataformas

#### CampaignsContext.tsx
- Status de campanhas ativas
- Templates de campanha
- Métricas de progresso
- Ações: criar nova campanha, analisar performance

#### PersonasContext.tsx
- Visualização de personas existentes
- Insights de engajamento por persona
- Sugestões de otimização
- Ações: criar conteúdo direcionado, atualizar personas

#### BrandVoicesContext.tsx
- Gestão de brand voices
- Teste de consistência
- Aplicação de tons
- Ações: testar voices, criar novas voices

### 5. Componentes de Ação

Componentes modulares para ações específicas:

#### CopyGeneration.tsx
- Interface completa para geração de copy
- Seleção de plataformas e tipos
- Aplicação de brand voices e personas
- Sugestões contextuais baseadas na página atual

#### DocumentUpload.tsx
- Upload drag-and-drop
- Processamento com IA simulado
- Extração de insights para personas e brand voices
- Validação de tipos de arquivo

## Fluxo de Funcionamento

1. **Detecção de Contexto**: Quando o usuário navega, o sistema detecta a URL atual
2. **Carregamento de Contexto**: O componente apropriado é carregado dinamicamente
3. **Exibição de Ações**: Ações relevantes são mostradas baseadas no contexto
4. **Interação do Usuário**: Usuário clica em uma ação
5. **Abertura de Modal**: Modal específico da ação é aberto
6. **Execução**: Ação é executada com dados contextuais

## Benefícios da Nova Arquitetura

### 1. Modularidade
- Cada contexto é independente e pode ser desenvolvido separadamente
- Ações podem ser reutilizadas entre diferentes contextos
- Fácil adição de novos contextos e ações

### 2. Manutenibilidade
- Código organizado e bem estruturado
- Responsabilidades bem definidas
- Fácil debugging e teste

### 3. Escalabilidade
- Arquitetura suporta crescimento horizontal
- Novos contextos podem ser adicionados sem impactar existentes
- Sistema de prioridades para ações

### 4. Experiência do Usuário
- Interface contextual e relevante
- Sugestões inteligentes baseadas na página atual
- Ações rápidas e diretas

### 5. Inteligência Contextual
- Assistente entende onde o usuário está
- Oferece ações relevantes para o contexto atual
- Dados e sugestões específicas para cada página

## Como Adicionar Novos Contextos

1. **Definir Contexto** em `contextDetector.ts`:
```typescript
'/nova-pagina': {
  id: 'nova-pagina',
  title: 'Nova Página',
  description: 'Descrição da página',
  icon: NovoIcon,
  color: 'purple',
  primaryAction: 'acao_principal',
  secondaryActions: ['acao_secundaria'],
  suggestions: ['Sugestão 1', 'Sugestão 2']
}
```

2. **Criar Componente** em `contexts/NovaPageContext.tsx`

3. **Adicionar ao FloatingAIAssistant.tsx** no switch statement

4. **Definir Ações** em `actionMapper.ts` se necessário

## Como Adicionar Novas Ações

1. **Definir Ação** em `actionMapper.ts`:
```typescript
'nova_acao': {
  id: 'nova_acao',
  title: 'Nova Ação',
  description: 'Descrição da ação',
  component: 'NovaAcao',
  priority: 1,
  dataRequirements: ['dados_necessarios']
}
```

2. **Criar Componente** em `actions/NovaAcao.tsx`

3. **Adicionar ao Modal** no FloatingAIAssistant.tsx

## Considerações Técnicas

### Performance
- Componentes são carregados dinamicamente
- Estado é gerenciado de forma eficiente
- Renderização condicional minimiza overhead

### Acessibilidade
- Componentes seguem padrões de acessibilidade
- Navegação por teclado suportada
- ARIA labels apropriados

### Responsividade
- Interface adaptável a diferentes tamanhos de tela
- Componentes mobile-friendly
- Interações touch otimizadas

## Próximos Passos

1. **Integração com APIs Reais**: Substituir dados mockados por chamadas reais
2. **Testes Automatizados**: Implementar testes unitários e de integração
3. **Análise de Performance**: Otimizar carregamento e renderização
4. **Feedback do Usuário**: Coletar e implementar melhorias baseadas no uso
5. **Novos Contextos**: Adicionar mais páginas conforme necessário

Esta arquitetura modular permite crescimento sustentável e manutenção eficiente do FloatingAIAssistant, oferecendo uma experiência inteligente e contextual para os usuários.
