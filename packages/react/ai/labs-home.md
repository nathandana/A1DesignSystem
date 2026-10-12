# Labs home, sitewide search and sorting

Introduced in Labs 0.31.0; reworked in 0.64.0. The home gallery uses A1
PageLayout, the shared `LabsHeader`, SelectField, Grid, Card and Paragraph; no
new CSS or tokens. Sitewide search reuses a1-web's `GlobalSearchDialog`.

## Registry and taxonomy

`src/experiments.js` owns categories, type definitions and experiment metadata.
Every experiment needs one valid `category` and a nonempty `types` array with
unique IDs from `experimentTypes`. Categories power card metadata, text search and the side tree. Category/type
filter controls are retired. Every experiment also needs `addedIn`, its first
numbered Labs release, for chronological sorting.
Types overlap categories and each other; choose by the experiment's purpose:

| Type ID | Label | Use for |
| --- | --- | --- |
| `microinteraction` | Microinteraction | A short, focused response to an action or state change: switches, buttons, focus, reordering |
| `loading-feedback` | Loading feedback | Showing active processing, waiting, progress or service recovery |
| `form-pattern` | Form pattern | Input methods, required fields, long forms and submission workflows |
| `page-layout` | Page layout | Compositions, surfaces and presentation layouts |
| `data-visualization` | Data visualization | Graphs, timelines and plotted data |
| `design-tool` | Design tool | Inspecting or manipulating design-system data and structures |
| `motion` | Motion | An experiment whose primary subject includes animation or transitions |

An example form inside a focus study does not make it a form-pattern study.
Do not tag every experiment Motion just because its shared controls animate.
Use multiple tags when relevant, typically 1–2. Update this taxonomy and the
registry together if a genuinely new type is needed. Do not derive tags from
fragile title keyword matching. Required fields and Verification journey belong
to Forms; their IDs and URLs stay unchanged.

## Page structure and sorting

The home page is a `PageLayout stickyHeader` with `LabsHeader current="home"` —
the same toolbar as About and every experiment. It does not use
`viewportHeight`: the document is the only scroll region and the header stays
pinned above it. Do not reintroduce a fixed-height shell with an inner
scrolling gallery; nested scroll regions conflict on trackpads and phones.

Below the "All experiments" heading, the experiment count and one Sort
SelectField share a row (count at the start, sort at the end). The select has no
visible label — `aria-label="Sort experiments"` names it — so its options are
self-describing: Name, A–Z; Name, Z–A; Oldest first; Newest first (default).
There is no gallery filter field, Category/Type filter or empty state; sitewide
search replaces them. Categories and types remain card metadata, search
keywords and sidebar groups.

Chronological order compares numeric `addedIn` release components, with registry
order as a stable tie-breaker within a release; editing an experiment must not
change its first release. Alphabetical order uses an English numeric,
case-insensitive collator. Sorting never mutates the registry or sidebar order.
Card numbers retain their original registry positions.

The URL stores `sort`. Changes replace the URL; reload/popstate restores it.
Unknown sort values fall back to newest. The retired `q`, `category` and `type`
params are ignored and removed, preserving unrelated params. Cards retain 16:9
Figures, category and type text, without nested interactive controls. A1 Grid
stays xs 1 column, sm/md 2, lg 3, xl 4.

## Sitewide search

Labs follows a1-web's pattern: a Search Labs icon button in the header toolbar,
`/` or Cmd/Ctrl+K from anywhere, and a large overlay (`GlobalSearchDialog`
from `apps/a1-web/src/search/`, mounted once in `App.jsx`). Its `label` and
`emptyDescription` props give it Labs wording; a1-web keeps its defaults.
`src/labs-search.js` builds the entries: every listed experiment (category as
the group, types and curated `tags` as keywords) plus All experiments and About
Labs. Hidden experiments stay out. Choosing a result navigates to its address.
Results are ranked by a1-web's scorer, which also tolerates small typos. As in
a1-web, Escape clears a typed query first, then closes and restores focus.

The experiment sidebar's SearchField ("Filter experiments") still filters the
tree with `matchesExperiment`; add concise, unique synonyms to every entry so
both searches find it.

## Validation and maintenance

Model tests cover taxonomy/aliases, required first-release metadata, alphabetic
and chronological ordering, immutability and legacy URL handling. Browser checks
cover all four orders, URL reload, the removed `q` param, sort/count alignment,
a single document scroll region with the header pinned, and responsive columns
without horizontal overflow. No new CSS/tokens or theme contrast sweep.

Keep README, contribution guide, version and changelog synchronized. New
experiments must set `addedIn` to their actual first release and keep it stable.

## Search keyboard shortcut

`useSearchShortcut.js` exports `LabsSearchContext` and the `/` and Cmd/Ctrl+K
handler, which opens the sitewide overlay. `App.jsx` owns the open state and
provides `openSearch` and `handleShortcut`. Ignore input/textarea/select/
contenteditable controls, textboxes and comboboxes, composition, repeats,
other modifiers, menus and open dialogs, so typing "/" in a field types it.

The document listener handles the normal page; the same handler as a React
`onKeyDown` on the page shell handles events from responsive preview portals.
Respect `defaultPrevented` to avoid handling a key twice. The shortcut is not
configurable; ignore the retired `a1-labs-search-shortcut` storage key. Settings
and the open overlay suspend it.

`tests/search-shortcut.browser.mjs` covers the header button on desktop and
mobile, `/` and Cmd/Ctrl+K, results, no results, Escape behavior, choosing a
result, form fields keeping `/`, focus restoration and iframe portal keys. Use
`LABS_ORIGIN` to select the dev or production server.

## Shared appearance controls

`AppearanceSettings.jsx` owns the theme/mode preferences and exposes them through
`AppearanceContext`. `LabsHeader` renders `AppearanceControls` on every page,
passing the md+ inline controls through TopHeader `endContent` so they sit inside
the header's bottom border (never in a wrapper beside the TopHeader):
at the token-defined md minimum (641px), show the A1 SegmentedControl at `size="md"` for Light,
Dark and System, with visible labels beside the icons, plus an A1 SelectField
for Theme. Keep these labels and medium size in the small-screen Settings control too. At smaller widths retain the Settings menu, including reset.
The media-query listener synchronizes on mount and closes an open menu when
entering md. Do not duplicate preference state across the two presentations.
System mode must follow live operating-system changes; resize and navigation
must preserve preferences and experiment state. Reuse A1 layout/control props;
this header composition requires no custom CSS or shared component overrides.

`tests/appearance.browser.mjs` covers home, About and experiment headers from
390–1600px, the 640/641 boundary, keyboard mode selection, theme persistence,
live System mode, absence of shortcut settings and an open-menu resize. Focused
axe coverage excludes contrast; human screen-reader review remains outstanding.

Gallery checks recorded Oct. 11, 2026 (0.64.0): breakpoint boundaries from
390–1441px, document-only scrolling with the header pinned, no horizontal
overflow, URL-restored sort and sort/count alignment passed. Desktop and phone
screenshots, and the search overlay, were reviewed.
