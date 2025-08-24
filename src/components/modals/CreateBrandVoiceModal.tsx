import React, { useState, useEffect } from 'react';
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
import type { BrandVoice } from '@/services/brandVoicesService';

interface CreateBrandVoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateVoice?: (voice: Partial<BrandVoice>) => void;
  editingVoice?: BrandVoice;
}

interface FormData {
  name: string;
  description: string;
  tone: string;
  style: string;
  personalityTraits: string[];
  audience: string[];
  platform: string;
  context: string;
  writingStyle: string;
  avoid: string;
  goodExample: string;
  badExample: string;
  keywords: string;
}

const CreateBrandVoiceModal = ({ open, onOpenChange, onCreateVoice, editingVoice }: CreateBrandVoiceModalProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    tone: '',
    style: '',
    personalityTraits: [],
    audience: [],
    platform: '',
    context: '',
    writingStyle: '',
    avoid: '',
    goodExample: '',
    badExample: '',
    keywords: ''
  });

  // Reset form when modal opens/closes or editing voice changes
  useEffect(() => {
    if (editingVoice) {
      setFormData({
        name: editingVoice.name || '',
        description: editingVoice.description || '',
        tone: editingVoice.tone || '',
        style: editingVoice.style || '',
        personalityTraits: Array.isArray(editingVoice.personality_traits) ? editingVoice.personality_traits : [],
        audience: Array.isArray(editingVoice.audience) ? editingVoice.audience : [],
        platform: editingVoice.platform || '',
        context: editingVoice.context || '',
        writingStyle: editingVoice.writing_style || '',
        avoid: editingVoice.avoid || '',
        goodExample: editingVoice.good_example || '',
        badExample: editingVoice.bad_example || '',
        keywords: typeof editingVoice.keywords === 'string' ? editingVoice.keywords : ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        tone: '',
        style: '',
        personalityTraits: [],
        audience: [],
        platform: '',
        context: '',
        writingStyle: '',
        avoid: '',
        goodExample: '',
        badExample: '',
        keywords: ''
      });
    }
  }, [editingVoice, open]);

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.description.trim() || !formData.tone) {
      alert('Por favor, preencha pelo menos o nome, descrição e tom principal.');
      return;
    }

    const voiceData: Partial<BrandVoice> = {
      name: formData.name,
      description: formData.description,
      tone: formData.tone,
      style: formData.style || formData.writingStyle,
      examples: [], // Garantir que seja um array vazio se não fornecido
      personality_traits: formData.personalityTraits,
      audience: formData.audience.join(', '), // Converter array para string conforme a interface
      platform: formData.platform,
      context: formData.context,
      writing_style: formData.writingStyle,
      avoid: formData.avoid,
      good_example: formData.goodExample,
      bad_example: formData.badExample,
      keywords: formData.keywords.split(',').map(k => k.trim()).filter(k => k) // Converter string para array
    };

    onCreateVoice?.(voiceData);
  };

  const togglePersonalityTrait = (trait: string) => {
    setFormData(prev => ({
      ...prev,
      personalityTraits: prev.personalityTraits.includes(trait)
        ? prev.personalityTraits.filter(t => t !== trait)
        : [...prev.personalityTraits, trait]
    }));
  };

  const toggleAudience = (audienceType: string) => {
    setFormData(prev => ({
      ...prev,
      audience: prev.audience.includes(audienceType)
        ? prev.audience.filter(a => a !== audienceType)
        : [...prev.audience, audienceType]
    }));
  };
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
            {editingVoice ? 'Editar Brand Voice' : 'Criar Nova Brand Voice'}
          </DialogTitle>
          <DialogDescription className="space-y-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="font-medium text-blue-900 mb-2">🎯 O que é uma Brand Voice?</div>
              <div className="text-sm text-blue-800 mb-2">
                A Brand Voice é a <strong>personalidade e tom</strong> da sua marca nas comunicações. É como sua marca "fala" com seu público.
              </div>
              <div className="text-xs text-blue-700 space-y-1">
                <div>• <strong>Tom:</strong> Formal, casual, amigável, profissional...</div>
                <div>• <strong>Personalidade:</strong> Confiável, inovadora, empática, divertida...</div>
                <div>• <strong>Estilo:</strong> Frases curtas, uso de emojis, linguagem técnica...</div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              💡 <strong>Como será usada:</strong> Quando você gerar copies no Composer, a IA usará automaticamente esta personalidade para criar conteúdos alinhados com sua marca.
            </div>
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
                  <Label htmlFor="name" className="text-sm font-medium">
                    Nome da Brand Voice
                    <span className="text-xs text-muted-foreground ml-2">(Como você identificará esta personalidade)</span>
                  </Label>
                  <Input 
                    id="name" 
                    placeholder="Ex: Jovem e Descontraída, Profissional Confiável, Tech Inovadora..." 
                    className="mt-1"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    💡 Escolha um nome que deixe claro a personalidade desta voz
                  </p>
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-medium">
                    Descrição e Contexto de Uso
                    <span className="text-xs text-muted-foreground ml-2">(Quando e como usar esta voz)</span>
                  </Label>
                  <Textarea 
                    id="description" 
                    placeholder="Ex: Use para posts no Instagram direcionados ao público jovem (18-25 anos). Ideal para campanhas de lifestyle e produtos casuais. Tom descontraído com emojis e gírias atuais..." 
                    className="mt-1"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    📝 Explique quando usar: tipo de conteúdo, público, situações específicas
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium">
                    Tom Principal da Comunicação
                    <span className="text-xs text-muted-foreground ml-2">(Como sua marca "fala")</span>
                  </Label>
                  <Select value={formData.tone} onValueChange={(value) => setFormData(prev => ({ ...prev, tone: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Escolha o tom que representa sua marca" />
                    </SelectTrigger>
                    <SelectContent>
                      {toneOptions.map((tone) => (
                        <SelectItem key={tone} value={tone.toLowerCase()}>
                          {tone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    🎯 Este será o tom predominante em todas as suas comunicações
                  </p>
                </div>
              </div>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">Preview em Tempo Real</h3>
                  </div>
                  <div className="space-y-4 text-sm">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                      <p className="font-medium mb-2 text-blue-900">📝 Como sua copy ficará:</p>
                      <p className="text-blue-800 italic">
                        {formData.goodExample || 
                          `"${formData.tone === 'casual' ? 'Oi, pessoal!' : formData.tone === 'profissional' ? 'Olá!' : 'Hey!'} 
                          ${formData.tone === 'casual' ? '🌟' : ''} Descobra nossa ${formData.name || 'nova proposta'}! 
                          ${formData.personalityTraits.includes('Inovador') ? 'Inovação' : 'Qualidade'} que transforma sua experiência. 
                          ${formData.tone === 'casual' ? 'Vem conferir! 💕' : 'Conheça agora!'}"`
                        }
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="secondary" className="text-xs">
                          Tom: {formData.tone || 'Não definido'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Emojis: {formData.tone === 'casual' || formData.writingStyle.includes('emoji') ? 'Frequentes' : 'Moderados'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Público: {formData.audience.length > 0 ? formData.audience[0] : 'Geral'}
                        </Badge>
                        {formData.personalityTraits.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {formData.personalityTraits[0]}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        ⚡ Este preview é atualizado conforme você preenche os campos
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="personality" className="space-y-6 mt-6">
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium">Traços de Personalidade da Marca</Label>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
                  <p className="text-sm text-amber-800">
                    <strong>💭 Pense assim:</strong> Se sua marca fosse uma pessoa, como ela seria? Escolha até 5 características que a definem.
                  </p>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Estas características influenciarão o tom e estilo de toda comunicação
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {personalityTraits.map((trait) => (
                    <div key={trait} className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id={trait} 
                        className="rounded" 
                        checked={formData.personalityTraits.includes(trait)}
                        onChange={() => togglePersonalityTrait(trait)}
                      />
                      <label htmlFor={trait} className="text-sm">{trait}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="writing-style" className="text-sm font-medium">
                    Estilo de Escrita e Linguagem
                    <span className="text-xs text-muted-foreground ml-2">(Como estruturar as frases)</span>
                  </Label>
                  <Textarea 
                    id="writing-style"
                    placeholder="Ex: Frases curtas e diretas, uso frequente de emojis (🚀✨), linguagem coloquial com 'você', perguntas retóricas para engajar, sempre com call-to-action no final..."
                    className="mt-1"
                    rows={4}
                    value={formData.writingStyle}
                    onChange={(e) => setFormData(prev => ({ ...prev, writingStyle: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    ✍️ Descreva estrutura de frases, pontuação, emojis, linguagem formal/informal
                  </p>
                </div>

                <div>
                  <Label htmlFor="avoid" className="text-sm font-medium">
                    O que Evitar na Comunicação
                    <span className="text-xs text-muted-foreground ml-2">(Palavras/tons que não combinam)</span>
                  </Label>
                  <Textarea 
                    id="avoid"
                    placeholder="Ex: Evitar jargões técnicos complexos, linguagem muito formal ou robótica, expressões regionais específicas, tom agressivo ou pressão excessiva para compra..."
                    className="mt-1"
                    rows={4}
                    value={formData.avoid}
                    onChange={(e) => setFormData(prev => ({ ...prev, avoid: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    🚫 Liste palavras, tons ou estilos que contradizem sua marca
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="audience" className="space-y-6 mt-6">
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Definição do Público-Alvo
                </Label>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                  <p className="text-sm text-green-800">
                    <strong>🎯 Importante:</strong> A mesma marca pode ter Brand Voices diferentes para públicos diferentes. 
                    Ex: Uma voz mais formal para executivos e outra mais casual para jovens.
                  </p>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Selecione o(s) público(s) que receberão esta comunicação específica
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {audienceTypes.map((audience) => (
                    <div key={audience} className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id={audience} 
                        className="rounded" 
                        checked={formData.audience.includes(audience)}
                        onChange={() => toggleAudience(audience)}
                      />
                      <label htmlFor={audience} className="text-sm">{audience}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="platforms" className="text-sm font-medium">
                    Plataformas Preferenciais
                    <span className="text-xs text-muted-foreground ml-2">(Onde esta voz funcionará melhor)</span>
                  </Label>
                  <Select value={formData.platform} onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Em qual rede social esta voz será mais usada?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instagram">Instagram (visual, jovem, casual)</SelectItem>
                      <SelectItem value="linkedin">LinkedIn (profissional, B2B)</SelectItem>
                      <SelectItem value="facebook">Facebook (geral, conversacional)</SelectItem>
                      <SelectItem value="twitter">Twitter/X (direto, rápido)</SelectItem>
                      <SelectItem value="all">Todas as plataformas</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    📱 Cada rede social tem suas características específicas de comunicação
                  </p>
                </div>

                <div>
                  <Label htmlFor="context" className="text-sm font-medium">
                    Contexto e Momento de Uso
                    <span className="text-xs text-muted-foreground ml-2">(Em que situações aplicar)</span>
                  </Label>
                  <Select value={formData.context} onValueChange={(value) => setFormData(prev => ({ ...prev, context: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Quando e para que usar esta Brand Voice?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="campaigns">Campanhas publicitárias (vendas, promoções)</SelectItem>
                      <SelectItem value="content">Conteúdo educativo (dicas, tutoriais)</SelectItem>
                      <SelectItem value="engagement">Engajamento (interação, comunidade)</SelectItem>
                      <SelectItem value="announcements">Comunicados (novidades, avisos)</SelectItem>
                      <SelectItem value="all">Uso geral (qualquer situação)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    🎪 O contexto influencia muito o tom ideal da comunicação
                  </p>
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
                  <Label htmlFor="good-example" className="text-sm font-medium">
                    Exemplo de Copy IDEAL ✅
                    <span className="text-xs text-muted-foreground ml-2">(Como sua marca DEVE soar)</span>
                  </Label>
                  <Textarea 
                    id="good-example"
                    placeholder="Ex: 'Oi, pessoal! 🌟 Vocês já viram nossa nova coleção? É puro amor! Cada peça foi pensada pra vocês arrasarem no dia a dia. Corre lá no link da bio e se apaixone também! 💕 #NewCollection'"
                    className="mt-1"
                    rows={4}
                    value={formData.goodExample}
                    onChange={(e) => setFormData(prev => ({ ...prev, goodExample: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    💯 Escreva um exemplo real de como esta Brand Voice deve se comunicar
                  </p>
                </div>

                <div>
                  <Label htmlFor="bad-example" className="text-sm font-medium">
                    Exemplo de Copy INADEQUADA ❌
                    <span className="text-xs text-muted-foreground ml-2">(Como sua marca NÃO deve soar)</span>
                  </Label>
                  <Textarea 
                    id="bad-example"
                    placeholder="Ex: 'Prezados clientes, gostaríamos de informar sobre nosso novo portfólio de produtos. Solicitamos que analisem as especificações técnicas disponíveis em nosso website corporativo para tomada de decisão de aquisição.'"
                    className="mt-1"
                    rows={4}
                    value={formData.badExample}
                    onChange={(e) => setFormData(prev => ({ ...prev, badExample: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    ⚠️ Mostre um exemplo do que vai contra a personalidade desta Brand Voice
                  </p>
                </div>

                <div>
                  <Label htmlFor="keywords" className="text-sm font-medium">
                    Palavras-chave e Expressões Características
                    <span className="text-xs text-muted-foreground ml-2">(Vocabulário típico desta voz)</span>
                  </Label>
                  <Input 
                    id="keywords"
                    placeholder="Ex: incrível, transformar, descobrir, aproveitar, experiência única, inovação, conectar, inspirar, empoderar..."
                    className="mt-1"
                    value={formData.keywords}
                    onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    🔑 Liste palavras que aparecem frequentemente nesta Brand Voice (separe com vírgulas)
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
            <Button className="bg-gradient-primary hover:opacity-90" onClick={handleSubmit}>
              <Sparkles className="w-4 h-4 mr-2" />
              {editingVoice ? 'Atualizar Brand Voice' : 'Criar Brand Voice'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBrandVoiceModal;