import React from 'react';
import { Calendar, Clock, Target, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface CampaignsContextProps {
    activeCampaigns: any[];
    draftCampaigns: any[];
    campaignStats: any;
    onAction: (action: string, data?: any) => void;
}

export const CampaignsContext: React.FC<CampaignsContextProps> = ({
    activeCampaigns = [],
    draftCampaigns = [],
    campaignStats,
    onAction
}) => {

    const campaignTemplates = [
        {
            name: 'Lançamento de Produto',
            description: 'Campanha completa para novos produtos',
            duration: '2 semanas',
            posts: 12,
            platforms: ['Instagram', 'Facebook', 'LinkedIn']
        },
        {
            name: 'Engajamento Semanal',
            description: 'Posts para manter audiência engajada',
            duration: '1 semana',
            posts: 7,
            platforms: ['Instagram', 'TikTok']
        },
        {
            name: 'Black Friday',
            description: 'Campanha promocional sazonal',
            duration: '1 mês',
            posts: 20,
            platforms: ['Instagram', 'Facebook', 'WhatsApp']
        }
    ];

    const mockActiveCampaign = activeCampaigns[0] || {
        name: 'Campanha Q4 2024',
        status: 'Em andamento',
        progress: 65,
        remaining_days: 12,
        total_posts: 24,
        published_posts: 15,
        engagement_rate: 4.2
    };

    return (
        <div className="space-y-6">
            {/* Status das Campanhas Ativas */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-700">
                <div className="flex items-center gap-3 mb-3">
                    <Target className="w-6 h-6 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Campanhas em Andamento
                    </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                            {activeCampaigns.length || 1}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                            Ativas
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                            {draftCampaigns.length || 2}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                            Rascunhos
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                            {campaignStats?.total_posts || 89}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                            Posts Totais
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                            {campaignStats?.avg_engagement || '4.1'}%
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                            Engajamento
                        </div>
                    </div>
                </div>
            </div>

            {/* Campanha Principal */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            {mockActiveCampaign.name}
                        </span>
                        <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                            {mockActiveCampaign.status}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Progresso da campanha</span>
                            <span>{mockActiveCampaign.progress}%</span>
                        </div>
                        <Progress value={mockActiveCampaign.progress} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span>{mockActiveCampaign.remaining_days} dias restantes</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-gray-500" />
                            <span>{mockActiveCampaign.engagement_rate}% engajamento</span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            onClick={() => onAction('view_campaign_details', { campaign: mockActiveCampaign })}
                        >
                            Ver Detalhes
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onAction('generate_campaign_content', { campaign: mockActiveCampaign })}
                        >
                            Gerar Conteúdo
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Templates de Campanha */}
            <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Templates de Campanha
                </h4>

                <div className="space-y-3">
                    {campaignTemplates.map((template, index) => (
                        <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h5 className="font-medium text-gray-900 dark:text-white">
                                        {template.name}
                                    </h5>
                                    <Button
                                        size="sm"
                                        onClick={() => onAction('create_from_template', { template })}
                                    >
                                        Usar Template
                                    </Button>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                    {template.description}
                                </p>

                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {template.duration}
                                    </span>
                                    <span>{template.posts} posts</span>
                                    <div className="flex gap-1">
                                        {template.platforms.slice(0, 2).map((platform, i) => (
                                            <Badge key={i} variant="secondary" className="text-xs">
                                                {platform}
                                            </Badge>
                                        ))}
                                        {template.platforms.length > 2 && (
                                            <Badge variant="secondary" className="text-xs">
                                                +{template.platforms.length - 2}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Ações Rápidas */}
            <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Ações Rápidas
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Button
                        variant="outline"
                        className="h-auto p-4 justify-start"
                        onClick={() => onAction('create_new_campaign')}
                    >
                        <Target className="w-5 h-5 mr-3 text-purple-600" />
                        <div className="text-left">
                            <div className="font-medium">Nova Campanha</div>
                            <div className="text-xs text-gray-500">Criar do zero</div>
                        </div>
                    </Button>

                    <Button
                        variant="outline"
                        className="h-auto p-4 justify-start"
                        onClick={() => onAction('analyze_performance')}
                    >
                        <TrendingUp className="w-5 h-5 mr-3 text-green-600" />
                        <div className="text-left">
                            <div className="font-medium">Analisar Performance</div>
                            <div className="text-xs text-gray-500">Relatório detalhado</div>
                        </div>
                    </Button>

                    <Button
                        variant="outline"
                        className="h-auto p-4 justify-start"
                        onClick={() => onAction('optimize_schedule')}
                    >
                        <Calendar className="w-5 h-5 mr-3 text-blue-600" />
                        <div className="text-left">
                            <div className="font-medium">Otimizar Cronograma</div>
                            <div className="text-xs text-gray-500">Melhores horários</div>
                        </div>
                    </Button>

                    <Button
                        variant="outline"
                        className="h-auto p-4 justify-start"
                        onClick={() => onAction('duplicate_campaign')}
                    >
                        <Users className="w-5 h-5 mr-3 text-orange-600" />
                        <div className="text-left">
                            <div className="font-medium">Duplicar Campanha</div>
                            <div className="text-xs text-gray-500">Usar como base</div>
                        </div>
                    </Button>
                </div>
            </div>
        </div>
    );
};
