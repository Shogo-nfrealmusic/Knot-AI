"use client";

import { useId } from "react";
import { motion } from "motion/react";
import {
  IconArrowUpRight,
  IconBriefcase,
  IconBuildingStore,
  IconCode,
  IconMapPin,
  IconPlane,
  IconRobot,
  IconRocket,
  type Icon,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

type Entry = {
  when: string;
  title: string;
  detail?: string;
  icon: Icon;
  href?: string;
};

const entries: Entry[] = [
  { when: "2004", title: "Born in Chiba, Japan", icon: IconMapPin },
  {
    when: "University",
    title: "Taught himself to code",
    detail:
      "Landed a first startup internship within three months, then worked as a full-stack and frontend engineer.",
    icon: IconCode,
  },
  {
    when: "Seattle",
    title: "Studied computer science for a year",
    detail:
      "Living abroad shaped how he thinks about building technology and business together.",
    icon: IconPlane,
  },
  {
    when: "ByteDance Japan",
    title: "TikTok Shop operations",
    icon: IconBuildingStore,
  },
  {
    when: "Mercari",
    title: "Product manager",
    detail:
      "Built and published an AI agent that automated core PM workflows with Claude Code and MCP.",
    icon: IconRobot,
    href: "https://engineering.mercari.com/en/blog/entry/20260427-mercari-pm-agent-design-automating-the-pm-workflow-with-claude-code-skills-and-mcp/",
  },
  {
    when: "2026",
    title: "Co-founded TPS Collective",
    detail:
      "With Tetty Endo. Leads product, technology, growth, and operations.",
    icon: IconRocket,
    href: "https://www.tps-collective.com/",
  },
  {
    when: "April 2027",
    title: "Joins Mercari as a Product Manager",
    detail: "While continuing to lead technology at TPS Collective.",
    icon: IconBriefcase,
  },
];

// dub.co changelog-style hover: a 60px grid that fades in from the right.
function HoverGrid() {
  const id = useId();
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 size-full text-neutral-300 opacity-0 transition-opacity [mask-image:linear-gradient(90deg,transparent,black)] group-hover:opacity-90"
    >
      <defs>
        <pattern id={id} x="0" y="13" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

function Row({ entry, index }: { entry: Entry; index: number }) {
  const { icon: EntryIcon, href } = entry;
  const first = index === 0;
  const last = index === entries.length - 1;

  const body = (
    <>
      <HoverGrid />
      <div className="relative grid grid-cols-[min-content_minmax(0,1fr)]">
        <div className="relative px-4 py-7 md:px-8 md:py-9">
          <div
            className={cn(
              "absolute left-1/2 -translate-x-px border-l border-neutral-200",
              first ? "top-1/2 h-1/2" : last ? "top-0 h-1/2" : "top-0 h-full",
            )}
          />
          <div className="relative size-12 rounded-full border border-neutral-300 bg-white">
            <EntryIcon
              stroke={1.75}
              className={cn(
                "absolute inset-0 m-auto size-[18px] text-neutral-600 transition-[transform,opacity]",
                href && "group-hover:-translate-y-1 group-hover:opacity-0",
              )}
            />
            {href ? (
              <IconArrowUpRight className="absolute inset-0 m-auto size-5 translate-y-1 text-neutral-600 opacity-0 transition-[transform,opacity] group-hover:translate-y-0 group-hover:opacity-100" />
            ) : null}
          </div>
        </div>
        <div className="flex flex-col justify-center gap-1.5 py-5 pr-4">
          <span className="text-sm text-neutral-500">{entry.when}</span>
          <span className="text-base font-medium text-neutral-900">{entry.title}</span>
          {entry.detail ? (
            <span className="max-w-lg text-sm leading-relaxed text-neutral-500">
              {entry.detail}
            </span>
          ) : null}
        </div>
      </div>
    </>
  );

  const className =
    "group relative block h-full overflow-hidden px-2 transition-colors hover:bg-neutral-100";

  return (
    <motion.li
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
          {body}
        </a>
      ) : (
        <div className={className}>{body}</div>
      )}
    </motion.li>
  );
}

export default function AboutTimeline() {
  return (
    <ul className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
      {entries.map((entry, index) => (
        <Row key={entry.title} entry={entry} index={index} />
      ))}
    </ul>
  );
}
