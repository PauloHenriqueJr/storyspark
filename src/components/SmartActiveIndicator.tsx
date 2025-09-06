import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Activity, Zap, Target, TrendingUp, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface SmartActiveIndicatorProps {
  variant?: 'inline' | 'floating' | 'compact' | 'full';
  status?: 'active' | 'processing' | 'completed' | 'error' | 'idle';
  label?: string;
  description?: string;
  showIcon?: boolean;
  showPulse?: boolean;
  className?: string;
  onClick?: () => void;
  metrics?: {
    count?: number;
    percentage?: number;
    trend?: 'up' | 'down' | 'stable';
  };
}

const statusConfig = {
  active: {
    icon: Activity,
    color: 'bg-green-500',
    textColor: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    label: 'Ativo'
  },
  processing: {
    icon: Loader2,
    color: 'bg-blue-500',
    textColor: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    label: 'Processando'
  },
  completed: {
    icon: CheckCircle,
    color: 'bg-emerald-500',
    textColor: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    label: 'Concluído'
  },
  error: {
    icon: AlertCircle,
    color: 'bg-red-500',
    textColor: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    label: 'Erro'
  },
  idle: {
    icon: Clock,
    color: 'bg-gray-400',
    textColor: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    label: 'Inativo'
  }
};

const SmartActiveIndicator: React.FC<SmartActiveIndicatorProps> = ({
  variant = 'inline',
  status = 'idle',
  label,
  description,
  showIcon = true,
  showPulse = true,
  className,
  onClick,
  metrics
}) => {
  const config = statusConfig[status];
  const Icon = config.icon;
  const isClickable = !!onClick;

  // Componente de indicador básico
  const IndicatorDot = () => (
    <div className="relative">
      <div
        className={cn(
          'w-3 h-3 rounded-full',
          config.color,
          showPulse && status === 'active' && 'animate-pulse'
        )}
      />
      {showPulse && status === 'processing' && (
        <div className={cn(
          'absolute inset-0 w-3 h-3 rounded-full animate-ping',
          config.color,
          'opacity-75'
        )} />
      )}
    </div>
  );

  // Componente de ícone
  const IconComponent = () => (
    <Icon 
      className={cn(
        'w-4 h-4',
        config.textColor,
        status === 'processing' && 'animate-spin'
      )} 
    />
  );

  // Componente de métricas
  const MetricsDisplay = () => {
    if (!metrics) return null;

    return (
      <div className="flex items-center gap-2 text-sm">
        {metrics.count !== undefined && (
          <span className={cn('font-medium', config.textColor)}>
            {metrics.count}
          </span>
        )}
        {metrics.percentage !== undefined && (
          <span className={cn('text-xs', config.textColor)}>
            {metrics.percentage}%
          </span>
        )}
        {metrics.trend && (
          <TrendingUp 
            className={cn(
              'w-3 h-3',
              metrics.trend === 'up' ? 'text-green-500 rotate-0' :
              metrics.trend === 'down' ? 'text-red-500 rotate-180' :
              'text-gray-400'
            )}
          />
        )}
      </div>
    );
  };

  // Renderização baseada na variante
  const renderContent = () => {
    switch (variant) {
      case 'compact':
        return (
          <div className={cn(
            'flex items-center gap-2 px-2 py-1 rounded-md',
            config.bgColor,
            config.borderColor,
            'border',
            isClickable && 'cursor-pointer hover:opacity-80 transition-opacity',
            className
          )}>
            {showIcon ? <IconComponent /> : <IndicatorDot />}
            {label && (
              <span className={cn('text-xs font-medium', config.textColor)}>
                {label}
              </span>
            )}
            <MetricsDisplay />
          </div>
        );

      case 'floating':
        return (
          <div className={cn(
            'fixed bottom-4 right-4 z-50',
            'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg',
            'bg-white border border-gray-200',
            'backdrop-blur-sm bg-opacity-95',
            isClickable && 'cursor-pointer hover:shadow-xl transition-shadow',
            className
          )}>
            {showIcon ? <IconComponent /> : <IndicatorDot />}
            <div className="flex flex-col">
              {label && (
                <span className={cn('text-sm font-medium', config.textColor)}>
                  {label || config.label}
                </span>
              )}
              {description && (
                <span className="text-xs text-gray-500">
                  {description}
                </span>
              )}
            </div>
            <MetricsDisplay />
          </div>
        );

      case 'full':
        return (
          <div className={cn(
            'flex items-center justify-between p-4 rounded-lg',
            config.bgColor,
            config.borderColor,
            'border',
            isClickable && 'cursor-pointer hover:opacity-90 transition-opacity',
            className
          )}>
            <div className="flex items-center gap-3">
              {showIcon ? <IconComponent /> : <IndicatorDot />}
              <div className="flex flex-col">
                <span className={cn('text-sm font-medium', config.textColor)}>
                  {label || config.label}
                </span>
                {description && (
                  <span className="text-xs text-gray-500">
                    {description}
                  </span>
                )}
              </div>
            </div>
            <MetricsDisplay />
          </div>
        );

      case 'inline':
      default:
        return (
          <div className={cn(
            'inline-flex items-center gap-2',
            isClickable && 'cursor-pointer hover:opacity-80 transition-opacity',
            className
          )}>
            {showIcon ? <IconComponent /> : <IndicatorDot />}
            {label && (
              <span className={cn('text-sm', config.textColor)}>
                {label}
              </span>
            )}
            <MetricsDisplay />
          </div>
        );
    }
  };

  const content = renderContent();

  // Se há descrição e não é variante floating/full, envolver com tooltip
  if (description && !['floating', 'full'].includes(variant)) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div onClick={onClick}>
              {content}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">{description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div onClick={onClick}>
      {content}
    </div>
  );
};

// Componente de conveniência para status específicos
export const ActiveIndicator = (props: Omit<SmartActiveIndicatorProps, 'status'>) => (
  <SmartActiveIndicator {...props} status="active" />
);

export const ProcessingIndicator = (props: Omit<SmartActiveIndicatorProps, 'status'>) => (
  <SmartActiveIndicator {...props} status="processing" />
);

export const CompletedIndicator = (props: Omit<SmartActiveIndicatorProps, 'status'>) => (
  <SmartActiveIndicator {...props} status="completed" />
);

export const ErrorIndicator = (props: Omit<SmartActiveIndicatorProps, 'status'>) => (
  <SmartActiveIndicator {...props} status="error" />
);

export const IdleIndicator = (props: Omit<SmartActiveIndicatorProps, 'status'>) => (
  <SmartActiveIndicator {...props} status="idle" />
);

// Hook para gerenciar estado do indicador
export const useSmartIndicator = (initialStatus: SmartActiveIndicatorProps['status'] = 'idle') => {
  const [status, setStatus] = React.useState(initialStatus);
  const [metrics, setMetrics] = React.useState<SmartActiveIndicatorProps['metrics']>();

  const updateStatus = React.useCallback((newStatus: SmartActiveIndicatorProps['status']) => {
    setStatus(newStatus);
  }, []);

  const updateMetrics = React.useCallback((newMetrics: SmartActiveIndicatorProps['metrics']) => {
    setMetrics(newMetrics);
  }, []);

  const reset = React.useCallback(() => {
    setStatus('idle');
    setMetrics(undefined);
  }, []);

  return {
    status,
    metrics,
    updateStatus,
    updateMetrics,
    reset
  };
};

export default SmartActiveIndicator;
export type { SmartActiveIndicatorProps };