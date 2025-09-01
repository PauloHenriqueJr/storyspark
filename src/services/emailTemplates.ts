/**
 * Templates de E-mail para StorySpark
 * Utilizando o sistema de templates do Mailtrap
 */

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  variables: Record<string, any>;
  html: string;
  text: string;
}

export interface TemplateVariables {
  [key: string]: string | number | boolean;
}

/**
 * Template para confirmação da waitlist
 */
export const waitlistConfirmationTemplate: EmailTemplate = {
  id: 'waitlist-confirmation',
  name: 'Confirmação da Waitlist',
  subject: 'Obrigado por se juntar à nossa waitlist! 🎉',
  variables: {
    userEmail: '',
    selectedIdeas: '',
    waitlistPosition: '',
    supportEmail: 'suporte@storyspark.com'
  },
  html: `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmação da Waitlist - StorySpark</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8fafc;
        }
        .container {
          background: white;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #f97316;
          margin-bottom: 10px;
        }
        .title {
          font-size: 24px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 10px;
        }
        .subtitle {
          color: #6b7280;
          font-size: 16px;
        }
        .content {
          margin: 30px 0;
        }
        .highlight-box {
          background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
          color: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          margin: 25px 0;
        }
        .position-number {
          font-size: 32px;
          font-weight: bold;
          margin: 10px 0;
        }
        .ideas-section {
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
          margin: 25px 0;
          border-left: 4px solid #f97316;
        }
        .idea-item {
          background: white;
          padding: 10px 15px;
          margin: 8px 0;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
        }
        .benefits {
          margin: 30px 0;
        }
        .benefit {
          display: flex;
          align-items: center;
          margin: 15px 0;
          padding: 10px;
          background: #f8fafc;
          border-radius: 6px;
        }
        .benefit-icon {
          width: 20px;
          height: 20px;
          margin-right: 12px;
          color: #f97316;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }
        .social-links {
          margin: 20px 0;
        }
        .social-links a {
          color: #f97316;
          text-decoration: none;
          margin: 0 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">StorySpark</div>
          <h1 class="title">Bem-vindo à nossa waitlist! 🎉</h1>
          <p class="subtitle">Sua inscrição foi confirmada com sucesso</p>
        </div>
        
        <div class="content">
          <p>Olá,</p>
          
          <p>Obrigado por se juntar à waitlist do StorySpark! Estamos muito animados em tê-lo conosco na jornada para revolucionar a criação de copies com IA.</p>
          
          <div class="highlight-box">
            <p style="margin: 0; font-size: 16px;">Sua posição na waitlist:</p>
            <div class="position-number">#{{waitlistPosition}}</div>
            <p style="margin: 0; font-size: 14px; opacity: 0.9;">Você está cada vez mais perto do acesso!</p>
          </div>
          
          {{#if selectedIdeas}}
          <div class="ideas-section">
            <h3 style="color: #1f2937; margin-bottom: 15px;">💡 Suas ideias selecionadas:</h3>
            <p style="color: #6b7280; margin-bottom: 15px;">Obrigado por compartilhar seus interesses! Isso nos ajuda a priorizar as funcionalidades mais importantes.</p>
            {{selectedIdeas}}
          </div>
          {{/if}}
          
          <div class="benefits">
            <h3 style="color: #1f2937; margin-bottom: 20px;">O que esperar do StorySpark:</h3>
            
            <div class="benefit">
              <span class="benefit-icon">🤖</span>
              <span>IA avançada para criação de copies persuasivos</span>
            </div>
            
            <div class="benefit">
              <span class="benefit-icon">⚡</span>
              <span>Geração de conteúdo em segundos</span>
            </div>
            
            <div class="benefit">
              <span class="benefit-icon">🎯</span>
              <span>Templates otimizados para conversão</span>
            </div>
            
            <div class="benefit">
              <span class="benefit-icon">📊</span>
              <span>Analytics e insights de performance</span>
            </div>
            
            <div class="benefit">
              <span class="benefit-icon">🚀</span>
              <span>Integração com principais plataformas</span>
            </div>
          </div>
          
          <p><strong>Próximos passos:</strong></p>
          <ul style="color: #6b7280;">
            <li>Manteremos você atualizado sobre nosso progresso</li>
            <li>Você receberá acesso prioritário quando lançarmos</li>
            <li>Compartilharemos dicas e conteúdos exclusivos</li>
          </ul>
          
          <p>Enquanto isso, fique de olho em seu e-mail para atualizações importantes!</p>
          
          <p>Se você tiver alguma dúvida, nossa equipe está sempre disponível em <a href="mailto:{{supportEmail}}" style="color: #f97316;">{{supportEmail}}</a>.</p>
          
          <p style="margin-top: 30px;">
            Atenciosamente,<br>
            <strong>Equipe StorySpark</strong>
          </p>
        </div>
        
        <div class="footer">
          <div class="social-links">
            <a href="#">Website</a> |
            <a href="#">Blog</a> |
            <a href="#">Suporte</a>
          </div>
          <p>© 2024 StorySpark. Todos os direitos reservados.</p>
          <p style="font-size: 12px; margin-top: 10px;">
            Você está recebendo este e-mail porque se inscreveu em nossa waitlist.
            <a href="#" style="color: #f97316;">Cancelar inscrição</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `,
  text: `
    Bem-vindo à waitlist do StorySpark!
    
    Olá,
    
    Obrigado por se juntar à waitlist do StorySpark! Estamos muito animados em tê-lo conosco na jornada para revolucionar a criação de copies com IA.
    
    Sua posição na waitlist: #{{waitlistPosition}}
    
    {{#if selectedIdeas}}
    Suas ideias selecionadas:
    {{selectedIdeas}}
    {{/if}}
    
    O que esperar do StorySpark:
    🤖 IA avançada para criação de copies persuasivos
    ⚡ Geração de conteúdo em segundos
    🎯 Templates otimizados para conversão
    📊 Analytics e insights de performance
    🚀 Integração com principais plataformas
    
    Próximos passos:
    - Manteremos você atualizado sobre nosso progresso
    - Você receberá acesso prioritário quando lançarmos
    - Compartilharemos dicas e conteúdos exclusivos
    
    Enquanto isso, fique de olho em seu e-mail para atualizações importantes!
    
    Se você tiver alguma dúvida, nossa equipe está sempre disponível em {{supportEmail}}.
    
    Atenciosamente,
    Equipe StorySpark
    
    © 2024 StorySpark. Todos os direitos reservados.
  `
};

