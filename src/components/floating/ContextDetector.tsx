import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Wand2,
  Mail,
  Calendar,
  FileText,
  Instagram,
  Facebook,
  Linkedin,
  Users,
  Target,
  Globe,
  TrendingUp,
  MessageSquare,
  Phone,
  BarChart3,
  Lightbulb,
  TestTube,
  Settings,
  Link,
  CreditCard,
  BookOpen,
  Zap
} from 'lucide-react';

// Interfaces para tipar corretamente as props e estados
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

interface ContextDetectorProps {
  onContextChange: (context: ContextConfig) => void;
}

const ContextDetector: React.FC<ContextDetectorProps> = ({ onContextChange }) => {
  const location = useLocation();
  
  // Detectar contexto baseado na rota atual com memoização
  const currentContext = useMemo(() => {
    return contextConfigs[location.pathname] || contextConfigs['default'];
  }, [location.pathname]);
  
  // Notificar o componente pai sobre a mudança de contexto
  React.useEffect(() => {
    onContextChange(currentContext);
  }, [currentContext, onContextChange]);
  
  return null; // Componente sem renderização visual
};

export default ContextDetector;