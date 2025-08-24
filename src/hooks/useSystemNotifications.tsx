import { useEffect, useState } from 'react';
import { useSystemToastNotifications } from './useSystemToastNotifications';
import { useWorkspace } from './useWorkspace';

interface MetricThresholds {
  creditUsageWarning: number; // Porcentagem de uso de créditos para avisar
  creditUsageCritical: number; // Porcentagem de uso de créditos para alerta crítico
  campaignBudgetWarning: number; // Porcentagem do orçamento da campanha para avisar
  engagementThreshold: number; // Meta de engajamento mínimo
}

interface MonitoredMetrics {
  creditUsage: number;
  activeCampaigns: number;
  monthlyEngagement: number;
  lastNotificationCheck: Date;
}

const DEFAULT_THRESHOLDS: MetricThresholds = {
  creditUsageWarning: 80,
  creditUsageCritical: 95,
  campaignBudgetWarning: 85,
  engagementThreshold: 75
};

export const useSystemNotifications = () => {
  const { showSuccess, showError, showWarning, showInfo } = useSystemToastNotifications();
  const { workspace } = useWorkspace();
  const [lastCheck, setLastCheck] = useState<Date>(new Date());
  const [thresholds] = useState<MetricThresholds>(DEFAULT_THRESHOLDS);

  // Função para verificar uso de créditos
  const checkCreditUsage = () => {
    if (!workspace) return;

    const usagePercent = (workspace.credits_used / workspace.credits) * 100;

    // Aviso crítico (95%+)
    if (usagePercent >= thresholds.creditUsageCritical) {
      showError(
        '⚠️ Créditos quase esgotados',
        `Você usou ${usagePercent.toFixed(0)}% dos seus créditos mensais. Considere fazer upgrade do plano.`,
        6000
      );
    }
    // Aviso de atenção (80%+)
    else if (usagePercent >= thresholds.creditUsageWarning) {
      showWarning(
        '📊 Limite de créditos se aproximando',
        `Você usou ${usagePercent.toFixed(0)}% dos seus créditos mensais. Monitore seu uso.`,
        5000
      );
    }
  };

  // Função para verificar metas de engajamento
  const checkEngagementGoals = () => {
    // Simulando dados de engajamento
    const currentEngagement = Math.floor(Math.random() * 100);
    const goalEngagement = thresholds.engagementThreshold;

    if (currentEngagement >= goalEngagement + 10) {
      showSuccess(
        '🎉 Meta de engajamento superada!',
        `Parabéns! Você atingiu ${currentEngagement}% de engajamento, superando sua meta de ${goalEngagement}%.`,
        5000
      );
    }
  };

  // Função para notificações de campanhas
  const checkCampaignUpdates = () => {
    // Simulando eventos de campanha
    const events = [
      {
        type: 'campaign_approved',
        campaignName: 'Black Friday 2024',
        probability: 0.1
      },
      {
        type: 'campaign_budget_threshold',
        campaignName: 'Promoção de Verão',
        probability: 0.15
      },
      {
        type: 'high_engagement_detected',
        campaignName: 'Lançamento de Produto',
        probability: 0.08
      }
    ];

    events.forEach(event => {
      if (Math.random() < event.probability) {
        switch (event.type) {
          case 'campaign_approved':
            showSuccess(
              '✅ Campanha aprovada',
              `Sua campanha "${event.campaignName}" foi aprovada e está ativa.`,
              5000
            );
            break;
          
          case 'campaign_budget_threshold':
            showWarning(
              '💰 Orçamento da campanha',
              `A campanha "${event.campaignName}" atingiu 85% do orçamento.`,
              5000
            );
            break;
          
          case 'high_engagement_detected':
            showInfo(
              '📈 Alto engajamento detectado',
              `A campanha "${event.campaignName}" está com performance excepcional!`,
              5000
            );
            break;
        }
      }
    });
  };

  // Função para notificações de sistema
  const checkSystemUpdates = () => {
    const systemEvents = [
      {
        type: 'feature_announcement',
        message: 'Nova funcionalidade: Agendamento inteligente de posts',
        probability: 0.05
      },
      {
        type: 'maintenance_notice',
        message: 'Manutenção programada para domingo às 02:00',
        probability: 0.03
      },
      {
        type: 'security_update',
        message: 'Atualização de segurança aplicada com sucesso',
        probability: 0.02
      }
    ];

    systemEvents.forEach(event => {
      if (Math.random() < event.probability) {
        let title = '';
        let type: 'info' | 'warning' | 'success' = 'info';
        
        switch (event.type) {
          case 'feature_announcement':
            title = '✨ Nova funcionalidade';
            type = 'info';
            break;
          case 'maintenance_notice':
            title = '🔧 Manutenção programada';
            type = 'warning';
            break;
          case 'security_update':
            title = '🔒 Atualização de segurança';
            type = 'success';
            break;
        }

        if (type === 'success') {
          showSuccess(title, event.message, 5000);
        } else if (type === 'warning') {
          showWarning(title, event.message, 5000);
        } else {
          showInfo(title, event.message, 5000);
        }
      }
    });
  };

  // Função principal de verificação
  const runSystemChecks = () => {
    checkCreditUsage();
    checkEngagementGoals();
    checkCampaignUpdates();
    checkSystemUpdates();
    setLastCheck(new Date());
  };

  // Executar verificações periodicamente
  useEffect(() => {
    // Verificação inicial após 10 segundos
    const initialTimeout = setTimeout(() => {
      runSystemChecks();
    }, 10000);

    // Verificações periódicas a cada 2 minutos
    const interval = setInterval(() => {
      runSystemChecks();
    }, 2 * 60 * 1000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [workspace?.id]);

  return {
    lastCheck,
    thresholds,
    runSystemChecks
  };
};