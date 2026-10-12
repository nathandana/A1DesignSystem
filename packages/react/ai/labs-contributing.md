# A1 Labs contribution and versioning guide

This guide applies to `apps/a1-labs/` and changes made elsewhere specifically to
support Labs. The [central project context](project-context.md),
[project workflows](project-workflows.md), [component registry](components.md)
and [accessibility policy](a11y-policy.md) still apply. Read the
[Labs README](../../../apps/a1-labs/README.md) for commands and the source map.

## Before changing the app

For Labs backlog work, read [the app TODO](../../../apps/a1-labs/TODO.md).
Keep pending tasks there and remove completed items once their outcome is
recorded in the changelog. A TODO entry records planned work; it does not mean
the feature has been implemented.

1. Inspect the current branch, working tree, app version and changelog. Preserve
   existing user changes. Do not stash or switch branches unless the task calls
   for it.
2. Read `apps/a1-labs/AGENTS.md`, this guide and the relevant implementation.
   Check the registry before creating a control or layout component.
3. Identify the scope: Labs only, shared tokens or shared component behavior.
   Shared changes require the affected packages, stories, configurators and
   documentation to be updated under the central workflow.

## Add an experiment

1. Add an entry to the end of `apps/a1-labs/src/experiments.js` with a unique
   `id`, `addedIn` (first release), `category`, nonempty `types` and `tags`, `title`, `description`, `href`, A1 `icon`,
   `preview` and `previewAlt`
   (there is no `slot`; `addedIn` drives chronological sorting). Add a static
   concept image to `public/previews/`; keep its description meaningful and the
   card free of nested controls. Use `/experiments/<id>` for its URL. Registry
   entries supply both gallery cards and the searchable tree. Every experiment
   must reference one of the category IDs in `experimentCategories`; do not use
   the category to reorder gallery cards. Use only IDs from `experimentTypes` in
   the `types` array; assign all relevant types (typically 1–2) by purpose, not
   merely by which demo controls appear. Read [the home filter contract](labs-home.md).
   Supply concise search synonyms in `tags` (for example, Drag for Reordering,
   DOB for Date of birth). Use unique, meaningful terms rather than unrelated
   keywords. These search aliases are separate from governed type metadata.
   Gallery and sidebar must both use `matchesExperiment`.
   Do not render placeholder cards.
2. Implement the experiment in its own directory under `src/`. Keep rendering,
   configuration and state ownership clear. Register its page in the ID mapping
   in `ExperimentPage.jsx`. Each page owns its experiment state and passes its
   controls and content to `ExperimentLayout.jsx`, which owns search, navigation
   and responsive panels. Preserve state when controls move into the mobile sheet.
3. Gallery counts, numbers and descriptions come from the registry. Preserve
   registry order for stable numbering and sidebar order; use first-release
   metadata for chronological gallery sorting. Never update `addedIn` for edits. Use A1 Grid with xs 1, sm/md 2, lg 3 and xl 4 columns, equal
   column widths and content-driven heights. The document scrolls; do not
   restore an inner scrolling gallery, canvas centering, fixed card widths or
   drag-to-pan.
4. Reuse the shared page shell: searchable tree, central experiment and
   configuration panel. Preserve SideNav's overlay behavior and the mobile
   BottomSheet. Read breakpoint tokens rather than adding new breakpoints.
5. Use A1 controls and semantic tokens. Add missing visual tokens before using
   them, and rebuild generated outputs. Keep defaults and configurable values
   documented. Do not present a simulated result as a connected service.
   To hide an experiment, set `hidden: true` in its registry entry. It leaves
   the gallery, sidebar, search and count, but its address keeps working
   (`allExperiments` routes; `experiments` lists). Remove its About link too.
   In the narrow configuration panel, don't combine `Toolbar fullWidth` with
   labelled options: equal shares clip longer labels. Use
   `labelMode="selected"` when options have icons, or let the toolbar size to
   its content.
6. Follow the isolation and promotion contract below. Keep the reusable pattern
   or component separate from its Labs page and configuration controls.

Card previews use A1 Figure at 16:9 inside responsive grid cards. Keep imagery current
when an experiment's concept changes. With the Labs dev server running,
`npm run capture:previews --workspace=a1-labs` refreshes the current assets
using Playwright and the actual renderers. Extend that capture script for new
experiments. Static captures do not animate in the gallery or change with the theme.
Frame the experiment itself, excluding Labs navigation, configuration and helper
copy. For Mobile data tables, keep the live iframe and fit only its device
viewport into the export; cloning an iframe loses its rendered content. Fitted
type captures the measured text container. Segmented controls should use a
settled selection, not an ambiguous mid-stretch indicator.

