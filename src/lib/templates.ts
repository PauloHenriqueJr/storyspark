// StorySpark - Optimized Templates (subset)
// Templates specifically designed for market and culture

import React from "react";
import {
  Instagram,
  Twitter,
  Linkedin,
  Video,
  MessageCircle,
  Megaphone,
} from "lucide-react";

export interface Template {
  id: string;
  name: string;
  description: string;
  category:
    | "Social Media"
    | "Paid Ads"
    | "Professional"
    | "Email"
    | "Educational"
    | "E-commerce";
  platform: string;
  icon: React.ComponentType<{ className?: string }>;
  conversionRate: string;
  engagement: string;
  promptBase: string;
  requiredFields: TemplateField[];
  sampleOutput: string;
  audienceTag?: string;
  difficultyLevel: "Fácil" | "Médio" | "Avançado";
}

export interface TemplateField {
  id: string;
  label: string;
  placeholder: string;
  type: "text" | "textarea";
  required: boolean;
  maxLength?: number;
}

export const TEMPLATES: Template[] = [
  {
    id: "ig-legenda-viral",
    name: "IG Legenda Viral",
    description: "Legendas que geram 3x mais engajamento no Instagram",
    category: "Social Media",
    platform: "Instagram",
    icon: Instagram,
    conversionRate: "+189%",
    engagement: "+334%",
    audienceTag: "Influencers & Marcas",
    difficultyLevel: "Fácil",
    promptBase:
      "Crie uma legenda viral para Instagram sobre {tema} direcionada para {publico}, usando {tom}, com foco em {objetivo}. Use gírias brasileiras, emojis estratégicos e CTA que geram ação.",
    requiredFields: [
      {
        id: "tema",
        label: "Sobre o que é o post",
        placeholder: "Ex: dicas de copywriting para iniciantes",
        type: "text",
        required: true,
        maxLength: 100,
      },
    ],
    sampleOutput:
      '🚀 PARE de vender com palavras MORTAS!\n\nCopy que converte = R$ na conta. Simples assim.\n\nTestei essa técnica com +500 clientes e o resultado?\n\n✅ Marina (SP): +320% em conversão\n✅ Carlos (RJ): R$ 25K em 30 dias  \n✅ Ana (BH): 50% mais leads\n\n👉 O segredo? Falar a LÍNGUA do seu cliente.\n\nNão é sobre ser perfeito. É sobre conectar de verdade.\n\nQuer aprender? Comenta "COPY" que mando os 3 erros mais comuns na sua copy.',
  },
  {
    id: "twitter-hook-polemico",
    name: "X Hook Polêmico",
    description: "Threads controversas que viralizam e geram discussão",
    category: "Social Media",
    platform: "X (Twitter)",
    icon: Twitter,
    conversionRate: "+256%",
    engagement: "+412%",
    audienceTag: "Criadores de Conteúdo",
    difficultyLevel: "Médio",
    promptBase:
      "Crie um hook controverso para thread do X/Twitter sobre {tema}, direcionado para {publico}, tom {tom}. Use dados do mercado nacional, opiniões fortes mas respeitosas, e gere curiosidade para continuar lendo.",
    requiredFields: [
      {
        id: "tema",
        label: "Tema/opinião controversa",
        placeholder: "Ex: por que 90% dos cursos online não funcionam",
        type: "text",
        required: true,
        maxLength: 120,
      },
    ],
    sampleOutput:
      'Todo mundo fala sobre "construir audiência" no LinkedIn.\n\nMas a verdade que NINGUÉM conta no Brasil: 87% dos "gurus" que ensinam LinkedIn têm menos de 5K seguidores REAIS.\n\nTestei as estratégias dos top 50 por 6 meses. Investi R$ 12.000.\n\nResultado: 90% puro blablablá.\n\nAs 3 estratégias que REALMENTE funcionam no mercado: (thread)',
  },
  {
    id: "linkedin-autoridade-b2b",
    name: "LinkedIn Autoridade B2B",
    description: "Posts que constroem credibilidade no LinkedIn",
    category: "Professional",
    platform: "LinkedIn",
    icon: Linkedin,
    conversionRate: "+167%",
    engagement: "+278%",
    audienceTag: "Executivos & B2B",
    difficultyLevel: "Médio",
    promptBase:
      "Crie um post de autoridade para LinkedIn sobre {tema}, direcionado para {publico}, tom {tom}. Use experiências do mercado nacional, inclua dados/métricas reais, e posicione como expert na área.",
    requiredFields: [
      {
        id: "tema",
        label: "Área de expertise",
        placeholder: "Ex: gestão de equipes remotas no Brasil",
        type: "text",
        required: true,
        maxLength: 100,
      },
    ],
    sampleOutput:
      "Demiti 3 pessoas na mesma semana.\n\nNão por performance. Por algo muito pior: pararam de aprender.\n\nApós 8 anos gerenciando equipes no mercado nacional, aprendi que o maior risco não é contratar errado. É manter quem parou de evoluir.",
  },
  {
    id: "anuncio-meta-google",
    name: "Anúncio Meta/Google",
    description: "Anúncios de performance adaptados ao Brasil",
    category: "Paid Ads",
    platform: "Meta/Google",
    icon: Megaphone,
    conversionRate: "+142%",
    engagement: "+95%",
    audienceTag: "Gestores de Tráfego",
    difficultyLevel: "Fácil",
    promptBase:
      "Crie um anúncio de performance com Headline, Descrição e CTA para {produto}, com objetivo {objetivo}, público {publico}, e tom {tom}.",
    requiredFields: [
      {
        id: "produto",
        label: "Produto/Oferta",
        placeholder: "Ex: consultoria em marketing digital",
        type: "text",
        required: true,
      },
    ],
    sampleOutput:
      "Headline: Vendas 3x Maiores\nDescrição: Método comprovado que transforma visitantes em clientes fiéis em 30 dias\nCTA: Quero Começar Agora",
  },
  {
    id: "carrossel-educativo",
    name: "Carrossel Educativo",
    description: "Carrossel de alta retenção para Instagram",
    category: "Educational",
    platform: "Instagram",
    icon: Instagram,
    conversionRate: "+203%",
    engagement: "+321%",
    audienceTag: "Educadores & Marcas",
    difficultyLevel: "Médio",
    promptBase:
      "Crie um carrossel educativo com 5 a 7 slides sobre {tema}, para {publico}, tom {tom}. Inclua SLIDE 1 (Hook), 2-5 (Conteúdo) e 6-7 (CTA/Fechamento).",
    requiredFields: [
      {
        id: "tema",
        label: "Tema do Carrossel",
        placeholder: "Ex: 5 erros que destroem suas vendas no BR",
        type: "text",
        required: true,
      },
    ],
    sampleOutput:
      "SLIDE 1: O ERRO que está destruindo suas vendas no Brasil\nSLIDE 2-5: Conteúdo…\nSLIDE 6-7: CTA e fechamento",
  },
  {
    id: "vsl-roteiro",
    name: "Roteiro VSL",
    description: "Video Sales Letter que converte no mercado",
    category: "Educational",
    platform: "YouTube/Vimeo",
    icon: Video,
    conversionRate: "+289%",
    engagement: "+145%",
    audienceTag: "Infoprodutores",
    difficultyLevel: "Avançado",
    promptBase:
      "Crie um roteiro de VSL sobre {tema}, direcionado para {publico}, tom {tom}. Use AIDA brasileira, storytelling nacional, objeções BR, e CTA que converte.",
    requiredFields: [
      {
        id: "tema",
        label: "Produto/método do VSL",
        placeholder: "Ex: método para ganhar R$ 10K/mês online",
        type: "text",
        required: true,
      },
    ],
    sampleOutput: "ABERTURA (0-30s): Se você é brasileiro e quer…",
  },
  {
    id: "whatsapp-vendas",
    name: "WhatsApp Vendas",
    description: "Mensagens de vendas otimizadas para WhatsApp Business",
    category: "E-commerce",
    platform: "WhatsApp Business",
    icon: MessageCircle,
    conversionRate: "+312%",
    engagement: "+234%",
    audienceTag: "Vendedores",
    difficultyLevel: "Fácil",
    promptBase:
      "Crie uma sequência de mensagens WhatsApp para vendas de {tema}, direcionado para {publico}, tom {tom}. Linguagem coloquial BR e abordagem não invasiva.",
    requiredFields: [
      {
        id: "tema",
        label: "Produto/serviço para venda",
        placeholder: "Ex: consultoria em marketing digital",
        type: "text",
        required: true,
      },
    ],
    sampleOutput: "MSG 1: Oi! Tudo bem?…\nMSG 2: …",
  },
  {
    id: "email-marketing-br",
    name: "Email Marketing BR",
    description: "Emails com conversão acima da média no BR",
    category: "Email",
    platform: "Email",
    icon: Megaphone,
    conversionRate: "+120%",
    engagement: "+90%",
    audienceTag: "Marcas",
    difficultyLevel: "Fácil",
    promptBase:
      "Crie um email marketing para {produto} com objetivo {objetivo}, público {publico}, e tom {tom}. Inclua assunto, pré-header e corpo do email.",
    requiredFields: [
      {
        id: "produto",
        label: "Produto/Oferta",
        placeholder: "Ex: Curso de Marketing",
        type: "text",
        required: true,
      },
    ],
    sampleOutput: "Assunto: …\nPré-header: …\nCorpo: …",
  },
];

