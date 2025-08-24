import React from 'react';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { ToastNotifications } from '@/components/ui/toast-notifications';
import { SystemToastNotifications } from '@/components/ui/system-toast-notifications';
import { useSystemNotifications } from '@/hooks/useSystemNotifications';
import { useToastNotifications } from '@/hooks/useToastNotifications';
import { useSystemToastNotifications } from '@/hooks/useSystemToastNotifications';
import FloatingCopyButton from '@/components/floating/FloatingCopyButton';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  // Inicializar monitoramento automático de notificações
  useSystemNotifications();
  
  // Toast notifications para feedback da plataforma (funcionalidade)
  const toastNotifications = useToastNotifications();
  
  // System notifications para feedback visual (login, logout, etc.)
  const systemToastNotifications = useSystemToastNotifications();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-subtle">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <AppHeader />
          
          <main className="flex-1 p-6 md:p-8 overflow-auto">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
        
        {/* Platform notifications - para funcionalidades */}
        <ToastNotifications
          notifications={toastNotifications.notifications}
          onRemove={toastNotifications.removeNotification}
        />
        
        {/* System notifications - para login/logout (efeito visual) */}
        <SystemToastNotifications
          notifications={systemToastNotifications.notifications}
          onRemove={systemToastNotifications.removeNotification}
        />
        
        <FloatingCopyButton
          toastNotifications={toastNotifications}
          systemToastNotifications={systemToastNotifications}
        />
      </div>
    </SidebarProvider>
  );
};