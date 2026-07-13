# A1 Design System — Figma Component Workflow

This file governs all agent work that creates or updates components in the A1 Figma file. Read it before touching any Figma component, variable collection, or page.

**Figma file:** `zFjqo3SwHbkXwtCOoQCVMA`

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
| **Components** | Shared component FLOAT tokens | Cross-component and component-specific dimensions such as Menu shell/item sizing and Dialog widths/footer borders |
| **Field** | Text Field exact FLOAT tokens | Field heights, padding, gaps, border widths, focus dimensions, accent widths, side-label widths |
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
- Field label: `Field/Label/SM`, `Field/Label/MD`, `Field/Label/LG`
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

### Text Field

**Component structure:** `Text Field` component set on the Text Field page (`node 148:1360`) with variants for size and visual state. Component properties expose the visible label, input value, hint text, error text, required badge text, and label/hint visibility toggles. Documentation/example frames live beside it (`node 148:1361`).

**Figma default:** The first/default variant is `Size=default, State=default`, matching React's runtime `size="default"` and showing the default label-above presentation.

**Color modes:** Text Field uses the shared Color collection for all fills and strokes, including field-facing Color aliases (`color/field/hover/*`, `color/field/readOnly/*`, `color/field/focusRing`, `color/field/focusBorder`) and status text (`color/status/error/text`) with Light/Dark values. Do not add a Text Field theme variant; dark mode is controlled by switching the Color collection mode on the frame/page.

**Validation board:** `Text Field React screenshot + Figma overlay` (`node 184:1334`) contains a1-web React screenshots for all 21 size/state combinations with live Figma Text Field instances overlaid. Use it before marking future Text Field visual-token edits complete.

**Typography:** Input values use the generic Body styles, with compact `Value`, `Hint`, and `Error` layers one step smaller (`body/xs`) to match the React compact field scale. Labels use `Field/Label/SM`, `Field/Label/MD`, and `Field/Label/LG` so compact/default/comfortable field labels match the React weights.

**Error border:** Error input strokes and the side accent both bind to `color/status/error/border`. Do not bind the side accent to `color/status/error/background`; React keeps the full error outline one colour.

Variant properties:

| React prop | Figma representation | Valid values |
|------------|---------------------|--------------|
| `size` | Variant `Size` | `comfortable` \| `default` \| `compact` |
| `required`, `error`, `readOnly`, `disabled` | Variant `State` | `default` \| `hover` \| `focus` \| `required` \| `error` \| `readOnly` \| `disabled` |

Component properties:

| React prop | Figma property | Type | Notes |
|------------|----------------|------|-------|
| `label` | `Label` | TEXT | Visible field label |
| `defaultValue` / `value` | `Value` | TEXT | Visual input value; Code Connect emits `defaultValue` |
| `hint` | `Hint` + `Show hint` | TEXT + BOOLEAN | Helper text in non-error states; `Show hint=false` hides the hint and Code Connect omits `hint` |
| `error` | `Error` | TEXT | Error text when `State=error` |
| `label` presence | `Show label` | BOOLEAN | Hides the visible label and Code Connect omits `label` |
| comfortable `required` marker | `Required label` | TEXT | The comfortable required state uses a small subtle info badge; default/compact use an asterisk |

Gaps — props that cannot currently be represented visually in Figma:

| React prop | Gap reason |
|------------|------------|
| `labelPosition` | React still supports `above` and `before`, but the Figma Text Field component currently represents the label-above pattern only. |
| `type` | Runtime/native input behavior. `text`, `email`, and `password` are documented in React/a1-web; the Figma component shows the shared text-field surface. |
| `autoComplete` | Browser/password-manager behavior, not visual |
| `inputOverlay` | Extension slot used by specialized fields; not part of the base Text Field Figma v1 |
| Independent boolean combinations | Figma uses aggregate `State` to avoid invalid combinations such as `disabled` + `error` + `readOnly`; Code Connect emits the matching React prop for the selected state |
| `hover`, `focus` visual states | Included as Figma states for inspection/prototyping; Code Connect emits no React prop for them |
| `onChange`, `onInput`, `onBeforeInput`, `className`, `style`, `ref`, `aria-*`, `id`, native input passthrough props | Runtime-only props |

