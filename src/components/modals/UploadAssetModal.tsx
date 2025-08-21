import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, File, Image, Video, FileText, X, Plus, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UploadAssetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FileUpload {
  id: string;
  file: File;
  name: string;
  category: string;
  tags: string[];
  description: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  preview?: string;
}

const UploadAssetModal = ({ open, onOpenChange }: UploadAssetModalProps) => {
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [newTag, setNewTag] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const categories = [
    { value: 'marketing', label: 'Marketing' },
    { value: 'social', label: 'Social Media' },
    { value: 'email', label: 'Email Marketing' },
    { value: 'website', label: 'Website' },
    { value: 'lead-magnet', label: 'Lead Magnet' },
    { value: 'apresentacao', label: 'Apresentação' },
    { value: 'branding', label: 'Branding' },
    { value: 'outros', label: 'Outros' }
  ];

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="h-6 w-6" />;
    if (file.type.startsWith('video/')) return <Video className="h-6 w-6" />;
    return <FileText className="h-6 w-6" />;
  };

  const getFileType = (file: File) => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    return 'document';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const createFilePreview = (file: File): string | undefined => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return undefined;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
    }
  };

  const addFiles = (newFiles: File[]) => {
    const fileUploads: FileUpload[] = newFiles.map(file => ({
      id: Date.now() + Math.random().toString(),
      file,
      name: file.name.split('.')[0],
      category: '',
      tags: [],
      description: '',
      progress: 0,
      status: 'pending',
      preview: createFilePreview(file)
    }));
    
    setFiles(prev => [...prev, ...fileUploads]);
  };

  const removeFile = (id: string) => {
    setFiles(files.filter(f => f.id !== id));
  };

  const updateFile = (id: string, updates: Partial<FileUpload>) => {
    setFiles(files.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const addTag = (fileId: string, tag: string) => {
    if (tag.trim()) {
      updateFile(fileId, {
        tags: [...files.find(f => f.id === fileId)?.tags || [], tag.trim()]
      });
    }
  };

  const removeTag = (fileId: string, tagToRemove: string) => {
    const file = files.find(f => f.id === fileId);
    if (file) {
      updateFile(fileId, {
        tags: file.tags.filter(tag => tag !== tagToRemove)
      });
    }
  };

  const simulateUpload = (fileId: string) => {
    updateFile(fileId, { status: 'uploading', progress: 0 });
    
    const interval = setInterval(() => {
      setFiles(currentFiles => {
        const file = currentFiles.find(f => f.id === fileId);
        if (!file || file.status !== 'uploading') {
          clearInterval(interval);
          return currentFiles;
        }
        
        const newProgress = Math.min(file.progress + Math.random() * 30, 100);
        
        if (newProgress >= 100) {
          clearInterval(interval);
          return currentFiles.map(f => 
            f.id === fileId 
              ? { ...f, progress: 100, status: 'completed' }
              : f
          );
        }
        
        return currentFiles.map(f => 
          f.id === fileId 
            ? { ...f, progress: newProgress }
            : f
        );
      });
    }, 200);
  };

  const handleUploadAll = () => {
    const pendingFiles = files.filter(f => f.status === 'pending');
    
    if (pendingFiles.some(f => !f.category)) {
      toast({
        title: "Categoria obrigatória",
        description: "Todos os arquivos devem ter uma categoria selecionada.",
        variant: "destructive"
      });
      return;
    }
    
    pendingFiles.forEach(file => {
      simulateUpload(file.id);
    });
    
    setTimeout(() => {
      toast({
        title: "Upload concluído!",
        description: `${pendingFiles.length} arquivo(s) foram enviados com sucesso.`,
      });
    }, 3000);
  };

  const completedFiles = files.filter(f => f.status === 'completed').length;
  const totalFiles = files.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Upload de Assets
          </DialogTitle>
          <DialogDescription>
            Faça upload de imagens, vídeos, documentos e templates para sua biblioteca
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Arraste arquivos aqui ou clique para selecionar
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Suporta imagens, vídeos, PDFs e documentos (até 50MB cada)
            </p>
            <Button variant="outline">
              Selecionar Arquivos
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx"
              onChange={handleFileSelect}
            />
          </div>

          {/* Files List */}
          {files.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  Arquivos Selecionados ({files.length})
                </h3>
                {completedFiles < totalFiles && (
                  <Button onClick={handleUploadAll}>
                    Upload de Todos ({totalFiles - completedFiles} restantes)
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                {files.map((fileUpload) => (
                  <Card key={fileUpload.id}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* File Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            {fileUpload.preview ? (
                              <img 
                                src={fileUpload.preview} 
                                alt="Preview" 
                                className="w-12 h-12 object-cover rounded"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                                {getFileIcon(fileUpload.file)}
                              </div>
                            )}
                            <div>
                              <h4 className="font-medium">{fileUpload.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {formatFileSize(fileUpload.file.size)} • {fileUpload.file.type}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {fileUpload.status === 'completed' && (
                              <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">
                                <Check className="h-3 w-3 mr-1" />
                                Completo
                              </Badge>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(fileUpload.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        {fileUpload.status === 'uploading' && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Enviando...</span>
                              <span>{Math.round(fileUpload.progress)}%</span>
                            </div>
                            <Progress value={fileUpload.progress} />
                          </div>
                        )}

                        {/* File Details */}
                        <div className="grid gap-3 md:grid-cols-2">
                          <div>
                            <Label>Nome do Arquivo</Label>
                            <Input
                              value={fileUpload.name}
                              onChange={(e) => updateFile(fileUpload.id, { name: e.target.value })}
                              placeholder="Nome do arquivo..."
                            />
                          </div>
                          <div>
                            <Label>Categoria *</Label>
                            <Select 
                              value={fileUpload.category} 
                              onValueChange={(value) => updateFile(fileUpload.id, { category: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione a categoria" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category.value} value={category.value}>
                                    {category.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="md:col-span-2">
                            <Label>Descrição</Label>
                            <Textarea
                              value={fileUpload.description}
                              onChange={(e) => updateFile(fileUpload.id, { description: e.target.value })}
                              placeholder="Descrição do arquivo..."
                              rows={2}
                            />
                          </div>
                        </div>

                        {/* Tags */}
                        <div>
                          <Label>Tags</Label>
                          <div className="flex gap-2 mb-2">
                            <Input
                              placeholder="Adicionar tag"
                              value={newTag}
                              onChange={(e) => setNewTag(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  addTag(fileUpload.id, newTag);
                                  setNewTag('');
                                }
                              }}
                            />
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm" 
                              onClick={() => {
                                addTag(fileUpload.id, newTag);
                                setNewTag('');
                              }}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {fileUpload.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                                <X 
                                  className="h-3 w-3 ml-1 cursor-pointer" 
                                  onClick={() => removeTag(fileUpload.id, tag)}
                                />
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {completedFiles === totalFiles && totalFiles > 0 ? 'Fechar' : 'Cancelar'}
          </Button>
          {files.length > 0 && completedFiles === totalFiles && (
            <Button>
              Ir para Biblioteca
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadAssetModal;