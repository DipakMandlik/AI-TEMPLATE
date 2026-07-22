import { CtaSection } from "../components/cta-section";
import { FeatureCards } from "../components/feature-cards";
import { Hero } from "../components/hero";
import { WhySection } from "../components/why-section";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <FeatureCards />
      <WhySection />
      <CtaSection />
    </main>
  );
}
