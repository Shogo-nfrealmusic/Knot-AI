"use client";

import { useEffect } from "react";
import {
  motion,
  stagger,
  useAnimate,
  useInView,
  useReducedMotion,
} from "motion/react";
import { cn } from "@/lib/utils";

export function TextGenerateEffect({
  words,
  className,
  filter = true,
  duration = 0.5,
  delay = 0.12,
  initialDelay = 0,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
  delay?: number;
  initialDelay?: number;
}) {
  const [scope, animate] = useAnimate();
  const isInView = useInView(scope, { once: true, amount: 0.35 });
  const shouldReduceMotion = useReducedMotion();
  const wordsArray = words.split(" ");

  useEffect(() => {
    if (!isInView) return;

    animate(
      "span",
      {
        opacity: 1,
        filter: filter && !shouldReduceMotion ? "blur(0px)" : "none",
      },
      {
        duration: shouldReduceMotion ? 0 : duration,
        delay: shouldReduceMotion ? 0 : stagger(delay, { startDelay: initialDelay }),
      },
    );
  }, [animate, delay, duration, filter, initialDelay, isInView, shouldReduceMotion]);

  return (
    <div className={cn("font-semibold", className)}>
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => (
          <motion.span
            key={`${word}-${idx}`}
            className="opacity-0"
            style={{
              filter: filter && !shouldReduceMotion ? "blur(10px)" : "none",
            }}
          >
            {word}{" "}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}
