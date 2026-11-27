"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { CodeBlock } from "@/app/free/CodeCopy";
import {
  CHECKED_ON,
  CHECKPOINTS,
  DESKTOP_QUOTE,
  DOCTOR,
  LAB,
  LESSONS,
  PLAN_QUOTE,
  QUICKSTART_URL,
  SETUP_URL,
  TOTAL_CHECKS,
  VERSION_CHECK,
  commandsFor,
  fillPrompt,
  type Os,
} from "../data";
import { useDone, useOs } from "../store";
import { ApprovalLanes, EndState, FolderReach, PathFigure, PlanGate, RealShot } from "./Figures";

const SPRING = { type: "spring", stiffness: 260, damping: 28 } as const;

/* ───────────── page ───────────── */

export function StartHere() {
  const [done, toggle] = useDone();
  const [os, setOs] = useOs();
  const active = useActiveLesson();
  const article = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: article, offset: ["start 120px", "end end"] });
  const read = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });
  const c = commandsFor(os);
  const lessonDone = (id: string) => {
    const mine = id === "lab" ? LAB.map((l) => l.id) : CHECKPOINTS.filter((k) => k.lesson === id).map((k) => k.id);
    return mine.length > 0 && mine.every((m) => done.includes(m));
  };

  return (
    <div className="gd relative overflow-x-clip pb-10 pt-14">
      <MobileBar active={active} read={read} count={done.length} />
      <Hero os={os} setOs={setOs} />
      <PathFigure />

      <div ref={article} className="mx-auto grid max-w-[1180px] gap-12 px-5 sm:px-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
        <Rail active={active} read={read} lessonDone={lessonDone} count={done.length} />

        <div className="min-w-0 max-w-[760px]">
          <Lesson id="need" code="S.1" title="What you need" accent="and nothing else.">
            <Prose>
              <p>Three things. If you have the first two, you can start today.</p>
            </Prose>
            <dl className="mt-6 max-w-[62ch] divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
              <Spec k="Mac" v="macOS 13 or later" on={os === "mac"} />
              <Spec k="Windows" v="Windows 10 (version 1809) or later" on={os === "windows"} />
              <Spec k="Linux" v="Ubuntu 20.04+, Debian 10+, or Alpine 3.19+" on={os === "linux"} />
              <Spec k="Memory" v="4 GB or more" />
              <Spec k="Claude plan" v="A paid plan. Pro is enough to start." />
            </dl>
            <PlanGate quote={PLAN_QUOTE} />
            <Prose>
              <p>
                <strong>Nothing else.</strong> The recommended installer needs no Node.js, and no CS degree. On Windows, Git for Windows is optional:
                without it, Claude Code uses PowerShell.
              </p>
            </Prose>
            <Checkpoint id="ready" done={done} toggle={toggle} />
          </Lesson>

          <Lesson id="door" code="S.2" title="Pick your door." accent="Both are official.">
            <Prose>
              <p>There are two ways in, and both run the same Claude Code. The docs: &ldquo;{DESKTOP_QUOTE}&rdquo;</p>
            </Prose>
            <Prose>
              <p>
                <strong>My advice: use the terminal.</strong> It is ten minutes of discomfort, and every lesson after this assumes it. If you want the app
                first, download it from the <a className="gd-link" href={SETUP_URL} target="_blank" rel="noreferrer">official setup page</a> and come
                back to Lesson S.3 later.
              </p>
            </Prose>
          </Lesson>

          <Lesson id="install" code="S.3" title="Install it." accent="One line.">
            <Steps>
              <Step n={1} title={`Open ${c.shell === "PowerShell" ? "PowerShell" : "the terminal"}`}>
                {os === "windows" ? (
                  <p>
                    Press the <Key>Windows</Key> key, type <Key>PowerShell</Key>, press <Key>Enter</Key>.
                  </p>
                ) : os === "mac" ? (
                  <p>
                    Press <Key>Command</Key> + <Key>Space</Key>, type <Key>Terminal</Key>, press <Key>Enter</Key>.
                  </p>
                ) : (
                  <p>Open your terminal app.</p>
                )}
              </Step>
              <Step n={2} title="Paste one line and press Enter">
                <div className="mt-4">
                  <CodeBlock size="lg" wrap label={os === "windows" ? "Windows (PowerShell)" : "Mac or Linux"} code={c.install} />
                </div>
                <p className="mt-4">
                  This is the installer the docs label &ldquo;Native Install (Recommended)&rdquo;. It updates itself in the background.
                  {os === "windows" ? " If you use the older Command Prompt instead of PowerShell, the setup page has a separate one-line command for it." : null}
                </p>
              </Step>
              <Step n={3} title="Check that it worked">
                <p>Close the window, open a new one, and type:</p>
                <div className="mt-4">
                  <CodeBlock size="lg" label="Check" code={VERSION_CHECK} />
                </div>
              </Step>
            </Steps>
            <Prose>
              <p>
                If you see an error instead, run <code className="gd-code">{DOCTOR}</code> and read what it tells you.
              </p>
            </Prose>
            <aside className="my-10 max-w-[62ch] border-l-2 border-[var(--accent)] pl-5">
              <p className="text-[22px] leading-snug tracking-[-0.01em] text-[var(--ink)]">
                <span className="gd-serif text-[26px] text-[var(--ink)]">One rule for the rest of your life:</span> never paste a command into a
                terminal unless you know where it came from.
              </p>
              <p className="mt-3 text-[16px] leading-relaxed text-[var(--soft)]">These come from Anthropic&apos;s own page. Module 4 explains why this matters.</p>
            </aside>
            <Checkpoint id="installed" done={done} toggle={toggle} />
          </Lesson>

          <Lesson id="folder" code="S.4" title="Give it a folder." accent="A room, not the house.">
            <Prose>
              <p>Claude Code works inside one folder at a time. It can read and change what is in that folder. So do not start it in your whole computer.</p>
            </Prose>
            <FolderReach os={os} />
            <div className="max-w-[62ch]">
              <CodeBlock size="lg" label={os === "windows" ? "Windows (PowerShell)" : "Mac or Linux"} code={c.folder.join("\n")} />
              <dl className="mt-5 grid gap-3">
                {[
                  ["mkdir", "makes a folder."],
                  ["cd", "walks into it."],
                  ["claude", "starts Claude Code there."],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-baseline gap-4 text-[18px] text-[var(--body)]">
                    <dt className="w-[72px] shrink-0 font-mono text-[16px] text-[var(--accent)]">{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <Prose className="mt-8">
              <p>
                The very first time, it asks you to pick a text style. Press <Key>Enter</Key> to keep the default. Then it asks how you want to log
                in. Pick <strong>1, Claude account with subscription</strong>. A browser window opens: log in with your paid Claude account and come back.
              </p>
            </Prose>
            <RealShot
              src="/os/guide/login-method.png"
              w={1520}
              h={914}
              alt="Claude Code asking you to select a login method: 1. Claude account with subscription, 2. Anthropic Console account, 3. 3rd-party platform"
              caption="My Mac, first launch. Option 1 is already selected, so press Enter."
            />
            <Prose>
              <p>
                Then it asks whether you trust the folder. <strong>Careful: &ldquo;No, exit&rdquo; is selected first.</strong> Press <Key>↓</Key> once
                so &ldquo;Yes, I trust this folder&rdquo; is selected, then press <Key>Enter</Key>.
              </p>
            </Prose>
            <RealShot
              src="/os/guide/trust.png"
              w={1520}
              h={600}
              alt="Claude Code's safety check for the my-business folder, with No, exit selected and Yes, I trust this folder below it"
              caption="The real question. If you press Enter right away, Claude Code closes. Press ↓ first."
            />
            <Checkpoint id="signed-in" done={done} toggle={toggle} />
          </Lesson>

          <Lesson id="job" code="S.5" title="The first real job." accent="Not a hello.">
            <Prose>
              <p>Ask for something you would pay a person to do. Write what you do in one sentence, then copy the prompt.</p>
            </Prose>
            <PromptBuilder />
            <Prose>
              <p>Answer the questions. If it asks permission to create the file, say yes.</p>
            </Prose>
            <RealShot
              src="/os/guide/interview.png"
              w={1520}
              h={914}
              alt="Claude Code answering a pasted prompt with: Question 1 of about 6: What draws you to meal prep?"
              caption="A real run on my Mac. I tried a meal-prep business idea. It asks first instead of guessing, one question at a time."
            />
            <RealShot
              src="/os/guide/plan-written.png"
              w={1520}
              h={914}
              alt="Claude Code reporting that it wrote the plan file, with the most important point and a task for each day of the week"
              caption="Two answers later, the file was in the folder. It even flagged that home kitchens usually can't sell cooked meals in Texas. Yours will look different, because your business is."
            />
            <Prose>
              <p>
                Open the folder in {os === "windows" ? "Explorer" : os === "mac" ? "Finder" : "your file manager"}. The file is there. You did not write it.
              </p>
              <p>That list is your roadmap. The job at the top is the first one you hand over.</p>
            </Prose>
            <Checkpoint id="first-job" done={done} toggle={toggle} />
          </Lesson>

          <Lesson id="know" code="S.6" title="Four things to know" accent="before you go on.">
            <ol className="mt-2 grid max-w-[62ch] gap-8">
              <Known n={1} title="Know who approves what.">
                In recent versions, new terminal sessions start in auto mode: a separate classifier model approves routine actions and blocks the ones it
                judges risky, and some actions still come to you as a question. Read every question it asks. &ldquo;Yes&rdquo; is a decision, not a
                reflex. Module 4 shows how to make sure the irreversible things always come to you.
              </Known>
            </ol>
            <ApprovalLanes />
            <ol start={2} className="grid max-w-[62ch] gap-8">
              <Known n={2} title="It forgets when you close it.">
                That is what Modules 1A and 1 fix.
              </Known>
              <Known n={3} title={`It says "done" when it is not.`}>
                That is what Module 2 fixes. It is the module I care about most.
              </Known>
              <Known n={4} title="Lost? Two commands.">
                Type <code className="gd-code">/help</code> when lost. Type <code className="gd-code">/exit</code> to leave.
              </Known>
            </ol>
          </Lesson>

          <Lab done={done} toggle={toggle} />
          <PrevNext />
          <p className="mt-16 max-w-[62ch] text-[14px] leading-relaxed text-[var(--muted)]">
            Checked against the official docs on {CHECKED_ON}. Commands change; if one fails, the{" "}
            <a className="gd-link" href={QUICKSTART_URL} target="_blank" rel="noreferrer">
              official quickstart
            </a>{" "}
            wins.
          </p>
        </div>
      </div>
      <style>{`.gd-link{color:var(--ink);text-decoration:underline;text-decoration-color:var(--accent);text-underline-offset:3px;text-decoration-thickness:1.5px}`}</style>
    </div>
  );
}

/* ───────────── hero ───────────── */

const OS_NAMES: [Os, string][] = [
  ["mac", "Mac"],
  ["windows", "Windows"],
  ["linux", "Linux"],
];

function Hero({ os, setOs }: { os: Os; setOs: (o: Os) => void }) {
  const reduce = useReducedMotion();
  const enter = (d: number) => ({ initial: reduce ? false : { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { ...SPRING, delay: d } });
  return (
    <header className="mx-auto grid max-w-[1180px] grid-cols-1 items-start gap-x-14 px-5 pb-10 pt-12 sm:px-8 sm:pt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)]">
      <motion.nav {...enter(0)} aria-label="Breadcrumb" className="text-[15px] text-[var(--muted)] lg:col-start-1 lg:row-start-1">
        <Link href="/os/guide" className="inline-flex min-h-11 items-center hover:text-[var(--ink)]">
          Copilot OS guide
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--ink)]">Module S</span>
      </motion.nav>
      <motion.h1 {...enter(0.06)} className="gd-h1 mt-4 max-w-[14ch] lg:col-start-1 lg:row-start-2">
        Start here. <span className="gd-serif">If you&apos;ve never opened a terminal.</span>
      </motion.h1>
      <motion.div {...enter(0.18)} className="mt-8 lg:col-start-2 lg:row-span-4 lg:row-start-1 lg:mt-10">
        <EndState os={os} />
      </motion.div>
      <motion.div {...enter(0.14)} className="gd-prose mt-8 lg:col-start-1 lg:row-start-3">
        <p>
          Thirty minutes. At the end, Claude Code is installed, logged in, and has done one real job in a folder you own. Skip this module if
          Claude Code already runs on your computer.
        </p>
        <p>
          When I started, I couldn&apos;t code. I didn&apos;t read a book first. I installed the thing and broke it until it worked. This module is
          that, minus the breaking.
        </p>
      </motion.div>
      <motion.div {...enter(0.22)} className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 lg:col-start-1 lg:row-start-4">
        <span className="text-[16px] text-[var(--soft)]">Your computer:</span>
        <div className="flex gap-1" role="group" aria-label="Your computer">
          {OS_NAMES.map(([k, name]) => (
            <button key={k} type="button" onClick={() => setOs(k)} aria-pressed={os === k} className="gd-press relative min-h-11 px-3 text-[17px] text-[var(--muted)] aria-pressed:text-[var(--ink)]">
              {name}
              {os === k ? <motion.span layoutId="gd-os" className="absolute inset-x-3 bottom-1.5 h-[2px] rounded-full bg-[var(--accent)]" transition={SPRING} /> : null}
            </button>
          ))}
        </div>
        <span className="text-[14px] text-[var(--muted)]">Every command on this page follows this choice.</span>
      </motion.div>
    </header>
  );
}

/* ───────────── progress: a rail on wide screens, a bar on phones ───────────── */

function useActiveLesson() {
  const [active, setActive] = useState(LESSONS[0].id);
  useEffect(() => {
    const seen = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target.id, e.isIntersecting));
        const first = LESSONS.find((l) => seen.get(l.id));
        if (first) setActive(first.id);
      },
      { rootMargin: "-35% 0px -60% 0px" },
    );
    LESSONS.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return active;
}

type Read = ReturnType<typeof useSpring>;

function Rail({ active, read, lessonDone, count }: { active: string; read: Read; lessonDone: (id: string) => boolean; count: number }) {
  return (
    <nav aria-label="Lessons in this module" className="hidden lg:block">
      <div className="sticky top-24">
        <p className="text-[16px] font-semibold tracking-[-0.01em] text-[var(--ink)]">Start here</p>
        <ol className="relative mt-4">
          <span className="absolute bottom-3 left-[5px] top-3 w-px bg-[var(--rule)]" aria-hidden="true" />
          <motion.span style={{ scaleY: read }} className="absolute bottom-3 left-[5px] top-3 w-px origin-top bg-[var(--accent)]" aria-hidden="true" />
          {LESSONS.map((l) => {
            const on = l.id === active;
            const ok = lessonDone(l.id);
            return (
              <li key={l.id}>
                <a href={`#${l.id}`} className="relative flex min-h-11 items-center gap-4 pl-6 text-[15px]" aria-current={on ? "location" : undefined}>
                  <motion.span
                    className="absolute left-0 size-[11px] rounded-full ring-2 ring-[var(--page)]"
                    initial={false}
                    animate={{ backgroundColor: ok ? "#2e9e6a" : on ? "#e0552f" : "#c4c7c2", scale: on ? 1.25 : 1 }}
                    transition={SPRING}
                  />
                  <span className="w-[30px] shrink-0 font-mono text-[12.5px] text-[var(--muted)]">{l.code}</span>
                  <span className={on ? "font-medium text-[var(--ink)]" : "text-[var(--soft)]"}>{l.title}</span>
                </a>
              </li>
            );
          })}
        </ol>
        <p className="mt-6 text-[14px] text-[var(--muted)]">
          <span className="font-mono text-[var(--ink)]">{count}</span> of {TOTAL_CHECKS} checks ticked
        </p>
      </div>
    </nav>
  );
}

