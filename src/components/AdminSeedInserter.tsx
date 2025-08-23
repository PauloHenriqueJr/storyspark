import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../components/auth/AuthProvider';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface SeedStatus {
  brandVoices: 'pending' | 'loading' | 'success' | 'error';
  personas: 'pending' | 'loading' | 'success' | 'error';
  campaigns: 'pending' | 'loading' | 'success' | 'error';
  templates: 'pending' | 'loading' | 'success' | 'error';
}

interface SeedResult {
  success: boolean;
  message: string;
  count?: number;
}

export default function AdminSeedInserter() {
  const { user } = useAuth();
  const [status, setStatus] = useState<SeedStatus>({
    brandVoices: 'pending',
    personas: 'pending', 
    campaigns: 'pending',
    templates: 'pending'
  });
  const [results, setResults] = useState<Record<string, SeedResult>>({});

  // Verificar se é o super admin
  if (!user || user.email !== 'paulojack2011@gmail.com') {
    return null;
  }

  const updateStatus = (key: keyof SeedStatus, value: SeedStatus[keyof SeedStatus]) => {
    setStatus(prev => ({ ...prev, [key]: value }));
  };

  const insertBrandVoices = async (): Promise<SeedResult> => {
    try {
      const { data: workspace } = await supabase
        .from('workspaces')
        .select('id')
        .eq('owner_id', user.id)
        .single();

      if (!workspace) {
        return { success: false, message: 'Workspace não encontrado' };
      }

      const brandVoices = [
        {
          workspace_id: workspace.id,
          user_id: user.id,
          name: 'Tech Inovadora',
          description: 'Tom técnico e inovador para produtos de tecnologia e startups',
          tone: 'Profissional',
          style: 'Direto',
          examples: [
            'Revolucione sua arquitetura com nossa solução cloud-native de última geração.',
            'Performance que escala: 99.9% de uptime garantido com monitoramento 24/7.',
            'API REST intuitiva, documentação completa, suporte técnico especializado.'
          ],
          guidelines: 'Use linguagem técnica mas acessível. Foque em benefícios práticos e resultados mensuráveis.',
          usage_count: 156,
          is_active: true
        },
        {
          workspace_id: workspace.id,
          user_id: user.id,
          name: 'Casual Amigável',
          description: 'Tom descontraído e próximo para redes sociais e público jovem',
          tone: 'Casual',
          style: 'Conversacional',
          examples: [
            'Oi! Como foi seu dia? Aqui temos uma novidade incrível pra você! 😊',
            'Sabe aquela sensação de "finalmente encontrei!"? É isso que você vai sentir.',
            'Conta pra gente nos comentários: qual sua experiência favorita?'
          ],
          guidelines: 'Use emojis com moderação. Linguagem coloquial mas respeitosa. Faça perguntas para engajar.',
          usage_count: 203,
          is_active: true
        },
        {
          workspace_id: workspace.id,
          user_id: user.id,
          name: 'Corporativo Premium',
          description: 'Tom elegante e sofisticado para segmento premium e executivos C-level',
          tone: 'Formal',
          style: 'Persuasivo',
          examples: [
            'Exclusividade redefinida: experiência premium para líderes visionários.',
            'Quando a excelência é o padrão, cada detalhe importa fundamentalmente.',
            'Acesso restrito a uma elite de inovadores e transformadores de mercado.'
          ],
          guidelines: 'Linguagem sofisticada sem ser pomposa. Foque em exclusividade, qualidade superior.',
          usage_count: 89,
          is_active: true
        }
      ];

      const { data, error } = await supabase
        .from('brand_voices')
        .insert(brandVoices)
        .select();

      if (error) throw error;

      return { 
        success: true, 
        message: `${data.length} Brand Voices inseridas com sucesso!`,
        count: data.length 
      };
    } catch (error: any) {
      return { 
        success: false, 
        message: `Erro ao inserir Brand Voices: ${error.message}` 
      };
    }
  };

  const insertPersonas = async (): Promise<SeedResult> => {
    try {
      const { data: workspace } = await supabase
        .from('workspaces')
        .select('id')
        .eq('owner_id', user.id)
        .single();

      if (!workspace) {
        return { success: false, message: 'Workspace não encontrado' };
      }

      const personas = [
        {
          workspace_id: workspace.id,
          user_id: user.id,
          name: 'Ana Silva - CMO Tech',
          description: 'Chief Marketing Officer de empresa de tecnologia, responsável por estratégia digital e growth.',
          demographics: {
            age_range: '35-45',
            gender: 'Feminino',
            location: 'São Paulo, SP',
            income: 'R$ 15.000 - R$ 25.000',
            education: 'Superior completo - MBA',
            occupation: 'Chief Marketing Officer'
          },
          psychographics: {
            personality: ['Analítica', 'Estratégica', 'Orientada a resultados'],
            values: ['Inovação', 'Eficiência', 'ROI'],
            lifestyle: 'Vida corrida, networking constante, sempre conectada',
            interests: ['Marketing digital', 'Tecnologia', 'Liderança', 'Dados']
          },
          pain_points: [
            'Falta de tempo para criar conteúdo',
            'Dificuldade de mensurar ROI de campanhas', 
            'Pressão por resultados rápidos'
          ],
          goals: [
            'Aumentar brand awareness da empresa',
            'Gerar leads qualificados',
            'Otimizar conversões'
          ],
          preferred_channels: ['LinkedIn', 'Email profissional', 'Webinars'],
          content_preferences: {
            content_types: ['Case studies', 'Dados e estatísticas', 'Tutoriais práticos'],
            tone_preference: 'Profissional mas acessível',
            format_preference: ['Vídeos curtos', 'Infográficos', 'Posts LinkedIn']
          },
          buying_behavior: {
            decision_process: 'Analítica e baseada em dados',
            budget_influence: 'Alta - decide investimentos em marketing',
            research_behavior: 'Pesquisa extensiva antes de comprar',
            price_sensitivity: 'Média - foca em ROI'
          },
          notes: 'Persona altamente estratégica. Responde bem a dados concretos e cases de sucesso.'
        },
        {
          workspace_id: workspace.id,
          user_id: user.id,
          name: 'João Santos - Empreendedor Digital',
          description: 'Empreendedor jovem com negócio online, focado em crescimento e automação.',
          demographics: {
            age_range: '28-35',
            gender: 'Masculino',
            location: 'Rio de Janeiro, RJ',
            income: 'R$ 8.000 - R$ 15.000',
            education: 'Superior - Administração',
            occupation: 'Empreendedor / CEO Startup'
          },
          psychographics: {
            personality: ['Inovador', 'Ousado', 'Multitarefa'],
            values: ['Crescimento', 'Liberdade', 'Impacto'],
            lifestyle: 'Dinâmico, trabalha de casa, viaja frequentemente',
            interests: ['Startups', 'Tecnologia', 'Investimentos', 'Produtividade']
          },
          pain_points: [
            'Recursos limitados para marketing',
            'Dificuldade em escalar operações',
            'Tempo limitado para tudo'
          ],
          goals: [
            'Escalar o negócio rapidamente',
            'Automatizar processos',
            'Construir marca pessoal'
          ],
          preferred_channels: ['Instagram', 'YouTube', 'Podcasts'],
          content_preferences: {
            content_types: ['Stories inspiracionais', 'Dicas práticas', 'Behind the scenes'],
            tone_preference: 'Casual e motivacional',
            format_preference: ['Vídeos', 'Stories', 'Posts inspiracionais']
          },
          buying_behavior: {
            decision_process: 'Rápida e intuitiva',
            budget_influence: 'Total - bootstrapped',
            research_behavior: 'Pesquisa rápida, confia em indicações',
            price_sensitivity: 'Alta - busca custo-benefício'
          },
          notes: 'Persona dinâmica que responde a conteúdo inspiracional e prático.'
        }
      ];

      const { data, error } = await supabase
        .from('target_personas')
        .insert(personas)
        .select();

      if (error) throw error;

      return { 
        success: true, 
        message: `${data.length} Personas inseridas com sucesso!`,
        count: data.length 
      };
    } catch (error: any) {
      return { 
        success: false, 
        message: `Erro ao inserir Personas: ${error.message}` 
      };
    }
  };

  const handleInsertSeeds = async () => {
    // Inserir Brand Voices
    updateStatus('brandVoices', 'loading');
    const brandVoicesResult = await insertBrandVoices();
    setResults(prev => ({ ...prev, brandVoices: brandVoicesResult }));
    updateStatus('brandVoices', brandVoicesResult.success ? 'success' : 'error');

    // Inserir Personas
    updateStatus('personas', 'loading');
    const personasResult = await insertPersonas();
    setResults(prev => ({ ...prev, personas: personasResult }));
    updateStatus('personas', personasResult.success ? 'success' : 'error');
  };

  const getStatusColor = (status: SeedStatus[keyof SeedStatus]) => {
    switch (status) {
      case 'pending': return 'gray';
      case 'loading': return 'blue';
      case 'success': return 'green';
      case 'error': return 'red';
      default: return 'gray';
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Admin - Inserir Dados de Demonstração
        </h2>
        <p className="text-gray-600">
          Área restrita para inserir dados de seed na conta super admin
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <span className="font-medium">Brand Voices</span>
          <div className={`px-3 py-1 rounded text-sm text-${getStatusColor(status.brandVoices)}-600 bg-${getStatusColor(status.brandVoices)}-100`}>
            {status.brandVoices === 'loading' && 'Inserindo...'}
            {status.brandVoices === 'success' && '✓ Concluído'}
            {status.brandVoices === 'error' && '✗ Erro'}
            {status.brandVoices === 'pending' && 'Pendente'}
          </div>
        </div>

        <div className="flex items-center justify-between p-3 border rounded-lg">
          <span className="font-medium">Personas</span>
          <div className={`px-3 py-1 rounded text-sm text-${getStatusColor(status.personas)}-600 bg-${getStatusColor(status.personas)}-100`}>
            {status.personas === 'loading' && 'Inserindo...'}
            {status.personas === 'success' && '✓ Concluído'}
            {status.personas === 'error' && '✗ Erro'}
            {status.personas === 'pending' && 'Pendente'}
          </div>
        </div>
      </div>

      <Button
        onClick={handleInsertSeeds}
        disabled={status.brandVoices === 'loading' || status.personas === 'loading'}
        className="w-full mb-4"
      >
        {(status.brandVoices === 'loading' || status.personas === 'loading') 
          ? 'Inserindo dados...' 
          : 'Inserir Dados de Demonstração'
        }
      </Button>

      {Object.keys(results).length > 0 && (
        <div className="mt-6 space-y-2">
          <h3 className="font-semibold text-gray-900">Resultados:</h3>
          {Object.entries(results).map(([key, result]) => (
            <div 
              key={key} 
              className={`p-3 rounded text-sm ${
                result.success 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              <strong>{key}:</strong> {result.message}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}