// Tones - Specific for market
export interface Tone {
  value: string;
  label: string;
  description: string;
  example: string;
  personality: string;
}

export const TONES: Tone[] = [
  {
    value: "persuasivo",
    label: "Persuasivo",
    description: "Direto, urgente, focado em ação",
    personality: "Convincente, assertivo, usa urgência real",
    example:
      '"PARE de perder dinheiro! Método testado por +500 clientes em 2024."',
  },
  {
    value: "educativo-autoridade",
    label: "Educativo com Autoridade",
    description: "Ensina enquanto constrói credibilidade",
    personality: "Expert, confiável, compartilha conhecimento",
    example: '"Após 10 anos analisando o mercado, descobri que..."',
  },
  {
    value: "descontraido-proximo",
    label: "Descontraído com Proximidade",
    description: "Casual, próximo, usa expressões do dia a dia",
    personality: "Amigável, acessível, conversa de igual para igual",
    example: '"Oi, pessoal! Vou contar um perrengue que virou aprendizado..."',
  },
  {
    value: "corporativo-profissional",
    label: "Corporativo Profissional",
    description: "Formal, acessível e ideal para B2B",
    personality: "Sério, confiável, linguagem empresarial",
    example: '"Empresas que implementam essa estratégia..."',
  },
  {
    value: "storytelling-emocional",
    label: "Storytelling Emocional",
    description: "Histórias que emocionam e vendem",
    personality: "Envolvente, humano, usa narrativas reais",
    example: '"Era 2019, desempregado, morando com minha mãe em Santos..."',
  },
  {
    value: "humor",
    label: "Humor",
    description: "Divertido, leve, cria conexão com humor",
    personality: "Engraçado, leve, referências da cultura pop",
    example:
      '"Fazer marketing sem estratégia é como torcer na Copa... muita expectativa, pouco resultado 😅"',
  },
];

