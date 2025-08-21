
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Search, Filter, Heart, Copy, Edit3, Instagram, Facebook, Linkedin, Twitter, Plus, Share2 } from 'lucide-react';
import CreateTemplateModal from '@/components/modals/CreateTemplateModal';
import ShareTemplateModal from '@/components/templates/ShareTemplateModal';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/AuthProvider';
import { useWorkspace } from '@/hooks/useWorkspace';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  type: string;
  content: string;
  usage_count: number;
  is_public: boolean;
  created_at: string;
}

const Templates = () => {
  const { user } = useAuth();
  const { workspace } = useWorkspace();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [favoriteTemplates, setFavoriteTemplates] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [showShareModal, setShowShareModal] = useState(false);
  const [templateToShare, setTemplateToShare] = useState(null);

  const categories = ['Todos', 'Instagram', 'Facebook', 'LinkedIn', 'Twitter', 'Email', 'Blog'];

  useEffect(() => {
    const fetchTemplates = async () => {
      if (!workspace) return;

      try {
        const { data, error } = await supabase
          .from('templates')
          .select('*')
          .eq('workspace_id', workspace.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching templates:', error);
        } else {
          setTemplates(data || []);
        }
      } catch (error) {
        console.error('Error in templates fetch:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [workspace]);

  const handleCreateTemplate = async (newTemplate: any) => {
    if (!workspace || !user) return;

    try {
      const { data, error } = await supabase
        .from('templates')
        .insert({
          ...newTemplate,
          workspace_id: workspace.id,
          user_id: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating template:', error);
      } else {
        setTemplates(prev => [data, ...prev]);
      }
    } catch (error) {
      console.error('Error in template creation:', error);
    }
  };

  const handleEditTemplate = (template: any) => {
    setEditingTemplate(template);
    setShowCreateModal(true);
  };

  const handleToggleFavorite = (templateId: string) => {
    setFavoriteTemplates(prev => 
      prev.includes(templateId) 
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  };

  const handleShareTemplate = (template: any) => {
    setTemplateToShare(template);
    setShowShareModal(true);
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Instagram': return <Instagram className="w-4 h-4" />;
      case 'Facebook': return <Facebook className="w-4 h-4" />;
      case 'LinkedIn': return <Linkedin className="w-4 h-4" />;
      case 'Twitter': return <Twitter className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Templates</h1>
            <p className="text-muted-foreground">Carregando templates...</p>
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
                <p className="text-2xl font-bold text-foreground">{templates.length}</p>
              </div>
              <FileText className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Mais Usado</p>
                <p className="text-2xl font-bold text-foreground">
                  {templates.length > 0 ? Math.max(...templates.map(t => t.usage_count)) : 0}
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
                <p className="text-sm font-medium text-muted-foreground">Favoritos</p>
                <p className="text-2xl font-bold text-foreground">{favoriteTemplates.length}</p>
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
              {category}
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
                      {getPlatformIcon(template.type)}
                      <Badge variant="outline">{template.type}</Badge>
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
                  
                  <Badge className="w-fit">{template.category || template.type}</Badge>
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
                    <Button className="flex-1" size="sm">
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
                      onClick={() => handleShareTemplate(template)}
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
