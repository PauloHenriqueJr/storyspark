import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, FileText, Users, Mic, Lightbulb } from 'lucide-react';

interface DocumentUploadProps {
    onDataExtracted: (data: any) => void;
    context: any;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
    onDataExtracted,
    context
}) => {
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(Array.from(e.dataTransfer.files));
        }
    }, []);

    const handleFiles = (files: File[]) => {
        const validFiles = files.filter(file =>
            file.type === 'application/pdf' ||
            file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            file.type === 'text/plain'
        );

        setUploadedFiles(prev => [...prev, ...validFiles]);
    };

    const processFiles = async () => {
        setUploading(true);
        try {
            // Simulação de processamento - aqui integraria com serviço de IA
            await new Promise(resolve => setTimeout(resolve, 3000));

            const extractedData = {
                personas: ['Persona Executiva', 'Persona Técnica'],
                brandVoices: ['Tom Profissional', 'Tom Inovador'],
                insights: ['Foco em ROI', 'Linguagem técnica']
            };

            onDataExtracted(extractedData);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Área de Upload */}
            <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragActive
                        ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Upload de Documentos da Empresa
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Arraste arquivos aqui ou clique para selecionar
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                    Suporte: PDF, DOCX, TXT (até 10MB)
                </p>

                <input
                    type="file"
                    multiple
                    accept=".pdf,.docx,.txt"
                    onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
                    className="hidden"
                    id="file-upload"
                />
                <label htmlFor="file-upload">
                    <Button variant="outline" className="mt-4" asChild>
                        <span className="cursor-pointer">Selecionar Arquivos</span>
                    </Button>
                </label>
            </div>

            {/* Arquivos Carregados */}
            {uploadedFiles.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Arquivos Carregados ({uploadedFiles.length})
                    </h4>
                    <div className="space-y-2">
                        {uploadedFiles.map((file, index) => (
                            <Card key={index} className="p-3">
                                <CardContent className="flex items-center gap-3 p-0">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* O que será extraído */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    A IA extrairá automaticamente:
                </h4>
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-600" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Personas</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Mic className="w-4 h-4 text-orange-600" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Brand Voice</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Insights</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Templates</span>
                    </div>
                </div>
            </div>

            {/* Botão de Processamento */}
            {uploadedFiles.length > 0 && (
                <Button
                    onClick={processFiles}
                    disabled={uploading}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    size="lg"
                >
                    {uploading ? (
                        <>
                            <Upload className="w-4 h-4 mr-2 animate-pulse" />
                            Processando com IA...
                        </>
                    ) : (
                        <>
                            <Upload className="w-4 h-4 mr-2" />
                            Processar Documentos com IA
                        </>
                    )}
                </Button>
            )}
        </div>
    );
};
