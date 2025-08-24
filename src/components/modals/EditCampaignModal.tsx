import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { campaignsService } from '@/services/campaignsService';
import type { Database } from '@/integrations/supabase/types';

interface EditCampaignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: Database['public']['Tables']['campaigns']['Row'] | null;
  onUpdate: () => void;
}

const EditCampaignModal: React.FC<EditCampaignModalProps> = ({ 
  open, 
  onOpenChange, 
  campaign,
  onUpdate
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    budget: 0,
    platform: '',
    status: 'DRAFT' as Database['public']['Enums']['CampaignStatus'],
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Preencher formulário quando a campanha muda
  useEffect(() => {
    if (campaign) {
      setFormData({
        name: campaign.name || '',
        description: campaign.description || '',
        budget: campaign.budget || 0,
        platform: typeof campaign.metadata === 'object' && campaign.metadata ? (campaign.metadata as { platform?: string })?.platform || '' : '',
        status: campaign.status || 'DRAFT',
        startDate: campaign.start_date ? new Date(campaign.start_date).toISOString().split('T')[0] : '',
        endDate: campaign.end_date ? new Date(campaign.end_date).toISOString().split('T')[0] : ''
      });
    }
  }, [campaign]);

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaign?.id) return;

    setLoading(true);
    try {
      await campaignsService.update(campaign.id, {
        name: formData.name,
        description: formData.description,
        budget: formData.budget,
        status: formData.status,
        start_date: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        end_date: formData.endDate ? new Date(formData.endDate).toISOString() : null,
        metadata: campaign.metadata ? {
          ...(typeof campaign.metadata === 'object' ? campaign.metadata : {}),
          platform: formData.platform
        } : { platform: formData.platform }
      });

      toast({
        title: 'Campanha atualizada',
        description: 'As informações da campanha foram atualizadas com sucesso.'
      });

      onUpdate();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Erro ao atualizar',
        description: 'Não foi possível atualizar a campanha. Tente novamente.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Campanha</DialogTitle>
          <DialogDescription>
            Edite as informações da sua campanha
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Campanha</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Ex: Lançamento de Produto"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="budget">Orçamento (R$)</Label>
              <Input
                id="budget"
                type="number"
                value={formData.budget}
                onChange={(e) => handleChange('budget', Number(e.target.value))}
                placeholder="Ex: 5000"
                min="0"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Descreva os objetivos e público-alvo da campanha"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Plataforma</Label>
              <Select value={formData.platform} onValueChange={(value) => handleChange('platform', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a plataforma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value as Database['public']['Enums']['CampaignStatus'])}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Rascunho</SelectItem>
                  <SelectItem value="ACTIVE">Ativa</SelectItem>
                  <SelectItem value="PAUSED">Pausada</SelectItem>
                  <SelectItem value="COMPLETED">Finalizada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Data de Início</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">Data de Término</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter className="gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCampaignModal;