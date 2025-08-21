import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Shield,
  CheckCircle,
  Calendar,
  User,
  MapPin
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UpdatePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PaymentMethod {
  id: string;
  type: 'credit' | 'debit';
  brand: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

const UpdatePaymentModal: React.FC<UpdatePaymentModalProps> = ({
  isOpen,
  onClose
}) => {
  const { toast } = useToast();
  const [step, setStep] = useState<'methods' | 'add'>('methods');
  const [loading, setLoading] = useState(false);
  
  const [cardForm, setCardForm] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
    cpf: '',
    zipCode: ''
  });

  const [paymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'credit',
      brand: 'Visa',
      last4: '4532',
      expiryMonth: 12,
      expiryYear: 2027,
      isDefault: true
    },
    {
      id: '2',
      type: 'credit', 
      brand: 'Mastercard',
      last4: '8765',
      expiryMonth: 8,
      expiryYear: 2026,
      isDefault: false
    }
  ]);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  const formatCPF = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length <= 11) {
      return v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return value;
  };

  const formatZipCode = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length <= 8) {
      return v.replace(/(\d{5})(\d{3})/, '$1-$2');
    }
    return value;
  };

  const handleCardInputChange = (field: keyof typeof cardForm, value: string) => {
    let formattedValue = value;
    
    switch (field) {
      case 'number':
        formattedValue = formatCardNumber(value);
        break;
      case 'expiry':
        formattedValue = formatExpiry(value);
        break;
      case 'cvv':
        formattedValue = value.replace(/\D/g, '').substring(0, 4);
        break;
      case 'cpf':
        formattedValue = formatCPF(value);
        break;
      case 'zipCode':
        formattedValue = formatZipCode(value);
        break;
      case 'name':
        formattedValue = value.toUpperCase();
        break;
    }
    
    setCardForm(prev => ({ ...prev, [field]: formattedValue }));
  };

  const handleAddCard = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Cartão adicionado com sucesso!",
      description: "Seu novo método de pagamento foi configurado.",
    });
    
    setLoading(false);
    setStep('methods');
    setCardForm({
      number: '',
      name: '',
      expiry: '',
      cvv: '',
      cpf: '',
      zipCode: ''
    });
  };

  const handleSetDefault = (methodId: string) => {
    toast({
      title: "Método padrão alterado",
      description: "Suas próximas cobranças usarão este cartão.",
    });
  };

  const handleRemoveCard = (methodId: string) => {
    toast({
      title: "Cartão removido",
      description: "O método de pagamento foi removido com sucesso.",
      variant: "destructive"
    });
  };

  const getCardBrandColor = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'visa': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'mastercard': return 'bg-red-100 text-red-700 border-red-200';
      case 'amex': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (step === 'add') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Adicionar Novo Cartão
            </DialogTitle>
            <DialogDescription>
              Insira os dados do seu cartão de crédito ou débito
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Security Notice */}
            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <Shield className="w-5 h-5 text-green-600" />
              <div className="text-sm">
                <p className="font-medium text-green-800 dark:text-green-200">Pagamento Seguro</p>
                <p className="text-green-700 dark:text-green-300 text-xs">
                  Seus dados são criptografados e protegidos
                </p>
              </div>
            </div>

            {/* Card Form */}
            <div className="space-y-4">
              {/* Card Number */}
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Número do Cartão</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardForm.number}
                  onChange={(e) => handleCardInputChange('number', e.target.value)}
                  maxLength={19}
                />
              </div>

              {/* Cardholder Name */}
              <div className="space-y-2">
                <Label htmlFor="cardName">Nome no Cartão</Label>
                <Input
                  id="cardName"
                  placeholder="COMO ESTÁ NO CARTÃO"
                  value={cardForm.name}
                  onChange={(e) => handleCardInputChange('name', e.target.value)}
                />
              </div>

              {/* Expiry and CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Validade</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/AA"
                    value={cardForm.expiry}
                    onChange={(e) => handleCardInputChange('expiry', e.target.value)}
                    maxLength={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    type="password"
                    value={cardForm.cvv}
                    onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                    maxLength={4}
                  />
                </div>
              </div>

              <Separator />

              {/* CPF */}
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  placeholder="000.000.000-00"
                  value={cardForm.cpf}
                  onChange={(e) => handleCardInputChange('cpf', e.target.value)}
                  maxLength={14}
                />
              </div>

              {/* ZIP Code */}
              <div className="space-y-2">
                <Label htmlFor="zipCode">CEP</Label>
                <Input
                  id="zipCode"
                  placeholder="00000-000"
                  value={cardForm.zipCode}
                  onChange={(e) => handleCardInputChange('zipCode', e.target.value)}
                  maxLength={9}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setStep('methods')}>
              Voltar
            </Button>
            <Button 
              onClick={handleAddCard}
              disabled={loading || !cardForm.number || !cardForm.name || !cardForm.expiry || !cardForm.cvv}
              className="bg-gradient-primary hover:opacity-90"
            >
              {loading ? 'Processando...' : 'Adicionar Cartão'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            Métodos de Pagamento
          </DialogTitle>
          <DialogDescription>
            Gerencie seus cartões e formas de pagamento
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Payment Methods */}
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <Card key={method.id} className={`${method.isDefault ? 'border-primary bg-primary/5' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-gradient-primary rounded flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <Badge 
                            variant="outline"
                            className={getCardBrandColor(method.brand)}
                          >
                            {method.brand}
                          </Badge>
                          <span className="font-mono text-sm">
                            •••• {method.last4}
                          </span>
                          {method.isDefault && (
                            <Badge className="bg-success text-white">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Padrão
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {String(method.expiryMonth).padStart(2, '0')}/{method.expiryYear}
                          </span>
                          <span className="capitalize">
                            {method.type === 'credit' ? 'Crédito' : 'Débito'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!method.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefault(method.id)}
                        >
                          Tornar Padrão
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveCard(method.id)}
                        disabled={method.isDefault && paymentMethods.length === 1}
                      >
                        Remover
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add New Card */}
          <Card className="border-dashed border-2 border-muted-foreground/25 hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
              <Button 
                variant="ghost" 
                className="w-full h-auto p-4 flex flex-col gap-2"
                onClick={() => setStep('add')}
              >
                <CreditCard className="w-8 h-8 text-muted-foreground" />
                <div className="text-center">
                  <p className="font-medium">Adicionar Novo Cartão</p>
                  <p className="text-sm text-muted-foreground">
                    Cartão de crédito ou débito
                  </p>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800 text-sm">
          <Shield className="w-4 h-4 text-blue-600" />
          <span className="text-blue-800 dark:text-blue-200">
            Todos os pagamentos são processados com segurança SSL
          </span>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePaymentModal;