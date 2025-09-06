export interface Persona {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
  tone: string;
  examples?: string[];
}

export interface FunnelStage {
  id: string;
  name: string;
  description: string;
}

export const defaultPersonas: Persona[] = [
  {
    id: 'empreendedor-ambicioso',
    name: 'Empreendedor Ambicioso',
    description: 'Pessoa focada em crescimento e resultados',
    characteristics: ['Determinado', 'Focado em resultados', 'Inovador', 'Orientado a metas'],
    tone: 'motivacional'
  },
  {
    id: 'consumidor-consciente',
    name: 'Consumidor Consciente',
    description: 'Pessoa que pesquisa antes de comprar',
    characteristics: ['Analítico', 'Cauteloso', 'Busca valor', 'Compara opções'],
    tone: 'informativo'
  },
  {
    id: 'jovem-digital',
    name: 'Jovem Digital',
    description: 'Nativo digital, conectado e dinâmico',
    characteristics: ['Conectado', 'Rápido', 'Visual', 'Busca novidades'],
    tone: 'descontraído'
  },
  {
    id: 'profissional-experiente',
    name: 'Profissional Experiente',
    description: 'Pessoa estabelecida na carreira',
    characteristics: ['Experiente', 'Valoriza qualidade', 'Busca eficiência', 'Tem pouco tempo'],
    tone: 'profissional'
  }
];

export const funnelStages: FunnelStage[] = [
  {
    id: 'topo',
    name: 'Topo de Funil',
    description: 'Despertar interesse e gerar consciência'
  },
  {
    id: 'meio',
    name: 'Meio de Funil',
    description: 'Educar e nutrir o relacionamento'
  },
  {
    id: 'fundo',
    name: 'Fundo de Funil',
    description: 'Converter e fechar vendas'
  }
];

