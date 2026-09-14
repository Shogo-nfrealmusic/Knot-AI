"use client";
import { animate } from "motion/react";
import React, { useEffect } from "react";
import { IconPlugConnected, IconTerminal2 } from "@tabler/icons-react";
import { SiClaude } from "react-icons/si";
import { cn } from "@/lib/utils";
import { ClaudeLogo, OpenAILogo } from "@/app/components/icons/illustrations";

export const SkeletonThree = () => {
  useEffect(() => {
    const scale = [1, 1.1, 1];
    const transform = ["translateY(0px)", "translateY(-4px)", "translateY(0px)"];
    const sequence = [1, 2, 3, 4, 5].map((index) => [
      `.circle-${index}`,
      { scale, transform },
      { duration: 0.8 },
    ]);

    const controls = animate(sequence, {
      // @ts-expect-error motion's sequence typing does not accept selector tuples built at runtime
      repeat: Infinity,
      repeatDelay: 1,
    });
    return () => controls.stop();
  }, []);

  return (
    <div className="p-8 overflow-hidden h-full relative flex items-center justify-center">
      <div className="flex flex-row flex-shrink-0 justify-center items-center gap-2">
        <Container className="h-8 w-8 circle-1">
          <IconTerminal2 className="h-4 w-4 text-neutral-500" />
        </Container>
        <Container className="h-12 w-12 circle-2">
          <SiClaude className="h-6 w-6" color="#D97757" />
        </Container>
        <Container className="circle-3">
          <ClaudeLogo className="h-8 w-8" />
        </Container>
        <Container className="h-12 w-12 circle-4">
          <OpenAILogo className="h-6 w-6 text-neutral-900" />
        </Container>
        <Container className="h-8 w-8 circle-5">
          <IconPlugConnected className="h-4 w-4 text-neutral-500" />
        </Container>
      </div>

      <div className="h-40 w-px absolute top-20 m-auto z-40 bg-gradient-to-b from-transparent via-warm to-transparent animate-move">
        <div className="absolute -left-10 top-1/2 h-32 w-10 -translate-y-1/2 bg-[radial-gradient(closest-side,rgba(224,85,47,0.18),transparent)] blur-md" />
      </div>
    </div>
  );
};

const Container = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        `h-16 w-16 rounded-full flex items-center justify-center border border-neutral-200 bg-white
    shadow-[0_1px_2px_0_rgba(0,0,0,0.05),0_8px_16px_-8px_rgba(0,0,0,0.12)]
    `,
        className
      )}
    >
      {children}
    </div>
  );
};
