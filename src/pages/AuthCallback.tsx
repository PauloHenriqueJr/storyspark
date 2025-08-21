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
        // Get the code and state from URL parameters
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (error) {
          throw new Error(errorDescription || 'Authentication error');
        }

        if (code) {
          // Exchange the code for a session
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          
          if (exchangeError) {
            throw exchangeError;
          }

          if (data.session) {
            setStatus('success');
            toast({
              title: "Login realizado com sucesso!",
              description: "Bem-vindo ao StorySpark!",
            });
            
            // Redirect to dashboard after a brief success display
            setTimeout(() => {
              navigate('/dashboard', { replace: true });
            }, 1500);
          }
        } else {
          throw new Error('No authorization code received');
        }
      } catch (error: any) {
        console.error('Auth callback error:', error);
        setStatus('error');
        toast({
          title: "Erro na autenticação",
          description: error.message || "Erro ao processar login. Tente novamente.",
          variant: "destructive",
        });
        
        // Redirect to auth page after error
        setTimeout(() => {
          navigate('/auth', { replace: true });
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams]);

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

export default AuthCallback;