function MobileBar({ active, read, count }: { active: string; read: Read; count: number }) {
  const l = LESSONS.find((x) => x.id === active) ?? LESSONS[0];
  return (
    <div className="sticky top-14 z-30 border-b border-[var(--rule)] bg-[rgba(243,244,241,.88)] backdrop-blur-md lg:hidden">
      <div className="flex h-11 items-center justify-between gap-3 px-5 text-[14px]">
        <a href={`#${l.id}`} className="flex h-11 min-w-0 items-center gap-1.5 truncate">
          <span className="font-mono text-[var(--accent)]">{l.code}</span> <span className="text-[var(--ink)]">{l.title}</span>
        </a>
        <span className="shrink-0 text-[var(--muted)]">
          <span className="font-mono text-[var(--ink)]">{count}</span>/{TOTAL_CHECKS} ticked
        </span>
      </div>
      <motion.span style={{ scaleX: read }} className="absolute inset-x-0 bottom-[-1px] h-[2px] origin-left bg-[var(--accent)]" aria-hidden="true" />
    </div>
  );
}

/* ───────────── lesson parts ───────────── */

function Lesson({ id, code, title, accent, children }: { id: string; code: string; title: string; accent: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-32 border-t border-[var(--rule)] pb-6 pt-16 first:border-t-0 lg:scroll-mt-24">
      <h2 className="gd-h2 max-w-[20ch]">
        <span className="tabular-nums text-[var(--accent)]">{code.replace("S.", "")}.</span> {title} <span className="gd-serif">{accent}</span>
      </h2>
      <div className="mt-7">{children}</div>
    </section>
  );
}

