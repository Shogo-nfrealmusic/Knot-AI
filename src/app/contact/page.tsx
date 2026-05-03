import type { Metadata } from "next";
import SitePageLayout from "@/app/components/SitePageLayout";
import InnerHero from "@/app/components/InnerHero";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact | Knot",
  description: "Start a Pilot conversation with Knot.",
};

export default function ContactPage() {
  return (
    <SitePageLayout>
      <InnerHero title="Let's talk about your operations." />
      <ContactForm />
    </SitePageLayout>
  );
}
