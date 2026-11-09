"use client";

// /free/59 (dots vs Muse vs Grok Bot vs OpenMausBot): one small live figure per chapter, drawn for this site rather than cut
// from the reel or the launch films. Same language as /free/46–58: paper plate, ink lines, one accent (orange).
// Real (official pages read Nov 9, 2026): the four products' own taglines, plans, prices and regions, Grok Bot's roles and
// shared cloud computer, OpenMausBot's engines, run modes, approval cards, licence, stars and Cloud prices. The goals,
// errands, tasks and log lines inside the figures are examples. The mascots are each company's own characters.

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

export type AgentsDemoKind = "lineup" | "dots" | "muse" | "grok" | "maus" | "table";

export function AgentsDemo({ kind }: { kind: AgentsDemoKind }) {
  return (
    <div className="ag mt-5 max-w-2xl">
      <style>{AG_CSS}</style>
      {kind === "lineup" && <Lineup />}
      {kind === "dots" && <Dots />}
      {kind === "muse" && <Muse />}
      {kind === "grok" && <Grok />}
      {kind === "maus" && <Maus />}
      {kind === "table" && <Table />}
    </div>
  );
}

/** a clock that runs only while the figure is on screen; frozen with reduced motion */
function useClock() {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref, { amount: 0.2 });
  const reduce = useReducedMotion();
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!visible || reduce) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      setT((v) => v + dt);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, reduce]);
  return { ref, t, reduce: !!reduce };
}

const ramp = (t: number, a: number, b: number) => Math.max(0, Math.min(1, (t - a) / (b - a)));
const ease = (x: number) => 1 - (1 - x) ** 3;

function Button({ onClick, children, primary, disabled }: { onClick: () => void; children: React.ReactNode; primary?: boolean; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`ag-press rounded-full px-3.5 py-1.5 text-[13px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] disabled:opacity-40 ${primary ? "bg-[var(--ink)] text-white" : "border border-[var(--rule-strong)] bg-white text-[var(--ink)] hover:border-[var(--ink)]"}`}
    >
      {children}
    </button>
  );
}

