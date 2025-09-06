import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Target } from "lucide-react";
import { Persona, defaultPersonas } from "@/types/persona";

interface PersonaSelectorProps {
  selectedPersona?: string;
  onPersonaChange: (personaId: string) => void;
}

export const PersonaSelector = ({ selectedPersona, onPersonaChange }: PersonaSelectorProps) => {
  const [allPersonas, setAllPersonas] = useState<Persona[]>(defaultPersonas);
  
  useEffect(() => {
    const savedPersonas = localStorage.getItem('storyspark-personas');
    if (savedPersonas) {
      const parsed = JSON.parse(savedPersonas);
      setAllPersonas([...defaultPersonas, ...parsed]);
    }
  }, []);

  const selectedPersonaData = allPersonas.find(p => p.id === selectedPersona);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <User className="h-4 w-4" />
        <label className="text-sm font-medium">Persona</label>
      </div>
      
      <Select value={selectedPersona} onValueChange={onPersonaChange}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione uma persona" />
        </SelectTrigger>
        <SelectContent>
          {allPersonas.map((persona) => (
            <SelectItem key={persona.id} value={persona.id}>
              <div className="flex flex-col">
                <span className="font-medium">{persona.name}</span>
                <span className="text-xs text-muted-foreground">{persona.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedPersonaData && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="h-4 w-4" />
              {selectedPersonaData.name}
            </CardTitle>
            <CardDescription className="text-xs">
              {selectedPersonaData.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-1">
              {selectedPersonaData.characteristics.map((char, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {char}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

