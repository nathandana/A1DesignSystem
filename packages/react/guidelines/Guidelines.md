# A1 Design System — Guidelines Hub

Design system package: `@gtivr4/a1-design-system-react`

---

## Reading order

Always read first:
- `Guidelines.md` — this file; the main hub and entry point
- `tokens.md` — foundational design tokens (color, typography, spacing); also covers required CSS imports and theming

Read on-demand:
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

---

## Quick-start checklist

1. **Install**: `pnpm add @gtivr4/a1-design-system-react`
2. **Import CSS** at your app entry point — **all four imports are required**:
   ```ts
   import "@gtivr4/a1-design-system-react/tokens.css";
   import "@gtivr4/a1-design-system-react/themes.css";
   import "@gtivr4/a1-design-system-react/color-scheme.css";
   ```
   - `tokens.css` — base `:root` design tokens (spacing, shadows, radii, component dimensions, colors). **Must be first.**
   - `themes.css` — theme-selector overrides (heritage, accessible, etc.).
   - `color-scheme.css` — dark-mode inverse surface tokens and global box-model reset.
3. **Load Material Symbols font** in `/src/styles/fonts.css`:
   ```css
   @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
   ```
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

Every named export from `@gtivr4/a1-design-system-react` — verified against `src/index.js`:

### Layout

> **Always prefer these over raw `<div style={{ display: "flex" }}>` or custom CSS.** Check this table before writing any layout CSS.

| Component(s) | Notes |
|---|---|
| `Stack` | Flex column or row; `direction`, `gap`, `align`, `justify`, `wrap`, `as`. Use instead of `<div style={{ display: "flex" }}>`. |
| `Inset` | Padding wrapper; `space`, `block`, `inline`, `as`. Use instead of `<div style={{ padding: "..." }}>`. |
| `Section` | Page section with surface/padding/gradient; `padding`, `surface`, `gradient`, `contentWidth`, `height`, `inverse`, `as` |
| `Cluster` | Wrapping flex row for inline groups of elements |
| `Grid` / `GridItem` | Responsive CSS grid; `columns`, `gap` (on Grid); `span`, `rowSpan` (on GridItem) |
| `Bleed` | Negative-margin breakout for full-width elements inside constrained content |
| `Spacer` | Empty space block; `size` |
| `Inverse` | Activates dark/inverted color context on its subtree without changing the global theme |
| `PageLayout` | Full-page shell; `header`, `footer`, `sidebar`, `sidebarPlacement`, `stickyHeader` |
| `ButtonContainer` | Aligns a row of buttons; `align="start\|center\|end"` |
| `Figure` | Captioned media wrapper; `caption`, `ratio` |

### Actions

| Component(s) | Notes |
|---|---|
| `Button` | `variant="primary\|secondary\|tertiary\|destructive\|success"`, `size="sm\|md\|lg"`, `icon`, `iconPosition`, `as` |
| `IconButton` | Icon-only button; requires `label` (aria); `icon`, `variant`, `size`, `disabled` |
| `Switch` | Toggle switch; `checked`, `onChange`, `label`, `disabled` |

### Navigation

| Component(s) | Notes |
|---|---|
| `TopHeader` | App header with nav and actions; `logoText`, `logo`, `logoHref`, `navItems`, `actions`, `loginButton`. Do not hand-roll a header — use this. |
| `SideNav` / `SideNavItem` / `SideNavGroup` | Collapsible sidebar; supports controlled and uncontrolled group state |
| `Tabs` / `TabList` / `Tab` / `TabPanel` | Controlled; `value`, `onChange`, `variant`, `level` |
| `Breadcrumb` | `items` array with `label` and `href` |
| `PageNav` | In-page anchor navigation |
| `Pagination` | Controlled; `page`, `totalPages`, `onChange`, `siblings`, `size` |
| `SegmentedControl` | Controlled radio group; `options`, `value`, `onChange`, `fullWidth` |
| `Link` | `as`, `size`, `weight`, `icon`, `iconPosition` |

### Inputs

> Do not use raw `<input>`, `<select>`, or `<textarea>` elements. Always use the field components below.

