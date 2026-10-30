"use client";

import { useEffect, useState, type FormEvent } from "react";
import { FOUNDING, PLANS } from "@/lib/setup";
import { cn } from "@/lib/utils";

// The closing scene: the folded Duo with "Your setup is ready" beside a short application. Posts to /api/setup,
// which emails Shogo and sends the applicant a fixed receipt. Plan buttons elsewhere on the page link to
// #apply?plan=… and preselect here.

type Values = { name: string; email: string; business: string; website: string; plan: string; job: string };
const empty: Values = { name: "", email: "", business: "", website: "", plan: "build", job: "" };
const validEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const field =
  "w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-3 text-[15px] text-neutral-900 outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-neutral-400 focus:border-neutral-900 focus:shadow-[0_0_0_4px_rgba(0,0,0,0.06)]";

export default function Apply() {
  const [values, setValues] = useState<Values>(empty);
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  const left = FOUNDING.seats - FOUNDING.taken;

  useEffect(() => {
    const pick = () => {
      const m = location.hash.match(/plan=(\w+)/);
      if (m && PLANS.some((p) => p.id === m[1])) setValues((v) => ({ ...v, plan: m[1]! }));
    };
    // "Apply for Build" buttons in the pricing table carry data-plan; preselect that plan when one is clicked.
    const onClick = (e: MouseEvent) => {
      const plan = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-plan]")?.dataset.plan;
      if (plan && PLANS.some((p) => p.id === plan)) setValues((v) => ({ ...v, plan }));
    };
    pick();
    addEventListener("hashchange", pick);
    document.addEventListener("click", onClick);
    return () => {
      removeEventListener("hashchange", pick);
      document.removeEventListener("click", onClick);
    };
  }, []);

  const ready = values.name.trim() && validEmail(values.email) && values.business.trim() && values.job.trim();
  const set = (k: keyof Values) => (e: { target: { value: string } }) => setValues((v) => ({ ...v, [k]: e.target.value }));

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!ready || state === "sending") return;
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/setup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      const out = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(out.error ?? "Failed to send.");
      setState("sent");
    } catch (err) {
      setState("idle");
      setError(err instanceof Error ? err.message : "Failed to send. Please try again.");
    }
  };

  return (
    <div className="grid items-center gap-12 px-4 sm:px-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
      <div className="relative mx-auto w-full max-w-[460px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/setup/duo-closed.jpg" alt="A folded iPhone Duo showing 7:30 and '3 jobs done overnight' on its lock screen." className="h-auto w-full mix-blend-multiply" />
      </div>

      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--warm)]">Apply</p>
        <h2 className="mt-4 text-balance text-[clamp(34px,4.4vw,56px)] font-medium leading-[1.02] tracking-[-0.04em] text-neutral-900">
          Wake up to <span className="font-serif font-normal italic text-neutral-500">work already done.</span>
        </h2>
        <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-neutral-600">
          Tell me about your business and the job you&apos;d hand off first. I reply within two business days. {left} of {FOUNDING.seats} founding seats left.
        </p>

        {state === "sent" ? (
          <div className="mt-8 rounded-2xl border border-neutral-200 bg-white px-6 py-10 text-center shadow-sm">
            <p className="text-[20px] font-medium tracking-[-0.02em] text-neutral-900">Application sent</p>
            <p className="mt-2 text-[14px] text-neutral-500">A confirmation is on its way to your inbox. I&apos;ll reply within two business days.</p>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="mt-8 grid gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <input aria-label="Name" placeholder="Name" autoComplete="name" value={values.name} onChange={set("name")} className={field} />
              <input aria-label="Email" placeholder="Email" type="email" inputMode="email" autoComplete="email" value={values.email} onChange={set("email")} className={field} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <input aria-label="Business" placeholder="Business (what you do)" value={values.business} onChange={set("business")} className={field} />
              <input aria-label="Website (optional)" placeholder="Website (optional)" value={values.website} onChange={set("website")} className={field} />
            </div>
            <div role="radiogroup" aria-label="Plan" className="grid grid-cols-3 gap-2">
              {PLANS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  role="radio"
                  aria-checked={values.plan === p.id}
                  onClick={() => setValues((v) => ({ ...v, plan: p.id }))}
                  className={cn(
                    "rounded-xl border px-3 py-2.5 text-left transition-colors active:scale-[0.98]",
                    values.plan === p.id ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-300 bg-white text-neutral-800 hover:border-neutral-500",
                  )}
                >
                  <span className="block text-[13px] font-medium">{p.name}</span>
                  <span className={cn("block text-[12px]", values.plan === p.id ? "text-white/60" : "text-neutral-500")}>${p.monthly}/mo</span>
                </button>
              ))}
            </div>
            <textarea
              aria-label="The first job you'd hand off"
              placeholder="The first job you'd hand off, and how long it takes you each week"
              rows={4}
              value={values.job}
              onChange={set("job")}
              className={cn(field, "resize-none")}
            />
            {error ? <p className="text-[13px] text-red-600">{error}</p> : null}
            <div className="relative">
            {/* Orbit sits on the button, typing, as if it is about to start on the first job. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/setup/orbit-type.webp" alt="" className="pointer-events-none absolute -top-[46px] right-3 w-[68px]" />
            <button
              type="submit"
              disabled={!ready || state === "sending"}
              className="mt-1 inline-flex h-12 w-full items-center justify-center rounded-xl bg-neutral-900 text-[15px] font-medium text-white transition-all hover:bg-black active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {state === "sending" ? "Sending…" : "Apply for a seat"}
            </button>
            </div>
            <p className="text-center text-[12px] text-neutral-400">No payment now. I&apos;ll send a link only if it&apos;s a fit.</p>
          </form>
        )}
      </div>
    </div>
  );
}
