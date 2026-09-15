# Figma component library — component-set standards

## Status

Implemented for A1-2639 on 2026-09-15. This document is now an active
component-library checklist and completion record. Follow it with
[`figma-workflow.md`](./figma-workflow.md) whenever a Figma component is added
or materially updated.

The initial implementation applies to:

- `Button` POC component set (`1101:7550`), key
  `93c7289bb785c8389d8e987b321e4963850c1d82`
- `Checkbox Item` POC component set (`1106:7569`), key
  `318c659e78e499c4803b45733ee0c44ddaef0ae4`
- `Checkbox Group` POC component set (`1118:7837`), key
  `4ad3f8bbc0ee7beb5929454b124411814a33047b`
- A1 Foundations standard, `09 Component set presentation and interaction
  standards` (`1138:112`)

## Reusable component-library checklist

- [ ] Keep every public component or component set as a direct child of its
  Figma page. Do not nest it in a frame or section; top-level placement prevents
  unintended nesting in the Figma Assets menu.
- [ ] Name every public component or component set with only its component
  name. Do not add page, category, status, POC or other prefixes, and do not use
  `/` hierarchy separators. When names collide, integrations must distinguish
  the assets by stable published key rather than changing the public name.
- [ ] Pair the top-level asset visually with a parent presentation frame that
  uses Auto Layout. Use a locked, transparent placement area behind the asset
  so the presentation remains aligned without becoming its parent.
- [ ] Arrange variants as a readable grid and add a locked label outside the
  reusable component for every variant axis.
- [ ] Bind the presentation background to `color/surface/page`, its border to
  `color/border/subtle`, and all four border widths to `spacing/2`. Use an 8 px
  dash pattern derived from `spacing/8`.
- [ ] Use established spacing variables for grid gaps and outer padding. Scale
  spacing to the rendered component size: smaller components receive less
  space and larger components receive more.
- [ ] Keep presentation labels and decoration outside the reusable asset so
  they are never inserted with an instance.
- [ ] Use attached instances from the A1 icon library for every icon. Do not use
  copied vectors, redrawn glyphs, text glyphs or detached icon instances.
- [ ] Expose replaceable icons through an instance-swap property with approved
  preferred values when the developed API supports icon selection.
- [ ] Restrict every bounded content slot to the exact approved child component
  set through preferred instances. For example, a Checkbox group slot may
  prefer Checkbox item variants only. Intentionally open, high-level page or
  section composition slots may omit preferred instances.
- [ ] Set every slot's Auto Layout direction explicitly, including wrapping
  behavior where applicable, and make the direction match the developed layout
  property.
- [ ] Seed every slot with useful, well-defined default content composed from
  the child component's own default values. Do not override the default child's
  text, state, selection, focus, size, or other exposed properties.
- [ ] Reuse established nested components instead of recreating their visuals.
  Expose a nested instance or its properties only when the developed parent API
  intentionally delegates that configuration to the child. Keep
  implementation-only nested instances unexposed, and never expose both a
  parent control and a duplicate nested control for the same setting.
- [ ] For every form component with a developed `required` prop, use the shared
  `Required` Boolean property: compact and default show a blue `*` bound to
  `color/status/info/background`; comfortable shows an inline `Badge` instance
  configured as `Size=sm`, `Status=info`, `Subtle=true`, `Show icon=false`, and
  `Label=Required`. Keep the badge unexposed and bind both treatments to the
  same Boolean property.
- [ ] Include `default`, `hover`, `active` and `disabled` states when they apply
  to the developed component. Use the developed term `active`; do not add a
  duplicate `pressed` state.
- [ ] Represent loading as a mutually exclusive state when it must replace
  another visual. Never show a Button loading indicator and its icon together.
- [ ] Add `Focus ring` as a separate Boolean component property on every
  interactive component. Focus must not be a variant axis.
- [ ] Bind focus layers to the established focus color, width, offset and size
  variables, and confirm that the layer resizes with every supported size and
  content configuration.
- [ ] Connect applicable variants with prototype interactions. Use transient
  hover and press interactions, return behavior supplied by Figma, and no
  activation interactions on disabled or loading variants.
- [ ] Match prototype duration and easing to developed behavior. Do not invent
  motion values when the developed component has no defined transition.
- [ ] Create component properties at the component-set level and wire every
  applicable descendant in every size and variant. Cloned variants must be
  rechecked because Figma can drop descendant property references when a clone
  is appended to a component set.
- [ ] Compare the final Figma properties with the developed API, then update the
  A1:Figma adapter, aliases, component keys or contract hashes, generated
  artifacts and JSON fixtures wherever the implemented contract requires it.
- [ ] Validate the JSON contract, plugin build, attached instances, variable
  bindings, prototype destinations and light/dark visuals before completion.

## A1-2639 implementation record

### Component-set presentation

- [x] All three public component sets are direct children of page `1093:34`.
- [x] Auto Layout presentation frames use locked external row and column labels.
- [x] Transparent locked placement areas align the top-level sets with their
  presentation frames without parenting them.
- [x] Presentation fills, strokes, border widths, padding and gaps use existing
  A1 variables. Borders are 2 px dashed.
- [x] Grid row spacing uses 8, 12, 16 or 24 px values according to component
  size; outer padding uses 24 px for Button and Checkbox item and 32 px for
  Checkbox group.

Presentation nodes:

- Button presentation `1138:92`, placement area `1146:92`
- Checkbox item presentation `1138:100`, placement area `1146:93`
- Checkbox group presentation `1138:107`, placement area `1146:94`

### Icons

- [x] Button uses the A1 `arrow_forward` icon set key
  `917fcdb332f9e8518614d4f6a8d22a260ff9f25b`; its default Outlined component
  key is `6dbb92cfd2da4f8118970c86c0f66a955f814e46`.
- [x] Checkbox item uses the A1 `check` icon set key
  `7458cdd3035b9b2f95a1a684754b036e42fbcf1b`; its default Outlined component
  key is `c0834e561d1ad3bdfea6b1d8981d1a07db6ca792`.
- [x] Icon roots remain transparent; color-variable overrides apply only to
  library glyph vectors.
- [x] No Button or Checkbox icon instance is detached.

### Button contract

The `Button` POC contains 150 unique variants:

- `Variant=primary|secondary|tertiary|destructive|success`
- `Size=sm|md|lg`
- `IconPosition=start|end`
- `State=default|hover|active|disabled|loading`

Native properties are `Label`, `Show icon`, `Icon`, and `Focus ring`. `Show
icon` defaults to false, `Size` defaults to `md`, and `State` defaults to
`default`. The `Icon` instance-swap property prefers the approved A1
`arrow_forward` component.

- [x] Hover uses the developed 200 ms standard cubic-bezier transition.
- [x] Press uses the developed 100 ms standard cubic-bezier transition.
- [x] Disabled styling is owned directly by the disabled variant and uses
  `button/disabledOpacity`; the fixed disabled veil was removed.
- [x] Loading remains full opacity, is inert and replaces the icon with a
  progress indicator.
- [x] `Focus ring` is Boolean and appears only on applicable interactive states.
- [x] Label, icon visibility and icon swap references are wired in every
  applicable variant.

The A1:Figma bridge maps `State=disabled` to the developed `disabled` Boolean
prop and `State=loading` to the developed `loading` Boolean prop. `hover` and
`active` remain visual-only Figma states and emit a warning instead of runtime
JSON props. The temporary `Disabled` and `Loading` Boolean-property reader is
retained for backward compatibility with older POC instances.

### Checkbox item and group contracts

The `Checkbox Item` POC contains 24 unique variants:

- `Size=compact|default|comfortable`
- `selected=false|true`
- `State=default|hover|active|disabled`

Native properties are `Label`, `Hint`, `Show hint`, and `Focus ring`.

- [x] Hover, press and selection prototypes use the developed 150 ms transition
  and the browser `ease` curve (`0.25, 0.1, 0.25, 1`).
- [x] Disabled variants are inert.
- [x] The check glyph is an attached A1 library instance.
- [x] Label, hint, hint visibility and focus references are wired in all 24
  variants.

The `Checkbox Group` POC retains its six `Size × Inline` variants, native
`Checkbox Items` slot, group text and Boolean properties, and support for 0–20
items. The bridge maps option `State=disabled` to `options[].disabled` and still
accepts the former `disabled` variant axis while older files migrate.

- [x] The `Checkbox Items` slot prefers all 24 Checkbox item variants and no
  unrelated components.
- [x] Slot direction is explicitly vertical for `Inline=False` and horizontal
  for `Inline=True`, with no wrapping in either default.
- [x] Every group variant starts with one canonical
  `Size=default, selected=false, State=default` Checkbox item. The instance uses
  the child component's own Label, Hint, Show hint, Focus ring, Size, selected,
  and State defaults with no overrides.
- [x] The group label now uses the shared Required treatment: a blue asterisk
  for compact/default and an inline unexposed info Badge for comfortable.

### Shared form Required treatment and flat naming

- [x] Text Field, Search Field, Textarea, Select, Autocomplete, Checkbox Group,
  Radio Group, Choice Group and the Checkbox Group POC now use the shared
  size-aware Required treatment.
- [x] The comfortable treatment reuses the established Badge component as an
  implementation-only nested instance; it does not surface duplicate nested
  properties on the parent.
- [x] Repaired the Badge set's `Label` property wiring across all 30 variants so
  nested `Size=sm, Status=info, Subtle=true` instances render “Required” rather
  than retaining the default “Badge” text.
- [x] The three POC sets are named `Button`, `Checkbox Item` and `Checkbox
  Group`, contain no hierarchy separators, and remain direct page children.
- [x] Duplicate `Button` and `Checkbox Group` names are resolved by stable
  component-set key in the A1:Figma adapter, not by reintroducing a prefix.

## Contract synchronization result

- [x] The three existing component-set keys remained stable after the update;
  the checked-in A1 library manifest still contains the correct keys.
- [x] The plugin adapter recognizes the final State contracts and preserves
  compatibility with the temporary Boolean/disabled-axis contracts.
- [x] The adapter distinguishes the flat-named Checkbox Group POC and its
  Checkbox Item children by stable component-set keys; the legacy manifest
  names remain only as internal migration aliases.
- [x] Generated plugin controller and Dev Mode bundles were rebuilt.
- [x] Structural inventory and JSON fixtures were refreshed.
- [x] The Figma plugin suite passes 61 of 61 tests.
- [x] Programmatic Figma audits found no duplicate variant names, missing
  descendant property wiring, unbound component paints, detached icon instances,
  stale disabled veils, loading/icon conflicts or invalid prototype counts.
- [x] Focus/icon instances and the existing light/dark validation frames were
  visually reviewed.

## Runtime-owned boundaries

Figma documents visual contracts; React continues to own semantics and runtime
behavior. Button navigation/rendering props, Checkbox values, controlled state,
callbacks, names, IDs, ARIA behavior and class names remain runtime-owned unless
`figma-workflow.md` explicitly maps them.
