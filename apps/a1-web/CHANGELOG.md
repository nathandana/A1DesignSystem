# A1 Web Changelog

## v0.10.0

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
