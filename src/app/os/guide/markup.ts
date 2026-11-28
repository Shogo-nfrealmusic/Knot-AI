// The guide's text keeps the module files' own inline marks: **bold**, *italic*, `code` and [links](https://…).
// This turns one line into tokens the page renders. Code is literal (no emphasis inside), only https links are links,
// and an unclosed mark stays as written.

export type Token =
  | { t: "text"; v: string }
  | { t: "code"; v: string }
  | { t: "b"; c: Token[] }
  | { t: "i"; c: Token[] }
  | { t: "a"; href: string; c: Token[] };

function pushText(out: Token[], v: string) {
  if (!v) return;
  const last = out[out.length - 1];
  if (last && last.t === "text") last.v += v;
  else out.push({ t: "text", v });
}

export function parseInline(s: string): Token[] {
  const out: Token[] = [];
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (ch === "`") {
      const end = s.indexOf("`", i + 1);
      if (end > i) {
        out.push({ t: "code", v: s.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
    }
    if (s.startsWith("**", i)) {
      const end = closing(s, i + 2, "**");
      if (end > i + 2) {
        out.push({ t: "b", c: parseInline(s.slice(i + 2, end)) });
        i = end + 2;
        continue;
      }
    }
    if (ch === "*" && s[i + 1] !== " " && s[i + 1] !== "*") {
      const end = closing(s, i + 1, "*");
      if (end > i + 1 && s[end - 1] !== " ") {
        out.push({ t: "i", c: parseInline(s.slice(i + 1, end)) });
        i = end + 1;
        continue;
      }
    }
    if (ch === "[") {
      const close = closing(s, i + 1, "]");
      if (close > i && s.startsWith("(https://", close + 1)) {
        const end = s.indexOf(")", close + 2);
        if (end > close) {
          out.push({ t: "a", href: s.slice(close + 2, end), c: parseInline(s.slice(i + 1, close)) });
          i = end + 1;
          continue;
        }
      }
    }
    pushText(out, ch);
    i += 1;
  }
  return out;
}

/** Where `mark` closes, skipping over code spans so `*` inside backticks never closes emphasis. -1 if it doesn't. */
function closing(s: string, from: number, mark: string): number {
  let i = from;
  while (i < s.length) {
    if (s[i] === "`") {
      const end = s.indexOf("`", i + 1);
      if (end < 0) return -1;
      i = end + 1;
      continue;
    }
    if (s.startsWith(mark, i) && !(mark === "*" && s[i + 1] === "*")) return i;
    i += 1;
  }
  return -1;
}
