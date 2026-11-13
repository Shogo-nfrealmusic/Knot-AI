// Run: npm test  (node --test; Node strips the types from qualify.ts, so no test runner is installed)
import assert from "node:assert/strict";
import { test } from "node:test";
import { EMPTY, THRESHOLDS, countWords, routesMet, toCount } from "./qualify.ts";

const met = (patch) => routesMet({ ...EMPTY, ...patch });

test("nothing entered meets no route", () => {
  assert.deepEqual(routesMet(EMPTY), []);
});

test("the published thresholds are the ones on claude.com (read 2026-11-14)", () => {
  assert.deepEqual(THRESHOLDS, {
    dependentRepos: 500,
    dependentPackages: 100,
    monthlyDownloads: 200_000,
    mergedPrs: 100,
    externalContributors: 20,
    openssfScore: 0.4,
  });
});

test("maintainers: 500 dependent repos is enough, 499 is not", () => {
  assert.deepEqual(met({ dependentRepos: 499 }), []);
  assert.deepEqual(met({ dependentRepos: 500 }), ["maintainers"]);
});

test("maintainers: 100 dependent packages is enough, 99 is not", () => {
  assert.deepEqual(met({ dependentPackages: 99 }), []);
  assert.deepEqual(met({ dependentPackages: 100 }), ["maintainers"]);
});

test("maintainers: 200,000 monthly downloads is enough, 199,999 is not", () => {
  assert.deepEqual(met({ monthlyDownloads: 199_999 }), []);
  assert.deepEqual(met({ monthlyDownloads: 200_000 }), ["maintainers"]);
});

test("maintainers: any one of the three numbers is enough, and the route is listed once", () => {
  assert.deepEqual(met({ dependentRepos: 900, dependentPackages: 300, monthlyDownloads: 1 }), ["maintainers"]);
});

test("core contributors: only a yes meets it", () => {
  assert.deepEqual(met({ listedCommitter: false }), []);
  assert.deepEqual(met({ listedCommitter: true }), ["core"]);
});

test("active contributors: 100 merged pull requests is enough, 99 is not", () => {
  assert.deepEqual(met({ mergedPrs: 99 }), []);
  assert.deepEqual(met({ mergedPrs: 100 }), ["active"]);
});

test("community builders: 20 external contributors is enough, 19 is not", () => {
  assert.deepEqual(met({ externalContributors: 19 }), []);
  assert.deepEqual(met({ externalContributors: 20 }), ["community"]);
});

test("critical infrastructure: a score of 0.4 is enough, 0.39 is not", () => {
  assert.deepEqual(met({ openssfScore: 0.39 }), []);
  assert.deepEqual(met({ openssfScore: 0.4 }), ["critical"]);
});

test("several routes at once come back in the page's order", () => {
  assert.deepEqual(met({ openssfScore: 0.9, mergedPrs: 140, listedCommitter: true, externalContributors: 25, monthlyDownloads: 5_000_000 }), [
    "maintainers",
    "core",
    "active",
    "community",
    "critical",
  ]);
});

test("a broken number (NaN) never lights a route", () => {
  assert.deepEqual(met({ dependentRepos: NaN, mergedPrs: NaN, openssfScore: NaN }), []);
});

test("toCount reads what people type into a number field", () => {
  assert.equal(toCount("500"), 500);
  assert.equal(toCount("200,000"), 200_000);
  assert.equal(toCount(" 1 200 "), 1200);
  assert.equal(toCount("12.9"), 12);
});

test("toCount turns empty, negative and non-numeric text into 0", () => {
  assert.equal(toCount(""), 0);
  assert.equal(toCount("-5"), 0);
  assert.equal(toCount("abc"), 0);
  assert.equal(toCount("1e9"), 0);
});

test("toCount reads thousands written with dots, apostrophes, underscores or odd spaces", () => {
  assert.equal(toCount("200.000"), 200_000);
  assert.equal(toCount("1.200.000"), 1_200_000);
  assert.equal(toCount("200'000"), 200_000);
  assert.equal(toCount("200_000"), 200_000);
  assert.equal(toCount("200 000"), 200_000);
  assert.equal(toCount("0500"), 500);
});

test("toCount reads full-width digits and the k / M shorthand", () => {
  assert.equal(toCount("５００"), 500);
  assert.equal(toCount("200k"), 200_000);
  assert.equal(toCount("1.5M"), 1_500_000);
  assert.equal(toCount("500+"), 500);
  assert.equal(toCount("~500"), 500);
});

test("toCount gives 0 for an ambiguous number rather than guess high", () => {
  assert.equal(toCount("1,5"), 0);
  assert.equal(toCount("12,34"), 0);
});

test("routesMet ignores negative numbers and treats a score just under 0.4 as not met", () => {
  assert.deepEqual(met({ dependentRepos: -500, mergedPrs: -100, openssfScore: 0.7 - 0.3 }), []);
  assert.deepEqual(met({ openssfScore: Number("0.40") }), ["critical"]);
});

test("toCount caps absurd numbers so the page never prints Infinity", () => {
  assert.equal(toCount("9".repeat(40)), 999_999_999_999);
});

test("countWords counts words separated by any whitespace", () => {
  assert.equal(countWords(""), 0);
  assert.equal(countWords("   \n  "), 0);
  assert.equal(countWords("I maintain left-pad."), 3);
  assert.equal(countWords("  two\n\nwords  "), 2);
  assert.equal(countWords(Array(500).fill("word").join(" ")), 500);
});
