// Shared look of the Copilot OS guide: /free/starter's paper grid, ink and one orange accent, set for reading.
// Body text 18px with 1.75 line height and lines kept under ~70 characters (62ch).
export const GUIDE_CSS = `
.gd{--page:#f3f4f1;--ink:#15171a;--body:#2c3036;--soft:#4a4f56;--muted:#767b82;--rule:#dcded9;--rule-strong:#c4c7c2;--panel:#14161a;--accent:#e0552f;--pass:#2e9e6a;
  color:var(--ink);background-color:var(--page);
  background-image:linear-gradient(to right,rgba(21,23,26,.045) 1px,transparent 1px),linear-gradient(to bottom,rgba(21,23,26,.045) 1px,transparent 1px);
  background-size:28px 28px}
.gd-prose{font-size:18px;line-height:1.75;color:var(--body);max-width:62ch}
.gd-prose p+p{margin-top:1.1em}
.gd-prose strong{color:var(--ink);font-weight:600}
.gd-eyebrow{font-family:var(--font-geist-mono),ui-monospace,monospace;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:var(--accent)}
.gd-h1{font-size:clamp(40px,7vw,76px);font-weight:500;line-height:1;letter-spacing:-.045em}
.gd-h2{font-size:clamp(28px,4vw,44px);font-weight:500;line-height:1.06;letter-spacing:-.035em}
.gd-h3{font-size:21px;font-weight:600;line-height:1.3;letter-spacing:-.02em}
.gd-serif{font-family:var(--font-instrument-serif),Georgia,serif;font-style:italic;font-weight:400;letter-spacing:-.01em;color:var(--soft)}
.gd-code{font-family:var(--font-geist-mono),ui-monospace,monospace;font-size:.86em;background:#fff;padding:.12em .4em;border-radius:6px;box-shadow:0 0 0 1px var(--rule);color:var(--ink);white-space:nowrap}
.gd-kbd{display:inline-flex;align-items:center;min-height:30px;padding:0 9px;border-radius:7px;background:#fff;font-size:15px;font-weight:500;color:var(--ink);box-shadow:0 0 0 1px var(--rule-strong),0 2px 0 var(--rule-strong)}
.gd-plate{border-radius:18px;background-color:rgba(255,255,255,.55);box-shadow:0 0 0 1px var(--rule),0 30px 70px -48px rgba(21,23,26,.45)}
.gd-press{transition:transform .45s cubic-bezier(.34,1.56,.64,1),background-color .2s,color .2s,box-shadow .2s}
.gd-press:active{transform:scale(.96)}
@keyframes gd-blink{50%{opacity:0}}
.gd-caret{animation:gd-blink 1s steps(1) infinite}
@media (max-height:560px){.gd-short-hide{display:none}}
@media (prefers-reduced-motion:reduce){.gd-caret{animation:none}}
`;
