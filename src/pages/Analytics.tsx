import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Eye, 
  Heart,
  MessageCircle,
  Share2,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  GitCompare,
  Loader2,
  AlertCircle,
  Wand2
} from 'lucide-react';
import ExportReportModal from '@/components/modals/ExportReportModal';
import ComparePeriodModal from '@/components/modals/ComparePeriodModal';
import { DrillDownChart } from '@/components/analytics/DrillDownChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useFloatingButton } from '@/contexts/FloatingButtonContext';

const Analytics = () => {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showDrillDown, setShowDrillDown] = useState(false);
  const { openModal } = useFloatingButton();
  
  const {
    workspaceStats,
    usageData,
    platformDistribution,
    contentPerformance,
    loading,
    error,
    timeRange,
    setTimeRange,
    refreshData
  } = useAnalytics(false);

  // Transform usage data for charts
  const engagementData = usageData.map(item => ({
    name: item.period,
    impressions: item.copies * 10, // Mock conversion
    engagements: item.copies,
    reach: item.users * 50 // Mock conversion
  }));

  const handleAnalyzeEngagement = () => {
    const prompt = `
      Baseado nos seguintes dados de "Evolução do Engajamento" para o período de ${timeRange},
      gere um resumo com insights e sugestões de melhoria.
      Analise as tendências de impressões e engajamentos e forneça recomendações práticas.

      Dados:
      ${JSON.stringify(engagementData, null, 2)}
    `;
    openModal(prompt);
  };

  const metrics = [
    {
      title: 'Total de Copies',
      value: workspaceStats?.totalCopies?.toLocaleString() || '0',
      change: '+18.2%',
      trend: 'up',
      icon: Eye,
      color: 'text-blue-500'
    },
    {
      title: 'Taxa de Engajamento',
      value: `${workspaceStats?.averageEngagement || 0}%`,
      change: '+12.7%',
      trend: 'up',
      icon: Heart,
      color: 'text-red-500'
    },
    {
      title: 'Taxa de Conversão',
      value: `${workspaceStats?.conversionRate || 0}%`,
      change: '+0.8%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-emerald-500'
    },
    {
      title: 'Templates Ativos',
      value: contentPerformance.length.toString(),
      change: '-3.2%',
      trend: 'down',
      icon: Users,
      color: 'text-purple-500'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Carregando analytics...</span>
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
            <h3 className="text-lg font-semibold text-foreground mb-1">Erro ao carregar analytics</h3>
            <p className="text-muted-foreground">{error}</p>
            <Button className="mt-4" onClick={() => refreshData()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar Novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-primary" />
            Analytics
          </h1>
          <p className="text-muted-foreground">
            Acompanhe a performance das suas campanhas
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="90d">Últimos 3 meses</SelectItem>
              <SelectItem value="1y">Último ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => setShowCompareModal(true)}>
            <GitCompare className="w-4 h-4 mr-2" />
            Comparar
          </Button>
          <Button variant="outline" onClick={() => setShowExportModal(true)}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" onClick={() => refreshData()}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {metrics.map((metric, index) => (
          <Card key={index} className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className={`flex items-center gap-1 text-xs ${
                metric.trend === 'up' ? 'text-emerald-500' : 'text-red-500'
              }`}>
                {metric.trend === 'up' ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>{metric.change}</span>
                <span className="text-muted-foreground">vs. período anterior</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Engagement Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          {showDrillDown ? (
            <DrillDownChart 
              title="Evolução do Engajamento"
              data={engagementData}
              onBack={() => setShowDrillDown(false)}
            />
          ) : (
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Evolução do Engajamento</CardTitle>
                    <CardDescription>
                      Impressões vs Engajamentos nos últimos 6 meses
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAnalyzeEngagement}
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      Analisar com IA
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDrillDown(true)}
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={engagementData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="impressions" 
                        stackId="1"
                        stroke="hsl(var(--primary))" 
                        fill="hsl(var(--primary))"
                        fillOpacity={0.6}
                        name="Impressões"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="engagements" 
                        stackId="2"
                        stroke="hsl(var(--secondary))" 
                        fill="hsl(var(--secondary))"
                        fillOpacity={0.8}
                        name="Engajamentos"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Platform Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Distribuição por Plataforma</CardTitle>
              <CardDescription>
                Percentual de engajamento por rede social
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={platformDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {platformDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {platformDistribution.map((platform, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: platform.color }}
                      />
                      <span className="text-sm">{platform.name}</span>
                    </div>
                    <span className="text-sm font-medium">{platform.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Top Performing Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Conteúdos com Melhor Performance</CardTitle>
            <CardDescription>
              Top 3 posts com maior engajamento no período
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contentPerformance.map((content, index) => (
                <div key={content.id} className="flex items-center gap-4 p-4 rounded-lg bg-muted/20 border border-border/40">
                  <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <h4 className="font-medium">{content.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <Badge variant="outline">{content.platform}</Badge>
                      <span>{content.date}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold">{content.impressions}</div>
                      <div className="text-xs text-muted-foreground">Impressões</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold">{content.engagements}</div>
                      <div className="text-xs text-muted-foreground">Engajamentos</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-emerald-500">{content.engagementRate}</div>
                      <div className="text-xs text-muted-foreground">Taxa Eng.</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Engagement Goals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Metas de Engajamento</CardTitle>
            <CardDescription>
              Progresso das metas mensais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Meta de Impressões</span>
                  <span>847K / 1M</span>
                </div>
                <Progress value={84.7} className="h-2" />
                <p className="text-xs text-muted-foreground">84.7% da meta atingida</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Meta de Engajamento</span>
                  <span>65.4K / 80K</span>
                </div>
                <Progress value={81.75} className="h-2" />
                <p className="text-xs text-muted-foreground">81.8% da meta atingida</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Meta de Seguidores</span>
                  <span>2.1K / 3K</span>
                </div>
                <Progress value={70} className="h-2" />
                <p className="text-xs text-muted-foreground">70% da meta atingida</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Modals */}
      <ExportReportModal 
        open={showExportModal}
        onOpenChange={setShowExportModal}
      />
      
      <ComparePeriodModal 
        open={showCompareModal}
        onOpenChange={setShowCompareModal}
      />
    </div>
  );
};

export default Analytics;