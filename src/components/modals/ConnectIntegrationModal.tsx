import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  ExternalLink, 
  Key,
  Globe,
  Settings,
  Users,
  BarChart3
} from 'lucide-react';

interface ConnectIntegrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  integration?: {
    id: string;
    name: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    connected?: boolean;
  };
}

export const ConnectIntegrationModal = ({ open, onOpenChange, integration }: ConnectIntegrationModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionSuccess, setConnectionSuccess] = useState(false);

  const [permissions, setPermissions] = useState({
    readPosts: true,
    writePosts: true,
    readAnalytics: true,
    manageComments: false,
    readProfile: true
  });

  const handleConnect = async () => {
    setIsConnecting(true);
    
    // Simular processo OAuth
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsConnecting(false);
    setConnectionSuccess(true);
    setCurrentStep(3);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center mx-auto">
                {integration?.icon && <integration.icon className="w-8 h-8 text-primary" />}
              </div>
              <div>
                <h3 className="text-lg font-semibold">Conectar {integration?.name}</h3>
                <p className="text-muted-foreground">{integration?.description}</p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Shield className="w-5 h-5 text-primary" />
                  O que você pode fazer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                  <div>
                    <p className="font-medium">Publicação automática</p>
                    <p className="text-sm text-muted-foreground">
                      Publique conteúdo diretamente nas suas contas
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                  <div>
                    <p className="font-medium">Analytics em tempo real</p>
                    <p className="text-sm text-muted-foreground">
                      Monitore performance e engagement
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                  <div>
                    <p className="font-medium">Agendamento inteligente</p>
                    <p className="text-sm text-muted-foreground">
                      Publique no horário ideal automaticamente
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-800 dark:text-amber-200">
                    Informações importantes
                  </p>
                  <p className="text-amber-700 dark:text-amber-300 mt-1">
                    Você será redirecionado para {integration?.name} para autorizar a conexão. 
                    Seus dados ficam seguros e você pode revogar o acesso a qualquer momento.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center mx-auto">
                <Key className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Configurar Permissões</h3>
                <p className="text-muted-foreground">
                  Escolha quais funcionalidades você quer habilitar
                </p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Permissões de Acesso</CardTitle>
                <CardDescription>
                  Você pode alterar essas configurações depois
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Ler posts e analytics</p>
                      <p className="text-sm text-muted-foreground">Necessário para relatórios</p>
                    </div>
                  </div>
                  <Switch 
                    checked={permissions.readPosts}
                    onCheckedChange={(checked) => 
                      setPermissions(prev => ({ ...prev, readPosts: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Publicar conteúdo</p>
                      <p className="text-sm text-muted-foreground">Criar e agendar posts</p>
                    </div>
                  </div>
                  <Switch 
                    checked={permissions.writePosts}
                    onCheckedChange={(checked) => 
                      setPermissions(prev => ({ ...prev, writePosts: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Acessar analytics</p>
                      <p className="text-sm text-muted-foreground">Métricas de performance</p>
                    </div>
                  </div>
                  <Switch 
                    checked={permissions.readAnalytics}
                    onCheckedChange={(checked) => 
                      setPermissions(prev => ({ ...prev, readAnalytics: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Gerenciar comentários</p>
                      <p className="text-sm text-muted-foreground">Responder e moderar</p>
                    </div>
                  </div>
                  <Switch 
                    checked={permissions.manageComments}
                    onCheckedChange={(checked) => 
                      setPermissions(prev => ({ ...prev, manageComments: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Informações do perfil</p>
                      <p className="text-sm text-muted-foreground">Nome, foto e dados básicos</p>
                    </div>
                  </div>
                  <Switch 
                    checked={permissions.readProfile}
                    onCheckedChange={(checked) => 
                      setPermissions(prev => ({ ...prev, readProfile: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-success/10 rounded-lg flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-success">Conexão estabelecida!</h3>
                <p className="text-muted-foreground">
                  {integration?.name} foi conectado com sucesso
                </p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Contas conectadas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">@minha_empresa</p>
                      <p className="text-sm text-muted-foreground">Conta principal</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Ativa</Badge>
                </div>
              </CardContent>
            </Card>

            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-800 dark:text-blue-200">
                    Próximos passos
                  </p>
                  <p className="text-blue-700 dark:text-blue-300 mt-1">
                    Sua integração está configurada! Agora você pode criar campanhas, 
                    agendar posts e acompanhar analytics diretamente do StorySpark.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {currentStep === 3 ? 'Integração Concluída' : `Conectar ${integration?.name}`}
          </DialogTitle>
          <DialogDescription>
            {currentStep === 1 && 'Configure a conexão com sua conta'}
            {currentStep === 2 && 'Defina as permissões de acesso'}
            {currentStep === 3 && 'Sua integração está pronta para uso'}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        {currentStep < 3 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Passo {currentStep} de 2</span>
              <span>{Math.round((currentStep / 2) * 100)}%</span>
            </div>
            <Progress value={(currentStep / 2) * 100} className="h-2" />
          </div>
        )}

        {renderStepContent()}

        <div className="flex justify-between pt-6 border-t">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            {currentStep === 3 ? 'Fechar' : 'Cancelar'}
          </Button>
          
          <div className="flex gap-2">
            {currentStep > 1 && currentStep < 3 && (
              <Button 
                variant="outline"
                onClick={() => setCurrentStep(prev => prev - 1)}
              >
                Voltar
              </Button>
            )}
            
            {currentStep === 1 && (
              <Button 
                onClick={() => setCurrentStep(2)}
                className="bg-gradient-primary hover:opacity-90"
              >
                Continuar
              </Button>
            )}
            
            {currentStep === 2 && (
              <Button 
                onClick={handleConnect}
                disabled={isConnecting}
                className="bg-gradient-primary hover:opacity-90"
              >
                {isConnecting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Conectando...
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Conectar {integration?.name}
                  </>
                )}
              </Button>
            )}
            
            {currentStep === 3 && (
              <Button 
                onClick={() => onOpenChange(false)}
                className="bg-gradient-primary hover:opacity-90"
              >
                Começar a usar
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};