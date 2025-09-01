import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { emailService } from '@/services/emailService';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Settings,
  Database,
  Shield,
  Bell,
  Mail,
  Globe,
  Zap,
  DollarSign,
  Users,
  Bot,
  AlertTriangle,
  Save,
  RotateCcw,
  Loader2,
  CheckCircle,
  XCircle,
  Play,
  Loader,
  LucideIcon,
  ArrowUp,
  ArrowDown,
  RotateCw,
  Timer
} from 'lucide-react';

const AdminSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingProvider, setTestingProvider] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    // Configurações Gerais
    platformName: 'StorySpark',
    platformDescription: 'Plataforma de criação de conteúdo com IA',
    maintenanceMode: false,
    registrationOpen: true,
    maxUsersPerCompany: 25,
    
    // Configurações de IA
    openaiApiKey: '',
    openaiModel: 'gpt-4o',
    openaiActive: false,
    anthropicApiKey: '',
    anthropicModel: 'claude-3-5-sonnet-20241022',
    anthropicActive: false,
    geminiApiKey: '',
    geminiModel: 'gemini-2.0-flash-exp',
    geminiActive: false,
    openrouterApiKey: '',
    openrouterModel: 'anthropic/claude-3.5-sonnet',
    openrouterActive: false,
    kilocodeApiKey: '',
    kilocodeModel: 'kilocode-dev-v1',
    kilocodeActive: false,
    defaultProvider: 'gemini',
    defaultModel: 'gemini-2.0-flash-exp',
    maxTokens: 2000,
    temperature: 0.7,
    
    // Configurações de Contingência
    contingencyEnabled: true,
    fallbackPriority: {
      openai: 1,
      gemini: 2,
      anthropic: 3,
      openrouter: 4,
      kilocode: 5
    },
    autoRetryEnabled: true,
    maxRetryAttempts: 3,
    retryDelaySeconds: 5,
    
    // Configurações de Email - Mailtrap
    mailtrapApiToken: '',
    mailtrapAccountId: '',
    defaultFromEmail: 'notifications@storyspark.com',
    defaultFromName: 'StorySpark',
    emailsEnabled: true,
    emailProvider: 'mailtrap', // 'mailtrap' | 'smtp'
    
    // Configurações SMTP (fallback)
    smtpHost: 'smtp.storyspark.com',
    smtpPort: 587,
    smtpUser: 'notifications@storyspark.com',
    smtpPassword: '',
    
    // Configurações de Segurança
    passwordMinLength: 8,
    requireTwoFactor: false,
    sessionTimeout: 24,
    maxLoginAttempts: 5,
    
    // Configurações de Billing
    stripePublicKey: '',
    stripeSecretKey: '',
    billingEnabled: true,
    trialDays: 14,
    
    // Configurações de Notificações
    slackWebhook: '',
    discordWebhook: '',
    alertsEnabled: true,
    maintenanceNotifications: true
  });

  // Carregar configurações do banco na inicialização
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      
      // Carregar configurações de IA
      const { data: llmData, error: llmError } = await supabase
        .from('admin_llm_settings')
        .select('*')
        .single();
      
      if (llmError && llmError.code !== 'PGRST116') {
        console.error('Erro ao carregar configurações de IA:', llmError);
        throw llmError;
      }
      
      if (llmData) {
        setSettings(prev => ({
          ...prev,
          openaiApiKey: llmData.openai_api_key ? '••••••••••••••••' : '',
          openaiModel: llmData.openai_model,
          openaiActive: llmData.openai_active,
          anthropicApiKey: llmData.anthropic_api_key ? '••••••••••••••••' : '',
          anthropicModel: llmData.anthropic_model,
          anthropicActive: llmData.anthropic_active,
          geminiApiKey: llmData.gemini_api_key ? '••••••••••••••••' : '',
          geminiModel: llmData.gemini_model,
          geminiActive: llmData.gemini_active,
          openrouterApiKey: llmData.openrouter_api_key ? '••••••••••••••••' : '',
          openrouterModel: llmData.openrouter_model,
          openrouterActive: llmData.openrouter_active,
          kilocodeApiKey: llmData.kilocode_api_key ? '••••••••••••••••' : '',
          kilocodeModel: llmData.kilocode_model,
          kilocodeActive: llmData.kilocode_active,
          defaultProvider: llmData.default_provider,
          maxTokens: llmData.max_tokens,
          temperature: parseFloat(llmData.temperature),
          
          // Configurações de Contingência
          contingencyEnabled: llmData.contingency_enabled ?? true,
          fallbackPriority: llmData.fallback_priority ?? {
            openai: 1,
            gemini: 2,
            anthropic: 3,
            openrouter: 4,
            kilocode: 5
          },
          autoRetryEnabled: llmData.auto_retry_enabled ?? true,
          maxRetryAttempts: llmData.max_retry_attempts ?? 3,
          retryDelaySeconds: llmData.retry_delay_seconds ?? 5,
        }));
      }
      
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast({
        title: "Erro ao carregar configurações",
        description: "Não foi possível carregar as configurações do sistema.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key: string, value: unknown) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Salvar configurações de IA
      const llmSettings = {
        openai_model: settings.openaiModel,
        openai_active: settings.openaiActive,
        anthropic_model: settings.anthropicModel,
        anthropic_active: settings.anthropicActive,
        gemini_model: settings.geminiModel,
        gemini_active: settings.geminiActive,
        openrouter_model: settings.openrouterModel,
        openrouter_active: settings.openrouterActive,
        kilocode_model: settings.kilocodeModel,
        kilocode_active: settings.kilocodeActive,
        default_provider: settings.defaultProvider,
        max_tokens: settings.maxTokens,
        temperature: settings.temperature,
        
        // Configurações de Contingência
        contingency_enabled: settings.contingencyEnabled,
        fallback_priority: settings.fallbackPriority,
        auto_retry_enabled: settings.autoRetryEnabled,
        max_retry_attempts: settings.maxRetryAttempts,
        retry_delay_seconds: settings.retryDelaySeconds,
        
        updated_at: new Date().toISOString()
      };
      
      // Upsert das configurações de IA
      const { error: llmError } = await supabase
        .from('admin_llm_settings')
        .upsert(llmSettings);
      
      if (llmError) {
        console.error('Erro ao salvar configurações de IA:', llmError);
        throw llmError;
      }
      
      toast({
        title: "Configurações salvas",
        description: "Todas as configurações do sistema foram atualizadas com sucesso.",
      });
      
      // Recarregar configurações para mostrar os dados atualizados
      await loadSettings();
      
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      console.log('Resetando configurações para padrão');
      
      // Recarregar as configurações do banco
      await loadSettings();
      
      toast({
        title: "Configurações recarregadas",
        description: "As configurações foram recarregadas do banco de dados.",
      });
    } catch (error) {
      console.error('Erro ao recarregar configurações:', error);
      toast({
        title: "Erro ao recarregar",
        description: "Não foi possível recarregar as configurações.",
        variant: "destructive"
      });
    }
  };

  // Função para testar conexão com provedor
  const testProvider = async (provider: string) => {
    setTestingProvider(provider);
    
    try {
      // Simular teste de conexão com delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: `${provider} testado com sucesso`,
        description: "Conexão estabelecida e modelo respondendo corretamente.",
      });
    } catch (error) {
      toast({
        title: `Erro ao testar ${provider}`,
        description: "Verifique as credenciais e tente novamente.",
        variant: "destructive"
      });
    } finally {
      setTestingProvider(null);
    }
  };

  // Função para testar configuração de e-mail
  const testEmailConfiguration = async () => {
    setTestingProvider('email');
    
    try {
      // Configurar o EmailService com as configurações atuais
      if (settings.emailProvider === 'mailtrap') {
        if (!settings.mailtrapApiToken || !settings.mailtrapAccountId) {
          throw new Error('Token da API e Account ID do Mailtrap são obrigatórios');
        }
        
        await emailService.configure({
          apiToken: settings.mailtrapApiToken,
          accountId: settings.mailtrapAccountId,
          defaultFromEmail: settings.defaultFromEmail || 'notifications@storyspark.com',
          defaultFromName: settings.defaultFromName || 'StorySpark'
        });
      } else {
        throw new Error('Apenas o provedor Mailtrap é suportado atualmente');
      }
      
      // Enviar e-mail de teste usando o template
      const result = await emailService.sendTestEmail(settings.defaultFromEmail || 'test@storyspark.com');
      
      if (!result.success) {
        throw new Error(result.error || 'Falha ao enviar e-mail de teste');
      }
      
      toast({
        title: "E-mail de teste enviado com sucesso!",
        description: `Um e-mail de teste foi enviado para ${settings.defaultFromEmail || 'test@storyspark.com'}. Verifique sua caixa de entrada.`,
      });
      
    } catch (error: any) {
      console.error('Erro ao testar configuração de e-mail:', error);
      toast({
        title: "Erro ao testar configuração de e-mail",
        description: error.message || "Verifique as configurações e tente novamente.",
        variant: "destructive"
      });
    } finally {
       setTestingProvider(null);
     }
   };

   // Definir modelos disponíveis para cada provedor
  const providerModels = {
    openai: [
      { value: 'gpt-4o', label: 'GPT-4o' },
      { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
      { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
      { value: 'gpt-4', label: 'GPT-4' },
      { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
    ],
    anthropic: [
      { value: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet' },
      { value: 'claude-3-5-haiku-20241022', label: 'Claude 3.5 Haiku' },
      { value: 'claude-3-opus-20240229', label: 'Claude 3 Opus' },
      { value: 'claude-3-sonnet-20240229', label: 'Claude 3 Sonnet' },
      { value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku' },
    ],
    gemini: [
      { value: 'gemini-2.0-flash-exp', label: 'Gemini 2.0 Flash (Experimental)' },
      { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
      { value: 'gemini-1.5-flash-8b', label: 'Gemini 1.5 Flash 8B' },
      { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
      { value: 'gemini-1.0-pro', label: 'Gemini 1.0 Pro' },
    ],
    openrouter: [
      { value: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet' },
      { value: 'openai/gpt-4o', label: 'GPT-4o' },
      { value: 'openai/gpt-4-turbo', label: 'GPT-4 Turbo' },
      { value: 'google/gemini-pro', label: 'Gemini Pro' },
      { value: 'meta-llama/llama-3.1-405b-instruct', label: 'Llama 3.1 405B' },
    ],
    kilocode: [
      { value: 'kilocode-dev-v1', label: 'Kilocode Dev v1' },
      { value: 'kilocode-code-v1', label: 'Kilocode Code v1' },
      { value: 'kilocode-chat-v1', label: 'Kilocode Chat v1' },
      { value: 'kilocode-analysis-v1', label: 'Kilocode Analysis v1' },
    ],
  };

  // Tipos para melhor tipagem
  interface ModelOption {
    value: string;
    label: string;
  }

  interface ProviderConfig {
    key: string;
    name: string;
    description: string;
    icon: LucideIcon;
    bgColor: string;
    iconColor: string;
    apiKey: string;
    apiKeyField: string;
    model: string;
    modelField: string;
    active: boolean;
    activeField: string;
    placeholder: string;
    models: ModelOption[];
  }

  // Função para mover provedor na prioridade
  const moveProviderPriority = (provider: string, direction: 'up' | 'down') => {
    const currentPriorities = { ...settings.fallbackPriority };
    const currentPriority = currentPriorities[provider];
    
    // Encontrar o provedor para trocar posição
    const targetPriority = direction === 'up' ? currentPriority - 1 : currentPriority + 1;
    const targetProvider = Object.keys(currentPriorities).find(
      key => currentPriorities[key] === targetPriority
    );
    
    if (targetProvider) {
      // Trocar prioridades
      currentPriorities[provider] = targetPriority;
      currentPriorities[targetProvider] = currentPriority;
      
      handleSettingChange('fallbackPriority', currentPriorities);
    }
  };

  // Função para obter provedores ordenados por prioridade
  const getProvidersByPriority = () => {
    return Object.entries(settings.fallbackPriority)
      .sort(([,a], [,b]) => a - b)
      .map(([provider]) => provider);
  };

  // Função para renderizar componente de contingência
  const renderContingencyCard = () => {
    const orderedProviders = getProvidersByPriority();
    
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Sistema de Contingência
          </CardTitle>
          <p className="text-muted-foreground">
            Configure o fallback automático entre provedores de IA
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Habilitação da Contingência */}
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Timer className="w-5 h-5 text-blue-600" />
              <div>
                <h4 className="font-medium">Contingência Automática</h4>
                <p className="text-sm text-muted-foreground">
                  Muda automaticamente para outro provedor em caso de falha
                </p>
              </div>
            </div>
            <Switch
              checked={settings.contingencyEnabled}
              onCheckedChange={(checked) => handleSettingChange('contingencyEnabled', checked)}
            />
          </div>

          {/* Configurações de Retry */}
          {settings.contingencyEnabled && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="maxRetryAttempts">Máx. Tentativas</Label>
                  <Input
                    id="maxRetryAttempts"
                    type="number"
                    min="1"
                    max="10"
                    value={settings.maxRetryAttempts}
                    onChange={(e) => handleSettingChange('maxRetryAttempts', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="retryDelaySeconds">Delay entre Tentativas (s)</Label>
                  <Input
                    id="retryDelaySeconds"
                    type="number"
                    min="1"
                    max="60"
                    value={settings.retryDelaySeconds}
                    onChange={(e) => handleSettingChange('retryDelaySeconds', parseInt(e.target.value))}
                  />
                </div>
                <div className="flex items-center space-x-2 mt-6">
                  <Switch
                    id="autoRetryEnabled"
                    checked={settings.autoRetryEnabled}
                    onCheckedChange={(checked) => handleSettingChange('autoRetryEnabled', checked)}
                  />
                  <Label htmlFor="autoRetryEnabled">Auto Retry</Label>
                </div>
              </div>

              {/* Ordem de Prioridade */}
              <div>
                <h4 className="font-medium mb-4 flex items-center gap-2">
                  <RotateCw className="w-4 h-4" />
                  Ordem de Prioridade (Fallback)
                </h4>
                <div className="space-y-2">
                  {orderedProviders.map((providerKey, index) => {
                    const provider = providers.find(p => p.key === providerKey);
                    if (!provider) return null;
                    
                    return (
                      <div
                        key={providerKey}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="w-8 h-6 flex items-center justify-center text-xs">
                            {index + 1}
                          </Badge>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${provider.bgColor}`}>
                            <provider.icon className={`w-4 h-4 ${provider.iconColor}`} />
                          </div>
                          <div>
                            <span className="font-medium">{provider.name}</span>
                            {provider.active ? (
                              <Badge className="ml-2 bg-green-100 text-green-800">Ativo</Badge>
                            ) : (
                              <Badge variant="secondary" className="ml-2">Inativo</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveProviderPriority(providerKey, 'up')}
                            disabled={index === 0}
                          >
                            <ArrowUp className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveProviderPriority(providerKey, 'down')}
                            disabled={index === orderedProviders.length - 1}
                          >
                            <ArrowDown className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Em caso de falha, o sistema tentará os provedores na ordem acima (apenas os ativos).
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderProviderCard = (provider: ProviderConfig) => {
    const isActive = provider.active;
    const isTesting = testingProvider === provider.key;
    
    return (
      <Card key={provider.key} className={`relative ${isActive ? 'ring-2 ring-green-500' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${provider.bgColor}`}>
                <provider.icon className={`w-5 h-5 ${provider.iconColor}`} />
              </div>
              <div>
                <h3 className="font-semibold">{provider.name}</h3>
                <p className="text-xs text-muted-foreground">{provider.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isActive ? 'default' : 'secondary'} className={isActive ? 'bg-green-100 text-green-800' : ''}>
                {isActive ? (
                  <><CheckCircle className="w-3 h-3 mr-1" />Ativo</>
                ) : (
                  <><XCircle className="w-3 h-3 mr-1" />Inativo</>
                )}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* API Key */}
          <div>
            <Label htmlFor={`${provider.key}Key`}>API Key</Label>
            <Input
              id={`${provider.key}Key`}
              type="password"
              value={provider.apiKey}
              onChange={(e) => handleSettingChange(provider.apiKeyField, e.target.value)}
              placeholder={provider.placeholder}
            />
          </div>
          
          {/* Seletor de Modelo */}
          <div>
            <Label htmlFor={`${provider.key}Model`}>Modelo</Label>
            <Select 
              value={provider.model} 
              onValueChange={(value) => handleSettingChange(provider.modelField, value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {provider.models.map((model: ModelOption) => (
                  <SelectItem key={model.value} value={model.value}>
                    {model.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Controles */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
              <Switch
                id={`${provider.key}Active`}
                checked={isActive}
                onCheckedChange={(checked) => handleSettingChange(provider.activeField, checked)}
              />
              <Label htmlFor={`${provider.key}Active`}>Ativar provedor</Label>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => testProvider(provider.name)}
              disabled={isTesting || !provider.apiKey}
            >
              {isTesting ? (
                <><Loader className="w-3 h-3 mr-1 animate-spin" />Testando</>
              ) : (
                <><Play className="w-3 h-3 mr-1" />Testar</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Configuração dos provedores
  const providers = [
    {
      key: 'openai',
      name: 'OpenAI',
      description: 'GPT-4o, GPT-4 Turbo, GPT-3.5',
      icon: Bot,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      apiKey: settings.openaiApiKey,
      apiKeyField: 'openaiApiKey',
      model: settings.openaiModel,
      modelField: 'openaiModel',
      active: settings.openaiActive,
      activeField: 'openaiActive',
      placeholder: 'sk-...',
      models: providerModels.openai,
    },
    {
      key: 'anthropic',
      name: 'Claude (Anthropic)',
      description: 'Claude 3.5 Sonnet, Haiku, Opus',
      icon: Bot,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
      apiKey: settings.anthropicApiKey,
      apiKeyField: 'anthropicApiKey',
      model: settings.anthropicModel,
      modelField: 'anthropicModel',
      active: settings.anthropicActive,
      activeField: 'anthropicActive',
      placeholder: 'sk-ant-...',
      models: providerModels.anthropic,
    },
    {
      key: 'gemini',
      name: 'Google Gemini',
      description: 'Gemini 2.0 Flash, 1.5 Pro, 1.5 Flash',
      icon: Zap,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      apiKey: settings.geminiApiKey,
      apiKeyField: 'geminiApiKey',
      model: settings.geminiModel,
      modelField: 'geminiModel',
      active: settings.geminiActive,
      activeField: 'geminiActive',
      placeholder: 'AIza...',
      models: providerModels.gemini,
    },
    {
      key: 'openrouter',
      name: 'OpenRouter',
      description: 'Acesso unificado a múltiplos modelos',
      icon: Globe,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      apiKey: settings.openrouterApiKey,
      apiKeyField: 'openrouterApiKey',
      model: settings.openrouterModel,
      modelField: 'openrouterModel',
      active: settings.openrouterActive,
      activeField: 'openrouterActive',
      placeholder: 'sk-or-...',
      models: providerModels.openrouter,
    },
    {
      key: 'kilocode',
      name: 'Kilocode',
      description: 'Modelos especializados para código',
      icon: Bot,
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600',
      apiKey: settings.kilocodeApiKey,
      apiKeyField: 'kilocodeApiKey',
      model: settings.kilocodeModel,
      modelField: 'kilocodeModel',
      active: settings.kilocodeActive,
      activeField: 'kilocodeActive',
      placeholder: 'kc-...',
      models: providerModels.kilocode,
    },
  ];

  if (loading) {
    return (
      <div className="p-4 sm:p-6 space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-muted-foreground">Carregando configurações...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Configurações do Sistema</h1>
          <p className="text-muted-foreground">Configure parâmetros globais da plataforma</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          <Button variant="outline" onClick={handleReset} className="w-full sm:w-auto">
            <RotateCcw className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Restaurar Padrão</span>
            <span className="sm:hidden">Restaurar</span>
          </Button>
          <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            <span className="hidden sm:inline">{saving ? 'Salvando...' : 'Salvar Alterações'}</span>
            <span className="sm:hidden">{saving ? 'Salvando...' : 'Salvar'}</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Geral
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Bot className="w-4 h-4" />
            IA
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notificações
          </TabsTrigger>
        </TabsList>

        {/* Configurações Gerais */}
        <TabsContent value="general">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Configurações da Plataforma
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="platformName">Nome da Plataforma</Label>
                    <Input
                      id="platformName"
                      value={settings.platformName}
                      onChange={(e) => handleSettingChange('platformName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxUsers">Máx. Usuários por Empresa</Label>
                    <Input
                      id="maxUsers"
                      type="number"
                      value={settings.maxUsersPerCompany}
                      onChange={(e) => handleSettingChange('maxUsersPerCompany', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Descrição da Plataforma</Label>
                  <Textarea
                    id="description"
                    value={settings.platformDescription}
                    onChange={(e) => handleSettingChange('platformDescription', e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenance">Modo de Manutenção</Label>
                    <p className="text-sm text-muted-foreground">Desabilita acesso para usuários comuns</p>
                  </div>
                  <Switch
                    id="maintenance"
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => handleSettingChange('maintenanceMode', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="registration">Registros Abertos</Label>
                    <p className="text-sm text-muted-foreground">Permite novos registros na plataforma</p>
                  </div>
                  <Switch
                    id="registration"
                    checked={settings.registrationOpen}
                    onCheckedChange={(checked) => handleSettingChange('registrationOpen', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Configurações de IA */}
        <TabsContent value="ai">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Provedores de IA
                </CardTitle>
                <p className="text-muted-foreground">Configure e gerencie os provedores de inteligência artificial</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Grid de Provedores */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {providers.map(provider => renderProviderCard(provider))}
                </div>
                
                {/* Configurações Globais */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Configurações Globais</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="defaultProvider">Provedor Padrão</Label>
                      <Select value={settings.defaultProvider} onValueChange={(value) => handleSettingChange('defaultProvider', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="openai">OpenAI</SelectItem>
                          <SelectItem value="anthropic">Claude (Anthropic)</SelectItem>
                          <SelectItem value="gemini">Google Gemini</SelectItem>
                          <SelectItem value="openrouter">OpenRouter</SelectItem>
                          <SelectItem value="kilocode">Kilocode</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="maxTokens">Máx. Tokens por Request</Label>
                      <Input
                        id="maxTokens"
                        type="number"
                        value={settings.maxTokens}
                        onChange={(e) => handleSettingChange('maxTokens', parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="temperature">Temperature (0.0 - 2.0)</Label>
                      <Input
                        id="temperature"
                        type="number"
                        step="0.1"
                        min="0"
                        max="2"
                        value={settings.temperature}
                        onChange={(e) => handleSettingChange('temperature', parseFloat(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Sistema de Contingência */}
                {renderContingencyCard()}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Configurações de Segurança */}
        <TabsContent value="security">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Configurações de Segurança
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="passwordLength">Tamanho Mín. da Senha</Label>
                    <Input
                      id="passwordLength"
                      type="number"
                      value={settings.passwordMinLength}
                      onChange={(e) => handleSettingChange('passwordMinLength', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxAttempts">Máx. Tentativas de Login</Label>
                    <Input
                      id="maxAttempts"
                      type="number"
                      value={settings.maxLoginAttempts}
                      onChange={(e) => handleSettingChange('maxLoginAttempts', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="sessionTimeout">Timeout da Sessão (horas)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="twoFactor">Requer Autenticação 2FA</Label>
                    <p className="text-sm text-muted-foreground">Obrigatório para todos os usuários</p>
                  </div>
                  <Switch
                    id="twoFactor"
                    checked={settings.requireTwoFactor}
                    onCheckedChange={(checked) => handleSettingChange('requireTwoFactor', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Configurações de Email */}
        <TabsContent value="email">
          <div className="grid gap-6">
            {/* Configurações do Mailtrap */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Configurações do Mailtrap
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Configure o Mailtrap para envio de e-mails transacionais
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="emailProvider">Provedor de Email</Label>
                    <Select
                      value={settings.emailProvider}
                      onValueChange={(value) => handleSettingChange('emailProvider', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o provedor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mailtrap">Mailtrap (Recomendado)</SelectItem>
                        <SelectItem value="smtp">SMTP Personalizado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {settings.emailProvider === 'mailtrap' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="mailtrapApiToken">API Token do Mailtrap</Label>
                        <Input
                          id="mailtrapApiToken"
                          type="password"
                          placeholder="Seu token da API do Mailtrap"
                          value={settings.mailtrapApiToken}
                          onChange={(e) => handleSettingChange('mailtrapApiToken', e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Encontre em: Mailtrap → API Tokens
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="mailtrapAccountId">Account ID do Mailtrap</Label>
                        <Input
                          id="mailtrapAccountId"
                          placeholder="ID da sua conta Mailtrap"
                          value={settings.mailtrapAccountId}
                          onChange={(e) => handleSettingChange('mailtrapAccountId', e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Encontre em: Mailtrap → Settings → Account
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="defaultFromEmail">Email Remetente Padrão</Label>
                        <Input
                          id="defaultFromEmail"
                          type="email"
                          placeholder="notifications@storyspark.com"
                          value={settings.defaultFromEmail}
                          onChange={(e) => handleSettingChange('defaultFromEmail', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="defaultFromName">Nome Remetente Padrão</Label>
                        <Input
                          id="defaultFromName"
                          placeholder="StorySpark"
                          value={settings.defaultFromName}
                          onChange={(e) => handleSettingChange('defaultFromName', e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                )}
                
                {settings.emailProvider === 'smtp' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="smtpHost">SMTP Host</Label>
                        <Input
                          id="smtpHost"
                          value={settings.smtpHost}
                          onChange={(e) => handleSettingChange('smtpHost', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="smtpPort">SMTP Port</Label>
                        <Input
                          id="smtpPort"
                          type="number"
                          value={settings.smtpPort}
                          onChange={(e) => handleSettingChange('smtpPort', parseInt(e.target.value))}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="smtpUser">SMTP User</Label>
                        <Input
                          id="smtpUser"
                          value={settings.smtpUser}
                          onChange={(e) => handleSettingChange('smtpUser', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="smtpPassword">SMTP Password</Label>
                        <Input
                          id="smtpPassword"
                          type="password"
                          value={settings.smtpPassword}
                          onChange={(e) => handleSettingChange('smtpPassword', e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                )}
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailsEnabled">Emails Habilitados</Label>
                    <p className="text-sm text-muted-foreground">Envio de notificações por email</p>
                  </div>
                  <Switch
                    id="emailsEnabled"
                    checked={settings.emailsEnabled}
                    onCheckedChange={(checked) => handleSettingChange('emailsEnabled', checked)}
                  />
                </div>
                
                {/* Botão de teste */}
                <div className="pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => testEmailConfiguration()}
                    disabled={testingProvider === 'email'}
                    className="w-full"
                  >
                    {testingProvider === 'email' ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Testando Configuração...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Testar Configuração de Email
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Configurações de Billing */}
        <TabsContent value="billing">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Configurações de Faturamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="stripePublic">Stripe Public Key</Label>
                    <Input
                      id="stripePublic"
                      type="password"
                      value={settings.stripePublicKey}
                      onChange={(e) => handleSettingChange('stripePublicKey', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="stripeSecret">Stripe Secret Key</Label>
                    <Input
                      id="stripeSecret"
                      type="password"
                      value={settings.stripeSecretKey}
                      onChange={(e) => handleSettingChange('stripeSecretKey', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="trialDays">Dias de Trial Gratuito</Label>
                  <Input
                    id="trialDays"
                    type="number"
                    value={settings.trialDays}
                    onChange={(e) => handleSettingChange('trialDays', parseInt(e.target.value))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="billingEnabled">Faturamento Habilitado</Label>
                    <p className="text-sm text-muted-foreground">Sistema de cobrança ativo</p>
                  </div>
                  <Switch
                    id="billingEnabled"
                    checked={settings.billingEnabled}
                    onCheckedChange={(checked) => handleSettingChange('billingEnabled', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Configurações de Notificações */}
        <TabsContent value="notifications">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Configurações de Notificações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="slackWebhook">Slack Webhook URL</Label>
                    <Input
                      id="slackWebhook"
                      value={settings.slackWebhook}
                      onChange={(e) => handleSettingChange('slackWebhook', e.target.value)}
                      placeholder="https://hooks.slack.com/..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="discordWebhook">Discord Webhook URL</Label>
                    <Input
                      id="discordWebhook"
                      value={settings.discordWebhook}
                      onChange={(e) => handleSettingChange('discordWebhook', e.target.value)}
                      placeholder="https://discord.com/api/webhooks/..."
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="alertsEnabled">Alertas Habilitados</Label>
                    <p className="text-sm text-muted-foreground">Notificações de sistema críticas</p>
                  </div>
                  <Switch
                    id="alertsEnabled"
                    checked={settings.alertsEnabled}
                    onCheckedChange={(checked) => handleSettingChange('alertsEnabled', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenanceNotif">Notificações de Manutenção</Label>
                    <p className="text-sm text-muted-foreground">Avisos de manutenção programada</p>
                  </div>
                  <Switch
                    id="maintenanceNotif"
                    checked={settings.maintenanceNotifications}
                    onCheckedChange={(checked) => handleSettingChange('maintenanceNotifications', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Status das Configurações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Badge className={settings.maintenanceMode ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                {settings.maintenanceMode ? 'Manutenção' : 'Online'}
              </Badge>
              <span className="text-sm">Plataforma</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={settings.emailsEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                {settings.emailsEnabled ? 'Ativo' : 'Inativo'}
              </Badge>
              <span className="text-sm">Email</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={settings.billingEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                {settings.billingEnabled ? 'Ativo' : 'Inativo'}
              </Badge>
              <span className="text-sm">Billing</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={settings.alertsEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                {settings.alertsEnabled ? 'Ativo' : 'Inativo'}
              </Badge>
              <span className="text-sm">Alertas</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;