import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, X, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePWA } from '@/hooks/usePWA';

export const UpdatePrompt = () => {
  const { needRefresh, offlineReady, updateAvailable, updateApp, closePrompt } = usePWA();

  if (!needRefresh && !offlineReady) return null;

  return (
    <AnimatePresence>
      {(needRefresh || offlineReady) && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          className="fixed top-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96"
        >
          <Card className="border-primary/20 shadow-elegant bg-card/95 backdrop-blur-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {offlineReady ? (
                      <Download className="h-5 w-5 text-green-600" />
                    ) : (
                      <RefreshCw className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {offlineReady ? 'App Pronto!' : 'Atualização Disponível'}
                    </CardTitle>
                    <CardDescription>
                      {offlineReady 
                        ? 'Agora funciona offline'
                        : 'Nova versão com melhorias'
                      }
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closePrompt}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            {needRefresh && (
              <CardContent className="pt-0">
                <div className="flex gap-2">
                  <Button onClick={updateApp} className="flex-1">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Atualizar Agora
                  </Button>
                  <Button variant="outline" onClick={closePrompt}>
                    Depois
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};