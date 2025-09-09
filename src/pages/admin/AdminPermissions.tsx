import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Users, 
  Shield, 
  UserCog, 
  Crown, 
  Key, 
  Settings, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Database,
  FileText,
  BarChart3,
  Zap,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

const AdminPermissions = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false);

  // Roles do sistema - separando roles administrativos de clientes
  const roles = [
    {
      id: 1,
      name: 'Super Admin',
      description: 'Acesso total ao sistema (apenas para administradores)',
      userCount: 2,
      color: 'bg-red-500',
      permissions: ['all']
    },
    {
      id: 2,
      name: 'Admin',
      description: 'Administrador da plataforma (apenas para administradores)',
      userCount: 3,
      color: 'bg-orange-500',
      permissions: ['users.read', 'users.write', 'campaigns.read', 'campaigns.write', 'analytics.read']
    },
    {
      id: 3,
      name: 'User',
      description: 'Cliente padrão da plataforma',
      userCount: 1247,
      color: 'bg-blue-500',
      permissions: ['campaigns.read', 'campaigns.write', 'templates.read', 'templates.write']
    }
  ];

  // Exemplos de clientes (role 'User') e alguns administradores
  const usersWithRoles = [
    {
      id: 1,
      name: 'Paulo Jack',
      email: 'paulojack2011@gmail.com',
      avatar: '',
      role: 'Super Admin',
      status: 'active',
      lastLogin: '2024-01-20 14:30'
    },
    {
      id: 2,
      name: 'Ana Silva',
      email: 'ana@techcorp.com',
      avatar: '',
      role: 'User',
      status: 'active',
      lastLogin: '2024-01-20 09:15'
    },
    {
      id: 3,
      name: 'Carlos Santos',
      email: 'carlos@marketpro.com',
      avatar: '',
      role: 'User',
      status: 'active',
      lastLogin: '2024-01-19 16:45'
    },
    {
      id: 4,
      name: 'Maria Oliveira',
      email: 'maria@creative.com',
      avatar: '',
      role: 'User',
      status: 'inactive',
      lastLogin: '2024-01-18 11:20'
    }
  ];

  // Permission categories and their permissions
  const permissionCategories = [
    {
      category: 'Clientes',
      icon: Users,
      permissions: [
        { id: 'users.read', name: 'Visualizar clientes', description: 'Ver lista e detalhes de clientes' },
        { id: 'users.write', name: 'Gerenciar clientes', description: 'Criar, editar e excluir clientes' },
        { id: 'users.roles', name: 'Gerenciar roles', description: 'Atribuir e remover roles de clientes' }
      ]
    },
    {
      category: 'Campanhas',
      icon: FileText,
      permissions: [
        { id: 'campaigns.read', name: 'Visualizar campanhas', description: 'Ver campanhas e detalhes' },
        { id: 'campaigns.write', name: 'Gerenciar campanhas', description: 'Criar, editar e excluir campanhas' },
        { id: 'campaigns.publish', name: 'Publicar campanhas', description: 'Ativar e desativar campanhas' }
      ]
    },
    {
      category: 'Analytics',
      icon: BarChart3,
      permissions: [
        { id: 'analytics.read', name: 'Visualizar métricas', description: 'Ver dashboards e relatórios' },
        { id: 'analytics.export', name: 'Exportar dados', description: 'Baixar relatórios e dados' },
        { id: 'analytics.advanced', name: 'Analytics avançado', description: 'Acesso a métricas detalhadas' }
      ]
    },
    {
      category: 'Templates',
      icon: FileText,
      permissions: [
        { id: 'templates.read', name: 'Visualizar templates', description: 'Ver biblioteca de templates' },
        { id: 'templates.write', name: 'Gerenciar templates', description: 'Criar e editar templates' },
        { id: 'templates.share', name: 'Compartilhar templates', description: 'Compartilhar com outros usuários' }
      ]
    },
    {
      category: 'Equipe',
      icon: Users,
      permissions: [
        { id: 'team.read', name: 'Visualizar equipe', description: 'Ver membros da equipe' },
        { id: 'team.write', name: 'Gerenciar equipe', description: 'Convidar e gerenciar membros' },
        { id: 'team.billing', name: 'Gerenciar faturamento', description: 'Ver e alterar planos' }
      ]
    },
    {
      category: 'Sistema',
      icon: Settings,
      permissions: [
        { id: 'system.settings', name: 'Configurações', description: 'Alterar configurações do sistema' },
        { id: 'system.logs', name: 'Logs do sistema', description: 'Ver logs e auditoria' },
        { id: 'system.backup', name: 'Backups', description: 'Gerenciar backups do sistema' }
      ]
    }
  ];

  const getRoleColor = (roleName: string) => {
    const role = roles.find(r => r.name === roleName);
    return role?.color || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Controle de Permissões</h1>
          <p className="text-muted-foreground">Gerencie roles e permissões de usuários</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateRoleOpen} onOpenChange={setIsCreateRoleOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nova Role
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Criar Nova Role</DialogTitle>
                <DialogDescription>
                  Configure uma nova role com permissões específicas
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome da Role</Label>
                    <Input placeholder="Ex: Content Manager" />
                  </div>
                  <div className="space-y-2">
                    <Label>Cor</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar cor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blue">Azul</SelectItem>
                        <SelectItem value="green">Verde</SelectItem>
                        <SelectItem value="purple">Roxo</SelectItem>
                        <SelectItem value="orange">Laranja</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Textarea placeholder="Descreva as responsabilidades desta role..." />
                </div>
                <div className="space-y-4">
                  <Label>Permissões</Label>
                  {permissionCategories.map((category) => (
                    <Card key={category.category}>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <category.icon className="w-4 h-4" />
                          {category.category}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {category.permissions.map((permission) => (
                          <div key={permission.id} className="flex items-start space-x-2">
                            <Checkbox id={permission.id} />
                            <div className="space-y-1">
                              <Label htmlFor={permission.id} className="text-sm font-medium">
                                {permission.name}
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                {permission.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateRoleOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setIsCreateRoleOpen(false)}>
                  Criar Role
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="roles" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="users">Clientes</TabsTrigger>
          <TabsTrigger value="permissions">Permissões</TabsTrigger>
        </TabsList>

        {/* Roles Management */}
        <TabsContent value="roles" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((role) => (
              <Card key={role.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${role.color}`} />
                      <CardTitle className="text-base">{role.name}</CardTitle>
                    </div>
                    <Badge variant="secondary">{role.userCount} usuários</Badge>
                  </div>
                  <CardDescription className="text-sm">
                    {role.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      {role.permissions.includes('all') ? 'Todas' : role.permissions.length} permissões
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedRole(role.name)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      {role.name !== 'Super Admin' && (
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Users with Roles */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Usuários e suas Roles</CardTitle>
              <CardDescription>
                Gerencie as roles atribuídas aos usuários
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Último Login</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersWithRoles.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getRoleColor(user.role)}`} />
                          <span>{user.role}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                          {user.status === 'active' ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {user.lastLogin}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <UserCog className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissions Matrix */}
        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Matrix de Permissões</CardTitle>
              <CardDescription>
                Visualize todas as permissões por categoria e role
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {permissionCategories.map((category) => (
                  <div key={category.category} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <category.icon className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-lg">{category.category}</h3>
                    </div>
                    
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[300px]">Permissão</TableHead>
                            {roles.map((role) => (
                              <TableHead key={role.id} className="text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${role.color}`} />
                                  <span className="text-xs">{role.name}</span>
                                </div>
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {category.permissions.map((permission) => (
                            <TableRow key={permission.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium text-sm">{permission.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {permission.description}
                                  </div>
                                </div>
                              </TableCell>
                              {roles.map((role) => (
                                <TableCell key={role.id} className="text-center">
                                  {role.permissions.includes('all') || role.permissions.includes(permission.id) ? (
                                    <CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" />
                                  ) : (
                                    <div className="w-4 h-4 mx-auto" />
                                  )}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPermissions;export { AdminPermissions as Component };
