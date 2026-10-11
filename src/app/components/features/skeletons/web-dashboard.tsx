"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import type { IconType } from "react-icons";
import { FaAws } from "react-icons/fa";
import {
  SiCloudflare,
  SiGo,
  SiGoogleanalytics,
  SiGooglecalendar,
  SiInstagram,
  SiNextdotjs,
  SiPostgresql,
  SiStripe,
} from "react-icons/si";
import {
  IconChevronRight,
  IconClick,
  IconCoin,
  IconCreditCard,
  IconLink,
  IconListDetails,
  IconMapPin,
  IconSearch,
  IconShare,
  IconSparkles,
  IconUsers,
} from "@tabler/icons-react";

// Real GA4 numbers for book.tettyphotostudio.com, Aug 18 – Sep 14, 2026 (GA4 report snapshot export).
// Users plot the exported daily series; key events and revenue only exist as per-country totals.

// Monthly revenue in Stripe, confirmed by Shogo. Only the lowest and best months (plus the year-one goal) were
// supplied, so the Sales card draws that range and nothing in between. Converted at ¥154 = $1.
const STRIPE_MONTHLY_REVENUE = {
  jpyPerUsd: 154,
  lowestMonthJpy: 616_163,
  bestMonthJpy: 3_057_147,
  yearOneGoalJpy: 200_000_000,
};

const ease = [0.16, 1, 0.3, 1] as const;

export const DATE_RANGE = "Aug 18 – Sep 14, 2026";

type MetricKey = "users" | "keyEvents" | "revenue";

type Country = { code: string; name: string } & Record<MetricKey, number>;

const countries: Country[] = [
  { code: "US", name: "United States", users: 1511, keyEvents: 43, revenue: 3275 },
  { code: "JP", name: "Japan", users: 536, keyEvents: 28, revenue: 4188 },
  { code: "AU", name: "Australia", users: 327, keyEvents: 9, revenue: 627 },
  { code: "PH", name: "Philippines", users: 191, keyEvents: 0, revenue: 0 },
  { code: "CA", name: "Canada", users: 160, keyEvents: 1, revenue: 87 },
  { code: "UK", name: "United Kingdom", users: 154, keyEvents: 1, revenue: 75 },
  { code: "DE", name: "Germany", users: 134, keyEvents: 2, revenue: 177 },
  { code: "FR", name: "France", users: 113, keyEvents: 0, revenue: 0 },
  { code: "IN", name: "India", users: 107, keyEvents: 0, revenue: 0 },
  { code: "SG", name: "Singapore", users: 96, keyEvents: 3, revenue: 427 },
];

// GA4 "N 日目" rows: [new users, returning users], day 0 = Aug 18 through day 27 = Sep 14.
const daily: [number, number][] = [
  [156, 18], [159, 13], [142, 12], [113, 7], [188, 17], [135, 18], [168, 21], [133, 15], [123, 12], [97, 15],
  [116, 16], [147, 21], [188, 20], [125, 15], [115, 15], [141, 16], [116, 22], [107, 13], [208, 23], [343, 27],
  [174, 19], [153, 13], [107, 13], [131, 15], [154, 17], [125, 17], [155, 15], [134, 31],
];

const DAYS = daily.length;
// Aug 18 + i; August has 31 days, so day 14 is Sep 1. Built by hand to avoid locale/timezone drift between server and client.
const dayLabel = (day: number) => (day <= 13 ? `Aug ${18 + day}` : `Sep ${day - 13}`);
const PEAK_DAY = daily.reduce((best, [newUsers], day) => (newUsers > daily[best][0] ? day : best), 0);
const DATE_TICKS = [0, 7, 14, 21, DAYS - 1];

const metrics: {
  key: MetricKey;
  label: string;
  short: string;
  total: number;
  swatch: string;
  bar: string;
  barActive: string;
  dot: string;
}[] = [
  {
    key: "users",
    label: "Active users",
    short: "Users",
    total: 4205,
    swatch: "bg-blue-500/50",
    bar: "border-blue-500 bg-blue-500/15",
    barActive: "border-blue-500 bg-blue-500/35",
    dot: "bg-blue-500",
  },
  {
    key: "keyEvents",
    label: "Key events",
    short: "Events",
    total: 106,
    swatch: "bg-violet-600/50",
    bar: "border-violet-600 bg-violet-600/15",
    barActive: "border-violet-600 bg-violet-600/35",
    dot: "bg-violet-600",
  },
  {
    key: "revenue",
    label: "GA4 revenue",
    short: "Revenue",
    total: 10433,
    swatch: "bg-teal-500/50",
    bar: "border-teal-500 bg-teal-500/15",
    barActive: "border-teal-500 bg-teal-500/35",
    dot: "bg-teal-500",
  },
];

type Metric = (typeof metrics)[number];

const COLUMNS = 7;

const formatValue = (key: MetricKey, value: number) =>
  `${key === "revenue" ? "$" : ""}${value.toLocaleString("en-US")}`;

const formatTick = (key: MetricKey, value: number) =>
  `${key === "revenue" ? "$" : ""}${value >= 1000 ? `${value / 1000}K` : value}`;

// Round the axis up to a readable ceiling (1,511 → 2,000; 43 → 50; $4,188 → $5,000).
function niceMax(value: number) {
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const step = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].find((f) => f * magnitude >= value) ?? 10;
  return step * magnitude;
}

const AREA_MAX = niceMax(Math.max(...daily.map(([newUsers, returning]) => newUsers + returning)));

const topCountries = (key: MetricKey) =>
  [...countries].sort((a, b) => b[key] - a[key]).slice(0, COLUMNS);

const services: { name: string; icon: IconType; color: string }[] = [
  { name: "Stripe", icon: SiStripe, color: "text-[#635BFF]" },
  { name: "Google Analytics", icon: SiGoogleanalytics, color: "text-[#E37400]" },
  { name: "Google Calendar", icon: SiGooglecalendar, color: "text-[#4285F4]" },
  { name: "Instagram", icon: SiInstagram, color: "text-[#E4405F]" },
  { name: "Cloudflare", icon: SiCloudflare, color: "text-[#F38020]" },
  { name: "AWS", icon: FaAws, color: "text-neutral-800" },
  { name: "Next.js", icon: SiNextdotjs, color: "text-neutral-900" },
  { name: "Go", icon: SiGo, color: "text-[#00ADD8]" },
  { name: "PostgreSQL", icon: SiPostgresql, color: "text-[#4169E1]" },
];

function ServiceMarquee({ paused }: { paused: boolean }) {
  return (
    <div className="hidden min-w-0 flex-1 overflow-hidden py-1 sm:flex [mask-image:linear-gradient(90deg,transparent,black_28px,black_calc(100%-28px),transparent)]">
      <div
        className="flex w-max gap-2.5 motion-safe:animate-infinite-scroll"
        style={
          {
            "--scroll": "-50%",
            animationDuration: "28s",
            animationPlayState: paused ? "paused" : "running",
          } as CSSProperties
        }
      >
        {[0, 1].map((copy) =>
          services.map(({ name, icon: Icon, color }) => (
            <span
              key={`${copy}-${name}`}
              title={name}
              aria-hidden={copy === 1 || undefined}
              className="flex size-8 shrink-0 items-center justify-center rounded-full border border-neutral-100 bg-white shadow-sm"
            >
              <Icon className={`size-4 ${color}`} aria-label={copy === 0 ? name : undefined} />
            </span>
          )),
        )}
      </div>
    </div>
  );
}

const views = [
  { name: "Traffic", icon: IconUsers, metric: "users" },
  { name: "Sales", icon: IconCoin, metric: "revenue" },
] as const;

type View = (typeof views)[number]["name"];

function ViewToggle({ view, onChange }: { view: View; onChange: (view: (typeof views)[number]) => void }) {
  return (
    <div role="tablist" aria-label="Analytics view" className="flex shrink-0 items-center gap-0.5 rounded-xl bg-neutral-100 p-0.5 max-sm:flex-1">
      {views.map((item) => {
        const active = item.name === view;
        const Icon = item.icon;
        return (
          <button
            key={item.name}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item)}
            className={`relative flex h-8 items-center justify-center gap-1.5 px-2.5 text-[13px] max-sm:flex-1 font-medium transition-colors duration-150 sm:px-3 ${
              active ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            {active ? (
              <motion.span
                layoutId="web-dashboard-view-pill"
                className="absolute inset-0 rounded-lg border border-neutral-200 bg-white"
                transition={{ type: "spring", bounce: 0.15, duration: 0.45 }}
              />
            ) : null}
            <Icon className="relative size-3.5" />
            <span className="relative">{item.name}</span>
          </button>
        );
      })}
    </div>
  );
}

function MetricTabs({ metric, onChange }: { metric: Metric; onChange: (metric: Metric) => void }) {
  return (
    <div role="tablist" aria-label="Chart metric" className="grid grid-cols-3 border-b border-neutral-200">
      {metrics.map((item, index) => {
        const active = item.key === metric.key;
        return (
          <div key={item.key} className="relative min-w-0">
            {index > 0 ? (
              <span className="absolute left-0 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-neutral-200 bg-white p-1 sm:p-1.5">
                <IconChevronRight className="size-2.5 text-neutral-500 sm:size-3" />
              </span>
            ) : null}
            <button
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(item)}
              className={`relative block h-full w-full overflow-hidden px-2.5 py-3 text-left transition-colors hover:bg-neutral-50 sm:px-5 sm:py-4 ${
                index > 0 ? "border-l border-neutral-200" : ""
              }`}
            >
              <span
                className={`absolute inset-x-0 bottom-0 h-0.5 bg-neutral-900 transition-transform duration-200 ${
                  active ? "" : "translate-y-[3px]"
                }`}
              />
              <span className="flex items-center gap-2 text-[12px] text-neutral-600 sm:text-[13px]">
                <span className={`hidden size-2 shrink-0 rounded-sm shadow-[inset_0_0_0_1px_#00000019] sm:block ${item.swatch}`} />
                <span className="truncate sm:hidden">{item.short}</span>
                <span className="hidden truncate sm:inline">{item.label}</span>
              </span>
              <span
                className={`mt-1 block text-[16px] font-medium tabular-nums tracking-[-0.02em] transition-colors duration-200 sm:text-[22px] ${
                  active ? "text-neutral-900" : "text-neutral-500"
                }`}
              >
                {formatValue(item.key, item.total)}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}

const PLOT_HEIGHT = "h-[140px] sm:h-[150px]";

function YAxis({ ticks }: { ticks: string[] }) {
  return (
    <div className={`relative w-7 shrink-0 font-mono text-[11px] text-neutral-400 sm:w-8 ${PLOT_HEIGHT}`}>
      {ticks.map((label, index) => (
        <span
          key={index}
          className="absolute right-0 -translate-y-1/2 tabular-nums"
          style={{ top: `${(index / (ticks.length - 1)) * 100}%` }}
        >
          {label}
        </span>
      ))}
    </div>
  );
}

function Gridlines() {
  return (
    <>
      {[0, 0.5].map((f) => (
        <span key={f} className="absolute inset-x-0 border-t border-dashed border-black/15" style={{ top: `${f * 100}%` }} />
      ))}
      <span className="absolute inset-x-0 bottom-0 border-t border-black/15" />
    </>
  );
}

// Monotone cubic curve: no overshoot, so the area never dips below zero or spikes past a real day.
function monotonePath(points: [number, number][]) {
  const n = points.length;
  const slopes = points.slice(1).map(([x, y], i) => (y - points[i][1]) / (x - points[i][0]));
  const tangents = points.map((_, i) => {
    if (i === 0) return slopes[0];
    if (i === n - 1) return slopes[n - 2];
    const [a, b] = [slopes[i - 1], slopes[i]];
    return a * b <= 0 ? 0 : (2 * a * b) / (a + b);
  });
  let d = `M${points[0][0]},${points[0][1]}`;
  for (let i = 0; i < n - 1; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    const h = (x1 - x0) / 3;
    d += `C${x0 + h},${y0 + tangents[i] * h} ${x1 - h},${y1 - tangents[i + 1] * h} ${x1},${y1}`;
  }
  return d;
}

const VB_W = (DAYS - 1) * 10;
const VB_H = 100;
const toY = (value: number) => VB_H - (value / AREA_MAX) * VB_H;
const totalLine = monotonePath(daily.map(([n, r], day) => [day * 10, toY(n + r)]));
const returningLine = monotonePath(daily.map(([, r], day) => [day * 10, toY(r)]));
const closeArea = (line: string) => `${line}L${VB_W},${VB_H}L0,${VB_H}Z`;

function DailyUsersChart({ show }: { show: boolean }) {
  const reduceMotion = useReducedMotion();
  const [day, setDay] = useState(PEAK_DAY);
  const [scrubbing, setScrubbing] = useState(false);

  // Step the cursor across the days until someone scrubs or focuses the chart.
  useEffect(() => {
    if (!show || scrubbing || reduceMotion) return;
    const interval = window.setInterval(() => setDay((current) => (current + 1) % DAYS), 900);
    return () => window.clearInterval(interval);
  }, [show, scrubbing, reduceMotion]);

  const [newUsers, returning] = daily[day];
  const left = `${(day / (DAYS - 1)) * 100}%`;
  const leftHalf = day < DAYS / 2;

  const tooltip = (
    <div className="min-w-[132px] rounded-lg border border-neutral-200 bg-white/95 shadow-sm backdrop-blur-sm sm:min-w-[164px]">
      <p className="flex items-center justify-between gap-3 border-b border-neutral-200 px-2.5 py-1.5 text-[12px] text-neutral-900 sm:px-3 sm:py-2">
        <span className="tabular-nums">{dayLabel(day)}</span>
        <span className="font-mono text-[11px] text-neutral-400">2026</span>
      </p>
      <div className="space-y-1 px-2.5 py-1.5 text-[12px] sm:px-3 sm:py-2">
        {[
          { label: "New", value: newUsers, swatch: "bg-blue-500/50" },
          { label: "Returning", value: returning, swatch: "bg-blue-900/60" },
        ].map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-neutral-600">
              <span className={`size-2 rounded-sm ${row.swatch}`} />
              {row.label}
            </span>
            <span className="font-medium tabular-nums text-neutral-900">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const scrub = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    setDay(Math.round(ratio * (DAYS - 1)));
  };

  const step = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    setDay((current) => Math.min(DAYS - 1, Math.max(0, current + (event.key === "ArrowRight" ? 1 : -1))));
  };

  return (
    <div className="flex gap-2 px-3 pb-3 pt-4 sm:gap-3 sm:px-5 sm:pt-5">
      <YAxis ticks={[AREA_MAX, AREA_MAX / 2, 0].map((value) => formatTick("users", value))} />

      <div className="relative min-w-0 flex-1">
        <div
          role="slider"
          tabIndex={0}
          aria-label={`Daily users, ${DATE_RANGE}`}
          aria-valuemin={0}
          aria-valuemax={DAYS - 1}
          aria-valuenow={day}
          aria-valuetext={`${dayLabel(day)}: ${newUsers} new, ${returning} returning`}
          onPointerEnter={() => setScrubbing(true)}
          onPointerMove={scrub}
          onPointerLeave={() => setScrubbing(false)}
          onFocus={() => setScrubbing(true)}
          onBlur={() => setScrubbing(false)}
          onKeyDown={step}
          className={`relative touch-pan-y cursor-crosshair rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${PLOT_HEIGHT}`}
        >
          <div className="pointer-events-none absolute inset-0">
            <Gridlines />
          </div>

          <motion.svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            preserveAspectRatio="none"
            className="absolute inset-0 size-full overflow-visible"
            initial={false}
            animate={{ clipPath: show ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)" }}
            transition={{ duration: show ? 1.1 : 0.45, ease }}
            aria-hidden
          >
            <defs>
              <linearGradient id="web-dashboard-new" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.03" />
              </linearGradient>
              <linearGradient id="web-dashboard-returning" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <path d={closeArea(totalLine)} fill="url(#web-dashboard-new)" />
            <path d={closeArea(returningLine)} fill="url(#web-dashboard-returning)" />
            <path d={totalLine} fill="none" stroke="#3b82f6" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
            <path d={returningLine} fill="none" stroke="#1e3a8a" strokeOpacity={0.7} strokeWidth={1.25} vectorEffect="non-scaling-stroke" />
          </motion.svg>

          <div className="pointer-events-none absolute inset-0">
            <motion.span
              className="absolute inset-y-0 w-px bg-neutral-900/40"
              initial={false}
              animate={{ left, opacity: show ? 1 : 0 }}
              transition={{ duration: 0.45, ease }}
            />
            <motion.span
              className="absolute size-2 -translate-x-1/2 translate-y-1/2 rounded-full bg-blue-500 ring-2 ring-white"
              initial={false}
              animate={{ left, bottom: `${((newUsers + returning) / AREA_MAX) * 100}%`, opacity: show ? 1 : 0 }}
              transition={{ duration: 0.45, ease }}
            />
            <motion.span
              className="absolute size-1.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-blue-900 ring-2 ring-white"
              initial={false}
              animate={{ left, bottom: `${(returning / AREA_MAX) * 100}%`, opacity: show ? 1 : 0 }}
              transition={{ duration: 0.45, ease }}
            />

            <motion.div
              className="absolute inset-y-0 z-20 w-0 max-sm:hidden"
              initial={false}
              animate={{ left, opacity: show ? 1 : 0 }}
              transition={{ duration: 0.45, ease }}
            >
              <div className={`absolute top-0 ${leftHalf ? "left-3" : "right-3"}`}>{tooltip}</div>
            </motion.div>
            {/* Phones have no room beside the cursor, so the tooltip parks in the far corner instead. */}
            <div className={`absolute top-0 z-20 sm:hidden ${leftHalf ? "right-0" : "left-0"}`}>{tooltip}</div>
          </div>
        </div>

        <div className="relative mt-2 h-4 font-mono text-[11px] text-neutral-400">
          {DATE_TICKS.map((tick, index) => (
            <span
              key={tick}
              className={`absolute top-0 whitespace-nowrap transition-colors duration-200 ${
                index === 0 ? "" : index === DATE_TICKS.length - 1 ? "-translate-x-full" : "-translate-x-1/2"
              } ${tick === day ? "text-neutral-900" : ""} ${index === 1 || index === 3 ? "max-sm:hidden" : ""}`}
              style={{ left: `${(tick / (DAYS - 1)) * 100}%` }}
            >
              {dayLabel(tick)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function CountryChart({ metric, show }: { metric: Metric; show: boolean }) {
  const reduceMotion = useReducedMotion();
  const rows = topCountries(metric.key);
  const max = niceMax(rows[0][metric.key]);
  const [activeCode, setActiveCode] = useState(rows[0].code);
  const [hovering, setHovering] = useState(false);

  // A code missing from the new metric's top 7 (e.g. PH on Revenue) falls back to the leader.
  const activeIndex = Math.max(0, rows.findIndex((row) => row.code === activeCode));
  const active = rows[activeIndex];
  const activeShare = ((active[metric.key] / metric.total) * 100).toFixed(1);

  // Walk the tooltip across the columns like a cursor would, until someone takes over.
  useEffect(() => {
    if (!show || hovering || reduceMotion) return;
    const interval = window.setInterval(() => {
      const order = topCountries(metric.key);
      setActiveCode((code) => {
        const index = order.findIndex((row) => row.code === code);
        return order[(index + 1) % order.length].code;
      });
    }, 2400);
    return () => window.clearInterval(interval);
  }, [show, hovering, reduceMotion, metric.key]);

  const center = `${((activeIndex + 0.5) / rows.length) * 100}%`;
  const leftHalf = activeIndex < rows.length / 2;

  return (
    <div className="flex gap-2 px-3 pb-3 pt-4 sm:gap-3 sm:px-5 sm:pt-5">
      <YAxis ticks={[max, max / 2, 0].map((value) => formatTick(metric.key, value))} />

      <div className="relative min-w-0 flex-1" onMouseLeave={() => setHovering(false)}>
        <div className={`pointer-events-none absolute inset-x-0 top-0 ${PLOT_HEIGHT}`}>
          <Gridlines />

          <motion.span
            className="absolute inset-y-0 w-px bg-neutral-900/40"
            initial={false}
            animate={{ left: center, opacity: show ? 1 : 0 }}
            transition={{ duration: 0.5, ease }}
          />
          <motion.span
            className={`absolute size-2 -translate-x-1/2 translate-y-1/2 rounded-full ring-2 ring-white ${metric.dot}`}
            initial={false}
            animate={{
              left: center,
              bottom: `${(active[metric.key] / max) * 100}%`,
              opacity: show ? 1 : 0,
            }}
            transition={{ duration: 0.5, ease }}
          />

          <div className={`absolute top-0 z-20 ${leftHalf ? "right-0" : "left-0"}`}>
            <div className="min-w-[132px] rounded-lg border border-neutral-200 bg-white/95 shadow-sm backdrop-blur-sm sm:min-w-[164px]">
              <p className="flex items-center gap-2 border-b border-neutral-200 px-2.5 py-1.5 text-[12px] text-neutral-900 sm:px-3 sm:py-2">
                <span className="rounded border border-neutral-200 bg-neutral-50 px-1 font-mono text-[11px] leading-4 text-neutral-500">
                  {active.code}
                </span>
                <span className="truncate">{active.name}</span>
              </p>
              <div className="flex items-center justify-between gap-4 px-2.5 pt-1.5 text-[12px] sm:px-3 sm:pt-2">
                <span className="flex items-center gap-1.5 text-neutral-600">
                  <span className={`size-2 rounded-sm ${metric.swatch}`} />
                  {metric.short}
                </span>
                <span className="font-medium tabular-nums text-neutral-900">{formatValue(metric.key, active[metric.key])}</span>
              </div>
              <p className="px-2.5 pb-1.5 text-[11px] tabular-nums text-neutral-400 sm:px-3 sm:pb-2">{activeShare}% of total</p>
            </div>
          </div>
        </div>

        {/* Columns are keyed by slot, not country: each slot grows or shrinks into the next metric's
            value. Reordering them with layout animations left some percentage heights stuck at 0. */}
        <div className="flex">
          {rows.map((row, index) => {
            const isActive = row.code === active.code;
            return (
              <button
                key={index}
                type="button"
                aria-label={`${row.name}: ${formatValue(metric.key, row[metric.key])} ${metric.label.toLowerCase()}`}
                onMouseEnter={() => {
                  setHovering(true);
                  setActiveCode(row.code);
                }}
                onFocus={() => setActiveCode(row.code)}
                onClick={() => setActiveCode(row.code)}
                className="flex min-w-0 flex-1 flex-col items-center focus:outline-none"
              >
                <span className={`flex w-full items-end justify-center px-1 sm:px-2 ${PLOT_HEIGHT}`}>
                  <motion.span
                    className={`block w-full max-w-9 rounded-t-[4px] border-t-2 transition-colors duration-200 ${
                      isActive ? metric.barActive : metric.bar
                    }`}
                    initial={{ height: 0 }}
                    animate={{ height: show ? `${(row[metric.key] / max) * 100}%` : 0 }}
                    transition={{ duration: 0.8, delay: show ? 0.15 + index * 0.03 : 0, ease }}
                  />
                </span>
                <span
                  className={`mt-2 font-mono text-[11px] transition-colors duration-200 ${
                    isActive ? "text-neutral-900" : "text-neutral-400"
                  }`}
                >
                  {row.code}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

type BarRow = { label: string; value: number; display: string; lead: ReactNode; tag?: string };

const tones = {
  orange: { bar: "bg-orange-100", hover: "hover:border-orange-500 hover:from-orange-50" },
  blue: { bar: "bg-blue-100", hover: "hover:border-blue-500 hover:from-blue-50" },
} as const;

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="flex h-5 min-w-6 shrink-0 items-center justify-center rounded border border-neutral-200 bg-white px-1 font-mono text-[11px] leading-none text-neutral-500">
      {children}
    </span>
  );
}

function IconLead({ icon: Icon }: { icon: typeof IconShare }) {
  return (
    <span className="flex size-5 shrink-0 items-center justify-center rounded border border-neutral-200 bg-white">
      <Icon className="size-3 text-neutral-600" />
    </span>
  );
}

function BarList({
  title,
  column,
  tone,
  rows,
  show,
  className = "",
}: {
  title: string;
  column: string;
  tone: keyof typeof tones;
  rows: BarRow[];
  show: boolean;
  className?: string;
}) {
  const max = Math.max(...rows.map((row) => row.value));
  return (
    <div
      className={`relative h-[292px] overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-[0_1.55px_5.37px_rgba(0,0,0,0.035),0_7.35px_20.99px_rgba(0,0,0,0.055)] ${className}`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-neutral-200 px-4">
        <p className="relative py-3.5 text-[13px] font-medium text-neutral-900">
          {title}
          <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-t-full bg-neutral-900" />
        </p>
        <p className="truncate font-mono text-[11px] uppercase tracking-[0.04em] text-neutral-500">{column}</p>
      </div>
      <ul className="py-3">
        {rows.map((row, index) => (
          <li
            key={row.label}
            className={`border-l-2 border-transparent bg-gradient-to-r to-transparent px-3 py-0.5 transition-colors ${tones[tone].hover}`}
          >
            <div className="relative flex h-8 items-center justify-between">
              <motion.span
                aria-hidden
                className={`absolute inset-y-0 left-0 rounded-md ${tones[tone].bar}`}
                initial={{ width: 0 }}
                animate={{ width: show ? `${(row.value / max) * 100}%` : 0 }}
                transition={{ duration: 0.9, delay: 0.1 + index * 0.06, ease }}
              />
              <span className="relative flex min-w-0 items-center gap-2.5 px-2.5">
                {row.lead}
                <span className="truncate text-[13px] text-neutral-800">{row.label}</span>
                {row.tag ? (
                  <span className="shrink-0 rounded border border-neutral-200 bg-white px-1 font-mono text-[11px] leading-4 text-neutral-400">
                    {row.tag}
                  </span>
                ) : null}
              </span>
              <span className="relative shrink-0 px-2 text-[13px] tabular-nums text-neutral-600">{row.display}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const count = (value: number) => value.toLocaleString("en-US");

// Page rows are GA4 active users per page title; the last two steps are GA4 key events and the Purchasers audience.
const bookingFlowRows: BarRow[] = [
  { label: "Plans", value: 3828, icon: IconListDetails },
  { label: "Locations", value: 1468, icon: IconMapPin },
  { label: "Checkout", value: 1206, icon: IconCreditCard },
  { label: "Key events", value: 106, icon: IconSparkles, tag: "event" },
  { label: "Purchasers", value: 81, icon: IconCoin, tag: "audience" },
].map(({ icon, ...row }) => ({ ...row, display: count(row.value), lead: <IconLead icon={icon} /> }));

const channelRows: BarRow[] = [
  { label: "Organic Social", value: 2225, icon: IconShare },
  { label: "Direct", value: 1858, icon: IconClick },
  { label: "Organic Search", value: 54, icon: IconSearch },
  { label: "Referral", value: 9, icon: IconLink },
  { label: "AI Assistant", value: 6, icon: IconSparkles },
].map(({ icon, ...row }) => ({ ...row, display: count(row.value), lead: <IconLead icon={icon} /> }));

const usd = (jpy: number) => jpy / STRIPE_MONTHLY_REVENUE.jpyPerUsd;
const usdK = (jpy: number) => `$${(usd(jpy) / 1000).toFixed(1)}k`;
const yen = (jpy: number) => `¥${jpy.toLocaleString("en-US")}`;

function StripeRevenueCard({ show }: { show: boolean }) {
  const { jpyPerUsd, lowestMonthJpy, bestMonthJpy, yearOneGoalJpy } = STRIPE_MONTHLY_REVENUE;
  const scale = niceMax(usd(bestMonthJpy));
  const low = (usd(lowestMonthJpy) / scale) * 100;
  const best = (usd(bestMonthJpy) / scale) * 100;
  const months = [
    { label: "Lowest month", jpy: lowestMonthJpy, dot: "border-2 border-teal-500 bg-white", align: "items-start" },
    { label: "Best month", jpy: bestMonthJpy, dot: "bg-teal-500", align: "items-end text-right" },
  ];

  const goal = `Year one ~$${(usd(yearOneGoalJpy) / 1_000_000).toFixed(1)}M (¥${yearOneGoalJpy / 1_000_000}M)`;
  const goalChip = (className: string) => (
    <p className={`items-center gap-2 rounded-md border border-dashed border-neutral-300 px-2 py-1.5 text-[12px] text-neutral-700 ${className}`}>
      <span className="font-mono text-[11px] uppercase tracking-[0.04em] text-neutral-400">Goal</span>
      {goal}
    </p>
  );

  // On lg the card spans both columns in a compact layout, so all of it sits above the dashboard's bottom fade.
  return (
    <div className="relative h-[292px] overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-[0_1.55px_5.37px_rgba(0,0,0,0.035),0_7.35px_20.99px_rgba(0,0,0,0.055)] lg:col-span-2 lg:h-auto">
      <div className="flex items-center justify-between gap-3 border-b border-neutral-200 px-4">
        <p className="relative py-3.5 text-[13px] font-medium text-neutral-900 lg:py-3">
          Monthly revenue
          <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-t-full bg-neutral-900" />
        </p>
        <p className="truncate font-mono text-[11px] uppercase tracking-[0.04em] text-neutral-500 lg:hidden">Stripe</p>
        <p className="hidden truncate font-mono text-[11px] text-neutral-500 lg:block">{`Stripe · JPY converted at ¥${jpyPerUsd} = $1`}</p>
      </div>

      <div className="px-4 py-3.5 lg:py-3">
        <div className="flex items-center justify-between gap-3">
          <p className="flex items-baseline gap-1.5 tabular-nums tracking-[-0.02em] text-neutral-900">
            <span className="text-[20px] font-medium">{usdK(lowestMonthJpy)}</span>
            <span className="text-neutral-300">–</span>
            <span className="text-[20px] font-medium">{usdK(bestMonthJpy)}</span>
            <span className="text-[12px] tracking-normal text-neutral-400">/ month</span>
          </p>
          {goalChip("hidden lg:flex lg:py-1")}
        </div>

        <div className="mt-3 grid grid-cols-[auto_1fr_auto] items-center gap-2 font-mono text-[11px] text-neutral-400">
          <span>$0</span>
          <div className="relative h-1.5 rounded-full bg-neutral-100">
            <motion.span
              className="absolute inset-y-0 rounded-full bg-gradient-to-r from-teal-300 to-teal-500"
              style={{ left: `${low}%` }}
              initial={{ width: 0 }}
              animate={{ width: show ? `${best - low}%` : 0 }}
              transition={{ duration: 1, delay: 0.2, ease }}
            />
            <span
              className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-teal-500 bg-white"
              style={{ left: `${low}%` }}
            />
            <motion.span
              className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500 ring-2 ring-white"
              initial={{ left: `${low}%` }}
              animate={{ left: `${show ? best : low}%` }}
              transition={{ duration: 1, delay: 0.2, ease }}
            />
          </div>
          <span>{`$${scale / 1000}k`}</span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3 lg:mt-2.5">
          {months.map((month) => (
            <div key={month.label} className={`flex flex-col ${month.align} lg:flex-row lg:items-baseline lg:gap-2`}>
              <span className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                <span className={`size-2 rounded-full ${month.dot}`} />
                {month.label}
              </span>
              <span className="mt-0.5 text-[13px] font-medium tabular-nums text-neutral-900 lg:mt-0">{usdK(month.jpy)}</span>
              <span className="font-mono text-[11px] tabular-nums text-neutral-400">{yen(month.jpy)}</span>
            </div>
          ))}
        </div>

        {goalChip("mt-3 flex lg:hidden")}
        <p className="mt-2.5 font-mono text-[11px] text-neutral-400 lg:hidden">{`Stripe · JPY converted at ¥${jpyPerUsd} = $1`}</p>
      </div>
    </div>
  );
}

// GA4 "user key event rate" per country, only where the country had key events.
const conversionRows: BarRow[] = [
  { code: "JP", label: "Japan", value: 4.48 },
  { code: "SG", label: "Singapore", value: 3.13 },
  { code: "AU", label: "Australia", value: 2.14 },
  { code: "US", label: "United States", value: 1.99 },
  { code: "DE", label: "Germany", value: 1.49 },
  { code: "UK", label: "United Kingdom", value: 0.65 },
  { code: "CA", label: "Canada", value: 0.63 },
].map(({ code, ...row }) => ({ ...row, display: `${row.value.toFixed(2)}%`, lead: <Badge>{code}</Badge> }));

export function WebDashboard() {
  const ref = useRef<HTMLDivElement>(null);
  const show = useInView(ref, { amount: 0.25 });
  const [view, setView] = useState<View>("Traffic");
  const [metric, setMetric] = useState<Metric>(metrics[0]);
  // Columns keep the last per-country metric while the users area is showing, so they don't reshuffle as they fade.
  const [columnMetric, setColumnMetric] = useState<Metric>(metrics[1]);
  const areaMode = metric.key === "users";

  const selectMetric = (next: Metric) => {
    setMetric(next);
    if (next.key !== "users") setColumnMetric(next);
  };

  return (
    <div
      ref={ref}
      // Sales ends on the Stripe card, which must stay fully legible, so it fades only the list peeking below it on lg.
      className={`relative h-full lg:overflow-hidden ${
        view === "Traffic"
          ? "[mask-image:linear-gradient(black_82%,transparent)] lg:[mask-image:linear-gradient(black_76%,transparent)]"
          : "lg:[mask-image:linear-gradient(black_94%,transparent)]"
      }`}
    >
      <div className="flex items-center gap-3 rounded-t-xl border-x border-t border-neutral-200 bg-neutral-50 pb-4 pl-3 pr-2 pt-2 sm:pl-4">
        <ServiceMarquee paused={!show} />
        <ViewToggle
          view={view}
          onChange={(next) => {
            setView(next.name);
            selectMetric(metrics.find((item) => item.key === next.metric) ?? metrics[0]);
          }}
        />
      </div>

      <div className="relative -mt-2 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-[0_1.55px_5.37px_rgba(0,0,0,0.035),0_7.35px_20.99px_rgba(0,0,0,0.055)]">
        <MetricTabs metric={metric} onChange={selectMetric} />
        {/* Both charts share one cell: the users area wipes away while the country columns grow in, and back. */}
        <div className="grid">
          {[
            { key: "area", active: areaMode, chart: <DailyUsersChart show={show && areaMode} /> },
            { key: "columns", active: !areaMode, chart: <CountryChart metric={columnMetric} show={show && !areaMode} /> },
          ].map((layer) => (
            <motion.div
              key={layer.key}
              aria-hidden={!layer.active}
              inert={!layer.active}
              className={`col-start-1 row-start-1 min-w-0 ${layer.active ? "z-10" : "pointer-events-none"}`}
              initial={false}
              animate={{ opacity: layer.active ? 1 : 0 }}
              transition={{ duration: 0.4, delay: layer.active ? 0.1 : 0.25, ease }}
            >
              {layer.chart}
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={view}
          className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2"
          initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
          transition={{ duration: 0.35, ease }}
        >
          {view === "Traffic" ? (
            <>
              <BarList title="Booking flow" column="GA4 users" tone="orange" rows={bookingFlowRows} show={show} />
              <BarList title="Channels" column="New users" tone="blue" rows={channelRows} show={show} className="max-sm:hidden" />
            </>
          ) : (
            <>
              <StripeRevenueCard show={show} />
              <BarList title="Key event rate" column="By country" tone="blue" rows={conversionRows} show={show} className="max-sm:hidden" />
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
