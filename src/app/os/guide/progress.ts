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

/** Tick an id, or untick it when already ticked. An id the module doesn't have changes nothing. */
export function toggleTick(done: readonly string[], id: string, ids: readonly string[]): string[] {
  if (!ids.includes(id)) return [...done];
  return done.includes(id) ? done.filter((d) => d !== id) : [...done, id];
}
