import React, { createContext, useState, useContext, ReactNode } from 'react';

interface FloatingButtonContextType {
  isModalOpen: boolean;
  contextualBriefing: string | null;
  openModal: (briefing?: string) => void;
  closeModal: () => void;
}

const FloatingButtonContext = createContext<FloatingButtonContextType | undefined>(undefined);

export const FloatingButtonProvider = ({ children }: { children: ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contextualBriefing, setContextualBriefing] = useState<string | null>(null);

  const openModal = (briefing?: string) => {
    if (briefing) {
      setContextualBriefing(briefing);
    } else {
      setContextualBriefing(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setContextualBriefing(null);
  };

  return (
    <FloatingButtonContext.Provider value={{ isModalOpen, contextualBriefing, openModal, closeModal }}>
      {children}
    </FloatingButtonContext.Provider>
  );
};

export const useFloatingButton = () => {
  const context = useContext(FloatingButtonContext);
  if (context === undefined) {
    throw new Error('useFloatingButton must be used within a FloatingButtonProvider');
  }
  return context;
};
