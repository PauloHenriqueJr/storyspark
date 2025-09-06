import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FileText, Zap, X } from "lucide-react";
import { useState } from "react";

interface UnifiedActiveIndicatorProps {
  selectedTemplate?: any;
  selectedHook?: any;
  onClearTemplate?: () => void;
  onClearHook?: () => void;
  variant?: 'floating' | 'inline' | 'compact';
  interactive?: boolean;
}

export const UnifiedActiveIndicator = ({ 
  selectedTemplate, 
  selectedHook, 
  onClearTemplate, 
  onClearHook,
  variant = 'floating',
  interactive = true
}: UnifiedActiveIndicatorProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  if (!selectedTemplate && !selectedHook) return null;
  const activeCount = (selectedTemplate ? 1 : 0) + (selectedHook ? 1 : 0);
  const handleMouseEnter = () => { if (interactive) setIsExpanded(true); };
  const handleMouseLeave = () => { if (interactive) setIsExpanded(false); };
  const handleTouch = () => { if (interactive) { setIsExpanded(true); setTimeout(() => setIsExpanded(false), 3000); } };

  if (variant === 'floating') {
    return (
      <TooltipProvider>
        <div className="fixed top-4 right-4 z-50">
          <div 
            className={`bg-background/95 backdrop-blur-sm border border-orange-500/30 rounded-lg shadow-lg transition-all duration-300 ${
              isExpanded ? 'p-4 min-w-80 max-w-sm' : 'p-2'
            }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouch}
          >
            {!isExpanded ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <div className="h-4 w-4 bg-orange-500 rounded-full animate-pulse" />
                    <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/30">
                      {activeCount} ativo{activeCount > 1 ? 's' : ''}
                    </Badge>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Passe o mouse para ver detalhes</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <div className="space-y-3">
                <div className="space-y-2">
                  {selectedTemplate && (
                    <div className="flex items-center justify-between bg-orange-50 dark:bg-orange-950/30 p-2 rounded border border-orange-200 dark:border-orange-800">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <FileText className="h-3 w-3 text-orange-600 flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="text-xs font-medium text-orange-700 dark:text-orange-300 truncate">{selectedTemplate.name}</div>
                          <div className="text-xs text-orange-600/70 truncate">Template ativo</div>
                        </div>
                      </div>
                      {onClearTemplate && (
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClearTemplate(); }}
                          className="p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                          title="Remover template"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  )}
                  {selectedHook && (
                    <div className="flex items-center justify-between bg-orange-50 dark:bg-orange-950/30 p-2 rounded border border-orange-200 dark:border-orange-800">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Zap className="h-3 w-3 text-orange-600 flex-shrink-0 animate-pulse" />
                        <div className="min-w-0">
                          <div className="text-xs font-medium text-orange-700 dark:text-orange-300 truncate">{selectedHook.category}</div>
                          <div className="text-xs text-orange-600/70 truncate">Hook integrado</div>
                        </div>
                      </div>
                      {onClearHook && (
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClearHook(); }}
                          className="p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                          title="Remover hook"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <div className="text-xs text-center text-orange-600/70 pt-2 border-t border-orange-200 dark:border-orange-800">
                  Clique nos X para remover elementos
                </div>
              </div>
            )}
          </div>
        </div>
      </TooltipProvider>
    );
  }

  if (variant === 'inline') {
    return (
      <TooltipProvider>
        <div className="flex items-center gap-2 flex-wrap">
          {selectedTemplate && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="bg-orange-500 text-white border-orange-500 shadow-sm hover:bg-orange-600 transition-colors cursor-help">
                  <FileText className="h-3 w-3 mr-1.5" />
                  Template: {selectedTemplate.name}
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <div className="space-y-1">
                  <p className="font-semibold text-orange-600">{selectedTemplate.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedTemplate.description}</p>
                  <p className="text-xs text-success">👌 Template configurado</p>
                </div>
              </TooltipContent>
            </Tooltip>
          )}
          {selectedHook && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="bg-orange-500 text-white border-orange-500 shadow-sm hover:bg-orange-600 transition-colors cursor-help animate-pulse">
                  <Zap className="h-3 w-3 mr-1.5" />
                  Hook: {selectedHook.category}
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <div className="space-y-2">
                  <p className="font-semibold text-orange-600">{selectedHook.category}</p>
                  <div className="bg-background/50 p-2 rounded border">
                    <p className="text-xs font-medium">Hook:</p>
                    <p className="text-xs text-foreground">"{selectedHook.text}"</p>
                  </div>
                  {selectedHook.example && (
                    <div className="bg-background/50 p-2 rounded border">
                      <p className="text-xs font-medium">Exemplo:</p>
                      <p className="text-xs text-muted-foreground">{selectedHook.example}</p>
                    </div>
                  )}
                  <p className="text-xs text-success">✅ Hook integrado</p>
                </div>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        {selectedTemplate && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="bg-orange-500 text-white border-orange-500 shadow-sm hover:bg-orange-600 transition-colors cursor-help">
                <FileText className="h-3 w-3 mr-1.5" />
                Template
              </Badge>
            </TooltipTrigger>
            <TooltipContent side="top"><p className="font-medium">{selectedTemplate.name}</p></TooltipContent>
          </Tooltip>
        )}
        {selectedHook && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="bg-orange-500 text-white border-orange-500 shadow-sm hover:bg-orange-600 transition-colors cursor-help animate-pulse">
                <Zap className="h-3 w-3 mr-1.5" />
                Hook
              </Badge>
            </TooltipTrigger>
            <TooltipContent side="top"><p className="font-medium">{selectedHook.category}</p></TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
};
