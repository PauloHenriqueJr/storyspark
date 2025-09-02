import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface EmailList {
    id: string;
    name: string;
    description: string;
    subscribers: number;
    status: 'active' | 'inactive' | 'archived';
    type: 'geral' | 'segmentada' | 'premium' | 'teste' | 'vip';
    tags?: string[];
    created_at: string;
    updated_at: string;
    created_by?: string;

    // Métricas adicionais
    growth_rate?: number;
    total_sent?: number;
    avg_open_rate?: number;
    avg_click_rate?: number;
    last_campaign_sent?: string;

    // Campos calculados
    createdAt: string; // Alias para compatibilidade
    growthRate: number;
}

export interface EmailContact {
    id: string;
    email: string;
    name?: string;
    first_name?: string;
    last_name?: string;
    status: 'subscribed' | 'unsubscribed' | 'bounced' | 'complained';
    list_id: string;
    subscribed_at: string;
    unsubscribed_at?: string;
    tags?: string[];
    custom_fields?: Record<string, any>;
    created_at: string;
    updated_at: string;
}

export interface CreateListInput {
    name: string;
    description: string;
    type?: 'geral' | 'segmentada' | 'premium' | 'teste' | 'vip';
    tags?: string[];
}

export interface CreateContactInput {
    email: string;
    name?: string;
    first_name?: string;
    last_name?: string;
    list_id: string;
    tags?: string[];
    custom_fields?: Record<string, any>;
}

export interface ListStats {
    total_lists: number;
    active_lists: number;
    inactive_lists: number;
    total_subscribers: number;
    total_subscribed: number;
    total_unsubscribed: number;
    avg_growth_rate: number;
    avg_open_rate: number;
    avg_click_rate: number;
}

export const useEmailLists = () => {
    // Listas de exemplo iniciais
    const [lists, setLists] = useState<EmailList[]>([
        {
            id: '1',
            name: 'Lista Principal',
            description: 'Todos os usuários ativos da plataforma',
            subscribers: 1250,
            status: 'active',
            type: 'geral',
            tags: ['principal', 'ativo'],
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-15T10:00:00Z',
            createdAt: '2024-01-01T00:00:00Z',
            growthRate: 12.5,
            growth_rate: 12.5,
            total_sent: 2500,
            avg_open_rate: 68.5,
            avg_click_rate: 24.3,
            last_campaign_sent: '2024-01-15T10:00:00Z'
        },
        {
            id: '2',
            name: 'Novos Usuários',
            description: 'Usuários cadastrados nos últimos 30 dias',
            subscribers: 180,
            status: 'active',
            type: 'segmentada',
            tags: ['novos', 'recentes'],
            created_at: '2024-01-10T00:00:00Z',
            updated_at: '2024-01-16T08:00:00Z',
            createdAt: '2024-01-10T00:00:00Z',
            growthRate: 8.3,
            growth_rate: 8.3,
            total_sent: 540,
            avg_open_rate: 74.2,
            avg_click_rate: 28.1,
            last_campaign_sent: '2024-01-14T09:00:00Z'
        },
        {
            id: '3',
            name: 'Usuários Premium',
            description: 'Usuários com planos pagos',
            subscribers: 320,
            status: 'active',
            type: 'premium',
            tags: ['premium', 'pagos'],
            created_at: '2023-12-15T00:00:00Z',
            updated_at: '2024-01-15T15:00:00Z',
            createdAt: '2023-12-15T00:00:00Z',
            growthRate: 15.7,
            growth_rate: 15.7,
            total_sent: 960,
            avg_open_rate: 82.1,
            avg_click_rate: 35.6,
            last_campaign_sent: '2024-01-12T14:00:00Z'
        },
        {
            id: '4',
            name: 'Beta Testers',
            description: 'Usuários participantes do programa beta',
            subscribers: 85,
            status: 'active',
            type: 'teste',
            tags: ['beta', 'testers'],
            created_at: '2024-01-05T00:00:00Z',
            updated_at: '2024-01-16T12:00:00Z',
            createdAt: '2024-01-05T00:00:00Z',
            growthRate: 22.1,
            growth_rate: 22.1,
            total_sent: 255,
            avg_open_rate: 91.3,
            avg_click_rate: 42.8,
            last_campaign_sent: '2024-01-16T10:00:00Z'
        },
        {
            id: '5',
            name: 'Waitlist VIP',
            description: 'Usuários VIP da lista de espera',
            subscribers: 45,
            status: 'active',
            type: 'vip',
            tags: ['waitlist', 'vip', 'exclusivo'],
            created_at: '2024-01-08T00:00:00Z',
            updated_at: '2024-01-15T16:00:00Z',
            createdAt: '2024-01-08T00:00:00Z',
            growthRate: 18.9,
            growth_rate: 18.9,
            total_sent: 180,
            avg_open_rate: 95.8,
            avg_click_rate: 48.2,
            last_campaign_sent: '2024-01-15T08:00:00Z'
        }
    ]);

    // Contatos de exemplo
    const [contacts, setContacts] = useState<EmailContact[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<ListStats>({
        total_lists: 0,
        active_lists: 0,
        inactive_lists: 0,
        total_subscribers: 0,
        total_subscribed: 0,
        total_unsubscribed: 0,
        avg_growth_rate: 0,
        avg_open_rate: 0,
        avg_click_rate: 0,
    });

    // Carregar listas
    const loadLists = async () => {
        try {
            setLoading(true);
            setError(null);

            // Simular carregamento
            await new Promise(resolve => setTimeout(resolve, 300));

            await loadStats(lists);

        } catch (err) {
            console.error('Erro ao carregar listas:', err);
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
        } finally {
            setLoading(false);
        }
    };

    // Carregar estatísticas
    const loadStats = async (listData?: EmailList[]) => {
        try {
            const data = listData || lists;

            const calculatedStats: ListStats = {
                total_lists: data.length,
                active_lists: data.filter(l => l.status === 'active').length,
                inactive_lists: data.filter(l => l.status === 'inactive').length,
                total_subscribers: data.reduce((sum, l) => sum + l.subscribers, 0),
                total_subscribed: data.reduce((sum, l) => sum + l.subscribers, 0),
                total_unsubscribed: 0, // Seria calculado com dados reais
                avg_growth_rate: data.length > 0 ? Number((data.reduce((sum, l) => sum + (l.growth_rate || 0), 0) / data.length).toFixed(1)) : 0,
                avg_open_rate: data.length > 0 ? Number((data.reduce((sum, l) => sum + (l.avg_open_rate || 0), 0) / data.length).toFixed(1)) : 0,
                avg_click_rate: data.length > 0 ? Number((data.reduce((sum, l) => sum + (l.avg_click_rate || 0), 0) / data.length).toFixed(1)) : 0,
            };

            setStats(calculatedStats);
        } catch (err) {
            console.error('Erro ao calcular estatísticas:', err);
        }
    };

    // Criar lista
    const createList = async (input: CreateListInput): Promise<EmailList | null> => {
        try {
            const newList: EmailList = {
                id: Date.now().toString(),
                name: input.name,
                description: input.description,
                subscribers: 0,
                status: 'active',
                type: input.type || 'geral',
                tags: input.tags || [],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                growthRate: 0,
                growth_rate: 0,
                total_sent: 0,
                avg_open_rate: 0,
                avg_click_rate: 0,
            };

            setLists(prev => [newList, ...prev]);
            toast.success('Lista criada com sucesso!');
            await loadStats([newList, ...lists]);

            return newList;
        } catch (err) {
            console.error('Erro ao criar lista:', err);
            toast.error('Erro ao criar lista');
            return null;
        }
    };

    // Atualizar lista
    const updateList = async (id: string, updates: Partial<CreateListInput>): Promise<boolean> => {
        try {
            setLists(prev =>
                prev.map(list =>
                    list.id === id
                        ? { ...list, ...updates, updated_at: new Date().toISOString() }
                        : list
                )
            );

            toast.success('Lista atualizada com sucesso!');
            return true;
        } catch (err) {
            console.error('Erro ao atualizar lista:', err);
            toast.error('Erro ao atualizar lista');
            return false;
        }
    };

    // Deletar lista
    const deleteList = async (id: string): Promise<boolean> => {
        try {
            setLists(prev => prev.filter(list => list.id !== id));
            toast.success('Lista removida com sucesso!');
            return true;
        } catch (err) {
            console.error('Erro ao deletar lista:', err);
            toast.error('Erro ao deletar lista');
            return false;
        }
    };

    // Duplicar lista
    const duplicateList = async (id: string): Promise<boolean> => {
        try {
            const originalList = lists.find(l => l.id === id);
            if (!originalList) {
                toast.error('Lista não encontrada');
                return false;
            }

            const duplicatedList: EmailList = {
                ...originalList,
                id: Date.now().toString(),
                name: originalList.name + ' (Cópia)',
                subscribers: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                growthRate: 0,
                growth_rate: 0,
                total_sent: 0,
                avg_open_rate: 0,
                avg_click_rate: 0,
            };

            setLists(prev => [duplicatedList, ...prev]);
            toast.success('Lista duplicada com sucesso!');
            return true;
        } catch (err) {
            console.error('Erro ao duplicar lista:', err);
            toast.error('Erro ao duplicar lista');
            return false;
        }
    };

    // Adicionar contato
    const addContact = async (input: CreateContactInput): Promise<EmailContact | null> => {
        try {
            const newContact: EmailContact = {
                id: Date.now().toString(),
                email: input.email,
                name: input.name,
                first_name: input.first_name,
                last_name: input.last_name,
                status: 'subscribed',
                list_id: input.list_id,
                subscribed_at: new Date().toISOString(),
                tags: input.tags || [],
                custom_fields: input.custom_fields || {},
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            setContacts(prev => [newContact, ...prev]);

            // Atualizar contador de subscribers na lista
            setLists(prev =>
                prev.map(list =>
                    list.id === input.list_id
                        ? { ...list, subscribers: list.subscribers + 1, updated_at: new Date().toISOString() }
                        : list
                )
            );

            toast.success('Contato adicionado com sucesso!');
            return newContact;
        } catch (err) {
            console.error('Erro ao adicionar contato:', err);
            toast.error('Erro ao adicionar contato');
            return null;
        }
    };

    // Remover contato
    const removeContact = async (contactId: string): Promise<boolean> => {
        try {
            const contact = contacts.find(c => c.id === contactId);
            if (!contact) {
                toast.error('Contato não encontrado');
                return false;
            }

            setContacts(prev => prev.filter(c => c.id !== contactId));

            // Atualizar contador de subscribers na lista
            setLists(prev =>
                prev.map(list =>
                    list.id === contact.list_id
                        ? { ...list, subscribers: Math.max(0, list.subscribers - 1), updated_at: new Date().toISOString() }
                        : list
                )
            );

            toast.success('Contato removido com sucesso!');
            return true;
        } catch (err) {
            console.error('Erro ao remover contato:', err);
            toast.error('Erro ao remover contato');
            return false;
        }
    };

    // Obter contatos de uma lista
    const getContactsByList = (listId: string): EmailContact[] => {
        return contacts.filter(contact => contact.list_id === listId);
    };

    // Importar contatos (simulado)
    const importContacts = async (listId: string, contactsData: Array<{ email: string, name?: string }>): Promise<boolean> => {
        try {
            const newContacts: EmailContact[] = contactsData.map((contactData, index) => ({
                id: (Date.now() + index).toString(),
                email: contactData.email,
                name: contactData.name,
                status: 'subscribed',
                list_id: listId,
                subscribed_at: new Date().toISOString(),
                tags: [],
                custom_fields: {},
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }));

            setContacts(prev => [...newContacts, ...prev]);

            // Atualizar contador de subscribers na lista
            setLists(prev =>
                prev.map(list =>
                    list.id === listId
                        ? { ...list, subscribers: list.subscribers + newContacts.length, updated_at: new Date().toISOString() }
                        : list
                )
            );

            toast.success(`${newContacts.length} contatos importados com sucesso!`);
            return true;
        } catch (err) {
            console.error('Erro ao importar contatos:', err);
            toast.error('Erro ao importar contatos');
            return false;
        }
    };

    useEffect(() => {
        loadLists();
    }, []);

    return {
        lists,
        contacts,
        loading,
        error,
        stats,
        loadLists,
        createList,
        updateList,
        deleteList,
        duplicateList,
        addContact,
        removeContact,
        getContactsByList,
        importContacts,
    };
};
