# A1 Web Changelog

## Unreleased

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
