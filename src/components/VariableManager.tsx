import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, X } from "lucide-react";

interface Variable {
  name: string;
  value: string;
  description?: string;
}

interface VariableManagerProps {
  variables: Variable[];
  onVariablesChange: (variables: Variable[]) => void;
  prompt: string;
}

export const VariableManager = ({ variables, onVariablesChange, prompt }: VariableManagerProps) => {
  const [isAddingVariable, setIsAddingVariable] = useState(false);
  const [newVariableName, setNewVariableName] = useState("");
  const [newVariableDescription, setNewVariableDescription] = useState("");

  const findVariablesInPrompt = (promptText: string): string[] => {
    const matches = promptText.match(/\{(\w+)\}/g);
    return matches ? matches.map(match => match.slice(1, -1)) : [];
  };

  const usedVariables = findVariablesInPrompt(prompt);
  const requiredVariables = variables.filter(v => usedVariables.includes(v.name));
  const optionalVariables = variables.filter(v => !usedVariables.includes(v.name));

  const updateVariable = (index: number, field: keyof Variable, value: string) => {
    const updated = [...variables];
    updated[index] = { ...updated[index], [field]: value };
    onVariablesChange(updated);
  };

  const addVariable = () => {
    if (!newVariableName.trim()) return;
    const newVariable: Variable = {
      name: newVariableName.toLowerCase().replace(/[^a-z0-9]/g, ''),
      value: "",
      description: newVariableDescription.trim() || undefined
    };
    if (variables.some(v => v.name === newVariable.name)) return;
    onVariablesChange([...variables, newVariable]);
    setNewVariableName("");
    setNewVariableDescription("");
    setIsAddingVariable(false);
  };

  const removeVariable = (index: number) => {
    const updated = variables.filter((_, i) => i !== index);
    onVariablesChange(updated);
  };

  const getVariableType = (varName: string) => {
    const typeMap: Record<string, { type: 'text' | 'textarea' | 'select', options?: string[] }> = {
      tom: { type: 'select', options: ['casual', 'profissional', 'persuasivo', 'amigável', 'técnico', 'criativo'] },
      canal: { type: 'select', options: ['Instagram', 'Facebook', 'Twitter', 'LinkedIn', 'TikTok', 'YouTube', 'Blog', 'Email'] },
      formato: { type: 'select', options: ['post', 'story', 'carrossel', 'vídeo', 'anúncio', 'email', 'artigo'] },
      publico: { type: 'textarea' },
      objetivo: { type: 'textarea' },
      beneficio: { type: 'textarea' },
      produto: { type: 'text' },
      marca: { type: 'text' },
      preco: { type: 'text' }
    };
    return typeMap[varName] || { type: 'text' };
  };

  const renderVariableInput = (variable: Variable, index: number) => {
    const varType = getVariableType(variable.name);
    switch (varType.type) {
      case 'textarea':
        return (
          <Textarea
            value={variable.value}
            onChange={(e) => updateVariable(index, 'value', e.target.value)}
            placeholder={`Digite ${variable.description || variable.name}...`}
            className="min-h-[80px] resize-none"
          />
        );
      case 'select':
        return (
          <Select value={variable.value} onValueChange={(value) => updateVariable(index, 'value', value)}>
            <SelectTrigger>
              <SelectValue placeholder={`Selecione ${variable.name}...`} />
            </SelectTrigger>
            <SelectContent>
              {varType.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return (
          <Input
            value={variable.value}
            onChange={(e) => updateVariable(index, 'value', e.target.value)}
            placeholder={`Digite ${variable.description || variable.name}...`}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      {requiredVariables.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h4 className="font-medium">Variáveis Obrigatórias</h4>
            <Badge variant="destructive" className="text-xs">
              {requiredVariables.filter(v => !v.value.trim()).length} pendentes
            </Badge>
          </div>
          <div className="space-y-4">
            {requiredVariables.map((variable) => {
              const globalIndex = variables.findIndex(v => v.name === variable.name);
              return (
                <Card key={variable.name} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs">{'{'}{variable.name}{'}'}</Badge>
                        {!variable.value.trim() && (
                          <Badge variant="destructive" className="text-xs">Obrigatório</Badge>
                        )}
                      </div>
                    </div>
                    {variable.description && (
                      <p className="text-sm text-muted-foreground">{variable.description}</p>
                    )}
                    {renderVariableInput(variable, globalIndex)}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {requiredVariables.length > 0 && optionalVariables.length > 0 && <Separator />}

      {optionalVariables.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h4 className="font-medium">Variáveis Não Utilizadas</h4>
            <Badge variant="secondary" className="text-xs">{optionalVariables.length}</Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {optionalVariables.map((variable) => {
              const globalIndex = variables.findIndex(v => v.name === variable.name);
              return (
                <Card key={variable.name} className="p-3 opacity-60 hover:opacity-100 transition-opacity">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="font-mono text-xs">{'{'}{variable.name}{'}'}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVariable(globalIndex)}
                        className="h-6 w-6 p-0 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    {variable.description && (
                      <p className="text-xs text-muted-foreground">{variable.description}</p>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      <div className="pt-4 border-t">
        <Dialog open={isAddingVariable} onOpenChange={setIsAddingVariable}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Nova Variável
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Variável</DialogTitle>
              <DialogDescription>
                Crie uma nova variável personalizada para usar em seus prompts.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Nome da Variável</label>
                <Input
                  value={newVariableName}
                  onChange={(e) => setNewVariableName(e.target.value)}
                  placeholder="Ex: empresa, objetivo, data..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use apenas letras e números. Será convertido para {'{'}
                  {newVariableName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'variavel'}
                  {'}'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Descrição (opcional)</label>
                <Input
                  value={newVariableDescription}
                  onChange={(e) => setNewVariableDescription(e.target.value)}
                  placeholder="Descreva o que esta variável representa..."
                />
              </div>
              <div className="flex gap-3">
                <Button onClick={addVariable} className="flex-1">Adicionar</Button>
                <Button variant="outline" onClick={() => setIsAddingVariable(false)}>Cancelar</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

