import { useState, useEffect } from 'react'
import {
    EmailList,
    EmailContact,
    getEmailLists,
    createEmailList,
    updateEmailList,
    deleteEmailList,
    getEmailContacts,
    createEmailContact,
    updateEmailContact,
    deleteEmailContact
} from '@/services/emailMarketing'
import { useToast } from '@/hooks/use-toast'

export const useEmailLists = () => {
    const [lists, setLists] = useState<EmailList[]>([])
    const [contacts, setContacts] = useState<EmailContact[]>([])
    const [selectedListId, setSelectedListId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { toast } = useToast()

    const loadLists = async () => {
        try {
            setIsLoading(true)
            setError(null)

            const listsData = await getEmailLists()
            setLists(listsData)
        } catch (error) {
            console.error('Erro ao carregar listas:', error)
            setError('Erro ao carregar listas')
            toast({
                title: 'Erro',
                description: 'Não foi possível carregar as listas',
                variant: 'destructive'
            })
        } finally {
            setIsLoading(false)
        }
    }

    const loadContacts = async (listId?: string) => {
        try {
            setIsLoading(true)
            setError(null)

            const contactsData = await getEmailContacts(listId)
            setContacts(contactsData)
        } catch (error) {
            console.error('Erro ao carregar contatos:', error)
            setError('Erro ao carregar contatos')
            toast({
                title: 'Erro',
                description: 'Não foi possível carregar os contatos',
                variant: 'destructive'
            })
        } finally {
            setIsLoading(false)
        }
    }

    const createList = async (listData: Omit<EmailList, 'id' | 'created_at' | 'updated_at' | 'workspace_id' | 'user_id'>) => {
        try {
            setIsLoading(true)

            // Para desenvolvimento, usar IDs padrão (em produção implementar auth real)
            const mockWorkspaceId = '550e8400-e29b-41d4-a716-446655440000'
            const mockUserId = '550e8400-e29b-41d4-a716-446655440001'

            const newList = await createEmailList({
                ...listData,
                workspace_id: mockWorkspaceId,
                user_id: mockUserId
            })

            setLists(prev => [newList, ...prev])

            toast({
                title: 'Sucesso',
                description: 'Lista criada com sucesso'
            })

            return newList
        } catch (error) {
            console.error('Erro ao criar lista:', error)
            toast({
                title: 'Erro',
                description: 'Não foi possível criar a lista',
                variant: 'destructive'
            })
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const updateList = async (id: string, updates: Partial<EmailList>) => {
        try {
            setIsLoading(true)

            const updatedList = await updateEmailList(id, updates)

            setLists(prev =>
                prev.map(list =>
                    list.id === id
                        ? { ...list, ...updatedList }
                        : list
                )
            )

            toast({
                title: 'Sucesso',
                description: 'Lista atualizada com sucesso'
            })

            return updatedList
        } catch (error) {
            console.error('Erro ao atualizar lista:', error)
            toast({
                title: 'Erro',
                description: 'Não foi possível atualizar a lista',
                variant: 'destructive'
            })
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const deleteList = async (id: string) => {
        try {
            setIsLoading(true)

            await deleteEmailList(id)

            setLists(prev => prev.filter(list => list.id !== id))

            // If deleted list was selected, clear selection
            if (selectedListId === id) {
                setSelectedListId(null)
                setContacts([])
            }

            toast({
                title: 'Sucesso',
                description: 'Lista excluída com sucesso'
            })
        } catch (error) {
            console.error('Erro ao excluir lista:', error)
            toast({
                title: 'Erro',
                description: 'Não foi possível excluir a lista',
                variant: 'destructive'
            })
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const addContact = async (contactData: Omit<EmailContact, 'id' | 'created_at' | 'updated_at' | 'workspace_id'>) => {
        try {
            setIsLoading(true)

            // Para desenvolvimento, usar IDs padrão (em produção implementar auth real)
            const mockWorkspaceId = '550e8400-e29b-41d4-a716-446655440000'

            const newContact = await createEmailContact({
                ...contactData,
                workspace_id: mockWorkspaceId
            })

            setContacts(prev => [newContact, ...prev])

            toast({
                title: 'Sucesso',
                description: 'Contato adicionado com sucesso'
            })

            return newContact
        } catch (error) {
            console.error('Erro ao adicionar contato:', error)
            toast({
                title: 'Erro',
                description: 'Não foi possível adicionar o contato',
                variant: 'destructive'
            })
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const updateContact = async (id: string, updates: Partial<EmailContact>) => {
        try {
            setIsLoading(true)

            const updatedContact = await updateEmailContact(id, updates)

            setContacts(prev =>
                prev.map(contact =>
                    contact.id === id
                        ? { ...contact, ...updatedContact }
                        : contact
                )
            )

            toast({
                title: 'Sucesso',
                description: 'Contato atualizado com sucesso'
            })

            return updatedContact
        } catch (error) {
            console.error('Erro ao atualizar contato:', error)
            toast({
                title: 'Erro',
                description: 'Não foi possível atualizar o contato',
                variant: 'destructive'
            })
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const removeContact = async (id: string) => {
        try {
            setIsLoading(true)

            await deleteEmailContact(id)

            setContacts(prev => prev.filter(contact => contact.id !== id))

            toast({
                title: 'Sucesso',
                description: 'Contato removido com sucesso'
            })
        } catch (error) {
            console.error('Erro ao remover contato:', error)
            toast({
                title: 'Erro',
                description: 'Não foi possível remover o contato',
                variant: 'destructive'
            })
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const selectList = (listId: string) => {
        setSelectedListId(listId)
        loadContacts(listId)
    }

    const importContacts = async (contactsData: Array<Omit<EmailContact, 'id' | 'created_at' | 'updated_at' | 'workspace_id'>>) => {
        try {
            setIsLoading(true)

            // Para desenvolvimento, usar IDs padrão (em produção implementar auth real)
            const mockWorkspaceId = '550e8400-e29b-41d4-a716-446655440000'

            const importPromises = contactsData.map(contactData =>
                createEmailContact({
                    ...contactData,
                    workspace_id: mockWorkspaceId
                })
            )

            const importedContacts = await Promise.allSettled(importPromises)

            const successfulImports = importedContacts
                .filter((result): result is PromiseFulfilledResult<EmailContact> => result.status === 'fulfilled')
                .map(result => result.value)

            setContacts(prev => [...successfulImports, ...prev])

            const failedImports = importedContacts.filter(result => result.status === 'rejected').length

            toast({
                title: 'Importação Concluída',
                description: `${successfulImports.length} contatos importados com sucesso${failedImports > 0 ? `, ${failedImports} falharam` : ''}`
            })

            return {
                success: successfulImports.length,
                failed: failedImports
            }
        } catch (error) {
            console.error('Erro ao importar contatos:', error)
            toast({
                title: 'Erro',
                description: 'Não foi possível importar os contatos',
                variant: 'destructive'
            })
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const exportContacts = (listId?: string) => {
        const contactsToExport = listId
            ? contacts.filter(() => selectedListId === listId)
            : contacts

        const csvData = [
            ['Email', 'Nome', 'Sobrenome', 'Telefone', 'Status', 'Tags', 'Fonte', 'Data de Inscrição'],
            ...contactsToExport.map(contact => [
                contact.email,
                contact.first_name || '',
                contact.last_name || '',
                contact.phone || '',
                contact.status,
                contact.tags?.join(';') || '',
                contact.source || '',
                new Date(contact.subscribed_at).toLocaleDateString('pt-BR')
            ])
        ]

        const csvContent = csvData.map(row => row.map(field => `"${field}"`).join(',')).join('\n')
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)

        link.setAttribute('href', url)
        link.setAttribute('download', `contatos_${listId ? lists.find(l => l.id === listId)?.name : 'todos'}_${new Date().toISOString().slice(0, 10)}.csv`)
        link.style.visibility = 'hidden'

        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        toast({
            title: 'Sucesso',
            description: 'Contatos exportados com sucesso'
        })
    }

    // Statistics
    const getStatistics = () => {
        const totalContacts = contacts.length
        const subscribedContacts = contacts.filter(c => c.status === 'subscribed').length
        const unsubscribedContacts = contacts.filter(c => c.status === 'unsubscribed').length
        const bouncedContacts = contacts.filter(c => c.status === 'bounced').length

        return {
            totalLists: lists.length,
            activeLists: lists.filter(l => l.status === 'active').length,
            totalContacts,
            subscribedContacts,
            unsubscribedContacts,
            bouncedContacts,
            totalSubscribers: lists.reduce((sum, l) => sum + l.subscribers_count, 0),
            avgGrowthRate: lists.length > 0
                ? lists.reduce((sum, l) => sum + l.growth_rate, 0) / lists.length
                : 0
        }
    }

    useEffect(() => {
        loadLists()
        loadContacts()
    }, [])

    return {
        lists,
        contacts,
        selectedListId,
        isLoading,
        error,
        createList,
        updateList,
        deleteList,
        addContact,
        updateContact,
        removeContact,
        selectList,
        importContacts,
        exportContacts,
        refreshLists: loadLists,
        refreshContacts: () => loadContacts(selectedListId || undefined),
        statistics: getStatistics()
    }
}
