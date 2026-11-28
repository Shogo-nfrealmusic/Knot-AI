// The guide is for buyers only: every page is noindex, and nothing in the sitemap, header or footer points to them.
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { test } from "node:test";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const PAGES = ["start-here", "diagnostic", "second-brain", "memory", "verification", "autonomy", "security", "beyond-code", "your-os"];

test("every guide page asks search engines not to index or follow it", () => {
  for (const page of ["./page.tsx", ...PAGES.map((p) => `./${p}/page.tsx`)]) {
    assert.match(read(page), /robots:\s*\{\s*index:\s*false,\s*follow:\s*false\s*\}/, page);
  }
});

test("no all-caps eyebrow labels anywhere in the guide: the headings carry the structure (owner, 2026-11-27)", () => {
  const files = ["./style.ts", "./GuideIndex.tsx", "./ModulePage.tsx", "./kit.tsx", ...PAGES.flatMap((p) => readdirSync(new URL(`./${p}/`, import.meta.url)).filter((f) => f.endsWith(".tsx")).map((f) => `./${p}/${f}`))];
  for (const file of files) assert.doesNotMatch(read(file), /gd-eyebrow|uppercase/, file);
});

test("the sitemap, header and footer never mention the guide", () => {
  for (const file of ["../../sitemap.ts", "../../components/Header.tsx", "../../components/Footer.tsx"]) {
    assert.doesNotMatch(read(file), /\/os\/guide/, file);
  }
});
