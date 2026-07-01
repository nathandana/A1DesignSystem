# A1 Design System — Workflows and Rules

This file covers implementation rules and change workflows. Read it with `packages/react/ai/project-context.md` before editing CSS, components, examples, package code, or system rules.

---

## Style and CSS Rules

### The law: fix styling through component props, not custom CSS

**When something looks wrong — wrong spacing, wrong gap, wrong alignment, wrong surface colour — the answer is always a component prop, not a new CSS rule.** Before writing any CSS to fix a perceived styling issue:

1. Check whether the component has a prop that controls the property (`gap`, `padding`, `surface`, `align`, `size`, etc.).
2. Check whether a layout wrapper (`Stack`, `Grid`, `Section`, `Inset`) is missing or needs a different prop value.
3. Check whether the token that drives the property is the wrong one — fix it at the token level, not by overriding in local CSS.

Writing a local CSS rule that patches a visual issue without using the component prop is a violation of the design contract. It creates invisible overrides that break when themes change, that future agents will not find, and that prevent the system from working as designed. **If no prop exists for the property you need, add the prop to the component — do not patch it in consuming CSS.**

### The law: layout components before custom CSS

**Before writing any `display`, `flex`, `grid`, `gap`, `align-items`, or `justify-content` CSS, check whether a layout component already covers the pattern:**

| Need | Use |
|------|-----|
| Column stack with gap | `<Stack direction="column" gap="...">` |
| Row cluster | `<Stack direction="row" gap="...">` or `<Cluster>` |
| Multi-column grid | `<Grid columns={...} gap="...">` |
| Section with padding, surface, gradient | `<Section padding="..." surface="..." gradient="...">` |
| Constrained-width content column | `<Section contentWidth="...">` |
| Full-viewport-height section | `<Section height="screen">` |
| Dark/inverse island | `<Section inverse>` or `<Inverse>` |
| Card content layout | `<Stack>` inside `<Card>` |

Custom `display: flex` or `display: grid` CSS is only justified when no layout component supports the pattern and the pattern is genuinely unique to that context. Document why in a comment.

### The law: never uppercase text

**Never convert text to all-uppercase — anywhere, in any package, by any mechanism.** This applies to:

- **CSS:** never use `text-transform: uppercase` (or `lowercase`/`capitalize`) on content text. Screen readers may spell out individual letters, and it breaks localized strings.
- **JS/JSX:** never call `.toUpperCase()` (or equivalent) on a whole word, label, heading, button text, badge, or any user-facing string.
- **Content:** author labels and headings in sentence case directly ("Create account", not "Create Account" or "CREATE ACCOUNT").

**The only permitted casing transform** is capitalizing the *first letter* of a single token to produce sentence case from a lowercase enum value (e.g. `value.charAt(0).toUpperCase() + value.slice(1)` to turn `"compact"` into `"Compact"` for a control label). Title-casing or upper-casing entire words is not allowed.

If a design or brand asset shows uppercase text, treat it as a visual style to be rejected — flag it rather than reproducing it.

### The law: all values from tokens

**Never hardcode visual values.** Every color, spacing unit, font size, border radius, shadow, and duration must reference a CSS custom property that maps to a Style Dictionary token. Raw fallback values in CSS (e.g. `var(--token, 8px)`) are acceptable only for tokens that are guaranteed to exist — always verify in `packages/pure/dist/a1-light.css` before adding a fallback.

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
4. **HTML/CSS (base)** — Add the equivalent BEM classes to `packages/pure/dist/a1-base.css`.
5. **HTML/CSS (pure)** — Add the equivalent scoped classes to `packages/pure/dist/a1-pure.css`.
6. **Example site** — Add a new page to `examples/a1-pure/` showing all component variants with correct code snippets. Update the navigation on all pages and the index components list.
7. **Labels** — If the component has any UI strings, add them to `system/labels/` with English `$value`, `$description`, and supported `locale` translations (`es`, `fr`, `de`, `pt`, `ja`, `zh`, `ar`) unless there is an explicit translation-blocking decision.
8. **Storybook** — Ensure the React stories cover all variants, sizes, states, and all supported themes.
9. **a1-web configurator** — Add (or update) the component's page and interactive **configurator** under `apps/a1-web/src/pages/components/` so **every prop is adjustable in the live editor** and the generated code snippet stays correct, and register the page in the Components menu (`apps/a1-web/src/pages/Components.jsx`) per the menu hierarchy in `components.md`. A component or prop that isn't in the a1-web configurator is invisible to the people building with the editor.
10. **Changelog** — Record the addition in every affected project/package/app changelog that exists, including `changelog.md` or `CHANGELOG.md`, with the component name, what was added, and what packages were affected.
11. **Theme + breakpoint validation** — Confirm the component renders correctly across all themes (base, a1-light, accessible, heritage) and all breakpoints (xs–xl).
12. **Component registry** — Update `packages/react/ai/components.md` to reflect the new component and which packages it is available in.

