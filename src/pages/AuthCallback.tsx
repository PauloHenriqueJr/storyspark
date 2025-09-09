import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = React.useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Processar parâmetros de callback do OAuth
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const urlParams = new URLSearchParams(window.location.search);

        // Verificar se há erro nos parâmetros
        const error = urlParams.get('error') || hashParams.get('error');
        const errorDescription = urlParams.get('error_description') || hashParams.get('error_description');

        if (error) {
          throw new Error(errorDescription || 'Authentication error');
        }

        // Deixar o Supabase lidar com o callback automaticamente
        const { data, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          // Se der erro ao obter sessão, tentar processar hash fragment
          const { data: hashData, error: hashError } = await supabase.auth.getSessionFromUrl();

          if (hashError) {
            throw hashError;
          }

          if (hashData.session) {
            setStatus('success');

            // Buscar perfil do usuário para mostrar nome correto
            const { data: profile } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', hashData.session.user.id)
              .single();

            toast({
              title: "Login realizado com sucesso!",
              description: `Bem-vindo ${profile?.full_name || 'ao StorySpark'}!`,
            });

            // Limpar URL para evitar reprocessamento
            window.history.replaceState({}, document.title, window.location.pathname);

            // Redirect to dashboard after a brief success display
            setTimeout(() => {
              navigate('/dashboard', { replace: true });
            }, 1500);
            return;
          }
        }

        if (data.session) {
          setStatus('success');

          // Buscar perfil do usuário para mostrar nome correto
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', data.session.user.id)
            .single();

          toast({
            title: "Login realizado com sucesso!",
            description: `Bem-vindo ${profile?.full_name || 'ao StorySpark'}!`,
          });

          // Limpar URL para evitar reprocessamento  
          window.history.replaceState({}, document.title, window.location.pathname);

          // Redirect to dashboard after a brief success display
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 1500);
        } else {
          // Se não há sessão, redirecionar para auth
          console.warn('No session found, redirecting to auth page');
          navigate('/auth', { replace: true });
          return;
        }
      } catch (error: unknown) {
        console.error('Auth callback error:', error);
        setStatus('error');
        toast({
          title: "Erro na autenticação",
          description: error instanceof Error ? error.message : "Erro ao processar login. Tente novamente.",
          variant: "destructive",
        });

        // Limpar URL e redirecionar para auth page after error
        window.history.replaceState({}, document.title, window.location.pathname);
        setTimeout(() => {
          navigate('/auth', { replace: true });
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <Card className="w-full max-w-md shadow-elegant">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {status === 'loading' && (
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            )}
            {status === 'success' && (
              <CheckCircle className="w-12 h-12 text-green-500" />
            )}
            {status === 'error' && (
              <XCircle className="w-12 h-12 text-destructive" />
            )}
          </div>
          <CardTitle>
            {status === 'loading' && 'Processando login...'}
            {status === 'success' && 'Login realizado!'}
            {status === 'error' && 'Erro na autenticação'}
          </CardTitle>
          <CardDescription>
            {status === 'loading' && 'Aguarde enquanto processamos seu login'}
            {status === 'success' && 'Redirecionando para o dashboard...'}
            {status === 'error' && 'Redirecionando para a página de login...'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <div className="w-8 h-1 bg-muted rounded-full overflow-hidden">
              <div className="w-full h-full bg-primary animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export { AuthCallback as Component };