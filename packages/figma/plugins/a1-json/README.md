# A1 component JSON — Figma plugin (proof of concept)

Two-way bridge between A1 components in the Figma file and the A1 page-definition
JSON format (A1-1651). Button and Section are supported so far.

- **Export (automatic)** — select a supported instance and its page-definition
  `ComponentNode` JSON appears in the plugin automatically; it regenerates when
  you change the selection or the selected instance's configuration (variant
  swap, text, nested content — debounced). *Export selection* remains as a
  manual override. An auto export never overwrites JSON you have hand-edited
  in the textarea; the manual button does.

  A Button reads `Variant`, `Size`, `State`, `IconPosition`, `Label`,
  `Show icon`, and `Icon`:

  ```json
  {
    "id": "button-12-34",
    "type": "Button",
    "props": { "variant": "secondary", "size": "lg", "icon": "check" },
    "content": { "fallback": "Save changes" }
  }
  ```

  Defaults (`variant="primary"`, `size="md"`, `iconPosition="start"`) are omitted,
  matching the a1-web configurator snippet convention. Visual-only Figma states
  (`hover`, `focus`, `pressed`) emit no prop and are reported as warnings.

- **Section and the contentWidth translation** — the Figma Section model is
  split across components: the `Section` set plus internal part instances such
  as **Section Content**, which carries the content-width (and possibly
  padding) properties. The plugin does not rely on specific part names:
  property lookups scan the Section instance **and every internal part
  instance** (anything that isn't a registered component like Button), matching
  property keys case- and spacing-insensitively (`contentWidth`, `Content
  width`, `Width`, `padding`, `Surface`, …). Export merges whatever it finds
  into the single React props (`surface`, `padding`, `contentWidth`, `gap`) —
  with the **ContentWidth** / **Gap** variable-collection modes as fallbacks —
  and warns explicitly when a core axis can't be located. Import applies each
  prop back to whichever node owns it (nested part properties are set as
  instance overrides). Also translated: `inverse` (explicit Inverse/Dark Color
  mode — never a variant), the TEXT documentation properties (`Gradient`,
  `Align`, `Height`, borders, `Radius`, background props), and **children**:
  registered descendant instances (e.g. Buttons) export as the Section node's
  `children`. On import, a Section with children is detached from its component
  so the child instances can be placed into its `_content` slot (Figma
  instances cannot receive new children); unsupported wrappers in the JSON
  (Stack, Grid, …) are flattened to their supported descendants.

- **Update selection** — applies the JSON in the textarea to the **currently
  selected** instance in place, instead of rendering a new one: variant axes,
  label/icon (Button), and the split Section properties are set wherever they
  live. Child nodes are not applied when updating (properties only). After the
  update, the auto-export refreshes the textarea with the canonical
  round-tripped node.

- **Import** — paste JSON into the textarea and click *Render on canvas*. The
  plugin accepts a single node, an array of nodes, or a full page definition /
  project bundle, finds every supported node in it, and renders each one as an
  instance of the matching Figma component set with its variant axes, label,
  and icon applied. Runtime-only props (`href`, `as`, `fullWidth`) are ignored
  with a warning, mirroring the gaps documented in
  `packages/react/ai/figma-workflow.md`.

- **Open in a1-web** — once the textarea holds a valid node, this link opens
  the matching a1-web component configurator with the node passed directly via
  a `?json=` query parameter, so the configurator arrives pre-loaded with the
  Figma instance's configuration and its JSON view open. The target is
  `A1_WEB_BASE` at the top of `ui.html` — `http://127.0.0.1:5177` (the reserved
  a1-web dev port) for now; point it at the deployed site later.

The exported node shape matches `apps/a1-web/src/editor/pageTypes.ts`
(`ComponentNode`), so the JSON round-trips with the **JSON** format view on the
a1-web Button configurator (`/components/button`) — an editable code block
where valid edits apply to the configurator as you type — and can be nested
into a page definition for the Projects **Upload JSON** flow.

## Install

1. In the Figma desktop app, open the A1 Design System file.
2. Plugins → Development → Import plugin from manifest…
3. Choose `packages/figma/plugins/a1-json/manifest.json`.

## Adding a component

Exporters and importers are keyed by component-set name in the `EXPORTERS` /
`IMPORTERS` registries at the bottom of `code.js`. Add a pair of functions that
map the component's Figma properties to its React props (see the per-component
tables in `packages/react/ai/figma-workflow.md`) and register them.

## Known POC limits

- Button and Section only; the icon name is read from the swapped icon
  component's name and assumes icon components are named after their Material
  Symbols glyph.
- The plugin uses the synchronous document API (no `documentAccess:
  "dynamic-page"`), like the sibling Card generator plugin.
- Export emits a single node (with children for Section), not a full page
  definition — wrap it in a `PageDefinition` before uploading it as a project
  page.
- Importing a Section with children detaches it from the Section component
  (instances cannot receive new children); a childless Section stays a live
  component instance. Update selection never touches children.
- Section `padding` / `align` responsive objects and props with no Figma
  representation are ignored on import with a warning.
- Property discovery is name-based (canonicalised keys) across the Section's
  internal parts — a part property that shares a canonical name with a React
  prop but means something else would be picked up.