function Toggle<T extends string>({ value, options, onChange, label }: { value: T; options: { id: T; label: string }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex max-w-full flex-wrap gap-1 rounded-[18px] bg-white p-1 shadow-[0_0_0_1px_var(--rule)]">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          onClick={() => onChange(o.id)}
          className={`ag-press whitespace-nowrap rounded-full px-2.5 py-1.5 font-mono text-[12px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] sm:px-3 ${value === o.id ? "bg-[var(--ink)] text-white" : "text-[var(--soft)] hover:text-[var(--ink)]"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ───────────── the four, with the facts every figure shares ───────────── */
type AgentId = "dots" | "muse" | "grok" | "maus";
type Agent = { id: AgentId; name: string; maker: string; img: string; pitch: string; job: string; where: string; local: boolean };
const AGENTS: Agent[] = [
  {
    id: "dots",
    name: "dots",
    maker: "OpenAI",
    img: "/free/59/dots.png",
    pitch: "“proactive assistants” that “work towards your goals 24/7”",
    job: "An always-on worker inside ChatGPT: give it an ongoing goal and your apps",
    where: "OpenAI’s cloud: each dot has its own cloud computer",
    local: false,
  },
  {
    id: "muse",
    name: "Muse",
    maker: "Meta",
    img: "/free/59/muse.png",
    pitch: "“a secure, private personal AI agent”",
    job: "A personal agent for everyday errands: bookings, shopping, forms, big goals",
    where: "Meta’s cloud: “its own dedicated computer in the cloud”",
    local: false,
  },
  {
    id: "grok",
    name: "Grok Bot",
    maker: "xAI",
    img: "/free/59/grok.png",
    pitch: "“your team of always-on agents”",
    job: "A team of bots with roles (sales, marketing, ops…) run by a chief of staff",
    where: "xAI’s cloud: the bots share one persistent cloud computer",
    local: false,
  },
  {
    id: "maus",
    name: "OpenMausBot",
    maker: "open source",
    img: "/free/59/maus_teal.svg",
    pitch: "“your team of AI bots”, “the open source Grok Bot alternative”",
    job: "Open-source bots you run yourself, on the model you choose",
    where: "Your computer: transcripts and keys stay in ~/.openmausbot",
    local: true,
  },
];

/** a mascot on a white tile; bobs gently while the figure is on screen */
function Mascot({ a, t, size = 56, phase = 0, dim }: { a: Agent; t: number; size?: number; phase?: number; dim?: boolean }) {
  const y = Math.sin(t * 2.2 + phase) * 2.5;
  return (
    <span
      className="relative flex shrink-0 items-center justify-center rounded-[22%] border border-[var(--rule)] bg-white transition-opacity duration-300"
      style={{ width: size, height: size, opacity: dim ? 0.35 : 1 }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={a.img} alt={`${a.name} (${a.maker})`} className="max-h-[78%] max-w-[78%] object-contain" style={{ transform: `translateY(${y}px)` }} />
    </span>
  );
}

function Plate({ n, title, sub, right }: { n: number; title: string; sub: string; right?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="min-w-0">
        <span className="flex items-baseline gap-2">
          <span className="font-mono text-[12px] text-[var(--accent)]">0{n}/06</span>
          <span className="truncate text-[15px] font-semibold text-[var(--ink)]">{title}</span>
        </span>
        <span className="block truncate font-mono text-[11.5px] text-[var(--muted)]">{sub}</span>
      </span>
      {right ? <span className="ml-auto shrink-0 text-right">{right}</span> : null}
    </div>
  );
}

function Sources({ links }: { links: { text: string; href: string }[] }) {
  return (
    <p className="mt-2 font-mono text-[10.5px] leading-relaxed text-[var(--muted)] [overflow-wrap:anywhere]">
      Source:{" "}
      {links.map((l, i) => (
        <span key={l.href}>
          {i ? " · " : ""}
          <a href={l.href} target="_blank" rel="noopener noreferrer" className="underline decoration-[var(--rule-strong)] underline-offset-2 hover:text-[var(--ink)]">
            {l.text}
          </a>
        </span>
      ))}
    </p>
  );
}

const SRC = {
  dotsPost: "https://openai.com/index/introducing-dots/",
  dotsHelp: "https://help.openai.com/en/articles/20001530-getting-started-with-your-dot",
  proTiers: "https://help.openai.com/en/articles/9793128-about-chatgpt-pro-tiers",
  musePost: "https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/",
  museSmb: "https://about.fb.com/news/2026/09/introducing-muse-small-business/",
  museSg: "https://about.fb.com/news/2026/10/muse-is-now-available-in-singapore-the-worlds-first-personal-ai-agent-built-for-everyone/",
  grokPost: "https://x.ai/news/introducing-grok-bot",
  grokDocs: "https://docs.x.ai/grok-bot/overview",
  xsubPost: "https://x.ai/news/x-subscription",
  xsubPricing: "https://docs.x.ai/x-subscription/pricing",
  mausRepo: "https://github.com/milind-soni/OpenMausBot",
  mausSite: "https://www.mausbot.com/",
};

/* ───────────── 01 lineup: same pitch, four different jobs ───────────── */
type Lens = "pitch" | "job" | "where";
const LENSES: { id: Lens; label: string }[] = [
  { id: "pitch", label: "their pitch" },
  { id: "job", label: "the actual job" },
  { id: "where", label: "where it runs" },
];
function Lineup() {
  const { ref, t } = useClock();
  const [lens, setLens] = useState<Lens>("pitch");
  const [t0, setT0] = useState(0);
  const s = t - t0;
  const pick = (l: Lens) => { setLens(l); setT0(t); };
  return (
    <figure ref={ref} className="ag-plate p-4 sm:p-6">
      <Plate n={1} title="Four agents, four kinds of work" sub="OpenAI · Meta · xAI · open source" />
      <Toggle value={lens} options={LENSES} onChange={pick} label="Compare by" />
      <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {AGENTS.map((a, i) => {
          const k = ease(ramp(s, i * 0.08, 0.35 + i * 0.08));
          const text = a[lens];
          return (
            <li key={a.id} className="ag-card flex items-start gap-3 py-2.5">
              <Mascot a={a} t={t} size={52} phase={i * 1.3} />
              <span className="min-w-0">
                <span className="flex items-baseline gap-1.5">
                  <span className="text-[14px] font-semibold text-[var(--ink)]">{a.name}</span>
                  <span className="font-mono text-[11px] text-[var(--muted)]">{a.maker}</span>
                  {lens === "where" && (
                    <span className="ml-1 rounded-full px-1.5 py-px font-mono text-[10px]" style={{ background: a.local ? "var(--accent)" : "var(--page)", color: a.local ? "#fff" : "var(--soft)" }}>
                      {a.local ? "local" : "cloud"}
                    </span>
                  )}
                </span>
                <span className="mt-0.5 block text-[12.5px] leading-snug text-[var(--soft)]" style={{ opacity: k, transform: `translateY(${(1 - k) * 4}px)` }}>
                  {text}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 min-h-[20px] text-center font-mono text-[11.5px] text-[var(--soft)]">
        {lens === "pitch" ? "All four promise an agent that works for you in the background." : lens === "job" ? "Underneath: a ChatGPT worker, a life assistant, a work team, and a do-it-yourself kit." : "Three run in the company’s cloud. One runs from your own machine."}
      </p>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        The quotes are each company&apos;s own launch words. Switch the lens to see what each one actually is and where your data goes.
      </figcaption>
      <Sources links={[{ text: "OpenAI", href: SRC.dotsPost }, { text: "Meta", href: SRC.musePost }, { text: "xAI", href: SRC.grokPost }, { text: "mausbot.com", href: SRC.mausSite }]} />
    </figure>
  );
}

/* ───────────── 02 dots: keeps working after you close the tab; who can get it ───────────── */
// the goal, the apps and the log lines are examples; "keeps working ... 24/7" and the access rule are OpenAI's
const DOTS_LOG = [
  "checked 3 new listings against your budget",
  "drafted a message to one landlord for you to send",
  "added a viewing slot to your calendar draft",
  "updated the shortlist in your doc",
  "nothing new: will check again later",
];
type Plan = "other" | "pro" | "bp";
type Region = "most" | "eu";
function Dots() {
  const { ref, t, reduce } = useClock();
  const [away, setAway] = useState(false);
  const [plan, setPlan] = useState<Plan>("pro");
  const [region, setRegion] = useState<Region>("most");
  const dots = AGENTS[0];
  const angle = reduce ? 0.6 : (t * 0.35) % 1; // one lap ≈ a day, sped up
  const shown = reduce ? 3 : Math.floor(t / 2.2) % (DOTS_LOG.length + 1);
  const cx = 70, cy = 70, r = 52;
  const px = cx + r * Math.sin(angle * Math.PI * 2), py = cy - r * Math.cos(angle * Math.PI * 2);
  const ok = plan === "bp" || (plan === "pro" && region === "most");
  const verdict =
    plan === "other"
      ? "Not included: at launch dots are for Pro and Business Premium only."
      : plan === "pro" && region === "eu"
        ? "Not at launch: Pro access excludes the EEA, Switzerland and the UK."
        : plan === "pro"
          ? "Eligible (18+, in a supported market). Rolling out gradually."
          : "Eligible (18+). The launch exclusion names Pro only. Rolling out gradually.";
  return (
    <figure ref={ref} className="ag-plate p-4 sm:p-6">
      <Plate n={2} title="dots" sub="OpenAI · inside ChatGPT · DevDay, Sep 29, 2026" right={<Mascot a={dots} t={t} size={44} />} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[150px_1fr] sm:items-center">
        <svg viewBox="0 0 140 140" className="mx-auto block w-[140px]" role="img" aria-label="A dot keeps circling a 24-hour dial, working whether ChatGPT is open or not">
          <circle cx={cx} cy={cy} r={r} fill="#fff" stroke="var(--rule-strong)" />
          {Array.from({ length: 24 }, (_, h) => {
            const a = (h / 24) * Math.PI * 2;
            return <line key={h} x1={cx + (r - 4) * Math.sin(a)} y1={cy - (r - 4) * Math.cos(a)} x2={cx + r * Math.sin(a)} y2={cy - r * Math.cos(a)} stroke="var(--rule-strong)" />;
          })}
          <path d={`M ${cx} ${cy - r} A ${r} ${r} 0 ${angle > 0.5 ? 1 : 0} 1 ${px} ${py}`} fill="none" stroke="var(--accent)" strokeWidth={2.5} strokeLinecap="round" />
          <circle cx={px} cy={py} r={5} fill="var(--accent)" />
          <text x={cx} y={cy - 2} textAnchor="middle" className="ag-svg-t">24/7</text>
          <text x={cx} y={cy + 13} textAnchor="middle" className="ag-svg-s">{away ? "you’re away" : "you’re here"}</text>
        </svg>
        <div className="min-w-0">
          <div className="ag-card">
            <span className="block font-mono text-[10.5px] uppercase tracking-[0.08em] text-[var(--muted)]">ongoing goal · example</span>
            <span className="block text-[13px] text-[var(--ink)]">Find me a flat under $2,000 and keep checking new listings.</span>
            <span className="mt-1.5 flex flex-wrap gap-1">
              {["Gmail", "Calendar", "Docs"].map((app) => (
                <span key={app} className="rounded-md border border-[var(--rule)] px-1.5 py-px font-mono text-[10.5px] text-[var(--soft)]">{app}</span>
              ))}
              <span className="font-mono text-[10.5px] text-[var(--muted)]">connected apps (example)</span>
            </span>
          </div>
          <div className="mt-2 min-h-[104px] overflow-hidden rounded-xl bg-[#15171a] p-3 font-mono text-[11.5px] leading-relaxed">
            <div className="text-[#868b92]">{away ? "# ChatGPT closed. The dot keeps going:" : "# ChatGPT open. The dot is working:"}</div>
            {DOTS_LOG.slice(0, shown).slice(-3).map((l) => (
              <div key={l} className="ag-in text-[#e7e7ea]"><span className="text-[#f5c26b]">●</span> {l}</div>
            ))}
          </div>
          <div className="mt-2">
            <Button onClick={() => setAway((v) => !v)} primary={!away}>{away ? "Open ChatGPT again" : "Close ChatGPT"}</Button>
          </div>
        </div>
      </div>
      <div className="mt-5 border-t border-[var(--rule)] pt-4">
        <p className="font-mono text-[11.5px] text-[var(--muted)]">Can I get it? Pick your plan and where you are.</p>
        <div className="mt-2 flex flex-col gap-2">
          <Toggle value={plan} options={[{ id: "other", label: "other plans" }, { id: "pro", label: "Pro · from $100/mo" }, { id: "bp", label: "Business Premium" }]} onChange={setPlan} label="ChatGPT plan" />
          <Toggle value={region} options={[{ id: "most", label: "supported market" }, { id: "eu", label: "EEA · Switzerland · UK" }]} onChange={setRegion} label="Where you are" />
        </div>
        <p className="ag-card mt-2 text-[13px]" style={{ borderColor: ok ? "var(--accent)" : "var(--rule-strong)" }}>
          <span className="font-mono text-[11px]" style={{ color: ok ? "var(--accent)" : "#e5413b" }}>{ok ? "YES" : "NO"}</span>{" "}
          <span className="text-[var(--ink)]">{verdict}</span>
        </p>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        The goal, the apps and the log are examples; the 24/7 dial is sped up. The access rule is OpenAI&apos;s release note of Sep 29, 2026. Pro comes in three tiers, $100, $200 and $500 a month. OpenAI lists no separate price for dots.
      </figcaption>
      <Sources links={[{ text: "Introducing dots", href: SRC.dotsPost }, { text: "Getting started with your dot", href: SRC.dotsHelp }, { text: "Pro tiers", href: SRC.proTiers }]} />
    </figure>
  );
}

/* ───────────── 03 Muse: pick an errand, watch its cloud computer do it ───────────── */
type Errand = "travel" | "email" | "form" | "goal";
// the steps are examples built from Meta's own verbs ("booking travel", "sending an email", "fill out forms", "big audacious goals")
const ERRANDS: Record<Errand, { label: string; url: string; steps: string[]; ask: string }> = {
  travel: { label: "Book travel", url: "flights.example.com", steps: ["opens a browser", "compares 3 flights for your dates", "fills in your details"], ask: "Book the 9:40 flight for $212?" },
  email: { label: "Send an email", url: "mail.example.com", steps: ["reads the thread", "drafts a reply in your tone"], ask: "Send this reply to Dana?" },
  form: { label: "Fill out a form", url: "dmv.example.gov", steps: ["opens the form", "fills 14 fields from what it knows", "attaches your photo"], ask: "Submit the form?" },
  goal: { label: "A big goal", url: "plan", steps: ["asks what you want", "writes a personalised plan", "works through it, step by step"], ask: "It comes back when something changes." },
};
const REGIONS = [
  { name: "US", since: "Sep 8, 2026" },
  { name: "Canada", since: "listed by Meta" },
  { name: "Singapore", since: "Oct 28, 2026" },
];
function Muse() {
  const { ref, t, reduce } = useClock();
  const [errand, setErrand] = useState<Errand>("travel");
  const [t0, setT0] = useState(0);
  const [answer, setAnswer] = useState<"" | "yes" | "no">("");
  const e = ERRANDS[errand];
  const s = reduce ? 99 : t - t0;
  const done = e.steps.filter((_, i) => s > 0.4 + i * 0.9).length;
  const asking = done === e.steps.length;
  const go = (id: Errand) => { setErrand(id); setT0(t); setAnswer(""); };
  const muse = AGENTS[1];
  return (
    <figure ref={ref} className="ag-plate p-4 sm:p-6">
      <Plate n={3} title="Muse" sub="Meta · personal agent · launched Sep 8, 2026" right={<Mascot a={muse} t={t} size={44} phase={1} />} />
      <Toggle value={errand} options={(Object.keys(ERRANDS) as Errand[]).map((id) => ({ id, label: ERRANDS[id].label }))} onChange={go} label="Errand" />
      <div className="mt-3 overflow-hidden rounded-xl border border-[var(--rule-strong)] bg-white">
        <div className="flex items-center gap-1.5 border-b border-[var(--rule)] bg-[var(--page)] px-3 py-1.5">
          {[0, 1, 2].map((i) => <span key={i} className="size-2 rounded-full bg-[var(--rule-strong)]" />)}
          <span className="ml-2 truncate rounded-md bg-white px-2 py-0.5 font-mono text-[10.5px] text-[var(--muted)]">Muse’s cloud computer · {e.url}</span>
        </div>
        <ol className="space-y-1 p-3">
          {e.steps.map((st, i) => {
            const on = i < done;
            const now = i === done && !asking;
            return (
              <li key={st} className="flex items-center gap-2 text-[13px]" style={{ opacity: on || now ? 1 : 0.35 }}>
                <span className={`flex size-4 shrink-0 items-center justify-center rounded-full font-mono text-[9px] ${on ? "bg-[var(--ink)] text-white" : now ? "ag-pulse bg-[var(--accent)]" : "border border-[var(--rule-strong)]"}`}>{on ? "✓" : ""}</span>
                <span className="text-[var(--ink)]">Muse {st}</span>
              </li>
            );
          })}
        </ol>
        <div className="min-h-[52px] border-t border-[var(--rule)] px-3 py-2.5">
          {asking && (
            <div className="ag-in flex flex-wrap items-center gap-2">
              <span className="text-[13px] text-[var(--ink)]">{e.ask}</span>
              {errand !== "goal" && !answer && (
                <>
                  <Button primary onClick={() => setAnswer("yes")}>Approve</Button>
                  <Button onClick={() => setAnswer("no")}>Not now</Button>
                </>
              )}
              {answer && <span className="font-mono text-[11.5px] text-[var(--soft)]">{answer === "yes" ? "done, and it tells you when it’s confirmed" : "it holds and waits for you"}</span>}
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-1.5">
        {REGIONS.map((r) => (
          <div key={r.name} className="ag-card px-2 py-1.5 text-center" style={{ borderColor: "var(--accent)" }}>
            <span className="block text-[13px] font-medium text-[var(--ink)]">{r.name}</span>
            <span className="block font-mono text-[10px] text-[var(--muted)]">{r.since}</span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-center font-mono text-[11.5px] text-[var(--soft)]">Price: “free for most of what people need, with subscription plans”</p>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        The errands are examples made from Meta&apos;s own list (booking travel, sending an email, filling out forms, big goals); the sites and amounts are made up. Meta says Muse runs on its own dedicated computer in the cloud and comes back when it needs approval. iOS, Android and muse.ai, in the three countries above.
      </figcaption>
      <Sources links={[{ text: "Introducing Muse", href: SRC.musePost }, { text: "Muse for small business (Canada)", href: SRC.museSmb }, { text: "Muse in Singapore", href: SRC.museSg }]} />
    </figure>
  );
}

/* ───────────── 04 Grok Bot: a chief of staff routes work to specialist bots on one shared computer ───────────── */
// roles from xAI's launch post; the tasks are examples
const ROLES = [
  { id: "sales", label: "Sales outbound", img: "/free/59/grok_orange.png", task: "Follow up with this week’s leads" },
  { id: "mkt", label: "Marketing", img: "/free/59/grok_purple.png", task: "Plan the launch campaign" },
  { id: "ops", label: "Operations", img: "/free/59/grok_teal.png", task: "Chase the overdue invoices" },
  { id: "inbox", label: "Inbox", img: "/free/59/grok_blue.png", task: "Triage my inbox" },
  { id: "hire", label: "Recruiting", img: "/free/59/grok_orange.png", task: "Screen the new applicants" },
  { id: "exp", label: "Expenses", img: "/free/59/grok_teal.png", task: "File last month’s receipts" },
] as const;
type Tier = "plus" | "premium" | "super" | "ultra";
const TIERS: { id: Tier; label: string; bot: boolean }[] = [
  { id: "plus", label: "Plus", bot: false },
  { id: "premium", label: "Premium $30", bot: true },
  { id: "super", label: "Super $100", bot: true },
  { id: "ultra", label: "Ultra $200", bot: true },
];
function Grok() {
  const { ref, t, reduce } = useClock();
  const [sent, setSent] = useState<{ role: number; at: number } | null>(null);
  const [tier, setTier] = useState<Tier>("premium");
  const s = sent ? (reduce ? 99 : t - sent.at) : -1;
  // a fixed-height box; positions are % of it. The svg only draws lines (non-scaling), so text stays readable on phones.
  const chief = { x: 50, y: 17 };
  const spots = ROLES.map((_, i) => ({ x: 8.5 + i * (83 / (ROLES.length - 1)), y: 52 }));
  const BAR = 84; // % from the top: the shared computer
  const p = ease(ramp(s, 0.2, 1.1));
  const target = sent ? spots[sent.role] : null;
  const working = !!sent && s > 1.1;
  const tierInfo = TIERS.find((x) => x.id === tier)!;
  return (
    <figure ref={ref} className="ag-plate p-4 sm:p-6">
      <Plate n={4} title="Grok Bot" sub="xAI · team of bots · beta since Aug 11, 2026" />
      <div className="relative h-[250px]" role="img" aria-label="A chief-of-staff bot sends tasks to six specialist bots, which share one cloud computer">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
          {spots.map((sp, i) => (
            <line key={i} x1={chief.x} y1={chief.y + 9} x2={sp.x} y2={sp.y - 7} stroke={sent?.role === i ? "var(--accent)" : "var(--ink)"} strokeOpacity={sent?.role === i ? 1 : 0.22} strokeWidth={sent?.role === i ? 1.6 : 1} vectorEffect="non-scaling-stroke" />
          ))}
          {spots.map((sp, i) => (
            <line key={`c${i}`} x1={sp.x} y1={sp.y + 17} x2={sp.x} y2={BAR - 7} stroke="var(--ink)" strokeOpacity={working && sent?.role === i ? 0.9 : 0.15} strokeDasharray="2 3" vectorEffect="non-scaling-stroke" />
          ))}
        </svg>
        {target && s < 1.1 && (
          <span className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)]" style={{ left: `${chief.x + (target.x - chief.x) * p}%`, top: `${chief.y + 9 + (target.y - 7 - chief.y - 9) * p}%` }} />
        )}
        <span className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${chief.x}%`, top: `${chief.y}%` }}>
          <Mascot a={AGENTS[2]} t={t} size={44} />
        </span>
        <span className="absolute -translate-y-1/2 font-mono text-[10.5px] text-[var(--muted)]" style={{ left: `calc(${chief.x}% + 30px)`, top: `${chief.y}%` }}>chief of staff</span>
        {spots.map((sp, i) => {
          const on = sent?.role === i;
          const hop = on && working && !reduce ? Math.abs(Math.sin((t - sent!.at) * 6)) * 4 : 0;
          return (
            <span key={i} className="absolute flex w-[16%] -translate-x-1/2 flex-col items-center transition-opacity duration-300" style={{ left: `${sp.x}%`, top: `calc(${sp.y}% - 16px)`, opacity: sent && !on ? 0.45 : 1 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ROLES[i].img} alt="" className="size-8 object-contain sm:size-9" style={{ transform: `translateY(${-hop}px)` }} />
              <span className={`mt-1 text-center font-mono text-[10px] leading-tight sm:text-[11px] ${on ? "text-[var(--ink)]" : "text-[var(--muted)]"}`}>{ROLES[i].label}</span>
            </span>
          );
        })}
        <div className="absolute inset-x-0 -translate-y-1/2 rounded-lg border px-2 py-1.5 text-center font-mono text-[10.5px] transition-colors duration-300 sm:text-[11.5px]" style={{ top: `${BAR}%`, borderColor: working ? "var(--accent)" : "var(--rule-strong)", background: working ? "#fff7f3" : "#fff", color: working ? "var(--ink)" : "var(--muted)" }}>
          one shared cloud computer · browser · files · terminal
        </div>
      </div>
      <p className="mt-2 font-mono text-[11.5px] text-[var(--muted)]">Hand the chief a task (examples):</p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {ROLES.map((r, i) => (
          <button key={r.id} type="button" onClick={() => setSent({ role: i, at: t })} aria-pressed={sent?.role === i} className="ag-press rounded-full border bg-white px-2.5 py-1 text-[12.5px] text-[var(--ink)]" style={{ borderColor: sent?.role === i ? "var(--accent)" : "var(--rule)" }}>
            {r.task}
          </button>
        ))}
      </div>
      <p className="mt-2 min-h-[20px] font-mono text-[11.5px] text-[var(--soft)]">
        {!sent ? "The chief of staff coordinates; each specialist bot owns one kind of work." : working ? `${ROLES[sent.role].label} bot is on it, on the same cloud computer the others use.` : "chief of staff → routing…"}
      </p>
      <div className="mt-4 border-t border-[var(--rule)] pt-4">
        <p className="font-mono text-[11.5px] text-[var(--muted)]">The X Subscription (since Oct 12, 2026), per month:</p>
        <div className="mt-2"><Toggle value={tier} options={TIERS.map((x) => ({ id: x.id, label: x.label }))} onChange={setTier} label="X Subscription tier" /></div>
        <p className="ag-card mt-2 text-[13px]" style={{ borderColor: tierInfo.bot ? "var(--accent)" : "var(--rule-strong)" }}>
          <span className="font-mono text-[11px]" style={{ color: tierInfo.bot ? "var(--accent)" : "#e5413b" }}>{tierInfo.bot ? "INCLUDED" : "NOT INCLUDED"}</span>{" "}
          <span className="text-[var(--ink)]">{tierInfo.bot ? "Grok Bot comes with Premium, Super and Ultra." : "“Plus does not include Grok Bot.”"}</span>
        </p>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        The roles are from xAI&apos;s launch post (inbox, expenses, recruiting, operations, sales outbound, marketing campaigns, coordinated by a chief-of-staff bot); the tasks are examples. xAI: &ldquo;your Bots share a persistent cloud computer with a browser, filesystem, and terminal.&rdquo; Existing SuperGrok and Cursor plans that already include it keep it. It is still labelled beta.
      </figcaption>
      <Sources links={[{ text: "Introducing Grok Bot", href: SRC.grokPost }, { text: "Grok Bot docs", href: SRC.grokDocs }, { text: "X Subscription pricing", href: SRC.xsubPricing }]} />
    </figure>
  );
}

