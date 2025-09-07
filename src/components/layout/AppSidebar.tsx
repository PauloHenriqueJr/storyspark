import React, { useState, useEffect } from 'react';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { NavLink, useLocation } from 'react-router-dom';
import {
  BarChart3,
  Bot,
  Calendar,
  FileText,
  Home,
  Puzzle,
  Settings,
  Sparkles,
  Users,
  Zap,
  Flame,
  CreditCard,
  Target,
  Send,
  Share2,
  Globe,
  MessageSquare,
  TrendingUp,
  Lightbulb,
  TestTube,
  Library,
  Shield,
  UserCog,
  Database,
  Phone,
  Mic,
  Crown,
  ChevronDown,
  ChevronRight,
  Key,
  Mail,
  Activity
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useRole } from '@/hooks/useRole';

// Define the navigation item interface
interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

// Define the navigation section interface
interface NavSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: NavItem[];
}

// Navigation sections with organized structure
const navSections: NavSection[] = [
  {
    id: 'principal',
    title: 'Principal',
    icon: Home,
    items: [
      { title: 'Dashboard', url: '/dashboard', icon: Home },
      { title: 'Composer', url: '/composer', icon: Bot, badge: 'IA' },
      { title: 'Campanhas', url: '/campaigns', icon: Target },
      { title: 'Calendário', url: '/calendar', icon: Calendar },
      { title: 'Analytics', url: '/analytics', icon: BarChart3 },
    ]
  },
  {
    id: 'voices',
    title: 'Voices',
    icon: Mic,
    items: [
      { title: 'Voices IA', url: '/voices', icon: Mic, badge: 'Novo' },
      { title: 'Personas', url: '/personas', icon: Users },
      { title: 'Brand Voices', url: '/brand-voices', icon: Sparkles },
    ]
  },
  {
    id: 'distribution',
    title: 'Distribuição',
    icon: Send,
    items: [
      { title: 'Email Marketing', url: '/email-marketing', icon: Send },
      { title: 'Social Scheduler', url: '/social-scheduler', icon: Share2 },
      { title: 'Landing Pages', url: '/landing-pages', icon: Globe },
      { title: 'Push / WhatsApp', url: '/push-whatsapp', icon: MessageSquare },
    ]
  },
  {
    id: 'sales',
    title: 'Vendas',
    icon: TrendingUp,
    items: [
      { title: 'Funis', url: '/funnels', icon: TrendingUp },
      { title: 'Testes A/B', url: '/ab-tests', icon: TestTube },
      { title: 'Call Scripts', url: '/call-scripts', icon: Phone },
    ]
  },
  {
    id: 'content',
    title: 'Conteúdo',
    icon: FileText,
    items: [
      { title: 'Templates', url: '/templates', icon: FileText },
      { title: 'Biblioteca', url: '/content-library', icon: Library },
      { title: 'Ideias IA', url: '/ai-ideas', icon: Lightbulb, badge: 'IA' },
      { title: 'Trending Hooks', url: '/trending-hooks', icon: TrendingUp },
      { title: 'Hooks', url: '/hooks', icon: Zap },
    ]
  },
  {
    id: 'clients',
    title: 'Clientes',
    icon: Users,
    items: [
      { title: 'CRM', url: '/crm', icon: Users },
      { title: 'Feedback', url: '/feedback', icon: MessageSquare },
    ]
  },
  {
    id: 'system',
    title: 'Sistema',
    icon: Settings,
    items: [
      { title: 'Integrações', url: '/integrations', icon: Puzzle },
      { title: 'Equipe', url: '/team', icon: Users },
      { title: 'Faturamento', url: '/billing', icon: CreditCard },
      { title: 'Configurações', url: '/settings', icon: Settings },
    ]
  }
];

// Admin section - separate for security and maintainability
const adminSection: NavSection = {
  id: 'admin',
  title: 'Administração',
  icon: Shield,
  items: [
    { title: 'Admin Dashboard', url: '/admin', icon: Shield },
    { title: 'Feature Flags', url: '/admin/feature-flags', icon: Settings },
    { title: 'Clientes', url: '/admin/users', icon: UserCog },
    { title: 'Gerentes', url: '/admin/managers', icon: Crown },
    { title: 'Email Marketing', url: '/admin/email-templates', icon: Mail },
    { title: 'Waitlist', url: '/admin/waitlist', icon: Mail },
    { title: 'Jobs', url: '/admin/jobs', icon: FileText },
    { title: 'Logs', url: '/admin/logs', icon: Activity },
    { title: 'Sistema', url: '/admin/settings', icon: Database },
    { title: 'Segurança', url: '/admin/security', icon: Shield },
    { title: 'Permissões', url: '/admin/permissions', icon: Key },
    { title: 'Backup', url: '/admin/backup', icon: Database },
  ]
};

export const AppSidebar = () => {
  const { state } = useSidebar();
  const location = useLocation();
  const { hasAdminAccess } = useRole();
  const { isFlagEnabled } = useFeatureFlags();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  // State for collapsible sections - keeps Principal open by default
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    principal: true, // Keep main section open by default
  });

  const isActive = (path: string) => currentPath === path;

  const filterNavItems = (items: NavItem[], groupId: string): NavItem[] => {
    return items.filter(item => isFlagEnabled(groupId, item.url));
  };

  const isSectionVisible = (items: NavItem[], groupId: string) => {
    const filtered = filterNavItems(items, groupId);
    return filtered.length > 0;
  };

  // Check if any item in a section is active to keep section open
  const isSectionActive = (items: NavItem[]) => {
    return items.some(item => isActive(item.url));
  };

  const getNavClass = (path: string) => {
    return isActive(path)
      ? "bg-sidebar-accent text-sidebar-primary font-medium border-r-2 border-primary"
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground/70 hover:text-sidebar-foreground";
  };

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => {
      const isCurrentlyOpen = prev[sectionId];

      // Se a seção está sendo fechada, apenas fecha ela
      if (isCurrentlyOpen) {
        return {
          ...prev,
          [sectionId]: false
        };
      }

      // Se a seção está sendo aberta, fecha todas as outras e abre apenas esta
      const newState: Record<string, boolean> = {};
      Object.keys(prev).forEach(key => {
        newState[key] = false;
      });
      newState[sectionId] = true;

      return newState;
    });
  };

  // Função para garantir que seção ativa esteja aberta (executada quando a rota muda)
  useEffect(() => {
    const activeSection = [...navSections, adminSection].find(section =>
      isSectionActive(section.items)
    );

    if (activeSection && !openSections[activeSection.id]) {
      setOpenSections(prev => {
        // Verifica se realmente precisa atualizar para evitar loops
        if (prev[activeSection.id]) return prev;

        // Fecha todas as outras seções
        const newState: Record<string, boolean> = {};
        Object.keys(prev).forEach(key => {
          newState[key] = false;
        });
        // Abre apenas a seção ativa
        newState[activeSection.id] = true;
        return newState;
      });
    }
  }, [currentPath]); // Apenas currentPath como dependência

  // Collapsible Navigation Section Component
  const CollapsibleNavSection = ({
    section
  }: {
    section: typeof navSections[0];
  }) => {
    const filteredItems = filterNavItems(section.items, section.id);
    if (!isSectionVisible(section.items, section.id)) {
      return null;
    }

    const isOpen = openSections[section.id] || false;
    const hasActiveItem = isSectionActive(filteredItems);

    return (
      <Collapsible
        open={isOpen}
        onOpenChange={() => toggleSection(section.id)}
        className="space-y-1"
      >
        <CollapsibleTrigger className={`
          flex items-center gap-3 w-full px-3 py-2 text-left rounded-lg
          transition-all duration-200 group hover:bg-sidebar-accent/50
          ${hasActiveItem ? 'bg-sidebar-accent text-sidebar-primary font-medium' : 'text-sidebar-foreground/80'}
          ${collapsed ? 'justify-center px-2' : ''}
        `}>
          <section.icon className="h-5 w-5 flex-shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 font-medium">{section.title}</span>
              {isOpen ? (
                <ChevronDown className="h-4 w-4 transition-transform duration-200" />
              ) : (
                <ChevronRight className="h-4 w-4 transition-transform duration-200" />
              )}
            </>
          )}
        </CollapsibleTrigger>

        {!collapsed && (
          <CollapsibleContent className="space-y-1 pl-3">
            <div className="space-y-1">
              {filteredItems.map((item) => (
                <NavLink
                  key={item.title}
                  to={item.url}
                  className={`
                    flex items-center gap-3 px-3 py-2 ml-5 rounded-lg
                    transition-all duration-200 text-sm
                    ${getNavClass(item.url)}
                  `}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  <span className="flex-1">{item.title}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-primary/10 text-primary">
                      {item.badge}
                    </Badge>
                  )}
                </NavLink>
              ))}
            </div>
          </CollapsibleContent>
        )}
      </Collapsible>
    );
  };

  return (
    <Sidebar className="border-r border-sidebar-border/60" collapsible="icon">
      <SidebarContent className="bg-sidebar">
        {/* Logo Section */}
        <div className={`border-b border-sidebar-border/60 ${collapsed ? 'p-2' : 'p-4'}`}>
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow flex-shrink-0">
                {hasAdminAccess() ? (
                  <Flame className="w-5 h-5 text-white" />
                ) : (
                  <Zap className="w-5 h-5 text-white" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-bold text-sidebar-foreground text-lg truncate">
                  {hasAdminAccess() ? 'StorySpark Admin' : 'StorySpark'}
                </h2>
                <p className="text-xs text-sidebar-foreground/60 truncate">
                  {hasAdminAccess() ? 'Admin Panel' : 'IA Copy Creator'}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center">
              <div className="w-9 h-9 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow flex-shrink-0">
                {hasAdminAccess() ? (
                  <Flame className="w-5 h-5 text-white" />
                ) : (
                  <Zap className="w-5 h-5 text-white" />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
          {navSections.map((section) => (
            <CollapsibleNavSection key={section.id} section={section} />
          ))}

          {/* Admin Section - Separated for security */}
          {hasAdminAccess() && isSectionVisible(adminSection.items, adminSection.id) && (
            <>
              <div className="my-4 border-t border-sidebar-border/40" />
              <CollapsibleNavSection section={adminSection} />
            </>
          )}
        </div>

        {/* Sidebar Toggle */}
        <div className="p-3 border-t border-sidebar-border/60">
          <SidebarTrigger className="w-full h-9 justify-center hover:bg-sidebar-accent/50 transition-colors duration-200" />
        </div>
      </SidebarContent>
    </Sidebar>
  );
};