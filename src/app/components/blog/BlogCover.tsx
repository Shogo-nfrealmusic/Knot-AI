import type { ComponentType } from "react";
import { IconBarbell, IconVideo } from "@tabler/icons-react";
import {
  SiClaude,
  SiGoogleanalytics,
  SiInstagram,
  SiStripe,
} from "react-icons/si";
import { GridPattern } from "@/app/components/ui/grid-pattern-dub";
import type { BlogCategory, CoverIcon } from "@/lib/blog";
import { cn } from "@/lib/utils";

// Generated cover art: a soft color mesh per category, dub's 60px grid, and one tile.
const palettes: Record<BlogCategory, [string, string, string]> = {
  ai: ["#855AFC", "#3A8BFD", "#EEA5BA"],
  engineering: ["#3A8BFD", "#00D5BE", "#855AFC"],
  growth: ["#FD3A4E", "#EEA5BA", "#E4C795"],
  building: ["#72FE7D", "#E4C795", "#3A8BFD"],
};

function MonogramMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex items-center justify-center rounded-[22%] bg-neutral-900 font-mono text-[40%] font-semibold text-white [container-type:inline-size]",
        className,
      )}
    >
      <span className="text-[38cqi] leading-none">SK</span>
    </span>
  );
}

const icons: Record<CoverIcon, { Icon: ComponentType<{ className?: string }>; color: string }> = {
  monogram: { Icon: MonogramMark, color: "" },
  claude: { Icon: SiClaude, color: "text-[#D97757]" },
  stripe: { Icon: SiStripe, color: "text-[#635BFF]" },
  analytics: { Icon: SiGoogleanalytics, color: "text-[#E37400]" },
  instagram: { Icon: SiInstagram, color: "text-[#E4405F]" },
  video: { Icon: IconVideo, color: "text-neutral-800" },
  barbell: { Icon: IconBarbell, color: "text-neutral-800" },
};

export default function BlogCover({
  category,
  icon,
  label,
  size = "card",
  className,
}: {
  category: BlogCategory;
  icon: CoverIcon;
  label: string;
  size?: "card" | "hero" | "thumb";
  className?: string;
}) {
  const [a, b, c] = palettes[category];
  const { Icon, color } = icons[icon];
  const hero = size === "hero";
  const thumb = size === "thumb";

  return (
    <div
      aria-hidden
      className={cn(
        "relative isolate flex aspect-[1200/630] w-full flex-col items-center justify-center overflow-hidden bg-neutral-50",
        className,
      )}
    >
      <div
        className="absolute -left-[10%] top-[35%] h-[90%] w-[55%] rounded-full blur-3xl"
        style={{ backgroundColor: `${a}33` }}
      />
      <div
        className="absolute left-[30%] -top-[30%] h-[80%] w-[45%] rounded-full blur-3xl"
        style={{ backgroundColor: `${b}2e` }}
      />
      <div
        className="absolute -right-[10%] top-[30%] h-[90%] w-[50%] rounded-full blur-3xl"
        style={{ backgroundColor: `${c}33` }}
      />
      <GridPattern
        cellSize={60}
        strokeWidth={1}
        className="text-black/[0.06] [mask-image:radial-gradient(75%_75%_at_50%_50%,black,transparent)]"
      />

      <div
        className={cn(
          "relative flex aspect-square items-center justify-center rounded-[22%] border border-neutral-200 bg-white shadow-[0_12px_32px_-12px_rgba(0,0,0,0.18)]",
          hero ? "w-24 sm:w-28" : thumb ? "w-[26%] rounded-[24%]" : "w-[17%] min-w-12",
        )}
      >
        <Icon className={cn(icon === "monogram" ? "size-[70%]" : "size-1/2", color)} />
      </div>
      {thumb ? null : (
        <span
          className={cn(
            "relative mt-[3%] rounded-full border border-neutral-200 bg-white/80 font-mono uppercase tracking-[0.12em] text-neutral-600 backdrop-blur-sm",
            hero ? "px-3 py-1.5 text-xs" : "px-2.5 py-1 text-[10px]",
          )}
        >
          {label}
        </span>
      )}
    </div>
  );
}
