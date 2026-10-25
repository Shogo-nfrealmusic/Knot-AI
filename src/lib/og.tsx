import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Link-preview images for the list pages (/work, /blog and its categories, /free, /links). The home
// page keeps src/app/opengraph-image.png, which is also every other page's image. Each route's
// opengraph-image.tsx and twitter-image.tsx calls listImage() with its own words, so a new list page
// gets its image by adding those two small files. Drawn at build time; same look as the site's
// root opengraph-image.png: white ground, 60px grid, the mark, near-black title, grey second half.

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

export type ListImage = {
  /** Small orange line under the name, e.g. "WORK". */
  kicker: string;
  /** Black part of the headline. */
  title: string;
  /** Grey part that follows it. */
  rest?: string;
  /** Up to three short chips along the bottom. */
  chips?: string[];
  /** Bottom-right, e.g. "SHOGO.BUILD/WORK". */
  footer: string;
};

const fontDir = join(process.cwd(), "src/lib/og-fonts");

async function fonts() {
  const [bold, mono] = await Promise.all([
    readFile(join(fontDir, "Inter-700.ttf")),
    readFile(join(fontDir, "JetBrainsMono-400.ttf")),
  ]);
  return [
    { name: "Inter", data: bold, weight: 700 as const, style: "normal" as const },
    { name: "JetBrains Mono", data: mono, weight: 400 as const, style: "normal" as const },
  ];
}

function Mark() {
  return (
    <svg width={88} height={88} viewBox="0 0 1024 1024">
      <rect width={1024} height={1024} rx={140} fill="#171717" />
      <polygon points="591,232 757,232 610,487 444,487" fill="#ffffff" />
      <polygon points="415,537 581,537 434,792 268,792" fill="#ffffff" />
    </svg>
  );
}

export async function listImage({ kicker, title, rest, chips = [], footer }: ListImage) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#ffffff",
          backgroundImage:
            "linear-gradient(#efefef 1px, transparent 1px), linear-gradient(90deg, #efefef 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          padding: "72px 120px 64px",
          fontFamily: "Inter",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <Mark />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 30, fontWeight: 700, color: "#171717", letterSpacing: -0.5 }}>Shogo Kikuchi</div>
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 17, color: "#e0552f", letterSpacing: 2, marginTop: 4 }}>
              {kicker}
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            marginTop: 70,
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: -2.2,
            color: "#171717",
            maxWidth: 960,
          }}
        >
          {/* One box per word: the image renderer wraps boxes, not text runs, so this lets the grey
              half continue on the same line as the black half, as in the root image. */}
          {[
            ...title.split(" ").map((word) => ({ word, color: "#171717" })),
            ...(rest ?? "").split(" ").filter(Boolean).map((word) => ({ word, color: "#a3a3a3" })),
          ].map(({ word, color }, i) => (
            <span key={i} style={{ color, marginRight: 16 }}>
              {word}
            </span>
          ))}
        </div>
        <div style={{ display: "flex", flexGrow: 1 }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 12 }}>
            {chips.slice(0, 3).map((chip) => (
              <div
                key={chip}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  border: "1.5px solid #e2e2e2",
                  borderRadius: 999,
                  padding: "8px 18px",
                  background: "#ffffff",
                  fontFamily: "JetBrains Mono",
                  fontSize: 17,
                  color: "#404040",
                }}
              >
                <div style={{ width: 7, height: 7, borderRadius: 7, background: "#171717" }} />
                {chip}
              </div>
            ))}
          </div>
          <div style={{ fontFamily: "JetBrains Mono", fontSize: 16, color: "#a3a3a3", letterSpacing: 2 }}>{footer}</div>
        </div>
      </div>
    ),
    { ...ogSize, fonts: await fonts() },
  );
}
