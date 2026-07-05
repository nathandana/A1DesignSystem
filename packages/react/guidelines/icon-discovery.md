# A1 Design System — Icon Discovery

How to find, verify, and render icons. Read this before using any icon.

---

## The one rule

**Never guess an icon name.** Icon names are Material Symbols ligatures — if
the name doesn't exist in the font, the raw text would render instead (the A1
`Icon` component clips this fallback, so a wrong name shows as a blank square).
Verify every name before using it.

**Where to verify:** search the Material Symbols catalog at
[fonts.google.com/icons](https://fonts.google.com/icons) (set the style filter
to *Outlined*). The name to use is the snake_case ligature shown there, e.g.
`shopping_cart`, `check_circle`, `arrow_forward`.

---

## Rendering icons

```jsx
import { Icon } from "@gtivr4/a1-design-system-react";

<Icon name="settings" />
<Icon name="check_circle" size="lg" color="success" />
<Icon name="favorite" fill />
```

Never use inline SVGs, emoji, or other icon fonts — every icon goes through
`Icon` (or a component's `icon` prop, which takes the same names).

### Props

| Prop | Values | Notes |
|---|---|---|
| `name` | Material Symbols ligature (required) | snake_case, e.g. `expand_more` |
| `size` | `xs`(16) `sm`(20) `md`(inherit/~24, default) `lg`(32) `xl`(40) `jumbo`(64) `xJumbo`(96) | Size classes also set optical size for sharp rendering |
| `color` | `muted` `accent` `inverse` `success` `error` `warn` `info` | Omit to inherit the surrounding text color (usually right) |
| `fill` | boolean | Filled style variant |
| `weight` | 100–700 | Stroke weight |
| `grade` | -50–200 | Emphasis fine-tuning |
| `opticalSize` | 20 / 24 / 40 / 48 | Usually set automatically by `size` |

### Font loading

The Material Symbols Outlined variable font must be loaded by the host page
(see `setup.md`). Until it loads, `Icon` reserves a fixed 1em square so layout
never jumps.

---

## Component `icon` props

Many components accept an `icon` prop that takes the same Material Symbols
name: `Button`, `IconButton`, `Link`, `Chip`, `ActionTile`, `MessageBadge`,
`Banner`, `ChoiceGroup` options, `Menu` items, `TreeMenu` items, Toolbar tools,
`Stat`, `MessageEmptyState`, and others. Prefer the prop over composing your
own `<Icon>` next to the component.

---

## Accessibility

- Icons rendered by `Icon` are **decorative by default** (`aria-hidden`).
  Meaning must come from accompanying text.
- **Icon-only buttons require an accessible name:** every `IconButton` needs
  `aria-label` describing the action ("Delete row", not "trash").
- Never rely on an icon alone to convey status — pair it with a text label
  (see `MessageBadge`).

---

## Custom icons

Unprefixed names always resolve to Material Symbols. Project-specific icons
use the explicit `custom:` namespace so they can never shadow a Material
glyph:

```jsx
<Icon name="custom:brand_mark" />
```

To make `custom:*` names resolve, register a generated icon font at runtime:

```js
import { registerCustomIconFont, clearCustomIconFont } from "@gtivr4/a1-design-system-react";

registerCustomIconFont({
  fontUrl,      // URL of the compiled icon font
  mappings,     // { snake_case_name: codepoint }
  fontFamily,   // optional font-family name
});
```

Custom icon SVGs must use a `0 0 24 24` viewBox with filled paths (no strokes,
transforms, scripts, or external resources). If you don't register a custom
font, stick to Material Symbols names.

---

## Choosing icons

- Prefer the **common, literal** glyph over a clever one (`delete` over
  `auto_delete`, `search` over `manage_search`) unless the specific variant is
  the meaning.
- Keep one metaphor per action across the app — don't mix `edit` and
  `edit_note` for the same operation.
- Standard "none/off" choice in pickers: `block` (exported as
  `TOOLBAR_NONE_ICON` for Toolbar groups).
- Copy affordances use `content_copy`.
