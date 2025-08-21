import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Building2,
  TrendingUp,
  AlertTriangle,
  Activity,
  Database,
  Shield,
  Settings
} from 'lucide-react';

const AdminDashboard = () => {
  const statsCards = [
    {
      title: 'Total de Usuários',
      value: '1,247',
      change: '+12%',
      changeType: 'positive' as const,
      icon: Users
    },
    {
      title: 'Empresas Ativas',
      value: '89',
      change: '+8%',
      changeType: 'positive' as const,
      icon: Building2
    },
    {
      title: 'Performance Geral',
      value: '94.2%',
      change: '+2.1%',
      changeType: 'positive' as const,
      icon: TrendingUp
    },
    {
      title: 'Alertas Críticos',
      value: '3',
      change: '-1',
      changeType: 'negative' as const,
      icon: AlertTriangle
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
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className={`text-xs ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change} em relação ao mês anterior
              </p>
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