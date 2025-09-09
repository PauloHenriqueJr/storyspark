import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card, CardConten      // Teste 2: Busca por email (se usuário estiver logado)
      if (supabaseUser?.email) {
  const { data: byEmail, error: emailError } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', supabaseUser.email);

  console.log('🧪 Busca por email:', { byEmail, emailError });
  setResult({
    connectivityTest: { count: count || 0, countError },
    emailSearch: { byEmail, emailError }
  } as TestResult);
} else {
  console.log('🧪 Busca por email: Usuário não logado, pulando teste');
  setResult({
    connectivityTest: { count: count || 0, countError },
    emailSearch: { byEmail: null, emailError: null }
  } as TestResult);
}, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, User, Database, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/AuthProvider';

// Tipos discriminados para melhor type safety
interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  role: string;
}

interface SuccessResult {
  success: true;
  profile: UserProfile;
}

interface ErrorResult {
  success?: false;
  error: string;
  code?: string;
}

interface TestResult {
  connectivityTest: {
    count: number | null;
    countError: any;
  };
  emailSearch: {
    byEmail: any[] | null;
    emailError: any;
  };
}

type ResultState = SuccessResult | ErrorResult | TestResult;

const ForceProfile = () => {
  const { supabaseUser } = useAuth(); // Removido setUser que não existe no contexto
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultState | null>(null);

  const forceLoadProfile = async () => {
    if (!supabaseUser) {
      setResult({ error: 'Nenhum usuário do Supabase encontrado' } as ErrorResult);
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      console.log('🚀 ForceProfile: Iniciando busca forçada...');
      console.log('🚀 ForceProfile: User ID:', supabaseUser.id);
      console.log('🚀 ForceProfile: Email:', supabaseUser.email);

      // Buscar diretamente no banco
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      console.log('🚀 ForceProfile: Resultado da query:', { profile, error });

      if (error) {
        setResult({ error: error.message, code: error.code } as ErrorResult);
        return;
      }

      if (profile) {
        // Criar objeto User conforme esperado
        const userProfile: UserProfile = {
          id: profile.id,
          email: profile.email,
          name: profile.full_name || profile.name || profile.username || profile.email?.split('@')[0] || 'Usuário',
          avatar_url: profile.avatar_url,
          created_at: profile.created_at,
          updated_at: profile.updated_at,
          role: profile.role || 'user'
        };

        console.log('🚀 ForceProfile: Perfil processado:', userProfile);

        // Como setUser não está disponível, apenas mostrar o resultado
        setResult({ success: true, profile: userProfile } as SuccessResult);
      } else {
        setResult({ error: 'Perfil não encontrado' } as ErrorResult);
      }
    } catch (err) {
      console.error('🚀 ForceProfile: Erro:', err);
      setResult({ error: err instanceof Error ? err.message : 'Erro desconhecido' } as ErrorResult);
    } finally {
      setLoading(false);
    }
  };

  const testDirectQuery = async () => {
    setLoading(true);
    setResult(null);

    try {
      console.log('🧪 Testando query direta...');

      // Teste 1: Conectividade geral
      const { count, error: countError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      console.log('🧪 Teste conectividade:', { count, countError });

      // Teste 2: Busca por email (se usuário estiver logado)
      if (supabaseUser?.email) {
        const { data: byEmail, error: emailError } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', supabaseUser.email);

        console.log('🧪 Busca por email:', { byEmail, emailError });
        setResult({
          connectivityTest: { count: count || 0, countError },
          emailSearch: { byEmail, emailError }
        } as TestResult);
      } else {
        console.log('🧪 Busca por email: Usuário não logado, pulando teste');
        setResult({
          connectivityTest: { count: count || 0, countError },
          emailSearch: { byEmail: null, emailError: null }
        } as TestResult);
      }
    } catch (err) {
      console.error('🧪 Erro no teste:', err);
      setResult({ error: err instanceof Error ? err.message : 'Erro no teste' } as ErrorResult);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Forçar Carregamento do Perfil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">Status Supabase User:</h3>
            <ul className="text-sm space-y-1">
              <li><strong>Presente:</strong> {supabaseUser ? '✅ Sim' : '❌ Não'}</li>
              {supabaseUser && (
                <>
                  <li><strong>ID:</strong> {supabaseUser.id}</li>
                  <li><strong>Email:</strong> {supabaseUser.email}</li>
                </>
              )}
            </ul>
          </div>

          <div className="space-y-3">
            <Button
              onClick={forceLoadProfile}
              disabled={loading || !supabaseUser}
              className="w-full"
              variant="default"
            >
              <User className="w-4 h-4 mr-2" />
              {loading ? 'Carregando...' : 'Forçar Carregamento do Perfil'}
            </Button>

            <Button
              onClick={testDirectQuery}
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              <Database className="w-4 h-4 mr-2" />
              {loading ? 'Testando...' : 'Testar Queries Diretas'}
            </Button>
          </div>

          {result && (
            <div className="space-y-3">
              {'success' in result && result.success && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-800 mb-2">✅ Sucesso!</h3>
                  <div className="text-sm">
                    <p><strong>Nome:</strong> {result.profile.name}</p>
                    <p><strong>Email:</strong> {result.profile.email}</p>
                    <p><strong>Role:</strong> <Badge>{result.profile.role}</Badge></p>
                  </div>
                </div>
              )}

              {'error' in result && result.error && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-medium text-red-800 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Erro
                  </h3>
                  <p className="text-sm">{result.error}</p>
                  {'code' in result && result.code && <p className="text-xs text-red-600">Código: {result.code}</p>}
                </div>
              )}

              {'connectivityTest' in result && result.connectivityTest && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-medium text-yellow-800 mb-2">🧪 Resultados dos Testes</h3>
                  <div className="text-sm space-y-2">
                    <p><strong>Conectividade:</strong> {result.connectivityTest.countError ? `❌ Falha (${result.connectivityTest.countError.message})` : `✅ OK (${result.connectivityTest.count} registros)`}</p>
                    <p><strong>Busca por Email:</strong> {result.emailSearch?.byEmail === null ? '⏭️ Não executada (usuário não logado)' : `${result.emailSearch?.byEmail?.length || 0} registros encontrados`}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForceProfile;