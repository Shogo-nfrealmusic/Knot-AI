import StatementTyper from "@/app/components/StatementTyper";

export default function Statement() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1344px] w-full min-w-0">
        <StatementTyper />
      </div>
    </section>
  );
}
