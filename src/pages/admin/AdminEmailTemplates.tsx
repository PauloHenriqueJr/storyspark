import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CodeEditor } from '@/components/ui/code-editor';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Copy,
  Trash2,
  Mail,
  FileText,
  Loader2,
  AlertCircle,
  Save,
  X,
  Settings,
  Send,
  Users,
  BarChart3,
  Calendar,
  Target,
  TrendingUp,
  UserPlus,
  Activity,
  RefreshCw,
  Check,
  Download,
} from 'lucide-react';
import { toast } from 'sonner';
import { useEmailTemplatesFixed as useEmailTemplates, EmailTemplate } from '@/hooks/useEmailTemplatesFixed';
import { useEmailCampaigns } from '@/hooks/useEmailCampaignsReal';
import { useEmailLists } from '@/hooks/useEmailListsReal';
import { useEmailAnalytics } from '@/hooks/useEmailAnalyticsReal';
import { EmailList, EmailCampaign } from '@/services/emailMarketing';
import CreateEmailCampaignModal from '@/components/modals/CreateEmailCampaignModal';
import ViewCampaignModal from '@/components/modals/ViewCampaignModal';
import EditCampaignModal from '@/components/modals/EditCampaignModal';
import { emailService } from '@/services/emailService';
import { waitlistInviteTemplate } from '@/services/emailTemplates';
import { updateDatabaseTemplates } from '@/services/updateTemplatesService';

interface NewEmailTemplate {
  name: string;
  description: string;
  subject: string;
  html_content: string;
  text_content: string;
  variables: string[];
  tags: string[];
  category: string;
}

// Componente de preview isolado em iframe para evitar vazamento de CSS no app
const EmailPreview = ({ html, width }: { html: string; width?: number }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    try {
      doc.open();
      doc.write(html || '<html><head><style>body{margin:0;padding:16px;font-family:system-ui,Segoe UI,Roboto,sans-serif;color:#6b7280;background-color:#ffffff}</style></head><body>Sem conteúdo HTML</body></html>');
      doc.close();
    } catch { }

    const resize = () => {
      if (!iframe.contentDocument) return;
      const body = iframe.contentDocument.body;
      const htmlEl = iframe.contentDocument.documentElement;
      const height = Math.max(
        body?.scrollHeight || 0,
        body?.offsetHeight || 0,
        htmlEl?.clientHeight || 0,
        htmlEl?.scrollHeight || 0,
        htmlEl?.offsetHeight || 0
      );
      iframe.style.height = Math.min(Math.max(height, 300), 1400) + 'px';
    };

    const t1 = setTimeout(resize, 50);
    const t2 = setTimeout(resize, 250);
    let observer: MutationObserver | null = null;
    try {
      observer = new MutationObserver(() => resize());
      observer.observe(doc.documentElement, { childList: true, subtree: true, attributes: true });
    } catch { }
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      observer?.disconnect();
    };
  }, [html]);

  return (
    <div className="border rounded-lg overflow-hidden" style={{ width: width ? width : '100%', backgroundColor: 'transparent' }}>
      <iframe
        ref={iframeRef}
        title="Email Preview"
        className="w-full"
        style={{ height: 300, border: 'none', backgroundColor: 'white' }}
        sandbox="allow-same-origin allow-scripts"
        loading="lazy"
      />
    </div>
  );
};

const AdminEmailTemplates = () => {
  const {
    templates,
    loading,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    loadTemplates // Adicionado para recarregar templates
  } = useEmailTemplates();

  // Hook para campanhas
  const {
    campaigns,
    isLoading: campaignsLoading,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    sendCampaign,
    refreshCampaigns: loadCampaigns
  } = useEmailCampaigns();

  // Hook para listas
  const {
    lists,
    contacts,
    isLoading: listsLoading,
    createList,
    updateList,
    deleteList,
    addContact,
    updateContact,
    removeContact,
    importContacts,
    exportContacts,
    refreshLists: loadLists,
    statistics: listsStats
  } = useEmailLists();

  // Hook para analytics
  const {
    analytics: analyticsData,
    campaignPerformance: campaignPerformances,
  } = useEmailAnalytics();

  // Estados para templates
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [activeTab, setActiveTab] = useState('templates');
  const [dialogActiveTab, setDialogActiveTab] = useState('html');

  // Estados para campanhas
  const [isCreateCampaignModalOpen, setIsCreateCampaignModalOpen] = useState(false);
  const [isViewCampaignModalOpen, setIsViewCampaignModalOpen] = useState(false);
  const [isEditCampaignModalOpen, setIsEditCampaignModalOpen] = useState(false);
  const [isDeleteCampaignDialogOpen, setIsDeleteCampaignDialogOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<EmailCampaign | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<EmailCampaign | null>(null);

  // Handlers para campanhas
  const handleViewCampaign = (campaign: EmailCampaign) => {
    setSelectedCampaign(campaign);
    setIsViewCampaignModalOpen(true);
  };

  const handleEditCampaign = (campaign: EmailCampaign) => {
    setSelectedCampaign(campaign);
    setIsEditCampaignModalOpen(true);
  };

  const handleDuplicateCampaign = async (campaign: EmailCampaign) => {
    try {
      const duplicatedCampaign = {
        name: `${campaign.name} (Cópia)`,
        subject: campaign.subject,
        preview_text: campaign.preview_text || '',
        html_content: campaign.html_content,
        text_content: campaign.text_content || '',
        template_id: campaign.template_id || undefined,
        status: 'draft' as const,
        send_type: 'immediate' as const,
        scheduled_at: undefined,
        total_recipients: 0,
        tags: campaign.tags || [],
        settings: campaign.settings || {}
      };

      await createCampaign(duplicatedCampaign);
      await loadCampaigns();

      toast.success('Campanha duplicada com sucesso!');
    } catch (error) {
      console.error('Erro ao duplicar campanha:', error);
      toast.error('Não foi possível duplicar a campanha');
    }
  };

  const handleDeleteCampaign = async (campaign: EmailCampaign) => {
    setCampaignToDelete(campaign);
    setIsDeleteCampaignDialogOpen(true);
  };

  const confirmDeleteCampaign = async () => {
    if (!campaignToDelete) return;

    try {
      await deleteCampaign(campaignToDelete.id);
      await loadCampaigns();
      setIsDeleteCampaignDialogOpen(false);
      setCampaignToDelete(null);
      toast.success('Campanha excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir campanha:', error);
      toast.error('Não foi possível excluir a campanha');
    }
  };

  const handleSendCampaign = async (campaignId: string) => {
    if (window.confirm('Tem certeza que deseja enviar esta campanha?')) {
      try {
        await sendCampaign(campaignId);
        await loadCampaigns();
      } catch (error) {
        console.error('Erro ao enviar campanha:', error);
      }
    }
  };

  // Estados para listas
  const [selectedList, setSelectedList] = useState<EmailList | null>(null);
  const [isCreateListModalOpen, setIsCreateListModalOpen] = useState(false);
  const [isViewListModalOpen, setIsViewListModalOpen] = useState(false);
  const [isEditListModalOpen, setIsEditListModalOpen] = useState(false);
  const [isDeleteListDialogOpen, setIsDeleteListDialogOpen] = useState(false);
  const [listToDelete, setListToDelete] = useState<EmailList | null>(null);

  // Handlers para listas
  const handleViewList = (list: EmailList) => {
    setSelectedList(list);
    setIsViewListModalOpen(true);
  };

  const handleEditList = (list: EmailList) => {
    setSelectedList(list);
    setIsEditListModalOpen(true);
  };

  const handleDeleteList = async (list: EmailList) => {
    setListToDelete(list);
    setIsDeleteListDialogOpen(true);
  };

  const confirmDeleteList = async () => {
    if (!listToDelete) return;

    try {
      await deleteList(listToDelete.id);
      await loadLists();
      setIsDeleteListDialogOpen(false);
      setListToDelete(null);
      toast.success('Lista excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir lista:', error);
      toast.error('Não foi possível excluir a lista');
    }
  };

  const handleExportList = async (listId: string) => {
    try {
      await exportContacts(listId);
      toast.success('Lista exportada com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar lista:', error);
      toast.error('Não foi possível exportar a lista');
    }
  };

  // Variáveis para preview e envio de teste
  const [newTemplateVars, setNewTemplateVars] = useState<Record<string, string>>({});
  const [editTemplateVars, setEditTemplateVars] = useState<Record<string, string>>({});
  const [testRecipient, setTestRecipient] = useState('');
  const [newPreviewWidth, setNewPreviewWidth] = useState<number>(600);
  const [editPreviewWidth, setEditPreviewWidth] = useState<number>(600);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdatingTemplates, setIsUpdatingTemplates] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Inicializar variáveis de edição quando template for selecionado
  useEffect(() => {
    if (selectedTemplate && isEditDialogOpen) {
      const initialVars: Record<string, string> = {};
      (selectedTemplate.variables || []).forEach(v => {
        initialVars[v] = getDefaultTestValues(v);
      });
      setEditTemplateVars(initialVars);
    }
  }, [selectedTemplate, isEditDialogOpen]);

  // Dados de analytics baseados no hook
  const analytics = {
    totalSent: analyticsData?.totalSent || 0,
    openRate: analyticsData?.avgOpenRate || 0,
    clickRate: analyticsData?.avgClickRate || 0,
    totalSubscribers: listsStats?.totalContacts || 0,
    recentCampaigns: campaignPerformances.slice(0, 3).map((campaign: any) => ({
      id: campaign.campaignId,
      name: campaign.campaignName,
      subject: `Assunto da ${campaign.campaignName}`,
      recipients: campaign.sent,
      opens: campaign.opens,
      clicks: campaign.clicks,
      revenue: Math.floor(Math.random() * 10000),
      sentAt: campaign.date
    }))
  };

  const [newTemplate, setNewTemplate] = useState<NewEmailTemplate>({
    name: '',
    description: '',
    subject: '',
    html_content: '',
    text_content: '',
    variables: [],
    tags: ['email'],
    category: 'Sistema'
  });

  const handleUpdateTemplates = async () => {
    setIsUpdatingTemplates(true);
    try {
      await updateDatabaseTemplates();
      await loadTemplates(); // Recarregar templates após atualização
      toast.success('Templates atualizados com design StorySpark!');
    } catch (error) {
      console.error('Erro ao atualizar templates:', error);
      toast.error('Erro ao atualizar templates');
    } finally {
      setIsUpdatingTemplates(false);
    }
  };

  // Templates padrão com design responsivo e seguro
  const defaultTemplates = [
    {
      name: 'Convite da Waitlist',
      category: 'Sistema',
      description: 'Template para convites de saída da waitlist com acesso à plataforma',
      subject: waitlistInviteTemplate.subject,
      html_content: waitlistInviteTemplate.html,
      text_content: waitlistInviteTemplate.text
    },
    {
      name: 'Confirmação da Waitlist',
      category: 'Sistema',
      description: 'Template de confirmação da waitlist com estilo StorySpark',
      subject: 'Obrigado por se juntar à nossa waitlist! 🎉',
      html_content: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmação da Waitlist - StorySpark</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
            min-height: 100vh;
        }
        
        .container {
            background: white;
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #f97316;
        }
        
        .logo {
            font-size: 32px;
            font-weight: 700;
            background: linear-gradient(135deg, #f97316, #fb923c);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
        }
        
        .highlight-box {
            background: #f8fafc;
            border: 2px solid #f97316;
            color: #1f2937;
            padding: 25px;
            border-radius: 12px;
            margin: 30px 0;
            text-align: center;
        }
        
        .position-box {
            background: #f8fafc;
            border: 2px solid #f97316;
            padding: 25px;
            border-radius: 12px;
            text-align: center;
            margin: 25px 0;
        }
        
        .cta-button {
            background: linear-gradient(135deg, #f97316, #fb923c);
            color: white;
            padding: 16px 32px;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 600;
            display: inline-block;
        }
        
        .footer {
            margin-top: 50px;
            padding: 30px 0 20px 0;
            border-top: 2px solid #e2e8f0;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
        }
        
        .footer-links a {
            color: #f97316;
            text-decoration: none;
            margin: 0 15px;
        }
        
        /* Responsividade para mobile */
        @media only screen and (max-width: 600px) {
            body {
                padding: 10px !important;
            }
            
            .container {
                padding: 20px !important;
            }
            
            .logo {
                font-size: 24px !important;
            }
            
            .header h1 {
                font-size: 20px !important;
            }
            
            .position-box div {
                font-size: 24px !important;
            }
            
            .cta-button {
                padding: 12px 24px !important;
                font-size: 14px !important;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">StorySpark</div>
            <h1>Obrigado por se juntar à nossa waitlist!</h1>
            <p>Você está na nossa lista de espera exclusiva</p>
        </div>
        
        <div>
            <p>Olá <strong>{{name}}</strong>,</p>
            
            <div class="highlight-box">
                <h3>🎉 Você está na lista!</h3>
                <p>Em breve você receberá acesso exclusivo</p>
            </div>
            
            <div class="position-box">
                <p>Sua posição na fila:</p>
                <div style="font-size: 32px; font-weight: 700; color: #f97316; line-height: 1.2;">{{position}}</div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{website_url}}" class="cta-button">Visitar Site</a>
            </div>
            
            <p>Atenciosamente,<br><strong>Equipe StorySpark</strong></p>
        </div>
        
        <div class="footer">
            <div style="font-size: 20px; font-weight: 700; background: linear-gradient(135deg, #f97316, #fb923c); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">StorySpark</div>
            <div style="margin: 20px 0;">
                <a href="https://storyspark.com">Website</a> |
                <a href="https://blog.storyspark.com">Blog</a> |
                <a href="mailto:suporte@storyspark.com.br">Suporte</a>
            </div>
            <p>© 2024 StorySpark. Todos os direitos reservados.</p>
            <div style="margin-top: 20px; font-size: 12px;">
                <a href="{{unsubscribe_url}}">Cancelar inscrição</a>
            </div>
        </div>
    </div>
</body>
</html>`,
      text_content: 'Obrigado por se juntar à nossa waitlist! Posição: {{position}}. Visite: {{website_url}}'
    },
    {
      name: 'Newsletter Promocional',
      category: 'Marketing',
      description: 'Template para campanhas promocionais e ofertas especiais',
      subject: '🎯 Oferta Especial StorySpark - {{discountPercentage}} de desconto!',
      html_content: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Oferta Especial - StorySpark</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
        }
        .container {
            background: white;
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 32px;
            font-weight: 700;
            background: linear-gradient(135deg, #f97316, #fb923c);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
        }
        .promo-box {
            background: linear-gradient(135deg, #f97316, #fb923c);
            color: white;
            padding: 30px;
            border-radius: 12px;
            text-align: center;
            margin: 30px 0;
        }
        .discount {
            font-size: 48px;
            font-weight: bold;
            margin: 15px 0;
        }
        .button {
            background: white;
            color: #f97316;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            display: inline-block;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 14px;
            color: #6b7280;
        }
        .footer a {
            color: #f97316;
            text-decoration: none;
            margin: 0 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">StorySpark</div>
            <p style="color: #6b7280; margin: 0;">Transforme suas ideias em histórias incríveis</p>
        </div>
        
        <h1 style="color: #1f2937; text-align: center;">🎯 Oferta Especial StorySpark</h1>
        
        <p>Olá {{nome}},</p>
        
        <p>Temos uma oferta especial para você! Por tempo limitado, você pode acessar todos os recursos premium do StorySpark com um desconto incrível.</p>
        
        <div class="promo-box">
            <h2 style="margin: 0 0 10px 0;">OFERTA ESPECIAL</h2>
            <div class="discount">{{discountPercentage}}% OFF</div>
            <p style="margin: 0;">Em todos os planos anuais</p>
            <a href="{{offerUrl}}" class="button">APROVEITAR OFERTA</a>
        </div>
        
        <h3>✨ O que você vai ter acesso:</h3>
        <ul style="color: #4b5563;">
            <li>Geração ilimitada de conteúdo com IA</li>
            <li>Templates premium exclusivos</li>
            <li>Análises avançadas de performance</li>
            <li>Suporte prioritário 24/7</li>
            <li>Integração com todas as redes sociais</li>
        </ul>
        
        <p style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
            ⚡ <strong>Atenção:</strong> Esta oferta é válida apenas até {{expirationDate}}. Não perca!
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{offerUrl}}" style="background: linear-gradient(135deg, #f97316, #fb923c); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                🚀 COMEÇAR AGORA
            </a>
        </div>
        
        <p>Tem dúvidas? Entre em contato conosco respondendo este e-mail ou através do nosso suporte.</p>
        
        <p>Atenciosamente,<br>
        <strong>Equipe StorySpark</strong></p>
        
        <div class="footer">
            <div style="font-size: 20px; font-weight: 700; background: linear-gradient(135deg, #f97316, #fb923c); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">StorySpark</div>
            <div style="margin: 20px 0;">
                <a href="https://storyspark.com">Website</a> |
                <a href="https://blog.storyspark.com">Blog</a> |
                <a href="mailto:suporte@storyspark.com.br">Suporte</a>
            </div>
            <p>© 2024 StorySpark. Todos os direitos reservados.</p>
            <div style="margin-top: 20px; font-size: 12px;">
                <a href="{{unsubscribe_url}}">Cancelar inscrição</a>
            </div>
        </div>
    </div>
</body>
</html>`,
      text_content: 'Oferta especial: {{discountPercentage}}% OFF em todos os planos anuais do StorySpark. Aproveite até {{expirationDate}}!'
    },
    {
      name: 'Convite da Waitlist',
      category: 'Sistema',
      description: 'Template para convite de usuários que saíram da waitlist',
      subject: 'Bem-vindo ao StorySpark! Sua conta está pronta 🚀',
      html_content: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Bem-vindo ao futuro do marketing! - StorySpark</title>
  <style>
    /* Reset e base */
    body, table, td, p, a, li, blockquote {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    
    img {
      -ms-interpolation-mode: bicubic;
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }
    
    /* Estilos da marca StorySpark */
    body {
      margin: 0 !important;
      padding: 0 !important;
      background-color: #f8fafc !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', Arial, sans-serif !important;
      font-size: 16px;
      line-height: 1.6;
      color: #374151 !important;
    }
    
    /* Container principal */
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff !important;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }
    
    .content-wrapper {
      padding: 40px 30px;
    }
    
    /* Header com marca */
    .brand-header {
      text-align: center;
      margin-bottom: 30px;
    }
    
    .brand-logo {
      font-size: 28px;
      font-weight: bold;
      color: #f97316 !important;
      margin-bottom: 10px;
      text-decoration: none;
      display: inline-block;
    }
    
    .brand-title {
      font-size: 24px;
      font-weight: 600;
      color: #1f2937 !important;
      margin: 10px 0;
      line-height: 1.3;
    }
    
    .brand-subtitle {
      color: #6b7280 !important;
      font-size: 16px;
      margin: 0;
    }
    
    /* Elementos de conteúdo */
    .content p {
      margin: 16px 0;
      color: #374151 !important;
    }
    
    .highlight-box {
      background: linear-gradient(135deg, #f97316 0%, #fb923c 100%) !important;
      color: #ffffff !important;
      padding: 25px 20px;
      border-radius: 12px;
      text-align: center;
      margin: 30px 0;
    }
    
    .highlight-box h3 {
      margin: 0 0 10px 0;
      color: #ffffff !important;
      font-size: 20px;
      font-weight: 600;
    }
    
    .highlight-box p {
      margin: 0;
      font-size: 16px;
      color: #ffffff !important;
    }
    
    /* Código de convite/destaque */
    .invite-code {
      font-size: 20px;
      font-weight: bold;
      letter-spacing: 2px;
      margin: 10px 0;
      color: #ffffff !important;
      font-family: 'Courier New', monospace;
    }
    
    /* Botões CTA */
    .cta-container {
      text-align: center;
      margin: 30px 0;
    }
    
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #f97316 0%, #fb923c 100%) !important;
      color: #ffffff !important;
      padding: 16px 32px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
      transition: all 0.3s ease;
    }
    
    /* Seções de features/benefícios */
    .features-section {
      margin: 30px 0;
    }
    
    .feature {
      display: flex;
      align-items: center;
      margin: 15px 0;
      padding: 10px;
      background: #f8fafc !important;
      border-radius: 6px;
    }
    
    .feature-icon {
      width: 20px;
      height: 20px;
      margin-right: 12px;
      color: #f97316 !important;
      font-size: 16px;
    }
    
    /* Rodapé padrão da marca */
    .brand-footer {
      margin-top: 40px;
      padding: 30px;
      background-color: #f7fafc !important;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #6b7280 !important;
      font-size: 14px;
    }
    
    .brand-footer p {
      margin: 8px 0;
      color: #6b7280 !important;
    }
    
    .brand-footer a {
      color: #f97316 !important;
      text-decoration: none;
    }
    
    .social-links {
      margin: 20px 0;
    }
    
    .social-links a {
      color: #f97316 !important;
      text-decoration: none;
      margin: 0 10px;
    }
    
    .unsubscribe-text {
      font-size: 12px;
      margin-top: 10px;
      color: #9ca3af !important;
    }
    
    /* Responsive */
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
        margin: 10px !important;
      }
      
      .content-wrapper {
        padding: 20px 15px !important;
      }
      
      .brand-title {
        font-size: 20px !important;
      }
      
      .brand-logo {
        font-size: 24px !important;
      }
      
      .cta-button {
        padding: 14px 24px !important;
        font-size: 14px !important;
      }
      
      .highlight-box {
        padding: 20px 15px !important;
      }
      
      .brand-footer {
        padding: 25px 20px !important;
      }
    }
  </style>
</head>
<body>
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
    <tr>
      <td style="padding: 20px 0;">
        <table class="email-container" role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
          <tr>
            <td class="content-wrapper">
              <div class="brand-header">
                <div class="brand-logo">StorySpark</div>
                <h1 class="brand-title">Bem-vindo ao futuro do marketing!</h1>
                <p class="brand-subtitle">Sua conta está pronta para criar copies incríveis com IA</p>
              </div>
              
              <div class="content">
                <p>Olá <strong>{{userName}}</strong>,</p>
                
                <p>Estamos muito animados em tê-lo conosco! Você saiu da waitlist e sua conta no StorySpark está oficialmente ativa.</p>
                
                <div class="highlight-box">
                  <p style="margin: 0; font-size: 16px;">Seu código de convite:</p>
                  <div class="invite-code">{{inviteCode}}</div>
                  <p style="margin: 0; font-size: 14px; opacity: 0.9;">Use este código para ativar recursos premium</p>
                </div>
                
                <div class="cta-container">
                  <a href="{{loginUrl}}" class="cta-button">Acessar Minha Conta</a>
                </div>
                
                <div class="features-section">
                  <h3 style="color: #1f2937; margin-bottom: 20px; text-align: center;">O que você pode fazer agora:</h3>
                  
                  <div class="feature">
                    <span class="feature-icon">✨</span>
                    <span>Criar copies persuasivos com IA avançada</span>
                  </div>
                  
                  <div class="feature">
                    <span class="feature-icon">🎯</span>
                    <span>Gerenciar campanhas de marketing digital</span>
                  </div>
                  
                  <div class="feature">
                    <span class="feature-icon">📊</span>
                    <span>Analisar performance e otimizar resultados</span>
                  </div>
                  
                  <div class="feature">
                    <span class="feature-icon">🚀</span>
                    <span>Acessar templates profissionais prontos</span>
                  </div>
                </div>
                
                <p>Se você tiver alguma dúvida ou precisar de ajuda, nossa equipe está sempre disponível em <a href="mailto:{{supportEmail}}" style="color: #f97316;">{{supportEmail}}</a>.</p>
                
                <p>Vamos criar algo incrível juntos!</p>
                
                <p style="margin-top: 30px; text-align: center;">
                  Atenciosamente,<br>
                  <strong>Equipe StorySpark</strong>
                </p>
              </div>
              
              <div class="brand-footer">
                <div class="social-links">
                  <a href="https://storyspark.com.">Website</a> |
.                  <a href="https://storyspark.com/blog">Blog</a> |
                  <a href="mailto:suporte@storyspark.com.br">Suporte</a>
                </div>
                <p>© 2024 StorySpark. Todos os direitos reservados.</p>
                <p class="unsubscribe-text">
                  Você está recebendo este e-mail porque se inscreveu em nossa waitlist.
                  <a href="#unsubscribe">Cancelar inscrição</a>
                </p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
      text_content: `Bem-vindo ao StorySpark!\n\nOlá {{userName}},\n\nEstamos muito animados em tê-lo conosco! Você saiu da waitlist e sua conta no StorySpark está oficialmente ativa.\n\nSeu código de convite: {{inviteCode}}\n\nAcesse sua conta em: {{loginUrl}}\n\nO que você pode fazer agora:\n✨ Criar copies persuasivos com IA avançada\n🎯 Gerenciar campanhas de marketing digital\n📊 Analisar performance e otimizar resultados\n🚀 Acessar templates profissionais prontos\n\nSe você tiver alguma dúvida ou precisar de ajuda, nossa equipe está sempre disponível em {{supportEmail}}.\n\nVamos criar algo incrível juntos!\n\nAtenciosamente,\nEquipe StorySpark\n\n© 2024 StorySpark. Todos os direitos reservados.`
    },
    {
      name: 'Newsletter Promocional',
      category: 'Marketing',
      description: 'Template responsivo para newsletters promocionais com design StorySpark',
      subject: 'Oferta especial só para você! 🎉',
      html_content: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Newsletter Promocional - StorySpark</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
        }
        .container {
            background: white;
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 32px;
            font-weight: 700;
            background: linear-gradient(135deg, #f97316, #fb923c);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
        }
        .highlight-box {
            background: linear-gradient(135deg, #f97316, #fb923c);
            color: white;
            padding: 25px;
            border-radius: 12px;
            text-align: center;
            margin: 30px 0;
        }
        .cta-button {
            background: linear-gradient(135deg, #f97316, #fb923c);
            color: white;
            padding: 16px 32px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            display: inline-block;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 14px;
            color: #6b7280;
        }
        .footer a {
            color: #f97316;
            text-decoration: none;
            margin: 0 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">StorySpark</div>
            <h1>Newsletter Promocional</h1>
            <p style="color: #6b7280;">Aproveite nossa promoção exclusiva</p>
        </div>
        
        <p>Olá <strong>{{userName}}</strong>,</p>
        
        <p>{{mainMessage}}</p>
        
        <div class="highlight-box">
            <h3>{{offerTitle}}</h3>
            <p>{{offerDescription}}</p>
        </div>
        
        <div style="text-align: center;">
            <a href="{{ctaUrl}}" class="cta-button">{{ctaText}}</a>
        </div>
        
        <p>{{closingMessage}}</p>
        
        <p style="text-align: center; margin-top: 30px;">
            Atenciosamente,<br>
            <strong>Equipe StorySpark</strong>
        </p>
        
        <div class="footer">
            <div style="font-size: 20px; font-weight: 700; background: linear-gradient(135deg, #f97316, #fb923c); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">StorySpark</div>
            <div style="margin: 20px 0;">
                <a href="https://storyspark.com.br">Website</a> |
                <a href="https://blog.storyspark.com.br">Blog</a> |
                <a href="mailto:suporte@storyspark.com.br">Suporte</a>
            </div>
            <p>© 2024 StorySpark. Todos os direitos reservados.</p>
            <div style="margin-top: 20px; font-size: 12px;">
                <a href="{{unsubscribe_url}}">Cancelar inscrição</a>
            </div>
        </div>
    </div>
</body>
</html>`,
      text_content: `{{title}}

Olá {{userName}},

{{mainMessage}}

{{offerTitle}}
{{offerDescription}}

{{ctaText}}: {{ctaUrl}}

{{closingMessage}}

Atenciosamente,
{{senderName}}

© 2024 StorySpark. Todos os direitos reservados.

Cancelar inscrição: {{unsubscribeUrl}}
Preferências: {{preferencesUrl}}`
    },
    {
      name: 'E-mail de Boas-vindas',
      category: 'Transacional',
      description: 'Template de boas-vindas para novos usuários com design StorySpark',
      subject: 'Bem-vindo(a) ao StorySpark! 🎉',
      html_content: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bem-vindo ao StorySpark</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
        }
        .container {
            background: white;
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 32px;
            font-weight: 700;
            background: linear-gradient(135deg, #f97316, #fb923c);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
        }
        .welcome-box {
            background: linear-gradient(135deg, #f97316, #fb923c);
            color: white;
            padding: 25px;
            border-radius: 12px;
            text-align: center;
            margin: 30px 0;
        }
        .cta-button {
            background: linear-gradient(135deg, #f97316, #fb923c);
            color: white;
            padding: 16px 32px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            display: inline-block;
            margin: 20px 0;
        }
        .steps {
            margin: 30px 0;
        }
        .step {
            display: flex;
            align-items: flex-start;
            margin: 20px 0;
            padding: 20px;
            background: #f8fafc;
            border-radius: 12px;
            border-left: 4px solid #f97316;
        }
        .step-number {
            background: #f97316;
            color: white;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            margin-right: 15px;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 14px;
            color: #6b7280;
        }
        .footer a {
            color: #f97316;
            text-decoration: none;
            margin: 0 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">StorySpark</div>
            <h1>Bem-vindo(a), {{userName}}! 🎉</h1>
            <p style="color: #6b7280;">{{welcomeMessage}}</p>
        </div>
        
        <div class="welcome-box">
            <h3>🎉 Sua conta está ativa!</h3>
            <p>{{introMessage}}</p>
        </div>
        
        <div style="text-align: center;">
            <a href="{{dashboardUrl}}" class="cta-button">{{ctaText}}</a>
        </div>
        
        <div class="steps">
            <h3 style="color: #1f2937; margin-bottom: 20px; text-align: center;">Primeiros passos:</h3>
            
            <div class="step">
                <div class="step-number">1</div>
                <div>
                    <h4>{{step1Title}}</h4>
                    <p>{{step1Description}}</p>
                </div>
            </div>
            
            <div class="step">
                <div class="step-number">2</div>
                <div>
                    <h4>{{step2Title}}</h4>
                    <p>{{step2Description}}</p>
                </div>
            </div>
            
            <div class="step">
                <div class="step-number">3</div>
                <div>
                    <h4>{{step3Title}}</h4>
                    <p>{{step3Description}}</p>
                </div>
            </div>
        </div>
        
        <p>Se você tiver alguma dúvida, nossa equipe está sempre disponível em <a href="mailto:{{supportEmail}}" style="color: #f97316;">{{supportEmail}}</a>.</p>
        
        <p>Vamos criar algo incrível juntos!</p>
        
        <p style="text-align: center; margin-top: 30px;">
            Atenciosamente,<br>
            <strong>Equipe StorySpark</strong>
        </p>
        
        <div class="footer">
            <div style="font-size: 20px; font-weight: 700; background: linear-gradient(135deg, #f97316, #fb923c); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">StorySpark</div>
            <div style="margin: 20px 0;">
                <a href="https://storyspark.com.br">Website</a> |
                <a href="https://blog.storyspark.com">Blog</a> |
                <a href="mailto:suporte@storyspark.com.br">Suporte</a>
            </div>
            <p>© 2024 StorySpark. Todos os direitos reservados.</p>
            <div style="margin-top: 20px; font-size: 12px;">
                <a href="{{unsubscribe_url}}">Cancelar inscrição</a>
            </div>
        </div>
    </div>
</body>
</html>`,
      text_content: `Bem-vindo(a) ao StorySpark!

Olá {{userName}},

{{introMessage}}

{{ctaText}}: {{dashboardUrl}}

Primeiros passos:
1. {{step1Title}} - {{step1Description}}
2. {{step2Title}} - {{step2Description}}
3. {{step3Title}} - {{step3Description}}

{{supportMessage}} {{supportEmail}}

{{closingMessage}}
{{senderName}}

© 2024 StorySpark. Todos os direitos reservados.`
    },
    {
      name: 'Confirmação de Pedido',
      category: 'Transacional',
      description: 'Template para confirmação de pedidos e compras',
      subject: 'Pedido confirmado #{{orderNumber}} - StorySpark',
      html_content: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pedido Confirmado - StorySpark</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
        }
        .container {
            background: white;
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 32px;
            font-weight: 700;
            background: linear-gradient(135deg, #f97316, #fb923c);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
        }
        .status-box {
            background: #dcfce7;
            border: 1px solid #16a34a;
            color: #15803d;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin: 25px 0;
        }
        .order-details {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin: 25px 0;
            border-left: 4px solid #f97316;
        }
        .order-item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .cta-button {
            background: linear-gradient(135deg, #f97316, #fb923c);
            color: white;
            padding: 16px 32px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            display: inline-block;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 14px;
            color: #6b7280;
        }
        .footer a {
            color: #f97316;
            text-decoration: none;
            margin: 0 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">StorySpark</div>
            <h1>Pedido Confirmado! ✅</h1>
            <p style="color: #6b7280;">Obrigado pela sua compra</p>
        </div>
        
        <div class="status-box">
            <h3>✅ Pedido Confirmado</h3>
            <p>Pedido #{{orderNumber}} confirmado com sucesso!</p>
        </div>
        
        <div class="order-details">
            <h3>Detalhes do Pedido</h3>
            <div class="order-item">
                <span>Número do Pedido:</span>
                <span><strong>{{orderNumber}}</strong></span>
            </div>
            <div class="order-item">
                <span>Data do Pedido:</span>
                <span>{{orderDate}}</span>
            </div>
            <div class="order-item">
                <span>Total:</span>
                <span><strong>{{orderTotal}}</strong></span>
            </div>
        </div>
        
        <div style="text-align: center;">
            <a href="{{orderUrl}}" class="cta-button">Ver Detalhes do Pedido</a>
        </div>
        
        <p>Seu pedido está sendo processado e você receberá uma confirmação em breve.</p>
        
        <p>Se você tiver alguma dúvida sobre seu pedido, entre em contato conosco em <a href="mailto:{{supportEmail}}" style="color: #f97316;">{{supportEmail}}</a>.</p>
        
        <p style="text-align: center; margin-top: 30px;">
            Atenciosamente,<br>
            <strong>Equipe StorySpark</strong>
        </p>
        
        <div class="footer">
            <div style="font-size: 20px; font-weight: 700; background: linear-gradient(135deg, #f97316, #fb923c); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">StorySpark</div>
            <div style="margin: 20px 0;">
                <a href="https://storyspark.com.br">Website</a> |
                <a href="https://blog.storyspark.com.br">Blog</a> |
                <a href="mailto:suporte@storyspark.com.br">Suporte</a>
            </div>
            <p>© 2024 StorySpark. Todos os direitos reservados.</p>
            <div style="margin-top: 20px; font-size: 12px;">
                <a href="{{unsubscribe_url}}">Cancelar inscrição</a>
            </div>
        </div>
    </div>
</body>
</html>`,
      text_content: `Pedido Confirmado #{{orderNumber}}

Olá,

Seu pedido foi confirmado com sucesso!

Detalhes do Pedido:
- Número: {{orderNumber}}
- Data: {{orderDate}}  
- Total: {{orderTotal}}

Ver detalhes: {{orderUrl}}

Seu pedido está sendo processado e você receberá uma confirmação em breve.

Se você tiver alguma dúvida sobre seu pedido, entre em contato conosco em {{supportEmail}}.

Atenciosamente,
Equipe StorySpark

© 2024 StorySpark. Todos os direitos reservados.`
    }
  ];

  // Função simples para detectar variáveis em templates
  const detectTemplateVariables = (content: string): string[] => {
    const regex = /{{([^}]+)}}/g;
    const variables: string[] = [];
    let match;

    while ((match = regex.exec(content)) !== null) {
      const variable = match[1].trim();
      if (!variables.includes(variable)) {
        variables.push(variable);
      }
    }

    return variables;
  };

  // Função para obter valores padrão de teste para variáveis
  const getDefaultTestValues = (variableName: string): string => {
    const defaultValues: Record<string, string> = {
      // Usuário
      userName: 'João Silva',
      userEmail: 'joao.silva@email.com',
      name: 'João Silva',
      firstName: 'João',
      lastName: 'Silva',

      // Empresa
      companyName: 'StorySpark',
      supportEmail: 'suporte@storyspark.com.br',
      senderName: 'Equipe StorySpark',

      // Waitlist
      waitlistPosition: '42',
      position: '42',
      selectedIdeas: 'IA para Copywriting, Analytics Avançados, Integração com CRM',
      inviteCode: 'INV-1756616099-c110b08c',
      website_url: 'https://storyspark.com',

      // Newsletter  
      productName: 'StorySpark Premium',
      discountCode: 'SAVE20',
      discountPercentage: '20%',
      productDescription: 'Plataforma completa de marketing de conteúdo com IA',
      promotionUrl: 'https://storyspark.com/promo',

      // Boas-vindas
      accountUrl: 'https://app.storyspark.com/dashboard',
      gettingStartedUrl: 'https://storyspark.com/guia-inicio',
      featuresUrl: 'https://storyspark.com/recursos',

      // Pedidos
      orderNumber: 'SS-2024-001234',
      orderDate: '15 de Janeiro de 2024',
      orderTotal: 'R$ 297,00',
      orderUrl: 'https://app.storyspark.com/pedidos/SS-2024-001234',
      orderStatus: 'Confirmado',
      customerName: 'João Silva',
      orderItems: 'StorySpark Premium - Plano Anual',
      totalAmount: 'R$ 297,00',
      deliveryAddress: 'Rua das Flores, 123, São Paulo - SP',
      deliveryDate: '22 de Janeiro de 2024',
      trackingUrl: 'https://app.storyspark.com/tracking/SS-2024-001234',
      supportMessage: 'Se você tiver alguma dúvida, entre em contato conosco em'
    };

    return defaultValues[variableName] || `{{${variableName}}}`;
  };

  // Aplicar template padrão
  const applyDefaultTemplate = (template: typeof defaultTemplates[0]) => {
    setNewTemplate({
      name: template.name,
      description: template.description,
      subject: template.subject,
      html_content: template.html_content,
      text_content: template.text_content,
      variables: detectTemplateVariables(template.html_content),
      tags: ['email'],
      category: template.category
    });
    // Inicializa variáveis para preview com valores padrão de teste
    const initialVars: Record<string, string> = {};
    detectTemplateVariables(template.html_content).forEach(v => {
      initialVars[v] = getDefaultTestValues(v);
    });
    setNewTemplateVars(initialVars);
  };

  // Criar novo template
  const handleCreateTemplate = async () => {
    console.log('=== CRIANDO TEMPLATE ===');
    console.log('newTemplate:', newTemplate);

    // Validação básica
    if (!newTemplate.name.trim()) {
      toast.error('Nome do template é obrigatório');
      return;
    }

    if (!newTemplate.subject.trim()) {
      toast.error('Assunto do email é obrigatório');
      return;
    }

    if (!newTemplate.html_content.trim()) {
      toast.error('Conteúdo HTML é obrigatório');
      return;
    }

    console.log('Validações OK, iniciando criação...');

    setIsCreating(true);
    try {
      const templateInput: Partial<EmailTemplate> = {
        name: newTemplate.name.trim(),
        description: newTemplate.description.trim(),
        subject: newTemplate.subject.trim(),
        html_content: newTemplate.html_content,
        text_content: newTemplate.text_content,
        category: newTemplate.category,
        is_active: true
      };

      console.log('templateInput:', templateInput);

      const result = await createTemplate(templateInput);
      console.log('Resultado da criação:', result);
      if (result) {
        setIsCreateDialogOpen(false);
        setNewTemplate({
          name: '',
          description: '',
          subject: '',
          html_content: '',
          text_content: '',
          variables: [],
          tags: ['email'],
          category: 'Sistema'
        });
        setNewTemplateVars({});
        setTestRecipient('');
      }
    } catch (error) {
      console.error('Erro ao criar template:', error);
    } finally {
      setIsCreating(false);
    }
  };

  // Atualizar template
  const handleUpdateTemplate = async () => {
    if (!selectedTemplate) return;

    // Validação básica
    if (!selectedTemplate.name.trim()) {
      toast.error('Nome do template é obrigatório');
      return;
    }

    if (!selectedTemplate.subject?.trim()) {
      toast.error('Assunto do email é obrigatório');
      return;
    }

    if (!selectedTemplate.html_content?.trim()) {
      toast.error('Conteúdo HTML é obrigatório');
      return;
    }

    console.log('Dados do template selecionado:', selectedTemplate);

    setIsUpdating(true);
    try {
      const templateUpdate = {
        name: selectedTemplate.name.trim(),
        description: selectedTemplate.description?.trim(),
        subject: selectedTemplate.subject?.trim(),
        html_content: selectedTemplate.html_content,
        text_content: selectedTemplate.text_content,
        category: selectedTemplate.category,
        variables: selectedTemplate.variables || [],
        is_active: selectedTemplate.is_active !== false
      };

      console.log('Enviando atualização:', templateUpdate);

      const success = await updateTemplate(selectedTemplate.id, templateUpdate);

      if (success) {
        setIsEditDialogOpen(false);
        setSelectedTemplate(null);
        setEditTemplateVars({});
        setTestRecipient('');
      }
    } catch (error) {
      console.error('Erro ao atualizar template:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Excluir template
  const handleDeleteTemplate = async (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    if (confirm(`Tem certeza que deseja excluir o template "${template.name}"? Esta ação não pode ser desfeita.`)) {
      await deleteTemplate(templateId);
    }
  };

  // Duplicar template (simplificado)
  const handleDuplicateTemplate = async (template: EmailTemplate) => {
    const duplicatedTemplate = {
      name: `${template.name} (Cópia)`,
      description: template.description,
      subject: template.subject || '',
      html_content: template.html_content || '',
      text_content: template.text_content || '',
      category: template.category,
      is_active: true,
      variables: template.variables || []
    };

    await createTemplate(duplicatedTemplate);
    toast.success('Template duplicado com sucesso!');
  };

  // Ativar/Desativar template
  const handleToggleActive = async (template: EmailTemplate) => {
    try {
      const success = await updateTemplate(template.id, {
        is_active: !template.is_active
      });

      if (success) {
        toast.success(`Template ${template.is_active ? 'desativado' : 'ativado'} com sucesso!`);
      }
    } catch (error) {
      console.error('Erro ao alterar status do template:', error);
    }
  };

  // Preview template
  const handlePreviewTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setIsPreviewDialogOpen(true);
  };

  // Editar template
  const handleEditTemplate = (template: EmailTemplate) => {
    console.log('Editando template:', template);
    console.log('HTML Content:', template.html_content);
    console.log('Subject:', template.subject);
    setSelectedTemplate(template);
    setIsEditDialogOpen(true);
  };

  // Funções utilitárias
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      case 'sending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateOpenRate = (opens: number, recipients: number) => {
    if (recipients === 0) return 0;
    return ((opens / recipients) * 100).toFixed(1);
  };

  const calculateClickRate = (clicks: number, recipients: number) => {
    if (recipients === 0) return 0;
    return ((clicks / recipients) * 100).toFixed(1);
  };

  // Filtrar templates (busca + categoria + status)
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = (
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (template.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (template.subject || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    const norm = (s: string | undefined | null) => (s || '').toLowerCase();
    const hasCategoryFilter = selectedCategory && selectedCategory !== 'all';
    const matchesCategory = !hasCategoryFilter || norm(template.category) === norm(selectedCategory);
    const hasStatusFilter = selectedStatus && selectedStatus !== 'all';
    const matchesStatus = !hasStatusFilter ||
      (selectedStatus === 'active' && template.is_active) ||
      (selectedStatus === 'inactive' && !template.is_active);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Atualizar variáveis automaticamente quando o conteúdo HTML muda
  const handleHtmlContentChange = (content: string) => {
    const variables = detectTemplateVariables(content);

    if (selectedTemplate) {
      setSelectedTemplate({
        ...selectedTemplate,
        variables,
        template_variables: variables,
        html_content: content, // Salvar diretamente no template
        metadata: {
          ...selectedTemplate.metadata
        }
      });
      // Sincroniza variáveis do editor
      setEditTemplateVars(prev => {
        const next = { ...prev } as Record<string, string>;
        variables.forEach(v => { if (!(v in next)) next[v] = ''; });
        Object.keys(next).forEach(k => { if (!variables.includes(k)) delete next[k]; });
        return next;
      });
    } else {
      setNewTemplate({
        ...newTemplate,
        html_content: content,
        variables
      });
      setNewTemplateVars(prev => {
        const next = { ...prev } as Record<string, string>;
        variables.forEach(v => { if (!(v in next)) next[v] = ''; });
        Object.keys(next).forEach(k => { if (!variables.includes(k)) delete next[k]; });
        return next;
      });
    }
  };

  // Util: aplica variáveis no HTML/subject para preview/teste
  const applyVars = (subject: string, html: string, vars: Record<string, string>) => {
    let s = subject || '';
    let h = html || '';
    Object.entries(vars).forEach(([k, v]) => {
      const re = new RegExp(`\\{\\{${k}\\}\\}`, 'g');
      const val = String(v ?? '');
      s = s.replace(re, val);
      h = h.replace(re, val);
    });
    return { subject: s, html: h };
  };

  // Enviar e-mail de teste com base no conteúdo atual (sem exigir salvar)
  const handleSendTest = async (mode: 'new' | 'edit') => {
    if (!testRecipient) {
      toast.error('Informe um e-mail para envio de teste');
      return;
    }

    setIsSendingTest(true);
    try {
      if (mode === 'new') {
        const { subject, html } = applyVars(newTemplate.subject, newTemplate.html_content, newTemplateVars);
        const res = await emailService.sendEmail({
          to: [{ email: testRecipient }],
          subject: subject || '(sem assunto)',
          html,
          text: newTemplate.text_content,
          category: 'template_test'
        });
        if (res.success) {
          toast.success('E-mail de teste enviado com sucesso!');
        } else {
          toast.error(res.error || 'Falha ao enviar teste');
        }
      } else if (selectedTemplate) {
        const { subject, html } = applyVars(
          selectedTemplate.subject,
          selectedTemplate.html_content,
          editTemplateVars
        );
        const res = await emailService.sendEmail({
          to: [{ email: testRecipient }],
          subject: subject || '(sem assunto)',
          html,
          text: selectedTemplate.text_content,
          category: `${selectedTemplate.id}_test`
        });
        if (res.success) {
          toast.success('E-mail de teste enviado com sucesso!');
        } else {
          toast.error(res.error || 'Falha ao enviar teste');
        }
      }
    } catch (e: any) {
      console.error('Erro ao enviar teste:', e);
      toast.error(e?.message || 'Erro ao enviar teste');
    } finally {
      setIsSendingTest(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando templates...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <span className="ml-2 text-red-600">{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Email Marketing</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Gerencie campanhas, templates, listas e analytics de email marketing
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => loadTemplates()}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            {loading ? 'Carregando...' : 'Recarregar'}
          </Button>

          <Button
            variant="outline"
            onClick={() => setIsCreateCampaignModalOpen(true)}
            className="w-full sm:w-auto"
          >
            <Send className="h-4 w-4 mr-2" />
            Nova Campanha
          </Button>

          <Button
            variant="outline"
            onClick={handleUpdateTemplates}
            disabled={isUpdatingTemplates}
            className="w-full sm:w-auto"
          >
            {isUpdatingTemplates ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Settings className="h-4 w-4 mr-2" />
            )}
            {isUpdatingTemplates ? 'Atualizando...' : 'Atualizar Design'}
          </Button>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Novo Template
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      {/* Abas principais */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-1">
          <TabsTrigger value="campaigns" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <Send className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Campanhas</span>
            <span className="sm:hidden">Camp.</span>
          </TabsTrigger>
          <TabsTrigger value="lists" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <Users className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Listas</span>
            <span className="sm:hidden">Listas</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Templates</span>
            <span className="sm:hidden">Temp.</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Analytics</span>
            <span className="sm:hidden">Anal.</span>
          </TabsTrigger>
        </TabsList>

        {/* Conteúdo das Abas */}
        <TabsContent value="campaigns" className="space-y-4 sm:space-y-6">
          {/* Estatísticas de Campanhas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Enviados</CardTitle>
                <Send className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalSent.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+12% desde o mês passado</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Abertura</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.openRate}%</div>
                <p className="text-xs text-muted-foreground">+2.1% desde o mês passado</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Clique</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.clickRate}%</div>
                <p className="text-xs text-muted-foreground">+0.8% desde o mês passado</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Campanhas Ativas</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{campaigns.filter((c: EmailCampaign) => c.status === 'sending' || c.status === 'scheduled').length}</div>
                <p className="text-xs text-muted-foreground">2 agendadas para hoje</p>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Campanhas */}
          <Card>
            <CardHeader>
              <CardTitle>Campanhas Recentes</CardTitle>
              <CardDescription>Gerencie suas campanhas de email marketing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.map((campaign: EmailCampaign) => (
                  <div key={campaign.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <h3 className="font-medium">{campaign.name}</h3>
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status === 'sent' ? 'Enviada' :
                            campaign.status === 'scheduled' ? 'Agendada' :
                              campaign.status === 'draft' ? 'Rascunho' :
                                campaign.status === 'sending' ? 'Enviando' : campaign.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{campaign.subject}</p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {(campaign.total_recipients || 0).toLocaleString()} destinatários
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {Math.floor((campaign.total_recipients || 0) * 0.25).toLocaleString()} aberturas ({calculateOpenRate(Math.floor((campaign.total_recipients || 0) * 0.25), campaign.total_recipients || 0)}%)
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          {Math.floor((campaign.total_recipients || 0) * 0.05).toLocaleString()} cliques ({calculateClickRate(Math.floor((campaign.total_recipients || 0) * 0.05), campaign.total_recipients || 0)}%)
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {campaign.sent_at ? `Enviada em ${formatDate(campaign.sent_at)}` :
                            campaign.scheduled_at ? `Agendada para ${formatDate(campaign.scheduled_at)}` :
                              'Não agendada'}
                        </span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewCampaign(campaign)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditCampaign(campaign)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicateCampaign(campaign)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicar
                        </DropdownMenuItem>
                        {campaign.status === 'draft' && (
                          <DropdownMenuItem onClick={() => handleSendCampaign(campaign.id)}>
                            <Send className="h-4 w-4 mr-2" />
                            Enviar
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteCampaign(campaign)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lists" className="space-y-6">
          {/* Estatísticas de Listas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Listas</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{lists.length}</div>
                <p className="text-xs text-muted-foreground">+1 nova lista este mês</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Contatos</CardTitle>
                <UserPlus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{lists.reduce((acc: number, list: EmailList) => acc + (list.subscribers_count || 0), 0).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+156 novos contatos</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Crescimento</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+8.2%</div>
                <p className="text-xs text-muted-foreground">Crescimento mensal</p>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Listas de Email */}
          <Card>
            <CardHeader>
              <CardTitle>Listas de Email</CardTitle>
              <CardDescription>Gerencie suas listas de contatos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lists.map((list: EmailList) => (
                  <div key={list.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium">{list.name}</h3>
                        <Badge variant="outline">{list.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{list.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {(list.subscribers_count || 0).toLocaleString()} assinantes
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Criada em {formatDate(list.created_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          +{(list.growth_rate || 0)}% este mês
                        </span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewList(list)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Visualizar Contatos
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditList(list)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar Lista
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExportList(list.id)}>
                          <Download className="h-4 w-4 mr-2" />
                          Exportar Contatos
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Adicionar Contatos
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteList(list)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir Lista
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4 sm:space-y-6">
          {/* Filtros e Busca */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full sm:w-64"
                />
              </div>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                      <Filter className="h-4 w-4 mr-2" />
                      Categoria
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSelectedCategory('all')}>
                      Todas
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedCategory('Sistema')}>
                      Sistema
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedCategory('Marketing')}>
                      Marketing
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedCategory('Transacional')}>
                      Transacional
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                      <Filter className="h-4 w-4 mr-2" />
                      Status
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSelectedStatus('all')}>
                      Todos
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedStatus('active')}>
                      Ativos
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedStatus('inactive')}>
                      Inativos
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Contador de Templates */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} encontrado{filteredTemplates.length !== 1 ? 's' : ''}
              {searchTerm && ` para "${searchTerm}"`}
              {selectedCategory && selectedCategory !== 'all' && ` na categoria "${selectedCategory}"`}
              {selectedStatus && selectedStatus !== 'all' && ` com status "${selectedStatus === 'active' ? 'ativo' : 'inativo'}"`}
            </p>
          </div>

          {/* Grid de Templates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {template.description}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handlePreviewTemplate(template)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditTemplate(template)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicateTemplate(template)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleToggleActive(template)}
                        >
                          {template.is_active ? (
                            <>
                              <X className="h-4 w-4 mr-2" />
                              Desativar
                            </>
                          ) : (
                            <>
                              <Check className="h-4 w-4 mr-2" />
                              Ativar
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteTemplate(template.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="text-xs">{template.category}</Badge>
                      <Badge variant="secondary" className="text-xs">
                        {template.variables?.length || 0} variáveis
                      </Badge>
                      <Badge variant={template.is_active ? "default" : "secondary"} className="text-xs">
                        {template.is_active ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {template.subject}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-muted-foreground gap-1">
                      <span>Criado em {new Date(template.created_at).toLocaleDateString('pt-BR')}</span>
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {template.usage_count || 0} usos
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum template encontrado</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedCategory
                  ? 'Tente ajustar os filtros de busca'
                  : 'Crie seu primeiro template de email'}
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Template
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Métricas Principais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Abertura Média</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.openRate}%</div>
                <p className="text-xs text-muted-foreground">+2.1% desde o mês passado</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Clique Média</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.clickRate}%</div>
                <p className="text-xs text-muted-foreground">+0.8% desde o mês passado</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Assinantes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{lists.reduce((acc: number, list: EmailList) => acc + (list.subscribers_count || 0), 0).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+156 novos este mês</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ROI Médio</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 4.20</div>
                <p className="text-xs text-muted-foreground">Para cada R$ 1 investido</p>
              </CardContent>
            </Card>
          </div>

          {/* Performance por Período */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance por Período</CardTitle>
                <CardDescription>Comparação dos últimos 30 vs 60 dias</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Últimos 30 dias</span>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-bold text-green-600">{analytics.openRate}%</div>
                        <div className="text-xs text-muted-foreground">Abertura</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-blue-600">{analytics.clickRate}%</div>
                        <div className="text-xs text-muted-foreground">Clique</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Últimos 60 dias</span>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-bold text-green-500">{(analytics.openRate - 2.1).toFixed(1)}%</div>
                        <div className="text-xs text-muted-foreground">Abertura</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-blue-500">{(analytics.clickRate - 0.8).toFixed(1)}%</div>
                        <div className="text-xs text-muted-foreground">Clique</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm font-medium text-green-600">Melhoria</span>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-bold text-green-600">+2.1%</div>
                        <div className="text-xs text-muted-foreground">Abertura</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-green-600">+0.8%</div>
                        <div className="text-xs text-muted-foreground">Clique</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Crescimento de Assinantes</CardTitle>
                <CardDescription>Evolução da base de contatos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Janeiro', 'Fevereiro', 'Março', 'Abril'].map((month, index) => {
                    const growth = [156, 203, 178, 234][index];
                    const total = 1000 + (index + 1) * 200 + growth;
                    return (
                      <div key={month} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{month} 2024</span>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-sm font-bold">{total.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">Total</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-green-600">+{growth}</div>
                            <div className="text-xs text-muted-foreground">Novos</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Performing Campaigns */}
          <Card>
            <CardHeader>
              <CardTitle>Campanhas com Melhor Performance</CardTitle>
              <CardDescription>Top 5 campanhas por taxa de abertura</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.recentCampaigns.length > 0 ? analytics.recentCampaigns.map((campaign: any, index: number) => (
                  <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">#{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{campaign.name}</h3>
                        <p className="text-sm text-muted-foreground">{campaign.subject}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          <span>Enviada em {formatDate(campaign.sentAt)}</span>
                          <span>{campaign.recipients.toLocaleString()} destinatários</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <div className="font-medium text-green-600">{calculateOpenRate(campaign.opens, campaign.recipients)}%</div>
                        <div className="text-xs text-muted-foreground">Abertura</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-blue-600">{calculateClickRate(campaign.clicks, campaign.recipients)}%</div>
                        <div className="text-xs text-muted-foreground">Clique</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-purple-600">R$ {campaign.revenue?.toFixed(2) || '0.00'}</div>
                        <div className="text-xs text-muted-foreground">Receita</div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => handleViewCampaign(campaigns.find(c => c.name === campaign.name))}>
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Nenhuma campanha encontrada</p>
                    <p className="text-sm text-muted-foreground">Crie uma campanha para ver as análises</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Insights e Recomendações */}
          <Card>
            <CardHeader>
              <CardTitle>Insights e Recomendações</CardTitle>
              <CardDescription>Dicas baseadas na performance das suas campanhas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 dark:text-blue-100">Taxa de Clique</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        Sua taxa de clique está acima da média do setor (2.5%). Continue usando CTAs claros!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-900 dark:text-green-100">Crescimento</h4>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        Sua lista está crescendo 8.2% ao mês. Considerexe aumentar a frequência de campanhas.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-purple-900 dark:text-purple-100">Melhor Horário</h4>
                      <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                        Terças-feiras às 10h têm as melhores taxas de abertura para sua audiência.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="flex items-start gap-3">
                    <Activity className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-orange-900 dark:text-orange-100">Segmentação</h4>
                      <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                        Teste campanhas segmentadas por idade ou localização para melhorar o engajamento.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de Criação de Campanha */}
      <CreateEmailCampaignModal
        isOpen={isCreateCampaignModalOpen}
        onClose={() => setIsCreateCampaignModalOpen(false)}
      />

      {/* Modal de Visualização de Campanha */}
      <ViewCampaignModal
        isOpen={isViewCampaignModalOpen}
        onClose={() => setIsViewCampaignModalOpen(false)}
        campaign={selectedCampaign}
      />

      {/* Modal de Edição de Campanha */}
      <EditCampaignModal
        isOpen={isEditCampaignModalOpen}
        onClose={() => setIsEditCampaignModalOpen(false)}
        campaign={selectedCampaign}
        onSave={async (campaignId, updates) => {
          await updateCampaign(campaignId, updates);
          loadCampaigns(); // Recarrega a lista de campanhas
        }}
      />

      {/* Dialog de Confirmação de Exclusão de Campanha */}
      <Dialog open={isDeleteCampaignDialogOpen} onOpenChange={setIsDeleteCampaignDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Confirmar Exclusão
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a campanha "{campaignToDelete?.name}"?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteCampaignDialogOpen(false);
                setCampaignToDelete(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteCampaign}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir Campanha
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Visualização de Lista */}
      <Dialog open={isViewListModalOpen} onOpenChange={setIsViewListModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Users className="h-5 w-5" />
              Lista: {selectedList?.name}
            </DialogTitle>
            <DialogDescription>
              Detalhes e contatos da lista de email
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {selectedList && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nome da Lista</Label>
                    <p className="text-sm font-medium">{selectedList.name}</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Badge variant={selectedList.status === 'active' ? 'default' : 'secondary'}>
                      {selectedList.status}
                    </Badge>
                  </div>
                  <div>
                    <Label>Total de Assinantes</Label>
                    <p className="text-lg font-bold">{(selectedList.subscribers_count || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <Label>Taxa de Crescimento</Label>
                    <p className="text-lg font-bold text-green-600">+{selectedList.growth_rate || 0}%</p>
                  </div>
                </div>

                <div>
                  <Label>Descrição</Label>
                  <p className="text-sm text-muted-foreground">{selectedList.description}</p>
                </div>

                <div>
                  <Label>Configurações</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Double Opt-in</span>
                      <Badge variant={selectedList.double_opt_in ? 'default' : 'secondary'}>
                        {selectedList.double_opt_in ? 'Ativado' : 'Desativado'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Auto-resposta</span>
                      <Badge variant={selectedList.auto_responder ? 'default' : 'secondary'}>
                        {selectedList.auto_responder ? 'Ativado' : 'Desativado'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewListModalOpen(false)}>
              Fechar
            </Button>
            <Button onClick={() => {
              setIsViewListModalOpen(false);
              setIsEditListModalOpen(true);
            }}>
              <Edit className="h-4 w-4 mr-2" />
              Editar Lista
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Edição de Lista */}
      <Dialog open={isEditListModalOpen} onOpenChange={setIsEditListModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Edit className="h-5 w-5" />
              Editar Lista: {selectedList?.name}
            </DialogTitle>
            <DialogDescription>
              Altere as informações da lista de email
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedList && (
              <>
                <div>
                  <Label htmlFor="listName">Nome da Lista</Label>
                  <Input
                    id="listName"
                    defaultValue={selectedList.name}
                    placeholder="Digite o nome da lista"
                  />
                </div>

                <div>
                  <Label htmlFor="listDescription">Descrição</Label>
                  <Textarea
                    id="listDescription"
                    defaultValue={selectedList.description}
                    placeholder="Descreva o propósito desta lista"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="listStatus">Status</Label>
                    <select
                      id="listStatus"
                      defaultValue={selectedList.status}
                      className="w-full p-2 border border-input bg-background rounded-md"
                    >
                      <option value="active">Ativa</option>
                      <option value="inactive">Inativa</option>
                      <option value="archived">Arquivada</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="doubleOptIn"
                        defaultChecked={selectedList.double_opt_in}
                        className="rounded"
                      />
                      <Label htmlFor="doubleOptIn">Double Opt-in</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="autoResponder"
                        defaultChecked={selectedList.auto_responder}
                        className="rounded"
                      />
                      <Label htmlFor="autoResponder">Auto-resposta</Label>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditListModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => {
              setIsEditListModalOpen(false);
              toast.success('Lista atualizada com sucesso!');
            }}>
              <Save className="h-4 w-4 mr-2" />
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão de Lista */}
      <Dialog open={isDeleteListDialogOpen} onOpenChange={setIsDeleteListDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Confirmar Exclusão
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a lista "{listToDelete?.name}"?
              Todos os {listToDelete?.subscribers_count || 0} contatos serão removidos permanentemente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteListDialogOpen(false);
                setListToDelete(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteList}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir Lista
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Criação de Template */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Criar Novo Template de Email</DialogTitle>
            <DialogDescription>
              Crie um novo template de email para suas campanhas
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Templates Padrão */}
            <div className="space-y-3">
              <Label>Templates Padrão</Label>
              <p className="text-sm text-muted-foreground">
                Escolha um template padrão para começar ou crie do zero
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {defaultTemplates.map((template, index) => (
                  <Card
                    key={index}
                    className="cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => applyDefaultTemplate(template)}
                  >
                    <CardContent className="p-4">
                      <h4 className="font-medium text-sm">{template.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {template.description}
                      </p>
                      <Badge variant="outline" className="mt-2 text-xs">
                        {template.category}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome do Template</Label>
                <Input
                  id="name"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  placeholder="Ex: Boas-vindas"
                />
              </div>
              <div>
                <Label htmlFor="category">Categoria</Label>
                <Input
                  id="category"
                  value={newTemplate.category}
                  onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                  placeholder="Ex: Sistema, Marketing"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                value={newTemplate.description}
                onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                placeholder="Descreva o propósito deste template"
              />
            </div>

            <div>
              <Label htmlFor="subject">Assunto do Email</Label>
              <Input
                id="subject"
                value={newTemplate.subject}
                onChange={(e) => setNewTemplate({ ...newTemplate, subject: e.target.value })}
                placeholder="Ex: Bem-vindo ao StorySpark!"
              />
            </div>

            <Tabs defaultValue="html" className="w-full">
              <TabsList>
                <TabsTrigger value="html">HTML</TabsTrigger>
                <TabsTrigger value="text">Texto</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>

              <TabsContent value="html" className="space-y-2">
                <Label htmlFor="html-content">Conteúdo HTML</Label>
                <CodeEditor
                  value={newTemplate.html_content}
                  onChange={handleHtmlContentChange}
                  language="html"
                  height="300px"
                  placeholder="Conteúdo HTML do email..."
                  minimap={false}
                  wordWrap={true}
                />
              </TabsContent>

              <TabsContent value="text" className="space-y-2">
                <Label htmlFor="text-content">Conteúdo em Texto</Label>
                <Textarea
                  id="text-content"
                  value={newTemplate.text_content}
                  onChange={(e) => setNewTemplate({ ...newTemplate, text_content: e.target.value })}
                  placeholder="Versão em texto do email..."
                  className="min-h-[200px]"
                />
              </TabsContent>

              <TabsContent value="preview" className="space-y-2">
                <Label>Preview do Email</Label>
                <div className="flex items-center gap-2 mb-2">
                  <Label className="text-xs">Visualizar como:</Label>
                  <div className="flex gap-1">
                    <Button size="sm" variant={newPreviewWidth === 360 ? 'default' : 'outline'} onClick={() => setNewPreviewWidth(360)}>Mobile</Button>
                    <Button size="sm" variant={newPreviewWidth === 600 ? 'default' : 'outline'} onClick={() => setNewPreviewWidth(600)}>Tablet</Button>
                    <Button size="sm" variant={newPreviewWidth === 800 ? 'default' : 'outline'} onClick={() => setNewPreviewWidth(800)}>Desktop</Button>
                  </div>
                </div>
                <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 min-h-[200px]">
                  {newTemplate.subject && (
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                      <strong>Assunto:</strong> {(() => {
                        let s = newTemplate.subject;
                        Object.entries(newTemplateVars).forEach(([k, v]) => {
                          s = s.replace(new RegExp(`{{${k}}}`, 'g'), String(v ?? ''));
                        });
                        return s;
                      })()}
                    </div>
                  )}
                  {newTemplate.html_content ? (
                    <EmailPreview
                      html={(() => {
                        let html = newTemplate.html_content;
                        Object.entries(newTemplateVars).forEach(([k, v]) => {
                          html = html.replace(new RegExp(`{{${k}}}`, 'g'), String(v ?? ''));
                        });
                        return html;
                      })()}
                      width={newPreviewWidth}
                    />
                  ) : (
                    <div className="text-muted-foreground text-center py-8">
                      Digite o conteúdo HTML para ver o preview
                    </div>
                  )}
                </div>
                {(newTemplate.variables || []).length > 0 && (
                  <div className="mt-4 space-y-2">
                    <Label>Variáveis para Preview/Teste</Label>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      {(newTemplate.variables || []).map((variable) => (
                        <div key={variable} className="space-y-1">
                          <Label className="text-xs text-muted-foreground">{`{{${variable}}}`}</Label>
                          <Input
                            value={newTemplateVars[variable] ?? ''}
                            onChange={(e) => setNewTemplateVars({ ...newTemplateVars, [variable]: e.target.value })}
                            placeholder={`Valor para ${variable}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2 pt-2">
                  <Input
                    placeholder="Enviar teste para..."
                    value={testRecipient}
                    onChange={(e) => setTestRecipient(e.target.value)}
                    className="max-w-xs"
                  />
                  <Button variant="outline" onClick={async () => {
                    try {
                      const vars = newTemplateVars;
                      let subject = newTemplate.subject;
                      let html = newTemplate.html_content;
                      Object.entries(vars).forEach(([k, v]) => {
                        subject = subject.replace(new RegExp(`{{${k}}}`, 'g'), String(v ?? ''));
                        html = html.replace(new RegExp(`{{${k}}}`, 'g'), String(v ?? ''));
                      });
                      const res = await emailService.sendEmail({
                        to: [{ email: testRecipient }],
                        subject: subject || '(sem assunto)',
                        html,
                        text: newTemplate.text_content,
                        category: 'template_test'
                      });
                      if (res.success) toast.success('Teste enviado');
                      else toast.error(res.error || 'Falha ao enviar teste');
                    } catch (e: any) {
                      toast.error(e?.message || 'Erro ao enviar teste');
                    }
                  }}>
                    Enviar teste
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            {(newTemplate.variables || []).length > 0 && (
              <div>
                <Label>Variáveis Detectadas</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(newTemplate.variables || []).map((variable) => (
                    <Badge key={variable} variant="secondary">
                      {variable}
                    </Badge>
                  ))}
                </div>

                {/* Seção de teste de email */}
                <div className="mt-4 p-4 border rounded-lg bg-muted/50">
                  <Label className="text-sm font-medium">Testar Template</Label>
                  <p className="text-xs text-muted-foreground mb-3">
                    Envie um e-mail de teste para verificar como o template ficará
                  </p>

                  <div className="flex gap-2">
                    <Input
                      placeholder="E-mail para teste"
                      value={testRecipient}
                      onChange={(e) => setTestRecipient(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendTest('new')}
                      disabled={!testRecipient || !newTemplate.html_content || isSendingTest}
                    >
                      {isSendingTest ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4 mr-2" />
                      )}
                      {isSendingTest ? 'Enviando...' : 'Enviar Teste'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setNewTemplate({
                  name: '',
                  description: '',
                  subject: '',
                  html_content: '',
                  text_content: '',
                  variables: [],
                  tags: ['email'],
                  category: 'Sistema'
                });
                setNewTemplateVars({});
                setTestRecipient('');
              }}
            >
              Limpar
            </Button>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateTemplate} disabled={!newTemplate.name || !newTemplate.subject || !newTemplate.html_content || isCreating}>
              {isCreating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isCreating ? 'Criando...' : 'Criar Template'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Visualizar Template</DialogTitle>
            <DialogDescription>
              {selectedTemplate?.name} - {selectedTemplate?.subject}
            </DialogDescription>
          </DialogHeader>

          {selectedTemplate && (
            <Tabs defaultValue="preview" className="w-full">
              <TabsList>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="html">HTML</TabsTrigger>
                <TabsTrigger value="text">Texto</TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="space-y-4">
                <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                    <strong>Assunto:</strong> {selectedTemplate.subject}
                  </div>
                  <EmailPreview html={selectedTemplate.html_content || ''} />
                </div>
              </TabsContent>

              <TabsContent value="html">
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm overflow-auto max-h-96 text-gray-900 dark:text-gray-100">
                  <code>{selectedTemplate.html_content}</code>
                </pre>
              </TabsContent>

              <TabsContent value="text">
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm overflow-auto max-h-96 text-gray-900 dark:text-gray-100">
                  {selectedTemplate.text_content}
                </pre>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Template</DialogTitle>
            <DialogDescription>
              Edite as informações do template de email
            </DialogDescription>
          </DialogHeader>

          {selectedTemplate && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Nome do Template</Label>
                  <Input
                    id="edit-name"
                    value={selectedTemplate.name}
                    onChange={(e) => setSelectedTemplate({
                      ...selectedTemplate,
                      name: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-category">Categoria</Label>
                  <Input
                    id="edit-category"
                    value={selectedTemplate.category}
                    onChange={(e) => setSelectedTemplate({
                      ...selectedTemplate,
                      category: e.target.value
                    })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-description">Descrição</Label>
                <Input
                  id="edit-description"
                  value={selectedTemplate.description}
                  onChange={(e) => setSelectedTemplate({
                    ...selectedTemplate,
                    description: e.target.value
                  })}
                />
              </div>

              <div>
                <Label htmlFor="edit-subject">Assunto do Email</Label>
                <Input
                  id="edit-subject"
                  value={selectedTemplate.subject ?? ''}
                  onChange={(e) => setSelectedTemplate({
                    ...selectedTemplate,
                    subject: e.target.value
                  })}
                />
              </div>

              <Tabs value={dialogActiveTab} onValueChange={setDialogActiveTab}>
                <TabsList>
                  <TabsTrigger value="html">HTML</TabsTrigger>
                  <TabsTrigger value="text">Texto</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>

                <TabsContent value="html" className="space-y-2">
                  <Label htmlFor="edit-html-content">Conteúdo HTML</Label>
                  <CodeEditor
                    value={selectedTemplate.html_content ?? ''}
                    onChange={handleHtmlContentChange}
                    language="html"
                    height="300px"
                    minimap={false}
                    wordWrap={true}
                  />
                </TabsContent>

                <TabsContent value="text" className="space-y-2">
                  <Label htmlFor="edit-text-content">Conteúdo em Texto</Label>
                  <Textarea
                    id="edit-text-content"
                    value={selectedTemplate.text_content ?? ''}
                    onChange={(e) => setSelectedTemplate({
                      ...selectedTemplate,
                      text_content: e.target.value
                    })}
                    className="min-h-[200px]"
                  />
                </TabsContent>

                <TabsContent value="preview" className="space-y-2">
                  <Label>Preview do Email</Label>
                  <div className="flex items-center gap-2 mb-2">
                    <Label className="text-xs">Visualizar como:</Label>
                    <div className="flex gap-1">
                      <Button size="sm" variant={editPreviewWidth === 360 ? 'default' : 'outline'} onClick={() => setEditPreviewWidth(360)}>Mobile</Button>
                      <Button size="sm" variant={editPreviewWidth === 600 ? 'default' : 'outline'} onClick={() => setEditPreviewWidth(600)}>Tablet</Button>
                      <Button size="sm" variant={editPreviewWidth === 800 ? 'default' : 'outline'} onClick={() => setEditPreviewWidth(800)}>Desktop</Button>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 min-h-[200px]">
                    {selectedTemplate.subject && (
                      <div className="border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                        <strong>Assunto:</strong> {(() => {
                          let s = selectedTemplate.subject as string;
                          Object.entries(editTemplateVars).forEach(([k, v]) => {
                            s = s.replace(new RegExp(`{{${k}}}`, 'g'), String(v ?? ''));
                          });
                          return s;
                        })()}
                      </div>
                    )}
                    {selectedTemplate.html_content ? (
                      <EmailPreview
                        html={(() => {
                          let html = selectedTemplate.html_content as string;
                          Object.entries(editTemplateVars).forEach(([k, v]) => {
                            html = html.replace(new RegExp(`{{${k}}}`, 'g'), String(v ?? ''));
                          });
                          return html;
                        })()}
                        width={editPreviewWidth}
                      />
                    ) : (
                      <div className="text-muted-foreground text-center py-8">
                        Digite o conteúdo HTML para ver o preview
                      </div>
                    )}
                  </div>
                  {(selectedTemplate.variables || []).length > 0 && (
                    <div className="mt-4 space-y-2">
                      <Label>Variáveis para Preview/Teste</Label>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {(selectedTemplate.variables || []).map((variable) => (
                          <div key={variable} className="space-y-1">
                            <Label className="text-xs text-muted-foreground">{`{{${variable}}}`}</Label>
                            <Input
                              value={editTemplateVars[variable] ?? ''}
                              onChange={(e) => setEditTemplateVars({ ...editTemplateVars, [variable]: e.target.value })}
                              placeholder={`Valor para ${variable}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2 pt-2">
                    <Input
                      placeholder="Enviar teste para..."
                      value={testRecipient}
                      onChange={(e) => setTestRecipient(e.target.value)}
                      className="max-w-xs"
                    />
                    <Button variant="outline" onClick={async () => {
                      try {
                        const vars = editTemplateVars;
                        let subject = selectedTemplate.metadata!.subject as string;
                        let html = selectedTemplate.metadata!.html_content as string;
                        Object.entries(vars).forEach(([k, v]) => {
                          subject = subject.replace(new RegExp(`{{${k}}}`, 'g'), String(v ?? ''));
                          html = html.replace(new RegExp(`{{${k}}}`, 'g'), String(v ?? ''));
                        });
                        const res = await emailService.sendEmail({
                          to: [{ email: testRecipient }],
                          subject: subject || '(sem assunto)',
                          html,
                          text: selectedTemplate.metadata!.text_content as string,
                          category: `${selectedTemplate.id}_test`
                        });
                        if (res.success) toast.success('Teste enviado');
                        else toast.error(res.error || 'Falha ao enviar teste');
                      } catch (e: any) {
                        toast.error(e?.message || 'Erro ao enviar teste');
                      }
                    }}>
                      Enviar teste
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

              {(selectedTemplate.variables || []).length > 0 && (
                <div>
                  <Label>Variáveis Detectadas</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(selectedTemplate.variables || []).map((variable) => (
                      <Badge key={variable} variant="secondary">
                        {variable}
                      </Badge>
                    ))}
                  </div>

                  {/* Seção de teste de email */}
                  <div className="mt-4 p-4 border rounded-lg bg-muted/50">
                    <Label className="text-sm font-medium">Testar Template</Label>
                    <p className="text-xs text-muted-foreground mb-3">
                      Envie um e-mail de teste para verificar como o template ficará
                    </p>

                    <div className="flex gap-2">
                      <Input
                        placeholder="E-mail para teste"
                        value={testRecipient}
                        onChange={(e) => setTestRecipient(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSendTest('edit')}
                        disabled={!testRecipient || !selectedTemplate.html_content || isSendingTest}
                      >
                        {isSendingTest ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4 mr-2" />
                        )}
                        {isSendingTest ? 'Enviando...' : 'Enviar Teste'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                if (selectedTemplate) {
                  setSelectedTemplate({
                    ...selectedTemplate,
                    name: selectedTemplate.name,
                    description: selectedTemplate.description,
                    subject: selectedTemplate.subject,
                    html_content: selectedTemplate.html_content,
                    text_content: selectedTemplate.text_content,
                    metadata: selectedTemplate.metadata
                  });
                }
                setEditTemplateVars({});
                setTestRecipient('');
              }}
            >
              Restaurar
            </Button>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateTemplate} disabled={!selectedTemplate?.name || !selectedTemplate?.subject || !selectedTemplate?.html_content || isUpdating}>
              {isUpdating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isUpdating ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminEmailTemplates;
export { AdminEmailTemplates as Component };
