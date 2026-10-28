# Copilot OS · Diagnostic

> 20 questions, about 10 minutes. Pick one answer for each. There is no time limit and nothing is sent anywhere.
> The answers and the scoring guide are at the end. Don't look until you've finished.

---

## Part A · Your second brain (Module 1A)

**1.** Your notes live in a notes app, browser tabs, and closed chats. Why keep your second brain as plain-text Markdown files in a folder you own?

- A. Markdown loads faster than other formats
- B. You own the files, and any model you use next year can still read them
- C. Claude Code can't read anything else
- D. It makes the graph view look better

**2.** You connected Claude to your Obsidian vault with the Local REST API plugin's key. Which statement is true?

- A. The key only lets Claude read notes
- B. Anyone holding the key can read, write, and delete notes, and run Obsidian commands
- C. The key expires every session
- D. Writing "never delete notes" in CLAUDE.md is enough to protect the vault

**3.** What's the most reliable way to write the first version of a CLAUDE.md about you?

- A. Copy a popular template from GitHub and change the name
- B. Leave it empty and let Claude infer you from your notes
- C. Have Claude interview you one question at a time, then write the answers into the file
- D. Paste your full CV

**4.** You're working on one project in a vault that holds five areas of your life. Claude keeps pulling in unrelated notes. What's the best fix?

- A. Tell Claude to "focus" at the start of every message
- B. Give the project its own folder and CLAUDE.md, and work from that folder
- C. Delete the other areas
- D. Switch to a model with a bigger context window

## Part B · Memory that compounds (Module 1)

**5.** Your CLAUDE.md says "Never edit files in /prod." Claude edited one anyway. What's the correct conclusion?

- A. The model is broken. Report a bug
- B. Write the rule in capital letters
- C. CLAUDE.md is advisory context. A rule that must hold needs a hook or a deny rule
- D. Move the rule to the top of the file

**6.** Your CLAUDE.md has grown to 600 lines and Claude has started ignoring rules in it. What does Anthropic's documentation recommend?

- A. Split it into three files that all load every session
- B. Prune it. Anthropic's docs recommend keeping each CLAUDE.md under 200 lines, because longer files reduce adherence
- C. Add a line saying "read every rule carefully"
- D. Nothing. Longer is better

**7.** Claude made the same mistake twice this week. What's the highest-leverage response?

- A. Correct it again in the chat
- B. Add a short rule to CLAUDE.md so every future session knows
- C. Switch models
- D. Start using plan mode for everything

**8.** Claude agrees with almost every plan you propose. What does the research say, and what helps?

- A. That means your plans are good
- B. Agreement is a known behavior of assistant models (sycophancy). Write explicit rules for when and how it should push back
- C. Ask it to be "more honest"
- D. Only use it for code, never for decisions

## Part C · Verification design (Module 2)

**9.** Anthropic's best practices give it its own section, and the creator of Claude Code called it "probably the most important thing." What is it?

- A. A longer, more detailed prompt
- B. The most expensive model
- C. Giving Claude a way to verify its own work: tests, a build, a screenshot
- D. Plan mode on every task

**10.** Claude reports: "All tests pass. Done." What's the stronger practice before you accept it?

- A. Ask the same session "are you sure?"
- B. Have a fresh session or subagent review it, so the agent that did the work isn't the one grading it
- C. Accept it. Tests passed
- D. Read every line yourself every time

**11.** Your adversarial reviewer subagent returns 30 findings, mostly style. What should you change?

- A. Fix all 30
- B. Turn the reviewer off
- C. Tell it to flag only correctness gaps, because chasing every finding leads to over-engineering
- D. Run two reviewers and keep only the findings they agree on

**12.** You want a long unattended run to stop only when the work is objectively done. Which statement about `/goal` is true?

- A. Claude decides on its own when the goal is met
- B. A separate evaluator checks the condition after each turn, and it can't run commands, so the evidence must appear in the transcript
- C. `/goal` runs tests automatically
- D. `/goal` keeps running after you close Claude Code

## Part D · Autonomy without drift (Module 3)

**13.** You start a `/loop` and close the terminal without backgrounding the session. What happens?

- A. It keeps running in the cloud
- B. It stops. Loops run inside the session, and recurring tasks also expire after 7 days
- C. It pauses and resumes next time you open any session
- D. It runs once more and then stops

