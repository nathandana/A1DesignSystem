# A1 Design System — Foundations

This file covers the repository structure and shared system concepts. Read it with `packages/react/ai/project-context.md` before changing tokens, themes, labels, or package-wide architecture.

---

## What is A1?

A1 is a multi-platform design system that covers React, HTML/CSS, and React Native. It is token-driven: every visual decision — color, spacing, typography, radius, shadow, motion — is defined once as a Style Dictionary token and consumed by all packages. The React component library is the canonical reference for component behavior and API; the HTML/CSS and React Native packages replicate the same visual design without duplicating the token definitions.

---

## Monorepo Structure

```
/
├── system/                       Token and theme authoring
│   ├── tokens/                   Style Dictionary source tokens (DTCG format)
│   │   ├── spacing.json          Base + semantic spacing
│   │   ├── typography.json       Font families, sizes, weights, line-heights
│   │   ├── color-ramp.json       Raw color palette
│   │   ├── motion.json           Easing + duration tokens
│   │   ├── shadow.json           Shadow tokens
│   │   └── component/            Per-component tokens (button.json, field.json, ...)
│   ├── themes/                   Theme overrides
│   │   ├── base/                 Default — compiles to :root
│   │   ├── a1-light/             Standard light theme
│   │   ├── accessible/           High-contrast accessible theme
│   │   └── heritage/             Legacy brand theme
│   ├── labels/                   Localisable UI strings
│   │   └── *.json                One file per category
│   ├── icons/                    System icon registry
│   │   └── material-symbols.json Definitive icon list until A1 has a custom set
│   └── rules/                    Design rules as YAML (documentation + lint)
│       └── *.yaml                One file per component
│
├── build/                        Style Dictionary build output (do not edit)
│   ├── css/tokens.css            All tokens as CSS custom properties
│   └── json/tokens.json          All tokens as nested JSON
│
├── packages/
│   ├── react/                    React component library (source of truth for components)
│   ├── html-css/                 BEM + scoped CSS classes
│   ├── react-native/             React Native components
│   └── figma/                    Figma Code Connect mappings
│
├── examples/
│   └── a1-pure/                  Plain HTML demo using a1-pure.css
│
└── scripts/
    └── build-html-css.mjs        Generates dist files for html-css package
```

---

## Token System

### How tokens flow

```
system/tokens/**/*.json
        ↓  (Style Dictionary: npm run build:tokens)
build/css/tokens.css              All raw tokens as :root custom properties
build/json/tokens.json            All tokens as nested JSON (used by build scripts)
system/color-modes.mjs            Shared light/dark semantic + component alias contract
        ↓  (scripts/build-html-css.mjs)
packages/pure/dist/a1-light.css   Semantic + component tokens for the light theme
packages/pure/dist/a1-pure.css    Hand-authored; @imports a1-light.css for tokens
        ↓  (system/build-themes.mjs)
packages/react/src/themes.css         Theme selector overrides for React
```

`system/color-modes.mjs` is the canonical authored relationship for environmental
light/dark color roles. `system/build-themes.mjs` generates React's explicit,
system-preference, and inverse selector blocks into `color-scheme-modes.css`;
Pure CSS and React Native consume the same mode contract. Hand-authored reset,
contrast, and theme-specific structural CSS lives in `color-scheme-static.css`.
`npm run tokens:audit:check` verifies generated light and dark selector parity.

### Inverse scope contract

`<Inverse>` and `<Section inverse>` apply `.a1-inverse` plus
`data-a1-color-scope="inverse"`. An inverse scope is opposite the document mode:
dark on a light document and light on a dark document. It is not a recursive
toggle. A nested inverse remains in the same inverse scheme as its nearest
inverse ancestor. Use an explicit `.a1-theme-light` or `.a1-theme-dark` boundary
when a nested region must force a particular mode.

Native top-layer elements such as `<dialog>` retain inherited variables because
they remain descendants in the DOM. A consumer-created portal moved outside the
inverse DOM subtree does not inherit the scope automatically and must carry an
explicit mode class or render inside the scoped dialog/container.

### Token format (DTCG)

All tokens use the W3C Design Token Community Group format:

```json
{
  "component": {
    "button": {
      "minHeight": { "$type": "dimension", "$value": "{base.spacing.40}" },
      "borderRadius": { "$type": "dimension", "$value": "{base.radius.md}" },
      "primary": {
        "background": { "$type": "color", "$value": "{semantic.color.action.background}" }
      }
    }
  }
}
```

