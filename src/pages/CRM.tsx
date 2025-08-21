import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Plus, Search, Users, Phone, Mail, Calendar, Target, TrendingUp, DollarSign, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CreateLeadModal from '@/components/modals/CreateLeadModal';

const CRM: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const { toast } = useToast();
  
  const [leads] = useState([
    {
      id: 1,
      name: 'João Silva',
      email: 'joao.silva@email.com',
      phone: '+55 11 99999-0001',
      company: 'Tech Solutions',
      position: 'CEO',
      status: 'qualificado',
      source: 'linkedin',
      value: 25000,
      lastContact: '2024-01-19',
      nextAction: 'Ligar hoje às 14h',
      tags: ['hot-lead', 'saas', 'decisor']
    },
    {
      id: 2,
      name: 'Maria Santos',
      email: 'maria@agencia.com',
      phone: '+55 11 99999-0002',
      company: 'Agência Digital',
      position: 'Diretora Marketing',
      status: 'negociacao',
      source: 'site',
      value: 15000,
      lastContact: '2024-01-18',
      nextAction: 'Enviar proposta',
      tags: ['agencia', 'marketing', 'warm-lead']
    },
    {
      id: 3,
      name: 'Pedro Costa',
      email: 'pedro.costa@startup.com',
      phone: '+55 11 99999-0003',
      company: 'StartupX',
      position: 'Founder',
      status: 'novo',
      source: 'indicacao',
      value: 8000,
      lastContact: '2024-01-17',
      nextAction: 'Primeira ligação',
      tags: ['startup', 'founder', 'new']
    },
    {
      id: 4,
      name: 'Ana Oliveira',
      email: 'ana@consultoria.com',
      phone: '+55 11 99999-0004',
      company: 'Consultoria Pro',
      position: 'Sócia',
      status: 'cliente',
      source: 'evento',
      value: 45000,
      lastContact: '2024-01-15',
      nextAction: 'Reunião mensal',
      tags: ['cliente', 'consultoria', 'high-value']
    },
  ]);

  const handleCreateLead = () => {
    setShowCreateModal(true);
    toast({
      title: "Criando novo lead",
      description: "Abrindo formulário de criação...",
    });
  };

  const handleContact = (lead: any, type: string) => {
    setSelectedLead(lead);
    toast({
      title: `${type} iniciado`,
      description: `Iniciando ${type.toLowerCase()} com ${lead.name}`,
    });
  };

  const handleSchedule = (lead: any) => {
    navigate('/calendar');
    toast({
      title: "Redirecionando para calendário",
      description: `Abrindo calendário para agendar com ${lead.name}`,
    });
  };

  const handleViewProfile = (lead: any) => {
    setSelectedLead(lead);
    setShowContactModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'novo': return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
      case 'qualificado': return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 'negociacao': return 'bg-orange-500/10 text-orange-700 dark:text-orange-400';
      case 'cliente': return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'perdido': return 'bg-red-500/10 text-red-700 dark:text-red-400';
      default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'linkedin': return 'bg-blue-600/10 text-blue-700 dark:text-blue-400';
      case 'site': return 'bg-green-600/10 text-green-700 dark:text-green-400';
      case 'indicacao': return 'bg-purple-600/10 text-purple-700 dark:text-purple-400';
      case 'evento': return 'bg-orange-600/10 text-orange-700 dark:text-orange-400';
      default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
    }
  };

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">CRM</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Gerencie seus leads, clientes e oportunidades de negócio
          </p>
        </div>
        <Button className="gap-2 w-full sm:w-auto" onClick={handleCreateLead}>
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Novo Lead</span>
          <span className="sm:hidden">Novo</span>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar por nome, empresa, email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">
              +23 este mês
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Negociação</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34</div>
            <p className="text-xs text-muted-foreground">
              +8% vs mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 2.4M</div>
            <p className="text-xs text-muted-foreground">
              +15% vs mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18.5%</div>
            <p className="text-xs text-muted-foreground">
              +2.3% vs mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="leads" className="space-y-4">
        <TabsList>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="space-y-4">
          <div className="grid gap-4">
            {filteredLeads.map((lead) => (
              <Card key={lead.id} className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{lead.name}</CardTitle>
                        <Badge className={getStatusColor(lead.status)}>
                          {lead.status}
                        </Badge>
                        <Badge className={getSourceColor(lead.source)}>
                          {lead.source}
                        </Badge>
                      </div>
                      <CardDescription>
                        {lead.position} na {lead.company}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">R$ {lead.value.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Valor potencial</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Contact Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{lead.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{lead.phone}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {lead.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Last Contact & Next Action */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Último contato: </span>
                        <span>{new Date(lead.lastContact).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Próxima ação: </span>
                        <span className="font-medium">{lead.nextAction}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleContact(lead, 'Ligação')}>
                        <Phone className="h-4 w-4 mr-1" />
                        Ligar
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleContact(lead, 'Email')}>
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleSchedule(lead)}>
                        <Calendar className="h-4 w-4 mr-1" />
                        Agendar
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleViewProfile(lead)}>
                        Ver Perfil
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { stage: 'Novo', count: 45, value: 450000, color: 'blue' },
              { stage: 'Qualificado', count: 23, value: 690000, color: 'yellow' },
              { stage: 'Negociação', count: 12, value: 840000, color: 'orange' },
              { stage: 'Fechamento', count: 8, value: 480000, color: 'green' }
            ].map((stage) => (
              <Card key={stage.stage}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{stage.stage}</CardTitle>
                    <Badge variant="outline">{stage.count}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold">
                      R$ {(stage.value / 1000).toFixed(0)}K
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Média: R$ {(stage.value / stage.count / 1000).toFixed(0)}K por lead
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        toast({
                          title: "Filtro aplicado",
                          description: `Visualizando leads no estágio: ${stage.stage}`,
                        });
                      }}
                    >
                      Ver Leads
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Funil de Vendas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border rounded-lg bg-muted/5">
                <p className="text-muted-foreground">Gráfico de funil será implementado</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <div className="grid gap-4">
            {leads.filter(lead => lead.status === 'cliente').map((client) => (
              <Card key={client.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{client.name}</CardTitle>
                      <CardDescription>
                        {client.position} na {client.company}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        R$ {client.value.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Valor do contrato</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 border rounded-lg">
                        <div className="font-medium">12 meses</div>
                        <div className="text-xs text-muted-foreground">Tempo de relacionamento</div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="font-medium">R$ 135K</div>
                        <div className="text-xs text-muted-foreground">Receita total</div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="font-medium">98%</div>
                        <div className="text-xs text-muted-foreground">Satisfação</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "Histórico do cliente",
                            description: `Visualizando histórico completo de ${client.name}`,
                          });
                        }}
                      >
                        Ver Histórico
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate('/billing')}
                      >
                        Renovar Contrato
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate('/campaigns')}
                      >
                        Upsell
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Conversão por Fonte</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>LinkedIn</span>
                    <span className="font-medium">24.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Indicação</span>
                    <span className="font-medium">45.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Site</span>
                    <span className="font-medium">12.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Evento</span>
                    <span className="font-medium">18.7%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Tempo Médio por Stage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Qualificação</span>
                    <span className="font-medium">3.5 dias</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Negociação</span>
                    <span className="font-medium">12.3 dias</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fechamento</span>
                    <span className="font-medium">8.7 dias</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Ciclo Total</span>
                    <span>24.5 dias</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Evolução do Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border rounded-lg bg-muted/5">
                <p className="text-muted-foreground">Gráfico de evolução será implementado</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Lead Modal */}
      <CreateLeadModal 
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onCreateLead={(newLead) => {
          console.log('Novo lead criado:', newLead);
          // Aqui você adicionaria o lead à lista ou enviaria para API
        }}
      />
    </div>
  );
};

export default CRM;