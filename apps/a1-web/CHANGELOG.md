Warning: truncated output (original token count: 78541)
Total output lines: 1700

# A1 Web Changelog

## Unreleased

- **Dispatch theme** — added the new warm editorial `dispatch` theme to the a1-web theme switcher (`appThemes.ts`) and loaded its two new webfonts (Zilla Slab, Geist) in `index.html`; Atkinson Hyperlegible was already present. Cream paper + ink with an azure-blue action colour, a highlighter-yellow "important"/warn accent, and a Zilla Slab / Geist / Atkinson Hyperlegible type stack. Theme tokens live in `system/themes/dispatch/`; a standalone reproduction of the source mock lives at `examples/dispatch/`.

- **Figma Autocomplete component (A1-1401)** — created the Autocomplete page in the A1 Figma file: an `Autocomplete` control set (`Size=compact|default|comfortable` × `State=default|error|disabled`, 9 variants mirroring the Select field family) with `Label` / `Value` / `Hint` / `Error message` TEXT properties and `Required` / `Show value` / `Show hint` BOOLEANs, plus a separate `Autocomplete Menu` listbox composition (plain / active / selected-with-check / colour-swatch / multi-checkbox rows, a group heading, and the "Add …" create row). The `multiple` (chips) and `variant="color"` (swatch) modes ship as example frames; dark mode is validated on a Color-mode Dark frame. All colour/geometry binds shared Color + `field/*` variables and the `Field/Label/*`, `body/*`, `Menu/Section label` text styles — no component-local dark overrides. The Components inventory now marks Autocomplete available under Figma; Code Connect template `packages/figma/code-connect/Autocomplete.figma.ts` added. Options data, selection, create behaviour, grouping, portal positioning, keyboard, and ARIA stay runtime-owned; JSON-bridge wiring is a follow-up.

- **Virtual Product Owner — Codex questions (A1-341)** — added a checked-in Product Owner skill and local, read-only Codex routes to the existing bridge on port 4318. The ticket-level Virtual PO now has one Codex-backed review action, asks for up to two specific non-repeating clarifying questions, shows live connection/thinking/validation status, defaults to the lower-cost `gpt-5.4-mini` model with low reasoning effort, supports `A1_CODEX_MODEL` and `A1_CODEX_REASONING_EFFORT` overrides, and keeps the deterministic reviewer as a safe fallback when the bridge is unavailable. The Build with AI plan now includes ticket comments and Q&A, warns when the Virtual PO has not run or questions remain unanswered, and the Virtual PO panel mirrors its generated questions/comments with inline answers. Older Supabase workspaces can still receive questions before applying the optional `reviews` column migration. The response schema uses strict nullable fields for compatibility with newer Codex CLIs. Start it with `npm run codex:bridge:a1-web` during local development.

- **Build with AI — virtual engineer:** added a Codex-backed engineer route that classifies work, asks only blocking questions, accepts manual direction, and applies the installed ponytail guidance to prefer the simplest viable implementation. Plans omit CSS/styling guidance for unrelated work and retain the existing local/deterministic planner when the bridge is unavailable.

- **Build with AI — virtual engineer review:** changed the engineer action to a one-click review like Virtual PO. It evaluates the ticket, returns clarifying questions inline, and appends supplemental guidance to the existing Build with AI instructions instead of replacing them.

- **Backlog virtual team:** development ticket dialogs now combine Product Owner and virtual-engineer tools into one Virtual team tab with medium-sized actions; the production Build with AI tab remains available outside development builds.

- **Choice Group JSON bridge** — the A1:Figma plugin round-trips Choice Group as real `ChoiceGroup` props (options with subtext/icon/disabled, selected tiles as `defaultValue`, checkbox tiles as `multiple`, tile density as `size`). Grids embedded in the Options slot are detected: their fixed or responsive `{xs:n, md:n}` column metadata exports as the `columns` prop and syncs back on import/update, with tile reconciliation targeting the grid. The choice-group configurator gained the Format → JSON view with `?json=` handoff support.

- **Figma Choice Group component** — Choice Option tile set (radio/checkbox indicators × default/selected/disabled × compact/default/comfortable densities, with icon and subtext properties) plus a Choice Group shell with legend, required marker, wrapping tile row, and helper text. Selected tiles bind the action surface with a 2px accent border and filled indicator; disabled tiles sit on the raised surface at 50%. Marked available in the Components inventory's Figma coverage; Code Connect template and library-manifest keys checked in. `multiple`, columns, sections, and inline-icon layout remain runtime-owned.

- **Chip selected state passes from Figma** — a selected chip exported from Figma now renders selected in the playground and editor: React's ChipGroup was overriding each chip's own `selected` prop in `selectionMode="none"` rows (the group asserted "not selected" even where it has no selection semantics). Fixed in the Chip component; the configurator preview also forwards per-item selection in none mode.

- **Chip bridge fix — mixed rows** — a chip row with a single menu (caret) chip no longer collapses into one representative filter chip: ChipGroup items now carry per-item `selected` / `disabled` / `menu` flags through the Figma bridge, the chip configurator's item editor (new Selected / Disabled / Menu chip toggles), the preview (per-item menus, disabled states, and selection that re-syncs on JSON arrival), and the code snippet. The group `behavior` is never inferred from Figma visuals.

- **Chip + Data Table JSON bridge** — the A1:Figma plugin round-trips Chip Group (`ChipGroup` nodes with slot reconciliation, icons, and the menu-chip caret; a lone Chip exports as a one-item group) and Data Table (`DataTable` nodes mapped onto the fixed 4×4 default-density grid with visibility reconciliation and clamping warnings). Library-manifest keys were added for all five new Figma assets and the Chip text styles. The chip configurator now exposes the ChipGroup `label` prop, the data-table configurator accepts JSON `rows`, and both pages gained the Format → JSON view with `?json=` handoff support.

- **Figma Chip component** — Chip set (sm/md/lg × default/selected/disabled pills on the 28/40/56 height standard, with icon swap and a menu-chip caret) plus a Chip Group with a wrapping chip row and optional compact label. Selected chips bind the action colors; disabled uses the shared 55% opacity. Marked available in the Components inventory's Figma coverage; Code Connect template checked in. Selection modes, menu contents, and navigation chips remain runtime-owned.

- **Figma Data Table component** — default-density table asset: Header Cell set (four sort states × start/end alignment, weight-500 panel header, opacity-tuned sort glyphs) and Cell set (start/end alignment) composed into a 640px shell with the 1px/8px-radius scroll-container chrome and a last-row hairline drop. Compact/comfortable densities, zebra, selection, search, pagination, notices, and mobile cards remain runtime-owned. Marked available in the Components inventory's Figma coverage; Code Connect template checked in.

- **Figma sm breakpoint** — the Breakpoint variable collection gained an `sm` mode (min 481 / max 640 / default width 640, section paddings, `deviceMode`), and both breakpoint-variant component sets gained matching variants: Top Header `Breakpoint=sm` (640px mobile composition) and Page Layout `breakpoint=sm` (640px shell with the sm header and a mode-driven slot label). Variant widths resolve from `page/width/default` via each variant's explicit collection mode. The plugin now flags a non-xs Page Layout breakpoint as a visual preview width on export.

- **A1:Figma plugin — Pure-styled UI + Live view cleanup** — the plugin UI now showcases the A1 Pure library: `npm run figma:plugin:sync-css` inlines the real `a1-light.css` + `a1-pure.css` into `ui.html`, the Fix/Playground/Page Editor tabs are the new Pure **Segmented Control** (also added to the Pure package with an example-site page), and every button, link, field, select, and checkbox uses Pure classes. Live view is now a plain checkbox: it no longer switches itself on when the Playground tab is selected, no longer hides the JSON editor and controls, and no longer collapses the plugin window.

- **Figma Page Layout + JSON bridge** — new `Page Layout` Figma component: a v1 app shell composing a fill-width Top Header instance above a `Page Content Slot`. The A1:Figma plugin round-trips it as `PageLayout` (nested Top Header exports as the first child; slot contents as the remaining children; import/update applies header props and renders content into the slot). The a1-web PageLayout editor adapter now forwards a node's children into the layout's main area instead of dropping them, and the plugin's showcase JSON (`all-new-components.json`) is re-rooted in a PageLayout as the top-level container. Sidebar/aside/footer slots, sticky header, and viewport-height behavior remain runtime-owned in v1.

- **Figma fill-vs-hug sizing contract** — formalized which components fill their container versus hug their content in Figma (`figma-workflow.md` → "Sizing convention — fill vs hug"). Fill: the field family (Text Field, Search Field, Select, Textarea), Radio/Checkbox Group, Accordion, Banner, Card, Blockquote, Button Container, and Figure; Divider fills along its orientation (width when horizontal, row height when vertical). Hug: Link, Button, Icon Button, Badge, Switch, Pagination, Segmented Control, Menu, and Definition List. The A1:Figma plugin now applies the contract automatically when importing or rendering JSON into auto-layout and Grid parents. Every component is classified: also fill — Top Header, Section, Empty State, List, Bottom Drawer, Page Nav, Tabs (strip), Tree Menu, and Code's block variant; also hug — Dialog, Tooltip, Inline, Breadcrumb, Split Button, Code's inline variant, and Side Nav (fixed 280/52 rail widths). Not-yet-bridged types are pre-registered so sizing is correct when their importers land.

- **Ten new Figma components + coverage sync** — created token-bound Figma component sets for Inline (kbd/mark), Code (inline/block), List (unordered/ordered/icon/divider), Breadcrumb (+ Item set and narrow back-link variant), Split Button (primary/secondary × sm/md/lg), Bottom Drawer (+ Item set with badges), Page Nav (+ Item set and reading-progress shell), Tabs (Tab item set across all five variants + line strip), Tree Menu (+ Tree Item set with expand toggles), and Side Nav (+ Item set; expanded/collapsed shells) — each with dark-mode validation and a Code Connect template. The Components inventory's Figma coverage now flags all ten, plus 17 components whose earlier Figma assets were never marked (Blockquote, Divider, Link, Icon Button, Segmented Control, Switch, Search Field, Textarea, Select, Banner, Badge, Empty State, Card, Figure, Tooltip, Definition List, Pagination, Accordion). Data-viz charts are intentionally deferred; A1:Figma plugin JSON-bridge support for the new sets is a follow-up.

- **Figma Top Header loginButton + actions hardening** — a visible sign-in Button in the Figma Top Header's Actions slot now passes to A1: the plugin exports it as `loginButton: { label }` (label round-trips both ways; click behavior stays runtime-owned) instead of dropping it with a warning, and **Update selection**/import applies the JSON label back onto the sign-in Button instance. Actions export also gained a deep-scan fallback so Icon Buttons wrapped in a frame inside the Actions slot no longer silently drop. The Top Header configurator's JSON view emits the `{ label }` object form and accepts object, legacy string, or boolean on import; the localized loginButton note was reworded to match.

- **Figma Top Header component** — Top Header is now marked available in the Components inventory's Figma coverage. The A1 Figma asset (`node 613:977`) is the 1440×64 header composition — logo text, a Nav Items area of `Top Header Nav Item` instances (default/hover/active with icon and chevron toggles), Icon Button actions, and an optional Sign in Button — bound to new `topHeader/*` geometry variables, shared light/dark Color roles, and a new `Top Header/Nav label` text style, with documentation, example, and dark-mode validation frames plus a checked-in Code Connect template. The set carries `Breakpoint=xs|sm|md|lg|xl` variants at the contract widths (xs/sm show the hamburger composition), and the Nav Items and Actions areas are real Figma Slots. The A1:Figma plugin now detects Top Header instances — exporting them as `TopHeader` page-definition nodes (nav items, actions, logo text), rendering/updating them from JSON with slot reconciliation, and handing them to the local configurator via Open in a1-web; the Top Header configurator gained the matching JSON view.

- **Component pages — navigation crash fix** — clicking to a component page from the sidebar tree (or any in-app navigation) rendered the new page's configurator once against the previous page's configuration before the reset effect ran. Modules that index into config arrays crashed — most visibly Definition List (`Cannot read properties of undefined (reading '0')`) when arriving from any other component. The detail-page shell now resets the configuration synchronously during the same render that switches pages, fixing the whole class of transition crashes.

- **Figma Link bridge** — the Component JSON plugin now round-trips Link size,
  weight, label, optional Material icon, and icon position. Blue or
  blue-violet underlined standalone text is suggested as a Link and can be
  normalized with **AutoFix**, which applies an A1 Link text style and the
  semantic `link/color` variable before export. Underlined ranges inside
  a Heading or Paragraph remain inline through `content.inlineLinks`.

- **Figma component coverage** — the Components registry now marks Link, Icon
  Button, Select, Divider, and the previously completed Card Figma assets as
  available. Each newly added primitive has a documented Figma contract and
  a repo-side Code Connect template for future publishing.

- **Playground → Figma local handoff** — the JSON Playground now includes
  **Send to Figma**. With the Component JSON Figma plugin already open and
  `npm run codex:bridge:a1-web` running, valid JSON is queued locally and
  rendered once on the current Figma page. The localhost-only queue expires
  after five minutes; a browser still cannot launch a Figma plugin.

- **JSON playground** — added `/playground` under Editors: its JSON editor is
  a responsive A1 SideNav rail and its main area starts as a blank Canvas. It
  accepts a single A1 component node, a `{ "nodes": [...] }` bundle, or a full
  page definition; valid input replaces the blank canvas with the production
  renderer, while invalid drafts remain visible with an inline error.

