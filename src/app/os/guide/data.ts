// Copilot OS guide: the facts the pages draw from. Start here is module-0-start-here.md (release/guide), checked
// against the official docs on 2026-11-27. Commands and quotes are word for word; the tests pin them.
// Modules are numbered 0 to 8 (renumbered 2026-11-28 from S, 0, 1A, 1 to 6).

export type Os = "mac" | "windows" | "linux";

export type GuideModule = { code: string; title: string; line: string; time: string; href: string };

export const MODULES: GuideModule[] = [
  { code: "0", title: "Start here", line: "Install Claude Code, sign in, and get one real job done in a folder you own.", time: "30 minutes", href: "/os/guide/start-here" },
  { code: "1", title: "Diagnostic", line: "Optional. Twenty questions that tell you which module to open next.", time: "About 10 minutes", href: "/os/guide/diagnostic" },
  { code: "2", title: "Your second brain", line: "Obsidian holds what you know. Claude reads it, files new things, and answers from all of it.", time: "One evening, then a week to see it work", href: "/os/guide/second-brain" },
  { code: "3", title: "Memory that compounds", line: "What goes into memory, and how it stays useful after six months.", time: "Two evenings, then minutes a week", href: "/os/guide/memory" },
  { code: "4", title: "Verification design", line: "When Claude says it's done, how do you know?", time: "Two to three evenings", href: "/os/guide/verification" },
  { code: "5", title: "Autonomy without drift", line: "Letting Claude work while you're not watching.", time: "Two evenings", href: "/os/guide/autonomy" },
  { code: "6", title: "Security and supply chain", line: "What Claude Code can reach, and what the sandbox does and doesn't stop.", time: "Two evenings", href: "/os/guide/security" },
  { code: "7", title: "Beyond code: running a business with Claude Code", line: "Research, numbers, bookkeeping, content and decisions, from a real two-person company.", time: "", href: "/os/guide/beyond-code" },
  { code: "8", title: "Your operating system", line: "Putting it together, and keeping it working month after month.", time: "One evening, then 30 minutes a month", href: "/os/guide/your-os" },
];

/** The modules before and after one, for the page's prev/next links. An unknown code has neither. */
export function neighbours(code: string): { prev: GuideModule | null; next: GuideModule | null } {
  const i = MODULES.findIndex((m) => m.code === code);
  if (i < 0) return { prev: null, next: null };
  return { prev: MODULES[i - 1] ?? null, next: MODULES[i + 1] ?? null };
}

/** Where the "next" link of a module goes. Start here skips the diagnostic: it is optional, and new readers go
 * straight to Module 2 (owner, 2026-11-28). Everything else goes in order. */
export function nextStep(code: string): GuideModule | null {
  if (code === "0") return MODULES.find((m) => m.code === "2") ?? null;
  return neighbours(code).next;
}

export const CHECKED_ON = "2026-11-27";
export const QUICKSTART_URL = "https://code.claude.com/docs/en/quickstart";
export const SETUP_URL = "https://code.claude.com/docs/en/setup";

export const PLAN_QUOTE = "The free claude.ai plan does not include Claude Code access.";
export const DESKTOP_QUOTE = "Prefer a graphical interface? The Desktop app lets you use Claude Code without the terminal.";

export const INSTALL = {
  unix: "curl -fsSL https://claude.ai/install.sh | bash",
  windows: "irm https://claude.ai/install.ps1 | iex",
};
export const VERSION_CHECK = "claude --version";
export const DOCTOR = "claude doctor";

export const FOLDER = {
  unix: ["mkdir ~/my-business", "cd ~/my-business", "claude"],
  windows: ["mkdir $HOME\\my-business", "cd $HOME\\my-business", "claude"],
};

export const PROMPT =
  "I run [what you do, in one sentence]. Interview me, one question at a time,\nabout the work I repeat every week. Then write a file called repeat-work.md\nthat lists each job, how long it takes me, and which ones you could do.";
const BRACKET = "[what you do, in one sentence]";

/** The first-job prompt with the reader's business in the bracket. Empty input keeps the bracket. */
export function fillPrompt(business: string): string {
  const said = business
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^i run\s+/i, "")
    .replace(/[.!\s]+$/, "");
  return said ? PROMPT.replace(BRACKET, said) : PROMPT;
}

/** Which computer the reader is probably on. Phones get Mac: they will install on a computer later. */
export function osFrom(userAgent: string): Os {
  if (/Windows/i.test(userAgent)) return "windows";
  if (/Android/i.test(userAgent)) return "mac";
  if (/Linux|X11/i.test(userAgent)) return "linux";
  return "mac";
}

export function commandsFor(os: Os) {
  const win = os === "windows";
  return {
    shell: win ? "PowerShell" : "Terminal",
    install: win ? INSTALL.windows : INSTALL.unix,
    folder: win ? FOLDER.windows : FOLDER.unix,
  };
}

export type Lesson = { id: string; code: string; title: string };

export const LESSONS: Lesson[] = [
  { id: "need", code: "0.1", title: "What you need" },
  { id: "door", code: "0.2", title: "Pick your door" },
  { id: "install", code: "0.3", title: "Install it" },
  { id: "folder", code: "0.4", title: "Give it a folder" },
  { id: "job", code: "0.5", title: "The first real job" },
  { id: "know", code: "0.6", title: "Four things to know" },
  { id: "lab", code: "Lab", title: "Pass the lab" },
];

/** One tick per lesson that asks the reader to do something, plus the lab's three parts. */
export const CHECKPOINTS = [
  { id: "ready", lesson: "need", text: "I have a computer that fits and a paid Claude plan" },
  { id: "installed", lesson: "install", text: "claude --version prints a number and (Claude Code)" },
  { id: "signed-in", lesson: "folder", text: "Claude Code is running in my-business and I'm signed in" },
  { id: "first-job", lesson: "job", text: "Claude wrote repeat-work.md" },
];

export const LAB = [
  { id: "lab-file", text: "repeat-work.md exists in your folder" },
  { id: "lab-five", text: "It has at least five jobs in it" },
  { id: "lab-circled", text: "You have circled the one you will hand over first" },
];

const ALL_IDS = [...CHECKPOINTS.map((c) => c.id), ...LAB.map((c) => c.id)];
export const STORAGE_KEY = "os-guide.start-here";

/** The ticked ids from what storage holds. Anything unreadable, unknown or repeated is dropped. */
export function parseDone(raw: string | null | undefined): string[] {
  if (!raw) return [];
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(value)) return [];
  const ticked = new Set(value.filter((v): v is string => typeof v === "string"));
  return ALL_IDS.filter((id) => ticked.has(id));
}

/** Tick an id, or untick it when already ticked. An unknown id changes nothing. */
export function toggleDone(done: string[], id: string): string[] {
  if (!ALL_IDS.includes(id)) return done;
  return done.includes(id) ? done.filter((d) => d !== id) : [...done, id];
}

export const TOTAL_CHECKS = ALL_IDS.length;

export const STATIONS = [
  { label: "Install", text: "One line in the terminal puts Claude Code on your computer." },
  { label: "Sign in", text: "The first time it starts, a browser opens. You log in with your paid Claude account." },
  { label: "Open a folder", text: "You give it one folder to work in, not your whole computer." },
  { label: "First job", text: "You ask for something you'd pay a person to do. It writes a file you didn't." },
];

/** Where the path is for a scroll progress between 0 and 1: the lit station and how much of the line is drawn. */
export function stationAt(progress: number): { index: number; fill: number } {
  const fill = Number.isFinite(progress) ? Math.min(1, Math.max(0, progress)) : 0;
  return { index: Math.min(STATIONS.length - 1, Math.floor(fill * STATIONS.length)), fill };
}
