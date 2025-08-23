-- Script para popular personas de demonstração no StorySpark

DO $$
DECLARE
    demo_workspace_id uuid;
    demo_user_id uuid;
BEGIN
    -- Buscar um workspace existente
    SELECT id INTO demo_workspace_id FROM workspaces LIMIT 1;
    SELECT owner_id INTO demo_user_id FROM workspaces WHERE id = demo_workspace_id;
    
    -- Se não encontrar workspace, usar IDs padrão
    IF demo_workspace_id IS NULL THEN
        SELECT id, owner_id INTO demo_workspace_id, demo_user_id FROM workspaces WHERE slug = 'demo-workspace';
    END IF;

    -- Inserir Personas de exemplo
    INSERT INTO target_personas (workspace_id, user_id, name, description, demographics, psychographics, pain_points, goals, preferred_channels, content_preferences, buying_behavior, notes) VALUES
    
    (demo_workspace_id, demo_user_id,
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
     'Persona altamente estratégica. Responde bem a dados concretos e cases de sucesso. Prefere conteúdo que demonstre resultados mensuráveis.'),
     
    (demo_workspace_id, demo_user_id,
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
     'Persona dinâmica que responde a conteúdo inspiracional e prático. Gosta de cases de empreendedores de sucesso e dicas aplicáveis.'),
     
    (demo_workspace_id, demo_user_id,
     'Maria Oliveira - Gerente E-commerce',
     'Gerente de e-commerce responsável por vendas online e performance de campanhas.',
     jsonb_build_object(
         'age_range', '30-40',
         'gender', 'Feminino',
         'location', 'Belo Horizonte, MG',
         'income', 'R$ 6.000 - R$ 12.000',
         'education', 'Superior - Marketing',
         'occupation', 'Gerente de E-commerce'
     ),
     jsonb_build_object(
         'personality', ARRAY['Detalhista', 'Orientada a metas', 'Prática'],
         'values', ARRAY['Resultados', 'Organização', 'Crescimento'],
         'lifestyle', 'Equilibrio trabalho-vida, família, organizada',
         'interests', ARRAY['E-commerce', 'Vendas', 'Analytics', 'Moda']
     ),
     ARRAY['Pressão por conversões constantes', 'Competição acirrada', 'Mudanças de algoritmo', 'Orçamento limitado para testes'],
     ARRAY['Aumentar taxa de conversão', 'Reduzir custo por aquisição', 'Melhorar ROAS', 'Fidelizar clientes'],
     ARRAY['Facebook', 'Instagram', 'Email', 'Google Ads', 'WhatsApp Business'],
     jsonb_build_object(
         'content_types', ARRAY['Promoções', 'Produtos em destaque', 'Depoimentos', 'Ofertas especiais'],
         'tone_preference', 'Persuasivo e confiável',
         'format_preference', ARRAY['Carrosséis', 'Vídeos de produto', 'Stories com ofertas', 'Posts promocionais']
     ),
     jsonb_build_object(
         'decision_process', 'Baseada em ROI e métricas',
         'budget_influence', 'Média - tem orçamento definido',
         'research_behavior', 'Testa antes de investir grande',
         'price_sensitivity', 'Média - foca em resultados'
     ),
     'Persona focada em resultados de vendas. Responde bem a conteúdo que demonstre aumento de conversões e casos de sucesso em e-commerce.'),
     
    (demo_workspace_id, demo_user_id,
     'Carlos Mendes - Consultor Freelancer',
     'Consultor independente especializado em transformação digital para PMEs.',
     jsonb_build_object(
         'age_range', '40-50',
         'gender', 'Masculino',
         'location', 'Porto Alegre, RS',
         'income', 'R$ 10.000 - R$ 20.000',
         'education', 'MBA - Gestão Estratégica',
         'occupation', 'Consultor Empresarial'
     ),
     jsonb_build_object(
         'personality', ARRAY['Experiente', 'Conselheiro', 'Analítico'],
         'values', ARRAY['Expertise', 'Confiança', 'Resultados duradouros'],
         'lifestyle', 'Flexível, home office, networking profissional',
         'interests', ARRAY['Estratégia empresarial', 'Transformação digital', 'Liderança', 'Educação']
     ),
     ARRAY['Dificuldade em escalar serviços', 'Dependência do tempo pessoal', 'Competição com grandes consultorias', 'Prospecção constante'],
     ARRAY['Construir autoridade no mercado', 'Atrair clientes qualificados', 'Aumentar valor por projeto', 'Criar produtos escaláveis'],
     ARRAY['LinkedIn', 'Email', 'WhatsApp', 'Eventos presenciais', 'Webinars'],
     jsonb_build_object(
         'content_types', ARRAY['Artigos técnicos', 'Case studies', 'Análises de mercado', 'Conteúdo educativo'],
         'tone_preference', 'Autoritativo e educativo',
         'format_preference', ARRAY['Artigos longos', 'Vídeos explicativos', 'Apresentações', 'E-books']
     ),
     jsonb_build_object(
         'decision_process', 'Cuidadosa e fundamentada',
         'budget_influence', 'Alta - investe em ferramentas que dão ROI',
         'research_behavior', 'Pesquisa detalhada e referências',
         'price_sensitivity', 'Baixa - foca em qualidade'
     ),
     'Persona experiente que valoriza conteúdo técnico e aprofundado. Responde bem a demonstrações de expertise e cases detalhados.'),
     
    (demo_workspace_id, demo_user_id,
     'Beatriz Costa - Social Media Manager',
     'Especialista em redes sociais responsável por múltiplas contas de clientes.',
     jsonb_build_object(
         'age_range', '25-32',
         'gender', 'Feminino',
         'location', 'Recife, PE',
         'income', 'R$ 4.000 - R$ 8.000',
         'education', 'Superior - Comunicação Social',
         'occupation', 'Social Media Manager'
     ),
     jsonb_build_object(
         'personality', ARRAY['Criativa', 'Conectada', 'Dinâmica'],
         'values', ARRAY['Criatividade', 'Engajamento', 'Tendências'],
         'lifestyle', 'Sempre online, acompanha tendências, vida social ativa',
         'interests', ARRAY['Redes sociais', 'Design', 'Fotografia', 'Influenciadores']
     ),
     ARRAY['Pressão por engajamento constante', 'Múltiplos clientes simultaneamente', 'Acompanhar mudanças de algoritmo', 'Criar conteúdo original constantemente'],
     ARRAY['Aumentar engajamento dos clientes', 'Criar conteúdo viral', 'Otimizar tempo de criação', 'Manter-se atualizada'],
     ARRAY['Instagram', 'TikTok', 'Twitter', 'Pinterest', 'YouTube'],
     jsonb_build_object(
         'content_types', ARRAY['Templates visuais', 'Trends e challenges', 'Behind the scenes', 'Dicas criativas'],
         'tone_preference', 'Descontraído e criativo',
         'format_preference', ARRAY['Stories', 'Reels', 'Carrosséis', 'Vídeos curtos']
     ),
     jsonb_build_object(
         'decision_process', 'Rápida e baseada em tendências',
         'budget_influence', 'Baixa a média - orçamento dos clientes',
         'research_behavior', 'Busca inspiração e ferramentas práticas',
         'price_sensitivity', 'Alta - busca ferramentas acessíveis'
     ),
     'Persona criativa que precisa de ferramentas ágeis para criação de conteúdo. Responde bem a templates, tendências e conteúdo visual inspirador.');

    -- Log de sucesso
    RAISE NOTICE 'Personas de demonstração inseridas com sucesso para workspace: %', demo_workspace_id;
    
END $$;