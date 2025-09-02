import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Mail, Users, Eye, Target, Calendar, Send, Clock } from 'lucide-react';
import { EmailCampaign } from '@/services/emailMarketing';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ViewCampaignModalProps {
    isOpen: boolean;
    onClose: () => void;
    campaign: EmailCampaign | null;
}

const ViewCampaignModal = ({ isOpen, onClose, campaign }: ViewCampaignModalProps) => {
    if (!campaign) return null;

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
        } catch {
            return 'Data inválida';
        }
    };

    const getStatusBadge = (status: string) => {
        const statusMap = {
            'sent': { label: 'Enviada', variant: 'default' as const, color: 'bg-green-100 text-green-800' },
            'scheduled': { label: 'Agendada', variant: 'secondary' as const, color: 'bg-blue-100 text-blue-800' },
            'draft': { label: 'Rascunho', variant: 'outline' as const, color: 'bg-gray-100 text-gray-800' },
            'sending': { label: 'Enviando', variant: 'default' as const, color: 'bg-yellow-100 text-yellow-800' },
            'paused': { label: 'Pausada', variant: 'destructive' as const, color: 'bg-red-100 text-red-800' },
            'cancelled': { label: 'Cancelada', variant: 'destructive' as const, color: 'bg-red-100 text-red-800' },
        };

        const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.draft;
        return <Badge className={statusInfo.color}>{statusInfo.label}</Badge>;
    };

    // Mock stats based on campaign data
    const mockStats = {
        opens: Math.floor(campaign.total_recipients * 0.25),
        clicks: Math.floor(campaign.total_recipients * 0.05),
        openRate: 25.0,
        clickRate: 5.0,
        deliveryRate: 98.8,
        unsubscribes: Math.floor(campaign.total_recipients * 0.002),
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                        <Mail className="h-5 w-5" />
                        {campaign.name}
                    </DialogTitle>
                    <DialogDescription>
                        Detalhes completos da campanha de email marketing
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Status e Info Básica */}
                    <div className="flex flex-wrap items-center gap-4">
                        {getStatusBadge(campaign.status)}
                        <span className="text-sm text-muted-foreground">
                            Criada em {formatDate(campaign.created_at)}
                        </span>
                        {campaign.sent_at && (
                            <span className="text-sm text-muted-foreground">
                                Enviada em {formatDate(campaign.sent_at)}
                            </span>
                        )}
                    </div>

                    {/* Informações da Campanha */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Informações da Campanha
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Nome da Campanha</label>
                                <p className="text-sm text-muted-foreground mt-1">{campaign.name}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium">Assunto</label>
                                <p className="text-sm text-muted-foreground mt-1">{campaign.subject}</p>
                            </div>

                            {campaign.preview_text && (
                                <div>
                                    <label className="text-sm font-medium">Texto de Preview</label>
                                    <p className="text-sm text-muted-foreground mt-1">{campaign.preview_text}</p>
                                </div>
                            )}

                            <div>
                                <label className="text-sm font-medium">Tipo de Envio</label>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {campaign.send_type === 'immediate' ? 'Imediato' :
                                        campaign.send_type === 'scheduled' ? 'Agendado' : 'Recorrente'}
                                </p>
                            </div>

                            {campaign.scheduled_at && (
                                <div>
                                    <label className="text-sm font-medium">Agendado para</label>
                                    <p className="text-sm text-muted-foreground mt-1">{formatDate(campaign.scheduled_at)}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Estatísticas */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Target className="h-4 w-4" />
                                Estatísticas de Performance
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="text-center p-4 bg-muted rounded-lg">
                                    <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                                    <div className="text-2xl font-bold">{campaign.total_recipients.toLocaleString()}</div>
                                    <div className="text-sm text-muted-foreground">Destinatários</div>
                                </div>

                                <div className="text-center p-4 bg-muted rounded-lg">
                                    <Eye className="h-8 w-8 mx-auto mb-2 text-green-600" />
                                    <div className="text-2xl font-bold">{mockStats.opens.toLocaleString()}</div>
                                    <div className="text-sm text-muted-foreground">
                                        Aberturas ({mockStats.openRate}%)
                                    </div>
                                </div>

                                <div className="text-center p-4 bg-muted rounded-lg">
                                    <Target className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                                    <div className="text-2xl font-bold">{mockStats.clicks.toLocaleString()}</div>
                                    <div className="text-sm text-muted-foreground">
                                        Cliques ({mockStats.clickRate}%)
                                    </div>
                                </div>

                                <div className="text-center p-4 bg-muted rounded-lg">
                                    <Send className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                                    <div className="text-2xl font-bold">{mockStats.deliveryRate}%</div>
                                    <div className="text-sm text-muted-foreground">Taxa de Entrega</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Conteúdo do Email */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Conteúdo do Email</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium">Conteúdo HTML</label>
                                    <div className="mt-2 p-4 bg-muted rounded-lg max-h-40 overflow-y-auto">
                                        <code className="text-xs">{campaign.html_content}</code>
                                    </div>
                                </div>

                                {campaign.text_content && (
                                    <div>
                                        <label className="text-sm font-medium">Conteúdo em Texto</label>
                                        <div className="mt-2 p-4 bg-muted rounded-lg max-h-40 overflow-y-auto">
                                            <pre className="text-xs whitespace-pre-wrap">{campaign.text_content}</pre>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tags */}
                    {campaign.tags && campaign.tags.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Tags</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {campaign.tags.map((tag, index) => (
                                        <Badge key={index} variant="outline">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ViewCampaignModal;
