import React, { useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRole } from '@/hooks/useRole';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader } from 'lucide-react';

const AuthDebug = () => {
  const { user, supabaseUser, loading, isAuthenticated } = useAuth();
  const { currentRole, hasAdminAccess, hasSuperAdminAccess, getRoleDisplayName } = useRole();

  useEffect(() => {
    console.log('=== AUTH DEBUG ===');
    console.log('Loading:', loading);
    console.log('IsAuthenticated:', isAuthenticated);
    console.log('User:', user);
    console.log('SupabaseUser:', supabaseUser);
    console.log('CurrentRole:', currentRole);
    console.log('HasAdminAccess:', hasAdminAccess());
    console.log('HasSuperAdminAccess:', hasSuperAdminAccess());
    console.log('==================');
  }, [loading, isAuthenticated, user, supabaseUser, currentRole]);

  if (loading) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader className="w-5 h-5 animate-spin" />
            Carregando Autenticação...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Verificando estado da autenticação...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Estado da Autenticação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-medium">Status:</label>
              <Badge variant={isAuthenticated ? "default" : "destructive"}>
                {isAuthenticated ? 'Autenticado' : 'Não Autenticado'}
              </Badge>
            </div>
            <div>
              <label className="font-medium">Loading:</label>
              <Badge variant={loading ? "secondary" : "outline"}>
                {loading ? 'Sim' : 'Não'}
              </Badge>
            </div>
          </div>
          
          {user && (
            <div className="space-y-2">
              <h3 className="font-medium">Dados do Usuário:</h3>
              <div className="bg-gray-50 p-3 rounded text-sm">
                <p><strong>ID:</strong> {user.id}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Nome:</strong> {user.name}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <p><strong>Display Name:</strong> {getRoleDisplayName()}</p>
              </div>
            </div>
          )}
          
          {supabaseUser && (
            <div className="space-y-2">
              <h3 className="font-medium">Dados do Supabase:</h3>
              <div className="bg-blue-50 p-3 rounded text-sm">
                <p><strong>ID:</strong> {supabaseUser.id}</p>
                <p><strong>Email:</strong> {supabaseUser.email}</p>
                <p><strong>Email Verified:</strong> {supabaseUser.email_confirmed_at ? 'Sim' : 'Não'}</p>
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <h3 className="font-medium">Permissões:</h3>
            <div className="flex gap-2">
              <Badge variant={hasAdminAccess() ? "default" : "outline"}>
                {hasAdminAccess() ? '✓' : '✗'} Admin Access
              </Badge>
              <Badge variant={hasSuperAdminAccess() ? "default" : "outline"}>
                {hasSuperAdminAccess() ? '✓' : '✗'} Super Admin Access
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthDebug;