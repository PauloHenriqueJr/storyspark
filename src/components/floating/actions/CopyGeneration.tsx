import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Wand2, Copy as CopyIcon, Check } from 'lucide-react';

interface CopyGenerationProps {
    onGenerate: (copy: string) => void;
    context: any;
    suggestions: string[];
}

export const CopyGeneration: React.FC<CopyGenerationProps> = ({
    onGenerate,
    context,
    suggestions
}) => {
    const [briefing, setBriefing] = useState('');
    const [platform, setPlatform] = useState('');
    const [copyType, setCopyType] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        if (!briefing.trim()) return;

        setIsGenerating(true);
        try {
            // Simulação de geração - aqui integraria com seu serviço de IA
            await new Promise(resolve => setTimeout(resolve, 2000));
            const generatedCopy = `Copy gerada para ${platform}: ${briefing.substring(0, 100)}...`;
            onGenerate(generatedCopy);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Sugestões Contextuais */}
            <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Sugestões para {context.title}
                </h4>
                <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion, index) => (
                        <Badge
                            key={index}
                            variant="outline"
                            className="cursor-pointer hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-900/20"
                            onClick={() => setBriefing(suggestion)}
                        >
                            {suggestion}
                        </Badge>
                    ))}
                </div>
            </div>

            {/* Briefing */}
            <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-900 dark:text-white">
                    Briefing / Descrição
                </label>
                <Textarea
                    placeholder="Descreva o que você quer comunicar..."
                    value={briefing}
                    onChange={(e) => setBriefing(e.target.value)}
                    className="min-h-[120px]"
                />
            </div>

            {/* Configurações */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-900 dark:text-white">
                        Plataforma
                    </label>
                    <Select value={platform} onValueChange={setPlatform}>
                        <SelectTrigger>
                            <SelectValue placeholder="Escolha a plataforma" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Instagram">📱 Instagram</SelectItem>
                            <SelectItem value="Facebook">📘 Facebook</SelectItem>
                            <SelectItem value="LinkedIn">💼 LinkedIn</SelectItem>
                            <SelectItem value="Email">📧 E-mail</SelectItem>
                            <SelectItem value="WhatsApp">💬 WhatsApp</SelectItem>
                            <SelectItem value="Web">🌐 Web</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-900 dark:text-white">
                        Tipo de Copy
                    </label>
                    <Select value={copyType} onValueChange={setCopyType}>
                        <SelectTrigger>
                            <SelectValue placeholder="Tipo de conteúdo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Post Orgânico">📝 Post Orgânico</SelectItem>
                            <SelectItem value="Anúncio">📢 Anúncio Pago</SelectItem>
                            <SelectItem value="Stories">📱 Stories</SelectItem>
                            <SelectItem value="Email Marketing">📧 E-mail Marketing</SelectItem>
                            <SelectItem value="Landing Page">🌐 Landing Page</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Botão de Geração */}
            <Button
                onClick={handleGenerate}
                disabled={isGenerating || !briefing.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                size="lg"
            >
                {isGenerating ? (
                    <>
                        <Wand2 className="w-4 h-4 mr-2 animate-spin" />
                        Gerando copy com IA...
                    </>
                ) : (
                    <>
                        <Wand2 className="w-4 h-4 mr-2" />
                        Gerar Copy Contextual
                    </>
                )}
            </Button>
        </div>
    );
};
