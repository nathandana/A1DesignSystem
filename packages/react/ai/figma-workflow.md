# A1 Design System — Figma Component Workflow

This file governs all agent work that creates or updates components in the A1 Figma file. Read it before touching any Figma component, variable collection, or page.

**Figma file:** `U2VJz2CLoNwrZ0lxM8vkMv`

---

## Core rules

1. **No hardcoded colors.** Every fill and stroke must be bound to a variable from the Color collection. Raw hex, RGB, or opacity-only paints are not allowed.
2. **No hardcoded text styles.** Every text node must use a named text style (`textStyleId`). For labels or annotations that have no matching text style, bind font size and weight to values that trace back to token equivalents — never invent raw values.
3. **Component properties must match the React API 1:1.** Variant property names and values must mirror the exact prop names and valid values in the React component. If a React prop cannot be expressed in Figma, document the gap in the per-component table below.

---

## Variable collections

| Collection | Contains | Used for |
|------------|---------|---------|
| **Color** | Semantic + primitive color tokens | All fills, strokes, shadow colors |
| **Spacing** | `gap/*` and `radius/*` FLOAT tokens | Padding, item spacing, corner radius |
| **Primitives** | Raw `accent/*`, `neutral/*` color ramp + base radius | Accent color segments (e.g. breakpoint bar), radius scale |
| **Breakpoints** | `min`, `max`, `canvas` FLOAT tokens × 5 modes | Frame width binding for responsive previews |
| **Gap** | `value` FLOAT token × 6 modes (none/xs/sm/md/lg/xl) | Controls `itemSpacing` on auto-layout slot frames; apply mode to switch Section content gap |
| **ContentWidth** | `max` FLOAT token × 6 modes (xs/sm/md/lg/xl/2xl) | Controls `_content` inner frame width; apply mode to constrain Section content area |

---

## Color binding pattern

All fills and strokes use `setBoundVariableForPaint`. Never pass a raw color object as the final paint.

```javascript
// Correct — bound to a Color collection variable
function bf(name) {
  const v = CV[name]; // CV = { [name]: VariableNode } from getLocalVariablesAsync('COLOR')
  if (!v) return [];
  return [figma.variables.setBoundVariableForPaint(
    { type: 'SOLID', color: { r: 0, g: 0, b: 0 } },
    'color',
    v
  )];
}

node.fills = bf('surface/page');
node.strokes = bf('border/subtle');
```

A fallback raw color (e.g. for inverse borders where `bf()` returns an empty array) is acceptable only when:
- The variable name has been confirmed to exist but the fill must degrade gracefully, **or**
- The value is a design-system constant (pure white `{ r:1, g:1, b:1 }` for an inverse border)

Document any fallback that is not a strict variable binding.

---

## Text style binding pattern

```javascript
// Correct — binds named text style
const TS = {};
for (const s of await figma.getLocalTextStylesAsync()) TS[s.name] = s;

node.textStyleId = TS['Body/MD'].id;
node.fills = bf('text/default');
```

Available text style names follow the pattern `{Category}/{Size}`:
- Body: `Body/XS`, `Body/SM`, `Body/MD`, `Body/LG`, `Body/XL`
- Label: `Label/XS`, `Label/SM`, `Label/MD`, `Label/LG`
- Heading: `Heading/XS`, `Heading/SM`, `Heading/MD`, `Heading/LG`, `Heading/XL`, `Heading/XXL`
- Display: `Display/SM`, `Display/MD`, `Display/LG`, `Display/XL`, `Display/XXL`, `Display/Jumbo`, `Display/XJumbo`

When no text style applies (e.g. a one-off annotation label), use the closest existing style rather than hardcoding a size. If none fits, note it as a gap.

---

## Numeric variable binding pattern

```javascript
// Correct — bind padding/radius to FLOAT variables
function bv(node, prop, name) {
  const v = FV[name]; // FV = FLOAT variables
  if (v) node.setBoundVariable(prop, v);
}

node.paddingTop = 16; // set raw value first as fallback
bv(node, 'paddingTop', 'gap/md');       // then bind (overrides raw value when bound)

node.cornerRadius = 8;
bv(node, 'topLeftRadius', 'radius/lg'); // individual corners can each be bound
```

Available Spacing tokens:

