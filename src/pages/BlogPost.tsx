import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  CalendarDays, 
  Clock, 
  User, 
  ArrowLeft, 
  Share2, 
  BookmarkPlus,
  ThumbsUp,
  MessageCircle,
  Tag,
  Eye
} from "lucide-react";
import { BlogHeader } from "@/components/layout/BlogHeader";
import { Footer } from "@/components/layout/Footer";

// Mock data - In real app this would come from API
const blogPost = {
  id: 1,
  title: "10 Estratégias de Copywriting que Convertem em 2024",
  slug: "estrategias-copywriting-2024",
  excerpt: "Descubra as técnicas mais eficazes para criar textos que realmente convertem e engajam seu público-alvo.",
  content: `
    <h2>Por que o Copywriting é Fundamental para o Seu Negócio?</h2>
    <p>O copywriting é a arte e ciência de escrever textos persuasivos que levam as pessoas à ação. Em 2024, com a crescente competição digital, ter textos que realmente convertem se tornou mais importante do que nunca.</p>
    
    <h3>1. Conheça Profundamente Seu Público</h3>
    <p>Antes de escrever qualquer linha, você precisa entender quem é seu público-alvo. Crie personas detalhadas, entenda suas dores, desejos e linguagem.</p>
    
    <h3>2. Use Headlines Irresistíveis</h3>
    <p>Seus títulos são a primeira impressão. Eles devem ser claros, específicos e despertar curiosidade. Use números, benefícios e palavras de poder.</p>
    
    <h3>3. Foque nos Benefícios, Não nas Características</h3>
    <p>As pessoas não compram produtos, elas compram soluções para seus problemas. Sempre traduza características em benefícios concretos.</p>
    
    <h3>4. Crie Senso de Urgência</h3>
    <p>A escassez e urgência são gatilhos psicológicos poderosos. Use frases como "por tempo limitado" ou "últimas vagas" quando apropriado.</p>
    
    <h3>5. Use Prova Social</h3>
    <p>Depoimentos, cases de sucesso e números de clientes satisfeitos aumentam significativamente a credibilidade da sua mensagem.</p>
    
    <h3>6. Aplique a Fórmula AIDA</h3>
    <p>Atenção, Interesse, Desejo e Ação - essa fórmula clássica ainda funciona perfeitamente em 2024.</p>
    
    <h3>7. Teste e Otimize Constantemente</h3>
    <p>O que funciona para um negócio pode não funcionar para outro. Sempre teste diferentes abordagens e otimize baseado nos resultados.</p>
    
    <h3>8. Use Storytelling</h3>
    <p>Histórias criam conexão emocional. Use narrativas para ilustrar problemas e soluções de forma envolvente.</p>
    
    <h3>9. Seja Específico e Concreto</h3>
    <p>Evite linguagem vaga. Use números específicos, dados concretos e exemplos práticos sempre que possível.</p>
    
    <h3>10. Tenha uma CTA Clara e Forte</h3>
    <p>Sua chamada para ação deve ser clara, específica e criar expectativa sobre o que acontecerá quando o usuário clicar.</p>
    
    <h2>Conclusão</h2>
    <p>O copywriting eficaz é uma combinação de psicologia, estratégia e criatividade. Ao aplicar essas 10 estratégias, você estará muito mais próximo de criar textos que realmente convertem e geram resultados para seu negócio.</p>
  `,
  author: "Ana Silva",
  publishedAt: "2024-01-15",
  updatedAt: "2024-01-16",
  readTime: "8 min",
  views: 1248,
  likes: 89,
  category: "Copywriting",
  tags: ["marketing", "conversão", "estratégias", "copywriting", "vendas"],
  image: "/placeholder.svg",
  featured: true
};

const relatedPosts = [
  {
    id: 2,
    title: "IA na Criação de Conteúdo: Guia Completo",
    slug: "ia-criacao-conteudo-guia",
    image: "/placeholder.svg",
    readTime: "12 min"
  },
  {
    id: 3,
    title: "Brand Voice: Como Desenvolver a Voz da Sua Marca",
    slug: "brand-voice-voz-marca", 
    image: "/placeholder.svg",
    readTime: "6 min"
  }
];

