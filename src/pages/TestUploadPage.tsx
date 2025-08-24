import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DocumentUploadFlow } from '@/components/upload/DocumentUploadFlow';
import { supabase } from '@/lib/supabase';
import { User, FileText, Users, Building, Target, CheckCircle, AlertCircle } from 'lucide-react';
import type { ExtractedData } from '@/services/documentProcessingService';

interface AuthStatus {
  isAuthenticated: boolean;
  user?: {
    id: string;
    email?: string;
  };
  error?: string;
}

export const TestUploadPage: React.FC = () => {
  const [authStatus, setAuthStatus] = useState<AuthStatus>({ isAuthenticated: false });
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);

  const checkAuthentication = async () => {
    setIsCheckingAuth(true);
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        setAuthStatus({ 
          isAuthenticated: false, 
          error: `Erro de sessão: ${error.message}` 
        });
        return;
      }

      if (session?.user) {
        setAuthStatus({
          isAuthenticated: true,
          user: {
            id: session.user.id,
            email: session.user.email
          }
        });
      } else {
        setAuthStatus({ 
          isAuthenticated: false, 
          error: 'Nenhuma sessão ativa encontrada' 
        });
      }
    } catch (error) {
      setAuthStatus({ 
        isAuthenticated: false, 
        error: `Erro ao verificar autenticação: ${error instanceof Error ? error.message : 'Erro desconhecido'}` 
      });
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const handleProcessingComplete = (data: ExtractedData) => {
    setExtractedData(data);
    setUploadError(null);
    console.log('✅ Dados extraídos:', data);
  };

  const handleUploadError = (error: string) => {
    setUploadError(error);
    setExtractedData(null);
    console.error('❌ Erro no upload:', error);
  };

  const renderExtractedData = () => {
    if (!extractedData) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <h3 className="text-lg font-semibold">Dados Extraídos com Sucesso</h3>
        </div>

        {/* Brand Voice */}
        {extractedData.brandVoice && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Voz da Marca
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="font-medium">Tom:</span> {extractedData.brandVoice.tone}
              </div>
              <div>
                <span className="font-medium">Público-alvo:</span> {extractedData.brandVoice.targetAudience}
              </div>
              <div>
                <span className="font-medium">Características:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {extractedData.brandVoice.characteristics?.map((char, index) => (
                    <Badge key={index} variant="secondary">{char}</Badge>
                  ))}
                </div>
              </div>
              {extractedData.brandVoice.examples && extractedData.brandVoice.examples.length > 0 && (
                <div>
                  <span className="font-medium">Exemplos:</span>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    {extractedData.brandVoice.examples.map((example, index) => (
                      <li key={index} className="text-sm">{example}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Personas */}
        {extractedData.personas && extractedData.personas.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Personas ({extractedData.personas.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {extractedData.personas.map((persona, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-semibold">{persona.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {persona.age} anos • {persona.profession}
                    </p>
                    <p className="text-sm mt-2">{persona.description}</p>
                    
                    {persona.interests && persona.interests.length > 0 && (
                      <div className="mt-2">
                        <span className="text-xs font-medium">Interesses:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {persona.interests.map((interest, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{interest}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Company Info */}
        {extractedData.companyInfo && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Informações da Empresa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="font-medium">Nome:</span> {extractedData.companyInfo.name}
              </div>
              <div>
                <span className="font-medium">Setor:</span> {extractedData.companyInfo.industry}
              </div>
              <div>
                <span className="font-medium">Descrição:</span> {extractedData.companyInfo.description}
              </div>
              {extractedData.companyInfo.mission && (
                <div>
                  <span className="font-medium">Missão:</span> {extractedData.companyInfo.mission}
                </div>
              )}
              {extractedData.companyInfo.values && extractedData.companyInfo.values.length > 0 && (
                <div>
                  <span className="font-medium">Valores:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {extractedData.companyInfo.values.map((value, index) => (
                      <Badge key={index} variant="secondary">{value}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Marketing Data */}
        {extractedData.marketingData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Dados de Marketing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {extractedData.marketingData.targetAudience && extractedData.marketingData.targetAudience.length > 0 && (
                <div>
                  <span className="font-medium">Público-alvo:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {extractedData.marketingData.targetAudience.map((audience, index) => (
                      <Badge key={index} variant="outline">{audience}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {extractedData.marketingData.channels && extractedData.marketingData.channels.length > 0 && (
                <div>
                  <span className="font-medium">Canais:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {extractedData.marketingData.channels.map((channel, index) => (
                      <Badge key={index} variant="secondary">{channel}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Teste de Upload de Documentos</h1>
          <p className="text-gray-600">
            Teste o fluxo completo de upload e processamento de documentos com autenticação adequada.
          </p>
        </div>

        {/* Status de Autenticação */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Status de Autenticação
            </CardTitle>
            <CardDescription>
              Verifique se você está autenticado antes de fazer upload de documentos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Button 
                onClick={checkAuthentication} 
                disabled={isCheckingAuth}
                variant="outline"
              >
                {isCheckingAuth ? 'Verificando...' : 'Verificar Autenticação'}
              </Button>
              
              {authStatus.isAuthenticated ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Autenticado</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span>Não autenticado</span>
                </div>
              )}
            </div>

            {authStatus.user && (
              <div className="text-sm text-gray-600">
                <p><strong>ID:</strong> {authStatus.user.id}</p>
                {authStatus.user.email && (
                  <p><strong>Email:</strong> {authStatus.user.email}</p>
                )}
              </div>
            )}

            {authStatus.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{authStatus.error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Separator />

        {/* Upload Flow */}
        <DocumentUploadFlow
          onProcessingComplete={handleProcessingComplete}
          onError={handleUploadError}
        />

        {/* Erro de Upload */}
        {uploadError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{uploadError}</AlertDescription>
          </Alert>
        )}

        {/* Dados Extraídos */}
        {renderExtractedData()}
      </div>
    </div>
  );
};

export default TestUploadPage;