# A1 Design System — Figma Component Workflow

This file governs all agent work that creates or updates components in the A1 Figma file. Read it before touching any Figma component, variable collection, or page.

**Figma file:** `zFjqo3SwHbkXwtCOoQCVMA`

---

## Core rules

1. **No hardcoded colors.** Every fill and stroke must be bound to a variable from the Color collection. Raw hex, RGB, or opacity-only paints are not allowed.
2. **No hardcoded text styles.** Every text node must use a named text style (`textStyleId`). For labels or annotations that have no matching text style, bind font size and weight to values that trace back to token equivalents — never invent raw values.
3. **Component properties must match the React API 1:1.** Variant property names and values must mirror the exact prop names and valid values in the React component. If a React prop cannot be expressed in Figma, document the gap in the per-component table below.

---

## Component history (A1-2067)

Each component has a **change history** — code changes, design/contract decisions, and release/version notes. It is authored once in a single, platform-agnostic source and surfaced in both the web app and Figma:

- **Source of truth:** `apps/a1-web/src/pages/components/data.js` → `COMPONENT_HISTORY[<component-id>]`, an array of typed entries (`type: 'code' | 'decision' | 'release'`, plus `date`, `summary`, and optional `version` / `ticket`). Seed it from the dated `packages/react/ai/components-maintenance.md` log and the package CHANGELOGs — the same records the Figma per-component notes are written from.
- **Web app surface:** the component detail page's **History** tab (see `ComponentDetailPage.jsx` → `HistoryPanel`) renders these entries newest-first, with a link to the full per-package Releases page.
- **Figma surface:** the per-component sections in this file (and the matching Figma page notes) already carry each component's Figma history in prose — e.g. "A1-419 created the Figma Button…", "A1-1418 created the Dialog set…". When you add or change a Figma component, add the same change to `COMPONENT_HISTORY` (as a `code` entry with its `A1-nnnn` ticket) so the web History tab and the Figma notes stay in sync. An **embedded, interactive history panel inside the Figma file** is a documented follow-up; the data is already structured and portable for it.

---

## Variable collections

| Collection       | Contains                                             | Used for                                                                                                          |
| ---------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Color**        | Semantic + primitive color tokens                    | All fills, strokes, shadow colors                                                                                 |
| **Spacing**      | `gap/*` and `radius/*` FLOAT tokens                  | Padding, item spacing, corner radius                                                                              |
| **Primitives**   | Raw `accent/*`, `neutral/*` color ramp + base radius | Accent color segments (e.g. breakpoint bar), radius scale                                                         |
| **Components**   | Shared component FLOAT tokens                        | Cross-component and component-specific dimensions such as Menu shell/item sizing and Dialog widths/footer borders |
| **Field**        | Text Field exact FLOAT tokens                        | Field heights, padding, gaps, border widths, focus dimensions, accent widths, side-label widths                   |
| **Breakpoint**   | `page/width/{min,max,default}`, `section/padding/{xs,sm,md,lg}/{block,inline}` FLOAT + `deviceMode` STRING × 5 modes (`xs` 375 / `sm` 640 / `md` 768 / `lg` 1280 / `xl` 1512 default widths; min/max per `system/tokens/breakpoint.json`, sm = 481–640) | Bind a variant's width to `page/width/default` and set the collection mode explicitly per variant — Top Header and Page Layout breakpoint variants resolve their width, paddings, and `deviceMode` label from the mode. (The `sm` mode is appended after `xl` — Figma has no mode-reorder API) |
| **Gap**          | `value` FLOAT token × 6 modes (none/xs/sm/md/lg/xl)  | Controls `itemSpacing` on auto-layout slot frames; apply mode to switch Section content gap                       |
| **ContentWidth** | `max` FLOAT token × 6 modes (xs/sm/md/lg/xl/2xl)     | Controls the nested `Section Content` instance width; apply mode to constrain Section content area                |

---

## Color binding pattern

All fills and strokes use `setBoundVariableForPaint`. Never pass a raw color object as the final paint.

```javascript
// Correct — bound to a Color collection variable
function bf(name) {
  const v = CV[name]; // CV = { [name]: VariableNode } from getLocalVariablesAsync('COLOR')
  if (!v) return [];
  return [
    figma.variables.setBoundVariableForPaint(
      { type: "SOLID", color: { r: 0, g: 0, b: 0 } },
      "color",
      v,
    ),
  ];
}

node.fills = bf("surface/page");
node.strokes = bf("border/subtle");
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

node.textStyleId = TS["Body/MD"].id;
node.fills = bf("text/default");
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
bv(node, "paddingTop", "gap/md"); // then bind (overrides raw value when bound)

node.cornerRadius = 8;
bv(node, "topLeftRadius", "radius/lg"); // individual corners can each be bound
```

Available Spacing tokens:

| Name        | Value |
| ----------- | ----- |
| `gap/none`  | 0px   |
| `gap/xs`    | 8px   |
| `gap/sm`    | 12px  |
| `gap/md`    | 16px  |
| `gap/lg`    | 24px  |
| `gap/xl`    | 40px  |
| `gap/{n}`   | A1 numeric Stack spacing values (`1`, `2`, `4`, `6`, `20`, `32`, `64`, `96`, `128`) created by the A1:Figma plugin when it needs to bind a numeric-only Stack/Grid gap |
| `radius/sm` | 4px   |
| `radius/md` | 6px   |
| `radius/lg` | 8px   |

---

## Auto-layout rules

These constraints were established through trial and error — violating them causes broken layouts.

### FILL children in HORIZONTAL frames

Setting `layoutSizingHorizontal = 'FILL'` on a child AND `primaryAxisSizingMode = 'AUTO'` on a HORIZONTAL parent creates a circular dependency (parent tries to HUG children; children try to FILL parent). **Do not set `primaryAxisSizingMode` on a HORIZONTAL frame that also has `layoutSizingHorizontal = 'FILL'`.**

| Frame direction | `primaryAxisSizingMode = 'AUTO'` | `layoutSizingHorizontal = 'FILL'` on child | Safe?                        |
| --------------- | -------------------------------- | ------------------------------------------ | ---------------------------- |
| HORIZONTAL      | set                              | set                                        | **NO — circular dependency** |
| VERTICAL        | set                              | set                                        | **YES — different axes**     |
| HORIZONTAL      | not set                          | set                                        | **YES**                      |

### Append before sizing

Always `parent.appendChild(child)` **before** setting `child.layoutSizingHorizontal` or `child.layoutSizingVertical`. Setting these before appending is ignored.

### Valid `counterAxisAlignItems` values

`'MIN' | 'MAX' | 'CENTER' | 'BASELINE'` — `'STRETCH'` is not valid.

### Valid FLOAT variable scopes

`'WIDTH_HEIGHT'` (not `'WIDTH_AND_HEIGHT'`), `'CORNER_RADIUS'`, `'GAP'`, `'ALL_SCOPES'`, `'TEXT_CONTENT'`.

---

## Sizing convention — fill vs hug

Every A1 component has a declared sizing class that governs how its instances behave inside an auto-layout (or Grid) parent. Figma cannot make an instance default to Fill on insert, so this contract is enforced in two places: **designers set Fill container after placing a fill-class instance**, and **the A1:Figma JSON plugin applies it automatically** when importing, rendering, or reconciling nodes (`FILL_CONTAINER_TYPES` / `HUG_CONTENT_TYPES` in `packages/figma/plugins/a1-json/code.js`).

### Fill container (inline axis)

These always stretch to the available width (vertical parent → Fill; horizontal parent → grow; Grid → Fill the cell):

| Component | Notes |
| --------- | ----- |
| Text Field, Search Field, Select, Textarea | Field family fills the form column |
| Radio Group, Checkbox Group | Group row width; options lay out inside |
| Accordion | Trigger + content slot span the column |
| Banner, Card, Blockquote | Block-level surfaces |
| Button Container | Fills the width; its `align` places the buttons inside |
| Figure | Fills up to its `size` max-width cap |
| Stack, Grid, Heading, Paragraph | Block-level layout/text (already enforced by the bridge) |
| Top Header | Full-width app bar (Breakpoint variants are preview widths, not a size contract) |
| Section | The page-level container — full-bleed by design |
| Page Layout | The outermost app shell — fills whatever hosts it |
| Empty State | Fills the available width and centers its content |
| List, Bottom Drawer, Page Nav, Tree Menu | Block-level; pre-classified ahead of bridge support |
| Data Table | Block-level data surface — fills the content column |
| Chip Group | The chip row wraps within the available width (individual Chips hug) |
| Choice Group | The tile row wraps and tiles share the available width |
| Tabs | The strip fills; individual Tab items hug |
| **Code** | **Variant-dependent:** `block` fills the column; `inline` hugs as a text chip |
| **Divider** | **Axis-dependent:** horizontal fills the available width; vertical stretches to the row height (natural height in a vertical stack) |

### Hug contents

These keep their natural content size — never stretch them:

| Component | Notes |
| --------- | ----- |
| Button, Icon Button, Link | Icon Button is always a fixed square (rule `icon-button-natural-width`) |
| Badge, Switch | Inline controls |
| Pagination, Segmented Control | Content-sized control strips |
| Menu | Panel sizes to its widest item |
| Definition List | Sizes to its content |
| Dialog | Fixed width per its `Size` variant |
| Tooltip | Sizes to its message |
| Inline, Breadcrumb, Split Button | Inline/content-sized; pre-classified ahead of bridge support |
| Side Nav | Fixed rail widths (280px expanded / 52px collapsed) — treat as hug, never stretch |

**Rule:** every new component must declare its sizing class in this section, and the plugin's `FILL_CONTAINER_TYPES` / `HUG_CONTENT_TYPES` sets must stay synchronized with these tables.

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

| React prop type                   | Figma representation                                                                        |
| --------------------------------- | ------------------------------------------------------------------------------------------- |
| `string` enum                     | Variant property with matching string values                                                |
| `boolean`                         | Variant property with `true` / `false` values — **except `inverse`, which is a Color mode** |
| `ReactNode` (slot)                | Placeholder frame named `_content` or `_slot` with a dashed border                          |
| `string` (text content)           | Component property type TEXT, or a realistic sample text node                               |
| callback (`onClick`, `onChange`)  | Not applicable — omit                                                                       |
| `aria-*`                          | Not applicable — omit                                                                       |
| `className` / `style`             | Not applicable — omit                                                                       |
| `ref`                             | Not applicable — omit                                                                       |
| `as`                              | Not applicable — omit                                                                       |
| responsive object `{ xs, sm, … }` | Show one canonical state (usually `md`); note the gap                                       |

---

## Per-component property gaps

This table is the canonical record of props that exist in React but cannot be represented (or are not yet represented) in Figma. Update it as components are built.

### Button

**Component structure:** `Button` component set with variants for visual styling, size, interactive state, and icon placement. Component properties expose label text, icon visibility, and an icon instance swap.

**Figma default:** The component set is ordered so Figma asset search inserts `Variant=secondary, Size=md, State=default, IconPosition=start`. This intentionally differs from React's runtime defaults (`variant="primary"`, `size="md"`) so designers start with the standard secondary button in Figma while Code Connect still emits `variant="secondary"` for that instance.

**Color modes:** Button color variables are a single-mode component layer that alias into `color/button/*` variables in the shared Color collection. Do not add a Dark mode to the Button collection. Dark mode is controlled once by switching the Color collection mode on a containing frame or page, matching the React CSS custom-property contract.

**Typography:** Button labels use Button-specific Figma text styles that mirror React size modifiers: `Button/sm` = Inter Medium 14, `Button/md` = Inter Semi Bold 16, and `Button/lg` = Inter Bold 18. Do not bind Button labels to the generic body text styles; their font weights are intentionally different.

Variant properties:

| React prop            | Figma representation   | Valid values                                                            |
| --------------------- | ---------------------- | ----------------------------------------------------------------------- |
| `variant`             | Variant `Variant`      | `primary` \| `secondary` \| `tertiary` \| `destructive` \| `success`    |
| `size`                | Variant `Size`         | `sm` \| `md` \| `lg`                                                    |
| `disabled`, `loading` | Variant `State`        | `default` \| `hover` \| `focus` \| `pressed` \| `disabled` \| `loading` |
| `iconPosition`        | Variant `IconPosition` | `start` \| `end`                                                        |

Component properties:

| React prop | Figma property       | Type                    | Notes                                                                  |
| ---------- | -------------------- | ----------------------- | ---------------------------------------------------------------------- |
| `children` | `Label`              | TEXT                    | Button label text                                                      |
| `icon`     | `Show icon` + `Icon` | BOOLEAN + INSTANCE_SWAP | `Show icon` controls visibility; `Icon` swaps the visual icon instance |

Gaps — props that cannot currently be represented visually in Figma:

| React prop                                             | Gap reason                                                                                                                                     |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `as`, `href`, `type`                                   | Runtime semantic/navigation choices, not visual Figma states                                                                                   |
| `fullWidth`                                            | Represented by resizing behavior on the instance, not a component variant                                                                      |
| `onClick`, `className`, `style`, `ref`, `aria-*`, `id` | Runtime-only props                                                                                                                             |
| `hover`, `focus`, `pressed` visual states              | Included as Figma states for inspection/prototyping; Code Connect emits no React prop for them                                                 |
| `loading` motion                                       | Figma shows the spinner statically; React owns the indeterminate motion and `aria-busy` behavior                                               |
| `icon` Code Connect mapping                            | The template emits `smart_button` when an icon is visible; icon instance names should stay aligned to the React icon registry for exact output |
| Figma asset default                                    | Figma insert/search default is `secondary` + `md`; React's runtime default remains `primary` + `md`                                            |

### Button Container

**Component structure:** `Button Container` component set on the Button Container page (`node 348:1649`) with an `Align` variant and a named `Button Slot` frame containing real A1 Button instances. Documentation includes narrow and wide examples because the React component changes flow through a container query.

Variant properties:

| React prop | Figma representation | Valid values                 |
| ---------- | -------------------- | ---------------------------- |
| `align`    | Variant `Align`      | `start` \| `center` \| `end` |

Content:

| React prop | Figma representation | Notes                                                                             |
| ---------- | -------------------- | --------------------------------------------------------------------------------- |
| `children` | `Button Slot`        | Ordered A1 Button instances; the JSON plugin exports their complete Button nodes. |

Gaps — props and behavior that cannot currently be represented visually in Figma:

| React prop / behavior                      | Gap reason                                                                                                                                                                                          |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Responsive stacked-to-row flow             | React uses a 480px container query; Figma documents narrow and wide states but cannot switch automatically by container width.                                                                      |
| `size`                                     | Child Button sizing remains a child concern; it is intentionally not a Button Container Figma control.                                                                                              |
| `fillButtons`                              | Runtime layout behavior has no v1 Figma representation.                                                                                                                                             |
| `className`, events, `ref`, `aria-*`, `id` | Runtime-only props.                                                                                                                                                                                 |
| Arbitrary child editing in an instance     | Figma component instances cannot accept arbitrary child layers. The JSON plugin detaches only when importing custom Button children; selected-instance updates reconcile matching existing Buttons. |

### Link

**Component structure:** `Link` component set on the Link page (`node 487:1143`) with `Size`, `Weight`, and `Icon position` variants. `Label`, `Show icon`, and `Icon` are editable component properties; `Icon` is a Material icon instance swap. Every label uses a named `Link/{size}/{weight}` text style derived from the matching A1 `body/{size}` style, and applies a solid underline with the React token's 0.2em offset. The icon remains undecorated. `link/color`, `link/colorHover`, and `link/colorPressed` alias the semantic `color/link/default`, `color/link/hover`, and `color/link/pressed` variables, respectively: Light maps to `info/500` / `600` / `700`, while Dark maps to `info/100` / `50` / `200`.

| React prop     | Figma representation    | Valid values                                 |
| -------------- | ----------------------- | -------------------------------------------- |
| `size`         | Variant `Size`          | `xs` \| `sm` \| `md` \| `lg` \| `xl`         |
| `weight`       | Variant `Weight`        | `normal` \| `medium` \| `semibold` \| `bold` |
| `iconPosition` | Variant `Icon position` | `start` \| `end`                             |
| `children`     | `Label`                 | TEXT                                         |
| `icon`         | `Show icon` + `Icon`    | BOOLEAN + INSTANCE_SWAP                      |

**JSON bridge:** imports, exports, and updates Link instances with `size`, `weight`, editable label, icon visibility/swap, and icon position. A blue or blue-violet underlined standalone Figma text layer is offered as a Link candidate; **AutoFix** applies the nearest `Link/{size}/{weight}` style, visible underline, and `link/color` variable before it exports as `Link` JSON. Any underlined range within a Heading or Paragraph stays inline and round-trips as `content.inlineLinks` ranges, preserving the surrounding typography. `href`, `target`, `rel`, anchor semantics, hover/pressed/focus states, inverse context, and event handlers remain runtime-owned and are reported as Figma representation limits.

### Icon Button

**Component structure:** `Icon Button` component set on the Icon Button page (`node 489:1014`) with `Variant` and `Size` variants. `Aria label` and `Icon` are editable component properties; the icon property swaps a Material icon instance.

**Token bindings:** secondary and tertiary reuse the matching Button token triplets for the root fill, border, and Material glyph (`button/{variant}/background`, `/border`, and `/foreground`) in every size. Success and destructive use the dedicated status-semantic Icon Button aliases (`iconButton/{status}/background`, `/border`, and `/foreground`) so their light treatments remain outlined while dark mode resolves through the status palette.

