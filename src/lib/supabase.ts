import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://qgtgvqfikqfjbeixzbyb.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFndGd2cWZpa3FmamJlaXh6YnliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NzE2MTcsImV4cCI6MjA3MDI0NzYxN30.iNAOOITHhXMfAY2kJnQ_Dtrd44UZ7bhlufekerTdtw4"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
})

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