// Free tools from the @copilot_shogo reels. One "drop" per reel.
// Slugs are numbered ("02-claude-design-tools") so they never collide as reels pile up;
// /free/02 redirects to the full slug, which is what the DMs link to.

import type { JarvisDemoKind } from "@/app/free/jarvis/JarvisDemos";
import type { KreaDemoKind } from "@/app/free/krea/KreaDemos";
import type { SuncatcherDemoKind } from "@/app/free/suncatcher/SuncatcherDemos";
import type { SubvocalDemoKind } from "@/app/free/subvocal/SubvocalDemos";
import type { HackerTubeDemoKind } from "@/app/free/hackertube/HackerTubeDemos";
import type { StudioDemoKind } from "@/app/free/studio/StudioDemos";
import type { FindSkillsDemoKind } from "@/app/free/findskills/FindSkillsDemos";
import type { LiftersDemoKind } from "@/app/free/lifters/LiftersDemos";
import type { FiveSkillsDemoKind } from "@/app/free/fiveskills/FiveSkillsDemos";
import type { FreeLlmApiDemoKind } from "@/app/free/freellmapi/FreeLlmApiDemos";
import type { AgentsDemoKind } from "@/app/free/agents/AgentsDemos";
import type { FableDemoKind } from "@/app/free/fable/FableDemos";
import type { TeardownDemoKind } from "@/app/free/teardown/TeardownDemos";
import type { FounderDemoKind } from "@/app/free/founder/FounderDemos";
import type { McpDemoKind } from "@/app/free/mcp/McpDemos";
import type { OssDemoKind } from "@/app/free/oss/OssDemos";
import type { ReposDemoKind } from "@/app/free/repos/ReposDemos";
import type { YoutubeDemoKind } from "@/app/free/youtube/YoutubeDemos";
import type { PluginsDemoKind } from "@/app/free/plugins/PluginsDemos";

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
  /** replaces the button label "Open the site" / "Open on GitHub" (e.g. "Apply on claude.com") */
  cta?: string;
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
  /** replaces the automatic label in "Reel 48 · …" (e.g. "explainer") */
  kind?: string;
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
  /** footage or stills under the text; with an odd count the first one spans the full width */
  media?: BreakdownMedia[];
  /** an animated explainer under the media */
  demo?: "oled";
};

/** A muted looping clip (`video`, with `src` as its poster) or a still. Paths are 4:3 unless `wide`. */
export type BreakdownMedia = { src: string; video?: string; alt: string; caption: string; wide?: boolean };

