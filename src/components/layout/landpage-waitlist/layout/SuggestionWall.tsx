import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Plus, Lightbulb, Users, Zap, Target } from "lucide-react";
import { fetchSuggestions, addSuggestion, toggleVote, type SuggestionItem } from "@/services/suggestionService";
import { analytics } from "@/services/analytics";

interface Suggestion {
  id: string;
  text: string;
  likes: number;
  category: string;
  isLiked: boolean;
}

const mockSuggestions: Suggestion[] = [
  { id: "1", text: "Templates de Stories para Instagram", likes: 127, category: "Templates", isLiked: false },
  { id: "2", text: "Integração com WhatsApp Business", likes: 89, category: "Integração", isLiked: true },
  { id: "3", text: "Geração de legendas para vídeos", likes: 156, category: "IA", isLiked: false },
  { id: "4", text: "Analytics de performance em tempo real", likes: 73, category: "Analytics", isLiked: false },
  { id: "5", text: "Comunidade para trocar templates", likes: 94, category: "Comunidade", isLiked: true },
  { id: "6", text: "Bot flutuante com IA no dashboard", likes: 201, category: "IA", isLiked: false },
  { id: "7", text: "Brand voice personalizada", likes: 112, category: "Personalização", isLiked: false },
  { id: "8", text: "Agentes especializados por nicho", likes: 67, category: "IA", isLiked: false },
  { id: "9", text: "Integração com Google Ads", likes: 145, category: "Tráfego Pago", isLiked: true },
  { id: "10", text: "Templates para LinkedIn", likes: 82, category: "Templates", isLiked: false },
];

const categoryIcons = {
  "Templates": <Target className="w-4 h-4" />,
  "IA": <Lightbulb className="w-4 h-4" />,
  "Integração": <Zap className="w-4 h-4" />,
  "Analytics": <Target className="w-4 h-4" />,
  "Comunidade": <Users className="w-4 h-4" />,
  "Personalização": <Heart className="w-4 h-4" />,
  "Tráfego Pago": <Target className="w-4 h-4" />,
};


const SuggestionWall = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>(mockSuggestions);
  const [newSuggestion, setNewSuggestion] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const list = await fetchSuggestions();
    setSuggestions(list);
  };

  useEffect(() => { load(); }, []);

  const handleLike = async (id: string) => {
    try {
      const res = await toggleVote(id);
      analytics.track('vote_cast', { suggestion_id: id, result: res });
      setSuggestions(prev => prev.map(s => s.id === id ? {
        ...s,
        likes: res === 'liked' ? s.likes + 1 : Math.max(0, s.likes - 1),
        isLiked: res === 'liked'
      } : s));
    } catch {
      alert('Falha ao registrar voto.');
    }
  };

  const handleAddSuggestion = async () => {
    const text = newSuggestion.trim();
    if (!text) return;
    try {
      setLoading(true);
      await addSuggestion(text);
      analytics.track('suggestion_add', { text_length: text.length });
      setNewSuggestion("");
      setShowAddForm(false);
      await load();
    } catch {
      alert('Falha ao enviar sugestão.');
    } finally {
      setLoading(false);
    }
  };

  const sortedSuggestions = [...suggestions].sort((a, b) => b.likes - a.likes);

  return (
    <section id="ideias" className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Mural de
              <span className="block text-primary">Sugestões</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Veja o que a comunidade mais deseja e adicione sua sugestão
            </p>
            
            <Button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Adicionar Sugestão
            </Button>
          </div>

          {/* Add suggestion form */}
          {showAddForm && (
            <div className="card-gradient rounded-2xl p-8 border border-border/50 mb-8">
              <h3 className="text-xl font-semibold mb-4 text-foreground">
                Qual funcionalidade você gostaria de ver?
              </h3>
              <div className="flex gap-4">
                <Textarea
                  placeholder="Ex: Templates para TikTok, Integração com Facebook Ads..."
                  value={newSuggestion}
                  onChange={(e) => setNewSuggestion(e.target.value)}
                  className="flex-1"
                />
                <div className="flex flex-col gap-2">
                  <Button onClick={handleAddSuggestion} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Enviar
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Suggestions grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedSuggestions.map((suggestion, index) => (
              <div 
                key={suggestion.id}
                className={`card-gradient rounded-xl p-6 border transition-all duration-300 hover:shadow-soft ${
                  index < 3 
                    ? 'border-primary/50 shadow-soft ring-1 ring-primary/20' 
                    : 'border-border/50 hover:border-primary/30'
                }`}
              >
                {/* Top badge for popular suggestions */}
                {index < 3 && (
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-primary/20 text-primary text-xs px-3 py-1 rounded-full font-medium">
                      Top {index + 1}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Mais pedida
                    </span>
                  </div>
                )}

                {/* Category */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                    {categoryIcons[suggestion.category as keyof typeof categoryIcons] || <Lightbulb className="w-4 h-4" />}
                  </div>
                  <span className="text-sm text-muted-foreground">{suggestion.category}</span>
                </div>

                {/* Suggestion text */}
                <p className="text-foreground font-medium mb-4 leading-relaxed">
                  {suggestion.text}
                </p>

                {/* Like button */}
                <button
                  onClick={() => handleLike(suggestion.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    suggestion.isLiked
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary border border-border/50'
                  }`}
                >
                  <Heart 
                    className={`w-4 h-4 ${suggestion.isLiked ? 'fill-current' : ''}`} 
                  />
                  <span className="font-medium">{suggestion.likes}</span>
                  <span className="text-sm">amei</span>
                </button>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12 p-8 card-gradient rounded-2xl border border-border/50">
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              Sua ideia não está aqui?
            </h3>
            <p className="text-muted-foreground mb-6">
              Compartilhe sua sugestão e ajude a moldar o futuro da StorySpark
            </p>
            <Button 
              onClick={() => setShowAddForm(true)}
              variant="outline"
              size="lg"
              className="border-primary/30 text-primary hover:bg-primary/10"
            >
              <Plus className="w-5 h-5 mr-2" />
              Adicionar Nova Sugestão
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuggestionWall;
