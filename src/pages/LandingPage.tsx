import { AiHonesty } from '@/components/landing/AiHonesty';
import { EstateFlowBand } from '@/components/landing/EstateFlowBand';
import { Faq } from '@/components/landing/Faq';
import { Hero } from '@/components/landing/Hero';
import { MiddlemanComparison } from '@/components/landing/MiddlemanComparison';
import { SetupSection } from '@/components/landing/SetupSection';
import { TrustPoints } from '@/components/landing/TrustPoints';
import { UseOnYourSale } from '@/components/landing/UseOnYourSale';
import { WalkthroughVideo } from '@/components/landing/WalkthroughVideo';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SetupCard } from '@/components/setup/SetupCard';

export function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero media={<WalkthroughVideo />} />
        <SetupSection>
          <SetupCard />
        </SetupSection>
        <TrustPoints />
        <MiddlemanComparison />
        <AiHonesty />
        <UseOnYourSale />
        <EstateFlowBand />
        <Faq />
      </main>
      <SiteFooter />
    </>
  );
}
