import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import CreateVoiceModal from '@/components/modals/CreateVoiceModal';
import {
  Search,
  Plus,
  Play,
  Settings,
  Star,
  Copy,
  Edit,
  Trash2,
  Mic,
  Brain,
  Target,
  MessageSquare,
  Send,
  Megaphone,
  Phone,
  Users,
  TrendingUp
} from 'lucide-react';

const voices = [
  {
    id: 1,
    name: 'Sofia - Copy Persuasiva',
    description: 'Especialista em copies para anúncios curtos e persuasivos',
    avatar: '👩‍💼',
    category: 'ads',
    specialty: 'Facebook/Instagram Ads',
    tone: 'Persuasivo, Direto',
    usage: 89,
    rating: 4.8,
    isActive: true,
    isPremium: false,
    tags: ['ads', 'persuasão', 'conversão']
  },
  {
    id: 2,
    name: 'Carlos - WhatsApp Closer',
    description: 'Expert em mensagens de vendas para WhatsApp',
    avatar: '👨‍💼',
    category: 'sales',
    specialty: 'WhatsApp Business',
    tone: 'Conversacional, Próximo',
    usage: 67,
    rating: 4.9,
    isActive: true,
    isPremium: true,
    tags: ['whatsapp', 'vendas', 'conversão']
  },
  {
    id: 3,
    name: 'Ana - Email Expert',
    description: 'Criação de campanhas de email marketing',
    avatar: '👩‍🎨',
    category: 'email',
    specialty: 'Email Marketing',
    tone: 'Profissional, Envolvente',
    usage: 125,
    rating: 4.7,
    isActive: true,
    isPremium: false,
    tags: ['email', 'marketing', 'engagement']
  },
  {
    id: 4,
    name: 'Pedro - Social Media',
    description: 'Posts criativos para redes sociais',
    avatar: '👨‍🎨',
    category: 'social',
    specialty: 'Redes Sociais',
    tone: 'Criativo, Casual',
    usage: 201,
    rating: 4.6,
    isActive: true,
    isPremium: false,
    tags: ['social', 'criativo', 'engagement']
  },
  {
    id: 5,
    name: 'Laura - Report Master',
    description: 'Gera relatórios e análises detalhadas',
    avatar: '👩‍📊',
    category: 'analytics',
    specialty: 'Relatórios e Métricas',
    tone: 'Analítico, Preciso',
    usage: 43,
    rating: 4.5,
    isActive: false,
    isPremium: true,
    tags: ['relatórios', 'analytics', 'dados']
  },
  {
    id: 6,
    name: 'Roberto - Pitch Pro',
    description: 'Apresentações e pitches de vendas',
    avatar: '👨‍💻',
    category: 'sales',
    specialty: 'Pitches e Apresentações',
    tone: 'Convincente, Estruturado',
    usage: 78,
    rating: 4.8,
    isActive: true,
    isPremium: true,
    tags: ['pitch', 'vendas', 'apresentação']
  }
];

