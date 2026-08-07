# A1 component JSON — Figma plugin

Two-way bridge between the public A1 Figma components and the A1
page-definition JSON format (A1-1651). It supports **Button**, **Icon Button**, **Button
Container**, **Link**, **Breadcrumb**, **Card**, **Banner**, **Badge**, **Figure**, **Definition List**, **Blockquote**, **Code**, **Inline**, **Section**, **Text Field**, **Search Field**, **Textarea**, **Select**, **Switch**, **Segmented Control**, **Accordion**, **Tooltip**, **Page Nav**, **Tree Menu**, **Pagination**, **Empty State**, **Divider**, **Menu**, **Dialog**, **Radio Group**, **Checkbox Group**, **Top Header**, **Page Layout**, **Chip / Chip Group**, **Data Table**, and **Choice Group**,
plus standalone Figma text layers that use A1 text styles and authored Figma
auto-layout Frames that map to **Stack** or native Figma **Grid**.

- **Export (automatic)** — select a supported instance and its page-definition
  `ComponentNode` JSON appears automatically. It regenerates when the selection
  or its configuration changes. An auto export never overwrites JSON being
  edited in the textarea; use *Export selection* to replace it intentionally.
  Selecting an authored auto-layout frame produces a `Stack` or `Grid` node.
  Other frames/groups produce a neutral `{ "nodes": [...] }` bundle of supported
  instances, Stacks, Grids, and free text in layer order. It does not invent a
  `Section` wrapper, so imported Heading and Paragraph nodes retain no added
  surface, padding, or layout formatting. Shapes and other non-A1 layers are
  intentionally outside this incremental screen-export step.

- **Import and update** — paste one node, an array of nodes, or a full page /
  project definition and choose *Render on canvas*. *Update selection* applies
  the compatible properties to the selected supported instance in place.
  Every rendered Figma layer is named from its JSON `id`, including nested
  Slot, Stack, and Grid children. Warnings explain every value that the current
  Figma component cannot render. Placement follows the A1 sizing contract
  (`figma-workflow.md` → "Sizing convention — fill vs hug"): field-family,
  group, Accordion, Banner, Card, Blockquote, Button Container, and Figure
  instances fill the container's inline axis; Divider fills along its
  orientation; Button, Icon Button, Link, Badge, Switch, Pagination,
  Segmented Control, Menu, and Definition List keep their natural size.

- **Open in a1-web** — valid single-node JSON opens the matching local
  configurator with the node in `?json=`. **Open in playground** opens a
  component node, `{ nodes }` bundle, or complete page definition in the JSON
  Playground with its payload prefilled. The local bridge keeps the open
  Playground in sync with later plugin exports; it opens a named tab only when
  no Playground is listening. Start `npm run codex:bridge:a1-web` before using
  this flow. The development target is configured by `A1_WEB_BASE` in
  `src/ui.html`.

- **Live view (optional)** — turn on the **Live view** checkbox to stream
  debounced Figma document changes to the local Playground. It keeps the active
  Figma selection intact but exports the highest exportable ancestor (usually
  the screen-level Stack or frame), so child edits refresh the complete
  composition. It is a plain toggle: it never turns itself on, and the full
  plugin UI stays visible and normal-sized while it runs. Untick it to stop
  sending updates.

- **A1 Pure styling** — the plugin UI is styled with the real A1 Pure library
  as a showcase. Edit `src/ui.html`; `npm run figma:plugin:build` generates
  `dist/ui.html` and inlines `packages/pure/dist/a1-light.css` +
  `a1-pure.css` because Figma plugin iframes cannot load external stylesheets.
  The mode tabs are a Pure Segmented Control, buttons/fields use the Pure
  classes, and only app-shell layout plus the status banner are plugin-local
  CSS (token-driven). The legacy `npm run figma:plugin:sync-css` command now
  delegates to the build.

## Development

Import `packages/figma/plugins/a1-json/manifest.json` in Figma. The manifest
loads generated files from `dist/`; edit files in `src/` and rebuild. The build
also injects `a1-library-manifest.json` into `dist/code.js`, so published Figma
library keys have one checked-in source. Pure helper modules under `src/pure/`
may be imported by `src/code.js`; the build inlines them so Figma still receives
a single controller file.

