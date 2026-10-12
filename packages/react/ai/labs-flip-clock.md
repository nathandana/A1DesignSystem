# Flip clock

`/experiments/flip-clock` is a Three.js physical split-flap clock, categorized
under Data and visualization and tagged Data visualization / Motion. The route
is lazy-loaded so the scene does not add Three.js to the home page's entry chunk.

## Core and host

`apps/a1-labs/src/flip-clock/FlipClock.jsx` exports the reusable `FlipClock`:

- `time`: a valid Date supplied by its host; local hours, minutes and seconds.
- `variant`: `station` (default) or `compact`. Compact uses a smaller 456px
  maximum width and 3:1 stage, without housing, feet, corner screws or recesses.
  Cards retain their layers and hinge pins directly on the transparent canvas.
- `format`: `24` (default) or `12`, with an explicit a.m./p.m. text equivalent.
- `showSeconds`: true by default; false renders four cards instead of six.
- `inverted`: false for black cards with white ink, true for white cards.
- `view`: `angled` (default) or `front`.
- `duration`: complete digit-transition duration in milliseconds, default 500.
  A reset divides this time among its intermediate cards, so even 9→0 finishes
  before the next second. Keep the total below one second for live seconds.

The core owns neither the clock source nor the Labs shell. The host owns live
local time, pause/resume and the demo starting at 23:59:57. Live time reads the
wall clock instead of incrementing a counter, preventing timer drift. Resume
resynchronizes live time; the demo resumes from its paused time. No sound.

`clock-model.js` provides pure formatting and re-exports shared flap poses.
`clock-scene.js` adapts `src/split-flap/scene.js` to a clock; that shared renderer
also drives the [flip billboard](labs-flip-billboard.md). Its optional `housing`
flag defaults to true; the compact clock passes false, with `feet: false`.
The station scene has rounded housing, recesses, stacked cards, hinge pins, feet,
lights, shadows and generated numeral textures. Only changed digits animate.
`clockDigitCycle(from, to)` in `clock-model.js` makes zero resets descend through
every intervening digit: 9→8→7→6→5→4→3→2→1→0, or 5→4→3→2→1→0. Other
changes keep one flip. Both Station and Compact use this path. The adapter
passes `sequenceTiming: 'total'`; the billboard retains per-character timing.
The native time always reports the actual target time, never intermediate cards.
The outgoing top folds toward the viewer around its center hinge; the incoming
bottom settles below it. Separate readable faces prevent mirrored numerals.
Only active flips request animation frames; steady frames render on change or
resize. Dispose all GPU resources, observers and pending frames on unmount.

## Styling and accessibility

All scene materials, dimensions and lighting use `component.flipClock` tokens.
`compactMaxWidth` references `base.contentWidth.xs`; `compactStageRatio` sets the
compact canvas bounds. Isolated variant selectors only size the WebGL surface.
The black-and-white object stays monochrome across themes, as requested. The
transparent scene sits on the active A1 surface. CSS is isolated in
`flip-clock.css` and only sizes the WebGL surface; A1 owns surrounding controls,
layout, typography and focus. Its camera fits the measured surface at every
size. No external fonts, models, textures or network assets are needed.

The visual canvas is decorative. A visible `<time role="timer" aria-live="off">`
exposes the exact time without announcing every second. Pause and source changes
are politely announced in a separate status. Respect reduced motion on initial
load and live changes: settle any active flip immediately and update cards with
no movement. A WebGL failure or lost context keeps the readable clock available.

## Validation and promotion

- `npm test --workspace=a1-labs`: rollover/formatting, reset paths and hinge-pose tests.
- With the Labs dev server running:
  `node --test apps/a1-labs/tests/flip-clock.browser.mjs` checks midnight,
  animation, pause/resume, variant changes without resetting time, formats, both
  stocks, seconds, live reduced motion,
  xs–xl fitting for both variants, focused axe and WebGL fallback.
  Also run against the production preview with `LABS_ORIGIN=http://127.0.0.1:4189`:
  CSS minification shortens numeric fractions and duration units, so token parsing
  must accept both `0.13` / `.13` and `500ms` / `.5s`.
- Capture the actual scene:
  `node apps/a1-labs/scripts/capture-previews.mjs http://127.0.0.1:5187 --clock-only`.
- Review the real intermediate flap and resting frames, including white stock.

Recorded validation: 90 Labs unit tests and the production build passed. The
browser regression passed against the production preview, including zero focused
axe violations. Reviewed angled/intermediate/white-stock frames and the light-mode
mobile rendering. The compact update passed the clock and billboard production
browser regressions, including both clock sizes across five widths, preserved
paused time, reduced motion and WebGL fallback. Its frameless screenshot was
visually reviewed. No repeated theme contrast sweep was run.

This is a Labs candidate, not an approved shared A1 component. Before promotion,
validate in a separate A1 host and with assistive technology, then follow the
shared component API, stories, documentation and cross-package workflow.

Zero-reset validation: 96 unit tests and the production build passed. Clock and
billboard browser regressions passed; intermediate 9→0 and 5→0 faces were
asserted and visually inspected at midnight, with final zero faces verified.
