# A1 Design System — Component Registry

**Keep this file current.** Update it whenever a component is added, removed, renamed, or its package coverage changes. This is part of the component addition checklist in `packages/react/ai/project-context.md`.

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
| Category | `components-navigation` | Navigation | `near_me` | Link, Breadcrumb, Side Nav, Top Header, Bottom Drawer, Tabs, Page Nav |
| Category | `components-actions` | Actions | `touch_app` | Button, Icon Button, Switch, Segmented Control, Sticky Actions |
| Category | `components-inputs` | Inputs | `edit_note` | Text Field, Number Field, Date Field, Time Field, Phone Field, Zip Field, Credit Card Field, Textarea, Select, Checkbox Group, Radio Group, Fieldset, Field Row, Inline Editable |
| Category | `components-feedback` | Feedback | `campaign` | Banner, Badge, Notification, Snackbar, Empty State, Status Bar, Circular Progress, Step Tracker |
| Category | `components-layout` | Layout | `dashboard` | Section, Card, Stack, Cluster, Grid, Bleed, Inset, Spacer, Page Layout, Button Container, Figure |
| Category | `components-overlay` | Overlay | `web_asset` | Dialog, Menu |
| Category | `components-data` | Data | `table_chart` | Data Table, Definition List, Pagination, Calendar |
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
>
> **React Divider props:** `orientation` ("horizontal" | "vertical" | responsive object, default "horizontal"), `variant` ("subtle" | "strong" | "accent", default "subtle"), `lineStyle` ("solid" | "dashed" | "dotted", default "solid"), `size` ("xs" | "sm" | "md" | "lg", default "xs"), `space` ("none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl", default "sm"), `decorative` (boolean, default true). `variant` controls color tone and `lineStyle` controls border pattern so combinations like accent + dashed or subtle + dotted are valid.
>
> **Heading content rules (system-wide):** Write all headings in sentence case — "Create account", not "Create Account". Never apply `text-transform: uppercase` to content text; screen readers may spell out individual letters. Use the `size` prop to control visual scale independently of the semantic heading level.
>
> **Font-weight on states (system-wide):** Never change `font-weight` on `:hover`, `:focus`, `:active`, `[aria-selected]`, or `[aria-current]`. This causes layout reflow as the element resizes. Use color, border, background, or underline to communicate interactive and selection states instead.

---

## Typography composition patterns

These are named UI patterns built from existing typography components. Do not invent custom components or arbitrary CSS values for any of them.

### Eyebrow

An eyebrow is a small label that sits above a heading to provide category or section context. It is not a component — compose it from `Paragraph` and `Heading` inside a `Stack`.

```jsx
<Stack direction="column" gap="xs">
  <Paragraph as="span" size="xs" color="muted">
    Category label
  </Paragraph>
  <Heading as="h2" size="lg">Section heading</Heading>
</Stack>
```


**Rules:**
- Use `Paragraph` (not a custom `<span>` or `<p>`) so font-family and size tokens are applied correctly.
- Use `size="xs"` or `size="sm"` — never a raw `font-size`.
- Use `color="muted"` for the default neutral eyebrow, or omit for default text colour.
- Use `Stack` with `gap="xs"` to control spacing between the eyebrow and heading — never use a raw `margin`.
- Do not hardcode a colour, font-size, or font-family in the eyebrow class.

---

## Navigation

| Component | React | Native | Pure |
|-----------|:-----:|:------:|:----:|
| Link | ✓ | ✓ | ✓ |
| Breadcrumb | ✓ | — | — |
| Side Nav | ✓ | ✓ | — |
| Top Header | ✓ | — | ✓ |
| Bottom Drawer | ✓ | — | ✓ |
| Tabs | ✓ | — | — |
| Page Nav | ✓ | — | — |

> **Pure notes:** Top Header uses `.a1-header`. Link uses `.a1-link`. Bottom Drawer uses `.a1-bottom-drawer`.
>
> **BottomDrawer props:** `items` (`{ id, label, icon, href?, onClick?, active?, badge?, disabled? }[]`, max 5), `aria-label` (string, required), `className` (string). Items render as `<a>` when `href` is provided, `<button>` otherwise. Badge values are capped at 99+. Shares `--a1-nav-stacked-icon-size`, `--a1-nav-stacked-label-size`, and `--a1-nav-stacked-gap` CSS custom properties with TopHeader icon-above mode for visual consistency.
>
> **BottomDrawer + TopHeader responsive pattern:** Use `navIconPosition={{ xs: "hidden", sm: "above", lg: "start" }}` on TopHeader and a CSS media query `@media (min-width: 481px) { .a1-bottom-drawer { display: none } }` to show the BottomDrawer only at xs. Both use the same items configuration.
>
> **Tabs `variant` covers five distinct patterns — do not build custom alternatives:**
>
> | variant | Use for |
> |---------|---------|
> | `"line"` | Standard horizontal navigation tabs (default) |
> | `"pills"` | Pill-style filter or view-switcher tabs |
> | `"segment"` | Compact segmented control — identical to SegmentedControl; prefer Tabs when you also need TabPanel content |
> | `"progress"` | **Step-by-step wizards, multi-step forms, and progress indicators.** Each `Tab` accepts a `status` prop (`"completed"` \| `"error"` \| `"warning"`) to reflect step state. This is the correct component for anything described as a "stepper", "wizard", "multi-step form", or "progress indicator". Do not build a custom stepper. |
> | `"folder"` | Browser-tab / folder-style navigation |
>
> When a design brief, task description, or Priority Guide mentions a stepper, wizard, onboarding flow, checkout steps, or progress indicator, always reach for `<Tabs variant="progress">` before considering any custom implementation.
>
> **SideNav behavior rules:**
> - **Desktop (≥1025px):** SideNav is sticky (`position: sticky; top: 0; height: 100vh`). Do not wrap it in a container that has `overflow: hidden` or `overflow: auto` — this breaks sticky positioning.
> - **Mobile/tablet (≤1024px):** SideNav is a fixed overlay that slides in from the edge. Control it with the `open` and `onClose` props. Do not force it to be permanently visible at these breakpoints.
> - **Internal scroll:** The nav item list scrolls internally when content overflows. The header and footer slots are outside the scroll region and always remain visible — do not place them inside the nav item list.

---

## Actions

| Component | React | Native | Pure |
|-----------|:-----:|:------:|:----:|
| Button | ✓ | ✓ | ✓ |
| Icon Button | ✓ | ✓ | ✓ |
| Switch | ✓ | — | — |
| Segmented Control | ✓ | — | — |
| Sticky Actions | ✓ | — | — |

> **Pure notes:** Button uses `.a1-button` + `.a1-button-{type}` + `.a1-button-{size}` + `.a1-button-pill`. Icon Button uses `.a1-icon-button`.
>
> **StickyActions props:** `contentWidth` ("xs" | "sm" | "md" | "lg" | "xl" | "2xl") — constrains the inner content to the same max-widths as Section's `contentWidth`. Match this to the `contentWidth` of the Section above for visual alignment.
>
> **StickyActions usage rules:**
> - **Do not combine with BottomDrawer.** Both occupy the bottom of the viewport and will overlap. Use StickyActions for flow navigation (onboarding, wizards, checkout) and BottomDrawer for persistent app navigation — never both on the same screen.
> - **Always nest a ButtonContainer.** Do not place bare buttons directly inside StickyActions — ButtonContainer handles responsive layout, fill behaviour, and alignment.
> - **Match contentWidth to the Section above.** If the page content uses `contentWidth="sm"`, set `StickyActions contentWidth="sm"` so buttons stay aligned with the content.
> - **Bottom spacing is automatic.** StickyActions renders an invisible spacer sibling in document flow sized to match the bar via `ResizeObserver`. No manual `paddingBlockEnd` or `Spacer` is needed — the spacer keeps content visible above the bar automatically.
>
> **Button `fullWidth` and `loading`:** `fullWidth` (boolean, default false) stretches the button to fill its container; when false it keeps its natural content width. `loading` (boolean, default false) shows a spinner in place of the icon and makes the button inert (disabled + `aria-busy`) — use it for in-progress actions like form submission, paired with a present-tense label ("Saving…"). **IconButton has neither prop — it is always a fixed square at natural width and must never be stretched (rule `icon-button-natural-width`).**
>
> **Button vs Link:** Use `<Button>` for actions (save, submit, delete, open a dialog, change state). Use `<Link>` for navigation. Do not use `<Button>` where an `<a>` element is semantically correct.
>
> **One primary per decision area:** Only one `variant="primary"` button should appear within a single form, dialog, or action group. Multiple primary buttons compete for attention and obscure the recommended action.
>
> **Tertiary requires icon + verb:** `variant="tertiary"` buttons must always include both a visible icon and a verb-led label (e.g. "Edit profile", "Download report"). Never tertiary with text only or icon only.
>
> **Icon buttons need accessible names:** Every `<IconButton>` must have an `aria-label` that describes the action. The icon alone is not an accessible name.

