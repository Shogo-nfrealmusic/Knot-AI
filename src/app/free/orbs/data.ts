// /free/78 (Thinking Orbs): the page's facts, with no React in them so they can be tested (data.test.mjs).
// Everything here is from https://github.com/Jakubantalik/thinking-orbs (MIT, by Jakub Antalik): README.md and LICENSE,
// and the npm package thinking-orbs. The engine that draws the figures is the repo's own code, vendored in ./vendor/thinking-orbs.
// `label`, `status` and the prompt are this page's words; `does`, the install line and the Quick start are the README's.

/** One figure per chapter that has one, in order. */
export const ORBS_KINDS = ["nine", "playground", "pick", "prompt"] as const;
export type OrbsDemoKind = (typeof ORBS_KINDS)[number];

export const REPO = "https://github.com/Jakubantalik/thinking-orbs";
export const NPM = "https://www.npmjs.com/package/thinking-orbs";
export const LIVE_DEMO = "https://orbs.jakubantalik.com";
export const AUTHOR = { name: "Jakub Antalik", href: "https://github.com/Jakubantalik" };
export const NPM_VERSION = "0.3.2";

/** README, first line. */
export const TAGLINE =
  "Dotted thought-orb loading indicators for AI & agent UIs. Nine hand-tuned animated states, each shipped at two purpose-tuned sizes, rendered on a plain 2D canvas — no WebGL, no filters, works identically in Chrome, Safari and Firefox.";

export type OrbStateName = "working" | "searching" | "solving" | "listening" | "connecting" | "weaving" | "composing" | "breathing" | "shaping";

/** README, States: the nine, in its order, with its comment on each. */
export const STATES: { state: OrbStateName; does: string }[] = [
  { state: "working", does: "particles on tilted orbits" },
  { state: "searching", does: "a scan meridian sweeps a dotted globe" },
  { state: "solving", does: "bands scramble, then click back solved" },
  { state: "listening", does: "a waveform rolls through the rings" },
  { state: "connecting", does: "a constellation wires itself" },
  { state: "weaving", does: "three strands plait around the sphere" },
  { state: "composing", does: "an undulating multi-band sash" },
  { state: "breathing", does: "a ring slowly morphing" },
  { state: "shaping", does: "dotted outline: circle → triangle → square" },
];

/** README, Sizes: two tuned presets, separate designs rather than a scale factor. */
export const SIZES: { size: 64 | 20; label: string }[] = [
  { size: 64, label: "chat-avatar scale" },
  { size: 20, label: "inline-text scale" },
];

/** README, Theme. */
export const THEMES: { theme: "auto" | "dark" | "light"; does: string }[] = [
  { theme: "auto", does: "default — detects from the project" },
  { theme: "dark", does: "pin: light dots for dark backgrounds" },
  { theme: "light", does: "pin: dark dots for light backgrounds" },
];

/** README, Install and Quick start, verbatim. */
export const INSTALL = "npm install thinking-orbs";
export const QUICK_START = `import { ThinkingOrb } from 'thinking-orbs';

function Status() {
  return <ThinkingOrb state="searching" size={64} />;
}`;

/** README, Other props, verbatim. */
export const OTHER_PROPS = `<ThinkingOrb
  state="solving"
  size={20}
  speed={1.5}          // multiplier on the preset's baked speed
  paused={false}       // freeze on the current frame
  aria-label="Analysing repository…"  // overrides the per-state default
/>`;

/** README, Accessibility & performance, verbatim. */
export const A11Y = [
  "`role=\"img\"` with a sensible per-state `aria-label` out of the box.",
  "`prefers-reduced-motion: reduce` renders a static representative frame — no animation — and still follows the live theme.",
  "Every instance pauses automatically when scrolled offscreen (`IntersectionObserver`) or when the tab is hidden, and resumes in phase — all instances share one clock.",
  "Plain 2D canvas arcs only: no `ctx.filter`, no SVG filters, no WebGL — the same pixels everywhere, cheap on low-end devices. Device-pixel-ratio capped at 2.",
];

/** What the agent is doing → the state to show. This page's mapping; `status` is a sample line to put next to the orb. */
export const USES: { id: string; label: string; state: OrbStateName; status: string; while: string }[] = [
  { id: "search", label: "web search", state: "searching", status: "Searching the web…", while: "while it searches the web" },
  { id: "reason", label: "reasoning or code", state: "solving", status: "Thinking it through…", while: "while it reasons or writes code" },
  { id: "tools", label: "tool calls", state: "connecting", status: "Calling tools…", while: "while it calls tools" },
  { id: "write", label: "writing", state: "composing", status: "Writing the answer…", while: "while it writes the answer" },
  { id: "voice", label: "voice", state: "listening", status: "Listening…", while: "while it listens to the user's voice" },
  { id: "plan", label: "a multi-step plan", state: "weaving", status: "Working through the plan…", while: "while it runs a multi-step plan" },
  { id: "wait", label: "waiting", state: "breathing", status: "Waiting…", while: "while it waits (idle, queued, or waiting on the user)" },
  { id: "design", label: "images or design", state: "shaping", status: "Designing…", while: "while it makes an image or a design" },
  { id: "other", label: "anything else", state: "working", status: "Working…", while: "for any other work" },
];

/** The prompt to paste into Claude Code, for the activities the visitor's app has (in USES order). */
export function buildPrompt(ids: string[]): string {
  const picked = USES.filter((u) => ids.includes(u.id));
  const lines = (picked.length ? picked : USES).map((u) => `- state="${u.state}" ${u.while}`);
  return [
    "Add thinking-orbs to my app (npm install thinking-orbs; MIT, by Jakub Antalik).",
    "Show <ThinkingOrb state=…> wherever the AI is working, and pick the state by what it is doing:",
    ...lines,
    "Use size={64} next to the assistant's avatar and size={20} inline with a one-line status text. Leave theme on \"auto\".",
    "Give each orb an aria-label that says what is happening, and remove it as soon as the result arrives.",
    "First list the places in my code where the AI works, then make the change, then show me the diff.",
  ].join("\n");
}

/** The JSX the playground's settings stand for. Defaults are left out, as you would write them. */
export function snippet({ state, size, speed }: { state: OrbStateName; size: 64 | 20; speed: number }): string {
  const parts = [`state="${state}"`, `size={${size}}`];
  if (speed !== 1) parts.push(`speed={${speed}}`);
  return `<ThinkingOrb ${parts.join(" ")} />`;
}

/** The playground's speed slider: the README's `speed` prop, a multiplier on the preset's own speed. */
export const SPEED = { min: 0.25, max: 3, step: 0.25, initial: 1 };

/** With reduced motion the figures stop on one frame: this many seconds into the clock. */
export const REST_SECONDS = 1.5;

/** The engine's time for a frame: wall seconds × the preset's baked speed × the speed prop. */
export function orbTime(seconds: number, presetSpeed: number, speed: number): number {
  return seconds * presetSpeed * speed;
}

/** LICENSE: the one condition of the MIT licence, verbatim. */
export const MIT_CONDITION =
  "The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.";
export const COPYRIGHT = "Copyright (c) 2026 Jakub Antalik";
