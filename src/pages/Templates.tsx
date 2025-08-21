import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Search, Filter, Heart, Copy, Edit3, Instagram, Facebook, Linkedin, Twitter, Plus, Share2 } from 'lucide-react';
import CreateTemplateModal from '@/components/modals/CreateTemplateModal';
import ShareTemplateModal from '@/components/templates/ShareTemplateModal';

const templates = [
  {
    id: 1,
    title: 'Post Promocional',
    description: 'Template para promoções e ofertas especiais',
    category: 'Vendas',
    platform: 'Instagram',
    likes: 156,
    uses: 89,
    preview: '🔥 OFERTA IMPERDÍVEL!\n\n[Produto/Serviço] com [X]% OFF\n\n✨ Benefícios:\n• [Benefício 1]\n• [Benefício 2]\n\n⏰ Válido até [Data]\n\n#promoção #oferta'
  },
  {
    id: 2,
    title: 'Story Engajamento',
    description: 'Template para stories interativos',
    category: 'Engajamento',
    platform: 'Instagram',
    likes: 243,
    uses: 167,
    preview: '💭 Pergunta do dia:\n\n[Sua pergunta aqui]\n\nResponde aí nos comentários! 👇\n\n#pergunta #interação'
  },
  {
    id: 3,
    title: 'Artigo Profissional',
    description: 'Template para conteúdo corporativo',
    category: 'Profissional',
    platform: 'LinkedIn',
    likes: 189,
    uses: 134,
    preview: '[Título Impactante]\n\n[Introdução que gera curiosidade]\n\n🔍 Principais pontos:\n\n1. [Ponto 1]\n2. [Ponto 2]\n3. [Ponto 3]\n\n[Conclusão com CTA]'
  },
  {
    id: 4,
    title: 'Tweet Viral',
    description: 'Template para tweets de alto engajamento',
    category: 'Viral',
    platform: 'Twitter',
    likes: 298,
    uses: 201,
    preview: '[Hook forte em 1 linha]\n\n[Contexto/História]\n\n[Insight/Lição aprendida]\n\n[CTA ou pergunta]'
  }
];

const Templates = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [templatesList, setTemplatesList] = useState(templates);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [favoriteTemplates, setFavoriteTemplates] = useState<number[]>([1, 3]); // IDs dos templates favoritados
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [showShareModal, setShowShareModal] = useState(false);
  const [templateToShare, setTemplateToShare] = useState(null);

  const categories = ['Todos', 'Vendas', 'Engajamento', 'Profissional', 'Viral', 'Educativo'];

  const handleCreateTemplate = (newTemplate: any) => {
    setTemplatesList(prev => [newTemplate, ...prev]);
  };

  const handleEditTemplate = (template: any) => {
    setEditingTemplate(template);
    setShowCreateModal(true);
  };

  const handleToggleFavorite = (templateId: number) => {
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

  const filteredTemplates = templatesList.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
                <p className="text-2xl font-bold text-foreground">127</p>
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
                <p className="text-2xl font-bold text-foreground">89</p>
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
                <p className="text-2xl font-bold text-foreground">23</p>
              </div>
              <Heart className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Criados</p>
                <p className="text-2xl font-bold text-foreground">12</p>
              </div>
              <Edit3 className="w-8 h-8 text-blue-500" />
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
                      {getPlatformIcon(template.platform)}
                      <Badge variant="outline">{template.platform}</Badge>
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
                  
                  <CardTitle className="text-lg">{template.title}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                  
                  <Badge className="w-fit">{template.category}</Badge>
                </CardHeader>

                <CardContent>
                  <div className="bg-muted/30 p-3 rounded-md mb-4">
                    <p className="text-sm text-muted-foreground whitespace-pre-line line-clamp-4">
                      {template.preview}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>❤️ {template.likes} likes</span>
                    <span>📋 {template.uses} usos</span>
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
