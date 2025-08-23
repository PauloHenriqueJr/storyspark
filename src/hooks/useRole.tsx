import { useAuth } from '@/components/auth/AuthProvider';

export const useRole = () => {
  const { user } = useAuth();

  // Funções de verificação de role
  const isUser = () => user?.role === 'user';
  const isAdmin = () => user?.role === 'admin';
  const isSuperAdmin = () => user?.role === 'super_admin';
  
  // Verificações mais específicas
  const hasAdminAccess = () => user?.role === 'admin' || user?.role === 'super_admin';
  const hasSuperAdminAccess = () => user?.role === 'super_admin';
  
  // Verificar se tem permissão específica
  const hasRole = (role: string) => user?.role === role;
  const hasAnyRole = (roles: string[]) => user?.role ? roles.includes(user.role) : false;
  
  return {
    // Estado atual
    currentRole: user?.role || 'guest',
    user,
    
    // Funções de verificação básicas
    isUser,
    isAdmin,
    isSuperAdmin,
    
    // Verificações de acesso
    hasAdminAccess,
    hasSuperAdminAccess,
    
    // Verificações flexíveis
    hasRole,
    hasAnyRole,
    
    // Helper para UI
    getRoleBadgeColor: () => {
      switch (user?.role) {
        case 'super_admin':
          return 'destructive';
        case 'admin':
          return 'default';
        case 'user':
          return 'secondary';
        default:
          return 'outline';
      }
    },
    
    getRoleDisplayName: () => {
      switch (user?.role) {
        case 'super_admin':
          return 'Super Admin';
        case 'admin':
          return 'Administrador';
        case 'user':
          return 'Cliente';
        default:
          return 'Visitante';
      }
    }
  };
};