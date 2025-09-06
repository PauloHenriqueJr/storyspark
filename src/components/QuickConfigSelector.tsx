import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QUICK_CONFIG_OPTIONS, type QuickConfigOption } from "@/lib/brazilianTemplates";
import { Package, Users, Target, Megaphone, CheckCircle2, ArrowRight } from "lucide-react";

interface QuickConfig {
  produto: string;
  publico: string;
  objetivo: string;
  canal: string;
}

interface QuickConfigSelectorProps {
  config: QuickConfig;
  onConfigChange: (config: Partial<QuickConfig>) => void;
  onComplete: () => void;
}

const SECTIONS = [
  { key: 'produto' as const, title: 'Produto/Nicho', description: 'O que você está oferecendo?', icon: Package },
  { key: 'publico' as const, title: 'Público-alvo', description: 'Para quem você está falando?', icon: Users },
  { key: 'objetivo' as const, title: 'Objetivo', description: 'O que você quer alcançar?', icon: Target },
  { key: 'canal' as const, title: 'Canal', description: 'Onde vai ser publicado?', icon: Megaphone },
];

export const QuickConfigSelector = ({ config, onConfigChange, onComplete }: QuickConfigSelectorProps) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('produto');

  const handleOptionSelect = useCallback((category: keyof typeof config, option: QuickConfigOption) => {
    onConfigChange({ [category]: option.label });
    const currentIndex = SECTIONS.findIndex(s => s.key === category);
    const nextSection = SECTIONS[currentIndex + 1];
    if (nextSection) setExpandedSection(nextSection.key);
  }, [onConfigChange]);

  const isComplete = Object.values(config).every(value => value.trim());
  const completedCount = Object.values(config).filter(value => value.trim()).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Configuração rápida: {completedCount}/4 completo</div>
        <div className="flex gap-1">
          {SECTIONS.map((section) => (
            <div key={section.key} className={`w-2 h-2 rounded-full ${config[section.key] ? 'bg-primary' : 'bg-muted'}`} />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {SECTIONS.map((section) => {
          const IconComponent = section.icon;
          const isSelected = !!config[section.key];
          const isExpanded = expandedSection === section.key;
          return (
            <Card key={section.key} className={`transition-all ${isSelected ? 'border-primary/50 bg-primary/5' : ''}`}>
              <CardHeader className="pb-3 cursor-pointer" onClick={() => setExpandedSection(isExpanded ? null : section.key)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        {section.title}
                        {isSelected && <CheckCircle2 className="h-4 w-4 text-success" />}
                      </CardTitle>
                      <div className="text-sm text-muted-foreground">{isSelected ? config[section.key] : section.description}</div>
                    </div>
                  </div>
                  <div className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </CardHeader>
              {isExpanded && (
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {QUICK_CONFIG_OPTIONS[section.key]?.map((option) => (
                      <Button
                        key={option.id}
                        variant={config[section.key] === option.label ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleOptionSelect(section.key, option)}
                        className={`text-xs h-auto py-2 px-3 ${config[section.key] === option.label ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/10 hover:border-primary/50'}`}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                  {config[section.key] && (
                    <div className="mt-3 text-xs text-success flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Selecionado: {config[section.key]}</span>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {isComplete && (
        <div className="border-t pt-6">
          <Button onClick={onComplete} className="w-full bg-gradient-primary text-primary-foreground py-3">
            Concluir e Prosseguir
          </Button>
        </div>
      )}
    </div>
  );
};

