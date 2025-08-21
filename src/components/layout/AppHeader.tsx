import React from 'react';
import { Bell, Search, User, LogOut } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from './ThemeToggle';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { GlobalSearch } from '@/components/search/GlobalSearch';

export const AppHeader = () => {
  const { user, logout } = useAuth();
  
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-smooth border-b border-border/40">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left side - Sidebar trigger and Search */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden" />
          
          <div className="hidden md:flex items-center max-w-md w-full">
            <GlobalSearch />
          </div>
        </div>

        {/* Right side - Actions and Profile */}
        <div className="flex items-center gap-4">
          {/* Mobile search */}
          <div className="md:hidden">
            <GlobalSearch 
              trigger={
                <Button variant="ghost" size="sm">
                  <Search className="h-4 w-4" />
                </Button>
              }
            />
          </div>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground border-2 border-background">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notificações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-4">
                <div className="font-medium">Nova campanha criada</div>
                <div className="text-sm text-muted-foreground">
                  Sua campanha "Black Friday 2024" foi criada com sucesso
                </div>
                <div className="text-xs text-muted-foreground">2 min atrás</div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-4">
                <div className="font-medium">Analytics disponível</div>
                <div className="text-sm text-muted-foreground">
                  Relatório semanal de performance está pronto
                </div>
                <div className="text-xs text-muted-foreground">1 hora atrás</div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar_url || '/placeholder.svg'} alt={user?.name || 'Usuario'} />
                  <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name || 'Usuario'}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || 'email@exemplo.com'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};