// StorySpark - Adapters Architecture
// This allows us to swap providers easily later (Mock -> Supabase, Stripe, etc.)

import { User, Credit, GeneratedCopy, mockStorage, mockGenerateContent } from './mockData';
import { creditEvents } from './events';

// ============= INTERFACES (Contract) =============

export interface Storage {
  getCurrentUser(): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  createUser(email: string): Promise<User>;
  getCreditsBalance(userId?: string): Promise<number>;
  addCredits(delta: number, reason: string, refId?: string): Promise<void>;
  saveGeneration(data: {
    templateId: string;
    inputText: string;
    tone: string;
    outputText: string;
    tokensIn?: number;
    tokensOut?: number;
    costCents?: number;
  }): Promise<void>;
  getGenerations(userId?: string): Promise<GeneratedCopy[]>;
  getStats(userId?: string): Promise<{
    creditsRemaining: number;
    copiesGenerated: number;
    templatesUsed: number;
    averageTime: string;
    lastGeneration: Date | null;
  }>;
  getCreditHistory(userId?: string): Promise<Credit[]>;
}

export interface AIProvider {
  generateContent(params: {
    templateId: string;
    inputText: string;
    tone: string;
  }): Promise<string>;
}

export interface PaymentProvider {
  createCheckout(params: {
    email: string;
    planId: string;
  }): Promise<{ url?: string; ok?: boolean }>;
  handleWebhook?(rawBody: string, headers: Record<string, string>): Promise<void>;
  customerPortalUrl?(email: string): Promise<string>;
}

export interface EmailProvider {
  send(to: string, subject: string, html: string): Promise<void>;
}

// ============= MEMORY IMPLEMENTATIONS (SISTEMA ATUAL) =============

class MemoryStorage implements Storage {
  async getCurrentUser(): Promise<User | null> {
    return mockStorage.getCurrentUser();
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const current = mockStorage.getCurrentUser();
    if (current && current.email === email) return current;
    return null;
  }

  async createUser(email: string): Promise<User> {
    // Simple demo user creation
    return {
      id: `user-${Date.now()}`,
      email,
      name: email.split('@')[0],
      plan: 'starter',
      createdAt: new Date()
    };
  }

  async getCreditsBalance(): Promise<number> {
    return mockStorage.getCreditsBalance();
  }

  async addCredits(delta: number, reason: string, refId?: string): Promise<void> {
    mockStorage.addCredits(delta, reason, refId);
    creditEvents.updateBalance(mockStorage.getCreditsBalance());
  }

  async saveGeneration(data: {
    templateId: string;
    inputText: string;
    tone: string;
    outputText: string;
    tokensIn?: number | undefined;
    tokensOut?: number | undefined;
    costCents?: number | undefined;
  }): Promise<void> {
    mockStorage.saveGeneration(data);
    creditEvents.recordGeneration(`copy-${Date.now()}`, data.costCents ? Math.round(data.costCents / 80) : 1);
  }

  async getGenerations(): Promise<GeneratedCopy[]> {
    return mockStorage.getGenerations();
  }

  async getStats(): Promise<{
    creditsRemaining: number;
    copiesGenerated: number;
    templatesUsed: number;
    averageTime: string;
    lastGeneration: Date | null;
  }> {
    return mockStorage.getStats();
  }

  async getCreditHistory(): Promise<Credit[]> {
    return mockStorage.getCreditHistory();
  }
}

class MockAIProvider implements AIProvider {
  async generateContent(params: { templateId: string; inputText: string; tone: string; }): Promise<string> {
    return mockGenerateContent(params);
  }
}

class NullPaymentProvider implements PaymentProvider {
  async createCheckout(params: { email: string; planId: string }) {
    console.log(`Mock checkout for ${params.email}, plan: ${params.planId}`);
    // Simulate adding credits
    setTimeout(() => {
      const credits = params.planId === 'pro' ? 500 : params.planId === 'business' ? 2000 : 100;
      storage.addCredits(credits, `plan_purchase_${params.planId}`);
    }, 1000);
    return { ok: true };
  }
}

class NullEmailProvider implements EmailProvider {
  async send(to: string, subject: string, html: string) {
    console.log(`Mock email sent to ${to}: ${subject}`);
    console.log(html);
  }
}

// ============= PROVIDER INSTANCES =============
export const storage: Storage = new MemoryStorage();
export const aiProvider: AIProvider = new MockAIProvider();
export const paymentProvider: PaymentProvider = new NullPaymentProvider();
export const emailProvider: EmailProvider = new NullEmailProvider();

