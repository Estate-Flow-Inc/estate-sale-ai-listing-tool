import { EstateFlowBand } from '@/components/landing/EstateFlowBand';
import { EstateFlowHub } from '@/components/landing/EstateFlowHub';
import { Faq } from '@/components/landing/Faq';
import { Hero } from '@/components/landing/Hero';
import { MiddlemanComparison } from '@/components/landing/MiddlemanComparison';
import { SetupSection } from '@/components/landing/SetupSection';
import { TrustPoints } from '@/components/landing/TrustPoints';
import { WalkthroughVideo } from '@/components/landing/WalkthroughVideo';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { ResultsSection } from '@/components/results/ResultsSection';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SetupCard } from '@/components/setup/SetupCard';

export function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero media={<WalkthroughVideo />} />
        <TrustPoints />
        <SetupSection>
          <SetupCard />
        </SetupSection>
        <ResultsSection />
        <MiddlemanComparison />
        <EstateFlowHub />
        <EstateFlowBand />
        <Faq />
      </main>
      <SiteFooter />
    </>
  );
}
