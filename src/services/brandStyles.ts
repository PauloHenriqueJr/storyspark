/**
 * Estilos e configurações da marca StorySpark para emails
 */

export interface BrandConfig {
  companyName: string;
  primaryColor: string;
  secondaryColor: string;
  logoText: string;
  website: string;
  supportEmail: string;
  unsubscribeUrl: string;
  preferencesUrl: string;
}

export const defaultBrandConfig: BrandConfig = {
  companyName: "StorySpark",
  primaryColor: "#f97316", // Orange-500
  secondaryColor: "#fb923c", // Orange-400
  logoText: "StorySpark",
  website: "https://www.storyspark.com.br",
  supportEmail: "suporte@storyspark.com.br",
  unsubscribeUrl: "#unsubscribe",
  preferencesUrl: "#preferences",
};

/**
 * CSS base da marca para emails
 */
export const getBrandEmailCSS = (config: BrandConfig = defaultBrandConfig) => `
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
    color: ${config.primaryColor} !important;
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
    background: linear-gradient(135deg, ${config.primaryColor} 0%, ${config.secondaryColor} 100%) !important;
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
    background: linear-gradient(135deg, ${config.primaryColor} 0%, ${config.secondaryColor} 100%) !important;
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
    color: ${config.primaryColor} !important;
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
    color: ${config.primaryColor} !important;
    text-decoration: none;
  }
  
  .brand-footer a:hover {
    text-decoration: underline;
  }
  
  .social-links {
    margin: 20px 0;
  }
  
  .social-links a {
    color: ${config.primaryColor} !important;
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
`;

/**
 * Rodapé padrão da marca
 */
export const getBrandFooter = (config: BrandConfig = defaultBrandConfig) => `
  <div class="brand-footer">
    <div class="social-links">
      <a href="${config.website}">Website</a> |
      <a href="${config.website}/blog">Blog</a> |
      <a href="mailto:${config.supportEmail}">Suporte</a>
    </div>
    <p>© 2024 ${config.companyName}. Todos os direitos reservados.</p>
    <p class="unsubscribe-text">
      Você está recebendo este e-mail porque se inscreveu em nossa waitlist.
      <a href="${config.unsubscribeUrl}">Cancelar inscrição</a>
    </p>
  </div>
`;

/**
 * Header padrão da marca
 */
export const getBrandHeader = (
  title: string,
  subtitle?: string,
  config: BrandConfig = defaultBrandConfig
) => `
  <div class="brand-header">
    <div class="brand-logo">${config.logoText}</div>
    <h1 class="brand-title">${title}</h1>
    ${subtitle ? `<p class="brand-subtitle">${subtitle}</p>` : ""}
  </div>
`;

/**
 * Template base com a estrutura da marca
 */
export const getBrandEmailTemplate = (
  title: string,
  content: string,
  subtitle?: string,
  config: BrandConfig = defaultBrandConfig
) => `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>${title} - ${config.companyName}</title>
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
    ${getBrandEmailCSS(config)}
  </style>
</head>
<body>
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
    <tr>
      <td style="padding: 20px 0;">
        <table class="email-container" role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
          <tr>
            <td class="content-wrapper">
              ${getBrandHeader(title, subtitle, config)}
              
              <div class="content">
                ${content}
              </div>
              
              ${getBrandFooter(config)}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

/**
 * Aplicar estilos da marca a um HTML existente
 */
export const applyBrandStyles = (
  htmlContent: string,
  config: BrandConfig = defaultBrandConfig
): string => {
  // Se já tem estrutura HTML completa, apenas injeta o CSS
  if (htmlContent.includes("<html") && htmlContent.includes("<head")) {
    return htmlContent.replace(
      /<style[^>]*>[\s\S]*?<\/style>/g,
      `<style>${getBrandEmailCSS(config)}</style>`
    );
  }

  // Se é apenas conteúdo, wrappa com a estrutura da marca
  return getBrandEmailTemplate("Email", htmlContent, undefined, config);
};
