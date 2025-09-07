import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Zap, ArrowUpRight, CreditCard } from 'lucide-react';
import { useWorkspace } from '@/hooks/useWorkspace';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface CreditAlertProps {
  className?: string;
  showOnlyWhenLow?: boolean;
}

export const CreditAlert: React.FC<CreditAlertProps> = ({ 
  className = "", 
  showOnlyWhenLow = true 
}) => {
  const { workspace } = useWorkspace();

  if (!workspace) return null;

  const totalCredits = workspace.credits || 0;
  const usedCredits = workspace.credits_used || 0;
  const remainingCredits = totalCredits === -1 ? -1 : Math.max(0, totalCredits - usedCredits);
  const creditsPercent = totalCredits === -1 ? 100 : totalCredits > 0 ? (remainingCredits / totalCredits) * 100 : 0;
  
  const isUnlimited = totalCredits === -1;
  const lowCredits = !isUnlimited && creditsPercent < 30;
  const criticalCredits = !isUnlimited && creditsPercent < 15;

  // Se showOnlyWhenLow for true e créditos não estão baixos, não mostrar
  if (showOnlyWhenLow && !lowCredits && !isUnlimited) return null;
  
  // Se for unlimited, mostrar status positivo
  if (isUnlimited) {
    return (
      <Alert className={`border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 ${className}`}>
        <Zap className="h-4 w-4 text-emerald-600" />
        <AlertDescription className="text-emerald-800 dark:text-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold">Créditos Ilimitados</span>
              <p className="text-sm opacity-90">Plano Enterprise - Gere quantas copies precisar!</p>
            </div>
            <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-200">
              Ilimitado ∞
            </Badge>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  // Alertas para créditos baixos/críticos
  if (criticalCredits) {
    return (
      <motion.div
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <Alert className={`border-red-200 bg-red-50 dark:bg-red-950/20 ${className}`}>
          <AlertTriangle className="h-4 w-4 text-red-600 animate-pulse" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold">🔥 Créditos Críticos!</span>
                  <p className="text-sm">Apenas {remainingCredits} créditos restantes</p>
                </div>
                <Badge variant="destructive" className="animate-pulse">
                  {creditsPercent.toFixed(0)}% restante
                </Badge>
              </div>
              
              <Progress 
                value={creditsPercent} 
                className="h-2 bg-red-100 dark:bg-red-900/30"
                style={{"--progress-foreground": "rgb(239 68 68)"} as React.CSSProperties}
              />
              
              <div className="flex gap-2">
                <Button asChild size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                  <Link to="/billing">
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                    Upgrade Urgente
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="border-red-300 text-red-700">
                  <Link to="/billing">
                    <CreditCard className="w-3 h-3 mr-1" />
                    Ver Planos
                  </Link>
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      </motion.div>
    );
  }

  if (lowCredits) {
    return (
      <Alert className={`border-orange-200 bg-orange-50 dark:bg-orange-950/20 ${className}`}>
        <Zap className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800 dark:text-orange-200">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold">⚡ Créditos Baixos</span>
                <p className="text-sm">{remainingCredits} de {totalCredits} créditos disponíveis</p>
              </div>
              <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200">
                {creditsPercent.toFixed(0)}% restante
              </Badge>
            </div>
            
            <Progress 
              value={creditsPercent} 
              className="h-2 bg-orange-100 dark:bg-orange-900/30"
              style={{"--progress-foreground": "rgb(249 115 22)"} as React.CSSProperties}
            />
            
            <div className="flex gap-2">
              <Button asChild size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                <Link to="/billing">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  Fazer Upgrade
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="border-orange-300 text-orange-700">
                <Link to="/billing">
                  Ver Planos
                </Link>
              </Button>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  // Status normal dos créditos (só se showOnlyWhenLow for false)
  if (!showOnlyWhenLow) {
    return (
      <Alert className={`border-green-200 bg-green-50 dark:bg-green-950/20 ${className}`}>
        <Zap className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800 dark:text-green-200">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold">Créditos OK</span>
              <p className="text-sm">{remainingCredits} de {totalCredits} créditos disponíveis</p>
            </div>
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
              {creditsPercent.toFixed(0)}%
            </Badge>
          </div>
          <Progress 
            value={creditsPercent} 
            className="h-2 bg-green-100 dark:bg-green-900/30 mt-2"
            style={{"--progress-foreground": "rgb(34 197 94)"} as React.CSSProperties}
          />
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};
