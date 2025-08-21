import { ModernHeroSection } from '@/components/layout/ModernHeroSection';
import { ModernFeaturesGrid } from '@/components/layout/ModernFeaturesGrid';
import { ModernStatsSection } from '@/components/layout/ModernStatsSection';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const Modern = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <ModernHeroSection />
      <ModernFeaturesGrid />
      <ModernStatsSection />
      <Footer />
    </div>
  );
};

export default Modern;