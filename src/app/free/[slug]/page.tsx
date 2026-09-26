import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";
import SitePageLayout from "@/app/components/SitePageLayout";
import InnerHero from "@/app/components/InnerHero";
import { GridSection } from "@/app/components/ui/grid-section";
import { FollowBlock, ToolRow } from "@/app/free/FreeParts";
import { GuideSignup } from "@/app/free/GuideSignup";
import { formatDropDate, getDrop, getDropByNumber, getDrops, pad } from "@/lib/free";

export const dynamicParams = false;

// Full slugs, plus the short number form (/free/02) that redirects to them.
export function generateStaticParams() {
  return getDrops().flatMap((drop) => [{ slug: drop.slug }, { slug: pad(drop.number) }]);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const drop = getDrop(slug);
  if (!drop) return {};
  const path = `/free/${drop.slug}`;
  const title = `${drop.title} | Shogo Kikuchi`;
  return {
    title,
    description: drop.description,
    alternates: { canonical: path },
    openGraph: { title: drop.title, description: drop.description, url: path, type: "website" },
  };
}

export default async function FreeDropPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const short = getDropByNumber(slug);
  if (short) permanentRedirect(`/free/${short.slug}`);
  const drop = getDrop(slug);
  if (!drop) notFound();

  return (
    <SitePageLayout>
      <InnerHero title={drop.title} description={drop.description} />

      <GridSection>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 px-5 py-4 sm:px-10">
          <Link
            href="/free"
            className="inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
          >
            <IconArrowLeft className="size-4" />
            All free tools
          </Link>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-neutral-400">
            Reel {pad(drop.number)} · {drop.guide ? "free guide" : `${drop.tools.length} ${drop.tools.length === 1 ? "tool" : "tools"}`} ·{" "}
            {formatDropDate(drop.date)}
          </p>
        </div>
        {drop.guide ? (
          <div className="grid grid-cols-1 gap-10 px-5 py-10 sm:px-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-center md:py-14">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={drop.guide.cover}
              alt={`Cover of the free guide: ${drop.title}`}
              className="mx-auto w-full max-w-xs rounded-lg border border-neutral-200 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.45)] md:max-w-none"
            />
            <div>
              <p className="font-mono text-[13px] text-warm">FREE PDF · 9 PAGES</p>
              <ul className="mt-5 space-y-3">
                {drop.guide.points.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-[15px] leading-relaxed text-neutral-700">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-neutral-900" />
                    {point}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <GuideSignup uid={drop.guide.kitUid} src={drop.guide.kitScript} />
                <p className="mt-3 text-xs text-neutral-500">
                  Enter your email and the PDF opens right away. You&apos;ll also get new guides by email. Unsubscribe any time.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-neutral-200">
            {drop.tools.map((tool, index) => (
              <ToolRow key={tool.name} tool={tool} index={index} />
            ))}
          </ul>
        )}
      </GridSection>

      <GridSection className="bg-neutral-50">
        <FollowBlock />
      </GridSection>
    </SitePageLayout>
  );
}
