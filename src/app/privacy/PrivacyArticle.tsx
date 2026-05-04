"use client";

import Link from "next/link";
import { motion } from "motion/react";

const publishedDate = "May 4, 2026";

const sections = [
  {
    title: "1. Information We Collect",
    body: "We collect the following information through our contact form:",
    bullets: [
      "Name",
      "Work email address",
      "Company name",
      "Team size",
      "Inquiry content (description of workflows or operational challenges)",
    ],
  },
  {
    title: "2. Purpose of Use",
    body: "We use the collected personal information solely for the following purposes:",
    bullets: [
      "Responding to inquiries and providing information about our services",
      "Scheduling and conducting introductory conversations",
      "Following up on potential engagements",
      "Sending occasional updates if explicitly requested",
    ],
  },
  {
    title: "3. Sharing with Third Parties",
    body: "We do not share or disclose your personal information to third parties, except in the following cases:",
    bullets: [
      "When you have given us explicit consent",
      "When required by applicable law or legal process",
      "When necessary to protect our rights, property, or safety",
    ],
  },
];

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
            Knot (&quot;we&quot; or &quot;our&quot;) recognizes the importance
            of properly handling the personal information of our users and
            visitors. This Privacy Policy outlines how we collect, use, and
            protect your personal information.
          </p>
        </FadeSection>

        <div className="mt-14 space-y-14">
          {sections.map((section) => (
            <FadeSection key={section.title}>
              <h2 className="text-[clamp(1.35rem,2.4vw,1.5rem)] font-semibold leading-tight tracking-[-0.018em] text-text-primary">
                {section.title}
              </h2>
              <p className="mt-5 text-[15px] leading-relaxed tracking-[-0.01em] text-text-secondary">
                {section.body}
              </p>
              <ul className="mt-5 list-disc space-y-2 pl-5 text-[15px] leading-relaxed tracking-[-0.01em] text-text-secondary marker:text-text-muted">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </FadeSection>
          ))}

          <FadeSection>
            <h2 className="text-[clamp(1.35rem,2.4vw,1.5rem)] font-semibold leading-tight tracking-[-0.018em] text-text-primary">
              4. Service Providers
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed tracking-[-0.01em] text-text-secondary">
              To operate our website and communicate with you, we rely on the
              following third-party service providers:
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
                  Email infrastructure
                </strong>
                : Google LLC (United States)
              </li>
              <li>
                <strong className="font-semibold text-text-primary">
                  Form processing and notifications
                </strong>
                : We may use services such as Resend, Formspree, or similar
                providers to handle form submissions
              </li>
            </ul>
            <p className="mt-5 text-[15px] leading-relaxed tracking-[-0.01em] text-text-secondary">
              These providers process information on our behalf under their
              respective privacy policies and data processing standards.
            </p>
          </FadeSection>

          <FadeSection>
            <h2 className="text-[clamp(1.35rem,2.4vw,1.5rem)] font-semibold leading-tight tracking-[-0.018em] text-text-primary">
              5. Data Security
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed tracking-[-0.01em] text-text-secondary">
              We take reasonable and appropriate security measures to protect
              your personal information from loss, destruction, alteration, and
              unauthorized access.
            </p>
          </FadeSection>

          <FadeSection>
            <h2 className="text-[clamp(1.35rem,2.4vw,1.5rem)] font-semibold leading-tight tracking-[-0.018em] text-text-primary">
              6. Access Logs and Cookies
            </h2>
            <div className="mt-5 space-y-5 text-[15px] leading-relaxed tracking-[-0.01em] text-text-secondary">
              <p>
                Our website may record access information (such as IP
                addresses, browser types, and referring URLs) as logs for
                security and statistical purposes. These logs do not contain
                information that directly identifies individuals.
              </p>
              <p>
                We may use cookies to improve your experience on our site. You
                can disable cookies in your browser settings, though some
                functionality may be affected.
              </p>
            </div>
          </FadeSection>

          <FadeSection>
            <h2 className="text-[clamp(1.35rem,2.4vw,1.5rem)] font-semibold leading-tight tracking-[-0.018em] text-text-primary">
              7. Your Rights
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed tracking-[-0.01em] text-text-secondary">
              You have the right to request access to, correction of, or
              deletion of the personal information we hold about you. To
              exercise these rights, please contact us through the{" "}
              <Link
                href="/contact"
                className="text-text-primary underline decoration-white/25 underline-offset-4 transition-colors hover:text-white hover:decoration-white/50"
              >
                contact form
              </Link>{" "}
              on our website.
            </p>
          </FadeSection>

          <FadeSection>
            <h2 className="text-[clamp(1.35rem,2.4vw,1.5rem)] font-semibold leading-tight tracking-[-0.018em] text-text-primary">
              8. International Users
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed tracking-[-0.01em] text-text-secondary">
              Knot operates from Japan. By using our website or submitting
              information through our contact form, you understand that your
              information may be transferred to, stored in, and processed in
              Japan and the United States (where our service providers operate).
            </p>
          </FadeSection>

          <FadeSection>
            <h2 className="text-[clamp(1.35rem,2.4vw,1.5rem)] font-semibold leading-tight tracking-[-0.018em] text-text-primary">
              9. Changes to This Policy
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed tracking-[-0.01em] text-text-secondary">
              We may update this Privacy Policy from time to time. Any changes
              will be reflected on this page along with an updated revision
              date. Continued use of our website after changes are posted
              constitutes acceptance of the revised policy.
            </p>
          </FadeSection>

          <FadeSection>
            <h2 className="text-[clamp(1.35rem,2.4vw,1.5rem)] font-semibold leading-tight tracking-[-0.018em] text-text-primary">
              10. Contact
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed tracking-[-0.01em] text-text-secondary">
              For any questions or concerns about this Privacy Policy or how we
              handle personal information, please reach out to us through the{" "}
              <Link
                href="/contact"
                className="text-text-primary underline decoration-white/25 underline-offset-4 transition-colors hover:text-white hover:decoration-white/50"
              >
                contact form
              </Link>{" "}
              on our website.
            </p>
          </FadeSection>
        </div>

        <div className="mt-16 border-t border-border pt-6 text-[13px] leading-relaxed text-text-muted">
          <p>
            <strong className="font-semibold text-text-secondary">
              First published
            </strong>
            : {publishedDate}
          </p>
          <p>
            <strong className="font-semibold text-text-secondary">
              Last updated
            </strong>
            : {publishedDate}
          </p>
        </div>
      </div>
    </article>
  );
}
