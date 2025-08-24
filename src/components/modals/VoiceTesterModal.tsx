import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { TestTube, Sparkles, Copy, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceTesterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  voice: any;
}

const VoiceTesterModal = ({ open, onOpenChange, voice }: VoiceTesterModalProps) => {
  const { toast } = useToast();
  const [testText, setTestText] = useState('');
  const [generatedResults, setGeneratedResults] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateTest = async () => {
    if (!testText.trim()) {
      toast({
        title: "Texto necessário",
        description: "Digite um texto para testar a voice.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const baseText = testText.trim();
      const tone = voice?.tone?.toLowerCase() || 'casual';
      const style = voice?.style?.toLowerCase() || 'conversacional';
      const examples = voice?.examples || [];
      const guidelines = voice?.guidelines || '';
      
      const variations = [];
      
      // Adaptação baseada no tom específico
      let toneVariation = baseText;
      switch (tone) {
        case 'energético':
          toneVariation = `🚀 ${baseText} Vamos transformar isso em realidade!`;
          break;
        case 'profissional':
          toneVariation = `${baseText}. Este é nosso compromisso com a excelência e qualidade.`;
          break;
        case 'casual':
          toneVariation = `Oi! ${baseText} 😊 Que tal isso?`;
          break;
        case 'inspirador':
          toneVariation = `✨ ${baseText} Juntos, podemos alcançar o impossível!`;
          break;
        default:
          toneVariation = `${baseText} [Tom ${voice?.tone}]`;
      }
      variations.push(toneVariation);
      
      // Adaptação baseada no estilo específico
      let styleVariation = baseText;
      switch (style) {
        case 'provocativo':
          styleVariation = `Enquanto outros seguem o tradicional, ${baseText.toLowerCase()} - e isso é só o começo da revolução.`;
          break;
        case 'conversacional':
          styleVariation = `Você sabia que ${baseText.toLowerCase()}? É exatamente isso que oferecemos!`;
          break;
        case 'persuasivo':
          styleVariation = `${baseText} Não perca esta oportunidade única. Garante já o seu!`;
          break;
        case 'direto':
          styleVariation = `${baseText}. Simples assim.`;
          break;
        case 'técnico':
          styleVariation = `Nossa solução: ${baseText} - desenvolvida com tecnologia de ponta.`;
          break;
        default:
          styleVariation = `${baseText} [Estilo ${voice?.style}]`;
      }
      variations.push(styleVariation);
      
      // Variação baseada nas diretrizes e características da voice
      if (guidelines.includes('provocativo') || guidelines.includes('revolução')) {
        variations.push(`🔥 Disrupção real: ${baseText} - pare de pedir permissão para inovar!`);
      } else if (guidelines.includes('empático') || guidelines.includes('humanizado')) {
        variations.push(`Entendemos você: ${baseText} - estamos aqui para apoiar sua jornada.`);
      } else if (guidelines.includes('técnico') || guidelines.includes('dados')) {
        variations.push(`${baseText} | Baseado em dados e resultados comprovados.`);
      } else {
        // Variação genérica baseada no nome da voice
        if (voice?.name?.includes('Disruptiva')) {
          variations.push(`⚡ Quebrar paradigmas: ${baseText} - não é hobby, é nossa missão diária.`);
        } else if (voice?.name?.includes('Premium')) {
          variations.push(`${baseText} - experiência premium que você merece.`);
        } else {
          variations.push(`${baseText} | Adaptado para o estilo ${voice?.name}.`);
        }
      }
      
      setGeneratedResults(variations);
      
      toast({
        title: "Teste concluído",
        description: `Geramos ${variations.length} variações usando a voice "${voice?.name}".`,
      });
    } catch (error) {
      toast({
        title: "Erro no teste",
        description: "Não foi possível gerar as variações. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Texto copiado para a área de transferência.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TestTube className="w-5 h-5 text-primary" />
            Testar Voice: {voice?.name}
          </DialogTitle>
          <DialogDescription>
            Digite um texto para ver como ficaria adaptado para a voice "{voice?.name}" com tom {voice?.tone}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Características da Voice */}
          <Card className="bg-muted/50">
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Tom:</span> 
                  <Badge variant="outline" className="ml-2">{voice?.tone}</Badge>
                </div>
                <div>
                  <span className="font-medium">Estilo:</span> 
                  <Badge variant="outline" className="ml-2">{voice?.style}</Badge>
                </div>
                {voice?.guidelines && (
                  <div className="col-span-2">
                    <span className="font-medium">Diretrizes:</span>
                    <p className="text-muted-foreground mt-1">{voice?.guidelines}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div>
            <Label htmlFor="testText">Texto para testar</Label>
            <Textarea
              id="testText"
              placeholder="Digite o texto que deseja adaptar para esta voice..."
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleGenerateTest}
              disabled={isGenerating || !testText.trim()}
              className="flex items-center gap-2"
            >
              {isGenerating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {isGenerating ? 'Gerando...' : 'Testar Voice'}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                setTestText('');
                setGeneratedResults([]);
              }}
            >
              Limpar
            </Button>
          </div>

          {generatedResults.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Resultados do Teste</Badge>
                <span className="text-sm text-muted-foreground">
                  {generatedResults.length} variações geradas
                </span>
              </div>
              
              {generatedResults.map((result, index) => (
                <Card key={index}>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start gap-2">
                      <p className="text-sm flex-1">{result}</p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(result)}
                        className="shrink-0"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VoiceTesterModal;