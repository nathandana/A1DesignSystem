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

- [ ] **Segmented Control — prop audit** `P2 · S` — go through every SegmentedControl
  prop and add any missing from the configurator (notably `labelMode` "all"/"selected";
  confirm size / fullWidth / options coverage).
- [ ] **Balance text-wrap → align toolbar toggle (Heading + Paragraph)** `P2 · S` — move
  "balance text wrap" out of Advanced into the Align toolbar as a divider-separated toggle
  icon; apply the same pattern to the Paragraph configurator. Configurator-only.
- [ ] **Component browser coverage audit** `P2 · L` — reconcile every component's root + child
  props across the MD registry, configurator, **Properties** tab, and Storybook; fill gaps; flag
  which lack Pure/Native. _First pass done: **67** components have a configurator but only **56**
  have a dedicated Properties table (~11 fall back to generic). Remaining: write the missing tables
  + reconcile props (incl. children) + the Pure/Native coverage check._
- [ ] **Card — image variant (replace hero icon)** `P2 · M` — a Card header that uses the
  same space as the hero-icon block but shows an **image** instead (e.g. `heroImage`). DS
  Card change + configurator. _Also in the original "General changes" backlog._
- [ ] **Card — badge in hero (alignment grid)** `P2 · M` — let a Card's hero area carry a
  Badge positioned via a 3×3 alignment grid (corners / edges / centre). DS Card change +
  configurator (alignment-grid picker). _Pairs with the Card image variant._
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
- [ ] **Editor — inlineEditable click toggles selection (bug)** `P2 · S` — with an
  InlineEditable in use, clicking / double-clicking the text flips the whole interface
  selection on/off instead of just editing. Selection shouldn't toggle on text clicks.
- [ ] **DefinitionList — render a value as a Link** `P2 · S` — allow a definition value to be a Link.
- [ ] **Paragraph — configurable weight** `P2 · S` — expose a `weight` prop + configurator
  control on Paragraph (currently none).
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
- [ ] **Project chrome / TopHeader editing** `P2 · M` — better editing of a project's shared page
  chrome and **TopHeader**. _The per-project shared layout (TopHeader + Outlet + footer, edited on
  canvas) + auto-nav already exist — this improves that experience._
- [ ] **Conditional logic editor (if/else)** `P2 · L` — simple logic for prototyping: e.g. "if
  field A and B are filled, show field C". A lightweight conditions layer over fields/elements.
  _Sibling of Interactivity — states & Form-submit validation._
- [ ] **Sticky Footer scoping in the editor (bug)** `P2 · S` — a sticky footer / StickyActions is
  fixed to the **viewport** rather than scoped to the **editable page** area, so it overlaps the
  editor chrome. Scope it to the page container in edit/preview.
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
  keyboard-shortcut support and a context menu (especially on selected text).
  _Depends on building the RTE component first._
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
- [ ] **Plugin — Motion for React (animation)** `P3 · L` — sprinkle Motion animations into
  screens; explore AI-prompted animation. First target: cards that **animate on scroll** —
  appear one at a time, fading + scaling up from below. _Relates to the Animation editor._
- [ ] **Plugin — Recharts (data viz)** `P3 · L` — charts / data-visualization integration.
- [ ] **Plugin — TanStack (data grids)** `P3 · L` — advanced data-grid integration.
- [ ] **Expand codebase output + web-component proof** `P3 · L` — broaden the "Codebase"
  targets; build a **web-component Button** to prove out a Web Components output.
- [ ] **Data sets — predefined + custom editor** `P3 · L` — predefined datasets (users, medical
  records, vehicle data) + a custom data editor to create/manage datasets and **import from a
  JSON feed**. Pulled into pages like components: **drag a dataset onto a compatible element
  (e.g. a DataTable) to auto-configure**, and **patterns can receive a dataset**. Feeds Data
  binding. _Relates to Pattern repeating + Data Table._
- [ ] **Animation editor** `P3 · XL` — in-editor animation authoring. _Relates to the Motion for
  React plugin._
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
- [ ] **a1-web About page** `P3 · S` — an About page for a1-web.
- [ ] **Demo click feedback** `P3 · S` — show a Snackbar (or similar) on Breadcrumb / Link /
  Button clicks in demos so interactions feel real.
- [ ] **Stack example enhancement** `P3 · S` — label the demo blocks 1/2/3 and have each control
  illustrate its effect (especially align/justify); add/remove children.
- [ ] **PageNav mobile UX** `P3 · M` — improve the in-page nav on small screens: a collapsed ↔
  expanded **floating-button** state (alongside / instead of the current top pill bar).
- [ ] **Pure & Native coverage + platform strategy** `P3 · L` — evaluate every component for Pure
  and Native: which have no app-based equivalent, which should be **native-only**, and how to
  manage **android/iOS** differences. _Relates to the App-view roadmap + coverage audit._
- [ ] **Watch app + watch-native variants** `P3 · XL` — explore shipping downTracker as a **watch
  app**, optimizing components for it, and **native variants for watches**. _Relates to the
  App-view / React Native roadmap._
- [ ] **TODO page — complexity badges + filtering** `P3 · M` — render the `P# · Effort` tags as
  badges on the TODO page and add filtering (by priority / effort).
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
