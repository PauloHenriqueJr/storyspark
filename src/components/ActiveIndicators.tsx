import { UnifiedActiveIndicator } from "./UnifiedActiveIndicator";

interface ActiveIndicatorsProps {
  selectedTemplate?: any;
  selectedHook?: any;
  onClearTemplate?: () => void;
  onClearHook?: () => void;
  className?: string;
  interactive?: boolean;
  showDetails?: boolean;
}

export const ActiveIndicators = ({ 
  selectedTemplate, 
  selectedHook, 
  onClearTemplate, 
  onClearHook, 
  className = "",
  interactive = true,
}: ActiveIndicatorsProps) => {
  return (
    <div className={className}>
      <UnifiedActiveIndicator 
        selectedTemplate={selectedTemplate}
        selectedHook={selectedHook}
        onClearTemplate={onClearTemplate}
        onClearHook={onClearHook}
        variant="inline"
        interactive={interactive}
      />
    </div>
  );
};