| React prop | Figma representation | Valid values                                            |
| ---------- | -------------------- | ------------------------------------------------------- |
| `variant`  | Variant `Variant`    | `tertiary` \| `secondary` \| `destructive` \| `success` |
| `size`     | Variant `Size`       | `sm` \| `md` \| `lg`                                    |
| `label`    | `Aria label`         | TEXT                                                    |
| `icon`     | `Icon`               | INSTANCE_SWAP                                           |

**JSON bridge:** imports, exports, and updates `IconButton` instances with `variant`, `size`, required Material `icon`, and `label` through the Figma `Aria label` property. If the nested Material icon cannot be resolved from a selected library copy, export retains the asset’s visible `star` default with a warning so the JSON remains valid. Disabled and interaction states, `as`, `href`, click behavior, and native ARIA semantics are runtime-owned and report a warning rather than becoming static Figma behavior. Always set an accessible label.

### Select

**Component structure:** `Select` component set on the Select page (`node 490:1062`) with `Size` and aggregate visual `State` variants. Its editable content properties are `Label`, `Value`, and `Hint`/`Error message`; `Show value` controls whether the Value layer is visible.

| React prop          | Figma representation     | Valid values                                  |
| ------------------- | ------------------------ | --------------------------------------------- |
| `size`              | Variant `Size`           | `comfortable` \| `default` \| `compact`       |
| `error`, `disabled` | Variant `State`          | `default` \| `error` \| `disabled`           |
| `label`             | `Label`                  | TEXT                                          |
| `showValue`         | `Show value`             | BOOLEAN                                       |
| `defaultValue`      | `Value`                  | TEXT when `showValue=true`                    |
| `hint` / `error`    | `Hint` / `Error message` | TEXT                                          |

**JSON bridge:** imports, exports, and updates `SelectField` nodes with size, label, hint/error copy, disabled state, and a visible-value preview. When the Figma `Show value` property is on, export emits `showValue: true` plus `defaultValue`; import only reveals `defaultValue` when that boolean is true. The a1-web JSON renderer supplies a matching preview option so the native Select visibly shows it. Figma does not model a native option list or selected-value data, so authored `options`, controlled values, `labelPosition="before"`, required state, browser validation, events, and native ARIA behavior remain runtime-owned.

**Select Menu composition:** `Select Menu` (`node 533:1058`) is a reusable open-state composition on the Select page. It reuses the token-bound Menu shell and four Menu Item instances, including one `State=active` selection and one disabled option. Use it adjacent to a Select in Figma when an open menu must be shown. It is not a second React component or an exported JSON node: the native `SelectField` remains the source of interaction and option data.

### Divider

**Component structure:** `Divider` component set on the Divider page (`node 491:1126`) with orientation, semantic tone, line-style, and thickness variants. Divider thickness aliases in the Components collection map directly to the source `component.divider.size*` tokens.

| React prop    | Figma representation  | Valid values                     |
| ------------- | --------------------- | -------------------------------- |
| `orientation` | Variant `Orientation` | `horizontal` \| `vertical`       |
| `variant`     | Variant `Variant`     | `subtle` \| `strong` \| `accent` |
| `lineStyle`   | Variant `Line style`  | `solid` \| `dashed` \| `dotted`  |
| `size`        | Variant `Size`        | `xs` \| `sm` \| `md` \| `lg`     |

**JSON bridge:** imports, exports, and updates static `Divider` orientation, variant, line style, and size. A responsive orientation object uses horizontal with a warning; surrounding `space`, `decorative`, and semantic `<hr>` behavior remain runtime-owned.

### Text Field

**Component structure:** `Text Field` component set on the Text Field page (`node 148:1360`) with variants for size and visual state. Component properties expose the visible label, input value, hint text, error text, required badge text, and label/hint visibility toggles. Documentation/example frames live beside it (`node 148:1361`).

**Figma default:** The first/default variant is `Size=default, State=default`, matching React's runtime `size="default"` and showing the default label-above presentation.

**Color modes:** Text Field uses the shared Color collection for all fills and strokes, including field-facing Color aliases (`color/field/hover/*`, `color/field/readOnly/*`, `color/field/focusRing`, `color/field/focusBorder`) and status text (`color/status/error/text`) with Light/Dark values. Do not add a Text Field theme variant; dark mode is controlled by switching the Color collection mode on the frame/page.

**Validation board:** `Text Field React screenshot + Figma overlay` (`node 184:1334`) contains a1-web React screenshots for all 21 size/state combinations with live Figma Text Field instances overlaid. Use it before marking future Text Field visual-token edits complete.

**Typography:** Input values use the generic Body styles, with compact `Value`, `Hint`, and `Error` layers one step smaller (`body/xs`) to match the React compact field scale. Labels use `Field/Label/SM`, `Field/Label/MD`, and `Field/Label/LG` so compact/default/comfortable field labels match the React weights.

**Error border:** Error input strokes and the side accent both bind to `color/status/error/border`. Do not bind the side accent to `color/status/error/background`; React keeps the full error outline one colour.

Variant properties:

| React prop                                  | Figma representation | Valid values                                                                         |
| ------------------------------------------- | -------------------- | ------------------------------------------------------------------------------------ |
| `size`                                      | Variant `Size`       | `comfortable` \| `default` \| `compact`                                              |
| `required`, `error`, `readOnly`, `disabled` | Variant `State`      | `default` \| `hover` \| `focus` \| `required` \| `error` \| `readOnly` \| `disabled` |

Component properties:

| React prop                    | Figma property       | Type           | Notes                                                                                           |
| ----------------------------- | -------------------- | -------------- | ----------------------------------------------------------------------------------------------- |
| `label`                       | `Label`              | TEXT           | Visible field label                                                                             |
| `defaultValue` / `value`      | `Value`              | TEXT           | Visual input value; Code Connect emits `defaultValue`                                           |
| `hint`                        | `Hint` + `Show hint` | TEXT + BOOLEAN | Helper text in non-error states; `Show hint=false` hides the hint and Code Connect omits `hint` |
| `error`                       | `Error`              | TEXT           | Error text when `State=error`                                                                   |
| `label` presence              | `Show label`         | BOOLEAN        | Hides the visible label and Code Connect omits `label`                                          |
| comfortable `required` marker | `Required label`     | TEXT           | The comfortable required state uses a small subtle info badge; default/compact use an asterisk  |

Gaps — props that cannot currently be represented visually in Figma:

| React prop                                                                                                          | Gap reason                                                                                                                                                              |
| ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `labelPosition`                                                                                                     | React still supports `above` and `before`, but the Figma Text Field component currently represents the label-above pattern only.                                        |
| `type`                                                                                                              | Runtime/native input behavior. `text`, `email`, and `password` are documented in React/a1-web; the Figma component shows the shared text-field surface.                 |
| `autoComplete`                                                                                                      | Browser/password-manager behavior, not visual                                                                                                                           |
| `inputOverlay`                                                                                                      | Extension slot used by specialized fields; not part of the base Text Field Figma v1                                                                                     |
| Independent boolean combinations                                                                                    | Figma uses aggregate `State` to avoid invalid combinations such as `disabled` + `error` + `readOnly`; Code Connect emits the matching React prop for the selected state |
| `hover`, `focus` visual states                                                                                      | Included as Figma states for inspection/prototyping; Code Connect emits no React prop for them                                                                          |
| `onChange`, `onInput`, `onBeforeInput`, `className`, `style`, `ref`, `aria-*`, `id`, native input passthrough props | Runtime-only props                                                                                                                                                      |

### Menu

**Component structure:** `Menu` is a single shell component on the Menu page (`node 218:1177`) and `Menu Item` is a separate child component set (`node 218:1176`). Menu owns the panel surface, section label, and `_items` slot frame. Menu Item owns row content and state variants. Do not rebuild MenuItem internals inside Menu.

**Figma default:** Menu inserts as a standard open desktop menu shell with five Menu Item slot instances. Menu Item inserts as `State=default`.

**Color modes:** Menu uses the shared Color collection for all fills and strokes (`surface/panel`, `surface/page`, `border/subtle`, `text/*`, `action/*`, `status/error/*`, `button/focusRing`). Do not add a Menu theme variant; dark mode is controlled by switching the Color collection mode on a containing frame or page.

**Typography:** Menu Item labels use `Body/MD`, shortcuts use `Body/XS`, and Menu section labels use `Menu/Section label` (Inter Semi Bold 12) to match the React `body-xs` semibold menu chrome.

Variant properties:

| Component | React prop / state                                                         | Figma representation | Valid values                                                                            |
| --------- | -------------------------------------------------------------------------- | -------------------- | --------------------------------------------------------------------------------------- |
| Menu Item | `active`, `disabled`, `variant="destructive"` and visual inspection states | Variant `State`      | `default` \| `hover` \| `focus` \| `pressed` \| `active` \| `disabled` \| `destructive` |

Component properties:

Menu:

