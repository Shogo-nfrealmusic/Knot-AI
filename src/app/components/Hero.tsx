import Link from "next/link";

export default function Hero() {
  return (
    <section className="pt-[200px] pb-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="mx-auto max-w-[1344px] w-full min-w-0">
        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.022em] text-text-primary">
            Turn AI from knowledge
            <br />
            into practice.
          </h1>
        </div>

        {/* Subtitle row */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
          <p className="min-w-0 flex-1 text-[15px] text-text-secondary tracking-[-0.01em] leading-relaxed">
            We build custom AI Skills and agents that run inside your real
            business workflows — not chatbots, not slide decks, working systems.
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 lg:max-w-[min(100%,22rem)] lg:justify-end lg:shrink-0">
            <div className="w-4 h-4 rounded-lg bg-accent/15 flex items-center justify-center shrink-0">
              <div className="w-1.5 h-1.5 rounded-[3px] bg-accent" />
            </div>
            <span className="text-[15px] font-semibold text-[#d0d6e0] tracking-[-0.01em]">
              AI operations for real teams
            </span>
            <Link
              href="/contact"
              className="text-[15px] text-text-secondary tracking-[-0.01em] whitespace-nowrap hover:text-text-primary transition-colors"
            >
              Book a free assessment{" "}
              <span className="text-text-muted">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
