import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FreeModeComposer } from "@/components/FreeModeComposer";
import { storage } from "@/lib/adapters";
import { getMappingInfo } from "@/lib/templateMapping";
import { AlertCircle, CheckCircle2, Sparkles, SlidersHorizontal } from "lucide-react";

interface ModernComposerWrapperProps {
  onStatsUpdate?: () => void;
  selectedHook?: any;
  preSelectedTemplateId?: string | null;
  onTemplateChange?: () => void;
  onHookChange?: () => void;
}

export const ModernComposerWrapper = ({ 
  onStatsUpdate, 
  selectedHook, 
  preSelectedTemplateId, 
  onTemplateChange,
}: ModernComposerWrapperProps) => {
  const [credits, setCredits] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [composerMode, setComposerMode] = useState<'simplified' | 'advanced'>(() => {
    const saved = localStorage.getItem('storyspark_composer_mode');
    return saved === 'advanced' ? 'advanced' : 'simplified';
  });
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [templateMapping, setTemplateMapping] = useState<{
    found: boolean;
    brazilianId: string | null;
    message: string;
  } | null>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const stats = await storage.getStats();
        setCredits(stats.creditsRemaining);
        if (preSelectedTemplateId) {
          const mappingInfo = getMappingInfo(preSelectedTemplateId);
          setTemplateMapping(mappingInfo);
          onTemplateChange?.();
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, [preSelectedTemplateId, onTemplateChange]);

  const handleCreditsUpdate = (newCredits: number) => setCredits(newCredits);
  const handleStatsUpdate = () => onStatsUpdate?.();
  const handleModeChange = (mode: 'simplified' | 'advanced') => {
    setComposerMode(mode);
    localStorage.setItem('storyspark_composer_mode', mode);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando composer...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">Composição de Copies</Badge>
        </div>
        <h1 className="text-4xl font-bold mb-4">Crie <span className="text-orange-500">Copies Incríveis</span></h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Escolha um template, descreva sua ideia e deixe nossa IA criar copies que convertem.</p>
        {/* Toggle de modo e apresentação */}
        <div className="mt-6 flex justify-center">
          <div className="flex items-center gap-2 rounded-xl border bg-background/60 backdrop-blur-sm p-1 shadow-sm">
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                composerMode === 'simplified' ? 'bg-gradient-primary text-primary-foreground shadow-glow' : 'hover:bg-muted text-foreground'
              }`}
              onClick={() => handleModeChange('simplified')}
            >
              <Sparkles className="h-4 w-4" />
              <span>Mãos Livres</span>
              <Badge variant="secondary" className="ml-2 text-xs bg-black/10 dark:bg-white/10">Fácil</Badge>
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                composerMode === 'advanced' ? 'bg-gradient-primary text-primary-foreground shadow-glow' : 'hover:bg-muted text-foreground'
              }`}
              onClick={() => handleModeChange('advanced')}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Mãos na Massa</span>
              <Badge variant="secondary" className="ml-2 text-xs">Avançado</Badge>
            </button>
          </div>
        </div>

        <div className="mt-4 text-sm text-muted-foreground flex items-center justify-center gap-2">
          <span className="text-rose-500">•</span>
          <span>
            {composerMode === 'simplified'
              ? 'Interface simples e intuitiva com templates otimizados. Ideal para começar rapidamente com apenas alguns cliques.'
              : 'Modo completo com controle total sobre prompts, variáveis e configurações avançadas de IA.'}
          </span>
        </div>

        {composerMode === 'simplified' ? (
          <div className="mt-6 flex items-center justify-center gap-3">
            {[1,2,3,4].map((n, idx) => (
              <div key={n} className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm border transition-all ${
                    n < currentStep
                      ? 'bg-orange-500 text-white border-orange-500 shadow-glow'
                      : n === currentStep
                        ? 'bg-orange-500 text-white border-orange-500 shadow-glow'
                        : 'text-orange-500 border-orange-300'
                  }`}
                  aria-current={n===currentStep ? 'step' : undefined}
                >
                  {n < currentStep ? '✓' : n}
                </div>
                {idx < 3 && <span className="text-orange-500">›</span>}
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {templateMapping && (
        <div className="mb-6">
          {templateMapping.found ? (
            <Alert className="border-success/50 bg-success/10">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <AlertDescription className="text-success-foreground">
                <div className="flex items-center gap-2">
                  <span>{templateMapping.message}</span>
                  <Badge variant="outline" className="bg-success/20 text-success border-success/30">Template Brasileiro</Badge>
                </div>
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="border-warning/50 bg-warning/10">
              <AlertCircle className="h-4 w-4 text-warning" />
              <AlertDescription className="text-warning-foreground">{templateMapping.message}</AlertDescription>
            </Alert>
          )}
        </div>
      )}

      <FreeModeComposer
        key={`freemode-${composerMode}`}
        credits={credits}
        onCreditsUpdate={handleCreditsUpdate}
        onStatsUpdate={handleStatsUpdate}
        selectedHook={selectedHook}
        initialTemplateId={templateMapping?.brazilianId || undefined}
        onInitialTemplateConsumed={() => setTemplateMapping(null)}
        onStepChange={(s) => setCurrentStep(s)}
      />
    </div>
  );
};
