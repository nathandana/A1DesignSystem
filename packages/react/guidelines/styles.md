# A1 Design System — Styles, Layout, and Responsive Patterns

CSS methodology for apps built on A1: reach for layout components first,
tokens second, utility classes third, and custom CSS only as a documented last
resort.

---

## The law: layout components before custom CSS

Before writing any `display`, `flex`, `grid`, `gap`, `align-items`, or
`justify-content` CSS, check whether a layout component covers the pattern:

| Need | Use |
|---|---|
| Column stack with gap | `<Stack direction="column" gap="...">` |
| Row cluster | `<Stack direction="row" gap="...">` or `<Cluster>` |
| Multi-column grid | `<Grid columns={...} gap="...">` |
| Section with padding, surface, gradient | `<Section padding="..." surface="..." gradient="...">` |
| Constrained-width content column | `<Section contentWidth="...">` |
| Full-viewport-height section | `<Section height="screen">` |
| Dark/inverse island | `<Section inverse>` or `<Inverse>` |
| Padding around a block | `<Inset space="...">` |
| Row of form fields | `<FieldRow>` (never a flex row of fields) |
| Row of buttons | `<ButtonContainer align="...">` |
| Full-page shell | `<PageLayout header={...} sidebar={...}>` |

Likewise, when something *looks* wrong (spacing, alignment, surface color),
the fix is a component prop or the correct wrapper — not a CSS rule targeting
`.a1-*` classes. Component internals are not a styling API.

---

## Spacing scale

Two scales, both tokenized:

- **Semantic gaps** (used by `gap` props): `xs` 8px · `sm` 12px · `md` 16px ·
  `lg` 24px · `xl` 40px → `--semantic-spacing-gap-*`
- **Raw scale** (for custom CSS / utilities): `--base-spacing-{1|2|4|6|8|12|16|20|24|32|40|64|96|128}`
  — the name is the pixel value.

Never write a pixel length that has a token; never invent in-between values.

### Spacing utilities (optional import)

```js
import "@gtivr4/a1-design-system-react/utilities/spacing.css";
```

Classes follow `a1-{p|m}{t|b|l|r|x|y}?-{size}`: `a1-p-16` (padding 16 all
sides), `a1-mt-8` (margin-top 8), `a1-px-24` (inline padding 24). Sizes match
the raw scale above. These use `!important` — they're for one-off adjustments,
not layout systems; prefer `Stack`/`Inset` props.

### Width utilities (optional import)

```js
import "@gtivr4/a1-design-system-react/utilities/width.css";
```

`a1-max-w-{3xs|2xs|xs|sm|md|lg|xl|2xl|full|none}` and `a1-min-w-*` set logical
inline-size constraints from `--base-width-*` tokens (80–800px). Note this is
a different scale from `Section contentWidth` (456–1440px).

---

## Breakpoints

Viewport breakpoints (used by responsive props and component CSS):

| Name | Range |
|---|---|
| `xs` | ≤ 480px |
| `sm` | 481–640px |
| `md` | 641–1024px |
| `lg` | 1025–1440px |
| `xl` | ≥ 1441px |

### Responsive props

Many props accept a breakpoint object that cascades upward (xs → xl):

```jsx
<Grid columns={{ xs: 1, md: 2, xl: 4 }}>
<Section padding={{ xs: "sm", lg: "lg" }} align={{ xs: "left", lg: "center" }}>
<TopHeader navIconPosition={{ xs: "hidden", sm: "above", lg: "start" }}>
```

Prefer these over writing your own media queries.

### Custom media in your own CSS

After configuring PostCSS (see `setup.md`), your CSS can use the same named
breakpoints as the system:

```css
@media (--bp-md-up) { ... }   /* ≥ 641px */
@media (--bp-sm-down) { ... } /* ≤ 640px */
```

Available: `--bp-{xs|sm|md|lg|xl}` (exact band), plus `-up` / `-down`
variants. Defined in the package's `breakpoints.css`, which also exposes
`--breakpoint-*` custom properties for reading in JavaScript.

### Container queries

Components adapt to their **container** where it matters (Card, Calendar,
ActionTiles, DataTable density, and others) — you don't need to wire anything.
For your own container-responsive CSS, use the standard thresholds: 320 / 480 /
640 / 960 px.

---

## Custom CSS rules (when you must)

- Every value references a token: `var(--semantic-color-*)`,
  `var(--base-spacing-*)`, `var(--base-radius-*)`. No raw hex, px, or ms
  values that have token equivalents.
- Prefix your own classes with your app's namespace — never with `a1-`.
- No `!important`; no inline styles.
- Add a comment explaining why no layout component covered the pattern.

---

## Content and state rules

- **Never uppercase text** — no `text-transform: uppercase` in CSS, no
  `.toUpperCase()` on user-facing strings. Author everything in sentence case
  ("Create account"). Screen readers may spell out uppercased words.
- **Never change `font-weight` on state** (`:hover`, `:focus`, `:active`,
  `aria-selected`, `aria-current`) — it causes layout reflow. Use color,
  border, background, or underline.
- **Semantic HTML always:** `<button>` for actions, `<a>` for navigation,
  `<label>`/`<fieldset>`/`<legend>` for forms. A styled `<div>` is never a
  button.
- Interactive elements need keyboard support, a visible focus state, and WCAG
  AA contrast — the components handle this; don't undo it (e.g. never remove
  focus outlines).
