// Generated from module-4-verification.md (release/guide) by md2guide.py on 2026-11-28. The words are the module's own;
// edit the markdown and regenerate rather than rewording here.
import type { ModuleContent } from "./types";

export const CONTENT: ModuleContent = {
  "code": "4",
  "slug": "verification",
  "title": "Verification design",
  "hero": "WriterCheckerHero",
  "lede": [
    "The core of this program. Everything else assumes you can answer one question: when Claude says it's done, how do you know?",
    "Time: two to three evenings."
  ],
  "lessons": [
    {
      "id": "give-claude-a-check",
      "code": "4.1",
      "title": "Give Claude a check it can run",
      "sections": [
        {
          "h": "Problem",
          "blocks": [
            {
              "p": "Claude finishes a task and tells you it works. You either read every line yourself, which doesn't scale, or you trust it, which eventually costs you."
            }
          ]
        },
        {
          "h": "Evidence",
          "blocks": [
            {
              "list": [
                "Anthropic's best practices: \"Give Claude something it can run that comes back pass or fail.\" Their examples: a test file, a build's exit code, a linter, a script that diffs output against a fixture, a browser screenshot next to the mockup. ([Best practices for Claude Code](https://code.claude.com/docs/en/best-practices))",
                "Boris Cherny, who created Claude Code, called it \"probably the most important thing to get great results out of Claude Code -- give Claude a way to verify\" ([X, 2026-01-02](https://x.com/bcherny/status/2007179861115511237)). In the same post he estimates it improves quality 2 to 3 times. That figure is his own estimate, not a measurement."
              ]
            }
          ]
        },
        {
          "h": "Principle",
          "blocks": [
            {
              "p": "**Before you ask for the work, decide how the work will be checked, and give Claude that check.**"
            }
          ]
        },
        {
          "h": "Implementation",
          "blocks": [
            {
              "p": "Add a section like this to your CLAUDE.md, and fill in the commands for your project:"
            },
            {
              "code": "## How to check your work\n- Code: run `npm test` and `npm run build`. Both must pass before you say \"done\".\n- UI: start the dev server, open the page, take a screenshot, and compare it with the design.\n- Data or numbers: show the query and the raw result, not just the conclusion.\n- Writing that cites facts: link the primary source for every number.\nIf you can't run a check, say so and say which one. Never report \"done\" without the check's output.",
              "label": "CLAUDE.md"
            },
            {
              "p": "The last line matters most. It changes \"done\" from a claim into evidence you can see."
            },
            {
              "figure": "DoneWithEvidence"
            }
          ]
        },
        {
          "h": "In production",
          "blocks": [
            {
              "p": "Our website takes payments by card. A bug in payment code costs real money, so payment code has the strictest check: the CI build fails if test coverage of the payment code drops below a floor set just under its current level. We raise the floor as tests are added. A browser test also runs a purchase from start to finish. Claude can run both, so it finds its own mistakes before we review."
            }
          ]
        },
        {
          "h": "Limits",
          "blocks": [
            {
              "list": [
                "A check only covers what it checks. Passing tests prove the tested paths work, not the product.",
                "Some work has no runnable check (a strategy, a tone of voice). Lesson 4.2 covers what to do instead."
              ]
            }
          ]
        },
        {
          "h": "Lab",
          "blocks": [
            {
              "p": "Write the \"How to check your work\" section for one project. Setup check: the section is in the project's CLAUDE.md, and the next \"done\" comes with the check's output. Real-world check: for the next five tasks, every \"done\" comes with the check's output."
            }
          ]
        },
        {
          "h": "From the kit",
          "blocks": [
            {
              "p": "`kit/vault/CLAUDE.md` has this section (11) with blanks for your commands, and `kit/project/CLAUDE.md` has one for a single project. Fill in your own commands. Done when the next \"done\" comes with the check's output."
            }
          ]
        }
      ]
    },
    {
      "id": "the-one-who-writes",
      "code": "4.2",
      "title": "The one who writes doesn't grade",
      "sections": [
        {
          "h": "Problem",
          "blocks": [
            {
              "p": "You ask Claude \"are you sure?\" and it says yes. Asking the same session to check its own work mostly gets you a confident repeat of the same answer."
            }
          ]
        },
        {
          "h": "Evidence",
          "blocks": [
            {
              "list": [
                "Research on self-correction: \"LLMs struggle to self-correct their responses without external feedback,\" and \"at times, their performance even degrades after self-correction.\" (Huang et al., *Large Language Models Cannot Self-Correct Reasoning Yet*, ICLR 2024, [arXiv:2310.01798](https://arxiv.org/abs/2310.01798)). The study covers reasoning tasks without outside feedback. It shows that self-checking is unreliable; it doesn't measure how much a separate reviewer helps.",
                "Anthropic's best practices recommend a reviewer that starts fresh: the built-in `/code-review` \"reviews the diff in a fresh subagent that never saw your conversation. It isn't swayed by the reasoning that produced the code.\" ([Best practices for Claude Code](https://code.claude.com/docs/en/best-practices))"
              ]
            }
          ]
        },
        {
          "h": "Principle",
          "blocks": [
            {
              "p": "**Separate the writer from the checker. The checker starts from a fresh context and uses primary sources, not the writer's summary.**"
            },
            {
              "figure": "FreshReviewer"
            }
          ]
        },
        {
          "h": "Implementation",
          "blocks": [
            {
              "p": "Create a reviewer subagent at `.claude/agents/verifier.md` (the kit has a fuller version at `claude/agents/verifier.md`):"
            },
            {
              "code": "---\nname: verifier\ndescription: Independent checker. Use after any work that will be published, merged, or used for a decision. Must not check its own work.\ntools: Read, Grep, Glob, Bash, WebFetch\n---\n\nYou check other agents' work. You did not write it, and you look for errors, not reasons to pass.\n\n- Read the original sources yourself: the code, the test output, the official docs, the original post. Never rely on the writer's summary.\n- For every claim, report: CONFIRMED (with the source and a verbatim quote), WRONG (with the correct value), or UNVERIFIABLE.\n- Any unresolved mismatch means FAIL.\n- Report only problems that change the result. Don't list style preferences.",
              "label": ".claude/agents/verifier.md"
            },
            {
              "p": "Then make it a habit: anything that leaves your machine (a merge, a published page, a number in a decision) goes through the verifier first."
            }
          ]
        },
        {
          "h": "In production",
          "blocks": [
            {
              "p": "We use this for research as much as for code. Three examples from one week in October 2026:"
            },
            {
              "list": [
                "**Three AI models proposed business ideas.** The verifier checked each against primary sources. All three rested on \"there's little competition,\" and all three were wrong. One cited competitors that were actually a consultancy and a product it couldn't find at all.",
                "**A popular second-brain tutorial.** The verifier checked its claims, and most failed: a setup command that doesn't run as written, an API key stored in plain text, outdated menu names, and a wrong feature count.",
                "**Our own citations for this program.** The verifier rejected several of the sources first proposed for these lessons, including a well-known paper that doesn't actually support the claim it was attached to. Its review of the first draft also caught a CI flag that doesn't restrict tools, a hook that doesn't fail closed by default, and CLAUDE.md files that load from parent folders. All were fixed before publishing. Only checked sources appear here."
              ]
            }
          ]
        },
        {
          "h": "Limits",
          "blocks": [
            {
              "list": [
                "The verifier can be wrong too. It reduces errors; it doesn't remove your responsibility for the decision.",
                "It costs another model run. Use it where an error is expensive, not on every small edit."
              ]
            }
          ]
        },
        {
          "h": "Lab",
          "blocks": [
            {
              "p": "Add the verifier. Run it on the last thing Claude told you was \"done.\" Setup check: you can name one thing it found, or explain why there was nothing to find."
            }
          ]
        },
        {
          "h": "From the kit",
          "blocks": [
            {
              "p": "`kit/claude/agents/verifier.md`: copy it to `.claude/agents/verifier.md` in your project, or to `~/.claude/agents/` to use it everywhere. Done when it has reviewed one real piece of work."
            }
          ]
        }
      ]
    },
    {
      "id": "tune-the-reviewer-or",
      "code": "4.3",
      "title": "Tune the reviewer, or it will over-engineer",
      "sections": [
        {
          "h": "Problem",
          "blocks": [
            {
              "p": "You add an adversarial reviewer and it returns thirty findings, most of them style. You fix them all, and the code gets worse."
            }
          ]
        },
        {
          "h": "Evidence",
          "blocks": [
            {
              "p": "Anthropic's best practices: \"A reviewer that's asked to find problems will always find something. If you fix every finding, you end up with extra abstraction layers and tests for cases that can't happen.\" Their suggested review prompt asks it to report gaps that affect correctness and skip style. ([Best practices for Claude Code](https://code.claude.com/docs/en/best-practices))"
            }
          ]
        },
        {
          "h": "Principle",
          "blocks": [
            {
              "p": "**Tell the reviewer what counts as a finding. Correctness, security, and requirement gaps count. Taste doesn't.**"
            }
          ]
        },
        {
          "h": "Implementation",
          "blocks": [
            {
              "p": "Give every review request a severity bar (also in the kit as `prompts/review.md`):"
            },
            {
              "code": "Review this diff in a fresh context.\nReport only:\n1. Bugs: wrong output, crashes, data loss\n2. Security problems\n3. Requirements in the task that the diff doesn't meet\nFor each finding, give a concrete input that triggers it. If you can't, don't report it.\nIgnore naming, formatting, and style preferences.",
              "label": "Prompt · also in the kit as prompts/review.md"
            },
            {
              "p": "\"Give a concrete input that triggers it\" is the filter that works. Real bugs come with a reproduction; preferences don't."
            },
            {
              "figure": "SeverityBar"
            }
          ]
        },
        {
          "h": "In production",
          "blocks": [
            {
              "p": "Our short-form videos go through an independent checker that scores each version before release. The rule that keeps it useful: it sees only the exported frames, never the code or the intent, and returns a score out of 100 with defects ranked by severity. Nothing ships below a fixed pass mark. Two earlier gates feed it: each still frame is scored against a fixed checklist with the platform's safe-zone overlay, and facts are checked by a separate verifier before any voiceover is made. Some videos go through several scored rounds before they clear the bar, and each round fixes the defects ranked worst."
            }
          ]
        },
        {
          "h": "Limits",
          "blocks": [
            {
              "list": [
                "A narrow bar can miss real design problems. Run a broader review now and then, on purpose, not on every change."
              ]
            }
          ]
        },
        {
          "h": "Lab",
          "blocks": [
            {
              "p": "Run your reviewer on one diff twice: once with no instructions, once with the severity bar. Setup check: the second run's findings are all ones you'd actually fix."
            }
          ]
        },
        {
          "h": "From the kit",
          "blocks": [
            {
              "p": "`kit/prompts/review.md`: paste it with each review request, to the verifier or in a fresh session. It also has a version for research and writing. Done when a review returns only findings that come with an input that triggers them."
            }
          ]
        }
      ]
    },
    {
      "id": "choose-the-right-gate",
      "code": "4.4",
      "title": "Choose the right gate: Stop hook, /goal, or verifier",
      "advanced": true,
      "sections": [
        {
          "h": "Problem",
          "blocks": [
            {
              "p": "You want Claude to keep working until the job is really done, not until it feels done. There are three tools for this, and they behave differently."
            }
          ]
        },
        {
          "h": "Evidence",
          "blocks": [
            {
              "p": "From the official documentation (see [hooks](https://code.claude.com/docs/en/hooks), [/goal](https://code.claude.com/docs/en/goal), [sub-agents](https://code.claude.com/docs/en/sub-agents)):"
            },
            {
              "table": {
                "head": [
                  "Gate",
                  "How it decides",
                  "Good for",
                  "Watch out"
                ],
                "rows": [
                  [
                    "**Stop hook**",
                    "Your script runs when Claude tries to stop. It's deterministic: the same input always gives the same answer",
                    "Checks a script can run: tests pass, build succeeds, a file exists",
                    "It only knows what your script checks"
                  ],
                  [
                    "**/goal**",
                    "A separate evaluator model checks your condition after each turn",
                    "Conditions you can describe in words",
                    "The evaluator doesn't run commands or read files, so the evidence must appear in the conversation"
                  ],
                  [
                    "**Verifier subagent**",
                    "A fresh model reviews the work against sources",
                    "Judgment calls: is this claim true, does this meet the spec",
                    "Costs a model run; can be wrong"
                  ]
                ]
              }
            }
          ]
        },
        {
          "h": "Principle",
          "blocks": [
            {
              "p": "**Use the most deterministic gate that can express your condition.** A script beats a model when a script can decide."
            },
            {
              "figure": "GatePicker"
            }
          ]
        },
        {
          "h": "Implementation",
          "blocks": [
            {
              "list": [
                "\"Tests and build pass\" → Stop hook that runs them.",
                "\"The migration is finished and the report is written\" → /goal, and tell Claude to print the evidence (the row counts, the report path) so the evaluator can see it.",
                "\"The numbers in this analysis are correct\" → verifier subagent with primary sources."
              ]
            },
            {
              "p": "**A Stop hook that won't let Claude finish while tests fail.** Save as `.claude/hooks/require-tests.py` in your project (it's in the kit):"
            },
            {
              "code": "#!/usr/bin/env python3\n\"\"\"Stop hook: Claude can't finish its turn while the test suite fails (Module 4, Lesson 4.4).\n\nReplace TEST_COMMAND with your project's test command and keep it fast: it runs on every\nfinished turn. Claude Code's own cap on consecutive continuations resets whenever Claude\ncalls a tool, so this script keeps its own count and lets Claude stop after MAX_RETRIES\ncontinuations, with the failure in front of it.\n\"\"\"\nimport json\nimport os\nimport subprocess\nimport sys\nimport tempfile\n\nTEST_COMMAND = [\"npm\", \"test\", \"--silent\"]\nMAX_RETRIES = 3\nTEST_TIMEOUT = 540  # shorter than the hook's own timeout (600) so a hang is reported, not killed\n\nevent = json.load(sys.stdin)\nstate = os.path.join(tempfile.gettempdir(), f\"require-tests-{event.get('session_id', 'none')}.count\")\ncount = 0\nif event.get(\"stop_hook_active\"):\n    try:\n        count = int(open(state).read())\n    except (OSError, ValueError):\n        count = 0\n\n\ndef done():\n    try:\n        os.remove(state)\n    except OSError:\n        pass\n    sys.exit(0)\n\n\ntry:\n    r = subprocess.run(TEST_COMMAND, cwd=event.get(\"cwd\"), capture_output=True, text=True, timeout=TEST_TIMEOUT)\n    passed, output = r.returncode == 0, (r.stdout + r.stderr)[-2000:]\nexcept Exception as exc:\n    passed, output = False, f\"Could not run the tests: {exc}\"\n\nif passed:\n    done()  # tests pass: let Claude stop\nif count >= MAX_RETRIES:\n    done()  # give up blocking; the last failure is already in the conversation\n\nopen(state, \"w\").write(str(count + 1))\nprint(json.dumps({\n    \"decision\": \"block\",\n    \"reason\": f\"The test suite is failing (attempt {count + 1} of {MAX_RETRIES}). \"\n              \"Fix it before you finish, or explain why it can't pass.\\n\\n\" + output,\n}))",
              "label": ".claude/hooks/require-tests.py"
            },
            {
              "p": "Register it in `.claude/settings.json`. Stop hooks take no `matcher`:"
            },
            {
              "code": "{\n  \"hooks\": {\n    \"Stop\": [\n      {\n        \"hooks\": [\n          { \"type\": \"command\", \"command\": \"python3 .claude/hooks/require-tests.py\", \"timeout\": 600 }\n        ]\n      }\n    ]\n  }\n}",
              "label": ".claude/settings.json"
            },
            {
              "p": "How it behaves, per the [hooks documentation](https://code.claude.com/docs/en/hooks):"
            },
            {
              "list": [
                "`\"decision\": \"block\"` with a `reason` keeps Claude working, and Claude reads the reason, here the failing test output.",
                "`stop_hook_active` is `true` when Claude is already continuing because of a Stop hook. Claude Code also caps consecutive continuations at eight, but the count resets every time Claude calls a tool, and fixing a test means calling tools. So the cap alone won't end a loop on a test that can never pass. The script therefore keeps its own count and lets Claude stop, with the failure visible, after three continuations.",
                "The test command's own timeout (540 seconds) is shorter than the hook's (600), so the script can report a hang instead of being killed silently.",
                "`onFailure` has no effect on Stop hooks. That's why the script reports \"could not run the tests\" itself instead of crashing."
              ]
            },
            {
              "p": "We tested this script with the input format from the documentation: with passing tests Claude may stop; with failing tests Claude is sent back with the failure three times, then allowed to stop. Swap `npm test` for your own test command."
            },
            {
              "figure": "StopHookLoop"
            }
          ]
        },
        {
          "h": "In production",
          "blocks": [
            {
              "p": "Our gates are mostly outside the session: CI checks on every pull request (Lesson 4.1) and the verifier agent before anything leaves the company (Lesson 4.2). We don't run a Stop hook in our main vault, because most of the work there is writing and analysis, where the verifier is the better gate. A Stop hook pays off in code projects with a fast test suite."
            }
          ]
        },
        {
          "h": "Limits",
          "blocks": [
            {
              "list": [
                "A Stop hook runs on every finished turn. With a slow test suite, that's slow. Keep the command fast, or run only the tests related to what changed.",
                "`/goal` and some hook behaviors depend on your Claude Code version. Keep Claude Code updated and check the docs for the feature you rely on."
              ]
            }
          ]
        },
        {
          "h": "Lab",
          "blocks": [
            {
              "p": "For your next long task, write the gate before you start. Setup check: the gate is written down before the task starts, picked from the table above. Real-world check: Claude stops because the gate passed. A stop at the retry limit doesn't count: with the Stop hook above, three continuations with the tests still failing means Claude gave up, not that the job is done."
            }
          ]
        },
        {
          "h": "From the kit",
          "blocks": [
            {
              "p": "`kit/claude/hooks/require-tests.py`: copy it to `.claude/hooks/require-tests.py` in your project, set `TEST_COMMAND`, and register it in `.claude/settings.json` as shown above. The kit's `kit/claude/settings.example.json` doesn't register it for you. Done when a failing test sends Claude back with the test output."
            }
          ]
        }
      ]
    },
    {
      "id": "a-weak-checker-is",
      "code": "4.5",
      "title": "A weak checker is worse than none",
      "sections": [
        {
          "h": "Problem",
          "blocks": [
            {
              "p": "You've automated the check, so you stop looking. If the check is wrong, Claude now optimizes for the wrong thing, efficiently."
            }
          ]
        },
        {
          "h": "Evidence",
          "blocks": [
            {
              "p": "Nicholas Carlini at Anthropic ran 16 agents in parallel across about 2,000 sessions to build a C compiler. His lesson: \"it's important that the task verifier is nearly perfect, otherwise Claude will solve the wrong problem.\" ([Anthropic Engineering, 2026-02-05](https://www.anthropic.com/engineering/building-c-compiler))"
            }
          ]
        },
        {
          "h": "Principle",
          "blocks": [
            {
              "p": "**Spend time on the checker before you spend time on autonomy. The checker defines the job.**"
            }
          ]
        },
        {
          "h": "Implementation",
          "blocks": [
            {
              "p": "Before you let Claude run unattended against a check, test the check itself:"
            },
            {
              "list": [
                "Give it a known-good result. It must pass.",
                "Give it a known-bad result. It must fail.",
                "Ask: what wrong answer would still pass this? If you can think of one, the checker isn't done."
              ],
              "ordered": true
            },
            {
              "figure": "CheckerTest"
            }
          ]
        },
        {
          "h": "In production",
          "blocks": [
            {
              "p": "Our security hook is checked this way. Its test suite holds 20 harmless commands that must pass and 33 real attacks that must be blocked. When we rewrote it in October 2026 and ran the old version against that suite, it turned out to block some of the harmless ones and miss some of the attacks. Nobody had noticed, because nothing had tested the checker. The kit ships the rewritten guard with the full suite, so you can run the same test yourself."
            }
          ]
        },
        {
          "h": "Limits",
          "blocks": [
            {
              "list": [
                "\"Nearly perfect\" is a goal, not a state you reach once. Every time the checker misses something, add that case to its tests."
              ]
            }
          ]
        },
        {
          "h": "Lab",
          "blocks": [
            {
              "p": "Take one check you rely on. Feed it one known-good and one known-bad case. Setup check: it gets both right, and you add a test for anything it missed."
            }
          ]
        },
        {
          "h": "From the kit",
          "blocks": [
            {
              "p": "`kit/claude/hooks/test_security_guard.py` is the guard's own suite, a worked example of this lesson. Install it with the guard in Lesson 6.4, then run `python3 ~/.claude/hooks/test_security_guard.py` from your own terminal. Done when every case passes."
            }
          ]
        }
      ]
    }
  ]
};
