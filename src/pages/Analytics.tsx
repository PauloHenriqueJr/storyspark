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
  GitCompare
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

const engagementData = [
  { name: 'Jan', impressions: 45000, engagements: 3200, reach: 38000 },
  { name: 'Fev', impressions: 52000, engagements: 4100, reach: 44000 },
  { name: 'Mar', impressions: 48000, engagements: 3800, reach: 41000 },
  { name: 'Abr', impressions: 61000, engagements: 4800, reach: 52000 },
  { name: 'Mai', impressions: 58000, engagements: 4600, reach: 49000 },
  { name: 'Jun', impressions: 67000, engagements: 5400, reach: 58000 },
];

const platformData = [
  { name: 'Instagram', value: 45, color: '#E4405F' },
  { name: 'Facebook', value: 30, color: '#1877F2' },
  { name: 'LinkedIn', value: 15, color: '#0A66C2' },
  { name: 'Twitter', value: 7, color: '#1DA1F2' },
  { name: 'YouTube', value: 3, color: '#FF0000' },
];

const topContent = [
  {
    id: 1,
    title: 'Tutorial: Como usar IA no Marketing',
    platform: 'Instagram',
    impressions: '23.5K',
    engagements: '1.8K',
    engagement_rate: '7.6%',
    date: '2024-11-15'
  },
  {
    id: 2,
    title: 'Dicas de Copywriting para E-commerce',
    platform: 'LinkedIn',
    impressions: '18.2K',
    engagements: '1.4K',
    engagement_rate: '7.7%',
    date: '2024-11-10'
  },
  {
    id: 3,
    title: 'Black Friday: Estratégias que Funcionam',
    platform: 'Facebook',
    impressions: '31.8K',
    engagements: '2.1K',
    engagement_rate: '6.6%',
    date: '2024-11-08'
  }
];

const metrics = [
  {
    title: 'Total de Impressões',
    value: '847.3K',
    change: '+18.2%',
    trend: 'up',
    icon: Eye,
    color: 'text-blue-500'
  },
  {
    title: 'Engajamento Total',
    value: '65.4K',
    change: '+12.7%',
    trend: 'up',
    icon: Heart,
    color: 'text-red-500'
  },
  {
    title: 'Taxa de Engajamento',
    value: '7.7%',
    change: '+0.8%',
    trend: 'up',
    icon: TrendingUp,
    color: 'text-emerald-500'
  },
  {
    title: 'Novo Seguidores',
    value: '2.1K',
    change: '-3.2%',
    trend: 'down',
    icon: Users,
    color: 'text-purple-500'
  }
];

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('6m');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [showExportModal, setShowExportModal] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showDrillDown, setShowDrillDown] = useState(false);

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
              <SelectItem value="3m">Últimos 3 meses</SelectItem>
              <SelectItem value="6m">Últimos 6 meses</SelectItem>
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
          <Button variant="outline">
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
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowDrillDown(true)}
                  >
                    Ver Detalhes
                  </Button>
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
                      data={platformData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {platformData.map((platform, index) => (
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
              {topContent.map((content, index) => (
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
                      <div className="text-lg font-bold text-emerald-500">{content.engagement_rate}</div>
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