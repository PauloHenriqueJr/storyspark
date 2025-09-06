import { useState, useRef } from "react";
import SignupCounter from '@/components/layout/landpage-waitlist/SignupCounter';
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUTM } from "@/hooks/useUTM";
import { analytics } from "@/services/analytics";
import { addToWaitlist } from "@/services/waitlistService";
import { Sparkles, Rocket, Crown, Diamond, CheckCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import MobileMockup from "./MobileMockup";

const Hero = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [consent, setConsent] = useState(false);
  const [alreadyExists, setAlreadyExists] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const lastSubmitAt = useRef<number | null>(null);
  const utm = useUTM();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const hp = (form.elements.namedItem('hp') as HTMLInputElement | null)?.value;
    if (hp) return; // honeypot filled -> bot
    if (!email || !consent) return;
    // basic client-side rate limit / debounce to avoid double submits
    const now = Date.now();
    if (lastSubmitAt.current && now - lastSubmitAt.current < 5000) return;
    lastSubmitAt.current = now;
    setIsBlocked(true);
    setTimeout(() => setIsBlocked(false), 5000);
    setIsLoading(true);
    analytics.track("waitlist_submit_attempt", { source: "hero", email_domain: email.split("@")[1], utm });
    const res = await addToWaitlist({ email, consent, utm, variant: "hero" });
    setIsLoading(false);
    if (res.ok) {
      // Diferenciar entre inserção nova e já existente
      const wasAlready = (res as any).info === 'already_exists';
      setAlreadyExists(wasAlready);
      setIsSubmitted(true);
      analytics.track("waitlist_success", { source: "hero", already_exists: wasAlready });
      // Mostrar notificação ao usuário — distinto para novo cadastro vs já existente
      if (wasAlready) {
        try { toast({ title: 'Você já está na lista', description: 'Recebemos seu e‑mail anteriormente.' }); } catch { }
        try { analytics.track('waitlist_already_exists', { source: 'hero' }); } catch { }
      } else {
        try { toast({ title: 'Inscrição confirmada', description: 'Você entrou na lista de espera.' }); } catch { }
        try { analytics.track('waitlist_confirmed', { source: 'hero' }); } catch { }
      }
      setEmail("");
    } else {
      // Não marcar como submetido: informar o usuário do erro e manter o formulário
      analytics.track("waitlist_error", { source: "hero", error: res.error });
      try {
        const key = "storyspark-waitlist-fallback";
        const prev = JSON.parse(localStorage.getItem(key) || "[]");
        prev.push({ email, at: Date.now(), variant: "hero", error: res.error });
        localStorage.setItem(key, JSON.stringify(prev));
      } catch { }
      // Mostrar erro temporário (simples): usar alert para não adicionar dependências
      try {
        // mensurar para o time: use um toast real se disponível
        alert("Houve um problema ao salvar seu e-mail. Por favor, tente novamente.");
      } catch { }
      // manter o formulário aberto para o usuário tentar novamente
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-secondary/30 to-background pt-20 lg:pt-32" aria-live="polite">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl"
          animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div className="absolute top-40 right-20 w-32 h-32 bg-accent/15 rounded-full blur-2xl"
          animate={{ x: [0, -40, 0], y: [0, 30, 0], scale: [1, 0.8, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div className="absolute bottom-32 left-1/4 w-24 h-24 bg-primary/10 rounded-full blur-xl"
          animate={{ x: [0, 20, 0], y: [0, -15, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,107,53,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,107,53,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="text-center lg:text-left">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-8">
              <Crown className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Líder em IA de Marketing</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6">
              Crie conteúdo que vende
              <span className="block text-primary">com a velocidade da sua ideia</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Defina o tom da sua marca, gere rascunhos que já nascem alinhados e publique em minutos — sem começar do zero.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }} className="mb-8">
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.form key="form" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }} onSubmit={handleSubmit}
                    className="w-full max-w-xl mx-auto lg:mx-0">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <Input type="email" placeholder="seu.email@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)}
                          name="email" autoCapitalize="none" autoCorrect="off" spellCheck={false} inputMode="email"
                          className="h-12 text-base border-2 border-primary/20 focus:border-primary bg-background/60 normal-case" required />
                      </div>
                      {/* honeypot hidden field */}
                      <input name="hp" type="text" autoComplete="off" tabIndex={-1} aria-hidden className="hidden" />
                      <Button type="submit" disabled={isLoading || !consent || isBlocked}
                        className="h-12 px-8 text-base font-semibold bg-primary hover:bg-primary/90 hover:shadow-xl transition-all duration-300 disabled:opacity-60">
                        <Rocket className="w-5 h-5 mr-2" />{isLoading ? "Enviando..." : "Entrar na Lista"}
                      </Button>
                    </div>
                    <label className="flex items-start gap-2 text-xs text-muted-foreground mt-3">
                      <input type="checkbox" className="mt-1" checked={consent} onChange={e => setConsent(e.target.checked)} />
                      <span>Concordo em receber comunicações e com a Política de Privacidade.</span>
                    </label>
                  </motion.form>
                ) : (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="text-center p-6 sm:p-8 md:p-10 bg-primary/10 rounded-xl border border-primary/20 max-w-sm sm:max-w-md md:max-w-lg lg:max-w-md mx-auto lg:mx-0">
                    <Diamond className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                      <div>
                        {alreadyExists ? (
                          <>
                            <h3 className="text-base md:text-lg font-semibold text-primary mb-1">Você já está na lista</h3>
                            <p className="text-sm md:text-base text-muted-foreground">Recebemos seu e-mail anteriormente — não é necessário enviar de novo.</p>
                            <div className="mt-4">
                              <Button onClick={() => { setIsSubmitted(false); setAlreadyExists(false); }} className="px-4">Fechar</Button>
                            </div>
                          </>
                        ) : (
                          <>
                            <h3 className="text-base md:text-lg font-semibold text-primary mb-1">Você está na lista!</h3>
                            <p className="text-sm md:text-base text-muted-foreground">Em breve enviaremos novidades e convite para o acesso antecipado.</p>
                            <div className="mt-4 flex flex-wrap justify-start gap-3 md:gap-4 text-sm md:text-base text-muted-foreground">
                              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-primary" />Templates exclusivos</span>
                              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-primary" />Acesso antecipado</span>
                              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-primary" />Comunidade VIP</span>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="flex justify-center sm:justify-end">
                        <SignupCounter />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.9 }}
              className="flex items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Acesso antecipado à convites por e-mail</span>
              </div>
            </motion.div>
            <div className="mt-8 lg:mt-12">
              <div className="max-w-3xl mx-auto lg:mx-0">
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="relative flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/30 to-primary/20 rounded-3xl blur-3xl scale-110" />
              <motion.div className="relative z-10" animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                <MobileMockup />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
