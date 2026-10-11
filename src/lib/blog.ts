// Blog content. Only facts from src/lib/projects.ts and PORTFOLIO.md.
// Drafts render in development only and are excluded from production builds.

export type BlogCategory = "ai" | "engineering" | "growth" | "building";

export const categoryLabels: Record<BlogCategory, string> = {
  ai: "AI & automation",
  engineering: "Engineering",
  growth: "Growth",
  building: "Building",
};

const categoryOrder: BlogCategory[] = ["ai", "engineering", "growth", "building"];

export type CoverIcon =
  | "monogram"
  | "claude"
  | "stripe"
  | "analytics"
  | "instagram"
  | "video"
  | "barbell";

export type CodeLanguage = "go" | "python" | "ts" | "tsx" | "sql" | "bash" | "swift" | "json";

// Paragraph and list text may contain inline links written as [label](href).
export type BlogBlock =
  | { type: "heading"; text: string; level?: 2 | 3 }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "quote"; text: string }
  | { type: "callout"; title?: string; text: string; variant?: "info" | "tip" }
  | {
      type: "figure";
      icon: CoverIcon;
      label: string;
      caption: string;
      category?: BlogCategory;
    }
  | {
      type: "code";
      filename: string;
      language: CodeLanguage;
      code: string;
      caption?: string;
    }
  | { type: "stats"; items: { value: string; label: string }[] }
  | {
      type: "image";
      src: string;
      alt: string;
      caption?: string;
      /** Rendered without a border or background. Use for transparent charts. */
      bare?: boolean;
    }
  | {
      type: "video";
      src: string;
      /** Shown before the video loads. Keeps the layout from shifting. */
      poster?: string;
      caption?: string;
      /** Silent looping clips autoplay. Anything with sound gets controls only. */
      loop?: boolean;
    };

export type BlogAuthor = { name: string; avatar: string };

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  category: BlogCategory;
  date: string;
  /** Set when a published post is substantially rewritten. Sorting still uses `date`. */
  updated?: string;
  author: BlogAuthor;
  status: "published" | "draft";
  /** Posts published elsewhere: cards link out and there is no local page. */
  externalUrl?: string;
  cover: { icon: CoverIcon; label: string };
  body: BlogBlock[];
};

const shogo: BlogAuthor = {
  name: "Shogo Kikuchi",
  avatar: "/images/profile/shogo-portrait.jpg",
};

