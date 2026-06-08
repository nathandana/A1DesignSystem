# A1 Design System — Accessibility Check Policy

## When a change is accessibility-relevant

Any task that touches the following must be identified as accessibility-relevant before finishing:

- Color or contrast tokens
- Focus styles or focus ring tokens
- Hover, active, disabled, loading, error, or selected states
- Keyboard behavior or key event handlers
- ARIA attributes (`aria-label`, `aria-expanded`, `aria-controls`, `role`, etc.)
- Accessible names on interactive elements
- Form labeling, description, or error association
- Dialog, menu, tabs, accordion, combobox, tooltip, toast, or data table behavior
- Theme support (any theme file or theme token)
- Responsive behavior that affects interactive controls
- Content truncation or overflow that could hide interactive elements

## Default behavior

| Change type | Action |
|-------------|--------|
| Copy-only | Do not run a11y checks |
| Visual-only (layout, spacing, color not affecting contrast) | Offer a focused check |
| Any item from the list above | Ask: "Do you want me to run the focused accessibility check for this component?" |
| Component release, build verification, or public docs update | Recommend the full report |

Run the check **automatically without asking** only when:
- The user explicitly requested it, OR
- The task directly changes ARIA, keyboard behavior, focus handling, theme tokens, or color tokens.

## Commands

```
npm run a11y:component <name>   # focused check for one component
npm run a11y:changed             # check only stories changed in current diff
npm run a11y:playwright          # keyboard interaction tests (Menu, Dialog, Tabs, Accordion, Breadcrumb)
npm run a11y:report              # regenerate reports/a11y.md + reports/a11y.json from last scan
npm run test:qa                  # full suite: axe + visual regression + report
```

## What the report covers

The QA scan runs axe-core (WCAG 2.0 / 2.1 / 2.2 Levels A & AA) against every Storybook story in the default theme. Results are written to:

- `reports/a11y.json` — structured data imported by the a1-web Accessibility page
- `reports/a11y.md` — committable Markdown summary
- `reports/a11y.html` — browsable HTML report

The a1-web page at `/?page=accessibility` displays the live report. Re-run `npm run test:qa` after contrast or component fixes to refresh it.

## What automation cannot prove

Automated tools catch roughly 30–57% of WCAG issues. These areas always require manual review:

- Screen reader announcement quality and wording
- Cognitive load and appropriateness of error messages
- Motion sensitivity in animated transitions
- Error recovery paths and contextual guidance
- Complex live-region behavior (toasts, status updates)
- Meaningful alt text and link text in context
- Keyboard model appropriateness per interaction pattern
