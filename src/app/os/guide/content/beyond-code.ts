// Generated from module-7-beyond-code.md (release/guide) by md2guide.py on 2026-11-28. The words are the module's own;
// edit the markdown and regenerate rather than rewording here.
import type { ModuleContent } from "./types";

export const CONTENT: ModuleContent = {
  "code": "7",
  "slug": "beyond-code",
  "title": "Beyond code: running a business with Claude Code",
  "hero": "TeamHero",
  "lede": [
    "How a two-person company with no outside funding and $375K+ in revenue over the last 12 months runs research, analytics, bookkeeping, content, and decisions with Claude Code.",
    "Every lesson applies Modules 2 to 6 to work that isn't code: the real setup, and the parts that still don't work. Where a lesson needs a document you can copy, we give a short fictional example instead of our internal files."
  ],
  "lessons": [
    {
      "id": "a-team-of-five",
      "code": "7.1",
      "title": "A team of five agents, with one rule that matters",
      "sections": [
        {
          "h": "The setup",
          "blocks": [
            {
              "p": "We run five subagents, each with a narrow job and narrow tools. All five are in the kit under `claude/agents/`, with the company-specific parts replaced by placeholders:"
            },
            {
              "table": {
                "head": [
                  "Agent",
                  "Job",
                  "Hard limits"
                ],
                "rows": [
                  [
                    "engineer",
                    "Bugs, features, code review across our repositories",
                    "Works on a branch; never pushes to production, migrates a database, or touches secrets without approval"
                  ],
                  [
                    "analyst",
                    "Sales, funnel, experiments, content performance",
                    "Read-only on production data"
                  ],
                  [
                    "researcher",
                    "Primary-source research and fact-checking",
                    "Must not verify its own work"
                  ],
                  [
                    "secretary",
                    "Drafts emails and messages, summaries, meeting prep",
                    "Drafts only; never sends"
                  ],
                  [
                    "marketer",
                    "Video scripts, acquisition, copy",
                    "Drafts only; never posts or spends"
                  ]
                ]
              }
            },
            {
              "p": "A sixth file, `verifier.md`, is the independent checker from Module 4."
            },
            {
              "figure": "DraftCheckGraph"
            }
          ]
        },
        {
          "h": "The rule",
          "blocks": [
            {
              "p": "**The agent that writes never checks** (Module 4, Lesson 4.2). The researcher or the verifier checks the others, and neither checks its own work."
            }
          ]
        },
        {
          "h": "Why it works for a business",
          "blocks": [
            {
              "p": "Most of our expensive mistakes would not have been code. They would have been a wrong number in a decision, a false claim in a video, or a contract term misread. Code has tests. Business work needs the verifier."
            }
          ]
        },
        {
          "h": "Limits",
          "blocks": [
            {
              "list": [
                "Five agents is what our work needed, not a target. Anthropic's advice holds here too: \"we recommend finding the simplest solution possible, and only increasing complexity when needed.\" ([Building effective agents](https://www.anthropic.com/research/building-effective-agents))"
              ]
            }
          ]
        },
        {
          "h": "Lab",
          "blocks": [
            {
              "p": "List the work you do that isn't code. For each item, write who drafts it and who checks it. Setup check: nothing that leaves your company is drafted and checked by the same agent."
            }
          ]
        },
        {
          "h": "From the kit",
          "blocks": [
            {
              "p": "`kit/claude/agents/`: copy the five agent files and `kit/claude/agents/verifier.md` to `~/.claude/agents/` or a project's `.claude/agents/`, and fill in the placeholders. Done when each agent's hard limits match your table from the lab."
            }
          ]
        }
      ]
    },
    {
      "id": "analytics-averages-hide-what",
      "code": "7.2",
      "title": "Analytics: averages hide what changed",
      "sections": [
        {
          "h": "The problem we hit",
          "blocks": [
            {
              "p": "One month, our conversion rate looked steady. Split by date, it was two different months: healthy for the first six days, then down to about a quarter of that in the two days after. The average hid a step change. The same day, right after pointing out a unit mistake on our dashboard (eight days of data mixed with monthly figures), Claude made the same mistake itself: it treated eight days of visits as a month's worth. It was one of three errors of the same kind that day."
            },
            {
              "figure": "AverageHides"
            }
          ]
        },
        {
          "h": "What we changed",
          "blocks": [
            {
              "p": "We wrote these as rules in CLAUDE.md, under a section for Claude's own known biases:"
            },
            {
              "list": [
                "**When you see an average, split the period and look for a step.**",
                "**When you point out someone else's unit mistake, re-check your own units.**",
                "**Never state a status as fact.** Write \"not done, as far as my records show,\" because our records always lag reality."
              ]
            },
            {
              "p": "The pattern behind all three: **mistaking the limits of what you can see for the limits of what's true.**"
            }
          ]
        },
        {
          "h": "The experiment ledger",
          "blocks": [
            {
              "p": "Every change to the business (a price, an order form, an email) goes into one experiment ledger: start date, what it should move, how we'll judge it, and status. A skill (Module 2, Lesson 2.4) judges \"did it work?\" from that ledger and live numbers, never from memory. It also checks the ledger before recommending anything, so it doesn't propose what we already tried."
            },
            {
              "p": "A fictional example for a small online shop:"
            },
            {
              "code": "| Start | Change | Should move | Judge by | Result so far | Status |\n|---|---|---|---|---|---|\n| 2026-03-02 | Free shipping over $50 | Average order value | 4 weeks vs. the 4 weeks before | Up, small sample | Running |\n| 2026-03-03 | Shorter checkout form | Checkout completion | Same | Can't be separated from the row above | Running |\n| 2026-01-12 | Review request email on day 7 | Reviews per order | 6 weeks | No change | Stopped |",
              "label": "Experiment ledger (fictional example)"
            },
            {
              "p": "The second row is the useful one: two changes that start a day apart can't be judged separately, and the ledger says so instead of pretending."
            }
          ]
        },
        {
          "h": "Limits",
          "blocks": [
            {
              "list": [
                "A small business has small samples. Many \"verdicts\" are \"not enough data yet,\" and the skill is built to say so."
              ]
            }
          ]
        },
        {
          "h": "Lab",
          "blocks": [
            {
              "p": "Take one metric you report as a monthly average. Split it by week. Setup check: you either find a step and explain it, or confirm there isn't one."
            }
          ]
        }
      ]
    },
    {
      "id": "bookkeeping-do-the-work",
      "code": "7.3",
      "title": "Bookkeeping: do the work, keep the accountant for review",
      "sections": [
        {
          "h": "The setup",
          "blocks": [
            {
              "p": "We decided to do every bookkeeping task we can ourselves and to use our tax adviser only for final review, once a month in one batch."
            },
            {
              "list": [
                "Claude registers transactions in our accounting software through its API, with a human approving each write.",
                "The month-end close is one written procedure that Claude follows, step by step.",
                "A session-start hook reminds us from the first of each month until the close is recorded as done (Module 5, Lesson 5.1).",
                "After the close, the financial statements are updated with actual figures, so my co-founder always sees current numbers."
              ]
            }
          ]
        },
        {
          "h": "Why it works",
          "blocks": [
            {
              "p": "The adviser's time goes to judgment calls, not data entry. Every question we send has already been checked against public guidance, so the monthly batch is short."
            }
          ]
        },
        {
          "h": "What we watch for",
          "blocks": [
            {
              "list": [
                "**Numbers are fetched, never estimated.** Revenue comes from the payment processor's records, not from a calculation.",
                "**Disagreements are reconciled before they're called errors.** When Claude's number disagrees with one from the adviser or from us, it checks every recorded source before saying anything is wrong."
              ]
            }
          ]
        },
        {
          "h": "Example: a month-end procedure for a small online shop",
          "blocks": [
            {
              "p": "This is a fictional example, short on purpose. Yours will name your own tools and accounts."
            },
            {
              "code": "# Month-end close (example)\n\nRun from the 1st of each month. Every write to the books needs my approval.\n\n1. Pull last month's payouts and fees from the payment processor. Show the totals and the query.\n2. Pull last month's bank transactions. Match each one to a payout, an invoice, or a receipt.\n3. List anything unmatched. Don't guess a category: mark it TBD and ask me.\n4. Draft the journal entries for matched items. Show them as a table. Wait for my approval before writing.\n5. Check that every expense has a receipt file. List the missing ones.\n6. Update the profit and loss, cash flow, and balance sheet from the approved entries.\n7. Write the questions for the accountant: only what public guidance can't settle, one list.\n8. Record the month as closed.",
              "label": "Month-end close (fictional example)"
            },
            {
              "figure": "MonthEndGates"
            }
          ]
        },
        {
          "h": "Limits",
          "blocks": [
            {
              "list": [
                "Tax and legal conclusions still need a professional where the rules are unclear. Claude prepares the question; a professional answers it.",
                "Every write to the books needs human approval. That's slower, on purpose."
              ]
            }
          ]
        },
        {
          "h": "Lab",
          "blocks": [
            {
              "p": "Pick one recurring finance task. Write its procedure as a document Claude can follow, with a human approval step for every write. Setup check: the procedure is written down, and every step that writes has a human approval step. Real-world check: Claude completes one cycle and you only approve."
            }
          ]
        }
      ]
    },
    {
      "id": "content-automate-the-pattern",
      "code": "7.4",
      "title": "Content: automate the pattern, measure the result",
      "sections": [
        {
          "h": "The setup",
          "blocks": [
            {
              "p": "We noticed that our short videos followed a repeatable pattern. So we automated it:"
            },
            {
              "list": [
                "A single Python script, with FFmpeg for all video processing.",
                "Every night at midnight, it builds ten candidate videos from our photo and video library.",
                "Claude scores representative frames from 0 to 10 on three criteria that match our brand, returning JSON. Ten clips go to Claude in one call.",
                "A human approves the top three, and only then are they scheduled to post on TikTok through a scheduling service, so the posting itself doesn't need the computer to be awake."
              ]
            }
          ]
        },
        {
          "h": "What still doesn't work (and why we tell you)",
          "blocks": [
            {
              "list": [
                "**The ranking formula has never been checked against actual views.** We pick the \"best\" videos with a score that may not predict performance.",
                "**For one platform, performance data doesn't flow back yet,** so there is no feedback loop."
              ]
            },
            {
              "p": "This is Module 4, Lesson 4.5 in real life: we automated before we verified the checker. The fix on our list is to import each post's results and test whether the score predicts them."
            },
            {
              "figure": "BrokenLoop"
            }
          ]
        },
        {
          "h": "Limits",
          "blocks": [
            {
              "list": [
                "A pattern that works today stops working as audiences change. Automation makes it cheap to keep producing the wrong thing."
              ]
            }
          ]
        },
        {
          "h": "Lab",
          "blocks": [
            {
              "p": "Find one piece of content you make repeatedly. Write down its pattern, and decide how you'd measure whether an automated version performs as well. Setup check: a written metric, before you automate anything."
            }
          ]
        }
      ]
    },
    {
      "id": "decisions-you-can-find",
      "code": "7.5",
      "title": "Decisions you can find again",
      "sections": [
        {
          "h": "The setup",
          "blocks": [
            {
              "p": "Three kinds of notes, never mixed (Module 2, Lesson 2.1):"
            },
            {
              "list": [
                "**Projects/**: only the current state, overwritten. Short enough to read in a minute.",
                "**Decisions/**: one file per decision, with the decision, the reasons, and the options we rejected (template: `templates/decision.md`).",
                "**Logs/**: one line per event in a monthly file, and one file per change or fix: when, what was wrong, how we fixed it, what we checked, and the result (template: `templates/change.md`)."
              ]
            }
          ]
        },
        {
          "h": "Why it matters",
          "blocks": [
            {
              "p": "When we revisit a choice months later, the reasons are in one file. When Claude proposes something that contradicts an earlier decision, it finds the earlier file and says so. Our CLAUDE.md makes that an explicit duty: connect new questions to past decisions and point out contradictions."
            }
          ]
        },
        {
          "h": "An example",
          "blocks": [
            {
              "p": "In October 2026 we changed a rule that we had called absolute: one exception, limited in number and time. It's recorded as a decision with its limits, and the line in CLAUDE.md that states the rule links to it. A future session reading the rule sees the exception and its end date in the same place."
            }
          ]
        },
        {
          "h": "Limits",
          "blocks": [
            {
              "list": [
                "This works only if writing the note is part of finishing the task. Our setup records without asking, then reports what it recorded."
              ]
            }
          ]
        },
        {
          "h": "Lab",
          "blocks": [
            {
              "p": "Write your last three significant decisions as Decision notes. Setup check: each has the reasons and at least one rejected option."
            }
          ]
        },
        {
          "h": "From the kit",
          "blocks": [
            {
              "p": "`kit/templates/decision.md` and `kit/templates/change.md`: keep them in your vault and name them in CLAUDE.md, so Claude uses them for `Decisions/` and `Logs/Changes/`. Done when the lab's three decisions follow the template."
            }
          ]
        }
      ]
    },
    {
      "id": "what-claude-never-does",
      "code": "7.6",
      "title": "What Claude never does for us",
      "sections": [
        {
          "h": "",
          "blocks": [
            {
              "p": "Some lines we don't let Claude cross, whatever the task:"
            },
            {
              "list": [
                "**Nothing goes out unless a human approved it.** Claude drafts emails, messages, and posts. A human sends them, or approves them before they're scheduled (Lesson 7.4).",
                "**It never spends money** without approval, however small the amount.",
                "**It never fills an unknown with a guess.** \"Unknown\" and \"TBD\" are valid answers.",
                "**It never deletes a note.**"
              ]
            },
            {
              "p": "These are in CLAUDE.md and backed, where possible, by permissions and hooks (Module 6). The words state the intent; the permissions enforce it for the actions they cover."
            }
          ]
        }
      ]
    }
  ]
};
