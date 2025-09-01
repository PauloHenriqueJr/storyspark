import { createClient } from '@supabase/supabase-js'

// Usar variáveis de ambiente (com fallback entre ANON e PUBLISHABLE)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  ''

// Validar se as variáveis estão definidas
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variáveis de ambiente do Supabase ausentes: defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY (ou VITE_SUPABASE_PUBLISHABLE_KEY)')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    debug: import.meta.env.DEV, // Debug apenas em desenvolvimento
    storageKey: 'storyspark-auth-token', // Chave específica para evitar conflitos
  },
  global: {
    headers: {
      'X-Client-Info': 'storyspark-web@1.0.0',
      'apikey': supabaseAnonKey,
      'Prefer': 'return=representation'
    }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    timeout: 30000,
    heartbeatIntervalMs: 30000
  }
})

// Interceptar requisições para garantir que o token seja enviado
supabase.auth.onAuthStateChange((event, session) => {
  if (session?.access_token) {
    // Atualizar headers globais com o token de acesso
    supabase.rest.headers['Authorization'] = `Bearer ${session.access_token}`
  } else {
    // Remover header de autorização se não houver sessão
    delete supabase.rest.headers['Authorization']
  }
})

// Log da configuração em desenvolvimento
if (import.meta.env.DEV) {
  console.log('🔧 Supabase configurado:', {
    url: supabaseUrl,
    hasKey: !!supabaseAnonKey,
    keyLength: supabaseAnonKey.length
  })
}

// Tipos de usuário
export type User = {
  id: string
  email: string
  name: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

// Tipos de autenticação
export type AuthError = {
  message: string
  status?: number
}

export type SignUpData = {
  email: string
  password: string
  name: string
}

export type SignInData = {
  email: string
  password: string
}

// Helper functions para autenticação
export const authHelpers = {
  // Login com email e senha
  signIn: async (data: SignInData) => {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    
    if (error) throw error
    return authData
  },

  // Registro com email e senha
  signUp: async (data: SignUpData) => {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
        }
      }
    })
    
    if (error) throw error
    return authData
  },

  // Login com Google
  signInWithGoogle: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    })
    
    if (error) throw error
    return data
  },

  // Logout
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Reset password
  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })
    
    if (error) throw error
    return data
  },

  // Confirmar email
  confirmEmail: async (token: string, type: 'signup' | 'recovery' = 'signup') => {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: type
    })
    
    if (error) throw error
    return data
  }
}