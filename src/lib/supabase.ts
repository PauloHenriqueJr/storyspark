import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Usar variáveis de ambiente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Validar se as variáveis estão definidas
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Variáveis de ambiente do Supabase não configuradas corretamente"
  );
}

// Singleton instance para evitar múltiplas instâncias GoTrueClient
let supabaseInstance: SupabaseClient | null = null;

// Função para criar/retornar a única instância
function getSupabaseClient(): SupabaseClient {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: localStorage,
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "pkce",
        debug: false, // Sempre false para evitar logs
        storageKey: "storyspark-auth-token", // Chave específica para evitar conflitos
      },
      global: {
        headers: {
          "X-Client-Info": "storyspark-web@1.0.0",
          apikey: supabaseAnonKey,
          Prefer: "return=representation",
        },
      },
      db: {
        schema: "public",
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });

    // Configurar listener de auth state uma vez
    supabaseInstance.auth.onAuthStateChange((_event, session) => {
      // Não é necessário manipular headers manualmente
      // O Supabase Client já faz isso automaticamente
      if (import.meta.env.DEV && session) {
        console.log("🔐 Auth state changed: user logged in");
      } else if (import.meta.env.DEV && !session) {
        console.log("🔐 Auth state changed: user logged out");
      }
    });

    // Log apenas em desenvolvimento
    if (import.meta.env.DEV) {
      console.log("🔧 Supabase configurado (singleton):", {
        url: supabaseUrl.substring(0, 20) + "...",
        hasKey: !!supabaseAnonKey,
        keyLength: supabaseAnonKey.length,
      });
    }
  }

  return supabaseInstance;
}

// Exportar a instância única
export const supabase = getSupabaseClient();

// Função helper para verificar se o usuário está autenticado
export const isAuthenticated = async (): Promise<boolean> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return !!session;
};

// Tipos para autenticação
export type User = {
  id: string;
  email?: string;
  user_metadata: Record<string, any>;
  app_metadata: Record<string, any>;
  aud: string;
  created_at: string;
};

export type AuthError = {
  message: string;
  status?: number;
  statusCode?: number;
  error_description?: string;
  error_code?: string;
};

export type AuthResponse = {
  data: {
    user: User | null;
    session: any;
  };
  error: AuthError | null;
};

export type SignUpData = {
  email: string;
  password: string;
  name: string;
};

export type SignInData = {
  email: string;
  password: string;
};

// Helpers de autenticação usando a instância única
export const authHelpers = {
  // Login com email e senha
  signIn: async (data: SignInData) => {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) throw error;
    return authData;
  },

  // Registro de novo usuário
  signUp: async (data: SignUpData) => {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
        },
      },
    });

    if (error) throw error;
    return authData;
  },

  // Login com Google
  signInWithGoogle: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) throw error;
    return data;
  },

  // Logout
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Reset password
  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) throw error;
    return data;
  },

  // Confirmar email
  confirmEmail: async (
    token: string,
    type: "signup" | "recovery" = "signup"
  ) => {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: type,
    });

    if (error) throw error;
    return data;
  },
};
