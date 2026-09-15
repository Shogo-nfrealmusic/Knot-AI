"use client";

import { Fragment, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { SiInstagram } from "react-icons/si";
import NetworkGrowth from "@/app/components/howitworks/NetworkGrowth";

// Everything here comes from the Instagram project entry in src/lib/projects.ts.
const marqueeItems = [
  "@imshogo.k",
  "Motivation",
  "Fitness",
  "Self-growth",
  "0 → 29,000 followers",
  "Multiple videos past 1M views",
  "13 months of account data",
  "Shares → reach",
  "1.14M views · last 30 days",
];

// Each metric tab jumps the growth map to the stage that tells its story.
const metrics = [
  { label: "Followers", value: "29,000", note: "built from zero", stage: 5 },
  { label: "Top videos", value: "1M+", note: "views, multiple videos", stage: 3 },
  { label: "Analysis", value: "13 mo", note: "of my own account data", stage: 4 },
];

// Instagram Insights for @imshogo.k, last 30 days as of Sep 16, 2026 (user-provided).
const insights = {
  views: 1_142_924,
  newFollowers: 1_598,
  interactions: 61_400,
  profileVisits: 17_000,
  linkTaps: 2_500,
};

const percent = (part: number, whole: number) => `${((part / whole) * 100).toFixed(1)}%`;

const insightTabs = [
  { label: "Views", value: "1.14M", note: `${insights.views.toLocaleString("en-US")} total` },
  { label: "New followers", short: "Followers", value: `+${insights.newFollowers.toLocaleString("en-US")}`, note: "in 30 days" },
  { label: "Interactions", value: "61.4K", note: `${percent(insights.interactions, insights.views)} of views` },
];

const journey = [
  { label: "Views", value: "1,142,924", step: null },
  { label: "Profile visits", value: "17K", step: `${percent(insights.profileVisits, insights.views)} of views` },
  { label: "Link-in-bio taps", value: "2.5K", step: `${percent(insights.linkTaps, insights.profileVisits)} of profile visits` },
];

const views = ["30 days", "Growth", "Signals"] as const;
type View = (typeof views)[number];

const ease = [0.16, 1, 0.3, 1] as const;

function Marquee() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative overflow-hidden border-b border-neutral-200 bg-neutral-50/80 py-2.5 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      <motion.div
        className="flex w-max"
        animate={reduceMotion ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 32, ease: "linear", repeat: Infinity }}
      >
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 gap-2 pr-2">
            {marqueeItems.map((item) => (
              <li
                key={item}
                className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-neutral-200 bg-white px-2.5 py-1 font-mono text-[11px] leading-none text-neutral-600"
              >
                <span className="size-1.5 rounded-full bg-warm/70" />
                {item}
              </li>
            ))}
          </ul>
        ))}
      </motion.div>
    </div>
  );
}

