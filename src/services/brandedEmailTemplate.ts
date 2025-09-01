interface BrandedEmailTemplateOptions {
  headerTitle: string;
  headerSubtitle?: string;
  content: string;
  customStyles?: string;
}

export const brandedEmailTemplate = ({
  headerTitle,
  headerSubtitle,
  content,
  customStyles = "",
}: BrandedEmailTemplateOptions): string => {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${headerTitle}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #1f2937;
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
      border: 1px solid #e5e7eb;
    }
    
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #f97316;
    }
    
    .logo {
      font-size: 32px;
      font-weight: 700;
      color: #f97316;
      margin-bottom: 10px;
      letter-spacing: -0.5px;
    }
    
    .header-title {
      font-size: 24px;
      font-weight: 600;
      color: #1f2937;
      margin: 15px 0 8px 0;
    }
    
    .header-subtitle {
      font-size: 16px;
      color: #6b7280;
      margin: 0;
    }
    
    .content {
      color: #374151;
      line-height: 1.7;
    }
    
    .content h1, .content h2, .content h3 {
      color: #1f2937;
      margin-top: 25px;
      margin-bottom: 15px;
    }
    
    .content h1 {
      font-size: 24px;
      font-weight: 600;
    }
    
    .content h2 {
      font-size: 20px;
      font-weight: 600;
    }
    
    .content h3 {
      font-size: 18px;
      font-weight: 600;
    }
    
    .content p {
      margin: 15px 0;
    }
    
    .content a {
      color: #f97316;
      text-decoration: underline;
    }
    
    .content a:hover {
      color: #ea580c;
    }
    
    .cta-container {
      text-align: center;
      margin: 30px 0;
    }
    
    .cta-button {
      display: inline-block;
      background: #f97316;
      color: white !important;
      padding: 14px 28px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      transition: background-color 0.3s;
      box-shadow: 0 2px 4px rgba(249, 115, 22, 0.2);
    }
    
    .cta-button:hover {
      background: #ea580c;
      color: white !important;
    }
    
    .highlight-box {
      background: #fef3c7;
      border: 1px solid #f59e0b;
      color: #92400e;
      padding: 20px;
      border-radius: 8px;
      margin: 25px 0;
    }
    
    .info-box {
      background: #f0f9ff;
      border: 1px solid #0ea5e9;
      color: #0c4a6e;
      padding: 20px;
      border-radius: 8px;
      margin: 25px 0;
    }
    
    .success-box {
      background: #dcfce7;
      border: 1px solid #16a34a;
      color: #15803d;
      padding: 20px;
      border-radius: 8px;
      margin: 25px 0;
    }
    
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 14px;
    }
    
    .footer-logo {
      font-size: 18px;
      font-weight: 600;
      color: #f97316;
      margin-bottom: 10px;
    }
    
    .footer p {
      margin: 5px 0;
    }
    
    .footer a {
      color: #f97316;
      text-decoration: none;
    }
    
    .social-links {
      margin: 15px 0;
    }
    
    .social-links a {
      color: #6b7280;
      text-decoration: none;
      margin: 0 10px;
      font-size: 14px;
    }
    
    /* Responsividade */
    @media (max-width: 600px) {
      body {
        padding: 10px;
      }
      
      .container {
        padding: 20px;
      }
      
      .logo {
        font-size: 28px;
      }
      
      .header-title {
        font-size: 20px;
      }
      
      .cta-button {
        padding: 12px 24px;
        font-size: 14px;
      }
    }
    
    ${customStyles}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">StorySpark</div>
      <h1 class="header-title">${headerTitle}</h1>
      ${
        headerSubtitle ? `<p class="header-subtitle">${headerSubtitle}</p>` : ""
      }
    </div>
    
    ${content}
    
    <div class="footer">
      <div class="footer-logo">StorySpark</div>
      <p>Plataforma de Marketing de Conteúdo com IA</p>
      <p>© ${new Date().getFullYear()} StorySpark. Todos os direitos reservados.</p>
      <div class="social-links">
        <a href="#">Política de Privacidade</a> | 
        <a href="#">Termos de Uso</a> | 
        <a href="#">Cancelar Inscrição</a>
      </div>
    </div>
  </div>
</body>
</html>`;
};
