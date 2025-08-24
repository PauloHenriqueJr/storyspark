import React from 'react';
import { Edit3, Users, Mic, FileText, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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

interface ItemSelectorProps {
  showItemSelector: boolean;
  setShowItemSelector: (show: boolean) => void;
  selectedItem: BrandVoice | Persona | Template | Campaign | null;
  onItemSelect: (item: BrandVoice | Persona | Template | Campaign) => void;
}

const ItemSelector: React.FC<ItemSelectorProps> = ({ 
  showItemSelector, 
  setShowItemSelector, 
  selectedItem, 
  onItemSelect 
}) => {
  // Dados de exemplo para demonstração
  const voices: BrandVoice[] = [
    {
      id: '1',
      workspace_id: '1',
      user_id: '1',
      name: 'Voice Profissional',
      description: 'Tom profissional e objetivo',
      tone: 'Profissional',
      style: 'Objetivo',
      examples: [],
      guidelines: '',
      usage_count: 0,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  const personas: Persona[] = [
    {
      id: '1',
      workspace_id: '1',
      user_id: '1',
      name: 'Persona Empreendedora',
      occupation: 'Empreendedora',
      usage_count: 0,
      created_at: new Date().toISOString()
    }
  ];

  const templates: Template[] = [
    {
      id: '1',
      name: 'Template de Lançamento',
      description: 'Template para lançamentos de produtos',
      category: 'Lançamento',
      type: 'Post',
      content: '',
      blocks: [],
      usage_count: 0,
      is_public: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: '1',
      workspace_id: '1',
      version: 1
    }
  ];

  const campaigns: Campaign[] = [
    {
      id: '1',
      name: 'Campanha de Verão',
      description: 'Campanha promocional de verão',
      status: 'Ativa',
      start_date: new Date().toISOString(),
      end_date: new Date().toISOString(),
      budget: 1000,
      spent: 500,
      roi: 2.5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: '1',
      workspace_id: '1'
    }
  ];

  if (!showItemSelector) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
          <Users className="w-3 h-3 text-purple-600 dark:text-purple-400" />
        </div>
        <label className="text-sm font-semibold text-gray-900 dark:text-white">
          Assistente IA - Selecionar Item
        </label>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Selecionar existente:</span>
          <Badge variant="outline" className="text-xs">
            {voices.length + personas.length + templates.length + campaigns.length} disponíveis
          </Badge>
        </div>
        <div className="max-h-48 overflow-y-auto space-y-3 border border-gray-200 dark:border-gray-600 rounded-xl p-4 bg-white dark:bg-gray-800">
          {[...voices, ...personas, ...templates, ...campaigns].slice(0, 5).map((item: BrandVoice | Persona | Template | Campaign, index: number) => (
            <div
              key={index}
              onClick={() => onItemSelect(item)}
              className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 dark:border-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 hover:border-blue-200 dark:hover:border-blue-600 cursor-pointer transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-sm">
                {('tone' in item) ? <Mic className="w-5 h-5 text-white" /> : 
                 ('occupation' in item) ? <Users className="w-5 h-5 text-white" /> : 
                 ('category' in item) ? <FileText className="w-5 h-5 text-white" /> : 
                 <Target className="w-5 h-5 text-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                  {item.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {'description' in item ? item.description : 
                   ('occupation' in item) ? item.occupation : 
                   ('tone' in item) ? item.tone : 
                   'Sem descrição'}
                </p>
              </div>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Edit3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItemSelector;