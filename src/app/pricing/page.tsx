import type { Metadata } from "next";
import SitePageLayout from "@/app/components/SitePageLayout";
import InnerHero from "@/app/components/InnerHero";
import ContentSection from "@/app/components/ContentSection";
import CTA from "@/app/components/CTA";

export const metadata: Metadata = {
  title: "料金 | Evimeria",
  description:
    "フリーランスとして、内容・規模に応じたお見積り。まずは無料で相談から。",
};

export default function PricingPage() {
  return (
    <SitePageLayout>
      <InnerHero
        title="料金の目安"
        description="固定の料金表は用意しません。ヒアリングのうえ、範囲を決めてお見積りします。小さく試して広げる進め方も可能です。"
      />
      <ContentSection>
        <ul className="space-y-4 text-[15px] text-text-secondary leading-relaxed max-w-2xl">
          <li className="flex gap-3">
            <span className="text-accent shrink-0">・</span>
            <span>
              <strong className="text-text-primary font-medium">お見積り</strong>
              ：内容整理後、範囲を明文化したうえで提示します。
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-accent shrink-0">・</span>
            <span>
              <strong className="text-text-primary font-medium">お支払い</strong>
              ：内容に応じて分割・マイルストーン請求などをご相談ください。
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-accent shrink-0">・</span>
            <span>
              <strong className="text-text-primary font-medium">相談</strong>
              ：まだ要件が固まっていない段階でも、お問い合わせから承ります。
            </span>
          </li>
        </ul>
      </ContentSection>
      <CTA />
    </SitePageLayout>
  );
}