### Token tiers

| Tier | Prefix | Purpose | Example |
|------|--------|---------|---------|
| Base | `base.*` | Raw values — never used directly in components | `base.color.blue.500`, `base.spacing.16` |
| Semantic | `semantic.*` | Intent-based aliases over base tokens | `semantic.color.action.background`, `semantic.spacing.gap.md` |
| Component | `component.*` | Component-specific values, may alias semantic tokens | `component.button.minHeight`, `component.field.default.height` |

### CSS custom property naming

Style Dictionary converts camelCase JSON keys to kebab-case CSS custom properties:

| JSON path | CSS custom property |
|-----------|---------------------|
| `base.spacing.16` | `--base-spacing-16` |
| `semantic.color.action.background` | `--semantic-color-action-background` |
| `component.button.primary.background` | `--component-button-primary-background` |
| `component.field.default.height` | `--component-field-default-height` |

### Adding a token

1. Identify the correct tier (base → semantic → component).
2. Add to the appropriate file in `system/tokens/` using DTCG format.
3. Reference other tokens with `{dotted.path}` syntax — never hardcode raw values.
4. Run `npm run build:tokens` to regenerate `build/`.
5. Run `npm run build:html-css` to update `packages/pure/dist/a1-light.css`.
6. Use the resulting CSS custom property in component CSS files.

After changing color tokens, themes, mode aliases, or component color references:

1. Run `npm run tokens:audit:check`.
2. Run `npm run build:tokens`.
3. With Storybook running, run `npm run tokens:contract:check`.
4. Run `npm run test:qa` for visual and contrast regression coverage.

```json
// system/tokens/component/my-component.json
{
  "component": {
    "myComponent": {
      "height": { "$type": "dimension", "$value": "{base.spacing.40}" },
      "background": { "$type": "color", "$value": "{semantic.color.surface.page}" }
    }
  }
}
```

---

## Theme System

### What themes are

A theme is a set of CSS selector overrides that replace semantic and component token values. The `base` theme compiles to `:root` and requires no selector. Other themes use data attributes or class selectors.

### Theme file structure

```
system/themes/{theme-name}/
├── theme.json          Required — metadata and selector activation config
├── overrides/          Structured DTCG token overrides
│   └── default.json
└── styles/             Optional non-token selector declarations
    └── default.json
```

`theme.json` schema:

```json
{
  "$schema": "../theme.schema.json",
  "name": "Accessible",
  "description": "High-contrast accessible variant.",
  "selectors": [
    {
      "selector": ".a1-theme-accessible",
      "overrides": "overrides/default.json"
    }
  ]
}
```

Override files use canonical token paths and DTCG leaves:

```json
{
  "tokens": {
    "semantic": {
      "color": {
        "action": {
          "background": {
            "$type": "color",
            "$value": "{base.color.accent.500}"
          }
        }
      }
    }
  }
}
```

`system/theme-config.mjs` validates every referenced file, confirms canonical
paths and types, and converts token aliases into CSS custom-property references.
Intentional private/runtime exceptions live in an explicit `customProperties`
object in the override file. `theme.json` must not contain authored values.
Style Dictionary reads only `system/tokens/`; theme overrides are consumed by
the React, Pure CSS, and React Native build scripts without entering the global
token namespace.

### Adding a theme

1. Create `system/themes/{name}/theme.json` with `name`, `description`, and selector entries.
2. Put token changes in `overrides/*.json`; keep authored values out of `theme.json`.
3. The selector is the CSS selector that activates the theme (e.g. `[data-theme='my-theme']` or `.a1-theme-my-theme`).
4. Only override tokens that differ from the base theme — do not duplicate unchanged values.
5. Run `npm run build:tokens` to validate and regenerate all platform outputs.
6. Document the theme in the appropriate example pages.
7. Validate all existing components under the new theme at every supported breakpoint — do not assume they will look correct without checking.

### Supported themes

