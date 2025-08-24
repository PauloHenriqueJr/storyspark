import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
}

interface ToastNotificationsProps {
  notifications: ToastNotification[];
  onRemove: (id: string) => void;
}

const getToastIcon = (type: string) => {
  switch (type) {
    case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
    case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    case 'info': return <Info className="w-4 h-4 text-blue-500" />;
    default: return <Info className="w-4 h-4 text-blue-500" />;
  }
};

const getToastColors = (type: string) => {
  switch (type) {
    case 'success': return 'border-green-200 bg-green-50 text-green-800';
    case 'error': return 'border-red-200 bg-red-50 text-red-800';
    case 'warning': return 'border-yellow-200 bg-yellow-50 text-yellow-800';
    case 'info': return 'border-blue-200 bg-blue-50 text-blue-800';
    default: return 'border-blue-200 bg-blue-50 text-blue-800';
  }
};

export const ToastNotifications: React.FC<ToastNotificationsProps> = ({ 
  notifications, 
  onRemove 
}) => {
  useEffect(() => {
    notifications.forEach((notification) => {
      const duration = notification.duration || 4000;
      const timer = setTimeout(() => {
        onRemove(notification.id);
      }, duration);

      return () => clearTimeout(timer);
    });
  }, [notifications, onRemove]);

  return (
    <div className="fixed top-16 right-4 z-[100] space-y-2 max-w-xs">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -50, x: 50 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -50, x: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`
              relative w-full border rounded-lg shadow-lg backdrop-blur-sm
              ${getToastColors(notification.type)}
            `}
          >
            <div className="p-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getToastIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium leading-tight">
                      {notification.title}
                    </p>
                    {notification.description && (
                      <p className="text-xs opacity-70 mt-0.5">
                        {notification.description}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(notification.id)}
                  className="h-5 w-5 p-0 hover:bg-black/10 ml-1"
                >
                  <X className="h-2.5 w-2.5" />
                </Button>
              </div>
            </div>
            
            {/* Progress bar */}
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{
                duration: (notification.duration || 4000) / 1000,
                ease: 'linear'
              }}
              className="h-0.5 bg-current opacity-30 rounded-b-lg"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};