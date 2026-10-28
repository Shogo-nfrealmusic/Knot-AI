import * as k from "@/lib/iso/iso-kit";

// Fig 1 of the starter page: a dial indicator on a surface plate, rebuilt as a verifier.
// The carriage carries three gauge blocks, Claude's three pieces of work. The dial (the verifier)
// reads each one against the spec card (CLAUDE.md) standing on the plate, and the lamp shows the verdict.
// Every number the page shows comes from these constants.

export const WIDTH = 600;
export const HEIGHT = 390;

const PLATE = { x: -128, y: -64, w: 262, d: 128, r: 8 };
const PLATE_H = 12;
const FOOT_H = 5;

const MAG = { x: -112, y: -20, w: 44, d: 40, r: 3 };
const MAG_H = 24;
const POST: k.Plane = [-98, 0];
const POST_TOP = 122;
const CLAMP_Z = 100;

export const DIAL: k.Plane = [58, 0];
export const DIAL_R = 20;
const DIAL_Z = 82;
const DIAL_H = 10;
export const DIAL_TOP = DIAL_Z + DIAL_H;
export const PER_TURN = 20;

const RAIL_FROM = 2;
const RAIL_TO = 124;
const CARRIAGE = { x: -28, y: -24, w: 56, d: 48, r: 3 };
const CARRIAGE_Z = 3;
export const CARRIAGE_TOP = 8;
export const BLOCKS = [18, 14, 10];
/** What CLAUDE.md says each piece should be. The third block is short: the verifier catches it. */
export const SPEC = [18, 14, 12];
export const BLOCK_W = 15.6;
export const STEP = 16;
export const TIP_R = 2.6;
const CENTRE = -24 + BLOCK_W / 2;
export const STOPS = BLOCKS.map((_, index) => DIAL[0] - CENTRE - STEP * index);

const CARD_BASE = { x: -84, y: 32, w: 40, d: 11, r: 2 };
const CARD = { x: -81, y: 36.6, w: 34, d: 1.8, r: 0.4 };
const CARD_BASE_H = 5;
const CARD_H = 30;

export const LAMP: k.Plane = [110, 40];

export const P = k.fitProjection(
  [...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), [POST[0], POST[1], POST_TOP + 2], [DIAL[0] + DIAL_R, 0, DIAL_TOP]],
  WIDTH,
  HEIGHT,
  { pad: 26, azimuth: 42 },
);

const at = (point: k.Point3) => k.iso(point, P);
const S = (paths: k.SolidPaths, style?: k.SolidStyle) => k.solidSvg(paths, style);
const L = (d: string, style?: k.LineStyle) => k.lineSvg(d, style);
const D = (points: k.Flat[], style?: { size?: number; tone?: k.Tone }) => k.dotsSvg(points, style);
const byDepth = (points: k.Plane[]) => [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));

function plate() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 22))) {
    out.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: "mid" }));
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
  const screws = k.corners(PLATE, 10);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  const strip = { x: -40, y: PLATE.y + PLATE.d - 15, w: 140, d: 7, r: 1 };
  out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
  const ticks = k.topTicks(strip.x + 4, strip.x + strip.w - 4, 4, 5, strip.y + 0.8, 0.6, [2, 3.6], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  out.push(D([at([strip.x + 2, strip.y + 3.5, 0.6]), at([strip.x + strip.w - 2, strip.y + 3.5, 0.6])], { size: 0.45 }));
  return out.join("");
}

function rails() {
  const out: string[] = [];
  for (const y of [-20, 15]) {
    out.push(S(k.slabOf({ x: RAIL_FROM, y, w: RAIL_TO - RAIL_FROM, d: 5, r: 1 }, 0, 3, P, 3, 0.4), { tone: "mid" }));
    out.push(D([RAIL_FROM + 6, RAIL_TO - 6].map((x) => at([x, y + 2.5, 3])), { size: 0.4 }));
  }
  for (const x of [RAIL_FROM - 5, RAIL_TO]) {
    out.push(S(k.slabOf({ x, y: -23, w: 5, d: 46, r: 1.2 }, 0, 7, P, 3, 0.5), { tone: "mid" }));
    out.push(D([at([x + 2.5, -18, 7]), at([x + 2.5, 18, 7])], { size: 0.45 }));
  }
  return out.join("");
}

