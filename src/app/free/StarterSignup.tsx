"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { GuideSignup } from "@/app/free/GuideSignup";
import { STARTER_FORM } from "@/lib/free";

// The demo is the pitch: Claude interviews you, and your CLAUDE.md writes itself.
// It plays once when the block scrolls into view; reduced motion shows the finished file.
const steps = [
  {
    ask: "What's the one goal this year, and how will you measure it?",
    answer: "$10k MRR by June. Stripe is the source of truth.",
    heading: "## The one goal",
    line: "$10k MRR by June, measured in Stripe. Everything else is ranked against this.",
  },
  {
    ask: "When should I push back on you?",
    answer: "When I start something new before shipping the last thing.",
    heading: "## Stop me when",
    line: "I start a new project before the open one ships.",
  },
  {
    ask: "How do I prove something works before I say it's done?",
    answer: "Run the tests and show me the output.",
    heading: "## Check your work",
    line: "Run npm test. Paste the output. No output, no \"done\".",
  },
];

const files = ["START-HERE.md", "CLAUDE.md", "prompts/interview.md", "agents/verifier.md", "diagnostic.md"];

function useTyped(text: string, run: boolean, speed = 22) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    setN(0);
    const id = setInterval(() => setN((v) => (v >= text.length ? v : v + 1)), speed);
    return () => clearInterval(id);
  }, [text, run, speed]);
  return run ? text.slice(0, n) : "";
}

function InterviewDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();
  // step i: question typed, then answer typed, then the file gains a line
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<"ask" | "answer" | "write">("ask");
  const done = reduce || step >= steps.length;
  const current = steps[Math.min(step, steps.length - 1)];
  const ask = useTyped(current.ask, inView && !done, 18);
  const answer = useTyped(current.answer, inView && !done && phase !== "ask", 26);

  useEffect(() => {
    if (!inView || done) return;
    const wait =
      phase === "ask" ? current.ask.length * 18 + 350 : phase === "answer" ? current.answer.length * 26 + 300 : 900;
    const id = setTimeout(() => {
      if (phase === "ask") setPhase("answer");
      else if (phase === "answer") setPhase("write");
      else {
        setStep((s) => s + 1);
        setPhase("ask");
      }
    }, wait);
    return () => clearTimeout(id);
  }, [inView, done, phase, current]);

  const written = done ? steps.length : step + (phase === "write" ? 1 : 0);

  return (
    <div ref={ref} className="overflow-hidden rounded-2xl bg-white text-neutral-900 shadow-[0_40px_80px_-32px_rgba(60,20,8,0.55)]">
      <div className="flex items-center gap-2 border-b border-neutral-200 px-4 py-3">
        <span className="size-2.5 rounded-full bg-neutral-300" />
        <span className="size-2.5 rounded-full bg-neutral-300" />
        <span className="size-2.5 rounded-full bg-neutral-300" />
        <span className="ml-2 font-mono text-[12px] text-neutral-500">claude · your-notes/</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2">
        {/* Fixed heights so the window doesn't grow, and the page doesn't shift, while the file fills in. */}
        <div className="h-[168px] border-b border-neutral-200 p-5 font-mono text-[13px] leading-relaxed sm:h-[300px] sm:border-b-0 sm:border-r">
          {done ? (
            <>
              <p className="text-warm">✻ CLAUDE.md is ready.</p>
              <p className="mt-3 text-neutral-600">Every new session now starts knowing your goal, when to push back, and how to check its work.</p>
            </>
          ) : (
            <>
              <p className="text-warm">✻ {ask}</p>
              {phase !== "ask" ? (
                <p className="mt-3 text-neutral-900">
                  <span className="text-neutral-400">&gt; </span>
                  {answer}
                  <span className="ml-0.5 inline-block h-[1.05em] w-[7px] translate-y-[2px] animate-pulse bg-neutral-900" />
                </p>
              ) : null}
            </>
          )}
        </div>

        <div className="h-[300px] bg-neutral-50 p-5 font-mono text-[12.5px] leading-relaxed">
          <p className="text-neutral-400">CLAUDE.md</p>
          <div className="mt-2 space-y-2.5">
            {steps.slice(0, written).map((s) => (
              <motion.div
                key={s.heading}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 320, damping: 26 }}
              >
                <p className="text-neutral-900">{s.heading}</p>
                <p className="text-neutral-600">{s.line}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Shown under the tool list: the tools stay free to everyone, the email is only for people who want the setup.
export function StarterSignup() {
  return (
    <div className="starter-block relative bg-warm px-5 py-14 text-white sm:px-10 md:py-20">
      {/* One form only: on mobile the demo sits between the pitch and the form, on desktop it spans the right column. */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:grid-rows-[auto_1fr] md:gap-x-14 md:gap-y-8">
        <div className="md:col-start-1 md:row-start-1">
          <p className="text-[15px] text-white/80">Free for people building with Claude Code</p>
          <h2 className="mt-4 font-serif text-[40px] leading-[1.02] tracking-[-0.01em] sm:text-[52px]">
            Two of us run a six‑figure business on this Claude Code setup.
          </h2>
          <p className="mt-5 max-w-md text-[16px] leading-relaxed text-white/90">
            Most setups forget who you are every session. This one knows your goal, pushes back when you drift, and
            checks its own work. Take the starter version. It takes 15 minutes to set up.
          </p>
        </div>

        <div className="md:col-start-2 md:row-span-2 md:row-start-1 md:self-center">
          <InterviewDemo />
          <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5 font-mono text-[12.5px] text-white/85">
            {files.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>

        <div className="md:col-start-1 md:row-start-2">
          <StarterForm />
        </div>
      </div>
    </div>
  );
}

function StarterForm() {
  return (
    <div className="starter-form">
      <GuideSignup uid={STARTER_FORM.uid} src={STARTER_FORM.script} />
      <p className="mt-3 text-[13px] text-white/80">
        Confirm your email and the download starts. One email a week after that, unsubscribe any time.
      </p>
      <style>{`
        .starter-form .kit-guide .formkit-input { border-color: transparent !important; height: 52px !important; font-size: 16px !important; }
        .starter-form .kit-guide .formkit-submit { background: #171717 !important; height: 52px !important; font-size: 15px !important; transition: transform .35s cubic-bezier(.34,1.56,.64,1) !important; }
        .starter-form .kit-guide .formkit-submit:active { transform: scale(.96) !important; }
        .starter-form .kit-guide .formkit-powered-by-convertkit { color: rgba(255,255,255,.8) !important; }
        .starter-form .kit-guide .formkit-alert-success { background: #fff !important; color: #171717 !important; border: 0 !important; }
      `}</style>
    </div>
  );
}
