import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { FileText, Wand2, Instagram, Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';

interface CreateTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTemplate: (template: any) => void;
  editingTemplate?: any;
}

const platforms = [
  { name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
  { name: 'Facebook', icon: Facebook, color: 'text-blue-600' },
  { name: 'Twitter', icon: Twitter, color: 'text-blue-400' },
  { name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
  { name: 'YouTube', icon: Youtube, color: 'text-red-500' },
];

const categories = [
  'Vendas', 'Engajamento', 'Profissional', 'Viral', 'Educativo', 'Promocional', 'Storytelling', 'Tutorial'
];

const CreateTemplateModal: React.FC<CreateTemplateModalProps> = ({
  open,
  onOpenChange,
  onCreateTemplate,
  editingTemplate
}) => {
  const [formData, setFormData] = useState({
    title: editingTemplate?.title || '',
    description: editingTemplate?.description || '',
    category: editingTemplate?.category || '',
    platform: editingTemplate?.platform || '',
    content: editingTemplate?.preview || '',
    tags: editingTemplate?.tags || []
  });
  const [newTag, setNewTag] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category || !formData.platform || !formData.content) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const template = {
      id: editingTemplate?.id || Date.now(),
      title: formData.title,
      description: formData.description,
      category: formData.category,
      platform: formData.platform,
      preview: formData.content,
      tags: formData.tags,
      likes: editingTemplate?.likes || 0,
      uses: editingTemplate?.uses || 0,
      createdAt: editingTemplate?.createdAt || new Date(),
      updatedAt: new Date()
    };

    onCreateTemplate(template);
    
    toast({
      title: editingTemplate ? "Template atualizado!" : "Template criado!",
      description: editingTemplate ? "Template salvo com sucesso." : "Novo template adicionado à biblioteca.",
    });

    // Reset form
    setFormData({
      title: '',
      description: '',
      category: '',
      platform: '',
      content: '',
      tags: []
    });
    setNewTag('');
    onOpenChange(false);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const getPlatformIcon = (platformName: string) => {
    const platform = platforms.find(p => p.name === platformName);
    if (!platform) return FileText;
    return platform.icon;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            {editingTemplate ? 'Editar Template' : 'Criar Novo Template'}
          </DialogTitle>
          <DialogDescription>
            {editingTemplate 
              ? 'Edite as informações do template existente.'
              : 'Crie um novo template para reutilizar em suas campanhas.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ex: Post promocional"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform">Plataforma *</Label>
              <Select value={formData.platform} onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha a plataforma" />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map((platform) => {
                    const Icon = platform.icon;
                    return (
                      <SelectItem key={platform.name} value={platform.name}>
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${platform.color}`} />
                          {platform.name}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Adicionar tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" variant="outline" onClick={addTag}>
                  Adicionar
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Breve descrição do template"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Conteúdo do Template *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Cole aqui o conteúdo do template. Use [variáveis] para campos editáveis."
              className="min-h-[200px] resize-none font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Dica: Use [Nome do Produto], [Benefício], [CTA] para criar campos editáveis
            </p>
          </div>

          {/* Preview */}
          {formData.content && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="p-4 bg-muted/30 rounded-lg border">
                <div className="flex items-center gap-2 mb-3">
                  {formData.platform && (
                    <>
                      {React.createElement(getPlatformIcon(formData.platform), { 
                        className: `w-4 h-4 ${platforms.find(p => p.name === formData.platform)?.color}` 
                      })}
                      <Badge variant="outline">{formData.platform}</Badge>
                    </>
                  )}
                </div>
                <p className="text-sm whitespace-pre-line">{formData.content}</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-primary">
              <Wand2 className="w-4 h-4 mr-2" />
              {editingTemplate ? 'Salvar Alterações' : 'Criar Template'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTemplateModal;