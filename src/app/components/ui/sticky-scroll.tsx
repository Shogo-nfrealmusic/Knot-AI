"use client";
import React, { useRef } from "react";
import { useScroll, useSpring, useTransform } from "motion/react";
import { motion } from "motion/react";

export const StickyScroll = ({
  content,
}: {
  content: {
    title: string;
    description: string;
    icon?: React.ReactNode;
  }[];
}) => {
  return (
    <div className="py-4 md:py-20">
      <motion.div className="relative hidden h-full flex-col justify-between px-10 py-10 lg:flex">
        {content.map((item, index) => (
          <ScrollContent key={item.title + index} item={item} index={index} />
        ))}
      </motion.div>
      <motion.div className="relative flex flex-col justify-between px-4 py-6 sm:px-10 lg:hidden">
        {content.map((item, index) => (
          <ScrollContentMobile
            key={item.title + index}
            item={item}
            index={index}
          />
        ))}
      </motion.div>
    </div>
  );
};

export const ScrollContent = ({
  item,
  index,
}: {
  item: {
    title: string;
    description: string;
    icon?: React.ReactNode;
    content?: React.ReactNode;
  };
  index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // The template's parallax (text +250px, visual -200px) pushed each visual up into
  // the section header and faded text out mid-read. Now the text column is sticky and
  // only fades at the item's edges, smoothed with a spring so it never steps.
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });
  const opacity = useTransform(smoothProgress, [0, 0.18, 0.82, 1], [0.25, 1, 1, 0.25]);
  const contentOpacity = useTransform(smoothProgress, [0, 0.12, 0.88, 1], [0.4, 1, 1, 0.4]);

  return (
    <motion.div
      ref={ref}
      key={item.title + index}
      // Inside the 1080px rails: a narrow sticky text column and a ~640px visual column.
      className="relative my-24 grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-10"
    >
      <div className="w-full">
        <motion.div
          style={{ opacity }}
          className="sticky top-28 will-change-[opacity]"
        >
          <div>{item.icon}</div>
          <motion.h2 className="mt-4 font-medium tracking-[-0.03em] text-2xl lg:text-[2rem] lg:leading-tight inline-block text-left text-neutral-900">
            {item.title}
          </motion.h2>

          <motion.p className="text-[15px] leading-relaxed text-neutral-600 font-normal max-w-sm mt-3">
            {item.description}
          </motion.p>
        </motion.div>
      </div>

      <motion.div
        key={item.title + index}
        style={{ opacity: contentOpacity }}
        className="h-full w-full self-start rounded-md will-change-[opacity]"
      >
        {item.content && item.content}
      </motion.div>
    </motion.div>
  );
};

export const ScrollContentMobile = ({
  item,
  index,
}: {
  item: {
    title: string;
    description: string;
    icon?: React.ReactNode;
    content?: React.ReactNode;
  };
  index: number;
}) => {
  return (
    <motion.div
      transition={{
        duration: 0.3,
      }}
      key={item.title + index}
      className="my-10  relative flex flex-col md:flex-row md:space-x-4"
    >
      <div className="w-full">
        <motion.div className=" mb-6">
          <div>{item.icon}</div>
          <motion.h2 className="mt-4 font-medium tracking-[-0.03em] text-2xl lg:text-[2rem] lg:leading-tight inline-block text-left text-neutral-900">
            {item.title}
          </motion.h2>

          <motion.p className="text-sm md:text-base leading-relaxed text-neutral-600 font-normal max-w-sm mt-2">
            {item.description}
          </motion.p>
        </motion.div>
      </div>

      <motion.div
        key={item.title + index}
        className="w-full rounded-md  self-start"
      >
        {item.content && item.content}
      </motion.div>
    </motion.div>
  );
};
