import Image from "next/image";

const logos = [
  { src: "/images/logos/logo-1.png", alt: "Vercel", width: 90 },
  { src: "/images/logos/logo-2.png", alt: "Cursor", width: 101 },
  { src: "/images/logos/logo-3.png", alt: "Oscar", width: 70 },
  { src: "/images/logos/logo-4.png", alt: "OpenAI", width: 82 },
  { src: "/images/logos/logo-5.png", alt: "coinbase", width: 101 },
  { src: "/images/logos/logo-6.png", alt: "Cash App", width: 114 },
  { src: "/images/logos/logo-7.png", alt: "BOOM", width: 97 },
  { src: "/images/logos/logo-8.png", alt: "ramp", width: 86 },
];

export default function LogoBar() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1344px] w-full min-w-0">
        <div className="flex items-center justify-center sm:justify-between flex-wrap gap-x-6 gap-y-8 opacity-50 hover:opacity-70 transition-opacity duration-500" data-logo-bar>
          {logos.map((logo) => (
            <div
              key={logo.alt}
              className="flex items-center justify-center h-7 shrink-0"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={28}
                sizes="(max-width: 640px) 50vw, 120px"
                className="h-7 w-auto max-w-none object-contain invert brightness-200"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