function Prose({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`gd-prose ${className}`}>{children}</div>;
}

function Spec({ k, v, on = false }: { k: string; v: string; on?: boolean }) {
  return (
    <div className="relative grid gap-1 py-3.5 pl-4 sm:grid-cols-[140px_1fr]">
      <motion.span className="absolute left-0 top-3 bottom-3 w-[2px] origin-top rounded-full bg-[var(--accent)]" initial={false} animate={{ scaleY: on ? 1 : 0 }} transition={SPRING} aria-hidden="true" />
      <dt className="text-[16px] text-[var(--muted)]">
        {k}
        {on ? <span className="ml-2 text-[13px] text-[var(--accent)]">yours</span> : null}
      </dt>
      <dd className="text-[18px] text-[var(--ink)]">{v}</dd>
    </div>
  );
}

function Steps({ children }: { children: React.ReactNode }) {
  return <ol className="relative grid max-w-[62ch] gap-10">{children}</ol>;
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="relative pl-14">
      <span className="absolute left-0 top-0 flex size-9 items-center justify-center rounded-full bg-[var(--ink)] font-mono text-[15px] text-white">{n}</span>
      <h3 className="gd-h3 pt-1">{title}</h3>
      <div className="mt-2 text-[18px] leading-[1.75] text-[var(--body)]">{children}</div>
    </li>
  );
}

