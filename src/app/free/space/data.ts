// /free/73 (chatgpt-space): the data behind the three figures. Facts come from OpenAI's ChatGPT release notes
// (2026-11-20 "ChatGPT Space is rolling out to Plus", 2026-09-29 Space / Pages) and @ChatGPT's post of 2026-11-20.

export type SpaceDemoKind = "refresh" | "comment" | "access";

/** figure 1: the to-do list from the official clip, and the Slack messages an hourly refresh reads (illustrative) */
export const TODO = [
  { id: "copy", task: "Review website copy", detail: "Share feedback on the homepage by 5 PM." },
  { id: "plan", task: "Finalize the launch plan", detail: "Confirm owners and timing before tomorrow." },
  { id: "design", task: "Share design updates", detail: "Bring the latest mockups to the team review." },
] as const;

export const SLACK = [
  { at: "10:00", who: "Sara", text: "Homepage feedback is in the doc 👍", done: "copy" },
  { at: "11:00", who: "Eric", text: "Owners and dates locked for launch.", done: "plan" },
  { at: "12:00", who: "Sara", text: "Mockups posted for the review.", done: "design" },
] as const;

export const REFRESH_PROMPT = `Make this page my to-do list for the week: top priorities, each with a one-line detail.
Then keep it updated every hour from Slack:
- tick off anything someone marks as done in #launch
- add new action items people assign to me
- never delete an item, strike it through instead`;

/** figure 2: one slide, three comments you could leave on it (illustrative looks) */
export type SlideLook = { id: string; comment: string; bg: string; ink: string; font: string; title: string; note: string };
export const BEFORE: SlideLook = { id: "before", comment: "", bg: "#f6f2ea", ink: "#2a2f45", font: "Georgia, 'Times New Roman', serif", title: "Brand Guidelines", note: "the deck as it is" };
export const LOOKS: SlideLook[] = [
  { id: "site", comment: "@ChatGPT Make the guidelines feel like an extension of our new website. Use the same typography, colors, and imagery.", bg: "#ff5a2b", ink: "#ffffff", font: "Helvetica, Arial, sans-serif", title: "Brand Guidelines", note: "the comment from OpenAI's own demo" },
  { id: "short", comment: "@ChatGPT Cut every slide to one headline and three bullets.", bg: "#ffffff", ink: "#15171a", font: "Helvetica, Arial, sans-serif", title: "Brand rules, in 3 lines", note: "an example comment" },
  { id: "client", comment: "@ChatGPT Make a version of this deck for our client Acme: their colors, their logo spot.", bg: "#1d3a6b", ink: "#ffffff", font: "Helvetica, Arial, sans-serif", title: "Acme × Brand Guidelines", note: "an example comment" },
];

/** figure 3: who can open a shared Space page (release notes, 2026-11-20) */
export type Plan = { id: string; label: string; open: "yes" | "no" | "unknown"; why: string };
export const PLANS: Plan[] = [
  { id: "free", label: "Free", open: "no", why: "“People on Free can't open shared pages or presentations.”" },
  { id: "go", label: "Go", open: "unknown", why: "Go is not named in the release notes. Check before you share with someone on Go." },
  { id: "plus", label: "Plus", open: "yes", why: "Space reached Plus (ages 18+) on November 20, 2026." },
  { id: "pro", label: "Pro", open: "yes", why: "Pro has had Space since September 29, 2026." },
  { id: "business", label: "Business", open: "yes", why: "Business has had Space since September 29, 2026. Sharing follows your workspace settings." },
  { id: "enterprise", label: "Enterprise", open: "yes", why: "Sharing follows your organization's settings; Enterprise sharing started as an opt-in preview." },
];

export const RELEASE_NOTES = "https://help.openai.com/en/articles/6825453-chatgpt-release-notes";
export const POST = "https://x.com/ChatGPT/status/2123850912867471807";
