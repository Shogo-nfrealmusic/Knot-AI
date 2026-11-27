// Run: npm test  (node --test; Node strips the types from data.ts)
// Facts are module-s-start-here.md's and the official docs' (setup, terminal-guide, troubleshoot-install; read
// 2026-11-27), word for word.
import assert from "node:assert/strict";
import { test } from "node:test";
import {
  CHECKED_ON,
  CHECKPOINTS,
  DESKTOP_QUOTE,
  DOCTOR,
  FOLDER,
  FOUNDER_NOTES,
  INSTALL,
  INSTALL_SUCCESS,
  INSTALL_TROUBLE,
  LAB,
  LESSONS,
  LOGIN_TROUBLE,
  MODULES,
  PLAN_FILE,
  PLAN_OUTLINE,
  PLAN_QUOTE,
  PRICING_URL,
  PRO_PRICE,
  PROMPT,
  QUICKSTART_URL,
  REAL_VERSION_LINE,
  REQUIREMENTS,
  SETUP_URL,
  SHOTS,
  VERSION_CHECK,
  commandsFor,
  fillPrompt,
  idsFor,
  osFrom,
  parseDone,
  readOs,
  toggleDone,
} from "./data.ts";

test("the index lists the nine modules in the guide's order; only Start here has a page", () => {
  assert.deepEqual(MODULES.map((m) => m.code), ["S", "0", "1A", "1", "2", "3", "4", "5", "6"]);
  assert.deepEqual(MODULES.filter((m) => m.href).map((m) => m.href), ["/os/guide/start-here"]);
});

test("the install lines are the docs' native installer, word for word", () => {
  assert.equal(INSTALL.unix, "curl -fsSL https://claude.ai/install.sh | bash");
  assert.equal(INSTALL.windows, "irm https://claude.ai/install.ps1 | iex");
  assert.equal(INSTALL_SUCCESS, "Claude Code successfully installed!");
  assert.equal(VERSION_CHECK, "claude --version");
  assert.equal(DOCTOR, "claude doctor");
});

test("the folder lines are the module's, for Mac and for Windows", () => {
  assert.deepEqual(FOLDER.unix, ["mkdir ~/my-business", "cd ~/my-business", "claude"]);
  assert.deepEqual(FOLDER.windows, ["mkdir $HOME\\my-business", "cd $HOME\\my-business", "claude"]);
});

test("the two quotes from the docs are verbatim", () => {
  assert.equal(PLAN_QUOTE, "The free claude.ai plan does not include Claude Code access.");
  assert.equal(DESKTOP_QUOTE, "Prefer a graphical interface? The Desktop app lets you use Claude Code without the terminal.");
});

test("the official pages and the check date", () => {
  assert.equal(QUICKSTART_URL, "https://code.claude.com/docs/en/quickstart");
  assert.equal(SETUP_URL, "https://code.claude.com/docs/en/setup");
  assert.equal(PRICING_URL, "https://claude.com/pricing");
  assert.equal(CHECKED_ON, "2026-11-27");
});

test("the Pro price is the one read off claude.com/pricing on 2026-11-27", () => {
  assert.deepEqual(PRO_PRICE, { monthly: "$22 a month", yearly: "$19 a month billed yearly ($220 up front)", readOn: "2026-11-27" });
});

test("the first job asks about the reader first, then writes a first-week plan file", () => {
  assert.equal(PLAN_FILE, "first-week-plan.md");
  assert.match(PROMPT, /interview me one question at a time/);
  assert.match(PROMPT, /interests/);
  assert.match(PROMPT, /first-week-plan\.md/);
  assert.match(PROMPT, /one task per day/);
  assert.equal(PLAN_OUTLINE.length, 3);
});

test("fillPrompt puts the reader's idea in the bracket, and keeps the bracket when nothing is typed", () => {
  assert.ok(fillPrompt("a meal-prep service for nurses").startsWith("I want to build a business: a meal-prep service for nurses. Before"));
  assert.equal(fillPrompt(""), PROMPT);
  assert.equal(fillPrompt("   \n "), PROMPT);
});

test("fillPrompt drops a trailing full stop and folds line breaks", () => {
  assert.ok(fillPrompt("a bakery.").startsWith("I want to build a business: a bakery. Before"));
  assert.ok(fillPrompt("a bakery\nin Leeds").startsWith("I want to build a business: a bakery in Leeds. Before"));
});

test("osFrom: only a clear Windows signal gives Windows; everything else, Linux included, is Mac", () => {
  assert.equal(osFrom("Mozilla/5.0 (Windows NT 10.0; Win64; x64)"), "windows");
  assert.equal(osFrom("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"), "mac");
  assert.equal(osFrom("Mozilla/5.0 (X11; Linux x86_64)"), "mac");
  assert.equal(osFrom(""), "mac");
  assert.equal(osFrom("Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)"), "mac");
  assert.equal(osFrom("Mozilla/5.0 (Linux; Android 14; Pixel 8)"), "mac");
});

test("osFrom prefers the browser's own platform report when there is one", () => {
  const linuxLooking = "Mozilla/5.0 (X11; Linux x86_64)";
  assert.equal(osFrom(linuxLooking, "macOS"), "mac");
  assert.equal(osFrom(linuxLooking, "Windows"), "windows");
  assert.equal(osFrom("Mozilla/5.0 (Windows NT 10.0)", "macOS"), "mac");
  assert.equal(osFrom("Mozilla/5.0 (Windows NT 10.0)", ""), "windows");
});

