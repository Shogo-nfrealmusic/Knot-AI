import type { Metadata } from "next";
import Link from "next/link";
import SitePageLayout from "@/app/components/SitePageLayout";
import InnerHero from "@/app/components/InnerHero";
import LegalDoc, { LegalSection, legalLink, legalText } from "@/app/components/LegalDoc";
import { site, siteOgImage, twitterCard } from "@/lib/site";

const title = "Terms of Sale | Shogo Kikuchi";
const description = "The terms for buying and using Copilot OS and other products sold on shogo.build.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/terms" },
  openGraph: { title, description, url: "/terms", type: "website", images: [siteOgImage] },
  twitter: twitterCard(title, description, [siteOgImage]),
};

const list = "mt-4 list-disc space-y-2 pl-5 text-[15px] leading-relaxed tracking-[-0.01em] text-text-secondary marker:text-text-muted";

export default function TermsPage() {
  return (
    <SitePageLayout>
      <InnerHero title="Terms of Sale" description="What you get, what you can do with it, and how refunds work." />
      <LegalDoc
        updated="November 28, 2026"
        intro={
          <p>
            These terms apply when you buy a product on shogo.build, including Copilot OS. The seller is {site.name},
            a sole proprietor in Japan (&quot;I&quot; or &quot;me&quot;). By completing checkout you agree to them.
          </p>
        }
      >
        <LegalSection title="1. What you buy">
          <p className={legalText}>
            Copilot OS is a digital product: an online guide you read on this site and a kit of files you download.
            The Founding Operator plan adds one 60 minute video call and email questions answered for 30 days from
            purchase. Prices are shown on the product page and charged once, at checkout. There is no subscription.
          </p>
        </LegalSection>

        <LegalSection title="2. Delivery and access">
          <p className={legalText}>
            After payment, the confirmation page opens the guide and downloads the kit. Access to the guide is
            remembered in your browser. Keep the confirmation page link; it opens the guide again on any device. If
            you lose access, email me with the address you paid with and I will restore it.
          </p>
        </LegalSection>

        <LegalSection title="3. Your license">
          <p className={legalText}>When you buy, you get a personal, non transferable license. You may:</p>
          <ul className={list}>
            <li>Use the guide and the kit for yourself and for your own business, including client work</li>
            <li>Change the kit files as much as you like for that use</li>
          </ul>
          <p className={legalText}>You may not:</p>
          <ul className={list}>
            <li>Resell, share, or publish the guide or the kit, as is or lightly changed</li>
            <li>Share your access link or files with people who have not bought</li>
            <li>Use them to make a competing guide, course, or template product</li>
          </ul>
        </LegalSection>

        <LegalSection title="4. Refunds">
          <p className={legalText}>
            If it does not work for you, tell me why and I will refund you. There is no time limit. Email{" "}
            <a href={`mailto:${site.email}`} className={legalLink}>
              {site.email}
            </a>{" "}
            or use the{" "}
            <Link href="/contact" className={legalLink}>
              contact form
            </Link>
            . Faulty files and double charges are refunded too. After a refund, your access to the guide ends.
          </p>
        </LegalSection>

        <LegalSection title="5. What you need">
          <p className={legalText}>
            A paid Claude plan (not included), a computer running macOS, Windows or Linux, and a web browser. The
            guide relies on Claude Code, a product of Anthropic. I am not affiliated with Anthropic, and changes to
            their products or prices are outside my control. When they change, I update the guide where I can.
          </p>
        </LegalSection>

        <LegalSection title="6. No guarantee of results">
          <p className={legalText}>
            The guide shows how I run my own work with Claude Code. Figures from my business are examples, not
            promises. Your results depend on your business, your effort and the tools you use. You are responsible
            for what you set Claude Code to do on your computer and accounts, and for checking its work before it
            affects money, customers or data.
          </p>
        </LegalSection>

        <LegalSection title="7. Limitation of liability">
          <p className={legalText}>
            To the extent the law allows, my total liability for anything related to a product is limited to the
            amount you paid for it, and I am not liable for indirect or consequential loss. Nothing here limits rights
            you have under the consumer law of your country that cannot be waived.
          </p>
        </LegalSection>

        <LegalSection title="8. Changes and governing law">
          <p className={legalText}>
            I may update these terms; the version shown when you bought applies to that purchase. These terms are
            governed by the laws of Japan, and the Tokyo District Court has exclusive jurisdiction in the first
            instance, except where your local consumer law says otherwise.
          </p>
        </LegalSection>

        <LegalSection title="9. Contact">
          <p className={legalText}>
            Questions about these terms:{" "}
            <a href={`mailto:${site.email}`} className={legalLink}>
              {site.email}
            </a>
            . The legal disclosure required in Japan is on the{" "}
            <Link href="/legal" className={legalLink}>
              特定商取引法に基づく表記
            </Link>{" "}
            page.
          </p>
        </LegalSection>
      </LegalDoc>
    </SitePageLayout>
  );
}
