// Shared look of the Copilot OS guide, set for reading a course: a plain page for body text, with the site's paper
// grid only behind the hero and each section's opener. Body text 18px, line height 1.75, lines under ~70 characters.
// Italic serif only in the hero, section openers and the completion message.
export const GUIDE_CSS = `
.gd{--page:#fbfbfa;--ink:#15171a;--body:#2c3036;--soft:#4a4f56;--muted:#6b7077;--rule:#e2e3df;--rule-strong:#c4c7c2;--panel:#14161a;--accent:#e0552f;--pass:#2e9e6a;
  color:var(--ink);background-color:var(--page)}
.gd-grid{background-color:#f3f4f1;
  background-image:linear-gradient(to right,rgba(21,23,26,.045) 1px,transparent 1px),linear-gradient(to bottom,rgba(21,23,26,.045) 1px,transparent 1px);
  background-size:28px 28px}
.gd-prose{font-size:18px;line-height:1.75;color:var(--body);max-width:62ch}
.gd-prose p+p{margin-top:1.1em}
.gd-prose strong{color:var(--ink);font-weight:600}
.gd-h1{font-size:clamp(40px,6.4vw,72px);font-weight:500;line-height:1.02;letter-spacing:-.045em}
.gd-h2{font-size:clamp(28px,4vw,42px);font-weight:500;line-height:1.08;letter-spacing:-.035em}
.gd-h3{font-size:21px;font-weight:600;line-height:1.3;letter-spacing:-.02em}
.gd-serif{font-family:var(--font-instrument-serif),Georgia,serif;font-style:italic;font-weight:400;letter-spacing:-.01em;color:var(--soft)}
.gd-code{font-family:var(--font-geist-mono),ui-monospace,monospace;font-size:.86em;background:#fff;padding:.12em .4em;border-radius:6px;box-shadow:0 0 0 1px var(--rule);color:var(--ink);overflow-wrap:anywhere}
.gd-kbd{display:inline-flex;align-items:center;min-height:30px;padding:0 9px;border-radius:7px;background:#fff;font-size:15px;font-weight:500;color:var(--ink);box-shadow:0 0 0 1px var(--rule-strong),0 2px 0 var(--rule-strong)}
.gd-plate{border-radius:18px;background-color:#fff;box-shadow:0 0 0 1px var(--rule),0 24px 60px -48px rgba(21,23,26,.45)}
.gd-link{color:var(--ink);text-decoration:underline;text-decoration-color:var(--accent);text-underline-offset:3px;text-decoration-thickness:1.5px}
.gd-press{transition:transform .45s cubic-bezier(.34,1.56,.64,1),background-color .2s,color .2s,box-shadow .2s}
.gd-press:active{transform:scale(.96)}
.gd-details>summary{list-style:none}
.gd-details>summary::-webkit-details-marker{display:none}
.gd-details>summary::after{content:"+";margin-left:auto;font-size:20px;line-height:1;color:var(--muted);transition:transform .3s cubic-bezier(.34,1.56,.64,1)}
.gd-details[open]>summary::after{transform:rotate(45deg)}
@media (prefers-reduced-motion:reduce){.gd-details>summary::after{transition:none}}
`;
