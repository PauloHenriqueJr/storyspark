import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InviteMemberModal } from '@/components/modals/InviteMemberModal';
import { 
  Users, 
  UserPlus, 
  Search, 
  MoreVertical, 
  Crown,
  Shield,
  Edit3,
  Mail,
  Calendar,
  Activity
} from 'lucide-react';

const Team = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  const teamMembers = [
    {
      id: 1,
      name: 'Ana Silva',
      email: 'ana.silva@empresa.com',
      role: 'Admin',
      department: 'Marketing',
      avatar: '/placeholder.svg',
      status: 'Ativo',
      lastAccess: '2 horas atrás',
      joinDate: '15 Jan 2024',
      permissions: ['Campanhas', 'Analytics', 'Equipe'],
      activity: 'Alto'
    },
    {
      id: 2,
      name: 'Carlos Santos',
      email: 'carlos.santos@empresa.com',
      role: 'Editor',
      department: 'Marketing',
      avatar: '/placeholder.svg',
      status: 'Ativo',
      lastAccess: '1 dia atrás',
      joinDate: '22 Jan 2024',
      permissions: ['Campanhas', 'Templates'],
      activity: 'Médio'
    },
    {
      id: 3,
      name: 'Beatriz Costa',
      email: 'beatriz.costa@empresa.com',
      role: 'Viewer',
      department: 'Vendas',
      avatar: '/placeholder.svg',
      status: 'Ativo',
      lastAccess: '3 horas atrás',
      joinDate: '10 Fev 2024',
      permissions: ['Analytics'],
      activity: 'Baixo'
    },
    {
      id: 4,
      name: 'Diego Oliveira',
      email: 'diego.oliveira@empresa.com',
      role: 'Editor',
      department: 'Marketing',
      avatar: '/placeholder.svg',
      status: 'Inativo',
      lastAccess: '7 dias atrás',
      joinDate: '05 Mar 2024',
      permissions: ['Campanhas'],
      activity: 'Baixo'
    }
  ];

  const invitations = [
    {
      id: 1,
      email: 'novo.usuario@empresa.com',
      role: 'Editor',
      department: 'Marketing',
      sentDate: '2 dias atrás',
      status: 'Pendente'
    },
    {
      id: 2,
      email: 'colaborador@empresa.com',
      role: 'Viewer',
      department: 'Vendas',
      sentDate: '5 dias atrás',
      status: 'Expirado'
    }
  ];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Admin': return <Crown className="w-4 h-4" />;
      case 'Editor': return <Edit3 className="w-4 h-4" />;
      case 'Viewer': return <Shield className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'destructive';
      case 'Editor': return 'default';
      case 'Viewer': return 'secondary';
      default: return 'secondary';
    }
  };

  const getActivityColor = (activity: string) => {
    switch (activity) {
      case 'Alto': return 'text-success';
      case 'Médio': return 'text-warning';
      case 'Baixo': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Equipe</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Gerencie membros da equipe e suas permissões
          </p>
        </div>
        <Button 
          className="bg-gradient-primary hover:opacity-90 w-full sm:w-auto"
          onClick={() => setInviteModalOpen(true)}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Convidar Membro</span>
          <span className="sm:hidden">Convidar</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Membros</p>
                <p className="text-2xl font-bold text-foreground">{teamMembers.length}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ativos</p>
                <p className="text-2xl font-bold text-foreground">
                  {teamMembers.filter(m => m.status === 'Ativo').length}
                </p>
              </div>
              <Activity className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Convites</p>
                <p className="text-2xl font-bold text-foreground">{invitations.length}</p>
              </div>
              <Mail className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Departamentos</p>
                <p className="text-2xl font-bold text-foreground">3</p>
              </div>
              <div className="w-8 h-8 bg-purple-500/10 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Management Tabs */}
      <Tabs defaultValue="members" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="members">Membros</TabsTrigger>
          <TabsTrigger value="invitations">Convites</TabsTrigger>
          <TabsTrigger value="roles">Cargos & Permissões</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="mt-6">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar membros..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Members List */}
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <Card key={member.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-foreground">{member.name}</h3>
                          <Badge variant={getRoleColor(member.role) as "default" | "destructive" | "outline" | "secondary"}>
                            <div className="flex items-center gap-1">
                              {getRoleIcon(member.role)}
                              {member.role}
                            </div>
                          </Badge>
                          <Badge variant={member.status === 'Ativo' ? 'default' : 'secondary'}>
                            {member.status}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">{member.email}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{member.department}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Entrou em {member.joinDate}
                          </span>
                          <span>•</span>
                          <span>Último acesso: {member.lastAccess}</span>
                          <span>•</span>
                          <span className={getActivityColor(member.activity)}>
                            Atividade: {member.activity}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Permissões
                        </p>
                        <div className="flex gap-1">
                          {member.permissions.slice(0, 2).map((permission, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {permission}
                            </Badge>
                          ))}
                          {member.permissions.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{member.permissions.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="invitations" className="mt-6">
          <div className="space-y-4">
            {invitations.map((invitation) => (
              <Card key={invitation.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                        <Mail className="w-6 h-6 text-muted-foreground" />
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-foreground">{invitation.email}</h3>
                          <Badge variant={getRoleColor(invitation.role) as "default" | "destructive" | "outline" | "secondary"}>
                            {invitation.role}
                          </Badge>
                          <Badge variant={invitation.status === 'Pendente' ? 'default' : 'destructive'}>
                            {invitation.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{invitation.department}</span>
                          <span>•</span>
                          <span>Enviado {invitation.sentDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Reenviar
                      </Button>
                      <Button variant="outline" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="roles" className="mt-6">
          <div className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-red-500" />
                    Admin
                  </CardTitle>
                  <CardDescription>
                    Acesso total ao sistema, incluindo gerenciamento de equipe e configurações
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {['Campanhas', 'Analytics', 'Equipe', 'Integrações', 'Faturamento', 'Configurações'].map((perm) => (
                      <Badge key={perm} variant="outline">
                        {perm}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-primary" />
                    Editor
                  </CardTitle>
                  <CardDescription>
                    Pode criar e editar campanhas, templates e gerenciar conteúdo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {['Campanhas', 'Templates', 'Personas', 'Analytics (visualizar)'].map((perm) => (
                      <Badge key={perm} variant="outline">
                        {perm}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-muted-foreground" />
                    Viewer
                  </CardTitle>
                  <CardDescription>
                    Acesso somente leitura para relatórios e analytics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {['Analytics (visualizar)', 'Relatórios'].map((perm) => (
                      <Badge key={perm} variant="outline">
                        {perm}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal */}
      <InviteMemberModal 
        open={inviteModalOpen}
        onOpenChange={setInviteModalOpen}
      />
    </div>
  );
};

export { Team as Component };
