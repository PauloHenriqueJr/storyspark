-- Script para popular dados de demonstração no StorySpark
-- Executar via MCP Supabase ou psql

-- 1. BRAND VOICES DE DEMONSTRAÇÃO
-- Inserir brand voices exemplo para o workspace principal

DO $$
DECLARE
    demo_workspace_id uuid;
    demo_user_id uuid;
BEGIN
    -- Buscar um workspace existente ou usar um ID padrão
    SELECT id INTO demo_workspace_id FROM workspaces LIMIT 1;
    SELECT owner_id INTO demo_user_id FROM workspaces WHERE id = demo_workspace_id;
    
    -- Se não encontrar workspace, criar dados de exemplo genéricos
    IF demo_workspace_id IS NULL THEN
        -- Criar workspace demo temporário
        INSERT INTO workspaces (id, name, slug, plan, owner_id)
        VALUES (
            gen_random_uuid(),
            'Workspace Demo',
            'demo-workspace',
            'FREE',
            gen_random_uuid()
        )
        RETURNING id, owner_id INTO demo_workspace_id, demo_user_id;
    END IF;

    -- Inserir Brand Voices de exemplo
    INSERT INTO brand_voices (workspace_id, user_id, name, description, tone, style, examples, guidelines, usage_count, is_active) VALUES
    
    (demo_workspace_id, demo_user_id, 'Tech Inovadora', 
     'Tom técnico e inovador para produtos de tecnologia e startups',
     'Profissional', 'Direto',
     ARRAY[
         'Revolucione sua arquitetura com nossa solução cloud-native de última geração.',
         'Performance que escala: 99.9% de uptime garantido com monitoramento 24/7.',
         'API REST intuitiva, documentação completa, suporte técnico especializado.'
     ],
     'Use linguagem técnica mas acessível. Foque em benefícios práticos e resultados mensuráveis. Inclua termos como "otimizado", "escalável", "performance".',
     156, true),
     
    (demo_workspace_id, demo_user_id, 'Casual Amigável',
     'Tom descontraído e próximo para redes sociais e público jovem',
     'Casual', 'Conversacional',
     ARRAY[
         'Oi! Como foi seu dia? Aqui temos uma novidade incrível pra você! 😊',
         'Sabe aquela sensação de "finalmente encontrei!"? É isso que você vai sentir.',
         'Conta pra gente nos comentários: qual sua experiência favorita?'
     ],
     'Use emojis com moderação. Linguagem coloquial mas respeitosa. Faça perguntas para engajar. Tom amigável e empático.',
     203, true),
     
    (demo_workspace_id, demo_user_id, 'Corporativo Premium',
     'Tom elegante e sofisticado para segmento premium e executivos C-level',
     'Formal', 'Persuasivo',
     ARRAY[
         'Exclusividade redefinida: experiência premium para líderes visionários.',
         'Quando a excelência é o padrão, cada detalhe importa fundamentalmente.',
         'Acesso restrito a uma elite de inovadores e transformadores de mercado.'
     ],
     'Linguagem sofisticada sem ser pomposa. Foque em exclusividade, qualidade superior, status. Use palavras como "premium", "elite", "exclusivo".',
     89, true),
     
    (demo_workspace_id, demo_user_id, 'Startup Disruptiva',
     'Tom ousado e revolucionário para startups e empreendedores',
     'Energético', 'Provocativo',
     ARRAY[
         'Quebrar paradigmas não é hobby, é nossa missão diária. 🚀',
         'Enquanto outros seguem regras antigas, nós criamos o futuro.',
         'Disrupção real acontece quando você para de pedir permissão para inovar.'
     ],
     'Tom provocativo e inspirador. Use linguagem de mudança e revolução. Palavras-chave: "disruptivo", "inovador", "revolucionário", "futuro".',
     127, true),
     
    (demo_workspace_id, demo_user_id, 'E-commerce Persuasivo',
     'Tom focado em vendas e conversão para e-commerce',
     'Persuasivo', 'Urgente',
     ARRAY[
         '🔥 ÚLTIMAS UNIDADES! Não perca essa oportunidade única.',
         'Garantia de 30 dias ou seu dinheiro de volta. Risco zero para você!',
         'Mais de 10.000 clientes satisfeitos já transformaram suas vidas.'
     ],
     'Crie senso de urgência e escassez. Use prova social, garantias e benefícios claros. Inclua CTAs fortes e diretos.',
     312, true),
     
    (demo_workspace_id, demo_user_id, 'Educativo Autoritativo',
     'Tom educativo e expertise para conteúdo informativo',
     'Educativo', 'Autoritativo',
     ARRAY[
         'Estudos comprovam: esta estratégia aumenta resultados em 300%.',
         'Passo a passo completo: como implementar essa técnica hoje mesmo.',
         'Erro #1 que 90% das pessoas cometem (e como evitar).'
     ],
     'Base em dados e estudos. Use números específicos e estatísticas. Tom de especialista mas acessível. Estruture em passos claros.',
     198, true);

    -- Log de sucesso
    RAISE NOTICE 'Brand voices de demonstração inseridas com sucesso para workspace: %', demo_workspace_id;
    
END $$;