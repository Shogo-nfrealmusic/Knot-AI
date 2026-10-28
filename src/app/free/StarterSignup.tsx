import { GuideSignup } from "@/app/free/GuideSignup";
import { STARTER_FORM } from "@/lib/free";

const contents = [
  "An interview prompt: Claude asks you one question at a time and writes your CLAUDE.md",
  "The CLAUDE.md template we run our company on",
  "A verifier agent that checks Claude's work before you trust it",
  "A 20-question diagnostic that shows your weakest spot",
];

// Shown under the tool list: the tools stay free to everyone, the email is only for people who want the setup.
export function StarterSignup() {
  return (
    <div className="grid grid-cols-1 gap-8 px-5 py-12 sm:px-10 md:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] md:py-16">
      <div>
        <p className="font-mono text-[13px] text-warm">FREE · COPILOT OS STARTER</p>
        <h2 className="mt-4 max-w-md text-balance text-2xl font-medium tracking-[-0.03em] text-neutral-900 sm:text-3xl">
          The Claude Code setup two of us run a company on.
        </h2>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-neutral-600">
          Tools like this one plug into it. The files that make Claude know your goals and check its own work, free.
        </p>
      </div>
      <div>
        <ul className="space-y-3">
          {contents.map((item) => (
            <li key={item} className="flex items-start gap-3 text-[15px] leading-relaxed text-neutral-700">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-neutral-900" />
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <GuideSignup uid={STARTER_FORM.uid} src={STARTER_FORM.script} />
          <p className="mt-3 text-xs text-neutral-500">
            We&apos;ll email you a confirmation link. Confirm, and the download link arrives. Unsubscribe any time.
          </p>
        </div>
      </div>
    </div>
  );
}
