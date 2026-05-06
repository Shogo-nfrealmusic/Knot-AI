import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative px-4 pb-14 pt-36 sm:px-6 sm:pt-44 lg:px-8 lg:pb-18">
      <div className="mx-auto max-w-[1344px] w-full min-w-0">
        <div className="mb-7 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-text-secondary">
            AI tools
          </span>
          <span className="rounded-full border border-[#5dcaa5]/25 bg-[#5dcaa5]/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[#8ce0c4]">
            Automation
          </span>
          <span className="rounded-full border border-[#ff8a66]/25 bg-[#ff8a66]/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[#ffad91]">
            Full-stack
          </span>
        </div>

        <div className="mb-8">
          <h1 className="max-w-5xl text-[clamp(3rem,8vw,6.7rem)] font-semibold leading-[0.94] tracking-[-0.06em] text-text-primary">
            Turn AI into systems your team can use.
          </h1>
        </div>

        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <p className="max-w-2xl min-w-0 flex-1 text-[17px] leading-relaxed tracking-[-0.014em] text-text-secondary">
            Knot builds AI tools, internal systems, automations, and custom
            software that connect directly to the workflows already running your
            company.
          </p>
          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            <Link
              href="/contact"
              className="rounded-full bg-text-primary px-5 py-2.5 text-sm font-medium text-bg-primary transition-colors hover:bg-white/90"
            >
              Start a project
            </Link>
            <Link
              href="/how-it-works"
              className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:border-white/30 hover:text-text-primary"
            >
              See how it works
            </Link>
          </div>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-3">
          {[
            ["01", "AI products and internal copilots"],
            ["02", "Workflow automation across existing tools"],
            ["03", "Full-stack development from idea to launch"],
          ].map(([number, label]) => (
            <div key={number} className="bg-[#0d0e10] p-4">
              <p className="font-mono text-[11px] text-[#ff8a66]">{number}</p>
              <p className="mt-3 text-[14px] leading-relaxed tracking-[-0.01em] text-[#d0d6e0]">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
