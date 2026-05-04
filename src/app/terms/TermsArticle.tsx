"use client";

import Link from "next/link";
import { motion } from "motion/react";

const publishedDate = "May 4, 2026";

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

const headingClassName =
  "text-[clamp(1.35rem,2.4vw,1.5rem)] font-semibold leading-tight tracking-[-0.018em] text-text-primary";

const paragraphClassName =
  "text-[15px] leading-relaxed tracking-[-0.01em] text-text-secondary";

const listClassName =
  "mt-5 list-disc space-y-2 pl-5 text-[15px] leading-relaxed tracking-[-0.01em] text-text-secondary marker:text-text-muted";

function ContactLink() {
  return (
    <Link
      href="/contact"
      className="text-text-primary underline decoration-white/25 underline-offset-4 transition-colors hover:text-white hover:decoration-white/50"
    >
      contact form
    </Link>
  );
}

export default function TermsArticle() {
  return (
    <article className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-3xl">
        <FadeSection>
          <p className={paragraphClassName}>
            These Terms of Service (&quot;Terms&quot;) govern your use of the
            Knot website (the &quot;Site&quot;). By accessing or using the
            Site, you agree to be bound by these Terms.
          </p>
        </FadeSection>

        <div className="mt-14 space-y-14">
          <FadeSection>
            <h2 className={headingClassName}>1. About Knot</h2>
            <div className={`mt-5 space-y-5 ${paragraphClassName}`}>
              <p>
                Knot (&quot;we&quot; or &quot;our&quot;) provides AI operations
                consulting and implementation services. The Site serves as our
                public-facing information and inquiry channel.
              </p>
              <p>
                These Terms apply to your use of the Site only. Specific
                engagements between Knot and clients are governed by separate
                written agreements.
              </p>
            </div>
          </FadeSection>

          <FadeSection>
            <h2 className={headingClassName}>2. Use of the Site</h2>
            <p className={`mt-5 ${paragraphClassName}`}>
              You may use the Site for informational purposes and to submit
              inquiries through our contact form. You agree not to:
            </p>
            <ul className={listClassName}>
              <li>Use the Site for any unlawful purpose</li>
              <li>Attempt to interfere with the Site&apos;s operation or security</li>
              <li>
                Use automated tools to scrape, harvest, or extract data from the
                Site without our prior written consent
              </li>
              <li>Misrepresent your identity when submitting inquiries</li>
              <li>
                Submit false, misleading, or harmful content through any form on
                the Site
              </li>
            </ul>
          </FadeSection>

          <FadeSection>
            <h2 className={headingClassName}>3. Intellectual Property</h2>
            <div className={`mt-5 space-y-5 ${paragraphClassName}`}>
              <p>
                All content on the Site, including text, graphics, logos,
                illustrations, and software, is owned by Knot or its licensors
                and is protected by applicable intellectual property laws.
              </p>
              <p>
                You may not reproduce, distribute, modify, or create derivative
                works from any Site content without our prior written
                permission, except for personal, non-commercial reference.
              </p>
              <p>
                The &quot;Knot&quot; name and any associated marks are
                trademarks of Knot. Third-party trademarks displayed on the Site
                (such as Claude, Slack, Google, Notion, etc.) are the property
                of their respective owners.
              </p>
            </div>
          </FadeSection>

          <FadeSection>
            <h2 className={headingClassName}>4. Inquiries and Communications</h2>
            <p className={`mt-5 ${paragraphClassName}`}>
              When you submit an inquiry through the Site, you understand that:
            </p>
            <ul className={listClassName}>
              <li>
                Submission does not create any contractual relationship between
                you and Knot
              </li>
              <li>We are under no obligation to respond to or accept any inquiry</li>
              <li>
                Information shared in inquiries should not include confidential
                or sensitive data until a mutual non-disclosure agreement is in
                place
              </li>
            </ul>
          </FadeSection>

          <FadeSection>
            <h2 className={headingClassName}>5. Third-Party Services and Links</h2>
            <p className={`mt-5 ${paragraphClassName}`}>
              The Site may reference or link to third-party services, products,
              or websites. We do not endorse and are not responsible for the
              content, accuracy, or practices of third parties. Your
              interactions with third parties are governed by their own terms.
            </p>
          </FadeSection>

          <FadeSection>
            <h2 className={headingClassName}>6. Disclaimer of Warranties</h2>
            <div className={`mt-5 space-y-5 ${paragraphClassName}`}>
              <p>
                The Site is provided &quot;as is&quot; and &quot;as
                available&quot; without warranties of any kind, either express or
                implied. We do not warrant that the Site will be uninterrupted,
                error-free, or free of harmful components.
              </p>
              <p>
                Information presented on the Site is for general informational
                purposes only and does not constitute professional advice.
              </p>
            </div>
          </FadeSection>

          <FadeSection>
            <h2 className={headingClassName}>7. Limitation of Liability</h2>
            <p className={`mt-5 ${paragraphClassName}`}>
              To the fullest extent permitted by law, Knot shall not be liable
              for any indirect, incidental, special, consequential, or punitive
              damages arising from or related to your use of the Site, even if
              we have been advised of the possibility of such damages.
            </p>
          </FadeSection>

          <FadeSection>
            <h2 className={headingClassName}>8. Indemnification</h2>
            <p className={`mt-5 ${paragraphClassName}`}>
              You agree to indemnify and hold Knot harmless from any claims,
              damages, or expenses arising from your violation of these Terms or
              your misuse of the Site.
            </p>
          </FadeSection>

          <FadeSection>
            <h2 className={headingClassName}>9. Changes to These Terms</h2>
            <p className={`mt-5 ${paragraphClassName}`}>
              We may update these Terms from time to time. Any changes will be
              reflected on this page along with an updated revision date.
              Continued use of the Site after changes are posted constitutes
              acceptance of the revised Terms.
            </p>
          </FadeSection>

          <FadeSection>
            <h2 className={headingClassName}>10. Governing Law</h2>
            <p className={`mt-5 ${paragraphClassName}`}>
              These Terms are governed by the laws of Japan, without regard to
              conflict of law principles. Any disputes arising from these Terms
              or your use of the Site shall be submitted to the exclusive
              jurisdiction of the courts of Tokyo, Japan.
            </p>
          </FadeSection>

          <FadeSection>
            <h2 className={headingClassName}>11. Contact</h2>
            <p className={`mt-5 ${paragraphClassName}`}>
              For questions about these Terms, please contact us through the{" "}
              <ContactLink /> on our website.
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
