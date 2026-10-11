"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { useInView, useReducedMotion } from "motion/react";
import { IconArrowUpRight } from "@tabler/icons-react";
import type { IconType } from "react-icons";
import { SiGo, SiPython, SiReact, SiTypescript } from "react-icons/si";
import { cn } from "@/lib/utils";

const ROTATE_MS = 4000;

// Syntax colors from the min-light theme dub.co uses for its SDK snippets.
const colors = {
  keyword: "#D32F2F",
  string: "#22863A",
  fn: "#6F42C1",
  type: "#1976D2",
  comment: "#6A737D",
  plain: "#24292E",
};

type Lang = {
  id: string;
  label: string;
  file: string;
  project: string;
  Icon: IconType;
  comment: "//" | "#";
  keywords: string[];
  code: string;
};

// Short excerpts in the shape of the real projects on /work. No real keys, IDs, or numbers.
const langs: Lang[] = [
  {
    id: "go",
    label: "Go",
    file: "booking/deposit.go",
    project: "Booking platform",
    Icon: SiGo,
    comment: "//",
    keywords: ["func", "return", "map", "string", "error", "var", "if", "nil"],
    code: `// 30% at booking. The balance is collected after the shoot.
func NewDeposit(b Booking) (*stripe.PaymentIntent, error) {
  deposit := b.TotalAmount * 30 / 100

  return paymentintent.New(&stripe.PaymentIntentParams{
    Amount:   stripe.Int64(deposit),
    Currency: stripe.String(b.Currency),
    Metadata: map[string]string{"booking_id": b.ID},
  })
}`,
  },
  {
    id: "ts",
    label: "TypeScript",
    file: "app/book/time-slot-step.tsx",
    project: "Booking funnel",
    Icon: SiTypescript,
    comment: "//",
    keywords: ["export", "function", "const", "return", "import", "from"],
    code: `// Every funnel step is measured, so drop-offs show up in GA4.
export function TimeSlotStep({ date, onSelect }: StepProps) {
  const pick = (slot: Slot) => {
    gtag("event", "select_time_slot", { date, slot: slot.start });
    onSelect(slot);
  };

  return <SlotGrid date={date} onPick={pick} />;
}`,
  },
  {
    id: "py",
    label: "Python",
    file: "pipeline/morning_batch.py",
    project: "Content pipeline",
    Icon: SiPython,
    comment: "#",
    keywords: ["def", "for", "in", "return", "None", "import", "from"],
    code: `# Runs every morning with no human input.
def run_morning_batch(date: str) -> None:
    clips = select_clips(source="footage/", limit=10)

    for clip in clips:
        caption = generate_caption(clip)
        video = render_short(clip, caption)
        queue_for_publish(video, date=date)`,
  },
  {
    id: "rn",
    label: "React Native",
    file: "staff-app/ClaimButton.tsx",
    project: "Staff app",
    Icon: SiReact,
    comment: "//",
    keywords: ["export", "function", "const", "return"],
    code: `// Photographers claim open shoots themselves.
export function ClaimButton({ shoot }: { shoot: Shoot }) {
  const claim = useMutation({
    mutationFn: () => api.post(\`/shoots/\${shoot.id}/claim\`),
  });

  return (
    <Pressable onPress={() => claim.mutate()}>
      <Text>{claim.isSuccess ? "Claimed" : "Claim shoot"}</Text>
    </Pressable>
  );
}`,
  },
];

