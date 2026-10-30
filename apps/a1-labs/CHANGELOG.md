# A1 Labs changelog

## Unreleased

## 0.77.2 — Oct. 30, 2026

- **Standard configuration placement** — keeps the Touch card configuration panel on the right at desktop sizes, consistent with every other Labs experiment. Small screens continue to use the configuration bottom sheet.

## 0.77.1 — Oct. 30, 2026

- **Smoother card-action zoom** — eases button size, group spacing, padding, surface and shadow over the A1 normal motion duration when touch or hover enlarges the controls. Reduced motion changes the state immediately.

## 0.77.0 — Oct. 30, 2026

- **Touch-card preview control** — adds a configuration-panel switch that enlarges the action group to 44×44px controls on hover on devices without touch input. Mouse activation remains immediate, the controls return to compact size when the pointer leaves and card content does not reflow.

## 0.76.6 — Oct. 30, 2026

- **Stable touch enlargement** — enlarges the Touch card IconButtons to exactly 44×44px in an overlay anchored to a fixed compact-size slot, so the card's heading, body and overall height do not reflow when touch actions expand.

## 0.76.5 — Oct. 30, 2026

- **Concentric action-group radius** — adjusts the Touch card action group to a 4px radius, derived from the 12px Card radius minus its new 8px edge inset.

## 0.76.4 — Oct. 30, 2026

- **Card action placement** — moves the Touch card action group to 8px from the Card's top and right edges while keeping it in the normal layout flow.

## 0.76.3 — Oct. 30, 2026

- **Larger Touch card corners** — increases the experiment Card radius one A1 step, from `lg` to `xl`, and derives the nested action-group radius from that new value minus Card padding.

## 0.76.2 — Oct. 30, 2026

- **Concentric card corners** — derives the Touch card action-group radius from the outer Card radius minus its padding, clamped at zero, so the nested control follows the card's corner geometry.

## 0.76.1 — Oct. 30, 2026

- **Grouped card actions** — adds a subtle border around the Touch card action group so the three compact IconButtons read as one related control set.

## 0.76.0 — Oct. 30, 2026

- **Touch card actions** — adds a realistic research card with small Save, Share and Details IconButtons in its top-right corner. Mouse and keyboard activation remain immediate; on touch input, the first tap enlarges the complete action group to A1's large touch targets and the next tap performs the action.

## 0.75.0 — Oct. 29, 2026

- **Text selection** — select realistic headings, paragraphs, links, lists, inline code and TextareaField content in default and inverse sections. Default preserves the browser treatment; six semantic CSS `::selection` variants cover action and status colors, while two more compare subtle and obvious steps from the dedicated highlighted color ramp. No selection-management JavaScript is used.

## 0.74.0 — Oct. 29, 2026

- **Button configurator menu** — a live A1 Button opens its configuration in an anchored overlay when selected. Choose a full Menu offset beside the component, using the main A1 configurator's Toolbar controls for Variant, Size, Icon position and State; a viewport-sized compact overlay Toolbar that preserves useful direct tools before narrow-screen overflow; an Extended toolbar with direct icon variants and minus/plus size stepping; a pointer-anchored right-click ContextMenu with flush native-style cascading submenus; or a Consolidated context menu with inline icon groups for Size and Icon position. Context treatments suppress the browser menu while open and retain subtle inline On/Off states, persistent right-click access, and forced inline label editing. An optional shared inline-label treatment replaces the Menu and Toolbar label fields with double-click editing on the component. Every treatment preserves editor state without a reset action.

## 0.73.2 — Oct. 12, 2026

- **Publishing setup** — dedicated Netlify configuration and explicit preview/production deployment commands for `labs.a1design.app`. Builds run Labs tests and regenerate shared tokens; direct experiment URLs use the existing SPA fallback. Hashed assets use immutable caching.

## 0.73.1 — Oct. 12, 2026

- **Gallery previews** — recaptured Mobile data tables and Fitted type with only their actual previews, excluding Labs navigation and configuration. Segmented control transitions now shows a settled selection instead of a distorted mid-stretch frame. Capture scripts preserve these compositions on future refreshes.

## 0.73.0 — Oct. 12, 2026

- **Code syntax highlighting** — a new experiment that adds syntax highlighting to the A1 Code block for JSX, CSS, HTML and JSON. Choose Full color, Subtle or Monochrome; highlight lines; show a diff with added and removed lines; inline code in a sentence; and a legend of every token color. Colors stay readable in every theme except Fresh dark. Experimental: live editing that highlights as you type.
- **Line spacing** — Separated puts lines 28px apart and the rows of a wrapped line 20px apart, so a wrapped line reads as one unit.
- **Better wrapping in A1 Code** — wrapped lines now continue at their own indentation, line numbers stay level with every wrapped line (they used to drift lower down the block), and a code block that scrolls sideways can be reached and scrolled with the keyboard.

## 0.72.1 — Oct. 11, 2026

- **Folder tab seam** — removes the visible line beneath the current folder tab by overlapping the content border. The selected neutral surface now joins the content sheet; the remaining container border stays visible.

## 0.72.0 — Oct. 11, 2026

- **Tabs** — eight configurable treatments: A1 default, neutral folder tabs, bold selection, pills, outlines, raised surfaces, top rails and bookmarks. Includes optional icons/counts, compact sizing, horizontal overflow and keyboard navigation. Folder tabs sit behind a continuously bordered content sheet. Current tabs have no hover or pressed feedback and reselecting them does not emit a change; tab-strip scrolling respects reduced motion.

## 0.71.0 — Oct. 11, 2026

- **Searchable Experiments menu** — the header now lists every visible experiment in category submenus, matching A1 Web’s Components menu. Search by title, category, type or tag to get direct links; Enter opens the first match. Includes All experiments for the gallery, an empty-results message and the same search in mobile navigation. Clicking a category now keeps its flyout open if hover already opened it.

## 0.70.0 — Oct. 11, 2026

- **Dedicated release notes page** — moves version history from About Labs to `/release-notes`, available through the shared header, About link and sitewide search. Old `/about#release-notes` links redirect to the new page. Notes continue to come directly from the changelog.

## 0.69.1 — Oct. 11, 2026

- **Avatars: no intro text** — removed the explanatory paragraph above the avatar, so the page opens on the profile.

## 0.69.0 — Oct. 11, 2026

- **Avatars** — a new experiment for avatars as a profile, at all five A1 sizes, in a team list and as an overlapping group with a "+N" count. Choose initials, an image, an icon or a pattern generated from the name; a radius from square to circle; neutral, tinted (a stable colour per name) or accent; no border, a hairline, a ring or a gradient ring; online, away, busy or offline status, each with its own shape; and one or two initials. Experimental: Break the frame, where a cut-out portrait rises above the top edge.

## 0.68.0 — Oct. 11, 2026

- **Mobile compact lists** — adds Compact list with labels and Compact list with legend, bringing the experiment to nine patterns. The legend shows field names without numbers in a separate A1 card. Both adapt to simple or complex data; legend rows retain screen-reader field labels.
- **Clearer compact rows** — status now sits beside the product title across compact lists and grouped rows. Choice-group secondary labels are shortened to a few words.

## 0.67.1 — Oct. 11, 2026

- **Cleaner experiment workspace** — hides the center experiment title when the persistent sidebar is visible (lg and up, 1,025px+). At md and below, the title and sidebar opener remain. The page heading stays available to screen readers on large screens, without reserving a title row.
- **Experiments start with the example** — removes introductory summaries and redundant introduction headings from the center workspace. Configuration help, input instructions, sample content and live progress/status messages remain.

## 0.67.0 — Oct. 11, 2026

