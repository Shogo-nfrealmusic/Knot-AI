import type { Metadata } from "next";
import JsonLd, { OG_IMAGE_URL, SITE_URL } from "@/app/components/JsonLd";
import { site, socialLinks } from "@/lib/site";
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

const title = "Shogo Kikuchi — AI Automation & Full-Stack Developer";
const description =
  "I build software, run it in a real business, and grow the audience around it. Booking platforms, internal apps, AI agents, and automation pipelines in production.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: { title, description, url: "/", type: "website" },
};

// sameAs takes the real profile links; the mailto entry isn't a profile.
const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: SITE_URL,
  image: OG_IMAGE_URL,
  jobTitle: "AI Automation & Full-Stack Developer",
  worksFor: {
    "@type": "Organization",
    name: "TPS Collective",
    url: "https://www.tps-collective.com/",
  },
  sameAs: socialLinks
    .filter((link) => !link.href.startsWith("mailto:"))
    .map((link) => link.href),
};

const website = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  url: SITE_URL,
  description,
  author: { "@type": "Person", name: site.name, url: SITE_URL },
};

export default function Home() {
  return (
    <SitePageLayout>
      <JsonLd data={[person, website]} />
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
