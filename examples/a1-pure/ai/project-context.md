## A1 Pure Example Site

This site demonstrates every component in the `a1-pure.css` package using plain HTML with no JavaScript framework. It is the canonical reference for correct `a1-pure.css` markup.

### Rules

- **One page per component.** Each component has its own HTML file (e.g. `button.html`, `forms.html`). Add a new page when a new component is added to `a1-pure.css`.
- **All markup uses `a1-*` classes.** No bare element styling. No custom CSS.
- **No placeholders on form inputs.** Labels communicate the field purpose; placeholders are not needed.
- **No SVG icons.** Use `<span class="a1-icon" aria-hidden="true">icon_name</span>` with Material Symbols ligature names.
- **No inline styles** except to demonstrate CSS custom property overrides (e.g. icon size, icon fill).
- **`<body class="a1-body">`** on every page — this applies the base font, color, and background.
- **Code snippets are the truth.** Every `<pre class="a1-pre">` snippet must exactly match the demo above it. A reader should be able to copy the snippet and get the result shown.
- **All variants shown.** Every section must show the full range of a component's variants, sizes, and states. A visitor should not need to look elsewhere to understand the component.

### Page structure

Each page follows this HTML structure:

```html
<body class="a1-body">
  <header class="a1-header"> ... </header>
  <main>
    <section class="a1-section"> <!-- Intro: h1 + description --> </section>
    <section class="a1-section"> <!-- Variant 1: h2 + figure demo + pre snippet --> </section>
    ...
  </main>
  <footer class="a1-footer"> ... </footer>
</body>
```

### Navigation

Every page must have the full nav in both desktop (`<nav>`) and mobile (`<details><nav>`) formats. The current page link has `aria-current="page"`.

Current pages (in nav order): Overview, Typography, Button, Link, Icon, Forms, Checkbox, Disclosure, Table.

### Updating after CSS changes

When `a1-pure.css` gains a new class or variant:
1. Add a demo section to the relevant page (or create a new page if it is a new component).
2. Update the code snippet to match the demo exactly.
3. Update the index page components list if a new page was added.
4. Update the nav on every page if a new page was added.
