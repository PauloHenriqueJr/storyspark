
import React, { useState } from 'react';
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
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import CreateCampaignModal from '@/components/modals/CreateCampaignModal';
import { useStats } from '@/hooks/useStats';
import { useRecentActivities } from '@/hooks/useRecentActivities';
import { useWorkspace } from '@/hooks/useWorkspace';

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
  const { stats, loading: statsLoading } = useStats();
  const { activities, loading: activitiesLoading } = useRecentActivities();
  const { workspace, loading: workspaceLoading } = useWorkspace();

  const handleQuickAction = (href: string) => {
    if (href === '/campaigns') {
      setShowCreateCampaign(true);
    } else {
      navigate(href);
    }
  };

  const handleCreateCampaign = (campaign: any) => {
    console.log('Nova campanha criada:', campaign);
    navigate('/campaigns');
  };

  const statsCards = [
    {
      title: 'Campanhas Ativas',
      value: statsLoading ? '...' : stats.totalCampaigns.toString(),
      change: '+12%',
      trend: 'up',
      icon: Target,
      color: 'text-primary'
    },
    {
      title: 'Engagement Rate',
      value: statsLoading ? '...' : stats.engagementRate,
      change: '+2.4%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-emerald-500'
    },
    {
      title: 'Alcance Total',
      value: statsLoading ? '...' : stats.totalReach,
      change: '+18%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-500'
    },
    {
      title: 'Copies Geradas',
      value: statsLoading ? '...' : stats.copiesGenerated.toString(),
      change: '+34%',
      trend: 'up',
      icon: Zap,
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="space-y-8">
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
                {quickActions.map((action, index) => (
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
              {activitiesLoading ? (
                <div className="text-sm text-muted-foreground">Carregando atividades...</div>
              ) : activities.length === 0 ? (
                <div className="text-sm text-muted-foreground">Nenhuma atividade recente</div>
              ) : (
                activities.map((activity, index) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.created_at).toLocaleDateString('pt-BR')}
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
                <CardTitle>Performance Overview</CardTitle>
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
                  <span>Meta de Engagement</span>
                  <span>82%</span>
                </div>
                <Progress value={82} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Alcance Meta</span>
                  <span>67%</span>
                </div>
                <Progress value={67} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Créditos Usados</span>
                  <span>{workspace ? Math.round((workspace.credits_used / workspace.credits) * 100) : 0}%</span>
                </div>
                <Progress value={workspace ? (workspace.credits_used / workspace.credits) * 100 : 0} className="h-2" />
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
