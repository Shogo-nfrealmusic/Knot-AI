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

/** One "###" part of a lesson. "Principle", "In production", "Limits" and "Lab" get their own look; "" has no heading. */
export type Section = { h: string; blocks: Block[] };

export type Lesson = { id: string; code: string; title: string; sections: Section[] };

export type ModuleContent = { code: string; slug: string; title: string; hero: string; lede: string[]; lessons: Lesson[] };
