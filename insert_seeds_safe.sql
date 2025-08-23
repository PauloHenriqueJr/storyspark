-- Script para inserir dados de seed de forma segura
-- Preserva dados existentes e insere apenas o que não existe

DO $$
DECLARE
    admin_workspace_id uuid;
    admin_user_id uuid;
    workspace_count integer;
    voice_count integer;
    persona_count integer;
    campaign_count integer;
BEGIN
    -- Buscar o workspace do super admin
    SELECT p.id, w.id INTO admin_user_id, admin_workspace_id 
    FROM profiles p 
    LEFT JOIN workspaces w ON p.id = w.owner_id 
    WHERE p.email = 'paulojack2011@gmail.com';
    
    -- Verificar se encontrou o usuário
    IF admin_user_id IS NULL THEN
        RAISE NOTICE 'Super admin não encontrado!';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Super admin encontrado: %', admin_user_id;
    
    -- Se não tem workspace, criar um
    IF admin_workspace_id IS NULL THEN
        INSERT INTO workspaces (id, name, slug, plan, owner_id)
        VALUES (
            gen_random_uuid(),
            'StorySpark Admin Workspace',
            'storyspark-admin',
            'ENTERPRISE',
            admin_user_id
        )
        RETURNING id INTO admin_workspace_id;
        
        RAISE NOTICE 'Workspace criado: %', admin_workspace_id;
    ELSE
        RAISE NOTICE 'Workspace existente: %', admin_workspace_id;
    END IF;
    
    -- Verificar quantos dados já existem
    SELECT COUNT(*) INTO voice_count FROM brand_voices WHERE workspace_id = admin_workspace_id;
    SELECT COUNT(*) INTO persona_count FROM target_personas WHERE workspace_id = admin_workspace_id;
    SELECT COUNT(*) INTO campaign_count FROM campaigns WHERE workspace_id = admin_workspace_id;
    
    RAISE NOTICE 'Dados existentes - Voices: %, Personas: %, Campanhas: %', voice_count, persona_count, campaign_count;
    
    -- INSERIR BRAND VOICES (se não existem)
    IF voice_count = 0 THEN
        INSERT INTO brand_voices (workspace_id, user_id, name, description, tone, style, examples, guidelines, usage_count, is_active) VALUES
        
        (admin_workspace_id, admin_user_id, 'Tech Inovadora', 
         'Tom técnico e inovador para produtos de tecnologia e startups',
         'Profissional', 'Direto',
         ARRAY[
             'Revolucione sua arquitetura com nossa solução cloud-native de última geração.',
             'Performance que escala: 99.9% de uptime garantido com monitoramento 24/7.',
             'API REST intuitiva, documentação completa, suporte técnico especializado.'
         ],
         'Use linguagem técnica mas acessível. Foque em benefícios práticos e resultados mensuráveis. Inclua termos como "otimizado", "escalável", "performance".',
         156, true),
         
        (admin_workspace_id, admin_user_id, 'Casual Amigável',
         'Tom descontraído e próximo para redes sociais e público jovem',
         'Casual', 'Conversacional',
         ARRAY[
             'Oi! Como foi seu dia? Aqui temos uma novidade incrível pra você! 😊',
             'Sabe aquela sensação de "finalmente encontrei!"? É isso que você vai sentir.',
             'Conta pra gente nos comentários: qual sua experiência favorita?'
         ],
         'Use emojis com moderação. Linguagem coloquial mas respeitosa. Faça perguntas para engajar. Tom amigável e empático.',
         203, true),
         
        (admin_workspace_id, admin_user_id, 'Corporativo Premium',
         'Tom elegante e sofisticado para segmento premium e executivos C-level',
         'Formal', 'Persuasivo',
         ARRAY[
             'Exclusividade redefinida: experiência premium para líderes visionários.',
             'Quando a excelência é o padrão, cada detalhe importa fundamentalmente.',
             'Acesso restrito a uma elite de inovadores e transformadores de mercado.'
         ],
         'Linguagem sofisticada sem ser pomposa. Foque em exclusividade, qualidade superior, status. Use palavras como "premium", "elite", "exclusivo".',
         89, true),
         
        (admin_workspace_id, admin_user_id, 'Startup Disruptiva',
         'Tom ousado e revolucionário para startups e empreendedores',
         'Energético', 'Provocativo',
         ARRAY[
             'Quebrar paradigmas não é hobby, é nossa missão diária. 🚀',
             'Enquanto outros seguem regras antigas, nós criamos o futuro.',
             'Disrupção real acontece quando você para de pedir permissão para inovar.'
         ],
         'Tom provocativo e inspirador. Use linguagem de mudança e revolução. Palavras-chave: "disruptivo", "inovador", "revolucionário", "futuro".',
         127, true),
         
        (admin_workspace_id, admin_user_id, 'E-commerce Persuasivo',
         'Tom focado em vendas e conversão para e-commerce',
         'Persuasivo', 'Urgente',
         ARRAY[
             '🔥 ÚLTIMAS UNIDADES! Não perca essa oportunidade única.',
             'Garantia de 30 dias ou seu dinheiro de volta. Risco zero para você!',
             'Mais de 10.000 clientes satisfeitos já transformaram suas vidas.'
         ],
         'Crie senso de urgência e escassez. Use prova social, garantias e benefícios claros. Inclua CTAs fortes e diretos.',
         312, true);
         
        RAISE NOTICE 'Brand voices inseridas com sucesso!';
    ELSE
        RAISE NOTICE 'Brand voices já existem, pulando inserção.';
    END IF;
    
    -- INSERIR PERSONAS (se não existem)
    IF persona_count = 0 THEN
        INSERT INTO target_personas (workspace_id, user_id, name, description, demographics, psychographics, pain_points, goals, preferred_channels, content_preferences, buying_behavior, notes) VALUES
        
        (admin_workspace_id, admin_user_id,
         'Ana Silva - CMO Tech',
         'Chief Marketing Officer de empresa de tecnologia, responsável por estratégia digital e growth.',
         jsonb_build_object(
             'age_range', '35-45',
             'gender', 'Feminino',
             'location', 'São Paulo, SP',
             'income', 'R$ 15.000 - R$ 25.000',
             'education', 'Superior completo - MBA',
             'occupation', 'Chief Marketing Officer'
         ),
         jsonb_build_object(
             'personality', ARRAY['Analítica', 'Estratégica', 'Orientada a resultados'],
             'values', ARRAY['Inovação', 'Eficiência', 'ROI'],
             'lifestyle', 'Vida corrida, networking constante, sempre conectada',
             'interests', ARRAY['Marketing digital', 'Tecnologia', 'Liderança', 'Dados']
         ),
         ARRAY['Falta de tempo para criar conteúdo', 'Dificuldade de mensurar ROI de campanhas', 'Pressão por resultados rápidos', 'Equipe pequena e sobrecarregada'],
         ARRAY['Aumentar brand awareness da empresa', 'Gerar leads qualificados', 'Otimizar conversões', 'Automatizar processos de marketing'],
         ARRAY['LinkedIn', 'Email profissional', 'Webinars', 'Eventos de networking', 'Blogs especializados'],
         jsonb_build_object(
             'content_types', ARRAY['Case studies', 'Dados e estatísticas', 'Tutoriais práticos', 'Webinars'],
             'tone_preference', 'Profissional mas acessível',
             'format_preference', ARRAY['Vídeos curtos', 'Infográficos', 'Posts LinkedIn', 'E-books']
         ),
         jsonb_build_object(
             'decision_process', 'Analítica e baseada em dados',
             'budget_influence', 'Alta - decide investimentos em marketing',
             'research_behavior', 'Pesquisa extensiva antes de comprar',
             'price_sensitivity', 'Média - foca em ROI'
         ),
         'Persona altamente estratégica. Responde bem a dados concretos e cases de sucesso.'),
         
        (admin_workspace_id, admin_user_id,
         'João Santos - Empreendedor Digital',
         'Empreendedor jovem com negócio online, focado em crescimento e automação.',
         jsonb_build_object(
             'age_range', '28-35',
             'gender', 'Masculino',
             'location', 'Rio de Janeiro, RJ',
             'income', 'R$ 8.000 - R$ 15.000',
             'education', 'Superior - Administração',
             'occupation', 'Empreendedor / CEO Startup'
         ),
         jsonb_build_object(
             'personality', ARRAY['Inovador', 'Ousado', 'Multitarefa'],
             'values', ARRAY['Crescimento', 'Liberdade', 'Impacto'],
             'lifestyle', 'Dinâmico, trabalha de casa, viaja frequentemente',
             'interests', ARRAY['Startups', 'Tecnologia', 'Investimentos', 'Produtividade']
         ),
         ARRAY['Recursos limitados para marketing', 'Dificuldade em escalar operações', 'Falta de expertise em áreas específicas', 'Tempo limitado para tudo'],
         ARRAY['Escalar o negócio rapidamente', 'Automatizar processos', 'Aumentar receita', 'Construir marca pessoal'],
         ARRAY['Instagram', 'YouTube', 'Podcasts', 'Telegram', 'WhatsApp'],
         jsonb_build_object(
             'content_types', ARRAY['Stories inspiracionais', 'Dicas práticas', 'Behind the scenes', 'Tutoriais'],
             'tone_preference', 'Casual e motivacional',
             'format_preference', ARRAY['Vídeos', 'Stories', 'Posts inspiracionais', 'Reels']
         ),
         jsonb_build_object(
             'decision_process', 'Rápida e intuitiva',
             'budget_influence', 'Total - bootstrapped',
             'research_behavior', 'Pesquisa rápida, confia em indicações',
             'price_sensitivity', 'Alta - busca custo-benefício'
         ),
         'Persona dinâmica que responde a conteúdo inspiracional e prático.');
         
        RAISE NOTICE 'Personas inseridas com sucesso!';
    ELSE
        RAISE NOTICE 'Personas já existem, pulando inserção.';
    END IF;
    
    -- INSERIR CAMPANHAS (se não existem)
    IF campaign_count = 0 THEN
        INSERT INTO campaigns (workspace_id, user_id, name, description, status, budget, start_date, end_date, metadata, tags) VALUES
        
        (admin_workspace_id, admin_user_id, 
         'Black Friday 2024 - E-commerce',
         'Campanha completa para Black Friday focada em conversão e vendas.',
         'ACTIVE',
         5000.00,
         '2024-11-15',
         '2024-11-30',
         jsonb_build_object(
             'objective', 'Sales',
             'platforms', ARRAY['instagram', 'facebook', 'email'],
             'targetAudience', 'Consumidores 25-45 anos',
             'ctr_target', '4.5%'
         ),
         ARRAY['black-friday', 'e-commerce', 'vendas']),
         
        (admin_workspace_id, admin_user_id,
         'Lançamento Produto SaaS',
         'Estratégia de lançamento para nova ferramenta SaaS B2B.',
         'ACTIVE', 
         3500.00,
         '2024-11-01',
         '2024-12-15',
         jsonb_build_object(
             'objective', 'Leads',
             'platforms', ARRAY['linkedin', 'twitter', 'blog'],
             'targetAudience', 'Profissionais de TI, CTOs',
             'lead_target', '500'
         ),
         ARRAY['saas', 'b2b', 'tecnologia']),
         
        (admin_workspace_id, admin_user_id,
         'Awareness Brand - Q4 2024',
         'Campanha de reconhecimento de marca para aumentar reach.',
         'PAUSED',
         8000.00,
         '2024-10-01',
         '2024-12-31',
         jsonb_build_object(
             'objective', 'Awareness',
             'platforms', ARRAY['youtube', 'instagram', 'tiktok'],
             'targetAudience', 'Público geral 18-35 anos',
             'reach_target', '100000'
         ),
         ARRAY['awareness', 'brand', 'video']);
         
        RAISE NOTICE 'Campanhas inseridas com sucesso!';
    ELSE
        RAISE NOTICE 'Campanhas já existem, pulando inserção.';
    END IF;
    
    RAISE NOTICE 'Inserção de seeds concluída com sucesso!';
    
END $$;