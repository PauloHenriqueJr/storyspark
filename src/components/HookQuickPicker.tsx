import { useMemo } from 'react';
import { hooks, Hook, categories, getHooksByCategory } from '@/data/hooks';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

interface HookQuickPickerProps {
  selectedHook: Hook | null;
  onSelect: (hook: Hook | null) => void;
}

export const HookQuickPicker = ({ selectedHook, onSelect }: HookQuickPickerProps) => {
  const topHooks = useMemo(() => hooks.slice(0, 9), []);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          Hooks (opcional)
        </div>
        {selectedHook && (
          <Button variant="outline" size="sm" onClick={() => onSelect(null)}>Remover</Button>
        )}
      </div>
      {selectedHook ? (
        <div className="p-3 rounded border bg-primary/5 border-primary/20 text-sm">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary">{selectedHook.category}</Badge>
            <span className="font-medium">Hook selecionado</span>
          </div>
          <div className="text-muted-foreground">“{selectedHook.text}”</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {topHooks.map((h) => (
            <button key={h.id} onClick={() => onSelect(h)} className="text-left p-3 rounded border hover:border-primary/50 hover:bg-primary/5 transition">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs">{h.category}</Badge>
              </div>
              <div className="text-xs text-muted-foreground line-clamp-2">{h.text}</div>
            </button>
          ))}
        </div>
      )}
      <div className="text-xs text-muted-foreground">Dica: Você pode abrir a biblioteca completa em “Hooks” no menu.</div>
    </div>
  );
};