| Theme ID | Selector | Description |
|----------|----------|-------------|
| `base` | `:root` | Default — no selector required |
| `a1-light` | `[data-theme='a1-light']` | Standard light theme |
| `accessible` | `[data-theme='accessible']` | High-contrast accessible variant |
| `heritage` | `.a1-theme-heritage` | Legacy brand theme |
| `fresh` | `.a1-theme-fresh` | Sky-blue accents, Nunito/Baskerville type, mint gradient background |
| `crochet` | `.a1-theme-crochet` | Soft cozy pastels (dusty-rose accent, sage/periwinkle/apricot) on warm cream surfaces; Fraunces (expressive warm serif) display, Libre Baskerville headings, Roboto Slab (slab serif) body |
| `aperture` | `.a1-theme-aperture` | Modern, minimal, gallery-grade for a photography portfolio — near-monochrome graphite on clean whites (Apple/Audi inspired), refined Apple-blue info + Audi-red error; Pinyon Script (elegant script) display, Playfair Display (editorial serif) headings, Manrope (clean elegant sans) body; small radii |
| `marshmallow` | `.a1-theme-marshmallow` | Soft, pillowy **subtle neumorphism** in pastels — dusty-lavender accent on warm marshmallow-cream surfaces, gentle raised/inset 3D shadows on buttons (raised at rest → inset when pressed) and cards, generous rounding; Varela Round (rounded) display & headings, Nunito (rounded) body. Achieved entirely through theme token overrides (`--component-button-box-shadow`/`-hover`/`-active`, `--component-button-press-transform`, `--semantic-shadow-*`) over warm-cream surfaces so both the light highlight and soft shadow read |

### Breakpoints

Components must be validated at xs, sm, md, lg, and xl breakpoints. Breakpoint definitions are in `system/tokens/breakpoint.json`.

---

## Container Query Breakpoints

Container queries are used for **component-level** responsive behaviour — when a component should adapt to the size of its own container rather than the viewport. This is distinct from the viewport breakpoints above.

### Standard sizes

| Label | Min-width | Use for |
|-------|-----------|---------|
| `sm`  | `320px`   | Smallest meaningful interactive width; compact adjustments |
| `md`  | `480px`   | Medium card/column width; layout shifts begin |
| `lg`  | `640px`   | Full-width or wide card; major layout changes (e.g. row switch) |
| `xl`  | `960px`   | Very wide containers; rare, only for data-dense components |

These values are de-facto standards derived from existing component usage:
- `480px` is already used in Breadcrumb and ButtonContainer.
- `320px` (below-sm threshold) is already used in Calendar.
- `640px` aligns with the viewport `sm-max` boundary.

### Applying container queries

1. Add `container: a1-{component} / inline-size` to the component's root element.
2. Use `@container a1-{component} (min-width: Xpx)` for progressive enhancement (add features as the container grows).
3. Hardcode the numeric pixel values — CSS custom properties cannot be used inside `@container` conditions.
4. Use CSS custom property variables *inside* the container query block to drive layout so token references remain consistent.

```css
/* Example */
.a1-card {
  container: a1-card / inline-size;
}

@container a1-card (min-width: 320px) { /* sm */
  .a1-card__icon { --a1-card-icon-size: var(--base-spacing-24); }
}

@container a1-card (min-width: 480px) { /* md */
  .a1-card__icon { --a1-card-icon-size: var(--base-spacing-32); }
}

@container a1-card (min-width: 640px) { /* lg */
  .a1-card--has-icon { flex-direction: row; }
}
```

---

## Z-index and Layering

A1 stacks overlays with **two distinct mechanisms**. Mixing them is the usual cause of "my menu is behind the dialog" bugs — so decide which layer an element belongs to before assigning any `z-index`.

### 1. The browser top layer (modals)

`Dialog` renders a native `<dialog>` opened with `showModal()`, which the browser paints in the **top layer** — above the entire normal stacking context, **regardless of any `z-index`**. No `z-index`, however large, can place a normal-layer element above an open `showModal` dialog.

**Consequence:** anything that must appear **above a modal** — a menu opened inside a dialog, a confirmation snackbar, a tooltip — must **also live in the top layer**, not merely carry a higher number. Use the **Popover API** (`popover` attribute + `showPopover()`) or render the element **inside the open `<dialog>`**. Within the top layer, stacking is by **open order** (last opened wins), so a menu opened from a dialog naturally sits above it.

