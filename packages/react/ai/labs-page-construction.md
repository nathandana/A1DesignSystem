# Labs "Under construction" page loader

A playful page-loading pattern, not a published A1 component. Follow the
[Labs isolation contract](labs-contributing.md#isolate-experiments-and-prepare-them-for-a1).
While a page loads, a tower crane builds it: it fetches each block at its mast,
carries it along the jib, lowers it into the block's real place and sets it
down as a placeholder with a small puff of dust. Once everything is placed it
waits, hook bobbing, while the placeholders shimmer. When loading finishes the
crane lifts away, its headroom closes and the placeholders become the page.

## Files and reusable API

- `apps/a1-labs/src/page-construction/PageConstruction.jsx` exports
  `PageConstruction` and imports `page-construction.css`. Its only dependency
  is React. `construction.js` is the pure, deterministic crane timeline
  (`craneState(time, step, targets, { home, raised })`), unit-tested in
  `tests/page-construction.test.mjs`.
- `PageConstructionExperiment.jsx` uses the shared `loading-preview`
  scaffold (see [Page loaders](labs-page-loaders.md)) for the sample page,
  responsive viewport, simulated loading and configuration, passing
  `blockSelector="[data-loading-block]"`.

| Prop | Values | Default |
| --- | --- | --- |
| `loading` | `true` builds; `false` reveals the page | `true` |
| `paused` | Freeze the crane and shimmer | `false` |
| `stepDuration` | ms to fetch, place and return for one block | `1300` |
| `blockSelector` | Which descendants are blocks | `[data-construction-block]` |
| `children` | The page; mark blocks with `data-construction-block` (or `blockSelector`) | — |

Mark plain wrapper elements, not A1 components: the block's `::before` is the
placeholder and `::after` the dust. Blocks are placed in document order and get
`data-construction-state` = `pending` (hidden, space kept), `placed`
(placeholder in the exact footprint, content hidden and out of the tab order)
or `done` (content shown, placeholder fading). The root gets
`data-phase` = `build`, `idle` or `exit`. Positions are measured from the live
layout and remeasured on resize, so the crane adapts to every viewport. The
component is page-level: it fills the viewport height so the mast reaches the
ground. Remount it (e.g. with a `key`) to replay.

## Tokens

`component.pageConstruction`: `stepFast` / `stepDuration` / `stepSlow` (800 /
1300 / 2000 ms), `headroom`, `jibHeight`, `mastWidth`, `trolleyWidth`,
`ropeWidth`, `hookSize`, `raisedRope`, `dustSize`, `settleDuration`,
`exitDuration`, `shimmerDuration`. Colours are live theme roles: the crane uses
`status.warn` background/foreground (construction yellow and its contrast
line), the rope `text.muted`, the trolley `text.default`, placeholders
`surface.raised` with `border.subtle`.

## Accessibility and motion

The crane is decorative (`aria-hidden`). The host exposes loading through
`aria-busy` on the preview and a polite, screen-reader-only status (building,
paused, ready). Placeholder content is hidden from interaction until done. With
reduced motion every placeholder appears at once, the crane stays parked, and
landing, dust, shimmer and exit transitions are removed.

## Recorded checks — Oct. 11, 2026

- Blocks placed in order at phone and laptop sizes (laptop: cards land in a
  3-column row); idle shimmer after the build; Finish loading revealed the page
  and collapsed the headroom; Replay restarts.
- No page buttons were focusable while loading. Axe reported no violations,
  with motion and with reduced motion. Crane timeline unit tests pass.
- Not yet done: a screen-reader review and other browsers.
