import { useState, useEffect } from 'react';

export const usePWA = () => {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Registra service worker se disponível
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registrado: ', registration.scope);
          
          // Verifica por atualizações
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    // Nova versão disponível
                    setNeedRefresh(true);
                    setUpdateAvailable(true);
                  } else {
                    // App pronto para usar offline
                    setOfflineReady(true);
                  }
                }
              });
            }
          });
        })
        .catch((error) => {
          console.log('Erro ao registrar SW: ', error);
        });
    }
  }, []);

  const updateApp = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(registration => {
        if (registration && registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          window.location.reload();
        }
      });
    }
  };

  const closePrompt = () => {
    setNeedRefresh(false);
    setUpdateAvailable(false);
  };

  return {
    needRefresh,
    offlineReady,
    updateAvailable,
    updateApp,
    closePrompt,
  };
};