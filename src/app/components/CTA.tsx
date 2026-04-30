import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1344px] w-full min-w-0 px-1 text-center">
        <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-[1.1] tracking-[-0.022em] text-text-primary mb-10">
          業務と見せ方、
          <br />
          まずは話しから。
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-sm font-medium text-bg-primary bg-text-primary px-5 py-2.5 rounded-full hover:bg-white/90 transition-colors"
          >
            相談する
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary border border-border-solid px-5 py-2.5 rounded-full hover:border-white/20 hover:text-text-primary transition-colors"
          >
            お問い合わせ
          </Link>
        </div>

        <p className="mt-6 text-[13px] text-text-muted">
          内容・規模に応じてお見積りします。まだ具体的でない段階のご相談も歓迎です。
        </p>
      </div>
    </section>
  );
}
