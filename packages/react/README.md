# @gtivr4/a1-design-system-react

React components for the A1 token-driven design system.

## Install

```sh
npm install @gtivr4/a1-design-system-react
```

React 18+ is a peer dependency. The package ships untranspiled ESM + JSX source,
so your bundler must transform `.jsx` inside `node_modules` — Vite 4+ handles
this out of the box.

## Setup

### 1. Import the global CSS once, in this order

```js
import "@gtivr4/a1-design-system-react/tokens.css";       // base :root design tokens — must be first
import "@gtivr4/a1-design-system-react/themes.css";       // optional theme selector overrides
import "@gtivr4/a1-design-system-react/color-scheme.css"; // light/dark modes, inverse scopes, box-model reset
```

`tokens.css` defines every CSS custom property the components read. Without it
nothing is styled correctly.

### 2. Load the fonts

Components use the Material Symbols Outlined icon font and the Inter text face:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block" rel="stylesheet">
```

Branded themes (fresh, crochet, aperture, marshmallow) need their own text
faces — see `guidelines/setup.md` for the full list.

### 3. Configure PostCSS custom media

Component CSS uses `@custom-media` breakpoints. Expand them at build time with
`postcss-custom-media` fed from this package's `breakpoints.css` — the exact
config is in `guidelines/setup.md`. Without it, responsive component behavior
(Grid, Stack, field layouts, and more) is dropped.

## Usage

```jsx
import { Button, Card, Heading, Paragraph } from "@gtivr4/a1-design-system-react";

export function Example() {
  return (
    <Card>
      <Heading as="h2">A1 Design</Heading>
      <Paragraph>A token-driven, component-first design system.</Paragraph>
      <Button>Get started</Button>
    </Card>
  );
}
```

Component styles are imported by each component module.

## Documentation

The `guidelines/` directory ships inside this package:

- `guidelines/Guidelines.md` — hub: quick-start checklist, key rules
- `guidelines/setup.md` — full setup: CSS, fonts, PostCSS, providers
- `guidelines/components.md` — every exported component with key props
- `guidelines/icon-discovery.md` — icon naming, sizes, custom icons
- `guidelines/tokens.md` — token tiers, theming, dark mode
- `guidelines/styles.md` — layout primitives, spacing, breakpoints