function highlight(lang: Lang) {
  const comment = lang.comment === "#" ? "#.*$" : "\\/\\/.*$";
  const pattern = new RegExp(
    `(${comment})|("(?:[^"\\\\]|\\\\.)*"|\`[^\`]*\`)|\\b([A-Za-z_]\\w*)(?=\\s*\\()|\\b([A-Za-z_]\\w*)\\b|(\\d+)`,
    "gm",
  );
  const keywords = new Set(lang.keywords);

  return lang.code.split("\n").map((line, lineIndex) => {
    const parts: { text: string; color: string }[] = [];
    let last = 0;
    for (const match of line.matchAll(pattern)) {
      const index = match.index ?? 0;
      if (index > last) parts.push({ text: line.slice(last, index), color: colors.plain });
      const [text, isComment, isString, fnName, ident, num] = match;
      let color = colors.plain;
      if (isComment) color = colors.comment;
      else if (isString) color = colors.string;
      else if (fnName) color = keywords.has(fnName) ? colors.keyword : colors.fn;
      else if (ident) {
        if (keywords.has(ident)) color = colors.keyword;
        else if (/^[A-Z]/.test(ident)) color = colors.type;
      } else if (num) color = colors.type;
      parts.push({ text, color });
      last = index + text.length;
    }
    if (last < line.length) parts.push({ text: line.slice(last), color: colors.plain });

    return (
      <span key={lineIndex} className="block min-h-[1.5em]">
        {parts.map((part, partIndex) => (
          <span key={partIndex} style={{ color: part.color }}>
            {part.text}
          </span>
        ))}
      </span>
    );
  });
}

export default function StackTabs({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const inView = useInView(ref, { amount: 0.4 });
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(false);

  const rotating = inView && !pinned && !reduceMotion;

  useEffect(() => {
    if (!rotating) return;
    const id = setInterval(() => setActive((i) => (i + 1) % langs.length), ROTATE_MS);
    return () => clearInterval(id);
  }, [rotating]);

  const select = (index: number) => {
    setPinned(true);
    setActive(index);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = (index + step + langs.length) % langs.length;
    select(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div ref={ref} className={cn("flex w-full flex-col items-center", className)}>
      <div className="flex gap-1 rounded-full bg-neutral-200 p-1.5 sm:gap-2">
        {langs.map(({ id, label, Icon }, index) => {
          const isActive = index === active;
          return (
            <button
              key={id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              type="button"
              aria-pressed={isActive}
              aria-label={label}
              title={label}
              onClick={() => select(index)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={cn(
                "flex h-8 items-center rounded-full px-3 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 sm:px-4",
                isActive ? "bg-black text-white" : "text-neutral-500 hover:bg-black/10 hover:text-neutral-800",
              )}
            >
              <Icon className="size-4" aria-hidden />
            </button>
          );
        })}
      </div>

      <div className="relative mt-3 h-[340px] w-full [mask-image:linear-gradient(black_78%,transparent_98%)]">
        {langs.map((lang, index) => {
          const isActive = index === active;
          return (
            <div
              key={lang.id}
              aria-hidden={!isActive}
              inert={!isActive}
              className={cn(
                "absolute inset-x-0 top-0 px-2 pt-3 transition-opacity duration-500",
                isActive ? "opacity-100" : "opacity-0",
              )}
            >
              <div className="flex flex-col rounded-2xl border border-black/20 bg-white text-left ring-4 ring-black/10">
                {/* Fixed side columns keep the file name centred without squeezing it into a third. */}
                <div className="grid h-11 shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center border-b border-neutral-200 px-2.5 text-sm sm:grid-cols-[3.5rem_minmax(0,1fr)_3.5rem]">
                  <div className="hidden items-center gap-2 px-2 sm:flex">
                    <span className="size-2 rounded-full border border-black/70" />
                    <span className="size-2 rounded-full border border-black/70" />
                    <span className="size-2 rounded-full border border-black/70" />
                  </div>
                  <div className="truncate px-2 font-mono text-[12px] text-neutral-500 sm:text-center">
                    {lang.file}
                  </div>
                  <div className="flex justify-end">
                    <Link
                      href="/work"
                      title={`${lang.project} on /work`}
                      className="rounded p-1 text-neutral-500 transition-colors hover:bg-black/10 hover:text-neutral-700"
                    >
                      <IconArrowUpRight className="size-4" />
                    </Link>
                  </div>
                </div>
                <pre className="overflow-hidden p-4 font-mono text-[11.5px] leading-[1.5] whitespace-pre-wrap [overflow-wrap:anywhere] sm:p-5 sm:text-[12.5px]">
                  <code>{highlight(lang)}</code>
                </pre>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
