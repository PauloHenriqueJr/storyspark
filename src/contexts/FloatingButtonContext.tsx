import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

type ActionFunction = (content: string) => void;

interface ActionPayload {
  path: string;
  action: ActionFunction;
}

interface FloatingButtonContextType {
  // State for programmatic control
  isModalOpen: boolean;
  openModal: (initialBriefing?: string) => void;
  closeModal: () => void;
  contextualBriefing: string | null;

  // State for page-specific actions
  actions: Record<string, ActionFunction>;
  registerAction: (payload: ActionPayload) => void;
  unregisterAction: (path: string) => void;
  getActionForPath: (path: string) => ActionFunction | undefined;
}

const FloatingButtonContext = createContext<FloatingButtonContextType | null>(null);

export const FloatingButtonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [actions, setActions] = useState<Record<string, ActionFunction>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contextualBriefing, setContextualBriefing] = useState<string | null>(null);

  const openModal = useCallback((initialBriefing?: string) => {
    if (initialBriefing) {
      setContextualBriefing(initialBriefing);
    }
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setContextualBriefing(null);
  }, []);

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

  const value = {
    isModalOpen,
    openModal,
    closeModal,
    contextualBriefing,
    actions,
    registerAction,
    unregisterAction,
    getActionForPath,
  };

  return (
    <FloatingButtonContext.Provider value={value}>
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
