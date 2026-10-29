# Labs segmented control transitions

Ways for the A1 SegmentedControl's selected background to move between
options. Not a published A1 component or prop. Follow the
[Labs isolation contract](labs-contributing.md#isolate-experiments-and-prepare-them-for-a1).

## Transitions

| Transition | How the background moves |
| --- | --- |
| Default | The A1 control as it ships: the new segment lights up |
| Fade | A1's own segment backgrounds cross-fade over the chosen duration |
| Slide | One indicator slides to the new segment |
| Spring | The slide overshoots and settles (expressive ease) |
| Stretch | The leading edge moves first and the trailing edge follows `stretchLag` later — right edge leads moving forward, left edge moving back |
| Grow | The new segment's background grows from `growFrom`; the old one shrinks and fades |
| Wipe | The new background wipes in from the side you came from; the old one wipes out towards where you are going |
| Morph | The indicator shrinks to a bar (`morphWidth` × `morphBar`) under its segment, travels, then grows into the new segment |

## How it works

- `AnimatedSegmentedControl` renders the A1 SegmentedControl unchanged and,
  for Slide, Spring, Stretch and Morph, one indicator measured from the
  selected segment (re-measured on resize). The indicator is placed by its
  `left` and `right` edges so each edge can move on its own, sits after the
  control in the DOM, and the segments are raised above it, so A1's track
  stays underneath.
- Grow and Wipe draw each segment's background with a `::before`; Default and
  Fade use A1's own segment background. All variants other than Default and
  Fade hide A1's selected background.
- The selected index travels with each measurement, so direction and Morph
  always use the new position.

## Files and API

- `apps/a1-labs/src/segmented-motion/AnimatedSegmentedControl.jsx` —
  `AnimatedSegmentedControl` (`transition`, `speed`, plus every A1
  SegmentedControl prop) and `SEGMENT_TRANSITIONS`.
- `segment-model.js` — `travelDirection`, `edges` and `morphFrames`;
  unit-tested in `tests/segmented-motion.test.mjs`.
- `segmented-motion.css` — the scoped styles; movement only inside
  `prefers-reduced-motion: no-preference`.
- `SegmentedMotionExperiment.jsx` — the Labs page: transition, duration
  (150–750 ms motion tokens), 2–5 options, size, icons and full width.
  Size defaults to Large (`lg`), the largest supported size; Small and Medium
  remain available.

## Tokens

`component.segmentedMotion`: `growFrom`, `stretchLag`, `morphBar`,
`morphWidth`. The background uses A1's selected-segment roles (surface page,
shadow xs, inner radius). Token story: Foundations/Tokens/Segmented motion.

## Accessibility

The radiogroup, radios, roving focus and arrow keys are A1's; the indicator
is `aria-hidden`. Reduced motion moves the background instantly.

## Recorded checks — Oct. 11, 2026

- Week → Quarter sampled every 140–150 ms at 750 ms: Slide glides, Spring
  overshoots past the edge and settles, Stretch holds the trailing edge while
  the leading edge moves, Grow scales in, Wipe shows only the outgoing and
  incoming segments, Morph shrinks to a bar, travels and grows. The indicator
  matches the selected segment after keyboard moves. Reduced motion is
  instant. Axe reported no violations in light and dark; no console errors.
  Model tests pass.
- Not yet done: a screen-reader review, other browsers and every theme.
