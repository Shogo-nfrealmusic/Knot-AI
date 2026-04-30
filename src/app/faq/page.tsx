import type { Metadata } from "next";
import SitePageLayout from "@/app/components/SitePageLayout";
import InnerHero from "@/app/components/InnerHero";
import ContentSection from "@/app/components/ContentSection";
import CTA from "@/app/components/CTA";

export const metadata: Metadata = {
  title: "よくある質問 | Evimeria",
  description:
    "ご相談・制作・運用に関するよくある質問。AI 業務自動化、Web・LP・EC、UI/UX について。",
};

const faqs = [
  {
    q: "まだ何を頼めばいいか決まっていません。相談できますか？",
    a: "はい。ヒアリングから課題の言語化を一緒にし、小さく試せるところからご提案します。",
  },
  {
    q: "AI の導入だけでなく、サイトや LP の制作もまとめて依頼できますか？",
    a: "可能です。仕組みづくりと見せ方づくりを、同じ窓口で進められます。",
  },
  {
    q: "リモート・対応エリアは？",
    a: "オンライン中心で全国対応です。必要に応じて打ち合わせ方法を調整します。",
  },
];

export default function FaqPage() {
  return (
    <SitePageLayout>
      <InnerHero
        title="よくある質問"
        description="その他の疑問は、お問い合わせフォームやメールからお気軽にどうぞ。"
      />
      <ContentSection>
        <div className="space-y-8 max-w-2xl">
          {faqs.map((item) => (
            <div key={item.q} className="border-b border-border pb-8 last:border-0 last:pb-0">
              <h2 className="text-[15px] font-semibold text-[#d0d6e0] tracking-[-0.01em] mb-2">
                <span className="text-text-muted font-mono text-[12px] mr-2">Q</span>
                {item.q}
              </h2>
              <p className="text-[15px] text-text-secondary leading-relaxed pl-0 sm:pl-6">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </ContentSection>
      <CTA />
    </SitePageLayout>
  );
}