function fixture() {
  const out: string[] = [];
  out.push(S(k.slabOf(MAG, 0, 11, P, 6, 0.8), { tone: "mid" }));
  out.push(S(k.slabOf(k.insetPlan(MAG, 0.8), 11, MAG_H - 11, P, 6, 0.8), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(MAG, 3), MAG_H, P), { tone: "faint" }));
  out.push(D([at([MAG.x + 5, MAG.y + 5, MAG_H]), at([MAG.x + 5, MAG.y + MAG.d - 5, MAG_H]), at([MAG.x + MAG.w - 5, MAG.y + 5, MAG_H])], { size: 0.45 }));
  const knob: k.Plane = [MAG.x + 32, MAG.y + 28];
  out.push(S(k.cylinder(knob[0], knob[1], 6, MAG_H, 4, P, 32), { tone: "mid" }));
  out.push(L(k.knurl(knob[0], knob[1], 6, MAG_H, MAG_H + 4, 36, P), { tone: "lo" }));
  out.push(L(k.lineOnTop([knob[0], knob[1]], [knob[0] + 6, knob[1]], MAG_H + 4, P), { tone: "hi" }));
  out.push(D([at([knob[0], knob[1], MAG_H + 4])], { size: 0.5, tone: "hi" }));
  out.push(S(k.cylinder(POST[0], POST[1], 5, MAG_H, 4, P, 28), { tone: "mid" }));
  const clamp = { x: POST[0] - 7, y: POST[1] - 7, w: 14, d: 14, r: 2.5 };
  out.push(S(k.cylinder(POST[0], POST[1], 3.2, MAG_H + 4, CLAMP_Z - 4 - MAG_H - 4, P, 28), { tone: "mid", crease: "none" }));
  out.push(L([60, 80].map((z) => k.sideArc(POST[0], POST[1], 3.2, z, P, 16)).join(""), { tone: "faint" }));
  out.push(S(k.slabOf(clamp, CLAMP_Z - 4, 12, P, 4, 0.6), { tone: "mid" }));
  out.push(S(k.cylinder(POST[0], POST[1], 3.2, CLAMP_Z + 8, POST_TOP - CLAMP_Z - 8, P, 28), { tone: "mid", crease: "none" }));
  out.push(S(k.cylinder(POST[0], POST[1], 3.8, POST_TOP, 2, P, 28), { tone: "mid" }));
  const arm = { x: POST[0] + 7, y: -3, w: DIAL[0] - DIAL_R - POST[0] - 7 + 2, d: 6, r: 2 };
  out.push(S(k.slabOf(arm, CLAMP_Z, 4, P, 4, 0.5), { tone: "mid" }));
  out.push(D([at([arm.x + 4, 0, CLAMP_Z + 4]), at([arm.x + arm.w - 5, 0, CLAMP_Z + 4])], { size: 0.45 }));
  const thumb: k.Plane = [clamp.x + 7, clamp.y + clamp.d + 3];
  out.push(S(k.slabOf({ x: thumb[0] - 1.4, y: clamp.y + clamp.d, w: 2.8, d: 3, r: 0.8 }, CLAMP_Z + 1, 4, P, 2), { tone: "mid", crease: "none" }));
  out.push(S(k.cylinder(thumb[0], thumb[1] + 1.4, 2.6, CLAMP_Z, 6, P, 20), { tone: "mid" }));
  out.push(L(k.knurl(thumb[0], thumb[1] + 1.4, 2.6, CLAMP_Z, CLAMP_Z + 6, 18, P), { tone: "lo" }));
  return out.join("");
}

function carriage() {
  const out = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(CARRIAGE, 3), CARRIAGE_Z, 0.1, P)}" style="filter:blur(4px)"/>`];
  out.push(S(k.slabOf(CARRIAGE, CARRIAGE_Z, CARRIAGE_TOP - CARRIAGE_Z, P, 5, 0.6), { tone: "mid" }));
  out.push(D([-22, -8, 8, 22].map((x) => at([x, CARRIAGE.y + CARRIAGE.d - 2.6, CARRIAGE_TOP])), { size: 0.4, tone: "lo" }));
  out.push(L(k.lineOnTop([CARRIAGE.x, -15.5], [CARRIAGE.x + CARRIAGE.w, -15.5], CARRIAGE_TOP, P), { tone: "faint" }));
  out.push(L(k.lineOnTop([CARRIAGE.x, 15.5], [CARRIAGE.x + CARRIAGE.w, 15.5], CARRIAGE_TOP, P), { tone: "faint" }));
  BLOCKS.forEach((height, index) => {
    const plan = { x: -24 + STEP * index, y: -12, w: BLOCK_W, d: 24, r: 1 };
    out.push(S(k.slabOf(plan, CARRIAGE_TOP, height, P, 3, 0.5), { tone: "hi", crease: "lo" }));
    out.push(L(k.planOutline(k.insetPlan(plan, 2), CARRIAGE_TOP + height, P, 3), { tone: "faint" }));
  });
  const handle: k.Plane = [CARRIAGE.x + CARRIAGE.w - 8, CARRIAGE.y + CARRIAGE.d + 3];
  out.push(S(k.slabOf({ x: handle[0] - 2, y: CARRIAGE.y + CARRIAGE.d - 1, w: 4, d: 4, r: 1 }, CARRIAGE_Z + 1, 3, P, 2), { tone: "mid", crease: "none" }));
  out.push(S(k.cylinder(handle[0], handle[1] + 1, 3, CARRIAGE_Z, 5, P, 20), { tone: "mid" }));
  out.push(L(k.knurl(handle[0], handle[1] + 1, 3, CARRIAGE_Z, CARRIAGE_Z + 5, 18, P), { tone: "lo" }));
  return out.join("");
}

function plunger() {
  return [
    S(k.cylinder(DIAL[0], DIAL[1], TIP_R, 0, 2.4, P, 20), { tone: "hi", lit: true }),
    S(k.cylinder(DIAL[0], DIAL[1], 1.4, 2.4, 50, P, 16), { tone: "hi", crease: "none", lit: true }),
  ].join("");
}

function dial() {
  const out: string[] = [];
  const [x, y] = DIAL;
  out.push(S(k.cylinder(x, y, 2.9, 54, DIAL_Z - 54, P, 20), { tone: "mid" }));
  out.push(L(k.sideArc(x, y, 2.9, 60, P, 12), { tone: "lo" }));
  out.push(S(k.slabOf({ x: x - DIAL_R - 6, y: -4, w: 8, d: 8, r: 1.5 }, DIAL_Z + 2, CLAMP_Z - DIAL_Z - 2, P, 3, 0.4), { tone: "mid" }));
  out.push(S(k.cylinder(x, y, DIAL_R, DIAL_Z, DIAL_H, P, 64, 0.8), { tone: "hi", crease: "lo" }));
  out.push(L(k.knurl(x, y, DIAL_R, DIAL_TOP - 3.4, DIAL_TOP, 84, P, 0.3), { tone: "lo" }));
  out.push(L(k.sideArc(x, y, DIAL_R, DIAL_TOP - 3.4, P, 40), { tone: "faint" }));
  out.push(L(k.ring(x, y, DIAL_R - 2.2, DIAL_TOP, P, 64), { tone: "lo" }));
  const ticks = k.radialTicks(x, y, DIAL_R - 3, 50, 5, DIAL_TOP, [1.3, 2.8], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  out.push(S(k.slabOf({ x: x + DIAL_R - 1, y: -2.4, w: 5, d: 4.8, r: 1.2 }, DIAL_Z + 2, 5, P, 3), { tone: "mid" }));
  out.push(S(k.slabOf({ x: x + DIAL_R + 3.6, y: -3.2, w: 2.6, d: 6.4, r: 1.2 }, DIAL_Z + 1.2, 6.6, P, 3), { tone: "mid" }));
  out.push(L(k.ring(x, y, 1.6, DIAL_TOP, P, 16), { tone: "mid" }));
  out.push(k.faceTextSvg(k.topMatrix([x, y + 9], DIAL_TOP, P, "x"), "VERIFIER", { size: 2.2, tone: "lo", anchor: "middle" }));
  return out.join("");
}

// The spec card: CLAUDE.md, standing in a slotted block at the front of the plate.
function card() {
  const out = [`<path class="iso-halo" d="${k.haloOf(CARD_BASE, 0, CARD_BASE_H, P)}" style="filter:blur(5px)"/>`];
  out.push(S(k.slabOf(CARD_BASE, 0, CARD_BASE_H, P, 4, 0.6), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(CARD_BASE, 1.6), CARD_BASE_H, P, 3), { tone: "faint" }));
  out.push(D([at([CARD_BASE.x + 3, CARD_BASE.y + CARD_BASE.d - 3, CARD_BASE_H]), at([CARD_BASE.x + CARD_BASE.w - 3, CARD_BASE.y + CARD_BASE.d - 3, CARD_BASE_H])], { size: 0.45 }));
  out.push(S(k.slabOf(CARD, CARD_BASE_H - 1.5, CARD_H, P, 2, 0.2), { tone: "hi", crease: "lo" }));
  const face = CARD.y + CARD.d;
  const top = CARD_BASE_H - 1.5 + CARD_H;
  out.push(k.faceTextSvg(k.sideMatrix([CARD.x + 3, face], top - 5, P, "left"), "CLAUDE.md", { size: 3.4, tone: "hi" }));
  // Three spec lines, one per block: a short rule for the label and the target height in print.
  SPEC.forEach((value, index) => {
    const z = top - 11 - index * 5.6;
    out.push(k.faceTextSvg(k.sideMatrix([CARD.x + 3, face], z + 1.1, P, "left"), `check ${index + 1}`, { size: 2.2, tone: "mid" }));
    out.push(k.faceTextSvg(k.sideMatrix([CARD.x + CARD.w - 3, face], z + 1.1, P, "left"), String(value), { size: 2.4, tone: "hi", anchor: "end" }));
  });
  return out.join("");
}

