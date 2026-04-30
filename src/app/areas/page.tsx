import type { Metadata } from "next";
import SitePageLayout from "@/app/components/SitePageLayout";
import InnerHero from "@/app/components/InnerHero";
import ContentSection from "@/app/components/ContentSection";
import CTA from "@/app/components/CTA";

export const metadata: Metadata = {
  title: "対応領域 | Evimeria",
  description:
    "AI・Web・UI/UX の対応範囲とご相談の目安。業務改善から LP 制作、プロトタイプまで。",
};

const rows = [
  {
    meta: "AI / 業務改善",
    version: "v2026.04",
    title: "AI 業務自動化のご相談",
    text:
      "問い合わせ対応の整理、定型メール、フォーム連携など、業務フローに合わせた自動化の設計・実装を承っています。",
  },
  {
    meta: "Web / LP",
    version: "v2026.03",
    title: "LP・Web・EC 制作",
    text:
      "サービス紹介 LP、コーポレートサイト、EC の新規構築やリニューアル。構成・デザイン・公開まで対応可能です。",
  },
  {
    meta: "UI/UX / 試作",
    version: "v2026.02",
    title: "UI/UX・プロトタイプ",
    text:
      "画面設計やワイヤー、試作用のプロトタイプ開発。仕組みづくりと見せ方まで、同じ窓口で伴走します。",
  },
];

export default function AreasPage() {
  return (
    <SitePageLayout>
      <InnerHero
        title="対応領域・メニュー（例）"
        description="ご相談内容に応じて、単独または組み合わせで進められます。まだ範囲が決まっていない段階でも構いません。"
      />
      <ContentSection>
        <div className="space-y-6">
          {rows.map((row) => (
            <article
              key={row.title}
              className="flex flex-col gap-3 border border-border rounded-xl p-6 sm:p-8 bg-white/2 sm:flex-row sm:items-start sm:justify-between sm:gap-8"
            >
              <div className="shrink-0">
                <p className="font-mono text-[11px] text-text-muted tabular-nums mb-1">
                  {row.version}
                </p>
                <p className="text-[12px] text-text-secondary">{row.meta}</p>
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-[16px] font-semibold text-[#d0d6e0] tracking-[-0.01em] mb-2">
                  {row.title}
                </h2>
                <p className="text-[15px] text-text-secondary leading-relaxed">
                  {row.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </ContentSection>
      <CTA />
    </SitePageLayout>
  );
}
