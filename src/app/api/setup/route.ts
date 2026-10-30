import { NextResponse } from "next/server";
import { buildEmail, escapeHtml, getMissingEnv, isString, sendReceipt, sendToShogo, validEmail } from "@/lib/mail";
import { BILLING, PLANS } from "@/lib/setup";

// Copilot OS Setup applications from /setup/apply. Same inbox and receipt pattern as /api/coaching.

type SetupPayload = { name?: unknown; email?: unknown; business?: unknown; plan?: unknown; billing?: unknown; job?: unknown; website?: unknown };

const text = (value: unknown, max: number) => (isString(value) ? value.trim().slice(0, max) : "");
const PLAN_IDS = PLANS.map((p) => p.id) as string[];
const BILLING_IDS = BILLING.map((b) => b.id) as string[];

function validatePayload(payload: SetupPayload) {
  const fields = {
    name: text(payload.name, 120),
    email: text(payload.email, 200),
    business: text(payload.business, 200),
    plan: text(payload.plan, 20),
    // Older clients sent no billing term; treat that as monthly.
    billing: text(payload.billing, 20) || "monthly",
    job: text(payload.job, 4000),
    website: text(payload.website, 300),
  };
  if (!fields.name || !validEmail(fields.email) || !fields.business || !PLAN_IDS.includes(fields.plan) || !BILLING_IDS.includes(fields.billing) || !fields.job) return null;
  return fields;
}

export async function POST(request: Request) {
  let payload: SetupPayload;
  try {
    payload = (await request.json()) as SetupPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const fields = validatePayload(payload);
  if (!fields) return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });

  const missingEnv = getMissingEnv();
  if (missingEnv.length > 0) {
    return NextResponse.json({ error: `Email is not configured. Missing: ${missingEnv.join(", ")}.` }, { status: 500 });
  }

  const { text: body, html } = buildEmail(
    "New Copilot OS Setup application",
    [
      ["Name", fields.name],
      ["Email", fields.email],
      ["Business", fields.business],
      ["Website", fields.website || "—"],
      ["Plan", fields.plan],
      ["Billing", BILLING.find((b) => b.id === fields.billing)!.label],
    ],
    "The job they want off their plate",
    fields.job,
  );

  try {
    await sendToShogo({ replyTo: fields.email, subject: `Setup application: ${fields.plan} from ${fields.business}`, text: body, html });
  } catch (error) {
    console.error("Failed to send setup application email", error);
    return NextResponse.json({ error: "Failed to send. Please try again later." }, { status: 500 });
  }

  // Fixed receipt: nothing the applicant typed goes into it.
  try {
    await sendReceipt(fields.email, RECEIPT);
  } catch (error) {
    console.error("Failed to send setup receipt", error);
  }
  return NextResponse.json({ ok: true });
}

const RECEIPT_TEXT = [
  "Hi,",
  "",
  "Thanks for applying for Copilot OS Setup. I read every application myself.",
  "",
  "Within two business days I'll reply to this email with whether it's a fit, and if it is, a payment link and the first step.",
  "",
  "Shogo",
  "shogo.build",
].join("\n");

const RECEIPT = {
  subject: "Got your Copilot OS Setup application",
  text: RECEIPT_TEXT,
  html: `<div style="font-family: Inter, Arial, sans-serif; color: #111827; line-height: 1.6; max-width: 560px;">${RECEIPT_TEXT.split("\n")
    .map((line) => (line ? `<p style="margin: 0;">${escapeHtml(line)}</p>` : `<p style="margin: 0;">&nbsp;</p>`))
    .join("")}</div>`,
};
