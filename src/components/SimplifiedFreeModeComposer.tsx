import { useState, useCallback, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { notifications } from "@/lib/notifications";
import { QuickConfigSelector } from "./QuickConfigSelector";
import { BrazilianToneSelector } from "./BrazilianToneSelector";
import { storage, aiProvider } from "@/lib/adapters";
import { BRAZILIAN_TEMPLATES, BRAZILIAN_TONES, getCategoryColor, getDifficultyColor, type BrazilianTemplate, type BrazilianTone } from "@/lib/brazilianTemplates";
import { CopyResultActions } from "./CopyResultActions";
import { Sparkles, RefreshCw, ArrowLeft, CheckCircle2, ChevronRight, Brain, Wand2, AlertCircle, CreditCard, TrendingUp, Target, Zap } from "lucide-react";
import type { Hook } from "@/data/hooks";
import { HookQuickPicker } from "@/components/HookQuickPicker";

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
  selectedTemplate: BrazilianTemplate | null;
  selectedTone: BrazilianTone | null;
  quickConfig: QuickConfig;
  customInputs: Record<string, string>;
}

export const SimplifiedFreeModeComposer = ({ credits, onCreditsUpdate, onStatsUpdate, initialTemplateId, onInitialTemplateConsumed, initialHook, onStepChange }: SimplifiedFreeModeComposerProps) => {
  const { toast } = useToast();
  const [progress, setProgress] = useState<StepProgress>({ step: 1, selectedTemplate: null, selectedTone: null, quickConfig: { produto: '', publico: '', objetivo: '', canal: '' }, customInputs: {} });
  const [generatedCopy, setGeneratedCopy] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedHook, setSelectedHook] = useState<Hook | null>(initialHook || null);

  useEffect(() => {
    if (initialTemplateId) {
      const template = BRAZILIAN_TEMPLATES.find(t => t.id === initialTemplateId);
      if (template) {
        setProgress(prev => ({ ...prev, step: 2, selectedTemplate: template, customInputs: {} }));
        setGeneratedCopy("");
        onInitialTemplateConsumed?.();
        onStepChange?.(2);
      }
    }
  }, [initialTemplateId, onInitialTemplateConsumed]);

  const handleTemplateSelect = useCallback((template: BrazilianTemplate) => {
    setProgress(prev => ({ ...prev, step: 2, selectedTemplate: template, customInputs: {} }));
    setGeneratedCopy("");
    onStepChange?.(2);
  }, [onStepChange]);

  const handleToneSelect = useCallback((tone: BrazilianTone) => { setProgress(prev => ({ ...prev, step: 3, selectedTone: tone })); onStepChange?.(3); }, [onStepChange]);
  const handleQuickConfigChange = useCallback((config: Partial<QuickConfig>) => { setProgress(prev => ({ ...prev, quickConfig: { ...prev.quickConfig, ...config } })); }, []);
  const handleQuickConfigComplete = useCallback(() => { setProgress(prev => ({ ...prev, step: 4 })); onStepChange?.(4); }, [onStepChange]);
  const handleCustomInputChange = useCallback((fieldId: string, value: string) => { setProgress(prev => ({ ...prev, customInputs: { ...prev.customInputs, [fieldId]: value } })); }, []);
  const goToStep = useCallback((step: 1 | 2 | 3 | 4) => { if (step <= progress.step || step === 1) { setProgress(prev => ({ ...prev, step })); onStepChange?.(step); } }, [progress.step, onStepChange]);

  const canProceedToGeneration = useMemo(() => {
    if (!progress.selectedTemplate || !progress.selectedTone) return false;
    const requiredFields = progress.selectedTemplate.requiredFields.filter(field => field.required);
    const hasAllRequiredInputs = requiredFields.every(field => progress.customInputs[field.id]?.trim());
    return hasAllRequiredInputs;
  }, [progress.selectedTemplate, progress.selectedTone, progress.customInputs]);

  const handleGenerate = useCallback(async () => {
    if (!canProceedToGeneration || !progress.selectedTemplate || !progress.selectedTone) { notifications.error.requiredFields(); return; }
    if (credits < 1) { toast({ title: "Créditos insuficientes", description: "Você precisa de pelo menos 1 crédito para gerar conteúdo.", variant: "destructive" }); return; }
    setIsGenerating(true);
    try {
      let processedPrompt = progress.selectedTemplate.promptBase;
      processedPrompt = processedPrompt
        .replace(/\{publico\}/g, progress.quickConfig.publico || 'público brasileiro')
        .replace(/\{objetivo\}/g, progress.quickConfig.objetivo || 'engajar')
        .replace(/\{canal\}/g, progress.quickConfig.canal || 'redes sociais')
        .replace(/\{tom\}/g, progress.selectedTone.value);
      for (const field of progress.selectedTemplate.requiredFields) {
        const value = progress.customInputs[field.id] || '';
        processedPrompt = processedPrompt.replace(new RegExp(`\\{${field.id}\\}`, 'g'), value);
      }
      if (selectedHook) {
        const hookCtx = `Baseado neste hook validado: "${selectedHook.text}"\n\nExemplo de aplicação: "${selectedHook.example}"\nCategoria do hook: ${selectedHook.category}\n\n`;
        processedPrompt = hookCtx + processedPrompt;
      }
      const generatedContent = await aiProvider.generateContent({ templateId: progress.selectedTemplate.id, inputText: processedPrompt, tone: progress.selectedTone.value });
      await storage.saveGeneration({ templateId: progress.selectedTemplate.id, inputText: processedPrompt, tone: progress.selectedTone.value, outputText: generatedContent, tokensIn: Math.ceil(processedPrompt.length / 4), tokensOut: Math.ceil(generatedContent.length / 4), costCents: 80 });
      const stats = await storage.getStats();
      onCreditsUpdate(stats.creditsRemaining);
      setGeneratedCopy(generatedContent);
      notifications.success.copyGenerated();
      onStatsUpdate?.();
    } catch (e) {
      notifications.error.generation();
    } finally { setIsGenerating(false); }
  }, [canProceedToGeneration, credits, onCreditsUpdate, onStatsUpdate, progress, toast]);

  const regenerate = useCallback(() => { handleGenerate(); }, [handleGenerate]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Step container: mostra apenas um card por vez */}
          {progress.step === 1 && (
            <Card>
              <CardHeader className="border-b">
                <CardTitle className="text-xl">Selecione um Template Brasileiro</CardTitle>
                <CardDescription>Modelos otimizados para o mercado BR</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 grid gap-3 sm:grid-cols-2">
                {BRAZILIAN_TEMPLATES.map((template) => {
                  const Icon = template.icon;
                  const selected = progress.selectedTemplate?.id === template.id;
                  return (
                    <button key={template.id} onClick={() => handleTemplateSelect(template)} className={`text-left p-4 rounded-lg border transition hover:shadow-md ${selected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded bg-primary/10 text-primary"><Icon className="w-4 h-4" /></div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <div className="font-medium truncate">{template.name}</div>
                            <span className={`text-[10px] px-2 py-0.5 rounded border ${getCategoryColor(template.category)}`}>{template.category}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded ${getDifficultyColor(template.difficultyLevel)}`}>{template.difficultyLevel}</span>
                          </div>
                          <div className="text-xs text-muted-foreground line-clamp-2">{template.description}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {progress.step === 2 && progress.selectedTemplate && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2"><Zap className="h-5 w-5" /><CardTitle>Tom de Voz Brasileiro</CardTitle></div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setProgress(prev => ({ ...prev, step: 1, selectedTone: null }));
                    onStepChange?.(1);
                  }}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />Voltar
                </Button>
              </CardHeader>
              <CardContent>
                <BrazilianToneSelector tones={BRAZILIAN_TONES} selectedTone={progress.selectedTone} onToneSelect={handleToneSelect} />
                <div className="mt-6">
                  <HookQuickPicker selectedHook={selectedHook} onSelect={setSelectedHook} />
                </div>
              </CardContent>
            </Card>
          )}

          {progress.step === 3 && progress.selectedTemplate && progress.selectedTone && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2"><Target className="h-5 w-5" /><CardTitle>Configuração Rápida</CardTitle></div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setProgress(prev => ({ ...prev, step: 2 }));
                    onStepChange?.(2);
                  }}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />Voltar
                </Button>
              </CardHeader>
              <CardContent>
                <QuickConfigSelector config={progress.quickConfig} onConfigChange={handleQuickConfigChange} onComplete={handleQuickConfigComplete} />
              </CardContent>
            </Card>
          )}

          {progress.step === 4 && progress.selectedTemplate && (
            <Card>
              <CardHeader className="flex items-center justify-between">
                <div className="flex items-center gap-2"><Wand2 className="h-5 w-5" /><CardTitle className="text-xl">Informações Específicas</CardTitle></div>
                <Button variant="outline" size="sm" onClick={() => goToStep(3)}><ArrowLeft className="h-4 w-4 mr-2" />Voltar</Button>
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
          {generatedCopy && (
            <CopyResultActions generatedCopy={generatedCopy} onRegenerate={regenerate} onSave={() => { toast({ title: "Copy salva!", description: "Adicionada à sua biblioteca pessoal." }); }} canRegenerate={credits >= 1} isRegenerating={isGenerating} />
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
