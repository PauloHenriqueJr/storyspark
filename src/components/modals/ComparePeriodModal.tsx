import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3,
  Calendar,
  ArrowRight,
  Eye,
  Heart,
  Users,
  MessageCircle
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface ComparePeriodModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ComparePeriodModal: React.FC<ComparePeriodModalProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const [period1, setPeriod1] = useState('30d');
  const [period2, setPeriod2] = useState('30d_prev');
  const [customDate1Start, setCustomDate1Start] = useState('');
  const [customDate1End, setCustomDate1End] = useState('');
  const [customDate2Start, setCustomDate2Start] = useState('');
  const [customDate2End, setCustomDate2End] = useState('');

  const periodOptions = [
    { value: '7d', label: 'Últimos 7 dias' },
    { value: '30d', label: 'Últimos 30 dias' },
    { value: '3m', label: 'Últimos 3 meses' },
    { value: '6m', label: 'Últimos 6 meses' },
    { value: '30d_prev', label: '30 dias anteriores' },
    { value: '3m_prev', label: '3 meses anteriores' },
    { value: 'custom', label: 'Período personalizado' }
  ];

  // Dados simulados para comparação
  const comparisonData = [
    {
      metric: 'Impressões',
      period1Value: '847.3K',
      period2Value: '715.8K',
      change: '+18.4%',
      trend: 'up',
      icon: Eye,
      color: 'text-blue-500'
    },
    {
      metric: 'Engajamentos',
      period1Value: '65.4K',
      period2Value: '58.1K',
      change: '+12.6%',
      trend: 'up',
      icon: Heart,
      color: 'text-red-500'
    },
    {
      metric: 'Taxa de Engajamento',
      period1Value: '7.7%',
      period2Value: '8.1%',
      change: '-0.4%',
      trend: 'down',
      icon: TrendingUp,
      color: 'text-emerald-500'
    },
    {
      metric: 'Novos Seguidores',
      period1Value: '2.1K',
      period2Value: '2.8K',
      change: '-25.0%',
      trend: 'down',
      icon: Users,
      color: 'text-purple-500'
    }
  ];

  const chartData = [
    { name: 'Sem 1', periodo1: 45000, periodo2: 38000 },
    { name: 'Sem 2', periodo1: 52000, periodo2: 44000 },
    { name: 'Sem 3', periodo1: 48000, periodo2: 51000 },
    { name: 'Sem 4', periodo1: 61000, periodo2: 47000 },
  ];

  const getPeriodLabel = (value: string) => {
    return periodOptions.find(p => p.value === value)?.label || value;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Comparar Períodos
          </DialogTitle>
          <DialogDescription>
            Compare o desempenho entre dois períodos diferentes
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Period Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Período 1
              </Label>
              <Select value={period1} onValueChange={setPeriod1}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {periodOptions.filter(p => !p.value.includes('prev')).map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {period1 === 'custom' && (
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">Data Inicial</Label>
                    <Input 
                      type="date" 
                      value={customDate1Start}
                      onChange={(e) => setCustomDate1Start(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Data Final</Label>
                    <Input 
                      type="date" 
                      value={customDate1End}
                      onChange={(e) => setCustomDate1End(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Período 2
              </Label>
              <Select value={period2} onValueChange={setPeriod2}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {periodOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {period2 === 'custom' && (
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">Data Inicial</Label>
                    <Input 
                      type="date" 
                      value={customDate2Start}
                      onChange={(e) => setCustomDate2Start(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Data Final</Label>
                    <Input 
                      type="date" 
                      value={customDate2End}
                      onChange={(e) => setCustomDate2End(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Period Labels */}
          <div className="flex items-center justify-center gap-4 py-4 bg-muted/20 rounded-lg">
            <Badge variant="outline" className="text-primary border-primary">
              {getPeriodLabel(period1)}
            </Badge>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <Badge variant="outline" className="text-secondary border-secondary">
              {getPeriodLabel(period2)}
            </Badge>
          </div>

          {/* Metrics Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {comparisonData.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-0 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <metric.icon className={`w-4 h-4 ${metric.color}`} />
                        <span className="text-sm font-medium">{metric.metric}</span>
                      </div>
                      <Badge 
                        variant={metric.trend === 'up' ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {metric.change}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Período 1</span>
                        <span className="font-bold text-primary">{metric.period1Value}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Período 2</span>
                        <span className="font-bold text-secondary">{metric.period2Value}</span>
                      </div>
                    </div>

                    <div className={`flex items-center justify-center gap-1 mt-3 text-xs ${
                      metric.trend === 'up' ? 'text-emerald-500' : 'text-red-500'
                    }`}>
                      {metric.trend === 'up' ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      <span>
                        {metric.trend === 'up' ? 'Crescimento' : 'Declínio'} de {Math.abs(parseFloat(metric.change))}%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Chart Comparison */}
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Evolução Comparativa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
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
                    <Line 
                      type="monotone" 
                      dataKey="periodo1" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      name="Período 1"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="periodo2" 
                      stroke="hsl(var(--secondary))" 
                      strokeWidth={3}
                      strokeDasharray="5 5"
                      name="Período 2"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Fechar
            </Button>
            <Button
              className="flex-1 bg-gradient-primary"
              onClick={() => {
                // Implementar funcionalidade de salvar comparação
                const savedComparisonData = {
                  basePeriod: {
                    value: period1,
                    label: getPeriodLabel(period1),
                    customStart: customDate1Start,
                    customEnd: customDate1End
                  },
                  comparePeriod: {
                    value: period2,
                    label: getPeriodLabel(period2),
                    customStart: customDate2Start,
                    customEnd: customDate2End
                  },
                  metrics: comparisonData,
                  savedAt: new Date(),
                  id: Math.random().toString(36).substr(2, 9)
                };
                
                // Salvar no localStorage (em produção seria API)
                const savedComparisons = JSON.parse(localStorage.getItem('savedComparisons') || '[]');
                savedComparisons.push(savedComparisonData);
                localStorage.setItem('savedComparisons', JSON.stringify(savedComparisons));
                
                // Feedback ao usuário via toast nativo do sistema
                const event = new CustomEvent('showToast', {
                  detail: {
                    title: "Comparação salva",
                    description: "Comparação de períodos salva com sucesso. Você pode acessá-la no relatório de analytics.",
                  }
                });
                window.dispatchEvent(event);
                
                onOpenChange(false);
              }}
            >
              Salvar Comparação
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComparePeriodModal;