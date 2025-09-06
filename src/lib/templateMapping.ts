// Legacy to Brazilian Template Mapping
// Maps old template IDs to new Brazilian template IDs

export function mapLegacyToBrazilian(templateId: string): string | null {
  const mapping: Record<string, string> = {
    // Social Media mappings
    'ig-legenda-curta': 'ig-legenda-viral',
    'ig-carrossel': 'carrossel-educativo',
    'twitter-hook': 'twitter-hook-polemico',
    'linkedin-post': 'linkedin-autoridade-b2b',
    
    // Paid Ads mappings
    'anuncio-performance': 'anuncio-meta-google',
    'facebook-ad': 'anuncio-meta-google',
    'google-ad': 'anuncio-meta-google',
    
    // Email mappings
    'email-marketing': 'email-marketing-br',
    'newsletter': 'email-marketing-br',
    'captacao-lead': 'email-marketing-br',
    
    // E-commerce mappings
    'produto-descricao': 'whatsapp-vendas',
    'cta-loja': 'whatsapp-vendas',
    'whatsapp-business': 'whatsapp-vendas',
    
    // Professional mappings
    'bio-marca': 'linkedin-autoridade-b2b',
    'linkedin-company': 'linkedin-autoridade-b2b',
    
    // Educational mappings
    'tutorial-post': 'carrossel-educativo',
    'dicas-rapidas': 'carrossel-educativo',
    
    // Video mappings
    'video-sales': 'vsl-roteiro',
    'youtube-script': 'vsl-roteiro'
  };

  return mapping[templateId] || null;
}

export function getMappingInfo(templateId: string): {
  found: boolean;
  brazilianId: string | null;
  message: string;
} {
  const brazilianId = mapLegacyToBrazilian(templateId);
  
  if (brazilianId) {
    return {
      found: true,
      brazilianId,
      message: `Template mapeado com sucesso para: ${brazilianId}`
    };
  }
  
  return {
    found: false,
    brazilianId: null,
    message: `Template "${templateId}" não encontrado. Usando fluxo padrão.`
  };
}

