import { useState, useRef, useEffect } from "react";
// Counter removed for waitlist
import { useUTM } from "@/hooks/useUTM";
import { analytics } from "@/services/analytics";
import { addToWaitlist } from "@/services/waitlistService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle, Gift, Users, Zap, Heart, Target, Lightbulb } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import ReferralWidget from '@/components/layout/landpage-waitlist/ReferralWidget';
import { fetchSuggestions, type SuggestionItem } from "@/services/suggestionService";

const benefits = [
  {
    icon: <Gift className="w-5 h-5" />,
    text: "Acesso antecipado à plataforma"
  },
  {
    icon: <Users className="w-5 h-5" />,
    text: "Comunidade exclusiva de beta testers"
  },
  {
    icon: <Zap className="w-5 h-5" />,
    text: "Templates gratuitos toda semana"
  }
];

const categoryIcons = {
  "Templates": <Target className="w-4 h-4" />,
  "IA": <Lightbulb className="w-4 h-4" />,
  "Integração": <Zap className="w-4 h-4" />,
  "Analytics": <Target className="w-4 h-4" />,
  "Comunidade": <Users className="w-4 h-4" />,
  "Personalização": <Heart className="w-4 h-4" />,
  "Tráfego Pago": <Target className="w-4 h-4" />,
  "Ideia": <Lightbulb className="w-4 h-4" />
};

