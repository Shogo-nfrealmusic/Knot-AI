import SitePageLayout from "@/app/components/SitePageLayout";
import Hero from "@/app/components/Hero";
import LogoBar from "@/app/components/LogoBar";
import AppPreviewSlot from "@/app/components/AppPreviewSlot";
import Manifesto from "@/app/components/Manifesto";
import FeatureGrid from "@/app/components/FeatureGrid";
import ByTheNumbers from "@/app/components/ByTheNumbers";
import ProductionTour from "@/app/components/ProductionTour";
import WhyKnot from "@/app/components/WhyKnot";
import CTA from "@/app/components/CTA";
import { GradientContainer } from "@/app/components/ui/gradient-container";
import { MacbookScroll } from "@/app/components/ui/macbook";
import { GridSection } from "@/app/components/ui/grid-section";

export default function Home() {
  return (
    <SitePageLayout>
      <Hero />
      <LogoBar />
      {/* Every section sits inside the same 1080px rails so the vertical hairlines run unbroken. */}
      <GridSection>
        <AppPreviewSlot />
      </GridSection>
      <Manifesto />
      <GridSection>
        <GradientContainer>
          <FeatureGrid />
        </GradientContainer>
      </GridSection>
      <ByTheNumbers />
      <ProductionTour />
      <GridSection>
        <WhyKnot closingCta={false} />
      </GridSection>
      <GridSection innerClassName="overflow-hidden pb-16">
        <MacbookScroll src="/images/macbook-screen.png" showGradient />
      </GridSection>
      <CTA />
    </SitePageLayout>
  );
}
