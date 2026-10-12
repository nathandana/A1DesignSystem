# Labs radio buttons

Animated radio button variants that bring the control to life, built on the
real A1 RadioGroup. Not a published A1 component or prop. Follow the
[Labs isolation contract](labs-contributing.md#isolate-experiments-and-prepare-them-for-a1).

## Variants

| Variant | Hover | Press | Select | Deselect |
| --- | --- | --- | --- | --- |
| Grow | The ring swells (`hoverScale`) and a faint dot previews the choice (`previewDot` of the selected dot) | The ring squishes (`pressScale`) | The ring swells past its size (`popScale`), dips (`settleScale`) and settles while the dot overshoots (`dotOvershoot`) and settles | The dot shrinks away |
| Ripple | A soft halo (`halo`) in the selected colour | — | A ring ripples out (`ripple`) and fades as the dot appears | The dot shrinks away |
| Bounce | — | — | The dot falls from above (`drop`), the ring squashes (`squashWide`, `squashTall`) and the dot rebounds (`rebound`) | The dot drops out of the bottom |
| Thicken | The ring thickens slightly (`thickenHoverHole`) | — | The ring grows inward until a dot-sized centre is left | The ring thins back to the edge |
| Travel | — | — | A copy of the selected radio slides from the previous choice, stretching along its path (`travelStretch`, `travelPinch`); the new radio looks empty until it lands | Instant (the selection has moved) |
| Jelly | The ring sags (`hoverWide`, `hoverTall`) | — | The ring wobbles wide, then tall, as the dot grows | The dot shrinks away |

Each variant is a `data-variant` namespace in the same stylesheet and an
entry in `RADIO_VARIANTS`.

## Files and API

- `apps/a1-labs/src/radio-buttons/LivelyRadioGroup.jsx` — `LivelyRadioGroup`
  (`variant`, `speed`: semantic motion duration key, plus every A1
  `RadioGroup` prop) and `RADIO_VARIANTS`. It wraps the A1 RadioGroup, so
  labels, hints, keyboard, focus, sizes, error and disabled states are A1's.
  The selection spring plays only after a person changes the group, never on
  load (`data-touched`).
- `radio-variants.css` — scoped restyles of `.a1-radio-item__input`: the
  selected dot is redrawn as a radial gradient in the selected foreground role
  so its size and position can animate; the ring moves with `scale` and
  `box-shadow`, which never shift layout. Thicken draws its ring as a gradient
  whose open centre is a registered custom property (`@property`
  `--a1-radio-lively-hole`, a percentage of the radio) so it can transition to
  A1's percentage dot size. Travel adds a temporary `aria-hidden`
  `.a1-radio-lively__traveller` (animated with the Web Animations API) and
  marks the group `data-traveling` until it lands. All movement is inside
  `prefers-reduced-motion: no-preference`; Travel does not run with reduced
  motion.
- `RadioButtonsExperiment.jsx` — the Labs page: variant ChoiceGroup, speed
  (150 / 200 / 300 / 500 ms motion tokens), size and an optional plain A1
  group for comparison.

## Tokens

`component.radioVariants`: `hoverScale`, `pressScale`, `popScale`,
`settleScale`, `previewDot`, `dotOvershoot` (Grow); `ripple`, `halo`
(Ripple); `drop`, `rebound`, `squashWide`, `squashTall` (Bounce and Jelly);
`hoverWide`, `hoverTall` (Jelly); `thickenHoverHole` (Thicken);
`travelStretch`, `travelPinch` (Travel). Dot size is A1's
`component.radioGroup.dotSize`; colours are A1 roles. Token story:
Foundations/Tokens/Radio variants.

## Accessibility

Native radios, labels and hints from A1; arrow keys move the selection and
animate it the same way. Disabled options never move. Reduced motion keeps
the instant dot and colour changes without any scaling or animation.

## Recorded checks — Oct. 11, 2026

- Light and dark: hover swells the ring to 1.15 with a preview dot; press
  squishes to 0.88; selecting springs (about 1.24) and settles; the previous
  dot shrinks to nothing; arrow keys change the selection; no animation on
  load. Reduced motion: no scale or animation. Axe reported no violations; no
  console errors.
- Ripple, Bounce, Thicken, Travel and Jelly in light and dark: hover,
  selection and deselection values sampled mid-animation; Travel flies from
  the previous choice with the mouse and arrow keys, then removes its copy and
  `data-traveling`; Thicken ends identical to Grow. Reduced motion: no
  animation, transition or travelling copy. Axe reported no violations; no
  console errors.
- In dark mode, every variant draws the dot in the selected foreground role
  (dark on the light-blue fill), whereas A1 hardcodes a near-white dot.
- Not yet done: a screen-reader review, other browsers and every theme.