## Isolate experiments and prepare them for A1

Labs exists to validate patterns and components that can be readily exported
into A1. Design each experiment around a reusable implementation, with Labs
providing the demonstration and validation environment.

- Keep each experiment's CSS beside its implementation in its own `src/`
  directory, imported by that implementation. Do not put experiment styling in
  the Labs global stylesheet, shared shell, another experiment or A1 Web styles.
  Shared shell and preview-frame styles remain owned by those shared components.
- Scope every experiment selector to a unique `a1-<experiment>-` namespace or
  experiment root. Namespace keyframes and custom properties too, including
  registered `@property` names, because those remain global. Local file placement
  alone does not isolate CSS. Do not target global elements, `:root`, another
  experiment or shared A1 classes to change their styling.
- Use A1 components, props and theme tokens first. Isolation does not authorize
  duplicating system controls, hardcoding visual values or overriding shared
  components locally. Missing tokens belong in `system/tokens/`, with an
  experiment-specific component namespace and documented dependencies.
- Keep the reusable implementation independent of Labs routing, navigation,
  settings storage, configurator and device-preview infrastructure. Pass state
  and configuration through explicit props or callbacks. Keep simulation data
  and demonstration scaffolding outside the reusable core. Do not import another
  experiment's private CSS or implementation.
- Document the intended A1 pattern or component, its public inputs and events,
  required tokens/assets, supported states and validation results. A consumer
  should be able to use the implementation and its stylesheet with A1 without
  copying the Labs app or importing A1 Web's global CSS.
- Before calling an approach validated, check it outside the Labs shell in a
  minimal A1 host, verify that its CSS neither leaks into neighboring content
  nor depends on another experiment, and record relevant responsive, theme,
  keyboard, screen-reader and reduced-motion checks. Follow the focused-check
  policy below; distinguish completed checks from remaining work.
- Promotion into A1 follows the normal shared component/pattern workflow,
  including affected packages, stories, examples, documentation and changelogs.
  An experiment is a candidate until that validation and integration are done;
  creating it in Labs does not by itself establish a validated A1 component.

## Segmented control transitions contract

Read [Segmented control transitions](labs-segmented-motion.md) before changing
these. Render the A1 SegmentedControl unchanged; draw travelling backgrounds
as one `aria-hidden` indicator placed by its left/right edges after the
control, and per-segment effects with `::before`. Carry the selected index
with each measurement, keep movement inside `prefers-reduced-motion:
no-preference`, keep `default` identical to A1, and keep values in
`component.segmentedMotion` and the motion tokens.

## Accordion transitions contract

Read [Accordion transitions](labs-accordion-motion.md) before changing these.
Use the real A1 Accordion; restyle only its body, body content and chevron
inside `.a1-accordion-motion[data-motion]`, keyed off `.a1-accordion--open` so
closing animates too. Keep movement inside `prefers-reduced-motion:
no-preference`, keep `default` identical to A1, and keep distances in
`component.accordionMotion` tokens with durations from the motion tokens.

## Radio buttons contract

Read [Radio buttons](labs-radio-variants.md) before changing these variants.
Build on the A1 RadioGroup; restyle only the radio control inside a
`.a1-radio-lively[data-variant]` namespace. Animate with `scale`,
`box-shadow`, registered custom properties and the dot's background (no
layout shift); travelling copies must be `aria-hidden`, pointer-transparent
and removed when they land. Keep all movement inside
`prefers-reduced-motion: no-preference`, never animate on load or for
disabled options, and keep sizes in `component.radioVariants` tokens.

## Mobile data tables contract

Read [Mobile data tables](labs-mobile-tables.md) before changing it. Show
patterns in the shared device preview, switch to the standard A1 DataTable at
the md breakpoint token (`--bp-md-up`), build patterns from A1 components
first, and keep column/formatting adapters pure and tested in `table-data.js`. Records come from the shared sample-data module. Compact variants share one
row renderer: place status beside the title, derive labels/legend from columns,
keep the unnumbered legend in an A1 Card, and keep choice subtext brief.

## Bulk actions contract

Read [Bulk actions](labs-bulk-actions.md) before changing it. Keep the bar in
place as the selection changes, with `aria-disabled` actions so focus is never
lost, and remove deleted rows from the data set only after any exit animation.
Keep motion in `component.bulkActions` tokens and inside
`prefers-reduced-motion: no-preference`. Add new styles to
`BULK_STYLES` with their own summary, use the shared inventory, and check each
style against the recorded findings (focus after an action, more than one
action, confirmation or undo, select-all scope).

