import React, { createContext, useContext } from 'react';
import { useToastNotifications } from '@/hooks/useToastNotifications';

interface ToastContextType {
  showSuccess: (title: string, description?: string, duration?: number) => string;
  showError: (title: string, description?: string, duration?: number) => string;
  showInfo: (title: string, description?: string, duration?: number) => string;
  showWarning: (title: string, description?: string, duration?: number) => string;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const toastNotifications = useToastNotifications();

  return (
    <ToastContext.Provider value={{
      showSuccess: toastNotifications.showSuccess,
      showError: toastNotifications.showError,
      showInfo: toastNotifications.showInfo,
      showWarning: toastNotifications.showWarning,
    }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};