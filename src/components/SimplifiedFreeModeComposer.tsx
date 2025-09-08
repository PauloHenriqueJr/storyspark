import { useState, useCallback, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { notifications } from "@/lib/notifications";
import { QuickConfigSelector } from "./QuickConfigSelector";
import { ToneSelector } from "./ToneSelector";
import { storage, aiProvider } from "@/lib/adapters";
import { copiesService } from "@/services/copiesService";
import { useWorkspace } from "@/hooks/useWorkspace";
import { supabase } from "@/lib/supabase";
import { TEMPLATES, TONES, getCategoryColor, getDifficultyColor, type Template, type Tone } from "@/lib/templates";
import { CopyResultActions } from "./CopyResultActions";
import { RefreshCw, ArrowLeft, ChevronRight, Brain, AlertCircle, CreditCard, TrendingUp, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Hook } from "@/data/hooks";
import { HookQuickPicker } from "@/components/HookQuickPicker";
import { useNotifications } from '@/hooks/useNotifications';
import { aiContingencyService } from '@/services/aiContingencyService';

interface SimplifiedFreeModeComposerProps {
  credits: number;
  onCreditsUpdate: (credits: number) => void;
  onStatsUpdate?: () => void;
  initialTemplateId?: string;
  onInitialTemplateConsumed?: () => void;
  initialHook?: Hook | null;
  onStepChange?: (step: number) => void;
}

interface QuickConfig { produto: string; publico: string; objetivo: string; canal: string; }

interface StepProgress {
  step: 1 | 2 | 3 | 4;
  selectedTemplate: Template | null;
  selectedTone: Tone | null;
  quickConfig: QuickConfig;
  customInputs: Record<string, string>;
}

export const SimplifiedFreeModeComposer = ({ credits, onCreditsUpdate, onStatsUpdate, initialTemplateId, onInitialTemplateConsumed, initialHook, onStepChange }: SimplifiedFreeModeComposerProps) => {
  const { toast } = useToast();
  const { workspace, user } = useWorkspace();
  const { addNotification } = useNotifications();
  const [progress, setProgress] = useState<StepProgress>({ step: 1, selectedTemplate: null, selectedTone: null, quickConfig: { produto: '', publico: '', objetivo: '', canal: '' }, customInputs: {} });
  const [generatedCopy, setGeneratedCopy] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedHook, setSelectedHook] = useState<Hook | null>(initialHook || null);

  useEffect(() => {
    if (initialTemplateId) {
      const template = TEMPLATES.find(t => t.id === initialTemplateId);
      if (template) {
        setProgress(prev => ({ ...prev, step: 2, selectedTemplate: template, customInputs: {} }));
        setGeneratedCopy("");
        onInitialTemplateConsumed?.();
        onStepChange?.(2);
      }
    }
  }, [initialTemplateId, onInitialTemplateConsumed]);

  const handleTemplateSelect = useCallback((template: Template) => {
    setProgress(prev => ({ ...prev, step: 2, selectedTemplate: template, customInputs: {} }));
    setGeneratedCopy("");
    onStepChange?.(2);
  }, [onStepChange]);

  const handleToneSelect = useCallback((tone: Tone) => { setProgress(prev => ({ ...prev, step: 3, selectedTone: tone })); onStepChange?.(3); }, [onStepChange]);
  const handleQuickConfigChange = useCallback((config: Partial<QuickConfig>) => { setProgress(prev => ({ ...prev, quickConfig: { ...prev.quickConfig, ...config } })); }, []);
  const handleQuickConfigComplete = useCallback(() => { setProgress(prev => ({ ...prev, step: 4 })); onStepChange?.(4); }, [onStepChange]);
  const handleCustomInputChange = useCallback((fieldId: string, value: string) => {
    setProgress(prev => ({
      ...prev,
      customInputs: { ...prev.customInputs, [fieldId]: value }
    }));
  }, []);

  // Navigation
  const goToStep = useCallback((step: 1 | 2 | 3 | 4) => {
    if (step <= progress.step || step === 1) {
      setProgress(prev => ({ ...prev, step }));
      onStepChange?.(step);
    }
  }, [progress.step, onStepChange]);

  const canProceedToGeneration = useMemo(() => {
    if (!progress.selectedTemplate || !progress.selectedTone) return false;
    const requiredFields = progress.selectedTemplate.requiredFields.filter(field => field.required);
    const hasAllRequiredInputs = requiredFields.every(field => progress.customInputs[field.id]?.trim());
    return hasAllRequiredInputs;
  }, [progress.selectedTemplate, progress.selectedTone, progress.customInputs]);

  const handleGenerate = useCallback(async () => {
    if (!canProceedToGeneration || !progress.selectedTemplate || !progress.selectedTone) {
      notifications.error.requiredFields();
      return;
    }

    // Verificar créditos localmente (simulação para desenvolvimento)
    if (credits < 1) {
      addNotification({
        title: '⚡ Créditos Insuficientes',
        message: 'Você precisa de pelo menos 1 crédito para gerar uma copy.',
        type: 'error',
        action: {
          label: 'Fazer Upgrade',
          onClick: () => window.location.href = '/billing'
        }
      });
      return;
    }

    setIsGenerating(true);
    try {
      let processedPrompt = progress.selectedTemplate.promptBase;
      processedPrompt = processedPrompt
        .replace(/\{publico\}/g, progress.quickConfig.publico || 'público')
        .replace(/\{objetivo\}/g, progress.quickConfig.objetivo || 'engajar')
        .replace(/\{canal\}/g, progress.quickConfig.canal || 'redes sociais')
        .replace(/\{tom\}/g, progress.selectedTone.value);

      const outputRules = `\n\nREGRAS DE SAÍDA (OBRIGATÓRIAS):\n- Responda APENAS com a copy final (sem explicações, títulos ou prefixos como \"Copy:\").\n- NÃO use Markdown (sem * ou **, sem ###), nem blocos de código.\n- Integre naturalmente o hook se existir, sem repeti-lo literalmente.\n- Use quebras de linha compatíveis com ${progress.quickConfig.canal || progress.selectedTemplate.platform}.\n- Escreva 100% em pt-BR.\n`;
      for (const field of progress.selectedTemplate.requiredFields) {
        const value = progress.customInputs[field.id] || '';
        processedPrompt = processedPrompt.replace(new RegExp(`\\{${field.id}\\}`, 'g'), value);
      }
      if (selectedHook) {
        const hookCtx = `Contexto de Hook (usar de forma natural, sem repetir literalmente):\n- Texto do hook: \"${selectedHook.text}\"\n- Categoria: ${selectedHook.category}\n- Exemplo de aplicação: \"${selectedHook.example}\"\n\n`;
        processedPrompt = hookCtx + processedPrompt;
      }
      processedPrompt += outputRules;
      // Usar o sistema real de IA com contingência
      const aiRequest = {
        prompt: processedPrompt,
        maxTokens: 1000,
        temperature: 0.7,
        userId: user?.id || 'anonymous',
        context: 'composer_simplified_mode'
      };

      const systemRules = "Você é um copywriter sênior. Use meta-informações (persona, faixa etária, variáveis internas) apenas como contexto e NUNCA as mencione explicitamente no texto. Retorne apenas a copy final, sem títulos, sem instruções e sem Markdown. Não escreva 'Copy:' ou similares. Não exponha idade/faixa etária; integre o público-alvo de forma implícita e natural.";
      const aiResult = await aiContingencyService.executeRequest({ ...aiRequest, systemPrompt: systemRules });
      if (!aiResult || !aiResult.success) {
        throw new Error('Falha na geração de conteúdo via IA');
      }

      const sanitizeAIOutput = (txt: string) => {
        let s = (txt || '').trim();
        s = s.replace(/```[\s\S]*?```/g, '');
        s = s.replace(/^\s*(Copy|Saída)\s*:\s*/i, '');
        s = s.replace(/\*\*(.+?)\*\*/g, '$1');
        s = s.replace(/\*(.+?)\*/g, '$1');
        s = s.replace(/^#.+\n/gm, '');
        // Remover menções explícitas de faixas etárias do tipo "de 25 a 45 (anos)"
        s = s.replace(/\bde\s*\d{2}\s*(a|à|até|-)\s*\d{2}(\s*anos?)?\b/gi, '');
        return s.trim();
      };
      const generatedContent = sanitizeAIOutput(aiResult.content);
      console.log(`✨ Copy gerada via ${aiResult.provider} (${aiResult.model}) - ${aiResult.tokensUsed} tokens`);
      const tokensIn = Math.ceil(processedPrompt.length / 4);
      const tokensOut = Math.ceil(generatedContent.length / 4);
      await storage.saveGeneration({ templateId: progress.selectedTemplate.id, inputText: processedPrompt, tone: progress.selectedTone.value, outputText: generatedContent, tokensIn, tokensOut, costCents: 80 });
      // Persistir no banco (tabela copies) se possível
      try {
        if (user && workspace) {
          const metadata: Record<string, any> = {
            mode: 'simplified',
            template_id: progress.selectedTemplate.id,
            tone: progress.selectedTone.value,
            quickConfig: progress.quickConfig,
            customInputs: progress.customInputs,
            hook: initialHook ? { id: initialHook.id, category: initialHook.category } : null,
          };
          await copiesService.create(user.id, workspace.id, {
            content: generatedContent,
            platform: progress.quickConfig.canal || progress.selectedTemplate.platform || undefined,
            copy_type: progress.selectedTemplate.category,
            persona_id: null,
            brand_voice_id: null,
            campaign_id: null,
            model: 'mock',
            temperature: undefined,
            tokens_input: tokensIn,
            tokens_output: tokensOut,
            cost_usd: 0.8,
            metadata,
          });
        }
      } catch (e) {
        console.warn('Falha ao salvar copy no banco (simplified):', e);
      }
      setGeneratedCopy(generatedContent);

      // Solicitar atualização global (CreditsProvider) e evitar sobrescrever localmente
      onCreditsUpdate(0);

      notifications.success.copyGenerated();
      onStatsUpdate?.();
    } catch (e) {
      notifications.error.generation();
    } finally { setIsGenerating(false); }
  }, [canProceedToGeneration, credits, onCreditsUpdate, onStatsUpdate, progress, toast]);

  const regenerate = useCallback(() => { handleGenerate(); }, [handleGenerate]);

  return (
    <div className="max-w-6xl mx-auto">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Step container: mostra apenas um card por vez */}
          {progress.step === 1 && (
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <CardTitle className="text-xl">Escolha o Template</CardTitle>
                    <CardDescription>Templates otimizados para o mercado e cultura brasileira</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {TEMPLATES.map((template) => {
                    const IconComponent = template.icon;
                    return (
                      <button
                        key={template.id}
                        onClick={() => handleTemplateSelect(template)}
                        className="w-full p-4 text-left rounded-lg border-2 border-border hover:border-primary/50 transition-all hover:shadow-md group"
                      >
                        <div className="flex items-start gap-4">
                          <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <IconComponent className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                {template.name}
                              </h3>
                              <Badge className={getDifficultyColor(template.difficultyLevel)}>
                                {template.difficultyLevel}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                              {template.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-3">
                              <Badge variant="outline" className={getCategoryColor(template.category)}>
                                {template.category}
                              </Badge>
                              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                                {template.conversionRate} conversão
                              </Badge>
                              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                {template.engagement} engajamento
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {template.platform}
                              </Badge>
                            </div>
                            {template.audienceTag && (
                              <div className="text-xs text-muted-foreground">
                                <span className="font-medium">Ideal para:</span> {template.audienceTag}
                              </div>
                            )}
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {progress.step === 2 && progress.selectedTemplate && (
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <CardTitle className="text-xl">Tom da Sua Marca</CardTitle>
                      <CardDescription>
                        Template: <span className="font-medium text-foreground">{progress.selectedTemplate.name}</span>
                      </CardDescription>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => goToStep(1)}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ToneSelector tones={TONES} selectedTone={progress.selectedTone} onToneSelect={handleToneSelect} />
                <div className="mt-6">
                  <HookQuickPicker selectedHook={selectedHook} onSelect={setSelectedHook} />
                </div>
              </CardContent>
            </Card>
          )}

          {progress.step === 3 && progress.selectedTemplate && progress.selectedTone && (
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div>
                      <CardTitle className="text-xl">Configuração Rápida</CardTitle>
                      <CardDescription>Clique nos chips para configurar rapidamente</CardDescription>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => goToStep(2)}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <QuickConfigSelector config={progress.quickConfig} onConfigChange={handleQuickConfigChange} onComplete={handleQuickConfigComplete} />
              </CardContent>
            </Card>
          )}

          {progress.step === 4 && progress.selectedTemplate && (
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                    <div>
                      <CardTitle className="text-xl">Informações Específicas</CardTitle>
                      <CardDescription>Preencha apenas os campos essenciais</CardDescription>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => goToStep(3)}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {progress.selectedTemplate.requiredFields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <label className="text-sm font-medium text-foreground">{field.label}{field.required && <span className="text-destructive ml-1">*</span>}</label>
                    {field.type === 'textarea' ? (
                      <Textarea placeholder={field.placeholder} value={progress.customInputs[field.id] || ''} onChange={(e) => handleCustomInputChange(field.id, e.target.value)} className="min-h-[80px] border-primary/20 focus:border-primary" maxLength={field.maxLength} />
                    ) : (
                      <Input placeholder={field.placeholder} value={progress.customInputs[field.id] || ''} onChange={(e) => handleCustomInputChange(field.id, e.target.value)} className="border-primary/20 focus:border-primary" maxLength={field.maxLength} />
                    )}
                    {field.maxLength && (<div className="text-xs text-muted-foreground text-right">{(progress.customInputs[field.id] || '').length}/{field.maxLength}</div>)}
                  </div>
                ))}

                <div className="pt-4 space-y-4">
                  {credits < 1 && (
                    <Alert className="border-destructive/20 bg-destructive/10"><AlertCircle className="h-4 w-4 text-destructive" /><AlertDescription className="text-destructive">Você precisa de 1 crédito para gerar copy brasileira.</AlertDescription></Alert>
                  )}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={handleGenerate}
                      disabled={!canProceedToGeneration || isGenerating || credits < 1}
                      className="flex-1 bg-gradient-primary text-primary-foreground py-6 text-lg font-bold shadow-lg hover:shadow-xl disabled:bg-gradient-primary disabled:text-primary-foreground disabled:opacity-100 disabled:cursor-not-allowed"
                    >
                      {isGenerating ? (<><RefreshCw className="w-5 h-5 mr-2 animate-spin" />IA trabalhando...</>) : (<><Brain className="w-5 h-5 mr-2" />Gerar Copy</>)}
                    </Button>
                    {credits < 1 && (
                      <Button variant="outline" onClick={() => { toast({ title: "Comprar Créditos", description: "Redirecionando para a página de créditos..." }); }}>
                        <CreditCard className="h-4 w-4 mr-2" />Comprar Créditos
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {/* Card de resultado da copy gerada - aparece no topo da coluna direita */}
          {generatedCopy && (
            <CopyResultActions
              generatedCopy={generatedCopy}
              onRegenerate={regenerate}
              onSave={() => { toast({ title: "Copy salva!", description: "Adicionada à sua biblioteca pessoal." }); }}
              canRegenerate={credits >= 1}
              isRegenerating={isGenerating}
            />
          )}

          {(progress.selectedTemplate || progress.selectedTone) && (
            <Card>
              <CardHeader><CardTitle className="text-lg"><Target className="h-5 w-5 inline mr-2" />Configuração Atual</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                {progress.selectedTemplate && (<div><span className="font-medium">Template:</span><div className="text-muted-foreground">{progress.selectedTemplate.name}</div></div>)}
                {progress.selectedTone && (<div><span className="font-medium">Tom:</span><div className="text-muted-foreground">{progress.selectedTone.label}</div></div>)}
                {selectedHook && (<div><span className="font-medium">Hook:</span><div className="text-muted-foreground">{selectedHook.text}</div></div>)}
                {Object.values(progress.quickConfig).some(v => v) && (
                  <div>
                    <span className="font-medium">Config Rápida:</span>
                    <div className="text-muted-foreground space-y-1">
                      {progress.quickConfig.produto && <div>• {progress.quickConfig.produto}</div>}
                      {progress.quickConfig.publico && <div>• {progress.quickConfig.publico}</div>}
                      {progress.quickConfig.objetivo && <div>• {progress.quickConfig.objetivo}</div>}
                      {progress.quickConfig.canal && <div>• {progress.quickConfig.canal}</div>}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          {progress.selectedTemplate && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg"><TrendingUp className="h-5 w-5 inline mr-2" />Exemplo de Resultado</CardTitle>
                <CardDescription>Baseado no template {progress.selectedTemplate.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 rounded-lg p-3 text-sm max-h-60 overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-sans leading-relaxed">
                    {progress.selectedTemplate.sampleOutput.substring(0, 300)}
                    {progress.selectedTemplate.sampleOutput.length > 300 && '...'}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{credits}</div>
                <div className="text-sm text-muted-foreground">créditos disponíveis</div>
                <div className="text-xs text-muted-foreground mt-1">Modo Mãos Livres: 1 crédito por copy</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