| Task | Command |
|------|---------|
| Build plugin artifacts | `npm run build --workspace=@gtivr4/a1-design-system-figma` |
| Watch source and CSS inputs | `npm run watch --workspace=@gtivr4/a1-design-system-figma` |
| Typecheck with official Figma typings | `npm run typecheck --workspace=@gtivr4/a1-design-system-figma` |
| Run plugin tests | `npm test --workspace=@gtivr4/a1-design-system-figma` |
| Build, typecheck, test, and check generated output | `npm run check --workspace=@gtivr4/a1-design-system-figma` |

- **Local Playground handoff** — with this plugin already open, start
  `npm run codex:bridge:a1-web` and choose **Send to Figma** in the local
  a1-web JSON Playground. The localhost bridge queues valid JSON for up to
  five minutes; the plugin imports it once on the current Figma page and then
  acknowledges the queue. Figma does not allow a web page to launch a plugin,
  so the plugin must be opened manually. The development manifest permits the
  plugin to contact `http://localhost:4318` only while developing.

- **Linked project pages (local POC)** — from an A1 project page, choose
  **Connect page to Figma**. This creates durable page-link metadata in the
  local project and queues that page for this plugin. The plugin renders it
  into a named `A1 · …` root frame, remembers the link as Figma plugin data,
  and exposes the linked project/page in its compact selectors. Choose **Send
  to A1** to export that root as a complete page definition and commit it as a
  normal A1 page-history entry. The bridge holds only an in-memory page
  manifest and five-minute directed queues; it does not contact Figma or A1
  cloud services. Automatic merge/conflict resolution is intentionally not in
  this POC—use explicit sends in either direction.

- **Local Figure image POC** — every A1 → Figma page path carries PNG, JPEG, or
  GIF Figure bytes alongside JSON that references `a1img://…`: Playground
  **Send to Figma**, editor **Connect/Send page to Figma**, and Page Editor
  pulls all apply Image Library Figures to Figma's nested Image fill. In Figma,
  select one Figure and choose **Send Figure image to Playground** to save its
  fill into the local Image Library and receive a stable `a1img://…` reference.
  Assets are memory-only, expire with their local bridge snapshot/handoff,
  support up to eight images and 4 MB total per page, and are never embedded in
  the JSON document or sent to a remote service.

  Cloud-backed A1 Image Library refs also resolve directly from the public A1
  Supabase Storage bucket when JSON reaches the plugin without a sidecar, such
  as a pasted Figure node. Browser-local Image Library refs still require the
  localhost sidecar.

## Component mappings

| Figma asset | JSON node | Round-tripped representation |
|-------------|-----------|------------------------------|
| Button | `Button` | Variant, size, disabled/loading state, label, icon, and icon position. Visual hover/focus/pressed states warn rather than becoming runtime props. |
| Icon Button | `IconButton` | Variant, size, accessible label, and nested Material icon swap. `disabled`, link rendering, and event props are runtime-owned and warn rather than becoming Figma behavior. |
| Button Container | `ButtonContainer` | `align` plus its ordered Button Slot children and fill-width placement when nested in auto layout. Matching action counts update the representative Button instances without detaching the container; only a legacy frame-based slot that must add/remove actions detaches. |
| Link | `Link` | Size, weight, editable label, icon visibility/swap, and icon position. Runtime navigation props such as `href`, `target`, and `rel` warn rather than becoming Figma interaction settings. Blue or blue-violet underlined standalone text is recognized as a Link candidate; **AutoFix** applies the nearest `Link/{size}/{weight}` text style, underline, and `link/color` variable without storing a raw fill. Any underlined range inside Heading or Paragraph text exports as `content.inlineLinks` and renders as an inline A1 Link. |
| Breadcrumb | `Breadcrumb` | Ordered `props.items` labels and optional `backLabel`. Runtime navigation hrefs are retained in JSON but warn because Figma has no navigation behavior. |
| Card | `Card` | Default/accent surface, configurable inline icon (`Show icon` + `Icon` swap), ordered native Content Slot children, and fill-width placement in imported auto-layout or Grid parents. The icon is displayed in a token-bound action-surface tile with a legible text-foreground glyph. The plugin adds, removes, exports, and updates supported children while retaining the Card instance. |
| Banner | `Banner` | Inline/system/calendar variants; neutral/info/success/warn/error status; editable title, calendar eyebrow/month/day fields; and ordered Content Slot children. Legacy `content.fallback` becomes a muted Paragraph child on import. A Banner carrying imported children is tagged and detached so Figma can edit that frame-based slot. |
| Badge | `MessageBadge` | Status, subtle treatment, `sm`/`md`/`lg` size, editable label, and a nested native Material icon instance. `icon: null` round-trips through the Figma `Show icon` control. |
| Material icon instance or text layer | `Icon` | `Icon.props.name`, all A1 `size` values, and semantic `color` values round-trip. Import/update uses a matching glyph component when available and otherwise creates editable Material Symbols text, so valid names such as `light_mode` do not require one published Figma component per glyph. Size maps to the 16/20/24/32/40/64/96 px scale; color binds to A1 text/status variables. |
| Figure | `Figure` | Source URL, alt text, optional caption, compact `size` max-width and `aspectRatio` variants, and a token-bound image fill. Aspect ratio is locked on the nested Image layer; source remains JSON metadata. |
| Definition List | `DefinitionList` | `sm`/`md`/`lg` size, row/column direction, and ordered reusable Definition List Item instances in the native Items Slot. |
| Blockquote | `Blockquote` | Visual style, quote text, optional citation, and citation URL. |
| Code | `Code` | Inline/block variant when exposed by the Figma asset, wrapping/editable/copy metadata where available, and the code string as `content.fallback`. Runtime editing callbacks remain A1-owned. |
| Inline | `Inline` | Inline markdown/text content as `content.fallback` plus optional `props.inlineElement` when the Figma asset exposes an element selector. |
| Section | `Section` | Surface, padding, content width, gap, explicit Dark Color mode (`inverse: true`), documentation properties, and the ordered `Section Content Slot` tree as `children` (including A1-styled Heading/Paragraph text and Buttons). |
| Text Field | `TextField` | Size, label visibility/text, default value, hint visibility/text, error, required, read-only, and disabled. `hover` and `focus` are visual-only. |
| Search Field | `SearchField` | Compact/default/comfortable size, visible label, and default value. Search submission, clear behavior, controlled values, and native input attributes remain runtime-owned. |
| Textarea | `TextareaField` | Compact/default/comfortable size; editable label, value, hint, and count; plus a required indicator. Value, hint, and count each have a visibility property and start hidden. A visible count maps to `showCount`; a `0 / maximum` count also maps its maximum to `maxLength`. Rows, validation, and native textarea behavior remain runtime-owned. |
| Select | `SelectField` | Size, visible label, hint/error copy, disabled state, required indicator, and explicit `showValue`/`defaultValue` display preview. Native options and selected-value data remain runtime-owned. |
| Switch | `Switch` | Compact/default/comfortable size, checked visual, editable label, and independently visible hint/error messages. The current visual exports as `defaultChecked`; controlled callbacks remain runtime-owned. |
| Segmented Control | `SegmentedControl` | `sm`/`md`/`lg` size, three editable representative options, selected value, label visibility, and native Material icon instance-swaps from the Segmented Control Item slot. Option-count changes, full-width layout, and keyboard interaction remain runtime-owned. |
| Accordion | `Accordion` | `sm`/`md`/`lg` size, open visual, label, collapsed subtext, and ordered Content Slot children even when the visual state is collapsed. Controlled behavior, divider, disabled state, and animated disclosure remain runtime-owned. |
| Tooltip | `Tooltip` | Top/right/bottom/left placement and editable content surface. Its trigger relationship, delay, focus/hover behavior, and portal positioning remain runtime-owned. |
| Page Nav | `PageNav` | Visible heading text as `label` plus up to five representative Page Nav Item rows as `sections` (`id`, `label`, `level`). The first row renders as the visual active state; active-section tracking, scroll progress, smooth scrolling, and larger variable section counts remain runtime-owned until the Figma component exposes an item slot. |
| Tree Menu | `TreeMenu` | Expanded/collapsed preview variant, optional expand controls and draggable flag, plus visible Tree Menu Item rows as nested `items` (`id`, `label`, optional `icon`, `href`, `disabled`) using each item's level/depth property. Visual selected and expanded rows export as `selectedId` and `expandedIds`; runtime callbacks, inline rename, drag handlers, and variable item counts beyond the published rows remain A1-owned. |
| Pagination | `Pagination` | `sm`/`md`/`lg` size and representative page labels/current-page visual. Runtime range calculation, callbacks, and sibling-count behavior remain runtime-owned. |
| Empty State | `MessageEmptyState` | Page/section/card scale, editable Material icon, title, description, and Action Slot. Runtime action behavior stays in A1. |
| Divider | `Divider` | Static orientation, semantic tone, line style, and thickness. Responsive orientation and surrounding space remain runtime-owned. |
| Menu | `Menu` | The five documented Figma row slots become the a1-web `props.items` config: section labels, items, dividers, icons, shortcuts, destructive, active, and disabled states. |
| Dialog | `Dialog` | Size, status, title, close/footer visibility, footer Button actions, and Body Slot content. Rich slot content round-trips through `children`; `props.body` remains the simple text fallback. |
| Bottom Sheet | `BottomSheet` | Title, default detent preview, and ordered Content Slot children. Detents, drag behavior, controlled state, and mobile-only mounting stay runtime-owned. |
| Radio Group | `RadioGroup` | Size, inline layout, label, helper, required state, visible option labels/hints, and representative selected option as `defaultValue`. |
| Checkbox Group | `CheckboxGroup` | Size, inline layout, label, helper, required state, visible option labels/hints, and selected options as `defaultValue`. |
| Standalone text | `Heading` or `Paragraph` | A1 `heading/*`, `display/*`, and `body/*` local text styles, text color token, alignment, literal text content, and fill-width placement inside imported layout containers. |
| Top Header | `TopHeader` | Logo text, `Breakpoint` preview variants (visual only), the Nav Items slot's Top Header Nav Item instances as `navItems` (label, icon, active; chevron warns that submenus are runtime), and the Actions slot's Icon Button instances as `actions` (a wrapper frame inside the slot is tolerated via a deep-scan fallback). A visible sign-in Button in the Actions slot exports as `loginButton: { label }` — its label round-trips both ways; click behavior stays runtime-owned, and only the first Button is exported. Import/update reconciles both slots to the JSON counts, applies the `loginButton` label (object or legacy string) onto the sign-in Button instance, and accepts projectLayout's `logo` wordmark string. |
| Page Layout | `PageLayout` | v1 app shell: the nested Top Header exports as the first child (full Top Header bridge) and the Page Content Slot's contents as the remaining `children`; import/update applies TopHeader props to the nested instance and renders content into the slot. Exported `showHeader/showSidebar/showFooter: false` are playground-preview flags. Sidebar/aside/footer slots, sticky header, and viewport-height behavior remain runtime-owned. |
| Chip / Chip Group | `ChipGroup` | Group label, first-chip size, and the ordered Chip slot as `items` with per-item `selected` / `disabled` / `menu` flags (a caret marks a menu chip; the group `behavior` selection semantic is never inferred from visuals). Import/update reconciles Chip instances in the slot and honors explicit item states over the first-chip demo selection. A lone Chip exports as a one-item ChipGroup. Menu contents and navigation hrefs stay runtime-owned and warn. |
| Choice Group | `ChoiceGroup` | Legend/required/helper plus `options` from the Choice Option tiles in the Options slot (label, subtext, icon, disabled; selected tiles → `defaultValue`; checkbox tiles → `multiple`; first-tile density → `size`). An **embedded Grid** inside the slot is detected — native GRID column counts or responsive `{xs:n, md:n}` plugin-Grid metadata export as `columns`, and import/update syncs the grid's responsive metadata back. Tile reconciliation (1–20) targets the embedded grid when present. `inlineIcon`, `hideIndicator`, `sections`, and error/success messages warn as runtime-owned. |
| Data Table | `DataTable` | Columns from Data Table Column instances (nested Header Cell label/sort/align) and rows from each column's visible Data Table Cell values. Import/update reconciles the Columns Slot and each column's Cell Slot (up to 10 columns × 20 rows), applies the Data Table Cell `stripe` variant when `props.zebra` is true, and drops the last visible row hairline. Density, selection, search, pagination, notices, mobile cards, and rich column renderers remain runtime-owned. |
| Authored auto-layout Frame | `Stack` | Vertical/horizontal direction, A1 gap scale, cross-axis alignment, primary-axis distribution, horizontal wrap, grow, supported child node order, Hug-height default, and fill-width placement when nested in auto layout. |
| Authored Grid auto-layout Frame | `Grid` | Fixed column count, flexible fill-width tracks, A1-scale row/column gaps, cross-axis alignment, and supported child node order. |

