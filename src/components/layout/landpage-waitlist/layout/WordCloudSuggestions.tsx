import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Sparkles, TrendingUp, Move } from "lucide-react";
import { fetchSuggestions, addSuggestion, toggleVote } from "@/services/suggestionService";
import { analytics } from "@/services/analytics";

interface WordItem {
  id: string;
  text: string;
  votes: number;
  size: number;
  color: string;
  position: { x: number; y: number };
  isVoted: boolean;
  isDragging?: boolean;
}

const initialWords: WordItem[] = [
  { id: "1", text: "Bot flutuante com IA", votes: 241, size: 2.5, color: "text-primary", position: { x: 20, y: 20 }, isVoted: false },
  { id: "2", text: "Templates Instagram", votes: 189, size: 2.2, color: "text-accent-foreground", position: { x: 60, y: 15 }, isVoted: false },
  { id: "3", text: "Google Ads", votes: 167, size: 2.0, color: "text-primary", position: { x: 15, y: 50 }, isVoted: true },
  { id: "4", text: "Geração legendas", votes: 134, size: 1.8, color: "text-foreground", position: { x: 70, y: 45 }, isVoted: false },
  { id: "5", text: "Brand voice", votes: 128, size: 1.7, color: "text-primary", position: { x: 35, y: 35 }, isVoted: true },
  { id: "6", text: "WhatsApp Business", votes: 98, size: 1.5, color: "text-muted-foreground", position: { x: 25, y: 70 }, isVoted: false },
  { id: "7", text: "Analytics tempo real", votes: 87, size: 1.4, color: "text-primary", position: { x: 55, y: 65 }, isVoted: true },
  { id: "8", text: "Templates LinkedIn", votes: 63, size: 1.2, color: "text-accent-foreground", position: { x: 40, y: 80 }, isVoted: false },
  { id: "9", text: "Agentes especializados", votes: 76, size: 1.3, color: "text-foreground", position: { x: 75, y: 25 }, isVoted: false },
  { id: "10", text: "Comunidade templates", votes: 112, size: 1.6, color: "text-primary", position: { x: 10, y: 85 }, isVoted: false },
];

const colors = [
  "text-primary", "text-accent-foreground", "text-foreground", "text-muted-foreground"
];

const WordCloudSuggestions = () => {
  const [words, setWords] = useState<WordItem[]>(initialWords);
  const [newWord, setNewWord] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);
  const [draggedWord, setDraggedWord] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  const loadSuggestions = async () => {
    setLoading(true);
    try {
      const list = await fetchSuggestions();
      // Map to WordItem with random positions/colors
      const mapped: WordItem[] = list.map(item => {
        const color = colors[Math.floor(Math.random() * colors.length)];
        return {
          id: item.id,
          text: item.text,
          votes: item.likes,
          size: 1.5,
          color,
          position: getRandomPosition(),
          isVoted: item.isLiked,
        };
      });
      const maxVotes = Math.max(1, ...mapped.map(w => w.votes));
      mapped.forEach(w => { w.size = 1 + (w.votes / maxVotes) * (3 - 1); });
      setWords(mapped);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSuggestions(); }, []);

  const calculateSize = (votes: number) => {
    const maxVotes = Math.max(...words.map(w => w.votes));
    const minSize = 1.0;
    const maxSize = 3.0;
    return minSize + (votes / maxVotes) * (maxSize - minSize);
  };

  const getRandomPosition = () => {
    const margin = 10;
    return {
      x: margin + Math.random() * (90 - 2 * margin),
      y: margin + Math.random() * (90 - 2 * margin)
    };
  };

  const handleVote = async (id: string) => {
    try {
      const res = await toggleVote(id);
      analytics.track('vote_cast', { suggestion_id: id, result: res });
      setWords(prev => prev.map(word => {
        if (word.id === id) {
          const newVotes = res === 'liked' ? word.votes + 1 : Math.max(0, word.votes - 1);
          const newSize = calculateSize(newVotes);
          return { ...word, votes: newVotes, size: newSize, isVoted: res === 'liked' };
        }
        return word;
      }));
    } catch (e) {
      alert('Falha ao registrar voto.');
    }
  };

  const handleAddWord = async () => {
    const text = newWord.trim();
    if (!text) return;
    try {
      setLoading(true);
      await addSuggestion(text);
      analytics.track('suggestion_add', { text_length: text.length });
      setNewWord("");
      setShowAddForm(false);
      await loadSuggestions();
    } catch {
      alert('Falha ao enviar sugestão.');
    } finally {
      setLoading(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    if (e.button === 0) { // Left click only
      setDraggedWord(id);
      setWords(prev => prev.map(word => 
        word.id === id ? { ...word, isDragging: true } : word
      ));
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedWord && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      // Keep within bounds
      const boundedX = Math.max(5, Math.min(95, x));
      const boundedY = Math.max(5, Math.min(95, y));
      
      setWords(prev => prev.map(word => 
        word.id === draggedWord 
          ? { ...word, position: { x: boundedX, y: boundedY } }
          : word
      ));
    }
  };

  const handleMouseUp = () => {
    if (draggedWord) {
      setWords(prev => prev.map(word => 
        word.id === draggedWord ? { ...word, isDragging: false } : word
      ));
      setDraggedWord(null);
    }
  };

  const totalVotes = words.reduce((sum, word) => sum + word.votes, 0);
  const totalWords = words.length;

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-6 relative">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Vamos construir juntos
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Funcionalidades Mais Desejadas
            </h2>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Vote nas funcionalidades que você mais precisa. Arraste as palavras, clique para votar e adicione suas ideias. As mais votadas serão desenvolvidas primeiro!
            </p>
            
            <Button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-gradient-to-r from-primary to-primary-light text-primary-foreground hover:shadow-glow transition-all duration-300 hover:scale-105"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Adicionar Ideia
            </Button>
          </div>

          {/* Add word form */}
          {showAddForm && (
            <div className="mb-12 animate-fade-in">
              <div className="glass-effect rounded-3xl p-8 border border-primary/20 max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold mb-6 text-foreground text-center">
                  Que funcionalidade você mais precisa?
                </h3>
                <div className="flex flex-col md:flex-row gap-4">
                  <Textarea
                    placeholder="Ex: Integração com TikTok, Templates animados, Análise de sentimentos..."
                    value={newWord}
                    onChange={(e) => setNewWord(e.target.value)}
                    className="flex-1 min-h-[80px] bg-background/50 border-border/50 focus:border-primary/50"
                    maxLength={50}
                  />
                  <div className="flex md:flex-col gap-3">
                    <Button 
                      onClick={handleAddWord} 
                      className="bg-gradient-to-r from-primary to-primary-light text-primary-foreground hover:shadow-glow"
                      disabled={!newWord.trim()}
                    >
                      Adicionar
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

          {/* Word Cloud */}
          <div className="relative">
            <div className="glass-effect-dark rounded-3xl p-12 border border-primary/20 min-h-[500px] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-3xl" />
              
              {/* Interactive word cloud */}
              <div 
                ref={containerRef}
                className="relative h-[400px] w-full cursor-crosshair"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {words.map((word) => (
                  <div
                    key={word.id}
                    onMouseDown={(e) => handleMouseDown(e, word.id)}
                    onMouseEnter={() => setHoveredWord(word.id)}
                    onMouseLeave={() => setHoveredWord(null)}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-110 cursor-grab group ${word.color} font-bold whitespace-nowrap select-none ${word.isDragging ? 'cursor-grabbing z-50' : ''}`}
                    style={{
                      left: `${word.position.x}%`,
                      top: `${word.position.y}%`,
                      fontSize: `${word.size}rem`,
                      textShadow: word.isVoted ? `0 0 20px hsl(var(--primary) / 0.6)` : 'none',
                      filter: hoveredWord === word.id ? 'brightness(1.5)' : 'brightness(1)',
                    }}
                  >
                    <button
                      onClick={() => handleVote(word.id)}
                      className="relative z-10 hover:text-primary transition-colors"
                    >
                      {word.text}
                    </button>
                    
                    {/* Drag indicator */}
                    <div className={`absolute -top-1 -left-1 text-xs text-muted-foreground transition-opacity ${
                      hoveredWord === word.id ? 'opacity-100' : 'opacity-0'
                    }`}>
                      <Move className="w-3 h-3" />
                    </div>
                    
                    {/* Vote counter */}
                    <div className={`absolute -top-2 -right-2 bg-card/90 text-primary text-xs px-2 py-1 rounded-full font-medium border border-primary/20 transition-all duration-200 ${
                      hoveredWord === word.id ? 'opacity-100 scale-110' : 'opacity-0 scale-90'
                    }`}>
                      {word.votes}
                    </div>
                    
                    {/* Hover glow effect */}
                    {hoveredWord === word.id && (
                      <div className="absolute inset-0 bg-primary/10 rounded-lg blur-sm scale-150" />
                    )}
                  </div>
                ))}
              </div>

              {/* Instructions */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <p className="text-sm text-muted-foreground text-center bg-card/90 px-4 py-2 rounded-full border border-border/30">
                  Arraste para mover • Clique para votar • Palavras mais votadas ficam maiores
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-8 bg-card/50 backdrop-blur-sm px-8 py-4 rounded-2xl border border-border/30">
              <div className="text-center">
                <div className="flex items-center gap-2 text-2xl font-bold text-primary">
                  <TrendingUp className="w-5 h-5" />
                  {totalWords}
                </div>
                <div className="text-sm text-muted-foreground">Ideias</div>
              </div>
              <div className="w-px h-8 bg-border/50" />
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{totalVotes}</div>
                <div className="text-sm text-muted-foreground">Votos</div>
              </div>
              <div className="w-px h-8 bg-border/50" />
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {Math.round(totalVotes / totalWords)}
                </div>
                <div className="text-sm text-muted-foreground">Média</div>
              </div>
            </div>
          </div>

          {/* Top voted words */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-center mb-8 text-foreground">
              🔥 Mais Votadas
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {words
                .sort((a, b) => b.votes - a.votes)
                .slice(0, 5)
                .map((word, index) => (
                  <div 
                    key={word.id}
                    className="flex items-center gap-3 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border/30"
                  >
                    <span className="w-6 h-6 bg-primary/20 text-primary text-sm font-bold rounded-full flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className={`font-medium ${word.color}`}>{word.text}</span>
                    <span className="text-sm text-muted-foreground">{word.votes} votos</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WordCloudSuggestions;
