import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Thermometer, Hash, Sparkles, FileText, Info } from "lucide-react";

interface AIConfig {
  temperatura: number;
  maxTokens: number;
  criatividade: 'baixa' | 'media' | 'alta';
  formato: 'texto' | 'lista' | 'estruturado';
}

interface AIControlsProps {
  config: AIConfig;
  onConfigChange: (config: AIConfig) => void;
}

export const AIControls = ({ config, onConfigChange }: AIControlsProps) => {
  const updateConfig = (field: keyof AIConfig, value: any) => {
    onConfigChange({ ...config, [field]: value });
  };

  const getTemperaturaDescription = (temp: number) => {
    if (temp <= 0.3) return "Conservadora - Respostas consistentes e previsíveis";
    if (temp <= 0.7) return "Equilibrada - Mistura criatividade com consistência";
    return "Criativa - Respostas mais variadas e originais";
  };

  const getCriatividadeDescription = (criatividade: string) => {
    const descriptions = {
      baixa: "Foco em precisão e consistência",
      media: "Equilíbrio entre criatividade e precisão",
      alta: "Máxima criatividade e originalidade"
    };
    return descriptions[criatividade as keyof typeof descriptions];
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Thermometer className="h-4 w-4" />
          <span className="font-medium">Temperatura</span>
          <Badge variant="outline" className="text-xs">{config.temperatura}</Badge>
        </div>
        <Slider value={[config.temperatura]} onValueChange={(v) => updateConfig('temperatura', v[0])} max={1} min={0} step={0.1} />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>Conservadora</span>
          <span>Criativa</span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">{getTemperaturaDescription(config.temperatura)}</p>
      </div>

      <Separator />

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Hash className="h-4 w-4" />
          <span className="font-medium">Máximo de Tokens</span>
          <Badge variant="outline" className="text-xs">{config.maxTokens}</Badge>
        </div>
        <Slider value={[config.maxTokens]} onValueChange={(v) => updateConfig('maxTokens', v[0])} max={1000} min={100} step={50} />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>100 (Curto)</span>
          <span>1000 (Longo)</span>
        </div>
        <div className="text-xs text-muted-foreground mt-2">Aproximadamente {Math.round(config.maxTokens * 0.75)} palavras</div>
      </div>

      <Separator />

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4" />
          <span className="font-medium">Nível de Criatividade</span>
        </div>
        <Select value={config.criatividade} onValueChange={(v: 'baixa' | 'media' | 'alta') => updateConfig('criatividade', v)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="baixa">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div>Baixa</div>
            </SelectItem>
            <SelectItem value="media">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-500"></div>Média</div>
            </SelectItem>
            <SelectItem value="alta">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div>Alta</div>
            </SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-2">{getCriatividadeDescription(config.criatividade)}</p>
      </div>

      <Separator />

      <div>
        <div className="flex items-center gap-2 mb-3">
          <FileText className="h-4 w-4" />
          <span className="font-medium">Formato de Saída</span>
        </div>
        <Select value={config.formato} onValueChange={(v: 'texto' | 'lista' | 'estruturado') => updateConfig('formato', v)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="texto"><div><div className="font-medium">Texto Corrido</div><div className="text-xs text-muted-foreground">Parágrafo contínuo</div></div></SelectItem>
            <SelectItem value="lista"><div><div className="font-medium">Lista</div><div className="text-xs text-muted-foreground">Bullets ou itens numerados</div></div></SelectItem>
            <SelectItem value="estruturado"><div><div className="font-medium">Estruturado</div><div className="text-xs text-muted-foreground">Seções com títulos</div></div></SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="p-3 bg-muted/30">
        <div className="flex items-start gap-2">
          <Info className="h-4 w-4 mt-0.5 text-muted-foreground" />
          <div className="text-xs text-muted-foreground">
            <div className="font-medium mb-1">Configuração Atual:</div>
            <div>• Criatividade {config.criatividade} (temperatura {config.temperatura})</div>
            <div>• Até {config.maxTokens} tokens (~{Math.round(config.maxTokens * 0.75)} palavras)</div>
            <div>• Formato {config.formato}</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

