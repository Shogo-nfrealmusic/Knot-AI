# Copilot OS Starter

The Claude Code setup two of us use to run a real company. Free version.

I'm Shogo. My co-founder and I run a photo studio business in Tokyo with no other staff. Claude Code handles a lot of the work in between: it reads our booking numbers, drafts our monthly books for our accountant to check, writes and renders short videos overnight, and keeps a written record of every decision we make.

None of that works because of a clever prompt. It works because of a few files that tell Claude who we are, what matters, and how to check its own work. This starter gives you the first three of them, plus a test to see where you stand.

---

## What's inside

| File | What it does | Time |
|---|---|---|
| `prompts/interview.md` | Claude interviews you, one question at a time, and writes your CLAUDE.md from your answers | 15 min |
| `CLAUDE.md` | The template the interview fills in. The same structure we use every day | — |
| `agents/verifier.md` | A second agent that checks the first one's work before you trust it | 2 min |
| `diagnostic.md` | 20 questions that show which parts of your setup are weakest | 10 min |

## Set it up in 15 minutes

1. **Read every file first.** Never install an AI setup you haven't read, including this one. Nothing here downloads anything, sends data anywhere, or runs on install.
2. **Make a folder for your notes** (an Obsidian vault works well) and copy `CLAUDE.md` into it.
3. **Open Claude Code in that folder** and paste the prompt from `prompts/interview.md`. Answer the questions. Leave anything you don't know as TBD.
4. **Start a fresh session** and ask: *"What's my priority this month, and what should you push back on?"* If the answer is wrong, fix the file, not the chat.
5. **Add the verifier.** Copy `agents/verifier.md` to `~/.claude/agents/`. Next time Claude says "done" on something that matters, ask: *"Have the verifier check this."*
6. **Take the diagnostic.** Your weakest part is where to spend your next hour.

## Three rules that do most of the work

1. **Words ask, settings enforce.** A line in CLAUDE.md is advice Claude can ignore. Anything that must never happen (deleting files, pushing to main, spending money) belongs in permissions and hooks.
2. **The agent that did the work doesn't grade it.** A fresh session or a verifier agent catches what the first one talked itself into.
3. **Same mistake twice → one line in CLAUDE.md.** Fix the file once instead of correcting the chat forever. Prune it when it gets long.

## What's in the full Copilot OS

The starter covers memory and a first verifier. The full program covers what free courses don't:

- Verification design: tests and checks Claude runs itself, and reviewers that don't over-engineer
- Unattended runs: scheduled jobs, parallel sessions, costs, and where each one breaks
- Security: a tested guard hook, the sandbox's blind spots, and how to audit third-party skills before installing them
- Work beyond code: research, numbers, bookkeeping and content, with our real setup as the example
- Every file we use, ready to adapt

You'll hear about it first by email.

— Shogo · @copilot_shogo · shogo.build

*For personal and internal business use. Please don't redistribute or resell these files.*
