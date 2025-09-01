import Header from "@/components/layout/landpage-waitlist/layout/Header";
import Hero from "@/components/layout/landpage-waitlist/layout/Hero";
import Problems from "@/components/layout/landpage-waitlist/layout/Problems";
import HowItWorks from "@/components/layout/landpage-waitlist/layout/HowItWorks";
import TechSection from "@/components/layout/landpage-waitlist/layout/TechSection";
import Stats from "@/components/layout/landpage-waitlist/layout/Stats";
import Features from "@/components/layout/landpage-waitlist/layout/Features";
import SocialProof from "@/components/layout/landpage-waitlist/layout/SocialProof";
import AdvancedFeatures from "@/components/layout/landpage-waitlist/layout/AdvancedFeatures";
import PricingAndFeedback from "@/components/layout/landpage-waitlist/layout/PricingAndFeedback";
import EmailCapture from "@/components/layout/landpage-waitlist/layout/EmailCapture";
import InteractiveStats from "@/components/layout/landpage-waitlist/layout/InteractiveStats";
import WordCloudSuggestions from "@/components/layout/landpage-waitlist/layout/WordCloudSuggestions";
import FinalCTA from "@/components/layout/landpage-waitlist/layout/FinalCTA";
import NewFooter from "@/components/layout/landpage-waitlist/layout/NewFooter";

const LandingWaitlist = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <Problems />
      <HowItWorks />
      <TechSection />
      <Features />
      <AdvancedFeatures />
      <PricingAndFeedback />
      <EmailCapture />
      <WordCloudSuggestions />
      <FinalCTA />
      <NewFooter />
    </div>
  );
};

export default LandingWaitlist;

