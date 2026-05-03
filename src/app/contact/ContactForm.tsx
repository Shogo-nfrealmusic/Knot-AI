"use client";

import { FormEvent, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

type FormValues = {
  name: string;
  email: string;
  company: string;
  teamSize: string;
  bottleneck: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = {
  name: "",
  email: "",
  company: "",
  teamSize: "",
  bottleneck: "",
};

const steps = [
  "Tell us a little about your team and what's slowing it down. The more specific, the better.",
  "We'll respond within 24 hours to schedule a 30-minute call. No slides, no pitch - we'll dig into one workflow and tell you whether AI actually fits.",
  "If it's a good fit, we'll scope a Pilot Build together. If it's not, we'll tell you that too.",
];

const teamSizes = ["1-50", "50-200", "200-500", "500-2000", "2000+"];

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validate(values: FormValues) {
  const errors: FormErrors = {};

  if (!values.name.trim()) errors.name = "Name is required.";
  if (!values.email.trim()) {
    errors.email = "Work email is required.";
  } else if (!validateEmail(values.email)) {
    errors.email = "Enter a valid work email.";
  }
  if (!values.company.trim()) errors.company = "Company is required.";
  if (!values.teamSize) errors.teamSize = "Select a team size.";
  if (!values.bottleneck.trim()) {
    errors.bottleneck = "Tell us what is slowing your team down.";
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
          className="mt-1 text-[12px] text-[rgb(204,120,92)]"
        >
          {message}
        </motion.p>
      ) : null}
    </AnimatePresence>
  );
}

const fieldClassName =
  "w-full rounded-lg border border-white/10 bg-white/2 px-4 py-3 text-[15px] text-text-primary outline-none transition-all duration-150 placeholder:text-white/30 focus:border-[rgb(204,120,92)] focus:shadow-[0_0_0_3px_rgba(204,120,92,0.14)]";

const labelClassName =
  "mb-2 block font-mono text-[13px] font-medium uppercase tracking-[0.05em] text-text-secondary";

export default function ContactForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
      teamSize: true,
      bottleneck: true,
    });

    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);

    // TODO: Connect to backend (e.g., Resend, Formspree, custom API route, or Slack webhook) to actually send the form submission.
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <section className="border-t border-border px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto grid max-w-[1344px] gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:gap-20">
        <motion.div
          className="order-2 lg:order-1"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
        >
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 14 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-text-muted"
          >
            What happens next
          </motion.p>

          <div className="mt-8 space-y-4">
            {steps.map((step, index) => (
              <motion.div
                key={step}
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="rounded-2xl border border-border bg-bg-card-alt/40 p-5"
              >
                <p className="font-mono text-[12px] text-[rgb(204,120,92)]">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-4 text-[15px] leading-relaxed tracking-[-0.01em] text-text-secondary">
                  {step}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="mt-6 text-[13px] leading-relaxed text-text-muted"
          >
            Mutual NDAs signed before detailed discussion.
          </motion.p>
        </motion.div>

        <motion.div
          className="order-1 lg:order-2"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <div className="rounded-2xl border border-border bg-bg-card-alt/35 p-5 sm:p-8">
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="flex min-h-[420px] flex-col items-center justify-center text-center"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-[rgb(204,120,92)]/30 bg-[rgb(204,120,92)]/10 text-[rgb(204,120,92)]">
                    ✓
                  </div>
                  <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-semibold tracking-[-0.022em] text-text-primary">
                    Message sent
                  </h2>
                  <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-text-secondary">
                    We&apos;ll respond within 24 hours to the email you provided.
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
                  className="space-y-5"
                >
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
                      Work email
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

                  <div>
                    <label className={labelClassName} htmlFor="company">
                      Company
                    </label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      placeholder="Company name"
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

                  <div>
                    <label className={labelClassName} htmlFor="teamSize">
                      Team size
                    </label>
                    <select
                      id="teamSize"
                      name="teamSize"
                      aria-required="true"
                      aria-invalid={Boolean(errors.teamSize)}
                      aria-describedby={errors.teamSize ? "team-size-error" : undefined}
                      value={values.teamSize}
                      onChange={(event) => updateField("teamSize", event.target.value)}
                      onBlur={() => handleBlur("teamSize")}
                      className={`${fieldClassName} appearance-none`}
                    >
                      <option value="">Select team size</option>
                      {teamSizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                    <div id="team-size-error">
                      <FieldError message={errors.teamSize} />
                    </div>
                  </div>

                  <div>
                    <label className={labelClassName} htmlFor="bottleneck">
                      What&apos;s slowing your team down?
                    </label>
                    <textarea
                      id="bottleneck"
                      name="bottleneck"
                      placeholder="Describe one or two workflows that take too much time, or where errors keep happening. Anything from inquiry routing to invoice review to onboarding."
                      aria-required="true"
                      aria-invalid={Boolean(errors.bottleneck)}
                      aria-describedby={
                        errors.bottleneck ? "bottleneck-error" : undefined
                      }
                      value={values.bottleneck}
                      onChange={(event) =>
                        updateField("bottleneck", event.target.value)
                      }
                      onBlur={() => handleBlur("bottleneck")}
                      className={`${fieldClassName} min-h-36 resize-y`}
                    />
                    <div id="bottleneck-error">
                      <FieldError message={errors.bottleneck} />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className="inline-flex w-full items-center justify-center rounded-full bg-[rgb(204,120,92)] px-5 py-2.5 text-sm font-medium text-bg-primary transition-all duration-150 hover:bg-[rgb(224,139,110)] disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto"
                  >
                    {isSubmitting ? "Sending..." : "Send message"}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
