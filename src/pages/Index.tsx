import { Header } from '@/components/layout/landpage/Header';
import { HeroSection } from '@/components/layout/landpage/HeroSection';
import { HowItWorksSection } from '@/components/layout/landpage/HowItWorksSection';
import AdvancedFeatures from '@/components/layout/landpage-waitlist/layout/AdvancedFeatures';
import { PricingSection } from '@/components/layout/landpage/PricingSection';
import { CTASection } from '@/components/layout/landpage/CTASection';
import { Footer } from '@/components/layout/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <HeroSection />
      <HowItWorksSection />
      <AdvancedFeatures />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
