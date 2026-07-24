# A1 Design System — Guidelines Hub

Design system package: `@gtivr4/a1-design-system-react`

---

## Reading order

Always read first:
- `Guidelines.md` — this file; the main hub and entry point
- `tokens.md` — foundational design tokens (color, typography, spacing); also covers required CSS imports and theming
- `content-standards.md` — product and documentation voice, grammar, formatting, AP Style defaults, and A1 overrides

Read on-demand:
- `setup.md` — read once when installing: CSS imports, fonts, PostCSS, providers
- `components.md` — read BEFORE using any design-system component
- `icon-discovery.md` — read BEFORE using any icons
- `styles.md` — read when building page layouts or applying custom spacing

---

## Companion guideline files

These files live alongside `Guidelines.md` in the `/guidelines/` directory and should be consulted for their respective focus areas when building UIs with this design system.

| File | Focus |
|---|---|
| `components.md` | Component imports, props/API surfaces, variants, composition patterns, and usage examples |
| `icon-discovery.md` | Icon naming convention, import path, available sizes, and how to search for icons |
| `tokens.md` | Design tokens, color/typography/shadow/border tokens, theming, and CSS custom properties |
| `styles.md` | Spacing scales, layout primitives, responsive patterns, and CSS methodology |
| `setup.md` | Project setup instructions, provider configuration, required CSS imports, and peer dependency requirements |
| `content-standards.md` | Product copy and documentation standards, including casing, numerals, dates, phone numbers, addresses, accessibility, and localization |

---

## Quick-start checklist

1. **Install**: `pnpm add @gtivr4/a1-design-system-react`
2. **Import CSS** at your app entry point — **all three imports, in this order**:
   ```ts
   import "@gtivr4/a1-design-system-react/tokens.css";
   import "@gtivr4/a1-design-system-react/themes.css";
   import "@gtivr4/a1-design-system-react/color-scheme.css";
   ```
   - `tokens.css` — base `:root` design tokens (spacing, shadows, radii, component dimensions, colors). **Must be first.**
   - `themes.css` — theme-selector overrides (heritage, accessible, etc.).
   - `color-scheme.css` — dark-mode inverse surface tokens and global box-model reset.
3. **Load the fonts** — Material Symbols Outlined (icons) and Inter (text):
   ```css
   @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
   @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');
   ```
   Branded themes need additional faces — see `setup.md`.
4. **Import components**:
   ```ts
   import { Button, Card, Heading, Paragraph } from "@gtivr4/a1-design-system-react";
   ```
5. **Optionally import spacing utilities**:
   ```ts
   import "@gtivr4/a1-design-system-react/utilities/spacing.css";
   ```
6. **Configure PostCSS** (required for responsive Grid, Stack breakpoints, and other components). Add a `postcss.config.mjs` at your project root:
   ```js
   import postcssGlobalData from "@csstools/postcss-global-data";
   import postcssCustomMedia from "postcss-custom-media";
   import { createRequire } from "module";
   const require = createRequire(import.meta.url);
   const breakpoints = require.resolve("@gtivr4/a1-design-system-react/breakpoints.css");
   export default {
     plugins: [
       postcssGlobalData({ files: [breakpoints] }),
       postcssCustomMedia(),
     ],
   };
   ```
   Install the PostCSS dependencies: `pnpm add -D postcss-custom-media @csstools/postcss-global-data`

---

## All exported components

The full catalog — each component's key props, variants, and usage rules — is
in `components.md`. **Check it before creating any UI element.** Every named
export, by category:

- **Layout:** `Section` `SectionSeparator` `Card` `Stack` `Cluster` `Grid` `GridItem` `gridItemSpanClassNames` `Bleed` `Inset` `Spacer` `Inverse` `PageLayout` `ButtonContainer` `StickyActions` `Figure`
- **Typography:** `Heading` `HeadingMark` `Paragraph` `Blockquote` `List` `ListItem` `Code` `Divider`
- **Actions & controls:** `Button` `SplitButton` `IconButton` `ActionTiles` `ActionTile` `Chip` `ChipGroup` `Switch` `SegmentedControl` `Slider` `Toolbar` `ToolbarToggle` `ToolbarButton` `ToolbarGroup` `ToolbarMenu` `ToolbarDivider` `TOOLBAR_NONE_ICON` `Accordion` `Tabs` `TabList` `Tab` `TabPanel` `Link`
- **Navigation:** `TopHeader` `SideNav` `SideNavItem` `SideNavGroup` `BottomDrawer` `BottomSheet` `Breadcrumb` `PageNav` `TreeMenu` `Pagination`
- **Inputs:** `TextField` `SearchField` `NumberField` `DateField` `TimeField` `PhoneField` `ZipField` `ZIP_MASKS` `CreditCardField` `TextareaField` `SelectField` `Autocomplete` `CheckboxGroup` `RadioGroup` `ChoiceGroup` `Fieldset` `FieldRow` `InlineEditable` `TokenSelect`
- **Feedback:** `Banner` `MessageBadge` `MessageEmptyState` `Notification` `Snackbar` `SnackbarStack` `StatusBar` `CircularProgress` `StepTracker` `Stat`
- **Overlay:** `Dialog` `Overlay` `Menu` `MenuSection` `MenuItem` `ContextMenu` `Tooltip`
- **Recharts:** `AreaChart` `BarChart` `Chart` `ComposedChart` `FunnelChart` `LineChart` `PieChart` `RadarChart` `RadialBarChart` `SankeyChart` `ScatterChart` `SunburstChart` `TreemapChart`
- **Data:** `DataTable` `DataTableFilters` `DefinitionList` `Calendar` `Canvas` `Node` `CanvasEdge` `NodeConnector`
- **Icons:** `Icon` `registerCustomIconFont` `clearCustomIconFont`
- **Localization:** `LabelsProvider` `useLabel`

Keep this list in sync with `src/index.js` — `npm run pack:check` verifies it.

---

## Before using a component

1. Check `components.md` for the component's import path, props, and variants.
2. Use the component's own props (`variant`, `size`, `icon`, etc.) rather than overriding its CSS classes.
3. Use `--semantic-color-*` and `--base-spacing-*` CSS custom properties for any surrounding custom styles.

---

## Before using an icon

1. Check `icon-discovery.md` for available icons.
2. Do NOT guess icon names — verify the icon exists first.
3. If an icon doesn't exist, pick a different one and verify.

---

## Theming

| Class on `<html>` | Effect |
|---|---|
| (none) | Default A1 light theme |
| `.a1-theme-dark` | Global dark mode |
| `.a1-theme-light` | Force light mode (inside dark) |
| `.a1-theme-accessible` | High-contrast accessible variant |
| `.a1-theme-heritage` | Legacy brand theme |
| `.a1-theme-fresh` / `.a1-theme-crochet` / `.a1-theme-aperture` / `.a1-theme-marshmallow` / `.a1-theme-catlympics` | Branded themes — each needs its own fonts (see `setup.md`) |

Wrap any section in `<Inverse>` to render it in the opposite color mode without changing the global theme — see `tokens.md` for the inverse scope contract.

---

## Key rules

- **Use layout components before custom CSS.** Before writing `display: flex`, `display: grid`, `gap`, or `padding` as inline styles, check `Stack`, `Inset`, `Section`, `Cluster`, `Grid`, and `PageLayout` first. Custom layout CSS is a last resort.
- **Never use raw `<input>`, `<select>`, `<textarea>`, `<ul>`, or `<li>`.** Always use the corresponding design-system component.
- **Never shadow a design-system import with a local function of the same name.** If you need a custom header, name it `AppHeader`, not `TopHeader`.
- Always check `components.md` before creating any UI element — use the design-system component if one exists.
- Use `--semantic-color-*` tokens for color; never hard-code hex values.
- Use `--base-spacing-{n}` tokens for spacing; stick to the defined scale.
- Icons use Material Symbols ligature names (snake_case strings). Never invent names — always verify in `icon-discovery.md`.
- The `Heading` component supports `type="heading"` and `type="display"` — choose the right scale.
- `Dialog` uses the native `<dialog>` top layer; provide `onClose` to make it dismissable (Escape / close button / backdrop), or omit it for a non-dismissable dialog.
- `PageLayout` is the correct shell for full-page layouts — don't hand-roll header/sidebar/footer structure.
- `MessageBadge` uses `subtle` (a boolean prop), not `variant="subtle"`.
- Follow `content-standards.md` for product copy and documentation. AP Style is the default unless the A1 standard or an approved product term explicitly overrides it.
