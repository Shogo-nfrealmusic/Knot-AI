// Generated from module-3-memory.md (release/guide) by md2guide.py on 2026-11-28. The words are the module's own;
// edit the markdown and regenerate rather than rewording here.
import type { ModuleContent } from "./types";

export const CONTENT: ModuleContent = {
  "code": "3",
  "slug": "memory",
  "title": "Memory that compounds",
  "hero": "CompoundHero",
  "lede": [
    "Module 2 set up where your memory lives. This module is about what goes into it, and how it stays useful after six months instead of turning into noise.",
    "Time: two evenings, then a few minutes a week."
  ],
  "lessons": [
    {
      "id": "claude-md-is-advice",
      "code": "3.1",
      "title": "CLAUDE.md is advice, not enforcement",
      "sections": [
        {
          "h": "Problem",
          "blocks": [
            {
              "p": "You wrote \"never edit files in /prod\" in CLAUDE.md, and Claude edited one anyway."
            }
          ]
        },
        {
          "h": "Evidence",
          "blocks": [
            {
              "list": [
                "Anthropic's best practices split instructions into two kinds. CLAUDE.md, prompts, and skills are \"Non-deterministic\": \"there's no guarantee.\" Hooks, deny rules, and managed settings are \"Deterministic\": \"Claude Code applies this every time.\" ([Best practices for Claude Code](https://code.claude.com/docs/en/best-practices))",
                "The memory documentation describes CLAUDE.md as context Claude reads, not configuration it is forced to follow. To block an action, it points you to a `PreToolUse` hook. ([Memory](https://code.claude.com/docs/en/memory))"
              ]
            }
          ]
        },
        {
          "h": "Principle",
          "blocks": [
            {
              "p": "**Write context in CLAUDE.md. Write must-never-happen rules in a hook or a permission rule.**"
            }
          ]
        },
        {
          "h": "Implementation",
          "blocks": [
            {
              "p": "Sort every rule in your CLAUDE.md into one of two lists:"
            },
            {
              "table": {
                "head": [
                  "Context (keep in CLAUDE.md)",
                  "Enforcement (move to settings or a hook)"
                ],
                "rows": [
                  [
                    "Goals, priorities, how to talk to you",
                    "Never read `.env` files"
                  ],
                  [
                    "How you make decisions",
                    "Never push to main"
                  ],
                  [
                    "Where notes go",
                    "Never pipe a download into a shell"
                  ],
                  [
                    "What \"done\" means",
                    "Never delete notes"
                  ]
                ]
              }
            },
            {
              "p": "Keep a one-line pointer in CLAUDE.md for each enforced rule (\"pushes to main are blocked; ask me\"), so Claude knows why it got stopped."
            },
            {
              "figure": "AdviceVsEnforcement"
            }
          ]
        },
        {
          "h": "In production",
          "blocks": [
            {
              "p": "Our CLAUDE.md says what needs approval. Our settings and guard hook make sure it actually does (Module 6). When the two disagree, the hook wins, and that's the design."
            }
          ]
        },
        {
          "h": "Limits",
          "blocks": [
            {
              "list": [
                "Hooks only see tool calls. Judgment (\"don't agree with me too easily\") can only live in CLAUDE.md."
              ]
            }
          ]
        },
        {
          "h": "Lab",
          "blocks": [
            {
              "p": "Sort your CLAUDE.md into the two lists. Setup check: every rule in the enforcement list exists in settings or a hook."
            }
          ]
        }
      ]
    },
    {
      "id": "grow-it-from-mistakes",
      "code": "3.2",
      "title": "Grow it from mistakes, prune it before it backfires",
      "sections": [
        {
          "h": "Problem",
          "blocks": [
            {
              "p": "Your CLAUDE.md either stays empty, or grows to hundreds of lines and Claude starts ignoring it."
            }
          ]
        },
        {
          "h": "Evidence",
          "blocks": [
            {
              "list": [
                "Boris Cherny: \"Anytime we see Claude do something incorrectly we add it to the CLAUDE.md\" ([X, 2026-01-02](https://x.com/bcherny/status/2007179840848597422))",
                "Anthropic: \"target under 200 lines per CLAUDE.md file. Longer files consume more context and reduce adherence.\" ([Memory](https://code.claude.com/docs/en/memory))"
              ]
            }
          ]
        },
        {
          "h": "Principle",
          "blocks": [
            {
              "p": "**Add a rule when a mistake repeats. Remove a rule when it stops earning its place.**"
            }
          ]
        },
        {
          "h": "Implementation",
          "blocks": [
            {
              "list": [
                "**Add:** after the second time Claude makes the same kind of mistake, write one short rule. Include the reason in a few words. In our experience, a rule with its reason gets applied more sensibly to cases the rule didn't anticipate.",
                "**Date it:** put the date next to rules that came from an incident. You'll know later which ones are still relevant.",
                "**Move, don't grow:** if a section only matters for one project, move it to that project's CLAUDE.md. If it only matters for one task, make it a skill. Files under `.claude/rules/` with a `paths` setting load only when Claude touches matching files. ([Memory](https://code.claude.com/docs/en/memory#path-specific-rules))",
                "**Prune monthly** (Module 8)."
              ]
            },
            {
              "figure": "LineBudget"
            }
          ]
        },
        {
          "h": "In production",
          "blocks": [
            {
              "p": "Our journal rule is a good example. Claude wrote a late-night journal entry under the wrong date twice. The rule that fixed it is three lines: entries written after midnight belong to the previous day, the reason in the owner's own words, and a note that the mistake happened twice."
            }
          ]
        },
        {
          "h": "Limits",
          "blocks": [
            {
              "list": [
                "Not every mistake needs a rule. A one-off is a one-off."
              ]
            }
          ]
        },
        {
          "h": "Lab",
          "blocks": [
            {
              "p": "Find one mistake Claude made twice. Write the rule with its reason and date. Setup check: the rule is in CLAUDE.md, with its reason and date. Real-world check: it doesn't happen a third time in the next two weeks."
            }
          ]
        }
      ]
    },
    {
      "id": "treat-context-as-a",
      "code": "3.3",
      "title": "Treat context as a budget",
      "sections": [
        {
          "h": "Problem",
          "blocks": [
            {
              "p": "Long sessions get worse: Claude forgets what you said at the start, mixes up tasks, and slows down."
            }
          ]
        },
        {
          "h": "Evidence",
          "blocks": [
            {
              "list": [
                "\"Context, therefore, must be treated as a finite resource with diminishing marginal returns.\" ([Anthropic, Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents))",
                "\"Model performance consistently degrades with increasing input length.\" ([Chroma, Context Rot, 2025](https://www.trychroma.com/research/context-rot))",
                "The docs warn that \"a session that's collected three unrelated tasks re-reads all three on every turn of the fourth,\" and recommend: \"after two failed corrections run `/clear` and write a better prompt instead of a third.\" ([Best practices for Claude Code](https://code.claude.com/docs/en/best-practices))"
              ]
            }
          ]
        },
        {
          "h": "Principle",
          "blocks": [
            {
              "p": "**One task, one context.** Clear between tasks, and send exploration to subagents so its output doesn't fill your main session."
            }
          ]
        },
        {
          "h": "Implementation",
          "blocks": [
            {
              "list": [
                "`/clear` when you switch to an unrelated task.",
                "`/compact <what to keep>` when a long task must continue, for example `/compact keep the API changes and the test commands`. Anything that must survive every session belongs in CLAUDE.md, not only in the chat.",
                "Ask a subagent to search or research, and have it return a short conclusion, not the raw files.",
                "`/btw` for a side question that shouldn't enter the conversation's history."
              ]
            },
            {
              "figure": "ContextBudget"
            }
          ]
        },
        {
          "h": "In production",
          "blocks": [
            {
              "p": "Our research runs go to subagents that return conclusions with sources, not page dumps. The main session keeps the decision, not the reading."
            }
          ]
        },
        {
          "h": "Limits",
          "blocks": [
            {
              "list": [
                "Clearing loses what you didn't write down. Anything worth keeping goes into a note first."
              ]
            }
          ]
        },
        {
          "h": "Lab",
          "blocks": [
            {
              "p": "For one week, `/clear` between every unrelated task. Setup check: today, every unrelated task starts after a `/clear`. Real-world check: after the week, you notice fewer corrections per task."
            }
          ]
        }
      ]
    },
    {
      "id": "build-in-disagreement",
      "code": "3.4",
      "title": "Build in disagreement",
      "sections": [
        {
          "h": "Problem",
          "blocks": [
            {
              "p": "Claude agrees with your plans. It feels good, and it's how you end up executing a bad idea with confidence."
            }
          ]
        },
        {
          "h": "Evidence",
          "blocks": [
            {
              "p": "\"Sycophancy is a general behavior of state-of-the-art AI assistants.\" Five state-of-the-art assistants \"consistently exhibit sycophancy across four varied free-form text-generation tasks.\" (Sharma et al., *Towards Understanding Sycophancy in Language Models*, ICLR 2024, [arXiv:2310.13548](https://arxiv.org/abs/2310.13548)). The paper documents the problem. The countermeasures below are our design, not something the paper tested."
            }
          ]
        },
        {
          "h": "Principle",
          "blocks": [
            {
              "p": "**Tell Claude when to disagree, how to disagree, and which of your biases to watch for.**"
            }
          ]
        },
        {
          "h": "Implementation",
          "blocks": [
            {
              "p": "Add to CLAUDE.md:"
            },
            {
              "code": "## How to disagree with me\n- Don't agree just because I said I like an idea. Check it against my goals, the data, the opportunity cost, and the risks first.\n- When you disagree: say so first, give the reason based on facts or my goals, then offer a better alternative.\n- Separate facts, guesses, and unknowns. Give a confidence level when it matters.\n\n## Stop me when\n1. It's interesting but barely affects my main goal\n2. It doesn't need doing now\n3. I'm starting something new before finishing what's open\n4. Automation has become the goal\n5. I want to build something only because AI makes it possible\n6. I'm spending time on low-leverage work someone or something else could do\n\n## My known biases\n- [Write yours. Ours: perfectionism; attraction to new tech; letting automation become the point]",
              "label": "CLAUDE.md"
            }
          ]
        },
        {
          "h": "In production",
          "blocks": [
            {
              "p": "The six \"stop me when\" patterns above come straight from our own CLAUDE.md. Numbering them gives both sides a short way to refer to a pushback (\"that's pattern 3\") and to accept or overrule it."
            }
          ]
        },
        {
          "h": "Limits",
          "blocks": [
            {
              "list": [
                "Disagreement rules can overcorrect into contrarianism. If Claude pushes back on everything, narrow the triggers.",
                "It's still your decision. Some days the right response to pushback is \"noted, do it anyway.\""
              ]
            }
          ]
        },
        {
          "h": "Lab",
          "blocks": [
            {
              "p": "Add the section. Propose a plan you suspect is weak. Setup check: Claude names the weakness without being asked."
            }
          ]
        },
        {
          "h": "From the kit",
          "blocks": [
            {
              "p": "`kit/vault/CLAUDE.md` already has these three sections (5, 6 and 7). If you started from it, fill in your biases in section 6 instead of adding the sections again. Done when Claude names the weakness in the lab without being asked."
            }
          ]
        }
      ]
    },
    {
      "id": "what-to-remember-and",
      "code": "3.5",
      "title": "What to remember, and what never to",
      "sections": [
        {
          "h": "Problem",
          "blocks": [
            {
              "p": "Memory fills up with things that were true once, and Claude acts on stale facts."
            }
          ]
        },
        {
          "h": "Evidence",
          "blocks": [
            {
              "p": "Claude Code's auto memory loads the first 200 lines or 25KB of its notes each session, per repository, and you can view and edit it with `/memory`. ([Memory](https://code.claude.com/docs/en/memory#auto-memory))"
            }
          ]
        },
        {
          "h": "Principle",
          "blocks": [
            {
              "p": "**Remember what you can't re-derive. Don't store what the code, the history, or a quick lookup already knows.**"
            }
          ]
        },
        {
          "h": "Implementation",
          "blocks": [
            {
              "p": "Four kinds of memory are worth keeping:"
            },
            {
              "table": {
                "head": [
                  "Type",
                  "Example"
                ],
                "rows": [
                  [
                    "About you",
                    "Role, expertise, how you like answers"
                  ],
                  [
                    "Feedback",
                    "\"Don't summarize at the end; I read the diff\""
                  ],
                  [
                    "Project facts not in the code",
                    "Deadlines, constraints, who decides what"
                  ],
                  [
                    "Pointers",
                    "Where the dashboard is, which doc is the source of truth"
                  ]
                ]
              }
            },
            {
              "p": "Never store: things the repository already records (code structure, past fixes, git history), anything that only mattered in one conversation, and secrets."
            },
            {
              "p": "When a memory turns out to be wrong, delete it. A wrong memory is worse than none."
            }
          ]
        },
        {
          "h": "In production",
          "blocks": [
            {
              "p": "Our memory index is a list of one-line pointers: how to read our dashboard, which number formats a client expects, how we want drafts formatted. Each pointer leads to one small file with the fact and the reason. The index stays short enough to load every session."
            }
          ]
        },
        {
          "h": "Limits",
          "blocks": [
            {
              "list": [
                "Memory is a snapshot. When a memory names a file or a setting, Claude should check it still exists before acting on it."
              ]
            }
          ]
        },
        {
          "h": "Lab",
          "blocks": [
            {
              "p": "Read your memory (`/memory`). Delete anything stale or re-derivable. Setup check: everything left is something you'd otherwise have to repeat."
            }
          ]
        }
      ]
    }
  ]
};
