"use client";

import { useState, type FormEvent } from "react";

// The /contact form, in place on /links so a visitor can write without leaving the page.
// Same fields and the same /api/contact endpoint (which validates them again on the server);
// rebuilt without the animation library /contact uses, so /links stays light.

type Values = { name: string; email: string; company: string; projectType: string; timeline: string; context: string };

const empty: Values = { name: "", email: "", company: "", projectType: "", timeline: "", context: "" };

const projectTypes = [
  "AI agent / AI automation",
  "Workflow automation",
  "Web app (full-stack)",
  "Mobile app",
  "Payments / booking integration",
  "Not sure yet",
];
const timelines = ["As soon as possible", "This month", "This quarter", "Exploring options"];

const field =
  "w-full rounded-[14px] border border-[var(--l-line)] bg-white/80 px-3.5 py-3 text-[15px] outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-[#a3a29f] focus:border-[#191919] focus:shadow-[0_0_0_4px_rgba(0,0,0,0.06)]";

const validEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export default function LinksContactForm({ onSent }: { onSent: () => void }) {
  const [values, setValues] = useState<Values>(empty);
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  const ready =
    values.name.trim() &&
    validEmail(values.email) &&
    values.company.trim() &&
    values.projectType &&
    values.timeline &&
    values.context.trim();

  const set = (k: keyof Values) => (e: { target: { value: string } }) => setValues((v) => ({ ...v, [k]: e.target.value }));

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!ready || state === "sending") return;
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const out = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(out.error ?? "Failed to send message.");
      setState("sent");
      setValues(empty);
      onSent();
    } catch (err) {
      setState("idle");
      setError(err instanceof Error ? err.message : "Failed to send message. Please try again.");
    }
  };

  if (state === "sent") {
    return (
      <div className="lg mt-6 rounded-[22px] px-6 py-10 text-center">
        <p className="text-[20px] font-semibold tracking-[-0.03em]">Message received</p>
        <p className="mt-2 text-[14px] text-[var(--l-muted)]">Thanks. I&apos;ll read it and reply with a clear next step.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="lg mt-6 grid gap-3 rounded-[24px] p-4 text-left">
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
        aria-label="Company or project"
        placeholder="Company or project"
        autoComplete="organization"
        value={values.company}
        onChange={set("company")}
        className={field}
      />
      <div className="grid grid-cols-2 gap-3">
        <select aria-label="Project type" value={values.projectType} onChange={set("projectType")} className={`${field} appearance-none ${values.projectType ? "" : "text-[#a3a29f]"}`}>
          <option value="">Project type</option>
          {projectTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select aria-label="Timeline" value={values.timeline} onChange={set("timeline")} className={`${field} appearance-none ${values.timeline ? "" : "text-[#a3a29f]"}`}>
          <option value="">Timeline</option>
          {timelines.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <textarea
        aria-label="What should be built, connected, or automated?"
        placeholder="What should be built, connected, or automated? The tools involved, the pain, and what a good outcome looks like."
        value={values.context}
        onChange={set("context")}
        rows={4}
        className={`${field} resize-y`}
      />
      {error ? <p className="text-[13px] text-[#e0552f]">{error}</p> : null}
      <button
        type="submit"
        disabled={!ready || state === "sending"}
        className="press h-12 rounded-full bg-[#191919] text-[15px] font-semibold text-white disabled:bg-[#d6d5d2] disabled:text-white"
      >
        {state === "sending" ? "Sending…" : "Send message"}
      </button>
      <p className="text-center text-[12px] text-[var(--l-muted)]">No pitch deck needed. Clear context is enough.</p>
    </form>
  );
}
