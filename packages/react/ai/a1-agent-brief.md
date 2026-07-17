# A1 Agent Brief — build A1 pages & projects from JSON (zero context)

This single file is everything an agent needs to **generate valid A1 page-definition JSON** (and project bundles) with no other context. It is self-contained: the JSON format, the full component list with props, the value vocabularies, the rules, and worked examples.

- The rendered page is **derived from the JSON** — the JSON is the source of truth.
- Output is rendered by the a1-web Editor (`?page=editor`) and importable via **Projects → Upload JSON**.
- When something here is ambiguous, the ground truth is the code: `apps/a1-web/src/editor/pageTypes.ts` (types), `apps/a1-web/src/editor/componentRegistry.ts` (renderable set), and `packages/react/ai/components.md` (exhaustive per-component props).

---

## 1. The two JSON shapes

### A. Page definition (one page)

```jsonc
{
  "schemaVersion": "0.1.0",
  "page": {
    "id": "home",
    "name": "Home",
    "description": "Optional.",
    "layout": {
      "type": "PageLayout",
      "props": {},
      "regions": [
        { "id": "main", "name": "Main", "nodes": [ /* ComponentNode[] */ ] }
      ]
    }
  }
}
```

### B. Project bundle (a multi-page project — what "Upload JSON" accepts)

```jsonc
{
  "name": "Marketing site",
  "description": "Optional.",
  "icon": "rocket_launch",          // optional Material Symbol
  "theme": "kong",                  // optional project-scoped theme key
  "pages": [
    {
      "id": "home",                  // optional key; used only to wire parentId
      "title": "Home",
      "icon": "home",                // optional
      "description": "Optional.",
      "parentId": null,              // optional; another page's id → nests it (max depth 3)
      "definition": { /* a full page definition object, shape A above */ }
    },
    { "id": "about", "title": "About", "parentId": "home", "definition": { /* … */ } }
  ]
}
```

- The uploader also accepts a **bare page definition** (shape A) and wraps it as a one-page project.
- `definition` may be the object (preferred) or a JSON string. Omit it for a blank page.
- A page's **level** (1–3) is derived from the `parentId` chain; it auto-generates a TopHeader nav.
- `theme` applies only to this project's editor canvas and launched prototype pages. It does not change the a1-web app shell theme.

---

## 2. `ComponentNode`

One node = one A1 component instance.

```jsonc
{
  "id": "hero-title",                              // required, unique in the definition
  "type": "Heading",                                // required, exact A1 component name
  "props": { "as": "h1", "size": { "xs": "lg", "md": "xl" } },
  "utilities": { "maxWidth": "lg", "marginBlock": "24" },
  "content": { "fallback": "Build pages from JSON", "textKey": "home.hero.title" },
  "a11y": { "labelledBy": "hero-title" },
  "actions": { "onClick": { "type": "navigate", "target": "/about" } },
  "children": [ /* ComponentNode[] */ ]
}
```

| Field | Required | Notes |
|-------|:--------:|-------|
| `id` | ✓ | Unique, stable. |
| `type` | ✓ | Exact PascalCase A1 name from the registry (§4). Unknown → safe visible fallback. |
| `props` | — | Forwarded verbatim to the component — **must be real props** (§4/§5). |
| `utilities` | — | Tokenized utility selections, validated by component type. Current keys: `padding`, `paddingBlock`, `paddingInline`, `margin`, `marginBlock`, `marginInline`, `gap`, `maxWidth`, `minWidth`. Use this instead of raw `className` for utility classes; e.g. `IconButton` rejects min/max width but `Button` can accept it. |
| `content` | — | Primary text: `{ fallback (required), textKey? }`. Resolved via labels; `fallback` always shown if no label. |
| `a11y` | — | `{ label→aria-label, labelledBy→aria-labelledby, describedBy→aria-describedby, role }`. |
| `actions` | — | Declared, **not executed yet** (`navigate`/`openDialog`/`appAction`/`submitForm`/`externalLink` + `target`). Keep shape stable. |
| `children` | — | Nested nodes; rendered after `content`. Only meaningful on container types (§4). |

A few components take their text via a **named prop**, not `content`: **Fieldset** uses `props.legend`. Everything else uses `content.fallback`.

---

## 3. Rules (non-negotiable)

1. **A1 components only.** Every `type` is a registered A1 component. Never use HTML tags (`div`, `p`, `span`) as a `type`.
2. **Exact names.** `type` matches the exported component name exactly (PascalCase): `Heading`, `MessageBadge`, `TextField`. Don't lowercase/alias.
3. **Real props only.** Unknown prop keys leak to the DOM and warn. Use the props in §4/§5.
4. **Utilities use `utilities`, not fake props.** One-off tokenized width/spacing adjustments go in `utilities`; do not emit raw `className` utility strings unless you are preserving an existing class.
5. **Tokens, not raw values.** Use the scale values (`gap: "md"`, `size: "lg"`, `color: "muted"`) — never raw px/hex/rem in props. There is no `style` escape hatch in the definition.
6. **Semantic structure.** A heading is a `Heading`, an action is a `Button`, navigation is a `Link`. Pick the component by meaning, not looks.
7. **Never uppercase.** Author text in sentence case ("Create account"). Never ALL-CAPS content.
8. **Layout via layout components.** Use `Section`/`Stack`/`Grid`/`Card`, not ad-hoc wrappers. Put width/padding/gap on `Section` (see §5).
9. **Accessibility.** Icon-only buttons need `props["aria-label"]` (or `a11y.label`). Label form regions; don't rely on color alone.
10. **One primary action per area.** Only one `Button variant="primary"` per form/dialog/group.

### Consistency rules (projects & layout) — these keep generated pages coherent

11. **No per-page nav in a project.** A **project bundle** auto-generates the `TopHeader` from the page hierarchy. **Do not** add a `TopHeader` node to a project's pages — it duplicates the generated header. (A single standalone page may include one.)
12. **Section padding is consistent and non-zero.** Every primary (top-level) `Section` should have **non-zero `padding`** (don't leave it off or `none`), and **neighboring top-level sections should use the same `padding`** so the page has an even rhythm. Vary `surface`/`gap` for contrast, not padding.
12. **Primary sections set a `contentWidth`.** A `Section` used as a page's outer element should almost always set `contentWidth` (e.g. `lg`/`xl`/`2xl`) so content doesn't span the full viewport. Use the same `contentWidth` for sibling sections that should align.
13. **Cards live in a Grid.** Two or more sibling `Card`s should be wrapped in a `Grid` (e.g. `columns: { xs: 1, md: 3 }`), not loose in a `Stack`/`Section`.
14. **Card images use a valid, consistent `aspectRatio`.** A `Figure` inside a `Card` should set `aspectRatio` to one of the **token values** — `"16:9" "4:3" "3:2" "1:1" "2:3" "3:4" "9:16" "21:9"` (note the colon, **not** `"4 / 3"`) — and all cards in a grid should use the **same** ratio.

---

## 4. Component registry — type · container · role · key props

`C` = container (accepts `children`). Sizes/values are defined in §5. Props listed are the common ones; see `components.md` for the full set.

### Layout & display
| type | C | role | key props |
|------|:-:|------|-----------|
| `PageLayout` | C | App-shell layout (top of `page.layout`). **Does not** take width/padding/gap — put those on `Section`. | (slots managed by layout) |
| `Section` | C | Page region: surface, padding, width, gap, border, alignment, background image. | `padding` (none–xl), `gap` (xs–xxl), `contentWidth` (xs–2xl), `surface` (page/panel/raised), `align` (none/start/center/end), `inverse` (bool), `gradient`, `height` (auto/screen/hero), `as`, `borderSize`/`borderStyle`/`borderVariant`/`borderSides`, `radius`, `backgroundImage` (URL, decorative; suppresses `gradient`), `backgroundFit` (cover/contain/tile), `backgroundPosition` (9 focal points), `backgroundOverlay` (darken/lighten — always add one under text; pair darken with `inverse`), `backgroundOverlayStrength` (sm/md/lg) |
| `Stack` | C | Linear layout. | `direction` (column/row, responsive), `gap` (xs–xxl), `align`, `justify`, `wrap` (bool), `as` |
| `Grid` | C | Multi-column grid. | `columns` (number or `{xs,md,…}`), `gap`, `rowGap`, `columnGap` |
| `GridItem` | C | Direct child of `Grid` for column/row spanning. | `span` (number/`full`/responsive), `rowSpan` (number/responsive) |
| `Cluster` | C | Wrapping row of items (deprecated — prefer `Stack direction="row" wrap`). | `gap`, `align`, `justify` |
| `Card` | C | Bounded, repeatable content unit. | `variant` (default/navigation), `href` (navigation), `icon`, `heroIcon`, `iconDisplay` |
| `Bleed` | C | Reach past surrounding inset padding. | `space` (spacing number) |
| `Inset` | C | Uniform padding around content. | `space` (spacing number) |
| `Spacer` | — | Fixed gap. | `size` (xs–xxl) |
| `ButtonContainer` | C | Responsive row of action buttons. | `align` (start/center/end), `fillButtons` (bool) |
| `Slot` | C | Constrained "blank area" (pattern authoring). | `label`, `allow` (type[]), `allowPatterns` (id[]), `min`, `max`, `columns`, `gap` |
| `Outlet` | C | Shared project-layout insertion point for page content. | `name` |
| `Divider` | — | Visual separator. | `orientation`, `variant` (subtle/strong/accent), `lineStyle` (solid/dashed/dotted), `size`, `space` |
| `Figure` | — | Image with optional caption. | `src` (req), `alt`, `caption`, `radius`, `size` (3xs–xxl), `align`, `aspectRatio` (**colon form**: `16:9`/`4:3`/`3:2`/`1:1`/`2:3`/`3:4`/`9:16`/`21:9`), `crop` |
| `Icon` | — | Material Symbol. | `name` (req — see §5 icons), `size` (xs–xl/jumbo), `color`, `fill` (bool) |

### Typography (text via `content.fallback`)
| type | C | role | key props |
|------|:-:|------|-----------|
| `Heading` | — | Heading. | `as` (h1–h6/p/span), `type` (heading/display), `size` (xs–xxl; display adds jumbo/xJumbo), `color`, `align` |
| `Paragraph` | — | Body text. | `size` (xs–xl), `color` (default/muted/…), `align` |
| `Blockquote` | — | Quotation. | `variant` (border/feature), `cite` |
| `Code` | — | Code. | `variant` (inline/block), `wrapping` (bool), `copyCode` (bool) |
| `List` | C | List (children are `ListItem`). | `as` (ul/ol), `variant` (unordered/ordered/icon), `size`, `icon` (icon variant) |
| `ListItem` | — | List item (only inside `List`). | `icon` |

### Actions & controls
| type | C | role | key props |
|------|:-:|------|-----------|
| `Button` | — | Action. | `variant` (primary/secondary/tertiary/destructive/success), `size` (sm/md/lg), `icon`, `iconPosition` (start/end), `fullWidth` (bool), `loading` (bool), `disabled` (bool), `as` (button/a) + `href` |
| `Link` | — | Navigation. text via `content`. | `href`, `external` (bool), `size` |
| `IconButton` | — | Icon-only action. **needs `aria-label`.** | `icon` (req), `aria-label` (req), `variant`, `size` (sm/md/lg), `as`/`href` |
| `Switch` | — | On/off toggle. | `label`, `checked` (bool), `size` |
| `SegmentedControl` | — | Compact single-select. | `options` (`{value,label}[]`), `value`, `size` |
| `Slider` | — | Range / detent slider. | `label`, `value`, `min`, `max`, `step`, `detents`, `size`, `variant` |
| `Toolbar` | C | Compact control bar. | `label`, `aria-label`, `overlay`, `fullWidth` |
| `Tabs` | C | Tabbed nav / stepper. | `variant` (line/pills/segment/progress/folder), `value`; panel content goes on matching `items[].children` |
| `Accordion` | C | Disclosure. | `label`, `subtext`, `divider` (bool), `defaultOpen` (bool), `size` |
| `StickyActions` | C | Fixed bottom action bar (nest a `ButtonContainer`). | `contentWidth` |

### Inputs (label via `props.label`; no `placeholder` by design)
| type | C | role | key props |
|------|:-:|------|-----------|
| `TextField` | — | Text/email/password. | `label`, `type` (text/email/password), `value`, `hint`, `error`, `success`, `required`, `disabled`, `readOnly`, `size` (compact/default/comfortable), `labelPosition` (above/before), `autoComplete` |
| `TextareaField` | — | Multiline. | `label`, `value`, `rows`, + field-family props |
| `SelectField` | — | Select. | `label`, `options` (`{value,label}[]`), `value`; Figma preview uses `showValue: true` + `defaultValue`, + field-family props |
| `NumberField` | — | Number. | `label`, `prefix`, `unit`, + field-family props |
| `DateField` `TimeField` `PhoneField` `ZipField` `CreditCardField` | — | Masked fields. | `label`, `value`, + field-family props |
| `Fieldset` | C | Group of fields. **legend via `props.legend`.** | `legend`, `labelPosition` |
| `FieldRow` | C | Lay out fields in equal columns. | (children only) |
| `CheckboxGroup` `RadioGroup` | — | Multi/single choice. | `label`, `options` (`{value,label}[]`), `value`, `columns`, `size` |
| `ChoiceGroup` | — | Tile selector. | `options`/`sections`, `value`, `multiple` (bool), `columns`, `size`, `inlineIcon` |

### Feedback & messaging
| type | C | role | key props |
|------|:-:|------|-----------|
| `Banner` | C | In-page / system alert. | `status` (neutral/info/success/warn/error), `variant` (inline/system), `title`, `icon`, `onDismiss` |
| `MessageBadge` | — | Status/label badge. text via `content`. | `status` (neutral/info/success/warn/error), `subtle` (bool), `size`, `icon` |
| `MessageEmptyState` | — | Empty state. | `scale` (page/section/card), `icon`, `title`, `description`, `action` |
| `StatusBar` | — | Progress bar. | `value`, `max`, `size`, `label`, `labelPosition`, `indeterminate` |
| `CircularProgress` | — | Ring progress. | `value`, `max`, `size`, `indeterminate`, `aria-label` |
| `StepTracker` | — | Step position indicator. | `steps`, `current`, `align` |

### Navigation & data
| type | C | role | key props |
|------|:-:|------|-----------|
| `Breadcrumb` | — | Breadcrumb trail. | `items` (`{label,href?}[]`) |
| `TopHeader` | — | Top nav bar. | `logo`, `navItems`, `navIconPosition` |
| `BottomDrawer` | — | Bottom nav (≤5). | `items` (`{id,label,icon,href?}[]`), `aria-label` (req) |
| `PageNav` | — | In-page section nav. | `label`, `sections` (`{id,label,level}[]`) |
| `TreeMenu` | — | Hierarchical tree. | `items`, `variant` (`expanded`/`collapsed`), `selectedId`, `showExpandControls` |
| `Pagination` | — | Pager. | `page`, `pageCount`, `onPageChange` |
| `DefinitionList` | — | Label/value pairs. | `items` (`{label,value}[]`; `label` is required and renders the term; do not use `term`), `direction` (row/column), `size`, `labelWidth` |
| `DataTable` | — | Table. | `columns` (`{key,label}[]`), `rows` (objects keyed by each column `key`, include a unique `id`), `size` (**`comfortable`/`default`/`compact`** — not sm/md/lg; omit for auto), `notices` |
| `Calendar` | — | Calendar (experimental). | `variant`, `initialMonth`, `selectable` |

> **Note:** `TopHeader`, `BottomDrawer`, `PageNav`, `TreeMenu`, `DataTable`, `Tabs`, `Toolbar`, `Slider`, `Calendar`, `Pagination` take structured array/object props — generate them sparingly and follow the prop shapes in `components.md` if used.

---

## 5. Shared value vocabularies

- **Spacing / gap** (`gap`, `padding`, `space`, `Spacer.size`): `none`, `xs`, `sm`, `md`, `lg`, `xl`, `xxl`. (Numeric spacing for `Inset`/`Bleed`/`Divider.space`: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64`.)
- **Section `contentWidth`**: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`.
- **Heading/Figure `size`**: `xs, sm, md, lg, xl, xxl` (Heading `type="display"` adds `jumbo`, `xJumbo`; Figure adds `3xs, 2xs, …`). Paragraph `size`: `xs–xl`.
- **Field-family `size`**: `compact`, `default`, `comfortable`. Most other components: `sm`, `md`, `lg`.
- **`color`** (text/icon): `default`, `muted`, `accent`, `inverse`, `success`, `error`, `warn`, `info`.
- **`status`** (Banner/MessageBadge/etc.): `neutral`, `info`, `success`, `warn`, `error`.
- **Section `surface`**: `page`, `panel`, `raised`, `card`. **`align`**: `none`, `start`, `center`, `end`.
- **Section background image**: `backgroundFit`: `cover` (default), `contain`, `tile`. `backgroundPosition`: `center` (default), `top`, `bottom`, `left`, `right`, `top-left`, `top-right`, `bottom-left`, `bottom-right`. `backgroundOverlay`: `darken`, `lighten` (`backgroundOverlayStrength`: `sm`, `md` default, `lg`). A section with text over a `backgroundImage` must set a `backgroundOverlay` — `darken` + `inverse: true` for light text, `lighten` for dark text.
- **Button `variant`**: `primary`, `secondary`, `tertiary`, `destructive`, `success`. **`size`**: `sm`, `md`, `lg`.
- **Responsive**: any prop may take a breakpoint object using `xs, sm, md, lg, xl`, e.g. `"columns": { "xs": 1, "md": 3 }`, `"direction": { "xs": "column", "md": "row" }`.
- **Icons** (`Icon.name`, `*.icon`): use Material Symbols Outlined names (snake_case), e.g. `home`, `add`, `search`, `settings`, `arrow_forward`, `check_circle`, `download`, `rocket_launch`. Project definitions may also use `custom:<snake_case_name>` when that custom icon is registered for the project.

---

## 6. Worked examples

### Single page (hero + a 2-up card row)
```jsonc
{
  "schemaVersion": "0.1.0",
  "page": {
    "id": "home", "name": "Home",
    "layout": { "type": "PageLayout", "regions": [ { "id": "main", "nodes": [
      { "id": "hero", "type": "Section",
        "props": { "padding": "xl", "contentWidth": "lg", "gap": "md", "align": "center" },
        "children": [
          { "id": "hero-eyebrow", "type": "Paragraph", "props": { "size": "sm", "color": "muted" }, "content": { "fallback": "A1 Design System" } },
          { "id": "hero-title", "type": "Heading", "props": { "as": "h1", "type": "display", "size": { "xs": "lg", "md": "xl" } }, "content": { "fallback": "Build pages from structured JSON" } },
          { "id": "hero-body", "type": "Paragraph", "props": { "size": "lg", "color": "muted" }, "content": { "fallback": "Describe the page as data; A1 renders the components." } },
          { "id": "hero-cta", "type": "ButtonContainer", "props": { "align": "center" },
            "children": [
              { "id": "hero-primary", "type": "Button", "props": { "variant": "primary", "icon": "rocket_launch" }, "content": { "fallback": "Get started" } },
              { "id": "hero-secondary", "type": "Button", "props": { "variant": "secondary" }, "content": { "fallback": "Learn more" } }
            ] }
        ] },
      { "id": "features", "type": "Section", "props": { "padding": "xl", "contentWidth": "lg", "gap": "lg" },
        "children": [
          { "id": "features-title", "type": "Heading", "props": { "as": "h2", "size": "lg", "align": "center" }, "content": { "fallback": "Built for teams" } },
          { "id": "features-grid", "type": "Grid", "props": { "columns": { "xs": 1, "md": 2 }, "gap": "md" },
            "children": [
              { "id": "card-1", "type": "Card", "props": { "icon": "bolt" }, "children": [
                { "id": "card-1-h", "type": "Heading", "props": { "as": "h3", "size": "sm" }, "content": { "fallback": "Fast by default" } },
                { "id": "card-1-p", "type": "Paragraph", "props": { "size": "sm", "color": "muted" }, "content": { "fallback": "Performant out of the box." } }
              ] },
              { "id": "card-2", "type": "Card", "props": { "icon": "shield" }, "children": [
                { "id": "card-2-h", "type": "Heading", "props": { "as": "h3", "size": "sm" }, "content": { "fallback": "Accessible" } },
                { "id": "card-2-p", "type": "Paragraph", "props": { "size": "sm", "color": "muted" }, "content": { "fallback": "WCAG-minded components." } }
              ] }
            ] }
        ] }
    ] } ] }
  }
}
```

### Project bundle (paste into Projects → Upload JSON)
```jsonc
{
  "name": "Starter site", "icon": "rocket_launch",
  "pages": [
    { "id": "home", "title": "Home", "icon": "home", "definition": { /* a page definition like above */ } },
    { "id": "about", "title": "About", "parentId": "home", "definition": {
      "schemaVersion": "0.1.0",
      "page": { "id": "about", "name": "About", "layout": { "type": "PageLayout", "regions": [ { "id": "main", "nodes": [
        { "id": "s", "type": "Section", "props": { "padding": "xl", "contentWidth": "md", "gap": "md" }, "children": [
          { "id": "h", "type": "Heading", "props": { "as": "h1", "size": "xl" }, "content": { "fallback": "About us" } },
          { "id": "p", "type": "Paragraph", "content": { "fallback": "A nested page (level 2 under Home)." } }
        ] }
      ] } ] } }
    } }
  ]
}
```

---

## 7. Do / Don't

- **Do** give every node a unique `id`; put all text in `content.fallback`; put width/padding/gap on `Section`, not `PageLayout`.
- **Do** use responsive objects for breakpoint changes; use only registry component names; use scale values for every prop.
- **Don't** use HTML tag names as `type`; pass props a component doesn't have; raw px/hex/rem in props; ALL-CAPS text; icon-only `IconButton` without `aria-label`.
- **Don't** nest a `Section` inside another layout to constrain it; don't nest `Card` in `Card`; don't put interactive controls inside a `Card variant="navigation"`.

> Unknown component types and unknown props won't crash — unknown `type` renders a labeled fallback. But both are bugs to fix, not features.
