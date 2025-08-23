import { createClient } from '@supabase/supabase-js';

// Credenciais do projeto
const supabaseUrl = "https://qgtgvqfikqfjbeixzbyb.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFndGd2cWZpa3FmamJlaXh6YnliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NzE2MTcsImV4cCI6MjA3MDI0NzYxN30.iNAOOITHhXMfAY2kJnQ_Dtrd44UZ7bhlufekerTdtw4";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function insertSeeds() {
  try {
    console.log('🔍 Verificando usuário super admin...');
    
    // Buscar o usuário super admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, role')
      .eq('email', 'paulojack2011@gmail.com')
      .single();
    
    if (profileError) {
      console.error('❌ Erro ao buscar perfil:', profileError);
      return;
    }
    
    if (!profile) {
      console.error('❌ Usuário super admin não encontrado!');
      return;
    }
    
    console.log('✅ Super admin encontrado:', profile);
    
    // Buscar workspace do usuário
    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .select('id, name')
      .eq('owner_id', profile.id)
      .single();
    
    if (workspaceError) {
      console.error('❌ Erro ao buscar workspace:', workspaceError);
      return;
    }
    
    if (!workspace) {
      console.log('⚠️ Workspace não encontrado, criando um novo...');
      
      const { data: newWorkspace, error: createError } = await supabase
        .from('workspaces')
        .insert({
          name: 'StorySpark Admin Workspace',
          slug: 'storyspark-admin',
          plan: 'ENTERPRISE',
          owner_id: profile.id
        })
        .select()
        .single();
      
      if (createError) {
        console.error('❌ Erro ao criar workspace:', createError);
        return;
      }
      
      workspace = newWorkspace;
      console.log('✅ Workspace criado:', workspace);
    } else {
      console.log('✅ Workspace encontrado:', workspace);
    }
    
    // Verificar dados existentes
    const { data: existingVoices } = await supabase
      .from('brand_voices')
      .select('id')
      .eq('workspace_id', workspace.id);
    
    const { data: existingPersonas } = await supabase
      .from('target_personas')
      .select('id')
      .eq('workspace_id', workspace.id);
    
    const { data: existingCampaigns } = await supabase
      .from('campaigns')
      .select('id')
      .eq('workspace_id', workspace.id);
    
    console.log('📊 Dados existentes:');
    console.log(`  - Brand Voices: ${existingVoices?.length || 0}`);
    console.log(`  - Personas: ${existingPersonas?.length || 0}`);
    console.log(`  - Campanhas: ${existingCampaigns?.length || 0}`);
    
    // Inserir Brand Voices se não existem
    if (!existingVoices?.length) {
      console.log('📝 Inserindo Brand Voices...');
      
      const { error: voicesError } = await supabase
        .from('brand_voices')
        .insert([
          {
            workspace_id: workspace.id,
            user_id: profile.id,
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
            user_id: profile.id,
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
            user_id: profile.id,
            name: 'Corporativo Premium',
            description: 'Tom elegante e sofisticado para segmento premium e executivos C-level',
            tone: 'Formal',
            style: 'Persuasivo',
            examples: [
              'Exclusividade redefinida: experiência premium para líderes visionários.',
              'Quando a excelência é o padrão, cada detalhe importa fundamentalmente.',
              'Acesso restrito a uma elite de inovadores e transformadores de mercado.'
            ],
            guidelines: 'Linguagem sofisticada sem ser pomposa. Foque em exclusividade, qualidade superior, status.',
            usage_count: 89,
            is_active: true
          },
          {
            workspace_id: workspace.id,
            user_id: profile.id,
            name: 'Startup Disruptiva',
            description: 'Tom ousado e revolucionário para startups e empreendedores',
            tone: 'Energético',
            style: 'Provocativo',
            examples: [
              'Quebrar paradigmas não é hobby, é nossa missão diária. 🚀',
              'Enquanto outros seguem regras antigas, nós criamos o futuro.',
              'Disrupção real acontece quando você para de pedir permissão para inovar.'
            ],
            guidelines: 'Tom provocativo e inspirador. Use linguagem de mudança e revolução.',
            usage_count: 127,
            is_active: true
          },
          {
            workspace_id: workspace.id,
            user_id: profile.id,
            name: 'E-commerce Persuasivo',
            description: 'Tom focado em vendas e conversão para e-commerce',
            tone: 'Persuasivo',
            style: 'Urgente',
            examples: [
              '🔥 ÚLTIMAS UNIDADES! Não perca essa oportunidade única.',
              'Garantia de 30 dias ou seu dinheiro de volta. Risco zero para você!',
              'Mais de 10.000 clientes satisfeitos já transformaram suas vidas.'
            ],
            guidelines: 'Crie senso de urgência e escassez. Use prova social, garantias e benefícios claros.',
            usage_count: 312,
            is_active: true
          }
        ]);
      
      if (voicesError) {
        console.error('❌ Erro ao inserir brand voices:', voicesError);
      } else {
        console.log('✅ Brand voices inseridas com sucesso!');
      }
    } else {
      console.log('⏭️ Brand voices já existem, pulando...');
    }
    
    // Inserir Personas se não existem
    if (!existingPersonas?.length) {
      console.log('📝 Inserindo Personas...');
      
      const { error: personasError } = await supabase
        .from('target_personas')
        .insert([
          {
            workspace_id: workspace.id,
            user_id: profile.id,
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
            pain_points: ['Falta de tempo para criar conteúdo', 'Dificuldade de mensurar ROI de campanhas', 'Pressão por resultados rápidos'],
            goals: ['Aumentar brand awareness da empresa', 'Gerar leads qualificados', 'Otimizar conversões'],
            preferred_channels: ['LinkedIn', 'Email profissional', 'Webinars', 'Eventos de networking'],
            content_preferences: {
              content_types: ['Case studies', 'Dados e estatísticas', 'Tutoriais práticos', 'Webinars'],
              tone_preference: 'Profissional mas acessível',
              format_preference: ['Vídeos curtos', 'Infográficos', 'Posts LinkedIn', 'E-books']
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
            user_id: profile.id,
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
            pain_points: ['Recursos limitados para marketing', 'Dificuldade em escalar operações', 'Falta de expertise em áreas específicas'],
            goals: ['Escalar o negócio rapidamente', 'Automatizar processos', 'Aumentar receita', 'Construir marca pessoal'],
            preferred_channels: ['Instagram', 'YouTube', 'Podcasts', 'Telegram', 'WhatsApp'],
            content_preferences: {
              content_types: ['Stories inspiracionais', 'Dicas práticas', 'Behind the scenes', 'Tutoriais'],
              tone_preference: 'Casual e motivacional',
              format_preference: ['Vídeos', 'Stories', 'Posts inspiracionais', 'Reels']
            },
            buying_behavior: {
              decision_process: 'Rápida e intuitiva',
              budget_influence: 'Total - bootstrapped',
              research_behavior: 'Pesquisa rápida, confia em indicações',
              price_sensitivity: 'Alta - busca custo-benefício'
            },
            notes: 'Persona dinâmica que responde a conteúdo inspiracional e prático.'
          }
        ]);
      
      if (personasError) {
        console.error('❌ Erro ao inserir personas:', personasError);
      } else {
        console.log('✅ Personas inseridas com sucesso!');
      }
    } else {
      console.log('⏭️ Personas já existem, pulando...');
    }
    
    // Inserir Campanhas se não existem
    if (!existingCampaigns?.length) {
      console.log('📝 Inserindo Campanhas...');
      
      const { error: campaignsError } = await supabase
        .from('campaigns')
        .insert([
          {
            workspace_id: workspace.id,
            user_id: profile.id,
            name: 'Black Friday 2024 - E-commerce',
            description: 'Campanha completa para Black Friday focada em conversão e vendas.',
            status: 'ACTIVE',
            budget: 5000.00,
            start_date: '2024-11-15',
            end_date: '2024-11-30',
            metadata: {
              objective: 'Sales',
              platforms: ['instagram', 'facebook', 'email'],
              targetAudience: 'Consumidores 25-45 anos',
              ctr_target: '4.5%'
            },
            tags: ['black-friday', 'e-commerce', 'vendas']
          },
          {
            workspace_id: workspace.id,
            user_id: profile.id,
            name: 'Lançamento Produto SaaS',
            description: 'Estratégia de lançamento para nova ferramenta SaaS B2B.',
            status: 'ACTIVE',
            budget: 3500.00,
            start_date: '2024-11-01',
            end_date: '2024-12-15',
            metadata: {
              objective: 'Leads',
              platforms: ['linkedin', 'twitter', 'blog'],
              targetAudience: 'Profissionais de TI, CTOs',
              lead_target: '500'
            },
            tags: ['saas', 'b2b', 'tecnologia']
          },
          {
            workspace_id: workspace.id,
            user_id: profile.id,
            name: 'Awareness Brand - Q4 2024',
            description: 'Campanha de reconhecimento de marca para aumentar reach.',
            status: 'PAUSED',
            budget: 8000.00,
            start_date: '2024-10-01',
            end_date: '2024-12-31',
            metadata: {
              objective: 'Awareness',
              platforms: ['youtube', 'instagram', 'tiktok'],
              targetAudience: 'Público geral 18-35 anos',
              reach_target: '100000'
            },
            tags: ['awareness', 'brand', 'video']
          }
        ]);
      
      if (campaignsError) {
        console.error('❌ Erro ao inserir campanhas:', campaignsError);
      } else {
        console.log('✅ Campanhas inseridas com sucesso!');
      }
    } else {
      console.log('⏭️ Campanhas já existem, pulando...');
    }
    
    console.log('🎉 Inserção de seeds concluída com sucesso!');
    
  } catch (error) {
    console.error('💥 Erro geral:', error);
  }
}

// Executar o script
insertSeeds();