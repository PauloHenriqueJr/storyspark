import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wand2,
  Calendar,
  FileText,
  Instagram,
  Facebook,
  Linkedin,
  Mail,
  MessageSquare,
  Globe,
  X,
  Plus,
  Edit3,
  Copy as CopyIcon,
  Zap,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import EventSelector from './EventSelector';
import ItemSelector from './ItemSelector';
import DocumentUploadSection from './DocumentUploadSection';
import BriefingEditor from './BriefingEditor';
import PlatformSelector from './PlatformSelector';
import GeneratedCopyPreview from './GeneratedCopyPreview';
import ContextDetector from './ContextDetector';

interface ToastNotifications {
  showSuccess: (title: string, description?: string, duration?: number) => string;
  showError: (title: string, description?: string, duration?: number) => string;
  showInfo: (title: string, description?: string, duration?: number) => string;
}

interface SystemToastNotifications extends ToastNotifications {
  showWarning: (title: string, description?: string, duration?: number) => string;
}

interface ModalContainerProps {
  isOpen: boolean;
  onClose: () => void;
  toastNotifications: ToastNotifications;
  systemToastNotifications: SystemToastNotifications;
  onOpenScheduleModal?: (copyContent: string, platform: string, copyType: string) => void;
}

interface ContextConfig {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
  suggestions: string[];
  defaultPlatform?: string;
  defaultType?: string;
  targetPage?: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  platform: string;
  time: string;
  date: Date;
  event_date: string;
  status: 'Agendado' | 'Publicado' | 'Rascunho';
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface BrandVoice {
  id: string;
  workspace_id: string;
  user_id: string;
  name: string;
  description: string;
  tone: string;
  style: string;
  examples: string[];
  guidelines: string;
  usage_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  personality_traits?: string[];
  audience?: string;
  platform?: string;
  context?: string;
  writing_style?: string;
  avoid?: string;
  good_example?: string;
  bad_example?: string;
  keywords?: string[];
}

interface Persona {
  id: string;
  workspace_id: string;
  user_id: string;
  name: string;
  age_range?: string;
  location?: string;
  occupation?: string;
  goals?: string[];
  pain_points?: string[];
  interests?: string[];
  preferred_channels?: string[];
  usage_count: number;
  created_at: string;
  updated_at?: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  type: string;
  content: string;
  blocks: any[];
  usage_count: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
  workspace_id: string;
  version: number;
  tags?: string[];
  thumbnail_url?: string;
  performance_score?: number;
}

interface Campaign {
  id: string;
  name: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string;
  budget: number;
  spent: number;
  roi: number;
  created_at: string;
  updated_at: string;
  user_id: string;
  workspace_id: string;
  target_personas?: string[];
  brand_voice_id?: string;
  template_id?: string;
}

const ModalContainer: React.FC<ModalContainerProps> = ({
  isOpen,
  onClose,
  toastNotifications,
  systemToastNotifications,
  onOpenScheduleModal
}) => {
  const [currentContext, setCurrentContext] = useState<ContextConfig>({
    title: 'Criar Copy com IA',
    icon: Wand2,
    color: 'bg-gradient-to-r from-purple-600 to-blue-600',
    description: 'Copy personalizada para qualquer necessidade',
    suggestions: [
      'Copy para redes sociais',
      'E-mail marketing',
      'Landing page'
    ],
    targetPage: '/composer'
  });

  const [briefing, setBriefing] = useState('');
  const [platform, setPlatform] = useState('');
  const [copyType, setCopyType] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopyingToClipboard, setIsCopyingToClipboard] = useState(false);
  const [isApplyingToItem, setIsApplyingToItem] = useState(false);
  const [generatedCopy, setGeneratedCopy] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventSelector, setShowEventSelector] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BrandVoice | Persona | Template | Campaign | null>(null);
  const [showItemSelector, setShowItemSelector] = useState(false);
  const [customizationMode, setCustomizationMode] = useState(false);
  const [customBriefing, setCustomBriefing] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Auto-configurar baseado no contexto com memoização
  const hasEvents = useMemo(() => false, []);

  useEffect(() => {
    if (currentContext.defaultPlatform) setPlatform(currentContext.defaultPlatform);
    if (currentContext.defaultType) setCopyType(currentContext.defaultType);

    // Se estiver na página de calendário, mostrar seletor de eventos
    if (hasEvents) {
      setShowEventSelector(true);
    }
  }, [currentContext, hasEvents]);

  const resetModal = () => {
    setBriefing('');
    setGeneratedCopy('');
    setPlatform(currentContext.defaultPlatform || '');
    setCopyType(currentContext.defaultType || '');
    setSelectedEvent(null);
    setShowEventSelector(false);
    setSelectedItem(null);
    setShowItemSelector(false);
    setCustomizationMode(false);
    setCustomBriefing('');
  };

  const handleContextChange = (context: ContextConfig) => {
    setCurrentContext(context);
  };

  const handleCopyToClipboard = async () => {
    setIsCopyingToClipboard(true);
    try {
      await navigator.clipboard.writeText(generatedCopy);
      toastNotifications.showSuccess(
        "Copy copiada!",
        "Conteúdo copiado para área de transferência."
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      toastNotifications.showError(
        "Erro ao copiar",
        `Não foi possível copiar o conteúdo. ${errorMessage}`
      );

      // Log para debugging
      console.error("Erro ao copiar para clipboard:", error);
    } finally {
      setIsCopyingToClipboard(false);
    }
  };

  const handleUseGeneratedCopy = () => {
    setIsApplyingToItem(true);
    try {
      if (selectedEvent && generatedCopy) {
        // Aqui você pode implementar a lógica para atualizar o evento com a copy gerada
        toastNotifications.showSuccess(
          "Copy aplicada ao evento!",
          `A copy foi aplicada ao evento "${selectedEvent.title}"`
        );
      }

      if (selectedItem && generatedCopy) {
        // Aqui você pode implementar a lógica para aplicar a copy ao item selecionado
        toastNotifications.showSuccess(
          "Copy aplicada!",
          `A copy foi aplicada ao item "${selectedItem.name || (selectedItem as any).title}"`
        );
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      toastNotifications.showError(
        "Erro ao aplicar copy",
        `Não foi possível aplicar a copy. ${errorMessage}`
      );

      // Log para debugging
      console.error("Erro ao aplicar copy:", error);
    } finally {
      setIsApplyingToItem(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl w-[95vw] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-gray-200 dark:border-gray-700">
        <DialogHeader className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${currentContext.color} flex items-center justify-center shadow-lg`}>
              <currentContext.icon className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                {currentContext.title}
              </DialogTitle>
              <DialogDescription className="text-base text-gray-600 dark:text-gray-400 mt-1">
                {currentContext.description}
              </DialogDescription>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700">
              <Zap className="w-3 h-3 mr-1" />
              Contexto
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Context Detector */}
          <ContextDetector onContextChange={handleContextChange} />

          {/* Event Selector */}
          <EventSelector
            showEventSelector={showEventSelector}
            setShowEventSelector={setShowEventSelector}
            selectedEvent={selectedEvent}
            onEventSelect={(event) => {
              setSelectedEvent(event);
              setBriefing(`Gerar copy para o evento: ${event.title}`);
              setPlatform(event.platform || 'Instagram');
              setShowEventSelector(false);
            }}
          />

          {/* Item Selector */}
          <ItemSelector
            showItemSelector={showItemSelector}
            setShowItemSelector={setShowItemSelector}
            selectedItem={selectedItem}
            onItemSelect={(item) => {
              setSelectedItem(item);

              // Obter contexto diretamente do item selecionado
              const context = `Gerar copy para: ${item.name || (item as any).title}`;

              // Atualizar briefing com contexto
              setBriefing(context);
              setShowItemSelector(false);

              // Mostrar editor de briefing para personalização
              // setShowBriefingEditor(true); // Implementação futura
            }}
          />

          {/* Document Upload Section */}
          <DocumentUploadSection
            showUploadModal={showUploadModal}
            setShowUploadModal={setShowUploadModal}
            onDataExtracted={(data) => {
              // Aqui você implementaria a lógica para aplicar os dados extraídos
              console.log('Dados extraídos:', data);
              toastNotifications.showSuccess(
                "Documento processado!",
                "As informações foram extraídas com sucesso."
              );
            }}
          />

          {/* Briefing Editor */}
          <BriefingEditor
            customizationMode={customizationMode}
            selectedItem={selectedItem}
            briefing={briefing}
            customBriefing={customBriefing}
            setBriefing={setBriefing}
            setCustomBriefing={setCustomBriefing}
            setCustomizationMode={setCustomizationMode}
            currentContext={currentContext}
          />

          {/* Platform Selector */}
          <PlatformSelector
            platform={platform}
            setPlatform={setPlatform}
            copyType={copyType}
            setCopyType={setCopyType}
          />

          {/* Generate Button */}
          <div className="space-y-3">
            <Button
              onClick={async () => {
                if (!briefing.trim()) {
                  toastNotifications.showError(
                    "Briefing necessário",
                    "Descreva o que você quer comunicar."
                  );
                  return;
                }

                setIsGenerating(true);
                try {
                  // Wrapper com tratamento de erros e retry
                  const generateCopyWithRetry = async (request: any, retries = 3): Promise<any> => {
                    try {
                      // Simulação de chamada ao serviço real
                      // return await copyGenerationService.generateCopy(request);
                      await new Promise(resolve => setTimeout(resolve, 2000));
                      return { content: `Copy gerada com sucesso para: ${briefing}`, success: true };
                    } catch (error) {
                      if (retries > 0) {
                        // Aguardar antes de tentar novamente
                        await new Promise(resolve => setTimeout(resolve, 1000 * (4 - retries)));
                        return generateCopyWithRetry(request, retries - 1);
                      }
                      throw error;
                    }
                  };

                  const response = await generateCopyWithRetry({
                    briefing: briefing,
                    platform: platform || 'Instagram',
                    copyType: copyType || 'Post Orgânico',
                    tone: 'Profissional'
                  });

                  if (response.success && response.content) {
                    setGeneratedCopy(response.content);

                    toastNotifications.showSuccess(
                      "🎉 Copy gerada!",
                      "Copy contextual criada com sucesso."
                    );
                  } else {
                    throw new Error('Falha na geração');
                  }
                } catch (error) {
                  const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
                  const errorDetails = error instanceof Error && error.cause ? error.cause.toString() : "";

                  toastNotifications.showError(
                    "Erro na geração",
                    `Não foi possível gerar a copy. ${errorMessage}${errorDetails ? ` Detalhes: ${errorDetails}` : ""}`
                  );

                  // Log para debugging
                  console.error("Erro na geração de copy:", {
                    error,
                    briefing,
                    platform,
                    copyType
                  });
                } finally {
                  setIsGenerating(false);
                }
              }}
              disabled={isGenerating || !briefing.trim()}
              className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none disabled:opacity-50"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 mr-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="text-base font-semibold">Gerando Copy com IA...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5 mr-3" />
                  <span className="text-base font-semibold">✨ Gerar Copy Contextual</span>
                </>
              )}
            </Button>

            {!briefing.trim() && (
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Preencha a descrição para gerar sua copy personalizada
                </p>
              </div>
            )}
          </div>

          {/* Generated Copy Preview */}
          <GeneratedCopyPreview
            generatedCopy={generatedCopy}
            platform={platform}
            copyType={copyType}
            onCopyToClipboard={handleCopyToClipboard}
            onUseGeneratedCopy={handleUseGeneratedCopy}
            onReset={resetModal}
            selectedEvent={selectedEvent}
            selectedItem={selectedItem}
            locationPathname="/composer" // Valor simulado para demonstração
            isCopyingToClipboard={isCopyingToClipboard}
            isApplyingToItem={isApplyingToItem}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalContainer;