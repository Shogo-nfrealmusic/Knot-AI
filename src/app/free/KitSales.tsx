import { IconArrowUpRight, IconCheck, IconX } from "@tabler/icons-react";

// Sales section for a paid kit drop (/free/05). Kit's own checkout does the payment; this page does the explaining.
// Media lives in /public/free/05 (real screen recordings of toni.shogo.build and the NORTH ROAST verification build).

const M = (f: string) => `/free/05/${f}`;

function Clip({ src, poster, className = "" }: { src: string; poster: string; className?: string }) {
  return (
    <video
      src={M(src)}
      poster={M(poster)}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      className={`block w-full rounded-lg border border-neutral-200 bg-neutral-100 ${className}`}
    />
  );
}

/** Launch pricing: the regular price is struck through only because it really goes up after launchEnds (Shogo, 2026-09-27). */
function PriceTag({ price, regular, launchEnds, center = false }: { price: string; regular?: string; launchEnds?: string; center?: boolean }) {
  if (!regular) return null;
  return (
    <p className={`mt-3 text-sm text-neutral-500 ${center ? "text-center" : ""}`}>
      <span className="mr-2 text-neutral-400 line-through">{regular}</span>
      <span className="font-semibold text-neutral-900">{price}</span>
      {launchEnds ? <span> · launch price until {launchEnds}, then {regular}</span> : null}
    </p>
  );
}

