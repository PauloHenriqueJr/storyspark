import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, User, CheckCircle, LogIn } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useNavigate } from 'react-router-dom';

const ForceLogin = () => {
  const { user, supabaseUser, loading } = useAuth();
  const navigate = useNavigate();
  const [forcing, setForcing] = useState(false);

  const forceLoginNow = async () => {
    if (!supabaseUser) {
      alert('Você não está logado no Supabase. Faça login primeiro em /auth');
      return;
    }

    setForcing(true);

    try {
      // Usar localStorage para forçar o login
      const forcedUser = {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.user_metadata?.full_name || 
              supabaseUser.user_metadata?.name || 
              'Paulo Henrique',
        avatar_url: supabaseUser.user_metadata?.avatar_url,
        created_at: supabaseUser.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        role: supabaseUser.email === 'paulojack2011@gmail.com' ? 'super_admin' : 'user'
      };

      // Salvar no localStorage como backup
      localStorage.setItem('forced_user_profile', JSON.stringify(forcedUser));
      
      console.log('🚀 ForceLogin: Perfil forçado criado:', forcedUser);

      // Tentar usar o setUser do contexto se disponível
      const authContext = (window as any).authContext;
      if (authContext && authContext.setUser) {
        authContext.setUser(forcedUser);
      }

      // Recarregar a página para garantir que o estado seja atualizado
      alert('Login forçado ativado! A página será recarregada.');
      window.location.reload();

    } catch (err) {
      console.error('🚀 ForceLogin: Erro:', err);
      alert('Erro no login forçado. Tente novamente.');
    } finally {
      setForcing(false);
    }
  };

  const goToAdminNow = () => {
    navigate('/admin/settings');
  };

  const goToAuth = () => {
    navigate('/auth');
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Login Forçado - Bypass de Emergência
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-medium text-yellow-800 mb-2">⚠️ Status Atual:</h3>
            <ul className="text-sm space-y-1">
              <li><strong>Supabase User:</strong> {supabaseUser ? '✅ Logado' : '❌ Não logado'}</li>
              <li><strong>Profile Carregado:</strong> {user ? '✅ Sim' : '❌ Não'}</li>
              <li><strong>Loading:</strong> {loading ? '⏳ Sim' : '✅ Não'}</li>
              {user && (
                <>
                  <li><strong>Nome:</strong> {user.name}</li>
                  <li><strong>Role:</strong> <Badge>{user.role}</Badge></li>
                </>
              )}
            </ul>
          </div>

          {!supabaseUser ? (
            <div className="space-y-3">
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-red-800 text-sm">
                  Você não está logado no Supabase. Faça login primeiro.
                </p>
              </div>
              <Button onClick={goToAuth} className="w-full" variant="default">
                <LogIn className="w-4 h-4 mr-2" />
                Ir para Login (/auth)
              </Button>
            </div>
          ) : !user ? (
            <div className="space-y-3">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800 text-sm">
                  <strong>Problema detectado:</strong> Você está logado no Supabase mas o perfil não carregou.
                  Use o botão abaixo para forçar o login.
                </p>
              </div>
              <Button 
                onClick={forceLoginNow} 
                disabled={forcing}
                className="w-full"
                variant="default"
              >
                <Zap className="w-4 h-4 mr-2" />
                {forcing ? 'Forçando Login...' : '🚀 FORÇAR LOGIN AGORA'}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  ✅ Login Funcionando!
                </h3>
                <p className="text-sm text-green-700">
                  Você está logado como <strong>{user.name}</strong> com role <Badge>{user.role}</Badge>.
                </p>
              </div>
              
              {user.role === 'super_admin' && (
                <Button onClick={goToAdminNow} className="w-full" variant="default">
                  <User className="w-4 h-4 mr-2" />
                  Ir para Admin Settings
                </Button>
              )}
            </div>
          )}

          <div className="text-xs text-muted-foreground space-y-2">
            <p><strong>Como funciona o Login Forçado:</strong></p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Cria um perfil temporário com base nos dados do Supabase</li>
              <li>Para paulojack2011@gmail.com, sempre define role como super_admin</li>
              <li>Salva no localStorage como backup</li>
              <li>Recarrega a página para aplicar as mudanças</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForceLogin;