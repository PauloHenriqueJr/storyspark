import React, { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/lib/supabase';
import { testBucket } from '@/utils/testBucket';

const TestUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const { user } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleTestBucket = async () => {
    await testBucket();
  };

  const handleUpload = async () => {
    if (!file || !user) {
      setMessage('Por favor, selecione um arquivo e faça login.');
      return;
    }

    setUploading(true);
    setMessage('');

    try {
      // Testar o bucket primeiro
      await testBucket();

      // Fazer upload do arquivo
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `document-uploads/${user.id}/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('document-uploads')
        .upload(filePath, file);

      if (error) {
        setMessage(`Erro no upload: ${error.message}`);
        console.error('Erro no upload:', error);
      } else {
        setMessage(`Upload bem-sucedido! Path: ${data.path}`);
        console.log('Upload bem-sucedido:', data);
      }
    } catch (error) {
      setMessage(`Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      console.error('Erro:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Teste de Upload</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Selecione um arquivo
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            accept=".pdf,.txt,.docx"
          />
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleTestBucket}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Testar Bucket
          </button>
          
          <button
            onClick={handleUpload}
            disabled={uploading || !file}
            className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              uploading || !file
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {uploading ? 'Enviando...' : 'Enviar Arquivo'}
          </button>
        </div>

        {message && (
          <div className="mt-4 p-3 rounded-md bg-gray-50 border border-gray-200">
            <p className="text-sm text-gray-700">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestUpload;