import React, { createContext, useContext } from 'react';

interface FloatingButtonContextType {
  openCalendarModalWithContent?: (content: string) => void;
  openCampaignModalWithContent?: (content: string) => void;
}

export const FloatingButtonContext = createContext<FloatingButtonContextType | undefined>(undefined);

export const FloatingButtonProvider = FloatingButtonContext.Provider;

export const useFloatingButton = () => {
  const context = useContext(FloatingButtonContext);
  // Return a dummy function if not in provider, so it doesn't crash pages without it.
  return context || {
    openCalendarModalWithContent: () => console.warn('FloatingButtonContext not found for Calendar'),
    openCampaignModalWithContent: () => console.warn('FloatingButtonContext not found for Campaign')
  };
};
