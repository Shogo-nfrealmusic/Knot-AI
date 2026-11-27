// Generated from module-8-your-os.md (release/guide) by md2guide.py on 2026-11-28. The words are the module's own;
// edit the markdown and regenerate rather than rewording here.
import type { ModuleContent } from "./types";

export const CONTENT: ModuleContent = {
  "code": "8",
  "slug": "your-os",
  "title": "Your operating system",
  "hero": "StackHero",
  "lede": [
    "Putting it together, and keeping it working month after month.",
    "Time: one evening to assemble, 30 minutes a month to maintain."
  ],
  "lessons": [
    {
      "id": "assemble-your-setup",
      "code": "8.1",
      "title": "Assemble your setup",
      "sections": [
        {
          "h": "",
          "blocks": [
            {
              "p": "Install the kit's files in this order. Each step builds on the one before."
            },
            {
              "table": {
                "head": [
                  "Step",
                  "What",
                  "From",
                  "Done when"
                ],
                "rows": [
                  [
                    "1",
                    "Vault and folder map",
                    "Module 2, Lesson 2.1",
                    "Claude files a test note in the right folder"
                  ],
                  [
                    "2",
                    "CLAUDE.md from the interview",
                    "Lesson 2.2",
                    "A fresh session states your priority correctly"
                  ],
                  [
                    "3",
                    "\"How to check your work\" section",
                    "Module 4, Lesson 4.1",
                    "The next \"done\" comes with check output"
                  ],
                  [
                    "4",
                    "Verifier subagent",
                    "Lesson 4.2",
                    "It has reviewed one real piece of work"
                  ],
                  [
                    "5",
                    "Sandbox and permission settings",
                    "Module 6, Lesson 6.2",
                    "You can explain every exclusion and allowed domain"
                  ],
                  [
                    "6",
                    "Guard hook and its tests",
                    "Lesson 6.4",
                    "All tests pass"
                  ],
                  [
                    "7",
                    "Skill and plugin ledger",
                    "Lesson 6.3",
                    "Every installed skill is listed with source, commit, and license"
                  ],
                  [
                    "8",
                    "One scheduled task",
                    "Module 5, Lesson 5.1",
                    "It has run three days in a row"
                  ]
                ]
              }
            },
            {
              "p": "Don't install everything at once. A setup you understand beats a bigger one you don't."
            },
            {
              "figure": "AssemblyStack"
            }
          ]
        }
      ]
    },
    {
      "id": "keep-a-failure-log",
      "code": "8.2",
      "title": "Keep a failure log",
      "sections": [
        {
          "h": "Principle",
          "blocks": [
            {
              "p": "**Every mistake Claude makes is either a one-off or a missing rule. Find out which.**"
            }
          ]
        },
        {
          "h": "Implementation",
          "blocks": [
            {
              "p": "When something goes wrong, write one entry:"
            },
            {
              "code": "## YYYY-MM-DD · short title\n- What happened:\n- What Claude saw or assumed:\n- Root cause: missing context / wrong rule / no check / no permission limit\n- Fix: the rule, check, or permission that prevents it\n- Where the fix lives: CLAUDE.md section / hook / settings / skill",
              "label": "Failure log entry"
            },
            {
              "p": "The \"root cause\" line is the important one. It tells you which layer to change:"
            },
            {
              "list": [
                "**Missing context** → CLAUDE.md or memory (Module 3)",
                "**No check** → a check or a verifier (Module 4)",
                "**No permission limit** → settings or a hook (Module 6)"
              ]
            },
            {
              "figure": "RootCauseRouter"
            }
          ]
        },
        {
          "h": "In production",
          "blocks": [
            {
              "p": "Our CLAUDE.md has a section where Claude records its own repeated mistakes. It started when the same kind of error happened three times in one day. Each entry became a rule, and the rules are short enough to read in a minute."
            }
          ]
        }
      ]
    },
    {
      "id": "monthly-maintenance-30-minutes",
      "code": "8.3",
      "title": "Monthly maintenance (30 minutes)",
      "sections": [
        {
          "h": "",
          "blocks": [
            {
              "p": "Once a month:"
            },
            {
              "list": [
                "**Prune CLAUDE.md.** Remove rules that no longer apply and merge duplicates. If it's growing every month, something belongs in a skill or a project folder instead.",
                "**Review the failure log.** Any root cause that appears twice needs a stronger fix: move it from words to a check or a permission.",
                "**Re-audit changed skills and plugins.** Compare each against the commit in your ledger.",
                "**Run the guard's tests.**",
                "**Check usage.** Which work used the most? Is that where the value is?",
                "**Read the release notes** for Claude Code since last month. Features in research preview change."
              ],
              "ordered": true
            },
            {
              "figure": "MonthlyCycle"
            }
          ]
        }
      ]
    },
    {
      "id": "capstone",
      "code": "Capstone",
      "title": "Capstone",
      "sections": [
        {
          "h": "",
          "blocks": [
            {
              "p": "Pick one piece of real work you'd normally do yourself and that takes at least an hour: a report, a feature, a monthly close, a research question."
            },
            {
              "p": "Run it through your full setup:"
            },
            {
              "list": [
                "Claude works from your CLAUDE.md and the right project folder.",
                "It runs the checks you defined.",
                "The verifier reviews the result before you see it.",
                "Nothing irreversible happens without your yes."
              ]
            },
            {
              "p": "**Pass condition:** you accept the result after reading the verifier's report, without redoing the work yourself."
            },
            {
              "p": "That is the point of this program: not a faster assistant, but work you can hand off and trust."
            }
          ]
        }
      ]
    }
  ]
};
