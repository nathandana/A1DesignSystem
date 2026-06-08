## React Package

This package is the canonical source of truth for A1 component behavior, API, and visual design.

### File structure per component

```
src/components/{component-name}/
├── ComponentName.jsx         Component logic and JSX
├── ComponentName.d.ts        TypeScript prop types
├── component-name.css        Component CSS — no imports, all values from tokens
└── ComponentName.stories.jsx Storybook stories covering every variant and state
```

### CSS rules

- Import only `./component-name.css` from the component file — no cross-component CSS imports.
- Every property value comes from a `var(--token-name)` reference. Verify the token exists in `packages/pure/dist/a1-light.css` before using it.
- Use the CSS variable architecture for variants: the base class reads `--a1-{component}-*` variables; variant modifier classes set those variables.
- Do not use `!important`. Do not use inline styles.

### Props and variants

- Size prop values: `"sm"` | `"md"` | `"lg"` for most components.
- Field-family components (Field, CheckboxGroup, RadioGroup) use `"compact"` | `"default"` | `"comfortable"`.
- Status prop values: `"error"` | `"success"` | `"warning"` | `"info"` where applicable.
- Variant prop values: `"primary"` | `"secondary"` | `"tertiary"` | `"destructive"` | `"success"` for buttons and icon buttons.
- Provide sensible defaults for all props. Never require more than the minimum needed to render.

### Icons

- Use `<Icon name="..." />` — the `Icon` component wraps Material Symbols Outlined.
- Never use inline SVGs.
- Always mark decorative icons with `aria-hidden="true"` in the Icon component.
- Icon-only interactive elements must have an accessible name via `aria-label`.

### Accessibility

- All interactive components must be keyboard navigable.
- Focus states use `--component-button-focus-ring` (or the component-specific focus token).
- Use semantic HTML elements — `<button>` for actions, `<a>` for navigation.
- When a Card is interactive, such as `variant="navigation"`, do not place any nested interactive elements inside it.
- Group related form controls with `<fieldset>` and `<legend>`.
- Announce dynamic state changes with appropriate ARIA attributes.

### Storybook stories

- Cover every variant, size, and interactive state (default, hover, focus, disabled, error, success).
- Use realistic content — not Lorem ipsum or placeholder text.
- One story per meaningful state combination; do not create a story for every possible prop combination.
