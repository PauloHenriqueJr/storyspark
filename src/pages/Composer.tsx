import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Wand2, 
  Copy, 
  Download, 
  Share2, 
  Sparkles,
  Target,
  Users,
  MessageSquare,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Plus,
  X,
  History,
  Save,
  FileText,
  Eye,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth/AuthProvider';
import { copyGenerationService } from '@/services/copyGenerationService';
import { templatesService } from '@/services/templatesService';

const platforms = [
  { name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
  { name: 'Facebook', icon: Facebook, color: 'text-blue-600' },
  { name: 'Twitter', icon: Twitter, color: 'text-blue-400' },
  { name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
  { name: 'YouTube', icon: Youtube, color: 'text-red-500' },
];

const copyTypes = [
  { name: 'Post Orgânico', description: 'Conteúdo para feed principal' },
  { name: 'Stories', description: 'Conteúdo para stories' },
  { name: 'Anúncio', description: 'Copy para campanhas pagas' },
  { name: 'Carrossel', description: 'Série de posts relacionados' },
  { name: 'Reel/Video', description: 'Copy para vídeos curtos' },
];

const tones = [
  'Profissional', 'Casual', 'Divertido', 'Inspirador', 
  'Urgente', 'Educativo', 'Emocional', 'Minimalista'
];

interface Project {
  id: string;
  name: string;
  briefing: string;
  platform: string;
  copyType: string;
  tone: string;
  generatedCopy: string;
  versions: Array<{
    id: string;
    copy: string;
    timestamp: Date;
  }>;
  lastModified: Date;
}

interface ContextConfig {
  title?: string;
  // Add other properties as needed
}

interface LocationStateContext {
  page?: string;
  contextConfig?: ContextConfig;
  // Add other properties as needed
}

interface LocationState {
  briefing: string;
  platform: string;
  copyType: string;
  generatedCopy: string;
  context: LocationStateContext;
}

const Composer = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string>('');
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get active project
  const activeProject = projects.find(p => p.id === activeProjectId);

  // Auto-save functionality
  useEffect(() => {
    const autoSave = () => {
      if (projects.length > 0) {
        localStorage.setItem('composer-projects', JSON.stringify(projects));
      }
    };

    const interval = setInterval(autoSave, 5000); // Auto-save every 5 seconds
    return () => clearInterval(interval);
  }, [projects]);

  // Handle incoming data from FloatingCopyButton
  useEffect(() => {
    if (location.state) {
      const { briefing, platform, copyType, generatedCopy, context } = location.state as LocationState;
      
      if (briefing && generatedCopy) {
        // Criar nome do projeto baseado no contexto
        let projectName = `Copy - ${platform} ${copyType}`;
        if (context?.contextConfig?.title) {
          projectName = `${context.contextConfig.title} - ${platform} ${copyType}`;
        }
        
        // Criar novo projeto com os dados recebidos
        const newProject: Project = {
          id: Date.now().toString(),
          name: projectName,
          briefing: briefing,
          platform: platform || 'Instagram',
          copyType: copyType || 'Post Orgânico',
          tone: 'Profissional',
          generatedCopy: generatedCopy,
          versions: [{
            id: '1',
            copy: generatedCopy,
            timestamp: new Date()
          }],
          lastModified: new Date()
        };

        setProjects(prev => [newProject, ...prev]);
        setActiveProjectId(newProject.id);
        
        // Limpar o state para evitar recriação
        navigate(location.pathname, { replace: true });
        
        // Mensagem personalizada baseada no contexto
        let description = "Copy do botão flutuante foi carregada no Composer.";
        if (context?.page) {
          const pageName = context.page.replace('/', '').replace('-', ' ');
          description = `Copy contextual de ${pageName} foi carregada no Composer.`;
        }
        
        toast({
          title: "Projeto criado!",
          description: description,
        });
      }
    }
  }, [location.state, navigate, location.pathname, toast]);

  const [searchParams] = useSearchParams();

  // Load projects from localStorage on mount and handle template URL parameters
  useEffect(() => {
    const loadTemplate = async () => {
      const templateId = searchParams.get('template');
      const templateName = searchParams.get('name');
      const content = searchParams.get('content');
      const fromTemplate = searchParams.get('from');
      
      // Prioridade para conteúdo processado do template
      if (content && templateName && fromTemplate === 'template') {
        const processedProject: Project = {
          id: `processed_template_${Date.now()}`,
          name: `${decodeURIComponent(templateName)} - Personalizado`,
          briefing: decodeURIComponent(content),
          platform: '',
          copyType: '',
          tone: '',
          generatedCopy: '',
          versions: [],
          lastModified: new Date()
        };

        setProjects([processedProject]);
        setActiveProjectId(processedProject.id);
        
        toast({
          title: "✅ Template carregado no briefing!",
          description: `Template "${decodeURIComponent(templateName)}" está pronto para você configurar plataforma e gerar a copy.`,
        });
        return;
      }
      
      // Fallback para template original (compatibilidade)
      if (templateId) {
        try {
          // Buscar template específico
          const template = await templatesService.getById(templateId);
          if (template) {
            // Criar projeto baseado no template
            const templateProject: Project = {
              id: `template_project_${Date.now()}`,
              name: templateName ? decodeURIComponent(templateName) : template.name,
              briefing: template.description || 'Template importado',
              platform: (template.metadata && typeof template.metadata === 'object' && template.metadata !== null && 'platform' in template.metadata)
                ? String((template.metadata as Record<string, unknown>).platform) : '',
              copyType: template.type || '',
              tone: '',
              generatedCopy: template.content,
              versions: [{
                id: `template_version_${Date.now()}`,
                copy: template.content,
                timestamp: new Date()
              }],
              lastModified: new Date()
            };

            setProjects([templateProject]);
            setActiveProjectId(templateProject.id);
            
            toast({
              title: "Template carregado!",
              description: `Template "${template.name}" está pronto para usar no Composer.`,
            });
            return;
          }
        } catch (error) {
          console.error('Erro ao carregar template:', error);
          toast({
            title: "Erro ao carregar template",
            description: "Não foi possível carregar o template. Iniciando projeto vazio.",
            variant: "destructive"
          });
        }
      }
      
      // Carregar projetos normalmente se não houver template na URL
      const saved = localStorage.getItem('composer-projects');
      if (saved) {
        const parsedProjects = JSON.parse(saved);
        setProjects(parsedProjects);
        if (parsedProjects.length > 0) {
          setActiveProjectId(parsedProjects[0].id);
        }
      } else {
        // Create initial project
        createNewProject();
      }
    };
    
    loadTemplate();
  }, [searchParams, toast, createNewProject]);

  const createNewProject = () => {
    const newProject: Project = {
      id: `project_${Date.now()}`,
      name: `Projeto ${projects.length + 1}`,
      briefing: '',
      platform: '',
      copyType: '',
      tone: '',
      generatedCopy: '',
      versions: [],
      lastModified: new Date()
    };
    
    setProjects(prev => [...prev, newProject]);
    setActiveProjectId(newProject.id);
  };

  const updateActiveProject = (updates: Partial<Project>) => {
    setProjects(prev => prev.map(project => 
      project.id === activeProjectId 
        ? { ...project, ...updates, lastModified: new Date() }
        : project
    ));
  };

  const closeProject = (projectId: string) => {
    setProjects(prev => {
      const filtered = prev.filter(p => p.id !== projectId);
      if (projectId === activeProjectId && filtered.length > 0) {
        setActiveProjectId(filtered[0].id);
      } else if (filtered.length === 0) {
        createNewProject();
      }
      return filtered;
    });
  };

  const handleGenerate = async () => {
    if (!activeProject || !activeProject.briefing || !activeProject.platform || !activeProject.copyType) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o briefing, plataforma e tipo de copy.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      console.log('🤖 Iniciando geração de copy com IA...');
      
      // Usar o serviço real de geração de copy
      const response = await copyGenerationService.generateCopy({
        briefing: activeProject.briefing,
        platform: activeProject.platform,
        copyType: activeProject.copyType,
        tone: activeProject.tone,
        userId: user?.id
      });

      if (response.success && response.content) {
        const newVersion = {
          id: `version_${Date.now()}`,
          copy: response.content,
          timestamp: new Date()
        };

        updateActiveProject({
          generatedCopy: response.content,
          versions: [...(activeProject.versions || []), newVersion]
        });

        toast({
          title: "Copy gerada com sucesso!",
          description: `Gerada usando ${response.provider} (${response.model}). Tokens usados: ${response.tokensUsed}`,
        });
      } else {
        throw new Error(response.error || 'Falha na geração de copy');
      }
      
    } catch (error) {
      console.error('❌ Erro na geração de copy:', error);
      
      toast({
        title: "Erro na geração",
        description: error instanceof Error ? error.message : "Erro desconhecido. Tente novamente.",
        variant: "destructive"
      });
      
      // Fallback - ainda criar uma versão básica se a IA falhar completamente
      const fallbackText = `Copy para ${activeProject.platform} - ${activeProject.copyType}

${activeProject.briefing}

#marketing #${activeProject.platform.toLowerCase()}`;
      
      const newVersion = {
        id: `version_${Date.now()}`,
        copy: fallbackText,
        timestamp: new Date()
      };

      updateActiveProject({
        generatedCopy: fallbackText,
        versions: [...(activeProject.versions || []), newVersion]
      });
      
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateVariations = async () => {
    if (!activeProject?.generatedCopy) {
      toast({
        title: "Nenhuma copy encontrada",
        description: "Gere uma copy primeiro para criar variações.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      console.log('🔄 Gerando variações da copy...');
      
      const variations = await copyGenerationService.generateVariations(
        activeProject.generatedCopy, 
        3, 
        user?.id
      );

      if (variations.length > 0 && variations[0].success) {
        const newVersions = variations.map((variation, index) => ({
          id: `variation_${Date.now()}_${index}`,
          copy: variation.content,
          timestamp: new Date()
        }));

        updateActiveProject({
          versions: [...(activeProject.versions || []), ...newVersions]
        });

        toast({
          title: "Variações geradas!",
          description: `${variations.length} novas variações criadas.`,
        });
      } else {
        throw new Error('Falha na geração de variações');
      }
      
    } catch (error) {
      console.error('❌ Erro na geração de variações:', error);
      toast({
        title: "Erro na geração de variações",
        description: error instanceof Error ? error.message : "Erro desconhecido. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOptimizeCopy = async () => {
    if (!activeProject?.generatedCopy) {
      toast({
        title: "Nenhuma copy encontrada",
        description: "Gere uma copy primeiro para otimizar.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      console.log('⚡ Otimizando copy...');
      
      const response = await copyGenerationService.optimizeCopy(
        activeProject.generatedCopy,
        activeProject.platform,
        undefined,
        user?.id
      );

      if (response.success && response.content) {
        const newVersion = {
          id: `optimized_${Date.now()}`,
          copy: response.content,
          timestamp: new Date()
        };

        updateActiveProject({
          generatedCopy: response.content,
          versions: [...(activeProject.versions || []), newVersion]
        });

        toast({
          title: "Copy otimizada!",
          description: `Copy melhorada usando ${response.provider}.`,
        });
      } else {
        throw new Error(response.error || 'Falha na otimização');
      }
      
    } catch (error) {
      console.error('❌ Erro na otimização:', error);
      toast({
        title: "Erro na otimização",
        description: error instanceof Error ? error.message : "Erro desconhecido. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (activeProject?.generatedCopy) {
      navigator.clipboard.writeText(activeProject.generatedCopy);
      toast({
        title: "Copy copiada!",
        description: "O texto foi copiado para sua área de transferência.",
      });
    }
  };

  const exportProject = () => {
    if (!activeProject) return;
    
    const exportData = {
      projectName: activeProject.name,
      briefing: activeProject.briefing,
      platform: activeProject.platform,
      copyType: activeProject.copyType,
      tone: activeProject.tone,
      finalCopy: activeProject.generatedCopy,
      versions: activeProject.versions,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeProject.name.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Projeto exportado!",
      description: "Arquivo JSON baixado com sucesso.",
    });
  };

  const loadVersion = (versionId: string) => {
    if (!activeProject) return;
    
    const version = activeProject.versions.find(v => v.id === versionId);
    if (version) {
      updateActiveProject({ generatedCopy: version.copy });
      toast({
        title: "Versão carregada!",
        description: "Versão anterior restaurada.",
      });
    }
  };

  if (!activeProject) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Bot className="w-8 h-8 text-primary" />
            Composer IA
          </h1>
          <p className="text-muted-foreground">
            Crie copies otimizadas com inteligência artificial
          </p>
        </div>
        <Badge variant="secondary" className="w-fit">
          <Sparkles className="w-4 h-4 mr-1" />
          Powered by IA
        </Badge>
      </motion.div>

      {/* Project Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Projetos Ativos</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowVersionHistory(!showVersionHistory)}>
                  <History className="w-4 h-4 mr-2" />
                  Histórico
                </Button>
                <Button variant="outline" size="sm" onClick={createNewProject}>
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Projeto
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeProjectId} onValueChange={setActiveProjectId}>
              <div className="flex items-center gap-2 mb-4 overflow-x-auto">
                <TabsList className="flex-1 grid grid-cols-none grid-flow-col">
                  {projects.map((project) => (
                    <TabsTrigger 
                      key={project.id} 
                      value={project.id}
                      className="relative group flex-shrink-0 min-w-[140px]"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-3 h-3" />
                        <span className="max-w-[80px] truncate text-sm">{project.name}</span>
                        {projects.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              closeProject(project.id);
                            }}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {/* Version History Sidebar */}
      {showVersionHistory && activeProject.versions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Histórico de Versões
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeProject.versions.slice(-5).reverse().map((version, index) => (
                <div key={version.id} className="p-3 rounded-lg bg-muted/20 border border-border/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      Versão {activeProject.versions.length - index}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadVersion(version.id)}
                    >
                      <RefreshCw className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {version.timestamp.toLocaleString('pt-BR')}
                  </p>
                  <p className="text-xs mt-2 line-clamp-2">
                    {version.copy.substring(0, 100)}...
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}
      <div className={`grid gap-8 ${showVersionHistory ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1 lg:grid-cols-2'}`}>
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Configuração da Copy</CardTitle>
                  <CardDescription>
                    Configure os parâmetros para gerar sua copy perfeita
                  </CardDescription>
                </div>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Save className="w-3 h-3" />
                  Auto-save
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Briefing */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Briefing *
                </label>
                <Textarea
                  placeholder="Descreva o que você quer comunicar, o objetivo da campanha, público-alvo, produto/serviço..."
                  value={activeProject.briefing}
                  onChange={(e) => {
                    updateActiveProject({ briefing: e.target.value });
                    // Auto-resize
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = Math.min(target.scrollHeight, 400) + 'px';
                  }}
                  className="min-h-[120px] resize-none overflow-hidden leading-relaxed focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  style={{
                    height: activeProject.briefing ? 'auto' : '120px',
                    minHeight: '120px',
                    maxHeight: '400px'
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    const newHeight = Math.min(Math.max(target.scrollHeight, 120), 400);
                    target.style.height = newHeight + 'px';
                  }}
                />
              </div>

              {/* Platform Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Plataforma *
                </label>
                <Select value={activeProject.platform} onValueChange={(value) => updateActiveProject({ platform: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha a plataforma" />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map((p) => (
                      <SelectItem key={p.name} value={p.name}>
                        <div className="flex items-center gap-2">
                          <p.icon className={`w-4 h-4 ${p.color}`} />
                          {p.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Copy Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Tipo de Copy *
                </label>
                <Select value={activeProject.copyType} onValueChange={(value) => updateActiveProject({ copyType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de conteúdo" />
                  </SelectTrigger>
                  <SelectContent>
                    {copyTypes.map((type) => (
                      <SelectItem key={type.name} value={type.name}>
                        <div>
                          <div className="font-medium">{type.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {type.description}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tone */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Tom de Voz
                </label>
                <Select value={activeProject.tone} onValueChange={(value) => updateActiveProject({ tone: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tom da mensagem" />
                  </SelectTrigger>
                  <SelectContent>
                    {tones.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-gradient-primary"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Wand2 className="w-4 h-4 mr-2 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Gerar Copy
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Output Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Copy Gerada</CardTitle>
                  <CardDescription>
                    Resultado otimizado pela IA
                  </CardDescription>
                </div>
                {activeProject.generatedCopy && (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => updateActiveProject({ generatedCopy: '' })}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleCopy}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={exportProject}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {activeProject.generatedCopy ? (
                <div className="space-y-4">
                  <div className="bg-muted/30 rounded-lg p-4 min-h-[300px]">
                    <pre className="whitespace-pre-wrap text-sm font-medium leading-relaxed">
                      {activeProject.generatedCopy}
                    </pre>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button className="flex-1" onClick={exportProject}>
                      <Download className="w-4 h-4 mr-2" />
                      Exportar
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Target className="w-4 h-4 mr-2" />
                      Criar Campanha
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
                  <Bot className="w-16 h-16 text-muted-foreground/50 mb-4" />
                  <h3 className="font-medium text-muted-foreground">
                    Aguardando configuração
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Configure os parâmetros e clique em "Gerar Copy"
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">💡 Dicas para Copies Melhores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <p>• Seja específico no briefing sobre público-alvo</p>
                <p>• Inclua o objetivo principal da comunicação</p>
                <p>• Mencione características do produto/serviço</p>
                <p>• Defina o call-to-action desejado</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Composer;