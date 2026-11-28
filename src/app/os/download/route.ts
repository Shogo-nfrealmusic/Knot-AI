import { NextResponse } from "next/server";
import { paidSession } from "@/lib/os-checkout";

// /os/download?session_id=cs_... → the Copilot OS zip, only for a paid session from one of our links.
// The file's real location (OS_KIT_URL) stays on the server.

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get("session_id") ?? "";
  const paid = await paidSession(sessionId);
  if (!paid) return NextResponse.json({ error: "We couldn't confirm this purchase. Reply to your receipt email and I'll sort it out." }, { status: 403 });

  const source = process.env.OS_KIT_URL;
  if (!source) return NextResponse.json({ error: "Download isn't set up yet. Reply to your receipt email and I'll send the files." }, { status: 503 });

  const file = await fetch(source, { cache: "no-store" });
  if (!file.ok || !file.body) {
    console.error(`Copilot OS kit fetch failed: ${file.status}`);
    return NextResponse.json({ error: "Download failed. Try again in a minute." }, { status: 502 });
  }
  return new NextResponse(file.body, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": 'attachment; filename="Copilot-OS.zip"',
      "Cache-Control": "private, no-store",
    },
  });
}
