import { PageContext } from "./contextDetector";

export interface ActionConfig {
  id: string;
  title: string;
  description: string;
  icon: string;
  component: string;
  priority: number;
  requiresData?: boolean;
  dataSource?: string;
}

export const ACTIONS_MAP: Record<string, ActionConfig> = {
  // Ações de Geração de Copy
  generate_copy: {
    id: "generate_copy",
    title: "Gerar Copy Contextual",
    description: "Crie copy persuasiva baseada no contexto atual",
    icon: "Wand2",
    component: "CopyGeneration",
    priority: 1,
  },

  create_variations: {
    id: "create_variations",
    title: "Criar Variações",
    description: "Gere múltiplas versões do conteúdo",
    icon: "Copy",
    component: "CopyVariations",
    priority: 2,
  },

  // Ações de Upload e Extração
  upload_documents: {
    id: "upload_documents",
    title: "Upload de Documentos",
    description: "Upload PDFs, DOCX para extração de dados",
    icon: "Upload",
    component: "DocumentUpload",
    priority: 2,
  },

  extract_brandvoice: {
    id: "extract_brandvoice",
    title: "Extrair Brand Voice",
    description: "Analise documentos para extrair tom da marca",
    icon: "Mic",
    component: "BrandVoiceExtraction",
    priority: 3,
  },

  extract_personas: {
    id: "extract_personas",
    title: "Extrair Personas",
    description: "Identifique personas em documentos",
    icon: "Users",
    component: "PersonaExtraction",
    priority: 3,
  },

  // Ações de Analytics
  extract_insights: {
    id: "extract_insights",
    title: "Extrair Insights",
    description: "Analise dados para gerar insights acionáveis",
    icon: "TrendingUp",
    component: "InsightsExtraction",
    priority: 1,
    requiresData: true,
    dataSource: "analytics",
  },

  generate_reports: {
    id: "generate_reports",
    title: "Gerar Relatórios",
    description: "Crie relatórios executivos automáticos",
    icon: "FileBarChart",
    component: "ReportGeneration",
    priority: 2,
    requiresData: true,
    dataSource: "analytics",
  },

  create_copy_from_data: {
    id: "create_copy_from_data",
    title: "Copy Baseada em Dados",
    description: "Gere copy usando insights dos dados",
    icon: "BarChart3",
    component: "DataDrivenCopy",
    priority: 2,
    requiresData: true,
    dataSource: "analytics",
  },

  // Ações de Campanhas
  optimize_campaign: {
    id: "optimize_campaign",
    title: "Otimizar Campanha",
    description: "Melhore performance de campanhas existentes",
    icon: "Target",
    component: "CampaignOptimization",
    priority: 1,
    requiresData: true,
    dataSource: "campaigns",
  },

  analyze_performance: {
    id: "analyze_performance",
    title: "Analisar Performance",
    description: "Análise detalhada de performance",
    icon: "BarChart3",
    component: "PerformanceAnalysis",
    priority: 2,
    requiresData: true,
  },

  // Ações de Personas
  upload_personas: {
    id: "upload_personas",
    title: "Upload de Personas",
    description: "Faça upload de pesquisas de personas",
    icon: "UserPlus",
    component: "PersonaUpload",
    priority: 1,
  },

  analyze_audience: {
    id: "analyze_audience",
    title: "Analisar Audiência",
    description: "Analise sua audiência atual",
    icon: "Users",
    component: "AudienceAnalysis",
    priority: 2,
    requiresData: true,
    dataSource: "personas",
  },

  // Ações de Brand Voice
  upload_brandvoice: {
    id: "upload_brandvoice",
    title: "Upload Brand Voice",
    description: "Upload guidelines e documentos da marca",
    icon: "Upload",
    component: "BrandVoiceUpload",
    priority: 1,
  },

  analyze_tone: {
    id: "analyze_tone",
    title: "Analisar Tom",
    description: "Analise consistência do tom da marca",
    icon: "Mic",
    component: "ToneAnalysis",
    priority: 2,
    requiresData: true,
    dataSource: "brandvoices",
  },

  // Ações Rápidas
  quick_actions: {
    id: "quick_actions",
    title: "Ações Rápidas",
    description: "Acesso rápido às principais funcionalidades",
    icon: "Zap",
    component: "QuickActions",
    priority: 1,
  },

  // Ações de Templates
  optimize_templates: {
    id: "optimize_templates",
    title: "Otimizar Templates",
    description: "Melhore templates existentes",
    icon: "FileText",
    component: "TemplateOptimization",
    priority: 1,
    requiresData: true,
    dataSource: "templates",
  },

  create_template: {
    id: "create_template",
    title: "Criar Template",
    description: "Desenvolva novos templates",
    icon: "FilePlus",
    component: "TemplateCreation",
    priority: 2,
  },

  // Ações de Ideias e Hooks
  generate_ideas: {
    id: "generate_ideas",
    title: "Gerar Ideias",
    description: "Crie novas ideias criativas",
    icon: "Lightbulb",
    component: "IdeaGeneration",
    priority: 1,
  },

  create_hooks: {
    id: "create_hooks",
    title: "Criar Hooks",
    description: "Desenvolva hooks virais",
    icon: "TrendingUp",
    component: "HookCreation",
    priority: 1,
  },

  analyze_trends: {
    id: "analyze_trends",
    title: "Analisar Tendências",
    description: "Identifique tendências de mercado",
    icon: "TrendingUp",
    component: "TrendAnalysis",
    priority: 2,
  },
};

export const getActionsByContext = (context: PageContext): ActionConfig[] => {
  const actions = [context.primaryAction, ...context.secondaryActions]
    .map((actionId) => ACTIONS_MAP[actionId])
    .filter((action) => action !== undefined)
    .sort((a, b) => a.priority - b.priority);

  return actions;
};

export const getActionById = (actionId: string): ActionConfig | undefined => {
  return ACTIONS_MAP[actionId];
};
