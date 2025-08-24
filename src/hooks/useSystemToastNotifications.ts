import { useState, useCallback } from 'react';
import { SystemToastNotification } from '@/components/ui/system-toast-notifications';

export const useSystemToastNotifications = () => {
  const [notifications, setNotifications] = useState<SystemToastNotification[]>([]);

  const addNotification = useCallback((notification: Omit<SystemToastNotification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: SystemToastNotification = {
      ...notification,
      id,
    };

    setNotifications(prev => [...prev, newNotification]);
    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Helper functions for common notification types
  const showSuccess = useCallback((title: string, description?: string, duration?: number) => {
    return addNotification({ type: 'success', title, description, duration });
  }, [addNotification]);

  const showError = useCallback((title: string, description?: string, duration?: number) => {
    return addNotification({ type: 'error', title, description, duration });
  }, [addNotification]);

  const showWarning = useCallback((title: string, description?: string, duration?: number) => {
    return addNotification({ type: 'warning', title, description, duration });
  }, [addNotification]);

  const showInfo = useCallback((title: string, description?: string, duration?: number) => {
    return addNotification({ type: 'info', title, description, duration });
  }, [addNotification]);

  // Função específica para notificações do sistema (login, logout, etc.)
  const showSystemNotification = useCallback((type: 'success' | 'error' | 'warning' | 'info', title: string, description?: string) => {
    return addNotification({ 
      type, 
      title, 
      description, 
      duration: 3000 // Duração mais curta para notificações do sistema
    });
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showSystemNotification,
  };
};