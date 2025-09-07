import {
  PenTool,
  BarChart3,
  Users,
  Mic,
  Calendar,
  Target,
  Globe,
  TrendingUp,
  MessageSquare,
  Lightbulb,
  FileText,
  Zap,
  Mail,
  Instagram,
  Phone,
  Database,
  MessageCircle,
  BookOpen,
  LayoutDashboard,
  Upload,
} from "lucide-react";

export interface PageContext {
  title: string;
  description: string;
  icon: any;
  color: string;
  primaryAction: string;
  secondaryActions: string[];
  dataSource?: string;
  suggestions: string[];
  modalConfig: {
    maxWidth: string;
    sections: string[];
  };
}

export const PAGE_CONTEXTS: Record<string, PageContext> = {
  // Páginas de Criação de Conteúdo
  "/composer": {
    title: "Assistente de Criação",
    description: "Crie copy persuasiva com IA contextual",
    icon: PenTool,
    color: "bg-gradient-to-r from-blue-600 to-indigo-600",
    primaryAction: "generate_copy",
    secondaryActions: [
      "upload_documents",
      "extract_brandvoice",
      "create_variations",
    ],
    suggestions: [
      "Copy para redes sociais",
      "E-mail persuasivo",
      "Landing page de conversão",
      "Anúncios pagos",
    ],
    modalConfig: {
      maxWidth: "max-w-4xl",
      sections: ["briefing", "platform", "type", "upload", "generation"],
    },
  },

  "/campaigns": {
    title: "Assistente de Campanhas",
    description: "Otimize e crie campanhas de marketing",
    icon: Target,
    color: "bg-gradient-to-r from-purple-600 to-pink-600",
    primaryAction: "optimize_campaign",
    secondaryActions: [
      "generate_copy",
      "analyze_performance",
      "create_variations",
    ],
    dataSource: "campaigns",
    suggestions: [
      "Otimizar campanha atual",
      "Criar variações A/B",
      "Analisar performance",
      "Gerar copy para nova campanha",
    ],
    modalConfig: {
      maxWidth: "max-w-5xl",
      sections: [
        "campaign_selector",
        "optimization",
        "copy_generation",
        "analytics",
      ],
    },
  },

  // Páginas de Analytics e Dados
  "/analytics": {
    title: "Assistente de Analytics",
    description: "Extraia insights e gere relatórios inteligentes",
    icon: BarChart3,
    color: "bg-gradient-to-r from-green-600 to-emerald-600",
    primaryAction: "extract_insights",
    secondaryActions: [
      "generate_reports",
      "create_copy_from_data",
      "upload_analytics",
    ],
    dataSource: "analytics",
    suggestions: [
      "Analisar tendências de performance",
      "Gerar relatório executivo",
      "Criar copy baseada em dados",
      "Identificar oportunidades",
    ],
    modalConfig: {
      maxWidth: "max-w-6xl",
      sections: ["data_overview", "insights", "reports", "copy_generation"],
    },
  },

  "/dashboard": {
    title: "Assistente do Dashboard",
    description: "Visão geral e ações rápidas",
    icon: LayoutDashboard,
    color: "bg-gradient-to-r from-slate-600 to-gray-600",
    primaryAction: "quick_actions",
    secondaryActions: ["generate_copy", "analyze_overview", "create_reports"],
    dataSource: "dashboard",
    suggestions: [
      "Copy rápida para hoje",
      "Resumo de performance",
      "Ações prioritárias",
      "Insights do dia",
    ],
    modalConfig: {
      maxWidth: "max-w-4xl",
      sections: ["quick_actions", "overview", "copy_generation"],
    },
  },

  // Páginas de Personas e Brand Voice
  "/personas": {
    title: "Assistente de Personas",
    description: "Crie e gerencie personas com IA",
    icon: Users,
    color: "bg-gradient-to-r from-rose-600 to-pink-600",
    primaryAction: "upload_personas",
    secondaryActions: ["generate_copy", "extract_personas", "analyze_audience"],
    dataSource: "personas",
    suggestions: [
      "Upload de pesquisa de personas",
      "Gerar copy direcionada",
      "Extrair personas de documentos",
      "Analisar audiência atual",
    ],
    modalConfig: {
      maxWidth: "max-w-5xl",
      sections: [
        "persona_upload",
        "persona_selector",
        "copy_generation",
        "analysis",
      ],
    },
  },

  "/brand-voices": {
    title: "Assistente de Brand Voice",
    description: "Desenvolva e aplique sua voz da marca",
    icon: Mic,
    color: "bg-gradient-to-r from-orange-600 to-red-600",
    primaryAction: "upload_brandvoice",
    secondaryActions: ["generate_copy", "extract_voice", "analyze_tone"],
    dataSource: "brandvoices",
    suggestions: [
      "Upload de guidelines da marca",
      "Extrair tom de voz",
      "Gerar copy com brand voice",
      "Analisar consistência",
    ],
    modalConfig: {
      maxWidth: "max-w-5xl",
      sections: [
        "voice_upload",
        "voice_selector",
        "copy_generation",
        "tone_analysis",
      ],
    },
  },

  "/voices": {
    title: "Assistente de Voices",
    description: "Gerencie vozes personalizadas",
    icon: MessageSquare,
    color: "bg-gradient-to-r from-cyan-600 to-blue-600",
    primaryAction: "manage_voices",
    secondaryActions: ["generate_copy", "create_voice", "upload_samples"],
    dataSource: "voices",
    suggestions: [
      "Criar nova voice",
      "Upload de amostras de texto",
      "Gerar copy com voice específica",
      "Otimizar voice existente",
    ],
    modalConfig: {
      maxWidth: "max-w-4xl",
      sections: ["voice_manager", "voice_creator", "copy_generation"],
    },
  },

  // Páginas de Conteúdo e Templates
  "/templates": {
    title: "Assistente de Templates",
    description: "Crie e otimize templates de conteúdo",
    icon: FileText,
    color: "bg-gradient-to-r from-violet-600 to-purple-600",
    primaryAction: "optimize_templates",
    secondaryActions: ["generate_copy", "create_template", "upload_examples"],
    dataSource: "templates",
    suggestions: [
      "Otimizar template existente",
      "Criar novo template",
      "Gerar copy com template",
      "Upload de exemplos",
    ],
    modalConfig: {
      maxWidth: "max-w-5xl",
      sections: ["template_selector", "template_creator", "copy_generation"],
    },
  },

  "/ai-ideas": {
    title: "Assistente de Ideias IA",
    description: "Desenvolva ideias criativas com IA",
    icon: Lightbulb,
    color: "bg-gradient-to-r from-yellow-600 to-orange-600",
    primaryAction: "generate_ideas",
    secondaryActions: ["develop_idea", "create_copy", "upload_inspiration"],
    dataSource: "ideas",
    suggestions: [
      "Gerar novas ideias",
      "Desenvolver ideia existente",
      "Criar copy da ideia",
      "Upload de inspirações",
    ],
    modalConfig: {
      maxWidth: "max-w-4xl",
      sections: ["idea_generator", "idea_developer", "copy_creation"],
    },
  },

  "/trending-hooks": {
    title: "Assistente de Hooks Virais",
    description: "Crie hooks que engajam e convertem",
    icon: TrendingUp,
    color: "bg-gradient-to-r from-pink-600 to-rose-600",
    primaryAction: "create_hooks",
    secondaryActions: ["analyze_trends", "generate_copy", "upload_references"],
    dataSource: "hooks",
    suggestions: [
      "Criar hooks virais",
      "Analisar tendências",
      "Adaptar hook para copy",
      "Upload de referências",
    ],
    modalConfig: {
      maxWidth: "max-w-4xl",
      sections: ["hook_creator", "trend_analyzer", "copy_adaptation"],
    },
  },

  // Páginas de Marketing e Comunicação
  "/email-marketing": {
    title: "Assistente de E-mail Marketing",
    description: "Otimize campanhas de e-mail",
    icon: Mail,
    color: "bg-gradient-to-r from-blue-600 to-cyan-600",
    primaryAction: "optimize_email",
    secondaryActions: [
      "generate_copy",
      "analyze_performance",
      "create_sequence",
    ],
    dataSource: "emails",
    suggestions: [
      "Otimizar e-mail atual",
      "Criar sequência de e-mails",
      "Analisar taxa de abertura",
      "Gerar copy persuasiva",
    ],
    modalConfig: {
      maxWidth: "max-w-5xl",
      sections: ["email_optimizer", "sequence_creator", "performance_analyzer"],
    },
  },

  "/social-scheduler": {
    title: "Assistente de Redes Sociais",
    description: "Agende e otimize posts sociais",
    icon: Instagram,
    color: "bg-gradient-to-r from-purple-600 to-pink-600",
    primaryAction: "optimize_posts",
    secondaryActions: [
      "generate_copy",
      "schedule_content",
      "analyze_engagement",
    ],
    dataSource: "social_posts",
    suggestions: [
      "Otimizar posts agendados",
      "Gerar copy para hoje",
      "Analisar engajamento",
      "Criar série de posts",
    ],
    modalConfig: {
      maxWidth: "max-w-5xl",
      sections: ["post_optimizer", "scheduler", "engagement_analyzer"],
    },
  },

  "/calendar": {
    title: "Assistente de Calendário",
    description: "Gerencie conteúdo agendado",
    icon: Calendar,
    color: "bg-gradient-to-r from-blue-600 to-indigo-600",
    primaryAction: "manage_calendar",
    secondaryActions: ["generate_copy", "optimize_schedule", "analyze_timing"],
    dataSource: "calendar_events",
    suggestions: [
      "Gerar copy para evento",
      "Otimizar cronograma",
      "Analisar melhor timing",
      "Criar série de conteúdo",
    ],
    modalConfig: {
      maxWidth: "max-w-5xl",
      sections: ["event_manager", "copy_generator", "schedule_optimizer"],
    },
  },

  // Páginas de Landing Pages e Funis
  "/landing-pages": {
    title: "Assistente de Landing Pages",
    description: "Otimize conversão de landing pages",
    icon: Globe,
    color: "bg-gradient-to-r from-emerald-600 to-green-600",
    primaryAction: "optimize_landing",
    secondaryActions: [
      "generate_copy",
      "analyze_conversion",
      "create_variants",
    ],
    suggestions: [
      "Otimizar taxa de conversão",
      "Gerar copy persuasiva",
      "Criar variantes A/B",
      "Analisar performance",
    ],
    modalConfig: {
      maxWidth: "max-w-6xl",
      sections: ["landing_optimizer", "copy_generator", "conversion_analyzer"],
    },
  },

  "/funnels": {
    title: "Assistente de Funis",
    description: "Otimize funis de conversão",
    icon: Zap,
    color: "bg-gradient-to-r from-yellow-600 to-orange-600",
    primaryAction: "optimize_funnel",
    secondaryActions: ["generate_copy", "analyze_flow", "create_sequence"],
    suggestions: [
      "Otimizar funil atual",
      "Gerar copy para etapas",
      "Analisar fluxo de conversão",
      "Criar nova sequência",
    ],
    modalConfig: {
      maxWidth: "max-w-6xl",
      sections: ["funnel_optimizer", "flow_analyzer", "copy_generator"],
    },
  },

  // Páginas de Comunicação
  "/call-scripts": {
    title: "Assistente de Call Scripts",
    description: "Crie scripts de ligação eficazes",
    icon: Phone,
    color: "bg-gradient-to-r from-green-600 to-emerald-600",
    primaryAction: "create_scripts",
    secondaryActions: [
      "optimize_existing",
      "upload_recordings",
      "analyze_success",
    ],
    suggestions: [
      "Criar script de vendas",
      "Otimizar script existente",
      "Analisar sucesso de calls",
      "Upload de gravações",
    ],
    modalConfig: {
      maxWidth: "max-w-4xl",
      sections: ["script_creator", "script_optimizer", "success_analyzer"],
    },
  },

  "/push-whatsapp": {
    title: "Assistente de WhatsApp",
    description: "Otimize mensagens WhatsApp",
    icon: MessageCircle,
    color: "bg-gradient-to-r from-green-600 to-emerald-600",
    primaryAction: "optimize_messages",
    secondaryActions: [
      "create_sequences",
      "analyze_response",
      "generate_templates",
    ],
    suggestions: [
      "Otimizar mensagens",
      "Criar sequência de follow-up",
      "Analisar taxa de resposta",
      "Gerar templates",
    ],
    modalConfig: {
      maxWidth: "max-w-4xl",
      sections: ["message_optimizer", "sequence_creator", "response_analyzer"],
    },
  },

  // Páginas de Gestão
  "/crm": {
    title: "Assistente de CRM",
    description: "Otimize relacionamento com clientes",
    icon: Database,
    color: "bg-gradient-to-r from-indigo-600 to-blue-600",
    primaryAction: "optimize_crm",
    secondaryActions: [
      "generate_followup",
      "analyze_pipeline",
      "create_templates",
    ],
    dataSource: "crm_data",
    suggestions: [
      "Otimizar pipeline",
      "Gerar follow-up personalizado",
      "Analisar conversões",
      "Criar templates de contato",
    ],
    modalConfig: {
      maxWidth: "max-w-5xl",
      sections: ["crm_optimizer", "pipeline_analyzer", "template_creator"],
    },
  },

  "/content-library": {
    title: "Assistente de Biblioteca",
    description: "Organize e otimize conteúdo",
    icon: BookOpen,
    color: "bg-gradient-to-r from-purple-600 to-indigo-600",
    primaryAction: "organize_content",
    secondaryActions: [
      "generate_copy",
      "analyze_performance",
      "create_categories",
    ],
    dataSource: "content_library",
    suggestions: [
      "Organizar biblioteca",
      "Gerar copy similar",
      "Analisar performance",
      "Criar categorias",
    ],
    modalConfig: {
      maxWidth: "max-w-5xl",
      sections: ["content_organizer", "performance_analyzer", "copy_generator"],
    },
  },

  // Página de Importação com IA (upload único)
  "/import-data": {
    title: "Assistente de Importação IA",
    description:
      "Envie um arquivo e a IA cria Brand Voice, Personas e Campanhas",
    icon: Upload,
    color: "bg-gradient-to-r from-blue-600 to-purple-600",
    primaryAction: "upload_documents",
    secondaryActions: ["extract_brandvoice", "extract_personas"],
    suggestions: [
      "Dica: inclua tom de voz, público-alvo e objetivos",
      "PDF/DOCX/TXT até 10MB",
      "Você só precisa enviar uma vez",
    ],
    modalConfig: {
      maxWidth: "max-w-4xl",
      sections: ["upload", "validation", "application_summary"],
    },
  },
};

export const getPageContext = (pathname: string): PageContext => {
  return PAGE_CONTEXTS[pathname] || PAGE_CONTEXTS["/composer"]; // fallback
};

export const isContextualPage = (pathname: string): boolean => {
  return pathname in PAGE_CONTEXTS;
};

export const getContextualPages = (): string[] => {
  return Object.keys(PAGE_CONTEXTS);
};
