# Migração da Página de Ideias IA - Design Document

## 1. Visão Geral

Este documento descreve o processo de migração da página "Ideias IA" do projeto StorySpark para a implementação mais recente encontrada no projeto `spark-copy-fast-67`. A nova implementação oferece uma interface mais moderna, recursos aprimorados e uma melhor experiência do usuário.

## 2. Arquitetura

### 2.1 Componentes da Nova Implementação

A nova implementação da página de Ideias IA é composta por:

- Página principal com sistema de abas
- Modal de geração de ideias
- Sistema de visualização de ideias
- Sistema de favoritos
- Filtros por categoria e indústria

### 2.2 Estrutura de Dados

A nova implementação utiliza uma estrutura de dados simplificada para ideias com os seguintes campos:

- id: Identificador único da ideia
- title: Título da ideia
- description: Descrição detalhada
- category: Categoria da ideia (campanha, conteúdo, estratégia, produto ou engajamento)
- industry: Indústria/nicho associado
- difficulty: Nível de dificuldade (fácil, médio, difícil)
- potential: Potencial de impacto (baixo, médio, alto)
- tags: Palavras-chave associadas
- createdAt: Data de criação
- isFavorite: Indicador de ideia favorita
- isGenerated: Indicador de ideia gerada por IA

## 3. Comparação de Funcionalidades

A nova implementação oferece uma abordagem mais focada e intuitiva em relação à implementação atual:

**Geração de Ideias:**
- Atual: Modal com formulário avançado e múltiplos campos
- Nova: Modal com formulário simplificado e contexto direto

**Visualização de Ideias:**
- Atual: Aba "Recentes" com detalhes técnicos
- Nova: Abas separadas para "Todas" e "Favoritas" com foco na usabilidade

**Favoritos:**
- Atual: Sistema básico de marcação
- Nova: Sistema aprimorado com destaque visual

**Categorias:**
- Atual: Baseado em tipo de conteúdo (headlines, email, social media)
- Nova: Baseado em contexto de marketing (campanha, conteúdo, estratégia)

**Filtros:**
- Atual: Por categoria e tendências
- Nova: Por categoria e indústria

**Estatísticas:**
- Atual: Painel de métricas detalhado
- Nova: Removido para focar na geração e uso de ideias

## 4. Componentes a Serem Migrados

### 4.1 Página Principal (AIIdeas.tsx)

Os principais componentes a serem migrados incluem:
- Sistema de abas com três seções principais (Gerador, Todas as Ideias, Favoritas)
- Interface de exibição de ideias com cards informativos
- Sistema de favoritos com marcação visual
- Filtros por categoria e indústria

Componentes que serão removidos:
- Painel de estatísticas detalhadas
- Abas adicionais de tendências, categorias e insights
- Integração direta com serviço de ideias da IA (será substituída)

### 4.2 Modal de Geração (GerarIdeiaModal.tsx)

O modal de geração será completamente substituído por uma versão mais simplificada:
- Formulário de geração com campos de contexto essenciais
- Exibição de ideias geradas com informações relevantes
- Sistema de cópia e salvamento de ideias individualmente

Funcionalidades a serem mantidas:
- Validação de campos obrigatórios
- Feedback visual durante o processo de geração
- Sistema de notificações para interações do usuário

## 5. Plano de Migração

### 5.1 Fase 1: Preparação

A primeira fase envolve a preparação do ambiente para a migração:
1. Realizar backup completo dos arquivos atuais
2. Identificar todas as dependências e integrações existentes
3. Mapear hooks, serviços e componentes compartilhados

### 5.2 Fase 2: Implementação

A fase de implementação consiste na substituição dos componentes:
1. Substituir a página principal AIIdeas.tsx pela nova implementação
2. Substituir o modal GenerateIdeasModal.tsx pelo GerarIdeiaModal.tsx
3. Ajustar imports, estilos e componentes UI para manter consistência

### 5.3 Fase 3: Integração

A fase de integração foca em conectar a nova interface com os serviços existentes:
1. Substituir mock data por chamadas reais ao serviço aiIdeasService
2. Manter a estrutura de salvamento de ideias e navegação para o composer
3. Atualizar rotas e referências conforme necessário

### 5.4 Fase 4: Testes

A fase final envolve testes completos da nova implementação:
1. Testes funcionais de todas as features implementadas
2. Testes de UI/UX em diferentes dispositivos e tamanhos de tela
3. Validação de acessibilidade e experiência do usuário

## 6. Considerações Técnicas

### 6.1 Diferenças de Dados

A nova implementação usa uma estrutura de dados mais simplificada. É necessário mapear os campos da implementação atual para a nova estrutura:

- category → category (conversão direta)
- confidence → N/A (remover)
- content → description (usar primeiro item do array)
- topic → title/context (usar como título ou contexto)
- audience → target (mapear para target)
- keywords → tags (converter para array)
- trends → tags (adicionar como tags adicionais)

### 6.2 Integração com Serviços

A nova implementação inicialmente usa mock data. Para integração completa, será necessário:

1. Substituir `mockIdeas` por chamada ao `aiIdeasService.fetchIdeas()`
2. Adaptar o serviço para retornar dados no novo formato
3. Manter funcionalidades de salvamento e navegação

### 6.3 Componentes UI

A nova implementação usa os mesmos componentes do Shadcn/UI, mas com diferenças visuais:

- Novos ícones do Lucide React
- Estrutura de abas redesenhada
- Cards com design mais moderno e focado no usuário

## 7. Diagrama de Fluxo

O fluxo de interação do usuário com a nova implementação:

1. Usuário acessa a página de Ideias IA
2. Página carrega ideias existentes do banco de dados
3. Exibe ideias em abas: Gerador, Todas, Favoritas
4. Usuário pode clicar em "Gerar Ideias" para abrir o modal
5. No modal, preenche o formulário de contexto
6. Clica em "Gerar Ideias IA" para iniciar o processo
7. Sistema simula a geração de ideias com feedback visual
8. Exibe as ideias geradas para revisão
9. Usuário pode copiar, salvar ou usar diretamente uma ideia
10. A ideia é salva no banco ou enviada para o composer

## 8. Riscos e Mitigações

### 8.1 Riscos Identificados

Os principais riscos identificados incluem:
1. Perda de funcionalidades existentes como o painel de estatísticas
2. Incompatibilidade de dados devido à estrutura diferente
3. Problemas de estilo com a integração ao tema atual
4. Necessidade de ajustes na responsividade

### 8.2 Estratégias de Mitigação

Para mitigar esses riscos:
1. Realizar backup completo antes de qualquer alteração
2. Executar testes progressivos em ambiente de desenvolvimento
3. Manter funcionalidades críticas como salvar e usar ideias
4. Validar com usuários reais antes do deploy em produção

## 9. Próximos Passos

O processo de migração seguirá estas etapas:
1. Criar branch de feature dedicada para a migração
2. Implementar a nova página e modal com base no spark-copy-fast-67
3. Realizar testes locais abrangentes
4. Validar com stakeholders e usuários
5. Preparar para deploy em ambiente de staging
6. Monitorar desempenho e feedback após o deploy em produção