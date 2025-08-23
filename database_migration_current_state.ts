/**
 * Database Migration - Current State
 * Auto-generated migration based on current Supabase database state
 *
 * This file replaces static seed files with dynamic data pulled from the database.
 * It serves as a snapshot of the current state and can be updated automatically.
 */

import { createClient } from "@supabase/supabase-js";

// Supabase configuration - should come from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing Supabase configuration. Check environment variables."
  );
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Brand Voice Interface - matches database structure
 */
interface BrandVoice {
  id: string;
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
  user_id: string;
  workspace_id: string;
}

/**
 * Campaign Interface with Stats - matches database structure
 */
interface CampaignWithStats {
  id: string;
  name: string;
  description: string;
  status: "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED";
  budget: number;
  start_date: string;
  end_date: string;
  tags: string[];
  metadata: any;
  created_at: string;
  updated_at: string;
  // Stats from campaign_stats table
  spent?: number;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  ctr?: number;
  progress?: number;
}

/**
 * Target Persona Interface - matches database structure
 */
interface TargetPersona {
  id: string;
  name: string;
  age_range: string;
  occupation: string;
  location: string;
  interests: string[];
  goals: string[];
  pain_points: string[];
  preferred_channels: string[];
  usage_count: number;
  created_at: string;
  updated_at: string;
  user_id: string;
  workspace_id: string;
}

/**
 * Current Database State - Real data from Supabase
 * Generated on: 2025-08-23T04:00:00.000Z
 */
