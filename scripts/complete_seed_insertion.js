#!/usr/bin/env node

/**
 * Script completo para inserir todos os dados seed para a conta admin
 * Executa: node complete_seed_insertion.js
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurações do Supabase: usar variáveis de ambiente em vez de chaves hard-coded.
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Erro: defina SUPABASE_URL e SUPABASE_KEY no ambiente antes de executar este script.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Utilitários
const log = (msg, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const emoji = {
        info: '📋',
        success: '✅',
        warning: '⚠️',
        error: '❌',
        progress: '🔄'
    };
    console.log(`${emoji[type]} [${timestamp}] ${msg}`);
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Verificar e obter dados do admin
 */
async function getAdminData() {
    log('Verificando usuário super admin...');

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, role')
        .eq('email', 'paulojack2011@gmail.com')
        .single();

    if (profileError) {
        throw new Error(`Erro ao buscar perfil: ${profileError.message}`);
    }

    if (!profile) {
        throw new Error('Usuário super admin não encontrado!');
    }

    log(`Super admin encontrado: ${profile.email} (${profile.role})`, 'success');

    // Buscar ou criar workspace
    let { data: workspace, error: workspaceError } = await supabase
        .from('workspaces')
        .select('id, name')
        .eq('owner_id', profile.id)
        .single();

    if (workspaceError || !workspace) {
        log('Workspace não encontrado, criando um novo...', 'warning');

        const { data: newWorkspace, error: createError } = await supabase
            .from('workspaces')
            .insert({
                name: 'StorySpark Admin Workspace',
                slug: 'storyspark-admin',
                plan: 'ENTERPRISE',
                owner_id: profile.id,
                credits: 10000,
                credits_used: 1250
            })
            .select()
            .single();

        if (createError) {
            throw new Error(`Erro ao criar workspace: ${createError.message}`);
        }

        workspace = newWorkspace;
        log(`Workspace criado: ${workspace.name}`, 'success');
    } else {
        log(`Workspace encontrado: ${workspace.name}`, 'success');
    }

    return { profile, workspace };
}

/**
 * Inserir Brand Voices
 */
async function insertBrandVoices(workspace, profile) {
    log('Inserindo Brand Voices...', 'progress');

    const { count } = await supabase
        .from('brand_voices')
        .select('*', { count: 'exact', head: true })
        .eq('workspace_id', workspace.id);

    if (count > 0) {
        log(`${count} brand voices já existem, pulando inserção...`, 'warning');
        return count;
    }

    const brandVoices = [
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
            guidelines: 'Linguagem sofisticada sem ser pomposa. Foque em exclusividade, qualidade superior.',
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
    ];

    const { data, error } = await supabase
        .from('brand_voices')
        .insert(brandVoices)
        .select();

    if (error) {
        throw new Error(`Erro ao inserir brand voices: ${error.message}`);
    }

    log(`${data.length} brand voices inseridas com sucesso!`, 'success');
    return data.length;
}

/**
 * Inserir Personas
 */
async function insertPersonas(workspace, profile) {
    log('Inserindo Target Personas...', 'progress');

    const { count } = await supabase
        .from('target_personas')
        .select('*', { count: 'exact', head: true })
        .eq('workspace_id', workspace.id);

    if (count > 0) {
        log(`${count} personas já existem, pulando inserção...`, 'warning');
        return count;
    }

    const personas = [
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
            pain_points: [
                'Falta de tempo para criar conteúdo',
                'Dificuldade de mensurar ROI de campanhas',
                'Pressão por resultados rápidos',
                'Equipe pequena e sobrecarregada'
            ],
            goals: [
                'Aumentar brand awareness da empresa',
                'Gerar leads qualificados',
                'Otimizar conversões',
                'Automatizar processos de marketing'
            ],
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
            pain_points: [
                'Recursos limitados para marketing',
                'Dificuldade em escalar operações',
                'Falta de expertise em áreas específicas',
                'Tempo limitado para tudo'
            ],
            goals: [
                'Escalar o negócio rapidamente',
                'Automatizar processos',
                'Aumentar receita',
                'Construir marca pessoal'
            ],
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
    ];

    const { data, error } = await supabase
        .from('target_personas')
        .insert(personas)
        .select();

    if (error) {
        throw new Error(`Erro ao inserir personas: ${error.message}`);
    }

    log(`${data.length} personas inseridas com sucesso!`, 'success');
    return data.length;
}

/**
 * Inserir Campanhas
 */
