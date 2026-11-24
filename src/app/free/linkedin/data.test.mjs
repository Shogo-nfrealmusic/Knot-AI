// Run: npm test  (node --test; Node strips the types from the .ts files, so no test runner is installed)
// These pin the page's facts to the source repo (README.md, skills/li-human/detect.py and slop.json,
// skills/li-post/hooks.json, skills/li-profile/rubric.json and templates/voice.md of
// github.com/Jakeschincariol/linkedin-agent-skill, MIT) and to the wiring in src/lib/free.ts.
// The expected panels below were produced by running the repo's own detect.py (python3) on the same texts.
import assert from "node:assert/strict";
import { test } from "node:test";
import {
  CHECKS,
  FIGURES,
  FINE_PRINT,
  INSTALL,
  LINKEDIN_KINDS,
  REPO,
  RUBRIC_LABELS,
  SAMPLES,
  SKILLS,
  TAGLINE,
  VOICE,
  VOICE_SECTIONS,
  fixFirst,
  profileTotal,
} from "./data.ts";
import { CHECK_NAMES, bar, detect, pyFixed } from "./detect.ts";
import { HOOKS_FILE, RUBRIC_FILE, SLOP } from "./source.ts";
import { getDrop, getDropByNumber, getDrops } from "../../../lib/free.ts";

const panel = (text) => detect(text, SLOP);

test("every link goes to the author's repo", () => {
  assert.equal(REPO, "https://github.com/Jakeschincariol/linkedin-agent-skill");
});

test("the eleven skills are the README's table, in its order, with its words", () => {
  assert.equal(SKILLS.length, 11);
  assert.deepEqual(
    SKILLS.map((s) => s.command),
    ["/li-post", "/li-comment", "/li-reply", "/li-profile", "/li-plan", "/li-human", "/li-carousel", "/li-repurpose", "/li-dm", "/li-inbox", "/li-audit"],
  );
  assert.equal(SKILLS[0].does, "One idea into a post. Three hook options from 21 formulas, one full draft, humanized before you see it.");
  assert.equal(SKILLS[1].does, "Comments on other people's posts. Nine types, picked by what the post actually is. Never \"Great post!\".");
  assert.equal(SKILLS[4].does, "The week. What to post, when to post it, and the 10 people to engage with. Writes ~/.claude/linkedin/plan.md.");
  assert.equal(SKILLS[8].does, "The 200-character invite note, the first message, and the two follow-ups. Two.");
  assert.equal(SKILLS[10].does, "Post-mortem on what you have already published. Ranks by engagement rate and reach multiple, not impressions.");
});

test("the three install routes are the README's lines, verbatim, in its order", () => {
  assert.deepEqual(
    INSTALL.map((r) => r.id),
    ["paste", "clone", "plugin"],
  );
  assert.equal(INSTALL[0].text, "https://github.com/Jakeschincariol/linkedin-agent-skill\n\nInstall this skill, then confirm /li-post works.");
  assert.equal(INSTALL[1].text, "git clone https://github.com/Jakeschincariol/linkedin-agent-skill.git\ncp -r linkedin-agent-skill/skills/li-* ~/.claude/skills/");
  assert.equal(INSTALL[2].text, "/plugin marketplace add Jakeschincariol/linkedin-agent-skill\n/plugin install linkedin-agent");
  assert.deepEqual(
    INSTALL.map((r) => r.where),
    ["Paste this into Claude:", "Or do it yourself, in Claude Code:", "Or as a plugin:"],
  );
});

test("the voice.md step is the README's paragraph, and the template's five sections", () => {
  assert.equal(
    VOICE.step,
    "Then spend ten minutes on templates/voice.md. Copy it to ~/.claude/linkedin/voice.md and fill it in, or paste three of your own posts into Claude and say \"write my voice.md from these\". Every skill reads that file. Skip it and everything comes out sounding like everyone else.",
  );
  assert.equal(VOICE.path, "~/.claude/linkedin/voice.md");
  assert.equal(VOICE.prompt, "write my voice.md from these");
  assert.deepEqual(
    VOICE_SECTIONS.map((s) => s.title),
    ["Who I am", "What I sound like", "My positions", "Off limits", "Proof I can use"],
  );
  assert.deepEqual(VOICE_SECTIONS[0].fields, ["Name", "What I do, in one sentence", "Who I am writing for", "What I sell"]);
});

test("hooks.json has the 21 formulas, numbered 1 to 21, and its five rules", () => {
  assert.equal(HOOKS_FILE.hooks.length, 21);
  assert.deepEqual(
    HOOKS_FILE.hooks.map((h) => h.id),
    Array.from({ length: 21 }, (_, i) => i + 1),
  );
  assert.equal(HOOKS_FILE.hooks[0].name, "Contrarian Take");
  assert.equal(HOOKS_FILE.hooks[20].name, "The Direct Value");
  assert.equal(HOOKS_FILE.hooks[1].example, "I sent 400 cold DMs in 30 days. 11 replied. 2 became clients.");
  for (const h of HOOKS_FILE.hooks) for (const k of ["template", "example", "best_for", "trap"]) assert.ok(h[k].length > 0, `${h.id} ${k}`);
  assert.equal(HOOKS_FILE.rules.length, 5);
});

test("slop.json is the README's lexicon: 113 terms, 17 invisible classes, 11 structural tells", () => {
  assert.equal(SLOP.words.length + SLOP.phrases.length, 113);
  assert.equal(SLOP.invisible.length, 17);
  assert.equal(SLOP.structures.length, 11);
  assert.ok(SLOP.words.some((w) => w.find === "delve" && w.replace === "look"));
  assert.ok(SLOP.phrases.some((p) => p.find === "let that sink in"));
});

test("rubric.json is twelve items that add up to 100, and every item has a label", () => {
  assert.equal(RUBRIC_FILE.items.length, 12);
  assert.equal(RUBRIC_FILE.total, 100);
  assert.equal(
    RUBRIC_FILE.items.reduce((sum, item) => sum + item.points, 0),
    100,
  );
  assert.deepEqual(
    RUBRIC_FILE.items.map((i) => [i.id, i.points]),
    [
      ["headline", 12],
      ["about_open", 10],
      ["about_body", 10],
      ["featured", 8],
      ["banner", 6],
      ["photo", 6],
      ["current_role", 10],
      ["experience_depth", 8],
      ["skills", 6],
      ["recommendations", 8],
      ["activity", 10],
      ["contact", 6],
    ],
  );
  for (const item of RUBRIC_FILE.items) assert.ok(RUBRIC_LABELS[item.id], item.id);
});

test("the profile total adds the ticked items, and what to fix first is the biggest points lost", () => {
  assert.equal(profileTotal(RUBRIC_FILE.items, {}), 0);
  assert.equal(profileTotal(RUBRIC_FILE.items, Object.fromEntries(RUBRIC_FILE.items.map((i) => [i.id, true]))), 100);
  assert.equal(profileTotal(RUBRIC_FILE.items, { headline: true, photo: true, contact: true }), 24);
  // nothing ticked: 12 first, then the three 10s in rubric order
  assert.deepEqual(
    fixFirst(RUBRIC_FILE.items, {}).slice(0, 4).map((i) => i.id),
    ["headline", "about_open", "about_body", "current_role"],
  );
  assert.deepEqual(fixFirst(RUBRIC_FILE.items, Object.fromEntries(RUBRIC_FILE.items.map((i) => [i.id, true]))), []);
});

test("the five checks are the README's table, in detect.py's order", () => {
  assert.deepEqual(CHECK_NAMES, ["BURSTINESS", "SPECIFICITY", "SLOP DENSITY", "FINGERPRINT", "VOICE"]);
  assert.deepEqual(
    CHECKS.map((c) => c.name),
    CHECK_NAMES,
  );
  assert.equal(CHECKS[0].measures, "sentence-length variation. Models write even.");
});

test("the browser port scores draft.txt 15.0 FLAGGED, as detect.py does", () => {
  const p = panel(SAMPLES.draft.text);
  assert.equal(pyFixed(p.overall, 1), "15.0");
  assert.equal(p.verdict, "FLAGGED");
  assert.deepEqual(
    p.checks.map((c) => [c.name, pyFixed(c.score, 1)]),
    [
      ["BURSTINESS", "61.3"],
      ["SPECIFICITY", "0.0"],
      ["SLOP DENSITY", "0.0"],
      ["FINGERPRINT", "0.0"],
      ["VOICE", "63.5"],
    ],
  );
  assert.deepEqual(
    p.checks.map((c) => c.detail),
    [
      "variation 0.51 across 5 sentences (want 0.55+)",
      "0 concrete markers, 0.0 per 100 words (want 4+)",
      "7 stock terms, 10.8 per 100 words (delve, delve into, game-changer, let that sink in, ...)",
      "0 invisible, 2 em dash, 4 curly quote, 0 ellipsis, 0 hard space",
      "0.0 contractions, 7.7 personal pronouns per 100 words, 0 structural tell(s)",
    ],
  );
  assert.equal(p.weakest, "SPECIFICITY");
});

test("draft.txt is the reel's draft, and the cleaned sample is humanize.py's output for it (38.8 FLAGGED)", () => {
  assert.ok(SAMPLES.draft.text.startsWith("In today’s fast-paced world, we lost our biggest client — and it was a true game-changer."));
  assert.ok(SAMPLES.after.text.startsWith("Right now, we lost our biggest client, and it was a true big deal."));
  const p = panel(SAMPLES.after.text);
  assert.equal(pyFixed(p.overall, 1), "38.8");
  assert.equal(p.verdict, "FLAGGED");
  assert.deepEqual(
    p.checks.map((c) => pyFixed(c.score, 1)),
    ["36.9", "0.0", "100.0", "100.0", "86.8"],
  );
});

// detect.py's own output for four more texts: empty, a plain human post, every tell at once, and non-ASCII words
const PY = {
  empty: {
    text: "",
    checks: [
      [50.0, "too short to judge"],
      [50.0, "too short to judge"],
      [50.0, "empty"],
      [100.0, "0 invisible, 0 em dash, 0 curly quote, 0 ellipsis, 0 hard space"],
      [50.0, "too short to judge"],
    ],
    human: 56.0,
    verdict: "REVIEW",
  },
  human: {
    text: "I sent 400 cold DMs in 30 days. 11 replied.\n\nTwo became clients, and one of them was Acme in Toronto. I didn't expect that.\n\nHere's the part nobody tells you: most of the replies came on day 3 of a follow-up, not day 1. So I'd stop counting the first message as the pitch. It's the door, that's all. Next month I'm testing 200 with a voice note instead, and I'll post the numbers in March.",
    checks: [
      [61.0299, "variation 0.51 across 7 sentences (want 0.55+)"],
      [100.0, "9 concrete markers, 12.5 per 100 words (want 4+)"],
      [100.0, "0 stock terms, 0.0 per 100 words"],
      [100.0, "0 invisible, 0 em dash, 0 curly quote, 0 ellipsis, 0 hard space"],
      [100.0, "9.7 contractions, 8.3 personal pronouns per 100 words, 0 structural tell(s)"],
    ],
    human: 79.7356,
    verdict: "PASS",
  },
  tells: {
    text: "​In today’s digital age, it’s not just a tool, it’s a movement.\n\nWe leverage synergy, foster innovation, and elevate outcomes.\n\n- We build robust systems\n- We craft seamless journeys\n- We drive holistic growth\n\nNot only does it help teams but also it scales…\n\nThe result?\n\nFurthermore, the landscape is shifting — moreover, the paradigm is changing fast. 🚀\n\nAs an AI, I think this matters﻿.󠁁\n\n#ai #growth #leadership #future #innovation #tech\n\nThoughts?",
    checks: [
      [27.5525, "variation 0.35 across 9 sentences (want 0.55+)"],
      [0.0, "0 concrete markers, 0.0 per 100 words (want 4+)"],
      [0.0, "11 stock terms, 15.3 per 100 words (elevate, foster, furthermore, holistic, ...)"],
      [0.0, "3 invisible, 1 em dash, 3 curly quote, 1 ellipsis, 1 hard space"],
      [17.7222, "0.0 contractions, 6.9 personal pronouns per 100 words, 6 structural tell(s) [not-only, the-result, rocket, hashtag-wall]"],
    ],
    human: 5.433,
    verdict: "FLAGGED",
  },
  unicode: {
    text: "Café owners in Zürich told me the naïve plan failed. We tried ٣٤ options at Montréal and Spårvagn, it didn't work. My co‑founder Léa said we'd ship by June, and we did. The École team leveraged it; Straße stores followed. You'll see why, I'm sure. Delveé is not a word, but delve is.",
    checks: [
      [4.0432, "variation 0.24 across 6 sentences (want 0.55+)"],
      [52.5424, "2 concrete markers, 3.4 per 100 words (want 4+)"],
      [57.6271, "1 stock terms, 1.7 per 100 words (delve)"],
      [100.0, "0 invisible, 0 em dash, 0 curly quote, 0 ellipsis, 0 hard space"],
      [100.0, "6.8 contractions, 11.9 personal pronouns per 100 words, 0 structural tell(s)"],
    ],
    human: 39.3228,
    verdict: "FLAGGED",
  },
};

for (const [name, want] of Object.entries(PY)) {
  test(`the browser port matches detect.py on the "${name}" text`, () => {
    const p = panel(want.text);
    p.checks.forEach((c, i) => {
      assert.ok(Math.abs(c.score - want.checks[i][0]) < 1e-3, `${c.name}: ${c.score} vs ${want.checks[i][0]}`);
      assert.equal(c.detail, want.checks[i][1], c.name);
    });
    assert.ok(Math.abs(p.overall - want.human) < 1e-3, `${p.overall} vs ${want.human}`);
    assert.equal(p.verdict, want.verdict);
  });
}

test("lexicon hits count word boundaries the way Python's \\b does (detect.py's output for each line)", () => {
  const cases = [
    ["What are your thoughts?x and what are your thoughts? fine", "1 stock terms, 9.1 per 100 words (what are your thoughts?)"],
    ["delvedelve delveé _delve delve_ DELVE Delve-in", "2 stock terms, 28.6 per 100 words (delve)"],
    ["In  today's digital\nage we LEVERAGE leverage. Ultimatelyſ", "3 stock terms, 37.5 per 100 words (in today's digital age, leverage)"],
    ["𝐀delve delve𝐀 ſynergy SYNERGY", "2 stock terms, 50.0 per 100 words (synergy)"],
  ];
  for (const [text, detail] of cases) assert.equal(panel(text).checks[2].detail, detail, text);
});

test("the bars are detect.py's: 24 cells, rounded", () => {
  assert.equal(bar(15), "####....................");
  assert.equal(bar(100), "########################");
  assert.equal(bar(0), "........................");
});

test("numbers print the way Python prints them (ties to even)", () => {
  assert.equal(pyFixed(0.125, 2), "0.12");
  assert.equal(pyFixed(0.375, 2), "0.38");
  assert.equal(pyFixed(14.971439649284719, 1), "15.0");
  assert.equal(pyFixed(2.5, 0), "2");
});

test("the fine print is the README's four paragraphs and its line on posting, verbatim", () => {
  assert.equal(TAGLINE, "Nothing gets posted until you say yes. These skills write. You post.");
  assert.deepEqual(
    FINE_PRINT.map((f) => f.title),
    [
      "These skills do not post to LinkedIn, and they should not.",
      "The five checks are local heuristics, not detector APIs.",
      "The invisible-character pass is real and it is narrow.",
      "Nothing here fabricates.",
    ],
  );
  assert.equal(
    FINE_PRINT[0].body,
    "There is no official API for posting to a personal profile without an approved partner app, and automating the site with a browser or a third-party tool violates LinkedIn's User Agreement and gets accounts restricted. So every skill here ends the same way: a copy-ready block, and you paste it. That is not a limitation bolted on afterwards, it is the design. It is also why the approval gate is real rather than a setting.",
  );
  assert.equal(
    FINE_PRINT[3].body,
    "No invented metrics, clients or outcomes go under your name. If a draft needs a number you have not given, it comes back with {{your number}} in it and a flag, every time.",
  );
});

test("/free/77 opens the LinkedIn agent page with the reel's keyword", () => {
  const drop = getDropByNumber("77");
  assert.equal(drop?.slug, "77-linkedin-agent");
  assert.equal(drop?.keyword, "NETWORK");
  assert.ok(getDrops().some((d) => d.number === 77));
  assert.equal(getDrops()[0].number, 77);
  assert.deepEqual(getDrop("77-linkedin-agent")?.tools.map((t) => t.href), [REPO]);
});

test("one figure per chapter, in order", () => {
  const chapters = getDrop("77-linkedin-agent")?.about?.chapters ?? [];
  assert.deepEqual(chapters.map((c) => c.linkedin), [...LINKEDIN_KINDS]);
  assert.deepEqual([...LINKEDIN_KINDS], ["eleven", "install", "humanizer", "profile", "fineprint"]);
  assert.deepEqual(Object.keys(FIGURES), [...LINKEDIN_KINDS]);
});

test("the fine print chapter carries the README's line: nothing is posted until you say yes", () => {
  const chapter = getDrop("77-linkedin-agent")?.about?.chapters?.find((c) => c.linkedin === "fineprint");
  assert.ok(chapter?.text?.some((t) => typeof t === "string" && t.includes(TAGLINE)));
});

test("the page's own words use no time words, and name no private path or company", () => {
  const own = JSON.stringify([getDrop("77-linkedin-agent"), FIGURES, CHECKS.map((c) => c.label), INSTALL.map((r) => r.label), Object.values(RUBRIC_LABELS)]);
  assert.equal(/\b(now|just|new|newly|today|this week|latest)\b/i.test(own), false, own.match(/\b(now|just|new|newly|today|this week|latest)\b/i)?.[0]);
  assert.equal(/undetectable|guaranteed|bypass/i.test(JSON.stringify(getDrop("77-linkedin-agent"))), false);
  assert.equal(/\/Users\/|Obsidian|\btps\b|tetty/i.test(own), false);
});