/**
 * Template para convite da waitlist
 */
export const waitlistInviteTemplate: EmailTemplate = {
  id: 'waitlist-invite',
  name: 'Convite da Waitlist',
  subject: 'Bem-vindo ao StorySpark! Sua conta está pronta 🚀',
  variables: {
    userName: '',
    inviteCode: '',
    loginUrl: '',
    supportEmail: 'suporte@storyspark.com'
  },
  html: `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bem-vindo ao StorySpark</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8fafc;
        }
        .container {
          background: white;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #f97316;
          margin-bottom: 10px;
        }
        .title {
          font-size: 24px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 10px;
        }
        .subtitle {
          color: #6b7280;
          font-size: 16px;
        }
        .content {
          margin: 30px 0;
        }
        .highlight-box {
          background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
          color: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          margin: 25px 0;
        }
        .invite-code {
          font-size: 20px;
          font-weight: bold;
          letter-spacing: 2px;
          margin: 10px 0;
        }
        .cta-button {
          display: inline-block;
          background: #f97316;
          color: white;
          padding: 14px 28px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          margin: 20px 0;
          transition: background-color 0.3s;
        }
        .cta-button:hover {
          background: #ea580c;
        }
        .features {
          margin: 30px 0;
        }
        .feature {
          display: flex;
          align-items: center;
          margin: 15px 0;
          padding: 10px;
          background: #f8fafc;
          border-radius: 6px;
        }
        .feature-icon {
          width: 20px;
          height: 20px;
          margin-right: 12px;
          color: #f97316;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }
        .social-links {
          margin: 20px 0;
        }
        .social-links a {
          color: #f97316;
          text-decoration: none;
          margin: 0 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">StorySpark</div>
          <h1 class="title">Bem-vindo ao futuro do marketing!</h1>
          <p class="subtitle">Sua conta está pronta para criar copies incríveis com IA</p>
        </div>
        
        <div class="content">
          <p>Olá <strong>{{userName}}</strong>,</p>
          
          <p>Estamos muito animados em tê-lo conosco! Você saiu da waitlist e sua conta no StorySpark está oficialmente ativa.</p>
          
          <div class="highlight-box">
            <p style="margin: 0; font-size: 16px;">Seu código de convite:</p>
            <div class="invite-code">{{inviteCode}}</div>
            <p style="margin: 0; font-size: 14px; opacity: 0.9;">Use este código para ativar recursos premium</p>
          </div>
          
          <div style="text-align: center;">
            <a href="{{loginUrl}}" class="cta-button">Acessar Minha Conta</a>
          </div>
          
          <div class="features">
            <h3 style="color: #1f2937; margin-bottom: 20px;">O que você pode fazer agora:</h3>
            
            <div class="feature">
              <span class="feature-icon">✨</span>
              <span>Criar copies persuasivos com IA avançada</span>
            </div>
            
            <div class="feature">
              <span class="feature-icon">🎯</span>
              <span>Gerenciar campanhas de marketing digital</span>
            </div>
            
            <div class="feature">
              <span class="feature-icon">📊</span>
              <span>Analisar performance e otimizar resultados</span>
            </div>
            
            <div class="feature">
              <span class="feature-icon">🚀</span>
              <span>Acessar templates profissionais prontos</span>
            </div>
          </div>
          
          <p>Se você tiver alguma dúvida ou precisar de ajuda, nossa equipe está sempre disponível em <a href="mailto:{{supportEmail}}" style="color: #f97316;">{{supportEmail}}</a>.</p>
          
          <p>Vamos criar algo incrível juntos!</p>
          
          <p style="margin-top: 30px;">
            Atenciosamente,<br>
            <strong>Equipe StorySpark</strong>
          </p>
        </div>
        
        <div class="footer">
          <div class="social-links">
            <a href="#">Website</a> |
            <a href="#">Blog</a> |
            <a href="#">Suporte</a>
          </div>
          <p>© 2024 StorySpark. Todos os direitos reservados.</p>
          <p style="font-size: 12px; margin-top: 10px;">
            Você está recebendo este e-mail porque se inscreveu em nossa waitlist.
            <a href="#" style="color: #f97316;">Cancelar inscrição</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `,
  text: `
    Bem-vindo ao StorySpark!
    
    Olá {{userName}},
    
    Estamos muito animados em tê-lo conosco! Você saiu da waitlist e sua conta no StorySpark está oficialmente ativa.
    
    Seu código de convite: {{inviteCode}}
    
    Acesse sua conta em: {{loginUrl}}
    
    O que você pode fazer agora:
    ✨ Criar copies persuasivos com IA avançada
    🎯 Gerenciar campanhas de marketing digital
    📊 Analisar performance e otimizar resultados
    🚀 Acessar templates profissionais prontos
    
    Se você tiver alguma dúvida ou precisar de ajuda, nossa equipe está sempre disponível em {{supportEmail}}.
    
    Vamos criar algo incrível juntos!
    
    Atenciosamente,
    Equipe StorySpark
    
    © 2024 StorySpark. Todos os direitos reservados.
  `
};

/**
 * Template para e-mail de boas-vindas
 */
export const welcomeTemplate: EmailTemplate = {
  id: 'welcome',
  name: 'Boas-vindas',
  subject: 'Bem-vindo ao StorySpark! Vamos começar? 🎉',
  variables: {
    userName: '',
    dashboardUrl: '',
    tutorialUrl: '',
    supportEmail: 'suporte@storyspark.com'
  },
  html: `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bem-vindo ao StorySpark</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8fafc;
        }
        .container {
          background: white;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #f97316;
          margin-bottom: 10px;
        }
        .title {
          font-size: 24px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 10px;
        }
        .cta-button {
          display: inline-block;
          background: #f97316;
          color: white;
          padding: 14px 28px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          margin: 20px 10px;
          transition: background-color 0.3s;
        }
        .cta-button.secondary {
          background: #6b7280;
        }
        .steps {
          margin: 30px 0;
        }
        .step {
          display: flex;
          align-items: flex-start;
          margin: 20px 0;
          padding: 15px;
          background: #f8fafc;
          border-radius: 8px;
          border-left: 4px solid #f97316;
        }
        .step-number {
          background: #f97316;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
          margin-right: 15px;
          flex-shrink: 0;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">StorySpark</div>
          <h1 class="title">Bem-vindo, {{userName}}! 🎉</h1>
          <p>Estamos animados para ajudá-lo a criar copies incríveis</p>
        </div>
        
        <div class="content">
          <p>Parabéns por se juntar ao StorySpark! Você agora tem acesso à plataforma mais avançada para criação de copies com IA.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{dashboardUrl}}" class="cta-button">Ir para o Dashboard</a>
            <a href="{{tutorialUrl}}" class="cta-button secondary">Ver Tutorial</a>
          </div>
          
          <div class="steps">
            <h3 style="color: #1f2937; margin-bottom: 20px;">Primeiros passos:</h3>
            
            <div class="step">
              <div class="step-number">1</div>
              <div>
                <h4 style="margin: 0 0 5px 0; color: #1f2937;">Complete seu perfil</h4>
                <p style="margin: 0; color: #6b7280;">Adicione informações sobre seu negócio para copies mais personalizados</p>
              </div>
            </div>
            
            <div class="step">
              <div class="step-number">2</div>
              <div>
                <h4 style="margin: 0 0 5px 0; color: #1f2937;">Explore os templates</h4>
                <p style="margin: 0; color: #6b7280;">Descubra templates prontos para diferentes tipos de campanhas</p>
              </div>
            </div>
            
            <div class="step">
              <div class="step-number">3</div>
              <div>
                <h4 style="margin: 0 0 5px 0; color: #1f2937;">Crie sua primeira copy</h4>
                <p style="margin: 0; color: #6b7280;">Use nossa IA para gerar copies persuasivos em segundos</p>
              </div>
            </div>
          </div>
          
          <p>Se precisar de ajuda, nossa equipe está sempre disponível em <a href="mailto:{{supportEmail}}" style="color: #f97316;">{{supportEmail}}</a>.</p>
          
          <p style="margin-top: 30px;">
            Vamos criar algo incrível juntos!<br>
            <strong>Equipe StorySpark</strong>
          </p>
        </div>
        
        <div class="footer">
          <p>© 2024 StorySpark. Todos os direitos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `,
  text: `
    Bem-vindo ao StorySpark!
    
    Olá {{userName}},
    
    Parabéns por se juntar ao StorySpark! Você agora tem acesso à plataforma mais avançada para criação de copies com IA.
    
    Acesse seu dashboard: {{dashboardUrl}}
    Ver tutorial: {{tutorialUrl}}
    
    Primeiros passos:
    1. Complete seu perfil - Adicione informações sobre seu negócio
    2. Explore os templates - Descubra templates prontos para campanhas
    3. Crie sua primeira copy - Use nossa IA para gerar copies persuasivos
    
    Se precisar de ajuda, nossa equipe está sempre disponível em {{supportEmail}}.
    
    Vamos criar algo incrível juntos!
    
    Equipe StorySpark
    
    © 2024 StorySpark. Todos os direitos reservados.
  `
};

/**
 * Template para notificação de teste
 */
export const testTemplate: EmailTemplate = {
  id: 'test',
  name: 'E-mail de Teste',
  subject: 'Teste de Configuração - StorySpark',
  variables: {
    testDate: '',
    configStatus: ''
  },
  html: `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Teste de Configuração</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8fafc;
        }
        .container {
          background: white;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #f97316;
          margin-bottom: 10px;
        }
        .status-box {
          background: #dcfce7;
          border: 1px solid #16a34a;
          color: #15803d;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          margin: 25px 0;
        }
        .check-list {
          margin: 20px 0;
        }
        .check-item {
          display: flex;
          align-items: center;
          margin: 10px 0;
          padding: 8px;
        }
        .check-icon {
          color: #16a34a;
          margin-right: 10px;
          font-weight: bold;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">StorySpark</div>
          <h1 style="color: #1f2937;">Teste de Configuração</h1>
        </div>
        
        <div class="content">
          <div class="status-box">
            <h3 style="margin: 0 0 10px 0;">✅ Configuração Funcionando!</h3>
            <p style="margin: 0;">O serviço de e-mail está configurado corretamente</p>
          </div>
          
          <p>Este é um e-mail de teste para verificar se a configuração do Mailtrap está funcionando corretamente.</p>
          
          <div class="check-list">
            <p><strong>Status da verificação:</strong></p>
            <div class="check-item">
              <span class="check-icon">✅</span>
              <span>Token da API do Mailtrap está correto</span>
            </div>
            <div class="check-item">
              <span class="check-icon">✅</span>
              <span>Account ID está configurado adequadamente</span>
            </div>
            <div class="check-item">
              <span class="check-icon">✅</span>
              <span>Serviço de e-mail está funcionando</span>
            </div>
            <div class="check-item">
              <span class="check-icon">✅</span>
              <span>Templates de e-mail carregados com sucesso</span>
            </div>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            <strong>Enviado em:</strong> {{testDate}}<br>
            <strong>Status:</strong> {{configStatus}}
          </p>
        </div>
        
        <div class="footer">
          <p>© 2024 StorySpark. Todos os direitos reservados.</p>
          <p style="font-size: 12px;">Este é um e-mail automático de teste do sistema.</p>
        </div>
      </div>
    </body>
    </html>
  `,
  text: `
    Teste de Configuração - StorySpark
    
    ✅ Configuração Funcionando!
    
    Este é um e-mail de teste para verificar se a configuração do Mailtrap está funcionando corretamente.
    
    Status da verificação:
    ✅ Token da API do Mailtrap está correto
    ✅ Account ID está configurado adequadamente
    ✅ Serviço de e-mail está funcionando
    ✅ Templates de e-mail carregados com sucesso
    
    Enviado em: {{testDate}}
    Status: {{configStatus}}
    
    © 2024 StorySpark. Todos os direitos reservados.
  `
};

