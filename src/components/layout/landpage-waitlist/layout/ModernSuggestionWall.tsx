import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Plus, Lightbulb, Users, Zap, Target, TrendingUp, Sparkles } from "lucide-react";

interface Suggestion {
  id: string;
  text: string;
  likes: number;
  category: string;
  isLiked: boolean;
}

const mockSuggestions: Suggestion[] = [
  { id: "1", text: "Bot flutuante com IA no dashboard", likes: 241, category: "IA", isLiked: false },
  { id: "2", text: "Templates de Stories para Instagram", likes: 189, category: "Templates", isLiked: false },
  { id: "3", text: "Integração com Google Ads", likes: 167, category: "Tráfego Pago", isLiked: true },
  { id: "4", text: "Geração de legendas para vídeos", likes: 134, category: "IA", isLiked: false },
  { id: "5", text: "Brand voice personalizada", likes: 128, category: "Personalização", isLiked: true },
  { id: "6", text: "Comunidade para trocar templates", likes: 112, category: "Comunidade", isLiked: false },
  { id: "7", text: "Integração com WhatsApp Business", likes: 98, category: "Integração", isLiked: false },
  { id: "8", text: "Analytics de performance em tempo real", likes: 87, category: "Analytics", isLiked: true },
  { id: "9", text: "Agentes especializados por nicho", likes: 76, category: "IA", isLiked: false },
  { id: "10", text: "Templates para LinkedIn", likes: 63, category: "Templates", isLiked: false },
];

const categoryStyles = {
  "IA": { icon: <Lightbulb className="w-4 h-4" />, gradient: "from-blue-500 to-cyan-500", bg: "bg-blue-500/10", text: "text-blue-400" },
  "Templates": { icon: <Target className="w-4 h-4" />, gradient: "from-purple-500 to-pink-500", bg: "bg-purple-500/10", text: "text-purple-400" },
  "Tráfego Pago": { icon: <TrendingUp className="w-4 h-4" />, gradient: "from-green-500 to-emerald-500", bg: "bg-green-500/10", text: "text-green-400" },
  "Integração": { icon: <Zap className="w-4 h-4" />, gradient: "from-yellow-500 to-orange-500", bg: "bg-yellow-500/10", text: "text-yellow-400" },
  "Comunidade": { icon: <Users className="w-4 h-4" />, gradient: "from-pink-500 to-rose-500", bg: "bg-pink-500/10", text: "text-pink-400" },
  "Personalização": { icon: <Sparkles className="w-4 h-4" />, gradient: "from-indigo-500 to-purple-500", bg: "bg-indigo-500/10", text: "text-indigo-400" },
  "Analytics": { icon: <Target className="w-4 h-4" />, gradient: "from-red-500 to-pink-500", bg: "bg-red-500/10", text: "text-red-400" },
  "Nova Ideia": { icon: <Sparkles className="w-4 h-4" />, gradient: "from-orange-500 to-red-500", bg: "bg-orange-500/10", text: "text-orange-400" },
};

const ModernSuggestionWall = () => {
  const [suggestions, setSuggestions] = useState(mockSuggestions);
  const [newSuggestion, setNewSuggestion] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const handleLike = (id: string) => {
    setSuggestions(prev => 
      prev.map(suggestion => 
        suggestion.id === id 
          ? { 
              ...suggestion, 
              likes: suggestion.isLiked ? suggestion.likes - 1 : suggestion.likes + 1,
              isLiked: !suggestion.isLiked 
            }
          : suggestion
      )
    );
  };

  const handleAddSuggestion = () => {
    if (newSuggestion.trim()) {
      const newId = (suggestions.length + 1).toString();
      setSuggestions(prev => [...prev, {
        id: newId,
        text: newSuggestion,
        likes: 1,
        category: "Nova Ideia",
        isLiked: true
      }]);
      setNewSuggestion("");
      setShowAddForm(false);
    }
  };

  const sortedSuggestions = [...suggestions].sort((a, b) => b.likes - a.likes);

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-6 relative">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Construindo juntos o futuro
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Mural de Ideias
            </h2>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Vote nas funcionalidades que mais precisa e compartilhe suas ideias para moldar a StorySpark
            </p>
            
            <Button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-gradient-to-r from-primary to-primary-light text-primary-foreground hover:shadow-glow transition-all duration-300 hover:scale-105"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Compartilhar Ideia
            </Button>
          </div>

          {/* Add suggestion form */}
          {showAddForm && (
            <div className="mb-12 animate-fade-in">
              <div className="glass-effect rounded-3xl p-8 border border-primary/20">
                <h3 className="text-2xl font-bold mb-6 text-foreground">
                  Qual funcionalidade você mais precisa?
                </h3>
                <div className="flex flex-col md:flex-row gap-4">
                  <Textarea
                    placeholder="Descreva sua ideia... Ex: Integração com TikTok Ads, Templates animados para Stories..."
                    value={newSuggestion}
                    onChange={(e) => setNewSuggestion(e.target.value)}
                    className="flex-1 min-h-[100px] bg-background/50 border-border/50 focus:border-primary/50"
                  />
                  <div className="flex md:flex-col gap-3">
                    <Button 
                      onClick={handleAddSuggestion} 
                      className="bg-gradient-to-r from-primary to-primary-light text-primary-foreground hover:shadow-glow"
                    >
                      Enviar
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAddForm(false)}
                      className="border-border/50 hover:border-primary/30"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Top 3 highlight */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-center mb-8 text-foreground">
              🔥 Mais Pedidas
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {sortedSuggestions.slice(0, 3).map((suggestion, index) => {
                const categoryStyle = categoryStyles[suggestion.category as keyof typeof categoryStyles];
                return (
                  <div 
                    key={suggestion.id}
                    className="group relative glass-effect rounded-2xl p-6 border border-primary/30 hover:border-primary/50 transition-all duration-300 hover:shadow-glow"
                  >
                    {/* Rank badge */}
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-primary to-primary-light rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm shadow-glow">
                      {index + 1}
                    </div>

                    {/* Category */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className={`w-8 h-8 rounded-lg ${categoryStyle.bg} flex items-center justify-center ${categoryStyle.text}`}>
                        {categoryStyle.icon}
                      </div>
                      <span className={`text-sm font-medium ${categoryStyle.text}`}>
                        {suggestion.category}
                      </span>
                    </div>

                    {/* Text */}
                    <p className="text-foreground font-medium mb-6 text-lg leading-relaxed">
                      {suggestion.text}
                    </p>

                    {/* Like button */}
                    <button
                      onClick={() => handleLike(suggestion.id)}
                      className={`w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                        suggestion.isLiked
                          ? 'bg-gradient-to-r from-primary/20 to-primary-light/20 text-primary border border-primary/30 shadow-soft'
                          : 'bg-muted/30 text-muted-foreground hover:bg-primary/10 hover:text-primary border border-border/30 hover:border-primary/30'
                      }`}
                    >
                      <Heart 
                        className={`w-5 h-5 transition-all duration-300 ${
                          suggestion.isLiked ? 'fill-current scale-110' : ''
                        }`} 
                      />
                      <span className="text-lg font-bold">{suggestion.likes}</span>
                      <span>votes</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* All suggestions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedSuggestions.slice(3).map((suggestion) => {
              const categoryStyle = categoryStyles[suggestion.category as keyof typeof categoryStyles];
              return (
                <div 
                  key={suggestion.id}
                  className="glass-effect rounded-xl p-6 border border-border/30 hover:border-primary/30 transition-all duration-300 hover:shadow-soft group"
                >
                  {/* Category */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-6 h-6 rounded-md ${categoryStyle.bg} flex items-center justify-center ${categoryStyle.text}`}>
                      {categoryStyle.icon}
                    </div>
                    <span className={`text-xs font-medium ${categoryStyle.text}`}>
                      {suggestion.category}
                    </span>
                  </div>

                  {/* Text */}
                  <p className="text-foreground font-medium mb-4 leading-relaxed">
                    {suggestion.text}
                  </p>

                  {/* Like button */}
                  <button
                    onClick={() => handleLike(suggestion.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      suggestion.isLiked
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : 'bg-muted/30 text-muted-foreground hover:bg-primary/10 hover:text-primary border border-border/30'
                    }`}
                  >
                    <Heart 
                      className={`w-4 h-4 ${suggestion.isLiked ? 'fill-current' : ''}`} 
                    />
                    <span className="font-medium">{suggestion.likes}</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-8 bg-card/50 backdrop-blur-sm px-8 py-4 rounded-2xl border border-border/30">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{suggestions.length}</div>
                <div className="text-sm text-muted-foreground">Ideias</div>
              </div>
              <div className="w-px h-8 bg-border/50" />
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {suggestions.reduce((total, s) => total + s.likes, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Votes</div>
              </div>
              <div className="w-px h-8 bg-border/50" />
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">2.8k+</div>
                <div className="text-sm text-muted-foreground">Pessoas</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModernSuggestionWall;