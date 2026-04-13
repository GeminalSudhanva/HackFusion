import { useEffect } from "react";
import { HeroSection } from "@/components/ui/hero-odyssey";
import { HighlightStrip, About, Domains, PrizeSection, Timeline, WhyJoin, CollegePreview, FinalCTA } from "@/components/Sections";

export default function LandingPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-background overflow-x-hidden selection:bg-primary/30">
      <HeroSection />
      <HighlightStrip />
      <About />
      <Domains />
      <PrizeSection />
      <Timeline />
      <WhyJoin />
      <CollegePreview />
      <FinalCTA />
    </main>
  );
}
