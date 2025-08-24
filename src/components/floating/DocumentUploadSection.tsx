import React, { useState } from 'react';
import { Upload, Brain, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DocumentUploadModal from '@/components/upload/DocumentUploadModal';

interface DocumentUploadSectionProps {
  showUploadModal: boolean;
  setShowUploadModal: (show: boolean) => void;
  onDataExtracted: (data: Record<string, unknown>) => void;
}

const DocumentUploadSection: React.FC<DocumentUploadSectionProps> = ({ 
  showUploadModal, 
  setShowUploadModal,
  onDataExtracted
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [extractedData, setExtractedData] = useState<Record<string, unknown> | null>(null);
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
          <Upload className="w-3 h-3 text-blue-600 dark:text-blue-400" />
        </div>
        <label className="text-sm font-semibold text-gray-900 dark:text-white">
          Upload de Documentos
        </label>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-600 text-xs">
          Novo
        </Badge>
      </div>
      
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-600 rounded-xl p-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
            <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              IA Analisa seus Documentos
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
              Faça upload de PDFs, DOCX ou TXT com informações da sua empresa. 
              A IA extrairá automaticamente brand voice, personas, dados de marketing e muito mais!
            </p>
            <Button 
              onClick={() => setShowUploadModal(true)}
              disabled={isAnalyzing}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analisando...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload com IA
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Document Upload Modal */}
      <DocumentUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onDataExtracted={(data) => {
          setIsAnalyzing(true);
          try {
            // Simulação de processamento dos dados extraídos
            setExtractedData(data);
            onDataExtracted(data);
          } finally {
            setIsAnalyzing(false);
          }
        }}
        isAnalyzing={isAnalyzing}
      />
    </div>
  );
};

export default DocumentUploadSection;