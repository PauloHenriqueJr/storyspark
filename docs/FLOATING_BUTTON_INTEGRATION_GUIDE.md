# 📝 Guia de Integração e Próximos Passos: Botão Flutuante de IA

## Visão Geral

Este documento detalha a arquitetura atual do Botão Flutuante de IA e fornece um guia para futuras integrações em outras páginas da plataforma.

A funcionalidade foi refatorada para ser modular, escalável e contextualmente inteligente, permitindo integrações "rasas" (abrir um modal com texto) e "profundas" (usar o contexto da página para enriquecer o prompt da IA).

---

## 🏛️ Arquitetura Atual

A arquitetura é baseada em um **Contexto React global** (`FloatingButtonContext`) que gerencia o estado e as ações do botão flutuante.

### Componentes Principais:

1.  **`FloatingButtonContext.tsx`**:
    *   **`FloatingButtonProvider`**: Provedor global que deve envolver toda a aplicação (atualmente em `AppWrapper.tsx`). Ele gerencia o estado de abertura do modal e o "briefing contextual".
    *   **`useFloatingButton()`**: Hook que dá acesso ao estado e às funções do contexto, como `openModal(briefing)`.
    *   **`useRegisterFloatingButtonAction()`**: Hook que permite que páginas específicas registrem uma ação a ser executada quando a copy é gerada no modal do botão. (Atualmente não utilizado na nova arquitetura, mas mantido para possíveis casos de uso).

2.  **`FloatingCopyButton.tsx`**:
    *   O componente em si. Ele é renderizado uma vez no `AppLayout.tsx`.
    *   Seu estado de "aberto/fechado" é controlado pelo `FloatingButtonContext`.
    *   Ele pode ser aberto de duas formas:
        1.  **Pelo usuário**: Clicando no próprio botão.
        2.  **Programaticamente**: Chamando a função `openModal()` do contexto, o que permite que outras partes da aplicação (como um botão "Usar com IA" em um card) abram o modal.
    *   Ele pode receber um **briefing contextual**, que é um texto pré-preenchido que serve de base para a IA.

3.  **Páginas com Integração**:
    *   Páginas como `BrandVoices.tsx` e `Templates.tsx` agora contêm botões específicos ("Usar para Criar Copy", "Usar com IA").
    *   Esses botões chamam a função `openModal(contextualBriefing)` do hook `useFloatingButton`, passando um prompt detalhado e formatado com base no item selecionado (a voz da marca ou o template).

---

## 🚀 Próximas Ações e Tarefas Detalhadas

Aqui estão as próximas páginas a serem integradas e o nível de integração recomendado para cada uma.

### Tarefa 1: Integração Rasa - Página de E-mail Marketing

-   **Objetivo**: Ao clicar no botão flutuante na página de E-mail Marketing, a copy gerada deve abrir o modal de criação de e-mail com o conteúdo pré-preenchido.
-   **Nível**: Integração Rasa.
-   **Passos**:
    1.  **Modificar `CreateEmailCampaignModal.tsx`**: Adicionar uma prop `initialContent` para receber o texto da copy. Usar essa prop para definir o estado inicial do campo de texto principal do e-mail.
    2.  **Modificar `EmailMarketing.tsx`**:
        *   Importar o hook `useRegisterFloatingButtonAction`.
        *   Adicionar um state para controlar a abertura do modal de criação e para guardar o conteúdo inicial (`const [modalContent, setModalContent] = useState('')`).
        *   Criar uma função `handleOpenEmailModalWithContent(content: string)` que atualiza o estado e abre o modal.
        *   Usar o hook `useRegisterFloatingButtonAction` para registrar a função `handleOpenEmailModalWithContent` para o path `/email-marketing`.
    3.  **Testar**: Navegar para a página de E-mail Marketing, usar o botão flutuante e verificar se, após gerar a copy, o modal de criação de e-mail abre com o texto correto.

### Tarefa 2: Integração Rasa - Página de Social Media / Agendamento

-   **Objetivo**: Similar ao Calendário, permitir que a copy gerada abra o modal de agendamento de post.
-   **Nível**: Integração Rasa.
-   **Passos**:
    1.  **Analisar `SocialScheduler.tsx`**: Verificar qual modal é usado para criar um novo post. Provavelmente é o mesmo `CreateEventModal` usado pelo Calendário.
    2.  **Modificar `SocialScheduler.tsx`**:
        *   Se o modal for diferente, aplicar a mesma lógica da Tarefa 1 (adicionar prop `initialContent`).
        *   Se o modal for o mesmo, a lógica será idêntica à do `Calendar.tsx`.
        *   Importar `useRegisterFloatingButtonAction` e registrar a ação de abrir o modal de agendamento com o conteúdo para o path `/social-scheduler`.

### Tarefa 3: Integração Profunda - Análise de Dados (Analytics)

-   **Objetivo**: Permitir que o usuário gere uma análise ou resumo de um gráfico ou conjunto de dados específico usando o botão flutuante.
-   **Nível**: Integração Profunda (Avançada).
-   **Passos**:
    1.  **Identificar Contexto**: Na página de `Analytics.tsx`, determinar qual é o "contexto" selecionado. Pode ser um período de tempo, um gráfico específico que está em foco, ou uma tabela de dados.
    2.  **Adicionar Trigger**: Adicionar um ícone de "Analisar com IA" (`<Wand2 />`) próximo aos gráficos ou tabelas.
    3.  **Criar Handler**: A função `onClick` desse ícone deve:
        *   Coletar os dados relevantes (ex: `{ "período": "Últimos 7 dias", "métrica": "Taxa de Engajamento", "dados": [1, 2, 3] }`).
        *   Formatar esses dados em um prompt claro para a IA. Ex: `"Baseado nos seguintes dados de Taxa de Engajamento para os últimos 7 dias, gere um resumo com insights e sugestões de melhoria. Dados: ..."`.
        *   Chamar a função `openModal(promptFormatado)` do `useFloatingButton`.
    4.  **Testar**: Verificar se o modal abre com o contexto do gráfico e se a IA consegue gerar uma análise relevante.

---

## ✅ Checklist de Implementação para Novas Integrações

Para cada nova página a ser integrada, siga estes passos:

-   [ ] **Definir o Nível de Integração**: É uma integração "rasa" (apenas passar texto) ou "profunda" (passar dados estruturados)?
-   [ ] **Identificar o Ponto de Entrada**: O usuário vai clicar no botão flutuante global ou em um botão específico na página (como em Brand Voices)?
-   [ ] **Criar a Função Handler**: Implementar a lógica que coleta o contexto e chama `openModal` ou `useRegisterFloatingButtonAction`.
-   [ ] **Modificar o Componente do Modal (se necessário)**: Garantir que o modal de destino (ex: `CreatePostModal`) possa aceitar o conteúdo inicial.
-   [ ] **Testar o Fluxo Completo**: Garantir que a experiência do usuário seja fluida e intuitiva.
-   [ ] **Atualizar esta Documentação**: Adicionar a nova integração à lista de funcionalidades implementadas.
