import React, { useState } from 'react';
import { Palette, Sparkles, Target, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';


interface ComposerContextProps {
    currentDraft?: any;
    availableVoices: any[];
    selectedPlatforms: string[];
    onAction: (action: string, data?: any) => void;
}

export const ComposerContext: React.FC<ComposerContextProps> = ({
    currentDraft,
    availableVoices = [],
    selectedPlatforms = [],
    onAction
}) => {
    const [quickPrompt, setQuickPrompt] = useState('');

    const quickIdeas = [
        'Post sobre tendências da semana',
        'Carousel educativo sobre o produto',
        'Stories interativo com enquete',
        'Post de bastidores da empresa',
        'Conteúdo de valor para o público',
        'Post de engajamento com pergunta'
    ];

    const smartSuggestions = [
        {
            title: 'Otimizar para Instagram',
            description: 'Adaptar copy para formato quadrado e hashtags',
            action: 'optimize_instagram',
            color: 'text-pink-600',
            bgColor: 'bg-pink-50 dark:bg-pink-900/20'
        },
        {
            title: 'Gerar Variações',
            description: 'Criar 3 versões diferentes do mesmo conteúdo',
            action: 'generate_variations',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20'
        },
        {
            title: 'Adicionar CTA',
            description: 'Sugerir chamadas para ação eficazes',
            action: 'add_cta',
            color: 'text-green-600',
            bgColor: 'bg-green-50 dark:bg-green-900/20'
        },
        {
            title: 'Melhorar Tom',
            description: 'Ajustar linguagem para brand voice selecionada',
            action: 'improve_tone',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Status do Draft Atual */}
            {currentDraft && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center gap-3 mb-3">
                        <MessageSquare className="w-6 h-6 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Draft em Andamento
                        </h3>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">
                            {selectedPlatforms.join(', ') || 'Nenhuma plataforma'}
                        </Badge>
                        {availableVoices.length > 0 && (
                            <Badge variant="secondary">
                                {availableVoices[0]?.name || 'Sem brand voice'}
                            </Badge>
                        )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Palavras: {currentDraft?.content?.split(' ').length || 0} •
                        Caracteres: {currentDraft?.content?.length || 0}
                    </p>
                </div>
            )}

            {/* Geração Rápida */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-600" />
                        Geração Rápida de Ideias
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Ex: post sobre Black Friday, carousel sobre sustentabilidade..."
                            value={quickPrompt}
                            onChange={(e) => setQuickPrompt(e.target.value)}
                            className="flex-1"
                        />
                        <Button
                            onClick={() => {
                                onAction('quick_generate', { prompt: quickPrompt });
                                setQuickPrompt('');
                            }}
                            disabled={!quickPrompt.trim()}
                        >
                            Gerar
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Ideias populares:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {quickIdeas.map((idea, index) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onAction('quick_generate', { prompt: idea })}
                                    className="text-xs"
                                >
                                    {idea}
                                </Button>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Sugestões Inteligentes */}
            <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Otimizações Sugeridas
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {smartSuggestions.map((suggestion, index) => (
                        <Button
                            key={index}
                            variant="outline"
                            className={`h-auto p-4 justify-start ${suggestion.bgColor} border-0 hover:shadow-md transition-all`}
                            onClick={() => onAction(suggestion.action)}
                        >
                            <div className="text-left">
                                <div className={`font-medium ${suggestion.color}`}>
                                    {suggestion.title}
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                    {suggestion.description}
                                </div>
                            </div>
                        </Button>
                    ))}
                </div>
            </div>

            {/* Brand Voices Disponíveis */}
            {availableVoices && availableVoices.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        Brand Voices Disponíveis
                    </h4>

                    <div className="space-y-2">
                        {availableVoices.slice(0, 3).map((voice, index) => (
                            <Button
                                key={index}
                                variant="outline"
                                className="w-full justify-start h-auto p-3"
                                onClick={() => onAction('apply_voice', { voice })}
                            >
                                <div className="text-left">
                                    <div className="font-medium">{voice.name}</div>
                                    <div className="text-xs text-gray-500 truncate">
                                        {voice.description || 'Sem descrição'}
                                    </div>
                                </div>
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            {/* Ações Avançadas */}
            <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Ações Avançadas
                </h4>

                <div className="space-y-2">
                    <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => onAction('analyze_competitors')}
                    >
                        Analisar Concorrentes
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => onAction('suggest_hashtags')}
                    >
                        Sugerir Hashtags
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => onAction('schedule_optimal')}
                    >
                        Agendar no Horário Ideal
                    </Button>
                </div>
            </div>
        </div>
    );
};
