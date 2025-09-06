import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ArrowLeft, Sparkles } from "lucide-react";

export default function Success() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
      <div className="container max-w-2xl mx-auto px-4">
        <Card className="text-center shadow-xl border-2">
          <CardHeader className="space-y-6 pt-8">
            <div className="mx-auto w-20 h-20 bg-gradient-success rounded-full flex items-center justify-center shadow-glow">
              <CheckCircle className="w-10 h-10 text-success-foreground" />
            </div>
            
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold">
                Você entrou na lista!
              </CardTitle>
              <CardDescription className="text-lg">
                Em breve novidades no seu e-mail.
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-8 pb-8">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Parabéns! Você garantiu sua vaga como <strong>Founding Member</strong> da StorySpark.
              </p>
              
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-center gap-2 text-primary font-semibold">
                  <Sparkles className="w-4 h-4" />
                  Benefícios confirmados
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✔ Acesso antecipado ao lançamento</li>
                  <li>✔ 60% OFF vitalício no plano escolhido</li>
                  <li>✔ Suporte prioritário por 6 meses</li>
                  <li>✔ Influência no roadmap do produto</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Próximos passos:</h3>
              <div className="text-sm text-muted-foreground space-y-2 text-left">
                <p>1. Fique de olho no seu e-mail nos próximos 7 dias</p>
                <p>2. Você receberá o link de acesso antecipado</p>
                <p>3. Sua conta já estará criada com o desconto ativo</p>
              </div>
            </div>

            <div className="bg-gradient-success/10 border border-success/20 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-success flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Bônus viral
              </h4>
              <p className="text-sm text-muted-foreground">
                <strong>Compartilhe com um amigo</strong> e ganhe +20 créditos extras no lançamento. 
                Quanto mais amigos, mais créditos!
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  (navigator as any).share?.({
                    title: "StorySpark - Copies que convertem",
                    text: "Descobri essa ferramenta incrível de IA para criar copies que vendem!",
                    url: window.location.origin + "/waitlist"
                  }) || navigator.clipboard.writeText(window.location.origin + "/waitlist");
                }}
                className="w-full"
              >
                Compartilhar e ganhar bônus
              </Button>
            </div>

            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao site
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

