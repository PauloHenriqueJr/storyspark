import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const menuItems = [
  { name: 'Produto', href: '/templates' },
  { name: 'Como funciona', href: '/dashboard' },
  { name: 'Preços', href: '/billing' },
  { name: 'Blog', href: '/blog' },
];

export const Header = () => {
  const [menuState, setMenuState] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed z-50 w-full">
      <nav
        data-state={menuState && 'active'}
        className="w-full px-4"
      >
        <motion.div 
          className={cn(
            'mx-auto mt-4 max-w-6xl px-6 transition-all duration-500 lg:px-8',
            isScrolled && 'max-w-4xl rounded-2xl border border-border/50 bg-background/80 backdrop-blur-xl shadow-elegant lg:px-6'
          )}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-4 lg:gap-0 lg:py-5">
            {/* Logo */}
            <div className="flex w-full justify-between lg:w-auto">
              <Link
                to="/"
                aria-label="Dialeto"
                className="flex items-center space-x-2 group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary">
                  <Sparkles className="h-5 w-5 text-primary-foreground group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Dialeto
                </span>
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? 'Fechar Menu' : 'Abrir Menu'}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
                data-state={menuState ? 'active' : 'inactive'}
              >
                <Menu 
                  className={cn(
                    "m-auto h-6 w-6 duration-200 transition-all",
                    menuState && "rotate-180 scale-0 opacity-0"
                  )} 
                />
                <X 
                  className={cn(
                    "absolute inset-0 m-auto h-6 w-6 duration-200 transition-all",
                    menuState ? "rotate-0 scale-100 opacity-100" : "-rotate-180 scale-0 opacity-0"
                  )} 
                />
              </button>
            </div>

            {/* Desktop navigation - Centro */}
            <div className="hidden lg:block">
              <ul className="flex gap-8 text-sm">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    {item.href.startsWith('/') ? (
                      <Link
                        to={item.href}
                        className="text-muted-foreground hover:text-primary block duration-200 font-medium"
                      >
                        <span>{item.name}</span>
                      </Link>
                    ) : (
                      <a
                        href={item.href}
                        className="text-muted-foreground hover:text-primary block duration-200 font-medium"
                      >
                        <span>{item.name}</span>
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA buttons - Direita */}
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
                      {item.href.startsWith('/') ? (
                        <Link
                          to={item.href}
                          className="text-muted-foreground hover:text-primary block duration-200"
                          onClick={() => setMenuState(false)}
                        >
                          <span>{item.name}</span>
                        </Link>
                      ) : (
                        <a
                          href={item.href}
                          className="text-muted-foreground hover:text-primary block duration-200"
                          onClick={() => setMenuState(false)}
                        >
                          <span>{item.name}</span>
                        </a>
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
                  <Link to="/login">
                    <span>Entrar</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="bg-gradient-primary hover:shadow-glow"
                >
                  <Link to="/register">
                    <span>Começar agora</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </nav>
    </header>
  );
};