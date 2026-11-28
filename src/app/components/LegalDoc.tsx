import type { ReactNode } from "react";

// Plain layout shared by /legal and /terms: a narrow column of numbered sections and a "last updated" line.

export const legalText = "mt-4 text-[15px] leading-relaxed tracking-[-0.01em] text-text-secondary";
export const legalHeading =
  "text-[clamp(1.35rem,2.4vw,1.5rem)] font-semibold leading-tight tracking-[-0.018em] text-text-primary";
export const legalLink =
  "text-text-primary underline decoration-neutral-300 underline-offset-4 transition-colors hover:text-neutral-900 hover:decoration-neutral-500";

export function LegalSection({ title, children }: Readonly<{ title: string; children: ReactNode }>) {
  return (
    <section>
      <h2 className={legalHeading}>{title}</h2>
      {children}
    </section>
  );
}

export default function LegalDoc({
  intro,
  updated,
  children,
}: Readonly<{ intro?: ReactNode; updated: string; children: ReactNode }>) {
  return (
    <article className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-3xl">
        {intro ? <div className="text-[15px] leading-relaxed tracking-[-0.01em] text-text-secondary">{intro}</div> : null}
        <div className="mt-14 space-y-14">{children}</div>
        <div className="mt-16 border-t border-border pt-6 text-[13px] leading-relaxed text-text-muted">
          <p>
            <strong className="font-semibold text-text-secondary">Last updated</strong>: {updated}
          </p>
        </div>
      </div>
    </article>
  );
}
