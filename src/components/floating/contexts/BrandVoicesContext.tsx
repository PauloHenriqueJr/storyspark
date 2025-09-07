import React, { useState } from 'react';
import { Palette, Volume2, MessageCircle, Sparkles, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

interface BrandVoicesContextProps {
    brandVoices: any[];
    activeBrandVoice?: any;
    onAction: (action: string, data?: any) => void;
}

export const BrandVoicesContext: React.FC<BrandVoicesContextProps> = ({
    brandVoices = [],
    activeBrandVoice,
    onAction
}) => {
    const [expandedVoice, setExpandedVoice] = useState<string | null>(null);
    const [testText, setTestText] = useState('');

    const mockBrandVoices = brandVoices.length > 0 ? brandVoices : [
        {
            id: '1',
            name: 'Tom Profissional',
            description: 'Linguagem formal e técnica para LinkedIn e comunicação B2B',
            tone: 'Formal',
            style: 'Informativo',
            personality: ['Confiável', 'Técnico', 'Autoritativo'],
            example_phrases: [
                'Maximizar o potencial de crescimento',
                'Soluções inovadoras e escaláveis',
                'Resultados comprovados no mercado'
            ],
            use_cases: ['LinkedIn', 'Apresentações', 'Email Marketing B2B'],
            usage_count: 45,
            effectiveness: 8.7
        },
        {
            id: '2',
            name: 'Tom Casual',
            description: 'Linguagem descontraída e próxima para Instagram e TikTok',
            tone: 'Casual',
            style: 'Conversacional',
            personality: ['Amigável', 'Autêntico', 'Divertido'],
            example_phrases: [
                'Vamos falar sobre isso?',
                'A real é que...',
                'Super dica pra você!'
            ],
            use_cases: ['Instagram', 'TikTok', 'Stories'],
            usage_count: 78,
            effectiveness: 9.2
        },
        {
            id: '3',
            name: 'Tom Educativo',
            description: 'Explicativo e didático para conteúdo de valor',
            tone: 'Educativo',
            style: 'Didático',
            personality: ['Paciente', 'Claro', 'Inspirador'],
            example_phrases: [
                'Vou te explicar passo a passo',
                'É importante entender que...',
                'A primeira coisa que você precisa saber'
            ],
            use_cases: ['Blog', 'YouTube', 'Carrosséis'],
            usage_count: 32,
            effectiveness: 8.9
        }
    ];

    const voiceMetrics = [
        {
            title: 'Mais Usado',
            value: mockBrandVoices[1]?.name || 'Tom Casual',
            count: mockBrandVoices[1]?.usage_count || 78,
            trend: '+23%'
        },
        {
            title: 'Mais Efetivo',
            value: mockBrandVoices[1]?.name || 'Tom Casual',
            score: mockBrandVoices[1]?.effectiveness || 9.2,
            trend: '92% engajamento'
        },
        {
            title: 'Total de Voices',
            value: mockBrandVoices.length.toString(),
            count: 'Ativas',
            trend: 'Bem definidas'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Overview das Brand Voices */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl p-4 border border-orange-200 dark:border-orange-700">
                <div className="flex items-center gap-3 mb-3">
                    <Palette className="w-6 h-6 text-orange-600" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Brand Voices
                    </h3>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                    {voiceMetrics.map((metric, index) => (
                        <div key={index}>
                            <div className="text-2xl font-bold text-orange-600">
                                {typeof metric.count === 'number' ? metric.count : metric.value}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                                {metric.title}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                                {metric.trend}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Voice Atual/Ativa */}
            {activeBrandVoice && (
                <Card className="border-2 border-orange-200 dark:border-orange-700">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Volume2 className="w-5 h-5 text-orange-600" />
                            Voice Ativa: {activeBrandVoice.name}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {activeBrandVoice.description}
                        </p>
                        <div className="flex gap-2">
                            <Badge variant="default" className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400">
                                {activeBrandVoice.tone}
                            </Badge>
                            <Badge variant="secondary">
                                {activeBrandVoice.style}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Lista de Brand Voices */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Todas as Brand Voices
                    </h4>
                    <Button
                        size="sm"
                        onClick={() => onAction('create_new_voice')}
                        className="flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Nova Voice
                    </Button>
                </div>

                <div className="space-y-3">
                    {mockBrandVoices.map((voice) => (
                        <Card key={voice.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-base">{voice.name}</CardTitle>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {voice.description}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-green-600 border-green-600">
                                            {voice.effectiveness}/10
                                        </Badge>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => setExpandedVoice(
                                                expandedVoice === voice.id ? null : voice.id
                                            )}
                                        >
                                            {expandedVoice === voice.id ? 'Menos' : 'Mais'}
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-0">
                                <div className="flex gap-2 mb-3">
                                    <Badge variant="default" className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                                        {voice.tone}
                                    </Badge>
                                    <Badge variant="secondary">
                                        {voice.style}
                                    </Badge>
                                    <Badge variant="outline">
                                        {voice.usage_count} usos
                                    </Badge>
                                </div>

                                {expandedVoice === voice.id && (
                                    <div className="space-y-4 border-t pt-4">
                                        <div>
                                            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Personalidade:
                                            </p>
                                            <div className="flex flex-wrap gap-1">
                                                {voice.personality?.map((trait: string, i: number) => (
                                                    <Badge key={i} variant="secondary" className="text-xs">
                                                        {trait}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Frases Exemplo:
                                            </p>
                                            <div className="space-y-1">
                                                {voice.example_phrases?.map((phrase: string, i: number) => (
                                                    <div key={i} className="text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded italic">
                                                        "{phrase}"
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Melhor para:
                                            </p>
                                            <div className="flex flex-wrap gap-1">
                                                {voice.use_cases?.map((useCase: string, i: number) => (
                                                    <Badge key={i} variant="outline" className="text-xs">
                                                        {useCase}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-2 mt-4">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onAction('apply_voice', { voice })}
                                    >
                                        <Volume2 className="w-4 h-4 mr-2" />
                                        Aplicar
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onAction('test_voice', { voice })}
                                    >
                                        <MessageCircle className="w-4 h-4 mr-2" />
                                        Testar
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onAction('edit_voice', { voice })}
                                    >
                                        Editar
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Teste de Voice */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                        Testar Brand Voice
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea
                        placeholder="Digite um texto para ver como ficaria com cada brand voice..."
                        value={testText}
                        onChange={(e) => setTestText(e.target.value)}
                        className="min-h-[80px]"
                    />

                    <div className="flex gap-2">
                        {mockBrandVoices.slice(0, 2).map((voice) => (
                            <Button
                                key={voice.id}
                                size="sm"
                                variant="outline"
                                onClick={() => onAction('test_voice_transform', { voice, text: testText })}
                                disabled={!testText.trim()}
                            >
                                Aplicar {voice.name}
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Ações Inteligentes */}
            <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Ações Inteligentes
                </h4>

                <div className="space-y-2">
                    <Button
                        variant="outline"
                        className="w-full justify-start h-auto p-4"
                        onClick={() => onAction('analyze_voice_consistency')}
                    >
                        <Palette className="w-5 h-5 mr-3 text-blue-600" />
                        <div className="text-left">
                            <div className="font-medium">Analisar Consistência</div>
                            <div className="text-xs text-gray-500">
                                Verificar se suas voices estão bem definidas
                            </div>
                        </div>
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full justify-start h-auto p-4"
                        onClick={() => onAction('suggest_voice_improvements')}
                    >
                        <Sparkles className="w-5 h-5 mr-3 text-purple-600" />
                        <div className="text-left">
                            <div className="font-medium">Sugestões de Melhoria</div>
                            <div className="text-xs text-gray-500">
                                IA sugere melhorias baseadas em performance
                            </div>
                        </div>
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full justify-start h-auto p-4"
                        onClick={() => onAction('create_voice_from_content')}
                    >
                        <Volume2 className="w-5 h-5 mr-3 text-green-600" />
                        <div className="text-left">
                            <div className="font-medium">Criar Voice do Conteúdo</div>
                            <div className="text-xs text-gray-500">
                                Analisar seus posts para criar nova voice
                            </div>
                        </div>
                    </Button>
                </div>
            </div>
        </div>
    );
};
