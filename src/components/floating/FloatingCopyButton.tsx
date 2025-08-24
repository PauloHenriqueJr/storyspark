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
  Copy as CopyIcon,
  Globe,
  TrendingUp,
  MessageSquare,
  Phone,
  Mic,
  BarChart3,
  Lightbulb,
  TestTube,
  Settings,
  Link,
  CreditCard
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
  onOpenScheduleModal?: (copyContent: string, platform: string, copyType: string) => void;
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
  // Páginas de Criação de Conteúdo
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
  '/social-scheduler': {
    title: 'Copy para Social Scheduler',
    icon: Instagram,
    color: 'bg-pink-600',
    description: 'Posts agendados que viralizam e engajam',
    suggestions: [
      'Post para Instagram Stories',
      'Carrossel educativo',
      'Post promocional agendado'
    ],
    defaultPlatform: 'Instagram',
    defaultType: 'Post Orgânico',
    targetPage: '/social-scheduler'
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
  
  // Páginas de Landing Pages e Funnels
  '/landing-pages': {
    title: 'Copy para Landing Pages',
    icon: Globe,
    color: 'bg-gradient-to-r from-orange-600 to-red-600',
    description: 'Copy de alta conversão para landing pages',
    suggestions: [
      'Headline principal da landing page',
      'Copy do formulário de captura',
      'Copy dos benefícios do produto'
    ],
    defaultPlatform: 'Web',
    defaultType: 'Landing Page',
    targetPage: '/landing-pages'
  },
  '/funnels': {
    title: 'Copy para Funnels',
    icon: TrendingUp,
    color: 'bg-gradient-to-r from-indigo-600 to-purple-600',
    description: 'Copy otimizada para cada etapa do funil',
    suggestions: [
      'Copy da página de entrada',
      'Copy do upsell',
      'Copy de fechamento'
    ],
    defaultPlatform: 'Web',
    defaultType: 'Funnel',
    targetPage: '/funnels'
  },
  
  // Páginas de Comunicação
  '/push-whatsapp': {
    title: 'Copy para Push/WhatsApp',
    icon: MessageSquare,
    color: 'bg-gradient-to-r from-green-600 to-emerald-600',
    description: 'Mensagens diretas que convertem',
    suggestions: [
      'Mensagem de promoção WhatsApp',
      'Notificação push urgente',
      'Sequência de follow-up'
    ],
    defaultPlatform: 'WhatsApp',
    defaultType: 'Mensagem',
    targetPage: '/push-whatsapp'
  },
  '/call-scripts': {
    title: 'Copy para Call Scripts',
    icon: Phone,
    color: 'bg-gradient-to-r from-blue-600 to-cyan-600',
    description: 'Scripts inteligentes para ligações',
    suggestions: [
      'Script de prospecção',
      'Script de follow-up',
      'Script de objeções'
    ],
    defaultPlatform: 'Phone',
    defaultType: 'Script',
    targetPage: '/call-scripts'
  },
  
  // Páginas de Personas e Brand Voices
  '/personas': {
    title: 'Copy para Personas',
    icon: Users,
    color: 'bg-gradient-to-r from-purple-600 to-pink-600',
    description: 'Copy direcionada para personas específicas',
    suggestions: [
      'Copy para persona empreendedor',
      'Copy para persona profissional',
      'Copy para persona estudante'
    ],
    defaultPlatform: 'Instagram',
    defaultType: 'Post Orgânico',
    targetPage: '/personas'
  },
  '/brand-voices': {
    title: 'Copy com Brand Voice',
    icon: Mic,
    color: 'bg-gradient-to-r from-teal-600 to-cyan-600',
    description: 'Copy alinhada com sua marca',
    suggestions: [
      'Copy com tom profissional',
      'Copy com tom casual',
      'Copy com tom inspirador'
    ],
    defaultPlatform: 'Instagram',
    defaultType: 'Post Orgânico',
    targetPage: '/brand-voices'
  },
  '/voices': {
    title: 'Copy com Voice Personalizada',
    icon: Mic,
    color: 'bg-gradient-to-r from-violet-600 to-purple-600',
    description: 'Copy usando suas voices personalizadas',
    suggestions: [
      'Copy com voice de especialista',
      'Copy com voice de mentor',
      'Copy com voice de amigo'
    ],
    defaultPlatform: 'Instagram',
    defaultType: 'Post Orgânico',
    targetPage: '/voices'
  },
  
  // Páginas de Analytics e CRM
  '/analytics': {
    title: 'Copy para Analytics',
    icon: BarChart3,
    color: 'bg-gradient-to-r from-slate-600 to-gray-600',
    description: 'Copy baseada em dados e insights',
    suggestions: [
      'Copy sobre métricas de sucesso',
      'Copy sobre otimizações',
      'Copy sobre resultados'
    ],
    defaultPlatform: 'LinkedIn',
    defaultType: 'Post Orgânico',
    targetPage: '/analytics'
  },
  '/crm': {
    title: 'Copy para CRM',
    icon: Users,
    color: 'bg-gradient-to-r from-emerald-600 to-green-600',
    description: 'Copy para relacionamento com clientes',
    suggestions: [
      'Copy de follow-up com leads',
      'Copy de reativação',
      'Copy de agradecimento'
    ],
    defaultPlatform: 'Email',
    defaultType: 'Follow-up',
    targetPage: '/crm'
  },
  
  // Páginas de Conteúdo e Templates
  '/content-library': {
    title: 'Copy para Content Library',
    icon: FileText,
    color: 'bg-gradient-to-r from-amber-600 to-orange-600',
    description: 'Copy para organizar e promover conteúdo',
    suggestions: [
      'Copy para descrição de assets',
      'Copy para promoção de conteúdo',
      'Copy para categorização'
    ],
    defaultPlatform: 'Instagram',
    defaultType: 'Post Orgânico',
    targetPage: '/content-library'
  },
  '/ai-ideas': {
    title: 'Copy para AI Ideas',
    icon: Lightbulb,
    color: 'bg-gradient-to-r from-yellow-600 to-orange-600',
    description: 'Copy baseada em ideias geradas por IA',
    suggestions: [
      'Copy para headline de ideia',
      'Copy para desenvolvimento de conceito',
      'Copy para campanha baseada em ideia'
    ],
    defaultPlatform: 'Instagram',
    defaultType: 'Post Orgânico',
    targetPage: '/ai-ideas'
  },
  '/trending-hooks': {
    title: 'Copy com Trending Hooks',
    icon: TrendingUp,
    color: 'bg-gradient-to-r from-red-600 to-pink-600',
    description: 'Copy usando hooks virais e tendências',
    suggestions: [
      'Copy com hook de transformação',
      'Copy com hook de contraste',
      'Copy com hook de experiência'
    ],
    defaultPlatform: 'Instagram',
    defaultType: 'Post Orgânico',
    targetPage: '/trending-hooks'
  },
  
  // Páginas de Testes e Otimização
  '/ab-tests': {
    title: 'Copy para A/B Tests',
    icon: TestTube,
    color: 'bg-gradient-to-r from-indigo-600 to-blue-600',
    description: 'Copy otimizada para testes A/B',
    suggestions: [
      'Copy para variação A',
      'Copy para variação B',
      'Copy para hipótese de teste'
    ],
    defaultPlatform: 'Web',
    defaultType: 'A/B Test',
    targetPage: '/ab-tests'
  },
  '/feedback': {
    title: 'Copy para Feedback',
    icon: MessageSquare,
    color: 'bg-gradient-to-r from-blue-600 to-indigo-600',
    description: 'Copy para coletar e responder feedback',
    suggestions: [
      'Copy para solicitar feedback',
      'Copy para agradecer feedback',
      'Copy para implementar sugestões'
    ],
    defaultPlatform: 'Email',
    defaultType: 'Feedback',
    targetPage: '/feedback'
  },
  
  // Páginas de Configuração (redirecionam para composer)
  '/settings': {
    title: 'Copy Personalizada',
    icon: Settings,
    color: 'bg-gradient-to-r from-gray-600 to-slate-600',
    description: 'Criar copy personalizada para suas necessidades',
    suggestions: [
      'Copy para configurações',
      'Copy para documentação',
      'Copy para treinamento'
    ],
    defaultPlatform: 'Instagram',
    defaultType: 'Post Orgânico',
    targetPage: '/composer'
  },
  '/team': {
    title: 'Copy para Equipe',
    icon: Users,
    color: 'bg-gradient-to-r from-blue-600 to-indigo-600',
    description: 'Copy para comunicação interna e externa',
    suggestions: [
      'Copy para onboarding',
      'Copy para treinamento',
      'Copy para comunicação'
    ],
    defaultPlatform: 'Email',
    defaultType: 'Comunicação',
    targetPage: '/composer'
  },
  '/integrations': {
    title: 'Copy para Integrações',
    icon: Link,
    color: 'bg-gradient-to-r from-purple-600 to-indigo-600',
    description: 'Copy para documentar e promover integrações',
    suggestions: [
      'Copy para documentação',
      'Copy para tutorial',
      'Copy para promoção'
    ],
    defaultPlatform: 'LinkedIn',
    defaultType: 'Post Orgânico',
    targetPage: '/composer'
  },
  '/billing': {
    title: 'Copy para Billing',
    icon: CreditCard,
    color: 'bg-gradient-to-r from-green-600 to-emerald-600',
    description: 'Copy para comunicação financeira',
    suggestions: [
      'Copy para cobrança',
      'Copy para upgrade',
      'Copy para agradecimento'
    ],
    defaultPlatform: 'Email',
    defaultType: 'Billing',
    targetPage: '/composer'
  },
  
  // Página padrão
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
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showItemSelector, setShowItemSelector] = useState(false);
  
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
    
    // Se estiver em páginas com dados contextuais, mostrar seletor
    if (['/personas', '/brand-voices', '/voices', '/ai-ideas', '/trending-hooks'].includes(location.pathname)) {
      setShowItemSelector(true);
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

        // Lógica específica para calendário - abrir modal de agendamento
        if (location.pathname === '/calendar') {
          if (onOpenScheduleModal) {
            onOpenScheduleModal(response.content, platform, copyType);
            toastNotifications.showSuccess(
              "Copy gerada!",
              "Modal de agendamento aberto com a copy preenchida."
            );
          }
        } else {
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
                    generatedCopy: response.content,
                    context: {
                      page: location.pathname,
                      selectedEvent: selectedEvent,
                      selectedItem: selectedItem,
                      contextConfig: currentContext
                    }
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
    setSelectedItem(null);
    setShowItemSelector(false);
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
    
    if (selectedItem && generatedCopy) {
      // Aqui você pode implementar a lógica para aplicar a copy ao item selecionado
      toastNotifications.showSuccess(
        "Copy aplicada!",
        `A copy foi aplicada ao item "${selectedItem.name || selectedItem.title}"`
      );
    }
  };

  const handleItemSelect = (item: any) => {
    setSelectedItem(item);
    
    // Configurar briefing baseado no tipo de item
    let itemBriefing = '';
    switch (location.pathname) {
      case '/personas':
        itemBriefing = `Gerar copy direcionada para a persona: ${item.name}`;
        break;
      case '/brand-voices':
        itemBriefing = `Gerar copy usando a brand voice: ${item.name}`;
        break;
      case '/voices':
        itemBriefing = `Gerar copy usando a voice: ${item.name}`;
        break;
      case '/ai-ideas':
        itemBriefing = `Desenvolver copy baseada na ideia: ${item.topic || item.content?.[0] || 'Ideia IA'}`;
        break;
      case '/trending-hooks':
        itemBriefing = `Criar copy usando o hook: ${item.hook}`;
        break;
      default:
        itemBriefing = `Gerar copy para: ${item.name || item.title}`;
    }
    
    setBriefing(itemBriefing);
    setShowItemSelector(false);
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

            {/* Contextual Item Selector */}
            {showItemSelector && (
              <div className="space-y-3">
                <label className="text-sm font-medium">
                  {location.pathname === '/personas' && '👥 Selecionar Persona:'}
                  {location.pathname === '/brand-voices' && '🎤 Selecionar Brand Voice:'}
                  {location.pathname === '/voices' && '🎙️ Selecionar Voice:'}
                  {location.pathname === '/ai-ideas' && '💡 Selecionar Ideia IA:'}
                  {location.pathname === '/trending-hooks' && '📈 Selecionar Hook:'}
                </label>
                <div className="max-h-40 overflow-y-auto space-y-2 border rounded-lg p-3">
                  {/* Placeholder para itens contextuais - será implementado com dados reais */}
                  <div className="text-sm text-muted-foreground text-center py-4">
                    {location.pathname === '/personas' && 'Personas disponíveis serão carregadas aqui'}
                    {location.pathname === '/brand-voices' && 'Brand voices disponíveis serão carregadas aqui'}
                    {location.pathname === '/voices' && 'Voices disponíveis serão carregadas aqui'}
                    {location.pathname === '/ai-ideas' && 'Ideias IA disponíveis serão carregadas aqui'}
                    {location.pathname === '/trending-hooks' && 'Hooks disponíveis serão carregados aqui'}
                  </div>
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
                  {(location.pathname === '/calendar' && selectedEvent) || selectedItem ? (
                    <Button onClick={handleUseGeneratedCopy} variant="secondary" className="flex-1">
                      <Edit3 className="w-4 h-4 mr-2" />
                      {location.pathname === '/calendar' ? 'Aplicar ao Evento' : 'Aplicar ao Item'}
                    </Button>
                  ) : null}
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