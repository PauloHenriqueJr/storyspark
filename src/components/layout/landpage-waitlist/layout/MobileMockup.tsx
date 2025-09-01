import { Smartphone } from "lucide-react";

const MobileMockup = () => {
  return (
    <div className="relative mx-auto w-[280px] h-[580px]">
      {/* Phone frame */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black rounded-[2.5rem] p-2 shadow-2xl">
        {/* Screen */}
        <div className="w-full h-full bg-background rounded-[2rem] overflow-hidden relative">
          {/* Status bar */}
          <div className="flex justify-between items-center px-6 py-3 text-xs text-muted-foreground">
            <span>9:41</span>
            <div className="flex gap-1">
              <div className="w-4 h-2 bg-primary rounded-sm"></div>
              <div className="w-1 h-2 bg-muted-foreground/30 rounded-sm"></div>
              <div className="w-6 h-2 bg-muted-foreground/50 rounded-sm"></div>
            </div>
          </div>

          {/* App header */}
          <div className="px-6 py-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-light rounded-lg flex items-center justify-center">
                <span className="text-xs font-bold text-white">S</span>
              </div>
              <div>
                <h1 className="text-sm font-bold text-foreground">StorySpark</h1>
                <p className="text-xs text-muted-foreground">IA Copy Generator</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* AI Assistant floating button */}
            <div className="relative">
              <div className="absolute -right-2 -top-2 w-12 h-12 bg-gradient-to-r from-primary to-primary-light rounded-full flex items-center justify-center shadow-glow animate-pulse-glow">
                <span className="text-xs font-bold text-white">AI</span>
              </div>
              
              {/* Main dashboard */}
              <div className="bg-card rounded-xl p-4 border border-border/50">
                <h2 className="text-xs font-semibold text-foreground mb-3">Seus Projetos</h2>
                <div className="space-y-2">
                  <div className="h-2 bg-primary/30 rounded w-3/4"></div>
                  <div className="h-2 bg-muted/50 rounded w-1/2"></div>
                  <div className="h-2 bg-muted/50 rounded w-2/3"></div>
                </div>
              </div>
            </div>

            {/* Templates section */}
            <div className="bg-card rounded-xl p-4 border border-border/50">
              <h3 className="text-xs font-semibold text-foreground mb-3">Templates Populares</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg p-2">
                  <div className="h-1.5 bg-blue-400/50 rounded w-full mb-1"></div>
                  <div className="h-1 bg-blue-400/30 rounded w-2/3"></div>
                </div>
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-2">
                  <div className="h-1.5 bg-purple-400/50 rounded w-full mb-1"></div>
                  <div className="h-1 bg-purple-400/30 rounded w-3/4"></div>
                </div>
              </div>
            </div>

            {/* Community section */}
            <div className="bg-card rounded-xl p-4 border border-border/50">
              <h3 className="text-xs font-semibold text-foreground mb-3">Comunidade</h3>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 bg-primary rounded-full"></div>
                <div className="h-1 bg-muted/50 rounded flex-1"></div>
                <span className="text-xs text-primary">❤️ 127</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <div className="h-1 bg-muted/50 rounded flex-1"></div>
                <span className="text-xs text-green-400">❤️ 89</span>
              </div>
            </div>
          </div>

          {/* Bottom navigation */}
          <div className="absolute bottom-0 left-0 right-0 bg-card/80 backdrop-blur-sm border-t border-border/50 p-4">
            <div className="flex justify-around">
              <div className="w-6 h-6 bg-primary/30 rounded"></div>
              <div className="w-6 h-6 bg-muted/30 rounded"></div>
              <div className="w-6 h-6 bg-muted/30 rounded"></div>
              <div className="w-6 h-6 bg-muted/30 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements around phone */}
      <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary/20 rounded-full animate-float" />
      <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-blue-500/20 rounded-full animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 -left-6 w-4 h-4 bg-purple-500/20 rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
    </div>
  );
};

export default MobileMockup;