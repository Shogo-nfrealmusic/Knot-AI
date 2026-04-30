import type { Metadata } from "next";
import SitePageLayout from "@/app/components/SitePageLayout";
import InnerHero from "@/app/components/InnerHero";
import ContentSection from "@/app/components/ContentSection";
import CTA from "@/app/components/CTA";

export const metadata: Metadata = {
  title: "お問い合わせ | Evimeria",
  description:
    "ご相談・お見積り・お問い合わせ。まだ具体的でない段階のご相談も歓迎です。",
};

export default function ContactPage() {
  return (
    <SitePageLayout>
      <InnerHero
        title="お問い合わせ"
        description="内容・規模に応じてお返事します。まだ要件が固まっていない段階でも、お気軽にご連絡ください。"
      />
      <ContentSection>
        <div className="max-w-xl space-y-6">
          <p className="text-[15px] text-text-secondary leading-relaxed">
            フォーム連携は別途セットアップ予定です。現時点では、メールまたは SNS（プロフィールに記載）からご連絡ください。
          </p>
          <a
            href="mailto:hello@example.com"
            className="inline-flex items-center gap-2 text-[15px] font-medium text-text-primary border border-border-solid rounded-full px-5 py-2.5 hover:border-white/20 transition-colors"
          >
            メールで送る（仮）
          </a>
          <p className="text-[13px] text-text-muted">
            ※ 実際のメールアドレスに差し替えてください。
          </p>
        </div>
      </ContentSection>
      <CTA />
    </SitePageLayout>
  );
}
