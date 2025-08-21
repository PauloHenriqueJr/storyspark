import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Play,
  Pause,
  Edit,
  Trash2,
  BarChart3,
  Calendar,
  Users,
  TrendingUp,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import CreateCampaignModal from '@/components/modals/CreateCampaignModal';

const campaigns = [
  {
    id: 1,
    name: 'Black Friday 2024',
    status: 'Ativa',
    platform: 'Instagram + Facebook',
    budget: 'R$ 5.000',
    spent: 2750,
    impressions: '45.2K',
    clicks: 1834,
    ctr: '4.06%',
    conversions: 156,
    startDate: '2024-11-15',
    endDate: '2024-11-30',
    progress: 55,
    statusColor: 'bg-emerald-500'
  },
  {
    id: 2,
    name: 'Lançamento Produto X',
    status: 'Pausada',
    platform: 'LinkedIn',
    budget: 'R$ 3.000',
    spent: 890,
    impressions: '12.8K',
    clicks: 456,
    ctr: '3.56%',
    conversions: 23,
    startDate: '2024-11-01',
    endDate: '2024-11-25',
    progress: 30,
    statusColor: 'bg-yellow-500'
  },
  {
    id: 3,
    name: 'Awareness Q4',
    status: 'Rascunho',
    platform: 'YouTube + Instagram',
    budget: 'R$ 8.000',
    spent: 0,
    impressions: '0',
    clicks: 0,
    ctr: '0%',
    conversions: 0,
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    progress: 0,
    statusColor: 'bg-gray-500'
  },
  {
    id: 4,
    name: 'Retargeting Carrinho',
    status: 'Ativa',
    platform: 'Facebook + Instagram',
    budget: 'R$ 2.500',
    spent: 1890,
    impressions: '23.5K',
    clicks: 967,
    ctr: '4.11%',
    conversions: 89,
    startDate: '2024-11-10',
    endDate: '2024-12-10',
    progress: 76,
    statusColor: 'bg-emerald-500'
  }
];

const stats = [
  {
    title: 'Campanhas Ativas',
    value: '8',
    change: '+2',
    icon: Target,
    color: 'text-primary'
  },
  {
    title: 'Investimento Total',
    value: 'R$ 18.5K',
    change: '+12%',
    icon: TrendingUp,
    color: 'text-emerald-500'
  },
  {
    title: 'Impressões',
    value: '127.3K',
    change: '+24%',
    icon: Eye,
    color: 'text-blue-500'
  },
  {
    title: 'Taxa Conversão',
    value: '3.8%',
    change: '+0.4%',
    icon: BarChart3,
    color: 'text-purple-500'
  }
];

const Campaigns = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todas');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [campaignsList, setCampaignsList] = useState(campaigns);

  const handleCreateCampaign = (newCampaign: any) => {
    setCampaignsList(prev => [newCampaign, ...prev]);
  };

  const filteredCampaigns = campaignsList.filter(campaign => 
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterStatus === 'Todas' || campaign.status === filterStatus)
  );

  const getStatusBadge = (status: string): "default" | "destructive" | "outline" | "secondary" => {
    const variants: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
      'Ativa': 'default',
      'Pausada': 'secondary', 
      'Rascunho': 'outline'
    };
    return variants[status] || 'outline';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Target className="w-8 h-8 text-primary" />
            Campanhas
          </h1>
          <p className="text-muted-foreground">
            Gerencie e monitore suas campanhas publicitárias
          </p>
        </div>
        <Button 
          className="bg-gradient-primary"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Campanha
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-emerald-500">
                {stat.change} vs. mês anterior
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar campanhas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setFilterStatus('Todas')}>
            <Filter className="w-4 h-4 mr-2" />
            Todas
          </Button>
          <Button variant="outline" onClick={() => setFilterStatus('Ativa')}>
            Ativas
          </Button>
          <Button variant="outline" onClick={() => setFilterStatus('Pausada')}>
            Pausadas
          </Button>
        </div>
      </motion.div>

      {/* Campaigns List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        {filteredCampaigns.map((campaign, index) => (
          <motion.div
            key={campaign.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-0 bg-card/50 backdrop-blur-sm hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Campaign Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{campaign.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {campaign.platform}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusBadge(campaign.status)}>
                          <div className={`w-2 h-2 rounded-full ${campaign.statusColor} mr-2`} />
                          {campaign.status}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              {campaign.status === 'Ativa' ? (
                                <>
                                  <Pause className="w-4 h-4 mr-2" />
                                  Pausar
                                </>
                              ) : (
                                <>
                                  <Play className="w-4 h-4 mr-2" />
                                  Ativar
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Budget Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Orçamento: {campaign.budget}</span>
                        <span>Gasto: R$ {campaign.spent.toLocaleString()}</span>
                      </div>
                      <Progress value={campaign.progress} className="h-2" />
                    </div>

                    {/* Period */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {campaign.startDate} - {campaign.endDate}
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:w-96">
                    <div className="text-center p-3 bg-muted/20 rounded-lg">
                      <div className="text-lg font-bold">{campaign.impressions}</div>
                      <div className="text-xs text-muted-foreground">Impressões</div>
                    </div>
                    <div className="text-center p-3 bg-muted/20 rounded-lg">
                      <div className="text-lg font-bold">{campaign.clicks}</div>
                      <div className="text-xs text-muted-foreground">Cliques</div>
                    </div>
                    <div className="text-center p-3 bg-muted/20 rounded-lg">
                      <div className="text-lg font-bold">{campaign.ctr}</div>
                      <div className="text-xs text-muted-foreground">CTR</div>
                    </div>
                    <div className="text-center p-3 bg-muted/20 rounded-lg">
                      <div className="text-lg font-bold">{campaign.conversions}</div>
                      <div className="text-xs text-muted-foreground">Conversões</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Create Campaign Modal */}
      <CreateCampaignModal 
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onCreateCampaign={handleCreateCampaign}
      />
    </div>
  );
};

export default Campaigns;