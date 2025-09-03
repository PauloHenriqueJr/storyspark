Deployment Guide

Local (Docker)
- Run an n8n container:
  docker run -it --rm \
    -p 5678:5678 \
    -e N8N_ENCRYPTION_KEY="your-strong-key" \
    -e N8N_HOST="localhost" \
    -e N8N_PORT=5678 \
    -e N8N_PROTOCOL=http \
    -e SUPABASE_URL="https://...supabase.co" \
    -e SUPABASE_SERVICE_ROLE_KEY="..." \
    -e RESEND_API_KEY="..." \
    -e OPENAI_API_KEY="..." \
    -e SLACK_WEBHOOK_URL="..." \
    n8n

Importing Workflows
- In the n8n UI: Workflows > Import from File > select files under n8n/0X-*.json.
- Create credentials based on n8n/config/credentials-template.json and set correct values.
- Open each workflow, check nodes, and test with Manual Trigger before activating.

Production
- Host n8n behind HTTPS (reverse proxy) and secure with basic auth or OAuth.
- Set N8N_ENCRYPTION_KEY and secrets as environment variables.
- Configure Webhook URLs for workflows that expose webhooks.

Supabase Integration
- Apply repo migrations (supabase/migrations/*) with Supabase CLI.
- Deploy Edge Function send-email (already present in supabase/functions/send-email/index.ts). In Supabase Dashboard > Functions > Deploy.

Operations
- Set alerts (Slack/Telegram) for failed nodes and error thresholds.
- Prefer idempotency (use record IDs; mark processed_at) in polling flows.

