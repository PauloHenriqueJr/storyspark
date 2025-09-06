import { UnifiedActiveIndicator } from "./UnifiedActiveIndicator";

interface FloatingActiveIndicatorProps {
  selectedTemplate?: any;
  selectedHook?: any;
  onClearTemplate?: () => void;
  onClearHook?: () => void;
}

export const FloatingActiveIndicator = ({ 
  selectedTemplate, 
  selectedHook, 
  onClearTemplate, 
  onClearHook 
}: FloatingActiveIndicatorProps) => {
  return (
    <UnifiedActiveIndicator 
      selectedTemplate={selectedTemplate}
      selectedHook={selectedHook}
      onClearTemplate={onClearTemplate}
      onClearHook={onClearHook}
      variant="floating"
      interactive={true}
    />
  );
};

