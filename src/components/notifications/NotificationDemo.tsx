import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, CheckCircle, AlertTriangle, AlertCircle, Info, LogIn, LogOut, Badge } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';

interface NotificationDemoProps {
  systemToastNotifications?: {
    showSystemNotification: (type: 'success' | 'error' | 'warning' | 'info', title: string, description?: string) => string;
  };
}

export const NotificationDemo: React.FC<NotificationDemoProps> = ({ systemToastNotifications }) => {
  const { addNotification } = useNotifications();

  const handleAddSuccessNotification = () => {
    if (systemToastNotifications) {
      systemToastNotifications.showSystemNotification(
        'success',
        'Campanha publicada com sucesso',
        'Sua campanha "Oferta Especial" foi publicada e está ativa.'
      );
    } else {
      console.log('Campanha publicada com sucesso - Toast notification');
    }
  };

  const handleAddErrorNotification = () => {
    if (systemToastNotifications) {
      systemToastNotifications.showSystemNotification(
        'error',
        'Erro ao processar pagamento',
        'Não foi possível processar o pagamento. Verifique os dados do cartão.'
      );
    } else {
      console.log('Erro ao processar pagamento - Toast notification');
    }
  };

  const handleAddWarningNotification = () => {
    if (systemToastNotifications) {
      systemToastNotifications.showSystemNotification(
        'warning',
        'Limite de uso próximo',
        'Você usou 85% do seu limite mensal de créditos.'
      );
    } else {
      console.log('Limite de uso próximo - Toast notification');
    }
  };

  const handleAddInfoNotification = () => {
    if (systemToastNotifications) {
      systemToastNotifications.showSystemNotification(
        'info',
        'Nova funcionalidade disponível',
        'Agora você pode agendar posts para múltiplas redes sociais.'
      );
    } else {
      console.log('Nova funcionalidade disponível - Toast notification');
    }
  };

  const handleSimulateLogin = () => {
    if (systemToastNotifications) {
      systemToastNotifications.showSystemNotification(
        'success',
        'Login realizado com sucesso!',
        'Bem-vindo de volta ao StorySpark.'
      );
    } else {
      console.log('Login realizado com sucesso - Toast notification');
    }
  };

  const handleSimulateLogout = () => {
    if (systemToastNotifications) {
      systemToastNotifications.showSystemNotification(
        'success',
        'Logout realizado',
        'Você foi desconectado com sucesso.'
      );
    } else {
      console.log('Logout realizado - Toast notification');
    }
  };

  const handleAddRegularNotification = () => {
    addNotification({
      title: 'Nova notificação regular',
      message: 'Esta notificação aparecerá no badge e no painel de notificações.',
      type: 'info',
      action: {
        label: 'Ver detalhes',
        onClick: () => console.log('Ver detalhes da notificação regular')
      }
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Sistema de Notificações
        </CardTitle>
        <CardDescription>
          Teste o sistema de notificações clicando nos botões abaixo.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Notificações do Sistema (Toast):</p>
          
          <Button 
            onClick={handleAddSuccessNotification}
            className="w-full justify-start gap-2"
            variant="outline"
            size="sm"
          >
            <CheckCircle className="h-4 w-4 text-green-600" />
            Adicionar Sucesso
          </Button>

          <Button 
            onClick={handleAddErrorNotification}
            className="w-full justify-start gap-2"
            variant="outline"
            size="sm"
          >
            <AlertCircle className="h-4 w-4 text-red-600" />
            Adicionar Erro
          </Button>

          <Button 
            onClick={handleAddWarningNotification}
            className="w-full justify-start gap-2"
            variant="outline"
            size="sm"
          >
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            Adicionar Aviso
          </Button>

          <Button 
            onClick={handleAddInfoNotification}
            className="w-full justify-start gap-2"
            variant="outline"
            size="sm"
          >
            <Info className="h-4 w-4 text-blue-600" />
            Adicionar Info
          </Button>
        </div>

        <div className="border-t pt-3">
          <p className="text-xs font-medium text-muted-foreground mb-2">Simular eventos de autenticação:</p>
          
          <Button 
            onClick={handleSimulateLogin}
            className="w-full justify-start gap-2"
            variant="outline"
            size="sm"
          >
            <LogIn className="h-4 w-4 text-green-600" />
            Simular Login
          </Button>

          <Button 
            onClick={handleSimulateLogout}
            className="w-full justify-start gap-2"
            variant="outline"
            size="sm"
          >
            <LogOut className="h-4 w-4 text-blue-600" />
            Simular Logout
          </Button>
        </div>

        <div className="border-t pt-3">
          <p className="text-xs font-medium text-muted-foreground mb-2">Notificação Regular (afeta badge):</p>
          
          <Button 
            onClick={handleAddRegularNotification}
            className="w-full justify-start gap-2"
            variant="outline"
            size="sm"
          >
            <Badge className="h-4 w-4 text-purple-600" />
            Adicionar Notificação Regular
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};