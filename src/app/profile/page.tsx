import type { Metadata } from "next";
import SitePageLayout from "@/app/components/SitePageLayout";
import InnerHero from "@/app/components/InnerHero";
import ContentSection from "@/app/components/ContentSection";
import CTA from "@/app/components/CTA";

export const metadata: Metadata = {
  title: "プロフィール | Evimeria",
  description:
    "Evimeria の事業内容・進め方・対応について。フリーランスとして事業者・個人事業主向けに伴走します。",
};

export default function ProfilePage() {
  return (
    <SitePageLayout>
      <InnerHero
        title="プロフィール"
        description="フリーランスとして、事業者・個人事業主の方へ。AI を使った業務の楽化から、LP・サイト・EC・UI/UX・プロトタイプまで、企画から制作まで一貫して伴走します。"
      />
      <ContentSection>
        <div className="max-w-2xl space-y-6 text-[15px] text-text-secondary leading-relaxed">
          <p>
            無理のないペース・人手や予算に合わせた段階的な進行を重視します。単発の制作だけでなく、運用しながらの改善や追加の自動化も、都度ご相談いただけます。
          </p>
          <p>
            詳細な経歴・スキルセットは、お問い合わせ時にご紹介する資料やプロフィールページにまとめています（準備中の場合はメールにてご案内します）。
          </p>
        </div>
      </ContentSection>
      <CTA />
    </SitePageLayout>
  );
}
