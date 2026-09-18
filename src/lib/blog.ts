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
      language: "go" | "python" | "ts";
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
    title: "Finding a 39% drop-off between date and time",
    description:
      "How funnel events on every step and session replay showed where customers stalled in a booking flow — and why I looked before touching the code.",
    category: "growth",
    date: "2026-09-15",
    author: shogo,
    status: "published",
    cover: { icon: "analytics", label: "Funnel · −39%" },
    body: [
      {
        type: "paragraph",
        text: "I'm the sole developer of the booking platform for a Tokyo photo studio. Customers book from 20+ countries before they arrive in Japan: they pick a plan, a location, and a time slot in their own language, then pay a deposit. Every one of those steps is a place someone can quietly leave.",
      },
      { type: "heading", text: "Instrument every step first" },
      {
        type: "paragraph",
        text: "Before changing anything, I made sure each step of the booking flow reported to GA4. A single bookings number tells you how the business is doing. It doesn't tell you where it's leaking. With an event on every step, the funnel becomes a sequence you can read, and a drop between two steps stands out on its own.",
      },
      {
        type: "paragraph",
        text: "I added Microsoft Clarity to the same flow. GA4 answers how many people moved from one step to the next. Clarity answers what those people actually did on the screen.",
      },
      {
        type: "stats",
        items: [
          { value: "39%", label: "drop-off between date and time selection" },
          { value: "GA4", label: "events on every funnel step" },
          { value: "Clarity", label: "session-level replay" },
        ],
      },
      {
        type: "figure",
        icon: "analytics",
        label: "Date → Time · −39%",
        caption:
          "Illustration of where the drop-off sat in the funnel. Not a data export.",
      },
      { type: "heading", text: "Where people left" },
      {
        type: "paragraph",
        text: "The step that stood out sat between choosing a date and choosing a time: 39% of people who picked a date didn't go on to pick a time slot.",
      },
      {
        type: "paragraph",
        text: "That's a strange place to lose people. By the time someone picks a date, they have already chosen a plan and a location. They're close to done. Intent isn't the likely problem at that point, which pointed at the interface rather than the offer.",
      },
      { type: "heading", text: "Why replay mattered" },
      {
        type: "paragraph",
        // TODO(shogo): confirm — add what the replays actually showed and what the fixes changed.
        text: "A funnel chart can show where people leave. It can't show why. Watching session-level recordings of people at the date and time steps turned a percentage into specific moments on the screen, and those moments are what the fixes were aimed at.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "What I'd tell a client",
        text: "If you're about to redesign a checkout, instrument it first. The fix you need is often one step, not the whole flow.",
      },
      { type: "heading", text: "What I shipped" },
      {
        type: "paragraph",
        text: "I shipped fixes to that part of the flow. The measurement that matters next is the same funnel over a comparable period after the change, which is why this post doesn't quote an after-fix number.",
      },
      { type: "heading", text: "The general lesson" },
      {
        type: "list",
        ordered: true,
        items: [
          "Put an event on every step, not only on the conversion.",
          "Use the funnel to find the step, and replay to understand it.",
          "Fix the step that leaks before touching the ones that don't.",
        ],
      },
      {
        type: "paragraph",
        text: "It's the same approach I take on client work: measure before automating or rebuilding anything, so the time goes where the problem actually is.",
      },
    ],
  },
  {
    slug: "deposits-for-inbound-travelers",
    title: "Deposits from 20+ countries: payments for inbound travelers",
    description:
      "A booking flow where customers abroad pay a 30% deposit up front and the balance is collected after the shoot — and what it has processed so far.",
    category: "engineering",
    date: "2026-09-15",
    author: shogo,
    status: "published",
    cover: { icon: "stripe", label: "30% deposit" },
    body: [
      {
        type: "paragraph",
        text: "The booking platform I built for a Tokyo photo studio has one job that sounds simple: let someone on the other side of the world reserve a shoot and pay for it before they've met anyone from the studio. I designed, built, deployed, and still operate it on my own.",
      },
      {
        type: "stats",
        items: [
          { value: "$19.9k", label: "best month in revenue" },
          { value: "754", label: "transactions, Jan 1 – Sep 13, 2026" },
          { value: "20+", label: "countries customers book from" },
        ],
      },
      { type: "heading", text: "The problem" },
      {
        type: "paragraph",
        text: "Customers book from 20+ countries before they arrive in Japan. They need to choose a plan, a location, and a time slot in their own language, and pay a deposit in their own currency — before they trust us.",
      },
      {
        type: "paragraph",
        text: "Charging the full amount up front asks a lot of someone who has never worked with the studio. Charging nothing leaves the studio holding a slot for someone who may not show up. A deposit sits between the two.",
      },
      { type: "heading", text: "Deposit now, balance later" },
      {
        type: "paragraph",
        text: "At booking, the customer pays a 30% deposit through Stripe. The remaining balance is collected automatically after the shoot. Nobody on the team has to chase an invoice, and the customer pays the rest once the work is done.",
      },
      {
        type: "figure",
        icon: "stripe",
        label: "30% now · balance after",
        caption:
          "Illustration of the payment timing: a deposit at booking, the balance after the shoot.",
      },
      {
        type: "code",
        filename: "deposit.go",
        language: "go",
        code: `// 30% of the booking total is charged at checkout.
func depositAmount(total int64) int64 {
	return total * 30 / 100
}`,
        caption: "Simplified for illustration — not production code.",
      },
      {
        type: "paragraph",
        text: "The arithmetic is the easy part. The work is everything around it: tying the payment to the booking, and making sure the balance step happens after the shoot instead of depending on someone remembering it.",
      },
      { type: "heading", text: "What happens around a booking" },
      {
        type: "list",
        items: [
          "A photographer is assigned to the booking.",
          "The booking is synced to Google Calendar.",
          "Every funnel step reports to GA4 and Microsoft Clarity.",
          "After the shoot, the remaining balance is collected.",
        ],
      },
      {
        type: "paragraph",
        text: "The studio's contract photographers also have an iOS app I built, where they claim open shoots, see earnings per job, and generate month-end invoices. Remaining-balance collection runs from there too, so it's tied to the shoot itself.",
      },
      { type: "heading", text: "Stack" },
      {
        type: "paragraph",
        // TODO(shogo): confirm — describe what Cloudflare does in the setup if you want it named specifically.
        text: "Next.js and TypeScript on the front end, Go and PostgreSQL behind it, deployed on AWS, with Cloudflare and Stripe as part of the setup.",
      },
      { type: "heading", text: "What it has done" },
      {
        type: "paragraph",
        text: "Its best month so far brought in about $19,900 (¥3,057,147 in Stripe), the business has handled 1,200+ clients, and the platform processed 754 transactions between January 1 and September 13, 2026. Instrumenting it step by step is also how I found a 39% drop-off between picking a date and picking a time.",
      },
    ],
  },
  {
    slug: "share-count-not-follower-count",
    title: "Share count, not follower count",
    description:
      "A 13-month analysis of my own Instagram account found that shares, not followers, were the signal worth watching.",
    category: "growth",
    date: "2026-09-15",
    author: shogo,
    status: "published",
    cover: { icon: "instagram", label: "13 months of data" },
    body: [
      {
        type: "paragraph",
        text: "Alongside building software, I grew a personal brand on Instagram, @imshogo.k, from zero to 30,000 followers in the motivation, fitness, and self-growth space. Multiple videos passed 1 million views.",
      },
      {
        type: "stats",
        items: [
          { value: "30,000", label: "followers, built from zero" },
          { value: "1M+", label: "views on multiple videos" },
          { value: "13 mo", label: "of account data analyzed" },
        ],
      },
      { type: "heading", text: "The question" },
      {
        type: "paragraph",
        text: "Follower count is the number everyone looks at, and for a long time that included me. A bigger account should, in theory, mean more reach for every post. But videos that passed a million views travelled far beyond a 30,000-follower base, so follower count alone clearly wasn't explaining reach.",
      },
      { type: "heading", text: "What I did" },
      {
        type: "paragraph",
        // TODO(shogo): confirm — add the method (data source, which metrics were compared).
        text: "I ran a 13-month analysis of my own account data to see which numbers actually moved ahead of reach, and which only described what had already happened.",
      },
      { type: "heading", text: "What I found" },
      {
        type: "quote",
        text: "Share count — not follower count — is the only reliable leading indicator of reach.",
      },
      {
        type: "paragraph",
        text: "Follower count turned out to be nearly useless as a signal. Shares were different: when someone sends a video to another person, they're doing the distribution themselves.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The practical change",
        text: "Judge a piece of content by whether people pass it on, not by how many people already follow the account.",
      },
      { type: "heading", text: "What I watch now" },
      {
        // TODO(shogo): confirm this reflects how you actually read the numbers today.
        type: "list",
        items: [
          "Shares per video, as the first read on whether something will travel.",
          "Reach, as the confirmation.",
          "Followers, as a running total rather than a goal.",
        ],
      },
      { type: "heading", text: "Why this is on a developer's portfolio" },
      {
        type: "paragraph",
        text: "Most developers can build a product but can't get anyone to see it. Most creators can get attention but can't build anything. I do both, and I measure both.",
      },
      {
        type: "paragraph",
        text: "The habit is the same on either side: find the number that moves first, and stop staring at the one that moves after. In a booking funnel that meant an event on every step. On a content account, it meant shares.",
      },
    ],
  },
  {
    slug: "ten-videos-every-morning",
    title: "Ten videos every morning, no human input",
    description:
      "A pipeline that selects footage, writes captions, and renders ten short-form videos every morning without anyone pressing a button.",
    category: "ai",
    date: "2026-09-15",
    author: shogo,
    status: "published",
    cover: { icon: "video", label: "10 videos / morning" },
    body: [
      {
        type: "paragraph",
        text: "Short-form video works for a photo studio, but only if it shows up consistently. Selecting clips, writing captions, and preparing posts every single day doesn't scale with a two-person company. So I built a pipeline that does it every morning, with no human input.",
      },
      {
        type: "stats",
        items: [
          { value: "10", label: "videos generated every morning" },
          { value: "1.14M", label: "views on the resulting account in 30 days" },
          { value: "Solo", label: "designed and built alone" },
        ],
      },
      { type: "heading", text: "What it does" },
      {
        type: "list",
        items: [
          "Selects source footage",
          "Generates captions",
          "Renders 10 short-form videos",
          "Prepares them for distribution",
        ],
      },
      { type: "heading", text: "How it's built" },
      {
        type: "paragraph",
        text: "Python for the pipeline, LLM APIs for the captions, video processing for rendering, running on AWS.",
      },
      {
        type: "code",
        filename: "morning_run.py",
        language: "python",
        code: `# The shape of the daily run.
def morning_run():
    clips = select_footage()
    for clip in clips[:10]:
        caption = write_caption(clip)
        render_video(clip, caption)
    prepare_for_distribution()`,
        caption: "Simplified for illustration — not production code.",
      },
      {
        type: "paragraph",
        text: "None of the individual steps is unusual. What makes it useful is that nothing in the chain waits for a person, so it doesn't slip on a busy day.",
      },
      { type: "heading", text: "Designing for unattended" },
      {
        type: "paragraph",
        text: "A pipeline that needs someone to start it is a chore with extra steps. The design goal was a daily run that completes on its own: pick, caption, render, prepare.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Where the LLM fits",
        // TODO(shogo): confirm — is caption writing the only LLM step?
        text: "The language model handles the part that used to need someone to write something every day: the captions.",
      },
      { type: "heading", text: "Result" },
      {
        type: "paragraph",
        text: "Ten videos come out every morning, unattended, and the studio account they feed drew 1.14M views in the last 30 days (Sep 2026).",
      },
      {
        type: "paragraph",
        text: "For a client, the transferable part isn't video. It's taking a task someone does by hand every day and making the daily run happen without them.",
      },
    ],
  },
  {
    slug: "a-free-tool-every-monday",
    title: "A free tool every Monday",
    description:
      "Iron & Code: small, free calculators for lifters, shipped on a weekly cadence with a short video for each.",
    category: "building",
    date: "2026-09-15",
    author: shogo,
    status: "published",
    cover: { icon: "barbell", label: "ironandcode.dev" },
    body: [
      {
        type: "paragraph",
        text: "[Iron & Code](https://ironandcode.dev) is a set of small, free tools for lifters that I design, build, and ship on my own, one every Monday.",
      },
      {
        type: "stats",
        items: [
          { value: "Weekly", label: "a new tool every Monday" },
          { value: "Solo", label: "designed, built, and shipped alone" },
          { value: "Free", label: "every tool" },
        ],
      },
      { type: "heading", text: "The problem" },
      {
        type: "paragraph",
        text: "Lifters do plate math, 1RM estimates, and macro calculations in their heads between sets. Every one of those is a ten-line function that nobody bothered to build well.",
      },
      { type: "heading", text: "What I build" },
      {
        type: "list",
        items: ["Plate math", "1RM estimates", "Macro calculations"],
      },
      {
        type: "paragraph",
        text: "Each tool is paired with a short-form video explaining the problem it solves, so every release comes with its own way to be found.",
      },
      { type: "heading", text: "Why a fixed cadence" },
      {
        type: "paragraph",
        text: "This project is proof of shipping cadence, not scale. A fixed weekly release forces the useful decisions: what's the smallest version that helps, what can wait for next week, and what's finished enough to ship on Monday.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The rule",
        // TODO(shogo): confirm this framing.
        text: "Ship something real every Monday. The scope can bend; the date doesn't.",
      },
      { type: "heading", text: "Stack" },
      {
        type: "paragraph",
        text: "Next.js and TypeScript, deployed on Vercel. Small tools don't need more than that, and keeping the stack boring is part of what makes a weekly cadence realistic.",
      },
      { type: "heading", text: "Why it's on a portfolio" },
      {
        type: "paragraph",
        text: "Anyone hiring a solo developer is really asking one thing: will this person keep shipping? A public project with a fixed release rhythm answers that more directly than a list of skills.",
      },
      {
        type: "paragraph",
        text: "It's also the same pairing I use everywhere else: build the thing, then make sure people can find it.",
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
