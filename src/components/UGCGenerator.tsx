import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface UGCTemplateData {
  id: string;
  name: string;
  platform?: string;
}

interface UGCGeneratorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialCopy?: string;
  template?: UGCTemplateData | null;
}

export const UGCGenerator = ({ open, onOpenChange, initialCopy = "", template }: UGCGeneratorProps) => {
  const [copy, setCopy] = useState(initialCopy);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setCopy(initialCopy);
    }
  }, [open, initialCopy]);

  const handleGenerate = () => {
    // Placeholder for actual video generation logic
    toast({ title: "Gerador de UGC", description: "Geração de vídeo iniciada!" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Gerar Vídeo UGC</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            value={copy}
            onChange={(e) => setCopy(e.target.value)}
            placeholder="Cole ou escreva sua copy aqui"
            className="min-h-[200px]"
          />
          {template && (
            <div className="text-sm text-muted-foreground">
              Template: <span className="font-medium">{template.name}</span>
              {template.platform && ` • ${template.platform}`}
            </div>
          )}
          <Button onClick={handleGenerate} disabled={!copy.trim()} className="w-full">
            Gerar Vídeo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