### Breakpoint visibility

Select one Figma layer and use the contextual **Breakpoint visibility** toolbar
to choose where it appears at xs, sm, md, lg and xl. The plugin stores compact
`a1BreakpointVisibility` plugin data on that layer and round-trips it as the
page-definition node’s cascading `visibility` object. A layer with no saved
metadata is visible everywhere. When the plugin renders or synchronizes
breakpoint roots, it also applies the resolved value to Figma’s layer
visibility for that preview. A plain container with breakpoint metadata exports
as a Stack so the authored grouping and visibility contract are not flattened.

Contextual option groups use the same A1 Toolbar component stylesheet and DOM
class contract as the React package. The stylesheet is inlined into the plugin
bundle because Figma plugin iframes cannot load the package CSS at runtime. The
breakpoint toolbar's copy is likewise generated from `system/labels/app.json`
and resolved from the iframe locale instead of maintaining plugin-only strings.

## End-to-end fixture

Paste [`examples/all-new-components.json`](examples/all-new-components.json) into
the plugin to exercise Banner, Card, Badge, Figure, Definition List, Blockquote, and Icon Button in
one composition. It also covers nested `Stack` and `Grid`, Heading, Paragraph, Button,
and Button Container content so import and export can be checked without
assembling a screen by hand. The Figure source URL is editable metadata in
Figma; change the Figure image fill after import when needed. The two Banner
examples cover a system notice with nested Button content and a calendar
notice with date fields and nested supporting copy.

Radio and Checkbox option values are not properties in their Figma components.
The bridge generates deterministic values from their visible labels (for example
`"Push notifications"` becomes `"push-notifications"`). This preserves a
round-trip through the plugin as long as the label remains unchanged; an
arbitrary JSON value is intentionally not written back to Figma.

For imports, `RadioGroup.props.defaultValue` is matched against each
`options[].value` and writes `selected=true` to the matching Figma Radio Option.
For example, `defaultValue: "example-3"` selects the option with
`value: "example-3"`. The bridge also accepts `options[].id` as a compatibility
fallback for a1-web editor configuration; unmatched default values report a
warning instead of selecting an arbitrary option.

## Figma representation limits

- **Button Container:** Figma has no container-query property, so the asset documents rather than automatically performs the React 480px stacked-to-row transition. Only `align` and Button Slot children round-trip. `size` and `fillButtons` are intentionally unsupported. When JSON has the same number of actions as the representative slot, the bridge updates the real Button instances and keeps the container attached. A native Slot can also change action count without detaching; a legacy frame-based Slot detaches only when it must add or remove actions.
- **Icon Button:** the asset maps `variant`, `size`, `label` through its `Aria label` text property, and one Material Symbols `icon` through an instance swap. The required JSON `icon` falls back to the asset's visible `star` glyph only when a selected library copy cannot resolve its nested icon. Disabled, anchor/link rendering (`as`, `href`, `target`, `rel`), handlers, classes, and DOM IDs remain runtime-only.
- **Card:** the compact asset maps `surface`, the normal inline `icon`, and its native Content Slot. Navigation, hero/status, and non-default `iconDisplay` behavior remain React-only; an unsupported display mode is represented by the inline icon with a warning.
- **Banner:** the Figma asset maps its 3 visual variants × 5 statuses, title, calendar date fields, an `Icon` instance-swap property backed by local A1 icon components, and ordered `Content Slot` children. Action controls, dismissal behavior, and live announcement semantics remain runtime-only; the bridge reports them instead of inventing a static Figma approximation. Native Figma Slot authoring is not exposed through the plugin API, so Banner uses an explicitly named, zero-padding content frame as its bridge slot. Figma also rejects adding children to that frame while it is inside an instance: when JSON supplies content, the bridge applies visual properties, detaches the instance, tags the editable frame as `Banner`, and preserves the JSON contract for later export. Rerender that frame to change its visual Banner properties.
- **Badge:** the compact asset maps `status`, `subtle`, `sm`/`md`/`lg` size, label, and a configurable nested **Material icon** instance. `icon: null` maps to the Figma `Show icon` control. An icon name must exist as a Material icon component in the Figma library; otherwise the bridge keeps the status default and reports a warning.
- **Grid:** Figma's native Grid maps fixed/responsive columns, row/column gaps, cross-axis alignment, and direct-child column/row spans. Spanned children export as `GridItem` wrappers with `span` / `rowSpan`; imported `GridItem` children apply the active breakpoint preview back to Figma's native span fields. Off-scale gutters export as the closest supported A1 gap. Custom track sizes and manual placement remain runtime-only/static-layout limits; child order is preserved and a warning identifies omitted manual placement.
- **Figure:** Figma does not load arbitrary external URLs into an image fill. The bridge preserves `src`, `alt`, and caption as component properties. Its compact `2xs`–`xl` size values set only the Figure's maximum width (128 / 192 / 320 / 480 / 640 / 800 px); they do not alter the media geometry. Each `16:9` / `4:3` / `1:1` / `3:4` / `9:16` variant locks the nested Image layer to that ratio. A1 Image Library `a1img://…` refs are the exception: cloud-backed IDs resolve from the public A1 storage origin, while the localhost handoff transfers PNG/JPEG/GIF bytes for browser-local images. Both paths replace the nested Image fill while retaining the stable JSON reference. Unsupported React size/ratio values warn. Cropping and layout props remain React-only.
- **Definition List:** the compact asset maps `size`, `direction`, and serializable string Label/Value pairs through reusable Definition List Item instances. Label width, copy controls, and rich React-node values remain runtime-only.
- **Blockquote:** the asset maps visual variant, quote, citation, and citation URL. Citation links are stored as data; Figma has no interactive link behavior in this component preview.
- **Section children:** the bridge writes imported children to the native
  `Section Content Slot`, preserving the Section instance and its content-width
  layout. Updating a selected Section reconciles existing Heading, Paragraph,
  and Button slot layers in order (including text style and size); adding or
  removing layers still requires **Render on canvas**.
