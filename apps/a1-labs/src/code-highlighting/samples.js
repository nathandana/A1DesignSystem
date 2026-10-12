// Sample snippets for the code highlighting study. Each language has a plain
// sample and a diff of it ("+ " added, "- " removed, "  " unchanged).

export const SAMPLES = {
  jsx: `import { Button, Stack } from '@gtivr4/a1-design-system-react'

// Save a draft, then confirm with a snackbar. Long lines in this sample check how wrapping keeps line numbers aligned with their content.
export function SaveBar({ draft, onSave }) {
  const [saving, setSaving] = useState(false)
  const label = saving ? 'Saving…' : 'Save draft'

  async function handleSave() {
    setSaving(true)
    await onSave(draft.id, { retries: 3, notify: true, message: 'Your draft was saved and will be available to everyone on the project team.' })
    setSaving(false)
  }

  return (
    <Stack direction="row" gap={12}>
      <Button variant="primary" loading={saving} onClick={handleSave}>
        {label}
      </Button>
    </Stack>
  )
}`,
  css: `/* Card surface with a hover lift */
.a1-card {
  padding: var(--base-spacing-16);
  border: 1px solid var(--semantic-color-border-subtle);
  border-radius: 8px;
  background: #ffffff;
  transition: box-shadow 150ms ease-out;
  font-family: var(--semantic-font-family-body), system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.a1-card:hover,
.a1-card:focus-within {
  box-shadow: var(--semantic-shadow-md) !important;
}

@media (min-width: 640px) {
  .a1-card > .a1-card__media {
    aspect-ratio: 16 / 9;
  }
}`,
  html: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Order summary</title>
  </head>
  <body class="a1-body">
    <!-- Totals update when the cart changes, including discounts, delivery charges and any gift cards applied at checkout -->
    <main id="main">
      <h1 class="a1-h1">Your order</h1>
      <p class="a1-p" data-summary="subtotal">Subtotal &mdash; <strong>$48.00</strong>, before delivery and any discounts you add at checkout</p>
      <button type="submit" class="a1-button" disabled>Place order</button>
    </main>
  </body>
</html>`,
  json: `{
  "name": "@gtivr4/a1-design-system-react",
  "version": "0.32.0",
  "description": "React components, tokens and patterns for the A1 Design System, with light and dark modes and thirteen themes.",
  "private": false,
  "sideEffects": ["*.css"],
  "peerDependencies": {
    "react": ">=18.0.0"
  },
  "a1": {
    "themes": 13,
    "tokens": 1586,
    "deprecated": null
  }
}`,
}

export const DIFFS = {
  jsx: `  export function SaveBar({ draft, onSave }) {
    const [saving, setSaving] = useState(false)
-   const label = saving ? 'Saving' : 'Save'
+   const label = saving ? 'Saving…' : 'Save draft'

    async function handleSave() {
      setSaving(true)
-     await onSave(draft.id)
+     await onSave(draft.id, { retries: 3, notify: true, message: 'Your draft was saved and will be available to everyone on the project team.' })
      setSaving(false)
    }`,
  css: `  .a1-card {
-   padding: 16px;
+   padding: var(--base-spacing-16);
    border-radius: 8px;
-   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
+   transition: box-shadow 150ms ease-out;
  }`,
  html: `  <main id="main">
-   <h1>Your order</h1>
+   <h1 class="a1-h1">Your order</h1>
    <p>Subtotal &mdash; <strong>$48.00</strong></p>
-   <button>Place order</button>
+   <button type="submit" class="a1-button" disabled>Place order</button>
  </main>`,
  json: `  {
    "name": "@gtivr4/a1-design-system-react",
-   "version": "0.31.0",
+   "version": "0.32.0",
    "a1": {
-     "themes": 12
+     "themes": 13,
+     "tokens": 1586
    }
  }`,
}

// A one-line sample per language for the inline variant.
export const INLINE = {
  jsx: `const total = items.length * 2`,
  css: `gap: var(--base-spacing-8);`,
  html: `<a href="/docs" class="a1-link">Docs</a>`,
  json: `{ "enabled": true, "limit": 50 }`,
}
