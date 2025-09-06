// Toast helpers for consistent UX across the app
import { toast } from "@/hooks/use-toast";

interface ToastOptions {
  title: string;
  description?: string;
  duration?: number;
}

export const toastHelpers = {
  // Success toasts
  success: {
    generated: (templateName?: string) => toast({
      title: "✅ Copy gerada com sucesso!",
      description: templateName ? `Template ${templateName} executado perfeitamente` : "Sua copy foi criada e está pronta para uso",
      duration: 4000,
    }),
    
    copied: () => toast({
      title: "📋 Copiado!",
      description: "Copy copiada para a área de transferência",
      duration: 2000,
    }),
    
    saved: (fileName?: string) => toast({
      title: "💾 Salvo com sucesso!",
      description: fileName ? `Arquivo ${fileName} foi baixado` : "Arquivo salvo com sucesso",
      duration: 3000,
    }),
    
    purchased: (credits: number) => toast({
      title: "🎉 Compra realizada!",
      description: `${credits} créditos adicionados à sua conta`,
      duration: 5000,
    }),
    
    profileUpdated: () => toast({
      title: "👌 Perfil atualizado!",
      description: "Suas alterações foram salvas com sucesso",
      duration: 3000,
    }),
  },

  // Error toasts
  error: {
    generation: () => toast({
      title: "❌ Erro na geração",
      description: "Não foi possível gerar a copy. Tente novamente em alguns instantes",
      variant: "destructive",
      duration: 6000,
    }),
    
    insufficientCredits: () => toast({
      title: "⚠️ Créditos insuficientes",
      description: "Você precisa de mais créditos para continuar. Considere um upgrade",
      variant: "destructive",
      duration: 8000,
    }),
    
    network: () => toast({
      title: "🌐 Erro de conexão",
      description: "Verifique sua conexão com a internet e tente novamente",
      variant: "destructive",
      duration: 5000,
    }),
    
    validation: (field?: string) => toast({
      title: "⚠️ Dados inválidos",
      description: field ? `O campo ${field} é obrigatório` : "Verifique os dados informados",
      variant: "destructive",
      duration: 4000,
    }),
    
    loadData: (resource?: string) => toast({
      title: "🗂️ Erro ao carregar dados",
      description: resource ? `Não foi possível carregar ${resource}` : "Erro ao carregar informações",
      variant: "destructive",
      duration: 5000,
    }),
  },

  // Warning toasts
  warning: {
    lowCredits: (remaining: number) => toast({
      title: "⚠️ Poucos créditos restantes",
      description: `Você tem apenas ${remaining} créditos. Considere recarregar sua conta`,
      duration: 6000,
    }),
    
    longGeneration: () => toast({
      title: "⏳ Processando...",
      description: "Esta geração pode demorar um pouco mais que o normal",
      duration: 4000,
    }),
    
    unsavedChanges: () => toast({
      title: "📝 Alterações não salvas",
      description: "Lembre-se de salvar suas alterações antes de sair",
      duration: 5000,
    }),
  },

  // Info toasts
  info: {
    welcome: (name?: string) => toast({
      title: `👋 Bem-vindo${name ? `, ${name}` : ''}!`,
      description: "Explore todas as funcionalidades da StorySpark",
      duration: 5000,
    }),
    
    newFeature: (feature: string) => toast({
      title: "🆕 Nova funcionalidade!",
      description: `Confira: ${feature}`,
      duration: 6000,
    }),
    
    tipOfDay: (tip: string) => toast({
      title: "💡 Dica do dia",
      description: tip,
      duration: 8000,
    }),
    
    processing: (action: string) => toast({
      title: "⚙️ Processando...",
      description: `${action} em andamento`,
      duration: 3000,
    }),
  },

  // Custom toast
  custom: ({ title, description, duration = 4000, variant }: ToastOptions & { variant?: 'default' | 'destructive' }) => toast({
    title,
    description,
    duration,
    variant,
  }),
};

