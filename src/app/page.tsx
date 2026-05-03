import SitePageLayout from "@/app/components/SitePageLayout";
import Hero from "@/app/components/Hero";
import AppPreview from "@/app/components/AppPreview";
import FeatureGrid from "@/app/components/FeatureGrid";
import WhyKnot from "@/app/components/WhyKnot";

export default function Home() {
  return (
    <SitePageLayout>
      <Hero />
      <AppPreview />
      <FeatureGrid />
      <WhyKnot />
    </SitePageLayout>
  );
}
