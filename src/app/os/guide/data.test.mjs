// Run: npm test  (node --test; Node strips the types from data.ts)
// The facts here are module-s-start-here.md's (checked against the official docs on 2026-11-27), word for word.
import assert from "node:assert/strict";
import { test } from "node:test";
import {
  CHECKED_ON,
  DESKTOP_QUOTE,
  DOCTOR,
  FOLDER,
  INSTALL,
  LAB,
  LESSONS,
  MODULES,
  PLAN_QUOTE,
  PROMPT,
  QUICKSTART_URL,
  SETUP_URL,
  STATIONS,
  VERSION_CHECK,
  commandsFor,
  fillPrompt,
  neighbours,
  nextStep,
  osFrom,
  parseDone,
  stationAt,
  toggleDone,
} from "./data.ts";

test("the index lists the nine modules in the guide's order, numbered 0 to 8", () => {
  assert.deepEqual(
    MODULES.map((m) => m.code),
    ["0", "1", "2", "3", "4", "5", "6", "7", "8"],
  );
  assert.deepEqual(
    MODULES.map((m) => m.title),
    [
      "Start here",
      "Diagnostic",
      "Your second brain",
      "Memory that compounds",
      "Verification design",
      "Autonomy without drift",
      "Security and supply chain",
      "Beyond code: running a business with Claude Code",
      "Your operating system",
    ],
  );
});

test("every module has its own page under /os/guide", () => {
  assert.deepEqual(
    MODULES.map((m) => m.href),
    [
      "/os/guide/start-here",
      "/os/guide/diagnostic",
      "/os/guide/second-brain",
      "/os/guide/memory",
      "/os/guide/verification",
      "/os/guide/autonomy",
      "/os/guide/security",
      "/os/guide/beyond-code",
      "/os/guide/your-os",
    ],
  );
});

test("neighbours: each module knows the one before and after it", () => {
  assert.equal(neighbours("0").prev, null);
  assert.equal(neighbours("0").next?.code, "1");
  assert.equal(neighbours("4").prev?.code, "3");
  assert.equal(neighbours("4").next?.code, "5");
  assert.equal(neighbours("8").next, null);
  assert.deepEqual(neighbours("nope"), { prev: null, next: null });
});

test("the next step: Start here sends new readers to Module 2, past the optional diagnostic; other modules go in order", () => {
  assert.equal(nextStep("0")?.code, "2");
  assert.equal(nextStep("1")?.code, "2");
  assert.equal(nextStep("4")?.code, "5");
  assert.equal(nextStep("8"), null);
});

test("the diagnostic says it is optional in its one-line summary", () => {
  assert.match(MODULES.find((m) => m.code === "1").line, /^Optional\./);
});

test("the install lines are the docs' native installer, word for word", () => {
  assert.equal(INSTALL.unix, "curl -fsSL https://claude.ai/install.sh | bash");
  assert.equal(INSTALL.windows, "irm https://claude.ai/install.ps1 | iex");
  assert.equal(VERSION_CHECK, "claude --version");
  assert.equal(DOCTOR, "claude doctor");
});

test("the folder lines are the module's, for Mac/Linux and for Windows", () => {
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
  assert.equal(CHECKED_ON, "2026-11-27");
});

test("the first job prompt is the module's, with the bracket to fill", () => {
  assert.equal(
    PROMPT,
    "I run [what you do, in one sentence]. Interview me, one question at a time,\nabout the work I repeat every week. Then write a file called repeat-work.md\nthat lists each job, how long it takes me, and which ones you could do.",
  );
});

test("fillPrompt puts the reader's business in the bracket", () => {
  assert.ok(fillPrompt("a two-person wedding photo studio").startsWith("I run a two-person wedding photo studio. Interview me,"));
});

test("fillPrompt keeps the bracket when nothing is typed", () => {
  assert.equal(fillPrompt(""), PROMPT);
  assert.equal(fillPrompt("   \n "), PROMPT);
});

