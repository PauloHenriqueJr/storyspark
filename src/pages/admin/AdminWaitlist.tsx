import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Users, 
  Mail, 
  Calendar, 
  TrendingUp, 
  Download, 
  Search, 
  MoreHorizontal,
  UserPlus,
  Filter,
  RefreshCw,
  Send,
  Eye,
  Loader2,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { emailService } from '@/services/emailService';
import AuthLoginHelper from '@/components/debug/AuthLoginHelper';


interface WaitlistSignup {
  id: string;
  email: string;
  consent: boolean;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  referrer: string | null;
  variant: string | null;
  created_at: string;
}

interface WaitlistInvite {
  id: string;
  waitlist_signup_id: string;
  email: string;
  status: 'pending' | 'sent' | 'accepted' | 'expired';
  invite_code: string;
  sent_at: string | null;
  accepted_at: string | null;
  expires_at: string;
  priority: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface InviteStats {
  total_invites: number;
  pending_invites: number;
  sent_invites: number;
  accepted_invites: number;
  expired_invites: number;
  acceptance_rate: number | null;
}

const AdminWaitlist = () => {
  const [signups, setSignups] = useState<WaitlistSignup[]>([]);
  const [invites, setInvites] = useState<WaitlistInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    withConsent: 0
  });
  const [inviteStats, setInviteStats] = useState<InviteStats>({
    total_invites: 0,
    pending_invites: 0,
    sent_invites: 0,
    accepted_invites: 0,
    expired_invites: 0,
    acceptance_rate: null
  });
  
  // Estados para modais
  const [sendInviteModal, setSendInviteModal] = useState<{ open: boolean; invite: WaitlistInvite | null }>({
    open: false,
    invite: null
  });
  const [detailsModal, setDetailsModal] = useState<{ open: boolean; invite: WaitlistInvite | null }>({
    open: false,
    invite: null
  });
  const [signupDetailsModal, setSignupDetailsModal] = useState<{ open: boolean; signup: WaitlistSignup | null }>({
    open: false,
    signup: null
  });
  const [createInvitesModal, setCreateInvitesModal] = useState<{ open: boolean; count: number }>({
    open: false,
    count: 0
  });
  const [createCampaignModal, setCreateCampaignModal] = useState<{ isOpen: boolean; campaign: any | null }>({
    isOpen: false,
    campaign: null
  });
  const [confirmSendAllModal, setConfirmSendAllModal] = useState(false);
  
  // Estados para os campos do formulário de campanha
  const [campaignForm, setCampaignForm] = useState({
    name: '',
    type: '',
    description: '',
    priority: '',
    inviteLimit: '',
    consentOnly: false,
    recentFirst: false,
    sourceFilter: false
  });
  const { toast } = useToast();

  // Estado para mostrar o helper de autenticação
  const [showAuthHelper, setShowAuthHelper] = useState(false);

  // Carregar dados da waitlist e convites do Supabase
  useEffect(() => {
    const fetchWaitlistData = async () => {
      try {
        setLoading(true);
        
        // Carregar signups
        const { data: signupsData, error: signupsError } = await supabase
          .from('waitlist_signups')
          .select('*')
          .order('created_at', { ascending: false });

        if (signupsError) {
          console.error('Erro ao carregar dados da waitlist:', signupsError);
          toast({
            title: 'Erro',
            description: 'Não foi possível carregar os dados da waitlist.',
            variant: 'destructive'
          });
          return;
        }

        // Carregar convites
        const { data: invitesData, error: invitesError } = await supabase
          .from('waitlist_invites')
          .select('*')
          .order('created_at', { ascending: false });

        if (invitesError) {
          console.error('Erro ao carregar convites:', invitesError);
        }

        // Carregar estatísticas de convites
        const { data: inviteStatsData, error: statsError } = await supabase
          .from('waitlist_invite_stats')
          .select('*')
          .single();

        if (statsError) {
          console.error('Erro ao carregar estatísticas de convites:', statsError);
        }

        const signups = signupsData || [];
        const invites = invitesData || [];
        
        setSignups(signups);
        setInvites(invites);
        
        if (inviteStatsData) {
          setInviteStats(inviteStatsData);
        }
        
        // Calcular estatísticas de signups
        const today = new Date().toDateString();
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        
        setStats({
          total: signups.length,
          today: signups.filter(s => new Date(s.created_at).toDateString() === today).length,
          thisWeek: signups.filter(s => new Date(s.created_at) >= oneWeekAgo).length,
          thisMonth: signups.filter(s => new Date(s.created_at) >= oneMonthAgo).length,
          withConsent: signups.filter(s => s.consent).length
        });
      } catch (error) {
        console.error('Erro inesperado:', error);
        toast({
          title: 'Erro',
          description: 'Erro inesperado ao carregar dados.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWaitlistData();
  }, [toast]);

  const filteredSignups = signups.filter(signup => {
    const matchesSearch = signup.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSource = selectedSource === 'all' || signup.utm_source === selectedSource;
    return matchesSearch && matchesSource;
  });

  // Paginação
  const totalPages = Math.ceil(filteredSignups.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSignups = filteredSignups.slice(startIndex, endIndex);

  // Reset página quando filtros mudam
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedSource]);

  const uniqueSources = Array.from(new Set(signups.map(s => s.utm_source).filter(Boolean)));

  const handleExportCSV = () => {
    const csvContent = [
      ['Email', 'Consentimento', 'Fonte', 'Meio', 'Campanha', 'Variante', 'Data de Cadastro'],
      ...filteredSignups.map(signup => [
        signup.email,
        signup.consent ? 'Sim' : 'Não',
        signup.utm_source || '',
        signup.utm_medium || '',
        signup.utm_campaign || '',
        signup.variant || '',
        new Date(signup.created_at).toLocaleDateString('pt-BR')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `waitlist-signups-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast({
      title: 'Exportação concluída',
      description: 'Lista de inscrições exportada com sucesso!'
    });
  };

  // Função para abrir modal de confirmação de criação de convites
  const handleOpenCreateInvitesModal = (count: number) => {
    setCreateInvitesModal({ open: true, count });
  };

  // Função para criar convites em lote para os primeiros usuários
  const handleCreatePriorityInvites = async (count: number = 100) => {
    try {
      setInviteLoading(true);
      setCreateInvitesModal({ open: false, count: 0 });
      
      const { data, error } = await supabase.rpc('create_priority_invites', {
        limit_count: count,
        priority_level: 1
      });

      if (error) {
        console.error('Erro ao criar convites:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível criar os convites.',
          variant: 'destructive'
        });
        return;
      }

      toast({
        title: 'Convites criados',
        description: `${data} convites criados com sucesso para os primeiros usuários.`,
      });

      // Recarregar dados
      handleRefresh();
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: 'Erro',
        description: 'Erro inesperado ao criar convites.',
        variant: 'destructive'
      });
    } finally {
      setInviteLoading(false);
    }
  };

  // Função para criar convite individual (sem enviar)
  const handleCreateInvite = async (email: string) => {
    try {
      setInviteLoading(true);
      
      // Usar a função RPC para criar o convite
      const { data, error } = await supabase.rpc('create_individual_invite', {
        user_email: email,
        invite_priority: 1,
        invite_notes: 'Convite criado individualmente pelo admin'
      });

      if (error) {
        console.error('Erro ao criar convite:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível criar o convite.',
          variant: 'destructive'
        });
        return;
      }

      // Verificar a resposta da função RPC
      const result = data?.[0];
      if (!result?.invite_id) {
        toast({
          title: 'Informação',
          description: result?.message || 'Não foi possível criar o convite.',
          variant: result?.message?.includes('já possui') ? 'default' : 'destructive'
        });
        return;
      }

      toast({
        title: 'Convite criado',
        description: `Convite criado com sucesso para ${email}. Código: ${result.invite_code}`,
      });

      // Recarregar dados
      handleRefresh();
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: 'Erro',
        description: 'Erro inesperado ao criar convite.',
        variant: 'destructive'
      });
    } finally {
      setInviteLoading(false);
    }
  };

  // Função para enviar convite individual
  const handleSendInvite = async (email: string) => {
    try {
      setInviteLoading(true);
      
      // Verificar se já existe convite para este email
      let existingInvite = invites.find(invite => invite.email === email);
      
      if (!existingInvite) {
        // Criar convite primeiro usando a função RPC
        const { data: createData, error: createError } = await supabase.rpc('create_individual_invite', {
          user_email: email,
          invite_priority: 1,
          invite_notes: 'Convite criado via admin para envio imediato'
        });

        if (createError) {
          console.error('Erro ao criar convite:', createError);
          toast({
            title: 'Erro',
            description: 'Não foi possível criar o convite.',
            variant: 'destructive'
          });
          return;
        }

        const result = createData?.[0];
        if (!result?.invite_id) {
          toast({
            title: 'Informação',
            description: result?.message || 'Não foi possível criar o convite.',
            variant: result?.message?.includes('já possui') ? 'default' : 'destructive'
          });
          return;
        }

        // Buscar o convite criado para ter todos os dados
        const { data: newInviteData } = await supabase
          .from('waitlist_invites')
          .select('*')
          .eq('id', result.invite_id)
          .single();

        existingInvite = newInviteData;
      }

      // Verificar se o EmailService está configurado
      if (!emailService.isConfigured()) {
        toast({
          title: 'Erro de Configuração',
          description: 'Serviço de e-mail não está configurado. Verifique as configurações do Mailtrap.',
          variant: 'destructive'
        });
        return;
      }

      // Buscar dados do usuário para o e-mail
      const signup = signups.find(s => s.email === email);
      const userName = signup?.email.split('@')[0] || 'Usuário'; // Usar parte do email como nome temporário

      // Verificar se o convite existe antes de enviar
      if (!existingInvite) {
        toast({
          title: 'Erro',
          description: 'Não foi possível encontrar o convite para envio.',
          variant: 'destructive'
        });
        return;
      }

      // Enviar convite usando o EmailService
      const emailResult = await emailService.sendWaitlistInvite({
        email: existingInvite.email,
        name: userName,
        inviteCode: existingInvite.invite_code,
        expiresAt: existingInvite.expires_at
      });

      if (!emailResult.success) {
        console.error('Erro ao enviar e-mail:', emailResult.error);
        toast({
          title: 'Erro no Envio',
          description: emailResult.error || 'Não foi possível enviar o e-mail.',
          variant: 'destructive'
        });
        return;
      }

      // Remover verificação de modo de teste - não mais necessária

      // Atualizar status do convite no banco
      const { error: updateError } = await supabase
        .from('waitlist_invites')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', existingInvite.id);

      if (updateError) {
        console.error('Erro ao atualizar status do convite:', updateError);
      }

      toast({
        title: 'Convite enviado',
        description: `Convite enviado para ${email}. Código: ${existingInvite.invite_code}`,
      });

      // Recarregar dados
      handleRefresh();
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: 'Erro',
        description: 'Erro inesperado ao enviar convite.',
        variant: 'destructive'
      });
    } finally {
      setInviteLoading(false);
    }
  };

  // Função para enviar todos os convites pendentes
  const handleSendAllPendingInvites = async () => {
    try {
      setInviteLoading(true);
      setConfirmSendAllModal(false);
      
      // Verificar se o EmailService está configurado
      if (!emailService.isConfigured()) {
        toast({
          title: 'Erro de Configuração',
          description: 'Serviço de e-mail não está configurado. Verifique as configurações do Resend.',
          variant: 'destructive'
        });
        return;
      }
      
      // Buscar todos os convites pendentes
      const pendingInvites = invites.filter(invite => invite.status === 'pending');
      
      if (pendingInvites.length === 0) {
        toast({
          title: 'Informação',
          description: 'Não há convites pendentes para enviar.',
          variant: 'default'
        });
        return;
      }

      let successCount = 0;
      let errorCount = 0;
      // Variável testModeWarnings removida - não mais necessária
      const sentInviteIds: string[] = [];

      // Enviar cada convite pendente
      for (const invite of pendingInvites) {
        try {
          // Buscar dados do usuário para o e-mail
          const signup = signups.find(s => s.email === invite.email);
          const userName = signup?.email.split('@')[0] || 'Usuário'; // Usar parte do email como nome temporário

          // Enviar convite usando o EmailService
          const emailResult = await emailService.sendWaitlistInvite({
            email: invite.email,
            name: userName,
            inviteCode: invite.invite_code,
            expiresAt: invite.expires_at
          });

          if (emailResult.success) {
            successCount++;
            sentInviteIds.push(invite.id);
            // Verificação de warning removida - não mais necessária
          } else {
            console.error(`Erro ao enviar convite para ${invite.email}:`, emailResult.error);
            errorCount++;
          }
        } catch (error) {
          console.error(`Erro inesperado ao enviar convite para ${invite.email}:`, error);
          errorCount++;
        }
      }

      // Atualizar status dos convites enviados com sucesso
      if (sentInviteIds.length > 0) {
        const { error: updateError } = await supabase
          .from('waitlist_invites')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .in('id', sentInviteIds);

        if (updateError) {
          console.error('Erro ao atualizar status dos convites:', updateError);
        }
      }

      // Mostrar resultado
      if (successCount > 0) {
        const baseMessage = `${successCount} convites enviados com sucesso${errorCount > 0 ? `. ${errorCount} falharam.` : '.'}`;
        // Remover mensagem de modo de teste - não mais necessária
        
        toast({
          title: 'Convites enviados',
          description: baseMessage,
          variant: errorCount > 0 ? 'default' : 'default'
        });
      }

      if (errorCount > 0 && successCount === 0) {
        toast({
          title: 'Erro',
          description: `Falha ao enviar ${errorCount} convites.`,
          variant: 'destructive'
        });
      }

      // Recarregar dados
      handleRefresh();
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: 'Erro',
        description: 'Erro inesperado ao enviar convites.',
        variant: 'destructive'
      });
    } finally {
      setInviteLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      // Carregar signups
      const { data: signupsData, error: signupsError } = await supabase
        .from('waitlist_signups')
        .select('*')
        .order('created_at', { ascending: false });

      if (signupsError) {
        toast({
          title: 'Erro',
          description: 'Não foi possível atualizar os dados.',
          variant: 'destructive'
        });
        return;
      }

      // Carregar convites
      const { data: invitesData, error: invitesError } = await supabase
        .from('waitlist_invites')
        .select('*')
        .order('created_at', { ascending: false });

      if (invitesError) {
        console.error('Erro ao carregar convites:', invitesError);
      }

      // Carregar estatísticas de convites
      const { data: inviteStatsData, error: statsError } = await supabase
        .from('waitlist_invite_stats')
        .select('*')
        .single();

      if (statsError) {
        console.error('Erro ao carregar estatísticas de convites:', statsError);
      }

      const signups = signupsData || [];
      const invites = invitesData || [];
      
      setSignups(signups);
      setInvites(invites);
      
      if (inviteStatsData) {
        setInviteStats(inviteStatsData);
      }
      
      // Recalcular estatísticas
      const today = new Date().toDateString();
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      
      setStats({
        total: signups.length,
        today: signups.filter(s => new Date(s.created_at).toDateString() === today).length,
        thisWeek: signups.filter(s => new Date(s.created_at) >= oneWeekAgo).length,
        thisMonth: signups.filter(s => new Date(s.created_at) >= oneMonthAgo).length,
        withConsent: signups.filter(s => s.consent).length
      });
      
      toast({
        title: 'Dados atualizados',
        description: 'Lista de waitlist e convites atualizados com sucesso!'
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro inesperado ao atualizar dados.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Função para usar templates de campanha
  const handleUseTemplate = async (templateType: string) => {
    try {
      // Definir configurações do template
      const templateConfigs = {
        general_launch: {
          name: 'Lançamento Geral - StorySpark',
          type: 'standard',
          description: 'Campanha de lançamento geral da plataforma StorySpark para todos os usuários da waitlist',
          priority: '2',
          inviteLimit: '100',
          consentOnly: false,
          recentFirst: true,
          sourceFilter: false
        },
        vip_access: {
          name: 'Acesso VIP - StorySpark',
          type: 'vip',
          description: 'Campanha exclusiva para usuários VIP com acesso antecipado e benefícios especiais',
          priority: '1',
          inviteLimit: '50',
          consentOnly: true,
          recentFirst: false,
          sourceFilter: false
        },
        early_access: {
          name: 'Early Access - Beta Testers',
          type: 'beta',
          description: 'Campanha para beta testers e early adopters com acesso antecipado às funcionalidades',
          priority: '1',
          inviteLimit: '25',
          consentOnly: true,
          recentFirst: false,
          sourceFilter: false
        }
      };

      const config = templateConfigs[templateType as keyof typeof templateConfigs];
      
      if (!config) {
        toast({
          title: 'Erro',
          description: 'Template não encontrado.',
          variant: 'destructive'
        });
        return;
      }

      // Preencher o formulário com os dados do template
      setCampaignForm({
        name: config.name,
        type: config.type,
        description: config.description,
        priority: config.priority,
        inviteLimit: config.inviteLimit,
        consentOnly: config.consentOnly,
        recentFirst: config.recentFirst,
        sourceFilter: config.sourceFilter
      });

      // Abrir modal de criação de campanha
      setCreateCampaignModal({
        isOpen: true,
        campaign: config
      });

      toast({
        title: 'Template carregado',
        description: `Template "${config.name}" carregado com sucesso! Revise as configurações e clique em "Criar Campanha".`
      });

    } catch (error) {
      console.error('Erro ao usar template:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar template de campanha.',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin mr-2" />
        <span>Carregando dados da waitlist...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Debug Helper - Remover em produção */}
      {showAuthHelper && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-yellow-800">Helper de Autenticação</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowAuthHelper(false)}
              className="text-yellow-600 hover:text-yellow-800"
            >
              ✕
            </Button>
          </div>
          <AuthLoginHelper />
        </div>
      )}
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Waitlist</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie inscrições na lista de espera e envie convites de acesso
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowAuthHelper(!showAuthHelper)}
            className="text-xs"
          >
            🔧 Debug Auth
          </Button>
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button onClick={handleExportCSV}>
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards - Waitlist */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Estatísticas da Lista de Espera</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Inscrições</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">+12% desde o mês passado</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hoje</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.today}</div>
              <p className="text-xs text-muted-foreground">Novas inscrições</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.thisWeek}</div>
              <p className="text-xs text-muted-foreground">+25% vs semana anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Este Mês</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.thisMonth}</div>
              <p className="text-xs text-muted-foreground">Meta: 50 inscrições</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Com Consentimento</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.withConsent}</div>
              <p className="text-xs text-muted-foreground">{Math.round((stats.withConsent / stats.total) * 100)}% do total</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stats Cards - Invites */}
      <div className="mb-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Gerenciamento de Convites</h3>
          <p className="text-sm text-muted-foreground">
            Crie convites em lote para os primeiros usuários da lista de espera
          </p>
        </div>
        <div className="flex gap-2 mb-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={() => handleOpenCreateInvitesModal(100)}
                  disabled={inviteLoading}
                  className="bg-primary hover:bg-primary/90"
                >
                  {inviteLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Criar 100 Convites
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Cria 100 convites prioritários para os primeiros usuários da lista de espera.<br/>
                Os convites ficam pendentes até serem enviados manualmente.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={() => handleOpenCreateInvitesModal(500)}
                  disabled={inviteLoading}
                  variant="outline"
                >
                  {inviteLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Criar 500 Convites
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Cria 500 convites prioritários para os primeiros usuários da lista de espera.<br/>
                Os convites ficam pendentes até serem enviados manualmente.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={() => setConfirmSendAllModal(true)}
                  disabled={inviteLoading || inviteStats.pending_invites === 0}
                  variant="secondary"
                  className="ml-2"
                >
                  {inviteLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Enviar Todos Pendentes ({inviteStats.pending_invites})
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Abre confirmação para enviar todos os convites pendentes.<br/>
                Você poderá revisar antes de confirmar o envio.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-medium text-blue-900 mb-3 flex items-center">
            <Mail className="w-4 h-4 mr-2" />
            Fluxo de Convites em Lote - Como Funciona:
          </h4>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <h5 className="text-xs font-semibold text-blue-800 mb-2 uppercase tracking-wide">1. Criação de Convites</h5>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Convites são criados com status <strong>"pendente"</strong></li>
                <li>• Prioridade para usuários com consentimento de marketing</li>
                <li>• Seleção automática dos primeiros da lista de espera</li>
                <li>• Cada convite recebe um código único e data de expiração</li>
              </ul>
            </div>
            <div>
              <h5 className="text-xs font-semibold text-blue-800 mb-2 uppercase tracking-wide">2. Envio de Convites</h5>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• <strong>Individual:</strong> Na aba "Convites", clique em "Enviar Convite"</li>
                <li>• <strong>Em Lote:</strong> Use o botão "Enviar Todos Pendentes"</li>
                <li>• Status muda para <strong>"enviado"</strong> após o envio</li>
                <li>• Usuário recebe email com link de acesso único</li>
              </ul>
            </div>
          </div>
          <div className="mt-3 p-3 bg-blue-100 rounded border border-blue-300">
            <p className="text-xs text-blue-800">
              <strong>💡 Dica:</strong> Criar convites em lote não os envia automaticamente. Isso permite revisar e personalizar antes do envio, 
              garantindo controle total sobre quando e como os usuários recebem acesso à plataforma.
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Convites</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inviteStats.total_invites}</div>
              <p className="text-xs text-muted-foreground">convites criados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Calendar className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inviteStats.pending_invites}</div>
              <p className="text-xs text-muted-foreground">aguardando envio</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enviados</CardTitle>
              <Send className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inviteStats.sent_invites}</div>
              <p className="text-xs text-muted-foreground">convites enviados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aceitos</CardTitle>
              <UserPlus className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inviteStats.accepted_invites}</div>
              <p className="text-xs text-muted-foreground">acessos liberados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expirados</CardTitle>
              <TrendingUp className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inviteStats.expired_invites}</div>
              <p className="text-xs text-muted-foreground">convites vencidos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa Aceitação</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inviteStats.acceptance_rate != null ? inviteStats.acceptance_rate.toFixed(1) : '0.0'}%</div>
              <p className="text-xs text-muted-foreground">conversão</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}

      <Tabs defaultValue="signups" className="space-y-4">
        <TabsList>
          <TabsTrigger value="signups">Leads</TabsTrigger>
          <TabsTrigger value="invites">Convites</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
        </TabsList>

        <TabsContent value="signups" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filtros e Busca</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="w-48">
                  <select
                    value={selectedSource}
                    onChange={(e) => setSelectedSource(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="all">Todas as fontes</option>
                    {uniqueSources.map(source => (
                      <option key={source} value={source || ''}>{source || 'Direct'}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Signups Table */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Leads ({filteredSignups.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Consentimento</TableHead>
                    <TableHead>Fonte</TableHead>
                    <TableHead>Campanha</TableHead>
                    <TableHead>Variante</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedSignups.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        {searchTerm || selectedSource !== 'all' ? 'Nenhuma inscrição encontrada com os filtros aplicados.' : 'Nenhuma inscrição encontrada.'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedSignups.map((signup) => (
                      <TableRow key={signup.id}>
                        <TableCell className="font-medium">{signup.email}</TableCell>
                        <TableCell>
                          <Badge variant={signup.consent ? 'default' : 'secondary'}>
                            {signup.consent ? 'Sim' : 'Não'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{signup.utm_source || 'Direct'}</Badge>
                        </TableCell>
                        <TableCell>{signup.utm_campaign || '-'}</TableCell>
                        <TableCell>{signup.variant || '-'}</TableCell>
                        <TableCell>
                          {new Date(signup.created_at).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {
                                // Verificar se já existe convite para este email
                                const existingInvite = invites.find(invite => invite.email === signup.email);
                                if (existingInvite) {
                                  setSendInviteModal({ open: true, invite: existingInvite });
                                } else {
                                  // Criar um objeto temporário para o modal
                                  const tempInvite = {
                                    id: 'temp',
                                    waitlist_signup_id: signup.id,
                                    email: signup.email,
                                    status: 'pending' as const,
                                    invite_code: 'Será gerado',
                                    sent_at: null,
                                    accepted_at: null,
                                    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                                    priority: 1,
                                    notes: null,
                                    created_at: new Date().toISOString(),
                                    updated_at: new Date().toISOString()
                                  };
                                  setSendInviteModal({ open: true, invite: tempInvite });
                                }
                              }}>
                                <Send className="mr-2 h-4 w-4" />
                                Criar Convite
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                setSignupDetailsModal({ open: true, signup });
                              }}>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver Detalhes
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            
            {/* Controles de Paginação */}
            {filteredSignups.length > 0 && (
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Mostrando {startIndex + 1} a {Math.min(endIndex, filteredSignups.length)} de {filteredSignups.length} leads
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Anterior
                    </Button>
                    
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page => {
                          // Mostrar sempre primeira, última e páginas próximas à atual
                          return page === 1 || page === totalPages || 
                                 (page >= currentPage - 1 && page <= currentPage + 1);
                        })
                        .map((page, index, array) => {
                          // Adicionar "..." quando há lacunas
                          const prevPage = array[index - 1];
                          const showEllipsis = prevPage && page - prevPage > 1;
                          
                          return (
                            <React.Fragment key={page}>
                              {showEllipsis && (
                                <span className="px-2 text-muted-foreground">...</span>
                              )}
                              <Button
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                                className="w-8 h-8 p-0"
                              >
                                {page}
                              </Button>
                            </React.Fragment>
                          );
                        })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Próxima
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="invites" className="space-y-4">
          {/* Invites Table */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Convites ({invites.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Enviado em</TableHead>
                    <TableHead>Aceito em</TableHead>
                    <TableHead>Expira em</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invites.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        Nenhum convite encontrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    invites.map((invite) => (
                      <TableRow key={invite.id}>
                        <TableCell className="font-medium">{invite.email}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              invite.status === 'accepted' ? 'default' :
                              invite.status === 'sent' ? 'secondary' :
                              invite.status === 'expired' ? 'destructive' :
                              'outline'
                            }
                          >
                            {invite.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                            {invite.status === 'sent' && <Send className="w-3 h-3 mr-1" />}
                            {invite.status === 'accepted' && <CheckCircle className="w-3 h-3 mr-1" />}
                            {invite.status === 'expired' && <XCircle className="w-3 h-3 mr-1" />}
                            {invite.status === 'pending' ? 'Pendente' :
                             invite.status === 'sent' ? 'Enviado' :
                             invite.status === 'accepted' ? 'Aceito' :
                             'Expirado'}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{invite.invite_code}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{invite.priority}</Badge>
                        </TableCell>
                        <TableCell>
                          {invite.sent_at ? new Date(invite.sent_at).toLocaleDateString('pt-BR') : '-'}
                        </TableCell>
                        <TableCell>
                          {invite.accepted_at ? new Date(invite.accepted_at).toLocaleDateString('pt-BR') : '-'}
                        </TableCell>
                        <TableCell>
                          {new Date(invite.expires_at).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {invite.status === 'pending' && (
                                <DropdownMenuItem onClick={() => setSendInviteModal({ open: true, invite })}>
                                  <Send className="mr-2 h-4 w-4" />
                                  Enviar Convite
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => setDetailsModal({ open: true, invite })}>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver Detalhes
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {/* Métricas de Performance */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {inviteStats.acceptance_rate ? `${inviteStats.acceptance_rate.toFixed(1)}%` : '0%'}
                </div>
                <p className="text-xs text-muted-foreground">
                  convites aceitos vs enviados
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Crescimento Semanal</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{stats.thisWeek}</div>
                <p className="text-xs text-muted-foreground">
                  novas inscrições esta semana
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.3d</div>
                <p className="text-xs text-muted-foreground">
                  entre convite e aceitação
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fontes Top</CardTitle>
                <Filter className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Direct</div>
                <p className="text-xs text-muted-foreground">
                  principal fonte de tráfego
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Análise por Fonte */}
          <Card>
            <CardHeader>
              <CardTitle>Análise por Fonte de Tráfego</CardTitle>
              <p className="text-muted-foreground">Distribuição das inscrições por origem</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(() => {
                  const sources = signups.reduce((acc, signup) => {
                    const source = signup.utm_source || 'Direct';
                    acc[source] = (acc[source] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>);
                  
                  const sortedSources = Object.entries(sources)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 5);
                  
                  return sortedSources.map(([source, count]) => {
                    const percentage = ((count / signups.length) * 100).toFixed(1);
                    return (
                      <div key={source} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{source}</Badge>
                          <span className="text-sm text-muted-foreground">{count} inscrições</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{percentage}%</span>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </CardContent>
          </Card>
          
          {/* Status dos Convites */}
          <Card>
            <CardHeader>
              <CardTitle>Status dos Convites</CardTitle>
              <p className="text-muted-foreground">Distribuição atual dos convites por status</p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Pendentes</span>
                    </div>
                    <span className="font-medium">{inviteStats.pending_invites}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Enviados</span>
                    </div>
                    <span className="font-medium">{inviteStats.sent_invites}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Aceitos</span>
                    </div>
                    <span className="font-medium">{inviteStats.accepted_invites}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm">Expirados</span>
                    </div>
                    <span className="font-medium">{inviteStats.expired_invites}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          {/* Header com ações */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Campanhas de Convites</h2>
              <p className="text-muted-foreground">Gerencie campanhas personalizadas para diferentes segmentos</p>
            </div>
            <Button onClick={() => setCreateCampaignModal({ isOpen: true, campaign: null })}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Campanha
            </Button>
          </div>
          
          {/* Campanhas Ativas */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Campanha Padrão */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Campanha Padrão</CardTitle>
                  <Badge variant="default">Ativa</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Convites gerais da waitlist</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Convites enviados:</span>
                    <span className="font-medium">{inviteStats.sent_invites}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Taxa de aceitação:</span>
                    <span className="font-medium">
                      {inviteStats.acceptance_rate ? `${inviteStats.acceptance_rate.toFixed(1)}%` : '0%'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Criada em:</span>
                    <span className="font-medium">01/01/2024</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <UserPlus className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Relatório
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Campanha VIP */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Campanha VIP</CardTitle>
                  <Badge variant="secondary">Pausada</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Para usuários prioritários</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Convites enviados:</span>
                    <span className="font-medium">45</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Taxa de aceitação:</span>
                    <span className="font-medium">78.5%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Criada em:</span>
                    <span className="font-medium">15/01/2024</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <UserPlus className="w-4 h-4 mr-1" />
                    Ativar
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Relatório
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Card para criar nova campanha */}
            <Card className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer" 
                  onClick={() => toast({ title: 'Em desenvolvimento', description: 'Funcionalidade será implementada em breve' })}>
              <CardContent className="flex flex-col items-center justify-center h-full py-12">
                <Plus className="w-8 h-8 text-muted-foreground mb-2" />
                <h3 className="font-medium mb-1">Nova Campanha</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Crie uma campanha personalizada
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Templates de Campanha */}
          <Card>
            <CardHeader>
              <CardTitle>Templates de Campanha</CardTitle>
              <p className="text-muted-foreground">Modelos pré-configurados para diferentes tipos de campanha</p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                     onClick={() => handleUseTemplate('general_launch')}>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Lançamento Geral</h4>
                      <p className="text-sm text-muted-foreground">Para todos os usuários</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Template padrão para convites de lançamento de produto
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Usar Template
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                     onClick={() => handleUseTemplate('vip_access')}>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <UserPlus className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Acesso VIP</h4>
                      <p className="text-sm text-muted-foreground">Para usuários premium</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Convites exclusivos com benefícios especiais
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Usar Template
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                     onClick={() => handleUseTemplate('early_access')}>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Early Access</h4>
                      <p className="text-sm text-muted-foreground">Acesso antecipado</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Para beta testers e early adopters
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Usar Template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>


      </Tabs>

      {/* Modal de Confirmação para Criar Convites */}
      <Dialog open={createInvitesModal.open} onOpenChange={(open) => setCreateInvitesModal({ open, count: 0 })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Criação de Convites</DialogTitle>
            <DialogDescription>
              Você está prestes a criar {createInvitesModal.count} convites prioritários para os primeiros usuários da lista de espera.
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Os convites serão criados com status "pendente" e poderão ser enviados posteriormente.
              Usuários com consentimento de marketing terão prioridade.
            </p>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setCreateInvitesModal({ open: false, count: 0 })}
              disabled={inviteLoading}
            >
              Cancelar
            </Button>
            <Button 
              onClick={() => handleCreatePriorityInvites(createInvitesModal.count)}
              disabled={inviteLoading}
            >
              {inviteLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Criar {createInvitesModal.count} Convites
            </Button>
          </DialogFooter>
        </DialogContent>
       </Dialog>

       {/* Modal de Envio de Convite */}
       <Dialog open={sendInviteModal.open} onOpenChange={(open) => setSendInviteModal({ open, invite: null })}>
         <DialogContent>
           <DialogHeader>
             <DialogTitle>Enviar Convite</DialogTitle>
             <DialogDescription>
               Confirme o envio do convite para o usuário selecionado.
             </DialogDescription>
           </DialogHeader>
           {sendInviteModal.invite && (
             <div className="py-4 space-y-3">
               <div>
                 <label className="text-sm font-medium">Email:</label>
                 <p className="text-sm text-muted-foreground">{sendInviteModal.invite?.email}</p>
               </div>
               <div>
                 <label className="text-sm font-medium">Código do Convite:</label>
                 <p className="text-sm font-mono bg-muted p-2 rounded">{sendInviteModal.invite?.invite_code}</p>
               </div>
               <div>
                 <label className="text-sm font-medium">Prioridade:</label>
                 <p className="text-sm text-muted-foreground">{sendInviteModal.invite?.priority}</p>
               </div>
             </div>
           )}
           <DialogFooter>
             <Button 
               variant="outline" 
               onClick={() => setSendInviteModal({ open: false, invite: null })}
               disabled={inviteLoading}
             >
               Cancelar
             </Button>
             <Button 
               onClick={() => {
                 if (sendInviteModal.invite) {
                   handleSendInvite(sendInviteModal.invite.email)
                   setSendInviteModal({ open: false, invite: null })
                 }
               }}
               disabled={inviteLoading}
             >
               {inviteLoading ? (
                 <Loader2 className="h-4 w-4 mr-2 animate-spin" />
               ) : (
                 <Send className="h-4 w-4 mr-2" />
               )}
               Enviar Convite
             </Button>
           </DialogFooter>
         </DialogContent>
       </Dialog>

       {/* Modal de Detalhes do Convite */}
       <Dialog open={detailsModal.open} onOpenChange={(open) => setDetailsModal({ open, invite: null })}>
         <DialogContent className="max-w-2xl">
           <DialogHeader>
             <DialogTitle>Detalhes do Convite</DialogTitle>
             <DialogDescription>
               Informações completas sobre o convite selecionado.
             </DialogDescription>
           </DialogHeader>
           {detailsModal.invite && (
             <div className="py-4 space-y-4">
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="text-sm font-medium">Email:</label>
                   <p className="text-sm text-muted-foreground">{detailsModal.invite.email}</p>
                 </div>
                 <div>
                   <label className="text-sm font-medium">Status:</label>
                   <Badge 
                     variant={detailsModal.invite.status === 'pending' ? 'secondary' : 
                             detailsModal.invite.status === 'sent' ? 'default' : 
                             detailsModal.invite.status === 'accepted' ? 'default' : 'destructive'}
                     className={detailsModal.invite.status === 'accepted' ? 'bg-green-100 text-green-800' : ''}
                   >
                     {detailsModal.invite.status === 'pending' ? 'Pendente' :
                      detailsModal.invite.status === 'sent' ? 'Enviado' :
                      detailsModal.invite.status === 'accepted' ? 'Aceito' :
                      detailsModal.invite.status === 'expired' ? 'Expirado' : detailsModal.invite.status}
                   </Badge>
                 </div>
                 <div>
                   <label className="text-sm font-medium">Código do Convite:</label>
                   <p className="text-sm font-mono bg-muted p-2 rounded">{detailsModal.invite.invite_code}</p>
                 </div>
                 <div>
                   <label className="text-sm font-medium">Prioridade:</label>
                   <p className="text-sm text-muted-foreground">{detailsModal.invite.priority}</p>
                 </div>
                 <div>
                   <label className="text-sm font-medium">Data de Criação:</label>
                   <p className="text-sm text-muted-foreground">
                     {new Date(detailsModal.invite.created_at).toLocaleString('pt-BR')}
                   </p>
                 </div>
                 {detailsModal.invite.sent_at && (
                   <div>
                     <label className="text-sm font-medium">Data de Envio:</label>
                     <p className="text-sm text-muted-foreground">
                       {new Date(detailsModal.invite.sent_at).toLocaleString('pt-BR')}
                     </p>
                   </div>
                 )}
                 {detailsModal.invite.accepted_at && (
                   <div>
                     <label className="text-sm font-medium">Data de Aceitação:</label>
                     <p className="text-sm text-muted-foreground">
                       {new Date(detailsModal.invite.accepted_at).toLocaleString('pt-BR')}
                     </p>
                   </div>
                 )}
                 <div>
                   <label className="text-sm font-medium">Data de Expiração:</label>
                   <p className="text-sm text-muted-foreground">
                     {new Date(detailsModal.invite.expires_at).toLocaleString('pt-BR')}
                   </p>
                 </div>
               </div>
               
               {detailsModal.invite.status === 'pending' && (
                 <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                   <h4 className="text-sm font-medium text-blue-900 mb-2">Ações Disponíveis</h4>
                   <p className="text-sm text-blue-700 mb-3">
                     Este convite ainda não foi enviado. Você pode enviá-lo agora.
                   </p>
                   <Button 
                     onClick={() => {
                       if (detailsModal.invite) {
                         handleSendInvite(detailsModal.invite.email)
                         setDetailsModal({ open: false, invite: null })
                       }
                     }}
                     disabled={inviteLoading}
                     size="sm"
                   >
                     {inviteLoading ? (
                       <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                     ) : (
                       <Send className="h-4 w-4 mr-2" />
                     )}
                     Enviar Convite
                   </Button>
                 </div>
               )}
             </div>
           )}
           <DialogFooter>
             <Button 
               variant="outline" 
               onClick={() => setDetailsModal({ open: false, invite: null })}
             >
               Fechar
             </Button>
           </DialogFooter>
         </DialogContent>
       </Dialog>

       {/* Modal de Detalhes da Inscrição */}
       <Dialog open={signupDetailsModal.open} onOpenChange={(open) => setSignupDetailsModal({ open, signup: null })}>
         <DialogContent className="max-w-2xl">
           <DialogHeader>
             <DialogTitle>Detalhes da Inscrição</DialogTitle>
             <DialogDescription>
               Informações completas sobre a inscrição na lista de espera.
             </DialogDescription>
           </DialogHeader>
           {signupDetailsModal.signup && (
             <div className="py-4 space-y-4">
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="text-sm font-medium">Email:</label>
                   <p className="text-sm text-muted-foreground">{signupDetailsModal.signup.email}</p>
                 </div>
                 <div>
                   <label className="text-sm font-medium">Consentimento de Marketing:</label>
                   <Badge variant={signupDetailsModal.signup.consent ? 'default' : 'secondary'}>
                     {signupDetailsModal.signup.consent ? 'Sim' : 'Não'}
                   </Badge>
                 </div>
                 <div>
                   <label className="text-sm font-medium">Data de Inscrição:</label>
                   <p className="text-sm text-muted-foreground">
                     {new Date(signupDetailsModal.signup.created_at).toLocaleString('pt-BR')}
                   </p>
                 </div>
                 <div>
                   <label className="text-sm font-medium">Variante:</label>
                   <p className="text-sm text-muted-foreground">
                     {signupDetailsModal.signup.variant || 'Não especificada'}
                   </p>
                 </div>
               </div>
               
               {/* Informações de UTM */}
               <div className="mt-6">
                 <h4 className="text-sm font-medium mb-3">Informações de Origem (UTM)</h4>
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="text-sm font-medium">Fonte (utm_source):</label>
                     <p className="text-sm text-muted-foreground">
                       {signupDetailsModal.signup.utm_source || 'Não especificada'}
                     </p>
                   </div>
                   <div>
                     <label className="text-sm font-medium">Meio (utm_medium):</label>
                     <p className="text-sm text-muted-foreground">
                       {signupDetailsModal.signup.utm_medium || 'Não especificado'}
                     </p>
                   </div>
                   <div>
                     <label className="text-sm font-medium">Campanha (utm_campaign):</label>
                     <p className="text-sm text-muted-foreground">
                       {signupDetailsModal.signup.utm_campaign || 'Não especificada'}
                     </p>
                   </div>
                   <div>
                     <label className="text-sm font-medium">Termo (utm_term):</label>
                     <p className="text-sm text-muted-foreground">
                       {signupDetailsModal.signup.utm_term || 'Não especificado'}
                     </p>
                   </div>
                   <div>
                     <label className="text-sm font-medium">Conteúdo (utm_content):</label>
                     <p className="text-sm text-muted-foreground">
                       {signupDetailsModal.signup.utm_content || 'Não especificado'}
                     </p>
                   </div>
                   <div>
                     <label className="text-sm font-medium">Referrer:</label>
                     <p className="text-sm text-muted-foreground break-all">
                       {signupDetailsModal.signup.referrer || 'Não especificado'}
                     </p>
                   </div>
                 </div>
               </div>
               
               {/* Status do Convite */}
               <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                 <h4 className="text-sm font-medium text-blue-900 mb-2">Status do Convite</h4>
                 {(() => {
                   const existingInvite = invites.find(invite => invite.email === signupDetailsModal.signup?.email);
                   if (existingInvite) {
                     return (
                       <div>
                         <p className="text-sm text-blue-700 mb-3">
                           Este usuário possui um convite com status: <strong>{existingInvite.status === 'pending' ? 'Pendente' :
                           existingInvite.status === 'sent' ? 'Enviado' :
                           existingInvite.status === 'accepted' ? 'Aceito' :
                           existingInvite.status === 'expired' ? 'Expirado' : existingInvite.status}</strong>
                         </p>
                         <div className="flex gap-2">
                           <Button 
                             onClick={() => {
                               setSignupDetailsModal({ open: false, signup: null });
                               setDetailsModal({ open: true, invite: existingInvite });
                             }}
                             size="sm"
                             variant="outline"
                           >
                             <Eye className="h-4 w-4 mr-2" />
                             Ver Detalhes do Convite
                           </Button>
                           {existingInvite.status === 'pending' && (
                             <Button 
                               onClick={() => {
                                 if (signupDetailsModal.signup) {
                                   handleSendInvite(signupDetailsModal.signup.email);
                                   setSignupDetailsModal({ open: false, signup: null });
                                 }
                               }}
                               disabled={inviteLoading}
                               size="sm"
                             >
                               {inviteLoading ? (
                                 <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                               ) : (
                                 <Send className="h-4 w-4 mr-2" />
                               )}
                               Enviar Convite
                             </Button>
                           )}
                         </div>
                       </div>
                     );
                   } else {
                     return (
                       <div>
                         <p className="text-sm text-blue-700 mb-3">
                           Este usuário ainda não possui convite. Você pode criar um convite agora.
                         </p>
                         <Button 
                           onClick={() => {
                             if (signupDetailsModal.signup) {
                               handleCreateInvite(signupDetailsModal.signup.email);
                               setSignupDetailsModal({ open: false, signup: null });
                             }
                           }}
                           disabled={inviteLoading}
                           size="sm"
                         >
                           {inviteLoading ? (
                             <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                           ) : (
                             <UserPlus className="h-4 w-4 mr-2" />
                           )}
                           Criar Convite
                         </Button>
                       </div>
                     );
                   }
                 })()}
               </div>
             </div>
           )}
           <DialogFooter>
             <Button 
               variant="outline" 
               onClick={() => setSignupDetailsModal({ open: false, signup: null })}
             >
               Fechar
             </Button>
           </DialogFooter>
         </DialogContent>
       </Dialog>

       {/* Modal de Criação de Campanha */}
       <Dialog open={createCampaignModal.isOpen} onOpenChange={(open) => {
         if (!open) {
           // Limpar formulário ao fechar
           setCampaignForm({
             name: '',
             type: '',
             description: '',
             priority: '',
             inviteLimit: '',
             consentOnly: false,
             recentFirst: false,
             sourceFilter: false
           });
         }
         setCreateCampaignModal({ isOpen: open, campaign: null });
       }}>
         <DialogContent className="max-w-2xl">
           <DialogHeader>
             <DialogTitle>Nova Campanha de Convites</DialogTitle>
             <DialogDescription>
               Crie uma nova campanha personalizada para envio de convites da waitlist.
             </DialogDescription>
           </DialogHeader>
           <div className="py-4 space-y-4">
             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <label className="text-sm font-medium">Nome da Campanha</label>
                 <Input 
                   placeholder="Ex: Lançamento VIP" 
                   value={campaignForm.name}
                   onChange={(e) => setCampaignForm(prev => ({ ...prev, name: e.target.value }))}
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium">Tipo de Campanha</label>
                 <Select value={campaignForm.type} onValueChange={(value) => setCampaignForm(prev => ({ ...prev, type: value }))}>
                   <SelectTrigger>
                     <SelectValue placeholder="Selecione o tipo" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="vip">VIP - Acesso Antecipado</SelectItem>
                     <SelectItem value="standard">Padrão - Convite Geral</SelectItem>
                     <SelectItem value="beta">Beta - Teste Fechado</SelectItem>
                     <SelectItem value="premium">Premium - Usuários Pagos</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
             </div>
             
             <div className="space-y-2">
               <label className="text-sm font-medium">Descrição</label>
               <Input 
                 placeholder="Descreva o objetivo desta campanha" 
                 value={campaignForm.description}
                 onChange={(e) => setCampaignForm(prev => ({ ...prev, description: e.target.value }))}
               />
             </div>
             
             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <label className="text-sm font-medium">Prioridade</label>
                 <Select value={campaignForm.priority} onValueChange={(value) => setCampaignForm(prev => ({ ...prev, priority: value }))}>
                   <SelectTrigger>
                     <SelectValue placeholder="Selecione a prioridade" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="1">Alta (1)</SelectItem>
                     <SelectItem value="2">Média (2)</SelectItem>
                     <SelectItem value="3">Baixa (3)</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium">Limite de Convites</label>
                 <Input 
                   type="number" 
                   placeholder="Ex: 100" 
                   value={campaignForm.inviteLimit}
                   onChange={(e) => setCampaignForm(prev => ({ ...prev, inviteLimit: e.target.value }))}
                 />
               </div>
             </div>
             
             <div className="space-y-2">
               <label className="text-sm font-medium">Critérios de Seleção</label>
               <div className="space-y-2">
                 <div className="flex items-center space-x-2">
                   <Checkbox 
                     id="consent" 
                     checked={campaignForm.consentOnly}
                     onCheckedChange={(checked) => setCampaignForm(prev => ({ ...prev, consentOnly: checked as boolean }))}
                   />
                   <label htmlFor="consent" className="text-sm">Apenas usuários com consentimento de marketing</label>
                 </div>
                 <div className="flex items-center space-x-2">
                   <Checkbox 
                     id="recent" 
                     checked={campaignForm.recentFirst}
                     onCheckedChange={(checked) => setCampaignForm(prev => ({ ...prev, recentFirst: checked as boolean }))}
                   />
                   <label htmlFor="recent" className="text-sm">Priorizar inscrições mais recentes</label>
                 </div>
                 <div className="flex items-center space-x-2">
                   <Checkbox 
                     id="source" 
                     checked={campaignForm.sourceFilter}
                     onCheckedChange={(checked) => setCampaignForm(prev => ({ ...prev, sourceFilter: checked as boolean }))}
                   />
                   <label htmlFor="source" className="text-sm">Filtrar por fonte específica</label>
                 </div>
               </div>
             </div>
             
             <div className="p-4 bg-blue-50 rounded-lg">
               <h4 className="text-sm font-medium text-blue-900 mb-2">Prévia da Campanha</h4>
               <div className="text-sm text-blue-800 space-y-1">
                 <p>• Convites serão criados com status "pendente"</p>
                 <p>• Você poderá revisar antes do envio</p>
                 <p>• Códigos únicos serão gerados automaticamente</p>
                 <p>• Data de expiração: 7 dias após o envio</p>
               </div>
             </div>
           </div>
           <DialogFooter>
             <Button 
               variant="outline" 
               onClick={() => setCreateCampaignModal({ isOpen: false, campaign: null })}
             >
               Cancelar
             </Button>
             <Button 
               onClick={() => {
                 toast({ 
                   title: 'Campanha criada!', 
                   description: 'A nova campanha foi criada com sucesso.' 
                 });
                 setCreateCampaignModal({ isOpen: false, campaign: null });
               }}
             >
               <Plus className="h-4 w-4 mr-2" />
               Criar Campanha
             </Button>
           </DialogFooter>
         </DialogContent>
       </Dialog>

       {/* Modal de Confirmação para Enviar Todos Pendentes */}
       <Dialog open={confirmSendAllModal} onOpenChange={setConfirmSendAllModal}>
         <DialogContent className="max-w-md">
           <DialogHeader>
             <DialogTitle className="flex items-center gap-2">
               <Send className="h-5 w-5 text-orange-500" />
               Confirmar Envio em Lote
             </DialogTitle>
             <DialogDescription>
               Você está prestes a enviar todos os convites pendentes.
             </DialogDescription>
           </DialogHeader>
           <div className="space-y-4">
             <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
               <div className="flex items-center gap-2 mb-2">
                 <Mail className="h-4 w-4 text-orange-600" />
                 <span className="font-medium text-orange-900">Resumo do Envio</span>
               </div>
               <div className="text-sm text-orange-800 space-y-1">
                 <p>• <strong>{inviteStats.pending_invites}</strong> convites serão enviados</p>
                 <p>• Os e-mails serão processados individualmente</p>
                 <p>• O status será atualizado automaticamente</p>
                 <p>• Esta ação não pode ser desfeita</p>
               </div>
             </div>
             
             {/* Aviso de modo de teste removido - não mais necessário */}
           </div>
           <DialogFooter>
             <Button 
               variant="outline" 
               onClick={() => setConfirmSendAllModal(false)}
               disabled={inviteLoading}
             >
               Cancelar
             </Button>
             <Button 
               onClick={handleSendAllPendingInvites}
               disabled={inviteLoading}
               className="bg-orange-600 hover:bg-orange-700"
             >
               {inviteLoading ? (
                 <Loader2 className="h-4 w-4 mr-2 animate-spin" />
               ) : (
                 <Send className="h-4 w-4 mr-2" />
               )}
               Confirmar Envio
             </Button>
           </DialogFooter>
         </DialogContent>
       </Dialog>
     </div>
   );
};

export default AdminWaitlist;export { AdminWaitlist as Component };
