"use client";

import { useEffect, useState } from "react";

const QUOTES = `「AI で業務を楽にしたい」
「問い合わせや事務を減らしたい」
「見せ方も整えたい」`;

const TAGLINE_EN = "Beyond tools — workflow that fits.";

const BODY = `そんな課題に対して、単にツールを入れるだけでなく、いまの業務の流れに合わせて無理なく使える形に落とし込むことを大切にしています。何から始めればいいかまだはっきりしない段階でも、事業に合った進め方をご提案します。`;

const MS_PER_CHAR = 24;
const PAUSE_AFTER_QUOTES_MS = 400;
const PAUSE_AFTER_EN_MS = 450;

function Cursor() {
  return (
    <span
      className="ml-0.5 inline-block h-[1em] w-px animate-pulse bg-accent align-[-0.12em]"
      aria-hidden
    />
  );
}

/** 最終テキストと同じ量の高さを最初から確保（下のセクションのジャンプを防ぐ） */
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
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced) {
      setQuoteShown(QUOTES);
      setEnShown(TAGLINE_EN);
      setBodyShown(BODY);
      setDone(true);
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

  const typingQuote = !done && quoteShown.length < QUOTES.length;
  const typingEn =
    !done &&
    quoteShown.length === QUOTES.length &&
    enShown.length < TAGLINE_EN.length;
  const typingBody =
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
          {quoteShown}
          {typingQuote && <Cursor />}
        </p>

        <p className="mt-4 whitespace-pre-line text-text-secondary" lang="en">
          {enShown}
          {typingEn && <Cursor />}
        </p>

        <p className="mt-4 text-text-secondary">
          {bodyShown}
          {typingBody && <Cursor />}
        </p>
      </div>
    </div>
  );
}
