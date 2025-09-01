/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MAILTRAP_API_TOKEN?: string
  readonly VITE_DEFAULT_FROM_EMAIL?: string
  readonly VITE_MAILTRAP_ACCOUNT_ID?: string
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}