import Image from "next/image";
import {
  IconBell,
  IconCalendarEvent,
  IconChartBar,
  IconClipboardList,
  IconCoin,
  IconFileInvoice,
  IconFileText,
  IconInbox,
  IconListCheck,
  IconMail,
  IconMessageCircle,
  IconNotes,
  IconPencil,
  IconPhoto,
  IconReceipt,
  IconRefresh,
  IconSearch,
  IconSpeakerphone,
  IconStar,
  IconTable,
  IconTarget,
  IconUsers,
  IconVideo,
  IconWorld,
} from "@tabler/icons-react";

// The breadth of what a setup can take over: one small tile per job, two large tiles for the jobs we run
// ourselves. Blank tiles on the edges fade the wall out.
const JOBS = [
  { icon: IconInbox, label: "Inbox triage" },
  { icon: IconReceipt, label: "Expense receipts" },
  { icon: IconFileInvoice, label: "Invoice follow-ups" },
  { icon: IconStar, label: "Review replies" },
  { icon: IconChartBar, label: "Weekly numbers" },
  { icon: IconCalendarEvent, label: "Booking reminders" },
  { icon: IconMessageCircle, label: "Customer replies" },
  { icon: IconUsers, label: "Lead research" },
  { icon: IconSearch, label: "Competitor watch" },
  { icon: IconSpeakerphone, label: "Social posts" },
  { icon: IconTable, label: "Data clean-up" },
  { icon: IconBell, label: "Price alerts" },
  { icon: IconFileText, label: "Proposals" },
  { icon: IconListCheck, label: "Checklists" },
  { icon: IconWorld, label: "SEO briefs" },
  { icon: IconCoin, label: "Books drafted" },
  { icon: IconClipboardList, label: "Meeting notes" },
  { icon: IconPhoto, label: "Image edits" },
  { icon: IconVideo, label: "Video cuts" },
  { icon: IconNotes, label: "Decision log" },
  { icon: IconTarget, label: "Goal tracking" },
  { icon: IconPencil, label: "Newsletter drafts" },
  { icon: IconMail, label: "Morning brief" },
  { icon: IconRefresh, label: "CRM updates" },
];

function Blank() {
  return <div aria-hidden className="su-tile opacity-40" />;
}

export default function JobWall() {
  return (
    <div className="relative [mask-image:linear-gradient(transparent,black_14%,black_86%,transparent)]">
      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-8">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={`top-${i}`} className={i >= 3 ? "hidden sm:block" : ""}>
            <Blank />
          </div>
        ))}

        <div className="su-tile-big col-span-3 row-span-2 sm:col-span-2">
          <Image src="/setup/reel-machine.jpg" alt="" width={720} height={1280} className="absolute inset-0 size-full object-cover object-top opacity-90" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
            <p className="text-[15px] font-medium text-white">Nightly reels</p>
            <p className="text-[12px] text-white/70">Running at our studio</p>
          </div>
        </div>

        {JOBS.slice(0, 12).map((job) => (
          <div key={job.label} className="su-tile">
            <job.icon className="size-5 text-neutral-700" stroke={1.6} />
            <span>{job.label}</span>
          </div>
        ))}

        <div className="su-tile-big col-span-3 row-span-2 bg-[#fff3ee] sm:col-span-2">
          <Image src="/setup/orbit-type.png" alt="" width={1200} height={1100} className="absolute -bottom-4 left-1/2 w-[78%] -translate-x-1/2" />
          <div className="absolute left-4 top-4">
            <p className="text-[15px] font-medium text-neutral-900">Your setup</p>
            <p className="text-[12px] text-neutral-500">One new job added every month</p>
          </div>
        </div>

        {JOBS.slice(12).map((job) => (
          <div key={job.label} className="su-tile">
            <job.icon className="size-5 text-neutral-700" stroke={1.6} />
            <span>{job.label}</span>
          </div>
        ))}

        {Array.from({ length: 8 }, (_, i) => (
          <div key={`bottom-${i}`} className={i >= 3 ? "hidden sm:block" : ""}>
            <Blank />
          </div>
        ))}
      </div>
    </div>
  );
}
