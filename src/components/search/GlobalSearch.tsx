import React, { useState, useEffect } from 'react';
import { Search, FileText, Calendar, BarChart3, Users, Palette, Command } from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const searchResults: SearchResult[] = [
  // Campanhas
  {
    id: '1',
    title: 'Campanha Black Friday 2024',
    description: 'Campanha promocional para Black Friday',
    type: 'campaign',
    url: '/campaigns',
    icon: Calendar,
    badge: 'Ativa'
  },
  {
    id: '2',
    title: 'Lançamento Produto X',
    description: 'Campanha de lançamento do novo produto',
    type: 'campaign',
    url: '/campaigns',
    icon: Calendar,
    badge: 'Rascunho'
  },
  
  // Templates
  {
    id: '3',
    title: 'Template Post Promocional',
    description: 'Template para promoções e ofertas especiais',
    type: 'template',
    url: '/templates',
    icon: FileText,
    badge: 'Popular'
  },
  {
    id: '4',
    title: 'Template Story Engajamento',
    description: 'Template para stories interativos',
    type: 'template',
    url: '/templates',
    icon: FileText
  },
  
  // Analytics
  {
    id: '5',
    title: 'Relatório de Performance',
    description: 'Analytics das últimas campanhas',
    type: 'analytics',
    url: '/analytics',
    icon: BarChart3
  },
  
  // Personas
  {
    id: '6',
    title: 'Persona Jovem Profissional',
    description: 'Persona focada em jovens profissionais',
    type: 'persona',
    url: '/personas',
    icon: Users
  },
  
  // Páginas
  {
    id: '7',
    title: 'Dashboard',
    description: 'Página principal com métricas',
    type: 'page',
    url: '/dashboard',
    icon: BarChart3
  },
  {
    id: '8',
    title: 'Brand Voices',
    description: 'Configuração de vozes da marca',
    type: 'page',
    url: '/brand-voices',
    icon: Palette
  }
];

interface GlobalSearchProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export const GlobalSearch = ({ isOpen, onOpenChange, trigger }: GlobalSearchProps) => {
  const [open, setOpen] = useState(isOpen || false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen !== undefined) {
      setOpen(isOpen);
    }
  }, [isOpen]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    onOpenChange?.(open);
  };

  const handleSelect = (result: SearchResult) => {
    navigate(result.url);
    handleOpenChange(false);
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      campaign: 'Campanha',
      template: 'Template',
      analytics: 'Analytics',
      persona: 'Persona',
      page: 'Página'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const groupedResults = searchResults.reduce((acc, result) => {
    const type = result.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  return (
    <>
      {trigger ? (
        <div onClick={() => handleOpenChange(true)}>
          {trigger}
        </div>
      ) : (
        <Button
          variant="outline"
          className="relative justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
          onClick={() => handleOpenChange(true)}
        >
          <Search className="mr-2 h-4 w-4" />
          <span className="hidden lg:inline-flex">Buscar...</span>
          <span className="inline-flex lg:hidden">Buscar</span>
          <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      )}
      
      <CommandDialog open={open} onOpenChange={handleOpenChange}>
        <CommandInput placeholder="Buscar campanhas, templates, personas..." />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          
          {Object.entries(groupedResults).map(([type, results]) => (
            <CommandGroup key={type} heading={getTypeLabel(type)}>
              {results.map((result) => (
                <CommandItem
                  key={result.id}
                  value={`${result.title} ${result.description}`}
                  onSelect={() => handleSelect(result)}
                  className="flex items-center gap-3 p-3"
                >
                  <result.icon className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{result.title}</span>
                      {result.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {result.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {result.description}
                    </p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
};