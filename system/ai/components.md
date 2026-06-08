# A1 Design System — Component Registry

**Keep this file current.** Update it whenever a component is added, removed, renamed, or its package coverage changes. This is part of the component addition checklist in `system/ai/project-context.md`.

## Package key

| Column | What it covers |
|--------|---------------|
| **React** | `packages/react/src/components/{name}/` |
| **Native** | `packages/react-native/src/components/{Name}/` |
| **Pure** | `packages/pure/dist/a1-pure.css` — scoped HTML/CSS classes |

✓ = implemented  · — = not yet implemented

---

## A1 Web menu hierarchy

The a1-web Components menu is defined from this registry. Keep the order, category names, and selected Material Symbols icon names aligned with this table when updating `apps/a1-web/src/pages/Components.jsx`.

| Menu level | Route ID | Label | Selected icon | Children |
|------------|----------|-------|---------------|----------|
| Overview | `components` | Components | `widgets` | Component categories |
| Category | `components-typography` | Typography | `title` | Heading, Paragraph, Blockquote, List, Code, Divider, Inline |
| Category | `components-navigation` | Navigation | `near_me` | Link, Breadcrumb, Side Nav, Top Header, Tabs, Page Nav |
| Category | `components-actions` | Actions | `touch_app` | Button, Icon Button, Switch, Segmented Control |
| Category | `components-inputs` | Inputs | `edit_note` | Field, Textarea, Select, Checkbox Group, Radio Group, Fieldset, Inline Editable |
| Category | `components-feedback` | Feedback | `campaign` | Banner, Message, Notification, Snackbar, Empty State, System Banner |
| Category | `components-layout` | Layout | `dashboard` | Section, Card, Stack, Cluster, Grid, Bleed, Inset, Spacer, Page Layout, Button Container, Figure |
| Category | `components-overlay` | Overlay | `web_asset` | Dialog, Menu |
| Category | `components-data` | Data | `table_chart` | Data Table, Pagination, Calendar |
| Category | `components-media-iconography` | Media and iconography | `insert_photo` | Icon |
| Category | `components-disclosure` | Disclosure | `unfold_more` | Accordion |

**Routing rules:**
- Category pages use `components-{category-id}`.
- Component pages use `component-{component-id}`.
- If a component appears in more than one registry table, keep one canonical a1-web component page and avoid duplicate route IDs.

---

## Typography

| Component | React | Native | Pure |
|-----------|:-----:|:------:|:----:|
| Heading | ✓ | ✓ | ✓ |
| Paragraph | ✓ | ✓ | ✓ |
| Blockquote | ✓ | ✓ | ✓ |
| List | ✓ | ✓ | ✓ |
| Code | ✓ | — | — |
| Divider | ✓ | — | ✓ |
| Inline (kbd, mark, and semantic inline text) | ✓ | — | ✓ |

> **Pure notes:** Heading uses `.a1-h1`–`.a1-h6` + `.a1-heading-*` modifiers. Paragraph uses `.a1-p`. List uses `.a1-ul` / `.a1-ol`. Divider uses `.a1-hr`. Inline code uses `.a1-code` / `.a1-pre` / `.a1-kbd` / `.a1-mark`.
>
> **React Code props:** `variant` ("inline" | "block", default "inline"), `wrapping` (boolean), `copyCode` (boolean), `copyText` (optional clipboard override). Copy affordance uses the standard `content_copy` icon and code labels from `system/labels/code.json`.

---

## Navigation

| Component | React | Native | Pure |
|-----------|:-----:|:------:|:----:|
| Link | ✓ | ✓ | ✓ |
| Breadcrumb | ✓ | — | — |
| Side Nav | ✓ | ✓ | — |
| Top Header | ✓ | — | ✓ |
| Tabs | ✓ | — | — |
| Page Nav | ✓ | — | — |

> **Pure notes:** Top Header uses `.a1-header`. Link uses `.a1-link`.

---

## Actions

| Component | React | Native | Pure |
|-----------|:-----:|:------:|:----:|
| Button | ✓ | ✓ | ✓ |
| Icon Button | ✓ | ✓ | ✓ |
| Switch | ✓ | — | — |
| Segmented Control | ✓ | — | — |

> **Pure notes:** Button uses `.a1-button` + `.a1-button-{type}` + `.a1-button-{size}` + `.a1-button-pill`. Icon Button uses `.a1-icon-button`.

---

## Inputs

| Component | React | Native | Pure |
|-----------|:-----:|:------:|:----:|
| Field (text, email, password, number, date) | ✓ | — | ✓ |
| Textarea | ✓ | — | ✓ |
| Select | ✓ | — | ✓ |
| Checkbox Group | ✓ | — | ✓ |
| Radio Group | ✓ | — | ✓ |
| Fieldset | ✓ | — | ✓ |
| Switch (input) | ✓ | — | — |
| Inline Editable | ✓ | — | — |

> **Pure notes:** Field uses `.a1-label` + `.a1-input` + size modifiers. Form container uses `.a1-form`. Status uses `.a1-label-error` / `.a1-label-success`. Required indicator uses `.a1-required`. Messages use `.a1-message-error` / `.a1-message-success` / `.a1-message-hint`.

---

## Feedback

| Component | React | Native | Pure |
|-----------|:-----:|:------:|:----:|
| Banner | ✓ | ✓ | — |
| Badge / Message | ✓ | ✓ | — |
| Notification | ✓ | — | — |
| Snackbar | ✓ | ✓ | — |
| Empty State | ✓ | ✓ | — |
| System Banner | ✓ | — | — |

---

## Layout

| Component | React | Native | Pure |
|-----------|:-----:|:------:|:----:|
| Section | ✓ | ✓ | ✓ |
| Card | ✓ | ✓ | — |
| Stack | ✓ | — | — |
| Cluster | ✓ | — | — |
| Grid | ✓ | — | — |
| Bleed | ✓ | — | — |
| Inset | ✓ | — | — |
| Spacer | ✓ | — | — |
| Page Layout | ✓ | — | — |
| Button Container | ✓ | ✓ | — |
| Figure | ✓ | — | ✓ |

> **Pure notes:** Section uses `.a1-section`. Footer uses `.a1-footer`. Figure uses `.a1-figure`.
>
> **Card props:** `icon` renders a small tokenized icon block above card content (`.a1-card__icon`). `heroIcon` renders a full-bleed colored header area (`.a1-card__hero`). Use these props instead of custom icon spans — do not recreate the icon block with custom CSS classes.

---

## Overlay

| Component | React | Native | Pure |
|-----------|:-----:|:------:|:----:|
| Dialog | ✓ | ✓ | — |
| Menu | ✓ | — | — |

---

## Data

| Component | React | Native | Pure |
|-----------|:-----:|:------:|:----:|
| Data Table | ✓ | — | ✓ |
| Pagination | ✓ | ✓ | — |

> **Pure notes:** Data Table uses `.a1-table`.

---

## Media and iconography

| Component | React | Native | Pure |
|-----------|:-----:|:------:|:----:|
| Icon | ✓ | — | ✓ |

> **Pure notes:** Icon uses `.a1-icon` (Material Symbols Outlined, ligature name as text content). Filled variant uses `.a1-icon-filled`.

---

## Disclosure / Accordion

| Component | React | Native | Pure |
|-----------|:-----:|:------:|:----:|
| Accordion (React) / Disclosure (pure) | ✓ | — | ✓ |

> **Naming note:** The React package calls this component "Accordion". The Pure package implements the same concept using the native `<details>` / `<summary>` elements with `.a1-details`.

---

## Calendar

| Component | React | Native | Pure |
|-----------|:-----:|:------:|:----:|
| Calendar | ✓ | — | — |

> **React props:** `variant` ("scroll" | "paginated", default "scroll"), `initialMonth` (Date or `{ year, month }`), `monthsToShow` (default 13, scroll only), `highlightToday` (default true), `dimPast` (default true), `todayButton` (default false, paginated only). Scroll variant renders months stacked vertically. Paginated shows one month at a time with prev/next buttons and month/year selects. Uses container queries for 3 density levels (≥ 480 px full, < 480 px medium, < 320 px compact). Supports RTL and locale-driven week-start via `LabelsProvider`.
>
> **Status:** Experimental — in `apps/a1-web/src/pages/components/data.js` as `calendar: 'experimental'`.

---

## Maintenance log

| Date | Change |
|------|--------|
| 2026-06-07 | Added React Code component and system labels for copy-code affordance |
| 2026-06-07 | Added Calendar to a1-web component docs (Data category, experimental status) |
| 2026-06-07 | Added Calendar component (React only); paginated variant, RTL/locale support, todayButton |
| 2026-06-07 | Simplified tables to 3 packages (React, Native, Pure); moved registry to system/ai/ |
| 2026-06-05 | Added a1-web Components menu hierarchy and selected category icons |
| 2026-06-04 | Initial registry created from current package state |
