# A1 Page-Definition JSON Standard

This is the canonical, AI-readable standard for the **A1 page-definition feed** — the structured JSON/TypeScript format that describes a page as data and is rendered into real A1 React components.

Read this before authoring, editing, importing, or generating any page definition, or before changing the renderer, registry, or types that back it.

- **Reference implementation:** `apps/a1-web/src/editor/` (types, registry, renderer, example) surfaced on the a1-web **Editor** page (`/?page=editor`).
- **Status:** Proof of concept (`schemaVersion: "0.1.0"`). This is the foundation for a future site builder where the JSON page definition is the source of truth (visual editing, JSON editing, code import/export, wired actions).

---

## Core principles

1. **The JSON definition is the source of truth.** The rendered page and any generated code are derived from it — never the other way around. Do not hardcode rendered content in a component when it belongs in the definition.
2. **Layout-first.** A definition starts from structure (layout → regions → nodes), not from content. Content hangs off the structure.
3. **A1 components only.** Every node maps to a registered A1 component. Arbitrary HTML elements (`div`, `p`, `span`, …) are not allowed as node types. `CustomBlock` is the deliberate, isolated escape hatch described below.
4. **Names are a locked contract.** Component `type` values match the exported A1 React component names **exactly** (PascalCase). Do not normalise, alias, or lowercase them.
5. **Fail safe.** An unknown/unregistered `type` renders a visible fallback that names the offending type — it never throws and never silently drops content.
6. **Props must be real.** A node's `props` are passed straight through to the A1 component, so they must be valid props for that component (see "Props rules").
7. **Utilities are separate from props.** Tokenized utility classes live in `utilities`, not `props.className`, and are applied only when the selected component type accepts that utility family.

---

## Top-level shape

```jsonc
{
  "schemaVersion": "0.1.0",
  "page": {
    "id": "editor-example-page",
    "name": "Editor Example Page",
    "description": "A simple page generated from an A1 page definition.",
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

## Project bundle shape

The Projects uploader also accepts a multi-page bundle:

```jsonc
{
  "name": "Marketing site",
  "description": "Optional.",
  "icon": "rocket_launch",
  "theme": "kong",
  "pages": [
    { "id": "home", "title": "Home", "parentId": null, "definition": { /* page definition */ } }
  ]
}
```

`theme` is optional project metadata. It scopes the selected theme to this project's editor canvas and launched prototype pages only; it must not be applied to the whole a1-web application shell.

| Field | Type | Required | Notes |
|-------|------|:--------:|-------|
| `schemaVersion` | string (semver) | ✓ | Version of this standard the definition targets. |
| `page.id` | string | ✓ | Stable page id. |
| `page.name` | string | ✓ | Display name. |
| `page.description` | string | — | Short purpose statement. |
| `page.layout` | `PageLayoutDefinition` | ✓ | The layout-first container. |

### `PageLayoutDefinition`

| Field | Type | Required | Notes |
|-------|------|:--------:|-------|
| `type` | `ComponentType` | ✓ | An A1 layout component, e.g. `"PageLayout"`. |
| `props` | object | — | Real props for that component. |
| `regions` | `PageRegion[]` | ✓ | Named areas holding node trees. |

### `PageRegion`

| Field | Type | Required | Notes |
|-------|------|:--------:|-------|
| `id` | string | ✓ | Stable id (React key). |
| `name` | string | — | Human/editor-facing label. |
| `nodes` | `ComponentNode[]` | ✓ | Ordered nodes rendered into the layout. |

---

## `ComponentNode`

The unit of the tree. One node = one A1 component instance.

```jsonc
{
  "id": "hero-title",
  "type": "Heading",
  "props": { "as": "h1", "id": "editor-hero-title", "type": "display", "size": { "xs": "lg", "md": "xl" } },
  "utilities": { "maxWidth": "lg", "marginBlock": "24" },
  "content": { "textKey": "editor.example.hero.title", "fallback": "Build pages from structured JSON" },
  "a11y": { "labelledBy": "editor-hero-title" },
  "actions": { "onClick": { "type": "navigate", "target": "/components" } },
  "children": [ /* ComponentNode[] */ ]
}
```

| Field | Type | Required | Notes |
|-------|------|:--------:|-------|
| `id` | string | ✓ | Stable id — React key and future editor selection handle. Unique within the definition. |
| `type` | `ComponentType` | ✓ | Registered A1 component name (exact). |
| `props` | object | — | Forwarded verbatim to the component. Must be valid props. |
| `utilities` | object | — | Tokenized utility selections, validated by component type. Current keys: `padding`, `paddingBlock`, `paddingInline`, `margin`, `marginBlock`, `marginInline`, `gap`, `maxWidth`, `minWidth`. |
| `content` | `ContentDefinition` | — | Primary text (resolved via labels). |
| `a11y` | `A11yDefinition` | — | Mapped to ARIA attributes. |
| `actions` | `ActionMap` | — | Declared now, **not executed yet**. |
| `responsive` | object | — | Reserved. A1 props already accept responsive objects inline, so prefer responsive values inside `props`. |
| `children` | `ComponentNode[]` | — | Nested nodes. Rendered after `content`. |

---

## Component registry (locked names, code-owned membership)

The renderer can instantiate only the component names declared by `ComponentType`
in `pageTypes.ts` and mapped in `componentRegistry.ts`. The names are a locked JSON
contract, but the membership is not frozen at the original proof-of-concept set.

**The two code files are authoritative.** This table is a human-readable snapshot of
the current registered types; if it differs from either code file, follow the code
and update this document in the same change.

| Group | Registered `type` values |
|-------|--------------------------|
| Layout | `PageLayout`, `Section`, `Stack`, `Grid`, `GridItem`, `Cluster`, `Card`, `Bleed`, `Inset`, `Spacer`, `ButtonContainer` |
| Typography and media | `Heading`, `Paragraph`, `Blockquote`, `Code`, `Divider`, `List`, `ListItem`, `Avatar`, `Icon`, `Figure` |
| Actions and controls | `Link`, `Button`, `IconButton`, `Switch`, `SegmentedControl`, `Slider`, `Toolbar`, `Tabs`, `StickyActions`, `Accordion` |
| Feedback | `Banner`, `MessageBadge`, `MessageEmptyState`, `StatusBar`, `CircularProgress`, `StepTracker` |
| Form inputs | `TextField`, `TextareaField`, `SelectField`, `NumberField`, `DateField`, `TimeField`, `PhoneField`, `ZipField`, `CreditCardField`, `Fieldset`, `FieldRow`, `CheckboxGroup`, `RadioGroup`, `ChoiceGroup` |
| Data and navigation | `DefinitionList`, `Pagination`, `Calendar`, `Breadcrumb`, `TopHeader`, `BottomDrawer`, `PageNav`, `TreeMenu`, `DataTable` |
| Custom content | `CustomBlock` |
| Pattern and project composition | `Slot`, `Outlet` |

Most entries map directly to the exported A1 React component with the same name.
`Tabs`, `Toolbar`, `TreeMenu`, and `DataTable` use editor adapters that translate
serializable props into their compositional A1 APIs. `Slot` and `Outlet` are
editor-owned composition adapters. They are still registered types and should be
used instead of hand-rolled wrappers when their semantics fit.

For `Tabs`, put panel content on the matching tab item as `props.items[].children`
(an array of normal A1 component nodes). Older `props.panels[].children` shapes
also render, but `items[].children` is the preferred portable contract.

**To add a component:** add its name to `ComponentType` in `pageTypes.ts` **and**
register the real component or editor adapter in `componentRegistry.ts` (the
registry is typed `Record<ComponentType, …>`, so both must stay in sync). Update
this table and `a1-agent-brief.md` in the same change. Never register a raw HTML tag.

**Unknown types:** any `type` not in the registry renders `UnsupportedComponent` — a `role="alert"` block built from A1 components that names the offending type. This is by design; do not "fix" it by adding HTML fallbacks.

---

## Props rules

- `props` are spread onto the underlying A1 component, so **every key must be a real prop** of that component. Unknown keys leak onto the DOM and cause React warnings.
- Do not put utility classes in `props.className`. Use the node-level `utilities` field so the editor can prevent invalid combinations (for example, `IconButton` does not accept `minWidth` or `maxWidth`, while `Button` does).
- **Put layout intent on the component that owns it.** `PageLayout` is the app-shell wrapper and does **not** accept `contentWidth` / `padding` / `gap` — those belong on `Section` (which supports all three). A common mistake is putting page width/padding on the layout node; put them on a hero/content `Section` instead.
- **Constrain primary sections.** A `Section` used as a page's top-level outer
  element should almost always set `contentWidth` (commonly `lg`, `xl`, or `2xl`)
  so its content does not span the full viewport on wide screens. Use the same
  value on sibling sections whose content should align. Omit it only when
  edge-to-edge inner content is intentional, such as a full-width visualization
  or other immersive surface; a full-width section background does not require
  full-width content.
- Responsive values use A1's inline object syntax directly in `props`, e.g. `"size": { "xs": "lg", "md": "xl" }` or `"direction": { "xs": "column", "md": "row" }`.
- `Heading` has its own `type` prop (`"heading"` | `"display"`). This is independent of the node's `type` field — `node.type` selects the component; `node.props.type` configures it.
- Use `Grid` for multi-column layouts and repeated card collections. Use `Stack`
  for one-dimensional flow, alignment, and wrapping. Do not recreate grid behavior
  with rows of nested `Stack`s when `Grid` expresses the structure directly.
- Use `GridItem` only as a direct child of `Grid` when an item needs placement
  metadata such as `span` or `rowSpan`. Put the real content component inside
  the `GridItem`:

```jsonc
{
  "type": "Grid",
  "props": { "columns": { "xs": 1, "md": 2, "xl": 4 }, "gap": "lg" },
  "children": [
    {
      "type": "GridItem",
      "props": { "span": { "xs": "full", "md": 2 } },
      "children": [{ "type": "Card", "children": [] }]
    }
  ]
}
```

### Structured prop shapes

Some registered components receive serializable item arrays rather than child
component nodes. Follow the component's public type and the editor's saved shape;
do not infer keys from the rendered HTML semantics.

`DefinitionList.props.items` uses `label`, not `term`:

```jsonc
{
  "type": "DefinitionList",
  "props": {
    "items": [
      { "label": "Account ID", "value": "A1-849204" },
      { "label": "Plan", "value": "Enterprise" }
    ]
  }
}
```

The canonical page-definition item shape is:

```ts
{
  id?: string | number;
  label: string; // required; rendered in <dt>
  value?: string | number; // rendered in <dd>
  copyValue?: boolean;
  copyText?: string;
  copyLabel?: string;
  copiedLabel?: string;
  valueHeadingProps?: object;
}
```

The React component also accepts `children` as an alternate value source, but
page-definition JSON should use `value`; the editor reads and writes `label` /
`value`. A `term` key is unsupported and would leave the `<dt>` empty.

---

## Content and localization

Text lives in `content`, never inline in the renderer.

```jsonc
"content": { "textKey": "editor.example.hero.title", "fallback": "Build pages from structured JSON" }
```

| Field | Type | Required | Notes |
|-------|------|:--------:|-------|
| `textKey` | string | — | Localization key resolved via the A1 `useLabel` helper. |
| `fallback` | string | ✓ | Literal text shown when `textKey` is absent or unregistered. |
| `inlineLinks` | `InlineLinkDefinition[]` | — | Optional non-overlapping `{ start, end, props? }` UTF-16 ranges. The renderer wraps each range in an A1 `Link` inside Heading or Paragraph text. |

- The renderer resolves `textKey` through **`useLabel`** (the existing A1 labels system). If the key is registered (and a locale is active) the localized value is used; otherwise it returns `fallback`.
- `fallback` is always required so a node renders meaningful text even with no labels registered.
- A node with `content` and `children` renders `content` first, then `children`.
- Inline Links retain the complete literal fallback for localization and plain-text
  consumers. Their `start`/`end` offsets refer to that fallback string; the
  optional `props` are forwarded only to the inline A1 Link.
- Text required by a structured prop API, such as a `DefinitionList` item's
  `label` and `value`, remains inside that prop object rather than becoming
  separate component nodes.

---

## Accessibility (`a11y`)

Maps to ARIA attributes on the rendered component. Set only when the semantic defaults are not enough.

| Field | Maps to |
|-------|---------|
| `label` | `aria-label` |
| `labelledBy` | `aria-labelledby` |
| `describedBy` | `aria-describedby` |
| `role` | `role` |

Pattern: give a heading node `props.id` and point its section's `a11y.labelledBy` at that id to label the region.

---

## Actions (declared, not wired)

`actions` describes intended behaviour. The current renderer **ignores it** (see the `TODO(actions)` in `pageRenderer.tsx`) — interactive components render inert. Keep the shape stable so behaviour can be wired later without changing definitions.

```jsonc
"actions": { "onClick": { "type": "navigate", "target": "/components" } }
```

| Action `type` | Meaning | `target` |
|---------------|---------|----------|
| `navigate` | Go to an in-app page | route |
| `openDialog` | Open a dialog | dialog id |
| `appAction` | Trigger a named app-level action | action name |
| `submitForm` | Submit a form | form id |
| `externalLink` | Open an external URL | url |

Optional `params` (object) carries extra data for the future handler.

---

## Canonical example structure

```
PageLayout
└─ region "main"
   ├─ Section (hero)       → Stack → Heading + Paragraph + Button
   └─ Section (two cards)  → Heading + Grid → Card + Card
```

See `apps/a1-web/src/editor/examples/editorExamplePage.ts` for the full, current example.

---

## Rules for agents

- **Do** keep `type` names matching exported A1 component names exactly.
- **Do** give every node a unique, stable `id`.
- **Do** put all text in `content` with a `fallback`; resolve via `useLabel`.
- **Do** use a component's semantic color prop in JSON (for example,
  `Paragraph.props.color: "muted"` for the A1 `text/muted` token); never store
  resolved hex values in a page definition.
- **Do** put layout/width/padding/gap on `Section`, not `PageLayout`.
- **Do** check `pageTypes.ts` and `componentRegistry.ts` before building a
  workaround; components such as `Grid`, `Figure`, `DefinitionList`, `Pagination`,
  `Accordion`, `MessageBadge`, and the field family are already registered.
- **Do** use only registered components; extend the registry deliberately (and update `ComponentType`).
- **Don't** use HTML tag names (`div`, `p`, `span`) as `type`.
- **Don't** pass props a component doesn't support.
- **Don't** rename or restructure `PageDefinition` / `ComponentType` / field names without treating it as a breaking contract change (bump `schemaVersion`, update all consumers and this doc).
- **Don't** execute `actions` until the renderer's action layer is built.

---

## File map

| File | Role |
|------|------|
| `apps/a1-web/src/editor/pageTypes.ts` | The TypeScript contract (all exported types). |
| `apps/a1-web/src/editor/componentRegistry.ts` | The only renderable components. |
| `apps/a1-web/src/editor/pageRenderer.tsx` | Maps nodes → A1 components; text resolution; safe fallback. |
| `apps/a1-web/src/editor/examples/editorExamplePage.ts` | Canonical example definition. |
| `apps/a1-web/src/pages/EditorPage.tsx` | Editor page: tabbed live preview + strict JSON. |

## Versioning

`schemaVersion` is semver. Additive, backward-compatible fields → minor bump. Renames, removals, or shape changes to existing fields → major bump, and update this standard plus every consumer in the same change.

## Custom block — A1-2541

`CustomBlock` is a React component and a leaf node in page-definition JSON.
Use it only for a small region that registered A1 components and props cannot
express, such as an unusual positioned annotation or a specialized local
interaction. Explain the model gap in the handoff. Prefer improving a reusable
A1 component when the need is common. Do not rebuild ordinary sections, grids,
headings, buttons, forms or navigation with custom markup.

```json
{
  "id": "positioned-annotation",
  "type": "CustomBlock",
  "props": {
    "title": "Positioned annotation",
    "height": "sm",
    "markup": "<p class=\"a1-annotation\">Annotation within this block</p>",
    "css": ".a1-annotation { position: absolute; inset-inline-end: var(--semantic-spacing-gap-md); inset-block-end: var(--semantic-spacing-gap-md); color: var(--semantic-color-text-accent); }",
    "js": ""
  }
}
```

The five props are `title`, `markup`, `css`, `js` and `height`. Source strings
start empty and stay literal: `markup`, `css` and `js` do not interpolate
`{{ dataset.column }}` bindings. A missing or blank title uses the localized Custom block label;
provide a meaningful title for finished content. Height is `sm`, `md` (default)
or `lg`, backed by `component.customBlock.height.*` tokens (192, 384 and 576 px).
The frame fills its container's width, and overflow scrolls inside the frame.
Media queries use the block viewport, not the outer page viewport. Custom
blocks do not accept A1 child nodes or `content`; text belongs in the authored
markup and authors own its localization.

CSS is confined to a sandboxed iframe. Absolute and fixed positioning stay
inside that frame. The block copies computed A1 base, semantic and component
token variables from its actual parent scope, including project themes and
inverse scopes. It also copies body text defaults, direction and language.
It does not copy component stylesheets or host web fonts. Reference token
variables in custom CSS and use semantic HTML; a class such as `a1-button`
does not instantiate the A1 Button. Custom source is the explicit exception
to the JSON model's prohibition on arbitrary markup and CSS, only inside
these source props. There is no host-page style or script injection.

JavaScript runs after markup in an opaque-origin `sandbox="allow-scripts"`
frame. It can manipulate its own document. Parent DOM access, host storage,
fetch, external scripts/styles/fonts, popups and form submission are blocked.
Images and embedded fonts may use data URLs. Scripts in the markup fragment
are inert; put code in `js` and bind native events there. This is a browser
sandbox, not a CPU/time limit or a guarantee that author code is accessible.
Browser consoles report script errors. The host Content Security Policy must
permit the inline script/style bootstrap; a stricter inherited policy can block
the frame. A frame can navigate itself; it cannot
navigate the parent. No host message bridge is installed.

Changing source, text defaults or theme tokens reloads the document and resets
local script state. Every block has a separate document. In editor mode the
frame is inert so pointer and keyboard actions select the block; use the
component preview or launched page to interact with its contents.

Author semantic controls, accessible names, focus indicators, keyboard behavior,
contrast, responsive overflow and reduced-motion handling inside the frame.
Isolation does not repair inaccessible HTML. Avoid scripts for static content.
Review each authored block across themes, breakpoints and assistive technology.

The component is currently React-only. Pure CSS cannot reproduce its document
and script lifecycle; Native would need an explicit WebView contract. Neither
package claims support. Figma translation is also outside this contract.

### A1-2541 standards review — Sept. 24, 2026

| Area | Decision and evidence |
|------|-----------------------|
| Custom styling | The shared component adds only an iframe viewport, tokenized border/radius/text defaults, full-width sizing, overflow containment and editor pointer suppression. The frame reset uses zero margins, border-box sizing, relative positioning and a full-height body so absolute positioning has a stable containing block. Layout components cannot supply document isolation. No application-specific stylesheet or layout patch was added. |
| Component use | The configurator reuses Stack, TextField, TextareaField, Choice/Toolbar, Lockable, WithHelp and Code. One shared CustomBlock renderer and one shared Controls implementation serve component pages and project/pattern editing. No parallel custom controls were introduced. |
| Tokens and values | Four new component tokens define sm/md/lg heights and border width. Heights are 192, 384 and 576 px; border width aliases base spacing 1. Radius, typography and colors use existing tokens. Structural 0, 100% and 100vh values are viewport/reset mechanics, not design scale additions. Copied computed tokens and body defaults cross the iframe boundary through CSSOM; they are not local host styling overrides. Raw probe colors exist only in tests to detect CSS leakage. |
| Accessibility | The iframe always has a localized or authored title and receives the host language/direction. Native iframe keyboard navigation is retained in preview, and the editor makes its content inert for selection. Custom authors remain responsible for semantic content, focus visibility, contrast, targets, motion and keyboard behavior. Focused Storybook axe, iframe-content axe, configurator axe and a keyboard enter/exit check passed. No assistive-technology manual audit was performed. |
| Interaction | Source edits reload only the block document. The empty block has no invented demo content. Existing height choices, Helper text toggle, pattern locks, editor selection, Add panel, JSON editor and history behavior are reused. No new dialog, notification or drag/drop pattern was introduced. |
| Content | Fifteen name, description, field, option and help labels live in system/labels/custom-block.json with English descriptions and es/fr/de/pt/ja/zh/ar translations. Resolver-backed catalog metadata covers the new entry across menu, overview, category, detail and Add panel. Source text is author-owned content, including its localization. |
| Data and state | Source is three ordinary JSON strings. They bypass dataset interpolation, preserving template syntax and preventing dataset values from becoming source code. Empty/null source is normalized safely, invalid height falls back to md, and blank title uses the localized label. Existing JSON errors and throttled history/storage remain the editing model. Script exceptions are reported by the browser console; there is no new error UI or host message channel. |
| Architecture | The only runtime additions are CustomBlock, its declarations/styles and a small document serializer. No dependency was added. The registry, catalog, selected-node bridge, JSX export, package exports, MCP index and agent contracts were updated together. The schema addition is backward compatible. Pure, Native and Figma do not claim runtime support. |
| Responsive behavior | The outer block fills available width and uses tokenized height presets. The inner document owns overflow and media queries; fixed/absolute content cannot cover the host. Core base/light, accessible and heritage configurations were exercised at xs/sm/md/lg/xl widths. Authors must validate their own markup at narrow widths and zoom. |
| Verification | Five browser tests cover isolation from host/siblings, sandbox access limits, literal source, local keyboard behavior, scoped tokens, dimensions, configurator/JSON editing, editor Add/selection/persistence and all supported locales. Package/type/RSC checks, token audit, the CSS/ESLint gate and three focused Storybook accessibility scans passed. The broad run passed four suites (responsive visibility, product tour, core-theme matrix and project sidebar navigation); its all-routes suite found missing/outdated screenshots. The new route has its own reviewed baseline. The final focused run passed all 10 tests, including that release-route check and the four shared suites. |
| Standards debt | The isolated-source exception and web-only coverage are documented and accepted for this feature. The new metadata keys make catalog labels localizable without migrating unrelated existing copy. The shared model should gain a normal A1 prop or component when a custom pattern becomes reusable. Sandbox boundaries and source ownership needed explicit agent guidance; that guidance is now part of this standard, the agent brief and published package guidelines. |
