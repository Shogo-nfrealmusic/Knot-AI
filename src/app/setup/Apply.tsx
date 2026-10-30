import Link from "next/link";
import { FOUNDING } from "@/lib/setup";

// The closing scene: the folded Duo with "3 jobs done overnight" beside one button to the application page
// (/setup/apply). The form itself lives on that page so applying is one focused step, not a long scroll.
export default function Apply() {
  const left = FOUNDING.seats - FOUNDING.taken;
  return (
    <div className="grid items-center gap-12 px-4 sm:px-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
      <div className="relative mx-auto w-full max-w-[420px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/setup/duo-closed.jpg" alt="A folded iPhone Duo showing 7:30 and '3 jobs done overnight' on its lock screen." className="h-auto w-full mix-blend-multiply" />
      </div>

      <div className="max-lg:text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--warm)]">Apply</p>
        <h2 className="mt-4 text-balance text-[clamp(34px,4.4vw,56px)] font-medium leading-[1.02] tracking-[-0.04em] text-neutral-900">
          Wake up to <span className="font-serif font-normal italic text-neutral-500">work already done.</span>
        </h2>
        <p className="mt-4 max-w-[44ch] text-[15px] leading-relaxed text-neutral-600 max-lg:mx-auto">
          Tell me about your business and the job you&apos;d hand off first. Two minutes, a reply within two business days. {left} of {FOUNDING.seats} founding
          seats left.
        </p>
        <Link
          href="/setup/apply"
          className="group mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-neutral-900 px-6 text-[15px] font-medium text-white transition-all hover:bg-black hover:ring-4 hover:ring-neutral-200 active:scale-[0.97]"
        >
          Apply for a seat
          <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
        </Link>
        <p className="mt-3 text-[12px] text-neutral-400">No payment now. I&apos;ll send a link only if it&apos;s a fit.</p>
      </div>
    </div>
  );
}
