import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HelpCircle, Eye, Code } from "lucide-react";

interface Variable {
  name: string;
  value: string;
  description?: string;
}

interface PromptEditorProps {
  value: string;
  onChange: (value: string) => void;
  variables: Variable[];
}

export const PromptEditor = ({ value, onChange, variables }: PromptEditorProps) => {
  const [showPreview, setShowPreview] = useState(false);
  
  const findVariablesInPrompt = (prompt: string): string[] => {
    const matches = prompt.match(/\{(\w+)\}/g);
    return matches ? matches.map(match => match.slice(1, -1)) : [];
  };

  const processPromptPreview = (rawPrompt: string): string => {
    let processedPrompt = rawPrompt;
    variables.forEach(variable => {
      const regex = new RegExp(`\\{${variable.name}\\}`, 'g');
      const replacement = variable.value || `[${variable.name.toUpperCase()}]`;
      processedPrompt = processedPrompt.replace(regex, replacement);
    });
    return processedPrompt;
  };

  const insertVariable = (variableName: string) => {
    const variableTag = `{${variableName}}`;
    const textarea = document.querySelector('textarea[data-prompt-editor="true"]') as HTMLTextAreaElement;
    
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = value.substring(0, start) + variableTag + value.substring(end);
      onChange(newValue);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variableTag.length, start + variableTag.length);
      }, 0);
    } else {
      onChange(value + variableTag);
    }
  };

  const usedVariables = findVariablesInPrompt(value);
  const unusedVariables = variables.filter(v => !usedVariables.includes(v.name));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary">
            <Code className="mr-1 h-3 w-3" />
            Editor Avançado
          </Badge>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 px-2">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <div className="space-y-2">
                <h4 className="font-medium">Como usar:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Use <code className="bg-muted px-1">{"{variavel}"}</code> para campos dinâmicos</li>
                  <li>• Clique nas variáveis abaixo para inserir</li>
                  <li>• Use o preview para ver o resultado final</li>
                  <li>• Quebras de linha e formatação são preservadas</li>
                </ul>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowPreview(!showPreview)}
        >
          <Eye className="mr-2 h-4 w-4" />
          {showPreview ? 'Ocultar' : 'Preview'}
        </Button>
      </div>

      {!showPreview ? (
        <div className="relative">
          <Textarea
            data-prompt-editor="true"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Escreva seu prompt personalizado aqui..."
            className="min-h-[200px] font-mono text-sm resize-none"
          />
        </div>
      ) : (
        <div className="bg-muted/50 rounded-lg p-4 min-h-[200px] border">
          <div className="text-sm text-muted-foreground mb-2">Preview do prompt processado:</div>
          <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
            {processPromptPreview(value)}
          </pre>
        </div>
      )}

      <div>
        <div className="text-sm font-medium mb-2">Variáveis disponíveis:</div>
        <div className="flex flex-wrap gap-2">
          {variables.map((variable) => (
            <Button
              key={variable.name}
              variant="outline"
              size="sm"
              onClick={() => insertVariable(variable.name)}
              className={`h-7 ${
                usedVariables.includes(variable.name)
                  ? 'border-primary/50 bg-primary/5 text-primary'
                  : 'border-muted-foreground/30'
              }`}
            >
              {"{"}{variable.name}{"}"}
            </Button>
          ))}
        </div>
        {unusedVariables.length > 0 && (
          <div className="text-xs text-muted-foreground mt-2">
            Variáveis não utilizadas: {unusedVariables.map(v => v.name).join(', ')}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Caracteres: {value.length}</span>
        <span>Variáveis usadas: {usedVariables.length}/{variables.length}</span>
      </div>
    </div>
  );
};

