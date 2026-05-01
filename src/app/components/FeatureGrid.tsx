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
    <div className="md:border-r md:border-border md:last:border-r-0 flex flex-col justify-end pb-0 md:pr-8">
      <span className="font-mono text-[11.8px] text-text-secondary/40 uppercase mb-6">
        {figure}
      </span>
      <div className="flex-1 flex items-center justify-center overflow-hidden mb-8 min-h-[200px]">
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
      <div className="space-y-2">
        <h3 className="text-[15px] font-semibold text-[#d0d6e0] tracking-[-0.01em]">
          {title}
        </h3>
        <p className="text-[15px] text-text-secondary leading-relaxed tracking-[-0.01em]">
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
    <section id="areas" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1344px] w-full min-w-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 border-t border-border pt-12">
          {features.map((feature) => (
            <FeatureCard key={feature.figure} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