test("fillPrompt drops a trailing full stop and folds line breaks, so the sentence stays one sentence", () => {
  assert.ok(fillPrompt("a bakery.").startsWith("I run a bakery. Interview"));
  assert.ok(fillPrompt("a bakery\nin Leeds").startsWith("I run a bakery in Leeds. Interview"));
  assert.ok(fillPrompt("  I run a bakery  ").startsWith("I run a bakery. Interview"));
});

test("osFrom reads the platform from the browser's user agent, Mac by default", () => {
  assert.equal(osFrom("Mozilla/5.0 (Windows NT 10.0; Win64; x64)"), "windows");
  assert.equal(osFrom("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"), "mac");
  assert.equal(osFrom("Mozilla/5.0 (X11; Linux x86_64)"), "linux");
  assert.equal(osFrom("Mozilla/5.0 (X11; Ubuntu; Linux x86_64)"), "linux");
  assert.equal(osFrom(""), "mac");
  assert.equal(osFrom("Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)"), "mac");
  assert.equal(osFrom("Mozilla/5.0 (Linux; Android 14; Pixel 8)"), "mac");
});

test("commandsFor: Mac and Linux share the shell lines, Windows gets PowerShell", () => {
  assert.equal(commandsFor("mac").install, INSTALL.unix);
  assert.equal(commandsFor("linux").install, INSTALL.unix);
  assert.equal(commandsFor("windows").install, INSTALL.windows);
  assert.deepEqual(commandsFor("linux").folder, FOLDER.unix);
  assert.deepEqual(commandsFor("windows").folder, FOLDER.windows);
  assert.equal(commandsFor("windows").shell, "PowerShell");
  assert.equal(commandsFor("mac").shell, "Terminal");
});

test("six lessons and a lab, numbered 0.1 to 0.6, each with its own id", () => {
  assert.deepEqual(
    LESSONS.map((l) => l.code),
    ["0.1", "0.2", "0.3", "0.4", "0.5", "0.6", "Lab"],
  );
  assert.equal(new Set(LESSONS.map((l) => l.id)).size, LESSONS.length);
});

test("the lab's pass condition is the module's three parts", () => {
  assert.deepEqual(
    LAB.map((c) => c.text),
    [
      "repeat-work.md exists in your folder",
      "It has at least five jobs in it",
      "You have circled the one you will hand over first",
    ],
  );
});

test("ticking and unticking a checkpoint; unknown ids change nothing", () => {
  const one = toggleDone([], "installed");
  assert.deepEqual(one, ["installed"]);
  assert.deepEqual(toggleDone(one, "installed"), []);
  assert.deepEqual(toggleDone(one, "nope"), one);
});

test("anything unreadable in storage counts as nothing ticked", () => {
  assert.deepEqual(parseDone(null), []);
  assert.deepEqual(parseDone("{"), []);
  assert.deepEqual(parseDone('{"a":1}'), []);
  assert.deepEqual(parseDone('["lab-file", 3, "nope", "lab-file"]'), ["lab-file"]);
});

test("the path has four stations, install to first job", () => {
  assert.deepEqual(
    STATIONS.map((s) => s.label),
    ["Install", "Sign in", "Open a folder", "First job"],
  );
});

test("stationAt: scroll progress lights stations in order and never leaves the path", () => {
  assert.deepEqual(stationAt(0), { index: 0, fill: 0 });
  assert.equal(stationAt(0.3).index, 1);
  assert.equal(stationAt(0.6).index, 2);
  assert.deepEqual(stationAt(1), { index: 3, fill: 1 });
  assert.deepEqual(stationAt(-2), { index: 0, fill: 0 });
  assert.deepEqual(stationAt(5), { index: 3, fill: 1 });
  assert.deepEqual(stationAt(NaN), { index: 0, fill: 0 });
});

test("the guide's facts carry no Japanese", () => {
  const text = JSON.stringify({ MODULES, LESSONS, LAB, STATIONS, PROMPT });
  assert.doesNotMatch(text, /[぀-ヿ一-鿿]/);
});
