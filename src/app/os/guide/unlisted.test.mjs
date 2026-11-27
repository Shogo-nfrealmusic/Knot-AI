// The guide is for buyers only: both pages are noindex, and nothing in the sitemap, header or footer points to them.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");

test("both guide pages ask search engines not to index or follow them", () => {
  for (const page of ["./page.tsx", "./start-here/page.tsx"]) {
    assert.match(read(page), /robots:\s*\{\s*index:\s*false,\s*follow:\s*false\s*\}/, page);
  }
});

test("no all-caps eyebrow labels: the headings carry the structure (owner, 2026-11-27)", () => {
  for (const file of ["./style.ts", "./GuideIndex.tsx", "./start-here/StartHere.tsx", "./start-here/Figures.tsx"]) {
    assert.doesNotMatch(read(file), /gd-eyebrow|uppercase/, file);
  }
});

test("the sitemap, header and footer never mention the guide", () => {
  for (const file of ["../../sitemap.ts", "../../components/Header.tsx", "../../components/Footer.tsx"]) {
    assert.doesNotMatch(read(file), /\/os\/guide/, file);
  }
});
