Guia de Deploy

Local (Docker)
- Suba um container n8n:
  docker run -it --rm \
    -p 5678:5678 \
    -e N8N_ENCRYPTION_KEY="sua-chave-forte" \
    -e N8N_HOST="localhost" \
    -e N8N_PORT=5678 \
    -e N8N_PROTOCOL=http \
    -e SUPABASE_URL="https://...supabase.co" \
    -e SUPABASE_SERVICE_ROLE_KEY="..." \
    -e RESEND_API_KEY="..." \
    -e OPENAI_API_KEY="..." \
    -e SLACK_WEBHOOK_URL="..." \
    n8n

Importando Workflows
- Na UI do n8n: Workflows > Import from File > selecione arquivos em n8n/0X-*.json.
- Crie credenciais conforme n8n/config/credentials-template.json e preencha com seus valores.
- Abra cada workflow, revise os nós e teste com Disparo Manual antes de ativar.

Produção
- Publique o n8n atrás de HTTPS (reverse proxy) e proteja com basic auth ou OAuth.
- Defina N8N_ENCRYPTION_KEY e segredos como variáveis de ambiente.
- Configure URLs públicas para webhooks dos workflows.

Integração Supabase
- Aplique as migrations do repositório (supabase/migrations/*) com o Supabase CLI.
- Faça deploy da Função Edge send-email (já presente em supabase/functions/send-email/index.ts). No Supabase Dashboard > Functions > Deploy.

Operação
- Configure alertas (Slack/Telegram) para falhas de nós e limiares de erro.
- Prefira idempotência (use IDs dos registros; marque processed_at) em fluxos de polling.
