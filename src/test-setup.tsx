import React from 'react';
import { vi } from 'vitest';
import { supabase } from '@/lib/supabase';

// Mock global para Supabase em testes
vi.mock('@/lib/supabase', () => ({
    supabase: {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
        rpc: vi.fn().mockResolvedValue({ data: [], error: null }),
        auth: {
            getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user' } }, error: null }),
            getSession: vi.fn().mockResolvedValue({ data: { session: { user: { id: 'test-user' } } }, error: null }),
            signInWithPassword: vi.fn().mockResolvedValue({ data: null, error: null }),
            signUp: vi.fn().mockResolvedValue({ data: null, error: null }),
            signOut: vi.fn().mockResolvedValue({ error: null }),
        },
    },
}));

// Mock para React Router em testes
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: vi.fn(),
        useLocation: () => ({ pathname: '/' }),
        BrowserRouter: ({ children }: { children: React.ReactNode }) => React.createElement('div', null, children),
        Routes: ({ children }: { children: React.ReactNode }) => React.createElement('div', null, children),
        Route: ({ children }: { children: React.ReactNode }) => React.createElement('div', null, children),
        MemoryRouter: ({ children }: { children: React.ReactNode }) => React.createElement('div', null, children),
    };
});

// Mock para AuthProvider
vi.mock('@/components/auth/AuthProvider', () => ({
    AuthProvider: ({ children, value }: { children: React.ReactNode; value: any }) => React.createElement('div', null, children),
    useAuth: vi.fn(() => value || { user: null }),
}));

// Mock para Lucide icons
vi.mock('lucide-react', () => ({
    Home: () => React.createElement('div', { 'data-testid': 'icon-home' }),
    Bot: () => React.createElement('div', { 'data-testid': 'icon-bot' }),
    Mic: () => React.createElement('div', { 'data-testid': 'icon-mic' }),
    Upload: () => React.createElement('div', { 'data-testid': 'icon-upload' }),
    History: () => React.createElement('div', { 'data-testid': 'icon-history' }),
    Search: () => React.createElement('div', { 'data-testid': 'icon-search' }),
    Filter: () => React.createElement('div', { 'data-testid': 'icon-filter' }),
    Download: () => React.createElement('div', { 'data-testid': 'icon-download' }),
    // Adicionar todos os icons usados no app
    BarChart3: () => React.createElement('div', { 'data-testid': 'icon-barchart3' }),
    Calendar: () => React.createElement('div', { 'data-testid': 'icon-calendar' }),
    FileText: () => React.createElement('div', { 'data-testid': 'icon-filetext' }),
    Puzzle: () => React.createElement('div', { 'data-testid': 'icon-puzzle' }),
    Settings: () => React.createElement('div', { 'data-testid': 'icon-settings' }),
    Sparkles: () => React.createElement('div', { 'data-testid': 'icon-sparkles' }),
    Users: () => React.createElement('div', { 'data-testid': 'icon-users' }),
    Zap: () => React.createElement('div', { 'data-testid': 'icon-zap' }),
    Flame: () => React.createElement('div', { 'data-testid': 'icon-flame' }),
    CreditCard: () => React.createElement('div', { 'data-testid': 'icon-creditcard' }),
    Target: () => React.createElement('div', { 'data-testid': 'icon-target' }),
    Send: () => React.createElement('div', { 'data-testid': 'icon-send' }),
    Share2: () => React.createElement('div', { 'data-testid': 'icon-share2' }),
    Globe: () => React.createElement('div', { 'data-testid': 'icon-globe' }),
    MessageSquare: () => React.createElement('div', { 'data-testid': 'icon-messagesquare' }),
    TrendingUp: () => React.createElement('div', { 'data-testid': 'icon-trendingup' }),
    Lightbulb: () => React.createElement('div', { 'data-testid': 'icon-lightbulb' }),
    TestTube: () => React.createElement('div', { 'data-testid': 'icon-testtube' }),
    Library: () => React.createElement('div', { 'data-testid': 'icon-library' }),
    Shield: () => React.createElement('div', { 'data-testid': 'icon-shield' }),
    UserCog: () => React.createElement('div', { 'data-testid': 'icon-usercog' }),
    Database: () => React.createElement('div', { 'data-testid': 'icon-database' }),
    Phone: () => React.createElement('div', { 'data-testid': 'icon-phone' }),
    Crown: () => React.createElement('div', { 'data-testid': 'icon-crown' }),
    ChevronDown: () => React.createElement('div', { 'data-testid': 'icon-chevron-down' }),
    ChevronRight: () => React.createElement('div', { 'data-testid': 'icon-chevron-right' }),
    Key: () => React.createElement('div', { 'data-testid': 'icon-key' }),
    Mail: () => React.createElement('div', { 'data-testid': 'icon-mail' }),
    Activity: () => React.createElement('div', { 'data-testid': 'icon-activity' }),
}));