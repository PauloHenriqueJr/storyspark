// Event system for real-time updates across the app
import { useEffect } from 'react';

export type AppEvent = 
  | { type: 'credits:updated'; payload: { newBalance: number } }
  | { type: 'generation:created'; payload: { copyId: string; creditsSpent: number } }
  | { type: 'plan:changed'; payload: { newPlan: string; creditsAdded: number } }
  | { type: 'template:used'; payload: { templateId: string; count: number } };

// Event dispatcher
class EventBus {
  private listeners: Map<string, Array<(payload: any) => void>> = new Map();

  on<T extends AppEvent>(eventType: T['type'], callback: (payload: T['payload']) => void) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)!.push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(eventType);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  emit<T extends AppEvent>(eventType: T['type'], payload: T['payload']) {
    const callbacks = this.listeners.get(eventType);
    if (callbacks) {
      callbacks.forEach(callback => callback(payload));
    }

    // Also dispatch as browser event for legacy compatibility
    window.dispatchEvent(new CustomEvent(eventType, { detail: payload }));
  }

  off(eventType: string, callback?: (payload: any) => void) {
    if (!callback) {
      this.listeners.delete(eventType);
      return;
    }

    const callbacks = this.listeners.get(eventType);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }
}

export const eventBus = new EventBus();

// Helper hooks for React components
export const useAppEvent = <T extends AppEvent>(
  eventType: T['type'], 
  callback: (payload: T['payload']) => void,
  deps: any[] = []
) => {
  useEffect(() => {
    const unsubscribe = eventBus.on(eventType, callback);
    return unsubscribe;
  }, deps);
};

// Credit tracking helpers
export const creditEvents = {
  updateBalance: (newBalance: number) => {
    eventBus.emit('credits:updated', { newBalance });
  },
  
  recordGeneration: (copyId: string, creditsSpent: number) => {
    eventBus.emit('generation:created', { copyId, creditsSpent });
  },
  
  planChanged: (newPlan: string, creditsAdded: number) => {
    eventBus.emit('plan:changed', { newPlan, creditsAdded });
  }
};

// Template tracking helpers
export const templateEvents = {
  recordUsage: (templateId: string, count: number) => {
    eventBus.emit('template:used', { templateId, count });
  }
};