- **Section content gap:** Section JSON remains semantic (`xs`–`xl`), even
  when a library copy exposes only an editable auto-layout content carrier.
  The bridge reads that carrier's item spacing, exports the nearest semantic
  Section gap when no Gap property/mode is available, and offers **AutoFix**
  to make its content spacing and any available Gap property agree.
- **Text Field:** input type, autocomplete, label position, controlled value,
  events, and ARIA/native props are runtime-only.
- **Select:** the compact asset maps `size`, label, hint/error copy, disabled state, and an explicit `showValue` boolean. When `showValue: true`, its visible `Value` exports as `defaultValue`; importing the same pair reveals that text in Figma. Figma has no native option list or selected-value data contract, so options, controlled values, label position, required state, validation, events, and native ARIA remain runtime-only.
- **Divider:** the compact asset maps one static orientation, semantic variant, line style, and thickness. Responsive orientations, `space`, `decorative`, and semantic `<hr>` behavior remain runtime-only.
- **Menu:** the Figma asset has five preconfigured rows. JSON dividers use the
  new `Type=Divider` row variant; additional rows beyond the five available
  slots warn and are not rendered.
- **Dialog:** JSON body text overrides the default text in Figma's `body slot`,
  preserving the component's source typography. `props.footerActions` is a
  serializable array of Button nodes that reconciles the `Footer Slot`; the
  a1-web renderer converts it to the Dialog's ButtonContainer footer. Runtime
  open/close behavior, arbitrary non-Button footer composition, and a custom
  status icon are not representable.
