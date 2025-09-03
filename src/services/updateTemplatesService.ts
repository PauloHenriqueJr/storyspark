import { supabase } from "@/lib/supabase";
import { brandedEmailTemplate } from "./brandedEmailTemplate";

interface TemplateConversion {
  id: string;
  name: string;
  category: string;
  description: string;
  subject: string;
  headerTitle: string;
  headerSubtitle?: string;
  content: string;
  textContent: string;
  customStyles?: string;
}

const templateConversions: TemplateConversion[] = [
  {
    id: "waitlist-invite",
    name: "Template para convite da waitlist",
    category: "Marketing",
    description: "Template para convite da waitlist com código exclusivo",
    subject: "Seu convite especial chegou! 🎉 - StorySpark",
    headerTitle: "Bem-vindo à nossa Waitlist! 🎉",
    headerSubtitle: "Seu lugar está garantido",
    content: `
      <div class="content">
        <div class="success-box">
          <h3 style="margin: 0 0 10px 0; color: #15803d; font-size: 18px; font-weight: 600;">✅ Convite Confirmado!</h3>
          <p style="margin: 0; color: #15803d;">Você está na posição <strong>#{{waitlistPosition}}</strong> da nossa waitlist</p>
        </div>
        
        <p>Olá <strong>{{userName}}</strong>!</p>
        
        <p>Que ótimo ter você conosco! Você demonstrou interesse em:</p>
        <div class="highlight-box">
          <p style="margin: 0; color: #92400e; font-weight: 600;">{{selectedIdeas}}</p>
        </div>
        
        <p>Seu código de convite exclusivo é:</p>
        <div style="background: #1f2937; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0; font-family: 'Courier New', monospace;">
          <span style="font-size: 24px; font-weight: bold; letter-spacing: 2px;">{{inviteCode}}</span>
        </div>
        
        <div class="cta-container">
          <a href="{{loginUrl}}" class="cta-button">Acessar Plataforma</a>
        </div>
        
        <p>Em breve você receberá mais informações sobre o lançamento e funcionalidades exclusivas!</p>
        
        <p style="margin-top: 30px;">
          Atenciosamente,<br>
          <strong>Equipe StorySpark</strong>
        </p>
      </div>
    `,
    textContent: `Bem-vindo à nossa Waitlist! 🎉

Olá {{userName}}!

✅ Convite Confirmado!
Você está na posição #{{waitlistPosition}} da nossa waitlist

Você demonstrou interesse em: {{selectedIdeas}}

Seu código de convite exclusivo é: {{inviteCode}}

Acessar Plataforma: {{loginUrl}}

Em breve você receberá mais informações sobre o lançamento e funcionalidades exclusivas!

Atenciosamente,
Equipe StorySpark

© 2024 StorySpark. Todos os direitos reservados.`,
    customStyles: `
      .invite-code {
        background: #1f2937;
        color: white;
        padding: 20px;
        border-radius: 8px;
        text-align: center;
        margin: 25px 0;
        font-family: 'Courier New', monospace;
      }
      
      .invite-code span {
        font-size: 24px;
        font-weight: bold;
        letter-spacing: 2px;
      }
    `,
  },
  {
    id: "welcome-email",
    name: "E-mail de Boas-vindas",
    category: "Transacional",
    description: "Email de boas-vindas para novos usuários",
    subject: "Bem-vindo ao StorySpark! 🚀",
    headerTitle: "Bem-vindo ao StorySpark! 🚀",
    headerSubtitle: "Sua jornada para criar copies incríveis começa agora",
    content: `
      <div class="content">
        <p>Olá <strong>{{userName}}</strong>!</p>
        
        <p>É com grande alegria que damos as boas-vindas ao StorySpark! Você agora faz parte de uma comunidade que está revolucionando a criação de conteúdo com inteligência artificial.</p>
        
        <div class="info-box">
          <h3 style="margin: 0 0 15px 0; color: #0c4a6e; font-size: 18px; font-weight: 600;">🎯 Primeiros Passos</h3>
          <p style="margin: 0; color: #0c4a6e;">
            1. Complete seu perfil<br>
            2. Explore nossos templates<br>
            3. Crie sua primeira copy
          </p>
        </div>
        
        <p>Para começar, acesse sua conta e explore todas as funcionalidades que preparamos para você:</p>
        
        <div class="cta-container">
          <a href="{{accountUrl}}" class="cta-button">Acessar Minha Conta</a>
        </div>
        
        <p>Se você tiver alguma dúvida ou precisar de ajuda, nossa equipe está sempre disponível em <a href="mailto:{{supportEmail}}" style="color: #f97316;">{{supportEmail}}</a>.</p>
        
        <p style="margin-top: 30px;">
          Vamos criar algo incrível juntos!<br>
          <strong>Equipe StorySpark</strong>
        </p>
      </div>
    `,
    textContent: `Bem-vindo ao StorySpark! 🚀

Olá {{userName}}!

É com grande alegria que damos as boas-vindas ao StorySpark! Você agora faz parte de uma comunidade que está revolucionando a criação de conteúdo com inteligência artificial.

🎯 Primeiros Passos:
1. Complete seu perfil
2. Explore nossos templates  
3. Crie sua primeira copy

Para começar, acesse sua conta: {{accountUrl}}

Se você tiver alguma dúvida ou precisar de ajuda, nossa equipe está sempre disponível em {{supportEmail}}.

Vamos criar algo incrível juntos!
Equipe StorySpark

© 2024 StorySpark. Todos os direitos reservados.`,
  },
  {
    id: "newsletter-promocional",
    name: "Newsletter Promocional",
    category: "Marketing",
    description: "Template para newsletters promocionais e ofertas especiais",
    subject:
      "🎯 Oferta Especial: {{discountPercentage}} OFF em {{productName}}!",
    headerTitle: "🎯 Oferta Especial para Você!",
    headerSubtitle: "Não perca esta oportunidade única",
    content: `
      <div class="content">
        <p>Olá <strong>{{userName}}</strong>!</p>
        
        <p>Temos uma oferta especial preparada especialmente para você!</p>
        
        <div class="highlight-box">
          <h3 style="margin: 0 0 15px 0; color: #92400e; font-size: 20px; font-weight: 600;">🔥 {{discountPercentage}} OFF</h3>
          <p style="margin: 0; color: #92400e; font-size: 18px; font-weight: 600;">{{productName}}</p>
        </div>
        
        <p><strong>{{productDescription}}</strong></p>
        
        <p>Use o código promocional:</p>
        <div style="background: #f97316; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <span style="font-size: 20px; font-weight: bold; letter-spacing: 1px;">{{discountCode}}</span>
        </div>
        
        <div class="cta-container">
          <a href="{{promotionUrl}}" class="cta-button">Aproveitar Oferta</a>
        </div>
        
        <p style="color: #dc2626; font-weight: 600;">⏰ Oferta válida por tempo limitado!</p>
        
        <p>Não perca esta oportunidade de transformar sua estratégia de conteúdo.</p>
        
        <p style="margin-top: 30px;">
          Atenciosamente,<br>
          <strong>Equipe StorySpark</strong>
        </p>
      </div>
    `,
    textContent: `🎯 Oferta Especial para Você!

Olá {{userName}}!

Temos uma oferta especial preparada especialmente para você!

🔥 {{discountPercentage}} OFF
{{productName}}

{{productDescription}}

Use o código promocional: {{discountCode}}

Aproveitar oferta: {{promotionUrl}}

⏰ Oferta válida por tempo limitado!

Não perca esta oportunidade de transformar sua estratégia de conteúdo.

Atenciosamente,
Equipe StorySpark

© 2024 StorySpark. Todos os direitos reservados.`,
  },
  {
    id: "order-confirmation",
    name: "Confirmação de Pedido",
    category: "Transacional",
    description: "Template para confirmação de pedidos e compras",
    subject: "Pedido confirmado #{{orderNumber}} - StorySpark",
    headerTitle: "Pedido Confirmado! ✅",
    headerSubtitle: "Obrigado pela sua compra",
    content: `
      <div class="content">
        <div class="success-box">
          <h3 style="margin: 0 0 10px 0; color: #15803d; font-size: 18px; font-weight: 600;">✅ Pedido Confirmado</h3>
          <p style="margin: 0; color: #15803d;">Pedido #{{orderNumber}} confirmado com sucesso!</p>
        </div>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #f97316;">
          <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px; font-weight: 600;">Detalhes do Pedido</h3>
          <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
            <span>Número do Pedido:</span>
            <span><strong>{{orderNumber}}</strong></span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
            <span>Data do Pedido:</span>
            <span>{{orderDate}}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 15px 0 0 0; font-weight: bold; border-top: 2px solid #f97316; margin-top: 10px;">
            <span>Total:</span>
            <span><strong>{{orderTotal}}</strong></span>
          </div>
        </div>
        
        <div class="cta-container">
          <a href="{{orderUrl}}" class="cta-button">Ver Detalhes do Pedido</a>
        </div>
        
        <p>Seu pedido está sendo processado e você receberá uma confirmação em breve.</p>
        
        <p>Se você tiver alguma dúvida sobre seu pedido, entre em contato conosco em <a href="mailto:{{supportEmail}}" style="color: #f97316;">{{supportEmail}}</a>.</p>
        
        <p style="margin-top: 30px;">
          Atenciosamente,<br>
          <strong>Equipe StorySpark</strong>
        </p>
      </div>
    `,
    textContent: `Pedido Confirmado #{{orderNumber}}

Olá,

Seu pedido foi confirmado com sucesso!

Detalhes do Pedido:
- Número: {{orderNumber}}
- Data: {{orderDate}}
- Total: {{orderTotal}}

Ver detalhes: {{orderUrl}}

Seu pedido está sendo processado e você receberá uma confirmação em breve.

Se você tiver alguma dúvida sobre seu pedido, entre em contato conosco em {{supportEmail}}.

Atenciosamente,
Equipe StorySpark

© 2024 StorySpark. Todos os direitos reservados.`,
  },
];

