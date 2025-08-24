import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

type ActionFunction = (content: string) => void;

interface ActionPayload {
  path: string;
  action: ActionFunction;
  type: 'openCalendar' | 'openCampaign';
}

interface FloatingButtonContextType {
  actions: Record<string, ActionFunction>;
  registerAction: (payload: ActionPayload) => void;
  unregisterAction: (path: string) => void;
  getActionForPath: (path: string) => ActionFunction | undefined;
}

const FloatingButtonContext = createContext<FloatingButtonContextType | null>(null);

export const FloatingButtonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [actions, setActions] = useState<Record<string, ActionFunction>>({});

  const registerAction = useCallback((payload: ActionPayload) => {
    setActions(prev => ({ ...prev, [payload.path]: payload.action }));
  }, []);

  const unregisterAction = useCallback((path: string) => {
    setActions(prev => {
      const newActions = { ...prev };
      delete newActions[path];
      return newActions;
    });
  }, []);

  const getActionForPath = useCallback((path: string) => {
    return actions[path];
  }, [actions]);

  return (
    <FloatingButtonContext.Provider value={{ actions, registerAction, unregisterAction, getActionForPath }}>
      {children}
    </FloatingButtonContext.Provider>
  );
};

export const useFloatingButton = () => {
  const context = useContext(FloatingButtonContext);
  if (!context) {
    throw new Error('useFloatingButton must be used within a FloatingButtonProvider');
  }
  return context;
};

export const useRegisterFloatingButtonAction = (payload: ActionPayload) => {
  const { registerAction, unregisterAction } = useFloatingButton();

  useEffect(() => {
    registerAction(payload);
    return () => {
      unregisterAction(payload.path);
    };
  }, [registerAction, unregisterAction, payload]);
};
