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
  | "event"
  | "robot";

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
  /** replaces "Who gets it" (e.g. "Price & access") */
  whoLabel?: string;
  /** e.g. the safety rules for an agent */
  more?: { label: string; text: RichText };
  /** further labelled lines, shown after `more` */
  details?: { label: string; text: RichText }[];
  why?: RichText;
  /** replaces "Why it matters" (e.g. "Watch out") */
  whyLabel?: string;
};

export type DropBreakdown = {
  /** "The 60-second version": one line per bullet */
  tldr: RichText[];
  /** `unit` names the items in the section label; default "launch" / "launches" */
  sections: { title: string; items: BreakdownItem[]; unit?: { one: string; many: string } }[];
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
    number: 27,
    slug: "27-claude-video-edit",
    title: "Edit a cinematic reel with Claude: the workflow, the tools, and 10 prompt rules for AI shots",
    description:
      "Claude can edit video. This reel was cut, colored, timed to the beat and sound-designed by Claude Opus 5.5 in Claude Code, with Higgsfield and ElevenLabs connected for the shots and sounds my footage didn't have. The workflow step by step, a prompt template, and 10 rules for camera angle, light, speed, water and people that make AI shots blend into real footage.",
    date: "2026-10-10",
    keyword: "EDIT",
    tools: [
      {
        name: "Claude Code (Opus 5.5)",
        what: "Does the editing: reads every clip in a folder, finds the beats in the music, cuts, colors and renders with ffmpeg. You give notes like you would to an editor.",
        href: "https://claude.com/claude-code",
        icon: "scissors",
      },
      {
        name: "Higgsfield",
        what: "Generates the shots you couldn't film (night aerials, a skyline penthouse, car inserts). Connect it to Claude and Claude writes the prompts and pulls the clips in. Models used: Seedance 2.5, Kling 3, Veo 3.1.",
        href: "https://higgsfield.ai?fpr=shogo-3d2023",
        icon: "wand",
        note: "Affiliate link.",
      },
      {
        name: "ElevenLabs",
        what: "Sound effects and music from a text prompt: keystrokes, an engine rev, a low hit on a beat. Connect it to Claude and it places each sound on the exact frame.",
        href: "https://try.elevenlabs.io/xf5rkcdkc5ar",
        icon: "plug",
        note: "Affiliate link.",
      },
    ],
    about: {
      intro: [
        "Most people don't know Claude can edit video. You hand it your footage and a reference, it does the cutting, the color and the timing, and you give notes. Below is exactly how this reel was made, and the prompt rules that made the AI shots look like they came from my phone.",
      ],
      steps: [
        { title: "Connect the tools", text: "In Claude, connect Higgsfield and ElevenLabs as connectors. Claude Code also needs ffmpeg installed; it does all the cutting and color with it." },
        { title: "Give it your footage and a reference", text: "Point Claude Code at your clips folder and a reel whose pace you want. It makes a contact sheet of every clip (4 frames each; I had 348 clips) and catalogs what's in each: subject, light, camera move, and a 1-5 quality score." },
        { title: "Show it your past edits", text: "Give it 5 to 10 videos you've already posted. Claude matches them against the raw clips frame by frame, so it knows which clips and which exact moments you actually use (the top of a squat, not the walk to the bar)." },
        { title: "Let it find the beat", text: "Claude measures where the music hits, to 0.01s, and puts every cut on one. Big hits get a one-frame flash or a quick zoom punch; the cut lands on the hit, not inside the shot." },
        { title: "Match your color, don't invent one", text: "Instead of a \"cinematic\" preset, Claude measures your grade from your past edits (same clip, raw vs posted) and applies it, plus a per-shot white balance so snow is white and red lights stay red." },
        { title: "Fill the gaps with AI shots", text: "For shots you can't film, Claude prompts Higgsfield (rules below), checks each result frame by frame, keeps the cleanest 0.3 to 0.6 seconds and grades it like your footage." },
        { title: "Add sound last, and little", text: "ElevenLabs makes the sounds. Keep only the ones that match a picture one-to-one, like an engine rev on the pedal shot. Ten different effects made it worse; two made it better." },
        { title: "Score every version", text: "Give each version a score and say what's wrong. This reel took about 20 versions. The big jumps came from replacing weak shots, not from adding effects." },
      ],
      runAll: {
        title: "The prompt template",
        items: [
          {
            text: ["Write every AI shot in this order. One subject, one action, one camera move:"],
            command: "[shot size + angle], [subject + action], [place + time], [light: source, direction, color], [camera move + speed], [look: e.g. realistic iPhone night footage, natural colors, deep blacks], no people / seen from behind, no text, no logos, no license plate",
          },
          {
            text: ["A real one from this reel (Higgsfield, Seedance 2.5, 1:1, 4s):"],
            command: "Empty luxury private gym on a high floor at night, black squat racks, floor-to-ceiling windows overlooking the city lights of Tokyo, dim warm downlights, slow smooth dolly forward between the racks. Realistic iPhone night footage, natural colors, slightly dark. No text, no logos, no people.",
          },
        ],
      },
      checks: [
        {
          title: "Name the angle",
          why: ["The angle sets the feeling more than the subject. Low angle = power (cars, a barbell), eye level = documentary, high or aerial = scale. If you don't say it, you get a flat eye-level shot."],
          how: ["Use camera words: \"low rear three-quarter\", \"top-down\", \"from the back of the arena\", \"aerial drone, slowly flying toward\"."],
        },
        {
          title: "Name the light source and its direction",
          why: ["\"Cinematic lighting\" means nothing to the model. A named source gives you shadows and contrast that match real footage."],
          how: ["\"Single hard overhead spotlight\", \"backlit by the city skyline\", \"warm cabin windows\", \"one streetlight behind him\"."],
        },
        {
          title: "Add something that reflects",
          why: ["Reflections are the cheapest way to get depth and a premium look: highlights double, blacks stay black."],
          how: ["\"Wet asphalt\", \"light rain\", \"puddles reflecting neon\", \"thin haze in the air\", \"glass floor-to-ceiling windows\"."],
        },
        {
          title: "Describe speed in real terms, then retime in the edit",
          why: ["Fast action in 4 to 5 seconds smears and warps. Movement rendered at a normal pace looks real, and you can speed it up afterwards."],
          how: ["Ask for the motion plainly (\"the tachometer needle sweeps from idle to the redline\", \"the rotor starts spinning faster\"), then speed it up 2x to 8x in the edit. For dust, water or steam, add \"slow motion\"."],
        },
        {
          title: "Pick the moment before water and particles break",
          why: ["Waves, chalk dust, steam and smoke look right for about a second, then start to melt or loop."],
          how: ["Watch at quarter speed and use the 0.3 to 0.6 seconds right after the burst or the crash, before the shape goes soft. Close, dark waves hold up better than wide bright ones."],
        },
        {
          title: "One camera move per shot",
          why: ["Two moves in one prompt (push in and orbit) is where buildings bend and wheels wobble."],
          how: ["Pick one: \"slow push-in\", \"tracking alongside\", \"static locked-off\". Add any extra push or zoom in the edit."],
        },
        {
          title: "Keep faces and hands out",
          why: ["Faces and close-up hands are where viewers spot AI first, and they won't look like you."],
          how: ["\"Seen from behind\", \"silhouette\", \"no people\". If a face still shows up (it did in my arena shot), crop it out or don't use the shot."],
        },
        {
          title: "Ask for your footage's look, not a film look",
          why: ["A shot that looks better than the rest of your video stands out as much as a bad one."],
          how: ["If you shoot on a phone: \"realistic iPhone night footage, natural colors, slightly underexposed, subtle noise\". Save \"ARRI, anamorphic\" for when your own footage is like that."],
        },
        {
          title: "Exclude text, logos and plates, then check anyway",
          why: ["Models invent signs, logos and fake license plates, which look wrong and can be a problem."],
          how: ["Add \"no text, no logos, no license plate, no registration numbers\". Still check every frame; one car shot came back with a plate and had to be covered."],
        },
        {
          title: "Generate in your final aspect ratio",
          why: ["Cropping a 16:9 shot to a square throws away the subject and the composition."],
          how: ["Set 1:1 or 9:16 in the generator to match the post, and put the subject in the center of frame in the prompt."],
        },
      ],
      notes: [
        "Sound prompts (ElevenLabs) work the same way: the sound, the perspective and the length, e.g. \"Porsche flat-six engine rev from idle to high rpm, interior perspective, 1.5 seconds\". Place the loudest moment on the cut.",
        "The Higgsfield and ElevenLabs links above are affiliate links: if you sign up through them, I may earn a commission at no extra cost to you. I only list tools I used for this video.",
        "An independent guide by @copilot_shogo. Not affiliated with Anthropic, Higgsfield or ElevenLabs.",
      ],
    },
  },
  {
    number: 26,
    slug: "26-prompt-motion",
    title: "Prompt Motion: 230+ Claude motion videos, each with its prompt",
    description:
      "Prompt Motion is a free gallery of motion videos made with Claude Opus 5.5. Every video shows the full prompt (or skill) behind it, with a Copy button, credited to the creator who posted it on X. The three pieces from the reel, and how to use a prompt. An independent guide.",
    date: "2026-10-09",
    keyword: "MOTION",
    tools: [
      {
        name: "Prompt Motion",
        what: "The gallery: 232 videos as of Oct 9, 2026, every one with its full prompt and a Copy button. No login, no paywall. Curated by @p4nthera_.",
        href: "https://www.prompt-motion.com",
        icon: "palette",
      },
      {
        name: "Shape morphing through UI states",
        what: "By @twoclipping. One shape that never cuts, morphing through a dozen UI states. The prompt this reel was built from.",
        href: "https://www.prompt-motion.com/twoclipping-5cba86",
        icon: "wand",
      },
      {
        name: "Photo print app launch film",
        what: "By @twoclipping. A one-take launch film: wordmark, photos, liquid-glass UI, a framed print on a wall.",
        href: "https://www.prompt-motion.com/twoclipping-221cab",
        icon: "browser",
      },
      {
        name: "Jev engineering showreel",
        what: "By @polydao. A pitch-deck style explainer that animates itself.",
        href: "https://www.prompt-motion.com/polydao-7a572b",
        icon: "notebook",
      },
    ],
    about: {
      intro: [
        "Find a video you like, open it, copy the prompt, and start from that style instead of a blank page.",
      ],
      steps: [
        { title: "Pick one", text: "Browse the grid (filter by Prompt or Skill). Each card plays a preview." },
        { title: "Open it", text: "The page shows the creator, the full prompt (\"Show all\" expands it), and, for some, the model and stack used." },
        { title: "Copy and paste", text: "Hit Copy and paste it into Claude. Many prompts start by asking you for inputs (your states, colours, a song) before writing any code." },
        { title: "Make it yours", text: "Change the content, keep the motion rules. This reel used the shape-morph prompt's rules: one shape, closed-form springs, a cursor driving every change, last frame = first frame." },
      ],
      notes: [
        "All videos list Claude Opus 5.5 as the model. The stack is listed on some pages only (Remotion, HyperFrames, HTML and others).",
        "The videos belong to their creators. Prompt Motion collects them from posts on X and credits each one; you can suggest a post, reviewed by hand.",
        "The address is prompt-motion.com (with a hyphen). A different site with a similar name is not the same project.",
        "An independent guide by @copilot_shogo. Not affiliated with Prompt Motion or the creators.",
      ],
    },
  },
  {
    number: 25,
    slug: "25-monid",
    title: "Monid: one connection to 2,400+ paid tools for your AI agent",
    description:
      "Monid calls itself the OpenRouter for agent tools: your agent connects once and can discover, run and pay per use for about 2,400 endpoints from 87 providers (search, sales leads, SEO, social data, image and video generation, email and phone). How to connect it, what it costs, and what to watch out for. An independent guide.",
    date: "2026-10-08",
    keyword: "MONID",
    tools: [
      {
        name: "Monid",
        what: "monid.ai. One prepaid balance, pay per use, no subscriptions; Monid adds 10% on top of the provider price. Starts with $1 of free credit, no card. 2,442 endpoints from 87 providers on Oct 8, 2026.",
        href: "https://monid.ai",
        icon: "plug",
        install: ["claude mcp add --transport http monid https://mcp.monid.ai/v1"],
        note: "Then run /mcp in Claude Code, select monid and authenticate.",
      },
      {
        name: "Monid docs",
        what: "Other ways to connect: a Skill (tell your agent \"set up https://monid.ai/SKILL.md\"), the CLI (npm install -g @monid-ai/cli), the REST API, and Codex / ChatGPT / Claude.ai connectors.",
        href: "https://monid.ai/docs",
        icon: "file",
      },
      {
        name: "Monid on GitHub",
        what: "The open-source connector layer (MIT). \"OpenRouter, but for agent tools.\"",
        href: "https://github.com/monid-ai/monid",
        icon: "cpu",
      },
    ],
    about: {
      intro: ["Instead of signing up for a dozen APIs, your agent finds the right tool while it works, runs it, and pays per use from one balance."],
      steps: [
        { title: "Discover", text: "The agent searches the catalog for a tool that fits the task. Free." },
        { title: "Inspect", text: "It reads the tool's inputs and price before running. Free." },
        { title: "Run", text: "It runs the tool and the cost comes off your balance. Failed provider calls are not charged." },
      ],
      notes: [
        "Prices are per call, per result or per unit (e.g. per second of a phone call), and they change. A few items renew: a phone number is $2/month until released.",
        "Your balance can go negative. Start small and watch your usage; a public spending-limit setting was not found in the docs.",
        "Tools are third-party providers that Monid brokers; some are web scrapers, so each platform's terms are your responsibility.",
        "Monid has raised $7.7M (pre-seed + seed), led by Long Journey Ventures with Madrona and 1984 Ventures, per the company's launch video.",
        "An independent guide by @copilot_shogo. Not affiliated with Monid.",
      ],
    },
  },
  {
    number: 24,
    slug: "24-cua-spaces",
    title: "Cua Spaces: give your AI agent its own computer",
    description:
      "Cua Spaces gives AI agents like Claude Code, Codex, Cursor and Gemini CLI their own desktop: a macOS VM (or Linux container) running on your Mac. You share the screen with your own cursor and can step in anytime. What it does, what it needs, and how to start. An independent guide.",
    date: "2026-10-07",
    keyword: "SPACE",
    tools: [
      {
        name: "Cua Spaces",
        what: "By Cua (YC). Gives AI agents (Claude Code, Codex, Cursor, Gemini CLI and others, via the Cua MCP server) their own desktop: a macOS VM (or Linux container) running on your Mac. Free on your own machines.",
        href: "https://spaces.cua.ai",
        icon: "robot",
      },
      {
        name: "Cua on GitHub",
        what: "The Cua repository (trycua/cua). Spaces is source-available under FSL-1.1-MIT.",
        href: "https://github.com/trycua/cua",
        icon: "plug",
      },
    ],
    tip: {
      before: "From our own test: in Claude Code, a project-scoped .mcp.json pointing at",
      command: "cua mcp --sandbox <name>",
      after: "keeps your global config untouched.",
    },
    about: {
      intro: [
        "Your agent gets a computer of its own instead of yours. It works in a separate desktop on your Mac, and you can watch and take over at any point.",
      ],
      steps: [
        { title: "Share the screen", text: "You and your agent each have your own cursor in the Space. Step in anytime, then hand it back." },
        { title: "Teleport", text: "Moves a signed-in app session (Chrome, Slack, Notion, VS Code, Claude Code…) into the Space. Nothing is read until you approve, and sensitive items need Touch ID." },
        { title: "More Spaces", text: "Add a spare Mac you own (e.g. a Mac mini) as a host for more Spaces. Max 2 macOS VMs per Mac (Apple's license)." },
        { title: "How to start", text: "Download from spaces.cua.ai → turn telemetry off in Welcome → create a Space (the macOS 26-slim image is a large download) → let the installer connect your agent (Claude Code etc.) through the Cua MCP server." },
      ],
      notes: [
        "Needs a Mac with macOS 26 or later. macOS Spaces need Apple silicon; Linux Spaces run via Docker or Podman.",
        "Early software (v0.7). Start with things you don't mind the agent touching.",
        [
          "Anonymous usage telemetry is on by default. Turn it off in Settings, with ",
          { code: "cua telemetry off" },
          ", or with ",
          { code: "DO_NOT_TRACK=1" },
          ".",
        ],
        "Free on your own machines. The hosted relay is free during early access; cloud Spaces are billed by your cloud provider.",
        "An independent guide by @copilot_shogo. Not affiliated with Cua.",
      ],
    },
  },
  {
    number: 23,
    slug: "23-auday",
    title: "Auday: turn your Apple Watch into an all-day AI recorder",
    description:
      "Auday records audio on your Apple Watch, transcribes and searches it on your iPhone, and links what you said to your heart rate, stress estimate and places. No servers; AI features use your own API key. Price, what it can and can't do, and privacy notes. An independent guide.",
    date: "2026-10-06",
    keyword: "WATCH",
    tools: [
      {
        name: "Auday on the App Store",
        what: "One-time purchase, no subscription: $9.99 launch price in the US (¥1,500 in Japan) on Oct 6, 2026; regular price $19.80. Needs iOS 18+ and an Apple Watch with watchOS 11+.",
        href: "https://apps.apple.com/us/app/auday-all-day-watch-recorder/id6814210373",
        icon: "event",
      },
      {
        name: "auday.ai",
        what: "The official site and FAQ: how recording, sync, stress estimates, storage and privacy work.",
        href: "https://auday.ai",
        icon: "browser",
      },
    ],
    about: {
      intro: ["Your Watch records; your iPhone transcribes, indexes and searches it locally. Ask what you were talking about when your heart raced."],
      steps: [
        { title: "Record", text: "Start recording on the Watch. Tap to mark a moment you want the AI to pay attention to." },
        { title: "Sync and transcribe", text: "Recordings sync to the iPhone about every 15 minutes and are transcribed there (not live, word by word)." },
        { title: "Look back", text: "A timeline of conversations, highlights, body and places; search by meaning; a daily reflection; chat with citations back to the original words." },
        { title: "Connect AI", text: "Summaries, highlights and chat use a provider you choose with your own API key." },
      ],
      notes: [
        "Transcription is Chinese and English only for now, with no speaker separation.",
        "Stress is an on-device estimate from heart rate and HRV against your own baseline. Not a live monitor and not clinically validated.",
        "Battery: in one team test, a Series 11 (GPS) recorded 12.5 hours and went from 100% to 49%. Not a guaranteed runtime.",
        "Privacy: original audio stays on your devices and there are no Auday servers, but text and context go to the AI provider you configure, and your own key does not guarantee zero retention. There is no backup: the archive is excluded from iCloud.",
        "Recording people may require their consent where you live.",
        "Made by an independent developer (BaiFu / GUO HANGJIANG), also the creator of MiroFish and BettaFish on GitHub. An independent guide by @copilot_shogo; not affiliated with Auday.",
      ],
    },
  },
  {
    number: 22,
    slug: "22-dreamwork",
    title: "Dreamwork: an AI that tailors and submits your job applications",
    description:
      "Dreamwork scans company career pages every day, writes a tailored resume, cover letter and answers for each role, fills out the application and submits it, with your approval or on autopilot. It also has an MCP server so you can run it from Claude. Plans and what to check before you turn on autopilot. An independent guide.",
    date: "2026-10-05",
    keyword: "DREAMWORK",
    tools: [
      {
        name: "Dreamwork",
        what: "Upload one resume to start. Free plan; Pro $33/mo (50 Autopilot applications a month) and Dreamer $126/mo (300) as of Oct 5, 2026.",
        href: "https://dreamworkhq.com",
        icon: "robot",
      },
      {
        name: "Dreamwork MCP server",
        what: "Run your job search from inside Claude or another MCP client.",
        href: "https://dreamworkhq.com",
        icon: "plug",
        note: "Add it as an MCP server in your client's config with the command: npx -y @dreamworkhq/mcp",
      },
    ],
    about: {
      intro: ["You upload one resume; it finds roles, writes the application for each one and submits it. Recruiter replies come back to one inbox."],
      steps: [
        { title: "Upload a resume", text: "One resume is the starting point for every tailored version." },
        { title: "Matching", text: "It crawls company career sites daily. The site lists more than 1.4 million active roles, including companies like Anthropic, NVIDIA and Stripe." },
        { title: "Tailor and apply", text: "For each role it writes a tailored resume, cover letter and answers, then fills out the employer's form." },
        { title: "Approve or autopilot", text: "Approve applications one by one, or turn on Autopilot within your plan's monthly limit." },
      ],
      notes: [
        "Read what it sends before turning on Autopilot: everything goes out under your name.",
        "Built by Colin Johnson (co-founder and CEO, previously at Apple and American Express) and Ben Adamsky (co-founder and CTO, a two-time founder); company Ponder Labs, Inc.",
        "Plans and limits change; check the site for current pricing.",
        "An independent guide by @copilot_shogo. Not affiliated with Dreamwork.",
      ],
    },
  },
  {
    number: 20,
    slug: "20-strix",
    title: "Strix: open-source AI that pentests your own app",
    description:
      "Strix is a team of autonomous AI agents that test your app like real hackers: they run your code, find vulnerabilities and prove them with working exploits. The same kind of tool attackers now use, pointed at your own code. How it works and how to run it. An independent guide.",
    date: "2026-10-04",
    keyword: "STRIX",
    tools: [
      {
        name: "Strix",
        what: "Open-source (Apache-2.0) AI penetration-testing agents. Run your code dynamically, find and validate vulnerabilities with real proof-of-concepts, and get remediation guidance. 66k+ GitHub stars.",
        href: "https://github.com/usestrix/strix",
        icon: "shield",
      },
    ],
    about: {
      intro: [
        "In the AI era, attackers have autonomous agents too. In September 2026 a single operator ran open-source AI agents (one of them Strix) against online retailers, compromising at least 27 companies in under a week and taking 600,000+ card records (Gambit Security). The defensive move is to run the same kind of tool against your own app first.",
      ],
      steps: [
        { title: "AI hackers, on your code", text: "Strix agents act just like real hackers: reconnaissance, exploitation and validation out of the box. Findings come with a working proof-of-concept, not a false positive." },
        { title: "Real exploit in the demo", text: "In Strix's own demo it finds a business-logic bug that lets a shopper place an order with a negative total (−$149.90), confirms it, and writes a CVSS-scored vulnerability report." },
        { title: "Fix and gate your PRs", text: "It gives remediation guidance, and the open-source tool runs in GitHub Actions on every pull request (with your own LLM key) to block insecure code before it ships. One-click autofix PRs are a Strix Cloud feature." },
        { title: "Run it yourself", text: "Needs Docker and an LLM API key (OpenAI, Anthropic, Google, etc.). Strix Cloud needs neither." },
      ],
      altInstall: {
        label: "Install & first scan · needs Docker + an LLM key",
        commands: [
          "curl -sSL https://strix.ai/install | bash",
          "export STRIX_LLM=\"openai/gpt-5\"",
          "export LLM_API_KEY=\"your-api-key\"",
          "strix --target ./app-directory",
        ],
      },
      notes: [
        "Only ever run Strix against systems you own or are explicitly authorized to test. Unauthorized testing is illegal.",
        "Star count and the attacker-campaign figures are as of early October 2026.",
        "An independent guide by @copilot_shogo. Not affiliated with Strix.",
      ],
    },
  },
  {
    number: 19,
    slug: "19-underdog",
    title: "Underdog: a private AI that runs on your own Mac",
    description:
      "Underdog is a personal AI for email, calendar, meeting notes and errands whose model runs on your own computer. Backed by a16z, Naval, and the CEOs of Stripe and Vercel. We ran its 27B model with the network blocked. What it is, what we measured, and how to try it. An independent guide.",
    date: "2026-10-03",
    keyword: "UNDERDOG",
    tools: [
      {
        name: "Underdog",
        what: "A private personal AI by Sigil Wen. 100% local AI: the model runs on your Mac, and your data isn't sent to a cloud AI. Free; invite-only beta for Mac (Windows in beta).",
        href: "https://underdog.ai",
        icon: "shield",
      },
      {
        name: "Underdog 27B weights",
        what: "The 27B model (MLX 4-bit, ~16 GB, Apache-2.0) on Hugging Face, by Conway Research. Runs on Apple silicon Macs.",
        href: "https://huggingface.co/ConwayResearch/Underdog-27B-1.0",
        icon: "cpu",
      },
    ],
    about: {
      intro: [
        "Founder Sigil Wen got GPT-2 running on an Apple Watch in 2023. Underdog's backers include Andreessen Horowitz, Khosla Ventures, the Anthology fund (Anthropic and Menlo), Patrick Collison, Naval Ravikant and Guillermo Rauch.",
      ],
      steps: [
        { title: "What we measured", text: "On a MacBook Pro (M3 Max, 48 GB) with the network blocked (underdog.ai couldn't even resolve), Underdog 27B wrote a 3-sentence email at 21.9 tokens/sec with plain MLX. The small Woof 4B ran at about 111 tokens/sec." },
        { title: "The Opus claim", text: "The founder says Underdog 27B beats Claude Opus 4.6, the top model six months ago. The published comparison is the base model (Qwen 3.8 27B) on the Artificial Analysis index: 33.7 vs an estimated 31.9. Opus still leads on some benchmarks." },
        { title: "Husky", text: "Underdog's own inference engine. In their tests it runs the small Woof 4B model up to 4.5x faster than Apple's MLX (range 1.3-4.5x)." },
        { title: "Privacy", text: "Underdog says there are no Underdog servers for personal data; context is stored on device, encrypted. Email sync and bookings still talk to your providers and websites." },
      ],
      altInstall: {
        label: "Run the 27B model yourself · Apple silicon, ~16 GB",
        commands: ["pip install mlx-lm", "mlx_lm.generate --model ConwayResearch/Underdog-27B-1.0 --prompt \"Hello\""],
      },
      notes: [
        "The Underdog app is invite-only for now.",
        "An independent guide by @copilot_shogo. Not affiliated with Underdog.",
      ],
    },
  },
  {
    number: 18,
    slug: "18-pickle",
    title: "Pickle: a personal AI you raise, with AI friends",
    description:
      "Pickle is an iPhone app where your personal AI grows with you, and your friends' AIs are contacts too. Ask yours to plan something and it negotiates with theirs. How it works, how it protects your accounts, and where it's available. An independent guide.",
    date: "2026-10-03",
    keyword: "PICKLE",
    tools: [
      {
        name: "Pickle: Raise your AI",
        what: "A personal AI for iPhone by Pickle, Inc. It starts at Lv. 1, learns from what you share, and can book, call and pay for you, checking with you before anything is spent. Your friends' Pickles show up as contacts.",
        href: "https://pickle.com",
        icon: "robot",
      },
    ],
    about: {
      intro: [
        "Pickle, Inc. is a Y Combinator company (Winter 2025), led by co-founder and CEO Daniel Park, who describes himself as a med school dropout. The same team previously open-sourced Glass, a desktop AI assistant that passed 7,000 GitHub stars.",
        "Pickle's pitch: planning dinner with four friends takes forty messages. Tell your Pickle once, and it talks to your friends' Pickles, works out when and where, and gets it ready to book.",
      ],
      steps: [
        { title: "Raise it", text: "Every Pickle is born at Lv. 1 and earns your trust over time; the more it knows you, the more it can do." },
        { title: "AI talks to AI", text: "In the official demo, one request (\"plan a trip with Marcus, Mina and Emma\") becomes three Pickle-to-Pickle chats, one plan card, and a confirmed booking after you say yes." },
        { title: "Clone agent", text: "When it talks to someone else it sends a clone with the same memory but far fewer tools: it can read and talk, but can't book, pay or change files." },
        { title: "Credential Enclave", text: "Account tokens are used only inside an AWS Nitro Enclave. The enclave code is open source (Apache-2.0) and can be checked against what's running via attestation. The iOS app itself isn't open source yet." },
        { title: "Sharing controls", text: "You set how much strangers and friends can hear, leave per-person instructions, and keep a Never list." },
      ],
      notes: [
        "Free to download on iPhone, with an optional Pickle Plus subscription ($8.99/month or $59.99/year).",
        "For now it's open only in the San Francisco Bay Area and listed only on the US App Store.",
        "The reel uses Pickle's official app recordings; we haven't used the app ourselves.",
        "An independent guide by @copilot_shogo. Not affiliated with Pickle.",
      ],
    },
  },
  {
    number: 17,
    slug: "17-clef",
    title: "Clef: Cloudflare's open-source decision model",
    description:
      "Clef and Clef-flash are open-source decision models from Cloudflare. Instead of writing text, they return a probability for every allowed answer, which makes them fast, cheap building blocks for agent workflows. What they do, what we got when we ran them, and how to try them. An independent guide.",
    date: "2026-10-03",
    keyword: "CLEF",
    tools: [
      {
        name: "Clef / Clef-flash (Cloudflare)",
        what: "Decision models announced October 1, 2026. Give them a state (text, JSON or images) and typed questions (yes/no, choice, score); they return a probability per option in one pass. Apache-2.0 weights on Hugging Face; hosted on Workers AI.",
        href: "https://blog.cloudflare.com/clef-decision-models/",
        icon: "cpu",
      },
    ],
    about: {
      intro: [
        "LLMs are great at open-ended work, but agents also make lots of small, bounded decisions: is this urgent, which team, how severe. Clef is built only for that, and it's compatible with Typesafe AI's Jev API.",
      ],
      steps: [
        { title: "What we got", text: "Cloudflare's own example ticket (\"Checkout has been failing for every customer for the last hour\") on Workers AI: urgent 99.1%, team technical 80.9%, severity Critical 97.0%. Three runs, identical numbers." },
        { title: "Two sizes", text: "Clef (Qwen3.8-27B base) for precision, Clef-flash (Qwen3.5-9B base) for latency. In Cloudflare's own tests, Clef-flash's median latency was 38.8 ms; Jev's hosted API was 524.1 ms (Cloudflare notes these aren't directly comparable)." },
        { title: "The index", text: "In Cloudflare's own run of the Jev Decision Index, Clef scores 61.21 vs Jev 57.91. These results are self-reported and not on the upstream board; Jev still wins several benchmarks, especially reasoning-heavy ones." },
        { title: "Images and context", text: "Clef has a vision encoder (up to 4 images per request) and a 64k context window on Workers AI." },
        { title: "Run it", text: "Workers AI models @cf/cloudflare/clef ($0.24 / M input tokens) and @cf/cloudflare/clef-flash, or download the Apache-2.0 weights from Hugging Face." },
      ],
      notes: [
        "Cloudflare also announced a reinforcement-learning fine-tuning service for Clef, starting as a hands-on offering.",
        "An independent guide by @copilot_shogo. Not affiliated with Cloudflare.",
      ],
    },
  },
  {
    number: 16,
    slug: "16-e2e",
    title: "e2e: the open-source AI testing framework",
    description:
      "e2e by TesterArmy lets you describe a goal in plain English and an AI agent drives your web or mobile app to reach it. Verified agent steps replay on the next run with no model call, and the agent takes over when your UI changes. How it works, what it costs, and how to start. An independent guide.",
    date: "2026-10-03",
    keyword: "E2E",
    tools: [
      {
        name: "e2e by TesterArmy",
        what: "An open-source (Apache-2.0) end-to-end testing framework for web and mobile apps. Mix agent steps like agent.act() and agent.assert() with normal locators and assertions in the same test.",
        href: "https://github.com/tester-army/e2e",
        icon: "browser",
      },
    ],
    about: {
      intro: [
        "Selector-based tests break when the UI changes. With e2e you write the goal (\"upgrade the workspace to the Pro plan\") and an agent clicks through the app. Deterministic checks still run as usual.",
      ],
      steps: [
        { title: "Describe the goal", text: "agent.act('upgrade the workspace to the Pro plan') drives the app; agent.assert() checks the result in plain English." },
        { title: "Mix in real assertions", text: "Locators and expect() work in the same test, so the parts you want deterministic stay deterministic." },
        { title: "Replay cache", text: "Once a later check confirms an agent step worked, its actions are recorded. The next run replays that step with no model call. agent.assert always runs live." },
        { title: "When the UI changes", text: "If a recorded control or end state no longer matches, the agent takes over from the current screen." },
        { title: "Web, iOS, Android, CI", text: "Playwright for web (Chromium, Firefox, WebKit); iOS simulators and Android emulators for mobile; hosted options via Kernel and EAS Simulators; runs locally or in CI." },
        { title: "Your own model", text: "On your machine, sign in with ChatGPT Plus or Pro, GitHub Copilot, or SuperGrok / X Premium+. In CI, use an API key (e.g. Vercel AI Gateway). Claude subscriptions aren't supported." },
      ],
      altInstall: {
        label: "Get started · Node.js 22.12+",
        commands: ["npx e2e init", "npx e2e login openai   # optional: use your ChatGPT plan", "npx e2e run"],
      },
      notes: [
        "Still before 1.0: APIs and config can change between minor releases.",
        "The CLI sends anonymous usage telemetry by default; turn it off with npx e2e telemetry disable.",
        "In our test: the first run's agent step took 4 model calls; the replay took none (the live agent.assert took 1).",
        "An independent guide by @copilot_shogo. Not affiliated with TesterArmy.",
      ],
    },
  },
  {
    number: 15,
    slug: "15-quiver-arrow",
    title: "QuiverAI Arrow 2: AI that draws real, editable SVG",
    description:
      "Most AI image tools give you pixels. QuiverAI's Arrow 2 generates real SVG: logos, icons, illustrations and technical drawings you can keep editing. It also vectorizes PNGs and animates SVGs. What it does, what it costs, and how to use it from Cursor. An independent guide.",
    date: "2026-10-03",
    keyword: "ARROW",
    tools: [
      {
        name: "QuiverAI (Arrow 2)",
        what: "Foundational models for generating, editing and animating vector graphics. Arrow 2 is the current model in the app and the API (September 2026). Every creation is a real, editable SVG.",
        href: "https://quiver.ai",
        icon: "palette",
      },
    ],
    about: {
      intro: [
        "QuiverAI is built by the researchers behind StarVector and raised an $8.3M seed round led by a16z. Arrow 2 is their newest model, alongside Arrow 2 Telos for extra refinement.",
      ],
      steps: [
        { title: "Prompt to SVG", text: "Describe what you want and get an SVG back: logos, icons, illustrations, technical drawings and line work." },
        { title: "Real paths", text: "Arrow 2 uses fewer, more precise control points, with fewer messy or overlapping paths, so the file is easy to edit in Figma or any vector tool." },
        { title: "PNG to SVG", text: "Vectorize raster images (a logo PNG, a sketch) into editable SVGs." },
        { title: "Animation", text: "Animate the shapes already in an SVG: logo reveals, loading states, animated icons, web-ready." },
        { title: "API & MCP", text: "An API (model id arrow-2) and a hosted MCP server in beta, with plugins for Cursor and Codex." },
      ],
      notes: [
        "Plans start at $8/month (Go) with a 14-day trial; a card is required for the trial.",
        "Subscription usage is for the app only. The API is billed separately from a prepaid balance.",
        "Arrow 1.x models retire on October 16, 2026.",
        "An independent guide by @copilot_shogo. Not affiliated with QuiverAI.",
      ],
    },
  },
  {
    number: 14,
    slug: "14-open-dots",
    title: "OpenDots: a free, open-source take on OpenAI's dots",
    description:
      "OpenDots by CopilotKit is an MIT-licensed template for persistent AI agents, each with its own computer. You host it yourself and bring your own model. What it does, how it compares to OpenAI's dots, and how to run it. An independent guide.",
    date: "2026-10-02",
    keyword: "DOTS",
    tools: [
      {
        name: "OpenDots by CopilotKit",
        what: "An open-source template for persistent AI agents, each with its own computer. Available on Web and Mobile. MIT license, fully self-hostable, early alpha (created September 29, 2026).",
        href: "https://github.com/CopilotKit/OpenDots",
        icon: "robot",
      },
    ],
    about: {
      intro: [
        "OpenAI's dots (launched September 29, 2026) need ChatGPT Pro, Business Premium or Enterprise. OpenDots is free software you host yourself: no plan required, but you pay for your own model and services.",
      ],
      steps: [
        { title: "Specialist Dots", text: "Give each Dot a name, a role, instructions and the tools it's allowed to use." },
        {
          title: "Its own computer",
          text: "Each Dot can get a computer through OpenBot services: browser control, human takeover, files and terminal, with permissions set per Dot.",
        },
        { title: "Draft first", text: "Ask for a draft before saving. A card pauses the chat with \"Approve & save\" or \"Decline\"." },
        {
          title: "Voice calls",
          text: "Realtime speech paired with a separate compute agent, so longer work runs while you talk. Voice needs its own provider config.",
        },
        {
          title: "Slack",
          text: "Mention a Dot in Slack via Channels SDK. The README says live Slack still needs connected-service verification.",
        },
        { title: "Spaces & pages", text: "A searchable library of pages you can edit. Single-owner: no shared editing yet." },
        {
          title: "Any model",
          text: "Any OpenAI-compatible model: set OPENAI_BASE_URL and OPENAI_MODEL in .env.",
        },
      ],
      altInstall: {
        label: "Get started · Node.js 24",
        commands: [
          "git clone https://github.com/CopilotKit/OpenDots.git",
          "cd OpenDots && npm ci",
          "cp .env.example .env",
          "npm run dev",
        ],
      },
      notes: [
        [
          "Open ",
          { code: "http://127.0.0.1:5173" },
          ". See ",
          { text: "docs/SETUP.md", href: "https://github.com/CopilotKit/OpenDots/blob/main/docs/SETUP.md" },
          " for Slack, calls, the browser and Docker, and ",
          { text: "docs/COMPUTERS.md", href: "https://github.com/CopilotKit/OpenDots/blob/main/docs/COMPUTERS.md" },
          " for Dot computers.",
        ],
        "OPENAI_BASE_URL changes the compute model only. The included call adapter uses OpenAI's Realtime API.",
        "Early alpha, and a template, not a hosted product: you run it and configure the services.",
        "Not the same as composio-community/open-dot, which is a separate Mac app.",
        "An independent guide by @copilot_shogo. Not affiliated with OpenAI or CopilotKit.",
      ],
    },
  },
  {
    number: 12,
    slug: "12-design-md",
    title: "DESIGN.md: stop your AI from building generic UI",
    description:
      "Give your AI a real design system instead of \"make it clean\". Refero Styles is a free library of 2,000+ AI-readable design systems from real product websites. How to use one with Claude Code, Codex, Cursor, v0 or Lovable. An independent guide.",
    date: "2026-10-01",
    keyword: "DESIGN",
    tools: [
      {
        name: "Refero Styles",
        what: "2,000+ design systems taken from real product websites (Apple, Linear, Notion, ElevenLabs, OpenAI, Perplexity, Superhuman, teenage engineering…). Each one has colors with their roles, a type scale, spacing and radii, components, and explicit do's and don'ts. Export it as Markdown (DESIGN.md), a Tailwind v4 theme or CSS variables, or connect it to your AI over MCP.",
        href: "https://styles.refero.design",
        icon: "file",
      },
    ],
    about: {
      intro: [
        "Why AI UI looks generic: \"clean\" and \"minimal\" are vibes, not specs, so the model fills in the average of the web: purple gradients, the same cards, fake stats. A ",
        { code: "DESIGN.md" },
        " gives it exact values and rules to follow.",
      ],
      steps: [
        { title: "Pick a style", text: "Open styles.refero.design and pick a style close to your product." },
        { title: "Copy it", text: "Open the DESIGN.md tab and copy or download it (or take the Tailwind v4 theme or CSS variables)." },
        { title: "Save it", text: "Save it as DESIGN.md in your project root." },
        {
          title: "Prompt",
          text: "\"Build (or restyle) <X>. Use DESIGN.md in this folder.\" Or reference it from CLAUDE.md / AGENTS.md so every run follows it.",
        },
        {
          title: "Review and iterate",
          text: "Use the design language, not the identity: don't copy another brand's logo or trademarks.",
        },
      ],
      example: {
        question: "Build a landing page for Stride, a habit-tracking app",
        output: `Without DESIGN.md:
  purple gradients, generic cards
With Linear's DESIGN.md:
  near-black surfaces, one acid-lime
  accent, hairline borders`,
        source: "My test from the reel: same model, same prompt, run once without and once with Linear's DESIGN.md. A summary of what came out, not the full output.",
      },
      notes: [
        "Works with Claude Code, Codex, Cursor, v0 and Lovable, or any tool that can read a file in your project.",
        "As of October 1, 2026, viewing and copying styles needed no login or payment. Check the site for current terms.",
        "An independent guide by @copilot_shogo. Not affiliated with Refero or with the brands whose styles are listed.",
      ],
    },
  },
  {
    number: 11,
    slug: "11-ai-bots",
    title: "The AI bot war: 6 personal AI agents compared (Sep 2026)",
    description:
      "Six always-on AI agents side by side: dots (OpenAI), Muse (Meta), Grok Bot (SpaceXAI), Cue (Manus), Gemini Spark (Google) and Poke (Cognition). Price and access, what each can do, spending controls, and what to watch out for. An independent explainer, as of September 30, 2026.",
    date: "2026-09-30",
    keyword: "BOTS",
    tools: [],
    icon: "robot",
    breakdown: {
      tldr: [
        ["A \"bot\" is an AI agent with its own computer that keeps working while you're away. Six of them are now out or in beta."],
        ["dots (OpenAI, Sep 29): included in ChatGPT Pro and Business Premium. Message or call it in ChatGPT, Slack or Teams."],
        ["Muse (Meta, Sep 8): free, $20 or $100 a month, US only. #1 free iPhone app in the US on Sep 30."],
        ["Grok Bot (SpaceXAI, beta since Aug 11): comes with paid Cursor plans or a linked SuperGrok / X Premium+ plan. 418,000 weekly users (Sep 14)."],
        ["Cue (Manus, Sep 28): each agent gets its own email, phone number, wallet and computer. Invite-only."],
        ["Gemini Spark (Google) needs Google AI Pro or Ultra. Poke (Cognition) lives in your texts, from free to $199 a month."],
        ["Spending rules differ: dots, Muse and Spark ask first, Grok Bot hands payment back to you, Cue spends within a budget you set, and Poke's rules aren't stated."],
      ],
      sections: [
        {
          title: "What makes it a bot",
          unit: { one: "trait", many: "traits" },
          items: [
            {
              name: "Its own computer",
              what: ["It works on a cloud computer with a browser that belongs to the agent, not on your laptop."],
            },
            {
              name: "Works 24/7",
              what: ["It keeps going when your laptop is closed, and messages you with progress."],
            },
            {
              name: "Acts across apps",
              what: ["It uses other apps and websites for you instead of only answering in a chat."],
            },
            {
              name: "Has a name and a face",
              what: ["It's a named character you message, call or text, more like a coworker than a chat box."],
            },
          ],
        },
        {
          title: "The six bots",
          unit: { one: "bot", many: "bots" },
          items: [
            {
              name: "dots — OpenAI",
              what: [
                "Launched September 29, 2026 at DevDay, powered by GPT-6 Astra. OpenAI: dots \"have their own cloud computer… can work towards your goals 24/7\".",
              ],
              whoLabel: "Price & access",
              who: [
                "Included in ChatGPT Pro or Business Premium at no extra cost; a beta for Enterprise, Edu and Healthcare when admins turn it on. In eligible markets. Price of extra dots: not announced. Message or call it in ChatGPT (desktop, web, mobile), Slack and Teams; texting is coming soon.",
              ],
              details: [
                {
                  label: "What it can do",
                  text: [
                    "Its own cloud computer (Linux + Chrome), 4,000+ apps, and proactive research (read-only). One primary dot today; teams of dots later.",
                  ],
                },
                {
                  label: "Spending & controls",
                  text: [
                    "Purchases with a saved card require your approval. Your own rules (allow, ask or never), an independent auto-review before actions, and an Activity view to watch or stop it. Password changes and bank transfers are handed to you.",
                  ],
                },
              ],
              whyLabel: "Watch out",
              why: ["In OpenAI's own words, \"dots can still make mistakes\"."],
            },
            {
              name: "Muse — Meta",
              what: ["\"Muse from Meta\", launched September 8, 2026. Model: Muse Spark."],
              whoLabel: "Price & access",
              who: [
                "Free with a usage limit; Power $20 a month; Maximum $100 a month (paid plans 18+). US only, on iOS, Android and muse.ai, plus Mac and WhatsApp.",
              ],
              details: [
                {
                  label: "What it can do",
                  text: [
                    "Runs on Muse Secure VM, \"a persistent, isolated Linux computer with a full browser\", and keeps working in the background.",
                  ],
                },
                {
                  label: "Spending & controls",
                  text: [
                    "Buys with your approval, using one-time cards (Link by Stripe). A separate Sentinel agent approves outbound actions; you choose allow once, always allow or deny; there's an audit log. Meta says it isn't shared with its ad systems.",
                  ],
                },
                {
                  label: "Traction",
                  text: [
                    "#1 free iPhone app in the US (Apple chart, September 30). Download estimates run from 2.3M to 4.3M depending on the firm (",
                    { text: "TechCrunch", href: "https://techcrunch.com/2026/09/25/meta-is-putting-its-muscle-behind-muse-as-the-ai-app-takes-off/" },
                    ", September 25).",
                  ],
                },
              ],
              whyLabel: "Watch out",
              why: [
                "Amazon asked Meta to remove Amazon from Muse shopping (",
                { text: "GeekWire", href: "https://www.geekwire.com/2026/amazon-blocks-metas-muse-ai-assistant-in-new-standoff-over-agentic-shopping/" },
                ", September 20). In Meta's internal tests, an agent routed around its guardrails and exposed a tester's iCloud photos (",
                { text: "Reuters", href: "https://www.carriermanagement.com/news/2026/09/09/291788.htm" },
                ", September 9). That was an internal test, not a user breach.",
              ],
            },
            {
              name: "Grok Bot — SpaceXAI",
              what: [
                "From SpaceXAI (formerly xAI, renamed in July 2026). In beta since August 11, 2026. The model is chosen automatically; there's no model picker.",
              ],
              whoLabel: "Price & access",
              who: [
                "Included in paid Cursor individual and Teams plans, or link a SuperGrok, Plus, Heavy or X Premium+ plan. Free trial credit with a 7-day window. Apps for macOS, Windows, Linux, iOS and Android.",
              ],
              details: [
                {
                  label: "What it can do",
                  text: [
                    "Message it in the app or talk by voice. It has its own cloud computer, works 24/7, and gets more proactive over time.",
                  ],
                },
                {
                  label: "Spending & controls",
                  text: [
                    "It never pays by itself: it hands the computer to you for logins, 2FA and payment. Allow once, always or deny, plus auto-review rules.",
                  ],
                },
                {
                  label: "Traction",
                  text: [
                    "418,000 weekly users as of September 14 (Bloomberg, via ",
                    { text: "PYMNTS", href: "https://www.pymnts.com/news/artificial-intelligence/2026/spacexai-grok-bot-gains-early-traction-ai-agent-push/" },
                    ").",
                  ],
                },
              ],
              whyLabel: "Watch out",
              why: ["\"All of your Bots use the same cloud computer\": several bots don't mean several machines."],
            },
            {
              name: "Cue — Manus",
              what: ["Launched September 28, 2026. Model: not stated."],
              whoLabel: "Price & access",
              who: [
                "Early access, free with an invite code (limited). Web, desktop and mobile; iOS after App Store review.",
              ],
              details: [
                {
                  label: "What it can do",
                  text: [
                    "Each agent has its own email address, phone number, wallet and computer. It can take your calls and leave a summary, and agents can group-chat with each other. Integrations: not stated.",
                  ],
                },
                { label: "Spending & controls", text: ["Pays within a budget you set. Other controls: not stated."] },
              ],
              whyLabel: "Watch out",
              why: ["Invite-only, and the model and integrations aren't stated yet. The budget you set is the limit on what it pays."],
            },
            {
              name: "Gemini Spark — Google",
              what: [
                "Announced May 19, 2026 for trusted testers. Powered by Gemini 3.5 Flash with the Antigravity harness. Google calls it \"a 24/7 personal AI agent\".",
              ],
              whoLabel: "Price & access",
              who: [
                "Needs Google AI Pro or Ultra; 18+. Not available in the EEA, Nigeria, Switzerland or the UK. Mobile app, Mac app and web.",
              ],
              details: [
                {
                  label: "What it can do",
                  text: ["A remote browser and computer. Texting and emailing Spark are coming."],
                },
                { label: "Spending & controls", text: ["Asks you before spending money. Other controls: not stated."] },
              ],
              whyLabel: "Watch out",
              why: ["Check your country before you upgrade a plan to get it."],
            },
            {
              name: "Poke — Cognition",
              what: ["Now part of Cognition. Its pitch: \"Proactive, private, personal, and right in your texts\"."],
              whoLabel: "Price & access",
              who: [
                "Free, Pro $19 a month, Ultra $199 a month. Works in iMessage, SMS and Telegram (WhatsApp in Brazil).",
              ],
              details: [
                { label: "What it can do", text: ["Lives in your texts instead of a separate app. Its own computer: not stated."] },
                { label: "Spending & controls", text: ["Not stated."] },
              ],
              whyLabel: "Watch out",
              why: ["The only one of the six where its own computer isn't stated."],
            },
          ],
        },
        {
          title: "Also in the space (borderline)",
          unit: { one: "entry", many: "entries" },
          items: [
            { name: "Perplexity Personal Computer", what: ["Works 24/7, but runs on your own Mac or PC."] },
            { name: "Microsoft Copilot Autopilot", what: ["Enterprise private preview, as reported."] },
            { name: "OpenClaw", what: ["Open-source and self-hosted; the one with the lobster mascot."] },
            { name: "Amazon Alexa+", what: ["Does tasks for you, but no computer of its own is confirmed."] },
            { name: "Apple Siri AI", what: ["Unclear whether it's always on."] },
          ],
        },
      ],
      notes: [
        "An independent explainer by @copilot_shogo. Not affiliated with or endorsed by any company named here.",
        "As of September 30, 2026. Prices, plans and availability change, so check the official pages below before you rely on them.",
        "\"Not stated\" means the sources below don't say. This page doesn't guess.",
      ],
      sources: [
        { text: "OpenAI: Introducing dots", href: "https://openai.com/index/introducing-dots/" },
        { text: "OpenAI: How we build safety, security and privacy into dots", href: "https://openai.com/index/how-we-build-safety-security-and-privacy-into-dots/" },
        { text: "Meta: Introducing Muse", href: "https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/" },
        { text: "Meta Help Center: Muse subscriptions", href: "https://www.meta.com/help/subscriptions/1021145227643680/" },
        { text: "SpaceXAI: Introducing Grok Bot", href: "https://x.ai/news/introducing-grok-bot" },
        { text: "SpaceXAI docs: Grok Bot overview", href: "https://docs.x.ai/grok-bot/overview" },
        { text: "Cursor Help: Grok Bot plans", href: "https://cursor.com/help/grok-bot/plans" },
        { text: "Manus: Introducing Manus 2.0", href: "https://manus.im/blog/introducing-manus-2-0" },
        { text: "Cue", href: "https://cue.im/" },
        { text: "Google: The next evolution of the Gemini app", href: "https://blog.google/innovation-and-ai/products/gemini-app/next-evolution-gemini-app/" },
        { text: "Gemini Help: Gemini Spark", href: "https://support.google.com/gemini/answer/17094507" },
        { text: "Poke: Pricing", href: "https://poke.com/pricing" },
        { text: "GeekWire: Amazon blocks Meta's Muse", href: "https://www.geekwire.com/2026/amazon-blocks-metas-muse-ai-assistant-in-new-standoff-over-agentic-shopping/" },
        { text: "Reuters (via Carrier Management): Meta's internal Muse tests", href: "https://www.carriermanagement.com/news/2026/09/09/291788.htm" },
        { text: "TechCrunch: Meta is putting its muscle behind Muse", href: "https://techcrunch.com/2026/09/25/meta-is-putting-its-muscle-behind-muse-as-the-ai-app-takes-off/" },
        { text: "PYMNTS: Grok Bot gains early traction", href: "https://www.pymnts.com/news/artificial-intelligence/2026/spacexai-grok-bot-gains-early-traction-ai-agent-push/" },
      ],
    },
  },
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
        { text: "OpenAI Help Center: Use your ChatGPT plan in partner apps", href: "https://help.openai.com/en/articles/20001542" },
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