// Quick Config Options - Clickable chips for rapid setup
export interface QuickConfigOption {
  id: string;
  label: string;
  category: "produto" | "publico" | "objetivo" | "canal";
}

export const QUICK_CONFIG_OPTIONS: Record<string, QuickConfigOption[]> = {
  produto: [
    { id: "curso-online", label: "Curso Online", category: "produto" },
    { id: "consultoria", label: "Consultoria", category: "produto" },
    { id: "saas", label: "Software/SaaS", category: "produto" },
    { id: "e-commerce", label: "E-commerce", category: "produto" },
    { id: "infoproduto", label: "Infoproduto", category: "produto" },
    { id: "servico-local", label: "Serviço Local", category: "produto" },
    { id: "coaching", label: "Coaching/Mentoria", category: "produto" },
    { id: "agencia", label: "Agência/Freelancer", category: "produto" },
  ],
  publico: [
    {
      id: "empreendedores-25-45",
      label: "Empreendedores 25-45",
      category: "publico",
    },
    {
      id: "maes-trabalhadoras",
      label: "Mães Trabalhadoras",
      category: "publico",
    },
    {
      id: "executivos-senior",
      label: "Executivos Sênior",
      category: "publico",
    },
    {
      id: "freelancers-autonomos",
      label: "Freelancers/Autônomos",
      category: "publico",
    },
    {
      id: "pequenos-empresarios",
      label: "Pequenos Empresários",
      category: "publico",
    },
    {
      id: "gestores-marketing",
      label: "Gestores de Marketing",
      category: "publico",
    },
    {
      id: "jovens-profissionais",
      label: "Jovens Profissionais",
      category: "publico",
    },
    { id: "aposentados-50+", label: "Aposentados/50+", category: "publico" },
  ],
  objetivo: [
    { id: "gerar-leads", label: "Gerar Leads", category: "objetivo" },
    { id: "vender-produto", label: "Vender Produto", category: "objetivo" },
    {
      id: "construir-autoridade",
      label: "Construir Autoridade",
      category: "objetivo",
    },
    { id: "educar-audiencia", label: "Educar Audiência", category: "objetivo" },
    {
      id: "engajar-seguidores",
      label: "Engajar Seguidores",
      category: "objetivo",
    },
    { id: "lancar-produto", label: "Lançar Produto", category: "objetivo" },
    {
      id: "recuperar-carrinho",
      label: "Recuperar Carrinho",
      category: "objetivo",
    },
    {
      id: "fidelizar-clientes",
      label: "Fidelizar Clientes",
      category: "objetivo",
    },
  ],
  canal: [
    { id: "instagram-feed", label: "Instagram Feed", category: "canal" },
    { id: "instagram-stories", label: "Instagram Stories", category: "canal" },
    { id: "linkedin", label: "LinkedIn", category: "canal" },
    { id: "facebook-organico", label: "Facebook Orgânico", category: "canal" },
    { id: "facebook-ads", label: "Facebook Ads", category: "canal" },
    { id: "google-ads", label: "Google Ads", category: "canal" },
    { id: "email-marketing", label: "Email Marketing", category: "canal" },
    { id: "whatsapp-business", label: "WhatsApp Business", category: "canal" },
    { id: "youtube", label: "YouTube", category: "canal" },
    { id: "tiktok", label: "TikTok", category: "canal" },
    { id: "twitter-x", label: "Twitter/X", category: "canal" },
    { id: "site-landing-page", label: "Site/Landing Page", category: "canal" },
  ],
};

// Helpers
export const getTemplateById = (id: string): Template | undefined => {
  return TEMPLATES.find((template) => template.id === id);
};

export const getCategoryColor = (category: Template["category"]): string => {
  const colors = {
    "Social Media":
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300",
    "Paid Ads":
      "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300",
    Professional:
      "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300",
    Email:
      "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300",
    Educational:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300",
    "E-commerce":
      "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300",
  } as const;
  return colors[category] || "bg-muted text-muted-foreground border-border";
};

export const getDifficultyColor = (
  level: "Fácil" | "Médio" | "Avançado"
): string => {
  const colors = {
    Fácil: "bg-success text-success-foreground",
    Médio: "bg-warning text-warning-foreground",
    Avançado: "bg-destructive text-destructive-foreground",
  } as const;
  return colors[level];
};
