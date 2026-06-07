# A1 Design System — Central Context

This file is the single source of truth for all agents and AI assistants working in this repository. Every package, example, and tool follows the rules defined here. Package-level context files add package-specific rules on top of these foundations.

**Related files in this directory:**
- `system/ai/components.md` — live registry of every component and which packages it exists in. Read it before asking "does X exist?" or "where is Y implemented?". Update it when components change.

> **Scope reminder:** This is a multi-package design system. Changes to tokens, themes, or labels ripple across all packages. Before making changes, identify which packages are affected and update all of them. The checklist under "Adding a new component" below applies to all cross-cutting work.

---

## Agent Rules

These eight rules govern all work in this repository. Read them before starting any task.

1. **Use the system first.** Reach for A1 components, patterns, tokens, and utilities before creating anything custom. Custom UI is a last resort, not a starting point.

2. **Do not invent values.** Never create arbitrary colors, spacing, typography, border-radius, motion, or layout values. Every visual value must trace back to a Style Dictionary token. If a token does not exist for the value you need, add it to `system/tokens/` first.

3. **Semantic structure is required.** Every piece of generated markup must use correct HTML semantics and accessible component structure — not just visually correct output. A `<div>` that looks like a button is not a button.

4. **Visual correctness is not enough.** Output must be structurally correct, accessible (keyboard, screen reader, WCAG AA contrast), tokenized, responsive across breakpoints, and maintainable by a future developer who has no context from this session.

5. **Preserve agreed content.** When working from approved content, JSON data, or Priority Guides, preserve the content, hierarchy, and order exactly. Do not invent, reword, or reorder content that has been agreed.

6. **Document every system change.** When a component API, variant, token, theme, label, or rule changes, update Storybook stories, example pages, changelog, and any affected documentation in the same change. Do not ship a system change without its documentation.

7. **Test across themes and breakpoints.** Validate components across all supported themes (light, accessible, heritage) and at all breakpoints (xs through xl). A component that only works in one theme or one viewport size is not finished.

8. **Prefer reusable contracts.** Design component APIs, token structures, and content schemas to be stable and platform-agnostic. Output should be portable across agents, packages, and future contexts without renegotiation.

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
│   │   └── component/            Per-component tokens (button.json, field.json, …)
│   ├── themes/                   Theme overrides
│   │   ├── base/                 Default — compiles to :root
│   │   ├── a1-light/             Standard light theme
│   │   ├── accessible/           High-contrast accessible theme
│   │   └── heritage/             Legacy brand theme
│   ├── labels/                   Localisable UI strings
│   │   └── *.json                One file per category
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
│   ├── a1-design/                React demo app
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
packages/html-css/dist/a1-light.css   Semantic + component tokens for the light theme
packages/html-css/dist/a1-pure.css    Hand-authored; @imports a1-light.css for tokens
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
5. Run `npm run build:html-css` to update `packages/html-css/dist/a1-light.css`.
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
3. Add locale entries for any supported languages.
4. Reference the label by its path in component props and documentation.

---

## Style and CSS Rules

### The law: layout components before custom CSS

**Before writing any `display`, `flex`, `grid`, `gap`, `align-items`, or `justify-content` CSS, check whether a layout component already covers the pattern:**

| Need | Use |
|------|-----|
| Column stack with gap | `<Stack direction="column" gap="…">` |
| Row cluster | `<Stack direction="row" gap="…">` or `<Cluster>` |
| Multi-column grid | `<Grid columns={…} gap="…">` |
| Section with padding, surface, gradient | `<Section padding="…" surface="…" gradient="…">` |
| Constrained-width content column | `<Section contentWidth="…">` |
| Full-viewport-height section | `<Section height="screen">` |
| Dark/inverse island | `<Section inverse>` or `<Inverse>` |
| Card content layout | `<Stack>` inside `<Card>` |

Custom `display: flex` or `display: grid` CSS is only justified when no layout component supports the pattern AND the pattern is genuinely unique to that context. Document why in a comment.

### The law: all values from tokens

**Never hardcode visual values.** Every color, spacing unit, font size, border radius, shadow, and duration must reference a CSS custom property that maps to a Style Dictionary token. Raw fallback values in CSS (e.g. `var(--token, 8px)`) are acceptable only for tokens that are guaranteed to exist — always verify in `packages/html-css/dist/a1-light.css` before adding a fallback.

### Class naming

All CSS classes use the `a1-` prefix. The HTML/CSS package uses two patterns:

| Pattern | File | Usage |
|---------|------|-------|
| `a1-component` + `a1-component-modifier` | `a1-base.css` | Full BEM-style component classes |
| `a1-component` + modifier classes | `a1-pure.css` | Scoped classes for the pure HTML package |

**No single-character or ambiguous class names.** Every class name must be unambiguous without context.

### CSS custom property architecture

Components that have variants or size modifiers use a CSS variable layer:

```css
/* Base component reads from --a1-{component}-* CSS variables */
.a1-button {
  background: var(--a1-button-background, var(--component-button-primary-background));
  min-block-size: var(--a1-button-height, var(--component-button-min-height));
}

/* Variant/size modifier class sets the variable — token fallback, never raw value */
.a1-button-secondary {
  --a1-button-background: var(--component-button-secondary-background);
}

.a1-button-large {
  --a1-button-height: var(--component-button-large-height);
}
```

This lets any combination of modifiers compose without specificity conflicts.

### Naming conventions across packages

| Concept | React prop | CSS class / modifier | Token path |
|---------|-----------|----------------------|------------|
| Size — small | `size="sm"` | `a1-button-small` | `component.button.small.*` |
| Size — medium | `size="md"` (default) | *(no modifier)* | `component.button.*` |
| Size — large | `size="lg"` | `a1-button-large` | `component.button.large.*` |
| Type — primary | `variant="primary"` | *(no modifier)* | `component.button.primary.*` |
| Type — secondary | `variant="secondary"` | `a1-button-secondary` | `component.button.secondary.*` |
| Status — error | `status="error"` | `a1-label-error` | `semantic.color.status.error.*` |
| Status — success | `status="success"` | `a1-label-success` | `semantic.color.status.success.*` |

> **Note:** Field-family components (`Field`, `CheckboxGroup`, `RadioGroup`) use `comfortable / default / compact` for size instead of `sm / md / lg`. Follow the existing convention for the component being built.

---

## Component Architecture

### Source of truth

**The React component is the canonical reference.** The html-css and React Native packages implement the same visual design and interaction model. When adding or updating a component, always start from React and then propagate to the other packages.

### React component structure

```
packages/react/src/components/{component-name}/
├── ComponentName.jsx         Component implementation
├── ComponentName.d.ts        TypeScript types
├── component-name.css        Component styles (imports no other CSS)
└── ComponentName.stories.jsx Storybook stories for all variants
```

### HTML/CSS structure

- **`a1-base.css`** — BEM-style classes for drop-in use on any HTML page.
- **`a1-pure.css`** — Scoped classes for the `a1-pure` example; hand-authored; not generated.

`a1-pure.css` is not generated by any script. Edit it directly when adding classes for the pure package.

### Adding a new component (checklist)

1. **Tokens** — Add component tokens to `system/tokens/component/{name}.json`. Run `npm run build:tokens`.
2. **Rules** — Add design rules to `system/rules/{name}.yaml`.
3. **React** — Create the component in `packages/react/src/components/`. Export from the package index. Follow the existing CSS variable architecture. Design the prop API to be stable — treat the public props as a contract that other packages and agents depend on.
4. **HTML/CSS (base)** — Add the equivalent BEM classes to `packages/html-css/dist/a1-base.css`.
5. **HTML/CSS (pure)** — Add the equivalent scoped classes to `packages/html-css/dist/a1-pure.css`.
6. **Example site** — Add a new page to `examples/a1-pure/` showing all component variants with correct code snippets. Update the navigation on all pages and the index components list.
7. **Labels** — If the component has any UI strings, add them to `system/labels/`.
8. **Storybook** — Ensure the React stories cover all variants, sizes, states, and all supported themes.
9. **Changelog** — Record the addition in the project changelog with the component name, what was added, and what packages were affected.
10. **Theme + breakpoint validation** — Confirm the component renders correctly across all themes (base, a1-light, accessible, heritage) and all breakpoints (xs–xl).
11. **Component registry** — Update `system/ai/components.md` to reflect the new component and which packages it is available in.

