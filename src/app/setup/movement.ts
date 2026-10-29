import * as k from "@/lib/iso/iso-kit";

// The hero of /setup: a watch movement on a watchmaker's holder, drawn as Copilot OS.
// The barrel (the mainspring) is CLAUDE.md: the goal that powers everything. The train of wheels is
// the recurring jobs. The escapement and balance are the verifier: work only leaves the train one
// checked tick at a time. Every moving part is rebuilt from the angles below, so the server's first
// frame and the client's animation come from the same geometry.

export const WIDTH = 640;
export const HEIGHT = 430;

const PLATE_R = 110;
const PLATE_H = 6;
const HOLDER = { outer: 128, inner: 100, z: -16, h: 9 };

type Wheel = { at: k.Plane; r: number; teeth: number; z: number; h: number; spokes: number; pinion: number };

export const BARREL: Wheel = { at: [-34, -21], r: 34, teeth: 72, z: PLATE_H, h: 10, spokes: 0, pinion: 0 };
// Each wheel meshes the next one's pinion: centre distance = wheel radius + pinion radius.
export const CENTRE: Wheel = { at: [0, 0], r: 26, teeth: 64, z: 19, h: 1.4, spokes: 4, pinion: 5 };
export const THIRD: Wheel = { at: [30, 18], r: 22, teeth: 56, z: 10.5, h: 1.3, spokes: 4, pinion: 4 };
export const FOURTH: Wheel = { at: [40, 42], r: 18, teeth: 50, z: 8.5, h: 1.2, spokes: 4, pinion: 3 };
export const ESCAPE = { at: [60, 48.4] as k.Plane, r: 12, teeth: 15, z: 8.5, h: 1.2 };
export const BALANCE = { at: [78, 2] as k.Plane, r: 24, z: 16, h: 2.4, screws: 14 };
const PALLET_PIVOT: k.Plane = [70, 30];

export const P = k.fitProjection(
  k.circleRing(0, 0, HOLDER.outer, 48).flatMap(([x, y]) => [[x, y, HOLDER.z] as k.Point3, [x, y, 28] as k.Point3]),
  WIDTH,
  HEIGHT,
  { pad: 6, azimuth: 38, elevation: 42 },
);

const at = (point: k.Point3) => k.iso(point, P);
const S = (paths: k.SolidPaths, style?: k.SolidStyle) => k.solidSvg(paths, style);
const L = (d: string, style?: k.LineStyle) => k.lineSvg(d, style);
const D = (points: k.Flat[], style?: { size?: number; tone?: k.Tone }) => k.dotsSvg(points, style);
const TAU = Math.PI * 2;
const polar = ([cx, cy]: k.Plane, r: number, a: number): k.Plane => [cx + Math.cos(a) * r, cy + Math.sin(a) * r];

/** A rounded bar between two points: bridges, arms and spokes. */
function capsule(from: k.Plane, to: k.Plane, width: number, steps = 10): k.Plane[] {
  const angle = Math.atan2(to[1] - from[1], to[0] - from[0]);
  const half = width / 2;
  const out: k.Plane[] = [];
  for (let i = 0; i <= steps; i++) out.push(polar(to, half, angle - Math.PI / 2 + (Math.PI * i) / steps));
  for (let i = 0; i <= steps; i++) out.push(polar(from, half, angle + Math.PI / 2 + (Math.PI * i) / steps));
  return out;
}

/** Outer toothed edge, counter-clockwise. Escape teeth lean forward like club teeth. */
function toothRing(center: k.Plane, r: number, teeth: number, phase: number, depth: number, club = false): k.Plane[] {
  const out: k.Plane[] = [];
  const pitch = TAU / teeth;
  for (let i = 0; i < teeth; i++) {
    const a = phase + i * pitch;
    if (club) {
      out.push(polar(center, r - depth, a), polar(center, r, a + pitch * 0.55), polar(center, r - depth * 0.35, a + pitch * 0.72));
    } else {
      out.push(
        polar(center, r - depth, a),
        polar(center, r - depth, a + pitch * 0.18),
        polar(center, r, a + pitch * 0.32),
        polar(center, r, a + pitch * 0.58),
        polar(center, r - depth, a + pitch * 0.72),
      );
    }
  }
  return out;
}

/** Outer edge plus a reversed inner circle joined by a hairline cut: a ring with a hole. */
function withHole(outer: k.Plane[], center: k.Plane, inner: number, steps = 48): k.Plane[] {
  const hole: k.Plane[] = [];
  for (let i = steps; i >= 0; i--) hole.push(polar(center, inner, (TAU * i) / steps));
  return [...outer, outer[0]!, ...hole];
}

const solid = (ring: k.Plane[], z: number, h: number) => k.extrude(ring, z, h, P, { convex: false });

function jewel([x, y]: k.Plane, z: number, size = 2.6) {
  return [
    S(k.cylinder(x, y, size + 1.2, z, 0.5, P, 24), { tone: "mid" }),
    S(k.cylinder(x, y, size * 0.55, z + 0.5, 0.4, P, 18), { tone: "hi", crease: "none", className: "jewel" }),
  ].join("");
}

function screw([x, y]: k.Plane, z: number, slot: number) {
  const a = slot;
  return [
    S(k.cylinder(x, y, 2.4, z, 0.9, P, 20, 0.3), { tone: "hi", lit: true, className: "screw" }),
    L(k.lineOnTop(polar([x, y], 1.9, a), polar([x, y], 1.9, a + Math.PI), z + 0.9, P), { tone: "lo" }),
  ].join("");
}

function holder() {
  const out = [`<path class="iso-halo" d="${k.haloOf({ x: -HOLDER.outer, y: -HOLDER.outer, w: HOLDER.outer * 2, d: HOLDER.outer * 2, r: HOLDER.outer }, HOLDER.z, HOLDER.h, P)}"/>`];
  // A solid disc: the plate covers the holder's opening, so a ring with a hole would only add a seam.
  out.push(S(k.cylinder(0, 0, HOLDER.outer, HOLDER.z, HOLDER.h, P, 120, 0.8), { tone: "mid" }));
  out.push(L(k.ring(0, 0, HOLDER.outer - 5, HOLDER.z + HOLDER.h, P, 96), { tone: "faint" }));
  const top = HOLDER.z + HOLDER.h;
  // Graduations around the holder: every 6 degrees, a longer mark every 30.
  const ticks = k.radialTicks(0, 0, HOLDER.outer - 1.5, 60, 5, top, [1.6, 3.4], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  // Three jaws hold the plate. Each has a knurled screw.
  for (const deg of [100, 220, 340]) {
    const a = (deg * Math.PI) / 180;
    const jaw = capsule(polar([0, 0], PLATE_R + 1.5, a), polar([0, 0], HOLDER.outer - 6, a), 11);
    out.push(S(solid(jaw, top, 3), { tone: "mid" }));
    const [sx, sy] = polar([0, 0], HOLDER.outer - 12, a);
    out.push(S(k.cylinder(sx, sy, 3.6, top + 3, 3, P, 24), { tone: "mid" }));
    out.push(L(k.knurl(sx, sy, 3.6, top + 3, top + 6, 20, P), { tone: "lo" }));
  }
  return out.join("");
}

function plate() {
  const out: string[] = [];
  out.push(S(k.cylinder(0, 0, PLATE_R, 0, PLATE_H, P, 120, 0.8), { tone: "hi", crease: "lo", className: "plate" }));
  // Perlage: overlapping circular graining across the plate, the finish of a hand-made movement.
  const marks: string[] = [];
  for (let gx = -PLATE_R + 8; gx < PLATE_R; gx += 7) {
    for (let gy = -PLATE_R + 8; gy < PLATE_R; gy += 7) {
      const shift = (Math.round((gx + PLATE_R) / 7) % 2) * 3.5;
      const y = gy + shift;
      if (Math.hypot(gx, y) > PLATE_R - 7) continue;
      marks.push(k.ring(gx, y, 3.8, PLATE_H, P, 14));
    }
  }
  out.push(L(marks.join(""), { tone: "faint" }));
  out.push(L(k.ring(0, 0, PLATE_R - 3, PLATE_H, P, 120), { tone: "lo" }));
  out.push(k.faceTextSvg(k.topMatrix([-62, 84], PLATE_H, P, "x"), "COPILOT OS · CAL. 01 · TOKYO", { size: 3, tone: "mid" }));
  return out.join("");
}

export function barrel() {
  const { at: c, r, teeth, z, h } = BARREL;
  const out = [S(solid(toothRing(c, r, teeth, 0, 1.6), z, h), { tone: "hi", crease: "lo", className: "gilt" })];
  const top = z + h;
  out.push(L(k.ring(c[0], c[1], r - 4, top, P, 72), { tone: "lo" }));
  out.push(L(k.ring(c[0], c[1], r - 5.2, top, P, 72), { tone: "faint" }));
  // Sunburst brushing on the lid.
  const rays: string[] = [];
  for (let i = 0; i < 48; i++) rays.push(k.lineOnTop(polar(c, 15, (TAU * i) / 48), polar(c, r - 7, (TAU * i) / 48), top, P));
  out.push(L(rays.join(""), { tone: "faint" }));
  out.push(k.faceTextSvg(k.topMatrix([c[0] - 13, c[1] + 23], top, P, "x"), "CLAUDE.md", { size: 4.2, tone: "hi" }));
  // Ratchet wheel and its click on top of the barrel arbor.
  out.push(S(solid(toothRing(c, 13, 30, 0.2, 1.4, true), top, 1.6), { tone: "hi", crease: "lo" }));
  out.push(screw(c, top + 1.6, 0.6));
  const click = capsule([c[0] + 6, c[1] - 18], [c[0] + 16, c[1] - 9], 4.4);
  out.push(S(solid(click, top, 1.2), { tone: "mid" }));
  out.push(screw([c[0] + 16, c[1] - 9], top + 1.2, 1.2));
  return out.join("");
}

/** A spoked wheel with its pinion and arbor, turned to `angle`. */
export function wheel(w: Wheel, angle: number) {
  const { at: c, r, teeth, z, h, spokes, pinion } = w;
  const out: string[] = [];
  out.push(S(k.cylinder(c[0], c[1], pinion, PLATE_H, z - PLATE_H, P, 16), { tone: "mid" }));
  out.push(L(k.knurl(c[0], c[1], pinion, z - 2.4, z, Math.round(pinion * 3), P, 0.2), { tone: "lo" }));
  out.push(S(solid(withHole(toothRing(c, r, teeth, angle, 1.3), c, r - 3.2), z, h), { tone: "hi", crease: "lo", className: "gilt" }));
  for (let i = 0; i < spokes; i++) {
    const a = angle + (TAU * i) / spokes + 0.3;
    out.push(S(solid(capsule(polar(c, 2.5, a), polar(c, r - 2.6, a - 0.12), 2.6, 6), z, h), { tone: "hi", crease: "none", className: "gilt" }));
  }
  out.push(S(k.cylinder(c[0], c[1], 4, z, h + 0.4, P, 24), { tone: "hi", className: "gilt" }));
  out.push(D([at([c[0], c[1], z + h + 0.4])], { size: 0.7, tone: "hi" }));
  return out.join("");
}

export function escapeWheel(angle: number) {
  const { at: c, r, teeth, z, h } = ESCAPE;
  const out = [S(k.cylinder(c[0], c[1], 2.4, PLATE_H, z - PLATE_H, P, 16), { tone: "mid" })];
  out.push(S(solid(withHole(toothRing(c, r, teeth, angle, 3.2, true), c, r - 5.5, 32), z, h), { tone: "hi", crease: "lo" }));
  for (let i = 0; i < 4; i++) {
    const a = angle + (TAU * i) / 4;
    out.push(S(solid(capsule(polar(c, 1.6, a), polar(c, r - 5.8, a), 1.6, 6), z, h), { tone: "hi", crease: "none" }));
  }
  out.push(S(k.cylinder(c[0], c[1], 2.6, z, h + 0.4, P, 18), { tone: "hi" }));
  return out.join("");
}

/** The pallet fork rocks a few degrees with the balance: it is the gate the verifier opens. */
export function pallet(tilt: number) {
  const z = ESCAPE.z + ESCAPE.h + 0.4;
  const toEscape = Math.atan2(ESCAPE.at[1] - PALLET_PIVOT[1], ESCAPE.at[0] - PALLET_PIVOT[0]) + tilt;
  const toBalance = Math.atan2(BALANCE.at[1] - PALLET_PIVOT[1], BALANCE.at[0] - PALLET_PIVOT[0]) + tilt;
  const out: string[] = [];
  const head = polar(PALLET_PIVOT, 10, toEscape);
  out.push(S(solid(capsule(PALLET_PIVOT, head, 3.2), z, 1.2), { tone: "hi", crease: "lo" }));
  for (const side of [-0.55, 0.55]) {
    const arm = polar(head, 6, toEscape + Math.PI / 2 + side * 2.2);
    out.push(S(solid(capsule(head, arm, 2.4, 6), z, 1.2), { tone: "hi", crease: "none" }));
    out.push(S(k.cylinder(arm[0], arm[1], 1.2, z, 1.6, P, 12), { tone: "hi", crease: "none", className: "jewel" }));
  }
  out.push(S(solid(capsule(PALLET_PIVOT, polar(PALLET_PIVOT, 17, toBalance), 2.4, 6), z, 1.2), { tone: "hi", crease: "none" }));
  out.push(jewel(PALLET_PIVOT, z + 1.2, 1.8));
  return out.join("");
}

/** The balance and hairspring, swung to `angle`. Its screws catch the light as it turns. */
export function balance(angle: number) {
  const { at: c, r, z, h, screws } = BALANCE;
  const out = [S(k.cylinder(c[0], c[1], 1.6, PLATE_H, z - PLATE_H, P, 12), { tone: "mid" })];
  out.push(S(k.cylinder(c[0], c[1], 5, z - 3, 1.2, P, 24), { tone: "hi" }));
  out.push(S(solid(withHole(k.circleRing(c[0], c[1], r, 72), c, r - 3, 72), z, h), { tone: "hi", crease: "lo", lit: true }));
  for (let i = 0; i < 3; i++) {
    const a = angle + (TAU * i) / 3;
    out.push(S(solid(capsule(polar(c, 2, a), polar(c, r - 2.8, a), 2.2, 6), z + 0.6, 1.2), { tone: "hi", crease: "none" }));
  }
  const top = z + h;
  for (let i = 0; i < screws; i++) {
    const [x, y] = polar(c, r - 1.5, angle + (TAU * i) / screws);
    out.push(S(k.cylinder(x, y, 1.15, top, 0.9, P, 12), { tone: "hi", crease: "none", className: "screw" }));
  }
  // Hairspring: a flat spiral breathing with the swing.
  const spiral: k.Plane[] = [];
  const turns = 7;
  for (let i = 0; i <= turns * 40; i++) {
    const t = i / (turns * 40);
    spiral.push(polar(c, 3.2 + t * 13 * (1 + Math.sin(angle) * 0.015), angle * (1 - t) + t * turns * TAU));
  }
  out.push(L(k.onTop(spiral, top + 0.3, P), { tone: "mid" }));
  out.push(S(k.cylinder(c[0], c[1], 2.2, top, 1.2, P, 18), { tone: "hi" }));
  return out.join("");
}

function bridge(points: k.Plane[], width: number, z: number, h: number, post: k.Plane, label?: { text: string; at: k.Plane }) {
  const out = [S(k.cylinder(post[0], post[1], 3.4, PLATE_H, z - PLATE_H, P, 20), { tone: "mid" })];
  for (let i = 0; i < points.length - 1; i++) {
    out.push(S(solid(capsule(points[i]!, points[i + 1]!, width), z, h), { tone: "hi", crease: "lo" }));
  }
  // Côtes de Genève: fine parallel bands along each bridge.
  const bands: string[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const [a, b] = [points[i]!, points[i + 1]!];
    const angle = Math.atan2(b[1] - a[1], b[0] - a[0]);
    for (const off of [-width / 4, width / 4]) {
      const n: k.Plane = [Math.cos(angle + Math.PI / 2) * off, Math.sin(angle + Math.PI / 2) * off];
      bands.push(k.lineOnTop([a[0] + n[0] + Math.cos(angle) * 3, a[1] + n[1] + Math.sin(angle) * 3], [b[0] + n[0] - Math.cos(angle) * 3, b[1] + n[1] - Math.sin(angle) * 3], z + h, P));
    }
  }
  out.push(L(bands.join(""), { tone: "faint" }));
  out.push(screw(post, z + h, 0.9));
  if (label) out.push(k.faceTextSvg(k.topMatrix(label.at, z + h, P, "x"), label.text, { size: 2.4, tone: "mid" }));
  return out.join("");
}

function trainBridge() {
  return [
    bridge([[8, 76], FOURTH.at, THIRD.at], 11, 13, 2.2, [8, 76]),
    jewel(FOURTH.at, 15.2),
    jewel(THIRD.at, 15.2),
  ].join("");
}

function centreBridge() {
  return [bridge([[-46, 62], CENTRE.at], 13, 22, 2.4, [-46, 62]), jewel(CENTRE.at, 24.4, 3)].join("");
}

function escapeBridge() {
  return [bridge([[90, 60], ESCAPE.at], 9, 12, 2, [90, 60]), jewel(ESCAPE.at, 14, 2)].join("");
}

function balanceCock() {
  const { at: c } = BALANCE;
  const z = 22;
  const post: k.Plane = [96, -36];
  return [
    bridge([post, c], 12, z, 2.6, post, { text: "VERIFIER", at: [c[0] + 4, c[1] - 22] }),
    // Regulator index: a fine arm over a graduated arc (− / +).
    L(k.radialTicks(c[0], c[1], 9.5, 21, 5, z + 2.6, [0.8, 1.6], P, -2.4, 1.2).minor, { tone: "lo" }),
    S(solid(capsule(c, polar(c, 13, -1.6), 1.6, 6), z + 2.6, 0.6), { tone: "hi", crease: "none", lit: true }),
    jewel(c, z + 2.6, 2.4),
  ].join("");
}

/** Angles for a moment in time. The balance swings; each half swing frees the escape wheel one tooth. */
export function poseAt(seconds: number) {
  const period = 1.6;
  const phase = (seconds / period) * TAU;
  const balanceAngle = Math.sin(phase) * 2.6;
  const ticks = Math.floor(seconds / (period / 2));
  const within = (seconds % (period / 2)) / (period / 2);
  const snap = Math.min(1, within * 6);
  const ease = 1 - Math.pow(1 - snap, 3) * Math.cos(snap * 3);
  const escapeAngle = ((ticks + ease) * TAU) / ESCAPE.teeth / 2;
  const drive = escapeAngle;
  return {
    ticks,
    balance: balanceAngle,
    pallet: Math.sign(Math.sin(phase)) * 0.09 * Math.min(1, Math.abs(Math.sin(phase)) * 3),
    escape: escapeAngle,
    fourth: -drive * (ESCAPE.r / FOURTH.r) * 0.1,
    third: drive * 0.012,
    centre: -drive * 0.002,
  };
}

/** Moving parts, each in its own group so the client can rebuild just that group. */
export const MOVING = {
  centre: (pose: ReturnType<typeof poseAt>) => wheel(CENTRE, pose.centre),
  third: (pose: ReturnType<typeof poseAt>) => wheel(THIRD, pose.third),
  fourth: (pose: ReturnType<typeof poseAt>) => wheel(FOURTH, pose.fourth),
  escape: (pose: ReturnType<typeof poseAt>) => escapeWheel(pose.escape),
  pallet: (pose: ReturnType<typeof poseAt>) => pallet(pose.pallet),
  balance: (pose: ReturnType<typeof poseAt>) => balance(pose.balance),
};
export type MovingPart = keyof typeof MOVING;

export function movementSvg() {
  const pose = poseAt(0.35);
  const g = (part: MovingPart) => `<g data-part="${part}">${MOVING[part](pose)}</g>`;
  return k.figureSvg({
    width: WIDTH,
    height: HEIGHT,
    label:
      "A watch movement on a watchmaker's holder, drawn as Copilot OS. The mainspring barrel is engraved CLAUDE.md: the goal that powers everything. A train of wheels carries the recurring jobs. The escapement and balance, under a bridge engraved VERIFIER, let the work out one checked tick at a time.",
    body: [
      holder(),
      plate(),
      g("fourth"),
      g("escape"),
      g("third"),
      escapeBridge(),
      g("pallet"),
      trainBridge(),
      barrel(),
      g("balance"),
      g("centre"),
      centreBridge(),
      balanceCock(),
    ],
  });
}
