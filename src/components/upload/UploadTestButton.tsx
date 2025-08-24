import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { testUpload } from '@/utils/testUpload';
import { useAuth } from '@/components/auth/AuthProvider';

const UploadTestButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const { user } = useAuth();

  const handleTestUpload = async () => {
    if (!user) {
      setResult({ success: false, message: 'Usuário não autenticado.' });
      return;
    }

    setLoading(true);
    setResult(null);
    
    try {
      const response = await testUpload(user.id);
      
      if (response.success) {
        setResult({ success: true, message: 'Upload realizado com sucesso!' });
      } else {
        setResult({ success: false, message: `Erro no upload: ${response.error}` });
      }
    } catch (error) {
      setResult({ success: false, message: `Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
      <h3 className="text-lg font-semibold mb-2">Teste de Upload</h3>
      <Button 
        onClick={handleTestUpload} 
        disabled={loading || !user}
        className="w-full"
      >
        {loading ? 'Enviando...' : 'Testar Upload'}
      </Button>
      
      {result && (
        <div className={`mt-3 p-3 rounded ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <p className="text-sm">{result.message}</p>
        </div>
      )}
    </div>
  );
};

export default UploadTestButton;