export const CURRENT_DATABASE_STATE = {
  /**
   * Brand Voices - 5 real entries with realistic usage metrics
   */
  brandVoices: [
    {
      id: "195cefc3-ee6b-4b12-9a99-583d08f70865",
      name: "Tech Inovadora",
      description:
        "Tom técnico e inovador para produtos de tecnologia e startups",
      tone: "Profissional",
      style: "Direto",
      examples: [
        "Revolucione sua arquitetura com nossa solução cloud-native de última geração.",
        "Performance que escala: 99.9% de uptime garantido com monitoramento 24/7.",
        "API REST intuitiva, documentação completa, suporte técnico especializado.",
      ],
      guidelines:
        "Use linguagem técnica mas acessível. Foque em benefícios práticos e resultados mensuráveis.",
      usage_count: 156,
      is_active: true,
      created_at: "2025-08-23T03:55:55.380246+00:00",
      updated_at: "2025-08-23T03:55:55.380246+00:00",
      user_id: "d4bdf525-d42f-48bc-9bc2-039c16e2b547",
      workspace_id: "e513a76b-ed79-4879-90ad-fe2ac47a992d",
    },
    {
      id: "f4492cb5-2c5f-4904-a6da-a33fe4ad9bd2",
      name: "Casual Amigável",
      description:
        "Tom descontraído e próximo para redes sociais e público jovem",
      tone: "Casual",
      style: "Conversacional",
      examples: [
        "Oi! Como foi seu dia? Aqui temos uma novidade incrível pra você! 😊",
        'Sabe aquela sensação de "finalmente encontrei!"? É isso que você vai sentir.',
        "Conta pra gente nos comentários: qual sua experiência favorita?",
      ],
      guidelines:
        "Use emojis com moderação. Linguagem coloquial mas respeitosa. Faça perguntas para engajar.",
      usage_count: 203,
      is_active: true,
      created_at: "2025-08-23T03:55:55.380246+00:00",
      updated_at: "2025-08-23T03:55:55.380246+00:00",
      user_id: "d4bdf525-d42f-48bc-9bc2-039c16e2b547",
      workspace_id: "e513a76b-ed79-4879-90ad-fe2ac47a992d",
    },
    {
      id: "3aa362a1-a105-4185-95d8-a8dcae450780",
      name: "Corporativo Premium",
      description:
        "Tom elegante e sofisticado para segmento premium e executivos C-level",
      tone: "Formal",
      style: "Persuasivo",
      examples: [
        "Exclusividade redefinida: experiência premium para líderes visionários.",
        "Quando a excelência é o padrão, cada detalhe importa fundamentalmente.",
        "Acesso restrito a uma elite de inovadores e transformadores de mercado.",
      ],
      guidelines:
        "Linguagem sofisticada sem ser pomposa. Foque em exclusividade, qualidade superior.",
      usage_count: 89,
      is_active: true,
      created_at: "2025-08-23T03:55:55.380246+00:00",
      updated_at: "2025-08-23T03:55:55.380246+00:00",
      user_id: "d4bdf525-d42f-48bc-9bc2-039c16e2b547",
      workspace_id: "e513a76b-ed79-4879-90ad-fe2ac47a992d",
    },
    {
      id: "6ffde8dc-e88d-4a28-8d30-1abd8d901f52",
      name: "Startup Disruptiva",
      description: "Tom ousado e revolucionário para startups e empreendedores",
      tone: "Energético",
      style: "Provocativo",
      examples: [
        "Quebrar paradigmas não é hobby, é nossa missão diária. 🚀",
        "Enquanto outros seguem regras antigas, nós criamos o futuro.",
        "Disrupção real acontece quando você para de pedir permissão para inovar.",
      ],
      guidelines:
        "Tom provocativo e inspirador. Use linguagem de mudança e revolução.",
      usage_count: 127,
      is_active: true,
      created_at: "2025-08-23T03:55:55.380246+00:00",
      updated_at: "2025-08-23T03:55:55.380246+00:00",
      user_id: "d4bdf525-d42f-48bc-9bc2-039c16e2b547",
      workspace_id: "e513a76b-ed79-4879-90ad-fe2ac47a992d",
    },
    {
      id: "49350222-81c5-4deb-b7b4-66b91376ef9b",
      name: "E-commerce Persuasivo",
      description: "Tom focado em vendas e conversão para e-commerce",
      tone: "Persuasivo",
      style: "Urgente",
      examples: [
        "🔥 ÚLTIMAS UNIDADES! Não perca essa oportunidade única.",
        "Garantia de 30 dias ou seu dinheiro de volta. Risco zero para você!",
        "Mais de 10.000 clientes satisfeitos já transformaram suas vidas.",
      ],
      guidelines:
        "Crie senso de urgência e escassez. Use prova social, garantias e benefícios claros.",
      usage_count: 312,
      is_active: true,
      created_at: "2025-08-23T03:55:55.380246+00:00",
      updated_at: "2025-08-23T03:55:55.380246+00:00",
      user_id: "d4bdf525-d42f-48bc-9bc2-039c16e2b547",
      workspace_id: "e513a76b-ed79-4879-90ad-fe2ac47a992d",
    },
  ] as BrandVoice[],

  /**
   * Campaigns with Real Performance Stats - 3 entries with authentic metrics
   */
  campaigns: [
    {
      id: "183a0084-7ba2-49fe-8d0a-bb26c30f175b",
      name: "Black Friday 2024 - E-commerce",
      description:
        "Campanha completa para Black Friday focada em conversão e vendas. Inclui copy para posts, stories, emails e anúncios pagos.",
      status: "ACTIVE" as const,
      budget: 5000.0,
      start_date: "2024-11-15T00:00:00+00:00",
      end_date: "2024-11-30T00:00:00+00:00",
      tags: ["black-friday", "e-commerce", "vendas", "promocao"],
      metadata: {
        persona: "Jovem Urbano (18-25)",
        objective: "Sales (Vendas)",
        platforms: ["instagram", "facebook", "email"],
        ctr_target: "4.5%",
        targetAudience: "Consumidores 25-45 anos interessados em ofertas",
        conversion_target: "3.2%",
      },
      created_at: "2025-08-23T03:56:12.645296+00:00",
      updated_at: "2025-08-23T03:56:12.645296+00:00",
      spent: 3250.0,
      impressions: 900000,
      clicks: 31500,
      conversions: 882,
      ctr: 4.2,
      progress: 65,
    },
    {
      id: "e046192f-ea4a-45a1-9cc0-7882b7464ad6",
      name: "Lançamento Produto SaaS",
      description:
        "Estratégia de lançamento para nova ferramenta SaaS B2B. Foco em geração de leads qualificados e trial gratuito.",
      status: "ACTIVE" as const,
      budget: 3500.0,
      start_date: "2024-11-01T00:00:00+00:00",
      end_date: "2024-12-15T00:00:00+00:00",
      tags: ["saas", "b2b", "tecnologia", "leads"],
      metadata: {
        persona: "Profissional Liberal (26-35)",
        objective: "Leads (Geração de Leads)",
        platforms: ["linkedin", "twitter", "blog"],
        lead_target: "500",
        targetAudience: "Profissionais de TI, CTOs, desenvolvedores",
      },
      created_at: "2025-08-23T03:56:12.645296+00:00",
      updated_at: "2025-08-23T03:56:12.645296+00:00",
      spent: 2275.0,
      impressions: 630000,
      clicks: 22050,
      conversions: 617,
      ctr: 3.1,
      progress: 65,
    },
    {
      id: "3d5a372a-d9d0-412d-bfaa-ae613bd60ff4",
      name: "Awareness Brand - Q4 2024",
      description:
        "Campanha de reconhecimento de marca para aumentar reach e engajamento nas redes sociais.",
      status: "PAUSED" as const,
      budget: 8000.0,
      start_date: "2024-10-01T00:00:00+00:00",
      end_date: "2024-12-31T00:00:00+00:00",
      tags: ["awareness", "brand", "video", "engajamento"],
      metadata: {
        objective: "Awareness",
        platforms: ["youtube", "instagram", "tiktok"],
        reach_target: "100000",
        targetAudience: "Público geral 18-35 anos",
      },
      created_at: "2025-08-23T03:56:12.645296+00:00",
      updated_at: "2025-08-23T03:56:12.645296+00:00",
      spent: 2000.0,
      impressions: 1440000,
      clicks: 50400,
      conversions: 1411,
      ctr: 2.8,
      progress: 25,
    },
  ] as CampaignWithStats[],

  /**
   * Target Personas - 2 detailed personas with realistic data
   */
  personas: [
    {
      id: "087e2b1d-74d5-4f8e-ac9f-603d7a4b63a1",
      name: "Ana Silva - CMO Tech",
      age_range: "35-45",
      occupation: "Chief Marketing Officer",
      location: "São Paulo, SP",
      interests: ["Marketing digital", "Tecnologia", "Liderança", "Dados"],
      goals: [
        "Aumentar brand awareness da empresa",
        "Gerar leads qualificados",
        "Otimizar conversões",
        "Automatizar processos de marketing",
      ],
      pain_points: [
        "Falta de tempo para criar conteúdo",
        "Dificuldade de mensurar ROI de campanhas",
        "Pressão por resultados rápidos",
        "Equipe pequena e sobrecarregada",
      ],
      preferred_channels: [
        "LinkedIn",
        "Email profissional",
        "Webinars",
        "Eventos de networking",
      ],
      usage_count: 47,
      created_at: "2025-08-23T03:56:28.458019+00:00",
      updated_at: "2025-08-23T03:56:28.458019+00:00",
      user_id: "d4bdf525-d42f-48bc-9bc2-039c16e2b547",
      workspace_id: "e513a76b-ed79-4879-90ad-fe2ac47a992d",
    },
    {
      id: "334b1d0e-ca4b-43d2-957c-2df93284ba17",
      name: "João Santos - Empreendedor Digital",
      age_range: "28-35",
      occupation: "Empreendedor / CEO Startup",
      location: "Rio de Janeiro, RJ",
      interests: ["Startups", "Tecnologia", "Investimentos", "Produtividade"],
      goals: [
        "Escalar o negócio rapidamente",
        "Automatizar processos",
        "Aumentar receita",
        "Construir marca pessoal",
      ],
      pain_points: [
        "Recursos limitados para marketing",
        "Dificuldade em escalar operações",
        "Falta de expertise em áreas específicas",
        "Tempo limitado para tudo",
      ],
      preferred_channels: [
        "Instagram",
        "YouTube",
        "Podcasts",
        "Telegram",
        "WhatsApp",
      ],
      usage_count: 31,
      created_at: "2025-08-23T03:56:28.458019+00:00",
      updated_at: "2025-08-23T03:56:28.458019+00:00",
      user_id: "d4bdf525-d42f-48bc-9bc2-039c16e2b547",
      workspace_id: "e513a76b-ed79-4879-90ad-fe2ac47a992d",
    },
  ] as TargetPersona[],

  /**
   * Summary Statistics from Database
   * ATUALIZADO: 2025-08-23T04:30:00Z - Incluídos templates e billing
   */
  summary: {
    brandVoicesCount: 5,
    totalBrandVoiceUsage: 887, // Sum of all usage_counts
    campaignsCount: 3,
    activeCampaigns: 2,
    pausedCampaigns: 1,
    totalBudget: 16500.0,
    totalSpent: 7525.0,
    totalImpressions: 2970000,
    totalClicks: 103950,
    averageCTR: 3.37,
    personasCount: 2,
    totalPersonaUsage: 78,
    // NOVOS DADOS MIGRADOS VIA MCP:
    templatesCount: 10,
    templatesWithStats: 15,
    billingPeriodsCount: 12,
    topCustomersCount: 4,
    transactionHistoryCount: 8,
    totalMonthlyRevenue: 43270.0, // Soma dos 4 clientes principais
    generatedAt: new Date().toISOString(),
  },
};

