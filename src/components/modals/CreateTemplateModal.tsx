import React, { useState, useEffect } from 'react';
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
  onCreateTemplate?: (template: any) => void;
  onUpdateTemplate?: (id: string, updates: any) => void;
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
  onUpdateTemplate,
  editingTemplate
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    category: '',
    platform: '',
    content: '',
    tags: []
  });

  // Atualizar dados do formulário quando editingTemplate mudar
  useEffect(() => {
    if (editingTemplate) {
      setFormData({
        name: editingTemplate.name || '',
        description: editingTemplate.description || '',
        type: editingTemplate.type || '',
        category: editingTemplate.category || '',
        platform: editingTemplate.metadata?.platform || '',
        content: editingTemplate.content || '',
        tags: Array.isArray(editingTemplate.tags) ? editingTemplate.tags : []
      });
    } else {
      // Reset form para criar novo template
      setFormData({
        name: '',
        description: '',
        type: '',
        category: '',
        platform: '',
        content: '',
        tags: []
      });
    }
  }, [editingTemplate]);
  const [newTag, setNewTag] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.type || !formData.category || !formData.content) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha Nome, Descrição, Tipo, Categoria e Conteúdo.",
        variant: "destructive"
      });
      return;
    }

    // Monta payload compatível com a tabela public.templates
    const payload = {
      name: formData.name,
      description: formData.description,
      content: formData.content,
      type: formData.type,            // 'SOCIAL' | 'EMAIL' | 'AD' | 'BLOG' | 'LANDING'
      category: formData.category,    // texto livre
      tags: formData.tags,            // string[]
      metadata: {
        platform: formData.platform || null,
        language: 'pt-BR'
      }
    };

    // Se estiver editando e houver callback de update, atualiza; caso contrário cria
    if (editingTemplate?.id && onUpdateTemplate) {
      onUpdateTemplate(editingTemplate.id, payload);
      toast({
        title: "Template atualizado!",
        description: "Template salvo com sucesso."
      });
    } else if (onCreateTemplate) {
      onCreateTemplate(payload);
      toast({
        title: "Template criado!",
        description: "Novo template adicionado à biblioteca."
      });
    }

    // Reset form
    setFormData({
      name: '',
      description: '',
      type: '',
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
            {editingTemplate ? 'Editar Template' : 'Criar Template Reutilizável'}
          </DialogTitle>
          <DialogDescription>
            {editingTemplate
              ? 'Edite as informações do template existente.'
              : 'Crie um novo template para reutilizar em suas campanhas.'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              🚀
            </div>
            <div>
              <h4 className="font-medium text-green-800 mb-1">O que é um Template?</h4>
              <div className="text-sm text-green-700 mb-2">
                {editingTemplate
                  ? 'Edite seu template para melhorar a reutilização em campanhas futuras.'
                  : 'Um template é uma copy pronta que você pode reutilizar infinitas vezes. Crie uma vez e use sempre que precisar!'
                }
              </div>
              {!editingTemplate && (
                <div className="text-xs text-green-600 space-y-1">
                  <div>✅ <strong>Economize tempo:</strong> Não escreva a mesma copy do zero</div>
                  <div>✅ <strong>Padronize:</strong> Mantenha consistência na comunicação</div>
                  <div>✅ <strong>Personalize:</strong> Use variáveis para adaptar cada uso</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
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

          {/* Tipo do template (enum obrigatório) */}
          <div className="space-y-2">
            <Label htmlFor="type">Tipo *</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo (SOCIAL, EMAIL, AD, BLOG, LANDING)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SOCIAL">SOCIAL</SelectItem>
                <SelectItem value="EMAIL">EMAIL</SelectItem>
                <SelectItem value="AD">AD</SelectItem>
                <SelectItem value="BLOG">BLOG</SelectItem>
                <SelectItem value="LANDING">LANDING</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Categoria e Tags */}
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

          <div className="space-y-3">
            <Label htmlFor="content" className="text-base font-medium">Conteúdo do Template *</Label>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  💡
                </div>
                <div className="text-sm text-blue-800 space-y-2">
                  <p className="font-medium">Como criar variáveis:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    <p>• <code className="bg-blue-200 px-1 rounded">{'{empresa}'}</code> → Nome da empresa</p>
                    <p>• <code className="bg-blue-200 px-1 rounded">{'{produto}'}</code> → Nome do produto</p>
                    <p>• <code className="bg-blue-200 px-1 rounded">{'{beneficio}'}</code> → Principal benefício</p>
                    <p>• <code className="bg-blue-200 px-1 rounded">{'{preco}'}</code> → Valor/preço</p>
                  </div>
                  <p className="text-blue-700">
                    <strong>Exemplo:</strong> "Conheça o {'{produto}'} da {'{empresa}'}! {'{beneficio}'} por apenas {'{preco}'}."
                  </p>
                </div>
              </div>
            </div>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder={`Exemplo de template:
🔥 Oferta Especial da {empresa}!

Descubra o {produto} que vai transformar {problema_cliente}.

✅ {beneficio_1}
✅ {beneficio_2}
✅ {beneficio_3}

Por apenas {preco} (de {preco_original})
Válido até {data_limite}

{call_to_action} 👆`}
              className="min-h-[250px] resize-none text-sm leading-relaxed"
            />
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <strong>💡 Dica profissional:</strong> Quanto mais variáveis você usar, mais versátil seu template fica!
                Pense nos elementos que sempre mudam entre campanhas.
              </p>
            </div>
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