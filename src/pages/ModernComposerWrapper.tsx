import { useState, useEffect } from "react";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription } from "../components/ui/alert";
import { FreeModeComposer } from "../components/FreeModeComposer";
import { storage } from "../lib/adapters";
import { getMappingInfo } from "../lib/templateMapping";
import { AlertCircle, CheckCircle2, Sparkles, SlidersHorizontal, Palette, Settings2 } from "lucide-react";
import { useWorkspace } from '@/hooks/useWorkspace';
import { useCredits } from '@/context/CreditsProvider';

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
  onHookChange 
}: ModernComposerWrapperProps) => {
  const { workspace, loading: workspaceLoading } = useWorkspace();
  const { remainingCredits, refresh } = useCredits();
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

  // Sincronizar créditos exibidos com fonte única do provider
  useEffect(() => {
    setCredits(remainingCredits);
  }, [remainingCredits]);

  // Load credits and handle template mapping
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Usar créditos reais do workspace
        if (workspace) {
          setCredits(remainingCredits);
        } else {
          // Fallback para storage local se workspace não disponível
          const stats = await storage.getStats();
          setCredits(stats.creditsRemaining);
        }

        // Handle template mapping if there's a pre-selected template
        if (preSelectedTemplateId) {
          const mappingInfo = getMappingInfo(preSelectedTemplateId);
          setTemplateMapping(mappingInfo);
          
          // Clear the pre-selection after processing (notify parent)
          if (onTemplateChange) {
            onTemplateChange();
          }
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [preSelectedTemplateId, onTemplateChange, workspace]);

  const handleCreditsUpdate = (_newCredits?: number) => {
    // Sempre confiar na fonte única (CreditsProvider) e apenas solicitar refresh
    refresh();
  };

  const handleStatsUpdate = () => {
    onStatsUpdate?.();
  };

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
    <div className="max-w-7xl mx-auto bg-gray-50/50 dark:bg-gray-900/20 rounded-lg p-6">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            Composição de Copies
          </Badge>
        </div>
        <h1 className="text-4xl font-bold mb-4">
          Crie <span className="text-orange-500">Copies Incríveis</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Escolha um template, descreva sua ideia e deixe nossa IA criar copies que convertem.
        </p>
        
        {/* Toggle de modo */}
        <div className="mt-6 flex justify-center">
          <div className="flex items-center gap-2 rounded-xl border bg-background/60 backdrop-blur-sm p-1 shadow-sm">
            <button
              onClick={() => handleModeChange('simplified')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                composerMode === 'simplified'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800 text-muted-foreground hover:text-foreground dark:text-gray-200 dark:hover:text-gray-100'
              }`}
            >
              <Palette className="h-4 w-4" />
                Mãos Livres
                <Badge variant="secondary" className="text-xs bg-success/20 text-success-foreground">
                  Fácil
                </Badge>
            </button>
            <button
              onClick={() => handleModeChange('advanced')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                composerMode === 'advanced'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800 text-muted-foreground hover:text-foreground dark:text-gray-200 dark:hover:text-gray-100'
              }`}
            >
              <Settings2 className="h-4 w-4" />
                Mãos na Massa
                <Badge variant="secondary" className="text-xs bg-primary/20 text-primary-foreground">
                  Avançado
                </Badge>
            </button>
          </div>
        </div>
      </div>

      {/* Template Mapping Notice */}
      {templateMapping && (
        <div className="mb-6">
          {templateMapping.found ? (
            <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                <div className="flex items-center gap-2">
                  <span>{templateMapping.message}</span>
                  <Badge variant="outline" className="bg-green-200/20 text-green-600 border-green-300/30">
                    Template
                  </Badge>
                </div>
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800 dark:text-amber-200">
                {templateMapping.message}
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Progress Indicator for Simplified Mode */}
      {composerMode === 'simplified' && (
        <div className="mb-8">
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground">
              🎨 Interface simples e intuitiva com templates brasileiros otimizados. Ideal para começar rapidamente com apenas alguns cliques.
            </p>
          </div>
          <div className="flex items-center justify-center space-x-2 mb-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  currentStep >= step 
                    ? 'bg-gradient-primary text-primary-foreground shadow-glow' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-12 h-0.5 mx-2 transition-all ${
                    currentStep > step ? 'bg-gradient-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {currentStep === 1 && "Escolha um template"}
              {currentStep === 2 && "Selecione o tom"}
              {currentStep === 3 && "Configure os detalhes"}
              {currentStep === 4 && "Gere sua copy"}
            </p>
          </div>
        </div>
      )}

      {/* Mode Description */}
      {composerMode === 'advanced' && (
        <div className="text-center mb-8">
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            ⚙️ Modo completo com controle total sobre prompts, variáveis e configurações avançadas de IA.
          </p>
        </div>
      )}

      {/* Composer Component */}
      <FreeModeComposer
        credits={credits}
        onCreditsUpdate={handleCreditsUpdate}
        onStatsUpdate={handleStatsUpdate}
        initialTemplateId={templateMapping?.brazilianId || preSelectedTemplateId}
        initialHook={selectedHook}
        onStepChange={setCurrentStep}
        mode={composerMode}
        onInitialTemplateConsumed={onTemplateChange}
      />
    </div>
  );
};