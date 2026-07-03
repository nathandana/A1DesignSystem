## Pure Package

This package provides two CSS distributions that implement the A1 design system without JavaScript.

### dist/ file map

| File | Authored | Contents |
|------|----------|----------|
| `a1-light.css` | Generated | Semantic + component tokens for the light theme |
| `a1-accessible.css` | Generated | Token overrides for the accessible theme |
| `a1-heritage.css` | Generated | Token overrides for the heritage theme |
| `a1-base.css` | Generated | Full BEM component classes for general use — authored as the `componentCss()` template inside `scripts/build-html-css.mjs`; edit the script, not this file |
| `a1-pure.css` | Hand-authored | Scoped `a1-*` classes; `@import`s `a1-light.css` for tokens |
| `index.html` | Hand-authored | Quick-reference demo of all base classes |

**Never edit the generated files directly.** Token and theme changes go in `system/` and are rebuilt via `npm run build:html-css`.

### a1-base.css rules

- BEM classes: `a1-block`, `a1-block__element`, `a1-block--modifier`.
- Newer components use flat modifier classes: `a1-button`, `a1-button-secondary`, `a1-button-large`.
- All values from `var(--token-name)`. Verify in `a1-light.css` before using.
- Use CSS variable architecture for variants — base class reads `--a1-{component}-*`; modifiers set them.

### a1-pure.css rules

- This file is the CSS backing the `examples/a1-pure/` demo site.
- Every component in the pure package must have its class in this file.
- When the React package gains a new component or variant, replicate it here.
- `@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:...')` is already present — do not add another font import.
- Class organization order: body, page layout, header, footer, headings, paragraph, link, icon, code, lists, blockquote, divider, figure, table, button, icon-button, form, form fields, fieldset, disclosure, reduced motion.
- The `.a1-form` container uses `--semantic-spacing-gap-md` for field gap.

### Verifying token existence

Before referencing any CSS custom property in either base or pure:

```bash
grep "property-name" packages/pure/dist/a1-light.css
```

If it is not there, the token must be added to `system/tokens/` and the package rebuilt.
