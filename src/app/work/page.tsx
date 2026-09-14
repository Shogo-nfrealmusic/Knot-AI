import type { Metadata } from "next";
import SitePageLayout from "@/app/components/SitePageLayout";
import InnerHero from "@/app/components/InnerHero";
import ProjectTools from "@/app/components/ProjectTools";
import Measured from "@/app/components/Measured";
import NetworkGrowth from "@/app/components/howitworks/NetworkGrowth";
import CTA from "@/app/components/CTA";
import { GridSection } from "@/app/components/ui/grid-section";
import { getProject } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Work | Shogo Kikuchi",
  description:
    "Production systems built and operated by Shogo Kikuchi: a booking platform, a staff operations app, an AI agent, an automated content pipeline, and more.",
};

export default function WorkPage() {
  const brand = getProject("instagram-personal-brand");

  return (
    <SitePageLayout>
      <InnerHero
        title="Work"
        description="Five systems I built and run in production, plus the audience I grew around them. Each one comes with the problem, the build, and the numbers."
      />

      {/* Same 1080px rails as the home page, so the vertical hairlines run through every section. */}
      <GridSection>
        <ProjectTools />
      </GridSection>

      <Measured />

      {brand ? (
        <GridSection className="bg-neutral-50">
          <section className="grid items-center gap-12 px-4 py-20 sm:px-10 md:grid-cols-2 lg:gap-16 lg:py-28">
            <div>
              <p className="font-mono text-[13px] text-warm">
                AUDIENCE
              </p>
              <h2 className="mt-5 type-heading text-text-primary">
                {brand.title}
              </h2>
              <p className="mt-5 text-[22px] font-medium tracking-[-0.02em] text-neutral-500">
                {brand.role}
              </p>
              {brand.sections.slice(0, 2).map((section) => (
                <p
                  key={section.heading}
                  className="mt-6 max-w-xl text-[16px] leading-relaxed tracking-[-0.012em] text-text-secondary"
                >
                  {section.paragraphs?.join(" ")}
                </p>
              ))}
              <div className="mt-10">
                <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-text-muted">
                  {brand.sections[2]?.heading}
                </p>
                <ul className="mt-5 space-y-3 text-[15px] leading-relaxed tracking-[-0.01em] text-text-secondary">
                  {brand.sections[2]?.paragraphs?.map((line) => (
                    <li key={line} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-warm/80" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {brand.links[0] ? (
                <a
                  href={brand.links[0].href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-10 inline-flex h-10 items-center rounded-lg border border-neutral-300 bg-white px-5 text-sm font-medium text-neutral-900 transition-all hover:bg-neutral-50 hover:ring-4 hover:ring-black/5"
                >
                  @imshogo.k on Instagram ↗
                </a>
              ) : null}
            </div>

            <NetworkGrowth />
          </section>
        </GridSection>
      ) : null}

      <CTA />
    </SitePageLayout>
  );
}
