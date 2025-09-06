// Dados simulados para demonstração
// Será substituído pelo Supabase quando conectado

export interface User {
  id: string;
  email: string;
  name: string;
  plan: 'starter' | 'pro' | 'business';
  createdAt: Date;
}

export interface Credit {
  id: string;
  userId: string;
  delta: number;
  reason: string;
  refId?: string;
  createdAt: Date;
}

export interface GeneratedCopy {
  id: string;
  userId: string;
  templateId: string;
  inputText: string;
  tone: string;
  outputText: string;
  tokensIn?: number;
  tokensOut?: number;
  costCents?: number;
  createdAt: Date;
}

// Mock storage
class MockStorage {
  private users: Map<string, User> = new Map();
  private credits: Credit[] = [];
  private copies: GeneratedCopy[] = [];
  private currentUserId: string = 'user-1'; // Mock logged user

  constructor() {
    // Initialize with mock user
    this.users.set('user-1', {
      id: 'user-1',
      email: 'user@storyspark.app',
      name: 'Usuário Demo',
      plan: 'starter',
      createdAt: new Date()
    });

    // Initial credits
    this.credits.push({
      id: 'credit-1',
      userId: 'user-1',
      delta: 20,
      reason: 'signup_bonus',
      createdAt: new Date()
    });
  }

  getCurrentUser(): User | null {
    return this.users.get(this.currentUserId) || null;
  }

  getCreditsBalance(userId: string = this.currentUserId): number {
    return this.credits
      .filter(c => c.userId === userId)
      .reduce((sum, c) => sum + c.delta, 0);
  }

  addCredits(delta: number, reason: string, refId?: string): void {
    this.credits.push({
      id: `credit-${Date.now()}`,
      userId: this.currentUserId,
      delta,
      reason,
      refId,
      createdAt: new Date()
    });
  }

  saveGeneration(data: {
    templateId: string;
    inputText: string;
    tone: string;
    outputText: string;
    tokensIn?: number;
    tokensOut?: number;
    costCents?: number;
  }): void {
    this.copies.push({
      id: `copy-${Date.now()}`,
      userId: this.currentUserId,
      ...data,
      createdAt: new Date()
    });
    
    // Debit 1 credit
    this.addCredits(-1, 'generation', `copy-${Date.now()}`);
  }

  getGenerations(userId: string = this.currentUserId): GeneratedCopy[] {
    return this.copies
      .filter(c => c.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getStats(userId: string = this.currentUserId) {
    const generations = this.getGenerations(userId);
    const templates = new Set(generations.map(g => g.templateId));
    
    return {
      creditsRemaining: this.getCreditsBalance(userId),
      copiesGenerated: generations.length,
      templatesUsed: templates.size,
      averageTime: generations.length > 0 ? '8s' : '-',
      lastGeneration: generations[0]?.createdAt || null
    };
  }

  getCreditHistory(userId: string = this.currentUserId): Credit[] {
    return this.credits
      .filter(c => c.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

// Export singleton instance
export const mockStorage = new MockStorage();

// Mock AI generation function (simulates OpenAI API)
export const mockGenerateContent = async (params: {
  templateId: string;
  inputText: string;
  tone: string;
}): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const templates: Record<string, string[]> = {
    'ig-legenda-viral': [
      '🚀 Transforme sua presença digital agora!\n\nDica quente para hoje: foque no benefício, não na feature.\n\n✨ Comece hoje e veja a diferença\n\n#marketing #resultados',
    ],
    'twitter-hook-polemico': [
      'A maioria falha por ignorar uma regra simples:\n\nFoque no problema, não na solução.\n\nSeu cliente compra transformação, não features.'
    ]
  };

  const variations = templates[params.templateId] || [
    `Copy gerada para ${params.templateId} com tom ${params.tone}:\n\n${params.inputText}\n\n✅ Resultado otimizado!`
  ];

  return variations[Math.floor(Math.random() * variations.length)];
};

