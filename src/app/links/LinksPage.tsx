"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { FaGithub, FaInstagram, FaLinkedinIn, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { FiArrowUpRight, FiMail } from "react-icons/fi";
import type { Highlight, LinksMode, ModeContent, SocialIcon } from "@/lib/links";

// Two looks on one page. AI: warm white, Notion-like, Orbit everywhere. Fitness: black and white, editorial, no mascot.
const THEME: Record<LinksMode, Record<string, string>> = {
  ai: {
    "--l-bg": "#fbfbfa",
    "--l-fg": "#191919",
    "--l-muted": "#73726e",
    "--l-line": "#e9e9e7",
    "--l-card": "#ffffff",
    "--l-well": "#f1f1ef",
  },
  fit: {
    "--l-bg": "#0b0b0b",
    "--l-fg": "#f2f2f2",
    "--l-muted": "#8c8c8c",
    "--l-line": "#262626",
    "--l-card": "#141414",
    "--l-well": "#141414",
  },
};

const isExternal = (href: string) => /^(https?:|mailto:)/.test(href);

/** External links open in a new tab; knot's own pages go through next/link. */
function SmartLink({ href, ...rest }: React.ComponentProps<"a"> & { href: string }) {
  if (href.startsWith("mailto:")) return <a href={href} {...rest} />;
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
    window.scrollTo({ top: 0 });
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
      className="min-h-screen overflow-x-clip bg-[var(--l-bg)] text-[var(--l-fg)] transition-colors duration-500"
    >
      <div className="mx-auto max-w-[440px] pb-14">
        <ModeSwitch mode={mode} content={content} onChange={switchMode} />

        <div key={mode} className="animate-slide-up-fade [--offset:10px]">
          {fit ? <FitHero c={c} onLink={onLink} /> : <AiHero c={c} onLink={onLink} />}

          <section className="mt-16">
            <div className="mb-4 flex items-end justify-between px-5">
              <SectionTitle fit={fit}>{c.highlightsLabel}</SectionTitle>
              {fit ? null : <OrbitStill name="yellow-think" className="-mb-3 -mr-2 w-[72px]" delay={0.6} />}
            </div>
            <Highlights items={c.highlights} fit={fit} onOpen={(id) => onLink(id, "highlight")} />
          </section>

          {c.pages.length ? (
            <section className="mt-16 px-5">
              <div className="relative">
                {fit ? null : (
                  <OrbitStill name="purple-happy" className="absolute -top-[62px] right-3 w-[84px]" delay={1.1} />
                )}
                <ul className="relative overflow-hidden rounded-[18px] border border-[var(--l-line)] bg-[var(--l-card)]">
                  {c.pages.map((page, i) => (
                    <li key={page.id} className={i ? "border-t border-[var(--l-line)]" : ""}>
                      <SmartLink
                        href={page.href}
                        onClick={() => onLink(page.id, "pages")}
                        className="flex items-center justify-between gap-4 px-4 py-3.5 transition-colors hover:bg-[var(--l-well)]"
                      >
                        <span className="min-w-0">
                          <span
                            className={
                              fit
                                ? "block text-[14px] font-bold uppercase tracking-[0.04em]"
                                : "block text-[15px] font-medium tracking-[-0.01em]"
                            }
                          >
                            {page.label}
                          </span>
                          <span className="block truncate text-[13px] text-[var(--l-muted)]">{page.note}</span>
                        </span>
                        <span aria-hidden className="text-[var(--l-muted)]">
                          →
                        </span>
                      </SmartLink>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ) : null}

          <Closing c={c} fit={fit} onLink={onLink} />
        </div>

        <footer className="mt-12 flex flex-col items-center gap-3 text-[12px] text-[var(--l-muted)]">
          {fit ? null : <OrbitLoop clip="friends" className="w-[140px]" />}
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
    <div
      className={`sticky top-0 z-40 flex justify-center px-5 pb-5 pt-3 ${
        fit ? "" : "bg-gradient-to-b from-[var(--l-bg)] from-60% to-transparent"
      }`}
    >
      <div
        role="tablist"
        aria-label="Choose a side"
        className={`relative grid w-[208px] grid-cols-2 rounded-full p-[3px] backdrop-blur-xl transition-colors duration-500 ${
          fit ? "bg-white/10 ring-1 ring-white/15" : "bg-white/80 ring-1 ring-black/[0.07] shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
        }`}
      >
        <span
          aria-hidden
          className={`absolute inset-y-[3px] left-[3px] w-[calc(50%-3px)] rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            fit ? "translate-x-full bg-[#f2f2f2]" : "translate-x-0 bg-[#191919]"
          }`}
        />
        {(["ai", "fit"] as const).map((m) => (
          <button
            key={m}
            role="tab"
            aria-selected={mode === m}
            onClick={() => onChange(m)}
            className={`relative z-10 h-8 rounded-full text-[12px] font-semibold tracking-[0.04em] transition-colors duration-300 ${
              mode === m ? (fit ? "text-[#0b0b0b]" : "text-white") : fit ? "text-white/60" : "text-[#73726e]"
            }`}
          >
            {content[m].tab}
          </button>
        ))}
      </div>
    </div>
  );
}

function Line({ c, className }: { c: ModeContent; className: string }) {
  return (
    <p className={className}>
      {c.line.before}
      <em className="font-serif text-[1.3em] italic leading-none text-[var(--l-fg)]">{c.line.em}</em>
      {c.line.after}
    </p>
  );
}

function AiHero({ c, onLink }: { c: ModeContent; onLink: (id: string, place: string) => void }) {
  return (
    <section className="px-5 pt-10">
      <div className="relative">
        <div className="relative z-10 overflow-hidden rounded-[22px] bg-[var(--l-well)] shadow-[0_1px_2px_rgba(0,0,0,0.05),0_18px_40px_-20px_rgba(0,0,0,0.35)] ring-1 ring-black/[0.06]">
          <Image
            src={c.photo.src}
            alt={c.photo.alt}
            width={c.photo.width}
            height={c.photo.height}
            priority
            sizes="(max-width: 440px) 100vw, 440px"
            className="aspect-[4/5] w-full object-cover object-[50%_42%]"
          />
        </div>
        <OrbitLoop clip="type" className="absolute -bottom-14 -left-6 z-20 w-[184px]" priority />
      </div>

      <div className="relative mt-16">
        {/* curious about the name, from the right edge */}
        <OrbitStill name="pink-curious" className="absolute -right-2 -top-6 w-[92px]" delay={0.3} />
        <h1 className="text-[30px] font-semibold leading-tight tracking-[-0.035em]">{c.name}</h1>
        <Line c={c} className="mt-2 max-w-[28ch] text-[16px] leading-[1.55] tracking-[-0.01em] text-[var(--l-muted)]" />
        <Socials c={c} fit={false} onLink={onLink} />
      </div>
    </section>
  );
}

function FitHero({ c, onLink }: { c: ModeContent; onLink: (id: string, place: string) => void }) {
  return (
    <section className="relative -mt-[70px]">
      <div className="relative">
        <Image
          src={c.photo.src}
          alt={c.photo.alt}
          width={c.photo.width}
          height={c.photo.height}
          priority
          sizes="(max-width: 440px) 100vw, 440px"
          className="aspect-[4/5] w-full object-cover object-[50%_40%]"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent to-[#0b0b0b]" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0b0b0b]/50 to-transparent" />
      </div>
      <div className="relative -mt-20 px-5">
        <h1 className="text-[72px] font-extrabold uppercase leading-[0.82] tracking-[-0.055em]">{c.name}</h1>
        <Line c={c} className="mt-4 max-w-[30ch] text-[15px] leading-[1.55] text-[var(--l-muted)]" />
        <Socials c={c} fit onLink={onLink} />
      </div>
    </section>
  );
}

const ICONS: Record<SocialIcon, ReactNode> = {
  instagram: <FaInstagram />,
  x: <FaXTwitter />,
  github: <FaGithub />,
  linkedin: <FaLinkedinIn />,
  youtube: <FaYoutube />,
  email: <FiMail />,
};

/** The usual link-in-bio row: one icon per account, side by side. */
function Socials({ c, fit, onLink }: { c: ModeContent; fit: boolean; onLink: (id: string, place: string) => void }) {
  return (
    <ul className="mt-6 flex flex-wrap gap-2.5">
      {c.socials.map((s) => (
        <li key={s.id}>
          <SmartLink
            href={s.href}
            aria-label={s.label}
            title={s.label}
            onClick={() => onLink(s.id, "social")}
            className={`flex h-11 w-11 items-center justify-center rounded-full text-[18px] transition-all duration-200 hover:-translate-y-0.5 ${
              fit
                ? "bg-white/[0.06] text-[#f2f2f2] ring-1 ring-white/15 hover:bg-white hover:text-[#0b0b0b]"
                : "bg-white text-[#191919] shadow-[0_1px_2px_rgba(0,0,0,0.05)] ring-1 ring-black/[0.08] hover:bg-[#191919] hover:text-white"
            }`}
          >
            {ICONS[s.icon]}
          </SmartLink>
        </li>
      ))}
    </ul>
  );
}

function SectionTitle({ children, fit }: { children: ReactNode; fit: boolean }) {
  return fit ? (
    <h2 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--l-muted)]">{children}</h2>
  ) : (
    <h2 className="text-[14px] font-medium tracking-[-0.01em] text-[var(--l-muted)]">{children}</h2>
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
    if (el && card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft - 20, behavior: "smooth" });
  };

  useEffect(() => {
    // Videos carry their own motion; only the AI cards advance by themselves.
    if (fit || reduced || touched || items.length < 2) return;
    const id = window.setInterval(() => goTo((active + 1) % items.length), 5000);
    return () => window.clearInterval(id);
  }, [active, fit, reduced, touched, items.length]);

  const onScroll = () => {
    const el = rail.current;
    if (!el) return;
    const left = el.scrollLeft;
    let best = 0;
    let bestDist = Infinity;
    Array.from(el.children).forEach((child, i) => {
      const dist = Math.abs((child as HTMLElement).offsetLeft - el.offsetLeft - 20 - left);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
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
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) =>
          item.kind === "video" ? (
            <VideoCard key={item.id} item={item} reduced={reduced} onOpen={onOpen} />
          ) : (
            <SmartLink
              key={item.id}
              href={item.href}
              onClick={() => onOpen(item.id)}
              className="group flex w-[80%] shrink-0 snap-start flex-col rounded-[20px] bg-[var(--l-card)] p-[18px] ring-1 ring-black/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
            >
              <span className="text-[12px] text-[var(--l-muted)]">{item.kicker}</span>
              <span className="mt-0.5 flex items-center gap-1.5 text-[19px] font-semibold tracking-[-0.03em]">
                {item.title}
                <FiArrowUpRight className="text-[15px] text-[var(--l-muted)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
              <span className="relative mt-4 block h-[300px] overflow-hidden rounded-[14px] bg-[var(--l-well)]">
                <CardVisual item={item} />
              </span>
            </SmartLink>
          ),
        )}
      </div>
      {items.length > 1 ? (
        <div className="mt-4 flex justify-center gap-1.5">
          {items.map((item, i) => (
            <button
              key={item.id}
              aria-label={`Show ${item.title}`}
              onClick={() => {
                setTouched(true);
                goTo(i);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active ? "w-4 bg-[var(--l-fg)]" : "w-1.5 bg-[var(--l-fg)]/20"
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function CardVisual({ item }: { item: Exclude<Highlight, { kind: "video" }> }) {
  switch (item.kind) {
    case "phone":
      return (
        <>
          <span className="absolute left-3.5 top-3.5 z-10 flex flex-col gap-1.5">
            {item.stats.map(([value, label]) => (
              <span
                key={label}
                className="rounded-[10px] bg-white/90 px-2.5 py-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.05] backdrop-blur"
              >
                <span className="block text-[15px] font-semibold leading-tight tracking-[-0.02em]">{value}</span>
                <span className="block text-[11px] leading-tight text-[var(--l-muted)]">{label}</span>
              </span>
            ))}
          </span>
          <span className="absolute -bottom-10 right-5 w-[52%] overflow-hidden rounded-[26px] border-[5px] border-[#1d1d1f] bg-black shadow-[0_20px_40px_-18px_rgba(0,0,0,0.5)]">
            <Image src={item.image} alt="" width={780} height={1688} sizes="180px" className="w-full" />
          </span>
        </>
      );
    case "screenshot":
      return (
        <span className="absolute left-5 top-6 w-[170%] overflow-hidden rounded-tl-[10px] shadow-[0_12px_30px_-12px_rgba(0,0,0,0.35)] ring-1 ring-black/[0.06]">
          <Image src={item.image} alt="" width={2880} height={1800} sizes="560px" className="w-full" />
        </span>
      );
    case "article":
      return (
        <span className="absolute inset-x-4 top-5 bottom-0 rounded-t-[12px] bg-white px-5 pt-5 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.25)] ring-1 ring-black/[0.05]">
          <span className="flex items-center gap-2 text-[11px] text-[var(--l-muted)]">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#ff333f] text-[10px] font-bold text-white">
              m
            </span>
            {item.source}
          </span>
          <span className="mt-4 block font-serif text-[23px] leading-[1.1] tracking-[-0.01em]">
            Automating the PM workflow with Claude Code Skills and MCP
          </span>
          <span className="mt-3 block text-[12.5px] leading-[1.55] text-[var(--l-muted)]">{item.excerpt}</span>
          <span className="mt-4 block space-y-2">
            <span className="block h-2 w-full rounded-full bg-[#f1f1ef]" />
            <span className="block h-2 w-[86%] rounded-full bg-[#f1f1ef]" />
            <span className="block h-2 w-[64%] rounded-full bg-[#f1f1ef]" />
          </span>
        </span>
      );
    case "terminal":
      return <MacTerminal lines={item.lines} />;
  }
}

/** A plain macOS Terminal window (Basic profile): light title bar, traffic lights, white body, SF-style mono. */
function MacTerminal({ lines }: { lines: string[] }) {
  return (
    <span className="absolute inset-x-4 top-6 bottom-0 flex flex-col overflow-hidden rounded-t-[10px] bg-white shadow-[0_0_0_0.5px_rgba(0,0,0,0.18),0_14px_30px_-14px_rgba(0,0,0,0.4)]">
      <span className="relative flex h-[28px] shrink-0 items-center border-b border-black/[0.08] bg-[#ececec] px-3">
        <span className="flex gap-[7px]">
          <span className="h-[11px] w-[11px] rounded-full bg-[#ff5f57] ring-[0.5px] ring-black/10" />
          <span className="h-[11px] w-[11px] rounded-full bg-[#febc2e] ring-[0.5px] ring-black/10" />
          <span className="h-[11px] w-[11px] rounded-full bg-[#28c840] ring-[0.5px] ring-black/10" />
        </span>
        <span className="absolute inset-x-0 text-center text-[11px] font-medium text-[#4d4d4d]">free — -zsh — 80×24</span>
      </span>
      <span className="block flex-1 px-3 py-2.5 font-mono text-[11.5px] leading-[1.65] text-[#1d1d1f]">
        {lines.map((line, i) =>
          line.startsWith("% ") ? (
            <span key={i} className="block truncate">
              <span className="text-[#8a8a8a]">shogo@mac free </span>
              {line}
            </span>
          ) : (
            <span key={i} className="block truncate">
              {line}
            </span>
          ),
        )}
        <span className="block">
          <span className="text-[#8a8a8a]">shogo@mac free % </span>
          <span className="inline-block h-[13px] w-[7px] translate-y-[2px] animate-pulse bg-[#1d1d1f]" />
        </span>
      </span>
    </span>
  );
}

/** A vertical edit, playing silently while it is on screen. */
function VideoCard({
  item,
  reduced,
  onOpen,
}: {
  item: Extract<Highlight, { kind: "video" }>;
  reduced: boolean;
  onOpen: (id: string) => void;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || reduced) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.6 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <SmartLink
      href={item.href}
      onClick={() => onOpen(item.id)}
      className="relative block w-[64%] shrink-0 snap-start overflow-hidden rounded-[18px] bg-[#141414] ring-1 ring-white/10"
    >
      <video
        ref={ref}
        src={item.video}
        poster={item.poster}
        muted
        loop
        playsInline
        preload="metadata"
        className="aspect-[9/16] w-full object-cover"
      />
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-4 pt-16">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60">{item.kicker}</span>
        <span className="mt-1 block text-[16px] font-semibold leading-tight tracking-[-0.02em] text-white">{item.title}</span>
      </span>
    </SmartLink>
  );
}

function Closing({ c, fit, onLink }: { c: ModeContent; fit: boolean; onLink: (id: string, place: string) => void }) {
  return (
    <section className="mt-20 px-5 text-center">
      {fit ? null : (
        <div className="mb-2 flex items-end justify-center gap-1">
          <OrbitLoop clip="cheer" className="w-[156px]" />
          <OrbitStill name="teal-cheer" className="-ml-4 mb-3 w-[96px]" delay={0.9} />
        </div>
      )}
      <p
        className={
          fit
            ? "text-[30px] font-extrabold uppercase leading-[0.95] tracking-[-0.04em]"
            : "text-[24px] font-semibold tracking-[-0.035em]"
        }
      >
        {c.closing.text}
      </p>
      <SmartLink
        href={c.closing.href}
        onClick={() => onLink("closing", "closing")}
        className={`mt-6 inline-flex h-11 items-center rounded-full px-6 text-[14px] font-semibold transition-transform hover:scale-[1.03] ${
          fit ? "bg-[#f2f2f2] text-[#0b0b0b]" : "bg-[#191919] text-white"
        }`}
      >
        {c.closing.cta}
      </SmartLink>
    </section>
  );
}

// ---- Orbit ----
// Every Orbit here is the Blender render from shorts-studio (scripts/orbit/orbit.py), never redrawn.
// Loops: a plain H.264 MP4 with the color on top and the alpha (as grey) below, recombined on a canvas.
// H.264 plays everywhere, iOS Safari and Instagram's in-app browser included, which transparent
// WebM/HEVC did not. Until the first frame is drawn (or if autoplay is refused, e.g. Low Power Mode,
// or the visitor prefers reduced motion) the still first frame shows instead.

type OrbitClip = "type" | "cheer" | "friends";
type OrbitStillName = "yellow-think" | "purple-happy" | "teal-cheer" | "pink-curious" | "white-type";

const LOOP_W = 400;
const LOOP_H = 366;

function OrbitLoop({ clip, className, priority }: { clip: OrbitClip; className?: string; priority?: boolean }) {
  const reduced = useReducedMotion();
  const wrap = useRef<HTMLSpanElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const v = video.current;
    const out = canvas.current?.getContext("2d");
    if (reduced || !v || !out || !wrap.current) return;

    const scratch = document.createElement("canvas");
    scratch.width = LOOP_W;
    scratch.height = LOOP_H * 2;
    const sctx = scratch.getContext("2d", { willReadFrequently: true });
    if (!sctx) return;

    let raf = 0;
    let drawn = false;
    const draw = () => {
      if (v.readyState >= 2) {
        sctx.drawImage(v, 0, 0, LOOP_W, LOOP_H * 2);
        const color = sctx.getImageData(0, 0, LOOP_W, LOOP_H);
        const mask = sctx.getImageData(0, LOOP_H, LOOP_W, LOOP_H).data;
        const px = color.data;
        for (let i = 0; i < px.length; i += 4) {
          // grey 0..255 is the alpha; a small floor keeps compression noise from tinting the page
          const a = mask[i] - 6;
          px[i + 3] = a <= 0 ? 0 : a >= 243 ? 255 : (a * 255) / 243;
        }
        out.putImageData(color, 0, 0);
        if (!drawn) {
          drawn = true;
          setLive(true);
        }
      }
      raf = requestAnimationFrame(draw);
    };

    // Only decode and composite while the loop is on screen.
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        v.play()
          .then(() => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(draw);
          })
          .catch(() => {});
      } else {
        v.pause();
        cancelAnimationFrame(raf);
      }
    });
    io.observe(wrap.current);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      v.pause();
    };
  }, [reduced]);

  return (
    <span ref={wrap} aria-hidden className={`pointer-events-none relative block select-none ${className ?? ""}`}>
      <Image
        src={`/links/orbit/${clip}.png`}
        alt=""
        width={LOOP_W}
        height={LOOP_H}
        priority={priority}
        className={`w-full transition-opacity duration-300 ${live ? "opacity-0" : "motion-safe:animate-[links-bob_3.4s_ease-in-out_infinite]"}`}
      />
      <canvas
        ref={canvas}
        width={LOOP_W}
        height={LOOP_H}
        className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${live ? "opacity-100" : "opacity-0"}`}
      />
      {reduced ? null : (
        <video
          ref={video}
          src={`/links/orbit/${clip}.mp4`}
          muted
          loop
          playsInline
          preload="auto"
          className="absolute left-0 top-0 h-px w-px opacity-0"
        />
      )}
    </span>
  );
}

function OrbitStill({ name, className, delay = 0 }: { name: OrbitStillName; className?: string; delay?: number }) {
  return (
    <span
      aria-hidden
      style={{ animationDelay: `${delay}s` }}
      className={`pointer-events-none block select-none motion-safe:animate-[links-bob_3.4s_ease-in-out_infinite] ${className ?? ""}`}
    >
      <Image src={`/links/orbit/${name}.png`} alt="" width={360} height={327} className="w-full" />
    </span>
  );
}
