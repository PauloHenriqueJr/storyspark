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
import { useBrandVoices } from '@/hooks/useBrandVoices';
import { usePersonas } from '@/hooks/usePersonas';
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
  const { voices } = useBrandVoices();
  const { personas } = usePersonas();

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
    
    // Se estiver em páginas com dados contextuais ou funcionalidades especiais, mostrar seletor
    if (['/personas', '/brand-voices', '/voices', '/ai-ideas', '/trending-hooks', '/landing-pages', '/funnels', '/analytics'].includes(location.pathname)) {
      setShowItemSelector(true);
    }
  }, [location.pathname, currentContext, events, voices, personas]);

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

  // Função para detectar dados disponíveis e funcionalidades específicas
  const getPageSpecificData = () => {
    switch (location.pathname) {
      case '/brand-voices':
        return {
          hasData: voices.length > 0,
          data: voices,
          type: 'brand-voice',
          title: 'Brand Voices',
          icon: Mic,
          color: 'bg-gradient-to-r from-teal-500 to-cyan-500',
          emptyMessage: 'Nenhuma brand voice criada ainda',
          createMessage: 'Criar nova brand voice com IA',
          suggestions: [
            'Brand voice para empresa de tecnologia',
            'Brand voice para e-commerce',
            'Brand voice para consultoria',
            'Brand voice para educação'
          ]
        };
      case '/personas':
        return {
          hasData: personas.length > 0,
          data: personas,
          type: 'persona',
          title: 'Personas',
          icon: Users,
          color: 'bg-gradient-to-r from-purple-500 to-pink-500',
          emptyMessage: 'Nenhuma persona criada ainda',
          createMessage: 'Criar nova persona com IA',
          suggestions: [
            'Persona empreendedor iniciante',
            'Persona profissional experiente',
            'Persona estudante universitário',
            'Persona dona de casa'
          ]
        };
      case '/ai-ideas':
        return {
          hasData: false, // Placeholder para ideias
          data: [],
          type: 'idea',
          title: 'Ideias IA',
          icon: Lightbulb,
          color: 'bg-gradient-to-r from-yellow-500 to-orange-500',
          emptyMessage: 'Nenhuma ideia gerada ainda',
          createMessage: 'Gerar novas ideias com IA',
          suggestions: [
            'Ideia para campanha de lançamento',
            'Ideia para conteúdo educativo',
            'Ideia para promoção sazonal',
            'Ideia para engajamento'
          ]
        };
      case '/trending-hooks':
        return {
          hasData: false, // Placeholder para hooks
          data: [],
          type: 'hook',
          title: 'Trending Hooks',
          icon: TrendingUp,
          color: 'bg-gradient-to-r from-red-500 to-pink-500',
          emptyMessage: 'Nenhum hook disponível',
          createMessage: 'Criar copy com hook viral',
          suggestions: [
            'Hook de transformação pessoal',
            'Hook de contraste surpreendente',
            'Hook de experiência compartilhada',
            'Hook de paradoxo intrigante'
          ]
        };
      case '/landing-pages':
        return {
          hasData: false,
          data: [],
          type: 'landing',
          title: 'Landing Pages',
          icon: Globe,
          color: 'bg-gradient-to-r from-orange-500 to-red-500',
          emptyMessage: 'Nenhuma landing page criada',
          createMessage: 'Criar copy para landing page',
          suggestions: [
            'Headline principal de alta conversão',
            'Copy do formulário de captura',
            'Copy dos benefícios do produto',
            'Copy do call-to-action'
          ]
        };
      case '/funnels':
        return {
          hasData: false,
          data: [],
          type: 'funnel',
          title: 'Funnels',
          icon: TrendingUp,
          color: 'bg-gradient-to-r from-indigo-500 to-purple-500',
          emptyMessage: 'Nenhum funil criado',
          createMessage: 'Criar copy para funil',
          suggestions: [
            'Copy da página de entrada',
            'Copy do upsell',
            'Copy de fechamento',
            'Copy de retenção'
          ]
        };
      case '/analytics':
        return {
          hasData: false,
          data: [],
          type: 'analytics',
          title: 'Analytics',
          icon: BarChart3,
          color: 'bg-gradient-to-r from-slate-500 to-gray-500',
          emptyMessage: 'Nenhum dado disponível',
          createMessage: 'Criar copy baseada em dados',
          suggestions: [
            'Copy sobre métricas de sucesso',
            'Copy sobre otimizações',
            'Copy sobre resultados',
            'Copy sobre insights'
          ]
        };
      default:
        return null;
    }
  };

  const pageData = getPageSpecificData();

  const IconComponent = currentContext.icon;

  return (
    <>
      {/* Floating Button - Design Moderno */}
      <motion.div
        className="fixed bottom-8 right-8 z-[9999]"
        initial={{ scale: 0, x: 100, y: 100 }}
        animate={{ scale: 1, x: 0, y: 0 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 20 }}
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          whileHover={{ scale: 1.15, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className="relative group"
        >
          {/* Glow effect */}
          <div className={`absolute inset-0 rounded-full ${currentContext.color} opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-300`} />
          
          {/* Main button */}
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            className={`w-20 h-20 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 ${currentContext.color} border-4 border-white/30 relative z-10 backdrop-blur-sm`}
            size="lg"
          >
            <IconComponent className="w-10 h-10 text-white drop-shadow-lg" />
          </Button>
          
          {/* Pulse effect */}
          <div className={`absolute inset-0 rounded-full ${currentContext.color} opacity-40 animate-ping pointer-events-none`} />
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
              {currentContext.title}
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Context Modal - Design Moderno */}
      <Dialog open={isModalOpen} onOpenChange={(open) => !open && resetModal()}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-gray-50">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${currentContext.color} flex items-center justify-center shadow-lg`}>
                <IconComponent className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-xl font-bold text-gray-900">
                  {currentContext.title}
                </DialogTitle>
                <DialogDescription className="text-base text-gray-600 mt-1">
                  {currentContext.description}
                </DialogDescription>
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Zap className="w-3 h-3 mr-1" />
                {location.pathname.replace('/', '') || 'Home'}
              </Badge>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Event Selector for Calendar - Design Moderno */}
            {location.pathname === '/calendar' && events.length > 0 && showEventSelector && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <Calendar className="w-3 h-3 text-blue-600" />
                  </div>
                  <label className="text-sm font-semibold text-gray-900">Selecionar Evento Agendado</label>
                </div>
                <div className="max-h-48 overflow-y-auto space-y-3 border border-gray-200 rounded-xl p-4 bg-white">
                  {events.slice(0, 5).map((event) => (
                    <div
                      key={event.id}
                      onClick={() => handleEventSelect(event)}
                      className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-200 cursor-pointer transition-all duration-200 group"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-sm">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-700 transition-colors">
                          {event.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(event.event_date).toLocaleDateString()} • {event.platform}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit3 className="w-4 h-4 text-blue-600" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Separator className="bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
              </div>
            )}

            {/* Contextual Assistant - Sistema Inteligente */}
            {pageData && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full ${pageData.color} flex items-center justify-center`}>
                    <pageData.icon className="w-3 h-3 text-white" />
                  </div>
                  <label className="text-sm font-semibold text-gray-900">
                    Assistente IA - {pageData.title}
                  </label>
                </div>

                {pageData.hasData ? (
                  // Se há dados, mostrar seletor
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Selecionar existente:</span>
                      <Badge variant="outline" className="text-xs">
                        {pageData.data.length} disponível{pageData.data.length !== 1 ? 'is' : ''}
                      </Badge>
                    </div>
                    <div className="max-h-48 overflow-y-auto space-y-3 border border-gray-200 rounded-xl p-4 bg-white">
                      {pageData.data.slice(0, 5).map((item: any) => (
                        <div
                          key={item.id}
                          onClick={() => handleItemSelect(item)}
                          className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-200 cursor-pointer transition-all duration-200 group"
                        >
                          <div className={`w-10 h-10 rounded-full ${pageData.color} flex items-center justify-center shadow-sm`}>
                            <pageData.icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-700 transition-colors">
                              {item.name || item.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {item.description || item.tone || 'Sem descrição'}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Edit3 className="w-4 h-4 text-blue-600" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Se não há dados, oferecer criação com IA ou funcionalidades específicas
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <pageData.icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-blue-900 mb-2">
                          {pageData.emptyMessage}
                        </h3>
                        <p className="text-sm text-blue-700 mb-4">
                          {pageData.type === 'brand-voice' || pageData.type === 'persona' ? (
                            `Que tal criar sua primeira ${pageData.title.toLowerCase()} com a ajuda da IA? Ela vai te ajudar a definir características, tom de voz e personalidade.`
                          ) : pageData.type === 'idea' ? (
                            'Que tal gerar ideias criativas com IA? Ela vai te ajudar a criar conceitos inovadores para suas campanhas.'
                          ) : (
                            `Que tal criar copy otimizada para ${pageData.title.toLowerCase()}? A IA vai te ajudar a criar conteúdo que converte.`
                          )}
                        </p>
                        <div className="flex gap-3">
                          <Button 
                            onClick={() => {
                              setBriefing(pageData.createMessage);
                              setShowItemSelector(false);
                            }}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                          >
                            <Wand2 className="w-4 h-4 mr-2" />
                            {pageData.createMessage}
                          </Button>
                          {pageData.type === 'brand-voice' && (
                            <Button 
                              variant="outline"
                              onClick={() => {
                                setBriefing('Criar brand voice completa com IA: definir nome, descrição, tom de voz, características, público-alvo e exemplos de uso');
                                setShowItemSelector(false);
                              }}
                              className="border-blue-200 text-blue-700 hover:bg-blue-50"
                            >
                              <Mic className="w-4 h-4 mr-2" />
                              Brand Voice Completa
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <Separator className="bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
              </div>
            )}

            {/* Quick Suggestions - Design Moderno */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Lightbulb className="w-3 h-3 text-yellow-600" />
                </div>
                <label className="text-sm font-semibold text-gray-900">
                  Sugestões Rápidas
                  {pageData && (
                    <span className="text-xs text-gray-500 ml-2">
                      • {pageData.title}
                    </span>
                  )}
                </label>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {(pageData?.suggestions || currentContext.suggestions).map((suggestion, index) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    onClick={() => setBriefing(suggestion)}
                    className="justify-start h-auto p-4 text-left border-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 transition-all duration-200 group"
                  >
                    <div className="flex items-start gap-3 w-full">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-semibold text-blue-600">{index + 1}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700 transition-colors">
                        {suggestion}
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Briefing - Design Moderno */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <FileText className="w-3 h-3 text-green-600" />
                </div>
                <label className="text-sm font-semibold text-gray-900">Descrição do Conteúdo</label>
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
                  Obrigatório
                </Badge>
              </div>
              <div className="relative">
                <Textarea
                  placeholder="Descreva o que você quer comunicar, o objetivo da copy, público-alvo, tom de voz..."
                  value={briefing}
                  onChange={(e) => setBriefing(e.target.value)}
                  className="min-h-[140px] resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-sm leading-relaxed"
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                  {briefing.length}/500
                </div>
              </div>
            </div>

            {/* Platform & Type Selection - Design Moderno */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                    <Globe className="w-3 h-3 text-purple-600" />
                  </div>
                  <label className="text-sm font-semibold text-gray-900">Plataforma</label>
                </div>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger className="border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-xl">
                    <SelectValue placeholder="Escolha a plataforma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Instagram">📱 Instagram</SelectItem>
                    <SelectItem value="Facebook">📘 Facebook</SelectItem>
                    <SelectItem value="LinkedIn">💼 LinkedIn</SelectItem>
                    <SelectItem value="Email">📧 E-mail</SelectItem>
                    <SelectItem value="WhatsApp">💬 WhatsApp</SelectItem>
                    <SelectItem value="Web">🌐 Web</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                    <Target className="w-3 h-3 text-orange-600" />
                  </div>
                  <label className="text-sm font-semibold text-gray-900">Tipo de Conteúdo</label>
                </div>
                <Select value={copyType} onValueChange={setCopyType}>
                  <SelectTrigger className="border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl">
                    <SelectValue placeholder="Tipo de conteúdo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Post Orgânico">📝 Post Orgânico</SelectItem>
                    <SelectItem value="Stories">📱 Stories</SelectItem>
                    <SelectItem value="Anúncio">💰 Anúncio</SelectItem>
                    <SelectItem value="Newsletter">📬 Newsletter</SelectItem>
                    <SelectItem value="Carrossel">🔄 Carrossel</SelectItem>
                    <SelectItem value="Landing Page">🌐 Landing Page</SelectItem>
                    <SelectItem value="Script">📞 Script</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Generate Button - Design Moderno */}
            <div className="space-y-3">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !briefing.trim()}
                className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none disabled:opacity-50"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 mr-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="text-base font-semibold">Gerando Copy com IA...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 mr-3" />
                    <span className="text-base font-semibold">✨ Gerar Copy Contextual</span>
                  </>
                )}
              </Button>
              
              {!briefing.trim() && (
                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    Preencha a descrição para gerar sua copy personalizada
                  </p>
                </div>
              )}
            </div>

            {/* Generated Copy - Design Moderno */}
            {generatedCopy && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Header com Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                      <Wand2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Copy Gerada com IA</h3>
                      <p className="text-sm text-gray-500">Pronta para usar</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                      {platform}
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                      {copyType}
                    </Badge>
                  </div>
                </div>

                {/* Preview da Copy - Design Moderno */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  {/* Header do Preview */}
                  <div className="bg-gradient-to-r from-gray-100 to-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center">
                          {platform === 'Instagram' && <Instagram className="w-4 h-4 text-pink-500" />}
                          {platform === 'Facebook' && <Facebook className="w-4 h-4 text-blue-600" />}
                          {platform === 'LinkedIn' && <Linkedin className="w-4 h-4 text-blue-700" />}
                          {platform === 'Email' && <Mail className="w-4 h-4 text-purple-600" />}
                          {platform === 'WhatsApp' && <MessageSquare className="w-4 h-4 text-green-600" />}
                          {platform === 'Web' && <Globe className="w-4 h-4 text-gray-600" />}
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-gray-900">{platform}</span>
                          <span className="text-xs text-gray-500 ml-2">• {copyType}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-gray-500">Pronto</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Conteúdo da Copy */}
                  <div className="p-6">
                    <div className="bg-white rounded-lg border border-gray-100 p-4">
                      <div className="prose prose-sm max-w-none">
                        <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800 font-medium">
                          {generatedCopy}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="space-y-3">
                  {/* Botões Principais */}
                  <div className="flex gap-3">
                    <Button 
                      onClick={handleCopyToClipboard} 
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                      size="lg"
                    >
                      <CopyIcon className="w-4 h-4 mr-2" />
                      Copiar Copy
                    </Button>
                    {(location.pathname === '/calendar' && selectedEvent) || selectedItem ? (
                      <Button 
                        onClick={handleUseGeneratedCopy} 
                        variant="secondary" 
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                        size="lg"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        {location.pathname === '/calendar' ? 'Agendar Post' : 'Aplicar ao Item'}
                      </Button>
                    ) : null}
                  </div>
                  
                  {/* Botão Secundário */}
                  <Button 
                    variant="outline" 
                    onClick={resetModal}
                    className="w-full border-gray-200 hover:bg-gray-50 transition-colors"
                    size="lg"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Nova Copy
                  </Button>
                </div>

                {/* Informações Adicionais */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Zap className="w-3 h-3 text-blue-600" />
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-blue-900 mb-1">Dica Pro</p>
                      <p className="text-blue-700">
                        {location.pathname === '/calendar' 
                          ? 'A copy foi otimizada para agendamento. Clique em "Agendar Post" para continuar.'
                          : 'A copy foi gerada com base no contexto da página atual. Use no Composer para editar.'
                        }
                      </p>
                    </div>
                  </div>
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