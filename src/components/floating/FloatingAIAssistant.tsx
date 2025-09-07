import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { VisuallyHidden } from '@/components/ui/visually-hidden';

// Utils
import { getPageContext } from './utils/contextDetector';
import { getActionsByContext } from './utils/actionMapper';

// Context Components
import { AnalyticsContext } from './contexts/AnalyticsContext';
import { ComposerContext } from './contexts/ComposerContext';
import { CampaignsContext } from './contexts/CampaignsContext';
import { PersonasContext } from './contexts/PersonasContext';
import { BrandVoicesContext } from './contexts/BrandVoicesContext';
import { ImportDataContext } from './contexts/ImportDataContext';

// Action Components
import { CopyGeneration } from './actions/CopyGeneration';
import { DocumentUpload } from './actions/DocumentUpload';

interface FloatingAIAssistantProps {
  onOpenScheduleModal?: (copyContent: string, platform: string, copyType: string) => void;
}

const FloatingAIAssistant: React.FC<FloatingAIAssistantProps> = () => {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentContext, setCurrentContext] = useState<any>(null);
  const [availableActions, setAvailableActions] = useState<any[]>([]);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  // Detectar contexto da página atual
  useEffect(() => {
    const context = getPageContext(location.pathname);
    setCurrentContext(context);

    if (context) {
      const actions = getActionsByContext(context);
      setAvailableActions(actions);
    }
  }, [location.pathname]);

  // Reset quando modal fecha
  const resetModal = () => {
    setIsModalOpen(false);
    setActiveAction(null);
  };

  // Não renderizar se não há contexto
  if (!currentContext) {
    return null;
  }

  const IconComponent = currentContext.icon;

  // Renderizar componente de contexto baseado na página
  const renderContextComponent = () => {
    const path = location.pathname;

    if (path.includes('/analytics')) {
      return <AnalyticsContext
        analyticsData={[]}
        onAction={(action, data) => console.log(action, data)}
      />;
    }
    if (path.includes('/composer')) {
      return <ComposerContext
        currentDraft={null}
        availableVoices={[]}
        selectedPlatforms={[]}
        onAction={(action, data) => console.log(action, data)}
      />;
    }
    if (path.includes('/campaigns')) {
      return <CampaignsContext
        activeCampaigns={[]}
        draftCampaigns={[]}
        campaignStats={{}}
        onAction={(action, data) => console.log(action, data)}
      />;
    }
    if (path.includes('/personas')) {
      return <PersonasContext
        personas={[]}
        onAction={(action, data) => console.log(action, data)}
      />;
    }
    if (path.includes('/brand-voices')) {
      return <BrandVoicesContext
        brandVoices={[]}
        onAction={(action, data) => console.log(action, data)}
      />;
    }
    if (path.includes('/import-data')) {
      return <ImportDataContext onAction={(action, data) => console.log(action, data)} />;
    }

    return null;
  };

  // Renderizar modal de ação
  const renderActionModal = () => {
    if (!activeAction) return null;

    switch (activeAction) {
      case 'generate_copy':
        return (
          <CopyGeneration
            onGenerate={(copyData) => {
              console.log('Generated copy:', copyData);
              setActiveAction(null);
            }}
            context={currentContext}
            suggestions={currentContext.suggestions}
          />
        );
      case 'upload_documents':
        return (
          <DocumentUpload
            onDataExtracted={(data) => {
              console.log('Extracted data:', data);
              setActiveAction(null);
            }}
            context={currentContext}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Floating Button - Design Original */}
      <motion.div
        className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-[9999]"
        initial={{ scale: 0, x: 100, y: 100 }}
        animate={{ scale: 1, x: 0, y: 0 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 20 }}
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          whileHover={{ scale: 1.15, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className="relative group"
        >
          {/* Glow effect */}
          <div className={`absolute inset-0 rounded-full bg-blue-500 opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-300`} />

          {/* Main button */}
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-4 border-white/30 dark:border-gray-800/30 relative z-10 backdrop-blur-sm`}
            size="lg"
          >
            <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-white drop-shadow-lg" />
          </Button>

          {/* Pulse effect */}
          <div className={`absolute inset-0 rounded-full bg-blue-500 opacity-40 animate-ping pointer-events-none`} />

          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden sm:block">
            <div className="bg-gray-900 dark:bg-gray-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
              {currentContext.title}
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-800"></div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={(open) => !open && resetModal()}>
        <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-4xl h-[90vh] sm:h-[85vh] p-0 flex flex-col sm:rounded-lg" aria-describedby={undefined}>
          <VisuallyHidden asChild>
            <DialogTitle>{currentContext.title}</DialogTitle>
          </VisuallyHidden>
          {activeAction ? (
            renderActionModal()
          ) : (
            <Card className="flex flex-col h-full w-full border-0 shadow-none">
              {/* Header */}
              <CardHeader className="p-4 sm:p-6 border-b flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                        {currentContext.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        {currentContext.description}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>

              {/* Content */}
              <CardContent className="p-4 sm:p-6 flex-1 overflow-hidden">
                <ScrollArea className="h-full w-full">
                  <div className="space-y-4 sm:pr-4">
                    {renderContextComponent()}

                    {/* Actions */}
                    {availableActions.length > 0 && (
                      <div className="pt-4 border-t mt-6">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                          Ações Disponíveis
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {availableActions.map((action) => (
                            <Button
                              key={action.id}
                              variant="outline"
                              className="justify-start h-auto p-4"
                              onClick={() => setActiveAction(action.id)}
                            >
                              {/* Ícone por nome (lucide) resolvido via data-attr */}
                              <span className="w-5 h-5 mr-3 text-blue-600 inline-flex items-center justify-center" data-icon={action.icon}>
                                {/* Ícone renderizado pelo provider global ou fallback CSS */}
                              </span>
                              <div className="text-left">
                                <div className="font-medium">{action.title}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  {action.description}
                                </div>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FloatingAIAssistant;
