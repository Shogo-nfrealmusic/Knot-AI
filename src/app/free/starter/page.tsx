import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import SitePageLayout from "@/app/components/SitePageLayout";
import { ISO_CSS } from "@/lib/iso/iso-kit";
import { starterFigureSvg } from "./figure";
import { StarterClient, type StarterFile } from "./StarterClient";

// Reached only from the Kit confirmation email: not linked from /free, not in the sitemap, not indexed.
export const metadata: Metadata = {
  title: "Your Copilot OS Starter | Shogo Kikuchi",
  description: "The Claude Code setup two of us run our business on.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-static";

const DIR = join(process.cwd(), "src/content/starter");

const FILES: Omit<StarterFile, "body">[] = [
  { path: "START-HERE.md", role: "Read this first. The 15-minute setup and the three rules." },
  { path: "CLAUDE.md", role: "The template. Your goal, your priorities, when Claude should push back." },
  { path: "prompts/interview.md", role: "Paste it into Claude Code. Claude interviews you and fills in CLAUDE.md." },
  { path: "agents/verifier.md", role: "A second agent that checks the first one's work." },
  { path: "diagnostic.md", role: "20 questions. Your lowest part is where to spend your next hour." },
];

export default function StarterPage() {
  const files: StarterFile[] = FILES.map((file) => ({ ...file, body: readFileSync(join(DIR, file.path), "utf8") }));
  return (
    <SitePageLayout>
      <style>{ISO_CSS}</style>
      <StarterClient files={files} figure={starterFigureSvg()} />
    </SitePageLayout>
  );
}