const posts: BlogPost[] = [
  {
    slug: "a-second-account-with-a-clone-of-me",
    title: "A second Instagram, fronted by a clone of me",
    description:
      "@copilot_shogo is an English account about AI tools. The face and the voice are generated from mine. This is the pipeline behind it: claims checked before recording, a cloned voice that had to be un-broken, video written as code, and gates that stop a render. And what the numbers say about whether any of it helps.",
    category: "ai",
    date: "2026-09-30",
    updated: "2026-10-11",
    author: shogo,
    status: "published",
    cover: { icon: "instagram", label: "@copilot_shogo" },
    body: [
      {
        type: "paragraph",
        text: "On September 26 I posted the first reel on a new account, [@copilot_shogo](https://www.instagram.com/copilot_shogo/). It is in English, it is about AI tools and the things I build with them, and the person talking in it is me — except I never sat in front of a camera. The face is a HeyGen digital twin trained on video of me. The voice is an ElevenLabs clone of my own, made from about four minutes of me reading aloud.",
      },
      {
        type: "paragraph",
        text: "By September 29 there were nine finished reels. This is how the account is set up, how a reel gets made, and the part that turned out to be hard. I updated it in October with the production pipeline as it runs now.",
      },
      {
        type: "stats",
        items: [
          { value: "9", label: "finished reels in the first five days" },
          { value: "480", label: "reels from 16 accounts studied before the first post" },
          { value: "9", label: "pages under /free that the reels pointed to at the end of September" },
        ],
      },
      { type: "heading", text: "Why a second account" },
      {
        type: "paragraph",
        text: "My personal account, @imshogo.k, has about 29,000 followers. A story on it reaches 200 to 500 people. Follower count stopped meaning reach a while ago, and the content there is fitness and motivation, not the work I spend my days on.",
      },
      {
        type: "paragraph",
        text: "So the new account has one job: show the AI tools I actually use and the things I build with them, in a form people can take away. Every reel ends with a keyword. Comment it, and an automated DM sends a link to a page on this site under [/free](/free) — install commands, how the thing works, a real run. The reel is the trailer; the page is the thing you keep.",
      },
      { type: "heading", text: "Research before the first post" },
      {
        type: "paragraph",
        text: "Before making anything, I pulled 480 reels from 16 accounts in this niche and measured them. Three things came out of it:",
      },
      {
        type: "list",
        items: [
          "What grew was not a particular hook shape. It was whether the viewer gets something they can use — a step, a prompt, a tool, something the creator built",
          "A face talking the whole way through, and opinion or mindset pieces, did badly",
          "\"Comment a keyword for the link\" is used by nearly everyone, so it is table stakes rather than an edge",
        ],
      },
      {
        type: "paragraph",
        text: "Many creators in this niche also front their accounts with an AI version of themselves, so a generated face was not the unusual part. What people share is.",
      },
      { type: "heading", text: "What gets posted" },
      {
        type: "list",
        items: [
          "Tool roundups: [five Claude Code plugins](/free/06-claude-code-plugins), [free design tools for Claude](/free/02-claude-design-tools), [a free LLM API gateway](/free/01-freellmapi)",
          "Things I built and gave away: [/llm-council](/free/07-llm-council), a Claude Code skill that asks several models and has a chair decide, and [/legal-check](/free/08-legal-check), which audits an app for legal traps",
          "Warnings for people shipping with AI: [the legal traps in a vibe-coded app](/free/08-legal-check), [12 security checks](/free/09-vibe-secure)",
        ],
      },
      {
        type: "video",
        src: "/blog/copilot/reel-08.mp4",
        poster: "/blog/copilot/reel-08-poster.jpg",
        caption:
          "Reel #08, the legal traps of a vibe-coded app. Screens and graphics take the top two thirds; the twin sits in the bottom third.",
      },
      { type: "heading", text: "The pipeline in one pass" },
      {
        type: "paragraph",
        text: "Every reel is one folder in a studio repo, and Claude Code does most of the assembly. The order is fixed, and each step writes a file the next one reads:",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "Ideas. A script collects what moved in the last day on X, Instagram, GitHub Trending and Hacker News, and Claude proposes topics",
          "Verification. A separate agent checks every claim against its source. Only topics that pass become a script",
          "Voice. The narration goes to my voice clone, which returns audio and a timestamp for every character",
          "Face. The finished audio drives the HeyGen twin through its API",
          "Picture. The video is a React component rendered by Remotion, a library that turns React into video frames",
          "Render. A check script runs first and refuses to render if a rule is broken",
          "Review. A separate agent scores the rendered frames. Below 85 the reel does not reach me",
          "Posting. I post by hand. Nothing in the repo can publish",
        ],
      },
      { type: "heading", text: "Claims are checked before anything is recorded" },
      {
        type: "paragraph",
        text: "The first factual failure came on day one. A topic was built from a reference reel about a project called Laya. The transcript misheard the name, and the research built the whole idea on a different, much smaller project. I caught it only because the name on the screen did not match, and the reel had to be remade.",
      },
      {
        type: "paragraph",
        text: "The fix was structural. Each idea now names one entity with its official URL and lists the things it could be confused with. The subject of a reference reel is read from its frames, never from the transcript. Every factual sentence needs an entry in a claims list: the sentence, the source URL, and a verbatim quote from that page. Then a different agent, told to look for errors and not for reasons to pass, opens each URL and checks that the quote is there and that the sentence claims no more than the quote does. It writes pass or fail into the file. The session that wrote an idea cannot pass it.",
      },
      {
        type: "paragraph",
        text: "A pass expires after three days, because tools change. The idea files in the repo hold 19 ideas with 230 sourced claims between them. It has already paid for itself: the reference reel behind my LLM Council video attributed a benchmark number to the wrong model and a skill to the wrong author. Mine says what the sources say.",
      },
      { type: "heading", text: "Script to voice" },
      {
        type: "paragraph",
        text: "Text-to-speech is not deterministic. The same sentence comes back with different pauses each time, and a pause in the middle of a clause is what makes a cloned voice sound stitched together. So the script asks for several takes and keeps the one with the fewest pauses that do not follow punctuation.",
      },
      {
        type: "code",
        filename: "scripts/tts.py",
        language: "python",
        code: `def odd_pauses(al):  # gaps > 0.12 s that are not after punctuation = the "choppy" breaks Shogo hears
    w = words_of(al); return sum(1 for x, y in zip(w, w[1:]) if y[1] - x[2] > 0.12 and x[0][-1] not in ",.:;?!")
best = None
for i in range(max(1, a.takes)):
    d_ = json.loads(...)  # one request to the text-to-speech endpoint that returns audio + character timestamps
    n = odd_pauses(d_["alignment"]); print(f"take {i + 1}: {n} mid-sentence pauses")
    if best is None or n < best[0]: best = (n, d_)
    if n == 0: break`,
        caption:
          "Three takes by default, stopping early on a clean one. The request line is shortened here; the rest is as written. The same response becomes words.ts, a list of every word with its start and end time.",
      },
      {
        type: "paragraph",
        text: "The clone is generated at speed 1.2. A second script shortens only pauses longer than 0.3 seconds to 0.2 and stretches the result by 1.1 with Rubber Band, a time-stretcher that preserves the formants of a voice. That lands near 250 words a minute with the breaths left in. I got there by listening: 1.38 times with every breath removed sounded cheap, and no stretch at all was a little slow.",
      },
      {
        type: "paragraph",
        text: "The first tightening script had a bug I could hear before anyone could name it. I said it sounded like an old radio. The script cut at the word-end time the API reports plus a fixed gap. But the reported end comes before the sound actually dies, and connected speech has no silence between words. On one reel, 75 of 107 cuts had removed audible voice, and the pieces were joined with no fade.",
      },
      {
        type: "code",
        filename: "scripts/tighten.py",
        language: "python",
        code: `_hop = int(0.005 * SR); _w = int(0.010 * SR)
_env = np.sqrt(np.convolve(_raw.astype(np.float64) ** 2, np.ones(_w) / _w, "same"))[::_hop]
_thr = 0.12 * np.percentile(_env[_env > 1e-4], 75)
def _quiet_span(a0, b0):
    """longest run inside [a0, b0] where the audio is quiet → (start, end) in seconds, or None"""
    i0, i1 = int(a0 * SR / _hop), int(b0 * SR / _hop)
    q = _env[i0:i1] < _thr
    best, cur = None, None
    for k, v in enumerate(q):
        if v: cur = (cur[0], k) if cur else (k, k)
        else: cur = None
        if cur and (not best or cur[1] - cur[0] > best[1] - best[0]): best = cur
    if not best: return None
    return (i0 + best[0]) * _hop / SR, (i0 + best[1] + 1) * _hop / SR`,
        caption:
          "A cut may now remove only audio that is measurably quiet: 10 ms RMS below 12% of the speech level. It keeps 15 ms of air on each side, and where there is no real silence it does not cut. Word times are remapped through the same kept intervals, so captions stay in sync.",
      },
      { type: "heading", text: "The face" },
      {
        type: "paragraph",
        text: "The twin is audio-driven. A script uploads the final narration to HeyGen, requests a render of my avatar speaking it, polls until it is done and downloads the clip. It costs about one API credit per second of audio, so the face is generated only after the voice is final. One known debt: the script still calls an endpoint HeyGen has marked as legacy, with a shutdown date of October 31, 2026. The migration is not done.",
      },
      {
        type: "paragraph",
        text: "On screen the face is fixed to the bottom third, below y = 1280 on a 1080 by 1920 frame, and episodes may not redefine that line. The face also has to leave. The research said a face talking all the way through does badly, and one of my own reels drifted into exactly that, so from October 12 a reel that does not hide the face in at least two scenes fails the check.",
      },
      { type: "heading", text: "Video as code, timed by words" },
      {
        type: "paragraph",
        text: "Each reel is a React file rendered at 60 frames a second. The decision that mattered most is that nothing is timed in seconds. A scene starts when a word is spoken, and the word list from the voice step is the clock.",
      },
      {
        type: "code",
        filename: "src/components/Kit.tsx",
        language: "ts",
        code: `type Word = { w: string; s: number; e: number };
const norm = (s: string) => s.replace(/[.,?!:;"“”]/g, "").toLowerCase();
/** at("sued"), at("it", 5.9) → the start time of that spoken word. Throws when the word is missing, so a script edit
 *  can't silently move a cue to the wrong second (dreamwork's copy fell back to \`after\` without a word). */
export const wordClock = (words: Word[]) => {
  const ws = words.map((w) => ({ ...w, k: norm(w.w) }));
  return (k: string, after = 0) => {
    const w = ws.find((x) => x.k === norm(k) && x.s >= after);
    if (!w) throw new Error(\`word not found: "\${k}" after \${after}s\`);
    return w.s;
  };
};

// episodes/_template/Video.tsx
const at = WORDS.length ? wordClock(WORDS) : (_k: string, after = 0) => after;
const S = { hook: 0, name: at("tool"), number: at("number"), demo: at("demo"), comment: at("comment") };`,
        caption:
          "Re-recording the voice moves every scene with it. A missing word is a build error. An earlier per-episode copy of this helper fell back silently, which is why it throws now.",
      },
      {
        type: "list",
        items: [
          "**Captions** come from the same word list: one to three words in a box, broken at punctuation, at a pause longer than 0.25 seconds, or when the layout changes. Episodes cannot define their own caption style",
          "**Safe zone.** Instagram covers the top of a reel with its own labels, the bottom with the caption and the right edge with buttons. Headlines, cards, terminals and captions stay between y = 250 and y = 1500 and between x = 70 and x = 1025, narrowing to x = 887 below y = 1110. Review stills are rendered with that frame drawn on top",
          "**Real screens.** Pages are recorded with Playwright, a browser automation library, from a list of steps (wait, scroll, click, drag). For sharp text, one recorder takes a screenshot per frame at phone width and assembles them into a clip. For zooms, another script saves the measured pixel box of a chosen piece of text, so the camera goes to a computed rectangle and not to a guess. Nothing on screen may pretend to be a tool's output",
          "**Logos** come from official sources, recorded in a manifest with where each was fetched. It has 77 entries today",
        ],
      },
      { type: "heading", text: "Gates that stop a render" },
      {
        type: "paragraph",
        text: "Rules written in a document did not hold. So the rules that can be tested became a 170-line shell script that the render command runs first. Nothing renders if any of these fail:",
      },
      {
        type: "list",
        items: [
          "The face and all spoken text use the shared components, the narration is my voice, and it runs at 215 words a minute or more",
          "The music is at least one second longer than the narration. One reel went silent for its last nine seconds before this existed",
          "The script has a shot list of at least six cuts and a retention plan with at least three timed devices, written before the first render",
          "Every downloaded asset is used in the video or listed with a reason. Claude once downloaded five official demo clips, used one, and drew its own cards for the rest",
          "The cover photo has not been used before. The comparison is a perceptual hash of the image, because the same photo was once reused under a different filename",
          "The caption is 480 characters or fewer and does not open with the first sentence of the script",
        ],
      },
      {
        type: "paragraph",
        text: "After rendering, audio is brought to -14 LUFS. A single normalisation pass was landing between -15.3 and -16.2 because sound-effect peaks hit the ceiling first, so the render now applies gain, limits the peaks, measures again and corrects. Another script measures how many scene changes land on a beat of the music. On one reel that went from 29% to 89%, against 55% for random placement.",
      },
      {
        type: "paragraph",
        text: "The last gate is the one I trust most. A reel reaches me only through one script, and that script wants a review from an agent that saw the rendered frames and nothing else: no code, no explanation of intent.",
      },
      {
        type: "code",
        filename: "scripts/ship.sh",
        language: "bash",
        code: `[ -f "$F" ] || { echo "SHIP ✗ no $F — run render.sh first"; exit 1; }
[ -f "$R" ] || { echo "SHIP ✗ no $R — run the independent critic (docs/critic.md) on this render"; exit 1; }
[ "$R" -nt "$F" ] || { echo "SHIP ✗ review.md is older than the render — the critic must judge the current final.mp4"; exit 1; }
score=$(grep -Eo "^Score: *[0-9]+" "$R" | tail -1 | grep -Eo "[0-9]+" || echo 0)
[ "\${score:-0}" -ge 85 ] || { echo "SHIP ✗ critic score $score < 85 — fix the defects in review.md and re-render"; exit 1; }
bash scripts/brand_check.sh "$id" >/dev/null || { echo "SHIP ✗ brand_check fails"; exit 1; }`,
        caption:
          "$F is the final render and $R is the review file. The review must be newer than the render, so a score cannot be carried over from an earlier version.",
      },
      { type: "heading", text: "The hard part was taste, not generation" },
      {
        type: "paragraph",
        text: "Generating a reel is cheap now. Making one worth watching was not. My second reel went through several versions. I scored the first one 65 out of 100. The rebuild, which Claude had scored 80, I scored 52: text cut off by a zoom it had chosen itself, a rainbow title that meant nothing, too many sound effects.",
      },
      {
        type: "paragraph",
        text: "Across the first week, the model's scores for its own work ran 5 to 30 points above mine. So I stopped asking it whether a reel was good and started writing down what good means, first as a craft document and then, where a rule could be tested, as the checks above. Reel #08 started out, in my words, looking cheap. Four revisions later, I called it excellent.",
      },
      {
        type: "image",
        src: "/blog/copilot/cover-08.jpg",
        alt: "Cover for reel #08: 'Sued for $100K. Before one sale.' over a photo of Shogo at a laptop, with a 3D badge and a printed receipt",
        caption:
          "Covers use a real photo, a 3D badge for the subject, and a serif headline. The reel uses the twin; the cover never does.",
      },
      { type: "heading", text: "What the tooling has not fixed" },
      {
        type: "paragraph",
        text: "The gates raise the floor. They do not make a first version good. In the four reels that have a review file, the independent critic's first score was 66, 66, 68 and 71, and each took three to five more rounds to reach 85. When I asked in early October why quality was dropping, some of the causes were things the tooling had created: a shared motion kit gave every reel the same grid background and the same tilted browser frame, and no check asked for a moment that only this reel has.",
      },
      {
        type: "paragraph",
        text: "Nor do the numbers follow the scores. On October 7 I pulled the public counts for every post. Day-one views fell into two groups, about 3,200 to 3,700 for two reels and about 200 to 700 for five others, and my ratings did not predict the group. The reel with my highest score, 82 for a draft version, had 204 views after a day and a half. The best result that week was a 7.5-second motivational clip made outside this pipeline: 14,759 views in 2.7 days, against 4,914 after 10.6 days for the best reel the pipeline produced. The sample is too small to test anything. But nothing here shows production quality separating these reels. Topic and hook look more likely, and that is a hypothesis.",
      },
      {
        type: "paragraph",
        text: "A script now records views, likes and comments for each post at day one and day seven, inside a monthly spending cap. Shares and saves are not public, so those columns stay empty instead of being estimated.",
      },
      {
        type: "quote",
        text: "The model can make a reel in minutes. It cannot tell you whether the reel is good, or whether it is true. Those two checks are the actual work, and they have to be written down or they don't happen.",
      },
      {
        type: "paragraph",
        text: "What I would add now: written down is not enough either. A rule held only once a script could fail on it. And a reel that passes every check can still be one nobody needed.",
      },
    ],
  },
  {
    slug: "the-number-matched",
    title: "The number matched. Everything else about it was wrong.",
    description: "SIGNAL checked every number and name in a model-written summary against the source article. The check passed 403億円 for a €403M fine: 100 times the amount, in the wrong currency. This is the code that let it through, the fix, and why that check stopped being the gate a day later.",
    category: "ai",
    date: "2026-09-22",
    updated: "2026-10-11",
    author: shogo,
    status: "published",
    cover: {
      icon: "claude",
      label: "SIGNAL"
    },
    body: [
      {
        type: "paragraph",
        text: "[SIGNAL](https://www.sgnl.news/) is a daily AI and tech brief. Six times a day it collects articles, groups the ones about the same event, ranks the groups, and has a model write a short entry for the top ones: a headline, a one-sentence summary and a line on why it matters. The model writes from the article text it is given."
      },
      {
        type: "paragraph",
        text: "The first run of the rebuilt ranking and writing step published fourteen stories, and its output was compared with the source text by hand. One was wrong in three places. The source said a new model was *two orders of magnitude* faster and the summary said 200倍, 200 times. It also spelled the company, TypeSafe, as Typeface. A writer that invents a multiple and renames the company cannot be fixed by reading every story by hand six times a day. So I added a checker."
      },
      {
        type: "heading",
        text: "How the first version worked"
      },
      {
        type: "paragraph",
        text: "It is mechanical on purpose. It does not ask a model whether the summary is faithful. It pulls every number and every name out of the output and requires each one to exist in the material, meaning the headlines plus the article text the writer was given. At that point the writer produced Japanese from English sources, so numbers had to be converted first: 4億300万 is 403,000,000, and the source says €403M or 403 million."
      },
      {
        type: "code",
        filename: "app/lib/story/fidelity.ts (first version, 21 September)",
        language: "ts",
        code: "export function checkFidelity(output: string, material: string): FidelityIssues {\n  const mat = materialValues(material);\n  const matLower = material.toLowerCase();\n  const numbers: string[] = [];\n  const re = /(\\d+(?:[.,]\\d+)*)\\s*(兆|億|万|千)?(?:(\\d+(?:[.,]\\d+)*)\\s*(万|千))?/g;\n  let m: RegExpExecArray | null;\n  while ((m = re.exec(output))) {\n    const [v] = japaneseValues(m[0]);\n    if (v === undefined || v <= TRIVIAL) continue;\n    if (mat.some((x) => close(x, v))) continue;\n    // Same digits written differently (e.g. a year, \"No. 18\").\n    if (matLower.includes(m[1].replace(/,/g, \"\"))) continue;\n    numbers.push(m[0].trim());\n  }\n  const names: string[] = [];\n  for (const w of output.match(/[A-Za-z][A-Za-z0-9.&'-]{2,}/g) ?? []) {\n    const word = w.replace(/[.'-]+$/, \"\");\n    if (COMMON.has(word.toLowerCase())) continue;\n    if (!matLower.includes(word.toLowerCase())) names.push(word);\n  }\n  return { numbers: [...new Set(numbers)], names: [...new Set(names)] };\n}",
        caption: "The check as first committed. japaneseValues turns 4億300万 into 403000000. materialValues collects every number in the source as bare digits and, where it has a unit (M, B, million, 億), also scaled by that unit."
      },
      {
        type: "paragraph",
        text: "Three decisions in there mattered later. *close* accepts a 0.6% difference, so a rounded figure still matches. Numbers up to 12 are skipped, because sources write *doubles* and *three companies* in words while Japanese writes 2倍 and 3社. And when the value does not match, a fallback accepts the number if its digits appear anywhere in the source. That line was for years and for things like *No. 18*, which have no unit to convert."
      },
      {
        type: "paragraph",
        text: "On failure the writer got one rewrite, with the offending tokens listed. If the rewrite still failed, the story was not published. On its first run the check found all three errors in that story, and a fourth in another: a *first in over 100 years* that the model had worked out from a date. The eight stories the next run published passed, and reading them by hand found nothing either."
      },
      {
        type: "heading",
        text: "Failure one: it was only correct in Japanese"
      },
      {
        type: "paragraph",
        text: "That evening I decided the site would be in English. Before switching the writer, the checker was run on a mock English summary of the same material. It flagged 172 of 480 words as names that were not in the source. Twelve of the 172 started with a capital. The rest were words like *goes* and *new*."
      },
      {
        type: "paragraph",
        text: "Look at the names loop in the excerpt. It has no idea what a name is. It checks every run of three or more Latin characters. In Japanese output that is almost the same set as the proper nouns, because the Latin-script words in a Japanese sentence are things like GitHub and Qwen. The rule was never *check the names*. It was *check the Latin words*, and the two rules give the same answer in exactly one language."
      },
      {
        type: "code",
        filename: "app/lib/story/fidelity.ts",
        language: "ts",
        code: "export function nameTokens(text: string): string[] {\n  const out: string[] = [];\n  for (const line of text.split(/\\n/)) {\n    for (const m of line.matchAll(/[A-Za-z0-9][A-Za-z0-9.&'’-]*/g)) {\n      // Possessive 's, and the plural s of an acronym (\"GPUs\" -> \"GPU\").\n      const token = m[0].replace(/[’']s$/, \"\").replace(/[.'’-]+$/, \"\").replace(/^([A-Z]{2,})s$/, \"$1\");\n      if (!/[A-Za-z]/.test(token)) continue;\n      const before = line.slice(0, m.index).trimEnd();\n      const sentenceStart = before === \"\" || /[.!?:\"“(]$/.test(before);\n      for (const part of token.split(\"-\")) {\n        if (part.length < 2 || !/[A-Za-z]/.test(part)) continue;\n        const special = /\\d/.test(part) || /[a-z][A-Z]/.test(part) || /^[A-Z]{2,}/.test(part);\n        const capital = /^[A-Z]/.test(part) && !(sentenceStart && part === token.split(\"-\")[0]);\n        if (special || capital) out.push(part);\n      }\n    }\n  }\n  return out;\n}",
        caption: "The replacement. A name is a token with a digit, an inner capital or a leading run of capitals, or a capitalised word that does not start a sentence. Possessives and acronym plurals are stripped. Hyphenated words are checked part by part."
      },
      {
        type: "paragraph",
        text: "Same material, same summary: 172 flags became 0, and the TypeSafe misspelling was still caught. On a dry run with the real English writer the check compared 76 names and none was missing from the source. The comment above the function states the gap that remains: a name that only ever appears as the first word of a sentence is not checked. I left it until it shows up in real output."
      },
      {
        type: "heading",
        text: "Failure two: €403M"
      },
      {
        type: "paragraph",
        text: "A few hours later the writer produced English and Japanese in one call, and the Japanese was checked against the English with the same function. A dry run, which writes nothing to the database, came back with this for a story about Ireland fining Google €403M: 403億円超. That is more than 40.3 billion yen. The numeral is 100 times too large, and the currency went from euros to yen."
      },
      {
        type: "paragraph",
        text: "The checker passed it. Walk the first excerpt with that input. 403億 parses to 40,300,000,000. The values collected from the source are 403 and 403,000,000. Neither is within 0.6%. Then the fallback runs: do the digits 403 appear in the source text? They do, so the loop continues to the next number. The unit conversion had done its job and found a mismatch. The line written to excuse years overruled it."
      },
      {
        type: "paragraph",
        text: "Currency was not a second hole in the comparison. It was never in the comparison. Running the first two versions of the file against that input confirms both points: each returns no issues."
      },
      {
        type: "heading",
        text: "The fix"
      },
      {
        type: "code",
        filename: "app/lib/story/fidelity.ts",
        language: "ts",
        code: "    if (mat.some((x) => close(x, v))) continue;\n    // Same digits written differently (e.g. a year, \"No. 18\") — but not with a\n    // Japanese unit: \"403億円\" for \"€403M\" has the digits and the wrong amount.\n    if (!m[2] && matLower.includes(m[1].replace(/,/g, \"\"))) continue;\n    numbers.push(m[0].trim());\n\n// ...\n\nconst CURRENCY: { name: string; ja: RegExp; en: RegExp }[] = [\n  { name: \"JPY\", ja: /円|¥|JPY/, en: /¥|\\byen\\b|\\bJPY\\b/i },\n  { name: \"USD\", ja: /ドル|\\$|USD/, en: /\\$|\\bdollars?\\b|\\bUSD\\b/i },\n  { name: \"EUR\", ja: /ユーロ|€|EUR/, en: /€|\\beuros?\\b|\\bEUR\\b/i },\n  { name: \"GBP\", ja: /ポンド|£|GBP/, en: /£|\\bpounds?\\b|\\bGBP\\b/i },\n  { name: \"CNY\", ja: /人民元|CNY|RMB/, en: /\\byuan\\b|\\bRMB\\b|\\bCNY\\b/i },\n];\nexport function currencyIssues(ja: string, en: string): string[] {\n  return CURRENCY.filter((c) => c.ja.test(ja) !== c.en.test(en)).map((c) => (c.ja.test(ja) ? `+${c.name}` : `-${c.name}`));\n}",
        caption: "Top: the digit fallback now applies only when the output number has no Japanese unit (m[2]). Bottom: currencies are compared as a set, in both directions."
      },
      {
        type: "paragraph",
        text: "The number fix is one condition. A year still passes on its digits. 403億 no longer can. With it, 10億ドル against $10B fails and 100億ドル passes."
      },
      {
        type: "paragraph",
        text: "Currency needed its own check because magnitude does not cover it. 4億300万円 is the right amount in the wrong currency, and the number check accepts it. *currencyIssues* asks which currencies each side mentions, by word, symbol or code, and reports any that appear on one side only. For 403億円 against €403M it returns +JPY and -EUR. It runs both ways because a translation can also drop the currency and leave a bare number."
      },
      {
        type: "heading",
        text: "False positives, and what each one cost"
      },
      {
        type: "list",
        items: [
          "The name check rejected *GitHub* in a story sourced from GitHub Trending, because outlet names were not part of the material. They are now.",
          "A correct 100万トークン was rejected against *per million tokens*, because the English has no digit to match. An explicit *per million* now counts as 1,000,000. A bare *millions* does not, and a regression case keeps 1000万 failing.",
          "Each story has a short label that may only use words from its own headline. *China* against a headline that said *Chinese* failed twice, and the whole story was dropped. Words now match on their first four letters, and a bad label is removed instead of blocking the story."
        ]
      },
      {
        type: "paragraph",
        text: "The last one set a rule I kept. A failed check on a fact blocks publication. A failed check on a decoration removes the decoration."
      },
      {
        type: "heading",
        text: "Why it is no longer the gate"
      },
      {
        type: "paragraph",
        text: "The file opens with a comment from the first day: it cannot judge meaning; it only proves that a figure or a name was not invented. The stories published in those first two days showed how much that leaves out. One gave a single release date for a product whose manufacturers had announced different dates by region. One attached a 7B parameter count to a whole model when it described one component. One reported an agreement to work out a notification mechanism as a mechanism already running. These are errors in what a number or a name belongs to, and a token match does not look at that."
      },
      {
        type: "paragraph",
        text: "So the publish path changed, less than 19 hours after the checker was first committed. Each draft now goes to a second model call that acts as an evidence editor. It is given the source texts and the draft in both languages, and returns pass, revise or hold with the claims it relied on. One line of its instructions states the €403M lesson: compare full propositions, not just whether digits appear somewhere."
      },
      {
        type: "code",
        filename: "app/lib/story/review.ts",
        language: "ts",
        code: "export async function prepareReviewedDraft(input:Parameters<typeof summarizeStory>[0]&{launch?:boolean}, budget:CallBudget):Promise<ReviewedDraft>{\n  if(!input.texts.length)return {kind:\"held\",issues:[\"No substantive source text\"]};\n  const material=input.texts.map(t=>t.text).join(\"\\n\");\n  let feedback:string[]=[];\n  for(let attempt=0;attempt<2;attempt++){\n    if(callUsage(budget).calls>=24)return {kind:\"budget\",issues:[\"Call limit\"]};\n    const draft=await summarizeStory({...input,editorialFeedback:feedback},budget);\n    if(!draft)return {kind:budget.limit||budget.uncertain?\"budget\":\"error\",issues:[\"Writer did not return a usable draft\"]};\n    if(draft.skip || (input.previous && draft.newDevelopment===false))return {kind:\"skip\",draft};\n    const presentation=[...presentationIssues(draft,input.launch),...policyScopeIssues(input.headlines[0]?.title??\"\",[draft.titleJa,draft.summaryJa,draft.whyJa,draft.body?.happened,draft.body?.why,draft.body?.next].join(\"\\n\"))];\n    if(presentation.length){feedback=presentation;if(attempt===1)return {kind:\"held\",issues:feedback};continue;}\n    const review=await reviewStory({headlines:input.headlines,texts:input.texts,draft},budget);\n    if(!review)return {kind:budget.limit||budget.uncertain?\"budget\":\"error\",issues:[\"Evidence review unavailable\"]};\n    const en=[draft.titleJa,draft.summaryJa,draft.whyJa,draft.body?.happened,draft.body?.why,draft.body?.next].join(\"\\n\");\n    const ja=draft.ja?[draft.ja.headline,draft.ja.summary,draft.ja.why,draft.ja.body?.happened,draft.ja.body?.why,draft.ja.body?.next].join(\"\\n\"):\"\";\n    feedback=[...review.issues,...claimIssues(en,material),...currencyIssues(ja,en)];\n    if(!draft.ja)feedback.push(\"Japanese version is required.\");\n    if(review.verdict===\"pass\"&&!feedback.length)return {kind:\"ready\",draft,review,revised:attempt>0};\n    if(review.verdict===\"hold\")return {kind:\"held\",issues:feedback.length?feedback:[\"Source evidence is insufficient\"]};\n  }\n  return {kind:\"held\",issues:feedback};\n}",
        caption: "Draft and review as they run today. Format and scope gates run before the paid review call. The currency check and three narrow overstatement guards run after it. Two attempts, then the story is held. Separately, the reviewer's parser turns a pass that arrives with issues, or with no evidence, into a hold."
      },
      {
        type: "paragraph",
        text: "The number-and-name matcher is not called on this path any more. It still runs in a maintenance script that backfills translations, and its cases are in the regression suite. The currency check runs on every story. A held story waits six hours, or until a new article joins it, before it can cost another call."
      },
      {
        type: "paragraph",
        text: "The reviewer is not a guarantee either. On the first production run after it shipped, it passed a draft that merged California's signed data-center laws with a separate EU proposal: two real events in one entry. The fix was deterministic again, a jurisdiction veto applied when articles are grouped, when source text is gathered, and on the draft itself."
      },
      {
        type: "heading",
        text: "How it is tested"
      },
      {
        type: "paragraph",
        text: "Two offline scripts, 45 and 19 cases. The tests that exercise model calls replace *fetch*, answer the token-count endpoint with a fixed number, and fail on any model request the test did not script, so they cannot spend money. The currency story is pinned by a handful of assertions: 403億円 against €403M must fail the number check, 4億300万円 must fail the currency check, 100万 must pass against *per million* and 1000万 must not. Others pin the loop above: a hold never returns a publishable draft, one revision has to pass a second review, and a request that dies mid-flight keeps its budget reservation and is not retried. Both scripts pass on the current main branch."
      },
      {
        type: "stats",
        items: [
          {
            value: "172 → 0",
            label: "words flagged as unsupported names in one 480-word English mock summary, before and after the fix"
          },
          {
            value: "76 / 0",
            label: "names compared and names missing, on one dry run of six stories"
          },
          {
            value: "45 + 19",
            label: "offline regression cases, none of which calls a paid API"
          }
        ]
      },
      {
        type: "paragraph",
        text: "None of these is an accuracy rate. The 172 comes from one summary and the 76 from one run. I have not measured how often the reviewer misses. The one miss I know about was found by comparing a published story with its sources, and it was corrected with a visible note."
      },
      {
        type: "paragraph",
        text: "The first two failures were found before the site was public, on a mock summary and a dry run. The third was published first and corrected afterwards. All of it happened inside two days."
      },
      {
        type: "quote",
        text: "A check is valid for the inputs it was built against. Mine was built for Japanese output and for numbers without units. It kept returning the same reassuring answer after both stopped being true."
      }
    ]
  },
  {
    slug: "a-studios-second-product",
    title: "A photo studio's second product was already sitting there",
    description:
      "Tetty had spent two years building a look. That look was a product the whole time \u2014 it just had no storefront, no checkout, and no way to hand it over.",
    category: "building",
    date: "2026-09-22",
    author: shogo,
    status: "published",
    cover: { icon: "stripe", label: "Preset Store" },
    body: [
      {
        type: "paragraph",
        text: "A photo studio sells shoots. That is the whole business: a customer books, a photographer shows up, images come back. Every hour of revenue needs a person standing somewhere holding a camera.",
      },
      {
        type: "paragraph",
        text: "But the studio had been making a second thing the entire time, without noticing it was a thing. The look \u2014 the colour, the grade, the reason the photos are recognisably ours \u2014 lives in a set of presets. They were built for internal use. They were also, it turns out, the only part of the business that can be sold without anyone being there.",
      },
      { type: "heading", text: "What was missing was not the product" },
      {
        type: "paragraph",
        text: "The presets already existed and already worked. What did not exist was everything around them: a storefront, product pages, a cart, a checkout, a way to deliver a file after payment, and somewhere to keep the orders. The booking platform covers none of that \u2014 it is built for scheduling a person, not for selling a download. The store is live at [tettyphotostudiolut.com](https://www.tettyphotostudiolut.com/).",
      },
      {
        type: "list",
        items: [
          "Storefront with collections and product pages",
          "Cart and Stripe checkout for a digital product",
          "Supabase for the product catalogue",
          "Deployed on Vercel and operated after launch",
        ],
      },
      {
        type: "stats",
        items: [
          { value: "Live", label: "in production at tettyphotostudiolut.com" },
          { value: "Stripe", label: "checkout for a digital product" },
          { value: "Solo", label: "designed, built, shipped, operated" },
        ],
      },
      { type: "heading", text: "Why it was worth building" },
      {
        type: "paragraph",
        text: "Shoot revenue is bounded by photographer hours. Preset revenue is not bounded by anything except whether anyone wants the look. Those are different shapes, and a company with only the first shape has to grow by hiring.",
      },
      {
        type: "callout",
        title: "The general version",
        text: "If you run a service business, look at what you built to deliver the service. The internal tool, the checklist, the preset, the template \u2014 it was produced as a byproduct, it already works, and it is usually the only part you can sell while asleep.",
      },
    ],
  },
  {
    slug: "ten-videos-before-i-wake-up",
    title: "Ten videos before I wake up: how the pipeline picks, cuts and never repeats",
    description:
      "Every night at midnight a Mac renders ten short videos for our photo studio from raw behind-the-scenes clips and retouched photos. This is how it finds the cut point, chooses the footage, writes the text, and avoids making the same video twice.",
    category: "ai",
    date: "2026-09-22",
    updated: "2026-10-11",
    author: shogo,
    status: "published",
    cover: { icon: "video", label: "Content Pipeline" },
    body: [
      {
        type: "paragraph",
        text: "Tetty's Photo Studio shoots travellers on the streets of Tokyo. Every session leaves behind two things: behind-the-scenes clips of the photographer at work, and the retouched photos. A short video that shows three of those clips and then five finished photos is our standard format. Making one takes a person who sits down, scrubs through footage, picks moments, types a line of text and exports. In a two-person company that person is usually busy.",
      },
      {
        type: "paragraph",
        text: "I edited a batch of these by hand first. The edits kept coming out the same shape, so I measured the cut points in the finished videos and wrote them down: eight shots in 10.43 seconds, text on screen for the first 4.6. The pipeline is that template plus the part a template cannot do, which is deciding what goes into it.",
      },
      {
        type: "stats",
        items: [
          { value: "10", label: "videos rendered every night, unattended" },
          { value: "3", label: "of the ten scheduled to TikTok automatically" },
          { value: "74", label: "unit tests on the selection, text and posting rules" },
        ],
      },
      { type: "heading", text: "Why the obvious versions fail" },
      {
        type: "paragraph",
        text: "A random pick fails. The good clips are a minority, so random selection mostly produces weak videos, and when it does find a good clip nothing stops it from using it again two days later. The feed fills up with the same faces.",
      },
      {
        type: "paragraph",
        text: "Handing the edit to a language model fails for a different reason. A model looks at still frames. It cannot watch a clip and tell me that the strobe fires at 5.07 seconds. Where to cut is a signal-processing question, so I answer it with arithmetic. The model gets the one question it is good at: given a frame, is this a good shot?",
      },
      { type: "heading", text: "What runs, and when" },
      {
        type: "paragraph",
        text: "There is no server. A launchd job (macOS's built-in scheduler) starts a shell script at 00:00 on a Mac that has the studio's shared Google Drive mounted. The script runs these steps in order. It does not stop when a step fails; the failure goes to the log and the next step runs:",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "Pull post results for earlier videos into a local cache.",
          "Download any new source files from Drive, and label new material as family/group or not.",
          "Analyse clips that have never been analysed. Each clip is analysed once and the result is cached under a key made from file name and size, so moving a file to another folder does not throw the work away.",
          "Generate ten videos: seven from the whole pool and three from family and group sessions only.",
          "Re-open every output and rebuild any file that does not decode to its last frame.",
          "Rank the ten by a quality score, take the best three that the spacing rule allows (at least one of them from a family or group session), add licensed music and schedule them to TikTok through the API of a posting service (Blotato).",
        ],
      },
      {
        type: "paragraph",
        text: "Each video is written to Drive with a contact sheet, a caption file and a job file that records exactly which clips, start times, photos and text were used. A broken or restyled video can be re-rendered from its job file.",
      },
      { type: "heading", text: "Finding the moment the flash fires" },
      {
        type: "paragraph",
        text: "The best second and a half of a behind-the-scenes clip is almost always the moment the strobe goes off. It reads as \"a photo is being taken\" without any explanation. A flash is easy to detect: one frame is much brighter than its neighbours. FFmpeg prints the average brightness of every frame, and this function finds the spikes.",
      },
      {
        type: "code",
        filename: "make_reel.py",
        language: "python",
        code: `def find_flashes(series, threshold=18):
    """Frames that are bright for an instant (strobe): [(time, strength)]"""
    out, ys = [], [y for _, y in series]
    for i in range(2, len(series) - 2):
        base = statistics.median([ys[i - 2], ys[i - 1], ys[i + 1], ys[i + 2]])
        if ys[i] - base > threshold:
            out.append((series[i][0], round(ys[i] - base, 1)))
    merged = []
    for t, s in out:
        if merged and t - merged[-1][0] < 0.25:
            if s > merged[-1][1]:
                merged[-1] = (t, s)
        else:
            merged.append((t, s))
    return merged`,
        caption:
          "Docstring translated from Japanese. The baseline is the median of the two frames on each side, so a slow change in exposure does not count as a flash.",
      },
      {
        type: "paragraph",
        text: "The segment is then placed so the flash lands 65% of the way through it. Clips with no flash get up to twelve evenly spaced candidate segments instead.",
      },
      {
        type: "paragraph",
        text: "For each candidate I grab one frame and count people and faces with Apple's Vision framework, called from a 28-line Swift tool. It ships with macOS, so there is nothing to install and no per-image cost. The candidate's score is flash strength, then how much of the frame the faces fill, then the face and person counts. The top candidates are also measured with FFmpeg's blur detector, and a blurry segment loses 40% or 80% of its score depending on how bad it is.",
      },
      { type: "heading", text: "Scored once, then cached" },
      {
        type: "paragraph",
        text: "The representative frame of each new clip goes to Claude through the Claude Code command line, ten frames per call, with file reading as the only tool it may use. It returns three scores from 0 to 10: is the backdrop recognisably Tokyo, is the client visible and happy, is the camera or flash in shot. The scores are stored next to the clip's analysis, and a clip that has scores is not sent again. If the call fails or times out, the night continues on the machine scores alone.",
      },
      { type: "heading", text: "A lottery, not a ranking" },
      {
        type: "paragraph",
        text: "If I always took the top three clips I would get one video. So selection is a weighted draw without replacement. Quality raises a clip's weight and past use lowers it.",
      },
      {
        type: "code",
        filename: "make_reel.py",
        language: "python",
        code: `def quality_weight(a):
    top = a["candidates"][0]
    w = 1.0 + top["score"] / 40.0
    if top["flash"]:
        w *= 3.0  # strongly prefer a moment where the flash fires
    if "claude" in a:
        cl = a["claude"]
        w *= 1.0 + (cl["tokyo"] * 1.2 + cl["client"] + cl["camera"] * 1.5) / 20.0
    if top["flash"] == 0 and top["faces"] == 0:
        w *= 0.15  # no flash and no face: almost never used
    if top.get("blur", 0) > 10:
        w *= 0.1  # only blurry segments: almost never used
    return w


def usage_weight(path, usage, recent_n):
    info = usage["files"].get(path, {"count": 0})
    w = 1.0 / (1.0 + 1.5 * info["count"])
    if path in usage["recent"][-recent_n:]:
        w *= 0.05
    return w`,
        caption:
          "Comments translated from Japanese. Nothing is ever excluded outright; a weak clip can still be drawn, just rarely.",
      },
      {
        type: "paragraph",
        text: "Weights alone do not stop two videos from being nearly identical, so the draw is checked against history. The generator keeps the last 300 videos it made. A draw that shares two or more clips with any of them, or three or more photos, is thrown away and drawn again, up to 30 times.",
      },
      {
        type: "code",
        filename: "make_reel.py",
        language: "python",
        code: `cpool = cooldown.filter_tiers(clip_pool, [tk_block | batch_used, tk_block], n_clips)
ws = [quality_weight(analyses[c]) * usage_weight(c, usage, t.get("avoid_recent", 12)) * perf_weight(c, perf) for c in cpool]
for _ in range(30):  # redraw a combination that shares 2+ clips with a past reel
    chosen = weighted_sample(cpool, ws, n_clips, rng)
    if max_overlap(chosen, [r["clips"] for r in usage.get("reels", [])]) <= 1:
        break
rng.shuffle(chosen)  # the same clip should not always appear in the same position`,
        caption: "Comments translated from Japanese.",
      },
      {
        type: "paragraph",
        text: "Three smaller rules sit around that loop. When a clip is reused, a different flash moment from the same clip is chosen. Files with the same content (\"copy of\" duplicates) are collapsed by hashing the first megabyte plus the size. And anything that appeared in the last five TikTok posts is removed from the pool before the draw, so a photo or clip shows up in at most one of any six consecutive posts. That last filter is tiered: it first tries to avoid recent posts and everything already used tonight, then only recent posts, then nothing. A small pool produces a weaker night, not a failed one.",
      },
      { type: "heading", text: "Text that is not allowed to lie" },
      {
        type: "paragraph",
        text: "The on-screen line comes from a fixed bank of lines, grouped by skeleton: POV, question, behind-the-scenes, save-this, statement. A line may not use the same skeleton as either of the previous two videos, and among what is left the least recently used line wins. The pipeline does not ask the language model to write these. An earlier version let it top up the bank, and that path is now switched off.",
      },
      {
        type: "paragraph",
        text: "The bank is guarded by tests, because the footage creates a specific trap. A video mixes clips and photos from different customers, so a line like \"from the shoot to the final photo\" would be false. The tests fail if a line names a price, makes an availability or award claim, mentions any handle but ours, or implies one session.",
      },
      {
        type: "code",
        filename: "tests/test_texts.py",
        language: "python",
        code: `class ContentRulesTest(unittest.TestCase):
    """English, no prices, no people's names, no availability or award claims."""
    BANNED = re.compile(r"[$¥€£]|\\d+\\s*(?:usd|yen|%)|spots? open|limited|award|best in|#1|guarantee", re.I)

    def test_no_prices_or_unverifiable_claims(self):
        for line in self.all_lines():
            self.assertIsNone(self.BANNED.search(line), line)

    def test_no_claims_the_footage_does_not_show(self):
        # normal/flurry mix different customers and sessions
        mixed = re.compile(r"you take home|after a photoshoot|from the shoot to|one (photo)?shoot", re.I)
        o, _, _ = texts.load_caption_bank()
        for line in [h for st in ("normal", "flurry") for _, h in texts.load_hook_bank(st)] + o:
            self.assertIsNone(mixed.search(line), line)`,
        caption: "Trimmed. The rule about what may not be written is a test, not a note in a document.",
      },
      {
        type: "paragraph",
        text: "The longer caption under each video is the one piece of generated writing. Claude gets the on-screen lines for the batch and returns one caption per video, with instructions not to mention prices, names, dates or numbers. If the call fails, a fixed bank is used. TikTok captions are assembled differently, from 26 opening lines that may not repeat within seven days.",
      },
      { type: "heading", text: "When it fails" },
      {
        type: "list",
        items: [
          "A source file that Drive will not hand over is retried five times with doubling waits, then dropped from the pool and the video is redrawn.",
          "Videos are rendered to local disk, checked, copied to Drive and checked again.",
          "Music is burned in only if the track has a recorded source and licence in a ledger file. With no licensed track, nothing is posted.",
          "Posting stops if an empty file named PAUSE exists in the project folder. No more than four posts are scheduled in any 24 hours.",
        ],
      },
      {
        type: "paragraph",
        text: "Most of those rules exist because something broke first. I wrote that up separately in [what broke while it ran unattended](/blog/ten-videos-every-morning).",
      },
      { type: "heading", text: "What the numbers do and do not show" },
      {
        type: "callout",
        variant: "info",
        title: "Account totals are not pipeline results",
        text: "The studio's Instagram had 1.14M views, 1,598 new followers and 61.4K interactions in the 30 days to September 2026. Those are account totals, not a controlled comparison, and Instagram posting is still done by hand. What the pipeline demonstrably does is produce ten finished videos a night without anyone deciding to. What it contributed to the reach is not isolated here.",
      },
      {
        type: "paragraph",
        text: "The same honesty applies inside the system. \"A flash is worth three times\" is my guess from editing by hand. The code to replace that guess is written: it links posted videos back to the clips and photos in them and folds seven-day shares into the weights. It stays switched off until 30 pipeline videos have a seven-day result, and that threshold has not been reached. Until then the weights are opinions with a random number generator attached.",
      },
      {
        type: "quote",
        text: "The model scores a frame. Arithmetic finds the cut. A lottery with a memory decides what gets made. None of the three could do the job of the other two.",
      },
    ],
  },
  {
    slug: "you-cant-one-prompt-this",
    title: "You can't one-prompt this",
    description:
      "My feed says Claude plus Higgsfield builds a luxury 3D scroll site from a single prompt. I built one for a concept drink brand to find out what that leaves out. The prompt was the easy part.",
    category: "engineering",
    date: "2026-09-19",
    author: shogo,
    status: "published",
    cover: { icon: "video", label: "TONI · 3D" },
    body: [
      {
        type: "paragraph",
        text: "For the past few months my feed has been full of the same promise: connect Claude to Higgsfield, paste one prompt, get the kind of animated 3D product site agencies charge $10,000 for. The reels usually end with \"comment a keyword and I'll send you the prompt\". Higgsfield itself now ships an official Claude skill that turns a brand kit into a scroll-driven site end to end.",
      },
      {
        type: "paragraph",
        text: "The tools are real. I used the same ones. What I wanted to know is what the promise leaves out, so I built one properly: a concept site for TONI, a matcha tonic my co-founder designed. It's live at [toni.shogo.build](https://toni.shogo.build/). Nothing is for sale; it's a concept.",
      },
      {
        type: "video",
        src: "/blog/toni/walkthrough.mp4",
        poster: "/blog/toni/walkthrough-poster.jpg",
        caption:
          "A scroll through the finished site, sped up. The can is a real-time 3D object; the burst, the pour, the day scenes and the gallery photos are generated.",
      },
      {
        type: "paragraph",
        text: "To be clear about who did what: I wrote the brief, set the rules, reviewed every stage and made the calls. Claude Code wrote most of the code and ran the Higgsfield generations. That is exactly why this is a fair test. A capable coding agent, the same generation tools as the reels, and it still took far more than a prompt.",
      },
      { type: "heading", text: "The part that really is easy" },
      {
        type: "paragraph",
        text: "The core trick behind those sites is old and simple. Generate a start frame and an end frame, let a video model fill in the motion, cut the clip into stills, and draw one still per scroll position on a canvas. Apple's AirPods page works the same way. The first working version of TONI's spinning can took about an hour and a quarter from an empty folder. If \"a can that turns when you scroll\" is the goal, the reels are right.",
      },
      {
        type: "paragraph",
        text: "Then I looked at it as a site, and scored it 60 out of 100. It was an animation demo with text around it.",
      },
      { type: "heading", text: "Where it actually got hard" },
      { type: "heading", text: "1. Text on a spinning can breaks", level: 3 },
      {
        type: "paragraph",
        text: "A label is the worst case for video generation: small type, on a curved surface, in motion. I ran the same start and end frames through two models. Kling 3.0 cost 8.75 credits per clip and broke the can partway through the turn: a black vertical line runs down it and one face of the label goes blank.",
      },
      {
        type: "image",
        src: "/blog/toni/kling-breaks.jpg",
        alt: "Thirteen frames of a can turning, generated by Kling. Midway a black vertical line appears down the can",
        caption: "Kling 3.0: the label breaks mid-turn.",
      },
      {
        type: "paragraph",
        text: "Seedance 2.5 cost 60 credits per clip, about seven times as much, and held the label.",
      },
      {
        type: "image",
        src: "/blog/toni/seedance-holds.jpg",
        alt: "The same turn generated by Seedance. The label stays intact through every frame",
        caption: "Seedance 2.5, same inputs: the label survives.",
      },
      {
        type: "paragraph",
        text: "That wasn't the end of it. A 360° turn that starts and ends on the same image risks giving the model nothing to animate, so it became two 180° clips. The second clip came back spinning the wrong way. Writing \"clockwise\" in the prompt did nothing; describing which faces pass the centre, in order, fixed it. Seedance also shifted the whole image warm, and the two clips came back in different colours, so the join flickered until every frame was colour-corrected to the page background.",
      },
      { type: "heading", text: "2. Sharp on a phone is a separate problem", level: 3 },
      {
        type: "paragraph",
        text: "The can looked soft. The frames were 1920 pixels wide, drawn 1600 CSS pixels wide on a Retina screen that renders every CSS pixel twice, so the screen wanted 3,200. The fix is a rule, not a setting: on-screen size times the screen's pixel ratio must never exceed the frame's own pixels. Phones made it worse. A 1080p clip can't produce a 1080×1440 portrait frame without stretching, so every clip had to be upscaled to 4K before being cut into frames.",
      },
      { type: "heading", text: "3. The naive version is unusable on a phone", level: 3 },
      {
        type: "paragraph",
        text: "To measure the difference, I built the version a one-prompt build tends to produce: every frame of every clip exported as JPEG, all loaded when the page opens, the same images for desktop and phone. Then I timed how long it took for the can to appear on a throttled phone.",
      },
      {
        type: "stats",
        items: [
          { value: "54.3 s → 1.0 s", label: "until the can appears on a phone" },
          { value: "147.8 → 1.9 MB", label: "downloaded on first load" },
          { value: "242 → 120", label: "frames in the hero sequence (desktop)" },
        ],
      },
      {
        type: "paragraph",
        text: "The fixes were unglamorous: fewer frames, WebP, a separate set for phones, the first frame placed directly in the HTML so it shows before any JavaScript runs, and later sections loaded only as you scroll near them.",
      },
      {
        type: "callout",
        title: "The metric that lied",
        text: "Lighthouse's LCP got worse after optimizing: 1.4–2.6 s before, 2.8–3.0 s after. The unoptimized page never showed the can early, so Lighthouse measured a line of text instead. The optimized page is measured on the can image itself. Read alone, the number says the correct fix made things slower.",
      },
      { type: "heading", text: "4. The award-level sites aren't made of video frames", level: 3 },
      {
        type: "paragraph",
        text: "To get past 70, I studied [oryzo.ai](https://oryzo.ai/), a site by the studio Lusion that presents a cork coaster like a flagship AI product. Its code tells you most of what you need. The main visual is a Three.js scene, not a video. The whole page is one timeline: scroll maps to a single progress value, and the camera, the object, the type and the background all derive from it. Headlines are split into individual letters that rise out of masks. Every button uses the same hover. There are very few colours, a lot of empty space, and one joke running from the first screen to the last.",
      },
      {
        type: "quote",
        text: "A one-prompt build gives you motion. What makes a site feel expensive is the decisions made before any motion exists.",
      },
      {
        type: "paragraph",
        text: "So the can stopped being video. It became a real 3D object: my co-founder's flat label artwork wrapped around a cylinder, with aluminium top and bottom. The label can't warp because nothing is being generated. The can turns while the headline slides behind it, falls between sections with real physics, and turns into a line-drawn blueprint before the label wraps back on. Video generation is kept for what it does better than 3D: the can bursting open into matcha powder, tonic and ice, a hand pouring it over ice into a glass, and a burst of each flavor's ingredients on its product page.",
      },
      {
        type: "image",
        src: "/blog/toni/six-flavors.jpg",
        alt: "Six TONI cans in a row, each with the same layout in a different colour: green, yellow, plum, purple, brown and teal",
        caption: "Six flavors from one label. Recoloured in code, zero generation credits.",
      },
      {
        type: "paragraph",
        text: "The flavor picker needed several rounds. The first version marked the selected can by stretching it taller, and it looked like a Pringles tube. Now every can keeps its proportions: the picked one comes forward at full size, with a disc of its flavor's colour glowing behind it.",
      },
      { type: "heading", text: "What it actually took" },
      {
        type: "list",
        items: [
          "Just under six hours from an empty folder to the finished site (about four and a half to the first deploy), with an agent working the whole time and me reviewing at each stop",
          "About 1,270 Higgsfield credits in total. The only video clips that needed redoing were the ones with text on a spinning can; everything after the can became 3D worked on the first try",
          "A written brief: brand copy taken only from the original concept text, no health claims, a concept notice on every page, checkout that stops at \"TONI is a concept\"",
          "A rewrite of the whole direction partway through, after studying what award-level sites actually do",
          "Many small calls no prompt makes for you: background colour, frame counts, what a selected can should look like, what to leave out",
        ],
      },
      { type: "heading", text: "So is the one-prompt claim wrong?" },
      {
        type: "paragraph",
        text: "It's true about the first two hours. You really can get a can spinning on scroll from a prompt, and that is new. What it leaves out is everything that makes the result usable as a site: whether the label survives, whether it's sharp on a real screen, whether a phone waits a minute to show anything, whether it looks like every other site built from the same prompt, whether there is a product, a story and a reason to stay.",
      },
      {
        type: "paragraph",
        text: "If someone's selling you the prompt, they're selling the part that's already cheap. The expensive part is the judgment, and it doesn't fit in a comment reply.",
      },
      {
        type: "callout",
        variant: "info",
        title: "About TONI",
        text: "TONI is a concept brand by TPS Collective. Can and logo design by Tetsuta Endo. Prices, ingredients and nutrition on the site are sample data, and nothing is for sale.",
      },
    ],
  },
  {
    slug: "jev-was-right-157-times",
    title: "Jev was right 157 times. The system still failed.",
    description:
      "An independent benchmark of TypeSafe AI's Jev, three days after launch. 60 support messages, three questions, two baselines — and the finding that mattered wasn't speed or price.",
    category: "ai",
    date: "2026-09-18",
    author: shogo,
    status: "published",
    cover: { icon: "claude", label: "Jev · n=60" },
    body: [
      {
        type: "paragraph",
        text: "TypeSafe AI released [Jev](https://vercel.com/ai-gateway/models/jev) on September 15. It doesn't generate text. You hand it the current state of your application and a set of typed questions, and it returns decisions — a choice, a score, a boolean — each with a probability. The company reports it runs 193.6x faster and 444.6x cheaper than an LLM on its own workflow evaluations.",
      },
      {
        type: "paragraph",
        text: "Three days later there was no independent number anywhere. I run the booking platform for a photo studio in Tokyo, and routing inbound messages is a job we still do by hand, so I built a benchmark around that and measured it myself. Code and data are in [jev-eval](https://github.com/Shogo-nfrealmusic/jev-eval).",
      },
      {
        type: "paragraph",
        text: "The speed and cost numbers turned out to be the least interesting part.",
      },
      { type: "heading", text: "The setup" },
      {
        type: "paragraph",
        text: "60 synthetic customer messages, written to match what actually arrives: English, Chinese, Korean, Japanese. 40 of them are clean — one obvious category each. The other 20 are deliberately awkward, because that is where a router earns its keep. Real customer messages were never used; they contain personal data.",
      },
      {
        type: "paragraph",
        text: "Each message gets three questions, and both models get the exact same wording:",
      },
      {
        type: "list",
        items: [
          "**category** — one of nine: reschedule, cancel, refund, location, pricing, group size, late arrival, weather, or other",
          "**urgency** — a score from 0 to 1",
          "**needs_human** — should a person look at this before we act on it?",
        ],
      },
      {
        type: "code",
        filename: "src/jev.ts",
        language: "ts",
        code: 'const result = await evaluate({\n  model: "typesafe-ai/jev",\n  state: message.text,\n  questions: QUESTIONS,\n});\n\n// No prose comes back. Just decisions and their probabilities:\n// category: { reschedule: 0.91, weather: 0.07, cancel: 0.02 }',
        caption: "Jev via the Vercel AI Gateway. The baselines use generateObject with the same QUESTIONS object.",
      },
      {
        type: "paragraph",
        text: "I labelled every message by hand first — that is the answer key. The baseline is gpt-4o-mini, with a second run against claude-sonnet-4.5 to see whether the multiplier depends on who you compare against. Calls run serially, one warm-up call is discarded, retries are off, the order alternates between models, and cost comes from the gateway's actual billed amount rather than an estimate. Main run: 60 cases, 3 rounds, 180 calls per model, zero errors.",
      },
      {
        type: "video",
        src: "/blog/jev-eval/demo.mp4",
        poster: "/blog/jev-eval/demo-poster.jpg",
        caption:
          "A replay of the measured run: 12 of the 60 messages, played back at the latencies actually recorded. Nothing is called live — the gap is what the stopwatch saw.",
      },
      { type: "heading", text: "Speed and cost, and why the multiplier is nearly meaningless" },
      {
        type: "stats",
        items: [
          { value: "379 ms", label: "Jev, median latency (p50). gpt-4o-mini: 1,209 ms" },
          { value: "$0.032", label: "Jev, per 1,000 calls. gpt-4o-mini: $0.122" },
          { value: "96.1%", label: "Jev category accuracy. gpt-4o-mini: 93.9%" },
        ],
      },
      {
        type: "paragraph",
        text: "So: 3.2x faster, 3.8x cheaper. Against Claude Sonnet 4.5 on the same 20 cases, 4.6x faster and 106x cheaper. Neither run reproduces 193.6x or 444.6x — though I don't know what baseline or workload those figures were measured against, so this isn't a contradiction so much as a different experiment.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Latency held. Cost didn't.",
        text: "Changing the baseline moved the speed multiplier from 3.2x to 4.6x, and the cost multiplier from 3.8x to 106x. A claim of the form 'Nx cheaper' that doesn't name the other model is not really a claim.",
      },
      {
        type: "image",
        src: "/blog/jev-eval/3-cost-per-1000.svg",
        alt: "Cost per 1,000 calls: Jev $0.032, gpt-4o-mini $0.122, claude-sonnet-4.5 $3.41",
        caption: "Cost per 1,000 calls, billed amounts from the gateway.",
        bare: true,
      },
      {
        type: "paragraph",
        text: "The accuracy gap is also small enough to ignore at this sample size: 96.1% against 93.9% is seven calls out of 180. On the 40 clean messages both models scored 100%. The entire difference lives in the 20 awkward ones, where Jev got 88.3% and gpt-4o-mini 81.7%.",
      },
      {
        type: "image",
        src: "/blog/jev-eval/1-category-accuracy.svg",
        alt: "Category accuracy by gold category for Jev and gpt-4o-mini",
        caption: "Category accuracy by gold category. The spread only shows up on the hard cases.",
        bare: true,
      },
      { type: "heading", text: "The number I went looking for" },
      {
        type: "paragraph",
        text: "Jev returns a probability with every answer, so you can route on confidence instead of trusting it blindly. I split all 180 calls three ways: above 0.95 auto-process, 0.70 to 0.95 double-check, below 0.70 send to a person.",
      },
      {
        type: "stats",
        items: [
          { value: "87.2%", label: "of calls cleared 0.95 and were auto-processed" },
          { value: "157 / 157", label: "of those were categorised correctly" },
          { value: "0", label: "of Jev's category mistakes landed in the auto-processed bucket" },
        ],
      },
      {
        type: "paragraph",
        text: "Every time Jev was wrong about a category, it was already unsure. It called \"what time tomorrow?\" a reschedule at 0.60–0.65 — a message that belongs in other — and that low number pushed it out of automation on its own. On the one case where two categories genuinely overlapped, the probabilities split 0.51 against 0.45 and the answer flipped between rounds. That is a model telling you the truth about its own uncertainty.",
      },
      {
        type: "paragraph",
        text: "I wrote that down as the headline. Then I checked what else was in those 157 calls.",
      },
      { type: "heading", text: "157 correct answers, 18 of them wrong" },
      {
        type: "paragraph",
        text: "157 out of 157 is a statement about **category**. It says nothing about the other two questions. Of those same 157 auto-processed calls, 49 were messages a person needed to see — and on 18 of them, Jev had also answered needs_human = false. Correctly categorised, confidently automated, and no human ever sees them.",
      },
      {
        type: "quote",
        text: "The routing was right. The system was still wrong.",
      },
      {
        type: "paragraph",
        text: "Here is one, translated from the Japanese:",
      },
      {
        type: "list",
        items: [
          "**Message** — \"My flight is cancelled because of the typhoon, so I'd like to move tomorrow's shoot to Saturday.\"",
          "**category** — reschedule, at probability 1.00. Correct.",
          "**urgency** — 0.88. Correct.",
          "**needs_human** — 0.42, so false. Wrong.",
        ],
      },
      {
        type: "paragraph",
        text: "Waiving the change fee for a typhoon is a judgement call somebody at the studio makes. Under the confidence rule this message is filed as a routine reschedule and answered automatically, and the decision never reaches a person. Nothing in the numbers looks like a failure. gpt-4o-mini, for what it's worth, got this one right on all three rounds.",
      },
      { type: "heading", text: "Why the confidence signal worked once and not twice" },
      {
        type: "paragraph",
        text: "The obvious fix is to add a second condition: auto-process only when the category is confident **and** P(needs_human) is low. I ran that sweep. The thresholds were picked after seeing the data, so treat this as a design exercise rather than a validated result.",
      },
      {
        type: "list",
        ordered: false,
        items: [
          "**X = 0.50** — same as trusting Jev's own verdict. Catches 0 of the 18.",
          "**X = 0.40** — catches 6. Auto-processing falls from 87.2% to 55.0%.",
          "**X = 0.30** — catches 12. Auto-processing falls to 29.4%.",
          "**X = 0.25** — catches all 18. Auto-processing falls to **19.4%**.",
        ],
      },
      {
        type: "paragraph",
        text: "To stop every pass-through you have to give up four-fifths of the automation, which is the same as not automating. The reason is in the numbers themselves: the missed cases sit at 0.25, 0.26, 0.27, 0.30, 0.38, 0.42, 0.48 — scattered through exactly the same range as the messages that genuinely needed no human. There is no line to draw.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "Confidence is a property of the question, not of the model",
        text: "The same model, in the same response, produced category probabilities clean enough to automate on and needs_human probabilities that separate nothing. 'It returns confidence, so we can automate safely' is a claim you have to test per output, on your own labels.",
      },
      {
        type: "paragraph",
        text: "It makes sense in hindsight. Category is in the text — \"move it to Saturday\" is a reschedule in any language. Whether a human needs to look is a policy that lives in our head: out of scope, ambiguous intent, missing information, more than one request in one message. The model isn't hedging on that. It is confidently applying a rule nobody gave it.",
      },
      { type: "heading", text: "What I'd actually do with this" },
      {
        type: "list",
        items: [
          "Use Jev for the routing itself. Sub-400ms, cheap, and the category confidence is good enough to automate the top bucket.",
          "Don't let the model decide when a human is needed. Escalation rules — refunds, weather exceptions, anything out of scope — belong in code, where they can be read and changed.",
          "Measure per question, not per model. One benchmark number would have hidden all of this.",
          "Keep a stack of deliberately awkward messages. The clean ones scored 100% for both models and taught me nothing.",
        ],
      },
      { type: "heading", text: "Limits" },
      {
        type: "paragraph",
        text: "Synthetic data, close to real traffic but not drawn from it. One person wrote the answer key, and some labels are arguable — an unsubscribe request counts as needs_human here because somebody has to forward it, which another team might score differently. n=60, so a single case moves accuracy by 1.7 points and the gap between 96.1% and 93.9% isn't a real difference. One machine, one network, one hour. Both models got identical prompts, which is fair but means the LLM was never tuned for the task. Everything — data, labels, raw responses, scripts — is in [the repo](https://github.com/Shogo-nfrealmusic/jev-eval).",
      },
      {
        type: "paragraph",
        text: "The part I'd keep if I threw out everything else: a model can be right about the question you asked and wrong about the decision you were actually making. Mine was right 157 times in a row.",
      },
    ],
  },
  {
    slug: "mercari-pm-agent-design",
    title:
      "Mercari PM agent design: automating the PM workflow with Claude Code skills and MCP",
    description:
      "An agent built on Claude Code and the Model Context Protocol that runs the chain from problem discovery through PRD drafting to UI prototyping. Published on Mercari Engineering.",
    category: "ai",
    date: "2026-04-27",
    author: shogo,
    status: "published",
    externalUrl:
      "https://engineering.mercari.com/en/blog/entry/20260427-mercari-pm-agent-design-automating-the-pm-workflow-with-claude-code-skills-and-mcp/",
    cover: { icon: "claude", label: "Mercari Engineering" },
    body: [],
  },
  {
    slug: "finding-a-39-percent-drop-off",
    title: "Only 39% got from date to time",
    description:
      "Six in ten sessions that picked a date on our booking screen never picked a time. How the step was measured, what was wrong with the measurement, what the page was doing to people, and why I still can't quote a clean after number.",
    category: "growth",
    date: "2026-09-15",
    updated: "2026-10-11",
    author: shogo,
    status: "published",
    cover: { icon: "analytics", label: "Date → Time · 39%" },
    body: [
      {
        type: "paragraph",
        text: "I run the booking platform for a photo studio in Tokyo. A customer picks a plan, a location, a date and a time, fills in three contact fields, and pays a deposit. Almost all of them do it on a phone, and Instagram, opened in its in-app browser, is the largest source.",
      },
      {
        type: "paragraph",
        text: "In the first eighteen days of August, 39% of sessions that selected a date went on to select a time. The other six in ten stopped there. That is an odd place to stop. Someone who has chosen a plan, a location and a date has already decided. This post is about how that number was produced, what turned out to be wrong with the page, and what turned out to be wrong with my own measuring.",
      },
      {
        type: "stats",
        items: [
          { value: "39%", label: "of sessions with a date selected also selected a time (Aug 1–18, GA4 sessions)" },
          { value: "40% · 1 s", label: "of a section on screen, for this long, before it counts as viewed" },
          { value: "~800 ms", label: "of scripted movement after a date tap that fought the visitor's finger" },
        ],
      },
      { type: "heading", text: "A bookings number does not say where" },
      {
        type: "paragraph",
        text: "GA4 went onto the site on June 22 and the first funnel events on July 19. For weeks the booking screen itself was a blind spot: it recorded that a date was chosen and that Pay was pressed, and nothing in between. Picking a time, the step right after the one where most people stopped, was not an event at all.",
      },
      {
        type: "paragraph",
        text: "Before adding more events I had to repair the ones I had. The inline GA4 snippet flushed my queued events before it had called config. Events sent to an unconfigured GA4 arrive with no session, no campaign and no page, so those visits were filed under \"(not set)\". Slow in-app browsers queue the most events, which meant Instagram traffic, the main source, was the worst recorded. A second gap: the checkout event fired only after every form check had passed, so a visitor who pressed Pay and was stopped by validation looked the same as one who never pressed it. I added an event for the blocked press with the reason attached.",
      },
      { type: "heading", text: "What counts as seeing something" },
      {
        type: "paragraph",
        text: "On August 8 I added six events inside the booking screen: the time list, the price summary, the contact form and the terms each report once they have been on screen, plus one for choosing a time and one for the first keystroke in the form. The whole page is in the DOM from the moment it loads, so \"rendered\" proves nothing. A section counts as viewed only when 40% of it has been visible for a full second.",
      },
      {
        type: "code",
        filename: "apps/web/src/lib/useSectionViewed.ts",
        language: "ts",
        code: `/** Enough of the section on screen to count as seen. */
const VISIBLE_RATIO = 0.4;

/** Long enough to be looking at it rather than scrolling past it. */
const DWELL_MS = 1_000;

// ...inside the hook:
const observer = new IntersectionObserver(
  (entries) => {
    const entry = entries[0];
    if (!entry) return;

    if (!entry.isIntersecting || entry.intersectionRatio < VISIBLE_RATIO) {
      // Scrolled away before the dwell elapsed: it was passed, not read.
      clear();
      return;
    }
    if (timer !== null || firedRef.current) return;

    timer = window.setTimeout(() => {
      timer = null;
      if (firedRef.current) return;
      firedRef.current = true;
      observer.disconnect();
      trackAnalyticsEvent(eventName, {
        flow: 'standard_booking',
        ...(parametersRef.current ?? {}),
      });
    }, DWELL_MS);
  },
  { threshold: [VISIBLE_RATIO] },
);`,
        caption: "Trimmed from the hook. Each event fires once per mount.",
      },
      {
        type: "paragraph",
        text: "On these events, parameters are buckets, never raw values. The time-list event carries how many slots the chosen date had open as one of five bands (zero, one, two to three, four to eight, nine or more). The summary event carries a price band. A raw date or amount registered as a GA4 dimension has too many distinct values to group by. No field contents are sent at all; the form event says which field was touched first, not what was typed.",
      },
      { type: "heading", text: "Likely cause one: the page took the scroll away" },
      {
        type: "paragraph",
        text: "One thing the new events showed was that about half of the sessions that chose a date never dwelt on the time list. They did not look at the times and reject them. They never properly saw them.",
      },
      {
        type: "paragraph",
        text: "Reading my own code explained it. On a phone, tapping a date started a sequence: a pause, the calendar folding away, then a scroll to the time list. The three timing constants are 280, 300 and 220 ms. Nothing cancelled it. If the visitor put a finger on the screen during those 800 ms, the page dragged itself back to where the script wanted it. The fix is small. Any deliberate input ends the animation.",
      },
      {
        type: "code",
        filename: "apps/web/src/app/booking/[id]/page.tsx",
        language: "ts",
        code: `function takeOverOnUserInput() {
  releaseViewportAnimationHandoff();
  const stop = () => cancelViewportAnimation();
  // \`touchstart\` fires before the scroll it causes, so the animation is gone
  // by the time the page would have fought it.
  const events: Array<keyof WindowEventMap> = ['touchstart', 'wheel', 'keydown'];
  for (const name of events) {
    window.addEventListener(name, stop, { passive: true });
  }
  viewportHandoffRef.current = () => {
    for (const name of events) window.removeEventListener(name, stop);
  };
}`,
        caption: "Called when the scripted scroll starts. The animation is an offer to move the page, not a claim on it.",
      },
      {
        type: "paragraph",
        text: "The same commit fixed a second thing. Sessions run from 12:00 to 22:00 Tokyo time, and nothing said so until a date had been picked and the times appeared. Anyone planning a morning shoot went through plan, location and date before finding out. The calendar now states the hours above the dates.",
      },
      { type: "heading", text: "Likely cause two: one long page" },
      {
        type: "paragraph",
        text: "My first guess for the rest was availability: people open a date, see few times, and leave. The slot-count bucket killed that guess. In the days measured, every visit that viewed the time list, 87 of 87, was looking at a date with nine or more slots open. 37 of them chose nothing. Nothing was full.",
      },
      {
        type: "paragraph",
        text: "What the page did was let people slide past the thing they were meant to do next. Date, time, price, contact fields and terms all sat in one column. So on August 18 the screen became three steps: date and time, then contact details, then review and pay. Three decisions in that change mattered more than the split itself.",
      },
      {
        type: "list",
        items: [
          "**One URL, not three routes.** Every screen change in this funnel was already costing between a third and a half of the people standing at it, and many of them are in an in-app browser. The steps switch what is shown; the page does not navigate.",
          "**The button is never disabled for a missing field.** A greyed-out button is a tap that does nothing. Pressing it with something missing scrolls to the missing thing and records the same blocked-press reason as before, so that measure stayed comparable across the rewrite.",
          "**Back means one step back.** Each forward move pushes a history entry, merged into the router's own state, so the phone's back gesture returns to the previous step instead of leaving the booking.",
        ],
      },
      { type: "heading", text: "Replay, and the check that lied" },
      {
        type: "paragraph",
        text: "GA4 says where sessions stop. It cannot show a finger fighting a scroll. I added Microsoft Clarity for session recordings, with the name, email and phone fields and the section around them masked, and recording switched off entirely on the deposit result pages.",
      },
      {
        type: "paragraph",
        text: "It took three deploys to record anything. First the site's Content-Security-Policy refused to run the script. Clarity needs two hosts allowed, one for the per-project bootstrap and one for the library it loads. Then, with the policy opened, the bootstrap threw on its first line. I had mounted the tag with the id \"clarity\". An element with an id becomes a property of window, so window.clarity was already the script element when Clarity tried to define it as a function.",
      },
      {
        type: "callout",
        title: "My verification was the bug",
        text: "I had checked the install by evaluating typeof window.clarity and getting \"object\". That was the script tag answering for itself. The check passed on a recorder that had never run. Since then I confirm a measurement tool by the data arriving, not by the tag being present.",
      },
      {
        type: "paragraph",
        text: "The recordings were more useful for a different step than the one I installed them for. They showed visitors tapping plan cards on the plans screen, often several times, where only a small text link was clickable. Clarity counted dead clicks in 15.79% of sessions. The card is now tappable, with a 10-pixel threshold to tell a tap from a swipe, because that carousel moves by CSS transform and the browser fires a click at the end of every swipe.",
      },
      { type: "heading", text: "What I got wrong" },
      {
        type: "list",
        items: [
          "**I predicted the wrong blocker.** I expected \"no time selected\" to be the main reason a button press was refused. In August the main reason was an empty name field: it stopped 103 of the 241 who pressed the button.",
          "**A fix for that made it worse.** On August 27 the details step started opening with the cursor in the name field. On a phone that raised the keyboard, and the first tap elsewhere blurred an empty field and printed a red error before anything was typed. 33 visitors saw that error in five days and only 19 of them had typed a name. I removed the autofocus a month later.",
          "**I judged a change with the instrument I had just changed.** On September 6 an ordered funnel went in next to the loose one. Its numbers dropped over the next two days and I suspected the deploy had broken checkout. The answer came from a system the deploy had not touched: booking notifications showed bookings still arriving, with the dip confined to one day.",
        ],
      },
      {
        type: "code",
        filename: "apps/web/src/lib/bookingFunnel.ts",
        language: "ts",
        code: `export const BOOKING_FUNNEL_MAX_IDLE_MS = 30 * 60 * 1_000;

const checkoutStages: BookingFunnelStage[] = [
  'booking_view',
  'date_selected',
  'time_selected',
  'details_completed',
  'review_completed',
  'pay_clicked',
  'stripe_redirected',
  'booking_completed',
];

function canAdvance(stages: BookingFunnelStage[], currentIndex: number, stage: BookingFunnelStage) {
  return stages[currentIndex + 1] === stage;
}

export function trackBookingFunnelStep(
  stage: BookingFunnelStage,
  contextOrNow: number | BookingFunnelContext = {},
): boolean {
  try {
    return trackBookingFunnelStepUnguarded(stage, contextOrNow);
  } catch {
    return false;
  }
}`,
        caption: "Trimmed from the ordered funnel. A stage is emitted only if it is the next one in order, in the same tab, with no gap over 30 minutes.",
      },
      {
        type: "paragraph",
        text: "The try/catch is from that scare. Two of the tracker's calls sit directly in front of the action they describe, one before the booking request and one before checkout is created. Nothing in it was known to throw. The guard is there so that telemetry can never be the reason a payment does not start.",
      },
      { type: "heading", text: "What the 39% does and does not show" },
      {
        type: "list",
        items: [
          "It counts GA4 sessions, not people. One person on two visits is two sessions.",
          "It compares two event counts. GA4 does not keep the order of events inside a session, so it shows where the volume falls, not a strict path. The ordered funnel exists because of this, and it only starts on September 6.",
          "The time-selected event shipped on August 8. The baseline window in my own decision note is August 1–18. If the date count covered the first week and the time count could not, the real pass rate was higher than 39%. GA4's event-level retention was still at its two-month default until October 3, so the detail from before August 2 is gone and the window cannot be rebuilt in full.",
          "There is no clean after number. The three-step screen shipped on August 18 and a price cut on August 19. In my experiment ledger the verdict on the three-step change is \"cannot be separated\". Later data points to the weakest step having moved one place along, to between choosing a time and finishing the contact details.",
          "Staff sessions are excluded by a URL flag, and since October 6 only the production host is measured at all. Before that, a local dev server sent its visits into the real property. How much got in is unknown.",
        ],
      },
      {
        type: "paragraph",
        text: "What I would keep from this: instrument the inside of the screen, not only its edges. Define \"saw it\" in a way a fast scroll cannot satisfy. Verify a measurement tool by its data. Change one thing at a time in one place, or accept that the result will be unreadable. And when the measuring changes, check the outcome somewhere the change did not reach.",
      },
    ],
  },
  {
    slug: "deposits-for-inbound-travelers",
    title: "A 30% deposit, a held slot, and a webhook that decides",
    description:
      "How a booking platform for travelers takes a deposit before the shoot and the balance after it: holds, two Stripe Checkout Sessions, an idempotent webhook, refunds across two Stripe accounts, and the parts that are still done by hand.",
    category: "engineering",
    date: "2026-09-15",
    updated: "2026-10-11",
    author: shogo,
    status: "published",
    cover: { icon: "stripe", label: "30% deposit" },
    body: [
      {
        type: "paragraph",
        text: "The booking platform I built for a Tokyo photo studio has to let someone in another country reserve a photographer's time and pay for it before they have met anyone from the studio. Charging everything up front asks a lot of a stranger. Charging nothing leaves the studio holding a slot for someone who may not come. So the customer pays 30% when they book and the rest after the shoot.",
      },
      {
        type: "paragraph",
        text: "The arithmetic is one line. The work is keeping three things in agreement: whether the time slot is taken, whether the money arrived, and what the booking record says. This is how that is done, in Go and PostgreSQL, with Stripe Checkout.",
      },
      {
        type: "stats",
        items: [
          { value: "$19.9k", label: "best month in revenue (Stripe, studio total)" },
          { value: "754", label: "transactions, Jan 1 – Sep 13, 2026" },
          { value: "20+", label: "countries customers book from" },
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "What those numbers cover",
        text: "They are totals for the studio's Stripe account. The system described here replaced an older booking site at the end of June 2026, so the January to September count spans both. They show the volume the payment design has to carry, not what this code alone processed.",
      },
      { type: "heading", text: "Three records, and who may change them" },
      {
        type: "list",
        items: [
          "**A hold** is a temporary claim on a time. It is active, booked, expired or cancelled.",
          "**A booking** exists only after money has arrived. It is confirmed, completed or cancelled. Nothing else.",
          "**A payment** is a deposit or a remaining payment, and is pending, paid or cancelled. Unique indexes allow one of each type per booking.",
        ],
      },
      {
        type: "paragraph",
        text: "The rule that holds the design together: the browser never moves a record forward. A paid Stripe event does. The success page the customer lands on only polls the API, up to twenty times a few seconds apart, until the webhook has done its work.",
      },
      { type: "heading", text: "Pressing Pay" },
      {
        type: "paragraph",
        text: "The browser sends a plan, a location, a time window and contact details. It never sends a price. The API reads the plan and location prices, adds extra guests and express delivery, applies a discount code if there is one, and computes the deposit. Then one SQL function creates the hold. It locks the availability window row, counts what already overlaps the requested time, and refuses if the window's capacity (two by default) is used up. A shoot occupies its own time plus a thirty-minute buffer on each side.",
      },
      {
        type: "code",
        filename: "database/migrations/000055_staff_hold_any_deposit.up.sql",
        language: "sql",
        code: `  IF p_subtotal_amount_cents <= 0
    OR p_discount_amount_cents < 0
    OR p_total_amount_cents <= 0
    OR p_subtotal_amount_cents - p_discount_amount_cents <> p_total_amount_cents
    -- ...
    -- customer holds (condition trimmed)
    OR p_deposit_amount_cents <> (p_total_amount_cents * 30 / 100)
  THEN
    RAISE EXCEPTION 'invalid_booking_amounts';
  END IF;

  -- ...
  v_occupied_start_at := p_requested_start_at - interval '30 minutes';
  v_occupied_end_at := p_requested_end_at + interval '30 minutes';

  SELECT count(*)::integer INTO v_current_count
  FROM (
    SELECT id FROM booking_holds
    WHERE availability_window_id = p_availability_window_id
      AND status = 'active' AND expires_at > now()
      AND occupied_start_at < v_occupied_end_at AND occupied_end_at > v_occupied_start_at
    UNION ALL
    SELECT id FROM bookings
    WHERE availability_window_id = p_availability_window_id
      AND status IN ('confirmed', 'completed')
      AND occupied_start_at < v_occupied_end_at AND occupied_end_at > v_occupied_start_at
  ) occupied;
  IF v_current_count >= v_window.capacity THEN RAISE EXCEPTION 'availability_window_full'; END IF;`,
        caption: "Trimmed from the hold function. The 30% is computed in Go and checked again here, so a hold created from the site cannot store a deposit that disagrees with the total. Bookings that staff enter by hand are exempt.",
      },
      {
        type: "paragraph",
        text: "Active holds count against capacity exactly like bookings, which is the point: two people cannot both be sent to Stripe for the last slot. The cost is that an abandoned checkout blocks a real customer until the hold expires, so the expiry time matters.",
      },
      { type: "heading", text: "The bug that set the expiry rules" },
      {
        type: "paragraph",
        text: "In the older design a hold lasted thirty minutes and the Stripe page stayed open for about a day. A few customers came back after the hold had lapsed, paid on the still-open page, and paid for a time that was no longer theirs. The confirming function refuses an expired hold, so the money arrived and no booking was created.",
      },
      {
        type: "paragraph",
        text: "The fix was to make the two clocks one clock. Opening checkout pushes the hold to a full hour from now, and Stripe is told to close its page five minutes before that.",
      },
      {
        type: "code",
        filename: "services/api/internal/payment/checkout.go",
        language: "go",
        code: `	// Pressing Pay restarts the clock: a full hour from now, however much of
	// the original hold was left. Stripe's page is told to close five minutes
	// before that, so the two can never disagree about whether the time is
	// still for sale.
	holdExpiresAt := time.Now().UTC().Add(checkoutHoldDuration)
	if err := s.db.Pool().QueryRow(ctx, \`
		UPDATE booking_holds
		SET expires_at = GREATEST(expires_at, $2::timestamptz)
		WHERE id = $1::uuid AND status = 'active'
		RETURNING expires_at
	\`, bookingHoldID, holdExpiresAt).Scan(&holdExpiresAt); err != nil {
		return CheckoutResult{}, err
	}
	sessionExpiresAt := holdExpiresAt.Add(-checkoutExpiryMargin)

	params := &stripe.CheckoutSessionCreateParams{
		Mode:      stripe.String(string(stripe.CheckoutSessionModePayment)),
		ExpiresAt: stripe.Int64(sessionExpiresAt.Unix()),
		// ...
		Metadata: map[string]string{
			"booking_hold_id": bookingHoldID,
			"payment_type":    "deposit",
		},
	}`,
        caption: "Trimmed. checkoutHoldDuration is 60 minutes and checkoutExpiryMargin is 5.",
      },
      {
        type: "paragraph",
        text: "The session is a one-off payment with the amount passed inline, so there are no Stripe products or prices to keep in sync with the database. The hold ID and the payment type go into the metadata of both the session and its payment intent. Thirty minutes after checkout opens, if the hold is still unpaid, the customer gets one email with the same link. It is withdrawn the moment the deposit lands.",
      },
      { type: "heading", text: "The webhook" },
      {
        type: "paragraph",
        text: "Stripe delivers an event when a session completes, and it may deliver the same event more than once. The handler verifies the signature, then writes the event down before doing anything else.",
      },
      {
        type: "code",
        filename: "services/api/internal/payment/webhook.go",
        language: "go",
        code: `func (s Service) recordWebhookEvent(ctx context.Context, event stripe.Event, payload []byte, stripeAccountID string) (bool, error) {
	var shouldProcess bool
	err := s.db.Pool().QueryRow(ctx, \`
		INSERT INTO webhook_events (provider, provider_event_id, event_type, payload, processed, stripe_account_id)
		VALUES ('stripe', $1::text, $2::text, $3::jsonb, false, $4::text)
		ON CONFLICT (provider, provider_event_id)
		DO UPDATE SET
			event_type = EXCLUDED.event_type,
			payload = EXCLUDED.payload,
			stripe_account_id = EXCLUDED.stripe_account_id
		WHERE webhook_events.processed = false
		RETURNING true
	\`, event.ID, string(event.Type), payload, stripeAccountID).Scan(&shouldProcess)
	if err != nil {
		// ...
		if errors.Is(err, pgx.ErrNoRows) {
			return false, nil
		}
		return false, err
	}

	return shouldProcess, nil
}`,
        caption: "An event already marked processed returns no row and is skipped. One that failed earlier is taken again.",
      },
      {
        type: "paragraph",
        text: "That table is the first layer of idempotency, and it is deliberately not the only one. It lets a failed event be retried, which means two deliveries of an unprocessed event can both get through. So every step behind it is safe to repeat. The function that turns a hold into a booking locks the hold row and, if the hold is already booked, returns the existing booking. The balance update only touches a payment that is not yet paid. Every notification insert is guarded by a NOT EXISTS on the same booking and subject.",
      },
      {
        type: "paragraph",
        text: "For a deposit, one database function inserts the booking, marks the hold booked and marks the payment paid, in a single transaction. Then the handler queues the confirmation email, a reminder for 24 hours before the shoot, and staff alerts by push and Slack, and writes the booking to a shared Google Calendar. A calendar failure is logged and recorded on the booking, and a worker retries it. It never fails the payment.",
      },
      {
        type: "paragraph",
        text: "If any required step fails, the event is stored as failed with the reason and the endpoint answers with an error, so Stripe sends it again. A worker runs every five minutes. An event still unprocessed after five minutes becomes a push notification to owners and managers and a Slack message. That alert is the safety net for the worst case in this design: money taken, booking not created.",
      },
      { type: "heading", text: "The balance, after the shoot" },
      {
        type: "paragraph",
        text: "The balance is not charged automatically and no card is stored. When the assigned photographer (or an owner or manager) taps \"Shoot done\" in the staff app, the API creates a second Checkout Session for the total minus the paid deposit, and emails the customer the link. The email says the balance is the one step left before the photos are delivered. When that payment's webhook arrives, the payment is marked paid and the booking becomes completed. Nobody sets that status by hand, except for a booking that was already paid in full before the shoot.",
      },
      {
        type: "paragraph",
        text: "Staff can add guests to a booking before the shoot, which changes the total. That races with creating the balance link. So the link is created first, then the booking row is locked and its total compared with the one the link was built from. If it changed, the session is expired at Stripe and staff are asked to try again.",
      },
      {
        type: "paragraph",
        text: "Two separate payments cost the customer a second checkout. They also kept a later change simple. On October 1 the studio moved from a sole-proprietor Stripe account to a corporate one. Because the balance is a fresh session, a booking whose deposit went to the old account can pay its balance to the new one.",
      },
      { type: "heading", text: "Two Stripe accounts at once" },
      {
        type: "paragraph",
        text: "Every payment row records which account took it. New sessions go to whichever account a cutover timestamp says is current. Each account posts to its own webhook endpoint with its own signing secret, so an event signed by one account cannot be processed as the other's. If an unpaid balance link exists on the old account, it is expired before a new one is made. If that old session turns out to be already paid, with its webhook still on the way, the API refuses to create a second link rather than risk charging twice.",
      },
      { type: "heading", text: "Cancellations, refunds, failures, disputes" },
      {
        type: "list",
        items: [
          "**Customer cancels.** The deposit is not refunded and the balance is never charged. That is the stated policy, and the default in code is no refund.",
          "**Studio cancels** (weather, safety, photographer). An owner chooses deposit only or everything paid. Managers can cancel but cannot refund. Photographers can do neither.",
          "**Refund mechanics.** The booking is marked cancelled with the refund pending, and committed, before Stripe is called. If Stripe fails, the booking stays cancelled, the refund is marked failed, and the same action can be retried.",
          "**Refund made in the Stripe Dashboard instead.** The refund event comes back through the webhook, finds the payment by its payment intent, cancels the booking and frees the slot.",
          "**Card declined.** No completed event is sent, so no booking exists. The hold expires and the time goes back on sale.",
          "**Disputes.** There is no dispute handling in the code. A dispute event is recorded and acknowledged without action, so a dispute is answered by hand in Stripe.",
        ],
      },
      {
        type: "code",
        filename: "services/api/internal/payment/cancellation.go",
        language: "go",
        code: `		// A refund can only come from the account that took the payment. A
		// booking whose deposit went to the old account and remaining fee to
		// the new one is refunded from both.
		account, err := s.accounts.ByID(payment.AccountID)
		if err != nil || !account.HasKey() {
			failedPaymentIDs[payment.ID] = true
			// ...
			continue
		}
		params := &stripe.RefundCreateParams{
			PaymentIntent: stripe.String(payment.PaymentIntentID),
			Amount:        stripe.Int64(refundableAmount),
			// ...
		}
		params.SetIdempotencyKey(fmt.Sprintf("booking_refund_%s_%s_%s", bookingID, payment.ID, refundPolicy))

		stripeRefund, err := s.createRefund(ctx, account, params)
		if err != nil {
			failedPaymentIDs[payment.ID] = true
			refundErrors = append(refundErrors, fmt.Sprintf("%s refund failed: %v", payment.PaymentType, err))
			continue
		}`,
        caption: "Trimmed from the refund loop. The idempotency key makes a retried refund the same refund, not a second one.",
      },
      { type: "heading", text: "Currency" },
      {
        type: "paragraph",
        text: "Everything is priced in US dollars, and every Checkout Session is created in US dollars, whatever country the customer is in. The currency is a constant in the booking service, not a setting, and it is copied onto every hold, booking and payment row. There is no per-country pricing and no currency selector. The studio is paid out in yen, so the revenue dashboard reads Stripe's settled yen amounts.",
      },
      { type: "heading", text: "How it is tested, and what is missing" },
      {
        type: "paragraph",
        text: "The payment package has integration tests that run against a real PostgreSQL and a fake Stripe server: a deposit confirming a booking, a duplicate session not duplicating notifications, a failed event being handled when it is sent again, a wrong signature, refunds that fail halfway. CI fails if coverage of that package drops below 80%. A browser test books a shoot end to end and stops at the handoff to Stripe.",
      },
      {
        type: "list",
        items: [
          "Disputes are manual, as above.",
          "Inside Stripe, a deposit carries the hold ID and a balance payment carries the booking ID. The two cannot be matched there without the database. That makes reconciliation harder than it should be.",
          "The webhook alert exists, but there are no infrastructure alarms on the API itself yet.",
          "The 30% is integer division on cents, so it rounds down by less than a cent. The balance is always total minus what was actually paid, which absorbs it.",
        ],
      },
      {
        type: "paragraph",
        text: "The decision I would make again first is the smallest one: the browser reports nothing. Every state change that involves money starts from a signed event and passes through steps that can be run twice. The expiry bug was what happened at the edge of that rule, where a second clock disagreed with mine.",
      },
    ],
  },
  {
    slug: "share-count-not-follower-count",
    title: "Share count, not follower count",
    description:
      "My first analysis of 13 months of my own Instagram data produced a confident, wrong story, because it compared reels measured at different ages. This is the measurement system I built to fix that, what survived, and what one account can and cannot tell you.",
    category: "growth",
    date: "2026-09-15",
    updated: "2026-10-11",
    author: shogo,
    status: "published",
    cover: { icon: "instagram", label: "13 months of data" },
    body: [
      {
        type: "paragraph",
        text: "I grew a personal account on Instagram, [@imshogo.k](https://www.instagram.com/imshogo.k/), from zero to 30,000 followers in motivation, fitness and self-growth. Several reels passed a million views. In the summer of 2026 a normal reel was reaching fewer people than it had a year earlier, when the account was a tenth of the size. I wanted to know why, with numbers rather than a feeling.",
      },
      {
        type: "paragraph",
        text: "The first analysis gave me a clean answer. It was wrong, and the reason it was wrong is the most useful thing in this post.",
      },
      {
        type: "stats",
        items: [
          { value: "335", label: "reels in 13 monthly cohorts, August 2025 to August 2026" },
          { value: "8", label: "fixed ages at which every reel is now measured" },
          { value: "27 days", label: "until a reel stops gaining reach, measured on this account" },
        ],
      },
      { type: "heading", text: "Where the data comes from" },
      {
        type: "paragraph",
        text: "The Instagram app shows insights per post, but there is no export and no history. The official API has the same gap: it returns the current cumulative value of each metric and nothing about how it got there. A reading you did not take is gone.",
      },
      {
        type: "paragraph",
        text: "So I built a small private dashboard: Next.js on Vercel, Postgres on Supabase, and Meta's official Instagram API (Graph API v25.0) behind an OAuth login. No scraping and no password login. An hourly cron job lists recent media, decides which ones are due for a reading, and stores each reading as one row with its capture time and the metrics as JSON. For reels that is views, reach, likes, comments, shares, saves, reposts and watch time. There is no per-reel follow count in the API, so the dashboard shows that as unavailable instead of inventing it.",
      },
      {
        type: "paragraph",
        text: "Requests run one at a time under three fixed caps: 100 per run, 150 per hour, 1,000 per day. Meta's own allowance scales with the account's impressions, so it shrinks exactly when the account is doing badly; my caps do not depend on it. A 5xx response is retried twice with backoff. A rate-limit response stops the run.",
      },
      { type: "heading", text: "The first answer, and why it was wrong" },
      {
        type: "paragraph",
        text: "On August 24 I grouped reels by month and compared medians. The story wrote itself: median reach down from above 10,000 to 1,366, the best reel of the month down by a factor of 300, and no reel above 10,000 reach since July 4.",
      },
      {
        type: "paragraph",
        text: "Then I tried to measure how fast a reel grows, and the query returned zero rows. No reel had both an early reading and a late one. The back catalogue had been read once, between 27 and 358 days after posting. New reels were read only during their first eight days. I had been comparing 313 days of accumulation against four and calling the difference a decline.",
      },
      {
        type: "code",
        filename: "lib/meta/snapshot.ts",
        language: "ts",
        code: `/**
 * A reel keeps accumulating reach for weeks. That means a raw reach number is
 * meaningless without the age it was taken at: 674,894 measured at 101 days
 * and 2,237 measured at 4 days are not two data points on a trend, they are
 * two different questions.
 */
export const MILESTONES: readonly Milestone[] = [
  { label: "1h", from: 0, to: 3 * HOUR },
  { label: "6h", from: 3 * HOUR, to: 15 * HOUR },
  { label: "24h", from: 15 * HOUR, to: 48 * HOUR },
  { label: "72h", from: 48 * HOUR, to: 120 * HOUR },
  { label: "7d", from: 120 * HOUR, to: 14 * DAY },
  { label: "30d", from: 14 * DAY, to: 60 * DAY },
  { label: "90d", from: 60 * DAY, to: 180 * DAY },
  // Past six months a reel is done moving. One reading, so the whole back
  // catalogue has a comparable "this is where it finished" number.
  { label: "final", from: 180 * DAY, to: Number.POSITIVE_INFINITY },
];`,
        caption:
          "Trimmed: the file's header comment (first sentences) is shown directly above the constant, which sits further down the file. Windows are in hours and do not overlap. They are wide because the cron is hourly and a run can be cut short by the budget; a window that is missed cannot be recovered.",
      },
      { type: "heading", text: "Fixing the measurement before the analysis" },
      {
        type: "paragraph",
        text: "The old planner read recent reels often and re-read anything stale every few days, which produced readings at arbitrary ages and re-read the archive forever. I replaced both rules with one: a reel is due when it sits inside a milestone window it has no reading for. Every reel now lands on the same set of ages. A reel costs at most nine requests in its lifetime (the first reading plus eight milestones), and a test walks two years of hourly runs to pin that. When the budget cuts a run short, targets are ordered by how soon their window closes, so a reading that can wait a month never displaces one that exists for three hours.",
      },
      {
        type: "paragraph",
        text: "I then re-read every reel on the same day and measured the growth curve directly. Between day 1.3 and day 21.3 reach grew 3.19 times (26 reels). Between day 26.9 and day 56.4 it grew 1.01 times (23 reels). Between day 320 and day 349, 1.00 times (482 reels). On this account a reel is finished after about 27 days. Months older than that can be compared with each other. August 2026, at 11 days, could not be judged at all.",
      },
      {
        type: "code",
        filename: "supabase/migrations/0012_sync_diagnostics.sql",
        language: "sql",
        code: `create or replace view public.reel_day7 as
select distinct on (m.id)
  m.id                                   as media_id,
  m.posted_at,
  s.captured_at,
  round((extract(epoch from (s.captured_at - m.posted_at)) / 86400)::numeric, 2)
                                         as measured_at_days,
  (s.metrics->>'reach')::numeric         as reach,
  (s.metrics->>'shares')::numeric        as shares,
  (s.metrics->>'ig_reels_avg_watch_time')::numeric / 1000 as watch_seconds
from public.instagram_media m
join public.media_insight_snapshots s on s.media_id = m.id
where m.raw_metadata->>'media_product_type' = 'REELS'
  and m.posted_at is not null
  -- Only readings near the seven-day mark qualify. A reel measured at four
  -- days has not finished; one measured at ninety is a different question.
  and extract(epoch from (s.captured_at - m.posted_at)) / 86400 between 4 and 14
order by
  m.id,
  abs(extract(epoch from (s.captured_at - m.posted_at)) / 86400 - 7);`,
        caption:
          "The comparable series: one reading per reel, the one closest to day seven. Trimmed; the full view also exposes views, saves, comments, likes, caption and permalink. A reel with no reading in the band is left out, not substituted.",
      },
      { type: "heading", text: "What survived" },
      {
        type: "paragraph",
        text: "With every month read at 39 days or older (analysis date August 25, 2026, source Meta Graph API), the monthly picture looked like this. Reach is the median per reel. A breakout is a reel above 10,000 reach.",
      },
      {
        type: "list",
        items: [
          "August 2025: 34 reels, median reach 3,421, 45.4 shares per reel, 3% breakouts",
          "September 2025: 28 reels, median reach 10,564, 8,677 shares per reel, 57% breakouts",
          "November 2025: 30 reels, median reach 15,243, 3,911 shares per reel, 63% breakouts",
          "March 2026: 21 reels, median reach 5,935, 3,554 shares per reel, 38% breakouts",
          "May 2026: 26 reels, median reach 4,063, 366 shares per reel, 27% breakouts",
          "July 2026: 21 reels, median reach 1,700, 15.9 shares per reel, 5% breakouts",
        ],
      },
      {
        type: "paragraph",
        text: "The decline was real, but its shape was different from the first story. From March to July, shares per reel went 3,554, 987, 366, 122, 15.9. Each month kept between 13% and 37% of the month before. That is a slope, not a cliff, and nothing happened on July 4. The 300-times collapse was gone.",
      },
      {
        type: "paragraph",
        text: "Three findings held up on comparable data:",
      },
      {
        type: "list",
        items: [
          "**Followers did not raise the floor.** In August 2025 the account had about 3,000 followers and a non-breakout reel reached 3,397 people. In July 2026 it had about 28,600 followers and a non-breakout reel reached 1,694 (checked August 25, 2026). Reach had always come from recommendation, not from the follower list",
          "**Shares tracked reach; watch time did not.** Across 20 reels from August 2026, all read at 0 to 5 days old, share count correlated with reach at r = 0.57 and average watch time at r = 0.25",
          "**Shares moved first.** In weekly cohorts all read at day five, shares per reel jumped in the week of August 17 (4.7 to 33.7) while median reach stayed flat. Reach moved two weeks later (3,934 in the week of August 31, 14,276 the week after). The follower count, which had fallen for most of August, bottomed at 28,335 on September 2 and was 30,212 on September 18",
        ],
      },
      {
        type: "code",
        filename: "lib/report.ts",
        language: "ts",
        code: `/** Days after posting at which a reel has stopped accumulating. */
export const MATURE_DAYS = 27;
/** Reach above which a reel counts as having broken out. */
export const BREAKOUT_REACH = 10_000;

// inside monthlyRollup(), for each month's reels:
      const ages = list.map(
        (r) =>
          (new Date(r.capturedAt).getTime() - new Date(r.postedAt).getTime()) /
          86_400_000
      );
      const meanAge = ages.reduce((s, v) => s + v, 0) / ages.length;
      return {
        month,
        reels: list.length,
        measuredAtDays: round(meanAge),
        mature: meanAge >= MATURE_DAYS,
        medianReach: round(median(numbers(list.map((r) => r.reach)))),
        sharesPerReel: round(total(list.map((r) => r.shares)) / list.length, 1),
        breakouts: list.filter((r) => (r.reach ?? 0) > BREAKOUT_REACH).length,
      };`,
        caption:
          "Every month carries the age it was read at and a mature flag. An unfinished month is still reported, but labelled, so it cannot be silently compared with a finished one.",
      },
      { type: "heading", text: "The checks" },
      {
        type: "list",
        items: [
          "**Mixed time windows.** Every number travels with the age it was read at. Reach comparisons use the day-seven view or mature months only",
          "**Rates that rise because the denominator shrank.** In June 2026 the share rate was 0.88% of reach, the best in twelve months, which looked like good news. In absolute terms it was about 23 shares per ordinary reel, the same as a year earlier, and July fell to about 6.6. I track the count, not the rate",
          "**Mean against median.** Shares per reel is a mean and reach is a median. One reel with a lot of shares can lift the mean while the median reach is decided by the other five. That would produce the same \"shares moved first\" table without shares leading anything. The check is the weekly median of shares. I have not run it yet, so I treat the lead as an observation, not a rule",
          "**Small samples.** Tag comparisons show no aggregate below three reels, and the top-against-bottom comparison prints the average age of each half",
          "**Looking only at winners.** Nine of the top 15 reels from the strong months (September 2025 to February 2026) mentioned the season or the calendar, against two of the bottom 15. I wrote a strategy around that. Then I looked at the losers: five calendar reels from the weak months reached between 1,524 and 39,102, and of the 16 reels that broke out between April and July only one mentioned the calendar. The hypothesis was dead",
          "**Explaining with the columns I happen to have.** Two reels with nearly the same caption reached 2,240 and 26,077. What decides a reel is in the video: the first two seconds, the audio, the drop-off curve. None of that is in my database",
          "**A second reader.** Each conclusion was reviewed by a separate Claude session that had not produced it. Four times I proposed that something happened on a specific date. Four times no such date existed",
        ],
      },
      { type: "heading", text: "What broke while running it" },
      {
        type: "list",
        items: [
          "For a month every sync run reported success with 100 media and zero insights. Nothing was being measured and nothing said so. Runs now count the targets that were due and the ones Meta answered with nothing, and an empty answer downgrades the run to partial",
          "Five reels from December 2024 return no insights at all. They sat in the one window that never closes and were asked again every hour: 360 requests a day, a third of the daily cap. I recorded the failed attempt as the reading, but only for that last window. A September feed post then did the same inside the 30-day window and turned all 24 daily runs partial, which made the status useless again. The rule now covers every window open longer than a day",
          "The hourly sync has to stay on when nobody is looking. The follower turning point on September 2 is only known because something wrote the number down every hour through August",
        ],
      },
      { type: "heading", text: "Limits" },
      {
        type: "paragraph",
        text: "This is one account, observed, with no control group. A correlation of 0.57 on 20 reels explains about a third of the variance and says nothing about direction. Those 20 reels were between 0 and 5 days old, not at one fixed age, and shares and reach both grow with age. The jump in shares and reach in September coincided with reels announcing a seasonal challenge that my audience takes part in, in 2025 and again in 2026. The same cause could have moved both numbers at different speeds. Two Septembers is two observations.",
      },
      {
        type: "paragraph",
        text: "I used to write that share count is the only reliable leading indicator of reach. What the data supports is narrower: on this account, absolute shares are the best early signal I have, and follower count did not predict reach.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "What changed",
        text: "I compare reels only at the same age. I read absolute shares per reel first, reach second, and followers as a running total, not a goal. And I check the measurement before I believe the analysis.",
      },
      { type: "heading", text: "Why this is on a developer's portfolio" },
      {
        type: "paragraph",
        text: "Most developers can build a product but can't get anyone to see it. Most creators can get attention but can't build anything. I do both, and I measure both. The habit is the same on either side: make sure the two things you are comparing were measured the same way. In a booking funnel that meant an event on every step. Here it meant a fixed age on every reading.",
      },
    ],
  },
  {
    slug: "ten-videos-every-morning",
    title: "Everything that broke in an unattended video pipeline",
    description:
      "The pipeline that renders ten videos a night for our studio has failed in six different ways since September. None of them raised an error I would have seen. This is each failure, its cause, and the fix that is in the code now.",
    category: "ai",
    date: "2026-09-15",
    updated: "2026-10-11",
    author: shogo,
    status: "published",
    cover: { icon: "video", label: "10 videos / morning" },
    body: [
      {
        type: "paragraph",
        text: "Since early September 2026 a scheduled job on a Mac has rendered ten short videos a night for Tetty's Photo Studio, and since September 23 it has also scheduled three of them to TikTok. [How it picks and cuts the footage is a separate post](/blog/ten-videos-before-i-wake-up). This one is about running it.",
      },
      {
        type: "paragraph",
        text: "The reason to automate a daily task is that nobody has to look at it. That is also the risk. When a person skips a day, they know. When a midnight job skips a day, the only evidence is a folder that is emptier than it should be. Every failure below was silent in that way.",
      },
      {
        type: "stats",
        items: [
          { value: "2", label: "nights that produced zero videos before the cause was fixed" },
          { value: "0 of 236", label: "posted reels the results tracker had linked to a generated file when I first checked" },
          { value: "38 of 116", label: "retouched photos that were ever eligible, because of a date filter" },
        ],
      },
      { type: "heading", text: "1. A file that existed and could not be played" },
      {
        type: "paragraph",
        text: "The source footage and the output folder both live on a shared Google Drive, mounted on the Mac. At first FFmpeg wrote the finished video straight into the Drive folder. On September 24 the batch finished normally, the posting step opened one of the new files, and FFmpeg could not read it. Drive had been syncing the file while it was still being written. A post was missed that night.",
      },
      {
        type: "paragraph",
        text: "The fix was to stop trusting a successful exit code. The render now goes to local temporary storage, is checked, is copied to Drive, and is checked again. \"Checked\" means the file has a duration and its last second decodes.",
      },
      {
        type: "code",
        filename: "make_reel.py",
        language: "python",
        code: `    run(cmd)
    if not video_ok(local_out):
        raise SystemExit(f"render failed (broken file): {local_out}")
    shutil.copyfile(local_out, out_silent)
    if not video_ok(out_silent):   # retry once if the copy to Drive is incomplete
        shutil.copyfile(local_out, out_silent)
        if not video_ok(out_silent):
            raise SystemExit(f"write to Drive was corrupted: {out_silent}")`,
        caption:
          "Messages and comment translated from Japanese. A second script re-checks every output after the batch and rebuilds a broken one from its job file.",
      },
      { type: "heading", text: "2. Two nights with nothing at all" },
      {
        type: "paragraph",
        text: "Drive for desktop does not keep every file on disk. A file can be \"dataless\": it has a name and a size, and the bytes arrive when something reads it. The pipeline deals with this by reading each chosen file from start to end before FFmpeg touches it.",
      },
      {
        type: "paragraph",
        text: "On October 2 that read raised an operating-system error, \"Resource deadlock avoided\", on one of the files chosen for the first video. The exception was not caught. The generator exited with zero videos. The checker then reported zero files and zero broken, which is true and useless, and the posting step said there was nothing to post. The whole run took one minute. The same thing happened the next night.",
      },
      {
        type: "paragraph",
        text: "The cause was a design assumption: that a file listed in the folder can be read. The fix has three parts. Reads are retried with doubling waits. A file that still fails becomes a typed exception, not a crash. And the caller treats that as \"this material is unavailable tonight\": it removes the file from the pool and draws the video again.",
      },
      {
        type: "code",
        filename: "make_reel.py",
        language: "python",
        code: `def warm_file(path, retries=5):
    """Pull a Google Drive placeholder file down to disk (reading it is enough).
    Drive sometimes does not answer just after midnight, so retry up to 5 times,
    waiting 3/6/12/24/48 seconds."""
    import time
    if not is_dataless(path):
        return True
    last = None
    for attempt in range(retries):
        try:
            with open(path, "rb") as f:
                while f.read(8 << 20):
                    pass
            return True
        except OSError as e:
            last = e
            time.sleep(3 * (2 ** attempt))
    raise FileNotReady(f"{os.path.basename(path)}: {last}")`,
        caption: "Docstring translated from Japanese; one progress print removed.",
      },
      {
        type: "code",
        filename: "make_reel.py",
        language: "python",
        code: `        bad = None
        for x in chosen + photos:
            try:
                warm_file(x)
            except FileNotReady as e:
                bad = x; break
        if bad is not None:
            if bad in clip_pool: clip_pool.remove(bad)
            if bad in photo_pool: photo_pool.remove(bad)
            redraws += 1
            if redraws > 20:
                raise SystemExit("material keeps failing to download; check the Drive connection")
            k -= 1; continue`,
        caption:
          "Trimmed, message translated. The redraw is capped at 20 so a disconnected Drive ends the run instead of looping.",
      },
      { type: "heading", text: "3. The fix had a cost I did not measure" },
      {
        type: "paragraph",
        text: "The same commit added a step that downloads new files before generation starts. On October 10 that step found 45 files it could not read, and so did the analysis pass after it. The night still produced ten valid videos and scheduled its posts, which is the behaviour I wanted. It also took an hour and fifty minutes, and the next night did the same with the same 45 files. Five other nights in the same log finished in six to nine minutes.",
      },
      {
        type: "paragraph",
        text: "The arithmetic explains most of it. A file that never becomes readable costs 45 seconds of waiting in the pre-download step and 93 seconds in the analysis pass, and the files are tried one after another. Forty-five of them is about 100 minutes. I have not profiled the run, so this is a calculation that matches the log, not a measurement. The retry policy is right for one stuck file and wrong for forty-five. It needs a budget for the whole night, not per file.",
      },
      { type: "heading", text: "4. A learning loop that was reading stale numbers" },
      {
        type: "paragraph",
        text: "The pipeline is meant to learn. A sync script reads seven-day results for the studio's Instagram reels from our analytics database, links each posted reel to the generated file it came from, and after 30 linked results it starts weighting footage by how its videos performed.",
      },
      {
        type: "paragraph",
        text: "On September 27 I asked why it had never linked a single reel. There were two independent reasons. The Instagram connection in the analytics dashboard had been failing every day since September 6 with an expired token, so no new numbers had arrived for three weeks, and the sync script had been reporting the old ones without complaint. And the reels in that data had been posted by hand with the studio's standard caption, not the generated one, so matching by caption could not work: 0 of 236.",
      },
      {
        type: "paragraph",
        text: "Two changes came out of that. The script now prints a warning with the age of the newest number and the stored connection error whenever the data is more than two days old. And videos posted through the pipeline's own Instagram path are linked by their exact post URL, with caption matching kept as a fallback. The first is a fix. The second only matters once that path is switched on, and it is still off.",
      },
      {
        type: "paragraph",
        text: "The outage also had a cost that cannot be repaired. Once the connection was restored, the newer reels arrived and 22 of them matched generated captions. But a seven-day result needs a reading taken between day 4 and day 14 after posting, and for those reels that window fell inside the outage. In the October 11 log the count is still 22 linked, 0 with a seven-day result.",
      },
      {
        type: "callout",
        variant: "info",
        title: "What this means for the account numbers",
        text: "This is the concrete reason I do not attribute the account's views or followers to the pipeline. The system has linked 22 posted reels to its own output and has a seven-day result for none of them. The performance weighting needs 30 and is still inactive.",
      },
      { type: "heading", text: "5. Sorting timestamps as text" },
      {
        type: "paragraph",
        text: "One rule says a clip or photo may appear in at most one of any six consecutive TikTok posts. To apply it, the code takes the last five posts in order of scheduled time. Scheduled posts come back from the posting service in UTC with a Z suffix. Posts sent immediately were recorded locally in Japan time with +09:00. Sorted as strings, a post at 00:30 on the 28th in Japan sorts after one at 16:00Z on the 27th, although it happened half an hour earlier. The window could contain the wrong five posts.",
      },
      {
        type: "code",
        filename: "tests/test_cooldown.py",
        language: "python",
        code: `class MixedTimezoneOrderTest(unittest.TestCase):
    def test_orders_by_real_time_not_string(self):
        # 2026-09-28T00:30+09:00 is 2026-09-27T15:30Z: earlier than 16:00Z, but later as a string
        posted = {"posts": [post("early", "2026-09-28T00:30:00+09:00", ["early"]),
                            post("late", "2026-09-27T16:00:00.000Z", ["late"])]}
        self.assertEqual(cd.recent_asset_sets(posted, window=2), [{"late"}])`,
        caption: "Found in a code review. The fix parses both formats into real times before sorting.",
      },
      { type: "heading", text: "6. A filter that hid two thirds of the photos" },
      {
        type: "paragraph",
        text: "Source material was limited to files modified in the last 120 days, to keep the first analysis run short. That is reasonable for clips. For photos it is wrong: the date on a file says nothing about whether the photo is good. Only 38 of 116 retouched photos were ever eligible, and the same faces came up day after day. Photos now have no date filter. Repeats are controlled by the usage weights and the six-post rule, which is what those were built for.",
      },
      { type: "heading", text: "What the fixes have in common" },
      {
        type: "list",
        items: [
          "Check the result, not the exit code. A finished process and a playable file are different facts.",
          "Degrade, do not abort. One missing file should cost one redraw, not the night. In the nightly script a failed step does not stop the steps after it.",
          "When a number is old, say so next to the number. A stale figure presented as current is worse than no figure.",
          "Write the rule as a test. The timezone bug and the banned-wording rules are both pinned by tests now; the suite has 74.",
        ],
      },
      { type: "heading", text: "What is still not fixed" },
      {
        type: "paragraph",
        text: "There is no alert. Every failure above was found by reading a log or noticing a missing post, and that is still how the next one will be found. The whole system also depends on one Mac. It is set to wake itself five minutes before midnight, but if it is off, nothing runs and nothing says so. Those two gaps are the same gap, and closing it is the next piece of work.",
      },
      {
        type: "quote",
        text: "An unattended job needs one more output than the work it does: a way to tell you it did not happen.",
      },
    ],
  },
  {
    slug: "a-free-tool-every-monday",
    title: "A free tool every Monday, for five weeks",
    description:
      "Iron & Code promised one free training tool every Monday. It shipped five and then missed five. How the codebase makes a one-week tool possible, what the tools actually compute, how the numbers are checked, and what the record shows.",
    category: "building",
    date: "2026-09-15",
    updated: "2026-10-11",
    author: shogo,
    status: "published",
    cover: { icon: "barbell", label: "ironandcode.dev" },
    body: [
      {
        type: "paragraph",
        text: "[Iron & Code](https://ironandcode.dev) is a site of small free tools for people who lift. The promise on the home page is one new tool every Monday. I kept that promise for five weeks and then stopped. On 11 October 2026 the site's own record reads 5 of 48 weeks shipped, five weeks missed, 50% kept.",
      },
      {
        type: "paragraph",
        text: "This post covers how the code lets a tool ship inside a week without touching the old ones, what three of the tools compute and how I check the numbers, and what the weekly limit cut.",
      },
      {
        type: "stats",
        items: [
          { value: "5", label: "tools shipped, weeks 1 to 5 (2 to 30 August 2026)" },
          { value: "5", label: "weeks missed since, weeks 6 to 10, as of 11 October" },
          { value: "114", label: "unit tests in 7 files, all on logic modules, none on components" },
        ],
      },
      { type: "heading", text: "The record, from the git history" },
      {
        type: "paragraph",
        text: "The repository has 49 commits, all between 2 and 30 August 2026. The series counts weeks from Monday 27 July. These are the days the tool commits landed:",
      },
      {
        type: "list",
        items: [
          "**Week 1, Strength Percentile:** Sunday 2 August, the last day of the week, together with the site itself.",
          "**Week 2, Workouts Left:** Friday 7 August.",
          "**Week 3, Muscle Index:** Sunday 16 August. A different tool, Discipline Score, was committed on Saturday 15 August and deleted the next day.",
          "**Week 4, Arc Builder:** Sunday 16 August, one day before its week opened.",
          "**Week 5, Depth:** Saturday 29 August, followed by ten more commits over that weekend, most of them fixes.",
          "**Weeks 6 to 10:** nothing. The last commit is 30 August.",
        ],
      },
      {
        type: "paragraph",
        text: "Every tool landed inside or before its own week, but by commit date none landed on a Monday. For the first four tools, the date stored with the tool is the Monday that opens its week, not the day the code was written. After week 5 the series stopped, and the project is on hold for now. Nothing in the code forced that: the tests pass and the backlog lists eight more ideas.",
      },
      { type: "heading", text: "One row per tool" },
      {
        type: "paragraph",
        text: "I did not count those missed weeks by hand. The site computes them. Every tool is one entry in an array called TOOLS, with its week number. The week in the header, the 48-cell shipping record on the home page, the sitemap and the grid printed on every share card all derive from that array and one start date.",
      },
      {
        type: "code",
        filename: "lib/tools.ts",
        language: "ts",
        code: `export const SERIES_START = "2026-07-27";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/** The week number the series is currently in, 1-indexed and never below 1. */
export function currentWeek(now: Date = new Date()): number {
  const elapsed = now.getTime() - new Date(\`\${SERIES_START}T00:00:00Z\`).getTime();
  return Math.max(1, Math.floor(elapsed / WEEK_MS) + 1);
}

export type WeekState = "shipped" | "missed" | "pending" | "future";

export function weekStates(
  weeks: number,
  current: number,
  shipped: Set<number>
): WeekState[] {
  return Array.from({ length: weeks }, (_, i) => {
    const week = i + 1;
    if (shipped.has(week)) return "shipped";
    if (week > current) return "future";
    return week === current ? "pending" : "missed";
  });
}`,
        caption:
          "Trimmed from lib/tools.ts: comments and two helper functions removed. The week in progress is pending, not missed. A week only counts against the record once it is over.",
      },
      {
        type: "paragraph",
        text: "Shipping a tool is a pure calculation module with tests, a page under /tools, and one row in TOOLS. Week 4's launch commit edited nothing else. Week 5's did: a card that carries a picture needed changes to the shared share-card code. The first version kept the week number by hand in four places. I replaced that the day after the first commit.",
      },
      {
        type: "paragraph",
        text: "Pages are prerendered, so the date would normally freeze at the last deploy. The root layout revalidates hourly, so the week turns over without me. That is why the live site shows five missed weeks although the last commit is from August.",
      },
      {
        type: "paragraph",
        text: "One mistake: the first tests for the record read the live TOOLS array, so they broke the moment a second tool existed. A suite that fails every time I ship is the wrong suite for this project. The logic now takes the shipped weeks as an argument and the tests pass in fixed data.",
      },
      { type: "heading", text: "Strength Percentile: five anchors and a table" },
      {
        type: "paragraph",
        text: "The first tool ranks a lift against other lifters at the same bodyweight. The data is small: for each lift and sex, five ratios of lift to bodyweight, placed at the 5th, 20th, 50th, 80th and 95th percentiles. For a man's bench press those are 0.5, 0.75, 1.05, 1.45 and 1.85. A result is a straight-line interpolation between the two nearest anchors.",
      },
      {
        type: "code",
        filename: "lib/strength.ts",
        language: "ts",
        code: `/** Interpolate a percentile from the anchor ladder. */
function percentileFromRatio(ratio: number, anchors: number[]): number {
  if (ratio <= anchors[0]) {
    // Below the first anchor, fade toward zero rather than clamping flat.
    return Math.max(0.5, (ratio / anchors[0]) * ANCHOR_PERCENTILES[0]);
  }
  for (let i = 0; i < anchors.length - 1; i++) {
    const lo = anchors[i];
    const hi = anchors[i + 1];
    if (ratio <= hi) {
      const t = (ratio - lo) / (hi - lo);
      const p =
        ANCHOR_PERCENTILES[i] +
        t * (ANCHOR_PERCENTILES[i + 1] - ANCHOR_PERCENTILES[i]);
      return p;
    }
  }
  // Past elite the curve flattens hard; 99.9 is the ceiling we will show.
  const last = anchors[anchors.length - 1];
  const over = (ratio - last) / last;
  return Math.min(99.9, 95 + over * 60);
}`,
        caption:
          "A 100 kg bench at 80 kg bodyweight is a ratio of 1.25, halfway between the 50th and 80th anchors, so it reads as the 65th percentile.",
      },
      {
        type: "paragraph",
        text: "Before interpolation the ratio is multiplied by an age coefficient. Ages 14 to 23 use the Foster coefficients, 24 to 39 are left at 1.0, and 40 to 83 use the McCulloch coefficients. Competitive powerlifting uses these tables to compare lifters of different ages. The published table runs to 90, but the code's copy stops at 83. Past 83 the code continues the curve at about 2.2% a year and the page calls that an extrapolation. Under 14 the tool gives no number, because the standards are adult standards.",
      },
      {
        type: "paragraph",
        text: "The first version had the age adjustment backwards. It multiplied an older lifter's ratio by as little as 0.8, so the same bar ranked lower at eighty than at twenty-five. The test that covered it was titled correctly and asserted the wrong direction, so it passed. I fixed it two days after the first commit, replaced my hand-shaped curve with the published tables, and pinned individual values in tests: 1.23 at 14, 1.055 at 45, 1.645 at 70, 2.05 at 80.",
      },
      {
        type: "callout",
        variant: "info",
        title: "What those tests do not prove",
        text: "A pinned value catches the table drifting after an edit. It does not catch a value copied wrongly from the source, because the test and the table were typed in the same commit. And the five anchor ratios have no citation in the code. They are the weakest data on the site.",
      },
      { type: "heading", text: "Muscle Index: a formula whose test is its own inverse" },
      {
        type: "paragraph",
        text: "The third tool computes FFMI, the fat-free mass index: lean mass in kilograms divided by height in metres squared, then normalised to a 1.8 m frame by adding 6.3 × (1.8 − height). An 80 kg lifter at 15% body fat and 1.80 m carries 68 kg of lean mass and scores 20.99. The reference point comes from Kouri et al. (1995), whose 74 non-steroid-using athletes had normalised values extending up to 25.0.",
      },
      {
        type: "paragraph",
        text: "The headline is the lean kilos between the user and 25.0: 13.0 kg for that lifter. It inverts the normalisation, so it is the number most likely to be quietly wrong. The test does the round trip at four heights: add exactly the reported kilos as lean mass, recompute body fat, run the formula again, expect 25.0.",
      },
      {
        type: "paragraph",
        text: "The paper's abstract calls 25.0 a \"well-defined limit\" for its non-users and calls the findings preliminary. The tool treats it as the top of one sample, not a limit on any person. The top band is worded as an observation about a 1995 sample, and a test fails if that wording stops saying it proves nothing about the person. The sample was male, so the tool offers no bands for women.",
      },
      { type: "heading", text: "Depth: a ratio, not a measurement" },
      {
        type: "paragraph",
        text: "The fifth tool takes a video of a squat and decides whether the hip finished below the knee. It runs pose estimation (a model that finds joint positions in an image) in the browser with MediaPipe. The model and its WebAssembly runtime, about 18 MB, are served from the site's own origin. The video is never uploaded.",
      },
      {
        type: "paragraph",
        text: "There is no known length in the frame, so nothing is reported in centimetres. Every figure is an angle or a fraction of the lifter's own thigh. The verdict has three values, because the method cannot separate results that finish close to the line.",
      },
      {
        type: "code",
        filename: "lib/depth.ts",
        language: "ts",
        code: `export const RULE_OFFSET = 0.1;
export const TOO_CLOSE_BAND = 0.05;

/**
 * Landmark coordinates are not in a square space: x is a fraction of the
 * frame's width and y a fraction of its height. On a 9:16 clip the same 0.1
 * is 108 px across and 192 px down, so measuring a length with
 * \`hypot(dx, dy)\` mixes two different units.
 * ...
 * Everything below works in units of frame height: x is multiplied by the
 * frame's aspect ratio, y is left alone.
 */
function distance(a: Landmark, b: Landmark, aspect: number): number {
  return Math.hypot((a.x - b.x) * aspect, a.y - b.y);
}

// ... inside analyse(), at the deepest frame:
  const thigh = distance(hip, knee, aspect);
  if (thigh === 0) return null;

  // y grows downward, so a hip below the knee is a larger y.
  const margin = (hip.y - knee.y) / thigh;
  const pastRule = margin + RULE_OFFSET;

  // ...
    verdict:
      pastRule > TOO_CLOSE_BAND
        ? "depth"
        : pastRule < -TOO_CLOSE_BAND
          ? "above"
          : "too-close",`,
        caption:
          "Trimmed from lib/depth.ts. Anything within a twentieth of a thigh of the line comes back as too close to call.",
      },
      {
        type: "paragraph",
        text: "The aspect argument and the offset both exist because of bugs I shipped. The launch version measured the thigh with a plain hypotenuse, so on a 9:16 phone clip a horizontal thigh came out about 1.8 times too long and every squat read shallow. It also put the line where the two joint centres are level. The competition rule names the top of the knee, which sits above the knee joint, so I was asking for about a tenth of a thigh more depth than a referee would. I fixed both the day after launch.",
      },
      {
        type: "paragraph",
        text: "Depth has 22 tests, all on synthetic frames with known geometry. One runs the same pose through a square and a portrait frame and expects the same verdict. I have not validated it against real squats judged by a referee. The tests show the geometry is consistent. They do not show the tool is accurate.",
      },
      { type: "heading", text: "When it fails" },
      {
        type: "paragraph",
        text: "Depth worked in Chrome on a laptop and hung three times on an iPhone, where almost all visits come from. A dynamic import inside a Function body never resolved in WebKit and never threw. iOS does not decode a frame until playback has been attempted, so waiting for the first decoded frame waited forever. A video element styled display: none is one iOS never loads. Each was a silent hang, not an error.",
      },
      {
        type: "code",
        filename: "components/depth-tool.tsx",
        language: "ts",
        code: `const SEEK_TIMEOUT_MS = 3000;
const seek = (video: HTMLVideoElement, timeSec: number) =>
  new Promise<boolean>((resolve) => {
    const ready = () =>
      Math.abs(video.currentTime - timeSec) < 0.01 &&
      video.readyState >= 2; /* HAVE_CURRENT_DATA */
    if (ready()) {
      resolve(true);
      return;
    }
    let timer = 0;
    const done = (ok: boolean) => {
      window.clearTimeout(timer);
      video.removeEventListener("seeked", onSeeked);
      resolve(ok);
    };
    const onSeeked = () => done(true);
    video.addEventListener("seeked", onSeeked);
    timer = window.setTimeout(() => done(false), SEEK_TIMEOUT_MS);
    video.currentTime = timeSec;
  });`,
        caption:
          "Assigning currentTime the value it already holds fires no seeked event. The first version waited for one and sat at 0%.",
      },
      {
        type: "paragraph",
        text: "Two rules came out of that weekend and are written in the repository. Never await a browser event without a deadline. Never let one status message cover several operations: 'Loading the model' stood for four steps, so a report of where it stopped told me nothing. The model load now times out with a message, and runs are numbered so a second video cannot write over the first one's result.",
      },
      {
        type: "paragraph",
        text: "The run counter must never be the reason a tool fails. The browser sends only the tool's slug and does not wait. The API route checks the slug against TOOLS, applies a best-effort limit of 60 requests an hour per IP address, and returns 204 whether or not the write succeeded. The database stores one row per tool per day and nothing about the visitor.",
      },
      { type: "heading", text: "Performance and search" },
      {
        type: "list",
        items: [
          "**Five runtime dependencies:** Next.js, React, React DOM, Vercel Analytics and a QR code generator. The database is called with fetch, not its client library.",
          "**Results are computed on the device.** The share card is a 1080 × 1920 PNG drawn on a canvas, so there is no image server.",
          "**Heavy assets are lazy.** The pose model is requested only when a video is chosen, built once per page and reused.",
          "**Search:** each tool is a prerendered page with its own title, description and a plain-text section on the method and its limits. The sitemap is generated from TOOLS.",
        ],
      },
      {
        type: "paragraph",
        text: "There is no structured data and no canonical tag, and I have no search numbers. The pages are indexable. I cannot claim they rank.",
      },
      { type: "heading", text: "What the week forced" },
      {
        type: "paragraph",
        text: "The limit decided what got reused. I extracted the share block in week 2, because it holds the one rule every tool must meet (end in an image worth posting) and the phone-specific code I least wanted to copy.",
      },
      {
        type: "paragraph",
        text: "It decided what got cut. Discipline Score was a 679-line commit, built on a Saturday and deleted on the Sunday. It scored numbers the user had just typed, so it told them nothing new. The rule that replaced it: a tool has to know something the user cannot work out alone. Accounts and email capture were left out. Arc Builder saves a plan against a ten-character code and has no login.",
      },
      {
        type: "paragraph",
        text: "One cut was not a decision. Arc Builder tells the user their plan becomes a daily checklist on 1 October. The database functions for check-ins exist. No screen calls them, and the date has passed. A weekly deadline makes it easy to ship the half of a tool that fits in the week and promise the rest.",
      },
      { type: "heading", text: "What this does and does not show" },
      {
        type: "paragraph",
        text: "It shows a structure where the fourth tool cost one array entry outside its own files, calculation code written as tested pure functions, and limits stated in the product. It shows five weeks of shipping. It does not show a habit that survived. The record on the home page says so, and I have left it unedited.",
      },
    ],
  },
];

const showDrafts = process.env.NODE_ENV !== "production";

/** Posts visible in this environment, newest first. */
export function getPublishedPosts(): BlogPost[] {
  return posts
    .filter((post) => post.status === "published" || showDrafts)
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** Posts that have their own page here (external posts link out instead). */
export function getRoutablePosts(): BlogPost[] {
  return getPublishedPosts().filter((post) => !post.externalUrl);
}

export function getPost(slug: string): BlogPost | undefined {
  return getRoutablePosts().find((post) => post.slug === slug);
}

export function getPostsByCategory(category: BlogCategory): BlogPost[] {
  return getPublishedPosts().filter((post) => post.category === category);
}

export function getCategoriesWithPosts(): BlogCategory[] {
  const used = new Set(getPublishedPosts().map((post) => post.category));
  return categoryOrder.filter((category) => used.has(category));
}

export function isBlogCategory(value: string): value is BlogCategory {
  return (categoryOrder as string[]).includes(value);
}

export function postHref(post: BlogPost): string {
  return post.externalUrl ?? `/blog/${post.slug}`;
}

export function formatPostDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function readingMinutes(post: BlogPost): number {
  const text = post.body
    .map((block) => {
      switch (block.type) {
        case "list":
          return block.items.join(" ");
        case "stats":
          return block.items.map((item) => `${item.value} ${item.label}`).join(" ");
        case "code":
          return block.code;
        case "callout":
          return `${block.title ?? ""} ${block.text}`;
        case "figure":
          return block.caption;
        case "image":
          return `${block.alt} ${block.caption ?? ""}`;
        case "video":
          return block.caption ?? "";
        default:
          return block.text;
      }
    })
    .join(" ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/** h2s for the "On this page" table of contents. */
export function getHeadings(post: BlogPost): { id: string; text: string }[] {
  return post.body.flatMap((block) =>
    block.type === "heading" && (block.level ?? 2) === 2
      ? [{ id: slugifyHeading(block.text), text: block.text }]
      : [],
  );
}

/** The serializable subset a card needs, safe to pass to client components. */
export type BlogCard = {
  slug: string;
  title: string;
  description: string;
  categoryLabel: string;
  category: BlogCategory;
  date: string;
  status: BlogPost["status"];
  href: string;
  external: boolean;
  author: BlogAuthor;
  cover: BlogPost["cover"];
};

export function toCard(post: BlogPost): BlogCard {
  return {
    slug: post.slug,
    title: post.title,
    description: post.description,
    categoryLabel: categoryLabels[post.category],
    category: post.category,
    date: formatPostDate(post.date),
    status: post.status,
    href: postHref(post),
    external: Boolean(post.externalUrl),
    author: post.author,
    cover: post.cover,
  };
}
