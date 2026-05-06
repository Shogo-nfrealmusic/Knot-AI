import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  projectType?: unknown;
  timeline?: unknown;
  context?: unknown;
};

const requiredEnv = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "CONTACT_TO",
] as const;

function isString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function validatePayload(payload: ContactPayload) {
  const fields = {
    name: isString(payload.name) ? payload.name.trim() : "",
    email: isString(payload.email) ? payload.email.trim() : "",
    company: isString(payload.company) ? payload.company.trim() : "",
    projectType: isString(payload.projectType) ? payload.projectType.trim() : "",
    timeline: isString(payload.timeline) ? payload.timeline.trim() : "",
    context: isString(payload.context) ? payload.context.trim() : "",
  };

  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email);

  if (
    !fields.name ||
    !emailIsValid ||
    !fields.company ||
    !fields.projectType ||
    !fields.timeline ||
    !fields.context
  ) {
    return null;
  }

  return fields;
}

function getMissingEnv() {
  return requiredEnv.filter((key) => !process.env[key]);
}

function buildTextEmail(fields: NonNullable<ReturnType<typeof validatePayload>>) {
  return [
    "New Knot contact form submission",
    "",
    `Name: ${fields.name}`,
    `Email: ${fields.email}`,
    `Company / project: ${fields.company}`,
    `Project type: ${fields.projectType}`,
    `Timeline: ${fields.timeline}`,
    "",
    "Context:",
    fields.context,
  ].join("\n");
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildHtmlEmail(fields: NonNullable<ReturnType<typeof validatePayload>>) {
  const rows = [
    ["Name", fields.name],
    ["Email", fields.email],
    ["Company / project", fields.company],
    ["Project type", fields.projectType],
    ["Timeline", fields.timeline],
  ];

  return `
    <div style="font-family: Inter, Arial, sans-serif; color: #111827;">
      <h1 style="font-size: 20px; margin: 0 0 16px;">New Knot contact form submission</h1>
      <table style="border-collapse: collapse; width: 100%; max-width: 680px;">
        ${rows
          .map(
            ([label, value]) => `
              <tr>
                <td style="border: 1px solid #e5e7eb; padding: 10px 12px; width: 180px; color: #6b7280;">${escapeHtml(label)}</td>
                <td style="border: 1px solid #e5e7eb; padding: 10px 12px;">${escapeHtml(value)}</td>
              </tr>
            `,
          )
          .join("")}
      </table>
      <h2 style="font-size: 14px; margin: 24px 0 8px; color: #6b7280;">Context</h2>
      <p style="white-space: pre-wrap; line-height: 1.6; max-width: 680px;">${escapeHtml(fields.context)}</p>
    </div>
  `;
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

  const port = Number(process.env.SMTP_PORT);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.CONTACT_FROM ?? process.env.SMTP_USER,
      to: process.env.CONTACT_TO,
      replyTo: fields.email,
      subject: `New Knot inquiry: ${fields.projectType} from ${fields.company}`,
      text: buildTextEmail(fields),
      html: buildHtmlEmail(fields),
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