| Name | Value |
|------|-------|
| `gap/xs` | 8px |
| `gap/sm` | 12px |
| `gap/md` | 16px |
| `gap/lg` | 24px |
| `gap/xl` | 40px |
| `radius/sm` | 4px |
| `radius/md` | 6px |
| `radius/lg` | 8px |

---

## Auto-layout rules

These constraints were established through trial and error — violating them causes broken layouts.

### FILL children in HORIZONTAL frames

Setting `layoutSizingHorizontal = 'FILL'` on a child AND `primaryAxisSizingMode = 'AUTO'` on a HORIZONTAL parent creates a circular dependency (parent tries to HUG children; children try to FILL parent). **Do not set `primaryAxisSizingMode` on a HORIZONTAL frame that also has `layoutSizingHorizontal = 'FILL'`.**

| Frame direction | `primaryAxisSizingMode = 'AUTO'` | `layoutSizingHorizontal = 'FILL'` on child | Safe? |
|-----------------|----------------------------------|--------------------------------------------|-------|
| HORIZONTAL | set | set | **NO — circular dependency** |
| VERTICAL | set | set | **YES — different axes** |
| HORIZONTAL | not set | set | **YES** |

### Append before sizing

Always `parent.appendChild(child)` **before** setting `child.layoutSizingHorizontal` or `child.layoutSizingVertical`. Setting these before appending is ignored.

### Valid `counterAxisAlignItems` values

`'MIN' | 'MAX' | 'CENTER' | 'BASELINE'` — `'STRETCH'` is not valid.

### Valid FLOAT variable scopes

`'WIDTH_HEIGHT'` (not `'WIDTH_AND_HEIGHT'`), `'CORNER_RADIUS'`, `'GAP'`, `'ALL_SCOPES'`, `'TEXT_CONTENT'`.

---

## Component property conventions

### Naming

- Variant property names use **Title Case**: `Surface`, `Inverse`, `Size`, `Variant`
- Variant values use the **exact string** the React prop accepts: `page`, `panel`, `raised`, `sm`, `md`, `lg`
- Component name format in Figma: `PropA=value, PropB=value` (comma-separated, matching the order they appear in the React prop list)

### Inverse and dark themes — use color modes, not variant properties

**Never add `inverse` (or any theme/color-mode switch) as a component variant property.** In Figma, inverse and dark-mode contexts are controlled by applying a **Color collection mode** to the container frame. This mirrors exactly how the CSS works (`<Section inverse>` applies `.a1-inverse`, which switches the CSS custom property values via a class selector).

**How to apply inverse in Figma:**
1. Select the frame or component instance you want to appear in the inverse (dark) context.
2. In the Design panel → **Variable modes**, choose the Color collection and switch to the **Inverse** (or **Dark**) mode.
3. All color variable bindings inside that frame automatically resolve to their inverse values.

**Why this matters:**
- A component with `Inverse=true/false` variants doubles the variant count and forces the designer to pick the right "flavor" of the component, rather than letting the surrounding context control the color.
- Color mode switching lets a designer drop a single Section instance onto an inverse-themed container and have it just work — no need to swap variants.
- This scales correctly: one component, any number of color contexts.

**Per-component rule:** No component should have an `Inverse` variant property. If a component currently has one, remove it and rely on the Color mode instead.

**Color collection modes needed:**
- `Default` — light theme (current)
- `Inverse` — dark/inverse context (values from `surface/inverse`, `text/inverse`, etc.)

---

## React → Figma mapping

| React prop type | Figma representation |
|-----------------|---------------------|
| `string` enum | Variant property with matching string values |
| `boolean` | Variant property with `true` / `false` values — **except `inverse`, which is a Color mode** |
| `ReactNode` (slot) | Placeholder frame named `_content` or `_slot` with a dashed border |
| `string` (text content) | Component property type TEXT, or a realistic sample text node |
| callback (`onClick`, `onChange`) | Not applicable — omit |
| `aria-*` | Not applicable — omit |
| `className` / `style` | Not applicable — omit |
| `ref` | Not applicable — omit |
| `as` | Not applicable — omit |
| responsive object `{ xs, sm, … }` | Show one canonical state (usually `md`); note the gap |

---

## Per-component property gaps

This table is the canonical record of props that exist in React but cannot be represented (or are not yet represented) in Figma. Update it as components are built.

### Button

**Component structure:** `Button` component set with variants for visual styling, size, interactive state, and icon placement. Component properties expose label text, icon visibility, and an icon instance swap.

**Figma default:** The component set is ordered so Figma asset search inserts `Variant=secondary, Size=md, State=default, IconPosition=start`. This intentionally differs from React's runtime defaults (`variant="primary"`, `size="md"`) so designers start with the standard secondary button in Figma while Code Connect still emits `variant="secondary"` for that instance.

**Color modes:** Button color variables are a single-mode component layer that alias into `color/button/*` variables in the shared Color collection. Do not add a Dark mode to the Button collection. Dark mode is controlled once by switching the Color collection mode on a containing frame or page, matching the React CSS custom-property contract.

**Typography:** Button labels use Button-specific Figma text styles that mirror React size modifiers: `Button/sm` = Inter Medium 14, `Button/md` = Inter Semi Bold 16, and `Button/lg` = Inter Bold 18. Do not bind Button labels to the generic body text styles; their font weights are intentionally different.

Variant properties:

| React prop | Figma representation | Valid values |
|------------|---------------------|--------------|
| `variant` | Variant `Variant` | `primary` \| `secondary` \| `tertiary` \| `destructive` \| `success` |
| `size` | Variant `Size` | `sm` \| `md` \| `lg` |
| `disabled`, `loading` | Variant `State` | `default` \| `hover` \| `focus` \| `pressed` \| `disabled` \| `loading` |
| `iconPosition` | Variant `IconPosition` | `start` \| `end` |

Component properties:

| React prop | Figma property | Type | Notes |
|------------|----------------|------|-------|
| `children` | `Label` | TEXT | Button label text |
| `icon` | `Show icon` + `Icon` | BOOLEAN + INSTANCE_SWAP | `Show icon` controls visibility; `Icon` swaps the visual icon instance |

Gaps — props that cannot currently be represented visually in Figma:

| React prop | Gap reason |
|------------|------------|
| `as`, `href`, `type` | Runtime semantic/navigation choices, not visual Figma states |
| `fullWidth` | Represented by resizing behavior on the instance, not a component variant |
| `onClick`, `className`, `style`, `ref`, `aria-*`, `id` | Runtime-only props |
| `hover`, `focus`, `pressed` visual states | Included as Figma states for inspection/prototyping; Code Connect emits no React prop for them |
| `loading` motion | Figma shows the spinner statically; React owns the indeterminate motion and `aria-busy` behavior |
| `icon` Code Connect mapping | The template emits `smart_button` when an icon is visible; icon instance names should stay aligned to the React icon registry for exact output |
| Figma asset default | Figma insert/search default is `secondary` + `md`; React's runtime default remains `primary` + `md` |

### Section

**Component structure:** `Section` > `Section Slot` (SLOT, FILL width) > `_content` (FRAME, FIXED width bound to ContentWidth).
Designers drop content inside `_content`. Switch variable collection modes on the Section instance or `_content` frame to change Gap and ContentWidth.

Variant properties (create distinct visual states in the component set):

| React prop | Figma representation | Valid values |
|------------|---------------------|--------------|
| `surface` | Variant `Surface` | `page` \| `panel` \| `raised` |
| `padding` | Variant `Padding` | `none \| xs \| sm \| md \| lg` |
| `inverse` | **Color mode on the frame** | Apply the Color collection's Inverse mode to the container — not a variant property. See [Inverse and dark themes](#inverse-and-dark-themes--use-color-modes-not-variant-properties). |

Mode-based properties (apply a variable collection mode on the frame — the value updates automatically):

| React prop | Variable collection | Variable | Modes | How to apply |
|------------|---------------------|---------|-------|--------------|
| `gap` | **Gap** | `value` (GAP scope) | `none(0)` \| `xs(8)` \| `sm(12)` \| `md(16)` \| `lg(24)` \| `xl(40)` | Select Section instance → Design panel → Variable modes → Gap → choose mode. The Section Slot's `itemSpacing` is bound to this variable. |
| `contentWidth` | **ContentWidth** | `max` (WIDTH_HEIGHT scope) | `xs(456)` \| `sm(640)` \| `md(800)` \| `lg(960)` \| `xl(1120)` \| `2xl(1440)` | Select Section instance → Design panel → Variable modes → ContentWidth → choose mode. The `_content` inner frame width is bound to this variable. Default mode is `lg` (960 px). |

TEXT component properties (documentation only — appear in Design panel but do not change the visual):

| React prop | Figma property | Default | Valid values |
|------------|---------------|---------|--------------|
| `gradient` | `Gradient` | `""` | `accent \| highlight \| info \| success \| warn` |
| `gradientPosition` | `GradientPosition` | `"center"` | `top \| top-right \| right \| bottom-right \| bottom \| bottom-left \| left \| top-left \| center` |
| `height` | `Height` | `""` | `screen \| hero` |
| `align` | `Align` | `""` | `left \| center \| right` — also accepts a responsive object |
| `borderSize` | `BorderSize` | `""` | `xs \| sm \| md \| lg` — required to activate border |
| `borderStyle` | `BorderStyle` | `"solid"` | `solid \| dashed \| dotted` |
| `borderVariant` | `BorderVariant` | `"subtle"` | `subtle \| strong \| accent` |
| `borderSides` | `BorderSides` | `"all"` | `"all"` or subset of `["top", "right", "bottom", "left"]` |
| `radius` | `Radius` | `""` | `none \| sm \| md \| lg \| xl` |
| `backgroundImage` | `BackgroundImage` | `""` | image URL (decorative background; suppresses `gradient`) |
| `backgroundFit` | `BackgroundFit` | `"cover"` | `cover \| contain \| tile` |
| `backgroundPosition` | `BackgroundPosition` | `"center"` | `center \| top \| bottom \| left \| right \| top-left \| top-right \| bottom-left \| bottom-right` |
| `backgroundOverlay` | `BackgroundOverlay` | `""` | `darken \| lighten` |
| `backgroundOverlayStrength` | `BackgroundOverlayStrength` | `"md"` | `sm \| md \| lg` |

Gaps — props that cannot currently be represented visually in Figma:

| React prop | Gap reason |
|------------|------------|
| `gradient` (visual) | Gradient requires a custom paint not yet in the Color collection — deferred |
| `height="screen"` | Full-viewport height cannot be expressed as a static Figma frame height |
| `border*` (visual) | Border appearance requires many more variants — deferred |
| `radius` (visual) | Corner radius requires more variants — deferred |
| `background*` (visual) | A designer can approximate with an IMAGE fill + a translucent overlay rectangle, but fit/tile/overlay-strength cannot be bound to tokens — documented as TEXT properties only |
| `responsive objects` | `padding={{ xs: 'sm', lg: 'lg' }}` and `align={{ xs: 'left', lg: 'center' }}` — Figma has no breakpoint-driven property switching |
| `className` / `style` / `ref` / `aria-*` / `id` | Not applicable in Figma |

---

## Pages in the Figma file

| Page name | Purpose |
|-----------|---------|
| Page 1 *(default)* | Working / scratch space |
| Typography | All 22 text styles with pangram examples and color swatches |
| Breakpoints | Proportional viewport scale bar + breakpoint detail cards |
| Components | Component set library — Section and future components |

---

## Variable collections summary

| Collection name | Type | Modes | Key variables |
|-----------------|------|-------|---------------|
| Color | COLOR | Light / Dark | All semantic color tokens (`surface/*`, `text/*`, `border/*`, `action/*`) + component-facing color aliases such as `color/button/*` |
| Spacing | FLOAT | Default | `gap/xs–xl`, `radius/sm–lg` |
| Primitives | mixed | Default | Base color ramp + primitive radius values |
| Button | mixed | Value | Button component variables. Color variables alias to Color collection roles (for example `button/secondary/background` → `color/button/secondary/background`); size/radius/spacing variables alias to primitive tokens. |
| Breakpoints | FLOAT | xs / sm / md / lg / xl | `min`, `max`, `canvas` — bind `canvas` to a frame's width then switch modes |
| Gap | FLOAT | none / xs / sm / md / lg / xl | `value` (GAP scope) — bind to an auto-layout frame's `itemSpacing`; switch modes to change gap |
| ContentWidth | FLOAT | xs / sm / md / lg / xl / 2xl | `max` (WIDTH_HEIGHT scope) — bind to a FIXED-width inner frame; switch modes to constrain content area |
