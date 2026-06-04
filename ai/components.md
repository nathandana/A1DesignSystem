# A1 Design System — Component Registry

**Keep this file current.** Update it whenever a component is added, removed, renamed, or its package coverage changes. This is part of the component addition checklist in `ai/project-context.md`.

## Package key

| Column | What it covers |
|--------|---------------|
| **React** | `packages/react/src/components/{name}/` |
| **HTML/CSS base** | `packages/html-css/dist/a1-base.css` — BEM classes for general use |
| **HTML/CSS pure** | `packages/html-css/dist/a1-pure.css` — scoped classes for the pure HTML package |
| **React Native** | `packages/react-native/src/components/{Name}/` |
| **Pure example** | `examples/a1-pure/{name}.html` — documented on the example site |

✓ = implemented  · — = not yet implemented

---

## Typography

| Component | React | HTML/CSS base | HTML/CSS pure | React Native | Pure example |
|-----------|:-----:|:-------------:|:-------------:|:------------:|:------------:|
| Heading | ✓ | ✓ | ✓ | ✓ | ✓ |
| Paragraph | ✓ | ✓ | ✓ | ✓ | ✓ |
| Blockquote | ✓ | ✓ | ✓ | ✓ | ✓ |
| List | ✓ | ✓ | ✓ | ✓ | ✓ |
| Divider | ✓ | ✓ | ✓ | — | ✓ |
| Inline (code, kbd, mark) | ✓ | ✓ | ✓ | — | ✓ |

> **HTML/CSS pure notes:** Heading uses `.a1-h1`–`.a1-h6` + `.a1-heading-*` modifiers. Paragraph uses `.a1-p`. List uses `.a1-ul` / `.a1-ol`. Divider uses `.a1-hr`. Inline code uses `.a1-code` / `.a1-pre` / `.a1-kbd` / `.a1-mark`.

---

## Navigation

| Component | React | HTML/CSS base | HTML/CSS pure | React Native | Pure example |
|-----------|:-----:|:-------------:|:-------------:|:------------:|:------------:|
| Link | ✓ | ✓ | ✓ | ✓ | ✓ |
| Breadcrumb | ✓ | ✓ | — | — | — |
| Side Nav | ✓ | ✓ | — | ✓ | — |
| Top Header | ✓ | ✓ | ✓ | — | ✓ |
| Tabs | ✓ | — | — | — | — |
| Page Nav | ✓ | — | — | — | — |

> **HTML/CSS pure notes:** Top Header uses `.a1-header`. Link uses `.a1-link`.

---

## Actions

| Component | React | HTML/CSS base | HTML/CSS pure | React Native | Pure example |
|-----------|:-----:|:-------------:|:-------------:|:------------:|:------------:|
| Button | ✓ | ✓ | ✓ | ✓ | ✓ |
| Icon Button | ✓ | ✓ | ✓ | ✓ | ✓ |
| Switch | ✓ | ✓ | — | — | — |
| Segmented Control | ✓ | — | — | — | — |

> **HTML/CSS pure notes:** Button uses `.a1-button` + `.a1-button-{type}` + `.a1-button-{size}` + `.a1-button-pill`. Icon Button uses `.a1-icon-button`.

---

## Inputs

| Component | React | HTML/CSS base | HTML/CSS pure | React Native | Pure example |
|-----------|:-----:|:-------------:|:-------------:|:------------:|:------------:|
| Field (text, email, password, number, date) | ✓ | ✓ | ✓ | — | ✓ |
| Textarea | ✓ | ✓ | ✓ | — | ✓ |
| Select | ✓ | ✓ | ✓ | — | ✓ |
| Checkbox Group | ✓ | ✓ | ✓ | — | ✓ |
| Radio Group | ✓ | ✓ | ✓ | — | ✓ |
| Fieldset | ✓ | ✓ | ✓ | — | ✓ |
| Switch (input) | ✓ | ✓ | — | — | — |
| Inline Editable | ✓ | — | — | — | — |

> **HTML/CSS pure notes:** Field uses `.a1-label` + `.a1-input` + size modifiers. Form container uses `.a1-form`. Status uses `.a1-label-error` / `.a1-label-success`. Required indicator uses `.a1-required`. Messages use `.a1-message-error` / `.a1-message-success` / `.a1-message-hint`.

---

## Feedback

| Component | React | HTML/CSS base | HTML/CSS pure | React Native | Pure example |
|-----------|:-----:|:-------------:|:-------------:|:------------:|:------------:|
| Banner | ✓ | ✓ | — | ✓ | — |
| Badge / Message | ✓ | ✓ | — | ✓ | — |
| Notification | ✓ | ✓ | — | — | — |
| Snackbar | ✓ | — | — | ✓ | — |
| Empty State | ✓ | ✓ | — | ✓ | — |
| System Banner | ✓ | ✓ | — | — | — |

---

## Layout

| Component | React | HTML/CSS base | HTML/CSS pure | React Native | Pure example |
|-----------|:-----:|:-------------:|:-------------:|:------------:|:------------:|
| Section | ✓ | ✓ | ✓ | ✓ | ✓ |
| Card | ✓ | ✓ | — | ✓ | — |
| Stack | ✓ | ✓ | — | — | — |
| Cluster | ✓ | ✓ | — | — | — |
| Grid | ✓ | ✓ | — | — | — |
| Bleed | ✓ | ✓ | — | — | — |
| Inset | ✓ | ✓ | — | — | — |
| Spacer | ✓ | ✓ | — | — | — |
| Page Layout | ✓ | ✓ | — | — | — |
| Button Container | ✓ | ✓ | — | ✓ | — |
| Figure | ✓ | ✓ | ✓ | — | — |

> **HTML/CSS pure notes:** Section uses `.a1-section`. Footer uses `.a1-footer`. Figure uses `.a1-figure`.

---

## Overlay

| Component | React | HTML/CSS base | HTML/CSS pure | React Native | Pure example |
|-----------|:-----:|:-------------:|:-------------:|:------------:|:------------:|
| Dialog | ✓ | — | — | ✓ | — |
| Menu | ✓ | — | — | — | — |

---

## Data

| Component | React | HTML/CSS base | HTML/CSS pure | React Native | Pure example |
|-----------|:-----:|:-------------:|:-------------:|:------------:|:------------:|
| Data Table | ✓ | ✓ | ✓ | — | ✓ |
| Pagination | ✓ | — | — | ✓ | — |

> **HTML/CSS pure notes:** Data Table uses `.a1-table`.

---

## Media and iconography

| Component | React | HTML/CSS base | HTML/CSS pure | React Native | Pure example |
|-----------|:-----:|:-------------:|:-------------:|:------------:|:------------:|
| Icon | ✓ | ✓ | ✓ | — | ✓ |

> **HTML/CSS pure notes:** Icon uses `.a1-icon` (Material Symbols Outlined, ligature name as text content). Filled variant uses `.a1-icon-filled`.

---

## Disclosure / Accordion

| Component | React | HTML/CSS base | HTML/CSS pure | React Native | Pure example |
|-----------|:-----:|:-------------:|:-------------:|:------------:|:------------:|
| Accordion (React) / Disclosure (pure) | ✓ | ✓ | ✓ | — | ✓ |

> **Naming note:** The React package calls this component "Accordion". The HTML/CSS pure package implements the same concept using the native `<details>` / `<summary>` elements with `.a1-details` — referred to as "Disclosure" in the pure example site.

---

## Maintenance log

Update this section with a one-line entry each time the registry changes.

| Date | Change |
|------|--------|
| 2026-06-04 | Initial registry created from current package state |
