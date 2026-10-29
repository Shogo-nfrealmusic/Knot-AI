import Image from "next/image";

// The six cards under the hero. Each visual is a small piece of real UI, the thing the client actually gets,
// animated with CSS only (paused for reduced motion in SETUP_CSS).

function CardShell({ label, text, children, wide }: { label: string; text: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <li className={`su-card ${wide ? "lg:col-span-2" : ""}`}>
      <div className="relative z-10 p-7 pb-0">
        <p className="text-[15px] font-medium text-neutral-900">{label}</p>
        <p className="mt-1.5 max-w-[34ch] text-pretty text-[14px] leading-relaxed text-neutral-500">{text}</p>
      </div>
      <div className="relative mt-6 h-[230px] overflow-hidden">{children}</div>
    </li>
  );
}

const RULES: [string, string][] = [
  ["goal", '"double bookings before March"'],
  ["tone", '"direct, no fluff"'],
  ["push_back_when", '"I chase a shiny new tool"'],
  ["never", '"email a customer without asking"'],
  ["report", '"Mondays, one page, numbers first"'],
  ["tools", '"Stripe, Gmail, Notion, GitHub"'],
];

function ClaudeMd() {
  return (
    <div className="absolute inset-x-7 top-0 bottom-[-20px]">
      <div className="su-panel h-full">
      <span className="su-beam" aria-hidden />
      <div className="flex items-center gap-2 border-b border-neutral-200 px-4 py-2.5 font-mono text-[11px] text-neutral-400">
        <span className="size-1.5 rounded-full bg-[#ff6b3d]" />
        CLAUDE.md
      </div>
      <div className="space-y-2 px-4 py-3 font-mono text-[12px] leading-snug">
        {RULES.map(([key, value], i) => (
          <div key={key} className="su-row flex gap-3" style={{ "--i": i } as React.CSSProperties}>
            <span className="w-[110px] shrink-0 text-neutral-400">{key}</span>
            <span className="truncate text-neutral-700">{value}</span>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}

const JOBS: [string, string][] = [
  ["02:00", "Nightly video, written and rendered"],
  ["07:30", "Morning brief on bookings"],
  ["1st", "Books drafted for the accountant"],
  ["Fri", "Weekly numbers, one page"],
];

function Schedule() {
  return (
    <div className="absolute inset-x-7 top-0">
      <p className="mb-3 text-[12px] text-neutral-400">Running on schedule</p>
      <div className="relative">
        <span className="su-select" aria-hidden />
        {JOBS.map(([when, job]) => (
          <div key={when} className="relative z-10 flex h-11 items-center gap-4 px-3 text-[13px]">
            <span className="w-11 font-mono text-[12px] text-neutral-400">{when}</span>
            <span className="text-neutral-700">{job}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Verifier() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="su-glow-orange" aria-hidden />
      <div className="su-panel relative w-[min(300px,85%)] p-4">
        <div className="flex items-center justify-between">
          <span className="rounded-full border border-emerald-500/30 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-600">
            Verifier
          </span>
          <span className="font-mono text-[11px] text-neutral-400">agent 2 of 2</span>
        </div>
        <div className="relative mt-4 h-10 text-[13px]">
          <p className="su-swap su-swap-a absolute inset-0">
            <span className="text-neutral-400">Checking: </span>
            <span className="text-neutral-700">October books vs. the bank</span>
          </p>
          <p className="su-swap su-swap-b absolute inset-0">
            <span className="text-emerald-600">Checked. </span>
            <span className="text-neutral-700">3 entries sent back to fix</span>
          </p>
        </div>
      </div>
    </div>
  );
}

const TOOLS = [
  { src: "/setup/logos/github.svg", pos: "left-[12%] top-[16%]", invert: true },
  { src: "/setup/logos/gmail.svg", pos: "left-[8%] bottom-[18%]" },
  { src: "/setup/logos/stripe.svg", pos: "right-[12%] top-[16%]" },
  { src: "/setup/logos/notion.svg", pos: "right-[8%] bottom-[18%]", invert: true },
];

function Tools() {
  return (
    <div className="absolute inset-0">
      <div className="su-grid" aria-hidden />
      <svg viewBox="0 0 360 230" className="absolute inset-0 size-full" preserveAspectRatio="none" aria-hidden>
        {[
          "M180 115 C 130 115, 100 60, 60 50",
          "M180 115 C 130 115, 100 170, 50 182",
          "M180 115 C 230 115, 260 60, 300 50",
          "M180 115 C 230 115, 260 170, 310 182",
        ].map((d, i) => (
          <path key={d} d={d} className="su-wire" style={{ "--i": i } as React.CSSProperties} />
        ))}
      </svg>
      {TOOLS.map((tool) => (
        <span key={tool.src} className={`su-chip absolute ${tool.pos}`}>
          <Image src={tool.src} alt="" width={22} height={22}  />
        </span>
      ))}
      <span className="su-core absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Image src="/setup/logos/claude.svg" alt="" width={34} height={34} />
      </span>
      <span className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-[11px] text-neutral-600">
        <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
        MCP online
      </span>
    </div>
  );
}

function WhileYouSleep() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="su-pill relative flex w-[min(420px,88%)] items-center gap-4 rounded-full px-3 py-3">
        <span className="relative flex size-12 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50">
          <Image src="/setup/orbit-type.png" alt="" width={44} height={40} className="translate-y-0.5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] text-neutral-500">
            Drafting this month&apos;s books<span className="su-dots" />
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-200">
            <div className="su-progress h-full rounded-full bg-gradient-to-r from-[#ff6b3d] to-[#ffb38a]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Brief() {
  return (
    <div className="absolute inset-x-7 top-4 bottom-0">
      <div className="su-panel p-5 text-[14px] leading-relaxed">
        <p className="text-[11px] text-neutral-400">Morning brief, 07:30</p>
        <p className="mt-2 text-neutral-700">
          <span className="text-neutral-900">4 new bookings</span>, 2 for next week. Revenue is 12% ahead of last month.
        </p>
        <p className="mt-2 text-neutral-700">
          <span className="text-[var(--warm)]">Needs you:</span> approve the refund for one booking.
        </p>
        <p className="mt-2 text-neutral-400">Done overnight: books drafted, 3 reviews answered, Friday&apos;s report queued.</p>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
    </div>
  );
}

export default function Cards() {
  return (
    <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      <CardShell label="Knows your business" text="A CLAUDE.md written from an interview with you: your goal, your rules, when to push back.">
        <ClaudeMd />
      </CardShell>
      <CardShell label="Jobs on a schedule" text="The repeat work, done at the same time every day, week or month.">
        <Schedule />
      </CardShell>
      <CardShell label="Checks its own work" text="A second agent reviews every result. The one that did the work never grades it.">
        <Verifier />
      </CardShell>
      <CardShell label="Plugs into your tools" text="Stripe, Gmail, Notion, GitHub and the rest, through MCP. No new app to learn.">
        <Tools />
      </CardShell>
      <CardShell label="Works while you sleep" text="Long jobs run overnight. You wake up to finished work, not a to-do list.">
        <WhileYouSleep />
      </CardShell>
      <CardShell label="You read one page" text="Everything it did comes back as a short brief, with only the decisions left for you.">
        <Brief />
      </CardShell>
    </ul>
  );
}
