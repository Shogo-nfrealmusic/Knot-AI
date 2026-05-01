import type { Metadata } from "next";
import SitePageLayout from "@/app/components/SitePageLayout";
import InnerHero from "@/app/components/InnerHero";
import ContentSection from "@/app/components/ContentSection";
import CTA from "@/app/components/CTA";

export const metadata: Metadata = {
  title: "FAQ | Knot",
  description:
    "Answers to common questions about Knot's AI operations assessment, implementation, and advisory services.",
};

const faqs = [
  {
    q: "Can we start if we are still early in our AI roadmap?",
    a: "Yes. The assessment is designed to clarify where AI can create practical leverage before anything is built.",
  },
  {
    q: "Do you only advise, or do you also build?",
    a: "We build. Knot designs and implements production-ready Skills, agents, integrations, and operating documentation.",
  },
  {
    q: "Which companies are a good fit?",
    a: "Mid-sized companies, typically 200 to 2,000 employees, with documented workflows slowed down by manual effort.",
  },
];

export default function FaqPage() {
  return (
    <SitePageLayout>
      <InnerHero
        title="FAQ"
        description="Questions about scope, timing, or fit? Book a free assessment and we will help you decide the right starting point."
      />
      <ContentSection>
        <div className="space-y-8 max-w-2xl">
          {faqs.map((item) => (
            <div key={item.q} className="border-b border-border pb-8 last:border-0 last:pb-0">
              <h2 className="text-[15px] font-semibold text-[#d0d6e0] tracking-[-0.01em] mb-2">
                <span className="text-text-muted font-mono text-[12px] mr-2">Q</span>
                {item.q}
              </h2>
              <p className="text-[15px] text-text-secondary leading-relaxed pl-0 sm:pl-6">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </ContentSection>
      <CTA />
    </SitePageLayout>
  );
}
