// Generated from module-1-diagnostic.md (release/guide) by diag2guide.py on 2026-11-28: the questions, options,
// answers and reasons are the module's own. The scoring below is the module's "Your starting point" table.

export type PartId = "A" | "B" | "C" | "D" | "E";
export type Letter = "A" | "B" | "C" | "D";
export type Question = { n: number; part: PartId; q: string; options: string[]; answer: Letter; why: string };
export type Part = { id: PartId; title: string; module: string };

export const LEDE: string[] = [
  "20 questions, about 10 minutes. Pick one answer for each. There is no time limit and nothing is sent anywhere.",
  "The answers and the scoring guide are at the end. Don't look until you've finished."
];

export const PARTS: Part[] = [
  {
    "id": "A",
    "title": "Your second brain",
    "module": "2"
  },
  {
    "id": "B",
    "title": "Memory that compounds",
    "module": "3"
  },
  {
    "id": "C",
    "title": "Verification design",
    "module": "4"
  },
  {
    "id": "D",
    "title": "Autonomy without drift",
    "module": "5"
  },
  {
    "id": "E",
    "title": "Security and supply chain",
    "module": "6"
  }
];

export const QUESTIONS: Question[] = [
  {
    "n": 1,
    "part": "A",
    "q": "Your notes live in a notes app, browser tabs, and closed chats. Why keep your second brain as plain-text Markdown files in a folder you own?",
    "options": [
      "Markdown loads faster than other formats",
      "You own the files, and any model you use next year can still read them",
      "Claude Code can't read anything else",
      "It makes the graph view look better"
    ],
    "answer": "B",
    "why": "The files are yours, and the system isn't locked to one tool or model"
  },
  {
    "n": 2,
    "part": "A",
    "q": "You connected Claude to your notes in Obsidian with the Local REST API plugin's key. Which statement is true?",
    "options": [
      "The key only lets Claude read notes",
      "Anyone holding the key can read, write, and delete notes, and run Obsidian commands",
      "The key expires every session",
      "Writing \"never delete notes\" in CLAUDE.md is enough to protect the vault"
    ],
    "answer": "B",
    "why": "The key grants full read, write, and delete access, and lets the holder run Obsidian commands. Protect it with scope, not with instructions"
  },
  {
    "n": 3,
    "part": "A",
    "q": "What's the most reliable way to write the first version of a CLAUDE.md about you?",
    "options": [
      "Copy a popular template from GitHub and change the name",
      "Leave it empty and let Claude infer you from your notes",
      "Have Claude interview you one question at a time, then write the answers into the file",
      "Paste your full CV"
    ],
    "answer": "C",
    "why": "Anthropic recommends having Claude interview you when writing a feature spec. The same method works for your own profile: you know the answers, Claude knows the questions"
  },
  {
    "n": 4,
    "part": "A",
    "q": "You're working on one project in a vault that holds five areas of your life. Claude keeps pulling in unrelated notes. What's the best fix?",
    "options": [
      "Tell Claude to \"focus\" at the start of every message",
      "Give the project its own folder and CLAUDE.md, and work from that folder",
      "Delete the other areas",
      "Switch to a model with a bigger context window"
    ],
    "answer": "B",
    "why": "A project folder with its own context keeps Claude on one job"
  },
  {
    "n": 5,
    "part": "B",
    "q": "Your CLAUDE.md says \"Never edit files in /prod.\" Claude edited one anyway. What's the correct conclusion?",
    "options": [
      "The model is broken. Report a bug",
      "Write the rule in capital letters",
      "CLAUDE.md is advisory context. A rule that must hold needs a hook or a deny rule",
      "Move the rule to the top of the file"
    ],
    "answer": "C",
    "why": "Official docs: \"Claude treats CLAUDE.md files as context, not enforced configuration.\""
  },
  {
    "n": 6,
    "part": "B",
    "q": "Your CLAUDE.md has grown to 600 lines and Claude has started ignoring rules in it. What does Anthropic's documentation recommend?",
    "options": [
      "Split it into three files that all load every session",
      "Prune it. Anthropic's docs recommend keeping each CLAUDE.md under 200 lines, because longer files reduce adherence",
      "Add a line saying \"read every rule carefully\"",
      "Nothing. Longer is better"
    ],
    "answer": "B",
    "why": "Official docs: \"target under 200 lines per CLAUDE.md file. Longer files consume more context and reduce adherence.\""
  },
  {
    "n": 7,
    "part": "B",
    "q": "Claude made the same mistake twice this week. What's the highest-leverage response?",
    "options": [
      "Correct it again in the chat",
      "Add a short rule to CLAUDE.md so every future session knows",
      "Switch models",
      "Start using plan mode for everything"
    ],
    "answer": "B",
    "why": "Boris Cherny: \"Anytime we see Claude do something incorrectly we add it to the CLAUDE.md\""
  },
  {
    "n": 8,
    "part": "B",
    "q": "Claude agrees with almost every plan you propose. What does the research say, and what helps?",
    "options": [
      "That means your plans are good",
      "Agreement is a known behavior of assistant models (sycophancy). Write explicit rules for when and how it should push back",
      "Ask it to be \"more honest\"",
      "Only use it for code, never for decisions"
    ],
    "answer": "B",
    "why": "Sharma et al. (arXiv:2310.13548): \"sycophancy is a general behavior of state-of-the-art AI assistants\""
  },
  {
    "n": 9,
    "part": "C",
    "q": "Anthropic's best practices give it its own section, and the creator of Claude Code called it \"probably the most important thing.\" What is it?",
    "options": [
      "A longer, more detailed prompt",
      "The most expensive model",
      "Giving Claude a way to verify its own work: tests, a build, a screenshot",
      "Plan mode on every task"
    ],
    "answer": "C",
    "why": "Official best practices: \"Give Claude something it can run that comes back pass or fail\"; Boris Cherny: \"probably the most important thing\""
  },
  {
    "n": 10,
    "part": "C",
    "q": "Claude reports: \"All tests pass. Done.\" What's the stronger practice before you accept it?",
    "options": [
      "Ask the same session \"are you sure?\"",
      "Have a fresh session or subagent review it, so the agent that did the work isn't the one grading it",
      "Accept it. Tests passed",
      "Read every line yourself every time"
    ],
    "answer": "B",
    "why": "Official best practices: /code-review \"reviews the diff in a fresh subagent that never saw your conversation. It isn't swayed by the reasoning that produced the code.\""
  },
  {
    "n": 11,
    "part": "C",
    "q": "Your adversarial reviewer subagent returns 30 findings, mostly style. What should you change?",
    "options": [
      "Fix all 30",
      "Turn the reviewer off",
      "Tell it to flag only correctness gaps, because chasing every finding leads to over-engineering",
      "Run two reviewers and keep only the findings they agree on"
    ],
    "answer": "C",
    "why": "Official best practices: \"If you fix every finding, you end up with extra abstraction layers and tests for cases that can't happen.\""
  },
  {
    "n": 12,
    "part": "C",
    "q": "You want a long unattended run to stop only when the work is objectively done. Which statement about `/goal` is true?",
    "options": [
      "Claude decides on its own when the goal is met",
      "A separate evaluator checks the condition after each turn, and it can't run commands, so the evidence must appear in the transcript",
      "`/goal` runs tests automatically",
      "`/goal` keeps running after you close Claude Code"
    ],
    "answer": "B",
    "why": "Official `/goal` documentation"
  },
  {
    "n": 13,
    "part": "D",
    "q": "You start a `/loop` and close the terminal without backgrounding the session. What happens?",
    "options": [
      "It keeps running in the cloud",
      "It stops. Loops run inside the session, and recurring tasks also expire after 30 days",
      "It pauses and resumes next time you open any session",
      "It runs once more and then stops"
    ],
    "answer": "B",
    "why": "Official scheduled-tasks documentation (30 days since v2.1.330; 7 days before that)"
  },
  {
    "n": 14,
    "part": "D",
    "q": "You want a job to run every morning even when your laptop is closed. Which option fits?",
    "options": [
      "`/loop` with a 24-hour interval",
      "A Desktop scheduled task that runs locally",
      "A cloud scheduled task (formerly called a routine; currently a research preview)",
      "A cron task inside your session"
    ],
    "answer": "C",
    "why": "Local scheduled tasks need the app running and the machine awake"
  },
  {
    "n": 15,
    "part": "D",
    "q": "You run five Claude sessions in parallel with git worktrees. What usually becomes the bottleneck?",
    "options": [
      "Disk space",
      "Your ability to review and land the changes",
      "The model's rate limit",
      "Git merge conflicts"
    ],
    "answer": "B",
    "why": "Simon Willison: \"I can only focus on reviewing and landing one significant change at a time\""
  },
  {
    "n": 16,
    "part": "D",
    "q": "You run `claude -p` in CI on pull requests. What does the documentation recommend, and why?",
    "options": [
      "`--verbose`, for better logs",
      "`--bare`, so it doesn't load hooks and MCP servers from a repository you don't trust",
      "Running it in plan mode",
      "Nothing special"
    ],
    "answer": "B",
    "why": "Official headless documentation: `--bare` is recommended for scripted and CI runs"
  },
  {
    "n": 17,
    "part": "E",
    "q": "The Bash sandbox is on. What does it NOT cover?",
    "options": [
      "Shell commands",
      "Child processes started by shell commands",
      "Claude's file tools, MCP servers, and hooks",
      "Network access from shell commands"
    ],
    "answer": "C",
    "why": "Official sandboxing documentation"
  },
  {
    "n": 18,
    "part": "E",
    "q": "You add the allow rule `Bash(git diff*)`. What's the problem?",
    "options": [
      "None",
      "Without a space before `*`, it also matches commands like `git diff-index`",
      "Allow rules don't support wildcards",
      "It also allows `git push`"
    ],
    "answer": "B",
    "why": "Official headless documentation, which uses this exact example"
  },
  {
    "n": 19,
    "part": "E",
    "q": "A popular article tells you to install a second-brain tool with `curl ... | bash`. The tool edits your settings file and runs a background agent that skips permission checks. What should you do?",
    "options": [
      "Install it. It's popular",
      "Install it, then uninstall it if something looks wrong",
      "Read the code first, prefer an install route that doesn't run remote scripts, and record the source, commit, and license",
      "Ask Claude whether it's safe"
    ],
    "answer": "C",
    "why": "Official plugin docs: \"a plugin you install can run code with your user privileges.\" Covered with a real example in Module 6"
  },
  {
    "n": 20,
    "part": "E",
    "q": "Simon Willison's \"lethal trifecta\" names three capabilities that, combined, let an attacker steal your data. Which three?",
    "options": [
      "Internet access, a GPU, and root",
      "Access to private data, exposure to untrusted content, and the ability to communicate externally",
      "MCP, hooks, and skills",
      "Long context, tool use, and memory"
    ],
    "answer": "B",
    "why": "Simon Willison, \"The lethal trifecta for AI agents,\" 2025-06-16"
  }
];

