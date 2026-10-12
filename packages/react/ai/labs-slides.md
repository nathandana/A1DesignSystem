# Labs slides

A presentation deck that compares slide transitions, from simple fades to
content-aware morphs, and ways of loading each slide's content. The slides are
influenced by a reference deck but drawn with A1 components, tokens and
invented copy. It is not a published A1 component. Follow the
[Labs isolation contract](labs-contributing.md#isolate-experiments-and-prepare-them-for-a1).

## Transitions (simple to complex)

| Transition | What moves |
| --- | --- |
| Cut | Nothing; the slide switches. |
| Fade | The current slide fades out over the next one. |
| Push | The next slide pushes the current one off; mirrored going back. |
| Zoom | The current slide grows and fades; the next settles in from slightly smaller. |
| Color wipe | A panel in the next slide's accent sweeps across; the slides swap while it covers the stage. |
| Cascade | Content-aware: the current slide's pieces leave in reverse order, then the next slide's pieces arrive in order. |
| Morph | Content-aware: pieces both slides share (same `data-morph` key) move, resize and recolour into place, with any different content cross-fading; other pieces fade out and in, and the slide background blends. |

Morph pairs in the sample deck: 1 ↔ 10 (logo), 2 → 3 (ten ramp columns and the
title card), 4 → 5 (header band and stripe), 7 → 8 (big icon and title card).

## Content builds

All at once; Fade in (points fade in together after the transition); Rise in
(points rise in one after another); Step through (each Next reveals one more
point before moving on; going back shows a slide fully built).

## Files and API

- `apps/a1-labs/src/slides/SlideDeck.jsx` — `SlideDeck` (`slides`, controlled
  `index` + `onIndexChange`, `transition`, `build`, `speed`
  (`quick`/`standard`/`relaxed`), `label`). Slides are
  `{ id, title, accent, render }`. A slide marks pieces with `data-part`,
  shared pieces with `data-morph="key"` and points with `data-build`. The deck
  draws slides on a fixed canvas (`component.slides.canvasWidth`, 16:9) scaled
  to the stage, so A1 type tokens keep their proportions. During a transition
  both slides are layers on the canvas, animated with the Web Animations API;
  morph measures shared pieces and maps one box onto the other.
- `slide-motion.js` — pure transition/build logic (`TRANSITIONS`, `BUILDS`,
  `layerFrames`, `wipeFrames`, `mapRect`, `staggerDelays`, `buildSchedule`,
  `navigate`), unit-tested in `tests/slides.test.mjs`.
- `deck.jsx` — the ten sample slides. `SlidesExperiment.jsx` — the Labs page.
- `slides.css` — stage, canvas and slide artwork. Every value is a token:
  live semantic roles for colour, `component.slides` tokens for the ramp
  swatches, ratio and choreography, and spacing/radius/type tokens. Stacking
  follows DOM order (incoming, outgoing, wipe panel), so there are no z-index
  values. The only literal numbers left are the sample chart's data.

## Tokens

`component.slides`: `canvasWidth`, `padding`, `stripe`, `bigIcon`, `logo`,
`shift`, `zoomOut`, `zoomIn`, `speedQuick` / `speedStandard` / `speedRelaxed`
(300 / 500 / 750 ms), `staggerStep`, `buildDuration`, `aspectRatio`,
`rampWarm.0–9` / `rampCool.0–9` (aliases of the warn/info ramps) and the
choreography fractions `handoff` (0.5: wipe swap, cascade arrivals),
`fadeOutBy` (0.4), `fadeInFrom` (0.45) and `pieceShare` (0.4). The deck reads
them at runtime, so changing a token retimes every transition. Token story:
Foundations/Tokens/Slides.

## Accessibility

- The stage is a focusable region (carousel); slides are labelled groups
  ("4 of 10: …"). The outgoing slide is `aria-hidden` and `inert`.
- Arrow keys, Page Up/Down and Space move; Home/End jump. Previous/Next
  buttons; Next reads "Show next point" while a step-through slide has more.
- A polite status announces the slide and, in step-through, the point.
- Reduced motion cuts between slides and loads points without movement.

## Recorded checks — Oct. 11, 2026

- Every slide in light, dark and phone: axe reported no violations; no console
  errors. Each transition was captured mid-flight; morph sampled frame by frame
  (the card travels and the ramp recolours over the full duration). Step-through,
  keyboard, rapid interrupts (layers settle to one) and reduced motion (no
  running animations) checked. Unit tests pass.
- Not yet done: a screen-reader review, other browsers and every theme.
