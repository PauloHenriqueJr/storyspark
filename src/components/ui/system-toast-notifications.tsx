import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface SystemToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
}

interface SystemToastNotificationsProps {
  notifications: SystemToastNotification[];
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

export const SystemToastNotifications: React.FC<SystemToastNotificationsProps> = ({ 
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
    <div className="fixed top-16 right-4 z-[100] space-y-2 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ 
              opacity: 0, 
              x: 300, 
              scale: 0.8,
              // Simular que sai do ícone de notificação
              originX: 1,
              originY: 0
            }}
            animate={{ 
              opacity: 1, 
              x: 0, 
              scale: 1
            }}
            exit={{ 
              opacity: 0, 
              x: 300, 
              scale: 0.8,
              originX: 1,
              originY: 0
            }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 25,
              delay: index * 0.1 // Escalonar aparição
            }}
            className={`
              relative w-full border rounded-lg shadow-lg backdrop-blur-sm
              ${getToastColors(notification.type)}
            `}
          >
            <div className="p-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2">
                  {getToastIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">
                      {notification.title}
                    </p>
                    {notification.description && (
                      <p className="text-xs opacity-80 mt-1">
                        {notification.description}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(notification.id)}
                  className="h-6 w-6 p-0 hover:bg-black/10"
                >
                  <X className="h-3 w-3" />
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