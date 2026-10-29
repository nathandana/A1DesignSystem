# Labs hover state and selected

Route: `/experiments/toolbar-group`. First release: Labs 0.74.0.

This study brings the shared A1 toolbar into Labs without removing or changing
the production component. It compares hover feedback on independent
`ToolbarToggle` items, native `CheckboxGroup` rows and mutually exclusive
`ToolbarGroup` items. The title changed in 0.78.0; the route and registry ID stay
`toolbar-group` so existing links continue working.

## Reusable API

`apps/a1-labs/src/toolbar-group/HoverToolbar.jsx` exports `HoverToolbar` and
`HOVER_TREATMENTS`. Importing it loads its colocated stylesheet. It accepts all
A1 Toolbar props and children plus `treatment`:

- `current` (default and invalid-value fallback): unchanged A1 hover behavior.
- `none`: hovered items keep their resting background, including selection.
- `distinct`: enabled toggles and unselected group items get the semantic action
  background/foreground pair on devices supporting hover. Selected radio items
  keep their existing surface because they cannot be deselected.
- `off-only` (added in 0.75.0): only enabled off/unselected items retain the
  current subtle hover fill. Selected toggles and radio items stay unchanged.

- `distinct-off-only` (added in 0.76.0): enabled off/unselected items use the
  same strong action-colored hover as `distinct`. Selected and disabled items
  retain their resting appearance.

- `match-active` (label: Pause after click, colors corrected in 0.77.3):
  off items use the selected background and foreground on hover/press; selected
  items use a transparent background and the ordinary toolbar foreground. This
  includes selected radio items. The default light theme therefore gives off
  items a white hover surface. After a pointer click commits a state change,
  hover is paused until that item is left, keeping the new resting state visible.
  Re-entry restores hover. The internal ID
  stays `match-active` for compatibility. Selection shadows and semantics remain
  unchanged; disabled items retain their resting paint.

Use ordinary A1 ToolbarToggle and ToolbarGroup children. State and change events
stay owned by those children and the consumer. The wrapper has no Labs shell,
storage, routing or configuration dependency. It adds no keyboard handlers or
motion. Tooltips remain available when labels are hidden; No hover state means
no change to the item's paint, not removal of its tooltip or focus feedback.

## Post-click hover pause

Only `match-active` opts in. Capture a pointer click's item and pre-click ARIA
state, then use the shared `useHoverPause` layout effect after the controlled render to check whether
selection actually changed. Mark changed items with
`data-a1-hover-paused`; the scoped CSS paints their resting state until
pointer-out leaves the button (moving between its icon and label does not count).
For checkboxes, capture the previous controlled value because native inputs
already toggle before click capture. Compare against the committed native
`checked` property. Keep the marker on the label row until the pointer leaves
that row, including when the click originated on its text.
Clear the marker on treatment change or unmount. Repeated clicks still toggle,
and an already-selected radio does not start a pause. Keyboard activation does
not start a pause; focus and selection remain owned by A1. No timers or extra
React state are required, and ignored change requests do not pause hover.

## Demonstration

Bold begins pressed, Italic and Underline unpressed, and alignment at Left.
The second example is a checkbox group with five notification preferences;
Email notifications and Activity summaries begin checked.
The configuration panel selects one of the six treatments and exposes Show
toolbar labels (on) and Disabled (off). Selections persist through all configuration
changes and responsive panel moves. Labels are temporary English study content,
following the existing Labs demonstrations; this is not a translated public API.

## Styling and dependencies

Every selector is scoped to `.a1-toolbar-hover[data-hover-treatment]` and applies
only to radio/toggle items. Checkbox selectors use `.a1-checkbox-hover` and
remain in `hover-checkbox.css`. The current treatment has no override. Experimental
CSS changes only hover/press background and foreground; shared A1 CSS owns layout,
selection shadows, focus and disabled semantics. No new tokens are needed:
`semantic.color.action.background`, `semantic.color.action.foreground` and the
Toolbar's existing `--a1-toolbar-selected-bg`, `--a1-toolbar-selected-fg` and
`--a1-toolbar-fg` are the only paint dependencies.
The new treatments suppress disabled hover paint. Current intentionally retains
the exact shared behavior, including its disabled hover styling.

## Validation

- `npm test --workspace=a1-labs`
- `npm run build --workspace=a1-labs`
- With Labs on port 5187: `node --test apps/a1-labs/tests/toolbar-group.browser.mjs`
- Preview: `npm run capture:previews --workspace=a1-labs -- http://127.0.0.1:5187 --toolbar-group-only`

The browser check exercises selected/unselected hover paint in every selectable
Labs theme and both modes, toggle clicks/Space, radio arrow selection, focus,
disabled behavior, label visibility, five viewport widths, reduced motion and a
focused axe scan. Screen reader announcement quality and use outside the Labs
shell still require manual promotion review. This remains an experimental
candidate, not a new shared Toolbar API.

Known shared-component limitation: Wireframe sets the selection shadow to
`none`. A1's selected-item focus rule combines its ring with that value in one
`box-shadow` list, which becomes invalid and removes the visible ring. All six
treatments inherit this existing issue. The focused test checks visible keyboard
focus in Default; fixing the shared Toolbar requires the shared-component
workflow and is separate from this hover study.


## Checkbox group (0.78.0)

`HoverCheckboxGroup.jsx` wraps A1 CheckboxGroup with controlled `value` and
`onChange`, the shared `treatment` values and ordinary field props. Keep labels,
checked state, input fill/checkmark and focus native. The experimental paint is
on the label row: Current uses A1 unchanged; No hover suppresses row/background
and unchecked-border changes; Hover when off preserves checked-row paint;
Distinct uses action background/foreground; Distinct when off limits that fill
to unchecked rows. Pause after click uses the normal checked-row tint on
unchecked hover and transparency on checked hover, pausing after pointer clicks.
Disabled rows keep A1 behavior. Row tokens are `--a1-field-hover-background`,
`--a1-field-active-background`, semantic action/text/border colors. No new tokens.

Run `node --test apps/a1-labs/tests/hover-checkbox.browser.mjs` with Labs running
for group count, treatments, label and input clicks, hover pause/re-entry,
Space, focus, disabled controls, responsive fit and a focused axe check.