export const ANSWER_KEY = "BBCBCBBBCBCBBCBBCBCB";

export const SCORE_LINE = "Score each part out of 4.";

/** The two notes under the table: the under-8 advice and "don't skip Part C". */
export const NOTES: string[] = [
  "**If your total is under 8 out of 20:** take Anthropic's own courses first (\"Claude Code 101\" and \"Claude Code in Action\" on Anthropic Academy), then come back. You'll get far more out of this program.",
  "**Even if you score well, don't skip Part C.** Verification is the least taught of these skills, and it's the core of this program."
];

export type Scores = Record<PartId, number>;

/** One point per right answer, per part (out of 4). Unanswered counts as wrong. */
export function scoreParts(answers: Partial<Record<number, string>>): Scores {
  const s: Scores = { A: 0, B: 0, C: 0, D: 0, E: 0 };
  for (const q of QUESTIONS) if (answers[q.n] === q.answer) s[q.part] += 1;
  return s;
}

export function totalScore(s: Scores): number {
  return s.A + s.B + s.C + s.D + s.E;
}

/** The module's table: 4 → skim the labs, 3 → read what you missed, 0 to 2 → start here. */
export function adviceFor(score: number): string {
  if (score >= 4) return "Skim this module's Labs and move on";
  if (score === 3) return "Read the lessons you missed";
  return "Start here";
}

/** The first part, in the guide's order, that scored 0 to 2: the module to open first. None if every part scored 3+. */
export function startWith(s: Scores): Part | null {
  return PARTS.find((p) => s[p.id] <= 2) ?? null;
}
