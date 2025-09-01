import React from 'react';
import { Globe, Target } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PlatformSelectorProps {
  platform: string;
  setPlatform: (platform: string) => void;
  copyType: string;
  setCopyType: (type: string) => void;
}

const PlatformSelector: React.FC<PlatformSelectorProps> = ({ 
  platform, 
  setPlatform, 
  copyType, 
  setCopyType 
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <Globe className="w-3 h-3 text-purple-600 dark:text-purple-400" />
          </div>
          <label className="text-sm font-semibold text-gray-900 dark:text-white">Plataforma</label>
        </div>
        <Select value={platform} onValueChange={setPlatform}>
          <SelectTrigger className="border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500 dark:focus:border-purple-400 dark:focus:ring-purple-400 rounded-xl bg-white dark:bg-gray-800">
            <SelectValue placeholder="Escolha a plataforma" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
            <SelectItem value="Instagram">📱 Instagram</SelectItem>
            <SelectItem value="Facebook">📘 Facebook</SelectItem>
            <SelectItem value="LinkedIn">💼 LinkedIn</SelectItem>
            <SelectItem value="Email">📧 E-mail</SelectItem>
            <SelectItem value="WhatsApp">💬 WhatsApp</SelectItem>
            <SelectItem value="Web">🌐 Web</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
            <Target className="w-3 h-3 text-orange-600 dark:text-orange-400" />
          </div>
          <label className="text-sm font-semibold text-gray-900 dark:text-white">Tipo de Conteúdo</label>
        </div>
        <Select value={copyType} onValueChange={setCopyType}>
          <SelectTrigger className="border-gray-200 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500 dark:focus:border-orange-400 dark:focus:ring-orange-400 rounded-xl bg-white dark:bg-gray-800">
            <SelectValue placeholder="Tipo de conteúdo" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
            <SelectItem value="Post Orgânico">📝 Post Orgânico</SelectItem>
            <SelectItem value="Stories">📱 Stories</SelectItem>
            <SelectItem value="Anúncio">💰 Anúncio</SelectItem>
            <SelectItem value="Newsletter">📬 Newsletter</SelectItem>
            <SelectItem value="Carrossel">🔄 Carrossel</SelectItem>
            <SelectItem value="Landing Page">🌐 Landing Page</SelectItem>
            <SelectItem value="Script">📞 Script</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default PlatformSelector;