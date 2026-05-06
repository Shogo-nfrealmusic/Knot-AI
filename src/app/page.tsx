import SitePageLayout from "@/app/components/SitePageLayout";
import Hero from "@/app/components/Hero";
import AppPreviewSlot from "@/app/components/AppPreviewSlot";
import FeatureGrid from "@/app/components/FeatureGrid";
import WhyKnot from "@/app/components/WhyKnot";

export default function Home() {
  return (
    <SitePageLayout>
      <Hero />
      <AppPreviewSlot />
      <FeatureGrid />
      <WhyKnot />
    </SitePageLayout>
  );
}
