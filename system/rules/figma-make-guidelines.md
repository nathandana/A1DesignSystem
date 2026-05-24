# A1 Design System — Figma Make guidelines hub

Design system: `@gtivr4/a1-design-system-react` v0.1.0

Use these guidelines when generating screens, components, or prototypes in Figma Make for the A1 Design System.

## Reading order

Always read first:

- `Guidelines.md` — main hub and entry point.
- `setup.md` — required project configuration, providers, and CSS imports.
- `tokens.md` — foundational design tokens for color, typography, spacing, radius, borders, and shadows.

Read on demand:

- `components.md` — read before using any design-system component.
- `icon-discovery.md` — read before using any icons.
- `styles.md` — read when building page layouts or applying custom spacing.

All companion files live in the `/guidelines/` directory alongside `Guidelines.md`.

| File | Focus |
|---|---|
| `components.md` | Component imports, props/API surfaces, variants, composition patterns, and usage examples |
| `icon-discovery.md` | Icon naming convention, import path, available sizes, and how to search for icons |
| `tokens.md` | Design tokens, color/typography/shadow/border tokens, theming, and CSS custom properties |
| `styles.md` | Spacing scales, layout primitives, responsive patterns, and CSS methodology |
| `setup.md` | Project setup instructions, provider configuration, required CSS imports, and peer dependency requirements |

## Quick start

```tsx
// 1. Import CSS once in the app entry.
import "@gtivr4/a1-design-system-react/themes.css";
import "@gtivr4/a1-design-system-react/color-scheme.css";

// 2. Wrap the app in LabelsProvider when labels/localization are needed.
import { LabelsProvider } from "@gtivr4/a1-design-system-react";

function Root() {
  return (
    <LabelsProvider locale="en" labels={{ label: {} }}>
      <App />
    </LabelsProvider>
  );
}

// 3. Use system components.
import { Button, Heading, Card, Grid, GridItem } from "@gtivr4/a1-design-system-react";
```

## System intent

A1 Design is an AI-first, token-driven design system. Treat the design system as the source of truth for layout, color, typography, spacing, components, accessibility, and content style. Create practical product interfaces, not marketing compositions, unless explicitly asked.

## Core principles

- Always use semantic tokens. Never use raw hex, rgb, hsl, or arbitrary color values.
- Never override `.a1-*` class internals. Extend with `className` and custom CSS that references design tokens.
- Use the component, not raw HTML. Use `<Button>` instead of `<button>`, `<Heading>` instead of a styled heading tag, and `<Card>` instead of a custom card.
- Icons are strings, not imports. Pass Material Symbols names in snake_case to `icon` props and `<Icon name="...">`.
- Use responsive props before custom media queries. Prefer `columns={{ xs: 1, md: 2 }}` on `Grid` and `size={{ xs: "sm", lg: "xl" }}` on `Heading`.
- If a requested design conflicts with these rules, follow the rules and make the closest compliant version.

## Visual foundation

- Use design tokens before creating new values.
- Use the A1 color system: neutral surfaces, accent actions, and semantic status colors for info, success, warning, and error.
- Use semantic surfaces: page, panel, raised, and inverse.
- Use inverse sections intentionally for high-contrast emphasis or theme demonstration.
- Use spacing from the A1 scale: 4, 8, 12, 16, 20, 24, 32, 40, 64, 96, and 128.
- Use radius consistently: controls around 6px, larger containers around 8px to 12px.
- Use shadows only for actual elevation, overlays, dialogs, raised cards, or menus.
- Do not create one-off colors, gradients, decorative blobs, or unsupported component styles.

## Theme switching

```tsx
// Apply dark mode.
document.documentElement.classList.add("a1-theme-dark");

// Apply accessible theme.
document.documentElement.classList.add("a1-theme-accessible");

// Apply heritage theme.
document.documentElement.classList.add("a1-theme-heritage");

// Invert a section.
import { Inverse } from "@gtivr4/a1-design-system-react";

<Inverse as="section">...</Inverse>
```

Design generated UI so it can survive light, dark, accessible, heritage, and inverse contexts without hard-coded overrides.

## Typography and content

- Use sentence case for headings and labels.
- Do not use all caps or uppercase transforms for readable content.
- Use clear hierarchy: display text for page-level hero moments, heading text for sections, body text for explanation.
- Keep text concise and scannable.
- Prefer direct, practical language over abstract marketing copy.
- Use headings like "Create account", "Payment details", and "Recent activity".
- Avoid title case like "Create Account" or vague labels like "Submit" when the action can be named more clearly.

## Layout

- Build layouts that are structured, responsive, and easy to scan.
- Align controls with the content they affect.
- Do not float actions far away from their related content.
- Use cards for repeated items, contained modules, or framed details. Do not nest cards inside cards.
- Use panels, sections, and page bands for larger areas instead of making every section a card.
- Keep dense product interfaces quiet and utilitarian. Prioritize clarity, comparison, and repeated use.
- Ensure text never overlaps other UI and never overflows buttons, badges, tabs, cards, or panels.
- Give fixed-format elements stable dimensions so icons, labels, counts, hover states, and loading states do not shift layout.

