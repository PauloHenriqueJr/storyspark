export interface Tone {
  value: string;
  label: string;
  description: string;
  example: string;
  personality: string;
}
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Sparkles } from "lucide-react";

interface ToneSelectorProps {
  tones: Tone[];
  selectedTone: Tone | null;
  onToneSelect: (tone: Tone) => void;
}

export const ToneSelector = ({ tones, selectedTone, onToneSelect }: ToneSelectorProps) => {
  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-4">
        Escolha o tom que melhor representa sua marca:
      </div>
      <div className="grid gap-4">
        {tones.map((tone) => (
          <button
            key={tone.value}
            onClick={() => onToneSelect(tone)}
            className={`w-full p-4 text-left rounded-lg border-2 transition-all hover:shadow-md group ${selectedTone?.value === tone.value
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
              }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className={`font-semibold transition-colors ${selectedTone?.value === tone.value
                    ? 'text-primary'
                    : 'text-foreground group-hover:text-primary'
                    }`}>
                    {tone.label}
                  </h3>
                  {selectedTone?.value === tone.value && (
                    <Badge className="bg-success text-success-foreground">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Selecionado
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{tone.description}</p>
                <div className="bg-primary/5 rounded-md p-3 border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-3 w-3 text-primary" />
                    <span className="text-xs font-medium text-primary">Exemplo:</span>
                  </div>
                  <div className="text-sm italic text-foreground leading-relaxed">{tone.example}</div>
                </div>
              </div>
              <div className={`${selectedTone?.value === tone.value ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`}>
                {selectedTone?.value === tone.value ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-current" />
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

