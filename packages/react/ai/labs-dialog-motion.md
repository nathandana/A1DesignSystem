# Labs dialog motion

The A1 Dialog with nine enter/exit animations, a configurable direction and
exit, and a scrim whose color, opacity and blur can change. The stage is a
single large primary button that opens the dialog. Not a published
A1 component or prop. Follow the
[Labs isolation contract](labs-contributing.md#isolate-experiments-and-prepare-them-for-a1).

## Animations

| Animation | Enter | Exit | Direction |
| --- | --- | --- | --- |
| Default | A1 as it ships: instant | Instant | — |
| Fade | Fades in | Fades out | — |
| Scale | Grows from `scaleFrom` as it fades in | Shrinks as it fades out | — |
| Pop | Springs from `popFrom` past full size (expressive easing) | Shrinks as it fades out | — |
| Slide | Slides `slideDistance` from an edge | Back the way it came, or carries on through (the Leaves toolbar names only the selected choice) | Top, bottom, left, right |
| Flip | Turns `flipAngle` to face you, pivoting on its center | Turns back, or on through | Top, bottom, left, right |
| Swing | Swings `swingAngle` on a hinge along the chosen edge | Swings back on its hinge | Top, bottom, left, right |
| Blur | Comes into focus from `blurFrom` | Goes out of focus | — |
| From the button | Grows from `originFrom` at the button that opened it | Shrinks back into it | — |

Enter uses the enter easing and exit uses the exit easing, except Pop's
expressive enter. Duration is a semantic motion token (150 to 750 ms).

## Scrim

- **Color:** A1 scrim (`component.scrim.color`, mode-aware), black, white,
  page surface or accent.
- **Opacity:** 0 to 80%. Relative color syntax replaces the color's alpha:
  `rgb(from <color> r g b / <opacity>)`.
- **Blur:** none, 2, 4, 8 or 16 px from the base spacing tokens.

The A1 default is the A1 scrim at 60% with a 2 px blur, and Reset returns to
it. The scrim fades in and out with the dialog, and keeps its settings with
reduced motion.

## How it works

`MotionDialog` passes `data-motion`, `data-direction`, `data-exit` and custom
properties to the A1 Dialog (`apps/a1-labs/src/dialog-motion/`). The
`dialog-motion.css` file is pure CSS on the native `<dialog>` and its
`::backdrop`:

- `@starting-style` sets where each animation enters from, and the closed
  state sets where it leaves to.
- `display` and `overlay` transitions with `allow-discrete` keep the closing
  dialog in the top layer. These are inside `@supports (overlay: auto)`;
  browsers without them close instantly.
- `::backdrop` inherits the scrim properties from the dialog.
- "From the button" measures the opener's offset from the viewport center
  before opening.

The A1 Dialog still owns focus trapping, Escape, backdrop clicks and focus
return. All movement is inside `prefers-reduced-motion: no-preference`.

## Tokens

`component.dialogMotion`: `slideDistance`, `scaleFrom`, `popFrom`,
`originFrom`, `flipAngle`, `swingAngle`, `perspective`, `blurFrom`. Token
story: Foundations/Tokens/Dialog motion.

## Placement gap found

A dialog rendered as a later child of a Section picks up the Section's gap
rule (`> * + *` adds `margin-block-start`). That pushes a native modal dialog
off center, because it is centered by auto margins. Render dialogs inside a
Stack (flex gap) or outside Sections. The A1 Section rule should exclude
`dialog` and other top-layer elements.

## Recorded checks — Oct. 11, 2026

- All nine animations were sampled mid-enter and mid-exit in Chromium
  (opacity, translate, scale, transform, filter and scrim values), along with
  Slide left with "carry on through". Focus moves into the dialog and returns
  to Open dialog. The scrim color, opacity and blur apply.
- Reduced motion: instant open and close, with the scrim settings kept.
- Axe reported no violations with the dialog open or closed; no console
  errors.
- Not yet done: Safari and Firefox exits (expected instant), a screen-reader
  review and every theme.
