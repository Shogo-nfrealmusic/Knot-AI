import nodemailer from "nodemailer";

// Shared by /api/contact (work inquiries) and /api/coaching (fitness coaching applications).
// Both send to CONTACT_TO through the same SMTP account set in Vercel.

const requiredEnv = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "CONTACT_TO"] as const;

export function getMissingEnv() {
  return requiredEnv.filter((key) => !process.env[key]);
}

export function isString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export const validEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/** A heading, a two-column table of fields, then the free-text message: as text and as HTML. */
export function buildEmail(heading: string, rows: [string, string][], messageLabel: string, message: string) {
  const text = [heading, "", ...rows.map(([label, value]) => `${label}: ${value}`), "", `${messageLabel}:`, message].join("\n");
  const html = `
    <div style="font-family: Inter, Arial, sans-serif; color: #111827;">
      <h1 style="font-size: 20px; margin: 0 0 16px;">${escapeHtml(heading)}</h1>
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
      <h2 style="font-size: 14px; margin: 24px 0 8px; color: #6b7280;">${escapeHtml(messageLabel)}</h2>
      <p style="white-space: pre-wrap; line-height: 1.6; max-width: 680px;">${escapeHtml(message)}</p>
    </div>
  `;
  return { text, html };
}

export async function sendToShogo(mail: { replyTo: string; subject: string; text: string; html: string }) {
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
  await transporter.sendMail({
    from: process.env.CONTACT_FROM ?? process.env.SMTP_USER,
    to: process.env.CONTACT_TO,
    ...mail,
  });
}