// The verdict lamp: a lens in a bezel; the page colours the lens by the verifier's reading.
function lamp() {
  const [x, y] = LAMP;
  const out = [`<path class="iso-halo" d="${k.haloOf({ x: x - 8, y: y - 8, w: 16, d: 16, r: 8 }, 0, 3, P)}" style="filter:blur(4px)"/>`];
  out.push(S(k.cylinder(x, y, 8, 0, 3, P, 40, 0.5), { tone: "mid" }));
  out.push(L(k.ring(x, y, 6.6, 3, P, 40), { tone: "faint" }));
  out.push(D([0, 1, 2, 3].map((i) => at([x + Math.cos(i * Math.PI / 2 + 0.4) * 7.3, y + Math.sin(i * Math.PI / 2 + 0.4) * 7.3, 3])), { size: 0.4 }));
  out.push(`<g data-part="lamp">${S(k.cylinder(x, y, 5, 3, 3.2, P, 40, 0.6), { tone: "hi", crease: "none" })}</g>`);
  return out.join("");
}

export const needleAt = (turn: number) => {
  const angle = turn * Math.PI * 2;
  const [x, y] = DIAL;
  return k.lineOnTop([x - Math.sin(angle) * 3.4, y + Math.cos(angle) * 3.4], [x + Math.sin(angle) * (DIAL_R - 4), y - Math.cos(angle) * (DIAL_R - 4)], DIAL_TOP + 0.2, P);
};

export const carriageAt = (x: number) => k.translateAlong(P, [x, 0, 0]);
export const plungerAt = (z: number) => k.translateAlong(P, [0, 0, z]);

/** The whole figure as an SVG string, posed at the first block. */
export function starterFigureSvg() {
  const start = STOPS[0];
  return k.figureSvg({
    width: WIDTH,
    height: HEIGHT,
    label:
      "A dial indicator on a surface plate, used as a verifier. A carriage slides three gauge blocks, Claude's three pieces of work, under the dial. A card printed CLAUDE.md stands at the front with the height each block should be: 18, 14 and 12. The dial reads each block and a lamp shows whether it matches. The third block is 10, two short of its spec, so it fails.",
    body: [
      plate(),
      rails(),
      fixture(),
      `<g data-part="carriage" transform="${carriageAt(start)}">${carriage()}</g>`,
      `<g data-part="plunger" transform="${plungerAt(CARRIAGE_TOP + BLOCKS[0])}">${plunger()}</g>`,
      dial(),
      `<path data-part="needle" class="iso-line" data-tone="lit" data-free="start" d="${needleAt(BLOCKS[0] / PER_TURN)}" style="stroke-width:1.1"/>`,
      card(),
      lamp(),
    ],
  });
}
