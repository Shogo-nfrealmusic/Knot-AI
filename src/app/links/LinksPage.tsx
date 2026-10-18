"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { track } from "@vercel/analytics";
import type { Highlight, LinksMode, ModeContent } from "@/lib/links";

// Two looks on one page. AI: off-white, Notion-like, with Orbit. Fitness: black, bold, orange, no mascot.
const THEME: Record<LinksMode, Record<string, string>> = {
  ai: {
    "--l-bg": "#fafaf9",
    "--l-fg": "#171717",
    "--l-muted": "#78716c",
    "--l-line": "#e7e5e4",
    "--l-card": "#ffffff",
    "--l-accent": "#3b5bfd",
    "--l-on-accent": "#ffffff",
  },
  fit: {
    "--l-bg": "#0a0a0a",
    "--l-fg": "#fafafa",
    "--l-muted": "#a3a3a3",
    "--l-line": "#262626",
    "--l-card": "#141414",
    "--l-accent": "#ff5a1f",
    "--l-on-accent": "#0a0a0a",
  },
};

const isExternal = (href: string) => href.startsWith("http");

/** External links open in a new tab; knot's own pages go through next/link. */
function SmartLink({ href, ...rest }: React.ComponentProps<"a"> & { href: string }) {
  return isExternal(href) ? (
    <a href={href} target="_blank" rel="noopener noreferrer" {...rest} />
  ) : (
    <Link href={href} {...rest} />
  );
}

export default function LinksPage({
  content,
  initialMode,
  source,
}: {
  content: Record<LinksMode, ModeContent>;
  initialMode: LinksMode;
  source: string;
}) {
  const [mode, setMode] = useState<LinksMode>(initialMode);
  const c = content[mode];
  const fit = mode === "fit";

  // One view per page load, tagged with the mode it opened in and the bio link it came from.
  useEffect(() => {
    track("links_view", { mode: initialMode, src: source });
  }, [initialMode, source]);

  // Overscroll and the browser bar follow the mode.
  useEffect(() => {
    const bg = THEME[mode]["--l-bg"];
    document.body.style.backgroundColor = bg;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", bg);
  }, [mode]);

  const switchMode = (next: LinksMode) => {
    if (next === mode) return;
    setMode(next);
    track("links_mode", { to: next, src: source });
    // Keep the choice in the URL so a shared or reloaded link opens the same side.
    const url = new URL(window.location.href);
    if (next === "fit") url.searchParams.set("m", "fit");
    else url.searchParams.delete("m");
    window.history.replaceState(null, "", url);
  };

  const onLink = (id: string, place: string) => track("links_click", { id, place, mode, src: source });

  return (
    <main
      style={THEME[mode] as CSSProperties}
      className="min-h-screen bg-[var(--l-bg)] text-[var(--l-fg)] transition-colors duration-500"
    >
      <div className="mx-auto max-w-[480px] pb-16">
        <ModeSwitch mode={mode} content={content} onChange={switchMode} />

        <div key={mode} className="animate-slide-up-fade [--offset:12px]">
          {fit ? <FitHero c={c} /> : <AiHero c={c} />}

          <section className="mt-12">
            <SectionLabel fit={fit}>Highlights</SectionLabel>
            <Highlights items={c.highlights} fit={fit} onOpen={(id) => onLink(id, "highlight")} />
          </section>

          <section className="mt-12 px-4">
            <SectionLabel fit={fit} flush>
              Links
            </SectionLabel>
            <ul className="space-y-2.5">
              {c.links.map((link) => (
                <li key={link.id}>
                  <SmartLink
                    href={link.href}
                    onClick={() => onLink(link.id, "list")}
                    className="group flex items-center justify-between gap-4 rounded-2xl border border-[var(--l-line)] bg-[var(--l-card)] px-4 py-3.5 transition-all duration-200 hover:-translate-y-px hover:border-[var(--l-accent)]"
                  >
                    <span className="min-w-0">
                      <span
                        className={
                          fit
                            ? "block text-[15px] font-extrabold uppercase tracking-[0.02em]"
                            : "block text-[15px] font-medium tracking-[-0.01em]"
                        }
                      >
                        {link.label}
                      </span>
                      {link.note ? (
                        <span className="mt-0.5 block truncate font-mono text-[12px] text-[var(--l-muted)]">
                          {link.note}
                        </span>
                      ) : null}
                    </span>
                    <span
                      aria-hidden
                      className="shrink-0 text-[var(--l-muted)] transition-colors group-hover:text-[var(--l-accent)]"
                    >
                      {isExternal(link.href) ? "↗" : "→"}
                    </span>
                  </SmartLink>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-14 px-4 text-center">
            <p
              className={
                fit
                  ? "text-[22px] font-black uppercase leading-[1.05] tracking-[-0.01em]"
                  : "text-[22px] font-semibold leading-snug tracking-[-0.03em]"
              }
            >
              {c.closing}
            </p>
            <Link
              href="/contact"
              onClick={() => onLink("contact", "closing")}
              className="mt-6 inline-flex h-11 items-center rounded-full bg-[var(--l-accent)] px-6 text-[14px] font-semibold text-[var(--l-on-accent)] transition-transform hover:scale-[1.03]"
            >
              Get in touch
            </Link>
          </section>
        </div>

        <footer className="mt-14 text-center font-mono text-[11px] text-[var(--l-muted)]">
          <Link href="/" onClick={() => onLink("home", "footer")} className="hover:text-[var(--l-fg)]">
            shogo.build
          </Link>
        </footer>
      </div>
    </main>
  );
}

function ModeSwitch({
  mode,
  content,
  onChange,
}: {
  mode: LinksMode;
  content: Record<LinksMode, ModeContent>;
  onChange: (mode: LinksMode) => void;
}) {
  const fit = mode === "fit";
  return (
    <div className="sticky top-0 z-30 flex justify-center px-4 pb-3 pt-4">
      <div
        role="tablist"
        aria-label="Choose a side"
        className="relative grid w-full max-w-[280px] grid-cols-2 rounded-full border border-[var(--l-line)] bg-[var(--l-card)]/80 p-1 backdrop-blur-md"
      >
        <span
          aria-hidden
          className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            transform: fit ? "translateX(100%)" : "translateX(0)",
            background: fit ? THEME.fit["--l-accent"] : THEME.ai["--l-fg"],
          }}
        />
        {(["ai", "fit"] as const).map((m) => (
          <button
            key={m}
            role="tab"
            aria-selected={mode === m}
            onClick={() => onChange(m)}
            className={`relative z-10 h-10 rounded-full text-[13px] font-semibold uppercase tracking-[0.08em] transition-colors duration-300 ${
              mode === m ? (fit ? "text-[#0a0a0a]" : "text-white") : "text-[var(--l-muted)]"
            }`}
          >
            {content[m].tab}
          </button>
        ))}
      </div>
    </div>
  );
}

function AiHero({ c }: { c: ModeContent }) {
  return (
    <section className="px-4 pt-3">
      <div className="relative">
        <div className="overflow-hidden rounded-[28px] border border-[var(--l-line)] bg-[var(--l-card)]">
          <Image
            src={c.photo.src}
            alt={c.photo.alt}
            width={c.photo.width}
            height={c.photo.height}
            priority
            sizes="(max-width: 480px) 100vw, 480px"
            className="aspect-[4/5] w-full object-cover object-[50%_40%]"
          />
        </div>
        <Orbit className="absolute -bottom-9 -right-3 w-[46%]" />
      </div>
      <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-[var(--l-line)] bg-[var(--l-card)] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--l-muted)]">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </span>
        Building · Tokyo
      </p>
      <h1 className="mt-4 text-[40px] font-semibold leading-none tracking-[-0.045em]">{c.name}</h1>
      <p className="mt-3 max-w-[34ch] text-[16px] leading-relaxed tracking-[-0.012em] text-[var(--l-muted)]">
        {c.line}
      </p>
    </section>
  );
}

function FitHero({ c }: { c: ModeContent }) {
  return (
    <section className="relative -mt-[68px]">
      <div className="relative">
        <Image
          src={c.photo.src}
          alt={c.photo.alt}
          width={c.photo.width}
          height={c.photo.height}
          priority
          sizes="(max-width: 480px) 100vw, 480px"
          className="aspect-[4/5] w-full object-cover object-[50%_45%] grayscale-[0.15]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/70 via-transparent via-40% to-[#0a0a0a]" />
      </div>
      <div className="-mt-24 relative px-4">
        <h1 className="text-[76px] font-black uppercase leading-[0.85] tracking-[-0.04em]">{c.name}</h1>
        <p className="mt-4 font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--l-accent)]">{c.line}</p>
      </div>
    </section>
  );
}

function SectionLabel({ children, fit, flush }: { children: React.ReactNode; fit: boolean; flush?: boolean }) {
  return (
    <p
      className={`mb-4 font-mono text-[11px] uppercase tracking-[0.16em] ${flush ? "" : "px-4"} ${
        fit ? "text-[var(--l-accent)]" : "text-[var(--l-muted)]"
      }`}
    >
      {children}
    </p>
  );
}

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
const subscribeReducedMotion = (cb: () => void) => {
  const mq = window.matchMedia(reducedMotionQuery);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const useReducedMotion = () =>
  useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(reducedMotionQuery).matches,
    () => true,
  );

