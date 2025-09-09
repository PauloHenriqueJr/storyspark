import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Loader2, Settings, Shield, Users, Target, Send, TrendingUp, FileText, Calendar, Bot, Mic, MessageSquare, Phone, Lightbulb, Zap, Crown, Activity, Database, Key, Home, BarChart3, Sparkles, Share2, Globe, TestTube, Library, CreditCard, Puzzle, UserCog, Mail, Upload, History } from 'lucide-react';
import { toast } from 'sonner';
import { useRole } from '@/hooks/useRole';
import { cn } from '@/lib/utils';

// Tipagem opcional removida (não utilizada)

const GROUPS = [
  {
    id: 'principal',
    title: 'Principal',
    icon: Home,
    color: 'bg-blue-500',
    pages: [
      { path: '/dashboard', title: 'Dashboard', icon: Home },
      { path: '/composer', title: 'Composer', icon: Bot },
      { path: '/campaigns', title: 'Campanhas', icon: Target },
      { path: '/calendar', title: 'Calendário', icon: Calendar },
      { path: '/analytics', title: 'Analytics', icon: BarChart3 },
    ],
  },
  {
    id: 'voices',
    title: 'Voices',
    icon: Mic,
    color: 'bg-purple-500',
    pages: [
      { path: '/voices', title: 'Voices IA', icon: Mic },
      { path: '/personas', title: 'Personas', icon: Users },
      { path: '/brand-voices', title: 'Brand Voices', icon: Sparkles },
      { path: '/import-data', title: 'Importar dados (IA)', icon: Upload },
    ],
  },
  {
    id: 'distribution',
    title: 'Distribuição',
    icon: Send,
    color: 'bg-green-500',
    pages: [
      { path: '/email-marketing', title: 'Email Marketing', icon: Send },
      { path: '/social-scheduler', title: 'Social Scheduler', icon: Share2 },
      { path: '/landing-pages', title: 'Landing Pages', icon: Globe },
      { path: '/push-whatsapp', title: 'Push / WhatsApp', icon: MessageSquare },
    ],
  },
  {
    id: 'sales',
    title: 'Vendas',
    icon: TrendingUp,
    color: 'bg-orange-500',
    pages: [
      { path: '/funnels', title: 'Funis', icon: TrendingUp },
      { path: '/ab-tests', title: 'Testes A/B', icon: TestTube },
      { path: '/call-scripts', title: 'Call Scripts', icon: Phone },
    ],
  },
  {
    id: 'content',
    title: 'Conteúdo',
    icon: FileText,
    color: 'bg-indigo-500',
    pages: [
      { path: '/templates', title: 'Templates', icon: FileText },
      { path: '/content-library', title: 'Biblioteca', icon: Library },
      { path: '/copies-history', title: 'Histórico de Copies', icon: History },
      { path: '/ai-ideas', title: 'Ideias IA', icon: Lightbulb },
      { path: '/trending-hooks', title: 'Trending Hooks', icon: TrendingUp },
      { path: '/hooks', title: 'Hooks', icon: Zap },
    ],
  },
  {
    id: 'clients',
    title: 'Clientes',
    icon: Users,
    color: 'bg-pink-500',
    pages: [
      { path: '/crm', title: 'CRM', icon: Users },
      { path: '/feedback', title: 'Feedback', icon: MessageSquare },
    ],
  },
  {
    id: 'system',
    title: 'Sistema',
    icon: Settings,
    color: 'bg-gray-500',
    pages: [
      { path: '/integrations', title: 'Integrações', icon: Puzzle },
      { path: '/team', title: 'Equipe', icon: Users },
      { path: '/billing', title: 'Faturamento', icon: CreditCard },
      { path: '/settings', title: 'Configurações', icon: Settings },
    ],
  },
  {
    id: 'admin',
    title: 'Administração',
    icon: Shield,
    color: 'bg-red-500',
    pages: [
      { path: '/admin', title: 'Admin Dashboard', icon: Shield },
      { path: '/admin/users', title: 'Clientes', icon: UserCog },
      { path: '/admin/managers', title: 'Gerentes', icon: Crown },
      { path: '/admin/email-templates', title: 'Email Marketing', icon: Mail },
      { path: '/admin/waitlist', title: 'Waitlist', icon: Mail },
      { path: '/admin/jobs', title: 'Jobs', icon: FileText },
      { path: '/admin/logs', title: 'Logs', icon: Activity },
      { path: '/admin/settings', title: 'Sistema', icon: Database },
      { path: '/admin/security', title: 'Segurança', icon: Shield },
      { path: '/admin/permissions', title: 'Permissões', icon: Key },
      { path: '/admin/backup', title: 'Backup', icon: Database },
    ],
  },
];

