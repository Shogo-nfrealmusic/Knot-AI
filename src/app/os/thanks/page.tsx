import type { Metadata } from "next";
import Link from "next/link";
import SitePageLayout from "@/app/components/SitePageLayout";
import { GUIDE_CSS } from "../guide/style";
import { paidSession } from "@/lib/os-checkout";

// Where Stripe sends a buyer after payment: /os/thanks?session_id={CHECKOUT_SESSION_ID}.
// The download link only works for a paid session, so sharing this URL without one gets nothing.

export const metadata: Metadata = {
  title: "Thank you | Copilot OS",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ThanksPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id: sessionId = "" } = await searchParams;
  const paid = await paidSession(sessionId);

  return (
    <SitePageLayout>
      <style>{GUIDE_CSS}</style>
      <div className="gd min-h-[70vh] px-4 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-[680px]">
          {paid ? (
            <>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">Copilot OS</p>
              <h1 className="gd-h2 mt-4 text-balance">
                You&apos;re in. <span className="gd-serif">Thirty minutes to your first job.</span>
              </h1>
              <a
                href={`/os/download?session_id=${encodeURIComponent(sessionId)}`}
                className="gd-press mt-10 inline-flex min-h-14 items-center gap-3 rounded-full bg-[var(--ink)] px-7 text-lg font-semibold text-white hover:bg-black"
              >
                Download Copilot OS
                <span aria-hidden="true">↓</span>
              </a>
              <ol className="mt-12 grid gap-4 text-lg text-[var(--body)]">
                <li>
                  <strong className="font-semibold text-[var(--ink)]">1.</strong> Unzip it and open <code className="gd-code">guide-html/index.html</code>.
                </li>
                <li>
                  <strong className="font-semibold text-[var(--ink)]">2.</strong> Read <strong className="font-semibold text-[var(--ink)]">Start here</strong> first, even if you already use Claude Code.
                </li>
                <li>
                  <strong className="font-semibold text-[var(--ink)]">3.</strong> Keep this page: the link works again whenever you need the files.
                </li>
              </ol>
              {paid.plan === "operator" ? (
                <p className="mt-10 rounded-2xl bg-white p-6 text-base text-[var(--body)] ring-1 ring-[var(--rule)]">
                  You took a Founding Operator seat. I&apos;ll email you{paid.email ? ` at ${paid.email}` : ""} within one business day to book our 60 minute call.
                </p>
              ) : null}
              <p className="mt-10 text-sm text-[var(--soft)]">
                Not working for you?{" "}
                <Link href="/contact" className="underline decoration-[var(--rule-strong)] underline-offset-4 hover:text-[var(--ink)]">
                  Tell me why
                </Link>{" "}
                and I&apos;ll refund you.
              </p>
            </>
          ) : (
            <>
              <h1 className="gd-h2 text-balance">We couldn&apos;t confirm a purchase on this link.</h1>
              <p className="mt-6 text-lg text-[var(--body)]">
                If you just paid, reply to your Stripe receipt email and I&apos;ll send the files myself. Otherwise,{" "}
                <Link href="/os" className="underline decoration-[var(--rule-strong)] underline-offset-4">
                  see Copilot OS
                </Link>
                .
              </p>
            </>
          )}
        </div>
      </div>
    </SitePageLayout>
  );
}
