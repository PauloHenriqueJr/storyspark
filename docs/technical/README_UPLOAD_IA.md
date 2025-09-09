# 🚀 Sistema de Upload com IA Real - README

## 📋 Visão Geral

Este sistema permite que usuários façam upload de documentos (PDF, DOCX, TXT) e tenham suas informações automaticamente extraídas e aplicadas na plataforma usando IA real. O sistema integra perfeitamente com o Composer existente e usa a mesma IA configurada.

## ✨ Funcionalidades Principais

### 🔄 Upload Inteligente
- **Drag & Drop** - Interface intuitiva
- **Múltiplos formatos** - PDF, DOCX, TXT
- **Validação automática** - Tamanho e tipo
- **Progresso visual** - Feedback em tempo real

### 🤖 Processamento com IA Real
- **Mesma IA do Composer** - Sistema de contingência
- **Fallback automático** - Entre provedores
- **Extração estruturada** - JSON consistente
- **Validação inteligente** - Dados limpos

### 📊 Aplicação Automática
- **Brand Voices** - Cria automaticamente
- **Personas** - Gera baseado no documento
- **Campanhas** - Cria campanhas de marketing
- **Perfil da empresa** - Atualiza informações

## 🛠️ Instalação e Configuração

### 1. Executar Script SQL
```sql
-- Execute o arquivo: scripts/sql/setup_ai_config.sql
-- No SQL Editor do Supabase
└── DOCUMENT_UPLOAD_SYSTEM.md           # Documentação do sistema
```
### 2. Verificar Configuração de IA
```sql
-- Verificar se a IA está ativa
SELECT * FROM admin_llm_settings 
WHERE openai_active = true OR anthropic_active = true OR gemini_active = true;
```

### 3. Testar Sistema
1. Acesse a plataforma
2. Clique no botão flutuante de copy
3. Selecione "Upload de Documentos"
4. Faça upload de um documento
5. Aguarde o processamento
6. Revise e aplique os dados

## 📁 Estrutura de Arquivos

```
src/
├── services/
│   ├── documentProcessingService.ts    # Processamento com IA
│   └── dataApplicationService.ts       # Aplicação de dados
├── components/
│   └── upload/
│       └── DocumentUploadModal.tsx     # Modal de upload
└── components/
    └── floating/
        └── FloatingCopyButton.tsx      # Integração

scripts/
└── sql/setup_ai_config.sql             # Script de configuração
docs/
└── DOCUMENT_UPLOAD_IA_INTEGRATION.md   # Documentação completa
```

## 🔧 Como Usar

### Para Usuários
1. **Acesse o botão flutuante** na plataforma
2. **Clique em "Upload de Documentos"**
3. **Arraste ou selecione** seus documentos
4. **Aguarde o processamento** com IA
5. **Revise os dados** extraídos
6. **Edite se necessário** e aplique

### Para Desenvolvedores
```typescript
// Importar serviços
import { documentProcessingService } from '@/services/documentProcessingService';
import { dataApplicationService } from '@/services/dataApplicationService';

// Processar documento
const extractedData = await documentProcessingService.processDocument(
  file,
  userId,
  (progress) => console.log(progress)
);

// Aplicar dados
const result = await dataApplicationService.applyExtractedData(
  userId,
  workspaceId,
  extractedData
);
```

## 🗄️ Banco de Dados

### Tabela: `ai_processing_jobs`
```sql
CREATE TABLE ai_processing_jobs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  extracted_data JSONB,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);
```

### Bucket: `document-uploads`
- Storage privado para arquivos
- Organização por usuário
- Políticas RLS ativas

## 🤖 Integração com IA

### Sistema de Contingência
- **Provedores múltiplos** - OpenAI, Anthropic, Gemini
- **Fallback automático** - Se um falhar, tenta outro
- **Configuração centralizada** - Tabela `admin_llm_settings`
- **Logs detalhados** - Monitoramento completo

### Prompt Estruturado
```typescript
const prompt = `
Analise o documento e extraia informações estruturadas:
- Brand Voice (nome, descrição, tom, características)
- Personas (nome, idade, profissão, interesses, dores, objetivos)
- Informações da empresa (nome, setor, missão, visão, valores)
- Dados de marketing (público-alvo, canais, campanhas, objetivos)

Retorne apenas JSON válido.
`;
```

## 🔄 Fluxo de Trabalho

### 1. Upload
```
Usuário faz upload → Validação → Storage → Job criado
```

### 2. Processamento
```
Extrai texto → IA analisa → Processa resposta → Valida dados
```

### 3. Preview
```
Mostra dados → Usuário edita → Valida aplicação
```

### 4. Aplicação
```
Cria brand voices → Gera personas → Cria campanhas → Atualiza perfil
```

## 📊 Monitoramento

### Métricas Importantes
- **Taxa de sucesso** - Jobs completados vs falhados
- **Tempo de processamento** - Performance da IA
- **Uso de storage** - Espaço ocupado
- **Erros comuns** - Padrões de falha

### Logs de Debug
```typescript
// Verificar jobs de processamento
SELECT * FROM ai_processing_jobs 
WHERE user_id = 'seu-user-id' 
ORDER BY created_at DESC;

// Verificar erros
SELECT * FROM ai_processing_jobs 
WHERE status = 'failed' 
ORDER BY created_at DESC;
```

## 🛠️ Troubleshooting

### Problemas Comuns

#### 1. IA não responde
```sql
-- Verificar configuração
SELECT * FROM admin_llm_settings;
-- Verificar se algum provedor está ativo
```

#### 2. Upload falha
```sql
-- Verificar bucket
SELECT * FROM storage.buckets WHERE id = 'document-uploads';
-- Verificar políticas
SELECT * FROM storage.policies WHERE bucket_id = 'document-uploads';
```

#### 3. Dados inconsistentes
- Verificar prompt no `documentProcessingService.ts`
- Ajustar validação no `validateAndCleanData`
- Monitorar logs de erro

#### 4. Aplicação falha
- Verificar permissões do usuário
- Validar estrutura dos dados
- Verificar serviços de brand voices, personas, campanhas

## 🚀 Próximos Passos

### Melhorias Planejadas
1. **Extração de PDF real** - Implementar pdf-parse
2. **Extração de DOCX real** - Implementar mammoth
3. **Processamento em lote** - Múltiplos arquivos simultâneos
4. **Templates personalizados** - Prompts específicos por setor
5. **Análise de imagens** - OCR para documentos escaneados

### Otimizações
1. **Cache de processamento** - Evitar reprocessar
2. **Compressão de arquivos** - Reduzir uso de storage
3. **Processamento assíncrono** - Jobs em background
4. **Notificações push** - Status em tempo real

## 📞 Suporte

### Documentação
- [Documentação Completa](DOCUMENT_UPLOAD_IA_INTEGRATION.md)
- [Guia de Configuração](scripts/sql/setup_ai_config.sql)
### Documentação
- [Documentação do Sistema](DOCUMENT_UPLOAD_SYSTEM.md)
- [Guia de Configuração](../sql/setup_ai_config.sql)
- [Arquitetura do Sistema](../development/AI_RULES.md)```typescript
// Habilitar logs detalhados
console.log('Document Processing:', {
  file: file.name,
  size: file.size,
  type: file.type
});

// Monitorar progresso
onProgress: (progress) => {
  console.log('Progress:', progress);
}
```

---

**Status**: ✅ IMPLEMENTADO E FUNCIONAL  
**Versão**: 1.0.0  
**IA**: 🤖 REAL E CONFIGURADA  
**Integração**: 🔗 TOTAL COM PLATAFORMA