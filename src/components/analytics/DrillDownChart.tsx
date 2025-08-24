import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp } from 'lucide-react';

interface DrillDownChartProps {
  title: string;
  data: Array<{ name: string; impressions: number; engagements: number; reach: number }>;
  onBack?: () => void;
}

const monthlyData = [
  { name: 'Jan', impressions: 45000, engagements: 3200, reach: 38000 },
  { name: 'Fev', impressions: 52000, engagements: 4100, reach: 44000 },
  { name: 'Mar', impressions: 48000, engagements: 3800, reach: 41000 },
  { name: 'Abr', impressions: 61000, engagements: 4800, reach: 52000 },
  { name: 'Mai', impressions: 58000, engagements: 4600, reach: 49000 },
  { name: 'Jun', impressions: 67000, engagements: 5400, reach: 58000 },
];

const weeklyData = [
  { name: 'Sem 1', impressions: 15000, engagements: 1200, reach: 13000 },
  { name: 'Sem 2', impressions: 18000, engagements: 1400, reach: 15000 },
  { name: 'Sem 3', impressions: 16000, engagements: 1300, reach: 14000 },
  { name: 'Sem 4', impressions: 18000, engagements: 1500, reach: 16000 },
];

const dailyData = [
  { name: 'Seg', impressions: 2800, engagements: 220, reach: 2400 },
  { name: 'Ter', impressions: 3200, engagements: 280, reach: 2800 },
  { name: 'Qua', impressions: 2900, engagements: 240, reach: 2500 },
  { name: 'Qui', impressions: 3500, engagements: 320, reach: 3100 },
  { name: 'Sex', impressions: 4100, engagements: 380, reach: 3600 },
  { name: 'Sab', impressions: 1800, engagements: 140, reach: 1600 },
  { name: 'Dom', impressions: 1700, engagements: 120, reach: 1500 },
];

export const DrillDownChart = ({ title, data, onBack }: DrillDownChartProps) => {
  const [currentLevel, setCurrentLevel] = useState<'monthly' | 'weekly' | 'daily'>('monthly');
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<string | null>(null);

  const getCurrentData = () => {
    if (currentLevel === 'daily') return dailyData;
    if (currentLevel === 'weekly') return weeklyData;
    return monthlyData;
  };

  const handleBarClick = (data: { name: string; impressions: number; engagements: number; reach: number }) => {
    if (currentLevel === 'monthly') {
      setSelectedMonth(data.name);
      setCurrentLevel('weekly');
    } else if (currentLevel === 'weekly') {
      setSelectedWeek(data.name);
      setCurrentLevel('daily');
    }
  };

  const handleBack = () => {
    if (currentLevel === 'daily') {
      setCurrentLevel('weekly');
      setSelectedWeek(null);
    } else if (currentLevel === 'weekly') {
      setCurrentLevel('monthly');
      setSelectedMonth(null);
    } else if (onBack) {
      onBack();
    }
  };

  const getTitle = () => {
    if (currentLevel === 'daily' && selectedWeek) {
      return `Dados Diários - ${selectedWeek} (${selectedMonth})`;
    }
    if (currentLevel === 'weekly' && selectedMonth) {
      return `Dados Semanais - ${selectedMonth}`;
    }
    return 'Evolução Mensal do Engajamento';
  };

  return (
    <Card className="border-0 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          {(currentLevel !== 'monthly' || onBack) && (
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              {getTitle()}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {currentLevel === 'monthly' ? 'Clique nas barras para ver detalhes semanais' :
               currentLevel === 'weekly' ? 'Clique nas barras para ver detalhes diários' : 
               'Dados detalhados por dia'}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {currentLevel === 'daily' ? (
              <LineChart data={getCurrentData()}>
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
                  dataKey="impressions"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  name="Impressões"
                />
                <Line
                  type="monotone"
                  dataKey="engagements"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--secondary))', strokeWidth: 2, r: 4 }}
                  name="Engajamentos"
                />
              </LineChart>
            ) : (
              <BarChart data={getCurrentData()}>
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
                <Bar
                  dataKey="impressions"
                  fill="hsl(var(--primary))"
                  name="Impressões"
                  onClick={handleBarClick}
                  className="cursor-pointer hover:opacity-80"
                />
                <Bar
                  dataKey="engagements"
                  fill="hsl(var(--secondary))"
                  name="Engajamentos"
                  onClick={handleBarClick}
                  className="cursor-pointer hover:opacity-80"
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};