/**
 * Função para processar variáveis em templates
 */
export function processTemplate(template: EmailTemplate, variables: TemplateVariables): {
  subject: string;
  html: string;
  text: string;
} {
  let processedSubject = template.subject;
  let processedHtml = template.html;
  let processedText = template.text;
  
  // Substituir variáveis no formato {{variableName}}
  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    const stringValue = String(value);
    
    processedSubject = processedSubject.replace(new RegExp(placeholder, 'g'), stringValue);
    processedHtml = processedHtml.replace(new RegExp(placeholder, 'g'), stringValue);
    processedText = processedText.replace(new RegExp(placeholder, 'g'), stringValue);
  });
  
  return {
    subject: processedSubject,
    html: processedHtml,
    text: processedText
  };
}

/**
 * Função para obter template por ID
 */
export function getTemplate(templateId: string): EmailTemplate | null {
  const templates = {
    'waitlist-confirmation': waitlistConfirmationTemplate,
    'waitlist-invite': waitlistInviteTemplate,
    'welcome': welcomeTemplate,
    'test': testTemplate
  };
  
  return templates[templateId as keyof typeof templates] || null;
}

/**
 * Função para listar todos os templates disponíveis
 */
export function getAllTemplates(): EmailTemplate[] {
  return [
    waitlistConfirmationTemplate,
    waitlistInviteTemplate,
    welcomeTemplate,
    testTemplate
  ];
}

/**
 * Função para validar variáveis obrigatórias
 */
export function validateTemplateVariables(template: EmailTemplate, variables: TemplateVariables): {
  isValid: boolean;
  missingVariables: string[];
} {
  const requiredVariables = Object.keys(template.variables);
  const providedVariables = Object.keys(variables);
  const missingVariables = requiredVariables.filter(required => 
    !providedVariables.includes(required) || 
    variables[required] === undefined || 
    variables[required] === null || 
    variables[required] === ''
  );
  
  return {
    isValid: missingVariables.length === 0,
    missingVariables
  };
}
