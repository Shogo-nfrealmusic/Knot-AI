import type { CSSProperties, ReactNode } from "react";
import { GuideSignup } from "@/app/free/GuideSignup";
import { formReady, type KitForm, type Screen } from "@/lib/os";
import { cn } from "@/lib/utils";

// Shared by /os and /club. Same language as /setup: white ground, hairline rails, one sans with a serif
// italic for the second half of a heading, one warm accent. No eyebrows: the sales copy has none.

export const entrance = "animate-slide-up-fade motion-reduce:animate-none";
export const stagger = (ms: number, px: number) => ({ animationDelay: `${ms}ms`, "--offset": `${px}px` }) as CSSProperties;

export const CARD = "relative rounded-[20px] bg-white shadow-[0_0_0_1px_#e5e5e5,0_1px_2px_rgba(0,0,0,.04),0_12px_32px_-18px_rgba(0,0,0,.18)]";
export const PRIMARY =
  "inline-flex h-11 items-center justify-center rounded-lg border border-black bg-black px-5 text-sm font-medium text-white shadow-sm transition-all hover:bg-neutral-800 hover:ring-4 hover:ring-neutral-200 active:scale-[0.96]";
export const SECONDARY =
  "inline-flex h-11 items-center justify-center rounded-lg border border-neutral-300 bg-white px-5 text-sm font-medium text-neutral-900 transition-all hover:bg-neutral-50 hover:ring-4 hover:ring-black/5 active:scale-[0.96]";

export function Heading({ title, accent, id }: { title: string; accent?: string; id?: string }) {
  return (
    <div id={id} className="mx-auto max-w-3xl scroll-mt-24 px-4 text-center">
      <h2 className="text-balance text-[clamp(32px,4.6vw,56px)] font-medium leading-[1.04] tracking-[-0.04em] text-neutral-900">
        {title}
        {accent ? (
          <>
            {" "}
            <span className="font-serif font-normal italic tracking-[-0.01em] text-neutral-500">{accent}</span>
          </>
        ) : null}
      </h2>
    </div>
  );
}

export function Check({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={cn("mt-[5px] size-4 shrink-0 text-[var(--warm)]", className)} aria-hidden>
      <path d="M3.5 8.5 6.25 11.25 12.5 4.75" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Cross() {
  return (
    <svg viewBox="0 0 16 16" className="mt-[5px] size-4 shrink-0 text-neutral-400" aria-hidden>
      <path d="M4.5 4.5 11.5 11.5M11.5 4.5 4.5 11.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/** A real screen from the company, shown whole (never cropped). The captures carry their own window bar. */
export function ScreenShot({ screen, caption, eager, className }: { screen: Screen; caption?: ReactNode; eager?: boolean; className?: string }) {
  return (
    <figure className={cn("m-0", className)}>
      {/* The text in a capture is small on a phone, so the picture opens at full size on its own. */}
      <a href={screen.src} target="_blank" rel="noopener noreferrer" className="block rounded-[14px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={screen.src}
          alt={screen.alt}
          width={screen.width}
          height={screen.height}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          className="block h-auto w-full rounded-[14px] shadow-[0_0_0_1px_rgba(0,0,0,.08),0_16px_32px_-16px_rgba(0,0,0,.28)]"
        />
      </a>
      {caption ? <figcaption className="mt-3 text-[13px] text-neutral-500">{caption}</figcaption> : null}
    </figure>
  );
}

const FIELD = "h-11 w-full rounded-lg border border-neutral-300 bg-white px-4 text-[15px] text-neutral-900 placeholder:text-neutral-400";

/**
 * An email list on Kit. With a form uid it loads Kit's own embed (the same path as the Starter sign-up, so
 * reCAPTCHA and Kit's spam check keep working). Without one it shows the form's shape, switched off: no address
 * is collected until the list it belongs to exists.
 */
export function KitList({
  form,
  email,
  button,
  question,
  row,
}: {
  form: KitForm;
  email: string;
  button: string;
  /** an optional free-text question, shown as the label of a second field */
  question?: ReactNode;
  /** email and button side by side from the sm breakpoint up */
  row?: boolean;
}) {
  if (formReady(form)) return <GuideSignup uid={form.uid} src={form.script} />;
  return (
    <form className="text-left">
      <div className={cn("flex flex-col gap-3", row && "sm:flex-row")}>
        <label className="block flex-1">
          <span className="sr-only">{email}</span>
          <input type="email" disabled placeholder={email} autoComplete="email" className={cn(FIELD, "disabled:cursor-not-allowed")} />
        </label>
        {question ? (
          <label className="block">
            <span className="block text-[15px] leading-relaxed text-neutral-700">{question}</span>
            <textarea disabled rows={3} className={cn(FIELD, "mt-2 h-auto resize-none py-3 disabled:cursor-not-allowed")} />
          </label>
        ) : null}
        <button type="submit" disabled className="h-11 shrink-0 rounded-lg bg-neutral-900 px-5 text-sm font-medium text-white disabled:cursor-not-allowed">
          {button}
        </button>
      </div>
      <p className="mt-3 text-[13px] text-neutral-500">Not connected yet. This form goes live when its Kit form is added.</p>
    </form>
  );
}