function Key({ children }: { children: React.ReactNode }) {
  return <kbd className="gd-kbd font-sans">{children}</kbd>;
}

function Known({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="grid grid-cols-[40px_1fr] gap-x-3">
      <span className="font-mono text-[22px] leading-[1.3] text-[var(--accent)]">{n}</span>
      <div>
        <h3 className="gd-h3">{title}</h3>
        <p className="mt-2 text-[18px] leading-[1.75] text-[var(--body)]">{children}</p>
      </div>
    </li>
  );
}

function Tick({ on, text, onClick }: { on: boolean; text: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={on} className="gd-press flex min-h-14 w-full items-center gap-4 rounded-2xl bg-white px-4 py-3 text-left ring-1 ring-[var(--rule)] aria-pressed:ring-[var(--pass)]">
      <span className={`flex size-7 shrink-0 items-center justify-center rounded-lg ring-1 transition-colors duration-200 ${on ? "bg-[var(--pass)] ring-[var(--pass)]" : "bg-white ring-[var(--rule-strong)]"}`}>
        <svg viewBox="0 0 20 20" className="size-4" aria-hidden="true">
          <motion.path d="M4.5 10.5 l3.5 3.5 l7.5 -8" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" initial={false} animate={{ pathLength: on ? 1 : 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} />
        </svg>
      </span>
      <span className={`text-[17px] leading-snug ${on ? "text-[var(--ink)]" : "text-[var(--soft)]"}`}>{text}</span>
    </button>
  );
}

function Checkpoint({ id, done, toggle }: { id: string; done: string[]; toggle: (id: string) => void }) {
  const c = CHECKPOINTS.find((x) => x.id === id);
  if (!c) return null;
  return (
    <div className="mt-10 max-w-[62ch]">
      <p className="mb-2 text-[14px] text-[var(--muted)]">Checkpoint</p>
      <Tick on={done.includes(id)} text={c.text} onClick={() => toggle(id)} />
    </div>
  );
}

/* ───────────── S.5: the prompt, with your business in it ───────────── */

function PromptBuilder() {
  const [business, setBusiness] = useState("");
  return (
    <div className="my-8 max-w-[62ch]">
      <label htmlFor="gd-business" className="block text-[16px] font-medium text-[var(--ink)]">
        What you do, in one sentence
      </label>
      <input
        id="gd-business"
        value={business}
        onChange={(e) => setBusiness(e.target.value)}
        placeholder="a two-person bookkeeping practice for small shops"
        className="mt-2 h-12 w-full rounded-xl bg-white px-4 text-[17px] text-[var(--ink)] ring-1 ring-[var(--rule-strong)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        autoComplete="off"
      />
      <div className="mt-4">
        <CodeBlock size="lg" wrap label="Type this into Claude Code" code={fillPrompt(business)} />
      </div>
    </div>
  );
}

/* ───────────── lab ───────────── */

function Lab({ done, toggle }: { done: string[]; toggle: (id: string) => void }) {
  const n = LAB.filter((l) => done.includes(l.id)).length;
  const R = 26;
  const C = 2 * Math.PI * R;
  return (
    <section id="lab" className="mt-10 scroll-mt-32 rounded-[22px] bg-[var(--panel)] px-5 py-10 text-white sm:px-10 lg:scroll-mt-24">
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <h2 className="gd-h2 max-w-[18ch] text-white">
            The lab. <span className="gd-serif !text-white/60">Three ticks to pass.</span>
          </h2>
        </div>
        <svg viewBox="0 0 64 64" className="size-16 shrink-0" role="img" aria-label={`${n} of ${LAB.length} done`}>
          <circle cx="32" cy="32" r={R} fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="5" />
          <motion.circle cx="32" cy="32" r={R} fill="none" stroke={n === LAB.length ? "#2e9e6a" : "#e0552f"} strokeWidth="5" strokeLinecap="round" transform="rotate(-90 32 32)" strokeDasharray={C} initial={false} animate={{ strokeDashoffset: C * (1 - n / LAB.length) }} transition={SPRING} />
          <text x="32" y="37" textAnchor="middle" fontSize="15" fill="#fff" className="font-mono">
            {n}/{LAB.length}
          </text>
        </svg>
      </div>
      <div className="mt-8 grid max-w-[62ch] gap-3 text-[var(--ink)]">
        {LAB.map((l) => (
          <Tick key={l.id} on={done.includes(l.id)} text={l.text} onClick={() => toggle(l.id)} />
        ))}
      </div>
      <p className="mt-6 max-w-[62ch] text-[18px] leading-relaxed text-white/75">
        {n === LAB.length ? "Passed. " : ""}Then do Module 0, the 20‑question diagnostic. It tells you where to go next.
      </p>
    </section>
  );
}

function PrevNext() {
  return (
    <nav aria-label="Module navigation" className="mt-12 grid gap-3 sm:grid-cols-2">
      <Link href="/os/guide" className="gd-press flex min-h-[88px] flex-col justify-center rounded-2xl bg-white px-5 py-4 ring-1 ring-[var(--rule)] hover:ring-[var(--ink)]">
        <span className="text-[14px] text-[var(--muted)]">← Back</span>
        <span className="mt-1 text-[18px] font-medium">Guide contents</span>
      </Link>
      <div className="flex min-h-[88px] flex-col justify-center rounded-2xl border border-dashed border-[var(--rule-strong)] px-5 py-4 text-right" aria-disabled="true">
        <span className="text-[14px] text-[var(--muted)]">Next · coming next</span>
        <span className="mt-1 text-[18px] font-medium text-[var(--soft)]">Module 0 · Diagnostic</span>
      </div>
    </nav>
  );
}
