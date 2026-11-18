// /free/70 (gta-channel): the data behind the figures, kept apart from React so data.test.mjs can pin it.
// From the reel: the three searches, about $2 per 1,000 views, MrBossFTW's views and estimate, the build order.
// Install commands were read from each project's own repository on 2026-11-18.

export const GTA_KINDS = ["search", "math", "setup", "build", "launch"] as const;
export type GtaDemoKind = (typeof GTA_KINDS)[number];

/* ───── pick one search ───── */

export type SearchIdea = { id: string; label: string; query: string; title: string; outline: string[] };

export const SEARCHES: SearchIdea[] = [
  {
    id: "car",
    label: "Every car",
    query: "every car in GTA 6",
    title: "Every Car Confirmed For GTA 6 So Far",
    outline: ["Cars shown in the official trailers", "Where each one appears", "The one to look for first"],
  },
  {
    id: "mission",
    label: "Every mission",
    query: "every mission in GTA 6",
    title: "GTA 6 Missions: What The Trailers Already Show",
    outline: ["Scenes that look like missions", "Who is in each one", "What is still unknown"],
  },
  {
    id: "secret",
    label: "Every secret",
    query: "every secret in GTA 6",
    title: "Secrets Hiding In The GTA 6 Trailers",
    outline: ["Details most people missed", "The frame to pause on", "What each detail could mean"],
  },
];

/** The first prompt of the build, for the search the reader picked. */
export const searchPrompt = (query: string) => `I'm making one YouTube video that answers the search "${query}".

Read every file in ./sources. Those are the official trailers and
screenshots, plus my notes.

Give me:
1. Three possible titles, each under 60 characters
2. A one-minute outline
3. Every claim in the outline, with the source file it comes from

Use only what the sources show. If something is not confirmed,
say "not confirmed" and leave it out of the outline.`;

/* ───── will it pay ───── */

export const VIEW_STEPS = [1000, 10000, 100000, 1000000, 10000000, 100000000];
export const RATES = [1, 2, 4];
export const DEFAULT_RATE = 2;

/** Ad money for a number of views, at a rate in dollars per 1,000 views. */
export const earnings = (views: number, rate: number) => (views / 1000) * rate;

export const MR_BOSS = {
  name: "MrBossFTW",
  views: 1689394000,
  estimate: 3400000,
  subscribers: "3.19M",
  viewsAsOf: "Nov 1, 2026",
  viewsSource: "vidIQ",
  href: "https://www.youtube.com/@MrBossFTW",
};

/* ───── what to set up ───── */

export type SetupTool = { id: string; name: string; job: string; cost: string; command: string; href: string; note: string };

export const TOOLS: SetupTool[] = [
  {
    id: "claude",
    name: "Claude Code",
    job: "Writes the script and builds the video",
    cost: "Paid Claude plan or API credits",
    command: "curl -fsSL https://claude.ai/install.sh | bash",
    href: "https://github.com/anthropics/claude-code",
    note: "The one part of this setup that is not free.",
  },
  {
    id: "remotion",
    name: "Remotion",
    job: "Turns code into an MP4",
    cost: "Free for individuals",
    command: "npx create-video@latest",
    href: "https://github.com/remotion-dev/remotion",
    note: "Also free for companies with up to 3 employees. Larger companies need a paid license.",
  },
  {
    id: "kokoro",
    name: "Kokoro",
    job: "Reads the script out loud",
    cost: "Free, open weights",
    command: "pip install kokoro soundfile",
    href: "https://github.com/hexgrad/kokoro",
    note: "Apache-2.0 license. It also needs espeak-ng on your computer.",
  },
];

/* ───── the build ───── */

export type BuildStep = { id: string; title: string; does: string; prompt: string };

export const BUILD: BuildStep[] = [
  {
    id: "sources",
    title: "Collect the sources",
    does: "Put the official trailers, screenshots and your notes in one folder.",
    prompt: `Create this folder structure for a new video:

./sources    official trailers, screenshots, my notes
./script     the script
./voice      the voice-over
./video      the Remotion project

List what is in ./sources, and tell me what looks missing
for the search I picked.`,
  },
  {
    id: "script",
    title: "Write the script",
    does: "Claude Code writes one minute, using only what the sources show.",
    prompt: `Write a 60-second script for the outline we picked.
Save it as ./script/script.md.

- Answer the search in the first sentence
- Short spoken sentences, about 150 words
- Add my own opinion at least three times, marked [ME]
- Next to each line, name the source file that backs it up

Do not state anything the sources do not show.`,
  },
  {
    id: "voice",
    title: "Make the voice",
    does: "Kokoro runs on your own computer and saves the voice-over.",
    prompt: `Write and run a Python script that reads ./script/script.md
with Kokoro and saves ./voice/voice.wav.

Use KPipeline(lang_code='a') and the voice af_heart.
Read only the spoken lines. Skip the source notes and the [ME] marks.

Then tell me the length of the audio in seconds.`,
  },
  {
    id: "video",
    title: "Build the video",
    does: "Claude Code builds the edit in Remotion, timed to the voice.",
    prompt: `In ./video, build a 1920x1080 Remotion video timed to
./voice/voice.wav.

- Change the picture every 3 to 5 seconds
- Use short clips from ./sources, only where the script talks about them
- Add large captions and my own labels on top of the footage
- Never play a trailer straight through

Render it to ./video/out/final.mp4 and list every clip you used,
with its start time and length.`,
  },
  {
    id: "check",
    title: "Check it, then post",
    does: "Claude Code checks every claim. You watch it once before posting.",
    prompt: `Check ./video/out/final.mp4 against ./script/script.md and ./sources.

1. List every factual claim and the source that backs it up
2. Flag any claim with no source
3. Flag any clip longer than 10 seconds
4. Write a YouTube title, a description and 3 tags

Do not upload anything. I will watch the video and post it myself.`,
  },
];

/* ───── before you post ───── */

export const CHECKS: { id: string; text: string; why: string }[] = [
  { id: "facts", text: "Every claim comes from an official source", why: "Before launch, leaks and guesses spread fast." },
  { id: "voice", text: "Your own commentary runs through the whole video", why: "Your take is what makes it your video." },
  { id: "clips", text: "Trailer clips are short and support your point", why: "The footage belongs to Rockstar Games." },
  { id: "title", text: "The title matches what the video really shows", why: "A misleading title loses the viewer in seconds." },
  { id: "ai", text: "YouTube's altered content setting is checked", why: "Turn it on when the rules ask for it." },
  { id: "watch", text: "You watched the whole video once", why: "A person signs off on every upload." },
];
