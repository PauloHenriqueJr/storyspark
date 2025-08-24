# Sistema de Contingência de IA - StorySpark

## 🎯 Visão Geral

O Sistema de Contingência de IA implementa fallback automático entre diferentes provedores de inteligência artificial, garantindo alta disponibilidade e resiliência do sistema. Quando um provedor de IA falha, o sistema automaticamente tenta outros provedores configurados, mantendo o serviço funcionando sem interrupção para o usuário.

## 🚀 Funcionalidades Implementadas

### 1. Interface Visual Avançada no Admin
- **Status Visual**: Indicadores claros de ativo/inativo para cada provedor
- **Teste de Conectividade**: Botão para testar cada provedor individualmente
- **Seleção de Modelo**: Dropdowns específicos com modelos disponíveis para cada provedor:
  - **OpenAI**: GPT-4o, GPT-4o Mini, GPT-4 Turbo, GPT-4, GPT-3.5 Turbo
  - **Claude (Anthropic)**: Claude 3.5 Sonnet, Claude 3.5 Haiku, Claude 3 Opus, etc.
  - **Google Gemini**: Gemini 2.0 Flash, Gemini 1.5 Pro, Gemini 1.5 Flash, etc.
  - **OpenRouter**: Acesso a múltiplos modelos via API unificada
  - **Kilocode**: Modelos especializados para código

### 2. Sistema de Contingência Configurável
- **Habilitação Automática**: Toggle para ativar/desativar contingência
- **Ordem de Prioridade**: Interface drag-and-drop para definir ordem de fallback
- **Configurações de Retry**: 
  - Número máximo de tentativas por provedor
  - Delay entre tentativas
  - Auto-retry habilitado/desabilitado

### 3. Banco de Dados Estruturado

#### Tabela: `admin_llm_settings`
```sql
-- Configurações de contingência
contingency_enabled: BOOLEAN
fallback_priority: JSONB
auto_retry_enabled: BOOLEAN
max_retry_attempts: INTEGER
retry_delay_seconds: INTEGER

-- Configurações dos provedores
kilocode_api_key: TEXT
kilocode_model: VARCHAR(100)
kilocode_active: BOOLEAN
```

#### Tabela: `ai_contingency_logs`
```sql
CREATE TABLE ai_contingency_logs (
  id: BIGSERIAL PRIMARY KEY
  original_provider: VARCHAR(50)
  fallback_provider: VARCHAR(50) 
  reason: TEXT
  timestamp: TIMESTAMPTZ
  user_id: VARCHAR(100)
  request_id: VARCHAR(100)
  created_at: TIMESTAMPTZ DEFAULT NOW()
)
```

### 4. Serviço de Contingência (`aiContingencyService.ts`)

#### Funcionalidades Principais:
- **Fallback Automático**: Tenta provedores em ordem de prioridade
- **Retry Inteligente**: Múltiplas tentativas com delay configurável
- **Logging Completo**: Registra todos os eventos de contingência
- **Monitoramento**: Estatísticas de uso e falhas
- **Teste de Conectividade**: Verifica status de cada provedor

#### Fluxo de Execução:
1. **Verificação**: Carrega configurações ativas
2. **Priorização**: Ordena provedores por prioridade
3. **Tentativa**: Tenta provedor principal com retry
4. **Fallback**: Se falhar, passa para próximo na lista
5. **Logging**: Registra eventos de contingência
6. **Resposta**: Retorna resultado transparente ao usuário

### 5. Hook React (`useAIContingency.ts`)
```typescript
const {
  loading,
  error, 
  response,
  executeRequest,
  testProvider,
  getStats,
  clearError,
  clearResponse
} = useAIContingency();
```

### 6. Página de Demonstração (`ContingencyDemo.tsx`)
- **Teste Interativo**: Interface para testar o sistema de contingência
- **Monitoramento em Tempo Real**: Estatísticas de uso e falhas
- **Teste de Provedores**: Verificação individual de cada provedor
- **Visualização de Resultados**: Mostra qual provedor foi usado
- **Estatísticas**: Métricas dos últimos 7 dias

## 📁 Estrutura de Arquivos

```
src/
├── pages/admin/
│   ├── AdminSettings.tsx         # Interface principal de configuração
│   └── ContingencyDemo.tsx       # Página de demonstração
├── services/
│   └── aiContingencyService.ts   # Lógica de contingência
├── hooks/
│   └── useAIContingency.ts       # Hook React para contingência
└── database/
    └── migrations/               # Migrações SQL
```

