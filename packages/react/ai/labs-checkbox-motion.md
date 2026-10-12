# Labs checkbox motion

Animated checking, unchecking and indeterminate (mixed) states, built on the
real A1 CheckboxGroup. Not a published A1 component or prop. Follow the
[Labs isolation contract](labs-contributing.md#isolate-experiments-and-prepare-them-for-a1).

## Variants

| Variant | Check | Mixed (dash) | Uncheck |
| --- | --- | --- | --- |
| Default | A1 as it ships: instant fill and tick | Instant dash | Instant |
| Pop | Box swells (`popScale`), dips (`settleScale`); the tick grows past its size (`glyphOvershoot`) | Same, with the dash | The glyph shrinks as the box dips |
| Draw | An ink cover slides off the tick, left to right | The dash is uncovered from the centre out | The tick is covered right to left, then the box empties |
| Fill | Colour floods from the centre, then the tick springs in | Same, with the dash | The glyph shrinks, then the colour drains |
| Flip | The box turns from edge-on (`flipAngle`, `perspective`) around its vertical axis | Turns around its horizontal axis | Turns the other way |
| Jelly | Squashes wide, then tall (`jellyWide`, `jellyTall`), then settles | Same | Squashes tall, then wide |
| Pulse | A ring spreads out (`pulse`) as the tick appears | Same, with the dash | The glyph shrinks away |
| Slide | The tick slides up into the box (`slide`) | The dash slides up | The tick slides up and out, then the box empties |

## Files and API

- `apps/a1-labs/src/checkbox-motion/LivelyCheckboxGroup.jsx` —
  `LivelyCheckboxGroup` (`variant`, `speed`: semantic motion duration key,
  `indeterminate`: option values shown as mixed, plus every A1 `CheckboxGroup`
  prop) and `CHECKBOX_VARIANTS`. It wraps the A1 CheckboxGroup, so labels,
  hints, keyboard, focus, sizes and disabled options are A1's. The mixed state
  is set on the native input (`input.indeterminate`), so assistive technology
  announces it. After each change, only boxes whose state changed are tagged
  `data-a1-animate="on|off|mixed"` until their animation ends, so nothing
  animates on load.
- `checkbox-model.js` — `changedStates(before, after, values)` and
  `parentState(selected, all)` (`off`, `mixed` or `on` for a Select all box).
- `checkbox-motion.css` — scoped restyles of `.a1-checkbox-item__input`. A1's
  tick and dash glyphs are mirrored as background layers (same paths and
  colour) so their size and position can animate; the box moves with `scale`
  and `transform`, which never shift layout. All movement is inside
  `prefers-reduced-motion: no-preference`.
- `CheckboxMotionExperiment.jsx` — the Labs page: a Select all box above a
  topping list (one sold out), variant ChoiceGroup, speed (150 / 200 / 300 /
  500 ms motion tokens), size and an optional plain A1 group for comparison.

## Tokens

`component.checkboxMotion`: `popScale`, `settleScale`, `jellyWide`,
`jellyTall`, `glyphOvershoot`, `pulse`, `slide`, `flipAngle`, `perspective`.
Glyph size is A1's `component.checkboxGroup.iconSize`; colours are A1 roles.
Token story: Foundations/Tokens/Checkbox motion.

## Promotion notes

A1 embeds the tick and dash as data URIs in the CheckboxGroup CSS. Exposing
them (for example as custom properties) would let motion layers reuse them
instead of mirroring the paths.

## Accessibility

Native checkboxes, labels and hints from A1; Space toggles and animates the
same way. Select all moves between not checked, mixed and checked from its
children; choosing it selects or clears every available option. Disabled
options never move. Reduced motion keeps A1's instant changes.

## Recorded checks — Oct. 11, 2026

- Every variant animates check and uncheck on the changed box only; Select all
  animates off → mixed, mixed → on, on → mixed and on → off; Default plays no
  animation; nothing animates on load. Reduced motion: no animation. Axe
  reported no violations at desktop and 390 px widths; no console errors.
- Not yet done: a screen-reader review, other browsers and every theme.
