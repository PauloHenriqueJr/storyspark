import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Lock, 
  Key, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  Users,
  Database,
  Globe,
  Settings,
  Activity,
  Zap
} from 'lucide-react';

const AdminSecurity = () => {
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorRequired: true,
    passwordComplexity: true,
    sessionTimeout: true,
    ipWhitelist: false,
    apiRateLimit: true,
    dataEncryption: true,
    auditLogging: true,
    backupEncryption: true
  });

  const securityScore = 85;

  const securityPolicies = [
    {
      id: 1,
      name: 'Política de Senhas',
      description: 'Requisitos mínimos para senhas de usuários',
      status: 'active',
      lastUpdated: '2024-01-15',
      compliance: ['LGPD', 'ISO 27001']
    },
    {
      id: 2,
      name: 'Controle de Acesso',
      description: 'Regras de permissões e roles de usuários',
      status: 'active',
      lastUpdated: '2024-01-10',
      compliance: ['LGPD', 'SOC 2']
    },
    {
      id: 3,
      name: 'Retenção de Dados',
      description: 'Política de armazenamento e exclusão de dados',
      status: 'draft',
      lastUpdated: '2024-01-08',
      compliance: ['LGPD']
    }
  ];

  const complianceStatus = [
    { name: 'LGPD', status: 'compliant', score: 95 },
    { name: 'ISO 27001', status: 'partial', score: 78 },
    { name: 'SOC 2', status: 'compliant', score: 92 },
    { name: 'GDPR', status: 'review', score: 85 }
  ];

  const threatDetection = [
    {
      type: 'Tentativas de Login Suspeitas',
      level: 'medium',
      count: 12,
      lastOccurrence: '2 horas atrás'
    },
    {
      type: 'Múltiplos IPs por Usuário',
      level: 'low',
      count: 5,
      lastOccurrence: '1 dia atrás'
    },
    {
      type: 'API Rate Limit Exceeded',
      level: 'high',
      count: 3,
      lastOccurrence: '30 min atrás'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Segurança & Compliance</h1>
          <p className="text-muted-foreground">Configurações de segurança e políticas de compliance</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            Score: {securityScore}%
          </Badge>
          <Button>
            <Settings className="w-4 h-4 mr-2" />
            Configurar
          </Button>
        </div>
      </div>

      {/* Security Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Score de Segurança
          </CardTitle>
          <CardDescription>
            Avaliação geral da postura de segurança da plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Segurança Geral</span>
              <span className="text-2xl font-bold text-primary">{securityScore}%</span>
            </div>
            <Progress value={securityScore} className="h-2" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="font-semibold text-green-800 dark:text-green-300">Forte</div>
                <div className="text-sm text-green-600 dark:text-green-400">Autenticação</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <AlertTriangle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <div className="font-semibold text-yellow-800 dark:text-yellow-300">Atenção</div>
                <div className="text-sm text-yellow-600 dark:text-yellow-400">Backups</div>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="font-semibold text-blue-800 dark:text-blue-300">Monitorado</div>
                <div className="text-sm text-blue-600 dark:text-blue-400">Atividades</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="settings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="settings">Configurações</TabsTrigger>
          <TabsTrigger value="policies">Políticas</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="threats">Ameaças</TabsTrigger>
        </TabsList>

        {/* Security Settings */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Autenticação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="2fa">Autenticação de Dois Fatores</Label>
                    <p className="text-sm text-muted-foreground">Obrigatório para todos os usuários</p>
                  </div>
                  <Switch 
                    id="2fa"
                    checked={securitySettings.twoFactorRequired}
                    onCheckedChange={(checked) => 
                      setSecuritySettings(prev => ({ ...prev, twoFactorRequired: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="password">Complexidade de Senha</Label>
                    <p className="text-sm text-muted-foreground">Requisitos mínimos de senha</p>
                  </div>
                  <Switch 
                    id="password"
                    checked={securitySettings.passwordComplexity}
                    onCheckedChange={(checked) => 
                      setSecuritySettings(prev => ({ ...prev, passwordComplexity: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="session">Timeout de Sessão</Label>
                    <p className="text-sm text-muted-foreground">Auto logout após inatividade</p>
                  </div>
                  <Switch 
                    id="session"
                    checked={securitySettings.sessionTimeout}
                    onCheckedChange={(checked) => 
                      setSecuritySettings(prev => ({ ...prev, sessionTimeout: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Controle de Acesso
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="whitelist">Whitelist de IPs</Label>
                    <p className="text-sm text-muted-foreground">Restringir acesso por IP</p>
                  </div>
                  <Switch 
                    id="whitelist"
                    checked={securitySettings.ipWhitelist}
                    onCheckedChange={(checked) => 
                      setSecuritySettings(prev => ({ ...prev, ipWhitelist: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="ratelimit">Rate Limiting API</Label>
                    <p className="text-sm text-muted-foreground">Limitar requisições por minuto</p>
                  </div>
                  <Switch 
                    id="ratelimit"
                    checked={securitySettings.apiRateLimit}
                    onCheckedChange={(checked) => 
                      setSecuritySettings(prev => ({ ...prev, apiRateLimit: checked }))
                    }
                  />
                </div>
                {securitySettings.ipWhitelist && (
                  <div className="space-y-2">
                    <Label>IPs Permitidos</Label>
                    <Textarea 
                      placeholder="192.168.1.1&#10;10.0.0.1&#10;203.0.113.0/24"
                      className="h-20"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Proteção de Dados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="encryption">Criptografia de Dados</Label>
                    <p className="text-sm text-muted-foreground">AES-256 em repouso</p>
                  </div>
                  <Switch 
                    id="encryption"
                    checked={securitySettings.dataEncryption}
                    onCheckedChange={(checked) => 
                      setSecuritySettings(prev => ({ ...prev, dataEncryption: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="backup-encryption">Backup Criptografado</Label>
                    <p className="text-sm text-muted-foreground">Criptografia de backups</p>
                  </div>
                  <Switch 
                    id="backup-encryption"
                    checked={securitySettings.backupEncryption}
                    onCheckedChange={(checked) => 
                      setSecuritySettings(prev => ({ ...prev, backupEncryption: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="audit">Log de Auditoria</Label>
                    <p className="text-sm text-muted-foreground">Registro de todas as ações</p>
                  </div>
                  <Switch 
                    id="audit"
                    checked={securitySettings.auditLogging}
                    onCheckedChange={(checked) => 
                      setSecuritySettings(prev => ({ ...prev, auditLogging: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Chaves e Certificados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Certificado SSL</Label>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Válido até 15/12/2024</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Chave API Master</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="password"
                      value="sk_live_************************"
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button variant="outline" size="sm">Regenerar</Button>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <Key className="w-4 h-4 mr-2" />
                  Gerenciar Certificados
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Policies */}
        <TabsContent value="policies" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Políticas de Segurança</h2>
            <Button>
              <Zap className="w-4 h-4 mr-2" />
              Nova Política
            </Button>
          </div>
          
          <div className="grid gap-4">
            {securityPolicies.map((policy) => (
              <Card key={policy.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{policy.name}</h3>
                        <Badge variant={policy.status === 'active' ? 'default' : 'secondary'}>
                          {policy.status === 'active' ? 'Ativa' : 'Rascunho'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{policy.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Atualizada em {policy.lastUpdated}
                        </span>
                        <div className="flex gap-1">
                          {policy.compliance.map((comp) => (
                            <Badge key={comp} variant="outline" className="text-xs">
                              {comp}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Editar</Button>
                      <Button variant="outline" size="sm">Ver</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Compliance Status */}
        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {complianceStatus.map((compliance) => (
              <Card key={compliance.name}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{compliance.name}</span>
                    <Badge variant={
                      compliance.status === 'compliant' ? 'default' : 
                      compliance.status === 'partial' ? 'secondary' : 'destructive'
                    }>
                      {compliance.status === 'compliant' ? 'Conforme' : 
                       compliance.status === 'partial' ? 'Parcial' : 'Revisão'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Score de Conformidade</span>
                      <span className="font-semibold">{compliance.score}%</span>
                    </div>
                    <Progress value={compliance.score} className="h-2" />
                    <Button variant="outline" size="sm" className="w-full">
                      Ver Relatório
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Threat Detection */}
        <TabsContent value="threats" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Detecção de Ameaças</h2>
            
            {threatDetection.map((threat, index) => (
              <Alert key={index} className={
                threat.level === 'high' ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20' :
                threat.level === 'medium' ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20' :
                'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20'
              }>
                <AlertTriangle className={`h-4 w-4 ${
                  threat.level === 'high' ? 'text-red-600' :
                  threat.level === 'medium' ? 'text-yellow-600' :
                  'text-blue-600'
                }`} />
                <AlertDescription>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{threat.type}</div>
                      <div className="text-sm opacity-80">
                        {threat.count} ocorrências • Última: {threat.lastOccurrence}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Investigar</Button>
                      <Button variant="outline" size="sm">Resolver</Button>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSecurity;export { AdminSecurity as Component };
