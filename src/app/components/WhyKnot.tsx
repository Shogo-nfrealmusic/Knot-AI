"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "motion/react";

const cards = [
  {
    number: "01",
    title: "I ship, I don't slide-deck.",
    body: "Sole developer on a booking platform behind 1,200+ clients and a best month of ~$19.9k. I design, build, deploy, and operate it — so I sweat the details that only show up after launch.",
  },
  {
    number: "02",
    title: "I measure before I automate.",
    body: "I found a 39% drop-off in a booking funnel from session replay data before touching the code. Automation comes after you know where the time and money actually go.",
  },
  {
    number: "03",
    title: "I operate what I build.",
    body: "The booking platform, the staff app, and the content pipeline all run a business I co-founded, every day. I don't hand off and walk away — I live with the result.",
  },
];

const randomNumbers = ["08", "53", "27", "91"];

function Divider() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1075px]">
        <motion.div
          className="h-px origin-center bg-gradient-to-r from-transparent via-neutral-200 to-transparent"
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
    <span ref={ref} className="font-mono text-5xl leading-none text-warm/80">
      {display}
    </span>
  );
}

function WhyCard({ card, index }: { card: (typeof cards)[number]; index: number }) {
  return (
    <motion.article
      className="group relative rounded-lg border border-neutral-200 bg-white p-8 shadow-[0_1px_2px_0_rgba(0,0,0,0.04)]"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ delay: index * 0.15, duration: 0.7, ease: "easeOut" }}
      whileHover={{
        backgroundColor: "rgba(255,255,255,1)",
        borderColor: "rgba(212,212,212,1)",
        boxShadow: "0 16px 32px -16px rgba(0,0,0,0.14)",
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
      <div className="mb-6 h-px w-full bg-neutral-200" />
      <h3 className="mb-3 text-xl font-semibold tracking-[-0.012em] text-neutral-900">
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
    <section className="px-4 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto">
        <motion.p
          className="mb-4 font-mono text-[11.8px] uppercase tracking-[0.12em] text-warm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          WHY ME
        </motion.p>
        <motion.h2
          className="mb-12 type-heading text-text-primary"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Built differently. On purpose.
        </motion.h2>

        <div className="relative">
          <motion.div
            className="pointer-events-none absolute left-[16.66%] right-[16.66%] top-1/2 hidden origin-left border-t border-dashed border-neutral-300 md:block"
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
          className="type-heading text-text-primary"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Have a workflow that should run itself?
        </motion.h2>
        <motion.p
          className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed tracking-[-0.01em] text-text-secondary"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
        >
          One workflow. One working system. Built by someone who runs one every
          day.
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
              className="inline-flex rounded-full bg-text-primary px-6 py-3 text-sm font-medium text-bg-primary shadow-sm transition-colors hover:bg-neutral-800"
            >
              Get in touch
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
              href="/work"
              className="inline-flex rounded-full border border-neutral-200 bg-white px-6 py-3 text-sm font-medium text-text-secondary shadow-sm transition-colors hover:border-neutral-300 hover:text-text-primary"
            >
              See my work
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Pages that end with the shared dark <CTA /> pass closingCta={false} to avoid two CTAs.
export default function WhyKnot({ closingCta = true }: { closingCta?: boolean }) {
  return (
    <>
      <WhyKnotSection />
      {closingCta ? (
        <>
          <Divider />
          <ClosingCta />
        </>
      ) : null}
    </>
  );
}
