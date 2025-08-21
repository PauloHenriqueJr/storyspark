
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Users, Target, Search, Filter, Plus, MoreVertical, Edit, Trash2, Copy, Eye } from 'lucide-react';
import CreatePersonaModal from '@/components/modals/CreatePersonaModal';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/AuthProvider';
import { useWorkspace } from '@/hooks/useWorkspace';

interface Persona {
  id: string;
  name: string;
  occupation: string;
  age_range: string;
  location: string;
  pain_points: string[];
  goals: string[];
  interests: string[];
  preferred_channels: string[];
  usage_count: number;
  created_at: string;
}

const Personas = () => {
  const { user } = useAuth();
  const { workspace } = useWorkspace();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSegment, setFilterSegment] = useState('Todos');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPersona, setEditingPersona] = useState(null);

  useEffect(() => {
    const fetchPersonas = async () => {
      if (!workspace) return;

      try {
        const { data, error } = await supabase
          .from('target_personas')
          .select('*')
          .eq('workspace_id', workspace.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching personas:', error);
        } else {
          setPersonas(data || []);
        }
      } catch (error) {
        console.error('Error in personas fetch:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonas();
  }, [workspace]);

  const handleCreatePersona = async (newPersona: any) => {
    if (!workspace || !user) return;

    try {
      const { data, error } = await supabase
        .from('target_personas')
        .insert({
          ...newPersona,
          workspace_id: workspace.id,
          user_id: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating persona:', error);
      } else {
        if (editingPersona) {
          setPersonas(prev => prev.map(p => p.id === editingPersona.id ? data : p));
        } else {
          setPersonas(prev => [data, ...prev]);
        }
      }
    } catch (error) {
      console.error('Error in persona creation:', error);
    }
  };

  const handleEditPersona = (persona: any) => {
    setEditingPersona(persona);
    setShowCreateModal(true);
  };

  const filteredPersonas = personas.filter(persona => {
    const matchesSearch = persona.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (persona.occupation && persona.occupation.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSegment = filterSegment === 'Todos' || 
                          (persona.occupation && persona.occupation.toLowerCase().includes(filterSegment.toLowerCase()));
    return matchesSearch && matchesSegment;
  });

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Personas</h1>
            <p className="text-muted-foreground">Carregando personas...</p>
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
                <p className="text-sm font-medium text-muted-foreground">Campanhas Ativas</p>
                <p className="text-2xl font-bold text-foreground">
                  {personas.reduce((acc, p) => acc + p.usage_count, 0)}
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
                <p className="text-sm font-medium text-muted-foreground">Ocupações</p>
                <p className="text-2xl font-bold text-foreground">
                  {new Set(personas.map(p => p.occupation).filter(Boolean)).size}
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
                  {personas.length > 0 ? Math.max(...personas.map(p => p.usage_count)) : 0}
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
                    <Badge variant="outline">{persona.occupation || 'Profissional'}</Badge>
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
                      {persona.pain_points.slice(0, 2).map((pain, i) => (
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
                )}

                {persona.preferred_channels && persona.preferred_channels.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Canais Preferidos</h4>
                    <div className="flex flex-wrap gap-1">
                      {persona.preferred_channels.map((channel, i) => (
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
                  {persona.usage_count} campanhas
                </div>
                <Button variant="outline" size="sm">
                  Usar Persona
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPersonas.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhuma persona encontrada</h3>
          <p className="text-muted-foreground mb-6">
            Crie sua primeira persona ou ajuste os filtros de busca.
          </p>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Criar Primeira Persona
          </Button>
        </div>
      )}

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
