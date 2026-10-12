# Labs Three.js switch transition

`/experiments/switch-three` is a separate Controls and interaction experiment,
tagged Microinteraction and Motion. It extends the original Switch transition
concept with a beveled track, raised thumb, real lighting and two solid strokes.
Three.js loads only when this route is opened. Keep the original experiment.

## Reusable core

`src/switch-three/ThreeSwitch.jsx` owns native checkbox/switch semantics and the
renderer lifecycle. Its props are `label`, controlled `checked` or uncontrolled
`defaultChecked`, `onChange(checked, event)`, `disabled`, `id`, `name`, `value`,
`scale` (1/2/3/4, default 2), `speed` (quick/fast/normal/slow/slowest, default
quick/100 ms), and `view` (angled/front, default angled). State changes on native
activation, without waiting for animation. The label remains stable; no extra
live region duplicates the native checked-state announcement.

The core has no Labs or A1 Web imports. The host owns configuration and state.
`switch-scene.js` renders an orthographic, transparent WebGL surface; native input
and A1 text stay outside it. Two persistent solid strokes use the original
normalized X/check geometry and quarter-turn. The thumb rises and tilts slightly
while traveling; rapid toggles reverse from the current interpolated position.
Frames stop at rest. Resize/theme observers, media listeners and GPU resources
must be disposed on unmount or context loss.

## Tokens and isolation

- A1 Switch supplies nominal track/thumb/gap dimensions and live on/off colors.
  At 1×, nominal track bounds are 40 × 22 px. A transparent canvas margin lets
  beveled geometry extend beyond those bounds without clipping.
- `component.switchMorph` supplies scales, easing and stroke geometry. Importing
  shared tokens is allowed; do not import the original experiment's private CSS.
- `component.switchThree` supplies canvas padding, depths, bevel, lift, tilt,
  lighting and material parameters. Physical lengths use the same nominal pixel
  coordinate system as the unscaled A1 switch; CSS controls final scale.
- CSS is isolated under `a1-switch-three`. It only defines the decorative surface,
  fallback and native-input focus treatment. A1 owns layout and controls.
- Resolve CSS colors through the browser before passing them to Three.js;
  observe theme/mode changes live. Do not snapshot a copied palette.

## Accessibility and fallbacks

The native input supports Space, label activation, checked/disabled semantics,
form values and visible theme focus. The canvas is decorative and noninteractive.
Reduced motion settles an active transition immediately. Forced colors removes
WebGL and shows an operable static token-based switch with A1 check/close icons.
WebGL failure/context loss uses the same fallback; no user action is required.
The fallback must keep the same state and label. Do not introduce automatic loops.

## Validation

Run Labs unit tests for stroke continuity, monotonic easing and registry filters.
`node --test apps/a1-labs/tests/switch-three.browser.mjs` checks keyboard activation,
rapid reversal, scale, disabled state, reduced motion, forced colors, live palette,
mobile fitting, focused axe and context-loss fallback. Set
`LABS_ORIGIN=http://127.0.0.1:4189` to use the production build.
Capture the actual control with the preview script's `--switch-three-only` option.

This is a Labs candidate. A separate-host and human assistive-technology review,
plus shared package APIs/stories, remain prerequisites for promotion to A1.

Recorded checks: the production browser regression passed, including live mode
repainting, rapid reversals, native input, reduced motion, forced colors and
context-loss fallback. Focused axe found no violations. Desktop, light-mode,
phone and generated preview images were inspected. Labs unit tests and build
passed. No repeated cross-theme contrast sweep was run.
