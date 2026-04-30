export default function ContentSection({
  children,
  className = "",
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <section
      className={`border-t border-border py-16 px-4 sm:px-6 lg:px-8 ${className}`}
    >
      <div className="mx-auto max-w-[1344px] w-full min-w-0">{children}</div>
    </section>
  );
}
