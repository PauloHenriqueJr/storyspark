import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mic, 
  Volume2, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Eye,
  Play,
  Pause,
  BarChart3,
  Users,
  Heart,
  TestTube,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CreateBrandVoiceModal from '@/components/modals/CreateBrandVoiceModal';
import VoiceTesterModal from '@/components/modals/VoiceTesterModal';
import { useBrandVoices } from '@/hooks/useBrandVoices';
import { useToast } from '@/hooks/use-toast';
import type { BrandVoiceWithStats } from '@/services/brandVoicesService';
import type { Database } from '@/integrations/supabase/types';

type CreateBrandVoiceInput = Database['public']['Tables']['brand_voices']['Insert'];

// Dados agora vêm do hook useBrandVoices conectado ao Supabase

const BrandVoices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTone, setFilterTone] = useState('Todos');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTesterModal, setShowTesterModal] = useState(false);
  const [editingVoice, setEditingVoice] = useState<BrandVoiceWithStats | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<BrandVoiceWithStats | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  
  const { voices, loading, error, createVoice, updateVoice, deleteVoice, duplicateVoice, toggleVoiceStatus } = useBrandVoices();
  const { toast } = useToast();

  const handleCreateVoice = async (newVoice: Omit<CreateBrandVoiceInput, 'workspace_id' | 'user_id'>) => {
    try {
      if (editingVoice) {
        await updateVoice(editingVoice.id, newVoice);
        toast({
          title: 'Sucesso!',
          description: 'Brand voice atualizada com sucesso.',
        });
      } else {
        await createVoice(newVoice);
        toast({
          title: 'Sucesso!',
          description: 'Nova brand voice criada com sucesso.',
        });
      }
      setShowCreateModal(false);
      setEditingVoice(null);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar a brand voice. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const handleEditVoice = (voice: BrandVoiceWithStats) => {
    setEditingVoice(voice);
    setShowCreateModal(true);
  };

  const handleTestVoice = (voice: BrandVoiceWithStats) => {
    setSelectedVoice(voice);
    setShowTesterModal(true);
  };

  const handleToggleStatus = async (voiceId: string) => {
    try {
      await toggleVoiceStatus(voiceId);
      toast({
        title: 'Status alterado',
        description: 'Status da brand voice foi alterado com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível alterar o status. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteVoice = async (voiceId: string) => {
    try {
      await deleteVoice(voiceId);
      toast({
        title: 'Brand voice removida',
        description: 'A brand voice foi removida com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível remover a brand voice. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const handleDuplicateVoice = async (voiceId: string) => {
    try {
      await duplicateVoice(voiceId);
      toast({
        title: 'Brand voice duplicada',
        description: 'A brand voice foi duplicada com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível duplicar a brand voice. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const filteredVoices = voices.filter(voice => {
    const matchesSearch = voice.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (voice.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTone = filterTone === 'Todos' || voice.tone === filterTone;
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'active' && voice.is_active) ||
                      (activeTab === 'inactive' && !voice.is_active);
    return matchesSearch && matchesTone && matchesTab;
  });

  const activeVoices = voices.filter(v => v.is_active).length;
  const totalUsage = voices.reduce((acc, v) => acc + (v.usage_count || 0), 0);
  const avgEngagement = voices.length > 0 ? voices.reduce((acc, v) => acc + (v.avgEngagement || 0), 0) / voices.length : 0;

  // Estados de loading e erro
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Carregando brand voices...</p>
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
              <Mic className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Erro ao carregar brand voices</h3>
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

  return (
    <div className="space-y-8">
      {/* Header com explicação */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Mic className="w-8 h-8 text-primary" />
              Brand Voices
            </h1>
            <p className="text-muted-foreground">
              Defina a personalidade e tom de comunicação da sua marca
            </p>
          </div>
          <Button 
            className="bg-gradient-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Voice
          </Button>
        </div>

        {/* Card explicativo para iniciantes */}
        <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/50 dark:border-blue-800">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Volume2 className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg text-blue-800 dark:text-blue-200">
                O que é uma Brand Voice?
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
              A Brand Voice é a <strong>personalidade da sua marca</strong> expressa através de palavras. 
              Define <strong>como</strong> sua marca se comunica, não apenas <strong>o que</strong> ela diz.
            </p>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-3">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Quando é usada:
                </h4>
                <ul className="space-y-2 text-blue-700 dark:text-blue-300">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1 text-xs">•</span>
                    <span><strong>Geração de Copies:</strong> Todas as copies criadas seguem sua Brand Voice</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1 text-xs">•</span>
                    <span><strong>Posts e Campanhas:</strong> Mantém consistência na comunicação</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1 text-xs">•</span>
                    <span><strong>Múltiplas Marcas:</strong> Cada marca pode ter sua própria voz</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Principais benefícios:
                </h4>
                <ul className="space-y-2 text-blue-700 dark:text-blue-300">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1 text-xs">•</span>
                    <span><strong>Consistência:</strong> Mesma personalidade em todos os canais</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1 text-xs">•</span>
                    <span><strong>Reconhecimento:</strong> Audiência identifica sua marca pelo tom</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1 text-xs">•</span>
                    <span><strong>IA Inteligente:</strong> Gera conteúdo alinhado automaticamente</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Voices
            </CardTitle>
            <Volume2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{voices.length}</div>
            <div className="text-xs text-emerald-500">
              {activeVoices} ativas
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Uso Total
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsage.toLocaleString()}</div>
            <div className="text-xs text-blue-500">
              +18% este mês
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Engagement Médio
            </CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgEngagement.toFixed(1)}%</div>
            <div className="text-xs text-red-500">
              +2.1% vs. anterior
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Campanhas
            </CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {voices.reduce((acc, v) => acc + (v.campaigns || 0), 0)}
            </div>
            <div className="text-xs text-purple-500">
              +8 esta semana
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters and Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar brand voices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterTone} onValueChange={setFilterTone}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por tom" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos os tons</SelectItem>
              <SelectItem value="Profissional">Profissional</SelectItem>
              <SelectItem value="Casual">Casual</SelectItem>
              <SelectItem value="Formal">Formal</SelectItem>
              <SelectItem value="Energético">Energético</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">Todas ({voices.length})</TabsTrigger>
            <TabsTrigger value="active">Ativas ({activeVoices})</TabsTrigger>
            <TabsTrigger value="inactive">Inativas ({voices.length - activeVoices})</TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      {/* Voices Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {filteredVoices.length === 0 ? (
          <div className="col-span-full flex items-center justify-center min-h-[300px]">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <Mic className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {voices.length === 0 ? 'Nenhuma brand voice criada' : 'Nenhuma brand voice encontrada'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {voices.length === 0 
                    ? 'Crie sua primeira brand voice para definir o tom e personalidade da sua marca'
                    : 'Ajuste os filtros ou crie uma nova brand voice'
                  }
                </p>
                <Button onClick={() => setShowCreateModal(true)} className="bg-gradient-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Brand Voice
                </Button>
              </div>
            </div>
          </div>
        ) : (
          filteredVoices.map((voice, index) => (
            <motion.div
              key={voice.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
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
                        <Badge variant={voice.is_active ? "default" : "destructive"}>
                          {voice.is_active ? 'Ativa' : 'Inativa'}
                        </Badge>
                        <Badge variant="outline">{voice.tone}</Badge>
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
                      <DropdownMenuItem onClick={() => handleTestVoice(voice)}>
                        <TestTube className="w-4 h-4 mr-2" />
                        Testar Voice
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditVoice(voice)}>
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
                      <DropdownMenuItem onClick={() => handleDuplicateVoice(voice.id)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteVoice(voice.id)}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <CardDescription>{voice.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Personality Traits */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Personalidade</h4>
                  <div className="flex flex-wrap gap-1">
                    {voice.personality?.map((trait, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Audience */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Público-alvo</h4>
                  <p className="text-sm text-muted-foreground">{voice.audience}</p>
                </div>

                {/* Example */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Exemplo</h4>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm italic">"{voice.examples?.[0] || 'Sem exemplo disponível'}"</p>
                  </div>
                </div>

                {/* Metrics */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Uso em campanhas</span>
                    <span className="font-medium">{voice.usage_count || 0} vezes</span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Engagement</span>
                      <span className="font-medium">{voice.avgEngagement || 0}%</span>
                    </div>
                    <Progress value={(voice.avgEngagement || 0) * 5} className="h-1" />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button className="flex-1" size="sm" onClick={() => handleTestVoice(voice)}>
                    <TestTube className="w-4 h-4 mr-2" />
                    Testar
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDuplicateVoice(voice.id)}>
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          ))
        )}
      </motion.div>

      {/* Modals */}
      <CreateBrandVoiceModal 
        open={showCreateModal}
        onOpenChange={(open) => {
          setShowCreateModal(open);
          if (!open) setEditingVoice(null);
        }}
        onCreateVoice={handleCreateVoice}
        editingVoice={editingVoice}
      />

      <VoiceTesterModal 
        open={showTesterModal}
        onOpenChange={(open) => {
          setShowTesterModal(open);
          if (!open) setSelectedVoice(null);
        }}
        voice={selectedVoice}
      />
    </div>
  );
};

export default BrandVoices;