const comments = [
  {
    id: 1,
    author: "João Santos",
    content: "Excelente artigo! As estratégias de urgência realmente funcionam no meu e-commerce.",
    publishedAt: "2024-01-16",
    replies: []
  },
  {
    id: 2,
    author: "Maria Costa",
    content: "Adorei a parte sobre storytelling. Vocês têm mais conteúdo sobre isso?",
    publishedAt: "2024-01-16",
    replies: [
      {
        id: 3,
        author: "Ana Silva",
        content: "Obrigada! Sim, temos um artigo específico sobre storytelling sendo preparado.",
        publishedAt: "2024-01-16"
      }
    ]
  }
];

export default function BlogPost() {
  const { slug } = useParams();
  const [newComment, setNewComment] = useState("");
  const [newCommentAuthor, setNewCommentAuthor] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blogPost.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <>
      <BlogHeader />
      <main className="min-h-screen bg-background">
        {/* Breadcrumb */}
        <section className="py-4 border-b">
          <div className="container mx-auto px-4">
            <nav className="flex items-center gap-2 text-sm">
              <Link to="/blog" className="text-muted-foreground hover:text-primary flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" />
                Blog
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground">{blogPost.category}</span>
            </nav>
          </div>
        </section>

        {/* Article Header */}
        <section className="py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="space-y-6">
              {/* Category and Meta */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <Badge variant="outline">{blogPost.category}</Badge>
                <span className="flex items-center gap-1">
                  <CalendarDays className="w-4 h-4" />
                  {new Date(blogPost.publishedAt).toLocaleDateString('pt-BR')}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {blogPost.readTime}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {blogPost.views} visualizações
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                {blogPost.title}
              </h1>

              {/* Excerpt */}
              <p className="text-xl text-muted-foreground">
                {blogPost.excerpt}
              </p>

              {/* Author and Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {blogPost.author.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{blogPost.author}</p>
                    <p className="text-sm text-muted-foreground">
                      Atualizado em {new Date(blogPost.updatedAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsLiked(!isLiked)}
                    className={isLiked ? "text-red-500 border-red-200" : ""}
                  >
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    {blogPost.likes + (isLiked ? 1 : 0)}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={isBookmarked ? "text-blue-500 border-blue-200" : ""}
                  >
                    <BookmarkPlus className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Featured Image */}
              <div className="aspect-video overflow-hidden rounded-lg">
                <img 
                  src={blogPost.image} 
                  alt={blogPost.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <div dangerouslySetInnerHTML={{ __html: blogPost.content }} />
            </div>

            {/* Tags */}
            <div className="mt-12 pt-8 border-t">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Tags:</span>
                {blogPost.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Comments Section */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="space-y-8">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                <h2 className="text-2xl font-bold">Comentários ({comments.length})</h2>
              </div>

              {/* Add Comment Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Deixe seu comentário</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input 
                    placeholder="Seu nome"
                    value={newCommentAuthor}
                    onChange={(e) => setNewCommentAuthor(e.target.value)}
                  />
                  <Textarea 
                    placeholder="Escreva seu comentário..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={4}
                  />
                  <Button>Publicar Comentário</Button>
                </CardContent>
              </Card>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <Card key={comment.id}>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {comment.author.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{comment.author}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(comment.publishedAt).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        <p>{comment.content}</p>
                        
                        {/* Replies */}
                        {comment.replies.length > 0 && (
                          <div className="ml-8 space-y-4 pt-4 border-t">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex items-start gap-3">
                                <Avatar className="w-8 h-8">
                                  <AvatarFallback className="text-xs">
                                    {reply.author.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium text-sm">{reply.author}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {new Date(reply.publishedAt).toLocaleDateString('pt-BR')}
                                    </p>
                                  </div>
                                  <p className="text-sm mt-1">{reply.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-bold mb-8">Artigos Relacionados</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-2 hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}