# Plano de Testes Frontend - StorySpark

## 1. Introdução
Este plano de testes manual é baseado no Product Requirements Document (PRD) da aplicação StorySpark. O foco é validar o frontend completo (100% implementado), incluindo navegação, componentes, modais e interações. Como o TestSprite não está disponível devido a problemas de conexão MCP, este plano pode ser executado manualmente ou com ferramentas como Playwright (já configurado no projeto via `npm run e2e`).

### Objetivos
- Verificar funcionalidade de todas as páginas e features principais.
- Testar responsividade, acessibilidade e performance.
- Simular login (needLogin: true) para rotas protegidas.
- Identificar bugs em interações, roteamento e UI.

### Escopo
- **Incluído**: Testes smoke, funcionais, UI/UX para core features (Composer, Personas, etc.), PWA, modals, admin panel.
- **Excluído**: Testes backend/IA reais (mockados); testes de segurança avançados.
- **Ambiente**: Local dev server (http://localhost:8081), browser Chrome/Firefox, mobile emulation.
- **Ferramentas**: Browser DevTools, Playwright (`npm run e2e`), Lighthouse para performance.

### Pré-requisitos
- Servidor rodando: `npm run dev` (porta 8081).
- Login simulado como user/admin (use componentes debug como AuthLoginHelper se necessário).
- Limpar cache e cookies antes de cada teste.

## 2. Testes Gerais (Smoke Tests)
Execute estes testes primeiro para validar setup básico.

1. **Acesso à Aplicação**
   - Acesse http://localhost:8081.
   - Verifique loading inicial < 2s, sem erros console.
   - Teste navegação para landing page, blog e /auth.

2. **Roteamento e Navegação**
   - Teste todos os links no header/footer/sidebar.
   - Verifique protected routes redirecionam para login se não autenticado.
   - Teste 404 page em rotas inválidas.

3. **Temas e Responsividade**
   - Alternar light/dark mode (ThemeToggle).
   - Teste em desktop (1024px+), tablet (768px), mobile (320px) via DevTools.
   - Verifique PWA prompt e instalação (se offline, cache funciona).

4. **Acessibilidade**
   - Use screen reader (NVDA/VoiceOver) para navegar.
   - Teste keyboard navigation (Tab, Enter, Arrow keys).
   - Verifique alt texts em imagens, ARIA labels em componentes.

5. **Performance**
   - Rode Lighthouse: Score > 90 para Performance, Accessibility, Best Practices.
   - Verifique lazy loading em listas/gráficos (sem blocking).

## 3. Testes Funcionais por Feature (Baseado no PRD)
Teste cada core feature com login como user (para app) e admin (para panel). Use modals e interações.

### 3.1 Composer (Editor de IA)
- Acesse /composer (login required).
- Crie nova copy: Selecione persona/voice, insira prompt, gere preview.
- Teste export para plataformas (Instagram, LinkedIn).
- Verifique histórico de versões e salvamento auto.
- Edge cases: Prompt vazio, erro de IA mock, mobile input.

### 3.2 Sistema de Personas
- Acesse /personas.
- Crie/editar persona via CreatePersonaModal (campos: nome, idade, dores, canais).
- Associe a campanha/composer.
- Teste templates por segmento, análise de tom.
- Edge cases: Duplicata, campos obrigatórios, delete com confirmação.

### 3.3 Brand Voices
- Acesse /brand-voices.
- Crie voice via CreateBrandVoiceModal (abas: tom, exemplos).
- Teste VoiceTesterModal com feedback real-time.
- Verifique métricas de uso (progress bars).
- Edge cases: Múltiplas voices ativas, versionamento.

### 3.4 Campanhas
- Acesse /campaigns.
- Crie campanha via CreateCampaignModal (orçamento, status, objetivos).
- Liste/filtre campanhas, clone/editar/delete.
- Associe copies/calendário, ver métricas (CTR, ROI).
- Edge cases: Status pausada, orçamento zero.

### 3.5 Calendário Editorial
- Acesse /calendar.
- Crie evento via CreateEventModal, drag & drop para reagendar.
- Mude views (mês/semana/dia), filtre por plataforma.
- Integre com campanhas, ver lembretes.
- Edge cases: Conflitos de data, eventos recorrentes.

### 3.6 Analytics
- Acesse /analytics (login required).
- Aplique filtros (data, campanha), interaja com gráficos (drill-down).
- Compare períodos via ComparePeriodModal, export relatório.
- Verifique métricas cross-platform.
- Edge cases: Sem dados, período inválido.

### 3.7 Templates
- Acesse /templates.
- Busque/filtre por abas, preview template.
- Edite via CreateTemplateModal, adicione tags/variáveis.
- Marque favoritos, compartilhe via ShareTemplateModal.
- Edge cases: Template vazio, importação.

### 3.8 Integrações
- Acesse /integrations.
- Conecte OAuth via ConnectIntegrationModal (ex: Facebook).
- Teste conexão, configure automações.
- Ver logs de sync, webhooks.
- Edge cases: Erro de auth, desconectar.

### 3.9 Equipe e Faturamento
- Acesse /team: Convide membro via InviteMemberModal, defina roles.
- Acesse /billing: Mude plano via ChangePlanModal, use UsageCalculatorModal.
- Ver histórico pagamentos, alertas de limite.
- Edge cases: Permissões insuficientes, plano expirado.

### 3.10 Admin Panel
- Login como admin: Acesse /admin.
- Gerencie users/campaigns/templates, ver analytics globais.
- Configure settings/security/logs.
- Edge cases: Role super_admin vs manager.

### 3.11 Features Especializadas
- Teste brevemente: ABTests, AI Ideas, CRM, Email Marketing, etc. (verifique navegação e modals básicos).

## 4. Testes de Integração
- Fluxo completo: Login → Dashboard → Crie persona → Composer → Export campanha → Analytics.
- Verifique toasts/notificações em todas ações.
- Teste offline mode (PWA): Carregue página, desconecte internet, navegue.

## 5. Testes de UI/UX
- Micro-interações: Hover, animações Framer Motion.
- Empty states, loading skeletons.
- Form validation (Zod): Campos inválidos.
- Mobile gestures: Swipe em calendário, touch em modals.

## 6. Execução e Relatório
- **Duração Estimada**: 4-6 horas (manual).
- **Responsável**: Desenvolvedor/QA.
- **Relatório**: Registre bugs em issues GitHub, screenshot erros.
- **Automação**: Rode `npm run e2e` para E2E básicos, adicione testes Playwright para features críticas.
- **Critérios de Passagem**: 95% features sem bugs críticos, performance > 90 Lighthouse.

**Data**: Setembro 2025  
**Versão**: 1.0