function BuyButton({ href, price, className = "" }: { href: string; price: string; className?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-neutral-900 px-6 text-[15px] font-medium text-white transition-all hover:ring-4 hover:ring-black/10 ${className}`}
    >
      Get the kit · {price}
      <IconArrowUpRight className="size-4 opacity-70" />
    </a>
  );
}

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="grid grid-cols-1 gap-6 border-t border-neutral-200 px-5 py-12 sm:px-10 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] md:gap-10 md:py-16">
    <p className="font-mono text-[13px] text-warm">{label}</p>
    <div>{children}</div>
  </div>
);

const H = ({ children }: { children: React.ReactNode }) => (
  <h2 className="max-w-xl text-balance text-2xl font-medium tracking-[-0.03em] text-neutral-900 sm:text-3xl">{children}</h2>
);
const P = ({ children }: { children: React.ReactNode }) => (
  <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-neutral-600">{children}</p>
);

export function KitSales({ href, price, regular, launchEnds }: { href: string; price: string; regular?: string; launchEnds?: string }) {
  return (
    <div>
      {/* 1. the result */}
      <div className="px-5 pb-12 pt-10 sm:px-10 md:pb-16">
        <Clip src="toni-scroll.mp4" poster="toni-poster.jpg" />
        <div className="mt-8 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-[13px] text-warm">WHAT YOU&apos;LL BUILD</p>
            <p className="mt-3 max-w-xl text-balance text-xl font-medium tracking-[-0.02em] text-neutral-900 sm:text-2xl">
              A product site where the product turns, opens and moves through a day as you scroll. Sharp on a Retina
              laptop, 60 fps on a phone.
            </p>
            <a
              href="https://toni.shogo.build"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-sm text-neutral-500 underline-offset-4 hover:text-neutral-900 hover:underline"
            >
              Try the live site: toni.shogo.build <IconArrowUpRight className="size-3.5" />
            </a>
          </div>
          <div className="w-full md:w-auto">
            <BuyButton href={href} price={price} className="w-full md:w-auto" />
            <PriceTag price={price} regular={regular} launchEnds={launchEnds} />
          </div>
        </div>
      </div>

      {/* 2. why AI alone doesn't get you there */}
      <Row label="WHY IT'S HARD">
        <H>You can&apos;t get this by asking an AI for &quot;a 3D website&quot;.</H>
        <P>
          Ask ChatGPT and you get a spinning sphere on a dark page. That&apos;s the $50 site in the reel. The $5,000
          version is a pipeline: generated keyframes that keep the label intact, video that turns in the right
          direction, frames that stay sharp at 3× pixel density, and scrolling that doesn&apos;t stutter. Every step
          has a way to fail. This kit is the version that works, with each failure written down.
        </P>
        <div className="mt-8 grid grid-cols-2 gap-4">
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={M("gen_section1_frameA-v1.jpg")} alt="First attempt: brand text missing" className="w-full rounded-lg border border-neutral-200" />
            <figcaption className="mt-2 flex items-center gap-1.5 text-xs text-neutral-500"><IconX className="size-3.5 text-red-500" /> v1: brand text missing</figcaption>
          </figure>
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={M("gen_section1_frameA-v2.jpg")} alt="Fixed: every element present" className="w-full rounded-lg border border-neutral-200" />
            <figcaption className="mt-2 flex items-center gap-1.5 text-xs text-neutral-500"><IconCheck className="size-3.5 text-emerald-600" /> v2: fixed with the prompt in the kit</figcaption>
          </figure>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={M("gen_section1_sheet-clip1-kling-v1.jpg")} alt="Frame-by-frame check of a video where the label breaks mid-rotation" className="mt-4 w-full rounded-lg border border-neutral-200" />
        <p className="mt-2 text-xs text-neutral-500">Looks fine at full speed. Frame by frame, the label breaks mid-spin. The kit tells you which model to use for which shot.</p>
      </Row>

      {/* 3. proof it transfers */}
      <Row label="TESTED ON A NEW PRODUCT">
        <H>Then I rebuilt it for a different product, using only the kit.</H>
        <P>
          A fictional cold brew with a black can and a dark palette, nothing like the original. It took 30 minutes of generation
          and build time, and every video worked on the first take.
        </P>
        <div className="mt-8 grid grid-cols-[minmax(0,3fr)_minmax(0,1fr)] items-start gap-4">
          <Clip src="northroast-scroll.mp4" poster="northroast-poster.jpg" />
          <Clip src="northroast-phone.mp4" poster="phone-poster.jpg" />
        </div>
        <dl className="mt-8 grid grid-cols-3 divide-x divide-neutral-200 rounded-lg border border-neutral-200">
          {[
            ["272", "Higgsfield credits"],
            ["~30 min", "generation + build"],
            ["60 fps", "on phone, 0 dropped frames"],
          ].map(([v, l]) => (
            <div key={l} className="px-4 py-5">
              <dt className="text-2xl font-semibold tracking-[-0.03em] text-neutral-900 sm:text-3xl">{v}</dt>
              <dd className="mt-1 text-xs text-neutral-500">{l}</dd>
            </div>
          ))}
        </dl>
      </Row>

      {/* 4. what you get */}
      <Row label="WHAT'S INSIDE">
        <H>Everything I figured out, packaged so you skip the months.</H>
        <ul className="mt-8 divide-y divide-neutral-200 border-y border-neutral-200">
          {[
            ["10-page guide", "The process, the technique, the real costs (1,484 credits for the full site, ~350 for the minimal one), and the 19 rounds of feedback that took it from “60/100” to premium."],
            ["Starter project", "A Next.js project that already works: the scroll-driven frame player, smooth scrolling and a demo page. Run npm run dev and it's scrubbing."],
            ["Prompt pack", "The exact Higgsfield prompts and API settings that keep a label from melting, plus the ones that failed and why."],
            ["Scripts", "Video → sharp, color-matched frames for desktop and phone. Seamless loops. Product cut-outs. A performance audit."],
            ["Instructions for Claude Code", "Fill-in-the-blanks BRIEF.md and CLAUDE.md. Drop in your product, send one line, and Claude Code follows the same process."],
          ].map(([t, d]) => (
            <li key={t} className="grid grid-cols-1 gap-1 py-5 sm:grid-cols-[12rem_1fr] sm:gap-6">
              <span className="text-[15px] font-semibold text-neutral-900">{t}</span>
              <span className="text-[15px] leading-relaxed text-neutral-600">{d}</span>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <Clip src="toni-flavors.mp4" poster="flavors-poster.jpg" />
          <p className="mt-2 text-xs text-neutral-500">Six flavor variants for 0 extra credits: the recoloring trick is in the kit.</p>
        </div>
      </Row>

      {/* 5. who it's for */}
      <Row label="WHAT IT'S FOR">
        <H>A site that makes a product look worth more.</H>
        <ul className="mt-6 space-y-3">
          {[
            "Launch your own product with a page that looks like a funded brand's.",
            "Build these for clients. Premium product sites sell for thousands.",
            "Learn the pipeline once, then reuse it for every product you make.",
          ].map((t) => (
            <li key={t} className="flex items-start gap-3 text-[15px] leading-relaxed text-neutral-700">
              <IconCheck className="mt-1 size-4 shrink-0 text-emerald-600" />
              {t}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-neutral-500">
          You&apos;ll need Claude Code, a Higgsfield plan (the minimal build uses about 300 to 350 credits), Node.js, ffmpeg, Python,
          and your product&apos;s design. No deep coding: you run commands and talk to Claude Code.
        </p>
      </Row>

      {/* 6. buy */}
      <div className="flex flex-col items-center border-t border-neutral-200 px-5 py-16 text-center sm:py-20">
        <p className="font-mono text-[13px] text-warm">ONE PAYMENT · INSTANT DOWNLOAD</p>
        <h2 className="mt-4 max-w-lg text-balance text-3xl font-medium tracking-[-0.03em] text-neutral-900">
          The $5,000 3D website, for {price}.
        </h2>
        <BuyButton href={href} price={price} className="mt-8 w-full max-w-xs" />
        <PriceTag price={price} regular={regular} launchEnds={launchEnds} center />
        <p className="mt-4 max-w-md text-xs leading-relaxed text-neutral-500">
          Secure checkout by Kit. Use it for your own and your clients&apos; sites; please don&apos;t resell the kit.
        </p>
      </div>
    </div>
  );
}
