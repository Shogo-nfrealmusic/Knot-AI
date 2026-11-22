// /free/74 (CleanYourTV): the page's facts, with no React in them so they can be tested (data.test.mjs).
// Everything here is from README.md, PROMPT.md and tools/restore.sh of https://github.com/Gathin23/cleanyourtv (MIT),
// read 2026-11-22 at commit f63a1eb. `pick`, `verdict` and `label` are this page's own short labels; `says`, `what` and
// `how` are the repo's words (Markdown marks removed).

/** One figure per chapter of the page, in order. */
export const TV_KINDS = ["check", "switch", "steps", "home", "restore"] as const;
export type TvDemoKind = (typeof TV_KINDS)[number];

export const REPO = "https://github.com/Gathin23/cleanyourtv";
export const PROMPT_URL = `${REPO}/blob/main/PROMPT.md`;
/** the README's own page for TVs that are not Android TV / Google TV */
export const NOT_ANDROID = "https://cleanyour.tv/not-android";
/** the README's "Find your TV" search */
export const FIND_TV = "https://cleanyour.tv/tvs";
/** the post the repo started from (README, The story) */
export const ORIGINAL_POST = "https://x.com/gathint/status/2111379569030939102";

/** README, The story: "The lists now cover 504 TV models from 138 brands." */
export const COVERAGE = { models: 504, brands: 138 };

/** README, Supported TVs: the six brands with the most tested lists, in its order. */
export const TOP_BRANDS: { name: string; lists: number }[] = [
  { name: "TCL", lists: 89 },
  { name: "Sony", lists: 53 },
  { name: "Xiaomi", lists: 46 },
  { name: "Philips", lists: 25 },
  { name: "Skyworth", lists: 18 },
  { name: "Hisense", lists: 17 },
];

export type Platform = {
  id: "android" | "fire" | "tcl-china" | "other";
  /** what the visitor picks (this page's label) */
  pick: string;
  /** this page's one-word answer */
  verdict: "Works" | "Debloat only" | "No launcher" | "Not supported";
  /** the two halves of the job: switching the bloat off, and the new home screen */
  debloat: boolean;
  launcher: boolean;
  /** the README's "What works" cell */
  says: string;
  /** where the README sends this TV instead */
  instead?: string;
  /** PROMPT.md's own line, where it is stricter than the README's table */
  promptSays?: string;
};

/** README, Supported TVs: the four rows of the platform table. */
export const PLATFORMS: Platform[] = [
  { id: "android", pick: "Android TV or Google TV", verdict: "Works", debloat: true, launcher: true, says: "The debloat and the launcher." },
  {
    id: "fire",
    pick: "Fire TV",
    verdict: "Debloat only",
    debloat: true,
    launcher: false,
    says: "The debloat half only, since Fire OS will not hand Home to a third-party launcher. And on the 2015 Fire TV Box (Fire OS 5) even that half fails: every pm route is refused.",
    promptSays: "It will not work on Samsung Tizen, LG webOS or Fire TV.",
  },
  {
    id: "tcl-china",
    pick: "A China-market TCL set",
    verdict: "No launcher",
    debloat: true,
    launcher: false,
    says: "They refuse to install any launcher at all; their lists say so in the header.",
  },
  {
    id: "other",
    pick: "Samsung, LG, Roku, Vizio or Hisense VIDAA",
    verdict: "Not supported",
    debloat: false,
    launcher: false,
    says: "Not supported (no ADB).",
    instead: NOT_ANDROID,
  },
];

export function platformFor(id: string): Platform | undefined {
  return PLATFORMS.find((p) => p.id === id);
}

/** README, Quick start, step 1: the path on the TV. */
export const SWITCH = {
  path: ["Settings", "Device Preferences", "About"],
  row: "Build",
  presses: 7,
  menu: "Developer options",
  toggle: "USB debugging",
  /** "If you see a Network or ADB debugging toggle, turn that on too." */
  alsoToggle: "Network / ADB debugging",
  keep: "Keep the TV on.",
};

