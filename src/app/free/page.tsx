import type { Metadata } from "next";
import Link from "next/link";
import SitePageLayout from "@/app/components/SitePageLayout";
import InnerHero from "@/app/components/InnerHero";
import { GridSection } from "@/app/components/ui/grid-section";
import { DropCover, FollowBlock } from "@/app/free/FreeParts";
import { formatDropDate, getDrops, pad } from "@/lib/free";

const title = "Free tools — every tool from my reels | Shogo Kikuchi";
const description =
  "Every tool from the @copilot_shogo reels in one place. Open source and free to use, grouped by reel.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/free" },
  openGraph: { title, description, url: "/free", type: "website" },
};

// Not in the main nav on purpose: Work stays the curated seven. This page is where the reels and the bio link land.
export default function FreePage() {
  const drops = getDrops();

  return (
    <SitePageLayout>
      <InnerHero
        title="Free tools"
        description="Every tool from my reels, in one place. Open source and free to use."
      />

      <GridSection>
        <div className="grid grid-cols-1 md:grid-cols-3 md:[&>*:not(:nth-child(3n))]:border-r md:[&>*:nth-child(n+4)]:border-t [&>*]:border-neutral-200 max-md:[&>*:not(:first-child)]:border-t">
          {drops.map((drop, index) => (
            <Link
              key={drop.slug}
              href={`/free/${drop.slug}`}
              className="group flex h-full animate-slide-up-fade flex-col transition-colors duration-200 [--offset:16px] hover:bg-neutral-50"
              style={{ animationDelay: `${(index % 3) * 60}ms` }}
            >
              <DropCover drop={drop} />
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-neutral-400">
                    Reel {pad(drop.number)}
                  </p>
                  <h2 className="mt-2 line-clamp-2 text-lg font-semibold tracking-[-0.015em] text-neutral-900">
                    {drop.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm text-neutral-500">{drop.description}</p>
                </div>
                <time dateTime={drop.date} className="mt-4 text-sm text-neutral-500">
                  {formatDropDate(drop.date)}
                </time>
              </div>
            </Link>
          ))}
        </div>
      </GridSection>

      <GridSection>
        <FollowBlock showAllLink={false} />
      </GridSection>
    </SitePageLayout>
  );
}
