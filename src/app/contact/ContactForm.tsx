"use client";

import { FormEvent, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { GridSection } from "@/app/components/ui/grid-section";

type FormValues = {
  name: string;
  email: string;
  company: string;
  projectType: string;
  timeline: string;
  context: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = {
  name: "",
  email: "",
  company: "",
  projectType: "",
  timeline: "",
  context: "",
};

const projectTypes = [
  "AI agent / AI automation",
  "Workflow automation",
  "Web app (full-stack)",
  "Mobile app",
  "Payments / booking integration",
  "Not sure yet",
];

const timelines = [
  "As soon as possible",
  "This month",
  "This quarter",
  "Exploring options",
];

const nextSteps = [
  {
    title: "I read your message",
    body: "Share the tools, the manual steps, and what outcome would make the project worth doing.",
  },
  {
    title: "I suggest a build path",
    body: "Whether this is best solved with AI, automation, custom software, or a mix — and what I would build first.",
  },
  {
    title: "We scope the first milestone",
    body: "If there is a strong fit, we agree on a focused first deliverable that proves value quickly.",
  },
];

const signals = [
  "AI agents with Claude Code, MCP, and LLM APIs",
  "Workflow and content automation",
  "Web apps with Next.js, Go, and PostgreSQL",
  "Mobile apps with React Native and Expo",
  "Stripe payments and booking flows",
];

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validate(values: FormValues) {
  const errors: FormErrors = {};

  if (!values.name.trim()) errors.name = "Name is required.";
  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!validateEmail(values.email)) {
    errors.email = "Enter a valid email.";
  }
  if (!values.company.trim()) errors.company = "Company or project name is required.";
  if (!values.projectType) errors.projectType = "Select a project type.";
  if (!values.timeline) errors.timeline = "Select a timeline.";
  if (!values.context.trim()) {
    errors.context = "Tell me what you want to build or automate.";
  }

  return errors;
}

function FieldError({ message }: { message?: string }) {
  return (
    <AnimatePresence>
      {message ? (
        <motion.p
          initial={{ opacity: 0, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -2 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="mt-1 text-[12px] text-warm"
        >
          {message}
        </motion.p>
      ) : null}
    </AnimatePresence>
  );
}

// dub.co form controls: neutral hairline, dark border + soft ring on focus.
const fieldClassName =
  "w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 shadow-sm outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-neutral-400 hover:border-neutral-300 focus:border-neutral-500 focus:ring-4 focus:ring-black/10 aria-[invalid=true]:border-red-300";

const labelClassName = "mb-2 block text-sm font-medium text-neutral-900";

export default function ContactForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validationErrors = validate(values);
  const isFormValid = Object.keys(validationErrors).length === 0;

  const updateField = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    if (touched[field] || errors[field]) {
      const nextValues = { ...values, [field]: value };
      setErrors(validate(nextValues));
    }
  };

  const handleBlur = (field: keyof FormValues) => {
    setTouched((current) => ({ ...current, [field]: true }));
    setErrors(validate(values));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);
    setTouched({
      name: true,
      email: true,
      company: true,
      projectType: true,
      timeline: true,
      context: true,
    });

    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error ?? "Failed to send message.");
      }

      setIsSubmitted(true);
      setValues(initialValues);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to send message. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GridSection innerClassName="px-4 py-14 sm:px-10 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)] lg:gap-12">
        <aside>
          <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-warm">
            What happens next
          </p>

          <div className="mt-8 grid gap-3">
            {nextSteps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-xl border border-neutral-200 bg-white shadow-sm p-5"
              >
                <p className="font-mono text-[12px] text-warm">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-5 text-[20px] font-semibold tracking-[-0.02em] text-text-primary">
                  {step.title}
                </h2>
                <p className="mt-3 text-[14px] leading-relaxed tracking-[-0.01em] text-text-secondary">
                  {step.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-neutral-200 bg-neutral-50 p-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-neutral-500">
              What I work on
            </p>
            <ul className="mt-5 space-y-3">
              {signals.map((signal) => (
                <li key={signal} className="flex gap-3 text-[14px] text-text-secondary">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  <span>{signal}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* self-start + sticky: the form keeps its own height instead of stretching to the aside. */}
        <div className="rounded-xl border border-neutral-200 bg-white shadow-sm p-5 sm:p-8 lg:sticky lg:top-20 lg:self-start">
          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex min-h-[520px] flex-col items-center justify-center text-center"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700">
                  ✓
                </div>
                <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-semibold tracking-[-0.022em] text-text-primary">
                  Message received
                </h2>
                <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-text-secondary">
                  Thanks — I&apos;ll read it and reply with a clear next step.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                onSubmit={handleSubmit}
                noValidate
                className="grid gap-5"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className={labelClassName} htmlFor="name">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Your name"
                      aria-required="true"
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      value={values.name}
                      onChange={(event) => updateField("name", event.target.value)}
                      onBlur={() => handleBlur("name")}
                      className={fieldClassName}
                    />
                    <div id="name-error">
                      <FieldError message={errors.name} />
                    </div>
                  </div>

                  <div>
                    <label className={labelClassName} htmlFor="email">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@company.com"
                      aria-required="true"
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      value={values.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      onBlur={() => handleBlur("email")}
                      className={fieldClassName}
                    />
                    <div id="email-error">
                      <FieldError message={errors.email} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className={labelClassName} htmlFor="company">
                    Company / project
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    placeholder="Company or product name"
                    aria-required="true"
                    aria-invalid={Boolean(errors.company)}
                    aria-describedby={errors.company ? "company-error" : undefined}
                    value={values.company}
                    onChange={(event) => updateField("company", event.target.value)}
                    onBlur={() => handleBlur("company")}
                    className={fieldClassName}
                  />
                  <div id="company-error">
                    <FieldError message={errors.company} />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className={labelClassName} htmlFor="projectType">
                      Project type
                    </label>
                    <select
                      id="projectType"
                      name="projectType"
                      aria-required="true"
                      aria-invalid={Boolean(errors.projectType)}
                      aria-describedby={
                        errors.projectType ? "project-type-error" : undefined
                      }
                      value={values.projectType}
                      onChange={(event) =>
                        updateField("projectType", event.target.value)
                      }
                      onBlur={() => handleBlur("projectType")}
                      className={`${fieldClassName} appearance-none`}
                    >
                      <option value="">Select one</option>
                      {projectTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <div id="project-type-error">
                      <FieldError message={errors.projectType} />
                    </div>
                  </div>

                  <div>
                    <label className={labelClassName} htmlFor="timeline">
                      Timeline
                    </label>
                    <select
                      id="timeline"
                      name="timeline"
                      aria-required="true"
                      aria-invalid={Boolean(errors.timeline)}
                      aria-describedby={errors.timeline ? "timeline-error" : undefined}
                      value={values.timeline}
                      onChange={(event) => updateField("timeline", event.target.value)}
                      onBlur={() => handleBlur("timeline")}
                      className={`${fieldClassName} appearance-none`}
                    >
                      <option value="">Select timeline</option>
                      {timelines.map((timeline) => (
                        <option key={timeline} value={timeline}>
                          {timeline}
                        </option>
                      ))}
                    </select>
                    <div id="timeline-error">
                      <FieldError message={errors.timeline} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className={labelClassName} htmlFor="context">
                    What should be built, connected, or automated?
                  </label>
                  <textarea
                    id="context"
                    name="context"
                    placeholder="Describe the workflow, tool, product, or manual process. Include the apps involved, current pain points, and what a good outcome would look like."
                    aria-required="true"
                    aria-invalid={Boolean(errors.context)}
                    aria-describedby={errors.context ? "context-error" : undefined}
                    value={values.context}
                    onChange={(event) => updateField("context", event.target.value)}
                    onBlur={() => handleBlur("context")}
                    className={`${fieldClassName} min-h-40 resize-y`}
                  />
                  <div id="context-error">
                    <FieldError message={errors.context} />
                  </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-neutral-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[12px] leading-relaxed text-text-muted">
                      No pitch deck needed. Clear context is enough.
                    </p>
                    <FieldError message={submitError} />
                  </div>
                  <button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-lg border border-black bg-black px-5 text-sm font-medium text-white shadow-sm transition-all duration-150 hover:bg-neutral-800 hover:ring-4 hover:ring-neutral-200 disabled:cursor-not-allowed disabled:border-neutral-200 disabled:bg-neutral-100 disabled:text-neutral-500 disabled:hover:ring-0"
                  >
                    {isSubmitting ? "Sending..." : "Send message"}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </GridSection>
  );
}
