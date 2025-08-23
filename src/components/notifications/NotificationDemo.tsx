import React from 'react';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/hooks/useNotifications';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

export const NotificationDemo = () => {
  const { addNotification } = useNotifications();

  const handleAddSuccessNotification = () => {
    addNotification({
      title: 'Campanha publicada com sucesso',
      message: 'Sua campanha "Oferta Especial" foi publicada e está ativa.',
      type: 'success',
      action: {
        label: 'Ver campanha',
        onClick: () => console.log('Navegando para campanha...')
      }
    });
  };

  const handleAddErrorNotification = () => {
    addNotification({
      title: 'Erro ao processar pagamento',
      message: 'Não foi possível processar o pagamento. Verifique os dados do cartão.',
      type: 'error',
      action: {
        label: 'Tentar novamente',
        onClick: () => console.log('Tentando novamente...')
      }
    });
  };

  const handleAddWarningNotification = () => {
    addNotification({
      title: 'Limite de uso próximo',
      message: 'Você usou 85% do seu limite mensal de créditos.',
      type: 'warning',
      action: {
        label: 'Upgrade do plano',
        onClick: () => console.log('Navegando para billing...')
      }
    });
  };

  const handleAddInfoNotification = () => {
    addNotification({
      title: 'Nova funcionalidade disponível',
      message: 'Agora você pode agendar posts para múltiplas redes sociais.',
      type: 'info',
      action: {
        label: 'Explorar',
        onClick: () => console.log('Navegando para social scheduler...')
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
        <Button 
          onClick={handleAddSuccessNotification}
          className="w-full justify-start gap-2"
          variant="outline"
        >
          <CheckCircle className="h-4 w-4 text-green-600" />
          Adicionar Sucesso
        </Button>

        <Button 
          onClick={handleAddErrorNotification}
          className="w-full justify-start gap-2"
          variant="outline"
        >
          <AlertCircle className="h-4 w-4 text-red-600" />
          Adicionar Erro
        </Button>

        <Button 
          onClick={handleAddWarningNotification}
          className="w-full justify-start gap-2"
          variant="outline"
        >
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          Adicionar Aviso
        </Button>

        <Button 
          onClick={handleAddInfoNotification}
          className="w-full justify-start gap-2"
          variant="outline"
        >
          <Info className="h-4 w-4 text-blue-600" />
          Adicionar Info
        </Button>
      </CardContent>
    </Card>
  );
};