## Data grid contract

Read [Data grid](labs-data-grid.md) before changing it. Use A1's experimental
`DataGrid` wrapper from `packages/react/src/components/data-grid/` without
changing it here. Keep sorting, validation and totals in the tested
`grid-model.js`, keep the page lazy-loaded, and keep react-data-grid pinned to
the same exact version as A1 and a1-web.

## Fenex contract

Read [Fenex celebrates](labs-fenex.md) before changing the character. Keep
`fenex-celebrate.svg` self-contained (no script, `<title>`, movement only under
`prefers-reduced-motion: no-preference`, every class, keyframe and id prefixed
`fenex-`). Use the shared `Fenex` component rather than another copy, give
looping placements a pause control or `settleAfter` under 5 seconds, and keep
the artwork palette documented as an exception.

## Fitted type contract

Read [Fitted type](labs-fit-text.md) before changing it. Keep line breaking
and sizing pure and tested in `fit-model.js`. Measure and apply sizes in one
layout pass, refit on resize and font loading, keep the text as real text,
and wrap rather than shrink below the display minimum. Fonts and limits come
from type tokens and `component.fitText`.

## Submission celebrations contract

Read [Submission celebrations](labs-celebrations.md) before changing these
celebrations. Keep celebrations decorative (`aria-hidden`) with focus on the
success message, rest every style on a still final state, keep particle
physics pure and tested in `particles.js`, and draw particles in a top-layer
canvas that ignores pointer events and hides itself. No movement or particles
with reduced motion; no flashing.

## Dialog motion contract

Read [Dialog motion](labs-dialog-motion.md) before changing these animations.
Build on the A1 Dialog and leave focus, Escape and backdrop clicks to it.
Animate the native `<dialog>` and `::backdrop` with CSS: `@starting-style` to
enter, the closed state to exit, and `display`/`overlay` discrete transitions
under `@supports (overlay: auto)`. Keep all movement inside
`prefers-reduced-motion: no-preference`, keep `default` identical to A1, and
don't render dialogs as later children of a Section.

## Contextual help contract

Read [Contextual help](labs-contextual-help.md) before changing the patterns or
triggers. Keep the pattern/trigger compatibility rules in `help-model.js` with
a reason for every disabled pair. Use A1 Tooltip and Dialog where they fit.
Popovers must move focus in, return it on close and sit after their trigger in
the DOM. Inline help must leave the accessibility tree when collapsed.

## Password strength contract

Read [Password strength](labs-password-strength.md) before changing the meters
or the model. Keep the model pure, local and tested; never send or store what
is typed. Every style must name the level in words (not colour alone), expose
one `role="meter"` with value text, and announce changes only after typing
pauses. Use A1 status roles for tones and `component.passwordStrength` tokens
for sizes and delays.

## Checkbox motion contract

Read [Checkbox motion](labs-checkbox-motion.md) before changing these variants.
Build on the A1 CheckboxGroup; restyle only the checkbox control inside a
`.a1-checkbox-lively[data-variant]` namespace. Animate only boxes tagged with
`data-a1-animate`, use `scale`, `transform` and background layers (no layout
shift), keep the mixed state on the native input, keep all movement inside
`prefers-reduced-motion: no-preference`, keep `default` identical to A1, and
keep sizes in `component.checkboxMotion` tokens.

## Mode switches contract

Read [Mode switches](labs-mode-switches.md) before changing these controls.
Every control drives the real Labs mode through the `appearance` prop that
`App.jsx` passes to experiments; binary controls show the resolved mode and
choose an explicit one, tri-state controls can choose Auto (`system`). Route
mode changes through the page's transition runner (View Transitions, token
durations, instant for reduced motion). Keep
native button/switch/slider/radio semantics, distinct names, the status
message, and reduced-motion fallbacks. Keep physics and mode logic pure in
`mode-model.js` with tests, and every size, palette value and timing in
`component.modeSwitches` tokens.

## Flip billboard contract

Read [Flip billboard](labs-flip-billboard.md) before editing the landing-page
hero. It shares `src/split-flap/` with the clock; keep that mechanism independent
of either experiment's private CSS. Preserve semantic headings and links outside
the canvas, valid-copy retention, pause controls and instant reduced motion.
Render directly in the workspace without a device frame. Start changed cards together and cycle each through the character wheel to its
target; nearer characters finish first. Keep only the flip display in the demo, without an eyebrow, with playback in configuration.
Derive stock from the resolved Light/Dark/Auto setting; preserve live system
mode updates. Automatic rotation must stop with reduced motion. Recheck the clock whenever
shared geometry, lifecycle or flap animation changes.

