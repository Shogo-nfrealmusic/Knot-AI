interface InnerHeroProps {
  title: string;
  description?: string;
}

export default function InnerHero({ title, description }: InnerHeroProps) {
  return (
    <section className="relative border-b border-border pt-32 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1344px] w-full min-w-0">
        <h1 className="text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.1] tracking-[-0.022em] text-text-primary mb-4">
          {title}
        </h1>
        {description ? (
          <p className="text-[15px] text-text-secondary leading-relaxed tracking-[-0.01em] max-w-2xl">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}
