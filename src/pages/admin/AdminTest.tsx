import React from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRole } from '@/hooks/useRole';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AdminTest = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const { currentRole, hasAdminAccess, isSuperAdmin } = useRole();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Teste de Administração</h1>
        <Badge variant={hasAdminAccess() ? 'default' : 'destructive'}>
          {currentRole}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Status de Autenticação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Autenticado:</span>
              <Badge variant={isAuthenticated ? 'default' : 'destructive'}>
                {isAuthenticated ? 'Sim' : 'Não'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Email:</span>
              <span className="text-sm text-muted-foreground">{user?.email || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span>Nome:</span>
              <span className="text-sm text-muted-foreground">{user?.name || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span>ID:</span>
              <span className="text-sm text-muted-foreground font-mono">{user?.id || 'N/A'}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Permissões</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Role Atual:</span>
              <Badge variant="outline">{currentRole}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Acesso Admin:</span>
              <Badge variant={hasAdminAccess() ? 'default' : 'destructive'}>
                {hasAdminAccess() ? 'Sim' : 'Não'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Super Admin:</span>
              <Badge variant={isSuperAdmin() ? 'default' : 'destructive'}>
                {isSuperAdmin() ? 'Sim' : 'Não'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados do Usuário (JSON)</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTest;