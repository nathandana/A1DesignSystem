# Flip billboard

`/experiments/flip-billboard` is a landing-page hero with a 12-column, two-row
Three.js split-flap headline. It is in Layout and surfaces, tagged Page layout
and Motion. Both the billboard and clock routes load their graphics on demand.

## Composition and shared mechanism

`src/flip-billboard/FlapBillboard.jsx` exports a controlled hero:

- `message`: `{ cards, heading }` from `billboardMessage(text, columns, rows)`.
- `eyebrow`, `description`: optional supporting copy.
- `primaryAction`, `secondaryAction`: optional `{ label, href, target? }`, real destinations
  supplied by the host. Labs links navigate directly in the current page.
- `playback`: optional host-owned React controls below the actions. Include a
  pause control whenever the host rotates messages automatically.
- `inverted`: white cards and housing when true, black cards and dark housing
  otherwise. The host derives this from the resolved Labs appearance mode.
- Changed cards begin together and each cycles through the character wheel to
  its target; short trips finish sooner. Unchanged characters stay still.
- `duration`: milliseconds per character step, default 35, with 20/35/60 ms
  configuration detents. Total time depends on the forward character distance.
- `reducedMotion`: optional forced still presentation. Device reduced motion
  is always honored, including changes while a flap is moving.

The hero contains A1 Section, Stack, Heading, Paragraph and Button. Only the
WebGL surface needs isolated CSS (`a1-flip-billboard__stage` bounds and canvas
absolute canvas positioning). Intrinsic bitmap dimensions must not determine
the stage height after a viewport change. Do not override the surrounding shared controls or typography.
The letters remain authored sentence case; never force all-uppercase content.

The shared renderer now lives in `src/split-flap/scene.js`, with hinge math in
`flap-model.js` and token resolution in `tokens.js`. It owns GPU resources,
textures, resizing, visibility, idle frame scheduling and cleanup. The clock's
`clock-scene.js` is a thin adapter for one row, pair separators and feet. Do not
fork the renderer or import one experiment's private styling into the other.

Physical materials and basic geometry still use `component.flipClock` tokens.
`component.flipBillboard` supplies the grid, row gap, letter fitting, stage ratio,
view, character-step speed and six-second rotation interval. The renderer accepts columns,
rows, separators, feet and initial reveal independently of any Labs route.
Read computed values from the host's document;
accept minified numeric and duration spellings. Only the visual canvas is hidden
from accessibility; never put primary actions inside it.

## Host behavior

The default first headline is `A1 Design\nby the rules`, preserving that exact
capitalization and line break. Keep its card preview and accessible name in sync.

`FlipBillboardExperiment.jsx` owns three editable two-line headlines, playback,
appearance and configuration. Render directly in the workspace, without a
ResponsivePreviewFrame or viewport toolbar. Light uses white stock; Dark uses
black stock; Auto resolves the system preference and responds to live changes. The Labs sample shows only the flip display, without an eyebrow. Keep studio navigation,
supporting copy, actions and supporting cards out of the demo; playback belongs
in configuration. The reusable hero still accepts optional copy/actions.

`character-cycle.js` defines the ordered wheel: space, lowercase letters,
uppercase letters, digits and punctuation. Move forward and wrap; preserve case.
Unknown Unicode graphemes get slots after the standard wheel. For example, a→c
passes through b and takes two steps; a→z takes 25. All changed cards start at the
same timestamp, and each stops independently. Retarget an interrupted card from
its visible option. Reduced motion bypasses the wheel and shows the target.
Intermediate letters never enter the accessibility tree or live region. Keep the
clock's single-digit flip behavior unchanged; the wheel is an optional callback
in the shared renderer, owned by the billboard.

The headline model counts Unicode graphemes, centers each line and pads the grid
with blank cards. Each line supports 12 characters. Invalid or empty edits show
an A1 field error and keep the last valid headline; never silently truncate copy.
Valid edits select that headline and pause rotation so it can be inspected.

Automatic rotation holds each message for six seconds. Pause and Next controls live in
the configuration panel.
Reduced motion disables automatic rotation and settles active flaps immediately.
The semantic h1 exposes the complete current message without a live region;
automatic rotation does not announce every letter or headline. Manual Next and
playback actions have one polite announcement. The h1 becomes visible if WebGL
fails or loses context; the headline remains readable.

## Validation

- `npm test --workspace=a1-labs`: headline validation, centering, Unicode, motion
  parsing, clock rollovers and hinge math.
- With the dev server or production preview running, run
  `node --test apps/a1-labs/tests/flip-billboard.browser.mjs` and the existing
  `flip-clock.browser.mjs`. Set `LABS_ORIGIN=http://127.0.0.1:4189` for production.
- Check concurrent starts and independent character settling, Light/Dark/Auto stock, live system
  mode changes, pause/next/autoplay, valid and invalid edits, optional-content omission,
  live reduced motion, all five browser widths, WebGL fallback and focused axe.
  Inspect actual resting/moving frames.
- Capture the actual hero with
  `node apps/a1-labs/scripts/capture-previews.mjs http://127.0.0.1:5187 --flip-billboard-only`.

Recorded checks: the production build and 90 Labs unit tests passed. Both the
clock and billboard production browser regressions passed, including a focused
axe check with no violations. Desktop and phone screenshots were inspected. The frameless update passed both
production browser regressions, including mode changes and distance-based completion.

This remains a Labs candidate. Before promoting the shared flap core or hero to
A1, validate it in a separate host with assistive technology and production copy,
then follow the shared API, stories and cross-package workflow. No repeated theme
contrast sweep is required for this isolated monochrome extension.

Character-wheel checks passed in the production browser: a→c settled while a→z
was still moving, then both reached the exact targets. Unicode/case/wraparound
unit tests passed; the shared clock regression also passed unchanged. The
intermediate billboard frame was inspected.
