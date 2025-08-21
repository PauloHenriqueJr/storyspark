import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
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
  RotateCcw
} from 'lucide-react';

const AdminSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    // Configurações Gerais
    platformName: 'StorySpark',
    platformDescription: 'Plataforma de criação de conteúdo com IA',
    maintenanceMode: false,
    registrationOpen: true,
    maxUsersPerCompany: 25,
    
    // Configurações de IA
    openaiApiKey: '••••••••••••••••',
    claudeApiKey: '••••••••••••••••',
    defaultModel: 'gpt-4',
    maxTokensPerRequest: 4000,
    aiResponseTimeout: 30,
    
    // Configurações de Email
    smtpHost: 'smtp.storyspark.com',
    smtpPort: 587,
    smtpUser: 'notifications@storyspark.com',
    smtpPassword: '••••••••••••••••',
    emailsEnabled: true,
    
    // Configurações de Segurança
    passwordMinLength: 8,
    requireTwoFactor: false,
    sessionTimeout: 24,
    maxLoginAttempts: 5,
    
    // Configurações de Billing
    stripePublicKey: '••••••••••••••••',
    stripeSecretKey: '••••••••••••••••',
    billingEnabled: true,
    trialDays: 14,
    
    // Configurações de Notificações
    slackWebhook: '',
    discordWebhook: '',
    alertsEnabled: true,
    maintenanceNotifications: true
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    console.log('Salvando configurações:', settings);
    
    // Simular salvamento das configurações
    toast({
      title: "Configurações salvas",
      description: "Todas as configurações do sistema foram atualizadas com sucesso.",
    });
    
    // Em produção, aqui seria feita a chamada para API
    // await saveAdminSettings(settings);
  };

  const handleReset = () => {
    console.log('Resetando configurações para padrão');
    
    // Resetar para valores padrão
    setSettings({
      platformName: 'StorySpark',
      platformDescription: 'Plataforma de Marketing com IA',
      maintenanceMode: false,
      registrationOpen: true,
      maxUsersPerCompany: 25,
      openaiApiKey: '',
      claudeApiKey: '',
      defaultModel: 'gpt-4',
      maxTokensPerRequest: 4000,
      aiResponseTimeout: 30,
      smtpHost: 'smtp.storyspark.com',
      smtpPort: 587,
      smtpUser: 'notifications@storyspark.com',
      smtpPassword: '',
      emailsEnabled: true,
      passwordMinLength: 8,
      requireTwoFactor: false,
      sessionTimeout: 24,
      maxLoginAttempts: 5,
      stripePublicKey: '',
      stripeSecretKey: '',
      billingEnabled: true,
      trialDays: 14,
      slackWebhook: '',
      discordWebhook: '',
      alertsEnabled: true,
      maintenanceNotifications: true
    });
    
    toast({
      title: "Configurações resetadas",
      description: "Todas as configurações foram restauradas para os valores padrão.",
    });
  };

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
          <Button onClick={handleSave} className="w-full sm:w-auto">
            <Save className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Salvar Alterações</span>
            <span className="sm:hidden">Salvar</span>
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
                  Configurações de IA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="openaiKey">OpenAI API Key</Label>
                    <Input
                      id="openaiKey"
                      type="password"
                      value={settings.openaiApiKey}
                      onChange={(e) => handleSettingChange('openaiApiKey', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="claudeKey">Claude API Key</Label>
                    <Input
                      id="claudeKey"
                      type="password"
                      value={settings.claudeApiKey}
                      onChange={(e) => handleSettingChange('claudeApiKey', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="defaultModel">Modelo Padrão</Label>
                    <Select value={settings.defaultModel} onValueChange={(value) => handleSettingChange('defaultModel', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4">GPT-4</SelectItem>
                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                        <SelectItem value="claude-3">Claude 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="maxTokens">Máx. Tokens por Request</Label>
                    <Input
                      id="maxTokens"
                      type="number"
                      value={settings.maxTokensPerRequest}
                      onChange={(e) => handleSettingChange('maxTokensPerRequest', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="timeout">Timeout (segundos)</Label>
                    <Input
                      id="timeout"
                      type="number"
                      value={settings.aiResponseTimeout}
                      onChange={(e) => handleSettingChange('aiResponseTimeout', parseInt(e.target.value))}
                    />
                  </div>
                </div>
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Configurações de Email
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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