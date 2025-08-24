import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wand2,
  Plus,
  X,
  Mail,
  Calendar,
  FileText,
  Instagram,
  Users,
  Target,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { copyGenerationService } from '@/services/copyGenerationService';
import { useAuth } from '@/components/auth/AuthProvider';
import { useFloatingButton } from '@/contexts/FloatingButtonContext';

interface FloatingCopyButtonProps {
  toastNotifications: {
    showSuccess: (title: string, description?: string, duration?: number) => string;
    showError: (title: string, description?: string, duration?: number) => string;
    showInfo: (title: string, description?: string, duration?: number) => string;
  };
  systemToastNotifications: {
    showSuccess: (title: string, description?: string, duration?: number) => string;
    showError: (title: string, description?: string, duration?: number) => string;
    showInfo: (title: string, description?: string, duration?: number) => string;
    showWarning: (title:string, description?: string, duration?: number) => string;
  };
}

interface ContextConfig {
  title: string;
  icon: React.ComponentType<any>;
  color: string;
  description: string;
  suggestions: string[];
  defaultPlatform?: string;
  defaultType?: string;
  actionType: 'navigate' | 'openCalendar' | 'openCampaign';
}

const contextConfigs: Record<string, ContextConfig> = {
  '/calendar': {
    title: 'Copy para Calendário',
    icon: Calendar,
    color: 'bg-red-600',
    description: 'Crie copy para um novo post agendado no calendário',
    suggestions: [
      'Post sobre novidade da empresa',
      'Lembrete de evento importante',
      'Conteúdo de engajamento para a semana'
    ],
    defaultPlatform: 'Instagram',
    actionType: 'openCalendar'
  },
  '/templates': {
    title: 'Copy para Templates',
    icon: FileText,
    color: 'bg-blue-600',
    description: 'Crie copy otimizada para seus templates',
    suggestions: [
      'Template para lançamento de produto',
      'Template para promoção sazonal',
      'Template de engajamento'
    ],
    defaultType: 'Template',
    actionType: 'navigate'
  },
  '/campaigns': {
    title: 'Copy para Campanhas',
    icon: Target,
    color: 'bg-green-600',
    description: 'Copy focada em conversão para suas campanhas',
    suggestions: [
      'Campanha de Black Friday',
      'Lançamento de produto premium',
      'Campanha de retenção de clientes'
    ],
    defaultPlatform: 'Facebook',
    actionType: 'openCampaign'
  },
  '/email-marketing': {
    title: 'Copy para E-mail Marketing',
    icon: Mail,
    color: 'bg-purple-600',
    description: 'E-mails que convertem e engajam',
    suggestions: [
      'E-mail de boas-vindas',
      'Newsletter promocional',
      'E-mail de reativação'
    ],
    defaultPlatform: 'Email',
    defaultType: 'Newsletter',
    actionType: 'navigate'
  },
  '/social-media': {
    title: 'Copy para Social Media',
    icon: Instagram,
    color: 'bg-pink-600',
    description: 'Posts que viralizam e engajam',
    suggestions: [
      'Post para Instagram Stories',
      'Carrossel educativo',
      'Post promocional'
    ],
    defaultPlatform: 'Instagram',
    actionType: 'navigate'
  },
  '/composer': {
    title: 'Composer - Criar Copy',
    icon: Wand2,
    color: 'bg-gradient-to-r from-green-600 to-teal-600',
    description: 'Criar copy personalizada com IA',
    suggestions: [
      'Copy para redes sociais',
      'E-mail promocional',
      'Anúncio persuasivo'
    ],
    defaultPlatform: 'Instagram',
    defaultType: 'Post Orgânico',
    actionType: 'navigate'
  },
  'default': {
    title: 'Criar Copy com IA',
    icon: Wand2,
    color: 'bg-gradient-to-r from-purple-600 to-blue-600',
    description: 'Copy personalizada para qualquer necessidade',
    suggestions: [
      'Copy para redes sociais',
      'E-mail marketing',
      'Landing page'
    ],
    actionType: 'navigate'
  }
};

