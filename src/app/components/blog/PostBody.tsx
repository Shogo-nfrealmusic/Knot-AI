import { IconBulb, IconInfoCircle, IconLink } from "@tabler/icons-react";
import FigureZoom from "@/app/components/blog/FigureZoom";
import { slugifyHeading, type BlogBlock, type BlogCategory } from "@/lib/blog";
import { cn } from "@/lib/utils";

// Minimal highlighter in the site's min-light code colors (see StackTabs).
const COLORS = {
  keyword: "#D32F2F",
  string: "#22863A",
  comment: "#6A737D",
  fn: "#6F42C1",
};

const KEYWORDS: Record<"go" | "python" | "ts", string[]> = {
  go: ["func", "return", "package", "import", "var", "const", "type", "struct", "if", "for", "range"],
  python: ["def", "for", "in", "return", "import", "from", "if", "else", "class"],
  ts: ["const", "let", "function", "return", "import", "from", "export", "await", "async", "if"],
};

function highlightLine(line: string, language: "go" | "python" | "ts", key: number) {
  const commentToken = language === "python" ? "#" : "//";
  const commentAt = line.indexOf(commentToken);
  const codePart = commentAt >= 0 ? line.slice(0, commentAt) : line;
  const commentPart = commentAt >= 0 ? line.slice(commentAt) : "";

  const tokens = codePart.split(/("[^"]*"|\b[A-Za-z_][A-Za-z0-9_]*\b)/g);
  return (
    <span key={key} className="block min-h-[1.5em]">
      {tokens.map((token, index) => {
        if (!token) return null;
        if (token.startsWith('"')) {
          return (
            <span key={index} style={{ color: COLORS.string }}>
              {token}
            </span>
          );
        }
        if (KEYWORDS[language].includes(token)) {
          return (
            <span key={index} style={{ color: COLORS.keyword }}>
              {token}
            </span>
          );
        }
        if (/^[A-Za-z_]/.test(token) && tokens[index + 1]?.startsWith("(")) {
          return (
            <span key={index} style={{ color: COLORS.fn }}>
              {token}
            </span>
          );
        }
        return <span key={index}>{token}</span>;
      })}
      {commentPart ? <span style={{ color: COLORS.comment }}>{commentPart}</span> : null}
    </span>
  );
}

// Inline links written as [label](href).
function Inline({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, index) => {
        const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (!match) return part;
        const [, label, href] = match;
        const external = /^https?:/.test(href);
        return (
          <a
            key={index}
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="font-medium text-neutral-900 underline decoration-neutral-300 underline-offset-4 transition-colors hover:decoration-neutral-900"
          >
            {label}
          </a>
        );
      })}
    </>
  );
}

function Heading({ text, level }: { text: string; level: 2 | 3 }) {
  const id = slugifyHeading(text);
  const Tag = level === 2 ? "h2" : "h3";
  return (
    <Tag
      id={id}
      className={cn(
        "group scroll-mt-20 font-medium tracking-[-0.02em] text-neutral-900 first:mt-0",
        level === 2 ? "mt-12 text-2xl" : "mt-10 text-xl",
      )}
    >
      <a href={`#${id}`} className="inline-flex items-center gap-2">
        {text}
        <span className="flex size-6 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <IconLink className="size-3.5" />
        </span>
      </a>
    </Tag>
  );
}

