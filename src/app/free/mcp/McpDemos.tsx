"use client";

// /free/62 (MCP vs API): one small live figure per chapter, drawn for this site rather than cut from the reel.
// Same language as /free/46–64: paper plate, ink lines, one accent (orange).
// Real: the Slack method and URL (docs.slack.dev, conversations.history, read Nov 13, 2026) and the MCP method names
// tools/list and tools/call (MCP specification, server/tools). The counts are arithmetic: apps × services against
// apps + services. The tool names in the discovery figure are examples, marked as such on the figure.

import { useState } from "react";

export type McpDemoKind = "request" | "wiring" | "discovery";

const SLACK_DOCS = "https://docs.slack.dev/reference/methods/conversations.history";
const MCP_TOOLS = "https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/server/tools.mdx";

export function McpDemo({ kind }: { kind: McpDemoKind }) {
  return (
    <div className="mc mt-5 max-w-2xl">
      <style>{MC_CSS}</style>
      {kind === "request" && <Request />}
      {kind === "wiring" && <Wiring />}
      {kind === "discovery" && <Discovery />}
    </div>
  );
}

function Plate({ n, title, sub }: { n: number; title: string; sub: string }) {
  return (
    <div className="mb-4">
      <span className="flex items-baseline gap-2">
        <span className="font-mono text-[12px] text-[var(--accent)]">0{n}/03</span>
        <span className="truncate text-[15px] font-semibold text-[var(--ink)]">{title}</span>
      </span>
      <span className="block truncate font-mono text-[11.5px] text-[var(--muted)]">{sub}</span>
    </div>
  );
}

function Source({ text, href }: { text: string; href: string }) {
  return (
    <p className="mt-2 font-mono text-[10.5px] leading-relaxed text-[var(--muted)] [overflow-wrap:anywhere]">
      Source:{" "}
      <a href={href} target="_blank" rel="noopener noreferrer" className="underline decoration-[var(--rule-strong)] underline-offset-2 hover:text-[var(--ink)]">
        {text}
      </a>
    </p>
  );
}

const BTN =
  "mc-press rounded-full border border-[var(--rule-strong)] bg-white px-3.5 py-1.5 text-[12.5px] font-medium text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] disabled:opacity-40";

// ───────── 1 · an API call: your program sends a request to a URL, the service sends data back ─────────
function Request() {
  const [step, setStep] = useState(0); // 0 idle · 1 request sent · 2 response back
  return (
    <figure className="mc-plate p-4 sm:p-6">
      <Plate n={1} title="One API call" sub="press Send, then Reply" />
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="mc-card text-center">
          <span className="block font-mono text-[11px] text-[var(--muted)]">your program</span>
          <span className="block text-[14px] font-semibold text-[var(--ink)]">Program A</span>
        </div>
        <svg viewBox="0 0 120 44" className="h-11 w-[120px] sm:w-[200px]" preserveAspectRatio="none" aria-hidden>
          <line x1="0" y1="14" x2="120" y2="14" stroke={step >= 1 ? "var(--accent)" : "var(--rule-strong)"} strokeWidth="2" style={{ transition: "stroke .3s" }} />
          <polygon points="120,14 112,9 112,19" fill={step >= 1 ? "var(--accent)" : "var(--rule-strong)"} style={{ transition: "fill .3s" }} />
          <line x1="0" y1="32" x2="120" y2="32" stroke={step >= 2 ? "var(--ink)" : "var(--rule-strong)"} strokeWidth="2" style={{ transition: "stroke .3s" }} />
          <polygon points="0,32 8,27 8,37" fill={step >= 2 ? "var(--ink)" : "var(--rule-strong)"} style={{ transition: "fill .3s" }} />
        </svg>
        <div className="mc-card text-center">
          <span className="block font-mono text-[11px] text-[var(--muted)]">the service</span>
          <span className="block text-[14px] font-semibold text-[var(--ink)]">Slack</span>
        </div>
      </div>
      <div className="mc-card mt-3 min-h-[92px] font-mono text-[12px] leading-relaxed [overflow-wrap:anywhere]">
        {step === 0 && <span className="text-[var(--muted)]">Nothing sent yet.</span>}
        {step >= 1 && (
          <span className="block text-[var(--ink)]">
            <span className="text-[var(--accent)]">→ request</span> GET https://slack.com/api/conversations.history
          </span>
        )}
        {step >= 2 && (
          <span className="mt-1 block text-[var(--soft)]">
            <span className="text-[var(--ink)]">← response</span> {"{ \"ok\": true, \"messages\": [ … ] }"}
          </span>
        )}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className={BTN} disabled={step !== 0} onClick={() => setStep(1)}>
          Send
        </button>
        <button type="button" className={BTN} disabled={step !== 1} onClick={() => setStep(2)}>
          Reply
        </button>
        <button type="button" className={BTN} disabled={step === 0} onClick={() => setStep(0)}>
          Reset
        </button>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        The reel says &ldquo;something like api.slack.com/messages&rdquo; to keep it short. The real method that reads a channel&apos;s messages is conversations.history, at the URL above. The response line is shortened.
      </figcaption>
      <Source text="Slack developer docs, conversations.history" href={SLACK_DOCS} />
    </figure>
  );
}

// ───────── 2 · apps × services by hand, apps + services with MCP: move the two steppers ─────────
function Stepper({ label, value, min, max, set }: { label: string; value: number; min: number; max: number; set: (n: number) => void }) {
  return (
    <div className="mc-card flex items-center justify-between gap-2">
      <span className="font-mono text-[11.5px] text-[var(--soft)]">{label}</span>
      <span className="flex items-center gap-2">
        <button type="button" aria-label={`Fewer ${label}`} className={BTN} disabled={value <= min} onClick={() => set(value - 1)}>
          −
        </button>
        <span className="w-6 text-center text-[16px] font-semibold tabular-nums text-[var(--ink)]" aria-live="polite">
          {value}
        </span>
        <button type="button" aria-label={`More ${label}`} className={BTN} disabled={value >= max} onClick={() => set(value + 1)}>
          +
        </button>
      </span>
    </div>
  );
}

function Wiring() {
  const [apps, setApps] = useState(2);
  const [svcs, setSvcs] = useState(10);
  const [mcp, setMcp] = useState(false);
  const W = 560;
  const H = 250;
  const ax = (i: number) => (W * (i + 1)) / (apps + 1);
  const sx = (j: number) => 24 + ((W - 48) * (j + 0.5)) / svcs;
  const AY = 34;
  const SY = 212;
  const hand = apps * svcs;
  const pieces = apps + svcs;
  return (
    <figure className="mc-plate p-4 sm:p-6">
      <Plate n={2} title="Count the pieces you build" sub="change the apps and the services, then switch to MCP" />
      <div className="grid gap-2 sm:grid-cols-2">
        <Stepper label="apps" value={apps} min={1} max={4} set={setApps} />
        <Stepper label="services" value={svcs} min={1} max={12} set={setSvcs} />
      </div>
      <div role="radiogroup" aria-label="How the apps reach the services" className="mt-3 inline-flex gap-1 rounded-[18px] bg-white p-1 shadow-[0_0_0_1px_var(--rule)]">
        {[
          { id: false, label: "By hand" },
          { id: true, label: "With MCP" },
        ].map((o) => (
          <button
            key={o.label}
            type="button"
            role="radio"
            aria-checked={mcp === o.id}
            onClick={() => setMcp(o.id)}
            className={`mc-press rounded-full px-3 py-1.5 text-[12.5px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${mcp === o.id ? "bg-[var(--ink)] text-white" : "text-[var(--soft)] hover:text-[var(--ink)]"}`}
          >
            {o.label}
          </button>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 w-full" role="img" aria-label={mcp ? `${apps} MCP clients and ${svcs} MCP servers` : `${hand} hand-written integrations`}>
        {/* the cables: one per app and service. By hand each one is code you wrote; with MCP they are the same protocol */}
        {Array.from({ length: apps }, (_, i) =>
          Array.from({ length: svcs }, (_, j) => (
            <path
              key={`${i}-${j}`}
              d={`M${ax(i)} ${AY + 16} C ${ax(i)} ${(AY + SY) / 2}, ${sx(j)} ${(AY + SY) / 2}, ${sx(j)} ${SY - (mcp ? 30 : 14)}`}
              fill="none"
              stroke={mcp ? "var(--accent)" : "var(--ink)"}
              strokeWidth={mcp ? 1 : 1.6}
              opacity={mcp ? 0.55 : 0.8}
              style={{ transition: "stroke .3s, opacity .3s" }}
            />
          )),
        )}
        {Array.from({ length: apps }, (_, i) => (
          <g key={`a${i}`}>
            <rect x={ax(i) - 30} y={AY - 16} width="60" height="32" rx="7" fill="#fff" stroke="var(--ink)" strokeWidth="1.2" />
            <text x={ax(i)} y={AY + 4} textAnchor="middle" fontSize="11" fontFamily="ui-monospace, monospace" fill="var(--ink)">
              app {i + 1}
            </text>
            {mcp && <rect x={ax(i) - 9} y={AY + 12} width="18" height="9" rx="2.5" fill="var(--accent)" />}
          </g>
        ))}
        {Array.from({ length: svcs }, (_, j) => (
          <g key={`s${j}`}>
            {mcp && <rect x={sx(j) - 9} y={SY - 32} width="18" height="14" rx="3" fill="var(--accent)" />}
            <rect x={sx(j) - 13} y={SY - 14} width="26" height="26" rx="6" fill="#fff" stroke="var(--rule-strong)" strokeWidth="1.2" />
            <text x={sx(j)} y={SY + 3} textAnchor="middle" fontSize="10" fontFamily="ui-monospace, monospace" fill="var(--soft)">
              {j + 1}
            </text>
          </g>
        ))}
        <text x={W / 2} y={H - 6} textAnchor="middle" fontSize="10.5" fontFamily="ui-monospace, monospace" fill="var(--muted)">
          services (Slack, Gmail, Jira, Notion, your database, …)
        </text>
      </svg>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <div className="mc-card" style={{ opacity: mcp ? 0.55 : 1 }}>
          <span className="block font-mono text-[11px] text-[var(--muted)]">By hand · apps × services</span>
          <span className="mt-1 block text-[20px] font-semibold tabular-nums text-[var(--ink)]">
            {apps} × {svcs} = {hand}
          </span>
        </div>
        <div className="mc-card" style={{ opacity: mcp ? 1 : 0.55 }}>
          <span className="block font-mono text-[11px] text-[var(--muted)]">With MCP · clients + servers</span>
          <span className="mt-1 block text-[20px] font-semibold tabular-nums text-[var(--accent)]">
            {apps} + {svcs} = {pieces}
          </span>
        </div>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        The reel&apos;s example is 2 apps and 10 services: 20 integrations by hand, 12 pieces with MCP. Add a third app and the left side grows by 10 while the right side grows by 1. This is a simplified count: someone still writes each server once.
      </figcaption>
    </figure>
  );
}

// ───────── 3 · discovery: the client asks each server what it can do, the app shows the list to the model, the model picks ─────────
const TOOLS = [
  { server: "Slack", name: "read_messages" },
  { server: "Gmail", name: "send_email" },
  { server: "Jira", name: "create_ticket" },
  { server: "Notion", name: "search_docs" },
];
const STEPS = [
  { who: "client → servers", call: "tools/list", say: "The MCP client in your app asks every server what it can do." },
  { who: "servers → client", call: "result", say: "Each server answers with its tools: a name, a description and the inputs it takes." },
  { who: "app → model", call: "the list", say: "Your app decides which of those tools the model is allowed to see, and shows it that list." },
  { who: "model → app → server", call: "tools/call", say: "The model picks one. Your app sends the call to that server, and the server calls the service's normal API." },
];

function Discovery() {
  const [step, setStep] = useState(0);
  const s = STEPS[step];
  return (
    <figure className="mc-plate p-4 sm:p-6">
      <Plate n={3} title="Discovery, step by step" sub="press Next" />
      <div className="flex flex-wrap items-center gap-1">
        {STEPS.map((k, n) => (
          <span key={k.call} className="flex items-center gap-1">
            <button
              type="button"
              aria-current={step === n}
              onClick={() => setStep(n)}
              className={`mc-press rounded-full px-2.5 py-1 font-mono text-[11.5px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${step === n ? "bg-[var(--ink)] text-white" : n < step ? "bg-white text-[var(--ink)] shadow-[0_0_0_1px_var(--rule-strong)]" : "bg-white text-[var(--soft)] shadow-[0_0_0_1px_var(--rule)]"}`}
            >
              {n + 1} · {k.call}
            </button>
            {n < STEPS.length - 1 ? <span aria-hidden className="font-mono text-[11px] text-[var(--muted)]">→</span> : null}
          </span>
        ))}
      </div>
      <div className="mc-card mt-3 min-h-[76px]">
        <span className="block font-mono text-[11.5px] text-[var(--accent)]">{s.who}</span>
        <span className="mt-1 block text-[13.5px] leading-relaxed text-[var(--soft)]">{s.say}</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {TOOLS.map((t, n) => {
          const known = step >= 1;
          const shown = step >= 2;
          const picked = step === 3 && n === 2;
          return (
            <div
              key={t.name}
              className="mc-card"
              style={{
                opacity: known ? (step === 3 && !picked ? 0.45 : 1) : 0.35,
                borderColor: picked ? "var(--accent)" : shown ? "var(--rule-strong)" : undefined,
                boxShadow: picked ? "0 0 0 1px var(--accent)" : undefined,
                transition: "opacity .3s, border-color .3s, box-shadow .3s",
              }}
            >
              <span className="block font-mono text-[10.5px] text-[var(--muted)]">{t.server}</span>
              <span className="block truncate font-mono text-[12px] text-[var(--ink)]">{known ? t.name : "?"}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className={BTN} disabled={step === STEPS.length - 1} onClick={() => setStep(step + 1)}>
          Next
        </button>
        <button type="button" className={BTN} disabled={step === 0} onClick={() => setStep(0)}>
          Start over
        </button>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        tools/list and tools/call are the method names in the MCP specification. The four tool names are examples made up for this figure; a real server names its own.
      </figcaption>
      <Source text="Model Context Protocol specification, server/tools" href={MCP_TOOLS} />
    </figure>
  );
}

const MC_CSS = `
.mc{--page:#f3f4f1;--ink:#15171a;--soft:#4a4f56;--muted:#868b92;--rule:#dcded9;--rule-strong:#c4c7c2;--accent:#d77757}
.mc-plate{border-radius:18px;background-color:var(--page);background-image:linear-gradient(to right,rgba(21,23,26,.045) 1px,transparent 1px),linear-gradient(to bottom,rgba(21,23,26,.045) 1px,transparent 1px);background-size:24px 24px;box-shadow:0 0 0 1px var(--rule)}
.mc-card{border-radius:12px;border:1px solid var(--rule);background:#fff;padding:9px 12px}
.mc-press{transition:transform .45s cubic-bezier(.34,1.56,.64,1),border-color .2s,opacity .2s,color .2s,background-color .2s}
.mc-press:active:not(:disabled){transform:scale(.97)}
`;