**14.** You want a job to run every morning even when your laptop is closed. Which option fits?

- A. `/loop` with a 24-hour interval
- B. A Desktop scheduled task that runs locally
- C. A cloud scheduled task (formerly called routines; currently a research preview)
- D. A cron task inside your session

**15.** You run five Claude sessions in parallel with git worktrees. What usually becomes the bottleneck?

- A. Disk space
- B. Your ability to review and land the changes
- C. The model's rate limit
- D. Git merge conflicts

**16.** You run `claude -p` in CI on pull requests. What does the documentation recommend, and why?

- A. `--verbose`, for better logs
- B. `--bare`, so it doesn't load hooks and MCP servers from a repository you don't trust
- C. Running it in plan mode
- D. Nothing special

## Part E · Security and supply chain (Module 4)

**17.** The Bash sandbox is on. What does it NOT cover?

- A. Shell commands
- B. Child processes started by shell commands
- C. Claude's file tools, MCP servers, and hooks
- D. Network access from shell commands

**18.** You add the allow rule `Bash(git diff*)`. What's the problem?

- A. None
- B. Without a space before `*`, it also matches commands like `git diff-index`
- C. Allow rules don't support wildcards
- D. It also allows `git push`

**19.** A popular article tells you to install a second-brain tool with `curl ... | bash`. The tool edits your settings file and runs a background agent that skips permission checks. What should you do?

- A. Install it. It's popular
- B. Install it, then uninstall it if something looks wrong
- C. Read the code first, prefer an install route that doesn't run remote scripts, and record the source, commit, and license
- D. Ask Claude whether it's safe

**20.** Simon Willison's "lethal trifecta" names three capabilities that, combined, let an attacker steal your data. Which three?

- A. Internet access, a GPU, and root
- B. Access to private data, exposure to untrusted content, and the ability to communicate externally
- C. MCP, hooks, and skills
- D. Long context, tool use, and memory

---

## Answers

| Q | Answer | Why |
|---|---|---|
| 1 | B | The files are yours, and the system isn't locked to one tool or model |
| 2 | B | The key grants full read, write, and delete access, and lets the holder run Obsidian commands. Protect it with scope, not with instructions |
| 3 | C | Anthropic recommends having Claude interview you when writing a feature spec. The same method works for your own profile: you know the answers, Claude knows the questions |
| 4 | B | A project folder with its own context keeps Claude on one job |
| 5 | C | Official docs: "Claude treats CLAUDE.md files as context, not enforced configuration." |
| 6 | B | Official docs: "target under 200 lines per CLAUDE.md file. Longer files consume more context and reduce adherence." |
| 7 | B | Boris Cherny: "Anytime we see Claude do something incorrectly we add it to the CLAUDE.md" |
| 8 | B | Sharma et al. (arXiv:2310.13548): "sycophancy is a general behavior of state-of-the-art AI assistants" |
| 9 | C | Official best practices, "Give Claude a check to run"; Boris Cherny: "probably the most important thing" |
| 10 | B | Official docs: /code-review "reviews the diff in a fresh subagent that never saw your conversation. It isn't swayed by the reasoning that produced the code." |
| 11 | C | Official docs warn that chasing every review finding leads to over-engineering |
| 12 | B | Official `/goal` documentation |
| 13 | B | Official scheduled-tasks documentation |
| 14 | C | Local scheduled tasks need the app running and the machine awake |
| 15 | B | Simon Willison: "I can only focus on reviewing and landing one significant change at a time" |
| 16 | B | Official headless documentation |
| 17 | C | Official sandboxing documentation |
| 18 | B | Official headless documentation, which uses this exact example |
| 19 | C | Official plugin docs: "a plugin you install can run code with your user privileges." Covered with a real example in Module 4 |
| 20 | B | Simon Willison, "The lethal trifecta for AI agents," 2025-06-16 |

## Your starting point

Score each part out of 4.

| Part score | What it means |
|---|---|
| 4 | Skim this module's Labs and move on |
| 3 | Read the lessons you missed |
| 0 to 2 | Start here |

**If your total is under 8 out of 20:** take Anthropic's own courses first ("Claude Code 101" and "Claude Code in Action" on Anthropic Academy), then come back. You'll get far more out of this program.

**Even if you score well, don't skip Part C.** Verification is the least taught of these skills, and it's the core of this program.

---
