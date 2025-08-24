# Guia de Configuração de IA - StorySparkl

## ✅ Sistema Implementado

O sistema de IA foi configurado para buscar dinamicamente as configurações do banco de dados, permitindo trocar entre diferentes provedores e modelos sem alterar código.

### 🗄️ Tabela de Configurações: `admin_llm_settings`

A tabela contém as configurações para todos os provedores suportados:

- **OpenAI**: `openai_active`, `openai_model`, `openai_api_key`
- **Anthropic**: `anthropic_active`, `anthropic_model`, `anthropic_api_key`  
- **Google Gemini**: `gemini_active`, `gemini_model`, `gemini_api_key`
- **OpenRouter**: `openrouter_active`, `openrouter_model`, `openrouter_api_key`
- **Kilocode**: `kilocode_active`, `kilocode_model`, `kilocode_api_key`

### 🎯 Configuração Atual

```sql
SELECT default_provider, gemini_active, gemini_model 
FROM admin_llm_settings;

-- Resultado:
-- default_provider: "gemini"
-- gemini_active: true  
-- gemini_model: "gemini-2.0-flash-exp"
```

### 🔧 Como Funciona

1. **CopyGenerationService** busca configurações dinamicamente do banco
2. **aiContingencyService** carrega todos os provedores ativos
3. Sistema usa o `default_provider` configurado no banco
4. Se o provedor padrão falhar, sistema usa fallback automático

### 🚀 Para Trocar de Modelo/Provedor

#### Opção 1: Trocar apenas o modelo (mesmo provedor)
```sql
UPDATE admin_llm_settings 
SET gemini_model = 'gemini-1.5-pro' 
WHERE id = (SELECT id FROM admin_llm_settings LIMIT 1);
```

#### Opção 2: Trocar para outro provedor
```sql
-- Ativar OpenAI e definir como padrão
UPDATE admin_llm_settings 
SET default_provider = 'openai',
    openai_active = true,
    openai_api_key = 'sua-api-key-aqui',
    openai_model = 'gpt-4o'
WHERE id = (SELECT id FROM admin_llm_settings LIMIT 1);
```

#### Opção 3: Ativar múltiplos provedores (sistema de contingência)
```sql
UPDATE admin_llm_settings 
SET gemini_active = true,
    openai_active = true,
    anthropic_active = true,
    contingency_enabled = true,
    fallback_priority = '{"gemini": 1, "openai": 2, "anthropic": 3}'
WHERE id = (SELECT id FROM admin_llm_settings LIMIT 1);
```

### 📋 Arquivos Modificados

1. **`/src/services/copyGenerationService.ts`**
   - ✅ Remove valores hardcoded
   - ✅ Busca configurações dinamicamente do banco
   - ✅ Valida configurações antes de usar
   - ✅ Logging detalhado dos provedores utilizados

2. **`/src/services/aiContingencyService.ts`**
   - ✅ Já estava correto - busca tudo do banco
   - ✅ Sistema de fallback automático funcional

3. **`/src/pages/Composer.tsx`**
   - ✅ Já estava usando o serviço real
   - ✅ Exibe informações do provedor/modelo usado

### 🧪 Testando o Sistema

```javascript
// No console do navegador:
import { copyGenerationService } from '/src/services/copyGenerationService';

// Validar configurações
const validation = await copyGenerationService.validateSettings();
console.log(validation);

// Forçar recarregamento das configurações
await copyGenerationService.reloadSettings();
```

### 🔍 Logs de Debug

O sistema agora loga:
- Qual provedor está sendo usado
- Qual modelo está ativo  
- Quantos tokens foram consumidos
- Se houve fallback para outro provedor

### ⚡ Próximos Passos

1. Configurar as API keys dos provedores desejados
2. Testar a geração de copy no Composer
3. Monitorar os logs para verificar qual provedor está sendo usado
4. Ajustar parâmetros como `temperature` e `max_tokens` conforme necessário

### 🚨 Importantes

- **Nunca deixe valores hardcoded no código** ✅ Resolvido
- **Sempre busque configurações do banco** ✅ Implementado  
- **Sistema de fallback ativo** ✅ Funcional
- **Logs detalhados para debug** ✅ Implementado
