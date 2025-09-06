import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { analytics } from "@/services/analytics";
import { Sparkles, Users, Star, ArrowRight, CheckCircle } from "lucide-react";

const waitlistSchema = z.object({
  email: z.string().email("E-mail inválido"),
  role: z.string().min(1, "Selecione quem você é"),
  channel: z.string().min(1, "Selecione seu canal preferido")
});

type WaitlistForm = z.infer<typeof waitlistSchema>;

export default function WaitlistAB() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<WaitlistForm>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      email: "",
      role: "",
      channel: ""
    }
  });

  const onSubmit = async (data: WaitlistForm) => {
    setIsSubmitting(true);
    try {
      const waitlistData = { ...data, timestamp: new Date().toISOString(), id: crypto.randomUUID() };
      const existingData = JSON.parse(localStorage.getItem('storyspark_waitlist') || '[]');
      existingData.push(waitlistData);
      localStorage.setItem('storyspark_waitlist', JSON.stringify(existingData));

      const webhookUrl = (import.meta as any).env?.VITE_WEBHOOK_URL as string | undefined;
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      }

      analytics.track('waitlist_submitted', { role: data.role, channel: data.channel, variant: 'ab' });

      toast({ title: "Você entrou na lista!", description: "Em breve você receberá novidades sobre a StorySpark." });

      navigate('/success');
    } catch (error) {
      console.error('Erro ao enviar para waitlist:', error);
      toast({ title: "Ops! Algo deu errado", description: "Tente novamente em alguns segundos.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const testimonials = [
    { name: "Maria Silva", role: "Agência Digital", content: "Finalmente uma ferramenta que entende o que precisamos para conversão real." },
    { name: "João Santos", role: "E-commerce", content: "Testei o beta e consegui aumentar 40% no engajamento dos posts." },
    { name: "Ana Costa", role: "Criadora de Conteúdo", content: "StorySpark economiza horas do meu tempo criando copies perfeitas." }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container max-w-4xl mx-auto px-4 py-16 space-y-12">
        <div className="text-center space-y-6">
          <Badge variant="secondary" className="px-6 py-2 text-sm font-medium">
            <Sparkles className="w-4 h-4 mr-2" />
            Apenas 50 vagas com desconto vitalício • Depois, preço cheio
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold text-foreground">
            Copies que <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent font-extrabold">convertem</span> em segundos
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Entre na lista de espera e seja um dos primeiros a usar a StorySpark para gerar conteúdo pronto para Instagram, WhatsApp e e-commerce.
          </p>
        </div>

        <Card className="max-w-md mx-auto shadow-lg border-2">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Entrar na lista de espera</CardTitle>
            <CardDescription>Receba acesso antecipado + desconto vitalício</CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input placeholder="seu@email.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quem é você?</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione sua área" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent
                          position="popper"
                          className="bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
                        >
                          <SelectItem value="agencia">Agência</SelectItem>
                          <SelectItem value="ecommerce">E-commerce</SelectItem>
                          <SelectItem value="criador">Criador de Conteúdo</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="channel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Canal preferido</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Onde você mais posta?" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent
                          position="popper"
                          className="bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
                        >
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="whatsapp">WhatsApp Business</SelectItem>
                          <SelectItem value="linkedin">LinkedIn</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-primary text-primary-foreground font-semibold shadow-glow hover:shadow-xl"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Entrando..." : "Entrar na lista de espera"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-3">
                  Sem spam. Só novidades e acesso antecipado.
                </p>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="text-center space-y-8">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Users className="w-5 h-5" />
            <span className="text-lg font-medium">100+ profissionais já na lista</span>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {testimonials.map((t, i) => (
              <Card key={i} className="text-left">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">"{t.content}"</p>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center space-y-6 pt-8">
          <div className="max-w-2xl mx-auto space-y-4">
            <h3 className="text-2xl font-bold">Não perca sua vaga</h3>
            <p className="text-muted-foreground">Apenas 50 vagas com desconto vitalício. Depois, preço cheio.</p>
            <Button
              size="lg"
              className="bg-gradient-primary text-primary-foreground px-6 py-6 text-base font-semibold shadow-glow hover:shadow-xl"
              onClick={() => document.querySelector('input')?.focus()}
            >
              Entrar na lista de espera
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