## Step tracker contract

Read [Step tracker](labs-step-tracker.md). All six variants must render the real
A1 StepTracker and stay noninteractive, with neutral position-only colors and
visible step context. Keep variant CSS isolated, preserve default A1 styling,
and retain reduced-motion/forced-color fallbacks. Tracker transitions must cancel
on setup/width changes, preferences and unmount; remove decorative rings on
completion or cancellation. Motion uses `component.trackerMotion` and semantic
timing tokens. Navigation belongs to the host.

## Chat contract

Read [Chat](labs-chat.md) before editing it. Keep simulated replies in the host,
with cancellable queued timers, and keep ChatConversation controlled. Animate only
new messages; retain named senders, a polite addition-only log, keyboard/IME
handling, reading-position retention and live reduced-motion/forced-color fallbacks.
Never imply real delivery or a connected AI service. Keep message CSS isolated.

## Tabs contract

Read [Tabs](labs-tabs.md). Keep all eight treatments on A1 Tabs with the default
unchanged, local opt-in CSS, a named tablist and focusable active panel. Current
tabs have no hover/pressed feedback; folder selection stays neutral and joins the
content sheet without a bottom border or visible seam. Preserve keyboard navigation, internal
overflow and reduced-motion scrolling.

## Steps contract

Read [Steps](labs-steps.md). Use A1 progress tabs for all eight treatments, keep
Default unchanged, isolate opt-in geometry in `steps.css`, and preserve explicit
completion versus navigation, labeled states, keyboard behavior and scroll scope.

## Button interaction contract

Read [Button interactions](labs-button-motion.md). Keep all six treatments on
real A1 Buttons, with motion isolated to wrappers and the decorative ripple.
Preserve native activation, focus, disabled/loading and still fallbacks. Ripple
replaces Jelly: do not distort the button with nonuniform scaling.

## Three.js switch contract

Read [Switch transition 3D](labs-switch-three.md) before editing this separate
experiment. Share A1 Switch and switch-morph tokens, not another experiment's
private CSS. Keep the native input in charge, preserve live palette updates,
instant reduced motion, forced-color/WebGL fallback and cleanup of GPU resources.

## Flip clock contract

Read [Flip clock](labs-flip-clock.md) before editing the split-flap experiment.
Keep the host's clock source separate from the controlled Three.js core, animate
only changed digits, preserve readable front/back faces and honor reduced motion
live. The canvas is decorative; retain the non-live accessible timer, pause and
WebGL fallback. Dispose graphics resources and stop frames when idle. Keep scene
materials and geometry in `component.flipClock` tokens and the route lazy-loaded.
Keep both Station clock and Compact cards choices. Compact has a smaller,
transparent stage without housing, feet, corner screws or recessed surrounds;
changing variants must preserve the host time, playback and format. Zero resets
cycle backward through every intervening digit within the selected total
transition duration. Preserve immediate reduced-motion updates and actual
accessible time; do not apply the clock timing rule to billboard characters.

## Slides contract

Read [Slides](labs-slides.md) before changing this experiment. Keep transition
and build logic pure in `slide-motion.js` with tests. Slides mark pieces with
`data-part`, shared pieces with `data-morph` and points with `data-build`; give
morph pairs matching keys and similar proportions. Keep the outgoing slide
`aria-hidden` and `inert`, the status announcement and reduced-motion cuts.
Use only tokens: live semantic roles for slide colour, `component.slides`
tokens for ramp swatches, ratio and transition choreography, and no z-index.

## Form experiment contract

Read [Long forms and date-of-birth studies](labs-form-experiments.md) before
changing these examples. Keep the same 20 sections and 60 questions across all
long-form treatments (paginated, side navigation, visual grouping), preserve
answers/location when switching or changing 1/4 sections per page and distinguish
position from completion. Preserve hidden-field error navigation and mobile
focus management. Both apps import the Labs-owned date-of-birth examples;
update that single source, not a fork. Render date-of-birth studies directly in
the workspace without a device preview or viewport controls. Select studies with
a ChoiceGroup in the right configuration panel, using the shared mobile sheet. Use shared field
sizing and labels.

## Timeline contract

Read [Timeline](labs-timeline.md) before changing this experiment. Keep the
connector shape (axis, quarter arc around the badge, sharp turn into a stem,
hollow node) and keep its path math in `timeline-geometry.js` with tests. Lay
milestones out with CSS grid and draw connectors from measured positions; keep
the milestones an ordered list with decorative badges and connectors. Use live
semantic colour roles, not the build-time chart series tokens.

