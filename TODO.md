# A1 Design System — TODO

> Living backlog + idea space. Nathan drops items here in any form — a polished task or a one-liner like `TODO - add accounts later`. Agents formalize, classify,  prioritize, and check them off. Treat this as a notepad that's continuously kept tidy.

## How agents maintain this file

Do this whenever you touch the backlog (and skim it at the start of a backlog task):

1. **Triage the Inbox.** Turn each raw note into a one-line task. Infer a **Priority**
   (P0–P3) and **Effort** (XS–XL) from the content + any detail Nathan added, then move
   it into the matching band below. If a note is ambiguous, keep it in the Inbox and add
   a `_Q:_` line with what you'd need to know.
2. **Add detail when implied.** Name affected components/packages, add a sub-checklist
   for multi-step work, and note open questions or dependencies.
3. **Sort within each band** by effort — quick wins first — so the next pick is obvious.
4. **Re-prioritize continually.** As scope, dependencies, or new notes change things,
   move items between bands. Promote anything that's become a blocker; demote
   nice-to-haves. Merge duplicates; split anything too big to be a single task.
5. **Done = removed.** When an item ships, delete it (git history + the CHANGELOGs are
   the permanent record). Don't leave checked-off items lingering here.

**Priority:** `P0` critical / blocking · `P1` high · `P2` medium · `P3` low / someday.
**Effort:** `XS` <30 min · `S` a few hours · `M` ~a day · `L` multi-day · `XL` project.

Format: `- [ ] **Title** \`P# · Effort\` — description. _Notes / open questions._`

---

## Inbox — untriaged

_New raw notes land here; an agent triages them into the bands below._

## P0 — Critical / blocking

_None._

## P1 — High

_None._

## P2 — Medium

- [ ] **TopHeader configurator — child / flyout nav items** `P2 · M` — the a1-web TopHeader
  configurator only edits **flat** links; it can't add a **parent with children** (the dropdown/flyout)
  or mark a child active. Add child-item editing so flyouts (and the selected-parent state) are
  demonstrable in the configurator, not just in Storybook / the editor's auto-generated project nav.
- [ ] **Fix left sidebar collapse** `P2 · S` — the collapse/expand behaviour of the left sidebar
  is broken. _Q: which sidebar — the editor workspace sidebar (Pages/Layers) or the main site
  SideNav? Repro + expected behaviour._
- [ ] **Complete component Properties tables + prop reconciliation** `P2 · L` — follow-up to the
  coverage audit (first pass done). Finding: **67** components have a configurator but only **56**
  have a dedicated Properties table (~11 fall back to generic). Write the **missing Properties
  tables**, reconcile each component's **root + child props** across the MD registry / configurator
  / Properties tab / Storybook, and flag which components lack **Pure / Native** coverage.
- [ ] **Component implementation hardening (forwardRef / memo / TS)** `P2 · L` — the public API surface
  (`.d.ts`) is clean, but the **implementation** has gaps worth paying down: components are authored in
  **`.jsx` with hand-written `.d.ts`** (not `.tsx` — no compiler-enforced strictness on the impl); only
  **~4 of 62** components use **`forwardRef`** (so `ref` forwarding is unsupported on most, incl.
  `Button`); **0** use `React.memo`. Audit + add `forwardRef` across interactive components, memoize
  where it matters (lists/large trees), and decide on real type safety (migrate impl to **TSX**, or
  enable `checkJs` + strict on the `.jsx`). _Quality/debt — the clean API can hide this._
- [ ] **Card — image variant (replace hero icon)** `P2 · M` — a Card header that uses the
  same space as the hero-icon block but shows an **image** instead (e.g. `heroImage`). DS
  Card change + configurator. _Also in the original "General changes" backlog._
- [ ] **Card — image hero (`heroImage`), redo** `P2 · M` — a full-bleed **image** in the card hero
  slot (instead of the hero icon). A first pass was built then **backed out** — the **display wasn't
  as expected** (image sizing/crop in the top-band vs lg left-strip needs work). Redo the DS Card
  `heroImage`/`heroAlt` prop + CSS so it renders cleanly at all container widths, and re-add the
  configurator control using the **`ImageSourceField`** helper (already created at
  `apps/a1-web/src/pages/components/detail/ImageSourceField.jsx` — the shared Figure image-adding
  pattern) + a Storybook story. _Pairs with the Card badge-in-hero item below._
- [ ] **Section — wider background colours / surfaces** `P2 · M` — expand Section background
  options beyond page / panel / raised (more tokenised surface colours / tints). New semantic
  surface tokens + Section surface options + configurator. _Q: which palette — status tints,
  brand tints, full ramp? (same idea was raised for Card surfaces.)_
- [ ] **Search components & patterns (a1-web)** `P2 · M` — search across the component browser
  **and** patterns: highlight matches, a dedicated search input, a clear-input affordance, and an
  **AI search** field. **Smart, prioritized ranking** with an **alias/synonym lookup table**
  (e.g. Button → "action", "CTA"). _Consider making the search input + clear pattern a reusable
  DS control; relates to the Icon-picker search-ranking item._
