// Shared timing for the scroll-driven parts of /setup, so every scene starts and finishes at the same place on
// the screen and moves with the same feel.

/**
 * How far an element has travelled up the screen: 0 when its top edge comes up from the bottom of the
 * viewport, 1 when its middle reaches the middle of the viewport. So each animation is done just as its
 * picture passes the centre of the screen, never before it is seen and never only near the top.
 */
export function throughCentre(rect: DOMRect, vh: number) {
  const start = vh * 0.95;
  const end = vh * 0.5 - rect.height / 2;
  return Math.min(1, Math.max(0, (start - rect.top) / Math.max(1, start - end)));
}

/**
 * Frame-rate independent smoothing towards a target: the same ~90 ms lag at 60 Hz, 120 Hz or a dropped frame,
 * so fast phones and slow ones glide the same way instead of stepping.
 */
export function follow(current: number, target: number, dtMs: number, tauMs = 90) {
  const k = 1 - Math.exp(-Math.min(dtMs, 64) / tauMs);
  const next = current + (target - current) * k;
  return Math.abs(target - next) < 0.0004 ? target : next;
}
