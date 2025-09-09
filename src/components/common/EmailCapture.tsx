import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface EmailCaptureProps {
    title?: string;
    subtitle?: string;
    placeholder?: string;
    buttonText?: string;
    successMessage?: string;
    onSubmit?: (email: string) => Promise<void>;
    benefits?: Array<{
        icon: React.ReactNode;
        text: string;
    }>;
    showConsent?: boolean;
    className?: string;
}

export const EmailCapture: React.FC<EmailCaptureProps> = ({
    title = "Junte-se à nossa lista de espera",
    subtitle = "Seja o primeiro a saber quando lançarmos",
    placeholder = "Digite seu email",
    buttonText = "Entrar na lista",
    successMessage = "Obrigado! Você foi adicionado à nossa lista.",
    onSubmit,
    benefits,
    showConsent = false,
    className = "",
}) => {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [consent, setConsent] = useState(false);
    const lastSubmitAt = useRef<number | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim()) {
            toast({
                title: "Email obrigatório",
                description: "Por favor, digite seu email.",
                variant: "destructive",
            });
            return;
        }

        if (showConsent && !consent) {
            toast({
                title: "Consentimento necessário",
                description: "Por favor, aceite os termos para continuar.",
                variant: "destructive",
            });
            return;
        }

        // Rate limiting
        const now = Date.now();
        if (lastSubmitAt.current && now - lastSubmitAt.current < 5000) {
            toast({
                title: "Aguarde um momento",
                description: "Por favor, aguarde alguns segundos antes de tentar novamente.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        lastSubmitAt.current = now;

        try {
            if (onSubmit) {
                await onSubmit(email);
            }

            setIsSubmitted(true);
            toast({
                title: "Sucesso!",
                description: successMessage,
            });
        } catch (error) {
            console.error('Erro ao enviar email:', error);
            toast({
                title: "Erro",
                description: "Ocorreu um erro. Tente novamente.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className={`text-center p-8 ${className}`}>
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Obrigado!</h3>
                <p className="text-muted-foreground">{successMessage}</p>
            </div>
        );
    }

    return (
        <div className={`max-w-md mx-auto ${className}`}>
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">{title}</h2>
                <p className="text-muted-foreground">{subtitle}</p>
            </div>

            {benefits && benefits.length > 0 && (
                <div className="mb-8 space-y-3">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <div className="text-primary">{benefit.icon}</div>
                            <span className="text-sm">{benefit.text}</span>
                        </div>
                    ))}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                            type="email"
                            placeholder={placeholder}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10"
                            disabled={isLoading}
                        />
                    </div>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            buttonText
                        )}
                    </Button>
                </div>

                {showConsent && (
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="consent"
                            checked={consent}
                            onChange={(e) => setConsent(e.target.checked)}
                            className="rounded"
                        />
                        <label htmlFor="consent" className="text-sm text-muted-foreground">
                            Aceito receber comunicações sobre o produto
                        </label>
                    </div>
                )}
            </form>
        </div>
    );
};