const EmailCapture = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [alreadyExists, setAlreadyExists] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [consent, setConsent] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [selectedIdeas, setSelectedIdeas] = useState<string[]>([]);
  const lastSubmitAt = useRef<number | null>(null);
  const utm = useUTM();

  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        const data = await fetchSuggestions();
        setSuggestions(data.slice(0, 6)); // Mostrar apenas as 6 mais populares
      } catch (error) {
        console.error('Erro ao carregar sugestões:', error);
      }
    };
    loadSuggestions();
  }, []);

  const toggleIdea = (ideaText: string) => {
    setSelectedIdeas(prev => 
      prev.includes(ideaText) 
        ? prev.filter(id => id !== ideaText)
        : [...prev, ideaText]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Honeypot check: campo oculto não deve ser preenchido por humanos
    const form = e.target as HTMLFormElement;
    const hp = (form.elements.namedItem('hp') as HTMLInputElement | null)?.value;
    if (hp) return; // detectado bot
    if (!email || !consent) return;
    const now = Date.now();
    if (lastSubmitAt.current && now - lastSubmitAt.current < 5000) return;
    lastSubmitAt.current = now;
    setIsBlocked(true);
    setTimeout(() => setIsBlocked(false), 5000);
    setIsLoading(true);
    analytics.track('waitlist_submit_attempt', { source: 'email_capture', email_domain: email.split('@')[1], utm, selected_ideas_count: selectedIdeas.length });
    const res = await addToWaitlist({ email, consent, utm, variant: 'email_capture', ideas: selectedIdeas });
    setIsLoading(false);
    if (res.ok) {
      // Distinção entre novo cadastro e já existente
      const wasAlready = (res as any).info === 'already_exists';
      setAlreadyExists(wasAlready);
      if (wasAlready) {
        try { toast({ title: 'Você já está na lista', description: 'Recebemos seu e‑mail anteriormente.' }); } catch { }
        try { analytics.track('waitlist_already_exists', { source: 'email_capture' }); } catch { }
      } else {
        try { toast({ title: 'Inscrição confirmada!', description: 'Você entrou na lista de espera.' }); } catch { }
        try { analytics.track('waitlist_confirmed', { source: 'email_capture' }); } catch { }
      }
      setIsSubmitted(true);
      analytics.track('waitlist_success', { source: 'email_capture', already_exists: wasAlready });
      setEmail("");
    } else {
      analytics.track('waitlist_error', { source: 'email_capture', error: res.error });
      toast({ title: 'Não foi possível cadastrar', description: res.error || 'Tente novamente em instantes.', variant: 'destructive' });
    }
  };

  if (isSubmitted) {
    // Se já existia, mostrar mensagem distinta sem repetir os benefícios
    if (alreadyExists) {
      return (
        <section className="py-20 bg-primary/5" aria-live="polite">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto text-center">
              <div className="card-gradient rounded-3xl p-12 border border-primary/20">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-4">Você já está na lista</h2>
                <p className="text-lg text-muted-foreground">Recebemos seu e‑mail anteriormente — não é necessário enviar novamente.</p>
              </div>
            </div>
          </div>
        </section>
      );
    }

    // Primeiro envio: mostrar benefícios + ReferralWidget
    return (
      <section className="py-16 sm:py-20 bg-primary/5" aria-live="polite">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-xl sm:max-w-2xl mx-auto text-center">
            <div className="card-gradient rounded-3xl p-8 sm:p-10 md:p-12 border border-primary/20">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Você está na lista! 🎉</h2>
              <p className="text-sm sm:text-lg text-muted-foreground mb-4">Em breve você receberá novidades exclusivas da StorySpark e será um dos primeiros a testar nossa plataforma.</p>
              <div className="mt-3 sm:mt-4 flex flex-wrap justify-center gap-3 sm:gap-4 text-sm sm:text-base text-muted-foreground">
                <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />Templates exclusivos</span>
                <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />Acesso antecipado</span>
                <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />Comunidade VIP</span>
              </div>
              <div className="mt-6 max-w-2xl mx-auto">
                <ReferralWidget />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-border/20 relative overflow-hidden shadow-lg">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-transparent" />

            <div className="relative z-10">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-8 h-8 text-primary" />
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Transforme Suas Ideias em
                  <span className="block text-primary">Vendas com IA</span>
                </h2>

                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Seja um dos primeiros a acessar a plataforma que vai revolucionar como você cria conteúdo que converte. Templates exclusivos, acesso antecipado e suporte VIP esperando por você.
                </p>
              </div>

              {/* Benefits */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 text-foreground">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                      {benefit.icon}
                    </div>
                    <span className="font-medium">{benefit.text}</span>
                  </div>
                ))}
              </div>

              {/* Ideas Selection */}
              {suggestions.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-foreground mb-4 text-center">
                    Quais funcionalidades mais te interessam?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6 text-center">
                    Selecione as ideias que você gostaria de ver na plataforma (opcional)
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        type="button"
                        onClick={() => toggleIdea(suggestion.text)}
                        className={`p-4 rounded-lg border transition-all duration-200 text-left ${
                          selectedIdeas.includes(suggestion.text)
                            ? 'bg-primary/10 border-primary/50 text-primary'
                            : 'bg-muted/30 border-border/50 text-muted-foreground hover:bg-primary/5 hover:border-primary/30'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                            {categoryIcons[suggestion.category as keyof typeof categoryIcons] || <Lightbulb className="w-4 h-4" />}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm leading-relaxed">
                              {suggestion.text}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Heart className={`w-3 h-3 ${suggestion.isLiked ? 'fill-current text-primary' : 'text-muted-foreground'}`} />
                              <span className="text-xs text-muted-foreground">{suggestion.likes} votos</span>
                            </div>
                          </div>
                          {selectedIdeas.includes(suggestion.text) && (
                            <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  {selectedIdeas.length > 0 && (
                    <p className="text-sm text-primary text-center mt-4">
                      {selectedIdeas.length} {selectedIdeas.length === 1 ? 'ideia selecionada' : 'ideias selecionadas'}
                    </p>
                  )}
                </div>
              )}

              {/* Email form */}
              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="flex flex-col gap-3">
                  <Input
                    type="email"
                    placeholder="Seu melhor email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    name="email"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    inputMode="email"
                    className="flex-1 h-12 text-base normal-case"
                    required
                  />
                  <label className="flex items-start gap-2 text-xs text-muted-foreground">
                    <input type="checkbox" className="mt-1" checked={consent} onChange={e => setConsent(e.target.checked)} />
                    <span>Concordo em receber comunicações e com a Política de Privacidade.</span>
                  </label>
                  {/* Honeypot hidden field */}
                  <input name="hp" type="text" autoComplete="off" tabIndex={-1} aria-hidden className="hidden" />
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
                    disabled={isLoading || !consent || isBlocked}
                    onClick={() => { try { (document.activeElement as HTMLElement)?.blur(); } catch { } }}
                  >
                    {isLoading ? "Enviando..." : "Entrar na Lista"}
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground mt-3 text-center">
                  Sem spam. Apenas conteúdo de valor e novidades da plataforma.
                </p>
              </form>

              {/* Social proof removed */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmailCapture;
