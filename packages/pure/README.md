# A1 HTML/CSS

Pure HTML and CSS output for A1 Design System components.

The generated output contains no JavaScript:

- `dist/index.html`
- `dist/a1-base.css`
- `dist/a1-pure.css`
- `dist/a1-light.css`
- `dist/a1-accessible.css`
- `dist/a1-heritage.css`

## a1-base.css — BEM class package

`a1-base.css` contains shared component classes only. Theme files contain token variables, theme overrides, and embedded dark-mode rules.

Use the base component CSS plus one theme CSS file:

```html
<link rel="stylesheet" href="./a1-base.css">
<link rel="stylesheet" href="./a1-light.css">
<body class="a1-body">
  <button class="a1-button a1-button-primary a1-button-large">Continue</button>
</body>
```

## a1-pure.css — Classless stylesheet

`a1-pure.css` styles standard HTML elements directly from A1 design tokens. No class names required — drop it in and write semantic HTML.

```html
<link rel="stylesheet" href="./a1-pure.css">
<body>
  <header>
    <a href="/">Brand</a>
    <details>
      <summary>&#9776;</summary>
      <nav>
        <a href="/about">About</a>
        <a href="/docs" aria-current="page">Docs</a>
      </nav>
    </details>
  </header>
  <main>
    <section>
      <h1>Page title</h1>
      <p>Body copy styled automatically.</p>
      <button>Primary action</button>
    </section>
  </main>
  <footer>
    <p>Footer content</p>
  </footer>
</body>
```

Elements styled by `a1-pure.css`: `body`, `h1–h6`, `p`, `a`, `strong`, `em`, `code`, `pre`, `kbd`, `mark`, `abbr`, `small`, `ul`, `ol`, `li`, `blockquote`, `cite`, `hr`, `figure`, `figcaption`, `table`, `th`, `td`, `button`, `input`, `select`, `textarea`, `label`, `fieldset`, `legend`, `details`, `summary`, `body > header`, `body > footer`.

Three blockquote variants are driven by semantic context — no classes:

| HTML | Variant |
|---|---|
| `<blockquote>` | Border — left accent rule |
| `<figure><blockquote>` | Feature — display-scale pull quote |
| `<aside><blockquote>` | Accent — filled action background |

The package includes static classes for buttons, typography, sections, cards, badges, banners, empty states, blockquotes, lists, dividers, fields, checkboxes, radio buttons, switches, accordions, tables, breadcrumbs, side navigation, figures, and layout utilities.

Components that require JavaScript to function, such as snackbar, dialog, tabs, segmented controls, menus, and pagination, are intentionally excluded from this pure HTML/CSS package.

Icons are supported with inline SVG, icon fonts, or text glyphs through `.a1-icon` plus component slots such as `.a1-button-icon`, `.a1-badge-icon`, `.a1-banner-icon`, and `.a1-link-icon`.

Section supports token-driven surfaces, padding, gaps, gradients, and content widths:

```html
<section class="a1-section a1-section-surface-panel a1-section-padding-lg a1-section-gap-md">
  <div class="a1-section-inner a1-section-inner-lg">
    ...
  </div>
</section>
```
