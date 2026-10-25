"use client";

import { createContext, useContext, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaInstagram, FaLinkedinIn, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { FiBriefcase, FiGrid, FiMail, FiTool } from "react-icons/fi";
import { parseSource, type ButtonIcon, type LinksMode, type ModeContent, type SocialIcon } from "@/lib/links";
import { markJourney } from "@/lib/linksJourney";
import LinksCoachingForm from "./LinksCoachingForm";
import LinksContactForm from "./LinksContactForm";
import "./links.css";

// Speed first: the page is static, both sides are in the HTML, and switching sides only flips
// html[data-links] (set before first paint by the script in page.tsx). No re-render, no refetch.
// Motion is CSS only (links.css), so no animation library ships with the page.
// Layout follows Linktree (Shogo, 2026-10-25): round avatar, name, icons, then buttons or the form.

type OnLink = (id: string, place: string) => void;

// Tracking goes to our own endpoint (src/app/api/links/event) and is read back on /admin/links.
// sendBeacon survives the page being left right after a click, and never delays navigation.
function send(event: { kind: "view" | "click" | "mode"; mode: LinksMode; src: string; target?: string; place?: string }) {
  const body = JSON.stringify(event);
  if (!navigator.sendBeacon?.("/api/links/event", new Blob([body], { type: "application/json" }))) {
    fetch("/api/links/event", { method: "POST", body, keepalive: true, headers: { "Content-Type": "application/json" } }).catch(
      () => {},
    );
  }
}

const getMode = (): LinksMode => (document.documentElement.getAttribute("data-links") === "fit" ? "fit" : "ai");
const subscribeMode = (cb: () => void) => {
  window.addEventListener("links-mode", cb);
  return () => window.removeEventListener("links-mode", cb);
};
const useLinksMode = (serverMode: LinksMode) => useSyncExternalStore(subscribeMode, getMode, () => serverMode);

const isExternal = (href: string) => /^(https?:|mailto:)/.test(href);

/** External links open in a new tab; knot's own pages go through next/link; "#id" scrolls within the page. */
function SmartLink({ href, onClick, ...rest }: React.ComponentProps<"a"> & { href: string }) {
  if (href.startsWith("#")) {
    // Never hand a hash to next/link: after the side switch the router still thinks it is on the other
    // route (/links vs /links/fit), so "#coach" became a navigation that tore down the switched page.
    return (
      <a
        href={href}
        onClick={(e) => {
          onClick?.(e);
          e.preventDefault();
          document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
        {...rest}
      />
    );
  }
  if (href.startsWith("mailto:")) return <a href={href} onClick={onClick} {...rest} />;
  return isExternal(href) ? (
    <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} {...rest} />
  ) : (
    <Link href={href} onClick={onClick} {...rest} />
  );
}

/** false while this side has never been shown: its media stays out of the page entirely */
const LoadMedia = createContext(true);

export default function LinksPage({
  content,
  defaultMode,
}: {
  content: Record<LinksMode, ModeContent>;
  /** the side this URL opens on; shown by CSS even before the inline script has run */
  defaultMode: LinksMode;
}) {
  const mode = useLinksMode(defaultMode);
  const source = useRef("direct");
  // A side's images and Orbits are only put in the page once that side has been shown,
  // so opening one side never downloads the other side's media.
  const [seen, setSeen] = useState<LinksMode[]>([defaultMode]);
  const shows = (pane: LinksMode) => mode === pane || seen.includes(pane);

  useEffect(() => {
    const root = document.documentElement;
    source.current = parseSource(new URLSearchParams(window.location.search).get("src") ?? undefined);
    // One view per page load, tagged with the side it opened on and the bio link it came from.
    send({ kind: "view", mode: getMode(), src: source.current });
    // Lets the rest of the site record which pages this visit goes on to (src/app/components/LinksJourney.tsx).
    markJourney({ mode: getMode(), src: source.current });

    // Scroll reveal: one observer for the whole page; each element animates in once.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -6% 0px" },
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
      // Leaving /links: hand the page back to the rest of the site untouched.
      root.removeAttribute("data-links");
      root.removeAttribute("data-links-js");
      root.removeAttribute("data-links-switched");
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", "#ffffff");
    };
  }, []);

  const switchMode = (next: LinksMode) => {
    if (next === getMode()) return;
    setSeen((s) => (s.includes(next) ? s : [...s, next]));
    document.documentElement.setAttribute("data-links-switched", "");
    document.documentElement.setAttribute("data-links", next);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", next === "fit" ? "#0b0b0b" : "#fbfbfa");
    window.dispatchEvent(new Event("links-mode"));
    window.scrollTo({ top: 0 });
    markJourney({ mode: next, src: source.current });
    send({ kind: "mode", mode: next, src: source.current, target: next });
    // Keep the choice in the URL so a shared or reloaded link opens the same side.
    const url = new URL(window.location.href);
    url.pathname = next === "fit" ? "/links/fit" : "/links";
    url.searchParams.delete("m");
    window.history.replaceState(window.history.state, "", url);
  };

  const onLink: OnLink = (id, place) => send({ kind: "click", mode: getMode(), src: source.current, target: id, place });

  return (
    <main data-default={defaultMode} className="min-h-screen overflow-x-clip">
      <div className="mx-auto max-w-[440px] pb-14">
        <ModeSwitch mode={mode} content={content} onChange={switchMode} />
        <div data-pane="ai">
          <LoadMedia.Provider value={shows("ai")}>
            <Side c={content.ai} fit={false} onLink={onLink} />
          </LoadMedia.Provider>
        </div>
        <div data-pane="fit">
          <LoadMedia.Provider value={shows("fit")}>
            <Side c={content.fit} fit onLink={onLink} />
          </LoadMedia.Provider>
        </div>
      </div>
    </main>
  );
}

function Side({ c, fit, onLink }: { c: ModeContent; fit: boolean; onLink: OnLink }) {
  return (
    <>
      <Hero c={c} fit={fit} onLink={onLink} />

      {c.buttons.length ? <Buttons c={c} fit={fit} onLink={onLink} /> : null}

      <Closing c={c} fit={fit} onLink={onLink} />

      <footer className="mt-12 flex flex-col items-center gap-3 text-[12px] text-[var(--l-muted)]">
        {fit ? null : <OrbitStill name="friends" className="w-[140px]" delay={0.4} />}
        <Link href="/" onClick={() => onLink("home", "footer")} className="transition-colors hover:text-[var(--l-fg)]">
          shogo.build
        </Link>
      </footer>
    </>
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
  return (
    <div className="pointer-events-none sticky top-0 z-40 flex justify-center px-5 pb-3 pt-3">
      <div
        role="tablist"
        aria-label="Choose a side"
        className="lg pointer-events-auto relative grid w-[212px] grid-cols-2 rounded-full p-[3px]"
      >
        <span aria-hidden className="links-pill absolute inset-y-[3px] left-[3px] w-[calc(50%-3px)] rounded-full" />
        {(["ai", "fit"] as const).map((m) => (
          <button
            key={m}
            role="tab"
            data-for={m}
            aria-selected={mode === m}
            onClick={() => onChange(m)}
            className="links-tab press relative z-10 h-8 rounded-full text-[12px] font-semibold tracking-[0.04em]"
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

function Avatar({ c, fit }: { c: ModeContent; fit: boolean }) {
  // render.tsx preloads the URL's side; the other side's avatar is not in the page until it is opened.
  const load = useContext(LoadMedia);
  return (
    <span
      className={`block h-[88px] w-[88px] overflow-hidden rounded-full bg-[var(--l-well)] ${
        fit ? "ring-1 ring-white/15" : "shadow-[0_1px_2px_rgba(0,0,0,0.05),0_12px_28px_-14px_rgba(0,0,0,0.45)] ring-1 ring-black/[0.06]"
      }`}
    >
      {load ? (
        // eslint-disable-next-line @next/next/no-img-element -- a 320px square crop, preloaded by name before paint
        <img src={c.avatar.src} alt={c.avatar.alt} width={320} height={320} decoding="async" className="h-full w-full object-cover" />
      ) : null}
    </span>
  );
}

function Hero({ c, fit, onLink }: { c: ModeContent; fit: boolean; onLink: OnLink }) {
  return (
    <section className="relative mt-6 px-5">
      {fit ? null : <OrbitStill name="pink-curious" className="absolute right-3 top-0 w-[92px]" delay={0.3} />}
      <Avatar c={c} fit={fit} />
      <h1
        className={
          fit
            ? "mt-5 text-[56px] font-extrabold uppercase leading-[0.85] tracking-[-0.055em]"
            : "mt-5 text-[30px] font-semibold leading-tight tracking-[-0.035em]"
        }
      >
        {c.name}
      </h1>
      <Line
        c={c}
        className={
          fit
            ? "mt-3 max-w-[30ch] text-[15px] leading-[1.55] text-[var(--l-muted)]"
            : "mt-2 max-w-[28ch] text-[16px] leading-[1.55] tracking-[-0.01em] text-[var(--l-muted)]"
        }
      />
      <Socials c={c} onLink={onLink} />
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

/** The usual link-in-bio row: one glass icon per account, side by side, arriving one after another. */
function Socials({ c, onLink }: { c: ModeContent; onLink: OnLink }) {
  return (
    <ul className="mt-6 flex flex-wrap gap-2.5">
      {c.socials.map((s) => (
        <li key={s.id}>
          <SmartLink
            href={s.href}
            aria-label={s.label}
            title={s.label}
            onClick={() => onLink(s.id, "social")}
            className="lg press flex h-11 w-11 items-center justify-center rounded-full text-[18px] text-[var(--l-fg)] hover:bg-[var(--l-fg)] hover:text-[var(--l-bg)]"
          >
            {ICONS[s.icon]}
          </SmartLink>
        </li>
      ))}
    </ul>
  );
}

/** Thin line icons (Feather), one per button, so the rows read at a glance without competing with the label. */
const BUTTON_ICONS: Record<ButtonIcon, ReactNode> = {
  tools: <FiTool />,
  portfolio: <FiGrid />,
  company: <FiBriefcase />,
};

/** Linktree-style buttons: full width, icon on the left, label centred, all visible on the first screen. */
function Buttons({ c, fit, onLink }: { c: ModeContent; fit: boolean; onLink: OnLink }) {
  return (
    <section className="relative mt-10 px-5">
      {fit ? null : <OrbitStill name="purple-happy" className="absolute -top-[58px] right-4 w-[80px]" delay={1.1} />}
      <ul className="relative grid gap-3">
        {c.buttons.map((b) => (
          <li key={b.id}>
            <SmartLink
              href={b.href}
              onClick={() => onLink(b.id, "button")}
              className="press grid h-14 grid-cols-[24px_1fr_24px] items-center gap-3 rounded-[16px] border border-[var(--l-line)] bg-[var(--l-card)] px-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors duration-300 hover:bg-[var(--l-well)]"
            >
              <span aria-hidden className="flex justify-center text-[18px] text-[var(--l-muted)]">
                {BUTTON_ICONS[b.icon]}
              </span>
              <span className="text-center text-[15px] font-medium tracking-[-0.01em]">{b.label}</span>
              <span aria-hidden />
            </SmartLink>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Closing({ c, fit, onLink }: { c: ModeContent; fit: boolean; onLink: OnLink }) {
  return (
    // scroll-mt clears the sticky AI / FITNESS switch when a "#coach" style link jumps here
    <section id={c.closing.id} data-reveal className={`${fit ? "mt-12" : "mt-20"} scroll-mt-16 px-5 text-center`}>
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
      <p className="mx-auto mt-2 max-w-[34ch] text-[14px] leading-[1.55] text-[var(--l-muted)]">{c.closing.note}</p>
      {/* the form right here, so nobody has to leave the page (or open a DM) to write */}
      {c.closing.form === "coaching" ? (
        <LinksCoachingForm onSent={() => onLink("coaching_sent", "closing")} />
      ) : (
        <LinksContactForm onSent={() => onLink("contact_sent", "closing")} />
      )}
    </section>
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

// ---- Orbit ----
// Every Orbit here is the Blender render from shorts-studio (scripts/orbit/orbit.py), never redrawn.
// Loops: a plain H.264 MP4 with the color on top and the alpha (as grey) below, recombined on a canvas.
// H.264 plays everywhere, iOS Safari and Instagram's in-app browser included, which transparent
// WebM/HEVC did not. Nothing downloads until the loop is on screen; until its first frame is drawn
// (or if autoplay is refused, e.g. Low Power Mode, or the visitor prefers reduced motion) the still shows.

type OrbitClip = "type" | "cheer";
type OrbitStillName = "yellow-think" | "purple-happy" | "teal-cheer" | "pink-curious" | "friends";

const LOOP_W = 400;
const LOOP_H = 366;

type FrameVideo = HTMLVideoElement & {
  requestVideoFrameCallback?: (cb: () => void) => number;
  cancelVideoFrameCallback?: (id: number) => void;
};

function OrbitLoop({ clip, className }: { clip: OrbitClip; className?: string }) {
  const load = useContext(LoadMedia);
  return load ? <OrbitLoopInner clip={clip} className={className} /> : null;
}

function OrbitLoopInner({ clip, className }: { clip: OrbitClip; className?: string }) {
  const reduced = useReducedMotion();
  const wrap = useRef<HTMLSpanElement>(null);
  const video = useRef<FrameVideo>(null);
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

    let handle = 0;
    let running = false;
    let drawn = false;
    const composite = () => {
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
    };
    // Composite once per decoded video frame (30 fps), not once per display refresh.
    const tick = () => {
      if (!running) return;
      if (v.readyState >= 2) composite();
      handle = v.requestVideoFrameCallback ? v.requestVideoFrameCallback(tick) : requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      if (v.cancelVideoFrameCallback) v.cancelVideoFrameCallback(handle);
      else cancelAnimationFrame(handle);
    };

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        v.play()
          .then(() => {
            if (running) return;
            running = true;
            tick();
          })
          .catch(() => {});
      } else {
        v.pause();
        stop();
      }
    });
    io.observe(wrap.current);
    return () => {
      io.disconnect();
      stop();
      v.pause();
    };
  }, [reduced]);

  return (
    // outer span takes the caller's position (often absolute); the inner one anchors the canvas
    <span ref={wrap} aria-hidden className={`pointer-events-none block select-none ${className ?? ""}`}>
      <span className="relative block">
        <Image
          src={`/links/orbit/${clip}.png`}
          alt=""
          width={LOOP_W}
          height={LOOP_H}
          className={`w-full transition-opacity duration-300 ${live ? "opacity-0" : "links-bob"}`}
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
            preload="none"
            className="absolute left-0 top-0 h-px w-px opacity-0"
          />
        )}
      </span>
    </span>
  );
}

function OrbitStill({ name, className, delay = 0 }: { name: OrbitStillName; className?: string; delay?: number }) {
  const load = useContext(LoadMedia);
  if (!load) return null;
  return (
    <span
      aria-hidden
      style={{ animationDelay: `${delay}s` }}
      className={`links-bob pointer-events-none block select-none ${className ?? ""}`}
    >
      <Image src={`/links/orbit/${name}.png`} alt="" width={400} height={364} className="w-full" />
    </span>
  );
}
