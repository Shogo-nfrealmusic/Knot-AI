// /free/65 (Claude for Open Source): the published thresholds and the check behind the route checker.
// Every number and every quoted line is from claude.com/contact-sales/claude-for-oss, read on 2026-11-14.
// No imports and no React here, so `npm test` can run it with plain Node.

export type RouteId = "maintainers" | "core" | "active" | "community" | "critical";

export type Inputs = {
  dependentRepos: number;
  dependentPackages: number;
  /** combined monthly downloads across any registry */
  monthlyDownloads: number;
  /** listed committer or maintainer on a recognized foundation or language project */
  listedCommitter: boolean;
  /** pull requests merged into repos you don't own, last 12 months */
  mergedPrs: number;
  /** unique external contributors with merged pull requests on one of your repos, last 12 months */
  externalContributors: number;
  /** OpenSSF criticality score of a repo you maintain, 0 to 1 */
  openssfScore: number;
};

export const EMPTY: Inputs = {
  dependentRepos: 0,
  dependentPackages: 0,
  monthlyDownloads: 0,
  listedCommitter: false,
  mergedPrs: 0,
  externalContributors: 0,
  openssfScore: 0,
};

export const THRESHOLDS = {
  dependentRepos: 500,
  dependentPackages: 100,
  monthlyDownloads: 200_000,
  mergedPrs: 100,
  externalContributors: 20,
  openssfScore: 0.4,
} as const;

/** The five routes in the order the official page lists them; `quote` is the official wording. */
export const ROUTES: { id: RouteId; name: string; short: string; quote: string }[] = [
  {
    id: "maintainers",
    name: "Maintainers",
    short: "Maintain",
    quote:
      "You maintain packages that others build on: 500 or more dependent repos, 100 or more dependent packages, or 200,000 or more combined monthly downloads across any registry (npm, PyPI, crates.io, RubyGems, or similar)",
  },
  {
    id: "core",
    name: "Core contributors",
    short: "Core",
    quote:
      "You're a listed committer or maintainer on a recognized foundation or language project: CPython, Rust team, Node.js TSC, Apache PMC, CNCF, Kubernetes, Linux kernel, Django, Rails, or similar",
  },
  {
    id: "active",
    name: "Active contributors",
    short: "Active",
    quote: "You've authored 100 or more pull requests merged into repos you don't own in the last 12 months",
  },
  {
    id: "community",
    name: "Community builders",
    short: "Community",
    quote: "One of your repos has had 20 or more unique external contributors with merged pull requests in the last 12 months",
  },
  {
    id: "critical",
    name: "Critical infrastructure",
    short: "Critical",
    quote: "Any repo you maintain has an OpenSSF criticality score of 0.4 or above",
  },
];

export const FALLBACK = "Don't quite fit? If you maintain something the ecosystem quietly depends on, apply anyway and tell us about it.";

/** Which routes' published thresholds these numbers meet, in the page's order. It says nothing about approval. */
export function routesMet(i: Inputs): RouteId[] {
  const t = THRESHOLDS;
  const yes: Record<RouteId, boolean> = {
    maintainers: i.dependentRepos >= t.dependentRepos || i.dependentPackages >= t.dependentPackages || i.monthlyDownloads >= t.monthlyDownloads,
    core: i.listedCommitter === true,
    active: i.mergedPrs >= t.mergedPrs,
    community: i.externalContributors >= t.externalContributors,
    critical: i.openssfScore >= t.openssfScore,
  };
  return ROUTES.map((r) => r.id).filter((id) => yes[id]);
}

const MAX_COUNT = 999_999_999_999;

/**
 * A typed count as a whole number: "200,000", "200.000", "200'000", " 1 200 ", "５００", "200k", "1.5M", "500+", "12.9".
 * Anything it cannot read for certain ("1,5", "abc", "-5") is 0, so a typo never lights a route.
 */
export function toCount(raw: string): number {
  // NFKC turns full-width digits and odd spaces into plain ones; a leading "~" and a trailing "+" carry no number
  let text = raw.normalize("NFKC").replace(/\s/g, "").replace(/^~/, "").replace(/\+$/, "");
  let scale = 1;
  const suffix = /^(\d+(?:\.\d+)?)([km])$/i.exec(text);
  if (suffix) {
    text = suffix[1];
    scale = suffix[2].toLowerCase() === "k" ? 1_000 : 1_000_000;
  } else if (/^\d{1,3}([,.'_]\d{3})+$/.test(text)) {
    text = text.replace(/[,.'_]/g, ""); // thousands separators
  }
  if (!/^\d+(\.\d+)?$/.test(text)) return 0;
  return Math.min(MAX_COUNT, Math.floor(Number(text) * scale));
}

export function countWords(text: string): number {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}
