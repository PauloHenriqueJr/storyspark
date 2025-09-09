import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { useRole } from '@/hooks/useRole';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { secureLog } from '@/utils/secureLog';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string | string[]; // Role ou array de roles permitidos
  adminOnly?: boolean; // Shortcut para admin + super_admin
  superAdminOnly?: boolean; // Apenas super_admin
}

export const ProtectedRoute = ({
  children,
  requiredRole,
  adminOnly = false,
  superAdminOnly = false
}: ProtectedRouteProps) => {
  const { isAuthenticated, loading, user, logout } = useAuth();
  const { hasAnyRole, hasAdminAccess, hasSuperAdminAccess, currentRole } = useRole();
  const location = useLocation();
  const [serverValidation, setServerValidation] = useState<'pending' | 'valid' | 'invalid'>('pending');
  const [flagValidation, setFlagValidation] = useState<'pending' | 'valid' | 'invalid'>('pending');

  // Função para validar role no servidor
  const validateRoleServerSide = async (userId: string, requiredRoles: string[]): Promise<boolean> => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        secureLog.dev.error('🔒 PROTECTED_ROUTE: Server validation failed', error);
        return false;
      }

      const serverRole = profile?.role || 'user';
      const hasPermission = requiredRoles.includes(serverRole);

      // Verificar inconsistência entre cliente e servidor
      if (serverRole !== currentRole) {
        // Em caso de inconsistência, forçar logout (silencioso)

        toast({
          title: "Erro de Segurança",
          description: "Inconsistência detectada. Faça login novamente.",
          variant: "destructive",
        });

        logout();
        return false;
      }

      return hasPermission;
    } catch (error) {
      secureLog.dev.error('🔒 PROTECTED_ROUTE: Validation exception', error);
      return false;
    }
  };

  // Validar permissões quando o componente montar ou usuário mudar
  useEffect(() => {
    const performServerValidation = async () => {
      if (!user || !isAuthenticated) {
        setServerValidation('pending');
        return;
      }

      // Definir roles necessários
      let requiredRoles: string[] = [];

      if (superAdminOnly) {
        requiredRoles = ['super_admin'];
      } else if (adminOnly) {
        requiredRoles = ['admin', 'super_admin'];
      } else if (requiredRole) {
        requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      } else {
        // Sem restrições de role, apenas autenticado
        setServerValidation('valid');
        return;
      }

      const isValid = await validateRoleServerSide(user.id, requiredRoles);
      setServerValidation(isValid ? 'valid' : 'invalid');
    };

    performServerValidation();
  }, [user, isAuthenticated, requiredRole, adminOnly, superAdminOnly, validateRoleServerSide]);

  // Validate feature flag for current page
  useEffect(() => {
    const validateFeatureFlag = async () => {
      if (!user || !isAuthenticated || serverValidation !== 'valid') {
        setFlagValidation('pending');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('feature_flags')
          .select('enabled')
          .eq('page_path', location.pathname);

        if (error) {
          secureLog.dev.error('Feature flag validation error:', error);
          setFlagValidation('valid'); // Default to enabled if error
          return;
        }

        // Se não houver registros, a página é considerada habilitada por padrão
        const rows = Array.isArray(data) ? data : (data ? [data] : []);
        // Se QUALQUER registro estiver desabilitado, considere desabilitado (fail-safe)
        const anyDisabled = rows.some(row => row.enabled === false);
        setFlagValidation(anyDisabled ? 'invalid' : 'valid');
      } catch (error) {
        secureLog.dev.error('Feature flag validation exception:', error);
        setFlagValidation('valid'); // Default to enabled on error
      }
    };

    validateFeatureFlag();
  }, [user, isAuthenticated, serverValidation, location.pathname]);

  // useEffect para mostrar toast quando página for desabilitada
  useEffect(() => {
    if (flagValidation === 'invalid') {
      toast({
        title: "Página Desabilitada",
        description: "Esta funcionalidade está temporariamente desabilitada.",
        variant: "destructive",
      });
    }
  }, [flagValidation]);

  if (loading || serverValidation === 'pending' || flagValidation === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <div className="space-y-4 max-w-md w-full mx-auto p-6">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redireciona para /auth (que funciona) ao invés de /login
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Verificar resultado da validação server-side
  if (serverValidation === 'invalid') {
    return <Navigate to="/auth" replace />;
  }

  // Verificar feature flag
  if (flagValidation === 'invalid') {
    return <Navigate to="/auth" replace />;
  }

  // Fallback: Verificar permissões no cliente também (dupla proteção)
  if (superAdminOnly && !hasSuperAdminAccess()) {
    return <Navigate to="/auth" replace />;
  }

  if (adminOnly && !hasAdminAccess()) {
    return <Navigate to="/auth" replace />;
  }

  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!hasAnyRole(roles)) {
      return <Navigate to="/auth" replace />;
    }
  }

  return <>{children}</>;
};