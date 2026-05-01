"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const QUOTES = `"We have AI tools."
"We need operating leverage."
"We need systems people will actually use."`;

const TAGLINE_EN = "Knot turns AI capability into operational practice.";

const BODY = `We help mid-sized companies move beyond AI experimentation and embed working AI systems directly into day-to-day operations.`;

const MS_PER_CHAR = 24;
const PAUSE_AFTER_QUOTES_MS = 400;
const PAUSE_AFTER_EN_MS = 450;

function subscribeToReducedMotion(onStoreChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerReducedMotionSnapshot() {
  return false;
}

function Cursor() {
  return (
    <span
      className="ml-0.5 inline-block h-[1em] w-px animate-pulse bg-accent align-[-0.12em]"
      aria-hidden
    />
  );
}

/** Reserve the final text height so sections below do not jump while typing. */
function LayoutSpacer() {
  return (
    <div
      className="invisible pointer-events-none select-none"
      aria-hidden
    >
      <p className="whitespace-pre-line text-text-primary">{QUOTES}</p>
      <p className="mt-4 whitespace-pre-line text-text-secondary" lang="en">
        {TAGLINE_EN}
      </p>
      <p className="mt-4 text-text-secondary">{BODY}</p>
    </div>
  );
}

export default function StatementTyper() {
  const [quoteShown, setQuoteShown] = useState("");
  const [enShown, setEnShown] = useState("");
  const [bodyShown, setBodyShown] = useState("");
  const [done, setDone] = useState(false);
  const reduced = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot,
  );

  useEffect(() => {
    if (reduced) {
      return;
    }

    let cancelled = false;
    const intervals: number[] = [];
    const timeouts: number[] = [];

    let qi = 0;
    const quoteIv = window.setInterval(() => {
      if (cancelled) return;
      qi += 1;
      setQuoteShown(QUOTES.slice(0, qi));
      if (qi >= QUOTES.length) {
        window.clearInterval(quoteIv);
        const t1 = window.setTimeout(() => {
          if (cancelled) return;
          let ei = 0;
          const enIv = window.setInterval(() => {
            if (cancelled) return;
            ei += 1;
            setEnShown(TAGLINE_EN.slice(0, ei));
            if (ei >= TAGLINE_EN.length) {
              window.clearInterval(enIv);
              const t2 = window.setTimeout(() => {
                if (cancelled) return;
                let bi = 0;
                const bodyIv = window.setInterval(() => {
                  if (cancelled) return;
                  bi += 1;
                  setBodyShown(BODY.slice(0, bi));
                  if (bi >= BODY.length) {
                    window.clearInterval(bodyIv);
                    setDone(true);
                  }
                }, MS_PER_CHAR);
                intervals.push(bodyIv);
              }, PAUSE_AFTER_EN_MS);
              timeouts.push(t2);
            }
          }, MS_PER_CHAR);
          intervals.push(enIv);
        }, PAUSE_AFTER_QUOTES_MS);
        timeouts.push(t1);
      }
    }, MS_PER_CHAR);
    intervals.push(quoteIv);

    return () => {
      cancelled = true;
      intervals.forEach((id) => window.clearInterval(id));
      timeouts.forEach((id) => window.clearTimeout(id));
    };
  }, [reduced]);

  const displayedQuote = reduced ? QUOTES : quoteShown;
  const displayedEn = reduced ? TAGLINE_EN : enShown;
  const displayedBody = reduced ? BODY : bodyShown;
  const typingQuote = !reduced && !done && quoteShown.length < QUOTES.length;
  const typingEn =
    !reduced &&
    !done &&
    quoteShown.length === QUOTES.length &&
    enShown.length < TAGLINE_EN.length;
  const typingBody =
    !reduced &&
    !done &&
    enShown.length === TAGLINE_EN.length &&
    bodyShown.length < BODY.length;

  return (
    <div
      className="relative text-[clamp(1.75rem,3.5vw,3rem)] font-semibold leading-[1.1] tracking-[-0.022em]"
    >
      <LayoutSpacer />
      <div className="absolute left-0 top-0 right-0" aria-live="polite">
        <p className="whitespace-pre-line text-text-primary">
          {displayedQuote}
          {typingQuote && <Cursor />}
        </p>

        <p className="mt-4 whitespace-pre-line text-text-secondary" lang="en">
          {displayedEn}
          {typingEn && <Cursor />}
        </p>

        <p className="mt-4 text-text-secondary">
          {displayedBody}
          {typingBody && <Cursor />}
        </p>
      </div>
    </div>
  );
}