| React prop           | Figma property                         | Type                    | Notes                                                                                           |
| -------------------- | -------------------------------------- | ----------------------- | ----------------------------------------------------------------------------------------------- |
| `Menu["aria-label"]` | `Aria label`                           | TEXT                    | Code Connect emits `aria-label` on `<Menu>`                                                     |
| `MenuSection label`  | `Section label` + `Show section label` | TEXT + BOOLEAN          | Controls the section label above the `_items` slot frame                                        |
| slotted child rows   | `Item slot 1–5` + `Show item slot 1–5` | INSTANCE_SWAP + BOOLEAN | Slots should contain Menu Item instances; swap/hide rows rather than duplicating item internals |

Menu Item:

| React prop          | Figma property               | Type                    | Notes                                                                                     |
| ------------------- | ---------------------------- | ----------------------- | ----------------------------------------------------------------------------------------- |
| `MenuItem children` | `Label`                      | TEXT                    | Visual item label and Code Connect children                                               |
| `MenuItem icon`     | `Icon` + `Show icon`         | INSTANCE_SWAP + BOOLEAN | Nested icon vectors must be rebound to the state-specific foreground variable after swaps |
| `MenuItem shortcut` | `Shortcut` + `Show shortcut` | TEXT + BOOLEAN          | Omits `shortcut` when the toggle is off                                                   |

Gaps — props and behaviors that cannot currently be represented visually in Figma:

| React prop / behavior                                               | Gap reason                                                                                                                                                       |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `open`, `onClose`, `anchorRef`, viewport positioning                | Runtime dialog positioning and state management                                                                                                                  |
| `trapFocus`, `modalOnMobile`, Escape/outside-click dismissal        | Runtime accessibility behavior; Figma shows the open surface only                                                                                                |
| `children` as arbitrary composition                                 | Figma v1 uses five documented Menu Item slots; arbitrary row count is represented by duplicating/replacing Menu Item instances in the `_items` slot frame        |
| `href`, `onClick`, `className`, `style`, `ref`, additional `aria-*` | Runtime-only props                                                                                                                                               |
| Icon exact Code Connect output                                      | Figma icon instance swaps are visual; the repo template emits `more_vert` by default and `delete` for destructive until icon instance names can be read reliably |
| `hover`, `focus`, `pressed`                                         | Included as Figma visual states for inspection/prototyping; Code Connect emits no React prop for them                                                            |

### Dialog

**Component structure:** `Dialog` component set on the Dialog page (`node 228:1628`) with variants for size and status. `Dialog Hero Icon` is a separate child component set (`node 228:1013`) used by status hero variants. The Dialog body and footer are the `body slot` and `Footer Slot`, so richer content can replace the placeholder text/buttons without rebuilding the shell.

**Figma default:** The first/default variant is `Size=md, Status=none`, matching React's runtime `size="md"` and no-status presentation.

**Color modes:** Dialog uses the shared Color collection for panel surface, borders, page backdrop, status hero fills, inverse hero icons, and focus/close icon colour. Do not add a Dialog theme variant; dark mode is controlled by switching the Color collection mode on a containing frame or page.

**Layout:** The component set uses grid auto layout because Dialog has multiple variants. Individual dialog variants and their internal sections use auto layout only; variants must not be absolutely positioned. Use `body slot` and `Footer Slot` as composition slots rather than duplicating arbitrary child layers across variants.

Variant properties:

| React prop | Figma representation | Valid values                                                    |
| ---------- | -------------------- | --------------------------------------------------------------- |
| `size`     | Variant `Size`       | `sm` \| `md` \| `lg` \| `xl`                                    |
| `status`   | Variant `Status`     | `none` \| `success` \| `error` \| `warn` \| `info` \| `neutral` |

Component properties:

| React prop         | Figma property                | Type           | Notes                                                                                                                                                        |
| ------------------ | ----------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `title`            | `Title`                       | TEXT           | Header title text                                                                                                                                            |
| `children`         | `Body` + `body slot`          | TEXT + SLOT    | The plugin hides the default body text and inserts a styled local text override in `body slot`; use richer slot content for forms, tabs, or composed content |
| `footer`           | `Show footer` + `Footer Slot` | BOOLEAN + SLOT | Shows/hides the footer area; replace `Footer Slot` contents with Button instances for specific actions                                                       |
| `onClose` presence | `Show close`                  | BOOLEAN        | Shows/hides the close icon affordance; Code Connect emits a placeholder `onClose` when visible                                                               |

Gaps — props and behaviors that cannot currently be represented visually in Figma:

| React prop / behavior                                                           | Gap reason                                                                                                          |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `open`                                                                          | Figma represents the visible/open dialog only; state management is runtime-owned                                    |
| `onClose` callback semantics, Escape, backdrop click, focus trap, focus restore | Native-dialog runtime behavior; Figma only shows the resulting affordance                                           |
| `icon`                                                                          | React can override the status hero icon; Figma v1 uses the default icon tied to `Status` through `Dialog Hero Icon` |
| `children` / `footer` as arbitrary React nodes                                  | Represented by named slot frames, not by a complete React AST                                                       |
| `className`, `style`, `ref`, `aria-*`, `id`, native dialog attributes           | Runtime-only props                                                                                                  |

### Radio Group

**Component structure:** `Radio Group` is a component set on the Radio Group page (`node 283:1121`). Its `Radio Items` slot contains `Radio Option` instances (`node 269:1599`), so designers can add up to 20 rows without rebuilding the group.

**Figma default:** The first/default variant is `Size=default, Inline=False`, matching React's default density and stacked layout. The group has no field-level error/disabled state; selection belongs to individual option instances.

Variant properties:

| React prop       | Figma representation              | Valid values                            |
| ---------------- | --------------------------------- | --------------------------------------- |
| `size`           | Variant `Size`                    | `comfortable` \| `default` \| `compact` |
| `inline`         | Variant `Inline`                  | `False` \| `True`                       |
| option selection | `Radio Option` variant `selected` | `false` \| `true`                       |

Component properties:

| React prop | Figma property                                           | Type                  | Notes                                   |
| ---------- | -------------------------------------------------------- | --------------------- | --------------------------------------- |
| `label`    | `Label`                                                  | TEXT                  | The visible group legend                |
| `required` | `Required`                                               | BOOLEAN               | Shows the required affordance           |
| `hint`     | `Helper`                                                 | TEXT                  | Group helper copy                       |
| `options`  | `Radio Items` slot → `Radio Option` label/hint/show-hint | SLOT + TEXT + BOOLEAN | The slot accepts 2–20 Radio Option rows |

Gaps — props and behaviors that cannot currently be represented visually in Figma:

| React prop / behavior                                            | Gap reason                                                                                       |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| option `value`, option-level `disabled`                          | Figma stores visible labels and selection but not stable runtime option values or disabled state |
| `error`, `disabled`, `value`, `defaultValue`, `onChange`, `name` | Native validation, form behavior, and controlled state are runtime-owned                         |
| `id`, `className`, `ref`, `aria-*`                               | Runtime-only semantics and integration details                                                   |
| option `hover`                                                   | Included on Radio Option for inspection; emits no React prop                                     |

### Checkbox Group

**Component structure:** `Checkbox Group` is a component set on the Checkbox Group page (`node 296:1058`). Its `Checkbox Items` slot accepts 1–20 `Checkbox Option` instances (`node 293:1031`). It has the same group property model as Radio Group, with independent selected option rows.

**Figma default:** `Size=default, Inline=False` with three visible options.

| React prop                    | Figma representation                                                    | Valid values                            |
| ----------------------------- | ----------------------------------------------------------------------- | --------------------------------------- |
| `size`                        | Variant `Size`                                                          | `comfortable` \| `default` \| `compact` |
| `inline`                      | Variant `Inline`                                                        | `False` \| `True`                       |
| `label` / `hint` / `required` | `Label` / `Helper` / `Required`                                         | TEXT / TEXT / BOOLEAN                   |
| `options` and selection       | `Checkbox Items` slot → Checkbox Option label/hint/show-hint/`selected` | 1–20 options; `selected=false \| true`  |

Checkbox option values, disabled/error state, controlled values, names, callbacks, and ARIA remain runtime-only. The JSON bridge generates deterministic option values from visible labels so a selection can round-trip through the Figma representation.

### Top Header

**Component structure:** `Top Header` is a component set on the Top Header page (`node 621:1132`) with a `Top Header Nav Item` child component set (`node 612:995`). Each variant composes: a `Logo` text, a **`Nav Items` Slot** of Nav Item instances, a fill-width spacer, and an **`Actions` Slot** of Icon Button instances plus an optional Sign in Button instance. Both areas are real Figma Slots exposed as SLOT component properties — insert, remove, and reorder instances freely per placed instance.

**Figma default:** Inserts as `Breakpoint=lg` (1440) — three nav entries (Explore with chevron, Foundations, Components active), search and notifications actions, and the sign-in button.

