-- Script para popular templates de demonstração no StorySpark
-- Executar via MCP Supabase quando tiver acesso

DO $$
DECLARE
    admin_workspace_id uuid;
    admin_user_id uuid;
    template_count integer;
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
    RAISE NOTICE 'Workspace: %', admin_workspace_id;
    
    -- Verificar quantos templates já existem
    SELECT COUNT(*) INTO template_count FROM templates WHERE workspace_id = admin_workspace_id;
    RAISE NOTICE 'Templates existentes: %', template_count;
    
    -- INSERIR TEMPLATES (se não existem)
    IF template_count = 0 THEN
        INSERT INTO templates (workspace_id, user_id, name, description, content, type, category, variables, metadata, usage_count, is_public) VALUES
        
        -- TEMPLATES PARA REDES SOCIAIS
        (admin_workspace_id, admin_user_id, 
         'Post Instagram - Produto',
         'Template para divulgação de produtos no Instagram com call-to-action',
         '🔥 NOVIDADE CHEGANDO! 

{{produto_nome}} está aqui para revolucionar {{area_atuacao}}!

✨ Principais benefícios:
{{#each beneficios}}
• {{this}}
{{/each}}

💰 Oferta especial: {{desconto}}% OFF até {{data_limite}}

👆 Clique no link da bio e garante o seu!

{{hashtags}}

#{{marca}} #lancamento #ofertas',
         'SOCIAL_POST',
         'Instagram',
         jsonb_build_object(
             'produto_nome', 'string',
             'area_atuacao', 'string', 
             'beneficios', 'array',
             'desconto', 'number',
             'data_limite', 'string',
             'hashtags', 'string',
             'marca', 'string'
         ),
         jsonb_build_object(
             'platform', 'Instagram',
             'post_type', 'Produto',
             'character_limit', 2200,
             'recommended_hashtags', 15
         ),
         89, true),
         
        (admin_workspace_id, admin_user_id,
         'LinkedIn - Thought Leadership',
         'Template para posts de liderança de pensamento no LinkedIn',
         'Reflexão sobre {{tema_principal}} 💭

Recentemente, tenho observado uma mudança significativa em {{contexto_mercado}}.

{{#if estatistica}}
Os números falam por si: {{estatistica}}
{{/if}}

🎯 Minha perspectiva:

{{#each pontos_principais}}
{{@index}}. {{this}}
{{/each}}

{{pergunta_engajamento}}

O que vocês pensam sobre isso? Compartilhem suas experiências nos comentários! 👇

{{call_to_action}}

#{{industria}} #lideranca #inovacao #{{tema_hashtag}}',
         'SOCIAL_POST',
         'LinkedIn',
         jsonb_build_object(
             'tema_principal', 'string',
             'contexto_mercado', 'string',
             'estatistica', 'string',
             'pontos_principais', 'array',
             'pergunta_engajamento', 'string',
             'call_to_action', 'string',
             'industria', 'string',
             'tema_hashtag', 'string'
         ),
         jsonb_build_object(
             'platform', 'LinkedIn',
             'post_type', 'Thought Leadership',
             'character_limit', 3000,
             'tone', 'Professional'
         ),
         156, true),
         
        -- TEMPLATES PARA EMAIL MARKETING
        (admin_workspace_id, admin_user_id,
         'Email - Sequência de Welcome',
         'Primeiro email da sequência de boas-vindas para novos assinantes',
         'Assunto: Bem-vindo(a) à {{empresa_nome}}! 🎉

Olá {{nome_usuario}},

Que alegria ter você conosco! 

Você acaba de dar o primeiro passo para {{beneficio_principal}}, e estamos aqui para te acompanhar em toda essa jornada.

🎁 BÔNUS DE BOAS-VINDAS:
{{#each bonus}}
✓ {{this}}
{{/each}}

📅 Nos próximos dias, você vai receber:
• Dia 2: {{conteudo_dia2}}
• Dia 5: {{conteudo_dia5}}
• Dia 7: {{conteudo_dia7}}

{{#if tem_comunidade}}
💬 Não esqueça de se juntar à nossa comunidade exclusiva: {{link_comunidade}}
{{/if}}

Alguma dúvida? É só responder este email!

Com carinho,
{{nome_remetente}}
{{cargo_remetente}} | {{empresa_nome}}

P.S.: {{ps_personalizado}}',
         'EMAIL',
         'Welcome Series',
         jsonb_build_object(
             'empresa_nome', 'string',
             'nome_usuario', 'string',
             'beneficio_principal', 'string',
             'bonus', 'array',
             'conteudo_dia2', 'string',
             'conteudo_dia5', 'string',
             'conteudo_dia7', 'string',
             'tem_comunidade', 'boolean',
             'link_comunidade', 'string',
             'nome_remetente', 'string',
             'cargo_remetente', 'string',
             'ps_personalizado', 'string'
         ),
         jsonb_build_object(
             'email_type', 'Welcome',
             'sequence_position', 1,
             'send_delay_hours', 0,
             'recommended_time', 'morning'
         ),
         234, true),
         
        (admin_workspace_id, admin_user_id,
         'Email - Carrinho Abandonado',
         'Email de recuperação para carrinhos abandonados no e-commerce',
         'Assunto: Ops! Você esqueceu algo especial 🛍️

Oi {{nome_cliente}},

Notamos que você estava interessado(a) em alguns produtos incríveis, mas não finalizou a compra.

🛒 Itens no seu carrinho:
{{#each produtos_carrinho}}
• {{nome}} - {{preco}}
{{/each}}

💳 Total: {{valor_total}}

{{#if tem_desconto}}
🎁 BOA NOTÍCIA: Temos um desconto especial de {{percentual_desconto}}% só para você!

Use o cupom: {{codigo_cupom}}
{{/if}}

⏰ Mas corra! {{#if urgencia}}{{urgencia}}{{else}}Essa oferta é por tempo limitado{{/if}}

[FINALIZAR COMPRA AGORA]

Ainda com dúvidas? Nossa equipe está pronta para ajudar:
📱 WhatsApp: {{whatsapp}}
📧 Email: {{email_suporte}}

Abraços,
Equipe {{nome_loja}}

{{#if garantia}}
🔒 Compra 100% segura | {{garantia}}
{{/if}}',
         'EMAIL',
         'E-commerce',
         jsonb_build_object(
             'nome_cliente', 'string',
             'produtos_carrinho', 'array',
             'valor_total', 'string',
             'tem_desconto', 'boolean',
             'percentual_desconto', 'number',
             'codigo_cupom', 'string',
             'urgencia', 'string',
             'whatsapp', 'string',
             'email_suporte', 'string',
             'nome_loja', 'string',
             'garantia', 'string'
         ),
         jsonb_build_object(
             'email_type', 'Cart Recovery',
             'send_delay_hours', 2,
             'automation_trigger', 'cart_abandoned',
             'conversion_goal', 'purchase'
         ),
         445, true),
         
        -- TEMPLATES PARA ANÚNCIOS
        (admin_workspace_id, admin_user_id,
         'Google Ads - Responsivo',
         'Template para anúncios responsivos do Google Ads com múltiplas variações',
         'TÍTULOS (máx. 30 caracteres cada):
1. {{titulo_principal}} | {{marca}}
2. {{titulo_beneficio}}
3. {{titulo_urgencia}}

DESCRIÇÕES (máx. 90 caracteres cada):
1. {{descricao_produto}}. {{call_to_action_curto}}.
2. {{diferencial_principal}}. {{oferta_especial}}.

URL DE EXIBIÇÃO:
{{site_empresa}}/{{categoria}}

EXTENSÕES:
{{#each extensoes_sitelink}}
• {{titulo}}: {{url}}
{{/each}}

PALAVRAS-CHAVE PRINCIPAIS:
{{#each palavras_chave}}
- {{this}}
{{/each}}

PÚBLICO-ALVO: {{publico_alvo}}
LOCALIZAÇÃO: {{localizacao}}
ORÇAMENTO SUGERIDO: {{orcamento_diario}}',
         'AD',
         'Google Ads',
         jsonb_build_object(
             'titulo_principal', 'string',
             'marca', 'string',
             'titulo_beneficio', 'string',
             'titulo_urgencia', 'string',
             'descricao_produto', 'string',
             'call_to_action_curto', 'string',
             'diferencial_principal', 'string',
             'oferta_especial', 'string',
             'site_empresa', 'string',
             'categoria', 'string',
             'extensoes_sitelink', 'array',
             'palavras_chave', 'array',
             'publico_alvo', 'string',
             'localizacao', 'string',
             'orcamento_diario', 'string'
         ),
         jsonb_build_object(
             'platform', 'Google Ads',
             'ad_type', 'Responsive Search Ad',
             'title_limit', 30,
             'description_limit', 90,
             'max_titles', 15,
             'max_descriptions', 4
         ),
         178, true),
         
        -- TEMPLATES PARA BLOG/CONTEÚDO
        (admin_workspace_id, admin_user_id,
         'Blog Post - Tutorial',
         'Template estruturado para posts de tutorial/como fazer',
         '# Como {{titulo_tutorial}}: Guia Completo {{ano}}

{{#if intro_hook}}
{{intro_hook}}
{{/if}}

Se você está {{problema_usuario}}, este guia é para você!

Neste tutorial, você vai aprender:
{{#each objetivos_aprendizado}}
✅ {{this}}
{{/each}}

**Tempo estimado:** {{tempo_execucao}}
**Nível:** {{nivel_dificuldade}}

## O que você vai precisar

{{#each ferramentas_necessarias}}
- {{this}}
{{/each}}

{{#each etapas}}
## Passo {{@index}}: {{titulo}}

{{descricao}}

{{#if imagem}}
![{{alt_imagem}}]({{imagem}})
{{/if}}

{{#if dica}}
💡 **Dica Pro:** {{dica}}
{{/if}}

{{#if codigo}}
```{{linguagem}}
{{codigo}}
```
{{/if}}

{{/each}}

## Resultado Final

{{descricao_resultado}}

## Próximos Passos

{{#each proximos_passos}}
1. {{this}}
{{/each}}

---

**Gostou deste tutorial?** {{call_to_action_final}}

**Ficou com dúvidas?** Deixe um comentário abaixo que responderemos!

{{#each tags}}
#{{this}}
{{/each}}',
         'BLOG_POST',
         'Tutorial',
         jsonb_build_object(
             'titulo_tutorial', 'string',
             'ano', 'string',
             'intro_hook', 'string',
             'problema_usuario', 'string',
             'objetivos_aprendizado', 'array',
             'tempo_execucao', 'string',
             'nivel_dificuldade', 'string',
             'ferramentas_necessarias', 'array',
             'etapas', 'array',
             'descricao_resultado', 'string',
             'proximos_passos', 'array',
             'call_to_action_final', 'string',
             'tags', 'array'
         ),
         jsonb_build_object(
             'content_type', 'Tutorial',
             'estimated_reading_time', '{{tempo_leitura}} min',
             'seo_optimized', true,
             'content_structure', 'step_by_step'
         ),
         67, true),
         
        -- TEMPLATES PARA SCRIPTS DE VÍDEO
        (admin_workspace_id, admin_user_id,
         'Script - YouTube Explicativo',
         'Template para scripts de vídeos explicativos no YouTube',
         '# Script: {{titulo_video}}

**DURAÇÃO ESTIMADA:** {{duracao_minutos}} minutos
**PÚBLICO-ALVO:** {{publico_alvo}}

## HOOK (0-15 segundos)
{{gancho_inicial}}

{{#if estatistica_hook}}
[MOSTRAR NA TELA: {{estatistica_hook}}]
{{/if}}

## INTRODUÇÃO (15-30 segundos)
Oi, {{saudacao_personalizada}}! 

{{apresentacao_pessoal}}

No vídeo de hoje, vamos {{objetivo_video}}.

{{#if bonus_video}}
E no final, tem um bônus especial: {{bonus_video}}
{{/if}}

## DESENVOLVIMENTO

{{#each topicos_principais}}
### {{titulo}} ({{tempo_inicio}})

{{conteudo}}

{{#if exemplo}}
**Exemplo prático:** {{exemplo}}
{{/if}}

{{#if visual_sugerido}}
[VISUAL: {{visual_sugerido}}]
{{/if}}

{{/each}}

## CALL TO ACTION ({{tempo_cta}})
{{call_to_action_principal}}

{{#if tem_subscribe}}
Se este conteúdo está sendo útil para você, {{subscribe_message}}
{{/if}}

## ENCERRAMENTO
{{mensagem_final}}

{{despedida_personalizada}}

---

**ELEMENTOS VISUAIS:**
{{#each elementos_visuais}}
- {{tempo}}: {{descricao}}
{{/each}}

**PALAVRAS-CHAVE SEO:**
{{#each keywords_seo}}
- {{this}}
{{/each}}

**THUMBNAIL SUGERIDA:** {{thumbnail_descricao}}',
         'SCRIPT',
         'YouTube',
         jsonb_build_object(
             'titulo_video', 'string',
             'duracao_minutos', 'number',
             'publico_alvo', 'string',
             'gancho_inicial', 'string',
             'estatistica_hook', 'string',
             'saudacao_personalizada', 'string',
             'apresentacao_pessoal', 'string',
             'objetivo_video', 'string',
             'bonus_video', 'string',
             'topicos_principais', 'array',
             'call_to_action_principal', 'string',
             'tem_subscribe', 'boolean',
             'subscribe_message', 'string',
             'mensagem_final', 'string',
             'despedida_personalizada', 'string',
             'elementos_visuais', 'array',
             'keywords_seo', 'array',
             'thumbnail_descricao', 'string'
         ),
         jsonb_build_object(
             'platform', 'YouTube',
             'video_type', 'Educational',
             'script_format', 'structured',
             'includes_visuals', true,
             'seo_optimized', true
         ),
         123, true);
         
        RAISE NOTICE 'Templates inseridos com sucesso!';
    ELSE
        RAISE NOTICE 'Templates já existem, pulando inserção.';
    END IF;
    
    RAISE NOTICE 'Inserção de templates concluída!';
    
END $$;