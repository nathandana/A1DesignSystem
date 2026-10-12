# Labs Fenex celebrates

Fenex the fennec fox, an animated SVG character drawn from the supplied
illustration, celebrating a success. The standalone experiment is hidden
(`hidden: true`), so it isn't listed in the gallery, sidebar or search, but
`/experiments/fenex` still opens it. Fenex remains an option in Submission
celebrations. Not a published A1 component. Follow the
[Labs isolation contract](labs-contributing.md#isolate-experiments-and-prepare-them-for-a1).

## The animation

`apps/a1-labs/src/fenex/fenex-celebrate.svg` is self-contained. It has no
script, its CSS is inside the file, and it has a `<title>` and `role="img"`.
It loops:

- Fenex crouches, springs up and lands with a squash, while his shadow shrinks
  and grows.
- His arms pump outward in turn, his ears wiggle, his flame tail swishes, his
  head tilts and his mouth laughs.
- Stars, hearts and soft confetti fall and spin, some behind him and some in
  front.

With `prefers-reduced-motion: reduce`, all movement stops: he stands still
with the confetti scattered around him, like the illustration.

**Artwork:**
- Gradients and a filter (`fenex-paint`) give a watercolor feel: slightly
  wobbly, hand-drawn edges plus a fine paper grain.
- Details include white ear tufts, a pale forehead stripe and jagged cheek fur.
- The face has tapered happy closed eyes, a nose highlight, an upper lip and
  whisker dots.
- The body has a fluffy white chest and brown paws with toes. The tail is a
  two-tipped cream plume over veined flame petals.

**Palette exception:** the colors are artwork colors from the illustration,
not interface tokens. Tokens don't suit illustration art and can't reach an
SVG used as an `<img>`.

**Reuse:**
- Every class, keyframe and id is namespaced `fenex-*`, so the file can be
  inlined without clashing.
- It also works as an `<img>`. Inlining guarantees the page's reduced-motion
  setting reaches its CSS; Chromium's emulation did not reach an `<img>` SVG
  in testing.

## Files and API

- `Fenex.jsx` — `Fenex` inlines the SVG (Vite `?raw`) and takes:
  - `playing`, `speed`: controlled through the Web Animations API (pause and
    `playbackRate`).
  - `still`: the resting pose.
  - `confetti`: hides the falling pieces when false.
  - `height` (CSS length), `decorative` (`aria-hidden`), and `settleAfter`
    (milliseconds before he settles into the still pose).
- `fenex.css` — sizing (`--a1-fenex-height`, default
  `component.celebration.characterHeight`; width follows the 5:6 aspect and
  never exceeds its container), the still state and hiding confetti.
- `FenexExperiment.jsx` — the stage (an A1 Section with surface, inverse,
  padding and radius props) with Pause/Play and Replay, plus configuration:
  - Speed 0.5–2×.
  - Size: small, medium or large (base width tokens).
  - Background surface and Inverse.
  - Stars and confetti.
  - Preview reduced motion.

## Accessibility

- In the experiment Fenex is a labelled image. In Submission celebrations he is
  decorative, and the success heading carries the message.
- **Pause, stop, hide:** the standalone animation loops, so Pause and Replay
  sit under the stage. In Submission celebrations he settles into his still
  pose after `characterSettle` (4.8 s), so the movement stops within 5
  seconds.
- Pause and Replay are disabled while still, including when the device asks for
  reduced motion; the panel explains why.

## Recorded checks — Oct. 11, 2026

- 41 animations play. Pause pauses them all, 2× sets every playback rate, and
  the confetti hides. Still mode stops every animation and moving resumes.
- Background, Inverse and Replay work. The celebration settles after 4.8 s.
- Reduced motion shows the still pose. Rendered against both light and dark
  backgrounds.
- Axe reported no violations on desktop or at 390 px, with no overflow and no
  console errors. A unit test checks the SVG's title, reduced-motion guard,
  namespacing and lack of script.
- Not yet done: Safari and Firefox rendering of the paint filter, and a
  screen-reader review.
