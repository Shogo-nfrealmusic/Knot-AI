// Free tools from the @copilot_shogo reels. One "drop" per reel.
// Slugs are numbered ("02-claude-design-tools") so they never collide as reels pile up;
// /free/02 redirects to the full slug, which is what the DMs link to.

export type ToolIcon =
  | "palette"
  | "wand"
  | "browser"
  | "file"
  | "cube"
  | "plug"
  | "cpu"
  | "scissors"
  | "review"
  | "brain"
  | "notebook"
  | "store"
  | "council"
  | "legal"
  | "shield"
  | "event";

export type FreeTool = {
  name: string;
  what: string;
  href: string;
  icon: ToolIcon;
  /** commands to paste, one per copy line (e.g. Claude Code /plugin commands) */
  install?: string[];
  /** one short caveat shown under the install lines */
  note?: string;
};

export type FreeDrop = {
  number: number;
  slug: string;
  title: string;
  description: string;
  date: string; // ISO
  keyword: string; // the comment keyword on the reel
  tools: FreeTool[];
  /** email-gated PDF (Kit form). When set, the page shows the sign-up instead of the tool list. */
  guide?: { kitUid: string; kitScript: string; cover: string; points: string[] };
  /** paid kit sold on Kit Commerce. When set, the page shows the sales section. */
  kit?: { href: string; price: string; offer?: { code: string; until: string; regular: string }; cover: string };
  /** one-line tip under the tool list, with a command to copy */
  tip?: { before: string; command: string; after: string };
  /** longer write-up under the tool list, for single-tool drops */
  about?: DropAbout;
  /** cover tile for drops with no tools (e.g. a checklist) */
  icon?: ToolIcon;
  /** news explainer: a short TL;DR, grouped announcements, and the sources */
  breakdown?: DropBreakdown;
};

/** One announcement: what it is, who gets it (plans, price, availability), and why it matters. */
export type BreakdownItem = {
  name: string;
  what: RichText;
  who?: RichText;
  /** e.g. the safety rules for an agent */
  more?: { label: string; text: RichText };
  why: RichText;
};

export type DropBreakdown = {
  /** "The 60-second version": one line per bullet */
  tldr: RichText[];
  sections: { title: string; items: BreakdownItem[] }[];
  /** official pages first, then reporting */
  sources: { text: string; href?: string; note?: string }[];
  /** caveats shown above the sources */
  notes?: (string | RichText)[];
};

/** A run of text; a part with href renders as a link, a part with code as inline code. */
export type RichText = (string | { text: string; href: string } | { code: string })[];

/** One item of a checklist drop: why it matters, and how to verify it. */
export type DropCheck = {
  title: string;
  why: RichText;
  how: RichText;
  /** commands to copy, one per line */
  commands?: string[];
};

export type DropAbout = {
  /** one line above everything else */
  intro?: RichText;
  /** a numbered checklist; the drop is labelled "N checks" */
  checks?: DropCheck[];
  /** a boxed summary under the checks: tools that cover several of them at once */
  runAll?: { title: string; items: { text: RichText; command?: string }[] };
  steps?: { title: string; text: string }[];
  /** second way to install, run in a terminal instead of Claude Code */
  altInstall?: { label: string; commands: string[] };
  /** a real run, quoted verbatim */
  example?: { question: string; output: string; source: string };
  notes?: (string | RichText)[];
  why?: RichText;
};