## Verification journey contract

Read [Verification journey](labs-verification-journey.md) before changing it.
Keep the service simulation and session persistence separate from the controlled
progress composition. Every active service needs an indeterminate linear StatusBar with
`showPauseControl={false}`; completed checks drive the overall determinate count. No invented
within-request percentages. Render a service only after it starts; append new
facts without replacing existing details. Keep the overall summary stable and
use the same indicator footprint for running, complete and error states. Use
Card’s built-in icon treatment for status icons and keep linear progress bars separate. Checks, retries and interrupted-run recovery are
automatic; do not add pause/continue controls during processing. Retrying a
blocking error skips completed work. Keep storage claims accurate, keep the
receipt explicit about simulated effects and preserve native form validation.
On overall success, hide individual service cards, including restored receipts;
retain the summary, receipt, activity log and saved check data. Keep service cards
visible during processing and blocking errors.
Use A1 StickyActions with ButtonContainer inside the shared device preview.

## Shared viewport fitting

The A1 Web ResponsivePreviewFrame fits both available width and height. Keep
actual iframe dimensions fixed; only scale its outer presentation. Include the
caption, bezel, ancestor panel bounds and bottom-sheet footprint. Recalculate
on resize, panel changes and sheet resizing without remounting the preview or
losing its state. Do not add per-experiment scale overrides.

## Required fields contract

Read [Required fields](labs-required-fields.md) before changing this
experiment. Keep the form, rules and variations in `form-model.js`; the form
component stays controlled. The variations are deliberately new
alternatives: do not reintroduce A1's asterisk or Required badge (no A1
`required` or `error` props on the fields). Every variation must state its
convention, keep `aria-required` on required controls (or hidden "required"
text in group legends) and mark missing fields on submission with text
messages wired through `aria-describedby`.

## Billboard with actions contract

Read [Billboard with actions](labs-billboard-actions.md) before changing this
composition. Keep sample copy and navigation destinations in the host. Use A1
Section/Grid/Stack/Card/ActionTile props and token-backed surfaces; no local
styles are needed. Entire action cards/tiles are links with static children.
Preserve the shared responsive preview and theme/mode behavior.

## Reordering contract

Read [Reordering](labs-reordering.md) before changing this experiment. Keep the
controlled item order separate from the temporary insertion preview; emit only
committed drops/moves. Preserve keyboard pickup/drop, move buttons, cancellation,
focus and position announcements. Motion belongs to isolated item wrappers,
not shared Card/Button CSS. Reduced motion must also cancel running animations.
The Magnetic grid measures fixed slots at pickup, uses token-backed spring
physics and snap hysteresis, and keeps Undo in the host. Scroll/layout changes
cancel pickups so stale measurements never commit a move.

## Verify button contract

Read [Verify button](labs-verify-button.md) before changing this experiment.
Elapsed time must never submit an action: confirm only on a deliberate release
after verification or a separate review confirmation. Keep the click-only path,
Escape/blur/visibility/pointer cancellation and single callback per session.
Use A1 buttons with their native focus styles; isolate the decorative safety
mechanism. The demo is simulated, and `onVerify` means intent, not server success.

## Nodes and canvas contract

Read [Nodes and canvas](labs-connected-nodes.md) before changing this experiment.
Compose the existing A1 Canvas, Node and NodeConnector; do not fork their styles
or interaction code. Keep graph data in the host, refit on resize, preserve
edits across mobile configuration changes and retain keyboard nudge controls
and the text connection list.

## AI thinking contract

Read [AI thinking](labs-thinking-terminal.md) before changing this experiment.
Keep simulated chat and sample copy outside the reusable ThinkingTerminal.
Replace each thought in the same background-free text row beneath Assistant;
do not append a history or add a separate visible Thinking heading. The cursor
height is 1em so it follows the text size.
Preserve length-based typing/reading time, random selection without immediate
repeats, pause, safe text rendering and a static reduced-motion state. Keep Stop/Resume
and Finish thinking in configuration, not the chat content. Do not
announce individual characters or cycle every joke through a live region.

## Switch transition contract

Read [Switch transition](labs-switch-morph.md) before changing this experiment.
Keep the same two stroke elements mounted as their positions and lengths change
and their ink rotates 90 degrees;
do not substitute icons or use cross-fades for the X/checkmark transition.
Keep the preview free of a surrounding card and redundant On/Off text.
Use A1 switch tokens for general styling and preserve the native switch's label,
checked/disabled state, Space-key activation and reduced-motion behavior. Keep
`MorphSwitch` independent of the Labs shell and its configuration controls.
Preserve the standard 1× option alongside 2×/3×/4× and the 4× demo default.
Duration detents use A1 motion tokens (100/150/200/300/750 ms); keep the 100 ms default
and immediate reduced-motion behavior at every duration. At 1×, match the whole
default A1 Switch, including label typography and row spacing/padding. Preserve
the gentle, nearly even easing token across the thumb and stroke transitions.

## Page loaders contract

Read [Page loaders](labs-page-loaders.md) before changing Blueprint, Jigsaw,
Fresh paint, Sunrise or their shared `src/loading-preview/` scaffold. Keep each
loader's core independent (React plus `loader-utils.js`), its timeline pure and
tested, the page out of the tab order until ready, and a still reduced-motion
equivalent. Use live semantic roles where colours must follow light/dark —
component colour tokens are fixed at build time.

## Under construction contract

Read [Under construction](labs-page-construction.md) before changing this
experiment. Keep the crane timeline pure and tested in `construction.js`, keep
block placement driven by live measurement of `data-construction-block`
wrappers, keep the crane decorative with loading exposed through `aria-busy`
and a polite status, and keep the reduced-motion variant static.

## Color token visualizer contract

This experiment shows a1-web's Foundations color visualization as is. Do not
fork it into Labs: change `ColorVisualizationFoundation.jsx` and its adjacent
`color-visualization.css` in a1-web, keep `useColorVisualization` returning
`{ controls, content }` for both hosts, and record the change in both
changelogs. Keep the Labs page lazy-loaded in `ExperimentPage.jsx` so three.js
stays out of the canvas and other experiments.

## Frosted glass contract

Read [Frosted glass](labs-frosted-glass.md) before changing this experiment.
By the user's request it is exempt from the token and theme rules: raw values
and a fixed light-glass look, kept inside its namespaced stylesheets. Do not
copy that exception to other experiments. Keep the frost on each pane's
`::before` so nested panes blur the real backdrop, keep depth driven by
`GlassPane` nesting, and keep the sample scaffolding out of the core. Preserve
the glass-tile finish: translucent top edges, broad polished bevels, restrained
tint and soft contact shadows. Put prefixed CSS filter/mask declarations before
standard declarations, and verify the computed blur and hollow rim in a
production build; declaration ordering previously removed those effects.

## Button completion contract

Read [Button completion](labs-button-completion.md) before changing this
experiment. Keep the A1 Tabs that separate the Send email (first, default) and Publish versions.
Publish must never change width; Send email is one fixed-size button that never resizes, shows its result inside, and its flight speed must follow the real send time. Both
take their colours from A1 button tokens, keep focus on the native button, show
a visible polite status that names the result, and remove motion with reduced
motion. Keep the simulated work, copy and configuration out of
`CompletionButton` and `SendButton`.

## Focus experiment contract

Read [Focus state animations](labs-focus-animations.md) before changing this
experiment. Preserve its explicit per-control opt-in and isolated CSS scope.
The user authorized replacing default focus styles only for this demonstration;
do not extend those overrides to the Labs shell, configuration or shared A1 CSS.
The ChoiceGroup has eight treatments, including persistent Subtle zoom and Gentle
lift. Keep their movement tokenized and reset scale/translate for reduced motion.
Keep a persistent focus indicator during and after every treatment, with instant
reduced-motion and forced-colors fallbacks. Update the implementation contract
and recorded validation whenever supported controls or treatments change.

## Search shortcut contract

`/` and Cmd/Ctrl+K open the sitewide search overlay on every page, as in
a1-web. Read [the home search contract](labs-home.md#search-keyboard-shortcut)
before changing this behavior. Preserve editable input, modal/menu interactions
and preview portal handling. The shortcut is not configurable;
do not add a keyboard toggle or persist an enable/disable preference.

## Sidebar category contract

`src/experiments.js` owns `experimentCategories`, each experiment’s required
`category`, and `experimentTree(search)`. Categories are the tree's top level,
with no parent item, in this order: AI (`ai`), Page loading (`loading`), Controls and interaction
(`interaction`), Layout and surfaces (`layout`), Data and visualization (`data`).
Experiment order within each group follows the registry. Category tree IDs use
`category-<id>` so they cannot collide with experiment IDs.

The initial expansion is the current experiment’s category. The Labs header
links back to the gallery.
Search uses the shared `matchesExperiment` function for titles, descriptions,
category/type labels and curated tags. Every normalized query term must match.
It hides empty groups and opens matching groups. Clearing it restores the initial expansion.
A category-name match includes every experiment in that group. Category label
activation toggles its group without closing the mobile SideNav; actual links
close it. Keep TreeMenu's arrow-key expansion and explicit Enter/Space link
navigation. Reuse A1 TreeMenu; do not add local styling for category branches.
The gallery follows the selected alphabetical or first-release sort, independently
of sidebar group order. Category/type filter controls are retired.

## Preserve shared behavior

- The shared header’s Experiments menu uses A1 TopHeader `menuHeader` search and
  category submenus, as in A1 Web’s Components menu. Generate it through
  `experiment-menu.js` from `experimentTree`; never maintain a separate list.
  Keep the gallery link, hidden-item exclusion, tags/search, keyboard submission,
  empty-results status and mobile search. See [Home](labs-home.md#experiments-header-menu).

- `ExperimentLayout` shows its visible experiment title and sidebar opener only
  while SideNav uses its overlay layout: xs/sm/md, through 1,024px. At lg/xl
  (1,025px+) the persistent tree identifies the experiment; keep an `a1-sr-only`
  h1 for heading navigation and the document title, without a visible title row.
  Derive this boundary from the md maximum breakpoint token, independently of
  the configuration sheet's sm maximum. Listen for live viewport changes.
- Begin the center workspace with the experiment itself. Do not add introductory
  summaries or redundant promotional headings below the shell header. Put
  experiment/configuration guidance in the configuration panel. Preserve actual
  example content, field instructions, data labels and status/progress/error messages.

- `/about` explains Labs and links to A1 Web. `/release-notes` owns the public
  history from `CHANGELOG.md`; do not duplicate the history on About. Keep both
  pages in the shared `LabsHeader.jsx` and sitewide search, with appearance
  settings available. Preserve the redirect from `/about#release-notes` and
  point new release-history links directly to `/release-notes`.
- Public release notes use dated `## X.Y.Z — Month D, YYYY` headings and top-level
  `- ` bullets, with wrapped continuation lines, bold text and inline code.
  Keep this format or update `release-notes.js` and its tests when extending it.
  Unreleased work is excluded; the displayed current version comes from the
  package file. Do not maintain a second copy of release history.

- Appearance uses a1-web's theme registry and Labs-specific preference storage.
  At md+ show mode segments and the theme select inline in the header; keep
  Settings on smaller screens. Follow
  the [shared appearance contract](labs-home.md#shared-appearance-controls).
  New sessions default to dark mode; Light, Dark and System remain available.
- Theme and mode changes must update experiments without losing their state.
  Preserve paused and completed output when appearance changes.
- Animated experiments must respect live `prefers-reduced-motion` changes and
  provide pause/replay where appropriate. Avoid motion in the reduced variant
  while keeping progress and completion understandable.
- Keep controls labeled and keyboard accessible. Use meaningful canvas/image
  descriptions, truthful progress and appropriately paced live announcements.
- Navigation cards must not contain nested interactive controls. Direct
  experiment URLs must work through the static-host SPA fallback.
- Keep development port 5187 and preview port 4189 with strict port selection.
- The page-loading experiment reuses a1-web's `ResponsivePreviewFrame.jsx`, its
  adjacent stylesheet and device presets. It defaults to Phone (xs). The frame
  scales including its bezel and mirrors root theme classes, attributes and
  inline tokens into the iframe. Keep style changes alongside that shared frame,
  not in a copy of a1-web's global stylesheet. Loading-border CSS is specific
  procedural artwork; its dimensions and durations live in page-loading tokens.
  Preserve the two blurred layers and use only live semantic theme colors
  (accent, info, success, warning and error), never a fixed spectrum.
  While loading or paused, show a short centered heading and a small tertiary
  Stop animation / Resume animation button inside the viewport. Keep this button
  synchronized with sidebar playback state and omit explanatory UI copy.
  Mount sample page content only after Finish loading; Replay returns to the
  explanation. Keep screen-reader-only loading announcements outside the busy preview, using
  the shared `a1-sr-only` utility.

## Version every completed change

Labs has an independent `MAJOR.MINOR.PATCH` version. Its source of truth is
`apps/a1-labs/package.json`; do not bump the repository or unrelated packages
just because Labs changes. Version 0.1.0 records the original canvas. Version
0.2.0 establishes the experiment workspace, animation and current contribution
workflow as the next development baseline. A numbered baseline does not imply
deployment or publication.

| Change | Version increment |
| --- | --- |
| New experiment, feature or compatible configuration option | Minor, resetting patch to 0 |
| Bug fix, accessibility correction, styling refinement, documentation or maintenance change | Patch |
| Breaking route, configuration or behavior contract while below 1.0.0 | Minor, with an explicit breaking-change note and migration guidance |
| Stable public contract milestone | 1.0.0 |
| Breaking public contract at or after 1.0.0 | Major, resetting minor and patch to 0 |

For mixed changes, use the largest applicable increment. Bump once per completed
logical change or explicitly grouped release, not once per edit, file, test run
or review correction. A follow-up feature after a completed change gets its own
version. Do not bump for a read-only investigation that changes no files.

**A Labs change is incomplete until all of these are updated together:**

1. The `version` in `apps/a1-labs/package.json`.
2. The matching version in the root `package-lock.json` under
   `packages["apps/a1-labs"]`. Preserve unrelated lockfile entries.
3. A new, newest-first section in `apps/a1-labs/CHANGELOG.md`, formatted
   `## X.Y.Z — Month D, YYYY`, with the actual change date. Describe the change
   and its user-visible effect; include the ticket reference when one exists.
4. Relevant README and agent guidance updates described below.

The latest numbered changelog heading must match both package versions.
`Unreleased` can hold in-progress notes, but move completed work into its numbered
section before finishing. Preserve previous version sections. Versioning alone
does not create a Git tag, commit, deployment or package publication; perform
those actions only when the task authorizes them. Shared packages affected by a
Labs task retain their own release process and changelogs.

## Keep instructions current

Review `apps/a1-labs/AGENTS.md` and this guide on every feature addition, change or
removal. Update them in the same change when routes, architecture, controls,
commands, dependencies, accessibility behavior or contribution steps change.
Keep this guide as the detailed policy source and AGENTS.md as its entry point;
do not accumulate conflicting policy copies.

Update `apps/a1-labs/README.md` for user/developer-facing behavior and setup.
Update the Labs section of `quick-orientation.md` when its details change, and
record policy or feature changes in `components-maintenance.md`. Add new context
links to the root AGENTS.md when needed; do not put detailed policies there.
Regenerate the MCP index with `npm run build:mcp-index` after central context
changes. Regenerate component history when its source entries change.

## Validate and hand off

- For code changes, run `npm test --workspace=a1-labs` and
  `npm run build --workspace=a1-labs`. Rebuild tokens first when tokens or themes
  change, following the central workflow.
- For UI changes, check the affected behavior across supported themes, light and
  dark modes and xs–xl breakpoints as relevant to the change. Do not repeatedly
  run a full theme contrast sweep for routine Labs additions; the user requested
  focused checks. Broaden contrast validation when colors, theme behavior or a
  specific regression justify it. Include keyboard/touch controls, responsive
  panels, direct navigation and live reduced-motion changes when relevant.
  Follow the accessibility policy for focused automated checks and document
  limits of assistive-technology testing.
- For documentation-only changes, verify links, command names and version
  consistency; do not run unrelated UI checks.
- Confirm the package version, lockfile entry and latest numbered changelog
  section agree. Review the diff and run `git diff --check`.
- Report what changed, the resulting version, validation and any unresolved
  limitations. End with the required CSS review: justify custom CSS or state
  that none was added.

## Automation and token studies

Read [Automation builder](labs-automation-builder.md) for sentence-to-block
conversion, controlled rule data, modal editing and local-only dry runs.
Read [Token studies](labs-token-studies.md) for styling the token name itself,
showing only one configured treatment, syntax coloring and authored-reference
tracing. Keep active theme values distinct from source relationships.

## Data table pagination

Read [Data tables](labs-data-tables.md) before changing its placement study. Use
the shared `paginationPosition` prop (top/bottom/inline), not CSS order or a
duplicated pager. Inline must wrap with available space and retain filter/page state.
Keep search and sorting before pagination, and document resets when data changes.

## Pagination types

Read [Pagination types](labs-pagination-types.md) before changing its six
navigation treatments. Keep A1 as the default, use the table's resolved pagination
context, validate direct jumps and preserve full-data filtering/sorting.

## Shared sample data

Read [Sample data and audit](labs-sample-data.md) before adding or changing
extended demonstration records. Use `src/sample-data/` and `DatasetSize` for
Small (10), Medium (100), Large (1,000) and intermediate counts. Keep generators
pure, deterministic and independent of UI; keep authored workflow/graph scenarios
local. Do not import another experiment's private fixtures. Preserve stable IDs,
grid edits and persisted deletions when switching sizes.

## Publish Labs

Read [Publishing Labs](labs-publishing.md) before changing deployment settings.
Keep the Labs project/configuration separate from A1 Web; use the explicit
Labs deployment commands and verify direct routes on a draft before publishing.