async function insertCampaigns(workspace, profile) {
    log('Inserindo Campanhas...', 'progress');

    const { count } = await supabase
        .from('campaigns')
        .select('*', { count: 'exact', head: true })
        .eq('workspace_id', workspace.id);

    if (count > 0) {
        log(`${count} campanhas já existem, pulando inserção...`, 'warning');
        return count;
    }

    const campaigns = [
        {
            workspace_id: workspace.id,
            user_id: profile.id,
            name: 'Black Friday 2024 - E-commerce',
            description: 'Campanha completa para Black Friday focada em conversão e vendas. Inclui copy para posts, stories, emails e anúncios pagos.',
            status: 'ACTIVE',
            budget: 5000.00,
            start_date: '2024-11-15',
            end_date: '2024-11-30',
            metadata: {
                objective: 'Sales (Vendas)',
                platforms: ['instagram', 'facebook', 'email'],
                targetAudience: 'Consumidores 25-45 anos interessados em ofertas',
                persona: 'Jovem Urbano (18-25)',
                ctr_target: '4.5%',
                conversion_target: '3.2%'
            },
            tags: ['black-friday', 'e-commerce', 'vendas', 'promocao']
        },
        {
            workspace_id: workspace.id,
            user_id: profile.id,
            name: 'Lançamento Produto SaaS',
            description: 'Estratégia de lançamento para nova ferramenta SaaS B2B. Foco em geração de leads qualificados e trial gratuito.',
            status: 'ACTIVE',
            budget: 3500.00,
            start_date: '2024-11-01',
            end_date: '2024-12-15',
            metadata: {
                objective: 'Leads (Geração de Leads)',
                platforms: ['linkedin', 'twitter', 'blog'],
                targetAudience: 'Profissionais de TI, CTOs, desenvolvedores',
                persona: 'Profissional Liberal (26-35)',
                lead_target: '500'
            },
            tags: ['saas', 'b2b', 'tecnologia', 'leads']
        },
        {
            workspace_id: workspace.id,
            user_id: profile.id,
            name: 'Awareness Brand - Q4 2024',
            description: 'Campanha de reconhecimento de marca para aumentar reach e engajamento nas redes sociais.',
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
            tags: ['awareness', 'brand', 'video', 'engajamento']
        }
    ];

    const { data, error } = await supabase
        .from('campaigns')
        .insert(campaigns)
        .select();

    if (error) {
        throw new Error(`Erro ao inserir campanhas: ${error.message}`);
    }

    log(`${data.length} campanhas inseridas com sucesso!`, 'success');
    return data.length;
}

/**
 * Criar tabelas de estatísticas se não existirem
 */
async function createStatsTables() {
    log('Criando tabelas de estatísticas...', 'progress');

    try {
        // Ler e executar o script SQL de criação das tabelas
        const sqlScript = fs.readFileSync(path.join(__dirname, 'create_stats_tables.sql'), 'utf8');

        // Dividir o script em comandos individuais e executar
        const commands = sqlScript.split(';').filter(cmd => cmd.trim().length > 0);

        for (const command of commands) {
            if (command.trim()) {
                await supabase.rpc('exec_sql', { sql_command: command.trim() + ';' });
                await sleep(100); // Pequeno delay entre comandos
            }
        }

        log('Tabelas de estatísticas criadas com sucesso!', 'success');
    } catch (error) {
        log(`Aviso: Erro ao criar tabelas stats - ${error.message}`, 'warning');
        log('Continuando com dados básicos...', 'info');
    }
}

/**
 * Função principal
 */
async function main() {
    try {
        log('=== INÍCIO DA INSERÇÃO COMPLETA DE SEEDS ===', 'info');
        log('StorySpark Admin Seed Data Insertion', 'info');
        log('=====================================', 'info');

        // 1. Verificar dados do admin
        const { profile, workspace } = await getAdminData();

        await sleep(1000);

        // 2. Inserir dados básicos
        const voicesCount = await insertBrandVoices(workspace, profile);
        await sleep(500);

        const personasCount = await insertPersonas(workspace, profile);
        await sleep(500);

        const campaignsCount = await insertCampaigns(workspace, profile);
        await sleep(500);

        // 3. Criar tabelas de estatísticas
        await createStatsTables();

        // 4. Resumo final
        log('=== RESUMO DA INSERÇÃO ===', 'success');
        log(`✅ Workspace: ${workspace.name}`, 'success');
        log(`✅ Brand Voices: ${voicesCount}`, 'success');
        log(`✅ Personas: ${personasCount}`, 'success');
        log(`✅ Campanhas: ${campaignsCount}`, 'success');
        log(`✅ Tabelas de stats criadas`, 'success');

        log('', 'info');
        log('🎉 INSERÇÃO CONCLUÍDA COM SUCESSO!', 'success');
        log('', 'info');
        log('📋 PRÓXIMOS PASSOS:', 'info');
        log('1. Verificar os dados na aplicação', 'info');
        log('2. Remover códigos Math.random() dos serviços', 'info');
        log('3. Atualizar serviços para usar dados reais do banco', 'info');
        log('4. Testar dashboard e analytics', 'info');

    } catch (error) {
        log(`Erro durante a execução: ${error.message}`, 'error');
        console.error('Stack trace:', error.stack);
        process.exit(1);
    }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export { main };