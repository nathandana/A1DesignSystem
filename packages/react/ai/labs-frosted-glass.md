# Labs frosted glass

A visual study of a page built from stacked panes of frosted glass, not a
published A1 component. Follow the [Labs isolation contract](labs-contributing.md#isolate-experiments-and-prepare-them-for-a1).

**Token exception:** at the user's request (Oct. 11, 2026) this experiment does
not use A1 tokens or follow the A1 theme. Its colours, radii, blur, shadows and
type sizes are raw values with a fixed light-glass appearance. Everything stays
namespaced to `.a1-frosted-glass` / `.a1-frosted-glass-demo`. Promotion into A1
would require tokenising these values and defining dark and themed variants.

## Files and reusable API

- `apps/a1-labs/src/frosted-glass/FrostedGlass.jsx` exports `FrostedGlass`,
  `GlassPane`, `useGlassDepth` and `FROST_LEVELS`; it imports
  `frosted-glass.css`. Its only dependency is React.
- `FrostedGlassExperiment.jsx` owns the sample page (header, invite form,
  full-width submit), the decorative backdrop, the responsive viewport and the
  configuration. `frosted-glass-demo.css` holds that page layout and backdrop
  artwork. Keep this scaffolding out of the core.

| Component | Prop | Values | Default |
| --- | --- | --- | --- |
| `FrostedGlass` | `frost` | `light` (8 px), `medium` (18 px), `heavy` (32 px) blur | `medium` |
| `FrostedGlass` | `backdrop` | Decorative node painted behind the glass (`aria-hidden`) | — |
| `GlassPane` | `as` | Element to render (`header`, `main`, `form`, `span`…) | `div` |
| `GlassPane` | `sheet` | Base sheet filling its container edge to edge (e.g. the viewport), no lift | `false` |
| `GlassPane` | `inlay` | A separate piece set flush into a hole cut in its parent pane, at the parent's depth, with a 3 px seam | `false` |
| any element | `data-a1-glass-cutout` | Cut a hole in the nearest pane's face where this element sits; the value is an extra gap in px (inlays set 3) | — |

Each `GlassPane` is one layer above its nearest `GlassPane` ancestor (depth
1, 2, 3…, from context). Its finish follows translucent glass subway tiles:
3 px corners, a restrained milky face, a 6 px polished bevel and a narrow,
slightly green-gray glass side. Both top and bottom edges transmit light.
The `::before` face starts with low opacity at the top and builds gently below
the bevel; its depth-dependent tint caps at three layers so high panes do not
become opaque. Blur lightly desaturates and brightens the transmitted backdrop.
The `::after` mask leaves only the hollow polished rim. Narrow contact shadows
replace the former heavy stepped extrusion. The viewport itself remains a
`sheet`, without lift or a separate rim.

Glass controls: `.a1-frosted-glass__field` is a field's own piece of glass —
render it as `<GlassPane as="label" inlay className="a1-frosted-glass__field">`
so it sits in a hole cut in the form with a 3 px seam. `__label` sits inside it
above the value; `__input` is the bare control (no surface of its own); the
focus ring wraps the whole piece via `:focus-within`. Fields and the tinted
`__button` have 3 px corners. The button retains its blue side and press response.
The sample backdrop adds broad diffuse daylight behind all panes, including
at the top of the page; this lighting stays in the demo stylesheet.

```jsx
<FrostedGlass frost="medium" backdrop={<Shapes />}>
  <GlassPane sheet>
    <GlassPane as="header">…</GlassPane>
    <GlassPane as="form">…<button className="a1-frosted-glass__button">Submit</button></GlassPane>
  </GlassPane>
</FrostedGlass>
```

## Cutouts and inlays

Each `GlassPane` measures the cutouts it owns — descendants marked
`data-a1-glass-cutout` (every inlay) whose nearest pane ancestor is that pane — and masks its frosted `::before`
with a generated SVG of rounded holes (`--a1-frosted-glass-mask`). A
ResizeObserver on the pane and each cutout redraws the mask. The custom
property is reset on every pane, because custom properties inherit and a child
would otherwise reuse its parent's holes. An inlaid pane's 3 px seam shows the
backdrop between the two pieces, shaded as a gap with both cut edges lit.

## How the frost works

The blur is drawn on each pane's `::before`, not on the pane. An element with
`backdrop-filter` becomes a backdrop root for its descendants, so a nested pane
would only blur its parent's flat tint. A pseudo-element has no descendants, so
every layer blurs everything painted behind it: the backdrop and the panes
beneath. Without `backdrop-filter` support, panes fall back to near-opaque
white so text stays legible.

**Production CSS ordering:** put prefixed filter/mask declarations first and
standard declarations last. The previous ordering caused the production
minifier to retain only `-webkit-backdrop-filter` and lose standard mask
composition. Verify computed `::before.backdropFilter` contains the selected
blur and `::after.maskComposite` contains `exclude` against the built preview,
not just the development server.

## Accessibility

The sample uses semantic `header`, `main` (named, so it does not collide with
the Labs shell's landmarks when axe flattens the iframe) and a labelled `form`
with native labelled inputs and a submit button. Submitting shows a polite
status that nothing was sent. Text is dark ink on light glass; the button is
white on tinted blue. The button transition is removed with reduced motion.

## Recorded checks — Oct. 11, 2026 (0.25.3)

- Inspected rendered phone and laptop previews against the glass-tile reference.
- Production Chromium computes blur at 8/18/32 px for all frost choices and
  retains `exclude` on the bevel mask. Generated form cutouts remain present.
- Aurora, Sunset and Meadow preserve the layout. Native label focus, typed
  values, simulated submit status and reduced-motion button behavior pass.
- Refreshed the actual-renderer preview. No shared styles, component APIs or
  theme tokens changed; custom optical CSS stays inside this experiment's
  documented raw-value exception. No repeated theme contrast sweep was run.

## Recorded checks — Oct. 11, 2026 (0.14.4)

- Holes: viewport sheet 1 (the form), form 3 (one per field), fields, header and
  chip none. Clicking a field's label focuses its control; keyboard order and
  submit unchanged. Axe reported no violations in the experiment (a transient
  `region` result came from the shared A1 Tooltip on a hovered toolbar button,
  which renders outside landmarks).
- Fields are frosted glass again, so the 0.14.3 light wash was removed.

## Recorded checks — Oct. 11, 2026 (0.14.3)

- The viewport sheet carried one hole (the inlaid form) and the form, at depth
  1, carried three (its fields); the header and chip carried none.
- Typed text in see-through cutouts measured 4.0–4.4:1 on Aurora and Sunset at
  phone/tablet widths, so a 25% light wash was added (worst 5.4:1). Superseded
  in the next patch, when fields became inlaid glass.

## Recorded checks — Oct. 11, 2026

- Rendered in the responsive viewport at phone and laptop sizes; depths were
  page 1, header and form 2, chip 3; the button filled the form's content width;
  submit showed the demo status; keyboard order was Name, Email, message, submit.
- Axe reported no violations (after naming the sample landmarks). Contrast over
  `backdrop-filter` is not computable by axe, so rendered pixels were sampled
  with the lightest frost on all three backdrops: the button label was the
  lowest at 4.7:1; other text was 7.5:1 or higher.
- Not yet done: other browsers, forced colors, a screen-reader review and a
  dark/theme-aware variant.
