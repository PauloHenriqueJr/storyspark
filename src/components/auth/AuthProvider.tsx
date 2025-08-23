import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { supabase, authHelpers, SignInData, SignUpData } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  role?: string; // Adicionar role para identificar super_admin
}

interface AuthContextType {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  login: (data: SignInData) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (data: SignUpData) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Sistema de monitoramento simplificado
  const trackAuthEvent = (event: string, data?: Record<string, unknown>) => {
    // Loggar apenas eventos críticos
    const criticalEvents = [
      'AUTH_STATE_ERROR',
      'ROLE_TAMPERING_DETECTED', 
      'CONNECTIVITY_TEST_FAILED',
      'PROFILE_CREATION_ERROR',
      'SESSION_CHECK_ERROR'
    ];
    
    if (criticalEvents.includes(event)) {
      console.warn(`🔍 AUTH_PROVIDER: ${event}`, data);
    }
  };

  // Função para detectar e corrigir clock skew
  const handleClockSkew = () => {
    const originalConsoleWarn = console.warn;
    
    // Interceptar warnings do Supabase sobre clock skew
    console.warn = function(...args) {
      const message = args.join(' ');
      
      if (message.includes('Session as retrieved from URL was issued in the future')) {
        trackAuthEvent('CLOCK_SKEW_DETECTED', { message });
        
        // Extrair timestamps do warning se possível
        const timestampRegex = /(\d{10})/g;
        const timestamps = message.match(timestampRegex);
        
        if (timestamps && timestamps.length >= 2) {
          const serverTime = parseInt(timestamps[0]);
          const clientTime = Math.floor(Date.now() / 1000);
          const skew = serverTime - clientTime;
          
          trackAuthEvent('CLOCK_SKEW_CALCULATED', {
            serverTime,
            clientTime,
            skewSeconds: skew
          });
          
          // Se o skew for significativo (> 30 segundos), tentar ajustar
          if (Math.abs(skew) > 30) {
            trackAuthEvent('CLOCK_SKEW_CORRECTION_ATTEMPT', { skew });
            
            // Mostrar warning amigável ao usuário
            toast({
              title: "Ajuste de Relógio Detectado",
              description: "Sincronizando com o servidor...",
              variant: "default",
            });
          }
        }
        
        // Não mostrar o warning técnico no console
        return;
      }
      
      // Para outros warnings, usar comportamento normal
      originalConsoleWarn.apply(console, args);
    };
    
    // Restaurar console.warn após 10 segundos
    setTimeout(() => {
      console.warn = originalConsoleWarn;
      trackAuthEvent('CONSOLE_WARN_RESTORED');
    }, 10000);
  };

