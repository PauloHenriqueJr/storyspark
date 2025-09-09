import React, { useEffect } from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { NotificationProvider } from '@/hooks/useNotifications';
import { CreditsProvider } from '@/context/CreditsProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import { analytics } from '@/services/analytics';

interface AppWrapperProps {
  children: React.ReactNode;
}

export const AppWrapper = ({ children }: AppWrapperProps) => {
  useEffect(() => {
    analytics.init();
  }, []);

  return (
    <QueryProvider>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthProvider>
            <CreditsProvider>
              <NotificationProvider>
                {children}
              </NotificationProvider>
            </CreditsProvider>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryProvider>
  );
};
