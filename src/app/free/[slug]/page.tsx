import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";
import SitePageLayout from "@/app/components/SitePageLayout";
import InnerHero from "@/app/components/InnerHero";
import { GridSection } from "@/app/components/ui/grid-section";
import { FollowBlock, ToolRow } from "@/app/free/FreeParts";
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
            Reel {pad(drop.number)} · {drop.tools.length} {drop.tools.length === 1 ? "tool" : "tools"} ·{" "}
            {formatDropDate(drop.date)}
          </p>
        </div>
        <ul className="divide-y divide-neutral-200">
          {drop.tools.map((tool, index) => (
            <ToolRow key={tool.name} tool={tool} index={index} />
          ))}
        </ul>
      </GridSection>

      <GridSection className="bg-neutral-50">
        <FollowBlock />
      </GridSection>
    </SitePageLayout>
  );
}