/* ───────────── 05 OpenMausBot: your machine, your model, approval before risky steps ───────────── */
const STARS = 18_993; // GitHub API, Nov 9, 2026
const ENGINES = [
  { id: "claude", label: "claude" },
  { id: "codex", label: "codex" },
  { id: "grok", label: "grok" },
  { id: "compat", label: "other" },
];
type RunMode = "cloud" | "vm" | "host";
const MODES: { id: RunMode; label: string; says: string }[] = [
  { id: "cloud", label: "cloud desktop", says: "A cloud Linux desktop for the bot to use." },
  { id: "vm", label: "local VM", says: "An isolated virtual machine on your computer." },
  { id: "host", label: "your computer", says: "Opt-in only, on macOS and Ubuntu Xorg." },
];
// the task and its steps are examples; the approval card is the product's ("Approve what matters")
const MAUS_STEPS = ["opens the browser", "finds the 40 people who replied", "drafts one follow-up email"];
const CLOUD = [
  { name: "Starter", price: 15 },
  { name: "Pro", price: 49 },
  { name: "Max", price: 99 },
];
function Maus() {
  const { ref, t, reduce } = useClock();
  const [engine, setEngine] = useState("claude");
  const [mode, setMode] = useState<RunMode>("vm");
  const [run, setRun] = useState<number | null>(null);
  const [answer, setAnswer] = useState<"" | "yes" | "no">("");
  const s = run === null ? -1 : reduce ? 99 : t - run;
  const done = run === null ? 0 : MAUS_STEPS.filter((_, i) => s > 0.4 + i * 0.8).length;
  const asking = run !== null && done === MAUS_STEPS.length;
  const start = () => { setRun(t); setAnswer(""); };
  const maus = AGENTS[3];
  return (
    <figure ref={ref} className="ag-plate p-4 sm:p-6">
      <Plate
        n={5}
        title="OpenMausBot"
        sub="milind-soni/OpenMausBot · Apache-2.0"
        right={
          <>
            <span className="block font-mono text-[14px] font-semibold tabular-nums text-[var(--ink)]">★ {STARS.toLocaleString("en-US")}</span>
            <span className="block font-mono text-[10.5px] text-[var(--muted)]">stars · Nov 9, 2026</span>
          </>
        }
      />
      <div className="flex items-start gap-3">
        <Mascot a={maus} t={t} size={52} phase={2} />
        <div className="min-w-0 flex-1 space-y-2">
          <div>
            <p className="font-mono text-[11px] text-[var(--muted)]">model · you bring the account or key</p>
            <div className="mt-1"><Toggle value={engine} options={ENGINES} onChange={setEngine} label="Model" /></div>
            <p className="mt-1 text-[12.5px] text-[var(--soft)]">
              {engine === "compat" ? "Any OpenAI-compatible endpoint, e.g. Gemini or a local Ollama." : `Runs on the ${engine} CLI installed on your machine.`}
            </p>
          </div>
          <div>
            <p className="font-mono text-[11px] text-[var(--muted)]">where the bot works</p>
            <div className="mt-1"><Toggle value={mode} options={MODES.map((m) => ({ id: m.id, label: m.label }))} onChange={setMode} label="Where the bot works" /></div>
            <p className="mt-1 text-[12.5px] text-[var(--soft)]">{MODES.find((m) => m.id === mode)!.says}</p>
          </div>
        </div>
      </div>
      <div className="mt-3 overflow-hidden rounded-xl bg-[#15171a] p-3.5 font-mono text-[11.5px] leading-relaxed sm:text-[12px]">
        <div className="text-[#868b92]"># task (example): follow up with everyone who replied · engine: {engine === "compat" ? "openai-compatible" : engine}</div>
        {MAUS_STEPS.slice(0, done).map((st) => (
          <div key={st} className="ag-in text-[#e7e7ea]"><span className="text-[#a6e3a1]">✓</span> bot {st}</div>
        ))}
        {run === null && <div className="text-[#868b92]"># press Run</div>}
        <div className="text-[#868b92]"># transcripts, keys, events → ~/.openmausbot (not a cloud)</div>
      </div>
      <div className="mt-2 min-h-[74px]">
        {asking && (
          <div className="ag-in ag-card" style={{ borderColor: "var(--accent)" }}>
            <span className="block font-mono text-[10.5px] uppercase tracking-[0.08em] text-[var(--accent)]">approval needed</span>
            <span className="block text-[13px] text-[var(--ink)]">Send 40 emails from your account?</span>
            {!answer ? (
              <span className="mt-1.5 flex gap-2">
                <Button primary onClick={() => setAnswer("yes")}>Approve</Button>
                <Button onClick={() => setAnswer("no")}>Deny</Button>
              </span>
            ) : (
              <span className="mt-1 block font-mono text-[11.5px] text-[var(--soft)]">{answer === "yes" ? "sent. Nothing risky ran before you said yes." : "denied. The bot stops and nothing is sent."}</span>
            )}
          </div>
        )}
      </div>
      <div className="mt-1 flex flex-wrap gap-2">
        <Button primary onClick={start}>{run === null ? "Run" : "Run again"}</Button>
      </div>
      <div className="mt-4 border-t border-[var(--rule)] pt-4">
        <p className="font-mono text-[11.5px] text-[var(--muted)]">what it costs</p>
        <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-3">
          <div className="ag-card"><span className="block font-mono text-[15px] font-semibold text-[var(--ink)]">$0</span><span className="block text-[12px] text-[var(--soft)]">the desktop app (open source)</span></div>
          <div className="ag-card"><span className="block font-mono text-[15px] font-semibold text-[var(--ink)]">your plan</span><span className="block text-[12px] text-[var(--soft)]">the model provider bills you; their limits apply</span></div>
          <div className="ag-card" style={{ borderStyle: "dashed" }}>
            <span className="block font-mono text-[15px] font-semibold text-[var(--ink)]">{CLOUD.map((c) => `$${c.price}`).join(" / ")}</span>
            <span className="block text-[12px] text-[var(--soft)]">optional Cloud ({CLOUD.map((c) => c.name).join(", ")}) a month, to keep bots running while your machine is off</span>
          </div>
        </div>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        The task is an example. The engines, run modes, approval cards and the ~/.openmausbot folder are from the README; phone access is optional and off by default. Without Cloud, bots only work while your computer is awake. Your prompts still go to whichever model provider you pick. Not affiliated with xAI, Meta or OpenAI.
      </figcaption>
      <Sources links={[{ text: "github.com/milind-soni/OpenMausBot", href: SRC.mausRepo }, { text: "mausbot.com (pricing)", href: SRC.mausSite }]} />
    </figure>
  );
}

/* ───────────── 06 the table: pick a row, or say what you need ───────────── */
type Row = "price" | "privacy" | "strength" | "limit";
const ROWS: { id: Row; label: string }[] = [
  { id: "price", label: "Pricing" },
  { id: "privacy", label: "Privacy" },
  { id: "strength", label: "Strengths" },
  { id: "limit", label: "Limits" },
];
const TABLE: Record<Row, Record<AgentId, string>> = {
  price: { dots: "ChatGPT Pro from $100/mo", muse: "free tier, paid plans", grok: "X Premium $30/mo", maus: "free app, pay your model" },
  privacy: { dots: "OpenAI cloud", muse: "Meta’s servers", grok: "xAI’s servers", maus: "your own disk" },
  strength: { dots: "inside ChatGPT, apps", muse: "everyday errands", grok: "bot teams", maus: "any model, local" },
  limit: { dots: "not in UK/EU at launch", muse: "US, Canada, Singapore", grok: "Grok models", maus: "fewer integrations" },
};
const NEEDS: { id: string; label: string; fit: AgentId; why: string }[] = [
  { id: "chatgpt", label: "I already live in ChatGPT", fit: "dots", why: "dots work inside ChatGPT with your connected apps (Pro or Business Premium)." },
  { id: "errands", label: "Help with life admin, cheaply", fit: "muse", why: "Muse is free for most errands, if you’re in the US, Canada or Singapore." },
  { id: "team", label: "A team for sales and ops", fit: "grok", why: "Grok Bot gives each bot a role under a chief of staff, from $30 a month." },
  { id: "local", label: "Keep my data on my disk", fit: "maus", why: "OpenMausBot keeps transcripts and keys on your machine and runs the model you pick." },
];
function Table() {
  const { ref, t } = useClock();
  const [row, setRow] = useState<Row>("price");
  const [need, setNeed] = useState<string | null>(null);
  const fit = NEEDS.find((n) => n.id === need) ?? null;
  return (
    <figure ref={ref} className="ag-plate p-4 sm:p-6">
      <Plate n={6} title="Side by side" sub="pick a row, or say what you need" />
      <Toggle value={row} options={ROWS} onChange={(r) => setRow(r)} label="Row" />
      <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {AGENTS.map((a, i) => {
          const on = !fit || fit.fit === a.id;
          return (
            <li key={a.id} className="ag-card flex flex-col items-center px-2 py-3 text-center transition-[opacity,box-shadow] duration-300" style={{ opacity: on ? 1 : 0.4, boxShadow: fit?.fit === a.id ? "0 0 0 1.5px var(--accent)" : undefined }}>
              <Mascot a={a} t={t} size={44} phase={i * 1.3} />
              <span className="mt-1.5 text-[13.5px] font-semibold text-[var(--ink)]">{a.name}</span>
              <span className="font-mono text-[10.5px] text-[var(--muted)]">{a.maker}</span>
              <span key={row} className="ag-in mt-2 text-[12.5px] leading-snug text-[var(--ink)]">{TABLE[row][a.id]}</span>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 font-mono text-[11.5px] text-[var(--muted)]">What do you need?</p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {NEEDS.map((n) => (
          <button key={n.id} type="button" aria-pressed={need === n.id} onClick={() => setNeed((v) => (v === n.id ? null : n.id))} className="ag-press rounded-full border bg-white px-2.5 py-1 text-[12.5px] text-[var(--ink)]" style={{ borderColor: need === n.id ? "var(--accent)" : "var(--rule)" }}>
            {n.label}
          </button>
        ))}
      </div>
      <p className="mt-2 min-h-[40px] text-[12.5px] leading-snug text-[var(--soft)]">{fit ? fit.why : "Tap a need to light up the agent that fits it. Tap again to clear."}</p>
      <div className="mt-3 overflow-x-auto rounded-lg border border-[var(--rule)] bg-white">
        <table className="w-full min-w-[520px] text-left text-[12.5px] leading-snug">
          <thead className="bg-[var(--page)] font-mono text-[10.5px] uppercase tracking-[0.06em] text-[var(--muted)]">
            <tr>
              <th className="px-2.5 py-2 font-normal" />
              {AGENTS.map((a) => <th key={a.id} className="px-2.5 py-2 font-normal" style={{ color: fit?.fit === a.id ? "var(--accent)" : undefined }}>{a.name}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--rule)]">
            {ROWS.map((r) => (
              <tr key={r.id} onClick={() => setRow(r.id)} className="cursor-pointer align-top transition-colors" style={{ background: row === r.id ? "#fff7f3" : undefined }}>
                <td className="whitespace-nowrap px-2.5 py-2 font-mono text-[11px] text-[var(--muted)]">{r.label}</td>
                {AGENTS.map((a) => <td key={a.id} className="px-2.5 py-2 text-[var(--ink)]" style={{ opacity: !fit || fit.fit === a.id ? 1 : 0.45 }}>{TABLE[r.id][a.id]}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        As of Nov 9, 2026. dots also come with ChatGPT Business Premium; Pro is not in the EEA, Switzerland or the UK at launch. Grok Bot is in X Subscription Premium, Super and Ultra. OpenMausBot&apos;s optional Cloud is $15 to $99 a month. Every row above has its source in the chapter for that agent.
      </figcaption>
    </figure>
  );
}

const AG_CSS = `
.ag{--page:#f3f4f1;--ink:#15171a;--soft:#4a4f56;--muted:#868b92;--rule:#dcded9;--rule-strong:#c4c7c2;--accent:#d77757}
.ag-plate{border-radius:18px;background-color:var(--page);background-image:linear-gradient(to right,rgba(21,23,26,.045) 1px,transparent 1px),linear-gradient(to bottom,rgba(21,23,26,.045) 1px,transparent 1px);background-size:28px 28px;box-shadow:0 0 0 1px var(--rule),0 30px 70px -48px rgba(21,23,26,.45)}
.ag-card{border-radius:12px;border:1px solid var(--rule);background:#fff;padding:7px 11px;font-size:13.5px;line-height:1.35}
.ag-press{transition:transform .45s cubic-bezier(.34,1.56,.64,1),border-color .2s,opacity .2s,color .2s,background-color .2s,box-shadow .2s}
.ag-press:active:not(:disabled){transform:scale(.97)}
.ag-svg-t{font:600 15px ui-monospace,SFMono-Regular,Menlo,monospace;fill:var(--ink)}
.ag-svg-s{font:11px ui-monospace,SFMono-Regular,Menlo,monospace;fill:var(--muted)}
@keyframes ag-in{from{opacity:0;transform:translateY(-4px)}}
.ag-in{animation:ag-in .3s ease-out}
@keyframes ag-pulse{50%{opacity:.35}}
.ag-pulse{animation:ag-pulse 1s ease-in-out infinite}
@media (prefers-reduced-motion:reduce){.ag-in,.ag-pulse{animation:none}}
`;
