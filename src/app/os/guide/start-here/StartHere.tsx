"use client";

// Start here, laid out as a course: plain page for reading, the paper grid only behind the hero and each section's
// opener, cards only for things the reader operates, results and checks. Every action ends with "You're ready for
// the next step if…" and a "My screen looks different" list taken from the official docs (see data.ts).

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { CodeBlock } from "@/app/free/CodeCopy";
import {
  CHECKED_ON,
  CHECKPOINTS,
  DESKTOP_QUOTE,
  DOCTOR,
  FOUNDER_NOTES,
  INSTALL_SUCCESS,
  INSTALL_TROUBLE,
  LAB,
  LESSONS,
  LOGIN_TROUBLE,
  PLAN_FILE,
  PLAN_QUOTE,
  PRICING_URL,
  PRO_PRICE,
  QUICKSTART_URL,
  REQUIREMENTS,
  SETUP_URL,
  TERMINAL_GUIDE_URL,
  TOTAL_CHECKS,
  TROUBLESHOOT_URL,
  VERSION_CHECK,
  commandsFor,
  fillPrompt,
  idsFor,
  type Os,
  type Trouble,
} from "../data";
import { useDone, useOs } from "../store";
import { ApprovalLanes, Doors, EndState, FolderReach, InstallTerminal, PlanGate, PlanPayoff, Roadmap, Shot, Term } from "./Figures";

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
    const mine = idsFor(id);
    return mine.length > 0 && mine.every((m) => done.includes(m));
  };
  const win = os === "windows";

  return (
    <div className="gd relative overflow-x-clip pb-10 pt-14">
      <MobileBar active={active} read={read} count={done.length} />
      <Hero os={os} setOs={setOs} done={done} />

      <div ref={article} className="mx-auto grid max-w-[1180px] gap-12 px-5 sm:px-8 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-16">
        <Rail active={active} read={read} lessonDone={lessonDone} count={done.length} />

        <div className="min-w-0 max-w-[760px]">
          {/* ── 1 ── */}
          <Section id="need" accent="Three things, and nothing else.">
            <ol className="grid max-w-[62ch] gap-8">
              <Item n={1} title={win ? "A Windows PC" : "A Mac"}>
                Running <strong>{win ? REQUIREMENTS.windows : REQUIREMENTS.mac}</strong>, with {REQUIREMENTS.memory}.{" "}
                <button type="button" onClick={() => setOs(win ? "mac" : "windows")} className="gd-link inline-flex min-h-11 items-center">
                  {win ? "On a Mac instead?" : "On a Windows PC instead?"}
                </button>
              </Item>
              <Item n={2} title="A Claude Pro plan">
                <Price /> The free plan doesn&apos;t include Claude Code. Anthropic&apos;s words: &ldquo;{PLAN_QUOTE}&rdquo;
              </Item>
              <Item n={3} title="About 30 minutes">
                No coding. You&apos;ll copy a few lines, paste them, and answer Claude&apos;s questions about your idea.
              </Item>
            </ol>
            <PlanGate quote={PLAN_QUOTE} />
            <Prose>
              <p>
                <strong>Nothing else to install first.</strong>
                {win
                  ? " Git for Windows is optional: without it, Claude Code uses PowerShell, the terminal app that comes with Windows."
                  : " The installer brings everything Claude Code needs."}
              </p>
            </Prose>
            <Ready>
              You have a {win ? "Windows PC on " + REQUIREMENTS.windows : "Mac on " + REQUIREMENTS.mac} and an active Claude Pro plan.
            </Ready>
            <Different
              items={
                win
                  ? [
                      {
                        see: "Claude Code does not support 32-bit Windows",
                        fix: "Claude Code needs a 64-bit PC. If you see this message later while installing, Section 3 says what to do.",
                      },
                    ]
                  : [{ see: "You're not sure which macOS you have", fix: "Open the Apple menu and choose About This Mac. The version is under the name." }]
              }
            />
            <Checkpoint id="ready" done={done} toggle={toggle} />
          </Section>

          {/* ── 2 ── */}
          <Section id="door" accent="The app or the terminal.">
            <Prose>
              <p>
                There are two official ways to use Claude Code. The desktop app is a normal app with a window. The <strong>terminal</strong> is an
                app that&apos;s already on your {win ? "PC" : "Mac"}, where you type instructions instead of clicking. Both run the same Claude Code.
                Anthropic&apos;s docs: &ldquo;{DESKTOP_QUOTE}&rdquo;
              </p>
            </Prose>
            <Doors os={os} />
            <Prose>
              <p>
                <strong>Use the terminal for this course.</strong> It is ten minutes of discomfort, and every module after this one assumes it. If you
                want the app first, download it from the{" "}
                <a className="gd-link" href={SETUP_URL} target="_blank" rel="noreferrer">
                  official setup page
                </a>{" "}
                and come back to Section 3 when you&apos;re ready.
              </p>
            </Prose>
            <FounderNote id="door" topic="Why the terminal, from someone who started without coding" />
            <Ready>You&apos;ve decided to use the terminal for the rest of this page.</Ready>
            <Checkpoint id="chosen" done={done} toggle={toggle} />
          </Section>

          {/* ── 3 ── */}
          <Section id="install" accent="One line, one check.">
            <Steps>
              <Step n={1} title={`Open ${c.shell}`}>
                {win ? (
                  <p>
                    Press <Key>Win</Key> + <Key>X</Key> and choose <strong>Windows PowerShell</strong> (or <strong>Terminal</strong>) from the menu.
                  </p>
                ) : (
                  <p>
                    Press <Key>Command</Key> + <Key>Space</Key>, type <Key>Terminal</Key>, press <Key>Enter</Key>.
                  </p>
                )}
                <p className="mt-3">
                  A window appears with a blinking cursor. This is where you type.
                  {win ? (
                    <>
                      {" "}
                      Each line should start with <code className="gd-code">PS C:\Users\YourName&gt;</code>. If there&apos;s no{" "}
                      <code className="gd-code">PS</code>, you&apos;re in CMD: close it and open PowerShell.
                    </>
                  ) : null}
                </p>
                <Shot id="terminal-open" os={os} className="mt-5 aspect-[16/10] max-w-[520px]" />
                <Ready>You see a {c.shell} window with a blinking cursor.</Ready>
              </Step>
              <Step n={2} title="Copy the install line, paste it, press Enter">
                <p>Press Copy below. Click inside the {c.shell} window, paste ({win ? "Ctrl + V, or right-click" : "Command + V"}), and press Enter.</p>
                <div className="mt-4">
                  <CodeBlock size="lg" wrap label={win ? "Windows (PowerShell)" : "Mac"} code={c.install} />
                </div>
                <p className="mt-4">
                  This downloads Claude Code from Anthropic and installs it in your own user folder. It&apos;s the line the docs call &ldquo;Native
                  Install (Recommended)&rdquo;, and it keeps Claude Code up to date by itself.
                </p>
              </Step>
              <Step n={3} title="Wait, even if nothing seems to happen">
                <p>
                  The installer <strong>shows no progress while it downloads</strong>. That pause is normal: leave the window open. When it&apos;s done,
                  you&apos;ll see <code className="gd-code">{INSTALL_SUCCESS}</code>
                </p>
                <p className="mt-3">
                  It installs into your own user folder, so you {win ? "don't need to run it as Administrator" : "don't need to type a password"}.
                  If it asks you for {win ? "administrator rights" : "your password"}, stop and check the{" "}
                  <a className="gd-link" href={TROUBLESHOOT_URL} target="_blank" rel="noreferrer">
                    official troubleshooting page
                  </a>{" "}
                  before going on.
                </p>
                <Shot id="install-done" os={os} className="mt-5 aspect-[16/10] max-w-[520px]" />
                <Ready>
                  You see <code className="gd-code">{INSTALL_SUCCESS}</code>
                </Ready>
              </Step>
              <Step n={4} title="Check that it worked">
                <p>Close the window, open a new one the same way as in step 1, then type this and press Enter:</p>
                <div className="mt-4">
                  <CodeBlock size="lg" label="Check" code={VERSION_CHECK} />
                </div>
              </Step>
            </Steps>
            <InstallTerminal os={os} />
            <Ready>
              You see a version number followed by <code className="gd-code">(Claude Code)</code>, like the second window above.
            </Ready>
            <Different
              items={INSTALL_TROUBLE[os]}
              after={
                <>
                  Something else? Type <code className="gd-code">{DOCTOR}</code> and press Enter: it checks your install and suggests fixes. The{" "}
                  <a className="gd-link" href={TROUBLESHOOT_URL} target="_blank" rel="noreferrer">
                    official troubleshooting page
                  </a>{" "}
                  matches more error messages to fixes.
                </>
              }
            />
            <aside className="my-10 max-w-[62ch] border-l-2 border-[var(--accent)] pl-5">
              <p className="text-[19px] font-medium leading-snug text-[var(--ink)]">
                One rule from now on: never paste a command into a terminal unless you know where it came from.
              </p>
              <p className="mt-2 text-[16px] leading-relaxed text-[var(--soft)]">
                The two lines on this page come from Anthropic&apos;s own setup page. Module 4 explains why this matters.
              </p>
            </aside>
            <FounderNote id="install" topic="What the first install felt like, and what you'd tell yourself" />
            <Checkpoint id="installed" done={done} toggle={toggle} />
          </Section>

          {/* ── 4 ── */}
          <Section id="folder" accent="Claude's office.">
            <Prose>
              <p>
                Claude Code works inside the folder you start it in. Think of that folder as <strong>Claude&apos;s office</strong>: it&apos;s where
                Claude reads and writes your files by default. Give it a new, empty folder of its own, not your whole computer.
              </p>
              <p>
                To be honest about it: the office is a default, not a locked door. Claude can still look at some files outside it, for example with
                commands that only read. Module 4 shows how to set real limits.
              </p>
            </Prose>
            <FolderReach os={os} />
            <Steps>
              <Step n={1} title={`Make the folder in ${c.files}`}>
                {win ? (
                  <p>
                    Open <strong>File Explorer</strong> and go to your user folder (<code className="gd-code">C:\Users\YourName</code>). Right-click an
                    empty spot, choose <strong>New</strong> then <strong>Folder</strong>, name it <code className="gd-code">my-business</code> and press
                    Enter.
                  </p>
                ) : (
                  <p>
                    Open <strong>Finder</strong>, choose <strong>Go</strong> then <strong>Home</strong> in the menu bar. Choose <strong>File</strong>{" "}
                    then <strong>New Folder</strong>, name it <code className="gd-code">my-business</code> and press Return.
                  </p>
                )}
                <Shot id="new-folder" os={os} className="mt-5 aspect-[16/10] max-w-[520px]" />
                <p className="mt-4 text-[16px] text-[var(--soft)]">
                  Prefer typing? <code className="gd-code">{c.folder[0]}</code> in {c.shell} makes the same folder.
                </p>
                <Ready>
                  You see a folder called <code className="gd-code">my-business</code> in your {win ? "user" : "home"} folder.
                </Ready>
              </Step>
              <Step n={2} title={`Step into it in ${c.shell}`}>
                <p>Type this and press Enter. It prints nothing, which is normal.</p>
                <div className="mt-4">
                  <CodeBlock size="lg" label={win ? "Windows (PowerShell)" : "Mac"} code={c.folder[1]} />
                </div>
                <div className="mt-5 max-w-[520px]">
                  <Term os={os} lines={[{ cmd: c.folder[1] }, { cmd: "", inFolder: true, caret: true }]} />
                </div>
                <Ready>The line where you type now shows my-business, as in the window above.</Ready>
              </Step>
              <Step n={3} title="Start Claude Code and log in">
                <p>Type this and press Enter:</p>
                <div className="mt-4">
                  <CodeBlock size="lg" label="Start Claude Code" code="claude" />
                </div>
                <p className="mt-4">
                  The first time, Claude Code asks whether you trust the files in this folder. It&apos;s your own new, empty folder, so choose yes. Then
                  it asks you to log in: your browser opens a Claude page. Log in with the account that has your Pro plan, then come back to {c.shell}.
                </p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Shot id="first-run" os={os} className="aspect-[4/3]" />
                  <Shot id="sign-in" os={os} className="aspect-[4/3]" />
                </div>
              </Step>
            </Steps>
            <Ready>
              You see Claude Code&apos;s prompt, with the version, the model and your my-business folder shown above it.
            </Ready>
            <Shot id="welcome" os={os} className="mt-5 aspect-[16/10] max-w-[520px]" />
            <Different items={LOGIN_TROUBLE} />
            <Know title="Lost inside Claude Code?">
              Type <code className="gd-code">/help</code> to see what it can do. Press <Key>Esc</Key> to stop Claude while it&apos;s working. Type{" "}
              <code className="gd-code">exit</code> to leave Claude Code and get back to {c.shell}.
            </Know>
            <Checkpoint id="signed-in" done={done} toggle={toggle} />
          </Section>

          {/* ── 5 ── */}
          <Section id="job" accent="A plan for your business.">
            <Prose>
              <p>
                Don&apos;t ask it to say hello. Ask for something you&apos;d pay a person to do: a plan for your first week. Write your idea in a
                sentence below, or leave it blank if you don&apos;t have one yet. Then copy the message and paste it into Claude Code.
              </p>
            </Prose>
            <PromptBuilder />
            <Prose>
              <p>
                Claude will ask you questions first, one at a time: what interests you, what you&apos;re good at, how much time and money you have.
                Answer in your own words. Short answers are fine.
              </p>
            </Prose>
            <Shot id="interview" os={os} className="mt-6 aspect-[16/10] max-w-[620px]" />
            <Know title="When it asks to create the file, you decide.">
              In recent versions Claude Code starts in auto mode: a second AI model looks at each step Claude wants to take. Everyday steps go ahead,
              risky ones are stopped, and some come to you as a question. When it asks to create {PLAN_FILE}, press Enter to choose Yes. Read every
              question it asks: &ldquo;Yes&rdquo; is a decision, not a reflex. Module 4 shows how to make sure anything that can&apos;t be undone
              always comes to you.
            </Know>
            <ApprovalLanes />
            <PlanPayoff os={os} />
            <Ready>
              Claude says it wrote <code className="gd-code">{PLAN_FILE}</code>. Section 6 checks that it really did.
            </Ready>
            <Know title="It forgets when you close it.">
              Closing the window ends the conversation; next time Claude starts from zero. The plan file stays in your folder. Modules 1A and 1 fix
              the forgetting.
            </Know>
            <FounderNote id="job" topic="What to do with the plan on day one" />
            <Checkpoint id="first-job" done={done} toggle={toggle} />
          </Section>

          {/* ── 6 ── */}
          <Lab os={os} done={done} toggle={toggle} />
          <PrevNext />
          <p className="mt-16 max-w-[62ch] text-[14px] leading-relaxed text-[var(--muted)]">
            Checked against the official docs on {CHECKED_ON}. Commands change; if one fails, the{" "}
            <a className="gd-link" href={QUICKSTART_URL} target="_blank" rel="noreferrer">
              official quickstart
            </a>{" "}
            and the{" "}
            <a className="gd-link" href={TERMINAL_GUIDE_URL} target="_blank" rel="noreferrer">
              terminal guide
            </a>{" "}
            win.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ───────────── hero: the promise, plainly, and the computer choice ───────────── */

const OS_NAMES: [Os, string][] = [
  ["mac", "Mac"],
  ["windows", "Windows"],
];

function Hero({ os, setOs, done }: { os: Os; setOs: (o: Os) => void; done: string[] }) {
  const reduce = useReducedMotion();
  const [linux, setLinux] = useState(false);
  const enter = (d: number) => ({ initial: reduce ? false : { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { ...SPRING, delay: d } });
  return (
    <header className="gd-grid border-b border-[var(--rule)]">
      <div className="mx-auto grid max-w-[1180px] grid-cols-1 items-start gap-x-14 px-5 pb-14 pt-12 sm:px-8 sm:pt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)]">
        <div>
          <motion.nav {...enter(0)} aria-label="Breadcrumb" className="text-[15px] text-[var(--muted)]">
            <Link href="/os/guide" className="inline-flex min-h-11 items-center hover:text-[var(--ink)]">
              Copilot OS guide
            </Link>
            <span className="mx-2">/</span>
            <span className="text-[var(--ink)]">Start here</span>
          </motion.nav>
          <motion.h1 {...enter(0.05)} className="gd-h1 mt-3 max-w-[15ch]">
            Start here. <span className="gd-serif">Claude Code, set up and working for you.</span>
          </motion.h1>
          <motion.dl {...enter(0.12)} className="mt-8 grid max-w-[560px] gap-x-6 gap-y-3 text-[17px] sm:grid-cols-[150px_1fr]">
            <dt className="text-[var(--muted)]">Time</dt>
            <dd className="text-[var(--ink)]">About 30 minutes</dd>
            <dt className="text-[var(--muted)]">Coding</dt>
            <dd className="text-[var(--ink)]">None. You copy, paste and answer questions.</dd>
            <dt className="text-[var(--muted)]">You pay for</dt>
            <dd className="text-[var(--ink)]">
              A Claude Pro plan. <Price />
            </dd>
            <dt className="text-[var(--muted)]">At the end</dt>
            <dd className="text-[var(--ink)]">Claude Code installed, a workspace folder, and a first-week plan for your business that Claude wrote with you.</dd>
          </motion.dl>
          <motion.p {...enter(0.16)} className="mt-6 max-w-[56ch] text-[16px] leading-relaxed text-[var(--soft)]">
            When I started, I couldn&apos;t code. I installed the thing and broke it until it worked. This is that, minus the breaking.
          </motion.p>
          <motion.div {...enter(0.2)} className="mt-8">
            <p className="text-[19px] font-semibold tracking-[-0.01em] text-[var(--ink)]">Which computer are you using?</p>
            <div className="mt-3 flex flex-wrap items-center gap-3" role="group" aria-label="Which computer are you using?">
              {OS_NAMES.map(([k, name]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setOs(k)}
                  aria-pressed={os === k}
                  className="gd-press inline-flex h-12 min-w-[120px] items-center justify-center rounded-full bg-white px-6 text-[17px] font-medium text-[var(--soft)] ring-1 ring-[var(--rule-strong)] aria-pressed:bg-[var(--ink)] aria-pressed:text-white aria-pressed:ring-[var(--ink)]"
                >
                  {name}
                </button>
              ))}
              <button type="button" onClick={() => setLinux((v) => !v)} aria-expanded={linux} className="gd-link inline-flex min-h-11 items-center px-1 text-[15px]">
                Linux?
              </button>
            </div>
            {linux ? (
              <p className="mt-3 max-w-[56ch] text-[16px] leading-relaxed text-[var(--soft)]">
                Claude Code also runs on {REQUIREMENTS.linux}. Choose Mac above: the commands on this page are the same on Linux.
              </p>
            ) : null}
            <p className="mt-3 text-[15px] text-[var(--muted)]">
              {os === "windows"
                ? "Every command below follows this choice. The Windows steps follow Anthropic's official docs; Windows screenshots are coming later."
                : "Every command and screenshot below follows this choice."}
            </p>
          </motion.div>
        </div>
        <motion.div {...enter(0.18)} className="mt-10 lg:mt-14">
          <EndState os={os} />
        </motion.div>
      </div>
      <div className="mx-auto max-w-[1180px] px-5 pb-14 sm:px-8">
        <div className="max-w-[560px]">
          <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-[var(--ink)]">The six steps</h2>
          <p className="mt-1 text-[16px] text-[var(--soft)]">Each one is a section below. A step turns green when you tick its checks.</p>
          <div className="mt-4">
            <Roadmap done={done} idsFor={idsFor} />
          </div>
        </div>
      </div>
    </header>
  );
}

/** The Pro price, only as read off Anthropic's pricing page. Until someone fills it in, a marked gap and the link. */
function Price() {
  return (
    <span>
      {PRO_PRICE.monthly}, or {PRO_PRICE.yearly}, on{" "}
      <a className="gd-link" href={PRICING_URL} target="_blank" rel="noreferrer">
        Anthropic&apos;s pricing page
      </a>{" "}
      (read {PRO_PRICE.readOn}; it can differ by country).
    </span>
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
    <nav aria-label="Sections" className="hidden pt-16 lg:block">
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
                <a href={`#${l.id}`} className="relative flex min-h-11 items-center gap-3 pl-6 text-[15px] leading-snug" aria-current={on ? "location" : undefined}>
                  <motion.span
                    className="absolute left-0 size-[11px] rounded-full ring-2 ring-[var(--page)]"
                    initial={false}
                    animate={{ backgroundColor: ok ? "#2e9e6a" : on ? "#e0552f" : "#c4c7c2", scale: on ? 1.25 : 1 }}
                    transition={SPRING}
                  />
                  <span className="w-4 shrink-0 text-[14px] text-[var(--muted)]">{l.n}</span>
                  <span className={on ? "font-medium text-[var(--ink)]" : "text-[var(--soft)]"}>{l.title}</span>
                </a>
              </li>
            );
          })}
        </ol>
        <p className="mt-6 text-[14px] text-[var(--muted)]">
          <span className="text-[var(--ink)]">{count}</span> of {TOTAL_CHECKS} checks ticked
        </p>
      </div>
    </nav>
  );
}

