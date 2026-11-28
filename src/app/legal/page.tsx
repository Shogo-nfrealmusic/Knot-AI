import type { Metadata } from "next";
import Link from "next/link";
import SitePageLayout from "@/app/components/SitePageLayout";
import InnerHero from "@/app/components/InnerHero";
import LegalDoc, { legalLink, legalText } from "@/app/components/LegalDoc";
import { site, siteOgImage, twitterCard } from "@/lib/site";

// 特定商取引法に基づく表記 (the disclosure Japanese law requires for online sales), in Japanese with an
// English line under each item, since most buyers read English. Address and phone are given on request
// (法第11条ただし書): a request must be answered without delay, within about a week.

const title = "特定商取引法に基づく表記 | Shogo Kikuchi";
const description = "Legal disclosure under Japan's Act on Specified Commercial Transactions for products sold on shogo.build.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/legal" },
  openGraph: { title, description, url: "/legal", type: "website", images: [siteOgImage] },
  twitter: twitterCard(title, description, [siteOgImage]),
};

const rows: { ja: string; en: string; body: React.ReactNode; bodyEn?: string }[] = [
  { ja: "販売業者", en: "Seller", body: "菊池 翔吾", bodyEn: "Shogo Kikuchi (sole proprietor, Japan)" },
  { ja: "運営統括責任者", en: "Person responsible", body: "菊池 翔吾", bodyEn: "Shogo Kikuchi" },
  {
    ja: "所在地",
    en: "Address",
    body: "請求があった場合には遅滞なく開示します",
    bodyEn: "Disclosed without delay on request. Email the address below.",
  },
  {
    ja: "電話番号",
    en: "Phone",
    body: "請求があった場合には遅滞なく開示します",
    bodyEn: "Disclosed without delay on request. Email the address below.",
  },
  {
    ja: "メールアドレス",
    en: "Email",
    body: (
      <a href={`mailto:${site.email}`} className={legalLink}>
        {site.email}
      </a>
    ),
  },
  {
    ja: "販売価格",
    en: "Price",
    body: "各商品ページに表示します（Copilot OS：先着20名 29米ドル、以降 49米ドル／Founding Operator：299米ドル）",
    bodyEn: "Shown on each product page. Copilot OS: US$29 for the first 20 buyers, then US$49. Founding Operator: US$299.",
  },
  {
    ja: "商品代金以外の必要料金",
    en: "Other costs",
    body: "インターネット接続の通信料。Claude の有料プランの料金（本商品には含まれません）",
    bodyEn: "Your internet connection, and a paid Claude plan, which is not included.",
  },
  { ja: "支払方法", en: "Payment", body: "クレジットカード・デビットカード（Stripe）", bodyEn: "Credit or debit card, processed by Stripe." },
  { ja: "支払時期", en: "When you pay", body: "購入手続きの完了時に決済されます", bodyEn: "At checkout." },
  {
    ja: "商品の引渡時期",
    en: "Delivery",
    body: "決済完了後すぐに、ガイドの閲覧とファイルのダウンロードができます",
    bodyEn: "Immediately after payment: the guide opens online and the kit downloads from the confirmation page.",
  },
  {
    ja: "返品・返金",
    en: "Refunds",
    body: "デジタル商品のため、商品の返品はありません。うまく使えなかった場合は、理由をご連絡いただければ返金します。期限は設けていません。ファイルの不具合・二重決済も返金します",
    bodyEn: "Digital products cannot be returned. If it does not work for you, tell me why and I will refund you. There is no time limit. Faulty files and double charges are also refunded.",
  },
  {
    ja: "動作環境",
    en: "Requirements",
    body: "Claude の有料プラン、macOS・Windows・Linux のいずれか、ウェブブラウザ",
    bodyEn: "A paid Claude plan, macOS, Windows or Linux, and a web browser.",
  },
  {
    ja: "役務の内容（Founding Operator）",
    en: "Service (Founding Operator)",
    body: "60分のオンライン通話1回と、購入から30日間のメールでの質問対応",
    bodyEn: "One 60 minute video call, and email questions answered for 30 days from purchase.",
  },
];

export default function LegalPage() {
  return (
    <SitePageLayout>
      <InnerHero title="特定商取引法に基づく表記" description="Legal disclosure under Japan's Act on Specified Commercial Transactions." />
      <LegalDoc
        updated="November 28, 2026"
        intro={
          <p>
            shogo.build で販売する商品（Copilot OS ほか）についての表記です。This page covers products sold on
            shogo.build, including Copilot OS. See also the{" "}
            <Link href="/terms" className={legalLink}>
              Terms of Sale
            </Link>{" "}
            and the{" "}
            <Link href="/privacy" className={legalLink}>
              Privacy Policy
            </Link>
            .
          </p>
        }
      >
        <dl className="divide-y divide-border border-y border-border">
          {rows.map((row) => (
            <div key={row.ja} className="grid gap-2 py-5 sm:grid-cols-[13rem_1fr] sm:gap-6">
              <dt className="text-sm font-semibold text-text-primary">
                {row.ja}
                <span className="block text-xs font-medium text-text-muted">{row.en}</span>
              </dt>
              <dd className="text-[15px] leading-relaxed text-text-secondary">
                {row.body}
                {row.bodyEn ? <span className="mt-1 block text-sm text-text-muted">{row.bodyEn}</span> : null}
              </dd>
            </div>
          ))}
        </dl>
        <p className={legalText}>
          所在地・電話番号の開示をご希望の方は、上記メールアドレスまでご連絡ください。遅滞なくお知らせします。
        </p>
      </LegalDoc>
    </SitePageLayout>
  );
}
