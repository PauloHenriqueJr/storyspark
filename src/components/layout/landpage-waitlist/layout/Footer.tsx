import { Instagram, Twitter, Linkedin, Mail, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border/50">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary-light rounded-xl flex items-center justify-center">
                <span className="text-lg font-bold text-white">S</span>
              </div>
              <h3 className="text-xl font-bold text-foreground">StorySpark</h3>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              A primeira plataforma brasileira de copy com IA que entende sua marca e gera conteúdo de alta conversão.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-muted/50 hover:bg-primary/20 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-muted/50 hover:bg-primary/20 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-muted/50 hover:bg-primary/20 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-muted/50 hover:bg-primary/20 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Produto</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Funcionalidades</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Preços</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Templates</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Comunidade</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Suporte</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Central de Ajuda</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Contato</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Status</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Roadmap</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2024 StorySpark. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-2 text-muted-foreground text-sm mt-4 md:mt-0">
            <span>Feito com</span>
            <Heart className="w-4 h-4 text-primary fill-current" />
            <span>no Brasil</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;