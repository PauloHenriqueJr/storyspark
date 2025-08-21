import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Users, Target, Search, Filter, Plus, MoreVertical, Edit, Trash2, Copy, Eye } from 'lucide-react';
import CreatePersonaModal from '@/components/modals/CreatePersonaModal';

const personas = [
  {
    id: 1,
    name: 'Ana Executiva',
    description: 'Profissional ambiciosa que busca crescimento na carreira',
    segment: 'B2B',
    ageRange: '28-35',
    location: 'São Paulo, SP',
    painPoints: ['Falta de tempo', 'Pressão por resultados'],
    goals: ['Crescimento profissional', 'Eficiência em campanhas'],
    channels: ['LinkedIn', 'Instagram'],
    campaigns: 12
  },
  {
    id: 2,
    name: 'João Empreendedor',
    description: 'Fundador de startup tech focado em crescimento',
    segment: 'Startups',
    ageRange: '25-35',
    location: 'Rio de Janeiro, RJ',
    painPoints: ['Recursos limitados', 'Competição'],
    goals: ['Crescimento rápido', 'Automação'],
    channels: ['Twitter', 'LinkedIn'],
    campaigns: 8
  },
  {
    id: 3,
    name: 'Maria Consultora',
    description: 'Consultora experiente em transformação digital',
    segment: 'Consultoria',
    ageRange: '35-45',
    location: 'Belo Horizonte, MG',
    painPoints: ['Credibilidade online', 'Geração de leads'],
    goals: ['Autoridade no mercado', 'Pipeline de clientes'],
    channels: ['LinkedIn', 'Blog'],
    campaigns: 6
  }
];

const Personas = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSegment, setFilterSegment] = useState('Todos');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [personasList, setPersonasList] = useState(personas);
  const [editingPersona, setEditingPersona] = useState(null);

  const handleCreatePersona = (newPersona: any) => {
    if (editingPersona) {
      setPersonasList(prev => prev.map(p => p.id === editingPersona.id ? newPersona : p));
    } else {
      setPersonasList(prev => [newPersona, ...prev]);
    }
  };

  const handleEditPersona = (persona: any) => {
    setEditingPersona(persona);
    setShowCreateModal(true);
  };

  const filteredPersonas = personasList.filter(persona =>
    persona.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterSegment === 'Todos' || persona.segment === filterSegment)
  );

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
                <p className="text-2xl font-bold text-foreground">{personasList.length}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Campanhas Ativas</p>
                <p className="text-2xl font-bold text-foreground">
                  {personasList.reduce((acc, p) => acc + p.campaigns, 0)}
                </p>
              </div>
              <Target className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Segmentos</p>
                <p className="text-2xl font-bold text-foreground">
                  {new Set(personasList.map(p => p.segment)).size}
                </p>
              </div>
              <Filter className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Mais Usada</p>
                <p className="text-2xl font-bold text-foreground">
                  {Math.max(...personasList.map(p => p.campaigns))}
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
            <SelectValue placeholder="Filtrar por segmento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos os segmentos</SelectItem>
            <SelectItem value="B2B">B2B</SelectItem>
            <SelectItem value="Startups">Startups</SelectItem>
            <SelectItem value="Consultoria">Consultoria</SelectItem>
            <SelectItem value="E-commerce">E-commerce</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Personas Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPersonas.map((persona) => (
          <Card key={persona.id} className="hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                    {persona.name.charAt(0)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{persona.name}</CardTitle>
                    <Badge variant="outline">{persona.segment}</Badge>
                  </div>
                </div>
                
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
                    <DropdownMenuItem onClick={() => handleEditPersona(persona)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
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
            </CardHeader>

            <CardContent className="space-y-4">
              <CardDescription>{persona.description}</CardDescription>

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium mb-2">Demografia</h4>
                  <div className="flex gap-2 text-sm text-muted-foreground">
                    <span>{persona.ageRange} anos</span>
                    <span>•</span>
                    <span>{persona.location}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Principais Dores</h4>
                  <div className="flex flex-wrap gap-1">
                    {persona.painPoints.slice(0, 2).map((pain, i) => (
                      <Badge key={i} variant="destructive" className="text-xs">
                        {pain}
                      </Badge>
                    ))}
                    {persona.painPoints.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{persona.painPoints.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Objetivos</h4>
                  <div className="flex flex-wrap gap-1">
                    {persona.goals.slice(0, 2).map((goal, i) => (
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

                <div>
                  <h4 className="text-sm font-medium mb-2">Canais Preferidos</h4>
                  <div className="flex flex-wrap gap-1">
                    {persona.channels.map((channel, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {channel}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  <Target className="w-4 h-4 inline mr-1" />
                  {persona.campaigns} campanhas
                </div>
                <Button variant="outline" size="sm">
                  Usar Persona
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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

export default Personas;