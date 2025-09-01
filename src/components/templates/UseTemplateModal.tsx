import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Wand2, 
  Sparkles, 
  CheckCircle,
  Copy
} from 'lucide-react';
import type { TemplateWithStats } from '@/services/templatesService';

interface UseTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: TemplateWithStats | null;
  onTemplateProcessed: (processedContent: string, template: TemplateWithStats | null) => void;
}

const UseTemplateModal: React.FC<UseTemplateModalProps> = ({
  open,
  onOpenChange,
  template,
  onTemplateProcessed
}) => {
  const [aiContext, setAiContext] = useState('');
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const { toast } = useToast();

  // Extrai variáveis do template (formato {variavel})
  const extractVariables = (content: string): string[] => {
    const regex = /\{([^}]+)\}/g;
    const matches = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      matches.push(match[1]);
    }
    return [...new Set(matches)]; // Remove duplicatas
  };

  // Formatar nome da variável para exibição
  const formatVariableName = (variable: string): string => {
    return variable
      .replace(/_/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  // Gerar exemplo inteligente baseado no nome da variável E no contexto do template
  const getPlaceholderExample = (variable: string): string => {
    const lowerVar = variable.toLowerCase();
    const templateContent = template?.content?.toLowerCase() || '';
    const templateType = template?.type || 'SOCIAL';
    
    // Análise contextual do template
    const isEcommerce = templateContent.includes('compra') || templateContent.includes('produto');
    const isService = templateContent.includes('serviço') || templateContent.includes('consultoria');
    const isTech = templateContent.includes('app') || templateContent.includes('software');
    const isHealth = templateContent.includes('saúde') || templateContent.includes('médico');
    const isEducation = templateContent.includes('curso') || templateContent.includes('aula');
    
    // Exemplos contextualizados e específicos
    if (lowerVar.includes('nome') && lowerVar.includes('cliente')) return 'Maria Silva';
    if (lowerVar.includes('nome') && lowerVar.includes('empresa')) {
      if (isTech) return 'TechSolutions';
      if (isHealth) return 'Clínica VitaLife';
      return 'MinhaEmpresa Ltda';
    }
    if (lowerVar.includes('produto')) {
      if (isTech) return 'App de Gestão';
      if (isHealth) return 'Plano Premium';
      if (isEducation) return 'Curso Digital';
      return 'Produto Premium';
    }
    if (lowerVar.includes('preco') || lowerVar.includes('valor')) {
      if (isService) return 'R$ 297';
      if (isEducation) return 'R$ 497';
      return 'R$ 199';
    }
    if (lowerVar.includes('desconto')) return '50% OFF';
    if (lowerVar.includes('beneficio')) {
      if (isTech) return 'economia de 10h por semana';
      if (isHealth) return 'melhora em 30 dias';
      return 'resultados garantidos';
    }
    if (lowerVar.includes('problema')) {
      if (isTech) return 'perda de tempo com tarefas manuais';
      if (isHealth) return 'falta de energia no dia a dia';
      return 'baixa produtividade';
    }
    if (lowerVar.includes('acao') || lowerVar.includes('cta')) return 'Clique e garanta sua vaga';
    if (lowerVar.includes('prazo')) return 'até sexta-feira';
    if (lowerVar.includes('publico')) {
      if (isTech) return 'empreendedores digitais';
      if (isHealth) return 'pessoas de 30-50 anos';
      return 'empresários e gestores';
    }
    
    // Variáveis básicas
    if (lowerVar.includes('email')) return 'contato@empresa.com';
    if (lowerVar.includes('telefone')) return '(11) 99999-9999';
    if (lowerVar.includes('cidade')) return 'São Paulo';
    if (lowerVar.includes('data')) return '15 de março';
    if (lowerVar.includes('hora')) return '19h30';
    if (lowerVar.includes('url')) return 'www.empresa.com.br';
    
    return `conteúdo para ${formatVariableName(variable)}`;
  };

  // Gerar exemplo contextual para IA baseado no template específico
  const getContextualAIExample = (): string => {
    const templateContent = template?.content?.toLowerCase() || '';
    const templateType = template?.type || 'SOCIAL';
    const templateName = template?.name?.toLowerCase() || '';
    
    // Análise do conteúdo do template
    const isEcommerce = templateContent.includes('compra') || templateContent.includes('produto') || templateContent.includes('loja');
    const isService = templateContent.includes('serviço') || templateContent.includes('consultoria') || templateContent.includes('atendimento');
    const isTech = templateContent.includes('app') || templateContent.includes('software') || templateContent.includes('digital') || templateContent.includes('sistema');
    const isHealth = templateContent.includes('saúde') || templateContent.includes('médico') || templateContent.includes('clínica') || templateContent.includes('fitness');
    const isEducation = templateContent.includes('curso') || templateContent.includes('aula') || templateContent.includes('ensino') || templateContent.includes('aprender');
    const isReal = templateContent.includes('imóvel') || templateContent.includes('casa') || templateContent.includes('apartamento');
    const isBeauty = templateContent.includes('beleza') || templateContent.includes('estética') || templateContent.includes('cabelo');
    const isFood = templateContent.includes('restaurante') || templateContent.includes('comida') || templateContent.includes('delivery');

    // Gerar exemplo baseado no contexto do template
    if (isTech) {
      return 'Lançamento de app de gestão financeira, público empreendedores de 25-45 anos, mensalidade R$ 99, benefício principal é controle automatizado, oferta especial primeiro mês grátis';
    }
    if (isHealth) {
      return 'Programa de emagrecimento saudável, público mulheres de 30-50 anos, investimento R$ 397, resultado garantido perda de 5kg em 30 dias, desconto 40% para primeiras 50 vagas';
    }
    if (isEducation) {
      return 'Curso online de Marketing Digital, público profissionais em transição, preço R$ 497, certificado reconhecido pelo MEC, bônus mentorias individuais, última semana de inscrições';
    }
    if (isEcommerce) {
      return 'Black Friday loja de roupas femininas, público mulheres de 20-40 anos, descontos até 70%, produtos vestidos e acessórios, frete grátis acima R$ 150, válido apenas 3 dias';
    }
    if (isService) {
      return 'Consultoria empresarial personalizada, público CEOs e diretores, investimento R$ 2.500, garantia de aumento de 30% na produtividade, apenas 10 vagas por mês';
    }
    if (isReal) {
      return 'Apartamento de 2 quartos no centro, público jovens casais, preço R$ 280.000, financiamento facilitado, área de lazer completa, últimas unidades disponíveis';
    }
    if (isBeauty) {
      return 'Tratamento de rejuvenescimento facial, público mulheres de 35-60 anos, sessão R$ 350, resultado visível em 7 dias, promoção 3 sessões por 2, agendamento limitado';
    }
    if (isFood) {
      return 'Restaurante de comida caseira delivery, público famílias, pratos a partir de R$ 25, entrega em 30 minutos, desconto 20% primeira compra, área de cobertura zona sul';
    }

    // Exemplo genérico baseado no tipo do template
    if (templateType === 'EMAIL') {
      return 'Campanha email para lançamento de produto, público clientes VIP, oferta exclusiva com 30% desconto, válido por 48 horas apenas, call to action clique aqui';
    }
    if (templateType === 'AD') {
      return 'Anúncio para captação de leads, público interessados em investimento, ebook gratuito sobre finanças, público 25-55 anos, região São Paulo e grande ABC';
    }
    if (templateType === 'BLOG') {
      return 'Artigo sobre produtividade no trabalho, público profissionais liberais, dicas práticas para otimizar tempo, call to action baixar planilha gratuita';
    }
    if (templateType === 'LANDING') {
      return 'Landing page para webinar gratuito, público empreendedores iniciantes, tema como validar ideias de negócio, data próxima quinta 19h, vagas limitadas';
    }

    // Fallback genérico
    return 'Campanha para seu negócio, público seu cliente ideal, produto/serviço principal, preço atrativo, benefício exclusivo, oferta por tempo limitado';
  };

  // Processa o template substituindo variáveis
  const processTemplate = (content: string, vars: Record<string, string>): string => {
    let processed = content;
    Object.entries(vars).forEach(([key, value]) => {
      const regex = new RegExp(`\\{${key}\\}`, 'g');
      processed = processed.replace(regex, value.trim() || `{${key}}`);
    });
    
    // Melhorar formatação do conteúdo processado
    processed = processed
      // Primeiro, converter diferentes tipos de quebras de linha
      .replace(/\\n/g, '\n')         // \n literal para quebra real
      .replace(/\r\n/g, '\n')        // Windows line endings
      .replace(/\r/g, '\n')          // Mac line endings
      
      // Corrigir formatação de slides/seções
      .replace(/Slide\s*(\d+)[:\-.]?\s*/gi, '\n\n📍 Slide $1:\n')
      .replace(/Seção\s*(\d+)[:\-.]?\s*/gi, '\n\n📍 Seção $1:\n')
      .replace(/Parte\s*(\d+)[:\-.]?\s*/gi, '\n\n📍 Parte $1:\n')
      
      // Melhorar formatação de listas
      .replace(/^(\d+)\.\s*/gm, '\n• ')
      .replace(/^[-*]\s*/gm, '\n• ')
      .replace(/^[•]\s*/gm, '\n• ')
      
      // Corrigir espaçamento após pontuação
      .replace(/([.!?])\s*([A-ZÁÀÂÃÉÊÍÓÔÕÚÇ])/g, '$1\n\n$2')
      .replace(/:\s*([A-ZÁÀÂÃÉÊÍÓÔÕÚÇ])/g, ':\n$1')
      
      // Limpar espaços e quebras excessivas
      .replace(/[ \t]+/g, ' ')           // Múltiplos espaços
      .replace(/\n{3,}/g, '\n\n')        // Múltiplas quebras
      .replace(/^\s+|\s+$/g, '')         // Espaços no início/fim
      .replace(/\n\s*\n/g, '\n\n')       // Quebras com espaços
      
      // Formatação final
      .trim();
      
    return processed;
  };

  // Resetar estado quando modal abrir/fechar
  useEffect(() => {
    if (open) {
      setAiContext('');
    }
  }, [open]);

  const handleUseWithAI = async () => {
    if (!aiContext.trim()) {
      toast({
        title: "Contexto necessário",
        description: "Descreva o contexto para a IA processar o template automaticamente.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessingAI(true);
    try {
      // Simular processamento com IA (você pode integrar com seu serviço de IA)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Processar template automaticamente baseado no contexto
      const processed = processTemplate(template.content, {});
      
      toast({
        title: "✨ Copy finalizada com IA!",
        description: "Conteúdo gerado automaticamente e copiado para área de transferência.",
      });

      // Copiar para clipboard
      try {
        await navigator.clipboard.writeText(processed);
      } catch (error) {
        console.log('Clipboard não disponível');
      }

      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro no processamento IA",
        description: "Não foi possível processar com IA. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsProcessingAI(false);
    }
  };

  const handleUseTemplateSimple = async () => {
    try {
      const processed = processTemplate(template.content, {});
      await navigator.clipboard.writeText(processed);
      toast({
        title: "✅ Copy finalizada e copiada!",
        description: "Conteúdo copiado para área de transferência.",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Copy finalizada!",
        description: "Conteúdo processado com sucesso.",
      });
      onOpenChange(false);
    }
  };

  if (!template) return null;

  const templateVariables = extractVariables(template.content);
  const hasVariables = templateVariables.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-primary" />
            Usar Template: {template.name}
          </DialogTitle>
          <DialogDescription className="space-y-3">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  🚀
                </div>
                <div>
                  <p className="font-medium text-blue-800 mb-2">Processamento Inteligente:</p>
                  <div className="text-sm text-blue-700">
                    <p>✨ <strong>IA Automática:</strong> Descreva seu contexto e a IA preenche todas as variáveis automaticamente, gerando sua copy personalizada em segundos!</p>
                  </div>
                </div>
              </div>
            </div>
            
          </DialogDescription>
        </DialogHeader>

        {hasVariables ? (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Wand2 className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-purple-800">Processamento Automático com IA</h3>
                <Badge className="bg-purple-100 text-purple-800">Inteligente ⭐</Badge>
              </div>
              <div className="text-sm text-purple-700 mb-4">
                <p className="mb-2">Descreva o contexto da sua campanha e a IA preencherá automaticamente todas as variáveis do template!</p>
                {template && (
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <p className="font-medium mb-1">Exemplo para este template:</p>
                    <p className="text-xs">{getContextualAIExample()}</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="aiContext" className="text-base font-medium">
                  Descreva o Contexto da Campanha
                </Label>
                <Textarea
                  id="aiContext"
                  value={aiContext}
                  onChange={(e) => setAiContext(e.target.value)}
                  placeholder="Exemplo: Campanha de Black Friday para loja de roupas femininas, público mulheres 25-40 anos, desconto 50%, produtos vestidos e acessórios, urgência apenas 3 dias..."
                  className="min-h-[120px] resize-none"
                />
                
                <Button
                  onClick={handleUseWithAI}
                  disabled={isProcessingAI || !aiContext.trim()}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  size="lg"
                >
                  {isProcessingAI ? (
                    <>
                      <Wand2 className="w-4 h-4 mr-2 animate-spin" />
                      IA Processando Template...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      ✨ Processar com IA e Finalizar Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              ✅
            </div>
            <h3 className="text-lg font-semibold mb-2 text-green-800">Template Pronto para Uso</h3>
            <p className="text-muted-foreground mb-4">
              Este template não precisa de personalização. Clique em "Finalizar Copy" para processar e copiar o conteúdo.
            </p>
            <div className="bg-muted/20 border rounded-lg p-4 text-left">
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed bg-transparent font-sans">
                  {processTemplate(template.content, {})}
                </pre>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          
          {!hasVariables && (
            <Button
              onClick={handleUseTemplateSimple}
              className="bg-gradient-primary hover:shadow-glow flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              ✨ Finalizar Copy
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
      
    </Dialog>
  );
};

export default UseTemplateModal;