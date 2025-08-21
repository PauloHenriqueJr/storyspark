import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/layout/HeroSection';
import { LogoCloud } from '@/components/layout/LogoCloud';
import { ProblemsSection } from '@/components/layout/ProblemsSection';
import { HowItWorksSection } from '@/components/layout/HowItWorksSection';
import { FeaturesSection } from '@/components/layout/FeaturesSection';
import { PricingSection } from '@/components/layout/PricingSection';
import { TestimonialsSection } from '@/components/layout/TestimonialsSection';
import { CTASection } from '@/components/layout/CTASection';
import { Footer } from '@/components/layout/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <LogoCloud />
      <ProblemsSection />
      <HowItWorksSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
