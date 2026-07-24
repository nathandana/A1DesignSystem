# A1 ↔ Figma breakpoint synchronization

## Goal

Exchange responsive A1 page definitions with Figma without collapsing their
breakpoint-specific values into a single desktop layout. The A1 JSON model is
the source of truth for authored responsive values; Figma provides a visual,
per-breakpoint editing surface.

## Shared breakpoint contract

| A1 key | Viewport range | Figma mode / frame suffix |
| --- | --- | --- |
| `xs` | 0–480 px | `xs` |
| `sm` | 481–640 px | `sm` |
| `md` | 641–1024 px | `md` |
| `lg` | 1025–1440 px | `lg` |
| `xl` | 1441 px and above | `xl` |

Responsive JSON stays a sparse object, for example
`{ "xs": 1, "md": 2, "xl": 4 }`. Omitted values inherit the nearest
preceding breakpoint, exactly as they do in A1 today. Figma must preserve that
sparsity rather than serializing inherited values as authored overrides.

## Figma representation

1. A1:Figma creates a component/page root for each selected viewport, named
   `A1 · {project} / {page} · {breakpoint}`.
2. Every root stores the same A1 project, page, and stable node IDs, plus its
   `a1Breakpoint` shared plugin-data value.
3. The existing **Device** variable collection exposes the five breakpoint
   modes. Components continue to use semantic component/color variables; a
   breakpoint root chooses a device mode only when the component has a
   breakpoint-aware variable to bind.
4. Roots use representative device widths (`480`, `640`, `1024`, `1440`, and
   `1600` px). They are visual previews, not independent source documents.

## Supported responsive edits

The first sync release supports values that have a clear semantic A1 mapping:

- layout direction, wrapping, alignment, justification, gap, padding, and
  content width;
- Grid columns, child span, and row span;
- visibility and label-display choices;
- typography size and alignment; and
- component size/density where its A1 prop already accepts a responsive value.

Absolute coordinates, detached-instance overrides, arbitrary Figma constraints,
and generated interaction prototypes stay local to Figma. The bridge reports
these as unsupported instead of inventing JSON values.

## Sync algorithm

### A1 → Figma

1. Load the page definition and resolve each responsive prop at `xs` through
   `xl`.
2. Render or update all five linked breakpoint roots in one explicit user
   action.
3. Store the authored sparse responsive object on the linked root/node as
   bridge metadata. This allows a later export to distinguish inheritance from
   an explicit value equal to its predecessor.

### Figma → A1

1. Group selected or linked roots by their A1 project/page link.
2. Export every available breakpoint root and compare each supported property
   with the inherited prior value.
3. Emit an A1 responsive object only when one or more roots differ. Retain a
   scalar when all roots match.
4. Preview the resulting JSON diff and warnings before replacing the linked
   page. An accepted multi-breakpoint update is one bridge transaction.

## Conflict and safety rules

- The user chooses the sync direction; opening or selecting a page never
  overwrites either side.
- A missing breakpoint root means “leave that A1 breakpoint unchanged,” not
  “delete its value.”
- If the A1 page changed after the root was last synced, show a three-way
  conflict preview: A1 current, last synchronized value, and Figma proposal.
- Stable node IDs are required for granular updates. A renamed visual layer is
  allowed; an unlinked replacement is reported as a new node.
- Theme/color mode is independent from viewport breakpoint. Figma exports
  semantic color tokens and the selected light/dark mode separately.

## Delivery sequence

1. Add `sm` to the existing Figma Device collection if it is absent, then use
   `xs`–`xl` consistently in plugin metadata and page roots.
2. Add a Breakpoints selector to A1:Figma Page Editor with “render all” and
   “export linked breakpoints” actions.
3. Implement a supported-property diff/preview layer before enabling writeback.
4. Add bidirectional tests for sparse inheritance, scalar collapse, missing
   roots, concurrent edits, light/dark mode, and all five viewports.

Until steps 2–3 land, the current page bridge remains single-layout and must
not claim breakpoint-aware round-tripping.

## Current proof of concept

The A1:Figma plugin has a narrow responsive Grid POC for `Grid.props.columns`.
When JSON uses a sparse responsive object, such as
`{ "xs": 1, "md": 2, "xl": 4 }`, **Render on canvas** detects the authored
breakpoint keys — or the breakpoints selected in the plugin UI — and creates
one separate Figma root for each key (`xs`, `md`, and `xl` in this example).
Each root stores `a1Breakpoint` plugin metadata, uses the matching preview
width, and renders breakpoint-aware components against that active key. The
Playground tab also exposes a primary breakpoint selector plus actions to
create breakpoint roots from an existing design, sync the primary root to the
selected breakpoints, and export a responsive diff.

Grid frames store the full responsive columns object in plugin metadata.
Export responsive diff preserves that sparse object and writes changed Figma
Grid column counts back to the matching active breakpoint keys. Direct child
spans use the shared `GridItem` JSON wrapper (`props.span` / `props.rowSpan`);
Figma exports native `gridColumnSpan` / `gridRowSpan` into that wrapper and
imports scalar or sparse responsive span props into the active preview
breakpoint. Unsupported visual/layout differences are reported as warnings
instead of being serialized.

This is intentionally not the full multi-root breakpoint sync. It proves the
property-level contract for responsive columns while keeping the current
single-layout bridge honest.
