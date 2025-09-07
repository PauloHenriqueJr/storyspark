# Roadmap para o FloatingAIAssistant (antigo FloatingCopyButton)

## Visão Geral
O FloatingAIAssistant é um botão flutuante versátil que aparece em páginas específicas do StorySpark para auxiliar na geração de copies contextuais com IA, upload de documentos para análise automática e outras funcionalidades inteligentes. Ele foi renomeado de FloatingCopyButton para refletir sua funcionalidade expandida além de apenas gerar copies.

## Páginas onde o Botão Aparece
Baseado na revisão, o botão aparece nas seguintes páginas para fornecer suporte contextual:
- `/composer` (Composer.tsx): Criação de copy principal.
- `/campaigns` (Campaigns.tsx): Copies para campanhas.
- `/email-marketing` (EmailMarketing.tsx): Copies para emails.
- `/social-scheduler` (SocialScheduler.tsx): Posts agendados.
- `/templates` (Templates.tsx): Baseado em templates.
- `/landing-pages` (LandingPages.tsx): Copies para landing pages.
- `/funnels` (Funnels.tsx): Copies para funis.
- `/ai-ideas` (AIIdeas.tsx): Desenvolver ideias em copies.
- `/trending-hooks` (TrendingHooks.tsx): Usar hooks virais.
- `/hooks` (Hooks.tsx): Gerar com hooks.
- `/personas` (Personas.tsx): Copies direcionadas a personas.
- `/brand-voices` (BrandVoices.tsx): Usando brand voice.
- `/voices` (Voices.tsx): Com voice personalizada.
- `/calendar` (Calendar.tsx): Copies para eventos.
- `/call-scripts` (CallScripts.tsx): Scripts de ligação.
- `/push-whatsapp` (PushWhatsApp.tsx): Mensagens WhatsApp.
- `/crm` (CRM.tsx): Copies para relacionamento com clientes.
- `/feedback` (Feedback.tsx): Solicitar/responder feedback.
- `/content-library` (ContentLibrary.tsx): Organizar/promover conteúdo.
- `/blog` (Blog.tsx) e `/blog-post` (BlogPost.tsx): Copies para blog.
- `/dashboard` (Dashboard.tsx): Copies rápidas.
- `/analytics` (Analytics.tsx): Baseado em dados.
- `/modern-composer-wrapper` (ModernComposerWrapper.tsx): Composição moderna.

**Páginas Excluídas:** Admin, auth, billing, settings, team, integrations, not-found, landing-waitlist, test pages.

A lógica de rendering condicional usa `useLocation().pathname` com listas `allowedPaths` e `excludedPaths` no componente [`FloatingAIAssistant.tsx`](src/components/floating/FloatingAIAssistant.tsx:208-258).

## Funcionalidades Principais
1. **Geração de Copy Contextual:** Abre modal com briefing auto-configurado baseado na página, seleciona plataforma/tipo, gera copy com IA e copia para clipboard. Redireciona para composer ou página relevante.
2. **Upload de Documentos com IA:** Botão dedicado no modal para upload de PDFs/DOCX/TXT. A IA (via Gemini) extrai brand voices, personas, company info e marketing data, salvando automaticamente no Supabase via Edge Function `document-analyzer`.
3. **Seletores Contextuais:** Para páginas como calendar (selecionar eventos), personas/brand-voices (selecionar itens), aplica contexto ao briefing.
4. **Design e Efeitos:** Botão animado com hover effects, tooltip, glow, pulse. Mantém o visual moderno e responsivo.

## Implementação Técnica
- **Componente Principal:** [`FloatingAIAssistant.tsx`](src/components/floating/FloatingAIAssistant.tsx) - Lógica de rendering, modal, handlers.
- **Upload Modal:** [`DocumentUploadModal.tsx`](src/components/upload/DocumentUploadModal.tsx) - Dropzone para arquivos, progresso simulado/atual, preview de dados extraídos.
- **Service:** [`documentProcessingService.ts`](src/services/documentProcessingService.ts) - Upload para storage ('document-uploads'), chama Edge Function, parseia e valida dados, fallback para mock se falhar.
- **Edge Function:** `document-analyzer` (supabase/functions) - Baixa arquivo do storage, chama Gemini API para extração JSON, insere em tables (brand_voices, personas, user_profiles), retorna dados.
- **Configs Modulares:** Arquivos em `./configs/` para contextos por página (social, personas, etc.).
- **Integração IA:** Usa Gemini para análise estruturada; env vars: GEMINI_API_KEY, SUPABASE_URL/SERVICE_ROLE_KEY.

## Fluxo de Upload e Processamento
1. Usuário clica "Upload com IA" no modal do FloatingAIAssistant.
2. Abre DocumentUploadModal com dropzone.
3. Arquivo(s) selecionado(s), valida tipo/tamanho (PDF/TXT/DOCX ≤10MB).
4. Chama `documentProcessingService.processDocument`: Upload para storage, cria job em 'ai_processing_jobs', extrai texto, chama Edge Function.
5. Edge Function: Download, prompt Gemini, parse JSON, insere no DB (workspaces/user_id), retorna dados.
6. Modal mostra preview (brand voice, personas, etc.), botão "Aplicar" chama onDataExtracted para integrar (ex: toast success, atualizar hooks).
7. Histórico em 'ai_processing_jobs', opção para deletar.

## Melhorias Futuras
- Suporte a múltiplos arquivos simultâneos.
- Progresso real via Supabase Realtime (subscriptions no job status).
- Integração com mais tables (campaigns, templates auto-gerados de extracted data).
- UI para editar dados extraídos antes de salvar.
- Análise de imagens (OCR para PDFs escaneados).
- Métricas de qualidade da extração (confiança da IA).

## Testes e Verificação
- Local: `npm run dev`, navegue para `/composer`, abra botão, upload arquivo de teste, verifique DB (brand_voices, personas).
- Edge Function: Logs no Supabase dashboard; teste com curl ou Postman para invoke.
- Erros: Fallback mock se Gemini falhar; validações em service.

Implementado com sucesso, mantendo efeitos visuais e expandindo para diferencial competitivo.