/** README, Quick start: what the computer needs before the three steps. */
export const NEEDS = ["the same Wi-Fi as the TV", "a shell", "Python 3", "a JDK from 17 through 22", "Android SDK platform 34 with build-tools 34"];

/** README, Quick start: the coding assistants it names. */
export const ASSISTANTS = ["Claude Code", "Codex", "Gemini CLI", "Antigravity CLI", "DeepSeek Harness"];

export const CLONE = `git clone ${REPO}`;

/** README, Quick start: the three rows, word for word. */
export const QUICK_START: { where: string; what: string }[] = [
  {
    where: "On the TV",
    what: "Settings → Device Preferences → About → press OK on Build seven times → back → Developer options → USB debugging on. If you see a Network or ADB debugging toggle, turn that on too. Keep the TV on.",
  },
  {
    where: "On your computer",
    what: `Clone the repo and open that folder in your assistant (${CLONE}), then paste PROMPT.md and fill in your TV model.`,
  },
  {
    where: "Follow along",
    what: 'Accept "Allow USB debugging?" on the TV, then answer the checklist: which apps you use, the dock size and app order, whether to keep the voice assistant, Chromecast and updates.',
  },
];

/** README, Quick start, step 3: what the checklist asks. */
export const ASKS = ["which apps you use", "the dock size and app order", "whether to keep the voice assistant, Chromecast and updates"];

export const MODEL_SLOT = "<MODEL NAME HERE>";

/** PROMPT.md: the first paragraph of the prompt itself (its line breaks joined). */
export const PROMPT_OPENING = `I want to debloat my Android TV and replace its launcher with a clean Apple TV style home screen. My TV model is: ${MODEL_SLOT}. Work on the real device, step by step, and verify everything you do with screenshots pulled from the TV. Ask me before anything that depends on my preferences.`;

/** README, How it works: the three things that happen, in order. */
export const HOW_IT_WORKS: { step: string; what: string }[] = [
  { step: "Back up", what: "The list of installed packages and settings." },
  {
    step: "Disable",
    what: "The manufacturer's telemetry, ad services, content rows and preloaded junk, with pm disable-user. Nothing is uninstalled, so a restore script can undo every step.",
  },
  { step: "Install", what: "A small native launcher, made the default home screen." },
];

/** README, Restoring your TV: the example address in its two lines. */
export const RESTORE_HOST = "192.168.1.50";
/** README, Restoring your TV: the stock launcher the Google TV line names. */
export const GOOGLE_TV_STOCK = "com.google.android.apps.tv.launcherx";
const RESTORE_LIST = "examples/<your tv>/debloat.txt";

/** A typed address is used only when it is a plain IPv4 address, so nothing typed can add a command to the line. */
export function hostOrDefault(input: string): string {
  const host = input.trim();
  const parts = host.split(".");
  const ok = parts.length === 4 && parts.every((p) => /^\d{1,3}$/.test(p) && Number(p) <= 255);
  return ok ? host : RESTORE_HOST;
}

/** README, Restoring your TV: the one line, for Android TV or for Google TV, with the TV's address in it. */
export function restoreLine(tv: "android" | "google", host: string = RESTORE_HOST): string {
  const line = `TV_HOST=${hostOrDefault(host)} tools/restore.sh ${RESTORE_LIST}`;
  return tv === "google" ? `${line} ${GOOGLE_TV_STOCK}` : line;
}

/** README, Restoring your TV: the table under the two lines. */
export const RESTORE_FACTS: { what: string; how: string }[] = [
  { what: "A record comes first", how: "Before tools/disable.sh changes anything it writes down what the TV looked like, in ~/.cleanyourtv/." },
  { what: "Restore replays it", how: "A package you had disabled yourself stays disabled, and Home goes back to the component that owned it." },
  { what: "The launcher stays installed", how: "Remove it from the TV's Settings → Apps if you want it gone." },
  { what: "No computer?", how: "If the TV is unreachable, its own Settings → Apps page can re-enable packages too." },
];

export type Mark = {
  id: string;
  /** this page's label for the part */
  label: string;
  /** the README's words about it */
  says: string;
  /** where it sits on the photo, in percent of the photo: x, y, width, height */
  box: [number, number, number, number];
};

export type HomePhoto = { src: string; width: number; height: number; alt: string; marks: Mark[] };

/** The README's own "before" photo (docs/stock-home.jpg), with what the README says goes away. */
export const HOME_BEFORE: HomePhoto = {
  src: "/free/74/stock-home.jpg",
  width: 1448,
  height: 1086,
  alt: "A wall-mounted TV on the stock Google TV home screen: a large sponsored banner, a notice about the Discover tab, a row of apps and rows of recommendations.",
  marks: [
    { id: "sponsored", label: "The sponsored row", says: "no sponsored rows", box: [13.5, 27.5, 73.5, 16.5] },
    { id: "discover", label: "The “Discover” nag", says: 'no "Discover" nags', box: [13.8, 44.2, 72.8, 8.8] },
    { id: "rows", label: "The content rows", says: "The manufacturer's telemetry, ad services, content rows and preloaded junk", box: [13.8, 69, 65, 5.4] },
  ],
};

/** The README's own "after" photo (docs/new-home.jpg), with the parts its "What you get" table names. */
export const HOME_AFTER: HomePhoto = {
  src: "/free/74/new-home.jpg",
  width: 1672,
  height: 941,
  alt: "The same TV on the CleanYourTV home screen: a greeting, a thin clock and the date, three buttons for Inputs, Wi-Fi and Settings, the name Netflix in large type, and a dock of four apps.",
  marks: [
    { id: "clock", label: "A greeting, a thin clock and the date", says: "In Outfit, and a matching Clock screensaver.", box: [16.5, 18, 30, 13.5] },
    {
      id: "buttons",
      label: "Three frosted buttons",
      says: "Inputs (HDMI ports under the names you gave them in the TV's settings, AV, Live TV), Wi-Fi or Ethernet with the network name, Settings.",
      box: [56, 23.5, 28.5, 7.5],
    },
    { id: "shelf", label: "A top shelf", says: "Names the focused app in large type, with an ambient glow in a colour taken from its artwork.", box: [17, 47, 14.5, 10] },
    { id: "dock", label: "A pitch-black home", says: "A dock of your four favourite apps in a rounded band, where Apple TV puts it.", box: [16.8, 57.2, 66.6, 18.8] },
    { id: "grid", label: "The rest of your apps in a grid", says: "Slides up when you press Down.", box: [17.5, 78.2, 65.2, 5] },
  ],
};

/** README, Questions people ask and Legal: what to know before you run it. `quote` is the README's own sentence. */
export const FINE_PRINT: { id: string; title: string; quote: string; plain: string }[] = [
  {
    id: "safe",
    title: "Can it brick the TV?",
    quote: "Nothing is flashed, rooted or deleted; packages are disabled in the user profile.",
    plain: "The risk the README names is disabling something the TV leans on, which is why lists are applied in small batches with a restore script ready.",
  },
  {
    id: "risk",
    title: "Your warranty",
    quote: "You run it on a TV you own, at your own risk, and changing a TV's software may affect its warranty or support.",
    plain: "Everything in the repo is provided as is, without warranty of any kind, under the MIT licence.",
  },
  {
    id: "adb",
    title: "Switch debugging off when you are done",
    quote: "Network ADB is plaintext on port 5555, and on some firmware any device on the LAN gets a shell, so close it when you are done",
    plain: "When you finish, turn the debugging toggles off again on the TV and reboot it. The launcher keeps working without debugging.",
  },
  {
    id: "update",
    title: "After a firmware update",
    quote: "An update installs over the cleaned-up system: the listed packages come back, Home goes to the stock launcher, and new preloads appear that no list mentions.",
    plain: "After a firmware update, open ADB again and run the repo's tools/check.py against the list you applied. The README has the line.",
  },
];
