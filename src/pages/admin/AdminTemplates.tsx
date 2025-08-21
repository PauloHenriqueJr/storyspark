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
  Heart
} from 'lucide-react';

const AdminTemplates = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Mock data para templates globais
  const globalTemplates = [
    {
      id: 1,
      name: 'Post Promocional - Black Friday',
      category: 'Promoções',
      platform: 'Instagram',
      status: 'active',
      usage: 1247,
      likes: 89,
      performance: '12.4%',
      created: '2024-01-15',
      lastUsed: '2024-01-21',
      description: 'Template otimizado para promoções de Black Friday com alta conversão',
      preview: '🔥 BLACK FRIDAY: {{desconto}}% OFF em {{produto}} por tempo limitado! Corre que é só hoje! 💨 #blackfriday #promocao'
    },
    {
      id: 2,
      name: 'Lançamento de Produto',
      category: 'Lançamentos',
      platform: 'LinkedIn',
      status: 'active',
      usage: 834,
      likes: 67,
      performance: '15.8%',
      created: '2024-01-12',
      lastUsed: '2024-01-20',
      description: 'Template profissional para anunciar novos produtos no LinkedIn',
      preview: 'Estamos empolgados em apresentar: {{produto}}! 🚀 Desenvolvido especialmente para {{target_audience}}...'
    },
    {
      id: 3,
      name: 'Storytelling Pessoal',
      category: 'Engajamento',
      platform: 'Facebook',
      status: 'draft',
      usage: 456,
      likes: 34,
      performance: '8.9%',
      created: '2024-01-10',
      lastUsed: '2024-01-18',
      description: 'Template para compartilhar histórias pessoais e criar conexão',
      preview: 'Hoje quero compartilhar com vocês uma história que mudou minha perspectiva sobre {{tema}}...'
    },
    {
      id: 4,
      name: 'Dicas e Tutoriais',
      category: 'Educativo',
      platform: 'Instagram',
      status: 'active',
      usage: 2103,
      likes: 156,
      performance: '18.7%',
      created: '2024-01-08',
      lastUsed: '2024-01-21',
      description: 'Template para compartilhar conhecimento e educar a audiência',
      preview: '📚 DICA DO DIA: Como {{acao}} em apenas {{tempo}} minutos! Salve este post para não esquecer 👆'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'draft': return 'Rascunho';
      case 'archived': return 'Arquivado';
      default: return 'Desconhecido';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'Instagram': return 'bg-pink-100 text-pink-800';
      case 'Facebook': return 'bg-blue-100 text-blue-800';
      case 'LinkedIn': return 'bg-blue-100 text-blue-900';
      case 'Twitter': return 'bg-sky-100 text-sky-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTemplates = globalTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || template.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const stats = [
    {
      title: 'Total Templates',
      value: '156',
      change: '+12 esta semana',
      icon: FileText
    },
    {
      title: 'Uso Total',
      value: '45.2K',
      change: '+23% este mês',
      icon: Users
    },
    {
      title: 'Média de Likes',
      value: '87',
      change: '+5.4 por template',
      icon: Heart
    },
    {
      title: 'Performance Média',
      value: '13.9%',
      change: '+1.8% este mês',
      icon: TrendingUp
    }
  ];

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
        {stats.map((stat, index) => (
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
          <TabsTrigger value="active">Ativos</TabsTrigger>
          <TabsTrigger value="draft">Rascunhos</TabsTrigger>
          <TabsTrigger value="archived">Arquivados</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-4">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    {/* Template Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{template.name}</h3>
                        <Badge className={getStatusColor(template.status)}>
                          {getStatusText(template.status)}
                        </Badge>
                        <Badge className={getPlatformColor(template.platform)}>
                          {template.platform}
                        </Badge>
                        <Badge variant="outline">{template.category}</Badge>
                      </div>
                      
                      <p className="text-muted-foreground mb-3">{template.description}</p>
                      
                      {/* Preview */}
                      <div className="bg-muted/30 p-3 rounded-lg mb-3">
                        <p className="text-sm text-muted-foreground mb-1">Preview:</p>
                        <p className="text-sm italic">{template.preview}</p>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{template.usage} usos</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span>{template.likes} likes</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          <span>{template.performance} performance</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Criado em {template.created}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-start gap-2">
                      <Button variant="outline" size="sm">
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
                          <DropdownMenuItem>
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="w-4 h-4 mr-2" />
                            Exportar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminTemplates;