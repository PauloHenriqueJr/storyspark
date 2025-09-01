import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, Phone, MapPin, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const footerLinks = {
  produto: [
    { name: 'Recursos', href: '/templates' },
    { name: 'Preços', href: '/billing' },
    { name: 'Integrações', href: '/integrations' },
    { name: 'Templates', href: '/templates' }
  ],
  empresa: [
    { name: 'Sobre', href: '/dashboard' },
    { name: 'Blog', href: '/blog' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Contato', href: '/feedback' }
  ],
  suporte: [
    { name: 'Central de Ajuda', href: '/feedback' },
    { name: 'Documentação', href: '/templates' },
    { name: 'Configurações', href: '/settings' },
    { name: 'Equipe', href: '/team' }
  ],
  legal: [
    { name: 'Privacidade', href: '/settings' },
    { name: 'Termos', href: '/settings' },
    { name: 'Cookies', href: '/settings' },
    { name: 'Segurança', href: '/admin/security' }
  ]
};

export const Footer = () => {
  return (
    <footer className="bg-background border-t border-border/50">
      <div className="container mx-auto px-4">
        {/* Newsletter */}
        <div className="border-b border-border/50 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">
              Fique por dentro das novidades
            </h3>
            <p className="text-muted-foreground mb-8">
              Receba dicas de IA, atualizações do produto e conteúdo exclusivo diretamente no seu email.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Seu melhor email"
                className="flex-1"
              />
              <Button className="bg-gradient-primary hover:shadow-glow">
                Inscrever-se
              </Button>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Logo e descrição */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center space-x-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
                  <Flame className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  StorySpark
                </span>
              </Link>
              
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                A plataforma de IA mais avançada para criação de conteúdo. 
                Transforme suas ideias em campanhas incríveis.
              </p>

              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>contato@storyspark.ai</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>+55 (11) 9999-9999</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>São Paulo, SP</span>
                </div>
              </div>
            </div>

            {/* Links organizados */}
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2">
                {footerLinks.produto.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2">
                {footerLinks.empresa.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2">
                {footerLinks.suporte.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                {footerLinks.legal.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border/50 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2024 StorySpark. Todos os direitos reservados.
            </p>
            
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <span className="text-sm text-muted-foreground">Feito com ❤️ no Brasil</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};