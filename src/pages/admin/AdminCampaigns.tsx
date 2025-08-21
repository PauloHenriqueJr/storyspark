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
  Target
} from 'lucide-react';

const AdminCampaigns = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Mock data para campanhas globais
  const globalCampaigns = [
    {
      id: 1,
      name: 'Template Black Friday 2024',
      category: 'E-commerce',
      status: 'active',
      usage: 847,
      performance: '8.4%',
      created: '2024-01-15',
      lastUsed: '2024-01-20',
      platforms: ['Instagram', 'Facebook', 'LinkedIn'],
      description: 'Campanha completa para Black Friday com 15 variações de copy'
    },
    {
      id: 2,
      name: 'Lançamento de Produto Tech',
      category: 'Tecnologia',
      status: 'active',
      usage: 623,
      performance: '12.1%',
      created: '2024-01-10',
      lastUsed: '2024-01-21',
      platforms: ['LinkedIn', 'Twitter', 'Instagram'],
      description: 'Templates para lançamento de produtos tecnológicos'
    },
    {
      id: 3,
      name: 'Campanhas Saúde & Bem-estar',
      category: 'Saúde',
      status: 'draft',
      usage: 234,
      performance: '6.7%',
      created: '2024-01-12',
      lastUsed: '2024-01-18',
      platforms: ['Instagram', 'Facebook'],
      description: 'Conteúdo focado em saúde e qualidade de vida'
    },
    {
      id: 4,
      name: 'Educação Online - Cursos',
      category: 'Educação',
      status: 'active',
      usage: 1205,
      performance: '15.3%',
      created: '2024-01-08',
      lastUsed: '2024-01-21',
      platforms: ['LinkedIn', 'Facebook', 'Instagram', 'YouTube'],
      description: 'Templates para promoção de cursos e conteúdo educacional'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'paused': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativa';
      case 'draft': return 'Rascunho';
      case 'paused': return 'Pausada';
      default: return 'Desconhecido';
    }
  };

  const filteredCampaigns = globalCampaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || campaign.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const stats = [
    {
      title: 'Total Campanhas',
      value: '24',
      change: '+3 esta semana',
      icon: Target
    },
    {
      title: 'Uso Total',
      value: '2.9K',
      change: '+15% este mês',
      icon: Users
    },
    {
      title: 'Performance Média',
      value: '10.6%',
      change: '+2.1% este mês',
      icon: TrendingUp
    },
    {
      title: 'Campanhas Ativas',
      value: '18',
      change: '75% do total',
      icon: Calendar
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Campanhas Globais</h1>
          <p className="text-muted-foreground">Gerencie templates de campanhas do sistema</p>
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
                Nova Campanha
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Criar Nova Campanha Global</DialogTitle>
                <DialogDescription>
                  Crie um template de campanha que poderá ser usado por todos os usuários
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Nome da Campanha</label>
                    <Input placeholder="Nome da campanha..." />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Categoria</label>
                    <Input placeholder="Ex: E-commerce, Tecnologia..." />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Descrição</label>
                  <Input placeholder="Descreva o objetivo e uso da campanha..." />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancelar</Button>
                  <Button>Criar Campanha</Button>
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
            placeholder="Buscar campanhas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="active">Ativas</TabsTrigger>
          <TabsTrigger value="draft">Rascunhos</TabsTrigger>
          <TabsTrigger value="paused">Pausadas</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-4">
            {filteredCampaigns.map((campaign) => (
              <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{campaign.name}</h3>
                        <Badge className={getStatusColor(campaign.status)}>
                          {getStatusText(campaign.status)}
                        </Badge>
                        <Badge variant="outline">{campaign.category}</Badge>
                      </div>
                      
                      <p className="text-muted-foreground mb-3">{campaign.description}</p>
                      
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{campaign.usage} usos</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          <span>{campaign.performance} performance</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Criada em {campaign.created}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-3">
                        {campaign.platforms.map((platform, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
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

export default AdminCampaigns;