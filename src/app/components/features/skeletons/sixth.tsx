"use client";
import { motion, useInView } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const CYCLE_MS = 6500;
const DEPLOY_AT = 3.8;

const codeLines = [
  { text: "export default async function Page() {", tone: "text-emerald-700" },
  { text: "  const orders = await db.orders.recent();", tone: "text-neutral-700" },
  { text: "  const session = await stripe.checkout(orders);", tone: "text-neutral-700" },
  { text: "  track(\"checkout_started\", { session });", tone: "text-neutral-500" },
  { text: "  return <Dashboard orders={orders} />;", tone: "text-orange-700" },
  { text: "}", tone: "text-emerald-700" },
];

function Block({ className, delay }: { className?: string; delay: number }) {
  return (
    <motion.div
      className={cn("rounded-[4px]", className)}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}

export const SkeletonWeb = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const interval = window.setInterval(() => setCycle((c) => c + 1), CYCLE_MS);
    return () => window.clearInterval(interval);
  }, [inView]);

  return (
    <div ref={ref} className="relative flex h-full items-center justify-center p-4 sm:p-6">
      <div
        key={cycle}
        className="w-full max-w-2xl overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-[0_24px_60px_-24px_rgba(0,0,0,0.18)] ring-4 ring-neutral-900/[0.04]"
      >
        <div className="flex h-9 items-center gap-1.5 border-b border-neutral-200 bg-neutral-50 px-3">
          <span className="h-2.5 w-2.5 rounded-full border border-neutral-400" />
          <span className="h-2.5 w-2.5 rounded-full border border-neutral-400" />
          <span className="h-2.5 w-2.5 rounded-full border border-neutral-400" />
          <span className="ml-3 truncate rounded border border-neutral-200 bg-white px-2 py-0.5 font-mono text-[11px] text-text-muted">
            your-product.com
          </span>
          <span className="relative ml-auto h-5 w-24 font-mono text-[10px] uppercase tracking-[0.08em]">
            <motion.span
              className="absolute inset-0 flex items-center justify-end gap-1.5 text-amber-600"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ delay: DEPLOY_AT, duration: 0.2 }}
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
              Building
            </motion.span>
            <motion.span
              className="absolute inset-0 flex items-center justify-end gap-1.5 text-emerald-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: DEPLOY_AT, duration: 0.3 }}
            >
              ✓ Deployed
            </motion.span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[1.1fr_1fr]">
          <div className="space-y-3 border-b border-neutral-200 p-5 sm:border-b-0 sm:border-r">
            <div className="flex items-center justify-between">
              <Block className="h-2.5 w-16 bg-neutral-300" delay={0.1} />
              <div className="flex gap-2">
                <Block className="h-2 w-8 bg-neutral-200" delay={0.15} />
                <Block className="h-2 w-8 bg-neutral-200" delay={0.2} />
                <Block className="h-2 w-8 bg-neutral-200" delay={0.25} />
              </div>
            </div>
            <Block className="mt-5 h-4 w-4/5 bg-neutral-800" delay={0.4} />
            <Block className="h-4 w-3/5 bg-neutral-400" delay={0.5} />
            <Block className="h-2 w-2/3 bg-neutral-200" delay={0.65} />
            <Block className="h-6 w-20 rounded-full bg-warm" delay={0.8} />
            <div className="grid grid-cols-3 gap-2 pt-2">
              {[1, 1.1, 1.2].map((delay) => (
                <Block
                  key={delay}
                  className="h-12 border border-neutral-200 bg-neutral-50"
                  delay={delay}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-between p-5">
            <div className="space-y-1.5">
              {codeLines.map((line, index) => (
                <motion.div
                  key={line.text}
                  className={cn(
                    "overflow-hidden whitespace-pre font-mono text-[10.5px] leading-5",
                    line.tone,
                  )}
                  initial={{ clipPath: "inset(0 100% 0 0)" }}
                  animate={{ clipPath: "inset(0 0% 0 0)" }}
                  transition={{ delay: 0.3 + index * 0.45, duration: 0.5, ease: "linear" }}
                >
                  {line.text}
                </motion.div>
              ))}
            </div>
            <div className="mt-4 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 font-mono text-[10.5px] leading-5">
              <p className="text-neutral-500">$ deploy --prod</p>
              <motion.p
                className="text-emerald-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: DEPLOY_AT, duration: 0.3 }}
              >
                ✓ live on your-product.com
              </motion.p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
