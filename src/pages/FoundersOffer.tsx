import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Countdown } from "@/components/ui/countdown";
import { useFounderSpots } from "@/hooks/useFounderSpots";
import { analytics } from "@/services/analytics";
import {
    Crown,
    CheckCircle,
    Shield,
    Clock,
    Lock
} from "lucide-react";
import { addToWaitlist } from "@/services/waitlistService";
import { useUTM } from "@/hooks/useUTM";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useTheme } from "@/components/ThemeProvider";
import appDark from '@/assets/app-dark.png';
import appLight from '@/assets/app-light.png';

const founderSchema = z.object({
    email: z.string().email("E-mail inválido"),
    name: z.string().min(2, "Nome muito curto"),
    phone: z.string().min(10, "Telefone inválido"),
    company: z.string().optional(),
});

type FounderForm = z.infer<typeof founderSchema>;

// Data de lançamento (pode ser ajustada conforme necessário)
const launchDate = new Date('2025-10-15'); // Data fixa mais realista

export default function FoundersOffer() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();
    const utm = useUTM();
    const { spotsLeft, reserveSpot, percentageLeft } = useFounderSpots();
    const { theme } = useTheme();

    // Determina qual imagem usar baseada no tema
    // Modo escuro = imagem clara, modo claro = imagem escura
    const getCurrentImage = () => {
        if (theme === 'dark') {
            return appLight; // imagem clara no tema escuro
        } else if (theme === 'light') {
            return appDark; // imagem escura no tema claro  
        } else {
            // Modo system - detecta preferência do sistema
            const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            return isDarkMode ? appLight : appDark;
        }
    };

    const form = useForm<FounderForm>({
        resolver: zodResolver(founderSchema),
        defaultValues: {
            email: "",
            name: "",
            phone: "",
            company: ""
        }
    });

    const onSubmit = async (data: FounderForm) => {
        setIsSubmitting(true);
        try {
            const res = await addToWaitlist({
                email: data.email,
                consent: true,
                utm,
                variant: 'founders-offer',
                ideas: [
                    `name:${data.name}`,
                    `phone:${data.phone}`,
                    `company:${data.company || 'not_provided'}`,
                    'tier:founder'
                ]
            });

            analytics.track('founder_offer_submitted', {
                name: data.name,
                hasCompany: !!data.company,
                variant: 'founders-offer',
                spotsLeft: spotsLeft - 1
            });

            if (res.ok) {
                reserveSpot();
                toast({
                    title: "🎉 Vaga de Fundador Garantida!",
                    description: "Você receberá os detalhes de pagamento em breve via e-mail."
                });
                navigate('/success');
            } else {
                throw new Error(res.error || 'Falha ao reservar vaga');
            }
        } catch (error) {
            console.error('Erro ao enviar founder offer:', error);
            toast({
                title: "Ops! Algo deu errado",
                description: "Tente novamente em alguns segundos.",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const plans = [
        {
            name: "Starter",
            originalPrice: 97,
            founderPrice: 97,
            yearlyOriginal: 1164,
            yearlyFounder: 347,
            savings: 817,
            credits: 150,
            features: ["150 créditos de IA/mês", "3 integrações", "Analytics básicos", "1 usuário"]
        },
        {
            name: "Pro",
            originalPrice: 297,
            founderPrice: 297,
            yearlyOriginal: 3564,
            yearlyFounder: 1069,
            savings: 2495,
            credits: 800,
            features: ["800 créditos de IA/mês", "10 integrações", "Analytics avançados", "Até 5 usuários", "Brand voices ilimitadas"],
            popular: true
        },
        {
            name: "Business",
            originalPrice: 697,
            founderPrice: 697,
            yearlyOriginal: 8364,
            yearlyFounder: 2509,
            savings: 5855,
            credits: 3000,
            features: ["3.000 créditos de IA/mês", "Integrações avançadas", "Analytics enterprise", "Usuários ilimitados", "API personalizada"]
        }
    ];

    const marketStats = [
        {
            title: "Profissionais criativos",
            description: "gastam 60% do tempo em tasks repetitivas",
            source: "Pesquisa Adobe 2024",
            emoji: "⏰",
            highlight: "60%"
        },
        {
            title: "Empresas que usam IA",
            description: "para conteúdo aumentam produtividade em 40%",
            source: "McKinsey Global Survey",
            emoji: "📈",
            highlight: "40%"
        },
        {
            title: "Profissionais de marketing",
            description: "querem mais tempo para estratégia, menos execução",
            source: "HubSpot State of Marketing",
            emoji: "🎯",
            highlight: "87%"
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Theme Toggle - Fixed Top Right */}
            <div className="fixed top-6 right-6 z-50">
                <ThemeToggle />
            </div>

            {/* Fixed CTA Button Mobile */}
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 md:hidden">
                <Button
                    size="lg"
                    className="bg-gradient-primary text-primary-foreground font-bold shadow-2xl animate-pulse"
                    onClick={() => document.getElementById('founder-form')?.scrollIntoView({ behavior: 'smooth' })}
                >
                    🔥 Quero minha vaga ({spotsLeft} restantes)
                </Button>
            </div>

            <div className="container max-w-6xl mx-auto px-4 py-8 space-y-16">
                {/* 1. Hero Section */}
                <div className="text-center space-y-6">
                    <Badge className="px-6 py-2 text-sm font-bold bg-gradient-primary text-primary-foreground">
                        Oferta Exclusiva para Founders
                    </Badge>

                    <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                        👉 Seja um dos <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent font-extrabold">{spotsLeft} fundadores</span> e economize até <span className="text-green-500">R$ 5.855 no 1º ano</span> usando IA para criar copies em minutos
                    </h1>

                    <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                        Acesse o MVP em <strong>{launchDate.toLocaleDateString('pt-BR')}</strong>, economize até <strong className="text-green-500">R$ 5.855</strong> no 1º ano e ajude a moldar o futuro da plataforma.
                    </p>

                    <Button
                        size="lg"
                        className="bg-gradient-primary text-primary-foreground font-bold text-lg px-8 py-6"
                        onClick={() => document.getElementById('founder-form')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        🔥 Quero minha vaga de fundador (só {spotsLeft} restantes)
                    </Button>

                    {/* Countdown Timer */}
                    <div className="max-w-md mx-auto space-y-4">
                        <p className="text-sm font-medium text-muted-foreground">Oferta expira em:</p>
                        <Countdown targetDate={launchDate} />
                    </div>

                    {/* Progress Bar */}
                    <div className="max-w-md mx-auto space-y-4">
                        <div className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            ⏳ {spotsLeft} vagas → decrescendo
                        </div>
                        <div className="w-full bg-muted rounded-full h-3">
                            <div
                                className="bg-gradient-primary h-3 rounded-full transition-all duration-500"
                                style={{ width: `${100 - percentageLeft}%` }}
                            />
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {50 - spotsLeft} de 50 vagas preenchidas
                        </div>
                    </div>
                </div>

                {/* 2. Seção Problema/Dor */}
                <div className="bg-muted/30 rounded-2xl p-8 text-center space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                        "Cada hora perdida criando copy é uma venda que desaparece."
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                        Você passa horas escrevendo posts, e-mails e anúncios… enquanto seus concorrentes já estão publicando.
                        O StorySpark corta esse tempo de horas para minutos sem perder sua voz de marca.
                    </p>
                </div>

                {/* 3. Seção Transformação/Prova */}
                <div className="space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                            Mais de 100 profissionais já aguardando o lançamento.
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                            <strong>Apenas 50 terão acesso ao Founder's Offer com 70% OFF.</strong>
                            <br />
                            Seja um dos primeiros a usar o StorySpark, influencie diretamente
                            o roadmap e garanta o menor preço que a plataforma terá.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {marketStats.map((stat, index) => (
                            <Card key={index} className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-3">
                                        <div className="text-2xl">{stat.emoji}</div>
                                        <div className="flex-1">
                                            <div className="mb-3">
                                                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                                                    {stat.highlight}
                                                </div>
                                                <h3 className="font-semibold text-sm text-foreground mb-1">
                                                    {stat.title}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {stat.description}
                                                </p>
                                            </div>
                                            <div className="text-xs text-muted-foreground italic">
                                                Fonte: {stat.source}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* 4. Seção Oferta (Founder's Offer) */}
                <div className="bg-gradient-primary/5 rounded-2xl p-8 space-y-8">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                            O que você recebe como Founder
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                🚀
                            </div>
                            <div>
                                <h3 className="font-semibold">Acesso antecipado ao MVP</h3>
                                <p className="text-sm text-muted-foreground">em {launchDate.toLocaleDateString('pt-BR')}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                🎁
                            </div>
                            <div>
                                <h3 className="font-semibold">70% OFF no plano anual</h3>
                                <p className="text-sm text-muted-foreground">(só no 1º ano)</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                🤝
                            </div>
                            <div>
                                <h3 className="font-semibold">Comunidade exclusiva</h3>
                                <p className="text-sm text-muted-foreground">de fundadores</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                🗳️
                            </div>
                            <div>
                                <h3 className="font-semibold">Influência no roadmap</h3>
                                <p className="text-sm text-muted-foreground">suas ideias moldam features</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                ⭐
                            </div>
                            <div>
                                <h3 className="font-semibold">Seu nome como Founder</h3>
                                <p className="text-sm text-muted-foreground">listado dentro da plataforma</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. Tabela de Preços Comparativa */}
                <div className="space-y-8">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                            Economia real para quem acredita primeiro
                        </h2>
                    </div>

                    {/* Desktop Table */}
                    <div className="hidden lg:block overflow-x-auto">
                        <div className="bg-card rounded-2xl border shadow-elegant overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gradient-primary text-primary-foreground">
                                        <th className="text-left p-6 font-bold">Plano</th>
                                        <th className="text-center p-6 font-bold">Preço Normal</th>
                                        <th className="text-center p-6 font-bold">Founder's Offer (1º ano)</th>
                                        <th className="text-center p-6 font-bold">Economia</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {plans.map((plan, index) => (
                                        <tr key={index} className={`border-b border-border/50 hover:bg-muted/50 transition-colors ${plan.popular ? 'bg-primary/5' : ''}`}>
                                            <td className="p-6 font-semibold">
                                                <div className="flex items-center gap-2">
                                                    {plan.name}
                                                    {plan.popular && <Badge variant="secondary" className="text-xs">Mais Popular</Badge>}
                                                </div>
                                            </td>
                                            <td className="p-6 text-center">
                                                <div className="flex flex-col">
                                                    <span className="line-through text-muted-foreground text-lg">
                                                        R$ {plan.yearlyOriginal.toLocaleString('pt-BR')}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">/ano</span>
                                                </div>
                                            </td>
                                            <td className="p-6 text-center">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-green-500 text-xl">
                                                        R$ {plan.yearlyFounder.toLocaleString('pt-BR')}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">/ano</span>
                                                </div>
                                            </td>
                                            <td className="p-6 text-center">
                                                <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-3">
                                                    <div className="font-bold text-green-600 dark:text-green-400 text-lg">
                                                        R$ {plan.savings.toLocaleString('pt-BR')}
                                                    </div>
                                                    <div className="text-xs text-green-600 dark:text-green-400">
                                                        (70% OFF)
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile Cards */}
                    <div className="lg:hidden grid gap-6">
                        {plans.map((plan, index) => (
                            <Card key={index} className={`${plan.popular ? 'border-primary border-2 shadow-xl' : ''}`}>
                                {plan.popular && (
                                    <div className="bg-gradient-primary text-primary-foreground p-2 text-center text-sm font-bold">
                                        ⭐ MAIS POPULAR
                                    </div>
                                )}
                                <CardContent className="p-6 space-y-4">
                                    <div className="text-center space-y-2">
                                        <h3 className="text-2xl font-bold">{plan.name}</h3>
                                        <div className="flex flex-col items-center space-y-1">
                                            <span className="line-through text-muted-foreground">
                                                R$ {plan.yearlyOriginal.toLocaleString('pt-BR')}/ano
                                            </span>
                                            <span className="text-3xl font-bold text-green-500">
                                                R$ {plan.yearlyFounder.toLocaleString('pt-BR')}
                                            </span>
                                            <span className="text-sm text-muted-foreground">/ano</span>
                                        </div>
                                        <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-3 mx-auto max-w-fit">
                                            <div className="font-bold text-green-600 dark:text-green-400">
                                                Economiza R$ {plan.savings.toLocaleString('pt-BR')}
                                            </div>
                                            <div className="text-xs text-green-600 dark:text-green-400">
                                                (70% OFF no primeiro ano)
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="font-medium text-sm">Inclui:</p>
                                        <ul className="space-y-1">
                                            {plan.features.map((feature, i) => (
                                                <li key={i} className="flex items-center gap-2 text-sm">
                                                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Dashboard Preview */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-foreground">
                            Veja como será sua nova ferramenta
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Interface intuitiva, IA poderosa e resultados em segundos.
                            O StorySpark foi pensado para ser sua extensão criativa.
                        </p>
                    </div>
                    <div className="relative">
                        <img
                            src={getCurrentImage()}
                            alt="Dashboard StorySpark"
                            className="rounded-2xl shadow-2xl border"
                        />
                        <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                            Beta Funcional
                        </div>
                    </div>
                </div>

                {/* 6. Seção Garantia/Segurança */}
                <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-8 space-y-6 border border-green-200 dark:border-green-800">
                    <div className="text-center space-y-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center justify-center gap-2">
                            🔒 Segurança total para você
                        </h2>
                        <p className="text-lg text-foreground max-w-2xl mx-auto">
                            Se em até <strong>30 dias</strong> você não enxergar valor, devolvemos seu investimento.
                            <br />Sem letras miúdas.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                            <span className="text-sm">Desconto válido apenas no 1º ano</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Lock className="w-6 h-6 text-blue-500 flex-shrink-0" />
                            <span className="text-sm">Renovação pelo preço cheio vigente</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Shield className="w-6 h-6 text-green-600 flex-shrink-0" />
                            <span className="text-sm"><strong>30 dias de garantia total</strong> após o lançamento</span>
                        </div>
                    </div>
                </div>

                {/* Microcopy motivacional */}
                <div className="text-center space-y-4 max-w-2xl mx-auto">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                            🚀 <strong>Em média, fundadores estão economizando 3+ horas por semana já no MVP.</strong> Você pode ser o próximo.
                        </p>
                    </div>
                </div>

                {/* Formulário de Fundador */}
                <Card id="founder-form" className="max-w-2xl mx-auto shadow-2xl border-2 border-primary">
                    <CardHeader className="text-center bg-gradient-primary text-primary-foreground">
                        <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
                            <Crown className="w-6 h-6" />
                            Garantir Vaga de Fundador
                        </CardTitle>
                        <CardDescription className="text-primary-foreground/90 text-lg">
                            Preencha seus dados e receba o link de pagamento seguro
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="p-8">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nome Completo *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="João Silva" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>WhatsApp *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="(11) 99999-9999" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>E-mail *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="joao@empresa.com" type="email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="company"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Empresa/Negócio (opcional)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Minha Empresa Ltda" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full bg-gradient-primary text-primary-foreground font-bold text-lg py-6 shadow-xl hover:shadow-2xl"
                                    disabled={isSubmitting || spotsLeft <= 0}
                                >
                                    {isSubmitting ? (
                                        "Reservando sua vaga..."
                                    ) : spotsLeft <= 0 ? (
                                        "Vagas Esgotadas"
                                    ) : (
                                        <>
                                            🔥 Quero minha vaga de fundador (só {spotsLeft} restantes)
                                        </>
                                    )}
                                </Button>

                                <p className="text-xs text-muted-foreground text-center">
                                    📩 <strong>Ao entrar, você recebe um e-mail com link de pagamento seguro.</strong> Sem cobrança automática.
                                </p>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                {/* 7. CTA Final com urgência */}
                <div className="text-center space-y-6 bg-gradient-primary text-primary-foreground rounded-2xl p-12">
                    <h2 className="text-4xl font-bold">
                        Última chance de entrar como fundador
                    </h2>

                    <Button
                        size="lg"
                        variant="secondary"
                        className="text-lg font-bold px-8 py-4"
                        onClick={() => document.getElementById('founder-form')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        🔥 Quero minha vaga de fundador (só {spotsLeft} restantes)
                    </Button>

                    <p className="text-sm opacity-75">
                        ⏳ Apenas {spotsLeft} vagas disponíveis. Depois, apenas planos regulares.
                    </p>
                </div>
            </div>
        </div>
    );
}

export { FoundersOffer as Component };
