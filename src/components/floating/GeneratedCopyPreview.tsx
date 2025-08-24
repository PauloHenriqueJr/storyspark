import React from 'react';
import { motion } from 'framer-motion';
import { 
  Wand2, 
  Instagram, 
  Facebook, 
  Linkedin, 
  Mail, 
  MessageSquare, 
  Globe,
  Copy as CopyIcon,
  Edit3,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CalendarEvent {
  id: string;
  title: string;
  platform: string;
  time: string;
  date: Date;
  event_date: string;
  status: 'Agendado' | 'Publicado' | 'Rascunho';
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface BrandVoice {
  id: string;
  workspace_id: string;
  user_id: string;
  name: string;
  description: string;
  tone: string;
  style: string;
  examples: string[];
  guidelines: string;
  usage_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  personality_traits?: string[];
  audience?: string;
  platform?: string;
  context?: string;
  writing_style?: string;
  avoid?: string;
  good_example?: string;
  bad_example?: string;
  keywords?: string[];
}

interface Persona {
  id: string;
  workspace_id: string;
  user_id: string;
  name: string;
  age_range?: string;
  location?: string;
  occupation?: string;
  goals?: string[];
  pain_points?: string[];
  interests?: string[];
  preferred_channels?: string[];
  usage_count: number;
  created_at: string;
  updated_at?: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  type: string;
  content: string;
  blocks: any[];
  usage_count: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
  workspace_id: string;
  version: number;
  tags?: string[];
  thumbnail_url?: string;
  performance_score?: number;
}

interface Campaign {
  id: string;
  name: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string;
  budget: number;
  spent: number;
  roi: number;
  created_at: string;
  updated_at: string;
  user_id: string;
  workspace_id: string;
  target_personas?: string[];
  brand_voice_id?: string;
  template_id?: string;
}

interface GeneratedCopyPreviewProps {
  generatedCopy: string;
  platform: string;
  copyType: string;
  onCopyToClipboard: () => void;
  onUseGeneratedCopy: () => void;
  onReset: () => void;
  selectedEvent: CalendarEvent | null;
  selectedItem: BrandVoice | Persona | Template | Campaign | null;
  locationPathname: string;
  isCopyingToClipboard?: boolean;
  isApplyingToItem?: boolean;
}

const GeneratedCopyPreview: React.FC<GeneratedCopyPreviewProps> = ({ 
  generatedCopy, 
  platform, 
  copyType, 
  onCopyToClipboard, 
  onUseGeneratedCopy, 
  onReset,
  selectedEvent, 
  selectedItem,
  locationPathname,
  isCopyingToClipboard = false,
  isApplyingToItem = false
}) => {
  if (!generatedCopy) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header com Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
            <Wand2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Copy Gerada com IA</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Pronta para usar</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-600">
            {platform}
          </Badge>
          <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-600">
            {copyType}
          </Badge>
        </div>
      </div>

      {/* Preview da Copy */}
      <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm overflow-hidden">
        {/* Header do Preview */}
        <div className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600 px-6 py-4 border-b border-gray-200 dark:border-gray-500">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center">
                {platform === 'Instagram' && <Instagram className="w-4 h-4 text-pink-500" />}
                {platform === 'Facebook' && <Facebook className="w-4 h-4 text-blue-600" />}
                {platform === 'LinkedIn' && <Linkedin className="w-4 h-4 text-blue-700" />}
                {platform === 'Email' && <Mail className="w-4 h-4 text-purple-600" />}
                {platform === 'WhatsApp' && <MessageSquare className="w-4 h-4 text-green-600" />}
                {platform === 'Web' && <Globe className="w-4 h-4 text-gray-600" />}
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{platform}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">• {copyType}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-500 dark:text-gray-400">Pronto</span>
            </div>
          </div>
        </div>
        
        {/* Conteúdo da Copy */}
        <div className="p-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-600 p-4">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800 dark:text-gray-200 font-medium">
                {generatedCopy}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ações */}
      <div className="space-y-3">
        {/* Botões Principais */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={onCopyToClipboard} 
            disabled={isCopyingToClipboard}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            size="lg"
          >
            {isCopyingToClipboard ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Copiando...
              </>
            ) : (
              <>
                <CopyIcon className="w-4 h-4 mr-2" />
                Copiar Copy
              </>
            )}
          </Button>
          {(locationPathname === '/calendar' && selectedEvent) || selectedItem ? (
            <Button 
              onClick={onUseGeneratedCopy} 
              disabled={isApplyingToItem}
              variant="secondary" 
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              size="lg"
            >
              {isApplyingToItem ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Aplicando...
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4 mr-2" />
                  {locationPathname === '/calendar' ? 'Agendar Post' : 'Aplicar ao Item'}
                </>
              )}
            </Button>
          ) : null}
        </div>
        
        {/* Botão Secundário */}
        <Button 
          variant="outline" 
          onClick={onReset}
          className="w-full border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          size="lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Criar Nova Copy
        </Button>
      </div>

      {/* Informações Adicionais */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-600 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Wand2 className="w-3 h-3 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-sm">
            <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">Dica Pro</p>
            <p className="text-blue-700 dark:text-blue-300">
              {locationPathname === '/calendar' 
                ? 'A copy foi otimizada para agendamento. Clique em "Agendar Post" para continuar.'
                : 'A copy foi gerada com base no contexto da página atual. Use no Composer para editar.'
              }
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GeneratedCopyPreview;