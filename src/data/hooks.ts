export interface Hook {
  id: string
  category: 'Curiosidade' | 'Autoridade' | 'Urgência' | 'Storytelling' | 'Prova Social'
  text: string
  example: string
  tags?: string[]
}

export const hooks: Hook[] = [
  // CURIOSIDADE
  {
    id: "curiosity_1",
    category: "Curiosidade",
    text: "Você sabia que {nicho} pode aumentar {benefício} em {tempo}?",
    example: "Você sabia que posts com storytelling podem dobrar o engajamento em 7 dias?",
    tags: ["pergunta", "estatística", "descoberta"]
  },
  {
    id: "curiosity_2", 
    category: "Curiosidade",
    text: "O que acontece quando você {ação} por {tempo}?",
    example: "O que acontece quando você posta conteúdo todos os dias por 30 dias?",
    tags: ["experimento", "curiosidade", "tempo"]
  },
  {
    id: "curiosity_3",
    category: "Curiosidade", 
    text: "Por que {número}% das pessoas falha em {objetivo}?",
    example: "Por que 90% das pessoas falha em construir uma audiência online?",
    tags: ["estadística", "falha", "problema"]
  },
  {
    id: "curiosity_4",
    category: "Curiosidade",
    text: "Existe um segredo que {nicho} não quer que você saiba...",
    example: "Existe um segredo que grandes influencers não querem que você saiba...",
    tags: ["segredo", "revelação", "exclusivo"]
  },
  {
    id: "curiosity_5",
    category: "Curiosidade",
    text: "Como {resultado} pode mudar sua {área} para sempre?",
    example: "Como uma simples mudança de mindset pode mudar sua carreira para sempre?",
    tags: ["transformação", "mudança", "impacto"]
  },

  // AUTORIDADE
  {
    id: "authority_1",
    category: "Autoridade", 
    text: "Depois de {tempo} trabalhando com {nicho}, descobri que...",
    example: "Depois de 10 anos trabalhando com marketing digital, descobri que...",
    tags: ["experiência", "expertise", "descoberta"]
  },
  {
    id: "authority_2",
    category: "Autoridade",
    text: "Como alguém que já {conquista}, posso te garantir que...",
    example: "Como alguém que já gerou mais de R$ 1M online, posso te garantir que...",
    tags: ["credencial", "garantia", "experiência"]
  },
  {
    id: "authority_3", 
    category: "Autoridade",
    text: "Nos últimos {tempo}, ajudei {número} pessoas a {resultado}",
    example: "Nos últimos 5 anos, ajudei mais de 1000 pessoas a construir seus negócios digitais",
    tags: ["resultados", "clientes", "impacto"]
  },
  {
    id: "authority_4",
    category: "Autoridade",
    text: "Antes de você {ação}, precisa saber o que aprendi em {tempo} de {área}",
    example: "Antes de você investir em tráfego pago, precisa saber o que aprendi em 8 anos de marketing digital",
    tags: ["aviso", "experiência", "conselho"]
  },
  {
    id: "authority_5",
    category: "Autoridade", 
    text: "{Número} erros que vejo constantemente em {nicho} (e como evitar)",
    example: "5 erros que vejo constantemente em estratégias de conteúdo (e como evitar)",
    tags: ["erros", "lista", "solução"]
  },

  // URGÊNCIA
  {
    id: "urgency_1",
    category: "Urgência",
    text: "Só até {data}: {oferta} com {desconto}% de desconto",  
    example: "Só até sexta-feira: Curso completo com 50% de desconto",
    tags: ["prazo", "oferta", "desconto"]
  },
  {
    id: "urgency_2",
    category: "Urgência",
    text: "Últimas {número} vagas para {produto} (acaba em {tempo})",
    example: "Últimas 10 vagas para a mentoria exclusiva (acaba em 48h)",
    tags: ["escassez", "vagas", "prazo"]
  },
  {
    id: "urgency_3",
    category: "Urgência", 
    text: "Se você não {ação} agora, vai perder a chance de {benefício}",
    example: "Se você não começar agora, vai perder a chance de sair na frente da concorrência",
    tags: ["perda", "oportunidade", "agora"]
  },
  {
    id: "urgency_4",
    category: "Urgência",
    text: "Por que {tempo} é o momento perfeito para {ação}?",
    example: "Por que 2024 é o momento perfeito para criar seu negócio digital?",
    tags: ["timing", "oportunidade", "momento"]
  },
  {
    id: "urgency_5", 
    category: "Urgência",
    text: "Atenção: {situação} está prestes a mudar {área} para sempre",
    example: "Atenção: a nova legislação está prestes a mudar o marketing digital para sempre",
    tags: ["atenção", "mudança", "impacto"]
  },

  // STORYTELLING
  {
    id: "story_1",
    category: "Storytelling",
    text: "Era {tempo} quando eu {situação}. Hoje, {resultado}.",
    example: "Era 2019 quando eu tinha apenas 50 seguidores. Hoje, mais de 100k pessoas acompanham nosso conteúdo.",
    tags: ["antes-depois", "transformação", "jornada"]
  },
  {
    id: "story_2",
    category: "Storytelling", 
    text: "Lembro como se fosse ontem: {situação}. Foi aí que tudo mudou...",
    example: "Lembro como se fosse ontem: meu primeiro produto digital vendeu apenas 3 unidades. Foi aí que tudo mudou...",
    tags: ["memória", "ponto-virada", "mudança"]
  },
  {
    id: "story_3",
    category: "Storytelling",
    text: "A história que vou contar pode chocar você, mas aconteceu comigo em {local}",
    example: "A história que vou contar pode chocar você, mas aconteceu comigo em uma reunião com clientes",
    tags: ["choque", "real", "experiência"]
  },
  {
    id: "story_4", 
    category: "Storytelling",
    text: "Nunca vou esquecer o dia em que {evento}. Mudou minha visão sobre {tema}",
    example: "Nunca vou esquecer o dia em que perdi meu maior cliente. Mudou minha visão sobre relacionamentos comerciais",
    tags: ["marco", "aprendizado", "mudança"]
  },
  {
    id: "story_5",
    category: "Storytelling",
    text: "Se alguém me dissesse em {tempo} que eu {situação atual}, eu riria...",
    example: "Se alguém me dissesse em 2020 que eu teria uma empresa de 7 dígitos, eu riria...",
    tags: ["incredulidade", "crescimento", "evolução"]
  },

  // PROVA SOCIAL
  {
    id: "social_1",
    category: "Prova Social",
    text: "{Número} pessoas já {ação} com {produto/serviço}",
    example: "Mais de 5.000 pessoas já transformaram seus negócios com nosso método",
    tags: ["números", "transformação", "método"]
  },
  {
    id: "social_2",
    category: "Prova Social",
    text: "Ontem recebi esta mensagem de um cliente: '{depoimento}'",
    example: "Ontem recebi esta mensagem de um cliente: 'Em 60 dias triplicou meu faturamento'",
    tags: ["depoimento", "resultado", "cliente"]
  },
  {
    id: "social_3",
    category: "Prova Social", 
    text: "Por que {número} empresas escolheram nossa {solução} em {tempo}?",
    example: "Por que mais de 500 empresas escolheram nossa consultoria em 2023?",
    tags: ["escolha", "empresas", "preferência"]
  },
  {
    id: "social_4",
    category: "Prova Social",
    text: "Não sou eu quem diz, são os {número} casos de sucesso que comprovam:",
    example: "Não sou eu quem diz, são os 300 casos de sucesso que comprovam:",
    tags: ["prova", "casos", "resultados"]
  },
  {
    id: "social_5", 
    category: "Prova Social",
    text: "O que {número} clientes têm em comum? Todos {resultado}",
    example: "O que 1.200 clientes têm em comum? Todos dobraram sua receita em 6 meses",
    tags: ["padrão", "comum", "resultado"]
  },

  // HOOKS ADICIONAIS PARA CADA CATEGORIA

  // Mais Curiosidade
  {
    id: "curiosity_6",
    category: "Curiosidade",
    text: "Todo mundo fala sobre {tema}, mas ninguém te conta {verdade}",
    example: "Todo mundo fala sobre empreendedorismo, mas ninguém te conta sobre as noites sem dormir",
    tags: ["verdade", "realidade", "contraste"]
  },
  {
    id: "curiosity_7", 
    category: "Curiosidade",
    text: "O que {pessoa famosa} fez diferente para {conquista}?",
    example: "O que Elon Musk fez diferente para revolucionar 3 indústrias ao mesmo tempo?",
    tags: ["diferencial", "sucesso", "referência"]
  },
  {
    id: "curiosity_8",
    category: "Curiosidade",
    text: "Você já se perguntou por que {nicho} {ação} e ninguém fala sobre isso?",
    example: "Você já se perguntou por que designers de sucesso cobram 5x mais e ninguém fala sobre isso?",
    tags: ["pergunta", "misterioso", "revelação"]
  },
  {
    id: "curiosity_9",
    category: "Curiosidade",
    text: "O segredo que {nicho} esconde sobre {tema} pode mudar tudo para você",
    example: "O segredo que empreendedores de sucesso escondem sobre produtividade pode mudar tudo para você",
    tags: ["segredo", "revelação", "transformação"]
  },
  {
    id: "curiosity_10",
    category: "Curiosidade",
    text: "Por que {número}% dos {nicho} falham em {ação}? A resposta vai surpreendê-lo",
    example: "Por que 95% dos vendedores falham em fechar grandes negócios? A resposta vai surpreendê-lo",
    tags: ["estatística", "falha", "surpresa"]
  },

  // Mais Autoridade
  {
    id: "authority_6",
    category: "Autoridade",
    text: "Depois de analisar {número} {casos/dados}, uma coisa ficou clara:",
    example: "Depois de analisar mais de 1000 campanhas de marketing, uma coisa ficou clara:",
    tags: ["análise", "dados", "conclusão"]
  },
  {
    id: "authority_7",
    category: "Autoridade", 
    text: "Como especialista em {área}, vejo {problema} se repetindo constantemente",
    example: "Como especialista em vendas, vejo o mesmo erro se repetindo constantemente",
    tags: ["especialista", "padrão", "problema"]
  },
  {
    id: "authority_8",
    category: "Autoridade",
    text: "Se você já tentou {ação} e falhou, provavelmente cometeu {erro}",
    example: "Se você já tentou vender mais e falhou, provavelmente cometeu esses 3 erros básicos",
    tags: ["experiência", "erros", "aprendizado"]
  },
  {
    id: "authority_9",
    category: "Autoridade",
    text: "Na minha jornada de {tempo} como {profissão}, aprendi que {lição}",
    example: "Na minha jornada de 15 anos como copywriter, aprendi que a emoção vende mais que a lógica",
    tags: ["jornada", "experiência", "lição"]
  },
  {
    id: "authority_10",
    category: "Autoridade",
    text: "Como {cargo} na {empresa}, posso te mostrar como {ação} sem {dor}",
    example: "Como CMO na maior empresa do setor, posso te mostrar como escalar sem estressar sua equipe",
    tags: ["cargo", "empresa", "solução"]
  },

  // Mais Urgência  
  {
    id: "urgency_6",
    category: "Urgência",
    text: "ATENÇÃO: {situação} pode acabar com sua {área} se você não {ação}",
    example: "ATENÇÃO: a concorrência pode acabar com sua empresa se você não inovar agora",
    tags: ["alerta", "risco", "ação"]
  },
  {
    id: "urgency_7",
    category: "Urgência",
    text: "Você tem {tempo} para {decisão} antes que seja tarde demais",
    example: "Você tem 24 horas para decidir seu futuro antes que seja tarde demais",
    tags: ["prazo", "decisão", "consequência"]
  },
  {
    id: "urgency_8",
    category: "Urgência",
    text: "Esta oferta expira em {tempo} - depois disso, o preço sobe para {valor}",
    example: "Esta oferta expira em 2 horas - depois disso, o preço sobe para R$ 1997",
    tags: ["oferta", "prazo", "preço"]
  },
  {
    id: "urgency_9",
    category: "Urgência",
    text: "Com a nova {regulamentação/tecnologia}, você tem até {data} para {ação}",
    example: "Com a nova LGPD, você tem até dezembro para adequar seu funil",
    tags: ["regulamentação", "prazo", "ação"]
  },
  {
    id: "urgency_10",
    category: "Urgência",
    text: "Só hoje: {desconto}% de desconto em {produto} + {bônus}",
    example: "Só hoje: 60% de desconto no curso completo + 3 bônus exclusivos",
    tags: ["oferta", "desconto", "bônus"]
  },

  // Mais Storytelling
  {
    id: "story_6", 
    category: "Storytelling",
    text: "Você já se sentiu {emoção} quando {situação}? Eu também...",
    example: "Você já se sentiu perdido quando todos ao seu redor pareciam ter sucesso? Eu também...",
    tags: ["empatia", "conexão", "sentimento"]
  },
  {
    id: "story_7",
    category: "Storytelling",
    text: "Esta é a história de como {situação} me ensinou {lição}",
    example: "Esta é a história de como perder tudo me ensinou o verdadeiro valor do dinheiro",
    tags: ["lição", "aprendizado", "história"]
  },
  {
    id: "story_8",
    category: "Storytelling",
    text: "Quando {evento} aconteceu, pensei que era {fim}. Mas então {virada}",
    example: "Quando meu negócio quebrou, pensei que era o fim da minha carreira. Mas então conheci o método que mudou tudo",
    tags: ["virada", "transformação", "esperança"]
  },
  {
    id: "story_9",
    category: "Storytelling",
    text: "Minha maior derrota se tornou meu maior {vitória/conquista}",
    example: "Minha maior derrota se tornou meu maior aprendizado como líder",
    tags: ["derrota", "vitória", "transformação"]
  },
  {
    id: "story_10",
    category: "Storytelling",
    text: "Se eu soubesse {informação} em {tempo}, teria evitado {consequência}",
    example: "Se eu soubesse dessa estratégia em 2020, teria evitado perder R$ 50 mil",
    tags: ["aprendizado", "retrospectiva", "dica"]
  },

  // Mais Prova Social
  {
    id: "social_6",
    category: "Prova Social", 
    text: "Resultado real: cliente {nome} conseguiu {resultado} em apenas {tempo}",
    example: "Resultado real: cliente Maria conseguiu 10x mais leads em apenas 30 dias",
    tags: ["real", "específico", "rápido"]
  },
  {
    id: "social_7",
    category: "Prova Social",
    text: "Este post já foi compartilhado {número} vezes. Quer saber por quê?",
    example: "Este post já foi compartilhado mais de 5000 vezes. Quer saber por quê?",
    tags: ["viral", "curiosidade", "engajamento"]
  },
  {
    id: "social_8",
    category: "Prova Social",
    text: "Veja o que {número} profissionais dizem sobre {produto/método}",
    example: "Veja o que 200 profissionais dizem sobre nosso método de copywriting",
    tags: ["aprovação", "profissionais", "produto"]
  },
  {
    id: "social_9",
    category: "Prova Social",
    text: "De {número} alunos, {porcentagem}% alcançaram {resultado}",
    example: "De 1500 alunos, 92% alcançaram resultados em menos de 60 dias",
    tags: ["estatística", "sucesso", "tempo"]
  },
  {
    id: "social_10",
    category: "Prova Social",
    text: "{Cargo} da {empresa} compartilha resultados inéditos de {ação}",
    example: "Diretor de Marketing da Magazine Luiza compartilha resultados inéditos da nova estratégia",
    tags: ["autoridade", "empresa", "resultados"]
  },

  // Mais hooks para completar nossa biblioteca com 300+ hooks

  // Curiosidade - Continuação
  {
    id: "curiosity_11",
    category: "Curiosidade",
    text: "O que {nicho} não quer que você saiba sobre {tema} pode te custar {consequência}",
    example: "O que vendedores não querem que você saiba sobre negociação pode te custar milhões",
    tags: ["segredo", "custo", "revelação"]
  },
  {
    id: "curiosity_12",
    category: "Curiosidade",
    text: "Por que {número}% dos {nicho} estão errados sobre {tema}?",
    example: "Por que 80% dos empreendedores estão errados sobre produtividade?",
    tags: ["erro", "estatística", "má prática"]
  },

  // Autoridade - Continuação
  {
    id: "authority_11",
    category: "Autoridade",
    text: "Como {cargo} na {empresa}, vejo {nicho} cometer {erro} todos os dias",
    example: "Como CEO na maior empresa de educação do país, vejo empreendedores cometer o mesmo erro todos os dias",
    tags: ["cargo", "observação", "erro"]
  },
  {
    id: "authority_12",
    category: "Autoridade",
    text: "Após {tempo} estudando {tema}, descobri o verdadeiro {segredo}",
    example: "Após 10 anos estudando psicologia do consumidor, descobri o verdadeiro segredo da persuasão",
    tags: ["estudo", "descoberta", "segredo"]
  },

  // Urgência - Continuação
  {
    id: "urgency_11",
    category: "Urgência",
    text: "Preço aumenta em {tempo}: {desconto}% OFF agora ou pague {valor}",
    example: "Preço aumenta em 4 horas: 70% OFF agora ou pague o valor integral",
    tags: ["prazo", "desconto", "urgência"]
  },
  {
    id: "urgency_12",
    category: "Urgência",
    text: "Última chance: {evento} acontece só {data} e {número} vagas restantes",
    example: "Última chance: Workshop acontece só amanhã e 3 vagas restantes",
    tags: ["última chance", "evento", "escassez"]
  },

  // Storytelling - Continuação
  {
    id: "story_11",
    category: "Storytelling",
    text: "Era uma vez {personagem} que {situação}. Mas tudo mudou quando {virada}",
    example: "Era uma vez um designer que estava falindo. Mas tudo mudou quando descobriu essa técnica",
    tags: ["narrativa", "transformação", "virada"]
  },
  {
    id: "story_12",
    category: "Storytelling",
    text: "Se {evento} não tivesse acontecido, eu nunca teria descoberto {segredo}",
    example: "Se meu primeiro negócio não tivesse falido, eu nunca teria descoberto o segredo da escala",
    tags: ["experiência", "descoberta", "segredo"]
  },

  // Prova Social - Continuação
  {
    id: "social_11",
    category: "Prova Social",
    text: "{Número} depoimentos não mentem: {resultado}",
    example: "2500 depoimentos não mentem: método que triplica conversões",
    tags: ["depoimentos", "prova", "resultado"]
  },
  {
    id: "social_12",
    category: "Prova Social",
    text: "Veja por que {empresa/nicho} confia em {produto/serviço}",
    example: "Veja por que 500 marcas confiam em nossa plataforma de automação",
    tags: ["confiança", "empresas", "produto"]
  }
]

export const getHooksByCategory = (category: Hook['category']) => {
  return hooks.filter(hook => hook.category === category)
}

export const searchHooks = (query: string) => {
  const lowerQuery = query.toLowerCase()
  return hooks.filter(hook => 
    hook.text.toLowerCase().includes(lowerQuery) ||
    hook.example.toLowerCase().includes(lowerQuery) ||
    hook.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
}

export const getHookById = (id: string) => {
  return hooks.find(hook => hook.id === id)
}

export const categories: Hook['category'][] = [
  'Curiosidade',
  'Autoridade', 
  'Urgência',
  'Storytelling',
  'Prova Social'
]