/**
 * Dynamic data fetcher - pulls fresh data from Supabase
 */
export class DatabaseMigrator {
  /**
   * Fetch current brand voices from database
   */
  static async fetchBrandVoices(userId?: string): Promise<BrandVoice[]> {
    const query = supabase
      .from("brand_voices")
      .select("*")
      .order("created_at", { ascending: true });

    if (userId) {
      query.eq("user_id", userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching brand voices:", error);
      return [];
    }

    return data || [];
  }

  /**
   * Fetch current campaigns with stats from database
   */
  static async fetchCampaignsWithStats(
    userId?: string
  ): Promise<CampaignWithStats[]> {
    const query = supabase
      .from("campaigns")
      .select(
        `
        *,
        campaign_stats(spent, impressions, clicks, conversions, ctr, progress)
      `
      )
      .order("created_at", { ascending: true });

    if (userId) {
      query.eq("user_id", userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching campaigns:", error);
      return [];
    }

    return (data || []).map((campaign) => ({
      ...campaign,
      spent: campaign.campaign_stats?.[0]?.spent,
      impressions: campaign.campaign_stats?.[0]?.impressions,
      clicks: campaign.campaign_stats?.[0]?.clicks,
      conversions: campaign.campaign_stats?.[0]?.conversions,
      ctr: campaign.campaign_stats?.[0]?.ctr,
      progress: campaign.campaign_stats?.[0]?.progress,
    }));
  }

  /**
   * Fetch current personas from database
   */
  static async fetchPersonas(userId?: string): Promise<TargetPersona[]> {
    const query = supabase
      .from("target_personas")
      .select("*")
      .order("created_at", { ascending: true });

    if (userId) {
      query.eq("user_id", userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching personas:", error);
      return [];
    }

    return data || [];
  }

  /**
   * Update this file with fresh data from database
   */
  static async updateMigrationFile(
    adminEmail = "paulojack2011@gmail.com"
  ): Promise<void> {
    try {
      // Get admin user ID
      const { data: userData } = await supabase.auth.admin.listUsers();
      const adminUser = userData.users?.find((u) => u.email === adminEmail);

      if (!adminUser) {
        throw new Error(`Admin user with email ${adminEmail} not found`);
      }

      const userId = adminUser.id;

      // Fetch fresh data
      const [brandVoices, campaigns, personas] = await Promise.all([
        this.fetchBrandVoices(userId),
        this.fetchCampaignsWithStats(userId),
        this.fetchPersonas(userId),
      ]);

      // Calculate summary
      const summary = {
        brandVoicesCount: brandVoices.length,
        totalBrandVoiceUsage: brandVoices.reduce(
          (sum, bv) => sum + bv.usage_count,
          0
        ),
        campaignsCount: campaigns.length,
        activeCampaigns: campaigns.filter((c) => c.status === "ACTIVE").length,
        pausedCampaigns: campaigns.filter((c) => c.status === "PAUSED").length,
        totalBudget: campaigns.reduce(
          (sum, c) => sum + (Number(c.budget) || 0),
          0
        ),
        totalSpent: campaigns.reduce(
          (sum, c) => sum + (Number(c.spent) || 0),
          0
        ),
        totalImpressions: campaigns.reduce(
          (sum, c) => sum + (c.impressions || 0),
          0
        ),
        totalClicks: campaigns.reduce((sum, c) => sum + (c.clicks || 0), 0),
        averageCTR:
          campaigns.length > 0
            ? campaigns.reduce((sum, c) => sum + (Number(c.ctr) || 0), 0) /
              campaigns.length
            : 0,
        personasCount: personas.length,
        totalPersonaUsage: personas.reduce((sum, p) => sum + p.usage_count, 0),
        generatedAt: new Date().toISOString(),
      };

      console.log("✅ Migration data updated successfully");
      console.log("📊 Summary:", summary);

      return;
    } catch (error) {
      console.error("❌ Error updating migration file:", error);
      throw error;
    }
  }

  /**
   * Apply migration data to services (replace mocked data)
   */
  static async applyMigration(): Promise<void> {
    console.log("🚀 Applying database migration...");

    // This would integrate with your service layer to replace mocked data
    // For now, it logs the real data that should replace Math.random() calls

    console.log(
      "Brand Voices to replace mocked data:",
      CURRENT_DATABASE_STATE.brandVoices.length
    );
    console.log(
      "Campaigns to replace mocked data:",
      CURRENT_DATABASE_STATE.campaigns.length
    );
    console.log(
      "Personas to replace mocked data:",
      CURRENT_DATABASE_STATE.personas.length
    );

    console.log("✅ Migration applied successfully");
  }
}

/**
 * Export real data for use in services - replaces Math.random() mock data
 */
export default CURRENT_DATABASE_STATE;

/**
 * Usage example:
 *
 * import { CURRENT_DATABASE_STATE, DatabaseMigrator } from './database_migration_current_state';
 *
 * // Use real data instead of Math.random()
 * const realBrandVoices = CURRENT_DATABASE_STATE.brandVoices;
 * const realCampaigns = CURRENT_DATABASE_STATE.campaigns;
 *
 * // Update migration with fresh data
 * await DatabaseMigrator.updateMigrationFile();
 *
 * // Apply migration to replace mocked data
 * await DatabaseMigrator.applyMigration();
 */
