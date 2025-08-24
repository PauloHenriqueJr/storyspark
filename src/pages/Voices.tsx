import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mic,
  Search,
  Plus,
  Copy,
  Edit,
  Play,
  Pause,
  Eye,
  BarChart3,
  Heart,
  Users,
  Loader2,
  MoreVertical,
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';

import { useToast } from '@/hooks/use-toast';
import { useBrandVoices } from '@/hooks/useBrandVoices';
import CreateBrandVoiceModal from '@/components/modals/CreateBrandVoiceModal';
import type { Database } from '@/integrations/supabase/types';
import type { BrandVoiceWithStats } from '@/services/brandVoicesService';

type CreateBrandVoiceInput = Database['public']['Tables']['brand_voices']['Insert'];

const Voices = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'inactive'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingVoice, setEditingVoice] = useState<BrandVoiceWithStats | null>(null);

  const {
    voices,
    loading,
    error,
    createVoice,
    updateVoice,
    duplicateVoice,
    toggleVoiceStatus,
    deleteVoice,
  } = useBrandVoices();

  const handleUseVoice = (voice: BrandVoiceWithStats) => {
    // Navega para o Composer com a voice selecionada
    navigate('/composer', { state: { selectedVoice: voice } });
  };

  const handleDuplicate = async (id: string) => {
    try {
      await duplicateVoice(id);
      toast({
        title: 'Voice duplicada',
        description: 'A voice foi duplicada com sucesso.',
      });
    } catch {
      toast({
        title: 'Erro ao duplicar',
        description: 'Não foi possível duplicar a voice.',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (voice: BrandVoiceWithStats) => {
    setEditingVoice(voice);
    setShowCreateModal(true);
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleVoiceStatus(id);
      toast({
        title: 'Status alterado',
        description: 'O status da voice foi alterado.',
      });
    } catch {
      toast({
        title: 'Erro ao alterar status',
        description: 'Não foi possível alterar o status.',
        variant: 'destructive',
      });
    }
  };

  const handleCreateOrUpdate = async (payload: Omit<CreateBrandVoiceInput, 'workspace_id' | 'user_id'>) => {
    try {
      if (editingVoice) {
        await updateVoice(editingVoice.id, payload);
        toast({
          title: 'Voice atualizada',
          description: 'As alterações foram salvas com sucesso.',
        });
      } else {
        await createVoice(payload);
        toast({
          title: 'Voice criada',
          description: 'A nova voice foi criada com sucesso.',
        });
      }
      setShowCreateModal(false);
      setEditingVoice(null);
    } catch {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar a voice. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const filtered = useMemo(() => {
    const bySearch = voices.filter((v) => {
      const s = searchTerm.toLowerCase();
      return (
        v.name.toLowerCase().includes(s) ||
        (v.description || '').toLowerCase().includes(s) ||
        (v.tone || '').toLowerCase().includes(s) ||
        (v.style || '').toLowerCase().includes(s)
      );
    });

    const byTab =
      activeTab === 'all'
        ? bySearch
        : activeTab === 'active'
        ? bySearch.filter((v) => v.is_active)
        : bySearch.filter((v) => !v.is_active);

    return byTab;
  }, [voices, searchTerm, activeTab]);

  const totalVoices = voices.length;
  const activeVoices = voices.filter((v) => v.is_active).length;
  const totalUsage = voices.reduce((acc, v) => acc + (v.usage_count || 0), 0);
  const avgEngagement = voices.length > 0 ? voices.reduce((acc, v) => acc + (v.avgEngagement || 0), 0) / voices.length : 0;

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Carregando voices...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Mic className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-foreground mb-1">Erro ao carregar voices</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Mic className="w-8 h-8 text-primary" />
            Voices IA
          </h1>
          <p className="text-muted-foreground">
            Suas voices conectadas ao backend. Crie, edite, duplique e use no Composer.
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="bg-gradient-primary">
          <Plus className="w-4 h-4 mr-2" />
          Nova Voice
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Voices</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVoices}</div>
            <div className="text-xs text-emerald-500">{activeVoices} ativas</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Uso Total</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsage.toLocaleString()}</div>
            <div className="text-xs text-blue-500">últimos 30 dias</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Engajamento Médio</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgEngagement.toFixed(1)}%</div>
            <div className="text-xs text-red-500">média ponderada</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ativação</CardTitle>
            <Eye className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round((activeVoices / Math.max(1, totalVoices)) * 100)}%</div>
            <div className="text-xs text-purple-500">voices ativas</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search + Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar voices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <TabsList>
            <TabsTrigger value="all">Todas ({totalVoices})</TabsTrigger>
            <TabsTrigger value="active">Ativas ({activeVoices})</TabsTrigger>
            <TabsTrigger value="inactive">Inativas ({totalVoices - activeVoices})</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} />
        </Tabs>
      </motion.div>

      {/* Voices grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Mic className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Nenhuma voice encontrada</h3>
            <p className="text-muted-foreground mb-4">Crie sua primeira voice para começar a usar no Composer.</p>
            <Button className="bg-gradient-primary" onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Voice
            </Button>
          </div>
        ) : (
          filtered.map((voice, index) => (
            <motion.div
              key={voice.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="border-0 bg-card/50 backdrop-blur-sm hover:shadow-elegant transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white">
                        <Mic className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{voice.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={voice.is_active ? 'default' : 'destructive'}>
                            {voice.is_active ? 'Ativa' : 'Inativa'}
                          </Badge>
                          {voice.tone && <Badge variant="outline">{voice.tone}</Badge>}
                          {voice.style && <Badge variant="outline">{voice.style}</Badge>}
                        </div>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleUseVoice(voice)}>
                          <Play className="w-4 h-4 mr-2" />
                          Usar no Composer
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(voice)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleStatus(voice.id)}>
                          {voice.is_active ? (
                            <>
                              <Pause className="w-4 h-4 mr-2" />
                              Desativar
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Ativar
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(voice.id)}>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={async () => {
                            try {
                              await deleteVoice(voice.id);
                              toast({
                                title: 'Voice removida',
                                description: 'A voice foi removida com sucesso.',
                              });
                            } catch {
                              toast({
                                title: 'Erro ao remover',
                                description: 'Não foi possível remover a voice.',
                                variant: 'destructive',
                              });
                            }
                          }}
                        >
                          Remover
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {voice.description && <CardDescription>{voice.description}</CardDescription>}
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Métricas */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Uso em campanhas</span>
                      <span className="font-medium">{voice.usage_count || 0} vezes</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Engajamento</span>
                        <span className="font-medium">{voice.avgEngagement || 0}%</span>
                      </div>
                      <Progress value={(voice.avgEngagement || 0) * 5} className="h-1" />
                    </div>
                  </div>

                  {/* Ações rápidas */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button className="flex-1" size="sm" onClick={() => handleUseVoice(voice)}>
                      <Play className="w-4 h-4 mr-2" />
                      Usar Agora
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDuplicate(voice.id)}>
                      <Copy className="w-4 h-4 mr-2" />
                      Duplicar
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(voice)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Modal - Criar/Editar Brand Voice */}
      <CreateBrandVoiceModal
        open={showCreateModal}
        onOpenChange={(open) => {
          setShowCreateModal(open);
          if (!open) setEditingVoice(null);
        }}
        onCreateVoice={handleCreateOrUpdate}
        editingVoice={editingVoice}
      />
    </div>
  );
};

export default Voices;