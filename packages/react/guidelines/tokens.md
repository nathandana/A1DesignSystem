# A1 Design System — Tokens and Theming

Every visual decision in A1 — color, spacing, typography, radius, shadow,
motion — is a design token exposed as a CSS custom property. Components read
tokens; they never hardcode values. Your custom styles should do the same.

---

## Token tiers

| Tier | Prefix | Purpose | Example |
|---|---|---|---|
| Base | `--base-*` | Raw values — avoid using directly in app code | `--base-color-blue-500`, `--base-spacing-16` |
| Semantic | `--semantic-*` | Intent-based aliases — **use these first** | `--semantic-color-action-background`, `--semantic-spacing-gap-md` |
| Component | `--component-*` | Component-specific values — only relevant when theming a component | `--component-button-min-height` |

**Rule:** for any custom CSS in your app, reach for a `--semantic-*` token
first, a `--base-*` spacing/radius token second, and never a raw hex value or
pixel length that has a token equivalent.

All of these are defined in `tokens.css` (the package's compiled `:root`
block) — that import is what makes every component render correctly.

---

## Commonly used tokens

**Color (semantic):**

- Surfaces: `--semantic-color-surface-page`, `-panel`, `-raised`, `-field`, `-inverse`
- Text: `--semantic-color-text-default`, `-muted`, `-inverse`
- Border: `--semantic-color-border-subtle`, `-strong`
- Action: `--semantic-color-action-background`, `-foreground` (and hover/pressed variants)
- Status: `--semantic-color-status-{info|success|warn|error}-*`

**Spacing:**

- Gap scale: `--semantic-spacing-gap-{xs|sm|md|lg|xl}` (8 / 12 / 16 / 24 / 40 px)
- Raw scale: `--base-spacing-{1|2|4|6|8|12|16|20|24|32|40|64|96|128}` (px values matching the name)

**Typography:**

- Families: `--base-font-family-{body|heading|display|mono}`
- Prefer the `Heading` / `Paragraph` components' `size` props over font-size tokens.

**Radius:** `--base-radius-{sm|md|lg|xl}` · **Shadows:** `--semantic-shadow-{sm|md|lg}`

---

## Themes

A theme is a set of selector-scoped token overrides shipped in `themes.css`.
Activate one by putting its class on `<html>` (global) or any container
(scoped):

| Class | Theme |
|---|---|
| *(none)* | Default A1 light theme |
| `.a1-theme-accessible` | High-contrast accessible variant |
| `.a1-theme-heritage` | Legacy brand theme |
| `.a1-theme-fresh` | Sky-blue accents, Nunito/Baskerville type |
| `.a1-theme-crochet` | Soft pastel serif theme (Fraunces / Roboto Slab) |
| `.a1-theme-aperture` | Minimal gallery-grade monochrome (Playfair / Manrope) |
| `.a1-theme-marshmallow` | Soft pastel neumorphism (Varela Round / Nunito) |
| `.a1-theme-catlympics` | Event/demo theme |

Branded themes require their fonts to be loaded by the host page — see
`setup.md`.

---

## Light, dark, and inverse

`color-scheme.css` owns mode switching:

| Mechanism | Effect |
|---|---|
| *(default)* | Light mode; follows nothing |
| `.a1-theme-dark` on `<html>` | Force dark mode globally |
| `.a1-theme-light` on `<html>` | Force light mode (also usable on a container inside dark) |
| System preference | `prefers-color-scheme: dark` is honored automatically |
| `<Inverse>` / `<Section inverse>` | Opposite-of-document-mode island for a subtree |

**Inverse scope contract:** an inverse scope renders opposite the document
mode — dark on a light page, light on a dark page. It is *not* a recursive
toggle: nesting `<Inverse>` inside `<Inverse>` stays in the same scheme. Use an
explicit `.a1-theme-light` / `.a1-theme-dark` class boundary when a nested
region must force a specific mode.

Portals: native top-layer elements (`<dialog>`) keep the inherited scope
because they remain DOM descendants. A portal you move outside an inverse
subtree does not — give it an explicit mode class.

---

## Overriding tokens (app-level theming)

To adjust the system for your brand, override tokens at `:root` (or under a
scoping class) *after* the package CSS imports:

```css
:root {
  --semantic-color-action-background: var(--base-color-accent-600);
}
```

Rules:

- Override **semantic or component tokens**, not base ramp values.
- Keep overrides in one dedicated file — scattered overrides are invisible to
  future maintainers.
- Never restyle component internals by targeting `.a1-*` classes; if a
  component lacks the prop you need, that's a gap to raise upstream, not a CSS
  override to write.

---

## Z-index

If you must layer custom elements, use the system bands — never invent values
in between: sticky chrome 100, pinned chrome 200, popovers 1000, non-top-layer
modals 1100, toasts 1200. `Dialog` uses the native top layer and beats any
z-index; anything that must appear above an open Dialog must also be in the
top layer (Popover API or rendered inside the dialog).
