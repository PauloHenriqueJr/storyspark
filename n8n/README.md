Workflows n8n do StorySpark

Visão geral
- Esta pasta traz templates de workflows n8n prontos para importar, alinhados aos recursos do StorySpark: waitlist, fila de e-mails, onboarding, processamento de documentos com IA e agendamento de redes sociais.
- Importe, configure as credenciais e conecte ao seu projeto Supabase e APIs externas.

Conteúdo
- 01-waitlist-signup.json: captura/enriquecimento de novas inscrições e envio de confirmação.
- 02-email-queue-processor.json: busca e processa e-mails pendentes em `email_queue` via Função Edge.
- 03-user-onboarding.json: provisionamento pós-signup (workspace, templates, cliente no Stripe).
- 04-document-ai-processing.json: orquestra ingestão de documentos e extração com IA.
- 05-social-media-scheduler.json: publica posts agendados e registra resultados.
- config/credentials-template.json: nomes/formatos de credenciais para criar no n8n.
- config/environment-variables.md: variáveis de ambiente exigidas (referenciadas nos nós).
- config/deployment-guide.md: como subir, importar e proteger os workflows.

Pré-requisitos
- Instância n8n (>= 1.60). Configure `N8N_ENCRYPTION_KEY` e URL base.
- Projeto Supabase com a migration `supabase/migrations/20250903_workflows_tables.sql` aplicada.
- Função Edge `send-email` implantada (ver `supabase/functions/send-email/index.ts`).

Guia Rápido
1) Abra o n8n > Importar workflow > selecione um arquivo `0X-*.json`.
2) Crie credenciais conforme `config/credentials-template.json` (mesmos nomes).
3) Defina no host do n8n as variáveis listadas em `config/environment-variables.md`.
4) Abra cada workflow, ajuste placeholders se preciso e rode com Disparo Manual para validar.
5) Ative cron/webhook quando validado.

Quando usar cada workflow
- 01 Waitlist: quando um e-mail entra em `waitlist_signups` e você quer confirmar, enriquecer e mandar e-mail de boas‑vindas.
- 02 Email Queue: quando sua aplicação insere e-mails transacionais em `email_queue` e você quer processá-los de forma confiável com retentativas.
- 03 Onboarding: ao finalizar o cadastro (AuthCallback), notifique via webhook para criar workspace, cliente no Stripe e seeds iniciais.
- 04 Documentos + IA: após upload no Storage, crie um job em `document_jobs` e deixe o n8n extrair dados (voz de marca, personas, etc.) e marcar conclusão.
- 05 Social Scheduler: grave posts em `scheduled_posts` com `status='scheduled'` e `scheduled_for`; o n8n publica no horário e marca como `published`.

Notas
- Os nós HTTP usam expressões `{{$env.*}}` para ler segredos do ambiente do n8n.
- Para operações privilegiadas, use a Service Role Key do Supabase apenas no n8n (nunca no frontend).
- Após importar, selecione as credenciais ausentes em cada nó antes de ativar.