export const INSTAGRAM_HANDLE = "copilot_shogo";
export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`;

const drops: FreeDrop[] = [
  {
    number: 10,
    slug: "10-devday-2026",
    title: "OpenAI DevDay 2026: the full breakdown",
    description:
      "Everything OpenAI announced at DevDay (September 29, 2026, San Francisco) in plain English: what each launch is, who gets it and what it costs, and why it matters. An independent explainer, not affiliated with OpenAI.",
    date: "2026-09-30",
    keyword: "DEVDAY",
    tools: [],
    icon: "event",
    breakdown: {
      tldr: [
        ["dots: always-on AI agents with their own cloud computer. They work 24/7, and you can message or call them. Included in Pro, Business Premium and Enterprise."],
        ["GPT-6.1 Sol: close to GPT-6 Astra for a fifth of the price. The planned GPT-6.1 Astra was pulled over safety."],
        ["Astra Ultrafast: GPT-6 Astra runs up to 8x faster in Codex."],
        ["ChatGPT Space: shared pages where you @mention teammates and their dots."],
        ["For builders: a Decisions API for fast, constrained choices (it reads images), computer use in the Agents API, and Codex in the cloud."],
        ["Plans: your ChatGPT plan now works inside 16 partner apps. There's a new $500 Pro tier, and Pro 200 drops from 20x to 10x Plus usage."],
      ],
      sections: [
        {
          title: "New ways of working",
          items: [
            {
              name: "dots",
              what: [
                "Always-on agents that work for you 24/7. Each dot has its own cloud computer and browser, connects to 4,000+ apps, and keeps working when your laptop is closed. You message or call it in ChatGPT (desktop, web and mobile), Slack or Teams, and it messages you with progress and approval requests.",
              ],
              who: [
                "Included in ChatGPT Pro, Business Premium and Enterprise, and it doesn't draw down your usage. You get one primary dot today; teams of dots come later. On Pro it isn't available in the EEA, Switzerland or the UK. Extra dots: price not announced. Powered by GPT-6 Astra, running on the Codex harness.",
              ],
              more: {
                label: "Safety",
                text: [
                  "It needs your approval before it buys anything with a saved card. You can add your own rules (for example \"never send email\"), and an independent auto-review checks each action before it runs; a dot can't turn it off. Password changes and bank transfers are handed back to you. OpenAI says dots can still make mistakes.",
                ],
              },
              why: ["It's the first ChatGPT feature that keeps working while you're away, not only when you ask."],
            },
            {
              name: "GPT-6.1 Sol",
              what: [
                "OpenAI's new workhorse model: close to GPT-6 Astra on coding, computer use and professional work, at a fifth of the price. 1.05M-token context.",
              ],
              who: [
                "API: $2 per 1M input tokens, $10 per 1M output, $0.10 cached input (GPT-6 Astra: $10 / $50 / $1). The planned GPT-6.1 Astra release was pulled because it didn't meet OpenAI's safety standards.",
              ],
              why: ["Near-top quality at a fifth of the cost makes all-day agents much cheaper to run."],
            },
            {
              name: "Astra Ultrafast",
              what: [
                "A faster way to run GPT-6 Astra: up to 8x faster in Codex and 6x in the API, around 300 tokens per second.",
              ],
              who: [
                "In the API, ChatGPT and Codex. Available for Astra today; coming soon for GPT-6.1 Sol. Included in Pro 500. API price: not in the announcement.",
              ],
              why: ["Agents that wait less get through more work per hour."],
            },
            {
              name: "Private Intelligence",
              what: [
                "A privacy layer for companies building agents. Zero data retention (ZDR) now comes with private safety processing, so safety checks run without storing your content. Private inference, in preview, adds confidential computing and verifiable controls while your data is processed.",
              ],
              who: ["For businesses. Design partners: Cisco, Databricks and Snowflake. Pricing: not announced."],
              why: ["It removes a common blocker to putting sensitive data through agents."],
            },
          ],
        },
        {
          title: "People and AI",
          items: [
            {
              name: "ChatGPT Space",
              what: [
                "Shared pages where you work with teammates and dots. @mention a dot (yours or a teammate's) in a comment to change a chart or pull in a fact. Living Pages keep themselves up to date in the background, and slides can be co-edited.",
              ],
              who: ["Pro, Business and Enterprise, on desktop and web. Mobile is coming soon."],
              why: ["Agents become members of the doc, not a separate chat window."],
            },
            {
              name: "@ChatGPT in Slack and Teams",
              what: [
                "Mention ChatGPT inside Slack or Microsoft Teams. Dots work there too: in the keynote demo, one dot took over a forwarded thread and another fixed a bug from a report and opened a pull request.",
              ],
              why: ["The AI works where the conversation already happens."],
            },
            {
              name: "Meetings plugin",
              what: [
                "Takes meeting notes in ChatGPT and Codex: a live transcript, notes that update as you talk, and a summary when recording stops. It can see your upcoming meetings from your calendar.",
              ],
              why: ["Meeting notes land in the same tools that act on them."],
            },
          ],
        },
        {
          title: "Build",
          items: [
            {
              name: "Decisions API",
              what: [
                "Fast, constrained decisions: instead of writing free text, the model picks from options you define. Powered by GPT-6 Luna, it takes text or image input. The keynote demo searched for a flight one UI action at a time.",
              ],
              who: [
                "Limited preview for selected customers, with a broad release in the coming days. OpenAI quotes about 150 ms per decision, versus 1.6 s in its comparison. Pricing: not announced.",
              ],
              why: [
                "Media call it a rival to Jev by TypeSafe AI, which is text-only for now. Early tests were mixed (Every).",
              ],
            },
            {
              name: "Computer use in the Agents API",
              what: [
                "The Agents API gives developers the same harness that runs Codex and dots: an environment, memory, tools and MCP, compaction, and multiple agents. It now supports computer use, so your agent can operate a browser and desktop.",
              ],
              who: ["The Agents API has been in public beta since September 10; computer use was added at DevDay."],
              why: ["You can build dot-style agents into your own product."],
            },
            {
              name: "Codex cloud with reusable environments",
              what: [
                "Codex runs in the cloud from environments you configure once and reuse, so each task starts from your setup instead of from scratch.",
              ],
              who: ["Plus, Pro, Business, Healthcare, Edu and Enterprise."],
              why: ["Close your laptop and the coding agent keeps going."],
            },
            {
              name: "Codex Security Cloud",
              what: ["A security product for Codex in the cloud. OpenAI's recap lists it; plans and pricing weren't in the keynote."],
              why: ["Security review moves into the same cloud where the code gets written."],
            },
            {
              name: "New Codex CLI and code review",
              what: ["A new version of the Codex command-line tool, and updated code review."],
              why: ["The terminal and the review step get upgrades alongside Codex in the cloud."],
            },
            {
              name: "Amazon Bedrock Managed Agents for OpenAI",
              what: [
                "OpenAI inside AWS: Bedrock Managed Agents with GPT-6 Astra and Ultrafast, plus Codex and ChatGPT Work, next to your existing AWS apps and data.",
              ],
              who: ["AWS customers. Pricing: not announced."],
              why: ["Companies can adopt OpenAI's agents without leaving AWS."],
            },
          ],
        },
        {
          title: "Distribution and plans",
          items: [
            {
              name: "Use your ChatGPT plan in partner apps",
              what: [
                "Your ChatGPT subscription can pay for AI usage inside other apps. 16 launch partners, including Notion, Devin, Vercel, Lovable, Warp, Amp, Conductor, T3, opencode and Kilo.",
              ],
              who: ["Plus and Pro."],
              why: ["One subscription instead of a separate AI bill in every tool, and an easier first try for new apps."],
            },
            {
              name: "Sign in with ChatGPT",
              what: ["A login button for apps. It shares only your name, email and profile photo, not your chats or memory."],
              why: ["Together with plan portability: sign in, and your plan comes with you."],
            },
            {
              name: "Plugin extensions and discovery",
              what: [
                "Developers can put their apps inside ChatGPT, and ChatGPT can suggest them when they fit what you're asking. Creating, submitting and searching plugins also got easier.",
              ],
              who: ["Plugin extensions: all plans."],
              why: ["A way to reach ChatGPT's 1.2 billion weekly users."],
            },
            {
              name: "OpenAI Marketplace",
              what: [
                "A marketplace launching with 30+ partners, including Adobe, Datadog, ElevenLabs, Harvey, Lovable, Notion, Salesforce, Vercel and Zendesk.",
              ],
              who: ["How discovery, payments and revenue share work: not announced."],
              why: ["Another channel to put an AI product in front of OpenAI's customers."],
            },
            {
              name: "New Pro tiers",
              what: [
                "Pro now comes in three tiers: Pro 100, Pro 200 and the new Pro 500. Pro 500 costs $500 a month and gives 25x Plus usage, Ultrafast, and no 5-hour limit.",
              ],
              who: [
                "Pro 200 ($200 a month) drops to 10x Plus usage (it was 20x), and GPT-6 Pro messages go from 200 to 100 a week. Existing subscribers keep their old allowance until October 29, 2026. Every Pro tier includes dots.",
              ],
              why: ["On $200 Pro? Check whether the new limits still fit before October 29."],
            },
          ],
        },
      ],
      notes: [
        "An independent explainer by @copilot_shogo. Not affiliated with or endorsed by OpenAI.",
        "Written on September 30, 2026, the day after the keynote. Prices, plans and dates can change, so check the official pages below before you rely on them.",
        "Where a price, plan or date wasn't announced, this page says so instead of guessing.",
        "Early hands-on: Every found dots too buggy to recommend in the first days.",
      ],
      sources: [
        { text: "OpenAI: DevDay 2026 recap", href: "https://openai.com/index/devday-2026-recap/" },
        { text: "OpenAI: Introducing dots", href: "https://openai.com/index/introducing-dots/" },
        { text: "OpenAI: Introducing GPT-6.1 Sol", href: "https://openai.com/index/introducing-gpt-6-1-sol/" },
        { text: "ChatGPT docs: dots", href: "https://learn.chatgpt.com/docs/dots" },
        { text: "OpenAI Help Center: About ChatGPT Pro tiers", href: "https://help.openai.com/en/articles/9793128-about-chatgpt-pro-tiers" },
        { text: "OpenAI Help Center: related article", href: "https://help.openai.com/en/articles/20001542" },
        { text: "@OpenAIDevs on X", href: "https://x.com/OpenAIDevs/status/2105003318917697873" },
        { text: "Reporting: CNBC, Engadget, Every, The Decoder" },
      ],
    },
  },
  {
    number: 9,
    slug: "09-vibe-secure",
    title: "12 security checks for your vibe-coded app — and the free tool for each",
    description:
      "What to check before real users touch an app you built with AI: why each check matters, and the free command, tool or setting that verifies it. Not a professional security audit.",
    date: "2026-09-29",
    keyword: "SECURE",
    tools: [],
    icon: "shield",
    about: {
      intro: [
        "In March 2025, researchers scanned 1,645 apps on Lovable's showcase; 170 had data anyone could read (",
        { text: "CVE-2025-48757", href: "https://nvd.nist.gov/vuln/detail/CVE-2025-48757" },
        ").",
      ],
      checks: [
        {
          title: "Row level security on every table",
          why: [
            "In Supabase, a table in the public schema without RLS can usually be read and changed by anyone who has your public key, and that key ships in your app. This is what the Lovable scan found.",
          ],
          how: [
            "Supabase: Dashboard → Advisors → ",
            { text: "Security Advisor", href: "https://supabase.com/docs/guides/observability/advisors" },
            ", or run it from a terminal with Supabase CLI v2.81.0 or later (after supabase link). Firebase: ",
            { text: "test mode", href: "https://firebase.google.com/docs/firestore/quickstart" },
            " \"allows anyone to read and overwrite your data\", so replace those rules before launch.",
          ],
          commands: ["supabase db advisors --linked --type security"],
        },
        {
          title: "Secret keys never in the browser",
          why: [
            "Publishable and anon keys are ",
            { text: "meant to be public", href: "https://supabase.com/docs/guides/getting-started/api-keys" },
            ". Secret and service_role keys bypass RLS, so they must stay on the server.",
          ],
          how: [
            "In Next.js, anything prefixed ",
            { code: "NEXT_PUBLIC_" },
            " is ",
            { text: "shipped to the browser", href: "https://nextjs.org/docs/app/guides/environment-variables" },
            " (in Vite, ",
            { code: "VITE_" },
            "). Keep secret keys unprefixed and use them only in server code. ",
            { text: "/legal-check", href: "/free/08" },
            " flags exposed keys.",
          ],
        },
        {
          title: "No reading other users' data by changing an ID",
          why: [
            { text: "Broken access control", href: "https://top10.owasp.org/2025/A01_2025-Broken_Access_Control" },
            " is #1 in the OWASP Top 10 (2025). It includes viewing or editing someone else's account by changing its ID (IDOR).",
          ],
          how: [
            "Test it by hand: log in as user A, then change an id in a URL or API call to one that belongs to user B. You should get 403, not B's data.",
          ],
        },
        {
          title: ".env not in your repo",
          why: [
            "Deleting a committed .env doesn't remove it: the key stays in your git history for anyone who can read the repo.",
          ],
          how: [
            { text: "gitleaks", href: "https://github.com/gitleaks/gitleaks" },
            " (MIT) scans your commit history (add --log-opts=\"--all\" to include every branch). Add ",
            { code: ".env" },
            " to ",
            { code: ".gitignore" },
            ", and rotate any key it finds. Turn on ",
            { text: "GitHub push protection", href: "https://docs.github.com/en/code-security/concepts/secret-security/push-protection" },
            ": free for public repos; private repos need GitHub Secret Protection, a paid add-on for GitHub Team or Enterprise organizations. Don't use ",
            { code: "npx gitleaks" },
            ": the npm package with that name isn't the gitleaks project.",
          ],
          commands: ["brew install gitleaks", "gitleaks git -v"],
        },
        {
          title: "Rate limits on logins and AI endpoints",
          why: [
            "Without a limit, a bot can keep guessing passwords, and one script can run up your AI bill through your own endpoint.",
          ],
          how: [
            { text: "/legal-check", href: "/free/08" },
            " checks login rate limits if you wrote your own password login (it skips hosted auth like Supabase Auth). For AI endpoints, add a per-user or per-IP limit at your host or edge, for example ",
            { text: "Vercel WAF rate limiting", href: "https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting" },
            ".",
          ],
        },
        {
          title: "A hard spending cap on your AI API account",
          why: ["A leaked key or a runaway loop keeps spending until something stops it."],
          how: [
            { text: "OpenAI", href: "https://developers.openai.com/api/docs/guides/spend-limits" },
            ": Organization limits (or a project's Limits) → Spend → Edit spend limit, and turn on \"Enforce a hard limit\". ",
            { text: "Anthropic", href: "https://platform.claude.com/docs/en/api/rate-limits" },
            ": Claude Console → Settings → Billing → Spend limits, or a workspace's Spend limits tab. Caps aren't instant: OpenAI says spend can slightly exceed the limit.",
          ],
        },
        {
          title: "Server-side input validation",
          why: ["Checks in your form run in the browser. Anyone can skip them by calling your API directly."],
          how: [
            "Validate every request body on the server with a schema, for example ",
            { text: "zod", href: "https://zod.dev" },
            "'s ",
            { code: "safeParse" },
            ", and reject what doesn't match.",
          ],
          commands: ["npm install zod"],
        },
        {
          title: "Stripe webhooks verify the signature",
          why: ["Without it, anyone can send your webhook URL a fake \"payment succeeded\" event."],
          how: [
            "Call ",
            { code: "stripe.webhooks.constructEvent(rawBody, signature, endpointSecret)" },
            " with the raw request body, the Stripe-Signature header and your endpoint's signing secret, and reject the request if it throws. ",
            { text: "Stripe's guide", href: "https://docs.stripe.com/webhooks#verify-signature" },
            ".",
          ],
        },
        {
          title: "Admin and debug routes locked or removed",
          why: [
            "An /admin page or a test endpoint that's in your deployed app is public unless the server checks who's asking.",
          ],
          how: [
            { text: "/legal-check", href: "/free/08" },
            " flags admin routes with no auth. Check the role on the server, not only in the UI, and delete debug routes before you ship.",
          ],
        },
        {
          title: "Real packages, then an audit",
          why: [
            "AI can suggest packages that don't exist, and anyone can publish a package under a name it keeps inventing.",
          ],
          how: [
            "Look up each new package on npmjs.com before you install it: the owner, the repo link, how widely it's used. Then run ",
            { text: "npm audit", href: "https://docs.npmjs.com/cli/commands/npm-audit" },
            " for known vulnerabilities.",
          ],
          commands: ["npm audit"],
        },
        {
          title: "Logs that catch attacks",
          why: ["If nothing is logged, you hear about an attack from your users or your bill."],
          how: [
            "Check your host's logs: ",
            { text: "Vercel runtime logs", href: "https://vercel.com/docs/logs/runtime" },
            ", ",
            { text: "Supabase logs", href: "https://supabase.com/docs/guides/observability/logs" },
            ". Vercel's Hobby plan keeps runtime logs for only 1 hour, so look often, or send them to a log drain if you need history.",
          ],
        },
        {
          title: "Backups you've restored",
          why: ["A backup you've never restored is a guess."],
          how: [
            "Supabase keeps ",
            { text: "daily backups", href: "https://supabase.com/docs/guides/platform/backups" },
            " on Pro (7 days), Team (14) and Enterprise (up to 30), under Database → Backups. The Free plan has none, so export your data with the Supabase CLI. Then do one test restore.",
          ],
        },
      ],
      runAll: {
        title: "Run the whole thing",
        items: [
          {
            text: [
              { text: "/security-review", href: "https://code.claude.com/docs/en/commands" },
              " is built into Claude Code. It reviews the changes on your branch (the diff against your default branch), not the whole app, so run it before each merge. It needs an origin remote.",
            ],
            command: "/security-review",
          },
          {
            text: [
              { text: "/legal-check", href: "/free/08" },
              " covers several of these automatically: exposed keys (2), an open database (1), login rate limits for custom password logins (5) and admin routes with no auth (9).",
            ],
            command: "/legal-check",
          },
        ],
      },
      notes: [
        "This is not a professional security audit. It's a checklist of common gaps, and passing it doesn't mean your app is secure. If you handle payments or sensitive data, have a security professional review it.",
        [
          "Lovable disputes CVE-2025-48757, saying protecting app data is each customer's responsibility. The 1,645 and 170 are from the ",
          { text: "researchers' statement", href: "https://mattpalmer.io/posts/2025/05/statement-on-CVE-2025-48757/" },
          ", which scanned only homepages.",
        ],
      ],
    },
  },
  {
    number: 8,
    slug: "08-legal-check",
    title: "/legal-check: find the legal traps in your vibe-coded app",
    description:
      "A free Claude Code skill (MIT) by Shogo. It audits a vibe-coded web or mobile app for the things most likely to get it sued, fined, breached, or rejected from the App Store. Then it fixes what code can fix, in your app's own stack. Not legal advice.",
    date: "2026-09-28",
    keyword: "LEGAL",
    tools: [
      {
        name: "/legal-check",
        what: "23 checks, reported by risk (High → Medium → Low): security that creates liability (secret keys in client code, an open database, admin routes with no auth, raw card data, login limits), privacy & tracking (session replay, ad pixels before consent, Google Fonts, privacy policy and terms, account deletion, \"Do Not Sell or Share\"), kids (COPPA, app-store age ratings), marketing (CAN-SPAM, TCPA, FTC testimonials), payments (auto-renewal, refunds), content & IP (DMCA, report and block, trademarks, AI disclosure) and accessibility (ADA/WCAG basics).",
        href: "https://github.com/Shogo-nfrealmusic/ship-legal",
        icon: "legal",
        install: ["/plugin marketplace add Shogo-nfrealmusic/ship-legal", "/plugin install legal-check@ship-legal"],
      },
    ],
    tip: {
      before: "Then run",
      command: "/legal-check",
      after: "in your project. It also answers to /legal-check:legal-check.",
    },
    about: {
      steps: [
        {
          title: "Scan (read-only)",
          text: "A bundled shell script detects the stack, then collects evidence as file:line for every check. It skips node_modules, build output, lockfiles, and files over 1 MB, and it redacts secret values.",
        },
        {
          title: "Judge",
          text: "Claude reads only the files the scan points at, then applies fixed rules. Each check comes back as RISK (the code shows the problem; it gets a priority), CHECK (only a human can settle it, e.g. whether a testimonial is real, or a dashboard setting), PASS or N/A.",
        },
        {
          title: "Report, then ask once",
          text: "You get the summary table first, then one short block per RISK (Found / Risk / Fix), then one question: apply the fixes?",
        },
        {
          title: "Fix",
          text: "This only happens after you say yes. It edits your code with your stack's own idioms. It never runs installs, migrations, deploys, or git commits. Then it runs your project's own checks: npm run build/typecheck/test, pytest, node --check, …",
        },
        {
          title: "Human TODO",
          text: "A list of what code can't do. For example: rotate leaked keys, apply the new database rules, add your postal address, register a DMCA agent, answer the app-store rating questionnaires, get a lawyer's review.",
        },
      ],
      altInstall: {
        label: "Or copy the skill folder (in a terminal)",
        commands: [
          "git clone https://github.com/Shogo-nfrealmusic/ship-legal.git",
          "cp -R ship-legal/plugins/legal-check/skills/legal-check ~/.claude/skills/",
        ],
      },
      example: {
        question: "/legal-check",
        output: `legal-check · lovable · vite-react + supabase (lovable)
14 RISK (4 High) · 0 CHECK · 0 PASS · 10 N/A

 ID  Risk    Check                               Where
 S1  High    Secret keys exposed                 .env:3
 S2  High    Database open to anyone             supabase/migrations/…_init.sql:1
 S3  High    Admin area without auth             src/pages/Admin.tsx:8
 P2  High    Ad pixels without consent           index.html:10
 P5  Medium  Privacy policy & terms              (no /privacy, /terms)
 P6  Medium  Account deletion & data export      (none)
 ...
 A1  Medium  Accessibility basics                src/index.css:4
 P4  Low     Google Fonts from Google            index.html:8
N/A    S4 Card data · S5 Hosted auth · P1 Replay · ...`,
        source: "Real output on examples/lovable-vite-supabase, a Lovable-style React + Vite + Supabase app built with seeded traps. After yes, it edited 27 files and npm run typecheck and npm run build still passed. Full runs in the repo's examples/runs/.",
      },
      notes: [
        "This is not legal advice. It's an automated check of common traps, not a full legal review, and it can miss things. Have a lawyer review your policies and flows before you rely on them.",
        "Works across stacks: Next.js, React + Vite (Lovable / Bolt), plain HTML, Vue/Nuxt, SvelteKit, Astro, Remix, Expo (React Native), Flask, FastAPI, Django, Rails, Supabase, Firebase and v0 exports. Fixes were tested end to end on five: Next.js, Vite + Supabase, plain HTML, Expo + Firebase and FastAPI.",
        "The audit took 30–62 s in our runs. Applying the fixes took 2.5–6 min.",
        "Tip: before you say yes, press Shift+Tab until the footer says \"accept edits\", so it doesn't ask before every file edit.",
        "Fixes are drafts to review: policy, terms, refund and DMCA pages are full of TODO(legal-check) placeholders, and new database rules are written but not applied.",
        "It answers in the language you ask in, for example /legal-check このアプリ大丈夫？ gets a Japanese report.",
      ],
    },
  },
  {
    number: 7,
    slug: "07-llm-council",
    title: "/llm-council: make Claude argue with you, not agree",
    description:
      "A free Claude Code skill (MIT) by Shogo. One command sends your question to a council: five independent advisors, three anonymous reviewers and a chairman who makes the call.",
    date: "2026-09-28",
    keyword: "COUNCIL",
    tools: [
      {
        name: "/llm-council",
        what: "Pressure-tests a decision. Instead of one assistant telling you your idea sounds great, five advisors argue it from different angles, their answers are reviewed anonymously, and a chairman gives a verdict.",
        href: "https://github.com/Shogo-nfrealmusic/llm-council",
        icon: "council",
        install: ["/plugin marketplace add Shogo-nfrealmusic/llm-council", "/plugin install llm-council@llm-council"],
      },
    ],
    tip: {
      before: "Then run",
      command: "/llm-council:llm-council <your question>",
      after: "(or /llm-council if you copied the skill folder into ~/.claude/skills/).",
    },
    about: {
      steps: [
        {
          title: "Neutral brief",
          text: "Your question is rewritten without your own opinion (\"I'm sure\", \"Good idea?\"). You see the brief and what was removed. No advisor sees your original wording.",
        },
        {
          title: "Five advisors, independently",
          text: "Contrarian, First-principles thinker, Expansionist, Outsider and Executor each answer as a separate subagent. None can see the others. Each picks GO, NO-GO or CHANGE and gives a confidence.",
        },
        {
          title: "Anonymous review",
          text: "The five answers are shuffled and labelled A–E. Three reviewers critique them without knowing who wrote what, and are told to reward the strongest dissent, not the majority.",
        },
        {
          title: "Chairman",
          text: "A verdict (go / no-go / change it), the strongest objection still standing, what would change the decision, and 3 next steps.",
        },
      ],
      altInstall: {
        label: "Or copy the skill folder (in a terminal)",
        commands: [
          "git clone https://github.com/Shogo-nfrealmusic/llm-council.git",
          "cp -R llm-council/plugins/llm-council/skills/llm-council ~/.claude/skills/",
        ],
      },
      example: {
        question:
          "/llm-council I'm raising my app's price from $9 to $19 a month next week. I'm sure users will pay. Good idea?",
        output: `VERDICT: CHANGE IT — Charge $19 to new signups next week; existing users stay at $9 for now.
