import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { notifications } from "@/lib/notifications";
import { PromptEditor } from "./PromptEditor";
import { VariableManager } from "./VariableManager";
import { AIControls } from "./AIControls";
import { PersonaSelector } from "./PersonaSelector";
import { FunnelStageSelector } from "./FunnelStageSelector";
import { ActiveIndicators } from "./ActiveIndicators";
import { CopyResultActions } from "./CopyResultActions";
import { FloatingActiveIndicator } from "./FloatingActiveIndicator";
import { storage, aiProvider } from "@/lib/adapters";
import { copiesService } from "@/services/copiesService";
import { useWorkspace } from "@/hooks/useWorkspace";
import { supabase } from "@/lib/supabase";
import { defaultPersonas, funnelStages } from "@/types/persona";
import { Sparkles, RefreshCw, Brain, Code2, Wand2, Settings } from "lucide-react";
import { SimplifiedFreeModeComposer } from "./SimplifiedFreeModeComposer";
import { useNotifications } from '@/hooks/useNotifications';
import { aiContingencyService } from '@/services/aiContingencyService';

interface FreeModeComposerProps {
  credits: number;
  onCreditsUpdate: (credits: number) => void;
  onStatsUpdate?: () => void;
  selectedHook?: any;
  initialTemplateId?: string;
  onInitialTemplateConsumed?: () => void;
  onStepChange?: (step: number) => void;
  initialHook?: any;
  mode?: 'simplified' | 'advanced';
}

interface AIConfig {
  temperatura: number;
  maxTokens: number;
  criatividade: 'baixa' | 'media' | 'alta';
  formato: 'texto' | 'lista' | 'estruturado';
}

interface Variable { name: string; value: string; description?: string; }

