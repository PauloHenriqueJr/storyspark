import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const menuItems = [
  { name: 'Início', anchor: 'hero' },
  { name: 'Como funciona', anchor: 'how-it-works' },
  { name: 'Preços', anchor: 'pricing' },
  { name: 'Blog', href: '/blog' },
];

const devPages = [
  { name: 'Waitlist A', href: '/waitlist' },
  { name: 'Waitlist B', href: '/waitlist-ab' },
  { name: 'Founder\'s Offer', href: '/founders-offer' },
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

  function scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -80; // ajuste conforme altura do header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

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

              <Link to="/" className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <motion.div
                    className="w-10 h-10 bg-orange-500 border-t border-primary/10 rounded-xl flex items-center justify-center animate-pulse-glow"
                  >
                    <Flame className="w-6 h-6 text-white" />
                  </motion.div>
                  <motion.div
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"
                  />
                </div>
                <div>
                  <h1 className="text-lg md:text-xl font-semibold text-foreground">
                    StorySpark
                  </h1>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="h-0.5 bg-gradient-to-r from-primary to-accent rounded-full"
                  />
                </div>
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

            {/* Desktop navigation - scroll to sections or link */}
            <div className="hidden lg:block">
              <ul className="flex gap-8 text-sm">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    {item.anchor ? (
                      <button
                        onClick={() => scrollToSection(item.anchor!)}
                        className="text-muted-foreground hover:text-primary font-medium transition-all duration-300"
                      >
                        {item.name}
                      </button>
                    ) : (
                      <Link
                        to={item.href!}
                        className="text-muted-foreground hover:text-primary block duration-200 font-medium"
                      >
                        {item.name}
                      </Link>
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
              {/* Mobile navigation - scroll to sections or link */}
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      {item.anchor ? (
                        <button
                          onClick={() => {
                            scrollToSection(item.anchor!);
                            setMenuState(false);
                          }}
                          className="text-muted-foreground hover:text-primary block duration-200"
                        >
                          {item.name}
                        </button>
                      ) : (
                        <Link
                          to={item.href!}
                          className="text-muted-foreground hover:text-primary block duration-200"
                          onClick={() => setMenuState(false)}
                        >
                          {item.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Dev Menu - Only in development */}
              {import.meta.env.DEV && (
                <div className="lg:hidden mb-4">
                  <div className="border-t border-border pt-4">
                    <p className="text-xs text-muted-foreground mb-2">🚧 Páginas de Teste:</p>
                    <ul className="space-y-2 text-sm">
                      {devPages.map((page, index) => (
                        <li key={index}>
                          <Link
                            to={page.href}
                            className="text-muted-foreground hover:text-primary block"
                            onClick={() => setMenuState(false)}
                          >
                            {page.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <ThemeToggle />

                {/* Dev dropdown for desktop */}
                {import.meta.env.DEV && (
                  <div className="hidden lg:block relative group">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      🚧 Test Pages
                    </Button>
                    <div className="absolute top-full right-0 mt-1 bg-background border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="p-2 min-w-[140px]">
                        {devPages.map((page, index) => (
                          <Link
                            key={index}
                            to={page.href}
                            className="block px-3 py-2 text-xs text-muted-foreground hover:text-primary hover:bg-muted rounded-md transition-colors"
                          >
                            {page.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  asChild
                  variant="outline"
                  size="sm"
                >
                  <Link to="/auth">
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