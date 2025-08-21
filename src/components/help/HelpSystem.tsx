import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  HelpCircle, 
  Search, 
  Book, 
  Video, 
  MessageCircle, 
  Keyboard,
  Zap,
  Target,
  Bot,
  BarChart3,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HelpArticle {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'article' | 'video' | 'shortcut';
  content: string;
  tags: string[];
}

const helpArticles: HelpArticle[] = [
  {
    id: 'getting-started',
    title: 'Primeiros Passos no StorySpark',
    description: 'Aprenda como começar a usar a plataforma',
    category: 'Básico',
    type: 'article',
    content: 'Guia completo para iniciantes...',
    tags: ['iniciante', 'setup', 'tutorial']
  },
  {
    id: 'composer-guide',
    title: 'Como usar o Composer IA',
    description: 'Crie copies incríveis com nossa IA',
    category: 'Composer',
    type: 'video',
    content: 'Video tutorial do Composer...',
    tags: ['ia', 'composer', 'copy']
  },
  {
    id: 'keyboard-shortcuts',
    title: 'Atalhos de Teclado',
    description: 'Seja mais produtivo com atalhos',
    category: 'Produtividade',
    type: 'shortcut',
    content: 'Lista de atalhos úteis...',
    tags: ['atalhos', 'produtividade', 'teclado']
  },
  {
    id: 'campaigns-management',
    title: 'Gerenciando Campanhas',
    description: 'Organize e acompanhe suas campanhas',
    category: 'Campanhas',
    type: 'article',
    content: 'Como criar e gerenciar campanhas...',
    tags: ['campanhas', 'organização', 'gestão']
  }
];

const shortcuts = [
  { key: 'Ctrl + K', action: 'Busca global' },
  { key: 'Ctrl + N', action: 'Nova campanha' },
  { key: 'Ctrl + Shift + C', action: 'Abrir Composer' },
  { key: 'Ctrl + Shift + A', action: 'Ver Analytics' },
  { key: 'Esc', action: 'Fechar modal/menu' },
  { key: '?', action: 'Mostrar ajuda' }
];

export const HelpSystem = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredArticles = helpArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(helpArticles.map(article => article.category)))];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'shortcut': return <Keyboard className="h-4 w-4" />;
      default: return <Book className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-red-500/10 text-red-700 dark:text-red-400';
      case 'shortcut': return 'bg-purple-500/10 text-purple-700 dark:text-purple-400';
      default: return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
    }
  };

  // Keyboard shortcut para abrir help
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Help Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 h-12 w-12 rounded-full p-0 shadow-elegant"
      >
        <HelpCircle className="h-5 w-5" />
      </Button>

      {/* Help Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="mx-4 w-full max-w-4xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="h-full">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <HelpCircle className="h-5 w-5" />
                        Central de Ajuda
                      </CardTitle>
                      <CardDescription>
                        Encontre respostas e aprenda como usar o StorySpark
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Search */}
                  <div className="relative mt-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Buscar ajuda..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardHeader>

                <CardContent className="p-0 overflow-y-auto max-h-[60vh]">
                  <Tabs defaultValue="articles" className="h-full">
                    <TabsList className="grid w-full grid-cols-3 m-4 mb-0">
                      <TabsTrigger value="articles">Artigos</TabsTrigger>
                      <TabsTrigger value="shortcuts">Atalhos</TabsTrigger>
                      <TabsTrigger value="contact">Contato</TabsTrigger>
                    </TabsList>

                    <TabsContent value="articles" className="p-4 space-y-4">
                      {/* Category Filter */}
                      <div className="flex gap-2 flex-wrap">
                        {categories.map((category) => (
                          <Badge
                            key={category}
                            variant={selectedCategory === category ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => setSelectedCategory(category)}
                          >
                            {category === 'all' ? 'Todos' : category}
                          </Badge>
                        ))}
                      </div>

                      {/* Articles */}
                      <div className="space-y-3">
                        {filteredArticles.map((article) => (
                          <Card key={article.id} className="hover:border-primary/50 cursor-pointer transition-colors">
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <div className="space-y-1 flex-1">
                                  <div className="flex items-center gap-2">
                                    <CardTitle className="text-lg">{article.title}</CardTitle>
                                    <Badge className={getTypeColor(article.type)}>
                                      {getTypeIcon(article.type)}
                                      <span className="ml-1 capitalize">{article.type}</span>
                                    </Badge>
                                  </div>
                                  <CardDescription>{article.description}</CardDescription>
                                </div>
                              </div>
                            </CardHeader>
                          </Card>
                        ))}

                        {filteredArticles.length === 0 && (
                          <div className="text-center py-8">
                            <Book className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Nenhum artigo encontrado</h3>
                            <p className="text-muted-foreground">
                              Tente ajustar sua busca ou contate o suporte
                            </p>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="shortcuts" className="p-4">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold mb-3">Atalhos de Teclado</h3>
                          <div className="space-y-2">
                            {shortcuts.map((shortcut, index) => (
                              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                <span className="text-sm">{shortcut.action}</span>
                                <Badge variant="outline" className="font-mono">
                                  {shortcut.key}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="font-semibold mb-3">Navegação Rápida</h3>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 border rounded-lg">
                              <div className="flex items-center gap-2 mb-1">
                                <Bot className="h-4 w-4 text-primary" />
                                <span className="font-medium">Composer</span>
                              </div>
                              <p className="text-xs text-muted-foreground">Crie copies com IA</p>
                            </div>
                            <div className="p-3 border rounded-lg">
                              <div className="flex items-center gap-2 mb-1">
                                <Target className="h-4 w-4 text-primary" />
                                <span className="font-medium">Campanhas</span>
                              </div>
                              <p className="text-xs text-muted-foreground">Gerencie projetos</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="contact" className="p-4">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold mb-3">Precisa de mais ajuda?</h3>
                          <div className="space-y-3">
                            <Card>
                              <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                  <MessageCircle className="h-5 w-5 text-primary" />
                                  <div>
                                    <h4 className="font-medium">Chat ao Vivo</h4>
                                    <p className="text-sm text-muted-foreground">
                                      Fale conosco em tempo real
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                  <Book className="h-5 w-5 text-primary" />
                                  <div>
                                    <h4 className="font-medium">Documentação</h4>
                                    <p className="text-sm text-muted-foreground">
                                      Guias detalhados e referências
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};