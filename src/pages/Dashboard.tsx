import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Users,
  Target,
  Zap,
  ArrowUpRight,
  Calendar,
  BarChart3,
  Bot,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import CreateCampaignModal from '@/components/modals/CreateCampaignModal';
import { CreditAlert } from '@/components/ui/credit-alert';
// import SimpleTest from '@/components/upload/SimpleTest';

import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useCredits } from '@/context/CreditsProvider';
import { useNotifications } from '@/hooks/useNotifications';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';

const quickActions = [
  {
    title: 'Criar Copy com IA',
    description: 'Gere conteúdo otimizado',
    icon: Bot,
    href: '/composer',
    color: 'bg-gradient-primary text-white'
  },
  {
    title: 'Nova Campanha',
    description: 'Planeje sua próxima campanha',
    icon: Target,
    href: '/campaigns',
    color: 'bg-blue-500 text-white'
  },
  {
    title: 'Ver Analytics',
    description: 'Acompanhe performance',
    icon: BarChart3,
    href: '/analytics',
    color: 'bg-emerald-500 text-white'
  },
  {
    title: 'Agendar Posts',
    description: 'Organize seu calendário',
    icon: Calendar,
    href: '/calendar',
    color: 'bg-purple-500 text-white'
  }
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const {
    stats,
    recentActivities,
    loading,
    error
  } = useDashboardStats();
  const { workspace, loading: workspaceLoading } = useWorkspace();
  const { credits, creditsUsed, remainingCredits, plan, refresh } = useCredits();
  const { addNotification } = useNotifications();
  const { isFlagEnabled } = useFeatureFlags();

  const handleQuickAction = async (href: string) => {
    if (href === '/campaigns') {
      setShowCreateCampaign(true);
    } else {
      navigate(href);
    }
  };

  const handleCreateCampaign = async (campaign: unknown) => {
    console.log('Nova campanha criada:', campaign);

    // Exemplo de notificação de sucesso
    addNotification({
      title: 'Campanha criada com sucesso!',
      message: 'Sua nova campanha foi criada e está pronta para ser configurada.',
      type: 'success',
      action: {
        label: 'Ver campanha',
        onClick: () => navigate('/campaigns')
      }
    });

    navigate('/campaigns');
  };

  const statsCards = [
    {
      title: 'Campanhas Ativas',
      value: loading ? '...' : (stats?.activeCampaigns || 0).toString(),
      change: stats?.monthlyGrowth.campaigns || '+0%',
      trend: 'up',
      icon: Target,
      color: 'text-primary'
    },
    {
      title: 'Taxa de Engajamento',
      value: loading ? '...' : `${stats?.averageEngagement || 0}%`,
      change: stats?.monthlyGrowth.engagement || '+0%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-emerald-500'
    },
    {
      title: 'Taxa de Conversão',
      value: loading ? '...' : `${stats?.conversionRate || 0}%`,
      change: stats?.monthlyGrowth.conversion || '+0%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-500'
    },
    {
      title: 'Copies Geradas',
      value: loading ? '...' : (stats?.totalCopies || 0).toString(),
      change: stats?.monthlyGrowth.copies || '+0%',
      trend: 'up',
      icon: Zap,
      color: 'text-purple-500'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Carregando dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-foreground mb-1">Erro ao carregar dashboard</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Credit Alert */}
      <CreditAlert className="mb-6" />

      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Bem-vindo de volta! 👋
          </h1>
          <p className="text-muted-foreground">
            {workspaceLoading ? 'Carregando...' : `Aqui está um resumo do ${workspace?.name || 'seu workspace'}.`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Últimos 7 dias
          </Button>
          <Button
            className="bg-gradient-primary"
            onClick={() => navigate('/composer')}
          >
            <Bot className="w-4 h-4 mr-2" />
            Criar Copy
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statsCards.map((stat, index) => (
          <motion.div key={index} variants={fadeInUp}>
            <Card className="hover:shadow-elegant transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                  <span className="text-emerald-500">{stat.change}</span>
                  <span>vs. mês anterior</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>
                Acesse rapidamente as funcionalidades mais utilizadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions
                  .filter((action) => isFlagEnabled('principal', action.href))
                  .map((action, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="ghost"
                        className={`h-auto w-full p-6 ${action.color} hover:opacity-90 transition-all duration-200`}
                        onClick={() => handleQuickAction(action.href)}
                      >
                        <div className="flex items-center gap-4">
                          <action.icon className="h-8 w-8" />
                          <div className="text-left">
                            <div className="font-semibold">{action.title}</div>
                            <div className="text-sm opacity-90">
                              {action.description}
                            </div>
                          </div>
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                {quickActions.filter((a) => isFlagEnabled('principal', a.href)).length === 0 && (
                  <div className="text-sm text-muted-foreground">
                    Nenhuma ação disponível no momento.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
              <CardDescription>
                Acompanhe as últimas ações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="text-sm text-muted-foreground">Carregando atividades...</div>
              ) : recentActivities.length === 0 ? (
                <div className="text-sm text-muted-foreground">Nenhuma atividade recente</div>
              ) : (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <span className="text-lg">{activity.icon}</span>
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>



      {/* Performance Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Visão geral do desempenho</CardTitle>
                <CardDescription>
                  {workspaceLoading ? 'Carregando...' : `Métricas do ${workspace?.name || 'workspace'}`}
                </CardDescription>
              </div>
              <Badge variant="secondary">Última atualização: agora</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Engagement Alcançado</span>
                  <span>{stats?.averageEngagement || 0}%</span>
                </div>
                <Progress value={stats?.averageEngagement || 0} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Taxa de Conversão</span>
                  <span>{stats?.conversionRate || 0}%</span>
                </div>
                <Progress value={stats?.conversionRate || 0} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Créditos</span>
                  {credits === 99999 ? (
                    <span>Ilimitado</span>
                  ) : (
                    <span>{Math.min(100, Math.round((creditsUsed / Math.max(1, credits)) * 100))}% usados · {remainingCredits} restantes</span>
                  )}
                </div>
                <Progress value={credits === 99999 ? 0 : (creditsUsed / Math.max(1, credits)) * 100} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Create Campaign Modal */}
      <CreateCampaignModal
        open={showCreateCampaign}
        onOpenChange={setShowCreateCampaign}
        onCreateCampaign={handleCreateCampaign}
      />
    </div>
  );
};

export default Dashboard;
