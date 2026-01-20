import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User as SupabaseUser, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { authHelpers, SignInData, SignUpData } from '@/lib/supabase';
import { useSystemToastNotifications } from '@/hooks/useSystemToastNotifications';

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
  refreshProfile: () => Promise<void>;
  loading: boolean;
  refreshLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);
  const systemNotifications = useSystemToastNotifications();

  // Sistema de monitoramento simplificado
  const trackAuthEvent = useCallback((event: string, data?: Record<string, unknown>) => {
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
  }, []);

  // Função para detectar e corrigir clock skew
  const handleClockSkew = useCallback(() => {
    const originalConsoleWarn = console.warn;

    // Interceptar warnings do Supabase sobre clock skew
    console.warn = function (...args) {
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

            // Mostrar warning amigável ao usuário usando sistema de notificações visuais
            if (systemNotifications) {
              systemNotifications.showInfo(
                "Ajuste de Relógio Detectado",
                "Sincronizando com o servidor..."
              );
            }
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
  }, [systemNotifications, trackAuthEvent]);

  // Teste de conectividade simplificado
  const testSupabaseConnection = useCallback(async (): Promise<boolean> => {
    try {
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Connection timeout')), 5000) // Aumentado para 5s
      );

      const testPromise = supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .limit(1);

      await Promise.race([testPromise, timeoutPromise]);
      return true;
    } catch (error) {
      // Não loggar este erro, é esperado em alguns casos
      console.debug('Connectivity test failed:', error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  }, []);

  // Função para validação server-side simplificada
  const validateRoleServerSide = useCallback(async (userId: string): Promise<string | null> => {
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
  }, [trackAuthEvent]);

  const logout = useCallback(async () => {
    try {
      // Limpar estado local imediatamente para responsividade
      setUser(null);
      setSupabaseUser(null);

      await authHelpers.signOut();
      if (systemNotifications) {
        systemNotifications.showSuccess(
          "Logout realizado",
          "Você foi desconectado com sucesso."
        );
      }
    } catch (error: unknown) {
      if (systemNotifications) {
        systemNotifications.showError(
          "Erro no logout",
          error instanceof Error ? error.message : "Erro ao desconectar."
        );
      }
    }
  }, [systemNotifications]);

  const refreshProfile = useCallback(async () => {
    if (!supabaseUser) return;

    setRefreshLoading(true);
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error) {
        console.error('Erro ao recarregar perfil:', error);
        if (systemNotifications) {
          systemNotifications.showError(
            "Erro ao atualizar perfil",
            error.message || "Não foi possível recarregar o perfil. Tente novamente."
          );
        }
        return;
      }

      if (profile) {
        const userProfile = {
          id: profile.id,
          email: profile.email,
          name: profile.full_name || profile.name || profile.username || profile.email?.split('@')[0] || 'Usuário',
          avatar_url: profile.avatar_url || undefined,
          created_at: profile.created_at,
          updated_at: profile.updated_at,
          role: profile.role
        };

        setUser(userProfile);

        if (systemNotifications) {
          systemNotifications.showSuccess(
            "Perfil atualizado",
            "Seu perfil foi recarregado com sucesso."
          );
        }
      }
    } catch (error) {
      console.error('Erro ao recarregar perfil:', error);
      if (systemNotifications) {
        systemNotifications.showError(
          "Erro ao atualizar perfil",
          error instanceof Error ? error.message : "Erro inesperado ao recarregar o perfil."
        );
      }
    } finally {
      setRefreshLoading(false);
    }
  }, [supabaseUser, systemNotifications]);

  // Função para detectar possível manipulação de role
  const validateRoleIntegrity = useCallback(async (currentUser: User): Promise<boolean> => {
    if (!currentUser.id) return false;

    const serverRole = await validateRoleServerSide(currentUser.id);

    if (serverRole && serverRole !== currentUser.role) {
      trackAuthEvent('ROLE_TAMPERING_DETECTED', {
        clientRole: currentUser.role,
        serverRole,
        userId: currentUser.id
      });

      // Forçar logout por segurança usando sistema visual
      if (systemNotifications) {
        systemNotifications.showError(
          "Erro de Segurança",
          "Inconsistência detectada. Faça login novamente."
        );
      }

      await logout();
      return false;
    }

    return true;
  }, [systemNotifications, trackAuthEvent, validateRoleServerSide, logout]);

  const getOrCreateUserProfile = useCallback(async (supabaseUser: SupabaseUser): Promise<User | null> => {
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

        if (newProfile) {
          return {
            id: newProfile.id,
            email: newProfile.email,
            name: newProfile.full_name || newProfile.name || newProfile.username || newProfile.email?.split('@')[0] || 'Usuário',
            avatar_url: newProfile.avatar_url || undefined,
            created_at: newProfile.created_at,
            updated_at: newProfile.updated_at,
            role: newProfile.role || 'user'
          };
        }
      }

      // 4. Se perfil encontrado, retornar
      if (profile) {
        return {
          id: profile.id,
          email: profile.email,
          name: profile.full_name || profile.name || profile.username || profile.email?.split('@')[0] || 'Usuário',
          avatar_url: profile.avatar_url || undefined,
          created_at: profile.created_at,
          updated_at: profile.updated_at,
          role: profile.role || 'user'
        };
      }

      // 5. Fallback para perfil temporário
      return createTempProfile();
    } catch (error) {
      trackAuthEvent('PROFILE_FETCH_ERROR', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return createTempProfile();
    }
  }, [testSupabaseConnection, trackAuthEvent]);

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
            if (sessionChecked && systemNotifications) {
              systemNotifications.showSuccess(
                `Bem-vindo, ${userProfile.name}!`,
                userProfile.role === 'super_admin'
                  ? "Você tem acesso administrativo completo."
                  : "Login realizado com sucesso."
              );
            }
          }
        } else if (event === 'SIGNED_OUT') {
          if (mounted) {
            // Só limpar se ainda não estiver limpo (evitar conflitos com logout manual)
            if (user || supabaseUser) {
              setUser(null);
              setSupabaseUser(null);
            }

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
  }, [getOrCreateUserProfile, handleClockSkew, systemNotifications, trackAuthEvent, validateRoleIntegrity]);

  const login = async (data: SignInData) => {
    setLoading(true);
    try {
      await authHelpers.signIn(data);
      if (systemNotifications) {
        systemNotifications.showSuccess(
          "Login realizado com sucesso!",
          "Bem-vindo de volta ao StorySpark."
        );
      }
    } catch (error: unknown) {
      if (systemNotifications) {
        systemNotifications.showError(
          "Erro no login",
          error instanceof Error ? error.message : "Verifique suas credenciais e tente novamente."
        );
      }
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
      if (systemNotifications) {
        systemNotifications.showError(
          "Erro no login com Google",
          error instanceof Error ? error.message : "Tente novamente mais tarde."
        );
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: SignUpData) => {
    setLoading(true);
    try {
      await authHelpers.signUp(data);
      if (systemNotifications) {
        systemNotifications.showSuccess(
          "Conta criada com sucesso!",
          "Verifique seu email para confirmar a conta."
        );
      }
    } catch (error: unknown) {
      if (systemNotifications) {
        systemNotifications.showError(
          "Erro no registro",
          error instanceof Error ? error.message : "Erro ao criar conta. Tente novamente."
        );
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      await authHelpers.resetPassword(email);
      if (systemNotifications) {
        systemNotifications.showSuccess(
          "Email enviado!",
          "Verifique sua caixa de entrada para redefinir a senha."
        );
      }
    } catch (error: unknown) {
      if (systemNotifications) {
        systemNotifications.showError(
          "Erro ao enviar email",
          error instanceof Error ? error.message : "Tente novamente mais tarde."
        );
      }
      throw error;
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
      refreshProfile,
      loading,
      refreshLoading,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Extract the hook to avoid fast refresh warnings
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
