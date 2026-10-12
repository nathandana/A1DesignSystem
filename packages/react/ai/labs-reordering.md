# Labs reordering

`/experiments/reordering` compares insertion indications and placement motion.
It is an isolated candidate A1 pattern, not a shared reorder-list component.

## Reusable core

`apps/a1-labs/src/reordering/ReorderList.jsx`, `reorder-model.js` and
`reordering.css` depend on React, A1 Card/Stack/Paragraph/IconButton and A1 tokens.
The core imports no Labs shell, settings, demo data or other experiment.
`ReorderingExperiment.jsx` owns sample process items and configuration.

| Input | Contract |
| --- | --- |
| `items` | Controlled array of `{id, label, description?}`; unique stable IDs required. |
| `onChange(items)` | Receives a new order after a committed drop or move-button action. Host must update `items` synchronously. |
| `placement` | `subtle` (core default), `plop` (demo default), `tilt`, `spring`, `pop`, `slide`, `fade`, `instant`. |
| `indicator` | In a gutter beside the list: `rail` (default), `marker`, `pointer`. Over the slot: `line`, `outline`, `slot`, `glow`, `arrows`. |
| `duration` | Semantic motion key `fast`, `slow` (default) or `slower`: 150/300/500 ms. |
| `label` | Accessible list name; defaults to Reorder items. |

The array remains unchanged while dragging. A local projected order shows the
insertion preview; cancellation restores the host's original order. Item
objects preserve identity when moved. Remount for a complete host reset.

## Input and announcements

- Pointer: press a handle, move to a slot and release within the list. A
  noninteractive ghost follows the pointer; pointer capture keeps the session
  coherent. Touch scrolling is disabled only on the handle.
- Keyboard: Space/Enter picks up a handle; arrows move the insertion point;
  Home/End select the first/last position; Space/Enter commits. Focus follows
  the moved handle.
- Up/down buttons provide single-activation alternatives without dragging.
  The first/last boundary control is disabled. During pickup, use the active
  handle instead of starting a second operation.
- Escape, Tab, outside press/drop, lost pointer capture, pointer cancellation,
  window blur, backgrounding or viewport resize cancels a pickup. Host item or
  configuration changes also cancel an active preview.
- A stable polite atomic status announces pickup, target position, placement
  and cancellation. Ordered-list semantics remain intact. The last placed item
  retains a theme-focus-color outline; color and movement are not the sole cues.

This demonstration targets a short bounded list. It does not implement
cross-list transfer, virtualized rows or automatic scrolling during a drag.
Use the keyboard or per-row controls to reach items beyond the visible area.

## Motion and isolation

A1 owns row layout, cards, typography and controls. The outer list-item wrapper
animates neighbor displacement from measured previous positions (FLIP); an
inner wrapper owns the landing treatment. This keeps layout movement separate
from squash/tilt and avoids replacing shared A1 styles.

Subtle settles vertically, Plop lands with a squash and small rebound, Tilt
rotates into place, Spring overshoots and settles with decaying bounces, Pop
swells and settles in place, Slide in enters from the inline start (mirrored in
right-to-left), Fade in appears from slightly smaller, and Instant skips both
neighbor and landing motion.

## Insertion indicators

- Over the slot: Insertion line (with "Place here · N"), Target outline,
  Empty slot (a recessed, empty slot drawn under the card, so a keyboard user's
  card and focus ring stay on top), Glow (a ring with a soft pulsing halo) and
  Arrows (a line with inward arrowheads).
- In the margin: Side marker (a slot-height bar with a numbered bubble),
  Pointer (a numbered tag whose tip points at the slot) and Position rail (while
  dragging, a track with a dot for every position; the target becomes the
  numbered bubble). These sit in a reserved `gutter` beside the list so the
  dragged item never covers them and they stay on screen on phones. Bubbles and
  tags use the action background/foreground pair.
- All indicators are `aria-hidden`; the status announcement carries the
  position. Glow's pulse stops with reduced motion; forced colors use
  Highlight.
Geometry comes from `component.reordering` tokens (including `slide`,
`popScale`, `popSettle`, `fadeScale`, `gutter`, `markerOffset`, `markerSize`,
`railDot`, `glowSpread` and `arrowSize`); timing/easing and colors
come from existing A1 semantic tokens. The Foundations token story documents
the new geometry. CSS selectors use only `a1-reordering` namespaces.

A live reduced-motion query skips new movement and cancels running animations.
Pointer-following position still tracks direct input, while insertion cues and
announcements remain. The ghost portal has only presentation and never receives
focus or intercepts pointer input. All animation resources are cleaned up on
unmount.

## Validation and limits

Model checks cover immutable moves, identity preservation, boundaries, stable
slot selection and final transforms. Browser checks cover pointer and keyboard
reorder/cancel, move buttons, all placement styles, reduced motion, responsive
widths and scoped axe. The core was exercised beside a normal Button in a
standalone A1 host, including theme/mode changes. Assistive-technology speech
quality still needs human evaluation before promotion.

## Magnetic grid option

`MagneticGrid.jsx`, `magnetic-model.js`, `magnetic-config.js` and
`magnetic-grid.css` form a second controlled core, independent of Labs routing.
It accepts `items`, `onChange`, `label`, `radius`, `stiffness`, `damping`,
`onUndo` and `canUndo`. The host owns committed order and a bounded 20-move
history. Switching List/Magnetic retains order; Reset clears order and history.

The grid uses A1 Grid (two columns at xs–md, three at lg+) and Card. On pickup,
measure fixed slot centers once; animated neighbors never feed back into target
selection. Nearest-center hit testing has bounded snap distance and hysteresis.
Within that distance, attraction grows quadratically toward the slot. A damped,
unit-mass spring follows the pointer and generates neighbor/landing FLIP frames.
The original order stays controlled until placement; a local projected order
and a labeled solid outline identify the exact landing slot. Outside snap range,
the outline becomes dashed and says No target; release cancels.

`component.magneticReordering` supplies near/default/wide distances (aliases of
64/96/128 spacing), attraction 0.75, hysteresis 1.2, stiffness 180/260/360 and
damping 18/24/32. Defaults are 96 px, 260 and 24. The configuration imports these
tokens, including resolved spacing aliases. A1 supplies all colors, cards,
controls, spacing, focus geometry and shadows. The Reordering token story lists
the new namespace. Only magnetic wrappers, handles, outlines and the decorative
pointer ghost have local CSS; shared components are not restyled.

Keyboard pickup uses Space/Enter, horizontal arrows (RTL-aware), row-aware
vertical arrows, Home/End and Space/Enter to place. Escape, Tab, Cancel move,
outside release, pointer cancellation/lost capture, blur, hidden document,
scroll, resize and changed host data/configuration cancel. Earlier/later buttons
provide an alternative to dragging. Undo restores the previous committed order.
A polite atomic status announces pickup, changed targets, placement, cancellation
and undo. Focus stays with the moved handle. The ghost is aria-hidden and inert
to pointer input; the actual cards retain accessible list semantics.

Live reduced-motion and forced-colors preferences cancel running springs and
follow input directly. Static target text and outlines remain. RAFs, WAAPI
animations, listeners and portals are cleaned up on unmount. This bounded demo
does not implement autoscroll, cross-grid transfer or virtualization. Standalone
host and human screen-reader validation remain required before A1 promotion.

Validation: model tests cover snapping, hysteresis, attraction and convergence
across all stiffness/damping choices. Focused browser checks cover pointer and
keyboard previews, committed moves, outside drops, cancel/undo, mobile two-column
navigation, touch dragging, forced colors, live reduced motion, and scoped axe excluding repeated contrast
checks. Desktop and phone layouts were visually reviewed.
