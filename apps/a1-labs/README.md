# A1 Labs

A standalone playground for A1 Design System experiments, intended for
`labs.a1design.app`. Built with React, Vite and the shared A1 components and tokens.
The app defaults to dark mode and runs separately from a1-web.

Labs develops and validates patterns and components for export into A1. Each
experiment owns its scoped CSS and reusable implementation; the Labs shell and
configuration panels provide the demonstration environment. Keep the reusable
core independent of that environment and document its API, token dependencies
and validation results before promoting it. Follow the
[isolation and promotion contract](../../packages/react/ai/labs-contributing.md#isolate-experiments-and-prepare-them-for-a1).

## Form experiments

[Long forms](http://127.0.0.1:5187/experiments/long-form) compares pagination,
side navigation and visual grouping using one community-event plan:
20 sections with 3 questions each. Position, answer counts and fixed actions stay
visible. Pagination offers 1 or 4 sections per page. Switching layouts or page
size keeps edits and location. Submission takes you to any
unanswered question; configuration can fill the example or clear it.

The Forms category also contains all 7 date-of-birth studies from A1 Web: native
date, selects, numeric fields, auto-advance, mixed fields, single autoformat and
formatted date parts. A1 Web no longer has a Labs page; these studies live here. Choose a study from the choice group in the right configuration panel
(or the configuration sheet on mobile). It renders directly in the workspace
without a device frame or viewport controls, with a reset control. Each study’s
description appears directly below its input example, before the testing notes. See the [form experiment contract](../../packages/react/ai/labs-form-experiments.md).

## Verification journey

[Verification journey](http://127.0.0.1:5187/experiments/verification-journey)
starts with a prefilled 19-field workspace application. A1 Sticky Actions keeps
submission reachable. The interstitial reports 6 simulated API checks, each with
its own active progress indicator, completed state and result. Checks appear only
when they start; slow-service notices, retries and results append beneath the
existing details. The summary and indicator widths stay steady. Cards use A1’s built-in icon
treatment, with separate linear StatusBar indicators for each service and the overall count. Choose steady,
fast, slow, automatic recovery or service unavailable. Checks and retries run
automatically; there is no pause control. A blocking error explains what was
saved, which work never ran and how to recover. Success includes the exact
workspace, seat count, owner, project, reference and completion time. Individual
service cards disappear on success, leaving the summary, receipt and activity log.

Session storage keeps submitted values and completed checks in the same tab;
a reload automatically continues an interrupted run. Storage denial is shown
truthfully as memory-only retention. The application and receipt can be downloaded
as JSON. No real services, accounts or messages are involved. Retrying a blocking
error simulates a recovered service. See the [implementation contract](../../packages/react/ai/labs-verification-journey.md).

All device previews fit available width **and height**, including their bezel
and the mobile configuration sheet, without changing the simulated device’s
actual dimensions. Scroll long content inside the preview.

## Run locally

Use Node 24 and run these commands from the repository root:

```bash
npm ci
npm run build:tokens
npm run dev:a1-labs
```

Open [A1 Labs](http://127.0.0.1:5187/) or the
[AI image generation experiment](http://127.0.0.1:5187/experiments/ai-image-generation).
Port **5187** is reserved for Labs; the server fails if it is occupied instead of
choosing another port. No API keys or environment variables are required.

| Task | Command from the repository root |
| --- | --- |
| Start development | `npm run dev:a1-labs` |
| Build tokens and the app | `npm run build:a1-labs` |
| Preview the production build | `npm run preview:a1-labs` |
| Run unit tests | `npm test --workspace=a1-labs` |

Build output is `apps/a1-labs/dist`. The production preview uses
[port 4189](http://127.0.0.1:4189/). The app-local build
(`npm run build --workspace=a1-labs`) builds only the app and expects generated
tokens to exist. After token or theme changes, follow the repository workflow:
`npm run build:tokens && npm run build:html-css`.

## Explore experiments

The home page is a vertically scrolling gallery, newest experiments first. A1 Grid
uses one column at xs (through 480px), two at sm/md (481–1024px), three at lg
(1025–1440px), and four at xl (1441px and up). Cards fit the available width;
there is no canvas, horizontal panning or drag gesture.
Selecting an experiment card opens its dedicated page.

The count and a sort menu share a row above the cards: Name, A–Z; Name, Z–A;
Oldest first; Newest first (default), based on each experiment’s first release.
The URL stores `sort`, and reload restores it. Card numbers remain stable. The
page scrolls as one document with the Labs toolbar pinned at the top.

To find an experiment, use sitewide search: the search button in the toolbar,
`/` or Cmd/Ctrl+K. It opens the same large search overlay as A1 Web and matches
titles, descriptions, categories, types and curated keywords such as Drag, DOB
and modal. See the
[home search and sorting contract](../../packages/react/ai/labs-home.md).

Each card includes a static concept preview captured from the experiment, with
descriptive alt text. Cards use A1 Figure at 16:9, equal column widths and content-driven row heights.
Preview files live in `public/previews/`; the registry owns their paths and text.
To refresh the existing previews, start the Labs dev server, then run
`npm run capture:previews --workspace=a1-labs` from the repository root.

Experiment pages follow a1-web's component explorer structure: a searchable tree
on the left, the experiment in the center and configuration on the right. The
tree becomes an overlay at 1024 px and below. Configuration moves into a
resizable bottom sheet at 640 px and below, using the shared A1 breakpoints.

The tree groups experiments into **AI**, **Page loading**, **Controls and
interaction**, **Layout and surfaces**, **Forms**, and **Data and visualization**. It opens
the current experiment’s group by default. Click a group or use the arrow keys
to expand/collapse it. Search uses the same title, description, category, type and keyword matcher as
the gallery; searching a category shows all its experiments. Matching groups open automatically. Clearing
search restores the current experiment’s group. Categories only affect sidebar
navigation; the home gallery follows its selected sort.

At md and larger (641px and up), the main header shows an inline Light, Dark
and System segmented control at medium (`md`) size with visible labels beside its icons, plus a theme select. Smaller screens keep these
choices in Settings. Both use the same theme choices and modes as a1-web. Preferences are stored separately under `a1-labs-theme` and
`a1-labs-color-mode`. The initial appearance and reset defaults are Default + Dark.
Theme and mode changes redraw the animation without restarting it.

## About Labs and release notes

The [About Labs page](http://127.0.0.1:5187/about) explains the playground, links
to A1 Web and links to the separate [Release notes page](http://127.0.0.1:5187/release-notes).
Both pages are available from the shared header and sitewide search; on small
screens use the header menu. Old `/about#release-notes` links redirect to the new page. Release notes
read numbered sections from `CHANGELOG.md`, and the current version comes from
`package.json`. Unreleased notes stay out of the public page.

## Step tracker

Open `/experiments/step-tracker` for A1 default plus Rings, Segments, Ticks,
Numbers and Spotlight. Configure 3, 5 or 7 steps, current position and alignment.
Choose Standard, Instant, Fade, Slide, Pop, Bounce or Ripple transitions, with
a detented duration slider with 100, 300 and 500 ms (300 ms default). The position markers
stay noninteractive; Back/Next navigate the sample tour from a left-aligned
A1 ButtonContainer.
A visible step count also announces changes. All variants use neutral theme
tokens and honor reduced motion and forced colors.
See [the step tracker contract](../../packages/react/ai/labs-step-tracker.md).
Capture its card with `npm run capture:previews --workspace=a1-labs -- http://127.0.0.1:5187 --step-tracker-only`.

## Tabs

[Tabs](http://127.0.0.1:5187/experiments/tabs) compares eight treatments, one at a
time: A1 default, folder tabs, bold selected, pills, outline, raised, top rail
and bookmarks. Configure compact/default sizing, icons and counts. Folder tabs
use neutral surfaces and text that join the content sheet without a bottom seam;
current tabs have no hover or pressed feedback. Arrow keys, Home and End change
views; Tab enters the panel. Overflow stays inside the strip and reduced motion
makes scrolling immediate. See [the contract](../../packages/react/ai/labs-tabs.md).

## Steps

Open `/experiments/steps` to compare eight step presentations: A1 default,
Dots, Bars, Pills, Tiles, Chevrons, Vertical and Compact. Choose 3, 5 or 7 steps,
show tile descriptions or a simulated error, and use Back/Complete to explore
progress. Selecting a step never completes it. Keyboard navigation, reduced
motion and readable state labels remain available across treatments.
See [the steps contract](../../packages/react/ai/labs-steps.md).
Capture the card with `npm run capture:previews --workspace=a1-labs -- http://127.0.0.1:5187 --steps-only`.

## Flip billboard

Open `/experiments/flip-billboard` for a landing-page hero with a physical,
two-row split-flap headline. The demo shows only the display, without an eyebrow.
It shares the clock's Three.js mechanism. The first headline is “A1 Design” / “by the rules.”
Three editable headlines rotate every six seconds;
Changed cards start together and rapidly cycle through the character wheel.
Each stops at its target: a→c takes two steps; a→z takes 25. Choose 20/35/60 ms
per character. Card stock and housing
follow the Light, Dark or Auto appearance preference, including live system mode changes.
Pause or advance manually from the configuration panel. Invalid copy keeps the
last valid message, and reduced motion disables automatic rotation. The semantic
headline remains available if WebGL fails. The billboard renders
directly in the workspace and responds to the available width, with no device frame,
studio navigation, supporting copy or action cards.

See [the billboard contract](../../packages/react/ai/labs-flip-billboard.md)
for the controlled hero, shared mechanism, token dependencies and validation.

## Flip clock

Open `/experiments/flip-clock` for a Three.js station-style clock with hinged
black-and-white cards, recessed slots, metal pins and cast shadows. Only changed
digits flip. Resets to zero run back through the intervening cards (9→8→…→0)
within the selected transition duration, in both styles. Defaults: local time, 24-hour format, seconds visible, black cards,
angled view and a 500 ms flip. Choose Station clock for the original housing or
Compact cards for a smaller, frameless clock directly on the canvas. Compact
removes housing, feet, corner screws and recessed surrounds while retaining the
card layers and hinges. Configuration offers 12/24-hour format, seconds,
white cards, front view, 300/500/750 ms durations, pause/resume and a midnight
rollover demo. Reduced motion updates cards instantly; a readable time remains
available if WebGL is unavailable. The timer does not announce every second.

See [the implementation contract](../../packages/react/ai/labs-flip-clock.md)
for the portable core, tokens, tests and preview capture command.

## AI image generation

This is an animation preview using a local Yosemite photograph, with no image
generation service connected. The percentage measures the preview timeline.

| Control | Options |
| --- | --- |
| Animation style | Discs (default), Glowing blob |
| Aspect ratio | 4:3 (default), 1:1, 16:9, 3:4 |
| Duration | Slider with 2-, 5-, 15- (default) and 30-second detents |
| Border radius | Theme default, 0, 4, 8, 16 or 24 px |
| Border width | Theme default, 1, 2, 4 or 8 px |
| Playback | Pause/resume and replay |

Radius and width use sliders; their first detent has a restore icon and restores
the theme default. Zero removes corner rounding; nonzero frame values reference
existing A1 tokens. Changing the
style or frame preserves progress; changing duration restarts playback.

Discs rotate, pulse and increase in number as progress grows. The glowing blob
grows in complexity, brightness and contrast. Both use a token-driven palette
that transitions from blue to green and adapts to the active theme and mode.
A progress border travels clockwise from the top. After generation completes,
the border holds briefly and the photo reveals from top to bottom. The border
disappears when the reveal finishes.

With the Labs dev server running, check square-corner rendering, every border
width, playback and reduced motion with
`node --test apps/a1-labs/tests/image-generation.browser.mjs` from the repository root.

### Accessibility and motion

- Controls use A1's keyboard, focus and form semantics. Slider values announce
  seconds, pixels or “Theme default.”
- A polite, atomic status region announces progress milestones and playback
  states. A separate progressbar exposes the exact percentage, and the canvas
  has a description and busy state.
- `prefers-reduced-motion` is respected on load and when the device setting
  changes. Shapes stay still, pulsing stops and the finished image appears
  without a moving reveal. Progress and gradual color changes remain visible.
- Re-enabling motion cannot partially hide a completed image. Replay starts a
  fresh timeline.

Unit tests cover timeline boundaries, reduced-motion reveal timing, blob growth,
perimeter geometry and announcement pacing. When changing the interface, also
check keyboard and touch input, mobile panels, themes in both modes, pause/replay
and live motion-preference changes. Automated checks do not replace a screen
reader review; follow the [repository accessibility policy](../../packages/react/ai/a11y-policy.md).

## Page loading

Open `/experiments/page-loading` from the gallery, experiment tree or About page.
This experiment adds a glowing border around a simulated viewport while a sample
page loads. It reuses a1-web's `ResponsivePreviewFrame` and actual iframe device
presets, so the sample responds to the simulated width and scrolls independently.
The default is Phone (390 × 844); landscape phone, tablet, laptop and desktop
previews are also available.

Two blurred gradient layers soften the border into a diffuse glow. All colors
come from the active theme’s accent, info, success, warning and error roles;
there is no separate fixed palette.

The border loops at a configurable 2-, 4- (default) or 8-second cycle. A centered
heading indicates loading; the sample page is absent until loading finishes.
A small tertiary Stop animation button inside the viewport freezes the glow and
changes to Resume animation. It stays synchronized with the sidebar controls.
Explanatory UI copy is omitted; status announcements remain screen-reader-only.
Pause/resume freezes or restarts motion; Finish loading reveals the sample page
and fades the border away. Replay hides the content and starts a new cycle.
This is an indeterminate preview, with no network request or
claimed completion percentage. A polite status region describes loading, pause
and completion, while the preview exposes its busy state. Reduced motion
keeps a steady glow and removes the completion fade. Theme changes reach the
iframe without resetting playback.

## Search shortcut

Press `/` or Cmd/Ctrl+K on any Labs page to open sitewide search; the search
button in the toolbar does the same. Escape clears a typed query, then closes
the overlay and returns focus to where you were. Normal typing in fields and
editors, composition input, menus and dialogs are preserved, and the shortcut
also works from non-editable content in the responsive preview. It is not
configurable. The experiment sidebar keeps its own field for filtering the tree.

## Focus state animations

Open `/experiments/focus-animations` to compare Ring settle (default), Halo pulse,
Underline sweep, Double ring, Subtle zoom, Gentle lift, Corner draw and Inset frame
across Name, Email, Message, a Topic radio group and Submit/Cancel controls. Radio options are Feedback, An idea and A question. An A1 choice group shows all eight treatments in the configuration
panel. The duration slider offers 100, 150 (default) and 200 ms.
Try focus moves to Name; Tab and Shift+Tab move naturally through the form.
Submit only announces a local demo result; Cancel resets the fields.

Each treatment keeps a visible outline throughout and after its animation.
Fields and radio rows use the theme’s field focus color; buttons use its button
focus color. Radio effects surround the option row, preserving its selected dot.
Subtle zoom enlarges the focused control by 1.5%; Gentle lift raises it 2 px without
changing layout. Corner draw adds growing corner brackets; Inset frame settles an
inner border. Reduced motion removes animation, zoom and lift immediately,
including live preference changes.
Forced-colors mode uses the system highlight outline. Only opted-in controls
inside this experiment replace A1's standard focus treatment; navigation and
configuration controls keep their normal focus behavior.

`src/focus-animations/FocusAnimation.jsx` and its adjacent stylesheet form the
reusable scope; the experiment page owns the demo and configuration. See the
[focus implementation and validation contract](../../packages/react/ai/labs-focus-animations.md)
for its API, token dependencies, limitations and promotion notes.
To refresh only this card, run
`npm run capture:previews --workspace=a1-labs -- http://127.0.0.1:5187 --focus-only`.

## Button completion

Open `/experiments/button-completion`. A1 tabs switch between two versions —
Send email (first) and Publish — of a
primary-styled button that becomes its own result. Both use the A1 primary,
success and destructive button tokens, so they follow every theme and mode.

| Control | Options |
| --- | --- |
| Outcome | Succeed (default), Fail |
| Button size (Publish only) | Small, Medium (default), Large |
| Processing time | 1, 2 (default) or 4 seconds |
| Reset button | Returns both versions to their start |

- **Send email** is one large button that never resizes. At rest it centres
  a large, filled send icon, “Send email” and “Ready to send to 1,240
  subscribers.” On press the text fades down, “Sending to 1,240 subscribers…”
  appears at the bottom and the icon itself — same shape, fill and size — drops
  into a slingshot near the left edge. It is drawn back and launched along an
  arc, and the slingshot recoils out through the left edge; dashed motion lines trail it and erase behind it. It flies slower the
  longer sending takes. On success it flies out through the right edge; after a
  short beat a centred checkmark draws on and the button reads “Email sent to 1,240
  subscribers.” On failure it crash-lands and vanishes in a mini explosion;
  after the same beat a cross draws on and the button reads “Couldn’t send the email. Try again.” —
  press it to retry. Secondary text keeps one size and weight throughout.
- **Publish** keeps one fixed width throughout. Pressing it shows a spinner and
  Publishing…, then Published (success) — or Not published with a short shake,
  followed by a Try again retry (failure).

Both buttons fill the card's width; Send email has a fixed height.

Work is simulated; no service is connected. Focus stays on the button, and a
polite status region names the result — visible below Publish, and shown inside
the Send email stage instead. Start over returns focus to the button. Reduced
motion removes the pop, shake, expansion and flight; the stage shows a still
plane, then the result mark. The reusable `CompletionButton` and `SendButton` are
independent of the Labs shell — see the
[button completion contract](../../packages/react/ai/labs-button-completion.md).

## Switch transition

Open `/experiments/switch-morph` for an enlarged A1 switch. Its two strokes move
and resize while each rotates 90 degrees from an X to a checkmark as the thumb slides; toggling off reverses
that motion. Gentle easing keeps motion nearly even, with a slight slowdown in the middle. Nothing swaps icon assets or cross-fades between different marks.

The switch sits directly on the canvas without a card or separate On/Off text.
Its native checked state remains available to assistive technology.

The default is off at 2× A1 size with a 100 ms transition. Sliders offer 1×/2×/3×/4×
scale and 100/150/200/300/750 ms timing; an A1 Switch controls the disabled state.
At 1×, the label, row spacing and padding also match the default A1 Switch.
The track, thumb, focus, colors and shadow use live A1 tokens. Click the switch
or its label, or focus it and press Space. Reduced motion changes all positions
and colors immediately, including when the preference changes mid-transition.

The reusable `MorphSwitch` is separate from the Labs configuration page. See its
[API and promotion notes](../../packages/react/ai/labs-switch-morph.md).
Refresh only its card with
`npm run capture:previews --workspace=a1-labs -- http://127.0.0.1:5187 --switch-only`.

## Frosted glass

Open `/experiments/frosted-glass`. A sample page — header, invite form and a
full-width submit button — is built from stacked panes of thin, slightly
rounded frosted glass over colourful shapes, inside the same responsive viewport
as Page loading (Phone by default; landscape phone, tablet, laptop and desktop
are available). The viewport itself is the base sheet of glass; the header rests on it
(with its chip on top), while the form is a separate piece set flush into a
hole in the sheet, with a thin seam. Each field is likewise its own piece of
glass inlaid in a hole in the form, with its label inside above the value. Each element reads
like a translucent glass subway tile: tight 3 px corners, a milky face, broad
polished bevels and a thin glass side. Light passes through the top edge as well
as the bottom, with softer seams and contact shadows. Diffuse daylight behind
the scene keeps the top illuminated. Depth adds a small, capped amount of tint.

| Control | Options |
| --- | --- |
| Viewport | Phone (default), Landscape phone, Tablet, Laptop, Desktop |
| Frost | Light, Medium (default), Heavy |
| Backdrop | Aurora (default), Sunset, Meadow |

Submitting shows a status that nothing was sent. By request this visual study
uses raw values and a fixed light-glass look instead of A1 tokens and themes.
The reusable `FrostedGlass` and `GlassPane` are separate from the Labs page; see
the [frosted glass contract](../../packages/react/ai/labs-frosted-glass.md).
Refresh only its card with
`npm run capture:previews --workspace=a1-labs -- http://127.0.0.1:5187 --frosted-only`.

## AI thinking

Open `/experiments/thinking-terminal` for a simulated chat with terminal-style
Thinking text. Edit the Thinking lines (one per line), then Apply lines. The
defaults include the supplied moose sentence and original absurdist status copy.
After the first line, selections are random without immediate repeats. Each
thought replaces the previous one in place, without creating history rows. The
animated text sits directly beneath Assistant with no background or separate
Thinking label. The cursor is 1em tall, matching the text size. Longer
lines take longer to type and remain visible longer before the next line.

In the configuration panel, Stop/Resume animation pauses the terminal and
Finish thinking reveals a sample answer. Send message starts another simulated response. Nothing is sent to an AI
service. Reduced motion shows a static full status with no blinking or typing.
The terminal does not announce every character to screen readers.

See [the reusable API and timing contract](../../packages/react/ai/labs-thinking-terminal.md).
Capture its card with `npm run capture:previews --workspace=a1-labs -- http://127.0.0.1:5187 --thinking-only`.

## Color token visualizer

Open `/experiments/token-visualizer` for a1-web's Foundations color
visualization, unchanged: A1 color ramps plotted in a 3D OKLCH space — height is
lightness, distance from the center is chroma and rotation is hue — with a ramp
inspector and a step-alignment view. Drag to orbit and scroll to zoom; the ramp
and token pickers in the configuration panel are the keyboard-accessible way to
select points. Guides toggle the lightness planes, the sRGB gamut shell,
out-of-gamut warnings and labels. Values are read from the live theme, so the
view follows the appearance controls.

The page composes `useColorVisualization` from
`apps/a1-web/src/pages/foundations/ColorVisualizationFoundation.jsx` (and its
adjacent stylesheet): one implementation for a1-web and Labs. It brings three.js,
React Three Fiber, drei and culori (owned by a1-web), so it is lazy-loaded.
Refresh only its card with
`npm run capture:previews --workspace=a1-labs -- http://127.0.0.1:5187 --tokens-only`.

## Nodes and canvas

Open `/experiments/connected-nodes` for one graph built with the existing A1
Canvas, Node and NodeConnector components. Six nodes are connected from Tokens
through React, HTML/CSS and Native to Apps and Preview. Drag nodes or pan the
background; use the canvas controls to zoom and fit the graph.

Configuration includes node and connector shapes, line styles, grid, dragging
and subtle colors. Select a node to edit its label or move it with the directional
buttons; Reset graph restores the sample. A connection list beneath the canvas
provides the same relationships in text. Mobile configuration uses the shared sheet.
See [the composition contract](../../packages/react/ai/labs-connected-nodes.md).
Capture its card with `npm run capture:previews --workspace=a1-labs -- http://127.0.0.1:5187 --nodes-only`.

## Under construction

Open `/experiments/page-construction` for a second page-loading idea: while the
page loads, a tower crane builds it. It fetches each block at its mast, carries
it along the jib, lowers it into its real place and sets it down as a
placeholder with a puff of dust. If loading outlasts the build, the crane waits
with its hook bobbing while the placeholders shimmer. Finish loading lifts the
crane away and the placeholders become the page.

| Control | Options |
| --- | --- |
| Viewport | Phone (default), Landscape phone, Tablet, Laptop, Desktop |
| Crane speed | Relaxed (2 s per block), Normal (1.3 s, default), Quick (0.8 s) |
| Playback | Finish loading, Pause/Resume, Replay |

Loading is simulated. The crane is decorative; a polite status and `aria-busy`
describe loading. Reduced motion shows every placeholder at once with the crane
parked. The reusable `PageConstruction` wraps any page whose blocks are marked
`data-construction-block`; see the
[contract](../../packages/react/ai/labs-page-construction.md). Refresh only its
card with `npm run capture:previews --workspace=a1-labs -- http://127.0.0.1:5187 --construction-only`.

## Verify button

Open `/experiments/verify-button` to try a deliberate intent gate. Arm the
simulated action, hold until the dial reaches 100%, then release to confirm.
Release early, drag off the button or press Escape to cancel. Enter or
**Confirm without holding** opens a separate click-only confirmation.
Configuration changes the action label and hold duration (1, 2 or 3 seconds;
2 seconds by default). Reset starts a fresh session. Reduced motion removes
shutter and completion movement and uses numeric progress. The demo submits
nothing; the reusable core emits `onVerify` once per session.

See [the implementation contract](../../packages/react/ai/labs-verify-button.md).
Capture its card with `npm run capture:previews --workspace=a1-labs -- http://127.0.0.1:5187 --verify-only`.

## Reordering

Open `/experiments/reordering` to compare eight placement animations: Subtle,
Plop (the default), Tilt and settle, Spring, Pop, Slide in, Fade in and Instant.
Drag a handle to move an item; neighbors move aside and the target gets one of
eight insertion indicators. Over the slot: Insertion line, Target outline, Empty
slot, Glow or Arrows. In a gutter beside the list, never under the dragged item:
Side marker, Pointer or Position rail (the default). Space or Enter picks up a focused handle,
arrows/Home/End choose a position, and Space/Enter places it. Escape cancels.
Each row also provides move-up/down buttons.

Configuration sets the treatment, insertion cue and 150/300/500 ms duration
(default: 300 ms), plus Reset order. Reduced motion skips placement and neighbor
animation. Position announcements and the last-placed outline remain available.
The core accepts controlled items and emits only committed order changes.

Select **Magnetic drag and drop** in Reordering style for a two-/three-column
grid. Tiles attract toward nearby slots and surrounding tiles spring into their
preview positions. A labeled outline identifies the landing position. Configure
snap distance (64/96/128 px), spring stiffness and damping with detented sliders.
Space/Enter picks up and places; arrows move across rows/columns; Home/End jump
to the ends. Escape or Cancel move restores the starting order, and Undo reverses
a committed move. Earlier/later buttons offer a single-click alternative.
Reduced motion removes spring movement while preserving direct dragging,
landing outlines and announcements. The original List option remains the default.

See [the implementation contract](../../packages/react/ai/labs-reordering.md).
Capture its card with `npm run capture:previews --workspace=a1-labs -- http://127.0.0.1:5187 --reordering-only`.

## More page loaders

Four more page-loading ideas, each its own experiment, share the sample page,
the responsive viewport and the controls of Under construction (speed, Finish
loading, Pause/Resume, Replay):

| Experiment | While loading | When ready |
| --- | --- | --- |
| `/experiments/page-blueprint` — Blueprint | Each block is drafted on blueprint paper, its outline drawing on with its measurements; the grid then drifts | The drafting fades into the page |
| `/experiments/page-puzzle` — Jigsaw | Pieces carrying slices of the layout fly in, spinning, and snap together; a shine sweeps the finished puzzle | The pieces fall away |
| `/experiments/page-paint` — Fresh paint | A roller sweeps down and up; each pass adds fidelity — blocks, then text lines and the button, then the real page, soft and grey | The paint dries to full colour |
| `/experiments/page-sunrise` — Sunrise | Silhouettes under a starry sky; the sun rises with progress and slows if loading drags on | Full day, then the page |

Loading is simulated. The page stays out of the tab order until ready, a polite
status and `aria-busy` describe loading, and reduced motion shows a still
equivalent. Shared scaffolding lives in `src/loading-preview/`; see the
[page loaders contract](../../packages/react/ai/labs-page-loaders.md). Refresh
their cards with
`npm run capture:previews --workspace=a1-labs -- http://127.0.0.1:5187 --loaders-only`.

## Billboard with actions

Open `/experiments/billboard-actions` for a bold introduction beside a panel of
linked next steps. The sample uses original Labs copy and existing A1 tokens.
Edit the headline, introduction and panel heading; compare Cards and Action
Tiles; choose Accent or Neutral; toggle descriptions or force stacked columns.
The preview defaults to Laptop and offers all shared device sizes. Columns
stack on phones. Actions link to the Labs gallery, A1 Web and release notes.

The reusable `ActionBillboard` owns no content, routes, settings or configuration.
It composes existing A1 components and needs no experiment stylesheet or new
tokens. See [the pattern contract](../../packages/react/ai/labs-billboard-actions.md).
Capture its card with `npm run capture:previews --workspace=a1-labs -- http://127.0.0.1:5187 --billboard-only`.

## Required fields

Open `/experiments/required-fields` to compare five new ways of marking required
and optional fields on one complex form (16 fields, 10 required), from subtle to
extreme: Margin tick, Ink lines, Completion rings, Opt-in extras and Required
rail (the default). None uses A1's own asterisk or Required badge. Submit the form to see how
each marks missing fields: red margin ticks, red spellcheck waves, red rings with
section counts, a "Before you send" checklist by the button, or broken track
stops (answered stops become success checkmarks) with a sticky bar that steps through them. "Fill required fields" shows
the success path.
Nothing is sent. See [the comparison contract](../../packages/react/ai/labs-required-fields.md).
Capture its card with `npm run capture:previews --workspace=a1-labs -- http://127.0.0.1:5187 --required-only`.

## Timeline

Open `/experiments/timeline` for a reference timeline rebuilt as an interface,
with invented sample content: four milestones from 2020 to 2023 in the history
of Fieldnote, a fictional reading app. Each is joined by a coloured connector that
wraps its badge in a quarter arc and turns into a stem ending at a node beside
its details. On wide screens milestones alternate above and below the axis;
on narrow ones the axis runs down the side with details after it and the year
as an eyebrow above each title. Choose Auto,
Horizontal or Vertical and preview every device size. The reusable `Timeline`
takes any milestones. See [the timeline contract](../../packages/react/ai/labs-timeline.md).
Capture its card with `npm run capture:previews --workspace=a1-labs -- http://127.0.0.1:5187 --timeline-only`.

## Segmented control transitions

Open `/experiments/segmented-motion` for the A1 segmented control with eight
ways for its selected background to move: Default (as it ships), Fade, Slide,
Spring, Stretch (the leading edge goes first), Grow, Wipe and Morph (it shrinks
to a bar, travels and grows). Choose the duration, 2 to 5 options, size, icons
and full width. Reduced motion moves the background instantly. See
[the segmented transitions contract](../../packages/react/ai/labs-segmented-motion.md).
Capture its card with `npm run capture:previews --workspace=a1-labs -- http://127.0.0.1:5187 --segmented-only`.

## Accordion transitions

Open `/experiments/accordion-motion` for the A1 accordion with eight ways to open
and close: Default (as it ships), Smooth, Slide, Bounce, Stagger, Unfold, Blur
and Wipe. Choose the duration, size and dividers, and whether one section opens
at a time. Closing reverses each transition; reduced motion makes them instant.
See [the accordion transitions contract](../../packages/react/ai/labs-accordion-motion.md).
Capture its card with `npm run capture:previews --workspace=a1-labs -- http://127.0.0.1:5187 --accordion-only`.

## Mobile data tables

Open `/experiments/mobile-tables` to compare nine ways to show a table on a
phone, inside a device preview: cards, compact lists (plain, labeled or with a field-legend card), a scrolling
table, a frozen first column, expandable rows, pick a column and grouped. Choose
simple or complex data and the viewport; tablet and laptop show the standard A1
Data Table. Compact rows place status beside the product title. Choice-group
secondary labels stay brief. See [the mobile tables notes](../../packages/react/ai/labs-mobile-tables.md).
Capture its card with `npm run capture:previews --workspace=a1-labs -- http://127.0.0.1:5187 --mobile-tables-only`.

## Bulk actions

Open `/experiments/bulk-actions` to select rows of a table of up to 1,000 products and act on
them at once. The bulk action bar (count and Delete selected) stays above the A1
Data Table; Delete is disabled until rows are selected, so the table never jumps.
Choose how deleted rows leave: at once, or Animate away (they flash red, slide
and fade, then the rows below glide up). Switches offer to select all products,
not just the page, and move the select-all checkbox into the bar. Deleted
products leave the data set and
stay deleted in this browser until Reset data. Sorting and pages work as usual;
there is no search or filter. See
[the bulk actions notes](../../packages/react/ai/labs-bulk-actions.md).
Capture its card with `npm run capture:previews --workspace=a1-labs -- http://127.0.0.1:5187 --bulk-only`.

## Data grid

Open `/experiments/data-grid` for A1's experimental DataGrid (react-data-grid
themed with A1 tokens) as an editable inventory of up to 1,000 items that scrolls with its
header and totals in view. Edit cells (invalid numbers are rejected with a
message), select rows, sort by several columns, resize and freeze columns, show a
totals row and change the density; Reset restores the data. The page loads on
demand. See [the data grid notes](../../packages/react/ai/labs-data-grid.md).
Capture its card with `npm run capture:previews --workspace=a1-labs -- http://127.0.0.1:5187 --grid-only`.

## Fenex celebrates

This experiment is hidden from the gallery, sidebar and search; open
`/experiments/fenex` directly to see Fenex the fox, an animated SVG character
drawn from the Fenex illustration, hopping for joy as stars and confetti fall.
Pause or replay him, and change the speed, size, background, confetti and a
reduced-motion preview. The same `Fenex` component is an option in Submission
celebrations, where he settles after about 5 seconds. See
[the Fenex contract](../../packages/react/ai/labs-fenex.md).
Capture its card with `npm run capture:previews --workspace=a1-labs -- http://127.0.0.1:5187 --fenex-only`.

## Fitted type

Open `/experiments/fit-text` for type that fits its container: each line is
scaled to fill the width, so shorter lines are larger. Edit the text or choose
an example; break lines as written, one word per line or into balanced lines;
fill each line or match the longest; and change the container width, size cap,
font, weight and alignment. It refits on resize and font load. See
[the fitted type contract](../../packages/react/ai/labs-fit-text.md).
Capture its card with `npm run capture:previews --workspace=a1-labs -- http://127.0.0.1:5187 --fit-only`.

## Submission celebrations

Open `/experiments/celebrations` and join the waitlist to see one of seven
celebrations: Check, Rings, Stamp, Sparkles, Fenex (an animated SVG fox),
Fireworks or Confetti (with a
light, normal or lots amount). Replay a celebration or skip straight to it.
Focus moves to the success message, and reduced motion shows each
celebration's still state. The submission is simulated. See
[the celebrations contract](../../packages/react/ai/labs-celebrations.md).
Capture its card with `npm run capture:previews --workspace=a1-labs -- http://127.0.0.1:5187 --celebration-only`.

## Dialog motion

Open `/experiments/dialog-motion` for the A1 Dialog with nine enter and exit
animations: Default, Fade, Scale, Pop, Slide, Flip, Swing, Blur and From the
button. Slide, Flip and Swing take a direction, and Slide and Flip can leave the
way they came or carry on through. Change the duration and the scrim's color,
opacity and blur. The stage is a single large Open dialog button. Reduced motion is instant. See
[the dialog motion contract](../../packages/react/ai/labs-dialog-motion.md).
Capture its card with `npm run capture:previews --workspace=a1-labs -- http://127.0.0.1:5187 --dialog-only`.

## Contextual help

Open `/experiments/contextual-help` to compare five ways to show help for a
routing number field: an always-visible hint, a tooltip, a popover, an inline
expansion and a dialog. Choose the trigger: a help button in the field, a help
button beside it, a text button or field focus. Combinations that work poorly
are disabled with the reason. See
[the contextual help contract](../../packages/react/ai/labs-contextual-help.md).
Capture its card with `npm run capture:previews --workspace=a1-labs -- http://127.0.0.1:5187 --help-only`.

## Password strength

Open `/experiments/password-strength` for a new-password field with seven
strength meters: Segments, Bar, Ring, Underline, Badge, Checklist and Time to
guess. Choose the number of levels, minimum length, optional character rules,
when the meter updates and whether suggestions show; try the example passwords
and Save password to see validation. Strength is estimated in the browser and
nothing is saved or sent. The field is a masked text field, not a real password
field, so password managers ignore it. See
[the password strength contract](../../packages/react/ai/labs-password-strength.md).
Capture its card with `npm run capture:previews --workspace=a1-labs -- http://127.0.0.1:5187 --password-only`.

## Checkbox motion

Open `/experiments/checkbox-motion` for eight check, uncheck and mixed-state
animations on the real A1 CheckboxGroup: Default, Pop, Draw, Fill, Flip, Jelly,
Pulse and Slide. A Select all box shows the mixed state when only some toppings
are chosen. Change the speed and size, and compare with the plain A1 checkbox.
Only the changed box animates; reduced motion keeps the instant change. See
[the checkbox motion contract](../../packages/react/ai/labs-checkbox-motion.md).
Capture its card with `npm run capture:previews --workspace=a1-labs -- http://127.0.0.1:5187 --checkbox-only`.

## Radio buttons

Open `/experiments/radio-buttons` for radio buttons that come alive on the real
A1 RadioGroup, in six variants. Grow: hover and the ring swells as a faint dot
previews the choice; press and it squishes; choose and the ring springs while
the dot grows past its size and settles. Ripple sends a ring outward; Bounce
drops the dot in; Thicken grows the ring inward; Travel slides the selection
from the previous choice; Jelly wobbles. Change the animation speed and size, and compare with
the plain A1 radio. Reduced motion keeps the instant dot without movement. See
[the radio variants contract](../../packages/react/ai/labs-radio-variants.md).
Capture its card with `npm run capture:previews --workspace=a1-labs -- http://127.0.0.1:5187 --radio-only`.

## Avatars

`/experiments/avatars` configures one avatar treatment and shows it as a
profile, at all five A1 sizes, in a team list and as an overlapping group.
Choose initials, an image, an icon or a generated pattern; a radius from square
to circle; neutral, tinted (per name) or accent colour; no border, a hairline,
a ring or a gradient ring; a status; and one or two initials. The experimental
Break the frame lets a cut-out portrait rise above the top edge. Teammates have
no photo, so Image shows its initials fallback. See
[the avatars contract](../../packages/react/ai/labs-avatars.md). Capture its
card with `capture:previews -- http://127.0.0.1:5187 --avatars-only`.

## Code syntax highlighting

`/experiments/code-highlighting` highlights the real A1 Code block for JSX,
CSS, HTML and JSON. Choose a palette (Full color, Subtle, Monochrome), line
spacing (Default or Separated: 28px between lines, 20px within a wrapped
line), highlighted lines, line numbers, wrapping, copy and collapse. Diff
shows a change with added and removed lines; Live editing highlights as you
type. Below the block are inline code in a sentence and a legend of token
colors. See [the code highlighting contract](../../packages/react/ai/labs-code-highlighting.md).
Capture its card with `capture:previews -- http://127.0.0.1:5187 --code-highlighting-only`.

## Mode switches

Open `/experiments/mode-switches` and choose one of five light/dark controls in
the side panel; each changes the real Labs appearance, the same setting as the
appearance controls. Light or dark only: a ball-chain pull cord you drag down and
release (it springs back with physics) and the A1 Switch with a spinning sun or
moon in its thumb. Light, dark or Auto: a rotary dial, an eclipse button that
moves the moon over the sun, and a slide switch you drag between positions.
Choose how the page changes between modes (none, fade, or a reveal from the
control) and its duration. Reduced motion removes the physics and transitions.
See [the mode switches contract](../../packages/react/ai/labs-mode-switches.md).
Capture its card with `npm run capture:previews --workspace=a1-labs -- http://127.0.0.1:5187 --mode-switches-only`.

## Slides

Open `/experiments/slides` for a ten-slide sample deck drawn with A1 components
and tokens. Choose a transition, from Cut, Fade, Push, Zoom and Color wipe to the
content-aware Cascade (pieces leave and arrive in turn) and Morph (pieces two
slides share move, resize and recolour into place). Choose how each slide's
points load: all at once, fade in, rise in or step through on each Next. Use the
arrow keys or Previous/Next; jump with Go to slide. Morph pairs: 1 ↔ 10, 2 → 3,
4 → 5 and 7 → 8. See [the slides contract](../../packages/react/ai/labs-slides.md).
Capture its card with `npm run capture:previews --workspace=a1-labs -- http://127.0.0.1:5187 --slides-only`.

## Source map

| File | Responsibility |
| --- | --- |
| [src/App.jsx](src/App.jsx) | Route lookup, responsive card gallery, search and sorting |
| [src/AboutPage.jsx](src/AboutPage.jsx) | Labs overview and A1 Web link at `/about` |
| [src/LabsHeader.jsx](src/LabsHeader.jsx) | Shared experiment/About navigation and settings action |
| [src/ReleaseNotesPage.jsx](src/ReleaseNotesPage.jsx) | Public release history at `/release-notes` |
| [src/release-notes.js](src/release-notes.js) | Parses numbered changelog sections for the Release notes page |
| [src/token-visualizer/TokenVisualizerExperiment.jsx](src/token-visualizer/TokenVisualizerExperiment.jsx) | Labs shell for a1-web's color visualization (lazy-loaded) |
| [src/loading-preview/LoadingPreviewExperiment.jsx](src/loading-preview/LoadingPreviewExperiment.jsx) | Shared page for the page loaders: viewport, speed, finish/pause/replay, status |
| [src/loading-preview/SamplePage.jsx](src/loading-preview/SamplePage.jsx) | The sample page every loader loads |
| [src/loading-preview/loader-utils.js](src/loading-preview/loader-utils.js) | Block measurement, layout skeletons, pausable clock, waiting curve |
| [src/page-blueprint/BlueprintLoader.jsx](src/page-blueprint/BlueprintLoader.jsx) | Blueprint drafting loader |
| [src/page-puzzle/PuzzleLoader.jsx](src/page-puzzle/PuzzleLoader.jsx) | Jigsaw loader |
| [src/page-paint/PaintLoader.jsx](src/page-paint/PaintLoader.jsx) | Fresh paint loader (fidelity per pass) |
| [src/page-sunrise/SunriseLoader.jsx](src/page-sunrise/SunriseLoader.jsx) | Sunrise loader |
| [src/page-construction/PageConstruction.jsx](src/page-construction/PageConstruction.jsx) | Reusable crane page loader (measures blocks, drives the crane) |
| [src/page-construction/construction.js](src/page-construction/construction.js) | Deterministic crane timeline |
| [src/page-construction/PageConstructionExperiment.jsx](src/page-construction/PageConstructionExperiment.jsx) | Sample page, viewport, simulated loading and controls |
| [src/required-fields/form-model.js](src/required-fields/form-model.js) | Required-fields form, variations, validation and progress |
| [src/required-fields/RequiredFieldsForm.jsx](src/required-fields/RequiredFieldsForm.jsx) | Controlled form with each marking and submission treatment |
| [src/required-fields/RequiredFieldsExperiment.jsx](src/required-fields/RequiredFieldsExperiment.jsx) | Variation picker, fill/reset and submit handling |
| [src/segmented-motion/AnimatedSegmentedControl.jsx](src/segmented-motion/AnimatedSegmentedControl.jsx) | A1 SegmentedControl with background transitions |
| [src/segmented-motion/segment-model.js](src/segmented-motion/segment-model.js) | Direction, indicator edges and morph keyframes |
| [src/accordion-motion/AccordionMotion.jsx](src/accordion-motion/AccordionMotion.jsx) | Opening and closing transitions for A1 Accordions |
| [src/mobile-tables/MobileTablePatterns.jsx](src/mobile-tables/MobileTablePatterns.jsx) | Nine mobile table patterns and the md switch to A1 DataTable |
| [src/mobile-tables/table-data.js](src/mobile-tables/table-data.js) | Simple and complex datasets, formatting and grouping |
| [src/bulk-actions/BulkActionsExperiment.jsx](src/bulk-actions/BulkActionsExperiment.jsx) | Bulk selection with an always-visible action bar on A1 DataTable |
| [src/bulk-actions/bulk-model.js](src/bulk-actions/bulk-model.js) | Removing deleted rows and remembering deletions |
| [src/data-grid/DataGridExperiment.jsx](src/data-grid/DataGridExperiment.jsx) | Editable inventory of up to 1,000 items on A1's experimental DataGrid |
| [src/sample-data/datasets.js](src/sample-data/datasets.js) | Standard inventory, directory, invoices and requests (up to 1,000 items) |
| [src/data-grid/grid-model.js](src/data-grid/grid-model.js) | Sorting, edit validation, totals and edit counts |
| [src/fenex/Fenex.jsx](src/fenex/Fenex.jsx) | Fenex the fox: inlined animated SVG with playback, still and confetti controls |
| [src/fenex/fenex-celebrate.svg](src/fenex/fenex-celebrate.svg) | The self-contained Fenex character animation |
| [src/fit-text/FitText.jsx](src/fit-text/FitText.jsx) | Lines measured and scaled to fill their container |
| [src/fit-text/fit-model.js](src/fit-text/fit-model.js) | Line breaking (written, words, balanced) and fitted sizes |
| [src/celebrations/Celebration.jsx](src/celebrations/Celebration.jsx) | Six success celebrations and the top-layer particle canvas |
| [src/celebrations/particles.js](src/celebrations/particles.js) | Confetti, firework and rocket physics |
| [src/dialog-motion/MotionDialog.jsx](src/dialog-motion/MotionDialog.jsx) | A1 Dialog with enter/exit animations and a configurable scrim |
| [src/contextual-help/HelpPatterns.jsx](src/contextual-help/HelpPatterns.jsx) | Help popover (native popover) and inline expansion |
| [src/contextual-help/help-model.js](src/contextual-help/help-model.js) | Pattern/trigger compatibility, reasons and popover placement |
| [src/password-strength/StrengthMeter.jsx](src/password-strength/StrengthMeter.jsx) | Seven password strength meter styles and the field underline |
| [src/password-strength/password-model.js](src/password-strength/password-model.js) | Local strength estimate, rules, suggestions and time to guess |
| [src/checkbox-motion/LivelyCheckboxGroup.jsx](src/checkbox-motion/LivelyCheckboxGroup.jsx) | A1 CheckboxGroup with check, uncheck and mixed animations |
| [src/checkbox-motion/checkbox-model.js](src/checkbox-motion/checkbox-model.js) | Changed-box detection and Select all state |
| [src/radio-buttons/LivelyRadioGroup.jsx](src/radio-buttons/LivelyRadioGroup.jsx) | A1 RadioGroup with animated radio variants |
| [src/avatars/LabAvatar.jsx](src/avatars/LabAvatar.jsx) | Configurable avatar and avatar group (candidate A1 Avatar extension) |
| [src/code-highlighting/HighlightedCode.jsx](src/code-highlighting/HighlightedCode.jsx) | Syntax-highlighted A1 Code and experimental live editor |
| [src/mode-switches/ModeSwitches.jsx](src/mode-switches/ModeSwitches.jsx) | Five light/dark controls: ball-chain pull cord, sun and moon switch, dial, eclipse, slide switch |
| [src/mode-switches/mode-model.js](src/mode-switches/mode-model.js) | Mode resolution, cycling, dial detents and cord spring physics |
| [src/slides/SlideDeck.jsx](src/slides/SlideDeck.jsx) | Reusable deck: scaled stage, layered transitions, morph, builds, navigation |
| [src/slides/slide-motion.js](src/slides/slide-motion.js) | Transition, build and navigation logic |
| [src/slides/deck.jsx](src/slides/deck.jsx) | Sample slides and their parts, morph keys and points |
| [src/timeline/Timeline.jsx](src/timeline/Timeline.jsx) | Reusable timeline: grid layout, measured SVG connectors |
| [src/timeline/timeline-geometry.js](src/timeline/timeline-geometry.js) | Connector path math and layout choice |
| [src/timeline/TimelineExperiment.jsx](src/timeline/TimelineExperiment.jsx) | Sample content, device preview and layout control |
| [src/tabs/StyledTabs.jsx](src/tabs/StyledTabs.jsx) | Eight controlled tab styling treatments |
| [src/steps/Steps.jsx](src/steps/Steps.jsx) | Eight controlled progress-tab presentations |
| [src/experiments.js](src/experiments.js) | Experiment IDs, categories, titles, URLs, icons, previews and grouped tree builder and first-release sorting metadata |
| [scripts/capture-previews.mjs](scripts/capture-previews.mjs) | Static card artwork from the actual experiment renderers |
| [src/frosted-glass/FrostedGlass.jsx](src/frosted-glass/FrostedGlass.jsx) | Reusable frosted glass scene and depth-aware panes |
| [src/frosted-glass/FrostedGlassExperiment.jsx](src/frosted-glass/FrostedGlassExperiment.jsx) | Sample page, backdrop, responsive viewport and configuration |
| [src/button-completion/CompletionButton.jsx](src/button-completion/CompletionButton.jsx) | Reusable fixed-width completion button, shared face and width measurement |
| [src/button-completion/SendButton.jsx](src/button-completion/SendButton.jsx) | Reusable fixed-size send button and its animation lifecycle |
| [src/button-completion/paper-plane.js](src/button-completion/paper-plane.js) | Paper-plane timeline, geometry and Canvas 2D drawing |
| [src/button-completion/ButtonCompletionExperiment.jsx](src/button-completion/ButtonCompletionExperiment.jsx) | Tabs, demo cards, simulated work and configuration |
| [src/focus-animations/FocusAnimation.jsx](src/focus-animations/FocusAnimation.jsx) | Reusable, isolated focus-treatment scope |
| [src/focus-animations/FocusAnimationsExperiment.jsx](src/focus-animations/FocusAnimationsExperiment.jsx) | Demo form, treatment/duration configuration and local submit/reset feedback |
| [src/switch-morph/MorphSwitch.jsx](src/switch-morph/MorphSwitch.jsx) | Reusable native switch and isolated stroke animation |
| [src/switch-morph/SwitchMorphExperiment.jsx](src/switch-morph/SwitchMorphExperiment.jsx) | Scale, timing and disabled-state configuration |
| [src/ExperimentPage.jsx](src/ExperimentPage.jsx) | Experiment ID to page mapping |
| [src/ExperimentLayout.jsx](src/ExperimentLayout.jsx) | Shared responsive shell, tree search and mobile configuration sheet |
| [src/page-loading/PageLoadingExperiment.jsx](src/page-loading/PageLoadingExperiment.jsx) | Device preview, loading border and playback controls |
| [src/image-generation/ImageGenerationExperiment.jsx](src/image-generation/ImageGenerationExperiment.jsx) | Image-generation configuration state and shell integration |
| [src/AppearanceSettings.jsx](src/AppearanceSettings.jsx) | Theme/mode settings and persistence |
| [src/image-generation/Configuration.jsx](src/image-generation/Configuration.jsx) | Toolbars, sliders and playback controls |
| [src/image-generation/ImageGeneration.jsx](src/image-generation/ImageGeneration.jsx) | Canvas lifecycle, preferences and accessible status |
| [src/image-generation/renderer.js](src/image-generation/renderer.js) | Timeline, token resolution, discs, border and image reveal |
| [src/image-generation/blob.js](src/image-generation/blob.js) | Blob geometry and rendering |
| [src/image-generation/accessibility.js](src/image-generation/accessibility.js) | Progress announcements |
| [tests/image-generation.test.mjs](tests/image-generation.test.mjs) | Unit coverage |
| [image-generation tokens](../../system/tokens/component/image-generation.json) | Image-generation visual and motion values |
| [page-loading tokens](../../system/tokens/component/page-loading.json) | Loading-border dimensions and cycle durations |
| [page-construction tokens](../../system/tokens/component/page-construction.json) | Crane geometry, step speeds and landing/exit motion |
| [segmented-motion tokens](../../system/tokens/component/segmented-motion.json) | Scale, lag and travelling-bar sizes for segmented transitions |
| [accordion-motion tokens](../../system/tokens/component/accordion-motion.json) | Distances, blur, fold angle, scale and stagger for accordion transitions |
| [fit-text tokens](../../system/tokens/component/fit-text.json) | Measuring size, minimum and cap, line height and gap |
| [celebration tokens](../../system/tokens/component/celebration.json) | Celebration sizes, scales, particle counts and physics |
| [dialog-motion tokens](../../system/tokens/component/dialog-motion.json) | Distances, scales, angles and blur for dialog animations |
| [bulk-actions tokens](../../system/tokens/component/bulk-actions.json) | Leave and glide-up timing and slide distance for Animate away |
| [contextual-help tokens](../../system/tokens/component/contextual-help.json) | Popover width, gap and entrance offset |
| [password-strength tokens](../../system/tokens/component/password-strength.json) | Segment and underline sizes, minimum fill and update delays |
| [checkbox-motion tokens](../../system/tokens/component/checkbox-motion.json) | Scales, distances and angles for the checkbox animations |
| [radio-variants tokens](../../system/tokens/component/radio-variants.json) | Scales, distances and stretch for the animated radio variants |
| [mode-switches tokens](../../system/tokens/component/mode-switches.json) | Control sizes, cord physics, timing and the small illustration palette |
| [slides tokens](../../system/tokens/component/slides.json) | Canvas, layout, transition speeds, stagger and build timing |
| [timeline tokens](../../system/tokens/component/timeline.json) | Connector width, badge, arc, node, stem and spacing sizes |
| [button-completion tokens](../../system/tokens/component/button-completion.json) | Processing detents, state-change motion and send-stage size/timing |

To add an experiment, append a unique ID, category, title, description, URL, icon, preview
image path, preview alt text and first-release `addedIn` to `src/experiments.js` (sorting sets the
gallery order; there are no slots). Choose a category ID from `experimentCategories`
in that file. This supplies its card and grouped tree entry. Then wire
its page into the mapping in `ExperimentPage.jsx`. Each experiment owns its state
and passes configuration and content to `ExperimentLayout`. Gallery counts and card
descriptions come from the registry. Update tests, version and [changelog](CHANGELOG.md)
in the same change.

Use shared A1 components and tokens before adding custom UI. Project policies and
maintenance context live in the [central project context](../../packages/react/ai/project-context.md)
and [Labs orientation notes](../../packages/react/ai/quick-orientation.md#a1-labs).

## Contributing and versions

Planned work lives in [TODO.md](TODO.md).

Agents must read [AGENTS.md](AGENTS.md) and the
[Labs contribution and versioning guide](../../packages/react/ai/labs-contributing.md)
before making changes. Keep those instructions and this README current as
features change.

Labs uses independent `MAJOR.MINOR.PATCH` versions: new features increment minor;
fixes, documentation and maintenance increment patch. Before 1.0.0, breaking
changes increment minor and require migration notes. After 1.0.0, breaking public
contracts increment major. Bump once per completed logical change.

Update `package.json`, the Labs entry in the root `package-lock.json` and the
matching dated section in [CHANGELOG.md](CHANGELOG.md) together. The package file
is the current-version source of truth. Versioned changes do not imply deployment.

## Static hosting

Labs is configured as its own Netlify project, `a1design-labs`, for
`https://labs.a1design.app`. Its [Netlify configuration](netlify.toml) uses the
repository root as base, `apps/a1-labs` as package directory and
`apps/a1-labs/dist` as output. It runs tests and the full token + Labs build.

With Netlify CLI installed and authenticated, run `npm run deploy:a1-labs:preview`
from the repository root to create a draft, or `npm run deploy:a1-labs` to publish.
Both commands explicitly target the Labs project. Git/main deployment is linked
but stopped until the Labs setup has been merged into main.

Read [Publishing Labs](../../packages/react/ai/labs-publishing.md) for the project,
DNS/TLS setup, release checks and how to enable continuous deployment.
[public/_redirects](public/_redirects) provides direct-route SPA fallback.
Building locally alone does not publish.

## Switch transition 3D

Open `/experiments/switch-three` for a second switch study using Three.js: a
beveled track, raised thumb and two solid strokes that rotate from X to check.
It shares the original switch's geometry, colors, 1–4× scale and 100–750 ms
speeds, with an Angled/Front view control. Theme changes update live. Native
keyboard/disabled behavior remains available with reduced motion, forced colors
or unavailable WebGL. See [the implementation contract](../../packages/react/ai/labs-switch-three.md).

## Button interactions

Open `/experiments/button-motion` to compare six hover and press treatments:
Subtle, Lift, Glow, Tilt, Spring and Ripple. Choose the treatment in the right
panel, adjust 150–750 ms timing and button size, or inspect disabled states.
The demo uses A1 primary, secondary and tertiary buttons. Ripple adds an
expanding ring without distorting the button. Keyboard focus/press receives the
same feedback; reduced motion keeps controls still. See the
[button interaction contract](../../packages/react/ai/labs-button-motion.md).

## Chat

Open `/experiments/chat` to compare five message styles (Bubbles, Soft blocks,
Outlined, Editorial and Compact) and six submission/reply animations (Instant,
Fade, Rise, Slide in, Pop and Unfold). Send a message for an automatic local reply
from Studio assistant or Avery. Adjust motion to 100/300/500 ms and reply pace to
Quick/Natural/Unhurried. Replies queue in order; Reset conversation cancels them.
Turning off Automatic replies also cancels pending replies. Nothing is sent or saved.

Enter sends and Shift+Enter adds a line. A named message log announces additions;
reduced motion keeps messages still. Replies preserve your reading position when
you scroll back, and Latest messages returns to the bottom. Style/theme changes
preserve the conversation. Configuration uses the standard responsive panels.
See [the Chat contract](../../packages/react/ai/labs-chat.md).
Capture its card with `npm run capture:previews --workspace=a1-labs -- http://127.0.0.1:5187 --chat-only`.

## Trigger-condition-action builder

Open `/experiments/automation-builder`. Edit When / If / Then phrases as a
sentence; a second condition or action automatically introduces structured
blocks. Compare Automatic, Sentence and Structured blocks, use All/Any matching,
reorder actions, load simple/complex rules and test against configurable sample
events. The trace explains matches, skipped checks and which actions would run.
It is local only. Optional JSON reflects the same rule. See
[the builder contract](../../packages/react/ai/labs-automation-builder.md).

## Token styling and hierarchy

`/experiments/token-styling` styles the token name itself. Choose Syntax
highlighting, A1 code, Soft pill, Outlined, Namespace emphasis, Swatch led or
Name and value. Only the configured item appears, directly on the workspace without a surrounding
card. Syntax highlighting colors
parts of a complete selectable reference like `--semantic-color-surface-card`.

`/experiments/token-hierarchy` traces real authored token references to source
values, with Linked cards, Nested tree, Breadcrumb trails and Step by step.
Breadcrumb trails start at the source and end with the token being traced.
Active theme values appear separately because mode/theme overrides can differ
from source definitions. See [the token studies contract](../../packages/react/ai/labs-token-studies.md).

Capture the new previews with `capture:previews` and `--automation-only`,
`--token-styling-only` or `--token-hierarchy-only` (after the local server URL).

## Table pagination position

`/experiments/data-tables` compares pagination above/below the table or inline
with its A1 filters. Inline controls wrap below filters when space is limited. Its panel
uses toolbars for Position, Size (Small/Medium, default Medium), Type
(inventory/team/invoices), Columns (3/5/8) and Density. Data set size is a slider
with 7, 10, 25, 50, 100, 250, 500 and 1,000-item detents, plus Small/Medium/Large presets (10/100/1,000). Search and zebra rows are configurable.
A1's filter chips and mobile filter menu filter the local demonstration data.
Row selection is omitted. The table's built-in page-size menu includes 7 rows;
there is no duplicate Rows control or Narrow Screens control in the panel.

See [Table pagination position](../../packages/react/ai/labs-data-tables.md). Capture its gallery
preview with `capture:previews -- http://127.0.0.1:5187 --data-tables-only`.

## Pagination types

`/experiments/pagination-types` compares A1 (default), Compact, First and last,
Page selector, Jump to page, and Numbered with jump on up to 1,000 fictional
requests. Choose Above or Below placement. The table uses A1’s responsive
density, adjusting to its available width. A1 filters, search, sorting and
page-size controls operate on the full result set; changing treatment preserves
the page. Direct jumps validate the entered page, and changes announce the range.

See [Pagination types](../../packages/react/ai/labs-pagination-types.md) for
tradeoffs, source guidance and the reusable navigation contract. Capture its
preview with `capture:previews -- http://127.0.0.1:5187 --pagination-types-only`.

## Standard sample data

The table/grid studies share four deterministic fictional datasets: inventory,
team directory, invoices and service requests. Choose Small (10), Medium (100)
or Large (1,000), or use the shared size slider for intermediate counts. Tables
and grid start at Medium; Mobile data tables starts Small. Grid edits survive
size changes, and bulk deletions stay deleted until Reset data.

Use `createDataset(type, 'small' | 'medium' | 'large' | count)` from
`src/sample-data/datasets.js` for new experiments. Numeric counts support 0–1,000.
See [Sample data and audit](../../packages/react/ai/labs-sample-data.md) for
schemas, migration details, size controls and deliberately local fixtures.

## Experiment headings

The center title appears at md and smaller (through 1,024px), alongside the
button that opens experiment navigation. At lg and larger (1,025px+), the tree
stays visible and the center title is visually hidden, retaining its accessible
h1. Examples start without introductory summaries; configuration help and
functional form/status content remain in their appropriate panels.

## Experiments header menu

The shared header’s Experiments menu follows A1 Web’s Components menu: a search
field, All experiments gallery link, and alphabetical categories with every
visible experiment. Search shows matching experiment links using the same
vocabulary as the sidebar, including tags such as Drag. Enter opens the first
alphabetical match; an empty query keeps category browsing. The mobile navigation
includes the same search and categories. Hidden experiments remain unlisted.
The separate Search Labs action still searches pages as well as experiments.

### Focused gallery captures

Use `capture:previews` with `--mobile-tables-only`, `--fit-only` or
`--segmented-only` to refresh these cards. Captures isolate the device or
component from Labs navigation and configuration in a 16:9 export. Segmented
controls use a settled selection so the static preview stays clear.
