import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Plus, Search, Image, Video, FileText, Download, Star, Eye, Calendar } from 'lucide-react';
import UploadAssetModal from '@/components/modals/UploadAssetModal';

const ContentLibrary = () => {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [content] = useState([
    {
      id: 1,
      title: 'Hero Image - Curso Copy IA',
      type: 'image',
      category: 'marketing',
      size: '1.2 MB',
      format: 'PNG',
      dimensions: '1920x1080',
      tags: ['hero', 'curso', 'ia', 'copy'],
      downloads: 23,
      favorites: 8,
      uploaded: '2024-01-15',
      url: '/assets/hero-curso.png'
    },
    {
      id: 2,
      title: 'Video Explicativo - Features',
      type: 'video',
      category: 'explicativo',
      size: '45.6 MB',
      format: 'MP4',
      duration: '2:34',
      tags: ['explicativo', 'features', 'demo'],
      downloads: 15,
      favorites: 12,
      uploaded: '2024-01-12',
      url: '/assets/video-features.mp4'
    },
    {
      id: 3,
      title: 'Template Email - Newsletter',
      type: 'template',
      category: 'email',
      size: '456 KB',
      format: 'HTML',
      tags: ['email', 'newsletter', 'template'],
      downloads: 34,
      favorites: 19,
      uploaded: '2024-01-10',
      url: '/assets/email-template.html'
    },
    {
      id: 4,
      title: 'Ebook - Guia Completo Copy',
      type: 'document',
      category: 'lead-magnet',
      size: '8.2 MB',
      format: 'PDF',
      pages: 45,
      tags: ['ebook', 'copy', 'guia', 'lead-magnet'],
      downloads: 67,
      favorites: 28,
      uploaded: '2024-01-08',
      url: '/assets/ebook-copy.pdf'
    },
    {
      id: 5,
      title: 'Banner Social Media - Promoção',
      type: 'image',
      category: 'social',
      size: '890 KB',
      format: 'JPG',
      dimensions: '1080x1080',
      tags: ['banner', 'social', 'promocao', 'instagram'],
      downloads: 41,
      favorites: 16,
      uploaded: '2024-01-05',
      url: '/assets/banner-promo.jpg'
    },
  ]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'document': return <FileText className="h-4 w-4" />;
      case 'template': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'image': return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
      case 'video': return 'bg-purple-500/10 text-purple-700 dark:text-purple-400';
      case 'document': return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'template': return 'bg-orange-500/10 text-orange-700 dark:text-orange-400';
      default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
    }
  };

  const filteredContent = content.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Biblioteca de Conteúdo</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Organize e gerencie todos os seus assets de marketing
          </p>
        </div>
        <Button className="gap-2 w-full sm:w-auto" onClick={() => setUploadModalOpen(true)}>
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Upload Asset</span>
          <span className="sm:hidden">Upload</span>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar por título, tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Assets</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">
              +5 este mês
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">180</div>
            <p className="text-xs text-muted-foreground">
              Este mês
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Armazenamento</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4 GB</div>
            <p className="text-xs text-muted-foreground">
              de 10 GB utilizados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favoritos</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">83</div>
            <p className="text-xs text-muted-foreground">
              Assets marcados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="images">Imagens</TabsTrigger>
          <TabsTrigger value="videos">Vídeos</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredContent.map((item) => (
              <Card key={item.id} className="hover:border-primary/50 cursor-pointer transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={getTypeColor(item.type)}>
                          {getTypeIcon(item.type)}
                          <span className="ml-1">{item.type}</span>
                        </Badge>
                        <Badge variant="outline">{item.format}</Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Asset Preview */}
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      {getTypeIcon(item.type)}
                      <span className="ml-2 text-sm text-muted-foreground">
                        {item.type === 'image' && item.dimensions}
                        {item.type === 'video' && item.duration}
                        {item.type === 'document' && `${item.pages} páginas`}
                        {item.type === 'template' && 'Template'}
                      </span>
                    </div>
                    
                    {/* Metadata */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Tamanho:</span>
                        <span>{item.size}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Upload:</span>
                        <span>{new Date(item.uploaded).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                      {item.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{item.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                    
                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        <span>{item.downloads}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        <span>{item.favorites}</span>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        Visualizar
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredContent.filter(item => item.type === 'image').map((item) => (
              <Card key={item.id} className="hover:border-primary/50 cursor-pointer transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                  <CardDescription>{item.dimensions} • {item.size}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-3">
                    <Image className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Visualizar
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="videos" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredContent.filter(item => item.type === 'video').map((item) => (
              <Card key={item.id} className="hover:border-primary/50 cursor-pointer transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                  <CardDescription>{item.duration} • {item.size}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-3">
                    <Video className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Reproduzir
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredContent.filter(item => item.type === 'document').map((item) => (
              <Card key={item.id} className="hover:border-primary/50 cursor-pointer transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                  <CardDescription>{item.pages} páginas • {item.size}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-3">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Visualizar
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredContent.filter(item => item.type === 'template').map((item) => (
              <Card key={item.id} className="hover:border-primary/50 cursor-pointer transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                  <CardDescription>{item.format} • {item.size}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-3">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Usar Template
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <UploadAssetModal 
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
      />
    </div>
  );
};

export default ContentLibrary;