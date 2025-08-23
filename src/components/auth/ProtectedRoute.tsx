import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { useRole } from '@/hooks/useRole';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

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
  const { hasRole, hasAnyRole, hasAdminAccess, hasSuperAdminAccess, currentRole } = useRole();
  const location = useLocation();
  const [serverValidation, setServerValidation] = useState<'pending' | 'valid' | 'invalid'>('pending');

  // Função para validar role no servidor
  const validateRoleServerSide = async (userId: string, requiredRoles: string[]): Promise<boolean> => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('🔒 PROTECTED_ROUTE: Server validation failed', error);
        return false;
      }
      
      const serverRole = profile?.role || 'user';
      const hasPermission = requiredRoles.includes(serverRole);
      
      // Log de segurança para tentativas de acesso
      console.log('🔒 PROTECTED_ROUTE: Server validation', {
        userId,
        serverRole,
        clientRole: currentRole,
        requiredRoles,
        hasPermission,
        route: location.pathname
      });
      
      // Verificar inconsistência entre cliente e servidor
      if (serverRole !== currentRole) {
        console.warn('⚠️ SECURITY: Role mismatch detected', {
          clientRole: currentRole,
          serverRole,
          userId
        });
        
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
      console.error('🔒 PROTECTED_ROUTE: Validation exception', error);
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
  }, [user, isAuthenticated, requiredRole, adminOnly, superAdminOnly, location.pathname]);

  if (loading || serverValidation === 'pending') {
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
    console.warn('⚠️ SECURITY: Access denied to protected route', {
      route: location.pathname,
      userRole: currentRole,
      userId: user?.id
    });
    
    return <Navigate to="/dashboard" replace />;
  }

  // Fallback: Verificar permissões no cliente também (dupla proteção)
  if (superAdminOnly && !hasSuperAdminAccess()) {
    return <Navigate to="/dashboard" replace />;
  }

  if (adminOnly && !hasAdminAccess()) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!hasAnyRole(roles)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};