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
  TestTube
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

const brandVoices = [
  {
    id: 1,
    name: 'Tech Inovadora',
    description: 'Tom técnico e inovador para produtos de tecnologia',
    personality: ['Inovador', 'Técnico', 'Confiável'],
    tone: 'Profissional',
    style: 'Direto',
    audience: 'Desenvolvedores e CTOs',
    examples: [
      'Revolucione sua arquitetura com nossa solução cloud-native.',
      'Performance que escala: 99.9% de uptime garantido.',
      'API REST intuitiva, documentação completa, suporte 24/7.'
    ],
    usageCount: 156,
    campaigns: 24,
    avgEngagement: 8.2,
    active: true
  },
  {
    id: 2,
    name: 'Casual Amigável',
    description: 'Tom descontraído e próximo para redes sociais',
    personality: ['Amigável', 'Descontraído', 'Empático'],
    tone: 'Casual',
    style: 'Conversacional',
    audience: 'Público geral, millennials',
    examples: [
      'Oi! Como foi seu dia? Aqui temos uma novidade incrível pra você! 😊',
      'Sabe aquela sensação de "finalmente!"? É isso que você vai sentir.',
      'Conta pra gente nos comentários: qual sua experiência favorita?'
    ],
    usageCount: 203,
    campaigns: 31,
    avgEngagement: 12.5,
    active: true
  },
  {
    id: 3,
    name: 'Corporativo Premium',
    description: 'Tom elegante e sofisticado para segmento premium',
    personality: ['Sofisticado', 'Exclusivo', 'Elegante'],
    tone: 'Formal',
    style: 'Persuasivo',
    audience: 'Executivos, C-level',
    examples: [
      'Exclusividade redefinida: experiência premium para líderes visionários.',
      'Quando a excelência é o padrão, cada detalhe importa.',
      'Acesso restrito a uma elite de inovadores e transformadores.'
    ],
    usageCount: 89,
    campaigns: 12,
    avgEngagement: 6.8,
    active: true
  },
  {
    id: 4,
    name: 'Startup Disruptiva',
    description: 'Tom ousado e revolucionário para startups',
    personality: ['Ousado', 'Disruptivo', 'Dinâmico'],
    tone: 'Energético',
    style: 'Provocativo',
    audience: 'Empreendedores, investidores',
    examples: [
      'Quebrar paradigmas não é hobby, é missão. 🚀',
      'Enquanto outros seguem regras, nós criamos o futuro.',
      'Disrupção real acontece quando você para de pedir permissão.'
    ],
    usageCount: 127,
    campaigns: 18,
    avgEngagement: 15.3,
    active: false
  }
];

const BrandVoices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTone, setFilterTone] = useState('Todos');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTesterModal, setShowTesterModal] = useState(false);
  const [voicesList, setVoicesList] = useState(brandVoices);
  const [editingVoice, setEditingVoice] = useState(null);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const handleCreateVoice = (newVoice: any) => {
    if (editingVoice) {
      setVoicesList(prev => prev.map(v => v.id === editingVoice.id ? newVoice : v));
    } else {
      setVoicesList(prev => [newVoice, ...prev]);
    }
  };

  const handleEditVoice = (voice: any) => {
    setEditingVoice(voice);
    setShowCreateModal(true);
  };

  const handleTestVoice = (voice: any) => {
    setSelectedVoice(voice);
    setShowTesterModal(true);
  };

  const toggleVoiceStatus = (voiceId: number) => {
    setVoicesList(prev => prev.map(voice => 
      voice.id === voiceId ? { ...voice, active: !voice.active } : voice
    ));
  };

  const filteredVoices = voicesList.filter(voice => {
    const matchesSearch = voice.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         voice.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTone = filterTone === 'Todos' || voice.tone === filterTone;
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'active' && voice.active) ||
                      (activeTab === 'inactive' && !voice.active);
    return matchesSearch && matchesTone && matchesTab;
  });

  const activeVoices = voicesList.filter(v => v.active).length;
  const totalUsage = voicesList.reduce((acc, v) => acc + v.usageCount, 0);
  const avgEngagement = voicesList.reduce((acc, v) => acc + v.avgEngagement, 0) / voicesList.length;

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
            <Mic className="w-8 h-8 text-primary" />
            Brand Voices
          </h1>
          <p className="text-muted-foreground">
            Defina a personalidade e tom de voz da sua marca
          </p>
        </div>
        <Button 
          className="bg-gradient-primary"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Voice
        </Button>
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
            <div className="text-2xl font-bold">{voicesList.length}</div>
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
              {voicesList.reduce((acc, v) => acc + v.campaigns, 0)}
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
            <TabsTrigger value="all">Todas ({voicesList.length})</TabsTrigger>
            <TabsTrigger value="active">Ativas ({activeVoices})</TabsTrigger>
            <TabsTrigger value="inactive">Inativas ({voicesList.length - activeVoices})</TabsTrigger>
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
        {filteredVoices.map((voice, index) => (
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
                        <Badge variant={voice.active ? "default" : "secondary"}>
                          {voice.active ? 'Ativa' : 'Inativa'}
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
                      <DropdownMenuItem onClick={() => toggleVoiceStatus(voice.id)}>
                        {voice.active ? (
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
                      <DropdownMenuItem>
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
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
                    {voice.personality.map((trait, i) => (
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
                    <p className="text-sm italic">"{voice.examples[0]}"</p>
                  </div>
                </div>

                {/* Metrics */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Uso em campanhas</span>
                    <span className="font-medium">{voice.usageCount} vezes</span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Engagement</span>
                      <span className="font-medium">{voice.avgEngagement}%</span>
                    </div>
                    <Progress value={voice.avgEngagement * 5} className="h-1" />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button className="flex-1" size="sm" onClick={() => handleTestVoice(voice)}>
                    <TestTube className="w-4 h-4 mr-2" />
                    Testar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Copy className="w-4 h-4 mr-2" />
                    Usar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
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