- **Figma Section child updates** — **Update selection** now reconciles the
  existing ordered Heading, Paragraph, and Button layers inside a Section
  Content Slot. A Heading’s JSON `size` therefore applies its matching local
  Figma text style; structural additions/removals remain an explicit Render on
  canvas operation.

- **Figma Section → Pattern handoff** — Section exports now read the ordered
  Figma `Section Content Slot`, preserving styled Heading/Paragraph layers and A1
  component instances such as Buttons in `children`. The Component JSON plugin
  adds **Open in pattern editor**, which creates a fresh editable local Pattern
  from the exported node or a JSON node bundle and opens the normal Pattern
  workspace.

- **Heading and Paragraph JSON** — both typography component pages now expose
  the editable **Code | JSON** workflow used by Button and Section. Their
  nodes retain A1 semantic color selectors such as `"color": "muted"` rather
  than rendered hex values; the Figma bridge binds that selector to the
  corresponding `text/muted` variable. Frame/group JSON exports are now bare
  `{ "nodes": [...] }` bundles, so text lands on the canvas with no invented
  Section surface, padding, or layout formatting.

- **Figma text color tokens** — corrected the Component JSON bridge to detect
  and bind the library’s actual `color/text/*` variables (including
  `color/text/muted`) rather than assuming a shortened variable path. Selected
  text is re-read after a Figma document change, so manual fill-token changes
  refresh the exported JSON.

- **Figma Display Heading lookup** — Heading JSON now uses its `type` prop to
  select the correct Figma text-style family. `type: "display"` with
  `size: "xxl"` resolves `display/xxl`; it is not treated as a nonexistent
  `heading/xxl` style.

- **Figma component export precedence** — a selected registered component is
  now exported as its component JSON before generic screen-content traversal.
  Dialogs therefore retain their `Dialog` node, body, and `footerActions`
  instead of flattening into text and Button nodes.

- **Dialog footer action rendering** — JSON `footerActions` now render as
  direct A1 Buttons in the Dialog footer, preserving each action’s Button
  props such as `variant`, `size`, icon, disabled, and loading state. The
  Dialog owns the single footer ButtonContainer wrapper.

- **Figma Dialog actions and free text bridge** — Dialog footer Button
  instances now round-trip as JSON `props.footerActions`, which the page
  renderer turns into the native Dialog footer. The Component JSON plugin also
  exports standalone Figma text as A1 `Heading` or `Paragraph` based on A1
  text styles, color variables, and alignment. When that text is incomplete,
  the plugin explains the nearest match and only applies a style/fill/alignment
  repair after the user chooses **Apply A1 text suggestion**.

- **Figma Dialog body slot** — the Component JSON bridge now writes
  `Dialog.props.body` into the Dialog `body slot`, overriding the placeholder
  with a styled text override. Export reads that slot override back to JSON.

- **Figma Menu dividers** — the Component JSON bridge now maps a Menu row with
  Figma `Type=Divider` to and from `{ kind: 'divider' }`, preserving divider
  placement when a Menu is imported or updated from JSON.

- **Figma group item reconciliation** — importing or updating a Radio Group or
  Checkbox Group now adds and removes real Figma option instances to match its
  JSON `options` list. Radio Groups support 2–20 rows; Checkbox Groups support
  1–20. Out-of-range JSON reports a clear warning without corrupting the
  selected instance.

- **Figma Radio Group default selection** — importing a Radio Group now maps `props.defaultValue` to its matching Figma option’s `selected=true` variant. The bridge accepts canonical `options[].value` and a1-web editor-style `options[].id`, and warns when the value does not match an imported option.

- **Editable Component JSON views** — Text Field, Menu, Dialog, Radio Group, and Checkbox Group now use the same **Code | JSON** format toggle as Button and Section. Their JSON views are editable, validate the page-definition node type, and apply valid changes to the live configurator; they also accept Figma bridge `?json=` handoffs.

- **Figma Component JSON bridge coverage** (A1-1651) — completed the Figma ⇄ A1 JSON bridge for every public A1 Figma asset: Text Field, Menu, Dialog, Radio Group, and Checkbox Group now join Button and Section. The bridge imports, exports, and updates their documented variants and editable content, warns for runtime-only values, and documents the fixed-slot/value limitations. The a1-web Dialog preview now carries exported body/footer settings, and Menu preview/configuration supports active and disabled items.

- **Components Figma coverage** — audited the live A1 Figma library and marked Section, Checkbox Group, and Radio Group as available in Figma on the Components inventory. The Figma filter now shows all seven public A1 component assets: Button, Section, Text Field, Menu, Dialog, Checkbox Group, and Radio Group.

## 0.29.0 — 2026-07-13

- **Configurator View JSON + Figma handoff — Button and Section** (A1-1651) — the Button and Section pages' snippet areas now have a **Format** toggle (Code | JSON). The JSON view shows the current configuration as an A1 page-definition node in an **editable** code block with a copy button — valid edits apply to the configurator as you type, with inline validation errors, and an imported node carrying child nodes shows an info notice (children aren't applied; the configurator previews a single component). The component pages also accept a `?json=` query parameter carrying a node, applied once on arrival and consumed from the URL. The JSON round-trips with the new Figma **Component JSON** plugin (`packages/figma/plugins/a1-json/`), which **auto-exports** the selected instance (the JSON follows selection and configuration changes; hand-edited JSON is never clobbered), renders pasted page-definition JSON back onto the Figma canvas, and has an **Open in a1-web** link that deep-links the exported node into the local configurator via `?json=`. Section translates Figma's split model — the Section set plus internal parts such as **Section Content** that carry the content-width/padding properties (scanned by canonicalised property name across the instance and its parts, with ContentWidth/Gap variable modes as fallbacks) — into the single React props, maps `inverse` to the explicit Color mode, and exports nested Buttons as `children`. An **Update selection** action applies pasted JSON to the currently selected Figma instance in place (properties only). Proof of concept — other components keep their code snippet unchanged. New localized `label.app.configurator.*` labels.

- **Figma Radio Group component** (A1-1403) — Radio Group is now marked available in the Components inventory's Figma coverage. The A1 Figma component set (`node 258:1456`) covers its three densities and default/hover/focus/required/error/disabled states, editable field and option copy, shared light/dark Color-mode bindings, examples, and a checked-in Code Connect template.

- **Local Codex icon finder** — the editor's **Find an icon with AI** flow now uses the local Codex bridge instead of requiring a browser Anthropic API key or a separate local model runner. Icon suggestions are validated against the Material Symbols registry plus active-project custom icons, include icon-usage guidance when available, and report elapsed time plus token usage when Codex exposes it. Added a blog article explaining when to use the feature, its benefits, limits, and API-backed extension path.

- **Local Codex review** (A1-409) — added a local-only Codex proof of concept for the page editor. Run `npm run codex:bridge:a1-web` to start a localhost Node bridge that calls `codex exec --json --sandbox read-only --cd <repo>` with a structured page-review schema. The editor sidebar now includes a **Codex** tab that checks the bridge, sends the current page definition for review, and renders returned findings without exposing shell execution to the browser.

- **Project page routing** (A1-386) — project `TopHeader` logos now stay inside the project instead of linking to the A1 home page. Published prototypes route the logo to `/p/{slug}`, standalone previews route it to the project’s first page, and editor project chrome routes it to the project home. If a project’s saved shared layout is missing a `TopHeader`, a generated project header is shown so project navigation does not disappear.

- **Presentation primary slides only** — the Presentation page now hides speaker notes and demo placeholder slides so the walkthrough shows only the primary content cards. The note/demo content remains in the source and can be restored by toggling the local presentation flags.

- **Project publishing** (A1-1933) — project home now has a **Publish** action that creates a stable workspace preview URL (`/p/{slug}`) for the project. Published URLs open as standalone project prototypes, start on the first page, keep navigation under the published path, and can be unpublished without deleting project content.

- **Ticket page — in-page navigation** (A1-399) — the backlog ticket detail page now has an in-page navigation (`PageNav`) so you can jump straight to a section — Details, Activity, Linked tickets, Build with AI (and Virtual PO in dev). It's a sticky sidebar on desktop with a reading-progress indicator and active-section highlighting, and a fixed pill bar on mobile. New localized `label.app.backlog.onThisPage` ("On this page") drives the nav heading.

- **Editor screen reader report** (A1-383) — the page editor now has a **Screen reader report** toolbar action for project pages. It opens a heuristic outline of the current page structure, likely announcements, control labels, heading levels, image-alt handling, and review/issues so unlabeled icon buttons and similar problems are easier to catch before manual assistive-technology testing.

- **Backlog ticket screenshots** (A1-411) — images pasted or uploaded into tickets are now stored as ticket-only attachments instead of appearing in the reusable Image library. Existing ticket attachments continue to render.

- **Vite warning cleanup** (A1-401) — the a1-web production build now filters the known Anthropic SDK browser-externalization warning for explicit browser-side API-key usage and raises the chunk warning threshold to the current app-shell size, so accepted production builds finish without non-actionable warning noise.

- **Projects — sidebar navigation option** — a project can now use a left **sidebar (SideNav + a TreeMenu of the page hierarchy)** as its primary navigation instead of the auto top header. Choose it in project settings under **Primary navigation → Sidebar (tree menu)**. In the prototype the sidebar is real app-shell chrome (`PageLayout` + `SideNav` + `TreeMenu`) wired to navigation; the tree auto-expands the active page's ancestors. (Top header remains the default.)

- **Projects — archive instead of delete** — deleting a project now **archives** it: it's hidden from your projects list but kept and fully restorable, so it reliably disappears (a hard delete could reappear via sample re-seeding or cloud sync). An **Archived** section on the Projects page lists archived projects with **Restore** and a separate **Delete permanently**. The archived flag (and a project's nav style) now survive the projects export/import round-trip used by cloud sync, so an archived project no longer reappears after syncing.

- **Components main-menu search** (A1-408) — the top-nav Components menu now includes a compact search field. Typing filters the menu to ranked component matches, and pressing Enter opens the top match so components are reachable faster from other routes.

- **Backlog linked-ticket menu** (A1-410) — the similar-ticket overflow menu no longer repeats the visible Open, Link, and Merge controls; it now keeps only the secondary Copy reference action.

- **Lumen Card radius** — reduced Lumen Card corners by one token step so dimensional cards read a little sharper while keeping the theme's rounded shape language.

- **Patterns — instance panel + lock fixes** — selecting a multi-root pattern instance's outer wrapper now shows just the pattern banner (Edit pattern / Detach), not Stack layout controls — it's a host for the pattern, not a component to configure. And a **structural lock** ("Lock component — can't remove, move, or replace") no longer disables editing the element's _unlocked_ properties or text on instances; only locked properties and locked text are read-only. This includes the write handlers — editing an unlocked property or text on a structurally-locked instance node now actually persists (previously the control looked editable but the change was silently dropped), so text and property overrides are respected.

- **Patterns — edits propagate to every instance (governed)** — editing a pattern now updates every placed instance across all pages and projects automatically on save. It's a governed merge: **structure** (added/removed/reordered components) and **locked** properties/text follow the pattern, while **unlocked** properties you set on an individual instance are preserved (never overwritten — lock a property if you want it to always follow the pattern). Selecting a placed instance shows a **pattern banner** (name, description, Edit pattern, Detach) above its configurator, so you can still edit the unlocked properties while the locked ones show read-only.

- **Editor — no autofill in config fields** — the editor's Configure/Data panels no longer trigger browser or password-manager autofill (it was offering your email/address into config fields like a Stat "Description"). Every field the panel renders, now and after tab/accordion changes, gets `autocomplete="off"` plus the common password-manager ignore hints.

- **Editor — SectionSeparator selectable on canvas** — clicking a Section Separator on the editor canvas now selects it (previously only the layers tree could). Its decorative root uses `pointer-events: none` so it never intercepts clicks in a rendered page; the editor now re-enables pointer events for the selectable node only.

- **Editor configurators — full audit** — every registered, addable component now has a working configurator in the project/pattern editor's Configure panel. Wired up the 13 that previously showed **"No configurator is registered for this component type"**: Stat, Autocomplete, Inline editable, Inline, Dialog, Menu, Context menu, Snackbar, Notification, Side nav, Bottom sheet, Canvas, and a focused single-Node configurator. Also fixed the **Card** configurator, which wasn't exposing **Surface** (or the hero separator options) in the editor — those now round-trip. Data-bound `Stat` values (`{{ dataset.column }}`) survive editing instead of being blanked.

- **ApiGrid data-source samples** — added the five ApiGrid API-management dashboard datasets (`ApiGrid APIs`, `ApiGrid consumers`, `ApiGrid activity`, `ApiGrid traffic`, `ApiGrid request logs`) as built-in Data-source samples, transcribed from the ApiGrid design handoff. They appear as one-click **Add sample** datasets on the Data sources page and can be bound into pages (binding keys `apigrid_apis`, `apigrid_consumers`, `apigrid_activity`, `apigrid_traffic`, `apigrid_request_logs`).
- **Product tour** (A1-83) — added a lightweight, first-visit A1 walkthrough that spotlights navigation, search/help, and the active workspace. The tour is keyboard-contained, dismissible with Escape, remembers dismissal or completion locally, and can be restarted from Ask Help. All tour copy is supplied by localized system labels.

## 0.28.0 — 2026-07-07

- **Project themes** — Projects can now store an optional project-scoped theme. The project settings dialog exposes the theme selector, project cards show the chosen theme, import/export/cloud sync preserve it, and the editor canvas plus launched prototypes apply the theme locally to the project page instead of changing the whole a1-web app shell.