export const updateDatabaseTemplates = async (): Promise<void> => {
  console.log("🔄 Iniciando atualização de templates no banco de dados...");

  for (const template of templateConversions) {
    try {
      // Gerar HTML usando o brandedEmailTemplate
      const htmlContent = brandedEmailTemplate({
        headerTitle: template.headerTitle,
        headerSubtitle: template.headerSubtitle,
        content: template.content,
        customStyles: template.customStyles,
      });

      // Buscar template existente
      const { data: existingTemplate, error: fetchError } = await supabase
        .from("templates")
        .select("*")
        .eq("name", template.name)
        .eq("type", "EMAIL")
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error(`Erro ao buscar template ${template.name}:`, fetchError);
        continue;
      }

      const templateData = {
        name: template.name,
        type: "EMAIL" as const,
        category: template.category,
        description: template.description,
        subject: template.subject,
        content: htmlContent,
        text_content: template.textContent,
        is_public: true,
        template_variables: extractVariables(
          template.content + template.subject
        ),
        user_id: null, // Templates públicos não precisam de user_id
        workspace_id: "public", // Workspace público para templates padrão
        metadata: {
          email_template_id: template.id,
          migrated_from_code: true,
          migration_date: new Date().toISOString(),
          uses_branded_template: true,
          header_title: template.headerTitle,
          header_subtitle: template.headerSubtitle,
          custom_styles: template.customStyles,
        },
      };

      if (existingTemplate) {
        // Atualizar template existente
        const { error: updateError } = await supabase
          .from("templates")
          .update(templateData)
          .eq("id", existingTemplate.id);

        if (updateError) {
          console.error(
            `Erro ao atualizar template ${template.name}:`,
            updateError
          );
        } else {
          console.log(`✅ Template ${template.name} atualizado com sucesso`);
        }
      } else {
        // Criar novo template
        const { error: insertError } = await supabase
          .from("templates")
          .insert(templateData);

        if (insertError) {
          console.error(
            `Erro ao criar template ${template.name}:`,
            insertError
          );
        } else {
          console.log(`✅ Template ${template.name} criado com sucesso`);
        }
      }
    } catch (error) {
      console.error(`Erro ao processar template ${template.name}:`, error);
    }
  }

  console.log("🎉 Atualização de templates concluída!");
};

// Função para extrair variáveis de um template
const extractVariables = (content: string): string[] => {
  const variableRegex = /\{\{([^}]+)\}\}/g;
  const variables: string[] = [];
  let match;

  while ((match = variableRegex.exec(content)) !== null) {
    const variable = match[1].trim();
    if (!variables.includes(variable)) {
      variables.push(variable);
    }
  }

  return variables;
};

export { templateConversions };