const Voices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [voicesList, setVoicesList] = useState(voices);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleUseVoice = (voice: typeof voices[0]) => {
    toast({
      title: "Voice Selecionado",
      description: `Redirecionando para o Composer com ${voice.name}...`,
    });
    // Redireciona para o composer com o voice selecionado
    setTimeout(() => {
      navigate('/composer', { state: { selectedVoice: voice } });
    }, 1000);
  };

  const handleCopyVoice = (voice: typeof voices[0]) => {
    toast({
      title: "Voice Copiado",
      description: `${voice.name} foi adicionado aos seus voices pessoais.`,
    });
  };

  const handleEditVoice = (voice: typeof voices[0]) => {
    toast({
      title: "Editando Voice",
      description: `Abrindo editor para ${voice.name}...`,
    });
  };

  const handleCreateNewVoice = () => {
    setShowCreateModal(true);
  };

  const handleCreateVoice = (newVoice: any) => {
    setVoicesList(prev => [newVoice, ...prev]);
    toast({
      title: "Voice Criado",
      description: `${newVoice.name} foi criado com sucesso!`,
    });
  };

  const categories = [
    { id: 'all', label: 'Todos', icon: Users, count: voices.length },
    { id: 'ads', label: 'Anúncios', icon: Target, count: voices.filter(v => v.category === 'ads').length },
    { id: 'sales', label: 'Vendas', icon: TrendingUp, count: voices.filter(v => v.category === 'sales').length },
    { id: 'email', label: 'Email', icon: Send, count: voices.filter(v => v.category === 'email').length },
    { id: 'social', label: 'Social', icon: MessageSquare, count: voices.filter(v => v.category === 'social').length },
    { id: 'analytics', label: 'Analytics', icon: Brain, count: voices.filter(v => v.category === 'analytics').length },
  ];

  const filteredVoices = voicesList.filter(voice => {
    const matchesSearch = voice.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         voice.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         voice.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && voice.category === activeTab;
  });

  const VoiceCard = ({ voice }: { voice: typeof voices[0] }) => (
    <Card className="group hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{voice.avatar}</div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                {voice.name}
                {voice.isPremium && <Badge variant="secondary" className="text-xs">Premium</Badge>}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{voice.specialty}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">{voice.rating}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-foreground">{voice.description}</p>
        
        <div className="flex flex-wrap gap-1">
          {voice.tags.map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Tom: {voice.tone}</span>
          <span>{voice.usage} usos</span>
        </div>

        <div className="flex gap-2 pt-2">
          <Button className="flex-1" size="sm" onClick={() => handleUseVoice(voice)}>
            <Play className="w-4 h-4 mr-2" />
            Usar Agora
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleCopyVoice(voice)}>
            <Copy className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleEditVoice(voice)}>
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Mic className="w-8 h-8 text-primary" />
            Voices IA
          </h1>
          <p className="text-muted-foreground">Seus assistentes especializados em criação de conteúdo</p>
        </div>
        <Button onClick={handleCreateNewVoice}>
          <Plus className="w-4 h-4 mr-2" />
          Criar Novo Voice
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">{voicesList.length}</div>
            <p className="text-sm text-muted-foreground">Total de Voices</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{voicesList.filter(v => v.isActive).length}</div>
            <p className="text-sm text-muted-foreground">Voices Ativos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{voicesList.filter(v => v.isPremium).length}</div>
            <p className="text-sm text-muted-foreground">Premium</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{voicesList.reduce((sum, v) => sum + v.usage, 0)}</div>
            <p className="text-sm text-muted-foreground">Total de Usos</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <Input
            placeholder="Buscar voices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Filtros
        </Button>
      </div>

      {/* Categories and Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          {categories.map(category => (
            <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
              <category.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{category.label}</span>
              <Badge variant="secondary" className="ml-1">{
                category.id === 'all' ? voicesList.length : voicesList.filter(v => v.category === category.id).length
              }</Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVoices.map(voice => (
              <VoiceCard key={voice.id} voice={voice} />
            ))}
          </div>

          {filteredVoices.length === 0 && (
            <div className="text-center py-12">
              <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum voice encontrado</h3>
              <p className="text-muted-foreground mb-4">Tente ajustar sua busca ou filtros</p>
              <Button onClick={handleCreateNewVoice}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Novo Voice
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Quick Start Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="w-5 h-5" />
            Como usar os Voices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">1. Escolha o Voice</h4>
              <p className="text-sm text-muted-foreground">Selecione o assistente especializado para sua necessidade</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Edit className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">2. Customize</h4>
              <p className="text-sm text-muted-foreground">Ajuste o tom e configurações para sua marca</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Play className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">3. Gere Conteúdo</h4>
              <p className="text-sm text-muted-foreground">Crie conteúdo otimizado com expertise especializada</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Voice Modal */}
      <CreateVoiceModal 
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onCreateVoice={handleCreateVoice}
      />
    </div>
  );
};

export default Voices;