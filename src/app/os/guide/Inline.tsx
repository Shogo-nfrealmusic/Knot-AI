import { Fragment } from "react";
import { parseInline, type Token } from "./markup";

function render(tokens: Token[], key = ""): React.ReactNode[] {
  return tokens.map((t, i) => {
    const k = `${key}${i}`;
    if (t.t === "text") return <Fragment key={k}>{t.v}</Fragment>;
    if (t.t === "code") return <code key={k} className="gd-code">{t.v}</code>;
    if (t.t === "b") return <strong key={k}>{render(t.c, k)}</strong>;
    if (t.t === "i") return <em key={k}>{render(t.c, k)}</em>;
    return (
      <a key={k} className="gd-link" href={t.href} target="_blank" rel="noreferrer">
        {render(t.c, k)}
      </a>
    );
  });
}

/** One line of guide text with its inline marks rendered. */
export function Inline({ text }: { text: string }) {
  return <>{render(parseInline(text))}</>;
}
