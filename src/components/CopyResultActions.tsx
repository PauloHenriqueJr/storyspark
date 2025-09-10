import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Copy, RefreshCw, Save, Share2, Calendar, Instagram, Facebook, Linkedin, Mail, MessageCircle, Download, Eye, Sparkles, Zap, Heart, TrendingUp, Video } from "lucide-react";

interface CopyResultActionsProps {
  generatedCopy: string;
  onRegenerate?: () => void;
  onSave?: () => void;
  onGenerateUGC?: () => void;
  canRegenerate?: boolean;
  isRegenerating?: boolean;
}

export const CopyResultActions = ({
  generatedCopy,
  onRegenerate,
  onSave,
  onGenerateUGC,
  canRegenerate = true,
  isRegenerating = false
}: CopyResultActionsProps) => {
  // Render copy with minimal Markdown support (**bold**) safely
  const renderContent = (content: string) => {
    const escapeHtml = (s: string) => s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    // Escape first to prevent injection
    let html = escapeHtml(content);
    // Bold: **text**
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // Line breaks
    html = html.replace(/\n/g, '<br/>');
    return (
      <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap text-sm leading-relaxed font-medium"
        dangerouslySetInnerHTML={{ __html: html }} />
    );
  };
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);
  const [showFull, setShowFull] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({ title: "Copy copiada!", description: "Texto copiado para área de transferência." });
    } catch (error) {
      toast({ title: "Erro ao copiar", description: "Não foi possível copiar o texto.", variant: "destructive" });
    }
  };

  const schedulePost = () => {
    toast({ title: "Agendamento", description: "Funcionalidade de agendamento em breve!" });
  };

  const shareTo = (network: 'Instagram' | 'Facebook' | 'LinkedIn') => {
    copyToClipboard();
    toast({ title: `Copy preparada para ${network}`, description: "Texto copiado! Abra a rede e cole na sua nova postagem." });
  };

  const createEmailCampaign = () => {
    toast({ title: "Campanha de Email", description: "Redirecionando para criador de campanhas..." });
  };

  const shareViaWhatsApp = () => {
    const encodedText = encodeURIComponent(generatedCopy);
    const whatsappUrl = `https://wa.me/?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
    toast({ title: "WhatsApp aberto", description: "Copy carregada no WhatsApp Web." });
  };

  const exportToPDF = () => {
    toast({ title: "Exportar PDF", description: "Funcionalidade de exportação em breve!" });
  };

  const saveToLibrary = () => {
    onSave?.();
    toast({ title: "Copy salva!", description: "Adicionada à sua biblioteca pessoal." });
  };

  const generateUGCVideo = () => {
    onGenerateUGC?.();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-success text-success-foreground flex items-center justify-center">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2 text-success">
                <Zap className="h-5 w-5" />
                Copy Gerada com Sucesso!
              </CardTitle>
              <div className="text-sm text-muted-foreground">Pronta para uso em qualquer plataforma</div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative">
          <div className="bg-background border border-success/20 rounded-lg p-4 max-h-64 overflow-hidden">
            {renderContent(generatedCopy)}
            {generatedCopy.length > 500 && (
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent pointer-events-none" />
            )}
          </div>
          <div className="flex gap-2 mt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowFull(true)}
              className="w-full text-xs"
            >
              <Eye className="h-3 w-3 mr-1" />
              Ver copy completa
            </Button>
          </div>
        </div>

        <Dialog open={showFull} onOpenChange={setShowFull}>
          <DialogContent className="max-w-4xl w-[95vw] max-h-[85vh] p-4 sm:p-6 overflow-hidden">
            <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6">
              <DialogTitle>Copy completa</DialogTitle>
            </DialogHeader>
            <div className="px-4 sm:px-6 pb-4 sm:pb-6 overflow-auto" style={{ maxHeight: '70vh' }}>
              <div className="bg-background border rounded-lg p-3 sm:p-4">
                {renderContent(generatedCopy)}
              </div>
              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <Button type="button" onClick={copyToClipboard} variant={isCopied ? "default" : "outline"} size="sm" className="flex-1">
                  {isCopied ? 'Copiado!' : 'Copiar'}
                </Button>
                <Button type="button" onClick={() => setShowFull(false)} variant="secondary" size="sm" className="flex-1 sm:flex-none">
                  Fechar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button type="button" onClick={copyToClipboard} variant={isCopied ? "default" : "outline"} size="lg" className="h-10 sm:h-12 text-sm sm:text-base">
            {isCopied ? (<><Heart className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-red-500" />Copiado!</>) : (<><Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />Copiar Copy</>)}
          </Button>
          <Button type="button" onClick={onRegenerate} variant="outline" size="lg" className="h-10 sm:h-12 text-sm sm:text-base" disabled={!canRegenerate || isRegenerating}>
            {isRegenerating ? (<><RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-spin" />Gerando...</>) : (<><RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />Regenerar</>)}
          </Button>
        </div>

        <Separator />

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Share2 className="h-4 w-4" />
            <span className="text-sm font-medium">Publicar Direto</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => shareTo('Instagram')} className="flex flex-col gap-1 h-auto py-2 sm:py-3">
              <Instagram className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs">Instagram</span>
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => shareTo('Facebook')} className="flex flex-col gap-1 h-auto py-2 sm:py-3">
              <Facebook className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs">Facebook</span>
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => shareTo('LinkedIn')} className="flex flex-col gap-1 h-auto py-2 sm:py-3">
              <Linkedin className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs">LinkedIn</span>
            </Button>
          </div>
        </div>

        <Separator />

        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium">Ações Avançadas</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button type="button" variant="outline" size="sm" onClick={schedulePost} className="justify-start h-10 sm:h-12">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              <span className="text-sm">Agendar Post</span>
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={createEmailCampaign} className="justify-start h-10 sm:h-12">
              <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              <span className="text-sm">Email Campaign</span>
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={shareViaWhatsApp} className="justify-start h-10 sm:h-12">
              <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              <span className="text-sm">WhatsApp</span>
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={saveToLibrary} className="justify-start h-10 sm:h-12">
              <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              <span className="text-sm">Salvar</span>
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={generateUGCVideo} className="justify-start h-10 sm:h-12">
              <Video className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              <span className="text-sm">Gerar UGC Vídeo</span>
            </Button>
          </div>
        </div>

        <div className="pt-2 border-t">
          <Button type="button" variant="ghost" size="sm" onClick={exportToPDF} className="w-full justify-start text-muted-foreground h-10 sm:h-12">
            <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
            <span className="text-sm">Exportar como PDF</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

