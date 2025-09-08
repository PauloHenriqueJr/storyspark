import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { Badge } from '@/components/ui/badge';
import { Crown, Lock, Zap } from 'lucide-react';
import { useCredits } from '@/context/CreditsProvider';
import { useRole } from '@/hooks/useRole';

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
  const { plan } = useCredits();
  const { hasAdminAccess } = useRole();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentContext, setCurrentContext] = useState<any>(null);
  const [availableActions, setAvailableActions] = useState<any[]>([]);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Verificar se usuário tem acesso liberado (Admin/Super Admin OU plano Premium)
  const hasFullAccess = hasAdminAccess() || plan === 'pro' || plan === 'enterprise' || plan === 'premium';

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
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8 z-[9999]"
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
          {/* Premium Badge - sempre visível para criar curiosidade (só para usuários sem acesso) */}
          {!hasFullAccess && (
            <Badge
              className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full shadow-lg z-20 animate-pulse"
            >
              <Crown className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
              <span className="hidden sm:inline">Premium</span>
              <span className="sm:hidden">Pro</span>
            </Badge>
          )}

          {/* Glow effect */}
          <div className={`absolute inset-0 rounded-full ${hasFullAccess ? 'bg-blue-500' : 'bg-gradient-to-r from-amber-500 to-yellow-500'} opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-300`} />          {/* Main button */}
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              if (!hasFullAccess) {
                // Usuário sem acesso (não admin e não premium) - mostrar modal de upgrade
                setShowUpgradeModal(true);
              } else {
                // Usuário com acesso liberado (admin ou premium) - abrir normalmente
                setIsModalOpen(true);
              }
            }}
            className={`w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 ${hasFullAccess
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
              : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600'
              } border-4 border-white/30 dark:border-gray-800/30 relative z-10 backdrop-blur-sm`}
            size="lg"
          >
            {hasFullAccess ? (
              <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white drop-shadow-lg" />
            ) : (
              <div className="flex items-center justify-center">
                <Lock className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-black drop-shadow-lg" />
              </div>
            )}
          </Button>

          {/* Pulse effect */}
          <div className={`absolute inset-0 rounded-full ${hasFullAccess ? 'bg-blue-500' : 'bg-gradient-to-r from-amber-500 to-yellow-500'} opacity-40 animate-ping pointer-events-none`} />

          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden sm:block">
            <div className="bg-gray-900 dark:bg-gray-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
              {hasFullAccess ? currentContext.title : 'Upgrade para Premium'}
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

      {/* Modal de Upgrade Premium */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full flex items-center justify-center">
              <Crown className="w-8 h-8 text-black" />
            </div>

            <DialogTitle className="text-xl font-bold">
              🚀 Funcionalidade Premium
            </DialogTitle>

            <DialogDescription className="text-center">
              O Assistente IA é uma funcionalidade exclusiva para usuários Premium.
              Upgrade agora e tenha acesso a:
            </DialogDescription>

            <div className="space-y-2 text-sm text-left w-full">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Assistente IA contextual em todas as páginas</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Geração de copies personalizadas</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Upload e análise de documentos</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Sugestões inteligentes por contexto</span>
              </div>
            </div>

            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1"
              >
                Talvez depois
              </Button>
              <Button
                onClick={() => {
                  setShowUpgradeModal(false);
                  // Redirecionar para página de billing/upgrade
                  window.location.href = '/billing';
                }}
                className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold"
              >
                <Crown className="w-4 h-4 mr-2" />
                Fazer Upgrade
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FloatingAIAssistant;