export const AdminFeatureFlags = () => {
  const { hasAdminAccess } = useRole();
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!hasAdminAccess()) {
      toast.error('Acesso negado');
      return;
    }
    fetchFlags();
  }, []);

  const fetchFlags = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('feature_flags')
        .select('*');

      if (error) throw error;

      const flagsMap = data.reduce((acc, flag) => {
        acc[`${flag.group_name}-${flag.page_path}`] = flag.enabled;
        return acc;
      }, {} as Record<string, boolean>);

      setFlags(flagsMap);
    } catch (error) {
      console.error('Erro ao buscar flags:', error);
      toast.error('Erro ao carregar feature flags');
    } finally {
      setLoading(false);
    }
  };

  const updateFlag = async (group: string, path: string, enabled: boolean) => {
    const key = `${group}-${path}`;
    setSaving(prev => ({ ...prev, [key]: true }));
    setFlags(prev => ({ ...prev, [key]: enabled }));

    try {
      // First try to update existing record
      const { data: existing, error: fetchError } = await supabase
        .from('feature_flags')
        .select('id')
        .eq('group_name', group)
        .eq('page_path', path)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existing) {
        // Update existing record
        const { error } = await supabase
          .from('feature_flags')
          .update({ enabled, updated_at: new Date().toISOString() })
          .eq('group_name', group)
          .eq('page_path', path);

        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('feature_flags')
          .insert([{ group_name: group, page_path: path, enabled, updated_at: new Date().toISOString() }]);

        if (error) throw error;
      }

      toast.success(`Flag ${enabled ? 'ativada' : 'desativada'} para ${path}`);
    } catch (error) {
      console.error('Erro ao atualizar flag:', error);
      toast.error('Erro ao salvar flag');
      setFlags(prev => ({ ...prev, [key]: !enabled })); // Revert
    } finally {
      setSaving(prev => ({ ...prev, [key]: false }));
    }
  };

  const toggleGroup = async (groupId: string, enable: boolean) => {
    const updates = GROUPS.find(g => g.id === groupId)?.pages.map(page => updateFlag(groupId, page.path, enable)) || [];
    await Promise.all(updates);
  };

  const toggleAllPages = async (enable: boolean) => {
    const allUpdates: Promise<void>[] = [];

    // Percorrer todos os grupos e páginas
    GROUPS.forEach(group => {
      group.pages.forEach(page => {
        // Pular páginas admin
        if (!page.path.startsWith('/admin')) {
          allUpdates.push(updateFlag(group.id, page.path, enable));
        }
      });
    });

    // Executar todas as atualizações
    try {
      await Promise.all(allUpdates);
      toast.success(`Todas as páginas foram ${enable ? 'ativadas' : 'desativadas'}`);
    } catch (error) {
      toast.error('Erro ao atualizar algumas páginas');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!hasAdminAccess()) {
    return <div className="p-6 text-center text-destructive">Acesso negado</div>;
  }

  return (
    <div className="space-y-6 p-4">
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Controle de Feature Flags
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground mb-4">
            Ative/desative páginas e grupos inteiros para controlar o acesso. Alterações afetam sidebar e acesso às rotas em tempo real.
          </p>

          {/* Controles globais */}
          <div className="flex gap-2 mb-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex-1">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Controle Global
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Ativar/desativar todas as páginas (exceto admin) de uma vez
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleAllPages(true)}
                  className="text-green-600 border-green-200 hover:bg-green-50"
                >
                  <Settings className="h-3 w-3 mr-1" />
                  Ativar Todas
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleAllPages(false)}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Settings className="h-3 w-3 mr-1" />
                  Desativar Todas
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <Button variant="outline" onClick={fetchFlags} size="sm">
              Recarregar
            </Button>
            <Button variant="secondary" onClick={() => window.location.reload()} size="sm">
              Aplicar Mudanças no Sidebar
            </Button>
          </div>
        </CardContent>
      </Card>

      {GROUPS.map((group) => {
        const Icon = group.icon;
        const groupEnabled = group.pages.every(page => flags[`${group.id}-${page.path}`] !== false);
        const groupSaving = group.pages.some(page => saving[`${group.id}-${page.path}`]);
        const activePages = group.pages.filter(page => flags[`${group.id}-${page.path}`] !== false).length;
        const status = groupEnabled ? 'Ativo' : activePages > 0 ? 'Parcial' : 'Desativo';

        return (
          <Card key={group.id} className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className={cn(
              "flex flex-row items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-t-lg",
              groupEnabled ? 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20' : 'from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20'
            )}>
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg", group.color, "text-white")}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-lg">{group.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{group.pages.length} páginas</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={groupEnabled}
                  onCheckedChange={(checked) => toggleGroup(group.id, checked)}
                  className="data-[state=checked]:bg-primary"
                  disabled={groupSaving}
                />
                <Badge variant={groupEnabled ? "default" : status === 'Parcial' ? "secondary" : "destructive"} className="px-3 py-1">
                  {status} ({activePages}/{group.pages.length})
                </Badge>
                {groupSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
                {group.pages.map((page) => {
                  const key = `${group.id}-${page.path}`;
                  const enabled = flags[key] !== false;
                  const isSaving = saving[key];
                  const Icon = page.icon || Settings;

                  return (
                    <div key={page.path} className={cn(
                      "flex items-center justify-between p-4 rounded-lg border transition-all",
                      enabled ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800/50 hover:bg-green-100' : 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800/50 hover:bg-red-100',
                      isSaving && 'opacity-70'
                    )}>
                      <div className="flex items-center gap-3">
                        <div className={cn("p-1.5 rounded-md text-white", enabled ? 'bg-green-500' : 'bg-red-500')}>
                          <Icon className="h-3 w-3" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{page.title}</p>
                          <p className="text-xs text-muted-foreground">{page.path}</p>
                        </div>
                      </div>
                      <Switch
                        checked={enabled}
                        onCheckedChange={(checked) => updateFlag(group.id, page.path, checked)}
                        className="data-[state=checked]:bg-primary"
                        disabled={isSaving}
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};export { AdminFeatureFlags as Component };
