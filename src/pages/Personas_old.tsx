
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Users, Target, Search, Plus, MoreHorizontal, Edit, Trash2, Copy, X, Eye } from 'lucide-react';
import { usePersonas } from '@/hooks/usePersonas';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type CreatePersonaInput = Database['public']['Tables']['target_personas']['Insert'];

const Personas = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSegment, setFilterSegment] = useState('Todos');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    occupation: '',
    age_range: '',
    location: '',
    goals: [] as string[],
    pain_points: [] as string[],
    interests: [] as string[],
    preferred_channels: [] as string[],
  });

  // Temporary input states for arrays
  const [currentGoal, setCurrentGoal] = useState('');
  const [currentPainPoint, setCurrentPainPoint] = useState('');
  const [currentInterest, setCurrentInterest] = useState('');
  const [currentChannel, setCurrentChannel] = useState('');

  const { personas, loading, error, createPersona, updatePersona, deletePersona, duplicatePersona, refetch } = usePersonas();
  const { toast } = useToast();

  // Filter personas
  const filteredPersonas = personas.filter(persona => {
    const matchesSearch = persona.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (persona.occupation && persona.occupation.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSegment = filterSegment === 'Todos' || persona.occupation === filterSegment;
    
    return matchesSearch && matchesSegment;
  });

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Erro',
        description: 'Nome da persona é obrigatório.',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (editDialogOpen && selectedPersona) {
        await updatePersona(selectedPersona.id, formData);
        toast({
          title: 'Sucesso!',
          description: 'Persona atualizada com sucesso.',
        });
      } else {
        await createPersona(formData);
        toast({
          title: 'Sucesso!',
          description: 'Nova persona criada com sucesso.',
        });
      }
      
      setCreateDialogOpen(false);
      setEditDialogOpen(false);
      setSelectedPersona(null);
      resetForm();
      await refetch();
    } catch (error) {
      console.error('Erro ao salvar persona:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar persona. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const handleEditPersona = (persona: any) => {
    setSelectedPersona(persona);
    setFormData({
      name: persona.name || '',
      occupation: persona.occupation || '',
      age_range: persona.age_range || '',
      location: persona.location || '',
      goals: persona.goals || [],
      pain_points: persona.pain_points || [],
      interests: persona.interests || [],
      preferred_channels: persona.preferred_channels || [],
    });
    setEditDialogOpen(true);
  };

  const handleDeletePersona = async (personaId: string) => {
    try {
      await deletePersona(personaId);
      toast({
        title: 'Persona excluída',
        description: 'Persona foi excluída com sucesso.',
      });
      await refetch();
    } catch (error) {
      console.error('Erro ao excluir persona:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao excluir persona. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const handleDuplicatePersona = async (personaId: string) => {
    try {
      await duplicatePersona(personaId);
      toast({
        title: 'Persona duplicada',
        description: 'Persona foi duplicada com sucesso.',
      });
      await refetch();
    } catch (error) {
      console.error('Erro ao duplicar persona:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao duplicar persona. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      occupation: '',
      age_range: '',
      location: '',
      goals: [],
      pain_points: [],
      interests: [],
      preferred_channels: [],
    });
    setCurrentGoal('');
    setCurrentPainPoint('');
    setCurrentInterest('');
    setCurrentChannel('');
  };

  // Array manipulation functions
  const addGoal = () => {
    if (currentGoal.trim()) {
      setFormData(prev => ({
        ...prev,
        goals: [...prev.goals, currentGoal.trim()]
      }));
      setCurrentGoal('');
    }
  };

  const removeGoal = (index: number) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index)
    }));
  };

  const addPainPoint = () => {
    if (currentPainPoint.trim()) {
      setFormData(prev => ({
        ...prev,
        pain_points: [...prev.pain_points, currentPainPoint.trim()]
      }));
      setCurrentPainPoint('');
    }
  };

  const removePainPoint = (index: number) => {
    setFormData(prev => ({
      ...prev,
      pain_points: prev.pain_points.filter((_, i) => i !== index)
    }));
  };

  const addInterest = () => {
    if (currentInterest.trim()) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, currentInterest.trim()]
      }));
      setCurrentInterest('');
    }
  };

  const removeInterest = (index: number) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter((_, i) => i !== index)
    }));
  };

  const addChannel = () => {
    if (currentChannel.trim()) {
      setFormData(prev => ({
        ...prev,
        preferred_channels: [...prev.preferred_channels, currentChannel.trim()]
      }));
      setCurrentChannel('');
    }
  };

  const removeChannel = (index: number) => {
    setFormData(prev => ({
      ...prev,
      preferred_channels: prev.preferred_channels.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Carregando personas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">Erro: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Personas</h1>
            <p className="text-sm text-muted-foreground">
              {personas.length} personas criadas
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Personas</p>
                <p className="text-2xl font-bold text-foreground">{personas.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ocupações</p>
                <p className="text-2xl font-bold text-foreground">
                  {new Set(personas.map(p => p.occupation).filter(Boolean)).size}
                </p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Mais Usada</p>
                <p className="text-2xl font-bold text-foreground">
                  {personas.length > 0 ? Math.max(...personas.map(p => p.usage_count || 0)) : 0}
                </p>
              </div>
              <Eye className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar personas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterSegment} onValueChange={setFilterSegment}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por ocupação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todas as ocupações</SelectItem>
            <SelectItem value="Executivo">Executivos</SelectItem>
            <SelectItem value="Empreendedor">Empreendedores</SelectItem>
            <SelectItem value="Consultor">Consultores</SelectItem>
            <SelectItem value="Marketing">Marketing</SelectItem>
            <SelectItem value="Vendas">Vendas</SelectItem>
            <SelectItem value="TI">TI</SelectItem>
            <SelectItem value="RH">Recursos Humanos</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Criar Persona
        </Button>
      </div>

      {/* Persona Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPersonas.map((persona) => (
          <Card key={persona.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{persona.name}</CardTitle>
                  <Badge variant="outline" className="mb-2">
                    {persona.occupation || 'Profissional'}
                  </Badge>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditPersona(persona)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDuplicatePersona(persona.id)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => handleDeletePersona(persona.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Demografia:</p>
                  <p className="text-sm">{persona.age_range} • {persona.location}</p>
                </div>
                
                {persona.pain_points && persona.pain_points.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Principais Dores:</p>
                    <div className="flex flex-wrap gap-1">
                      {persona.pain_points.slice(0, 2).map((pain, index) => (
                        <Badge key={index} variant="destructive" className="text-xs">
                          {pain}
                        </Badge>
                      ))}
                      {persona.pain_points.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{persona.pain_points.length - 2} mais
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
                
                {persona.goals && persona.goals.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Objetivos:</p>
                    <div className="flex flex-wrap gap-1">
                      {persona.goals.slice(0, 2).map((goal, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {goal}
                        </Badge>
                      ))}
                      {persona.goals.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{persona.goals.length - 2} mais
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    <Target className="w-4 h-4 inline mr-1" />
                    {persona.usage_count || 0} campanhas
                  </div>
                  <Button variant="outline" size="sm">
                    Usar Persona
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPersonas.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            {searchTerm || filterSegment !== 'Todos' 
              ? 'Nenhuma persona encontrada com os filtros aplicados.' 
              : 'Nenhuma persona criada ainda. Crie sua primeira persona!'
            }
          </div>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={createDialogOpen || editDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setCreateDialogOpen(false);
          setEditDialogOpen(false);
          setSelectedPersona(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editDialogOpen ? 'Editar Persona' : 'Criar Nova Persona'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Persona</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Ana, Executiva Corporativa"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="occupation">Ocupação</Label>
                <Input
                  id="occupation"
                  value={formData.occupation}
                  onChange={(e) => setFormData(prev => ({ ...prev, occupation: e.target.value }))}
                  placeholder="Ex: Gerente de Marketing"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age_range">Faixa Etária</Label>
                <Input
                  id="age_range"
                  value={formData.age_range}
                  onChange={(e) => setFormData(prev => ({ ...prev, age_range: e.target.value }))}
                  placeholder="Ex: 30-45 anos"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Localização</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Ex: São Paulo, SP"
                />
              </div>
            </div>

            {/* Array Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Objetivos</Label>
                <div className="flex gap-2">
                  <Input
                    value={currentGoal}
                    onChange={(e) => setCurrentGoal(e.target.value)}
                    placeholder="Digite um objetivo..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addGoal();
                      }
                    }}
                  />
                  <Button type="button" onClick={addGoal} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.goals.map((goal, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {goal}
                      <button
                        type="button"
                        onClick={() => removeGoal(index)}
                        className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Pontos de Dor</Label>
                <div className="flex gap-2">
                  <Input
                    value={currentPainPoint}
                    onChange={(e) => setCurrentPainPoint(e.target.value)}
                    placeholder="Digite um ponto de dor..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addPainPoint();
                      }
                    }}
                  />
                  <Button type="button" onClick={addPainPoint} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.pain_points.map((painPoint, index) => (
                    <Badge key={index} variant="destructive" className="gap-1">
                      {painPoint}
                      <button
                        type="button"
                        onClick={() => removePainPoint(index)}
                        className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Interesses</Label>
                <div className="flex gap-2">
                  <Input
                    value={currentInterest}
                    onChange={(e) => setCurrentInterest(e.target.value)}
                    placeholder="Digite um interesse..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addInterest();
                      }
                    }}
                  />
                  <Button type="button" onClick={addInterest} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.interests.map((interest, index) => (
                    <Badge key={index} variant="outline" className="gap-1">
                      {interest}
                      <button
                        type="button"
                        onClick={() => removeInterest(index)}
                        className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Canais Preferidos</Label>
                <div className="flex gap-2">
                  <Input
                    value={currentChannel}
                    onChange={(e) => setCurrentChannel(e.target.value)}
                    placeholder="Digite um canal..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addChannel();
                      }
                    }}
                  />
                  <Button type="button" onClick={addChannel} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.preferred_channels.map((channel, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {channel}
                      <button
                        type="button"
                        onClick={() => removeChannel(index)}
                        className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setCreateDialogOpen(false);
                setEditDialogOpen(false);
                setSelectedPersona(null);
                resetForm();
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.name.trim()}>
              {editDialogOpen ? 'Atualizar' : 'Criar'} Persona
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Personas;
  });

  // Separar por tabs
  const activePersonas = filteredPersonas;
  const topPerformers = filteredPersonas.filter(p => (p.campaigns || 0) > 5);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Personas</h1>
            <p className="text-muted-foreground">Carregando personas...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Personas</h1>
            <p className="text-destructive">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Personas</h1>
          <p className="text-muted-foreground">
            Defina e gerencie personas para criar conteúdo direcionado
          </p>
        </div>
        <Button 
          className="bg-gradient-primary"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Persona
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Personas</p>
                <p className="text-2xl font-bold text-foreground">{personas.length}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Personas Ativas</p>
                <p className="text-2xl font-bold text-foreground">{activePersonas.length}</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Top Performers</p>
                <p className="text-2xl font-bold text-foreground">{topPerformers.length}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Campanhas</p>
                <p className="text-2xl font-bold text-foreground">
                  {personas.length > 0 ? Math.round(personas.reduce((acc, p) => acc + (p.campaigns || 0), 0) / personas.length) : 0}
                </p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou profissão..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterAge} onValueChange={setFilterAge}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filtrar por idade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todas as idades</SelectItem>
            <SelectItem value="18-24">18-24 anos</SelectItem>
            <SelectItem value="25-34">25-34 anos</SelectItem>
            <SelectItem value="35-44">35-44 anos</SelectItem>
            <SelectItem value="45-54">45-54 anos</SelectItem>
            <SelectItem value="55-64">55-64 anos</SelectItem>
            <SelectItem value="65+">65+ anos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs and Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">Todas ({personas.length})</TabsTrigger>
          <TabsTrigger value="active">Ativas ({activePersonas.length})</TabsTrigger>
          <TabsTrigger value="top">Top Performers ({topPerformers.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <PersonasGrid 
            personas={filteredPersonas} 
            onEdit={handleEditPersona}
            onDelete={handleDeletePersona}
            onDuplicate={handleDuplicatePersona}
          />
        </TabsContent>

        <TabsContent value="active" className="space-y-6">
          <PersonasGrid 
            personas={activePersonas.filter(p => matchesFilters(p, searchTerm, filterAge))} 
            onEdit={handleEditPersona}
            onDelete={handleDeletePersona}
            onDuplicate={handleDuplicatePersona}
          />
        </TabsContent>

        <TabsContent value="top" className="space-y-6">
          <PersonasGrid 
            personas={topPerformers.filter(p => matchesFilters(p, searchTerm, filterAge))} 
            onEdit={handleEditPersona}
            onDelete={handleDeletePersona}
            onDuplicate={handleDuplicatePersona}
          />
        </TabsContent>
      </Tabs>

      {/* Create Persona Modal */}
      <CreatePersonaModal 
        open={showCreateModal}
        onOpenChange={(open) => {
          setShowCreateModal(open);
          if (!open) setEditingPersona(null);
        }}
        onCreatePersona={handleCreatePersona}
        editingPersona={editingPersona}
      />
    </div>
  );
};

// Helper function for filtering
const matchesFilters = (persona: any, searchTerm: string, filterAge: string) => {
  const matchesSearch = persona.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       (persona.occupation && persona.occupation.toLowerCase().includes(searchTerm.toLowerCase()));
  const matchesAge = filterAge === 'Todos' || persona.age_range === filterAge;
  
  return matchesSearch && matchesAge;
};

// Component for rendering personas grid
interface PersonasGridProps {
  personas: any[];
  onEdit: (persona: any) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

const PersonasGrid: React.FC<PersonasGridProps> = ({ personas, onEdit, onDelete, onDuplicate }) => {
  if (personas.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Nenhuma persona encontrada</h3>
        <p className="text-muted-foreground mb-6">
          Crie sua primeira persona ou ajuste os filtros de busca.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {personas.map((persona) => (
        <Card key={persona.id} className="group hover:shadow-lg transition-all duration-200">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg">{persona.name}</CardTitle>
                <CardDescription>{persona.occupation || 'Profissão não informada'}</CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(persona)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDuplicate(persona.id)}>
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicar
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-destructive"
                    onClick={() => onDelete(persona.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium mb-2">Demografia</h4>
                <div className="flex gap-2 text-sm text-muted-foreground">
                  <span>{persona.age_range || '25-45'} anos</span>
                  <span>•</span>
                  <span>{persona.location || 'Brasil'}</span>
                </div>
              </div>

              {persona.pain_points && persona.pain_points.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Principais Dores</h4>
                  <div className="flex flex-wrap gap-1">
                    {persona.pain_points.slice(0, 2).map((pain: string, i: number) => (
                      <Badge key={i} variant="destructive" className="text-xs">
                        {pain}
                      </Badge>
                    ))}
                    {persona.pain_points.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{persona.pain_points.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {persona.goals && persona.goals.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Objetivos</h4>
                  <div className="flex flex-wrap gap-1">
                    {persona.goals.slice(0, 2).map((goal: string, i: number) => (
                      <Badge key={i} variant="default" className="text-xs">
                        {goal}
                      </Badge>
                    ))}
                    {persona.goals.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{persona.goals.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {persona.preferred_channels && persona.preferred_channels.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Canais Preferidos</h4>
                  <div className="flex flex-wrap gap-1">
                    {persona.preferred_channels.map((channel: string, i: number) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {channel}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                <Target className="w-4 h-4 inline mr-1" />
                {persona.campaigns || 0} campanhas
              </div>
              <Button variant="outline" size="sm">
                Usar Persona
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Personas;
