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
        ↓  (scripts/build-html-css.mjs)
packages/pure/dist/a1-light.css   Semantic + component tokens for the light theme
packages/pure/dist/a1-pure.css    Hand-authored; @imports a1-light.css for tokens
        ↓  (system/build-themes.mjs)
packages/react/src/themes.css         Theme selector overrides for React
```

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
├── theme.json          Required — name, description, selectors map
└── tokens/             Optional — additional token overrides in DTCG format
    └── *.json
```

`theme.json` schema:

```json
{
  "name": "Accessible",
  "description": "High-contrast accessible variant.",
  "selectors": {
    "[data-theme='accessible']": {
      "--semantic-color-action-background": "#005CE8"
    }
  }
}
```

### Adding a theme

1. Create `system/themes/{name}/theme.json` with `name`, `description`, and `selectors`.
2. The selector is the CSS selector that activates the theme (e.g. `[data-theme='my-theme']` or `.a1-theme-my-theme`).
3. Only override tokens that differ from the base theme — do not duplicate unchanged values.
4. Run `npm run build:themes` to write `packages/react/src/themes.css` and the html-css dist files.
5. Document the theme in the appropriate example pages.
6. Validate all existing components under the new theme at every supported breakpoint — do not assume they will look correct without checking.

### Supported themes

| Theme ID | Selector | Description |
|----------|----------|-------------|
| `base` | `:root` | Default — no selector required |
| `a1-light` | `[data-theme='a1-light']` | Standard light theme |
| `accessible` | `[data-theme='accessible']` | High-contrast accessible variant |
| `heritage` | `[data-theme='heritage']` | Legacy brand theme |

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
