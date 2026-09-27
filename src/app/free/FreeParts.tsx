import type { ComponentType } from "react";
import Link from "next/link";
import {
  IconArrowUpRight,
  IconBrandGithub,
  IconBrain,
  IconBrowserCheck,
  IconBuildingStore,
  IconCpu,
  IconCube,
  IconFileDescription,
  IconGitPullRequest,
  IconNotebook,
  IconPalette,
  IconPlugConnected,
  IconScissors,
  IconUsersGroup,
  IconWand,
} from "@tabler/icons-react";
import { CommandCopy } from "@/app/free/CodeCopy";
import { GridPattern } from "@/app/components/ui/grid-pattern-dub";
import {
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  pad,
  type DropAbout,
  type FreeDrop,
  type FreeTool,
  type RichText,
  type ToolIcon,
} from "@/lib/free";
import { cn } from "@/lib/utils";

const icons: Record<ToolIcon, ComponentType<{ className?: string }>> = {
  palette: IconPalette,
  wand: IconWand,
  browser: IconBrowserCheck,
  file: IconFileDescription,
  cube: IconCube,
  plug: IconPlugConnected,
  cpu: IconCpu,
  scissors: IconScissors,
  review: IconGitPullRequest,
  brain: IconBrain,
  notebook: IconNotebook,
  store: IconBuildingStore,
  council: IconUsersGroup,
};

// Same tile as the blog covers: white, 22% radius, hairline border, soft drop shadow.
export function ToolTile({ icon, className }: { icon: ToolIcon; className?: string }) {
  const Icon = icons[icon];
  return (
    <span
      className={cn(
        "flex aspect-square shrink-0 items-center justify-center rounded-[22%] border border-neutral-200 bg-white shadow-[0_12px_32px_-12px_rgba(0,0,0,0.18)]",
        className,
      )}
    >
      <Icon className="size-1/2 text-neutral-800" />
    </span>
  );
}

// Cover for a drop card: the blog's colour mesh + 60px grid, with the drop's tool tiles in a row.
export function DropCover({ drop }: { drop: FreeDrop }) {
  return (
    <div
      aria-hidden
      className="relative isolate flex aspect-[1200/630] w-full flex-col items-center justify-center overflow-hidden bg-neutral-50"
    >
      <div className="absolute -left-[10%] top-[35%] h-[90%] w-[55%] rounded-full bg-[#855AFC]/20 blur-3xl" />
      <div className="absolute left-[30%] -top-[30%] h-[80%] w-[45%] rounded-full bg-[#72FE7D]/15 blur-3xl" />
      <div className="absolute -right-[10%] top-[30%] h-[90%] w-[50%] rounded-full bg-[#3A8BFD]/20 blur-3xl" />
      <GridPattern
        cellSize={60}
        strokeWidth={1}
        className="text-black/[0.06] [mask-image:radial-gradient(75%_75%_at_50%_50%,black,transparent)]"
      />
      {drop.kit ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={drop.kit.cover} alt="" className="relative h-[62%] w-auto rounded-md border border-neutral-200 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.45)]" />
      ) : drop.guide ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={drop.guide.cover} alt="" className="relative h-[62%] w-auto rounded-md border border-neutral-200 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.45)]" />
      ) : (
        <div className="relative flex items-center gap-[2.5%] px-[8%]">
          {drop.tools.map((tool) => (
            <ToolTile key={tool.name} icon={tool.icon} className="w-[13%] min-w-10" />
          ))}
        </div>
      )}
      <span className="relative mt-[4%] rounded-full border border-neutral-200 bg-white/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-neutral-600 backdrop-blur-sm">
        Reel {pad(drop.number)} · {drop.kit ? "build kit" : drop.guide ? "free guide" : `${drop.tools.length} ${drop.tools.length === 1 ? "tool" : "tools"}`}
      </span>
    </div>
  );
}

// One tool: number, tile, name, one line, and a GitHub button. Stacks on phones (most visitors come from Instagram).
// Without install commands the whole row is the link; with them, only the button is (copy buttons can't sit inside a link).
export function ToolRow({ tool, index }: { tool: FreeTool; index: number }) {
  const repo = tool.href.replace(/^https?:\/\/(www\.)?github\.com\//, "");
  const grid =
    "grid grid-cols-[auto_1fr] items-start gap-x-4 gap-y-4 px-5 py-7 sm:grid-cols-[3rem_auto_1fr_auto] sm:items-center sm:gap-x-6 sm:px-10 sm:py-8";
  const button =
    "col-span-2 inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-5 text-sm font-medium text-neutral-900 transition-all sm:col-span-1";
  const body = (
    <>
      <span className="hidden font-mono text-[13px] text-neutral-400 sm:block">{pad(index + 1)}</span>
      <ToolTile icon={tool.icon} className="w-12 sm:w-14" />
      <span className="min-w-0">
        <span className="flex items-baseline gap-2">
          <span className="font-mono text-[11px] text-neutral-400 sm:hidden">{pad(index + 1)}</span>
          <span className="text-lg font-semibold tracking-[-0.015em] text-neutral-900">{tool.name}</span>
        </span>
        <span className="mt-1.5 block text-[15px] leading-relaxed tracking-[-0.01em] text-neutral-500">{tool.what}</span>
        <span className="mt-2 block truncate font-mono text-[11px] text-neutral-400">github.com/{repo}</span>
      </span>
    </>
  );
  const buttonInner = (
    <>
      <IconBrandGithub className="size-4" />
      Open on GitHub
      <IconArrowUpRight className="size-4 text-neutral-400 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </>
  );

  return (
    <li
      className="animate-slide-up-fade [--offset:12px]"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {tool.install?.length ? (
        <div className={grid}>
          {body}
          <a
            href={tool.href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(button, "group hover:bg-neutral-50 hover:ring-4 hover:ring-black/5 sm:col-start-4 sm:row-start-1")}
          >
            {buttonInner}
          </a>
          <div className="col-span-2 sm:col-span-2 sm:col-start-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-neutral-400">
              Install · paste into Claude Code
            </p>
            <div className="mt-2 space-y-2">
              {tool.install.map((command) => (
                <CommandCopy key={command} command={command} />
              ))}
            </div>
            {tool.note ? <p className="mt-3 text-sm leading-relaxed text-neutral-500">{tool.note}</p> : null}
          </div>
        </div>
      ) : (
        <a
          href={tool.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn("group transition-colors duration-200 hover:bg-neutral-50", grid)}
        >
          {body}
          <span className={cn(button, "group-hover:bg-neutral-50 group-hover:ring-4 group-hover:ring-black/5")}>
            {buttonInner}
          </span>
        </a>
      )}
    </li>
  );
}

// One-line tip under a drop's tool list, with the command to copy.
export function DropTip({ tip }: { tip: NonNullable<FreeDrop["tip"]> }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-2 border-t border-neutral-200 px-5 py-6 text-[15px] text-neutral-500 sm:px-10">
      <span className="font-mono text-[13px] text-warm">TIP</span>
      <span>{tip.before}</span>
      <CommandCopy command={tip.command} className="w-auto" />
      <span>{tip.after}</span>
    </div>
  );
}

