import { useState, useEffect } from 'react'
import {
    EmailCampaignStats,
    EmailEvent,
    getCampaignStats,
    getEmailEvents,
    getEmailAnalytics
} from '@/services/emailMarketing'
import { useToast } from '@/hooks/use-toast'

interface AnalyticsData {
    totalSent: number
    totalDelivered: number
    totalOpens: number
    totalClicks: number
    avgOpenRate: number
    avgClickRate: number
    campaignStats: EmailCampaignStats[]
}

interface CampaignPerformance {
    campaignId: string
    campaignName: string
    sent: number
    opens: number
    clicks: number
    openRate: number
    clickRate: number
    bounceRate: number
    unsubscribeRate: number
    date: string
}

interface TimeSeriesData {
    date: string
    opens: number
    clicks: number
    sent: number
    delivered: number
}

export const useEmailAnalytics = () => {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
    const [campaignPerformance, setCampaignPerformance] = useState<CampaignPerformance[]>([])
    const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([])
    const [events, setEvents] = useState<EmailEvent[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        end: new Date()
    })
    const { toast } = useToast()

    const loadAnalytics = async () => {
        try {
            setIsLoading(true)
            setError(null)

            const [analyticsData, eventsData] = await Promise.all([
                getEmailAnalytics(),
                getEmailEvents()
            ])

            setAnalytics(analyticsData)
            setEvents(eventsData)

            // Process campaign performance data
            const performanceData = analyticsData.campaignStats.map(stat => ({
                campaignId: stat.campaign_id,
                campaignName: `Campanha ${stat.campaign_id.slice(0, 8)}`, // You'll want to get actual campaign names
                sent: stat.total_sent,
                opens: stat.unique_opens,
                clicks: stat.unique_clicks,
                openRate: stat.open_rate,
                clickRate: stat.click_rate,
                bounceRate: stat.bounce_rate,
                unsubscribeRate: stat.unsubscribe_rate,
                date: stat.created_at
            }))

            setCampaignPerformance(performanceData)

            // Generate time series data (last 30 days)
            const timeData = generateTimeSeriesData(eventsData)
            setTimeSeriesData(timeData)

        } catch (error) {
            console.error('Erro ao carregar analytics:', error)
            setError('Erro ao carregar analytics')
            toast({
                title: 'Erro',
                description: 'Não foi possível carregar os dados de analytics',
                variant: 'destructive'
            })
        } finally {
            setIsLoading(false)
        }
    }

    const generateTimeSeriesData = (events: EmailEvent[]): TimeSeriesData[] => {
        const last30Days = Array.from({ length: 30 }, (_, i) => {
            const date = new Date()
            date.setDate(date.getDate() - (29 - i))
            return date.toISOString().split('T')[0]
        })

        return last30Days.map(date => {
            const dayEvents = events.filter(event =>
                event.created_at.startsWith(date)
            )

            return {
                date,
                opens: dayEvents.filter(e => e.event_type === 'opened').length,
                clicks: dayEvents.filter(e => e.event_type === 'clicked').length,
                sent: dayEvents.filter(e => e.event_type === 'sent').length,
                delivered: dayEvents.filter(e => e.event_type === 'delivered').length
            }
        })
    }

    const getCampaignAnalytics = async (campaignId: string) => {
        try {
            setIsLoading(true)

            const [stats, events] = await Promise.all([
                getCampaignStats(campaignId),
                getEmailEvents(campaignId)
            ])

            const campaignStat = stats[0]
            if (!campaignStat) throw new Error('Estatísticas não encontradas')

            // Group events by hour for detailed timeline
            const hourlyData = events.reduce((acc, event) => {
                const hour = new Date(event.created_at).toISOString().slice(0, 13) + ':00:00.000Z'
                if (!acc[hour]) {
                    acc[hour] = { opened: 0, clicked: 0, bounced: 0, unsubscribed: 0 }
                }
                acc[hour][event.event_type === 'opened' ? 'opened' :
                    event.event_type === 'clicked' ? 'clicked' :
                        event.event_type === 'bounced' ? 'bounced' :
                            event.event_type === 'unsubscribed' ? 'unsubscribed' : 'other']++
                return acc
            }, {} as Record<string, any>)

            return {
                stats: campaignStat,
                events,
                hourlyData: Object.entries(hourlyData).map(([time, data]) => ({
                    time,
                    ...data
                }))
            }
        } catch (error) {
            console.error('Erro ao carregar analytics da campanha:', error)
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const getTopPerformingCampaigns = (limit = 5) => {
        return [...campaignPerformance]
            .sort((a, b) => b.openRate - a.openRate)
            .slice(0, limit)
    }

    const getSubscriberInsights = () => {
        if (!analytics) return null

        const totalEngaged = analytics.totalOpens + analytics.totalClicks
        const engagementRate = analytics.totalSent > 0
            ? ((totalEngaged / analytics.totalSent) * 100)
            : 0

        return {
            totalSubscribers: analytics.totalSent, // This should be actual subscriber count
            engagementRate,
            activeSubscribers: Math.round(analytics.totalSent * 0.68), // Mock calculation
            newSubscribers: Math.round(analytics.totalSent * 0.12), // Mock calculation
            churnedSubscribers: Math.round(analytics.totalSent * 0.05), // Mock calculation
            subscriberGrowth: 8.5, // Mock percentage
            avgTimeToOpen: '2h 15m', // Mock data
            mostActiveDay: 'Terça-feira', // Mock data
            mostActiveTime: '10:00 - 11:00' // Mock data
        }
    }

    const getDeviceBreakdown = () => {
        // Mock data - in real implementation, you'd get this from events
        return [
            { device: 'Mobile', percentage: 65, count: Math.round((analytics?.totalOpens || 0) * 0.65) },
            { device: 'Desktop', percentage: 30, count: Math.round((analytics?.totalOpens || 0) * 0.30) },
            { device: 'Tablet', percentage: 5, count: Math.round((analytics?.totalOpens || 0) * 0.05) }
        ]
    }

    const getLocationBreakdown = () => {
        // Mock data - in real implementation, you'd get this from events IP data
        return [
            { country: 'Brasil', percentage: 78, count: Math.round((analytics?.totalOpens || 0) * 0.78) },
            { country: 'Estados Unidos', percentage: 12, count: Math.round((analytics?.totalOpens || 0) * 0.12) },
            { country: 'Portugal', percentage: 6, count: Math.round((analytics?.totalOpens || 0) * 0.06) },
            { country: 'Outros', percentage: 4, count: Math.round((analytics?.totalOpens || 0) * 0.04) }
        ]
    }

    const getEmailClientBreakdown = () => {
        // Mock data - in real implementation, you'd parse user agents from events
        return [
            { client: 'Gmail', percentage: 45, count: Math.round((analytics?.totalOpens || 0) * 0.45) },
            { client: 'Outlook', percentage: 25, count: Math.round((analytics?.totalOpens || 0) * 0.25) },
            { client: 'Apple Mail', percentage: 20, count: Math.round((analytics?.totalOpens || 0) * 0.20) },
            { client: 'Yahoo Mail', percentage: 6, count: Math.round((analytics?.totalOpens || 0) * 0.06) },
            { client: 'Outros', percentage: 4, count: Math.round((analytics?.totalOpens || 0) * 0.04) }
        ]
    }

    const exportAnalyticsReport = () => {
        if (!analytics) return

        const reportData = {
            period: `${dateRange.start.toLocaleDateString('pt-BR')} - ${dateRange.end.toLocaleDateString('pt-BR')}`,
            summary: {
                totalSent: analytics.totalSent,
                totalDelivered: analytics.totalDelivered,
                totalOpens: analytics.totalOpens,
                totalClicks: analytics.totalClicks,
                avgOpenRate: analytics.avgOpenRate.toFixed(2) + '%',
                avgClickRate: analytics.avgClickRate.toFixed(2) + '%'
            },
            campaignPerformance,
            subscriberInsights: getSubscriberInsights(),
            deviceBreakdown: getDeviceBreakdown(),
            locationBreakdown: getLocationBreakdown(),
            emailClientBreakdown: getEmailClientBreakdown()
        }

        const jsonContent = JSON.stringify(reportData, null, 2)
        const blob = new Blob([jsonContent], { type: 'application/json' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)

        link.setAttribute('href', url)
        link.setAttribute('download', `relatorio_email_analytics_${new Date().toISOString().slice(0, 10)}.json`)
        link.style.visibility = 'hidden'

        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        toast({
            title: 'Sucesso',
            description: 'Relatório exportado com sucesso'
        })
    }

    const updateDateRange = (start: Date, end: Date) => {
        setDateRange({ start, end })
        // You would typically reload data here for the new date range
        loadAnalytics()
    }

    useEffect(() => {
        loadAnalytics()
    }, [])

    return {
        analytics,
        campaignPerformance,
        timeSeriesData,
        events,
        dateRange,
        isLoading,
        error,
        getCampaignAnalytics,
        getTopPerformingCampaigns,
        getSubscriberInsights,
        getDeviceBreakdown,
        getLocationBreakdown,
        getEmailClientBreakdown,
        exportAnalyticsReport,
        updateDateRange,
        refreshAnalytics: loadAnalytics
    }
}
