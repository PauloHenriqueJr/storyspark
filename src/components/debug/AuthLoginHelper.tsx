import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LogIn, User, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/lib/supabase';

const AuthLoginHelper = () => {
  const { user, supabaseUser, login, loading, isAuthenticated } = useAuth();
  const [loginStatus, setLoginStatus] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Função para fazer login automático com as credenciais do admin
  const handleAutoLogin = async () => {
    setIsLoggingIn(true);
    setLoginStatus('Tentando fazer login...');
    
    try {
      await login({
        email: 'paulojack2011@gmail.com',
        password: 'sua_senha_aqui' // SUBSTITUA PELA SENHA REAL
      });
      setLoginStatus('Login realizado com sucesso!');
    } catch (error) {
      setLoginStatus(`Erro no login: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      console.error('Erro no login:', error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Verificar sessão atual
  const checkCurrentSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        setLoginStatus(`Erro de sessão: ${error.message}`);
        return;
      }
      
      if (session) {
        setLoginStatus(`Sessão ativa encontrada para: ${session.user.email}`);
      } else {
        setLoginStatus('Nenhuma sessão ativa encontrada');
      }
    } catch (error) {
      setLoginStatus(`Erro ao verificar sessão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };

  useEffect(() => {
    checkCurrentSession();
  }, []);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LogIn className="w-5 h-5" />
          Helper de Login - Debug
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status de Autenticação */}
        <div className="space-y-2">
          <h3 className="font-semibold">Status de Autenticação:</h3>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <Badge variant="default" className="bg-green-500">
                <CheckCircle className="w-3 h-3 mr-1" />
                Autenticado
              </Badge>
            ) : (
              <Badge variant="destructive">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Não Autenticado
              </Badge>
            )}
          </div>
        </div>

        {/* Informações do Usuário */}
        {user && (
          <div className="space-y-2">
            <h3 className="font-semibold">Usuário Logado:</h3>
            <div className="bg-muted p-3 rounded-lg">
              <p><strong>Nome:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role || 'Não definido'}</p>
              <p><strong>ID:</strong> {user.id}</p>
            </div>
          </div>
        )}

        {/* Status de Login */}
        {loginStatus && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{loginStatus}</AlertDescription>
          </Alert>
        )}

        {/* Botões de Ação */}
        <div className="flex gap-2 flex-wrap">
          <Button 
            onClick={handleAutoLogin} 
            disabled={isLoggingIn || loading}
            variant="default"
          >
            {isLoggingIn ? 'Fazendo Login...' : 'Login Automático (Admin)'}
          </Button>
          
          <Button 
            onClick={checkCurrentSession} 
            variant="outline"
          >
            Verificar Sessão
          </Button>
          
          <Button 
            onClick={() => window.location.href = '/auth'} 
            variant="secondary"
          >
            Ir para Página de Login
          </Button>
        </div>

        {/* Instruções */}
        <Alert>
          <User className="h-4 w-4" />
          <AlertDescription>
            <strong>Instruções:</strong>
            <br />1. Se não estiver autenticado, clique em "Login Automático" (certifique-se de ter a senha correta)
            <br />2. Ou vá para a página de login manual
            <br />3. Após o login, teste novamente o envio de convites
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default AuthLoginHelper;