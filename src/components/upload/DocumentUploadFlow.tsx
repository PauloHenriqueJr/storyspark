import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { documentProcessingService, type ProcessingProgress, type ExtractedData } from '@/services/documentProcessingService';
import { dataApplicationService } from '@/services/dataApplicationService';
import { cn } from '@/lib/utils';

interface DocumentUploadFlowProps {
  onProcessingComplete?: (data: ExtractedData) => void;
  onError?: (error: string) => void;
  className?: string;
}

interface UploadState {
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  currentStep: string;
  file?: File;
  error?: string;
  extractedData?: ExtractedData;
}

export const DocumentUploadFlow: React.FC<DocumentUploadFlowProps> = ({
  onProcessingComplete,
  onError,
  className
}) => {
  const [uploadState, setUploadState] = useState<UploadState>({
    status: 'idle',
    progress: 0,
    currentStep: 'Aguardando arquivo...'
  });

  const resetUpload = useCallback(() => {
    setUploadState({
      status: 'idle',
      progress: 0,
      currentStep: 'Aguardando arquivo...'
    });
  }, []);

  const handleProgressUpdate = useCallback((progress: ProcessingProgress) => {
    setUploadState(prev => ({
      ...prev,
      progress: progress.progress,
      currentStep: progress.step,
      status: 'processing'
    }));
  }, []);

  const processDocument = useCallback(async (file: File) => {
    try {
      // Verificar autenticação
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error(`Erro de sessão: ${sessionError.message}`);
      }
      
      if (!session?.user?.id) {
        throw new Error('Usuário não autenticado. Faça login para continuar.');
      }

      console.log('🔐 Usuário autenticado:', {
        userId: session.user.id,
        email: session.user.email,
        tokenPresent: !!session.access_token
      });

      setUploadState({
        status: 'processing',
        progress: 0,
        currentStep: 'Iniciando processamento...',
        file
      });

      // Processar documento usando o serviço
      const extractedData = await documentProcessingService.processDocument(
        file,
        session.user.id,
        handleProgressUpdate
      );

      setUploadState({
        status: 'processing',
        progress: 90,
        currentStep: 'Aplicando dados extraídos...',
        file,
        extractedData
      });

      // Aplicar dados extraídos
      const workspaceId = 'default'; // TODO: Obter workspace real do usuário
      const applicationResult = await dataApplicationService.applyExtractedData(
        session.user.id,
        workspaceId,
        extractedData
      );

      const finalStep = applicationResult.success
        ? `Dados aplicados com sucesso! Criados: ${applicationResult.created.brandVoices} brand voices, ${applicationResult.created.personas} personas, ${applicationResult.created.campaigns} campanhas`
        : `Dados extraídos, mas houve erros na aplicação: ${applicationResult.errors.join(', ')}`;

      setUploadState({
        status: 'completed',
        progress: 100,
        currentStep: finalStep,
        file,
        extractedData
      });

      onProcessingComplete?.(extractedData);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      console.error('❌ Erro no processamento:', error);
      
      setUploadState({
        status: 'error',
        progress: 0,
        currentStep: 'Erro no processamento',
        file,
        error: errorMessage
      });

      onError?.(errorMessage);
    }
  }, [handleProgressUpdate, onProcessingComplete, onError]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validar tipo de arquivo
    const allowedTypes = [
      'text/plain',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      setUploadState({
        status: 'error',
        progress: 0,
        currentStep: 'Tipo de arquivo não suportado',
        error: 'Apenas arquivos .txt, .pdf e .docx são suportados'
      });
      return;
    }

    // Validar tamanho (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadState({
        status: 'error',
        progress: 0,
        currentStep: 'Arquivo muito grande',
        error: 'O arquivo deve ter no máximo 10MB'
      });
      return;
    }

    await processDocument(file);
  }, [processDocument]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false,
    disabled: uploadState.status === 'processing'
  });

  const getStatusIcon = () => {
    switch (uploadState.status) {
      case 'processing':
        return <Loader2 className="h-6 w-6 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'error':
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Upload className="h-6 w-6 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (uploadState.status) {
      case 'processing':
        return 'border-blue-200 bg-blue-50';
      case 'completed':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 hover:border-gray-300';
    }
  };

  return (
    <Card className={cn('w-full max-w-2xl mx-auto', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Upload de Documento
        </CardTitle>
        <CardDescription>
          Faça upload de um documento (.txt, .pdf, .docx) para extrair informações de marca, personas e dados de marketing.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Área de Drop */}
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
            getStatusColor(),
            isDragActive && 'border-blue-400 bg-blue-100',
            uploadState.status === 'processing' && 'cursor-not-allowed'
          )}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center gap-4">
            {getStatusIcon()}
            
            <div>
              <p className="text-lg font-medium">
                {isDragActive
                  ? 'Solte o arquivo aqui...'
                  : uploadState.status === 'processing'
                  ? 'Processando documento...'
                  : uploadState.status === 'completed'
                  ? 'Processamento concluído!'
                  : uploadState.status === 'error'
                  ? 'Erro no processamento'
                  : 'Arraste um arquivo ou clique para selecionar'
                }
              </p>
              
              {uploadState.file && (
                <p className="text-sm text-gray-600 mt-1">
                  Arquivo: {uploadState.file.name}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Progresso */}
        {(uploadState.status === 'processing' || uploadState.status === 'completed') && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{uploadState.currentStep}</span>
              <span>{uploadState.progress}%</span>
            </div>
            <Progress value={uploadState.progress} className="w-full" />
          </div>
        )}

        {/* Erro */}
        {uploadState.status === 'error' && uploadState.error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{uploadState.error}</AlertDescription>
          </Alert>
        )}

        {/* Dados Extraídos */}
        {uploadState.status === 'completed' && uploadState.extractedData && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Documento processado com sucesso! Os dados foram extraídos e estão prontos para uso.
            </AlertDescription>
          </Alert>
        )}

        {/* Ações */}
        <div className="flex gap-2 justify-end">
          {uploadState.status === 'error' && (
            <Button onClick={resetUpload} variant="outline">
              Tentar Novamente
            </Button>
          )}
          
          {uploadState.status === 'completed' && (
            <Button onClick={resetUpload} variant="outline">
              Processar Outro Arquivo
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentUploadFlow;