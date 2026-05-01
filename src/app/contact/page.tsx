import type { Metadata } from "next";
import SitePageLayout from "@/app/components/SitePageLayout";
import InnerHero from "@/app/components/InnerHero";
import ContentSection from "@/app/components/ContentSection";
import CTA from "@/app/components/CTA";

export const metadata: Metadata = {
  title: "Contact | Knot",
  description:
    "Book a free AI operations assessment with Knot.",
};

export default function ContactPage() {
  return (
    <SitePageLayout>
      <InnerHero
        title="Contact"
        description="Book a free assessment. Tell us where manual work is slowing your team down, and we will help identify the best place to start."
      />
      <ContentSection>
        <div className="max-w-xl space-y-6">
          <p className="text-[15px] text-text-secondary leading-relaxed">
            The contact form integration is not connected yet. For now, email us
            or reach out through the channels listed in the company profile.
          </p>
          <a
            href="mailto:hello@example.com"
            className="inline-flex items-center gap-2 text-[15px] font-medium text-text-primary border border-border-solid rounded-full px-5 py-2.5 hover:border-white/20 transition-colors"
          >
            Send an email
          </a>
          <p className="text-[13px] text-text-muted">
            Replace this placeholder with the live email address before launch.
          </p>
        </div>
      </ContentSection>
      <CTA />
    </SitePageLayout>
  );
}
