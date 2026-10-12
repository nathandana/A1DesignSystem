# Labs focus state animations

This is an experimental pattern for focused native controls, not a published A1
component. Follow the [Labs isolation contract](labs-contributing.md#isolate-experiments-and-prepare-them-for-a1).

## Files and reusable API

- `apps/a1-labs/src/focus-animations/FocusAnimation.jsx` exports `FocusAnimation`
  and the `focusStyles` option list. Its only dependencies are React and its
  adjacent `focus-animation.css`; it has no Labs or A1 Web imports.
- `FocusAnimationsExperiment.jsx` owns the form, A1 ChoiceGroup treatment selector,
  duration slider and simulated
  Submit/Cancel behavior. Do not move this scaffolding into the reusable scope.
- `system/tokens/component/focus-animation.json` defines travel distance, accent width,
  zoom scale, lift distance and corner length; `FocusAnimation.stories.jsx` documents these tokens.

| Prop | Values | Default |
| --- | --- | --- |
| `treatment` | `settle`, `halo`, `underline`, `double`, `zoom`, `lift`, `corners`, `inset` | `settle` |
| `speed` | `quick`, `fast`, `normal` | `fast` |
| `children` | Native or A1 controls and layout | — |

Unsupported treatment/speed values fall back to their defaults. Add
`data-a1-focus-target` to each native control that should use the experiment.
A1 TextField and TextareaField forward that attribute to their
native controls; A1 Button forwards it to the button. Other controls remain
unchanged, including unmarked controls inside the scope and marked controls
outside it. For an A1 RadioGroup, add `data-a1-focus-radios` to opt in its rows.
The wrapper forwards this attribute to its fieldset; a focused native radio
triggers its wrapping label's focus treatment. Its own outline is suppressed
only while that row supplies the replacement, preserving the selected dot.
Multiple scopes can use independent treatments.

```jsx
<FocusAnimation treatment="halo" speed="fast">
  <Stack gap={24}>
    <TextField label="Name" data-a1-focus-target />
    <Button data-a1-focus-target>Continue</Button>
  </Stack>
</FocusAnimation>
```

The scope adds no tab stops and does not manage focus, intercept keys, clone
controls or emit events. Native controls retain their events and semantics.
Both pointer and keyboard focus trigger the opted-in treatment via `:focus`.
No animation loops or delays the persistent outline. Subtle zoom scales the
focused control to 1.015; Gentle lift translates it up 2 px. These intentional
content movements do not change layout. Both retain their emphasis until blur
and remain untransformed with reduced motion or forced colors. Corner draw adds
eight short edge strokes; Inset frame settles an inner border. Both keep the
full outer outline as the primary focus indicator.

## CSS and token dependencies

All selectors start with `.a1-focus-animation`; keyframes and the runtime duration
property use the same namespace. Only native controls explicitly marked inside
that scope receive overrides. This is the user's requested experiment-specific
replacement of default focus, not permission to patch shared component styles.

The host supplies A1 tokens/themes and the normal styles for its controls.
Dimensions use `component.focusAnimation.travel`, `.accentWidth`, `.zoomScale`,
`.liftDistance` and `.cornerLength`. Color,
outline width and offset use live component tokens. Fields/radio rows use
`component.field.focusRingColor`; buttons use `component.button.focusRing`. Width
and offset use `component.button.focusRingWidth` and `.focusRingOffset`. Duration/easing use semantic
motion tokens (`quick` 100 ms, `fast` 150 ms, `normal` 200 ms, `enter`). No imagery,
fonts or runtime animation libraries are required by the reusable scope.

Every treatment retains its settled outline while focused. The underline is
additional emphasis, never the sole indicator. Reduced motion disables animation
and transitions on opted-in controls, including when the preference changes live.
Reset individual `scale` and `translate` as well, so focused controls stay still.
Forced colors uses the system `Highlight` outline and disables decorative motion.
Neither fallback removes the focus indicator.

## Validation and promotion

Validate all eight treatments on text/email inputs, a Topic radio group, textarea, primary
Submit and tertiary Cancel. Check native radio arrow navigation and reset to
Feedback on Cancel; preserve selection indicators under every focus treatment. Check Tab/Shift+Tab, normal form events, persistent
focus after animation, all duration stops, live reduced motion, forced colors,
light/dark appearance and narrow/wide layouts. Controls outside the scope must
retain system focus. Keep the capture script and registry preview current.

An isolated A1 host check confirmed that the core mounts without Labs, A1 Web or
other experiments and preserves normal focus outside its opted-in targets.
The experiment remains a candidate for A1: human screen-reader review and the
shared package integration workflow are still required before promotion. Browser
checks do not establish complete WCAG conformance.

### Recorded checks — Oct. 11, 2026

- Browser checks passed for all four treatments on the form controls and Topic radio options, persistent
  settled outlines, forward/reverse keyboard traversal and 100/150/200 ms stops.
- Live reduced-motion checks passed for every treatment; forced colors retained
  a static outline. Default light/dark appearance and five viewport widths were
  checked without a repeated theme contrast sweep.
- Mobile touch/configuration, draft preservation across responsive panel changes,
  submit/reset feedback, card image loading, tree filtering and About navigation
  passed. A focused structural accessibility scan reported no violations;
  contrast scanning was excluded from that scan.
- The minimal A1 host check passed for multiple independent scopes and untouched
  system focus on unmarked controls and controls outside the scope.
- Token generation, Labs unit tests and production build passed. No human
  assistive-technology review or shared-package promotion has been performed.

The final Topic radio-group revision also passed all four treatments on every
option row, checked-dot preservation, arrow navigation, Tab/Shift+Tab and Cancel
reset. Theme-token matching was checked for fields, radio rows and buttons,
including Wireframe's distinct field/button roles. The isolated-host check was
repeated with the radio opt-in. ChoiceGroup configuration passed pointer and
arrow-key selection on desktop and selection in the mobile sheet.

### Extended treatments and search — Oct. 11, 2026

The eight-treatment browser regression in
`apps/a1-labs/tests/focus-animations.browser.mjs` verifies all control types,
resting outlines, zoom/lift amounts, radio selection, keyboard traversal, duration
controls, live reduced motion, forced colors, mobile ChoiceGroup selection and
unmodified search focus outside the experiment. It includes a focused axe check
without a repeated contrast sweep. Run with `LABS_ORIGIN=http://127.0.0.1:4189`
to check the production preview. The shell's `/` shortcut skips editable fields,
so slash characters can still be entered in this form.

The eight-treatment production browser regression passed, including keyboard,
reduced-motion and forced-color checks; its focused axe scan found no violations.
