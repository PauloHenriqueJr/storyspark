import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import {
  Users,
  Building2,
  TrendingUp,
  AlertTriangle,
  Activity,
  Database,
  Shield,
  Settings,
  BarChart3,
  PieChart,
  Calendar,
  Clock,
  FileText,
  Mail,
  Zap,
  Globe
} from 'lucide-react';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    users: { total: 0, growth: 0, active: 0 },
    waitlist: { total: 0, growth: 0 },
    jobs: { total: 0, pending: 0, completed: 0, failed: 0 },
    performance: { uptime: 0, responseTime: 0 }
  });
  const { toast } = useToast();

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);

      // Buscar dados da waitlist
      const { data: waitlistData, error: waitlistError } = await supabase
        .from('waitlist_signups')
        .select('*');

      if (waitlistError) throw waitlistError;

      // Buscar dados dos jobs
      const { data: jobsData, error: jobsError } = await supabase
        .from('ai_processing_jobs')
        .select('*');

      if (jobsError) throw jobsError;

      // Calcular estatísticas
      const jobStats = {
        total: jobsData?.length || 0,
        pending: jobsData?.filter(job => job.status === 'pending').length || 0,
        completed: jobsData?.filter(job => job.status === 'completed').length || 0,
        failed: jobsData?.filter(job => job.status === 'failed').length || 0
      };

      setAnalytics({
        users: { total: 1247, growth: 12, active: 892 },
        waitlist: { total: waitlistData?.length || 0, growth: 8 },
        jobs: jobStats,
        performance: { uptime: 99.2, responseTime: 145 }
      });

    } catch (error) {
      console.error('Erro ao carregar analytics:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados de analytics.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Total de Usuários',
      value: analytics.users.total.toLocaleString(),
      change: `+${analytics.users.growth}%`,
      changeType: 'positive' as const,
      icon: Users,
      description: `${analytics.users.active} ativos`
    },
    {
      title: 'Lista de Espera',
      value: analytics.waitlist.total.toString(),
      change: `+${analytics.waitlist.growth}%`,
      changeType: 'positive' as const,
      icon: Mail,
      description: 'Inscrições pendentes'
    },
    {
      title: 'Jobs Processados',
      value: analytics.jobs.completed.toString(),
      change: `${analytics.jobs.total} total`,
      changeType: 'neutral' as const,
      icon: FileText,
      description: `${analytics.jobs.pending} pendentes`
    },
    {
      title: 'Uptime do Sistema',
      value: `${analytics.performance.uptime}%`,
      change: `${analytics.performance.responseTime}ms`,
      changeType: 'positive' as const,
      icon: Activity,
      description: 'Tempo de resposta médio'
    }
  ];

  const advancedMetrics = [
    {
      title: 'Processamento IA',
      total: analytics.jobs.total,
      completed: analytics.jobs.completed,
      pending: analytics.jobs.pending,
      failed: analytics.jobs.failed,
      icon: Zap
    },
    {
      title: 'Crescimento Mensal',
      users: analytics.users.growth,
      waitlist: analytics.waitlist.growth,
      icon: TrendingUp
    }
  ];

  const recentActivities = [
    { action: 'Nova empresa registrada', user: 'TechCorp Inc.', time: '2 min atrás', type: 'success' },
    { action: 'Upgrade de plano', user: 'Marketing Pro Ltda', time: '15 min atrás', type: 'info' },
    { action: 'Erro de integração', user: 'Sistema WhatsApp', time: '1h atrás', type: 'warning' },
    { action: 'Backup realizado', user: 'Sistema', time: '2h atrás', type: 'success' },
    { action: 'Usuário suspenso', user: 'usuario@exemplo.com', time: '3h atrás', type: 'error' }
  ];

  const systemStatus = [
    { service: 'API Principal', status: 'online', uptime: '99.9%' },
    { service: 'IA/OpenAI', status: 'online', uptime: '98.7%' },
    { service: 'WhatsApp API', status: 'warning', uptime: '95.2%' },
    { service: 'Email Service', status: 'online', uptime: '99.5%' },
    { service: 'Database', status: 'online', uptime: '100%' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600';
      case 'info': return 'text-blue-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Visão geral do sistema StorySpark</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={loadAnalytics}
            disabled={loading}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Activity className="h-4 w-4" />
            {loading ? 'Atualizando...' : 'Atualizar Dados'}
          </Button>
          <Button variant="outline" size="sm">
            <Database className="w-4 h-4 mr-2" />
            Backup Manual
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Configurações
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  <div className="h-8 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
                  <div className="h-3 bg-muted animate-pulse rounded w-1/2"></div>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="space-y-1">
                    <p className={`text-xs ${stat.changeType === 'positive' ? 'text-green-600' :
                        stat.changeType === 'negative' ? 'text-red-600' : 'text-blue-600'
                      }`}>
                      {stat.change}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Atividades Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.user}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className={getActivityTypeColor(activity.type)}>
                      {activity.type}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Analytics Avançados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Analytics Avançados
              </div>
              <Badge variant="outline" className="text-xs">
                Atualizado há {loading ? '...' : '2 min'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="jobs" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="jobs">Processamento IA</TabsTrigger>
                <TabsTrigger value="growth">Crescimento</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>

              <TabsContent value="jobs" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{analytics.jobs.total}</div>
                    <div className="text-sm text-blue-600">Total</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{analytics.jobs.completed}</div>
                    <div className="text-sm text-green-600">Concluídos</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{analytics.jobs.pending}</div>
                    <div className="text-sm text-yellow-600">Pendentes</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{analytics.jobs.failed}</div>
                    <div className="text-sm text-red-600">Falharam</div>
                  </div>
                </div>

                {analytics.jobs.total > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Taxa de Sucesso</span>
                      <span>{Math.round((analytics.jobs.completed / analytics.jobs.total) * 100)}%</span>
                    </div>
                    <Progress value={(analytics.jobs.completed / analytics.jobs.total) * 100} className="h-2" />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="growth" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Crescimento de Usuários
                    </h4>
                    <div className="text-3xl font-bold text-blue-600">+{analytics.users.growth}%</div>
                    <p className="text-sm text-muted-foreground">Este mês vs. mês anterior</p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Lista de Espera
                    </h4>
                    <div className="text-3xl font-bold text-green-600">+{analytics.waitlist.growth}%</div>
                    <p className="text-sm text-muted-foreground">Novas inscrições este mês</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="performance" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Uptime do Sistema
                    </h4>
                    <div className="text-3xl font-bold text-green-600">{analytics.performance.uptime}%</div>
                    <Progress value={analytics.performance.uptime} className="h-2" />
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Tempo de Resposta
                    </h4>
                    <div className="text-3xl font-bold text-blue-600">{analytics.performance.responseTime}ms</div>
                    <p className="text-sm text-muted-foreground">Tempo médio de resposta da API</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Status do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Métricas de Sistema em Tempo Real */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{analytics.performance.uptime}%</div>
                  <div className="text-sm text-green-600">Uptime</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{analytics.performance.responseTime}ms</div>
                  <div className="text-sm text-blue-600">Latência</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{analytics.jobs.total}</div>
                  <div className="text-sm text-purple-600">Jobs Processados</div>
                </div>
              </div>

              {systemStatus.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(service.status)}`} />
                    <span className="font-medium text-foreground">{service.service}</span>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">
                      {service.status === 'online' ? 'Online' :
                        service.status === 'warning' ? 'Atenção' : 'Offline'}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">Uptime: {service.uptime}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Users className="w-6 h-6" />
              <span className="text-xs">Usuários</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Building2 className="w-6 h-6" />
              <span className="text-xs">Empresas</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <TrendingUp className="w-6 h-6" />
              <span className="text-xs">Relatórios</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Settings className="w-6 h-6" />
              <span className="text-xs">Configurações</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Database className="w-6 h-6" />
              <span className="text-xs">Backup</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Shield className="w-6 h-6" />
              <span className="text-xs">Segurança</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
export { AdminDashboard as Component };