# A1 Design System — Component Catalog

Every named export of `@gtivr4/a1-design-system-react`, grouped by purpose,
with the props you'll reach for most. All components are imported from the
package root:

```js
import { Button, Stack, TextField } from "@gtivr4/a1-design-system-react";
```

TypeScript definitions ship alongside every component (`.d.ts`) — your editor
shows the full prop surface. This file highlights the key props and the rules
that aren't visible in types.

---

## API conventions

**`onChange` signatures follow the control type:**

| Control type | Signature | Applies to |
|---|---|---|
| Field family (native inputs) | `onChange(event)` — read `event.target.value` | TextField, TextareaField, SelectField, SearchField, NumberField, DateField, TimeField, PhoneField, ZipField, CreditCardField |
| Selection controls | `onChange(value)` — the selected value (or array in multi-select) | SegmentedControl, ChoiceGroup, ChipGroup, Tabs, RadioGroup, CheckboxGroup, Slider, Autocomplete, ToolbarGroup, ToolbarMenu, TokenSelect |
| Switch | `onChange(checked, event)` | Switch |

**`placeholder` is ignored by design** on every field — fields communicate via
`label` and `hint` instead (placeholders vanish on input and fail contrast).
Passing one logs a one-time console warning in development.

**Deprecated props** are marked `@deprecated` in the `.d.ts` files (your editor
strikes them through). Currently: Snackbar's `variant` and `inverse` — both
accepted and ignored.

---

## Layout

> **Always check this table before writing `display: flex`, `display: grid`,
> `gap`, or `padding` CSS.** Custom layout CSS is a last resort.

| Component | Key props | Notes |
|---|---|---|
| `Stack` | `direction="column\|row"`, `gap`, `align`, `justify`, `wrap`, `as` | The default column/row layout. Use instead of a flex `<div>`. |
| `Cluster` | `gap`, `align` | Wrapping inline row for groups of small elements. |
| `Grid` / `GridItem` | `columns` (number or `{ xs, sm, md, lg, xl }`), `gap`; `span`, `rowSpan` on `GridItem` | Responsive CSS grid. |
| `Section` | `surface="page\|panel\|raised"`, `padding`, `gap`, `contentWidth`, `inverse`, `gradient`, `height="screen\|hero"`, `align`, `radius`, `border*`, `background*` | Page-level region: heroes, content rows, full-width zones. Place as a direct child of `<main>` — never wrap it in Stack/Grid/Card. |
| `Card` | `variant` (`"navigation"` makes the whole card a link — pass `href`), `icon`, `heroIcon`, `status`, `statusLabel`, `statusPulse` | Small repeated content unit (tile, summary, grid item). **Not** a page wrapper — see rules below. |
| `Inset` | `space`, `block`, `inline`, `as` | Padding wrapper. |
| `Bleed` | spacing token or boolean | Negative-margin breakout inside a constrained column. |
| `Spacer` | `size` | Explicit empty space block. |
| `Inverse` | — | Renders its subtree in the opposite color mode (see `tokens.md`). |
| `PageLayout` | `header`, `footer`, `sidebar`, `sidebarPlacement`, `stickyHeader` | Full-page shell. Don't hand-roll header/sidebar/footer. No gap between sidebar and main — pad inside the main child. |
| `ButtonContainer` | `align="start\|center\|end"` | Responsive row of buttons. |
| `StickyActions` | `contentWidth` | Bottom-pinned action bar for flows/wizards. Always nest a `ButtonContainer`; match `contentWidth` to the Section above; never combine with `BottomDrawer`. |
| `Figure` | `src`, `alt`, `caption`, `aspectRatio`, `crop`, `cropRect`, `size`, `radius`, `align`, `placeholder` | Content-bearing images with optional caption, ratio cropping, and a tokenized placeholder on load failure. |

## Typography

