# Labs token styling and hierarchy

These are two independent experiments; neither edits the design system.
Both use the standard responsive configuration panel, without a device frame.

## Token styling

`/experiments/token-styling` styles the token reference itself, such as
`--semantic-color-surface-card`. Show **only the configured treatment**, not a
gallery of all treatments. Render the selected token directly on the workspace
without a surrounding Card. Options: Syntax highlighting (default), A1 code,
Soft pill, Outlined, Namespace emphasis, Swatch led, and Name and value.
The example selector covers actual color, typography, spacing, radius and shadow
tokens. All names stay intact, selectable and wrapping on narrow screens.

`TokenSpecimen` accepts `token`, `value`, `treatment`, `color`. It has no routing
or configuration dependencies. The A1 code baseline uses the actual Code
component. Other treatments use isolated `a1-token-label` CSS; this is the visual
subject, not an override of a shared control. Layout uses A1 components.

`tokenParts` preserves every character while identifying punctuation, level,
type, intermediate group and final name. Syntax colors use live A1 text roles:
muted punctuation, accent level, info type, warn group and success name. Color is
decorative; the text carries the complete reference. Swatches are aria-hidden and
only use actual color-token values. Non-color examples have a neutral marker.
Resolved values update through an observer of root theme/mode attributes.

No new visual tokens or animation. Existing spacing, radius, inline-code font,
semantic text colors and Card outline tokens supply all styling. Reduced motion
requires no extra treatment. Forced colors retains a system-colored outline.

## Token hierarchy

`/experiments/token-hierarchy` offers Linked cards, Nested tree, Breadcrumb trails
and Step by step. Only the chosen presentation is shown. Examples cover semantic
colors, component colors, dimensions, typography and duration.

The route is lazy-loaded along with the token definitions. `hierarchy-model.js`
indexes raw `system/tokens/**/*.json` `$value` definitions, retains source filenames,
traces references recursively, supports branching references and reports missing
references or cycles. It never uses generated resolved JSON as the relationship
source. CSS names convert dotted/camelCase paths to kebab-case.

This is explicitly an **authored-source trace**, not a reconstruction of the CSS
cascade or theme override chain. The UI states that distinction and separately
shows the selected token's active computed value, updating with theme/mode. A
source may therefore reach a light color while the active dark-mode value differs.
Do not silently imply that a source trace is the active theme's resolution chain.

A1 TreeMenu supplies keyboard expansion and node selection. Breadcrumb selection
shows a node's full definition. Trails run from the source value through its aliases
to the token being traced as the final item. Guided steps follow the flattened trace with
labeled position and disabled boundaries; branched trails remain separate in the
breadcrumb view. Selecting another token resets node/step/expansion state. No
custom hierarchy CSS or connectors are needed; explicit References labels carry
relationships in all layouts.

## Validation and promotion

Pure checks cover token existence, exact highlighting text, path conversion,
reference branches, missing references and cycles. Focused browser checks cover
all seven label treatments, only-one preview, syntax colors, default-theme axe,
all four hierarchy views, actual Card-padding references, step boundaries and
phone widths. Desktop dark/light screens were visually reviewed. No repeated
cross-theme contrast sweep. Human assistive-technology review and standalone A1
host validation remain before promotion.
