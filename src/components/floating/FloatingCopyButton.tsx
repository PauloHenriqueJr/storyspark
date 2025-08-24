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
  CreditCard,
  Upload,
  Check,
  Brain,
  BookOpen
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
import { useTemplates } from '@/hooks/useTemplates';
import { useCampaigns } from '@/hooks/useCampaigns';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Separator } from '@/components/ui/separator';
import DocumentUploadModal from '@/components/upload/DocumentUploadModal';

// Interfaces para tipar corretamente as props e estados
interface ToastNotifications {
  showSuccess: (title: string, description?: string, duration?: number) => string;
  showError: (title: string, description?: string, duration?: number) => string;
  showInfo: (title: string, description?: string, duration?: number) => string;
}

interface SystemToastNotifications extends ToastNotifications {
  showWarning: (title: string, description?: string, duration?: number) => string;
}

interface FloatingCopyButtonProps {
  toastNotifications: ToastNotifications;
  systemToastNotifications: SystemToastNotifications;
  onOpenScheduleModal?: (copyContent: string, platform: string, copyType: string) => void;
}

interface ContextConfig {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
  suggestions: string[];
  defaultPlatform?: string;
  defaultType?: string;
  targetPage?: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  platform: string;
  time: string;
  date: Date;
  event_date: string;
  status: 'Agendado' | 'Publicado' | 'Rascunho';
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface BrandVoice {
  id: string;
  workspace_id: string;
  user_id: string;
  name: string;
  description: string;
  tone: string;
  style: string;
  examples: string[];
  guidelines: string;
  usage_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  personality_traits?: string[];
  audience?: string;
  platform?: string;
  context?: string;
  writing_style?: string;
  avoid?: string;
  good_example?: string;
  bad_example?: string;
  keywords?: string[];
}

interface Persona {
  id: string;
  workspace_id: string;
  user_id: string;
  name: string;
  age_range?: string;
  location?: string;
  occupation?: string;
  goals?: string[];
  pain_points?: string[];
  interests?: string[];
  preferred_channels?: string[];
  usage_count: number;
  created_at: string;
  updated_at?: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  type: string;
  content: string;
  blocks: any[];
  usage_count: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
  workspace_id: string;
  version: number;
  tags?: string[];
  thumbnail_url?: string;
  performance_score?: number;
}

interface Campaign {
  id: string;
  name: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string;
  budget: number;
  spent: number;
  roi: number;
  created_at: string;
  updated_at: string;
  user_id: string;
  workspace_id: string;
  target_personas?: string[];
  brand_voice_id?: string;
  template_id?: string;
}

interface PageData {
  hasData: boolean;
  data: Array<BrandVoice | Persona | Template | Campaign | any>;
  type: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  emptyMessage: string;
  createMessage: string;
  suggestions: string[];
  getContext: (item: BrandVoice | Persona | Template | Campaign | any) => string;
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
      'E-mail de promoção',
      'E-mail de feedback'
    ],
    defaultPlatform: 'E-mail',
    targetPage: '/email-marketing'
  },
  '/social-media': {
    title: 'Copy para Mídias Sociais',
    icon: TrendingUp,
    color: 'bg-pink-600',
    description: 'Mídias Sociais que geram engajamento',
    suggestions: [
      'Post de Instagram',
      'Tópico do Twitter',
      'Story do Facebook'
    ],
    defaultPlatform: 'Instagram',
    targetPage: '/social-media'
  },
  '/brand-voices': {
    title: 'Copy com Brand Voice',
    icon: Mic,
    color: 'bg-teal-600',
    description: 'Copy alinhada com sua marca',
    suggestions: [
      'Copy com tom profissional',
      'Copy com tom casual',
      'Copy com tom inspirador'
    ],
    defaultPlatform: 'Facebook',
    targetPage: '/brand-voices'
  },
  '/personas': {
    title: 'Copy para Personas',
    icon: Users,
    color: 'bg-purple-600',
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

const FloatingCopyButton: React.FC<FloatingCopyButtonProps> = ({ toastNotifications, systemToastNotifications, onOpenScheduleModal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [briefing, setBriefing] = useState('');
  const [platform, setPlatform] = useState('');
  const [copyType, setCopyType] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCopy, setGeneratedCopy] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventSelector, setShowEventSelector] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BrandVoice | Persona | Template | Campaign | null>(null);
  const [showItemSelector, setShowItemSelector] = useState(false);
  const [customizationMode, setCustomizationMode] = useState(false);
  const [customBriefing, setCustomBriefing] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { events } = useCalendar();
  const { voices } = useBrandVoices();
  const { personas } = usePersonas();
  const { templates } = useTemplates();
  const { campaigns } = useCampaigns();
  const analyticsData = useAnalytics();

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
    if (['/personas', '/brand-voices', '/voices', '/ai-ideas', '/trending-hooks', '/landing-pages', '/funnels', '/analytics', '/templates', '/campaigns', '/social-scheduler', '/email-marketing', '/push-whatsapp', '/call-scripts', '/crm', '/content-library', '/ab-tests', '/feedback', '/team', '/integrations', '/billing', '/settings'].includes(location.pathname)) {
      setShowItemSelector(true);
    }
  }, [location.pathname, currentContext, events, voices, personas]);

  const handleGenerate = async () => {
    const currentBriefing = customizationMode ? customBriefing : briefing;
    
    if (!currentBriefing.trim()) {
      toastNotifications.showError(
        "Briefing necessário",
        "Descreva o que você quer comunicar."
      );
      return;
    }

    setIsGenerating(true);
    try {
      const response = await copyGenerationService.generateCopy({
        briefing: currentBriefing,
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
    setCustomizationMode(false);
    setCustomBriefing('');
    setIsModalOpen(false);
  };

  const handleDataExtracted = (data: Record<string, unknown>) => {
    // Aqui você implementaria a lógica para aplicar os dados extraídos
    // Por exemplo, criar brand voices, personas, etc.
    console.log('Dados extraídos:', data);
    
    // Exemplo de aplicação automática
    if (data.brandVoice) {
      // Criar brand voice automaticamente
      toastNotifications.showSuccess(
        "Brand Voice criada!",
        `Brand voice "${(data.brandVoice as BrandVoice).name}" foi criada automaticamente.`
      );
    }
    
    if (data.personas && Array.isArray(data.personas)) {
      // Criar personas automaticamente
      toastNotifications.showSuccess(
        "Personas criadas!",
        `${data.personas.length} personas foram criadas automaticamente.`
      );
    }
    
    if (data.companyInfo) {
      // Atualizar informações da empresa
      toastNotifications.showSuccess(
        "Informações da empresa atualizadas!",
        "Dados da empresa foram aplicados automaticamente."
      );
    }
  };

  const handleEventSelect = (event: CalendarEvent) => {
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
        `A copy foi aplicada ao item "${selectedItem.name || (selectedItem as any).title}"`
      );
    }
  };

  const handleItemSelect = (item: BrandVoice | Persona | Template | Campaign) => {
    setSelectedItem(item);
    
    // Usar contexto específico da página se disponível
    let baseContext = '';
    if (pageData?.getContext) {
      baseContext = pageData.getContext(item);
    } else {
      // Fallback para configuração genérica
      switch (location.pathname) {
        case '/personas':
          baseContext = `Gerar copy direcionada para a persona: ${item.name}`;
          break;
        case '/brand-voices':
          baseContext = `Gerar copy usando a brand voice: ${item.name}`;
          break;
        case '/templates':
          baseContext = `Gerar copy baseada no template: ${item.name}`;
          break;
        case '/campaigns':
          baseContext = `Gerar copy para a campanha: ${item.name}`;
          break;
        case '/voices':
          baseContext = `Gerar copy usando a voice: ${item.name}`;
          break;
        case '/ai-ideas':
          baseContext = `Desenvolver copy baseada na ideia: ${(item as any).topic || (item as any).content?.[0] || 'Ideia IA'}`;
          break;
        case '/trending-hooks':
          baseContext = `Criar copy usando o hook: ${(item as any).hook}`;
          break;
        default:
          baseContext = `Gerar copy para: ${item.name || (item as any).title}`;
      }
    }
    
    // Definir briefing base e entrar em modo de personalização
    setBriefing(baseContext);
    setCustomBriefing(baseContext);
    setCustomizationMode(true);
    setShowItemSelector(false);
  };

  // Função para detectar dados disponíveis e funcionalidades específicas
  const getPageSpecificData = (): PageData | null => {
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
          ],
          getContext: (item: BrandVoice) => `Usando a brand voice "${item.name}" com tom ${item.tone || 'profissional'}. ${item.description || ''}`
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
          ],
          getContext: (item: Persona) => `Direcionado para a persona "${item.name}" - ${item.occupation || 'Sem descrição'}`
        };
      case '/templates':
        return {
          hasData: templates.length > 0,
          data: templates,
          type: 'template',
          title: 'Templates',
          icon: FileText,
          color: 'bg-gradient-to-r from-blue-500 to-indigo-500',
          emptyMessage: 'Nenhum template criado ainda',
          createMessage: 'Criar novo template com IA',
          suggestions: [
            'Template para lançamento de produto',
            'Template para campanha sazonal',
            'Template para engajamento',
            'Template para conversão'
          ],
          getContext: (item: Template) => `Baseado no template "${item.name}" - ${item.description || 'Template profissional'}`
        };
      case '/campaigns':
        return {
          hasData: campaigns.length > 0,
          data: campaigns,
          type: 'campaign',
          title: 'Campanhas',
          icon: Target,
          color: 'bg-gradient-to-r from-green-500 to-emerald-500',
          emptyMessage: 'Nenhuma campanha criada ainda',
          createMessage: 'Criar nova campanha com IA',
          suggestions: [
            'Copy para campanha de lançamento',
            'Copy para campanha de remarketing',
            'Copy para campanha sazonal',
            'Copy para campanha de engajamento'
          ],
          getContext: (item: Campaign) => `Para a campanha "${item.name}" - ${item.description || 'Campanha ativa'}`
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
          ],
          getContext: () => 'Gerando ideias criativas com IA'
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
          ],
          getContext: () => 'Criando copy com hooks virais'
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
          ],
          getContext: () => 'Criando copy para landing page de alta conversão'
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
          ],
          getContext: () => 'Criando copy para funil de vendas'
        };
      case '/analytics':
        return {
          hasData: analyticsData && Object.keys(analyticsData).length > 0,
          data: analyticsData ? Object.entries(analyticsData).map(([key, value]) => ({ name: key, value })) : [],
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
          ],
          getContext: (item: { name: string; value: unknown }) => `Baseado nos dados de ${item.name}: ${item.value}`
        };
      case '/social-scheduler':
        return {
          hasData: false,
          data: [],
          type: 'scheduler',
          title: 'Social Scheduler',
          icon: Calendar,
          color: 'bg-gradient-to-r from-pink-500 to-rose-500',
          emptyMessage: 'Nenhum post agendado',
          createMessage: 'Criar copy para post',
          suggestions: [
            'Copy para post de engajamento',
            'Copy para post promocional',
            'Copy para post educativo',
            'Copy para post de storytelling'
          ],
          getContext: () => 'Criando copy para post nas redes sociais'
        };
      case '/email-marketing':
        return {
          hasData: false,
          data: [],
          type: 'email',
          title: 'Email Marketing',
          icon: Mail,
          color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
          emptyMessage: 'Nenhum email criado',
          createMessage: 'Criar copy para email',
          suggestions: [
            'Subject line de alta abertura',
            'Copy do corpo do email',
            'Copy do call-to-action',
            'Copy de follow-up'
          ],
          getContext: () => 'Criando copy para email marketing'
        };
      case '/push-whatsapp':
        return {
          hasData: false,
          data: [],
          type: 'whatsapp',
          title: 'Push WhatsApp',
          icon: MessageSquare,
          color: 'bg-gradient-to-r from-green-500 to-teal-500',
          emptyMessage: 'Nenhuma mensagem criada',
          createMessage: 'Criar copy para WhatsApp',
          suggestions: [
            'Copy para mensagem de boas-vindas',
            'Copy para promoção',
            'Copy para suporte',
            'Copy para follow-up'
          ],
          getContext: () => 'Criando copy para mensagens no WhatsApp'
        };
      case '/call-scripts':
        return {
          hasData: false,
          data: [],
          type: 'script',
          title: 'Call Scripts',
          icon: Phone,
          color: 'bg-gradient-to-r from-purple-500 to-violet-500',
          emptyMessage: 'Nenhum script criado',
          createMessage: 'Criar script de vendas',
          suggestions: [
            'Script de abertura',
            'Script de apresentação',
            'Script de objeções',
            'Script de fechamento'
          ],
          getContext: () => 'Criando script para ligações de vendas'
        };
      case '/crm':
        return {
          hasData: false,
          data: [],
          type: 'crm',
          title: 'CRM',
          icon: Users,
          color: 'bg-gradient-to-r from-indigo-500 to-blue-500',
          emptyMessage: 'Nenhum cliente cadastrado',
          createMessage: 'Criar copy para cliente',
          suggestions: [
            'Copy para follow-up',
            'Copy para onboarding',
            'Copy para reativação',
            'Copy para upsell'
          ],
          getContext: () => 'Criando copy para gestão de clientes'
        };
      case '/content-library':
        return {
          hasData: false,
          data: [],
          type: 'content',
          title: 'Content Library',
          icon: BookOpen,
          color: 'bg-gradient-to-r from-amber-500 to-orange-500',
          emptyMessage: 'Nenhum conteúdo criado',
          createMessage: 'Criar novo conteúdo',
          suggestions: [
            'Copy para artigo de blog',
            'Copy para post de rede social',
            'Copy para newsletter',
            'Copy para case study'
          ],
          getContext: () => 'Criando conteúdo para biblioteca'
        };
      case '/voices':
        return {
          hasData: false,
          data: [],
          type: 'voice',
          title: 'Voices',
          icon: Mic,
          color: 'bg-gradient-to-r from-emerald-500 to-teal-500',
          emptyMessage: 'Nenhuma voice criada',
          createMessage: 'Criar nova voice',
          suggestions: [
            'Voice para narração',
            'Voice para podcast',
            'Voice para vídeo',
            'Voice para apresentação'
          ],
          getContext: () => 'Criando voice para áudio'
        };
      case '/ab-tests':
        return {
          hasData: false,
          data: [],
          type: 'test',
          title: 'A/B Tests',
          icon: TestTube,
          color: 'bg-gradient-to-r from-violet-500 to-purple-500',
          emptyMessage: 'Nenhum teste criado',
          createMessage: 'Criar teste A/B',
          suggestions: [
            'Copy para variante A',
            'Copy para variante B',
            'Copy para hipótese',
            'Copy para resultados'
          ],
          getContext: () => 'Criando copy para teste A/B'
        };
      case '/feedback':
        return {
          hasData: false,
          data: [],
          type: 'feedback',
          title: 'Feedback',
          icon: MessageSquare,
          color: 'bg-gradient-to-r from-cyan-500 to-blue-500',
          emptyMessage: 'Nenhum feedback recebido',
          createMessage: 'Criar copy para feedback',
          suggestions: [
            'Copy para solicitar feedback',
            'Copy para agradecer feedback',
            'Copy para implementar sugestões',
            'Copy para follow-up'
          ],
          getContext: () => 'Criando copy para gestão de feedback'
        };
      case '/team':
        return {
          hasData: false,
          data: [],
          type: 'team',
          title: 'Team',
          icon: Users,
          color: 'bg-gradient-to-r from-slate-500 to-gray-500',
          emptyMessage: 'Nenhum membro na equipe',
          createMessage: 'Criar copy para equipe',
          suggestions: [
            'Copy para onboarding',
            'Copy para treinamento',
            'Copy para comunicação',
            'Copy para motivação'
          ],
          getContext: () => 'Criando copy para gestão de equipe'
        };
      case '/integrations':
        return {
          hasData: false,
          data: [],
          type: 'integration',
          title: 'Integrations',
          icon: Link,
          color: 'bg-gradient-to-r from-gray-500 to-slate-500',
          emptyMessage: 'Nenhuma integração configurada',
          createMessage: 'Criar copy para integração',
          suggestions: [
            'Copy para configuração',
            'Copy para documentação',
            'Copy para suporte',
            'Copy para atualização'
          ],
          getContext: () => 'Criando copy para integrações'
        };
      case '/billing':
        return {
          hasData: false,
          data: [],
          type: 'billing',
          title: 'Billing',
          icon: CreditCard,
          color: 'bg-gradient-to-r from-emerald-500 to-green-500',
          emptyMessage: 'Nenhum plano ativo',
          createMessage: 'Criar copy para billing',
          suggestions: [
            'Copy para upgrade de plano',
            'Copy para renovação',
            'Copy para cancelamento',
            'Copy para suporte'
          ],
          getContext: () => 'Criando copy para gestão de cobrança'
        };
      case '/settings':
        return {
          hasData: false,
          data: [],
          type: 'settings',
          title: 'Settings',
          icon: Settings,
          color: 'bg-gradient-to-r from-slate-500 to-gray-500',
          emptyMessage: 'Configurações padrão',
          createMessage: 'Criar copy para configurações',
          suggestions: [
            'Copy para onboarding',
            'Copy para configurações',
            'Copy para segurança',
            'Copy para preferências'
          ],
          getContext: () => 'Criando copy para configurações'
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
        className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-[9999]"
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
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 ${currentContext.color} border-4 border-white/30 dark:border-gray-800/30 relative z-10 backdrop-blur-sm`}
            size="lg"
          >
            <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-white drop-shadow-lg" />
          </Button>
          
          {/* Pulse effect */}
          <div className={`absolute inset-0 rounded-full ${currentContext.color} opacity-40 animate-ping pointer-events-none`} />
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden sm:block">
            <div className="bg-gray-900 dark:bg-gray-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
              {currentContext.title}
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-800"></div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Context Modal - Design Moderno */}
      <Dialog open={isModalOpen} onOpenChange={(open) => !open && resetModal()}>
        <DialogContent className="max-w-3xl w-[95vw] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-gray-200 dark:border-gray-700">
          <DialogHeader className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${currentContext.color} flex items-center justify-center shadow-lg`}>
                <IconComponent className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                  {currentContext.title}
                </DialogTitle>
                <DialogDescription className="text-base text-gray-600 dark:text-gray-400 mt-1">
                  {currentContext.description}
                </DialogDescription>
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700">
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
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Calendar className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  </div>
                  <label className="text-sm font-semibold text-gray-900 dark:text-white">Selecionar Evento Agendado</label>
                </div>
                <div className="max-h-48 overflow-y-auto space-y-3 border border-gray-200 dark:border-gray-600 rounded-xl p-4 bg-white dark:bg-gray-800">
                  {events.slice(0, 5).map((event) => (
                    <div
                      key={event.id}
                      onClick={() => handleEventSelect(event)}
                      className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 dark:border-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 hover:border-blue-200 dark:hover:border-blue-600 cursor-pointer transition-all duration-200 group"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-sm">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                          {event.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(event.event_date).toLocaleDateString()} • {event.platform}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Separator className="bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-600 to-transparent" />
              </div>
            )}

            {/* Contextual Assistant - Sistema Inteligente */}
            {pageData && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full ${pageData.color} flex items-center justify-center`}>
                    <pageData.icon className="w-3 h-3 text-white" />
                  </div>
                  <label className="text-sm font-semibold text-gray-900 dark:text-white">
                    Assistente IA - {pageData.title}
                  </label>
                </div>

                {pageData.hasData ? (
                  // Se há dados, mostrar seletor
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Selecionar existente:</span>
                      <Badge variant="outline" className="text-xs">
                        {pageData.data.length} disponível{pageData.data.length !== 1 ? 'is' : ''}
                      </Badge>
                    </div>
                    <div className="max-h-48 overflow-y-auto space-y-3 border border-gray-200 dark:border-gray-600 rounded-xl p-4 bg-white dark:bg-gray-800">
                      {pageData.data.slice(0, 5).map((item: BrandVoice | Persona | Template | Campaign | { name: string; value: unknown }, index: number) => (
                        <div
                          key={index}
                          onClick={() => {
                            if ('name' in item && 'value' in item) {
                              // Tratar item de analytics
                              toastNotifications.showInfo(
                                "Item selecionado",
                                `Item: ${item.name}`
                              );
                            } else {
                              // Tratar outros tipos de itens
                              handleItemSelect(item as BrandVoice | Persona | Template | Campaign);
                            }
                          }}
                          className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 dark:border-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 hover:border-blue-200 dark:hover:border-blue-600 cursor-pointer transition-all duration-200 group"
                        >
                          <div className={`w-10 h-10 rounded-full ${pageData.color} flex items-center justify-center shadow-sm`}>
                            <pageData.icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                              {'name' in item ? item.name : ('title' in item ? (item as any).title : 'Item')}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {'description' in item ? (item as any).description : ('tone' in item ? (item as any).tone : ('value' in item ? item.value : 'Sem descrição'))}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Edit3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Se não há dados, oferecer criação com IA ou funcionalidades específicas
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-600 rounded-xl p-6">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                        <pageData.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                          {pageData.emptyMessage}
                        </h3>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                          {pageData.type === 'brand-voice' || pageData.type === 'persona' ? (
                            `Que tal criar sua primeira ${pageData.title.toLowerCase()} com a ajuda da IA? Ela vai te ajudar a definir características, tom de voz e personalidade.`
                          ) : pageData.type === 'idea' ? (
                            'Que tal gerar ideias criativas com IA? Ela vai te ajudar a criar conceitos inovadores para suas campanhas.'
                          ) : (
                            `Que tal criar copy otimizada para ${pageData.title.toLowerCase()}? A IA vai te ajudar a criar conteúdo que converte.`
                          )}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
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
                              className="border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-900/20"
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

                <Separator className="bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-600 to-transparent" />
              </div>
            )}

            {/* Upload de Documentos - Nova Funcionalidade */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Upload className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                </div>
                <label className="text-sm font-semibold text-gray-900 dark:text-white">
                  Upload de Documentos
                </label>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-600 text-xs">
                  Novo
                </Badge>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-600 rounded-xl p-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                    <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      IA Analisa seus Documentos
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                      Faça upload de PDFs, DOCX ou TXT com informações da sua empresa. 
                      A IA extrairá automaticamente brand voice, personas, dados de marketing e muito mais!
                    </p>
                    <Button 
                      onClick={() => setShowUploadModal(true)}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload com IA
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Suggestions - Design Moderno */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <Lightbulb className="w-3 h-3 text-yellow-600 dark:text-yellow-400" />
                </div>
                <label className="text-sm font-semibold text-gray-900 dark:text-white">
                  Sugestões Rápidas
                  {pageData && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
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
                    className="justify-start h-auto p-4 text-left border-gray-200 dark:border-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 group"
                  >
                    <div className="flex items-start gap-3 w-full">
                      <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">{index + 1}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                        {suggestion}
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Personalização - Novo Sistema Flexível */}
            {customizationMode && selectedItem && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Edit3 className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                  </div>
                  <label className="text-sm font-semibold text-gray-900 dark:text-white">Personalizar Briefing</label>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-600 text-xs">
                    Opcional
                  </Badge>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-600 rounded-xl p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full ${pageData?.color || currentContext.color} flex items-center justify-center`}>
                        {React.createElement(pageData?.icon || IconComponent, { className: "w-4 h-4 text-white" })}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {selectedItem.name || (selectedItem as { title?: string }).title || 'Item sem nome'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Base selecionada para personalização
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Briefing Base (gerado automaticamente):
                      </label>
                      <div className="text-xs text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                        {briefing}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Personalizar briefing (adicione detalhes específicos):
                      </label>
                      <Textarea
                        placeholder="Adicione detalhes específicos, objetivos, público-alvo, tom de voz, call-to-action..."
                        value={customBriefing}
                        onChange={(e) => setCustomBriefing(e.target.value)}
                        className="min-h-[100px] resize-none border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500 dark:focus:border-purple-400 dark:focus:ring-purple-400 rounded-lg text-sm leading-relaxed bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          setBriefing(customBriefing);
                          setCustomizationMode(false);
                        }}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                        size="sm"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Usar Personalizado
                      </Button>
                      <Button
                        onClick={() => {
                          setCustomBriefing(briefing);
                          setCustomizationMode(false);
                        }}
                        variant="outline"
                        className="border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-300 dark:hover:bg-purple-900/20"
                        size="sm"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Manter Original
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Briefing - Design Moderno */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <FileText className="w-3 h-3 text-green-600 dark:text-green-400" />
                </div>
                <label className="text-sm font-semibold text-gray-900 dark:text-white">
                  {customizationMode ? 'Briefing Final' : 'Descrição do Conteúdo'}
                </label>
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-600 text-xs">
                  Obrigatório
                </Badge>
              </div>
              <div className="relative">
                <Textarea
                  placeholder={customizationMode ? "Briefing personalizado será usado para gerar a copy..." : "Descreva o que você quer comunicar, o objetivo da copy, público-alvo, tom de voz..."}
                  value={customizationMode ? customBriefing : briefing}
                  onChange={(e) => customizationMode ? setCustomBriefing(e.target.value) : setBriefing(e.target.value)}
                  className="min-h-[140px] resize-none border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 rounded-xl text-sm leading-relaxed bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-400 dark:text-gray-500">
                  {(customizationMode ? customBriefing : briefing).length}/500
                </div>
              </div>
            </div>

            {/* Platform & Type Selection - Design Moderno */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Globe className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                  </div>
                  <label className="text-sm font-semibold text-gray-900 dark:text-white">Plataforma</label>
                </div>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger className="border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500 dark:focus:border-purple-400 dark:focus:ring-purple-400 rounded-xl bg-white dark:bg-gray-800">
                    <SelectValue placeholder="Escolha a plataforma" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
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
                  <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <Target className="w-3 h-3 text-orange-600 dark:text-orange-400" />
                  </div>
                  <label className="text-sm font-semibold text-gray-900 dark:text-white">Tipo de Conteúdo</label>
                </div>
                <Select value={copyType} onValueChange={setCopyType}>
                  <SelectTrigger className="border-gray-200 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500 dark:focus:border-orange-400 dark:focus:ring-orange-400 rounded-xl bg-white dark:bg-gray-800">
                    <SelectValue placeholder="Tipo de conteúdo" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
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
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                      <Wand2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Copy Gerada com IA</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Pronta para usar</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-600">
                      {platform}
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-600">
                      {copyType}
                    </Badge>
                  </div>
                </div>

                {/* Preview da Copy - Design Moderno */}
                <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm overflow-hidden">
                  {/* Header do Preview */}
                  <div className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600 px-6 py-4 border-b border-gray-200 dark:border-gray-500">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center">
                          {platform === 'Instagram' && <Instagram className="w-4 h-4 text-pink-500" />}
                          {platform === 'Facebook' && <Facebook className="w-4 h-4 text-blue-600" />}
                          {platform === 'LinkedIn' && <Linkedin className="w-4 h-4 text-blue-700" />}
                          {platform === 'Email' && <Mail className="w-4 h-4 text-purple-600" />}
                          {platform === 'WhatsApp' && <MessageSquare className="w-4 h-4 text-green-600" />}
                          {platform === 'Web' && <Globe className="w-4 h-4 text-gray-600" />}
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">{platform}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">• {copyType}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Pronto</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Conteúdo da Copy */}
                  <div className="p-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-600 p-4">
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800 dark:text-gray-200 font-medium">
                          {generatedCopy}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="space-y-3">
                  {/* Botões Principais */}
                  <div className="flex flex-col sm:flex-row gap-3">
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
                    className="w-full border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    size="lg"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Nova Copy
                  </Button>
                </div>

                {/* Informações Adicionais */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-600 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Zap className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">Dica Pro</p>
                      <p className="text-blue-700 dark:text-blue-300">
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

      {/* Document Upload Modal */}
      <DocumentUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onDataExtracted={handleDataExtracted}
      />
    </>
  );
};

export default FloatingCopyButton;