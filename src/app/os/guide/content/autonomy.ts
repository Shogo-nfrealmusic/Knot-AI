// Generated from module-5-autonomy.md (release/guide) by md2guide.py on 2026-11-28. The words are the module's own;
// edit the markdown and regenerate rather than rewording here.
import type { ModuleContent } from "./types";

export const CONTENT: ModuleContent = {
  "code": "5",
  "slug": "autonomy",
  "title": "Autonomy without drift",
  "hero": "ClockHero",
  "lede": [
    "Letting Claude work while you're not watching, and knowing exactly what each tool promises.",
    "Prerequisite: Module 4. Unattended work without a checker is the fastest way to get confident wrong results.",
    "Time: two evenings."
  ],
  "lessons": [
    {
      "id": "know-what-each-scheduler",
      "code": "5.1",
      "title": "Know what each scheduler actually guarantees",
      "sections": [
        {
          "h": "Problem",
          "blocks": [
            {
              "p": "You set up something to \"run every morning\" and discover a week later that it ran twice, or never. The documentation describes three ways to schedule work (cloud scheduled tasks, desktop scheduled tasks, and `/loop`), and `/loop` runs on session-level cron tasks you can also create directly. They fail in different ways."
            }
          ]
        },
        {
          "h": "Evidence",
          "blocks": [
            {
              "p": "From the official documentation ([scheduled tasks](https://code.claude.com/docs/en/scheduled-tasks), [desktop scheduled tasks](https://code.claude.com/docs/en/desktop-scheduled-tasks), [cloud scheduled tasks](https://code.claude.com/docs/en/routines)):"
            },
            {
              "table": {
                "head": [
                  "Tool",
                  "Runs where",
                  "Stops when",
                  "Watch out"
                ],
                "rows": [
                  [
                    "**/loop**",
                    "Inside your current session",
                    "You close the session. Recurring tasks also expire after 30 days (7 days before v2.1.330)",
                    "A self-paced loop isn't restored when you resume the session"
                  ],
                  [
                    "**Session cron**",
                    "Inside your current session",
                    "The session closes. It fires only while Claude Code is open and idle",
                    "If a run is missed while Claude is busy, it fires once when Claude becomes idle, not once per missed interval. Up to 50 per session"
                  ],
                  [
                    "**Desktop scheduled task (local)**",
                    "On your machine, with access to your files",
                    "The app quits or the machine sleeps",
                    "Needs desktop app 1.1.5368 or later. Runs missed while asleep are skipped, with one catch-up run for misses in the last 7 days"
                  ],
                  [
                    "**Cloud scheduled task** (formerly \"routine\")",
                    "Anthropic's cloud",
                    "You delete it",
                    "Research preview. The prompt must be self-contained. All your connected connectors are included by default, and Claude can use them during a run, writes included. Runs start in auto mode, where a classifier model approves or blocks actions"
                  ]
                ]
              }
            },
            {
              "figure": "SchedulerPicker"
            }
          ]
        },
        {
          "h": "Principle",
          "blocks": [
            {
              "p": "**Pick the scheduler by where the work must run and what happens when it doesn't.**"
            }
          ]
        },
        {
          "h": "Implementation",
          "blocks": [
            {
              "list": [
                "Watching something for the next hour (a deploy, a CI run): `/loop`.",
                "A daily job that needs your local files: desktop scheduled task, and keep the machine awake at that time.",
                "A daily job that must run even when your laptop is closed and needs no local files: cloud scheduled task. When you create it, remove every connector it doesn't need, because all connected ones are included by default, writes included."
              ]
            }
          ]
        },
        {
          "h": "In production",
          "blocks": [
            {
              "p": "Our month-end finance work doesn't rely on any scheduler. A session-start hook checks whether last month is recorded as closed. If not, every session reminds Claude until it's done, and then records the month so the reminder stops. That is deliberately boring: it can't silently skip a month, because the reminder only stops when the work is recorded as finished."
            },
            {
              "p": "A minimal version of that idea, as a fictional example for a small online shop:"
            },
            {
              "code": "#!/usr/bin/env python3\n\"\"\"SessionStart hook (example): remind Claude until last month's close is recorded.\"\"\"\nimport datetime, json, os\n\nmarker = os.path.expanduser(\"~/vault/.month-close-done\")   # holds e.g. \"2026-10\"\ntoday = datetime.date.today()\nlast_month = (today.replace(day=1) - datetime.timedelta(days=1)).strftime(\"%Y-%m\")\ndone = open(marker).read().strip() if os.path.exists(marker) else \"\"\nif done < last_month:\n    print(json.dumps({\"hookSpecificOutput\": {\n        \"hookEventName\": \"SessionStart\",\n        \"additionalContext\": f\"The {last_month} month-end close is not recorded as done. \"\n                             \"The procedure is in ~/vault/Procedures/month-end.md. \"\n                             f\"A finished close is recorded by writing {last_month} to ~/vault/.month-close-done.\",\n    }}))",
              "label": "SessionStart hook (fictional example)"
            },
            {
              "p": "Register it under `\"SessionStart\"` in your settings the same way as the Stop hook in Module 4, Lesson 4.4. The docs recommend writing hook context as factual statements, as above, rather than as commands."
            }
          ]
        },
        {
          "h": "Limits",
          "blocks": [
            {
              "list": [
                "Research-preview features can change. Re-check the docs before you depend on one."
              ]
            }
          ]
        },
        {
          "h": "Lab",
          "blocks": [
            {
              "p": "List every recurring job you have. For each one, write where it runs and what happens if it misses a run. Pass condition: no job whose failure you'd only discover by accident."
            }
          ]
        }
      ]
    },
    {
      "id": "parallel-sessions-the-bottleneck",
      "code": "5.2",
      "title": "Parallel sessions: the bottleneck is you",
      "sections": [
        {
          "h": "Problem",
          "blocks": [
            {
              "p": "You start five sessions in parallel and end the day with five half-reviewed changes and a merge mess."
            }
          ]
        },
        {
          "h": "Evidence",
          "blocks": [
            {
              "list": [
                "Boris Cherny: \"I run 5 Claudes in parallel in my terminal.\" ([X, 2026-01-02](https://x.com/bcherny/status/2007179833990885678))",
                "Simon Willison, on the same practice: \"I can only focus on reviewing and landing one significant change at a time\" ([2025-10-05](https://simonwillison.net/2025/Oct/5/parallel-coding-agents/))",
                "Claude Code supports this directly: `claude --worktree <name>` gives each session its own git worktree, and `.worktreeinclude` copies the git-ignored files a worktree needs. Isolation covers file edits and git, not every write a shell command can make. ([Worktrees](https://code.claude.com/docs/en/worktrees))"
              ]
            }
          ]
        },
        {
          "h": "Principle",
          "blocks": [
            {
              "p": "**Run in parallel what you can review in sequence.** Parallel work is cheap; parallel review isn't."
            },
            {
              "figure": "ReviewQueue"
            }
          ]
        },
        {
          "h": "Implementation",
          "blocks": [
            {
              "list": [
                "One worktree per task, named after the task.",
                "Give parallel sessions independent tasks: research, tests, a separate feature. Two sessions editing the same files will collide.",
                "Queue the reviews. Land one change, then the next.",
                "Pair each writer session with a reviewer in a separate session (Module 4, Lesson 4.2)."
              ]
            }
          ]
        },
        {
          "h": "In production",
          "blocks": [
            {
              "p": "We keep worktrees for long-running work, for example a separate worktree for a dashboard feature that takes several days. That lets one session keep working there while another fixes something urgent on the main line."
            }
          ]
        },
        {
          "h": "Limits",
          "blocks": [
            {
              "list": [
                "Every session uses its own share of your plan's quota."
              ]
            }
          ]
        },
        {
          "h": "Lab",
          "blocks": [
            {
              "p": "Run two sessions on two independent tasks in separate worktrees. Pass condition: both land, reviewed, without one breaking the other."
            }
          ]
        }
      ]
    },
    {
      "id": "headless-runs-and-ci",
      "code": "5.3",
      "title": "Headless runs and CI",
      "sections": [
        {
          "h": "Problem",
          "blocks": [
            {
              "p": "You want Claude to review every pull request or run a migration across hundreds of files, without anyone at the keyboard."
            }
          ]
        },
        {
          "h": "Evidence",
          "blocks": [
            {
              "p": "From the official documentation ([headless](https://code.claude.com/docs/en/headless), [GitHub Actions](https://code.claude.com/docs/en/github-actions)):"
            },
            {
              "list": [
                "`claude -p` runs non-interactively. `--output-format json` or `stream-json` gives you machine-readable output.",
                "**`--allowedTools` does not restrict anything.** It lists tools that run without a prompt. The CLI reference says: \"To restrict which tools are available, use `--tools` instead.\" ([CLI reference](https://code.claude.com/docs/en/cli-reference)) Many tutorials get this wrong. Note that `--tools` covers built-in tools only; to keep MCP tools out too, add `--disallowedTools \"mcp__*\"`.",
                "Without `--bare`, `claude -p` loads hooks, skills, MCP servers, and CLAUDE.md from the folder it runs in. In CI, that folder is a repository you may not trust. The docs recommend `--bare` for scripted and CI runs. In bare mode Claude has Bash, file read, and file edit tools, and it doesn't use your subscription login, so it needs an `ANTHROPIC_API_KEY`.",
                "In GitHub Actions: commits made with the default `GITHUB_TOKEN` don't trigger further workflow runs; in public repositories, scheduled workflows are disabled after 60 days without activity; on public repositories, runs triggered by pull requests from forks don't get your secrets."
              ]
            }
          ]
        },
        {
          "h": "Principle",
          "blocks": [
            {
              "p": "**An unattended run gets the smallest set of tools and nothing from the repository it's working on.**"
            }
          ]
        },
        {
          "h": "Implementation",
          "blocks": [
            {
              "p": "Pass the diff in, and give Claude only the tool it needs:"
            },
            {
              "code": "gh pr diff 123 | claude -p --bare \\\n  --tools \"Read\" \\\n  --disallowedTools \"mcp__*\" \\\n  --permission-mode dontAsk \\\n  --output-format json \\\n  \"Review this diff. Report only bugs and security problems, each with an input that triggers it.\"",
              "label": "Terminal or CI"
            },
            {
              "list": [
                "`--tools \"Read\"` limits the built-in tools to reading files. No shell, no edits.",
                "`--permission-mode dontAsk` denies every call that would otherwise wait for a human who isn't there.",
                "`--bare` needs `ANTHROPIC_API_KEY` set as a CI secret."
              ]
            },
            {
              "p": "Start read-only. Add tools only for jobs that need them, and only after the read-only version has run reliably."
            },
            {
              "p": "These flags were checked against the CLI reference in November 2026. Run the Lab once in your own CI before you rely on it."
            },
            {
              "figure": "HeadlessFlags"
            }
          ]
        },
        {
          "h": "In production",
          "blocks": [
            {
              "p": "Our CI enforces the coverage floors from Module 4, Lesson 4.1 on every pull request. We haven't moved Claude's reviews into CI yet: reviews run in a separate session with the verifier, where a human reads the result before anything merges. Read-only CI review is the next step we'd add, and the command above is how we'd start."
            }
          ]
        },
        {
          "h": "Limits",
          "blocks": [
            {
              "list": [
                "Flags and defaults change between versions. Pin the Claude Code version in CI."
              ]
            }
          ]
        },
        {
          "h": "Lab",
          "blocks": [
            {
              "p": "Run one `claude -p --bare --tools \"Read\"` job on a real diff, with `--output-format stream-json --verbose` so every tool call is logged. Pass condition: the log shows no tool other than Read, and the final result is valid JSON."
            }
          ]
        }
      ]
    },
    {
      "id": "loops-that-run-until",
      "code": "5.4",
      "title": "Loops that run until done",
      "sections": [
        {
          "h": "Problem",
          "blocks": [
            {
              "p": "You've seen people run Claude in a loop overnight and wake up to finished projects. You try it and wake up to a mess."
            }
          ]
        },
        {
          "h": "Evidence",
          "blocks": [
            {
              "list": [
                "Geoffrey Huntley, who popularized the pattern: \"In its purest form, Ralph is a Bash loop.\" He also writes: \"There's no way in heck would I use Ralph in an existing code base.\" ([ghuntley.com/ralph, 2025-07-14](https://ghuntley.com/ralph/))",
                "Nicholas Carlini at Anthropic built a C compiler with 16 agents across about 2,000 sessions, at a cost of about $20,000. His conclusion: \"it's important that the task verifier is nearly perfect, otherwise Claude will solve the wrong problem.\" ([Anthropic Engineering, 2026-02-05](https://www.anthropic.com/engineering/building-c-compiler))"
              ]
            }
          ]
        },
        {
          "h": "Principle",
          "blocks": [
            {
              "p": "**A loop is only as good as its stopping condition.** Build the verifier first (Module 4, Lesson 4.5), and point the loop at greenfield work, not at code you can't afford to have rewritten."
            }
          ]
        },
        {
          "h": "Implementation",
          "blocks": [
            {
              "p": "Before any overnight loop, write down three things:"
            },
            {
              "list": [
                "**The stop condition**, as something a script or `/goal` can check.",
                "**The blast radius**: which folder it can touch. Run it in its own worktree.",
                "**The budget**: maximum iterations or maximum spend, after which it stops regardless."
              ],
              "ordered": true
            },
            {
              "figure": "LoopBounds"
            }
          ]
        },
        {
          "h": "In production",
          "blocks": [
            {
              "p": "We don't run unattended loops on our production website, for the reason Huntley gives. Our unattended work is narrow and checked: a nightly video build with a fixed output, and reminders that stop only when a task is recorded as done (Lesson 5.1)."
            }
          ]
        },
        {
          "h": "Limits",
          "blocks": [
            {
              "list": [
                "Long loops are expensive (Lesson 5.5), and a weak checker makes them confidently wrong."
              ]
            }
          ]
        },
        {
          "h": "Lab",
          "blocks": [
            {
              "p": "Run one bounded loop on a small greenfield task with all three written down. Pass condition: it stops on its own condition, not on the budget."
            }
          ]
        }
      ]
    },
    {
      "id": "know-what-it-costs",
      "code": "5.5",
      "title": "Know what it costs",
      "sections": [
        {
          "h": "Problem",
          "blocks": [
            {
              "p": "Your usage limit runs out on Wednesday, and you don't know which work used it."
            }
          ]
        },
        {
          "h": "Evidence",
          "blocks": [
            {
              "p": "From the official [costs documentation](https://code.claude.com/docs/en/costs) and feature docs:"
            },
            {
              "list": [
                "`/usage` shows your plan's usage bars on a subscription, or a session cost if you pay through the API.",
                "Long sessions re-read their whole context on every turn. When the prompt cache expires, the next turn costs more. For the main conversation on a subscription, the cache lasts about an hour; with an API key, through a cloud provider, or while using usage credits, it lasts about five minutes. Subagents get the shorter cache even on a subscription.",
                "Subagents make their own requests, and those draw on your usage too. Agent teams use about 7 times the tokens of a standard session when teammates run in plan mode, per the docs.",
                "For history across sessions, the community tool [ccusage](https://github.com/ccusage/ccusage) (MIT) summarizes token use from local logs."
              ]
            },
            {
              "figure": "CacheWindow"
            }
          ]
        },
        {
          "h": "Principle",
          "blocks": [
            {
              "p": "**Spend on judgment, not on re-reading.** Clear between tasks, delegate searches to subagents, and save big orchestration for work that needs it."
            }
          ]
        },
        {
          "h": "Implementation",
          "blocks": [
            {
              "list": [
                "`/clear` when you switch tasks. It's the biggest single saving.",
                "Send broad searches to a subagent so the results don't bloat your main session.",
                "Check `/usage` at the end of each day for a week. Write down which kind of work used the most."
              ]
            }
          ]
        },
        {
          "h": "In production",
          "blocks": [
            {
              "p": "We estimated our own time on company work from Claude Code's logs over a month. It was more than we had assumed, and it showed which work actually takes our time. That changed how we plan."
            }
          ]
        },
        {
          "h": "Limits",
          "blocks": [
            {
              "list": [
                "Token counts tell you cost, not value. A costly session that prevented a wrong decision was cheap."
              ]
            }
          ]
        },
        {
          "h": "Lab",
          "blocks": [
            {
              "p": "Track usage for one week. Pass condition: you can name the one habit that uses the most, and you've changed it."
            }
          ]
        }
      ]
    }
  ]
};
