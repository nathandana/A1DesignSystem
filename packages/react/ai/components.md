# A1 Design System — Component Registry

**Keep this file current.** Update it whenever a component is added, removed, renamed, or its package coverage changes. This is part of the component addition checklist in `packages/react/ai/project-context.md`.

## Package key

| Column | What it covers |
|--------|---------------|
| **React** | `packages/react/src/components/{name}/` |
| **Native** | `packages/react-native/src/components/{Name}/` |
| **Pure** | `packages/pure/dist/a1-pure.css` — scoped HTML/CSS classes |
| **Web Components** | `packages/web-components/src/components/{name}/a1-{name}.js` — Lit custom elements |
| **Figma** | Component exists in the A1 Figma design system file and is documented in `packages/react/ai/figma-workflow.md`; repo-side Code Connect templates live in `packages/figma/code-connect/` when available. |

✓ = implemented  · — = not yet implemented

---

## A1 Web menu hierarchy

The a1-web Components menu is defined from this registry. Keep the order, category names, and selected Material Symbols icon names aligned with this table when updating `apps/a1-web/src/pages/Components.jsx`.

| Menu level | Route ID | Label | Selected icon | Children |
|------------|----------|-------|---------------|----------|
| Overview | `components` | Components | `widgets` | Component categories |
| Category | `components-layout` | Layout & Display | `dashboard` | Section, Card, Stack, Grid, Bleed, Inset, Spacer, Page Layout, Button Container, Canvas |
| Category | `components-typography` | Typography | `title` | Heading, Paragraph, Blockquote, List, Code, Divider, Inline |
| Category | `components-actions` | Actions & Controls | `touch_app` | Button, Action Tiles, Chip, Icon Button, Switch, Segmented Control, Slider, Toolbar, Sticky Actions, Accordion, Tabs, Link |
| Category | `components-navigation` | Navigation | `near_me` | Breadcrumb, Side Nav, Top Header, Bottom Drawer, Page Nav, Tree Menu |
| Category | `components-inputs` | Inputs | `edit_note` | Text Field, Search Field, Number Field, Date Field, Time Field, Phone Field, Zip Field, Credit Card Field, Textarea, Select, Checkbox Group, Radio Group, Choice Group, Fieldset, Field Row, Inline Editable |
| Category | `components-feedback` | Feedback & Messaging | `campaign` | Banner, Badge, Notification, Snackbar, Empty State, Status Bar, Circular Progress, Step Tracker |
| Category | `components-media-iconography` | Media and iconography | `insert_photo` | Figure, Icon |
| Category | `components-overlay` | Overlay | `web_asset` | Dialog, Overlay, Menu, Context Menu, Tooltip |
| Category | `components-data-viz` | Data Viz | `query_stats` | Node, Line Chart, Bar Chart, Area Chart, Composed Chart, Pie Chart, Scatter Chart, Radar Chart, Radial Bar Chart, Funnel Chart, Treemap Chart, Sankey Chart, Sunburst Chart |
| Category | `components-data` | Data | `table_chart` | Data Table, Stat, Definition List, Pagination, Calendar |

**Routing rules:**
- Category pages use `components-{category-id}`.
- Component pages use `component-{component-id}`.
- If a component appears in more than one registry table, keep one canonical a1-web component page and avoid duplicate route IDs.
- This menu hierarchy table is the source of truth for **category membership**. Note that several components are menu-grouped differently from the per-package coverage sections below (which group by implementation family): **Tabs**, **Link**, and **Accordion** live under **Actions & Controls**, and **Figure** under **Media and iconography**.

---

## Typography

| Component | React | Native | Pure | Web Components | Figma |
|-----------|:-----:|:------:|:----:|:--------------:|:-----:|
| Heading | ✓ | ✓ | ✓ | — | — |
| Paragraph | ✓ | ✓ | ✓ | — | — |
| Blockquote | ✓ | ✓ | ✓ | — | — |
| List | ✓ | ✓ | ✓ | — | — |
| Code | ✓ | — | — | — | — |
| Divider | ✓ | — | ✓ | — | — |
| Inline (kbd, mark, and semantic inline text) | ✓ | — | ✓ | — | — |

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

| Component | React | Native | Pure | Web Components | Figma |
|-----------|:-----:|:------:|:----:|:--------------:|:-----:|
| Link | ✓ | ✓ | ✓ | — | — |
| Breadcrumb | ✓ | — | — | — | — |
| Side Nav | ✓ | ✓ | — | — | — |
| Top Header | ✓ | — | ✓ | — | — |
| Bottom Drawer | ✓ | — | ✓ | — | — |
| Tabs | ✓ | — | — | — | — |
| Page Nav | ✓ | — | — | — | — |
| Tree Menu | ✓ | — | — | — | — |

