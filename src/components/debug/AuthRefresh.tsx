import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Bug, User } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

const AuthRefresh = () => {
  const { loading, user, supabaseUser } = useAuth();

  const handleRefresh = () => {
    console.log('🔄 Forçando refresh da página...');
    window.location.reload();
  };

  const handleClearStorage = () => {
    console.log('🗑️ Limpando localStorage e sessionStorage...');
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="w-5 h-5" />
            Debug e Refresh de Autenticação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-medium text-yellow-800 mb-2">Status Atual:</h3>
            <ul className="text-sm space-y-1">
              <li><strong>Loading:</strong> {loading ? 'Sim' : 'Não'}</li>
              <li><strong>Supabase User:</strong> {supabaseUser ? '✅ Presente' : '❌ Ausente'}</li>
              <li><strong>User Profile:</strong> {user ? '✅ Carregado' : '❌ Não carregado'}</li>
              {user && (
                <li><strong>Role:</strong> {user.role}</li>
              )}
            </ul>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleRefresh} 
              className="w-full"
              variant="default"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Simples (Recarregar Página)
            </Button>

            <Button 
              onClick={handleClearStorage} 
              className="w-full"
              variant="outline"
            >
              <User className="w-4 h-4 mr-2" />
              Limpar Cache + Refresh
            </Button>
          </div>

          <div className="text-xs text-muted-foreground space-y-2">
            <p><strong>Instruções:</strong></p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Clique em "Refresh Simples" para ver os logs de debug no console</li>
              <li>Abra o Console do navegador (F12) para ver os logs detalhados</li>
              <li>Se ainda não funcionar, use "Limpar Cache + Refresh"</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthRefresh;