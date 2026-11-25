// Vendored from github.com/Jakubantalik/thinking-orbs: MIT, (c) 2026 Jakub Antalik. See LICENSE in vendor/thinking-orbs. Trimmed to two types, as the note below says.
// Trimmed from upstream src/types.ts: only the two types presets.ts needs.
// The React prop types of the upstream canvas component are not vendored.

export type OrbState =
  | 'working'
  | 'searching'
  | 'solving'
  | 'listening'
  | 'connecting'
  | 'weaving'
  | 'composing'
  | 'breathing'
  | 'shaping';

/** The two tuned presets: 64 (avatar scale) and 20 (inline-text scale). */
export type OrbSize = 64 | 20;
