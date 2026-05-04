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

export default function DpaArticle() {
  return (
    <article className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-3xl">
        <FadeSection>
          <div className={`space-y-5 ${paragraphClassName}`}>
            <p>
              This Data Processing Agreement (&quot;DPA&quot;) describes how
              Knot processes personal data and other information on behalf of
              its clients in the course of providing AI operations consulting
              and implementation services.
            </p>
            <p>
              This document serves as a reference. For active engagements, this
              DPA is incorporated into the master service agreement between Knot
              and the client, and may be supplemented or modified by written
              agreement.
            </p>
          </div>
        </FadeSection>

        <div className="mt-14 space-y-14">
          <FadeSection>
            <h2 className={headingClassName}>1. Definitions</h2>
            <ul className={listClassName}>
              <li>
                <strong className="font-semibold text-text-primary">
                  Client
                </strong>
                : The organization that engages Knot to provide services.
              </li>
              <li>
                <strong className="font-semibold text-text-primary">
                  Client Data
                </strong>
                : Any data, including personal data, that the Client provides to
                Knot or that Knot accesses on the Client&apos;s behalf in the
                course of providing services.
              </li>
              <li>
                <strong className="font-semibold text-text-primary">
                  Personal Data
                </strong>
                : Information relating to an identified or identifiable
                individual.
              </li>
              <li>
                <strong className="font-semibold text-text-primary">
                  Processing
                </strong>
                : Any operation performed on data, including collection,
                storage, use, transmission, and deletion.
              </li>
              <li>
                <strong className="font-semibold text-text-primary">
                  Subprocessor
                </strong>
                : A third-party service provider engaged by Knot to assist in
                processing Client Data.
              </li>
            </ul>
          </FadeSection>

          <FadeSection>
            <h2 className={headingClassName}>2. Roles and Responsibilities</h2>
            <p className={`mt-5 ${paragraphClassName}`}>
              The Client is the{" "}
              <strong className="font-semibold text-text-primary">
                data controller
              </strong>
              , determining the purposes and means of processing. Knot acts as
              the{" "}
              <strong className="font-semibold text-text-primary">
                data processor
              </strong>
              , processing Client Data only on the Client&apos;s documented
              instructions.
            </p>
          </FadeSection>

          <FadeSection>
            <h2 className={headingClassName}>3. Scope and Purpose of Processing</h2>
            <p className={`mt-5 ${paragraphClassName}`}>
              Knot processes Client Data solely for the purpose of:
            </p>
            <ul className={listClassName}>
              <li>
                Designing, building, and operating AI systems and workflows on
                behalf of the Client
              </li>
              <li>Providing ongoing advisory and maintenance services</li>
              <li>Reporting and analytics related to the engagement</li>
            </ul>
            <p className={`mt-5 ${paragraphClassName}`}>
              The categories of data and data subjects are defined in each
              specific engagement and documented in the master service
              agreement.
            </p>
          </FadeSection>

          <FadeSection>
            <h2 className={headingClassName}>4. Client Obligations</h2>
            <p className={`mt-5 ${paragraphClassName}`}>
              The Client warrants that:
            </p>
            <ul className={listClassName}>
              <li>It has the legal right to share Client Data with Knot</li>
              <li>It has obtained any necessary consents from data subjects</li>
              <li>
                Its instructions to Knot comply with applicable data protection
                laws
              </li>
              <li>
                It will not provide Knot with sensitive personal data (e.g.,
                health, financial, or biometric data) unless explicitly agreed
                in writing
              </li>
            </ul>
          </FadeSection>

          <FadeSection>
            <h2 className={headingClassName}>5. Knot&apos;s Obligations</h2>
            <p className={`mt-5 ${paragraphClassName}`}>Knot agrees to:</p>
            <ul className={listClassName}>
              <li>
                Process Client Data only on the Client&apos;s documented
                instructions
              </li>
              <li>Maintain confidentiality of all Client Data</li>
              <li>
                Implement appropriate technical and organizational security
                measures
              </li>
              <li>
                Ensure that personnel with access to Client Data are bound by
                confidentiality obligations
              </li>
              <li>
                Assist the Client in responding to data subject requests, where
                reasonably possible
              </li>
              <li>
                Notify the Client without undue delay of any data breach
                affecting Client Data
              </li>
            </ul>
          </FadeSection>

          <FadeSection>
            <h2 className={headingClassName}>6. Subprocessors</h2>
            <p className={`mt-5 ${paragraphClassName}`}>
              To deliver services, Knot may engage subprocessors. The current
              subprocessors include:
            </p>
            <ul className={listClassName}>
              <li>
                <strong className="font-semibold text-text-primary">
                  Anthropic, PBC
                </strong>{" "}
                (United States) - for AI model processing via Claude API
              </li>
              <li>
                <strong className="font-semibold text-text-primary">
                  Vercel Inc.
                </strong>{" "}
                (United States) - for hosting infrastructure
              </li>
              <li>
                <strong className="font-semibold text-text-primary">
                  Google LLC
                </strong>{" "}
                (United States) - for email and workspace services
              </li>
              <li>
                <strong className="font-semibold text-text-primary">
                  Amazon Web Services, Inc.
                </strong>{" "}
                (United States) - for cloud infrastructure, where applicable
              </li>
            </ul>
            <p className={`mt-5 ${paragraphClassName}`}>
              Each subprocessor is bound by data protection terms equivalent to
              those in this DPA. We will notify the Client of any material
              changes to our subprocessor list and provide an opportunity to
              object.
            </p>
          </FadeSection>

          <FadeSection>
            <h2 className={headingClassName}>7. International Data Transfers</h2>
            <p className={`mt-5 ${paragraphClassName}`}>
              Client Data may be transferred to and processed in countries
              outside the Client&apos;s jurisdiction, including Japan and the
              United States. Where required by applicable law, such transfers
              are governed by appropriate safeguards, including standard
              contractual clauses or equivalent mechanisms.
            </p>
          </FadeSection>

          <FadeSection>
            <h2 className={headingClassName}>8. Security Measures</h2>
            <p className={`mt-5 ${paragraphClassName}`}>
              Knot maintains a security program that includes:
            </p>
            <ul className={listClassName}>
              <li>
                Access controls and authentication for all systems handling
                Client Data
              </li>
              <li>
                Encryption of data in transit using industry-standard protocols
              </li>
              <li>Regular review of subprocessor security practices</li>
              <li>Incident response procedures</li>
              <li>Personnel training on data protection and confidentiality</li>
            </ul>
            <p className={`mt-5 ${paragraphClassName}`}>
              Specific security measures applicable to a given engagement are
              detailed in the master service agreement.
            </p>
          </FadeSection>

          <FadeSection>
            <h2 className={headingClassName}>9. Data Retention and Deletion</h2>
            <div className={`mt-5 space-y-5 ${paragraphClassName}`}>
              <p>
                Knot retains Client Data only for the duration of the engagement
                and for any period required by applicable law or by the master
                service agreement.
              </p>
              <p>
                Upon termination of services, or upon the Client&apos;s written
                request, Knot will:
              </p>
            </div>
            <ul className={listClassName}>
              <li>
                Return Client Data to the Client in a commonly used format, or
              </li>
              <li>
                Securely delete Client Data from its systems and those of its
                subprocessors
              </li>
            </ul>
            <p className={`mt-5 ${paragraphClassName}`}>
              unless retention is required by applicable law.
            </p>
          </FadeSection>

          <FadeSection>
            <h2 className={headingClassName}>10. Audits</h2>
            <p className={`mt-5 ${paragraphClassName}`}>
              Upon reasonable advance notice and no more than once per year, the
              Client may audit Knot&apos;s compliance with this DPA. Knot will
              make available information necessary to demonstrate compliance,
              subject to appropriate confidentiality protections.
            </p>
          </FadeSection>

          <FadeSection>
            <h2 className={headingClassName}>11. Liability</h2>
            <p className={`mt-5 ${paragraphClassName}`}>
              Each party&apos;s liability under this DPA is governed by the
              master service agreement between the parties.
            </p>
          </FadeSection>

          <FadeSection>
            <h2 className={headingClassName}>12. Changes to This DPA</h2>
            <p className={`mt-5 ${paragraphClassName}`}>
              We may update this reference DPA to reflect changes in our
              practices or applicable law. The version applicable to a specific
              engagement is the version incorporated into the master service
              agreement at the time of execution.
            </p>
          </FadeSection>

          <FadeSection>
            <h2 className={headingClassName}>13. Governing Law</h2>
            <p className={`mt-5 ${paragraphClassName}`}>
              This DPA is governed by the laws of Japan. Disputes arising under
              this DPA are subject to the dispute resolution provisions of the
              master service agreement.
            </p>
          </FadeSection>

          <FadeSection>
            <h2 className={headingClassName}>14. Contact</h2>
            <p className={`mt-5 ${paragraphClassName}`}>
              For questions about this DPA or to discuss data processing terms
              for a specific engagement, please contact us through the{" "}
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