test("a stored choice of anything but mac or windows (an old 'linux') reads as Mac", () => {
  assert.equal(readOs("windows"), "windows");
  assert.equal(readOs("mac"), "mac");
  assert.equal(readOs("linux"), "mac");
  assert.equal(readOs(null), null);
});

test("commandsFor: Mac gets Terminal and Finder, Windows gets PowerShell and File Explorer", () => {
  assert.deepEqual(commandsFor("mac"), { shell: "Terminal", files: "Finder", install: INSTALL.unix, folder: FOLDER.unix });
  assert.deepEqual(commandsFor("windows"), { shell: "PowerShell", files: "File Explorer", install: INSTALL.windows, folder: FOLDER.windows });
});

test("section 1 shows one computer at a time, with the module's minimum versions; Linux is set apart", () => {
  assert.equal(REQUIREMENTS.mac, "macOS 13 or later");
  assert.equal(REQUIREMENTS.windows, "Windows 10 (version 1809) or later");
  assert.equal(REQUIREMENTS.linux, "Ubuntu 20.04+, Debian 10+, or Alpine 3.19+");
  assert.equal(REQUIREMENTS.memory, "4 GB of memory or more");
});

test("the version line shown is the real output captured on 2026-11-27", () => {
  assert.equal(REAL_VERSION_LINE, "2.1.332 (Claude Code)");
});

test("the roadmap and the page share six numbered sections, 1 to 6", () => {
  assert.deepEqual(LESSONS.map((l) => l.n), [1, 2, 3, 4, 5, 6]);
  assert.deepEqual(LESSONS.map((l) => l.title), [
    "Check what you need",
    "Choose how you'll use Claude Code",
    "Install Claude Code",
    "Create a workspace folder and sign in",
    "Give Claude its first real job",
    "Check your work",
  ]);
  assert.equal(new Set(LESSONS.map((l) => l.id)).size, LESSONS.length);
});

test("every section has at least one tick, and every tick belongs to a section", () => {
  for (const l of LESSONS) assert.ok(idsFor(l.id).length > 0, l.id);
  for (const c of CHECKPOINTS) assert.ok(LESSONS.some((l) => l.id === c.lesson), c.id);
});

test("the lab checks the file itself, in the file manager", () => {
  assert.equal(LAB.length, 3);
  assert.match(LAB[0].text, /first-week-plan\.md/);
  assert.match(LAB[0].text, /Finder or File Explorer/);
});

test("ticking and unticking; unknown ids change nothing; unreadable storage is nothing ticked", () => {
  assert.deepEqual(toggleDone([], "installed"), ["installed"]);
  assert.deepEqual(toggleDone(["installed"], "installed"), []);
  assert.deepEqual(toggleDone(["installed"], "nope"), ["installed"]);
  assert.deepEqual(parseDone(null), []);
  assert.deepEqual(parseDone("{"), []);
  assert.deepEqual(parseDone('["lab-file", 3, "nope", "lab-file"]'), ["lab-file"]);
});

test("troubleshooting quotes only the error messages the official docs name", () => {
  assert.deepEqual(INSTALL_TROUBLE.mac.map((t) => t.see), [
    "command not found: claude",
    "syntax error near unexpected token '<', or a page of HTML code",
    "dyld: cannot load, or built for Mac OS X 13.0",
  ]);
  assert.deepEqual(INSTALL_TROUBLE.windows.map((t) => t.see), [
    "'irm' is not recognized",
    "'claude' is not recognized",
    "Could not create SSL/TLS secure channel",
    "Claude Code does not support 32-bit Windows",
  ]);
  assert.deepEqual(LOGIN_TROUBLE.map((t) => t.see), [
    "The browser didn't open",
    "That doesn't look like the full code",
    "API Error: 403 Request not allowed",
  ]);
});

test("the PATH fix lines are the terminal guide's, word for word", () => {
  assert.equal(INSTALL_TROUBLE.mac[0].code, "echo 'export PATH=\"$HOME/.local/bin:$PATH\"' >> ~/.zshrc\nsource ~/.zshrc");
  assert.equal(
    INSTALL_TROUBLE.windows[1].code,
    "$currentPath = [Environment]::GetEnvironmentVariable('PATH', 'User')\n[Environment]::SetEnvironmentVariable('PATH', \"$currentPath;$env:USERPROFILE\\.local\\bin\", 'User')",
  );
});

test("every screenshot slot names the slot it fills, what to capture on each computer and how to frame it; none is filled yet", () => {
  assert.equal(new Set(SHOTS.map((s) => s.id)).size, SHOTS.length);
  for (const s of SHOTS) {
    assert.ok(s.slot.length > 5 && s.what.mac.length > 10 && s.what.windows.length > 10 && s.framing.length > 10, s.id);
    assert.equal(s.src, null, s.id);
  }
});

test("founder's notes are empty placeholders: nothing is written in the owner's voice", () => {
  for (const v of Object.values(FOUNDER_NOTES)) assert.equal(v, null);
});

test("the guide's facts carry no Japanese", () => {
  const text = JSON.stringify({ MODULES, LESSONS, LAB, CHECKPOINTS, PROMPT, SHOTS, INSTALL_TROUBLE, LOGIN_TROUBLE });
  assert.doesNotMatch(text, /[぀-ヿ一-鿿]/);
});
