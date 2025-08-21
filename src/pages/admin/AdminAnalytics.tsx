import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Activity,
  DollarSign,
  Globe,
  BarChart3,
  PieChart,
  Download,
  Calendar
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';

const AdminAnalytics = () => {
  const [period, setPeriod] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data para analytics globais
  const globalStats = [
    {
      title: 'Usuários Ativos',
      value: '12,487',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      period: 'último mês'
    },
    {
      title: 'Receita Total',
      value: 'R$ 284K',
      change: '+18.2%',
      trend: 'up',
      icon: DollarSign,
      period: 'último mês'
    },
    {
      title: 'Copies Geradas',
      value: '156K',
      change: '+23.8%',
      trend: 'up',
      icon: Activity,
      period: 'último mês'
    },
    {
      title: 'Taxa de Retenção',
      value: '87.3%',
      change: '-2.1%',
      trend: 'down',
      icon: Globe,
      period: 'último mês'
    }
  ];

  const usageData = [
    { name: 'Jan', usuarios: 8400, copies: 12400, campanhas: 2400 },
    { name: 'Fev', usuarios: 9300, copies: 13800, campanhas: 2800 },
    { name: 'Mar', usuarios: 10200, copies: 15200, campanhas: 3200 },
    { name: 'Abr', usuarios: 11100, copies: 16800, campanhas: 3600 },
    { name: 'Mai', usuarios: 12000, copies: 18400, campanhas: 4000 },
    { name: 'Jun', usuarios: 12900, copies: 20200, campanhas: 4400 }
  ];

  const platformDistribution = [
    { name: 'Instagram', value: 35, color: '#E1306C' },
    { name: 'Facebook', value: 28, color: '#4267B2' },
    { name: 'LinkedIn', value: 20, color: '#0077B5' },
    { name: 'Twitter', value: 12, color: '#1DA1F2' },
    { name: 'Outros', value: 5, color: '#8B5CF6' }
  ];

  const revenueData = [
    { name: 'Jan', receita: 45000, custos: 32000 },
    { name: 'Fev', receita: 52000, custos: 35000 },
    { name: 'Mar', receita: 58000, custos: 38000 },
    { name: 'Abr', receita: 64000, custos: 41000 },
    { name: 'Mai', receita: 71000, custos: 44000 },
    { name: 'Jun', receita: 78000, custos: 47000 }
  ];

  const topUsers = [
    { name: 'TechCorp Solutions', usage: 2847, revenue: 'R$ 15.2K', growth: '+23%' },
    { name: 'Marketing Pro Agency', usage: 2156, revenue: 'R$ 12.8K', growth: '+18%' },
    { name: 'Creative Studio Ltd', usage: 1934, revenue: 'R$ 11.4K', growth: '+15%' },
    { name: 'Digital Innovation Co', usage: 1728, revenue: 'R$ 9.7K', growth: '+12%' },
    { name: 'Brand Masters Inc', usage: 1543, revenue: 'R$ 8.9K', growth: '+9%' }
  ];

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? TrendingUp : TrendingDown;
  };

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics Globais</h1>
          <p className="text-muted-foreground">Métricas e performance da plataforma</p>
        </div>
        <div className="flex gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 dias</SelectItem>
              <SelectItem value="30d">30 dias</SelectItem>
              <SelectItem value="90d">90 dias</SelectItem>
              <SelectItem value="1y">1 ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {globalStats.map((stat, index) => {
          const TrendIcon = getTrendIcon(stat.trend);
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="flex items-center gap-1 text-xs">
                  <TrendIcon className={`w-3 h-3 ${getTrendColor(stat.trend)}`} />
                  <span className={getTrendColor(stat.trend)}>{stat.change}</span>
                  <span className="text-muted-foreground">vs {stat.period}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="revenue">Receita</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="content">Conteúdo</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Usage Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Crescimento de Uso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={usageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="usuarios" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="copies" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                    <Area type="monotone" dataKey="campanhas" stackId="1" stroke="#ffc658" fill="#ffc658" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Platform Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Distribuição por Plataforma
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={platformDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {platformDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Top Users */}
          <Card>
            <CardHeader>
              <CardTitle>Top Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topUsers.map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.usage} copies geradas</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{user.revenue}</p>
                      <Badge variant="outline" className="text-green-600">
                        {user.growth}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Receita vs Custos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `R$ ${value.toLocaleString()}`} />
                  <Bar dataKey="receita" fill="#22c55e" name="Receita" />
                  <Bar dataKey="custos" fill="#ef4444" name="Custos" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Novos Usuários</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">1,247</div>
                <p className="text-sm text-muted-foreground">Este mês</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Usuários Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">8,934</div>
                <p className="text-sm text-muted-foreground">Últimos 30 dias</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Taxa de Churn</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">4.2%</div>
                <p className="text-sm text-muted-foreground">Este mês</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Conteúdo Mais Popular</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Posts Promocionais</span>
                    <Badge>34.2K usos</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Storytelling</span>
                    <Badge>28.7K usos</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Educativo</span>
                    <Badge>23.1K usos</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Performance por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>E-commerce</span>
                    <Badge variant="outline">15.4% CTR</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Tecnologia</span>
                    <Badge variant="outline">12.8% CTR</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Saúde</span>
                    <Badge variant="outline">11.2% CTR</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAnalytics;