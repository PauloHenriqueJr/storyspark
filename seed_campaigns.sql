-- Script para popular campanhas de demonstração no StorySpark

DO $$
DECLARE
    demo_workspace_id uuid;
    demo_user_id uuid;
BEGIN
    -- Buscar um workspace existente
    SELECT id INTO demo_workspace_id FROM workspaces LIMIT 1;
    SELECT owner_id INTO demo_user_id FROM workspaces WHERE id = demo_workspace_id;
    
    -- Se não encontrar workspace, usar IDs padrão (já criados no script anterior)
    IF demo_workspace_id IS NULL THEN
        SELECT id, owner_id INTO demo_workspace_id, demo_user_id FROM workspaces WHERE slug = 'demo-workspace';
    END IF;

    -- Inserir Campanhas de exemplo
    INSERT INTO campaigns (workspace_id, user_id, name, description, status, budget, start_date, end_date, metadata, tags) VALUES
    
    (demo_workspace_id, demo_user_id, 
     'Black Friday 2024 - E-commerce',
     'Campanha completa para Black Friday focada em conversão e vendas. Inclui copy para posts, stories, emails e anúncios pagos.',
     'ACTIVE',
     5000.00,
     '2024-11-15',
     '2024-11-30',
     jsonb_build_object(
         'objective', 'Sales (Vendas)',
         'platforms', ARRAY['instagram', 'facebook', 'email'],
         'targetAudience', 'Consumidores 25-45 anos interessados em ofertas',
         'persona', 'Jovem Urbano (18-25)',
         'ctr_target', '4.5%',
         'conversion_target', '3.2%'
     ),
     ARRAY['black-friday', 'e-commerce', 'vendas', 'promocao']),
     
    (demo_workspace_id, demo_user_id,
     'Lançamento Produto SaaS',
     'Estratégia de lançamento para nova ferramenta SaaS B2B. Foco em geração de leads qualificados e trial gratuito.',
     'ACTIVE', 
     3500.00,
     '2024-11-01',
     '2024-12-15',
     jsonb_build_object(
         'objective', 'Leads (Geração de Leads)',
         'platforms', ARRAY['linkedin', 'twitter', 'blog'],
         'targetAudience', 'Profissionais de TI, CTOs, desenvolvedores',
         'persona', 'Profissional Liberal (26-35)',
         'lead_target', '500',
         'cost_per_lead', '15.00'
     ),
     ARRAY['saas', 'b2b', 'tecnologia', 'leads']),
     
    (demo_workspace_id, demo_user_id,
     'Awareness Brand - Q4 2024',
     'Campanha de reconhecimento de marca para aumentar reach e engagement. Conteúdo educativo e inspiracional.',
     'PAUSED',
     8000.00,
     '2024-10-01',
     '2024-12-31',
     jsonb_build_object(
         'objective', 'Awareness (Reconhecimento)',
         'platforms', ARRAY['youtube', 'instagram', 'tiktok'],
         'targetAudience', 'Público geral 18-35 anos',
         'persona', 'Jovem Urbano (18-25)',
         'reach_target', '100000',
         'engagement_target', '5.5%'
     ),
     ARRAY['awareness', 'brand', 'video', 'social']),
     
    (demo_workspace_id, demo_user_id,
     'Retargeting Carrinho Abandonado',
     'Recuperação de vendas através de retargeting para usuários que abandonaram carrinho de compras.',
     'ACTIVE',
     2500.00,
     '2024-11-10',
     '2024-12-25',
     jsonb_build_object(
         'objective', 'Conversions (Conversões)',
         'platforms', ARRAY['facebook', 'instagram', 'email'],
         'targetAudience', 'Usuários que abandonaram carrinho',
         'persona', 'Profissional Liberal (26-35)',
         'recovery_rate_target', '15%',
         'roas_target', '4.2'
     ),
     ARRAY['retargeting', 'ecommerce', 'conversao', 'recovery']),
     
    (demo_workspace_id, demo_user_id,
     'Curso Online - Marketing Digital',
     'Promoção e lançamento de curso online de marketing digital. Estratégia educativa com prova social.',
     'DRAFT',
     4200.00,
     '2024-12-01',
     '2025-01-31',
     jsonb_build_object(
         'objective', 'Leads (Geração de Leads)',
         'platforms', ARRAY['youtube', 'instagram', 'facebook', 'linkedin'],
         'targetAudience', 'Empreendedores e profissionais de marketing',
         'persona', 'Empreendedor (25-40)',
         'enrollment_target', '200',
         'webinar_leads', '1500'
     ),
     ARRAY['educacao', 'curso', 'marketing', 'online']),
     
    (demo_workspace_id, demo_user_id,
     'App Mobile - Download Campaign',
     'Campanha para aumentar downloads do aplicativo mobile com foco em usuários premium.',
     'ACTIVE',
     6000.00,
     '2024-11-20',
     '2024-12-20',
     jsonb_build_object(
         'objective', 'Traffic (Tráfego)',
         'platforms', ARRAY['google-ads', 'facebook', 'instagram', 'tiktok'],
         'targetAudience', 'Usuários mobile 18-40 anos',
         'persona', 'Jovem Urbano (18-25)',
         'download_target', '10000',
         'cost_per_install', '2.50'
     ),
     ARRAY['mobile', 'app', 'download', 'traffic']);

    -- Log de sucesso
    RAISE NOTICE 'Campanhas de demonstração inseridas com sucesso para workspace: %', demo_workspace_id;
    
END $$;