import { NextResponse } from "next/server";
import { buildEmail, escapeHtml, getMissingEnv, isString, sendReceipt, sendToShogo, validEmail } from "@/lib/mail";
import { COACHING_EXPERIENCE, COACHING_GOALS } from "@/lib/coaching";

// Online 1:1 coaching applications from /links/fit. Same inbox as /api/contact (CONTACT_TO).

type CoachingPayload = {
  name?: unknown;
  email?: unknown;
  instagram?: unknown;
  goal?: unknown;
  experience?: unknown;
  message?: unknown;
};

const text = (value: unknown, max: number) => (isString(value) ? value.trim().slice(0, max) : "");

function validatePayload(payload: CoachingPayload) {
  const fields = {
    name: text(payload.name, 120),
    email: text(payload.email, 200),
    // optional; stored without the leading @ so the email can link straight to the profile
    instagram: text(payload.instagram, 60).replace(/^@+/, ""),
    goal: text(payload.goal, 60),
    experience: text(payload.experience, 60),
    message: text(payload.message, 4000),
  };

  if (
    !fields.name ||
    !validEmail(fields.email) ||
    !(COACHING_GOALS as readonly string[]).includes(fields.goal) ||
    !(COACHING_EXPERIENCE as readonly string[]).includes(fields.experience) ||
    !fields.message
  ) {
    return null;
  }

  return fields;
}

export async function POST(request: Request) {
  let payload: CoachingPayload;

  try {
    payload = (await request.json()) as CoachingPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const fields = validatePayload(payload);
  if (!fields) {
    return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
  }

  const missingEnv = getMissingEnv();
  if (missingEnv.length > 0) {
    return NextResponse.json({ error: `Email is not configured. Missing: ${missingEnv.join(", ")}.` }, { status: 500 });
  }

  const { text: body, html } = buildEmail(
    "New coaching application",
    [
      ["Name", fields.name],
      ["Email", fields.email],
      ["Instagram", fields.instagram ? `https://www.instagram.com/${fields.instagram}/` : "—"],
      ["Goal", fields.goal],
      ["Experience", fields.experience],
    ],
    "About them",
    fields.message,
  );

  try {
    await sendToShogo({
      replyTo: fields.email,
      subject: `Coaching application: ${fields.goal} from ${fields.name}`,
      text: body,
      html,
    });
  } catch (error) {
    console.error("Failed to send coaching email", error);
    return NextResponse.json({ error: "Failed to send. Please try again later." }, { status: 500 });
  }

  // The applicant gets a fixed receipt. Nothing they typed goes into it, so the form can't be used to
  // send someone else a message of the sender's choosing. A failure here doesn't fail the application.
  try {
    await sendReceipt(fields.email, RECEIPT);
  } catch (error) {
    console.error("Failed to send coaching receipt", error);
  }
  return NextResponse.json({ ok: true });
}

const RECEIPT_TEXT = [
  "Hi,",
  "",
  "Thanks for applying for 1:1 online coaching. I've got your application and I'll read it myself.",
  "",
  "I'll reply to this email soon with the next step. If you want to add anything, just reply here.",
  "",
  "Shogo",
  "instagram.com/imshogo.k",
].join("\n");

const RECEIPT = {
  subject: "Got your coaching application",
  text: RECEIPT_TEXT,
  html: `<div style="font-family: Inter, Arial, sans-serif; color: #111827; line-height: 1.6; max-width: 560px;">${RECEIPT_TEXT.split("\n")
    .map((line) => (line ? `<p style="margin: 0;">${escapeHtml(line)}</p>` : `<p style="margin: 0;">&nbsp;</p>`))
    .join("")}</div>`,
};