const FloatingCopyButton: React.FC<FloatingCopyButtonProps> = ({
  toastNotifications,
  systemToastNotifications,
}) => {
  const { openCalendarModalWithContent, openCampaignModalWithContent } = useFloatingButton();
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [briefing, setBriefing] = useState('');
  const [platform, setPlatform] = useState('');
  const [copyType, setCopyType] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCopy, setGeneratedCopy] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Detectar contexto baseado na rota atual
  const currentContext = contextConfigs[location.pathname] || contextConfigs['default'];

  // Auto-configurar baseado no contexto
  useEffect(() => {
    if (currentContext.defaultPlatform) setPlatform(currentContext.defaultPlatform);
    if (currentContext.defaultType) setCopyType(currentContext.defaultType);
  }, [location.pathname, currentContext]);

  const handleGenerate = async () => {
    if (!briefing.trim()) {
      systemToastNotifications.showError(
        "Briefing necessário",
        "Por favor, descreva o que você quer comunicar."
      );
      return;
    }

    setIsGenerating(true);
    setGeneratedCopy(''); // Limpar copy anterior

    try {
      const response = await copyGenerationService.generateCopy({
        briefing,
        platform: platform || 'Instagram',
        copyType: copyType || 'Post Orgânico',
        tone: 'Profissional',
        userId: user?.id
      });

      if (response.success && response.content) {
        setGeneratedCopy(response.content);
        systemToastNotifications.showSuccess("🎉 Copy gerada com sucesso!");

        // Ação pós-geração baseada no contexto
        if (currentContext.actionType === 'openCalendar' && openCalendarModalWithContent) {
          openCalendarModalWithContent(response.content);
          systemToastNotifications.showInfo("Abrindo modal do calendário...");
          setTimeout(() => resetModal(), 500);
        } else if (currentContext.actionType === 'openCampaign' && openCampaignModalWithContent) {
          openCampaignModalWithContent(response.content);
          systemToastNotifications.showInfo("Abrindo modal de campanha...");
          setTimeout(() => resetModal(), 500);
        } else {
          // Ação padrão: navegar para o composer com a copy
          const encodedContent = encodeURIComponent(response.content);
          const targetUrl = `/composer?from=floating-button&content=${encodedContent}`;

          if (location.pathname !== '/composer') {
            navigate(targetUrl);
            systemToastNotifications.showInfo("Redirecionando para o Composer...");
          } else {
            // Se já estiver no composer, apenas informar
            systemToastNotifications.showInfo("Copy pronta para ser usada no Composer.");
          }
        }

      } else {
        throw new Error(response.error || 'Falha na geração de copy');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Tente novamente em alguns instantes.";
      systemToastNotifications.showError("Erro na Geração", errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCopy);
      toastNotifications.showSuccess(
        "Copy copiada!",
        "Conteúdo copiado para área de transferência."
      );
    } catch (error) {
      toastNotifications.showError(
        "Erro ao copiar",
        "Não foi possível copiar o conteúdo."
      );
    }
  };

  const resetModal = () => {
    setBriefing('');
    setGeneratedCopy('');
    setPlatform(currentContext.defaultPlatform || '');
    setCopyType(currentContext.defaultType || '');
    setIsModalOpen(false);
  };

  const IconComponent = currentContext.icon;

  return (
    <>
      {/* Floating Button */}
      <motion.div
       className="fixed bottom-6 right-6 z-[9999]"
       initial={{ scale: 0, x: 100 }}
       animate={{ scale: 1, x: 0 }}
       transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
     >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative"
        >
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            className={`w-16 h-16 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 ${currentContext.color} border-4 border-white/20 relative z-10`}
            size="lg"
          >
            <IconComponent className="w-8 h-8 text-white" />
          </Button>
          
          {/* Pulse effect */}
          <div className={`absolute inset-0 rounded-full ${currentContext.color} opacity-30 animate-ping pointer-events-none`} />
        </motion.div>
      </motion.div>

      {/* Context Modal */}
      <Dialog open={isModalOpen} onOpenChange={(open) => !open && resetModal()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${currentContext.color} flex items-center justify-center`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              {currentContext.title}
              <Badge variant="secondary" className="ml-2">
                <Zap className="w-3 h-3 mr-1" />
                Contexto: {location.pathname.replace('/', '') || 'Home'}
              </Badge>
            </DialogTitle>
            <DialogDescription className="text-base">
              {currentContext.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Quick Suggestions */}
            <div className="space-y-3">
              <label className="text-sm font-medium">💡 Sugestões Rápidas:</label>
              <div className="flex flex-wrap gap-2">
                {currentContext.suggestions.map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    onClick={() => setBriefing(suggestion)}
                    className="text-xs hover:bg-primary hover:text-white transition-colors"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>

            {/* Briefing */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Descrição *</label>
              <Textarea
                placeholder="Descreva o que você quer comunicar..."
                value={briefing}
                onChange={(e) => setBriefing(e.target.value)}
                className="min-h-[120px] resize-none"
              />
            </div>

            {/* Platform & Type Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Plataforma</label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha a plataforma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="Facebook">Facebook</SelectItem>
                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                    <SelectItem value="Email">E-mail</SelectItem>
                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo</label>
                <Select value={copyType} onValueChange={setCopyType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de conteúdo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Post Orgânico">Post Orgânico</SelectItem>
                    <SelectItem value="Stories">Stories</SelectItem>
                    <SelectItem value="Anúncio">Anúncio</SelectItem>
                    <SelectItem value="Newsletter">Newsletter</SelectItem>
                    <SelectItem value="Carrossel">Carrossel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !briefing.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Wand2 className="w-4 h-4 mr-2 animate-spin" />
                  Gerando Copy...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Gerar Copy Contextual
                </>
              )}
            </Button>

            {/* Generated Copy Preview */}
            <AnimatePresence>
              {generatedCopy && (
                <motion.div
                  initial={{ opacity: 0, y: 20, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -20, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 border-t pt-6"
                >
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    Pré-visualização da Copy
                  </h3>
                  <div className="bg-muted/50 rounded-lg p-4 max-h-60 overflow-y-auto border">
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
                      {generatedCopy}
                    </pre>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button variant="ghost" onClick={resetModal}>
                      Descartar
                    </Button>
                    <Button onClick={handleCopyToClipboard}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar e Fechar
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FloatingCopyButton;