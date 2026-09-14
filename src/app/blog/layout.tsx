import SitePageLayout from "@/app/components/SitePageLayout";
import CTA from "@/app/components/CTA";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <SitePageLayout>
      {children}
      <CTA />
    </SitePageLayout>
  );
}