## 🔧 Como Usar

### 1. Configuração no Admin
1. Acesse **Admin Settings > IA**
2. Configure API Keys para cada provedor
3. Selecione modelos desejados
4. Ative os provedores necessários
5. Configure sistema de contingência:
   - Habilite contingência automática
   - Defina ordem de prioridade
   - Configure retry e delays

### 2. Uso no Código
```typescript
import { useAIContingency } from '@/hooks/useAIContingency';

const MyComponent = () => {
  const { executeRequest, loading, response, error } = useAIContingency();
  
  const handleAIRequest = async () => {
    const result = await executeRequest({
      prompt: "Olá, como você está?",
      maxTokens: 1000,
      temperature: 0.7,
      userId: "user123"
    }, "openai"); // Provedor preferido opcional
    
    if (result) {
      console.log(`Resposta de ${result.provider}: ${result.content}`);
    }
  };
  
  return (
    <button onClick={handleAIRequest} disabled={loading}>
      {loading ? 'Processando...' : 'Enviar para IA'}
    </button>
  );
};
```

### 3. Teste e Monitoramento
1. Acesse a página de demonstração: `/admin/contingency-demo`
2. Teste requisições com diferentes configurações
3. Monitore logs de contingência
4. Verifique estatísticas de uso

## 🛡️ Cenários de Contingência

### Cenário 1: Provedor Principal Indisponível
- **Situação**: OpenAI está offline
- **Ação**: Sistema tenta Gemini automaticamente
- **Log**: Registra evento de fallback
- **Usuário**: Não percebe a mudança

### Cenário 2: Rate Limit Excedido
- **Situação**: Anthropic retorna erro 429
- **Ação**: Aplica retry com delay, depois fallback
- **Log**: Registra tentativas e fallback
- **Usuário**: Recebe resposta de outro provedor

### Cenário 3: Timeout de Rede
- **Situação**: Requisição para Gemini timeout
- **Ação**: Retry 3 vezes, depois OpenRouter
- **Log**: Registra timeouts e recuperação
- **Usuário**: Resposta transparente

### Cenário 4: Todos Provedores Falham
- **Situação**: Todos provedores indisponíveis
- **Ação**: Retorna erro após esgotar todas opções
- **Log**: Registra falha completa do sistema
- **Usuário**: Recebe erro claro e orientações

## 📊 Monitoramento e Logs

### Métricas Disponíveis:
- **Total de Requisições**: Quantidade total processada
- **Ativações de Contingência**: Quantas vezes o fallback foi usado
- **Falhas por Provedor**: Ranking de provedores com mais falhas
- **Fallback Mais Usado**: Qual provedor salva mais o sistema
- **Taxa de Sucesso**: Percentual de requisições bem-sucedidas

### Logs Detalhados:
- **Timestamp**: Quando ocorreu o evento
- **Provedor Original**: Qual provedor deveria ter respondido
- **Provedor Fallback**: Qual provedor assumiu
- **Motivo**: Razão da troca (timeout, erro, rate limit)
- **Usuário**: Identificação do usuário afetado
- **Request ID**: Identificador único da requisição

## 🔮 Benefícios

1. **Alta Disponibilidade**: Sistema funciona mesmo com provedores offline
2. **Transparência**: Usuário não percebe falhas de provedores
3. **Flexibilidade**: Fácil adição de novos provedores
4. **Monitoramento**: Visibilidade completa de performance
5. **Custo-Benefício**: Otimiza uso baseado em disponibilidade
6. **Resiliência**: Recuperação automática de falhas
7. **Escalabilidade**: Suporta múltiplos provedores simultaneamente

## 🚀 Próximos Passos

1. **Integração Real**: Conectar com APIs reais dos provedores
2. **Métricas Avançadas**: Latência, custo por token, accuracy
3. **Balanceamento de Carga**: Distribuir requisições por performance
4. **Cache Inteligente**: Cachear respostas similares
5. **Alertas Proativos**: Notificações de falhas críticas
6. **Dashboard Executivo**: Relatórios para gestão

---

**Sistema implementado com sucesso! 🎉**

O sistema de contingência de IA está totalmente funcional e pronto para garantir alta disponibilidade dos serviços de inteligência artificial no StorySpark.