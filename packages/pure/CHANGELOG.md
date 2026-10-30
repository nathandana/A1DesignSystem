# @a1/pure Changelog

## Unreleased

## 0.4.0 — 2026-10-30

- **Textarea: no pill corners** — `.a1-textarea` (in `a1-pure.css` and `a1-base.css`) caps its corner radius at `--component-field-textarea-max-border-radius`, so themes with pill-shaped fields keep a rounded rectangle for multi-line text.
- **Light print output** (A1-2707) — the system dark-mode media queries are now screen-only, so pages print in light mode even when the reader's device prefers dark.
- **Menu tokens** — shared Menu border is 2px and its shadow uses the xl semantic token. SideNav now reads its own border token so Menu changes do not affect its border.

## 0.3.0 — 2026-10-12

- **Labs token families** (A1-2698) — includes tokens for avatars, code highlighting, celebrations, slides, timelines, page construction and loading, fitted type, contextual help, password strength, mode switches, and animated radio, checkbox, accordion, dialog and segmented-control studies. Experiment implementations remain isolated in A1 Labs.

- **Chat experiment tokens** — added transcript/message dimensions, entrance geometry and simulated reply pacing. Shared component behavior is unchanged.

- **Magnetic reordering tokens** — added snap-distance aliases, attraction, hysteresis and spring stiffness/damping for the isolated Labs grid option.

- **Step tracker motion tokens** — added fade, pop, bounce and ripple geometry for isolated Labs transitions. Shared StepTracker markup and styles are unchanged.

- **Button interaction tokens** — added wrapper motion, shadow and ripple values for six isolated Labs hover/press treatments. Shared Button styling is unchanged.

- **Labs 3D switch and billboard tokens** — added physical switch depth, bevel, lighting and lift tokens; added rapid per-character durations for the billboard wheel.

- **Flip clock tokens** — added compact maximum width and stage ratio for the frameless Labs clock variant.

- **Flip billboard tokens** — removed the unused per-card stagger duration; the Labs billboard flips all cards simultaneously.

- **Focus animation tokens** — added subtle zoom scale, lift distance and corner length for four new isolated Labs focus treatments. Shared control focus styles remain unchanged.

- **Flip billboard tokens** — added the headline grid, letter fitting, camera and stagger/hold timing for a Labs landing-page hero using the shared split-flap mechanism.

- **Flip clock tokens** — added physical monochrome card materials, housing geometry, camera and lighting tokens for the isolated Labs Three.js clock.

- **Reordering tokens** (A1-2698) — added isolated Labs lift, squash, tilt and drag-opacity tokens. Existing semantic motion and A1 component styles remain unchanged.

- **Verify button tokens** (A1-2698) — added isolated Labs safety-shutter geometry and 1/2/3-second hold durations; rebuilt token outputs. Shared Button behavior is unchanged.

- **Thinking cursor height** (A1-2698) — changed the cursor-height token to 1em to follow the text size.

- **Thinking terminal output** (A1-2698) — removed the unused reserved-height token as the Labs indicator now renders as a background-free text row.

- **Thinking terminal tokens** (A1-2698) — added typing, reading, cursor timing and output geometry tokens for the isolated Labs AI thinking experiment.

- **Switch morph gentler easing** (A1-2698) — softened the experiment’s easing curve to remove the pronounced midpoint slowdown.

- **Switch morph rotation refinement** (A1-2698) — reduced the experiment’s stroke rotation token to 90 degrees.

- **Switch morph easing** (A1-2698) — added an experiment-specific curve with a slower middle and faster ends. Shared Switch motion is unchanged.

- **Switch morph rotation token** (A1-2698) — added a 180-degree stroke rotation token for the isolated Labs switch animation.

- **Switch morph standard scale** (A1-2698) — added the 1× scale token so the Labs switch can use standard A1 dimensions.

- **Switch morph tokens** (A1-2698) — generated scale factors and stroke geometry tokens for the Labs switch transition. Experimental CSS remains local to Labs.

- **Focus animation tokens** (A1-2698) — generated the shared experimental focus travel/accent dimension tokens. Focus-animation selectors remain local to the Labs experiment.

- **Page loading tokens** (A1-2698) — generated the shared Labs loading-border motion and dimension tokens.

- **Image generation color modes** (A1-2698) — generated animation colors now follow semantic surface, info, success and text roles through the shared mode contract.

- **Glowing blob tokens** (A1-2698) — generated CSS includes the Labs image-generation blob geometry and luminosity tokens. The renderer remains app-specific.

- **Toolbar interaction token** (A1-2698) — generated CSS includes the neutral interaction-shade alias used by React Toolbar. No Pure CSS toolbar component is introduced.

- **Image generation tokens** (A1-2698) — included the experimental Labs animation tokens in generated theme CSS. Existing component styles are unchanged.

## 0.2.0 — 2026-09-25

- **Heading mark line spacing** — `.a1-mark` now uses the shared heading-mark background-inset token, keeping its highlight clear of glyphs on the preceding line.

- **Custom block tokens** (A1-2541) — generated theme CSS includes the shared height and border-width tokens for the React CustomBlock. Pure CSS does not implement the sandbox runtime.

- **Segmented Control** — new scoped classes: `.a1-segmented` track (+ `.a1-segmented-small` 28px / `.a1-segmented-large` 56px / `.a1-segmented-full-width`) with `.a1-segment` options. Track heights sit on the 28/40/56 control-height standard (the token names the TOTAL height; segments derive theirs via `calc`). Selection styles from `aria-checked="true"` (radiogroup), `aria-selected="true"` (tablist), or the `.a1-segment-selected` modifier. All values from `--component-segmented-*` and semantic tokens. Demo page: `examples/a1-pure/segmented-control.html` (navigation updated across the example site). First consumer: the A1:Figma plugin's mode tabs.

- **Package release notes** — Pure CSS package changes are now tracked separately from the app and React package release notes so HTML/CSS consumers can review package-specific updates.
