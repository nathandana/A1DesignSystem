# Step tracker

`/experiments/step-tracker` compares the existing A1 StepTracker with five
additional treatments: Rings, Segments, Ticks, Numbers and Spotlight. Keep it
separate from `/experiments/steps`, which studies interactive progress tabs.

## Component contract

`src/step-tracker/TrackerVariants.jsx` exports the controlled `TrackerVariants`:
`variant` (defaults to `default`), `steps` (5), `currentStep` (1, one-based),
`align` (`left`, `center`, `right`, `full`), `transition` (`standard` by default),
`duration` (300 ms default) and other StepTracker attributes.
Invalid numeric inputs become 1; fractional values are floored, the total is at
least 1 and the current position is clamped to the total. Unknown variants use
the default. The component imports only A1 and its adjacent stylesheet.

Every treatment renders the real A1 StepTracker, retaining its `role="img"`,
“Step N of M” accessible name and hidden decorative markers. It has no click
handlers, navigation roles or keyboard stops. Use surrounding Back/Next controls in an A1 ButtonContainer with `align="start"`
for navigation. Always include visible position context; the Labs host supplies
one polite, atomic live “Step N of M” label. Markers communicate position, never
completion, error or validation. Preserve neutral semantic colors as required by
`system/rules/step-tracker.yaml`.

## Treatments and styling

- A1 default: the shipped pill and dot appearance.
- Rings: open circles, with a solid inset current marker.
- Segments: equal horizontal bars; Full stretches all bars equally.
- Ticks: vertical strokes, with a taller current stroke.
- Numbers: numbered circles, with inverse text on the current marker.
- Spotlight: fixed-size dots, with an outlined halo around the current dot.

`tracker-variants.css` is scoped to `a1-tracker-study`. The default retains its A1 shapes and colors; the selected transition applies
to every treatment. Variants reuse A1 tracker
custom properties, tab geometry and base spacing, radius and typography tokens.
All colors use live neutral semantic roles. Variant styling needs no new tokens or shared CSS changes. Motion geometry
uses the dedicated `component.trackerMotion` tokens; never import another
experiment’s private styling. Full distributes fixed-size
markers for Rings, Ticks, Numbers and Spotlight, preserving their shapes; the
Default retains A1’s expanding current pill. Reduced motion cancels transitions;
forced colors outlines the current marker and borders all markers.

The Labs page defaults to five steps, position two, centered alignment and A1
default. A ChoiceGroup selects the six treatments and four alignments; a Toolbar
selects 3/5/7 steps; a detented slider sets the current position. Reducing the count
clamps the position. Changing treatments or alignment preserves position. Next
becomes Start again at the last page; Back is disabled at the first. Demo content
is local and does not submit or save anything.

## Validation and promotion

Run Labs unit/build checks and `tests/step-tracker.browser.mjs` with `LABS_ORIGIN`
pointing to the server. The focused browser test covers all six treatments,
noninteractive semantics, count/position changes, Back/Next/restart, alignment,
small screens, light/dark, reduced motion, forced colors and axe excluding contrast.
Capture the actual demo using `--step-tracker-only` in `capture-previews.mjs`.
Production browser checks passed on Oct. 11, 2026. Preview and responsive
screenshots were inspected. Human screen-reader and separate-host validation
remain necessary before promoting any treatment into A1.

## Transitions

`useTrackerMotion.js` owns Standard, Instant, Fade, Slide, Pop, Bounce and Ripple.
The host configures transition and a duration detent (100/300/500 ms).
Standard uses CSS size/color transitions. Instant disables transitions. The other
five use the Web Animations API on the current decorative marker; Ripple adds
one pointer-transparent, aria-hidden ring, removed on finish or cancellation.
Fade changes opacity, Slide travels from the previous marker's measured position,
Pop grows with expressive easing and Bounce drops with expressive easing.
Animation never changes the tracker’s role, name, current position or tab order.

The hook animates position changes, not initial mount or configuration edits.
Cancel prior animations before starting a new one. Cancel and remove decorative
nodes on setup changes, host width changes, reduced motion, forced colors and
unmount. A width change invalidates saved geometry; never travel from stale
coordinates. Keep final styles in CSS, so cancellation always shows current state.
Read motion tokens from the live host styles; `tracker-motion.json` owns fade,
scale and lift values, while semantic tokens own durations and easing.

`tests/tracker-motion.browser.mjs` checks all 42 treatment/transition combinations,
duration, forward/back navigation, rapid changes, cleanup, live motion preferences,
configuration cancellation and responsive behavior. It and the original tracker
regression passed against the production build on Oct. 11, 2026. The static card
preview remains current because default appearance and content are unchanged.
