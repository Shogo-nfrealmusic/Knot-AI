import type { Metadata } from "next";
import SitePageLayout from "@/app/components/SitePageLayout";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact | Knot",
  description:
    "Talk with Knot about AI tools, internal systems, automation, consulting, and custom software development.",
};

function ContactHero() {
  return (
    <section className="border-b border-white/10 px-4 pb-16 pt-36 sm:px-6 lg:px-8 lg:pb-20">
      <div className="mx-auto grid max-w-[1344px] gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-end">
        <div>
          <div className="mb-7 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-text-secondary">
              Contact
            </span>
            <span className="rounded-full border border-[#5dcaa5]/25 bg-[#5dcaa5]/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[#8ce0c4]">
              AI / Automation / Software
            </span>
          </div>
          <h1 className="max-w-5xl text-[clamp(3rem,7vw,6.5rem)] font-semibold leading-[0.94] tracking-[-0.06em] text-text-primary">
            Bring us one messy workflow.
          </h1>
          <p className="mt-7 max-w-2xl text-[17px] leading-relaxed tracking-[-0.014em] text-text-secondary">
            Tell us where work slows down. We will help identify whether it
            needs an AI tool, an automation layer, a custom internal system, or
            a more practical development plan.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#0d0e10] p-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/35">
              Response window
            </p>
            <span className="h-2 w-2 rounded-full bg-[#5dcaa5]" />
          </div>
          <p className="mt-6 font-mono text-[44px] leading-none tracking-[-0.06em] text-text-primary">
            24h
          </p>
          <p className="mt-4 text-[14px] leading-relaxed tracking-[-0.01em] text-text-secondary">
            We review the workflow first, then reply with the clearest next
            step: a quick call, a scoped build, or a reason not to use AI.
          </p>
        </div>
      </div>
    </section>
  );
}

export default function ContactPage() {
  return (
    <SitePageLayout>
      <ContactHero />
      <ContactForm />
    </SitePageLayout>
  );
}