function ViewToggle({ view, onChange }: { view: View; onChange: (view: View) => void }) {
  return (
    <div
      role="tablist"
      aria-label="Dashboard view"
      className="flex rounded-lg border border-neutral-200 bg-neutral-100 p-0.5"
    >
      {views.map((item) => {
        const active = item === view;
        return (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item)}
            className={`relative whitespace-nowrap rounded-md px-2 py-1 text-[12px] font-medium sm:px-3 sm:text-[13px] transition-colors duration-150 ${
              active ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            {active ? (
              <motion.span
                layoutId="audience-view-pill"
                className="absolute inset-0 rounded-md border border-neutral-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
                transition={{ type: "spring", bounce: 0.15, duration: 0.45 }}
              />
            ) : null}
            <span className="relative">{item}</span>
          </button>
        );
      })}
    </div>
  );
}

function GrowthView({ stage, onStageChange }: { stage: number; onStageChange: (stage: number) => void }) {
  return (
    <div>
      <div className="grid grid-cols-3 border-b border-neutral-200">
        {metrics.map((metric, index) => {
          const active = metric.stage === stage;
          return (
            <button
              key={metric.label}
              type="button"
              onClick={() => onStageChange(metric.stage)}
              className={`relative min-w-0 px-3 py-3 text-left transition-colors duration-150 sm:px-5 sm:py-4 ${
                index > 0 ? "border-l border-neutral-200" : ""
              } ${active ? "bg-white" : "bg-neutral-50/60 hover:bg-white"}`}
            >
              <p className="truncate text-[12px] font-medium text-neutral-500">{metric.label}</p>
              <p
                className={`mt-1 font-mono text-[20px] leading-none tracking-[-0.04em] transition-colors duration-200 sm:text-[24px] ${
                  active ? "text-neutral-900" : "text-neutral-400"
                }`}
              >
                {metric.value}
              </p>
              <p className="mt-1.5 hidden truncate text-[11px] text-neutral-400 sm:block">{metric.note}</p>
              {active ? (
                <motion.span
                  layoutId="audience-metric-rail"
                  className="absolute inset-x-0 -bottom-px h-0.5 bg-warm"
                  transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
                />
              ) : null}
            </button>
          );
        })}
      </div>
      <NetworkGrowth bare stage={stage} onStageChange={onStageChange} />
    </div>
  );
}

function InsightsView() {
  return (
    <div className="flex h-full flex-col">
      <div className="grid grid-cols-3 border-b border-neutral-200">
        {insightTabs.map((tab, index) => (
          <div
            key={tab.label}
            className={`relative min-w-0 px-3 py-3 sm:px-5 sm:py-4 ${index > 0 ? "border-l border-neutral-200" : ""} ${
              index === 0 ? "bg-white" : "bg-neutral-50/60"
            }`}
          >
            <p className="truncate text-[12px] font-medium text-neutral-500">
              {"short" in tab ? (
                <>
                  <span className="sm:hidden">{tab.short}</span>
                  <span className="max-sm:hidden">{tab.label}</span>
                </>
              ) : (
                tab.label
              )}
            </p>
            <p
              className={`mt-1 font-mono text-[20px] leading-none tracking-[-0.04em] sm:text-[24px] ${
                index === 0 ? "text-neutral-900" : "text-neutral-700"
              }`}
            >
              {tab.value}
            </p>
            <p className="mt-1.5 hidden truncate text-[11px] text-neutral-400 sm:block">{tab.note}</p>
            {index === 0 ? <span className="absolute inset-x-0 -bottom-px h-0.5 bg-warm" /> : null}
          </div>
        ))}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-3 sm:p-5">
        <ListCard title="From views to link taps" column="Last 30 days">
          <ol>
            {journey.map((row, index) => (
              <li key={row.label}>
                {row.step ? (
                  <div className="flex items-center gap-2 py-1.5 pl-[22px]">
                    <span className="h-5 w-px bg-gradient-to-b from-orange-200 to-warm/60" />
                    <span className="rounded-full border border-orange-200 bg-orange-50 px-2 py-0.5 font-mono text-[11px] leading-none text-warm">
                      {row.step}
                    </span>
                  </div>
                ) : null}
                <div
                  className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 ${
                    index === 0 ? "bg-orange-50/70" : "bg-neutral-50"
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-md border border-neutral-200 bg-white font-mono text-[10px] text-neutral-500">
                      {index + 1}
                    </span>
                    <span className="truncate text-[14px] text-neutral-800">{row.label}</span>
                  </span>
                  <span className="shrink-0 font-mono text-[14px] tabular-nums text-neutral-900">{row.value}</span>
                </div>
              </li>
            ))}
          </ol>
        </ListCard>

        <div className="hidden items-center gap-3 rounded-xl border border-orange-200 bg-orange-50/60 px-4 py-3 sm:flex">
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-warm">Growth</span>
          <p className="text-[13px] text-neutral-800">
            {insights.newFollowers.toLocaleString("en-US")} new followers in the same 30 days.
          </p>
        </div>

        <p className="mt-auto px-1 font-mono text-[10px] leading-relaxed text-neutral-500 sm:text-[11px]">
          Instagram Insights · last 30 days · <span className="whitespace-nowrap">Sep 2026</span>
        </p>
      </div>
    </div>
  );
}

type SignalRow = { label: string; verdict: string; width: string; strong: boolean };

const reachSignals: SignalRow[] = [
  { label: "Share count", verdict: "Reliable", width: "94%", strong: true },
  { label: "Follower count", verdict: "Nearly useless", width: "14%", strong: false },
];

const accountRows = [
  { label: "Followers", value: "0 → 29,000" },
  { label: "Videos past 1M views", value: "Multiple" },
  { label: "Account data analyzed", value: "13 months" },
  { label: "Niche", value: "Motivation · Fitness · Self-growth" },
];

function ListCard({
  title,
  column,
  chip,
  children,
}: {
  title: string;
  column: string;
  chip?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-neutral-200 px-4 py-3">
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          <p className="text-[13px] font-medium text-neutral-900">{title}</p>
          {chip ? (
            <span className="shrink-0 rounded border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 font-mono text-[10px] uppercase leading-none tracking-[0.04em] text-neutral-500">
              {chip}
            </span>
          ) : null}
        </div>
        <p className="hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.08em] text-neutral-400 sm:block">
          {column}
        </p>
      </div>
      <div className="p-2">{children}</div>
    </div>
  );
}

function SignalsView({ active }: { active: boolean }) {
  return (
    <div className="flex h-full flex-col gap-3 p-3 sm:p-5">
      <ListCard title="Leading indicator of reach" column="Verdict" chip="Illustrative">
        <ul>
          {reachSignals.map((row, index) => (
            <li key={row.label} className="px-3 py-2.5">
              <div className="flex items-center justify-between gap-3">
                <span className="truncate text-[14px] text-neutral-800">{row.label}</span>
                <span className={`shrink-0 font-mono text-[12px] ${row.strong ? "text-warm" : "text-neutral-500"}`}>
                  {row.verdict}
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-100">
                <motion.span
                  aria-hidden
                  className={`block h-full rounded-full ${row.strong ? "bg-warm" : "bg-neutral-300"}`}
                  initial={false}
                  animate={{ width: active ? row.width : "0%" }}
                  transition={{ duration: 0.9, delay: active ? 0.15 + index * 0.12 : 0, ease }}
                />
              </div>
            </li>
          ))}
        </ul>
      </ListCard>

      <ListCard title="The account" column="Value">
        <ul className="divide-y divide-neutral-100">
          {accountRows.map((row) => (
            <li key={row.label} className="flex min-h-10 items-center justify-between gap-4 px-3 py-2">
              <span className="text-[13px] text-neutral-500">{row.label}</span>
              <span className="text-right text-[13px] font-medium text-neutral-900">
                {/* Break only between terms, never inside "Self-growth". */}
                {row.value.split(" · ").map((part, index) => (
                  <Fragment key={part}>
                    {index > 0 ? " · " : null}
                    <span className="whitespace-nowrap">{part}</span>
                  </Fragment>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </ListCard>

      <div className="hidden items-center gap-3 rounded-xl border border-orange-200 bg-orange-50/60 px-4 py-3 sm:flex">
        <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-warm">Takeaway</span>
        <p className="text-[13px] text-neutral-800">Shares lead reach. Follower count doesn&apos;t.</p>
      </div>

      <p className="mt-auto px-1 text-[12px] leading-relaxed text-neutral-500">
        From a 13-month analysis of my own account data. Bar lengths show the finding, not measured values.
      </p>
    </div>
  );
}

export default function AudienceDashboard() {
  const [view, setView] = useState<View>("30 days");
  const [stage, setStage] = useState(0);

  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_12px_40px_-16px_rgba(0,0,0,0.12)]">
      <div className="flex items-center justify-between gap-3 border-b border-neutral-200 px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-md border border-neutral-200 bg-white">
            <SiInstagram className="size-3.5 text-neutral-800" />
          </span>
          <p className="truncate text-[14px] font-medium text-neutral-900 max-[400px]:sr-only">
            Audience<span className="hidden sm:inline"> analytics</span>
          </p>
        </div>
        <ViewToggle view={view} onChange={setView} />
      </div>

      <Marquee />

      {/* On lg both views share one grid cell, so switching never changes the card's height.
          Stacked on phones, the taller Signals view left a gap under Growth, so the idle view drops out there. */}
      <div className="grid">
        {views.map((item) => {
          const active = item === view;
          return (
            <motion.div
              key={item}
              role="tabpanel"
              aria-label={item}
              aria-hidden={!active}
              inert={!active}
              className={`col-start-1 row-start-1 min-w-0 ${active ? "" : "pointer-events-none max-lg:hidden"}`}
              initial={false}
              animate={{
                opacity: active ? 1 : 0,
                y: active ? 0 : 8,
                filter: active ? "blur(0px)" : "blur(4px)",
              }}
              transition={{ duration: 0.45, ease }}
            >
              {item === "30 days" ? (
                <InsightsView />
              ) : item === "Growth" ? (
                <GrowthView stage={stage} onStageChange={setStage} />
              ) : (
                <SignalsView active={active} />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
