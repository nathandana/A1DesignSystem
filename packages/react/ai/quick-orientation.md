# A1 Design System — Quick Orientation

## Build commands

| Task | Command |
|------|---------|
| Token + theme + html-css rebuild | `npm run build:tokens && npm run build:html-css` |
| Theme rebuild only | `npm run build:themes` |
| Color-token inventory + validation | `npm run tokens:audit:check` |
| Update computed color contract | `npm run tokens:contract:update` |
| Check computed color contract | `npm run tokens:contract:check` |
| Verify react npm tarball (imports, entry points, guidelines sync) | `npm run pack:check` |
| Regenerate component History from the maintenance log | `npm run history:generate` (`:check` to verify freshness) |
| Full QA (axe + visual + report) | `npm run test:qa` |
| Update visual baselines | `npm run test:qa:update` |
| A1-Web route baseline | `npm run test:a1-web` |
| Update A1-Web route baselines | `npm run test:a1-web:update` |
| A1-Web release gate | `npm run release:a1-web:check` |
| Storybook dev | `npm run storybook` |
| a1-web dev | `npm run dev:a1-web` |
| General dev server | `npm run dev` |
| Rebuild the MCP server's static index | `npm run build:mcp-index` |
| MCP server local dev | `npm run dev:mcp-server` |

## Stable local ports

Use the root scripts for bookmarkable local URLs. They all use `--strictPort`, so the command fails if the reserved port is busy instead of silently moving to another port.

| App/site | Command | URL |
|----------|---------|-----|
| Examples index | `npm run dev` | `http://127.0.0.1:5176/` |
| A1 Labs | `npm run dev:a1-labs` | `http://127.0.0.1:5187/` |
| a1-web | `npm run dev:a1-web` | `http://127.0.0.1:5177/` |
| a1-web local bridge (Codex + Figma handoff) | `npm run codex:bridge:a1-web` | `http://127.0.0.1:4318/` |
| Tesla A1 | `npm run dev:tesla-a1` | `http://127.0.0.1:5188/` |
| Tesla A1 proxy-backed app | `npm run serve:tesla-a1` | `http://127.0.0.1:5189/` |
| Storybook | `npm run storybook` | `http://127.0.0.1:6006/` |
| Priority Guide | `npm run dev:priority-guide` | `http://127.0.0.1:5178/examples/priority-guide/` |
| Cat Stack Cafe | `npm run dev:cat-stack-cafe` | `http://127.0.0.1:5179/examples/cat-stack-cafe/` |
| Theme Editor | `npm run dev:theme-editor` | `http://127.0.0.1:5180/examples/theme-editor/` |
| Catlympics | `npm run dev:catlympics` | `http://127.0.0.1:5181/examples/cat-lympics/` |
| MCP server | `npm run dev:mcp-server` | `http://127.0.0.1:5190/mcp` |

Always run `npm run build:tokens && npm run build:html-css` after any change to `system/tokens/` or `system/themes/` before testing or committing.

## Key file locations

| What | Where |
|------|-------|
| Token source files | `system/tokens/` |
| Theme source files | `system/themes/` |
| React components | `packages/react/src/components/{name}/` |
| BEM classes (generated — edit `componentCss()` in `scripts/build-html-css.mjs`) | `packages/pure/dist/a1-base.css` |
| Hand-authored pure classes | `packages/pure/dist/a1-pure.css` |
| Pure example site | `examples/a1-pure/` |
| Color scheme switching (dark mode, inverse) | `packages/react/src/color-scheme.css` |
| Component registry | `packages/react/ai/components.md` |
| a1-web app | `apps/a1-web/src/` |
| Accessibility report data | `reports/a11y.json` |
| MCP server (remote, agent-facing design-system API) | `packages/mcp-server/` |

## Node version

This project uses Node v24 via nvm. If commands fail to find `npm`, run:

```
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && nvm use 24
```


## Portfolio homepage

Run `npm run dev`, then open
`http://127.0.0.1:5176/examples/portfolio/`. Standalone deployments use
`/`. The former alternate design is now `pages/HomePage.jsx`; `/alternate` remains
a compatible alias. The original source is preserved in `pages/archive/HomePage.jsx`.
Open it directly; it uses the unchanged portfolio sidebar, mobile
navigation and shared footer. Build with
`npm run build --prefix examples/portfolio`.

The page follows the broad content structure of https://nabauer.com/ while using
Nathan Dana's existing content, case-study assets and demo files. The placeholder
writing section has been removed. The page uses existing A1 components and the portfolio's Dispatch
theme; no custom CSS or component contracts were added.

### Reference site robots inspection — Sept. 22, 2026

- https://nabauer.com/robots.txt returns HTTP 200 with `User-agent: *`, `Allow: /`
  and `Sitemap: https://nabauer.com/sitemap.xml`. It has no disallow rules or
  crawler-specific AI restrictions.
- The homepage includes `<meta name="robots" content="index, follow">` and a
  self-referencing canonical URL. Its inspected HTTP response has no
  `X-Robots-Tag` header.
- The sitemap returns XML listing the homepage, work, articles and other pages,
  with modification dates, change frequencies and priorities.
- HTML contains Next.js assets and rendered page content; the HTTP server header
  identifies Cloudflare. This supports Next.js behind Cloudflare, but does not
  establish the origin hosting service.
- These are crawler directives, not access controls or a guarantee of indexing.
  This inspection does not establish how every individual crawler is treated.

The local portfolio currently has no dedicated robots.txt or sitemap.xml and no
robots meta tag in its HTML entry point. Its Netlify catch-all rewrites unmatched
paths to index.html, so absent static robots/sitemap files can receive the SPA
HTML instead. This is a source-configuration observation, not a live-domain
check. No crawler configuration was changed for this alternate-page request.

### Primary case studies and archives

Transform, A1 and Fondue now render their promoted alternate designs at the
existing primary URLs: `/case-studies/transform`, `/case-studies/a1` and
`/case-studies/fondue`. Prefix these paths with
`http://127.0.0.1:5176/examples/portfolio` for local development.

Primary source files are `examples/portfolio/studies/TransformStudy.jsx`,
`A1Study.jsx` and `FondueStudy.jsx`. The original implementations are preserved
in `examples/portfolio/studies/archive/` with corrected relative imports. Archives
are source snapshots, not published pages or navigation entries.

Existing `*-alternate` URLs and `fondue-alternate-2` remain compatible aliases
through `data/caseStudyAliases.js`. They resolve to the canonical study for
rendering, titles, navigation selection and focus metadata. New internal links
use the primary URLs. The promoted homepage is at `/`; `/alternate` remains a compatible alias.

The promoted pages retain their content, figures, overview cards and numbered
sections. Transform includes the supplied TruCare Cloud determinations example;
Fondue includes its component inventory and preventive care example.

### Audience-specific portfolio setup

See [the portfolio audience guide](../../../examples/portfolio/AUDIENCE-PORTFOLIOS.md)
for the proposed Netlify subdomain redirects, audience selection, application
attribution and PostHog overlap reporting. This is an implementation guide;
audience rendering and analytics are not enabled by the documentation change.

### Portfolio UX/DS content classification

See [portfolio-focus.md](portfolio-focus.md) for the content metadata contract,
page registry, inline annotations, inheritance and future filtering helpers.
Run `node --test examples/portfolio/tests/focus.test.js` for the contract checks.

## A1 Labs

See the [Labs README](../../../apps/a1-labs/README.md) for setup, controls,
accessibility behavior, source structure and static hosting instructions.

Labs validates patterns and components for export into A1. Keep experiment CSS
colocated and scoped to that experiment, and separate reusable implementation
from the Labs shell and configuration UI. Follow the
[isolation and promotion contract](labs-contributing.md#isolate-experiments-and-prepare-them-for-a1)
for namespace rules, dependencies and validation before promotion.

`/about` provides the Labs overview, A1 Web link and release history. Canvas and
experiment navigation link to it; the About page shares the experiment header
and appearance settings. Numbered entries come from `CHANGELOG.md` at build time
through `src/release-notes.js`, excluding Unreleased; `package.json` supplies the
current version. Version synchronization is covered by the app's unit tests.
Use focused accessibility checks for routine additions; do not repeat all-theme
contrast sweeps unless a color/theme change or regression warrants them.

`apps/a1-labs` is the standalone experiment gallery for `labs.a1design.app` (A1-2698).
Run `npm run dev:a1-labs` on reserved port 5187. Build with `npm run build:a1-labs`;
output is `apps/a1-labs/dist`. For Netlify, use the repository root as the base,
that build command and that publish directory, then assign `labs.a1design.app`
to the site. The dedicated project and deployment commands are now configured;
see [Publishing Labs](labs-publishing.md) for DNS/TLS and initial activation.

The initial dark screen shows registered experiments in a responsive A1 Grid:
xs 1 column, sm/md 2, lg 3, xl 4. Cards follow the selected name/first-release sort with 16:9 A1 Figure
previews and content-driven heights. The page uses PageLayout with the shared
LabsHeader toolbar; the document is the only scroll region and the header stays
pinned. The count and a Sort select share a row; `sort` persists in the URL.
Sitewide search follows a1-web: header search button, `/` or Cmd/Ctrl+K, and
the reused GlobalSearchDialog overlay. See [the home contract](labs-home.md).
Registry `preview` and `previewAlt` point to static files in `public/previews/`;
run `npm run capture:previews --workspace=a1-labs` to refresh actual renderers.
The home page needs no app CSS. Grid props own responsive columns.

`/experiments/steps` compares eight presentations of A1 progress tabs, including
the default. Read [the steps contract](labs-steps.md) before changing it.

`/experiments/step-tracker` compares the noninteractive A1 position tracker
with five additional treatments. See [Step tracker](labs-step-tracker.md).

### AI image generation experiment

The first experiment opens at `/experiments/ai-image-generation`. The registry
in `apps/a1-labs/src/experiments.js` supplies the canvas card and experiment tree.
Further experiments follow in registry order. `ExperimentPage.jsx`
maps IDs to state-owning experiment pages, each using `ExperimentLayout.jsx` for
the shared tree, header and responsive configuration panels.
The tree header contains only an A1 SearchField that filters the tree, without an Experiments heading or
desktop collapse button (`SideNav collapseButtonPlacement="none"`). The registry
assigns every experiment a category: AI, Page loading, Controls and interaction,
Layout and surfaces, Forms, or Data and visualization. The tree sorts categories
and their experiments by name. The active category opens by default, and the
TreeMenu `showExpandControls` toggle above the tree expands or collapses all. Search shares the gallery matcher for titles, descriptions, category/type names
and curated keyword tags. Every query term must match, ignoring case and surrounding
whitespace; matching groups expand and empty groups disappear. Clearing restores
the active category. Category selection toggles its group; Enter/Space on an
experiment navigates to it. Search works in the
desktop sidebar and mobile overlay, with a no-results message for unmatched text.
No custom CSS is required.
The page uses PageLayout with independent panel scrolling, an expanded SideNav
on desktop, the same SideNav overlay at md and below, and configuration in a
BottomSheet at xs/sm (detents 0.55 and 0.95, initially collapsed). The sm boundary
comes from the shared breakpoint token. A static-host SPA rewrite supports direct
links. The center now runs the image generation animation, with controls in the
configuration panel; there is no generation API. The panel starts directly with
the animation-style controls, without a Configuration heading. The mobile sheet
retains its Configure handle.

CSS review for the detail page: the only new styles reproduce a1-web’s fixed,
token-sized configuration rail and hide the tree opener at the SideNav desktop
breakpoint. Shared components provide layout, spacing, surfaces and interactions.
A reusable fixed-width aside option would belong in PageLayout; guidance should
cover the combined SideNav/BottomSheet pattern and nested header landmarks.

The animation defaults to 4:3 and 15 seconds of generation. Aspect ratio options
are 4:3, 1:1, 16:9 and 3:4, using a labeled, full-width A1 Toolbar/ToolbarGroup
with radio selection and arrow-key navigation. Duration uses A1 Slider with
labeled 5-, 15- and 30-second detents, defaulting to 15 seconds. It uses the shared
subtle variant to keep the active detent readable in dark mode. The slider snaps
between those values, announces seconds via aria-valuetext and supports native
arrow/Home/End keys and touch. Both controls work in the mobile sheet. No
custom app CSS is needed for these configuration toolbars. Shared Toolbar uses
default semantic text for enabled tools so labels remain readable on its raised
surface, including in Aperture. The `component.toolbar.interactionShade` alias
darkens hover fills in both modes, preserving contrast in Fresh dark mode.
Selected tools use the SegmentedControl selected treatment (page surface plus
`semantic.shadow.xs`) so selection stays clear in dark mode. These corrections belong in the shared Toolbar CSS and token layer;
configuration layout uses A1 props without local styling. The
percentage and clockwise rounded-rectangle border share one elapsed-time value.
At 100%, the border holds for 300ms, then a 1.5-second wave reveals the local
Yosemite photo from the portfolio. Once fully revealed, the border and its inset
are removed so the photo fills the rounded frame. The displayed percentage measures this demo
timeline, not a remote generation job. Replay resets the timeline; pause freezes
the disc field and progress. Ratio changes resize the current frame without
resetting progress; duration changes restart it.

The Animation style toolbar switches between Discs (default) and Glowing blob
without resetting elapsed time or pause state, including after completion. The
blob renderer (`image-generation/blob.js`) blends integer harmonics into an
organic silhouette, adds luminous layers and increases brightness/contrast as
progress grows. It shares the blue-to-green palette, perimeter and reveal with
Discs. Shape changes are deterministic; reduced motion freezes the silhouette
and rotation while color/luminosity continue to indicate progress. The canvas
description reflects the selected style. Blob geometry, complexity, brightness,
highlight and glow values live in the existing image-generation token family.
The background aliases `semantic.color.surface.card`, the palette uses
`semantic.color.status.info.background` and `semantic.color.status.success.background`,
and the blob highlight follows `semantic.color.text.default`. Both shared mode
maps in `system/color-modes.mjs` keep those aliases live across theme, light/dark,
system and inverse scopes. The canvas refreshes its computed tokens when root
theme attributes or OS color preference change, even while paused or complete.
Colors are resolved by the browser rather than assuming hex strings. Blob
layers use additive blending when the highlight is lighter than the surface;
otherwise they use normal compositing to retain contrast on light backgrounds.
Changing appearance preserves the timeline and the borderless completed photo.
Verified both styles across all nine offered themes in light and dark modes
(36 combinations), including matching canvas pixels to the resolved surface
token while paused. System preference changes, running mode changes, completed
photo preservation, rgb/color-mix values, mobile/reduced motion and desktop/mobile
axe checks also pass. Theme support changes only token aliases, generated mode
CSS and canvas redraw behavior; no hand-authored theme CSS is needed.
CSS review: no new CSS. Shared Toolbar provides selection; custom Canvas 2D
geometry is specific to this experiment, with values in the token layer.

Border radius (4, 8, 16, 24, 32 or 64 px) and width (1, 2, 4 or 8 px)
use subtle A1 Slider controls with labeled detents and existing spacing tokens;
The first detent uses a restore icon, restores the image-generation component
token and announces “Theme default.” Values announce pixels,
and native arrow/Home/End keys and touch select each stop. Changes redraw immediately without restarting,
including paused and completed frames. Discs have gradient fills without outlines.
The visible status is an explicit polite, atomic live region. It announces 25%
milestones, precise paused progress, reveal, completion and recoverable loading
errors. The separate progressbar exposes every percentage; loading/error states
omit a numeric value. The canvas exposes busy state, context and final image text.
The live region sits outside the busy canvas so its updates are not deferred.
Pause/replay and live OS reduced motion remain available. With reduced motion,
disc positions/count and blob geometry stay still, pulsing stops and the image
appears instantly after the completion hold. Turning motion back on cannot
partially hide a completed image; only replay starts a new timeline. The canvas
description and helper text reflect the active preference. Announcement pacing has unit
coverage; actual speech behavior still requires assistive-technology review.
The frame/accessibility update passed desktop scans across all nine offered
themes in light and dark modes, mobile axe, keyboard focus/playback, five viewport
sizes, paused/completed redraws, reduced motion and image error/recovery checks.
Those scans exposed Dispatch’s selected TreeMenu label at 3.41:1 contrast; its
shared foreground aliases now use the existing white token. All 12 TreeMenu
stories pass focused axe checks, and the shared color contract remains unchanged.

CSS review for frame controls: no new CSS. Configuration overrides existing
component token slots; the shared controls provide layout and keyboard behavior.
The Dispatch contrast correction belongs in the shared theme and is generated
from tokens. No additional system component or guidance gap was introduced.

The renderer is in `apps/a1-labs/src/image-generation/renderer.js`. Its frame
function is deterministic for a given elapsed time. Canvas 2D implements the
procedural artwork without inline SVG or added animation dependencies. Shared
visual tokens live in `system/tokens/component/image-generation.json`; the
Foundations/Tokens/Image generation story documents them. Reduced motion uses
a static disc cluster, no pulse/orbit and an immediate final reveal. The timer
starts after the local photo loads and stops when the reveal completes.

Run `npm test --workspace=a1-labs` for timing and perimeter geometry checks.
The current implementation also passed browser checks for all 4 aspect ratios,
5 viewport sizes, pause/replay, full reveal, mobile controls and reduced motion,
with no desktop/mobile axe violations.

CSS review for the animation: custom CSS is limited to the token-sized canvas,
configurable aspect ratio and tabular percentage digits. A1 components provide
all interface controls, typography and layout. The procedural disc field and
wave reveal are experiment-specific drawing code. Promote a progress-driven
media-reveal component only after its behavior is established; guidance should
cover token use in Canvas 2D, motion preferences and truthful progress labels.

### Page loading experiment

`/experiments/page-loading` reuses a1-web's ResponsivePreviewFrame and presets,
defaulting to its 390 × 844 phone. The iframe provides genuine responsive layout
and independent scrolling; the border stays fixed to that viewport. Controls
offer phone, landscape phone, tablet, laptop and desktop sizes, 2/4/8-second
cycles, pause/resume, Finish loading and Replay. Reduced motion holds the glow
still and removes the finish fade. While loading or paused, a centered heading
and small tertiary Stop animation / Resume animation button are shown. This
button shares sidebar playback state. Finish loading mounts the sample content
and Replay hides it again. Explanatory UI copy is omitted. A1 Section/Stack props provide viewport centering without local CSS.
Status is polite and screen-reader-only, and the preview exposes busy state; no percentage or real
network request is implied.

Device-frame CSS now lives beside ResponsivePreviewFrame, which uses A1 Stack,
includes bezel width when scaling and mirrors live theme classes/styles into the
iframe. The experiment's only custom CSS is the fixed masked conic-gradient
border and glow; dimensions/durations come from component.pageLoading tokens and
colors from live semantic accent, info, success, warning and error roles. Two
blurred layers provide a diffuse gradient without a crisp stroke or fixed palette.
The sample page and controls use A1 props.
A reusable loading-border component can follow if other consumers need it;
keep guidance clear about iframe viewport ownership and theme synchronization.

### Focus state animations

`/experiments/focus-animations` provides a short form with an A1 ChoiceGroup for
four focus treatments,
100/150/200 ms duration detents and natural keyboard traversal. Default: Ring
settle at 150 ms. Focus remains visible after the one-shot animation; reduced
motion shows the settled state immediately. All replacements are opt-in within
`.a1-focus-animation`, using live A1 focus tokens. The reusable scope has no Labs
shell dependency. See [its API and validation contract](labs-focus-animations.md).

### Button completion experiment

`/experiments/button-completion` uses A1 Tabs for two versions of a primary
action that becomes its own result. **Publish** (`CompletionButton`) keeps a
fixed width — sized to its widest face — while colour, icon and label change:
Publishing… → Published, or Not published → Try again. **Send email**
(`SendButton`) is one large, fixed-size button with a Canvas 2D stage: at rest
it centres a filled icon, label and description; on press that icon (same shape
and size) is launched from a slingshot, which then recoils out, along an arc with dashed motion lines
that erase behind it. Flight speed follows the real send time; success flies
out and draws a checkmark, failure crash-lands in a mini explosion and draws a
cross, with the result text inside the button.
Configuration: outcome, size (Publish only) and 1/2/4-second processing. Colours come from
A1 primary/success/destructive button tokens; timing and stage dimensions from
`component.buttonCompletion`. See [its API and validation contract](labs-button-completion.md).

CSS review: the experiment reproduces the primary Button's look in namespaced
CSS because the shared Button cannot hold a fixed width or host a stage.
A `fixedWidth`/result-state option on Button belongs in the system if this is
promoted.

### Switch transition

`/experiments/switch-morph` shows the A1 switch at 1×/2×/3×/4× scale. Defaults are
off, 2× and 100 ms; timing detents are 100/150/200/300/750 ms. The same two bars move and
resize while rotating 90 degrees into a checkmark and back into an X. A native checkbox with switch role
owns input semantics; the preview has no card or separate On/Off text. At 1×, label typography and row spacing/padding also match
the default A1 Switch. Transitions use gentle, nearly even easing; CSS uses live A1 switch/field tokens and switches instantly
for reduced motion. See [the reusable API and validation notes](labs-switch-morph.md).

### Under construction (page loading 2)

`/experiments/page-construction`: a tower crane places each
`data-construction-block` of a sample page as a placeholder (fetch at mast,
carry, lower, dust), idles with shimmer until loading finishes, then lifts away
and reveals the page. Same viewport/playback controls as Page loading plus crane
speed. Tokens in `component.pageConstruction`; crane colours from `status.warn`.
See [its contract](labs-page-construction.md).

### More page loaders

Blueprint, Jigsaw, Fresh paint and Sunrise (`/experiments/page-blueprint`,
`page-puzzle`, `page-paint`, `page-sunrise`) share `src/loading-preview/`
(page with viewport/speed/finish/pause/replay, the sample page and
`loader-utils.js`) with Under construction. Each has a pure tested timeline and
its own `component.page*` tokens. See [the page loaders contract](labs-page-loaders.md).

### Color token visualizer

`/experiments/token-visualizer` renders a1-web's Foundations color visualization
unchanged via `useColorVisualization` (controls in the configuration panel,
tabbed 3D space / ramp inspector / step alignment in the center). Its styles
moved beside the a1-web component (`color-visualization.css`). The page is
lazy-loaded so three.js/React Three Fiber stay out of the main Labs bundle.

### Frosted glass

`/experiments/frosted-glass` renders a sample page (header, invite form,
full-width submit) as stacked frosted glass panes in the shared responsive
viewport; the viewport is the base sheet and each pane reads as 2 mm glass
(translucent top edge, 6 px polished bevel, soft contact shadow, 3 px corners). The form is inlaid flush
in the sheet and each field is an inlaid glass piece (label inside) in the form,
via SVG masks generated per pane. `GlassPane` depth comes from nesting and gently raises tint (capped at depth 3) and shadow per
layer; the blur sits on each pane's `::before` to avoid nested backdrop roots.
Controls: viewport, frost (light/medium/heavy) and backdrop. By request it uses
raw values rather than A1 tokens. See [its API and token exception](labs-frosted-glass.md).

### AI thinking

`/experiments/thinking-terminal` provides a simulated chat with editable terminal
status lines, random selection without immediate repeats and length-based typing
and reading time. The first line appears first; subsequent thoughts replace it
in place without adding history rows. Stop/Resume and Finish thinking live in the configuration panel; Send
in the chat restarts it.
Reduced motion holds a full static line. The isolated `ThinkingTerminal` core
uses A1 Paragraph, a background-free code row and experiment timing tokens.
The animated text replaces the visible Thinking label beneath Assistant. See
[the API and accessibility contract](labs-thinking-terminal.md).

### Nodes and canvas

`/experiments/connected-nodes` combines A1 Canvas, Node and NodeConnector into
one six-node/seven-connector experiment. Defaults: curved connectors, rectangular
subtle nodes, dot grid, dragging and connection highlighting. Configuration
changes node/connector geometry and line style, edits labels and moves selected
nodes through keyboard-accessible controls. Reset restores graph data/view; a
text connection list exposes the relationships. The graph refits across widths
without discarding edits. See [the composition contract](labs-connected-nodes.md).

### Verify button

`/experiments/verify-button` provides an animated safety mechanism for a simulated
critical submission: arm, hold and release, or use a separate click-only review.
The core emits intent once per session and owns no server work. A1 buttons and
experiment-scoped tokens/CSS supply its theme and motion. See
[the interaction contract](labs-verify-button.md).

### Reordering

`/experiments/reordering` compares eight placement animations (Subtle, Plop,
Tilt and settle, Spring, Pop, Slide in, Fade in, Instant) and eight insertion
indicators: five over the slot and three in a gutter beside the list (Side
marker, Pointer, Position rail), with duration detents. Pointer and
keyboard pickup/drop plus per-item move buttons update a controlled list.
See [the portable list contract](labs-reordering.md).

### Billboard with actions

`/experiments/billboard-actions` combines a large introduction and a panel of
next-step links. It offers editable copy, Cards/Action Tiles, Accent/Neutral,
description and stacked-layout controls, and the shared device preview (Laptop
by default). It uses existing A1 props/tokens with no custom stylesheet. See
[the reusable composition](labs-billboard-actions.md).

### Required fields

`/experiments/required-fields` compares five new ways to mark required and
optional fields on a 16-field form (Margin tick, Ink lines, Completion rings,
Opt-in extras, Required rail), each with its own submission treatment. They
deliberately avoid A1's asterisk and Required badge: A1 supplies only the
controls, and scoped experiment CSS draws the markers and messages. See
[the comparison contract](labs-required-fields.md).

### Timeline

`/experiments/timeline` rebuilds a reference timeline image as an interface,
with invented sample content: four milestones whose connectors wrap each badge in a quarter arc and turn into
a stem to a node. Horizontal alternates above and below; vertical (phones and
tablets) keeps the axis at the start with details after it and the year as an
eyebrow. Geometry tokens are
`component.timeline`; tones are live status/action roles. See
[the timeline contract](labs-timeline.md).

### Slides

`/experiments/slides` is a sample deck (A1 components and tokens, invented copy)
comparing transitions from Cut, Fade, Push, Zoom and Color wipe to content-aware
Cascade and Morph (shared pieces move, resize and recolour), plus content builds
(all at once, fade, rise, step through) and three speeds. `component.slides`
tokens; see [the slides contract](labs-slides.md).

### Segmented control transitions

`/experiments/segmented-motion` gives the A1 SegmentedControl eight ways for its
selected background to move (Default, Fade, Slide, Spring, Stretch, Grow, Wipe,
Morph) with a motion-token duration, 2–5 options, size, icons and full width.
See [the segmented transitions contract](labs-segmented-motion.md).

### Accordion transitions

`/experiments/accordion-motion` gives the A1 Accordion eight opening and
closing transitions (Default, Smooth, Slide, Bounce, Stagger, Unfold, Blur,
Wipe) with a motion-token duration, sizes, dividers and one-open-at-a-time.
Scoped CSS only; see [the accordion transitions contract](labs-accordion-motion.md).

### Radio buttons

`/experiments/radio-buttons` animates the A1 RadioGroup's radio in six
variants: Grow (swell, squish and spring), Ripple, Bounce, Thicken, Travel
(the selection slides between options) and Jelly. Speed uses motion tokens; sizes are `component.radioVariants`.
See [the radio variants contract](labs-radio-variants.md).

### Mobile data tables

`/experiments/mobile-tables` previews seven phone patterns for a simple or
complex table (cards, compact list, scrolling, frozen first column, expandable
rows, pick a column, grouped) in a device frame; md and up show the standard A1
DataTable. See [the mobile tables notes](labs-mobile-tables.md).

### Bulk actions

`/experiments/bulk-actions` selects rows of a 127-product A1 DataTable (sort,
pages; no search or filter) and deletes them from an always-visible bar whose button is
disabled until rows are selected, either instantly or with Animate away (rows
tint, slide and fade, then the rest glide up). Switches offer to select all
products beyond the page and move the select-all checkbox into the bar.
Deletions persist until Reset. See [the bulk actions notes](labs-bulk-actions.md).

### Data grid

`/experiments/data-grid` puts A1's experimental `DataGrid` (react-data-grid
themed with A1 tokens) to work as an editable 127-item inventory, with
selection, multi-sort, resizing, a frozen column, totals and density.
Lazy-loaded. See [the data grid notes](labs-data-grid.md).

### Fenex celebrates

`/experiments/fenex` (hidden from the gallery and sidebar; the address still
works) shows Fenex the fox, a self-contained animated SVG, large
on an A1 Section stage with Pause/Play, Replay, speed, size, background,
confetti and a reduced-motion preview. The shared `Fenex` component also powers
the Submission celebrations option. See [the Fenex contract](labs-fenex.md).

### Fitted type

`/experiments/fit-text` scales each line of text to fill its container, so
shorter lines are larger. Options cover line breaks (written, word per line,
balanced), fill or match sizing, container width, size cap, font, weight,
alignment and size labels. See [the fitted type contract](labs-fit-text.md).

### Submission celebrations

`/experiments/celebrations` submits a short waitlist form and celebrates seven
ways: check, rings, stamp, sparkles, Fenex (an animated SVG fox), fireworks and
confetti (with an amount).
Particles are a tested Canvas 2D model in a top-layer popover. See
[the celebrations contract](labs-celebrations.md).

### Dialog motion

`/experiments/dialog-motion` gives the A1 Dialog nine enter/exit animations
(Default, Fade, Scale, Pop, Slide, Flip, Swing, Blur, From the button), with
direction and exit for the directional ones, plus scrim color, opacity and
blur. Pure CSS (`@starting-style`, `overlay`). See
[the dialog motion contract](labs-dialog-motion.md).

### Contextual help

`/experiments/contextual-help` shows help for one field five ways (hint,
tooltip, popover, inline expansion, dialog) with four triggers (help button in
or beside the field, text button, field focus), disabling poor combinations
with a reason. See [the contextual help contract](labs-contextual-help.md).

### Password strength

`/experiments/password-strength` compares seven strength meters on an A1
TextField (Segments, Bar, Ring, Underline, Badge, Checklist, Time to guess)
with 3–5 levels, length and character rules, update timing and suggestions.
A pure local model estimates strength; see
[the password strength contract](labs-password-strength.md).

### Checkbox motion

`/experiments/checkbox-motion` animates the A1 CheckboxGroup's check, uncheck
and mixed states (Default, Pop, Draw, Fill, Flip, Jelly, Pulse, Slide) with a
Select all box that turns mixed for partial selections. Speed uses motion
tokens; sizes are `component.checkboxMotion`. See
[the checkbox motion contract](labs-checkbox-motion.md).

### Mode switches

`/experiments/mode-switches` offers five light/dark controls that drive the real
Labs mode, one at a time from a side-panel ChoiceGroup: binary (ball-chain pull
cord with spring physics, sun and moon A1 Switch) and
tri-state with Auto (dial, eclipse, draggable slide switch). Mode changes can
fade or reveal from the control (View Transitions) over a motion-token duration.
`App.jsx` passes `appearance` to experiments for this. See
[the mode switches contract](labs-mode-switches.md).

### Labs appearance settings

Both Labs headers expose Settings using the same A1 Menu, theme SelectField and
Light/Dark/System SegmentedControl as a1-web. The choices and class mapping come
directly from `apps/a1-web/src/lib/appThemes.ts`; Labs also loads the same theme
font assets. Labs stores its own preferences in `a1-labs-theme` and
`a1-labs-color-mode`. New sessions and Reset to defaults use Default + Dark.
System mode follows OS changes while the page is open. Invalid or inaccessible
browser storage falls back to defaults without preventing appearance changes.
The menu uses the shared responsive dialog, keyboard and focus behavior.
CSS review: no app-specific styles or new theme tokens. The shared SegmentedControl
now relies on its existing semantic text colors in dark and inverse scopes;
removed legacy overrides that made inactive icons too dim. This belongs in the
design system. Guidance should prefer mode-aware semantic roles over additional
dark-only component overrides.

### Verification journey

`/experiments/verification-journey` uses a 19-field prefilled application, A1
StickyActions inside the responsive viewport (Tablet by default), 6 simulated
API checks and a receipt. Five scenarios cover normal/fast/slow, retry recovery
and a bounded failure. Checks and reload recovery run automatically; there is
no pause control. See [the contract](labs-verification-journey.md).

Shared `ResponsivePreviewFrame.jsx` and `preview-scale.js` fit both available
axes, subtracting bezel, caption, host padding/panel boundaries and visible
BottomSheet height. Device dimensions and iframe scroll remain unchanged.

### Color visualization release checks

The Three.js Canvas wrapper has `role="group"` so its descriptive label is
valid. The A1 Web route check waits for the selected token label before its
screenshot; page-shell readiness does not guarantee the lazy 3D scene has
rendered. The existing token controls provide the keyboard alternative.
