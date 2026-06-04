# A1 Web Changelog

## Unreleased

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