---

## Inputs

| Component | React | Native | Pure |
|-----------|:-----:|:------:|:----:|
| Text Field (text, email, password) | ✓ | — | ✓ |
| Number Field | ✓ | — | — |
| Date Field | ✓ | — | — |
| Time Field | ✓ | — | — |
| Phone Field | ✓ | — | — |
| Zip Field | ✓ | — | — |
| Credit Card Field | ✓ | — | — |
| Textarea | ✓ | — | ✓ |
| Select | ✓ | — | ✓ |
| Checkbox Group | ✓ | — | ✓ |
| Choice Group | ✓ | — | — |
| Radio Group | ✓ | — | ✓ |
| Fieldset | ✓ | — | ✓ |
| Field Row | ✓ | — | — |
| Switch (input) | ✓ | — | — |
| Inline Editable | ✓ | — | — |

> **Choice Group props:** `size` ("compact" | "default" | "comfortable", tile density, default "default"), `columns` (number for a fixed count at all breakpoints, or a breakpoint object `{ xs?, sm?, md?, lg?, xl? }` for responsive column counts; omit for auto-fill), `multiple` (boolean — false = radio/single-select, true = checkbox/multi-select, default false), `inlineIcon` (boolean — places each tile's icon to the left of the label/subtext instead of above the content block, default false), `hint`, `error`, `success` (group-level messages), `required`. Pass `options` for a flat list or `sections` (`{ label, options }[]`) for labeled subgroups with dividers. Each option accepts `value`, `label`, `subtext?`, `icon?` (Material Symbols name), `disabled?`. Value is `string` for single-select, `string[]` for multi-select. Selection indicator: circle for radio, rounded square for checkbox, both in the top-start corner of each tile.
>
> **Field family:** the text-input family is a set of individual components that share the `TextField` base (label, hint, error, size, labelPosition, required, disabled, readOnly): `TextField` (text/email/password), `NumberField` (adds `prefix`, `unit`), `DateField`, `TimeField`, `PhoneField` (mask), `ZipField` (mask + `ZIP_MASKS`), `CreditCardField` (mask). They each have their own a1-web page and Storybook entry. Fields have no `placeholder` by design.
>
> **Field autocomplete:** all field-family components forward `autoComplete` to the native input for browser/password-manager autofill (e.g. `"email"`, `"username"`, `"current-password"`, `"new-password"`, `"tel"`, `"postal-code"`, `"cc-number"`, `"off"`). The a1-web configurators seed sensible defaults (Text Field email → `email`, Phone → `tel`, Zip → `postal-code`, Credit Card → `cc-number`); always set an appropriate `autoComplete` on real forms so autofill works.
>
> **Form fields have no `:active` background change:** the pressed (`:active`) state keeps only the border feedback — hover, focus, error, and read-only treatments are unchanged.
>
> **Field `labelPosition` values:** `"above"` (default) stacks the label on top. `"before"` places the label to the inline-start side of the input in a two-column grid (collapses to stacked on xs/sm viewports). Pass `labelPosition` on individual fields or on the parent `Fieldset` to apply it to all children.
>
> **FieldRow:** lays out related field components side by side in equal-width columns (`children` only, no other props). Each direct child gets `flex: 1 1 0`; fit-content fields (DateField, ZipField via `.a1-field--fit`) keep their natural width. Stacks to a single column on xs/sm viewports, and stacks automatically when the parent `Fieldset` uses `labelPosition="before"` (reads `FieldsetContext`). Use it inside a `Fieldset` to group inline fields like First/Last name or City/State/ZIP. Do not hand-roll a `display: flex` row for fields — use `FieldRow`.
>
> **Comfortable required marker:** at `size="comfortable"`, the required indicator across the field family and Checkbox/Radio/Choice group legends renders as a small subtle info `MessageBadge` ("Required", `size="sm"`, no icon) rather than an asterisk. Compact/default sizes keep the asterisk.
>
> **Pure notes:** Field uses `.a1-label` + `.a1-input` + size modifiers. Form container uses `.a1-form`. Status uses `.a1-label-error` / `.a1-label-success`. Required indicator uses `.a1-required`. Messages use `.a1-message-error` / `.a1-message-success` / `.a1-message-hint`.

---

## Feedback

| Component | React | Native | Pure |
|-----------|:-----:|:------:|:----:|
| Banner | ✓ | ✓ | — |
| Badge | ✓ | ✓ | — |
| Notification | ✓ | — | — |
| Snackbar | ✓ | ✓ | — |
| Empty State | ✓ | ✓ | — |
| Status Bar | ✓ | — | — |
| Circular Progress | ✓ | — | ✓ |
| Step Tracker | ✓ | — | ✓ |

> **Banner `variant` prop:** `"inline"` (default) — compact in-page alert. `"system"` — full-width system-level announcement (formerly the separate `SystemBanner` component). Use `variant="system"` for any system-wide operational or maintenance notices.
>
> **Badge props:** `status` ("neutral" | "info" | "success" | "warn" | "error", default "neutral"), `subtle` (boolean, default false), `size` ("sm" | "md" | "lg", default "md"), `icon` (Material Symbols name override; pass `null` to suppress the default status icon), `children` (badge label). React exports this as `MessageBadge`; React Native exports this as `Badge`.
>
> **Empty State props:** `scale` ("page" | "section" | "card", default "section"), `icon` (Material Symbols name, default "inbox"), `title`, `description`, `action` (ReactNode, usually a Button). React exports this as `MessageEmptyState`; React Native exports this as `EmptyState`.
>
> **CircularProgress props:** `value` (number, default 0), `max` (number, default 100), `size` ("xs" | "sm" | "md" | "lg", default "md"), `indeterminate` (boolean, default false), `children` (ReactNode — centered inside the ring for sm/md/lg; rendered inline after the ring for xs). Always pass `aria-label` for the progressbar's accessible name since inner children receive `aria-hidden="true"`.
>
> **CircularProgress usage rules:** Use xs for inline loading indicators where space is tight and content goes after the ring. Use sm/md/lg when a percentage or status icon inside the ring is the primary visual treatment. Override `--a1-cp-fill` and `--a1-cp-track` via CSS custom properties to change ring colors; always use semantic color tokens, never raw hex.
>
> **Pure notes:** Circular Progress uses `.a1-circular-progress` with `.a1-circular-progress-small`, `.a1-circular-progress-large`, `.a1-circular-progress-xs` size modifiers and `.a1-circular-progress-indeterminate` for the loading state. Set `--a1-cp-pct` (0–1) on the `.a1-circular-progress__ring` element via inline style for determinate mode; use `--a1-cp-pct:0.25` for indeterminate. The ring uses `conic-gradient` + a CSS `mask` cutout — background-color-agnostic and theme-safe.
>
> **Notification props:** `status` ("neutral" | "error" | "success" | "warn" | "info", default "neutral"), `position` ("top-right" | "top-left" | "bottom-right" | "bottom-left", default "top-right"), `count` (number), `label` (string — used when count is not set), `dot` (boolean — show a dot with no content), `max` (number, default 99).
>
> **Status Bar props:** `value` (number, default 0), `max` (number, default 100 — fill percentage is `value/max`), `size` ("sm" | "md" | "lg", default "md"), `labelPosition` ("above" | "below" | "before" | "after", default "above" — "before" and "after" use a row layout and are RTL-aware), `indeterminate` (boolean — shows an animated loading sweep, hides value-based fill, removes `aria-valuenow`, default false). When no `label` is provided, pass `aria-label` for the progressbar's accessible name. After 3 seconds of `indeterminate` playback, a `<Button size="sm" variant="secondary">` appears with "Pause" / "Play" labels sourced from `system/labels/status-bar.json` (`statusBar.pause`, `statusBar.play`) — wrap in `LabelsProvider` to translate.
>
> **Status Bar accessible theme:** The track gains a `2px` border (via `--component-status-bar-border-width`) in the accessible theme to distinguish the track boundary at high contrast. No other theme overrides are needed — the fill and track colors come from semantic color tokens that already adapt.
>
> **Badge standard statuses:** `neutral`, `info`, `success`, `warn`, and `error`. Use these before creating any custom badge style.
>
> **Badges communicate status, category, count, or metadata** — not primary actions. Do not make a badge interactive without a clear affordance, focus state, and accessible role. Use a Button, chip, or Link pattern for clickable elements.
>
> **Pair color with a text label:** Never rely on color alone to convey meaning (e.g. a red badge with no label). Always include text alongside color.
>
> **Use badges sparingly:** Badging every attribute on a page dilutes their signal value. Apply badges only to information that benefits from quick visual scanning.
>
> **Snackbar props:** `open` (boolean, required — renders nothing when false), `position` ("bottom" | "bottom-left" | "bottom-right" | "top" | "top-left" | "top-right", default "bottom"), `actionLabel` + `onAction` (both required to show the action button — omit either to hide it), `onClose` (renders a dismiss IconButton when provided), `children` (message content). Snackbar has one default visual style and applies its inverse treatment internally for child controls; use Banner for persistent status-coloured messages.
>
> **Snackbar accessibility:** Uses `role="status"` and `aria-live="polite"` by default. Do not override `role` unless you have a specific reason.
>
> **Snackbar is not a modal:** It renders as a fixed overlay and does not trap focus. Use it for brief, non-blocking feedback only. For errors that require user action before continuing, use a Dialog or Banner instead.

> **A1 Web configurators:** Feedback pages include configurators for Banner, Badge, Notification, Snackbar, Empty State, Status Bar, Circular Progress, and Step Tracker. Status Bar keeps the `status-bar` route and emits the `StatusBar` React export in code snippets.

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
>
> **Card vs Section — do not confuse these:**
> - Use `Section` for page-level regions: heroes, content rows, marketing blocks, full-width layout zones. Section handles surface colour, padding, width constraints, and theme tokens correctly at that scale.
> - Use `Card` for small, repeated, bounded content units: product tiles, profile summaries, navigation destinations, data items in a grid.
> - A Card that spans a full content column or wraps a long-form layout is a misuse of the component. When in doubt, ask: "Is this one item in a repeating set?" If yes, Card. If no, Section.
>
> **Do not nest Cards inside Cards.** A Card inside a Card creates ambiguous visual hierarchy, conflicting surface elevations, and unclear interaction boundaries. If you need a grouped sub-item within a Card, use a `Stack` or `Inset` to structure the content, not another Card.
>
> **PageLayout no-gap rule:** There is no gap between the sidebar and main area. Do not add `gap`, `margin`, or `padding` to `.a1-page-layout__body`, `.a1-page-layout__sidebar`, or `.a1-page-layout__main`. Apply all inset spacing inside the main content child — use a `Section` or padded wrapper as the first element in the main slot.
>
> **Section spans the full viewport:** `Section` is designed to fill the full available width. Place it as the direct child of `<main>` inside `PageLayout` — do not wrap it in a `Stack`, `Grid`, `Card`, or any other container that would constrain its width. Nesting a `Section` inside another layout component breaks the full-bleed surface and padding model.
>
> **Section border props:** `borderSize` (`"xs" | "sm" | "md" | "lg"`) uses the same thickness tokens as Divider. `borderStyle` (`"solid" | "dashed" | "dotted"`) and `borderVariant` (`"subtle" | "strong" | "accent"`) also mirror Divider. Use `radius` (`"none" | "sm" | "md" | "lg" | "xl"`) for tokenized rounded Section corners.

---

## Overlay

| Component | React | Native | Pure |
|-----------|:-----:|:------:|:----:|
| Dialog | ✓ | ✓ | — |
| Menu | ✓ | — | — |

> **Dialog props:** `open` (boolean), `onClose` (optional — omit to hide the close button entirely), `title` (optional), `footer` (ReactNode), `status` ("success" | "error" | "warn" | "info" | "neutral" — renders a full-bleed colored hero band at the top with a status icon), `icon` (string — overrides the default status icon when `status` is set).
>
> **Dialog status variant:** When `status` is set, a full-bleed colored hero area appears above the title row with a centered icon. Uses the same semantic status background tokens as Card's heroColor. Default icons: success=`check_circle`, error=`error`, warn=`warning`, info=`info`, neutral=`info`. Pass `icon` to override.
>
> **No close button:** Omit `onClose` to hide the dismiss button. In this case the dialog can only be closed programmatically or via footer actions. Still handle the Escape key — pass an `onClose` or add your own cancel listener if keyboard dismissal matters.

---

## Data

| Component | React | Native | Pure |
|-----------|:-----:|:------:|:----:|
| Data Table | ✓ | — | ✓ |
| Definition List | ✓ | — | ✓ |
| Pagination | ✓ | ✓ | — |

> **DataTable `size` prop:** `size` ("comfortable" | "default" | "compact") sets cell padding density. Omit `size` entirely to let the table auto-select density based on available container width — this is the default and replaces the old `density="auto"` value.
>
> **DataTable `notices` prop:** Accepts `{ content: ReactNode; afterRow?: number }[]`. Each entry renders a full-width zero-padding row spanning all columns. `afterRow` (0-based, default 0) controls position — 0 = before all data rows, N = before the Nth data row. Multiple entries at the same position stack in order. Intended for `<Banner variant="system">`, inline alerts, or maintenance notices. Notice rows are not filtered, sorted, or paginated.
>
> **DefinitionList props:** `items` (`{ label, value, children?, copyValue?, copyText?, valueHeadingProps? }[]`), `direction` ("row" | "column", default "row"), `size` ("sm" | "md" | "lg", default "md"), `labelWidth` ("auto" | "fixed", row only, default "auto"), `copyValue` (boolean), `copyLabel`, `copiedLabel`, and `valueHeadingProps` (Heading props for value typography). Fixed row labels use a responsive container-based label column and stack at narrow widths.
>
> **DefinitionList usage rules:** Use column layout for narrow/detail-heavy metadata, long labels, rich values, and heading-styled values. Use row + auto labels for compact short metadata. Use row + fixed labels when aligned values improve scanning across a record. Enable copy buttons only for exact reusable values such as IDs, emails, URLs, phone numbers, addresses, or codes.
>
> **Pure notes:** Data Table uses `.a1-table`. Definition List uses `.a1-definition-list` with `.a1-definition-list-row` / `.a1-definition-list-column`, `.a1-definition-list-small|medium|large`, and `.a1-definition-list-label-auto|fixed`.

---

## Media and iconography

| Component | React | Native | Pure |
|-----------|:-----:|:------:|:----:|
| Icon | ✓ | — | ✓ |

> **Icon props:** `name` (string, required), `size` ("xs" | "sm" | "md" | "lg" | "xl" | "jumbo" | "xJumbo", default "md" = inherits from parent), `color` ("muted" | "accent" | "inverse" | "success" | "error" | "warn" | "info", default = inherits current text color), `weight` (font variation 100–700), `grade` (-50–200), `opticalSize` (20|24|40|48), `fill` (boolean).
>
> **Icon size px values:** xs=16, sm=20, md=inherit/~24, lg=32, xl=40, jumbo=64, xJumbo=96. Size classes also set `--a1-icon-opsz` automatically for sharp rendering at that scale.
>
> **Icon color tokens:** Status colors (`success`, `error`, `warn`, `info`) map to semantic status background tokens. Use `inverse` on dark surfaces. Omit `color` entirely to inherit the current text color from the parent.
>
> **Pure notes:** Icon uses `.a1-icon` (Material Symbols Outlined). Size classes: `.a1-icon-xs|sm|lg|xl|jumbo|xjumbo`. Color classes: `.a1-icon-muted|accent|inverse|success|error|warn|info`. Filled variant: `.a1-icon-filled`.

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
| 2026-06-15 | Stack now preserves internal CSS variables when callers pass `style`, preventing direction/gap/align/justify/wrap from being reset by custom inline styles |
| 2026-06-15 | Added a1-web Stack configurator for `as`, direction, semantic/numeric gap, align, justify, and wrap |
| 2026-06-15 | Card now fills its containing inline size by default so container-query previews and grid tracks do not collapse to content width; a1-web Card configurator gained element and navigation href controls |
| 2026-06-15 | Section `height="screen"` now sets `align-content: start` so grid rows do not stretch extra viewport height and `gap` remains token-accurate |
| 2026-06-15 | Section gained opt-in border props (`borderSize`, `borderStyle`, `borderVariant`) using Divider tokens plus tokenized `radius`; Storybook, property docs, and a1-web controls updated |
| 2026-06-15 | Added a1-web Section configurator as bare display: sample Heading + Paragraph inside the Section, controls for Section props, and no outer Display tab controls |
| 2026-06-15 | Snackbar simplified to one default visual style; status variants removed from React, Storybook, a1-web controls, and current docs; `inverse` removed as a public prop; default surface fixed to dark neutral background with light foreground |
| 2026-06-15 | Added a1-web feedback configurators for Notification, Snackbar, Status Bar, Circular Progress, and Step Tracker |
| 2026-06-15 | Split the old Feedback "Message" registry entry into Badge (`MessageBadge` in React, `Badge` in Native) and Empty State (`MessageEmptyState` in React, `EmptyState` in Native); a1-web now exposes separate Badge and Empty State component pages/configurators |
| 2026-06-15 | Comfortable required marker: field family + Checkbox/Radio/Choice group legends now render the `MessageBadge` required indicator at `size="sm"` with `icon={null}` (small badge, no icon) |
| 2026-06-15 | FieldRow added to registry (React, Inputs category) and a1-web (component card, packages, status, related, configurator); Fieldset configurator added to a1-web (simple grouped example, no FieldRow) |
| 2026-06-11 | Added StickyActions component (React only): fixed bottom action bar for flows and wizards; contentWidth prop mirrors Section's max-width values; children stacked with gap; safe-area-inset-bottom for notch devices; z-index 150; rule: do not combine with BottomDrawer; rule: always nest a ButtonContainer; Onboarding template updated to use StickyActions |
| 2026-06-11 | Added BottomDrawer component (React + Pure): fixed bottom nav bar, max 5 items, icon-above-label stacked layout, badge support, shares --a1-nav-stacked-* vars with TopHeader; navIconPosition="hidden" added to TopHeader |
| 2026-06-11 | Added semantic.color.surface.card token; Card (React + Pure) now uses --semantic-color-surface-card; dark mode and Fresh theme overrides applied across all build pipelines |
| 2026-06-10 | Removed SystemBanner component; replaced by `<Banner variant="system">` — all internal usages updated; `packages/react/src/components/system-banner/` deleted |
| 2026-06-10 | DataTable: added `notices` prop (`{ content: ReactNode; afterRow?: number }[]`) — full-width no-padding rows inserted at arbitrary positions in tbody; `afterRow` is 0-based (default 0 = before all rows); multiple entries at the same position stack in order; CSS class `a1-data-table__notice-cell` (padding:0); `a1-data-table__notice-row` (zebra-safe) |
| 2026-06-10 | NumberField unit fix: unit shifts with value via JS-tracked `--a1-field-number-width` + `field-sizing:content`; `.a1-field__unit` is now `flex:1` + clickable so clicking right of value focuses input |
| 2026-06-10 | Section `gap="xl"` (40px) + Stack `gap="xl"` added; `semantic.spacing.gap.xl` token added; CSS class `a1-section--gap-xl`; Stack resolves "xl" to `var(--semantic-spacing-gap-xl)` |
| 2026-06-14 | ChoiceGroup: added `iconOnly` per-option boolean to `ChoiceOption` — visually hides label/subtext for that tile (sr-only), centers the tile's icon; composable with group-level `hideIndicator` and `iconOnly`; CSS class `a1-choice-item--icon-only` |
| 2026-06-10 | IconButton: added `size` prop ("md" default, "lg" = 3.5rem height / 2.5rem icon, matches Button large); CSS class `a1-icon-button--large` (React), `a1-icon-button-large` (Pure/Base) |
| 2026-06-10 | ButtonContainer: added `fillButtons` prop — Button children fill remaining space (`flex:1`); IconButton children stay at natural square width; always row layout; CSS class `a1-button-container--fill-buttons` (React), `a1-button-container-fill-buttons` (Base) |
| 2026-06-10 | Added StepTracker component (React + Pure): non-interactive step position indicator, pill + dot display, left/center/right/full alignment |
| 2026-06-10 | Added Fresh theme: sky-blue accent/info (#0A62DC), teal-green success (#209261), red error (#D11720), amber warn (#D19317), Nunito body/heading (ExtraBold headings), Baskerville display, 10px large radius, mint gradient background; added base.spacing.48 token |
| 2026-06-09 | Icon: added `size` prop (xs/sm/md/lg/xl/jumbo/xJumbo) and `color` prop (muted/accent/inverse/success/error/warn/info); size classes auto-set opsz for optimal rendering; size/color classes added to a1-base.css and a1-pure.css |
| 2026-06-09 | Dialog: added `status` prop (success/error/warn/info/neutral) rendering a full-bleed hero band with status icon; `onClose` now optional (omit to hide close button); removed A11y example stories |
| 2026-06-09 | Added CircularProgress component (React + Pure): SVG-based ring progress indicator, xs/sm/md/lg sizes, indeterminate spin, custom inner content, xs places children after ring, conic-gradient Pure implementation |
| 2026-06-09 | Added DefinitionList component (React + Pure): semantic label/value pairs, row/column direction, sm/md/lg sizes, auto/fixed responsive label widths, Heading-based value typography, optional copy value buttons, and usage rules |
| 2026-06-09 | Calendar: added `selectable` prop (opt-in date selection); out-of-range dates fully blocked when minDate/maxDate set; React package bumped to 0.4.1 |
| 2026-06-09 | StatusBar pause button → `<Button size="sm" variant="secondary">` with "Pause"/"Play" text; added system/labels/status-bar.json with translations (es/fr/de/pt/ja/zh/ar); React package bumped to 0.4.0 |
| 2026-06-09 | Prop consistency pass (v0.4.0): Tab status "warning"→"warn"; Section alignment→align; Notification variant→status, "default"→"neutral"; Heading/Paragraph align now accepts "start"/"end"; TextField/TextareaField/SelectField/Fieldset labelPosition "side"→"before"; Grid gap adds "xs"; SegmentedControl.d.ts created with size typed; DataTable density→size (omit=auto) |
| 2026-06-08 | Fixed StatusBar RTL indeterminate animation (physical left/right anchor + animation-direction: reverse); added pause/resume button appearing after 3 s; label accepts ReactNode |
| 2026-06-08 | Added StatusBar component (React only): value/max fill, indeterminate loading, three sizes, four label positions (RTL-aware), accessible-theme track border |
| 2026-06-08 | Added Choice Group inlineIcon prop: places tile icon left of label/subtext instead of above |
| 2026-06-08 | Added no-nested-cards rule to Card guidance in Layout notes |
| 2026-06-08 | Added Snackbar notes: props (open, variant, position, inverse, actionLabel/onAction, onClose), accessibility behavior (role/aria-live auto-set by variant), and non-modal usage guidance |
| 2026-06-08 | Added rules from all system/rules YAML files: Typography (sentence case, no uppercase, no font-weight on states), Button (vs-link, single-primary, tertiary icon+verb, icon a11y label), SideNav (sticky desktop, mobile overlay, internal scroll), Badge/Message (standard variants, status-only, color+text, use sparingly), PageLayout (no-gap rule) |
| 2026-06-08 | Added Card vs Section guidance to Layout notes; added card-not-for-page-sections rule to system/rules/card.yaml |
| 2026-06-08 | Revised Choice Group: removed direction prop; columns now accepts number or responsive breakpoint object; size uses compact/default/comfortable convention; indicator in top-start corner |
| 2026-06-08 | Added Choice Group component (React only); single/multi-select, size/gap/columns props, icon + subtext per option |
| 2026-06-07 | Added React Code component and system labels for copy-code affordance |
| 2026-06-07 | Added Calendar to a1-web component docs (Data category, experimental status) |
| 2026-06-07 | Added Calendar component (React only); paginated variant, RTL/locale support, todayButton |
| 2026-06-07 | Simplified tables to 3 packages (React, Native, Pure); moved registry to packages/react/ai/ |
| 2026-06-05 | Added a1-web Components menu hierarchy and selected category icons |
| 2026-06-04 | Initial registry created from current package state |