The same checklist applies when updating an existing component (steps 1–11 as relevant). Never ship an API change without updating documentation, stories, and examples in the same change.

### Adding a prop to an existing component (mandatory steps)

Every time a new prop is added to any component, all of the following must happen **in the same change** — no exceptions:

1. **JSX** — Add the prop to the component function signature with a default value (or `undefined` if no default). Add it to the relevant `VALID_*` array or guard condition.
2. **CSS** — Add the modifier class(es) the prop maps to in the component's `.css` file.
3. **TypeScript** — Add the prop to the component's `.d.ts` interface with a JSDoc comment describing the valid values and default.
4. **Stories — argType** — Add the prop to `meta.argTypes` in the component's `.stories.jsx` so it appears in the Storybook controls panel with the correct control type (`"inline-radio"`, `"select"`, `"boolean"`, etc.) and all valid options listed.
5. **Stories — story** — Add or update at least one named story that demonstrates the prop's effect. A prop that only appears in the controls panel but has no dedicated story is not documented.
6. **Consumer updates** — If any package, example, or app currently uses the component, update usages to use the new prop where it replaces existing custom CSS or workarounds.
7. **CSS cleanup** — Remove any custom CSS in consuming code that the new prop now replaces.

> **Why stories are non-negotiable:** The Storybook stories are the primary consumer-facing documentation. An undocumented prop is an invisible prop — it will not be discovered or reused by other agents or developers.

---

## Content and Priority Guides

### What Priority Guides are

Priority Guides are pre-approved content documents that define the information hierarchy, labeling, and copy for a screen or component. They represent agreed content — not a starting point for creative rewriting.

### Rules when working from agreed content

- **Do not invent content.** If a label, heading, description, or value is specified in a Priority Guide or JSON data structure, use it exactly. Do not substitute synonyms, reorder items, or collapse sections.
- **Do not omit items.** Every item in an approved content structure must appear in the output. Silently dropping content breaks the contract with the content author.
- **Preserve hierarchy.** The nesting, grouping, and order of a Priority Guide map directly to the visual hierarchy of the resulting UI. Do not flatten, reorder, or restructure without explicit instruction.
- **Flag conflicts explicitly.** If the agreed content conflicts with a system rule (e.g. a label that violates sentence case), flag it rather than silently correcting it. The content owner and system owner must resolve the conflict.

### Using JSON data in components

When a component receives structured JSON data (e.g. navigation items, table rows, form field definitions), treat the data schema as a stable contract. Do not rename keys, change value types, or restructure the shape without coordinating with every consumer of that data.

---

## Package-Specific Rules

### `packages/react`

- All visual properties come from CSS custom properties in the component's `.css` file — not inline styles.
- Component props use camelCase. CSS modifier classes use kebab-case.
- Size prop values: `"sm"`, `"md"`, `"lg"` for most components; `"compact"`, `"default"`, `"comfortable"` for field-family components.
- All icons use Material Symbols Outlined via the `Icon` component — no inline SVGs.
- Components must be accessible: keyboard navigable, screen reader labeled, WCAG AA color contrast.

### `packages/html-css`

- The `dist/` directory is partially generated and partially hand-authored:
  - `a1-light.css`, `a1-accessible.css`, `a1-heritage.css` — **generated** by `scripts/build-html-css.mjs`. Do not edit directly.
  - `a1-base.css` — **hand-authored** BEM classes. Edit directly.
  - `a1-pure.css` — **hand-authored** scoped classes. Edit directly.
- All CSS values must reference `var(--token-name)` — verified against `a1-light.css`.
- No raw number fallbacks in `var()` unless the token is guaranteed to exist. Prefer dropping the fallback entirely once verified.

### `packages/react-native`

- Token values are consumed from `packages/react-native/src/tokens/` (generated TypeScript/JavaScript files).
- Do not hardcode color, spacing, or typography values.

### `examples/a1-pure`

- Uses only `a1-pure.css` (loaded from `packages/html-css/dist/`).
- No inline styles except for demonstration of CSS custom property overrides.
- All markup uses `a1-*` class names — no bare element styling.
- No placeholder attributes on form fields in demos.
- No SVG icons — use Material Symbols via `<span class="a1-icon" aria-hidden="true">name</span>`.
- Always add `aria-hidden="true"` to icons; always add `aria-label` to icon buttons.
- The `<body>` element must have `class="a1-body"` on every demo page.
- Code snippets shown on each page must exactly match the demo markup — they are the canonical usage example.

---

## Key Invariants

These rules cannot be broken regardless of context. They are a union of the [Agent Rules](#agent-rules) above and the technical constraints of the system.

**System first**
1. **Use A1 before building custom.** Components, tokens, patterns, and utilities exist for a reason. Reaching for a custom solution without exhausting system options is a violation of the design contract.
1a. **Layout components before custom CSS.** Before writing `display`, `flex`, `grid`, `gap`, or alignment CSS, check `Stack`, `Grid`, `Cluster`, `Section`, and `Card` first. Custom layout CSS is only justified when no layout component covers the pattern. See the "Layout components before custom CSS" table in [Style and CSS Rules](#style-and-css-rules).

**Values and tokens**
2. **All values from tokens.** No hardcoded colors, sizes, spacing, font values, durations, or radii in any CSS or component file. If the token does not exist, add it — do not work around it.
3. **a1- prefix on everything.** Every CSS class in every package uses the `a1-` prefix.

**Structure and quality**
4. **React is the spec.** HTML/CSS and React Native replicate what React defines — they do not invent their own behavior.
5. **Semantic HTML.** A button is a `<button>`. A link is an `<a>`. Form controls use `<label>`, `<fieldset>`, and `<legend>`. Visual correctness without semantic correctness is not acceptable.
6. **Accessibility is not optional.** Every interactive component needs keyboard support, a visible focus state, WCAG AA color contrast, and appropriate ARIA attributes.
6a. **No nested interactive controls in interactive cards.** When a `<Card>` uses `variant="navigation"` or otherwise makes the whole card clickable, the card contents must be static only. Do not put buttons, links, form controls, menus, tabs, or other interactive elements inside it.
7. **Responsive and theme-safe.** No component is finished until it has been validated at all breakpoints (xs–xl) and under all themes (base, a1-light, accessible, heritage).

**Content**
8. **Preserve agreed content.** Content from Priority Guides, approved JSON, or design specs is not a suggestion. Preserve it exactly — do not invent, reword, reorder, or omit.

**Documentation**
9. **Document every change.** Token additions, API changes, new variants, new themes, and new components all require updated Storybook stories, example pages, and a changelog entry in the same commit.
10. **Code snippets match demos.** The code shown in example pages must be copy-pasteable and produce exactly the result shown.

**Stability**
11. **Stable public contracts.** Component prop APIs, token structures, label paths, and content schemas are contracts consumed by other packages and agents. Do not rename, restructure, or remove them without coordinating all consumers.
12. **Icons are Material Symbols.** No inline SVGs in components or examples. Always use `<span class="a1-icon" aria-hidden="true">name</span>` or the `<Icon>` component.

**Operations**
13. **Build before testing.** After any token or theme change, run `npm run build:tokens && npm run build:html-css` before testing, committing, or declaring the work done.
14. **Keep the AI context current.** When a component is added, removed, renamed, or its package coverage changes, update `system/ai/components.md`. When a system rule, token convention, or workflow changes, update this file (`system/ai/project-context.md`). Stale context is worse than no context — it actively misleads future agents.
