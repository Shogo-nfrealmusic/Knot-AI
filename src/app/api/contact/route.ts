import { NextResponse } from "next/server";
import { buildEmail, getMissingEnv, isString, sendToShogo, validEmail } from "@/lib/mail";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  projectType?: unknown;
  timeline?: unknown;
  context?: unknown;
};

function validatePayload(payload: ContactPayload) {
  const fields = {
    name: isString(payload.name) ? payload.name.trim() : "",
    email: isString(payload.email) ? payload.email.trim() : "",
    company: isString(payload.company) ? payload.company.trim() : "",
    projectType: isString(payload.projectType) ? payload.projectType.trim() : "",
    timeline: isString(payload.timeline) ? payload.timeline.trim() : "",
    context: isString(payload.context) ? payload.context.trim() : "",
  };

  if (
    !fields.name ||
    !validEmail(fields.email) ||
    !fields.company ||
    !fields.projectType ||
    !fields.timeline ||
    !fields.context
  ) {
    return null;
  }

  return fields;
}

export async function POST(request: Request) {
  let payload: ContactPayload;

  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const fields = validatePayload(payload);
  if (!fields) {
    return NextResponse.json(
      { error: "Please complete all required fields." },
      { status: 400 },
    );
  }

  const missingEnv = getMissingEnv();
  if (missingEnv.length > 0) {
    return NextResponse.json(
      {
        error: `Email is not configured. Missing: ${missingEnv.join(", ")}.`,
      },
      { status: 500 },
    );
  }

  const { text, html } = buildEmail(
    "New portfolio contact form submission",
    [
      ["Name", fields.name],
      ["Email", fields.email],
      ["Company / project", fields.company],
      ["Project type", fields.projectType],
      ["Timeline", fields.timeline],
    ],
    "Context",
    fields.context,
  );

  try {
    await sendToShogo({
      replyTo: fields.email,
      subject: `New portfolio inquiry: ${fields.projectType} from ${fields.company}`,
      text,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to send contact email", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 },
    );
  }
}
