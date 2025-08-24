import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  X, 
  Loader2, 
  Brain,
  Users,
  Mic,
  Target,
  Globe,
  MessageSquare,
  Calendar,
  BarChart3,
  Settings,
  Zap,
  File,
  Trash2,
  Eye,
  Download
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useToast } from '@/hooks/use-toast';
import { documentProcessingService, type ExtractedData, type ProcessingProgress } from '@/services/documentProcessingService';
import { dataApplicationService } from '@/services/dataApplicationService';
import { useAuth } from '@/components/auth/AuthProvider';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataExtracted: (data: ExtractedData) => void;
}



const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onDataExtracted
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const { toast } = useToast();
  const { user } = useAuth();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => {
      const isValidType = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type);
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      
      if (!isValidType) {
        toast({
          title: "Tipo de arquivo não suportado",
          description: `${file.name} não é um tipo de arquivo suportado. Use PDF, TXT ou DOCX.`,
          variant: "destructive"
        });
      }
      
      if (!isValidSize) {
        toast({
          title: "Arquivo muito grande",
          description: `${file.name} excede o limite de 10MB.`,
          variant: "destructive"
        });
      }
      
      return isValidType && isValidSize;
    });
    
    setUploadedFiles(prev => [...prev, ...validFiles]);
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const analyzeDocuments = async () => {
    if (uploadedFiles.length === 0) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Faça upload de pelo menos um documento para análise.",
        variant: "destructive"
      });
      return;
    }

    if (!user?.id) {
      toast({
        title: "Usuário não autenticado",
        description: "Faça login para processar documentos.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setAnalysisStep('Iniciando análise...');

    try {
      // Processar cada arquivo com IA real
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];
        
        const extractedData = await documentProcessingService.processDocument(
          file,
          user.id,
          (progress: ProcessingProgress) => {
            setAnalysisStep(progress.step);
            setAnalysisProgress(progress.progress);
          }
        );

        // Se for o primeiro arquivo, usar seus dados
        // Se não, mesclar com dados existentes
        if (i === 0) {
          setExtractedData(extractedData);
        } else {
          setExtractedData(prev => mergeExtractedData(prev, extractedData));
        }
      }
      
      toast({
        title: "Análise concluída!",
        description: "Documentos analisados com sucesso com IA real. Revise os dados extraídos.",
        variant: "default"
      });

    } catch (error) {
      console.error('Erro no processamento:', error);
      toast({
        title: "Erro na análise",
        description: error instanceof Error ? error.message : "Ocorreu um erro durante a análise dos documentos. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Função para mesclar dados extraídos de múltiplos arquivos
  const mergeExtractedData = (existing: ExtractedData | null, newData: ExtractedData): ExtractedData => {
    if (!existing) return newData;

    return {
      brandVoice: newData.brandVoice || existing.brandVoice,
      personas: [...(existing.personas || []), ...(newData.personas || [])],
      companyInfo: newData.companyInfo || existing.companyInfo,
      marketingData: {
        targetAudience: [...new Set([...(existing.marketingData?.targetAudience || []), ...(newData.marketingData?.targetAudience || [])])],
        channels: [...new Set([...(existing.marketingData?.channels || []), ...(newData.marketingData?.channels || [])])],
        campaigns: [...new Set([...(existing.marketingData?.campaigns || []), ...(newData.marketingData?.campaigns || [])])],
        goals: [...new Set([...(existing.marketingData?.goals || []), ...(newData.marketingData?.goals || [])])]
      }
    };
  };

  const applyExtractedData = async () => {
    if (!extractedData || !user?.id) {
      toast({
        title: "Erro",
        description: "Dados não disponíveis ou usuário não autenticado.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Validar dados antes de aplicar
      const validation = dataApplicationService.validateDataForApplication(extractedData);
      
      if (!validation.isValid) {
        toast({
          title: "Avisos sobre os dados",
          description: validation.warnings.join(', '),
          variant: "destructive"
        });
        return;
      }

      // Aplicar dados na plataforma
      const result = await dataApplicationService.applyExtractedData(
        user.id,
        user.id, // Usando user.id como workspace_id por enquanto
        extractedData
      );

      if (result.success) {
        const createdItems = [
          result.created.brandVoices > 0 ? `${result.created.brandVoices} brand voice(s)` : null,
          result.created.personas > 0 ? `${result.created.personas} persona(s)` : null,
          result.created.campaigns > 0 ? `${result.created.campaigns} campanha(s)` : null
        ].filter(Boolean).join(', ');

        toast({
          title: "Dados aplicados com sucesso!",
          description: `Criados: ${createdItems}. ${result.errors.length > 0 ? `Alguns erros: ${result.errors.join(', ')}` : ''}`,
          variant: "default"
        });

        // Chamar callback original
        onDataExtracted(extractedData);
        onClose();
      } else {
        toast({
          title: "Erro ao aplicar dados",
          description: result.errors.join(', '),
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro ao aplicar dados:', error);
      toast({
        title: "Erro ao aplicar dados",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      });
    }
  };

  const resetModal = () => {
    setUploadedFiles([]);
    setExtractedData(null);
    setAnalysisProgress(0);
    setAnalysisStep('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetModal}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                Upload de Documentos com IA
              </DialogTitle>
              <DialogDescription className="text-base text-gray-600 dark:text-gray-400 mt-1">
                Faça upload de seus documentos e deixe a IA extrair automaticamente suas informações
              </DialogDescription>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700">
              <Zap className="w-3 h-3 mr-1" />
              IA Inteligente
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Upload Area */}
          {!isAnalyzing && !extractedData && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Upload className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                </div>
                <label className="text-sm font-semibold text-gray-900 dark:text-white">
                  Upload de Documentos
                </label>
              </div>

              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
                  isDragActive
                    ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {isDragActive ? 'Solte os arquivos aqui' : 'Arraste arquivos ou clique para selecionar'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Suporta PDF, TXT e DOCX (máx. 10MB cada)
                </p>
                <Button variant="outline" className="bg-white dark:bg-gray-800">
                  <File className="w-4 h-4 mr-2" />
                  Selecionar Arquivos
                </Button>
              </div>

              {/* Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Arquivos selecionados ({uploadedFiles.length})
                    </span>
                    <Button
                      onClick={() => setUploadedFiles([])}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 dark:text-red-400"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Limpar todos
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={() => removeFile(index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 dark:text-red-400"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={analyzeDocuments}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    size="lg"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Analisar Documentos com IA
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Analysis Progress */}
          {isAnalyzing && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Loader2 className="w-3 h-3 text-purple-600 dark:text-purple-400 animate-spin" />
                </div>
                <label className="text-sm font-semibold text-gray-900 dark:text-white">
                  Análise em Andamento
                </label>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-600 rounded-xl p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {analysisStep}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {Math.round(analysisProgress)}%
                    </span>
                  </div>
                  
                  <Progress value={analysisProgress} className="h-2" />
                  
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <Brain className="w-3 h-3" />
                    <span>IA analisando documentos e extraindo informações...</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Extracted Data Preview */}
          {extractedData && !isAnalyzing && (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
                </div>
                <label className="text-sm font-semibold text-gray-900 dark:text-white">
                  Dados Extraídos
                </label>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Brand Voice */}
                {extractedData.brandVoice && (
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border border-teal-200 dark:border-teal-600 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Mic className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                      <h3 className="font-semibold text-teal-900 dark:text-teal-100">Brand Voice</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p><strong>Nome:</strong> {extractedData.brandVoice.name}</p>
                      <p><strong>Tom:</strong> {extractedData.brandVoice.tone}</p>
                      <p><strong>Descrição:</strong> {extractedData.brandVoice.description}</p>
                      <p><strong>Público-alvo:</strong> {extractedData.brandVoice.targetAudience}</p>
                    </div>
                  </div>
                )}

                {/* Company Info */}
                {extractedData.companyInfo && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-600 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100">Empresa</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p><strong>Nome:</strong> {extractedData.companyInfo.name}</p>
                      <p><strong>Setor:</strong> {extractedData.companyInfo.industry}</p>
                      <p><strong>Missão:</strong> {extractedData.companyInfo.mission}</p>
                      <p><strong>Visão:</strong> {extractedData.companyInfo.vision}</p>
                    </div>
                  </div>
                )}

                {/* Personas */}
                {extractedData.personas && extractedData.personas.length > 0 && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-600 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      <h3 className="font-semibold text-purple-900 dark:text-purple-100">Personas ({extractedData.personas.length})</h3>
                    </div>
                    <div className="space-y-3">
                      {extractedData.personas.map((persona, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                          <p className="font-medium text-sm">{persona.name}, {persona.age} anos</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{persona.profession}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Marketing Data */}
                {extractedData.marketingData && (
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-600 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      <h3 className="font-semibold text-orange-900 dark:text-orange-100">Marketing</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p><strong>Canais:</strong> {extractedData.marketingData.channels.join(', ')}</p>
                      <p><strong>Objetivos:</strong> {extractedData.marketingData.goals.join(', ')}</p>
                    </div>
                  </div>
                )}
              </div>

              <Separator className="bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-600 to-transparent" />

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={applyExtractedData}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                  size="lg"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Aplicar Dados na Plataforma
                </Button>
                <Button
                  onClick={() => setExtractedData(null)}
                  variant="outline"
                  className="border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                  size="lg"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Analisar Novamente
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploadModal;