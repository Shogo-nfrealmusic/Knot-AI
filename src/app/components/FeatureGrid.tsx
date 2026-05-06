import Image from "next/image";
import FeatureLottieSlot from "@/app/components/FeatureLottieSlot";
import BentoDnaLottieSlot from "@/app/components/BentoDnaLottieSlot";
import FlowchartLottieSlot from "@/app/components/FlowchartLottieSlot";

interface FeatureCardProps {
  figure: string;
  title: string;
  description: string;
  illustration?: string;
  /** FIG 0.1: Integrations Lottie */
  lottie?: boolean;
  /** FIG 0.2: Bento DNA Lottie */
  bento?: boolean;
  /** FIG 0.3: Flowchart Lottie */
  flowchart?: boolean;
}

function FeatureCard({
  figure,
  title,
  description,
  illustration,
  lottie = false,
  bento = false,
  flowchart = false,
}: FeatureCardProps) {
  return (
    <div className="flex min-h-[420px] flex-col justify-between rounded-lg border border-white/10 bg-[#0d0e10] p-5">
      <span className="font-mono text-[11px] text-[#ff8a66] uppercase tracking-[0.12em]">
        {figure}
      </span>
      <div className="flex flex-1 items-center justify-center overflow-hidden py-8">
        {flowchart ? (
          <FlowchartLottieSlot />
        ) : lottie ? (
          <FeatureLottieSlot />
        ) : bento ? (
          <BentoDnaLottieSlot />
        ) : illustration ? (
          <Image
            src={illustration}
            alt={title}
            width={265}
            height={262}
            sizes="(max-width: 768px) 100vw, 265px"
            className="h-auto max-h-[262px] w-full max-w-[265px] object-contain opacity-60 invert"
          />
        ) : null}
      </div>
      <div className="border-t border-white/10 pt-5">
        <h3 className="text-[18px] font-semibold text-text-primary tracking-[-0.02em]">
          {title}
        </h3>
        <p className="mt-3 text-[14px] text-text-secondary leading-relaxed tracking-[-0.01em]">
          {description}
        </p>
      </div>
    </div>
  );
}

const features = [
  {
    figure: "FIG 0.1",
    title: "Pilot Build",
    description:
      "One workflow, one working AI system, in a few weeks. Built inside the tools your team already uses, so the results speak for themselves.",
    illustration: "/images/features/fig02-built-for-purpose.png",
    lottie: true,
  },
  {
    figure: "FIG 0.2",
    title: "AI Implementation",
    description:
      "Your team spends hours on work that doesn't need a human. We build AI into your workflows to handle it — quietly, inside the tools they already work in.",
    bento: true,
  },
  {
    figure: "FIG 0.3",
    title: "An AI-Native Operation",
    description:
      "Your team stops doing repetitive work. Decisions get faster. New hires onboard in days. AI becomes how you operate — not a tool you happen to use.",
    flowchart: true,
  },
];

export default function FeatureGrid() {
  return (
    <section id="areas" className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-[1344px] w-full min-w-0">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-[#ff8a66]">
              Operating model
            </p>
            <h2 className="mt-5 max-w-3xl text-[clamp(2rem,4vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-text-primary">
              Start narrow. Connect deeper. Compound the system.
            </h2>
          </div>
          <p className="max-w-md text-[15px] leading-relaxed tracking-[-0.01em] text-text-secondary">
            We design the first useful system, then connect it to the tools and
            workflows that make it valuable every day.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.figure} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
