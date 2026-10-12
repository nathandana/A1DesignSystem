# Labs contextual help

One form field (Routing number, in a direct deposit form) with its help shown
five ways and opened by four kinds of trigger. Combinations that work poorly
are disabled, with the reason shown in the configuration panel. Not a
published A1 component. Follow the
[Labs isolation contract](labs-contributing.md#isolate-experiments-and-prepare-them-for-a1).

## Patterns and triggers

| Pattern | Help button in the field | Help button beside the field | Text button | Field focus |
| --- | :---: | :---: | :---: | :---: |
| Hint (always visible) | — | — | — | — |
| Tooltip (A1 Tooltip) | ✓ | ✓ | — | ✓ |
| Popover | ✓ | ✓ | ✓ | — |
| Inline expansion | ✓ | ✓ | ✓ | ✓ |
| Dialog (A1 Dialog) | ✓ | ✓ | ✓ | — |

- **Hint** needs no trigger.
- **Tooltip** opens on hover and focus only, so a text button that reveals
  hover text has nothing to show when tapped.
- **Popover and Dialog** don't open on field focus: that would cover the field
  or move focus while someone is about to type.
- **Help button in the field:** a small tertiary IconButton at the input's end,
  through TextField `inputOverlay`.
- **Help button beside the field:** a field-height secondary IconButton just
  outside the input. The control gives up that width, so the button lines up
  with the other fields' edge.
- **Text button:** “Find your routing number”, a tertiary Button under the
  field.

## Files and API

- `help-model.js` — `PATTERNS`, `TRIGGERS`, `supports`, `resolveTrigger`
  (falls back to the pattern's first trigger), `unavailableReason`, and
  `placePopover(anchorRect, size, viewport, gap)`. The popover opens below its
  anchor, or above when there's no room. It aligns with the anchor's start
  edge, or its end edge in the right half of the screen, and is clamped to the
  viewport.
- `HelpPatterns.jsx`:
  - `HelpPopover`: a native `popover="manual"` element in the top layer, with
    `role="dialog"`, a heading, a Close button and script positioning.
  - `InlineHelp`: a grid-rows expansion; collapsed content is `visibility:
    hidden`.
  - `HelpDetails`: the shared help text.
- `contextual-help.css` — scoped help button placement, popover card and
  inline panel styles; motion inside `prefers-reduced-motion: no-preference`.
- `ContextualHelpExperiment.jsx` — the form and configuration.

## Tokens

`component.contextualHelp`: `popoverWidth` (`base.width.sm`), `popoverGap`
and `enterOffset`. Surfaces use A1 surface, border, radius and shadow roles.
Token story: Foundations/Tokens/Contextual help.

## Accessibility

- Help buttons have the name “Help with routing number”. Toggles expose
  `aria-expanded` and `aria-controls`; the dialog trigger has
  `aria-haspopup="dialog"`.
- **Popover:** a non-modal dialog. Focus moves into it on open. Escape or
  Close returns focus to the trigger. Clicking elsewhere or tabbing out
  closes it without moving focus. It sits after its trigger in the DOM, so Tab
  continues to the next field.
- **Inline help:** added to the field's `aria-describedby` while open. With
  the focus trigger, it shows while the field has focus.
- **Dialog:** A1 Dialog traps focus and returns it to the trigger.
- **Tooltip:** A1 Tooltip on hover and focus, merged into the field's
  description.

## Recorded checks — Oct. 11, 2026

- All 13 supported pattern and trigger combinations open, close with Escape
  (inline is a disclosure and stays open), return focus correctly and pass
  axe. The exception is Tooltip: axe's best-practice `region` rule flags A1
  Tooltip's portal to `<body>`, outside page landmarks.
- The beside-the-field button aligns with the other fields' edge and is
  vertically centred on the input. Popover placement and phone layout (390 px)
  checked; no console errors.
- Not yet done: a screen-reader review, other browsers and every theme.
