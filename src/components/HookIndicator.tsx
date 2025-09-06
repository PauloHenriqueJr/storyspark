import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Zap, X } from "lucide-react";
import { useState } from "react";

interface HookIndicatorProps {
  hook: any;
  variant?: 'compact' | 'full' | 'floating' | 'minimal';
  onClear?: () => void;
  showDetails?: boolean;
  interactive?: boolean;
  className?: string;
}

export const HookIndicator = ({ 
  hook, 
  variant = 'compact',
  onClear,
  showDetails = true,
  interactive = true,
  className = ""
}: HookIndicatorProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!hook) return null;

  const handleMouseEnter = () => { if (interactive) setIsExpanded(true); };
  const handleMouseLeave = () => { if (interactive) setIsExpanded(false); };
  const handleTouch = () => { if (interactive) { setIsExpanded(true); setTimeout(() => setIsExpanded(false), 3000); }};

  if (variant === 'minimal') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant="outline" 
              className={`bg-orange-500 text-white border-orange-500 shadow-sm hover:bg-orange-600 transition-all cursor-pointer animate-pulse ${className}`}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleTouch}
            >
              <Zap className="h-3 w-3 mr-1.5" />
              Hook Ativo
            </Badge>
          </TooltipTrigger>
          {showDetails && (
            <TooltipContent side="top" className="max-w-xs">
              <div className="space-y-2">
                <p className="font-semibold text-orange-600">{hook.category}</p>
                <p className="text-xs text-muted-foreground">"{hook.text}"</p>
                <p className="text-xs text-success">✅ Hook integrado</p>
              </div>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (variant === 'full') {
    return (
      <TooltipProvider>
        <div 
          className={`bg-orange-500/10 border border-orange-500/30 rounded-lg transition-all duration-300 ${
            isExpanded ? 'p-4 shadow-lg' : 'p-3'
          } ${className}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouch}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-orange-600 animate-pulse" />
                <Badge variant="outline" className="bg-orange-500 text-white border-orange-500">
                  {hook.category}
                </Badge>
              </div>
              {onClear && (
                <button
                  onClick={onClear}
                  className="p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive transition-colors"
                  title="Remover hook"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
            <div className="bg-orange-50 dark:bg-orange-950/30 p-3 rounded border border-orange-200 dark:border-orange-800">
              <div className="text-sm font-medium text-orange-700 dark:text-orange-300 mb-2">"{hook.text}"</div>
              {hook.example && (
                <div className="text-xs text-orange-600/70"><span className="font-medium">Exemplo:</span> {hook.example}</div>
              )}
            </div>
          </div>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="outline" 
            className={`bg-orange-500 text-white border-orange-500 shadow-sm hover:bg-orange-600 transition-all cursor-pointer animate-pulse hover:scale-105 ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouch}
          >
            <Zap className="h-3 w-3 mr-1.5" />
            {hook.category}
          </Badge>
        </TooltipTrigger>
        {showDetails && (
          <TooltipContent side="top" className="max-w-xs">
            <div className="space-y-2">
              <p className="font-semibold text-orange-600">{hook.category}</p>
              <div className="bg-background/50 p-2 rounded border">
                <p className="text-xs font-medium">Hook:</p>
                <p className="text-xs text-foreground">"{hook.text}"</p>
              </div>
              {hook.example && (
                <div className="bg-background/50 p-2 rounded border">
                  <p className="text-xs font-medium">Exemplo:</p>
                  <p className="text-xs text-muted-foreground">{hook.example}</p>
                </div>
              )}
              <p className="text-xs text-success">✅ Hook integrado</p>
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