> **Tree Menu props:** `items` (`TreeItem[]` — `{ id, label, icon?, href?, disabled?, children? }[]`), `variant` (`"expanded"` | `"collapsed"`, default `"expanded"` — collapsed renders root items as icon-only triggers and opens each branch's children in an A1 `Menu` flyout; leaf roots still select/navigate directly), `selectedId` (string | null), `onSelect` (callback), `defaultExpandedIds` (string[], uncontrolled), `expandedIds` (string[], controlled), `onExpandedChange` (callback), `showExpandControls` (boolean, default false — renders "Expand all" / "Collapse all" buttons above the expanded tree or inside a collapsed parent flyout), `onHoverChange` (callback, fires with id on mouseenter and null on mouseleave), `draggable` (boolean, default false — enables drag-and-drop reordering and reparenting), `onMove` (`({ draggedId, targetId, position: 'before' | 'into' | 'after' }) => void` — called when the user drops an item; the consumer is responsible for updating the `items` array), `editingId` (string | null — the id of the item being **renamed inline**; when set, that item's label is replaced by an auto-focused/selected text input and drag is suspended for it), `onRenameStart` (`(id) => void` — fired when the user requests a rename by **double-clicking** an item's label or pressing **F2** on the focused item; set `editingId` in response. Disabled items never fire it), `onRenameCommit` (`(id, label) => void` — fired on Enter or blur; an empty/whitespace value falls back to the original label), `onRenameCancel` (`() => void` — fired on Escape), `aria-label` (string). Items render as `<a>` when `href` is provided, `<button>` otherwise. Supports unlimited nesting depth. Expand/collapse (`add_box` / `indeterminate_check_box`) is independent from selection: clicking the toggle icon only expands/collapses the branch; clicking the label selects the node. Keyboard in expanded mode: Arrow Right expands or descends into a branch; Arrow Left collapses or moves to parent; Home/End jump to first/last visible node; Enter/Space selects only. Keyboard in collapsed mode: Arrow Up/Down/Home/End rove between root icons; Arrow Right opens a branch flyout; Arrow Left closes it; Enter/Space use the focused root trigger. Selected state uses the full action background (`--semantic-color-action-background`) for a clear, unambiguous highlight; in collapsed mode a root icon is active when it or one of its descendants is selected. Roving tabindex keeps one item in the tab sequence at a time. **Drag-and-drop:** when `draggable` is true, each expanded row becomes a drag source and drop target. Dragging over the top 30% of a row shows a "drop before" indicator; over the bottom 30% shows "drop after"; over the middle 40% of a branch node shows "drop into" (reparent). Collapsed branches auto-expand after 600 ms when held over. An item cannot be dropped onto itself or any of its descendants. **Inline rename (A1-22):** the rename UI is consumer-driven — the consumer decides when to enter edit mode (e.g. from a context-menu "Rename" item, or from `onRenameStart` on double-click / F2) by setting `editingId`, then owns the `items` update in `onRenameCommit`. The input is a real `<input aria-label="Rename item">` styled as an A1 field (focus ring); Enter/blur commits, Escape cancels, and its keydown is stopped so the tree's arrow/Enter navigation doesn't fire while editing. The a1-web editor uses this for the Layers tree, persisting a custom `node.name` that overrides the auto-derived label.

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
> **Tabs `equalHeight` — for tabs inside a Dialog/overlay.** By default `TabPanel` unmounts inactive panels and the panel area sizes to the **active** tab, so switching between tabs whose panels differ in height changes the container height. On a **page** that's correct — don't make tab strips reserve the tallest panel's height (it wastes space). Inside a **Dialog** (or any centered overlay) it's jarring: the dialog resizes and re-centers, so its footer/controls (the targets) move under the pointer. Set **`equalHeight`** on `<Tabs>`: it keeps every panel mounted, stacked in one grid cell, so the area always reserves the **tallest** panel's height and the container never resizes on switch (inactive panels are `visibility: hidden` + `aria-hidden`, so they hold their height but stay out of the tab order and a11y tree). It's **opt-in** (default `false`) precisely so page tabs keep their natural per-tab height. The backlog ticket dialog uses it for its Details/Activity tabs.
>
> **Tabs `labelMode`** (`"all"` default | `"selected"`) — `"all"` shows every tab's label at all breakpoints. `"selected"` shows the label **only on the active tab**; inactive tabs render **icon-only** (the label stays in the DOM, so the accessible name is preserved). Pair with a `Tab` `icon` so inactive tabs aren't blank, and give **every** Tab a label. Mirrors `ToolbarGroup`'s `labelMode`. (This replaced an old, unconditional "hide inactive labels at xs/sm" rule that blanked label-only tab strips — label visibility is now opt-in, so plain text tabs keep their labels at every breakpoint.) The Backlog board uses it at xs/sm, where each swimlane becomes a compact tab.
>
> **Tabs overflow (line variant) — scrolls, never forces width.** When a `line` tab strip has more tabs than fit, it **scrolls internally** and shows prev/next chevron arrows automatically; it never widens its container or forces a horizontal page scroll. This is handled in the component (the scrollable list has `min-width: 0`, and the Tabs root + list wrapper are capped at the parent width), so consumers don't need to wrap Tabs in their own scroll container. The **selected** tab is kept in view by adjusting only the strip's own horizontal scroll. (Other variants: `pills` wraps; `segment`/`progress`/`folder` size to content.)
>
> **SideNav behavior rules:**
> - **Desktop (≥1025px):** SideNav is sticky (`position: sticky; top: 0; height: 100vh`). Do not wrap it in a container that has `overflow: hidden` or `overflow: auto` — this breaks sticky positioning.
> - **Mobile/tablet (≤1024px):** SideNav is a fixed overlay that slides in from the edge. Control it with the `open` and `onClose` props. Do not force it to be permanently visible at these breakpoints.
> - **Internal scroll:** The nav item list scrolls internally when content overflows. The header and footer slots are outside the scroll region and always remain visible — do not place them inside the nav item list.

---

## Actions & Controls

> Menu category **Actions & Controls** also includes **Tabs** and **Link** (see [Navigation](#navigation)) and **Accordion** (see [Disclosure / Accordion](#disclosure--accordion)); their coverage rows stay in those implementation-family sections.

| Component | React | Native | Pure | Web Components | Figma |
|-----------|:-----:|:------:|:----:|:--------------:|:-----:|
| Button | ✓ | ✓ | ✓ | ✓ | ✓ |
| Split Button | ✓ | — | — | — | — |
| Action Tiles | ✓ | — | — | — | — |
| Chip | ✓ | — | — | — | — |
| Icon Button | ✓ | ✓ | ✓ | — | — |
| Switch | ✓ | — | — | — | — |
| Segmented Control | ✓ | — | — | — | — |
| Slider | ✓ | — | — | — | — |
| Toolbar | ✓ | — | — | — | — |
| Sticky Actions | ✓ | — | — | — | — |

> **Menu grouping:** **Accordion**, **Tabs**, and **Link** are also menu-grouped under **Actions & Controls**; their coverage rows and notes live in their implementation-family sections ([Disclosure / Accordion](#disclosure--accordion), [Navigation](#navigation)). **Split Button** has no separate menu page — it is surfaced via the Button page's **Split (menu)** toggle.
>
> **ActionTiles props (A1-389):** `layout` (`"grid" | "stack"`, default `"grid"`), `gap` (boolean, default `true`), `iconLayout` (`"auto" | "top" | "side" | "none"`, default `"auto"`), and `children` (one or more `<ActionTile />` elements; a single child is valid). `ActionTile` accepts `icon`, `title`, `subtitle`, optional `accessory`, optional `footer`, and optional `as` / `href` for whole-tile navigation or button semantics. The component no longer exposes a body slot or manual size prop: spacing, icon size, and heading scale respond to each tile's container width instead. `iconLayout="auto"` stacks the icon above the text on narrow containers and shifts it beside the copy on wider ones; `iconLayout="none"` hides icons at the group level. Interactive tiles use the same blue border treatment as navigation Card, do not carry a shadow, and automatically drop nested accessory/footer controls so interactive elements are never nested inside an interactive tile. Token-driven via `system/tokens/component/action-tile.json` (`--component-action-tile-*`). React only; has an a1-web component page + live configurator under **Actions & Controls** (`/components/action-tile`).
>
> **Chip props (A1-390):** `ChipGroup` owns chip rows and selection: `selectionMode` (`"none" | "single" | "multiple"`, default `"none"`), `value` / `defaultValue`, `onChange`, `wrap` (boolean, default `true`), `size` (`"sm" | "md" | "lg"`, default `"md"`), `label`, and `children`. `Chip` accepts `icon`, `title` or children, `selected`, `disabled`, `size`, `as` / `href` for navigation chips, and `menu` / `menuLabel` for filter chips that open an A1 `Menu`. Use `selectionMode="single"` or `"multiple"` for selectable filter chip rows, `selectionMode="none"` for navigation and menu-trigger rows, and `wrap={false}` only for intentionally one-line chip toolbars. React only; has an a1-web component page + live configurator under **Actions & Controls** (`/components/chip`).
>
> **SplitButton props:** `children` (main label), `onClick` (main action), `variant` / `size` / `icon` / `iconPosition` / `loading` / `disabled` (shared with Button — both targets), `actions` (`{ id, label, icon?, disabled?, onClick? }[]` shown in the dropdown `Menu`), `menuLabel`, `toggleLabel`. The main button runs the default action; the caret toggle on its inline-end opens the menu (`aria-haspopup="menu"` + `aria-expanded`). Composes the A1 `Button` + `Menu`; the two targets share one pill outline with a hairline divider. React only.
>
> **Button label wrapping:** A long Button label wraps onto multiple lines (centered) and grows the button height; a single line keeps the standard target height via `min-height`. (Removed the fixed `height`/`max-height` + `white-space: nowrap`.)
>
> **Figma Button component:** A1-419 created the Figma component set in the A1 Design System file on the Button page (`node 123:701`) with `Variant`, `Size`, `State`, and `IconPosition` axes plus `Label`, `Show icon`, and `Icon` component properties. Figma asset search/insert intentionally defaults to `secondary` + `md`; React's runtime default remains `primary` + `md`. Button color variables are single-mode aliases to the Color collection's `color/button/*` roles so light/dark mode is switched only once through Color, including destructive/success hover and pressed states. Button labels use dedicated Figma text styles by size (`Button/sm`, `Button/md`, `Button/lg`) to match React font weights. See `packages/react/ai/figma-workflow.md` for the React-to-Figma mapping gaps and `packages/figma/code-connect/Button.figma.ts` for the Code Connect template.
>
> **Pure notes:** Button uses `.a1-button` + `.a1-button-{type}` + `.a1-button-{size}` + `.a1-button-pill`. Icon Button uses `.a1-icon-button`.
>
> **Slider props:** `value` / `defaultValue` / `onChange(value)` (number; in detent mode the value is a detent's value), `min` (0), `max` (100), `step` (1) for continuous mode; `detents` (optional — `number[]` or `{ value, label?, icon? }[]`; the thumb snaps between detents, the keyboard moves one detent at a time, and labels render under the track, e.g. None/XS/SM/MD/LG. A detent's `icon` (Material Symbols name) renders in the label row **instead of** its text label — provide a `label` too so screen readers and the value bubble have a text alternative); `label` (a **visible field label** rendered above the control and associated via `htmlFor` — also the accessible name; sized to match the field family per `size`. Use `aria-label`/`aria-labelledby` for an invisible name); `size` ("compact" | "default" | "comfortable", default "default" — mirrors the **field family** so a Slider sits naturally beside fields; scales the label, detent labels, track, and thumb); `variant` ("default" | "subtle", default "default" — "subtle" shows the selection (fill, thumb, active detent) in **neutrals** instead of the action colour); `showValue` (boolean, default true — the floating value bubble shown while dragging/focused); `valuePosition` ("above" | "below", default "above" — flips to stay in the viewport); `formatValue(value)` (custom bubble + `aria-valuetext`); `bubbleLabel` (an alternate **value-bubble** label — a node, or `(value, detent) => node`; **visual only**, `aria-valuetext` is unchanged; falls back to the current bubble content when omitted — used to spell a size out in the bubble, e.g. "Small", while the detent under the track stays "SM"); `disabled`; `name` (form value). Built on a native `<input type="range">` so keyboard (arrows, Home/End, Page Up/Down), focus, touch, and form semantics work out of the box; the value is announced via `aria-valuetext`. The value bubble is anchored by progress (and its caret tracks the thumb) so it never spills past the control edges at the extremes. React only. Sample use: editor size/padding controls, or the Section configurator's Content width (compact, with a detent per size). **Visual model:** the thumb (handle) sits **inside** the track — the track is as tall as the thumb (it contains the handle rather than the handle riding on a thin rail) and carries a subtle 1px border, so the whole track is the touch target. Sizes scale together per `size`. Token-only (`--a1-slider-track-height` / `-thumb-size` / `-track-border`); no prop change.
>
> **Toolbar:** a compact container that groups related editing controls on one subtle surface — think a text-editor toolbar, or the controls in the component configurator (it's denser than a ChoiceGroup; ChoiceGroup is retained for full-size selectors). Compositional API — exports `Toolbar` plus tool sub-components, separated by `<ToolbarDivider />`. Toolbar props: `aria-label` (used when there's no visible label), `label` (optional visible caption rendered above the bar — tied to the **same tokens as a compact form label** (size, weight, colour) so it's styled identically to a field/legend label beside it, A1-165; also supplies the accessible name via `aria-labelledby`), `overlay` (boolean, default false — lifts the bar onto a floating, elevated surface (shadow + border) for a toolbar that hovers over page content, e.g. a selection formatting bar; the consumer positions it), `fullWidth` (boolean, default false — by default the bar is `fit-content` wide; when true it fills its container and the tools grow to share the available width, dividers keeping their natural size), `overflow` (boolean, default false — keeps the toolbar on one row and moves trailing direct children into a More menu when the toolbar is narrower than its contents; when a `ToolbarMenu` overflows, **its items render inline in the More menu as a labelled section** rather than opening a nested menu-from-a-menu — original order is preserved, the active selection stays marked, and choosing an inline item closes the More menu), and `overflowLabel` (accessible name/tooltip for that More trigger). Use Toolbar-level `overflow` for a whole bar that needs to stay one row; use `ToolbarGroup overflow` when only one group has many options. The bar carries a **hairline subtle border** by default (A1-220) for definition against the page surface, and steps that border up to a thicker, stronger boundary in the **accessible theme** and under OS **high-contrast** (`prefers-contrast: more` / `forced-colors`) so it stays clearly delimited. Sub-components:
> - **`ToolbarToggle`** — two-state toggle button (`icon`, `swatch`, `label`, `pressed`, `onChange(pressed)`, `showLabel`, `disabled`). `aria-pressed`.
> - **`ToolbarButton`** — plain action button (`icon`, `swatch`, `label`, `onClick`, `showLabel`, `disabled`).
> - **`ToolbarGroup`** — single-select button group with **radio semantics** (`role="radiogroup"`, roving tabindex, arrow-key navigation): `value`, `onChange(value)`, `options` (`{ value, label?, icon?, swatch?, showLabel?, overflowPriority?, disabled? }[]`), `showLabels` (default false = icon-only), `labelMode` (`"all"` default \| `"selected"` — `"selected"` shows the label only on the currently selected option; the rest render icon/swatch-only and a `"none"`/empty value falls back to the standard none icon, while non-selected options keep an `aria-label`. Use it for a swatch/variant picker where only the chosen option is named, e.g. Section surface/gradient and Button/IconButton variant), `columns` (set it for a grid — e.g. `columns={3}` for a 3×3 crop-direction picker, far smaller than a ChoiceGroup), `overflow` (boolean, default false — non-grid groups measure available inline space and add an icon-only overflow menu at the end containing the full option list in original `options` order; visible buttons may be prioritised with per-option `overflowPriority`), `aria-label`. An option with value `"none"`/`""`/`null` and no `icon` gets the standard none icon in icon-only mode.
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
> **Button `fullWidth` and `loading`:** `fullWidth` (boolean, default false) stretches the button to fill its container; when false it keeps its natural content width. `loading` (boolean, default false) shows a `CircularProgress` indicator in place of the icon and makes the button inert (disabled + `aria-busy`) — use it for in-progress actions like form submission, paired with a present-tense label ("Saving…"). **IconButton has neither prop — it is always a fixed square at natural width and must never be stretched (rule `icon-button-natural-width`).**
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
> **IconButton `size`:** `"sm" | "md" (default) | "lg"`. `sm` is a **28×28px** target with a 20px icon (opsz 20) — matches Button `sm` exactly, so they pair naturally in dense toolbars. `md` is the standard 40×40px target. `lg` matches Button's large target (3.5rem) with a 32px icon. CSS: `a1-icon-button--small` / `--large` (React), `a1-icon-button-small` / `-large` (Pure).

---

## Inputs

| Component | React | Native | Pure | Web Components | Figma |
|-----------|:-----:|:------:|:----:|:--------------:|:-----:|
| Text Field (text, email, password) | ✓ | — | ✓ | — | ✓ |
| Search Field | ✓ | — | — | — | — |
| Number Field | ✓ | — | — | — | — |
| Date Field | ✓ | — | — | — | — |
| Time Field | ✓ | — | — | — | — |
| Phone Field | ✓ | — | — | — | — |
| Zip Field | ✓ | — | — | — | — |
| Credit Card Field | ✓ | — | — | — | — |
| Textarea | ✓ | — | ✓ | — | — |
| Select | ✓ | — | ✓ | — | — |
| Checkbox Group | ✓ | — | ✓ | — | — |
| Choice Group | ✓ | — | — | — | — |
| Radio Group | ✓ | — | ✓ | — | — |
| Fieldset | ✓ | — | ✓ | — | — |
| Field Row | ✓ | — | — | — | — |
| Switch (input) | ✓ | — | — | — | — |
| Inline Editable | ✓ | — | — | — | — |
| Autocomplete | ✓ | — | — | — | — |

> **Autocomplete props:** `options` (`(string | { value, label, swatch?, icon?, group? })[]`), `value` (string in single mode, `string[]` in multi), `onChange`, `multiple` (boolean, default false — renders removable chips), `allowCreate` (boolean, default false — offers an "Add …" option for a value not in the list) + `onCreate(value)`, `variant` ("default" | "color", default "default" — `"color"` renders a colour swatch beside each option, chip, and the selected value; each option's swatch is its `swatch` or, in colour mode, its `value`. Pair with `allowCreate` for a "pick from the palette or type a hex" colour field), `label`, `hint`, `error`, `size` ("compact" | "default" | "comfortable", matches the field family), `required`, `disabled`, `emptyText`, `createLabel(query)`, `maxVisible` (number — cap how many options render for very large lists; excess is hidden behind a "keep typing" footer), `moreText(shown)`, `aria-label`. **Option `icon`** renders a Material Symbols glyph beside the option / chip / selected value (e.g. an icon picker). **Option `group`** turns on grouped rendering: when any option has a `group`, the listbox shows a **sticky heading** before each group's options and orders results by each group's first appearance (pass options pre-sorted by group). The dropdown listbox portals to `document.body` (fixed-positioned, tracks the control) so it is never clipped inside an Accordion or other overflow container. ARIA combobox/listbox pattern: input `role="combobox"` with `aria-expanded`/`aria-activedescendant`; keyboard Arrow Up/Down to navigate, Enter to select, Escape to close, Backspace to remove the last chip (multi). Used by the a1-web image library for category tagging and the configurator **icon picker** (grouped by Material Symbols category). React only.

> **Figma Text Field component:** A1-959 created the Text Field component set in the A1 Design System file on the Text Field page (`node 148:1360`) with `Size`, `LabelPosition`, and aggregate `State` variants plus `Label`, `Value`, `Hint`, and `Error` text properties. Field-specific hover/read-only/focus colors are Color collection aliases with Light/Dark values; exact field dimensions live in the Field FLOAT collection; label text uses Field label styles where React requires semibold weight. Code Connect template: `packages/figma/code-connect/TextField.figma.ts`. Runtime-only props (`type`, `autoComplete`, `inputOverlay`, events, native input passthrough, `aria-*`, `id`, `className`, `style`, `ref`) are documented as Figma gaps in `packages/react/ai/figma-workflow.md`.

> **Choice Group props:** `size` ("compact" | "default" | "comfortable", tile density, default "default"), `columns` (number for a fixed count at all breakpoints, or a breakpoint object `{ xs?, sm?, md?, lg?, xl? }` for responsive column counts; omit for auto-fill), `multiple` (boolean — false = radio/single-select, true = checkbox/multi-select, default false), `inlineIcon` (boolean — places each tile's icon to the left of the label/subtext instead of above the content block, default false), `hint`, `error`, `success` (group-level messages), `required`. Pass `options` for a flat list or `sections` (`{ label, options }[]`) for labeled subgroups with dividers. Each option accepts `value`, `label`, `subtext?`, `icon?` (Material Symbols name), `disabled?`. Value is `string` for single-select, `string[]` for multi-select. Selection indicator: circle for radio, rounded square for checkbox, both in the top-start corner of each tile.
>
> **Field family:** the text-input family is a set of individual components that share the `TextField` base (label, hint, error, size, labelPosition, required, disabled, readOnly): `TextField` (text/email/password), `SearchField` (leading search icon + trailing clear button), `NumberField` (adds `prefix`, `unit`), `DateField`, `TimeField`, `PhoneField` (mask), `ZipField` (mask + `ZIP_MASKS`), `CreditCardField` (mask). They each have their own a1-web page and Storybook entry. Fields have no `placeholder` by design.
>
> **SearchField props:** extends the `TextField` base. Renders a native `type="search"` input with a **leading search icon** (decorative) and a **trailing clear button** shown only when there's a value and the field is editable (native browser clear is suppressed). `onChange` (every keystroke), `onClear` (after the clear button empties the field), `onSearch(value)` (fired on Enter), `clearLabel` (accessible name for the clear button; defaults to the `field.clearSearch` label, "Clear search"). Controlled or uncontrolled — the clear button dispatches a native input event so controlled consumers' `onChange` fires too. For a compact search bar, pass `aria-label` and omit the visible `label`. CSS: `.a1-field--search` + `.a1-field--search-has-value` (logical padding, RTL-correct). React only; used by the a1-web Components sidebar filter.
>
> **Field autocomplete:** editable field-family components forward `autoComplete` to the native input for browser/password-manager autofill (e.g. `"email"`, `"username"`, `"current-password"`, `"new-password"`, `"tel"`, `"postal-code"`, `"cc-number"`, `"off"`). When `readOnly` is true, `TextField` and `TextareaField` force autocomplete off, add common password-manager ignore hints, and restore their existing value if an autofill/input event still fires; `SearchField` also hides its clear button in read-only mode. The a1-web configurators seed sensible defaults for editable fields (Text Field email → `email`, Phone → `tel`, Zip → `postal-code`, Credit Card → `cc-number`); always set an appropriate `autoComplete` on real editable forms so autofill works.
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

| Component | React | Native | Pure | Web Components | Figma |
|-----------|:-----:|:------:|:----:|:--------------:|:-----:|
| Banner | ✓ | ✓ | — | — | — |
| Badge | ✓ | ✓ | — | — | — |
| Notification | ✓ | — | — | — | — |
| Snackbar | ✓ | ✓ | — | ✓ | — |
| SnackbarStack | ✓ | — | — | — | — |
| Empty State | ✓ | ✓ | — | — | — |
| Status Bar | ✓ | — | — | — | — |
| Circular Progress | ✓ | — | ✓ | — | — |
| Step Tracker | ✓ | — | ✓ | — | — |

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
> **Snackbar props:** `open` (boolean, required — renders nothing when false), `position` ("bottom" | "bottom-left" | "bottom-right" | "top" | "top-left" | "top-right", default "bottom"), `actionLabel` + `onAction` (both required to show the action button — omit either to hide it), `onClose` (called when dismissed or auto-hidden), `dismissible` (boolean, default true — shows the dismiss IconButton when `onClose` is provided), `autoHideDuration` (React, milliseconds before calling `onClose`; omit or pass 0 to disable; pauses while hovered or focused), Web Component `auto-hide-duration` (milliseconds before firing `a1-close`; 0 disables), React Native `duration` (milliseconds before `onDismiss`; 0 disables), and `children` (message content). Snackbar has one default visual style and applies its inverse treatment internally for child controls; use Banner for persistent status-coloured messages.
>
> **SnackbarStack:** React exports `SnackbarStack` for intentional multiple-snackbar displays. It fixes one stack container at the chosen `position` and renders each item as a static Snackbar with the existing border and shadow separation. Pass items in visual order; put the newest first for toast-like stacks. Keep stacks short and move durable history into a notification center or page.
>
> **Snackbar accessibility:** Uses `role="status"` and `aria-live="polite"` by default. Do not override `role` unless you have a specific reason.
>
> **Snackbar is not a modal:** It renders as a fixed overlay and does not trap focus. Use it for brief, non-blocking feedback only. For errors that require user action before continuing, use a Dialog or Banner instead.

> **A1 Web configurators:** Feedback pages include configurators for Banner, Badge, Notification, Snackbar, Empty State, Status Bar, Circular Progress, and Step Tracker. Status Bar keeps the `status-bar` route and emits the `StatusBar` React export in code snippets.

---

## Layout & Display

> Menu category **Layout & Display**. Figure's coverage row stays in this table (implementation family) but it is **menu-grouped under [Media and iconography](#media-and-iconography)** — see the menu hierarchy table.

| Component | React | Native | Pure | Web Components | Figma |
|-----------|:-----:|:------:|:----:|:--------------:|:-----:|
| Section | ✓ | ✓ | ✓ | — | — |
| Card | ✓ | ✓ | — | — | — |
| Stack | ✓ | — | — | — | — |
| Grid | ✓ | — | — | — | — |
| Bleed | ✓ | — | — | — | — |
| Inset | ✓ | — | — | — | — |
| Spacer | ✓ | — | — | — | — |
| Page Layout | ✓ | — | — | — | — |
| Button Container | ✓ | ✓ | — | — | — |
| Figure | ✓ | — | ✓ | — | — |

> **Pure notes:** Section uses `.a1-section`. Footer uses `.a1-footer`. Figure uses `.a1-figure` with `.a1-figure-ratio-16-9` / `.a1-figure-ratio-1-1` for fixed ratios and `.a1-figure-crop-{top|bottom|left|right|top-left|top-right|bottom-left|bottom-right}` for the crop focal point (sets `--a1-figure-crop`).
>
> **Figure props:** `src` (required), `alt`, `caption`, `captionSrOnly`, `captionPosition` ("start" | "center"), `radius` ("none" | "sm" | "md" | "lg" — the default, no prop, is square = "none"), `size` ("3xs" | "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl"), `align` ("none" default — normal flow | "start" | "center" | "end"), `aspectRatio` ("16:9" | "4:3" | "3:2" | "1:1" | "2:3" | "3:4" | "9:16" | "21:9" — locks the image to a fixed ratio and crops to fill via `object-fit: cover`; omit for the natural ratio), `crop` ("center" default | "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right" — focal point used when the image is cropped, i.e. with `aspectRatio` or a fixed height; maps to `object-position`), `cropRect` (`{ x, y, width, height }` — a **freeform crop**: a sub-rectangle of the image as fractions 0–1 of the natural image, applied non-destructively via CSS, never altering the image; takes precedence over `aspectRatio`/`crop`), `marginTop` / `marginBottom` ("sm" | "md" | "lg"), `bleed` (boolean or numeric spacing token), `placeholder` (boolean, default true — when `src` is missing or fails to load, show a tokenized diagonal-stripe placeholder pattern with a centered icon instead of a broken image; respects `aspectRatio`/`size`, falls back to a 4:3 box), `placeholderIcon` (Material Symbols name, default "image").
>
> **Figure crop (a1-web configurator):** crop uses the preset approach by default — an **Aspect ratio** control (Natural / 16:9 / 4:3 / 3:2 / 1:1 / 2:3 / 3:4 / 9:16 / 21:9) and, when a ratio is set, a 3×3 **Crop** focal-point grid (the 9 named `crop` points). A **Custom** button below the crop grid opens a **dialog**: the image is shown with a freeform crop rectangle (drag anywhere to draw, drag an edge or corner to refine; outside is dimmed), the aspect-ratio presets sit below the image, and **Apply** / **Cancel** commit or discard the crop. Preset mode emits `aspectRatio` + `crop`; Custom mode emits `cropRect` metadata. (Selecting an aspect ratio exits Custom mode; **Clear** removes a custom crop.)
>
> **Card props:** `icon` renders a small tokenized icon block above card content (`.a1-card__icon`). `heroIcon` renders a full-bleed colored header area (`.a1-card__hero`). Use these props instead of custom icon spans — do not recreate the icon block with custom CSS classes. `variant="navigation"` makes the whole card a link/button; pass `href` to render it as an `<a>` (the a1-web Card configurator exposes the same project-scoped page-link selector as Button/Link/IconButton, so a navigation card can target another page in the project).
>
> **Card `status` / `statusLabel` / `statusPulse`:** `status` (`"neutral" | "info" | "success" | "warn" | "error"`, default none) draws a tokenized **side stripe** down the card's inline-start edge (a clipped `::before`). Stripe colours come from the `component.card.status.*` palette — neutral/info/error alias the semantic tokens, while **warn and success are two ramp steps lighter** than the status background so a thin stripe reads as amber/green rather than the very dark background tone. `statusLabel` (ReactNode) renders a small `MessageBadge` (tinted to match `status`) at the top of the card content — the "stripe with a badge". `statusPulse` (boolean, default false) **subtly pulses** the stripe to signal in-progress/ongoing work and **respects `prefers-reduced-motion`** (static under reduce). **Rule `card-status-not-color-only` (WCAG 1.4.1):** status must never be colour-only — pair the stripe with `statusLabel` or status text the card carries or sits within (e.g. a labelled board lane). Tokens: `component.card.statusStripe.width`, `component.card.statusPulse.duration`, `component.card.status.{neutral,info,success,warn,error}`. CSS: `.a1-card--has-status` + `.a1-card--status-{tone}` + `.a1-card--status-pulse` + `.a1-card__status-badge`. The a1-web Backlog board/queue cards use it via `STATUS_STRIPE_TONE` / `STATUS_STRIPE_PULSE` (New → no stripe, Triaged → neutral, Accepted → info, In progress → info + pulse, Done → success + pulse, Released → success; status named in the lane header / StatusBadge). (React only; the Pure package has no Card. React Native Card parity is a follow-up.)
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
>
> **Section background image (A1-345):** `backgroundImage` (URL string) layers a **decorative** image behind the section content — background images are invisible to assistive technology, so content-bearing images belong in `Figure`. `backgroundFit` (`"cover"` default | `"contain"` | `"tile"` — tile repeats at natural size), `backgroundPosition` (focal point, same 9-value vocabulary as Figure's `crop`: `"center"` default | `"top"` | `"bottom"` | `"left"` | `"right"` | `"top-left"` | `"top-right"` | `"bottom-left"` | `"bottom-right"`), `backgroundOverlay` (`"darken"` | `"lighten"` — a scrim between the image and content **for contrast**; pair `darken` with the `inverse` prop so text switches to the light-on-dark scheme) and `backgroundOverlayStrength` (`"sm"` | `"md"` default | `"lg"`). Layer order: overlay scrim → image → surface colour (the `surface` still paints beneath, visible before load and through `contain`/`tile` gaps). `backgroundImage` **takes precedence over `gradient`** — the wash is suppressed while an image is set. Implementation: a single background stack on the section element (no extra DOM); the URL travels via the `--a1-section-bg-image` custom property; overlay colour/strength come from `component.section.backgroundOverlay.*` tokens via `color-mix`. Rules `section-background-image-contrast` / `section-background-image-decorative` in `system/rules/section.yaml`. React + Pure (`a1-base.css`: `.a1-section-bg-image` + `-bg-fit-*` / `-bg-pos-*` / `-bg-overlay-*` classes with the URL set inline as `style="--a1-section-bg-image: url('…')"`); not in React Native.

---

## Overlay

| Component | React | Native | Pure | Web Components | Figma |
|-----------|:-----:|:------:|:----:|:--------------:|:-----:|
| Dialog | ✓ | ✓ | — | — | ✓ |
| Overlay | ✓ | — | — | — | — |
| Menu | ✓ | — | — | — | ✓ |
| Context Menu | ✓ | — | — | — | — |
| Tooltip | ✓ | — | ✓ | — | — |
| Bottom Sheet | ✓ | — | — | — | — |

> **Menu label styling:** `MenuSection` labels use compact muted menu chrome. When fields or choice groups are embedded inside a `Menu` (for settings-style panels), their labels and legends are overridden to the same compact muted treatment so full-form label emphasis does not appear inside menu panels. The controls themselves keep their component sizing and behavior.
>
> **Figma Dialog component:** A1-1418 created the Dialog component set in the A1 Design System file on the Dialog page (`node 228:1628`) plus a `Dialog Hero Icon` child component set (`node 228:1013`). Dialog uses grid auto layout only because it has multiple variants: `Size` (`sm`, `md`, `lg`, `xl`) × `Status` (`none`, `success`, `error`, `warn`, `info`, `neutral`), ordered so the Figma default is `Size=md, Status=none` to match React. Component properties expose `Title`, `Body`, `Show close`, and `Show footer`; `_body` and `_footer` frames act as editable composition slots. Status hero icons and surfaces bind to shared Color variables, width/padding/radius/footer-border dimensions bind to Components collection Dialog variables, and row/column labels are locked documentation chrome. Code Connect template: `packages/figma/code-connect/Dialog.figma.ts`. Runtime-only behavior (`open` state, native `<dialog>`, Escape/backdrop dismissal, focus trap, `onClose` callback semantics, `icon` override, refs, and arbitrary native dialog attributes) is documented as a Figma gap in `packages/react/ai/figma-workflow.md`.
>
> **Figma Menu component:** A1-1420 created the Menu shell component in the A1 Design System file on the Menu page (`node 218:1177`) plus a separate Menu Item child component set (`node 218:1176`). Menu is a single vertical auto-layout shell with a section label and `_items` slot frame; it is not a grid/variant set. Menu Item owns the `State` axis (`default`, `hover`, `focus`, `pressed`, `active`, `disabled`, `destructive`) plus editable `Label`, `Shortcut`, `Show icon`, `Show shortcut`, and `Icon` instance-swap properties. The Menu Item set uses grid auto layout with 64px padding on a page-surface fill, locked auto-layout row/column labels, Components collection Menu FLOAT variables, shared Color collection bindings, variable-bound icon vectors, and a dark-mode validation frame. Code Connect templates: `packages/figma/code-connect/Menu.figma.ts` and `packages/figma/code-connect/MenuItem.figma.ts`. Runtime-only behavior (`open`, `onClose`, `anchorRef`, viewport positioning, focus trap, mobile modal mode, `href`, event handlers, refs, arbitrary children beyond documented slots) is documented as a Figma gap in `packages/react/ai/figma-workflow.md`.

> **Overlay props (A1-417):** `open` (boolean), `onClose` (optional — when provided, renders the close button and handles Escape), `status` (`"neutral" | "info" | "success" | "warn" | "error"`, default `"info"`), `icon` (string | null — defaults to the status icon; pass `null` to hide), `title` (ReactNode — primary heading and default accessible label), `body` (ReactNode — supporting copy and default accessible description), `actions` (ReactNode — usually one primary action plus optional secondary), `dismissLabel` (string — close button accessible label, default from `system/labels/overlay.json`), and `children` (additional supporting content). Overlay is a full-screen native-dialog surface for rare, high-emphasis status moments such as game results, major completion states, or blocking announcements. Prefer Dialog, Banner, Snackbar, or Notification for routine feedback.

> **BottomSheet props:** `title` (string — the first line shown in the header; the only thing visible when collapsed), `detents` (`number[]` — expanded heights as viewport-height fractions 0–1, smallest first; default `[0.5, 0.92]`), `detent` (number — controlled snap index; **0 = collapsed**, then one index per `detents` entry), `defaultDetent` (number, default 1), `onDetentChange` (`(index) => void`). A **fixed** panel attached to the bottom of the viewport that overlays content with **no scrim** — separation is via an upward **shadow**. A **drag handle** in the header resizes it: drag down to **collapse** (header / first line of the title only), drag up to **snap** to a detent; a tap toggles collapsed ↔ largest detent; keyboard Arrow Up/Down step detents, Enter/Space toggles. Content **scrolls internally**; there is **no footer**. Expanded height is capped below sticky top chrome by default using `--component-top-header-height`; consumers without a TopHeader can override `--a1-bottom-sheet-block-start-offset`. The component renders an invisible in-flow **spacer** sized to the collapsed footprint so page content can always scroll clear of the sheet (mount it as the last child of the scroll container). **Only rendered at xs and sm** (`@media (--bp-md-up) { display: none }`). React only. CSS-variable architecture (`--a1-bottom-sheet-*`) over `system/tokens/component/bottom-sheet.json`.

> **ContextMenu props:** `open` (boolean, default false), `x` (number — viewport x position, typically `event.clientX`), `y` (number — viewport y position, typically `event.clientY`), `items` (`ContextMenuEntry[]`), `onClose` (() => void — called on outside click or Escape), `aria-label` (string, default "Context menu"). Items are typed: `{ type?: 'item'; id; label; icon?; shortcut?; variant?: 'default' | 'destructive'; active?; disabled?; onClick? }` | `{ type: 'divider'; id }` | `{ type: 'group'; id; label }`. Portals to `document.body`. Keyboard: Escape closes, Arrow Up/Down navigates items, Home/End jump to first/last, Enter activates. Closes on outside mousedown. The position is clamped to stay within the viewport.
>
> **ContextMenu usage:** Mount the component once in the host element alongside the triggering content. Set `open`, `x`, and `y` from the `onContextMenu` handler on the container element. Do not use a separate trigger button — ContextMenu is always triggered by a right-click (contextmenu event).

> **Tooltip props:** `content` (ReactNode — short, non-interactive message), `children` (trigger element), `placement` (`"top" | "right" | "bottom" | "left"`, default `"top"`), `delay` (milliseconds, default 400, clamped 0–1500), `disabled` (boolean), `className` (tooltip surface class). Tooltip opens on hover and keyboard focus, closes on pointer leave, blur, or Escape, portals to `document.body`, and sets `role="tooltip"` plus `aria-describedby` on the trigger when open. Placement is a preference; the surface clamps to the viewport. Use Tooltip only for brief supporting context — do not put interactive controls or essential task instructions inside it.

> **Dialog props:** `open` (boolean), `onClose` (optional — called on **Escape**, the **close button**, or a **backdrop click** (clicking outside the dialog box); omit to hide the close button entirely and make the dialog non-dismissable), `title` (optional), `footer` (ReactNode), `status` ("success" | "error" | "warn" | "info" | "neutral" — renders a full-bleed colored hero band at the top with a status icon), `icon` (string — overrides the default status icon when `status` is set).
>
> **Dialog scrolling rule (`dialog-vertical-scroll-only`):** Dialog bodies scroll **vertically only**. Do not add horizontal scrolling to a dialog or let a child force the dialog wider than the viewport. Wide child content must wrap, shrink, clip, or use its own governed overflow behavior (for example Toolbar overflow), while the Dialog keeps a single vertical scroll axis. See `system/rules/dialog.yaml`.
>
> **Dismissal:** A dialog is *dismissable* when `onClose` is provided — it then closes on Escape, the close button, **and a backdrop click**. Backdrop dismissal requires the press *and* release to both land outside the dialog box, so selecting text and dragging past the edge won't close it. Omit `onClose` for a non-dismissable dialog (none of these dismiss it).
>
> **Dialog status variant:** When `status` is set, a full-bleed colored hero area appears above the title row with a centered icon. Uses the same semantic status background tokens as Card's heroColor. Default icons: success=`check_circle`, error=`error`, warn=`warning`, info=`info`, neutral=`info`. Pass `icon` to override.
>
> **No close button:** Omit `onClose` to hide the dismiss button. In this case the dialog can only be closed programmatically or via footer actions. Still handle the Escape key — pass an `onClose` or add your own cancel listener if keyboard dismissal matters.

---

## Data Viz

| Component | React | Native | Pure | Web Components | Figma |
|-----------|:-----:|:------:|:----:|:--------------:|:-----:|
| Node | ✓ | — | — | — | — |
| Line Chart | ✓ | — | — | — | — |
| Bar Chart | ✓ | — | — | — | — |
| Area Chart | ✓ | — | — | — | — |
| Composed Chart | ✓ | — | — | — | — |
| Pie Chart | ✓ | — | — | — | — |
| Scatter Chart | ✓ | — | — | — | — |
| Radar Chart | ✓ | — | — | — | — |
| Radial Bar Chart | ✓ | — | — | — | — |
| Funnel Chart | ✓ | — | — | — | — |
| Treemap Chart | ✓ | — | — | — | — |
| Sankey Chart | ✓ | — | — | — | — |
| Sunburst Chart | ✓ | — | — | — | — |

> **Recharts component props:** `LineChart`, `BarChart`, `AreaChart`, and `ComposedChart` share Cartesian props (`data`, `xKey`, `series`, `height`, `curve` where relevant, `stacked` where relevant, grid/axis/legend/tooltip toggles). `PieChart`, `RadialBarChart`, and `FunnelChart` use categorical `data`, `nameKey`, `valueKey`, legend, and tooltip props. `ScatterChart` uses `xKey`, `yKey`, optional `zKey`, and scatter `series`. `RadarChart` uses `axisKey`, `series`, polar grid/axis toggles, legend, and tooltip props. `TreemapChart`, `SankeyChart`, and `SunburstChart` use hierarchy/flow data with tooltip support. The compatibility `Chart` export remains for generic Cartesian rendering, but a1-web surfaces each Recharts type as its own component page under **Data Viz** (`/components/line-chart`, `/components/pie-chart`, etc.).
>
> **Recharts styling rules:** All wrappers use A1 chart tokens (`system/tokens/component/chart.json`, `--component-chart-*`) for title/description, plot height, axes, polar grid, tooltip, legend, focus ring, area opacity, line weight, and semantic/status series tones. Series and categorical items use the built-in tone set (`accent`, `info`, `success`, `warn`, `error`, `neutral`) rather than arbitrary colors. Recharts animation is disabled wherever the library exposes an animation prop, so chart motion does not bypass A1 motion tokens. Always provide a visible `title` or accessible `aria-label`, and keep legend/tooltip or surrounding text so meaning is not communicated by color alone.
>
> **Status:** Experimental — in `apps/a1-web/src/pages/components/data.js` as `line-chart`, `bar-chart`, `area-chart`, `composed-chart`, `pie-chart`, `scatter-chart`, `radar-chart`, `radial-bar-chart`, `funnel-chart`, `treemap-chart`, `sankey-chart`, and `sunburst-chart`.

## Data

| Component | React | Native | Pure | Web Components | Figma |
|-----------|:-----:|:------:|:----:|:--------------:|:-----:|
| Data Table | ✓ | — | ✓ | — | — |
| Stat | ✓ | — | — | — | — |
| Definition List | ✓ | — | ✓ | — | — |
| Pagination | ✓ | ✓ | — | — | — |

> **Stat props (A1-375):** `title` (metric label, shown above the value with an optional `icon`), `value` (number or node — numbers are formatted), `prefix` / `suffix` (e.g. a currency symbol or unit), `description` (supporting context below the value), `icon` (Material Symbols name beside the title), `badge` + `badgeStatus` ("neutral" | "info" | "success" | "warn" | "error", default "neutral") / `badgeSubtle` (default true) / `badgeSize` ("sm" | "md" | "lg", default "sm") / `badgeIcon` (override, `null` to suppress), `format` ("none" | "number" | "percent", default "number" — `percent` appends `%` without multiplying), `size` ("xs" | "sm" | "md" | "lg" | "xl", default "md"), `align` ("start" | "center" | "end", default "start"), `locale` / `precision` / `groupSeparator` (`false` disables grouping) / `decimalSeparator` for numeric formatting, `as` (element, default `"div"`). A single highlighted metric — big tokenized value with a muted label, optional supporting text and status badge. Token-driven via `system/tokens/component/stat.json` (`--component-stat-*`). React only; has an a1-web component page + live configurator under the **Data** category (`/components/stat`).

> **DataTable `size` prop:** `size` ("comfortable" | "default" | "compact") sets cell padding density. Omit `size` entirely to let the table auto-select density based on available container width — this is the default and replaces the old `density="auto"` value.

> **DataTable search matching:** `searchableColumns` entries and searchable column definitions may include `searchMatcher(row, query) => boolean` to opt into alias, fuzzy, or domain-specific matching while keeping the built-in search UI. If no matcher is supplied, DataTable continues to use the column's `searchAccessor` / cell value substring match.

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

| Component | React | Native | Pure | Web Components | Figma |
|-----------|:-----:|:------:|:----:|:--------------:|:-----:|
| Icon | ✓ | — | ✓ | — | — |

> **Icon props:** `name` (string, required), `size` ("xs" | "sm" | "md" | "lg" | "xl" | "jumbo" | "xJumbo", default "md" = inherits from parent), `color` ("muted" | "accent" | "inverse" | "success" | "error" | "warn" | "info", default = inherits current text color), `weight` (font variation 100–700), `grade` (-50–200), `opticalSize` (20|24|40|48), `fill` (boolean).
>
> **Icon size px values:** xs=16, sm=20, md=inherit/~24, lg=32, xl=40, jumbo=64, xJumbo=96. Size classes also set `--a1-icon-opsz` automatically for sharp rendering at that scale.
> Icons reserve a fixed 1em square and clip overflow so Material Symbols ligature fallback text cannot expand layout while the icon font is loading.
>
> **Icon color tokens:** Status colors (`success`, `error`, `warn`, `info`) map to semantic status background tokens. Use `inverse` on dark surfaces. Omit `color` entirely to inherit the current text color from the parent.
>
> **React Icon names:** unprefixed names render from Material Symbols Outlined. `custom:<snake_case_name>` renders from the browser-registered custom icon font for the active project. a1-web validates 24×24 filled-path SVGs and registers the generated font; consumers outside a1-web can call `registerCustomIconFont({ fontUrl, mappings, fontFamily })`. **Pure notes:** Icon uses `.a1-icon` (Material Symbols Outlined). Size classes: `.a1-icon-xs|sm|lg|xl|jumbo|xjumbo`. Color classes: `.a1-icon-muted|accent|inverse|success|error|warn|info`. Filled variant: `.a1-icon-filled`.

---

## Disclosure / Accordion

> Implementation-family section. **Accordion is menu-grouped under [Actions & Controls](#actions--controls)** — the "Disclosure" menu category was retired.

| Component | React | Native | Pure | Web Components | Figma |
|-----------|:-----:|:------:|:----:|:--------------:|:-----:|
| Accordion (React) / Disclosure (pure) | ✓ | — | ✓ | — | — |

> **Naming note:** The React package calls this component "Accordion". The Pure package implements the same concept using the native `<details>` / `<summary>` elements with `.a1-details`.
>
> **Accordion `subtext` / `divider`:** `subtext` is optional secondary info shown in the trigger after the label — it only shows while the accordion is **collapsed** (a glanceable summary, e.g. the applied settings) and hides when open; it truncates with an ellipsis. `divider` (boolean) adds a bottom border to separate stacked accordions. The trigger has no border-radius and a compact inline padding. The a1-web Section configurator uses `subtext` to summarise each group's applied properties when collapsed and `divider` between groups. (React only — not yet in the Pure `<details>` version.)

---

## Calendar

| Component | React | Native | Pure | Web Components | Figma |
|-----------|:-----:|:------:|:----:|:--------------:|:-----:|
| Calendar | ✓ | — | — | — | — |

> **React props:** `variant` ("scroll" | "paginated", default "scroll"), `initialMonth` (Date or `{ year, month }`), `monthsToShow` (default 13, scroll only), `highlightToday` (default true), `dimPast` (default true), `todayButton` (default false, paginated only). Scroll variant renders months stacked vertically. Paginated shows one month at a time with prev/next buttons and month/year selects. Uses container queries for 3 density levels (≥ 480 px full, < 480 px medium, < 320 px compact). Supports RTL and locale-driven week-start via `LabelsProvider`.
>
> **Status:** Experimental — in `apps/a1-web/src/pages/components/data.js` as `calendar: 'experimental'`.

---

## Canvas

| Component | React | Native | Pure | Web Components | Figma |
|-----------|:-----:|:------:|:----:|:--------------:|:-----:|
| Canvas | ✓ | — | — | — | — |
| Node | ✓ | — | — | — | — |
| CanvasEdge | ✓ | — | — | — | — |

> **Compositional API — `Node` and `CanvasEdge` as children:**
>
> ```jsx
> <Canvas aria-label="Graph">
>   <Node id="a" x={100} y={100} label="Tokens" color="info" />
>   <Node id="b" x={300} y={100} label="React" color="success" />
>   <CanvasEdge id="e1" from="a" to="b" />
> </Canvas>
> ```
>
> **Canvas props:** `mode` (`"view"` default | `"edit"` — in edit mode nodes are draggable), `onNodeMove` (`(id, x, y) => void` — called when a node is dragged in edit mode), `onDeleteNode(id)` — called when "Delete" is chosen from a node's context menu (only shown in `edit` mode), `nodeMenuItems(id)` — returns `ContextMenuEntry[]` of custom items for a right-clicked node (shown before Delete), `canvasMenuItems` — extra items appended to the canvas right-click menu (below the built-in zoom/fit/reset items), `showGrid` (boolean, default true — dot grid overlay), `background` (`"panel"` default | `"page"` | `"raised"`), `inverse` (boolean, default false — applies the inverse surface and text color, mirroring Section's inverse prop; combine with any `background`), `showControls` (boolean, default true — zoom controls overlay), `edgeStyle` (`"straight"` default | `"curved"` — quadratic Bézier connectors; a per-edge `curved` boolean on `CanvasEdge` overrides this), `snapToGrid` (boolean, default false — rounds dragged node positions to 24px grid increments in edit mode), `defaultZoom` (number, default 1), `defaultPan` (`{ x, y }`, default `{ x: 0, y: 0 }`), `aria-label` (string, required). Pan: left-click drag, middle-click drag, or single-finger touch drag. Zoom: wheel toward cursor, or two-finger pinch. Controls: zoom in/out/fit-all/reset. Right-click canvas background → built-in zoom context menu. Right-click node → custom + delete items.
>
> **Node props:** `label` (required), `id?`, `x?`, `y?` (canvas-space px, center of node — needed when used inside Canvas for positioning and edge routing), `sublabel?`, `shape?` (`circle` default), `color?` (`neutral` default), `subtle?` (boolean). Standalone: renders inline at natural dimensions with no Canvas context needed. Inside Canvas: absolutely positioned; selection, drag, and context-menu callbacks are injected from `CanvasCtx`.
>
> **Node shapes:** `circle` (default, 80×80px) · `square` (80×80px, `--base-radius-md`) · `squircle` (80×80px, `--base-radius-xl`) · `rectangle` (128×56px). Edge routing correctly intersects circle circumference or rectangle boundary.
>
> **Node colors:** `neutral / info / success / warn / error / accent`. Add `subtle` for a tinted surface (uses `*-surface` tokens) instead of the full status background.
>
> **CanvasEdge props:** `id` (required), `from`, `to` (CanvasNode ids), `direction` (`"to"` default | `"from"` | `"both"` | `"none"`), `variant` (`"solid"` default | `"dashed"` | `"dotted"`), `weight` (`"normal"` default | `"heavy"`), `label?` (rendered at the midpoint), `curved?` (boolean — overrides the canvas-level `edgeStyle` for this specific edge). CanvasEdge is a descriptor: returns null and Canvas draws the SVG connector.
>
> **Status:** Experimental — React only. Node size is driven by `component.canvas.node.size` token (80px). Arrowhead markers use stable per-canvas-instance IDs (React `useId`) so multiple Canvas instances on the same page don't collide.

---

## Maintenance log

The dated log of component/token/theme/a1-web changes moved to
[`components-maintenance.md`](components-maintenance.md) — add new entries there (newest at the top).
Keep this registry's tables and notes current as before.
