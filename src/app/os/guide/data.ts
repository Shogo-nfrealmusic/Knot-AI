// Copilot OS guide: the facts the pages draw from.
// Start here follows module-s-start-here.md (release/guide) and the official docs, read on 2026-11-27:
// code.claude.com/docs/en/setup, /terminal-guide, /quickstart, /troubleshoot-install, /permissions.
// Commands, quotes and error messages are word for word from those pages; the tests pin them.
// The first-job prompt was changed at the owner's request (2026-11-27) from "list my repeat work" to a first-week plan.

// Linux readers follow the Mac commands (they are the same), so the page only ever switches between these two.
export type Os = "mac" | "windows";

export type GuideModule = { code: string; title: string; line: string; time: string; href: string | null };

export const MODULES: GuideModule[] = [
  { code: "S", title: "Start here", line: "Install Claude Code, set up its workspace, and get a first-week plan for your business.", time: "About 30 minutes", href: "/os/guide/start-here" },
  { code: "0", title: "Diagnostic", line: "Twenty questions that tell you which module to open next.", time: "About 10 minutes", href: null },
  { code: "1A", title: "Your second brain", line: "Obsidian holds what you know. Claude reads it, files new things, and answers from all of it.", time: "One evening, then a week to see it work", href: null },
  { code: "1", title: "Memory that compounds", line: "What goes into memory, and how it stays useful after six months.", time: "Two evenings, then minutes a week", href: null },
  { code: "2", title: "Verification design", line: "When Claude says it's done, how do you know?", time: "Two to three evenings", href: null },
  { code: "3", title: "Autonomy without drift", line: "Letting Claude work while you're not watching.", time: "Two evenings", href: null },
  { code: "4", title: "Security and supply chain", line: "What Claude Code can reach, and what the sandbox does and doesn't stop.", time: "Two evenings", href: null },
  { code: "5", title: "Beyond code: running a business with Claude Code", line: "Research, numbers, bookkeeping, content and decisions, from a real two-person company.", time: "", href: null },
  { code: "6", title: "Your operating system", line: "Putting it together, and keeping it working month after month.", time: "One evening, then 30 minutes a month", href: null },
];

export const CHECKED_ON = "2026-11-27";
export const QUICKSTART_URL = "https://code.claude.com/docs/en/quickstart";
export const SETUP_URL = "https://code.claude.com/docs/en/setup";
export const TERMINAL_GUIDE_URL = "https://code.claude.com/docs/en/terminal-guide";
export const TROUBLESHOOT_URL = "https://code.claude.com/docs/en/troubleshoot-install";
export const PRICING_URL = "https://claude.com/pricing";
/**
 * Read off claude.com/pricing in Chrome on 2026-11-27. The site served its Japanese page to this browser (prices in
 * USD); prices can differ by country, so the page always says where it was read and links to the source.
 */
export const PRO_PRICE = { monthly: "$22 a month", yearly: "$19 a month billed yearly ($220 up front)", readOn: "2026-11-27" };

export const PLAN_QUOTE = "The free claude.ai plan does not include Claude Code access.";
export const DESKTOP_QUOTE = "Prefer a graphical interface? The Desktop app lets you use Claude Code without the terminal.";

export const INSTALL = {
  unix: "curl -fsSL https://claude.ai/install.sh | bash",
  windows: "irm https://claude.ai/install.ps1 | iex",
};
/** What the terminal guide says you see when the installer finishes. */
export const INSTALL_SUCCESS = "Claude Code successfully installed!";
export const VERSION_CHECK = "claude --version";
export const DOCTOR = "claude doctor";

export const FOLDER = {
  unix: ["mkdir ~/my-business", "cd ~/my-business", "claude"],
  windows: ["mkdir $HOME\\my-business", "cd $HOME\\my-business", "claude"],
};

export const PLAN_FILE = "first-week-plan.md";
const BRACKET = "[your idea in a sentence, or \"I don't have one yet\"]";
export const PROMPT =
  `I want to build a business: ${BRACKET}. Before you write anything, interview me one question at a time ` +
  "about my interests, my skills, how much time and money I have, and what I want from this. " +
  `Then write a file called ${PLAN_FILE} with: a one-paragraph summary of the business, who it is for, ` +
  "and a first-week action list with one task per day, each under an hour.";

/** What the prompt asks the file to contain, in order. Shown as the outline of the result, never as sample output. */
export const PLAN_OUTLINE = ["The business, in one paragraph", "Who it is for", "Day 1 to Day 7: one task a day, each under an hour"];

/** The first-job prompt with the reader's idea in the bracket. Empty input keeps the bracket. */
export function fillPrompt(idea: string): string {
  const said = idea
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[.!\s]+$/, "");
  return said ? PROMPT.replace(BRACKET, said) : PROMPT;
}

/**
 * Which computer the reader is probably on. Only a clear Windows signal gives Windows; anything else, unsure or
 * Linux included, is Mac, and the switch at the top is always visible. The browser's own platform report
 * (navigator.userAgentData.platform) wins over the user-agent string when it exists.
 */
