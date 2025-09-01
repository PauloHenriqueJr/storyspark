import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Copy,
  Trash2,
  TrendingUp,
  Users,
  Calendar,
  FileText,
  Heart,
  Loader2,
  AlertCircle,

} from 'lucide-react';
import { useTemplates } from '@/hooks/useTemplates';
import { toast } from 'sonner';


const AdminTemplates = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  const {
    publicTemplates,
    loading,
    error,
    stats,
    duplicateTemplate,
    deleteTemplate,
    incrementUsage
  } = useTemplates();

  const handleDuplicate = async (templateId: string) => {
    try {
      await duplicateTemplate(templateId);
      toast.success('Template duplicado com sucesso!');
    } catch (error) {
      toast.error('Erro ao duplicar template');
      console.error('Erro:', error);
    }
  };

  const handleDelete = async (templateId: string) => {
    try {
      await deleteTemplate(templateId);
      toast.success('Template excluído com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir template');
      console.error('Erro:', error);
    }
  };

  const handlePreview = async (templateId: string) => {
    try {
      await incrementUsage(templateId);
    } catch (error) {
      console.error('Erro ao registrar visualização:', error);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'SOCIAL_MEDIA': return 'bg-pink-100 text-pink-800';
      case 'EMAIL': return 'bg-blue-100 text-blue-800';
      case 'AD_COPY': return 'bg-purple-100 text-purple-800';
      case 'BLOG_POST': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'SOCIAL_MEDIA': return 'Rede Social';
      case 'EMAIL': return 'E-mail';
      case 'AD_COPY': return 'Anúncio';
      case 'BLOG_POST': return 'Blog Post';
      default: return type;
    }
  };

  const filteredTemplates = publicTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (template.category?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    
    // Filter by type for tabs
    const matchesTab = activeTab === 'social' ? template.type === 'SOCIAL_MEDIA' :
                      activeTab === 'email' ? template.type === 'EMAIL' :
                      activeTab === 'ads' ? template.type === 'AD_COPY' :
                      activeTab === 'blog' ? template.type === 'BLOG_POST' : true;
    
    return matchesSearch && matchesTab;
  });

  const statsCards = [
    {
      title: 'Total Templates',
      value: stats?.totalTemplates?.toString() || '0',
      change: `${stats?.categories || 0} categorias`,
      icon: FileText
    },
    {
      title: 'Uso Total',
      value: stats?.totalUsage?.toLocaleString() || '0',
      change: `${stats?.averageUsage || 0} média por template`,
      icon: Users
    },
    {
      title: 'Média de Likes',
      value: Math.round(stats?.averageLikes || 0).toString(),
      change: '+5.4 por template',
      icon: Heart
    },
    {
      title: 'Performance Média',
      value: stats?.averagePerformance || '0%',
      change: '+1.8% este mês',
      icon: TrendingUp
    }
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Carregando templates...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Templates Globais</h1>
          <p className="text-muted-foreground">Gerencie biblioteca de templates do sistema</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Novo Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Criar Novo Template Global</DialogTitle>
                <DialogDescription>
                  Crie um template que estará disponível para todos os usuários
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Nome do Template</label>
                    <Input placeholder="Nome do template..." />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Categoria</label>
                    <Input placeholder="Ex: Promoções, Educativo..." />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Plataforma</label>
                    <Input placeholder="Instagram, Facebook, LinkedIn..." />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <Input placeholder="Ativo, Rascunho..." />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Descrição</label>
                  <Input placeholder="Descreva o propósito do template..." />
                </div>
                <div>
                  <label className="text-sm font-medium">Conteúdo do Template</label>
                  <textarea 
                    className="w-full p-3 border rounded-md min-h-[120px]"
                    placeholder="Digite o conteúdo do template usando variáveis como {{produto}}, {{desconto}}, etc..."
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancelar</Button>
                  <Button>Criar Template</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="social">Redes Sociais</TabsTrigger>
          <TabsTrigger value="email">E-mail</TabsTrigger>
          <TabsTrigger value="ads">Anúncios</TabsTrigger>
          <TabsTrigger value="blog">Blog Posts</TabsTrigger>

        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-4">
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum template encontrado</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'Tente ajustar os filtros de busca.' : 'Ainda não há templates nesta categoria.'}
                </p>
              </div>
            ) : (
              filteredTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      {/* Template Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">{template.name}</h3>
                          <Badge className={getTypeColor(template.type)}>
                            {getTypeText(template.type)}
                          </Badge>
                          {template.category && (
                            <Badge variant="outline">{template.category}</Badge>
                          )}
                          {template.is_public && (
                            <Badge className="bg-blue-100 text-blue-800">Público</Badge>
                          )}
                        </div>
                        
                        <p className="text-muted-foreground mb-3">{template.description}</p>
                        
                        {/* Preview */}
                        <div className="bg-muted/30 p-3 rounded-lg mb-3">
                          <p className="text-sm text-muted-foreground mb-1">Preview:</p>
                          <p className="text-sm italic line-clamp-2">{template.content.substring(0, 200)}...</p>
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{template.usage_count || 0} usos</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            <span>{template.likes || 0} likes</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            <span>{template.performance || 'N/A'} performance</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Criado em {new Date(template.created_at || '').toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-start gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handlePreview(template.id)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicate(template.id)}>
                              <Copy className="w-4 h-4 mr-2" />
                              Duplicar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="w-4 h-4 mr-2" />
                              Exportar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDelete(template.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>


      </Tabs>
    </div>
  );
};

export default AdminTemplates;