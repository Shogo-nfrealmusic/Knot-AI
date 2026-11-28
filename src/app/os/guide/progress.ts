// Ticked labs for one module, kept in the reader's browser. Pure helpers: the store wraps them in a hook.

/** The ticked ids from what storage holds, in the module's order. Anything unreadable, unknown or repeated is dropped. */
export function parseTicks(raw: string | null | undefined, ids: readonly string[]): string[] {
  if (!raw) return [];
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(value)) return [];
  const ticked = new Set(value.filter((v): v is string => typeof v === "string"));
  return ids.filter((id) => ticked.has(id));
}

export type Saved = { answers: Record<number, "A" | "B" | "C" | "D">; revealed: boolean };

/** The diagnostic's saved state. Only answers A to D to questions 1..count survive, and the score shows only when all
 * questions are answered. Anything unreadable is a fresh start. */
export function parseAnswers(raw: string | null | undefined, count: number): Saved {
  const fresh: Saved = { answers: {}, revealed: false };
  if (!raw) return fresh;
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return fresh;
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) return fresh;
  const v = value as { answers?: unknown; revealed?: unknown };
  if (!v.answers || typeof v.answers !== "object" || Array.isArray(v.answers)) return fresh;
  const answers: Saved["answers"] = {};
  for (const [k, a] of Object.entries(v.answers as Record<string, unknown>)) {
    const n = Number(k);
    if (Number.isInteger(n) && n >= 1 && n <= count && (a === "A" || a === "B" || a === "C" || a === "D")) answers[n] = a;
  }
  const all = Object.keys(answers).length === count;
  return { answers, revealed: all && v.revealed === true };
}

/** The saved state with question n answered, built on what is saved now (not on an older render). Once the score is
 * shown, answers are locked and the saved state comes back unchanged. */
export function withAnswer(raw: string | null | undefined, n: number, a: "A" | "B" | "C" | "D", count: number): string {
  const s = parseAnswers(raw, count);
  if (s.revealed) return raw as string;
  return JSON.stringify({ answers: { ...s.answers, [n]: a }, revealed: false });
}

/** A lab's text: the task, then "Setup check:" (passable in one sitting), then an optional "Real-world check:" (days later). */
export function splitLab(text: string): { task: string; setup: string; real: string } {
  const [task, rest = ""] = text.split(/\s*Setup check:\s*/);
  const [setup, real = ""] = rest.split(/\s*Real-world check:\s*/);
  return { task: task.trim(), setup: setup.trim(), real: real.trim() };
}

type LabLesson = { id: string; advanced?: boolean; sections: { h: string; blocks: unknown[] }[] };

const labText = (l: LabLesson) => {
  const lab = l.sections.find((s) => s.h === "Lab");
  const first = lab?.blocks[0] as { p?: string } | undefined;
  return lab ? (first?.p ?? "") : null;
};

/** The tick ids of a module's labs. `<lesson>-lab` is the setup check (the id a whole lab used before the split, so old
 * ticks still count) and `<lesson>-lab-real` the real-world check. `core` is what the module's progress counts:
 * the setup checks of lessons that aren't Advanced. */
export function labPlan(lessons: readonly LabLesson[]) {
  const ids: string[] = [];
  const core: string[] = [];
  const advanced: string[] = [];
  const real: string[] = [];
  for (const l of lessons) {
    const text = labText(l);
    if (text === null) continue;
    const setup = `${l.id}-lab`;
    ids.push(setup);
    (l.advanced ? advanced : core).push(setup);
    if (splitLab(text).real) {
      ids.push(`${setup}-real`);
      real.push(`${setup}-real`);
    }
  }
  return { ids, core, advanced, real };
}

/** Tick an id, or untick it when already ticked. An id the module doesn't have changes nothing. */
export function toggleTick(done: readonly string[], id: string, ids: readonly string[]): string[] {
  if (!ids.includes(id)) return [...done];
  return done.includes(id) ? done.filter((d) => d !== id) : [...done, id];
}