| Component(s) | Notes |
|---|---|
| `TextField` | Text, email, search, password, number, etc.; `label`, `hint`, `error`, `size`, `required`, `disabled`, `readOnly`, `type` |
| `SelectField` | Dropdown select; `label`, `hint`, `error`, `options`, `size`, `required` |
| `TextareaField` | Multi-line text; `label`, `hint`, `error`, `size`, `required` |
| `CheckboxGroup` | Group of checkboxes; `legend`, `options`, `value`, `onChange`, `size` |
| `RadioGroup` | Group of radio buttons; `legend`, `options`, `value`, `onChange`, `size` |
| `Fieldset` | Groups related fields with a legend; `legend`, `size`, `labelPosition` |
| `FieldRow` | Lays out fields horizontally |
| `DateField` | Date input with formatting |
| `NumberField` | Numeric input with formatting |
| `PhoneField` | US phone number with mask |
| `ZipField` | ZIP code with mask |
| `CreditCardField` | Credit card number with mask |
| `TimeField` | Time input |
| `InlineEditable` | Click-to-edit text field |

### Typography

| Component(s) | Notes |
|---|---|
| `Heading` | `as`, `type="heading\|display"`, `size`, `color`, `align`, `margin` |
| `Paragraph` | `as`, `size`, `color`, `align` |
| `Blockquote` | Styled quotation block |
| `List` / `ListItem` | `List`: `variant="unordered\|ordered\|icon\|divider"`, `size`, `color`, `icon`. `ListItem`: `icon` (overrides list icon). Always use these instead of raw `<ul>/<li>`. |
| `Code` | Inline or block code; `variant="inline\|block"`, `wrapping`, `copyCode` |
| `Divider` | Horizontal rule |
| `Icon` | Material Symbols ligature; `name`, `fill`, `weight`, `grade`, `opticalSize`. Verify icon names in `icon-discovery.md` — never guess. |

### Feedback

| Component(s) | Notes |
|---|---|
| `Banner` | Inline status banner; `status`, `title`, `icon`, `onDismiss` |
| `MessageBadge` | Inline status chip; `status="neutral\|info\|success\|warn\|error"`, `subtle` (boolean), `size`, `icon`. Note: `subtle` is a boolean prop — do not use `variant="subtle"`. |
| `MessageEmptyState` | Empty state block; `scale="page\|section\|card"`, `icon`, `title`, `description`, `action` |
| `Notification` | Badge wrapper; `count`, `label`, `dot`, `variant`, `position`, `max` |
| `Snackbar` | Toast notification; `open`, `onClose`, `message`, `action` |
| `SystemBanner` | Full-width system alert; `status`, `title`, `message`, `onDismiss` |

### Overlay

| Component(s) | Notes |
|---|---|
| `Dialog` | Native `<dialog>`; `open`, `onClose`, `title`, `footer` |
| `Menu` / `MenuSection` / `MenuItem` | Dropdown menu; `open`, `onClose`, `aria-label` on Menu; `icon`, `href`, `variant`, `onClick` on MenuItem |

### Data and disclosure

| Component(s) | Notes |
|---|---|
| `DataTable` / `DataTableFilters` | Tabular data with sorting and filtering |
| `Calendar` | Date display; `variant="scroll\|paginated"`, `initialMonth`, `monthsToShow`, `highlightToday`, `dimPast` |
| `Accordion` | Disclosure component; `items` with `title` and `content` |

### Utility

| Component(s) | Notes |
|---|---|
| `LabelsProvider` / `useLabel` | i18n/brand label resolution; wrap at app root |

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
| `.a1-theme-heritage` | Warm neutral / editorial theme |
| `.a1-theme-accessible` | Larger sizes, filled icons |

Wrap any section in `<Inverse>` to render it in the inverted (dark) color context without changing the global theme.

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
- `Dialog` and `Menu` use the native `<dialog>` element; always provide `open` + `onClose`.
- `PageLayout` is the correct shell for full-page layouts — don't hand-roll header/sidebar/footer structure.
- `MessageBadge` uses `subtle` (a boolean prop), not `variant="subtle"`.
