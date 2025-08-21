import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  CreditCard,
  AlertTriangle,
  Download,
  MoreHorizontal,
  Eye,
  Edit,
  RefreshCw,
  Calendar,
  PieChart,
  BarChart3
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

const AdminBillingGlobal = () => {
  const [period, setPeriod] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data para faturamento global
  const revenueData = [
    { name: 'Jan', receita: 245000, custos: 180000, lucro: 65000 },
    { name: 'Fev', receita: 278000, custos: 195000, lucro: 83000 },
    { name: 'Mar', receita: 312000, custos: 210000, lucro: 102000 },
    { name: 'Abr', receita: 289000, custos: 205000, lucro: 84000 },
    { name: 'Mai', receita: 334000, custos: 225000, lucro: 109000 },
    { name: 'Jun', receita: 367000, custos: 240000, lucro: 127000 }
  ];

  const planDistribution = [
    { name: 'Starter', value: 45, revenue: 89000, color: '#8B5CF6' },
    { name: 'Professional', value: 35, revenue: 156000, color: '#3B82F6' },
    { name: 'Enterprise', value: 20, revenue: 122000, color: '#10B981' }
  ];

  const topCustomers = [
    {
      id: 1,
      name: 'TechCorp Solutions Ltd',
      plan: 'Enterprise',
      revenue: 'R$ 15.240/mês',
      status: 'active',
      nextBilling: '2024-02-15',
      growth: '+23%'
    },
    {
      id: 2,
      name: 'Marketing Pro Agency',
      plan: 'Professional',
      revenue: 'R$ 8.970/mês',
      status: 'active',
      nextBilling: '2024-02-18',
      growth: '+18%'
    },
    {
      id: 3,
      name: 'Creative Studio International',
      plan: 'Enterprise',
      revenue: 'R$ 12.450/mês',
      status: 'pending',
      nextBilling: '2024-02-20',
      growth: '+15%'
    },
    {
      id: 4,
      name: 'Digital Innovation Co',
      plan: 'Professional',
      revenue: 'R$ 5.680/mês',
      status: 'active',
      nextBilling: '2024-02-22',
      growth: '+12%'
    }
  ];

  const transactions = [
    {
      id: 1,
      customer: 'TechCorp Solutions',
      amount: 'R$ 15.240',
      status: 'completed',
      date: '2024-01-21',
      plan: 'Enterprise',
      method: 'Credit Card'
    },
    {
      id: 2,
      customer: 'Marketing Pro Agency',
      amount: 'R$ 8.970',
      status: 'completed',
      date: '2024-01-20',
      plan: 'Professional',
      method: 'Bank Transfer'
    },
    {
      id: 3,
      customer: 'Creative Studio',
      amount: 'R$ 12.450',
      status: 'failed',
      date: '2024-01-19',
      plan: 'Enterprise',
      method: 'Credit Card'
    },
    {
      id: 4,
      customer: 'StartupX Inc',
      amount: 'R$ 2.990',
      status: 'pending',
      date: '2024-01-18',
      plan: 'Starter',
      method: 'PIX'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'pending': return 'Pendente';
      case 'failed': return 'Falhou';
      case 'completed': return 'Concluído';
      default: return 'Desconhecido';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Starter': return 'bg-purple-100 text-purple-800';
      case 'Professional': return 'bg-blue-100 text-blue-800';
      case 'Enterprise': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const globalStats = [
    {
      title: 'Receita Total',
      value: 'R$ 367K',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      period: 'este mês'
    },
    {
      title: 'Clientes Pagantes',
      value: '1.247',
      change: '+8.3%',
      trend: 'up',
      icon: Users,
      period: 'vs mês anterior'
    },
    {
      title: 'Taxa de Conversão',
      value: '23.4%',
      change: '+2.1%',
      trend: 'up',
      icon: TrendingUp,
      period: 'últimos 30 dias'
    },
    {
      title: 'Churn Rate',
      value: '4.2%',
      change: '-0.8%',
      trend: 'down',
      icon: AlertTriangle,
      period: 'este mês'
    }
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
          <h1 className="text-3xl font-bold text-foreground">Faturamento Global</h1>
          <p className="text-muted-foreground">Controle financeiro e métricas de receita</p>
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
                  <span className="text-muted-foreground">{stat.period}</span>
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
          <TabsTrigger value="customers">Clientes</TabsTrigger>
          <TabsTrigger value="transactions">Transações</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Receita vs Custos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `R$ ${value.toLocaleString()}`} />
                    <Area type="monotone" dataKey="receita" stackId="1" stroke="#22c55e" fill="#22c55e" />
                    <Area type="monotone" dataKey="custos" stackId="1" stroke="#ef4444" fill="#ef4444" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Plan Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Distribuição por Plano
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={planDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {planDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Revenue by Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Receita por Plano</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={planDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `R$ ${value.toLocaleString()}`} />
                  <Bar dataKey="revenue" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCustomers.map((customer) => (
                  <div key={customer.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-foreground">{customer.name}</h3>
                        <Badge className={getPlanColor(customer.plan)}>
                          {customer.plan}
                        </Badge>
                        <Badge className={getStatusColor(customer.status)}>
                          {getStatusText(customer.status)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span>Receita: {customer.revenue}</span>
                        <span>Próximo faturamento: {customer.nextBilling}</span>
                        <span className="text-green-600">Crescimento: {customer.growth}</span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Editar Plano
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Forçar Cobrança
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transações Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-medium text-foreground">{transaction.customer}</span>
                        <Badge className={getPlanColor(transaction.plan)}>
                          {transaction.plan}
                        </Badge>
                        <Badge className={getStatusColor(transaction.status)}>
                          {getStatusText(transaction.status)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span>Valor: {transaction.amount}</span>
                        <span>Data: {transaction.date}</span>
                        <span>Método: {transaction.method}</span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Baixar Recibo
                        </DropdownMenuItem>
                        {transaction.status === 'failed' && (
                          <DropdownMenuItem>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Tentar Novamente
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>MRR (Monthly Recurring Revenue)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">R$ 367K</div>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">+12.5%</span>
                  <span className="text-muted-foreground">vs mês anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ARR (Annual Recurring Revenue)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">R$ 4.4M</div>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">+18.7%</span>
                  <span className="text-muted-foreground">vs ano anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>LTV (Lifetime Value)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">R$ 12.3K</div>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">+5.2%</span>
                  <span className="text-muted-foreground">vs trimestre anterior</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminBillingGlobal;