import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Clock, Search, User, ArrowRight, Tag } from "lucide-react";
import { BlogHeader } from "@/components/layout/BlogHeader";
import { Footer } from "@/components/layout/Footer";

// Mock data for blog posts
const blogPosts = [
  {
    id: 1,
    title: "10 Estratégias de Copywriting que Convertem em 2024",
    slug: "estrategias-copywriting-2024",
    excerpt: "Descubra as técnicas mais eficazes para criar textos que realmente convertem e engajam seu público-alvo.",
    content: "Lorem ipsum dolor sit amet...",
    author: "Ana Silva",
    publishedAt: "2024-01-15",
    readTime: "8 min",
    category: "Copywriting",
    tags: ["marketing", "conversão", "estratégias"],
    image: "/placeholder.svg",
    featured: true
  },
  {
    id: 2,
    title: "IA na Criação de Conteúdo: Guia Completo",
    slug: "ia-criacao-conteudo-guia",
    excerpt: "Como usar inteligência artificial para acelerar sua produção de conteúdo sem perder a autenticidade.",
    content: "Lorem ipsum dolor sit amet...",
    author: "Carlos Santos",
    publishedAt: "2024-01-12",
    readTime: "12 min",
    category: "Tecnologia",
    tags: ["ia", "conteúdo", "automação"],
    image: "/placeholder.svg",
    featured: false
  },
  {
    id: 3,
    title: "Brand Voice: Como Desenvolver a Voz da Sua Marca",
    slug: "brand-voice-voz-marca",
    excerpt: "Um guia prático para criar uma identidade verbal única e consistente para sua marca.",
    content: "Lorem ipsum dolor sit amet...",
    author: "Marina Costa",
    publishedAt: "2024-01-10",
    readTime: "6 min",
    category: "Branding",
    tags: ["branding", "identidade", "comunicação"],
    image: "/placeholder.svg",
    featured: false
  },
  {
    id: 4,
    title: "Analytics de Conteúdo: Métricas que Importam",
    slug: "analytics-conteudo-metricas",
    excerpt: "Aprenda a medir o sucesso do seu conteúdo com as métricas certas e otimize sua estratégia.",
    content: "Lorem ipsum dolor sit amet...",
    author: "Roberto Lima",
    publishedAt: "2024-01-08",
    readTime: "10 min",
    category: "Analytics",
    tags: ["analytics", "métricas", "roi"],
    image: "/placeholder.svg",
    featured: false
  }
];

const categories = ["Todos", "Copywriting", "Tecnologia", "Branding", "Analytics", "Marketing"];

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Filter posts based on search and category
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "Todos" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);
  const featuredPost = blogPosts.find(post => post.featured);

  return (
    <>
      <BlogHeader />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 via-primary/10 to-transparent py-16">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Blog StorySpark
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Insights, estratégias e tendências para maximizar o impacto do seu conteúdo
              </p>
              
              {/* Newsletter Signup */}
              <div className="max-w-md mx-auto">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Seu email para novidades" 
                    className="flex-1"
                  />
                  <Button>Assinar</Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Receba as melhores dicas direto no seu email
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPost && (
          <section className="py-12 bg-gradient-to-r from-accent/5 to-transparent">
            <div className="container mx-auto px-4">
              <div className="mb-8">
                <Badge variant="secondary" className="mb-4">
                  <Tag className="w-3 h-3 mr-1" />
                  Post em Destaque
                </Badge>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="md:flex">
                    <div className="md:w-1/2">
                      <img 
                        src={featuredPost.image} 
                        alt={featuredPost.title}
                        className="w-full h-64 md:h-full object-cover"
                      />
                    </div>
                    <div className="md:w-1/2 p-6">
                      <CardHeader className="p-0 pb-4">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <Badge variant="outline">{featuredPost.category}</Badge>
                          <span className="flex items-center gap-1">
                            <CalendarDays className="w-4 h-4" />
                            {new Date(featuredPost.publishedAt).toLocaleDateString('pt-BR')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {featuredPost.readTime}
                          </span>
                        </div>
                        <CardTitle className="text-2xl mb-2">{featuredPost.title}</CardTitle>
                        <CardDescription className="text-base">{featuredPost.excerpt}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span className="text-sm">{featuredPost.author}</span>
                          </div>
                          <Button variant="outline" className="group">
                            Ler mais
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </section>
        )}

        {/* Filters and Search */}
        <section className="py-8 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  placeholder="Buscar posts..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filters */}
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setSelectedCategory(category);
                      setCurrentPage(1);
                    }}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {currentPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Nenhum post encontrado com os filtros selecionados.</p>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {currentPosts.map((post) => (
                    <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardHeader>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <Badge variant="outline">{post.category}</Badge>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {post.readTime}
                          </span>
                        </div>
                        <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="w-4 h-4" />
                            <span>{post.author}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(post.publishedAt).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <Separator className="my-4" />
                        <div className="flex flex-wrap gap-1">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    ))}
                    
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Próxima
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}