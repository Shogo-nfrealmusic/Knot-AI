// Generated from module-2-second-brain.md (release/guide) by md2guide.py on 2026-11-28. The words are the module's own;
// edit the markdown and regenerate rather than rewording here.
import type { ModuleContent } from "./types";

export const CONTENT: ModuleContent = {
  "code": "2",
  "slug": "second-brain",
  "title": "Your second brain",
  "hero": "VaultHero",
  "lede": [
    "Obsidian holds what you know. Claude reads it, files new things where they belong, and answers from all of it.",
    "Time: one evening to set up, one week to see it work."
  ],
  "lessons": [
    {
      "id": "own-the-memory",
      "code": "2.1",
      "title": "Own the memory",
      "sections": [
        {
          "h": "Problem",
          "blocks": [
            {
              "p": "Every new chat starts cold. You re-explain your business, your goals, and last week's decisions, and you still forget most of what you once wrote down. The context lives in your head, in closed chats, and in a dozen apps."
            }
          ]
        },
        {
          "h": "Evidence",
          "blocks": [
            {
              "list": [
                "Anthropic recommends writing persistent context into a file instead of re-prompting: \"Claude Code loads CLAUDE.md into every session.\" ([Best practices for Claude Code](https://code.claude.com/docs/en/best-practices))",
                "Andrej Karpathy describes the same pattern for knowledge in general: \"A pattern for building personal knowledge bases using LLMs.\" Instead of retrieving from raw documents at query time, \"the LLM incrementally builds and maintains a persistent wiki.\" ([LLM Wiki, 2026-04-04](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f))"
              ]
            }
          ]
        },
        {
          "h": "Principle",
          "blocks": [
            {
              "p": "**Keep your memory as plain-text files you own. Let the model work on top of it, never inside a format only one vendor can read.**"
            },
            {
              "figure": "FolderMap"
            }
          ]
        },
        {
          "h": "Implementation",
          "blocks": [
            {
              "list": [
                "Install Obsidian and create a vault: one folder on your machine, for example `~/vault/`.",
                "Open that folder in Claude Code. Claude can now read and write the vault as files. You don't need a plugin or an API key for this, and that is the safest setup.",
                "Add the folder map below as the first section of your vault's CLAUDE.md, so Claude knows where each kind of note belongs before it writes anything. (The kit's `vault/CLAUDE.md` already contains it.)"
              ],
              "ordered": true
            },
            {
              "code": "## Where things go (read before writing anything)\n\n| Folder | Holds | Never holds |\n|---|---|---|\n| Inbox/ | Quick captures you haven't sorted yet, one line each | Long text |\n| Projects/ | The current state of each project, overwritten in place | History, logs, analysis |\n| Decisions/ | Why something was decided: decision, reasons, rejected options. One file per decision | What was done |\n| Analysis/ | Why something is the way it is, with data. One file per analysis | Fixes |\n| Logs/Business/ | What happened when: one line per event, one file per month | Long text |\n| Logs/Changes/ | One file per change or fix: when, what was wrong, how it was fixed, what was checked, the result | Decisions without action |\n| Knowledge/ | Reusable knowledge that outlives any one project | Project status |\n| Journal/ | Your own writing. Claude writes here only when you ask | Work logs, AI reports |\n\nIf a note doesn't clearly fit, write one line in Inbox/Inbox.md. Never create new folders without asking.",
              "label": "vault/CLAUDE.md"
            }
          ]
        },
        {
          "h": "In production",
          "blocks": [
            {
              "p": "At my company, this table is the single most important file in the vault. Every agent (engineer, analyst, researcher, secretary, marketer) reads it before writing. The split that pays off most is **state vs. decisions vs. logs**. Project notes hold only what is true now, so they stay short. When we need to know why a price changed months ago, the answer is one file in `Decisions/`, not a search through months of chat."
            }
          ]
        },
        {
          "h": "Limits",
          "blocks": [
            {
              "list": [
                "Files on your disk are only as safe as your disk. Back the vault up.",
                "The table is advisory. Claude follows it because it reads it, not because anything enforces it (see Lesson 2.5)."
              ]
            }
          ]
        },
        {
          "h": "Lab",
          "blocks": [
            {
              "p": "Create the vault and the folder map. Setup check: ask Claude \"Where would you file a note about why we chose our payment provider?\" It answers `Decisions/` and names the file."
            }
          ]
        },
        {
          "h": "From the kit",
          "blocks": [
            {
              "p": "`kit/vault/CLAUDE.md`: copy it to your vault root as `CLAUDE.md`. It already holds the folder map (section 10), with empty sections for Lesson 2.2 to fill. Done when Claude answers the lab's question with `Decisions/`."
            }
          ]
        }
      ]
    },
    {
      "id": "let-claude-interview-you",
      "code": "2.2",
      "title": "Let Claude interview you",
      "sections": [
        {
          "h": "Problem",
          "blocks": [
            {
              "p": "Most people's first CLAUDE.md is either empty or copied from someone else. Both fail. An empty file teaches Claude nothing, and a copied one teaches it about someone else."
            }
          ]
        },
        {
          "h": "Evidence",
          "blocks": [
            {
              "p": "For larger features, Anthropic's best practices recommend having Claude interview you and write a spec, then implementing it in a fresh session. ([Best practices for Claude Code](https://code.claude.com/docs/en/best-practices)) We apply the same method to the file that describes you."
            }
          ]
        },
        {
          "h": "Principle",
          "blocks": [
            {
              "p": "**You know the answers; Claude knows the questions. Let it ask, one question at a time.**"
            }
          ]
        },
        {
          "h": "Implementation",
          "blocks": [
            {
              "p": "Paste this into Claude Code, run from your vault folder (the same prompt is in the kit as `prompts/interview.md`):"
            },
            {
              "code": "Help me write the CLAUDE.md for my second brain.\nAsk me one question at a time and wait for my answer before the next one.\nCover: who I am and what I do; my one goal for this year and how I'll measure it;\nmy current projects and their priority order; how I make decisions; the biases I know I have;\nhow you should talk to me; when you should disagree with me; and what you must never do without asking.\nIf CLAUDE.md already exists in this folder, build on it: keep its headings, and keep the \"Where things go\" section exactly as it is.\nWhen we're done, write the answers into CLAUDE.md at the vault root with clear headings.\nKeep it under 200 lines. Mark anything I didn't answer as TBD instead of guessing.",
              "label": "Prompt · the kit's version is prompts/interview.md"
            },
            {
              "p": "Two lines in that prompt do most of the work:"
            },
            {
              "list": [
                "**\"When you should disagree with me.\"** Without it, you get an assistant that agrees with everything (Module 3, Lesson 3.4).",
                "**\"Mark anything I didn't answer as TBD instead of guessing.\"** A CLAUDE.md that invents facts about you is worse than a short one."
              ]
            }
          ]
        },
        {
          "h": "In production",
          "blocks": [
            {
              "p": "Our CLAUDE.md has sections that came out of exactly these questions: one goal for the year, a ranked project list, \"six patterns where Claude should stop you,\" the biases we know we have, and a permission boundary that separates thinking freely from acting. The \"TBD, don't guess\" rule is written in our file in plain words."
            }
          ]
        },
        {
          "h": "Limits",
          "blocks": [
            {
              "list": [
                "The interview captures who you are today. Re-run parts of it when your goals change.",
                "Longer isn't better. Anthropic's docs say longer CLAUDE.md files reduce adherence. Module 3 covers pruning."
              ]
            }
          ]
        },
        {
          "h": "Lab",
          "blocks": [
            {
              "p": "Run the interview. Setup check: start a fresh session and ask \"What's my priority this month, and what should you push back on?\" The answer matches what you'd say, and the folder map from Lesson 2.1 is still in CLAUDE.md."
            }
          ]
        },
        {
          "h": "From the kit",
          "blocks": [
            {
              "p": "`kit/prompts/interview.md`: paste its prompt into Claude Code, started from your vault folder. Nothing to copy. It fills in the `CLAUDE.md` from Lesson 2.1. Done when every section is filled in or marked TBD, and the folder map is unchanged."
            }
          ]
        }
      ]
    },
    {
      "id": "one-project-one-folder",
      "code": "2.3",
      "title": "One project, one folder",
      "sections": [
        {
          "h": "Problem",
          "blocks": [
            {
              "p": "Your vault holds your whole life. When you work on one project, Claude pulls in notes from five others, and its answers get vague."
            }
          ]
        },
        {
          "h": "Evidence",
          "blocks": [
            {
              "p": "\"Context, therefore, must be treated as a finite resource with diminishing marginal returns.\" ([Anthropic, Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)). Independent research reached the same conclusion: \"model performance consistently degrades with increasing input length.\" ([Chroma, Context Rot, 2025](https://www.trychroma.com/research/context-rot))"
            }
          ]
        },
        {
          "h": "Principle",
          "blocks": [
            {
              "p": "**The big vault plans. A single project folder ships.**"
            }
          ]
        },
        {
          "h": "Implementation",
          "blocks": [
            {
              "p": "Give each project a folder with four subfolders and its own short CLAUDE.md (template in the kit: `project/CLAUDE.md`):"
            },
            {
              "code": "my-project/\n├── CLAUDE.md      what this project is, its one goal, and Claude's role in it\n├── Inputs/        raw material: ideas, notes, research\n├── Process/       work in progress\n├── Outputs/       finished work\n└── Feedback/      results and numbers",
              "label": "One project folder"
            },
            {
              "p": "When you work on the project, start Claude Code from that folder."
            },
            {
              "p": "One detail matters here. Claude Code loads the CLAUDE.md in the folder you start from **and every CLAUDE.md in the folders above it**, plus your personal `~/.claude/CLAUDE.md`. ([Memory](https://code.claude.com/docs/en/memory)) So a project folder inside your vault still pulls in the vault's whole CLAUDE.md. Two ways to keep the project focused:"
            },
            {
              "list": [
                "**Put production projects outside the vault** (for example `~/projects/my-project`), and keep only planning notes in the vault.",
                "Or keep the folder in the vault and use the `claudeMdExcludes` setting to skip the vault-level file for that project."
              ]
            },
            {
              "p": "Your personal `~/.claude/CLAUDE.md` always loads, so keep it to rules that apply everywhere."
            },
            {
              "figure": "LoadCascade"
            }
          ]
        },
        {
          "h": "In production",
          "blocks": [
            {
              "p": "The vault is where we plan: goals, priorities, decisions. Production work happens in separate folders outside the vault, each with its own CLAUDE.md. Our short-video studio is one folder. Its CLAUDE.md holds only what that job needs: the fixed brand rules for captions and face position, the render pipeline, and the checks a video must pass before it ships. When Claude works there, it doesn't see our bookkeeping or our hiring notes, and it doesn't need to."
            }
          ]
        },
        {
          "h": "Limits",
          "blocks": [
            {
              "list": [
                "Cross-project questions (\"which project deserves my time this week?\") belong in the big vault, not in a project folder.",
                "Four folders is a starting shape, not a rule. Rename them to fit your work."
              ]
            }
          ]
        },
        {
          "h": "Lab",
          "blocks": [
            {
              "p": "Create one project folder outside the vault (or exclude the vault's CLAUDE.md). Setup check: from that folder, Claude answers \"what's the goal here?\" in one sentence, without mentioning your other projects."
            }
          ]
        },
        {
          "h": "From the kit",
          "blocks": [
            {
              "p": "`kit/project/CLAUDE.md`: copy it into the project folder as `CLAUDE.md` and fill in the brackets. Done when Claude, started from that folder, states the goal in one sentence."
            }
          ]
        }
      ]
    },
    {
      "id": "repeat-it-twice-make",
      "code": "2.4",
      "title": "Repeat it twice, make it a skill",
      "sections": [
        {
          "h": "Problem",
          "blocks": [
            {
              "p": "You explain how you write a client email, prep a video, or file an expense, again and again."
            }
          ]
        },
        {
          "h": "Evidence",
          "blocks": [
            {
              "p": "Skills are Claude Code's built-in way to save a workflow: a `SKILL.md` file whose description tells Claude when to use it. When a skill doesn't trigger, the documentation's first troubleshooting step is: \"Check the description includes keywords users would naturally say.\" ([Skills documentation](https://code.claude.com/docs/en/skills))"
            }
          ]
        },
        {
          "h": "Principle",
          "blocks": [
            {
              "p": "**The second time you explain a task, save it as a skill.**"
            }
          ]
        },
        {
          "h": "Implementation",
          "blocks": [
            {
              "code": "Turn what I just did into a skill.\nName it after the task, and write a one-sentence description that says exactly when to use it.\nInclude the steps, one finished example, and what \"done\" looks like.\nSave it under .claude/skills/<name>/SKILL.md in this project.",
              "label": "Prompt"
            },
            {
              "p": "Then check the description yourself. If it doesn't name the situation (\"when I ask for a client follow-up email\"), Claude won't know when to use it. The kit's `templates/SKILL.md` is a skeleton you can start from."
            }
          ]
        },
        {
          "h": "In production",
          "blocks": [
            {
              "p": "We kept asking Claude the same question about our main business: \"did that change work?\" A price change, a new booking form, a rewritten email. Each time we explained where the numbers were and how to judge them. Now it's one skill, and its description says exactly when to use it. In generic form:"
            },
            {
              "quote": "\"Use when judging whether a change to the business worked: a price change, a booking-form change, a review request, an email rewrite, a campaign. Also use when asked 'is X working', 'what changed', or 'what should we decide', and before recommending any improvement, to check it was not already tried.\""
            },
            {
              "p": "Two rules inside it matter most. Every verdict starts and ends in our experiment ledger. And the numbers are fetched live, never recalled from memory. The last sentence of the description also stops Claude from recommending something we already tried."
            }
          ]
        },
        {
          "h": "Limits",
          "blocks": [
            {
              "list": [
                "If the YAML header has an error, the skill still loads with empty metadata: `/skill-name` works, but Claude can't match it from your description, so it never triggers on its own. Run with `--debug` to see the parse error, and test the trigger once after you write it.",
                "Skills you didn't write are code you're trusting. Module 6 covers how to audit them."
              ]
            }
          ]
        },
        {
          "h": "Lab",
          "blocks": [
            {
              "p": "Make one skill from a task you did twice this week. Setup check: in a new session, describe the situation in your own words, and Claude uses the skill without being told its name."
            }
          ]
        },
        {
          "h": "From the kit",
          "blocks": [
            {
              "p": "`kit/templates/SKILL.md`: copy it to `.claude/skills/<name>/SKILL.md` in your project, or let the prompt above fill it in. Done when the skill triggers from your own description of the situation."
            }
          ]
        }
      ]
    },
    {
      "id": "keys-not-prompts",
      "code": "2.5",
      "title": "Keys, not prompts",
      "advanced": true,
      "sections": [
        {
          "h": "Problem",
          "blocks": [
            {
              "p": "Writing \"never delete my notes\" in CLAUDE.md feels like a safety setting. It isn't."
            }
          ]
        },
        {
          "h": "Evidence",
          "blocks": [
            {
              "list": [
                "Anthropic's best practices split instructions into two kinds. CLAUDE.md, prompts, and skills are \"Non-deterministic\": \"there's no guarantee.\" Hooks, deny rules, and managed settings are \"Deterministic\": \"Claude Code applies this every time.\" ([Best practices for Claude Code](https://code.claude.com/docs/en/best-practices))",
                "OWASP's guidance for LLM applications: \"Limit the permissions that LLM extensions are granted to other systems to the minimum necessary.\" ([OWASP Top 10 for LLM Applications 2025, LLM06 Excessive Agency](https://genai.owasp.org/llmrisk/llm062025-excessive-agency/))"
              ]
            }
          ]
        },
        {
          "h": "Principle",
          "blocks": [
            {
              "p": "**If a tool can technically delete, send, or pay, assume one day it will. Control it with permissions, not with words.**"
            }
          ]
        },
        {
          "h": "Implementation",
          "blocks": [
            {
              "p": "Most second-brain guides connect Claude to Obsidian like this:"
            },
            {
              "code": "claude mcp add-json obsidian-vault '{\"type\":\"stdio\",\"command\":\"uvx\",\"args\":[\"mcp-obsidian\"],\"env\":{\"OBSIDIAN_API_KEY\":\"<your key>\", ...}}'",
              "label": "The common way: works, with three problems"
            },
            {
              "p": "It works, and it has three problems:"
            },
            {
              "list": [
                "**The key is saved in plain text** in `~/.claude.json` (the default \"local\" scope).",
                "**The server version isn't pinned.** `uvx` installs the latest release the first time and reuses it after that, so you never chose a version.",
                "**The key grants everything**: read, write, delete, and running any Obsidian command. The `mcp-obsidian` server includes a `delete_file` tool."
              ],
              "ordered": true
            },
            {
              "p": "Safer options, from safest:"
            },
            {
              "list": [
                "**Don't use a plugin at all.** Claude Code started inside your vault folder reads and writes the files directly, under your normal permission rules and the sandbox.",
                "**If you need the plugin**, current versions of Local REST API include their own MCP server, so you don't need `mcp-obsidian`. Put the connection in a project `.mcp.json` and reference the key as an environment variable, so the key isn't written into the file:"
              ]
            },
            {
              "code": "{\n  \"mcpServers\": {\n    \"obsidian\": {\n      \"type\": \"http\",\n      \"url\": \"https://127.0.0.1:27124/mcp/\",\n      \"headers\": { \"Authorization\": \"Bearer ${OBSIDIAN_API_KEY}\" }\n    }\n  }\n}",
              "label": ".mcp.json"
            },
            {
              "p": "We haven't tested this connection against the plugin's self-signed certificate. If Claude Code refuses to connect, use the first option: no plugin at all."
            },
            {
              "list": [
                "**If you keep `mcp-obsidian`**, pin the version: `uvx mcp-obsidian@0.2.3`."
              ]
            },
            {
              "p": "For live data like your calendar, use read-only access. The Google Workspace server supports it directly. It needs your own Google OAuth client, set as the environment variables `GOOGLE_OAUTH_CLIENT_ID` and `GOOGLE_OAUTH_CLIENT_SECRET` (see the server's README). Note the `--`, which separates Claude Code's options from the server's:"
            },
            {
              "code": "claude mcp add --transport stdio google-workspace -- uvx workspace-mcp@2.1.0 --tools calendar --read-only",
              "label": "Terminal"
            },
            {
              "figure": "KeyReach"
            }
          ]
        },
        {
          "h": "In production",
          "blocks": [
            {
              "p": "Our setup has three layers, and none of them depends on Claude remembering a rule:"
            },
            {
              "list": [
                "**The sandbox.** Shell commands can write only to listed folders and reach only listed domains.",
                "**A guard hook that runs before every tool call.** It blocks access to credential stores, printing `.env` files, commands that print tokens, and download-and-execute patterns. In October 2026 we rebuilt its download-and-execute check to read a command's structure instead of matching text. The old version refused harmless commands that merely searched for the text \"curl | sh\", and it let real attacks such as `wget ... | sudo -u root bash` through. The rebuilt guard is the one in the kit, and its test suite (20 harmless commands, 33 real attacks, plus other rules) passes in full.",
                "**A short \"ask first\" list.** Merging a pull request, pushing to the main branch, deploying, spending money, sending email or posts, and changing Claude's own settings always need a human yes. Everything else up to opening a pull request runs without prompts."
              ],
              "ordered": true
            }
          ]
        },
        {
          "h": "Limits",
          "blocks": [
            {
              "list": [
                "The sandbox covers shell commands only. Claude's file tools, MCP servers, and hooks run outside it (Module 6).",
                "An environment variable is better than a key in a file. It still isn't a secrets manager.",
                "Read-only access stops a connection from writing or deleting. It doesn't stop what it read from leaving through another tool in the same session, such as a web request (Lesson 6.1).",
                "A guard that passes its own test suite handles the cases in that suite. It doesn't prove there is no bypass nobody has tested yet."
              ]
            }
          ]
        },
        {
          "h": "Lab",
          "blocks": [
            {
              "p": "List every connection your Claude setup has (`claude mcp list`). For each one, write down what it can read, write, and delete. Setup check: nothing can delete or send that doesn't need to."
            }
          ]
        },
        {
          "h": "From the kit",
          "blocks": [
            {
              "p": "`kit/claude/hooks/security-guard.py` is the guard described above. Install it in Lesson 6.4, not here. Done when you know which of your connections the guard and the sandbox cover, and which they don't."
            }
          ]
        }
      ]
    },
    {
      "id": "let-it-maintain-itself",
      "code": "2.6",
      "title": "Let it maintain itself",
      "sections": [
        {
          "h": "Problem",
          "blocks": [
            {
              "p": "A second brain that you have to tidy by hand stops being used within a month."
            }
          ]
        },
        {
          "h": "Evidence",
          "blocks": [
            {
              "p": "Claude Code can run prompts on a schedule. Local scheduled tasks run on your machine with access to your files, but only while the app is running and the computer is awake. Cloud scheduled tasks (formerly called routines) run without your machine and are currently a research preview. ([Desktop scheduled tasks](https://code.claude.com/docs/en/desktop-scheduled-tasks), [Cloud scheduled tasks](https://code.claude.com/docs/en/routines))"
            }
          ]
        },
        {
          "h": "Principle",
          "blocks": [
            {
              "p": "**Schedule the boring part: filing, linking, and flagging what's gone stale.**"
            }
          ]
        },
        {
          "h": "Implementation",
          "blocks": [
            {
              "p": "In the desktop app (version 1.1.5368 or later): open the Code tab, click Scheduled in the sidebar, then New task, and under Advanced settings turn on \"Only on this computer\" so it runs locally with your files. (Older versions show Routines, then New routine, then Local.) Point it at your vault and use a prompt like this (also in the kit as `prompts/daily-routine.md`):"
            },
            {
              "code": "Every morning at 7:00:\n1. File each note in Inbox/ into the right folder, using the table in CLAUDE.md. If unsure, leave it.\n2. Add links between new notes and existing ones only where the link would help me find or decide something.\n3. List project notes not updated in 30 days.\n4. Write a 3-line summary of what changed since yesterday at the top of Inbox/Inbox.md.\nNever delete or rename a note.",
              "label": "Prompt · also in the kit as prompts/daily-routine.md"
            },
            {
              "figure": "RoutineClock"
            }
          ]
        },
        {
          "h": "In production",
          "blocks": [
            {
              "p": "Several small routines keep our vault running without anyone remembering to do it:"
            },
            {
              "list": [
                "**Month-end reminder.** From the first of each month, a session-start hook reminds Claude that last month's recurring finance work isn't recorded as finished, until it is. When the work is done, Claude records the month so the reminder stops.",
                "**Progress sync for my co-founder.** New lines in the business log are copied to the team's Notion so my co-founder sees progress without reading the vault. The log can contain text that came from outside (web pages, emails, tool output), so the sync passes those lines as data only, inside a delimiter that changes every time, and never as instructions. That makes injected text harder to pass off as an instruction. It doesn't make it impossible (Lesson 6.1).",
                "**Friction log.** Once a day, Claude asks what slowed us down. Repeated friction is where new tools and products come from.",
                "**Morning brief.** A short summary of what changed and what needs a decision today."
              ]
            }
          ]
        },
        {
          "h": "Limits",
          "blocks": [
            {
              "list": [
                "\"Never delete\" in the prompt is a request, not a guarantee (Lesson 2.5). Back up the vault before the first scheduled run.",
                "Runs missed while the machine sleeps are skipped. When the app starts again, it makes exactly one catch-up run for the most recent missed time within the last 7 days, not one per missed day."
              ]
            }
          ]
        },
        {
          "h": "Lab",
          "blocks": [
            {
              "p": "Schedule one daily routine. Setup check: the task is listed under Scheduled with \"Only on this computer\" turned on, and you have a backup of the vault. Real-world check: after three days, every note in Inbox/ other than Inbox.md has been filed or left for you to sort, and the summaries at the top of Inbox.md are correct."
            }
          ]
        },
        {
          "h": "From the kit",
          "blocks": [
            {
              "p": "`kit/prompts/daily-routine.md`: paste its prompt into the new scheduled task. Nothing to copy into the vault. Done when the task is saved, pointed at your vault, and set to run on this computer."
            }
          ]
        }
      ]
    },
    {
      "id": "community-resources",
      "code": "Community resources",
      "title": "Community resources",
      "sections": [
        {
          "h": "",
          "blocks": [
            {
              "p": "Use them as reference, not as installers. Read before you run anything."
            },
            {
              "table": {
                "head": [
                  "Repository",
                  "What it is",
                  "Note"
                ],
                "rows": [
                  [
                    "[AgriciDaniel/claude-obsidian](https://github.com/AgriciDaniel/claude-obsidian)",
                    "Claude Code plugin based on Karpathy's pattern (MIT)",
                    "No serious concerns found in our review (2026-10-15)"
                  ],
                  [
                    "[eugeniughelbur/obsidian-second-brain](https://github.com/eugeniughelbur/obsidian-second-brain)",
                    "47 commands across eight platforms, per its README (MIT)",
                    "Used as the worked example in Module 6: its quick install pipes a remote script to bash, edits your Claude settings, and offers an agent that skips permission checks"
                  ],
                  [
                    "[coleam00/second-brain-starter](https://github.com/coleam00/second-brain-starter)",
                    "A skill that writes a plan for your own second brain",
                    "No license file, so reuse rights are unclear"
                  ]
                ]
              }
            }
          ]
        }
      ]
    }
  ]
};
