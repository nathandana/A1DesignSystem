# Labs nodes and canvas

`/experiments/connected-nodes` combines the existing A1 `Canvas`, `Node` and
`NodeConnector` components in one experiment. It does not fork their renderer,
connectors, grid, theme styles or interaction code. Existing A1 Web component
pages remain available. Follow the [Labs contribution guide](labs-contributing.md).

## Composition and ownership

`apps/a1-labs/src/connected-nodes/ConnectedNodesCanvas.jsx` is a reusable A1
composition. The host supplies `nodes`, `connections`, `onNodeMove` and
`onSelectionChange`. Optional presentation inputs are `nodeShape` (rectangle),
`edgeStyle` (curved), `lineStyle` (solid), `showGrid` (true), `draggable` (true),
`subtle` (true), `resetKey` (0) and accessible `label` (Connected nodes).

The host owns positions and labels. The wrapper measures available bounds with
ResizeObserver and refits on resize/reset, retaining host graph data. Ordinary
configuration and position updates preserve the current pan/zoom. Canvas owns
selection, edge routing, panning, wheel/pinch zoom and built-in controls. It runs
in view mode with `draggableNodes`, preserving native keyboard node selection
without the edit-mode connection buttons. Selection highlights direct connections.

`graph-model.js` contains only reusable geometry helpers. `sample-graph.js`
contains the six-node/seven-connector demo: Tokens feeds React, HTML/CSS and
Native, which feed Apps, followed by Preview. The experiment page owns graph
state, presentation controls, label editing, reset and keyboard nudge controls.
Do not move sample data, the Labs shell or another experiment into the core.

## Controls and responsive behavior

Configuration exposes connector geometry (straight/curved/elbow), node shapes,
solid/dashed/dotted lines, grid visibility, dragging and subtle status colors.
Node to edit selects a node for label editing and directional nudge buttons;
selecting a canvas node also opens those controls. Graph selection is owned by
Canvas; the editor retains its last selected node across resizing/deselection.
Empty label drafts show an error; the graph and text alternative retain the node
ID as an accessible fallback. Reset graph restores labels, positions and view.

Nudges and snapping use one-fifth of the existing Canvas node-size token (16 px).
Initial node positions and fit margins derive from that token as well. The host
height uses the existing `base.width.xl` token; Canvas provides its own minimum
height. No experiment CSS or new visual tokens are needed. No shared Canvas or
Node CSS is overridden.

On narrow screens the shared Labs configuration moves into its BottomSheet;
positions, labels and configuration remain in page state. The graph refits its
available width and retains zoom controls for closer inspection. A disclosure
beneath the graph lists every directed connection as a text alternative.

## Accessibility and validation

Use native A1 controls. Nodes remain keyboard selectable in view mode; the
configuration selector and directional buttons provide an alternative to pointer
dragging. Keep the text connection list synchronized with edited labels. Avoid
introducing automatic movement or timers. Shared Canvas currently owns its own
focus/interaction behavior; this experiment does not claim to remediate every
shared Canvas accessibility limitation.

Check initial graph integrity and fit, pointer dragging with connected paths,
keyboard selection and nudging, label editing/fallback, configuration controls,
reset, pan/zoom, light/dark appearance, mobile sheet and graph state across
resizing. Before promoting this composition, check it outside Labs and complete
human assistive-technology review. Do not run repeated theme contrast sweeps.

Refresh the preview using
`npm run capture:previews --workspace=a1-labs -- http://127.0.0.1:5187 --nodes-only`.

## Recorded checks — Oct. 11, 2026

- Unit tests passed for connector endpoints, finite empty-graph handling and
  fit bounds at mobile/desktop widths.
- Browser checks passed for six nodes/seven connectors, Space-key selection,
  keyboard nudging, drag-driven path updates, label editing, node and connector
  shapes, dashed lines, grid toggling, zoom, reset and synchronized text connections.
- Desktop dark/mobile light views were reviewed. Five viewport widths fit all
  nodes; the mobile configuration sheet and reduced-motion zoom remain usable.
  A focused structural accessibility scan passed without a repeated contrast sweep.
- A temporary minimal A1 host rendered and selected a supplied two-node graph
  without Labs, A1 Web or sample-graph dependencies. The host was removed.
- Human screen-reader review remains outstanding; existing Canvas interaction
  limitations remain owned by the shared component.
