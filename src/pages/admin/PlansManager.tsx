import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Save, RefreshCw, Users, CreditCard, Activity } from 'lucide-react';

interface AdminPlan {
    id: string;
    name: string;
    slug: string;
    monthly_credits: number;
    monthly_tokens_limit: number | null;
    price_brl: string;
    is_active: boolean;
    display_order: number;
}

interface UserStats {
    email: string;
    role: string;
    plan: string;
    credits: number;
    monthlyTokensUsed: number;
    totalTokensUsed: number;
}

export default function AdminPlansManager() {
    const [plans, setPlans] = useState<AdminPlan[]>([]);
    const [userStats, setUserStats] = useState<UserStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();

    const loadPlans = async () => {
        try {
            const { data, error } = await supabase
                .from('admin_plans')
                .select('*')
                .order('display_order');

            if (error) throw error;
            setPlans(data || []);
        } catch (error) {
            console.error('Erro ao carregar planos:', error);
            toast({
                title: 'Erro',
                description: 'Erro ao carregar planos',
                variant: 'destructive',
            });
        }
    };

    const loadUserStats = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('email, role, plan, credits, monthly_tokens_used, total_tokens_used')
                .order('role', { ascending: false })
                .order('email');

            if (error) throw error;
            setUserStats(data?.map(user => ({
                email: user.email,
                role: user.role,
                plan: user.plan,
                credits: user.credits || 0,
                monthlyTokensUsed: user.monthly_tokens_used || 0,
                totalTokensUsed: user.total_tokens_used || 0,
            })) || []);
        } catch (error) {
            console.error('Erro ao carregar estatísticas dos usuários:', error);
            toast({
                title: 'Erro',
                description: 'Erro ao carregar estatísticas dos usuários',
                variant: 'destructive',
            });
        }
    };

    const loadData = async () => {
        setLoading(true);
        await Promise.all([loadPlans(), loadUserStats()]);
        setLoading(false);
    };

    const updatePlan = async (planId: string, field: 'monthly_credits' | 'monthly_tokens_limit', value: number | null) => {
        setSaving(true);
        try {
            const { error } = await supabase
                .from('admin_plans')
                .update({ [field]: value })
                .eq('id', planId);

            if (error) throw error;

            toast({
                title: 'Sucesso',
                description: `${field === 'monthly_credits' ? 'Créditos' : 'Limite de tokens'} atualizado com sucesso!`,
            });

            await loadData(); // Recarregar dados para ver as mudanças
        } catch (error) {
            console.error('Erro ao atualizar plano:', error);
            toast({
                title: 'Erro',
                description: 'Erro ao atualizar plano',
                variant: 'destructive',
            });
        } finally {
            setSaving(false);
        }
    };

    const resetMonthlyCredits = async () => {
        setSaving(true);
        try {
            const { error } = await supabase.rpc('reset_monthly_credits_by_plan');

            if (error) throw error;

            toast({
                title: 'Sucesso',
                description: 'Créditos mensais resetados para todos os usuários baseado nos planos!',
            });

            await loadData();
        } catch (error) {
            console.error('Erro ao resetar créditos:', error);
            toast({
                title: 'Erro',
                description: 'Erro ao resetar créditos mensais',
                variant: 'destructive',
            });
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Gerenciador de Planos e Créditos</h1>
                    <p className="text-muted-foreground">
                        Controle os créditos e limites de cada plano do sistema
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={loadData} variant="outline" disabled={saving}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Atualizar
                    </Button>
                    <Button onClick={resetMonthlyCredits} disabled={saving}>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Reset Mensal
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="plans" className="w-full">
                <TabsList>
                    <TabsTrigger value="plans">Configuração de Planos</TabsTrigger>
                    <TabsTrigger value="users">Usuários e Créditos</TabsTrigger>
                </TabsList>

                <TabsContent value="plans">
                    <div className="grid gap-4">
                        <div className="text-sm text-muted-foreground bg-blue-50 p-4 rounded-lg">
                            <h3 className="font-semibold mb-2">📋 Como Funciona o Sistema:</h3>
                            <ul className="space-y-1">
                                <li>• <strong>1 Crédito = 1 Geração de Copy</strong> (independente de tokens da IA)</li>
                                <li>• <strong>Tokens</strong> são registrados apenas para analytics interno</li>
                                <li>• <strong>Admins</strong> têm créditos ilimitados</li>
                                <li>• Alterações aqui <strong>atualizam automaticamente</strong> todos os usuários do plano</li>
                            </ul>
                        </div>

                        {plans.map((plan) => (
                            <Card key={plan.id}>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="flex items-center gap-2">
                                                {plan.name}
                                                <Badge variant={plan.is_active ? 'default' : 'secondary'}>
                                                    {plan.is_active ? 'Ativo' : 'Inativo'}
                                                </Badge>
                                            </CardTitle>
                                            <CardDescription>
                                                Plano {plan.slug} - R$ {plan.price_brl}/mês
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium">Créditos Mensais</label>
                                            <div className="flex gap-2">
                                                <Input
                                                    type="number"
                                                    value={plan.monthly_credits}
                                                    onChange={(e) => {
                                                        const newValue = parseInt(e.target.value) || 0;
                                                        setPlans(plans.map(p =>
                                                            p.id === plan.id
                                                                ? { ...p, monthly_credits: newValue }
                                                                : p
                                                        ));
                                                    }}
                                                    className="flex-1"
                                                />
                                                <Button
                                                    size="sm"
                                                    onClick={() => updatePlan(plan.id, 'monthly_credits', plan.monthly_credits)}
                                                    disabled={saving}
                                                >
                                                    <Save className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium">Limite de Tokens (Analytics)</label>
                                            <div className="flex gap-2">
                                                <Input
                                                    type="number"
                                                    value={plan.monthly_tokens_limit || ''}
                                                    placeholder="null = ilimitado"
                                                    onChange={(e) => {
                                                        const newValue = e.target.value ? parseInt(e.target.value) : null;
                                                        setPlans(plans.map(p =>
                                                            p.id === plan.id
                                                                ? { ...p, monthly_tokens_limit: newValue }
                                                                : p
                                                        ));
                                                    }}
                                                    className="flex-1"
                                                />
                                                <Button
                                                    size="sm"
                                                    onClick={() => updatePlan(plan.id, 'monthly_tokens_limit', plan.monthly_tokens_limit)}
                                                    disabled={saving}
                                                >
                                                    <Save className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="users">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Usuários e Consumo de Créditos
                            </CardTitle>
                            <CardDescription>
                                Visualize o consumo de créditos e tokens de todos os usuários
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-2">Email</th>
                                            <th className="text-left p-2">Role</th>
                                            <th className="text-left p-2">Plano</th>
                                            <th className="text-right p-2">Créditos</th>
                                            <th className="text-right p-2">Tokens Mensais</th>
                                            <th className="text-right p-2">Tokens Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userStats.map((user) => (
                                            <tr key={user.email} className="border-b hover:bg-gray-50">
                                                <td className="p-2 font-medium">{user.email}</td>
                                                <td className="p-2">
                                                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                                        {user.role}
                                                    </Badge>
                                                </td>
                                                <td className="p-2">{user.plan}</td>
                                                <td className="p-2 text-right">
                                                    <span className={user.credits <= 5 && user.role !== 'admin' ? 'text-red-600 font-semibold' : ''}>
                                                        {user.role === 'admin' ? '∞' : user.credits}
                                                    </span>
                                                </td>
                                                <td className="p-2 text-right text-muted-foreground">
                                                    {user.monthlyTokensUsed.toLocaleString()}
                                                </td>
                                                <td className="p-2 text-right text-muted-foreground">
                                                    {user.totalTokensUsed.toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
