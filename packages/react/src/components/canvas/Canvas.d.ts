import type { HTMLAttributes, ReactNode } from 'react'

/** Shape options for a canvas node */
export type CanvasNodeShape = 'circle' | 'square' | 'rectangle' | 'squircle'

/** Color variant for a canvas node */
export type CanvasNodeColor = 'neutral' | 'info' | 'success' | 'warn' | 'error' | 'accent'

/** T-shirt size for a canvas node */
export type CanvasNodeSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/**
 * Constrains where connectors may exit/enter a node's boundary.
 * - `'cardinal'`  — only the 4 face centers: N, E, S, W (90° increments)
 * - `'octagonal'` — all 8 directions: N, NE, E, SE, S, SW, W, NW (45° increments)
 * - `undefined`   — free angle (exits straight toward the target, default)
 */
export type CanvasNodeAnchorSnap = 'cardinal' | 'octagonal'

/** Edge direction — which ends carry arrowheads */
export type CanvasEdgeDirection = 'to' | 'from' | 'both' | 'none'

/** Edge line style */
export type CanvasEdgeVariant = 'solid' | 'dashed' | 'dotted'

/** Edge stroke weight */
export type CanvasEdgeWeight = 'normal' | 'heavy'

/** Canvas background surface */
export type CanvasBackground = 'page' | 'panel' | 'raised'

/** Canvas interaction mode */
export type CanvasMode = 'view' | 'edit'

/** Canvas-level edge rendering style */
export type CanvasEdgeStyle = 'straight' | 'curved' | 'elbow'

/**
 * Props for the `Node` component.
 *
 * Standalone use (no Canvas required):
 * ```jsx
 * <Node label="React" color="info" />
 * ```
 *
 * Inside a Canvas — supply `id`, `x`, `y` so Canvas positions it and can route edges:
 * ```jsx
 * <Canvas><Node id="a" x={100} y={100} label="React" color="info" /></Canvas>
 * ```
 */
export interface NodeProps {
  /**
   * Unique identifier — required when used inside `<Canvas>` so edges can reference it.
   * Optional when used standalone.
   */
  id?: string
  /** Center X position in canvas space (pixels) — used by Canvas for positioning. */
  x?: number
  /** Center Y position in canvas space (pixels) — used by Canvas for positioning. */
  y?: number
  /** Primary label displayed inside the node */
  label: string
  /** Optional secondary label shown below the main label */
  sublabel?: string
  /** Native tooltip shown on hover — use for full token names or supplementary context */
  title?: string
  /**
   * Node shape. `circle` (default) and `square` / `squircle` are square.
   * `rectangle` is wider than it is tall.
   */
  shape?: CanvasNodeShape
  /** Color variant (default `"neutral"`) */
  color?: CanvasNodeColor
  /**
   * T-shirt size (default `"md"`). Scales both the node dimensions and the label font size.
   * - `xs` — 40px / 80×36px rect
   * - `sm` — 60px / 96×44px rect
   * - `md` — 80px / 128×56px rect (default)
   * - `lg` — 120px / 160×72px rect
   * - `xl` — 160px / 200×88px rect
   */
  size?: CanvasNodeSize
  /** When true, uses a tinted surface instead of the full status background (default `false`) */
  subtle?: boolean
  /**
   * Custom background color for the node (any valid CSS color: hex, rgb, hsl, `var(--token)`).
   * When set, overrides the `color` / `subtle` token-based background and border color.
   * Use `foregroundColor` alongside it if the default text color doesn't have enough contrast.
   */
  backgroundColor?: string
  /**
   * Custom text (foreground) color. Only meaningful when `backgroundColor` is also set.
   * Accepts any valid CSS color value.
   */
  foregroundColor?: string
  /**
   * Constrains where connectors may exit/enter this node.
   * Overrides the Canvas-level `defaultAnchorSnap` when set.
   * - `'cardinal'`  — only N, E, S, W (90° increments)
   * - `'octagonal'` — N, NE, E, SE, S, SW, W, NW (45° increments)
   * - `undefined`   — inherits Canvas `defaultAnchorSnap` or uses free angle (default)
   *
   * Does not affect `edgeStyle="elbow"` edges, which always use cardinal exits.
   */
  anchorSnap?: CanvasNodeAnchorSnap
}

/**
 * Props for the `NodeConnector` descriptor component.
 * Render as children of `<Canvas>` — Canvas reads these props to draw SVG connectors.
 */
export interface NodeConnectorProps {
  /** Unique identifier */
  id: string
  /** Source node id */
  from: string
  /** Target node id */
  to: string
  /** Which end(s) carry arrowheads (default `"to"`) */
  direction?: CanvasEdgeDirection
  /** Line style (default `"solid"`) */
  variant?: CanvasEdgeVariant
  /** Stroke weight (default `"normal"`) */
  weight?: CanvasEdgeWeight
  /** Optional label rendered at the midpoint of the connector */
  label?: string
  /** Override the canvas-level `edgeStyle` for this connector. `true` = curved, `false` = straight. */
  curved?: boolean
}

/** @deprecated Use `NodeConnectorProps` instead. */
export type CanvasEdgeProps = NodeConnectorProps

export interface CanvasProps extends Omit<HTMLAttributes<HTMLDivElement>, 'aria-label'> {
  /**
   * `Node` and `NodeConnector` elements as direct children.
   *
   * ```jsx
   * <Canvas aria-label="Graph">
   *   <Node id="a" x={100} y={100} label="Tokens" color="info" />
   *   <Node id="b" x={300} y={100} label="React" color="success" />
   *   <NodeConnector id="e1" from="a" to="b" />
   * </Canvas>
   * ```
   */
  children?: ReactNode
  /**
   * Interaction mode.
   * - `"view"` (default) — pan and zoom only.
   * - `"edit"` — nodes are draggable; clicking empty canvas adds a node (`onAddNode`);
   *   each node shows a connect button to draw new connectors (`onAddEdge`).
   */
  mode?: CanvasMode
  /**
   * Called in edit mode with the moved node's id and new center position.
   */
  onNodeMove?: (id: string, x: number, y: number) => void
  /**
   * Called when the user selects "Delete" from a node's context menu.
   * Only shown when provided (edit mode). Remove the node from your state.
   */
  onDeleteNode?: (id: string) => void
  /**
   * Called when the user selects "Duplicate" from a node's context menu.
   * Only shown when provided (edit mode). Create a copy of the node in your state.
   */
  onDuplicateNode?: (id: string) => void
  /**
   * Called in edit mode when the user clicks empty canvas space (no pan occurred).
   * Receives the click position in canvas coordinates (center of the new node).
   * Add a new node at that position in your state.
   */
  onAddNode?: (x: number, y: number) => void
  /**
   * Called in edit mode when the user draws a connector between two nodes using
   * the connect button on a node. Add the new edge in your state.
   */
  onAddEdge?: (fromId: string, toId: string) => void
  /**
   * Returns custom context menu items for a right-clicked node.
   * Items use the `ContextMenuEntry` shape from the A1 ContextMenu component.
   * Shown before the built-in "Duplicate" and "Delete" items (edit mode only).
   */
  nodeMenuItems?: (nodeId: string) => Array<{ id: string; label?: string; icon?: string; variant?: string; disabled?: boolean; onClick?: () => void } | { type: 'divider'; id: string } | { type: 'group'; id: string; label: string }>
  /**
   * Extra context menu items shown when right-clicking the canvas background
   * (appended below the built-in zoom / fit / reset items).
   */
  canvasMenuItems?: Array<{ id: string; label?: string; icon?: string; variant?: string; disabled?: boolean; onClick?: () => void } | { type: 'divider'; id: string }>
  /** Show the dot grid (default `true`) */
  showGrid?: boolean
  /**
   * Background surface token (default `"panel"`).
   * - `"panel"` — standard panel surface.
   * - `"page"` — page background.
   * - `"raised"` — elevated surface.
   * Pair with `inverse` for a dark/inverse canvas.
   */
  background?: CanvasBackground
  /**
   * Apply the inverse color scheme — dark surface with inverse text.
   * Mirrors the `inverse` prop on `Section`. Default `false`.
   */
  inverse?: boolean
  /** Show the zoom controls overlay (default `true`) */
  showControls?: boolean
  /**
   * Default edge rendering shape for all edges (default `"straight"`).
   * Individual `<NodeConnector curved>` overrides this per connector.
   */
  edgeStyle?: CanvasEdgeStyle
  /**
   * Canvas-wide anchor snap default for all nodes.
   * Per-node `anchorSnap` overrides this when set.
   * - `'cardinal'`  — exits only from N, E, S, W face centers (90°)
   * - `'octagonal'` — exits from all 8 directions including diagonals (45°)
   * - `undefined`   — free angle toward the target (default)
   *
   * Does not affect `edgeStyle="elbow"` edges.
   */
  defaultAnchorSnap?: CanvasNodeAnchorSnap
  /**
   * When `true`, node positions snap to the nearest grid increment
   * while dragging in `mode="edit"` (default `false`).
   */
  snapToGrid?: boolean
  /**
   * Grid cell size in pixels (default `16`). Applies to the visual grid overlay
   * and to snap-to-grid when `snapToGrid` is enabled.
   * Suggested values: `1`, `4`, `8`, `16`.
   */
  gridSpacing?: number
  /** Initial zoom level (default `1`) */
  defaultZoom?: number
  /** Initial pan offset in pixels (default `{ x: 0, y: 0 }`) */
  defaultPan?: { x: number; y: number }
  /**
   * When `true`, clicking an already-selected node toggles a transitive
   * connection trace — all connectors reachable from that node are highlighted
   * and the rest are dimmed. Click the node again to dismiss. Default `false`.
   */
  traceConnections?: boolean
  /**
   * When `true`, nodes are draggable (grab cursor, position updates via `onNodeMove`)
   * without enabling full `mode="edit"` (no connect buttons, no double-click-to-add).
   * Ignored when `mode="edit"` (edit mode always implies draggable). Default `false`.
   */
  draggableNodes?: boolean
  /**
   * When `true` and a node is selected, connectors directly attached to that node
   * are highlighted and all others are dimmed. Ignored when `traceConnections` is
   * active. Default `false`.
   */
  highlightConnections?: boolean
  /**
   * Called when the selected node changes. Fires with the node id when a node
   * is selected, or `null` when the selection is cleared.
   */
  onSelectionChange?: (id: string | null) => void
  /**
   * Called when a connector is clicked. Fires with the connector id when selected,
   * or `null` when selection is cleared.
   */
  onEdgeSelect?: (id: string | null) => void
  /** Accessible label for the canvas region (required) */
  'aria-label'?: string
}

/** Infinite pan/zoom canvas for visualizing node graphs */
export declare function Canvas(props: CanvasProps): JSX.Element

/**
 * A standalone labeled node shape. Works anywhere — inside or outside a `Canvas`.
 *
 * Standalone:
 * ```jsx
 * <Node label="React" color="info" shape="circle" />
 * ```
 *
 * Inside a Canvas (supply `id` + `x`/`y` for positioning and edge routing):
 * ```jsx
 * <Canvas>
 *   <Node id="a" x={100} y={100} label="A" color="info" />
 * </Canvas>
 * ```
 */
export declare function Node(props: NodeProps): JSX.Element

/**
 * A connector between two `Node` elements inside a `Canvas`.
 * Descriptor only — Canvas reads its props to draw SVG lines. Returns null.
 *
 * ```jsx
 * <Canvas>
 *   <Node id="a" x={100} y={100} label="A" />
 *   <Node id="b" x={300} y={100} label="B" />
 *   <NodeConnector id="e1" from="a" to="b" />
 * </Canvas>
 * ```
 */
export declare function NodeConnector(props: NodeConnectorProps): null

/** @deprecated Use `NodeConnector` instead. */
export declare const CanvasEdge: typeof NodeConnector
