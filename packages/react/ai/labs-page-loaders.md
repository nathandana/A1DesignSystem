# Labs page loaders

Four playful page-loading patterns, each its own experiment, plus the shared
Labs scaffold they (and [Under construction](labs-page-construction.md)) use.
None is a published A1 component. Follow the
[Labs isolation contract](labs-contributing.md#isolate-experiments-and-prepare-them-for-a1).

## Shared scaffold — `apps/a1-labs/src/loading-preview/`

- `LoadingPreviewExperiment.jsx` — the Labs page: the shared responsive
  viewport (phone by default), a speed slider, Finish loading / Pause / Replay,
  `aria-busy` on the preview and a polite screen-reader status. Each experiment
  passes `speed`, `status` and `children({ loading, paused, speed, run })`.
- `SamplePage.jsx` — the page every loader loads (Harbor House: header, hero,
  three cards, full-width button). Its pieces are plain wrappers marked
  `data-loading-block`, so loaders use the wrappers' `::before`/`::after`
  without touching A1 components.
- `loader-utils.js` — `measureBlocks`, `skeletonLayers` (the layout as CSS
  background rectangles, optionally offset), `waitingProgress` (most of the
  way in the expected time, then ever slower, never complete),
  `useLoaderClock` (pausable rAF clock), `useReducedMotion` (live) and
  `setData` (change attributes only when needed, so CSS animations don't
  restart). Each loader core depends only on React and these helpers.

Every core takes `loading`, `paused`, a speed prop and
`blockSelector` (default `[data-loading-block]`). While loading, page content
is hidden or inert and out of the tab order; on finish it becomes the page.
Replay remounts the core with a `key`.

## Blueprint — `page-blueprint/`

`BlueprintLoader` (`stepDuration`, ms between blocks). The page sits on a
classic blueprint — the theme's strong `status.info` background as paper with
its paired foreground for the grid, outlines and labels, read live so it follows
light/dark. Each block's outline draws on corner to corner, labelled with its
measured size (`368 × 25`). Once drafted, the grid drifts until loading ends,
then the drafting fades into the page. Timeline: `draftStates`. Tokens:
`component.pageBlueprint` (steps, draw, pan, exit, grid size, line width).

## Jigsaw — `page-puzzle/`

`PuzzleLoader` (`buildDuration`, ms for every piece). The area is split into
roughly `tileSize` pieces; each piece's background is its slice of the page's
layout (`skeletonLayers` offset by the piece's position), so the finished
puzzle is the page skeleton. Pieces fly in from a seeded scatter, spinning,
and snap into place in a seeded shuffled order; a shine sweeps the finished
puzzle while loading continues; on finish the pieces fall away in arrival
order. Helpers: `tileGrid`, `arrivalOrder`, `scatter`, `piecesSent`. Tokens:
`component.pagePuzzle`.

## Fresh paint — `page-paint/`

`PaintLoader` (`coatDuration`, ms per pass). A paint roller sweeps down, up,
down…; each pass reveals a higher fidelity layer behind it: (1) the layout's
blocks, (2) text lines at their real line heights and widths plus buttons in
the action colour (measured from headings, paragraphs and buttons inside the
blocks), (3) the real page under a grey, softly blurred veil. Later passes
polish; on finish the roller leaves and the veil dries away. The page wrapper is
`inert` until then. Clips are computed in pixels against the shared roller
position because the layers differ in height. Helpers: `rollerState`,
`layerReveal`. Tokens: `component.pagePaint`.

## Sunrise — `page-sunrise/`

`SunriseLoader` (`expectedDuration`, a typical load). The page's blocks are
silhouettes under a starry night sky; a sun rises (screen-blended in front of
the silhouettes so it glows between them) and the sky warms through dawn. Its
climb follows `daylight` — most of the way in the expected time, then slowing,
never reaching day while loading. On finish a registered `@property
--a1-page-sunrise-day` transitions to full day, then the page appears. Sky,
sun and silhouette colours are `component.pageSunrise` tokens (a fixed palette
aliasing base ramps; the silhouettes lighten towards the live `surface.raised`).

## Recorded checks — Oct. 11, 2026

- All four (and the refactored Under construction) ran through their phases at
  phone and laptop sizes; nothing on the page was focusable while loading; the
  page was usable after Finish loading; Replay restarts.
- Axe reported no violations for each, with motion and with reduced motion.
  Reduced motion: Blueprint shows every block drafted, Jigsaw shows the finished
  puzzle, Fresh paint shows the third fidelity layer with no roller, Sunrise
  holds a fixed dawn.
- Unit tests cover every timeline and shared helper.
- Not yet done: a screen-reader review and other browsers.
