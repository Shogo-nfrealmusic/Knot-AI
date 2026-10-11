// Camera-aperture glyph used as the TPS booking site mark.
export function ApertureMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m14.31 8 5.74 9.94" />
      <path d="M9.69 8h11.48" />
      <path d="m7.38 12 5.74-9.94" />
      <path d="M9.69 16 3.95 6.06" />
      <path d="M14.31 16H2.83" />
      <path d="m16.62 12-5.74 9.94" />
    </svg>
  );
}

// Every panel in the tour receives the same two flags.
export type PanelProps = {
  /** The panel is selected and the section is on screen. */
  active: boolean;
  /** `active`, and the viewer has not asked for reduced motion. */
  animate: boolean;
};

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
