import {
  Card,
  CardDescription,
  CardSkeletonContainer,
  CardTitle,
} from "@/app/components/ui/card";
import { SkeletonOne } from "@/app/components/features/skeletons/first";
import { SkeletonTwo } from "@/app/components/features/skeletons/second";
import { SkeletonThree } from "@/app/components/features/skeletons/third";
import { SkeletonFour } from "@/app/components/features/skeletons/fourth";
import { SkeletonFive } from "@/app/components/features/skeletons/fifth";
import { SkeletonWeb } from "@/app/components/features/skeletons/sixth";

export default function FeatureGrid() {
  return (
    <section id="areas" className="px-4 py-20 sm:px-10 lg:py-28">
      <div className="mx-auto w-full min-w-0">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-warm">
              What I build
            </p>
            <h2 className="mt-5 max-w-3xl type-heading text-text-primary">
              Software that connects your tools,{" "}
              <span className="font-serif text-[1.08em] font-normal italic text-neutral-500">
                automates the busywork,
              </span>{" "}
              and shows you the numbers.
            </h2>
          </div>
          <p className="max-w-sm text-[15px] leading-relaxed tracking-[-0.01em] text-text-secondary">
            AI agents, automations, data pipelines, and full-stack products,
            built to keep running long after launch.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <Card>
            <CardSkeletonContainer>
              <SkeletonThree />
            </CardSkeletonContainer>
            <CardTitle>AI agents that do the work</CardTitle>
            <CardDescription>
              Agents built on Claude Code, MCP, and LLM APIs that take a task
              from input to finished output: research, drafting, triage,
              reporting.
            </CardDescription>
          </Card>
          <Card className="lg:col-span-2">
            <CardTitle>Connect the tools you already use</CardTitle>
            <CardDescription>
              Stripe, Google Workspace, Slack, Notion, and your own database
              wired into one flow, so nobody copies data between apps by hand.
            </CardDescription>
            <CardSkeletonContainer>
              <SkeletonOne />
            </CardSkeletonContainer>
          </Card>
          <Card>
            <CardSkeletonContainer className="max-w-[16rem] mx-auto">
              <SkeletonTwo />
            </CardSkeletonContainer>
            <CardTitle>Payments that run themselves</CardTitle>
            <CardDescription>
              Stripe checkout, deposits, and automated follow-up billing that
              work for customers in any country.
            </CardDescription>
          </Card>
          <Card>
            <CardSkeletonContainer
              showGradient={false}
              className="max-w-[16rem] mx-auto"
            >
              <SkeletonFour />
            </CardSkeletonContainer>
            <CardTitle>Replace manual operations</CardTitle>
            <CardDescription>
              Internal apps and workflows that turn DM threads and spreadsheets
              into a process your team actually follows.
            </CardDescription>
          </Card>
          <Card>
            <CardSkeletonContainer>
              <SkeletonFive />
            </CardSkeletonContainer>
            <CardTitle>Collect data, find the signal</CardTitle>
            <CardDescription>
              Analytics, session replays, and account data turned into a clear
              decision about what to fix or build next.
            </CardDescription>
          </Card>
          <Card className="lg:col-span-3 lg:grid lg:grid-cols-[0.75fr_1.25fr] lg:items-center lg:gap-10">
            <div>
              <CardTitle>Web products, end to end</CardTitle>
              <CardDescription>
                From the first screen to payments, deployment, and monitoring.
                Next.js, Go, and PostgreSQL on AWS, shipped fast and built to
                last.
              </CardDescription>
            </div>
            {/* Auto height below lg: the fixed 20rem box let the taller mock overflow up over the title. */}
            <CardSkeletonContainer showGradient={false} className="mt-6 h-auto lg:mt-0 lg:h-[20rem]">
              <SkeletonWeb />
            </CardSkeletonContainer>
          </Card>
        </div>
      </div>
    </section>
  );
}
