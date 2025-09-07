import React from 'react';
import { BarChart3, TrendingUp, Target, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface AnalyticsContextProps {
    analyticsData: any;
    onAction: (action: string, data?: any) => void;
}

export const AnalyticsContext: React.FC<AnalyticsContextProps> = ({
    analyticsData,
    onAction
}) => {
    const insights = [
        {
            title: 'Melhor horário para posts',
            value: '14h-16h',
            trend: '+15%',
            type: 'positive'
        },
        {
            title: 'Plataforma com maior ROI',
            value: 'Instagram',
            trend: '85% conversão',
            type: 'positive'
        },
        {
            title: 'Público mais engajado',
            value: '25-34 anos',
            trend: '60% da audiência',
            type: 'neutral'
        },
        {
            title: 'Formato de maior sucesso',
            value: 'Carrossel',
            trend: '+32% engajamento',
            type: 'positive'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Visão Geral dos Dados */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200 dark:border-green-700">
                <div className="flex items-center gap-3 mb-3">
                    <BarChart3 className="w-6 h-6 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Insights dos seus Analytics
                    </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Baseado nos dados dos últimos 30 dias • {analyticsData?.totalPosts || 0} posts analisados
                </p>
            </div>

            {/* Insights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {insights.map((insight, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                {insight.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-gray-900 dark:text-white">
                                    {insight.value}
                                </span>
                                <Badge
                                    variant={insight.type === 'positive' ? 'default' : 'secondary'}
                                    className={insight.type === 'positive' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : ''}
                                >
                                    {insight.trend}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Ações Baseadas em Dados */}
            <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Ações Recomendadas
                </h4>

                <div className="space-y-3">
                    <Button
                        variant="outline"
                        className="w-full justify-start h-auto p-4"
                        onClick={() => onAction('generate_copy_from_insights')}
                    >
                        <TrendingUp className="w-5 h-5 mr-3 text-green-600" />
                        <div className="text-left">
                            <div className="font-medium">Gerar Copy Baseada em Performance</div>
                            <div className="text-sm text-gray-500">
                                Criar copy usando os insights de melhor performance
                            </div>
                        </div>
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full justify-start h-auto p-4"
                        onClick={() => onAction('create_report')}
                    >
                        <BarChart3 className="w-5 h-5 mr-3 text-blue-600" />
                        <div className="text-left">
                            <div className="font-medium">Gerar Relatório Executivo</div>
                            <div className="text-sm text-gray-500">
                                Criar relatório completo com insights e recomendações
                            </div>
                        </div>
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full justify-start h-auto p-4"
                        onClick={() => onAction('optimize_schedule')}
                    >
                        <Target className="w-5 h-5 mr-3 text-orange-600" />
                        <div className="text-left">
                            <div className="font-medium">Otimizar Cronograma</div>
                            <div className="text-sm text-gray-500">
                                Ajustar horários de publicação para máximo engajamento
                            </div>
                        </div>
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full justify-start h-auto p-4"
                        onClick={() => onAction('analyze_audience')}
                    >
                        <Users className="w-5 h-5 mr-3 text-purple-600" />
                        <div className="text-left">
                            <div className="font-medium">Analisar Audiência</div>
                            <div className="text-sm text-gray-500">
                                Entender melhor seu público e criar personas
                            </div>
                        </div>
                    </Button>
                </div>
            </div>

            {/* Dados Brutos (Collapsible) */}
            <details className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <summary className="cursor-pointer font-medium text-gray-900 dark:text-white">
                    Ver dados brutos
                </summary>
                <pre className="mt-3 text-xs text-gray-600 dark:text-gray-400 overflow-auto">
                    {JSON.stringify(analyticsData, null, 2)}
                </pre>
            </details>
        </div>
    );
};
