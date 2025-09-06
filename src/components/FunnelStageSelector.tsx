import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Target } from "lucide-react";
import { funnelStages } from "@/types/persona";

interface FunnelStageSelectorProps {
  selectedStage?: string;
  onStageChange: (stageId: string) => void;
}

export const FunnelStageSelector = ({ selectedStage, onStageChange }: FunnelStageSelectorProps) => {
  const selectedStageData = funnelStages.find(s => s.id === selectedStage);

  const getStageIcon = (stageId: string) => {
    switch (stageId) {
      case 'topo':
        return <TrendingUp className="h-3 w-3" />;
      case 'meio':
        return <Target className="h-3 w-3" />;
      case 'fundo':
        return <TrendingDown className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getStageColor = (stageId: string) => {
    switch (stageId) {
      case 'topo':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'meio':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'fundo':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Target className="h-4 w-4" />
        <label className="text-sm font-medium">Etapa do Funil</label>
      </div>
      
      <Select value={selectedStage} onValueChange={onStageChange}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione a etapa do funil" />
        </SelectTrigger>
        <SelectContent>
          {funnelStages.map((stage) => (
            <SelectItem key={stage.id} value={stage.id}>
              <div className="flex items-center gap-2">
                {getStageIcon(stage.id)}
                <div className="flex flex-col">
                  <span className="font-medium">{stage.name}</span>
                  <span className="text-xs text-muted-foreground">{stage.description}</span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedStageData && (
        <Badge 
          variant="outline" 
          className={`text-xs ${getStageColor(selectedStageData.id)}`}
        >
          {getStageIcon(selectedStageData.id)}
          <span className="ml-1">{selectedStageData.name}</span>
        </Badge>
      )}
    </div>
  );
};

