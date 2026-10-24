"use client";

import { useState, type FormEvent } from "react";
import { COACHING_EXPERIENCE, COACHING_GOALS } from "@/lib/coaching";

// The coaching application on /links/fit, built like LinksContactForm but in the dark fitness colours.
// It posts to /api/coaching, which checks the fields again and emails them to Shogo.

type Values = { name: string; email: string; instagram: string; goal: string; experience: string; message: string };

const empty: Values = { name: "", email: "", instagram: "", goal: "", experience: "", message: "" };

const field =
  "w-full rounded-[14px] border border-[var(--l-line)] bg-[var(--l-card)] px-3.5 py-3 text-[15px] text-[var(--l-fg)] outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-[#6b6b6b] focus:border-[#f2f2f2] focus:shadow-[0_0_0_4px_rgba(255,255,255,0.08)]";

const validEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export default function LinksCoachingForm({ onSent }: { onSent: () => void }) {
  const [values, setValues] = useState<Values>(empty);
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  const ready = values.name.trim() && validEmail(values.email) && values.goal && values.experience && values.message.trim();

  const set = (k: keyof Values) => (e: { target: { value: string } }) => setValues((v) => ({ ...v, [k]: e.target.value }));

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!ready || state === "sending") return;
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/coaching", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const out = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(out.error ?? "Failed to send.");
      setState("sent");
      setValues(empty);
      onSent();
    } catch (err) {
      setState("idle");
      setError(err instanceof Error ? err.message : "Failed to send. Please try again.");
    }
  };

  if (state === "sent") {
    return (
      <div className="mt-6 rounded-[22px] border border-[var(--l-line)] bg-[var(--l-card)] px-6 py-10 text-center">
        <p className="text-[20px] font-extrabold uppercase tracking-[-0.03em]">Application sent</p>
        <p className="mt-2 text-[14px] text-[var(--l-muted)]">Thanks. I&apos;ll read it and email you back.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="mt-6 grid gap-3 text-left">
      <div className="grid grid-cols-2 gap-3">
        <input aria-label="Name" placeholder="Name" autoComplete="name" value={values.name} onChange={set("name")} className={field} />
        <input
          aria-label="Email"
          placeholder="Email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={values.email}
          onChange={set("email")}
          className={field}
        />
      </div>
      <input
        aria-label="Instagram (optional)"
        placeholder="Instagram @ (optional)"
        autoCapitalize="none"
        autoCorrect="off"
        value={values.instagram}
        onChange={set("instagram")}
        className={field}
      />
      <div className="grid grid-cols-2 gap-3">
        <select aria-label="Goal" value={values.goal} onChange={set("goal")} className={`${field} appearance-none ${values.goal ? "" : "text-[#6b6b6b]"}`}>
          <option value="">Goal</option>
          {COACHING_GOALS.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        <select
          aria-label="Training experience"
          value={values.experience}
          onChange={set("experience")}
          className={`${field} appearance-none ${values.experience ? "" : "text-[#6b6b6b]"}`}
        >
          <option value="">Experience</option>
          {COACHING_EXPERIENCE.map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>
      </div>
      <textarea
        aria-label="About you"
        placeholder="Your current training, how many days a week you can train, and any injuries."
        value={values.message}
        onChange={set("message")}
        rows={4}
        className={`${field} resize-y`}
      />
      {error ? <p className="text-[13px] text-[#ff6b4a]">{error}</p> : null}
      <button
        type="submit"
        disabled={!ready || state === "sending"}
        className="press h-12 rounded-full bg-[var(--l-fg)] text-[14px] font-bold uppercase tracking-[0.04em] text-[var(--l-bg)] disabled:bg-[#2a2a2a] disabled:text-[#6b6b6b]"
      >
        {state === "sending" ? "Sending…" : "Apply for coaching"}
      </button>
      <p className="text-center text-[12px] text-[var(--l-muted)]">Online only. I reply by email.</p>
    </form>
  );
}
