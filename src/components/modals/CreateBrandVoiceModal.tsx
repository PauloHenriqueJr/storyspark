import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Mic, Target, Users } from 'lucide-react';

interface CreateBrandVoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateVoice?: (voice: any) => void;
  editingVoice?: any;
}

const CreateBrandVoiceModal = ({ open, onOpenChange, onCreateVoice, editingVoice }: CreateBrandVoiceModalProps) => {
  const toneOptions = [
    'Profissional', 'Casual', 'Amigável', 'Inspirador', 'Autoritário', 
    'Empático', 'Divertido', 'Sério', 'Criativo', 'Técnico'
  ];

  const personalityTraits = [
    'Confiável', 'Inovador', 'Empático', 'Energético', 'Sofisticado',
    'Autêntico', 'Acessível', 'Visionário', 'Experiente', 'Colaborativo'
  ];

  const audienceTypes = [
    'Jovens (18-25)', 'Millennials (26-40)', 'Gen X (41-55)', 'Baby Boomers (55+)',
    'Profissionais', 'Estudantes', 'Empreendedores', 'Executivos'
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-primary" />
            Criar Nova Brand Voice
          </DialogTitle>
          <DialogDescription>
            Configure uma nova voz da marca para seus conteúdos
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Básico</TabsTrigger>
            <TabsTrigger value="personality">Personalidade</TabsTrigger>
            <TabsTrigger value="audience">Audiência</TabsTrigger>
            <TabsTrigger value="examples">Exemplos</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome da Voice</Label>
                  <Input 
                    id="name" 
                    placeholder="Ex: Casual & Amigável" 
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Descreva quando usar esta voice..." 
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Tom Principal</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecione o tom" />
                    </SelectTrigger>
                    <SelectContent>
                      {toneOptions.map((tone) => (
                        <SelectItem key={tone} value={tone.toLowerCase()}>
                          {tone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">Preview da Voice</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium mb-1">Exemplo de copy:</p>
                      <p className="text-muted-foreground">
                        "Transforme sua rotina com nossos produtos inovadores! 🌟 
                        Descubra como nossa equipe pode ajudar você a alcançar seus objetivos."
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary">Tom: Casual</Badge>
                      <Badge variant="outline">Emojis: Sim</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="personality" className="space-y-6 mt-6">
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium">Traços de Personalidade</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Selecione até 5 características que definem esta voice
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {personalityTraits.map((trait) => (
                    <div key={trait} className="flex items-center space-x-2">
                      <input type="checkbox" id={trait} className="rounded" />
                      <label htmlFor={trait} className="text-sm">{trait}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="writing-style">Estilo de Escrita</Label>
                  <Textarea 
                    id="writing-style"
                    placeholder="Ex: Frases curtas, uso de emojis, linguagem coloquial..."
                    className="mt-1"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="avoid">O que Evitar</Label>
                  <Textarea 
                    id="avoid"
                    placeholder="Ex: Jargões técnicos, tom formal demais, expressões regionais..."
                    className="mt-1"
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="audience" className="space-y-6 mt-6">
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Público-Alvo
                </Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Defina para quem esta voice se comunica
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {audienceTypes.map((audience) => (
                    <div key={audience} className="flex items-center space-x-2">
                      <input type="checkbox" id={audience} className="rounded" />
                      <label htmlFor={audience} className="text-sm">{audience}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="platforms">Plataformas Preferenciais</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Onde esta voice será mais usada?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="twitter">Twitter/X</SelectItem>
                      <SelectItem value="all">Todas as plataformas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="context">Contexto de Uso</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Quando usar esta voice?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="campaigns">Campanhas publicitárias</SelectItem>
                      <SelectItem value="content">Conteúdo educativo</SelectItem>
                      <SelectItem value="engagement">Engajamento</SelectItem>
                      <SelectItem value="announcements">Comunicados</SelectItem>
                      <SelectItem value="all">Uso geral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="examples" className="space-y-6 mt-6">
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium">Exemplos de Uso</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Forneça exemplos de como esta voice deve soar
                </p>
              </div>

              <div className="grid gap-6">
                <div>
                  <Label htmlFor="good-example">Exemplo BOM ✅</Label>
                  <Textarea 
                    id="good-example"
                    placeholder="Escreva um exemplo de copy que representa bem esta voice..."
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="bad-example">Exemplo RUIM ❌</Label>
                  <Textarea 
                    id="bad-example"
                    placeholder="Escreva um exemplo do que NÃO representa esta voice..."
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="keywords">Palavras-chave e Expressões</Label>
                  <Input 
                    id="keywords"
                    placeholder="Ex: incrível, transformar, descobrir, aproveitar..."
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Separe com vírgulas as palavras que caracterizam esta voice
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-6 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <div className="flex gap-2">
            <Button variant="outline">
              <Target className="w-4 h-4 mr-2" />
              Testar Voice
            </Button>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Sparkles className="w-4 h-4 mr-2" />
              Criar Brand Voice
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBrandVoiceModal;