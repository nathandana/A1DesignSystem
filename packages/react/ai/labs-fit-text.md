# Labs fitted type

Type that fits its container: each line is measured and scaled so it fills
the container's width, so lines with fewer or narrower letters are set larger.
Not a published A1 component. Follow the
[Labs isolation contract](labs-contributing.md#isolate-experiments-and-prepare-them-for-a1).

## Options

- **Text and examples:** Poster, Quote and Event. Editing the text deselects
  the example.
- **Line breaks:**
  - As written: the author's own new lines.
  - Word per line.
  - Balanced: 2 to 6 lines of near-equal length.
- **Sizing:** each line fills the width, or every line matches the size that
  fits the longest one.
- **Container width:** 240, 320, 480, 640 or 800 px (base width tokens), or
  full width. The default is 480.
- **Largest size:** 72 or 96 px (display jumbo sizes), 128 px
  (`component.fitText.maxLarge`), or no limit. Capped lines stop filling the
  width.
- **Font:** display, heading, body or mono family tokens. **Weight:** regular
  or bold. **Alignment:** start or center.
- **Show sizes:** labels each line with its size. Room is reserved for the
  label, so lines still fit.

## Files and API

- `fit-model.js` — pure, tested functions:
  - `splitLines(text, mode, count)` for the written, words and balanced modes.
  - `balance(words, count)`: dynamic programming that minimizes the longest
    line while keeping word order.
  - `fitSizes(widths, available, { reference, min, max, mode })`: returns a
    size and a wrap flag for each line.
- `FitText.jsx` — `FitText` (`lines`, `mode`, `max`, `align`, `font`,
  `weight`, `showSizes`, `as`). It sets every line to `measureSize` px,
  measures each one, then applies the computed sizes in a layout effect, so
  nothing flickers. It refits on container resize (`ResizeObserver`) and when
  fonts finish loading.
- `fit-text.css` — scoped block, line and size-label styles plus the dashed
  container frame.

## Tokens

`component.fitText`: `measureSize`, `minSize` (`semantic.font.size.display.sm`),
`lineHeight`, `lineGap`, `maxLarge`. Token story: Foundations/Tokens/Fitted
type.

## Accessibility

- The fitted block is a real paragraph of text, with each line in a span, so it
  reads as one sentence and stays selectable and translatable.
- Sizes are recalculated on resize and zoom, so it keeps fitting at 400% zoom.
- A line that would need less than the display minimum wraps instead of
  shrinking further.
- Size labels are `aria-hidden`.

## Recorded checks — Oct. 11, 2026

- All four poster lines measured exactly the container width (742 px at full
  width). Balanced Quote lines and "Match longest" used one shared size.
- Size labels caused no overflow, and the 240 px container refit. At 390 px the
  text did not overflow.
- Axe reported no violations on desktop or mobile; no console errors.
- Not yet done: every theme's fonts (sizes refit when fonts load), other
  browsers and a screen-reader review.
