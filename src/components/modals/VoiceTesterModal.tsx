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
    
    // Simular geração de variações usando a voice
    setTimeout(() => {
      const variations = [
        `${testText} (Adaptado para ${voice?.tone})`,
        `${testText} - versão mais ${voice?.tone?.toLowerCase()}`,
        `${testText} com o estilo ${voice?.name}`
      ];
      
      setGeneratedResults(variations);
      setIsGenerating(false);
      
      toast({
        title: "Teste concluído",
        description: `Geramos 3 variações usando a voice "${voice?.name}".`,
      });
    }, 2000);
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