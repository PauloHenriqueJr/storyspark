import { useState, useCallback } from 'react';
import { ToastNotification } from '@/components/ui/toast-notifications';

export const useToastNotifications = () => {
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);

  const addNotification = useCallback((notification: Omit<ToastNotification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: ToastNotification = {
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

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};