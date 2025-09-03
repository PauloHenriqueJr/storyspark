Variáveis de Ambiente (host do n8n)

Core
- SUPABASE_URL: https://<seu-project-ref>.supabase.co
- SUPABASE_SERVICE_ROLE_KEY: chave Service Role (apenas server-side; nunca exponha no browser)
- SUPABASE_ANON_KEY: chave anon (opcional; leituras não privilegiadas)

E-mail
- RESEND_API_KEY: chave da API Resend (usada pela Função Edge)
- RESEND_FROM_DOMAIN: ex.: seu-dominio.com (opcional)

Cobrança (opcional)
- STRIPE_API_KEY: chave secreta do Stripe
- STRIPE_WEBHOOK_SECRET: se capturar webhooks do Stripe no n8n

Redes Sociais (opcional; para scheduler)
- META_ACCESS_TOKEN: token Graph API com escopo pages_manage_posts
- LINKEDIN_ACCESS_TOKEN: token da API do LinkedIn
- TWITTER_BEARER_TOKEN: token da API do X

IA (opcional; documentos e ideias)
- OPENAI_API_KEY: para chamadas de modelo

Observabilidade (opcional)
- SLACK_WEBHOOK_URL: webhook de entrada para alertas

Notas
- Os nós referenciam variáveis via expressões: ={{$env.SUPABASE_URL}}
- Mantenha segredos apenas no host do n8n (não no frontend).