- [ ] **Image library — categories as a first-class object + editor** `P2 · M` — model image
  categories as their own object/store; images pick from existing categories and add new
  ones (the Autocomplete `allowCreate` UI already does this); add a simple **category editor**
  as a DataTable view in the Image Gallery. _The Autocomplete component (single + multiselect,
  allow-create) already exists and is already used for image-library tagging — this is the
  data model + editor._
- [ ] **Toolbar — value-stepper sub-component** `P2 · M` — a new tool showing a value in
  the middle with decrement/increment icons either side that step it along a scale
  (numbers like font sizes, or t-shirt sizes). _Configurable left/right icons; fixed,
  configurable display-area size; display area renders an icon **or** text._ DS sub-component
  + configurator + snippet.
- [ ] **Accordion — `subtext` show-on-close-only prop** `P2 · M` — add a prop so subtext
  shows **only while collapsed**; default it **off** so subtext is always shown (open +
  closed). This inverts today's behavior (subtext is currently collapsed-only always).
  Migrate existing subtext usages (e.g. Section configurator group summaries) to the new
  prop to keep their collapsed-only behavior. DS + consumers.
- [ ] **Button — split-button child config** `P2 · M` — let the configurator edit the
  split button's dropdown actions (child items), and make "Split" its own toolbar / child
  editor (like the Toolbar & SegmentedControl item editors).
