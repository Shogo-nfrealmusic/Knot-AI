// /free/82 (ten ChatGPT codes to learn anything): the facts behind the page. The codes and what they do are the reel's words;
// the ready prompts and example answers are written for this page (they are examples, not saved ChatGPT output).

export type LearnId = "eli5" | "8020" | "sticky" | "feynman" | "mindmap" | "quiz" | "studyguide" | "first" | "socrates" | "schematic";

export type LearnCode = {
  id: LearnId;
  n: number;
  code: string;
  does: string;
  prompt: string;
  /** what the answer looks like: lines, or a picture made by the image model */
  answer: string[];
  picture?: boolean;
};

export const LEARN: LearnCode[] = [
  { id: "eli5", n: 1, code: "ELI5", does: "Explains things in super simple terms.", prompt: "ELI5 how does the stock market work?", answer: ["Imagine a giant farmers' market, but instead of apples, people trade tiny pieces of companies.", "Each piece is a share. When the company does well, more people want it, so the price goes up."] },
  { id: "8020", n: 2, code: "80/20", does: "Focuses on the most important 20% you need to know.", prompt: "80/20 personal finance", answer: ["The 20% you need to know:", "1. Spend less than you earn.", "2. Keep 3–6 months of costs in cash.", "3. Invest the rest in index funds.", "4. Pay off high-interest debt first."] },
  { id: "sticky", n: 3, code: "MAKE-STICKY-NOTES", does: "Creates a visual sticky-note guide of the topic.", prompt: "MAKE-STICKY-NOTES the French Revolution", answer: ["A picture: nine colored sticky notes (causes, key dates, key people, outcomes…)."], picture: true },
  { id: "feynman", n: 4, code: "FEYNMAN-TECHNIQUE", does: "A popular study technique: explain it simply, then you teach it back.", prompt: "FEYNMAN-TECHNIQUE help me study black holes", answer: ["1. Black holes in kid-simple words: a giant star runs out of fuel and collapses. Gravity gets so strong not even light can escape.", "2. Now you try: explain it back to me in two sentences."] },
  { id: "mindmap", n: 5, code: "MAKE-MINDMAP", does: "Makes a visual mind map of the key concepts.", prompt: "MAKE-MINDMAP photosynthesis", answer: ["A picture: photosynthesis in the middle, with branches for inputs, where it happens, the light reactions, the Calvin cycle and the outputs."], picture: true },
  { id: "quiz", n: 6, code: "QUIZME", does: "Quizzes you one question at a time until you understand.", prompt: "QUIZME I'm learning basic Spanish verbs", answer: ["Question 1: Present tense. How do you say “I eat” in Spanish?", "A) Comes  B) Como  C) Come  D) Comemos", "Your answer?"] },
  { id: "studyguide", n: 7, code: "MAKE-VISUAL-STUDYGUIDE", does: "Turns the topic into a one-page study sheet with everything you need to learn.", prompt: "MAKE-VISUAL-STUDYGUIDE how the heart works", answer: ["A picture: one page with the four chambers, blood flow, key facts and key terms."], picture: true },
  { id: "first", n: 8, code: "FIRSTPRINCIPLES", does: "Explains the topic using first-principles thinking.", prompt: "FIRSTPRINCIPLES why can airplanes fly?", answer: ["The basic truth: to stay up, a plane has to push air down. The air pushes the plane up.", "Build it up from there: the curved, tilted wing bends the air flowing past it downward."] },
  { id: "socrates", n: 9, code: "SOCRATES", does: "Teaches you by asking you questions, one at a time.", prompt: "SOCRATES teach me how compound interest works", answer: ["Let's do this Socratic style: one question at a time.", "Question 1: You put $100 in a bank that pays 10% a year. How much do you have after one year?"] },
  { id: "schematic", n: 10, code: "MAKE-SCHEMATIC", does: "Makes a schematic diagram to explain things to you.", prompt: "MAKE-SCHEMATIC how does a fridge stay cold?", answer: ["A picture: the cooling loop — evaporator, compressor, condenser, expansion valve — with arrows for the refrigerant."], picture: true },
];

export const codeFor = (id: LearnId) => LEARN.find((c) => c.id === id)!;
export const ALL_PROMPTS = LEARN.map((c) => `${c.n}. ${c.prompt}`).join("\n");