function MobileBar({ active, read, count }: { active: string; read: Read; count: number }) {
  const l = LESSONS.find((x) => x.id === active) ?? LESSONS[0];
  return (
    <div className="sticky top-14 z-30 border-b border-[var(--rule)] bg-[rgba(251,251,250,.92)] backdrop-blur-md lg:hidden">
      <div className="flex h-11 items-center justify-between gap-3 px-5 text-[14px]">
        <a href={`#${l.id}`} className="flex h-11 min-w-0 items-center gap-1.5 truncate">
          <span className="text-[var(--accent)]">{l.n}.</span> <span className="truncate text-[var(--ink)]">{l.title}</span>
        </a>
        <span className="shrink-0 text-[var(--muted)]">
          <span className="text-[var(--ink)]">{count}</span>/{TOTAL_CHECKS} ticked
        </span>
      </div>
      <motion.span style={{ scaleX: read }} className="absolute inset-x-0 bottom-[-1px] h-[2px] origin-left bg-[var(--accent)]" aria-hidden="true" />
    </div>
  );
}

/* ───────────── course parts ───────────── */

function Section({ id, accent, children }: { id: string; accent: string; children: React.ReactNode }) {
  const l = LESSONS.find((x) => x.id === id)!;
  return (
    <section id={id} className="scroll-mt-28 pb-6 pt-16 lg:scroll-mt-20">
      <div className="gd-grid -mx-5 mb-9 border-y border-[var(--rule)] px-5 py-8 sm:mx-0 sm:rounded-2xl sm:border sm:px-8">
        <p className="text-[15px] text-[var(--muted)]">
          Step {l.n} of {LESSONS.length}
        </p>
        <h2 className="gd-h2 mt-2 max-w-[22ch]">
          {l.title}. <span className="gd-serif">{accent}</span>
        </h2>
      </div>
      {children}
    </section>
  );
}

function Prose({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`gd-prose my-6 ${className}`}>{children}</div>;
}

function Steps({ children }: { children: React.ReactNode }) {
  return <ol className="relative my-8 grid max-w-[62ch] gap-12">{children}</ol>;
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="relative pl-12 sm:pl-14">
      <span className="absolute left-0 top-0 flex size-9 items-center justify-center rounded-full bg-[var(--ink)] text-[15px] font-medium text-white">{n}</span>
      <h3 className="gd-h3 pt-1">{title}</h3>
      <div className="mt-2 text-[18px] leading-[1.75] text-[var(--body)]">{children}</div>
    </li>
  );
}

function Item({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="grid grid-cols-[36px_1fr] gap-x-3">
      <span className="text-[22px] leading-[1.3] text-[var(--accent)]">{n}</span>
      <div>
        <h3 className="gd-h3">{title}</h3>
        <p className="mt-2 text-[18px] leading-[1.75] text-[var(--body)]">{children}</p>
      </div>
    </li>
  );
}

function Key({ children }: { children: React.ReactNode }) {
  return <kbd className="gd-kbd font-sans">{children}</kbd>;
}

/** A thing worth knowing, placed at the step where it matters. */
function Know({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="my-8 max-w-[62ch] border-l-2 border-[var(--ink)] pl-5">
      <h3 className="text-[19px] font-semibold tracking-[-0.015em] text-[var(--ink)]">{title}</h3>
      <p className="mt-2 text-[18px] leading-[1.75] text-[var(--body)]">{children}</p>
    </div>
  );
}

/** After every action: the one thing you should see before moving on. */
function Ready({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 flex max-w-[62ch] gap-3 rounded-xl bg-[rgba(46,158,106,0.08)] px-4 py-3.5 ring-1 ring-[rgba(46,158,106,0.35)]">
      <svg viewBox="0 0 20 20" className="mt-1 size-5 shrink-0" aria-hidden="true">
        <circle cx="10" cy="10" r="9" fill="#2e9e6a" />
        <path d="M5.8 10.4 l2.8 2.8 l5.6 -6" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <p className="text-[17px] leading-relaxed text-[var(--ink)]">
        <span className="font-semibold">You&apos;re ready for the next step if</span> {lowerFirst(children)}
      </p>
    </div>
  );
}

function lowerFirst(node: React.ReactNode): React.ReactNode {
  if (typeof node === "string") return node.charAt(0).toLowerCase() + node.slice(1);
  if (Array.isArray(node) && typeof node[0] === "string") return [lowerFirst(node[0]), ...node.slice(1)];
  return node;
}

/** "My screen looks different": the likely problems, from the official docs, with their fixes. */
function Different({ items, after }: { items: Trouble[]; after?: React.ReactNode }) {
  if (items.length === 0 && !after) return null;
  return (
    <details className="gd-details mt-3 max-w-[62ch] rounded-xl bg-white ring-1 ring-[var(--rule)]">
      <summary className="flex min-h-12 cursor-pointer items-center gap-3 px-4 text-[17px] font-medium text-[var(--ink)]">My screen looks different</summary>
      <div className="grid gap-5 px-4 pb-5">
        {items.map((t) => (
          <div key={t.see}>
            <p className="text-[15px] text-[var(--muted)]">If you see</p>
            <p className="mt-1 font-mono text-[15px] text-[var(--ink)] [overflow-wrap:anywhere]">{t.see}</p>
            <p className="mt-2 text-[17px] leading-relaxed text-[var(--body)]">{t.fix}</p>
            {t.code ? (
              <div className="mt-3">
                <CodeBlock size="lg" wrap label="Fix" code={t.code} />
              </div>
            ) : null}
          </div>
        ))}
        {after ? <p className="text-[17px] leading-relaxed text-[var(--body)]">{after}</p> : null}
      </div>
    </details>
  );
}

/** First-hand advice from the founder. Placeholder until he writes it: nothing here is written in his voice. */
function FounderNote({ id, topic }: { id: string; topic: string }) {
  const text = FOUNDER_NOTES[id];
  return (
    <aside className="my-10 max-w-[62ch] rounded-2xl bg-white p-5 ring-1 ring-[var(--rule)] sm:p-6">
      <p className="text-[15px] font-semibold text-[var(--ink)]">Founder&apos;s note</p>
      {text ? (
        <p className="mt-2 text-[18px] leading-[1.75] text-[var(--body)]">{text}</p>
      ) : (
        <div className="mt-3 rounded-xl border-[1.5px] border-dashed border-[var(--accent)] bg-[rgba(224,85,47,0.04)] p-4">
          <p className="text-[13px] font-medium text-[var(--accent)]">Placeholder: for Shogo to write</p>
          <p className="mt-1 text-[16px] leading-snug text-[var(--ink)]">{topic}</p>
        </div>
      )}
    </aside>
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
      <p className="mb-2 text-[15px] text-[var(--muted)]">Tick when it&apos;s true</p>
      <Tick on={done.includes(id)} text={c.text} onClick={() => toggle(id)} />
    </div>
  );
}

/* ───────────── section 5: the message, with your idea in it ───────────── */

function PromptBuilder() {
  const [idea, setIdea] = useState("");
  return (
    <div className="my-8 max-w-[62ch] rounded-2xl bg-white p-4 ring-1 ring-[var(--rule)] sm:p-5">
      <label htmlFor="gd-idea" className="block text-[17px] font-medium text-[var(--ink)]">
        Your business idea, in one sentence
      </label>
      <p className="mt-1 text-[15px] text-[var(--muted)]">Optional. Leave it blank and Claude will help you find one.</p>
      <input
        id="gd-idea"
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        placeholder="a weekly meal-prep service for night-shift nurses"
        className="mt-3 h-12 w-full rounded-xl bg-white px-4 text-[17px] text-[var(--ink)] ring-1 ring-[var(--rule-strong)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        autoComplete="off"
      />
      <div className="mt-4">
        <CodeBlock size="lg" wrap label="Paste this into Claude Code, then press Enter" code={fillPrompt(idea)} />
      </div>
    </div>
  );
}

/* ───────────── section 6: check the file yourself ───────────── */

function Lab({ os, done, toggle }: { os: Os; done: string[]; toggle: (id: string) => void }) {
  const n = LAB.filter((l) => done.includes(l.id)).length;
  const all = n === LAB.length;
  const c = commandsFor(os);
  const R = 26;
  const C = 2 * Math.PI * R;
  return (
    <Section id="lab" accent="Don't take Claude's word for it.">
      <Prose>
        <p>
          Claude sometimes says &ldquo;done&rdquo; when it isn&apos;t. So check with your own eyes: open <strong>{c.files}</strong>, go to your
          my-business folder, and open {PLAN_FILE}. Module 2 is about making Claude check its own work; this is the first habit.
        </p>
      </Prose>
      <Shot id="finder-result" os={os} className="my-6 aspect-[16/9] max-w-[620px]" />
      <div className="rounded-[22px] bg-[var(--panel)] px-5 py-8 text-white sm:px-8">
        <div className="flex items-start justify-between gap-6">
          <p className="max-w-[30ch] text-[20px] font-semibold leading-snug">Pass when all three are true</p>
          <svg viewBox="0 0 64 64" className="size-16 shrink-0" role="img" aria-label={`${n} of ${LAB.length} done`}>
            <circle cx="32" cy="32" r={R} fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="5" />
            <motion.circle cx="32" cy="32" r={R} fill="none" stroke={all ? "#2e9e6a" : "#e0552f"} strokeWidth="5" strokeLinecap="round" transform="rotate(-90 32 32)" strokeDasharray={C} initial={false} animate={{ strokeDashoffset: C * (1 - n / LAB.length) }} transition={SPRING} />
            <text x="32" y="37" textAnchor="middle" fontSize="15" fill="#fff">
              {n}/{LAB.length}
            </text>
          </svg>
        </div>
        <div className="mt-6 grid gap-3 text-[var(--ink)]">
          {LAB.map((l) => (
            <Tick key={l.id} on={done.includes(l.id)} text={l.text} onClick={() => toggle(l.id)} />
          ))}
        </div>
        {all ? (
          <motion.p className="mt-8 text-[30px] leading-tight text-white" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={SPRING}>
            <span className="gd-serif !text-white">You&apos;re set up.</span> Claude Code is working for you, and you have a plan for this week.
          </motion.p>
        ) : null}
        <p className="mt-6 max-w-[62ch] text-[17px] leading-relaxed text-white/75">
          Next, Module 0: twenty questions that tell you which module to open next.
        </p>
      </div>
      <Different
        items={[
          {
            see: `No ${PLAN_FILE} in the folder`,
            fix: `Go back to ${c.shell}, and type in Claude Code: "Please save the plan as ${PLAN_FILE} in this folder." When it asks to create the file, choose Yes. Then look again.`,
          },
        ]}
      />
    </Section>
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
