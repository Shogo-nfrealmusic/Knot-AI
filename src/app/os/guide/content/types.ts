// The shape of a module page's content. Text keeps the module file's inline marks (see ../markup.ts).

/** A list item: its text, or its text and the sub-points under it. */
export type Item = string | [string, string[]];

export type Block =
  | { p: string }
  | { list: Item[]; ordered?: boolean; start?: number }
  | { code: string; label: string }
  | { table: { head: string[]; rows: string[][] } }
  | { quote: string }
  | { figure: string };

/** One "###" part of a lesson. "Principle", "In production", "Limits", "Lab" and "From the kit" get their own look;
 * "" has no heading. A lab's text is "task. Setup check: … Real-world check: …" (the last part only when it takes days). */
export type Section = { h: string; blocks: Block[] };

/** `advanced`: the lesson goes into Git, settings files or code. Optional on a first pass, and its lab doesn't count
 * toward the module's progress. */
export type Lesson = { id: string; code: string; title: string; advanced?: boolean; sections: Section[] };

export type ModuleContent = { code: string; slug: string; title: string; hero: string; lede: string[]; lessons: Lesson[] };
