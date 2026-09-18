"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import {
  IconBottle,
  IconBriefcase,
  IconCreditCard,
  IconDeviceMobile,
  IconRobot,
  IconShoppingBag,
  IconTool,
  IconVideo,
} from "@tabler/icons-react";
import { StickyScroll } from "@/app/components/ui/sticky-scroll";
import { FeatureIconContainer } from "@/app/components/ui/feature-icon-container";
import { BlurImage } from "@/app/components/ui/blur-image";
import Beam from "@/app/components/ui/beam";
import PipelineFlow from "@/app/components/PipelineFlow";
import OpsAppMock from "@/app/components/OpsAppMock";
import AgentFlow from "@/app/components/AgentFlow";
import ShipCadence from "@/app/components/ShipCadence";
import BookingEventFlow from "@/app/components/illustrations/BookingEventFlow";
import { getProject, type Project } from "@/lib/projects";

function requireProject(slug: string) {
  const project = getProject(slug);
  if (!project) throw new Error(`Unknown project: ${slug}`);
  return project;
}

function ImageContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative rounded-[20px] bg-gradient-to-b from-neutral-200 to-neutral-300 p-px shadow-[0_12px_40px_-12px_rgba(0,0,0,0.12)]">
      {/* Clip the meteor to the card's top edge; on phones its tail otherwise streaks past the rails. */}
      <div className="pointer-events-none absolute inset-x-5 -top-px h-4 overflow-hidden">
        <Beam showBeam className="top-0 block" />
      </div>
      <div className="rounded-[19px] bg-white p-2 sm:p-3">{children}</div>
      <div className="absolute inset-x-0 bottom-0 h-px w-full bg-gradient-to-r from-transparent via-warm/60 to-transparent" />
      <div className="absolute inset-x-10 bottom-0 mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />
    </div>
  );
}

