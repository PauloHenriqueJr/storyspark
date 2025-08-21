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
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Download, 
  FileText, 
  Image, 
  BarChart3,
  FileSpreadsheet,
  Calendar,
  Filter,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExportReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ExportReportModal: React.FC<ExportReportModalProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const [format, setFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [dateRange, setDateRange] = useState('30d');
  const [customDateStart, setCustomDateStart] = useState('');
  const [customDateEnd, setCustomDateEnd] = useState('');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeMetrics, setIncludeMetrics] = useState(true);
  const [includeTopContent, setIncludeTopContent] = useState(true);
  const [includePlatformData, setIncludePlatformData] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const formatOptions = [
    { 
      value: 'pdf', 
      label: 'PDF Report',
      icon: FileText,
      description: 'Relatório completo com gráficos e análises'
    },
    { 
      value: 'excel', 
      label: 'Excel Spreadsheet',
      icon: FileSpreadsheet,
      description: 'Planilha com dados brutos para análise'
    },
    { 
      value: 'csv', 
      label: 'CSV Data',
      icon: BarChart3,
      description: 'Dados em formato CSV para importação'
    }
  ];

  const dateRangeOptions = [
    { value: '7d', label: 'Últimos 7 dias' },
    { value: '30d', label: 'Últimos 30 dias' },
    { value: '3m', label: 'Últimos 3 meses' },
    { value: '6m', label: 'Últimos 6 meses' },
    { value: '1y', label: 'Último ano' },
    { value: 'custom', label: 'Período personalizado' }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    
    // Simular processo de exportação
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const fileName = `analytics-report-${format}-${Date.now()}`;
    
    toast({
      title: "Relatório exportado",
      description: `${fileName} foi baixado com sucesso.`,
    });
    
    setIsExporting(false);
    onOpenChange(false);
  };

  const selectedFormat = formatOptions.find(f => f.value === format);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-primary" />
            Exportar Relatório
          </DialogTitle>
          <DialogDescription>
            Escolha o formato e configurações para seu relatório de analytics
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Format Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Formato do Arquivo</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {formatOptions.map((option) => (
                <motion.div
                  key={option.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all border-2 ${
                      format === option.value 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border/40 hover:border-primary/50'
                    }`}
                    onClick={() => setFormat(option.value as typeof format)}
                  >
                    <CardContent className="p-4 text-center">
                      <option.icon className={`w-8 h-8 mx-auto mb-2 ${
                        format === option.value ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                      <h3 className="font-medium text-sm">{option.label}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {option.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Período
            </Label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dateRangeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {dateRange === 'custom' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Data Inicial</Label>
                  <Input 
                    type="date" 
                    value={customDateStart}
                    onChange={(e) => setCustomDateStart(e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Data Final</Label>
                  <Input 
                    type="date" 
                    value={customDateEnd}
                    onChange={(e) => setCustomDateEnd(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Content Options */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Conteúdo do Relatório
            </Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="metrics" 
                  checked={includeMetrics}
                  onCheckedChange={(checked) => setIncludeMetrics(checked === true)}
                />
                <Label htmlFor="metrics" className="text-sm">
                  Métricas principais (impressões, engajamento, alcance)
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="charts" 
                  checked={includeCharts}
                  onCheckedChange={(checked) => setIncludeCharts(checked === true)}
                />
                <Label htmlFor="charts" className="text-sm">
                  Gráficos e visualizações
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="top-content" 
                  checked={includeTopContent}
                  onCheckedChange={(checked) => setIncludeTopContent(checked === true)}
                />
                <Label htmlFor="top-content" className="text-sm">
                  Top conteúdos com melhor performance
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="platform-data" 
                  checked={includePlatformData}
                  onCheckedChange={(checked) => setIncludePlatformData(checked === true)}
                />
                <Label htmlFor="platform-data" className="text-sm">
                  Dados por plataforma
                </Label>
              </div>
            </div>
          </div>

          {/* Preview */}
          {selectedFormat && (
            <div className="p-4 rounded-lg bg-muted/20 border border-border/40">
              <div className="flex items-center gap-3 mb-2">
                <selectedFormat.icon className="w-5 h-5 text-primary" />
                <h4 className="font-medium">Preview do Relatório</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                {selectedFormat.description}
              </p>
              <div className="mt-2 text-xs text-muted-foreground">
                Arquivo: analytics-report-{format}-{new Date().toLocaleDateString('pt-BR')}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isExporting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="flex-1 bg-gradient-primary"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Exportando...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Relatório
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportReportModal;