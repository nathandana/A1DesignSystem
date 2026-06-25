# A1 Web Changelog

## Unreleased

- **Main menu — purpose-based navigation groups** (A1-256) — replaced the catch-all Resources menu with a focused, alphabetized Explore group containing About, Accessibility, Features, Get started, and Releases, and renamed the authoring group Editors. Help and the dev-only Virtual team are now icon-only header actions; Backlog remains on its existing notification action instead of being duplicated in a menu. Foundations now uses nested Visualize, Visual, Content, Layout, and Standards categories like Components; category labels expand directly to their pages and do not add redundant overview routes. Foundations, Components, Editors, and Explore are the four focused navigation groups. Updated the Virtual Information Architect's main-menu model and Help copy so the live navigation and IA audit stay aligned.
- **Virtual team — standalone page** (A1-334) — moved the dev-only Virtual Team out of the Backlog view and into `/virtual-team`, reached from an icon-only top-header action. The page presents the Product Owner, Information Architect, and Designer in a responsive grid with their existing preview, review, re-run, status-check, and ticket-filing actions. Backlog now contains ticket views and filters only.
- **Backlog — Epic ticket type** (A1-164) — replaced Chore with Epic throughout ticket creation, editing, filtering, badges, search, help, localized labels, and Supabase validation. Legacy chore records normalize to Feature locally and are migrated to Feature by the database schema before the new `bug / feature / epic` constraint is applied; existing cloud workspaces can apply the dedicated `supabase/migrations/20260625_a1_164_ticket_types.sql` migration. Epic uses a distinct warning-tone badge and account-tree icon, and generated development plans emphasize slicing the outcome into linked, independently valuable work. The Virtual Product Owner policy now promotes non-bug L/XL tickets to Epic, previews and reports those type changes, records them in ticket activity, preserves explicit large estimates, and deliberately re-reviews existing open tickets once under the new policy. Cloud update failures now surface in the app instead of silently reverting the control.
- **Foundations — simplified color tiers** — removed the redundant Brand tab from Color and the Brand A1 node from System map after the token audit confirmed `brand.a1.*` had no runtime or package consumers. The documented token architecture is now the actual three-tier model: base, semantic, and component.
- **Foundations — System map structured theme flow** — updated `/foundations/system-map` for the remediated architecture. Canonical tokens flow through Style Dictionary separately from typed theme overrides and selector metadata; the shared validator and mode contract feed React, Pure CSS, and React Native generation; generated light/dark/system-preference/inverse selectors are shown separately from static reset and exceptional CSS. Inverse islands now show their explicit scope contract and opposite-document-mode behavior.
- **Foundations — System map color architecture audit** — expanded `/foundations/system-map` during the initial color-system audit to expose the old parallel token, theme, mode, and runtime paths. The later remediation entries above describe the simplified final graph.
- **Foundations — Color visualization** — added a data-driven OKLCH token viewer at `/foundations/color-visualization`. The lazy-loaded React Three Fiber scene plots the active theme's live primitive color values by lightness, chroma, and hue, and recomputes its paths, diagnostics, gamut state, and step alignment whenever the site theme or color mode changes. A component-configurator-style right rail uses A1 Toolbars to select ramps/tokens and toggle paths, guides, labels, the sampled sRGB boundary, and explained wireframe out-of-gamut warnings; ramp selection uses a four-column swatch-only Toolbar Group, token steps use a six-column swatch-only Toolbar Group, and Step alignment uses a keyboard-navigable Tree Menu. A numeric gamut tolerance prevents valid hex tokens from being obscured by false warning shells. Separate Ramp inspector and Step alignment views expose hue drift, lightness range, maximum chroma, uneven neighboring steps, and cross-ramp lightness consistency.
- **Default page background → neutral-25** — added a new `neutral.25` step (`#f7fafe`, the midpoint between `neutral.0` white and `neutral.50`) to the colour ramp, and pointed `semantic.color.surface.page` at it. The default themes (base `:root` and a1-light) now sit on a barely-tinted off-white instead of pure white, so white cards/fields read as raised surfaces. Branded themes (aperture, fresh, crochet, heritage, marshmallow, catlympics) keep their own explicit page backgrounds. Token only — rebuilt `build/`, `packages/pure/dist`, `packages/react`, and the React Native generated tokens.
- **Virtual reviewers — decline a finding** (A1-177) — Virtual Designer **and** Virtual Information Architect findings can now be **declined** as well as filed. Declining opens a small dialog with an optional comment ("why"), and the decision is remembered (per reviewer, in `localStorage`, keyed by the finding's signature) so a re-run never re-surfaces it and "File all" skips it. Declined findings show their note with an **Undo**. Shared `services/review/declineStore.ts` + `backlog/useFindingDecisions.jsx` hook/dialog, used by both panels.
- **Backlog — Virtual Designer** (A1-177) — a new dev-only reviewer on the Backlog **Team** tab, alongside the Virtual Product Owner and Virtual Information Architect. It reviews the design system with a senior product designer's eye and **files refinement tickets** (it doesn't do the work). Like the architect, it's a local, deterministic, read-only auditor (no API credits): `auditDesign(readDesignModel())` runs design-craft heuristics over the live token scales (radius, spacing, heading/body type ramps) read from the active theme via `getComputedStyle`. First-slice heuristics: scale **ordering** (monotonic), **redundancy** (duplicate steps), **rhythm** (a step that jumps far more than its neighbours), **heading vs body distinction** (a heading sized the same as body text), and **praise** for scales that are dialled in. Findings are grouped by lens and severity; each can be filed as a ticket (scope `foundation`), with persistent de-duplication (the finding's ref is embedded in the ticket description, so it's never logged twice) and a History tab. New `apps/a1-web/src/services/designer/` (types · model · heuristics · engine · barrel) + `apps/a1-web/src/backlog/VirtualDesignerPanel.jsx`; mounted in `pages/Backlog.jsx` behind `import.meta.env.DEV`.

## 0.14.0 — 2026-06-24

- **Foundations — System map** — new Foundations page (Visualize group) at `/foundations/system-map` that visualizes how A1 fits together end to end on a `Canvas`: design tokens (base → semantic → component) as the root, themes / icons / labels / rules feeding the component library, and components composing into pages, patterns, and projects. Nodes are colour-coded by layer, draggable, and click-to-trace; solid edges mean "builds into", dashed mean "contributes to / maps".
- **Projects — node view** — the project home gains a List / Nodes toggle. Nodes mode renders every page on a `Canvas`: page hierarchy as dashed edges and the author's inter-page links (Button/Link/Card `href`s into other project pages) as solid arrows. Nodes are level-coloured and draggable; click traces connections, right-click → "Open page". Clicking a node does not navigate (so you can trace freely).
- **Color foundation — component token node graph** — the Component tab gains a Table / Nodes toggle that draws each component colour token's chain to its semantic and primitive sources on a `Canvas`, matched by resolved value, with hover tooltips (full token name + value) and click-to-trace.
- **Canvas / Node — enhancements** (A1-312) — the canvas is now a compositional API (`<Node>` + `<NodeConnector>` children; `NodeConnector` renamed from `CanvasEdge`). New: `draggableNodes` (drag nodes without entering edit mode), Node `title` (native hover tooltip) and custom `backgroundColor`/`foregroundColor`, directional `traceConnections` (a selected node highlights only its ancestors and descendants, not sibling branches), visible grid lines with selectable `gridSpacing` (1 / 4 / 8 / 16 px), and multi-line node labels that grow with node size. Node `size` is now a slider in the configurator (xs removed from the UI). Configurators added at `/components/node` and `/components/canvas`.
- **Button — default renders semibold** — the default (md) button now renders at semibold (600) to match the Figma spec; previously the `.a1-button--md` weight rule was never applied so it fell back to medium (500). Fixed at the token level (`component.button.font.weight`).
- **Canvas + CanvasNode components** (A1-312) — new `Canvas` and `CanvasNode` React components for rendering infinite pan/zoom node graphs. `Canvas` accepts `nodes` (id, x, y, label, shape, color, subtle) and `edges` (id, from, to, direction, variant, weight, label) data props and renders on an infinite scrollable/zoomable canvas. Node shapes: circle, square, squircle, rectangle. Colors: neutral / info / success / warn / error / accent, with `subtle` surface-tint mode. Edges support `to / from / both / none` arrow directions, `solid / dashed / dotted` line styles, and `normal / heavy` weights. Canvas features: dot-grid overlay, wheel zoom toward cursor, space+drag or middle-click pan, `mode="edit"` for node dragging, and a floating controls toolbar (zoom in/out/fit-all/reset). a1-web configurator at `/components/canvas` with live preview, all node/edge options, and code snippet. Component token `--component-canvas-node-size` added. Status: experimental.
- **Snackbar — Native / Pure / Web codebase targets** (A1-309) — the Snackbar configurator now has four **View as** targets (React · Native · Pure · Web). Selecting **Native** emits a React Native `<Snackbar>` snippet using `visible`, `message`, `actionLabel`, `onAction`, and `onDismiss`. Selecting **Pure** emits a plain-HTML snippet using the new `a1-snackbar` / `a1-snackbar--default` / `a1-snackbar--{position}` / `a1-snackbar__content` / `a1-snackbar__action` / `a1-snackbar__close` BEM classes (now in `packages/pure/dist/a1-base.css`). Selecting **Web** emits an `import '@gtivr4/a1-design-system-web/snackbar'` snippet with the `<a1-snackbar>` custom element and event listeners. The new `<a1-snackbar>` Lit element in `packages/web-components/` mirrors the React Snackbar's visual design: dark surface (`--base-color-neutral-900`), all six position variants, optional action button, and a dismiss close button; `open`, `position`, `action-label`, and `dismissible` reflect as HTML attributes; dispatches `a1-action` and `a1-close` custom events (bubbles, composed). Snackbar Pure coverage updated in `packages/react/ai/components.md`.
- **Codebase output — Web Components target + `<a1-button>` proof-of-concept** (A1-87) — the Button configurator now has a fourth **Web** codebase target alongside React / Native / Pure. Selecting it emits an `import` statement for the new `@gtivr4/a1-design-system-web/button` package and an `<a1-button>` custom-element tag with all currently configured attributes. The new `packages/web-components/` package (Lit 3, ESM, `peerDependency`) contains the `<a1-button>` Lit element: it mirrors `button.css` exactly — same `--a1-button-*` CSS variable layer, all five variants, three sizes, `icon` / `icon-position`, `full-width`, `loading`, `disabled`, and `href` (renders as `<a>` with `aria-disabled`). CSS custom properties pierce shadow DOM so all `--component-button-*` and `--semantic-*` tokens resolve from the host page's token CSS; Material Symbols Outlined font also resolves from the host.
- **Backlog — ticket detail page** (A1-144) — each backlog ticket now has a dedicated, linkable page at `/backlog/A1-{n}`. The page shows all ticket content in a single scrolling view (no tabs): a header with breadcrumb, status/type/priority/size/scope badges, and the ticket title; a Details section with inline-editable title and description, type/status/priority+size toolbars, scope select, metadata definition list (assignee, votes, requested by, dates, review tags), and attachments; an Activity section with the full thread and a comment composer; and a Linked tickets section. The ticket number in the All Tickets table is now a link to this page, and the dialog footer adds a plain "View as page" link. The board context menu gains a "View ticket page" item. Direct URL navigation (`/backlog/A1-144`) resolves correctly via the SPA router, and Ctrl/Cmd-click opens the ticket page in a new tab.
- **Virtual PO — Check status button** (A1-303) — added a dedicated "Check status" secondary button to the Virtual PO card in the Virtual Team dev panel. Clicking it runs a status-only cleanup (no priority/size/question changes) — it scans all open tickets against the CHANGELOG, finds any that have shipped but haven't been moved forward yet, and shows a preview dialog listing them with their current → target status. Applying writes the status changes and attributes a comment to the Virtual PO. Uses the new `runStatusCleanup` function (split from `runPersona`) and exposed via `BacklogContext.cleanupStatus`. The preview dialog title and apply-button copy adapt to distinguish the cleanup run from a full review.
- **Path-based routing** (A1-55) — all a1-web URLs migrated from `?page=X` query params to proper path-based URLs. Foundations live at `/foundations/{name}` (e.g. `/foundations/color`), component categories at `/components/{category}` (e.g. `/components/layout`), component pages at `/components/{name}` (e.g. `/components/button`), and standalone pages at `/{name}` (e.g. `/editor`, `/patterns`). Old `?page=` bookmarks are automatically canonicalized to the new format on first load. The Netlify catch-all redirect (`/* → /index.html`) was already in place. Editor, theme, and prototype sub-state (project, doc, pattern, theme, cat) remain as query params on the new paths. Auto-generated breadcrumbs: all 13 foundation pages and the component detail page now derive their breadcrumbs from a shared utility (`getFoundationBreadcrumbItems` / `getBreadcrumbItems`) so they can't drift from the router. Component routes now include the full parent chain — Home / Components / Layout / Section — matching the actual URL path hierarchy.
- **Virtual Architect — Re-run button** (A1-298) — the Virtual Architect panel now has a "Re-run" button in both the launcher card and the report dialog footer. Clicking it recomputes the full IA audit against the current live menu state without a page reload. A "Last run at HH:MM:SS" timestamp appears below the finding badges after the first re-run so it's clear when the report was last refreshed. (Dev-only panel; no user-visible change in production.)
- **Color foundation — Brand token tab** (A1-98) — added a fourth "Brand" tab to the Color Foundations page showing the 33 `brand.a1.*` color tokens (`--brand-a1-color-*` and `--brand-a1-button-*` CSS custom properties) that were previously absent from the page. These brand-identity and button-alias tokens are now browsable with group filter, token search, live swatch, and current-value columns matching the other three tabs.
- **Card — status stripe pulse now respects reduced motion** (A1-221) — the `statusPulse` animation is now opt-in via `@media (prefers-reduced-motion: no-preference)` instead of opt-out via `@media (prefers-reduced-motion: reduce)`. This means it defaults to static (no animation) for users who haven't set a system preference, not just those who have explicitly enabled reduce. Also fixes the Storybook `.a1-reduce-motion` class: that class only collapsed semantic duration tokens, not keyframe animations, so the pulse was still running during testing; an explicit `html.a1-reduce-motion .a1-card--status-pulse::before { animation: none }` now covers it.
- **Main menu — Foundations grouped into Visual / Content / Layout / Standards** (A1-238) — the Foundations submenu now splits its 13 pages into four labeled sections (Visual, Content, Layout, Standards), each sorted A-Z. `TopHeader`'s `splitIntoSections` helper now captures an optional `label` from `{ divider: true, label }` items and forwards it to `MenuSection`, so any nav tree can use labeled sections with no new API. `mainMenu.ts` (Virtual IA) mirrors the 4-group structure.
- **Editor — Card status stripe now configurable** (A1-229) — selecting a Card node in the page editor now exposes the `status`, `statusLabel`, `statusPulse`, `heroBadge`, `heroBadgeStatus`, and `heroBadgePosition` props in the Configure panel. Previously the `propsToConfig` and `configToNodeUpdate` bridges for Card omitted these, so changes made via the status-stripe and hero-badge controls were silently dropped when written back to the node.
- **Backlog — delete tickets and cancelled status** (A1-272) — tickets can now be permanently deleted with a confirmation dialog, and a new "Cancelled" terminal status is available as an alternative to "Won't fix". Delete is accessible from the ticket dialog footer (destructive button with confirmation) and the board right-click context menu. The cancelled status appears in the overflow status menu in the ticket dialog, as a toggleable swimlane on the board (off by default like other terminal statuses), and in the "More statuses" ToolbarMenu. Permanent deletes trigger a toast notification and remove the ticket from the backlog immediately. The schema check constraint, local-sync CLI, and open-ticket counts are all updated to include the new status.

## 0.13.0 — 2026-06-23