function Block({ block, category }: { block: BlogBlock; category: BlogCategory }) {
  switch (block.type) {
    case "heading":
      return <Heading text={block.text} level={block.level ?? 2} />;
    case "paragraph":
      return (
        <p className="mt-5 text-[17px] leading-8 text-neutral-600">
          <Inline text={block.text} />
        </p>
      );
    case "list": {
      const ListTag = block.ordered ? "ol" : "ul";
      return (
        <ListTag className="mt-5 space-y-2.5 [counter-reset:item]">
          {block.items.map((item) => (
            <li
              key={item}
              className="relative pl-7 text-[17px] leading-8 text-neutral-600 [counter-increment:item]"
            >
              {block.ordered ? (
                <span className="absolute left-0 top-0 font-mono text-sm leading-8 text-neutral-400 before:content-[counter(item)'.']" />
              ) : (
                <span className="absolute left-1.5 top-[0.8rem] size-1.5 rounded-full bg-neutral-400" />
              )}
              <Inline text={item} />
            </li>
          ))}
        </ListTag>
      );
    }
    case "quote":
      return (
        <blockquote className="mt-8 border-l-2 border-neutral-900 pl-6 font-serif text-[1.75rem] italic leading-snug text-neutral-900">
          {block.text}
        </blockquote>
      );
    case "callout": {
      const tip = block.variant === "tip";
      const Icon = tip ? IconBulb : IconInfoCircle;
      return (
        <div
          className={cn(
            "mt-8 flex gap-3 rounded-2xl border p-4",
            tip ? "border-green-200 bg-green-50" : "border-blue-200 bg-blue-50",
          )}
        >
          <Icon className={cn("mt-0.5 size-5 shrink-0", tip ? "text-green-700" : "text-blue-700")} />
          <div className={cn("text-[15px] leading-7", tip ? "text-green-900" : "text-blue-900")}>
            {block.title ? <p className="font-medium">{block.title}</p> : null}
            <p className={cn(block.title && "mt-0.5", tip ? "text-green-800" : "text-blue-800")}>
              {block.text}
            </p>
          </div>
        </div>
      );
    }
    case "figure":
      return (
        <FigureZoom
          category={block.category ?? category}
          icon={block.icon}
          label={block.label}
          caption={block.caption}
        />
      );
    case "code":
      return (
        <figure className="mt-8">
          <div className="overflow-hidden rounded-2xl border border-black/20 bg-white ring-4 ring-black/10">
            <div className="grid h-11 grid-cols-[4rem_1fr_4rem] items-center border-b border-neutral-200 px-4">
              <div className="flex gap-1.5">
                <span className="size-2 rounded-full border border-black/70" />
                <span className="size-2 rounded-full border border-black/70" />
                <span className="size-2 rounded-full border border-black/70" />
              </div>
              <span className="truncate text-center font-mono text-xs text-neutral-500">
                {block.filename}
              </span>
            </div>
            {/* Phones wrap long lines instead of clipping them behind a sideways scroll. */}
            <pre className="overflow-x-auto p-4 font-mono text-[12px] leading-6 text-[#24292E] max-sm:whitespace-pre-wrap max-sm:[overflow-wrap:anywhere] sm:p-5 sm:text-[13px]">
              <code>
                {block.code.split("\n").map((line, index) => highlightLine(line, block.language, index))}
              </code>
            </pre>
          </div>
          {block.caption ? (
            <figcaption className="mt-3 text-center text-xs text-neutral-400">{block.caption}</figcaption>
          ) : null}
        </figure>
      );
    case "image":
      return (
        <figure className="mt-8">
          <div
            className={cn(
              "overflow-hidden",
              !block.bare && "rounded-2xl border border-neutral-200 bg-white",
            )}
          >
            {/* Charts and screenshots are authored at their own size; scale to the column. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={block.src} alt={block.alt} className="block h-auto w-full" loading="lazy" />
          </div>
          {block.caption ? (
            <figcaption className="mt-3 text-center text-xs text-neutral-400">
              {block.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    case "video": {
      const silentLoop = block.loop !== false;
      return (
        <figure className="mt-8">
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-950">
            <video
              src={block.src}
              poster={block.poster}
              controls
              playsInline
              preload="metadata"
              muted={silentLoop}
              loop={silentLoop}
              autoPlay={silentLoop}
              className="block h-auto w-full"
            />
          </div>
          {block.caption ? (
            <figcaption className="mt-3 text-center text-xs text-neutral-400">
              {block.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    }
    case "stats":
      return (
        <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-neutral-200 bg-neutral-200 sm:grid-cols-3">
          {block.items.map((item) => (
            <div key={item.label} className="bg-white p-5">
              <p className="font-mono text-2xl tracking-[-0.03em] text-warm">{item.value}</p>
              <p className="mt-2 text-sm leading-snug text-neutral-500">{item.label}</p>
            </div>
          ))}
        </div>
      );
  }
}

export default function PostBody({
  blocks,
  category,
}: {
  blocks: BlogBlock[];
  category: BlogCategory;
}) {
  return (
    <div>
      {blocks.map((block, index) => (
        <Block key={index} block={block} category={category} />
      ))}
    </div>
  );
}