- **Table pagination position: Both** — a new Position option that puts matching page controls above and below the table. Either set changes the page or rows per page for both, and screen readers can tell the two apart.

## 0.66.0 — Oct. 11, 2026

- **Standard sample datasets** — inventory, team directory, invoices and service requests now come from one shared source. Data grid, Bulk actions, Mobile data tables, Table pagination position and Pagination types share Small (10), Medium (100) and Large (1,000) presets, plus a size slider with intermediate counts. Fixed inventory silently stopping at 320 products; records remain stable across sizes.
- **Safe size changes** — grid edits survive shrinking and expanding the dataset. Bulk-deleted products remain deleted across size changes and reloads; Reset data restores them. Size and reset controls wait for an active deletion animation to finish.
- **Configuration migration** — tables and grid start with 100 items, Mobile data tables with 10. Pagination types now tops out at 1,000 instead of 5,000. Private record generators moved to `src/sample-data/`; the contribution guide records the audit and reuse contract.

## 0.65.2 — Oct. 11, 2026

- **Header divider runs full width** — on wider screens the Light/Dark/System switch and theme menu now sit inside the toolbar, so its bottom border continues beneath them instead of stopping short.

## 0.65.1 — Oct. 11, 2026

- **Responsive pagination table** — Pagination types now uses A1 DataTable’s automatic density, adjusting the table size to its available width.

## 0.65.0 — Oct. 11, 2026

- **Pagination types** — a separate experiment for long data tables: A1 (default), Compact, First and last, Page selector, Jump to page, and Numbered with jump. Includes above/below placement, 100–5,000 fictional requests, A1 filters/search, page-size choices, validated direct-page entry and screen-reader page updates. DataTable supplies the resolved pagination context to custom navigation through a new render callback.

## 0.64.0 — Oct. 11, 2026

- **Sitewide search** — search all of Labs the way A1 Web does: the search button in the toolbar, `/` or Cmd/Ctrl+K open a large search overlay covering every experiment plus All experiments and About Labs. Previously `/` focused a field on the current page.
- **Home page uses the Labs toolbar** — the same header as About and the experiments, with All experiments marked as the current page.
- **One scroll area on the home page** — the page scrolls as a whole with the toolbar pinned, instead of a fixed frame with its own scrolling gallery.
- **Simpler home controls** — removed the home filter field (sitewide search replaces it) and moved Sort onto the same row as the experiment count, with clearer options: Name, A–Z; Name, Z–A; Oldest first; Newest first.
- **Sticky headers stay put** — fixed in the A1 Page Layout, where a page that scrolls as a whole stayed one screen tall, so a sticky header scrolled away after the first screen.

## 0.63.1 — Oct. 11, 2026

- **Table pagination position** — renamed the experiment across the gallery, navigation, page heading and About link.

## 0.63.0 — Oct. 11, 2026

- **Inline table pagination** — the Position toolbar now offers Inline. Pagination sits beside the A1 filters when there is room and wraps below on narrower layouts, keeping the current page and filter state.

## 0.62.0 — Oct. 11, 2026

- **Experiment tree sorted by name** — the sidebar lists categories and the experiments within them alphabetically.
- **Expand or collapse all** — a button above the experiment tree opens every category, or closes them all when any is open.

## 0.61.1 — Oct. 11, 2026

- **Bulk actions: select all products** — a switch (on by default) that, once a whole page is selected, says only that page is selected and offers to select all products; after that it offers to go back to just the page. Works with every style, and the scope is announced.
- **Bulk actions: select-all checkbox in the bar** — a switch that moves the page's select-all checkbox (with its mixed state) from the table header into the bulk action bar. It also gives the mobile card layout a select-all.
- **Zebra rows work** — fixed in the A1 Data Table, where striping never showed on desktop rows.
- **No more 2px jump** — fixed in the A1 Button, where secondary and tertiary buttons were 2px taller than the standard; the bar no longer grows when its message appears.
- **Mobile data tables viewport** — uses the same viewport control as the other experiments (Phone, Landscape phone, Tablet, Laptop, Desktop); only Phone is below md and shows the mobile pattern.

## 0.61.0 — Oct. 11, 2026

- **Table pagination** — a new experiment for pagination above/below the table with A1 filter chips, inventory/team/invoice data and no row selection. Position, Size, Type, Columns and Density use toolbars; data set size is a slider with 7/10/25/50-row detents. Medium pagination is the default. Seven rows is also available in the built-in page-size menu. No separate Rows or Narrow Screens configuration. Shared DataTable exposes pagination position and size in A1 Web and Storybook.

## 0.60.0 — Oct. 11, 2026

- **Mobile data tables** — added seven ways to show a data table on a phone, in a real device preview: cards, a compact list with dividers, a scrolling table, a table with a frozen first column, and three explorations (expandable rows, pick a column, grouped with sticky headings). Choose simple (3 columns) or complex (11 columns) data. Phone and large phone show the chosen pattern; tablet and laptop show the standard A1 Data Table. Includes a card preview and About link.

## 0.59.3 — Oct. 11, 2026

- **Token hierarchy breadcrumb order** — trails now start with the source token and end with the token being traced.

## 0.59.2 — Oct. 11, 2026

- **Bulk actions without search** — removed the search field and its All fields dropdown, so the bulk action bar sits directly above the table.

## 0.59.1 — Oct. 11, 2026

- **Token preview without a card** — removed the surrounding Card from Token styling; the configured token now sits directly on the workspace.

## 0.59.0 — Oct. 11, 2026

- **Trigger-condition-action builder** — edit automation phrases as a sentence, automatically expanding into When/If/Then blocks as clauses grow. Includes All/Any conditions, ordered actions, modal editing, local test traces, templates and a structured-rule preview.
- **Token styling** — seven treatments for token references, including syntax highlighting of each token element. Shows only the configured item; names stay selectable and colors follow the theme.
- **Token hierarchy** — traces authored token aliases to source values with Linked cards, Nested tree, Breadcrumb trails and Step by step. Shows the active theme value separately from source definitions.
- **Home sorting** — replaced category/type filters with A–Z, Z–A, Oldest to newest and Newest to oldest. Search remains available. First-release metadata supplies chronology; URLs preserve search/sort and ignore retired filters.

## 0.58.2 — Oct. 11, 2026

- **Bulk actions: Animate away** — a new style where deleted rows flash red, slide and fade away, then the rows below glide up into the space before the products leave the data set. Delete is disabled while rows leave; reduced motion removes them at once.
- **Simpler bulk actions** — removed Clear selection from the bar (deselect with the checkboxes) and the category filter from the table; search remains.

## 0.58.1 — Oct. 11, 2026

- **Bulk actions bar stays put** — the bulk action bar is now always visible above the table, with Clear selection and Delete selected disabled until rows are selected, so the table no longer jumps; focus stays on the button after Delete.
- **Deleted products stay deleted** — deleting removes products from the data set and remembers it in this browser, so they stay gone after a reload until Reset data.

## 0.58.0 — Oct. 11, 2026

- **Bulk actions** — added an experiment for selecting many rows of a 127-product table and acting on them at once, starting with the A1 Data Table’s own selection and bulk action bar (count, Clear, Delete) with search, a category filter, sorting and pagination. A status line reports selections and deletions; density, zebra rows and Reset data are in the panel. Includes a card preview and About link.

## 0.57.1 — Oct. 11, 2026

- **Data grid: 127 products** — the inventory now starts with 127 products. Up to 15 rows show at once and the grid scrolls, keeping the header and totals row in view; totals use thousands separators. Removed the A1 Data Table comparison view.

## 0.57.0 — Oct. 11, 2026

- **Data grid** — added A1’s experimental DataGrid (react-data-grid themed with A1 tokens) as an editable inventory: edit cells, select rows, sort by several columns, resize columns, freeze the product column and show a totals row, with compact, default or comfortable rows. Invalid numbers are rejected with a message, edits are counted, and Reset restores the data. Switch the view to see the same data in A1’s Data Table. Loads on demand. Includes a card preview and About link.

## 0.56.1 — Oct. 11, 2026

- **Fenex celebrates hidden** — the experiment no longer appears in the gallery, sidebar, search or About page; its address still opens it, and Fenex remains a Submission celebrations option. Experiments can now be hidden with `hidden: true` in the registry.

## 0.56.0 — Oct. 11, 2026

- **Fenex celebrates** — Fenex the fox now has his own experiment: a large stage with Pause/Play and Replay, speed (0.5–2×), size, background and Inverse, a stars-and-confetti switch and a reduced-motion preview. Includes a card preview and About link.
- **More detailed Fenex** — redrawn closer to the illustration: a watercolor wash with paper grain and hand-drawn edges, white ear tufts, cheek fur, tapered happy eyes, a nose highlight and whisker dots, a fluffy white chest, toed paws, a two-tipped plume over veined flame petals, and hearts among the confetti.
- **Fenex settles in Submission celebrations** — he now settles into his still pose after about 5 seconds instead of looping indefinitely.

## 0.55.0 — Oct. 11, 2026

- **Fenex celebration** — added Fenex the fox to Submission celebrations: an animated SVG character who hops for joy with arms pumping, ears wiggling, tail swishing and a big laugh while stars and confetti fall. With reduced motion, Fenex stands still with the confetti scattered around him.

## 0.54.3 — Oct. 11, 2026

- **Configuration toolbars no longer clip labels** — Dialog motion's Enters from (now labelled only on the selected direction) and Scrim color toolbars, Fitted type's Line breaks and Timeline's Layout (both now labelled only on the selected option), and the Size toolbars in Checkbox motion and Radio buttons now size to their content, so no label is cut off.

## 0.54.2 — Oct. 11, 2026

- **Dialog motion Leaves toolbar** — shows the label only on the selected exit; the other is icon-only and keeps its name for screen readers. The toolbar now sizes to its content so the selected label fits.

## 0.54.1 — Oct. 11, 2026

- **Dialog motion stage** — removed the sample page and description; the stage is now a single large primary Open dialog button, centered. Updated its card preview.

## 0.54.0 — Oct. 11, 2026

- **Chat** — added five message styles and six submission/reply animations, with 100/300/500 ms timing. Send messages for queued automatic replies from a simulated assistant or person, choose the reply pace, or turn replies off. Includes keyboard sending, typing feedback, reset, scroll-position retention, reduced-motion support and a gallery preview.

## 0.53.0 — Oct. 11, 2026

- **Fitted type** — added type that fits its container: every line is scaled to fill the width, so shorter lines are set larger. Edit the text or pick an example (Poster, Quote, Event); break lines as written, one word per line or into 2–6 balanced lines; fill each line or match the longest; change the container width, a size cap, font, weight and alignment; and show each line's size. It refits as the container resizes and as fonts load. Includes a card preview and About link.
- **Icon fixes** — Contextual help, Dialog motion and Fitted type now use only icons from the A1 icon registry.

## 0.52.0 — Oct. 11, 2026

- **Magnetic reordering** — added a Magnetic drag and drop option to Reordering. Tiles attract toward nearby slots, neighbors spring aside and a labeled outline shows the landing position. Adjust snap distance, stiffness and damping. Supports pointer/touch, keyboard movement, cancel, undo and live reduced motion.
- **Experiment search tags** — added curated keywords to every experiment and shared matching between the gallery and sidebar. Searches such as Drag, DOB and modal now find related experiments while retaining category and type filters.

## 0.51.0 — Oct. 11, 2026

- **Submission celebrations** — added a short waitlist form whose success screen celebrates in six ways: a large check, rings rippling out, a “You’re in” stamp, sparkles, fireworks and an explosion of confetti. Fireworks and confetti come in light, normal or lots, and you can replay a celebration or skip straight to it. Focus moves to the success message; with reduced motion each celebration shows its still state. The submission is simulated. Includes a card preview and About link.

## 0.50.0 — Oct. 11, 2026

- **Dialog motion** — added the A1 dialog with nine ways to open and close: Default (as it ships), Fade, Scale, Pop, Slide, Flip, Swing, Blur and From the button. Slide, Flip and Swing enter from the top, bottom, left or right; Slide and Flip can leave the way they came or carry on through. Choose the duration from 150 to 750 ms, and change the scrim's color (A1 scrim, black, white, page or accent), opacity (0 to 80%) and blur (none to 16 px). A sample page behind the dialog shows the scrim's effect. Reduced motion opens and closes instantly. Includes a card preview and About link.
- **Contextual help dialog centered** — the help dialog now opens in the middle of the screen instead of near the top.

## 0.49.1 — Oct. 11, 2026

- **Step tracker actions** — grouped Back and Next/Start again in a left-aligned A1 ButtonContainer.

## 0.49.0 — Oct. 11, 2026

- **Contextual help** — added one form field with its help shown five ways: an always-visible hint, a tooltip, a popover, an inline expansion and a dialog. Open it with a help button in the field, a help button beside the field, a “Find your routing number” text button, or by focusing the field. Combinations that work poorly are disabled, with the reason shown. Focus moves into popovers and dialogs and returns to the trigger when they close. Includes a card preview and About link.

## 0.48.1 — Oct. 11, 2026

- **Step tracker timing** — narrowed transition duration detents to 100, 300 and 500 ms, with 300 ms as the default.

## 0.48.0 — Oct. 11, 2026

- **Step tracker transitions** — choose Standard, Instant, Fade, Slide, Pop, Bounce or Ripple for any tracker treatment. Added a 100–750 ms duration slider with detents. Transitions cancel on configuration changes, resize, reduced motion, forced colors and unmount; position updates remain immediate for assistive technology.

## 0.47.0 — Oct. 11, 2026

- **Step tracker** — added the existing A1 position indicator and five additional treatments: Rings, Segments, Ticks, Numbers and Spotlight. Configure step count, current position and alignment in a sample tour. All remain noninteractive, use neutral theme tokens and support reduced motion and forced colors.

## 0.46.1 — Oct. 11, 2026

- **Password strength stays out of password managers** — the demo field is now a masked text field rather than a real password field, with autofill off and the opt-outs for 1Password, LastPass, Bitwarden and Dashlane, so password managers no longer offer, generate or save a password. Show password still works where the browser can mask text; the panel now asks for a made-up password.

## 0.46.0 — Oct. 11, 2026

- **Steps** — eight treatments, including A1 default, Dots, Bars, Pills, Tiles, Chevrons, Vertical and Compact. Compare 3, 5 or 7 steps, completion and error states, with native keyboard navigation and reduced-motion support.
- **Home gallery** — replaced the pannable canvas with a vertically scrolling card grid: one column at xs, two at sm/md, three at lg and four at xl. Preserves search, category/type filters, previews, registry order and direct links.

## 0.45.0 — Oct. 11, 2026

- **Password strength** — added a new-password field with seven strength meters: Segments, Bar, Ring, Underline, Badge, Checklist and Time to guess. Choose 3, 4 or 5 levels, a minimum length, optional character rules, whether the meter updates as you type or after a pause, and whether to show suggestions; try example passwords and save to see validation. Strength is estimated in the browser from length, character types, common passwords and patterns; nothing is saved or sent. Screen readers hear the new strength once typing pauses. Includes a card preview and About link.

## 0.44.4 — Oct. 11, 2026

- **Search shortcut** — removed the keyboard icon button, mobile Settings toggle and stored shortcut preference. `/` remains available to focus search outside editors and dialogs; an older disabled preference no longer affects it.

## 0.44.3 — Oct. 11, 2026

- **Flip billboard** — removed the eyebrow above the display and refreshed its experiment card preview.

## 0.44.2 — Oct. 11, 2026

- **Mode control size** — the labeled mode segmented control now uses A1 medium sizing in the header and small-screen Settings menu.

## 0.44.1 — Oct. 11, 2026

- **Mode labels** — the appearance segmented control now shows Light, Dark and System labels alongside the icons in the main header and small-screen Settings menu.

## 0.44.0 — Oct. 11, 2026

- **Appearance in the main menu** — from the md breakpoint (641px), choose Light, Dark or System with an inline segmented control and choose the theme directly in the header. Smaller screens keep the Settings menu. Preferences persist across pages and sizes; the keyboard shortcut opt-out remains available.

## 0.43.1 — Oct. 11, 2026

- **Radio buttons: five more variants** — Ripple (a halo on hover and a ring that ripples out when chosen), Bounce (the dot falls in, the ring squashes and the dot rebounds; deselecting drops it out), Thicken (the ring grows inward to leave the dot), Travel (the selection slides from the previous choice to the new one, stretching on the way, including with arrow keys) and Jelly (the ring sags on hover and wobbles when chosen). Reduced motion keeps the instant change for all six.

## 0.43.0 — Oct. 11, 2026

- **Button interactions** — added six hover and press treatments: Subtle, Lift, Glow, Tilt, Spring and Ripple. Compare primary, secondary and tertiary A1 buttons; configure duration, size and disabled state. Ripple keeps the button shape unchanged. Native keyboard/focus behavior and reduced-motion/forced-color fallbacks are preserved.

## 0.42.0 — Oct. 11, 2026

- **Checkbox motion** — added the A1 checkbox group with eight ways to check, uncheck and show the mixed state: Default (as it ships), Pop, Draw, Fill, Flip, Jelly, Pulse and Slide. A Select all box above a topping list moves between empty, mixed and checked as toppings change. Choose the speed from 150 to 500 ms, the size, and compare with the plain A1 checkbox. Only the box that changed animates; reduced motion keeps the instant A1 change. Includes a card preview and About link.

## 0.41.1 — Oct. 11, 2026

- **Switches default to 2×** — Switch transition and Switch transition 3D now open at twice the A1 switch size instead of four times. All four sizes remain available, and the card previews show the new default.

## 0.41.0 — Oct. 11, 2026

- **Segmented control transitions** — added the A1 segmented control with eight ways for its selected background to move: Default (as it ships), Fade, Slide, Spring, Stretch (the leading edge goes first), Grow, Wipe and Morph (it shrinks to a bar, travels and grows). Choose the duration from 150 to 750 ms, 2 to 5 options, size, icons and full width. Reduced motion moves the background instantly. Includes a card preview and About link.

## 0.40.2 — Oct. 11, 2026

- **Flip billboard copy** — the opening headline now reads “A1 Design” / “by the rules.” Updated its card preview.

## 0.40.1 — Oct. 11, 2026

- **Flip clock digit resets** — both clock styles now wind each zero reset back through its intervening digit cards instead of jumping directly to zero. The complete reset fits the selected transition duration; actual time and reduced-motion behavior remain immediate.

## 0.40.0 — Oct. 11, 2026

- **Accordion transitions** — added the A1 accordion with eight ways to open and close: Default (as it ships), Smooth, Slide, Bounce, Stagger, Unfold, Blur and Wipe. Choose the duration from 150 to 750 ms, the size, dividers and one section open at a time. Closing reverses each transition, and reduced motion makes them instant. Includes a card preview and About link.

## 0.39.0 — Oct. 11, 2026

- **Switch transition 3D** — added a separate Three.js switch with a beveled track, raised thumb and solid X-to-check strokes. Reuses A1 switch colors, sizing and motion geometry; includes scale, duration and view controls, native keyboard behavior, reduced motion and forced-color/WebGL fallback.
- **Billboard character cycles** — changed cards begin together, flip rapidly through intervening characters and stop independently at their targets. Nearby letters settle sooner. Added 20/35/60 ms character-speed detents; reduced motion shows the final headline immediately.

## 0.38.0 — Oct. 11, 2026

- **Radio buttons** — added animated radio variants on the A1 radio group. The first, Grow: hover and the ring swells as a faint dot previews the choice; press and it squishes; choose and the ring springs while the dot grows past its size and settles. Choose the animation speed and size, and compare with the plain A1 radio. Reduced motion removes the movement. Includes a card preview and About link.

## 0.37.0 — Oct. 11, 2026

- **Compact flip clock** — added a second clock style with smaller hinged cards directly on the canvas, without the housing, feet, corner screws or recessed surrounds. Both styles retain formats, card colors, pause/resume, rollover previews and reduced-motion support.

## 0.36.2 — Oct. 11, 2026

- **Flip billboard** — all cards now flip together. Removed the viewport frame, device selector and card-sequence control. Card stock and housing follow Light, Dark or Auto, including live system preference changes. The billboard adapts directly to the workspace. Removed studio navigation, supporting copy, actions and cards below the display; playback remains in configuration.

## 0.36.1 — Oct. 11, 2026

- **Removed the wall switch** — Mode switches now offers five controls: the pull cord (now the default), the sun and moon switch, the dial, the eclipse and the slide switch.

## 0.36.0 — Oct. 11, 2026

- **Four more focus treatments** — added Subtle zoom (1.5%), Gentle lift, Corner draw and Inset frame to the existing ChoiceGroup, for eight options. All keep a persistent theme-colored outline; reduced motion and forced colors remove zoom/lift movement. Added tokens and browser coverage across fields, radio rows and buttons.
- **Search with /** — the slash shortcut focuses home or experiment search and opens the sidebar on smaller screens. It selects existing text for replacement, preserves normal typing and modifier/composition input, and works from responsive preview content. Settings includes a persistent opt-out; Escape returns focus after opening the tree.

## 0.35.1 — Oct. 11, 2026

- **Wall switch flips anywhere** — a click anywhere on the wall switch now changes the mode, and the switch no longer tilts toward the cursor.
- **Modes change on release** — every switch now changes the mode only when you finish: the dial turns as you drag and switches when you let go, like the pull cord and slide switch. A quick second click during a fade or reveal is no longer lost.

## 0.35.0 — Oct. 11, 2026

- **Mode switches: one at a time, with transitions** — each switch now stands alone, chosen from a list in the side panel. Choose how the page changes between modes (none, a fade, or a reveal that grows from the control you used) and how long it takes, from 150 to 750 ms.
- **3D wall switch** — the rocker is now a three-dimensional wall switch with a lever that clicks into place, a plate that turns toward your pointer, real shadows and a pilot light that glows in dark mode. Press the top half for light or the bottom half for dark.
- **Ball-chain pull cord** — the cord is now a chain of small metal balls ending in a metal pull, like a real light switch.
- **Sun and moon switch** — only the icon animates now; the handle no longer swings outside the switch.
- **Slide switch replaces Horizon** — a three-position hardware slider for Light, Auto and Dark. Drag the handle and the mode changes when you let go.

## 0.34.0 — Oct. 11, 2026

- **Responsive flap surfaces** — clock and billboard canvases now keep their intended aspect ratio when shrinking from desktop to phone, without retaining the previous bitmap height.

- **Flip billboard** — a landing-page hero with a two-row physical split-flap headline, supporting copy and persistent actions. Three editable messages rotate every six seconds with wave or simultaneous flips, black/white card stocks, adjustable speed and pause/next controls. Shares the Three.js mechanism with Flip clock, uses the responsive device preview and retains the last valid copy on editing errors. Reduced motion stops automatic rotation; semantic text and links survive WebGL failures. Includes a preview, About link and contribution contract.

## 0.33.0 — Oct. 11, 2026

- **Flip clock** — a lazy-loaded Three.js split-flap clock with black-and-white card stocks, hinged digit halves, stacked cards, a recessed housing and cast shadows. Only changed digits flip. Includes local time, 12/24-hour format, optional seconds, front/angled views, token-based speeds, pause/resume and a midnight rollover demo. Reduced motion settles cards instantly; a non-live text timer remains available when WebGL cannot render. Added a card preview and documented the isolated core and scene lifecycle.

## 0.32.0 — Oct. 11, 2026

- **Mode switches** — added six ways to switch between light and dark, each changing the real Labs appearance. Light or dark: a physical rocker switch, a pull cord you drag down and release (it springs back with physics) and the A1 Switch with a sun or moon in its thumb. Light, dark or Auto: a rotary dial, an eclipse button that slides the moon over the sun, and a horizon scene above an A1 segmented control. Includes keyboard support, a mode announcement, reduced motion, a card preview and About link.

## 0.31.2 — Oct. 11, 2026

- **Square image-generation corners** — fixed the zero-radius detent referencing a nonexistent spacing token, which invalidated canvas geometry and erased the animation. Zero now removes rounding while preserving progress, both animation styles and the final image reveal. Added a browser regression check for all border widths and reduced motion.

## 0.31.1 — Oct. 11, 2026

- **Required fields defaults to the Required rail** — the experiment now opens on the Required rail, where required fields are numbered stops on a track. The other four marking styles remain available.

## 0.31.0 — Oct. 11, 2026

- **Home filters and experiment tags** — filter the canvas by category, type and text search. Every experiment has curated type tags, including Microinteraction, Loading feedback, Form pattern, Page layout, Data visualization, Design tool and Motion. Cards show their category and types; matching cards retain their numbers and rebalance into a smaller grid. Includes result announcements, an empty state, clear actions and shareable filter URLs. Required fields and Verification journey now sit in Forms. Cards use a uniform 20rem width and 25rem height to accommodate tags.

## 0.30.6 — Oct. 11, 2026

- **Reordering defaults to the position rail** (A1-2698) — Position rail is now the default insertion indicator in the experiment and in the reusable list, so a track with every position appears beside the list while you drag. The other seven indicators remain available.

## 0.30.5 — Oct. 11, 2026

- **One date-of-birth experiment** — the 7 date-of-birth studies are one experiment with one card and sidebar entry. The study is kept in the address, and the old per-study addresses open it with that study selected.
- **Slides use only tokens** — the ramp swatches, stage proportion and transition choreography now come from `component.slides` tokens, and slide stacking follows document order instead of z-index values. Transitions look and time the same.

## 0.30.4 — Oct. 11, 2026

- **Date-of-birth selection** — replaced the workspace toolbar with a single-column ChoiceGroup in the right configuration panel. All 7 studies remain available, with the selector moving into the configuration sheet on mobile.

## 0.30.3 — Oct. 11, 2026

- **Date-of-birth descriptions** — moved each selected study’s description from the configuration area to immediately below its input example, before the testing notes.

## 0.30.2 — Oct. 11, 2026

- **Date-of-birth workspace** — removed the device frame and viewport controls. The selected input study now renders directly in the workspace and responds to its width. Study selection and reset remain available.

## 0.30.1 — Oct. 11, 2026

- **Consolidated form pagination** — combined Multiple pages and Multiple steps into one Paginated treatment. Choose 1 or 4 sections per page while preserving answers and the current section. Side navigation and visual grouping remain the other two options.

## 0.30.0 — Oct. 11, 2026

- **Long forms** — compare 5 pages, 20 steps, side navigation and a continuous visually grouped form using the same 20 sections and 60 questions. Persistent position and answer counts, retained edits across layouts, keyboard focus, mobile navigation and validation of hidden sections keep the form understandable.
- **Date-of-birth inputs** — brought all 7 A1 Web input studies into Labs: native date, selects, numeric fields, auto-advance, mixed fields, single autoformat and formatted date parts. Both apps use the same implementation. A1 field layouts now supply sizing, and formatted parts have visible labels. Added a Forms navigation category and previews for all 8 new experiments.

## 0.29.0 — Oct. 11, 2026

- **Slides** — added a ten-slide sample deck drawn with A1 components and tokens, influenced by a reference presentation. Compare transitions from simple to content-aware: Cut, Fade, Push, Zoom, Color wipe, Cascade (each piece leaves and arrives in turn) and Morph (pieces two slides share move, resize and recolour into place while the rest fade). Choose how each slide's points load: all at once, fade in, rise in or step through on each Next. Includes three speeds, keyboard navigation, slide and point announcements, reduced motion, a card preview and About link.

## 0.28.2 — Oct. 11, 2026

- **Verification completion** — hide individual service cards once verification succeeds, including restored completed sessions. Keep the completion summary, receipt and activity log; active and failed runs retain their service details.

## 0.28.1 — Oct. 11, 2026

- **Linear verification progress** — summary and service cards now use A1 StatusBar instead of circular indicators. Active checks and retries show indeterminate linear progress, completed checks show a full bar and the summary counts completed checks. Built-in Card icons and progressive details are preserved. Pause controls stay off for this automatic flow.

## 0.28.0 — Oct. 11, 2026

- **Reordering: more placements and indicators** (A1-2698) — added four placement animations (Spring, Pop, Slide in and Fade in) and six insertion indicators. Over the slot: Empty slot, Glow and Arrows. In a gutter beside the list, where the dragged item never covers them: Side marker, Pointer and Position rail (a dot for every position while dragging). Slide in mirrors in right-to-left; Glow stops pulsing with reduced motion; margin indicators fit on phones.

## 0.27.2 — Oct. 11, 2026

- **Verification card icons** — verification summary, service, recovery and receipt cards now use A1 Card’s built-in icon treatment. Separate, consistently sized progress indicators preserve activity feedback without custom icons inside the rings. Progressive details and stable card layouts remain intact.

## 0.27.1 — Oct. 11, 2026

- **Progressive verification details** — checks appear only when they start. Results, slow-service notices and retry details append in place, preserving earlier information. The summary stays steady and service indicators keep the same footprint through completion, avoiding text reflow as spinners become checkmarks. Screen-reader progress announcements and automatic recovery remain available.

## 0.27.0 — Oct. 11, 2026

- **Verification journey** — added a prefilled 19-field application, automatic verification across 6 simulated APIs and a detailed completion receipt. Steady, fast, slow, automatic-recovery and service-unavailable scenarios show named checks, per-service progress indicators, bounded automatic retries, saved work and explicit next steps. Interrupted runs continue automatically on reload. The form uses Sticky Actions; there is no pause control. Includes session checkpoints, downloadable application/receipt, reduced-motion support and a canvas preview.
- **Viewport previews fit both axes** — every experiment using the shared responsive preview now scales to available height as well as width, accounting for the bezel, caption, host panel and mobile configuration sheet. Device dimensions and scrolling inside the preview stay intact.

## 0.26.1 — Oct. 11, 2026

- **Timeline sample content and eyebrows** — replaced the content copied from the reference image with an invented history of Fieldnote, a fictional reading app, in sentence case. In the vertical layout, each year is now an eyebrow above its title instead of sitting beside the axis.

## 0.26.0 — Oct. 11, 2026

- **Timeline** — added a supplied timeline rebuilt as an interface: four milestones from 2020 to 2023 on a coloured axis. Each connector keeps the original shape, wrapping its badge in a quarter arc and turning into a stem that ends at a node beside the milestone's details. Wide screens alternate milestones above and below the axis; narrow screens run the axis down the side with details after it. Includes Auto/Horizontal/Vertical layouts, device previews, theme colours that follow light and dark mode, a card preview and About link.

## 0.25.4 — Oct. 11, 2026

- **Required rail checkmarks** — in the Required fields experiment, each answered stop on the rail now becomes a green success checkmark that pops in (no pop with reduced motion). A stop whose answer fails a format check keeps its number and turns red.

## 0.25.3 — Oct. 11, 2026

- **Frosted glass tile finish** (A1-2698) — refined the panes toward translucent glass subway tiles: tighter corners, wider polished bevels, light entering the top edges, softer seams and contact shadows, and a restrained milky face. Diffuse daylight now passes through the backdrop. Corrected CSS declaration ordering so production builds retain actual backdrop blur and the hollow bevel mask. Refreshed the canvas preview.

## 0.25.2 — Oct. 11, 2026

- **Required fields: new alternatives** — replaced the variations built on A1's existing markers with five new ones, subtle to extreme: **Margin tick** (a line beside each required field), **Ink lines** (solid required fields, dashed optional ones), **Completion rings** (rings that fill in as you answer, with section counts), **Opt-in extras** (only required fields show; optional ones are added on request) and **Required rail** (numbered stops on a track, optional fields off it). Each has its own submission treatment: red ticks, spellcheck-style waves, red rings with "still needed" counts, a "Before you send" checklist, or broken stops with a sticky bar that steps through each missing field. Removed Spotlight. The fields no longer show A1's asterisk, Required badge or error styling; required state and messages are still announced to assistive technology.

## 0.25.1 — Oct. 11, 2026

- **Sidebar categories at the top level** (A1-2698) — removed the All experiments parent from the experiment tree, so the five categories sit at its top level. The current experiment's category still opens by default; the header's All experiments link still returns to the canvas.

## 0.25.0 — Oct. 11, 2026

- **Required fields** — added a comparison of six ways to mark required and optional fields on one complex form (16 fields, 10 required), from subtle to extreme: Asterisk, Optional labels, Both marked, Badges, Grouped and Spotlight. Each shows how missing fields are marked on submission — inline errors with focus on the first one, linked error summaries, a count on the required group, or Spotlight's progress meter and red highlights. Includes a fill-required shortcut for the success path, reset, a card preview and About link. Uses A1 field markers and live theme roles.

## 0.24.0 — Oct. 11, 2026

- **Experiment categories** (A1-2698) — grouped sidebar navigation into AI, Page loading, Controls and interaction, Layout and surfaces, and Data and visualization. The current experiment’s category opens by default. Search matches category names and experiment titles, expands matching groups and hides empty ones. Category activation keeps the mobile navigation open, and Enter/Space activates experiment links. The canvas retains its registry order.

## 0.23.0 — Oct. 11, 2026

- **Billboard with actions** (A1-2698) — added a token-native composition with a bold introduction, supporting highlights and a separate panel of linked actions. Includes original copy, editable headline/introduction/panel heading, Card or Action Tile presentation, accent/neutral surfaces, optional descriptions, stacked layout and phone-through-desktop previews. Uses existing A1 components and tokens without custom CSS.

## 0.22.0 — Oct. 11, 2026

- **Four more page loaders** — each its own experiment, on the same sample page, responsive viewport and controls (speed, finish loading, pause/resume, replay):
  - **Blueprint**: the page is drafted on blueprint paper; each block's outline draws on with its measurements, then the grid drifts until the page is ready.
  - **Jigsaw**: the page arrives as puzzle pieces that fly in, spinning, and snap together into its layout; a shine sweeps the finished puzzle, then the pieces fall away.
  - **Fresh paint**: a paint roller sweeps the page and each pass reveals more fidelity — layout blocks, then text lines and the button, then the real page, soft and grey — until it dries into full colour.
  - **Sunrise**: the page's blocks are silhouettes under a starry sky; the sun rises with loading progress, slowing if loading drags on, and full day reveals the page.

  All use theme roles and new component tokens, keep the page out of the tab order until it is ready and respect reduced motion. Under construction now shares the same sample page and controls. Includes canvas cards, tree entries, About links and previews.

## 0.21.0 — Oct. 11, 2026

- **Reordering** (A1-2698) — added a draggable process list with insertion-line and target-outline cues. Choose Subtle, Plop, Tilt and settle, or Instant placement, with 150/300/500 ms duration detents. Includes animated neighbor displacement, keyboard pickup/move/drop, per-item move buttons, cancellation, position announcements, immediate reduced-motion placement, reset and a card preview. The controlled list and isolated motion styles are reusable without the Labs shell.

## 0.20.0 — Oct. 11, 2026

- **Verify button** (A1-2698) — added a simulated critical-action experiment with opening safety shutters, a timed verification ring and animated completion. Arm, hold and release to confirm; early release, dragging away, Escape and interruption cancel. Includes a click-only confirmation path, adjustable action label and 1/2/3-second holds, reset, reduced motion, theme tokens and a card preview.

## 0.19.0 — Oct. 11, 2026

- **Under construction** — added a second page-loading experiment: while the page loads, a tower crane builds it. It fetches each block at its mast, carries it along the jib, lowers it into place and sets it down as a placeholder with a puff of dust — header, hero, three cards and a button. If loading outlasts the build, the crane waits with its hook bobbing while the placeholders shimmer. Finish loading lifts the crane away and the placeholders become the real page. Uses the responsive viewport (phone by default), with crane speed (relaxed, normal, quick), pause/resume, finish and replay. The crane follows the theme's warning colours; reduced motion shows all placeholders at once with a parked crane. The reusable `PageConstruction` is independent of the Labs shell. Includes a canvas card, tree entry, About link and preview.

## 0.18.0 — Oct. 11, 2026

- **Nodes and canvas** (A1-2698) — combined A1 Canvas, Node and NodeConnector in one experiment showing six connected nodes. Includes node dragging, pan/zoom, connected-path highlighting, configurable shapes and line styles, label editing, keyboard position controls, reset and a text connection list. The graph refits on resize without discarding edits and uses the existing responsive configuration shell and A1 theme styles.

## 0.17.0 — Oct. 11, 2026

- **Color token visualizer** — added a1-web's Foundations color visualization as an experiment, unchanged: A1 color ramps plotted in a 3D OKLCH space (height for lightness, distance for chroma, rotation for hue), with ramp diagnostics and a step-alignment view. Its ramp, token, ramp-visibility and guide controls sit in the configuration panel, and it follows the active theme and mode. It reuses the a1-web component directly, so both stay in sync, and loads its 3D library only when opened. Includes a canvas card, tree entry, About link and preview.

## 0.16.0 — Oct. 11, 2026

- **Balanced home canvas** — the home page now arranges experiments in the most balanced block for their count, leaning wide, instead of a single row on a 20-by-20 grid: 6 experiments show as 3×2, 7–8 as 4×2, 9 as 3×3 and 10–12 as 4×3. The block is centred and fits typical laptop and desktop viewports without scrolling; smaller screens still scroll or drag in both directions. **Breaking (contributors):** registry entries no longer take a `slot`; cards follow registry order. Remove `slot` from any new entry.

## 0.15.3 — Oct. 11, 2026

- **AI thinking: cursor height** (A1-2698) — set the cursor to 1em tall so it scales with the thinking text.

## 0.15.2 — Oct. 11, 2026

- **AI thinking: inline status** (A1-2698) — the animated thought now replaces the visible Thinking label directly beneath Assistant. Removed the terminal panel, background, border and reserved height while preserving the tall cursor and screen-reader status.

## 0.15.1 — Oct. 11, 2026

- **AI thinking: replace thoughts in place** (A1-2698) — each new thought now replaces the current terminal line instead of adding a history row. Length-based timing, typing, random selection and playback controls are preserved.

## 0.15.0 — Oct. 11, 2026

- **AI thinking** (A1-2698) — added a simulated AI chat with terminal-style thinking text, a tall block cursor and a short command history. Edit the status lines, then apply them; subsequent lines are selected randomly without immediate repeats, with typing and reading time based on line length. Includes pause/resume and finish controls in configuration, a sample completion, a message composer, static reduced-motion behavior, quiet screen-reader status, an isolated reusable core and a concept card. Defaults use the supplied moose sentence and original absurdist lines.

## 0.14.4 — Oct. 11, 2026

- **Frosted glass: glass fields with inside labels** — each field is now its own piece of frosted glass inlaid in a hole cut in the form glass, with a thin seam around it, rather than an empty cutout. Labels sit inside the field above the value, and the whole piece is the click target with the focus ring around it. Typed text sits on frosted glass again, so the light wash is no longer needed.

## 0.14.3 — Oct. 11, 2026

- **Frosted glass: inlaid form and cutout fields** — the form is now a separate piece of glass set flush into a hole in the viewport sheet, at the same depth, with a thin seam around it instead of resting on top. Its fields are holes cut through the glass: you see the backdrop through them, with a shaded top wall and a lit bottom lip showing the glass's thickness. A faint wash of light in each opening keeps typed text at WCAG AA contrast over every backdrop. The header and its chip still rest on top of the sheet.

## 0.14.2 — Oct. 11, 2026

- **Frosted glass: deeper panels** — panels now show a 4 px glass side that is bright where light enters and darkens toward the bottom, a firmer contact shadow and an ambient shadow that grows with each layer. Faces gain stronger bevels, a soft glow along the top and the faint edge darkening of thick glass. Fields are deeper recesses, and the button's thicker blue side sinks fully when pressed.

## 0.14.1 — Oct. 11, 2026

- **Frosted glass: thick glass** — the viewport itself is now the base sheet of glass, edge to edge. Panes, fields, the chip and the button have tighter corners, and each element reads as a slab about 2 mm thick resting directly on the one below: a polished rim catches the light, a thin glass side shows along the bottom and a tight contact shadow grounds it. Fields read as shallow recesses; the button is a tinted slab that sinks when pressed.

## 0.14.0 — Oct. 11, 2026

- **Frosted glass** — added a visual experiment where a sample page is built from stacked panes of thin, slightly rounded frosted glass over colourful shapes, shown in the responsive viewport (phone by default). The page, header, form, fields and chip are each a sheet of glass; every layer up gets a little more frost and a deeper, still subtle, shadow. Includes a header, an invite form and a full-width tinted-glass submit button that confirms nothing was sent. Configure the viewport, frost (light, medium, heavy) and backdrop (Aurora, Sunset, Meadow). By request, this study uses raw values and a fixed light-glass look rather than A1 tokens and themes. The reusable `FrostedGlass` and `GlassPane` are independent of the Labs shell. Includes a canvas card, tree entry and preview.

## 0.13.1 — Oct. 11, 2026

- **Button completion: slingshot exit** — after the paper plane launches and the band snaps, the slingshot recoils out through the button's left edge with a slight drop, leaving only the plane in flight. Reduced motion keeps the still slingshot until the result mark draws.

## 0.13.0 — Oct. 11, 2026

- **Switch transition: 100 ms default** (A1-2698) — added a 100 ms duration detent and made it the default for the experiment and reusable switch, using A1’s quick motion token. Longer duration options remain available.

## 0.12.4 — Oct. 11, 2026

- **Switch transition: gentler easing** (A1-2698) — reduced the midpoint slowdown so the strokes and thumb keep moving smoothly. Selected duration, 90-degree rotation and reduced-motion behavior are preserved.

## 0.12.3 — Oct. 11, 2026

- **Switch transition: simpler presentation** (A1-2698) — reduced each stroke’s rotation to 90 degrees, retaining the slower middle and distinct final X/checkmark. Removed the surrounding card and separate On/Off text; native switch semantics still announce the state. Thumb and stroke colors change together without blending into each other midway.

## 0.12.2 — Oct. 11, 2026

- **Switch transition: A1 sizing and easing** (A1-2698) — the 1× label, row spacing and padding now match the default A1 Switch as well as its track and thumb. Motion moves faster at the ends and slows through the middle, keeping the selected duration and immediate reduced-motion behavior.

## 0.12.1 — Oct. 11, 2026

- **Switch transition: rotating strokes** (A1-2698) — both strokes now rotate through 180 degrees while moving and resizing between the X and checkmark. Toggling off reverses the rotation; reduced motion shows the final state immediately.

## 0.12.0 — Oct. 11, 2026

- **Switch transition: longer duration** (A1-2698) — added a 750 ms Transition duration detent using A1’s slowest motion token. The default remains 300 ms, and reduced motion still changes state immediately.

## 0.11.0 — Oct. 11, 2026

- **Switch transition: standard size** (A1-2698) — added a 1× Scale detent using standard A1 switch dimensions, alongside 2×, 3× and 4×. The default remains 4×; both strokes and keyboard/reduced-motion behavior work at every scale.

## 0.10.0 — Oct. 11, 2026

- **Button completion: paper-plane launch** — Send email is now the first tab and one large, fixed-size button that never resizes. At rest it centres a large, filled send icon, Send email and Ready to send to 1,240 subscribers. On press the text slides down and fades, Sending to 1,240 subscribers… appears in a bottom row, and the icon itself — same shape, fill and size — drops into a slingshot near the left edge. It is drawn back and launched along a clear arc, trailed by dashed, curved motion lines that animate away behind it. The flight follows the real send time: the plane covers most of the arc in a typical send and keeps slowing if sending takes longer. On success it flies out through the right edge; after a short beat the slingshot fades, a centred checkmark draws on and the button turns green and reads Email sent to 1,240 subscribers. On failure it crash-lands and vanishes in a mini explosion; after the same beat a cross draws on and the button offers Couldn’t send the email. Try again. All secondary text shares one size and weight. Button size now applies to Publish only. Reduced motion shows a still plane, then the result mark.

## 0.9.0 — Oct. 11, 2026

- **Switch transition** (A1-2698) — added an enlarged switch using A1 switch dimensions, colors, shadow and focus tokens. The same two strokes move and resize from an X to a checkmark as the thumb travels, and reverse when switched off. Configure 2×, 3× or 4× scale, 150/200/300 ms timing and disabled state. Includes native switch semantics, keyboard support, immediate reduced-motion states, isolated reusable styling and a concept preview.

## 0.8.0 — Oct. 11, 2026

- **Button completion** — added an experiment where a primary-styled button becomes its own result, with tabs for two versions. **Publish** keeps a fixed width while the icon, label and colour change: Publishing… with a spinner, then Published (success) or Not published, followed by a Try again retry (failure). **Send email** expands into a small stage: its label slides to the bottom and reads Sending to 1,240 subscribers…, and the send icon grows into a flat sheet that folds into a paper plane along dashed fold lines (corners, then wings), waits drawn back in a slingshot until sending resolves, then launches before collapsing to Sent. On failure, the plane nosedives and the button becomes Try again. Pill-shaped buttons ease smoothly into and out of the stage's corners. Both buttons fill the card's width. Configure the outcome, button size and 1-, 2- or 4-second processing time. Both buttons use A1 button tokens, so they follow every theme and mode. A polite status line announces each result; focus stays on the button; reduced motion removes shakes, fades, expansion and flight. The reusable `CompletionButton` and `SendButton` are independent of the Labs shell. Includes a canvas card, tree entry and preview.

## 0.7.0 — Oct. 11, 2026

- **Focus state animations** (A1-2698) — added a short form with text, email and textarea fields, a Topic radio group and Submit/Cancel actions. Choose Ring settle, Halo pulse, Underline sweep or Double ring from an A1 choice group, with durations of 100, 150 or 200 milliseconds. Each treatment keeps a visible focus indicator after motion ends and appears immediately with reduced motion. Colors follow the active theme’s field and button focus tokens. Overrides are confined to opted-in demo controls; the reusable scope is independent of Labs. Includes a concept card, searchable tree entry, About link and export guidance.

## 0.6.1 — Oct. 11, 2026

- **Experiment isolation and A1 promotion guidance** (A1-2698) — requires experiment-owned, scoped CSS and reusable implementations independent of the Labs shell. Documents API and dependency handoff, isolated-host validation and the standard workflow for promoting validated patterns or components into A1.

## 0.6.0 — Oct. 11, 2026

- **In-preview animation control** (A1-2698) — added a small tertiary Stop animation button inside the loading viewport, switching to Resume animation when stopped. It stays synchronized with the configuration controls. Removed explanatory UI copy while retaining the short loading heading and screen-reader status announcements. Updated the card preview.

## 0.5.1 — Oct. 11, 2026

- **Softer viewport glow** (A1-2698) — replaced the sharp loading border with two blurred gradient layers. The flowing colors use only the active theme’s accent, info, success, warning and error roles. Preserved pause, completion and reduced-motion behavior, and refreshed the card preview.

## 0.5.0 — Oct. 11, 2026

- **Experiment card previews** (A1-2698) — added static concept images to both experiment cards: the image-generation disc field and the glowing phone viewport. Cards retain equal dimensions with space for the image, title and description. Previews use the actual experiment renderers, include descriptive alternatives and can be refreshed with the preview capture command.

## 0.4.1 — Oct. 11, 2026

- **Loading message and content reveal** (A1-2698) — the page-loading preview now shows a centered explanation while loading or paused. Sample page content appears only after Finish loading; replay hides it again.

- **Experiment-only canvas** (A1-2698) — removed placeholder cards so the grid shows only actual experiments. Preserved card positions, initial centering and two-axis scrolling; unoccupied positions remain empty.

## 0.4.0 — Oct. 11, 2026

- **Page loading experiment** (A1-2698) — added a glowing border that travels around a responsive viewport. Defaults to the A1 Web phone preview, with landscape phone, tablet, laptop and desktop options; includes cycle duration, pause/resume, finish and replay controls. The glow follows theme settings and stays still with reduced motion. Added a second canvas card and searchable tree destination, with separate experiment state inside the shared responsive page shell.

## 0.3.1 — Oct. 11, 2026

- **Labs TODO** (A1-2698) — added an app backlog with creating a contribution model for experiments as its first item.

## 0.3.0 — Oct. 11, 2026

- **About Labs and release notes** (A1-2698) — added an About Labs page explaining the playground, linking to A1 Web and the first experiment, and displaying versioned release notes. Open it from the canvas or experiment navigation. The page follows Labs appearance settings and reads release notes directly from this changelog.

## 0.2.0 — Oct. 11, 2026

- **Agent instructions and versioning** (A1-2698) — added a Labs AGENTS.md entry point and central contribution guide. Established independent major/minor/patch versioning, required synchronized package/lockfile/changelog updates and made maintaining agent instructions and the README part of every feature change. Grouped the completed experiment work below into the 0.2.0 development baseline.

- **App README** (A1-2698) — documented setup, local ports, build/test commands, experiment controls, accessibility, source structure, adding experiments and static hosting.

- **Frame sliders and reduced motion** (A1-2698) — border radius and width now use A1 sliders with labeled detents, a theme-default stop and accessible pixel values. Both animation styles respect live device motion preferences: shapes stay still, pulsing stops and the image reveals instantly. Re-enabling motion cannot hide a completed image; replay resets the animation.

- **Theme-aware animation** (A1-2698) — both styles now resolve their background, progress palette and blob highlight through A1 surface, info, success and text roles. Light/dark mode, theme and system-preference changes redraw immediately without restarting or unpausing. The blob preserves contrast on light surfaces and glows on dark surfaces; the completed photo stays borderless.

- **Glowing blob animation** (A1-2698) — added a style toolbar with Discs and Glowing blob. The blob gains organic folds, brightness and contrast as progress grows, using the existing blue-to-green palette. Switching styles preserves progress and pause state; reduced motion keeps the silhouette still. Both styles retain the shared image reveal and remove the progress border when the image is fully revealed.

- **Configuration heading** (A1-2698) — removed the Configuration heading so the panel starts with the aspect-ratio controls.

- **Simplified experiment sidebar** (A1-2698) — removed the Experiments heading and desktop collapse button. Search and the tree remain visible; mobile navigation retains its close button.

- **Duration slider** (A1-2698) — replaced the duration toolbar with an A1 Slider snapping to labeled 5-, 15- and 30-second detents. Defaults to 15 seconds and announces the value in seconds. Aspect ratio remains a toolbar.

- **Configuration toolbars** (A1-2698) — replaced aspect-ratio and duration selects with labeled A1 toolbars showing every option. Preserves selected state, arrow-key navigation and existing resize/replay behavior in desktop and mobile configuration. Corrected shared toolbar text contrast on raised surfaces in Aperture.

- **Image generation frame and accessibility** (A1-2698) — removed disc outlines. Added token-backed border radius (4–64 px) and width (1–8 px) controls that redraw without restarting progress. Added explicit polite, atomic announcements at 25% milestones and for pause, reveal, completion and image-loading errors; retained exact progress, descriptive image text, busy state, reduced motion and keyboard-operated playback controls. Corrected selected experiment text contrast in the shared Dispatch theme.

- **Appearance settings** (A1-2698) — added the A1-web theme selector and Light, Dark and System color scheme controls to both Labs headers. Preferences persist across routes and reloads, system mode follows OS changes, and reset restores the Default theme in dark mode. Reuses the shared A1-web theme registry and font assets. Corrected shared SegmentedControl inactive-icon contrast in dark mode.

- **Experiment search** (A1-2698) — added live, case-insensitive search above the experiment tree, with clear-search support and a no-results message. Works in the desktop sidebar and mobile overlay using A1 SearchField.

- **Image generation animation** (A1-2698) — added a default 4:3, 15-second animation with a clockwise pulsing progress border, growing blue-to-green disc field and a downward wave reveal of a local sample photo. Includes aspect ratio and duration controls, pause/resume, replay, reduced-motion support and accessible progress. Uses no generation service.

- **AI image generation placeholder** (A1-2698) — centered the opening canvas on a linked experiment card. Added `/experiments/ai-image-generation` with an experiment tree, central placeholder and configuration panel. Reuses A1-web’s desktop rail, responsive SideNav overlay and mobile BottomSheet behavior. No generation service is connected.

## 0.1.0 — Oct. 11, 2026

- **Experiment canvas** (A1-2698) — added a standalone dark app with 400 equal-size placeholders arranged in 20 rows and 20 columns. Supports two-axis scrolling, touch scrolling, keyboard scrolling and mouse dragging. Opens at the center of the canvas.
- **Local development** (A1-2698) — reserved port 5187 and added a standalone production build for labs.a1design.app.