**Breakpoint variants:** `Breakpoint=xs|sm|md|lg|xl`. Each variant binds its width to the Breakpoint collection's `page/width/default` (375 / 640 / 768 / 1280 / 1512) and sets that collection's mode explicitly, so width, paddings, and mode-driven values resolve per variant. `xs` and `sm` show the mobile composition — hamburger (menu Icon Button), logo, and actions with the `Nav Items` slot hidden — mirroring React's 768px switch; `md` and up show the full nav.

**Color modes:** The bar binds `color/surface/page`, the bottom hairline binds `color/border/subtle`, nav labels and nav icons bind `color/text/muted`/`color/text/default`, and the active underline binds `color/action/background`. Do not add a dark variant; apply the Color collection's Dark mode to a containing frame — the `Top Header / Dark mode validation` frame demonstrates this.

**Geometry variables:** `topHeader/*` in the Components collection — `height` (aliases `spacing/64`, on the header height token), `paddingInline`, `logoGap`, `navGap`, `navItemPaddingInline`, `navItemGap`, `actionsGap`, `borderWidth`, `activeBorderWidth` — all aliasing Primitives spacing.

**Typography:** Nav labels use the new `Top Header/Nav label` style (Inter Medium 14/20, mirroring React's 14px weight-500 nav links); the logo text uses `heading/sm`.

Component properties:

| React prop | Figma property | Type | Notes |
|------------|----------------|------|-------|
| viewport (visual only) | Variant `Breakpoint` | `xs` \| `sm` \| `md` \| `lg` \| `xl` — preview axis; Code Connect emits no React prop |
| `logoText` | `Logo text` | TEXT | The header wordmark |
| `loginButton` | `Show login button` + the sign-in Button's `Label` | BOOLEAN + TEXT | Toggles the Sign in Button instance; the JSON bridge exports/applies its label as `loginButton: { label }` (click behavior stays runtime-owned) |
| `navItems` | `Nav Items` slot of `Top Header Nav Item` instances | SLOT | Each exposes `Label`, `Show icon`, `Icon` swap, `Show chevron`, and `State=default\|hover\|active` |
| `actions` | `Actions` slot of Icon Button instances | SLOT | Swap each action's icon on the Icon Button instance |

Gaps — props and behaviors that cannot currently be represented visually in Figma:

| React prop / behavior | Gap reason |
|-----------------------|------------|
| `navItems[].items` (dropdown submenus), `menuHeader` | Runtime dropdown behavior; the chevron toggle shows the affordance only |
| Mobile nav overlay | The xs/sm variants show the closed hamburger composition; the opened overlay is runtime behavior |
| `navIconPosition` (responsive) | Breakpoint variants change composition, not per-item icon position; nav icons show the `start` position via `Show icon` |
| `logo` (node), `logoHref` | The Figma v1 represents the text wordmark only |
| action `badge` | Not represented on the Icon Button instances |
| `loginButton.onClick` | Click behavior is runtime-owned; only the `{ label }` round-trips through the JSON bridge |
| `onClick`, `href`, `className`, `id`, `aria-*`, `ref` | Runtime-only props |
| nav `hover` state | Included for inspection; Code Connect emits no React prop for it |

### Choice Group

**Component structure:** the Choice Group page carries a `Choice Option` component set (`node 762:124`) — `Type=radio|checkbox` × `State=default|selected|disabled` × `Size=compact|default|comfortable` (18 variants) — and a `Choice Group` shell (`node 762:125`). Tiles are 8px-radius cards on the field surface with the selection indicator absolutely positioned in the top-start corner (circle for radio, rounded square for checkbox); **selected** binds the action surface with a 2px accent border and a filled indicator (`color/action/foreground` dot or check); **disabled** is the raised surface at 50%. Densities follow the compact/default/comfortable scale (padding 8/12/16, indicator 12/16/20, icon 20/24/32) with new `Choice/Label {density}` weight-500 text styles and a `Choice/Subtext compact` (body-2xs) style. Option properties: `Label`, `Show icon` + `Icon` swap, `Show subtext` + `Subtext`. The shell exposes `Label`, `Required`, and `Helper` + `Show helper`, and composes a wrapping equal-width tile row.

**JSON bridge:** exports as `ChoiceGroup` with real React props — legend/required/hint, `options` (label/subtext/icon/disabled), `defaultValue` from selected tiles, `multiple` from checkbox tiles, and `size` from tile density. The Options slot's **embedded Grid is detected**: a native GRID's column count or a responsive plugin Grid's `{xs:n, md:n}` metadata exports as `columns`, and import/update syncs the metadata back onto the grid (a `columns` value without an embedded Grid warns). Tile reconciliation (1–20) appends inside the grid when present. The choice-group configurator has the matching JSON view; its config carries no selection, so `defaultValue` renders in the playground/editor but not the configurator preview.

Gaps — runtime-owned:

| React prop / behavior | Gap reason |
|-----------------------|------------|
| `multiple` | Maps to the checkbox `Type` per tile; the group-level toggle is runtime |
| `columns` (number / responsive object), auto-fill | Figma shows a wrapping equal-width row |
| `sections` (labeled subgroups with dividers), `inlineIcon` | Layout variants deferred from v1 |
| `error` / `success` group messages, option `value`, `onChange` | Runtime form state |
| Hover mixes | Interaction states are not represented |

### Chip

**Component structure:** the Chip page carries a `Chip` component set (`node 752:61`) — `Size=sm|md|lg` × `State=default|selected|disabled` (9 variants) — and a `Chip Group` component (`node 752:62`). Chips are pills on the 28/40/56 total-height standard: transparent with a 1px `border/default` outline by default, the action background/foreground when selected, and 55% opacity when disabled. Labels use the new `Chip/{sm,md,lg}` text styles (body sizes at the chip's weight-500 token). Properties: `Label` TEXT, `Show icon` + `Icon` INSTANCE_SWAP, and `Show caret` (the `expand_more` menu-chip affordance). Chip Group composes a wrapping md chip row (6px gaps) under an optional compact muted label (`Chip/Group label` style) with `Label` + `Show label` properties.

**JSON bridge:** exports as `ChipGroup` (group label, size, `items` from the `Chip slot` with **per-item `selected` / `disabled` / `menu` flags** — a caret marks that item as a menu chip; the group `behavior` is a runtime selection semantic and is never inferred); import/update reconciles Chip instances in the slot (1–12), honoring explicit item states over the first-chip demo selection. A lone Chip exports as a one-item `ChipGroup`. The a1-web chip configurator gained **Group label** plus per-item **Selected / Disabled / Menu chip** controls and the matching JSON view.

Gaps — runtime-owned:

| React prop / behavior | Gap reason |
|-----------------------|------------|
| `selectionMode`, `value`/`defaultValue`, `onChange` | Selection state management |
| `menu` / `menuLabel` contents | Show caret marks the affordance; the open A1 Menu is composed at runtime |
| `as` / `href` navigation chips | Runtime semantics |
| `wrap={false}` single-row toolbars | Compose a non-wrapping row manually |
| Hover/pressed mixes | Interaction states are not represented in v1 |

### Data Table

**Component structure:** `Data Table` (`node 728:38`, Data Table page) is the **default density only** — a 640px shell on the page surface with the scroll-container chrome (1px `border/subtle`, 8px radius, clipped corners) composing a header row and data rows. `Data Table Header Cell` (`node 728:32`) carries `Sort=none|unsorted|ascending|descending` × `Align=start|end` — panel surface, `Data Table/Header` text style (body-sm at weight 500), muted until sorted, `unfold_more` at 44% opacity for sortable-unsorted and the arrow at 72% when sorted. `Data Table Cell` (`node 728:37`) carries `Align=start|end` with body-sm text and the bottom hairline; the shell's last row drops the hairline via an instance stroke override (mirroring `tbody tr:last-child td`). Cells expose `Label` / `Value` TEXT properties; columns share width via layout grow.

**JSON bridge:** exports as `DataTable` (columns with label/sortable/end-align + `defaultSort` from the sorted header; rows from visible cell values); import/update maps onto the fixed 4×4 grid, hiding unused headers/columns/rows (extras warn) and moving the last-row hairline drop. The a1-web data-table configurator now accepts JSON `rows` (replacing the sample set) and has the matching JSON view.

Gaps — runtime-owned:

| React prop / behavior | Gap reason |
|-----------------------|------------|
| `size` (compact/comfortable), zebra, `scrollable` | Default density only in v1; no responsive behavior by request |
| Selection (checkboxes, bulk actions), search, pagination, `notices` | Interactive table chrome |
| Column `type` renderers (image, etc.), `searchMatcher`, mobile-cards layout | Runtime rendering |
| Sort behavior | The Sort axis is a visual state; Code Connect emits a representative `defaultSort` |

### Page Layout

**Component structure:** `Page Layout` is a component set on the Page Layout page (`node 671:19628`) with `breakpoint=xs|sm|md|lg|xl` variants — a vertical shell on the page surface containing a fill-width **Top Header instance** (matched to the same breakpoint) and a **`Page content` SLOT** for the rest of the page. Each variant binds its width to the Breakpoint collection's `page/width/default` (375 / 640 / 768 / 1280 / 1512) and sets that collection's mode explicitly; the slot's placeholder label is bound to the `deviceMode` variable so it names the active breakpoint. `xs` is the insert default. Drop Sections into the slot; configure the header on the nested Top Header instance. Breakpoint variants are visual preview widths — React PageLayout is fluid and no breakpoint prop is emitted.

**JSON bridge:** exports as `PageLayout` with the nested Top Header as its first child (via the Top Header bridge) and the slot's contents as the remaining `children`; import/update applies TopHeader props onto the nested instance and renders content children into the slot (Section-style slot population). The exported `showHeader/showSidebar/showFooter: false` props are playground-preview flags that suppress the a1-web configurator's placeholder slots — they are not React PageLayout props.

Gaps — runtime-owned in v1:

| React prop / behavior | Gap reason |
|-----------------------|------------|
| `sidebar`, `aside`, `footer` slots + placements | v1 represents the Top Header + main content only |
| `stickyHeader`, `viewportHeight` | Scroll/viewport behavior |
| PageLayout no-gap rule internals | The React sidebar/main seam does not exist in the v1 composition |

### Typography & navigation batch (Inline, Code, List, Breadcrumb, Split Button, Bottom Drawer, Page Nav, Tabs, Tree Menu, Side Nav)

Ten component sets added in one pass (July 2026), each on its own page with a dark-mode validation frame and a Code Connect template in `packages/figma/code-connect/`. Shared conventions: every fill/stroke binds Color collection variables; labels use existing or purpose-created text styles (`Code/sm` mono, `Breadcrumb/current`, `Nav/Stacked label`, `Page Nav/Heading`, `Tab/Label`, `Tab/Step number`, `Side Nav/Active label`); item-based components ship a child item set that the shell composes, mirroring the Radio Group / Top Header pattern.

| Component (set node) | Variant axes | Component properties | Key gaps (runtime-owned) |
| -------------------- | ------------ | -------------------- | ------------------------ |
| Inline (`656:986`) | `Element=kbd\|mark` | `Text` | Not a React component — inline.css semantic elements; code/cite/del/var/time/q treatments not represented. mark binds `color/inline/markBackground`/`markForeground` |
| Code (`656:991`) | `Variant=inline\|block` | `Code text` | `copyCode`, `editable`, `rows`, `lineNumbers`, `wrapping`, `onChangeValue` |
| List (`658:1020`) | `Variant=unordered\|ordered\|icon\|divider` | `Item 1–3` | `size`/`color`/`marginBottom`/responsive props; per-item icon overrides; auto-numbering (ordered numbers are static text) |
| Breadcrumb (`659:999`; Item `659:985`) | Breadcrumb: `Variant=default\|back`; Item: `Type=link\|current\|ancestor` | Item `Label`; `Back label` | `items` data/`href`/`onClick`; the <480px switch to the back form is automatic in React (Variant=back is a preview) |
| Split Button (`660:1020`) | `Variant=primary\|secondary` × `Size=sm\|md\|lg` | `Label` | dropdown `actions` Menu, `icon`/`iconPosition`, `loading`/`disabled`, destructive/success variants; divider = foreground at 35% opacity |
| Bottom Drawer (bar `661:1036`; Item `661:1035`) | Item: `State=default\|active` | Item `Label`, `Icon` swap, `Show badge`, `Badge` | `items` data (max 5), `href`/`onClick`/`disabled`, safe-area pinning; badge 99+ cap |
| Page Nav (shell `662:988`; Item `662:987`) | Item: `Level=1\|2` × `State=default\|active` | Item `Label` | `sections` data; scroll-driven progress fill and active item |
| Tabs (Tab `663:1009`; strip `663:1010`) | Tab: `Variant=line\|pills\|segment\|folder\|progress` × `State=default\|active` (+`completed` for progress) | `Label` | `icon`/`count`/`iconPosition`, progress `error`/`warn`, `equalHeight`, `labelMode`, overflow scrolling, panels; compose non-line strips from Tab items |
| Tree Menu (shell `664:1011`; Item `664:1010`) | Item: `Type=branch-expanded\|branch-collapsed\|leaf` × `State=default\|selected` | Item `Label`, `Show icon`, `Icon` swap | `items` tree data, collapsed icon-rail variant, drag-and-drop, inline rename; indent = 12px wrapper per depth |
| Side Nav (shell `665:1047`; Item `665:991`) | Shell: `Variant=expanded\|collapsed`; Item: `State=default\|active` | Item `Label`, `Show icon`, `Icon` swap, `Show badge`, `Badge` | `SideNavGroup`, mobile overlay/scrim, collapse behavior, header/footer render props; active tint binds `color/sideNav/itemActiveBackground` (text/accent @ 10%) |

**Swap caveat:** swapping an item's `Icon` instance resets the glyph's fills to the icon component's raw color — rebind the nested vectors to the state's foreground variable after a swap (the shipped shell compositions are already rebound).

### Section

**Component structure:** `Section` > `Section Content` (nested instance, `contentWidth` variant) > `Section Content Slot` (SLOT, FILL width).
Designers drop content inside `Section Content Slot`. Switch variable collection modes on the Section instance or nested Section Content instance to change Gap and ContentWidth.

Variant properties (create distinct visual states in the component set):

| React prop | Figma representation        | Valid values                                                                                                                                                                          |
| ---------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `surface`  | Variant `Surface`           | `page` \| `panel` \| `raised`                                                                                                                                                         |
| `padding`  | Variant `Padding`           | `none \| xs \| sm \| md \| lg`                                                                                                                                                        |
| `inverse`  | **Color mode on the frame** | Apply the Color collection's Inverse mode to the container — not a variant property. See [Inverse and dark themes](#inverse-and-dark-themes--use-color-modes-not-variant-properties). |

Mode-based properties (apply a variable collection mode on the frame — the value updates automatically):

| React prop     | Variable collection | Variable                   | Modes                                                                         | How to apply                                                                                                                                                                                |
| -------------- | ------------------- | -------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `gap`          | **Gap**             | `value` (GAP scope)        | `none(0)` \| `xs(8)` \| `sm(12)` \| `md(16)` \| `lg(24)` \| `xl(40)`          | Select Section instance → Design panel → Variable modes → Gap → choose mode. The Section Slot's `itemSpacing` is bound to this variable.                                                    |
| `contentWidth` | **ContentWidth**    | `max` (WIDTH_HEIGHT scope) | `xs(456)` \| `sm(640)` \| `md(800)` \| `lg(960)` \| `xl(1120)` \| `2xl(1440)` | Select Section instance → Design panel → Variable modes → ContentWidth → choose mode. The nested `Section Content` instance width is bound to this variable. Default mode is `lg` (960 px). |

TEXT component properties (documentation only — appear in Design panel but do not change the visual):

| React prop                  | Figma property              | Default    | Valid values                                                                                       |
| --------------------------- | --------------------------- | ---------- | -------------------------------------------------------------------------------------------------- |
| `gradient`                  | `Gradient`                  | `""`       | `accent \| highlight \| info \| success \| warn`                                                   |
| `gradientPosition`          | `GradientPosition`          | `"center"` | `top \| top-right \| right \| bottom-right \| bottom \| bottom-left \| left \| top-left \| center` |
| `height`                    | `Height`                    | `""`       | `screen \| hero`                                                                                   |
| `align`                     | `Align`                     | `""`       | `left \| center \| right` — also accepts a responsive object                                       |
| `borderSize`                | `BorderSize`                | `""`       | `xs \| sm \| md \| lg` — required to activate border                                               |
| `borderStyle`               | `BorderStyle`               | `"solid"`  | `solid \| dashed \| dotted`                                                                        |
| `borderVariant`             | `BorderVariant`             | `"subtle"` | `subtle \| strong \| accent`                                                                       |
| `borderSides`               | `BorderSides`               | `"all"`    | `"all"` or subset of `["top", "right", "bottom", "left"]`                                          |
| `radius`                    | `Radius`                    | `""`       | `none \| sm \| md \| lg \| xl`                                                                     |
| `backgroundImage`           | `BackgroundImage`           | `""`       | image URL (decorative background; suppresses `gradient`)                                           |
| `backgroundFit`             | `BackgroundFit`             | `"cover"`  | `cover \| contain \| tile`                                                                         |
| `backgroundPosition`        | `BackgroundPosition`        | `"center"` | `center \| top \| bottom \| left \| right \| top-left \| top-right \| bottom-left \| bottom-right` |
| `backgroundOverlay`         | `BackgroundOverlay`         | `""`       | `darken \| lighten`                                                                                |
| `backgroundOverlayStrength` | `BackgroundOverlayStrength` | `"md"`     | `sm \| md \| lg`                                                                                   |

Gaps — props that cannot currently be represented visually in Figma:

| React prop                                      | Gap reason                                                                                                                                                                    |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `gradient` (visual)                             | Gradient requires a custom paint not yet in the Color collection — deferred                                                                                                   |
| `height="screen"`                               | Full-viewport height cannot be expressed as a static Figma frame height                                                                                                       |
| `border*` (visual)                              | Border appearance requires many more variants — deferred                                                                                                                      |
| `radius` (visual)                               | Corner radius requires more variants — deferred                                                                                                                               |
| `background*` (visual)                          | A designer can approximate with an IMAGE fill + a translucent overlay rectangle, but fit/tile/overlay-strength cannot be bound to tokens — documented as TEXT properties only |
| `responsive objects`                            | `padding={{ xs: 'sm', lg: 'lg' }}` and `align={{ xs: 'left', lg: 'center' }}` — Figma has no breakpoint-driven property switching                                             |
| `className` / `style` / `ref` / `aria-*` / `id` | Not applicable in Figma                                                                                                                                                       |

### Autocomplete

**Component structure:** `Autocomplete` component set on the Autocomplete page (`node 882:7620`) with `Size` (`compact` \| `default` \| `comfortable`) × `State` (`default` \| `error` \| `disabled`) variants — 9 variants mirroring the Select field family. The single-select control shows the selected value, a clear (`close`) affordance, and a trailing `expand_more` chevron. A separate **`Autocomplete Menu`** composition (`node 886:17`) shows the open listbox — plain / active (panel surface) / selected-with-`check` / colour-swatch / multi-checkbox option rows, a group heading, and the bold "Add …" create row — the analog of Select Menu, reusing the field/menu/shadow tokens. Two example frames on the page show the **multiple** (removable chips) and **colour** (leading swatch) modes, and a "Dark mode validation" frame renders instances under the Color collection's Dark mode.

**Figma default:** The first/default variant is `Size=default, State=default`, matching React's runtime `size="default"`.

**Color modes:** all fills/strokes bind shared Color collection variables (`surface/field`, `surface/page`, `surface/panel`, `surface/raised`, `border/strong`, `border/subtle`, `border/default`, `text/default`, `text/muted`, `status/error/border`, `status/error/text`, `status/info/background`, `action/background`, `action/foreground`). Do not add a component dark mode; dark is controlled by the Color collection mode (validated on the Dark frame).

**Typography:** labels use `Field/Label/SM|MD|LG` per size; the selected value uses `body/sm` (compact) / `body/md`; hint and error use `body/xs`; listbox options use `body/sm`; the group heading uses `Menu/Section label`.

**Field geometry:** height, inline padding, and item gap bind `field/height`, `field/paddingInline`, `field/gap` per `{compact|default|comfortable}`; borders bind `field/borderWidth`; the error variant thickens the leading edge with `field/errorBorderWidth` (the whole stroke stays `color/status/error/border` — one colour, matching Text Field); radii bind `radius/sm` (compact) / `radius/control` (default) / `radius/lg` (comfortable); the listbox reuses `radius/control` and the `shadow/md` effect style.

**Error border:** as with Text Field, the error outline is a single colour (`color/status/error/border`); only the leading edge is thickened via `field/errorBorderWidth`.

Variant properties:

| React prop | Figma representation | Valid values |
|------------|---------------------|--------------|
| `size` | Variant `Size` | `compact` \| `default` \| `comfortable` |
| `error`, `disabled` | Variant `State` | `default` \| `error` \| `disabled` |

Component properties:

| React prop | Figma property | Type | Notes |
|------------|----------------|------|-------|
| `label` | `Label` | TEXT | Visible field label |
| `value` (selected, single) | `Value` + `Show value` | TEXT + BOOLEAN | The selected value shown in the control |
| `hint` | `Hint` + `Show hint` | TEXT + BOOLEAN | Helper text in non-error states |
| `error` | `Error message` | TEXT | Error text when `State=error` |
| `required` | `Required` | BOOLEAN | Shows the asterisk in the label row |

Gaps — props and behaviors that cannot currently be represented as variants in Figma:

| React prop / behavior | Gap reason |
|-----------------------|------------|
| `options`, `value` / `onChange` | Option data and selection state are runtime-owned |
| `multiple` (removable chips) | Shown as the "multiple" example frame, not a variant axis |
| `variant="color"` (swatch) | Shown as the "colour" example frame + the swatch option row in `Autocomplete Menu` |
| `allowCreate` / `onCreate`, `createLabel` | Shown as the "Add …" create row in `Autocomplete Menu` |
| option `group` / `icon` / `swatch`, `emptyText`, `maxVisible` / `moreText` | The listbox composition shows representative rows; long-list capping and grouping are runtime |
| `open` / focus, portal positioning, keyboard, `aria-*`, `name`, `id`, `className` | Combobox runtime behavior |

**Component keys:** set `70b9bc426a6780ba5bd66f8a034b1c35876b6c43`, `Autocomplete Menu` `8376317911f324eaace29e9baca95b56e4c79fb1`. Code Connect template: `packages/figma/code-connect/Autocomplete.figma.ts`. JSON-bridge support is a follow-up (the a1-json plugin is mid-refactor on this branch).

---

## Pages in the Figma file

| Page name        | Purpose                                                                                                                                                                                                                    |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Button           | Button component set and related documentation                                                                                                                                                                             |
| Button Container | Alignment variants, responsive-flow examples, and documentation                                                                                                                                                            |
| Card             | Default/accent surface variants with a configurable, token-styled inline icon and native Content Slot                                                                                                                      |
| Badge            | Status/subtle/size variants with an editable label and configurable nested native Material icon instance; subtle variants use readable semantic text and status-border bindings rather than inverse text on a pale surface |
| Figure           | Source/alt/caption properties, compact `Size` (`2xs`–`xl`) maximum-width variants and `Aspect ratio` variants locked on the Image layer, plus an editable token-bound image fill (no Media Slot)                           |
| Definition List  | `sm`/`md`/`lg` size and row/column variants with a native Items Slot containing reusable `Definition List Item` instances for Label/Value pairs                                                                            |
| Blockquote       | Visual-style variants with editable quote and citation fields; the feature treatment includes its leading display quote mark                                                                                               |
| Link             | Size, weight, and Material icon-position variants with editable label and icon properties                                                                                                                                  |
| Icon Button      | Tertiary/secondary/destructive/success and `sm`/`md`/`lg` variants with accessible label and Material icon properties                                                                                                      |
| Select           | Comfortable/default/compact control variants with default/focus/error/disabled visual states                                                                                                                               |
| Divider          | Horizontal/vertical semantic line variants with solid/dashed/dotted styles and token thicknesses                                                                                                                           |
| Text Field       | Text Field component set and related documentation                                                                                                                                                                         |
| Search Field     | Compact/default/comfortable search-field variants with token-bound field chrome                                                                                                                                            |
| Textarea         | Compact/default/comfortable multiline-field variants with token-bound field chrome, editable label/value/hint/count/required properties, hidden optional content by default, and a bottom-right resize grip    |
| Switch           | Checked and compact/default/comfortable switch variants with editable label, hint, and error content                                                                                                                       |
| Segmented Control | `sm`/`md`/`lg` segmented-control variants with child Segmented Control Item instances, editable labels, `Show label`/`Show icon`, and native Material `Icon` instance-swap properties; swapped icon vectors bind to the item label foreground variable |
| Accordion        | `sm`/`md`/`lg` open/closed variants and a Content Slot                                                                                                                                                                   |
| Tooltip          | Token-bound tooltip surface with four placement variants                                                                                                                                                                  |
| Pagination       | `sm`/`md`/`lg` representative pagination variants                                                                                                                                                                        |
| Empty State      | Page/section/card Empty State variants with title, description, and Action Slot                                                                                                                                          |
| Top Header       | Top Header component, Nav Item child set, examples, and dark-mode validation                                                                                                                                              |
| Dialog           | Dialog component set and related documentation                                                                                                                                                                             |
| Menu             | Menu component set and related documentation                                                                                                                                                                               |
| Radio Group      | Radio Group component set, examples, and dark-mode validation                                                                                                                                                              |
| Checkbox Group   | Checkbox Group component set and related documentation                                                                                                                                                                     |
| Inline           | kbd / mark semantic inline treatments with an editable Text property                                                                                                                                                       |
| Code             | inline chip and block panel variants (Code/sm mono text style) with an editable Code text property                                                                                                                         |
| List             | unordered/ordered/icon/divider variants with three editable item texts                                                                                                                                                     |
| Breadcrumb       | Breadcrumb Item set (link/current/ancestor) plus trail and narrow back-link variants                                                                                                                                       |
| Split Button     | primary/secondary × sm/md/lg split action + caret sharing one pill on the 28/40/56 standard                                                                                                                                |
| Bottom Drawer    | Bottom Drawer Item set (default/active with icon swap and badge) plus the xs bar composition                                                                                                                               |
| Page Nav         | Page Nav Item set (Level 1/2 × default/active) plus the card shell with reading-progress bar                                                                                                                               |
| Tabs             | Tab item set (line/pills/segment/folder/progress with progress completed state) plus the line strip                                                                                                                        |
| Tree Menu        | Tree Item set (branch expanded/collapsed, leaf × default/selected) plus a composed indented tree                                                                                                                           |
| Side Nav         | Side Nav Item set (default/active with icon swap and badge) plus expanded 280px / collapsed 52px shells                                                                                                                    |
| Choice Group     | Choice Option tile set (radio/checkbox × default/selected/disabled × three densities) plus a legend/helper shell with a wrapping tile row                                                                                    |
| Chip             | Size (sm/md/lg) × State (default/selected/disabled) pill chips with icon swap and menu caret, plus a wrapping Chip Group                                                                                                     |
| Data Table       | default-density table — Header Cell set (Sort=none/unsorted/ascending/descending × Align) + Cell set (Align) composed into a 640px shell                                                                                    |
| Page Layout      | v1 app shell — a fill-width Top Header instance above a Page Content Slot; JSON bridge round-trips the header and slot children                                                                                            |
| Autocomplete     | Autocomplete control set (Size × State) + `Autocomplete Menu` listbox composition + multiple/colour example frames + dark-mode validation                                                                                |
| Icons            | Material Symbols icon component sets used by component properties                                                                                                                                                          |

---

## Figma to JSON plugin (proof of concept)

`packages/figma/plugins/a1-json/` (A1-1651) is a development plugin that bridges
the public A1 Figma assets — **Button**, **Button Container**, **Card**, **Banner**, **Badge**,
**Figure**, **Definition List**, **Blockquote**, **Section**, **Text Field**, **Menu**, **Dialog**,
**Radio Group**, **Checkbox Group**, **Search Field**, **Textarea**, **Switch**, **Segmented Control**,
**Accordion**, **Tooltip**, **Pagination**, and **Empty State** — plus standalone
Figma text layers recognized as **Heading** or **Paragraph**, and authored
auto-layout Frames recognized as **Stack** or native Figma **Grid** — to the
page-definition JSON format in both directions. Export is automatic for a
selected supported instance; import accepts a node, an array, or a project/page
definition; and **Update selection** applies compatible props in place. The
component gap tables above remain authoritative: runtime-only values always
warn rather than being silently invented.

Section still scans its internal parts for split properties, maps explicit
Color modes and ContentWidth/Gap modes, and exports supported descendants as
`children`. **Update selection** also reconciles the existing ordered Heading,
Paragraph, and Button layers in a Section Content Slot, including text styles;
adding/removing slot layers still uses import/render. Its editable content
carrier is also inspected for numeric spacing: when a library copy lacks a
Gap property/mode, the nearest semantic Section gap is exported; **AutoFix**
can normalize that carrier and any available semantic Gap control. An authored
vertical/horizontal Figma auto-layout Frame exports as `Stack`; direction,
numeric/semantic gap, alignment, distribution, horizontal wrapping, grow, and
supported children round-trip. **AutoFix** normalizes off-scale Stack gaps,
wrap row spacing, and mixed child stretch only after the user invokes it;
Stack fixes bind item spacing to Spacing collection `gap/*` variables instead
of leaving raw pixel values.
padding remains a review-only `Inset` concern. Button Container maps `align`
and its ordered Button Slot children; imports preserve the container when the
action count matches its representative Buttons. Native Slots also accept count
changes, while legacy frame-based slots detach only for that structural
fallback. Selected-instance updates reconcile existing actions only.
Card maps its `surface` variant, normal inline `icon` through a `Show icon`
boolean plus `Icon` instance swap, a token-bound action-surface icon tile with
a `color/text/default` glyph, and native Content Slot; child add/remove
and updates stay attached. Badge maps status, subtle, size, its editable label,
and a nested native Material icon (or `icon: null` through `Show icon`).
Banner maps its inline/system/calendar variants, every status treatment,
editable title and calendar fields, and ordered `Content Slot` children. The
plugin promotes legacy `content.fallback` to a muted Paragraph child. Banner
actions, dismissal behavior, custom icon, and announcement runtime semantics
remain React-owned and report a warning when supplied in JSON. Since Figma's
plugin API cannot create a native Slot or insert children into a frame within
an instance, a Banner rendered with JSON children is intentionally detached,
tagged as a Banner for export, and should be rerendered to change its visual
properties.
Figure preserves source/alt/caption JSON, maps its compact Figma size as an
outer maximum width and locks each aspect ratio on the nested Image layer, and
uses an editable image fill rather than downloading
an external URL. Definition List maps its `sm`/`md`/`lg` size and row/column
direction plus ordered, reusable Definition List Item instances in its slot.
Blockquote maps visual variant, quote, citation, and citation URL. Their
compact Figma models intentionally warn for React-only presentation and runtime
props such as Figure crop/layout and Definition List copy controls. Native Figma
Grid frames map fixed columns and nearest A1-scale row/column gaps; responsive
columns, custom tracks, manual placement, and spans warn when omitted. Grid
fixes bind row and column gaps independently to Spacing collection `gap/*`
variables so asymmetric gaps remain representable.
Text Field maps its visible form state and defaults. Menu maps its
five preconfigured Figma rows to the a1-web `items` config (sections, items,
dividers, icons, shortcuts, destructive/active/disabled state); excess items
warn. Dialog maps size/status/title/body-slot text/close/footer visibility and
its Button-only `footerActions` slot. Free text maps local `heading/*`,
`display/*`, and `body/*` styles, A1 text color variables, and alignment; when
those properties are missing, the plugin offers an explicit best-effort repair
rather than silently editing the Figma layer. A selected frame/group emits a
neutral `{ nodes: [...] }` bundle of supported instances and free text in layer
order (without a synthetic Section), which is the first screen-export path;
arbitrary layout, shape, and image
translation is intentionally deferred. Radio and Checkbox Group map density, inline, label/helper/required, and option
items. The plugin reconciles their live Figma slots as JSON options are added
or removed (Radio Group: 2–20; Checkbox Group: 1–20). Their option values are
deterministic slugs of visible labels because Figma does not expose a value
property; counts outside the supported range warn and are clamped.

The plugin's **Open in a1-web** link passes a selected node through `?json=` to
the local component route. Its **Local Playground handoff** uses the existing
localhost bridge: start `npm run codex:bridge:a1-web`, leave the plugin open,
then choose **Send to Figma** in `/playground`. The bridge accepts a valid JSON
payload only from the local a1-web origin, holds one payload for five minutes,
and exposes it to the plugin's development-only `localhost:4318` permission.
The plugin imports and acknowledges it once. A browser cannot launch a Figma
plugin, so opening the plugin remains a user action. See the plugin README for
exact mappings, limits, and install steps.

For the local Figure image POC, the handoff may include a volatile asset
sidecar: local Image Library `a1img://…` references send their PNG, JPEG, or GIF
bytes to the Figure Image fill in Figma; the selected Figma Figure can be sent
back to the Playground to create the same local reference. This remains a
loopback-only, user-invoked transfer (4 MB total, five-minute expiry). The
bytes are not stored in the page JSON or sent to any remote service.

---

## Variable collections summary

| Collection name | Type  | Modes                         | Key variables                                                                                                                                                                                                                                                                                      |
| --------------- | ----- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Color           | COLOR | Light / Dark                  | All semantic color tokens (`surface/*`, `text/*`, `border/*`, `action/*`) + component-facing color aliases such as `color/button/*`                                                                                                                                                                |
| Spacing         | FLOAT | Default                       | `gap/xs–xl`, `radius/sm–lg`                                                                                                                                                                                                                                                                        |
| Primitives      | mixed | Default                       | Base color ramp + primitive radius values                                                                                                                                                                                                                                                          |
| Components      | mixed | Value                         | Shared component variables including Menu shell/item dimensions, Dialog width/padding/radius/footer-border dimensions, and scoped `radioGroup/*` geometry variables.                                                                                                                               |
| Button          | mixed | Value                         | Button component variables. Color variables alias to Color collection roles (for example `button/secondary/background` → `color/button/secondary/background`); size/radius/spacing variables alias to primitive tokens.                                                                            |
| Field           | FLOAT | Value                         | Text Field component variables for exact React heights, padding, gaps, border widths, focus dimensions, accent widths, and side-label widths. Field-specific interaction colours live in the shared Color collection as `color/field/*` aliases so light/dark mode is switched once through Color. |
| Breakpoints     | FLOAT | xs / sm / md / lg / xl        | `min`, `max`, `canvas` — bind `canvas` to a frame's width then switch modes                                                                                                                                                                                                                        |
| Gap             | FLOAT | none / xs / sm / md / lg / xl | `value` (GAP scope) — bind to an auto-layout frame's `itemSpacing`; switch modes to change gap                                                                                                                                                                                                     |
| ContentWidth    | FLOAT | xs / sm / md / lg / xl / 2xl  | `max` (WIDTH_HEIGHT scope) — bind to a FIXED-width inner frame; switch modes to constrain content area                                                                                                                                                                                             |
