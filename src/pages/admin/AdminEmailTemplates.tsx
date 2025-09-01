import React, { useState } from 'react';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
  Code,
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
  Clock,
  TrendingUp,
  UserPlus,
  Activity,
} from 'lucide-react';
import { toast } from 'sonner';
import { useEmailTemplates, EmailTemplate, CreateEmailTemplateInput } from '@/hooks/useEmailTemplates';
import CreateEmailCampaignModal from '@/components/modals/CreateEmailCampaignModal';
import { emailService } from '@/services/emailService';

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

const AdminEmailTemplates = () => {
  const {
    templates,
    loading,
    error,
    stats,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    detectTemplateVariables
  } = useEmailTemplates();

  // Estados para templates
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [activeTab, setActiveTab] = useState('templates');
  const [dialogActiveTab, setDialogActiveTab] = useState('html');

  // Estados para campanhas
  const [isCreateCampaignModalOpen, setIsCreateCampaignModalOpen] = useState(false);
  const [mainActiveTab, setMainActiveTab] = useState('templates');

  // Variáveis para preview e envio de teste
  const [newTemplateVars, setNewTemplateVars] = useState<Record<string, string>>({});
  const [editTemplateVars, setEditTemplateVars] = useState<Record<string, string>>({});
  const [testRecipient, setTestRecipient] = useState('');

  // Dados mockados para campanhas
  const [campaigns] = useState([
    {
      id: '1',
      name: 'Newsletter Semanal',
      subject: 'Novidades da Semana',
      status: 'sent',
      recipients: 1250,
      opens: 875,
      clicks: 234,
      sent_at: '2024-01-15T10:00:00Z',
      template_name: 'Newsletter Promocional'
    },
    {
      id: '2',
      name: 'Promoção Black Friday',
      subject: 'Ofertas Imperdíveis - Black Friday',
      status: 'scheduled',
      recipients: 2500,
      opens: 0,
      clicks: 0,
      scheduled_for: '2024-01-20T09:00:00Z',
      template_name: 'Newsletter Promocional'
    },
    {
      id: '3',
      name: 'Onboarding Novos Usuários',
      subject: 'Bem-vindo à nossa plataforma!',
      status: 'draft',
      recipients: 0,
      opens: 0,
      clicks: 0,
      template_name: 'E-mail de Boas-vindas'
    }
  ]);

  // Dados mockados para listas
  const [emailLists] = useState([
    {
      id: '1',
      name: 'Lista Principal',
      description: 'Todos os usuários ativos da plataforma',
      subscribers: 1250,
      createdAt: '2024-01-01T00:00:00Z',
      status: 'active',
      type: 'geral',
      growthRate: 12.5
    },
    {
      id: '2',
      name: 'Novos Usuários',
      description: 'Usuários cadastrados nos últimos 30 dias',
      subscribers: 180,
      createdAt: '2024-01-10T00:00:00Z',
      status: 'active',
      type: 'segmentada',
      growthRate: 8.3
    },
    {
      id: '3',
      name: 'Usuários Premium',
      description: 'Usuários com planos pagos',
      subscribers: 320,
      createdAt: '2023-12-15T00:00:00Z',
      status: 'active',
      type: 'premium',
      growthRate: 15.7
    }
  ]);

  // Dados mockados para analytics
  const [analytics] = useState({
    totalSent: 15420,
    openRate: 24.5,
    clickRate: 3.2,
    totalSubscribers: 1250,
    recentCampaigns: [
      {
        id: '1',
        name: 'Newsletter Semanal',
        subject: 'Novidades desta semana',
        recipients: 1250,
        opens: 356,
        clicks: 51,
        revenue: 2840.50,
        sentAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        name: 'Promoção Especial',
        subject: 'Ofertas imperdíveis só hoje!',
        recipients: 2100,
        opens: 674,
        clicks: 122,
        revenue: 4125.75,
        sentAt: '2024-01-12T14:30:00Z'
      },
      {
        id: '3',
        name: 'Update de Produto',
        subject: 'Novidades da plataforma',
        recipients: 950,
        opens: 183,
        clicks: 20,
        revenue: 890.25,
        sentAt: '2024-01-10T09:15:00Z'
      }
    ]
  });

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

  // Templates padrão com design responsivo e seguro
  const defaultTemplates = [
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
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f8fafc;
    }
    .container {
      background: white;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #f97316;
      margin-bottom: 10px;
    }
    .title {
      font-size: 24px;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 10px;
    }
    .subtitle {
      color: #6b7280;
      font-size: 16px;
    }
    .content {
      margin: 30px 0;
    }
    .highlight-box {
      background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
      color: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      margin: 25px 0;
    }
    .position-number {
      font-size: 32px;
      font-weight: bold;
      margin: 10px 0;
    }
    .ideas-section {
      background: #f8fafc;
      padding: 20px;
      border-radius: 8px;
      margin: 25px 0;
      border-left: 4px solid #f97316;
    }
    .idea-item {
      background: white;
      padding: 10px 15px;
      margin: 8px 0;
      border-radius: 6px;
      border: 1px solid #e5e7eb;
    }
    .benefits {
      margin: 30px 0;
    }
    .benefit {
      display: flex;
      align-items: center;
      margin: 15px 0;
      padding: 10px;
      background: #f8fafc;
      border-radius: 6px;
    }
    .benefit-icon {
      width: 20px;
      height: 20px;
      margin-right: 12px;
      color: #f97316;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 14px;
    }
    .social-links {
      margin: 20px 0;
    }
    .social-links a {
      color: #f97316;
      text-decoration: none;
      margin: 0 10px;
    }
  </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="logo">StorySpark</div>
        <h1 class="title">Bem-vindo à nossa waitlist! 🎉</h1>
        <p class="subtitle">Sua inscrição foi confirmada com sucesso</p>
      </div>
      
      <div class="content">
        <p>Olá,</p>
        
        <p>Obrigado por se juntar à waitlist do StorySpark! Estamos muito animados em tê-lo conosco na jornada para revolucionar a criação de copies com IA.</p>
        
        <div class="highlight-box">
          <p style="margin: 0; font-size: 16px;">Sua posição na waitlist:</p>
          <div class="position-number">#{{waitlistPosition}}</div>
          <p style="margin: 0; font-size: 14px; opacity: 0.9;">Você está cada vez mais perto do acesso!</p>
        </div>
        
        {{#if selectedIdeas}}
        <div class="ideas-section">
          <h3 style="color: #1f2937; margin-bottom: 15px;">💡 Suas ideias selecionadas:</h3>
          <p style="color: #6b7280; margin-bottom: 15px;">Obrigado por compartilhar seus interesses! Isso nos ajuda a priorizar as funcionalidades mais importantes.</p>
          {{selectedIdeas}}
        </div>
        {{/if}}
        
        <div class="benefits">
          <h3 style="color: #1f2937; margin-bottom: 20px;">O que esperar do StorySpark:</h3>
          
          <div class="benefit">
            <span class="benefit-icon">🤖</span>
            <span>IA avançada para criação de copies persuasivos</span>
          </div>
          
          <div class="benefit">
            <span class="benefit-icon">⚡</span>
            <span>Geração de conteúdo em segundos</span>
          </div>
          
          <div class="benefit">
            <span class="benefit-icon">🎯</span>
            <span>Templates otimizados para conversão</span>
          </div>
          
          <div class="benefit">
            <span class="benefit-icon">📊</span>
            <span>Analytics e insights de performance</span>
          </div>
          
          <div class="benefit">
            <span class="benefit-icon">🚀</span>
            <span>Integração com principais plataformas</span>
          </div>
        </div>
        
        <p><strong>Próximos passos:</strong></p>
        <ul style="color: #6b7280;">
          <li>Manteremos você atualizado sobre nosso progresso</li>
          <li>Você receberá acesso prioritário quando lançarmos</li>
          <li>Compartilharemos dicas e conteúdos exclusivos</li>
        </ul>
        
        <p>Enquanto isso, fique de olho em seu e-mail para atualizações importantes!</p>
        
        <p>Se você tiver alguma dúvida, nossa equipe está sempre disponível em <a href="mailto:{{supportEmail}}" style="color: #f97316;">{{supportEmail}}</a>.</p>
        
        <p style="margin-top: 30px;">
          Atenciosamente,<br>
          <strong>Equipe StorySpark</strong>
        </p>
      </div>
      
      <div class="footer">
        <div class="social-links">
          <a href="#">Website</a> |
          <a href="#">Blog</a> |
          <a href="#">Suporte</a>
        </div>
        <p>© 2024 StorySpark. Todos os direitos reservados.</p>
        <p style="font-size: 12px; margin-top: 10px;">
          Você está recebendo este e-mail porque se inscreveu em nossa waitlist.
          <a href="#" style="color: #f97316;">Cancelar inscrição</a>
        </p>
      </div>
    </div>
  </body>
  </html>`,
      text_content: `
Bem-vindo à waitlist do StorySpark!

Olá,

Obrigado por se juntar à waitlist do StorySpark! Estamos muito animados em tê-lo conosco na jornada para revolucionar a criação de copies com IA.

Sua posição na waitlist: #{{waitlistPosition}}

{{#if selectedIdeas}}
Suas ideias selecionadas:
{{selectedIdeas}}
{{/if}}

O que esperar do StorySpark:
🤖 IA avançada para criação de copies persuasivos
⚡ Geração de conteúdo em segundos
🎯 Templates otimizados para conversão
📊 Analytics e insights de performance
🚀 Integração com principais plataformas

Próximos passos:
- Manteremos você atualizado sobre nosso progresso
- Você receberá acesso prioritário quando lançarmos
- Compartilharemos dicas e conteúdos exclusivos

Enquanto isso, fique de olho em seu e-mail para atualizações importantes!

Se você tiver alguma dúvida, nossa equipe está sempre disponível em {{supportEmail}}.

Atenciosamente,
Equipe StorySpark

© 2024 StorySpark. Todos os direitos reservados.`
    },
    {
      name: 'Newsletter Promocional',
      category: 'Marketing',
      description: 'Template responsivo para newsletters promocionais com design moderno e compatível com modo escuro',
      subject: 'Oferta especial só para você! 🎉',
      html_content: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Newsletter Promocional</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    /* Reset styles */
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
    
    /* Base styles */
    body {
      margin: 0 !important;
      padding: 0 !important;
      background-color: #f8fafc !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', Arial, sans-serif !important;
      font-size: 16px;
      line-height: 1.6;
      color: #374151 !important;
    }
    
    /* Container */
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff !important;
    }
    
    .content-wrapper {
      padding: 40px 30px;
    }
    
    /* Header */
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #f97316 !important;
      margin-bottom: 10px;
      text-decoration: none;
    }
    
    .title {
      font-size: 24px;
      font-weight: 600;
      color: #1f2937 !important;
      margin: 10px 0;
      line-height: 1.3;
    }
    
    .subtitle {
      color: #6b7280 !important;
      font-size: 16px;
      margin: 0;
    }
    
    /* Content */
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
    
    /* CTA Button */
    .cta-container {
      text-align: center;
      margin: 30px 0;
    }
    
    .cta-button {
      display: inline-block;
      background-color: #f97316 !important;
      color: #ffffff !important;
      padding: 16px 32px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      border: none;
      cursor: pointer;
    }
    
    .cta-button:hover {
      background-color: #ea580c !important;
    }
    
    /* Footer */
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #6b7280 !important;
      font-size: 14px;
    }
    
    .footer p {
      margin: 8px 0;
      color: #6b7280 !important;
    }
    
    .footer a {
      color: #f97316 !important;
      text-decoration: none;
    }
    
    /* Responsive */
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
      }
      
      .content-wrapper {
        padding: 20px 15px !important;
      }
      
      .title {
        font-size: 20px !important;
      }
      
      .logo {
        font-size: 24px !important;
      }
      
      .cta-button {
        padding: 14px 24px !important;
        font-size: 14px !important;
      }
      
      .highlight-box {
        padding: 20px 15px !important;
      }
    }
    
    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
      .email-container {
        background-color: #1f2937 !important;
      }
      
      .content p {
        color: #e5e7eb !important;
      }
      
      .title {
        color: #f9fafb !important;
      }
      
      .subtitle {
        color: #d1d5db !important;
      }
      
      .footer {
        border-top-color: #374151 !important;
      }
      
      .footer p {
        color: #9ca3af !important;
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
              <!-- Header -->
              <div class="header">
                <div class="logo">{{companyName}}</div>
                <h1 class="title">{{title}}</h1>
                <p class="subtitle">{{subtitle}}</p>
              </div>
              
              <!-- Content -->
              <div class="content">
                <p>Olá {{userName}},</p>
                
                <p>{{mainMessage}}</p>
                
                <div class="highlight-box">
                  <h3>{{offerTitle}}</h3>
                  <p>{{offerDescription}}</p>
                </div>
                
                <div class="cta-container">
                  <a href="{{ctaUrl}}" class="cta-button">{{ctaText}}</a>
                </div>
                
                <p>{{closingMessage}}</p>
                
                <p style="margin-top: 30px;">
                   Atenciosamente,<br>
                   <strong>{{senderName}}</strong>
                 </p>
               </div>
               
               <!-- Footer -->
               <div class="footer">
                 <p>© 2024 {{companyName}}. Todos os direitos reservados.</p>
                 <p><a href="{{unsubscribeUrl}}">Cancelar inscrição</a> | <a href="{{preferencesUrl}}">Preferências</a></p>
               </div>
             </td>
           </tr>
         </table>
       </td>
     </tr>
   </table>
 </body>
 </html>`,
      text_content: `{{title}}\n\nOlá {{userName}},\n\n{{mainMessage}}\n\n{{offerTitle}}\n{{offerDescription}}\n\n{{ctaText}}: {{ctaUrl}}\n\n{{closingMessage}}\n\nAtenciosamente,\n{{senderName}}\n\n© 2024 {{companyName}}. Todos os direitos reservados.\n\nCancelar inscrição: {{unsubscribeUrl}}\nPreferências: {{preferencesUrl}}`
    },
    {
      name: 'E-mail de Boas-vindas',
      category: 'Transacional',
      description: 'Template de boas-vindas para novos usuários com design responsivo e compatível com modo escuro',
      subject: 'Bem-vindo(a) ao {{companyName}}! 🎉',
      html_content: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="format-detection" content="telephone=no">
  <meta name="format-detection" content="date=no">
  <meta name="format-detection" content="address=no">
  <meta name="format-detection" content="email=no">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Bem-vindo</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    /* Reset styles */
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
    
    /* Base styles */
    body {
      margin: 0 !important;
      padding: 0 !important;
      background-color: #f8fafc !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', Arial, sans-serif !important;
      font-size: 16px;
      line-height: 1.6;
      color: #374151 !important;
    }
    
    /* Container */
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff !important;
    }
    
    .content-wrapper {
      padding: 40px 30px;
    }
    
    /* Header */
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      padding: 40px 30px;
      text-align: center;
    }
    
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #ffffff !important;
      margin-bottom: 10px;
      text-decoration: none;
    }
    
    .title {
      font-size: 28px;
      font-weight: 700;
      color: #ffffff !important;
      margin: 10px 0;
      line-height: 1.3;
      text-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .subtitle {
      color: #e2e8f0 !important;
      font-size: 16px;
      margin: 0;
    }
    
    /* Content */
    .content p {
      margin: 16px 0;
      color: #374151 !important;
    }
    
    .welcome-box {
      background: linear-gradient(135deg, #e8f5e8 0%, #f0f9ff 100%) !important;
      border: 1px solid #d1fae5;
      color: #065f46 !important;
      padding: 25px 20px;
      border-radius: 12px;
      text-align: center;
      margin: 30px 0;
    }
    
    .welcome-box p {
      margin: 0 0 15px 0;
      color: #065f46 !important;
      font-size: 16px;
    }
    
    .welcome-box p:last-child {
      margin-bottom: 0;
    }
    
    /* Steps */
    .steps {
      margin: 30px 0;
    }
    
    .steps-title {
      font-size: 22px;
      font-weight: 600;
      color: #1f2937 !important;
      margin: 30px 0 20px 0;
      text-align: center;
    }
    
    .step {
      display: flex;
      align-items: flex-start;
      margin: 20px 0;
      padding: 20px;
      background: #f8fafc !important;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      border-left: 4px solid #f97316;
    }
    
    .step-number {
      background: #f97316 !important;
      color: white !important;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 14px;
      margin-right: 15px;
      flex-shrink: 0;
    }
    
    .step h4 {
      margin: 0 0 8px 0;
      color: #1f2937 !important;
      font-size: 18px;
      font-weight: 600;
    }
    
    .step p {
      margin: 0;
      color: #6b7280 !important;
      font-size: 15px;
      line-height: 1.5;
    }
    
    /* CTA Button */
    .cta-container {
      text-align: center;
      margin: 35px 0;
    }
    
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #f97316 0%, #ea580c 100%) !important;
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
    
    .cta-button:hover {
      background: linear-gradient(135deg, #ea580c 0%, #dc2626 100%) !important;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(249, 115, 22, 0.4);
    }
    
    /* Footer */
    .footer {
      margin-top: 40px;
      padding: 30px;
      background-color: #f7fafc !important;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #6b7280 !important;
      font-size: 14px;
    }
    
    .footer p {
      margin: 8px 0;
      color: #6b7280 !important;
    }
    
    .footer a {
      color: #f97316 !important;
      text-decoration: none;
    }
    
    .footer a:hover {
      text-decoration: underline;
    }
    
    /* Responsive */
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
      }
      
      .content-wrapper {
        padding: 20px 15px !important;
      }
      
      .header {
        padding: 30px 20px !important;
      }
      
      .title {
        font-size: 24px !important;
      }
      
      .logo {
        font-size: 24px !important;
      }
      
      .cta-button {
        padding: 14px 24px !important;
        font-size: 14px !important;
      }
      
      .welcome-box {
        padding: 20px 15px !important;
      }
      
      .step {
        padding: 15px !important;
        margin: 12px 0 !important;
      }
      
      .step h4 {
        font-size: 16px !important;
      }
      
      .step p {
        font-size: 14px !important;
      }
      
      .footer {
        padding: 25px 20px !important;
      }
    }
    
    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
      .email-container {
        background-color: #1f2937 !important;
      }
      
      .content-wrapper {
        background-color: #1f2937 !important;
      }
      
      .content p {
        color: #e5e7eb !important;
      }
      
      .welcome-box {
        background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%) !important;
        border-color: #4a5568 !important;
      }
      
      .welcome-box p {
        color: #e2e8f0 !important;
      }
      
      .steps-title {
        color: #e5e7eb !important;
      }
      
      .step {
        background-color: #2d3748 !important;
        border-color: #4a5568 !important;
      }
      
      .step h4 {
        color: #e5e7eb !important;
      }
      
      .step p {
        color: #cbd5e0 !important;
      }
      
      .footer {
        background-color: #2d3748 !important;
        border-top-color: #374151 !important;
      }
      
      .footer p {
        color: #9ca3af !important;
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
            <td>
              <!-- Header -->
              <div class="header">
                <div class="logo">{{companyName}}</div>
                <h1 class="title">Bem-vindo(a), {{userName}}! 🎉</h1>
                <p class="subtitle">{{welcomeMessage}}</p>
              </div>
              
              <!-- Content -->
              <div class="content-wrapper">
                <div class="content">
                  <div class="welcome-box">
                    <p><strong>{{introMessage}}</strong></p>
                  </div>
                  
                  <div class="cta-container">
                    <a href="{{dashboardUrl}}" class="cta-button">{{ctaText}}</a>
                  </div>
                  
                  <div class="steps">
                    <h3 class="steps-title">Primeiros passos:</h3>
                    
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
                  
                  <p style="text-align: center;">{{supportMessage}} <a href="mailto:{{supportEmail}}" style="color: #f97316;">{{supportEmail}}</a>.</p>
                  
                  <p style="margin-top: 30px; text-align: center;">
                    {{closingMessage}}<br>
                    <strong>{{senderName}}</strong>
                  </p>
                </div>
              </div>
              
              <!-- Footer -->
              <div class="footer">
                <p>© 2024 {{companyName}}. Todos os direitos reservados.</p>
                <p><a href="{{unsubscribeUrl}}">Cancelar inscrição</a> | <a href="{{preferencesUrl}}">Preferências</a></p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
      text_content: `Bem-vindo(a) ao {{companyName}}!\n\nOlá {{userName}},\n\n{{introMessage}}\n\n{{ctaText}}: {{dashboardUrl}}\n\nPrimeiros passos:\n1. {{step1Title}} - {{step1Description}}\n2. {{step2Title}} - {{step2Description}}\n3. {{step3Title}} - {{step3Description}}\n\n{{supportMessage}} {{supportEmail}}\n\n{{closingMessage}}\n{{senderName}}\n\n© 2024 {{companyName}}. Todos os direitos reservados.`
    },
    {
      name: 'Confirmação de Pedido',
      category: 'transactional',
      description: 'Template para confirmação de pedidos e compras',
      subject: 'Pedido confirmado #{{orderNumber}} - {{companyName}}',
      html_content: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmação de Pedido</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f8fafc;
    }
    .container {
      background: white;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #f97316;
      margin-bottom: 10px;
    }
    .title {
      font-size: 24px;
      font-weight: 600;
      color: #1f2937;
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
    .order-item:last-child {
      border-bottom: none;
      font-weight: bold;
      margin-top: 10px;
      padding-top: 15px;
      border-top: 2px solid #f97316;
    }
    .cta-button {
      display: inline-block;
      background: #f97316;
      color: white;
      padding: 14px 28px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin: 20px 0;
      transition: background-color 0.3s;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">{{companyName}}</div>
      <h1 class="title">Pedido Confirmado! ✅</h1>
      <p>Obrigado pela sua compra, {{customerName}}</p>
    </div>
    
    <div class="content">
      <div class="status-box">
        <h3 style="margin: 0 0 10px 0;">Pedido #{{orderNumber}}</h3>
        <p style="margin: 0;">Status: {{orderStatus}}</p>
      </div>
      
      <div class="order-details">
        <h3 style="color: #1f2937; margin-bottom: 15px;">Detalhes do Pedido:</h3>
        {{orderItems}}
        <div class="order-item">
          <span>Total:</span>
          <span>{{totalAmount}}</span>
        </div>
      </div>
      
      <p><strong>Informações de Entrega:</strong></p>
      <p style="color: #6b7280; margin-left: 20px;">
        {{deliveryAddress}}<br>
        Previsão de entrega: {{deliveryDate}}
      </p>
      
      <div style="text-align: center;">
        <a href="{{trackingUrl}}" class="cta-button">Acompanhar Pedido</a>
      </div>
      
      <p>{{supportMessage}} <a href="mailto:{{supportEmail}}" style="color: #f97316;">{{supportEmail}}</a>.</p>
      
      <p style="margin-top: 30px;">
        Obrigado pela preferência!<br>
        <strong>Equipe {{companyName}}</strong>
      </p>
    </div>
    
    <div class="footer">
      <p>© 2024 {{companyName}}. Todos os direitos reservados.</p>
    </div>
  </div>
</body>
</html>`,
      text_content: `Pedido Confirmado - {{companyName}}\n\nOlá {{customerName}},\n\nSeu pedido #{{orderNumber}} foi confirmado!\nStatus: {{orderStatus}}\n\nDetalhes do Pedido:\n{{orderItems}}\nTotal: {{totalAmount}}\n\nInformações de Entrega:\n{{deliveryAddress}}\nPrevisão: {{deliveryDate}}\n\nAcompanhar pedido: {{trackingUrl}}\n\n{{supportMessage}} {{supportEmail}}\n\nObrigado pela preferência!\nEquipe {{companyName}}\n\n© 2024 {{companyName}}. Todos os direitos reservados.`
    }
  ];

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
    // Inicializa variáveis para preview
    const initialVars: Record<string, string> = {};
    detectTemplateVariables(template.html_content).forEach(v => { initialVars[v] = ''; });
    setNewTemplateVars(initialVars);
  };

  // Criar novo template
  const handleCreateTemplate = async () => {
    try {
      const templateInput: CreateEmailTemplateInput = {
        name: newTemplate.name,
        description: newTemplate.description,
        subject: newTemplate.subject,
        html_content: newTemplate.html_content,
        text_content: newTemplate.text_content,
        category: newTemplate.category,
        is_active: true
      };

      const result = await createTemplate(templateInput);
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
      }
    } catch (error) {
      console.error('Erro ao criar template:', error);
    }
  };

  // Atualizar template
  const handleUpdateTemplate = async () => {
    if (!selectedTemplate) return;

    try {
      const success = await updateTemplate({
        id: selectedTemplate.id,
        name: selectedTemplate.name,
        description: selectedTemplate.description,
        subject: selectedTemplate.metadata?.subject,
        html_content: selectedTemplate.metadata?.html_content,
        text_content: selectedTemplate.metadata?.text_content,
        category: selectedTemplate.category,
        is_active: true
      });

      if (success) {
        setIsEditDialogOpen(false);
        setSelectedTemplate(null);
      }
    } catch (error) {
      console.error('Erro ao atualizar template:', error);
    }
  };

  // Excluir template
  const handleDeleteTemplate = async (templateId: string) => {
    await deleteTemplate(templateId);
  };

  // Duplicar template
  const handleDuplicateTemplate = async (template: EmailTemplate) => {
    await duplicateTemplate(template.id);
  };

  // Preview template
  const handlePreviewTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setIsPreviewDialogOpen(true);
  };

  // Editar template
  const handleEditTemplate = (template: EmailTemplate) => {
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

  // Filtrar templates (busca + categoria)
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = (
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (template.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (template.metadata?.subject || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    const norm = (s: string | undefined | null) => (s || '').toLowerCase();
    const hasCategoryFilter = selectedCategory && selectedCategory !== 'all';
    const matchesCategory = !hasCategoryFilter || norm(template.category) === norm(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  // Atualizar variáveis automaticamente quando o conteúdo HTML muda
  const handleHtmlContentChange = (content: string) => {
    const variables = detectTemplateVariables(content);
    
    if (selectedTemplate) {
      setSelectedTemplate({
        ...selectedTemplate,
        variables,
        metadata: {
          ...selectedTemplate.metadata,
          html_content: content
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
        if (res.success) toast.success('Teste enviado'); else toast.error(res.error || 'Falha ao enviar teste');
      } else if (selectedTemplate) {
        const { subject, html } = applyVars(selectedTemplate.metadata.subject || selectedTemplate.subject, selectedTemplate.metadata.html_content || selectedTemplate.html_content, editTemplateVars);
        const res = await emailService.sendEmail({
          to: [{ email: testRecipient }],
          subject: subject || '(sem assunto)',
          html,
          text: selectedTemplate.metadata.text_content || selectedTemplate.text_content,
          category: `${selectedTemplate.id}_test`
        });
        if (res.success) toast.success('Teste enviado'); else toast.error(res.error || 'Falha ao enviar teste');
      }
    } catch (e: any) {
      toast.error(e?.message || 'Erro ao enviar teste');
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Email Marketing</h1>
          <p className="text-muted-foreground">
            Gerencie campanhas, templates, listas e analytics de email marketing
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsCreateCampaignModalOpen(true)}
          >
            <Send className="h-4 w-4 mr-2" />
            Nova Campanha
          </Button>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Template
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      {/* Abas principais */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="campaigns" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Campanhas
          </TabsTrigger>
          <TabsTrigger value="lists" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Listas
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Conteúdo das Abas */}
        <TabsContent value="campaigns" className="space-y-6">
          {/* Estatísticas de Campanhas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <div className="text-2xl font-bold">{campaigns.filter(c => c.status === 'sending' || c.status === 'scheduled').length}</div>
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
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium">{campaign.name}</h3>
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status === 'sent' ? 'Enviada' :
                            campaign.status === 'scheduled' ? 'Agendada' :
                              campaign.status === 'draft' ? 'Rascunho' :
                                campaign.status === 'sending' ? 'Enviando' : campaign.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{campaign.subject}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {campaign.recipients.toLocaleString()} destinatários
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {campaign.opens.toLocaleString()} aberturas ({calculateOpenRate(campaign.opens, campaign.recipients)}%)
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          {campaign.clicks.toLocaleString()} cliques ({calculateClickRate(campaign.clicks, campaign.recipients)}%)
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {campaign.sent_at ? `Enviada em ${formatDate(campaign.sent_at)}` :
                            campaign.scheduled_for ? `Agendada para ${formatDate(campaign.scheduled_for)}` :
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
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Listas</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{emailLists.length}</div>
                <p className="text-xs text-muted-foreground">+1 nova lista este mês</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Contatos</CardTitle>
                <UserPlus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{emailLists.reduce((acc, list) => acc + list.subscribers, 0).toLocaleString()}</div>
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
                {emailLists.map((list) => (
                  <div key={list.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium">{list.name}</h3>
                        <Badge variant="outline">{list.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{list.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {list.subscribers.toLocaleString()} assinantes
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Criada em {formatDate(list.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          +{list.growthRate}% este mês
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
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          Visualizar Contatos
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar Lista
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Adicionar Contatos
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
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

        <TabsContent value="templates" className="space-y-6">
          {/* Filtros e Busca */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Categoria
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSelectedCategory('')}>
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
            </div>
          </div>

          {/* Grid de Templates */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{template.category}</Badge>
                      <Badge variant="secondary">
                        {template.variables?.length || 0} variáveis
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {template.subject}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <div className="text-2xl font-bold">{emailLists.reduce((acc, list) => acc + list.subscribers, 0).toLocaleString()}</div>
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

          {/* Campanhas Recentes */}
          <Card>
            <CardHeader>
              <CardTitle>Performance das Campanhas Recentes</CardTitle>
              <CardDescription>Análise detalhada das últimas campanhas enviadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.recentCampaigns.map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{campaign.name}</h3>
                      <p className="text-sm text-muted-foreground">{campaign.subject}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Enviada em {formatDate(campaign.sentAt)}</span>
                        <span>{campaign.recipients.toLocaleString()} destinatários</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <div className="font-medium">{calculateOpenRate(campaign.opens, campaign.recipients)}%</div>
                        <div className="text-xs text-muted-foreground">Abertura</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{calculateClickRate(campaign.clicks, campaign.recipients)}%</div>
                        <div className="text-xs text-muted-foreground">Clique</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">R$ {campaign.revenue?.toFixed(2) || '0.00'}</div>
                        <div className="text-xs text-muted-foreground">Receita</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Gráfico de Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Tendência de Performance</CardTitle>
              <CardDescription>Evolução das métricas ao longo do tempo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Gráfico de performance será implementado aqui</p>
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

      {/* Dialog de Criação de Template */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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

            <div className="grid grid-cols-2 gap-4">
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
                <div className="border rounded-lg p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-[200px]">
                  {newTemplate.subject && (
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                      <strong>Assunto:</strong> {newTemplate.subject}
                    </div>
                  )}
                  {newTemplate.html_content ? (
                    <div
                      className="email-preview"
                      dangerouslySetInnerHTML={{
                        __html: newTemplate.html_content
                      }}
                    />
                  ) : (
                    <div className="text-muted-foreground text-center py-8">
                      Digite o conteúdo HTML para ver o preview
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {newTemplate.variables.length > 0 && (
              <div>
                <Label>Variáveis Detectadas</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {newTemplate.variables.map((variable) => (
                    <Badge key={variable} variant="secondary">
                      {variable}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateTemplate} disabled={!newTemplate.name || !newTemplate.subject}>
              <Save className="h-4 w-4 mr-2" />
              Criar Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Visualizar Template</DialogTitle>
            <DialogDescription>
              {selectedTemplate?.name} - {selectedTemplate?.metadata?.subject}
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
                <div className="border rounded-lg p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                    <strong>Assunto:</strong> {selectedTemplate.metadata?.subject}
                  </div>
                  <div
                    className="email-preview"
                    dangerouslySetInnerHTML={{
                      __html: selectedTemplate.metadata?.html_content || ''
                    }}
                  />
                </div>
              </TabsContent>

              <TabsContent value="html">
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm overflow-auto max-h-96 text-gray-900 dark:text-gray-100">
                  <code>{selectedTemplate.metadata?.html_content}</code>
                </pre>
              </TabsContent>

              <TabsContent value="text">
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm overflow-auto max-h-96 text-gray-900 dark:text-gray-100">
                  {selectedTemplate.metadata?.text_content}
                </pre>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Template</DialogTitle>
            <DialogDescription>
              Edite as informações do template de email
            </DialogDescription>
          </DialogHeader>

          {selectedTemplate && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                  value={selectedTemplate.metadata?.subject}
                  onChange={(e) => setSelectedTemplate({
                    ...selectedTemplate,
                    metadata: {
                      ...selectedTemplate.metadata,
                      subject: e.target.value
                    }
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
                    value={selectedTemplate.metadata?.html_content ?? ''}
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
                    value={selectedTemplate.metadata?.text_content}
                    onChange={(e) => setSelectedTemplate({
                      ...selectedTemplate,
                      metadata: {
                        ...selectedTemplate.metadata,
                        text_content: e.target.value
                      }
                    })}
                    className="min-h-[200px]"
                  />
                </TabsContent>

                <TabsContent value="preview" className="space-y-2">
                  <Label>Preview do Email</Label>
                  <div className="border rounded-lg p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-[200px]">
                    {selectedTemplate.metadata?.subject && (
                      <div className="border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                        <strong>Assunto:</strong> {selectedTemplate.metadata.subject}
                      </div>
                    )}
                    {selectedTemplate.metadata?.html_content ? (
                      <div
                        className="email-preview"
                        dangerouslySetInnerHTML={{
                          __html: selectedTemplate.metadata?.html_content
                        }}
                      />
                    ) : (
                      <div className="text-muted-foreground text-center py-8">
                        Digite o conteúdo HTML para ver o preview
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              {selectedTemplate.variables.length > 0 && (
                <div>
                  <Label>Variáveis Detectadas</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedTemplate.variables.map((variable) => (
                      <Badge key={variable} variant="secondary">
                        {variable}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateTemplate}>
              <Save className="h-4 w-4 mr-2" />
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminEmailTemplates;