export type DropBreakdown = {
  /** a wide clip above the 60-second version */
  hero?: BreakdownMedia;
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

/** One chapter of a step-by-step guide: paragraphs, bullets, commands to copy, and code blocks. */
export type DropChapter = {
  title: string;
  text?: (string | RichText)[];
  bullets?: (string | RichText)[];
  commands?: string[];
  code?: { label: string; body: string }[];
  /** a table under the text (e.g. a beat sheet): header row + body rows */
  table?: { head: string[]; rows: string[][] };
  /** images under the text; `tall` for 9:16 screens (shown as a grid), otherwise full width */
  figures?: { src: string; alt: string; caption?: string; tall?: boolean }[];
  /** a live figure drawn for the page (src/app/free/jarvis) */
  demo?: JarvisDemoKind;
  /** a live figure drawn for /free/47 (src/app/free/krea) */
  krea?: KreaDemoKind;
  /** a live figure drawn for /free/48 (src/app/free/suncatcher) */
  suncatcher?: SuncatcherDemoKind;
  /** a live figure drawn for /free/49 (src/app/free/subvocal) */
  subvocal?: SubvocalDemoKind;
  /** a live figure drawn for /free/50 (src/app/free/hackertube) */
  hackertube?: HackerTubeDemoKind;
  /** a live figure drawn for /free/52 (src/app/free/studio) */
  studio?: StudioDemoKind;
  /** a live figure drawn for /free/53 (src/app/free/findskills) */
  findskills?: FindSkillsDemoKind;
  /** a live figure drawn for /free/54 (src/app/free/lifters) */
  lifters?: LiftersDemoKind;
  /** a live figure drawn for /free/55 (src/app/free/fiveskills) */
  fiveskills?: FiveSkillsDemoKind;
  /** a live figure drawn for /free/58 (src/app/free/freellmapi) */
  freellmapi?: FreeLlmApiDemoKind;
  /** a live figure drawn for /free/59 (src/app/free/agents) */
  agents?: AgentsDemoKind;
  /** a live figure drawn for /free/61 (src/app/free/fable) */
  fable?: FableDemoKind;
  /** a live figure drawn for /free/64 (src/app/free/teardown) */
  teardown?: TeardownDemoKind;
  /** a live figure drawn for /free/63 (src/app/free/founder) */
  founder?: FounderDemoKind;
  /** a live figure drawn for /free/62 (src/app/free/mcp) */
  mcp?: McpDemoKind;
  /** a live figure drawn for /free/65 (src/app/free/oss) */
  oss?: OssDemoKind;
  /** a live figure drawn for /free/60 (src/app/free/repos) */
  repos?: ReposDemoKind;
  /** a live figure drawn for /free/66 (src/app/free/youtube) */
  youtube?: YoutubeDemoKind;
  /** a live figure drawn for /free/67 (src/app/free/plugins) */
  plugins?: PluginsDemoKind;
};

export type DropAbout = {
  /** one line above everything else */
  intro?: RichText;
  /** a numbered step-by-step guide; the drop is labelled "step-by-step guide" */
  chapters?: DropChapter[];
  /** replaces "The guide" above the chapters (e.g. "The explainer" for a news drop) */
  chaptersLabel?: string;
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

/** One Kit form shared by every tool page: the email gets the Copilot OS Starter (Kit's incentive email holds the link). */
export const STARTER_FORM = { uid: "b0e7d6be13", script: "https://hustling-builder-9442.kit.com/b0e7d6be13/index.js" };

// free/43: the build script exactly as it was run before publishing (smoke-tested end to end, 2026-10-27)
const KEYBOARD_EARS_PY = String.raw`"""Keyboard ears — hear which key was pressed (a small version of the 2023 acoustic side-channel study).
Record your OWN keyboard only. Steps: 1) one WAV per key with ~25 presses, 2) cut the presses,
3) turn each press into a mel-spectrogram picture, 4) train a classifier, 5) test it.

    python keyboard_ears.py recordings/      # recordings/e.wav, recordings/r.wav, ... (file name = the key)

Needs: pip install numpy librosa scikit-learn
"""
import sys
from pathlib import Path

import librosa
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline

SR = 44100          # sample rate
CLIP = 0.33         # seconds kept per key press (the study used 0.33 s)
N_MELS = 64         # pitch bands in the picture


def split_presses(y, sr=SR, clip=CLIP):
    """Find each key press by its energy and cut a fixed-length clip starting just before it."""
    hop = int(0.005 * sr)
    energy = np.array([np.sqrt(np.mean(y[i:i + hop] ** 2)) for i in range(0, len(y) - hop, hop)])
    threshold = np.percentile(energy, 90)
    presses, last = [], -10 ** 9
    for i in range(1, len(energy)):
        start = i * hop
        if energy[i] > threshold >= energy[i - 1] and start - last > clip * sr:
            seg = y[max(0, start - int(0.005 * sr)): start + int(clip * sr)]
            if len(seg) == int(clip * sr) + int(0.005 * sr):
                presses.append(seg)
                last = start
    return presses


def to_picture(clip, sr=SR):
    """One press → a 64×64 mel-spectrogram (time left→right, pitch bottom→top, brighter = louder)."""
    mel = librosa.feature.melspectrogram(y=clip, sr=sr, n_fft=1024, hop_length=225, n_mels=N_MELS)
    db = librosa.power_to_db(mel, ref=np.max)
    cols = np.linspace(0, db.shape[1] - 1, 64).astype(int)   # resample time to 64 columns
    return db[:, cols]


def load(folder):
    X, labels = [], []
    for wav in sorted(Path(folder).glob("*.wav")):
        y, _ = librosa.load(wav, sr=SR, mono=True)
        for clip in split_presses(y):
            X.append(to_picture(clip).ravel())
            labels.append(wav.stem)
        print(f"{wav.stem}: {labels.count(wav.stem)} presses")
    return np.array(X), np.array(labels)


if __name__ == "__main__":
    X, y = load(sys.argv[1] if len(sys.argv) > 1 else "recordings")
    X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, stratify=y, random_state=0)
    model = make_pipeline(StandardScaler(), LogisticRegression(max_iter=2000))
    model.fit(X_tr, y_tr)
    pred = model.predict(X_te)
    print(f"accuracy on held-out presses: {accuracy_score(y_te, pred):.0%}")
    keys = sorted(set(y.tolist()))
    print("confusion (rows = true key, columns = guess):", keys)
    print(confusion_matrix(y_te, pred, labels=keys))`;

const SUNCATCHER_POST = "https://blog.google/innovation-and-ai/models-and-research/google-research/project-suncatcher-satellite-response/";
const SUNCATCHER_FACTS = "https://blog.google/innovation-and-ai/models-and-research/google-research/google-project-suncatcher-facts/";
const SUNCATCHER_PAPER = "https://research.google/blog/exploring-a-space-based-scalable-ai-infrastructure-system-design/";

const SUBVOCAL_POST = "https://x.com/AarushYadav47/status/2116198463847408066";
const SUBVOCAL_PREORDER = "https://subvocal.company/preorder";
const SUBVOCAL_YC = "https://www.ycombinator.com/companies/the-subvocal-company";

const LIFTERS_URL = "https://lifters.club";

const HT_SITE = "https://hackertube.org/";
const HT_DATA = "https://hackertube.org/data";
const HT_BLOG = "https://karpathy.bearblog.dev/hacker-tube/";
const HT_X = "https://x.com/karpathy/status/2116957135661945283";
const HT_HN = "https://news.ycombinator.com/item?id=50319510";

// free/52: the folder layout and a starter rule page (rules translated from my own docs/craft.md)
const STUDIO_TREE = String.raw`episodes/
  2026-11-04_01_my-reel/
    script.md        # the script, the sources, the shot list
    Video.tsx        # the reel as code (Remotion)
    render/final.mp4 # what gets posted
public/episodes/
  2026-11-04_01_my-reel/
    narration.mp3    # the voice (ElevenLabs), sped up with Rubber Band
    music.mp3
docs/
  craft.md           # the rule page Claude reads before every reel
scripts/
  check.sh           # reads the rules, refuses to render when one breaks`;
const STUDIO_RULES = String.raw`# craft.md — read this before every reel

## Hook
- Frame 1 is the content, not a logo. One strong line on screen from the first frame.
- Say what it is and what the viewer gets within 3 seconds.

## Look
- One background, one text colour, one accent. Solid backgrounds, no glow.
- Real screens, real files, real numbers. Never redraw a fake product screen.
- Never upscale an image past 1.5×.
- Other people's footage only as short proof.

## Motion
- Something meaningful moves wherever you pause. No dead frames.
- Shake twice at most. One full-screen flash at most.

## Sound
- One sound per event, within 2 frames of it.
- Music 18–24 dB under the voice. Whole reel at −14 LUFS.

## When a reel looks cheap
- Write the fix here as one line, with the reel number. Don't just fix that reel.`;

// free/53: sources for find-skills (all read on Nov 4, 2026)
const FS_REPO = "https://github.com/vercel-labs/skills";
const FS_PAGE = "https://skills.sh/vercel-labs/skills/find-skills";
const FS_SKILL_MD = "https://github.com/vercel-labs/skills/blob/main/skills/find-skills/SKILL.md";
const FS_STATE = "https://vercel.com/blog/state-of-agent-skills";
const FS_INSTALL = "npx skills add vercel-labs/skills --skill find-skills";

// free/55: the five skills (repos, READMEs and star counts read on Nov 6, 2026, 20:57 JST)
const FIVE_SKILLS_SH = "https://skills.sh/";
const FIVE_FS_INSTALL = "npx skills add https://github.com/vercel-labs/skills --skill find-skills";
const FIVE_SP = "https://github.com/obra/superpowers";
const FIVE_SP_INSTALL = "/plugin install superpowers@claude-plugins-official";
const FIVE_CM = "https://github.com/thedotmack/claude-mem";
const FIVE_CM_INSTALL = "npx claude-mem install";
const FIVE_IM = "https://github.com/pbakaus/impeccable";
const FIVE_IM_INSTALL = "npx impeccable install";
const FIVE_TO = "https://github.com/rebelytics/one-skill-to-rule-them-all";
const FIVE_TO_ENV = "https://github.com/rebelytics/one-skill-to-rule-them-all/blob/main/references/environments.md";
const FIVE_TO_INSTALL = "npx skills add rebelytics/one-skill-to-rule-them-all --skill task-observer";

// free/58: FreeLLMAPI (README, docs and source read on Nov 8, 2026)
const FL_REPO = "https://github.com/tashfeenahmed/freellmapi";
const FL_RELEASES = "https://github.com/tashfeenahmed/freellmapi/releases/latest";
const FL_INSTALL_DOC = "https://github.com/tashfeenahmed/freellmapi/blob/main/docs/en/install/01-install.md";
const FL_AGENTS_DOC = "https://github.com/tashfeenahmed/freellmapi/blob/main/docs/en/clients/01-agent-clients.md";
const FL_HANDOFF_DOC = "https://github.com/tashfeenahmed/freellmapi/blob/main/docs/en/clients/01-agent-clients.md#context-handoff";
const FL_LIMITS_DOC = "https://github.com/tashfeenahmed/freellmapi/blob/main/docs/en/architecture/00-high-level-index.md#limitations";
const FL_TOS_DOC = "https://github.com/tashfeenahmed/freellmapi/blob/main/docs/en/architecture/00-high-level-index.md#terms-of-service-review";
const FL_MODELS = "https://freellmapi.co/models.html";
const FL_SETUP = "npx freellmapi setup-claude --url http://localhost:3001 --api-key <unified-key>";

// free/59: four AI agents compared (official pages read on Nov 9, 2026)
const AG_DOTS = "https://openai.com/index/introducing-dots/";
const AG_DOTS_HELP = "https://help.openai.com/en/articles/20001530-getting-started-with-your-dot";
const AG_PRO_TIERS = "https://help.openai.com/en/articles/9793128-about-chatgpt-pro-tiers";
const AG_MUSE = "https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/";
const AG_MUSE_SG = "https://about.fb.com/news/2026/10/muse-is-now-available-in-singapore-the-worlds-first-personal-ai-agent-built-for-everyone/";
const AG_GROK = "https://x.ai/news/introducing-grok-bot";
const AG_GROK_DOCS = "https://docs.x.ai/grok-bot/overview";
const AG_XSUB = "https://docs.x.ai/x-subscription/pricing";
const AG_MAUS = "https://github.com/milind-soni/OpenMausBot";
const AG_MAUS_SITE = "https://www.mausbot.com/";

// free/60: nine paid apps and their open-source versions (GitHub API and READMEs read on Nov 10, 2026)
const RP_OGAI = "https://github.com/Anil-matcha/Open-Generative-AI";
const RP_VOICE = "https://github.com/debpalash/VoiceStudio";
const RP_SEO = "https://github.com/every-app/open-seo";
const RP_APPFLOWY = "https://github.com/AppFlowy-IO/AppFlowy";
const RP_WHISPR = "https://github.com/OpenWhispr/openwhispr";
const RP_OPENPROJECT = "https://github.com/opf/openproject";
const RP_CALDIY = "https://github.com/calcom/cal.diy";
const RP_CHATWOOT = "https://github.com/chatwoot/chatwoot";
const RP_CAP = "https://github.com/CapSoftware/Cap";

const FB_POST = "https://www.anthropic.com/claude-fable-and-mythos-5-2";
const FB_PRICING = "https://platform.claude.com/docs/en/about-claude/pricing";

const FOUNDER_REPO = "https://github.com/Jakeschincariol/founder-skill";

const TD_REPO = "https://github.com/elvarofficial/teardown";
const TD_ARTICLE = "https://x.com/elvar_official/status/2116174609355571402";

const MCP_SPEC_TOOLS = "https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/server/tools.mdx";
const MCP_REPO = "https://github.com/modelcontextprotocol/modelcontextprotocol";
const SLACK_HISTORY = "https://docs.slack.dev/reference/methods/conversations.history";

const OSS_APPLY = "https://claude.com/contact-sales/claude-for-oss";
const OSS_TERMS = "https://www.anthropic.com/claude-for-oss-terms";
const OSS_PRICING = "https://claude.com/pricing";

const YT_REPO = "https://github.com/Jakeschincariol/youtube-agent-skill";

// free/67: five Claude Code plugins (READMEs read on Nov 14, 2026). The same five addresses as src/app/free/plugins/data.ts; a test keeps them equal.
const PL_OMNI = "https://github.com/cheaper-inference/OmniRoute";
const PL_MEM = "https://github.com/thedotmack/claude-mem";
const PL_HEADROOM = "https://github.com/headroomlabs-ai/headroom";
const PL_SETUP = "https://github.com/anthropics/claude-plugins-official/tree/main/plugins/claude-code-setup";
const PL_OBSERVER = "https://github.com/rebelytics/one-skill-to-rule-them-all";

const drops: FreeDrop[] = [
  {
    number: 67,
    slug: "67-claude-code-plugins",
    title: "5 Claude Code plugins for when it cuts you off, forgets your project and burns your tokens",
    description:
      "OmniRoute, Claude Mem, Headroom, Claude Code Setup and Task Observer. Pick what is going wrong and get the one that answers it, with its install line, the link to the original repo, its license, and what to know before you install.",
    date: "2026-11-14",
    keyword: "CLAUDE",
    kind: "5 plugins",
    tools: [
      {
        name: "OmniRoute",
        what: "A free AI gateway you run on your own machine. When quota runs out on one model, it can move to the next eligible one you have connected. MIT.",
        href: PL_OMNI,
        icon: "plug",
      },
      {
        name: "Claude Mem",
        what: "A second agent takes notes while Claude works, and the next session starts with a short index of what matters. Apache-2.0.",
        href: PL_MEM,
        icon: "brain",
      },
      {
        name: "Headroom",
        what: "Compresses what your agent reads (tool outputs, logs, files, history) before it reaches the model. Same answers, fewer input tokens. Apache-2.0.",
        href: PL_HEADROOM,
        icon: "scissors",
      },
      {
        name: "Claude Code Setup",
        what: "Anthropic's own plugin. It scans your codebase and recommends the top 1-2 automations in each category: hooks, skills, MCP servers, subagents and slash commands. Read-only.",
        href: PL_SETUP,
        icon: "robot",
      },
      {
        name: "Task Observer",
        what: "A meta-skill that watches how you work and suggests specific updates to your other skills. You decide which changes are installed. By Eoghan Henn, CC BY 4.0.",
        href: PL_OBSERVER,
        icon: "review",
      },
    ],
    about: {
      intro: [
        "Five add-ons for Claude Code, one for each thing that goes wrong in the reel: it cuts you off mid-task, it forgets your project, it burns through your tokens, you don't know what to set up, and your skills never improve. Each one below has its install line as the source writes it, the link to the original repo, its license, and what the README says to know first. Read from the five READMEs on 2026-11-14.",
      ],
      chaptersLabel: "The five",
      chapters: [
        {
          title: "What is going wrong?",
          text: ["Pick the problem you have. The picker opens the one plugin that answers it, with the first line to paste. The full card for each is further down, in the reel's order."],
          plugins: "picker",
        },
        {
          title: "OmniRoute: when it cuts you off mid-task",
          text: [
            [
              { text: "OmniRoute", href: PL_OMNI },
              " is a gateway that runs on your machine and sits between Claude Code and the model providers you connect. The numbers on the card are the README's own on 2026-11-14, and the README says they move both ways.",
            ],
            "The ~1.62B is not a grant from OmniRoute. It is the README's estimate of what the third-party free tiers add up to if you sign up for them yourself and connect them.",
          ],
          plugins: "omniroute",
        },
        {
          title: "Claude Mem: when it forgets your project",
          text: [
            [
              { text: "Claude Mem", href: PL_MEM },
              " runs a second agent beside Claude that takes notes while it works. The next session in the same project opens with a short index of those notes. Tap a session in the figure under the card to see what it starts with.",
            ],
          ],
          plugins: "claude-mem",
        },
        {
          title: "Headroom: when it burns through your tokens",
          text: [
            [
              { text: "Headroom", href: PL_HEADROOM },
              " sits between your agent and the model and compresses what the agent reads before it is sent. The README measures four scenarios; pick one in the figure under the card and press it.",
            ],
          ],
          plugins: "headroom",
        },
        {
          title: "Claude Code Setup: when you don't know what to set up",
          text: [
            [
              { text: "Claude Code Setup", href: PL_SETUP },
              " is in Anthropic's own plugin marketplace. You ask it in your project and it recommends; it does not change your files.",
            ],
          ],
          plugins: "claude-code-setup",
        },
        {
          title: "Task Observer: when your skills never improve",
          text: [
            [
              { text: "Task Observer", href: PL_OBSERVER },
              ", by Eoghan Henn, runs alongside your work and logs what it notices. It suggests updates to your skills and you approve them. It needs one more step after the install line, so read the card to the end.",
            ],
          ],
          plugins: "task-observer",
        },
      ],
      notes: [
        "Read from the five READMEs on 2026-11-14. The Claude Code Setup install line is from the README of Anthropic's claude-plugins-official marketplace, because the plugin's own README has none. Check each repo for changes.",
        "The reel calls all five plugins. By their own READMEs, OmniRoute is a gateway you run, Headroom wraps the agent, Task Observer is a skill, and Claude Mem and Claude Code Setup install as Claude Code plugins.",
        "The three figures are drawn for this page. The task, the cut-off point and the sessions inside them are illustrations; the tiers, the three steps and every token count are each README's own.",
        "Task Observer is by Eoghan Henn (rebelytics.com), licensed CC BY 4.0. This page is not affiliated with Anthropic or with any of the five authors.",
        [
          "Sources: ",
          { text: "cheaper-inference/OmniRoute", href: PL_OMNI },
          " · ",
          { text: "thedotmack/claude-mem", href: PL_MEM },
          " · ",
          { text: "headroomlabs-ai/headroom", href: PL_HEADROOM },
          " · ",
          { text: "anthropics/claude-plugins-official (claude-code-setup)", href: PL_SETUP },
          " · ",
          { text: "rebelytics/one-skill-to-rule-them-all", href: PL_OBSERVER },
        ],
      ],
    },
  },
  {
    number: 66,
    slug: "66-youtube-agent-skill",
    title: "The YouTube agent skill: the install, all 11 commands and the 21 hook formulas",
    description:
      "Eleven free Claude skills for running a YouTube channel: scripts, titles and thumbnails, edits, comments, planning and what is working in your niche. The lines to paste, a picker for the 11 commands, all 21 hook formulas, and what to know before you start.",
    date: "2026-11-14",
    keyword: "YOUTUBE",
    kind: "11 skills",
    tools: [
      {
        name: "The YouTube agent skill",
        what: "Eleven Claude skills that run a YouTube channel. Free, MIT, no signup, no API key, nothing to connect. They write; you upload.",
        href: YT_REPO,
        icon: "robot",
      },
    ],
    about: {
      intro: [
        "The YouTube agent skill is a free, MIT-licensed pack of eleven Claude skills, by Jakeschincariol on GitHub. This page is the guide from the reel: how to install it, which command does what, the 21 hook formulas, and the fine print. ",
        { text: "Open the repo", href: YT_REPO },
        ". Read from the repo on 2026-11-14.",
      ],
      chaptersLabel: "The guide",
      chapters: [
        {
          title: "Install it",
          text: [
            "There are three ways in the README. The first is the short one: paste the repo link and one sentence into Claude. Pick a way below and copy its lines.",
          ],
          bullets: [
            ["For one project instead of everywhere: copy the same folders into your repo's ", { code: ".claude/skills/" }, "."],
            [
              "No Claude Code at all? Paste any single ",
              { code: "SKILL.md" },
              " at the top of a chat and it runs as a mode. You lose the six Python tools, which the README calls most of the point of ",
              { code: "/yt-script" },
              ", ",
              { code: "/yt-retention" },
              " and ",
              { code: "/yt-edit" },
              ", but the rest works.",
            ],
          ],
          youtube: "install",
        },
        {
          title: "The 11 commands",
          text: ["Each skill is one command. Pick what you want to do and the figure shows the command, what the README says it does, and the Python tool behind it when there is one."],
          youtube: "picker",
        },
        {
          title: "The 21 hook formulas",
          text: [
            [
              { code: "/yt-script" },
              " writes five hooks against these 21 formulas, scores them, and shows you the top two with their scores. Every formula comes with its shape, a worked example and the way it fails. All 21 names are below, in the file's order. Tap one to read it.",
            ],
            "The file also sets five rules for any hook:",
          ],
          bullets: [
            "Confirm the title in the first sentence. A hook that ignores its own title is why people leave at 0:08.",
            "One idea. A hook carrying two promises keeps neither.",
            "Specific beats big. '400 to 200,000 in seven months' outperforms 'massive growth'.",
            "Show the artifact inside 20 seconds if you promised one.",
            "Never open with who you are. The subscribe pitch has not been earned yet.",
          ],
          youtube: "hooks",
        },
        {
          title: "Do this first: voice.md",
          text: [
            [
              "Before you run a command, make ",
              { code: "voice.md" },
              ". It is a profile of how you talk on camera, and every skill reads it. You can fill in the template yourself, or send Claude three of your own videos and let it write the file.",
            ],
            ["If the file is missing, ", { code: "/yt-script" }, " asks for three of your videos and writes it. In its words: “A script in the wrong voice is worse than no script, because they have to read it out loud.”"],
          ],
          youtube: "voice",
        },
        {
          title: "Know this before you start",
          text: [
            "The README has a section most packs leave out. The short version: nothing gets published until you do it. Every skill ends in a block you copy and one question: ship it, or change it? Try it in the figure, then open the six lines under it.",
          ],
          youtube: "gate",
        },
      ],
      notes: [
        "Read from the repo's README, skills/yt-script/hooks.json and the SKILL.md of /yt-script and /yt-viral on 2026-11-14. Check the repo for changes.",
        "This page is not affiliated with the repo's author, Anthropic or YouTube. The five figures are drawn for this page; the commands, the install lines, the formulas and the quoted lines are the repo's own wording (MIT).",
        "Every link on this page goes to github.com/Jakeschincariol/youtube-agent-skill.",
        ["Source: ", { text: "github.com/Jakeschincariol/youtube-agent-skill", href: YT_REPO }],
      ],
    },
  },
  {
    number: 65,
    slug: "65-claude-oss",
    title: "Claude for Open Source: 6 months of Claude Ultra, and which route fits you",
    description:
      "Open-source maintainers and contributors can apply to Anthropic for 6 months of Claude Ultra at no cost. The link to apply, a 30-second check to see which of the five routes you qualify under, what the application asks, and what happens after the six months.",
    date: "2026-11-14",
    keyword: "CLAUDE",
    kind: "route checker",
    tools: [
      {
        name: "Claude for Open Source",
        what: "Anthropic's program for open-source maintainers and contributors: 6 months of Claude Ultra. You apply on the official page with your GitHub account.",
        href: OSS_APPLY,
        icon: "review",
        cta: "Apply on claude.com",
      },
    ],
    about: {
      intro: [
        "Claude for Open Source is Anthropic's program for open-source maintainers and contributors. The official page lists five routes to apply for six months of Claude Ultra, the $200-a-month plan, at no cost. ",
        { text: "Apply on claude.com", href: OSS_APPLY },
        " · ",
        { text: "program terms", href: OSS_TERMS },
        ". Read from claude.com and the program terms on 2026-11-14. Check the official page for changes. This page is not affiliated with Anthropic.",
      ],
      chaptersLabel: "The guide",
      chapters: [
        {
          title: "What you get",
          text: [
            "Six months of Claude Ultra. Ultra is $200 per month on the pricing page, so that is $1,200 of plan value. It is not automatic: you apply, and applications are reviewed on a rolling basis.",
          ],
          oss: "value",
        },
        {
          title: "Which route fits you (the 30-second check)",
          text: [
            "The official page lists five routes. Pick the one that fits you below and enter your own numbers. Its dot lights up as soon as you meet the published threshold.",
            "The check only compares your numbers with the official page. It cannot tell you whether you will be approved.",
          ],
          oss: "checker",
        },
        {
          title: "Before you apply",
          text: ["The program terms add five conditions about you and your account, whichever route you use. Tick them off in the figure. Three more things to know first:"],
          bullets: [
            "The program is limited to 10,000 approved recipients. Anthropic may raise the cap.",
            "Applications are reviewed on a rolling basis.",
            "In the terms' own words: “meeting or exceeding any threshold does not guarantee acceptance”.",
          ],
          oss: "ready",
        },
        {
          title: "What the application asks",
          text: [
            "Four things: a GitHub sign-in, an email address, a brief description of how you plan to use the subscription, and a brief explanation of why you qualify, in no more than 500 words. Draft the last one below so it is ready to paste.",
          ],
          oss: "draft",
        },
        {
          title: "After the six months",
          text: ["The complimentary subscription ends and does not renew automatically, and Anthropic emails you before it ends. What your account goes back to depends on what you had before:"],
          oss: "after",
        },
      ],
      notes: [
        "Read from claude.com and the program terms on 2026-11-14. Check the official page for changes.",
        "This page is not affiliated with Anthropic. The five figures are drawn for this page; the thresholds and the quoted lines are the official wording.",
        "The route checker and the draft box run in your browser. Nothing you enter is sent or saved.",
        [
          "Sources: ",
          { text: "Claude for Open Source on claude.com", href: OSS_APPLY },
          " · ",
          { text: "Claude for Open Source program terms", href: OSS_TERMS },
          " · ",
          { text: "claude.com/pricing", href: OSS_PRICING },
        ],
      ],
    },
  },
  {
    number: 62,
    slug: "62-mcp-vs-api",
    title: "MCP vs API: the whole map on one page",
    description:
      "Why do we need MCP when we already have APIs? One page: what an API call is, why two apps and ten services become twenty integrations, what an MCP client and an MCP server are, how discovery works, and why MCP does not replace your API. With a figure you can change yourself.",
    date: "2026-11-13",
    keyword: "MCP",
    kind: "one-page map",
    tools: [],
    icon: "plug",
    about: {
      intro: [
        "MCP (",
        { text: "Model Context Protocol", href: MCP_REPO },
        ") is an open protocol that lets an AI app reach outside tools in one standard way. It does not replace APIs. It sits in front of them. This page is the reel as a map you can keep, with the two method names checked against the specification on Nov 13, 2026.",
      ],
      chaptersLabel: "The map",
      chapters: [
        {
          title: "What an API is",
          text: [
            "An API is how two programs talk to each other. Say your program needs to read messages from Slack. Slack exposes an endpoint, which is just a URL. Your program sends a request to that URL, and Slack sends back a response with the data.",
          ],
          mcp: "request",
        },
        {
          title: "Why it becomes 20 integrations",
          text: [
            "A real app rarely talks to one service. It might talk to ten: Slack for alerts, Gmail for email, Jira for tickets, Notion for documents, your own database, and five more. For each one you write the same kind of code again: the authentication, the calls, the error handling, the retries.",
            "Adding an LLM does not change this. The model does not make the API call itself. It tells your application which action it wants, and your application, normal software outside the model, performs it. So you still wrote all ten integrations by hand.",
            "Then your team builds a second app that needs the same ten services. Two apps times ten services is twenty piles of integration code to write and maintain. Try other numbers below.",
          ],
          mcp: "wiring",
        },
        {
          title: "MCP client and MCP server",
          bullets: [
            "Each app gets one standard piece called an MCP client.",
            "Each service gets a small program next to it called an MCP server.",
            "Clients and servers speak one common protocol, so any client can talk to any server.",
            "Two apps and ten services is 2 + 10 = 12 pieces, not 20. A third app reuses the same ten servers and adds one client. (Switch the figure above to \u201cWith MCP\u201d to see it.)",
          ],
        },
        {
          title: "Discovery: the part people get wrong",
          text: [
            [
              "The client does not need a hard-coded list of what each service can do. It connects to each server and asks. In the specification this request is called ",
              { code: "tools/list" },
              ". The app then shows that list to the model, the model chooses which tool fits the task, and the app sends a ",
              { code: "tools/call" },
              " to the right server.",
            ],
            "The model can only choose from the tools your application lets it see. You hand it a labeled toolbox and let it pick; you decide what goes in the box.",
          ],
          mcp: "discovery",
        },
        {
          title: "MCP does not replace APIs",
          text: [
            "The Slack MCP server is the only piece that actually talks to Slack, and it does that by calling Slack's normal API, the same one that existed all along.",
            "If your system already has an API, an MCP server sits in front of it as a translator, and your API stays exactly where it is. MCP is a common, AI-facing layer on top of APIs.",
          ],
        },
      ],
      notes: [
        "The 20 and the 12 are a simplified count from the reel's example (2 apps, 10 services). Someone still has to write each MCP server once.",
        "The three figures are drawn for this page. The tool names in the discovery figure are made-up examples; the method names tools/list and tools/call are from the specification.",
        [
          "Sources: ",
          { text: "MCP specification, server/tools", href: MCP_SPEC_TOOLS },
          " · ",
          { text: "Model Context Protocol on GitHub", href: MCP_REPO },
          " · ",
          { text: "Slack developer docs, conversations.history", href: SLACK_HISTORY },
        ],
      ],
    },
  },
  {
    number: 64,
    slug: "64-teardown",
    title: "teardown: 9 prompts for 3D machines you can take apart",
    description:
      "teardown is a free Claude Code skill that builds any machine as a 3D simulator you can orbit, cut open and take apart. The one-line install, the one thing most people miss (give it one real picture), and nine prompts to paste.",
    date: "2026-11-13",
    keyword: "TEARDOWN",
    kind: "9 prompts",
    tools: [],
    icon: "cube",
    about: {
      intro: [
        { text: "teardown", href: TD_REPO },
        " is a free, MIT-licensed Claude Code skill by Elvar (@elvar_official). You ask how a machine works and Claude builds it as one offline HTML page: the machine runs in the middle, the panels around it read the real numbers, and a button opens the part doing the work. Everything below is from the skill's README and ",
        { text: "the author's own write-up", href: TD_ARTICLE },
        ", read on Nov 13, 2026.",
      ],
      chaptersLabel: "The guide",
      chapters: [
        {
          title: "Install it (one command)",
          text: [
            "You need Claude Code and Node.js 20 or newer. Add the skill, then run the setup once in the installed folder. After that, open Claude Code and type /teardown, or just ask in plain words.",
            "ffmpeg and Python 3 are only needed if you also want the recorded video and its sound.",
          ],
          commands: ["npx skills add elvarofficial/teardown -g -a claude-code", "cd ~/.claude/skills/teardown && npm install && npx playwright install chromium"],
        },
        {
          title: "Why the gauges move with the machine",
          text: [
            "The skill makes Claude write the machine as a model first: one input (a crank angle, a stroke from 0 to 1) and pure functions that give the pose of every part and every number on screen. The parts, the panels and the labels all read that one model. Drag the angle below and watch three things follow one number.",
          ],
          teardown: "crank",
        },
        {
          title: "The thing most people miss: one real picture",
          text: [
            "The author asked for a pangolin, an armadillo and a scorpion with nothing to work from, and all three came out as generic toys. Then he gave the same model one clip of a real V8 simulator and it rebuilt the engine panel by panel.",
            "So before you prompt: pick a machine with one moving input and real numbers, and find one picture of it. A cutaway from a manual, a photo, a patent drawing or a short clip all work. Attach it, and ask for the numbers to be checked by hand. The figure below is the check from his landing-gear example.",
          ],
          teardown: "rack",
        },
        {
          title: "The 9 prompts",
          text: [
            "The first three are the examples from the skill's README, word for word. The other six are the machines in the reel; I wrote those prompts for this page in the shape the skill asks for (a reference, real parts, one input, real numbers). Swap everything in [brackets]. I have not run all nine myself, so treat the six as starting points.",
            [
              "The author's write-up has his own step-by-step prompts for the console, the look, the review, the video and publishing. Read them there: ",
              { text: "How I Turn Any Machine Into a 3D Simulator You Can Take Apart", href: TD_ARTICLE },
              ".",
            ],
          ],
          code: [
            { label: "1 · Motorcycle engine (README)", body: "Build me a simulator of a 4-stroke motorcycle engine I can take apart." },
            { label: "2 · Mechanical watch (README)", body: "How does a mechanical watch keep time? Show me as a simulator." },
            { label: "3 · Excavator arm, with a video (README)", body: "Make a teardown of a hydraulic excavator arm and record a 20-second video of it." },
            {
              label: "4 · V8 engine",
              body: "/teardown Build a cross-plane V8 four-stroke engine as an interactive 3D simulator. Reference attached: [a cutaway drawing or a photo of a real V8].\nOne input: the crank angle, 0 to 720 degrees. Every piston, valve, gauge and chart reads from it.\nUse real numbers for [bore, stroke, rod length and firing order] and tell me where each one comes from. If you are not sure a number is real, say so.\nGive me a button that cuts one cylinder open so I can watch it fire.",
            },
            {
              label: "5 · Landing gear",
              body: "/teardown Build the main landing gear of [a Cessna 337] as an interactive 3D simulator. Reference attached: [a cutaway drawing of the gear].\nOne input: the actuator stroke, 0 to 1. The rack, the pinion, the legs and the wheels all follow it.\nUse the real numbers for [rack travel, pinion teeth and module, leg swing] and check them by hand. Show me the check.\nAdd buttons for x-ray, exploded and cut-open views.",
            },
            {
              label: "6 · Walking robot",
              body: "/teardown Build a six-legged walking robot as an interactive 3D simulator. Reference attached: [a photo or drawing of a real hexapod].\nOne solver for every leg: [6 legs, 3 joints each]. The legs, the panels and the floor markers all read from it.\nLet me switch between tripod, ripple and wave gaits and steer it with the keyboard.\nShow joint torque and the load on each leg as live panels.",
            },
            {
              label: "7 · Robotic jellyfish",
              body: "/teardown Build a robotic jellyfish as an interactive 3D simulator. Reference attached: [a picture of a soft-robot jellyfish or a real one].\nOne input: the phase of the swimming pulse, 0 to 1. The bell, the limbs and every panel follow it.\nMake every subsystem a button: press one and that part comes apart while the rest steps aside.\nThis machine does not exist, so tell me which numbers are invented.",
            },
            {
              label: "8 · Strandbeest",
              body: "/teardown Build a Theo Jansen Strandbeest as an interactive 3D simulator. Reference attached: [a photo or the leg diagram].\nOne input: the crank angle. Solve every joint from Jansen's 11 link lengths by circle intersection, and show me the link lengths you used.\nAdd a wind slider and a button that isolates one leg and traces its foot path.\nUse a 3/4 camera along the spine so the legs do not collapse into a fence.",
            },
            {
              label: "9 · Something that does not exist",
              body: "/teardown Build [a sandworm 1,300 m long] as an interactive 3D simulator, as if it were a real machine. Reference attached: [a concept drawing].\nOne input: [distance travelled along its track]. The head, the body segments and every panel read the same pose.\nGive me an x-ray view of the buried body and a close-up of the head.\nSay clearly which numbers are invented and keep them consistent with each other.",
            },
          ],
        },
        {
          title: "Before you share it",
          bullets: [
            "Ask Claude to render a still at every step of the tour and read each one: a part passing through another, a part floating off its mount, a label covering what it names, a number that disagrees with the pose.",
            "Fix collisions with a number in the model, not by moving the camera.",
            "Test the page on a laptop without a graphics card. If it is slow, ask for quality steps (no ambient occlusion, a lower pixel ratio, smaller shadows).",
          ],
        },
      ],
      notes: [
        "Install commands and the three README prompts as of Nov 13, 2026 (repository commit a91262a). The repository had 3,380 stars that day.",
        "The two figures are drawn for this page. The rack-and-pinion numbers are the author's worked example; the slider-crank uses example dimensions.",
        [
          "Sources: ",
          { text: "elvarofficial/teardown on GitHub", href: TD_REPO },
          " · ",
          { text: "Elvar's write-up on X", href: TD_ARTICLE },
        ],
      ],
    },
  },
  {
    number: 63,
    slug: "63-founder-skill",
    title: "The Founder skill: test a business idea on 100 AI buyers",
    description:
      "Eleven free Claude skills that test a business before you launch it: a board, a competitor scout, a CFO, a launch plan and a consumer panel of 100 buyer agents. What each one does, how to install it, and how to read the panel's answer.",
    date: "2026-11-13",
    keyword: "FOUNDER",
    kind: "11 free skills",
    tools: [],
    icon: "council",
    about: {
      intro: [
        { text: "The Founder skill", href: FOUNDER_REPO },
        " is a free, MIT-licensed pack of eleven Claude skills by Jake Schincariol. No signup, no API key, nothing to connect. Everything below is from the repo's README and skill files, read on Nov 13, 2026.",
      ],
      chaptersLabel: "The guide",
      chapters: [
        {
          title: "What is in it",
          text: [
            "Eleven skills, each one a job on a startup team. A board judges the idea with frameworks from $100M Offers (Alex Hormozi), Zero to One (Peter Thiel) and Walter Isaacson's biography of Steve Jobs. One maps your competitors and what their customers complain about. One is your CFO. One plans the launch with a dated countdown. The last one compiles a plan with a verdict computed from your numbers.",
            "The README is clear about the board: it applies published frameworks, it does not speak as those people, and the project is not affiliated with any of them.",
          ],
          founder: "eleven",
        },
        {
          title: "Install it",
          text: ["Paste the repo link into Claude and say install skill:"],
          commands: [FOUNDER_REPO, "install skill"],
        },
        {
          title: "Or as a plugin in Claude Code",
          text: ["Installed this way the skills show up as /founder-skill:founder-board and so on. The tools need Python 3.8 or newer, with nothing to pip install."],
          commands: ["/plugin marketplace add Jakeschincariol/founder-skill", "/plugin install founder-skill@founder-skill"],
        },
        {
          title: "The consumer panel",
          text: [
            "You describe the business and who it is for. The skill writes a customer profile, deals 100 buyer cards across income, habits and objections, and runs one sub-agent per buyer. Every buyer sees the same pitch, word for word. Back comes who buys, who passes, the reasons in their own words, and what would flip a no.",
            "A full run is 100 sub-agent calls, in 10 waves of 10. For a first look, run it with --quick, which uses 20 buyers:",
          ],
          commands: ["/founder-consumer --quick"],
          founder: "panel",
        },
        {
          title: "The CFO",
          text: [
            "The CFO runs the unit economics from one file of your numbers: what each sale leaves after its own costs, the real profit margin, break-even per day, year 1 month by month, the cash you need and when it pays back. A missing number is an error, never a guess.",
            "The README's worked example is a matcha café in Toronto selling iced matcha lattes at $6.50 a cup:",
          ],
          founder: "cfo",
        },
        {
          title: "Read the panel as the best case",
          text: [
            "These are simulated buyers. They are good at surfacing objections and wording you had not thought of, and bad at predicting real conversion: language models lean agreeable, so the README says to read the buy rate as an upper bound.",
            "Use it to find the doubts before you spend money, then confirm the big calls with real people: a waitlist, a pre-sale, a landing page with a price. The launch skill starts with exactly that test. Panel answers are research, so do not use them as testimonials.",
          ],
        },
      ],
      notes: [
        "Checked on Nov 13, 2026: the repo is MIT-licensed and had about 3.5K stars.",
        "The figures are drawn for this page. The panel figure shows the procedure and draws no buy rate; the break-even figure recomputes the README's own example.",
        "Not financial, legal or tax advice. The skills tell you what to check; a professional confirms it.",
        ["Source: ", { text: "Jakeschincariol/founder-skill on GitHub", href: FOUNDER_REPO }],
      ],
    },
  },
  {
    number: 61,
    slug: "61-claude-fable-5-2",
    title: "Claude Fable 5.2: the cheat sheet",
    description:
      "Anthropic released Claude Fable 5.2 on Nov 9, 2026. The numbers on one page: how it scores against GPT-6 Astra and Gemini 4 Carbon, how much faster it is, what it costs next to Fable 5.1, how to switch to it, and three prompts to try first.",
    date: "2026-11-13",
    keyword: "FABLE",
    kind: "cheat sheet",
    tools: [],
    icon: "brain",
    about: {
      intro: [
        "Anthropic ",
        { text: "released Claude Fable 5.2 on Nov 9, 2026", href: FB_POST },
        ", together with Claude Mythos 5.2 (the same underlying model, for approved organizations only). Everything below is from Anthropic's announcement and its pricing docs, read on Nov 13, 2026.",
      ],
      chaptersLabel: "The cheat sheet",
      chapters: [
        {
          title: "Benchmarks: where it stands",
          text: [
            "On FrontierCode 2.0, Anthropic's agentic coding test, Fable 5.2 scores 49.1% at Xhigh effort. Anthropic calls that the highest score of any released model it has tested: Opus 5.5 is at 45.5%, GPT-6 Astra at 42.8%, Gemini 4 Carbon at 41.1%, and Fable 5.1 at 32.4%.",
            "The biggest jump is in robotics. On RoboDojo Sim, Fable 5.2 scores 64.9% at Max effort, more than double GPT-6 Astra (29.8%) and Fable 5.1 (27.6%). These are Anthropic's own evaluations, so treat them as the maker's numbers until others repeat them.",
          ],
          fable: "bench",
        },
        {
          title: "Speed and effort",
          text: [
            "Anthropic says Fable 5.2 generates outputs up to 30% faster than Fable 5.1. There is also an optional fast mode that speeds up token generation by up to 2.5 times, at a higher price ($16 input / $80 output per million tokens).",
            "Effort is the dial that trades time for quality. Medium is the default in the Claude apps and Claude Code. The launch scores were measured higher up: Xhigh for FrontierCode 2.0, Max for RoboDojo Sim. If a task matters, raise the effort before you rewrite the prompt.",
            "For long jobs, Anthropic's description is that it works until the job is actually complete instead of stopping at a plausible checkpoint. One customer quoted in the announcement ran a 10 to 12 hour security audit with it.",
          ],
          fable: "speed",
        },
        {
          title: "Price: 20% lower than Fable 5.1",
          text: [
            [
              "On the API, Fable 5.2 costs $8 per million input tokens and $40 per million output tokens. Fable 5.1 was $10 and $50, so the same work costs 20% less (",
              { text: "pricing docs", href: FB_PRICING },
              ").",
            ],
            "In the Claude apps, Fable is on the paid plans. Limits and terms differ by plan and Anthropic's pages describe them differently, so check your own plan before you count on it.",
          ],
          fable: "price",
        },
        {
          title: "How to switch to it",
          text: [
            "In the Claude apps, pick Fable 5.2 in the model menu. In Claude Code, choose it with /model. On the API, change the model id:",
          ],
          commands: ["claude-fable-5-2"],
        },
        {
          title: "Three prompts to try first",
          text: [
            "The outputs people shared in launch week came from short prompts that say what to build and how good it has to be, and then leave the method to the model. Three to start from (they are mine, written for this page):",
          ],
          code: [
            {
              label: "A film from one prompt",
              body: "Make a 60-second animated short film about a single dot that wants to reach the sun.\nWrite the code yourself, no stock footage, no external assets.\nAdd original music and sound. Render it and give me the file.\nDo not stop at a draft: watch your own render and fix what looks wrong before you finish.",
            },
            {
              label: "A playable game",
              body: "Build me a small first-person game I can play in the browser, one tiny level.\nEverything from scratch: models, sounds, textures.\nKeep the scope small and make that one level look as good as you can.\nPlay-test it yourself and fix what breaks before you hand it over.",
            },
            {
              label: "A long job on a real codebase",
              body: "Read this repository and find the three changes that would most reduce bugs.\nPlan them, make them one at a time, and run the tests after each one.\nIf a test fails, fix the cause, not the test.\nWhen you are done, give me a short report: what changed, what you verified, what you did not.",
            },
          ],
        },
      ],
      notes: [
        "Scores, speed and prices as of Nov 13, 2026, from Anthropic's own pages. The benchmark numbers are Anthropic's evaluations.",
        "The figures are drawn for this page. The token amounts in the price figure are yours to set; the race in the speed figure draws Anthropic's \"up to\" numbers and is not a measurement.",
        [
          "Sources: ",
          { text: "Anthropic, Introducing Claude Fable 5.2 and Claude Mythos 5.2", href: FB_POST },
          " · ",
          { text: "Claude Platform pricing", href: FB_PRICING },
        ],
      ],
    },
  },
  {
    number: 60,
    slug: "60-nine-free-github-repos",
    title: "Stop paying for these 9 apps",
    description:
      "Nine paid apps and the free, open-source versions on GitHub: Higgsfield, ElevenLabs, Semrush, Notion, Wispr Flow, Asana, Calendly, Intercom and Loom. Each repo with its stars, licence, and what to know before you switch.",
    date: "2026-11-10",
    keyword: "REPO",
    kind: "9 free repos",
    tools: [
      {
        name: "Open Generative AI · instead of Higgsfield",
        what: "AI image, video and lip-sync studio with 600+ models, self-hosted. MIT · ★ 33.8K. Cloud models need a Muapi API key.",
        href: RP_OGAI,
        icon: "wand",
      },
      {
        name: "VoiceStudio · instead of ElevenLabs",
        what: "Voice cloning, voice design, dubbing, dictation and audiobooks on your own hardware. AGPL-3.0 · ★ 106.8K.",
        href: RP_VOICE,
        icon: "cpu",
      },
      {
        name: "OpenSEO · instead of Semrush",
        what: "Keyword research, backlinks and site audits. MIT · ★ 27.1K. Data from DataForSEO, pay-as-you-go.",
        href: RP_SEO,
        icon: "browser",
      },
      {
        name: "AppFlowy · instead of Notion",
        what: "Docs, wikis and databases with AI, where you keep your data. AGPL-3.0 · ★ 78.6K. Local AI via Ollama.",
        href: RP_APPFLOWY,
        icon: "notebook",
      },
      {
        name: "OpenWhispr · instead of Wispr Flow",
        what: "Hotkey dictation into any app, with local or bring-your-own-key cloud models. MIT · ★ 11.2K.",
        href: RP_WHISPR,
        icon: "brain",
      },
      {
        name: "OpenProject · instead of Asana",
        what: "Project management with boards, roadmaps, Gantt charts and time tracking. GPL-3.0 · ★ 17.2K.",
        href: RP_OPENPROJECT,
        icon: "council",
      },
      {
        name: "Cal.diy · instead of Calendly",
        what: "Self-hosted booking pages, the community edition of Cal.com. MIT · ★ 49.9K. Its README says personal, non-production use.",
        href: RP_CALDIY,
        icon: "event",
      },
      {
        name: "Chatwoot · instead of Intercom",
        what: "Website chat, email and social messages in one support inbox, with an AI agent. MIT (except enterprise/) · ★ 39.6K.",
        href: RP_CHATWOOT,
        icon: "store",
      },
      {
        name: "Cap · instead of Loom",
        what: "Screen recordings with instant share links, or local recording and editing. AGPLv3 (mostly) · ★ 24.8K.",
        href: RP_CAP,
        icon: "scissors",
      },
    ],
    about: {
      intro: [
        "Nine subscriptions, and for each one an open-source project on GitHub that does the same job for free. Below: the nine side by side, a picker to flip the ones you pay for, and what \"free\" means for each before you switch.",
      ],
      chaptersLabel: "The nine",
      chapters: [
        {
          title: "Nine bills, nine repos",
          text: [
            "AI video, AI voice, SEO research, docs, dictation, project management, scheduling, support chat and screen recording. Each has a well-known paid app and an open-source version you can download or run on your own server.",
          ],
          repos: "swap",
        },
        {
          title: "Pick what you pay for",
          text: [
            "Tap the apps you pay for today. Each one flips to its free version, with the link to the repository, the GitHub stars, the licence and anything to know first.",
          ],
          repos: "picker",
        },
        {
          title: "What free means here",
          text: [
            "Free here means the code is free to use. You run it on your own computer or server, so setup, updates and hosting are yours. Some projects also sell a hosted version or paid extras; the repos below are the free part.",
            "On licences: MIT lets you use, change and sell the code with few conditions. GPL-3.0 and AGPL-3.0 are free to use too, including at work; if you distribute a changed version (and, for AGPL, if you run a changed version as a service for others), you share your changes under the same licence.",
          ],
          bullets: [
            [{ text: "Open Generative AI", href: RP_OGAI }, ": cloud models run through Muapi and need a Muapi API key; the desktop app can also run local models without one."],
            [{ text: "OpenSEO", href: RP_SEO }, ": the SEO data comes from DataForSEO with your own API key, paid as you go."],
            [{ text: "AppFlowy", href: RP_APPFLOWY }, ": local AI runs through Ollama."],
            [{ text: "Cal.diy", href: RP_CALDIY }, ": its README recommends it for personal, non-production use and has removed team and enterprise features."],
            [{ text: "Chatwoot", href: RP_CHATWOOT }, ": MIT, except the enterprise/ folder."],
            [{ text: "Cap", href: RP_CAP }, ": mostly AGPLv3, with some parts under MIT."],
          ],
        },
      ],
      notes: [
        "Stars and licences as of Nov 10, 2026, from the GitHub API. Stars change every day.",
        "The figures are drawn for this page. Notes are from each project's own README.",
        "A list by @copilot_shogo. Not affiliated with any of these projects or the paid apps named.",
      ],
    },
  },
  {
    number: 59,
    slug: "59-ai-agents-compared",
    title: "dots vs Muse vs Grok Bot vs MausBot",
    description:
      "Four AI agents that all promise to work for you in the background, and are four different things: OpenAI's dots, Meta's Muse, xAI's Grok Bot and the open-source OpenMausBot. What each one does, what it costs, where it runs, and a table to pick from.",
    date: "2026-11-09",
    keyword: "COMPARE",
    kind: "4 agents compared",
    tools: [
      {
        name: "dots (OpenAI)",
        what: "Always-on assistants inside ChatGPT that keep working on an ongoing goal with your connected apps. ChatGPT Pro (from $100/mo) or Business Premium; Pro is not in the EEA, Switzerland or the UK at launch.",
        href: AG_DOTS,
        icon: "robot",
      },
      {
        name: "Muse (Meta)",
        what: "A personal agent for everyday errands: bookings, shopping, forms and long-term goals, on its own cloud computer. Free for most of what people need, with paid plans. US, Canada and Singapore.",
        href: AG_MUSE,
        icon: "event",
      },
      {
        name: "Grok Bot (xAI)",
        what: "A team of always-on bots with roles (sales, marketing, operations and more) under a chief-of-staff bot. Included in the X Subscription from Premium ($30/mo). In beta.",
        href: AG_GROK,
        icon: "council",
      },
      {
        name: "OpenMausBot",
        what: "Open-source (Apache-2.0) bots you run from your own computer on the model you choose, with approval cards before risky steps. The app is free; you pay your model provider.",
        href: AG_MAUS,
        icon: "cpu",
      },
    ],
    about: {
      intro: [
        "Four launches in three months, and all four say the same thing: an agent that keeps working for you in the background. They aren't the same product. One lives in ChatGPT, one runs your errands, one is a team of work bots, and one is a kit you run yourself. Here is each one, with its real price and limits, then the table.",
      ],
      chaptersLabel: "The comparison",
      chapters: [
        {
          title: "Why they look alike, and how they differ",
          text: [
            "Read the launch posts and you'd think these are four versions of one thing. Look at what each one actually does and where it runs, and they split into four kinds of work: a worker inside ChatGPT, a personal assistant for life admin, a team of bots for a business, and an open-source setup on your own machine.",
          ],
          agents: "lineup",
        },
        {
          title: "OpenAI dots: an always-on worker inside ChatGPT",
          text: [
            [
              "OpenAI announced ",
              { text: "dots", href: AG_DOTS },
              " at DevDay on Sep 29, 2026. You give a dot an ongoing goal and connect your apps, and it keeps working in the background, even with ChatGPT closed. OpenAI calls them proactive assistants that \"work towards your goals 24/7\", each with its own cloud computer.",
            ],
            [
              "Who gets it: ChatGPT ",
              { text: "Pro", href: AG_PRO_TIERS },
              " (from $100 a month) and Business Premium users aged 18 and over, rolling out gradually. Pro access excludes the EEA, Switzerland and the UK at launch (",
              { text: "getting started", href: AG_DOTS_HELP },
              ").",
            ],
          ],
          agents: "dots",
        },
        {
          title: "Meta Muse: a personal agent for everyday tasks",
          text: [
            [
              { text: "Muse", href: AG_MUSE },
              " (Sep 8, 2026) handles the errands: booking travel, sending an email, shopping, filling out forms, and bigger goals it turns into a plan. Meta says it can open a browser, fill out forms and negotiate on your behalf, on \"its own dedicated computer in the cloud\", and it comes back when something changes or it needs your approval.",
            ],
            [
              "Price: \"free for most of what people need, with subscription plans for people who want to do more.\" Where: the US, Canada and, since Oct 28, ",
              { text: "Singapore", href: AG_MUSE_SG },
              ", on iOS, Android and muse.ai.",
            ],
          ],
          agents: "muse",
        },
        {
          title: "xAI Grok Bot: a team of always-on bots",
          text: [
            [
              { text: "Grok Bot", href: AG_GROK },
              " (beta since Aug 11, 2026) is a team rather than one assistant: specialist bots for inbox, expenses, recruiting, operations, sales outbound and marketing, coordinated by a chief-of-staff bot. They share one persistent cloud computer with a browser, files and a terminal, and you reach them on desktop, mobile, in Slack or on X (",
              { text: "docs", href: AG_GROK_DOCS },
              ").",
            ],
            [
              "Price: since Oct 12 it comes with ",
              { text: "the X Subscription", href: AG_XSUB },
              " Premium ($30 a month), Super ($100) and Ultra ($200); the Plus tier doesn't include it. Existing SuperGrok and Cursor plans keep it.",
            ],
          ],
          agents: "grok",
        },
        {
          title: "MausBot: open source, on your own computer",
          text: [
            [
              { text: "OpenMausBot", href: AG_MAUS },
              " (also called MausBot) is open source under Apache-2.0, with about 19,000 GitHub stars on Nov 9, 2026. It runs from your own machine on the claude, codex or grok CLIs, or another model through an OpenAI-compatible endpoint (Gemini, Ollama and others). Transcripts and keys stay in a folder on your disk. Each bot works in a cloud Linux desktop, a local VM or, if you opt in, your own computer (macOS and Ubuntu Xorg), and approval cards stop it before risky steps; a phone companion is optional.",
            ],
            [
              "Price: the desktop app is free. You pay your model provider, and their limits apply. Without the optional Cloud plans ($15, $49 or $99 a month, ",
              { text: "mausbot.com", href: AG_MAUS_SITE },
              "), bots only work while your computer is awake. It calls itself \"the open source Grok Bot alternative\" and is not affiliated with xAI, Meta or OpenAI.",
            ],
          ],
          agents: "maus",
        },
        {
          title: "The table: which one fits",
          text: [
            "Pick a row to compare one thing across all four, or pick what you need and the one that fits lights up. There is no overall winner: they solve different problems.",
          ],
          agents: "table",
        },
      ],
      notes: [
        "Prices, plans and regions as of Nov 9, 2026, from each company's own pages. They change often; check the source before you pay.",
        "The figures are drawn for this page. The characters are each company's own mascots. The goals, errands, tasks and log lines inside the figures are examples.",
        [
          "Sources: ",
          { text: "OpenAI, Introducing dots", href: AG_DOTS },
          " · ",
          { text: "Meta, Introducing Muse", href: AG_MUSE },
          " · ",
          { text: "xAI, Introducing Grok Bot", href: AG_GROK },
          " · ",
          { text: "X Subscription pricing", href: AG_XSUB },
          " · ",
          { text: "milind-soni/OpenMausBot", href: AG_MAUS },
        ],
        "A comparison by @copilot_shogo. Not affiliated with OpenAI, Meta, xAI or OpenMausBot.",
      ],
    },
  },
  {
    number: 58,
    slug: "58-freellmapi",
    title: "Run Claude Code on 34 free AI tiers",
    description:
      "FreeLLMAPI stacks the free tiers of 34 AI providers (about 7.4 billion tokens a month) behind one endpoint that Claude Code can use. When a free model hits its limit, it switches to the next and can leave a handoff note. The setup, how the switch works, and the limits.",
    date: "2026-11-08",
    keyword: "FREE",
    tools: [
      {
        name: "FreeLLMAPI",
        what: "One OpenAI-compatible /v1 endpoint, plus Anthropic's /v1/messages for Claude Code, over the free tiers of 34 providers. It falls over to the next model when one is rate-limited. Open source (MIT).",
        href: FL_REPO,
        icon: "plug",
        install: [FL_SETUP],
        note: "Start the router first (the desktop app or Docker), add your provider keys on its Keys page, and paste the unified key from that page in place of <unified-key>.",
      },
    ],
    about: {
      intro: [
        "Every AI lab has a free tier. On its own each one is small; stacked, ",
        { text: "FreeLLMAPI", href: FL_REPO },
        " counts about 7.4 billion tokens a month across 34 providers and 635 free model endpoints, all behind one local endpoint. Here is what it is, how to point Claude Code at it, what happens when a model runs out, and where it falls short.",
      ],
      chaptersLabel: "The guide",
      chapters: [
        {
          title: "What it is: 34 free tiers, one endpoint",
          text: [
            [
              "FreeLLMAPI is a router you run on your own machine. You add API keys for the providers you want (Google, Groq, Cerebras, Mistral, OpenRouter and more), and it serves them all on one OpenAI-compatible ",
              { code: "/v1" },
              " endpoint. It also speaks Anthropic's ",
              { code: "/v1/messages" },
              ", which is how Claude Code runs on the free pool. Your apps see a single key; the provider keys are stored encrypted.",
            ],
            [
              "The full catalog, with each model's rate limits and free-token budget, is at ",
              { text: "freellmapi.co/models", href: FL_MODELS },
              ".",
            ],
          ],
          freellmapi: "stack",
        },
        {
          title: "Set it up with Claude Code",
          text: [
            [
              "Run the router: the ",
              { text: "desktop app", href: FL_RELEASES },
              " for macOS or Windows, or Docker (",
              { text: "install guide", href: FL_INSTALL_DOC },
              "). Open it, add your provider keys on the Keys page and copy the unified key. Then one command (under the figure) points Claude Code at it.",
            ],
            [
              "Add ",
              { code: "--dry-run" },
              " first to see the diff; a real run merges into your existing Claude Code config and makes a timestamped backup. Other agents (Codex CLI, Cline, Aider, Cursor and more) have their own setup commands: ",
              { text: "Clients & coding agents", href: FL_AGENTS_DOC },
              ".",
            ],
          ],
          freellmapi: "setup",
          commands: [FL_SETUP],
        },
        {
          title: "When a model hits its limit",
          text: [
            "The router picks the best available model for each request. When that provider answers 429 (rate limited) or a 5xx error, it cools that key down and retries the next model in your chain, so the session keeps going.",
            [
              "A new model doesn't know it's picking up someone else's task. The optional ",
              { text: "context handoff", href: FL_HANDOFF_DOC },
              " adds one short system message when the model changes, telling it to continue rather than start over. It is off by default; the line that turns it on goes in the router's ",
              { code: ".env" },
              " (under the figure).",
            ],
          ],
          freellmapi: "failover",
          code: [{ label: ".env", body: "FREELLMAPI_CONTEXT_HANDOFF=on_model_switch" }],
        },
        {
          title: "The limits, honestly",
          text: [
            "The README is direct about what this is and isn't:",
          ],
          bullets: [
            [
              { text: "\"For personal experimentation and learning, not production.\"", href: FL_REPO + "#disclaimer" },
              " If you build something real on it, swap in a paid API before you ship.",
            ],
            [
              "No frontier models, variable latency, no SLA. The best free models hit their daily caps late in the day, then reset at UTC midnight (",
              { text: "limitations", href: FL_LIMITS_DOC },
              ").",
            ],
            [
              "Each provider's terms still apply when your traffic goes through the proxy, and you're responsible for following them (",
              { text: "the project's review, provider by provider", href: FL_TOS_DOC },
              ").",
            ],
          ],
          freellmapi: "limits",
        },
      ],
      notes: [
        "Numbers are the README's on Nov 8, 2026; the catalog updates itself, so they change. GitHub stars read the same day.",
        "The figures are drawn for this page. The provider names, counts, command, error codes and handoff text are the project's own; the requests, the chain and the times of day inside them are examples.",
        [
          "Sources: ",
          { text: "tashfeenahmed/freellmapi", href: FL_REPO },
          " · ",
          { text: "Clients & coding agents", href: FL_AGENTS_DOC },
          " · ",
          { text: "Install & deploy", href: FL_INSTALL_DOC },
        ],
        "An explainer by @copilot_shogo. The avatar is the repo owner's GitHub avatar. Not affiliated with FreeLLMAPI, Anthropic or any of the providers.",
      ],
    },
  },
  {
    number: 55,
    slug: "55-five-skills",
    title: "The only 5 Claude Code skills you need",
    description:
      "Over a million agent skills are listed on skills.sh. These five are the ones worth installing: find-skills, Superpowers, claude-mem, Impeccable and task-observer. What each one does, the exact install line, and a live figure for each.",
    date: "2026-11-07",
    keyword: "SKILLS",
    kind: "5 skills",
    tools: [
      {
        name: "find-skills",
        what: "Tell Claude what you're building, and it searches the open skills registry, finds the right skills and installs the one you pick. By Vercel, open source (MIT).",
        href: FS_REPO,
        icon: "store",
        install: [FIVE_FS_INSTALL],
        note: "Run it in your terminal, in your project's folder; add -g to install it for every project. The Skills CLI needs Node.js 22.20 or later.",
      },
      {
        name: "Superpowers",
        what: "Makes Claude slow down: it asks what you really want, writes a plan, builds test-first and checks its own work before calling it done. A set of skills by Jesse Vincent (MIT).",
        href: FIVE_SP,
        icon: "wand",
        install: [FIVE_SP_INSTALL],
        note: "Paste it into Claude Code. Superpowers is in Anthropic's official plugin marketplace.",
      },
      {
        name: "claude-mem",
        what: "Gives Claude memory across sessions: it saves what happened as you work and brings it back when the next session starts. A Claude Code plugin, open source (Apache-2.0).",
        href: FIVE_CM,
        icon: "brain",
        install: [FIVE_CM_INSTALL],
        note: "Run it in your terminal, or in Claude Code: /plugin marketplace add thedotmack/claude-mem, then /plugin install claude-mem. The installer offers a sign-in with a 30-day free trial of its hosted memory; after that, memory runs on your Anthropic plan unless you subscribe. Pass an explicit --provider flag to skip the sign-in.",
      },
      {
        name: "Impeccable",
        what: "Gives Claude a design vocabulary (bolder, polish, critique, audit and 20 more) and a detector that catches AI slop before it ships. By Paul Bakaus (Apache-2.0).",
        href: FIVE_IM,
        icon: "palette",
        install: [FIVE_IM_INSTALL, "/impeccable init"],
        note: "Run the first line in your project's folder and say yes to the design hook. Reload Claude Code, then run /impeccable init once in Claude Code.",
      },
      {
        name: "task-observer",
        what: "Watches how you work, learns from your corrections and suggests improvements to your other skills, which you approve. By Eoghan Henn (CC BY 4.0).",
        href: FIVE_TO,
        icon: "review",
        install: [FIVE_TO_INSTALL],
        note: "Run it in your terminal (add -g for every project). Then add the activation instruction from references/environments.md to your CLAUDE.md: installing alone is not enough, because it won't trigger reliably on its own.",
      },
    ],
    about: {
      intro: [
        "Over a million agent skills are listed on ",
        { text: "skills.sh", href: FIVE_SKILLS_SH },
        " (1,270,748 on Nov 6, 2026). You only need five. Here they are in the order of the reel, each with what it does, the exact install line, and a figure you can play with.",
      ],
      chaptersLabel: "The five",
      chapters: [
        {
          title: "Find Skills: tell it what you're building",
          text: [
            [
              "find-skills is made by Vercel and lives in ",
              { text: "vercel-labs/skills", href: FS_REPO },
              ". You tell Claude what you're building; it turns that into search keywords, searches the skills on skills.sh, finds the right ones for you, and installs the one you pick. It's the most installed skill on skills.sh, with 4.2M installs.",
            ],
            ["More on how it searches and picks: ", { text: "/free/53", href: "/free/53" }, "."],
          ],
          fiveskills: "find",
          commands: [FIVE_FS_INSTALL],
        },
        {
          title: "Superpowers: plan first, check its own work",
          text: [
            [
              "Give Claude a task and ",
              { text: "Superpowers", href: FIVE_SP },
              " makes it slow down. It doesn't jump into code: it asks what you're really trying to do, shows you the design, writes a plan of bite-sized tasks, builds it test-first, and verifies the work before it touches your project's main branch. The skills trigger on their own.",
            ],
            "Seven of its skills are in my own setup: systematic-debugging, test-driven-development, writing-plans, executing-plans, verification-before-completion, using-git-worktrees and requesting-code-review.",
          ],
          fiveskills: "plan",
          commands: [FIVE_SP_INSTALL],
        },
        {
          title: "claude-mem: memory across sessions",
          text: [
            [
              "Claude forgets everything between sessions. ",
              { text: "claude-mem", href: FIVE_CM },
              " gives it memory: its hooks capture what Claude does as you work, save it as observations and summaries in a local database, and the next session starts with that context. In its README's words: \"Context survives across sessions.\"",
            ],
          ],
          fiveskills: "memory",
          commands: [FIVE_CM_INSTALL],
        },
        {
          title: "Impeccable: design taste for your front end",
          text: [
            [
              "For front-end, ",
              { text: "Impeccable", href: FIVE_IM },
              " gives Claude the words for good design. Name a move and a target, like ",
              { code: "/impeccable bolder the pricing cards" },
              ", and it loads a playbook for that one move. ",
              { code: "critique" },
              " and ",
              { code: "audit" },
              " review the page, and a detector with 62 rules flags the tells of AI slop, like Inter for everything and purple-to-blue gradients, so your UI stops looking like slop.",
            ],
          ],
          fiveskills: "design",
          commands: [FIVE_IM_INSTALL],
        },
        {
          title: "task-observer: it improves your other skills",
          text: [
            [
              "And finally, ",
              { text: "task-observer", href: FIVE_TO },
              ". It runs alongside your work, watches what you do, and logs what it notices: corrections you make, gaps no skill covers yet, even its own blind spots. Then it suggests specific updates to your skills. You approve each one, so your skills keep getting better the more you use them. In its README's words: \"You work normally. It watches. Your skill library grows and gets better over time.\"",
            ],
            [
              "One step after installing: add the activation instruction from ",
              { text: "references/environments.md", href: FIVE_TO_ENV },
              " to your CLAUDE.md, so it runs in every session.",
            ],
          ],
          fiveskills: "observer",
          commands: [FIVE_TO_INSTALL],
        },
      ],
      notes: [
        "GitHub stars are from Nov 6, 2026 (20:57 JST); the skills.sh count is its All Time figure on the same day. Both change every day. find-skills' stars are for the whole vercel-labs/skills repo.",
        "The figures are drawn for this page. The requests, sessions and suggestions inside them are examples; the search results, workflow, hooks, commands and rules are each project's own.",
        [
          "Sources: ",
          { text: "vercel-labs/skills", href: FS_REPO },
          " · ",
          { text: "obra/superpowers", href: FIVE_SP },
          " · ",
          { text: "thedotmack/claude-mem", href: FIVE_CM },
          " · ",
          { text: "pbakaus/impeccable", href: FIVE_IM },
          " · ",
          { text: "rebelytics/one-skill-to-rule-them-all", href: FIVE_TO },
          " · ",
          { text: "skills.sh", href: FIVE_SKILLS_SH },
        ],
        "An explainer by @copilot_shogo. The logos are each repo owner's GitHub avatar. Not affiliated with Anthropic, Vercel or any of the authors.",
      ],
    },
  },
  {
    number: 54,
    slug: "54-lifters-club",
    title: "Lifters Club: the free gym app I built that shows you how to do every lift",
    description:
      "My free gym app: 582 exercises with the full movement in 3D, sets logged in a few taps with last time already there to beat, a progress chart for every lift, and a coach mode where Claude plans a client's next block with you.",
    date: "2026-11-06",
    keyword: "LIFT",
    kind: "the app",
    tools: [
      {
        name: "Lifters Club",
        what: "The gym app: 582 exercises with a 3D clip each, set logging, progress charts, and a coach mode for your clients. Free, and it runs in your phone's browser.",
        href: LIFTERS_URL,
        icon: "notebook",
      },
    ],
    about: {
      intro: [
        "Lifters Club is a gym app I built with Claude Code. It's free: open ",
        { text: "lifters.club", href: LIFTERS_URL },
        " on your phone. Every number on this page is from the app's demo account (a fictional client, Alex Morgan, and coach, Sam Lee).",
      ],
      chaptersLabel: "How it works",
      chapters: [
        {
          title: "Find the lift, then watch the whole movement",
          text: [
            "Search 582 exercises. Each one has a 3D clip of the full movement, with the muscles doing the work marked in red, so you know exactly how to do it before you touch the bar.",
          ],
          lifters: "library",
        },
        {
          title: "Log a set in a few taps, and beat last time",
          text: [
            "Open the exercise and your last numbers are already there: last time Alex squatted 100×9, 100×8, 100×8. Set the weight and reps, tap Log set, and the rest timer starts. Beat it and the app tells you on the spot.",
          ],
          lifters: "log",
        },
        {
          title: "Every lift turns into a chart",
          text: [
            "From your weight and reps, the app works out the most you could lift once, and plots it for every exercise. You see yourself getting stronger without ever testing a one-rep max: Alex's squat went from 93 to 130 kg in 12 sessions.",
          ],
          lifters: "progress",
        },
        {
          title: "For coaches: every client in one place",
          text: [
            "Every client's workouts, sets and notes are in one place. When you can't be there, they still see perfect form in the app, and you still see every set they log.",
            "Set their targets or change their plan, and it's on their phone, with your note on why.",
          ],
          lifters: "coach",
        },
        {
          title: "Plan the next block with Claude",
          text: [
            "Connect Claude and plan a client's next block together. Claude reads the plan and the progress, proposes the new plan as a diff, and saves nothing until you say OK. Step through the real run below.",
          ],
          lifters: "claude",
        },
      ],
      notes: [
        "Numbers are from the Lifters Club demo account (fictional client Alex Morgan, coach Sam Lee), recorded for the reel. The 12 squat points are read off the app's own chart. The Claude run is the real output of the Lifters Club MCP server in Claude Code.",
        "The figures on this page are drawn for the page; the app's 3D clips are licensed and not shown here.",
        "I built Lifters Club. Not affiliated with Anthropic.",
      ],
    },
  },
  {
    number: 53,
    slug: "53-find-skills",
    title: "find-skills: the free skill that finds you the right skills",
    description:
      "The most installed agent skill in the world is free, and all it does is find you other skills. What find-skills is, why searching a million skills yourself is a lottery, the same search done both ways, and how it picks.",
    date: "2026-11-06",
    keyword: "SKILLS",
    kind: "the skill",
    tools: [
      {
        name: "find-skills",
        what: "Vercel's skill that turns what you're working on into search keywords, checks installs and makers, and installs the skill you pick. Open source (MIT). Works in Claude Code, Cursor, Codex and more.",
        href: FS_REPO,
        icon: "store",
        install: [FS_INSTALL],
        note: "Run it in your project's folder. The Skills CLI needs Node.js 22.20 or later; add -g to install it for every project.",
      },
    ],
    about: {
      intro: [
        "find-skills is a skill made by Vercel. Install it once, then just tell your agent what you're trying to do. It searches ",
        { text: "skills.sh", href: "https://skills.sh/" },
        " for you and installs the good one.",
      ],
      chaptersLabel: "The explainer",
      chapters: [
        {
          title: "The most installed skill there is",
          text: [
            [
              "find-skills lives in ",
              { text: "vercel-labs/skills", href: FS_REPO },
              ", Vercel's open-source Skills CLI (MIT license). On ",
              { text: "its skills.sh page", href: FS_PAGE },
              " it has 4.2M installs, #1 on the leaderboard. It works with Claude Code, Cursor, Codex and the other agents the CLI supports.",
            ],
          ],
          findskills: "rank",
          commands: [FS_INSTALL],
        },
        {
          title: "A million skills, and most of them nobody uses",
          text: [
            [
              "Vercel's ",
              { text: "State of agent skills", href: FS_STATE },
              " counts about one million agent skills. Nearly half were installed exactly once. Just 375 skills, 0.04% of the registry, get 62% of all installs.",
            ],
            "So searching on your own is a lottery: most of what you find has never been used by anyone else.",
          ],
          findskills: "pile",
        },
        {
          title: "Your words vs. the right keywords",
          text: [
            "Search the way you'd say it, \"make my site faster\", and the Skills CLI finds one skill with 3 installs. find-skills turns what you're working on into the keywords skills are listed under, \"web performance\", and the same search returns 20, led by Vercel and Cloudflare with up to 1.3M installs.",
          ],
          findskills: "search",
        },
        {
          title: "How it picks",
          text: [
            [
              "find-skills doesn't recommend a skill on search results alone. Its ",
              { text: "SKILL.md", href: FS_SKILL_MD },
              " tells the agent to prefer skills with 1K+ installs, be cautious under 100, trust official sources over unknown authors, and be skeptical of repos with fewer than 100 GitHub stars. Then it shows you the best few, each with its install count, source and install command, and installs the one you pick.",
            ],
          ],
          findskills: "pick",
        },
      ],
      notes: [
        "Install counts are from skills.sh and from two runs of the Skills CLI (skills@1.7.4) on Nov 4, 2026. They change every day.",
        ["Sources: ", { text: "vercel-labs/skills on GitHub", href: FS_REPO }, " · ", { text: "find-skills on skills.sh", href: FS_PAGE }, " · ", { text: "find-skills' SKILL.md", href: FS_SKILL_MD }, " · ", { text: "Vercel: State of agent skills", href: FS_STATE }],
        "An explainer by @copilot_shogo. Clawd is Claude Code's own mascot. Not affiliated with Vercel, Anthropic or skills.sh.",
      ],
    },
  },
  {
    number: 52,
    slug: "52-claude-edit-setup",
    title: "My whole reel setup with Claude Code: one folder, four tools, one rule page",
    description:
      "The setup behind my last 51 reels, free: one folder per reel, four tools (Remotion, ElevenLabs, Rubber Band, FFmpeg), one rule page Claude Code reads before every reel, and a check that refuses to render when a rule breaks.",
    date: "2026-11-04",
    keyword: "STUDIO",
    kind: "the setup",
    tools: [
      { name: "Claude Code", what: "Writes every reel as code, reads past reels and the rule page first.", href: "https://docs.anthropic.com/en/docs/claude-code/overview", icon: "robot", install: ["npm install -g @anthropic-ai/claude-code"] },
      { name: "Remotion", what: "Turns React code into video and renders every frame.", href: "https://www.remotion.dev/", icon: "cube", install: ["npx create-video@latest"] },
      { name: "ElevenLabs", what: "My cloned voice, with the start time of every word (the with-timestamps endpoint), so captions land on the exact frame.", href: "https://elevenlabs.io/", icon: "wand" },
      { name: "Rubber Band", what: "Speeds the voice up without changing its pitch.", href: "https://breakfastquay.com/rubberband/", icon: "scissors", install: ["brew install rubberband"] },
      { name: "FFmpeg", what: "Mixes voice and music and sets every reel to the same loudness.", href: "https://ffmpeg.org/", icon: "plug", install: ["brew install ffmpeg"] },
    ],
    about: {
      intro: ["This is the setup I've used for my last 51 reels on @copilot_shogo. Nothing to buy except the services you already use. Take the folder layout and the starter rule page below."],
      chaptersLabel: "The setup",
      chapters: [
        {
          title: "One folder per reel",
          text: [
            "Every reel gets its own folder with the same four files: the script, the voice, the code and the final video. Claude Code works inside the whole project, so it can open any past reel and reuse what worked. Each new reel's code starts from one of the best-rated past reels.",
          ],
          studio: "folder",
          code: [{ label: "the layout", body: STUDIO_TREE }],
        },
        {
          title: "Four tools do the work",
          text: [
            "Claude writes the reel as React. Remotion renders it. ElevenLabs reads the script in my cloned voice and returns the time of every word. Rubber Band speeds it up without the chipmunk sound. FFmpeg mixes the music and sets the loudness.",
          ],
          studio: "tools",
        },
        {
          title: "The rule page is why it works",
          text: [
            "Every time a reel looked cheap, the fix became a line on one page. Claude Code reads that page before every reel, so the same mistake doesn't come back. Mine is 230 lines now. Start with the one below and add a line every time you catch something.",
          ],
          studio: "rules",
          code: [{ label: "craft.md (starter)", body: STUDIO_RULES }],
        },
        {
          title: "A check that refuses to render",
          text: [
            "Rules you only read get skipped. A small script checks the ones a machine can check (a missing mascot, text outside the caption boxes, no real material listed) and stops the render with a list of what's broken.",
          ],
          studio: "check",
        },
      ],
      notes: [
        "Numbers on this page are from my own studio: file sizes of real reel folders, reel #52's frame count and word timings, and the loudness of reels #42–#49 measured with FFmpeg on Nov 4, 2026.",
        "Clawd, the little orange character, is Claude Code's own mascot, drawn from the characters Claude Code prints when it starts. Not affiliated with Anthropic, Remotion, ElevenLabs, Rubber Band or FFmpeg.",
      ],
    },
  },
  {
    number: 50,
    slug: "50-hackertube",
    title: "HackerTube: Karpathy had Claude build his own YouTube from Hacker News",
    description:
      "Karpathy was annoyed with YouTube's recommendations, so he had Claude filter 43M Hacker News comments down to 6,454 videos people keep recommending. How it works, what he did by hand, the copies it set off, and the free data to build your own.",
    date: "2026-11-03",
    keyword: "TUBE",
    kind: "explainer",
    tools: [],
    icon: "browser",
    about: {
      intro: [
        "HackerTube is a weekend hack by Andrej Karpathy, ",
        { text: "posted on Oct 31, 2026", href: HT_BLOG },
        ". It's free and needs no login: ",
        { text: "hackertube.org", href: HT_SITE },
        ". The numbers and quotes below are from his ",
        { text: "post on X", href: HT_X },
        ", his blog and the site's data page.",
      ],
      chaptersLabel: "The explainer",
      chapters: [
        {
          title: "A YouTube picked by Hacker News, not by the algorithm",
          text: [
            "In Karpathy's words: \"I was annoyed with YouTube's recommendations so I had Claude filter down 43M comments over 20 years of HN to 6,454 videos that keep being recommended.\"",
            "Every video on the site is there because people on Hacker News kept recommending it in their comments. Run the filter on six real rows from the data.",
          ],
          hackertube: "filter",
        },
        {
          title: "No login, and your history stays in your browser",
          text: ["There's no account. What you watch is remembered by your own browser, not by a server, and the recommendations still work."],
          hackertube: "browser",
        },
        {
          title: "Thumbnails from the middle of the video",
          text: [
            "YouTube shows the picture the uploader chose, often tested to get the most clicks. HackerTube shows a frame from the middle of the video instead, so you see what the video actually looks like.",
          ],
          hackertube: "thumb",
        },
        {
          title: "About two hours with Opus 5.5, three things by hand",
          text: [
            "Karpathy says it took about two hours with Opus 5.5. The only manual work was in the browser: an API key from Google Cloud (for YouTube's video metadata), a VPS to serve it, and the domain name.",
            "Then he gave Claude the server and told it to update, secure, harden, deploy and optimize the code.",
          ],
          hackertube: "hand",
        },
        {
          title: "Within two days, people copied it",
          text: [
            "HackerTube went to #1 on Hacker News. The next day HackerBooks did the same for books mentioned on HN, and on Nov 2 came Wikihack (Wikipedia articles) and HackerHack (HN posts).",
          ],
          hackertube: "copies",
        },
        {
          title: "Build your own from the data",
          text: [
            "The data behind the site is one free zip on hackertube.org/data: 6,454 videos and 39,834 labeled Hacker News comments, exported on Oct 31, 2026.",
            "Karpathy's suggestion: point your Claude at it and ask for your own version. DATA.md in the zip starts with a section for AI agents.",
          ],
          hackertube: "zip",
        },
      ],
      notes: [
        "DATA.md says each comment was read by Claude Sonnet 5.5, and the whole pipeline was built and coordinated by Claude Opus 5.5 in Claude Code, prompted by @karpathy. The data is under the Open Data Commons Attribution License (ODC-By) v1.0.",
        ["Sources: ", { text: "Karpathy on X, Nov 1, 2026", href: HT_X }, " · ", { text: "his blog post", href: HT_BLOG }, " · ", { text: "hackertube.org/data", href: HT_DATA }, " · ", { text: "the HN thread", href: HT_HN }, " · the HN front pages of Oct 31 to Nov 2"],
        "An explainer by @copilot_shogo. Not affiliated with Karpathy or HackerTube.",
      ],
    },
  },
  {
    number: 49,
    slug: "49-subvocal",
    title: "Subvocal: glasses that let you type without making a sound",
    description:
      "Subvocal's glasses read how your lips and jaw move with radar, and AI turns it into text. How it works, what it's for, what $499 gets you today, and what's still a prototype.",
    date: "2026-11-03",
    keyword: "SILENT",
    kind: "explainer",
    tools: [],
    icon: "brain",
    about: {
      intro: [
        "Subvocal is a YC startup (Fall 2026) that ",
        { text: "opened preorders on Oct 30, 2026", href: SUBVOCAL_POST },
        " for glasses you type with by mouthing the words. Everything below is from Subvocal's own post, launch film and ",
        { text: "preorder page", href: SUBVOCAL_PREORDER },
        ".",
      ],
      chaptersLabel: "The explainer",
      chapters: [
        {
          title: "Typing without a sound",
          text: [
            "Talking to your computer is fast, but you can't always speak out loud. Subvocal's idea: you mouth the words silently and the glasses type them.",
            "In the company's words, it \"decodes silent, almost invisible mouthing into text at more than 200 words/min.\"",
          ],
          subvocal: "silent",
        },
        {
          title: "How it works: radar on your lips and jaw",
          text: [
            "The glasses send radar signals toward your face. When you silently form words, your lips and jaw move, and that changes how the signals bounce back.",
            "The film labels three of them: upper lip, lower lip and jaw. The preorder page says Subvocal does not use or require cameras for silent speech input.",
          ],
          subvocal: "radar",
        },
        {
          title: "AI turns the signals into text",
          text: ["Subvocal's AI learns from those returning signals and turns them into text. The film's example sentence is \"Explain the new system to me.\""],
          subvocal: "decode",
          bullets: ["200+ words a minute is Subvocal's own claim. No accuracy numbers have been published yet."],
        },
        {
          title: "A conversation nobody hears",
          text: [
            "Besides messaging your team or telling an AI agent what to do in public, two people wearing Subvocal can have a private conversation, even across a crowded room.",
          ],
          subvocal: "room",
        },
        {
          title: "What $499 gets you today",
          text: [
            "A preorder. The early-bird price is $499 (regular $699), with a $199 deposit per pair that's fully refundable any time before the final payment. Paid preorders are US only.",
            "Shipping is expected to start in Q1 2027, delivery is subject to FCC approval, and no delivery date is confirmed yet.",
          ],
          subvocal: "preorder",
        },
      ],
      notes: [
        "Parts of the launch film are marked \"*Prototype design\", and the signal panel in it is a graphic. The prototype in the interviews is wired.",
        "Subvocal raised $1.3M from YC, Afore Capital and angels. That's the total, not YC alone.",
        "Not to be confused with AlterEgo (an MIT spin-out) or Cornell's EchoSpeech research.",
        ["Sources: ", { text: "Subvocal on X, Oct 30, 2026", href: SUBVOCAL_POST }, " · ", { text: "the preorder page", href: SUBVOCAL_PREORDER }, " · ", { text: "Y Combinator", href: SUBVOCAL_YC }, " · the launch film's subtitles"],
        "An explainer by @copilot_shogo. Not affiliated with Subvocal.",
      ],
    },
  },
  {
    number: 48,
    slug: "48-suncatcher-haiku",
    title: "Project Suncatcher: Google's first AI answer from a data-center TPU in orbit was a haiku",
    description:
      "Google ran its open model Gemma 4 on its own AI chip in orbit and got a haiku back over Svalbard, Norway. What happened, why Google wants AI in space, three of the hard problems (radiation, bandwidth, formation), and how far along it really is.",
    date: "2026-11-02",
    keyword: "ORBIT",
    kind: "explainer",
    tools: [],
    icon: "cpu",
    about: {
      intro: [
        "Project Suncatcher is Google's research moonshot to find out whether space is a good place to run AI, because satellites get plenty of solar power. On Oct 30, 2026, ",
        { text: "Google reported", href: SUNCATCHER_POST },
        " its first answer from orbit. Everything below is from Google's own posts unless noted.",
      ],
      chaptersLabel: "The explainer",
      chapters: [
        {
          title: "Hello World from orbit",
          text: [
            "On October 1, 2026, Google launched a prototype satellite, developed with Planet, on SpaceX's Transporter-18 rideshare. First came a commissioning checklist: powering up the host and TPU trays, then early machine-learning tests.",
            "Then, during a ground-station pass, the team uplinked a first prompt to Gemma 4, Google's open model, running on board. They asked for a haiku about being in space. As the satellite passed by Svalbard, Norway, the poem came back down.",
            "Google calls it its \"Hello World\" milestone: the first-ever AI response from a data-center-class TPU in orbit. A TPU is Google's own AI chip.",
          ],
          suncatcher: "hello",
        },
        {
          title: "Why put AI in space?",
          text: [
            "AI needs power, and in the right orbit the sun barely sets. In that orbit, Google says, a solar panel can be up to 8 times more productive than on Earth.",
            "Future satellites would likely fly a dawn–dusk sun-synchronous low Earth orbit, with near-constant sunlight. That reduces the need for heavy batteries on board.",
          ],
          suncatcher: "sun",
          bullets: ["That orbit is the likely choice in Google's 2025 design. Google hasn't said the prototype flies it."],
        },
        {
          title: "Hard problem 1: radiation",
          text: [
            "Space is hard on chips. In a lab, Google put Trillium, its v6e Cloud TPU, in a 67 MeV proton beam. The most sensitive part, the high-bandwidth memory (HBM), only began showing irregularities after a cumulative dose of 2 krad(Si). That's nearly three times the dose expected over a five-year mission with shielding: 750 rad(Si).",
          ],
          suncatcher: "radiation",
          bullets: ["This was a ground test. Testing heat and radiation in orbit is the next step."],
        },
        {
          title: "Hard problem 2: bandwidth",
          text: [
            "The satellites would talk to each other by laser. On a bench-scale demonstrator, Google reached 800 Gbps each way, 1.6 Tbps in total, with a single pair of transceivers.",
          ],
          suncatcher: "laser",
        },
        {
          title: "Hard problem 3: formation",
          text: [
            "To work like one data center, the satellites would fly in a tight cluster. Google's paper shows an illustrative layout: 81 satellites in a cluster with a 1 km radius, so about 2 km across, with the distance between next-nearest-neighbour satellites swinging between about 100 and 200 m.",
          ],
          suncatcher: "cluster",
        },
        {
          title: "What's next",
          text: [
            "Google's TPUs are in orbit; the lasers and the cluster aren't yet. Next, Google will test how its TPUs perform under thermal stress and radiation exposure in orbit. Then, in 2027, two interconnected satellites, where Google plans to test the laser links in orbit.",
          ],
          suncatcher: "next",
        },
      ],
      notes: [
        "\"First\" means the first from a data-center-class TPU. Other AI chips have answered from orbit before: Starcloud-1, launched in November 2025, carried an NVIDIA H100 into orbit and ran a Google model there (Starcloud says Gemini; Demis Hassabis's quoted post says Gemma).",
        "Some reports give the number of TPUs, the power and how long each pass lasts. Google hasn't published these, so they're left out.",
        "The prompt is from Sundar Pichai's screen recording of Oct 30, 2026. The haiku and every Suncatcher number are from Google's posts below.",
        ["Sources: ", { text: "Google, Oct 30, 2026 (the haiku)", href: SUNCATCHER_POST }, " · ", { text: "Google, Sep 24, 2026 (the launch)", href: SUNCATCHER_FACTS }, " · ", { text: "Google Research, Nov 4, 2025 (the paper)", href: SUNCATCHER_PAPER }, " · ", { text: "Starcloud-1", href: "https://www.starcloud.com/starcloud-1" }],
        "An explainer by @copilot_shogo. Not affiliated with Google.",
      ],
    },
  },
  {
    number: 47,
    slug: "47-krea-ad-studio",
    title: "Krea Ad Studio, tried on my real business",
    description:
      "I gave Krea's new Ad Studio one link: my Tokyo photo studio's site. What it built in 90 seconds, the four ads it made, what it missed, how to run it from Claude, and what it costs.",
    date: "2026-11-02",
    keyword: "ADS",
    tools: [
      {
        name: "Krea Ad Studio",
        what: "Type your domain and it builds a brand kit from your site, finds your products and prices, and makes ads with Krea 3.",
        href: "https://www.krea.ai/ad-studio",
        icon: "store",
        note: "On Krea's paid plans (from Basic). My free account showed a time-limited offer of 5 free ads.",
      },
      {
        name: "Krea MCP server",
        what: "Lets Claude use Ad Studio: research a brand, pick products and generate ads with the same brand kits.",
        href: "https://www.krea.ai/docs/developers/mcp",
        icon: "plug",
        install: ["claude mcp add --transport http krea-ai https://api.krea.ai/mcp"],
        note: "Sign in with your Krea account when prompted, then restart Claude Code.",
      },
    ],
    about: {
      intro: [
        "I tried it on Tetty's Photo Studio, the photo studio I run in Tokyo, on November 1, 2026. Everything below is from that run.",
      ],
      chapters: [
        {
          title: "One link in, a brand kit out",
          text: [
            "Open Ad Studio, type your domain and press Enter. It reads the site and builds a brand kit: the rulebook every ad follows. Krea lists logo, colors, fonts, a description, tone of voice, audience and selling points, plus your products with photos and prices.",
            "For my studio it took about a minute and a half. It got our colors, our prices, our three Tokyo locations and a fair description of who our customers are. It did not find our logo.",
          ],
          krea: "kit",
          bullets: [
            "Check the name and the logo first. Mine started as \"Tettyphotostudio\" and the logo slot stayed empty, so I'd upload the logo by hand.",
            "Shopify stores: Krea says it reads the product catalog directly.",
          ],
        },
        {
          title: "Pick products, get ads",
          text: [
            "Choose products and a size, and it makes a batch: one product per ad, each with its own layout and copy. Krea 3 keeps the product photo as it is. You can preview an ad in a Facebook, Instagram or Reels mockup and download one ad or the whole campaign as a ZIP.",
            "I asked for five 9:16 ads. Four came back in about 90 seconds; the fifth wasn't sent because of a concurrency limit.",
          ],
          krea: "ads",
        },
        {
          title: "Edit with the agent, then check",
          text: [
            "You can ask the Krea Agent for changes in plain words: a new headline, a darker background, another product, another size. I asked for a night scene and a shorter, more playful headline. It kept the same headline and barely changed the scene.",
          ],
          krea: "edit",
          bullets: ["Ask for one change per request, and compare before and after yourself."],
        },
        {
          title: "Run it from Claude",
          text: [
            "Ad Studio also works through Krea's MCP server. Connect it to Claude and you can ask Claude to research a brand, pick products and generate ads; it uses the same brand kits you see in Krea.",
            "In Claude Code it's one command. Sign in with your Krea account when the browser opens, then restart Claude Code. Usage is billed to the compute units of the workspace you pick at sign-in. Krea's docs also cover Codex and Cursor.",
          ],
          krea: "mcp",
          commands: ["claude mcp add --transport http krea-ai https://api.krea.ai/mcp"],
        },
        {
          title: "What it costs",
          text: [
            "Ad Studio is on every paid Krea plan, from Basic up. Brand research and product import are free; the ads themselves use your compute units. On the pricing page Basic shows $9 (or $5 a month billed yearly) with 5,000 units a month; the Free plan gives 100 units a day. When I tried it, my free account showed \"Your first 5 ads are free\" as a time-limited offer.",
          ],
          krea: "price",
        },
      ],
      notes: [
        "Prices and the free offer change. Check krea.ai/pricing and what your own account shows.",
        "The ads are for my own business and use photos from my own site. Use it only on brands and photos you have the rights to.",
        "A hands-on review by @copilot_shogo. Not affiliated with Krea or Anthropic.",
      ],
    },
  },
  {
    number: 46,
    slug: "46-jarvis",
    title: "Build your own Jarvis: a brain, a memory, a voice and a team",
    description:
      "The exact setup behind my personal AI assistant. Claude Code is the brain, an Obsidian vault is the memory, ElevenLabs Agents gives it a voice and a phone number, and three subagents do the work. Step by step, with the files to copy.",
    date: "2026-10-31",
    keyword: "JARVIS",
    tools: [
      {
        name: "Claude Code",
        what: "The brain. Claude in your terminal that can read and edit files, run commands and finish the task, not just answer.",
        href: "https://code.claude.com/docs/en/overview",
        icon: "wand",
        install: ["curl -fsSL https://claude.ai/install.sh | bash"],
        note: "Needs a paid Claude plan (Pro or Max) or an Anthropic Console (API) account. The free plan doesn't include it.",
      },
      {
        name: "Obsidian",
        what: "The memory. Free notes app that keeps every note as a plain Markdown file on your computer, so Claude Code can read them.",
        href: "https://obsidian.md",
        icon: "notebook",
      },
      {
        name: "ElevenLabs Agents",
        what: "The voice. A voice agent you can talk to in the browser, and call on a real number through its Twilio integration.",
        href: "https://elevenlabs.io/docs/agents-platform/overview",
        icon: "robot",
      },
    ],
    about: {
      intro: [
        "Four parts, and you can stop after any of them. The brain and the memory alone already give you most of the value.",
      ],
      chapters: [
        {
          title: "Meet it first",
          text: ["Tap the ring to hear it. This is the line it says when my morning brief is ready."],
          demo: "core",
        },
        {
          title: "The brain: Claude Code",
          text: [
            "Install Claude Code and sign in. Unlike a chat window, it works inside a folder on your computer: it opens files, runs code and checks its own work until the task is done.",
          ],
          demo: "run",
          commands: ["curl -fsSL https://claude.ai/install.sh | bash", "claude"],
        },
        {
          title: "The memory: your notes",
          demo: "vault",
          text: [
            "Keep your notes in an Obsidian vault (a normal folder of Markdown files) and start Claude Code inside that folder. It can now search and read everything you have written, so it never starts from zero.",
            "Then add a file called CLAUDE.md at the top of the vault. Claude Code reads it at the start of every session. Mine is the most important file in the whole setup. Start small:",
          ],
          code: [
            {
              label: "CLAUDE.md",
              body: [
                "# Who I am",
                "Name, what I do, what I'm working on this year.",
                "",
                "# Goals",
                "The one goal everything else is judged against.",
                "",
                "# How to work with me",
                "- Answer with the conclusion first.",
                "- Don't guess numbers. Say \"unknown\" instead.",
                "- Ask before sending, posting, deleting or spending money.",
                "",
                "# Where things live",
                "- Projects/  one note per project, current state only",
                "- Decisions/  one note per decision, with the reason",
              ].join("\n"),
            },
          ],
          bullets: [
            "Write down decisions with the reason. That is what makes the answers personal.",
            "When it gets something wrong, fix CLAUDE.md, not just the answer.",
          ],
        },
        {
          title: "The voice: ElevenLabs Agents",
          demo: "voice",
          text: [
            "This part is separate from Claude Code. In ElevenLabs, create an agent, pick a voice, pick the model it thinks with (Claude is one of the options), and write a short system prompt: who you are and how it should talk. You can talk to it in the browser right away.",
            "For a phone number, connect a Twilio number to the agent with ElevenLabs' native Twilio integration. Then you can call it, and it can call you.",
          ],
          bullets: [
            "Pick a voice from the library or design one. Don't clone a real person's voice without their permission.",
            "Anyone who can reach the agent can talk to it unless you turn on authentication (signed URLs) or an allowlist. Do this before you connect anything private.",
            "To give it facts (your calendar, your sales), add tools that call your own small read-only API. Keep secrets and customer data out.",
          ],
        },
        {
          title: "The team: subagents",
          demo: "team",
          text: [
            "Claude Code can hand work to subagents: each one is a Markdown file with its own role, rules and tools. Put them in ~/.claude/agents/ and they work from any folder. Mine are an analyst, a marketer and an engineer. I say what I want; Claude Code picks who does it.",
          ],
          code: [
            {
              label: "~/.claude/agents/analyst.md",
              body: [
                "---",
                "name: analyst",
                "description: Data analyst. Use for \"what changed\", \"is X working\" and any numbers question.",
                "tools: Read, Grep, Glob, Bash",
                "---",
                "",
                "You answer questions about my business numbers.",
                "- Start from the data, not from a guess. Say where each number came from.",
                "- Split averages by period to find the step changes.",
                "- Read-only: never change production data.",
              ].join("\n"),
            },
          ],
          bullets: [
            "One role per file. A narrow description is what makes Claude Code pick the right one.",
            "Give each role only the tools it needs. The engineer can edit code; the analyst can only read.",
          ],
        },
        {
          title: "Bonus: the 6:30 brief",
          demo: "brief",
          text: [
            "Every morning at 6:30 a scheduled job on my Mac (launchd) runs a small script that pulls the numbers I care about and saves a one-page brief, so it's ready before I wake up. It only runs on days the Mac is awake. Ask Claude Code to write the script and the schedule for you.",
          ],
        },
      ],
      notes: [
        "The phone agent and Claude Code are two separate parts. In my setup the phone agent can't read my notes directly yet.",
        "ElevenLabs and Twilio are paid: ElevenLabs bills by call minutes (LLM usage is billed separately), Twilio for the number each month and for call minutes. Check each pricing page.",
        "An overview by @copilot_shogo. Not affiliated with Anthropic, Obsidian or ElevenLabs.",
      ],
    },
  },
  {
    number: 45,
    slug: "45-apple-week",
    title: "Apple's week on one page: touch MacBook Pro, M6, OLED iPad mini, iMac, Creator Studio, Siri AI",
    description:
      "Six announcements in three days (Oct 26–28, 2026): the first Mac with a touchscreen, a 14-inch MacBook Pro with M6, an OLED iPad mini, iMac with M6, new tools in Final Cut Pro and Logic Pro, and Siri AI in Japanese and four more languages. Every price and date, from Apple's own announcements.",
    date: "2026-10-29",
    keyword: "MAC",
    tools: [],
    icon: "cpu",
    breakdown: {
      hero: {
        src: "/free/45/hero.jpg",
        video: "/free/45/hero.mp4",
        alt: "The new MacBook Pro seen from above in the dark, its OLED screen glowing with colourful artwork",
        caption: "From Apple's film for the MacBook Pro with PROLED XDR Display",
        wide: true,
      },
      tldr: [
        ["MacBook Pro gets an OLED touchscreen and the Dynamic Island. From $2,899, available Nov 6."],
        ["Don't need touch? The 14-inch MacBook Pro with the new M6 chip starts at $1,999."],
        ["iPad mini goes OLED: 8.5 inches in the same footprint, A20 Pro, IP67. From $699, Nov 6."],
        ["iMac gets M6 in the same seven colours, from $1,499. Final Cut Pro and Logic Pro get new tools, and Siri AI now speaks Japanese (beta)."],
      ],
      sections: [
        {
          title: "Macs",
          items: [
            {
              name: "MacBook Pro with PROLED XDR Display (14\" and 16\")",
              what: ["Touch for the first time on a Mac. A tandem OLED screen Apple calls PROLED XDR (each pixel makes its own light, so black is truly black), and the Dynamic Island on the Mac. M5 Pro or M5 Max."],
              whoLabel: "Price & availability (U.S.)",
              who: ["From $2,899 (14-inch) and $3,399 (16-inch). Pre-order Oct 28, available Nov 6."],
              more: { label: "Reported", text: ["Outlets report that the Apple logo on the lid glows again. Apple's announcement doesn't mention it."] },
              media: [
                { src: "/free/45/touch.jpg", video: "/free/45/touch.mp4", alt: "A finger drags a 3D model directly on the MacBook Pro screen", caption: "Touch on a Mac (Apple's film)" },
                { src: "/free/45/island.jpg", alt: "The Dynamic Island at the top of the Mac screen, showing a song with play controls", caption: "The Dynamic Island on the Mac (Apple)" },
                { src: "/free/45/logo.jpg", alt: "The Apple logo on the closed lid, lit up in the dark", caption: "The lit logo, in Apple's own film" },
              ],
              demo: "oled",
            },
            {
              name: "14-inch MacBook Pro with M6",
              what: ["The new M6 chip in the 14-inch. Same Liquid Retina XDR (mini-LED) screen: no touch, no OLED. Up to 24 hours of battery."],
              whoLabel: "Price & availability (U.S.)",
              who: ["From $1,999 ($1,899 education). Pre-order Oct 28, available Nov 6."],
              media: [{ src: "/free/45/m6.jpg", video: "/free/45/m6.mp4", alt: "The 14-inch MacBook Pro opening behind a large M6", caption: "From Apple's video" }],
            },
            {
              name: "iMac with M6",
              what: ["M6 in the same 24-inch 4.5K design, in seven colours. Apple says up to 5x faster on-device AI than M4."],
              whoLabel: "Price & availability (U.S.)",
              who: ["From $1,499 with a 10-core CPU and GPU ($1,449 education). Pre-order Oct 28, available Nov 6."],
              media: [{ src: "/free/45/imac.jpg", video: "/free/45/imac.mp4", alt: "The iMac turning to show its seven colours side by side", caption: "The seven colours (Apple's video)" }],
            },
          ],
        },
        {
          title: "iPad",
          items: [
            {
              name: "iPad mini",
              what: ["Apple's biggest iPad mini update: an 8.5-inch OLED screen in the same footprint, A20 Pro, IP67 water and dust resistance, 5.4 mm thin. Ships with iPadOS 27 and Siri AI."],
              whoLabel: "Price & availability (U.S.)",
              who: ["From $699 (Wi-Fi), $849 (Wi-Fi + Cellular). Pre-order Oct 28, available Nov 6."],
              media: [{ src: "/free/45/ipadmini.jpg", video: "/free/45/ipadmini.mp4", alt: "A hand turns the thin iPad mini to show its OLED screen", caption: "5.4 mm thin (Apple's video)" }],
            },
          ],
        },
        {
          title: "Software",
          unit: { one: "update", many: "updates" },
          items: [
            {
              name: "Apple Creator Studio",
              what: ["Final Cut Pro for Mac now includes MotionVFX built in. Logic Pro gets a new intelligent assistant (beta)."],
              whoLabel: "Price & availability",
              who: ["A free update for existing subscribers this November. New: $12.99/month or $129/year."],
              media: [
                { src: "/free/45/fcp.jpg", alt: "Final Cut Pro on a MacBook Pro with a MotionVFX title on the video", caption: "MotionVFX in Final Cut Pro (Apple)" },
                { src: "/free/45/logic.jpg", alt: "Logic Pro with the new assistant panel open on the right", caption: "The assistant in Logic Pro (Apple)" },
              ],
            },
            {
              name: "Siri AI in more languages",
              what: ["Siri AI (beta) now works in Japanese, French, Korean, Portuguese and Spanish, with the 27.2 updates."],
              whoLabel: "Availability",
              who: ["Free, in beta, with daily limits on some features. Apple says expanded access will cost a fee in the future. Not in the EU on iOS, iPadOS or watchOS."],
              media: [{ src: "/free/45/siri.jpg", alt: "Two iPad minis, one showing Siri AI answering a question over an article", caption: "Siri AI on the new iPad mini (Apple)" }],
            },
          ],
        },
      ],
      notes: ["Prices and dates are U.S., from Apple's announcements of Oct 26–28, 2026, as of Oct 29."],
      sources: [
        { text: "Apple: MacBook Pro with PROLED XDR Display", href: "https://www.apple.com/newsroom/2026/10/apple-unveils-groundbreaking-macbook-pro-with-proled-xdr-display/" },
        { text: "Apple: 14-inch MacBook Pro with M6", href: "https://www.apple.com/newsroom/2026/10/apple-introduces-the-new-14-inch-macbook-pro-with-m6/" },
        { text: "Apple: iMac with M6", href: "https://www.apple.com/newsroom/2026/10/apple-unveils-new-imac-with-m6/" },
        { text: "Apple: iPad mini", href: "https://www.apple.com/newsroom/2026/10/apple-gives-ipad-mini-its-biggest-update-ever/" },
        { text: "Apple: Apple Creator Studio update", href: "https://www.apple.com/newsroom/2026/10/apple-creator-studio-adds-powerful-new-ai-features-and-even-more-creative-tools/" },
        { text: "Apple: Siri AI in more languages", href: "https://www.apple.com/newsroom/2026/10/siri-ai-is-available-in-more-languages-starting-today/" },
        { text: "MacRumors (the glowing logo report)", note: "secondary" },
      ],
    },
  },
  {
    number: 44,
    slug: "44-downloads-guard",
    title: "Downloads guard: 3 checks to run tonight (+3 more) so a file a website drops can't steer your coding agent",
    description:
      "A web page can save a Markdown file into ~/Downloads. If you start Claude Code or Codex there, the agent reads it as instructions. Here's how to close that gap: what to check, why, and the exact settings and commands.",
    date: "2026-10-28",
    keyword: "GUARD",
    tools: [],
    icon: "shield",
    about: {
      intro: [
        "On Oct 22, 2026, ",
        { text: "Forever Security", href: "https://forever.security/blog/hijacking-ai-agents-via-downloads-folder" },
        " reported live malware on a real customer's machine: an AGENTS.md in the Downloads folder had turned the customer's own coding agent against them. In their tests Codex followed a planted file in more than 90% of attempts, and Claude Code about 50% (Claude needs a human to approve the settings change). They also found that about half of their customers run a coding agent inside Downloads. Their view: there is nothing for OpenAI or Anthropic to patch, so the fix is on your side.",
      ],
      checks: [
        {
          title: "Never start an agent in Downloads, or in any folder inside it",
          why: [
            "Claude Code reads CLAUDE.md files from the folder you start in ",
            { text: "and every folder above it", href: "https://code.claude.com/docs/en/memory" },
            ". So a project folder that lives inside Downloads still loads a CLAUDE.md sitting in Downloads itself. Since v2.1.277 it also reads AGENTS.md when no CLAUDE.md is found. Forever's own advice: don't start Codex, Claude Code or any agent in Downloads.",
          ],
          how: [
            "Move projects out of Downloads (for example to ~/code). Then check Downloads for instruction files you didn't put there. No output means none were found. If something turns up, open it in a text editor and read it before you run any agent nearby.",
          ],
          commands: ["find -E ~/Downloads -maxdepth 2 -iregex '.*/(agents|claude)(\\.local)?\\.md'"],
        },
        {
          title: "Say no to settings changes you didn't ask for",
          why: [
            "In Forever's Claude Code test, the planted file asked Claude to write a ",
            { code: ".claude/settings.json" },
            " that sent its API traffic to another server, which exposes your login token. Writes to ",
            { code: ".claude" },
            " are ",
            { text: "protected paths", href: "https://code.claude.com/docs/en/permission-modes" },
            ": Claude Code asks you first in the default and acceptEdits modes, auto mode sends them to its classifier, and bypassPermissions allows them silently.",
          ],
          how: [
            "If Claude asks to edit its own settings and you didn't ask for that, choose No. Be most suspicious of an ",
            { code: "ANTHROPIC_BASE_URL" },
            " or proxy setting you didn't add. To make Claude always ask, even in auto mode, add an ask rule (explicit ask rules are never auto-approved) to ",
            { code: "~/.claude/settings.json" },
            ".",
          ],
          commands: ['"permissions": { "ask": ["Edit(**/.claude/settings.json)", "Edit(**/.claude/settings.local.json)", "Edit(**/.mcp.json)"] }'],
        },
        {
          title: "Turn on the sandbox and switch off its escape hatch",
          why: [
            "The ",
            { text: "sandbox", href: "https://code.claude.com/docs/en/sandboxing" },
            " is off by default. When a command fails inside it, Claude can retry it outside with ",
            { code: "dangerouslyDisableSandbox" },
            ". With ",
            { code: "allowUnsandboxedCommands" },
            " set to false, Claude Code ignores that parameter. ",
            { code: "failIfUnavailable" },
            " stops Claude Code from quietly running without the sandbox when it can't start.",
          ],
          how: [
            "Run /sandbox once inside Claude Code, or add this to ~/.claude/settings.json. macOS needs nothing extra. Linux and WSL2 need bubblewrap and socat. Native Windows has no sandbox; use WSL2.",
          ],
          commands: ['"sandbox": { "enabled": true, "allowUnsandboxedCommands": false, "failIfUnavailable": true }', "sudo apt-get install bubblewrap socat"],
        },
        {
          title: "Tell Claude Code to skip instruction files in Downloads",
          why: [
            { code: "claudeMdExcludes" },
            " skips CLAUDE.md files that match a path pattern (",
            { text: "docs", href: "https://code.claude.com/docs/en/memory" },
            "). Put it in your user settings so it applies to every project. A belt to go with the braces above, not a replacement for them.",
          ],
          how: [
            "Add this to ",
            { code: "~/.claude/settings.json" },
            ". Patterns match absolute paths with glob syntax. The docs describe this setting for CLAUDE.md files; whether it also skips AGENTS.md isn't clearly stated, so don't rely on it for that. It does nothing for Codex.",
          ],
          commands: ['"claudeMdExcludes": ["**/Downloads/CLAUDE.md", "**/Downloads/CLAUDE.local.md", "**/Downloads/.claude/CLAUDE.md", "**/Downloads/AGENTS.md"]'],
        },
        {
          title: "Turn off bypass mode for yourself",
          why: [
            "bypassPermissions skips the prompts that would have stopped the settings change. ",
            { code: "disableBypassPermissionsMode" },
            " works from any settings file, so you can ",
            { text: "lock yourself out of it", href: "https://code.claude.com/docs/en/permissions" },
            ". For Codex, don't run it with ",
            { code: "--dangerously-bypass-approvals-and-sandbox" },
            ": in Forever's test the planted file got Codex to start a second copy of itself with that flag.",
          ],
          how: ["Add this to ~/.claude/settings.json."],
          commands: ['"permissions": { "disableBypassPermissionsMode": "disable" }'],
        },
        {
          title: "Check what your agents already have",
          why: [
            "If a planted file already ran, it may have left changes behind. Forever's detection tips: a project ",
            { code: ".claude/settings.json" },
            " with an ",
            { code: "ANTHROPIC_BASE_URL" },
            " or proxy you didn't set; in ",
            { code: "~/.codex/config.toml" },
            ", an unexpected ",
            { code: "[mcp_servers.*]" },
            " block or a changed ",
            { code: "chatgpt_base_url" },
            "; and the npm package ",
            { code: "function-color" },
            " in your installs.",
          ],
          how: [
            "The first command lists Claude settings files under your home folder that set an API endpoint or proxy (no output = none). The second shows the Codex lines worth reading. In Codex, ",
            { text: "untrusted projects", href: "https://learn.chatgpt.com/docs/config-file/config-reference" },
            " skip project-scoped .codex/ config, so keep Downloads off your trusted list. If anything looks wrong, rotate your logins and tokens from a clean device; a stolen token is a live session.",
          ],
          commands: [
            "find ~ -maxdepth 6 -path \"*/.claude/settings*.json\" -not -path \"*/node_modules/*\" -exec grep -l -E \"ANTHROPIC_BASE_URL|HTTPS?_PROXY\" {} + 2>/dev/null",
            "grep -n -E \"mcp_servers|base_url|trust_level|approval_policy|sandbox_mode\" ~/.codex/config.toml",
          ],
        },
      ],
      runAll: {
        title: "Bonus: make your browser ask first",
        items: [
          {
            text: [
              "The attack starts with a file saved to Downloads without a click. In Chrome: Settings → Downloads → turn on ",
              { text: "\"Ask where to save each file before downloading\"", href: "https://support.google.com/chrome/answer/95759" },
              ". A surprise save dialog is your warning.",
            ],
          },
        ],
      },
      notes: [
        "This is a defensive checklist, not a security audit. It covers the gap Forever Security described; it doesn't make your machine safe from everything.",
        "Merge the settings snippets into one ~/.claude/settings.json (keys like \"permissions\" combine). Run /status in Claude Code afterwards to confirm the file loaded.",
        "Facts as of Oct 28, 2026, from the Forever Security post and the Claude Code, Codex and Chrome docs linked above. An overview by @copilot_shogo; not affiliated with Anthropic, OpenAI, Google or Forever Security.",
      ],
    },
  },
  {
    number: 43,
    slug: "43-keyboard-ears",
    title: "Keyboard ears: build an AI that hears which key you pressed",
    description:
      "A 2023 UK study trained an AI to recognise keystrokes from their sound: 95% of keys right from a phone next to the laptop, 93% over Zoom. Here's how it works, and a step-by-step build you can run on your own keyboard in about an hour.",
    date: "2026-10-27",
    keyword: "KEYBOARD",
    tools: [
      {
        name: "The study (arXiv 2308.01074)",
        what: "A Practical Deep Learning-Based Acoustic Side Channel Attack on Keyboards — Harrison, Toreini, Mehrnezhad (Durham, Surrey, Royal Holloway).",
        href: "https://arxiv.org/abs/2308.01074",
        icon: "shield",
      },
    ],
    breakdown: {
      tldr: [
        ["Every key sits in a different spot, so each one sounds a little different when you press it."],
        ["Turn one press into a picture of its sound (a spectrogram) and an ordinary image AI can learn which picture is which key."],
        ["In the study: 95% of keys right recorded by a phone next to the laptop, 93% recorded over Zoom."],
        ["The catch: it was trained on keystrokes from the same kind of laptop. Other keyboards weren't tested."],
      ],
      sections: [
        {
          title: "What the study did",
          unit: { one: "detail", many: "details" },
          items: [
            { name: "Data", what: ["36 keys on a MacBook Pro, each pressed 25 times, recorded by an iPhone 13 mini 17 cm away, and again over Zoom."] },
            { name: "Pictures", what: ["Each press was cut out and turned into a mel-spectrogram: time left to right, pitch bottom to top, louder = brighter."] },
            { name: "Model", what: ["An image classifier (CoAtNet) learned to match each picture to its key. Accuracy is per keystroke: did its first guess name the right key."] },
            { name: "What it didn't do", what: ["It classified single key presses. Recovering a whole password from a stream of typing wasn't part of the experiment."] },
          ],
        },
        {
          title: "How to protect yourself",
          unit: { one: "tip", many: "tips" },
          items: [
            { name: "Mute when you type a password on a call", what: ["The Zoom result came from the call's own audio."] },
            { name: "Let a password manager or biometrics fill it in", what: ["No typing, no keystroke sound."] },
            { name: "Use long random passwords", what: ["The study suggests mixed case is harder to recover: no one has shown how to hear when Shift is released."] },
          ],
        },
      ],
      notes: ["Build this only on your own keyboard, with your own recordings. Recording other people's typing without consent is illegal in many places."],
      sources: [
        { text: "arXiv 2308.01074 (paper)", href: "https://arxiv.org/abs/2308.01074" },
        { text: "Royal Holloway press release (Aug 2023)", href: "https://www.royalholloway.ac.uk/about-us/news/study-suggests-ai-can-detect-your-password-from-the-sound-of-keys-being-pressed/" },
      ],
    },
    about: {
      intro: ["A small version of the study you can run on a laptop: record your own keys, turn each press into a picture, train a model, test it. About an hour."],
      chapters: [
        {
          title: "What the AI actually sees",
          text: ["Stills from the reel. Every picture is computed from real laptop keystroke recordings, not drawn by hand."],
          figures: [
            { src: "/free/43/wave.jpg", alt: "One key press recorded as a sound wave, cut into tiny slices", caption: "One click, cut into slices" },
            { src: "/free/43/spectrogram.jpg", alt: "The slices lined up into a spectrogram: time left to right, pitch bottom to top, brighter is louder", caption: "The click as a picture (spectrogram)" },
            { src: "/free/43/stripes.jpg", alt: "E's and R's spectrograms averaged into stripes: E is brightest in the high bands, R in the low ones", caption: "E and R leave different stripes" },
            { src: "/free/43/model.jpg", alt: "25 pictures per key feed an image model that names the key", caption: "25 pictures per key → an image model" },
          ],
        },
        {
          title: "1. Record your own keyboard",
          bullets: [
            "Pick a few keys to start (for example e, r, t, a, s).",
            "Put your phone or a mic about 15–20 cm from the keyboard in a quiet room.",
            "For each key, record one file and press that key about 25 times, half a second apart. Save it as the key's name: e.wav, r.wav, …",
            "Put the files in one folder called recordings/.",
          ],
        },
        {
          title: "2. Install",
          commands: ["pip install numpy librosa scikit-learn"],
        },
        {
          title: "3. Run the build",
          text: [
            "The script cuts out every press by its energy, keeps 0.33 s of each (the length the study used), turns it into a 64×64 mel-spectrogram, trains a classifier on 80% of the presses and tests it on the other 20%.",
          ],
          commands: ["python keyboard_ears.py recordings/"],
          code: [{ label: "keyboard_ears.py", body: KEYBOARD_EARS_PY }],
        },
        {
          title: "4. Read the result",
          bullets: [
            "It prints how many presses it found per key. If a number is far from 25, press more slowly or move the mic closer.",
            "Then the accuracy on presses it never saw, and a confusion table: rows are the true key, columns its guess.",
            "Keys next to each other are the easiest to confuse. Add more presses per key before adding more keys.",
          ],
        },
        {
          title: "5. Go further: the study's image model",
          text: [
            "The study trained an image model (CoAtNet) on the pictures instead of a linear classifier. With PyTorch and the timm library you can do the same on the 64×64 pictures from step 3; it needs a GPU to train in reasonable time. We haven't run this part ourselves, so treat it as a starting point.",
          ],
          commands: ["pip install torch timm"],
        },
      ],
      notes: [
        "The script was run end to end on test recordings before publishing. Your accuracy depends on your keyboard, mic and room.",
        "By @copilot_shogo. Not affiliated with the study's authors or their universities.",
      ],
    },
  },
  {
    number: 42,
    slug: "42-dessa",
    title: "Dessa: Block's voice AI that acts human",
    description:
      "Jack Dorsey's company Block showed Dessa on Oct 23, 2026: a speech-to-speech model trained only on human conversation. It laughs, pauses, says \"yeah\" while you talk, and can jump in before you finish. What it does, what it can't do yet, and the waitlist.",
    date: "2026-10-27",
    keyword: "DESSA",
    tools: [
      {
        name: "Dessa waitlist",
        what: "Block's official page for Dessa, with the waitlist. Not open to the public yet.",
        href: "https://block.xyz/dessa",
        icon: "robot",
      },
    ],
    breakdown: {
      tldr: [
        ["Dessa is a voice AI from a small research lab at Block, the company behind Square and Cash App. The lab reports to Jack Dorsey."],
        ["Most voice AI turns your speech into text, thinks in text, then reads the answer back. Dessa never uses text. It was trained from scratch on human conversation."],
        ["That's why it laughs, pauses and talks over you the way people do. It's full-duplex: it listens while it talks."],
        ["You can't use it yet. It's waitlist only."],
      ],
      sections: [
        {
          title: "What it does",
          unit: { one: "thing", many: "things" },
          items: [
            { name: "Speech in, speech out", what: ["A speech-to-speech model trained \"from scratch on nothing but human conversation.\" No text, no pretrained models."] },
            { name: "Listens while it talks", what: ["Full-duplex, so it can say \"yeah\" while you're still talking, or finish your sentence before you do. In Block's film it says \"Rises?\" before the person gets to it."] },
            { name: "Makes up its own voice", what: ["In Block's demos, each conversation starts with a voice and a character Dessa makes up on the spot."] },
          ],
        },
        {
          title: "How it was built",
          unit: { one: "detail", many: "details" },
          items: [
            { name: "Training", what: ["Block says it trained Dessa on one NVIDIA GB200 NVL72 (a single rack)."] },
            { name: "Runs locally", what: ["Block says it runs locally on a MacBook Pro M4 Max or better."] },
            { name: "The team", what: ["The lab was founded by former members of Dessa, the Toronto deep-learning startup Square bought in 2020. That startup made the fake Joe Rogan voice in 2019. Square renamed itself Block in 2021."] },
          ],
        },
        {
          title: "What to watch",
          unit: { one: "point", many: "points" },
          items: [
            {
              name: "Not open yet",
              what: ["Only a small group of AI safety researchers has early access. Everyone else joins the waitlist."],
              whyLabel: "What to do",
              why: ["Join the waitlist on the official page below."],
            },
            {
              name: "Not very smart yet",
              what: ["Block's own team says in the launch film that it's \"not very intelligent\" at the moment. It's built to sound and act human, not to answer hard questions."],
            },
          ],
        },
      ],
      notes: ["Availability is as of Oct 27, 2026 and may change."],
      sources: [
        { text: "Block: Dessa (official page and waitlist)", href: "https://block.xyz/dessa" },
        { text: "Jack Dorsey on X", href: "https://x.com/jack/status/2113697902916751661" },
        { text: "Ragavan Thurairatnam on X (launch post)", href: "https://x.com/RagavanThurair/status/2113671324400861645" },
        { text: "VentureBeat: Square acquires Dessa (2020)", href: "https://venturebeat.com/ai/square-acquires-deepfakes-research-firm-dessa-labs-for-an-undisclosed-sum" },
        { text: "The Register: the fake Joe Rogan voice (2019)", href: "https://www.theregister.com/2019/05/17/joe_rogan_ai/" },
      ],
    },
  },
  {
    number: 41,
    slug: "41-sao-paulo",
    title: "São Paulo: Apple's liquid glass, rebuilt in code",
    description:
      "A lyric video for The Weeknd and Anitta's São Paulo, made with Claude Opus 5.5 in Claude Code: real-looking iPhone screens, a liquid-glass Control Center, and colour that drifts from scene to scene instead of cutting. No After Effects. Here are the screens and how it was made. The full method is coming soon.",
    date: "2026-10-26",
    keyword: "GLASS",
    tools: [
      {
        name: "Claude Code",
        what: "Where Claude Opus 5.5 wrote every screen, word and transition.",
        href: "https://claude.com/claude-code",
        icon: "wand",
      },
      {
        name: "Remotion",
        what: "React for video: every frame is rendered from code. Free for individuals and companies up to 3 people; larger companies need a license.",
        href: "https://www.remotion.dev",
        icon: "cube",
      },
    ],
    about: {
      intro: [
        "20 s · 9:16 · 60 fps. Every frame rendered by code: no After Effects, no timeline, no AI video generation. 26 versions until it flowed.",
      ],
      chapters: [
        {
          title: "The screens",
          text: ["Each lyric lands inside a real-looking iPhone screen, and the colour flows from one to the next. Stills from the finished video:"],
          figures: [
            { src: "/free/41/card.jpg", alt: "Apple Music mini player card", caption: "Now Playing", tall: true },
            { src: "/free/41/store.jpg", alt: "App Store search rows", caption: "App Store", tall: true },
            { src: "/free/41/starboy.jpg", alt: "Search field and glass tab bar", caption: "Search", tall: true },
            { src: "/free/41/player.jpg", alt: "Apple Music player", caption: "Player", tall: true },
            { src: "/free/41/grid.jpg", alt: "Album grid", caption: "Library", tall: true },
            { src: "/free/41/idol.jpg", alt: "The Idol player on a blue wallpaper", caption: "The Idol", tall: true },
            { src: "/free/41/cc.jpg", alt: "Liquid-glass Control Center", caption: "Control Center", tall: true },
            { src: "/free/41/list.jpg", alt: "Song list", caption: "Song list", tall: true },
            { src: "/free/41/page.jpg", alt: "Single page opening inside the list", caption: "Single page", tall: true },
            { src: "/free/41/lyrics.jpg", alt: "Lyrics view", caption: "Lyrics", tall: true },
          ],
        },
        {
          title: "How it was made",
          text: ["The short version, in the order it was built:"],
          bullets: [
            "It's a Remotion project. Every screen is a React component, rendered at 60 fps. Claude Opus 5.5 wrote all of it in Claude Code.",
            "The lyrics come first. Every word gets a start time from the song, and every element on screen is tied to a word: a row types in, a tile lights up, a slider fills as that word is sung.",
            "No hard cuts. Instead of sliding the next screen in, the background colour drifts into the next scene while the content moves out, so the song carries the change.",
            "Liquid glass is plain CSS: an almost clear fill, a backdrop blur with a little extra brightness, and a thin rim that only shines where light would hit.",
            "The Control Center doesn't arrive in one piece. Its rows come in slightly apart and settle together, the lower ones a beat later, the way iOS does it.",
            "Each version is checked by measurement, not by eye. It's rendered, cut into frame grids, and scored by a fresh AI reviewer that has never seen the earlier versions. Scroll speed and brightness are plotted as curves to find where the motion stutters.",
            "26 versions. The last one scored 83 to 84 out of 100 from two independent reviewers.",
          ],
        },
        {
          title: "Want to make your own?",
          text: [
            "I'm putting the full method together (the prompts, the beat sheet and the source) and plan to sell it soon. Follow @copilot_shogo on Instagram to see when it's out.",
          ],
        },
      ],
      notes: [
        "A fan edit for portfolio purposes. The song, album art and photos belong to their owners. Not affiliated with The Weeknd, Anitta, Apple or any app shown.",
        "By @copilot_shogo. Not affiliated with Remotion or Anthropic.",
      ],
    },
  },
  {
    number: 39,
    slug: "39-claude-duet",
    title: "Claude Duet: Claude now messages you first",
    description:
      "Anthropic opened a research preview of Claude Duet on Oct 21, 2026: a proactive agent app that sends you a morning brief from your connected apps, pings you only when something needs you, keeps working in its own cloud computer, and waits for your OK before it sends, pays, signs or deletes anything. What it does, who can join, and what to watch.",
    date: "2026-10-24",
    keyword: "DUET",
    tools: [
      {
        name: "Claude Duet",
        what: "The official page with the waitlist (research preview, Pro and Max plans in the US).",
        href: "https://claude.com/product/claude-duet",
        icon: "robot",
      },
    ],
    breakdown: {
      tldr: [
        ["OpenAI has dots, Meta has Muse, xAI has Grok Bot. Claude Duet is Anthropic's own always-on agent."],
        ["Every morning it sends a short brief from your connected apps, then only messages you when something needs your attention."],
        ["It runs on its own virtual machine with a browser, so work keeps going after you close your laptop."],
        ["Before it sends a message, makes a payment, signs a document or deletes anything, it shows you exactly what it will do and waits for your OK."],
      ],
      sections: [
        {
          title: "What it does",
          unit: { one: "thing", many: "things" },
          items: [
            { name: "Morning brief", what: ["A short brief on the most important items across your connected apps (email, chat, your store and more)."] },
            { name: "Pings only when needed", what: ["Throughout the day it keeps tabs on those apps and messages you only when something needs you. One tester's client call fell right before her flight; Duet noticed and offered to move it."] },
            { name: "Bigger jobs", what: ["You can hand it work like building a dashboard, a financial or sales forecast, or preparing and running payroll in Gusto."] },
            { name: "Its own computer", what: ["A virtual machine with its own browser, so it doesn't need your laptop or phone to be on."] },
          ],
        },
        {
          title: "Who can join",
          unit: { one: "detail", many: "details" },
          items: [
            { name: "Access", what: ["Research preview through a waitlist, on Pro and Max plans in the US."] },
            { name: "Model", what: ["Designed around Claude Opus 5.5."] },
          ],
        },
        {
          title: "What to watch",
          unit: { one: "point", many: "points" },
          items: [
            {
              name: "Approval before actions",
              what: ["Sending, paying, signing and deleting always come back to you first. Anthropic says Duet never directly sees your passwords or sign-in tokens."],
              whyLabel: "What to do",
              why: ["Connect only the apps you want it to watch, and read each approval card before you tap OK."],
            },
            {
              name: "It's a preview",
              what: ["As a research preview it can still misjudge what's urgent, and background checks use your plan's limits."],
            },
          ],
        },
      ],
      notes: ["Availability is as of Oct 24, 2026 and will change as the preview opens up."],
      sources: [
        { text: "Claude Duet product page", href: "https://claude.com/product/claude-duet" },
        { text: "Anthropic: Introducing Claude Duet (video)", href: "https://www.youtube.com/watch?v=Fb-68zqcSVs" },
        { text: "Claude on X (launch post)", href: "https://x.com/claudeai/status/2112984664256241837" },
      ],
    },
    about: {
      chapters: [
        {
          title: "What it looks like",
          text: ["Two moments from Anthropic's own launch video."],
          figures: [
            { src: "/free/39/brief.jpg", alt: "Claude Duet's morning brief on a phone: Morning, Nicole! For today: Health permit. Hiring decisions. Northfield renewal.", caption: "The morning brief (Anthropic's video)", tall: true },
            { src: "/free/39/approve.jpg", alt: "An email drafted by Claude Duet with Not now and Send buttons", caption: "It waits for your OK (Anthropic's video)", tall: true },
          ],
        },
      ],
      notes: ["An overview by @copilot_shogo. Not affiliated with Anthropic."],
    },
  },
  {
    number: 37,
    slug: "37-1password-for-agents",
    title: "1Password for Agents: your AI agent can log in without seeing your password",
    description:
      "1Password launched 1Password for Agents on Oct 22, 2026. When an AI agent reaches a sign-in page, it asks your vault; you approve in the 1Password app; 1Password fills the login into the site itself, and the agent only learns that access was granted. How it works, who can use it today, and the one catch.",
    date: "2026-10-23",
    keyword: "AGENT",
    tools: [
      {
        name: "1Password for Agents",
        what: "The official page with the waitlist. Rolling out first with Muse (from Meta) and Grok Bot; more agents are coming soon.",
        href: "https://1password.com/personal-ai-agent-integrations",
        icon: "shield",
      },
    ],
    breakdown: {
      tldr: [
        ["When your AI agent hits a login, it asks your 1Password vault instead of you handing it the password."],
        ["You approve in the 1Password app. 1Password fills the login into the site; the agent never sees the password or the one-time code."],
        ["Nothing touches your vault until you connect an agent. No extra cost on paid Individual and Family plans."],
        ["Live first with Muse and Grok Bot (rolling out over the coming days). Claude, ChatGPT and Perplexity are coming soon."],
      ],
      sections: [
        {
          title: "How it works",
          unit: { one: "step", many: "steps" },
          items: [
            { name: "1. The agent asks", what: ["At a sign-in page, the agent verifies itself to 1Password and requests the login for that site."] },
            { name: "2. You decide", what: ["You see which login is requested and approve or deny it in the 1Password app on your own device."] },
            { name: "3. 1Password fills it", what: ["1Password fills the username, password and one-time code into the site. The agent only sees that access was granted."] },
          ],
        },
        {
          title: "Who can use it today",
          unit: { one: "detail", many: "details" },
          items: [
            { name: "Plans", what: ["Included at no additional cost in 1Password Individual and Family accounts (both paid plans; there's a 14-day free trial)."] },
            { name: "Agents", what: ["Muse (from Meta) and Grok Bot are rolling out now. Coming soon: Anthropic's Claude (Claude Duet), OpenAI's ChatGPT Work and dots, Perplexity, and others. There is a waitlist."] },
            { name: "Approval", what: ["1Password's developer docs list approval in the desktop apps (Mac, Windows, Linux); phone approval is in development. You approve once per login, not on every fill."] },
            { name: "Not yet", what: ["Business accounts, shared vaults, passkey-only logins, and 1Password.eu / 1Password.ca accounts."] },
          ],
        },
        {
          title: "The catch",
          unit: { one: "point", many: "points" },
          items: [
            {
              name: "Logged in is logged in",
              what: ["The agent never holds your password, but once it's signed in it works inside that account. In 1Password's words: \"An agent may be able to see information or take actions within the signed-in account.\""],
              whyLabel: "What to do",
              why: ["Only connect accounts you'd trust the agent with, and remove a login from the agent when you no longer need it."],
            },
          ],
        },
      ],
      notes: [
        "Availability and the list of agents are as of Oct 23, 2026 and will change as more integrations ship.",
        "How often you're asked to approve may vary by integration.",
      ],
      sources: [
        { text: "1Password: AI agent integrations (waitlist)", href: "https://1password.com/personal-ai-agent-integrations" },
        { text: "1Password blog: Introducing 1Password for Agents", href: "https://1password.com/blog/1password-for-ai-agents" },
        { text: "1Password: personal agents FAQ", href: "https://1password.com/personal-agents" },
        { text: "1Password developer docs: approval", href: "https://www.1password.dev/agentic-autofill/partners/approval" },
        { text: "1Password on X (launch post)", href: "https://x.com/1Password/status/2113276767582498943" },
        { text: "9to5Google", href: "https://9to5google.com/2026/10/22/1password-will-let-ai-agents-use-your-passwords-without-seeing-them/", note: "reporting" },
      ],
    },
    about: {
      chapters: [
        {
          title: "What it looks like",
          text: ["Step 2 from 1Password's own demo, and what the agent ends up with."],
          figures: [
            { src: "/free/37/approve.jpg", alt: "1Password's demo: Allow Muse to log in on your behalf, with Authorize and Deny", caption: "You decide (1Password's demo)" },
            { src: "/free/37/fill.jpg", alt: "The vault fills the site's password; the agent only gets access granted", caption: "The agent gets access, not the password" },
          ],
        },
      ],
      notes: ["An overview by @copilot_shogo. Not affiliated with 1Password."],
    },
  },
  {
    number: 36,
    slug: "36-reel-machine",
    title: "How my Mac edits our photo studio's reels every night",
    description:
      "We run a photo studio in Tokyo. Every night at midnight, a Mac turns the day's raw shoot clips into ten finished reels and schedules the best three to TikTok. Nobody edits them. Here is how the loop works, step by step, with a diagram, so you can build your own.",
    date: "2026-10-21",
    keyword: "REEL",
    tools: [
      {
        name: "Claude Code",
        what: "Scores one frame of each new clip (does it look like Tokyo? is the client smiling? can you see the camera?) and writes new hook lines when the list runs low. Called from the script in headless mode.",
        href: "https://claude.com/claude-code",
        icon: "wand",
      },
      {
        name: "FFmpeg",
        what: "Free. Measures the brightness of every frame to find the flash, cuts the clips, and builds the 10-second reel in one pass.",
        href: "https://ffmpeg.org",
        icon: "scissors",
      },
      {
        name: "Blotato",
        what: "Schedules the finished reels to TikTok through its API. The Starter plan is $29 a month.",
        href: "https://www.blotato.com",
        icon: "event",
      },
    ],
    about: {
      intro: [
        "One reel it made got about 100,000 views on TikTok. No human touched the edit. This page is an overview of the loop, not our code.",
      ],
      chapters: [
        {
          title: "The whole loop",
          text: ["Raw clips and finished photos go into one shared folder. A scheduled job on a Mac runs this every night at midnight:"],
          figures: [{ src: "/free/36/loop.png", alt: "Diagram: find the flash, score one frame, pick with weights, cut on my timing; every night at midnight, top 3 to TikTok", caption: "The loop" }],
        },
        {
          title: "1. Find the flash",
          text: [
            "Our photographers shoot behind-the-scenes clips while they fire a flash. FFmpeg measures the average brightness of every frame. When one frame is suddenly much brighter than the frames around it, that is the flash: the moment the photo was taken.",
            "The script cuts a short window around that spike (about a second and a half), with the flash a little past the middle, so every clip lands on the click of the shutter.",
          ],
          figures: [{ src: "/free/36/flash.jpg", alt: "Brightness of every frame with the flash spike marked", caption: "The real brightness of one clip", tall: true }],
        },
        {
          title: "2. Let Claude score one frame",
          text: [
            "A picture of each new clip goes to Claude with three questions, each scored 0 to 10: does the background look like Tokyo, is the client clearly visible and smiling, and can you see the photographer, camera or flash. The scores are saved, so each clip is only scored once.",
          ],
          figures: [{ src: "/free/36/scores.jpg", alt: "One frame with three boxes and the scores 9, 8, 9", caption: "One clip: 9 · 8 · 9", tall: true }],
        },
        {
          title: "3. Pick with weights, not at random",
          bullets: [
            "Clips with a flash and higher scores are drawn more often.",
            "Anything used in the last few reels is pushed almost to zero, so the feed doesn't repeat itself.",
            "A combination that overlaps too much with an earlier reel is drawn again.",
          ],
        },
        {
          title: "4. Cut on your own timing",
          text: [
            "This is the part that made it look right. Before writing any code, I edited a few reels by hand in CapCut. They kept the same rhythm, so I measured the cut points and copied them exactly, down to the hundredth of a second. Every reel the machine makes uses that rhythm: 3 clips, 5 finished photos, 1 hook line, about 10 seconds.",
          ],
          figures: [{ src: "/free/36/cuts.jpg", alt: "My hand edit and the machine's reel cut on the same frames", caption: "Hand edit vs the machine", tall: true }],
        },
        {
          title: "5. Post the top three",
          text: [
            "Every night it makes 10 reels, checks that each file plays, and schedules the 3 with the best scores to TikTok at spread-out times, each with a caption from a rotating set.",
          ],
        },
        {
          title: "Build your own",
          bullets: [
            "Edit by hand first. Automate the pattern you already have, not one you imagine.",
            "Let numbers decide where to cut (the flash) and let the model decide what is good (the scores).",
            "Keep a record of what each reel used, so the next night can avoid it.",
            "Start with posting a few a day. More is not better on a new account.",
          ],
        },
      ],
      notes: [
        "Results vary: most reels get far fewer views than the best one.",
        "An overview by @copilot_shogo. Not affiliated with any of the tools above.",
      ],
    },
  },
  {
    number: 35,
    slug: "35-reason-network",
    title: "Reason Network: let your AI agents message your teammates' agents",
    description:
      "Reason Network is a free tool from a Y Combinator startup that puts every coding agent on your team on one network: your Claude Code can ask your cofounder's Codex for a review, or a classmate's agent can ask yours what changed. What it does, the four tools agents get, how to set it up, and the one setting to check first. An independent guide.",
    date: "2026-10-21",
    keyword: "NETWORK",
    tools: [
      {
        name: "Reason Network",
        what: "The official page: what it is, supported agents, security, FAQ. Free: no card, no plan. By Reason Machines (Y Combinator, Spring 2026, San Francisco).",
        href: "https://reasonmachines.com/network",
        icon: "browser",
        install: ["curl -fsSL https://reasonmachines.com/install.sh | bash -s -- network"],
        note: "The official one-line install for macOS / Linux (Windows has a PowerShell line on the page). It signs you in with a Reason account (Google, GitHub, Apple or email) and sets up the coding agents on your computer. Read the script before you run it; the repo has its own install.sh for the open-source engine only.",
      },
      {
        name: "reason-network on GitHub",
        what: "reason-machines/reason-network: the open-source engine behind it, MIT OR Apache-2.0. 567 stars on Oct 21, 2026. The Reason CLI that sets it up is free but not open source.",
        href: "https://github.com/reason-machines/reason-network",
        icon: "cpu",
      },
    ],
    about: {
      intro: [
        "Every agent on your team can see the others and send them a message: Claude Code, Codex, Cursor, Gemini CLI, Copilot CLI, opencode and Pi on your computers, plus hosted bots like Grok Bot and Muse.",
      ],
      steps: [
        { title: "Install and sign in", text: "Run the install line, sign in, and let it set up the agents on this computer. Your other computers join by signing in with the same account." },
        { title: "Invite your team", text: "Send your invite line to a coworker, cofounder or classmate. They paste it, sign in, and their agents join your network." },
        { title: "Ask in plain words", text: "For example, in Claude Code: \"Ask my cofounder's Codex to review the retry change in webhook.ts.\" The answer comes back into your session." },
        { title: "Decide on approvals", text: "When a teammate's agent needs your permission, an Approve / Deny pop-up appears on your screen." },
      ],
      notes: [
        "Agents get four tools: list_team (who is on the team, which machine, busy or idle), send_message, check_inbox and ask_user.",
        "Computers talk peer to peer, end-to-end encrypted (built on iroh). Reason's relays only forward encrypted traffic, and a team can run its own relay. Hosted bots connect through Reason's server.",
        "The catch: by default, your teammates' messages go straight to your agent. A \"hold\" mode makes your agent ask you first. Reason's own docs call the approval pop-up a speed bump, not a guarantee. Only invite people you trust.",
        "Messages to someone offline wait for them (up to a day for a session). Attachments are small text files only: up to 10 files, 256 KB each.",
        "\"About 2 ms\" on the official page is between two engines on one machine. Across computers, your network's own latency applies.",
        "It isn't the first way to connect agents (Claude Code has its own agent teams, and Reason lists other projects). What it adds: different agents, on different people's computers, on one network.",
        "Founders: Adi Singh (CEO) and Sven Myhre (CTO). The engine started as tincan by Lars Talian, who works at Reason.",
        "An independent guide by @copilot_shogo. Not affiliated with Reason Machines.",
      ],
    },
  },
  {
    number: 34,
    slug: "34-my-eyes",
    title: "MY EYES: a lyric video built entirely in code",
    description:
      "A 28.8-second lyric video made with Claude Opus 5.5 in Claude Code: 16 real-looking app screens, one continuous camera, no After Effects. Here is what it is and the screens. The full prompt and source are coming as a kit.",
    date: "2026-10-20",
    keyword: "EYES",
    tools: [
      {
        name: "Claude Code",
        what: "Where Claude Opus 5.5 wrote every screen, word and camera move.",
        href: "https://claude.com/claude-code",
        icon: "wand",
      },
      {
        name: "Remotion",
        what: "React for video: every frame is rendered from code. Free for individuals and companies up to 3 people; larger companies need a license.",
        href: "https://www.remotion.dev",
        icon: "cube",
      },
      {
        name: "Blender",
        what: "The one 3D object in the video: the eyeball.",
        href: "https://www.blender.org",
        icon: "cube",
      },
    ],
    about: {
      intro: [
        "28.8 s · 9:16 · 60 fps. Every frame rendered by code: no After Effects, no timeline, no AI video generation. 13 versions in one day.",
      ],
      chapters: [
        {
          title: "The screens",
          text: ["Each lyric line lives inside a different app, rebuilt to look like the real thing. Stills from the finished video:"],
          figures: [
            { src: "/free/34/music.jpg", alt: "Apple Music lyrics view", caption: "Apple Music", tall: true },
            { src: "/free/34/eye.jpg", alt: "Blender eyeball", caption: "The eye (Blender)", tall: true },
            { src: "/free/34/slack.jpg", alt: "Slack DM", caption: "Slack", tall: true },
            { src: "/free/34/chatgpt.jpg", alt: "ChatGPT search field", caption: "ChatGPT", tall: true },
            { src: "/free/34/wallet.jpg", alt: "Wallet cards", caption: "Wallet", tall: true },
            { src: "/free/34/spotify.jpg", alt: "Spotify artist page", caption: "Spotify", tall: true },
            { src: "/free/34/claude.jpg", alt: "Claude Code terminal", caption: "Claude Code", tall: true },
            { src: "/free/34/netflix.jpg", alt: "Netflix title page", caption: "Netflix", tall: true },
            { src: "/free/34/notion.jpg", alt: "Notion page", caption: "Notion", tall: true },
            { src: "/free/34/call.jpg", alt: "Incoming call", caption: "Call", tall: true },
            { src: "/free/34/whatsapp.jpg", alt: "WhatsApp chat", caption: "WhatsApp", tall: true },
            { src: "/free/34/power.jpg", alt: "Slide to power off", caption: "Power off", tall: true },
          ],
        },
        {
          title: "Want to make your own?",
          text: [
            "The full prompt, the beat sheet and the source are being packaged as a kit. DM \"KIT\" to @copilot_shogo on Instagram and you'll hear first when it's out.",
          ],
        },
      ],
      notes: [
        "A fan edit for portfolio purposes. The song, album art and photos belong to their owners. Not affiliated with Travis Scott, Apple or any app shown.",
        "By @copilot_shogo. Not affiliated with Remotion, Anthropic or Blender.",
      ],
    },
  },
  {
    number: 33,
    slug: "33-six-agents",
    title: "Six AI agents, two camps: which one is for you",
    description:
      "The six AI agents everyone is talking about, split by where they run. Three are done for you in someone else's cloud (dots, Muse, Grok Bot) and three run on your own machine (OpenClaw, Hermes Agent, MausBot). What each one does, who can use it, and what to check before you give it access. Facts checked against each official page on Oct 17, 2026. An independent guide.",
    date: "2026-10-17",
    keyword: "AGENTS",
    tools: [
      {
        name: "dots (OpenAI)",
        what: "An always-on agent inside ChatGPT with its own computer and browser in the cloud. Give it a goal and it keeps working across 4,000+ apps through ChatGPT plugins. Pro, Business Premium and Enterprise (Pro: 18+, not EEA/UK/CH).",
        href: "https://learn.chatgpt.com/docs/dots",
        icon: "browser",
      },
      {
        name: "Muse (Meta)",
        what: "A personal agent: books, shops, fills out forms, turns long-term goals into plans, and comes back when something changes. Free for most uses, Power $20/mo and Maximum $100/mo. Rolling out in the US on iOS, Android and muse.ai.",
        href: "https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/",
        icon: "robot",
      },
      {
        name: "Grok Bot (xAI, beta)",
        what: "A team of always-on bots: give each one a role (sales, marketing, operations…) and put them in a group chat to coordinate. Included with SuperGrok plans and Cursor Pro and up.",
        href: "https://x.ai/news/introducing-grok-bot",
        icon: "council",
      },
      {
        name: "OpenClaw (open source, MIT)",
        what: "Runs on your own computer; you text it from WhatsApp, Telegram, Slack, iMessage and 20+ more. 392k GitHub stars (Oct 16, 2026). By default exec approvals are off (security=full, ask=off): turn approvals on before giving it real access.",
        href: "https://github.com/openclaw/openclaw",
        icon: "cpu",
        install: ["curl -fsSL https://openclaw.ai/install.sh | bash", "openclaw onboard --install-daemon"],
        note: "Approvals are off by default: docs.openclaw.ai/tools/exec-approvals",
      },
      {
        name: "Hermes Agent (Nous Research, MIT)",
        what: "Creates skills from experience and improves them. Bot Mode gives each bot its own role, model and memory and lets them talk in group chats. By default an auxiliary LLM reviews risky commands (Smart mode) and asks you when unsure.",
        href: "https://github.com/NousResearch/hermes-agent",
        icon: "brain",
      },
      {
        name: "MausBot (open source, Apache-2.0)",
        what: "An open-source Grok Bot alternative started on Aug 11, 2026 (the day Grok Bot launched) by Milind Soni and Omkar Satpute. Your bots run on the claude, codex and grok CLIs installed on your own machine. The desktop and companion apps are free; Cloud plans are paid.",
        href: "https://github.com/milind-soni/OpenMausBot",
        icon: "plug",
      },
    ],
    about: {
      intro: [
        "Pick the camp first. Done for you (their cloud): dots, Muse, Grok Bot. You own it (your machine): OpenClaw, Hermes, MausBot.",
      ],
      notes: [
        "Plans, prices and availability are as listed on each official page on Oct 17, 2026, and change often.",
        "Star counts move fast and are not user counts.",
        "An independent guide by @copilot_shogo. Not affiliated with OpenAI, Meta, xAI, Nous Research or any of these projects.",
      ],
    },
  },
  {
    number: 32,
    slug: "32-argon-vs-opus",
    title: "Gemini 4 Argon vs Claude Opus 5.5: three 3D tests, and how Google built the temple",
    description:
      "The three viral tests from the reel (ship in a bottle, firefly jar, gummy bears) with each tester's own numbers, the list prices behind them, and the four stages Google DeepMind's George Kenwright showed for building a temple complex in Blender with Argon inside Antigravity. Facts checked against each post and the official pages on Oct 16, 2026. An independent guide.",
    date: "2026-10-16",
    keyword: "ARGON",
    tools: [
      {
        name: "Test 1: ship in a bottle (@vib3coded)",
        what: "Same scene, two models. The video labels read Gemini 4 Argon $0.19 and Claude Opus 5.5 $12.06. The tester's verdict: \"For quality, I'm picking Opus.\"",
        href: "https://x.com/vib3coded/status/2110136719827747181",
        icon: "cube",
      },
      {
        name: "Test 2: firefly jar (@0xRhinoX)",
        what: "Same prompt: a firefly jar you can open gently. Opus 5.5: $15.00, 64 min. Gemini 4 Argon: $0.19, 8 min. In the poster's words, Opus made real glass and Gemini made a glowstick in a box.",
        href: "https://x.com/0xRhinoX/status/2110382089476407630",
        icon: "cube",
      },
      {
        name: "Test 3: gummy bears (@semichenkko)",
        what: "Opus: $7.2. Gemini: $22. Over 600K views. The post carries a Community Note: \"Multiple users reproducing the prompt with Gemini 4 Argon (medium/high) obtained soft deformable jelly physics like the top panel, not rigid statues.\"",
        href: "https://x.com/semichenkko/status/2110131790136401989",
        icon: "cube",
      },
      {
        name: "The temple video (Google Antigravity)",
        what: "George Kenwright, Creative Producer at Google DeepMind, walks through the temple complex he built in Blender with Gemini 4 Argon inside Antigravity. Posted by Google Antigravity on Oct 13, 2026.",
        href: "https://x.com/antigravity/status/2110040109789708543",
        icon: "event",
      },
      {
        name: "Gemini 4 Argon: price (Google blog)",
        what: "$2 per 1M input tokens and $10 per 1M output tokens as an introductory price. From Nov 30, 2026: $4 and $20.",
        href: "https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-argon/",
        icon: "file",
      },
      {
        name: "Claude Opus 5.5: price (Claude docs)",
        what: "$4 per 1M input tokens and $20 per 1M output tokens.",
        href: "https://platform.claude.com/docs/en/models/opus-5-5/overview",
        icon: "file",
      },
    ],
    about: {
      intro: [
        "Per token, Argon costs half of Opus until Nov 30, 2026, then the same. So a run's bill comes from how many tokens the model burns on that prompt, not from the price list alone.",
      ],
      steps: [
        { title: "Blueprints first", text: "The model called a tool to create architectural blueprints (CAD) before building anything." },
        { title: "Four reference images", text: "Nano Banana generated four images of the temple from different angles. They served as the references for everything after." },
        { title: "A team of agents with a critic", text: "Four Gemini 4 Argon specialist subagents worked in parallel, managed and reviewed by an Argon orchestrator acting as an adversarial critic." },
        { title: "Compare, over and over", text: "Renders from Blender were compared against the four reference images, again and again. George says he came back the next morning to the finished still renders." },
      ],
      notes: [
        "The costs in the three tests are what each tester reported. None of them published how they measured it (tokens, settings, effort level).",
        "The four stages are what George says and shows in the video. Google has not published the full prompt or a skill file for it.",
        "\"Not with 'build me a pagoda'\" is a paraphrase of George's words: it was \"a little more complex than just build me a pagoda\".",
        "An independent guide by @copilot_shogo. Not affiliated with Google, Anthropic or the testers.",
      ],
    },
  },
  {
    number: 31,
    slug: "31-vibe-tools",
    title: "4 tools to add to Claude Code before you vibe code",
    description:
      "Ponytail (less code), OmniRoute (one gateway, automatic fallback), Graphify (your codebase as a knowledge graph) and Addy Osmani's Agent Skills (25 engineering skills). What each one does, how to install it, and what to know first. Facts checked against each project's README on Oct 15, 2026. An independent guide.",
    date: "2026-10-15",
    keyword: "VIBE",
    tools: [
      {
        name: "Ponytail",
        what: "DietrichGebert/ponytail. MIT. Makes the agent write the simplest, shortest solution that actually works. In the author's own benchmark (Ponytail 5, Opus 5.5, 39 tasks): about half the code (-53%) and -45% output tokens. Example from the README: a date picker went from 335 lines to 10.",
        href: "https://github.com/DietrichGebert/ponytail",
        icon: "scissors",
        install: ["/plugin marketplace add DietrichGebert/ponytail", "/plugin install ponytail@ponytail"],
        note: "A Claude Code plugin. Only install it from DietrichGebert/ponytail (or @dietrichgebert/ponytail on npm); the README warns about look-alikes.",
      },
      {
        name: "OmniRoute",
        what: "diegosouzapw/OmniRoute. MIT, self-hostable. One local gateway in front of many AI providers: 154 of the 372 it lists are marked as having free tiers. When a provider hits its quota or fails, a \"combo\" can move to the next healthy model.",
        href: "https://github.com/diegosouzapw/OmniRoute",
        icon: "plug",
        install: ["npm install -g omniroute", "omniroute configure claude"],
        note: "Not a plugin: an app you run (dashboard on localhost:20128). Free tiers use your own provider accounts; some need a signup or a card, and the fallback only uses providers you connected.",
      },
      {
        name: "Graphify",
        what: "Graphify-Labs/graphify. Apache-2.0. Maps your project into a knowledge graph your agent can query instead of re-reading files. Code is parsed locally with tree-sitter, and building the graph uses 0 LLM credits. Made by Graphify Labs (YC S26).",
        href: "https://github.com/Graphify-Labs/graphify",
        icon: "brain",
        install: ["uv tool install graphifyy", "graphify install"],
        note: "The PyPI package is graphifyy (two y's); other graphify* packages are not affiliated. In Claude Code run /graphify . — graphify claude install makes it the default.",
      },
      {
        name: "Agent Skills",
        what: "addyosmani/agent-skills. MIT. 25 skills for the whole lifecycle (define, plan, build, verify, review, ship) with /spec, /plan, /build, /test, /review and /ship. By Addy Osmani: ex-Director at Google Cloud AI, now a Member of Technical Staff at Anthropic working on Claude Code.",
        href: "https://github.com/addyosmani/agent-skills",
        icon: "review",
        install: ["/plugin marketplace add addyosmani/agent-skills", "/plugin install agent-skills@addy-agent-skills"],
        note: "Skills activate when the task matches their description, so they are not guaranteed to fire; you can always call a command like /spec yourself.",
      },
    ],
    about: {
      notes: [
        "Only Ponytail and Agent Skills are Claude Code plugins. OmniRoute is an app you run, Graphify is a CLI that registers a skill.",
        "The Ponytail numbers are the author's own benchmark, not an independent test. An earlier Haiku benchmark showed smaller savings, and on some OpenAI reasoning models it cost more.",
        "\"Cut agent token spend by 80%\" on graphify.com is about the paid Graphify Cloud, not the open-source CLI.",
        "Star counts move fast and are not user counts: Ponytail 163K, Graphify 126K, Agent Skills 107K, OmniRoute 76K (GitHub, Oct 15, 2026).",
        "An independent guide by @copilot_shogo. Not affiliated with any of these projects.",
      ],
    },
  },
  {
    number: 29,
    slug: "29-rea",
    title: "REA: let your AI find out how an app's feature works",
    description:
      "REA (Reverse Engineer Anything) is a free, open-source MCP that lets Claude Code, Codex or Cursor inspect an app without its source code and explain how a feature works, with the evidence. How to set it up, a real run on MarkText, what it can't see, and the rules for using it. An independent guide.",
    date: "2026-10-12",
    keyword: "REA",
    tools: [
      {
        name: "REA on GitHub",
        what: "morluto/rea. MIT license. 130K+ GitHub stars on Oct 12, 2026, most of them in about ten days of October. Built by an independent developer, morluto, with 100+ contributors.",
        href: "https://github.com/morluto/rea",
        icon: "cpu",
        install: ["npx rea-agents setup"],
        note: "Setup asks which agents to add it to (Claude Code, Codex, Cursor and other MCP agents) and shows the changes before applying them. Restart your agent afterward. Needs Node.js 22.19+, 24.11+ or 26+.",
      },
      {
        name: "rea.tools",
        what: "The official site: setup guide, guides per target (JavaScript/Electron, native binaries, Android, websites) and case studies.",
        href: "https://rea.tools",
        icon: "browser",
      },
      {
        name: "MarkText",
        what: "The open-source (MIT) Markdown editor used for the demo in the reel. A safe app to practise on.",
        href: "https://github.com/marktext/marktext",
        icon: "file",
      },
    ],
    about: {
      intro: [
        "Point your agent at an app, ask how one feature works, and it answers with the files and functions behind it.",
      ],
      steps: [
        { title: "Set it up", text: "Run npx rea-agents setup, pick your agent, approve the changes, restart the agent." },
        { title: "Ask about one feature", text: "For example: \"Using REA, find out how MarkText exports a document to PDF. Show me the evidence: file and function names, step by step.\"" },
        { title: "Read the evidence", text: "The answer lists where each step lives. Check the claims against the files it names before you rely on them." },
        { title: "Build your own version", text: "Use what you learned to write your own implementation. Learn from the design; don't copy someone else's code." },
      ],
      example: {
        question: "Using REA, find out how MarkText exports a document to PDF. Show me the evidence (file + function names).",
        output: `MarkText exports PDFs with Electron's built-in webContents.printToPDF: the renderer lays the document out as styled HTML, and the main process prints that window to a file.

1. Menu → renderer: exportFile(win, type) in out/main/index.js sends mt::show-export-dialog to the window.
2. Renderer → main: the EXPORT({ type, content, pageOptions }) store action sends mt::response-export with the title, path and page options.
3. Main handler: out/main/index.js registers ipcMain.on("mt::response-export", handleResponseForExport).
4. The export itself: handleResponseForExport shows dialog.showSaveDialog, then for type === "pdf" calls win.webContents.printToPDF(options).
5. Write and report: it calls removePrintServiceFromWindow(win), then writeFile(filePath, data, extension, "binary"), and sends mt::export-success back.`,
        source: "A real run in Claude Code (Opus 5.5) with REA on MarkText 0.21.2, Oct 12, 2026, quoted from the answer. REA's automatic graph did not find printToPDF on its own; Claude read the app's packaged files through REA to finish the trace. It took about 15 minutes.",
      },
      notes: [
        "It only sees what reaches your machine: the app's files, or a website's scripts. Anything that runs on a company's servers stays hidden.",
        "Analysis runs locally, but the results go to your agent, so your model provider's data policy applies.",
        "JavaScript / Electron apps and .NET need only Node.js. Native binaries need Hopper, Ghidra or IDA; Android needs JADX and a JDK.",
        "Other people's apps are protected by copyright and their license terms. REA's own disclaimer: it is for lawful research, education, interoperability, software preservation, and analysis of software you own or are authorized to examine. It does not support copying proprietary software, bypassing DRM or license checks, or making game cheats.",
        "In REA's case studies (rea.tools/showcase), code from the 1996 game DX-Ball was rebuilt until it matched all 63 compiled bytes; REA supplied the evidence and the reconstruction project wrote and tested the code.",
        "\"Software is done.\" was Matthew Berman's post about REA on X (Oct 8, 2026), not the project's own claim.",
        "An independent guide by @copilot_shogo. Not affiliated with REA or its authors.",
      ],
    },
  },
  {
    number: 28,
    slug: "28-ai-influencer",
    title: "Make your own AI influencer in two steps",
    description:
      "The AI influencers in your feed are pulling tens of millions of views. This is exactly how I made my own with Higgsfield: the traits I picked, the dance video, the model and prompt, what every step cost, and the rules to follow before you post. An independent guide.",
    date: "2026-10-11",
    keyword: "INFLUENCER",
    tools: [
      {
        name: "Higgsfield AI Influencer",
        what: "Step 1. Pick traits (hair, nose, height, outfit…) and it returns a character sheet: a face close-up and a full-body shot of the same person. Launched Oct 2, 2026. 1.12 credits per sheet; you can make 1 to 4 at once.",
        href: "https://higgsfield.ai/ai-influencer",
        icon: "robot",
      },
      {
        name: "Higgsfield Genjutsu",
        what: "Step 2 (option A). Give it a dance video (up to 30 seconds) and your character sheet; it keeps the moves, camera and timing and swaps in your character. Up to 1080p.",
        href: "https://higgsfield.ai/genjutsu",
        icon: "wand",
      },
      {
        name: "Seedance 2.5 on Higgsfield",
        what: "Step 2 (option B, what I used for the final). Same idea with the sheet and the dance video as references; has a cheap 480p draft you can upgrade to 1080p.",
        href: "https://higgsfield.ai",
        icon: "cpu",
      },
    ],
    breakdown: {
      tldr: [
        ["Characters with a strange, readable silhouette (wild hair, big features, vintage suits) are getting tens of millions of views by dancing to trending moves."],
        ["You can make one in two steps: design it in ", { text: "Higgsfield AI Influencer", href: "https://higgsfield.ai/ai-influencer" }, ", then give it a dance video."],
        ["Mine cost about 195 credits in total: 12 character sheets, one 480p draft and one 1080p final. Most of that is the 1080p video."],
        ["Use a dance clip you are allowed to use, and label the post as AI-generated."],
      ],
      sections: [
        {
          title: "The trend",
          unit: { one: "account", many: "accounts" },
          items: [
            {
              name: "@jean_philanthrope",
              what: ["Blonde bob, curled moustache, tweed suit, dancing in the street. First Instagram post Sep 17, 2026; 12 posts and about 243K followers by Oct 11; his most-played video is at about 37 million plays."],
              whoLabel: "Is it AI?",
              who: ["Widely reported as an AI character. The account itself has not said so, so I don't state it as fact."],
            },
            {
              name: "@abu.shalab",
              what: ["White thobe, black bob, big moustache, dancing on a stage. One TikTok (Sep 25) is at about 26.6 million views."],
            },
            {
              name: "@miltonbumford",
              what: ["Red bowl cut, round glasses, tweed suit. One Instagram reel (Sep 28) is at about 7.5 million plays. His bio says the account is AI and made with Higgsfield."],
            },
          ],
        },
        {
          title: "What I paid",
          unit: { one: "item", many: "items" },
          items: [
            { name: "Character sheets", what: ["12 sheets × 1.12 = about 13.4 credits (4 that missed, 8 for the final pick)."] },
            { name: "480p draft (12 s)", what: ["36 credits. Enough to check that the moves transfer."] },
            { name: "1080p final (12 s, high bitrate)", what: ["144 credits. Only after the draft looked right."] },
            { name: "For comparison: Genjutsu (12 s)", what: ["84 credits for one 12-second motion transfer."] },
          ],
        },
      ],
      notes: [
        "Credit prices and the free allowance are as of Oct 11, 2026 and can change. New accounts got 5 free AI Influencer sheets (as of Oct 3).",
        "View and follower counts were checked on Oct 11, 2026 (JST) and are rounded.",
      ],
      sources: [
        { text: "Higgsfield AI Influencer", href: "https://higgsfield.ai/ai-influencer" },
        { text: "Higgsfield Genjutsu", href: "https://higgsfield.ai/genjutsu" },
        { text: "@jean_philanthrope on Instagram", href: "https://www.instagram.com/jean_philanthrope/" },
        { text: "@miltonbumford on Instagram", href: "https://www.instagram.com/miltonbumford/" },
        { text: "@abu.shalab on TikTok", href: "https://www.tiktok.com/@abu.shalab" },
      ],
    },
    about: {
      intro: ["The exact steps I took for the character in the reel. Step 1 is the look; step 2 makes it move."],
      steps: [
        { title: "Open AI Influencer and pick a tier", text: "There are three human tiers (Normal, Bold, Total) plus animals (cats, dogs, frogs, birds…). Bold unlocks the strange options. I used Bold." },
        { title: "Pick traits that read from far away", text: "The viral ones are recognisable from their silhouette alone. Mine: Hair wings (a bob whose sides flare out), platinum blonde, very tall, slim build, long limbs, long head and neck, close-set eyes, a big potato nose, brush brows, a pencil moustache, Suits style. You can also add a one-line description; mine asked for a vintage brown houndstooth tweed suit and striped tie." },
        { title: "Make 4 sheets at once and compare", text: "Each sheet is a face close-up next to a full-body shot. My first batch (soft-serve swirl hair) looked like a costume, not a character, so I changed the hair, nose and height and ran 4 more of two hair types. I picked one with wide wing hair." },
        { title: "Get a dance video", text: "Full body in frame, camera mostly still, simple background, 10 to 15 seconds. Trim it to the best moves; you pay per second. Use your own clip or one you have the rights to." },
        { title: "Run a 480p draft", text: "In Seedance 2.5 I set the mode to reference, attached the character sheet and the dance video, 9:16, 12 seconds, draft on, sound off. The prompt is below. Check the moves, the hair shape and the face before spending more." },
        { title: "Finalize at 1080p", text: "Upgrade the same draft to 1080p (high bitrate). The motion stays the same, the detail goes up." },
        { title: "Edit and post", text: "Cut it to the beat, add your caption, and turn on the AI label on Instagram (AI info) and TikTok (AI-generated)." },
      ],
      example: {
        question: "The prompt I used for the dance video (Seedance 2.5, reference mode, with the character sheet + the dance clip attached)",
        output:
          "Recreate the reference video exactly: same shadow-boxing dance moves, same timing,\nsame handheld camera framing, same sunny city sidewalk with apartment buildings and\ncrosswalk. Replace the dancer with the character from the reference image: an extremely\ntall, lanky man with a huge platinum blonde bob whose sides flare out wide and flat like\nstiff wings, dark center roots, bushy brows, pale grey eyes, a very large bulbous nose,\nthin pencil moustache and small chin tuft, brown houndstooth double-breasted suit, white\nshirt, brown striped tie, brown suede loafers. Photorealistic, natural daylight, sharp detail.",
        source: "Swap the character description for yours. Describe the outfit in detail; the model holds it better.",
      },
      notes: [
        "Rights: Higgsfield's terms say you need permission for other people's likeness and work you put in. Your own dance clip is the safest.",
        "Hair shapes can shrink in motion (my wings came out a bit smaller than on the sheet). Exaggerate the trait in the description.",
        "Keep the outfit simple to describe; busy patterns flicker more.",
        "Clips in the reel are credited to @jean_philanthrope, @abu.shalab and @miltonbumford.",
        "An independent guide by @copilot_shogo. Not affiliated with Higgsfield.",
      ],
    },
  },
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
    number: 21,
    slug: "21-motion-as-code",
    title: "Motion graphics with Claude Opus 5.5, no After Effects",
    description:
      "How I made a 41-second motion-graphics reel without After Effects: Claude Opus 5.5 wrote every scene as code on top of the open-source pdoom-video engine. The setup, the workflow, the prompts and the code building blocks, so you can make your own.",
    date: "2026-10-14",
    keyword: "CODE",
    tools: [
      {
        name: "pdoom-video",
        what: "The open-source engine the reel runs on, by mexicat (Giacomo Magnanini). MIT license. TypeScript + three.js: glowing HDR post-processing, word-synced typography, and an exporter with real motion blur. Every frame is a function of time, so the browser preview and the final video match.",
        href: "https://github.com/mexicat/pdoom-video",
        icon: "cube",
        install: ["git clone https://github.com/mexicat/pdoom-video", "cd pdoom-video/app && bun install && bunx vite"],
        note: "Needs bun, Google Chrome and ffmpeg (with libx264). The preview opens at localhost:5173: space plays, ← → seeks, [ ] jumps between scenes.",
      },
      {
        name: "Claude Code",
        what: "Where Claude Opus 5.5 reads the engine and writes the scenes. You describe the motion in plain English; it writes and edits the code.",
        href: "https://claude.com/claude-code",
        icon: "wand",
      },
      {
        name: "ElevenLabs",
        what: "The voiceover. Any voice works; the timing of every animation comes from the words in it.",
        href: "https://elevenlabs.io",
        icon: "plug",
      },
    ],
    about: {
      intro: [
        "No timeline, no keyframes: every word, shape and move in the reel is code that Claude wrote. Here is exactly how, and how to do it on your own project.",
      ],
      chapters: [
        {
          title: "How this reel was made",
          bullets: [
            ["Engine: ", { text: "pdoom-video", href: "https://github.com/mexicat/pdoom-video" }, " (MIT). It handles the glow, the typography and the export. I didn't build that part, and it is a big reason the reel looks the way it does."],
            ["Script: 9 lines, voiced with ElevenLabs."],
            ["Timing: every word got a start and end time, and each animation is tied to a word, not to a second."],
            ["Scenes: 6 scene files, all written by Claude Opus 5.5 in Claude Code."],
            ["Iteration: 6 versions in one day. Watch, say what's wrong in plain English, render again."],
            ["Export: 1080p at 60 fps with motion blur, then voice, sound effects and music mixed with ffmpeg. 41 seconds."],
          ],
        },
        {
          title: "The idea: every frame is a function of time",
          text: [
            ["In After Effects you place keyframes on a timeline. Here, each thing on screen is a function: give it the time ", { code: "t" }, " and it says where it is, how big, what colour. Same ", { code: "t" }, " in, same frame out."],
            ["That is why it suits an AI. Claude can't drag keyframes, but it writes functions very well. And \"slower\", \"bluer\" or \"loop the end\" becomes a small edit to the code, not a hundred keyframes by hand."],
          ],
        },
        {
          title: "Set up the engine",
          text: ["Clone it, install, and open the live preview. Watch the original video once in the preview: it shows you what the engine can do before you change anything."],
          commands: [
            "git clone https://github.com/mexicat/pdoom-video",
            "cd pdoom-video/app && bun install",
            "bunx vite",
          ],
          bullets: [
            [{ code: "app/src/engine/" }, " the renderer, timeline, post-processing (glow, grain) and typography."],
            [{ code: "app/src/scenes/" }, " one file per scene. This is where Claude writes."],
            [{ code: "app/src/timeline.ts" }, " which scene plays when, anchored to the words."],
            [{ code: "data/lyrics.json" }, " the word timings. The original uses a song; you will swap in your voiceover."],
          ],
        },
        {
          title: "Write the voiceover and get word timings",
          text: [
            "Write short lines, one idea each: every line becomes a scene. Generate the voice, then get the start and end time of every word. Two easy ways:",
          ],
          bullets: [
            ["ElevenLabs' text-to-speech ", { text: "with timestamps", href: "https://elevenlabs.io/docs/api-reference/text-to-speech/convert-with-timestamps" }, " endpoint returns the timing of every character along with the audio."],
            ["Or run Whisper on the finished audio with word timestamps on (command below)."],
          ],
          commands: ["whisper voiceover.mp3 --model small --word_timestamps True --output_format json"],
          code: [
            {
              label: "Prompt: swap the song for your voiceover",
              body: `Replace the song in this project with my voiceover.
- The audio is at audio/voiceover.mp3.
- My word timings are in voiceover.json (Whisper output).
Open data/lyrics.json to see the format the engine expects, convert my
timings into that format (one line per sentence), and update whatever
reads the song file. Don't touch any scene yet. When you're done, tell me
the start time of each line.`,
            },
          ],
        },
        {
          title: "Have Claude write one scene per line",
          text: [
            "Start a new Claude Code session in the repo and ask for one scene at a time. The two rules that matter: Claude reads the engine and an existing scene first, and every timing comes from a word, never a typed-in number of seconds.",
          ],
          code: [
            {
              label: "Prompt: one scene",
              body: `Read app/src/engine/ and two existing scenes in app/src/scenes/ before
writing anything, so you use the engine the way its author does.

Then add a new scene for this voiceover line:
"Every word, every shape, every move is a function of time."

Rules:
- Every value is a pure function of time t. No hidden clocks, no unseeded random.
- Anchor every timing to a word in data/lyrics.json, never to hard-coded seconds.
- Things are built on screen: lines and panels are drawn by a pen, not faded in.
- The words light up karaoke-style as they're spoken.
- The camera never stops moving.
Register it in timeline.ts and tell me the time range to preview.`,
            },
            {
              label: "What a scene looks like (TypeScript, 1920×1080 canvas)",
              body: `// One scene = one function of time. Times come from the words, never typed-in seconds.
import { words } from "./words"; // [{ w: "Every", start: 9.82, end: 10.05 }, ...]
import { window01, spring, pulse } from "./motion";
import { drawPen } from "./pen";
import { drawKaraoke } from "./karaoke";

const find = (w: string) => words.findIndex((x) => x.w.toLowerCase().startsWith(w));
const at = (w: string) => words[find(w)].start;
const line = (from: string, to: string) => words.slice(find(from), find(to) + 1);

const box: [number, number][] = [[140, 380], [1780, 380], [1780, 700], [140, 700], [140, 380]];

export function sceneEveryMove(ctx: CanvasRenderingContext2D, t: number) {
  const life = window01(t, at("every") - 0.3, at("then"));
  if (life <= 0) return;
  ctx.save();
  ctx.globalAlpha = life;
  drawPen(ctx, box, t, at("every") - 0.3, at("every") + 0.5); // the frame is drawn, not faded in
  drawKaraoke(ctx, line("every", "time"), t, 200, 560);       // the line lights up as it's said
  const pop = spring(t, at("function"));                       // "function" lands with a pop...
  const hit = pulse(t, at("function"));                        // ...and a short flash
  ctx.font = "700 64px JetBrains Mono";
  ctx.fillStyle = "rgba(77,139,255," + (0.6 + 0.4 * hit) + ")";
  ctx.translate(200, 660);
  ctx.scale(pop, pop);
  ctx.fillText("x(t) = f(t)", 0, 0);
  ctx.restore();
}`,
            },
          ],
        },
        {
          title: "Make it look pro: 7 moves",
          text: [
            "My first version scored 45 out of 100 next to a professional piece, even on the same engine. The difference was never how much was on screen. It was how things arrive. Ask for these by name:",
          ],
          bullets: [
            [{ code: "Pen" }, ": lines, boxes, rulers and underlines are drawn by a glowing pen tip, never faded in. This is the single biggest difference."],
            [{ code: "Karaoke" }, ": unspoken words are a thin outline, the spoken word wipes in with the accent colour, then settles."],
            [{ code: "Hot → cool" }, ": anything new appears in the accent colour and cools to the normal colour in about 0.3 s. It reads as \"just made\"."],
            [{ code: "Syllable sync" }, ": hit the parts of a word, not just its start (\"five · point · five\" lands one digit at a time)."],
            [{ code: "Live tools" }, ": a graph editor whose handle gets dragged, a table that gets typed, a preview that actually plays. No still screenshots of UI."],
            [{ code: "Camera" }, ": start zoomed in and pull out on the headline, then whip to the next block. It never sits still. When things stop moving, the video feels slow."],
            [{ code: "One signature move per element" }, ": an odometer roll for numbers, sparks off the pen, a scale pop on a slam. Easing, overshoot and short flashes do more than extra elements."],
          ],
          code: [
            {
              label: "Prompt: upgrade a scene",
              body: `Go through this scene and replace every plain fade with real motion:
- lines and panels are drawn by the pen,
- text is karaoke, synced to the words (and syllables for numbers),
- new elements appear in the accent colour and cool to the ink colour over 0.3 s,
- each element gets one signature micro-animation (odometer roll, spark, scale pop),
- the camera starts zoomed in, pulls out on the headline, and never stops moving.
Keep the layout and the timing the same.`,
            },
          ],
        },
        {
          title: "The building blocks (copy these)",
          text: [
            "Small, engine-independent helpers for a 2D canvas. Put them in your project, or paste them to Claude as the house style for every scene.",
          ],
          code: [
            {
              label: "motion.ts: easing, lifetimes, springs, flashes, seeded random",
              body: `// Every value on screen is a pure function of time t (seconds).
// Same t in → same frame out, so the preview and the export always match.
export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

// Fast start, soft landing: most entrances. In-out: camera moves.
export const outExpo = (x: number) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
export const inOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

// 0 → 1 as t goes from a to b, eased.
export const tween = (t: number, a: number, b: number, ease = outExpo) => ease(clamp01((t - a) / (b - a)));

// An element's life: fades in from a, holds, fades out by b. Returns 0..1.
export const window01 = (t: number, a: number, b: number, fadeIn = 0.25, fadeOut = 0.25) =>
  Math.min(clamp01((t - a) / fadeIn), clamp01((b - t) / fadeOut));

// Damped spring from 0 to 1 starting at t0: a small overshoot, then it settles.
export const spring = (t: number, t0: number, freq = 4.5, damping = 0.55) => {
  const x = t - t0;
  if (x <= 0) return 0;
  const w = 2 * Math.PI * freq;
  return 1 - Math.exp(-damping * w * x) * Math.cos(w * Math.sqrt(1 - damping * damping) * x);
};

// A flash that hits at t0 and decays: impacts, punch-ins, number slams.
export const pulse = (t: number, t0: number, decay = 8) => (t < t0 ? 0 : Math.exp(-(t - t0) * decay));

// Seeded randomness: the same "random" layout on every render.
export const mulberry32 = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
  return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
};

// Mix two hex colours, k = 0..1 (hot → cool).
export const mix = (a: string, b: string, k: number) => {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const ch = (s: number) => Math.round(((pa >> s) & 255) * (1 - k) + ((pb >> s) & 255) * k);
  return "rgb(" + ch(16) + "," + ch(8) + "," + ch(0) + ")";
};`,
            },
            {
              label: "pen.ts: a glowing pen draws the line",
              body: `import { tween, inOutCubic, pulse, mix } from "./motion";
type Pt = [number, number];

// Draw a polyline as if a glowing pen draws it between t0 and t1.
export function drawPen(ctx: CanvasRenderingContext2D, pts: Pt[], t: number, t0: number, t1: number) {
  const p = tween(t, t0, t1, inOutCubic);
  if (p <= 0) return;
  // cumulative length, so the pen moves at a steady speed around corners
  const len = [0];
  for (let i = 1; i < pts.length; i++)
    len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const target = p * len[len.length - 1];

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "#EAF0FA";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  let head: Pt = pts[0];
  for (let i = 1; i < pts.length; i++) {
    if (len[i] <= target) { ctx.lineTo(pts[i][0], pts[i][1]); head = pts[i]; continue; }
    const k = (target - len[i - 1]) / (len[i] - len[i - 1]);
    head = [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k];
    ctx.lineTo(head[0], head[1]);
    break;
  }
  ctx.stroke();

  // the pen tip glows while drawing, then fades once the line is finished
  const glow = p < 1 ? 1 : pulse(t, t1, 6);
  if (glow > 0.01) {
    ctx.shadowColor = "#4D8BFF";
    ctx.shadowBlur = 24 * glow;
    ctx.fillStyle = mix("#EAF0FA", "#FFFFFF", glow);
    ctx.beginPath();
    ctx.arc(head[0], head[1], 3 + 3 * glow, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}`,
            },
            {
              label: "karaoke.ts: words light up as they're spoken",
              body: `import { clamp01, mix } from "./motion";
type Word = { w: string; start: number; end: number }; // seconds, from your voiceover

// Unspoken: thin outline. Being spoken: the accent colour wipes left → right.
// Spoken: cools to the ink colour over 0.3 s.
export function drawKaraoke(ctx: CanvasRenderingContext2D, words: Word[], t: number, x: number, y: number) {
  ctx.save();
  ctx.font = "800 72px Inter";
  let cx = x;
  for (const word of words) {
    const text = word.w + " ";
    const width = ctx.measureText(text).width;
    const lead = 0.08; // start a hair early: the eye is faster than the ear
    const p = clamp01((t - (word.start - lead)) / Math.max(0.05, word.end - word.start));
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "rgba(234,240,250,.35)";
    ctx.strokeText(text, cx, y);
    if (p > 0) {
      const cool = clamp01((t - word.end) / 0.3); // 0 = hot, 1 = settled
      ctx.save();
      ctx.beginPath();
      ctx.rect(cx, y - 90, width * p, 120); // the wipe
      ctx.clip();
      ctx.fillStyle = mix("#4D8BFF", "#EAF0FA", cool);
      ctx.fillText(text, cx, y);
      ctx.restore();
    }
    cx += width;
  }
  ctx.restore();
}`,
            },
            {
              label: "camera.ts: zoom in log space toward a point",
              body: `import { tween, inOutCubic } from "./motion";

// Zooming in log space makes 1× → 4× feel as even as 4× → 16×.
// Apply it before drawing the scene.
export function applyCamera(
  ctx: CanvasRenderingContext2D, t: number, t0: number, t1: number,
  z0: number, z1: number, focus: [number, number], W = 1920, H = 1080,
) {
  const k = tween(t, t0, t1, inOutCubic);
  const zoom = Math.exp(Math.log(z0) + (Math.log(z1) - Math.log(z0)) * k);
  ctx.translate(W / 2, H / 2);
  ctx.scale(zoom, zoom);
  ctx.translate(-focus[0], -focus[1]);
}

// e.g. start 3× on the headline and pull out to the full frame:
// applyCamera(ctx, t, at("this") - 0.2, at("this") + 0.8, 3, 1, [960, 540]);`,
            },
          ],
        },
        {
          title: "Fix it in plain English, one thing at a time",
          text: [
            "This is where the quality comes from. Watch the scene, name the one thing that's off, and ask for only that. Describe what you see like you'd tell a friend; it works better than technical words.",
          ],
          code: [
            {
              label: "Prompt: one change",
              body: `Only change one thing: the code panel arrives too slowly and sits still
after it lands. Make it land 30% faster and keep the camera drifting
while it holds. Keep everything else the same, then tell me the time
range to preview.`,
            },
          ],
          bullets: [
            ["Preview the exact seconds Claude names, frame by frame (", { code: "," }, " and ", { code: "." }, " step one frame in the preview)."],
            ["Keep a reference you love open next to it, and compare the same moment side by side."],
            ["When a version is clearly better, save it before asking for the next change."],
          ],
        },
        {
          title: "Render and mix",
          text: [
            "Export from the app folder. --samples auto adds real motion blur: fast moves get more sub-frames per frame. If you want music and sound effects under the voice, or the export has no sound, mix it with ffmpeg.",
          ],
          commands: [
            "bun scripts/render.ts video --samples auto --shutter 0.2 --out ../out/my-video.mp4",
            "ffmpeg -i ../out/my-video.mp4 -i ../audio/voiceover.mp3 -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -shortest ../out/final.mp4",
          ],
          bullets: [
            ["A higher ", { code: "--shutter" }, " (I used 0.5 to 0.6) gives longer motion streaks on fast slams."],
            ["Keep sound effects for moments that mean something (a slam, a number landing) and well under the voice."],
          ],
        },
      ],
      notes: [
        "Be honest with yourself about where the quality comes from: the engine, your eye, and many rounds of fixing. Claude Opus 5.5 writes the code; it doesn't judge what looks good. You do.",
        [
          "The engine's code is MIT, so keep its license notice if you share your project. The original song, lyrics and audio in the repo are not covered by MIT and belong to their creators: don't reuse them. Fonts keep their own licenses (SIL OFL).",
        ],
        ["Want something lighter, or to put graphics over a talking video? ", { text: "Remotion", href: "https://www.remotion.dev" }, " (React) uses the same idea, every frame as a function of time, and Claude writes it just as well."],
        "Does it replace After Effects? Not for everything. For type-driven motion graphics synced to a voice, it already works.",
        "An independent guide by @copilot_shogo. Not affiliated with Anthropic, Adobe, ElevenLabs or the pdoom-video author.",
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
    kit: { href: "https://hustling-builder-9442.kit.com/products/3d-website-kit?promo=3DWEBSITE", price: "$29", offer: { code: "3DWEBSITE", until: "October 31", regular: "$54" }, cover: "/free/05/s0_f_0000.jpg" },
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
      kitUid: "2422b2a6b1",
      kitScript: "https://hustling-builder-9442.kit.com/2422b2a6b1/index.js",
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
  if (drop.kind) return drop.kind;
  if (drop.kit) return "build kit";
  if (drop.breakdown) return "full breakdown";
  if (drop.guide) return "free guide";
  if (drop.about?.chapters?.length) return "step-by-step guide";
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
