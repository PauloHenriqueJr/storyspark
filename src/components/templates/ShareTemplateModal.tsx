import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Share2, 
  Copy, 
  Mail, 
  MessageSquare, 
  ExternalLink,
  QrCode,
  Download,
  Eye,
  Heart,
  FileText
} from 'lucide-react';

interface ShareTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: any;
}

const ShareTemplateModal: React.FC<ShareTemplateModalProps> = ({
  open,
  onOpenChange,
  template
}) => {
  const [shareUrl] = useState(`https://storyspark.app/templates/${template?.id || 'preview'}`);
  const [customMessage, setCustomMessage] = useState('');
  const [shareMethod, setShareMethod] = useState<'link' | 'embed' | 'export'>('link');
  const { toast } = useToast();

  const copyToClipboard = async (text: string, message: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copiado!",
        description: message,
      });
    } catch (err) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar para a área de transferência.",
        variant: "destructive"
      });
    }
  };

  const getEmbedCode = () => {
    return `<div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; max-width: 400px; font-family: system-ui;">
  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
    <div style="width: 24px; height: 24px; background: linear-gradient(135deg, #ff6b35, #f7931e); border-radius: 4px;"></div>
    <strong style="color: #374151;">${template?.name || 'Template'}</strong>
  </div>
  <p style="color: #6b7280; font-size: 14px; margin-bottom: 12px;">${template?.description || 'Descrição não disponível'}</p>
  <div style="background: #f9fafb; padding: 12px; border-radius: 4px; margin-bottom: 12px;">
    <p style="font-size: 12px; line-height: 1.4; color: #374151; white-space: pre-line;">${template?.content?.substring(0, 100) || 'Conteúdo não disponível'}...</p>
  </div>
  <div style="display: flex; justify-content: space-between; align-items: center;">
    <div style="display: flex; gap: 8px;">
      <span style="background: #f3f4f6; padding: 2px 8px; border-radius: 12px; font-size: 12px; color: #6b7280;">${template?.metadata?.platform || template?.type || 'Geral'}</span>
      <span style="background: #f3f4f6; padding: 2px 8px; border-radius: 12px; font-size: 12px; color: #6b7280;">${template?.category || 'Categoria'}</span>
    </div>
    <a href="${shareUrl}" style="color: #3b82f6; text-decoration: none; font-size: 12px;">Ver template →</a>
  </div>
</div>`;
  };

  const shareToSocial = (platform: string) => {
    const text = customMessage || `Confira este template incrível: "${template?.name}" - ${template?.description}`;
    const url = shareUrl;
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
    };
    
    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
  };

  const exportTemplate = () => {
    const templateData = {
      name: template?.name,
      description: template?.description,
      category: template?.category,
      type: template?.type,
      platform: template?.metadata?.platform,
      content: template?.content,
      tags: template?.tags || [],
      variables: template?.variables || [],
      is_public: template?.is_public,
      usage_count: template?.usage_count,
      exportedAt: new Date().toISOString(),
      exportedFrom: 'StorySpark'
    };

    const blob = new Blob([JSON.stringify(templateData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template?.name?.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_template.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Template exportado!",
      description: "Template salvo como arquivo JSON.",
    });
  };

  if (!template) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-primary" />
            Compartilhar Template
          </DialogTitle>
          <DialogDescription>
            Compartilhe este template com sua equipe ou comunidade
          </DialogDescription>
        </DialogHeader>

        {/* Template Preview */}
        <Card className="border-0 bg-muted/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3 mb-3">
              <FileText className="w-5 h-5 text-primary mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold">{template.name}</h3>
                <p className="text-sm text-muted-foreground">{template.description}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline">{template.metadata?.platform || template.type}</Badge>
                  <Badge variant="secondary">{template.category}</Badge>
                </div>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  0
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Eye className="w-3 h-3" />
                  {template.usage_count || 0}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Share Methods */}
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={shareMethod === 'link' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShareMethod('link')}
              className="flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Link
            </Button>
            <Button
              variant={shareMethod === 'embed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShareMethod('embed')}
              className="flex items-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              Embed
            </Button>
            <Button
              variant={shareMethod === 'export' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShareMethod('export')}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>

          {shareMethod === 'link' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>URL do Template</Label>
                <div className="flex gap-2">
                  <Input value={shareUrl} readOnly />
                  <Button 
                    variant="outline" 
                    onClick={() => copyToClipboard(shareUrl, "Link copiado para a área de transferência")}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Mensagem personalizada (opcional)</Label>
                <Textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Adicione uma mensagem personalizada..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold">Compartilhar em redes sociais:</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => shareToSocial('whatsapp')}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 font-medium"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => shareToSocial('telegram')}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 font-medium"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Telegram
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => shareToSocial('twitter')}
                    className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 font-medium"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Twitter
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => shareToSocial('linkedin')}
                    className="bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 font-medium"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    LinkedIn
                  </Button>
                </div>
              </div>
            </div>
          )}

          {shareMethod === 'embed' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Código de Incorporação</Label>
                <Textarea
                  value={getEmbedCode()}
                  readOnly
                  className="min-h-[200px] font-mono text-xs"
                />
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => copyToClipboard(getEmbedCode(), "Código de incorporação copiado")}
                    className="flex-1"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar Código
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="border rounded-lg p-4 bg-muted/20">
                  <div dangerouslySetInnerHTML={{ __html: getEmbedCode() }} />
                </div>
              </div>
            </div>
          )}

          {shareMethod === 'export' && (
            <div className="space-y-4">
              <div className="text-center py-8">
                <Download className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Exportar Template</h3>
                <p className="text-muted-foreground mb-4">
                  Baixe o template como arquivo JSON para usar em outras ferramentas
                </p>
                <Button
                  onClick={exportTemplate}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-semibold px-6"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar Template
                </Button>
              </div>
              
              <div className="bg-muted/20 p-4 rounded-lg">
                <h4 className="font-medium mb-2">O que será exportado:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Título e descrição</li>
                  <li>• Categoria e plataforma</li>
                  <li>• Conteúdo completo</li>
                  <li>• Tags associadas</li>
                  <li>• Metadados de exportação</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareTemplateModal;