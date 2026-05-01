import Image from "next/image";

export default function AppPreview() {
  return (
    <section className="relative w-full min-w-0 px-0 pb-24">
      {/* Background gradient effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-bg-primary to-transparent" />
      </div>

      <div
        className="relative mx-auto w-[min(100%,94vw)] min-w-0 max-w-full sm:w-[90%] md:w-[85%]"
        data-app-preview
      >
        {/* App window */}
        <div className="bg-bg-card-alt border border-border rounded-xl overflow-hidden shadow-2xl shadow-black/50 max-w-full min-w-0">
          {/* App chrome */}
          <div className="grid grid-cols-[232px_1fr] max-lg:grid-cols-1">
            {/* Sidebar */}
            <div className="p-2 max-lg:hidden">
              <div className="flex items-center justify-between px-2 h-7 mb-3">
                <div className="flex items-center gap-1.5">
                  <Image
                    src="/images/evimeria-logo.png"
                    alt=""
                    width={13}
                    height={13}
                    className="h-[13px] w-[13px] shrink-0 invert opacity-80"
                  />
                  <span className="text-[14px] font-semibold text-[#d0d6e0] tracking-tight">
                    Knot
                  </span>
                </div>
              </div>

              <nav className="space-y-0.5 opacity-80">
                {["Intake", "In progress", "Review", "Done"].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 px-1.5 h-7 rounded-md text-[13px] font-semibold text-[#d0d6e0]"
                  >
                    <div className="w-3.5 h-3.5 rounded-sm bg-white/5" />
                    {item}
                  </div>
                ))}

                <div className="pt-3 pb-1">
                  <span className="text-[13px] font-semibold text-text-muted px-1">
                    Workspaces
                  </span>
                </div>
                {[
                  "Customer support",
                  "Finance ops",
                  "Legal review",
                  "Internal IT",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 px-1.5 h-7 rounded-md text-[13px] font-semibold text-[#d0d6e0]"
                  >
                    <div className="w-3.5 h-3.5 rounded-sm bg-white/5" />
                    {item}
                  </div>
                ))}

                <div className="pt-3 pb-1">
                  <span className="text-[13px] font-semibold text-text-muted px-1">
                    Favorites
                  </span>
                </div>
                {[
                  { name: "Inquiry routing Skill", active: true },
                  { name: "Finance review agent", active: false },
                  { name: "Support triage workflow", active: false },
                  { name: "Operations QA checklist", active: false },
                ].map((item) => (
                  <div
                    key={item.name}
                    className={`flex items-center gap-2 px-1.5 h-7 rounded-md text-[13px] font-semibold text-[#d0d6e0] ${
                      item.active ? "bg-white/[0.04]" : ""
                    }`}
                  >
                    <div className="w-3.5 h-3.5 rounded-sm bg-white/5" />
                    {item.name}
                  </div>
                ))}
              </nav>
            </div>

            {/* Main content area */}
            <div className="min-w-0 border-l border-border bg-bg-card rounded-lg m-1.5 sm:m-2 ml-0 max-lg:m-2 overflow-hidden">
              {/* Small screens: horizontal nav replacing the left sidebar */}
              <div className="flex lg:hidden items-center gap-2 border-b border-white/5 px-3 py-2.5 overflow-x-auto [scrollbar-width:thin]">
                {["Intake", "In progress", "Inquiries"].map((label) => (
                  <button
                    key={label}
                    type="button"
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[12px] font-semibold ${
                      label === "Inquiries"
                        ? "bg-white/[0.08] text-[#d0d6e0]"
                        : "text-text-secondary"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="grid min-w-0 grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(220px,0.95fr)] lg:grid-cols-[minmax(0,1fr)_minmax(260px,320px)]">
                {/* Issue view */}
                <div className="min-w-0">
                  {/* Header bar */}
                  <div className="flex min-w-0 items-center justify-between gap-2 min-h-11 px-3 sm:px-6 border-b border-white/5 py-2 sm:py-0">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-semibold text-[#d0d6e0] truncate">
                        Example: Client Inquiry Routing Skill
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-semibold text-text-secondary">
                        02
                      </span>
                      <span className="text-xs text-text-muted">/</span>
                      <span className="text-xs text-text-muted">145</span>
                    </div>
                  </div>

                  {/* Issue content */}
                  <div className="p-4 sm:p-6 lg:p-12 space-y-5 sm:space-y-6 min-w-0">
                    <h3 className="text-lg sm:text-xl font-semibold text-[#d0d6e0] tracking-[-0.012em] break-words">
                      Example: Client Inquiry Routing Skill
                    </h3>
                    <p className="text-[13px] sm:text-sm text-text-secondary leading-relaxed tracking-[-0.01em] break-words">
                      Reads form and email submissions, assigns priority and category, notifies the right owner, and drafts a reply inside the current workflow.{" "}
                      <code className="px-1.5 py-0.5 bg-white/5 border border-white/[0.08] rounded text-xs text-[#d0d6e0] font-mono">
                        inquiry_router
                      </code>{" "}
                      rules stay editable after launch.
                    </p>

                    <div>
                      <h4 className="text-base font-semibold text-[#d0d6e0] mb-4">
                        Activity
                      </h4>

                      <div className="space-y-1">
                        {/* Activity items */}
                        <div className="flex items-start gap-2 min-h-6">
                          <Image
                            src="/images/avatar-karri.png"
                            alt="karri"
                            width={14}
                            height={14}
                            className="mt-0.5 shrink-0 rounded-full"
                          />
                          <p className="min-w-0 text-[11px] leading-snug text-text-muted sm:text-xs">
                            <span className="font-semibold">Form</span>{" "}
                            received a new inquiry &middot;{" "}
                            <span className="font-semibold">Knot</span>{" "}
                            created the work item &middot; 2 min ago
                          </p>
                        </div>
                        <div className="ml-2 w-px h-2 bg-border-solid" />
                        <div className="flex items-start gap-2 min-h-6">
                          <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/5">
                            <div className="h-2 w-2 rounded-full bg-accent/40" />
                          </div>
                          <p className="min-w-0 text-[11px] leading-snug text-text-muted sm:text-xs">
                            <span className="font-semibold">
                              Operations agent
                            </span>{" "}
                            applied labels{" "}
                            <span className="font-semibold">New</span> and{" "}
                            <span className="font-semibold">Estimate</span>{" "}
                            &middot; 2 min ago
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Comment card */}
                    <div className="space-y-3 rounded-md border border-white/[0.08] bg-white/[0.01] p-3 sm:p-4">
                      <div className="flex items-center gap-2">
                        <Image
                          src="/images/avatar-karri.png"
                          alt="karri"
                          width={14}
                          height={14}
                          className="rounded-full"
                        />
                        <span className="text-xs font-semibold text-[#d0d6e0]">
                          karri
                        </span>
                        <span className="text-xs font-semibold text-text-muted">
                          &middot; 4 min ago
                        </span>
                      </div>
                      <p className="text-[13px] text-text-secondary tracking-[-0.008em]">
                        Email-only intake makes ownership and due dates too easy to miss.
                      </p>
                      <div className="border-t border-border-solid pt-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <Image
                            src="/images/avatar-jori.png"
                            alt="jori"
                            width={14}
                            height={14}
                            className="rounded-full"
                          />
                          <span className="text-xs font-semibold text-[#d0d6e0]">
                            jori
                          </span>
                          <span className="text-xs font-semibold text-text-muted">
                          &middot; just now
                          </span>
                        </div>
                        <p className="text-[13px] text-text-secondary ml-0 pl-0 sm:ml-6 sm:pl-0">
                          <span className="font-semibold">@Claude</span>{" "}
                          Can we test the form handoff and draft-reply flow?
                        </p>
                      </div>
                    </div>

                    {/* Agent activity */}
                    <div className="border border-white/[0.08] bg-white/[0.01] rounded-md px-4 py-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Image
                          src="/images/evimeria-logo.png"
                          alt="Claude"
                          width={14}
                          height={14}
                          className="rounded-full"
                        />
                        <span className="text-xs font-semibold text-[#d0d6e0]">
                          Claude
                        </span>
                      </div>
                      <p className="text-[13px] text-text-secondary tracking-[-0.008em]">
                        Processing item{" "}
                        <span className="font-mono text-text-muted text-xs">
                          REQ-1842
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right sidebar - Agent chat */}
                <div className="flex min-h-[220px] w-full min-w-0 flex-col border-t border-white/5 bg-bg-elevated md:min-h-0 md:max-w-none md:border-t-0 md:border-l lg:min-w-[260px] lg:max-w-[320px]">
                  {/* Chat header */}
                  <div className="flex items-center justify-between border-b border-white/5 px-3 py-2.5 sm:px-5 sm:py-3">
                    <div className="flex items-center gap-2">
                      <Image
                        src="/images/evimeria-logo.png"
                        alt="Claude"
                        width={16}
                        height={16}
                        className="rounded-lg"
                      />
                      <span className="text-xs font-semibold text-[#d0d6e0]">
                        Claude
                      </span>
                    </div>
                  </div>

                  {/* Chat content */}
                  <div className="max-h-[min(50vh,320px)] flex-1 space-y-3 overflow-y-auto px-3 py-3 text-[11px] sm:space-y-4 sm:px-5 sm:text-xs md:max-h-none">
                    <p className="text-text-secondary">
                      Got it. I will inspect the form-to-Sheets-to-Slack flow.
                    </p>
                    <p className="text-text-secondary">
                      Opened workspace{" "}
                      <code className="font-mono text-text-muted text-[11.8px]">
                        .claude/skills/inquiry-router
                      </code>{" "}
                      {"."}
                    </p>
                    <p className="text-text-secondary">
                      Reading the existing{" "}
                      <code className="font-mono text-text-muted text-[11.8px]">
                        .claude/skills/inquiry-router/SKILL.md
                      </code>{" "}
                      file.
                    </p>
                    <pre className="font-mono text-[11.8px] text-text-muted leading-relaxed overflow-x-auto max-w-full rounded bg-black/20 p-2">
                      {`.claude/skills/inquiry-router$ claude /inquiry-router --validate\nOK: SKILL.md loaded, 3 steps, 2 checks`}
                    </pre>
                    <p className="text-text-secondary">
                      Checking merge fields in{" "}
                      <code className="font-mono text-text-muted text-[11.8px]">
                        draft_reply.md
                      </code>{" "}
                      {"."}
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <div className="w-4 h-4 rounded-full border-2 border-text-muted border-t-transparent animate-spin" />
                      <span className="text-text-secondary">Thinking</span>
                    </div>
                  </div>

                  {/* Chat input */}
                  <div className="p-2.5 sm:p-3">
                    <div className="rounded-md border border-white/[0.08] bg-white/[0.02] px-3 py-2.5 sm:px-4 sm:py-3">
                      <span className="text-[13px] text-text-muted">
                        Message Claude&hellip;
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
