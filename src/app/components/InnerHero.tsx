interface InnerHeroProps {
  title: string;
  description?: string;
}

// Soft color mesh behind the hero rails. Low-opacity blurred blobs, dub.co-inspired.
const blobs = [
  "-bottom-[35%] -left-[10%] h-[80%] w-[45%] bg-[#855AFC]/15",
  "-bottom-[30%] left-[12%] h-[60%] w-[30%] bg-[#EEA5BA]/25",
  "-bottom-[40%] left-[35%] h-[55%] w-[30%] bg-[#E4C795]/25",
  "-bottom-[35%] right-[18%] h-[60%] w-[30%] bg-[#72FE7D]/12",
  "-bottom-[30%] -right-[8%] h-[80%] w-[40%] bg-[#3A8BFD]/15",
  "-bottom-[45%] right-[5%] h-[50%] w-[25%] bg-[#FD3A4E]/10",
];

export default function InnerHero({ title, description }: InnerHeroProps) {
  return (
    <section className="relative px-4 pt-24 sm:px-6 lg:px-8">
      <div className="relative isolate mx-auto flex max-w-[1344px] flex-col items-center px-6 pb-20 pt-16 text-center sm:pb-28 sm:pt-20">
        <div
          aria-hidden
          className="absolute inset-0 -z-[1] -mx-2 overflow-hidden rounded-b-[48px] border-x border-b border-neutral-300 [mask-image:linear-gradient(transparent,black)]"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/[0.04]" />
          {blobs.map((blob) => (
            <div key={blob} className={`absolute rounded-full blur-3xl ${blob}`} />
          ))}
        </div>

        <h1 className="max-w-3xl animate-slide-up-fade text-balance text-4xl font-medium tracking-[-0.035em] text-neutral-900 [--offset:20px] sm:text-5xl md:text-6xl md:leading-[1.1]">
          {title}
        </h1>
        {description ? (
          <p className="mt-6 max-w-xl animate-slide-up-fade text-pretty text-lg leading-relaxed text-neutral-500 [--offset:10px] [animation-delay:120ms]">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}
