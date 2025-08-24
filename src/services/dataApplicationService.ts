import { supabase } from "@/lib/supabase";
import { brandVoicesService } from "./brandVoicesService";
import { personasService } from "./personasService";
import { campaignsService } from "./campaignsService";
import type { ExtractedData } from "./documentProcessingService";

interface ApplicationResult {
  success: boolean;
  created: {
    brandVoices: number;
    personas: number;
    campaigns: number;
  };
  errors: string[];
}

class DataApplicationService {
  /**
   * Aplica os dados extraídos nas páginas da plataforma
   */
  async applyExtractedData(
    userId: string,
    workspaceId: string,
    data: ExtractedData
  ): Promise<ApplicationResult> {
    const result: ApplicationResult = {
      success: true,
      created: {
        brandVoices: 0,
        personas: 0,
        campaigns: 0
      },
      errors: []
    };

    try {
      // 1. Aplicar Brand Voice
      if (data.brandVoice) {
        try {
          await brandVoicesService.createBrandVoice({
            name: data.brandVoice.name,
            description: data.brandVoice.description,
            tone: data.brandVoice.tone,
            style: data.brandVoice.characteristics.join(', '),
            examples: data.brandVoice.examples,
            guidelines: `Público-alvo: ${data.brandVoice.targetAudience}`,
            user_id: userId,
            workspace_id: workspaceId
          });
          result.created.brandVoices++;
        } catch (error) {
          result.errors.push(`Erro ao criar brand voice: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        }
      }

      // 2. Aplicar Personas
      if (data.personas && data.personas.length > 0) {
        for (const persona of data.personas) {
          try {
            await personasService.createPersona({
              name: persona.name,
              age_range: `${persona.age - 5}-${persona.age + 5}`,
              occupation: persona.profession,
              location: "Não especificado",
              interests: persona.interests,
              goals: persona.goals,
              pain_points: persona.painPoints,
              preferred_channels: data.marketingData?.channels || [],
              user_id: userId,
              workspace_id: workspaceId
            });
            result.created.personas++;
          } catch (error) {
            result.errors.push(`Erro ao criar persona ${persona.name}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
          }
        }
      }

      // 3. Aplicar Campanhas baseadas nos dados de marketing
      if (data.marketingData?.campaigns && data.marketingData.campaigns.length > 0) {
        for (const campaignName of data.marketingData.campaigns) {
          try {
            await campaignsService.createCampaign({
              name: campaignName,
              description: `Campanha criada automaticamente a partir de análise de documento`,
              status: "DRAFT",
              budget: 0,
              start_date: new Date().toISOString(),
              end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias
              tags: data.marketingData?.channels || [],
              metadata: {
                source: "document_analysis",
                target_audience: data.marketingData?.targetAudience || [],
                goals: data.marketingData?.goals || []
              },
              user_id: userId,
              workspace_id: workspaceId
            });
            result.created.campaigns++;
          } catch (error) {
            result.errors.push(`Erro ao criar campanha ${campaignName}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
          }
        }
      }

      // 4. Se não houver campanhas específicas, criar uma campanha padrão
      if (result.created.campaigns === 0 && data.companyInfo) {
        try {
          await campaignsService.createCampaign({
            name: `Campanha ${data.companyInfo.name}`,
            description: `Campanha principal para ${data.companyInfo.name}`,
            status: "DRAFT",
            budget: 0,
            start_date: new Date().toISOString(),
            end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            tags: data.marketingData?.channels || ["Digital"],
            metadata: {
              source: "document_analysis",
              company: data.companyInfo.name,
              industry: data.companyInfo.industry,
              target_audience: data.marketingData?.targetAudience || [],
              goals: data.marketingData?.goals || []
            },
            user_id: userId,
            workspace_id: workspaceId
          });
          result.created.campaigns++;
        } catch (error) {
          result.errors.push(`Erro ao criar campanha padrão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        }
      }

      // 5. Atualizar informações da empresa no perfil do usuário (se aplicável)
      if (data.companyInfo) {
        try {
          await this.updateUserCompanyInfo(userId, data.companyInfo);
        } catch (error) {
          result.errors.push(`Erro ao atualizar informações da empresa: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        }
      }

    } catch (error) {
      result.success = false;
      result.errors.push(`Erro geral na aplicação: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }

    return result;
  }

  /**
   * Atualiza informações da empresa no perfil do usuário
   */
  private async updateUserCompanyInfo(userId: string, companyInfo: ExtractedData['companyInfo']) {
    if (!companyInfo) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        company_name: companyInfo.name,
        company_industry: companyInfo.industry,
        company_description: companyInfo.description,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) {
      console.error('Erro ao atualizar informações da empresa:', error);
      throw error;
    }
  }

  /**
   * Obtém estatísticas de aplicação de dados
   */
  async getApplicationStats(userId: string): Promise<{
    totalBrandVoices: number;
    totalPersonas: number;
    totalCampaigns: number;
    lastApplication: string | null;
  }> {
    try {
      // Contar brand voices
      const { count: brandVoicesCount } = await supabase
        .from('brand_voices')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Contar personas
      const { count: personasCount } = await supabase
        .from('target_personas')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Contar campanhas
      const { count: campaignsCount } = await supabase
        .from('campaigns')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Última aplicação
      const { data: lastJob } = await supabase
        .from('ai_processing_jobs')
        .select('created_at')
        .eq('user_id', userId)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      return {
        totalBrandVoices: brandVoicesCount || 0,
        totalPersonas: personasCount || 0,
        totalCampaigns: campaignsCount || 0,
        lastApplication: lastJob?.created_at || null
      };
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      return {
        totalBrandVoices: 0,
        totalPersonas: 0,
        totalCampaigns: 0,
        lastApplication: null
      };
    }
  }

  /**
   * Valida se os dados podem ser aplicados
   */
  validateDataForApplication(data: ExtractedData): {
    isValid: boolean;
    warnings: string[];
    suggestions: string[];
  } {
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Validar brand voice
    if (!data.brandVoice) {
      warnings.push("Nenhuma brand voice foi identificada no documento");
      suggestions.push("Considere adicionar informações sobre a voz da marca no documento");
    } else if (!data.brandVoice.name || !data.brandVoice.description) {
      warnings.push("Brand voice identificada mas informações incompletas");
    }

    // Validar personas
    if (!data.personas || data.personas.length === 0) {
      warnings.push("Nenhuma persona foi identificada no documento");
      suggestions.push("Considere adicionar informações sobre personas no documento");
    } else if (data.personas.length < 2) {
      suggestions.push("Considere adicionar mais personas para melhor segmentação");
    }

    // Validar informações da empresa
    if (!data.companyInfo) {
      warnings.push("Informações da empresa não foram identificadas");
      suggestions.push("Considere adicionar informações sobre a empresa no documento");
    }

    // Validar dados de marketing
    if (!data.marketingData) {
      warnings.push("Dados de marketing não foram identificados");
      suggestions.push("Considere adicionar informações sobre marketing no documento");
    } else {
      if (!data.marketingData.channels || data.marketingData.channels.length === 0) {
        suggestions.push("Considere especificar canais de marketing");
      }
      if (!data.marketingData.goals || data.marketingData.goals.length === 0) {
        suggestions.push("Considere especificar objetivos de marketing");
      }
    }

    return {
      isValid: warnings.length === 0,
      warnings,
      suggestions
    };
  }
}

export const dataApplicationService = new DataApplicationService();