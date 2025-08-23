
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Search, Filter, Heart, Copy, Edit3, Instagram, Facebook, Linkedin, Twitter, Plus, Share2, Loader2, AlertCircle } from 'lucide-react';
import CreateTemplateModal from '@/components/modals/CreateTemplateModal';
import ShareTemplateModal from '@/components/templates/ShareTemplateModal';
import { useTemplates } from '@/hooks/useTemplates';
import { toast } from 'sonner';

const Templates = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [favoriteTemplates, setFavoriteTemplates] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [showShareModal, setShowShareModal] = useState(false);
  const [templateToShare, setTemplateToShare] = useState(null);
  
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
    incrementUsage
  } = useTemplates();

  const categories = ['Todos', 'SOCIAL_MEDIA', 'EMAIL', 'AD_COPY', 'BLOG_POST'];

  const handleCreateTemplate = async (newTemplate: any) => {
    try {
      await createTemplate(newTemplate);
      toast.success('Template criado com sucesso!');
      setShowCreateModal(false);
    } catch (error) {
      toast.error('Erro ao criar template');
      console.error('Error creating template:', error);
    }
  };

  const handleEditTemplate = (template: any) => {
    setEditingTemplate(template);
    setShowCreateModal(true);
  };

  const handleUpdateTemplate = async (id: string, updates: any) => {
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

  const handleTemplateUsed = async (id: string) => {
    try {
      await incrementUsage(id);
    } catch (error) {
      console.error('Error incrementing usage:', error);
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'SOCIAL_MEDIA': return 'Redes Sociais';
      case 'EMAIL': return 'E-mail';
      case 'AD_COPY': return 'Anúncios';
      case 'BLOG_POST': return 'Blog Posts';
      case 'Todos': return 'Todos';
      default: return category;
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (template.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || template.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'SOCIAL_MEDIA': return <Instagram className="w-4 h-4" />;
      case 'EMAIL': return <FileText className="w-4 h-4" />;
      case 'AD_COPY': return <Copy className="w-4 h-4" />;
      case 'BLOG_POST': return <FileText className="w-4 h-4" />;
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
        <Button 
          className="bg-gradient-primary hover:opacity-90"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Criar Template
        </Button>
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
        <TabsList className="grid w-full grid-cols-6">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {getCategoryText(category)}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card 
                key={template.id} 
                className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] animate-fade-in group"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(template.type)}
                      <Badge variant="outline">{getCategoryText(template.type)}</Badge>
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
                      {template.content.substring(0, 150)}...
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>📋 {template.usage_count} usos</span>
                    <span>{template.is_public ? '🌐 Público' : '🔒 Privado'}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      className="flex-1" 
                      size="sm"
                      onClick={() => handleTemplateUsed(template.id)}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Usar Template
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditTemplate(template)}
                      className="hover:animate-pulse-scale"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDuplicateTemplate(template.id)}
                      className="hover:animate-bounce-in"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
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
    </div>
  );
};

export default Templates;
