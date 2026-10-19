"use client";
import React, { useEffect, useRef } from "react";
import styles from "./styles.module.css";
import { cn } from "@/lib/utils";

const Beam = ({
  showBeam = true,
  className,
}: {
  showBeam?: boolean;
  className?: string;
}) => {
  const meteorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const meteor = meteorRef.current;
    if (!showBeam || !meteor) return;

    const restartAnimation = () => {
      meteor.style.animation = "none";
      void meteor.offsetWidth;
      meteor.style.animation = "";
    };
    const onEnd = () => {
      meteor.style.visibility = "hidden";
      const animationDelay = Math.floor(Math.random() * 2);
      const animationDuration = Math.floor(Math.random() * 4);
      const meteorWidth = Math.floor(Math.random() * (150 - 80) + 80);
      meteor.style.setProperty("--meteor-delay", `${animationDelay}s`);
      meteor.style.setProperty("--meteor-duration", `${animationDuration}s`);
      meteor.style.setProperty("--meteor-width", `${meteorWidth}px`);
      restartAnimation();
    };
    const onStart = () => {
      meteor.style.visibility = "visible";
    };
    meteor.addEventListener("animationend", onEnd);
    meteor.addEventListener("animationstart", onStart);
    return () => {
      meteor.removeEventListener("animationend", onEnd);
      meteor.removeEventListener("animationstart", onStart);
    };
  }, [showBeam]);
  return (
    showBeam && (
      <span
        ref={meteorRef}
        className={cn(
          "absolute z-[40] -top-4  h-[0.1rem] w-[0.1rem] rounded-[9999px] bg-blue-600 shadow-[0_0_6px_1px_rgba(59,130,246,0.35)] rotate-[180deg]",
          styles.meteor,
          className
        )}
      ></span>
    )
  );
};

export default Beam;
