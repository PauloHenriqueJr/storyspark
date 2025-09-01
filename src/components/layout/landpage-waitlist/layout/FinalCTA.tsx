import { useState, useRef } from "react";
import SignupCounter from '@/components/layout/landpage-waitlist/SignupCounter';
import { useUTM } from "@/hooks/useUTM";
import { analytics } from "@/services/analytics";
import { addToWaitlist } from "@/services/waitlistService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Sparkles, Users, CheckCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import ReferralProgram from './ReferralProgram';

const FinalCTA = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [alreadyExists, setAlreadyExists] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [consent, setConsent] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const lastSubmitAt = useRef<number | null>(null);
  const utm = useUTM();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const hp = (form.elements.namedItem('hp') as HTMLInputElement | null)?.value;
    if (hp) return; // honeypot filled -> likely bot
    if (!email || !consent) return;
    const now = Date.now();
    if (lastSubmitAt.current && now - lastSubmitAt.current < 5000) return;
    lastSubmitAt.current = now;
    setIsBlocked(true);
    setTimeout(() => setIsBlocked(false), 5000);
    setIsLoading(true);
    analytics.track("waitlist_submit_attempt", { source: "final_cta", email_domain: email.split("@")[1], utm });
    const res = await addToWaitlist({ email, consent, utm, variant: "final_cta" });
    setIsLoading(false);
    if (res.ok) {
      const wasAlready = (res as any).info === 'already_exists';
      setAlreadyExists(wasAlready);
      if (wasAlready) { try { toast({ title: 'Você já está na lista', description: 'Recebemos seu e‑mail anteriormente.' }); } catch { } try { analytics.track('waitlist_already_exists', { source: 'final_cta' }); } catch { } }
      else { try { toast({ title: 'Inscrição confirmada', description: 'Você entrou na lista de espera.' }); } catch { } try { analytics.track('waitlist_confirmed', { source: 'final_cta' }); } catch { } }
      setIsSubmitted(true);
      analytics.track("waitlist_success", { source: "final_cta", already_exists: wasAlready });
      setEmail("");
    } else {
      analytics.track("waitlist_error", { source: "final_cta", error: res.error });
      alert(res.error || "Não foi possível cadastrar. Tente novamente.");
    }
  };

  if (isSubmitted) {
    return (
      <section id="cta" className="py-20 relative overflow-hidden" aria-live="polite">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/10 to-background" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="card-gradient rounded-3xl p-8 sm:p-10 md:p-12 border border-primary/20">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  {alreadyExists ? (
                    <>
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">Você já está na lista</h2>
                      <p className="text-sm sm:text-lg text-muted-foreground">Recebemos seu e‑mail anteriormente — não é necessário enviar novamente.</p>
                    </>
                  ) : (
                    <>
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">Você está na lista!</h2>
                      <p className="text-sm sm:text-lg text-muted-foreground">Em breve enviaremos novidades e o convite para o acesso antecipado ao StorySpark.</p>
                      <div className="mt-3 sm:mt-4 flex flex-wrap justify-start gap-3 sm:gap-4 text-sm sm:text-base text-muted-foreground">
                        <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />Acesso antecipado exclusivo</span>
                        <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />Benefícios para early adopters</span>
                        <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />Conteúdos de bastidores</span>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex justify-center sm:justify-end">
                  <SignupCounter />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="cta" className="py-20 relative overflow-hidden" aria-live="polite">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/10 to-background" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-card/80 backdrop-blur-sm rounded-full mb-6 border border-primary/30">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Últimas vagas do acesso antecipado</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
            Entre para a lista e seja um dos primeiros a criar
            <span className="block bg-gradient-primary bg-clip-text text-transparent">conteúdo que vende com IA</span>
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-3xl mx-auto">
            Acesso antecipado, benefícios exclusivos e bastidores do desenvolvimento.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
            <div className="flex items-center gap-3 text-left">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <span className="text-foreground">Acesso antecipado exclusivo</span>
            </div>
            <div className="flex items-center gap-3 text-left">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
                <span className="text-sm font-bold text-primary">%</span>
              </div>
              <span className="text-foreground">Benefícios para early adopters</span>
            </div>
            <div className="flex items-center gap-3 text-left">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
                <span className="text-sm font-bold text-primary">📘</span>
              </div>
              <span className="text-foreground">Conteúdos de bastidores</span>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex gap-3 p-2 bg-card/80 backdrop-blur-sm rounded-2xl border border-border">
              <Input
                type="email"
                placeholder="Seu melhor e‑mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                name="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                inputMode="email"
                className="flex-1 bg-background/90 border-0 text-foreground placeholder:text-muted-foreground normal-case"
                required
              />
              {/* honeypot hidden field */}
              <input name="hp" type="text" autoComplete="off" tabIndex={-1} aria-hidden className="hidden" />
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-6" disabled={isLoading || !consent || isBlocked}>
                {isLoading ? "Enviando..." : (<><span>Entrar na Lista</span><ArrowRight className="w-4 h-4 ml-2" /></>)}
              </Button>
            </div>
            <label className="flex items-start gap-2 text-xs text-muted-foreground mt-2 justify-center">
              <input type="checkbox" className="mt-1" checked={consent} onChange={e => setConsent(e.target.checked)} />
              <span>Concordo em receber comunicações e com a Política de Privacidade.</span>
            </label>
          </form>
          <div className="mt-6 max-w-3xl mx-auto">
            <ReferralProgram />
          </div>
          <p className="text-muted-foreground text-sm mt-4">🔒 Seus dados estão seguros. Cancelar inscrição a qualquer momento.</p>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;