/** Apple-style swipe cards: snap, dots, and autoplay that stops for good once the visitor touches it. */
function Highlights({ items, fit, onOpen }: { items: Highlight[]; fit: boolean; onOpen: (id: string) => void }) {
  const rail = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  const reduced = useReducedMotion();

  const goTo = (i: number) => {
    const el = rail.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (el && card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft - 16, behavior: "smooth" });
  };

  useEffect(() => {
    if (reduced || touched || items.length < 2) return;
    const id = window.setInterval(() => goTo((active + 1) % items.length), 4500);
    return () => window.clearInterval(id);
  }, [active, reduced, touched, items.length]);

  const onScroll = () => {
    const el = rail.current;
    if (!el) return;
    const mid = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    Array.from(el.children).forEach((child, i) => {
      const card = child as HTMLElement;
      const center = card.offsetLeft - el.offsetLeft + card.offsetWidth / 2;
      const bestCard = el.children[best] as HTMLElement;
      if (Math.abs(center - mid) < Math.abs(bestCard.offsetLeft - el.offsetLeft + bestCard.offsetWidth / 2 - mid)) best = i;
    });
    if (best !== active) setActive(best);
  };

  return (
    <div>
      <div
        ref={rail}
        onScroll={onScroll}
        onPointerDown={() => setTouched(true)}
        onWheel={() => setTouched(true)}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <SmartLink
            key={item.id}
            href={item.href}
            onClick={() => onOpen(item.id)}
            className="flex w-[84%] shrink-0 snap-start flex-col overflow-hidden rounded-[24px] border border-[var(--l-line)] bg-[var(--l-card)] p-5"
          >
            <span
              className={
                fit
                  ? "text-[17px] font-black uppercase tracking-[-0.01em]"
                  : "text-[17px] font-semibold tracking-[-0.025em]"
              }
            >
              {item.title}
            </span>
            <span className="mt-1 text-[14px] leading-snug text-[var(--l-muted)]">{item.sub}</span>
            <span className="mt-5 block">
              {item.image ? (
                <Image
                  src={item.image}
                  alt=""
                  width={1440}
                  height={900}
                  sizes="400px"
                  className="aspect-[16/11] w-full rounded-[14px] border border-[var(--l-line)] object-cover object-top"
                />
              ) : (
                <KeyValuePanel id={item.id} rows={item.rows ?? []} fit={fit} />
              )}
            </span>
          </SmartLink>
        ))}
      </div>
      {items.length > 1 ? (
        <div className="mt-4 flex justify-center gap-2">
          {items.map((item, i) => (
            <button
              key={item.id}
              aria-label={`Show ${item.title}`}
              onClick={() => {
                setTouched(true);
                goTo(i);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active ? "w-5 bg-[var(--l-fg)]" : "w-1.5 bg-[var(--l-line)]"
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

/** ClickUp-style black panel: a thin glowing top line, an "online" dot, and mono key: "value" rows. */
function KeyValuePanel({ id, rows, fit }: { id: string; rows: [string, string][]; fit: boolean }) {
  const glow = fit ? "#ff5a1f" : "#7c93ff";
  return (
    <span className="relative block aspect-[16/11] overflow-hidden rounded-[14px] bg-[#0b0b0c] p-4 font-mono text-[12px] leading-relaxed">
      <span
        aria-hidden
        className="absolute inset-x-8 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${glow}, transparent)` }}
      />
      <span
        aria-hidden
        className="absolute -top-16 left-1/2 h-32 w-3/4 -translate-x-1/2 rounded-full opacity-25 blur-3xl"
        style={{ background: glow }}
      />
      <span className="relative flex items-center justify-between text-neutral-500">
        <span>{id}.json</span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-neutral-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: glow }} />
          Live
        </span>
      </span>
      <span className="relative mt-4 block space-y-1.5">
        {rows.map(([k, v]) => (
          <span key={k} className="block truncate">
            <span className="text-neutral-500">{k}: </span>
            <span style={{ color: fit ? "#ffb08f" : "#b7c3ff" }}>&quot;{v}&quot;</span>
          </span>
        ))}
      </span>
    </span>
  );
}

// Orbit is the Blender render (shorts-studio, clip jc10_type), never redrawn here.
// Chrome/Firefox get a 113 KB transparent WebM. WebKit (Safari and every iOS browser, including
// Instagram's) can't show VP9 alpha, so it gets an animated PNG. Reduced motion keeps the still.
type OrbitSource = "poster" | "webm" | "apng";
const noopSubscribe = () => () => {};
function pickOrbitSource(): OrbitSource {
  if (window.matchMedia(reducedMotionQuery).matches) return "poster";
  const ua = navigator.userAgent;
  const webkitOnly = /iP(hone|ad|od)/.test(ua) || (/Safari\//.test(ua) && !/Chrome|Chromium|CriOS|Edg|Android/.test(ua));
  return webkitOnly ? "apng" : "webm";
}

function Orbit({ className }: { className?: string }) {
  const source = useSyncExternalStore<OrbitSource>(noopSubscribe, pickOrbitSource, () => "poster");
  const box = `pointer-events-none select-none ${className ?? ""}`;
  if (source === "webm") {
    return (
      <video
        className={box}
        src="/links/orbit-type.webm"
        poster="/links/orbit-poster.png"
        autoPlay
        muted
        loop
        playsInline
        aria-label="Orbit, the mascot, typing on a laptop"
      />
    );
  }
  return (
    <Image
      className={box}
      src={source === "apng" ? "/links/orbit-type.png" : "/links/orbit-poster.png"}
      alt="Orbit, the mascot, typing on a laptop"
      width={460}
      height={420}
      unoptimized
    />
  );
}
