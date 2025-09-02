import { useState, useEffect } from 'react'
import {
    EmailCampaign,
    EmailCampaignStats,
    getEmailCampaigns,
    createEmailCampaign,
    updateEmailCampaign,
    deleteEmailCampaign,
    getCampaignStats
} from '@/services/emailMarketing'
import { useToast } from '@/hooks/use-toast'

interface CampaignWithStats extends EmailCampaign {
    stats?: EmailCampaignStats
}

export const useEmailCampaigns = () => {
    const [campaigns, setCampaigns] = useState<CampaignWithStats[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { toast } = useToast()

    const loadCampaigns = async () => {
        try {
            setIsLoading(true)
            setError(null)

            const [campaignsData, statsData] = await Promise.all([
                getEmailCampaigns(),
                getCampaignStats()
            ])

            // Combine campaigns with their stats
            const campaignsWithStats = campaignsData.map(campaign => ({
                ...campaign,
                stats: statsData.find(stat => stat.campaign_id === campaign.id)
            }))

            setCampaigns(campaignsWithStats)
        } catch (error) {
            console.error('Erro ao carregar campanhas:', error)
            setError('Erro ao carregar campanhas')
            toast({
                title: 'Erro',
                description: 'Não foi possível carregar as campanhas',
                variant: 'destructive'
            })
        } finally {
            setIsLoading(false)
        }
    }

    const createCampaign = async (campaignData: Omit<EmailCampaign, 'id' | 'created_at' | 'updated_at' | 'workspace_id' | 'user_id'>) => {
        try {
            setIsLoading(true)

            // Para desenvolvimento, usar IDs padrão (em produção implementar auth real)
            const mockWorkspaceId = '550e8400-e29b-41d4-a716-446655440000'
            const mockUserId = '550e8400-e29b-41d4-a716-446655440001'

            const newCampaign = await createEmailCampaign({
                ...campaignData,
                workspace_id: mockWorkspaceId,
                user_id: mockUserId
            })

            setCampaigns(prev => [{ ...newCampaign }, ...prev])

            toast({
                title: 'Sucesso',
                description: 'Campanha criada com sucesso'
            })

            return newCampaign
        } catch (error) {
            console.error('Erro ao criar campanha:', error)
            toast({
                title: 'Erro',
                description: 'Não foi possível criar a campanha',
                variant: 'destructive'
            })
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const updateCampaign = async (id: string, updates: Partial<EmailCampaign>) => {
        try {
            setIsLoading(true)

            const updatedCampaign = await updateEmailCampaign(id, updates)

            setCampaigns(prev =>
                prev.map(campaign =>
                    campaign.id === id
                        ? { ...campaign, ...updatedCampaign }
                        : campaign
                )
            )

            toast({
                title: 'Sucesso',
                description: 'Campanha atualizada com sucesso'
            })

            return updatedCampaign
        } catch (error) {
            console.error('Erro ao atualizar campanha:', error)
            toast({
                title: 'Erro',
                description: 'Não foi possível atualizar a campanha',
                variant: 'destructive'
            })
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const deleteCampaign = async (id: string) => {
        try {
            setIsLoading(true)

            await deleteEmailCampaign(id)

            setCampaigns(prev => prev.filter(campaign => campaign.id !== id))

            toast({
                title: 'Sucesso',
                description: 'Campanha excluída com sucesso'
            })
        } catch (error) {
            console.error('Erro ao excluir campanha:', error)
            toast({
                title: 'Erro',
                description: 'Não foi possível excluir a campanha',
                variant: 'destructive'
            })
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const sendCampaign = async (id: string) => {
        try {
            setIsLoading(true)

            const updatedCampaign = await updateEmailCampaign(id, {
                status: 'sending',
                sent_at: new Date().toISOString()
            })

            setCampaigns(prev =>
                prev.map(campaign =>
                    campaign.id === id
                        ? { ...campaign, ...updatedCampaign }
                        : campaign
                )
            )

            toast({
                title: 'Sucesso',
                description: 'Campanha enviada com sucesso'
            })

            // Simulate sending process
            setTimeout(async () => {
                await updateEmailCampaign(id, { status: 'sent' })
                loadCampaigns() // Reload to get updated stats
            }, 3000)

        } catch (error) {
            console.error('Erro ao enviar campanha:', error)
            toast({
                title: 'Erro',
                description: 'Não foi possível enviar a campanha',
                variant: 'destructive'
            })
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const pauseCampaign = async (id: string) => {
        try {
            await updateCampaign(id, { status: 'paused' })
        } catch (error) {
            console.error('Erro ao pausar campanha:', error)
            throw error
        }
    }

    const duplicateCampaign = async (id: string) => {
        try {
            const campaign = campaigns.find(c => c.id === id)
            if (!campaign) throw new Error('Campanha não encontrada')

            const duplicatedCampaign = await createCampaign({
                name: `${campaign.name} (Cópia)`,
                subject: campaign.subject,
                preview_text: campaign.preview_text,
                html_content: campaign.html_content,
                text_content: campaign.text_content,
                template_id: campaign.template_id,
                status: 'draft',
                send_type: campaign.send_type,
                scheduled_at: campaign.scheduled_at,
                total_recipients: 0,
                tags: campaign.tags,
                settings: campaign.settings
            })

            return duplicatedCampaign
        } catch (error) {
            console.error('Erro ao duplicar campanha:', error)
            throw error
        }
    }

    // Statistics
    const getStatistics = () => {
        const stats = {
            total: campaigns.length,
            sent: campaigns.filter(c => c.status === 'sent').length,
            draft: campaigns.filter(c => c.status === 'draft').length,
            scheduled: campaigns.filter(c => c.status === 'scheduled').length,
            totalRecipients: campaigns.reduce((sum, c) => sum + (c.total_recipients || 0), 0),
            avgOpenRate: 0,
            avgClickRate: 0
        }

        const campaignsWithStats = campaigns.filter(c => c.stats)
        if (campaignsWithStats.length > 0) {
            stats.avgOpenRate = campaignsWithStats.reduce((sum, c) => sum + (c.stats?.open_rate || 0), 0) / campaignsWithStats.length
            stats.avgClickRate = campaignsWithStats.reduce((sum, c) => sum + (c.stats?.click_rate || 0), 0) / campaignsWithStats.length
        }

        return stats
    }

    useEffect(() => {
        loadCampaigns()
    }, [])

    return {
        campaigns,
        isLoading,
        error,
        createCampaign,
        updateCampaign,
        deleteCampaign,
        sendCampaign,
        pauseCampaign,
        duplicateCampaign,
        refreshCampaigns: loadCampaigns,
        statistics: getStatistics()
    }
}
