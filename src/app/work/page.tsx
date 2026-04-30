import type { Metadata } from "next";
import SitePageLayout from "@/app/components/SitePageLayout";
import InnerHero from "@/app/components/InnerHero";
import ContentSection from "@/app/components/ContentSection";
import CTA from "@/app/components/CTA";

export const metadata: Metadata = {
  title: "実績 | Evimeria",
  description:
    "AI 業務自動化、Web・LP・EC、UI/UX・試作に関する事例・納品の一例（公開可能な範囲）。",
};

export default function WorkPage() {
  return (
    <SitePageLayout>
      <InnerHero
        title="実績・事例"
        description="公開許可のある範囲で、納品形態や業種の一例を随時更新しています。具体的な事例はお問い合わせ時にご紹介します。"
      />
      <ContentSection>
        <div className="rounded-xl border border-dashed border-border border-white/15 bg-bg-card/50 p-10 text-center">
          <p className="text-[15px] text-text-secondary leading-relaxed max-w-lg mx-auto">
            事例一覧ページ・詳細は準備中です。LP・サイト・自動化フローなど、ご希望の業種に近いものがあればお問い合わせにてお知らせください。
          </p>
        </div>
      </ContentSection>
      <CTA />
    </SitePageLayout>
  );
}
