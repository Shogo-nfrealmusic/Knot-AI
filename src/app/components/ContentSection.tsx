import { GridSection } from "@/app/components/ui/grid-section";

// A padded section inside the shared 1080px rails. `className` pads the inner frame.
export default function ContentSection({
  children,
  className = "",
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <GridSection innerClassName={`px-4 py-16 sm:px-10 ${className}`}>
      <div className="w-full min-w-0">{children}</div>
    </GridSection>
  );
}
