import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
        redirectTo: `${window.location.origin}/auth/callback`
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