import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Search, 
  MoreHorizontal, 
  Play, 
  Trash2, 
  RefreshCw,
  Loader2,
  AlertCircle,
  Download,
  Eye
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { documentProcessingService } from '@/services/documentProcessingService';

interface ProcessingJob {
  id: string;
  user_id: string;
  file_path: string;
  file_name: string;
  file_type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  extracted_data?: any;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

const AdminJobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('overview');
  const [jobs, setJobs] = useState<ProcessingJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingJobId, setProcessingJobId] = useState<string | null>(null);
  const { toast } = useToast();

  // Carregar jobs do Supabase
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('ai_processing_jobs')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Erro ao carregar jobs:', error);
          toast({
            title: 'Erro',
            description: 'Não foi possível carregar os jobs de processamento.',
            variant: 'destructive'
          });
          return;
        }

        setJobs(data || []);
      } catch (error) {
        console.error('Erro inesperado:', error);
        toast({
          title: 'Erro',
          description: 'Erro inesperado ao carregar dados.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [toast]);

  // Filtrar jobs baseado no termo de busca
  const filteredJobs = jobs.filter(job =>
    job.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular estatísticas
  const totalJobs = jobs.length;
  const pendingJobs = jobs.filter(j => j.status === 'pending').length;
  const processingJobs = jobs.filter(j => j.status === 'processing').length;
  const completedJobs = jobs.filter(j => j.status === 'completed').length;
  const failedJobs = jobs.filter(j => j.status === 'failed').length;

  // Função para processar job manualmente
  const handleProcessJob = async (jobId: string) => {
    try {
      setProcessingJobId(jobId);
      
      // Atualizar status para processing
      const { error: updateError } = await supabase
        .from('ai_processing_jobs')
        .update({ 
          status: 'processing',
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId);

      if (updateError) {
        throw new Error(`Erro ao atualizar status: ${updateError.message}`);
      }

      // Simular processamento (aqui você integraria com o serviço real)
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Marcar como completado (dados mockados para demonstração)
      const mockExtractedData = {
        brandVoices: [{
          name: 'Profissional',
          tone: 'Formal e confiável',
          style: 'Técnico',
          description: 'Tom profissional para comunicação corporativa'
        }],
        personas: [{
          name: 'Executivo Tech',
          description: 'Profissional de tecnologia em posição de liderança',
          age_range: '30-45',
          occupation: 'CTO/Diretor de TI'
        }]
      };

      const { error: completeError } = await supabase
        .from('ai_processing_jobs')
        .update({ 
          status: 'completed',
          extracted_data: mockExtractedData,
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId);

      if (completeError) {
        throw new Error(`Erro ao completar job: ${completeError.message}`);
      }

      // Atualizar lista local
      setJobs(prevJobs => 
        prevJobs.map(job => 
          job.id === jobId 
            ? { ...job, status: 'completed' as const, extracted_data: mockExtractedData }
            : job
        )
      );

      toast({
        title: 'Sucesso',
        description: 'Job processado com sucesso!'
      });
    } catch (error) {
      console.error('Erro ao processar job:', error);
      
      // Marcar como falhou
      await supabase
        .from('ai_processing_jobs')
        .update({ 
          status: 'failed',
          error_message: error instanceof Error ? error.message : 'Erro desconhecido',
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId);

      toast({
        title: 'Erro',
        description: 'Falha ao processar o job.',
        variant: 'destructive'
      });
    } finally {
      setProcessingJobId(null);
    }
  };

  // Função para deletar job
  const handleDeleteJob = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('ai_processing_jobs')
        .delete()
        .eq('id', jobId);

      if (error) {
        throw new Error(`Erro ao deletar job: ${error.message}`);
      }

      setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
      
      toast({
        title: 'Sucesso',
        description: 'Job removido com sucesso!'
      });
    } catch (error) {
      console.error('Erro ao deletar job:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível remover o job.',
        variant: 'destructive'
      });
    }
  };

  // Função para atualizar lista
  const handleRefresh = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('ai_processing_jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: 'Erro',
          description: 'Não foi possível atualizar os dados.',
          variant: 'destructive'
        });
        return;
      }

      setJobs(data || []);
      toast({
        title: 'Dados atualizados',
        description: 'Lista de jobs atualizada com sucesso!'
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro inesperado ao atualizar dados.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Função para obter badge do status
  const getStatusBadge = (status: ProcessingJob['status']) => {
    const variants = {
      pending: { variant: 'secondary' as const, icon: Clock, text: 'Pendente' },
      processing: { variant: 'default' as const, icon: Loader2, text: 'Processando' },
      completed: { variant: 'default' as const, icon: CheckCircle, text: 'Concluído' },
      failed: { variant: 'destructive' as const, icon: XCircle, text: 'Falhou' }
    };

    const config = variants[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className={`w-3 h-3 ${status === 'processing' ? 'animate-spin' : ''}`} />
        {config.text}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin mr-2" />
        <span>Carregando jobs de processamento...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jobs de Processamento</h1>
          <p className="text-muted-foreground">
            Gerencie jobs de processamento de documentos com IA
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="jobs">Lista de Jobs</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Jobs</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalJobs}</div>
                <p className="text-xs text-muted-foreground">
                  Jobs de processamento
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{pendingJobs}</div>
                <p className="text-xs text-muted-foreground">
                  Aguardando processamento
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{completedJobs}</div>
                <p className="text-xs text-muted-foreground">
                  Processados com sucesso
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Falhas</CardTitle>
                <XCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{failedJobs}</div>
                <p className="text-xs text-muted-foreground">
                  Jobs com erro
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Jobs Recentes */}
          <Card>
            <CardHeader>
              <CardTitle>Jobs Recentes</CardTitle>
              <CardDescription>
                Últimos jobs de processamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobs.slice(0, 5).map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{job.file_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(job.created_at).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(job.status)}
                      {job.status === 'pending' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleProcessJob(job.id)}
                          disabled={processingJobId === job.id}
                        >
                          {processingJobId === job.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Jobs Tab */}
        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Lista de Jobs</CardTitle>
                  <CardDescription>
                    {filteredJobs.length} de {totalJobs} jobs
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Buscar por arquivo, usuário ou status..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-80"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Arquivo</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        {searchTerm ? 'Nenhum job encontrado com os filtros aplicados.' : 'Nenhum job encontrado.'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredJobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">{job.file_name}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {job.user_id.substring(0, 8)}...
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(job.status)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{job.file_type}</Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(job.created_at).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              {job.status === 'pending' && (
                                <DropdownMenuItem 
                                  onClick={() => handleProcessJob(job.id)}
                                  disabled={processingJobId === job.id}
                                >
                                  <Play className="w-4 h-4 mr-2" />
                                  Processar
                                </DropdownMenuItem>
                              )}
                              {job.status === 'completed' && (
                                <DropdownMenuItem>
                                  <Eye className="w-4 h-4 mr-2" />
                                  Ver Dados
                                </DropdownMenuItem>
                              )}
                              {job.status === 'failed' && job.error_message && (
                                <DropdownMenuItem>
                                  <AlertCircle className="w-4 h-4 mr-2" />
                                  Ver Erro
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDeleteJob(job.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Remover
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pendentes</span>
                    <span className="text-sm font-medium">{pendingJobs} ({totalJobs > 0 ? Math.round((pendingJobs / totalJobs) * 100) : 0}%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Processando</span>
                    <span className="text-sm font-medium">{processingJobs} ({totalJobs > 0 ? Math.round((processingJobs / totalJobs) * 100) : 0}%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Concluídos</span>
                    <span className="text-sm font-medium">{completedJobs} ({totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0}%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Falhas</span>
                    <span className="text-sm font-medium">{failedJobs} ({totalJobs > 0 ? Math.round((failedJobs / totalJobs) * 100) : 0}%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tipos de Arquivo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(
                    jobs.reduce((acc, job) => {
                      acc[job.file_type] = (acc[job.file_type] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-sm">{type}</span>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminJobs;