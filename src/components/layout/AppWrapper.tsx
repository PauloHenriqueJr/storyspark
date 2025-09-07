import React, { useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
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

const RouteTracker = () => {
  const location = useLocation();
  useEffect(() => {
    const trackable = ['/waitlist', '/lp'];
    if (!trackable.includes(location.pathname)) return;
    const thresholds = [25, 50, 75, 100];
    const fired = new Set<number>();
    const onScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = Math.min(100, Math.round((scrollTop / Math.max(1, docHeight)) * 100));
      thresholds.forEach(t => {
        if (percent >= t && !fired.has(t)) {
          analytics.track('scroll_depth', { path: location.pathname, depth: t });
          fired.add(t);
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true } as any);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname]);
  return null;
};

export const AppWrapper = ({ children }: AppWrapperProps) => {
  useEffect(() => {
    analytics.init();
  }, []);

  useEffect(() => {
    const trackable = ['/waitlist', '/lp'];
    if (!trackable.includes(location.pathname)) return;
    const thresholds = [25, 50, 75, 100];
    const fired = new Set<number>();
    const onScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = Math.min(100, Math.round((scrollTop / Math.max(1, docHeight)) * 100));
      thresholds.forEach(t => {
        if (percent >= t && !fired.has(t)) {
          analytics.track('scroll_depth', { path: location.pathname, depth: t });
          fired.add(t);
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true } as any);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname]);
  return (
    <QueryProvider>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <AuthProvider>
              <CreditsProvider>
                <NotificationProvider>
                  <RouteTracker />
                  {children}
                </NotificationProvider>
              </CreditsProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryProvider>
  );
};