A popover portaled to `<body>` (the current `Menu` / `Autocomplete` pattern) is in the **normal** layer and will render **behind** an open Dialog. As an interim fix, such a popover may portal into the nearest open `<dialog>` ancestor when there is one (so it joins the dialog's top-layer stack); the durable fix is the Popover API.

### 2. The z-index scale (everything else)

For elements that stay in the normal layer — sticky chrome, pinned app furniture, non-modal popovers, and toasts that never overlap a modal — use this single ordered scale. **Never invent values between the bands.**

| Layer | Token (target) | Value | Used by |
|-------|----------------|-------|---------|
| Content | — | `auto` / 0 | In-flow content. Component-**local** `-1` / `0` / `1` for internal stacking only (Tabs active tab, Slider thumb, Heading mark) — never part of the global scale |
| Sticky | `--semantic-z-sticky` | 100 | TopHeader, PageLayout sticky regions |
| Pinned chrome | `--semantic-z-pinned` | 200 | SideNav overlay, BottomDrawer, PageNav, StickyActions |
| Popover | `--semantic-z-popover` | 1000 | Menu, Autocomplete listbox, Select, ContextMenu, tooltips |
| Modal (non-top-layer) | `--semantic-z-modal` | 1100 | Any modal that does **not** use the native top layer |
| Toast | `--semantic-z-toast` | 1200 | Snackbar / toasts, above non-top-layer modals |

### Current state (audit) — June 2026

| Component | Current z-index | Layer | Action |
|-----------|-----------------|-------|--------|
| Dialog | native top layer | — | correct |
| Menu, Autocomplete | `--component-menu-z-index` (1000), `<body>` portal | Popover | **behind a top-layer Dialog** → top layer / portal into dialog |
| ContextMenu | hardcoded `1000` | Popover | replace with the popover token |
| Snackbar | `--component-snackbar-z-index` (1100) | Toast | **behind a top-layer Dialog** → top layer (toasts must beat modals) |
| TopHeader dropdown | `calc(menu + 1)` = 1001 | Popover | collapse onto the popover layer once menus are top-layer |
| TopHeader bar | 100 | Sticky | ok |
| PageLayout | 100 | Sticky | ok |
| StickyActions | 150 | Pinned | fold into 200 |
| SideNav (199 / overlay 200), BottomDrawer (200), PageNav (200) | ~200 | Pinned | align onto `--semantic-z-pinned` (200) |
| Tabs / Slider / TreeMenu / Heading | `-1` … `1` | Content | component-local — leave as-is |

### Rules

1. **One scale.** Every normal-layer `z-index` references a layer token; no ad-hoc numbers between bands. If a token doesn't exist yet, add it to `system/tokens/` (semantic tier).
2. **Top layer for anything that must beat a modal.** Menus, context menus, tooltips, and toasts that can appear over a `Dialog` use the Popover API or render inside the dialog — `z-index` alone will not work.
3. **Component-local stacking** (`-1` / `0` / `1`) stays inside the component and never participates in the global scale.

---

## Label System

Labels are localizable UI strings — not design tokens, but shared content values used consistently across components.

### Label file structure

```json
// system/labels/my-category.json
{
  "label": {
    "myCategory": {
      "myKey": {
        "$type": "string",
        "$value": "English string",
        "$description": "What this label is used for.",
        "locale": {
          "es": "Spanish string",
          "fr": "French string"
        }
      }
    }
  }
}
```

### Adding a label

1. Add to the relevant file in `system/labels/` (or create a new one).
2. Provide at minimum the `$value` (English) and `$description`.
3. Add `locale` entries for all supported app locales whenever a user-facing label is introduced or changed: `es`, `fr`, `de`, `pt`, `ja`, `zh`, and `ar`.
4. Reference the label by its path in component props and documentation.

Agents must not add English-only UI labels unless the label is explicitly internal, temporary, or blocked by an agreed translation decision. If translation is blocked, document the gap in the relevant changelog or task notes.

---

## Icon System

Icons are defined at the system level in `system/icons/material-symbols.json`. This file is the source of truth for icon names accepted by A1 components, Storybook controls, and documentation surfaces.

### Current source

The registry currently uses Google Fonts Material Symbols metadata for the Material Symbols Outlined family. Future custom A1 icons should replace or extend this single registry instead of creating package-local icon lists.

### Adding or removing icons

1. Update `system/icons/material-symbols.json`.
2. Keep each icon entry stable with at least `name` and `categories`.
3. Update any Storybook stories, app pages, examples, and changelogs affected by the icon change.
4. Do not add local hardcoded icon option arrays in components or docs; import from the system registry or a shared helper that reads it.
