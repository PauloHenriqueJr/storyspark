import React from 'react';
import { useAuth } from './AuthProvider';
import { useRole } from '@/hooks/useRole';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User, Crown, Settings, LogOut } from 'lucide-react';

export const UserDebugInfo = () => {
  const { user, supabaseUser, logout, loading } = useAuth();
  const { 
    currentRole, 
    isSuperAdmin, 
    hasAdminAccess, 
    getRoleBadgeColor, 
    getRoleDisplayName 
  } = useRole();

  if (loading) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="flex items-center justify-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-red-600">❌ Usuário não autenticado</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatar_url} alt={user.name} />
            <AvatarFallback>
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              {user.name}
              {hasAdminAccess() && (
                <Badge variant={getRoleBadgeColor()} className="flex items-center gap-1">
                  <Crown className="h-3 w-3" />
                  {getRoleDisplayName()}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Informações do Usuário */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <User className="h-4 w-4" />
            Informações da Conta
          </h4>
          <div className="text-xs space-y-1 text-muted-foreground">
            <div><strong>ID:</strong> {user.id}</div>
            <div><strong>Role:</strong> {currentRole}</div>
            <div><strong>Tipo:</strong> {getRoleDisplayName()}</div>
            <div><strong>Criado:</strong> {new Date(user.created_at).toLocaleDateString('pt-BR')}</div>
            <div><strong>Atualizado:</strong> {new Date(user.updated_at).toLocaleDateString('pt-BR')}</div>
          </div>
        </div>

        {/* Informações do Supabase */}
        {supabaseUser && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Dados Supabase
            </h4>
            <div className="text-xs space-y-1 text-muted-foreground">
              <div><strong>Provider:</strong> {supabaseUser.app_metadata?.provider || 'email'}</div>
              <div><strong>Confirmado:</strong> {supabaseUser.email_confirmed_at ? '✅ Sim' : '❌ Não'}</div>
              <div><strong>Último Login:</strong> {
                supabaseUser.last_sign_in_at 
                  ? new Date(supabaseUser.last_sign_in_at).toLocaleString('pt-BR')
                  : 'N/A'
              }</div>
            </div>
          </div>
        )}

        {/* Ações */}
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={logout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
          
          {hasAdminAccess() && (
            <Badge variant={getRoleBadgeColor()} className="flex items-center gap-1">
              <Crown className="h-3 w-3" />
              Acesso {getRoleDisplayName()}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};