- **Card configurator** — added hero separator controls for hero-icon Cards, using the same shaped separator vocabulary as Section Separator while labelling the control simply as **Separator**.

- **Card configurator** — added the new Card `surface="accent"` control with surface swatches, contrast helper text, and automatic disabling of status stripe options while the accent surface is active.

- **Section Separator component** — added a React `SectionSeparator` for organic responsive transitions between Section surfaces, including per-side surface/inverse controls, multiple curve shapes, optional curve-border highlighting, Storybook coverage, and an a1-web Layout & Display configurator.

- **Theme settings** — hid Lumen from the a1-web Settings theme picker while keeping the theme available in the codebase for direct theme previews and development checks.

- **Features page title** — converted the Features page header to the shared `PageTitleArea` local component for consistent breadcrumb, title, and description treatment.

- **Toolbar tooltips** — Toolbar buttons, toggles, menus, overflow controls, and icon-only group options now use the A1 Tooltip component with a short delay instead of native `title` attributes.

- **Accessibility report stats** — converted the report summary metric cards to use the shared `Stat` component with icons suppressed.

- **Lumen Data Tables** — decoupled Data Table corner radius from Card radius and reduced Lumen table corners by one radius step so dense table surfaces read cleaner while dimensional cards keep their larger rounded shape.

- **Lumen theme** — added an organic dimensional theme with light/dark mode support, deep blue-violet dark surfaces, lighter airy light surfaces, a brighter blue primary action color, rounded Baloo 2 headlines, Nunito body text, cyan/violet/rose color accents, rounded dimensional cards and controls, 3px dimensional card borders with subtle blue navigation-card borders, stronger layered card/button glow shadows, larger standard Tabs on a softer subtle border, subtler blue-outlined secondary Buttons, brighter tertiary Button/IconButton text, softer MessageBadge and Field borders, higher-contrast Card icons, and subtle page gradients/textures inspired by glassy dashboard interfaces.

- **Control polish** — increased Button font weight one step across all sizes, aligned Toolbar item radii to the toolbar bar radius, gave Segmented Control and Tabs segment strips the same subtle border treatment as Toolbar, fixed Segmented Control `size` so sm/md/lg visibly change the control height, and increased compact field border radius one step.

- **Accessibility foundation page** — switched the page header to the shared `PageTitleArea` local component so the foundation title treatment matches the rest of a1-web.

- **Chart examples** — added an NFL scorigami Scatter Chart child example that uses real score-frequency data from NFL Scorigami and renders it as a pannable A1 Canvas matrix.

- **Chart examples** — added read-only Bar Chart and Area Chart child example pages for operational status cards: a compact live-updating API Gateway card, a live API incident-recovery scenario, a wider Authentication API uptime timeline, and an API Monitoring Area Chart card, all built only from A1 components without custom CSS. Charts now support `height="xs"` for tiny embedded chart surfaces.

- **Home dashboard link** — replaced the large dashboard promo card below the Home stats strip with a simple link-icon text link to the System dashboard.

- **Components sidebar search autofill guard** — the Components navigation search now opts out of browser/password-manager autofill with a stable app-specific field name, preventing profile data from being injected when navigating to Menu and Context Menu pages.

- **Theme editor JSON view** — added a direct **View JSON** toolbar action for open themes, renamed the sidebar category from Code to JSON, made the saved theme JSON editable/applyable from the editor, and removed the theme-generation AI panels and copy from the Theme editor surfaces.

- **Kong theme** — added a selectable Kong system theme with a concrete neutral ramp from `#717A74`, electric chartreuse accent ramp from `#BEFF00`, Funnel Sans typography, `neutral-50`/`neutral-800` page surfaces, pill-shaped Button/Text Field/Icon Button controls, accent-outline secondary buttons, black Card/Action Tile icons in light mode, theme-aware TopHeader logo color, primary-style selected Chips, black-track Switches with chartreuse handles, black Slider thumbs and detent labels, chartreuse selected Tabs/Pagination/TreeMenu states with pale hover and flipped active colors, and a black-backed accent heading treatment for light-mode legibility.

## 0.27.0 — 2026-07-07

- **Explore dashboard** — added a `/dashboard` Explore page with Recharts-powered cards for backlog health, component coverage, token volume, system flow, rules, and labels, plus a Home callout under the initial stats strip.

- **Backlog Figma-ticket seeding no longer churns timestamps** — generated Figma component tickets still seed when missing and repair priority/size metadata, but existing ticket descriptions are no longer rewritten automatically on app load. This prevents guidance-template changes from making the Backlog look reset by stamping many generated tickets as updated today.

- **Backlog cloud reads include every ticket** — Supabase backlog reads now page through all `backlog_items` rows instead of stopping at PostgREST's 1000-row default. Older and released tickets stay visible even after generated-ticket bursts increase the total backlog size, and the duplicate Figma component tickets created by the truncated read were cleaned up in the live backlog.

- **Theme light mode matches System light** (A1-1436) — System mode on a light OS now uses the same generated light color contract as forced Light mode, so dashboard chart/status colors and themed surfaces match instead of drifting to older root token values. Selecting Light in Settings still preserves theme-specific light surfaces and forces light mode when the OS prefers dark.

- **Components overview last-updated dates** — the Components overview table now uses component-specific `Last updated` dates based on documented component work instead of assigning the same fallback date to every row.

- **Data Viz category + chart configurators** — added a dedicated Data Viz component category with Node plus separate pages for line, bar, area, composed, pie, scatter, radar, radial bar, funnel, treemap, Sankey, and sunburst charts. Each chart page has a live Configure panel, generated React snippet, generated prop table entry, rules coverage, package/status metadata, related components, editor Add catalog support, page-renderer registration, and selected-node editor controls.

- **Figma Dialog component** (A1-1418) — Dialog is now marked available in the Components inventory's Figma coverage, matching the new A1 Figma Dialog component set (`node 228:1628`), `Dialog Hero Icon` child component set (`node 228:1013`), and repo-side Code Connect template. The Figma asset covers size/status variants, editable title/body content, close/footer toggles, body/footer composition slots, shared token bindings, and documents native dialog behavior as runtime-only gaps.

- **Backlog Figma component ticket guidance** — generated "Create Figma component" tickets now read the shared `FIGMA_COMPONENT_GUIDELINES.md` and include concise component-specific guidance when new tickets are seeded. Existing generated ticket descriptions are not rewritten automatically, so normal app loads do not churn ticket timestamps.

- **Figma Menu component** (A1-1420) — Menu is now marked available in the Components inventory's Figma coverage, matching the new A1 Figma Menu shell component (`node 218:1177`), Menu Item child component set (`node 218:1176`), and repo-side Code Connect templates. The Figma asset keeps Menu as a slotted shell, lets Menu Item own default/hover/focus/pressed/active/disabled/destructive states, binds icon vectors to state-aware color variables, and documents runtime positioning/dismissal behavior as Figma gaps.

## 0.26.0 — 2026-07-06

- **Presentation walkthrough** (A1-1434) — added a focused `/presentation` deck page under Explore. The page hides the normal app chrome, presents the A1/AI/software-creator story as a six-slide direct-markup deck with alternating demo placeholders and speaker notes, supports Arrow key slide navigation, closes with Escape, and fits the deck inside the viewport without page scrolling.

## 0.25.0 — 2026-07-06

- **Figma Text Field component** (A1-959) — Text Field is now marked available in the Components inventory's Figma coverage, matching the new A1 Figma component set (`node 148:1360`) and repo-side Code Connect template. The Figma asset covers size, label position, visual states, label/value/hint/error text properties, and light/dark token bindings; runtime-only field props remain documented as Figma gaps.

- **Backlog data table filters** — the All tickets DataTable view now has table-local filter chips for Type, Status, Priority, Size, and Scope. These stack with the shared Backlog panel search/filters and keep the visible table cells formatted while matching on hidden row filter values.

- **Backlog Figma component tickets** — the Backlog now automatically creates one M-size component-scoped ticket for every component or registry-only component row that is not yet marked available in Figma, and repairs existing generated tickets when evaluated priority/size changes. Ticket priority is set by design criticality: P0 for foundational primitives/core controls, P1 for common app structure/forms/feedback, P2 for specialized components, and P3 for experimental or niche rows. Each ticket includes first-pass requirements for creating a complete Figma component, and the seeding is idempotent by `figma:<component-id>` scope so reloads do not duplicate work.

- **Components inventory Figma coverage** — the Components page now includes Figma in package availability and filtering. Button is marked available in Figma to match the A1-419 component set; other components remain unavailable until their Figma assets are created.

- **Overlay — component page + configurator** (A1-417) — added Overlay to the Overlay category with a live Configure panel for status, title, body, default/custom/no icon, action count, close-button dismissal, and extra content. The page includes generated React snippets, rules, properties, package coverage, status, and related-component registry entries.

- **Tooltip — component page + configurator** (A1-378) — added Tooltip to the Overlay category with a live Configure panel for content, trigger type, placement, delay, and disabled state. The page includes generated React/Pure snippets, rules, properties, accessibility guidance, package coverage, status, and related-component registry entries.

- **Release notes package coverage** — the Releases page now includes package release notes. Release sources switch with a chip filter in the sidebar independent of Simplified/Detailed mode, versions remain in the TreeMenu, React has simplified package notes, and the Simplified/Detailed control now lives in the page header constrained to the same width as the release notes.

- **Backlog swimlane controls** — the Backlog board now hides the swimlane visibility toolbar when the board switches to the small-screen tab layout, and the larger-breakpoint toolbar uses the shared Toolbar overflow behavior so swimlane toggles stay on one row.

- **Backlog filter rail placement** — the Backlog view/search/filter rail now appears on the left side of the page at non-mobile breakpoints as a fixed-width sidebar with the correct right border, matching navigation-oriented pages while keeping the small-screen BottomSheet behavior.

- **Release notes public version** (A1-407) — the Releases page now follows the component-pages pattern: release versions live in a left-side TreeMenu with search, while the main pane renders each release-note item as its own card. Searching now shows all matching releases at once, separated by release version, with matching text marked inline. The release sidebar stays expanded on large breakpoints and opens from a page button on smaller breakpoints. Simplified notes come from curated public sources; Detailed switches to the full changelog.

- **Release notes search and markdown rendering** — added a search field to the Releases page so users can filter release tabs and release-note entries from the changelog. Release-note text now renders common inline Markdown such as bold, italic, inline code, and links as markup instead of showing raw syntax. The new search labels are sourced from `system/labels/app.json` with supported translations.

- **Wireframe redacted theme removed** (A1-403) — removed the Wireframe (redacted) theme, its Priority Guide preview action, settings theme option, and app redaction stylesheet. Priority Guide previews now use the standard Wireframe theme only.

- **Tree Menu collapsed configurator** (A1-377) — the Tree Menu component page now exposes the `variant` prop and opens in collapsed mode so the root-icon menu flyout is visible immediately, with helper text, Properties coverage, generated snippet output, and editor/Add-panel round-tripping for `variant="collapsed"`.

## 0.24.0 — 2026-07-05

- **Merging tickets now merges descriptions** (A1-400) — when two backlog tickets are merged, the duplicate's description is now folded into the **surviving ticket's description** (which the merge dialog already promises) instead of only being dropped into the comment thread. If the survivor has no description it adopts the duplicate's verbatim; when both have one, the duplicate's is appended under a clear `Merged from A1-N — "title":` heading so no agreed content is lost. Re-merging the same content is idempotent (it won't duplicate the body).

- **Snackbars visible in dark mode** (A1-313) — snackbars now render as a light toast on the dark app background (and a dark toast in light mode) instead of a dark toast that was hard to see against a dark page. The fix is in the design-system Snackbar (React + Web Component); no app-side change was needed.

- **Snackbar configurator — multiple and timed dismiss** (A1-313) — the Snackbar component page now exposes single vs. multiple preview modes, stack count, dismissible state, and an Auto dismiss control that emits React `autoHideDuration`, Web Component `auto-hide-duration`, and React Native `duration` snippets.

- **Backlog ticket creation snackbar** (A1-179) — creating a ticket now shows the existing snackbar with the translated **Open ticket** action that routes directly to the new ticket page.

- **Build with AI standards review** — expanded generated development plans with a required Final standards review covering custom styling, component usage, tokens, accessibility, interactions, content, state handling, architecture, responsive behavior, test coverage, and standards debt. Plans now also require user-facing copy to be added to `system/labels/` with supported locale translations and consumed through the label resolver. Local-AI plans append the canonical checklist if the model omits it.

- **Build with AI component inference** — the built-in planner now recognizes component names in general-scope ticket titles/descriptions, so tickets such as "Multiple Snackbars" plan against the component package, Storybook, a1-web configurator, docs, and changelogs instead of producing an app-only plan.

- **Releases page horizontal scroll** (A1-398) — release-note content now benefits from shared typography wrapping, so long inline changelog fragments stay inside the release panels at narrow widths.

- **Backlog ticket mobile toolbars** — ticket triage toolbars now use the shared Toolbar overflow behavior in both the ticket dialog and standalone ticket page, keeping type, status, priority, and size controls on one mobile row with excess options moved into More menus.

- **Backlog — Build with AI in production** — the ticket detail page now shows Build with AI in production builds instead of limiting it to local dev. It still prefers a local Ollama model when reachable, but falls back to the built-in planner so deployed users can generate a ticket plan without browser API keys or local setup.

- **Button loading spinner reuse** (A1-308) — the design-system Button loading state now reuses the shared Circular Progress component instead of a custom spinner, keeping the same Button API and loading behaviour while removing duplicate UI.

- **Supabase backup workflow preflight** (A1-245) — fixed manual backup runs reporting "No jobs were run" by normalizing the dispatch trigger, updating the workflow to the current GitHub Actions runtime pattern, and adding a first-step configuration check so missing backup secrets fail as an actionable job error instead of an empty run.

- **Projects page — responsive action toolbar** — the Projects (editor home) header actions now stay useful at every width. The secondary actions (Help, Image library, Upload JSON) moved into a `Toolbar` with `overflow`: they show with labels from the `md` breakpoint up, collapse to icon-only below, and move into a "More actions" menu when even the icons don't fit — so the primary **New project** button (kept as a full `SplitButton`/`Button` beside the toolbar) is always visible instead of wrapping to a second row on small screens. Icon-only tools keep their accessible names.

## 0.23.0 — 2026-07-04

- **Shortcut for new ticket** (A1-393) — pressing **`!`** anywhere in the app opens the **New ticket** dialog (unscoped, `kind: 'general'`), matching the existing global-shortcut pattern (like `?` for Help). It's guarded against firing while typing in an input, textarea, or select, and is listed in the "Show all shortcuts" menu (Jump section) as **New ticket · Shortcut: !**. Works app-wide because the create-ticket dialog is owned by `BacklogProvider` above the app.

- **Priority Guide editor + Wireframe theme** — a new **Priority guides** editor under **Editors** (`/priority-guide`) brings the priority-guide workflow into a1-web: create content-first alignment docs (problem, audience, user/business goals, and a priority-ranked content hierarchy with groups), edit fields inline, reorder items by drag or arrows, and edit the live JSON two-way. Guides seed from the four bundled examples, persist locally, and **cloud-sync** as part of the shared workspace envelope alongside projects/patterns/themes. A guide can be **attached to a project + page** and **converted to a real A1 page** (round-trippable — the source guide is stashed in `page.meta` so "convert from page" is lossless), then previewed as a **wireframe**. The deliberately un-designed **Wireframe** theme (`.a1-theme-wireframe`) is black/grey/white only, no shadows, zero-radius, and monospace, so reviewers can focus on structure before visual design. It is selectable in Settings → Theme; the editor's **Preview wireframe** button opens the converted page standalone under that theme (via a new `?theme=` param on the editor preview).

## 0.22.0 — 2026-07-03

- **Cloud sync — removed background polling, added "Sync now"** — the four 8-second Supabase polls (shared workspace envelope, workspace labels, backlog, and data sources) were removed. They re-downloaded whole tables/blobs every tick regardless of whether anything changed and were the dominant source of uncached egress. Live updates still arrive via the existing Supabase **Realtime** subscriptions; a new **Sync now** action on the Account page pulls the latest projects, patterns, themes, labels, backlog, and data sources on demand for the rare case Realtime hasn't delivered.

## 0.21.0 — 2026-07-02

- **Chip component** (A1-390) — added Chip under **Actions & Controls** with a live configurator for selectable, menu-trigger, and navigation chip groups. The editor Add panel can insert a configured ChipGroup, and DataTable filters now render with the shared Chip component.

- **Editor add catalog — complete component coverage** — the page and pattern editor Add panel now includes every component from the Components registry. Missing entries such as Search Field, Action Tiles, Page Layout, Canvas, Side Nav, Autocomplete, Inline Editable, Notification, Snackbar, Dialog, Menu, Context Menu, Bottom Sheet, Stat, and Node now have addable templates and render through the editor registry. Search Field is also included in the default Common set.

- **Action Tiles** (A1-389) — added the new grouped `ActionTiles` component to the Components section under **Actions & Controls** with a live configurator, generated prop table, rules tab, Storybook examples, and package/status/related-component metadata. The component now uses container-based sizing, a tighter no-shadow surface, no body slot, group layouts for grid or stack, gap on/off, and the same blue interactive border treatment as navigation Card. Interactive tiles show a configurator note and automatically remove nested accessory/footer controls.

- **Help shortcut** — the global `?` shortcut now opens the Help assistant menu instead of routing straight to the full Help page.

- **Help chat bot** (A1-157) — the top-header Help icon now opens a lightweight local help assistant instead of jumping straight to the Help page. Users can ask plain-language questions, get immediate answers sourced from the canonical Help content model, review matched Help topics, and jump into the full Help page with the assistant’s query prefilled. The first slice is intentionally non-AI: local ranking over Help content only, with a clean service seam for a future AI-backed answerer.

- **Help page — canonical data model** (A1-338) — moved the Help content into a dedicated `src/help/helpContent.jsx` module backed by a shared help-model normalizer. The page now renders from that canonical object, while the same source also exports an AI-friendly plain-text catalog (`HELP_AI_CONTENT`) and normalized keyword/search metadata for future consumers. New Help articles should now be added to the shared help-content model instead of embedding content directly in the page component.

- **Color foundations — 25 ramp step** (A1-342) — base color ramp tables and the OKLCH visualization now include the new `25` step for every color ramp.

- **A1-349 — Project deletion persistence** — fixed deleted Projects coming back after cloud sync by making shared project hydration replace the local project set instead of merge-only upserting. Project deletion now also clears the project's page-list and shared-layout storage without triggering sample seeding during the delete path.

- **Backlog CSV export** — added an Export CSV action to the Backlog panel that downloads the entire backlog, independent of the current view, filters, table pagination, or sort.

- **Icon font loading stability** — constrained A1 icon ligatures to a fixed 1em square with clipped overflow so Material Symbols do not briefly expand layout while the icon font loads.

- **Components sidebar A-Z view** — added an unlabeled icon toolbar toggle beside the Components sidebar search so builders can switch between the grouped category tree and a flat A-Z component list while keeping smart search active. The selected view persists per browser in localStorage.

- **Components smart search** — added curated component aliases, keyword matching, and misspelling tolerance to the Components sidebar and all-components table. Searches like `CTA` surface Button, while searches like `grid` keep Grid first and also include Data Table as a related match.

- **DataTable custom search matcher** — added optional `searchMatcher` support for DataTable searchable columns so consumers can layer aliases, fuzzy matching, or domain-specific search behavior onto the built-in filter UI.

- **Search Field clear action sizing** — adjusted the SearchField trailing clear button spacing so the icon button stays inside the compact field border, reserves matching input text space, and scales up in comfortable fields.

- **Components package coverage** — added Web Components to the Components overview package list and component detail support grid, with Button and Snackbar marked as available from `packages/web-components`.

- **DataTable mobile layout** — added a `mobileLayout` prop and configurator control so mobile tables can either render as Card-like definition-list rows or preserve the table layout with horizontal scroll. The default card mode now uses Card surface, border, radius, and shadow tokens and removes per-field divider lines.

- **DataTable mobile sort and filter menu** — when a DataTable has filters or search controls, the mobile sort control now moves into the same menu as filters as a **Sort & filter** action instead of rendering as a separate stacked field.

- **DataTable editor slice** — added real column configuration to the a1-web DataTable configurator: add, delete, select, and reorder columns; edit column labels; choose a column component; and set sortable, filterable, search-by, and inline-editable behavior per column. The shared React DataTable now supports column-generated filters, column-scoped search, custom `renderCell` slots, and `onCellChange` for inline editable cells.

- **DataTable — page-size control and contained overflow** — added `defaultPageSize`, `pageSizeOptions`, and `onPageSizeChange` so tables can expose a Rows per page selector in the pagination footer. DataTable wrappers now contain horizontal overflow, the component configurator can preview page-size choices, and the Backlog All tickets table opts into horizontal scrolling with 10 / 25 / 50 row choices.

- **DataTable configurator cleanup** — combined Density and Appearance into one Display toolbar with a divider between density and visual toggles, grouped Display, Features, and Caption into a default-open Table accordion, moved selection controls into the Features toolbar, moved empty-state controls into a collapsed accordion, and restored the shared preview Padding and Inverse controls.

## 0.20.0 — 2026-07-01

- **Section configurator — background image** (A1-345) — the Section page's Background panel now configures the new background-image props: pick an image from the active project library or a URL, set the fit (cover / contain / tile), choose the focal point on a 3×3 grid, and add a darken/lighten contrast overlay with a strength slider. The gradient controls hide while an image is set (the component gives the image precedence) and the emitted code snippet includes the new props.

- **Settings — sign-in option** — the Settings menu now always includes an Account section. Signed-out users see a Sign in action that opens the Account page; signed-in users see their email, Account, and Sign out actions.

- **Projects — editable project definition JSON** — the project "definition" dialog now shows the JSON bundle in a scrollable, editable code snippet (a fixed-height, resizable editor) instead of a read-only collapsible block. Edits update what **Copy code** copies, so the bundle can be tweaked before pasting into the importer; the stored project is unchanged.

- **Editor — rename items in the Layers tree** (A1-22) — right-click a node in the editor's Layers tree and choose **Rename**, **double-click** its label, or press **F2** to edit its name inline (Enter or click-away commits, Escape cancels). The custom name is stored on the node (`node.name`) and overrides the auto-derived label (pattern name → text content → component type); clearing it restores the auto label. Built on the design-system `TreeMenu`'s new inline-rename support, recorded as a normal undoable editor change.

## 0.19.0 — 2026-06-30

- **Split Button styling** (A1-380) — fixed the Button configurator's React SplitButton preview so secondary split buttons show a single shared outline with the intended divider instead of a doubled border seam.

- **Backlog — consistent ticket card variants** (A1-353) — the board and queue views now share one ticket card pattern with view variants. Queue tickets use the same metadata/badge structure as board cards and a default-size icon button for the open action.

- **Editor — pattern creation flow** (A1-231) — creating a pattern from a selected page element is now available from the right-side Configure panel. The flow replaces the source element with a linked pattern instance, then opens the new pattern in the editor so its name and details can be filled in immediately, with a back link to the source page shown in the pattern details.

- **Backlog — remembered swimlanes** — the board now saves which swimlanes are shown in local storage alongside the existing backlog search, sort, and filter preferences, so hidden or restored lanes persist across reloads.

- **Backlog — next and previous ticket review** (A1-243) — the ticket detail dialog footer now has left-aligned previous and next icon buttons so reviewers can move through the current backlog view without closing the dialog. The sequence follows the active view: board order, all-tickets order, or the grouped queue order.

- **Editor — Figure radius editing** (A1-346) — fixed Figure radius changes in the editor, including changing an existing rounded image back to None. The editor now writes `radius="none"` explicitly instead of dropping the prop, so merged node updates clear prior rounded values correctly.

- **Rules editor — editable rules and examples** (A1-57) — every rule in the Rules table can now be edited. Editing a built-in rule saves a local override with the same rule id, so the bundled source stays intact while the editable local version appears in the table. The rule dialog also supports illustrative examples: add code snippets, upload images, or paste an image into the examples area; image examples are stored through the existing local image library. The table shows an Examples column with compact code/image previews.

- **Backlog — paste images into tickets** (A1-160) — ticket creation and editing dialogs now accept pasted images anywhere inside the dialog. Pasted images use the existing local image library storage path, are added to the ticket's screenshot attachments, announce success with a polite status message, and leave normal text paste alone unless the clipboard contains an image. The ticket edit dialog also gained removable screenshot thumbnails so attachments can be managed after creation. Help updated.

- **Stat — component page + configurator** (A1-375) — the `Stat` component now has a live a1-web component page under the **Data** category (`/components/stat`), with a Configure panel (title, value, format, size, align, advanced number-format options, and a status badge), an accurate code snippet, Properties/Rules/Accessibility tabs, and the standard package/status/related-component registry entries (React-only, experimental).

- **Kitchen sink page** (A1-343) — added a single `/kitchen-sink` page that previews as many A1 components as possible in one scrollable view, grouped by category (typography, actions and controls, inputs, feedback and messaging, layout and media, navigation and data). Built entirely from exported A1 components and layout primitives (`Section`/`Stack`/`Grid`/`Card`) with no custom styling, so it doubles as a quick cross-theme/cross-breakpoint smoke test. Linked from the Explore menu and global search (keywords: gallery, showcase, sticker sheet, preview).

- **Component examples / sticker sheets** (A1-102) — added focused example child pages to component detail pages, backed by lightweight JSON definitions. Examples apply preconfigured component configs into the live configurator st…48541 tokens truncated…th values — match it to the Section above for visual alignment. Always nest a `ButtonContainer` inside. Do not combine with `BottomDrawer` on the same screen. Includes `env(safe-area-inset-bottom)` padding for notch devices.
- **Onboarding template** — refactored to use `StickyActions` + `StepTracker` + `ButtonContainer` at the bottom of the viewport. Content steps now render in a single `Section` that re-renders per step, with the action bar staying fixed in place so the button position never jumps between steps.

---

## v0.10.0

- **DefinitionList copy action** — copy value affordance now uses a small tertiary `Button` with visible copy/copied text instead of an icon-only `IconButton`; layout keeps the action immediately after the value instead of pushing it to the far edge of the row.
- **`semantic.color.surface.field` token** — new surface token for form field backgrounds, independent of `surface.page`. All field-family components (Field, Textarea, Select, Checkbox, Radio, Switch, Choice Group, Inline Editable) now reference `--semantic-color-surface-field`. Fieldset surface variant uses `surface.card`. Dark mode value: `neutral.700` (elevated above `neutral.800` page). Fresh theme override: `neutral.0` (white) so fields stand out against the mint gradient.
- **DataTable notice row mobile fix** — at ≤640px the card layout's `td::before` column-label pseudo-element was creating a blank 110px gap before notice row content. Notice rows now suppress `::before` and reset to `display: block` so banners span the full card width.
- **BottomDrawer Storybook Docs** — added `tags: ["autodocs"]` and `argTypes` to `BottomDrawer.stories.jsx` so the component has a generated Docs page in Storybook.

---

## v0.9.0

### Prompt: BottomDrawer component + surface-card token

- **BottomDrawer component** — fixed bottom navigation bar for mobile viewports. Up to 5 items, each with a Material Symbols icon stacked above a short text label. Items support `href` (renders `<a>`) or `onClick` (renders `<button>`), `active`, `badge` (capped at 99+), and `disabled`. Shares `--a1-nav-stacked-*` CSS custom properties with TopHeader's icon-above mode for visual consistency. Added `system/tokens/component/bottom-drawer.json` (height 56px, border-width 1px, z-index 200), `system/rules/bottom-drawer.yaml`, React component and stories, BEM classes in `a1-base.css`, scoped classes in `a1-pure.css`, and `examples/a1-pure/bottom-drawer.html`.
- **TopHeader `navIconPosition="hidden"`** — new value suppresses the nav and hamburger entirely at a given breakpoint, intended for use when BottomDrawer covers navigation at xs. `resolveIconAbove()` refactored to `resolveNavMode()` returning `"start" | "above" | "hidden"`. CSS class `a1-top-header--nav-hidden`.
- **`semantic.color.surface.card` token** — separates card surface from page surface. Default value `neutral.0` (same as page). All Card components (React + Pure) now reference `--semantic-color-surface-card` instead of `--semantic-color-surface-page`, enabling theme-level card contrast overrides without affecting the page background.
- **Fresh theme card contrast** — Fresh theme sets `--semantic-color-surface-card: var(--base-color-neutral-0)` so cards appear white against the mint gradient page background.
- **Dark mode card surface** — `color-scheme.css` and the `build-themes.mjs` / `build-html-css.mjs` pipelines updated so dark contexts override `--semantic-color-surface-card` to `neutral.800`.
- **`base.spacing.56` token** — 56px added to `system/tokens/spacing.json`.

---

## v0.8.0

### Prompt: CircularProgress xl size · field story files split · NumberField unit font size

- **CircularProgress `size="xl"`** — added xl size (192px) to CircularProgress React and Pure. New token `component.circularProgress.xl.size` references `base.spacing.192`. CSS modifier `.a1-circular-progress--xl` (React); `.a1-circular-progress-xl` (Pure). TypeScript type updated.
- **`base.spacing.192` token** — 192px added to `system/tokens/spacing.json`.
- **NumberField unit font size** — unit label now uses `--a1-field-font-size` (matches input value size at all density levels) instead of fixed `body-xs`. Color remains muted.
- **Field story files split** — PhoneField, ZipField, CreditCardField, TimeField, and NumberField each have their own dedicated Storybook story file. All removed from `TextField.stories.jsx`.

### Prompt: Section/Stack xl gap · NumberField unit fix · DataTable notice row

### Prompt: Section/Stack xl gap · NumberField unit fix · DataTable notice row

- **Section `gap="xl"`** — added xl (40px) gap option to Section; CSS class `a1-section--gap-xl` maps to `--semantic-spacing-gap-xl`.
- **Stack `gap="xl"`** — added xl to Stack's semantic gap options; resolves to `var(--semantic-spacing-gap-xl)`.
- **Added `semantic.spacing.gap.xl` token** — 40px, references `base.spacing.40`.
- **NumberField unit layout fix** — unit label now sits immediately beside the value and shifts as the value changes. JS tracks value length and sets `--a1-field-number-width` per keystroke; `field-sizing: content` auto-sizes in Chrome 123+/Firefox 128+. Clicking anywhere to the right of the value focuses the input (unit span is `flex: 1` and forwards clicks).
- **DataTable `notices` prop** — accepts `{ content: ReactNode; afterRow?: number }[]`. Each entry renders a full-width no-padding row at the specified position (`afterRow` is 0-based; default 0 = before all data rows). Multiple notices can be placed at different positions or stacked at the same position. CSS classes: `a1-data-table__notice-row`, `a1-data-table__notice-cell`.

### Prompt: IconButton large size + ButtonContainer fillButtons

- **IconButton `size` prop** — added `size="lg"` option matching Button's large height (3.5rem, 2.5rem icon, opsz 40). Default remains `"md"`. React class `a1-icon-button--large`; Pure/Base class `a1-icon-button-large`.
- **ButtonContainer `fillButtons` prop** — when true, `Button` children stretch to fill remaining row space (`flex: 1`) while `IconButton` children stay at their natural square size. Always renders as a row — no collapse to column at narrow widths. React class `a1-button-container--fill-buttons`; Base class `a1-button-container-fill-buttons`.

---

### Prompt: StepTracker component

- Added `StepTracker` to the React package: non-interactive step position indicator with a pill for the current step and dots for all others.
- Props: `steps` (total count), `currentStep` (1-indexed, default 1), `align` ("left" | "center" | "right" | "full", default "left"). `align="full"` expands the active pill to fill remaining container width.
- Accessible via `role="img"` + auto-generated `aria-label="Step N of M"`.
- Added `system/tokens/component/step-tracker.json` and `system/rules/step-tracker.yaml`.
- Added Pure HTML/CSS classes (`.a1-step-tracker`, `.a1-step-tracker__step`, `.a1-step-tracker__step--current`, alignment modifiers) to `a1-base.css` and `a1-pure.css`.
- Added `examples/a1-pure/step-tracker.html` with default, positions, and alignment demos.
- Updated nav on all example pages and the index components list.

---

### Prompt: Fresh theme

- Added **Fresh** theme (`[data-theme='fresh']`): sky-blue accent/info ramp (#0A62DC), teal-green success (#209261), red error (#D11720), amber warning (#D19317), mint gradient background (`linear-gradient(207.43deg, #D7FFF8 0%, #CDF5EE 57.44%)`).
- Typography: Nunito for body + headings (ExtraBold weight 800 for headings), Baskerville for display.
- Border radius: `--base-radius-xl` overridden to `10px`; card and dialog border-radius set to match.
- Added `system/themes/fresh/theme.json` and `system/themes/fresh/tokens/typography.json`.
- Generated `packages/pure/dist/a1-fresh.css`; gradient rule added to `a1-pure.css` for `[data-theme='fresh']`.
- Fixed pre-existing token error: added missing `base.spacing.48` (48px) to `system/tokens/spacing.json`, required by `component.circularProgress.xs.size`.

---

### Prompt: Icon sizes and colors; Dialog status variant

- **Icon:** Added `size` prop (`xs`/`sm`/`md`/`lg`/`xl`/`jumbo`/`xJumbo`) with automatic optical-size tuning. Added `color` prop (`muted`/`accent`/`inverse`/`success`/`error`/`warn`/`info`). Size and color classes added to `a1-base.css` and `a1-pure.css`.
- **Dialog:** Added `status` prop (`success`/`error`/`warn`/`info`/`neutral`) rendering a full-bleed colored hero band with a status icon above the title. Default icons per status. Pass `icon` to override the default icon. `onClose` is now optional — omit it to hide the dismiss button.
- Removed A11y example stories from Dialog (focus management, high contrast, missing title).

---

### Prompt: Add CircularProgress component

- Added `CircularProgress` to the React package: SVG-based ring progress indicator with `value`/`max` determinate mode and `indeterminate` spinning mode.
- Sizes: `xs` (40 px, children after ring), `sm` (64 px), `md` (96 px, default), `lg` (128 px) — sm/md/lg support arbitrary `children` centered inside the ring.
- SVG uses a 100×100 viewBox with a 10-unit stroke so the ring scales proportionally with the CSS container size.
- Added Pure HTML/CSS implementation using `conic-gradient` + CSS `mask` radial cutout — background-color agnostic and theme-safe.
- Added `system/tokens/component/circular-progress.json` and ran token rebuild.
- Added `system/rules/circular-progress.yaml` with six usage rules covering accessibility, xs behaviour, indeterminate ARIA, and color overrides.
- Added Pure example page `examples/a1-pure/circular-progress.html` with all size, indeterminate, and token-override variants.
- Updated nav on all existing example pages to include Circular Progress.
- Added to a1-web component docs under Feedback (coverage: React + Pure, status: beta).

---

### Prompt: Add Definition List component

- Added `DefinitionList` to the React package with semantic `<dl>/<dt>/<dd>` output.
- Added row and column directions, `sm`/`md`/`lg` sizes, auto and fixed row label widths, Heading-based value typography, and optional copy value buttons.
- Updated the React package publish file list to include component `.d.ts` declarations.
- Fixed `Heading` runtime validation so documented `as="p"` and `as="span"` values render correctly.
- Added `system/rules/definition-list.yaml` with guidance for column, row-auto, row-fixed, copy values, and heading values.
- Added Definition List to a1-web component docs under Data with preview, snippets, prop tables, related components, and rule coverage.
- Added Pure HTML/CSS classes and a Pure example page for Definition List.

---

### Prompt: Calendar — selectable date range enforcement and 0.4.1

- Added `selectable` prop to `Calendar` — date selection is now opt-in (off by default). Previously the `DateRange` and `SelectedDate` Storybook stories were missing this prop.
- Out-of-range dates (outside `minDate`/`maxDate`) are fully non-interactive in selectable mode: no click handler, no `tabIndex`, and `handleDayClick` has an early-exit guard as a safety net.
- Updated `Calendar.d.ts` to document the `selectable` prop.
- Bumped `@gtivr4/a1-design-system-react` from `0.4.0` to `0.4.1`.
- Storybook `DateRange` story now spans June this year to July next year (was two months from today); both `SelectedDate` and `DateRange` stories no longer constrain the calendar width.

---

### Prompt: StatusBar pause button, labels, and React package 0.4.0

- Replaced the StatusBar indeterminate pause/play toggle from a custom bare `<button>` to a `<Button size="sm" variant="secondary">` component.
- Pause and Play buttons now display a visible text label alongside the icon.
- Added `system/labels/status-bar.json` with `statusBar.pause` ("Pause") and `statusBar.play` ("Play") labels and translations for es, fr, de, pt, ja, zh, and ar.
- Wired status-bar labels into the Storybook `LabelsProvider` and the a1-web `LabelsProvider` so locale switching affects the button text.
- Removed the now-redundant custom `.a1-status-bar__pause` CSS block; only the appear animation is retained.
- Bumped `@gtivr4/a1-design-system-react` from `0.3.1` to `0.4.0`.
- This release also includes the 0.4.0 prop consistency changes: Tab `status="warning"→"warn"`, Section `alignment→align`, Notification `variant→status` / `"default"→"neutral"`, Heading/Paragraph `align` logical values `"start"/"end"`, labelPosition `"side"→"before"`, Grid `gap="xs"`, SegmentedControl `size` typed, DataTable `density→size`.

### Prompt: Add Choice Group component

- Added `ChoiceGroup` to `packages/react` — a card-tile selection group supporting single-select (radio) and multi-select (checkbox) modes.
- New props: `size` (sm/md/lg tile size), `gap` (sm/md/lg tile spacing), `columns` (fixed column count or "auto" responsive fill), `multiple` (boolean), `required`, `disabled`, `hint`, `error`.
- Each option accepts `value`, `label`, `subtext`, `icon` (Material Symbols), and `disabled`.
- Visual indicator in the top-right corner of each tile: circle for single-select, checkbox square for multi-select.
- Added component tokens in `system/tokens/component/choice-group.json` and rebuilt token output.
- Added Storybook stories: Configurable, Single vs Multi, Sizes, Gap, Columns, With Icons, Without Icons, States, Controlled.
- Exported `ChoiceGroup` from the React package index.
- Updated `system/ai/components.md` registry.

### Prompt: Stabilize local dev ports and Catlympics theme mode

- Added fixed `--strictPort` dev scripts for the examples index, a1-web, Storybook, Priority Guide, Cat Stack Cafe, Theme Editor, and Catlympics so local URLs are bookmarkable.
- Documented the stable local port map in `system/ai/quick-orientation.md`.
- Updated example package dev scripts to call the fixed root dev scripts.
- Added Catlympics compound theme overrides so its fixed light theme wins when a host also applies `a1-theme-light` or `a1-theme-dark`.
- Cleaned up the Storybook Catlympics theme class during decorator teardown.

### Prompt: Update Catlympics example to latest A1 theme

- Updated the Catlympics example to load the current Catlympics font stack and rounded Material Symbols font.
- Removed local Inter font variable overrides so the example uses the generated A1 Catlympics theme tokens.
- Added the Catlympics rounded icon font family to the system theme source and regenerated React theme CSS.
- Rebuilt the Catlympics example dist output against the latest local A1 React source.
- Fixed the Catlympics dark/light conflict by loading `color-scheme.css` before `themes.css` and forcing `color-scheme: light` in the Catlympics theme.

### Prompt: Remove examples/a1-design project

- Removed the `examples/a1-design` project and its generated build output.
- Removed root build, dev, preview, and Storybook copy scripts that targeted `examples/a1-design`.
- Updated README, project structure context, and the Nathan Dana project launcher so they no longer reference the removed example.
- Added a root local dev index page so `npm run dev` at `/` links to the remaining examples.

### Prompt: Add GitHub repo setup details to Get Started

- Added a GitHub repo setup section to Get Started for `nathandana/A1DesignSystem`.
- Added copyable clone, install, build, and local dev commands.
- Added repo-level context files, including `AGENTS.md` and `CLAUDE.md`, for AI-assisted editing before package-specific setup.

## 0.2.0 — 2026-06-08

### Prompt: Organize 0.2.0 release and Releases page

- Published the accumulated A1 web changelog as the `0.2.0` release.
- Added a Releases page under Resources with one tab per changelog release.
- Rendered release notes from `apps/a1-web/CHANGELOG.md` so the app uses the repo changelog as the release source.

### Prompt: Bump A1 React package to 0.2.0

- Updated `@gtivr4/a1-design-system-react` from `0.1.0` to `0.2.0`.
- Updated the workspace lockfile entry for `packages/react`.

### Prompt: Add first-class Code component

- Added a React `Code` component with inline and block variants, optional wrapping, and a copy-code affordance.
- Added a standard Storybook docs page and Configurable story for the `Code` component.
- Added a border to block code surfaces and moved the copy-code button outside the bordered code display area.
- Added a clipboard fallback so the copy-code button still works when the browser exposes `navigator.clipboard` but rejects `writeText`.
- Fixed Storybook copy-code behavior by ignoring empty `copyText` overrides and letting the component copy rendered code content by default.
- Added `system/labels/code.json` with default English labels for "Copy code" and "Copied"; wired those labels into a1-web and Storybook label providers.
- Added es/fr/de/pt/ja/zh/ar translations for the copy-code labels.
- Updated Get Started code examples to use the first-class `Code` component with copy buttons.
- Standardized clipboard/copy-code icon guidance on `content_copy` in `system/icons/icon-usage.md`.
- Updated agent guidance so new user-facing labels must include supported translations unless explicitly blocked.

### Prompt: Catlympics button enhancements and contrast fixes

- Added `box-shadow: var(--component-button-box-shadow, none)` to `.a1-button` in `button.css`, defaulting to `none` so other themes are unaffected.
- Added `box-shadow` to the button transition list for smooth state changes.
- Changed `.a1-button--lg` to reference `var(--component-button-large-border-radius, var(--base-radius-lg))` instead of `var(--base-radius-lg)` directly, enabling per-theme radius override without touching `--base-radius-lg` globally.
- Catlympics: set `--component-button-box-shadow: 4px 4px 0 var(--base-color-neutral-900)` — hard no-blur shadow to the bottom-right.
- Catlympics: fully rounded (pill) buttons — set `--component-button-border-radius`, `--component-button-small-border-radius`, and `--component-button-large-border-radius` all to `9999px`.
- Catlympics contrast fix — primary button foreground changed from `accent-0` to `neutral-900` (#1a0f07, 5.84:1 on #ff3fa6); hover foreground same.
- Catlympics contrast fix — primary button pressed foreground changed to `neutral-0` (#fffdfb, 6.26:1 on pressed `accent-700` #b1226a) so light text sits correctly on the dark pink pressed state.
- Catlympics contrast fix — secondary and tertiary button foreground changed from `accent-600` (#e03595, 3.89:1) to `accent-700` (#b1226a, 6.01:1) on their light backgrounds.
- Catlympics contrast fix — `--semantic-color-text-accent` changed from `accent-600` to `accent-700` (6.26:1 on neutral-0).

### Prompt: Fix Catlympics icon font not rendering

- Added `&display=block` to the Material Symbols Google Fonts link in `apps/a1-web/index.html`.
- Without `display=block`, Google Fonts uses `font-display: optional`, which skips loading uncached fonts on first visit — causing icon ligature names to render as plain text instead of glyphs in the Catlympics theme (which switches to Material Symbols Rounded, newly added and not yet cached).

### Prompt: Centralize icon registry and Iconography table

- Added `system/icons/material-symbols.json` as the system-level source of truth for available A1 icon names, seeded from Google Fonts Material Symbols metadata.
- Updated Storybook icon controls for Icon, Button, Icon Button, Link, Card, Banner, List, Empty State, Badge, and Data Table to use the shared icon registry as select options.
- Added built-in `DataTable` search and filter props, then replaced the Iconography foundation sample icon grid with a searchable and category-filterable `DataTable` showing the full registry.
- Split the Iconography foundation into Icons and Sizing tokens tabs, with the icon registry first.
- Added built-in client-side `DataTable` pagination via `pageSize` and applied it to the icon registry table.
- Fixed icon registry name and category cells by using plain icon row values when no category filter is active.
- Removed 16 Material Symbols metadata entries that do not render as ligatures in the current outlined webfont.
- Added `system/icons/icon-usage.md` as the system-level source of truth for scenario-based icon choices.
- Added an Iconography Usage tab that displays the icon usage lookup from the system markdown file.
- Standardized icon usage decisions around settings, success/completion, lists, folders, and palettes.
- Replaced invalid current web icon names with verified registry icons.

### Prompt: Better icons for Storybook motion and contrast toolbar controls

- Changed the Reduced motion toolbar icon from `"play"` (media playback) to `"lightning"` (motion/animation energy).
- Changed the Reduced motion "Reduced" item icon from `"accessibility"` to `"lightningOff"` (motion disabled).
- Changed the Contrast toolbar icon from `"contrast"` to `"eye"` (visual perception); kept `"contrast"` for the "More" item.

### Prompt: Scope Calendar scrollIntoView to nearest scrollable container

- Replaced the scroll-variant `scrollIntoView` call with a manual DOM walk that finds the nearest `overflow: auto/scroll/overlay` ancestor.
- If no explicitly scrollable container is found before `document.documentElement` (e.g. in the anatomy panel), the scroll is skipped entirely — the page no longer jumps.
- When the Calendar is inside a proper scroll region (e.g. `PageLayout`'s main area), it scrolls that container to show the current month.

### Prompt: Add Calendar to a1-web component docs

- Added `calendar` to the Data category in `componentCategories` in `apps/a1-web/src/pages/components/data.js`.
- Added `calendar: ['React']` to `PACKAGE_COVERAGE` and `calendar: 'experimental'` to `COMPONENT_STATUS`.
- Added `calendar: ['data-table', 'field', 'pagination']` to `COMPONENT_RELATED`.
- Added `Calendar` import and a dedicated `case 'calendar'` anatomy preview (scroll variant, one month) to `ComponentDetailPage.jsx`.
- Added `COMPONENT_ANATOMY_OVERRIDES.calendar` with four callouts (Container, Month heading, Day grid, Weekday headers) and Calendar-specific sizing descriptions.
- Added `COMPONENT_SNIPPETS.calendar` with scroll and paginated usage examples.
- Added `COMPONENT_PROPS.calendar` with all seven real Calendar props (variant, initialMonth, monthsToShow, highlightToday, dimPast, todayButton, className).
- Updated `system/ai/components.md` Data category row and Calendar props note.

### Prompt: Add locale selector to a1-web settings menu

- Added `calendarLabels` and `fieldLabels` JSON imports to `main.jsx`; merged into `allLabels` passed to `LabelsProvider`.
- Added `localeOptions` (en/es/fr/de/pt/ja/zh/ar with display names) and `VALID_LOCALES` validation list.
- Added `locale` state initialised from `localStorage` (`a1-web-locale`) with valid-value guard.
- Added a Locale `MenuSection` with a compact `SelectField` to the settings menu.
- Added an Alpha badge next to the Locale label using `.a1-web-alpha-badge`.
- Added `setLocale('en')` to the Reset to defaults button.
- Added `.a1-web-alpha-badge` CSS class to `styles.css` using action-background and action-foreground tokens.

### Prompt: Add Labels foundation page to a1-web

- Created `apps/a1-web/src/pages/foundations/LabelsFoundation.jsx` with a `flattenLabels` helper that recursively extracts `$value` leaf nodes from the label JSON.
- Built a tabbed page (Calendar, Field, Action tabs) where each tab shows a `DataTable` of all translated values with columns for the label key and each supported locale.
- Arabic column values render with `dir="rtl" lang="ar"` for correct bidirectional text.
- Added `foundation-labels` to the foundations data and wired the new page into `FoundationDetail.jsx`.
- Added "Localised label system with per-locale translations and RTL support" to the Foundations features bullet list.
- Added "Locale selector in settings for live translation preview across all labeled components" to the Workflow features list.

### Prompt: Add locale toolbar to Storybook scoped to story canvas

- Added a `locale` global toolbar to `.storybook/preview.jsx` with all eight supported locales (en/es/fr/de/pt/ja/zh/ar) using a `globe` icon and `dynamicTitle: true`.
- Wrapped the `withTheme` decorator story output in `<LabelsProvider locale={…} labels={allLabels}>` so locale affects only the rendered story, not the Storybook UI.
- Scoped RTL to the story canvas via `<div dir={dir}>` around `<Story />` — `document.documentElement` is not modified.
- Removed `locale` from the `useEffect` dependency array so locale changes do not re-fire theme DOM effects.

### Prompt: Calendar RTL support and locale week-start

- Added `calendar.weekStart` and `calendar.direction` labels to `system/labels/calendar.json`; defaults are `"0"` (Sunday start) and `"ltr"`.
- Added per-locale week-start overrides (Monday start for es/fr/de/pt/zh, Saturday start for ar) and RTL direction for Arabic.
- Added Arabic translations for all 12 month names, three weekday label lengths, and all five nav strings.
- Calendar scroll and paginated variants read `weekStartDay` from labels and rotate weekday header columns accordingly using `rotateArray`.
- RTL is detected from the `direction` label; paginated prev/next chevron icons swap when `isRtl` is true.
- Updated Storybook stories to remove the local `LabelsProvider` and `locale` argType — locale is now handled by the global toolbar.

### Prompt: Calendar today button for paginated variant

- Added `todayButton` prop (default `false`) to the paginated Calendar variant.
- Pressing Today calls `goToCurrentMonth()`, resetting the displayed month to the current one.
- Today button is visually separated from the month/year selects with a `border-inline-start` divider.
- Added `todayButton` to `Calendar.d.ts` with a JSDoc comment noting it applies to paginated only.
- Added `PaginatedWithToday` story to `Calendar.stories.jsx`.

### Prompt: Translate Calendar month and weekday names

- Added 12 month-name labels and three weekday label lengths (long/short/letter) to `system/labels/calendar.json` with translations for es/fr/de/pt/ja/zh.
- Calendar component reads all 39 label values at the top level using individual `useLabel` calls (required by React Rules of Hooks — no calls in loops).
- Month names and weekday column headers are now fully localised when a `LabelsProvider` with a matching locale is present.

### Prompt: Storybook toolbar icons for motion and contrast controls

- Replaced the Motion and Contrast toolbar title text with icon-only display using `dynamicTitle: true`.
- Motion toolbar uses `icon: "play"` with items `browser` and `accessibility`.
- Contrast toolbar uses `icon: "contrast"` with items `browser` and `contrast`.

### Prompt: Calendar container query breakpoints

- Changed the medium calendar container query breakpoint from 400 px to 479 px (trigger at < 480 px).
- Changed the compact container query breakpoint from 240 px to 319 px (trigger at < 320 px).
- Medium density now covers a wider range of narrow containers; compact activates only on very small surfaces.

### Prompt: Calendar paginated variant

- Added `variant` prop (`"scroll"` | `"paginated"`, default `"scroll"`) to the Calendar component.
- Paginated variant renders one month at a time with Previous and Next navigation.
- At ≥ 480 px, prev/next use `Button` components with full text labels; at < 480 px they swap to `IconButton` to save space.
- Month and year selects use the `SelectField` component; labels come from `system/labels/calendar.json`.
- Added all five paginated navigation strings (`previousMonth`, `nextMonth`, `selectMonth`, `selectYear`, `today`) to `system/labels/calendar.json` with translations for es/fr/de/pt/ja/zh.
- Added `Calendar.d.ts` with TypeScript types for all props.
- Added `Paginated` and `PaginatedNarrow` stories to `Calendar.stories.jsx`.

### Prompt: Calendar leading blank cell background

- Applied the same `--semantic-color-surface-raised` background to leading blank cells in the first calendar row.
- Only cells before the first day of the month in the first row are shaded; trailing blanks in later rows (future-month carryover) remain transparent.

### Prompt: Calendar font weight token

- Replaced hardcoded `font-weight: 500` on `.a1-calendar__weekday` with `var(--base-font-weight-medium)`.

### Prompt: Calendar today full-cell highlight

- In the full-size (≥ 480 px) calendar view, the entire today cell is highlighted with `--semantic-color-action-background` background and `--semantic-color-text-inverse` text.
- In narrow (< 480 px) view, the cell background reverts to transparent and only the day-number circle receives the highlight, matching the compact density.

### Prompt: Calendar past-day dimming

- Added `.a1-calendar__day--past` with `background: var(--semantic-color-surface-raised)` to visually differentiate dates before today.
- Text remains `--semantic-color-text-default` (~16:1 contrast against the raised surface) to meet WCAG AA contrast on the tinted background.

### Prompt: Move Configure controls into tab

- Moved component Configure controls from the right-side detail aside into the Configure tab content.
- Simplified the Components docs shell by removing the unused right-aside layout path.

### Prompt: Build component Anatomy tab

- Preserved the selected component detail tab while navigating between component pages from the sidebar.
- Replaced Anatomy tab placeholders with a centered component anatomy diagram, numbered feature callouts, and sizing/overflow documentation.
- Added category-level anatomy defaults plus targeted overrides for common components including Button, Icon Button, Link, Card, Tabs, and Data Table.
- Expanded Anatomy previews to render real default component examples such as Paragraph text, Button, fields, choice groups, feedback, layout primitives, and pagination.
- Added visible width and height behavior labels inside the anatomy preview area.
- Added a Show callouts switch to the Anatomy tab and anchored callout markers to the component preview rather than the stage.
- Replaced overlaid anatomy number markers with labeled dotted-line connector callouts that point to the component without covering it.
- Increased anatomy callout contrast with stronger label borders, thicker dotted connectors, and larger endpoint dots.
- Added tokenized anatomy stage and callout marker styles for the component detail page.

### Prompt: Split Components page implementation

- Broke the large `Components.jsx` implementation into a `pages/components/` module structure with separate data, utility, sidebar, overview, category, detail, and shell files.
- Kept `pages/Components.jsx` as a compatibility re-export so existing app imports continue to work.
- Changed related components on detail Overview tabs from navigation cards to a `List` of system `Link` items.

### Prompt: Update component detail Overview tab

- Used the component detail metadata as the single source of truth for component status, with every component currently marked beta.
- Added a Component status card and related component links to the component detail Overview tab.
- Constrained component detail tab content with `Section contentWidth="lg"` so tab panels do not grow too wide.
- Removed the Overview tab "When to use" section because that guidance belongs in Rules.

### Prompt: Fix accessibility contrast — success, warn, error, destructive

#### Success button and badge (light mode + accessible theme)

- Bumped `--semantic-color-status-success-background` in all light-mode contexts (`color-scheme.css`) from `success.500` (#16a34a, 3.21:1) to `success.600` (#005e26, 7.80:1). Fixes axe `color-contrast` violation on solid success badge and success button.
- Added compound selector `.a1-theme-accessible.a1-theme-light` in `system/themes/accessible/theme.json` overriding success background to `success.700` (#003f17, 11.91:1) for the accessible theme, meeting the 7:1 high-contrast target.

#### Warning badge and subtle badges

- Added `semantic.color.status.warn.text` and `semantic.color.status.error.text` semantic tokens to `system/tokens/color-ramp.json`. These tokens provide status-colored text on neutral surfaces, separate from the `background` token used for icon accents and solid badge fills.
- Light mode values: `warn.text = warn.600` (#743d00, 7.99:1 on warn surface), `error.text = error.600` (#94000b, 8.49:1 on error surface). Dark mode values: `warn.300` / `error.300` for legibility on dark status surfaces.
- Changed solid warn badge (`message.css`) to use `warn.200` (#fdc498) background with `neutral.900` text (12.69:1), replacing the saturated `warn.500` amber that failed at 3.10:1.
- Changed subtle warn badge `--a1-badge-subtle-fg` from `warn.background` (failing, 2.92:1) to `semantic.color.status.warn.text` (7.99:1).
- Changed subtle error badge `--a1-badge-subtle-fg` from `error.background` (failing, 4.42:1) to `semantic.color.status.error.text` (8.49:1).

#### Destructive menu item

- Changed `menu.css` destructive item text and icon color from `semantic.color.status.error.background` (4.44:1 on panel background, just below 4.5:1) to `semantic.color.status.error.text` (8.53:1).

### Prompt: Update component details page layout and package badges

- Removed duplicate header from component detail pages—kept only the top section with breadcrumb, title, and package support.
- Updated PackageBadges to show only supported packages: React, React Native, and Pure.
- Changed package badges to display only supported packages (no "future" labels).
- All package badges now use neutral status styling.

### Prompt: Build out Components documentation IA

- Moved the Components tree into a full-width docs shell so the `SideNav` sits flush left instead of inside the body content.
- Changed the overview DataTable package coverage cell from badges to plain text.
- Removed the Future tab from component code snippets.
- Added a searchable left-side component tree to the Components section.
- Added a Components overview inventory table with links, last-updated values, and package coverage.
- Expanded category pages with component listings and a placeholder area for descriptions and general rules.
- Added component detail tabs for Overview, Anatomy, Rules, Configure, Code snippet, Properties, and Accessibility.
- Added a right-side Configure panel with compact controls for label, icon, size, variant, and icon visibility.
- Wired the Rules tab to the existing YAML rule files in `system/rules` where matching rules exist.

### Prompt: Add breadcrumbs to Components pages

- Added breadcrumbs to the Components overview, category, and individual component pages.
- Wired breadcrumb links into the existing a1-web query-param router so navigation stays in-app.

### Prompt: Fix TopHeader tertiary menu keyboard and overflow behavior

- Fixed the tertiary trigger selector so icon and chevron spans no longer inherit label flex styles.
- Reused shared `MenuItem` classes for tertiary trigger rows so the secondary menu matches Menu spacing and sizing.
- Updated `TopHeader` tertiary menu triggers so long labels wrap inside the secondary menu instead of overflowing.
- Changed tertiary menu keyboard behavior so Tab stays in the secondary menu until the user intentionally opens a tertiary menu with Enter, Space, or ArrowRight.
- Added a Tab focus trap inside open tertiary menus and let Escape or ArrowLeft close only the tertiary menu before returning focus to its trigger.

### Prompt: Improve Menu overflow behavior

- Updated the shared `Menu` layout so long item labels and section labels wrap inside the menu container.
- Added horizontal overflow protection for menus and capped shortcut text so it cannot force menu items outside their bounds.
- Added a Storybook overflow-content example for regression coverage.

### Prompt: Add TopHeader open and active menu states

- Kept parent `TopHeader` nav items visibly highlighted while their menu is open.
- Added a stronger `:active` pressed state to top header nav items and tertiary flyout triggers.

### Prompt: Improve tertiary header flyout placement

- Added viewport-aware placement for tertiary `TopHeader` flyouts so they open to the left when there is not enough room on the right.
- Added a computed max height for tertiary flyouts so tall menus scroll within the visible viewport.

### Prompt: Define Components menu hierarchy in registry

- Added an `A1 Web menu hierarchy` section to `ai/components.md` with the Components menu order, route IDs, and selected Material Symbols icons.
- Added a source note in `Components.jsx` so future a1-web component navigation updates stay aligned with the registry.

### Prompt: Fix tertiary header menu hover and focus states

- Removed the gap between tertiary menu triggers and their side flyout so the menu stays open while moving the pointer into it.
- Restored the visible focus outline on tertiary menu trigger buttons and links.

### Prompt: Add Resources menu icons

- Added icons to the Resources header submenu items for Features, Get Started, and Projects.

### Prompt: Add component pages and third-level header navigation

- Added third-level flyout support to `TopHeader` nav menus for child items that contain their own `items`.
- Added a data-driven Components IA with an overview page, category pages, and individual component pages.
- Updated the a1-web Components nav item to show Overview, then component categories, then each category's component pages in a side flyout.
- Kept component routes inside the existing query-param router so category and component pages remain deep-linkable.

### Prompt: Consolidate secondary pages under Resources

- Added a `Resources` parent nav item for Features, Get Started, and Projects.
- Removed Features, Get Started, and Projects as separate top-level nav items while keeping their existing routes and page rendering intact.
- Kept Components, Templates, and Foundations as top-level nav items.

### Prompt: Rework Foundations navigation menu

- Changed the Foundations top nav item from a split link/dropdown control into a single menu trigger.
- Added "Overview" as the first Foundations menu item, linking to the Foundations landing page.
- Added a divider after Overview before listing the individual foundation detail pages.
- Updated `TopHeader` nav submenus to support divider-separated menu sections.

### Prompt: Default color mode to system

- Changed the a1-web color mode fallback from `light` to `system` when no valid `localStorage` value exists.
- Updated the settings menu reset action so "Reset to defaults" returns color mode to `system`.

### Prompt: Move a1-web scrolling into the PageLayout main region

- Added an inner `a1-page-layout__main-scroll` region inside the shared React `PageLayout` `<main>` landmark.
- Moved viewport-height vertical scrolling from `<main>` to the inner scroll region, keeping the header outside the scroll container.
- Enabled `viewportHeight` on the a1-web `PageLayout` so the app shell uses the internal main scroller and avoids page-level rubber-band scrolling.
- Removed the default browser body margin in a1-web so the header sits flush to the viewport top.
- Updated `PageLayout` sizing so the content column and inner main scroll region get a constrained height and scrolling works.

### Prompt: Remove breadcrumbs from non-foundation child pages

- Removed the route-level breadcrumb wrapper from `main.jsx` so top-level child pages no longer render a breadcrumb below the top header.
- Removed the standalone breadcrumb from the Features page header.
- Kept the Foundations landing page and all foundation detail page breadcrumbs intact.

### Prompt: Add breadcrumbs to pages

- Added route-level Breadcrumb navigation below the top header for all non-home pages.
- Added two-level trails for top-level pages and three-level trails for foundation child pages.
- Kept breadcrumb links wired into the app router so users can navigate without a full page reload.

### Prompt: Add Templates to top-level navigation

- Created `apps/a1-web/src/pages/Templates.jsx` as a placeholder page matching the Projects pattern.
- Added `templates` to `PAGES`, `PAGE_TITLES`, `navPages`, and the render block in `main.jsx`.

### Prompt: Add reset-to-defaults button to settings menu

- Added `Button` to the `main.jsx` import list.
- Added a `MenuSection` at the bottom of the settings menu containing a small secondary `Button` labelled "Reset to defaults".
- Clicking it resets `theme` → `a1Light`, `colorMode` → `light`, `reducedMotion` → `false`, `contrastMore` → `false`; the existing `localStorage` sync effects persist the reset values automatically.

### Prompt: Mention contrast mode and reduced motion in Features page

- Added two bullet points to the "Accessible interaction patterns" top-level feature card: `prefers-contrast: more` token stepping and `prefers-reduced-motion` token collapsing.
- Added one bullet point to the "Workflow" minor feature group about contrast and reduced motion settings menu controls with localStorage persistence.

### Prompt: Fix contrast-more direction in dark-mode inverse sections

- Added `.a1-theme-dark.a1-contrast-more .a1-inverse` (specificity 0,3,0) which steps action tokens ONE STEP DARKER rather than lighter.
- In dark mode an inverse section is light, so contrast-more must use the same direction as light-mode contrast-more (darker = more contrast against light bg).
- Previously `.a1-contrast-more .a1-inverse` (0,2,0) was applying lighter values (correct for light-mode dark-inverse sections), making buttons nearly invisible (`accent-50`) on the light inverse surface in dark mode.

### Prompt: Fix contrast-more in inverse sections and restore inverse dark behaviour

**Contrast-more not applying to buttons:**

- Root cause: `.a1-contrast-more` on `<html>` sets `--component-button-primary-background`, but buttons inside `.a1-inverse` sections inherit the CLOSER ancestor's value — the inverse section's own token — shadowing the `<html>` value.
- Fixed by adding `.a1-contrast-more .a1-inverse` (specificity 0,2,0) with one-step-lighter contrast values for action backgrounds, borders, and text within dark/inverse contexts.

**Inverse sections not dark on explicit-light page with OS dark:**

- Root cause: when `colorMode === 'light'` the `.a1-theme-light` class is on `<html>`, but `@media (prefers-color-scheme: dark) { .a1-inverse { light values } }` still fires if the OS is dark. Both have specificity (0,1,0), later source wins — the media query was winning and making inverse sections light.
- Fixed by adding `.a1-theme-light .a1-inverse` (specificity 0,2,0) that restores the full set of dark values, mirroring the standalone `.a1-inverse` block.

### Prompt: Contrast-more — darken muted and accent text

- Added `--semantic-color-text-muted` to all four contrast-more blocks in `color-scheme.css`.
- Light mode: neutral-600 → neutral-700 (one step darker).
- Dark mode: neutral-300 → neutral-200 (one step lighter).
- Applied consistently to `@media (prefers-contrast: more) { :root }`, `@media { .a1-theme-dark }`, `.a1-contrast-more`, and `.a1-theme-dark.a1-contrast-more`.

### Prompt: Fix contrast-more colors and enforce border-box across the system

**Colors not applying:**

- Added `--component-button-primary-background`, `--component-button-primary-background-hover`, `--component-button-primary-background-pressed`, and `--component-button-primary-border` to the `@media (prefers-contrast: more) { :root { } }` block and the `.a1-contrast-more` simulation class — accent-500→600 in light mode.
- Added the same tokens to the `@media dark .a1-theme-dark { }` block and the `.a1-theme-dark.a1-contrast-more` compound rule, stepping one lighter (accent-200→100) for dark-mode high contrast.

**Border-box:**

- Added `*, *::before, *::after { box-sizing: border-box }` global reset to the top of `color-scheme.css` so the design system is self-contained and does not rely on any host-app reset.
- Added `box-sizing: border-box` to the root class of five components that were missing it: segmented control, top-header, tabs, data-table wrapper, and message banner.

### Prompt: Theme selector adapts to SelectField when there are more than 5 themes

- Added `SelectField` to the `main.jsx` import list.
- Wrapped the Theme `MenuSection` content in a conditional: `themeOptions.length > 5` renders a compact `SelectField` with `<option>` children; 5 or fewer renders the existing compact `RadioGroup`.
- `SelectField` uses the native `onChange` event so `setTheme` receives `e.target.value`.

### Prompt: Add Reduce motion and Increase contrast switches to settings menu

- Added `Switch` to the `main.jsx` import list.
- Added `reducedMotion` and `contrastMore` boolean state, both initialised from `localStorage` (`a1-web-reduced-motion`, `a1-web-contrast-more`).
- Toggled `a1-reduce-motion` and `a1-contrast-more` classes on `<html>` in the existing DOM effect.
- Added `localStorage.setItem` sync effects for both new values.
- Added an Accessibility `MenuSection` to the settings menu with two compact `Switch` controls: "Reduce motion" and "Increase contrast".

### Prompt: Add prefers-contrast: more support

- Added `@media (prefers-contrast: more) { :root { } }` block to `color-scheme.css` — interactive elements step one deeper in the accent ramp (accent-500→600 for action-background, etc.), borders step one step more visible (neutral-200→300 subtle, neutral-300→400 default), all 1px component border widths become 2px.
- Added `.a1-contrast-more` explicit simulation class with identical values to the media query block.
- Added a dark-mode block inside the media query (`@media { .a1-theme-dark { } }`) stepping one step lighter for higher contrast on dark backgrounds.
- Added `.a1-theme-dark.a1-contrast-more` compound rule (specificity 0,2,0) for explicit dark + explicit contrast — same dark-mode lighter-step values.
- Added `contrastMode` global to `.storybook/preview.jsx` toolbar with `system` / `more` options and a `contrast` icon.
- Toggle `.a1-contrast-more` on `document.documentElement` in the Storybook `withTheme` decorator when `contrastMode === "more"`.

### Prompt: Accessible theme — blue accent and heavier, darker borders

- Set `--base-color-accent-500` to `#1250C4` (7.07:1 contrast against white) in `system/themes/accessible/theme.json`.
- Also updated accent-400 (#1D68E5) and accent-600 (#0C3DA0) for coherent hover/pressed button states.
- Added two-steps-darker border colors in light mode: `--semantic-color-border-subtle` → neutral-400 (was neutral-200), `--semantic-color-border-default` → neutral-500 (was neutral-300).
- Overrode button secondary border to accent-700 and tertiary border to neutral-400 so component-level hardcoded tokens also update.
- Increased all 1px component border widths by 1px (card, field, menu, segmented, dialog, data-table, message-badge, message-banner, pagination, tabs, side-nav, top-header, button secondary/tertiary).
- Added `.a1-theme-accessible.a1-theme-dark` rule to `color-scheme.css` (specificity 0,2,0) setting two-steps-lighter borders in dark mode: neutral-500 (subtle) and neutral-400 (default).
- Rebuilt `packages/react/src/themes.css`.

### Prompt: Increase Catlympics button border weight to 3px

- Added `--component-button-secondary-border-width: 3px` and `--component-button-tertiary-border-width: 3px` to `system/themes/catlympics/theme.json`.
- Rebuilt `packages/react/src/themes.css` via `npm run build:themes`.

### Prompt: Set Catlympics theme fonts

- Created `system/themes/catlympics/tokens/typography.json` with Baloo 2 (display), Patrick Hand SC (headings), and Nunito Sans (body).
- Set heading font weight to 400 (Patrick Hand SC is single-weight) and display to 700 (Baloo 2 variable).
- Ran `npm run build:tokens` to generate `--theme-a1-catlympics-font-family-*` and `--theme-a1-catlympics-font-weight-*` tokens in `build/css/tokens.css`.
- Added Baloo 2, Nunito Sans, and Patrick Hand SC to the Google Fonts link in `apps/a1-web/index.html`.

### Prompt: Add Catlympics theme to settings menu

- Added `{ value: 'catlympics', label: 'Catlympics' }` to `themeOptions` in `main.jsx`.
- Added `.a1-theme-catlympics` class toggle to the theme `useEffect`.
- The theme CSS was already compiled into `packages/react/src/themes.css` via the existing theme build.

### Prompt: Replace theme SegmentedControl with compact RadioGroup

- Replaced the `SegmentedControl` in the settings menu Theme section with a `RadioGroup` at `size="compact"`.
- Added `RadioGroup` to the `main.jsx` import list.

### Prompt: Fix light mode override when OS prefers dark

- Added `a1-theme-light` class toggle to the theme `useEffect` in `main.jsx`.
- When `colorMode === 'light'`, `.a1-theme-light` is applied to `<html>`, which overrides `@media (prefers-color-scheme: dark)` via higher CSS specificity.
- `colorMode === 'system'` continues to follow the OS media query with no class applied.
- The `.a1-theme-light` CSS block with all light token overrides was already present in `color-scheme.css`; only the JS toggle was missing.

### Prompt: Fix settings menu not showing content

- Diagnosed that `TopHeader`'s `ActionMenu` always rendered its own empty `<Menu>` and wired `onClick={onToggle}` on the icon button, so `action.onClick` was never called and the app-level settings Menu never opened.
- Fixed `ActionMenu` so actions with no `items` call `action.onClick` directly and render no dropdown `<Menu>`.
- Actions with items continue to work as before (toggle a dropdown Menu with their item list).
- Removed `aria-expanded` and `aria-haspopup="menu"` from icon buttons that do not control a menu.

### Prompt: Move theme and color mode controls to the settings menu

- Removed inline theme and color mode `SegmentedControl` blocks from the Color foundation page header.
- Removed `onThemeChange` and `onColorModeChange` props from `ColorFoundationPage` and `FoundationDetail`.
- Updated the Color page description to direct users to the settings menu for theme and mode switching.
- Theme and color mode selections are persisted to `localStorage` via the global settings menu; the Color page now reflects those values automatically through its existing `useResolvedColorRows` hook dependency on `theme` and `colorMode`.

### Prompt: Refactor card icon wrappers to use Card `icon` prop

- Removed custom `.a1-web-feature-card__icon`, `.a1-web-category-card__icon`, and `.a1-web-platform-card__icon` CSS classes from `styles.css`.
- Replaced all three custom icon span wrappers in `Home.jsx` with the built-in `icon` prop on `Card`.
- Removed unused `Icon` import from `Home.jsx`.
- Updated `ai/components.md` to document Card's `icon` and `heroIcon` props and the rule against recreating the icon block with custom CSS.

### Prompt: Audit and clean up `styles.css`

- Removed dead CSS classes `.a1-web-hero__subtext` and `.a1-web-stat__value` (defined but never referenced in JSX).
- Added missing definition for `.a1-web-section-body` (used in nine files as a section subtitle width constraint but had no CSS rule — was a silent no-op).
- Simplified `.a1-web-stat` from five layout properties to one (`padding-block`) by replacing the `<div>` with `<Stack direction="column" gap={4} align="center">` in `Home.jsx`.
- Removed redundant `border` declaration from `.a1-web-category-card` (identical to the Card component's default border).

### Prompt: Persist color mode and theme to localStorage

- Initialised `theme` and `colorMode` state from `localStorage` on load, with validation against the known valid option values so corrupt stored data falls back to defaults.
- Added `useEffect` syncs that write `a1-web-theme` and `a1-web-color-mode` to `localStorage` whenever either value changes.
- Theme and color mode selections now survive page refresh.

### Prompt: Build Color foundation page

- Replaced the Color foundation placeholder with a real token browser page.
- Added page-level controls for theme and color mode, including light, dark, and system mode.
- Added tabs for primitive, semantic, and component color tokens.
- Rendered each primitive color ramp in its own Section with token-applied swatches.
- Added semantic and component color token DataTables with live resolved CSS variable values.

### Prompt: Fix header resize drawer and add navigation Card variant

- Updated TopHeader so the mobile drawer closes automatically when the viewport is resized back to the desktop header layout.
- Added `Card` `variant="navigation"` for whole-card navigation with semantic anchor/button rendering.
- Added token-backed navigation Card hover, active, and focus states with accent border treatment.
- Added system rules that prohibit nested interactive elements inside interactive Cards.
- Updated Features and Foundations navigation cards to use the new Card variant.

### Prompt: Refactor TopHeader routed submenu behavior

- Refactored TopHeader so routed top-level nav items can link directly and expose a separate submenu trigger.
- Kept unrouted submenu parents as a single submenu button.
- Updated mobile submenu behavior so routed parents remain reachable from the drawer.
- Updated the TopHeader story data to show a routed parent with child submenu items.

### Prompt: Ensure Storybook and the a1-web app are running

- Verified the a1-web app was available locally at `http://127.0.0.1:5194/`.
- Verified Storybook was available locally at `http://127.0.0.1:6006/`.

### Prompt: Fix Storybook error for Heading `textWrap`

- Added missing `textWraps` and `aligns` option lists to `Heading` and `Paragraph` so the new props no longer throw a runtime `ReferenceError`.
- Added `textWrap="balance"` support to Heading and Paragraph.
- Added `align="left" | "center" | "right"` support to Heading and Paragraph.
- Added matching CSS classes for text wrapping and alignment.
- Updated Storybook coverage for the new typography props.

### Prompt: Evaluate Section `alignment="center"`

- Updated Section alignment so it controls both text alignment and grid item placement.
- Added Section alignment support for responsive object syntax such as `alignment={{ xs: "center", lg: "left" }}`.
- Ensured aligned Sections still behave correctly when `contentWidth` moves layout/gap handling onto the inner wrapper.
- Added Storybook coverage for Section alignment behavior.

### Prompt: Section inverse not working on the a1-web homepage hero

- Fixed inverse Sections with gradients by giving `.a1-section.a1-inverse` a default Section surface token.
- Preserved explicit `surface="page" | "panel" | "raised"` overrides.
- This allows homepage markup like `inverse gradient="accent"` to render as an inverse band without requiring a custom surface style.

### Prompt: Buttons inside `ButtonContainer` are cut off when Section `contentWidth` is set

- Updated `ButtonContainer` to own the available inline width with `inline-size: 100%`, `max-inline-size: 100%`, and `min-inline-size: 0`.
- This prevents centered Section grid alignment from shrinking the ButtonContainer and starving its container query.

### Prompt: Make the hero paragraph size adjust by breakpoint

- Updated the homepage hero paragraph to use responsive Paragraph sizing: `size={{ xs: "md", md: "lg", lg: "xl" }}`.
- Kept the existing muted color and centered alignment.

### Prompt: ButtonContainer `size="lg"` should pass size to buttons instead of overriding CSS

- Refactored `ButtonContainer` so `size` becomes a default prop passed to direct `Button` children.
- Child buttons with an explicit `size` prop keep their own size.
- Removed ButtonContainer CSS variable overrides for child button sizing.
- Updated TypeScript docs to describe `size` as a default child Button size.

### Prompt: Large ButtonContainer makes button icons gigantic

- Fixed large button icon styling by using the standard button icon size token for large buttons.
- Kept large button height, typography, radius, and padding behavior intact.

### Prompt: Audit homepage heading hierarchy

- Reviewed every `Heading` on the a1-web homepage for semantic outline order.
- Confirmed the page uses one `h1`, section titles use `h2`, and card titles use `h3`.
- Kept non-structural visual text as `as="p"` for stats and `as="span"` for button-card category labels.
- Removed a duplicate `contentWidth` prop from the stats Section while reviewing the markup.

### Prompt: Prevent Section center alignment from cascading into nested content

- Changed Section `alignment` to align direct children as layout items instead of setting inherited `text-align`.
- Removed Section-level text alignment variables from the Section and inner wrapper.
- Made Section alignment work independently of `gap`, including when `contentWidth` inserts an inner wrapper.
- Updated Section stories and TypeScript docs to describe layout alignment behavior.
- Added explicit Heading and Paragraph alignment props on homepage sections that should still display centered text.

### Prompt: Build out the Features page

- Replaced the placeholder Features page with a full overview of A1 design system capabilities.
- Split content into top-level system features and grouped minor features.
- Added feature stats, token-driven feature cards, and detailed grouped lists for foundations, components, platform coverage, and workflow.

### Prompt: Remove custom styling from the Features page

- Removed custom feature-page CSS from `apps/a1-web/src/styles.css`.
- Reworked the Features page to rely on design system components and props instead of custom presentation classes.
- Replaced custom icon wrappers and stat blocks with built-in `Card` and `Card icon` patterns.

### Prompt: Create the Get Started page

- Replaced the Get Started placeholder with package-specific setup documentation.
- Added tabs for React, React Native, and pure HTML/CSS package setup.
- Added manual installation directions for each package.
- Added AI prompt guidance that names the package-specific markdown context files to read before coding.
- Added examples of good code for each package using system components, semantic markup, and package conventions.

### Prompt: Move Get Started tabs to the top

- Moved package tabs to the top of the Get Started package section.
- Switched Get Started package tabs to the Tabs component `folder` variant.
- Updated Tabs TypeScript declarations to include the existing `folder` variant.

### Prompt: Wrap Get Started AI prompt snippets

- Updated the Get Started AI prompt code snippets to wrap long prompt text.
- Kept regular code examples unwrapped for code readability.

### Prompt: Fix folder tab selected curves

- Updated the React Tabs folder variant so selected tabs render visible curved border shoulders.
- Replaced fill-only folder-tab pseudo-elements with token-backed bordered corner shapes.
- Preserved the smaller curve radius for level-2 folder tabs.

### Prompt: Add Features tech stack section

- Added a Tech Stack section to the Features page.
- Included core build tools, web platform, native platform, and quality automation groups.
- Used existing design system primitives without adding custom styles.

### Prompt: Add Features built-with section

- Added a Built With section to the Features page.
- Included Codex, Claude Code, VS Code, and Figma as tool cards.
- Used existing design system primitives without adding custom styles.

### Prompt: Build functional Foundations page

- Replaced the Foundations placeholder with an index of core foundation cards.
- Added foundation entries for color, size, type scale, shape, motion, elevation, iconography, and accessibility.
- Added placeholder child pages for each foundation.
- Added Foundations submenu links in the top header.
- Updated TopHeader link handling so submenu and nav links can use app-level navigation handlers.