export const FreeModeComposer = ({ credits, onCreditsUpdate, onStatsUpdate, selectedHook, initialTemplateId, onInitialTemplateConsumed, onStepChange, initialHook, mode }: FreeModeComposerProps) => {
  const composerMode = mode || 'simplified';
  const { workspace, user } = useWorkspace();
  const { addNotification } = useNotifications();
  const [prompt, setPrompt] = useState(() => {
    return selectedHook?.text
      ? `Baseado neste hook validado: "${selectedHook.text}"\n\nExemplo de aplicação: "${selectedHook.example}"\n\nExpanda este hook em uma copy completa para {produto} que {objetivo} usando um tom {tom}.\n\nDetalhes:\n- Público-alvo: {publico}\n- Benefício principal: {beneficio}\n- Canal: {canal}\n- Categoria do hook: ${selectedHook.category}`
      : "Crie uma copy para {produto} que {objetivo} usando um tom {tom}.\n\nDetalhes:\n- Público-alvo: {publico}\n- Benefício principal: {beneficio}\n- Canal: {canal}";
  });
  const [variables, setVariables] = useState<Variable[]>([
    { name: "produto", value: "", description: "Nome do produto ou serviço" },
    { name: "objetivo", value: "", description: "O que você quer alcançar" },
    { name: "tom", value: "casual", description: "Tom de voz da comunicação" },
    { name: "publico", value: "", description: "Quem é seu público-alvo" },
    { name: "beneficio", value: "", description: "Principal benefício oferecido" },
    { name: "canal", value: "Instagram", description: "Onde será publicado" }
  ]);
  const [aiConfig, setAiConfig] = useState<AIConfig>({ temperatura: 0.7, maxTokens: 500, criatividade: 'media', formato: 'texto' });
  const [selectedPersona, setSelectedPersona] = useState<string>("");
  const [selectedFunnelStage, setSelectedFunnelStage] = useState<string>("");
  const [generatedCopy, setGeneratedCopy] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (selectedHook && selectedHook.text) {
      const hookPrompt = `Baseado neste hook validado: "${selectedHook.text}"\n\nExemplo de aplicação: "${selectedHook.example}"\n\nExpanda este hook em uma copy completa para {produto} que {objetivo} usando um tom {tom}.\n\nDetalhes:\n- Público-alvo: {publico}\n- Benefício principal: {beneficio}\n- Canal: {canal}\n- Categoria do hook: ${selectedHook.category}`;
      setPrompt(hookPrompt);
    }
  }, [selectedHook]);

  const processPromptWithVariables = (rawPrompt: string, vars: Variable[]): string => {
    let processedPrompt = rawPrompt;
    vars.forEach(variable => {
      const regex = new RegExp(`\\{${variable.name}\\}`, 'g');
      processedPrompt = processedPrompt.replace(regex, variable.value || `{${variable.name}}`);
    });
    return processedPrompt;
  };

  const isFormValid = () => {
    if (!prompt.trim()) return false;
    const usedVariables = prompt.match(/\{(\w+)\}/g)?.map(v => v.slice(1, -1)) || [];
    const requiredVars = variables.filter(v => usedVariables.includes(v.name) && v.name !== 'tom');
    return requiredVars.every(v => v.value.trim());
  };

  const handleGenerate = async () => {
    if (!isFormValid()) { 
      notifications.error.requiredFields(); 
      return; 
    }
    
    // Verificar créditos localmente (simulação para desenvolvimento)
    if (credits < 2) { 
      addNotification({
        title: '⚡ Créditos Insuficientes',
        message: 'Você precisa de pelo menos 2 créditos para gerar uma copy avançada.',
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
      const processedPrompt = processPromptWithVariables(prompt, variables);
      const personaData = selectedPersona ? defaultPersonas.find(p => p.id === selectedPersona) : null;
      const funnelData = selectedFunnelStage ? funnelStages.find(s => s.id === selectedFunnelStage) : null;
      const freeModeContext = `
[CONFIG]
Temperatura: ${aiConfig.temperatura}
MaxTokens: ${aiConfig.maxTokens}
Criatividade: ${aiConfig.criatividade}
Formato: ${aiConfig.formato}

${personaData ? `[PERSONA]
Nome: ${personaData.name}
Descrição: ${personaData.description}
Características: ${personaData.characteristics.join(', ')}
Tom preferido: ${personaData.tone}

` : ''}${funnelData ? `[FUNIL]
Etapa: ${funnelData.name}
Objetivo: ${funnelData.description}

` : ''}[PROMPT]
${processedPrompt}

[REGRAS_DE_SAIDA]
- Responda apenas com a copy final (sem títulos/explicações/prefixos).
- Não use Markdown (sem * ou **, sem cabeçalhos), nem blocos de código.
- Integre qualquer hook fornecido de forma natural, sem repetir literalmente.
- Mantenha pt-BR e quebras de linha adequadas ao canal informado em {canal}.
`.trim();

      // Usar o sistema real de IA com contingência
      const aiRequest = {
        prompt: freeModeContext,
        maxTokens: aiConfig.maxTokens || 1000,
        temperature: aiConfig.temperatura || 0.7,
        userId: user?.id || 'anonymous',
        context: 'composer_advanced_mode'
      };
      
      const systemRules = "Você é um copywriter sênior brasileiro. Use meta-informações (persona, faixa etária, variáveis internas) apenas como contexto e NUNCA as mencione explicitamente no texto. Retorne apenas a copy final, sem títulos, sem instruções e sem Markdown. Não escreva 'Copy:' ou similares. Não exponha idade/faixa etária; integre o público-alvo de forma implícita e natural.";
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
      // Persistência paralela: memória (atual) e banco (copies)
      const tokensIn = Math.ceil(freeModeContext.length / 4);
      const tokensOut = Math.ceil(generatedContent.length / 4);
      await storage.saveGeneration({
        templateId: 'modo-livre',
        inputText: freeModeContext,
        tone: variables.find(v => v.name === 'tom')?.value || 'casual',
        outputText: generatedContent,
        tokensIn,
        tokensOut,
        costCents: 160,
      });
      // Tentar salvar no Supabase (tabela copies)
      try {
        if (user && workspace) {
          const platform = variables.find(v => v.name === 'canal')?.value || null;
          const metadata: Record<string, any> = {
            mode: 'advanced_free_mode',
            selectedPersona: personaData?.id || null,
            selectedFunnelStage: funnelData?.id || null,
            hook: selectedHook ? { id: selectedHook.id, category: selectedHook.category } : null,
            aiConfig,
          };
          await copiesService.create(user.id, workspace.id, {
            content: generatedContent,
            platform: platform || undefined,
            copy_type: selectedHook ? 'hook_expansion' : 'custom_free_mode',
            persona_id: null,
            brand_voice_id: null,
            campaign_id: null,
            model: 'mock',
            temperature: aiConfig.temperatura,
            tokens_input: tokensIn,
            tokens_output: tokensOut,
            cost_usd: 1.6, // equivalente a 160 cents
            metadata,
          });
        }
      } catch (e) {
        console.warn('Falha ao salvar copy no banco:', e);
      }
      setGeneratedCopy(generatedContent);

      // Solicitar atualização global (CreditsProvider) e evitar sobrescrever localmente
      onCreditsUpdate(0);
      
      notifications.success.copyGenerated();
      onStatsUpdate?.();
    } catch {
      notifications.error.generation();
    } finally { setIsGenerating(false); }
  };

  return (
    <div className="space-y-6">

      {composerMode === 'simplified' ? (
        <SimplifiedFreeModeComposer
          credits={credits}
          onCreditsUpdate={onCreditsUpdate}
          onStatsUpdate={onStatsUpdate}
          initialTemplateId={initialTemplateId}
          onInitialTemplateConsumed={onInitialTemplateConsumed}
          initialHook={initialHook || selectedHook}
          onStepChange={onStepChange}
        />
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2"><Code2 className="h-5 w-5" />Editor de Prompt Personalizado</CardTitle>
                    <CardDescription>Crie seu próprio prompt usando variáveis dinâmicas. Use {"{variavel}"} para campos customizáveis.</CardDescription>
                  </div>
                  <ActiveIndicators selectedHook={selectedHook} />
                </div>
              </CardHeader>
              <CardContent>
                <PromptEditor value={prompt} onChange={setPrompt} variables={variables} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Wand2 className="h-5 w-5" />Variáveis Dinâmicas</CardTitle>
                <CardDescription>Configure os valores das variáveis do seu prompt.</CardDescription>
              </CardHeader>
              <CardContent>
                <VariableManager variables={variables} onVariablesChange={setVariables} prompt={prompt} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5" />Contexto Avançado</CardTitle>
                <CardDescription>Defina a persona e etapa do funil para gerar copies mais precisas.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <PersonaSelector selectedPersona={selectedPersona} onPersonaChange={setSelectedPersona} />
                <Separator />
                <FunnelStageSelector selectedStage={selectedFunnelStage} onStageChange={setSelectedFunnelStage} />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Card de resultado da copy gerada - aparece ao lado dos controles de IA */}
            {generatedCopy && (
              <CopyResultActions 
                generatedCopy={generatedCopy} 
                onRegenerate={() => handleGenerate()} 
                onSave={() => { notifications.success.copied(); }} 
                canRegenerate={credits >= 2} 
                isRegenerating={isGenerating} 
              />
            )}
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5" />Configurações de IA</CardTitle>
                <CardDescription>Ajuste o comportamento da inteligência artificial.</CardDescription>
              </CardHeader>
              <CardContent>
                <AIControls config={aiConfig} onConfigChange={setAiConfig} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5" />{selectedHook ? 'Expandir Hook em Copy' : 'Gerar Copy Personalizada'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="default" size="lg" className="w-full" onClick={handleGenerate} disabled={!isFormValid() || isGenerating}>
                  {isGenerating ? (<><RefreshCw className="mr-2 h-4 w-4 animate-spin" />Gerando...</>) : (<><Sparkles className="mr-2 h-4 w-4" />{selectedHook ? 'Expandir Hook em Copy (2 créditos)' : 'Gerar Copy Personalizada (2 créditos)'} </>)}
                </Button>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Créditos disponíveis: {credits}</span>
                  <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary">Premium</Badge>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      )}

      <FloatingActiveIndicator selectedHook={selectedHook} onClearHook={() => { notifications.success.hookCleared(); }} />
    </div>
  );
};
