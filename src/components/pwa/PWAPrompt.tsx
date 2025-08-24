import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, X, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

export const PWAPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Só mostra o prompt se o usuário não dismissou recentemente
      const lastDismissed = localStorage.getItem('pwa-prompt-dismissed');
      const now = Date.now();
      const threeDays = 3 * 24 * 60 * 60 * 1000;
      
      if (!lastDismissed || now - parseInt(lastDismissed) > threeDays) {
        setTimeout(() => setShowPrompt(true), 3000); // Mostra após 3 segundos
      }
    };

    // Detecta iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Detecta se já está instalado como PWA
    const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                     (navigator as NavigatorWithStandalone).standalone === true;
    setIsStandalone(standalone);

    // Só adiciona listener se não for iOS e não estiver instalado
    if (!iOS && !standalone) {
      window.addEventListener('beforeinstallprompt', handler);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA instalado com sucesso');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
  };

  // Não mostra se já está instalado ou é iOS sem prompt personalizado
  if (isStandalone || (!deferredPrompt && !isIOS) || !showPrompt) {
    return null;
  }

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96"
        >
          <Card className="border-primary/20 shadow-elegant bg-card/95 backdrop-blur-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Smartphone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Instalar StorySpark</CardTitle>
                    <CardDescription>
                      {isIOS 
                        ? 'Adicione à tela inicial para acesso rápido'
                        : 'Instale para acesso rápido e navegação offline'
                      }
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex gap-2">
                {isIOS ? (
                  <div className="text-sm text-muted-foreground">
                    Toque em <strong>Compartilhar</strong> → <strong>Adicionar à Tela Inicial</strong>
                  </div>
                ) : (
                  <>
                    <Button onClick={handleInstall} className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Instalar App
                    </Button>
                    <Button variant="outline" onClick={handleDismiss}>
                      Agora não
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};