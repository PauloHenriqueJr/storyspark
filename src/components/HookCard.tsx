import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Hook } from "@/data/hooks";
import { useNavigate } from "react-router-dom";
import { Heart, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface HookCardProps {
  hook: Hook;
  onUse?: (hook: Hook) => void;
}

export const HookCard = ({ hook, onUse }: HookCardProps) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  
  const handleUseHook = () => {
    // Analytics tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'hook_selected', {
        hook_id: hook.id,
        category: hook.category,
        text: hook.text
      });
    }
    
    // Toast feedback with more information
    toast.success("🎯 Hook enviado para o Composer!", {
      description: "Modo Mão na Massa ativado para expansão completa do hook",
      duration: 4000
    });
    
    // Navigate to composer with hook
    navigate("/composer", { 
      state: { 
        selectedHook: hook,
        fromHooks: true
      }
    });
    
    // Optional callback
    onUse?.(hook);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos");
  };

  const getCategoryColor = (category: Hook['category']) => {
    switch (category) {
      case 'Curiosidade':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Autoridade':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'Urgência':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'Storytelling':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';  
      case 'Prova Social':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border border-border/50 hover:border-orange-500/30 bg-card animate-fade-in hover:shadow-orange-500/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Badge 
            variant="secondary" 
            className={`${getCategoryColor(hook.category)} text-xs font-medium transition-all group-hover:scale-105`}
          >
            {hook.category}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFavorite}
            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Heart 
              className={`h-4 w-4 ${
                isFavorite 
                  ? 'fill-red-500 text-red-500' 
                  : 'text-muted-foreground hover:text-red-500'
              }`} 
            />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium leading-relaxed text-foreground">
            {hook.text}
          </p>
          
          <div className="p-3 rounded-md bg-muted/50 border border-border/30">
            <p className="text-xs text-muted-foreground font-medium mb-1">
              Exemplo:
            </p>
            <p className="text-xs text-muted-foreground italic leading-relaxed">
              "{hook.example}"
            </p>
          </div>
        </div>
        
        {hook.tags && hook.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {hook.tags.map((tag) => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="text-xs px-2 py-0.5 bg-secondary/30 text-secondary-foreground/70 border-secondary/30"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          onClick={handleUseHook}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
          size="sm"
        >
          <Zap className="h-4 w-4 mr-2" />
          Usar no Composer
        </Button>
      </CardFooter>
    </Card>
  );
};