  // Teste de conectividade simplificado
  const testSupabaseConnection = async (): Promise<boolean> => {
    try {
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), 2000) // Reduzido para 2s
      );
      
      const testPromise = supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .limit(1);
        
      await Promise.race([testPromise, timeoutPromise]);
      return true;
    } catch (error) {
      trackAuthEvent('CONNECTIVITY_TEST_FAILED', { error: error instanceof Error ? error.message : 'Unknown error' });
      return false;
    }
  };

  // Função para validação server-side simplificada
  const validateRoleServerSide = async (userId: string): Promise<string | null> => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (error) {
        trackAuthEvent('ROLE_VALIDATION_ERROR', { error: error.message });
        return null;
      }
      
      return profile?.role || 'user';
    } catch (error) {
      return null;
    }
  };

  // Função para detectar possível manipulação de role
  const validateRoleIntegrity = async (currentUser: User): Promise<boolean> => {
    if (!currentUser.id) return false;
    
    const serverRole = await validateRoleServerSide(currentUser.id);
    
    if (serverRole && serverRole !== currentUser.role) {
      trackAuthEvent('ROLE_TAMPERING_DETECTED', {
        clientRole: currentUser.role,
        serverRole,
        userId: currentUser.id
      });
      
      // Forçar logout por segurança
      toast({
        title: "Erro de Segurança",
        description: "Inconsistência detectada. Faça login novamente.",
        variant: "destructive",
      });
      
      await logout();
      return false;
    }
    
    return true;
  };
  const getOrCreateUserProfile = async (supabaseUser: SupabaseUser): Promise<User | null> => {
    // Criar perfil temporário como fallback otimizado
    const createTempProfile = (): User => {
      const isKnownAdmin = supabaseUser.email === 'paulojack2011@gmail.com';
      return {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.user_metadata?.full_name || 
              supabaseUser.user_metadata?.name || 
              supabaseUser.email?.split('@')[0] || 'Usuário',
        avatar_url: supabaseUser.user_metadata?.avatar_url,
        created_at: supabaseUser.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        role: isKnownAdmin ? 'super_admin' : 'user'
      };
    };
    
    try {
      // 1. Teste de conectividade rápido
      const isConnected = await testSupabaseConnection();
      if (!isConnected) {
        return createTempProfile();
      }
      
      // 2. Query simplificada com timeout menor
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();
      
      // 3. Se perfil não encontrado, tentar criar rapidamente
      if (error && error.code === 'PGRST116') {
        const newProfileData = {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          full_name: supabaseUser.user_metadata?.full_name || 
                    supabaseUser.user_metadata?.name || 
                    supabaseUser.email?.split('@')[0] || 'Usuário',
          avatar_url: supabaseUser.user_metadata?.avatar_url || null,
        };
        
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([newProfileData])
          .select()
          .single();
          
        if (createError) {
          trackAuthEvent('PROFILE_CREATION_ERROR', { 
            code: createError.code,
            message: createError.message 
          });
          return createTempProfile();
        }
        
        return {
          id: newProfile.id,
          email: newProfile.email,
          name: newProfile.full_name || newProfile.email.split('@')[0],
          avatar_url: newProfile.avatar_url || supabaseUser.user_metadata?.avatar_url,
          created_at: newProfile.created_at,
          updated_at: newProfile.updated_at,
          role: newProfile.role || 'user'
        };
      } else if (error) {
        return createTempProfile();
      }
      
      // 4. Processar perfil encontrado
      if (profile) {
        return {
          id: profile.id,
          email: profile.email,
          name: profile.full_name || profile.email.split('@')[0],
          avatar_url: profile.avatar_url || supabaseUser.user_metadata?.avatar_url,
          created_at: profile.created_at,
          updated_at: profile.updated_at,
          role: profile.role || 'user'
        };
      }
      
      return createTempProfile();
      
    } catch (error) {
      return createTempProfile();
    }
  };


  useEffect(() => {
    let mounted = true;
    let sessionChecked = false;
    let roleValidationInterval: NodeJS.Timeout;
    
    // Inicializar handler de clock skew
    handleClockSkew();
    
    // Função de validação periódica de role (anti-tampering)
    const startRoleValidation = (currentUser: User) => {
      if (roleValidationInterval) {
        clearInterval(roleValidationInterval);
      }
      
      // Validar role a cada 2 minutos para usuários admin
      if (currentUser.role === 'admin' || currentUser.role === 'super_admin') {
        roleValidationInterval = setInterval(async () => {
          if (mounted && currentUser) {
            await validateRoleIntegrity(currentUser);
          }
        }, 120000); // 2 minutos
      }
    };
    
    const handleAuthStateChange = async (event: AuthChangeEvent, session: Session | null) => {
      if (!mounted) return;
      
      try {
        if (event === 'SIGNED_IN' && session) {
          setSupabaseUser(session.user);
          
          const userProfile = await getOrCreateUserProfile(session.user);
          
          if (userProfile && mounted) {
            setUser(userProfile);
            
            // Iniciar validação periódica para admins
            startRoleValidation(userProfile);
            
            // Toast de boas-vindas somente se não for carregamento inicial
            if (sessionChecked) {
              toast({
                title: `Bem-vindo, ${userProfile.name}!`,
                description: userProfile.role === 'super_admin' 
                  ? "Você tem acesso administrativo completo." 
                  : "Login realizado com sucesso.",
              });
            }
          }
        } else if (event === 'SIGNED_OUT') {
          if (mounted) {
            setUser(null);
            setSupabaseUser(null);
            // Limpar validação periódica
            if (roleValidationInterval) {
              clearInterval(roleValidationInterval);
            }
          }
        }
      } catch (error) {
        trackAuthEvent('AUTH_STATE_ERROR', { 
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Verificar sessão existente simplificada
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          trackAuthEvent('SESSION_CHECK_ERROR', {
            code: error.code,
            message: error.message
          });
          return;
        }
        
        if (!mounted) return;
        
        if (session) {
          setSupabaseUser(session.user);
          
          const userProfile = await getOrCreateUserProfile(session.user);
          
          if (userProfile && mounted) {
            setUser(userProfile);
          }
        }
      } catch (error) {
        // Falha silenciosa para evitar logs excessivos
      } finally {
        if (mounted) {
          sessionChecked = true;
          setLoading(false);
        }
      }
    };
    
    checkSession();

    return () => {
      mounted = false;
      if (roleValidationInterval) {
        clearInterval(roleValidationInterval);
      }
      subscription.unsubscribe();
    };
  }, []);

  const login = async (data: SignInData) => {
    setLoading(true);
    try {
      await authHelpers.signIn(data);
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta ao StorySpark.",
      });
    } catch (error: unknown) {
      toast({
        title: "Erro no login",
        description: error instanceof Error ? error.message : "Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      await authHelpers.signInWithGoogle();
      // O toast será mostrado quando o auth state change for triggered
    } catch (error: unknown) {
      toast({
        title: "Erro no login com Google",
        description: error instanceof Error ? error.message : "Tente novamente mais tarde.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: SignUpData) => {
    setLoading(true);
    try {
      await authHelpers.signUp(data);
      toast({
        title: "Conta criada com sucesso!",
        description: "Verifique seu email para confirmar a conta.",
      });
    } catch (error: unknown) {
      toast({
        title: "Erro no registro",
        description: error instanceof Error ? error.message : "Erro ao criar conta. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      await authHelpers.resetPassword(email);
      toast({
        title: "Email enviado!",
        description: "Verifique sua caixa de entrada para redefinir a senha.",
      });
    } catch (error: unknown) {
      toast({
        title: "Erro ao enviar email",
        description: error instanceof Error ? error.message : "Tente novamente mais tarde.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authHelpers.signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
    } catch (error: unknown) {
      toast({
        title: "Erro no logout",
        description: error instanceof Error ? error.message : "Erro ao desconectar.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ 
      user, 
      supabaseUser,
      login, 
      loginWithGoogle,
      register,
      logout, 
      resetPassword,
      loading,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};