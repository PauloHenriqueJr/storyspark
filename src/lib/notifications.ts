import { toast } from "@/hooks/use-toast";

// Padronização de toasts para toda a aplicação

export const notifications = {
  // Success notifications
  success: {
    copyGenerated: () => toast({
      title: "✅ Copy gerada com sucesso!",
      description: "Sua copy foi criada e está pronta para uso.",
      className: "border-success/50 bg-success/5"
    }),
    
    copySaved: (fileName: string) => toast({
      title: "📁 Arquivo salvo!",
      description: `${fileName} foi baixado com sucesso.`,
      className: "border-success/50 bg-success/5"
    }),
    
    copied: () => toast({
      title: "📋 Copiado!",
      description: "Copy foi copiada para a área de transferência.",
      className: "border-success/50 bg-success/5"
    }),
    
    creditsAdded: (amount: number) => toast({
      title: "💰 Créditos adicionados!",
      description: `${amount} créditos foram adicionados à sua conta.`,
      className: "border-success/50 bg-success/5"
    }),
    
    planUpgraded: (plan: string) => toast({
      title: "🚀 Plano atualizado!",
      description: `Seu plano foi atualizado para ${plan} com sucesso.`,
      className: "border-success/50 bg-success/5"
    }),
    
    hookCleared: () => toast({
      title: "⚡ Hook removido!",
      description: "O hook foi removido do composer.",
      className: "border-success/50 bg-success/5"
    }),
    
    hookIntegratedSmart: (hookCategory: string) => toast({
      title: "⚡ Hook integrado inteligentemente!",
      description: `Hook "${hookCategory}" ativou o Modo Mão na Massa para máximo controle e compatibilidade.`,
      className: "border-success/50 bg-success/5"
    })
  },
  
  // Error notifications
  error: {
    generation: () => toast({
      title: "❌ Erro ao gerar copy",
      description: "Tente novamente em alguns instantes.",
      variant: "destructive"
    }),
    
    insufficientCredits: () => toast({
      title: "⚠️ Créditos insuficientes",
      description: "Você precisa de pelo menos 1 crédito para gerar uma copy.",
      variant: "destructive"
    }),
    
    requiredFields: () => toast({
      title: "🧩 Campos obrigatórios",
      description: "Preencha todos os campos obrigatórios do template.",
      variant: "destructive"
    }),
    
    copy: () => toast({
      title: "❌ Erro ao copiar",
      description: "Não foi possível copiar o texto.",
      variant: "destructive"
    }),
    
    loading: () => toast({
      title: "🛑 Erro ao carregar",
      description: "Não foi possível carregar os dados solicitados.",
      variant: "destructive"
    }),
    
    payment: () => toast({
      title: "💳 Erro no pagamento",
      description: "Houve um problema ao processar o pagamento.",
      variant: "destructive"
    })
  },
  
  // Warning notifications
  warning: {
    lowCredits: (remaining: number) => toast({
      title: "⚠️ Poucos créditos restantes",
      description: `Você tem apenas ${remaining} créditos. Considere recarregar.`,
      className: "border-warning/50 bg-warning/5"
    }),
    
    freeModeExpensive: () => toast({
      title: "💎 Modo Livre Premium",
      description: "O Modo Livre custa 2 créditos por geração.",
      className: "border-warning/50 bg-warning/5"
    }),
    
    sessionExpiring: () => toast({
      title: "⏳ Sessão expirando",
      description: "Sua sessão expirará em breve. Salve seu trabalho.",
      className: "border-warning/50 bg-warning/5"
    })
  },
  
  // Info notifications
  info: {
    generating: () => toast({
      title: "✨ Gerando copy...",
      description: "A IA está criando seu conteúdo. Aguarde alguns instantes.",
      className: "border-primary/50 bg-primary/5"
    }),
    
    templateSelected: (name: string) => toast({
      title: "🧩 Template selecionado",
      description: `Você selecionou o template: ${name}`,
      className: "border-primary/50 bg-primary/5"
    }),
    
    welcomeBonus: () => toast({
      title: "🎉 Bem-vindo(a)!",
      description: "Você ganhou 20 créditos de boas-vindas para começar.",
      className: "border-primary/50 bg-primary/5"
    }),
    
    featureComingSoon: (feature: string) => toast({
      title: "🚧 Em breve!",
      description: `${feature} estará disponível em uma próxima atualização.`,
      className: "border-primary/50 bg-primary/5"
    })
  }
};

// Função helper para notificações personalizadas
export const showNotification = (
  type: 'success' | 'error' | 'warning' | 'info',
  title: string,
  description?: string,
  duration?: number
) => {
  const classNames = {
    success: "border-success/50 bg-success/5",
    error: "",
    warning: "border-warning/50 bg-warning/5",
    info: "border-primary/50 bg-primary/5"
  };

  toast({
    title,
    description,
    variant: type === 'error' ? 'destructive' : 'default',
    className: classNames[type],
    duration
  });
};

