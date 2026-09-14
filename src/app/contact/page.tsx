import type { Metadata } from "next";
import SitePageLayout from "@/app/components/SitePageLayout";
import { GridSection } from "@/app/components/ui/grid-section";
import { site, socialLinks } from "@/lib/site";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Shogo Kikuchi about AI automation and full-stack development work.",
};

const upwork = socialLinks.find((link) => link.label === "Upwork");

function ContactHero() {
  return (
    <GridSection
      className="border-t-0"
      innerClassName="px-4 pb-14 pt-28 sm:px-10 sm:pt-36 lg:pb-20"
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
        <div>
          <div className="mb-7 flex flex-wrap gap-2">
            <span className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-text-secondary">
              Contact
            </span>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-emerald-700">
              AI Automation / Full-Stack
            </span>
          </div>
          <h1 className="max-w-5xl type-display text-text-primary">
            Tell me what you need built.
          </h1>
          <p className="mt-7 max-w-2xl text-[17px] leading-relaxed tracking-[-0.014em] text-text-secondary">
            Share the problem, the tools involved, and what a good outcome looks
            like. I&apos;ll reply with whether I&apos;m a good fit and a clear
            next step.
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white shadow-sm p-5">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-neutral-500">
              Other ways to reach me
            </p>
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <ul className="mt-5 space-y-4 text-[14px] leading-relaxed tracking-[-0.01em]">
            <li>
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-text-muted">
                Email
              </p>
              <a
                href={`mailto:${site.email}`}
                className="mt-1 inline-flex break-all text-text-secondary transition-colors hover:text-text-primary"
              >
                {site.email}
              </a>
            </li>
            {upwork ? (
              <li>
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-text-muted">
                  Hiring through Upwork
                </p>
                <a
                  href={upwork.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex text-text-secondary transition-colors hover:text-text-primary"
                >
                  View my Upwork profile ↗
                </a>
              </li>
            ) : null}
            <li>
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-text-muted">
                Location
              </p>
              <p className="mt-1 text-text-secondary">
                Based in Japan (JST). Working in English and Japanese.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </GridSection>
  );
}

export default function ContactPage() {
  return (
    <SitePageLayout>
      <ContactHero />
      <ContactForm />
    </SitePageLayout>
  );
}
