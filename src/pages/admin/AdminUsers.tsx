import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  MoreHorizontal,
  Building2,
  Crown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit,
  Coins,
  RefreshCw,
  User,
  Shield
} from 'lucide-react';
import { useAdminUsers, AdminUser } from '@/hooks/useAdminUsers';
import { useToast } from '@/hooks/use-toast';

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isAddCreditsModalOpen, setIsAddCreditsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [creditsAmount, setCreditsAmount] = useState('');
  const [creditsReason, setCreditsReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { users, loading, error, addCredits, updateUserRole, resetMonthlyCredits } = useAdminUsers();
  const { toast } = useToast();

  // Filtrar usuários baseado na busca e aba ativa
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase()));

    switch (activeTab) {
      case 'admin':
        return matchesSearch && (user.role === 'admin' || user.role === 'super_admin');
      case 'active':
        return matchesSearch && user.subscription_status === 'active';
      case 'inactive':
        return matchesSearch && user.subscription_status !== 'active';
      default:
        return matchesSearch;
    }
  });

  // Abrir modal para adicionar créditos
  const openAddCreditsModal = (user: AdminUser) => {
    setSelectedUser(user);
    setCreditsAmount('');
    setCreditsReason('');
    setIsAddCreditsModalOpen(true);
  };

  // Adicionar créditos
  const handleAddCredits = async () => {
    if (!selectedUser || !creditsAmount) return;

    const amount = parseInt(creditsAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: 'Erro',
        description: 'Por favor, insira um valor válido de créditos.',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      await addCredits({
        userId: selectedUser.id,
        amount,
        reason: creditsReason || 'Créditos adicionados pelo admin'
      });

      toast({
        title: 'Sucesso',
        description: `${amount} créditos adicionados para ${selectedUser.email}`
      });

      setIsAddCreditsModalOpen(false);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao adicionar créditos. Tente novamente.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Resetar créditos mensais
  const handleResetMonthlyCredits = async (user: AdminUser) => {
    setIsLoading(true);
    try {
      await resetMonthlyCredits(user.id);
      toast({
        title: 'Sucesso',
        description: `Créditos mensais de ${user.email} foram resetados`
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao resetar créditos mensais. Tente novamente.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Atualizar role do usuário
  const handleUpdateRole = async (user: AdminUser, newRole: string) => {
    setIsLoading(true);
    try {
      await updateUserRole(user.id, newRole);
      toast({
        title: 'Sucesso',
        description: `Role de ${user.email} alterada para ${newRole}`
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao alterar role. Tente novamente.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Funções de formatação
  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Ativo</Badge>;
      case 'canceled':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Cancelado</Badge>;
      case 'trialing':
        return <Badge className="bg-blue-100 text-blue-800"><AlertTriangle className="w-3 h-3 mr-1" />Trial</Badge>;
      default:
        return <Badge variant="secondary">Inativo</Badge>;
    }
  };

  const getRoleBadge = (role: string | null) => {
    switch (role) {
      case 'super_admin':
        return <Badge variant="destructive"><Crown className="w-3 h-3 mr-1" />Super Admin</Badge>;
      case 'admin':
        return <Badge className="bg-orange-100 text-orange-800"><Shield className="w-3 h-3 mr-1" />Admin</Badge>;
      case 'manager':
        return <Badge variant="default"><Building2 className="w-3 h-3 mr-1" />Gerente</Badge>;
      default:
        return <Badge variant="secondary"><User className="w-3 h-3 mr-1" />Usuário</Badge>;
    }
  };

  const getPlanBadge = (plan: string | null) => {
    const colors = {
      'free': 'bg-gray-100 text-gray-800',
      'starter': 'bg-blue-100 text-blue-800',
      'pro': 'bg-purple-100 text-purple-800',
      'business': 'bg-green-100 text-green-800',
      'enterprise': 'bg-yellow-100 text-yellow-800'
    };
    return <Badge className={colors[plan as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>{plan || 'Free'}</Badge>;
  };

  const formatCredits = (credits: number | null) => {
    if (credits === null) return '∞';
    return credits.toLocaleString();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando usuários...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-4" />
            <p className="text-destructive">Erro ao carregar usuários: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  const stats = {
    total: users.length,
    active: users.filter(u => u.subscription_status === 'active').length,
    admins: users.filter(u => u.role === 'admin' || u.role === 'super_admin').length,
    totalCredits: users.reduce((sum, u) => sum + (u.credits || 0), 0)
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Gestão de Usuários</h1>
          <p className="text-muted-foreground">Gerencie todos os usuários da plataforma</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
            <p className="text-sm text-muted-foreground">Total de Usuários</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-sm text-muted-foreground">Assinantes Ativos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.admins}</div>
            <p className="text-sm text-muted-foreground">Administradores</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{formatCredits(stats.totalCredits)}</div>
            <p className="text-sm text-muted-foreground">Total de Créditos</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lista de Usuários</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  placeholder="Buscar usuários..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">Todos ({stats.total})</TabsTrigger>
              <TabsTrigger value="active">Ativos ({stats.active})</TabsTrigger>
              <TabsTrigger value="admin">Admins ({stats.admins})</TabsTrigger>
              <TabsTrigger value="inactive">Inativos ({stats.total - stats.active})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Créditos</TableHead>
                    <TableHead>Último Login</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {user.full_name ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase() :
                                user.email.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{user.full_name || 'Sem nome'}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getPlanBadge(user.plan)}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.subscription_status)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{formatCredits(user.credits)} créditos</div>
                          <div className="text-muted-foreground">
                            {user.monthly_tokens_used || 0}/{user.monthly_tokens_limit || '∞'} mensais
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(user.last_login_at)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" disabled={isLoading}>
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => openAddCreditsModal(user)}>
                              <Coins className="w-4 h-4 mr-2" />
                              Adicionar Créditos
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleResetMonthlyCredits(user)}>
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Resetar Créditos Mensais
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleUpdateRole(user, user.role === 'admin' ? 'user' : 'admin')}>
                              <Edit className="w-4 h-4 mr-2" />
                              {user.role === 'admin' ? 'Remover Admin' : 'Tornar Admin'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Modal para Adicionar Créditos */}
      <Dialog open={isAddCreditsModalOpen} onOpenChange={setIsAddCreditsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Créditos</DialogTitle>
            <DialogDescription>
              Adicionar créditos avulsos para {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="credits-amount">Quantidade de Créditos</Label>
              <Input
                id="credits-amount"
                type="number"
                min="1"
                placeholder="Ex: 100"
                value={creditsAmount}
                onChange={(e) => setCreditsAmount(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="credits-reason">Motivo (opcional)</Label>
              <Textarea
                id="credits-reason"
                placeholder="Ex: Créditos promocionais, compensação, etc."
                value={creditsReason}
                onChange={(e) => setCreditsReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddCreditsModalOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddCredits}
              disabled={isLoading || !creditsAmount}
            >
              {isLoading ? 'Adicionando...' : 'Adicionar Créditos'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;