### Menu

**Component structure:** `Menu` is a single shell component on the Menu page (`node 218:1177`) and `Menu Item` is a separate child component set (`node 218:1176`). Menu owns the panel surface, section label, and `_items` slot frame. Menu Item owns row content and state variants. Do not rebuild MenuItem internals inside Menu.

**Figma default:** Menu inserts as a standard open desktop menu shell with five Menu Item slot instances. Menu Item inserts as `State=default`.

**Color modes:** Menu uses the shared Color collection for all fills and strokes (`surface/panel`, `surface/page`, `border/subtle`, `text/*`, `action/*`, `status/error/*`, `button/focusRing`). Do not add a Menu theme variant; dark mode is controlled by switching the Color collection mode on a containing frame or page.

**Typography:** Menu Item labels use `Body/MD`, shortcuts use `Body/XS`, and Menu section labels use `Menu/Section label` (Inter Semi Bold 12) to match the React `body-xs` semibold menu chrome.

Variant properties:

| Component | React prop / state | Figma representation | Valid values |
|-----------|--------------------|---------------------|--------------|
| Menu Item | `active`, `disabled`, `variant="destructive"` and visual inspection states | Variant `State` | `default` \| `hover` \| `focus` \| `pressed` \| `active` \| `disabled` \| `destructive` |

Component properties:

Menu:

| React prop | Figma property | Type | Notes |
|------------|----------------|------|-------|
| `Menu["aria-label"]` | `Aria label` | TEXT | Code Connect emits `aria-label` on `<Menu>` |
| `MenuSection label` | `Section label` + `Show section label` | TEXT + BOOLEAN | Controls the section label above the `_items` slot frame |
| slotted child rows | `Item slot 1–5` + `Show item slot 1–5` | INSTANCE_SWAP + BOOLEAN | Slots should contain Menu Item instances; swap/hide rows rather than duplicating item internals |

Menu Item:

| React prop | Figma property | Type | Notes |
|------------|----------------|------|-------|
| `MenuItem children` | `Label` | TEXT | Visual item label and Code Connect children |
| `MenuItem icon` | `Icon` + `Show icon` | INSTANCE_SWAP + BOOLEAN | Nested icon vectors must be rebound to the state-specific foreground variable after swaps |
| `MenuItem shortcut` | `Shortcut` + `Show shortcut` | TEXT + BOOLEAN | Omits `shortcut` when the toggle is off |

Gaps — props and behaviors that cannot currently be represented visually in Figma:

| React prop / behavior | Gap reason |
|-----------------------|------------|
| `open`, `onClose`, `anchorRef`, viewport positioning | Runtime dialog positioning and state management |
| `trapFocus`, `modalOnMobile`, Escape/outside-click dismissal | Runtime accessibility behavior; Figma shows the open surface only |
| `children` as arbitrary composition | Figma v1 uses five documented Menu Item slots; arbitrary row count is represented by duplicating/replacing Menu Item instances in the `_items` slot frame |
| `href`, `onClick`, `className`, `style`, `ref`, additional `aria-*` | Runtime-only props |
| Icon exact Code Connect output | Figma icon instance swaps are visual; the repo template emits `more_vert` by default and `delete` for destructive until icon instance names can be read reliably |
| `hover`, `focus`, `pressed` | Included as Figma visual states for inspection/prototyping; Code Connect emits no React prop for them |

### Dialog

**Component structure:** `Dialog` component set on the Dialog page (`node 228:1628`) with variants for size and status. `Dialog Hero Icon` is a separate child component set (`node 228:1013`) used by status hero variants. The Dialog body and footer are named `_body` and `_footer` slot frames so richer content can replace the placeholder text/buttons without rebuilding the shell.

