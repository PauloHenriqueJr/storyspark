import React from 'react';
import { Button } from '@/components/ui/button';
import { useSystemToastNotifications } from '@/hooks/useSystemToastNotifications';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

export const NotificationDemo = () => {
  const { showSuccess, showError, showWarning, showInfo } = useSystemToastNotifications();

  const handleAddSuccessNotification = () => {
    showSuccess(
      'Campanha publicada com sucesso',
      'Sua campanha "Oferta Especial" foi publicada e está ativa.'
    );
  };

  const handleAddErrorNotification = () => {
    showError(
      'Erro ao processar pagamento',
      'Não foi possível processar o pagamento. Verifique os dados do cartão.'
    );
  };

  const handleAddWarningNotification = () => {
    showWarning(
      'Limite de uso próximo',
      'Você usou 85% do seu limite mensal de créditos.'
    );
  };

  const handleAddInfoNotification = () => {
    showInfo(
      'Nova funcionalidade disponível',
      'Agora você pode agendar posts para múltiplas redes sociais.'
    );
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