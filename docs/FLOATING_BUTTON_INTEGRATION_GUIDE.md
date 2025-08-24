# 📝 Guia de Integração e Próximos Passos: Botão Flutuante de IA

## Visão Geral

Este documento detalha a arquitetura atual do Botão Flutuante de IA e fornece um guia para futuras integrações em outras páginas da plataforma.

A funcionalidade foi refatorada para ser modular, escalável e contextualmente inteligente, permitindo que as páginas forneçam um "briefing contextual" detalhado para a IA, melhorando drasticamente a relevância da copy gerada.

---

## 🏛️ Arquitetura Atual

A arquitetura é baseada em um **Contexto React global** (`FloatingButtonContext`) que gerencia o estado e as ações do botão flutuante.

### Componentes Principais:

1.  **`FloatingButtonContext.tsx`**:
    *   **`FloatingButtonProvider`**: Provedor global que envolve toda a aplicação (localizado em `AppWrapper.tsx`). Ele gerencia o estado de abertura do modal e o `contextualBriefing`.
    *   **`useFloatingButton()`**: Hook que dá acesso ao estado (`isModalOpen`, `contextualBriefing`) e às funções do contexto (`openModal`, `closeModal`).

2.  **`FloatingCopyButton.tsx`**:
    *   O componente do botão em si. Ele é renderizado uma vez no `AppLayout.tsx`.
    *   Seu estado de "aberto/fechado" é totalmente controlado pelo `FloatingButtonContext`.
    *   Pode ser aberto de duas formas:
        1.  **Pelo usuário (Genérico)**: Clicando no próprio botão. Isso abre o modal para uma solicitação de copy geral.
        2.  **Programaticamente (Contextual)**: Outros componentes podem chamar a função `openModal(contextualBriefing)` do contexto. Isso permite que uma página ou componente específico (como um card de Brand Voice) abra o modal já com um briefing detalhado e pré-preenchido.
    *   O modal agora exibe o `contextualBriefing` (se houver) em uma área separada, e o input do usuário é anexado a ele antes de ser enviado para a IA.

3.  **Páginas com Integração Profunda (`BrandVoices.tsx`, `Templates.tsx`)**:
    *   Essas páginas contêm botões específicos ("Usar para Criar Copy", "Usar com IA").
    *   Esses botões usam o hook `useFloatingButton()` para obter a função `openModal`.
    *   Ao serem clicados, eles formatam um prompt detalhado com base no item selecionado (a voz da marca ou o template) e o passam para `openModal(promptDetalhado)`, iniciando um fluxo de geração de copy altamente contextual.

---

## 🚀 Próximas Ações e Tarefas Detalhadas

A arquitetura atual é robusta. A prioridade agora é expandir a **integração profunda** para outras áreas da plataforma para maximizar o valor para o usuário.

### Tarefa 1: Integração Profunda - Análise de Dados (Analytics)

-   **Objetivo**: Permitir que o usuário gere uma análise textual ou um resumo de um gráfico/conjunto de dados específico usando o botão flutuante.
-   **Nível**: Integração Profunda (Avançada).
-   **Passos**:
    1.  **Identificar Contexto na Página de Analytics**: Determinar qual é o "contexto" selecionado. Pode ser um período de tempo, um gráfico específico em foco, ou uma tabela de dados.
    2.  **Adicionar Trigger de IA**: Adicionar um ícone/botão de "Analisar com IA" (`<Wand2 />`) próximo aos gráficos ou tabelas relevantes.
    3.  **Implementar o Handler**: A função `onClick` desse botão deve:
        *   Coletar os dados relevantes do gráfico/tabela (ex: `{ "período": "Últimos 7 dias", "métrica": "Taxa de Engajamento", "dados": [1, 2, 3, 5, 4, 6, 8] }`).
        *   Formatar esses dados em um prompt claro para a IA. Ex: `"Baseado nos seguintes dados de Taxa de Engajamento para os últimos 7 dias, gere um resumo com insights e sugestões de melhoria. Dados: ..."`.
        *   Chamar a função `openModal(promptFormatado)` do hook `useFloatingButton`.
    4.  **Testar**: Verificar se o modal do botão flutuante abre com o contexto do gráfico e se a IA consegue gerar uma análise relevante a partir dos dados estruturados.

### Tarefa 2: Integração Profunda - Upload de Documentos de Onboarding

-   **Objetivo**: Implementar a funcionalidade solicitada de permitir que o usuário faça upload de um documento (PDF) que servirá como base de conhecimento para toda a IA da plataforma.
-   **Nível**: Integração Profunda (Estratégica).
-   **Passos**:
    1.  **Criar Interface de Upload**: Desenvolver uma nova página ou seção (ex: em Configurações) onde o usuário pode fazer o upload de um arquivo PDF.
    2.  **Desenvolver o Backend/Serviço**:
        *   Criar um serviço para processar o PDF. Isso envolve extrair o texto do documento.
        *   Analisar o texto extraído para identificar seções relevantes (Voz da Marca, Persona, Sobre a Empresa, etc.). Isso pode ser feito com uma chamada de IA para "resumir e estruturar".
        *   Salvar os dados estruturados no banco de dados, associados ao workspace do usuário.
    3.  **Integrar com as Páginas**: Modificar as páginas (`BrandVoices`, `Personas`) para que elas primeiro verifiquem se já existem dados pré-preenchidos a partir de um documento importado e os exibam.
    4.  **Integrar com o Botão Flutuante**: O `contextualBriefing` pode ser enriquecido com essa base de conhecimento global do workspace para gerar copies ainda mais precisas.

### Tarefa 3: Melhorar a Flexibilidade do Redirecionamento

-   **Objetivo**: Dar ao usuário a opção de para onde levar a copy gerada.
-   **Nível**: Melhoria de UX.
-   **Passos**:
    1.  **Analisar o `FloatingCopyButton.tsx`**: A lógica atual redireciona para o Composer por padrão.
    2.  **Adicionar Opções**: No modal, após a copy ser gerada, além de "Levar para Composer", adicionar outras opções contextuais. Por exemplo:
        *   "Agendar no Calendário"
        *   "Criar Campanha com esta Copy"
    3.  **Implementar Ações**: Cada um desses novos botões chamaria a respectiva função de abrir modal (`openCalendarModalWithContent`, `openCampaignModalWithContent`) que seriam registradas no contexto global, similar à arquitetura anterior, mas de uma forma mais centralizada. Isso exigiria uma pequena refatoração no `FloatingButtonContext` para reintroduzir o registro de ações.

---

## ✅ Checklist de Implementação para Novas Integrações

-   [ ] **Definir o Objetivo**: Qual é a tarefa que o usuário quer facilitar com a IA nesta página?
-   [ ] **Identificar o Ponto de Entrada**: O usuário vai clicar no botão flutuante global ou em um botão de ação específico em um card/item?
-   [ ] **Criar a Função Handler**: Implementar a lógica que coleta o contexto da página/item.
-   [ ] **Formatar o `contextualBriefing`**: Criar um prompt claro e detalhado para a IA.
-   [ ] **Chamar `openModal`**: Usar o hook `useFloatingButton` para chamar `openModal(briefing)` e abrir a interface.
-   [ ] **Testar o Fluxo Completo**: Garantir que a experiência do usuário seja fluida, intuitiva e que o resultado da IA seja de alta qualidade.
-   [ ] **Atualizar esta Documentação**: Adicionar a nova integração à lista de funcionalidades implementadas.
