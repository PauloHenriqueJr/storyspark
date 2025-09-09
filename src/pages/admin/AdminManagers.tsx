import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  Plus,
  MoreHorizontal,
  Shield,
  Users,
  Building2,
  MapPin,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';

const AdminManagers = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const managers = [
    {
      id: 1,
      name: 'Ricardo Ferreira',
      email: 'ricardo@storyspark.com',
      region: 'Sudeste',
      companies: 23,
      users: 156,
      status: 'active',
      permissions: ['user_management', 'company_approval', 'support_level_2'],
      lastActivity: '2024-01-15 14:30',
      createdAt: '2023-03-15'
    },
    {
      id: 2,
      name: 'Patrícia Mendes',
      email: 'patricia@storyspark.com',
      region: 'Sul',
      companies: 18,
      users: 89,
      status: 'active',
      permissions: ['user_management', 'company_approval'],
      lastActivity: '2024-01-15 09:15',
      createdAt: '2023-05-22'
    },
    {
      id: 3,
      name: 'Eduardo Campos',
      email: 'eduardo@storyspark.com',
      region: 'Nordeste',
      companies: 31,
      users: 201,
      status: 'active',
      permissions: ['user_management', 'company_approval', 'support_level_2', 'billing_management'],
      lastActivity: '2024-01-14 16:45',
      createdAt: '2023-02-10'
    },
    {
      id: 4,
      name: 'Camila Rodrigues',
      email: 'camila@storyspark.com',
      region: 'Norte',
      companies: 12,
      users: 67,
      status: 'inactive',
      permissions: ['user_management'],
      lastActivity: '2024-01-10 11:20',
      createdAt: '2023-08-18'
    },
    {
      id: 5,
      name: 'Felipe Santos',
      email: 'felipe@storyspark.com',
      region: 'Centro-Oeste',
      companies: 15,
      users: 92,
      status: 'active',
      permissions: ['user_management', 'company_approval', 'support_level_2'],
      lastActivity: '2024-01-15 13:10',
      createdAt: '2023-07-05'
    }
  ];

  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? <Badge className="bg-green-100 text-green-800">Ativo</Badge>
      : <Badge className="bg-gray-100 text-gray-800">Inativo</Badge>;
  };

  const getPermissionBadges = (permissions: string[]) => {
    const permissionLabels = {
      'user_management': 'Usuários',
      'company_approval': 'Empresas',
      'support_level_2': 'Suporte L2',
      'billing_management': 'Faturamento'
    };

    return permissions.map(perm => (
      <Badge key={perm} variant="outline" className="text-xs">
        {permissionLabels[perm as keyof typeof permissionLabels] || perm}
      </Badge>
    ));
  };

  const filteredManagers = managers.filter(manager =>
    manager.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manager.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manager.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: managers.length,
    active: managers.filter(m => m.status === 'active').length,
    totalCompanies: managers.reduce((sum, m) => sum + m.companies, 0),
    totalUsers: managers.reduce((sum, m) => sum + m.users, 0)
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Gestão de Gerentes</h1>
          <p className="text-muted-foreground">Administradores regionais da plataforma</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Novo Gerente</span>
          <span className="sm:hidden">Novo</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <div>
                <div className="text-2xl font-bold text-foreground">{stats.total}</div>
                <p className="text-sm text-muted-foreground">Total de Gerentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                <p className="text-sm text-muted-foreground">Gerentes Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.totalCompanies}</div>
                <p className="text-sm text-muted-foreground">Empresas Gerenciadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-purple-600">{stats.totalUsers}</div>
                <p className="text-sm text-muted-foreground">Usuários Supervisionados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lista de Gerentes Regionais</CardTitle>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                placeholder="Buscar gerentes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gerente</TableHead>
                <TableHead>Região</TableHead>
                <TableHead>Empresas</TableHead>
                <TableHead>Usuários</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Permissões</TableHead>
                <TableHead>Última Atividade</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredManagers.map((manager) => (
                <TableRow key={manager.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {manager.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{manager.name}</p>
                        <p className="text-sm text-muted-foreground">{manager.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{manager.region}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <div className="font-medium">{manager.companies}</div>
                      <div className="text-xs text-muted-foreground">empresas</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <div className="font-medium">{manager.users}</div>
                      <div className="text-xs text-muted-foreground">usuários</div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(manager.status)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {getPermissionBadges(manager.permissions)}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {manager.lastActivity}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Shield className="w-4 h-4 mr-2" />
                          Permissões
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          {manager.status === 'active' ? 'Desativar' : 'Ativar'}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remover
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminManagers;export { AdminManagers as Component };