...
NEXT 3 STEPS:
1. Pull subscriber count, monthly churn and cost per user — you'll know whether $9 loses
   money.
2. Put $19 on new signups only and compare 2 weeks against the prior 4 — it works if
   revenue per visitor is at or above baseline.
3. Survey existing users on what price they'd accept (a price-sensitivity survey) — this
   works if at least 60% say $19 or less is acceptable.`,
        source: "Chairman output from a real run, trimmed. Full run in examples/03-demo-price-increase.md.",
      },
      notes: [
        "A run takes about 3 minutes and makes 9 subagent calls. It counts toward your Claude plan's usage.",
        "It's a thinking aid. It doesn't eliminate sycophancy: all advisors run on the same model family and can share a blind spot.",
      ],
      why: [
        "A Stanford study published in ",
        { text: "Science", href: "https://www.science.org/doi/10.1126/science.aec8352" },
        " (Cheng et al., March 26, 2026) tested 11 AI models: on average, they affirmed users' actions 49% more often than humans did. The idea comes from ",
        { text: "Andrej Karpathy's llm-council", href: "https://github.com/karpathy/llm-council" },
        ", where several models answer, rank each other anonymously and a chairman writes the final answer. This version runs inside Claude Code with subagents.",
      ],
    },
  },
  {
    number: 6,
    slug: "06-claude-code-plugins",
    title: "5 Claude Code plugins worth installing",
    description:
      "Less code, parallel PR review, memory across sessions, your Obsidian vault as memory, and Anthropic's official plugin directory. Each with the commands to install it.",
    date: "2026-09-27",
    keyword: "PLUGINS",
    tools: [
      {
        name: "Ponytail",
        what: "Makes Claude Code write less code. The README's benchmark: ~54% less code and ~20% lower cost (Claude Code, Haiku 4.5, 12 tasks). Results vary by model.",
        href: "https://github.com/DietrichGebert/ponytail",
        icon: "scissors",
        install: ["/plugin marketplace add DietrichGebert/ponytail", "/plugin install ponytail@ponytail"],
      },
      {
        name: "Code Review (by Anthropic)",
        what: "Run /code-review on a pull request: 4 agents review it in parallel (2 check your CLAUDE.md rules, 2 look for bugs), and each flagged issue is validated before it's reported.",
        href: "https://github.com/anthropics/claude-code/tree/main/plugins/code-review",
        icon: "review",
        install: ["/plugin marketplace add anthropics/claude-code", "/plugin install code-review@claude-code-plugins"],
      },
      {
        name: "Claude Mem",
        what: "Carries context from your past sessions into new ones.",
        href: "https://github.com/thedotmack/claude-mem",
        icon: "brain",
        install: ["/plugin marketplace add thedotmack/claude-mem", "/plugin install claude-mem"],
        note: "Its hosted memory needs a sign-in and is free for your first 30 days. After that, memory falls back to your Anthropic plan unless you subscribe.",
      },
      {
        name: "Obsidian Second Brain",
        what: "Turns your Obsidian vault into long-term memory for Claude Code. 47 commands.",
        href: "https://github.com/eugeniughelbur/obsidian-second-brain",
        icon: "notebook",
        install: [
          "/plugin marketplace add eugeniughelbur/obsidian-second-brain",
          "/plugin install obsidian-second-brain@obsidian-second-brain",
        ],
        note: "Then follow the README to point it at your vault.",
      },
      {
        name: "Official marketplace",
        what: "Anthropic's managed plugin directory, with 300+ plugins listed. Install any of them with one command.",
        href: "https://github.com/anthropics/claude-plugins-official",
        icon: "store",
        install: ["/plugin install {plugin-name}@claude-plugins-official"],
        note: "Anthropic says it doesn't control what's inside these plugins and can't verify they work as intended, so check each one before you install it.",
      },
    ],
    tip: { before: "Run", command: "/plugin", after: "inside Claude Code to browse and manage your plugins." },
  },
  {
    number: 5,
    slug: "05-3d-website-kit",
    title: "The $5,000 3D website: build it yourself",
    description:
      "The kit behind the reel: how I build scroll-driven 3D product sites with Claude Code and Higgsfield. The guide, a working starter project and the exact prompts, tested on a second product.",
    date: "2026-09-27",
    keyword: "3D",
    tools: [],
    kit: { href: "https://fantastic-mover-4460.kit.com/products/3d-website-kit?promo=3DWEBSITE", price: "$29", offer: { code: "3DWEBSITE", until: "October 31", regular: "$54" }, cover: "/free/05/s0_f_0000.jpg" },
  },
  {
    number: 4,
    slug: "04-tiny-team-ai",
    title: "Run your business with a tiny team + AI",
    description:
      "The free guide from the reel: how two of us run a six-figure business with almost everything automated, and the exact tools we use.",
    date: "2026-09-27",
    keyword: "GUIDE",
    tools: [],
    guide: {
      kitUid: "3ba02ef07c",
      kitScript: "https://fantastic-mover-4460.kit.com/3ba02ef07c/index.js",
      cover: "/free/04-guide-cover.jpg",
      points: [
        "Sales & payments on autopilot",
        "Content that posts itself to Instagram and TikTok",
        "Money & expenses, synced from the bank",
        "Numbers you don't have to pull",
        "Every tool we use, and a 7-day plan to start",
      ],
    },
  },
  {
    number: 3,
    slug: "03-laya",
    title: "A free, open-source Jev that runs on your own computer",
    description:
      "Laya is a local System 1 decision model: typed answers about any text in one pass, about 30 ms. Apache-2.0, pip install, MCP server for Claude Code.",
    date: "2026-09-26",
    keyword: "LOCAL",
    tools: [
      {
        name: "Laya",
        what: "Answers typed questions about any text (intent, urgency, churn risk…) without generating text. Install: pip install laya, then laya \"your text\" --preset triage --predict. The base model is near chance out of the box: fine-tune it on your own data with the notebook in the repo, and Claude Code can do that for you.",
        href: "https://github.com/NandhaKishorM/laya",
        icon: "cpu",
      },
    ],
  },
  {
    number: 2,
    slug: "02-claude-design-tools",
    title: "5 free tools that turn Claude into a designer",
    description:
      "Design rules, design commands, real-browser testing, real-site design systems and photo-to-3D. All open source.",
    date: "2026-09-26",
    keyword: "DESIGN",
    tools: [
      {
        name: "Taste Skill",
        what: "Design rules so Claude stops shipping generic, AI-looking sites.",
        href: "https://github.com/Leonxlnx/taste-skill",
        icon: "palette",
      },
      {
        name: "Impeccable",
        what: "24 design commands like polish, audit and bolder, plus a live mode to try variations in your browser.",
        href: "https://github.com/pbakaus/impeccable",
        icon: "wand",
      },
      {
        name: "Playwright CLI",
        what: "Claude opens real browsers, clicks through your site and takes screenshots to check it works.",
        href: "https://github.com/microsoft/playwright-cli",
        icon: "browser",
      },
      {
        name: "Awesome DESIGN.md",
        what: "DESIGN.md files based on real sites like Apple, Claude and Stripe, so Claude can match a style.",
        href: "https://github.com/VoltAgent/awesome-design-md",
        icon: "file",
      },
      {
        name: "img2threejs",
        what: "Give it one photo and Claude rebuilds it as an interactive 3D model, entirely in code.",
        href: "https://github.com/img2threejs/img2threejs",
        icon: "cube",
      },
    ],
  },
  {
    number: 1,
    slug: "01-freellmapi",
    title: "The free tiers of 34 AI providers in one endpoint",
    description:
      "One OpenAI-compatible endpoint over the free tiers of 34 providers. Claude Code plugs in with one command.",
    date: "2026-09-26",
    keyword: "FREE",
    tools: [
      {
        name: "FreeLLMAPI",
        what: "When one free model hits its limit, it switches to the next and leaves a handoff note so the new model keeps your context.",
        href: "https://github.com/tashfeenahmed/freellmapi",
        icon: "plug",
      },
    ],
  },
];

/** Newest first. */
export function getDrops(): FreeDrop[] {
  return [...drops].sort((a, b) => b.number - a.number);
}

export function getDrop(slug: string): FreeDrop | undefined {
  return drops.find((drop) => drop.slug === slug);
}

export function getDropByNumber(value: string): FreeDrop | undefined {
  if (!/^\d{1,3}$/.test(value)) return undefined;
  return drops.find((drop) => drop.number === Number(value));
}

export const pad = (n: number) => String(n).padStart(2, "0");

/** What a drop contains, for the cover badge and the page header: "build kit", "free guide", "12 checks", "1 tool". */
export function dropKind(drop: FreeDrop): string {
  if (drop.kit) return "build kit";
  if (drop.breakdown) return "full breakdown";
  if (drop.guide) return "free guide";
  const checks = drop.about?.checks?.length;
  if (checks) return `${checks} ${checks === 1 ? "check" : "checks"}`;
  return `${drop.tools.length} ${drop.tools.length === 1 ? "tool" : "tools"}`;
}

export function formatDropDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
