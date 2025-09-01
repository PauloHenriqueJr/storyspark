import React from 'react';
import { Edit3, FileText, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface ContextConfig {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
  suggestions: string[];
  defaultPlatform?: string;
  defaultType?: string;
  targetPage?: string;
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

interface BriefingEditorProps {
  customizationMode: boolean;
  selectedItem: BrandVoice | Persona | Template | Campaign | null;
  briefing: string;
  customBriefing: string;
  setBriefing: (briefing: string) => void;
  setCustomBriefing: (briefing: string) => void;
  setCustomizationMode: (mode: boolean) => void;
  currentContext: ContextConfig;
}

const BriefingEditor: React.FC<BriefingEditorProps> = ({ 
  customizationMode, 
  selectedItem, 
  briefing, 
  customBriefing, 
  setBriefing, 
  setCustomBriefing, 
  setCustomizationMode,
  currentContext
}) => {
  // Quick Suggestions
  const suggestions = currentContext.suggestions || [
    'Copy para redes sociais',
    'E-mail marketing',
    'Landing page'
  ];

  return (
    <div className="space-y-6">
      {/* Quick Suggestions */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
            <FileText className="w-3 h-3 text-yellow-600 dark:text-yellow-400" />
          </div>
          <label className="text-sm font-semibold text-gray-900 dark:text-white">
            Sugestões Rápidas
          </label>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {suggestions.map((suggestion, index) => (
            <Button
              key={suggestion}
              variant="outline"
              onClick={() => setBriefing(suggestion)}
              className="justify-start h-auto p-4 text-left border-gray-200 dark:border-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 group"
            >
              <div className="flex items-start gap-3 w-full">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">{index + 1}</span>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                  {suggestion}
                </span>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Personalização */}
      {customizationMode && selectedItem && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Edit3 className="w-3 h-3 text-purple-600 dark:text-purple-400" />
            </div>
            <label className="text-sm font-semibold text-gray-900 dark:text-white">Personalizar Briefing</label>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-600 text-xs">
              Opcional
            </Badge>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-600 rounded-xl p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full ${currentContext.color} flex items-center justify-center`}>
                  <currentContext.icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {selectedItem.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Base selecionada para personalização
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Briefing Base (gerado automaticamente):
                </label>
                <div className="text-xs text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                  {briefing}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Personalizar briefing (adicione detalhes específicos):
                </label>
                <Textarea
                  placeholder="Adicione detalhes específicos, objetivos, público-alvo, tom de voz, call-to-action..."
                  value={customBriefing}
                  onChange={(e) => setCustomBriefing(e.target.value)}
                  className="min-h-[100px] resize-none border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500 dark:focus:border-purple-400 dark:focus:ring-purple-400 rounded-lg text-sm leading-relaxed bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setBriefing(customBriefing);
                    setCustomizationMode(false);
                  }}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                  size="sm"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Usar Personalizado
                </Button>
                <Button
                  onClick={() => {
                    setCustomBriefing(briefing);
                    setCustomizationMode(false);
                  }}
                  variant="outline"
                  className="border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-300 dark:hover:bg-purple-900/20"
                  size="sm"
                >
                  <X className="w-4 h-4 mr-2" />
                  Manter Original
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Briefing */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <FileText className="w-3 h-3 text-green-600 dark:text-green-400" />
          </div>
          <label className="text-sm font-semibold text-gray-900 dark:text-white">
            {customizationMode ? 'Briefing Final' : 'Descrição do Conteúdo'}
          </label>
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-600 text-xs">
            Obrigatório
          </Badge>
        </div>
        <div className="relative">
          <Textarea
            placeholder={customizationMode ? "Briefing personalizado será usado para gerar a copy..." : "Descreva o que você quer comunicar, o objetivo da copy, público-alvo, tom de voz..."}
            value={customizationMode ? customBriefing : briefing}
            onChange={(e) => customizationMode ? setCustomBriefing(e.target.value) : setBriefing(e.target.value)}
            className="min-h-[140px] resize-none border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 rounded-xl text-sm leading-relaxed bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          <div className="absolute bottom-3 right-3 text-xs text-gray-400 dark:text-gray-500">
            {(customizationMode ? customBriefing : briefing).length}/500
          </div>
        </div>
      </div>
    </div>
  );
};

export default BriefingEditor;