**Figma default:** The first/default variant is `Size=md, Status=none`, matching React's runtime `size="md"` and no-status presentation.

**Color modes:** Dialog uses the shared Color collection for panel surface, borders, page backdrop, status hero fills, inverse hero icons, and focus/close icon colour. Do not add a Dialog theme variant; dark mode is controlled by switching the Color collection mode on a containing frame or page.

**Layout:** The component set uses grid auto layout because Dialog has multiple variants. Individual dialog variants and their internal sections use auto layout only; variants must not be absolutely positioned. Use `_body` and `_footer` as composition slots rather than duplicating arbitrary child layers across variants.

Variant properties:

| React prop | Figma representation | Valid values |
|------------|---------------------|--------------|
| `size` | Variant `Size` | `sm` \| `md` \| `lg` \| `xl` |
| `status` | Variant `Status` | `none` \| `success` \| `error` \| `warn` \| `info` \| `neutral` |

Component properties:

| React prop | Figma property | Type | Notes |
|------------|----------------|------|-------|
| `title` | `Title` | TEXT | Header title text |
| `children` | `Body` + `_body` | TEXT + slot frame | `Body` covers the default simple text case; replace `_body` contents for forms, tabs, or composed content |
| `footer` | `Show footer` + `_footer` | BOOLEAN + slot frame | Shows/hides the footer area; replace `_footer` contents with Button instances for specific actions |
| `onClose` presence | `Show close` | BOOLEAN | Shows/hides the close icon affordance; Code Connect emits a placeholder `onClose` when visible |

Gaps — props and behaviors that cannot currently be represented visually in Figma:

| React prop / behavior | Gap reason |
|-----------------------|------------|
| `open` | Figma represents the visible/open dialog only; state management is runtime-owned |
| `onClose` callback semantics, Escape, backdrop click, focus trap, focus restore | Native-dialog runtime behavior; Figma only shows the resulting affordance |
| `icon` | React can override the status hero icon; Figma v1 uses the default icon tied to `Status` through `Dialog Hero Icon` |
| `children` / `footer` as arbitrary React nodes | Represented by named slot frames, not by a complete React AST |
| `className`, `style`, `ref`, `aria-*`, `id`, native dialog attributes | Runtime-only props |

### Radio Group

**Component structure:** `Radio Group` is a component set on the Radio Group page (`node 258:1456`). It contains three realistic options so designers can edit the label, group hint/error, and option labels/hints without rebuilding the field. The Professional option is the representative selected option.

**Figma default:** The first/default variant is `Size=default, State=default`, matching React's default density. Its representative selection maps to `defaultValue="professional"` in Code Connect.

**Color modes:** Radio Group binds its text, field, hover, focus, selected, error, disabled, and border roles to the shared Color collection. Do not add a dark/inverse variant. Apply the Color collection's Dark mode to a containing frame or page; the `Radio Group / Dark mode validation` frame on the component page demonstrates this.

Variant properties:

| React prop | Figma representation | Valid values |
|------------|---------------------|--------------|
| `size` | Variant `Size` | `comfortable` \| `default` \| `compact` |
| `required`, `error`, `disabled` | Variant `State` | `default` \| `hover` \| `focus` \| `required` \| `error` \| `disabled` |

Component properties:

| React prop | Figma property | Type | Notes |
|------------|----------------|------|-------|
| `label` | `Label` + `Show label` | TEXT + BOOLEAN | The visible group legend |
| `hint` | `Hint` + `Show hint` | TEXT + BOOLEAN | Hidden by the `error` state, matching React |
| `error` | `Error` | TEXT | Visible in `State=error` |
| `options` | `Option 1–3 label` and `Option 1–3 hint` + `Show option hints` | TEXT + BOOLEAN | The fixed three-option editing model |

Gaps — props and behaviors that cannot currently be represented visually in Figma:

| React prop / behavior | Gap reason |
|-----------------------|------------|
| `options` length, option `value`, option-level `disabled` | Figma v1 provides a fixed, representative three-option editing model; duplicate or remove rows when composing a specific screen |
| `inline` | Runtime responsive layout choice; designers can arrange instances horizontally in a parent layout |
| `value`, `defaultValue`, `onChange`, `name` | Native radio-group selection and form behavior are runtime-owned; the component shows Professional as the representative selection |
| `id`, `className`, `ref`, `aria-*` | Runtime-only semantics and integration details |
| `hover`, `focus` | Included as Figma visual states for inspection; Code Connect emits no React prop |

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
| Button | Button component set and related documentation |
| Text Field | Text Field component set and related documentation |
| Dialog | Dialog component set and related documentation |
| Menu | Menu component set and related documentation |
| Radio Group | Radio Group component set, examples, and dark-mode validation |
| Icons | Material Symbols icon component sets used by component properties |

---

## Figma to JSON plugin (proof of concept)

`packages/figma/plugins/a1-json/` (A1-1651) is a development plugin that bridges A1
Figma components and the A1 page-definition JSON format in both directions:
exporting a selected instance as a page-definition `ComponentNode` (automatic —
the JSON follows the selection and its configuration changes) and rendering
pasted page-definition JSON back onto the canvas as component instances. Button
and Section so far; exporters/importers are keyed by component-set name, and the
per-component gap tables above define which props are runtime-only (warned,
never emitted/applied). Section is split across components on the Figma side —
the Section set plus internal parts such as **Section Content**, which carries
the content-width/padding properties — so the plugin scans the instance and its
internal part instances for properties by canonicalised name (case/spacing
insensitive) and merges them into the single React props, with the
ContentWidth/Gap collection modes as fallbacks; `inverse` maps to the explicit
Inverse/Dark Color mode, and registered descendants (Buttons) export as
`children`. **Update selection** applies pasted JSON to the currently selected
instance in place (properties only, not children). The same node JSON
round-trips with the a1-web configurator's editable **JSON** format view
(Button and Section pages), and the plugin's **Open in a1-web** link hands the
node straight to the configurator via a `?json=` query parameter (localhost dev
server for now). See the plugin README for install and usage.

---

## Variable collections summary

| Collection name | Type | Modes | Key variables |
|-----------------|------|-------|---------------|
| Color | COLOR | Light / Dark | All semantic color tokens (`surface/*`, `text/*`, `border/*`, `action/*`) + component-facing color aliases such as `color/button/*` |
| Spacing | FLOAT | Default | `gap/xs–xl`, `radius/sm–lg` |
| Primitives | mixed | Default | Base color ramp + primitive radius values |
| Components | mixed | Value | Shared component variables including Menu shell/item dimensions, Dialog width/padding/radius/footer-border dimensions, and scoped `radioGroup/*` geometry variables. |
| Button | mixed | Value | Button component variables. Color variables alias to Color collection roles (for example `button/secondary/background` → `color/button/secondary/background`); size/radius/spacing variables alias to primitive tokens. |
| Field | FLOAT | Value | Text Field component variables for exact React heights, padding, gaps, border widths, focus dimensions, accent widths, and side-label widths. Field-specific interaction colours live in the shared Color collection as `color/field/*` aliases so light/dark mode is switched once through Color. |
| Breakpoints | FLOAT | xs / sm / md / lg / xl | `min`, `max`, `canvas` — bind `canvas` to a frame's width then switch modes |
| Gap | FLOAT | none / xs / sm / md / lg / xl | `value` (GAP scope) — bind to an auto-layout frame's `itemSpacing`; switch modes to change gap |
| ContentWidth | FLOAT | xs / sm / md / lg / xl / 2xl | `max` (WIDTH_HEIGHT scope) — bind to a FIXED-width inner frame; switch modes to constrain content area |
