# A1 Design System — Setup

How to install and configure `@gtivr4/a1-design-system-react` in a consuming
project. Read `Guidelines.md` first for the hub and key rules.

---

## Install

```sh
npm install @gtivr4/a1-design-system-react
```

**Peer dependency:** React 18 or later.

**Bundler requirement:** the package ships untranspiled ESM + JSX source
(`main` points at `src/index.js`, which re-exports `.jsx` modules). Your
bundler must transform `.jsx` files inside `node_modules`:

- **Vite 4+** — works out of the box (esbuild transforms `.jsx` everywhere with
  the automatic JSX runtime).
- **webpack / other** — extend your JSX loader rule to include this package
  (do not exclude `node_modules/@gtivr4`).

---

## Required CSS imports

Import once at your app entry point, in this order:

```js
import "@gtivr4/a1-design-system-react/tokens.css";
import "@gtivr4/a1-design-system-react/themes.css";
import "@gtivr4/a1-design-system-react/color-scheme.css";
```

| File | Provides | Required? |
|---|---|---|
| `tokens.css` | Every design token as a `:root` CSS custom property (color, spacing, typography, radii, shadows, component dimensions). **Must be first.** | Yes — components are unstyled without it |
| `themes.css` | `.a1-theme-*` selector overrides (heritage, accessible, fresh, crochet, aperture, marshmallow, catlympics) | Only if you activate a non-default theme |
| `color-scheme.css` | Light/dark mode switching, `.a1-inverse` scopes, global `box-sizing: border-box` reset, contrast/reduced-motion handling | Yes |

Per-component CSS is imported by each component module — no extra imports needed.

Optional utilities:

```js
import "@gtivr4/a1-design-system-react/utilities/spacing.css"; // .a1-p-*/.a1-m-* padding/margin classes
import "@gtivr4/a1-design-system-react/utilities/width.css";   // .a1-max-w-*/.a1-min-w-* width constraints
import "@gtivr4/a1-design-system-react/utilities/sr-only.css"; // visually-hidden helper
```

---

## PostCSS custom media (required)

Component CSS uses `@custom-media` breakpoint queries (e.g.
`@media (--bp-md-up)`). These are a CSS draft feature and must be expanded at
build time or browsers drop the rules — responsive behavior in Grid, Stack,
field layouts, SideNav, and others silently breaks.

Add a `postcss.config.mjs` at your project root:

```js
import postcssGlobalData from "@csstools/postcss-global-data";
import postcssCustomMedia from "postcss-custom-media";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const breakpoints = require.resolve("@gtivr4/a1-design-system-react/breakpoints.css");

export default {
  plugins: [
    postcssGlobalData({ files: [breakpoints] }),
    postcssCustomMedia(),
  ],
};
```

```sh
npm install -D postcss-custom-media @csstools/postcss-global-data
```

Vite picks up `postcss.config.mjs` automatically.

---

## Fonts

Nothing in the package embeds fonts — the host page must load them.

**Always required:**

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block" rel="stylesheet">
```

**Default themes (base / light / dark / accessible / heritage)** use Inter with
system-font fallbacks:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet">
```

**Branded themes** need additional faces:

| Theme | Text faces |
|---|---|
| `fresh` | Nunito, Libre Baskerville |
| `crochet` | Fraunces, Libre Baskerville, Roboto Slab |
| `aperture` | Pinyon Script, Playfair Display, Manrope |
| `marshmallow` | Varela Round, Nunito |

If a face isn't loaded, the token's fallback stack renders instead — the app
works but loses the theme's typographic character.

---

## Providers

No provider is required for default usage. `LabelsProvider` is optional:

- Every built-in UI string (close buttons, pagination labels, table controls,
  etc.) has an English default baked into the components.
- To localize or override strings, wrap your app in `LabelsProvider` and pass a
  `labels` object plus optional `locale` / `brand`:

```jsx
import { LabelsProvider } from "@gtivr4/a1-design-system-react";

<LabelsProvider locale="es" labels={labels}>
  <App />
</LabelsProvider>
```

The `labels` object follows the A1 label format: nested categories under a
`label` root, each leaf carrying `$value` (English) and optional
`locale`/`brand` maps. The label source JSON is not bundled with this package —
bring your own translations in that shape.

---

## Activating a theme

Add the theme class to `<html>` (or any container to scope it):

```html
<html class="a1-theme-heritage">
```

See `tokens.md` for the full theme list, dark mode, and the `<Inverse>` scope
contract.

---

## Checklist

1. `npm install @gtivr4/a1-design-system-react`
2. Import `tokens.css`, `themes.css`, `color-scheme.css` (in that order)
3. Load Material Symbols Outlined + Inter (+ branded-theme faces if used)
4. Configure `postcss-custom-media` with the package's `breakpoints.css`
5. Import components: `import { Button } from "@gtivr4/a1-design-system-react"`
6. Optional: `LabelsProvider` for localization, utility CSS for spacing/width helpers
