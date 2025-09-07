import React, { useState } from 'react';
import { Users, Target, Brain, Plus, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface PersonasContextProps {
    personas: any[];
    onAction: (action: string, data?: any) => void;
}

export const PersonasContext: React.FC<PersonasContextProps> = ({
    personas = [],
    onAction
}) => {
    const [expandedPersona, setExpandedPersona] = useState<string | null>(null);

    const mockPersonas = personas.length > 0 ? personas : [
        {
            id: '1',
            name: 'Ana Empreendedora',
            age_range: '28-35',
            profession: 'Empresária',
            interests: ['Negócios', 'Produtividade', 'Networking'],
            pain_points: ['Falta de tempo', 'Dificuldade em delegar'],
            platforms: ['LinkedIn', 'Instagram'],
            engagement_score: 8.5,
            description: 'Mulher empreendedora que busca soluções para otimizar seu negócio'
        },
        {
            id: '2',
            name: 'João Tech',
            age_range: '22-28',
            profession: 'Desenvolvedor',
            interests: ['Tecnologia', 'Gaming', 'Inovação'],
            pain_points: ['Burnout', 'Atualização constante'],
            platforms: ['Twitter', 'LinkedIn', 'TikTok'],
            engagement_score: 7.2,
            description: 'Jovem profissional de tecnologia sempre em busca de novidades'
        },
        {
            id: '3',
            name: 'Maria Estudante',
            age_range: '18-24',
            profession: 'Estudante Universitária',
            interests: ['Estudos', 'Sustentabilidade', 'Viagens'],
            pain_points: ['Orçamento limitado', 'Pressão acadêmica'],
            platforms: ['Instagram', 'TikTok', 'YouTube'],
            engagement_score: 9.1,
            description: 'Universitária engajada e consciente sobre causas sociais'
        }
    ];

    const personaInsights = [
        {
            title: 'Persona Mais Engajada',
            value: mockPersonas[0]?.name || 'Ana Empreendedora',
            score: mockPersonas[0]?.engagement_score || 8.5,
            trend: '+12%'
        },
        {
            title: 'Melhor Horário',
            value: '19h-21h',
            score: 'Para Ana',
            trend: '65% mais engajamento'
        },
        {
            title: 'Plataforma Preferida',
            value: 'Instagram',
            score: '3 personas',
            trend: 'Alta conversão'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Overview das Personas */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
                <div className="flex items-center gap-3 mb-3">
                    <Users className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Suas Personas
                    </h3>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="text-2xl font-bold text-blue-600">
                            {mockPersonas.length}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                            Personas Ativas
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-green-600">
                            {Math.round(mockPersonas.reduce((acc, p) => acc + (p.engagement_score || 0), 0) / mockPersonas.length * 10) / 10}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                            Score Médio
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-purple-600">
                            {new Set(mockPersonas.flatMap(p => p.platforms || [])).size}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                            Plataformas
                        </div>
                    </div>
                </div>
            </div>

            {/* Insights Rápidos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {personaInsights.map((insight, index) => (
                    <Card key={index} className="text-center">
                        <CardContent className="p-4">
                            <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                {insight.title}
                            </div>
                            <div className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                {insight.value}
                            </div>
                            <div className="text-xs text-gray-500">
                                {insight.score}
                            </div>
                            <Badge variant="secondary" className="mt-2 text-xs">
                                {insight.trend}
                            </Badge>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Lista de Personas */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Personas Detalhadas
                    </h4>
                    <Button
                        size="sm"
                        onClick={() => onAction('create_new_persona')}
                        className="flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Nova Persona
                    </Button>
                </div>

                <div className="space-y-3">
                    {mockPersonas.map((persona) => (
                        <Card key={persona.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-10 h-10">
                                            <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900/20">
                                                {persona.name.split(' ').map((n: string) => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <CardTitle className="text-base">{persona.name}</CardTitle>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {persona.profession} • {persona.age_range}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-green-600 border-green-600">
                                            {persona.engagement_score}/10
                                        </Badge>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => setExpandedPersona(
                                                expandedPersona === persona.id ? null : persona.id
                                            )}
                                        >
                                            {expandedPersona === persona.id ? 'Menos' : 'Mais'}
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-0">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                    {persona.description}
                                </p>

                                {expandedPersona === persona.id && (
                                    <div className="space-y-3 border-t pt-3">
                                        <div>
                                            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Interesses:
                                            </p>
                                            <div className="flex flex-wrap gap-1">
                                                {persona.interests?.map((interest: string, i: number) => (
                                                    <Badge key={i} variant="secondary" className="text-xs">
                                                        {interest}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Dores:
                                            </p>
                                            <div className="flex flex-wrap gap-1">
                                                {persona.pain_points?.map((pain: string, i: number) => (
                                                    <Badge key={i} variant="outline" className="text-xs text-red-600 border-red-200">
                                                        {pain}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Plataformas:
                                            </p>
                                            <div className="flex flex-wrap gap-1">
                                                {persona.platforms?.map((platform: string, i: number) => (
                                                    <Badge key={i} variant="default" className="text-xs">
                                                        {platform}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-2 mt-3">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onAction('generate_content_for_persona', { persona })}
                                    >
                                        <Target className="w-4 h-4 mr-2" />
                                        Gerar Conteúdo
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onAction('edit_persona', { persona })}
                                    >
                                        <Edit className="w-4 h-4 mr-2" />
                                        Editar
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Ações Baseadas em IA */}
            <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    Insights de IA
                </h4>

                <div className="space-y-2">
                    <Button
                        variant="outline"
                        className="w-full justify-start h-auto p-4"
                        onClick={() => onAction('analyze_persona_gaps')}
                    >
                        <Target className="w-5 h-5 mr-3 text-orange-600" />
                        <div className="text-left">
                            <div className="font-medium">Identificar Lacunas</div>
                            <div className="text-xs text-gray-500">
                                Encontrar oportunidades de novas personas
                            </div>
                        </div>
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full justify-start h-auto p-4"
                        onClick={() => onAction('merge_similar_personas')}
                    >
                        <Users className="w-5 h-5 mr-3 text-blue-600" />
                        <div className="text-left">
                            <div className="font-medium">Otimizar Personas</div>
                            <div className="text-xs text-gray-500">
                                Combinar personas similares ou dividir muito amplas
                            </div>
                        </div>
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full justify-start h-auto p-4"
                        onClick={() => onAction('update_from_analytics')}
                    >
                        <Brain className="w-5 h-5 mr-3 text-purple-600" />
                        <div className="text-left">
                            <div className="font-medium">Atualizar com Analytics</div>
                            <div className="text-xs text-gray-500">
                                Refinar personas baseado em dados reais
                            </div>
                        </div>
                    </Button>
                </div>
            </div>
        </div>
    );
};
