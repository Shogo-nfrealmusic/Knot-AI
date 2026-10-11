"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { animate, useInView } from "motion/react";

export default function CountUp({
  to,
  format,
  className,
  duration = 1,
}: {
  to: number;
  format: (value: number) => string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  // The server renders the real number, so link previews, search snippets and no-JS readers never see 0.
  const [value, setValue] = useState(to);
  const [armed, setArmed] = useState(false);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = element.getBoundingClientRect();
    // Only numbers that start off-screen count up; resetting one already on screen would flash.
    if (rect.top >= window.innerHeight || rect.bottom <= 0) {
      setValue(0);
      setArmed(true);
    }
  }, []);

  useEffect(() => {
    if (!armed || !inView) return;
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: setValue,
    });
    return () => controls.stop();
  }, [armed, inView, to, duration]);

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}