## Components

Reuse A1 components and patterns wherever possible:

- Buttons
- Button containers
- Icon buttons
- Links
- Cards
- Dialogs
- Headings
- Paragraphs
- Badges
- Notifications
- Tabs
- Segmented controls
- Pagination
- Page layouts
- Grids and grid items
- Side navigation
- Menus
- Labels provider
- Inverse sections

Only create a new component when the existing system cannot express the need.

## Button rules

- Use buttons for actions and links for navigation.
- Use one primary button per decision area.
- Use hierarchy consistently: primary, secondary, tertiary, destructive, and icon button.
- Use short verb-led labels, usually two to four words.
- Use labels like "Save changes", "Create account", "Download report", "Delete project", or "Remove member".
- Avoid vague labels like "Submit", "OK", "Yes", "No", or "Continue" unless the surrounding context makes the action unmistakable.
- Tertiary buttons should include both a relevant icon and a verb-led label.
- Icon-only buttons need accessible names and should have a large enough target.
- Use at least a 44px by 44px target for touch interactions.
- Provide clear default, hover, focus, active, disabled, loading, success, and error states when relevant.
- Destructive actions must be explicit and should use confirmation for high-risk moments.
- Do not rely on color alone to communicate priority, purpose, or risk.

## Badge rules

- Use badges for status, category, count, or metadata.
- Keep badges short and natural width. Let them hug their content.
- Use labels like "New", "Active", "Draft", "Beta", "Past due", "Approved", "Pending", "Error", "Optional", or "Required".
- Do not stretch badges to fill a row or column.
- Do not use badges for primary actions or navigation.
- Do not make badges interactive unless the interaction is explicit and necessary.
- Use semantic variants consistently: neutral, brand, info, success, warning, error, and inverse.
- Pair color with clear text. Do not rely on color alone.
- Ensure badge text and icons maintain accessible contrast in all themes.
- Use icons only when they add meaning or improve recognition.
- Avoid overusing badges; preserve their signal value.

## Icons

- Read `icon-discovery.md` before using icons.
- Do not guess icon names.
- Verify each icon name is a valid Material Symbols name in snake_case.
- There is no local icon package to glob. Icons are rendered from a web font.
- Pass icon names as strings, such as `arrow_forward`, `check_circle`, `warning`, or `auto_awesome`.
- Use icons to support recognition, not as decoration.
- Do not rely on icons alone for meaning. Pair icon-only controls with accessible labels and tooltips when useful.

## Accessibility

- Maintain readable contrast for text, icons, borders, and badges.
- Preserve visible keyboard focus states.
- Do not remove focus outlines unless replacing them with an accessible equivalent.
- Do not use color alone to communicate meaning.
- Provide clear disabled explanations when the reason is not obvious.
- Make icon-only controls understandable to assistive technology.
- Ensure status messages, errors, warnings, and confirmations are understandable as text.
- Design for light, dark, inverse, accessible, and heritage contexts when relevant.

## Interaction states

When generating interactive UI, include the states users would expect:

- Empty
- Loading
- Error
- Success
- Disabled
- Hover
- Focus
- Active
- Selected
- Expanded and collapsed

Do not design only the happy path when the component or flow naturally requires system feedback.

## Side navigation

- At desktop (≥1025px) the sidebar is sticky: it pins to the viewport top and does not scroll with the page.
- Nav items scroll internally inside the sidebar when the list overflows. The header and footer slots stay fixed at all times.
- At mobile and tablet (≤1024px) the sidebar is a fixed overlay. Use `open` and `onClose` props to control it. Provide a menu button in the page header.
- Never wrap a desktop SideNav in a container with `overflow: hidden` or `overflow: auto` — this breaks sticky positioning.
- Place the SideNav as a direct sibling to the main content area in a flex row at the page level.

## Page layout

- The body row (sidebar + main) has no gap. Do not add gap, margin, or padding between the sidebar and main area.
- All inset spacing belongs inside the main content — apply padding to the element placed inside `children`, not to the layout itself.
- This keeps sidebar backgrounds and borders flush against the main area edge-to-edge.

## Figma Make output expectations

- Use A1 tokens and component names in layer naming where possible.
- Name major frames by purpose, such as "Dashboard", "Settings", or "Component overview".
- Name sections clearly, such as "Header", "Side navigation", "Filters", "Results", and "Dialog footer".
- Keep components editable and organized with meaningful auto layout.
- Use consistent spacing, alignment, and sizing across similar elements.
- Prefer reusable component structure over one-off flattened visuals.
- Keep generated code aligned with the design-system package imports and setup.

