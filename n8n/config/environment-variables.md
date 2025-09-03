Environment Variables (n8n host)

Core
- SUPABASE_URL: https://<your-project-ref>.supabase.co
- SUPABASE_SERVICE_ROLE_KEY: service role key (server-side only, never expose to browser)
- SUPABASE_ANON_KEY: anon key (optional; used for non-privileged reads)

Email
- RESEND_API_KEY: API key for Resend (used by Edge Function)
- RESEND_FROM_DOMAIN: e.g., yourdomain.com (optional)

Billing (optional)
- STRIPE_API_KEY: Secret key for Stripe
- STRIPE_WEBHOOK_SECRET: If capturing Stripe webhooks in n8n

Social (optional; for scheduler)
- META_ACCESS_TOKEN: Graph API token with pages_manage_posts scope
- LINKEDIN_ACCESS_TOKEN: LinkedIn API token
- TWITTER_BEARER_TOKEN: X API token

AI (optional; for document processing and idea generation)
- OPENAI_API_KEY: For model calls

Observability (optional)
- SLACK_WEBHOOK_URL: Incoming webhook for alerts

Notes
- n8n nodes reference env vars via expressions like: ={{$env.SUPABASE_URL}}
- Keep all secrets only on the n8n host (not in frontend envs).