- **Standalone text:** select an ordinary Figma text layer to export it as a
  Heading or Paragraph. The plugin recognizes local `heading/*`, `display/*`,
  and `body/*` styles and A1 `color/text/default`, `color/text/muted`, or
  `color/text/accent` variables. A blue or blue-violet underlined layer is
  recognized as a Link candidate; **AutoFix** applies the nearest
  `Link/{size}/{weight}` style, underline, and semantic `link/color` token,
  after which it exports as `Link` JSON. Underlined ranges inside a
  Heading or Paragraph remain inline and export as `content.inlineLinks`;
  AutoFix binds those ranges to `link/color` without changing the surrounding
  text component. When a style, supported fill, or alignment is
  missing, it
  shows a review warning and offers contextual **AutoFix**; this changes the
  selected text only after that control is invoked. For an unbound solid fill,
  AutoFix compares it with local A1 text variables and binds the nearest
  semantic token (for example, a light gray becomes `text/muted` and pure
  black becomes `text/default`), never a raw hex value.
  Heading text styles use `props.type` to select the Figma family: omit it (or
  use `"heading"`) for `heading/*`, and use `"display"` for `display/*`.
  For example, Display XXL is `{ "type": "Heading", "props": { "type":
  "display", "size": "xxl" } }`.
- **Stack:** an ordinary authored `FRAME` with vertical or horizontal auto
  layout maps to `Stack`; component implementation frames are excluded, while
  a frame placed in a native Slot remains editable content and can export as a
  Stack. The bridge maps the A1 numeric gap scale (`0`, `1`, `2`, `4`, `6`,
  `8`, `12`, `16`, `20`, `24`, `32`, `40`, `64`, `96`, `128`) and accepts
  semantic gaps on import. A non-scale Figma gap exports as the nearest valid
  value and appears in **AutoFix**; the repair runs when that control is
  chosen.
  A1 Stack has one gap, so distinct Figma wrap-row spacing is reduced to that
  gap. `align="stretch"` maps to stretch on each direct child; a mixed child
  stretch state is reviewable and repairable. Figma has no equivalent for
  `row-reverse`, `column-reverse`, `justify="around"`, or
  `justify="evenly"`; those imports warn and choose the closest static
  auto-layout value. Padding is intentionally review-only because it belongs
  in an A1 `Inset`, not Stack.
- **Radio Group / Checkbox Group:** the bridge reconciles Figma's real option
  slots when JSON items are added or removed: Radio Group supports 2–20 rows
  and Checkbox Group supports 1–20 rows. Values outside those ranges warn and
  are clamped to the supported slot count. Disabled/error state, option-level
  disabled, native names, controlled values, callbacks, and ARIA are
  runtime-only for the current Figma assets.

## Install

1. In the Figma desktop app, open the A1 Design System file.
2. Choose **Plugins → Development → Import plugin from manifest…**.
3. Select `packages/figma/plugins/a1-json/manifest.json`.

## Adding a component

The public Figma component must first have a stable counterpart in the A1
page-definition registry. For now, add its exporter, importer, and in-place
applier through the `COMPONENT_ADAPTERS` descriptor list in `src/code.js`; the
legacy `EXPORTERS`, `IMPORTERS`, and `APPLIERS` maps are generated from those
descriptors. Then document exact property and runtime gaps in
`packages/react/ai/figma-workflow.md` and this file.
