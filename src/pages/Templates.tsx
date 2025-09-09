
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Search, Filter, Heart, Copy, Edit3, Instagram, Facebook, Linkedin, Twitter, Plus, Share2, Loader2, AlertCircle, Wand2, Sparkles, Zap } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import CreateTemplateModal from '@/components/modals/CreateTemplateModal';
import ShareTemplateModal from '@/components/templates/ShareTemplateModal';
import UseTemplateModal from '@/components/templates/UseTemplateModal';
import { useTemplates } from '@/hooks/useTemplates';
import { useWorkspace } from '@/hooks/useWorkspace';
import { templatesService } from '@/services/templatesService';
import { toast } from 'sonner';
import type { TemplateWithStats } from '@/services/templatesService';
import type { Database } from '@/integrations/supabase/types';

const Templates = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<TemplateWithStats | null>(null);
  const [favoriteTemplates, setFavoriteTemplates] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Meus Templates');
  const [showShareModal, setShowShareModal] = useState(false);
  const [templateToShare, setTemplateToShare] = useState<TemplateWithStats | null>(null);
  const [showUseModal, setShowUseModal] = useState(false);
  const [templateToUse, setTemplateToUse] = useState<TemplateWithStats | null>(null);
  const [publicStatusOverrides, setPublicStatusOverrides] = useState<Record<string, boolean>>({});
  const [showCommunityTemplates, setShowCommunityTemplates] = useState(false);
  const [communityTemplates, setCommunityTemplates] = useState<TemplateWithStats[]>([]);
  
  const {
    templates,
    publicTemplates,
    loading,
    error,
    stats,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    incrementUsage,
    refetch
  } = useTemplates();

  const { user } = useWorkspace();

  useEffect(() => {
    const loadCommunityTemplates = async () => {
      try {
        const community = await templatesService.getPublicTemplates();
        setCommunityTemplates(community);
      } catch (error) {
        console.error('Erro ao carregar templates da comunidade:', error);
      }
    };

    if (selectedCategory === 'Comunidade') {
      loadCommunityTemplates();
    }
  }, [selectedCategory]);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user?.id) return;
      try {
        const favs = await templatesService.getFavorites(user.id);
        setFavoriteTemplates(favs);
      } catch (e) {
        console.error('Erro ao carregar favoritos', e);
      }
    };
    loadFavorites();
  }, [user?.id]);

  const handleToggleFavorite = async (templateId: string) => {
    if (!user?.id) {
      toast.error('Faça login para favoritar templates.');
      return;
    }
    try {
      const isCurrentlyFavorited = favoriteTemplates.includes(templateId);
      const added = await templatesService.toggleFavorite(templateId, user.id);
      
      setFavoriteTemplates(prev =>
        added ? Array.from(new Set([...prev, templateId])) : prev.filter(id => id !== templateId)
      );
      
      if (added) {
        toast.success('⭐ Template adicionado aos favoritos!', {
          description: 'Agora ele aparece no topo da lista e na aba Favoritos.'
        });
      } else {
        toast.success('💔 Template removido dos favoritos.');
      }
    } catch (e) {
      console.error('Erro ao favoritar', e);
      toast.error('Não foi possível atualizar favorito.');
    }
  };

  const handleShareTemplate = (template: TemplateWithStats) => {
    setTemplateToShare(template);
    setShowShareModal(true);
  };

  const handleTogglePublic = async (template: TemplateWithStats) => {
    const currentStatus = publicStatusOverrides[template.id] ?? template.is_public;
    const newStatus = !currentStatus;
    
    try {
      // Atualiza imediatamente o estado local para feedback visual instantâneo
      setPublicStatusOverrides(prev => ({
        ...prev,
        [template.id]: newStatus
      }));
      
      await templatesService.share(template.id, newStatus);
      
      if (newStatus) {
        toast.success('🌐 Template tornado público!', {
          description: 'Agora outros usuários da plataforma podem ver e usar este template na seção Comunidade.'
        });
      } else {
        toast.success('🔒 Template tornado privado.', {
          description: 'Apenas você pode ver e usar este template agora.'
        });
      }
      
      // Limpa cache para forçar recarregamento
      templatesService.clearCache();
      
      // Recarrega os dados sem limpar o override ainda (evita flickering)
      await refetch();
      
      // Remove o override após um delay para garantir que o refetch completou
      setTimeout(() => {
        setPublicStatusOverrides(prev => {
          const newOverrides = { ...prev };
          delete newOverrides[template.id];
          return newOverrides;
        });
      }, 500);
      
    } catch (e) {
      // Reverte a mudança local se houver erro
      setPublicStatusOverrides(prev => {
        const newOverrides = { ...prev };
        delete newOverrides[template.id];
        return newOverrides;
      });
      console.error('Erro ao atualizar visibilidade', e);
      toast.error('Não foi possível atualizar visibilidade.');
    }
  };
  
  // Função helper para obter o status público atual (com override local)
  const getPublicStatus = (template: TemplateWithStats) => {
    return publicStatusOverrides[template.id] ?? template.is_public;
  };

  const categories = ['Meus Templates', 'Favoritos', 'Comunidade', 'SOCIAL', 'EMAIL', 'AD', 'BLOG', 'LANDING'];

  const handleCreateTemplate = async (newTemplate: Omit<Database['public']['Tables']['templates']['Insert'], 'workspace_id' | 'user_id'>) => {
    try {
      await createTemplate(newTemplate);
      toast.success('Template criado com sucesso!');
      setShowCreateModal(false);
    } catch (error) {
      toast.error('Erro ao criar template');
      console.error('Error creating template:', error);
    }
  };

  const handleEditTemplate = (template: TemplateWithStats) => {
    setEditingTemplate(template);
    setShowCreateModal(true);
  };

  const handleUpdateTemplate = async (id: string, updates: Database['public']['Tables']['templates']['Update']) => {
    try {
      await updateTemplate(id, updates);
      toast.success('Template atualizado com sucesso!');
      setShowCreateModal(false);
      setEditingTemplate(null);
    } catch (error) {
      toast.error('Erro ao atualizar template');
      console.error('Error updating template:', error);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      await deleteTemplate(id);
      toast.success('Template excluído com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir template');
      console.error('Error deleting template:', error);
    }
  };

  const handleDuplicateTemplate = async (id: string) => {
    try {
      await duplicateTemplate(id);
      toast.success('Template duplicado com sucesso!');
    } catch (error) {
      toast.error('Erro ao duplicar template');
      console.error('Error duplicating template:', error);
    }
  };

  const handleTemplateUsed = async (template: TemplateWithStats) => {
    try {
      // Incrementa o uso
      await incrementUsage(template.id);
      
      // Abre o modal para processar o template
      setTemplateToUse(template);
      setShowUseModal(true);
      
    } catch (error) {
      console.error('Error using template:', error);
      toast.error('Erro ao usar template');
    }
  };

  const handleTemplateProcessed = (processedContent: string, template: TemplateWithStats | null) => {
    // Redireciona automaticamente para o composer com o conteúdo processado
    const encodedContent = encodeURIComponent(processedContent);
    const encodedName = encodeURIComponent(template?.name || 'Template');
    window.location.href = `/composer?content=${encodedContent}&name=${encodedName}&from=template`;
  };


  const getCategoryText = (category: string) => {
    switch (category) {
      case 'SOCIAL': return 'Redes Sociais';
      case 'EMAIL': return 'E-mail';
      case 'AD': return 'Anúncios';
      case 'BLOG': return 'Blog';
      case 'LANDING': return 'Landing Page';
      case 'Meus Templates': return 'Meus Templates';
      case 'Favoritos': return 'Favoritos';
      case 'Comunidade': return 'Comunidade';
      default: return category;
    }
  };

  // Função para limpar o conteúdo do template para apresentação
  const cleanTemplatePreview = (content: string): string => {
    return content
      // Remover variáveis {parametro} e substituir por placeholder
      .replace(/\{[^}]+\}/g, '[...]')
      // Converter \n literal para quebras reais
      .replace(/\\n/g, '\n')
      // Normalizar quebras de linha
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      // Limitar múltiplas quebras
      .replace(/\n{3,}/g, '\n\n')
      // Limpar espaços excessivos
      .replace(/[ \t]+/g, ' ')
      .trim();
  };

  const filteredTemplates = (selectedCategory === 'Comunidade' ? communityTemplates : templates).filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (template.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    let matchesCategory = false;
    if (selectedCategory === 'Meus Templates') {
      matchesCategory = true;
    } else if (selectedCategory === 'Favoritos') {
      matchesCategory = favoriteTemplates.includes(template.id);
    } else if (selectedCategory === 'Comunidade') {
      matchesCategory = true; // Todos os templates da comunidade
    } else {
      matchesCategory = template.type === selectedCategory;
    }
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    // Priorizar favoritos no topo (exceto na comunidade)
    if (selectedCategory !== 'Comunidade') {
      const aIsFavorite = favoriteTemplates.includes(a.id);
      const bIsFavorite = favoriteTemplates.includes(b.id);
      
      if (aIsFavorite && !bIsFavorite) return -1;
      if (!aIsFavorite && bIsFavorite) return 1;
    }
    
    // Na comunidade, ordenar por usage_count
    if (selectedCategory === 'Comunidade') {
      return (b.usage_count || 0) - (a.usage_count || 0);
    }
    
    // Se ambos são favoritos ou nenhum é favorito, ordenar por nome
    return a.name.localeCompare(b.name);
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'SOCIAL': return <Instagram className="w-4 h-4" />;
      case 'EMAIL': return <FileText className="w-4 h-4" />;
      case 'AD': return <Copy className="w-4 h-4" />;
      case 'BLOG': return <FileText className="w-4 h-4" />;
      case 'LANDING': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Carregando templates...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-foreground mb-1">Erro ao carregar templates</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Templates</h1>
          <p className="text-muted-foreground">
            Biblioteca de templates otimizados para diferentes plataformas
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            className="bg-gradient-primary hover:opacity-90"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar Template
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Templates</p>
                <p className="text-2xl font-bold text-foreground">{stats?.totalTemplates || 0}</p>
              </div>
              <FileText className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Uso Total</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats?.totalUsage || 0}
                </p>
              </div>
              <Copy className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Categorias</p>
                <p className="text-2xl font-bold text-foreground">{stats?.categories || 0}</p>
              </div>
              <Heart className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Públicos</p>
                <p className="text-2xl font-bold text-foreground">
                  {templates.filter(t => t.is_public).length}
                </p>
              </div>
              <Share2 className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filtros
        </Button>
      </div>

      {/* Categories Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-8">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="relative">
              {getCategoryText(category)}
              {category === 'Favoritos' && favoriteTemplates.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 text-xs">
                  {favoriteTemplates.length}
                </Badge>
              )}
              {category === 'Comunidade' && communityTemplates.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 text-xs">
                  {communityTemplates.length}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          {/* Explicação da seção Comunidade */}
          {selectedCategory === 'Comunidade' && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  🌐
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">Templates da Comunidade</h3>
                  <p className="text-sm text-blue-700 mb-2">
                    Aqui você encontra templates públicos criados por outros usuários da plataforma.
                    Você pode usar qualquer template, favoritar os melhores e se inspirar nas criações da comunidade.
                  </p>
                  <div className="text-xs text-blue-600">
                    💡 <strong>Dica:</strong> Para compartilhar seus próprios templates, torne-os públicos clicando no ícone 🌐 em "Meus Templates"
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card
                key={template.id}
                className={`hover:shadow-lg transition-all duration-200 hover:scale-[1.02] animate-fade-in group ${
                  selectedCategory === 'Comunidade' ? 'border-blue-200' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(template.type)}
                      <Badge variant="outline">{getCategoryText(template.type)}</Badge>
                      {selectedCategory === 'Comunidade' && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          Comunidade
                        </Badge>
                      )}
                    </div>
                    <Heart
                      className={`w-5 h-5 cursor-pointer transition-colors ${
                        favoriteTemplates.includes(template.id)
                          ? 'text-red-500 fill-red-500'
                          : 'text-muted-foreground hover:text-red-500'
                      }`}
                      onClick={() => handleToggleFavorite(template.id)}
                    />
                  </div>
                  
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                  
                  <Badge className="w-fit">{getCategoryText(template.type)}</Badge>
                </CardHeader>

                <CardContent>
                  <div className="bg-muted/30 p-3 rounded-md mb-4">
                    <p className="text-sm text-muted-foreground whitespace-pre-line line-clamp-4">
                      {cleanTemplatePreview(template.content).substring(0, 150)}...
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>📋 {template.usage_count} usos</span>
                    {selectedCategory === 'Comunidade' ? (
                      <span>👥 Compartilhado</span>
                    ) : (
                      <span>{getPublicStatus(template) ? '🌐 Público' : '🔒 Privado'}</span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-gradient-primary"
                      size="sm"
                      onClick={() => handleTemplateUsed(template)}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Usar Template
                    </Button>
                    
                    {/* Mostrar botões de edição/compartilhamento apenas para templates próprios */}
                    {selectedCategory !== 'Comunidade' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditTemplate(template)}
                          className="hover:animate-pulse-scale"
                          title="Editar Template"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShareTemplate(template)}
                          className="hover:animate-bounce-in"
                          title="Compartilhar Template"
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTogglePublic(template)}
                          className={`hover:scale-105 transition-all duration-200 ${
                            getPublicStatus(template)
                              ? 'bg-green-50 hover:bg-green-100 border-green-200 text-green-700'
                              : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-600'
                          }`}
                          title={getPublicStatus(template) ? 'Template Público - Clique para tornar privado' : 'Template Privado - Clique para tornar público'}
                        >
                          {getPublicStatus(template) ? '🌐' : '🔒'}
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum template encontrado</h3>
              <p className="text-muted-foreground mb-6">
                Crie seu primeiro template ou ajuste os filtros de busca.
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Template
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Template Modal */}
      <CreateTemplateModal
        open={showCreateModal}
        onOpenChange={(open) => {
          setShowCreateModal(open);
          if (!open) setEditingTemplate(null);
        }}
        onCreateTemplate={handleCreateTemplate}
        onUpdateTemplate={handleUpdateTemplate}
        editingTemplate={editingTemplate}
      />

      {/* Share Template Modal */}
      <ShareTemplateModal 
        open={showShareModal}
        onOpenChange={(open) => {
          setShowShareModal(open);
          if (!open) setTemplateToShare(null);
        }}
        template={templateToShare}
      />

      {/* Use Template Modal */}
      <UseTemplateModal
        open={showUseModal}
        onOpenChange={(open) => {
          setShowUseModal(open);
          if (!open) setTemplateToUse(null);
        }}
        template={templateToUse}
        onTemplateProcessed={handleTemplateProcessed}
      />

    </div>
  );
};

export { Templates as Component };