- **Editor history — throttled prop commits** (A1-273) — changing a slider (or any prop in the configurator) no longer creates a history entry on every drag tick. The canvas updates live as before, but history records at most one entry per 10 seconds using a leading + trailing throttle, so the first and final values of a burst are both captured. Any hard action (delete, move, add) commits immediately and cancels any pending throttled entry. History entry labels for prop edits changed from "Updated X properties" to "Edited X" to reduce visual noise in the history panel.
- **Button small size fix** (A1-274) — `size="sm"` buttons were rendering at ~37px instead of 28px after the label-wrapping change (which removed the fixed `height` rule). The default 10px `padding-block` was winning over the 28px `min-height`. Fixed via a new `component.button.small.paddingBlock` token (4px) applied in `.a1-button--sm`.
- **Build with AI — description now included in the generated plan** (A1-293) — the deterministic fallback planner (`developPlanLocally`) was generating plans from type/priority/scope metadata alone, silently omitting the ticket's description. The description is now included in the Objective section of every plan so the content of the ticket is always front and center.
- **Bottom Sheet — responsive preview and dark mode fix** (A1-279) — the Bottom Sheet configurator preview now works correctly when a device viewport is selected. In the responsive-preview iframe the sheet uses its native `position: fixed` and pins naturally to the device viewport bottom (xs/sm sizes only, matching the component's real behavior). In the default "Fit" view the existing bounded container is retained so the sheet doesn't escape to the browser-window bottom. The Section wrapper (the "funky container") has been removed by marking the component `bareDisplay`, hiding the unused padding and inverse controls. Dark mode is also fixed: `--component-bottom-sheet-background` is now overridden in every dark context (`.a1-inverse`, system dark, `.a1-theme-dark`) so the sheet surface adapts correctly instead of staying white.
- **Editor utilities — zero spacing values** — padding, margin, and gap utility controls now include `0` as an explicit reset value, distinct from **None** which removes the utility class.
- **Utilities foundation — category tabs** — the Utilities page now groups its documentation into tabs for spacing, gap, width, screen-reader only, and component support so each utility category is easier to scan without a long vertical page.
- **Component configurators — shared Utilities accordion** — every component detail Configure panel now gets the shared **Utilities** accordion when that component accepts tokenized utilities. The central panel stores selections on `config.utilities`, resolves the validated utility `className`, and passes it into the detail preview/snippet so utilities apply to the actual component root instead of a wrapper around it. Section uses the same central accordion placement as the rest of the catalog, avoiding the duplicate Utilities accordion while still applying utility classes to its real preview/snippet.
- **Utilities foundation — component support lookup** — the Utilities foundation page now includes a component-by-utility lookup table generated from the component catalog and editor utility registry, showing which components accept padding, margin, gap, and min/max width utility families.
- **Backlog board horizontal scroll strips** (A1-194) — the desktop backlog board now wraps its swimlane grid in a keyboard-focusable horizontal scroll strip. Swimlane `Section`s use `a1-min-w-xs`/`a1-max-w-xs` utility classes (backed by the new `--base-width-xs` token, 240px) and the grid tracks use the same token, so cards stay inside their lane boundaries while extra lanes scroll inside the board instead of causing page-level horizontal overflow.
- **Editor utilities — component-scoped width and spacing controls** — selected components now get a collapsed **Utilities** accordion in the Configure panel when they accept tokenized utility classes, with one labelled Toolbar per utility: common values are ordered first and less-common values collapse through the new `ToolbarGroup overflow` behavior. Toolbar overflow menus keep utility values in registry order. The Toolbar configurator exposes the same overflow toggle for group tools. The Section component configurator uses the same shared accordion, applying utilities to its preview and snippet; Section supports spacing/width utilities but not the gap utility. The Utilities foundation page now documents every registry family, including gap and full min/max width values (`3xs` and `2xs` included for min/max width). The new `editor/utilityRegistry.ts` is the source of truth for which component types accept which utility families (for example, `IconButton` rejects min/max width while `Button` can use them). Utilities are stored as `node.utilities`, rendered as validated `className` values, included in generated JSX, and pruned when a component is converted to a type that no longer accepts them.

## 0.12.0 — 2026-06-22

- **Data-driven collections — fill a component's items/options from a dataset** (A1-94) — a component's array prop can now be generated from data instead of typed by hand. Select the element → Configure → **Fill … from data** → pick a data source and a **mode**: **Each row** (one entry per row, mapping columns → fields), **Each field of the item** (a `DefinitionList` of `{label, value}` for every column of the current item — "show all details"), or **Distinct values of a column** (one entry per unique value — an auto-growing `ChoiceGroup` of categories). Supported targets: **DefinitionList** `items`, **ChoiceGroup** / **Select** / **Autocomplete** `options`; row/distinct modes add a column→field map plus limit + random. Distinct on the active item's row-context, so it composes with **repeat** (one filled component per row) and **detail pages** (fields of the current item). Stored as `node.collections[prop]` (a node field, so configurator edits don't clobber it); the renderer expands it in `pageRenderer`. New `src/data/collections.ts` (registry + `expandCollection`) and `src/editor/EditorCollectionControls.jsx`.
- **Detail pages — one template, one page per item** (A1-94) — a single page can show the details of any item in a dataset, addressed by the URL, instead of building a page per record. **Tag a page** to a dataset (Page settings → **Shows details for**) and every `{{ dataset.column }}` on it resolves to one item: the row whose hidden id matches the `?item=` URL value (live), or a **Preview item** you pick while designing (editor). A **list page** that repeats a card over the dataset links each card to the detail page automatically — the page-link selector now emits `?page=<detail>&item={{ dataset.__id }}`, which resolves per-card inside the repeat, so every item links to its own detail view. Built on the existing binding/row-context engine: stable hidden row ids (`__id`, [previous entry]), `PageMetadata.detailDataset` / `detailPreviewId`, an active-row resolved in `RenderPageDefinition` (new `itemId` prop), and `item` carried through prototype navigation (`EditorPreviewPage`, `pageRenderer` link clicks). Two pages → any number of items.
- **Repeat: limit + random selection** (A1-94) — the **Repeat for each row** control now also offers **Show at most** (cap how many rows render — blank = all) and **Pick rows at random** (a random selection instead of the first N). Random is **seeded by the element id**, so it's stable across re-renders (no reshuffle-on-every-edit) and differs per element. The node's `repeat` grew from a dataset-key string to `{ dataset, limit, random }` (the string form is still accepted); `src/data/repeat.ts` (`normalizeRepeat` + `pickRepeatIndices` over a deterministic mulberry32 PRNG) drives selection, returning original dataset indices so bindings still resolve to the right row.
- **"Crocheted animals" sample dataset** (A1-94) — a second built-in sample alongside Users: eight handmade amigurumi with **Name, Description, Hours spent making, Price, Customizable (boolean), and Image** (verified low-res Unsplash photos of crochet bunnies/bears/animals). Add it from the Data sources empty state ("Add sample: Crocheted animals"). Great for demoing a product grid with **repeat over rows** + a **Figure bound to the image field**.
- **Repeat an element over a data source — auto-build UI from a dataset** (A1-94) — any element can now **repeat once per row** of a dataset. Select it → Configure panel → **Data** → **Repeat for each row** → pick a data source; the element renders once per row, and the `{{ key.column }}` bindings inside each copy resolve to **that row** (so a single bound Card becomes one card per record). On the canvas the **first copy stays editable** (selecting/editing it edits the one template) and the rest render as read-only projections; Preview shows them all. An explicit row index in a token still wins (`{{ users.name.2 }}`). Stored as a new `repeat` field on the node (not a prop, so configurator edits don't clobber it; `ComponentNode.repeat` in `pageTypes.ts`). Renderer expands it in `pageRenderer.tsx` via a `rowContext` carried on `PageDataContext`; resolver gains row-context awareness (`data/bindings.ts`). Editor wiring mirrors node locking: `handleSetNodeRepeat` in `EditorPage` → `EditorAsidePanel` → `EditorPropsPanel` → the **Data** section's repeat menu (`EditorBindControls`).
- **Bind-to-data menu in the Configure panel** (A1-94) — select an element and the Configure panel now shows a **Bind to data** section listing that element's bindable fields — its **Text** plus free-text string props (`href`, `src`, `alt`, `caption`, `label`, …) — each with a **menu** of the project's data sources grouped by dataset, their fields as options. Picking one binds that field (sets it to a `{{ key.column }}` token); a **Clear** button unbinds. So you don't have to type tokens — point and pick. Only data sources available to the page's project (global or scoped to it) appear, and locked fields are omitted. New `src/editor/EditorBindControls.jsx`, wired into `EditorPropsPanel` (reuses each node's `configToNodeUpdate` as the base, overriding the chosen field). Enum props (variant/size/status) are intentionally excluded.
- **Data binding — pull dataset values into a page** (A1-94) — a component's text or a string prop can now bind to a dataset value with a `{{ dataset.column }}` token, resolved at render on the canvas and in preview. `datasetKey` is the dataset name slugified (e.g. "Users" → `users`); the default row is the first, and a trailing index targets another (`{{ users.name.2 }}`). A **whole-token** binding keeps its raw type (a number prop stays a number); an **embedded** token interpolates as a string (`Hi {{ users.name }}`); an **unresolved** token renders literally so a bad reference is visible. Bound text shows the resolved value on the canvas (read-only inline — edit the token in the Configure panel). The editor's aside gains a **Data** tab (`table_chart`) listing the project's datasets and their columns as **click-to-copy** `{{ key.column }}` tokens with a how-to. Resolution lives in `src/editor/pageRenderer.tsx` (a new `PageDataContext` built from the active project's datasets via `datasetAvailableToProject`); grammar + resolver in `src/data/bindings.ts`; panel in `src/editor/EditorDataPanel.jsx`. No page-definition schema change — bindings are ordinary string values. (Repeating a component/pattern over all rows is a later step.)
- **Data sources — datasets you can store, scope, edit, and import** (A1-94) — a new **Data sources** page (left nav, under the editor group; `?page=data`) for reusable datasets. Each dataset is a named table of **columns + rows** edited in a spreadsheet-style **DataGrid** (the new A1-themed react-data-grid; double-click a cell to edit, add/remove rows via checkbox selection, add/rename/retype/remove columns). Datasets are **scoped** like images/patterns: a "Limit to specific projects" switch + project multiselect — off = **global** (every project), on = restricted to the chosen projects (empty `projectIds` = global). A **JSON importer** ("Import JSON" / "Replace from JSON") turns a pasted array of objects into columns + rows (keys → columns, with type inference), or an array of values into a single column. Edits **autosave** (600ms debounce). Storage mirrors the backlog: a dedicated **Supabase `data_sources` table** when signed in + configured (shared workspace, RLS, Realtime + poll), else gzipped **localStorage** offline — `src/services/dataSources/` (`types` + `backend` + `localBackend` + `supabaseBackend` + store + `importJson`), `src/data/DataSourcesContext.jsx` + `DataSourcesView.jsx`, mounted in `main.jsx`. A built-in **"Users" sample** (fake people with contact details) is seeded once into an empty workspace and re-addable from the empty state. **Cloud setup:** run the new `data_sources` table DDL in `apps/a1-web/supabase/schema.sql` (Supabase SQL editor) before the page works while signed in; it degrades gracefully (warns, stays empty) until then. Built on the experimental design-system `DataGrid` (see the React changelog) — consumed via the package's `./components/*` subpath; not in the component configurator.

## 0.11.0 — 2026-06-22

- **Linked tickets** (A1-218) — you can now **link related tickets** to each other, separate from merging duplicates. In a ticket's **Linked tickets** tab, the similarity finder's suggestions gain a **Link** action (alongside Open and Merge), there's a **“Link or merge a ticket by ID”** field, and the right-click menu offers Link / Unlink. Linked tickets show at the top of the tab (newest first), each carrying a **“Linked” status stripe + badge** (the `Card` status treatment), its ref, title, type/status badges, an **Open** button, and an **Unlink** button — and once linked, a ticket **leaves the suggestions list** (it has moved up into the linked list). Links are **symmetric** (linking A to B shows on both) and stored per ticket. New `links: string[]` on the ticket model + `linkTickets` / `unlinkTickets` store actions (local + Supabase backends; a `links jsonb` column was added to `supabase/schema.sql` with a guarded `alter table … add column if not exists` for existing DBs) + `link` / `unlink` on the backlog context. Built from existing A1 components (`Card`, `IconButton`, `MessageBadge`, `ContextMenu`) — no design-system component changed. (Distinct from A1-161 merge; merging still closes a duplicate.)
- **Backlog views — a segmented control in the panel; one filter set for all views** — the top-level **Board / All tickets / My queue / Virtual team** tabs were replaced by a **`SegmentedControl` at the top of the right-hand panel** (icon segments, full-width, labelling only the selected view); the main area renders the active view directly. The panel's **Type / Priority / Size / Scope filters + search now drive every ticket view** — the board, the **All-tickets table** (its own DataTable column filters were removed in favour of the panel), and **My queue**. Sort stays board-only (the table sorts by column, the queue is grouped); the filters are hidden only on the dev-only Virtual team view. The search and the New ticket footer persist across all views. `src/pages/Backlog.jsx` — a shared `filteredItems` (search + filters) feeds the board, table, and queue; built from existing A1 components, no design-system component changed.
- **Backlog board — drag cards to restatus; swimlanes stay put** — on the desktop board you can now **drag a ticket card onto another swimlane to change its status** (the target lane highlights while you drag; dropping calls the same status update as the ticket dialog). And a swimlane that's **toggled on always shows**, even when it's empty or filtered down to nothing — the board no longer hides lanes based on item count, so columns stay in place as you filter or drag across them. Keyboard users keep the ticket dialog's status control as the accessible path. `src/pages/Backlog.jsx` (draggable `BoardCard`, droppable `BoardColumn`, `dragOverStatus` highlight) + a small `styles.css` rule; built from existing A1 components — no design-system component changed.
- **Backlog filters — moved into the app's right-hand panel, persist + clear all** (A1-154) — the backlog's **search, sort, filters, and New ticket all moved into the app's right-hand aside rail** — the same `PageLayout` aside slot the editor/theme/component configurators use (portaled into `#a1-web-backlog-aside-slot`), so it spans the whole page and **auto-moves into a “Filters” BottomSheet at xs/sm**. The panel holds (top→bottom): the pill `SearchField`, a **Filters** heading with the active count, **Sort** (an icon `ToolbarGroup` that labels only the selected option), **Type**, **Priority** and **Size** (full-width segmented groups), **Scope**, a **“Clear filters (n)”** action, and a sticky **New ticket** footer button. The page header is now just the title + description; the board area keeps only the swimlane view toggles + the board. Filters/sort/search **persist across reloads** (`localStorage` `a1-backlog-filters`) and Clear resets them all in one click. No new filter dimensions and no overlap with the My-queue tab. `src/pages/Backlog.jsx` (`DEFAULT_FILTERS` / `loadFilterState` / `countActiveFilters` + a persist effect + `createPortal` into the aside slot, reusing `.a1-web-config-aside__inner` / `.a1-web-config-panel__footer`) and `main.jsx` (the backlog aside slot + BottomSheet title); built from existing A1 components — no design-system component changed.
- **Smart search across the backlog** (A1-187) — the Backlog page gains a **search field** (above the Board / All tickets / My queue tabs) that ranks the whole backlog by relevance, not just a title substring. It searches the **A1-number, title, scope, type/status/priority labels, and description** (weighted in that order), so `navigation` surfaces the most on-point tickets first. It also understands: a **direct ticket reference** (`A1-187`, `a1187`, or a bare `187` jumps to that ticket), **multi-term AND** (`menu dropdown` needs both), and **field qualifiers** — `is:open` / `is:closed`, `type:bug`, `status:in progress`, `priority:p1`, `scope:component` — which combine with free text. The search applies to every tab (board lanes show matches in relevance order; the All-tickets table and My-queue narrow to matches) and shows a result count; it replaces the All-tickets table's old title/requester-only search. The search field sits in the **top-right of the page header** (a pill `SearchField` with an inline search icon + clear button), and **New ticket** moved to a small secondary button below the page description. Local + deterministic — no API/credits (built on the same tokenising approach as the duplicate finder). New `src/services/backlog/search.ts` (`smartSearchBacklog` / `searchBacklog` / `parseSearch`); wired into `src/pages/Backlog.jsx` using the new design-system `SearchField`.
- **AI tasks show time + token usage** — every AI action now reports how long it took and how many tokens it used, so the cost of each call is visible in the UI. API-backed tools (page editor chat, Create-with-AI project builder, image finder, image-prompt writer, icon finder, theme + font-pairing generator, rule generator, project image-style suggester) render a muted `1.4s · 1,234 in / 567 out tokens` line under each result, sourced from a shared `AiUsage` type + `formatUsage()` in `src/lib/aiImages.ts` (all AI lib functions now return `{ …, usage }` alongside their result). The **Virtual PO / Virtual Team** runs are 100% local heuristics with no API calls, so they show only elapsed time with a `(local — no API tokens)` note. No design-system component changed.
- **Slider detent ticks align with the handle** — picks up the design-system Slider fix so the configurator size/padding sliders (and any detent slider) show the tick dot centred in the handle, with the handle sitting inside the track. See the React changelog.
- **Build with AI — develops a real plan, locally** — the Backlog ticket dialog's dev-only **Build with AI** tab no longer just concatenates the ticket fields. It now sends the ticket (metadata, description, and the discussion/Q&A) to a **local LLM** — Ollama on your own machine, via a new `lib/localAi.ts` client — which writes a **staff-developer development plan** (objective, scale & approach, open questions, ordered steps, likely files, and acceptance criteria) that becomes the copy-pasteable direction. **No Anthropic API, no credits.** If no local model is reachable it falls back to a **deterministic planner** (`services/backlog/devPlan.ts`) that tailors the plan to the ticket's type and scope (bug vs. feature, component vs. app), surfaces any unanswered Virtual PO questions, and points at the likely files — so the tab always produces a real, editable plan and still demos with nothing installed. A "Show raw ticket details" toggle keeps the old plain-text view. Shows which local model wrote the plan + elapsed time (and local token counts) when used. Dev-only; built from existing A1 components — no design-system component changed.
- **Virtual Information Architect (dev only)** (A1-176) — a new local, deterministic "virtual team" member that audits **information architecture** against IA/UX heuristics — no API calls / model credits. It lives next to the Virtual PO in the dev-only **Virtual team** tab of the Backlog (`?page=backlog`, gated by `import.meta.env.DEV`).
  - **What it audits.** The first target is the app's **main menu** (the TopHeader navigation, modelled in `services/architect/mainMenu.ts` from the live `componentCategories` / `foundations` data so it never drifts). Thirteen heuristics, each tagged with a usability category (Findability, Hierarchy, Clarity, Consistency, Recognition, Scalability), check: a missing **Home** affordance, **ordering** (utility before primary destinations), top-level **count** (7±2), **group size** (flat lists > 10), **group cohesion** (a grab-bag group), **naming clarity** (vague labels like "Details"/"More"), **redundant** labels appearing in several sections, **scalability** (a branch already holding dozens of destinations), **label casing** (sentence-case law; acronyms exempt), label length, duplicate siblings, **depth** (≤ 3), and top-level **icon** consistency. On the real menu it flags exactly the expected issues — no Home item, "Resources" listed before primary destinations, add a `home` icon, "Get Started" is Title Case — plus edge cases, balanced with what the IA gets right.
  - **Runs in a dialog, advises only.** "Open report" launches a dialog with a **Findings** tab (each finding a status-striped `Card` with severity + category, detail, suggestion, and affected nodes) and a **History** tab. The architect is read-only — it reports and suggests, it never changes anything.
  - **Files findings as tickets, without repeating.** Any actionable finding can be filed as a backlog ticket ("File as ticket", or "File all"); the **History** tab lists everything it has filed. De-duplication is **persistent** — each filed ticket carries the finding's stable ref in its description, so a finding already on the backlog shows as "Filed as A1-n" and is skipped by "File all", even after a reload. The Virtual PO then prioritises and sizes these like any other ticket.
  - Built entirely from existing A1 components (`Dialog`, `Tabs` with `equalHeight`, `Card` status stripe, `MessageBadge`, `Banner`, `MessageEmptyState`). New `apps/a1-web/src/services/architect/` engine + `src/backlog/VirtualArchitectPanel.jsx`. **No design-system component changed.** Larger areas of the role (page-architecture review, flow/task analysis, object-model and project-intake evaluation, structural accessibility) are a documented roadmap for follow-up.
- **Rules page shows enforcement; a1-web source is gated** (A1-37) — the **Rules** page (Components → Rules) gains an **Enforced** column + filter showing which design rules are checked on code — **Lint** (eslint-plugin-a1), **Lint + CSS** (also the CSS gate), or **Docs** only — read from each rule's new YAML `enforcement` field. `apps/a1-web/src` is now part of the design-rule gate (`npm run lint`), so a1-web code is held to the same no-uppercase / tokens-only / nested-interactive / single-primary rules (error on app code, warn on stories). See the repo-level changelog + `packages/eslint-plugin-a1`.
- **Marshmallow theme tweaks** (A1-222) — primary button made subtler (light lavender fill + dark text, tighter radius, inner-structure shadow) so its 3D depth reads clearly; tuned raised/inset shadows + recessed wells across buttons, cards, dialogs, fields, switch & segmented controls; heading/display type switched to **Space Grotesk** (added to the app font link). Theme-token only — see the React changelog.
- **New theme — Marshmallow (soft pillowy pastel / subtle neumorphism)** — added to the theme switcher (Settings → Theme) and applied via the `.a1-theme-marshmallow` class. Dusty-lavender accent on warm marshmallow-cream surfaces with gentle raised/inset 3D depth on buttons (raised at rest → pressed-in when held) and a soft lift on cards, generous rounding, and rounded Varela Round + Nunito type (Varela Round added to the app font link). Defined as a design-system theme (`system/themes/marshmallow/`); see the React changelog for the token detail. `main.jsx` theme registration + `aiProjectStyle.ts` vibe entry.
- **Virtual team is a tab, not a banner section** (A1-210) — the dev-only Virtual Team panel (`VirtualTeamPanel`) moved from a bordered `Section` stacked **above** the whole Backlog into a fourth **tab** ("Virtual team", `groups` icon) alongside Board / All tickets / My queue, so it no longer pushes the board down for developers. Both the `Tab` and its `TabPanel` are `import.meta.env.DEV`-gated (never shipped). The panel dropped its now-redundant bordered-card wrapper and duplicate "Virtual team" heading — the tab supplies the title; the "Dev only" badge + intro remain. `src/pages/Backlog.jsx` + `src/backlog/VirtualTeamPanel.jsx`; no design-system change.
- **Backlog cards show status — side stripe + pulse** (A1-188) — board and "My queue" ticket cards carry the new A1 `Card` **status side stripe**, mapped by `STATUS_STRIPE_TONE` / `STATUS_STRIPE_PULSE` (`services/backlog/types.ts`): **New** → no stripe, **Triaged** → neutral, **Accepted** → info, **In progress** → info + **pulse**, **Done** → success + **pulse**, **Released** → success (terminal states unstriped). The pulse signals active work and respects `prefers-reduced-motion`; the status is always also shown as text (lane header / `StatusBadge`), per the new `card-status-not-color-only` rule. Built on the design-system `Card` `status` / `statusPulse` props (see the React changelog — `warn`/`success` stripe colours were lightened two ramp steps so they read as amber/green). The Card configurator (`?page=components` → Card) gains a **Status stripe** swatch picker, a **Status label** field, and a **Pulse (in progress)** toggle — each with switch-linked helper text — plus Properties rows.
- **Virtual PO — smarter, non-repeating questions + moves shipped tickets** (A1-209) — fixes the core complaint that the PO "asks a question, I answer, and then it just repeats the question," and makes its questions context-aware.
  - **No more repeats.** The runner (`src/services/backlog/personas/runPersona.ts`) now reads a ticket's thread before asking and **never re-asks a question it has already asked** — matched by a stable `key` on each question *or* by exact text (so legacy questions without keys are still de-duplicated). It asks **at most two** questions at a time, and **none** while a question is still awaiting your answer. Once you answer and the ticket changes, it asks the *next* unasked questions instead of looping.
  - **Smarter question bank.** The Product Owner (`personas/productOwner.ts`) now offers a **keyed, ordered bank** of questions chosen for the ticket rather than the same generic "what business value?" every time: scope-aware (component variants/a11y; token/theme ripple; "which surface does this actually touch?"), **backlog-aware** (when another open ticket targets the same component/scope it asks whether they're related / should ship together, citing the other `A1-<n>`), plus detail/users/slice/success/risk/acceptance prompts — gated so it only asks what's missing.
  - **Moves shipped tickets per the CHANGELOG.** A bulk Virtual PO run now reads this CHANGELOG (`personas/shipped.ts` → `shippedStatusByNumber`) and **moves any open ticket whose `A1-<n>` appears in it forward** — to **Released** under a versioned heading, or **Done** under Unreleased — instead of re-reviewing it, with a "appears in the CHANGELOG — moved to X" note. The dev-only Virtual Team panel shows the **moved** count in its preview and result.
  - Engine plumbing: `evaluate(item, { items })` now takes the backlog for context; `PersonaQuestion` carries a `key`; `PersonaChange`/`PersonaRunSummary` gain `status`/`statusFrom`/`moved`; `BacklogContext` passes the imported CHANGELOG + the item list through. All deterministic and **local — no API/credits**. Verified with a 16-case runner harness (no-repeat, awaiting-gate, sig-skip, text-dedup, changelog moves, dry-run).
- **Backlog — ticket dialog split into tabs** (A1-207) — the ticket detail dialog (`src/backlog/TicketDetail.jsx`) now organises its content across tabs instead of cramming everything onto Details/Activity. **Details** keeps the description, triage toolbars, metadata, and attachments. **Comments** is the former Activity thread (comment/Q&A + activity log), with a count badge of real messages. **Linked tickets** hosts the similarity finder + merge-duplicates panel (`TicketMergePanel`), which previously sat at the bottom of Details. Two **dev-only** tabs (gated by `import.meta.env.DEV`, so they never ship) surface the local tooling that used to live in a Details "dev-tools" area: **Build with AI** (a copy-pasteable ticket prompt, `TicketAiPrompt`) and **Virtual PO** (the per-ticket Virtual Team review, `TicketPersonaReview`). Each tab carries a Material Symbols icon; `equalHeight` is retained so switching tabs doesn't resize/recentre the dialog. Built from existing A1 `Tabs` — no design-system change. Help updated (Linked tickets tab; board article note).
- **Backlog — link & merge duplicate tickets** (A1-161) — tickets that are "similar or the same" can now be **joined into one**. A new **local similarity finder** (`src/services/backlog/similarity.ts` — TF-cosine over title/description weighted toward the title, plus scope/type bonuses; deterministic, **no API/credits**, like the Virtual Team) surfaces likely matches:
  - **In the ticket dialog** — a **Linked & similar tickets** section lists AI-suggested matches with a similarity score and the reasons (shared terms, same scope) plus a **Merge…** action. Merging lets you pick which ticket survives; the other is **closed as a duplicate** (`status='duplicate'`, `duplicate_of` → survivor) and its **comments, votes, and description move to the survivor** so nothing is lost. A **Merge another ticket by ID** field links a duplicate the finder didn't surface. A merged ticket shows a banner linking to its canonical; the survivor lists everything merged into it.
  - **When creating a ticket** — possible duplicates are flagged live as you type the title/description, nudging "already tracked? vote instead".
  - Store: `mergeTickets(duplicate, canonical)` + a `mergeItem(fromId, toId)` backend primitive (Supabase + local) that reassigns the thread and unions the votes; a context `merge(...)` action; activity notes on both tickets and a notification to the survivor's creator. Uses the **existing** `duplicate_of` column — no schema change for current DBs (a guarded `alter table … if not exists` note was added for the earliest ones). The local-sync CLI now exports each ticket's `duplicateOf` link (read-only) into `tickets.json` / `BACKLOG.md`. Help: new "Linking and merging duplicate tickets" article.
- **Virtual PO on individual tickets (dev only)** — the ticket dialog gained a dev-only "Review with Product Owner" button (in a "Virtual team" dev-tools area, alongside the Dev Agent). It evaluates *that* ticket — setting priority/size, asking the multiple-choice value question, and stamping the review tag — and **re-evaluates whenever the ticket has changed** since its last review (otherwise reports "nothing changed"). The dialog updates live. Shares the engine with the bulk Virtual Team panel via a new `runPersonaOnItem` / `reviewItem`.
- **Build with AI — copy-pasteable ticket prompt (dev only)** — the ticket dialog's "Build with AI" tab (`src/backlog/TicketAiPrompt.jsx`) assembles a complete prompt from the ticket — metadata, description, and the discussion (the PO's questions + your answers) — in an **editable code block** you copy into a coding-agent chat to implement it. No API calls, no local server, nothing autonomous. (Replaced the earlier Dev Agent that ran the Claude Agent SDK locally — removed the `@anthropic-ai/claude-agent-sdk` dep, `scripts/dev-agent-*.mjs`, and the `dev-agent` / `dev-agent:work` scripts; it kept hitting max-turns and the in-app log was lost to hot-reloads.)
- **Daily Supabase backups** — `.github/workflows/supabase-backup.yml` runs `pg_dump` every day (and on manual dispatch), uploading compressed custom-format dumps as a private 90-day artifact (and to S3 when those secrets are set). Driven by `scripts/backup-supabase.mjs` (single or multi-DB; also `npm run backup:supabase` locally). Set the `SUPABASE_DB_URL` repo secret to the Session-pooler connection string — see `backups/README.md` (incl. restore). Dump files are git-ignored (they contain user data).
- **Virtual team — Virtual Product Owner (dev only)** — a pluggable, **local-only** persona engine that reviews the backlog like a real team member, with **no API calls / model credits**. Each persona is its own module (`src/services/backlog/personas/`) implementing a pure `evaluate(ticket) → verdict`. The first is the **Product Owner**: it sets **priority** and **size** from impact/urgency signals (defect, user-facing, scope breadth, vote demand, low-urgency), and asks the clarifying questions a PO would when value or scope is unclear.
  - **Dev-only trigger**: a "Virtual team" panel on the Backlog page, gated behind `import.meta.env.DEV` (hidden in production). Each persona runs a **preview (dry run)** showing what it would change, then **Apply** writes the changes, attributed to the persona.
  - **Reviewed tag + re-evaluation**: every ticket carries a per-persona `reviews[personaId]` record (`{ at, sig }`) shown as a tag on the ticket. A ticket is **skipped** when its content signature is unchanged since the last review, and **re-reviewed** when the title/description/type/scope or votes change. Same mechanism for every future persona. (New `reviews jsonb` column on `backlog_items` — run the `alter table` in `supabase/schema.sql` for existing cloud DBs; the local/offline store needs nothing.)
  - **Answerable questions**: a persona question can carry **multiple-choice options** (stored on the comment `meta`); the ticket shows a **mini-form (A, B, C, … + Other)** the requester answers inline. The PO's headline "What business value does this deliver?" uses it. Answers link back to the question via `meta.answersCommentId` and clear the awaiting-answer flag.
  - Next: virtual scrum master, designer, leader, developer — add a module + register it; the runner, panel, tags, and Q&A are generic over personas.
- **Help screenshots across topics, desktop + mobile** (A1-105) — extends the screenshot POC: `scripts/help-screenshots.mjs` now captures each state at **both desktop and mobile** sizes (`<name>.png` / `<name>-mobile.png`) and covers the main surfaces — Projects list, the Editor menu / mobile nav, a project's Pages tree, the editor canvas + Configure panel, the Patterns page, the Image library, and the Backlog board. The Help `Shot` component renders the **device-appropriate** capture (a `useIsMobile` viewport hook), placed in order within each article across the Getting started, Projects, Pages & navigation, Selecting & editing, Patterns, Media & AI, Preview, and Backlog topics. Re-run `npm run help:screenshots` (against a running server) to refresh.

## 0.10.0 — 2026-06-21

- **Removed the Roadmap (md) page** — the read-only `?page=todo` view of `TODO.md` is gone now that the Backlog (`?page=backlog`) is the live ticket tracker. Dropped the route, its Resources-menu entry + icon, and `pages/TodoPage.jsx`; `TODO.md` itself stays as the agent-maintained backlog source. A stale `?page=todo` link degrades to the home page.
- **Help screenshots (proof of concept)** (A1-105) — a reusable Playwright script (`apps/a1-web/scripts/help-screenshots.mjs`, `npm run help:screenshots`) captures real UI states into `public/help/`, which Help articles render inline via the A1 `Figure` component (new `Shot` helper). Proven on the "Opening the editor" article with two auto-generated shots — the Projects list and the top-nav Editor menu. Re-run the script to refresh the images so the walkthrough never drifts from the live UI.
- **Help page — new topics + moved to Resources** — added a **Patterns** category (what patterns are vs Copy pattern, creating from a selection / scratch / duplicate, using & detaching instances, and locking/slots/scope), an **Accounts & the shared workspace** topic, an **AI icon finder** topic, and **previewing at different screen sizes**. Corrected the now-stale storage docs: "where your work is saved" and the image-library note now explain cloud sync when signed in (shared workspace, syncs across devices) vs local-only when signed out — the old "stored locally / isn't uploaded anywhere" claims were misleading. The Help entry also **moved from the Editor top-nav menu to Resources**.
- **Help page — PageNav in-page nav** (A1-106) — the Help page's category jump **buttons** were replaced with the `PageNav` component (sticky, with active-section tracking + a reading-progress bar) in a content + sidebar grid, matching the TODO/long-tab pattern. The nav reflects the visible categories, so it narrows with the search results.
- **Backlog board — Size filter** — the board filter toolbars gained a **Size** `ToolbarGroup` (All / XS / S / M / L / XL) beside Type and Priority, filtering tickets by complexity (the size shown on each card's `ComplexityBadge`).
- **Tabs no longer force a container/page wider (React fix)** — a `line` tab strip with more tabs than fit (e.g. the Releases version tabs) now scrolls **internally** with prev/next arrows instead of widening its container and forcing a horizontal page scroll; the selected tab is kept in view. See `packages/react` changelog. The Releases page benefits directly.
- **Markdown unwrapped (one line per item)** (A1-115) — `TODO.md` and both CHANGELOGs (`apps/a1-web`, `packages/react`) no longer hard-wrap lines for width; each list item / paragraph is a single line and editors soft-wrap. This also fixes the Releases page, where wrapped bullet tails previously rendered as detached paragraphs, and let the TodoPage renderer drop its continuation-line joining (`toLogicalLines` now just trims each line). A "one line per item" note was added to the TODO maintenance header.
- **Setup guides refresh** — the `?page=get-started` page now points at the current files and commands: AI context files moved from `system/ai/*` to `packages/react/ai/*`, the agent files use their real casing (`AGENTS.md` / `CLAUDE.md`), the repo-setup snippet builds generated assets with `npm run build:tokens && npm run build:html-css` and starts the app with `npm run dev:a1-web`, and the Pure code example uses real `a1-base.css` classes (`a1-display`/`a1-display-xl`, `a1-paragraph-lg`, `a1-paragraph-muted`).
- **About page** (A1-108) — a new `?page=about` (Resources menu): what A1 is, an "Explore" grid linking to Foundations / Components / Editor / Themes / Backlog / Accessibility, the system's guiding principles, and the app version. Built entirely from A1 components.
- **Backlog board polish** — the board is now pure A1 (zero-gap `Grid` of `Section` swimlanes with alternating surfaces + vertical dividers), each lane paginates, filters are toolbars, cards are navigation cards with a right-click context menu, and a Swimlanes toolbar shows/hides lanes (terminal statuses off by default). At xs/sm the board switches to a **tab per swimlane**.

- **Backlog — a lightweight, Supabase-backed ticket tracker** — a new `?page=backlog` replaces the read-only `TODO.md` view (kept as "Roadmap (md)") with a real, shared backlog:
  - **Create from anywhere** — a global "flag" button in the top header, plus pre-scoped buttons in the page editor toolbar, on every component page, and in the theme editor. Tickets carry a type (bug / feature / chore), a suggested priority (P0–P3) and complexity (XS–XL), a scope, and screenshot attachments (reusing the image library).
  - **Numbering, statuses, attribution** — each ticket gets a human ref `A1-<n>` and moves through `new → triaged → accepted → in_progress → done → released` (plus terminal `wont_fix` / `duplicate`), attributed to its requester. Shared across all signed-in users; works offline against a local fallback store.
  - **Board / All tickets / My queue** — a kanban board by status, a sortable/filterable table, and a per-user queue (created-by-me, assigned-to-me, awaiting-your-answer).
  - **Voting, Q&A threads, activity log, notifications** — upvote to signal demand; a maintainer can "ask the requester" a clarifying question that lands in their queue; status/priority/assignee changes write an activity log; the header bell shows an unread count.
  - **Local sync CLI** — `npm run backlog:pull` / `npm run backlog:push` round-trip tickets to `backlog/tickets.json` + `backlog/BACKLOG.md` so an agent or dev can triage and implement locally (needs `SUPABASE_SERVICE_ROLE_KEY`; see `backlog/README.md`).
  - DB: new `backlog_items` / `backlog_comments` / `backlog_votes` / `backlog_notifications` tables in `apps/a1-web/supabase/schema.sql` (run it in the Supabase SQL editor). Localized strings staged in `system/labels/backlog.json`; Help page gains a "Backlog & feedback" section.

## 0.9.0 — 2026-06-20

- **Editor — sticky footer scoped to the canvas** — `StickyActions` (`position: fixed`) was pinned to the viewport and overlapped the editor toolbar/aside; the canvas now uses layout containment (`.a1-web-canvas-scope`) so a fixed footer scopes to the page area instead. Portaled menus/popovers are unaffected (they live on `<body>`).
- **Card — badge in hero** — a Card with `iconDisplay="hero"` can carry a `heroBadge` (status + 3×3 placement); the configurator gains a badge label, status picker, and an alignment-grid picker.
- **TopHeader — selected parent icon colour** — when on a secondary page, the parent nav item's leading icon now matches the selected text colour (was a muted tint).
- **Code — collapsible polish** — copy + Show more/less sit inline on one row; the configurator disables **Collapsible** when **Editable** is on (mutually exclusive); fixed the collapse never engaging (the overflow check was self-cancelling).
- _Card hero image: parked — backed out of the configurator; see TODO (display needs work)._

## 0.8.2 — 2026-06-19

- **Collapsible Code — finish the wiring** — the Code configurator gains a **Collapsible** toggle + **Collapsed lines** field, and the editor's read-only **React snippet** view is now collapsible (`collapsedLines={24}`). Completes the collapsible-Code backlog item (the DS prop + project-JSON dialog shipped in 0.8.0).

## 0.8.1 — 2026-06-19

- **Home / Themes layout tweaks** — Home "Platforms" heading + body no longer force-centered; the Themes list "New theme" button is wrapped in a left-aligned `ButtonContainer`.

## 0.8.0 — 2026-06-19

- **AI features hidden by default (save API credits)** — every AI entry point is now gated behind `VITE_AI_ENABLED` (off unless exactly `"true"`): editor AI tab, Make/Create with AI, AI find/generate image, AI find icon, AI theme/rule, "Suggest with AI". `getApiKey()` returns null when off, so **no Anthropic call can fire** even if a control is reached. Set `VITE_AI_ENABLED=true` to re-enable.
- **Collapsible code blocks** — the project-JSON dialog uses the new Code `collapsible` prop, so a big bundle shows capped with a fade + Show more/less instead of a wall (copy still grabs the full text).
- **Grid — vertical stretch control** — the Grid configurator gains an **Align items** control (stretch / start / center / end) backed by the new Grid `alignItems` prop (equal-height items).
- **InlineEditable: text with marks/markdown is now editable** — a heading with marks or a paragraph with inline markdown renders to styled `<span>`s; previously that content skipped `InlineEditable` and couldn't be edited on the canvas. In the editor it now always falls back to an editable source field (rich rendering still applies in preview/prototype).

## 0.7.0 — 2026-06-19

- **Shared edit history with user attribution** — the editor History panel now shows a **shared, cloud-backed** history (Supabase `edit_history` table) attached to the object — **page and pattern** edits, each entry **tagged with the user** who made it, with restore + rename, visible to everyone (no longer local-only). **Theme** edits are also logged (debounced); a theme history viewer is a follow-up. Local keyboard undo/redo is unchanged. Requires running the updated `schema.sql` (`edit_history` table + RLS).

## 0.6.0 — 2026-06-19

- **Editor presence + safe re-hydrate** — a step toward live collaboration on the shared workspace. The editor header shows **who else is on the same page** (a Supabase Realtime presence channel per page id), and when a teammate's change to the open page arrives via cloud sync the editor **adopts it automatically — but only when you're not mid-edit** (no uncommitted change), so active work is never clobbered. (Full conflict-free co-editing is tracked separately as a CRDT/Yjs item.)

## 0.5.0 — 2026-06-19

- **Live cross-user sync (polling + faster page flush)** — the shared workspace now reliably propagates changes between users: cloudSync **polls** the shared row (~8s) as a fallback when Realtime isn't enabled on the table, authenticates the Realtime connection, and the editor now **flushes page edits to storage ~2.5s after a commit** (was only every 60s) so they push promptly.

- **Realtime shared sync + push fix** — the shared workspace now updates **live**: a Supabase realtime subscription on `shared_state` re-pulls the bundle whenever any client writes, so one user's new pattern/project/theme appears for others without a reload. Also fixed a bug where the debounced auto-push (and "Import local data") called a removed `saveUserProjects`, so envelope changes never reached the cloud — now `saveSharedData`. Requires `shared_state` in the `supabase_realtime` publication. (Images already propagated live via direct reads.)

- **Shared workspace (cloud scope)** — when signed in, projects, pages, patterns, themes, and images are now **one shared workspace** that every signed-in user reads and writes (was per-user). Supabase moves from per-user rows to a single `shared_state` bundle row + a globally-keyed `user_images` table + shared Storage policies (images stored under a flat `shared/<id>` path); RLS still requires sign-in. Last-write-wins across users. Migration in `apps/a1-web/supabase/schema.sql` (seeds the shared row from the most-recent per-user bundle, then drops `user_projects`).

- **Analytics (PostHog)** — optional product analytics, dormant unless `VITE_POSTHOG_KEY` is set (mirrors the downTracker app: `lib/posthog.js` + a gated `PostHogProvider` in `main.jsx`, 2025 defaults for history-based SPA `$pageview` capture, `person_profiles: 'identified_only'`). Signed-in users are **identified** (`posthog.identify(user.id, { email })`) and **reset** on sign-out, so analytics can be tracked per user.

- **Accounts + cloud sync (Supabase)** — optional, dormant unless `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` are set (the app still works fully on local storage without them). When configured: an **Account page** (sign-in, password reset, delete account) and per-user **cloud sync** of all editor data — **projects, patterns, and themes** sync as one envelope in a `user_projects` row, and **images** sync to a Supabase **Storage** bucket (`user_images` metadata). The Account page shows a **"Where your data is stored"** panel and an **Import local data** button that pushes everything in this browser up to the account. Schema in `apps/a1-web/supabase/schema.sql`.

- **Invite-only full-site gate** — when Supabase is configured the whole app is gated behind a sign-in screen; **public sign-up is disabled** (admin creates users in Supabase). The sign-in screen carries a required alpha/IP **agreement** checkbox.

- **Project overview — JSON view** — a **JSON** button on a project's overview shows the entire project as a round-trippable bundle (the same shape the importer accepts) in a `Code` block.

- **Paragraph configurator — weight control** — a **Weight** control (regular / medium / semibold / bold) backed by the new Paragraph `weight` prop.

- **DefinitionList configurator — value as a Link** — each item gains a "Value as link" toggle + URL field; the value renders as an A1 `Link` in the preview and snippet. (The DefinitionList component already accepts a node value — configurator-only.)

- **Editor — inlineEditable click no longer toggles the selection off** — clicking (or double-clicking) text inside an InlineEditable, field input, or any contentEditable now keeps the node **selected** instead of toggling it off, so editing text doesn't drop the selection. (Other nodes still toggle select/deselect on click as before.)

- **TODO page — complexity badges + filtering** — the **Current** tab now parses each backlog item and renders its priority + effort as **badges** (priority-toned: P0 error · P1 warn · P2 info · P3 neutral), with **Priority** and **Effort** filter toolbars that hide non-matching items (and empty bands). The PageNav reflects the visible bands.

- **Releases page — Upcoming tab + correct ordering** — the **Unreleased** changelog section now shows as an **Upcoming** tab (no date); release tabs are now **sorted** (Upcoming first, then dated releases newest-first, then undated legacy by version descending) instead of trusting the file order, and duplicate version ids (the changelog has two `0.2.0`) are de-duplicated so tabs stay unique.
- **Segmented Control configurator** — added a **Labels** control (`labelMode`: all / selected / none) and gave the default options icons (Day / Week / Month → calendar icons).
- **Heading & Paragraph configurators — balance text-wrap moved into the Align toolbar** — the balance-text-wrap toggle is now a divider-separated toggle in the Align toolbar (both configurators), instead of a standalone control.
- **Button configurator — `fullWidth` now fills the preview** — the Button configurator renders as a **bare display** (full-width preview) and centers a natural-width button itself, so toggling `fullWidth` actually stretches it. Previously the centered display Section shrank the button to content, so the toggle had no visible effect (same root cause as the Toolbar fix).
- **Releases page — flat bullet lists no longer render the first bullet as a heading** — a release written as a plain bullet list (no `### ` groups) had its first bullet promoted to an `<h3>`. The changelog parser now only treats a section's first line as a heading when it isn't a bullet, and the group heading is skipped when there's no title.

- **Resources menu** — added a **TODO** page (renders the repo-root `TODO.md` via a lightweight markdown renderer) with the standard Resources header (breadcrumb + h1 + description) and **Overview / Current / Roadmap tabs** so it isn't one giant page; the long tabs show a right-column **sticky PageNav** (a1-web sets `--a1-page-nav-top` to clear the 64px TopHeader). **Removed the Projects** item from the Resources menu (the route still exists; just not in that menu).
- **Toolbar configurator — canvas tool editor** — the Toolbar configurator is now data-driven and **editable on the component itself**: the bar is built from a `tools` list (toggle / button / menu / group / divider), and **clicking a tool in the preview selects it** for editing in the panel (type, label, icon, menu items / group options) with reorder (move ←/→) and add/remove. Renders as a **bare display** (full-width preview, no centering Section) so the **`fullWidth`** toggle actually fills the width — previously the centered Section shrank the bar to content so fullWidth had no effect. (Design system: `ToolbarMenu`/`ToolbarGroup`/`ToolbarDivider` now forward `className` + `...rest` so the canvas can tag and outline each tool.)
- **Sticky Actions / Accordion configurators** — Sticky Actions drops the per-button **label text inputs** (the demo buttons keep their default labels; Content width + Secondary-button toggle remain). The Accordion configurator now exposes **`subtext`** (a glanceable summary shown in the trigger while collapsed) and **`divider`** (added to the State toolbar) — both already supported by the component.
- **Slider configurator** — detents are now edited with the DefinitionList tabs pattern (tab per detent + per-item editor + Add) instead of stacked accordions; **Value position**, **Show value**, and **Disabled** are folded into a single **Value bubble** toolbar (position icons + toggle icons). (Design system: the Slider's compact track/thumb step up one notch so the smallest slider stays grabbable.)
- **Field-family Size picker shows the selected label** — the shared density Size control (`DensityChoice`, used by text fields, Select, Checkbox/Radio/Choice groups, Fieldset, Field Row, Autocomplete, Slider, Switch) now labels the chosen density (Compact / Default / Comfortable) while the others stay icon-only, via `ToolbarGroup labelMode="selected"`.
- **Heading / Switch configurators** — Heading's "edit in the preview / markdown shorthand" guidance under **Advanced** now appears only when the **Helper text** toggle is on (new shared `ConfigHelp` gate). Switch's **Size** is the density icon picker (matching the field family), **Label position** is an icon pair, and **Checked**/**Disabled** are folded into a single **State** toolbar.
- **Icon picker → grouped Autocomplete** — the configurator `IconSelect` (used across every component's Icon control) is now a filterable **Autocomplete** instead of a giant native select: all Material Symbols as options **grouped by Material category** under sticky headings, each row showing the glyph, capped at 200 with a "keep typing to narrow" footer. Backed by new design-system Autocomplete option fields (`icon`, `group`) + a `maxVisible` cap. The AI-find-icon button is unchanged.
- **Configurator helper-text toggle** — every component configurator's footer gains a **Helper text** Switch (off by default). When on, a short muted summary of what each property does renders beneath its control. Implemented via a shared `ConfigHelpContext` provided by the detail panel + a `WithHelp` wrapper baked into the shared kit controls (`Choice` / `ConfigSlider` / `DensityChoice` / `FieldState` / `ResponsiveControl`) — any configurator just passes a `helper` string. Seeded on Section, Button, and IconButton; the rest fill in per-control as they're touched.
- **Label-on-selected pickers (`ToolbarGroup labelMode`)** — Section **Surface**/**Gradient** and Button/IconButton **Variant** pickers now label only the selected option; the rest are icon/swatch-only. Variant gained a per-option icon (emphasis ramp `star`/`star_half`/`star_outline` + `delete`/`check_circle`). Responsive-property breakpoint toggles are now labels-only (no icons) so they fit.
- **Layout & Display configurator pass** — **Section:** Inverse is now an inline `ToolbarToggle` in the Surface bar (divider-separated; standalone toggle removed). **Stack:** the **Wrap** toggle folds into the Direction bar (single-value mode only). **Card:** **Icon display** is None-first with the standard circle-slash icon and **defaults to none**; **Bare** moved into the Variant bar as a divider-separated toggle. **Grid:** added **6 / 8 / 12** column options and a **none** gap option (backed by design-system Grid `gap="none"` + responsive 8-col classes). Accordion `divider` panels also gained top padding so content doesn't touch the divider line.
- **Patterns: context menu + project scoping** — each pattern card on the Patterns page has a right-click **ContextMenu** (Open, **Duplicate**, Scope to projects, and Delete for user patterns). **Project scoping** mirrors images: a pattern carries `projectIds` (empty = available to every project), edited via a "Scope to projects" dialog (`CheckboxGroup`), shown on the card, and enforced in the editor's Add-pattern panel (`patternAvailableToProject` filters `patternEntries` by the active project). New `duplicatePattern` / `deletePattern` / `isUserPattern` / `setPatternProjects` / `patternAvailableToProject` in `patternStore.js`.
- **Breadcrumb configurator → tabs pattern** — the Breadcrumb detail page now manages items with the DefinitionList tabs pattern (tab per item + per-item editor + Add + canvas-click sync) instead of stacked accordions.
- **Editor responsive: config panel → BottomSheet at xs/sm** — on the editor pages (project / theme / component configurators), the right-hand config rail moves into a **BottomSheet** at xs and sm; at md+ it's the side rail as before. The same portal slot is hosted in whichever location, and the theme editor re-acquires it across the breakpoint. Also at md and below the collapsed workspace SideNav gets an inline **Open sidebar** toggle (`view_sidebar`).
- **Z-index foundation page** — a new **Foundations → Z-index** page documenting the top-layer-vs-scale model, the layer scale (100→1200), the component audit, and the rules (`ZIndexFoundation.jsx`).
- **Component inventory search + filters** — the All-components `DataTable` gains native search (component / category / packages) and **Category** + **Package** filters.
- **BottomSheet in the component browser** — registered under Overlay with a configurator (title + open-state), previewed inside a constrained phone frame.
- **Rule editor** — a new **Rules** page (Editor menu) that reads every built-in design rule from the bundled `system/rules/*.yaml` (parsed with `yaml`) and lets you add your own — by hand (component, requirement, do/don't, applies-to) or **with AI** (`generateRule` → a structured rule). Custom rules persist locally (`rules/ruleStore.ts`) and are deletable; built-in rules are read-only. The list is a `DataTable` with native **search** and **filters** (Component, Applies-to, Source: Built-in/Custom). `pages/RuleEditor.jsx`, `rules/ruleStore.ts`, `rules/aiRule.ts`; route + Editor-menu entry.
- **TopHeader — Projects submenu** — the Editor menu now nests projects in a second-level **Projects** flyout (with an "All projects" link) instead of listing them flat at the end.
- **Theme — history, icon editor** — the Theme editor is now history-backed: every edit pushes a labelled snapshot, and the right panel has a **Config / History** `SegmentedControl` (matching the page editor) with the shared `EditorHistoryPanel` (day-grouped, double-click rename, right-click restore, click to jump). **Undo / Redo** moved to the centre toolbar; centre padding reduced two steps (`lg` → `sm`). New **Icons** category to dial the Material Symbols variation axes for all icons — **Fill** (outline/filled), **Weight** (100–700), **Grade** (−50–200), and **Optical size** (20/24/40/48) — compiled to `--a1-icon-fill/-weight/-grade` and `--base-icon-optical-size` (`icon` on the theme model). Right-rail padding fix so the panel isn't doubly inset.
- **Theme — Semantic colour layer** — a new **Semantic** page in the Theme editor maps each semantic colour token (`action-background/foreground/surface/border`, `text-*`, `surface-*`, `border-*`, and the status `*-background/foreground`) to a **ramp value**, separately for **standard** and **inverse** (dark-island) modes. The centre shows the same component showcase (buttons, link, text, card, field, status badges) rendered in a **Standard** panel and an **Inverse** panel so you see both live; the right panel has grouped accordions with a colour-variant Autocomplete per token × mode, sourced from the theme's ramp stops ("Accent 500" etc.). The compiler emits the standard values on the theme selector and the inverse values on a `.a1-theme-<slug> .a1-inverse` scope in the exported `theme.json`. New `semanticColors` on the theme model + `inverseSemanticVars`/`rampRefToVar` in the compiler; defaults mirror A1's derived semantics and `color-scheme.css` `.a1-inverse`. **Click-to-filter:** clicking any individual element in the preview (e.g. the tertiary button, a status badge) filters the right-panel controls — and the contrast report — to just the tokens that element uses. **Live contrast report:** a WCAG report under the preview shows the contrast ratio of each preview pairing (button label on action, text on surface, badge text on status, …) for both modes, badged pass/warn/fail against AA (`culori`'s `wcagContrast`), recomputed live as you edit.
- **Colour-from-ramp picker (Autocomplete `variant="color"`)** — added a colour variant to the design-system Autocomplete (a swatch beside each option/chip/selected value) and used it in the Theme editor: on a type detail page, all adjustments live in the right panel — the **Text colours** controls are now colour Autocompletes whose options are the theme's **ramp stops** (labelled, e.g. "Accent 500"), with `allowCreate` to type a custom hex. The **scale** rows use the **NumberField** component with a `rem` unit suffix. The detail page centre is a live read-only preview (scale at every step + colour samples).
- **Theme — typography roles, scale & advanced type** — Typography is now a **set of per-role pages** (Display / Heading / Body) in the workspace tree (like the colour ramps). The role **overview** page leads with **guidance** on each role's intent + an inline-editable sample of all three; each **role detail page** shows the full **size scale** (every step, with an editable rem value) and the **predefined text colours** (default/muted/accent/inverse, editable). The role's right rail carries Font (Autocomplete), **Weight** (slider detents), **Letter spacing** (slider detents), **Style** and **Transform** toolbars (Transform is icon-only; selecting **Uppercase** raises an accessibility warning and stays **preview-only** — never written to the theme, per the "never uppercase" law), and an **Advanced** section (open by default) exposing `font-synthesis` (+weight/style/small-caps), `font-kerning`, `font-optical-sizing`, `font-size-adjust`, `text-rendering`, and `-webkit-/-moz-osx-font-smoothing`, each with a short description. Font weights, sizes, and text colours compile into the theme vars / `theme.json`; the per-role refinements are preview tuning. AI font pairing moved **behind a button**. Routing: the editor mirrors `?theme=&cat=` so Back/Forward steps Themes → theme → category. (Also fixes Autocomplete menus being clipped inside the Accordion — see the design-system change.)
- **Theme — themes list, workspace shell, AI font pairing** — the **Theme** page (renamed from "Theme editor") now opens on a **list of theme cards** (like Projects / Image library): each card shows the name, description, core colour chips, and font pairing; click to open, right-click for Open / Duplicate / Delete; **New theme** creates and opens one. Themes persist in `lib/themeStore.ts` (localStorage, seeded with a Starter). Opening a theme shows the **same workspace shell as the page editor** — a `SideNav` left panel (`ThemeWorkspaceSidebar`) with a back-to-themes header + the theme name, and a category `TreeMenu`: **Details**, **Color** (a child per ramp — full 12-stop editable ramps), **Typography**, **Shape**, **Code**. The centre canvas drops the breadcrumb/title and carries a **Specific / Preview** `Toolbar` toggle — *Specific* shows the category controls, *Preview* shows a **style tile** (core colours, type, buttons, badges). **Details** edits the theme **name + description**; per-category controls portal into the right rail (hidden for Details and Code). **Typography → Pair with AI**: describe a mood and Claude searches Google Fonts for a compatible display/heading/body trio with a one-line rationale (`generateFontPairing` in `lib/aiTheme.ts`). New `pages/ThemesList.jsx`, `pages/ThemeWorkspaceSidebar.jsx`; `ThemeEditor` is now store-backed.
- **Theme editor** — a new **Theme editor** page (Editor menu) to build a theme by AI prompt or by hand. **Generate with AI** turns a description into a theme (a -500 hex per ramp + three Google Fonts + roundness) via `lib/aiTheme.ts`. Manual controls dial the six colour ramps (mid-`-500` colour → full 12-stop OKLCH scale via `lib/themeColors.ts`, ported from the standalone example), the display/heading/body fonts (any Google Font, loaded live), and corner roundness. `lib/themeCompile.ts` compiles the spec into the full A1 variable set (base-colour ramps + semantic surfaces/text/borders/action/status + buttons + fonts + radii); a live preview renders real A1 components from those variables, **Apply live** themes the whole app, and the editor outputs a drop-in **`theme.json`** to copy into `system/themes/`. Adds `culori` to a1-web.

- **Aperture theme** — a modern, minimal, gallery-grade theme for a photography portfolio: near-monochrome graphite accent on clean whites (Apple + Audi inspired), refined Apple-blue info and Audi-red error, small radii; **Pinyon Script** display, **Playfair Display** headings, **Manrope** body. `system/themes/aperture/`; in the theme switcher.

- **Create a project with AI** — the Projects home's **New project** button is now a **SplitButton** with a **Create with AI** option that opens a short chat: you describe the project, Claude asks a few clarifying questions, then returns a complete A1 project bundle which is imported and opened. New `lib/aiProjectBuilder.ts` (conversational, `claude-opus-4-8`, streamed; returns `{ status: 'asking' | 'complete', message, project }` grounded in the agent brief) + `projects/AiProjectDialog.jsx`.
- **Autocomplete added to the component browser** — a configurator/detail page for the new `Autocomplete` component (single/multi, allow-create, size, editable options via the DefinitionList tabs pattern). An audit confirmed Autocomplete was the only package component missing from the browser (Split Button is folded into the Button page; Cluster is deprecated).
- **Image library bulk upload** — the **Upload images** button is a SplitButton with **Bulk upload…**, which opens a dialog with a drag-drop target; dropped/selected files are **staged in a DataTable** (thumbnail, name, size, remove) and the title shows the count, then **Add N images** commits them. Categories: **Add a category** accepts comma-separated values to add several at once.

- **Per-project image & illustration style** — the project dialog (now **Project settings**) gains an **Image & illustration style** field describing the project's illustration and photography style, stored in `Project.meta.imageStyle`. A **Suggest with AI** button proposes a style guide based on the project (name + description) and the **active theme** (`lib/aiProjectStyle.ts`, with per-theme vibe hints). The Figure **Generate with AI** dialog now receives this as its `styleContext` (`getProjectImageStyle(projectId)`), so generated image prompts follow the project's look. Persists on create and edit.

- **Figure image-source toolbar + "Generate with AI" (prompt)** — the Figure configurator replaces the bare URL field with an **Image source** toolbar: **Add from library**, **Upload** (adds to the library and references it), **Find with AI** (the existing Unsplash lookup), **Generate with AI**, and **From URL** (reveals the URL field). **Generate with AI** opens a dialog where Claude writes a detailed, project-aware **image-generation prompt** from your description to copy into any generator — Anthropic's API has no image model, so this produces a prompt, not pixels (`lib/aiImagePrompt.ts` + `detail/ImageGenerateDialog.jsx`; accepts the project's image/illustration `styleContext` when available). A library image still shows a "From library" chip with swap/clear. Editor **Images panel**: empty state is now a `MessageEmptyState` with an **Upload** button; thumbnails are a smaller 3-up grid and the **whole tile** is the drag source (the inner image no longer hijacks the drag). Image **Gallery**: Images/Categories switch is now **Tabs**; the grid/table toggle shows labels; **bulk delete** in the table view asks for confirmation.

- **Image categories as managed objects + Autocomplete tagging** — categories are now first-class records in `lib/categoryStore.ts` (localStorage, with a change subscription), not just free strings on an image. The image **Edit** dialog tags with the new design-system **`Autocomplete`** (`multiple` + `allowCreate`): pick from existing categories or type to add a new one (added to the store). The **Image Gallery** gains a top-level **Images / Categories** view switch (`SegmentedControl`); the **Categories** view is a simple editor — add a category, and a **`DataTable`** lists each category with its image-usage count and **Rename** / **Delete** actions, which **cascade** across every image that uses the category. The store seeds itself from categories already used on images.

- **Image library** — upload images and use them in Figures, stored locally in the browser. A new **Image library** page under the editor (reached from the Projects home and the Editor menu) lets you upload (button or drag-and-drop), rename, delete, and crop images; uploads are downscaled (max 2000px; PNG keeps transparency, others re-encode as JPEG) and stored as Blobs in **IndexedDB** (not localStorage, which is reserved for page JSON). Each image has a **context menu** (right-click, or the per-image more button) with **Rename**, **Custom crop**, and **Delete**. **Custom crop** opens the Figure crop tool and stores a default crop on the image; thumbnails (in the library and the picker) display that crop, and when the image is added to a Figure it **starts from that crop** (still overridable in the Figure's crop controls). A single **View toolbar** adjusts thumbnail **density** (comfortable/compact) and whether thumbnails are shown **squared (1:1)** or at their **natural** aspect ratio (persisted). The **Figure configurator** gains a **photo_library** button next to the AI finder that opens a picker (choose an existing image or upload inline); choosing one stores `a1img://<id>` as the Figure `src`. The renderer resolves that ref to a local `object:` URL at render time (`lib/imageLibrary.ts` + `editor/ImageLibraryContext.jsx` provider wrapping the app; `pageRenderer` resolves Figure `src`), so page JSON stays a tiny id and one image can back many figures. Like the rest of the editor, the library is device-local (lives in this browser). New `lib/imageLibrary.ts`, `editor/ImageLibraryContext.jsx`, `projects/ImageLibraryView.jsx`, `detail/ImageLibraryDialog.jsx`; image-library route + Editor-menu entry + Projects-home button. No design-system component change (Figure is unchanged — it just receives a resolved URL / crop).

- **"Make with AI" — start a new page in the AI editor** — the project sidebar's **Add page** footer button (Pages tab) is now a **SplitButton**: the main target still adds a blank page, and a **Make with AI** menu item (auto_awesome) adds a page, opens it, and **lands the editor on the AI tab with the prompt focused** so you can describe the page immediately. Implemented with an `aiComposePageId` flag in `main.jsx` threaded `EditorPage → EditorAsidePanel` (switches to the AI tab on mount, then clears the flag) → `EditorChatPanel` (one-shot `requestFocus` that focuses the instruction textarea via a forwarded ref). The footer SplitButton fills the sidebar width via a small `.a1-web-add-split` class. a1-web only.

- **Navigation Cards link to project pages** — a `variant="navigation"` Card's link target is now set with the shared project-scoped **`PageLinkField`** (the same selector Buttons, Links, and IconButtons use) instead of a plain URL field, so a navigation card can point at another page in the project (and falls back to a "Link URL" text field on the standalone Card detail page). No design-system change was needed: Card already renders navigation + `href` as an `<a>`, and the editor renderer already routes any `/?page=` href to intra-prototype navigation. `detail/card.jsx` configurator only.

- **AI page editor (editor chat)** — a new **AI** tab in the editor's right-hand panel lets you describe a change to the whole page in plain language and have Claude apply it. The current page JSON plus the self-contained **A1 agent brief** (`packages/react/ai/a1-agent-brief.md`) are sent as context, so Claude knows the component registry, props, value vocabularies, and rules; it returns a `{ message, page }` object whose `page` is the full updated page definition. The result is **applied to the canvas as one undoable step** (`history.commit`, label `AI: <instruction>`) — Cmd+Z reverts the whole AI edit. Multi-turn: prior instruction → reply summaries are kept for context while the live page JSON is always re-sent (so manual edits between turns are respected). New `lib/aiPage.ts` (browser-side Anthropic SDK, shared API key in localStorage, **`claude-opus-4-8`**, streamed, adaptive thinking) + `editor/EditorChatPanel.jsx` (key entry, transcript, Enter-to-send) + an `onApplyDefinition` prop threaded `EditorAsidePanel → EditorPage`; chat-bubble styles in `styles.css`. Mirrors the existing AI image/icon tools; same "local prototyping only — don't ship the in-browser key to production" caveat.

- **DefinitionList configurator — tab-based child-item management** — items are now managed as **Tabs** (each item is a tab whose panel holds its editor) instead of stacked accordions; each item editor has a small **destructive remove `IconButton`** (top-right) and the **"Add item"** control is a `sm` button that adds and selects a new tab. **Clicking an item on the canvas** selects the DefinitionList, opens that item's tab, and **outlines the item** (label + value) — a shared `activeItem` state threaded `EditorPage → RenderPageDefinition` (canvas outline + `onItemSelect`, click-bubble stopped so selection doesn't toggle off) and `→ EditorPropsPanel → Controls` (active tab). Tab labels **clamp to the first few characters past four items** and the tab strip **scrolls horizontally** on overflow. Establishes the reusable pattern for managing a component's child items.

- **AI icon selector** — every `IconSelect` (so anywhere an icon is set) gains an **auto_awesome** button that opens an AI icon finder (`lib/aiIcons.ts` + `detail/AiIconDialog.jsx`, mirroring the AI image finder: browser-side Anthropic SDK, shared API key). Describe an icon → Claude returns three options, **validated against `system/icons/material-symbols.json`** (only real Material Symbols), shown as a **ChoiceGroup of glyph + name + reason**; selecting one surfaces its **icon-usage guidance** (an info Banner with the documented scenario from `icon-usage.md`, or a warn Banner if it isn't documented). **Apply** writes the icon name. The prompt **auto-populates from a nearby label** — an explicit `promptHint` (wired e.g. on List items → item text) with a DOM fallback that reads the closest name/title/label field. Model `claude-haiku-4-5`.

- **Inline-editable child items (DefinitionList)** — components whose child data lives in an array prop can now have those items edited directly on the canvas. First: **DefinitionList** — each item's **label and value** render as seamless `InlineEditable` text in editor mode (its `items` accept ReactNode label/value), writing back into the node's `items` array. New `EditorModeContext.onItemTextChange` threaded through `RenderPageDefinition` → `EditorPage.handleItemTextChange` (debounced commit; respects content/node locks). Designed to extend to other list-like components (List, etc.) next.

- **Shared layout composes in the editor Preview + edit canvas** — content pages now render **inside** the project's shared layout in the editor's **Preview** tab (full Outlet substitution via `combinePageIntoLayout`) and show the layout's chrome read-only around the editable canvas in **Edit** (header before / footer after the page, via `splitLayoutAtOutlet`) — not just in the launched prototype. (Stage 2.2 project-settings panel + 2.3 PageLayout shell still pending.)

- **Heritage theme — barely-rounded corners** — Heritage was overriding the larger radii but not `--base-radius-sm` / `--base-radius-md` (which most elements use), so corners still looked rounded like other themes. Set `--base-radius-sm: 1px` and `--base-radius-md: 2px` so Heritage's corners are consistently just-barely rounded.

- **New "Crochet" theme** — a soft, cozy pastel theme: dusty-rose accent with sage / periwinkle / apricot pastels on warm cream surfaces, **Fraunces** (expressive warm serif) for display, **Libre Baskerville** for headings, and **Roboto Slab** (slab serif) for body (three distinct serifs for visual diversity, with display as the dynamic standout). New `system/themes/crochet/theme.json` + `tokens/typography.json`; Fraunces added to a1-web's Google Fonts link; registered in the theme switcher (`main.jsx` `themeOptions` + `.a1-theme-crochet` class toggle). Pastel `-500` shades are kept deep enough for WCAG AA on actions/status (run the focused a11y check to confirm against your content). Run `npm run build:tokens` to regenerate.

- **Project shared layout (chrome editable on the canvas)** — each project now has an editable **shared layout document** (reserved doc id `__layout__`, stored at `a1-project-${id}-layout`, seeded by `projects/projectLayout.ts` `defaultLayoutDefinition`: a `TopHeader` + a page-content **`Outlet`** + a footer). Open it from a project via **All pages → "Shared layout"**; it edits on the canvas with the normal configurators and auto-saves (`EditorPage` `documentKind="layout"` → `saveProjectLayout`). A new **`Outlet`** component/type (`editorComponents.jsx` `EditorOutlet`, registered) marks where each page renders; `combinePageIntoLayout` composes a page into the layout by replacing the Outlet with the page's nodes and injecting the auto nav/logo onto the header. The **standalone prototype** (`EditorPreviewPage`) now renders every page **inside** the shared layout. Also added an optional `meta` map to the `Project` model. *Staged next:* composing into the shared layout in the editor's Preview tab + edit canvas, a project-settings panel (title/description/icon/metadata) in the layout editor, and PageLayout-shell (sidebar/aside) editing.

- **DataTable renders supplied data** — the editor's `DataTable` adapter (`editorComponents.jsx` `EditorDataTable`) now renders the **real `DataTable`** with the node's own `columns`/`rows` when real data is supplied (falling back to the sample-data Preview only when a catalog-added table has no `columns`). Previously every page-definition `DataTable` showed the configurator's generic sample rows regardless of its props. Invalid `size` values are dropped (DataTable density is `comfortable`/`default`/`compact`).

- **Import consistency lint** — `projectStore.validateProjectImport` now adds non-blocking **design-consistency warnings** (alongside the unknown-type warnings) via a new `lintDefinition`: a per-page **`TopHeader`** (projects auto-generate the nav — duplicate), a top-level **`Section` without `contentWidth`** or with **zero/missing padding**, **adjacent sections with mismatched padding**, **sibling `Card`s not in a `Grid`**, and **card `Figure`s with a missing or invalid `aspectRatio`** (e.g. `"4 / 3"` instead of `"4:3"`). Surfaced in the Upload JSON dialog's warning banner. New design rules added: `system/rules/section.yaml` (`section-primary-content-width`) and `system/rules/card.yaml` (`cards-in-grid`, `card-image-aspect-ratio`); the agent brief (`packages/react/ai/a1-agent-brief.md`) gained the matching authoring rules (no per-page TopHeader in a project, consistent non-zero section padding, contentWidth on primary sections, cards-in-grid, colon-form aspect ratios) and corrected the `DataTable`/`Figure` prop notes.

- **Upload a project from JSON** — the Projects view (`ProjectsList`) gained an **Upload JSON** button that opens a Dialog with an **editable code block** (`Code editable`). Paste a **project bundle** (`{ name, icon?, pages: [{ title, icon?, parentId?, definition }] }`) or a bare **page definition** (`{ page: { … } }`); it **validates live** — JSON parse errors and structural problems (missing `page.layout.regions`, nodes without a string `type`, bad `children`) block import, while **unknown component types** are non-blocking warnings (they render a safe fallback). On import it creates a new project, seeds each page's content, preserves the `parentId` hierarchy, and opens it. New `projects/ProjectImportDialog.jsx`; `projectStore.ts` gained `validateProjectImport(data, knownTypes)` + `importProjectJson(data)`; wired through `main.jsx` (`handleImportProject`). Pairs with the new agent brief (`packages/react/ai/a1-agent-brief.md`) so an agent can generate a project and paste it straight in. Each project's right-click menu also gains **Download as JSON** (`projectStore.exportProjectJson` → a `{name, pages:[{…, definition}]}` file that round-trips back through Upload).

- **Agent brief for JSON authoring** — added `packages/react/ai/a1-agent-brief.md`: a single, self-contained, current spec (page-definition + project-bundle JSON shapes, `ComponentNode`, the full **59-component** registry with key props + container flags, value vocabularies, rules, and worked examples) for handing to a zero-context agent. Supersedes the stale component list in `page-definition-standard.md`.

- **Pattern blank areas (Slot)** — patterns can define **constrained drop zones**. A new `Slot` component (`editor/editorComponents.jsx` `EditorSlot`, registered in `pageTypes.ts` / `componentRegistry.ts` / renderer `CONTAINER_TYPES`) renders as a **dashed accent-bordered Section with a centred label** while empty, and renders its children transparently once filled. Its configurator (`EditorPropsPanel.jsx` `SlotEditorControls`) sets the placeholder **label**, **allowed components**, **allowed patterns** (leave both empty to accept anything — these accept-lists only show while **authoring a pattern**, not when a slot is configured on a page), a **min / max item count** (e.g. a card grid of 1–4 cards, a menu of 1–12 items). The slot lays its items out with the **Grid** component, exposing **Columns** and **Gap** grid props that can each be left **open or locked down** per pattern (lockable via the inline lock icons like any other prop). The Slot has its own **`select_all` icon** (Add panel + layers tree) to distinguish it from patterns (`dashboard_customize`) and components. The page editor **enforces** all of it: adding/dropping a disallowed component or pattern **into** a slot is blocked, a **full** slot (at `max`) rejects further adds, and deleting below `min` is blocked — each with a notice (`EditorPage.tsx` `slotRejection` + the `handleNodeDelete` min guard, wired into `handleAddNode` / `handleAddPattern` / `handleCatalogDrop`). **Clicking a slot** on a page opens the **Add** tab targeted at that slot (`pageRenderer.tsx` routes a Slot's click to `onRequestAddChild` when `enforceLocks`), and the Add panel **filters** the offered components and patterns to only what the slot accepts via a `slotFilter` passed from `EditorPage` (`EditorAddPanel`). A **full** slot still lists its allowed items so an add attempt is met with a clear **"This blank area is full"** snackbar (`slotRejection` + `setNotice`). In the pattern editor a slot click still selects it so its rules can be authored. Added to the Add panel under Layout ("Blank area").

- **Nested patterns preserved on extract/detach** — patterns can nest inside patterns, and that link is now kept. **Create pattern from selection** (`EditorPage.tsx` `extractPatternSource`) converts any nested pattern instance in the selection into a **`PatternRef`** in the new pattern instead of flattening it into loose nodes; **Detach pattern** (`detachPatternMeta`) strips only the outer pattern's metadata and **stops at nested instances**, so detaching the outer pattern no longer detaches the patterns inside it.

- **Per-property lock icons in pattern authoring** — pattern property locking moved inline: each configurator control shows a small **lock / lock-open icon button** beside it (`pages/components/detail/configLock.jsx` authoring mode + `EditorPropsPanel` `onSetLock` wiring), replacing the per-property switch list in `PatternLockControls` (which now holds only the **Lock component** / **Lock text content** switches). Locked sliders and responsive controls now also show the lock state (`ResponsiveControl` / `DetentSlider` made lock-aware).

- **Pattern editing in the main editor** — patterns are authored in the **main editor** (no separate editor): the Patterns page **Edit pattern** button opens `/?page=editor&pattern=<id>`, and `EditorPage` gains a `documentKind="pattern"` mode. It wraps the pattern as a page definition (`patterns/patternDocument.js`), auto-saves edits back to the pattern store, and shows a **left sidebar** (`patterns/PatternWorkspaceSidebar.jsx` — all-patterns list + the current pattern's layers tree). The **Configure** panel shows **lock authoring** controls (`patterns/PatternLockControls.jsx`): mark the whole component, its text, or individual properties as locked. Page/project chrome (versions, project nav, prototype) is hidden in pattern mode. (The earlier standalone `PatternEditorPage` was removed.)

- **Patterns addable in the page editor + lock enforcement** — the page editor's **Add** panel has a **Patterns** group; adding a pattern inserts a fresh, editable copy (`patterns/instantiatePattern.js`) that **preserves lock metadata** and keeps a `patternNodeId` link back to the pattern. The page editor **enforces** locks: a locked component can't be deleted/moved/restructured or have children added; locked props revert on change; locked text is read-only (renderer `enforceLocks`); a fully-locked element's configurator is wrapped in a disabled `fieldset`, and partially-locked elements show what's locked. A pattern instance shows the **pattern name + a pattern icon** in the layers tree and Configure heading (not the base structure). Locked elements show a **red inset ring + a lock badge** (top-right) on the canvas (`[data-editor-locked]`, `RenderPageDefinition` `enforceLocks`/`lockedNodeIds`).

- **Sync pattern instances + compatibility check** — a **Sync pattern instances** tool in the page editor toolbar reconciles the open page's instances against their current patterns (`patterns/patternSync.js`): locked props/text are pulled forward and the lock metadata refreshed, and it reports **incompatibilities** — instance edits to a value that the pattern has since locked (e.g. a prop edited on the instance that was later locked down). Matching uses the `patternNodeId` recorded on each instance node.

- **Patterns nav moved** — the top-level **Patterns** nav item was removed and now lives under the **Editor** menu in the top header.

- **Patterns concept (initial)** — introduced **Patterns**: reusable, governed compositions defined as JSON, shaped like page definitions. A pattern is a tree of A1 component nodes (reusing the editor's `ComponentNode` model) with two additions — **locking** (`lock: { node?, props?, content? }` on any node, so whole components, individual props, or text can be governed) and **nesting** (a `"PatternRef"` node embeds another pattern by id). New `src/patterns/`: `patternTypes.ts` (the schema), `patterns.js` (registry + the first example, a **Page header** pattern, with `getPattern`), `resolvePattern.js` (`resolvePatternNodes` expands `PatternRef` + strips lock metadata for rendering; `summarizeLocks` for the governance summary), and `PatternPreview.jsx` (renders a pattern read-only through the existing page renderer). The **Patterns page** (`pages/Templates.jsx`, route `templates`) was rewritten to explain the concept and show the page-header pattern: a live preview in a bordered frame (`.a1-web-pattern-frame`), a lock/edit summary, and the raw JSON definition. Roadmap (noted on the page): a pattern editor and creating a pattern from a selected portion of a page.

## 0.3.0 — 2026-06-17

- **Editor Add panel — source-of-truth ordering + view controls** — the Add panel now derives its **category order, category names, component order, labels, and icons** from the component registry source of truth (`pages/components/data.js` `componentCategories`) rather than the catalog's own grouping, so it always matches the Components section (and new components auto-slot in). The catalog (`componentCatalog.ts`) is now just the addable-node pool, resolved by component id via the new `CATALOG_ENTRIES_BY_ID` / `catalogIdForType` exports; components without an addable entry are omitted, and empty categories (e.g. Overlay) are hidden. Added a **view toolbar** at the top of the tab: a **Common / All** `ToolbarMenu` dropdown (Common shows a curated set of the most-used components — `COMMON_COMPONENT_IDS` in `componentCatalog.ts`, default), a **Grid / List** `ToolbarMenu` dropdown, and a **Group by category** `ToolbarToggle` — with grouping off, components show in a single **alphabetical** list. New `a1-web-add-panel-list` / `-row` styles for the list view.

- **Editor — 7 more components addable** — the editor Add panel and renderer now support **Slider, Tabs, Toolbar, Field Row, Page Nav, Tree Menu, and Data Table**. Registered in `editor/pageTypes.ts` + `editor/componentRegistry.ts`, with catalog entries (`editor/componentCatalog.ts`) and config bridges (`editor/EditorPropsPanel.jsx`) that reuse each component's existing detail-page `Controls`. **Slider** and **Page Nav** render the real components with real props; **Field Row** is a real container holding field children (added to `CONTAINER_TYPES`); **Tabs, Toolbar, Tree Menu, and Data Table** render via thin **editor adapters** (`editor/editorComponents.jsx`) that reuse the detail-page `Preview` (their node `props` carry the configurator config, since these are compositional or render fixed sample data). *Known limitation:* the editor's **React-code** export serializes the adapter config rather than the literal `<Tabs>`/`<Toolbar>`/`<DataTable>` composition — the component detail page remains the canonical code source for those. Still deferred per request: Inline, Inline Editable, Side Nav, Page Layout, Dialog, Menu, Context Menu, Snackbar, Notification.

- **Canonical component icons (source of truth)** — every A1 component now has one canonical Material Symbols icon, defined on `componentCategories[].components[].icon` in `src/pages/components/data.js` (also exported as `COMPONENT_ICONS`). The editor **Add** panel catalog icons were aligned to it, and `system/icons/icon-usage.md` gained a full **Component Icons** table, so the same icon represents a component everywhere (component browser, Add panel, layers tree). *(Foundation for the "all components addable in the editor" work; the catalog category reorg to the new taxonomy and editor render support for the components not yet renderable there — Inline, Slider, Toolbar, Sticky Actions, Accordion, Tabs, Side Nav, Page Nav, Tree Menu, Field Row, Inline Editable, Notification, Snackbar, Dialog, Menu, Context Menu, Data Table, Page Layout — remain as follow-up.)*

- **Configurator + Editor — responsive (per-breakpoint) properties** — a new `ResponsiveControl` helper (`src/pages/components/detail/configKit.jsx`) lets a property be set per breakpoint. In single-value mode it renders the control plus a small **`devices` icon button**; clicking it switches the value to a responsive object (`{ xs?, sm?, … }`) and shows a **Toolbar of breakpoint toggles** (XS · SM · MD · LG · XL). Enabling a breakpoint adds an **Accordion** labelled with the breakpoint and its **pixel range** (e.g. "641–1024px") holding that breakpoint's control; pressing the button again returns to a single value. A shared `responsiveProp` serializes the object for snippets. **Wired into:** Grid `columns`, Section `padding`/`align`, Stack `direction`/`justify`, Heading/Paragraph/List/Spacer `size`, and Choice Group `columns` — in both the component configurators **and** the Editor (which reuses the same controls; the `Grid`/`ChoiceGroup` editor config bridges were fixed to preserve the object — they previously coerced columns to a number). **Divider** `orientation` already had a bespoke responsive mode (left as-is); **Toolbar** `showLabel`/`showLabels` accept the object at the component level but the configurator keeps a single toggle for now. (Grid `span`/`rowSpan` are per-child props with no configurator control.)

- **Section content-padding rules** — added `section-content-padding` and `section-matching-padding` (`system/rules/section.yaml`, surfaced on the Section Rules tab): a Section separating large content blocks needs at least some block padding (content shouldn't run into the top/bottom edges), and related stacked sections should use matching padding for a consistent rhythm.

- **Editor — toolbars in the header** — the Undo / Redo / Keyboard-shortcuts / Launch-prototype buttons are now a `Toolbar` (`ToolbarButton`s with a divider) instead of loose `IconButton`s, and the **Edit / Preview / Code snippet** view switcher is a `Toolbar` `ToolbarGroup` instead of a `SegmentedControl`.

- **Editor — Code snippet as JSON or React** — the Code-snippet view has a **JSON / React** toggle. JSON stays editable (drives the canvas); **React** shows read-only JSX generated from the page definition (new `definitionToJsx` serializer — `src/editor/definitionToJsx.ts`).

- **Component preview centering** — fixed-width controls (e.g. **Icon Button**, **Icon**) now centre in the preview panel like content-sized ones (`componentHasNaturalWidth` now treats `Fixed` widths as natural).

- **Component menu re-categorised** — the Components menu order/grouping is now **Layout & Display → Typography → Actions & Controls → Navigation → Inputs → Feedback & Messaging → Media and iconography → Overlay → Data** (`componentCategories` in `src/pages/components/data.js`). Layout→Layout & Display, Actions→Actions & Controls, Feedback→Feedback & Messaging; **Tabs**, **Link**, and **Accordion** moved into Actions & Controls; **Figure** into Media and iconography; the **Disclosure** category was retired. **Cluster** (deprecated) was removed from the menu and registry metadata.

- **Component page — "Codebase" switch (Button)** — the Button component page has a **Codebase** toolbar (React / Native / Pure) at the **top of the Configure tab**, above the component's controls. Switching it updates the preview, the code snippet, and the available controls per platform. (Wired generically via a detail module's `viewAsModes`; passed through `ConfigurationPanel`.)

- **Component page — Display controls moved to a centre-panel toolbar** — the config panel's **Display tab is gone**; display options are now a **toolbar pinned to the top-right of the centre preview panel** (wrapping when needed): **Responsive view** (Fit · XS · SM · MD · LG · XL), **Padding**, and **Inverse**. The config panel (right rail) is now just the component's controls + the **Codebase** switch. **Surface** was dropped as a configuration; **Alignment / Border / Radius / Container-query** controls were also removed (the responsive view covers breakpoint testing; the preview keeps a sensible default frame and the per-component alignment default).

- **Component page — Responsive preview** — the **Responsive view** control renders the preview inside an **iframe** sized to a real **device width × height** (a nested viewport, so `@media` / container queries respond accurately) and **scales it to fit** the centre panel — so a wide desktop layout is viewable inside a narrow panel (or on a phone). The device keeps a realistic fixed height and the **page scrolls inside** it; it has a chunky **device bezel**; a caption shows the size and scale %. "Fit" keeps the normal in-panel preview. New `ResponsivePreviewFrame` (clones the app stylesheets + theme into the iframe, scales via CSS transform). A `ResponsivePreviewContext` lets a preview know it's in the iframe — used by **BottomDrawer** to pin its fixed bar to the device viewport bottom (in Fit mode it stays contained so it can't cover the app).

- **Stack configurator — icon controls** — **Direction** (column/row + reverses as compass arrows), **Align**, and **Justify** are icon `ToolbarGroup`s, and the **Wrap** toggle now lives inside the **Direction** toolbar (after a divider).

- **Bottom Drawer configurator** — items can be added/removed down to **1** (was a fixed 3–5 floor); the **Add item** button is always shown (disabled at the 5-item max) with an "N of 5" hint, and per-item **Remove** is disabled at the minimum.

- **Toolbar surface rule** — added `toolbar-surface-contrast` (`system/rules/toolbar.yaml`, surfaced on the Toolbar's Rules tab): a Toolbar must sit on a **panel or page** surface, never a **raised** surface (its bar uses the raised token, so it would have no contrast on a raised background). Switching it updates the **preview** (props the platform doesn't support are dropped — Native has no `href`, Pure has no full-width/loading) and the **code snippet** (React JSX, React Native with `onPress`, or HTML with `a1-button` classes), and hides the controls for inapplicable props. Wired generically: a detail module opts in by exporting `viewAsModes`, and `Preview`/`Controls`/`Snippet` receive the active `viewAs`. Button is the first to adopt it.

- **Button — Split (menu)** — the Button configurator gained a **Split (menu)** toggle (React view) that renders the new `SplitButton` (a primary action plus a caret target that opens a menu of related actions) and emits its code. Long button labels now also wrap to multiple lines and grow the button height (component change).

- **Page Layout configurator — realistic page + full props** — the preview now renders a real `PageLayout` (in a bounded page frame) with realistic slot content: a header bar (brand + nav + account), a sidebar nav, a dashboard `Section` (heading, stat `Card` grid, activity card), an optional "On this page" aside, and a footer. All props are configurable: **Slots** (Header / Sidebar / Aside / Footer) as a Toolbar of toggles, **Sidebar placement** and **Aside placement** (start / end icon groups, shown when that slot is on), and **Behavior** (Sticky header / Viewport height). The snippet reflects every option.

- **Configurator controls — Toolbar/Slider/density pass** — every component configurator's single-select controls now render as **Toolbar** groups (via a shared `Choice` helper in `src/pages/components/detail/configKit.jsx`) instead of `ChoiceGroup`, and size/spacing scales use compact subtle **Sliders**. New shared helpers in `configKit.jsx`: **`DensityChoice`** (the field-family Size control as an icon-only density picker — `density_small` / `density_medium` / `density_large`) and **`FieldState`** (a Toolbar of toggle buttons for boolean control state). Specific conversions:
  - **Code — Options** is one icon-only `Toolbar` of `ToolbarToggle`s: **Wrapping** (`wrap_text`), **Editable** (`edit`), **Copy button** (`content_copy`).
  - **Button — Icon** is one None / Left / Right icon `ToolbarGroup` (None clears the icon; Left/Right set `iconPosition` start/end, with the icon picker shown when an icon is set); **Full width** (`width_full`), **Loading** (`progress_activity`), and **Disabled** (`block`) are one `Toolbar` of icon toggle buttons.
  - **Slider** — each detent is now an **Accordion** (value / label / optional icon / remove inside, first open by default); the **Size** control uses the density-icon picker; and each detent's "Show an icon instead of the label" toggle is a **Display as** group (Label / Icon).
  - **Fieldset** — **Mark required** and **Surface** are one `Toolbar` of toggle buttons (`asterisk` / `border_outer`).
  - **Notification** — **Position** is a 2×2 grid of directional corner arrows (`north_west`/`north_east`/`south_west`/`south_east`); the duplicate **Dot** toggle was removed (the Inner-content control already has a "dot" option); and the page's Display alignment now defaults to **center** (Notification is a content-sized badge).
  - **Snackbar** — **Position** is a 3×2 grid of directional arrows (top/bottom × left/center/right); **Action** and **Dismissible** are one `Toolbar` of toggle buttons (`touch_app` / `close`).
  - **Status Bar** — **Label position** is an inline row of directional arrow icons (`arrow_upward`/`arrow_downward`/`arrow_back`/`arrow_forward`).
  - **Step Tracker** — **Align** is an icon group (`format_align_left`/`center`/`right`/`justify`).
  - **Empty State** — removed the **Action variant** control; the action keeps the default `secondary` button variant.
  - **Circular Progress** — the inner-content control is now **"Inner content (Example)"** and its per-content configuration (custom label text / icon picker) was removed — the label and icon examples use fixed defaults.
  - **Status / colour controls → swatch-only** — the colour-status pickers (Badge, Banner, Dialog, Notification **Status**, and Card **Hero color**) render as **swatch-only** `ToolbarGroup`s (a colour chip per option, the status name as each chip's accessible label), via a shared `statusOptions` helper that maps neutral/info/success/warn/error/action to their semantic colour tokens. An empty/"none" option keeps the standard none icon.
  - **Button Container** — **Align** is an icon group (`format_align_left`/`center`/`right`), and the separate **Fill buttons** switch was folded in as a fourth **Fill** option (`format_align_justify`).
  - **Grid** — the **Layout** (bento) control was removed.
  - **Figure** — **Radius** and **Size** are compact subtle `ConfigSlider`s; the "Find an image with AI" button is `size="sm"`; the freeform-crop button now reads **"Custom crop"** with a left-aligned `crop` icon.
  - **Inset** — the demo's inset content now sits on a contrasting action-colour block (matching the Bleed demo) so the uniform padding reads as a visible gap to the card edge.
  - **Data Table** — **Density** is an icon picker (Responsive `width` + `density_small`/`medium`/`large`), and the boolean switches are grouped into labelled `Toolbar`s of toggle buttons: **Appearance** (Zebra stripes / Scrollable), **Features** (Sortable / Search / Filters / Pagination), and **Selection** (Selectable / Delete selected).
  - **Definition List** — **Direction** (`view_column`/`view_agenda`) and **Label width** (`width`/`straighten`) are icon groups; each item's **Value as heading** and **Copy button** toggles are one `Toolbar` of toggle buttons (`title` / `content_copy`).
  - **Calendar** — **Highlight today**, **Dim past**, and **Today button** are one `Toolbar` of toggle buttons (`today` / `history` / `calendar_today`).
  - **Icon** — **Color** is a swatch-only picker (muted / accent / inverse / success / error / warn / info, plus an "Inherit" none option); the shared `statusOptions` helper gained muted/accent/inverse colours and a `noneLabel` option.
  - **Accordion** — **Default open** and **Disabled** are one `Toolbar` of toggle buttons (`unfold_more` / `block`).
  - **Field family** (Text/Number/Date/Time/Phone/Zip/Credit Card via `fieldKit`, plus **Select**, **Fieldset**, **Field Row**, **Checkbox Group**, **Radio Group**) — **Size** uses the icon-only density picker; **Required / Disabled / Read only** are one `Toolbar` of toggle buttons (`asterisk` / `block` / `edit_off`).
  - **Choice Group** — density Size; **Required**, **Hide indicator**, **Inline icon**, and **Multiple** are one `Toolbar` of icon toggle buttons (`asterisk` / `visibility_off` / `align_horizontal_left` / `select_check_box`).
  - **Inline Editable** — **Display as** is an icon `ToolbarGroup`: Text (`text_fields`), Paragraph (`subject`), Heading (`title`), Button (`smart_button`).
  - **T-shirt size / spacing scales → subtle Slider** — every control with a t-shirt scale (xs–xl, sm/md/lg, gap/spacing/content-width) is now a compact **subtle `Slider`** (one detent per step; an empty or `none` value renders as **`--`**), via the shared `ConfigSlider` helper: **Accordion, Badge, Button, Icon Button, Button Container, Circular Progress, Definition List** (size + value-heading size), **Divider** (size + space), **Grid** (gap), **Heading** (size), **Icon, Link, List, Paragraph, Segmented Control, Spacer, Stack** (gap), **Status Bar, Sticky Actions** (content width), and **Textarea** (rows). The value bubble spells the size out (e.g. "Small") via the Slider's new `bubbleLabel`, while the detent under the track keeps the short form ("Sm"). Section and Heading spacing scales were already Sliders; their lowest/`none` stop now also shows `--`.
  - **Link — Icon** uses the same pattern as Button / Icon Button: one None / Left / Right icon `ToolbarGroup` (None hides the icon; Left/Right set `iconPosition` start/end, with the icon picker shown when an icon is set).

- **Config + editor side panels** — both right panels now use the **panel surface** (`--semantic-color-surface-panel`); the universal **Display** tab's controls (Container query, Background, Alignment, Padding, Inverse) were converted to **Toolbar** style (Background shows surface swatches; Inverse is a toggle).

- **Heading configurator — Toolbar/Slider + Advanced accordion** — rebuilt on the Section pattern: the single-select controls (Heading mark, Underline style, Type, Element, Size, Color) are now `Toolbar` groups (Color shows swatches), Margin is a compact subtle `Slider`, and the on-selection **heading-mark toolbar** in the editable preview now uses a floating **`<Toolbar overlay>`** with `ToolbarToggle`s (replacing the custom button bar). An **Advanced** accordion (with a collapsed summary) holds **Align**, **Margin**, and **Text wrap** (now a toggle).

- **Section configurator — Toolbar/Slider controls + accordions** — the Section configurator was rebuilt on the **Toolbar** and **Slider** components and grouped into **accordions**. A **Sizing** accordion (open) holds **Padding, Gap, Content width** as compact subtle **Sliders** (a detent per value; `--` = the lowest/none stop). Then a **Background** accordion (open) with **Inverse** + **Surface** + **Gradient** (and gradient position); a **Border** accordion with **Border size** (now a Slider), the border style/variant/sides controls, and **Radius**; and an **Advanced** accordion with **Height**, **Alignment**, and **Element**. **Surface**, **Gradient**, and **Border variant** preview their colours with Toolbar **swatches**; gradient-position arrows point **inward**; Border style stays labelled (Material Symbols has no distinct solid/dashed/dotted glyphs). The **Border sides** control is an "All" button + per-side toggles driving the `borderSides` prop.
- **Config side panel — no horizontal scroll** — the component config aside (and the editor aside) now clip horizontal overflow (`overflow-x: clip`), so a slider value bubble at a track edge can never trigger a horizontal scrollbar.
- **Figure configurator — crop** — crop uses the preset approach by default: an **Aspect ratio** control (Natural, 16:9, 4:3, 3:2, 1:1, 2:3, 3:4, 9:16, 21:9) and, when a ratio is set, a 3×3 **Crop** focal-point grid (9 named points), emitting `aspectRatio` + `crop`. A **Custom** button below the crop grid opens a **dialog** (`src/pages/components/detail/FigureCropTool.jsx`): the image is shown with a non-destructive freeform crop rectangle — drag anywhere to draw, drag an **edge or corner** to refine, outside is dimmed — with the aspect-ratio presets below the image (picking a ratio reshapes the existing rectangle rather than clearing it) and **Apply** / **Cancel** buttons (Cancel discards). Selecting an aspect ratio exits Custom mode; **Clear** removes a custom crop. Custom crops are stored only as metadata — the Figure `cropRect={{ x, y, width, height }}` prop — and never alter the image. Panel order: Caption position now sits directly under the "Caption screen-reader only" switch; the crop controls are grouped at the bottom.
- **Figure configurator — Toolbar controls** — the Figure configurator's remaining single-select controls use the **Toolbar** component instead of `ChoiceGroup`: **Radius**, **Size** as labelled `ToolbarGroup`s, **Align** and **Caption position** as icon groups. Contextual visibility — **Align** is hidden when `size` is Auto, and **Caption position** is hidden when the caption is screen-reader-only. The image URL / AI finder, alt, caption, and "caption screen-reader only" controls are unchanged.
- **Component configurator — Display alignment default** — the Display Section alignment now defaults per component: `center` for natural-width (content-sized) components like Button and Badge, and none/full-width for flexible components like Paragraph, fields, and tables (it re-applies on navigation). Both remain overridable in the Display tab.
- **Components browser — Tree Menu sidebar** — the "Component tree" navigation sidebar is now built on the **TreeMenu** component (was `SideNav`), keeping search, active highlighting, auto-expansion of the active/searched category, and SPA navigation.
- **Editor help page** — a new searchable, categorized **Help** page (top-nav **Editor → Editor help**, and a **Help** button on the Projects landing page; `?page=help`) documents every editor feature: getting started, projects, pages & navigation, selecting & editing, adding & arranging components, reuse & restyling (copy pattern, versions, history), media & AI (Figure aspect/crop, AI image finder), preview & prototype, saving/export/storage, and a full keyboard-shortcuts table. A search field filters articles (matched ones auto-expand); category pills jump to sections; each feature is a collapsible accordion. The page is data-driven from a single `HELP` array in `src/pages/Help.jsx` — add/edit/remove an article there as editor features change (a maintenance note is at the top of the file).

- **Editor — Copy pattern (restyle by style transfer)** — copy a selected element's **style properties** with **⌘⌥C / Ctrl+Alt+C** and paste them onto another element with **⌘⌥V / Ctrl+Alt+V** (also available from the **canvas right-click menu** and the **Layers tree context menu** as "Copy pattern" / "Paste pattern"). The pattern captures the whole **subtree**: it records a `type → style` map for the copied element and all its descendants, and on paste restyles **every matching element by type** within the target subtree (e.g. copy a styled Card and its Heading/Paragraph/Button styles transfer to another Card's children too). Each element's **resolved** style is captured via the configurator bridges, so defaults that aren't written to the JSON (a Badge's implicit `subtle: false`, a Section's default `surface`, …) are still part of the pattern; on paste those keys are **cleared** from the target so it falls back to the same default — the target ends up looking exactly like the source, not a partial blend. Only the props each target type actually accepts are applied; content/identity/data/state props (text, `src`, `href`, `items`, `value`, `disabled`, …) are excluded — only visual props travel (variant, size, color, padding, gap, surface, gradient, radius, align, …). The whole paste is a single undoable history step. If nothing matches, a **snackbar** explains why ("No matching elements to paste onto Section"); copy/paste counts are reported too. The pattern is held in `localStorage` so it survives page switches. Shortcuts use ⌥/Alt (not ⇧/Shift) to avoid the browser's ⌘⇧C "Inspect Element"; they match on `e.code` so Option-composed characters on macOS don't break them. `propsToConfig` / `configToNodeUpdate` are now exported from `EditorPropsPanel.jsx`; the shortcuts are listed in the editor's keyboard-shortcuts dialog (⌘K).
- **Figure configurator — AI image finder** — a small **auto_awesome** icon button next to the Figure **Image URL** field opens a "Find an image with AI" dialog. Describe the image you want and Claude returns three Unsplash thumbnails; you can **select** one, ask for **3 more** (avoids already-shown results), or **re-prompt**. Selecting an image reveals an optional **caption** field; **Apply** sets the Figure's `src`, `alt`, and `caption`. New `src/lib/aiImages.ts` is a tiny browser-side Claude client (official `@anthropic-ai/sdk` with `dangerouslyAllowBrowser`, structured-output JSON schema, `claude-opus-4-8` by default via a single `MODEL` constant) plus `src/pages/components/detail/ImageSuggestDialog.jsx`. The Anthropic API key is entered in the dialog and stored only in this browser (`localStorage`); broken image URLs are detected and excluded from selection. **Security:** the key is exposed client-side — fine for local prototyping, not for a public production build (proxy through a backend there). Added `@anthropic-ai/sdk` dependency. The editor's Figure wrapper no longer renders a second Image URL field (the shared configurator owns it now).
- **Editor — Figure `aspectRatio` / `crop` round-trip fix** — the editor's per-type config bridges (`propsToConfig` / `configToProps` in `EditorPropsPanel.jsx`) didn't know about Figure's new `aspectRatio` and `crop` props, so they were dropped when a Figure was selected or edited — the ratio/crop showed in the standalone configurator but not in the editor canvas or launched prototype. Both bridges now read and persist them. The bundled "Ember & Oak" sample content is refreshed (seed flag bumped to `…-v2`) so existing installs pick up the sample's Figure aspect ratios.

- **Editor — Projects** — the Editor now opens on a **Projects** home (also reachable from the Resources → Projects nav, and the top-nav **Editor** item is a dropdown with an "All projects" overview plus a direct link to each project): a grid of project cards (icon, name, description, page count, updated date) with create / rename / duplicate / delete (delete behind a confirmation dialog). Opening a project shows an **All pages** overview and a tabbed sidebar — **Pages** (a draggable `TreeMenu` of the project's pages with right-click add / edit / duplicate / delete-with-confirmation) and **Layers** (the existing component tree). Pages form a hierarchy by drag-and-drop; a page's **level (1–3)** is its nesting depth (capped at 3) and is also editable from the page's metadata form, which re-parents it. Selecting a page edits its **title, icon, description, and level**. A **TopHeader is auto-generated** from the hierarchy (dropdown menus for level-2/3 pages) and rendered above every page in the edit canvas, preview, and the launched prototype. Links and Buttons can target any page **within the same project** (the page-link selector is project-scoped); projects are otherwise isolated. Everything persists as JSON in `localStorage` (`a1-projects`, `a1-project-{id}-pages`, reusing the existing per-page `a1-editor-versions/history-{id}` content keys). The 3 built-in example pages migrate into an **A1 Showcase** project, and any pre-existing saved pages into a **My pages** project, on first load. New `src/projects/` module: `projectStore.ts` (data layer, level/move/migration, backup export/import), `projectNav.ts` (`buildProjectNav`), `ProjectsList.jsx`, `ProjectPagesPanel.jsx`, `ProjectWorkspaceSidebar.jsx`, `AllPagesView.jsx`. `EditorSidebar` was refactored to export `ComponentTreePanel` (the Layers tab body); the old single-page dropdown and per-page export/import were replaced by project-aware backup. `PageMetadata` gained an optional `icon`.
- **Editor — Projects: history navigation fix** — opening a project (or page) from the Projects/All-pages views now **pushes** a browser history entry instead of replacing the current one, so the Back button steps All Projects → project → page instead of skipping straight past the Projects list. The first sync after entering the editor still replaces (no spurious entry).
- **Editor — Projects: project home actions** — the All-pages view now shows a `Home › Projects › {project}` breadcrumb and **Edit** / **Delete** buttons for the project (rename reuses the shared create/rename dialog, now extracted to `src/projects/ProjectDialog.jsx`; delete is behind a confirmation dialog).
- **Editor — Projects: "Ember & Oak" sample project** — a complete, visually rich sample restaurant website is seeded into the Projects list once (idempotent, flag-guarded, never resurrected after deletion). Eleven pages across a 3-level hierarchy — Home, Menus (→ Dinner, Brunch, Drinks → Wine list), Reservations, About (→ Our history, Careers), Contact — so the auto-generated TopHeader shows nested dropdown menus. Exercises a broad range of components: gradient/inverse Section heroes, Figure photography, Card grids (hero icons + navigation cards), DefinitionList menus and hours, MessageBadge dietary tags, Banner notices, Accordion FAQs, Blockquote pull quotes, StepTracker, and full forms (reservation, contact, careers) with DateField/TimeField/NumberField/PhoneField/ChoiceGroup/CheckboxGroup. New `src/projects/sampleRestaurant.ts`; seeded via `ensureSampleProjects()` in `projectStore.ts`.

## 0.2.0 — 2026-06-15

- **Editor — inline markdown for Paragraph + heading marks on canvas** — the editor canvas now renders inline formatting instead of literal markup. Paragraph content supports inline markdown mapped to A1 inline elements: `**bold**` → `<strong>`, `*italic*` → `<em>`, `~~strike~~` → `<s>`, `==mark==` → `<mark>`, and `` `code` `` → `<Code variant="inline">`. Markers must hug non-space characters so stray asterisks (e.g. `5 * 3`) stay literal; `&`/`<`/`>` are escaped safely. Heading content that carries `HeadingMark` markup now renders the marks (and entity-decodes plain text) rather than showing the raw `<span>`/markdown. Paragraphs/headings that contain this markup are edited via the configurator; plain ones keep click-to-edit inline. Implemented in `pageRenderer.tsx` (`inlineMarkdownToNodes`, `renderHeadingRich`, `decodeEntities`).

- **Heading configurator — inline editing + heading marks** — the Heading component page preview is now directly editable: click the heading and type to change the text (two-way bound to the **Text** control). Selecting any part of the text reveals a small floating toolbar to wrap that selection in a `HeadingMark` — **Highlight** or **Underline** — toggling the mark off when re-applied. Rich content is stored as HTML on `config.children`; the snippet converts heading-mark spans back into `<HeadingMark>` JSX (with `variant="underline"` where applicable). New `.a1-web-editable-heading` / `.a1-web-heading-mark-toolbar` styles (tokenized) and a focus ring on the editable heading. `detail.Preview` uses the passed `setConfig`; Enter commits/exits and paste is forced to plain text so no foreign markup enters the heading.

- **Editor — two-way JSON editing** — the "Code snippet" tab now uses `Code editable` so the JSON can be edited directly in the browser. The "Live preview" tab re-renders on every keystroke; invalid JSON shows the parse error inline instead of crashing. `jsonString` state lives in `EditorPage` and is passed as `children` to the editable Code block so the textarea re-initializes correctly when switching tabs (TabPanel unmounts inactive panels). Removed unused `MessageBadge`, `RenderNode`, and `unsupportedExampleNode` imports/declarations from the page.
- **Editor — JSON-driven page renderer (proof of concept)** — added an "Editor" item to the topHeader and a new `/?page=editor` page that demonstrates the first A1 page-definition standard. A page is authored as a layout-first TypeScript object (`PageDefinition`) and shown two ways via Tabs: a **live preview** rendered into real A1 components, and the **strict JSON** form (`JSON.stringify(definition, null, 2)`). New `src/editor/` module: `pageTypes.ts` (the contract — `PageDefinition`, `PageMetadata`, `PageLayoutDefinition`, `PageRegion`, `ComponentNode`, `ComponentType`, `ComponentProps`, `ContentDefinition`, `A11yDefinition`, `ResponsiveDefinition`, `ActionDefinition`), `componentRegistry.ts` (the only renderable components — PageLayout, Section, Stack, Heading, Paragraph, Button, Card — typed against `ComponentType`), `pageRenderer.tsx` (maps nodes → components, resolves text via the A1 `useLabel` helper with per-node fallbacks, and renders a safe `role="alert"` fallback for any unregistered/arbitrary type such as `div`), and `examples/editorExamplePage.ts` (PageLayout → hero Section → two-card Section). Component `type` names match the exported A1 names exactly (locked contract); arbitrary HTML elements are not supported. Actions are declared in the schema (`navigate`/`openDialog`/`appAction`/`submitForm`/`externalLink`) but not yet wired — see the TODO in the renderer. Known PoC limitation: the preview renders the real `PageLayout`, which adds a second `<main>` landmark and is ≥100vh tall.
- **Stack style merge fix** — Stack now preserves its internal CSS variables when a `style` prop is provided, so custom preview styles no longer reset direction, gap, align, justify, or wrap.
- **Stack configurator** — added a dedicated Stack page configurator covering `as`, `direction`, semantic/numeric `gap`, `align`, `justify`, and `wrap`, with a bounded preview that makes axis, wrapping, and distribution changes visible.
- **Card configurator and auto width** — rounded out the Card configurator with element and navigation href controls. Card now fills its containing inline size by default, so the component detail preview no longer collapses to a narrow card when Container query is set to Auto.
- **Section screen-height gap fix** — `height="screen"` now pins grid content to the start so extra viewport height no longer stretches rows and inflates the apparent space between children; `gap` remains the selected token value.
- **Section border props** — added `borderSize`, `borderStyle`, and `borderVariant` to Section, reusing Divider thickness/style/tone tokens, plus a tokenized `radius` prop. Storybook controls/examples, property docs, and the a1-web Section configurator expose the new props. The component preview Display wrapper now defaults to a subtle bordered Section instead of a panel surface.
- **Section configurator** — added a bare-display Section config page with sample Heading and Paragraph content plus controls for element, surface, padding, gap, content width, alignment, height, gradient, and inverse. Because Section is the page wrapper itself, the outer Display controls are hidden.
- **Snackbar default-only style** — removed status variants and the public `inverse` prop from Snackbar controls/docs, changed the a1-web preview to launch from a button instead of rendering inline, and fixed the default Snackbar surface so it no longer renders white text on a white background.
- **Feedback configurators** — added configurable pages for Notification, Snackbar, Status Bar, Circular Progress, and Step Tracker. The Status Bar page keeps the existing `StatusBar` component naming and snippets.
- **Message split into Badge and Empty State** — replaced the old umbrella `message` component entry with a dedicated `badge` page for `MessageBadge`, kept `empty-state` as its own page for `MessageEmptyState`, updated the central component registry (`components.md`), and added configurators for both pages.
- **Banner configurator** — added `detail/banner.jsx` with controls for `variant`, `status`, `title`, body text, default/custom icon, action type (none/link/button), action label, and dismissible behavior. The preview can be dismissed and restored, while the snippet emits the matching `Banner` props and action element.
- **Inline Editable configurator** — added `detail/inline-editable.jsx` with a live, self-managing preview (InlineEditable is controlled, so the preview keeps a working copy that re-seeds from the configured value). Controls: `value`, `placeholder`, accessible label (`aria-label`), `multiline`, `disabled`, and a **Display as** selector (Text / Paragraph / Heading / Button) that renders the value wrapped in the chosen component. The wrapper carries matching typography tokens so the seamless edit field inherits the same font as the display content. Seamless now edits in place via the component's new contentEditable behaviour, so the editable is nested directly inside the real `Heading` / `Paragraph` / button and inherits all of its typography — no font hacks, and Paragraph/Heading/Text no longer resize when editing. In **Button** mode the wrapper is styled as a primary button and editing is always seamless, so the label is edited directly inside the button (and the button grows/shrinks to fit the text). Editing inline in the preview is two-way bound to the **Value** control — typing in the preview updates the Value field and vice versa (`detail.Preview` now receives `setConfig`). Also added the component's TypeScript types (`InlineEditable.d.ts`) and a Storybook entry covering single-line, multiline, placeholder, seamless, and disabled states.
- **Inline Editable `seamless` prop** — new component prop that renders the edit field with no box so editing is visually seamless; exposed as a Seamless toggle in the configurator.
- **Choice Group full width** — ChoiceGroup now fills the full width of its container (component change); no longer restricted in flex/grid parents.
- **Choice Group configurator** — added `detail/choice-group.jsx`: editable option list (label, subtext, icon via IconSelect, disabled per option, add/remove) plus controls for `label`, `hint`, `error`, `success`, `size`, `columns` (auto/1/2/3), `multiple`, `inlineIcon`, `hideIndicator`, and `required`. Snippet emits the `options` array.
- **Fieldset configurator** — added `detail/fieldset.jsx`: a simple grouped-fields example (Full name / Email / Company stacked, no FieldRow) with controls for `legend`, `size`, `labelPosition`, `markRequired`, and `surface`.
- **Field Row added to the docs** — registered Field Row in the component registry (`components.md`, Inputs category) and in a1-web (`data.js` card, packages, status, related). Added `detail/field-row.jsx` configurator showing side-by-side fields inside a Fieldset, with a Name / Address example switch and a size control.
- **Fieldset full width** — Fieldset now fills the full width of its container (component change).
- **Comfortable required marker** — the comfortable-size "Required" indicator across the field family and Checkbox/Radio/Choice group legends is now a small subtle info badge with no icon (component change).
- **No-uppercase rule for all agents** — added explicit guidance in `project-workflows.md` ("The law: never uppercase text" plus a Key Invariant) that text must never be converted to all-uppercase in any package — no `text-transform: uppercase` in CSS and no `.toUpperCase()` on whole strings; only first-letter sentence-casing of a single enum token is permitted. Removed the remaining shipped uppercase transforms (Calendar weekday header, PageNav heading, feature Blockquote citation, pure eyebrow + figure citation).

## v0.13.0

### Component detail page redesign

- **Tabs compact size** — added `size="compact"` prop to Tabs component for reduced padding (6px block, 8px inline) and xs font size. Applied to page-level tabs and config panel tabs for tighter visual hierarchy.
- **Tabs moved into header** — page-level tabs (Configure, Overview, Anatomy, Rules, Properties, Accessibility) now render inside the header Section with breadcrumb and heading, improving layout cohesion.
- **Breadcrumb and heading in ComponentDetailPage** — moved from Components index into ComponentDetailPage so the full header (breadcrumb, title, tabs) is co-located with the content.
- **Three-panel component detail layout** — the configuration controls now live in the PageLayout `aside` slot (right rail) rather than inside the Configure tab. Left: ComponentsSidebar. Center: breadcrumb, heading, tabs, and component display. Right: configuration panel (`a1-web-config-aside`), which mirrors the left SideNav — fixed width (`--component-page-layout-sidebar-width`), flush to the viewport right and bottom, with independent internal scrolling. The aside is only rendered on a component detail page's Configure tab. `detailTab` is lifted to the app shell so the aside slot can be conditionally mounted; `ComponentDetailPage` portals the controls into the slot via `getComponentsAside` / `createPortal`, keeping all config state local. Collapses below the center column at ≤640px.
- **Display tab surfaces from component** — Background options now read from actual Section component surfaces (`["page", "panel", "raised"]`) instead of hardcoded values. Removed invalid "sunken" option.
- **Padding "none" option** — added None option (with `layers_clear` icon) to padding choices in Display tab, matching Section's valid padding values.
- **Tabs Storybook Docs** — added `tags: ["autodocs"]` to Tabs meta and `argTypes` for variant/size/level with control options. Added Playground story with configurable controls for all variant types (line/pills/segment/progress/folder).
- **Per-component detail registry** — the bespoke per-component parts of the Configure tab (default config, preview, controls, code snippet) are extracted into `src/pages/components/detail/`. Each component with custom behaviour gets its own file (`heading.jsx`, `definition-list.jsx`); `detail/index.js` maps `component.id` → module and falls back to `detail/generic.jsx` for everything else. `ComponentDetailPage` is now a thin shell that resolves the module via `getDetailModule(component.id)` and renders `detail.Preview` / `detail.Controls` / `detail.Snippet` / `detail.getDefaultConfig`. Code snippets data moved to `detail/snippets.js`. No behaviour change.
- **Paragraph configurator** — added `detail/paragraph.jsx` with a live preview, controls, and code snippet covering every Paragraph prop: `as` (p/span/div), `size` (xs–xl), `color` (default/muted with swatches), `align` (left/center/right), and `textWrap` (default/balance). Mirrors the heading configurator's structure.
- **Blockquote configurator** — added `detail/blockquote.jsx` with preview, controls, and code snippet covering every Blockquote prop: `children` (Textarea quote), `cite` (TextField), `citeUrl` (TextField), and `variant` (border/filled/feature/minimal/accent/pull/ruled). Seeded with A1-themed sample copy.
- **List configurator** — added `detail/list.jsx`. Items are authored in a Textarea using Markdown-style lines (one per line; leading `-`, `*`, `+`, or `1.` markers are stripped) and parsed into `ListItem`s. **Indentation (two spaces per level) creates nested lists** — the parser builds an item tree, and the preview + snippet render nested `<List>`s inside `<ListItem>`s, exercising List's built-in multi-level bullet hierarchy. Controls cover `variant` (unordered/ordered/icon/divider), `icon` (shown only for the icon variant), `size` (xs–xl), and `color` (default/muted). Snippet emits semantic `as="ol"` for ordered lists and only the props the component doesn't auto-detect.
- **Divider line style split** — Divider now separates color tone from border pattern. `variant` covers `subtle`, `strong`, and `accent`; new `lineStyle` covers `solid`, `dashed`, and `dotted`, allowing combinations such as `variant="accent" lineStyle="dashed"` and `variant="subtle" lineStyle="dotted"`. Storybook, property docs, and the a1-web Divider configurator expose the split controls.
- **Inline Markdown configurator** — added `detail/inline.jsx` with an element ChoiceGroup and a Markdown-style textarea that maps prose markers into supported inline semantics: bold, italic, code, mark, keyboard, abbreviation, citation, quote, time, deleted/inserted/underlined text, small/sub/sup, sample/variable text, and muted/accent utility spans. Selecting an element loads a focused Markdown example into the textarea, and preview/snippet render the resulting inline elements inside `Paragraph`.
- **Link configurator** — added `detail/link.jsx` with controls for text, `href`, inherited or explicit size, inherited or explicit weight, optional Material Symbols icon, and icon position. Snippet generation omits inherited/default props.
- **Icon select helper** — added shared `detail/IconSelect.jsx`, backed by `system/icons/material-symbols.json`, so component configurators that expose an icon prop can select from the full Material Symbols registry. Generic, List, and Link configurators now use the helper.
- **Breadcrumb configurator** — added `detail/breadcrumb.jsx` with configurable child items. Users can add and remove breadcrumb items, and each item owns an Accordion panel for label, behavior, and href configuration. Preview and snippet generation cover linked ancestors, click-only ancestors, static ancestors, current page handling, and `backLabel`.
- **Container query preview control** — the Configure panel's Display tab now shows a Container query control for components that use CSS container queries. It can constrain the preview to `xs` (240px), `sm` (320px), `md` (480px), `lg` (640px), and `xl` (960px) widths. Added focused Card, ButtonContainer, and Calendar configurators so every current container-query component has a real preview to test.
- **SideNav configurator** — added `detail/side-nav.jsx` with controls for a configurable `header` (TextField), `placement` (start/end), `collapseButtonPlacement` (header/footer), and `collapsed`. **SideNavItems are fully configurable following the Breadcrumb pattern** — each item gets an Accordion panel for label, icon (toggle + IconSelect), badge, and active state, with add/remove and open-state tracking. The **footer** is its own Accordion (label + optional icon), separated from the item list by a `Divider`; an empty footer label hides the footer. Because SideNav owns its own surface, border, and full height, the module sets a new `bareDisplay` flag: the preview renders directly (inside a bounded `a1-web-side-nav-preview` frame) without the wrapping Section, and the Display tab hides the Section-related Background, Alignment, Padding, and Inverse controls. `detail/index.js` now passes `bareDisplay` through `getDetailModule`; when a `bareDisplay` component has no display options, the Display tab shows a short muted note instead. End placement is now visible in the standalone preview frame (`a1-web-side-nav-preview--end` justifies the nav to the right, since the `placement` prop alone only moves the border without a surrounding page layout). The preview also overrides the nav's `lg+` `position: sticky; height: 100vh` so it fills the bounded frame and its footer (and footer-placed collapse button) stay visible.
- **Tighter configuration panels** — reduced the spacing between top-level controls in every configuration panel (Configure and Display tabs) from `lg` to `md`. Scoped to each panel's own top-level Stack via `a1-web-config-panel__body > .a1-stack` and `a1-web-config-aside__tabs > .a1-tab-panel > .a1-stack`, so nested editors (per-item, footer) keep their own gap.
- **Tabs variant + size fixes (component)** — implemented the previously missing CSS for the Tabs `pills` and `segment` variants (they rendered as unstyled buttons before) and added compact padding for both, so `size="compact"` now has a visible effect across all variants. Added a `base.radius.pill` token (used by pills; `component.button.pillBorderRadius` now references it) and Pills/Segment Storybook stories. React package bumped to 0.12.2.
- **Fields: muted input mask text** — DateField/TimeField now render the native `mm/dd/yyyy` / `--:--` format placeholder in the muted text colour while empty (matching the already-muted Phone/Zip/Credit Card mask placeholders). Component-level change with a new `a1-field--mask-empty` modifier.
- **Form label token unification** — added `semantic.font.size.formLabel` (compact/default/comfortable) as the single source of truth for form-field label/legend size; Field, Checkbox Group, Radio Group, and Choice Group legends all reference it (no visual change — values already matched).
- **Removed uppercase transform** — dropped `text-transform: uppercase` from the settings "Alpha" badge in a1-web (per the system no-uppercase rule); configurator size/row labels already use sentence case.
- **Configurators: switches for booleans** — every on/off (and None/Icon, True/False) ChoiceGroup across the configurators was replaced with a shared `detail/Toggle.jsx` (a compact `Switch`), so boolean properties read consistently. The two kits (`fieldKit`, `groupKit`) and all per-component modules use it. Also replaced full-uppercase size/row labels (`SM`/`MD`) with sentence case (`Sm`/`Md`).
- **Textarea preview spans full container** — the Textarea configurator preview now fills the preview width via a `fillContainer` option on the field kit (`a1-web-field-fill`).
- **Textarea, Select, Checkbox Group, Radio Group configurators** — added detail modules for the remaining form inputs. **Textarea** reuses the field kit and adds `rows` (sm/md/lg/xl), `maxLength`, and `showCount`. **Select** has an editable option list plus label/hint/error/size/labelPosition/required/disabled. **Checkbox Group** and **Radio Group** share a new `detail/groupKit.jsx` factory (`createGroupModule`) — editable options (label, hint, selected, disabled, add/remove) plus legend/hint/error/size/inline/required/disabled; the kit handles multi-select (array `defaultValue`) vs single-select (string `defaultValue`, choosing one clears the others). Snippets emit the options array, `defaultValue`, and only non-default props.
- **Settings theme menu** — hid the Catlympics theme and added the Fresh theme. A previously-stored Catlympics selection falls back to Default (Catlympics is no longer in `VALID_THEMES`). Fresh applies the `a1-theme-fresh` class, consistent with the other themes.
- **Field split into individual components** — the single "Field" page was broken into the individual field-family components: **Text Field**, **Number Field**, **Date Field**, **Time Field**, **Phone Field**, **Zip Field**, and **Credit Card Field** (Select and Textarea were already separate). Each has its own registry entry (data.js: menu, packages, status, related), anatomy preview, properties table (shared `FIELD_BASE_ROWS` + per-type extras), and detail configurator built on a shared `detail/fieldKit.jsx` factory (`createFieldModule`). Text Field adds a `type` control (text/email/password); Number Field adds `prefix`/`unit`. components.md registry, menu hierarchy, and Storybook titles updated. The old `detail/field.jsx` was removed.
- **Fields: no active-state background (component)** — removed the background-colour change on the `:active` (pressed) state across the field family and Textarea; active now keeps only the border feedback.
- **Fields: autocomplete support** — `autoComplete` is now a first-class, documented prop forwarded to the native input across the field family. The configurators expose an Autocomplete control (with sensible defaults: Text Field `email`, Phone `tel`, Zip `postal-code`, Credit Card `cc-number`); TextField Storybook adds the control and an Autocomplete sign-in story; components.md documents it.
- **Compact Choice Group density** — compact ChoiceGroup label and subtext font sizes were each reduced one step (label → body-xs, subtext → new `body-2xs` token). Added `base.font.size.scale.50` (0.625rem) and `semantic.font.size.body.2xs`. React package bumped to 0.13.1.
- **Switch configurator** — added `detail/switch.jsx` with controls for label, hint, error, `size` (compact/default/comfortable), `labelPosition` (start/end), `checked`, and `disabled`. The preview stays interactive (uncontrolled toggle) and remounts via key when the Checked control flips so it reflects the default. Snippet emits `defaultChecked` when on and only non-default props.
- **Segmented Control configurator** — added `detail/segmented-control.jsx` with `size` (sm/md/lg), `fullWidth`, and an editable Tabs-style options list (Label + icon toggle/IconSelect, add/remove). The preview keeps its own selected value (falling back to the first option when the active one is removed). Snippet emits the options array plus a `value`/`setValue` controlled pattern.
- **Button configurator** — added `detail/button.jsx` with controls for label, `variant` (primary/secondary/tertiary/destructive/success), `size` (sm/md/lg), `icon` (toggle + IconSelect → conditional `iconPosition` start/end), `fullWidth`, `loading`, and `disabled`. Standard Section wrapper + Display tab. Snippet emits only non-default props.
- **Button `fullWidth` + `loading` props (component)** — added `fullWidth` (stretch to fill container; default natural width) and `loading` (spinner replaces the icon, button becomes inert with `aria-busy`, distinct from disabled; respects reduced motion) to the React Button. JSX, CSS, d.ts, Storybook (argTypes + Full width / Loading stories) all updated. React package bumped to 0.13.0.
- **Icon Button configurator** — added `detail/icon-button.jsx` with `icon` (IconSelect), accessible `label`, `variant` (tertiary/secondary/destructive/success), `size` (md/lg), and `disabled`. No `fullWidth` — IconButton is always natural square width (new system rule `icon-button-natural-width`). Snippet always emits `icon` + `label` (required) and only non-default extras.
- **PageNav configurator** — added `detail/page-nav.jsx`. A `Heading` field controls the nav label; sections are an editable Breadcrumb-style accordion list (Label + Level top-level/nested, add/remove). Each section's anchor `id` is derived from its label (with a stable internal key for React/open-state). Standard Section wrapper + Display tab (no `bareDisplay`). Snippet emits the label only when non-default and `level` only when nested.
- **Tabs configurator** — added `detail/tabs.jsx`. Top-level controls cover `variant` (line/pills/segment/progress/folder), `size` (default/compact), and `level` (1/2). **Tabs are an editable Breadcrumb-style list** — each tab is an Accordion with label, icon (toggle + IconSelect → conditional icon position start/above/end), `count` badge, and `status` (none/completed/error/warning, shown in the progress variant), plus add/remove. The preview keeps its own selected-tab state (falling back to the first tab when the active one is removed) and renders a TabPanel per tab. Tabs is a normal content component, so it keeps the standard Section wrapper and Display tab (no `bareDisplay`). The snippet emits only non-default props and a `value`/`setValue` controlled pattern. Status options were corrected to the states the component actually styles — Todo / In progress / Completed — instead of the unimplemented error/warning values.
- **TopHeader configurator** — added `detail/top-header.jsx`, mirroring the SideNav configurator. Top-level controls cover a configurable `logoText`, `navIconPosition` (start/above/hidden), and `loginButton` label (empty hides it). **Nav items are an editable Breadcrumb-style list** — each item is an Accordion with label, behavior (link/button → conditional href), icon (toggle + IconSelect), and active state, plus add/remove. A `Divider` separates the nav items from a second editable **actions** list (label = accessible name, IconSelect, badge), also with add/remove. Like SideNav it sets `bareDisplay` (renders without a wrapping Section, hides the Section-related Display controls); the preview sits in a bordered `a1-web-top-header-preview` frame and overrides the header's `position: sticky` so it renders in place.

## v0.12.1

- **ChoiceGroup spacing fix** — removed redundant `margin-top` on the items grid that was adding extra space on top of the flex container gap, causing the gap between the legend/hint and tiles to be double what other form fields use.

---

## v0.11.0

- **StickyActions component** — new React component that fixes a button group to the bottom of the viewport. Use it for onboarding flows, wizards, checkout, and any multi-step form where button position should not move between steps. Accepts a `contentWidth` prop (xs/sm/md/lg/xl/2xl) that mirrors Section's content width values — match it to the Section above for visual alignment. Always nest a `ButtonContainer` inside. Do not combine with `BottomDrawer` on the same screen. Includes `env(safe-area-inset-bottom)` padding for notch devices.
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
