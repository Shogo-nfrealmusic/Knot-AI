"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "motion/react";

const cards = [
  {
    number: "01",
    title: "We ship, we don't slide-deck.",
    body: "Engineers, not consultants. Production code, not recommendations. We build systems your team will actually use after we leave — and we sweat the operational details that make that possible.",
  },
  {
    number: "02",
    title: "We redesign before we automate.",
    body: "Process design comes first. AI is the implementation layer, not the goal. We separate human judgment from repeatable execution, then automate only the parts that should be.",
  },
  {
    number: "03",
    title: "We stay on as you scale.",
    body: "Each month, your AI gets sharper. New capabilities build on the last. We're embedded in your operations as a partner — not a vendor who handed off and walked away.",
  },
];

const randomNumbers = ["08", "53", "27", "91"];

function Divider() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1075px]">
        <motion.div
          className="h-px origin-center bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function TickerNumber({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(reduceMotion ? value : randomNumbers[0]);

  useEffect(() => {
    if (!inView) return;

    if (reduceMotion) {
      const frame = window.requestAnimationFrame(() => setDisplay(value));
      return () => window.cancelAnimationFrame(frame);
    }

    const sequence = [...randomNumbers, value];
    const timeouts = sequence.map((item, index) =>
      window.setTimeout(() => setDisplay(item), 180 + index * 80),
    );

    return () => timeouts.forEach((timeout) => window.clearTimeout(timeout));
  }, [inView, reduceMotion, value]);

  return (
    <span ref={ref} className="font-mono text-5xl leading-none text-[#cc785c]/50">
      {display}
    </span>
  );
}

function IntroStatement() {
  return (
    <section className="px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-[920px]">
        <motion.h2
          className="text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.08] tracking-[-0.022em] text-text-primary"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          For teams that need AI to work, not just exist.
        </motion.h2>
        <motion.p
          className="mx-auto mt-6 max-w-2xl text-[15px] leading-relaxed tracking-[-0.01em] text-text-secondary"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
        >
          Knot embeds working AI into the operations where the work actually
          happens. Not chatbots. Not slide decks. Systems your team will use
          every day.
        </motion.p>
      </div>
    </section>
  );
}

function WhyCard({ card, index }: { card: (typeof cards)[number]; index: number }) {
  return (
    <motion.article
      className="group relative rounded-lg border border-white/10 bg-white/[0.015] p-8"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ delay: index * 0.15, duration: 0.7, ease: "easeOut" }}
      whileHover={{
        backgroundColor: "rgba(255,255,255,0.03)",
        borderColor: "rgba(255,255,255,0.15)",
        boxShadow: "0 0 20px rgba(204,120,92,0.1)",
      }}
    >
      <motion.div
        className="mb-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ delay: 0.25 + index * 0.15, duration: 0.25 }}
        whileHover={{ opacity: 1 }}
      >
        <TickerNumber value={card.number} />
      </motion.div>
      <div className="mb-6 h-px w-full bg-white/10" />
      <h3 className="mb-3 text-xl font-semibold tracking-[-0.012em] text-[#d0d6e0]">
        {card.title}
      </h3>
      <p className="text-[14px] leading-relaxed tracking-[-0.008em] text-text-secondary">
        {card.body}
      </p>
    </motion.article>
  );
}

function WhyKnotSection() {
  return (
    <section className="px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-[1344px]">
        <motion.p
          className="mb-4 font-mono text-[11.8px] uppercase tracking-[0.12em] text-text-secondary/40"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          WHY KNOT
        </motion.p>
        <motion.h2
          className="mb-12 text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.08] tracking-[-0.022em] text-text-primary"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Built differently. On purpose.
        </motion.h2>

        <div className="relative">
          <motion.div
            className="pointer-events-none absolute left-[16.66%] right-[16.66%] top-1/2 hidden origin-left border-t border-dashed border-white/[0.05] md:block"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ delay: 0.65, duration: 0.8, ease: "easeOut" }}
          />
          <div className="relative grid grid-cols-1 gap-5 md:grid-cols-3">
            {cards.map((card, index) => (
              <WhyCard key={card.number} card={card} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ClosingCta() {
  return (
    <section className="px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-[920px]">
        <motion.h2
          className="text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-[1.08] tracking-[-0.022em] text-text-primary"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Put AI to work inside your operations.
        </motion.h2>
        <motion.p
          className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed tracking-[-0.01em] text-text-secondary"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
        >
          One workflow. One working system. See what AI can actually do for your
          team.
        </motion.p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            animate={{ filter: ["brightness(1)", "brightness(1.03)", "brightness(1)"] }}
            whileHover={{ scale: 1.02, filter: "brightness(1.08)" }}
            transition={{
              opacity: { delay: 0.3, duration: 0.35 },
              scale: { delay: 0.3, duration: 0.35 },
              filter: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <Link
              href="/contact"
              className="inline-flex rounded-full bg-text-primary px-6 py-3 text-sm font-medium text-bg-primary transition-colors hover:bg-white/90"
            >
              Start a project
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ delay: 0.4, duration: 0.35, ease: "easeOut" }}
            whileHover={{ scale: 1.02 }}
          >
            <Link
              href="/how-it-works"
              className="inline-flex rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-text-secondary transition-colors hover:border-white/30 hover:text-text-primary"
            >
              See how it works
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function WhyKnot() {
  return (
    <>
      <IntroStatement />
      <Divider />
      <WhyKnotSection />
      <Divider />
      <ClosingCta />
    </>
  );
}