function BrowserFrame({
  url,
  children,
}: {
  url: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-[12px] border border-neutral-200 bg-white">
      <div className="grid h-10 grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-neutral-200 px-3">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full border border-neutral-500" />
          <span className="h-2 w-2 rounded-full border border-neutral-500" />
          <span className="h-2 w-2 rounded-full border border-neutral-500" />
        </span>
        <span className="mx-auto truncate rounded-md bg-neutral-100 px-2.5 py-0.5 font-mono text-[11px] text-neutral-500">
          {url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
        </span>
        <span className="w-[42px]" />
      </div>
      {children}
    </div>
  );
}

function SiteVisual({ project }: { project: Project }) {
  const [link] = project.links;
  const [image, mobileImage] = project.images;
  const [metric] = project.metrics;

  return (
    <div className="relative">
    <BrowserFrame url={link.href}>
      {image ? (
        <BlurImage
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          className="h-auto w-full"
        />
      ) : (
        <div className="flex aspect-[16/10] flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_50%_40%,rgba(224,85,47,0.08),transparent_60%)]">
          <p className="font-mono text-[56px] leading-none tracking-[-0.06em] text-text-primary">
            {metric.value}
          </p>
          <p className="text-[13px] text-text-muted">{metric.label}</p>
        </div>
      )}
    </BrowserFrame>
      {mobileImage ? (
        <div className="absolute -bottom-3 -right-1 w-[20%] min-w-[64px] overflow-hidden rounded-[12px] border-[3px] border-neutral-900 sm:-bottom-6 sm:-right-3 sm:w-[22%] sm:min-w-[88px] sm:rounded-[18px] sm:border-[5px] bg-white shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] ring-1 ring-neutral-200">
          <BlurImage
            src={mobileImage.src}
            alt={mobileImage.alt}
            width={mobileImage.width}
            height={mobileImage.height}
            className="h-auto w-full"
          />
        </div>
      ) : null}
    </div>
  );
}

// Where a booking goes after checkout. Inside the 1080px rails the column is ~614px (lg) or
// ~650px (md); the flow's md+ layout is ~590px wide, so it only drops its side padding.
function BookingFlowPanel() {
  return (
    <div className="mt-6 overflow-hidden rounded-[20px] border border-neutral-200 bg-neutral-50/70">
      <div className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-2.5">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-neutral-500">
          After checkout
        </p>
        <p className="hidden font-mono text-[11px] text-neutral-400 sm:block">
          every booking, automatically
        </p>
      </div>
      <div className="relative h-[480px] bg-[radial-gradient(circle,rgba(0,0,0,0.06)_1px,transparent_1px)] [background-size:16px_16px] md:h-[340px]">
        <BookingEventFlow className="sm:px-0" />
      </div>
    </div>
  );
}

function ProjectDetails({ project }: { project: Project }) {
  const metrics = project.metrics.slice(0, 3);

  return (
    <div className="mt-6">
      <div
        className={`grid gap-px overflow-hidden rounded-xl border border-neutral-200 bg-neutral-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ${
          metrics.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"
        }`}
      >
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-white p-4">
            <p className="font-mono text-[20px] tracking-[-0.04em] text-warm">
              {metric.value}
            </p>
            <p className="mt-2 text-[13px] leading-snug tracking-[-0.01em] text-text-secondary">
              {metric.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <ul className="flex flex-wrap gap-1.5">
          {project.stack.map((item) => (
            <li
              key={item}
              className="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1 font-mono text-[11px] leading-none text-neutral-600"
            >
              {item}
            </li>
          ))}
        </ul>
        {project.links.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-[13px] font-medium text-text-secondary shadow-sm transition-colors hover:border-neutral-300 hover:text-text-primary"
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

const items = [
  {
    project: requireProject("tps-booking-platform"),
    title: "Multilingual Booking Platform",
    icon: IconCreditCard,
    visual: (project: Project) => <SiteVisual project={project} />,
    extra: <BookingFlowPanel />,
  },
  {
    project: requireProject("tps-staff-app"),
    title: "Staff Operations App (iOS)",
    icon: IconDeviceMobile,
    visual: () => <OpsAppMock />,
  },
  {
    project: requireProject("tetty-preset-store"),
    title: "Preset Store with Stripe Checkout",
    icon: IconShoppingBag,
    visual: (project: Project) => <SiteVisual project={project} />,
  },
  {
    project: requireProject("toni-concept-site"),
    title: "TONI — 3D Scroll Site",
    icon: IconBottle,
    visual: (project: Project) => <SiteVisual project={project} />,
  },
  {
    project: requireProject("mercari-pm-ai-agent"),
    title: "AI Agent for Product Management",
    icon: IconRobot,
    visual: () => <AgentFlow />,
  },
  {
    project: requireProject("automated-content-pipeline"),
    title: "Automated Content Pipeline",
    icon: IconVideo,
    visual: () => <PipelineFlow />,
  },
  {
    project: requireProject("iron-and-code"),
    title: "Iron & Code — A Free Tool Every Monday",
    icon: IconTool,
    visual: () => <ShipCadence />,
  },
];

export default function ProjectTools() {
  const content = items.map(({ project, title, icon: Icon, visual, ...item }) => ({
    icon: (
      <span className="inline-flex rounded-[10px] border border-orange-200 bg-orange-50 p-2 text-warm">
        <Icon className="h-5 w-5" />
      </span>
    ),
    title,
    description: project.summary,
    content: (
      <>
        <ImageContainer>{visual(project)}</ImageContainer>
        {"extra" in item ? item.extra : null}
        <ProjectDetails project={project} />
      </>
    ),
  }));

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const backgrounds = ["#ffffff", "#fafafa", "#f8fafc"];
  const [gradient, setGradient] = useState(backgrounds[0]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const breakpoints = content.map((_, index) => index / content.length);
    const closest = breakpoints.reduce((acc, breakpoint, index) => {
      const distance = Math.abs(latest - breakpoint);
      return distance < Math.abs(latest - breakpoints[acc]) ? index : acc;
    }, 0);
    setGradient(backgrounds[closest % backgrounds.length]);
  });

  return (
    <motion.div
      animate={{ background: gradient }}
      transition={{ duration: 0.5 }}
      ref={ref}
      className="relative h-full w-full pt-20 md:pt-32"
    >
      <motion.div
        className="px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
        transition={{ staggerChildren: 0.08 }}
      >
        {[
          <FeatureIconContainer key="icon" className="flex items-center justify-center overflow-hidden">
            <IconBriefcase className="h-6 w-6 text-warm" />
          </FeatureIconContainer>,
          <h2
            key="title"
            className="mx-auto mt-4 max-w-5xl text-center text-3xl font-medium tracking-[-0.03em] text-neutral-900 md:text-[2.75rem] md:leading-tight"
          >
            Systems I built and run
          </h2>,
          <p key="lede" className="mx-auto my-4 max-w-2xl text-center text-sm font-normal text-neutral-500 md:text-base">
            Each one is in production or published, with the numbers it
            produced.
          </p>,
        ].map((child) => (
          <motion.div
            key={child.key}
            variants={{
              hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
              visible: { opacity: 1, y: 0, filter: "blur(0px)" },
            }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {child}
          </motion.div>
        ))}
      </motion.div>
      <StickyScroll content={content} />
    </motion.div>
  );
}
