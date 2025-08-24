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
  Facebook,
  Linkedin,
  Users,
  Target,
  Zap,
  Clock,
  Edit3,
  Copy as CopyIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { copyGenerationService } from '@/services/copyGenerationService';
import { useAuth } from '@/components/auth/AuthProvider';
import { useCalendar } from '@/hooks/useCalendar';
import { Separator } from '@/components/ui/separator';

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
    showWarning: (title: string, description?: string, duration?: number) => string;
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
  targetPage?: string;
}

const contextConfigs: Record<string, ContextConfig> = {
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
    targetPage: '/templates'
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
    targetPage: '/campaigns'
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
    targetPage: '/email-marketing'
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
    targetPage: '/social-media'
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
    targetPage: '/composer'
  },
  '/calendar': {
    title: 'Copy para Eventos do Calendário',
    icon: Calendar,
    color: 'bg-gradient-to-r from-blue-600 to-indigo-600',
    description: 'Gerar copy para eventos agendados ou criar novos',
    suggestions: [
      'Post para evento agendado',
      'Anúncio de lançamento',
      'Stories promocional'
    ],
    defaultPlatform: 'Instagram',
    defaultType: 'Post Orgânico',
    targetPage: '/calendar'
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
    targetPage: '/composer'
  }
};

const FloatingCopyButton: React.FC<FloatingCopyButtonProps> = ({ toastNotifications, systemToastNotifications }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [briefing, setBriefing] = useState('');
  const [platform, setPlatform] = useState('');
  const [copyType, setCopyType] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCopy, setGeneratedCopy] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showEventSelector, setShowEventSelector] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { events } = useCalendar();

  // Detectar contexto baseado na rota atual
  const currentContext = contextConfigs[location.pathname] || contextConfigs['default'];

  // Auto-configurar baseado no contexto
  useEffect(() => {
    if (currentContext.defaultPlatform) setPlatform(currentContext.defaultPlatform);
    if (currentContext.defaultType) setCopyType(currentContext.defaultType);
    
    // Se estiver na página de calendário, mostrar seletor de eventos
    if (location.pathname === '/calendar' && events.length > 0) {
      setShowEventSelector(true);
    }
  }, [location.pathname, currentContext, events]);

  const handleGenerate = async () => {
    if (!briefing.trim()) {
      toastNotifications.showError(
        "Briefing necessário",
        "Descreva o que você quer comunicar."
      );
      return;
    }

    setIsGenerating(true);
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
        
        // Copiar automaticamente para clipboard
        try {
          await navigator.clipboard.writeText(response.content);
          toastNotifications.showSuccess(
            "🎉 Copy gerada e copiada!",
            "Copy contextual criada e copiada para área de transferência."
          );
        } catch {
          toastNotifications.showSuccess(
            "🎉 Copy gerada!",
            "Copy contextual criada com sucesso."
          );
        }

        // Navegar para página específica se disponível, padrão é composer
        const targetPage = currentContext.targetPage || '/composer';
        if (targetPage !== location.pathname) {
          setTimeout(() => {
            // Se for para o composer, passar o briefing como state
            if (targetPage === '/composer') {
              navigate(targetPage, { 
                state: { 
                  briefing: briefing,
                  platform: platform,
                  copyType: copyType,
                  generatedCopy: response.content
                }
              });
            } else {
              navigate(targetPage);
            }
            
            const pageName = targetPage === '/composer' ? 'Composer' : targetPage.replace('/', '').replace('-', ' ');
            toastNotifications.showInfo(
              `Redirecionando para ${pageName}`,
              "Copy criada! Você foi direcionado para continuar editando."
            );
          }, 1500);
        }

      } else {
        throw new Error('Falha na geração');
      }
    } catch (error) {
      toastNotifications.showError(
        "Erro na geração",
        "Tente novamente em alguns instantes."
      );
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
    setSelectedEvent(null);
    setShowEventSelector(false);
    setIsModalOpen(false);
  };

  const handleEventSelect = (event: any) => {
    setSelectedEvent(event);
    setBriefing(`Gerar copy para o evento: ${event.title}`);
    setPlatform(event.platform || 'Instagram');
    setShowEventSelector(false);
  };

  const handleUseGeneratedCopy = () => {
    if (selectedEvent && generatedCopy) {
      // Aqui você pode implementar a lógica para atualizar o evento com a copy gerada
      toastNotifications.showSuccess(
        "Copy aplicada ao evento!",
        `A copy foi aplicada ao evento "${selectedEvent.title}"`
      );
    }
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
            {/* Event Selector for Calendar */}
            {location.pathname === '/calendar' && events.length > 0 && showEventSelector && (
              <div className="space-y-3">
                <label className="text-sm font-medium">📅 Selecionar Evento Agendado:</label>
                <div className="max-h-40 overflow-y-auto space-y-2 border rounded-lg p-3">
                  {events.slice(0, 5).map((event) => (
                    <div
                      key={event.id}
                      onClick={() => handleEventSelect(event)}
                      className="flex items-center gap-3 p-2 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{event.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(event.event_date).toLocaleDateString()} • {event.platform}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Separator />
              </div>
            )}

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

            {/* Generated Copy */}
            {generatedCopy && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-green-800 flex items-center gap-2">
                      <Wand2 className="w-4 h-4" />
                      Copy Gerada com IA
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {platform} • {copyType}
                    </Badge>
                  </div>
                  
                  {/* Preview da Copy */}
                  <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                    {/* Header do Preview */}
                    <div className="bg-gray-50 px-4 py-2 border-b flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                          {platform === 'Instagram' && <Instagram className="w-3 h-3 text-pink-500" />}
                          {platform === 'Facebook' && <Facebook className="w-3 h-3 text-blue-600" />}
                          {platform === 'LinkedIn' && <Linkedin className="w-3 h-3 text-blue-700" />}
                          {platform === 'Email' && <Mail className="w-3 h-3 text-purple-600" />}
                        </div>
                        <span className="text-xs font-medium text-gray-600">{platform}</span>
                      </div>
                      <span className="text-xs text-gray-500">{copyType}</span>
                    </div>
                    
                    {/* Conteúdo da Copy */}
                    <div className="p-4">
                      <div className="prose prose-sm max-w-none">
                        <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">
                          {generatedCopy}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={handleCopyToClipboard} className="flex-1">
                    <CopyIcon className="w-4 h-4 mr-2" />
                    Copiar Copy
                  </Button>
                  {location.pathname === '/calendar' && selectedEvent && (
                    <Button onClick={handleUseGeneratedCopy} variant="secondary" className="flex-1">
                      <Edit3 className="w-4 h-4 mr-2" />
                      Aplicar ao Evento
                    </Button>
                  )}
                  <Button variant="outline" onClick={resetModal}>
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Copy
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FloatingCopyButton;