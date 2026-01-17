import { SkipLink } from "@/components/layout/SkipLink";
import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/sections/HeroSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { SocialProof } from "@/components/sections/SocialProof";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Features } from "@/components/sections/Features";
import { ChallengeCategories } from "@/components/sections/ChallengeCategories";
import { Gamification } from "@/components/sections/Gamification";
import { Testimonials } from "@/components/sections/Testimonials";
import { Pricing } from "@/components/sections/Pricing";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { FAQ } from "@/components/sections/FAQ";
import { Footer } from "@/components/sections/Footer";

/**
 * Landing Page Compila.dev
 *
 * Estrutura de seções:
 * 1. Hero Section
 * 2. Social Proof
 * 3. Como Funciona
 * 4. Features Principais
 * 5. Categorias de Desafios
 * 6. Gamificação
 * 7. Depoimentos
 * 8. Pricing
 * 9. CTA Final
 * 10. FAQ
 * 11. Footer
 */
export default function HomePage() {
  return (
    <>
      <SkipLink />
      <Header />

      <main id="main-content">
        <HeroSection />
        <StatsSection />
        <SocialProof />
        <HowItWorks />
        <Features />
        <ChallengeCategories />
        <Gamification />
        <Testimonials />
        <Pricing />
        <FinalCTA />
        <FAQ />
      </main>

      <Footer />
    </>
  );
}
