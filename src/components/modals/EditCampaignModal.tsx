import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Mail, Calendar as CalendarIcon, Clock, Save, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { EmailCampaign } from '@/services/emailMarketing';
import { useToast } from '@/hooks/use-toast';

interface EditEmailCampaignModalProps {
    isOpen: boolean;
    onClose: () => void;
    campaign: EmailCampaign | null;
    onSave: (campaignId: string, updates: Partial<EmailCampaign>) => Promise<void>;
}

const EditEmailCampaignModal = ({ isOpen, onClose, campaign, onSave }: EditEmailCampaignModalProps) => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        subject: '',
        preview_text: '',
        html_content: '',
        text_content: '',
        status: 'draft' as const,
        send_type: 'immediate' as const,
        scheduled_at: undefined as string | undefined,
        total_recipients: 0,
        tags: [] as string[]
    });

    const [scheduledDate, setScheduledDate] = useState<Date | undefined>();
    const [scheduledTime, setScheduledTime] = useState('09:00');

    useEffect(() => {
        if (campaign && isOpen) {
            setFormData({
                name: campaign.name,
                subject: campaign.subject,
                preview_text: campaign.preview_text || '',
                html_content: campaign.html_content,
                text_content: campaign.text_content || '',
                status: campaign.status,
                send_type: campaign.send_type,
                scheduled_at: campaign.scheduled_at,
                total_recipients: campaign.total_recipients,
                tags: campaign.tags || []
            });

            if (campaign.scheduled_at) {
                const date = new Date(campaign.scheduled_at);
                setScheduledDate(date);
                setScheduledTime(format(date, 'HH:mm'));
            }
        }
    }, [campaign, isOpen]);

    const handleSave = async () => {
        if (!campaign) return;

        try {
            setIsLoading(true);

            let scheduledDateTime: string | undefined;
            if (formData.send_type === 'scheduled' && scheduledDate) {
                const [hours, minutes] = scheduledTime.split(':');
                const dateTime = new Date(scheduledDate);
                dateTime.setHours(parseInt(hours), parseInt(minutes));
                scheduledDateTime = dateTime.toISOString();
            }

            const updates: Partial<EmailCampaign> = {
                name: formData.name,
                subject: formData.subject,
                preview_text: formData.preview_text,
                html_content: formData.html_content,
                text_content: formData.text_content,
                status: formData.status,
                send_type: formData.send_type,
                scheduled_at: scheduledDateTime,
                total_recipients: formData.total_recipients,
                tags: formData.tags
            };

            await onSave(campaign.id, updates);

            toast({
                title: 'Sucesso',
                description: 'Campanha atualizada com sucesso!'
            });

            onClose();
        } catch (error) {
            console.error('Erro ao salvar campanha:', error);
            toast({
                title: 'Erro',
                description: 'Não foi possível salvar as alterações',
                variant: 'destructive'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const addTag = (tag: string) => {
        if (tag && !formData.tags.includes(tag)) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tag]
            }));
        }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    if (!campaign) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                        <Mail className="h-5 w-5" />
                        Editar Campanha: {campaign.name}
                    </DialogTitle>
                    <DialogDescription>
                        Altere as informações da campanha de email marketing
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
                        <TabsTrigger value="content">Conteúdo</TabsTrigger>
                        <TabsTrigger value="settings">Configurações</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">Nome da Campanha</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Digite o nome da campanha"
                                />
                            </div>

                            <div>
                                <Label htmlFor="subject">Assunto do Email</Label>
                                <Input
                                    id="subject"
                                    value={formData.subject}
                                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                                    placeholder="Digite o assunto do email"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="preview_text">Texto de Preview</Label>
                            <Input
                                id="preview_text"
                                value={formData.preview_text}
                                onChange={(e) => setFormData(prev => ({ ...prev, preview_text: e.target.value }))}
                                placeholder="Texto que aparece na prévia do email"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="status">Status</Label>
                                <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">Rascunho</SelectItem>
                                        <SelectItem value="scheduled">Agendada</SelectItem>
                                        <SelectItem value="sent" disabled={campaign.status !== 'sent'}>Enviada</SelectItem>
                                        <SelectItem value="paused">Pausada</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="recipients">Total de Destinatários</Label>
                                <Input
                                    id="recipients"
                                    type="number"
                                    value={formData.total_recipients}
                                    onChange={(e) => setFormData(prev => ({ ...prev, total_recipients: parseInt(e.target.value) || 0 }))}
                                    placeholder="Número de destinatários"
                                />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="content" className="space-y-4">
                        <div>
                            <Label htmlFor="html_content">Conteúdo HTML</Label>
                            <Textarea
                                id="html_content"
                                value={formData.html_content}
                                onChange={(e) => setFormData(prev => ({ ...prev, html_content: e.target.value }))}
                                placeholder="Digite o conteúdo HTML do email"
                                rows={8}
                                className="font-mono"
                            />
                        </div>

                        <div>
                            <Label htmlFor="text_content">Conteúdo em Texto (Opcional)</Label>
                            <Textarea
                                id="text_content"
                                value={formData.text_content}
                                onChange={(e) => setFormData(prev => ({ ...prev, text_content: e.target.value }))}
                                placeholder="Versão em texto simples do email"
                                rows={6}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="settings" className="space-y-4">
                        <div>
                            <Label htmlFor="send_type">Tipo de Envio</Label>
                            <Select value={formData.send_type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, send_type: value }))}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="immediate">Imediato</SelectItem>
                                    <SelectItem value="scheduled">Agendado</SelectItem>
                                    <SelectItem value="recurring">Recorrente</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {formData.send_type === 'scheduled' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Data de Agendamento</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {scheduledDate ? format(scheduledDate, 'dd/MM/yyyy', { locale: ptBR }) : 'Selecione a data'}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={scheduledDate}
                                                onSelect={setScheduledDate}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div>
                                    <Label htmlFor="scheduled_time">Horário</Label>
                                    <Input
                                        id="scheduled_time"
                                        type="time"
                                        value={scheduledTime}
                                        onChange={(e) => setScheduledTime(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <Label>Tags</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.tags.map((tag, index) => (
                                    <Badge
                                        key={index}
                                        variant="secondary"
                                        className="cursor-pointer"
                                        onClick={() => removeTag(tag)}
                                    >
                                        {tag} ×
                                    </Badge>
                                ))}
                            </div>
                            <Input
                                placeholder="Digite uma tag e pressione Enter"
                                className="mt-2"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        addTag(e.currentTarget.value);
                                        e.currentTarget.value = '';
                                    }
                                }}
                            />
                        </div>
                    </TabsContent>
                </Tabs>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Salvar Alterações
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditEmailCampaignModal;
