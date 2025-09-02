import { supabase } from './src/lib/supabase.ts'

async function insertMockData() {
    try {
        console.log('Inserindo listas de email...')

        // Inserir listas
        const { data: lists, error: listsError } = await supabase
            .from('email_lists')
            .upsert([
                {
                    id: '550e8400-e29b-41d4-a716-446655440010',
                    name: 'Newsletter Geral',
                    description: 'Lista principal para newsletter mensal',
                    workspace_id: '550e8400-e29b-41d4-a716-446655440000',
                    user_id: '550e8400-e29b-41d4-a716-446655440001',
                    status: 'active',
                    subscribers_count: 1250,
                    growth_rate: 8.2,
                    double_opt_in: true,
                    auto_responder: true
                },
                {
                    id: '550e8400-e29b-41d4-a716-446655440011',
                    name: 'Clientes Premium',
                    description: 'Lista exclusiva para clientes premium',
                    workspace_id: '550e8400-e29b-41d4-a716-446655440000',
                    user_id: '550e8400-e29b-41d4-a716-446655440001',
                    status: 'active',
                    subscribers_count: 350,
                    growth_rate: 5.8,
                    double_opt_in: true,
                    auto_responder: false
                },
                {
                    id: '550e8400-e29b-41d4-a716-446655440012',
                    name: 'Novos Usuários',
                    description: 'Sequência de boas-vindas para novos usuários',
                    workspace_id: '550e8400-e29b-41d4-a716-446655440000',
                    user_id: '550e8400-e29b-41d4-a716-446655440001',
                    status: 'active',
                    subscribers_count: 890,
                    growth_rate: 12.4,
                    double_opt_in: true,
                    auto_responder: true
                },
                {
                    id: '550e8400-e29b-41d4-a716-446655440013',
                    name: 'Promoções',
                    description: 'Lista para ofertas especiais e promoções',
                    workspace_id: '550e8400-e29b-41d4-a716-446655440000',
                    user_id: '550e8400-e29b-41d4-a716-446655440001',
                    status: 'inactive',
                    subscribers_count: 0,
                    growth_rate: 0,
                    double_opt_in: false,
                    auto_responder: false
                }
            ])
            .select()

        if (listsError) {
            console.error('Erro ao inserir listas:', listsError)
            return
        }

        console.log('Listas inseridas com sucesso:', lists?.length)

        // Inserir contatos
        const { data: contacts, error: contactsError } = await supabase
            .from('email_contacts')
            .upsert([
                {
                    id: '550e8400-e29b-41d4-a716-446655440020',
                    email: 'joao@exemplo.com',
                    first_name: 'João',
                    last_name: 'Silva',
                    status: 'subscribed',
                    workspace_id: '550e8400-e29b-41d4-a716-446655440000',
                    source: 'website',
                    subscribed_at: new Date().toISOString()
                },
                {
                    id: '550e8400-e29b-41d4-a716-446655440021',
                    email: 'maria@exemplo.com',
                    first_name: 'Maria',
                    last_name: 'Santos',
                    status: 'subscribed',
                    workspace_id: '550e8400-e29b-41d4-a716-446655440000',
                    source: 'facebook',
                    subscribed_at: new Date().toISOString()
                },
                {
                    id: '550e8400-e29b-41d4-a716-446655440022',
                    email: 'pedro@exemplo.com',
                    first_name: 'Pedro',
                    last_name: 'Oliveira',
                    status: 'subscribed',
                    workspace_id: '550e8400-e29b-41d4-a716-446655440000',
                    source: 'google',
                    subscribed_at: new Date().toISOString()
                }
            ])
            .select()

        if (contactsError) {
            console.error('Erro ao inserir contatos:', contactsError)
            return
        }

        console.log('Contatos inseridos com sucesso:', contacts?.length)

        // Relacionar contatos com listas
        const { data: relations, error: relationsError } = await supabase
            .from('email_list_contacts')
            .upsert([
                {
                    id: '550e8400-e29b-41d4-a716-446655440030',
                    list_id: '550e8400-e29b-41d4-a716-446655440010',
                    contact_id: '550e8400-e29b-41d4-a716-446655440020',
                    added_at: new Date().toISOString()
                },
                {
                    id: '550e8400-e29b-41d4-a716-446655440031',
                    list_id: '550e8400-e29b-41d4-a716-446655440010',
                    contact_id: '550e8400-e29b-41d4-a716-446655440021',
                    added_at: new Date().toISOString()
                },
                {
                    id: '550e8400-e29b-41d4-a716-446655440032',
                    list_id: '550e8400-e29b-41d4-a716-446655440011',
                    contact_id: '550e8400-e29b-41d4-a716-446655440020',
                    added_at: new Date().toISOString()
                },
                {
                    id: '550e8400-e29b-41d4-a716-446655440033',
                    list_id: '550e8400-e29b-41d4-a716-446655440012',
                    contact_id: '550e8400-e29b-41d4-a716-446655440022',
                    added_at: new Date().toISOString()
                }
            ])
            .select()

        if (relationsError) {
            console.error('Erro ao inserir relações:', relationsError)
            return
        }

        console.log('Relações inseridas com sucesso:', relations?.length)
        console.log('✅ Todos os dados mock foram inseridos com sucesso!')

    } catch (error) {
        console.error('Erro geral:', error)
    }
}

insertMockData()
