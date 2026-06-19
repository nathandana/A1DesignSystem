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
| Category | `components-layout` | Layout & Display | `dashboard` | Section, Card, Stack, Grid, Bleed, Inset, Spacer, Page Layout, Button Container |
| Category | `components-typography` | Typography | `title` | Heading, Paragraph, Blockquote, List, Code, Divider, Inline |
| Category | `components-actions` | Actions & Controls | `touch_app` | Button, Icon Button, Switch, Segmented Control, Slider, Toolbar, Sticky Actions, Accordion, Tabs, Link |
| Category | `components-navigation` | Navigation | `near_me` | Breadcrumb, Side Nav, Top Header, Bottom Drawer, Page Nav, Tree Menu |
| Category | `components-inputs` | Inputs | `edit_note` | Text Field, Number Field, Date Field, Time Field, Phone Field, Zip Field, Credit Card Field, Textarea, Select, Checkbox Group, Radio Group, Choice Group, Fieldset, Field Row, Inline Editable |
| Category | `components-feedback` | Feedback & Messaging | `campaign` | Banner, Badge, Notification, Snackbar, Empty State, Status Bar, Circular Progress, Step Tracker |
| Category | `components-media-iconography` | Media and iconography | `insert_photo` | Figure, Icon |
| Category | `components-overlay` | Overlay | `web_asset` | Dialog, Menu, Context Menu |
| Category | `components-data` | Data | `table_chart` | Data Table, Definition List, Pagination, Calendar |

**Routing rules:**
- Category pages use `components-{category-id}`.
- Component pages use `component-{component-id}`.
- If a component appears in more than one registry table, keep one canonical a1-web component page and avoid duplicate route IDs.
- This menu hierarchy table is the source of truth for **category membership**. Note that several components are menu-grouped differently from the per-package coverage sections below (which group by implementation family): **Tabs**, **Link**, and **Accordion** live under **Actions & Controls**, and **Figure** under **Media and iconography**.

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
> **React Code props:** `variant` ("inline" | "block", default "inline"), `wrapping` (boolean), `copyCode` (boolean), `copyText` (optional clipboard override), `editable` (boolean, default false — renders a `<textarea>` instead of `<pre><code>` so the block is user-editable; only meaningful in block mode), `onChangeValue` (callback receiving the current string value on each keystroke). When `editable` and `copyCode` are combined, the copy button copies the live textarea content, not the original `children`. Copy affordance uses the standard `content_copy` icon and code labels from `system/labels/code.json`.
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
| Tree Menu | ✓ | — | — |

> **Tree Menu props:** `items` (`TreeItem[]` — `{ id, label, icon?, href?, disabled?, children? }[]`), `selectedId` (string | null), `onSelect` (callback), `defaultExpandedIds` (string[], uncontrolled), `expandedIds` (string[], controlled), `onExpandedChange` (callback), `showExpandControls` (boolean, default false — renders "Expand all" / "Collapse all" buttons above the tree), `onHoverChange` (callback, fires with id on mouseenter and null on mouseleave), `draggable` (boolean, default false — enables drag-and-drop reordering and reparenting), `onMove` (`({ draggedId, targetId, position: 'before' | 'into' | 'after' }) => void` — called when the user drops an item; the consumer is responsible for updating the `items` array), `aria-label` (string). Items render as `<a>` when `href` is provided, `<button>` otherwise. Supports unlimited nesting depth. Expand/collapse (`add_box` / `indeterminate_check_box`) is independent from selection: clicking the toggle icon only expands/collapses the branch; clicking the label selects the node. Keyboard: Arrow Right expands or descends into a branch; Arrow Left collapses or moves to parent; Home/End jump to first/last visible node; Enter/Space selects only. Selected state uses the full action background (`--semantic-color-action-background`) for a clear, unambiguous highlight. Roving tabindex keeps one item in the tab sequence at a time. **Drag-and-drop:** when `draggable` is true, each row becomes a drag source and drop target. Dragging over the top 30% of a row shows a "drop before" indicator; over the bottom 30% shows "drop after"; over the middle 40% of a branch node shows "drop into" (reparent). Collapsed branches auto-expand after 600 ms when held over. An item cannot be dropped onto itself or any of its descendants.

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

## Actions & Controls

> Menu category **Actions & Controls** also includes **Tabs** and **Link** (see [Navigation](#navigation)) and **Accordion** (see [Disclosure / Accordion](#disclosure--accordion)); their coverage rows stay in those implementation-family sections.

| Component | React | Native | Pure |
|-----------|:-----:|:------:|:----:|
| Button | ✓ | ✓ | ✓ |
| Split Button | ✓ | — | — |
| Icon Button | ✓ | ✓ | ✓ |
| Switch | ✓ | — | — |
| Segmented Control | ✓ | — | — |
| Slider | ✓ | — | — |
| Toolbar | ✓ | — | — |
| Sticky Actions | ✓ | — | — |

> **Menu grouping:** **Accordion**, **Tabs**, and **Link** are also menu-grouped under **Actions & Controls**; their coverage rows and notes live in their implementation-family sections ([Disclosure / Accordion](#disclosure--accordion), [Navigation](#navigation)). **Split Button** has no separate menu page — it is surfaced via the Button page's **Split (menu)** toggle.
>
> **SplitButton props:** `children` (main label), `onClick` (main action), `variant` / `size` / `icon` / `iconPosition` / `loading` / `disabled` (shared with Button — both targets), `actions` (`{ id, label, icon?, disabled?, onClick? }[]` shown in the dropdown `Menu`), `menuLabel`, `toggleLabel`. The main button runs the default action; the caret toggle on its inline-end opens the menu (`aria-haspopup="menu"` + `aria-expanded`). Composes the A1 `Button` + `Menu`; the two targets share one pill outline with a hairline divider. React only.
>
> **Button label wrapping:** A long Button label wraps onto multiple lines (centered) and grows the button height; a single line keeps the standard target height via `min-height`. (Removed the fixed `height`/`max-height` + `white-space: nowrap`.)
>
> **Pure notes:** Button uses `.a1-button` + `.a1-button-{type}` + `.a1-button-{size}` + `.a1-button-pill`. Icon Button uses `.a1-icon-button`.
>
> **Slider props:** `value` / `defaultValue` / `onChange(value)` (number; in detent mode the value is a detent's value), `min` (0), `max` (100), `step` (1) for continuous mode; `detents` (optional — `number[]` or `{ value, label?, icon? }[]`; the thumb snaps between detents, the keyboard moves one detent at a time, and labels render under the track, e.g. None/XS/SM/MD/LG. A detent's `icon` (Material Symbols name) renders in the label row **instead of** its text label — provide a `label` too so screen readers and the value bubble have a text alternative); `label` (a **visible field label** rendered above the control and associated via `htmlFor` — also the accessible name; sized to match the field family per `size`. Use `aria-label`/`aria-labelledby` for an invisible name); `size` ("compact" | "default" | "comfortable", default "default" — mirrors the **field family** so a Slider sits naturally beside fields; scales the label, detent labels, track, and thumb); `variant` ("default" | "subtle", default "default" — "subtle" shows the selection (fill, thumb, active detent) in **neutrals** instead of the action colour); `showValue` (boolean, default true — the floating value bubble shown while dragging/focused); `valuePosition` ("above" | "below", default "above" — flips to stay in the viewport); `formatValue(value)` (custom bubble + `aria-valuetext`); `bubbleLabel` (an alternate **value-bubble** label — a node, or `(value, detent) => node`; **visual only**, `aria-valuetext` is unchanged; falls back to the current bubble content when omitted — used to spell a size out in the bubble, e.g. "Small", while the detent under the track stays "SM"); `disabled`; `name` (form value). Built on a native `<input type="range">` so keyboard (arrows, Home/End, Page Up/Down), focus, touch, and form semantics work out of the box; the value is announced via `aria-valuetext`. The value bubble is anchored by progress (and its caret tracks the thumb) so it never spills past the control edges at the extremes. React only. Sample use: editor size/padding controls, or the Section configurator's Content width (compact, with a detent per size).
>
> **Toolbar:** a compact container that groups related editing controls on one subtle surface — think a text-editor toolbar, or the controls in the component configurator (it's denser than a ChoiceGroup; ChoiceGroup is retained for full-size selectors). Compositional API — exports `Toolbar` plus tool sub-components, separated by `<ToolbarDivider />`. Toolbar props: `aria-label` (used when there's no visible label), `label` (optional visible caption rendered above the bar — a small label one step below the compact form-label size; also supplies the accessible name via `aria-labelledby`), `overlay` (boolean, default false — lifts the bar onto a floating, elevated surface (shadow + border) for a toolbar that hovers over page content, e.g. a selection formatting bar; the consumer positions it), `fullWidth` (boolean, default false — by default the bar is `fit-content` wide; when true it fills its container and the tools grow to share the available width, dividers keeping their natural size). The bar has no boundary by default but gains a border in the **accessible theme** and under OS **high-contrast** (`prefers-contrast: more` / `forced-colors`) so it stays clearly delimited. Sub-components:
> - **`ToolbarToggle`** — two-state toggle button (`icon`, `swatch`, `label`, `pressed`, `onChange(pressed)`, `showLabel`, `disabled`). `aria-pressed`.
> - **`ToolbarButton`** — plain action button (`icon`, `swatch`, `label`, `onClick`, `showLabel`, `disabled`).
> - **`ToolbarGroup`** — single-select button group with **radio semantics** (`role="radiogroup"`, roving tabindex, arrow-key navigation): `value`, `onChange(value)`, `options` (`{ value, label?, icon?, swatch?, disabled? }[]`), `showLabels` (default false = icon-only), `labelMode` (`"all"` default \| `"selected"` — `"selected"` shows the label only on the currently selected option; the rest render icon/swatch-only and a `"none"`/empty value falls back to the standard none icon, while non-selected options keep an `aria-label`. Use it for a swatch/variant picker where only the chosen option is named, e.g. Section surface/gradient and Button/IconButton variant), `columns` (set it for a grid — e.g. `columns={3}` for a 3×3 crop-direction picker, far smaller than a ChoiceGroup), `aria-label`. An option with value `"none"`/`""`/`null` and no `icon` gets the standard none icon in icon-only mode.
> - **`ToolbarMenu`** — a button that opens a dropdown `Menu` of choices (e.g. a text-size picker showing t-shirt sizes, or a list-type picker: none / bulleted / numbered / checklist): `icon`, `label`, `value`, `onChange(value)`, `items` (`{ value, label?, icon?, disabled? }[]`), `showLabel`, `disabled`, `aria-label`. Carries a caret to signal it opens a menu; `aria-haspopup="menu"` + `aria-expanded`; the active item is marked, and the button shows the active item's icon when no explicit `icon` is given. Use this instead of a native select so the dropdown matches the rest of the system. (There is **no `ToolbarSelect`** — use `ToolbarMenu`.)
> - **`ToolbarDivider`** — vertical separator between tools.
> - **`TOOLBAR_NONE_ICON`** — the exported standard "none" icon name (`block`).
>
> `showLabel` (Toggle/Button/Menu) and `showLabels` (Group) accept a **boolean or a responsive `{ xs?, sm?, md?, lg?, xl? }` object** (cascades xs → xl, e.g. `{ xs: false, lg: true }` shows labels only from `lg` up). When labels can be hidden at any breakpoint the tool keeps an `aria-label` so the accessible name stays stable.
>
> One size for now. React only. CSS-variable architecture (`--a1-toolbar-*`) over existing tokens.
>
> **Toolbar surface rule (`toolbar-surface-contrast`):** Place a Toolbar on a **panel or page surface only — never on a raised surface.** The bar's background is the **raised** surface token, so on a raised surface it has no contrast against the background and the toolbar visually disappears. (Use it on the page background or a panel surface, e.g. the configurator/editor side panel.) See `system/rules/toolbar.yaml`.
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
>
> **IconButton `as` / `href`:** Like Button, IconButton accepts `as` (default `"button"`). Pass `as="a"` with an `href` to render it as a navigation link while keeping the icon-button styling — use this for icon-only navigation. When `as="a"`, `disabled` maps to `aria-disabled` (the native `disabled` attribute does not apply to anchors). The a1-web Button, Link, IconButton, and (navigation) Card configurators expose a page-link selector that emits `as="a"` + `href` automatically.
>
> **IconButton `size`:** `"sm" | "md" (default) | "lg"`. `sm` is a **24×24px** target (the WCAG 2.2 AA minimum target size) with a 16px icon — for dense toolbars. `md` is the standard target. `lg` matches Button's large target (3.5rem) with a 32px icon. CSS: `a1-icon-button--small` / `--large` (React), `a1-icon-button-small` / `-large` (Pure).

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
| Autocomplete | ✓ | — | — |

> **Autocomplete props:** `options` (`(string | { value, label, swatch?, icon?, group? })[]`), `value` (string in single mode, `string[]` in multi), `onChange`, `multiple` (boolean, default false — renders removable chips), `allowCreate` (boolean, default false — offers an "Add …" option for a value not in the list) + `onCreate(value)`, `variant` ("default" | "color", default "default" — `"color"` renders a colour swatch beside each option, chip, and the selected value; each option's swatch is its `swatch` or, in colour mode, its `value`. Pair with `allowCreate` for a "pick from the palette or type a hex" colour field), `label`, `hint`, `error`, `size` ("compact" | "default" | "comfortable", matches the field family), `required`, `disabled`, `emptyText`, `createLabel(query)`, `maxVisible` (number — cap how many options render for very large lists; excess is hidden behind a "keep typing" footer), `moreText(shown)`, `aria-label`. **Option `icon`** renders a Material Symbols glyph beside the option / chip / selected value (e.g. an icon picker). **Option `group`** turns on grouped rendering: when any option has a `group`, the listbox shows a **sticky heading** before each group's options and orders results by each group's first appearance (pass options pre-sorted by group). The dropdown listbox portals to `document.body` (fixed-positioned, tracks the control) so it is never clipped inside an Accordion or other overflow container. ARIA combobox/listbox pattern: input `role="combobox"` with `aria-expanded`/`aria-activedescendant`; keyboard Arrow Up/Down to navigate, Enter to select, Escape to close, Backspace to remove the last chip (multi). Used by the a1-web image library for category tagging and the configurator **icon picker** (grouped by Material Symbols category). React only.

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

## Feedback & Messaging

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

> **Banner `variant` prop:** `"inline"` (default) — compact in-page alert. `"system"` — full-width system-level announcement (formerly the separate `SystemBanner` component). Use `variant="system"` for any system-wide operational or maintenance notices. `"calendar"` — an event/date callout: a tokenized date block (`date` prop) replaces the status icon, an `eyebrow` overline sits above a larger `title`, and `action`/`onDismiss` still work. `date` accepts a `Date`, an ISO string, or `{ month, day }`; `status` still tints the date block. Month names render in sentence case (never uppercased). Uses `role="group"` instead of `role="alert"` since a date callout isn't an alert.
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

## Layout & Display

> Menu category **Layout & Display**. Figure's coverage row stays in this table (implementation family) but it is **menu-grouped under [Media and iconography](#media-and-iconography)** — see the menu hierarchy table.

| Component | React | Native | Pure |
|-----------|:-----:|:------:|:----:|
| Section | ✓ | ✓ | ✓ |
| Card | ✓ | ✓ | — |
| Stack | ✓ | — | — |
| Grid | ✓ | — | — |
| Bleed | ✓ | — | — |
| Inset | ✓ | — | — |
| Spacer | ✓ | — | — |
| Page Layout | ✓ | — | — |
| Button Container | ✓ | ✓ | — |
| Figure | ✓ | — | ✓ |

> **Pure notes:** Section uses `.a1-section`. Footer uses `.a1-footer`. Figure uses `.a1-figure` with `.a1-figure-ratio-16-9` / `.a1-figure-ratio-1-1` for fixed ratios and `.a1-figure-crop-{top|bottom|left|right|top-left|top-right|bottom-left|bottom-right}` for the crop focal point (sets `--a1-figure-crop`).
>
> **Figure props:** `src` (required), `alt`, `caption`, `captionSrOnly`, `captionPosition` ("start" | "center"), `radius` ("none" | "sm" | "md" | "lg" — the default, no prop, is square = "none"), `size` ("3xs" | "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl"), `align` ("none" default — normal flow | "start" | "center" | "end"), `aspectRatio` ("16:9" | "4:3" | "3:2" | "1:1" | "2:3" | "3:4" | "9:16" | "21:9" — locks the image to a fixed ratio and crops to fill via `object-fit: cover`; omit for the natural ratio), `crop` ("center" default | "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right" — focal point used when the image is cropped, i.e. with `aspectRatio` or a fixed height; maps to `object-position`), `cropRect` (`{ x, y, width, height }` — a **freeform crop**: a sub-rectangle of the image as fractions 0–1 of the natural image, applied non-destructively via CSS, never altering the image; takes precedence over `aspectRatio`/`crop`), `marginTop` / `marginBottom` ("sm" | "md" | "lg"), `bleed` (boolean or numeric spacing token), `placeholder` (boolean, default true — when `src` is missing or fails to load, show a tokenized diagonal-stripe placeholder pattern with a centered icon instead of a broken image; respects `aspectRatio`/`size`, falls back to a 4:3 box), `placeholderIcon` (Material Symbols name, default "image").
>
> **Figure crop (a1-web configurator):** crop uses the preset approach by default — an **Aspect ratio** control (Natural / 16:9 / 4:3 / 3:2 / 1:1 / 2:3 / 3:4 / 9:16 / 21:9) and, when a ratio is set, a 3×3 **Crop** focal-point grid (the 9 named `crop` points). A **Custom** button below the crop grid opens a **dialog**: the image is shown with a freeform crop rectangle (drag anywhere to draw, drag an edge or corner to refine; outside is dimmed), the aspect-ratio presets sit below the image, and **Apply** / **Cancel** commit or discard the crop. Preset mode emits `aspectRatio` + `crop`; Custom mode emits `cropRect` metadata. (Selecting an aspect ratio exits Custom mode; **Clear** removes a custom crop.)
>
> **Card props:** `icon` renders a small tokenized icon block above card content (`.a1-card__icon`). `heroIcon` renders a full-bleed colored header area (`.a1-card__hero`). Use these props instead of custom icon spans — do not recreate the icon block with custom CSS classes. `variant="navigation"` makes the whole card a link/button; pass `href` to render it as an `<a>` (the a1-web Card configurator exposes the same project-scoped page-link selector as Button/Link/IconButton, so a navigation card can target another page in the project).
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
> **Section border props:** `borderSize` (`"xs" | "sm" | "md" | "lg"`) uses the same thickness tokens as Divider. `borderStyle` (`"solid" | "dashed" | "dotted"`) and `borderVariant` (`"subtle" | "strong" | "accent"`) also mirror Divider. `borderSides` (`"all"` default, or an array of `"top" | "right" | "bottom" | "left"`) controls which sides the border is drawn on — pass an array for a partial border, e.g. `["top", "bottom"]`; an empty array draws no border (requires `borderSize`). Use `radius` (`"none" | "sm" | "md" | "lg" | "xl"`) for tokenized rounded Section corners.

---

## Overlay

| Component | React | Native | Pure |
|-----------|:-----:|:------:|:----:|
| Dialog | ✓ | ✓ | — |
| Menu | ✓ | — | — |
| Context Menu | ✓ | — | — |
| Bottom Sheet | ✓ | — | — |

> **BottomSheet props:** `title` (string — the first line shown in the header; the only thing visible when collapsed), `detents` (`number[]` — expanded heights as viewport-height fractions 0–1, smallest first; default `[0.5, 0.92]`), `detent` (number — controlled snap index; **0 = collapsed**, then one index per `detents` entry), `defaultDetent` (number, default 1), `onDetentChange` (`(index) => void`). A **fixed** panel attached to the bottom of the viewport that overlays content with **no scrim** — separation is via an upward **shadow**. A **drag handle** in the header resizes it: drag down to **collapse** (header / first line of the title only), drag up to **snap** to a detent; a tap toggles collapsed ↔ largest detent; keyboard Arrow Up/Down step detents, Enter/Space toggles. Content **scrolls internally**; there is **no footer**. The component renders an invisible in-flow **spacer** sized to the collapsed footprint so page content can always scroll clear of the sheet (mount it as the last child of the scroll container). **Only rendered at xs and sm** (`@media (--bp-md-up) { display: none }`). React only. CSS-variable architecture (`--a1-bottom-sheet-*`) over `system/tokens/component/bottom-sheet.json`.

> **ContextMenu props:** `open` (boolean, default false), `x` (number — viewport x position, typically `event.clientX`), `y` (number — viewport y position, typically `event.clientY`), `items` (`ContextMenuEntry[]`), `onClose` (() => void — called on outside click or Escape), `aria-label` (string, default "Context menu"). Items are typed: `{ type?: 'item'; id; label; icon?; shortcut?; variant?: 'default' | 'destructive'; active?; disabled?; onClick? }` | `{ type: 'divider'; id }` | `{ type: 'group'; id; label }`. Portals to `document.body`. Keyboard: Escape closes, Arrow Up/Down navigates items, Home/End jump to first/last, Enter activates. Closes on outside mousedown. The position is clamped to stay within the viewport.
>
> **ContextMenu usage:** Mount the component once in the host element alongside the triggering content. Set `open`, `x`, and `y` from the `onContextMenu` handler on the container element. Do not use a separate trigger button — ContextMenu is always triggered by a right-click (contextmenu event).

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

> **DataTable column `type="image"`:** renders a small fixed-size thumbnail (`.a1-data-table__thumb`, ~2.5rem, `object-fit: cover`; ~2rem at compact). The cell value is an image URL string or `{ src, alt }`; an empty/missing value renders a dashed placeholder. Used by the a1-web image library's table view.
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

> Implementation-family section. **Accordion is menu-grouped under [Actions & Controls](#actions--controls)** — the "Disclosure" menu category was retired.

| Component | React | Native | Pure |
|-----------|:-----:|:------:|:----:|
| Accordion (React) / Disclosure (pure) | ✓ | — | ✓ |

> **Naming note:** The React package calls this component "Accordion". The Pure package implements the same concept using the native `<details>` / `<summary>` elements with `.a1-details`.
>
> **Accordion `subtext` / `divider`:** `subtext` is optional secondary info shown in the trigger after the label — it only shows while the accordion is **collapsed** (a glanceable summary, e.g. the applied settings) and hides when open; it truncates with an ellipsis. `divider` (boolean) adds a bottom border to separate stacked accordions. The trigger has no border-radius and a compact inline padding. The a1-web Section configurator uses `subtext` to summarise each group's applied properties when collapsed and `divider` between groups. (React only — not yet in the Pure `<details>` version.)

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
| 2026-06-19 | **PageNav** sticky + scroll-container fix, and a1-web **TODO** page. **PageNav:** now **sticky on desktop** (≥769px; `top` = `--a1-page-nav-top` so consumers offset a sticky header; `max-height` + internal scroll for long lists); and the progress bar + active-section highlight now **track the nearest scrollable ancestor** (window scroll froze them inside a viewport-height `PageLayout`) — used for both the scroll listener and the IntersectionObserver `root`. page-nav.jsx/.css. **a1-web:** new **TODO page under Resources** (renders the repo-root `TODO.md`: standard Resources header + **Overview / Current / Roadmap tabs** + a right-column **sticky PageNav** in the long tabs); **Projects removed** from the Resources menu; a1-web sets `--a1-page-nav-top` to clear its 64px TopHeader. |
| 2026-06-19 | **Toolbar** prop forwarding + a1-web Sticky Actions / Accordion / Toolbar configurators. **Toolbar:** `ToolbarMenu` / `ToolbarGroup` / `ToolbarDivider` now spread `...rest` + merge `className` (matching Toggle/Button), so callers can attach `data-*` / `className` to a tool's root. Toolbar.jsx. **a1-web configurators (no other DS change):** Sticky Actions dropped the per-button label inputs; Accordion now exposes **`subtext`** + **`divider`**; the **Toolbar configurator is now a data-driven, canvas-selectable tool editor** — the bar is built from `config.tools` (toggle / button / menu / group / divider), **clicking a tool in the preview selects it** (capture handler maps the click to `data-tool-id`; selection stored in config so Preview ↔ panel stay in sync), and the panel edits the selected tool (type, label, icon, menu items / group options) with move-left/right reorder + add/remove. Snippet generated from the tool list. |
| 2026-06-19 | **Slider** compact size + a1-web Slider configurator. **Slider:** the **compact** track/thumb step up one notch (track `base-spacing-6`→`8`, thumb `16`→`20`) so the smallest slider stays grabbable (labels unchanged; this matches the default track/thumb — sizes still differ by label scale). slider.css. **a1-web configurator (no DS change):** detents are now edited with the **DefinitionList tabs pattern** (tab per detent + per-item editor + Add) instead of accordions; **valuePosition / Show value / Disabled** are folded into one **Value bubble** toolbar (position icons + toggle icons). Field-family Size density picker also now labels the selected density (`DensityChoice` → `labelMode="selected"`, across all field-family configurators). |
| 2026-06-19 | **SegmentedControl** fixes + a1-web Heading/Switch configurators. **SegmentedControl:** `fullWidth` now fills its container (added `inline-size: 100%` — `display: flex` alone left it content-width inside a centering parent); the segment **icon is one step larger** (`1.25em`); the **md inline padding steps down** (`segmentPaddingInline` 0.75rem → 0.5rem token, md-only since sm/lg have own tokens — run `npm run build:tokens && npm run build:html-css`); **sm** tightens the icon↔label gap. segmented.css + segmented.json. **a1-web configurators (no DS change):** Heading's "edit-in-preview / markdown" guidance is gated behind the **Helper text** toggle (new `ConfigHelp` gate in configKit); Switch's **Size** is the density icon picker, **Label position** an icon pair, and **Checked/Disabled** a single `FieldState` "State" toolbar. |
| 2026-06-19 | **Autocomplete** grouped/icon options + a1-web icon picker. Autocomplete options gained **`icon`** (a Material Symbols glyph beside the option / chip / selected value) and **`group`** (a **sticky category heading** before each group; results ordered by each group's first appearance), plus **`maxVisible`** (cap rendered options for huge lists — excess hidden behind a `moreText` "keep typing" footer). Backward compatible (no `group`/`icon`/`maxVisible` → unchanged). Autocomplete.jsx/.css/.d.ts + `Grouped options + icons` and `Grouped + capped` stories. **a1-web:** the configurator **`IconSelect`** is now built on the grouped Autocomplete — all 2106 Material Symbols as filterable options **grouped by Material category** (with the glyph shown per row), capped at 200 with a keep-typing footer; replaces the old giant native `SelectField`. The AI-find-icon button is unchanged. |
| 2026-06-19 | **Grid** + **Accordion** + a1-web Layout & Display configurators. **Grid:** `gap="none"` (→ 0, via the shared `resolveSpacing` convention; added to `GapKey`) and responsive **8-column** classes (`.a1-grid--{xs…xl}-8`) so `columns={{…:8}}` works at any breakpoint. Grid.jsx/.d.ts/grid.css + Column Counts / Gap Scale stories. **Accordion:** `divider` accordions now add a `padding-block-start` (scaled to `size`) to the open panel so the first item doesn't touch the divider line. accordion.css. **a1-web configurators (no DS change):** Section Surface bar now has **Inverse** as an inline `ToolbarToggle` (divider-separated; the standalone Inverse toggle removed); Stack folds the **Wrap** toggle into the Direction bar (single-value mode only; `ResponsiveControl` children now get a 3rd `bp` arg, `null` in single mode); Card **Icon display** is None-first with the standard `block` (circle-slash) none icon and **defaults to none**, and **Bare** moved into the Variant bar as a divider-separated toggle; Grid configurator gains 6/8/12 columns + a none gap. |
| 2026-06-19 | Toolbar: `ToolbarGroup` gained **`labelMode`** (`"all"` default \| `"selected"`) — `"selected"` shows the label only on the currently selected option; the rest render icon/swatch-only (a `"none"`/empty value falls back to the standard none icon) while keeping an `aria-label`. For swatch/variant pickers where only the chosen option needs naming. Toolbar.jsx/.d.ts + `Label on selected only` story. **a1-web configurators:** applied to Section **Surface**/**Gradient** and Button/IconButton **Variant** (variant now shows an icon per option — emphasis ramp `star`/`star_half`/`star_outline` + `delete`/`check_circle` — with the label only on the selected one). Also added a shared **Helper text** toggle to every configurator: a footer Switch (off by default) provides `ConfigHelpContext`; shared kit controls (`Choice`/`ConfigSlider`/`DensityChoice`/`FieldState`/`ResponsiveControl`) accept a `helper` string rendered as a muted summary beneath the control only when the toggle is on (`WithHelp`). a1-web + Toolbar only. |
| 2026-06-18 | Added **BottomSheet** (React only): a fixed bottom panel with **no scrim** (separation via upward shadow), a **drag handle** that resizes between detents (collapsed → expanded viewport-height fractions), internal content scroll, no footer, and an in-flow spacer so page content scrolls clear of the collapsed footprint. **xs + sm only**. `system/tokens/component/bottom-sheet.json`, `components/bottom-sheet/` (jsx/css/d.ts/stories), exported from the index, registered in the Overlay table. Run `npm run build:tokens && npm run build:html-css`. |
| 2026-06-18 | PageLayout: fixed the **viewport-height + SideNav** layout at md and below. The `--viewport-height .a1-page-layout__sidebar .a1-side-nav { position: relative }` rule was unscoped, so it overrode the SideNav's md-down **fixed-overlay** behaviour at every breakpoint — the sidebar stayed in flow and its ~280px slot kept reserving space, so the main column never expanded when the nav collapsed. Scoped that override to **`@media (--bp-lg-up)`**; at md-down the SideNav is a fixed overlay again, the `:has(.a1-side-nav)` slot collapses to 0, and `__main` fills the freed width. Affects the a1-web editor / theme editor (any `viewportHeight` PageLayout). page-layout.css only. |
| 2026-06-18 | **Z-index & layering** documented in `project-foundations.md` (new "Z-index and Layering" section): two mechanisms (the native `<dialog showModal>` **top layer** vs. the numeric **z-index scale** — Sticky 100 / Pinned 200 / Popover 1000 / Modal 1100 / Toast 1200), an audit of every component's current value, and the rule that anything which must sit **above a modal** (menus, context menus, tooltips, toasts) must live in the **top layer** (Popover API or portal into the dialog), since `z-index` can't cross the top layer. Interim fix: **Autocomplete** now portals its listbox into the nearest open `<dialog>` (else `<body>`) so the menu isn't painted behind a modal Dialog. |
| 2026-06-18 | Autocomplete: when opened with a value already selected, the menu now **highlights and scrolls to the selected option** (`block: 'nearest'`) instead of starting at the top — single-select jumps to the value, multi-select to the first selected. Active option stays scrolled into view during arrow navigation. `Autocomplete.jsx` (two effects: select-on-open + scroll-active). |
| 2026-06-18 | Autocomplete: added **`variant="color"`** — renders a colour **swatch** beside each option, multi-select chip, and the selected value (a per-option `swatch` colour, or the option `value` in colour mode). Pairs with `allowCreate` to make a "pick a colour from the palette, or type a hex" field. `Autocomplete.jsx`/`.css` (`.a1-autocomplete__swatch`, `--color`)/`.d.ts` (option `swatch?`, `variant`) + `Color variant` story. Used by the a1-web Theme editor's type-detail **Text colours** controls to pick from the theme's ramp. |
| 2026-06-18 | Autocomplete: the listbox dropdown now **portals to `document.body`** and is positioned `fixed` under the control (tracking it through ancestor scroll/resize), so it **escapes any clipping ancestor** — previously an Autocomplete inside an `Accordion` (or any `overflow:hidden`/scroll container) had its menu cut off. No API change; outside-click now also ignores clicks within the portaled list. `Autocomplete.jsx` (createPortal + `useLayoutEffect` position) + `autocomplete.css` (`.a1-autocomplete__listbox--floating`). |
| 2026-06-18 | Added **Aperture** theme (`.a1-theme-aperture`): modern/minimal photography-portfolio look — near-monochrome graphite accent on clean whites (Apple + Audi inspired), refined Apple-blue info + Audi-red error, small radii; **Pinyon Script** (script) display, **Playfair Display** (serif) headings, **Manrope** (elegant sans) body. `system/themes/aperture/` (theme.json + tokens/typography.json); registered in a1-web theme switcher + Google Fonts; run `npm run build:tokens`. |
| 2026-06-18 | Autocomplete: **multi-select** now shows a **checkbox** on each option (matching CheckboxGroup exactly — box size, border, radius, info fill, SVG tick) and the menu **stays open** until dismissed (selecting toggles; selected options stay listed, checked). Styling aligned to the **field family**: `surface-field` background, `border-strong` border, size-based radius (md/sm/lg), the **required** treatment (info border + leading accent) and **comfortable** required `MessageBadge`, and a label gap before the badge. Autocomplete.jsx/css. Also: Tabs `.a1-tab-list--scrollable` pinned `overflow-y: hidden` (overflow-x alone made the browser compute overflow-y to auto → a stray vertical scroll on horizontal tab strips). a1-web: Tabs and Autocomplete **configurators** now manage child items with the DefinitionList tabs pattern (tabs + per-item editor + canvas-click sync). |
| 2026-06-18 | Figure: added a **placeholder** for missing/broken images — `placeholder` (boolean, default true) renders a tokenized diagonal-stripe pattern + centered `placeholderIcon` (default `image`) when `src` is empty or fails to load (e.g. a deleted library image), instead of a broken `<img>`. Respects `aspectRatio`/`size`, 4:3 fallback box. Figure.jsx/css/d.ts + `Placeholder pattern` story. |
| 2026-06-18 | DataTable: added column **`type="image"`** — renders a small thumbnail from a URL string or `{ src, alt }` (empty → dashed placeholder); `.a1-data-table__thumb` CSS (~2.5rem, ~2rem compact). Used by the a1-web image library **table view** (Grid/Table toggle), which uses the table's built-in `selectable` + `onDeleteSelected` for **row selection + bulk delete**. DataTable.jsx/css + components.md. |
| 2026-06-18 | Added **Autocomplete** (React only): a filtering combobox in single- or multi-select (`multiple`) mode, with optional create (`allowCreate` + `onCreate`) for values not in the list. Field-family sizing/label/hint/error; ARIA combobox/listbox + full keyboard nav. `packages/react/src/components/autocomplete/` (jsx/css/d.ts/stories), exported from the index. Registered in the Inputs table. Used by the a1-web image library for category tagging. |
| 2026-06-18 | SegmentedControl: **completed the `size` variants** (the `sm`/`lg` classes had no CSS — `sm` now uses tighter padding + a font size one step down (`body-xs`), `lg` roomier padding + `body-md`; added `segmentPaddingBlock/InlineLg` tokens) and added **`labelMode`** (`"all"` default \| `"selected"` — only the selected segment shows its label, the rest render icon-only via `ariaLabel`/`label`; options without an icon always show their label). Used by the a1-web editor aside SegmentedControl. SegmentedControl.jsx/css/d.ts + `Label on selected only` story + size/labelMode argTypes. Also: a1-web SegmentedControl configurator now manages options with the **DefinitionList tabs pattern** (tabs + per-item editor + sm Add button) instead of accordions. |
| 2026-06-18 | a1-web: **Image library** — upload/manage images locally and use them in Figures. New **Image library** editor page (`projects/ImageLibraryView.jsx`; route `image-library`, in the Editor menu + Projects home): upload (button/drag-drop), a per-image **context menu** (Rename / Custom crop / Delete), a **Custom crop** (Figure crop tool → default crop stored on the image via `setImageCrop`; thumbnails render the crop and Figures start from it, overridable), and a **View toolbar** (density + square/natural thumbnails). Images are downscaled and stored as Blobs in **IndexedDB** (`lib/imageLibrary.ts`). The **Figure configurator** gains a `photo_library` picker (`detail/ImageLibraryDialog.jsx`) that stores `a1img://<id>` as `src` (and applies the image's stored crop); an `ImageLibraryProvider` (`editor/ImageLibraryContext.jsx`, wrapping the app) + `pageRenderer` resolve the ref to a local `object:` URL at render time, keeping page JSON to a tiny id. Device-local (lives in this browser). No design-system change — Figure is unchanged. a1-web only. |
| 2026-06-18 | a1-web: **"Make with AI" entry point** — the project sidebar's **Add page** footer (Pages tab) is now a **SplitButton** whose **Make with AI** menu item adds + opens a page and lands the editor on the **AI tab with the prompt focused**. New `aiComposePageId` flag in `main.jsx` → `EditorPage`/`EditorAsidePanel` (`composeWithAi` switches to the AI tab on mount then calls `onAiComposeConsumed`) → `EditorChatPanel` (`requestFocus` one-shot focuses the instruction textarea via a forwarded ref). Full-width split button via `.a1-web-add-split`. a1-web only — no design-system change. |
| 2026-06-18 | a1-web: **Navigation Cards can link to a project page** — the Card configurator's navigation `href` control is now the shared project-scoped **`PageLinkField`** (same as Button/Link/IconButton) instead of a plain URL text field, so a `variant="navigation"` card can target another page in the project (degrades to a "Link URL" field on the standalone detail page). No design-system change: Card already renders `variant="navigation"` + `href` as an `<a>`, and the renderer already wires `/?page=` hrefs to intra-prototype navigation for any node. card.jsx configurator only. |
| 2026-06-18 | Banner: added **`variant="calendar"`** — an event/date callout that replaces the status icon with a tokenized date block (new `date` prop: `Date` \| ISO string \| `{ month, day }`), adds an `eyebrow` overline above a larger `title`, and keeps `action`/`onDismiss`. Neutral defaults the date block to the action colour; `status` still tints it. Month names stay sentence case (no uppercasing). `role="group"` (not `alert`) for calendar. Banner.jsx/css/d.ts + `Calendar` / `CalendarWithLink` / `CalendarStatuses` stories + a1-web configurator (Variant gains Calendar; eyebrow + Date month/day fields via FieldRow; icon controls hidden for calendar). React only (Banner has no Pure/Native impl). |
| 2026-06-18 | a1-web: **AI page editor (editor chat)** — a new **AI** tab in the editor aside (`editor/EditorChatPanel.jsx`) where you describe a change to the whole page and Claude applies it. `lib/aiPage.ts` sends the live page JSON + the `a1-agent-brief.md` spec as context and gets back `{ message, page }` (full updated `PageDefinition`); the page is committed to the editor history as one undoable step (`onApplyDefinition` threaded `EditorAsidePanel → EditorPage` → `history.commit`). Multi-turn (keeps instruction→reply summaries; re-sends the live page each turn). Browser-side Anthropic SDK, shared localStorage API key, `claude-opus-4-8`, streamed + adaptive thinking. Mirrors the AI image/icon tools. a1-web only — no design-system component/token changes. |
| 2026-06-18 | a1-web: **Project shared layout** — per-project editable chrome document (`__layout__`, `projects/projectLayout.ts`): a `TopHeader` + page-content **`Outlet`** + footer, edited on the canvas (`EditorPage` `documentKind="layout"`, auto-saves via `saveProjectLayout`), opened from All pages → "Shared layout". New editor-only **`Outlet`** type/component; `combinePageIntoLayout` composes a page into the layout (replaces the Outlet, injects auto nav/logo). Standalone prototype renders pages inside the shared layout. `Project.meta` added. Staged: editor Preview-tab/edit-canvas composition, project-settings panel, PageLayout-shell editing. a1-web only. |
| 2026-06-18 | a1-web: **DataTable renders real supplied data** in the editor (`EditorDataTable` renders the real `DataTable` from the node's `columns`/`rows` when present, else the sample Preview), and **import consistency lint** (`projectStore.lintDefinition` → non-blocking warnings in Upload JSON: per-page TopHeader in a project, Section missing contentWidth / zero or mismatched neighbor padding, sibling Cards not in a Grid, card Figure missing/invalid `aspectRatio`). New rules `section-primary-content-width` (section.yaml), `cards-in-grid` + `card-image-aspect-ratio` (card.yaml); `a1-agent-brief.md` consistency rules + corrected DataTable/Figure prop notes. a1-web + docs/rules only. |
| 2026-06-18 | a1-web: **Upload project from JSON** (`projects/ProjectImportDialog.jsx` + `projectStore` `validateProjectImport`/`importProjectJson`) — paste a project bundle or page definition into an editable `Code` block on the Projects page; live validation blocks on parse/structure errors, warns on unknown component types; on import creates + opens a new project preserving page hierarchy. Added **`packages/react/ai/a1-agent-brief.md`** — the single self-contained, current spec (JSON shapes, all 59 components + key props, value vocabularies, rules, examples) for zero-context agents; supersedes the stale component list in `page-definition-standard.md`. a1-web + docs only. |
| 2026-06-17 | a1-web Patterns: **blank-area Slots + nested patterns + inline per-property locks**. (1) **Slot** — a new editor-only `Slot` component (constrained drop zone): a dashed accent-bordered Section with a centred label while empty, transparent children when filled; configurable **label** + **allowed components** + **allowed patterns** + **min/max item count**, enforced when adding/dropping **into** it (`EditorPage` `slotRejection` + a `handleNodeDelete` min guard: disallowed types blocked, a full slot rejects adds, deleting below min blocked). When the Add target is a slot, the **Add panel filters** components/patterns to only what's allowed (and shows "full") via `slotFilter`. Registered in `pageTypes`/`componentRegistry`/renderer `CONTAINER_TYPES`/catalog (Layout "Blank area") + `EditorPropsPanel` `SlotEditorControls` bridge. (2) **Nested patterns preserved** — "Create pattern from selection" keeps nested instances as `PatternRef` (`extractPatternSource`); "Detach pattern" stops at nested instances (`detachPatternMeta`). (3) **Inline per-property lock icons** in pattern authoring (`configLock.jsx` `Lockable` authoring mode + `EditorPropsPanel` `onSetLock`) replace the per-prop switch list (`PatternLockControls` now only has Lock component / Lock text content); locked Sliders/ResponsiveControls now show the overlay. a1-web only — no design-system component/token changes. |
| 2026-06-17 | a1-web Editor **Add panel**: now derives **category order / names / component order / labels / icons** from the source of truth (`pages/components/data.js` `componentCategories`) instead of the catalog's own grouping, so it always matches the Components section (new components auto-slot in; empty categories like Overlay are hidden). `componentCatalog.ts` is now just the addable-node pool, resolved by id via new `CATALOG_ENTRIES_BY_ID` / `catalogIdForType` exports. Added a **view toolbar**: icon **grid/list** toggle + **Group by category** toggle (off → single alphabetical list). a1-web only. |
| 2026-06-17 | a1-web Editor: **7 more components addable** — Slider, Tabs, Toolbar, Field Row, Page Nav, Tree Menu, Data Table. Added to `editor/pageTypes.ts` + `editor/componentRegistry.ts` + `editor/componentCatalog.ts` + config bridges in `editor/EditorPropsPanel.jsx` (reusing each detail `Controls`). Slider/Page Nav render real components with real props; Field Row is a real container (added to renderer `CONTAINER_TYPES`); Tabs/Toolbar/Tree Menu/Data Table render via thin **editor adapters** (new `editor/editorComponents.jsx`) reusing the detail `Preview` (node props carry the configurator config). No design-system component/token changes. Deferred per request: Inline, Inline Editable, Side Nav, Page Layout, Dialog, Menu, Context Menu, Snackbar, Notification. |
| 2026-06-17 | a1-web: **canonical component icons** — every component now has one icon on `componentCategories[].components[].icon` in `apps/a1-web/src/pages/components/data.js` (exported as `COMPONENT_ICONS`); editor Add-panel catalog icons aligned to it; `system/icons/icon-usage.md` gained a Component Icons table. The source of truth for the icon representing each component everywhere. |
| 2026-06-17 | Toolbar: added rule **`toolbar-surface-contrast`** (`system/rules/toolbar.yaml`) — a Toolbar must sit on a **panel or page** surface, never a **raised** surface (the bar uses the raised token, so it has no contrast on a raised background). Wired into the a1-web Rules tab; noted in the Toolbar registry notes. a1-web: the Button page's platform switch was renamed **"View as" → "Codebase"** and moved into the **Configure tab**; and a **Responsive preview** control (Fit / XS–XL) was added to the **Display** tab for every component — it renders the preview in an iframe sized to the breakpoint (real nested viewport) and scales it to fit the panel (`ResponsivePreviewFrame`). |
| 2026-06-17 | Added **SplitButton** (React only): a primary action joined to a caret toggle that opens a `Menu` of related actions; composes `Button` + `Menu` (`actions`, `variant`/`size`/`icon`/`loading`/`disabled`, `menuLabel`/`toggleLabel`); CSS-variable architecture over button/divider tokens (shared pill outline + hairline divider). SplitButton.jsx/css/d.ts + stories; exported from the package; surfaced via the a1-web Button **Split (menu)** toggle (not a separate menu page). |
| 2026-06-17 | Button: a long label now **wraps** to multiple lines (centered) and grows the button height — removed the fixed `height`/`max-height` and `white-space: nowrap`, kept `min-height` for the single-line target, added `overflow-wrap: anywhere`. |
| 2026-06-17 | Section: a Section with **no `align`** now flows as **block** (block children full-width, natural-width content unstretched) instead of a stretch grid; a `gap` without alignment becomes margins between direct children, while an aligned Section (or `height="hero"`) keeps grid + grid-gap. section.css only. |
| 2026-06-17 | a1-web **component page "View as"** (Button first): a detail module that exports `viewAsModes` gets a React/Native/Pure toolbar at the top of the Configure tab; `Preview`/`Controls`/`Snippet` receive the active `viewAs` to switch the rendered props and the code (React JSX / React Native `onPress` / Pure HTML) and hide inapplicable props. a1-web Page Layout configurator also rebuilt to render a realistic real `PageLayout` with all props configurable (slot toggles, sidebar/aside placement, sticky/viewport). |
| 2026-06-17 | a1-web component menu **re-categorised** (`apps/a1-web/src/pages/components/data.js` `componentCategories` + the menu hierarchy table here): order is now **Layout & Display → Typography → Actions & Controls → Navigation → Inputs → Feedback & Messaging → Media and iconography → Overlay → Data**. **Layout**→**Layout & Display**, **Actions**→**Actions & Controls**, **Feedback**→**Feedback & Messaging**. **Tabs**, **Link**, and **Accordion** moved into **Actions & Controls**; **Figure** into **Media and iconography**; the **Disclosure** menu category was retired. **Cluster** was removed from the menu and registry metadata (PACKAGE_COVERAGE / COMPONENT_STATUS / COMPONENT_RELATED) — the deprecated component code remains. The per-package coverage tables below stay grouped by implementation family; the menu hierarchy table is the source of truth for category membership. |
| 2026-06-16 | Card: padding reduced **20px → 16px** — `base.space.card.padding` now resolves to `{base.spacing.16}` (was `{base.spacing.20}`), so `--component-card-padding` is `1rem`. Token + html-css outputs rebuilt. |
| 2026-06-16 | Slider: added **`bubbleLabel`** (an alternate value-bubble label — node or `(value, detent) => node`; visual only, `aria-valuetext` unchanged; falls back to current bubble content), and the value bubble is now **anchored by progress** (and its caret tracks the thumb) so it never spills past the control edges at the extremes. Slider.jsx/css/d.ts + `Bubble label (long size names)` / `Bubble stays within the track at the ends` stories. |
| 2026-06-16 | a1-web configurator controls refresh: all single-select controls render as `Toolbar` groups (shared `Choice` helper in `detail/configKit.jsx`) and t-shirt size/spacing scales (xs–xl, sm/md/lg, gap/content-width) as compact subtle **`ConfigSlider`**s (empty/`none` stop → `--`; the value bubble spells the size out, e.g. "Small", via `bubbleLabel` while the detent reads "Sm"). New `configKit` helpers: **`DensityChoice`** (field Size as an icon-only `density_small`/`medium`/`large` picker) and **`FieldState`** (a Toolbar of toggle buttons for boolean state). Button/IconButton/Link icon controls are a None/Left/Right icon group; Button Full width/Loading/Disabled, Code Options, field Required/Disabled/Read only, and Choice Group Required/Hide indicator/Inline icon/Multiple are Toolbar toggle groups; Slider detents are Accordions; Inline Editable "Display as" is an icon group. a1-web only — no design-system component/token changes beyond Slider above. |
| 2026-06-16 | a1-web Heading configurator: rebuilt on the Section pattern — single-select controls (Heading mark / Underline style / Type / Element / Size / Color-with-swatches) are `Toolbar` groups, Margin is a subtle `Slider`, and the editable-preview's on-selection heading-mark toolbar uses a floating `<Toolbar overlay>` with `ToolbarToggle`s. An **Advanced** accordion (with summary subtext) holds Align / Margin / Text wrap (toggle). |
| 2026-06-16 | Accordion: added **`subtext`** (secondary info in the trigger, shown only while collapsed — a glanceable summary — and hidden when open; truncates) and **`divider`** (optional bottom border to separate stacked accordions). Also **removed the trigger border-radius** and **reduced the inline padding** (sm/md/lg = `--base-spacing-4`/`8`/`12`). Accordion.jsx/css/d.ts + `Subtext` story. The a1-web Section configurator uses `subtext` to summarise each group's applied properties when collapsed, and `divider` between groups. (React only — not yet in the Pure `<details>` version.) |
| 2026-06-16 | Toolbar: a **radio group item** (`aria-checked`, can't be deselected) no longer shows a hover/active change — clicking it does nothing, so the feedback was misleading. A **toggle** (`aria-pressed`, can be turned off) keeps its hover feedback. a1-web **Section configurator** reorganised into **accordions**: a **Sizing** accordion (open) = Padding / Gap / Content width **subtle Sliders**, a **Background** accordion (open) = Inverse + Surface + Gradient (+ position), a **Border** accordion = Border size (Slider) + style/variant/sides + Radius, and an **Advanced** accordion = Height + Alignment + Element. Surface / Gradient / Border variant show colour **swatches**; gradient-position arrows point inward; Border style stays labelled (Material Symbols has no distinct solid/dashed/dotted glyphs). a1-web config side panel no longer scrolls horizontally (`overflow-x: clip`). |
| 2026-06-16 | IconButton: added **`sm`** size (24×24px target — WCAG 2.2 AA minimum — with a 16px icon; `.a1-icon-button--small` / Pure `.a1-icon-button-small`) and **enlarged the `lg` icon** to 32px (`--base-spacing-32`; was an undersized 20px). IconButton.jsx/css/d.ts + Pure + stories + a1-web configurator. |
| 2026-06-16 | Slider: added **`variant="subtle"`** — shows the selection (fill, thumb, active detent) in neutrals (`--semantic-color-text-default`) instead of the action colour, via a new `--a1-slider-active-color` var. Slider.jsx/css/d.ts + `Subtle variant` story + a1-web configurator; used by the Section configurator's Content width slider. |
| 2026-06-16 | Slider: added field-family **`size`** ("compact" / "default" / "comfortable") and a **visible `label`** (rendered above the control via `htmlFor`, sized per `size`) so a Slider matches form fields; track heights bumped (compact `--base-spacing-6`, default `8`, comfortable `12`). Slider.jsx/css/d.ts + `Sizes` story + a1-web configurator (Size control, visible label). a1-web Section configurator: **Content width** uses a compact Slider with a detent per size; **gradient position** arrows now point **inward** (toward the centre); the Display tab align default for **Slider** is `none` (it's full-width, classified Flexible). |
| 2026-06-16 | Section: added **`borderSides`** prop (`"all"` default \| array of `top`/`right`/`bottom`/`left`) — partial borders via per-side `border-width` CSS vars (`.a1-section--border-sided` + `.a1-section--border-side-*`); requires `borderSize`. Section.jsx/css/d.ts + `Border sides` story + a1-web configurator (All button + per-side toggles) + editor Section bridge. |
| 2026-06-16 | Toolbar: visual refresh — **unselected** tools use muted text, the **selected** tool uses default text on a darker neutral fill (`text-default` 16% mix) instead of the solid action background (more subtle, less contrasty). Added a **`swatch`** option (any CSS color, bordered so a light swatch doesn't bleed into the bar) on `ToolbarToggle` / `ToolbarButton` / `ToolbarGroup` options — used in the a1-web Section **Surface** control to preview surface colours. The `label` caption dropped to the new **`--semantic-font-size-body-3xs`** (0.5rem) token. New typography token `base.font.size.scale.25` (0.5rem) → `semantic.font.size.body.3xs`. |
| 2026-06-16 | a1-web Section configurator: single-select controls converted from `ChoiceGroup` to the **Toolbar** component — Element / Surface / Padding / Gap / Height / Gradient / Border size / Border style / Border variant / Radius as labelled `ToolbarGroup`s, Align as an icon group, Gradient position as the 3×3 icon grid; **Surface** shows colour swatches; **Content width** uses a `Slider` with a detent per size (`--`, XS…2XL); Inverse is now a `Toggle`. Configurator-only (no design-system change). |
| 2026-06-16 | a1-web Figure configurator: the **Custom (freeform) crop** moved off the canvas into a **dialog** — clicking "Custom" opens a `Dialog` showing the image with the freeform crop rectangle, the aspect-ratio presets below the image, and Apply/Cancel (draft state so Cancel discards). The canvas preview now always shows the result. `FigureCropTool` renders the ratio `Toolbar` below the stage (no longer an `overlay`). |
| 2026-06-16 | Toolbar: the `label` caption font size dropped one step (now `--semantic-font-size-body-2xs`, below the compact form-label size). a1-web Figure configurator reorg: Caption position moved directly under the "Caption screen-reader only" switch; crop controls grouped at the bottom (Aspect ratio → Crop grid when a ratio is set → a **Custom** button that toggles the freeform crop tool, replacing the "Custom" aspect-ratio option). |
| 2026-06-16 | Figure: added a **freeform `cropRect`** prop (`{ x, y, width, height }` fractions 0–1) — a non-destructive sub-rectangle crop rendered via a clipping wrapper (`.a1-figure__crop`) that scales/positions the image from CSS vars; the natural ratio is measured on load to size the box. Takes precedence over `aspectRatio`/`crop`; radius moves to the clip wrapper. Figure.jsx/css/d.ts + `FreeformCrop` story. (React only so far — not yet in Pure.) The a1-web configurator's **crop tool** was rebuilt as an in-preview editor (`FigureCropTool.jsx`): toggling "Crop image" turns the preview into a full-size cropper where the user draws a freeform rectangle (dimmed outside), refines it by dragging edges/corners, and constrains it to a standard ratio via a floating **overlay `Toolbar`**; the result is stored as `cropRect` metadata. Replaces the earlier focal-point crop control; editor Figure config bridge maps `cropRect`. |
| 2026-06-16 | a1-web Figure configurator: contextual controls — the **Align** group is hidden when `size` is Auto (alignment only applies once the figure has a constrained width), and **Caption position** is hidden when the caption is screen-reader-only (matching the existing Crop-hidden-unless-aspectRatio behavior). Preview + snippet omit the corresponding props in those states. |
| 2026-06-16 | a1-web component configurator: the **Display** Section alignment now defaults per component — `center` for natural-width (content-sized) components, none/full-width for flexible components (Paragraph, fields, tables) — and re-applies on navigation. Both remain overridable in the Display tab. |
| 2026-06-16 | Figure: added more standard **aspect ratios** — `4:3`, `3:2`, `2:3`, `3:4`, `9:16`, `21:9` (alongside `16:9`, `1:1`). React (`.a1-figure--ratio-*`) + Pure (`a1-pure.css` / `a1-base.css` `.a1-figure-ratio-*`) + Figure.d.ts + Storybook control + a1-web configurator. The a1-web Component-browser sidebar ("Component tree") was also rebuilt on the **TreeMenu** component (was `SideNav`), keeping search, active state, and SPA navigation. |
| 2026-06-16 | Toolbar: **overflow handling** — the bar now caps to `max-inline-size: 100%` and non-grid `ToolbarGroup`s wrap their own buttons, so tools wrap onto new rows instead of overflowing the container (no horizontal scroll). |
| 2026-06-16 | Toolbar: `showLabel` (Toggle/Button/Menu) and `showLabels` (Group) now accept a **responsive breakpoint object** (`{ xs?, sm?, md?, lg?, xl? }`) in addition to a boolean — labels can show/hide per breakpoint. Implemented with cascading per-breakpoint visibility classes on the label span (`a1-toolbar__label--show/hide-{bp}`) in `@media (--bp-*-up)`, mirroring Divider's responsive pattern; when a label can be hidden at any breakpoint the tool keeps an `aria-label` for a stable accessible name. `ToolbarShowLabel` type added; Storybook `Responsive labels` story added. |
| 2026-06-16 | Figure: **size scale** reworked — renamed `xxs`→`2xs`, added `3xs` (5rem), `xl` (50rem), `xxl` (60rem); full scale is now `3xs`/`2xs`/`xs`/`sm`/`md`/`lg`/`xl`/`xxl` (5/8/12/20/30/40/50/60rem), incl. center-align overrides. **align** gained `"none"` (now the default — normal flow; `start`/`center`/`end` are explicit, `start` adds `margin-inline-end:auto`). **radius**: removed the duplicative default — the image is square by default (the old base `var(--base-radius-container)` was an undefined token resolving to 0, identical to `radius="none"`), so the a1-web Radius control drops the redundant "Default" entry. The a1-web configurator also hides the **Crop** control unless an `aspectRatio` is set (crop has no effect on natural-ratio images). Figure.jsx/css/d.ts/stories + a1-web configurator + editor Figure config bridge updated. |
| 2026-06-16 | Toolbar: added `fullWidth` (boolean, default false — fills its container and grows the tools to share the width, dividers staying natural; default is `fit-content`) and an accessible-theme / high-contrast **border** (no boundary by default; `[data-theme='accessible']`, `@media (prefers-contrast: more)`, and `@media (forced-colors: active)` raise `--a1-toolbar-border-width` to `--component-divider-size-sm`). d.ts / Storybook (`Full width`) / a1-web configurator (Full width toggle) updated. |
| 2026-06-16 | Menu: fixed dropdown misalignment when the anchor sits inside a transformed/filtered ancestor (e.g. an `overlay` Toolbar positioned with a CSS `transform`, which becomes the containing block for the menu's `position: fixed`). `updatePosition` now measures where the menu actually landed and corrects by the containing-block offset so it stays anchored to the viewport. Affects `ToolbarMenu` opened inside an overlay toolbar. |
| 2026-06-16 | a1-web Figure configurator: the single-select controls now use the **Toolbar** component instead of `ChoiceGroup` — Radius / Size / Aspect ratio as labelled `ToolbarGroup`s (showLabels), Align / Caption position as icon `ToolbarGroup`s, and Crop as the 3×3 `ToolbarGroup columns={3}` grid; each wrapped in a `Toolbar label="…"`. Configurator-only (no design-system component/token change). |
| 2026-06-16 | Menu: the selected/active `MenuItem` (`--active`) now uses the **TreeMenu selected pattern** — a solid `--semantic-color-action-background` fill with `--semantic-color-action-foreground` text/icon (and hover/pressed/focus action states) — replacing the previous left-border + tinted-surface treatment, for a clearer highlight. Used by `ToolbarMenu`. |
| 2026-06-16 | Toolbar: added `label` (optional caption above the bar, styled to match the compact ChoiceGroup label; supplies the accessible name via `aria-labelledby`), `overlay` (floating, elevated surface — shadow + border — for a bar that hovers over content; consumer positions it), and the **`ToolbarMenu`** sub-component (button → dropdown `Menu` of choices: text-size t-shirt picker, list-type none/bulleted/numbered/checklist; caret + `aria-haspopup`/`aria-expanded`; active item marked). **Removed `ToolbarSelect`** (native select) in favour of `ToolbarMenu`. Stories + a1-web configurator updated (text-editor uses size/list menus; new Overlay example). |
| 2026-06-16 | Added **Toolbar** component (React only): compact container (`role="toolbar"`) grouping editing controls on a subtle surface, with sub-components `ToolbarToggle` (aria-pressed), `ToolbarButton`, `ToolbarGroup` (single-select radio-semantics button group; `columns` → grid like a 3×3 crop picker; icon-only or `showLabels`; clearly highlighted selection; auto "none" icon), `ToolbarMenu` (button → dropdown Menu), `ToolbarDivider`, and `TOOLBAR_NONE_ICON` (`block`). CSS-variable architecture (`--a1-toolbar-*`) over existing tokens (color-mix hover, `--component-divider-size-*` divider, focus ring). Storybook (text editor, menu, alignment, crop grid, labeled, overlay, toggles); a1-web Actions configurator (`toolbar: 'experimental'`); exported from index. Retains ChoiceGroup for full-size selectors. |
| 2026-06-16 | Slider: detent labels can carry an optional `icon` (Material Symbols name) shown in the label row instead of text (e.g. alignment icons); a1-web configurator gained an editable detent list (value / label / optional icon, add & remove). |
| 2026-06-16 | Added **Slider** component (React only): range input with optional **detents** (snap stops + optional labels like None/XS/SM/MD/LG), a value bubble that follows the thumb and flips above/below to stay in the viewport, continuous (`min`/`max`/`step`) or detent mode. Built on native `<input type="range">` for keyboard/focus/touch/form a11y; value announced via `aria-valuetext`. CSS variable architecture (`--a1-slider-*`) over existing tokens (no new token file). Storybook stories (Default, detents, labeled size control, value below, custom format, disabled); a1-web Actions configurator page; exported from package index; registered in components.md + a1-web data (`slider: 'experimental'`). |
| 2026-06-16 | Figure: added `xxs` to the `size` scale (`.a1-figure--xxs`, max-width 8rem — below `xs` at 12rem), including the center-align override. Figure.jsx/d.ts/stories ("Size scale") + a1-web configurator updated. |
| 2026-06-16 | Figure: added `aspectRatio` ("16:9" \| "1:1") and `crop` (center/top/bottom/left/right + 4 corners) props. `aspectRatio` locks the image to a fixed ratio cropped to fill via `object-fit: cover`; `crop` sets the focal point via `object-position` (CSS var `--a1-figure-crop`). React (`.a1-figure--ratio-*`, `.a1-figure--crop-*`) + Pure/base (`.a1-figure-ratio-*`, `.a1-figure-crop-*`); a1-web configurator + Storybook ("Aspect ratios", "Crop points") updated. No new tokens (aspect-ratio/object-position are structural). |
| 2026-06-16 | a1-web Editor **Projects**: the Editor opens on a Projects home; each project owns an isolated, hierarchical page tree (drag-and-drop sets the hierarchy; `level` 1–3 = nesting depth, capped at 3) edited from a tabbed sidebar (Pages tree + Layers component tree). Page metadata = title/icon/description/level. A `TopHeader` is auto-generated from the hierarchy (level-2/3 → dropdown menus) and rendered above every page in edit/preview/prototype. Links/Buttons target any page in the same project (project-scoped page-link selector). New `apps/a1-web/src/projects/` module (`projectStore.ts`, `projectNav.ts`, `ProjectsList.jsx`, `ProjectPagesPanel.jsx`, `ProjectWorkspaceSidebar.jsx`, `AllPagesView.jsx`); `EditorSidebar` now exports `ComponentTreePanel`; `PageMetadata` gained optional `icon`. No design-system component/token changes. |
| 2026-06-15 | Prop forwarding: MessageBadge, MessageEmptyState, Banner, Pagination, TopHeader, BottomDrawer, and Accordion now spread `...rest` (and merge `className`) onto their root element. These previously dropped unknown props, so the a1-web Editor's injected `data-editor-node` / `onClick` never reached the DOM and clicking them on the canvas didn't open the config panel. Fixes editor selection for those components. |
| 2026-06-15 | IconButton: added `as` prop (default `"button"`) + `href` — `as="a"` renders the icon button as a navigation link while keeping its styling; `disabled` maps to `aria-disabled` for anchors; IconButton.d.ts + Storybook `As link` story added; a1-web icon-button configurator gained a page-link selector (shared `PageLinkField` with Button/Link); editor renderer renders Button/IconButton with an href as anchors and wires intra-prototype navigation via onClick |
| 2026-06-15 | TreeMenu: added `draggable` prop (boolean, default false) and `onMove` callback (`{ draggedId, targetId, position }`) — enables drag-and-drop reordering and reparenting; drop-before/drop-after indicators use 2px accent line; drop-into shows tinted background + inset ring; collapsed branches auto-expand after 600 ms on hover; items cannot be dropped on themselves or descendants; HTML5 DnD API (no library); anchor label-btns have `draggable={false}` to suppress browser link-drag; CSS classes `a1-tree-menu__row--dragging`, `--drop-before`, `--drop-into`, `--drop-after`; Storybook `Draggable` story with live state management; EditorSidebar wired with `draggable` + `onMove`; EditorPage processes moves via `pendingMove` command prop using `extractFromNodes` + `insertInNodes` helpers; history entry double-click also triggers rename |
| 2026-06-15 | Added ContextMenu component (React only): right-click menu portaled to document.body; controlled via open/x/y; items support type=item/divider/group, icon, shortcut, variant=destructive, active state; keyboard Arrow/Home/End/Enter/Escape; clamped to viewport; Storybook stories (Default, EditorStyle, StaticPreview); a1-web detail page with file and editor examples; exported from package index; registered in components.md and a1-web data |
| 2026-06-15 | TreeMenu: added onHoverChange prop — fires on mouseenter/mouseleave of each label button; used by the Editor sidebar to mirror hover outlines onto the canvas; EditorSidebar handleTreeHover uses DOM querySelector to set data-editor-hover attr; handleTreeSelect adds scrollIntoView after selection |
| 2026-06-15 | Editor: left click on canvas selects innermost element; right click opens ContextMenu (replaces inline EditorNodePicker) with element picker + Delete action; Delete triggers delete node in EditorPage with Snackbar undo; Snackbar.d.ts added to type the component |
| 2026-06-15 | TreeMenu: separated expand/collapse from selection — toggle icon (`add_box` / `indeterminate_check_box`) only expands/collapses; label click only selects; Enter/Space selects only (no longer also toggles); keyboard Arrow Right/Left still control expand/collapse; added `showExpandControls` prop (renders "Expand all" / "Collapse all" buttons above the tree using `unfold_more` / `unfold_less` icons); reduced item `padding-block` from `base-spacing-4` to `base-spacing-2`; CSS rewritten to use `.a1-tree-menu__row` wrapper + `.a1-tree-menu__toggle` + `.a1-tree-menu__label-btn` structure; Storybook `WithExpandControls` story added; a1-web configurator gained `showExpandControls` switch |
| 2026-06-15 | Added TreeMenu component (React only): hierarchical navigation tree, unlimited nesting, icons, `href` support, full ARIA tree role + keyboard nav (Arrow/Home/End/Enter/Space), roving tabindex, expand/collapse with CSS grid animation, solid action-background selected state; component tokens in `system/tokens/component/tree-menu.json`; Storybook stories (FileExplorer, DocumentNavigation, NoIcons, DeepNesting); a1-web detail page with item editor and code snippet |
| 2026-06-15 | Code: added `editable` prop (boolean, default false) — renders `<textarea>` instead of `<pre><code>` for live editing; `onChangeValue` callback delivers the current string on each keystroke; `copyCode` copies from live textarea value when combined; CSS class `a1-code-block--editable` on wrapper, `a1-code-block__textarea` on the textarea; Storybook `Editable` story added |
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
