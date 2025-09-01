const e={companyName:"StorySpark",primaryColor:"#f97316",secondaryColor:"#fb923c",logoText:"StorySpark",website:"https://storyspark.com",supportEmail:"suporte@storyspark.com",unsubscribeUrl:"#unsubscribe",preferencesUrl:"#preferences"},l=(a=e)=>`
  /* Reset e base */
  body, table, td, p, a, li, blockquote {
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
  }
  
  table, td {
    mso-table-lspace: 0pt;
    mso-table-rspace: 0pt;
  }
  
  img {
    -ms-interpolation-mode: bicubic;
    border: 0;
    height: auto;
    line-height: 100%;
    outline: none;
    text-decoration: none;
  }
  
  /* Estilos da marca StorySpark */
  body {
    margin: 0 !important;
    padding: 0 !important;
    background-color: #f8fafc !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', Arial, sans-serif !important;
    font-size: 16px;
    line-height: 1.6;
    color: #374151 !important;
  }
  
  /* Container principal */
  .email-container {
    max-width: 600px;
    margin: 0 auto;
    background-color: #ffffff !important;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }
  
  .content-wrapper {
    padding: 40px 30px;
  }
  
  /* Header com marca */
  .brand-header {
    text-align: center;
    margin-bottom: 30px;
  }
  
  .brand-logo {
    font-size: 28px;
    font-weight: bold;
    color: ${a.primaryColor} !important;
    margin-bottom: 10px;
    text-decoration: none;
    display: inline-block;
  }
  
  .brand-title {
    font-size: 24px;
    font-weight: 600;
    color: #1f2937 !important;
    margin: 10px 0;
    line-height: 1.3;
  }
  
  .brand-subtitle {
    color: #6b7280 !important;
    font-size: 16px;
    margin: 0;
  }
  
  /* Elementos de conteúdo */
  .content p {
    margin: 16px 0;
    color: #374151 !important;
  }
  
  .highlight-box {
    background: linear-gradient(135deg, ${a.primaryColor} 0%, ${a.secondaryColor} 100%) !important;
    color: #ffffff !important;
    padding: 25px 20px;
    border-radius: 12px;
    text-align: center;
    margin: 30px 0;
  }
  
  .highlight-box h3 {
    margin: 0 0 10px 0;
    color: #ffffff !important;
    font-size: 20px;
    font-weight: 600;
  }
  
  .highlight-box p {
    margin: 0;
    font-size: 16px;
    color: #ffffff !important;
  }
  
  /* Botões CTA */
  .cta-container {
    text-align: center;
    margin: 30px 0;
  }
  
  .cta-button {
    display: inline-block;
    background: linear-gradient(135deg, ${a.primaryColor} 0%, ${a.secondaryColor} 100%) !important;
    color: #ffffff !important;
    padding: 16px 32px;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 16px;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
    transition: all 0.3s ease;
  }
  
  .cta-button:hover {
    background: linear-gradient(135deg, #ea580c 0%, #dc2626 100%) !important;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(249, 115, 22, 0.4);
  }
  
  /* Seções de features/benefícios */
  .features-section {
    margin: 30px 0;
  }
  
  .feature {
    display: flex;
    align-items: center;
    margin: 15px 0;
    padding: 10px;
    background: #f8fafc !important;
    border-radius: 6px;
  }
  
  .feature-icon {
    width: 20px;
    height: 20px;
    margin-right: 12px;
    color: ${a.primaryColor} !important;
    font-size: 16px;
  }
  
  /* Código de convite/destaque */
  .invite-code {
    font-size: 20px;
    font-weight: bold;
    letter-spacing: 2px;
    margin: 10px 0;
    color: #ffffff !important;
    font-family: 'Courier New', monospace;
  }
  
  /* Rodapé padrão da marca */
  .brand-footer {
    margin-top: 40px;
    padding: 30px;
    background-color: #f7fafc !important;
    border-top: 1px solid #e5e7eb;
    text-align: center;
    color: #6b7280 !important;
    font-size: 14px;
  }
  
  .brand-footer p {
    margin: 8px 0;
    color: #6b7280 !important;
  }
  
  .brand-footer a {
    color: ${a.primaryColor} !important;
    text-decoration: none;
  }
  
  .brand-footer a:hover {
    text-decoration: underline;
  }
  
  .social-links {
    margin: 20px 0;
  }
  
  .social-links a {
    color: ${a.primaryColor} !important;
    text-decoration: none;
    margin: 0 10px;
  }
  
  .unsubscribe-text {
    font-size: 12px;
    margin-top: 10px;
    color: #9ca3af !important;
  }
  
  /* Responsive */
  @media only screen and (max-width: 600px) {
    .email-container {
      width: 100% !important;
      margin: 10px !important;
    }
    
    .content-wrapper {
      padding: 20px 15px !important;
    }
    
    .brand-title {
      font-size: 20px !important;
    }
    
    .brand-logo {
      font-size: 24px !important;
    }
    
    .cta-button {
      padding: 14px 24px !important;
      font-size: 14px !important;
    }
    
    .highlight-box {
      padding: 20px 15px !important;
    }
    
    .brand-footer {
      padding: 25px 20px !important;
    }
  }
  
  /* Dark mode support para clientes que suportam */
  @media (prefers-color-scheme: dark) {
    .email-container {
      background-color: #1f2937 !important;
    }
    
    .content-wrapper {
      background-color: #1f2937 !important;
    }
    
    .content p {
      color: #e5e7eb !important;
    }
    
    .brand-title {
      color: #f9fafb !important;
    }
    
    .brand-subtitle {
      color: #d1d5db !important;
    }
    
    .feature {
      background-color: #2d3748 !important;
    }
    
    .brand-footer {
      background-color: #2d3748 !important;
      border-top-color: #374151 !important;
    }
    
    .brand-footer p {
      color: #9ca3af !important;
    }
  }
`,c=(a=e)=>`
  <div class="brand-footer">
    <div class="social-links">
      <a href="${a.website}">Website</a> |
      <a href="${a.website}/blog">Blog</a> |
      <a href="mailto:${a.supportEmail}">Suporte</a>
    </div>
    <p>© 2024 ${a.companyName}. Todos os direitos reservados.</p>
    <p class="unsubscribe-text">
      Você está recebendo este e-mail porque se inscreveu em nossa waitlist.
      <a href="${a.unsubscribeUrl}">Cancelar inscrição</a>
    </p>
  </div>
`,m=(a,o,r=e)=>`
  <div class="brand-header">
    <div class="brand-logo">${r.logoText}</div>
    <h1 class="brand-title">${a}</h1>
    ${o?`<p class="brand-subtitle">${o}</p>`:""}
  </div>
`,i=(a,o,r,t=e)=>`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>${a} - ${t.companyName}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    ${l(t)}
  </style>
</head>
<body>
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
    <tr>
      <td style="padding: 20px 0;">
        <table class="email-container" role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
          <tr>
            <td class="content-wrapper">
              ${m(a,r,t)}
              
              <div class="content">
                ${o}
              </div>
              
              ${c(t)}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`,s={id:"waitlist-confirmation",name:"Confirmação da Waitlist",subject:"Obrigado por se juntar à nossa waitlist! 🎉",variables:{userEmail:"",selectedIdeas:"",waitlistPosition:"",supportEmail:"suporte@storyspark.com"},html:i("Bem-vindo à nossa waitlist! 🎉",`
      <p>Olá,</p>
      
      <p>Obrigado por se juntar à waitlist do StorySpark! Estamos muito animados em tê-lo conosco na jornada para revolucionar a criação de copies com IA.</p>
      
      <div class="highlight-box">
        <p style="margin: 0; font-size: 16px;">Sua posição na waitlist:</p>
        <div class="invite-code">#{{waitlistPosition}}</div>
        <p style="margin: 0; font-size: 14px; opacity: 0.9;">Você está cada vez mais perto do acesso!</p>
      </div>
      
      {{#if selectedIdeas}}
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid ${e.primaryColor};">
        <h3 style="color: #1f2937; margin-bottom: 15px;">💡 Suas ideias selecionadas:</h3>
        <p style="color: #6b7280; margin-bottom: 15px;">Obrigado por compartilhar seus interesses! Isso nos ajuda a priorizar as funcionalidades mais importantes.</p>
        {{selectedIdeas}}
      </div>
      {{/if}}
      
      <div class="features-section">
        <h3 style="color: #1f2937; margin-bottom: 20px; text-align: center;">O que esperar do StorySpark:</h3>
        
        <div class="feature">
          <span class="feature-icon">🤖</span>
          <span>IA avançada para criação de copies persuasivos</span>
        </div>
        
        <div class="feature">
          <span class="feature-icon">⚡</span>
          <span>Geração de conteúdo em segundos</span>
        </div>
        
        <div class="feature">
          <span class="feature-icon">🎯</span>
          <span>Templates otimizados para conversão</span>
        </div>
        
        <div class="feature">
          <span class="feature-icon">📊</span>
          <span>Analytics e insights de performance</span>
        </div>
        
        <div class="feature">
          <span class="feature-icon">🚀</span>
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
      
      <p>Se você tiver alguma dúvida, nossa equipe está sempre disponível em <a href="mailto:{{supportEmail}}" style="color: ${e.primaryColor};">{{supportEmail}}</a>.</p>
      
      <p style="margin-top: 30px; text-align: center;">
        Atenciosamente,<br>
        <strong>Equipe StorySpark</strong>
      </p>
    `,"Sua inscrição foi confirmada com sucesso",e),text:`
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
  `},n={id:"waitlist-invite",name:"Convite da Waitlist",subject:"Bem-vindo ao StorySpark! Sua conta está pronta 🚀",variables:{userName:"",inviteCode:"",loginUrl:"",supportEmail:"suporte@storyspark.com"},html:i("Bem-vindo ao futuro do marketing!",`
      <p>Olá <strong>{{userName}}</strong>,</p>
      
      <p>Estamos muito animados em tê-lo conosco! Você saiu da waitlist e sua conta no StorySpark está oficialmente ativa.</p>
      
      <div class="highlight-box">
        <p style="margin: 0; font-size: 16px;">Seu código de convite:</p>
        <div class="invite-code">{{inviteCode}}</div>
        <p style="margin: 0; font-size: 14px; opacity: 0.9;">Use este código para ativar recursos premium</p>
      </div>
      
      <div class="cta-container">
        <a href="{{loginUrl}}" class="cta-button">Acessar Minha Conta</a>
      </div>
      
      <div class="features-section">
        <h3 style="color: #1f2937; margin-bottom: 20px; text-align: center;">O que você pode fazer agora:</h3>
        
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
      
      <p>Se você tiver alguma dúvida ou precisar de ajuda, nossa equipe está sempre disponível em <a href="mailto:{{supportEmail}}" style="color: ${e.primaryColor};">{{supportEmail}}</a>.</p>
      
      <p>Vamos criar algo incrível juntos!</p>
      
      <p style="margin-top: 30px; text-align: center;">
        Atenciosamente,<br>
        <strong>Equipe StorySpark</strong>
      </p>
    `,"Sua conta está pronta para criar copies incríveis com IA",e),text:`
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
  `},p={id:"welcome",name:"Boas-vindas",subject:"Bem-vindo ao StorySpark! Vamos começar? 🎉",variables:{userName:"",dashboardUrl:"",tutorialUrl:"",supportEmail:"suporte@storyspark.com"},html:`
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
  `,text:`
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
  `},d={id:"test",name:"E-mail de Teste",subject:"Teste de Configuração - StorySpark",variables:{testDate:"",configStatus:""},html:`
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
  `,text:`
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
  `};function u(a){return{"waitlist-confirmation":s,"waitlist-invite":n,welcome:p,test:d}[a]||null}function g(){return[s,n,p,d]}export{g as getAllTemplates,u as getTemplate,d as testTemplate,s as waitlistConfirmationTemplate,n as waitlistInviteTemplate,p as welcomeTemplate};
