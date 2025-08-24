import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Target, Search, Plus, MoreHorizontal, Edit, Trash2, Copy, Eye, Filter, Loader2, BarChart3, Heart } from 'lucide-react';
import CreatePersonaModal from '@/components/modals/CreatePersonaModal';
import { usePersonas } from '@/hooks/usePersonas';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';
import { Label } from 'recharts';

type CreatePersonaInput = Database['public']['Tables']['target_personas']['Insert'];

const Personas = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAge, setFilterAge] = useState('Todos');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPersona, setEditingPersona] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('all');

  const { personas, loading, error, createPersona, updatePersona, deletePersona, duplicatePersona } = usePersonas();
  const { toast } = useToast();

  const handleCreatePersona = async (newPersona: Omit<CreatePersonaInput, 'workspace_id' | 'user_id'>) => {
    try {
      if (editingPersona) {
        await updatePersona(editingPersona.id, newPersona);
        toast({
          title: 'Sucesso!',
          description: 'Persona atualizada com sucesso.',
        });
      } else {
        await createPersona(newPersona);
        toast({
          title: 'Sucesso!',
          description: 'Nova persona criada com sucesso.',
        });
      }
      setShowCreateModal(false);
      setEditingPersona(null);
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
    setEditingPersona(persona);
    setShowCreateModal(true);
  };

  const handleDeletePersona = async (personaId: string) => {
    try {
      await deletePersona(personaId);
      toast({
        title: 'Persona excluída',
        description: 'Persona foi excluída com sucesso.',
      });
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
    } catch (error) {
      console.error('Erro ao duplicar persona:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao duplicar persona. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const handleUsePersona = (persona: any) => {
    // Por enquanto, vamos mostrar um toast com opções de onde usar
    toast({
      title: "Usar Persona: " + persona.name,
      description: "Em breve: escolha onde usar esta persona (Composer, Campanhas, Social Scheduler).",
    });
    
    // TODO: Implementar modal ou dropdown com opções:
    // - Composer (criar conteúdo)
    // - Campanhas (criar nova campanha)
    // - Social Scheduler (agendar posts)
    // - Relatórios (analisar performance)
  };

  // Filtros
  const filteredPersonas = personas.filter(persona => {
    const matchesSearch = persona.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (persona.occupation && persona.occupation.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesAge = filterAge === 'Todos' || persona.age_range === filterAge;
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'active' && (persona.usage_count || 0) > 0) ||
                      (activeTab === 'inactive' && (persona.usage_count || 0) === 0);
    
    return matchesSearch && matchesAge && matchesTab;
  });

  const activePersonas = personas.filter(p => (p.usage_count || 0) > 0);
  const topPerformers = personas.filter(p => (p.usage_count || 0) > 5);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Carregando personas...</p>
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
              <Users className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Erro ao carregar personas</h3>
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
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            Personas
          </h1>
          <p className="text-muted-foreground">
            Gerencie e organize suas personas de público-alvo para campanhas mais eficazes.
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Criar Persona
        </Button>
      </div>

      {/* Card explicativo para iniciantes */}
      <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/50 dark:border-blue-800">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg text-blue-800 dark:text-blue-200">
              O que é uma Persona?
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
            Uma persona é um <strong>perfil detalhado do seu cliente ideal</strong>. É uma representação semi-fictícia 
            baseada em dados reais que ajuda a entender <strong>quem</strong> é seu público e <strong>como</strong> se comunicar com ele.
          </p>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Quando é usada:
              </h4>
              <ul className="space-y-2 text-blue-700 dark:text-blue-300">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1 text-xs">•</span>
                  <span><strong>Criação de Conteúdo:</strong> IA adapta linguagem e tom para cada persona</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1 text-xs">•</span>
                  <span><strong>Campanhas Direcionadas:</strong> Segmenta público para maior eficácia</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1 text-xs">•</span>
                  <span><strong>Estratégia de Canais:</strong> Escolhe onde e quando comunicar</span>
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
                  <span><strong>Comunicação Eficaz:</strong> Mensagens que realmente conectam</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1 text-xs">•</span>
                  <span><strong>ROI Maior:</strong> Campanhas mais precisas e rentáveis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1 text-xs">•</span>
                  <span><strong>IA Personalizada:</strong> Conteúdo automático adaptado ao perfil</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{personas.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ativas</p>
                <p className="text-2xl font-bold">{activePersonas.length}</p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Top Performers</p>
                <p className="text-2xl font-bold">{topPerformers.length}</p>
              </div>
              <Eye className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Uso Médio</p>
                <p className="text-2xl font-bold">
                  {personas.length > 0 ? Math.round(personas.reduce((acc, p) => acc + (p.usage_count || 0), 0) / personas.length) : 0}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-500" />
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
        <Select value={filterAge} onValueChange={setFilterAge}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por idade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todas as idades</SelectItem>
            <SelectItem value="18-25 anos">18-25 anos</SelectItem>
            <SelectItem value="26-35 anos">26-35 anos</SelectItem>
            <SelectItem value="36-45 anos">36-45 anos</SelectItem>
            <SelectItem value="46-55 anos">46-55 anos</SelectItem>
            <SelectItem value="56+ anos">56+ anos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">Todas ({personas.length})</TabsTrigger>
          <TabsTrigger value="active">Ativas ({activePersonas.length})</TabsTrigger>
          <TabsTrigger value="inactive">Inativas ({personas.length - activePersonas.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <PersonasGrid 
            personas={filteredPersonas}
            onEdit={handleEditPersona}
            onDelete={handleDeletePersona}
            onDuplicate={handleDuplicatePersona}
            onUse={handleUsePersona}
          />
        </TabsContent>

        <TabsContent value="active" className="space-y-6">
          <PersonasGrid 
            personas={filteredPersonas.filter(p => (p.usage_count || 0) > 0)}
            onEdit={handleEditPersona}
            onDelete={handleDeletePersona}
            onDuplicate={handleDuplicatePersona}
            onUse={handleUsePersona}
          />
        </TabsContent>

        <TabsContent value="inactive" className="space-y-6">
          <PersonasGrid 
            personas={filteredPersonas.filter(p => (p.usage_count || 0) === 0)}
            onEdit={handleEditPersona}
            onDelete={handleDeletePersona}
            onDuplicate={handleDuplicatePersona}
            onUse={handleUsePersona}
          />
        </TabsContent>
      </Tabs>

      {/* Modal */}
      <CreatePersonaModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSubmit={handleCreatePersona}
        initialData={editingPersona}
        mode={editingPersona ? 'edit' : 'create'}
      />
    </div>
  );
};

// Helper component para o grid
const matchesFilters = (persona: any, searchTerm: string, filterAge: string) => {
  const matchesSearch = persona.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       (persona.occupation && persona.occupation.toLowerCase().includes(searchTerm.toLowerCase()));
  const matchesAge = filterAge === 'Todos' || persona.age_range === filterAge;
  return matchesSearch && matchesAge;
};

interface PersonasGridProps {
  personas: any[];
  onEdit: (persona: any) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onUse: (persona: any) => void;
}

const PersonasGrid: React.FC<PersonasGridProps> = ({ personas, onEdit, onDelete, onDuplicate, onUse }) => {
  if (personas.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-6 h-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Nenhuma persona encontrada</h3>
        <p className="text-muted-foreground">
          Crie sua primeira persona para começar a segmentar seu público.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {personas.map((persona) => (
        <Card key={persona.id} className="relative group">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg mb-2">{persona.name}</CardTitle>
                <div className="flex flex-wrap gap-1 mb-2">
                  {persona.occupation && (
                    <Badge variant="outline">{persona.occupation}</Badge>
                  )}
                  {persona.age_range && (
                    <Badge variant="secondary">{persona.age_range}</Badge>
                  )}
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(persona)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDuplicate(persona.id)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => onDelete(persona.id)}
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
              {persona.location && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Localização:</p>
                  <p className="text-sm">{persona.location}</p>
                </div>
              )}
              
              {persona.pain_points && persona.pain_points.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Principais Dores:</p>
                  <div className="flex flex-wrap gap-1">
                    {persona.pain_points.slice(0, 2).map((pain: string, index: number) => (
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
                    {persona.goals.slice(0, 2).map((goal: string, index: number) => (
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
                  <Target className="w-4 h-4 inline mr-1 text-primary" />
                  {persona.usage_count || 0} campanhas
                </div>
                <Button 
                  className="bg-gradient-primary hover:opacity-90 text-white" 
                  size="sm"
                  onClick={() => onUse(persona)}
                >
                  <Users className="w-4 h-4 mr-1" />
                  Usar Persona
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Personas;