- [ ] **Icon picker — search ranking + scenario subtext** `P2 · M` — rank icon search so
  the obvious match surfaces first (typing "add" lists the `add` icon first), using
  `system/icons/icon-usage.md` to promote; add subtext for known scenarios from the rules.
  Needs Autocomplete result ranking (today it's plain substring filter) + option subtext.
- [ ] **Heading — replace `jumbo` with `2xl`/`3xl` sizes** `P2 · L` — rename the display
  size scale to t-shirt sizes (…`xl`, `2xl`, `3xl`) and drop the `jumbo`/`xJumbo` concept.
  Ripples: Heading tokens / jsx / d.ts / stories, configurator, consumers, `updates.md`.
  _Icon has the same jumbo/xJumbo size concept — decide whether to align it too._
- [ ] **Expand helper text to all configurator props** `P2 · L` — the Helper-text toggle +
  `WithHelp`/`helper` are wired into the shared kit; now add a short `helper` summary to
  every property across all ~30 configurators (seeded so far: Section, Button, IconButton).
  Mechanical but broad.
- [ ] **Pattern variants** `P2 · L` — let a single pattern define named (or `sm`/`md`/`lg`)
  variants — **minor variations** of one pattern from one data set. Covers both **data density**
  (show/hide pieces; e.g. vehicle details adapting to scenarios) and **minor prop variations**
  (e.g. page headings rendered at different levels). Manually selected. Needs a variant concept
  in the pattern model + per-piece visibility / per-variant overrides + a selector. a1-web
  patterns. _Consolidates the earlier "data density" and "states/scales" notes._
- [ ] **Pattern repeating (count + AI content)** `P2 · L` — let a pattern **repeat**: type a
  number of items and it auto-adds/removes instances (e.g. DataTable rows, or a repeated menu
  item). Optionally **auto-generate the repeated content via the AI API**. Needs a repeat
  concept in the pattern model + a count control + AI content gen. a1-web patterns. _Sibling of
  Pattern variants (data density)._
- [ ] **Filter component (standalone)** `P2 · L` — extract DataTable's filtering into a
  reusable **Filter** component that filters by **multiple properties**; keep an easy built-in
  filter config on DataTable, ideally backed by the same component. Plus a **single-property**
  mode where each option is exposed (visible chips / segments for one property's values). New
  DS component + DataTable refactor. _Overlaps the Data Table editor item._
- [ ] **Data Table editor** `P2 · L` — a real DataTable editor in a1-web (the original
  "DataTable needs an editor"). **Select a column** to reorder it and edit its props
  (sortable / filterable / search-by); **column components** (slot-like — allow specific
  components to render in a column); **inline-editable** cells. DS DataTable changes (column
  render slots + inline edit) + configurator. _Overlaps the Filter component item._
- [ ] **Editor — rename items in the tree menu** `P2 · S` — rename nodes from the editor tree.
  _Verify: pages already rename; this may be about the Layers / component tree._
- [ ] **Codebase control on all configs + property panels** `P2 · M` — the React / Native / Pure
  **/ JSON** "Codebase" (viewAs) control is currently only on Button; extend it to every
  configurator and the property panels (incl. a **view-as-JSON** tab).
- [ ] **Editor — copy & paste a selection** `P2 · M` — copy/paste a selected node (or subtree).
- [ ] **Inline — formatting toolbar configurator** `P2 · M` — an Inline configurator with a
  toolbar controlling bold / italic / etc.
- [ ] **Figure — crop per breakpoint** `P2 · M` — let Figure `crop` / `cropRect` vary by
  breakpoint (extends the per-breakpoint pattern that already exists for simple props).
- [ ] **Page Layout — real components in slots** `P2 · M` — render real TopHeader / SideNav etc.
  in the PageLayout configurator/editor slots instead of placeholders. _Shell is already a real
  PageLayout; verify which slots still use stand-ins._
- [ ] **Preview display modes — theme / colour-scheme / contrast / reduce-motion** `P2 · M` —
  add toggles to the preview display toolbar for theme, colour scheme (light/dark), high
  contrast, and reduced motion (alongside the existing responsive-viewport control).
- [ ] **Form submit — required-field validation + page states** `P2 · L` — real submit behaviour
  in preview: trigger missing-required errors on the actual required fields (error variant), and
  on success navigate to another page (next onboarding / verification step). _Part of the
  Interactivity / states work._
- [ ] **SideNav → Side Panel** `P2 · L` — refactor SideNav into a Side **Panel** configurable on
  **both left and right at once**; deprecate SideNav; update the a1-web component list + editor.
  _Relates to the Panel-component idea (replace sidebar)._
- [ ] **Per-breakpoint component swap (editor)** `P2 · L` — swap a component for another at a
  given breakpoint (e.g. an IconButton instead of a Button at xs). Beyond per-breakpoint prop
  values (already built) — this swaps the element itself.
- [ ] **Responsive sticky positioning (sticky by breakpoint)** `P2 · M` — let an element be made
  **`position: sticky`** and gate it **per breakpoint** (e.g. sticky a page title only at **lg and
  up**, like the existing responsive-prop pattern: `{ lg: true }`). Needs a `sticky` prop/utility +
  a **sticky-offset token** (top inset, so it clears a sticky header) on a layout component (Section /
  Stack / a small `Sticky` wrapper), with breakpoint-scoped sticky classes. _Caveat: sticky needs a
  scrollable ancestor without `overflow: hidden` (see the PageLayout/PageNav sticky notes). Pairs
  with **vertical breakpoints** below — only stick when there's enough vertical room._
- [ ] **Dialogs as pages (editor)** `P2 · L` — treat dialogs as first-class documents in the
  page editor (like pages) and **open them from buttons** via the same page-connection
  mechanism used to link pages. _Builds on the existing page-link / navigation wiring + Dialog._
- [ ] **Patterns — guidance, tags & AI rules** `P2 · M` — remaining gaps on the shipped pattern
  system (create-from-selection, per-prop/portion locks, project scoping, `category`,
  drag-into-page, locked-marked, Patterns workspace, Templates→Patterns rename all done): add
  **comments/guidance** for the whole pattern and per-portion (shown in the configurator on a
  selected instance); **tags** (on top of the single category); and **AI-generated rules** for a
  pattern as a starting point. _Verify the workspace Edit/Preview/Code modes are complete._
- [ ] **Button / IconButton — action-type control** `P2 · M` — a toolbar (like the responsive
  per-prop control) to set the action: **link to page / dialog**, **link to URL**, or **trigger
  action** (Snackbar, Menu, open a Dialog, …). Dialogs can **link to an existing one or be
  created on the fly**. Page/URL links already exist via PageLinkField; this adds dialog links +
  trigger-actions. _Relates to Dialogs-as-pages + Interactivity / states._
- [ ] **Inline guidance / linter (editor)** `P2 · M` — smart inline guidance: a linter that
  reads the page JSON and checks it against the **rules**, plus runs an **axe a11y** pass on the
  page, surfacing issues live. _Extends the existing import-time `lintDefinition`; relates to
  Rules-in-editor + A11y review._
- [ ] **Rules → real enforcement (ESLint plugin + CI gate)** `P2 · L` — today the rules engine is a
  **documentation layer**: `system/rules/*.yaml` + the a1-web Rules page + the non-blocking
  import-time `lintDefinition` warnings. Make rules **enforceable on real code**: ship an
  **`eslint-plugin-a1`** with rules derived from the YAML (e.g. `button-single-primary-action`,
  no-`text-transform: uppercase`, no raw hex / tokens-only, nested-interactive-in-card) and wire it
  into **CI** as a gate. The YAML stays the source of truth; codegen the ESLint rules from it where
  feasible. _This is the "transformative" path: same rule as lint/CI, not just docs. Pairs with the
  editor linter above._
- [ ] **Project chrome / TopHeader editing** `P2 · M` — better editing of a project's shared page
  chrome and **TopHeader**. _The per-project shared layout (TopHeader + Outlet + footer, edited on
  canvas) + auto-nav already exist — this improves that experience._
- [ ] **Conditional logic editor (if/else)** `P2 · L` — simple logic for prototyping: e.g. "if
  field A and B are filled, show field C". A lightweight conditions layer over fields/elements.
  _Sibling of Interactivity — states & Form-submit validation._
- [ ] **Standalone Menus / Context Menus in the editor** `P2 · M` — add Menu and ContextMenu to a
  page in the editor and **wire their items to actions / pages / dialogs**. _Relates to Button
  action-type + Dialogs-as-pages + Interactivity._
- [ ] **Select related / similar elements (multi-edit)** `P2 · M` — select an element and have the
  editor pick **structurally similar** siblings so you can **multi-edit** them at once.
- [ ] **Toolbar — small buttons + label-below variants** `P2 · S` — Toolbar tools in a smaller
  size, with optional **label below** the icon (and without labels). _Selects are already covered
  by `ToolbarMenu`._
- [ ] **Upload component** `P2 · M` — a file-upload component (button + drag-and-drop dropzone,
  progress, file list). New DS component. _The image library already has bespoke upload UI — this
  generalizes it into a reusable component._
- [ ] **Per-component a11y reports (published)** `P2 · M` — run an a11y report for **each**
  component and publish it on the component's page, with a "report issue → fix context" affordance.
  _Builds on the existing axe / `reports/a11y.json` + Accessibility page._
- [ ] **Break component detail pages into per-file modules** `P2 · M` — split each detail page
  into its own file under `src/pages/components/details/` (maintainability).
- [ ] **Generalized child add/remove editor pattern** `P2 · M` — for any component with children,
  a standard add/remove/reorder editor (each child an accordion/tab item). _Generalizes the ad-hoc
  Slider / SegmentedControl / Toolbar item editors._
- [ ] **Button Container configurator** `P2 · M` — add/remove items with individual control,
  switch each between Button and IconButton, and reconcile `fillButtons` (→ `fillButtons`).
- [ ] **Switch — iOS-style row variant** `P2 · M` — label left-aligned / switch right-aligned,
  width-limited via container query.
- [ ] **Code — selectable readonly textarea** `P2 · S` — render the Code block so text selects
  freely (tab to it, cmd+A to select all) while keeping the current styling.
- [ ] **List — per-item configurable icon** `P2 · S` — each list item can set its own icon (not
  just the parent).
- [ ] **Form fields — read-only still autofills (bug)** `P2 · S` — read-only fields still accept
  input via browser autofill; they shouldn't.
- [ ] **Display tab — reset + sticky tabs** `P2 · S` — add a Reset button to the Display tab (like
  Config); make the config-panel tabs stick to the top while content scrolls.
- [ ] **Inline Editable — edit the real component inline** `P2 · M` — stop mimicking styles with
  spans; edit the actual component in place (and allow marks like headingMark on a selection).
  _Relates to the inlineEditable selection bug._
- [ ] **Component a11y tab — structure-focused report (Heading first)** `P2 · L` — for a design
  system the a11y tab should report **document structure, hierarchy, readability, and whether
  visual hierarchy matches semantic hierarchy** (not interaction). Heading: native element,
  independent semantic-level vs visual-size, outline/level-nesting, heading-text quality (WCAG
  2.4.6), contrast per colour variant, zoom/reflow/text-spacing, i18n, + a WCAG criterion table.
  _Detailed spec provided — save it under `/ai` when building this._
- [ ] **Path-based router for a1-web** `P2 · L` — replace the `?page=…` query-param routing with a
  readable path hierarchy (e.g. `/resources/todo`, `/components/button`). Touches `getPath` /
  `navigate` / history / deep-links across the app.
- [ ] **Tabs — bind to the bottom of a Section** `P2 · M` — option to attach a Tabs strip flush to
  the very bottom edge of a Section, ignoring the Section padding. DS (Tabs / Section).
- [ ] **Rules editor — examples (code + images)** `P2 · M` — let a rule include illustrative
  **examples**: small code chunks and/or **images** (paste an image to upload). Extends the Rule
  editor (`pages/RuleEditor.jsx`).
- [ ] **Display toolbar — alignment override** `P2 · S` — add an alignment control (left / center /
  right / none) to the configurator's centre-panel Display toolbar, to better test components that
  benefit from it (and as an alternative to `bareDisplay` for fullWidth testing).
- [ ] **Retain component configs in localStorage** `P2 · M` — persist each component's configurator
  settings so they're remembered when you leave and return to the page.
- [ ] **Standard MD ↔ A1 converter** `P2 · L` — one standard way to write and read formatting in MD
  files, rendered to display via **A1 components** (inline elements as the baseline). Powers the
  Rich Text Editor, release-notes display, and the TODO page — replacing the current ad-hoc
  per-page markdown parsers. _Relates to Markdown-in-JSON, the MD component, and the RTE._
- [ ] **Per-package release notes + overview** `P2 · L` — split release notes **by package/app**,
  each with its own version: a **release overview** page of cards (one per package/app — name,
  basic details, current version) that navigate to a **per-package detail** page. Reads each
  package's CHANGELOG (a1-web, react, …). _Expands the current single Releases page; relates to the
  MD↔A1 converter._
- [ ] **TODO page → backlog tool (Supabase-backed, lightweight Jira)** `P2 · XL` — evolve the
  read-only TODO page into a real ticketing tool, replacing the `TODO.md`-rendered page:
  - **Supabase-backed store** (a `backlog_items` table; not the MD file) — add / edit / complete,
    change **priority + size** inline, **scope** each item to a theme / project / pattern / foundation
    / component / package, link to related details, attach **images**.
  - **"Request a feature" form across the app** — a simple add-to-backlog affordance surfaced in
    Components, Projects, Patterns, and Themes (and elsewhere), **pre-scoped** to wherever it's opened.
  - **Track requester + status** — record **who requested** each item (the signed-in user), created /
    updated timestamps, and a **status** workflow (e.g. backlog → in progress → done).
  - **Local pull** — a way to export/sync the tickets down to the repo so items can be worked on
    (fixed / built) locally by an agent or dev.
  - **Board view** — a lightweight Jira: **streams / swimlanes** of tickets, move items between
    statuses.
  - **Clarifying-question threads** — a ticket can carry a back-and-forth: a maintainer (or agent)
    asks the **requester** a clarifying question ("can you give more detail about what this component
    does?"), and that question lands in **the requester's queue** to answer. A lightweight per-ticket
    comment/Q&A thread with an "awaiting requester" status. _Builds on the Supabase shared workspace +
    auth (requester = signed-in user) + the complexity-badges/filtering work + the image library;
    relates to data binding._
- [ ] **True live co-editing of a single page (CRDT)** `P2 · XL` — real-time multiplayer editing of the
  same page, like Figma/Linear: concurrent edits **merge** instead of last-write-wins. Model the
  `PageDefinition` node tree as a **CRDT (Yjs)** — `Y.Map`/`Y.Array` — edited through the editor, with
  Yjs `UndoManager` and **awareness** (live cursors/selections). Transport options: **Liveblocks** or
  **PartyKit** (managed, Yjs-native, least infra — recommended) / **Yjs + Supabase Realtime broadcast**
  (no new vendor) / **Hocuspocus** (self-host); periodically snapshot the Yjs doc to Supabase. Requires
  refactoring the editor to read/write the Yjs doc as the source of truth (node tree, props, history).
  _The proper successor to the presence + safe-re-hydrate interim (#1, shipped). Skip OT — CRDT is
  preferred. Pairs with the shared workspace + cloud sync._
- [ ] **Edit-history follow-ups (theme viewer + pruning)** `P2 · M` — the shared, attributed
  `edit_history` (Supabase) now backs **page** and **pattern** history (the editor History panel shows
  who changed what, with restore), and **theme** edits are **logged** but have **no viewer** (the theme
  editor has no history panel). Add a **theme history panel** (view + restore + user tag), and add
  **retention/pruning** for `edit_history` (each entry stores a full snapshot, so the table grows —
  cap per entity or age-out). _Follows the shipped history feature; relates to the backlog tool._
- [ ] **Publish a prototype as a public site (outside the auth gate)** `P2 · M` — let a project's
  **preview/prototype** be published to a **public URL that bypasses the invite-only auth gate**, so
  it can be shared without an account. Same render as the standalone prototype preview, but served
  outside `AuthGate`. _Q: per-project publish toggle + a public route (e.g. `?share=<id>` / a
  separate entry) that mounts the prototype without the gate; where do public viewers read the page
  JSON from — a public Supabase read, or a baked/exported static bundle? Builds on the new auth gate
  + standalone prototype renderer._
- [ ] **Editor → Projects menu: Create new** `P2 · S` — add a "Create new" option to the top-nav
  Editor → Projects menu that opens the create-project dialog.
- [ ] **Grid — vertical stretch** `P2 · S` — add a way to make grid items stretch vertically (e.g.
  equal-height items / fill the row height) — an `alignItems` / stretch option on Grid (DS).

## P3 — Low / someday

- [ ] **Button — distinct primary/tertiary variant icons** `P3 · XS` — the variant picker
  uses `star` (primary) vs `star_outline` (tertiary), which read similarly at small size;
  pick clearly distinct glyphs.
- [ ] **Component list — A–Z view toggle** `P3 · S` — add a view control on the components
  list to show a flat A–Z list (no categories); persist the choice in localStorage.
  a1-web only.
- [ ] **Card — subtle hero style** `P3 · S` — a lower-emphasis variant of the hero-card
  style. _Pairs with the Card image / badge-in-hero items._
- [ ] **Figure — overlay** `P3 · M` — an overlay on a Figure (e.g. a gradient scrim and/or
  content layered over the image). _Q: gradient scrim, text/caption overlay, or arbitrary
  content?_
- [ ] **Image lightbox** `P3 · M` — click an image (Figure / image library) to open it
  full-screen in a dimmed overlay; Escape / click-out to close, optional zoom + prev/next
  across a set. Use the top layer per the z-index rules (Dialog/Popover). _Q: standalone DS
  component vs a Figure opt-in (`lightbox`)?_
- [ ] **AI Chat component** `P3 · M` — a reusable AI chat surface with a **lighter overall
  tone** and a **loading bar for the "thinking" state**. _A reference image was attached but
  not captured here — re-share it (or save it into the repo) for the exact look._
- [ ] **Signature input** `P3 · L` — a signature pad: draw with finger or mouse (canvas),
  captured as an image / data-URL ("fake signature" for demos). New component.
- [ ] **Universal pages & flows** `P3 · L` — a library of predefined, best-practice (but
  still editable) pages and flows: **404 / error pages**, **maintenance / under construction**,
  **access denied**, and universal **flows** like **log in / sign up** — out-of-the-box in
  a1-web. _Relates to User accounts (auth); these are the page/flow templates._
- [ ] **Rich Text Editor** `P3 · XL` — net-new component: a toolbar + inline-editable area
  that formats text via DS components (Paragraph, Link, Heading, Inline). Includes
  keyboard-shortcut support, a context menu (especially on selected text), and **output as
  MD / JSON / React / Pure**. _Depends on building the RTE component first; relates to the
  MD↔A1 converter + Codebase-output work._
- [ ] **AI-flow → A1 rebuild + ZIP import/convert** `P3 · XL` — experiment: take an
  AI-generated flow/app and **rebuild it with A1 components while retaining functionality**;
  and support **uploading a project as a ZIP** and converting it into the A1 project /
  page-definition format. Feasibility test + import pipeline. _Relates to the page-definition
  standard + project import._
- [ ] **Interactivity — states, triggers & functions** `P3 · XL` — let pages, forms, and
  elements carry **states**: forms have standard states (error, success) + custom ones;
  **buttons / form elements / toolbars initiate states**; states can trigger other behaviour;
  **whole pages** have states (empty, error, …). Includes simple **functions** wiring — e.g. a
  toolbar control that turns a part of a page on/off. A state-machine + event layer for the
  a1-web editor / prototypes. _Large: needs a state model + trigger/event wiring + per-state
  visibility._
- [ ] **Export project → React package / standalone site** `P3 · XL` — figure out the
  design→prod path: export an a1-web project as a downloadable **React package** (zip) and/or
  a simple **standalone website**. The complement of the import item (AI-flow / ZIP → A1).
  _Strategy + codegen; decide the output shape (component package vs static site)._
- [ ] **User accounts** `P3 · XL` — add accounts to the site (a1-web): sign-up, login, and
  persisted per-user state — likely via **Supabase** (auth + data storage). Major future
  enhancement; no current consumer. _Q: which surfaces need it (editor projects, image library,
  themes?)._
- [ ] **Rules tab — table layout** `P3 · S` — optimize how component rules display (e.g. a
  table) instead of the current layout.
- [ ] **Feature set page (a1-web)** `P3 · M` — a maintained "feature set" surface in a1-web,
  updated as features ship. _Process + page._
- [ ] **Plugin — React Aria DnD (keyboard drag-and-drop)** `P3 · M` — adopt React Aria's
  drag-and-drop for keyboard-accessible reordering (could upgrade the TreeMenu DnD, which has no
  keyboard support today).
- [ ] **Plugin — Joyride (walkthrough / onboarding)** `P3 · M` — product walkthroughs and tours.
- [ ] **Animations + AI-described motion** `P3 · L` — bring motion to the editor via an animation
  package (e.g. **Motion for React**), and let users **animate features by describing them in plain
  language** (AI → animation config applied to the selected node(s)). Worked example: *"animate these
  cards when they scroll into view, one at a time, with a fade and reveal from below"* →
  scroll-triggered **staggered** fade + translate-up. Cover enter / scroll-into-view / hover / state
  transitions; respect `prefers-reduced-motion`; emit tokenized durations/easings (motion tokens).
  _First target: the scroll-in card stagger. Pairs with the **Animation editor** (visual authoring)
  below + the AI page editor._
- [ ] **Plugin — Recharts (data viz)** `P3 · L` — charts / data-visualization integration.
- [ ] **Plugin — TanStack (data grids)** `P3 · L` — advanced data-grid integration.
- [ ] **Expand codebase output + web-component proof** `P3 · L` — broaden the "Codebase"
  targets; build a **web-component Button** to prove out a Web Components output.
- [ ] **Data sets — predefined + custom editor** `P3 · L` — predefined datasets (users, medical
  records, vehicle data) + a custom data editor to create/manage datasets and **import from a
  JSON feed**. Pulled into pages like components: **drag a dataset onto a compatible element
  (e.g. a DataTable) to auto-configure**, and **patterns can receive a dataset**. Feeds Data
  binding. _Relates to Pattern repeating + Data Table._
- [ ] **Animation editor (with timeline)** `P3 · XL` — in-editor animation authoring, including a
  **timeline editor** (keyframes/tracks, scrub, per-element sequencing) for orchestrating motion.
  _Relates to the Animations + AI-described motion plugin._
- [ ] **Icons — allow all Material Symbols styles** `P3 · M` — let any Material Symbols **style** be
  used: the three families (**Outlined / Rounded / Sharp**) plus the variable-font axes already partly
  in `Icon` (`fill`, `weight`, `grade`, `opticalSize`). Surface family selection in the `Icon` API +
  configurator; ensure the right font(s) are loaded. _`Icon` already takes weight/grade/fill/opsz;
  this adds the family dimension._
- [ ] **Icons — custom icon set (feasibility + pipeline)** `P3 · L` — research/plan a **custom A1 icon
  set**: what's the source format (SVG sprite / icon font / per-icon components?), how icons are
  authored and added to `system/icons/`, and how they adapt **across themes** (currentColor + size
  tokens; per-theme overrides if needed). Extends the single `system/icons/material-symbols.json`
  registry rather than package-local lists. _Decide build pipeline + whether custom + Material can
  coexist. (Answers "what's the source, how do we create them across themes, can I do this.")_
- [ ] **Gradient editor (approved ramps)** `P3 · M` — a visual gradient builder that composes
  gradients **only from approved theme colour ramps** (no arbitrary hex), emitting tokenized gradient
  values. Feeds Section/Figure gradients + the component designer. _Relates to the "gradient maker"
  future-idea + Section gradient props._
- [ ] **Billboard creator** `P3 · L` — a way to author large **promotional areas** (hero billboards /
  marketing blocks) — big imagery + headline + CTA over Section/Figure with gradient scrims, layered
  content, and approved tokens. _Relates to Figure overlay + the gradient editor + Section._
- [ ] **Data binding / connections** `P3 · XL` — attach a **data model** to a component or
  pattern; **drag labels/fields** into slots (data cells / columns); **auto-build** UI from a
  dataset (e.g. a form that conforms to the schema). _Pairs with Data sets; relates to Pattern
  repeating + Data Table editor._
- [ ] **Flow editor / project flow canvas** `P3 · XL` — a visual project view: **group pages
  into flows**; each page lists its **actions**, which link to other pages via **node connectors**
  (pull from the Priority Guide); add **universal elements** (TopHeader / footer); **infinite
  canvas** with **zoom**; distinct icons for pages / dialogs / page-states. Functional overview +
  navigation. _Pages-tree → auto TopHeader nav already partly exists; relates to page connections,
  Dialogs-as-pages, Priority Guide._
- [ ] **Priority Guide — editor + AI breakdown/promote** `P3 · XL` — pull the Priority Guide
  functionality (today an example) into a1-web as an **editor**; **break existing pages into
  priority guides**, and **promote a guide into a full page via AI**. _Relates to the AI page
  editor + page-definition standard._
- [ ] **Home page — reposition toward design + AI** `P3 · M` — enhance the a1-web home page:
  surface updated features and shift the framing from "design system" toward "design & AI
  solutions". _Messaging + layout; pairs with the Feature-set page._
- [ ] **Foundations — verify all colour values display** `P3 · S` — audit the Foundations colour
  surfaces so every token value is shown.
- [ ] **Vertical (height) breakpoints** `P3 · M` — add a **height axis** to responsiveness alongside
  the existing width breakpoints (xs–xl): height breakpoint tokens + `@media (min-height/max-height)`
  utilities, and **container `block-size` queries** (`container-type: size`) for component-level
  height response. Use `dvh`/`svh`/`lvh` units for dynamic viewport height. Use cases: compact
  layouts on short/landscape viewports, and gating **responsive sticky** on enough vertical room.
  _Feasible — CSS supports height media + container size queries. Decide token scale (e.g. short/
  tall) and how it composes with the width breakpoints (avoid a combinatorial explosion of classes)._
- [ ] **Markdown support in page JSON** `P3 · M` — author rich text as **markdown** within the
  page JSON (rendered to A1 typography). _Relates to the Rich Text Editor._
- [ ] **Better anatomy visualisation** `P3 · M` — a "Show anatomy" switch overlaying dashed
  outlines on target areas with padding/margin colours (widths, wrapping) — retire the separate
  Anatomy tab.
- [ ] **Preconfigured examples / sticker sheets** `P3 · M` — a tab of pre-built component recipes
  (common examples) with code snippets, like Storybook stories.
- [ ] **In-app helper chatbot** `P3 · L` — an assistant that knows how the site works, can
  **navigate you to a page**, and help with a task. _Relates to the AI Chat component._
- [ ] **Resizable editor panels** `P3 · M` — drag-resize the editor side panels.
- [ ] **Help page screenshots** `P3 · S` — add screenshots to the Help pages.
- [ ] **Help page — use PageNav instead of buttons** `P3 · S` — the Help page navigates between
  sections with buttons; replace that with the **`PageNav`** component (sticky in-page nav with
  active-section tracking), matching the TODO/long-tab pattern. a1-web `pages/Help.jsx`.
- [ ] **Video walkthroughs — prompt-to-MP4 pipeline** `P3 · L` — generate narrated video
  walkthroughs of features/flows from a prompt + a declarative spec. Pipeline:
  - **`walkthrough.yaml`** — the steps to demo (authored, or AI-generated from a prompt).
  - **Playwright runner** — opens the site, performs the steps, captures video/screenshots, and
    records event timings.
  - **Narration generator** — a script per step → voiceover (mp3/wav) with word/character
    timestamps.
  - **Remotion project** — imports the video/screenshots, places callouts / captions / cursor
    highlights, syncs the voiceover to the timeline, renders the final mp4.
  For Help / marketing / feature pages. _Reuse the QA Playwright setup for capture; relates to
  **Help page screenshots** + the **Joyride walkthrough** plugin._
- [ ] **a1-web About page** `P3 · S` — an About page for a1-web.
- [ ] **Demo click feedback** `P3 · S` — show a Snackbar (or similar) on Breadcrumb / Link /
  Button clicks in demos so interactions feel real.
- [ ] **Stack example enhancement** `P3 · S` — label the demo blocks 1/2/3 and have each control
  illustrate its effect (especially align/justify); add/remove children.
- [ ] **PageNav mobile UX** `P3 · M` — improve the in-page nav on small screens: a collapsed ↔
  expanded **floating-button** state (alongside / instead of the current top pill bar).
- [ ] **Pure & Native coverage + platform strategy** `P3 · L` — evaluate **every component** for Pure
  and Native implementation: produce a **coverage matrix** (which exist, which are missing, which have
  no app-based equivalent, which should be **native-only**), and decide how to manage **android/iOS**
  differences. Output a prioritized build list from the gaps. _Relates to the App-view roadmap +
  the component coverage audit + the Swift/SwiftUI kit item below._
- [ ] **Swift/SwiftUI kit — Apple device compatibility** `P3 · XL` — a **Swift-native** output of
  A1 (a SwiftUI Swift Package consuming the Style Dictionary tokens) for first-class Apple-platform
  support, alongside a **demo watchOS app** to prove it out. Add a **compatibility surface** that
  displays which components/tokens are supported per Apple device (iPhone / iPad / Mac / Watch /
  Vision). _A Swift-native alternative to the React Native path; pairs with **Watch app +
  watch-native variants** below and **Pure & Native coverage + platform strategy** above. Q: SwiftUI
  package vs. Code Connect-style mapping only? Token pipeline → Swift (Style Dictionary Swift
  formatter)?_
- [ ] **Watch app + watch-native variants** `P3 · XL` — explore shipping downTracker as a **watch
  app**, optimizing components for it, and **native variants for watches**. _Relates to the
  App-view / React Native roadmap; see the **Swift/SwiftUI kit** item for a Swift-native watch path._
- [ ] **Unwrap the CHANGELOG / TODO markdown** `P3 · S` — stop hard-wrapping lines in `TODO.md` and
  the CHANGELOGs (one line per item / paragraph; let editors soft-wrap). Also simplifies the
  TodoPage renderer's continuation-line joining.

---

## Roadmap — larger themes / epics

Big-picture directions captured from brainstorming — mostly large, overlapping epics that sit
above the granular P-bands. Promote slices into P0–P3 as they become actionable. Items that map
to an existing TODO entry or are already built are noted inline.

### Collaboration & platform
- **Multi-user / joint editing** — realtime co-editing + presence.
- **Users + DB storage / admin** — accounts & database-backed storage (_expands the P3 "User
  accounts" item_); a **user manager** / admin tools; **manage users**.
- **Folders for projects** — teams, drafts, add users.
- **Review & approval workflow** — permissions + **sign-off on a chunk**; **auto-summarize
  changes**; status **tags** (idea / in review / revised); page & project **status** (draft →
  pending → live; who can publish).
- **Comment mode** — select an item, add comments, review them; optional **AI auto-fix**.

### Quality & review (AI-assisted)
- **A11y review** — ask automated vs manual: automated = page **axe** audit → report in a dialog;
  manual = an auto-filled quick form → a **review queue** for an a11y expert.
- **Design / DS review (approval)** — AI evaluates a page against the **rules** + flags **pattern
  deviations**; manual review mirrors the a11y flow.
- **Content review** — **language patterns** / standardized formats (phone numbers etc — pull from
  an API?); auto spell/format check; **flag hardcoded labels**.

### Components & rules
- **Tidy components to the section model**; **better add-components/patterns UX**.
- **Rules** — AI-**suggest per-component rules** to pick from; **rules in the editor**;
  **scenario-triggered** rules.
- **Custom block / custom elements** — a managed custom area (raw CSS/HTML?), and a path for users
  to **roll their own** component or request a feature/enhancement within a project.
- **Component designer** — recolour etc., scoped; **gradient maker**.
- **Content-aware patterns** — levels/zones: drag a card into a tagged pattern and it renders
  appropriately (hero vs standard); the pattern **seeds component props**. _(Relates to patterns +
  slots + data binding.)_

### Data
- **Data binding + sample-data library** — bind to a DataTable or a pattern. _(See the P3 "Data
  binding" + "Data sets" items.)_

### Publish & output
- **Publish site / real React** _(see the P3 "Export project → React package" item)_.
- **App view** — same structure via **React Native** (future: web components).
- **Copy a site** — duplicate structure + theme + styling.

### Versioning
- **Multi-version / alternate designs** — track only the **diffs** between versions so alternates
  can be presented quickly.
- **Side-by-side compare** — pages across versions/states; **create a version from history**.

### Contribution
- **Contribute to the design system** — let users **add a pattern** (JSON snippet with locked
  parts — _already shipped_), **request a feature** (AI-assisted prompt builder), **suggest a
  rule**, and **request a review** (share a link; an AI agent or a person reviews for consistency,
  accessibility, etc.). _Ties into Rules (suggest), Review/approval, and A11y review._

### Theme
- **Theme editor/creator** _(largely shipped)_ + **apply a theme to a project**.

### Editor & canvas
- **Flow editor** _(see the P3 "Flow editor / project flow canvas" item)_; **canvas zoom**.
- **Page states** (loading / empty / error / default) _(see the P3 "Interactivity — states"
  item)_.

### AI
- **AI research** — synthetic personas that conduct AI research.
- **AI label / repeated-content generation** _(relates to "Pattern repeating")_; **label
  management / translations** + a **label editor** (statuses + history).

### Design tools (Figma)
- **Figma support (epic)** — go beyond the Code Connect proof of concept: build and **maintain the
  full Figma component library** (with **themes + modes**); **convert Figma → A1** code (as a
  project, or link pages) and **A1 → Figma** (the reverse); for **responsive**, generate a Figma
  **screen per breakpoint** from one A1 page, preserving the responsive behaviour. _`packages/figma`
  already holds Code Connect mappings._
