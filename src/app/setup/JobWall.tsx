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
  { icon: IconCalendarEvent, label: "Client reminders" },
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

const SCHEDULE = [
  ["02:00", "Research new leads"],
  ["06:30", "Sort the inbox"],
  ["07:30", "Morning brief"],
  ["18:00", "Draft the books"],
] as const;

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

        <div className="su-tile-big col-span-3 row-span-2 bg-white sm:col-span-2">
          <div className="su-grid" aria-hidden />
          <span className="su-hub absolute left-1/2 top-[54%] size-[84px] -translate-x-1/2 -translate-y-1/2">
            <Image src="/setup/logos/claude.svg" alt="" width={40} height={40} />
          </span>
          <div className="absolute left-4 top-4">
            <p className="text-[15px] font-medium text-neutral-900">Runs on Claude Code</p>
            <p className="text-[12px] text-neutral-500">On your machine, in your tools</p>
          </div>
        </div>

        {JOBS.slice(0, 12).map((job) => (
          <div key={job.label} className="su-tile">
            <job.icon className="size-5 text-neutral-700" stroke={1.6} />
            <span>{job.label}</span>
          </div>
        ))}

        <div className="su-tile-big col-span-3 row-span-2 sm:col-span-2">
          <div className="absolute left-4 top-4">
            <p className="text-[15px] font-medium text-neutral-900">Your setup</p>
            <p className="text-[12px] text-neutral-500">One new job added every month</p>
          </div>
          <div className="absolute inset-x-4 bottom-4 divide-y divide-neutral-100 rounded-xl border border-neutral-200 bg-white font-mono text-[11px] text-neutral-600">
            {SCHEDULE.map(([time, job]) => (
              <div key={job} className="flex items-center gap-3 px-3 py-2">
                <span className="text-neutral-400">{time}</span>
                <span className="flex-1 truncate">{job}</span>
                <span className="text-emerald-600">done</span>
              </div>
            ))}
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
