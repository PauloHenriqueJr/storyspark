import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useAdminPlansCache, AdminPlan, PlanFormData } from '@/hooks/useAdminPlansCache';
import { TokensService } from '@/services/tokensService';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  StarOff,
  DollarSign,
  Users,
  Zap,
  ArrowUp,
  ArrowDown,
  Save,
  X,
  Copy,
  CreditCard,
  User
} from 'lucide-react';

const AdminPlans = () => {
  const { toast } = useToast();
  const {
    plans,
    loading,
    createPlan,
    updatePlan,
    deletePlan,
    togglePlanStatus,
    setPopularPlan,
    formatPrice,
    formatCredits,
    // Estados de loading individuais para melhor UX
    isCreating,
    isUpdating,
    isDeleting,
    isToggling,
    isSettingPopular
  } = useAdminPlansCache();

  const plansData = plans as AdminPlan[];

  // Estados para modal de planos
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<AdminPlan | null>(null);
  const [formData, setFormData] = useState<PlanFormData>({
    name: '',
    slug: '',
    price_brl: 0,
    monthly_credits: null,
    monthly_tokens_limit: null,
    features: [],
    description: '',
    is_active: true,
    is_popular: false,
    display_order: 1,
  });
  const [featuresInput, setFeaturesInput] = useState('');

  // Estados para modal de créditos
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [creditFormData, setCreditFormData] = useState({ email: '', amount: 0 });
  const [isAddingCredits, setIsAddingCredits] = useState(false);

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      price_brl: 0,
      monthly_credits: null,
      monthly_tokens_limit: null,
      features: [],
      description: '',
      is_active: true,
      is_popular: false,
      display_order: Math.max(...plansData.map(p => p.display_order), 0) + 1,
    });
    setFeaturesInput('');
    setEditingPlan(null);
  };

  const resetCreditForm = () => {
    setCreditFormData({ email: '', amount: 0 });
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (plan: AdminPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      slug: plan.slug,
      price_brl: plan.price_brl,
      monthly_credits: plan.monthly_credits,
      monthly_tokens_limit: plan.monthly_tokens_limit,
      features: plan.features,
      description: plan.description,
      is_active: plan.is_active,
      is_popular: plan.is_popular,
      display_order: plan.display_order,
    });
    setFeaturesInput(Array.isArray(plan.features) ? plan.features.join('\n') : '');
    setIsModalOpen(true);
  };

  const openCreditModal = () => {
    resetCreditForm();
    setIsCreditModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const features = featuresInput.split('\n').filter(f => f.trim());
    const finalData = { ...formData, features };

    try {
      let result;
      if (editingPlan) {
        result = await updatePlan.mutateAsync({ id: editingPlan.id, planData: finalData });
        toast({
          title: "Plano atualizado!",
          description: `O plano ${finalData.name} foi atualizado com sucesso.`,
        });
      } else {
        result = await createPlan.mutateAsync(finalData);
        toast({
          title: "Plano criado!",
          description: `O plano ${finalData.name} foi criado com sucesso.`,
        });
      }

      if (result) {
        setIsModalOpen(false);
        resetForm();
      }
    } catch (error: any) {
      toast({
        title: "Erro!",
        description: error.message || "Ocorreu um erro ao salvar o plano.",
        variant: "destructive"
      });
    }
  };

  const handleAddCredits = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingCredits(true);

    try {
      const { success, error } = await TokensService.addCreditsByEmail(creditFormData.email, creditFormData.amount);

      if (success) {
        toast({
          title: "Créditos adicionados!",
          description: `Adicionados ${creditFormData.amount} créditos para ${creditFormData.email}.`,
        });
        setIsCreditModalOpen(false);
        resetCreditForm();
      } else {
        toast({
          title: "Erro!",
          description: error || "Falha ao adicionar créditos.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro!",
        description: error.message || "Ocorreu um erro ao adicionar créditos.",
        variant: "destructive",
      });
    } finally {
      setIsAddingCredits(false);
    }
  };

  const handleDelete = async (plan: AdminPlan) => {
    try {
      await deletePlan.mutateAsync(plan.id);
      toast({
        title: "Plano removido!",
        description: `O plano ${plan.name} foi removido com sucesso.`,
      });
    } catch (error: any) {
      toast({
        title: "Erro!",
        description: error.message || "Ocorreu um erro ao remover o plano.",
        variant: "destructive"
      });
    }
  };

  const handleToggleStatus = async (plan: AdminPlan) => {
    try {
      await togglePlanStatus.mutateAsync({ id: plan.id, is_active: !plan.is_active });
      toast({
        title: `Plano ${!plan.is_active ? 'ativado' : 'desativado'}!`,
        description: `O plano ${plan.name} foi ${!plan.is_active ? 'ativado' : 'desativado'} com sucesso.`,
      });
    } catch (error: any) {
      toast({
        title: "Erro!",
        description: error.message || "Ocorreu um erro ao alterar status do plano.",
        variant: "destructive"
      });
    }
  };

  const handleSetPopular = async (plan: AdminPlan) => {
    try {
      await setPopularPlan.mutateAsync(plan.id);
      toast({
        title: "Plano popular definido!",
        description: `O plano ${plan.name} agora é o plano em destaque.`,
      });
    } catch (error: any) {
      toast({
        title: "Erro!",
        description: error.message || "Ocorreu um erro ao definir plano popular.",
        variant: "destructive"
      });
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando planos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Gerenciar Planos</h1>
          <p className="text-muted-foreground">
            Configure planos, preços e funcionalidades de forma centralizada
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={openCreditModal} variant="outline" className="gap-2">
            <CreditCard className="w-4 h-4" />
            Gerenciar Créditos
          </Button>
          <Button onClick={openCreateModal} className="bg-gradient-primary hover:opacity-90 gap-2">
            <Plus className="w-4 h-4" />
            Novo Plano
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Planos</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plansData.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Planos Ativos</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plansData.filter(p => p.is_active).length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Potencial</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(plansData.filter(p => p.is_active && p.price_brl > 0).reduce((sum, p) => sum + p.price_brl, 0))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plano Popular</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {plansData.find(p => p.is_popular)?.name || 'Nenhum'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Planos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {plansData.map((plan) => (
          <Card key={plan.id} className={`relative ${!plan.is_active ? 'opacity-60' : ''}`}>
            {plan.is_popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-primary text-primary-foreground px-3 py-1">
                  <Star className="w-3 h-3 mr-1" />
                  Popular
                </Badge>
              </div>
            )}

            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleStatus(plan)}
                    title={plan.is_active ? 'Desativar' : 'Ativar'}
                    disabled={isToggling}
                  >
                    {isToggling ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : plan.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSetPopular(plan)}
                    title="Definir como popular"
                    disabled={isSettingPopular}
                  >
                    {isSettingPopular ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : plan.is_popular ?
                      <Star className="w-4 h-4 fill-current text-yellow-500" /> :
                      <StarOff className="w-4 h-4" />
                    }
                  </Button>
                </div>
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{formatPrice(plan.price_brl)}</span>
                {plan.price_brl > 0 && <span className="text-muted-foreground">/mês</span>}
              </div>

              <div className="text-sm text-muted-foreground">
                <strong>{formatCredits(plan.monthly_credits)}</strong> por mês
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Funcionalidades:</h4>
                <ul className="space-y-1">
                  {Array.isArray(plan.features) && plan.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                      <Zap className="w-3 h-3 text-primary" />
                      {feature}
                    </li>
                  ))}
                  {Array.isArray(plan.features) && plan.features.length > 3 && (
                    <li className="text-sm text-muted-foreground">
                      +{plan.features.length - 3} funcionalidades
                    </li>
                  )}
                  {!Array.isArray(plan.features) && (
                    <li className="text-sm text-muted-foreground italic">
                      Funcionalidades não disponíveis
                    </li>
                  )}
                </ul>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant={plan.is_active ? "default" : "secondary"}>
                  {plan.is_active ? "Ativo" : "Inativo"}
                </Badge>
                <Badge variant="outline">#{plan.display_order}</Badge>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditModal(plan)}
                  className="flex-1"
                  disabled={isUpdating || isDeleting}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      disabled={isDeleting || isUpdating}
                    >
                      {isDeleting ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remover plano</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja remover o plano "{plan.name}"? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(plan)}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Remover
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de Criação/Edição */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPlan ? 'Editar Plano' : 'Criar Novo Plano'}
            </DialogTitle>
            <DialogDescription>
              {editingPlan ?
                'Modifique as informações do plano abaixo.' :
                'Preencha as informações para criar um novo plano.'
              }
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome do Plano</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Ex: Pro"
                  required
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="pro"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Para equipes em crescimento"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Preço (R$)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  value={formData.price_brl}
                  onChange={(e) => setFormData(prev => ({ ...prev, price_brl: parseFloat(e.target.value) || 0 }))}
                  placeholder="297"
                />
              </div>

              <div>
                <Label htmlFor="credits">Créditos Mensais (vazio = ilimitado)</Label>
                <Input
                  id="credits"
                  type="number"
                  min="0"
                  value={formData.monthly_credits || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    monthly_credits: e.target.value ? parseInt(e.target.value) : null
                  }))}
                  placeholder="800"
                />
              </div>

              <div>
                <Label htmlFor="tokens">Limite de Tokens Mensais (vazio = ilimitado)</Label>
                <Input
                  id="tokens"
                  type="number"
                  min="0"
                  value={formData.monthly_tokens_limit || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    monthly_tokens_limit: e.target.value ? parseInt(e.target.value) : null
                  }))}
                  placeholder="15000"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Usado apenas para analytics. 1 crédito = 1 geração (independente de tokens).
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="features">Funcionalidades (uma por linha)</Label>
              <Textarea
                id="features"
                value={featuresInput}
                onChange={(e) => setFeaturesInput(e.target.value)}
                placeholder="800 créditos de IA por mês&#10;10 integrações&#10;Analytics avançados"
                rows={6}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="order">Ordem de Exibição</Label>
                <Input
                  id="order"
                  type="number"
                  min="1"
                  value={formData.display_order}
                  onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 1 }))}
                />
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  id="active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="active">Ativo</Label>
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  id="popular"
                  checked={formData.is_popular}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_popular: checked }))}
                />
                <Label htmlFor="popular">Popular</Label>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-gradient-primary hover:opacity-90"
                disabled={isCreating || isUpdating}
              >
                {(isCreating || isUpdating) ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    {editingPlan ? 'Atualizando...' : 'Criando...'}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {editingPlan ? 'Atualizar' : 'Criar'} Plano
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de Adição de Créditos */}
      <Dialog open={isCreditModalOpen} onOpenChange={setIsCreditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Créditos</DialogTitle>
            <DialogDescription>
              Adicione créditos avulsos para qualquer usuário pelo email.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddCredits} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email do Usuário</Label>
              <Input
                id="email"
                type="email"
                value={creditFormData.email}
                onChange={(e) => setCreditFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="user@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Quantidade de Créditos</Label>
              <Input
                id="amount"
                type="number"
                min="1"
                value={creditFormData.amount}
                onChange={(e) => setCreditFormData(prev => ({ ...prev, amount: parseInt(e.target.value) || 0 }))}
                placeholder="20"
                required
              />
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => { setIsCreditModalOpen(false); resetCreditForm(); }}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isAddingCredits}>
                {isAddingCredits ? 'Adicionando...' : 'Adicionar Créditos'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPlans;
