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
  Eye,
  Loader2,
  Link2,
  RefreshCcw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import CreateCampaignModal from '@/components/modals/CreateCampaignModal';
import EditCampaignModal from '@/components/modals/EditCampaignModal';
import type { Database } from '@/integrations/supabase/types';
import { useCampaigns } from '@/hooks/useCampaigns';
import { useToast } from '@/hooks/use-toast';
import { useWorkspace } from '@/hooks/useWorkspace';

// Dados agora vêm do hook useCampaigns conectado ao Supabase

const Campaigns = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todas');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Database['public']['Tables']['campaigns']['Row'] | null>(null);
  
  const { campaigns, loading, error, stats, createCampaign, updateCampaign, deleteCampaign, updateCampaignStatus, refetch } = useCampaigns();
  const { toast } = useToast();
  const { workspace, user } = useWorkspace();

  const handleCreateCampaign = async (newCampaign: Omit<Database['public']['Tables']['campaigns']['Insert'], 'workspace_id' | 'user_id'>) => {
    try {
      await createCampaign(newCampaign);
      toast({
        title: 'Sucesso!',
        description: 'Nova campanha criada com sucesso.',
      });
      setShowCreateModal(false);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível criar a campanha. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    try {
      await deleteCampaign(campaignId);
      toast({
        title: 'Campanha removida',
        description: 'A campanha foi removida com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível remover a campanha. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateStatus = async (campaignId: string, newStatus: Database['public']['Enums']['CampaignStatus']) => {
    try {
      await updateCampaignStatus(campaignId, newStatus);
      toast({
        title: 'Status alterado',
        description: 'Status da campanha foi alterado com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível alterar o status. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const handleLinkFacebook = async () => {
    try {
      if (!workspace?.id || !user?.id) {
        toast({ title: 'Sessão inválida', description: 'Entre e selecione um workspace.', variant: 'destructive' });
        return;
      }
      const accessToken = window.prompt('Cole o Access Token do Facebook (Marketing API):');
      if (!accessToken) return;
      const adAccountId = window.prompt('Informe o Ad Account ID (ex: act_1234567890):');
      if (!adAccountId) return;

      // Opcional: businessId e fbUserId
      const businessId = window.prompt('Informe o Business ID (opcional):') || undefined;
      const fbUserId = window.prompt('Informe o Facebook User ID (opcional):') || undefined;

      // Chamar service para salvar credenciais de integração
      // @ts-expect-error - método existente no service
      await (await import('@/services/campaignsService')).campaignsService.linkFacebookAccount(
        workspace.id,
        user.id,
        { accessToken, adAccountId, businessId, fbUserId }
      );

      toast({ title: 'Facebook vinculado', description: 'Conta de anúncios vinculada com sucesso.' });
    } catch (error) {
      console.error('Erro ao vincular Facebook:', error);
      toast({ title: 'Erro ao vincular Facebook', description: 'Verifique o token e o Ad Account ID.', variant: 'destructive' });
    }
  };

  const handleSyncFacebook = async () => {
    try {
      if (!workspace?.id) {
        toast({ title: 'Sessão inválida', description: 'Selecione um workspace.', variant: 'destructive' });
        return;
      }
      // @ts-expect-error - método existente no service
      await (await import('@/services/campaignsService')).campaignsService.syncFromFacebook(workspace.id);
      await refetch();
      toast({ title: 'Sincronização iniciada', description: 'Dados sendo atualizados a partir do Facebook.' });
    } catch (error) {
      console.error('Erro ao sincronizar Facebook:', error);
      toast({ title: 'Erro na sincronização', description: 'Confira se a conta foi vinculada corretamente.', variant: 'destructive' });
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'Todas' || 
      (filterStatus === 'Ativas' && campaign.status === 'ACTIVE') ||
      (filterStatus === 'Pausadas' && campaign.status === 'PAUSED') ||
      (filterStatus === 'Rascunhos' && campaign.status === 'DRAFT');
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string): "default" | "destructive" | "outline" | "secondary" => {
    const variants: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
      'ACTIVE': 'default',
      'PAUSED': 'secondary', 
      'DRAFT': 'outline'
    };
    return variants[status] || 'outline';
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'ACTIVE': 'Ativa',
      'PAUSED': 'Pausada',
      'DRAFT': 'Rascunho'
    };
    return statusMap[status] || status;
  };

  // Estados de loading e erro
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Carregando campanhas...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Erro ao carregar campanhas</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Tentar novamente
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      title: 'Campanhas Ativas',
      value: stats?.activeCampaigns?.toString() || '0',
      change: '+2',
      icon: Target,
      color: 'text-primary'
    },
    {
      title: 'Investimento Total',
      value: `R$ ${(stats?.totalBudget || 0).toLocaleString()}`,
      change: '+12%',
      icon: TrendingUp,
      color: 'text-emerald-500'
    },
    {
      title: 'Impressões',
      value: stats?.impressions || '0',
      change: '+24%',
      icon: Eye,
      color: 'text-blue-500'
    },
    {
      title: 'Taxa Conversão',
      value: stats?.conversionRate || '0%',
      change: '+0.4%',
      icon: BarChart3,
      color: 'text-purple-500'
    }
  ];

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
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleLinkFacebook}>
            <Link2 className="w-4 h-4 mr-2" />
            Vincular Facebook
          </Button>
          <Button variant="outline" onClick={handleSyncFacebook}>
            <RefreshCcw className="w-4 h-4 mr-2" />
            Sincronizar
          </Button>
          <Button
            className="bg-gradient-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Campanha
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statsCards.map((stat, index) => (
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
          <Button 
            variant={filterStatus === 'Todas' ? 'default' : 'outline'} 
            onClick={() => setFilterStatus('Todas')}
          >
            <Filter className="w-4 h-4 mr-2" />
            Todas
          </Button>
          <Button 
            variant={filterStatus === 'Ativas' ? 'default' : 'outline'} 
            onClick={() => setFilterStatus('Ativas')}
          >
            Ativas
          </Button>
          <Button 
            variant={filterStatus === 'Pausadas' ? 'default' : 'outline'} 
            onClick={() => setFilterStatus('Pausadas')}
          >
            Pausadas
          </Button>
          <Button 
            variant={filterStatus === 'Rascunhos' ? 'default' : 'outline'} 
            onClick={() => setFilterStatus('Rascunhos')}
          >
            Rascunhos
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
        {filteredCampaigns.length === 0 ? (
          <div className="col-span-full flex items-center justify-center min-h-[300px]">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <Target className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {campaigns.length === 0 ? 'Nenhuma campanha criada' : 'Nenhuma campanha encontrada'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {campaigns.length === 0 
                    ? 'Crie sua primeira campanha para começar a gerar conteudo'
                    : 'Ajuste os filtros ou crie uma nova campanha'
                  }
                </p>
                <Button onClick={() => setShowCreateModal(true)} className="bg-gradient-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Campanha
                </Button>
              </div>
            </div>
          </div>
        ) : (
          filteredCampaigns.map((campaign, index) => (
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
                              <DropdownMenuItem onClick={() => console.log('Visualizar campanha:', campaign.id)}>
                                <Eye className="w-4 h-4 mr-2" />
                                Visualizar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                setSelectedCampaign(campaign);
                                setShowEditModal(true);
                              }}>
                                <Edit className="w-4 h-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdateStatus(campaign.id, campaign.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE')}>
                                {campaign.status === 'ACTIVE' ? (
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
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handleDeleteCampaign(campaign.id)}
                              >
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
                        <Progress value={campaign.progress || 0} className="h-2" />
                      </div>

                      {/* Period */}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {campaign.start_date} - {campaign.end_date}
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
          ))
        )}
      </motion.div>

      {/* Create Campaign Modal */}
      <CreateCampaignModal 
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onCreateCampaign={handleCreateCampaign}
      />
      
      {/* Edit Campaign Modal */}
      <EditCampaignModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        campaign={selectedCampaign}
        onUpdate={() => {
          // Forçar atualização das campanhas
          window.location.reload();
        }}
      />
    </div>
  );
};

export default Campaigns;