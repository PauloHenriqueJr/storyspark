StorySpark n8n Workflows

Overview
- This folder ships importable n8n workflow templates aligned with StorySpark features: waitlist, email queue, onboarding, document AI processing, and social scheduling.
- Use them as starting points: import into your n8n instance, set credentials, and wire to your Supabase project and third-party APIs.

Contents
- 01-waitlist-signup.json: Captures/enriches new signups and sends confirmation.
- 02-email-queue-processor.json: Polls and processes pending emails in email_queue via Edge Function.
- 03-user-onboarding.json: Post-signup provisioning (workspace, templates, Stripe customer).
- 04-document-ai-processing.json: Orchestrates document ingestion and AI extraction.
- 05-social-media-scheduler.json: Publishes scheduled posts and records results.
- config/credentials-template.json: Credential names and fields to create in n8n.
- config/environment-variables.md: Required env vars referenced by expressions in nodes.
- config/deployment-guide.md: How to deploy, secure, and import workflows.

Prerequisites
- n8n instance (>= 1.60). Configure N8N_ENCRYPTION_KEY and base URL.
- Supabase project with the migration in supabase/migrations/20250903_workflows_tables.sql applied.
- Edge Function send-email deployed (see supabase/functions/send-email/index.ts in repo root).

Quick Start
1) Open n8n > Import workflow > select any 0X-*.json.
2) Create credentials matching names in config/credentials-template.json.
3) Set environment variables listed in config/environment-variables.md on the n8n host.
4) Open each workflow and replace placeholders if needed; run with Manual Trigger to validate.
5) Activate schedules/webhooks once verified.

Notes
- Workflows use HTTP Request nodes with expressions referencing $env.* for Supabase URL/keys and third-party tokens.
- If you prefer native credentials, bind them in node Authentication instead of headers; keep the same credential names.
- Avoid calling Supabase with anon key for privileged operations. Use a restricted service key on the server side only (in n8n).

