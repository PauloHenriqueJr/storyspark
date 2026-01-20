import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { cn } from '@/lib/utils';
import { appUrl } from '@/utils/urls';

const menuItems = [
  { name: 'Início', href: '/' },
  { name: 'Dashboard', href: appUrl('/dashboard') },
  { name: 'Blog', href: '/blog' },
];

export const BlogHeader = () => {
  const [menuState, setMenuState] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="w-full px-4">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative flex items-center justify-between py-4">
            {/* Logo */}
            <div className="flex w-full justify-between lg:w-auto">
              <Link
                to="/"
                aria-label="StorySpark"
                className="flex items-center space-x-2 group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary">
                  <Sparkles className="h-5 w-5 text-primary-foreground group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  StorySpark
                </span>
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? 'Fechar Menu' : 'Abrir Menu'}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className={cn("m-auto h-6 w-6 duration-200", menuState && "rotate-180 scale-0 opacity-0")} />
                <X className={cn("absolute inset-0 m-auto h-6 w-6 -rotate-180 scale-0 opacity-0 duration-200", menuState && "rotate-0 scale-100 opacity-100")} />
              </button>
            </div>

            {/* Desktop navigation */}
            <div className="hidden lg:block">
              <ul className="flex gap-8 text-sm">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    {item.href.startsWith('http') ? (
                      <a
                        href={item.href}
                        className="text-muted-foreground hover:text-primary block duration-200 font-medium"
                      >
                        <span>{item.name}</span>
                      </a>
                    ) : (
                      <Link
                        to={item.href}
                        className="text-muted-foreground hover:text-primary block duration-200 font-medium"
                      >
                        <span>{item.name}</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA buttons */}
            <div 
              className={cn(
                "bg-background mb-6 w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border border-border/50 p-6 shadow-elegant md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-3 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none",
                menuState ? "block" : "hidden lg:flex"
              )}
              data-state={menuState ? 'active' : 'inactive'}
            >
              {/* Mobile navigation */}
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      {item.href.startsWith('http') ? (
                        <a
                          href={item.href}
                          className="text-muted-foreground hover:text-primary block duration-200"
                          onClick={() => setMenuState(false)}
                        >
                          <span>{item.name}</span>
                        </a>
                      ) : (
                        <Link
                          to={item.href}
                          className="text-muted-foreground hover:text-primary block duration-200"
                          onClick={() => setMenuState(false)}
                        >
                          <span>{item.name}</span>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action buttons */}
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <ThemeToggle />
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                >
                  <a href={appUrl('/auth')}>
                    <span>Entrar</span>
                  </a>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="bg-gradient-primary hover:shadow-glow"
                >
                  <a href={appUrl('/dashboard')}>
                    <span>Dashboard</span>
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
