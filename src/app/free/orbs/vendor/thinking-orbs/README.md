# thinking-orbs (vendored)

- Source: https://github.com/Jakubantalik/thinking-orbs (Jakub Antalik, MIT — see LICENSE)
- Commit: de85557ca220332586d070d8788c0e1d6e877a0d (2026-08-16), package version 0.3.1
- Copied: `src/engine/*` (except index.ts) and `src/presets.ts`, unchanged apart from one credit line at the top of each file. `types.ts` is trimmed to the two types presets.ts needs.
- Not copied: the upstream React canvas component. /free/78 draws with its own small canvas wrapper (`src/app/free/orbs/OrbsDemos.tsx`), driven by requestAnimationFrame.
- `UPSTREAM_README.md` is the repo's README as read for reel #78 (2026-11-25); `data.test.mjs` checks the page's quoted lines against it.
- Reviewed 2026-11-23: pure geometry, no network, no dynamic code, no dependencies.

To update: copy the same files from a newer upstream commit, keep the credit line, and update the commit line above.