The same checklist applies when updating or removing an existing component (steps 1–12 as relevant). Never ship an API change, feature addition, or feature removal without updating documentation, stories, examples, the **a1-web configurator**, and relevant changelogs in the same change.

### Adding a prop to an existing component (mandatory steps)

Every time a new prop is added to any component, all of the following must happen **in the same change** — no exceptions:

1. **JSX** — Add the prop to the component function signature with a default value (or `undefined` if no default). Add it to the relevant `VALID_*` array or guard condition.
2. **CSS** — Add the modifier class(es) the prop maps to in the component's `.css` file.
3. **TypeScript** — Add the prop to the component's `.d.ts` interface with a JSDoc comment describing the valid values and default.
4. **Stories — argType** — Add the prop to `meta.argTypes` in the component's `.stories.jsx` so it appears in the Storybook controls panel with the correct control type (`"inline-radio"`, `"select"`, `"boolean"`, etc.) and all valid options listed.
5. **Stories — story** — Add or update at least one named story that demonstrates the prop's effect. A prop that only appears in the controls panel but has no dedicated story is not documented.
6. **a1-web configurator** — Expose the new prop in the component's a1-web configurator: add a control for it in the **Configure** panel (and a row in the **Properties** table) under `apps/a1-web/src/pages/components/` so it's adjustable in the live editor and reflected in the emitted code snippet. **Give the control helper text** that explains the prop, wired through the shared **Helper-text switch** — pass it via the `helper` prop on the shared kit controls (driven by `ConfigHelpContext` / `WithHelp`) so it appears only when the user turns Helper text on. Never use a raw always-on `hint` for prop guidance; if a control doesn't yet support `helper`, add that support rather than bypassing the switch. A prop that isn't wired into the configurator — with switch-linked helper text — is invisible to the people building with the editor; this step is **not optional**.
7. **Consumer updates** — If any package, example, or app currently uses the component, update usages to use the new prop where it replaces existing custom CSS or workarounds.
8. **CSS cleanup** — Remove any custom CSS in consuming code that the new prop now replaces.

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
- Icons render through the `Icon` component. Unprefixed names use Material Symbols Outlined; browser-registered project icons use `custom:<name>`. Do not render inline SVGs in product components.
- Components must be accessible: keyboard navigable, screen reader labeled, WCAG AA color contrast.

### `packages/pure`

- The `dist/` directory is partially generated and partially hand-authored:
  - `a1-light.css`, `a1-accessible.css`, `a1-heritage.css` — **generated** by `scripts/build-html-css.mjs`. Do not edit directly.
  - `a1-base.css` — **generated** by `scripts/build-html-css.mjs` (the `componentCss()` template). Do not edit the dist file — edit the CSS template inside the script and rebuild, or `npm run build:html-css` will silently overwrite your change.
  - `a1-pure.css` — **hand-authored** scoped classes. Edit directly.
- All CSS values must reference `var(--token-name)` — verified against `a1-light.css`.
- No raw number fallbacks in `var()` unless the token is guaranteed to exist. Prefer dropping the fallback entirely once verified.

### `packages/react-native`

- Token values are consumed from `packages/react-native/src/tokens/` (generated TypeScript/JavaScript files).
- Do not hardcode color, spacing, or typography values.

### `examples/a1-pure`

- Uses only `a1-pure.css` (loaded from `packages/pure/dist/`).
- No inline styles except for demonstration of CSS custom property overrides.
- All markup uses `a1-*` class names — no bare element styling.
- No placeholder attributes on form fields in demos.
- No inline SVG icons — use the icon component or the corresponding icon-font class.
- Always add `aria-hidden="true"` to icons; always add `aria-label` to icon buttons.
- The `<body>` element must have `class="a1-body"` on every demo page.
- Code snippets shown on each page must exactly match the demo markup — they are the canonical usage example.

---

## Key Invariants

These rules cannot be broken regardless of context. They are a union of the Agent Rules in `packages/react/ai/project-context.md` and the technical constraints of the system.

**System first**
1. **Use A1 before building custom.** Components, tokens, patterns, and utilities exist for a reason. Reaching for a custom solution without exhausting system options is a violation of the design contract.
1a. **Layout components before custom CSS.** Before writing `display`, `flex`, `grid`, `gap`, or alignment CSS, check `Stack`, `Grid`, `Cluster`, `Section`, and `Card` first. Custom layout CSS is only justified when no layout component covers the pattern. See the "Layout components before custom CSS" table in [Style and CSS Rules](#style-and-css-rules).
1b. **Fix styling through component props, not local CSS.** When something looks wrong, the answer is a component prop or the correct layout wrapper — not a new CSS rule. Writing local CSS to patch a spacing, gap, alignment, or colour issue is forbidden. If the component lacks the prop you need, add the prop. See "The law: fix styling through component props, not custom CSS" in [Style and CSS Rules](#style-and-css-rules).

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
8a. **Never uppercase text.** No `text-transform: uppercase` in any CSS and no `.toUpperCase()` on whole strings in any JS/JSX, in any package. Author content in sentence case. The only allowed transform is capitalizing the first letter of a single enum token for a sentence-case label. See "The law: never uppercase text" in [Style and CSS Rules](#style-and-css-rules).

**Documentation**
9. **Document every change.** Token additions, API changes, new variants, new themes, new components, feature additions, and feature removals all require updated Storybook stories, example pages, documentation, and changelog entries in the same commit.
9a. **Update every relevant changelog.** When a project, package, or app has a `changelog.md` or `CHANGELOG.md`, add an entry as features are added or removed. When a change resolves a **backlog ticket** (the a1-web Backlog), include that ticket's reference — `(A1-<n>)`, the `ticketRef` from `apps/a1-web/src/services/backlog/types.ts` — right after the entry's bold lead title, e.g. `- **Help page — PageNav** (A1-106) — …`. Find the number in `backlog/BACKLOG.md` (or the Backlog page). Direct requests with no ticket get no reference.
9b. **Update the a1-web configurator.** Whenever a component is **added**, or a prop/variant/state is **added or changed**, wire it into that component's a1-web configurator (`apps/a1-web/src/pages/components/`) in the same change — a control in the Configure panel, a row in the Properties table, a correct code snippet, and **helper text linked to the Helper-text switch** (the `helper` prop on the shared kit controls, gated by `ConfigHelpContext` — not a raw always-on hint). An option that isn't in the configurator can't be used in the live editor. See the configurator steps in "Adding a new component" and "Adding a prop to an existing component" above.
10. **Code snippets match demos.** The code shown in example pages must be copy-pasteable and produce exactly the result shown.

**Stability**
11. **Stable public contracts.** Component prop APIs, token structures, label paths, and content schemas are contracts consumed by other packages and agents. Do not rename, restructure, or remove them without coordinating all consumers.
12. **Icons use the shared icon runtime.** No inline SVGs in components or examples. Use `<Icon>` with a Material Symbols name or a registered `custom:<name>` project icon.

**Operations**
13. **Build before testing.** After any token or theme change, run `npm run build:tokens && npm run build:html-css` before testing, committing, or declaring the work done.
14. **Keep the AI context current.** When a component is added, removed, renamed, or its package coverage changes, update `packages/react/ai/components.md`. When a system rule, token convention, or workflow changes, update the relevant `packages/react/ai/` context file. Stale context is worse than no context — it actively misleads future agents.
