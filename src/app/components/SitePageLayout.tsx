import dynamic from "next/dynamic";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

const ScrollAnimations = dynamic(
  () => import("@/app/components/ScrollAnimations"),
);

export default function SitePageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ScrollAnimations />
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