| Component | Key props | Notes |
|---|---|---|
| `Heading` / `HeadingMark` | `as="h1..h6"`, `type="heading\|display"`, `size`, `color`, `align` | `size` controls visual scale independently of the semantic level. Sentence case only. |
| `Paragraph` | `as`, `size`, `color`, `align` | Also used for eyebrows: `as="span" size="xs" color="muted"` above a Heading in a `Stack gap="xs"`. |
| `Blockquote` | — | Styled quotation block. |
| `List` / `ListItem` | `variant="unordered\|ordered\|icon\|divider"`, `size`, `icon` | Use instead of raw `<ul>`/`<ol>`. |
| `Code` | `variant="inline\|block"`, `wrapping`, `copyCode`, `editable`, `onChangeValue` | `editable` renders a live textarea in block mode. |
| `Divider` | `orientation`, `variant="subtle\|strong\|accent"`, `lineStyle="solid\|dashed\|dotted"`, `size`, `space` | |

## Actions & controls

| Component | Key props | Notes |
|---|---|---|
| `Button` | `variant="primary\|secondary\|tertiary\|destructive\|success"`, `size="sm\|md\|lg"`, `icon`, `iconPosition`, `fullWidth`, `loading`, `as`/`href` | One primary per form/dialog/action group. Tertiary requires icon + verb label. |
| `SplitButton` | `children` (main label), `onClick`, `actions` (menu items), plus shared Button props | Main action + caret menu of related actions. |
| `IconButton` | `icon`, `aria-label` (required), `variant`, `size="sm\|md\|lg"`, `as`/`href` | Never stretched — always a fixed square. No `fullWidth`/`loading`. |
| `ActionTiles` / `ActionTile` | `layout="grid\|stack"`, `gap`, `iconLayout`; per tile: `icon`, `title`, `subtitle`, `accessory`, `footer`, `as`/`href` | Grouped icon-led action surfaces; container-driven sizing. |
| `Chip` / `ChipGroup` | Group: `selectionMode="none\|single\|multiple"`, `value`, `onChange`, `wrap`, `size`; Chip: `icon`, `title`, `selected`, `as`/`href`, `menu` | Filter rows, tags, navigation chips, menu-trigger chips. |
| `Switch` | `checked`, `onChange`, `label`, `disabled` | Toggle. |
| `SegmentedControl` | `options`, `value`, `onChange`, `fullWidth` | Compact single-select. Prefer `Tabs variant="segment"` when you also need panels. |
| `Slider` | `value`, `min`/`max`/`step` or `detents`, `label`, `size`, `variant`, `showValue`, `formatValue` | Native range under the hood; detents snap between labeled stops. |
| `Toolbar` + `ToolbarToggle` / `ToolbarButton` / `ToolbarGroup` / `ToolbarMenu` / `ToolbarDivider` / `TOOLBAR_NONE_ICON` | Toolbar: `label`, `overlay`, `fullWidth`, `overflow`; Group: `value`, `onChange`, `options`, `columns`, `labelMode` | Dense editing-control bar. Place on page/panel surfaces only — never on a raised surface (it disappears). Use `ToolbarMenu`, not a native select. |
| `Accordion` | `items`, `subtext`, `divider` | Disclosure. `subtext` shows a collapsed-state summary. |
| `Tabs` / `TabList` / `Tab` / `TabPanel` | `value`, `onChange`, `variant="line\|pills\|segment\|progress\|folder"`, `equalHeight`, `labelMode` | `variant="progress"` **is** the stepper/wizard component — don't build a custom one. Use `equalHeight` for tabs inside a Dialog. |
| `Link` | `as`/`href`, `size`, `weight`, `icon`, `iconPosition` | Navigation. Use `Button` for actions, `Link` for navigation — never a Button styled as a link for navigation. |

## Navigation

| Component | Key props | Notes |
|---|---|---|
| `TopHeader` | `logoText`, `logo`, `logoHref`, `navItems`, `actions`, `navIconPosition` | App header. |
| `SideNav` / `SideNavItem` / `SideNavGroup` | `open`, `onClose` (mobile overlay ≤1024px) | Sticky on desktop — don't wrap in an `overflow` container. Header/footer slots stay outside the scroll region. |
| `BottomDrawer` | `items` (max 5), `aria-label` | Persistent bottom app nav for xs. Never with `StickyActions` on the same screen. |
| `BottomSheet` | `title`, `detents`, `detent`, `onDetentChange` | Draggable bottom panel, xs/sm only, no scrim. |
| `Breadcrumb` | `items` (`{ label, href }`) | |
| `PageNav` | — | In-page anchor navigation. |
| `TreeMenu` | `items` (nested), `selectedId`, `onSelect`, `expandedIds`, `draggable`, `onMove`, `editingId`, `onRename*` | Full tree: keyboard nav, drag-and-drop reorder/reparent, consumer-driven inline rename. |
| `Pagination` | `page`, `totalPages`, `onChange`, `siblings`, `size` | |

## Inputs

> Never use raw `<input>`, `<select>`, or `<textarea>`. Field-family sizes are
> `"compact" | "default" | "comfortable"`. Fields have no `placeholder` by
> design — use `label` and `hint`.

| Component | Key props / notes |
|---|---|
| `TextField` | Base field: `label`, `hint`, `error`, `size`, `labelPosition="above\|before"`, `required`, `disabled`, `readOnly`, `type`, `autoComplete` |
| `SearchField` | Leading search icon + clear button; `onSearch` (Enter), `onClear`, `clearLabel` |
| `NumberField` | `prefix`, `unit` |
| `DateField` / `TimeField` | Date/time inputs, natural (fit) width |
| `PhoneField` / `ZipField` / `CreditCardField` | Masked inputs; `ZIP_MASKS` exports the ZIP mask table |
| `TextareaField` | Multi-line |
| `SelectField` | `options`, plus the base field props |
| `Autocomplete` | `options` (string or `{ value, label, icon, swatch, group }`), `multiple` (chips), `allowCreate`/`onCreate`, `variant="color"`, `maxVisible` — combobox with portal-positioned listbox |
| `CheckboxGroup` / `RadioGroup` | `legend`, `options`, `value`, `onChange`, `size` |
| `ChoiceGroup` | Tile-based single/multi select: `options` or `sections`, `columns`, `multiple`, `inlineIcon` |
| `Fieldset` | Groups fields with a `legend`; `labelPosition` cascades to children |
| `FieldRow` | Equal-width field row — use instead of a flex row of fields; stacks on xs/sm |
| `InlineEditable` | Click-to-edit text |
| `TokenSelect` | Design-token picker (used by system tooling) |

Set a real `autoComplete` value on editable fields in real forms (`"email"`,
`"tel"`, `"postal-code"`, `"cc-number"`, …) so browser autofill works.

## Feedback & messaging

| Component | Key props | Notes |
|---|---|---|
| `Banner` | `status`, `variant="inline\|system\|calendar"`, `title`, `action`, `onDismiss`, `date`, `eyebrow` | `system` for app-wide notices; `calendar` for date callouts. |
| `MessageBadge` | `status="neutral\|info\|success\|warn\|error"`, `subtle` (boolean — not `variant="subtle"`), `size`, `icon` | Always pair color with a text label. Not clickable. |
| `MessageEmptyState` | `scale="page\|section\|card"`, `icon`, `title`, `description`, `action` | |
| `Notification` | `count`, `label`, `dot`, `position`, `max` | Count/dot badge overlay. |
| `Snackbar` | `open`, `position`, `actionLabel` + `onAction`, `onClose`, `autoHideDuration`, `dismissible` | Brief non-blocking feedback only; timed dismiss pauses while hovered/focused. It doesn't trap focus. Errors requiring action → Dialog or Banner. |
| `SnackbarStack` | `items`, `position` | React-only host for short, intentional multiple-snackbar stacks; put newest items first and keep durable history elsewhere. |
| `StatusBar` | `value`, `max`, `size`, `labelPosition`, `indeterminate` | Linear progress. |
| `CircularProgress` | `value`, `max`, `size="xs\|sm\|md\|lg"`, `indeterminate`, children centered in ring | Pass `aria-label`. |
| `StepTracker` | steps with status | Compact step indicator (see also `Tabs variant="progress"` for interactive wizards). |
| `Stat` | `title`, `value`, `prefix`/`suffix`, `description`, `icon`, `badge*`, `format`, `size`, `align` | Single highlighted metric. |

## Overlay

| Component | Key props | Notes |
|---|---|---|
| `Dialog` | `open`, `onClose`, `title`, `footer`, `status`, `icon` | Native `<dialog>` top layer. Providing `onClose` makes it dismissable (Escape, close button, backdrop click); omit it for non-dismissable. |
| `Overlay` | `open`, `onClose`, `status`, `icon`, `title`, `body`, `actions`, `dismissLabel` | Full-screen native-dialog status overlay for rare high-emphasis moments. Prefer Dialog, Banner, or Snackbar for routine feedback. |
| `Menu` / `MenuSection` / `MenuItem` | `open`, `onClose`, `aria-label`; item: `icon`, `href`, `variant`, `onClick` | Dropdown menu. |
| `ContextMenu` | `open`, `x`, `y`, `items`, `onClose` | Right-click menu — mount once, position from `onContextMenu` event; no trigger button. |
| `Tooltip` | `content`, `children`, `placement`, `delay`, `disabled` | Brief non-interactive hover/focus context. |

## Data

| Component | Key props | Notes |
|---|---|---|
| `DataTable` / `DataTableFilters` | columns (incl. `type="image"`), rows, sorting, built-in search (`searchMatcher`), `size`, `notices`, row actions (`iconOnly`) | Omit `size` for width-based auto density. |
| `DefinitionList` | `items`, `direction="row\|column"`, `size`, `labelWidth`, per-item `copyValue` | Copy buttons only for exact reusable values (IDs, emails, URLs). |
| `Calendar` | `variant="scroll\|paginated"`, `initialMonth`, `monthsToShow`, `highlightToday`, `todayButton` | Experimental. |
| `Canvas` / `Node` / `CanvasEdge` (alias `NodeConnector`) | Canvas: `mode="view\|edit"`, `onNodeMove`, `showGrid`, `edgeStyle`, `snapToGrid`; Node: `id`, `x`, `y`, `label`, `shape`, `color`; Edge: `from`, `to`, `direction`, `variant`, `label` | Experimental pan/zoom node graph. |

## Icons

| Export | Notes |
|---|---|
| `Icon` | `name` (Material Symbols ligature), `size`, `color`, `weight`, `grade`, `fill` — see `icon-discovery.md` before using any icon |
| `registerCustomIconFont` / `clearCustomIconFont` | Register a custom icon font so `name="custom:<name>"` resolves |

## Localization

| Export | Notes |
|---|---|
| `LabelsProvider` / `useLabel` | Optional — English defaults are built in. See `setup.md`. |

---

## Composition rules

- **Card vs Section:** Section for page-level regions; Card for small repeated
  bounded units. A Card wrapping a full content column is a misuse. Ask "is
  this one item in a repeating set?" — yes → Card, no → Section.
- **Never nest Cards inside Cards.** Structure sub-content with `Stack` or
  `Inset`.
- **No interactive elements inside an interactive Card** (`variant="navigation"`) —
  the card contents must be static.
- **One `variant="primary"` Button per decision area** (form, dialog, action
  group).
- **Steppers/wizards → `<Tabs variant="progress">`.** Never build a custom
  stepper.
- **Fix styling with component props, not CSS overrides.** If something looks
  wrong, look for a prop (`gap`, `padding`, `surface`, `align`, `size`) or the
  missing layout wrapper before writing any CSS.
- **Sentence case everywhere.** Never uppercase text via CSS or JS; author
  headings and labels in sentence case ("Create account").
- **Don't shadow imports.** Name your own components `AppHeader`, not
  `TopHeader`.
