import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Mail, 
  UserPlus, 
  Shield, 
  Eye, 
  Edit, 
  Trash2,
  BarChart3,
  Users,
  Settings,
  Crown,
  Copy
} from 'lucide-react';
import type { ComponentType } from 'react';

interface InviteMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Role {
  id: string;
  name: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  color: string;
  badge: 'primary' | 'destructive' | 'default' | 'secondary' | 'outline';
}

interface PermissionModule {
  id: string;
  name: string;
  description: string;
}

interface Permissions {
  campaigns: { read: boolean; write: boolean; delete: boolean };
  analytics: { read: boolean; write: boolean; delete: boolean };
  team: { read: boolean; write: boolean; delete: boolean };
  settings: { read: boolean; write: boolean; delete: boolean };
}

export const InviteMemberModal = ({ open, onOpenChange }: InviteMemberModalProps) => {
  const [inviteType, setInviteType] = useState<'single' | 'bulk'>('single');
  const [selectedRole, setSelectedRole] = useState('viewer');
  const [permissions, setPermissions] = useState<Permissions>({
    campaigns: { read: true, write: false, delete: false },
    analytics: { read: true, write: false, delete: false },
    team: { read: false, write: false, delete: false },
    settings: { read: false, write: false, delete: false }
  });

  const roles: Role[] = [
    {
      id: 'owner',
      name: 'Owner',
      description: 'Acesso total à plataforma',
      icon: Crown,
      color: 'text-yellow-500',
      badge: 'primary'
    },
    {
      id: 'admin',
      name: 'Admin',
      description: 'Gerenciar equipe e configurações',
      icon: Shield,
      color: 'text-red-500',
      badge: 'destructive'
    },
    {
      id: 'manager',
      name: 'Manager',
      description: 'Criar e gerenciar campanhas',
      icon: BarChart3,
      color: 'text-blue-500',
      badge: 'default'
    },
    {
      id: 'editor',
      name: 'Editor',
      description: 'Criar conteúdo e editar campanhas',
      icon: Edit,
      color: 'text-green-500',
      badge: 'secondary'
    },
    {
      id: 'viewer',
      name: 'Viewer',
      description: 'Visualizar relatórios e dados',
      icon: Eye,
      color: 'text-gray-500',
      badge: 'outline'
    }
  ];

  const permissionModules: PermissionModule[] = [
    {
      id: 'campaigns',
      name: 'Campanhas',
      description: 'Gerenciar campanhas e conteúdo'
    },
    {
      id: 'analytics',
      name: 'Analytics',
      description: 'Visualizar relatórios e métricas'
    },
    {
      id: 'team',
      name: 'Equipe',
      description: 'Gerenciar membros da equipe'
    },
    {
      id: 'settings',
      name: 'Configurações',
      description: 'Alterar configurações do workspace'
    }
  ];

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    
    // Auto-configurar permissões baseado no role
    switch (roleId) {
      case 'owner':
      case 'admin':
        setPermissions({
          campaigns: { read: true, write: true, delete: true },
          analytics: { read: true, write: true, delete: true },
          team: { read: true, write: true, delete: true },
          settings: { read: true, write: true, delete: true }
        });
        break;
      case 'manager':
        setPermissions({
          campaigns: { read: true, write: true, delete: false },
          analytics: { read: true, write: false, delete: false },
          team: { read: true, write: false, delete: false },
          settings: { read: false, write: false, delete: false }
        });
        break;
      case 'editor':
        setPermissions({
          campaigns: { read: true, write: true, delete: false },
          analytics: { read: true, write: false, delete: false },
          team: { read: false, write: false, delete: false },
          settings: { read: false, write: false, delete: false }
        });
        break;
      case 'viewer':
        setPermissions({
          campaigns: { read: true, write: false, delete: false },
          analytics: { read: true, write: false, delete: false },
          team: { read: false, write: false, delete: false },
          settings: { read: false, write: false, delete: false }
        });
        break;
    }
  };

  const updatePermission = (module: string, action: string, value: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [module]: {
        ...prev[module as keyof typeof prev],
        [action]: value
      }
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            Convidar Membro
          </DialogTitle>
          <DialogDescription>
            Adicione novos membros à sua equipe e configure suas permissões
          </DialogDescription>
        </DialogHeader>

        <Tabs value={inviteType} onValueChange={(value) => setInviteType(value as 'single' | 'bulk')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single">Convite Individual</TabsTrigger>
            <TabsTrigger value="bulk">Convite em Massa</TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Informações Básicas */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informações do Membro</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email"
                        placeholder="nome@empresa.com" 
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="name">Nome (opcional)</Label>
                      <Input 
                        id="name" 
                        placeholder="João Silva" 
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Função/Cargo (opcional)</Label>
                      <Input 
                        placeholder="Marketing Manager" 
                        className="mt-1"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Seleção de Role */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Nível de Acesso</CardTitle>
                    <CardDescription>
                      Escolha o nível de permissão para este membro
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {roles.map((role) => (
                      <div
                        key={role.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedRole === role.id 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-muted-foreground'
                        }`}
                        onClick={() => handleRoleSelect(role.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <role.icon className={`w-5 h-5 ${role.color}`} />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{role.name}</span>
                                <Badge variant={role.badge}>
                                  {role.name}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {role.description}
                              </p>
                            </div>
                          </div>
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            selectedRole === role.id 
                              ? 'border-primary bg-primary' 
                              : 'border-muted-foreground'
                          }`} />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Permissões Detalhadas */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Permissões Detalhadas</CardTitle>
                    <CardDescription>
                      Configure permissões específicas por módulo
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {permissionModules.map((module) => (
                      <div key={module.id} className="space-y-3">
                        <div>
                          <h4 className="font-medium">{module.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {module.description}
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 pl-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id={`${module.id}-read`}
                              checked={permissions[module.id as keyof typeof permissions]?.read}
                              onCheckedChange={(checked) => 
                                updatePermission(module.id, 'read', checked as boolean)
                              }
                            />
                            <label 
                              htmlFor={`${module.id}-read`}
                              className="text-sm font-medium"
                            >
                              Ver
                            </label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id={`${module.id}-write`}
                              checked={permissions[module.id as keyof typeof permissions]?.write}
                              onCheckedChange={(checked) => 
                                updatePermission(module.id, 'write', checked as boolean)
                              }
                            />
                            <label 
                              htmlFor={`${module.id}-write`}
                              className="text-sm font-medium"
                            >
                              Editar
                            </label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id={`${module.id}-delete`}
                              checked={permissions[module.id as keyof typeof permissions]?.delete}
                              onCheckedChange={(checked) => 
                                updatePermission(module.id, 'delete', checked as boolean)
                              }
                            />
                            <label 
                              htmlFor={`${module.id}-delete`}
                              className="text-sm font-medium"
                            >
                              Excluir
                            </label>
                          </div>
                        </div>
                        
                        {module.id !== permissionModules[permissionModules.length - 1].id && (
                          <Separator className="mt-4" />
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bulk" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Convite em Massa</CardTitle>
                <CardDescription>
                  Adicione múltiplos emails separados por vírgula ou linha
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="bulk-emails">Emails</Label>
                  <textarea
                    id="bulk-emails"
                    className="w-full mt-1 p-3 border rounded-lg resize-none"
                    rows={6}
                    placeholder="joao@empresa.com, maria@empresa.com&#10;pedro@empresa.com&#10;ana@empresa.com"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Separe emails por vírgula ou quebra de linha
                  </p>
                </div>

                <div>
                  <Label>Função Padrão</Label>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecione uma função" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          <div className="flex items-center gap-2">
                            <role.icon className={`w-4 h-4 ${role.color}`} />
                            {role.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-6 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <div className="flex gap-2">
            <Button variant="outline">
              <Copy className="w-4 h-4 mr-2" />
              Copiar Link
            </Button>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Mail className="w-4 h-4 mr-2" />
              Enviar Convite{inviteType === 'bulk' ? 's' : ''}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};