export function osFrom(userAgent: string, platform?: string): Os {
  if (platform) return /^windows$/i.test(platform) ? "windows" : "mac";
  return /Windows/i.test(userAgent) ? "windows" : "mac";
}

/** A stored choice from an earlier visit. Only "mac" and "windows" are kept; an old "linux" reads as Mac. */
export function readOs(stored: string | null): Os | null {
  if (stored === null) return null;
  return stored === "windows" ? "windows" : "mac";
}

/** Section 1, from the module and the setup page: the minimum for each computer, shown one at a time. */
export const REQUIREMENTS = {
  mac: "macOS 13 or later",
  windows: "Windows 10 (version 1809) or later",
  linux: "Ubuntu 20.04+, Debian 10+, or Alpine 3.19+",
  memory: "4 GB of memory or more",
};

/** Real output captured on my Mac on 2026-11-27. */
export const REAL_VERSION_LINE = "2.1.332 (Claude Code)";

export function commandsFor(os: Os) {
  const win = os === "windows";
  return {
    shell: win ? "PowerShell" : "Terminal",
    files: win ? "File Explorer" : "Finder",
    install: win ? INSTALL.windows : INSTALL.unix,
    folder: win ? FOLDER.windows : FOLDER.unix,
  };
}

/* ───────────── sections: the roadmap and the page use the same list ───────────── */

export type Lesson = { id: string; n: number; title: string };

export const LESSONS: Lesson[] = [
  { id: "need", n: 1, title: "Check what you need" },
  { id: "door", n: 2, title: "Choose how you'll use Claude Code" },
  { id: "install", n: 3, title: "Install Claude Code" },
  { id: "folder", n: 4, title: "Create a workspace folder and sign in" },
  { id: "job", n: 5, title: "Give Claude its first real job" },
  { id: "lab", n: 6, title: "Check your work" },
];

/** One tick per section that asks the reader to do something. */
export const CHECKPOINTS = [
  { id: "ready", lesson: "need", text: "I have the computer and the Claude Pro plan" },
  { id: "chosen", lesson: "door", text: "I'll use the terminal for this course" },
  { id: "installed", lesson: "install", text: "claude --version prints a number and (Claude Code)" },
  { id: "signed-in", lesson: "folder", text: "Claude Code is running in my-business and I'm logged in" },
  { id: "first-job", lesson: "job", text: `Claude asked me questions and wrote ${PLAN_FILE}` },
];

/** The lab checks the file yourself, not Claude's word for it. */
export const LAB = [
  { id: "lab-file", text: `${PLAN_FILE} is in your my-business folder when you look in Finder or File Explorer` },
  { id: "lab-days", text: "You opened it and it has a task for each of the seven days" },
  { id: "lab-tomorrow", text: "You've picked the task you'll do tomorrow" },
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

/** The ids that belong to a section, for the roadmap's ticks. */
export function idsFor(lesson: string): string[] {
  return lesson === "lab" ? LAB.map((l) => l.id) : CHECKPOINTS.filter((c) => c.lesson === lesson).map((c) => c.id);
}

/* ───────────── "My screen looks different": only problems the official docs name ───────────── */

export type Trouble = { see: string; fix: string; code?: string };

export const INSTALL_TROUBLE: { mac: Trouble[]; windows: Trouble[] } = {
    mac: [
      {
        see: "command not found: claude",
        fix: "The installer finished but your terminal can't find it yet. The installer prints the exact fix under \"Setup notes\". Or run these two lines, then open a new Terminal window and try again:",
        code: "echo 'export PATH=\"$HOME/.local/bin:$PATH\"' >> ~/.zshrc\nsource ~/.zshrc",
      },
      {
        see: "syntax error near unexpected token '<', or a page of HTML code",
        fix: "The install address returned a web page instead of the installer. If it says \"App unavailable in region\", Claude Code isn't available in your country. Otherwise run the install line again.",
      },
      {
        see: "dyld: cannot load, or built for Mac OS X 13.0",
        fix: "Your macOS is older than Claude Code supports. Open the Apple menu, choose About This Mac, and update through Software Update if it's older than 13.",
      },
    ],
    windows: [
      {
        see: "'irm' is not recognized",
        fix: "You're in CMD, not PowerShell. Close this window and open PowerShell instead (Win + X, then Windows PowerShell).",
      },
      {
        see: "'claude' is not recognized",
        fix: "The installer finished but PowerShell can't find it yet. Run these two lines, close PowerShell, open a new window, and try again:",
        code: "$currentPath = [Environment]::GetEnvironmentVariable('PATH', 'User')\n[Environment]::SetEnvironmentVariable('PATH', \"$currentPath;$env:USERPROFILE\\.local\\bin\", 'User')",
      },
      {
        see: "Could not create SSL/TLS secure channel",
        fix: "This usually happens on older Windows 10 PCs. Run these two lines instead:",
        code: "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12\nirm https://claude.ai/install.ps1 | iex",
      },
      {
        see: "Claude Code does not support 32-bit Windows",
        fix: "You opened Windows PowerShell (x86). Close it, open the Start menu entry without (x86) in its name, and run the install line again.",
      },
    ],
};

/** Login problems are the same on both computers. */
export const LOGIN_TROUBLE: Trouble[] = [
  { see: "The browser didn't open", fix: "Press c in the terminal to copy the login link, then paste it into your browser." },
  { see: "That doesn't look like the full code", fix: "Copy the whole login code from the browser, including the # in the middle, and paste it again." },
  { see: "API Error: 403 Request not allowed", fix: "Check that your Pro plan is active at claude.ai/settings, then log in again." },
];

/* ───────────── real screenshots still to take (Mac), each with the slot it fills ───────────── */

export type ShotSpec = { id: string; slot: string; what: { mac: string; windows: string }; framing: string; src: string | null };

export const SHOTS: ShotSpec[] = [
  {
    id: "claude-logo",
    slot: "Section 1 plan figure and Section 2 'both open the same Claude Code' line",
    what: { mac: "The official Claude logo mark, from Anthropic's press kit", windows: "The official Claude logo mark, from Anthropic's press kit" },
    framing: "SVG if available, otherwise PNG 512 x 512 on a transparent background. Note the source URL.",
    src: null,
  },
  {
    id: "desktop-app",
    slot: "Section 2, the Desktop app choice",
    what: { mac: "The Claude desktop app on a Mac, in English, on its home screen", windows: "The Claude desktop app on Windows, in English, on its home screen" },
    framing: "The app window only (Cmd+Shift+4, then Space, click the window), about 1280 x 800, light mode",
    src: null,
  },
  {
    id: "terminal-open",
    slot: "Section 3, step 1 (open the terminal)",
    what: { mac: "A new Terminal window, just opened, with the blinking cursor", windows: "A new PowerShell window, just opened, showing PS C:\\Users\\YourName>" },
    framing: "The Terminal window only, Basic profile (white), default size 80 x 24, light mode",
    src: null,
  },
  {
    id: "install-done",
    slot: "Section 3, step 3 (wait for it)",
    what: { mac: "Terminal after the install line finishes, showing Claude Code successfully installed!", windows: "PowerShell after the install line finishes, showing Claude Code successfully installed!" },
    framing: "Same Terminal window, the install line and the success message both visible. Needs a real run of the installer.",
    src: null,
  },
  {
    id: "new-folder",
    slot: "Section 4, step 1 (make the folder)",
    what: { mac: "Finder showing your home folder with a new folder being named my-business", windows: "File Explorer showing your user folder with a new folder being named my-business" },
    framing: "The Finder window only, icon view, about 900 x 560, the name field still being edited",
    src: null,
  },
  {
    id: "first-run",
    slot: "Section 4, step 3 (start Claude Code)",
    what: { mac: "Terminal right after typing claude in my-business: the question about trusting this folder", windows: "PowerShell right after typing claude in my-business: the question about trusting this folder" },
    framing: "The whole Terminal window, Basic profile, about 100 x 30 characters",
    src: null,
  },
  {
    id: "sign-in",
    slot: "Section 4, step 3 (log in)",
    what: { mac: "The browser page that opens to log in to Claude Code", windows: "The browser page that opens to log in to Claude Code" },
    framing: "The browser's page area only, no tabs or address bar, about 1280 x 800, your email blurred",
    src: null,
  },
  {
    id: "welcome",
    slot: "Section 4, 'you're ready' (Claude Code running)",
    what: { mac: "Claude Code's prompt after logging in, with the version, model and my-business shown above it", windows: "Claude Code's prompt after logging in, with the version, model and my-business shown above it" },
    framing: "The whole Terminal window, Basic profile, about 100 x 30 characters",
    src: null,
  },
  {
    id: "interview",
    slot: "Section 5, the interview",
    what: { mac: "Claude Code asking its first interview question after you paste the Section 5 prompt", windows: "Claude Code asking its first interview question after you paste the Section 5 prompt" },
    framing: "Same Terminal window; the pasted prompt and the first question both visible",
    src: null,
  },
  {
    id: "plan-output",
    slot: "Section 5, the payoff (your plan)",
    what: { mac: "first-week-plan.md from your own run, opened in TextEdit or a Markdown viewer", windows: "first-week-plan.md from a real run, opened in Notepad" },
    framing: "The document window only, about 900 x 1100, the whole plan visible. Real output, unedited.",
    src: null,
  },
  {
    id: "finder-result",
    slot: "Section 6, the lab (check the file yourself)",
    what: { mac: "Finder showing my-business with first-week-plan.md in it", windows: "File Explorer showing my-business with first-week-plan.md in it" },
    framing: "The Finder window only, list view, about 900 x 500, nothing else in the folder",
    src: null,
  },
];

/** A first-hand note from the owner. Left empty on purpose: the page shows a marked placeholder until he writes it. */
export const FOUNDER_NOTES: Record<string, string | null> = {
  door: null,
  install: null,
  job: null,
};
