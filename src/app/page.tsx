import SitePageLayout from "@/app/components/SitePageLayout";
import Hero from "@/app/components/Hero";
import AppPreview from "@/app/components/AppPreview";
import LogoBar from "@/app/components/LogoBar";
import Statement from "@/app/components/Statement";
import FeatureGrid from "@/app/components/FeatureGrid";
import FeatureSections from "@/app/components/FeatureSections";
import CTA from "@/app/components/CTA";

export default function Home() {
  return (
    <SitePageLayout>
      <Hero />
      <AppPreview />
      <LogoBar />
      <Statement />
      <FeatureGrid />
      <FeatureSections />
      <CTA />
    </SitePageLayout>
  );
}