function Rich({ parts }: { parts: RichText }) {
  return (
    <>
      {parts.map((part, i) =>
        typeof part === "string" ? (
          part
        ) : (
          <a
            key={i}
            href={part.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-900 underline decoration-neutral-300 underline-offset-4 transition-colors hover:decoration-neutral-900"
          >
            {part.text}
          </a>
        ),
      )}
    </>
  );
}

const aboutLabel = "font-mono text-[11px] uppercase tracking-[0.12em] text-neutral-400";

// Longer write-up under a single-tool drop: how it works, a second install path, a real run, caveats, and why.
export function DropAboutBlock({ about }: { about: DropAbout }) {
  return (
    <div className="divide-y divide-neutral-200 border-t border-neutral-200">
      {about.steps?.length ? (
        <section className="px-5 py-8 sm:px-10">
          <p className={aboutLabel}>How it works</p>
          <ol className="mt-4 space-y-4">
            {about.steps.map((step, index) => (
              <li key={step.title} className="grid grid-cols-[1.75rem_1fr] gap-x-2">
                <span className="font-mono text-[13px] leading-relaxed text-neutral-400">{index + 1}</span>
                <span className="text-[15px] leading-relaxed text-neutral-500">
                  <span className="font-semibold text-neutral-900">{step.title}.</span> {step.text}
                </span>
              </li>
            ))}
          </ol>
        </section>
      ) : null}
      {about.altInstall ? (
        <section className="px-5 py-8 sm:px-10">
          <p className={aboutLabel}>{about.altInstall.label}</p>
          <div className="mt-2 space-y-2">
            {about.altInstall.commands.map((command) => (
              <CommandCopy key={command} command={command} />
            ))}
          </div>
        </section>
      ) : null}
      {about.example ? (
        <section className="px-5 py-8 sm:px-10">
          <p className={aboutLabel}>Example</p>
          <p className="mt-3 font-mono text-[13px] leading-relaxed text-neutral-900 [overflow-wrap:anywhere]">
            {about.example.question}
          </p>
          <pre className="mt-3 overflow-x-auto rounded-md border border-neutral-200 bg-neutral-50 px-4 py-3 font-mono text-[12px] leading-relaxed text-neutral-800">
            {about.example.output}
          </pre>
          <p className="mt-2 text-xs text-neutral-400">{about.example.source}</p>
        </section>
      ) : null}
      {about.notes?.length ? (
        <section className="px-5 py-8 sm:px-10">
          <p className={aboutLabel}>Good to know</p>
          <ul className="mt-3 space-y-2">
            {about.notes.map((note) => (
              <li key={note} className="flex items-start gap-3 text-[15px] leading-relaxed text-neutral-500">
                <span className="mt-2.5 size-1 shrink-0 rounded-full bg-neutral-400" />
                {note}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {about.why?.length ? (
        <section className="px-5 py-8 sm:px-10">
          <p className={aboutLabel}>Why</p>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-neutral-500">
            <Rich parts={about.why} />
          </p>
        </section>
      ) : null}
    </div>
  );
}

// Closing block: where these come from, and the way back to the full list.
export function FollowBlock({ showAllLink = true }: { showAllLink?: boolean }) {
  return (
    <div className="flex flex-col items-center px-5 py-16 text-center sm:py-20">
      <p className="font-mono text-[13px] text-warm">MORE LIKE THIS</p>
      <h2 className="mt-4 max-w-md text-balance text-2xl font-medium tracking-[-0.03em] text-neutral-900 sm:text-3xl">
        I break down one AI tool you can actually use in every reel.
      </h2>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center rounded-lg bg-neutral-900 px-5 text-sm font-medium text-white transition-all hover:ring-4 hover:ring-black/10"
        >
          @{INSTAGRAM_HANDLE} on Instagram ↗
        </a>
        {showAllLink ? (
          <Link
            href="/free"
            className="inline-flex h-10 items-center rounded-lg border border-neutral-300 bg-white px-5 text-sm font-medium text-neutral-900 transition-all hover:bg-neutral-50 hover:ring-4 hover:ring-black/5"
          >
            Everything from the reels
          </Link>
        ) : null}
      </div>
    </div>
  );
}
