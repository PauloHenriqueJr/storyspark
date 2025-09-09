import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useAIContingency } from '@/hooks/useAIContingency';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Shield,
  Play,
  Loader,
  CheckCircle,
  XCircle,
  BarChart3,
  RefreshCw,
  AlertTriangle,
  Bot,
  Zap,
  Globe,
  Timer,
} from 'lucide-react';

const ContingencyDemo = () => {
  const { toast } = useToast();
  const { loading, error, response, executeRequest, testProvider, getStats, clearError, clearResponse } = useAIContingency();
  
  const [prompt, setPrompt] = useState('Olá! Como você está hoje?');
  const [preferredProvider, setPreferredProvider] = useState<string>('');
  const [testingProvider, setTestingProvider] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalRequests: 0,
    contingencyActivations: 0,
    providerFailures: {} as Record<string, number>,
    mostUsedFallback: '',
  });

  const providers = [
    { key: 'openai', name: 'OpenAI', icon: Bot, color: 'bg-green-100 text-green-800' },
    { key: 'anthropic', name: 'Claude (Anthropic)', icon: Bot, color: 'bg-orange-100 text-orange-800' },
    { key: 'gemini', name: 'Google Gemini', icon: Zap, color: 'bg-blue-100 text-blue-800' },
    { key: 'openrouter', name: 'OpenRouter', icon: Globe, color: 'bg-purple-100 text-purple-800' },
    { key: 'kilocode', name: 'Kilocode', icon: Bot, color: 'bg-red-100 text-red-800' },
  ];

  // Carregar estatísticas na inicialização
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const newStats = await getStats(7);
      setStats(newStats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const handleExecuteRequest = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt obrigatório",
        description: "Digite um prompt para enviar para a IA.",
        variant: "destructive"
      });
      return;
    }

    clearError();
    clearResponse();

    const request = {
      prompt: prompt.trim(),
      maxTokens: 1000,
      temperature: 0.7,
      userId: 'demo-user',
      context: 'Demonstração do sistema de contingência',
    };

    const result = await executeRequest(request, preferredProvider || undefined);
    
    if (result) {
      toast({
        title: "Requisição executada com sucesso",
        description: `Resposta obtida via ${result.provider} (${result.model})`,
      });
      
      // Recarregar estatísticas após a requisição
      await loadStats();
    } else if (error) {
      toast({
        title: "Erro na requisição",
        description: error,
        variant: "destructive"
      });
    }
  };

  const handleTestProvider = async (providerKey: string) => {
    setTestingProvider(providerKey);
    
    try {
      const result = await testProvider(providerKey);
      
      toast({
        title: result.success ? "Teste bem-sucedido" : "Teste falhou",
        description: result.message,
        variant: result.success ? "default" : "destructive"
      });
    } catch (error) {
      toast({
        title: "Erro no teste",
        description: "Falha ao testar o provedor",
        variant: "destructive"
      });
    } finally {
      setTestingProvider(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
            <Shield className="w-8 h-8" />
            Sistema de Contingência de IA
          </h1>
          <p className="text-muted-foreground">Demonstração do fallback automático entre provedores</p>
        </div>
        <Button onClick={loadStats} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar Stats
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Seção de Teste */}
        <div className="space-y-6">
          {/* Formulário de Teste */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                Testar Sistema de Contingência
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="prompt">Prompt para IA</Label>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Digite sua pergunta ou solicitação para a IA..."
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="provider">Provedor Preferido (opcional)</Label>
                <Select value={preferredProvider} onValueChange={setPreferredProvider}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sistema escolherá automaticamente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Automático (por prioridade)</SelectItem>
                    {providers.map(provider => (
                      <SelectItem key={provider.key} value={provider.key}>
                        {provider.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={handleExecuteRequest} 
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <><Loader className="w-4 h-4 mr-2 animate-spin" />Executando...</>
                ) : (
                  <><Play className="w-4 h-4 mr-2" />Executar Requisição</>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Resultado */}
          {(response || error) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {response ? (
                    <><CheckCircle className="w-5 h-5 text-green-600" />Resultado</>
                  ) : (
                    <><XCircle className="w-5 h-5 text-red-600" />Erro</>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {response && (
                  <>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-green-100 text-green-800">
                        Provedor: {response.provider}
                      </Badge>
                      <Badge variant="outline">
                        Modelo: {response.model}
                      </Badge>
                      <Badge variant="outline">
                        Tokens: {response.tokensUsed}
                      </Badge>
                    </div>
                    <div>
                      <Label>Resposta da IA:</Label>
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm">{response.content}</p>
                      </div>
                    </div>
                  </>
                )}
                
                {error && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Seção de Monitoramento */}
        <div className="space-y-6">
          {/* Teste de Provedores */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                Teste de Provedores
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {providers.map(provider => (
                <div key={provider.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <provider.icon className="w-4 h-4" />
                    <span className="font-medium">{provider.name}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTestProvider(provider.key)}
                    disabled={testingProvider === provider.key}
                  >
                    {testingProvider === provider.key ? (
                      <><Loader className="w-3 h-3 mr-1 animate-spin" />Testando</>
                    ) : (
                      <><Play className="w-3 h-3 mr-1" />Testar</>
                    )}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Estatísticas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Estatísticas (7 dias)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalRequests}</div>
                  <div className="text-xs text-muted-foreground">Total de Requisições</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{stats.contingencyActivations}</div>
                  <div className="text-xs text-muted-foreground">Ativações de Contingência</div>
                </div>
              </div>
              
              {stats.mostUsedFallback && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-sm font-medium text-green-800">Fallback Mais Usado</div>
                  <div className="text-lg font-bold text-green-600">
                    {providers.find(p => p.key === stats.mostUsedFallback)?.name || stats.mostUsedFallback}
                  </div>
                </div>
              )}
              
              {Object.keys(stats.providerFailures).length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Falhas por Provedor:</Label>
                  <div className="mt-2 space-y-2">
                    {Object.entries(stats.providerFailures).map(([provider, failures]) => (
                      <div key={provider} className="flex justify-between items-center">
                        <span className="text-sm">
                          {providers.find(p => p.key === provider)?.name || provider}
                        </span>
                        <Badge variant="outline" className="text-red-600">
                          {failures} falhas
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informações do Sistema */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="w-5 h-5" />
                Como Funciona
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <p><strong>1. Prioridade:</strong> Tenta o provedor com maior prioridade primeiro</p>
                <p><strong>2. Retry:</strong> Se falhar, tenta novamente até 3 vezes com delay</p>
                <p><strong>3. Fallback:</strong> Se esgotar tentativas, passa para o próximo provedor</p>
                <p><strong>4. Log:</strong> Registra todos os eventos de contingência</p>
                <p><strong>5. Transparente:</strong> O usuário recebe a resposta sem saber das falhas</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContingencyDemo;export { ContingencyDemo as Component };
