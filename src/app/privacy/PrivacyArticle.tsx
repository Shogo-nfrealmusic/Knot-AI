"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { site } from "@/lib/site";

const lastUpdated = "September 15, 2026";

const sections = [
  {
    title: "1. Information I Collect",
    body: "When you use the contact form, I collect:",
    bullets: [
      "Name",
      "Email address",
      "Company or project name",
      "Project type and timeline",
      "The message you write",
    ],
  },
  {
    title: "2. How I Use It",
    body: "I use this information only to:",
    bullets: [
      "Reply to your inquiry",
      "Discuss and scope a potential project",
      "Follow up on an engagement you have started",
    ],
  },
  {
    title: "3. Sharing with Third Parties",
    body: "I do not sell your personal information, and I do not share it with third parties except:",
    bullets: [
      "When you have given explicit consent",
      "When required by applicable law or legal process",
      "When necessary to protect my rights, property, or safety",
    ],
  },
];

const textClassName =
  "mt-5 text-[15px] leading-relaxed tracking-[-0.01em] text-text-secondary";

const headingClassName =
  "text-[clamp(1.35rem,2.4vw,1.5rem)] font-semibold leading-tight tracking-[-0.018em] text-text-primary";

const linkClassName =
  "text-text-primary underline decoration-neutral-300 underline-offset-4 transition-colors hover:text-neutral-900 hover:decoration-neutral-500";

function FadeSection({
  children,
  className = "",
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export default function PrivacyArticle() {
  return (
    <article className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-3xl">
        <FadeSection>
          <p className="text-[15px] leading-relaxed tracking-[-0.01em] text-text-secondary">
            This site is operated by {site.name} (&quot;I&quot; or
            &quot;me&quot;), an individual developer based in Japan. This
            Privacy Policy explains what personal information I collect through
            this site, how I use it, and how I protect it.
          </p>
        </FadeSection>

        <div className="mt-14 space-y-14">
          {sections.map((section) => (
            <FadeSection key={section.title}>
              <h2 className={headingClassName}>{section.title}</h2>
              <p className={textClassName}>{section.body}</p>
              <ul className="mt-5 list-disc space-y-2 pl-5 text-[15px] leading-relaxed tracking-[-0.01em] text-text-secondary marker:text-text-muted">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </FadeSection>
          ))}

          <FadeSection>
            <h2 className={headingClassName}>4. Service Providers</h2>
            <p className={textClassName}>
              To run this site and reply to you, I rely on the following
              service providers:
            </p>
            <ul className="mt-5 list-disc space-y-2 pl-5 text-[15px] leading-relaxed tracking-[-0.01em] text-text-secondary marker:text-text-muted">
              <li>
                <strong className="font-semibold text-text-primary">
                  Hosting
                </strong>
                : Vercel Inc. (United States)
              </li>
              <li>
                <strong className="font-semibold text-text-primary">
                  Email
                </strong>
                : Google LLC (United States). Contact form submissions are
                delivered to me by email.
              </li>
            </ul>
            <p className={textClassName}>
              These providers process information under their own privacy
              policies and data processing standards.
            </p>
          </FadeSection>

          <FadeSection>
            <h2 className={headingClassName}>5. Data Security</h2>
            <p className={textClassName}>
              I take reasonable and appropriate measures to protect your
              personal information from loss, destruction, alteration, and
              unauthorized access.
            </p>
          </FadeSection>

          <FadeSection>
            <h2 className={headingClassName}>6. Access Logs and Cookies</h2>
            <div className="mt-5 space-y-5 text-[15px] leading-relaxed tracking-[-0.01em] text-text-secondary">
              <p>
                This site may record access information (such as IP addresses,
                browser types, and referring URLs) as logs for security and
                statistical purposes. These logs do not contain information
                that directly identifies individuals.
              </p>
              <p>
                This site may use cookies to improve your experience. You can
                disable cookies in your browser settings, though some
                functionality may be affected.
              </p>
            </div>
          </FadeSection>

          <FadeSection>
            <h2 className={headingClassName}>7. Your Rights</h2>
            <p className={textClassName}>
              You can ask me to access, correct, or delete the personal
              information I hold about you. Email me at{" "}
              <a href={`mailto:${site.email}`} className={linkClassName}>
                {site.email}
              </a>{" "}
              or use the{" "}
              <Link href="/contact" className={linkClassName}>
                contact form
              </Link>
              .
            </p>
          </FadeSection>

          <FadeSection>
            <h2 className={headingClassName}>8. International Users</h2>
            <p className={textClassName}>
              I am based in Japan. By using this site or submitting the contact
              form, you understand that your information may be transferred to,
              stored in, and processed in Japan and the United States (where my
              service providers operate).
            </p>
          </FadeSection>

          <FadeSection>
            <h2 className={headingClassName}>9. Changes to This Policy</h2>
            <p className={textClassName}>
              I may update this Privacy Policy from time to time. Any changes
              will be posted on this page with an updated revision date.
            </p>
          </FadeSection>

          <FadeSection>
            <h2 className={headingClassName}>10. Contact</h2>
            <p className={textClassName}>
              For questions about this Privacy Policy, email me at{" "}
              <a href={`mailto:${site.email}`} className={linkClassName}>
                {site.email}
              </a>
              .
            </p>
          </FadeSection>
        </div>

        <div className="mt-16 border-t border-border pt-6 text-[13px] leading-relaxed text-text-muted">
          <p>
            <strong className="font-semibold text-text-secondary">
              Last updated
            </strong>
            : {lastUpdated}
          </p>
        </div>
      </div>
    </article>
  );
}
