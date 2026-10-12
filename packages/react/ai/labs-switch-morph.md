# Labs switch transition

The experiment at `/experiments/switch-morph` scales the current A1 switch and
adds an X-to-checkmark transition made from two persistent strokes. This is a
candidate pattern for A1, not a published shared component. Follow the
[Labs isolation and promotion contract](labs-contributing.md#isolate-experiments-and-prepare-them-for-a1).

## Reusable implementation

`apps/a1-labs/src/switch-morph/MorphSwitch.jsx` and `morph-switch.css` are the
reusable core. They depend on React, A1 Stack/Paragraph, the shared screen-reader
utility and A1 tokens. They do not import Labs routing, settings, configuration,
A1 Web or another experiment. `SwitchMorphExperiment.jsx` owns demo state and
configuration. Do not move those dependencies into the core.

| Prop | Behavior | Default |
| --- | --- | --- |
| `label` | Visible, stable accessible name | `Switch` |
| `checked` | Controlled boolean state | Uncontrolled when omitted |
| `defaultChecked` | Initial uncontrolled state | `false` |
| `onChange(checked, event)` | Native checkbox change callback | — |
| `disabled` | Native disabled behavior | `false` |
| `scale` | 1, 2, 3 or 4 times A1 track/thumb/gap/border dimensions | `4` |
| `speed` | `quick`, `fast`, `normal`, `slow` or `slowest` semantic duration (100/150/200/300/750 ms) | `quick` (100 ms) |
| `id`, `name`, `value` | Forwarded to the input | Generated ID; others omitted |

At 1×, track, thumb, gap, border, label typography, row gap and row padding
match the default A1 Switch. Larger scales retain the enlarged demo label.
The demo defaults to 2×; the first Scale detent selects 1×.

Unknown scale/speed values fall back to 2×/quick. The label uses A1 typography and
wraps with A1 Stack on narrow hosts. Geometry expands; the outer control is not
scaled with a transform, so layout, focus and hit testing use its real size.

```jsx
<MorphSwitch label="Notifications" checked={enabled} onChange={setEnabled}
  scale={4} speed="quick" />
```

## Motion and tokens

The same two bars remain mounted for both states. Their positions and lengths
transition between crossed diagonals and a connected checkmark; there is no icon
swap, opacity cross-fade or timed callback. Each bar’s ink rotates 90 degrees
around its center while its box moves and resizes. The off-state ink starts a quarter-turn back from its final orientation,
forming the X; the on-state ink aligns with the checkmark’s endpoint geometry. The decorative pseudo-element
separates that rotation from the cap-center positioning transform. CSS transitions reverse from their
current position when toggled quickly. The thumb travels concurrently. The experiment’s easing token keeps motion nearly even, with only a slight
slowdown in the middle, without stopping or extending the
selected duration. All animated properties share this curve. Thumb and stroke
colors switch together immediately so their inverse colors cannot blend into
the same color midway through the morph.

- Track/thumb dimensions, inset, shadow and on/off colors use existing
  `component.switch.*` tokens. Border and focus use A1 field/semantic roles.
- The off mark uses the switch's on-thumb color; the on mark uses its on-track
  color. These are live CSS variables, not a copied palette.
- `component.switchMorph.*` adds only scale factors and normalized geometry,
  expressed as fractions of thumb size, plus the diagonal angle. The short
  checkmark stroke ends where the long stroke begins.
- All classes and runtime variables use `a1-switch-morph`; no shared Switch
  class or global selector is overridden. The existing Switch has no public
  thumb-content slot, so this experimental markup is local until a shared API
  is validated. No shared Switch behavior changes in this experiment.

## Input and accessibility

A native checkbox with `role="switch"` owns the checked state, focus, Space-key
activation, form value and disabled behavior. The visible label activates it.
The track and both strokes are decorative and hidden from assistive technology;
the accessible name stays constant when toggled. The checked state supplies the
announcement, so an additional live region is unnecessary.

Focus uses the theme's field focus ring. Live `prefers-reduced-motion` changes
remove all movement and color transitions immediately while preserving the final
state. Forced colors retains the thumb boundary and draws strokes in the system
button-text color. There is no automatic looping or delayed state change.

## Validation and promotion

Check both states and directions, intermediate stroke positions, interrupted
transitions, geometric continuity at the checkmark joint, keyboard/pointer input,
controlled/uncontrolled usage, disabled state and all scale/timing stops. Verify
light/dark and live theme changes using the same tokens as A1 Switch. Check
reduced motion, forced colors, responsive layouts and isolation in a minimal A1
host. Keep the concept preview current with the capture script's `--switch-only`
option. Use focused checks rather than repeated cross-theme contrast sweeps.

Human assistive-technology review and the shared package integration workflow
remain prerequisites for promotion; browser checks alone do not establish full
WCAG conformance.

### Recorded checks — Oct. 11, 2026

- The 100 ms default passed slider accessible-value and computed transition
  duration checks. The longer 750 ms option, keyboard activation and live
  reduced-motion behavior remain functional.

- Gentler easing advances about 20% of the rotation during the middle quarter
  of elapsed time, versus about 9% previously. Browser checks confirmed the
  selected 750 ms duration, quarter-turn endpoints and reduced-motion override.

- The refined quarter-turn passed -90-to-0-degree and reverse transitions at
  1× and 4×, interrupted input, persistent nodes, reduced motion and forced colors.
  Visual review confirmed visible stroke ink during the slower middle after
  removing inverse-color blending. The preview has no Card or On/Off text.

- Compared 1× against the live default A1 Switch: track/thumb dimensions, label
  font family/size/weight/line height, row gap/padding and total row height match.
  The label uses the body line-height token because Paragraph’s default line
  height differs from Switch. Measured rotation advances less during the middle
  quarter than either end quarter. Mobile activation and reduced motion passed
  against the production build.

- The earlier half-turn implementation reached 180 degrees and reversed to zero, with intermediate
  rotation verified at 1× and 4×. Final shapes were visually checked. Interrupted
  toggles retained the same nodes; reduced motion removed rotation and forced
  colors retained visible stroke ink.

- The 750 ms detent passed keyboard selection and real track/thumb/stroke
  transition timing checks. The 300 ms default, reversible activation and live
  reduced-motion override passed.

- The 1× addition matches standard 40 × 22 px track, 16 px thumb, 3 px inset
  and 1 px border tokens. All four scale detents preserve checked state; the
  4× default, checkmark joint, keyboard/mobile activation and reduced motion passed.

- Browser checks passed for native checked/disabled semantics, Space-key and
  label activation, persistent stroke nodes, intermediate positions, round-cap
  joint alignment, reverse/interrupted transitions and live reduced motion.
- Scale and timing detents, forced colors, light/dark appearance and five
  viewport widths passed. A focused structural accessibility scan found no
  violations; this was not a repeated theme contrast sweep.
- A minimal A1 host verified uncontrolled and disabled instances, unchanged
  neighboring A1 Switch geometry and identical track/thumb colors to A1 Switch
  in both states under Default and Heritage. The core loaded without Labs,
  A1 Web or another experiment.
- Card preview loading, direct routing, tree search and the About link passed.
  Human screen-reader review and shared-package promotion remain outstanding.
