import React, { Children, createContext, useCallback, useContext, useEffect, useId, useRef, useState } from 'react'
import { ContextMenu } from '../context-menu/ContextMenu.jsx'
import './canvas.css'

// Node dimensions per t-shirt size (canvas-space pixels)
const NODE_SIZES = { xs: 40, sm: 60, md: 80, lg: 120, xl: 160 }
const NODE_RECT_SIZES = {
  xs: { w: 80,  h: 36 },
  sm: { w: 96,  h: 44 },
  md: { w: 128, h: 56 },
  lg: { w: 160, h: 72 },
  xl: { w: 200, h: 88 },
}

const ZOOM_MIN = 0.1
const ZOOM_MAX = 4
const ZOOM_STEP = 0.15
const ZOOM_TRACKPAD_SENSITIVITY = 0.003  // trackpad fires pixel-mode events; scale down heavily
const GRID_SPACING = 24
const PAN_THRESHOLD = 4  // px moved before registering as a drag (not a click)

function getNodeDims(shape, size = 'md') {
  if (shape === 'rectangle') return NODE_RECT_SIZES[size] ?? NODE_RECT_SIZES.md
  const s = NODE_SIZES[size] ?? NODE_SIZES.md
  return { w: s, h: s }
}

// Compute the point on a node's boundary where an edge exits at an angle toward (targetX, targetY).
// node.anchorSnap: 'cardinal' snaps to 4 directions (N/E/S/W); 'octagonal' snaps to 8 (adds NE/SE/SW/NW).
function getBoundaryPoint(node, targetX, targetY) {
  const { w, h } = getNodeDims(node.shape, node.size)
  const dx = targetX - node.x
  const dy = targetY - node.y
  const len = Math.hypot(dx, dy)
  if (len === 0) return { x: node.x, y: node.y }
  let ux = dx / len
  let uy = dy / len

  if (node.anchorSnap) {
    const step = node.anchorSnap === 'cardinal' ? Math.PI / 2 : Math.PI / 4
    const snapped = Math.round(Math.atan2(uy, ux) / step) * step
    ux = Math.cos(snapped)
    uy = Math.sin(snapped)
  }

  const hw = w / 2
  const hh = h / 2
  if (!node.shape || node.shape === 'circle') {
    return { x: node.x + ux * hw, y: node.y + uy * hh }
  }
  // Square / rectangle / squircle — ray-box intersection
  const tx = ux !== 0 ? Math.abs(hw / ux) : Infinity
  const ty = uy !== 0 ? Math.abs(hh / uy) : Infinity
  const t = Math.min(tx, ty)
  return { x: node.x + ux * t, y: node.y + uy * t }
}

// Cardinal exit/entry point for elbow routing — exits from the nearest side face
function getElbowBoundaryPoint(node, other) {
  const { w, h } = getNodeDims(node.shape, node.size)
  const dx = other.x - node.x
  const dy = other.y - node.y
  if (Math.abs(dx) >= Math.abs(dy)) {
    // Primarily horizontal — exit from left or right face center
    return { x: node.x + Math.sign(dx) * w / 2, y: node.y }
  }
  // Primarily vertical — exit from top or bottom face center
  return { x: node.x, y: node.y + Math.sign(dy) * h / 2 }
}

// SVG path for an edge: straight, curved (cubic Bézier S-curve), or elbow (orthogonal with rounded corners)
function edgePath(p1, p2, style) {
  const dx = p2.x - p1.x
  const dy = p2.y - p1.y

  if (style === 'curved') {
    const len = Math.hypot(dx, dy)
    if (len === 0) return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`
    const ux = dx / len
    const uy = dy / len
    // Control points have an along-edge component (keeps arrows pointing correctly)
    // and opposite perpendicular offsets (gives the S-curve shape).
    const t = Math.min(len * 0.4, 80)   // along-edge tension
    const a = Math.min(len * 0.1, 22)   // S-curve lateral amplitude
    const cp1x = p1.x + ux * t - uy * a
    const cp1y = p1.y + uy * t + ux * a
    const cp2x = p2.x - ux * t + uy * a
    const cp2y = p2.y - uy * t - ux * a
    return `M ${p1.x} ${p1.y} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p2.x} ${p2.y}`
  }

  if (style === 'elbow') {
    const adx = Math.abs(dx)
    const ady = Math.abs(dy)
    if (adx < 1 && ady < 1) return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`
    const sx = dx < 0 ? -1 : 1
    const sy = dy < 0 ? -1 : 1
    if (adx >= ady) {
      // Horizontal exits (left/right face): H → V → H routing
      if (ady < 1) return `M ${p1.x} ${p1.y} H ${p2.x}`
      const r = Math.min(16, adx / 2, ady / 2)
      const midX = (p1.x + p2.x) / 2
      return [
        `M ${p1.x} ${p1.y}`,
        `H ${midX - sx * r}`,
        `Q ${midX} ${p1.y} ${midX} ${p1.y + sy * r}`,
        `V ${p2.y - sy * r}`,
        `Q ${midX} ${p2.y} ${midX + sx * r} ${p2.y}`,
        `H ${p2.x}`,
      ].join(' ')
    } else {
      // Vertical exits (top/bottom face): V → H → V routing
      if (adx < 1) return `M ${p1.x} ${p1.y} V ${p2.y}`
      const r = Math.min(16, adx / 2, ady / 2)
      const midY = (p1.y + p2.y) / 2
      return [
        `M ${p1.x} ${p1.y}`,
        `V ${midY - sy * r}`,
        `Q ${p1.x} ${midY} ${p1.x + sx * r} ${midY}`,
        `H ${p2.x - sx * r}`,
        `Q ${p2.x} ${midY} ${p2.x} ${midY + sy * r}`,
        `V ${p2.y}`,
      ].join(' ')
    }
  }

  // Default: straight line
  return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`
}

// BFS from startId traversing all connected edges in both directions —
// returns the set of edge IDs that touch startId or any transitively connected node.
// Ignores edge directionality for traversal so a middle node shows both
// its incoming and outgoing connections (and their transitive chains).
function computeTracedEdges(startId, edgeList) {
  const highlighted = new Set()

  // Backward pass: trace ancestors (follow edges where edge.to is already reached)
  // Only edges leading INTO the selected node's lineage — does NOT expand to siblings
  const ancestors = new Set([startId])
  let changed = true
  while (changed) {
    changed = false
    for (const edge of edgeList) {
      if (highlighted.has(edge.id)) continue
      if (ancestors.has(edge.to)) {
        highlighted.add(edge.id)
        if (!ancestors.has(edge.from)) { ancestors.add(edge.from); changed = true }
      }
    }
  }

  // Forward pass: trace descendants (follow edges where edge.from is already reached)
  // Only edges going OUT of the selected node's lineage — does NOT pull in ancestor siblings
  const descendants = new Set([startId])
  changed = true
  while (changed) {
    changed = false
    for (const edge of edgeList) {
      if (highlighted.has(edge.id)) continue
      if (descendants.has(edge.from)) {
        highlighted.add(edge.id)
        if (!descendants.has(edge.to)) { descendants.add(edge.to); changed = true }
      }
    }
  }

  return highlighted
}

// Context shared by Canvas with its Node / NodeConnector children
const CanvasCtx = createContext(null)

/**
 * Node — a standalone labeled shape component.
 *
 * Works on its own anywhere:
 *   `<Node label="Tokens" color="info" />`
 *
 * Also composes into a Canvas — supply `id`, `x`, `y` so Canvas can position it
 * and route edges to it:
 *   `<Canvas><Node id="a" x={100} y={100} label="Tokens" color="info" /></Canvas>`
 */
export function Node({ id, x, y, label, sublabel, title, shape = 'circle', color = 'neutral', subtle = false, anchorSnap, size = 'md', backgroundColor, foregroundColor }) {
  const ctx = useContext(CanvasCtx)
  const inCanvas = !!ctx
  const { w, h } = getNodeDims(shape, size)
  const selected = inCanvas && ctx.selectedId === id
  const isEditing = inCanvas && ctx.mode === 'edit'
  const isDraggable = isEditing || (inCanvas && !!ctx.draggableNodes)
  const isConnectSource = inCanvas && ctx.connecting === id
  const isConnectTarget = inCanvas && !!ctx.connecting && ctx.connecting !== id

  const classes = [
    'a1-canvas__node',
    `a1-canvas__node--${shape}`,
    !backgroundColor && `a1-canvas__node--${color}`,
    `a1-canvas__node--${size}`,
    !backgroundColor && subtle && 'a1-canvas__node--subtle',
    selected && 'a1-canvas__node--selected',
    isDraggable && 'a1-canvas__node--editable',
    isConnectSource && 'a1-canvas__node--connect-source',
    isConnectTarget && 'a1-canvas__node--connect-target',
  ].filter(Boolean).join(' ')

  const customColorVars = backgroundColor
    ? {
        '--a1-canvas-node-bg': backgroundColor,
        '--a1-canvas-node-border': backgroundColor,
        ...(foregroundColor ? { '--a1-canvas-node-fg': foregroundColor } : {}),
      }
    : {}

  // Inside Canvas: absolutely positioned at canvas-space coords.
  // Standalone: inline-block at natural dimensions, no absolute layout.
  const style = inCanvas && x != null && y != null
    ? { left: x - w / 2, top: y - h / 2, width: w, height: h, ...customColorVars }
    : { width: w, height: h, position: 'relative', ...customColorVars }

  const hasConnectControl = inCanvas && isEditing
  const nodeRole = hasConnectControl ? 'group' : 'button'

  return (
    <div
      role={nodeRole}
      tabIndex={hasConnectControl ? undefined : 0}
      aria-pressed={!hasConnectControl && selected ? true : undefined}
      aria-label={label}
      title={title}
      className={classes}
      style={style}
      onClick={() => inCanvas && ctx.onNodeSelect(id)}
      onMouseDown={(e) => {
        if (inCanvas) e.stopPropagation()
        if (isDraggable) ctx.onNodeDragStart(id, x, y, e.clientX, e.clientY)
      }}
      onTouchStart={(e) => {
        if (inCanvas) e.stopPropagation()
        if (isDraggable && e.touches.length === 1) {
          ctx.onNodeDragStart(id, x, y, e.touches[0].clientX, e.touches[0].clientY)
        }
      }}
      onContextMenu={(e) => {
        if (!inCanvas) return
        e.preventDefault()
        e.stopPropagation()
        ctx.onNodeContextMenu(id, e.clientX, e.clientY)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          if (inCanvas) ctx.onNodeSelect(id)
        }
      }}
    >
      <span className="a1-canvas__node-label">{label}</span>
      {sublabel && <span className="a1-canvas__node-sublabel">{sublabel}</span>}
      {inCanvas && isEditing && (
        <button
          type="button"
          className="a1-canvas__node-connect"
          aria-label={isConnectSource ? 'Cancel connection' : `Connect from ${label}`}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation()
            if (isConnectSource) {
              ctx.onCancelConnect()
            } else {
              ctx.onStartConnect(id)
            }
          }}
        >
          <span className="a1-icon" aria-hidden="true">{isConnectSource ? 'close' : 'link'}</span>
        </button>
      )}
    </div>
  )
}

/**
 * NodeConnector — descriptor component. Canvas reads its props to draw SVG connectors.
 * Returns null; actual rendering happens in the Canvas SVG layer.
 *
 * ```jsx
 * <Canvas>
 *   <Node id="a" x={100} y={100} label="A" />
 *   <Node id="b" x={300} y={100} label="B" />
 *   <NodeConnector id="e1" from="a" to="b" />
 * </Canvas>
 * ```
 */
export function NodeConnector(_props) { return null }

/** @deprecated Use `NodeConnector` instead. */
export const CanvasEdge = NodeConnector

/**
 * Canvas — infinite pan/zoom surface for node graphs.
 *
 * ```jsx
 * <Canvas aria-label="Graph">
 *   <Node id="a" x={100} y={100} label="A" />
 *   <NodeConnector id="e1" from="a" to="b" />
 * </Canvas>
 * ```
 */
export function Canvas({
  children,
  mode = 'view',
  onNodeMove,
  onDeleteNode,
  onDuplicateNode,
  nodeMenuItems,
  canvasMenuItems,
  showGrid = true,
  background = 'panel',
  inverse = false,
  showControls = true,
  edgeStyle = 'straight',
  snapToGrid = false,
  gridSpacing = 16,
  defaultZoom = 1,
  defaultPan,
  highlightConnections = false,
  traceConnections = false,
  draggableNodes = false,
  defaultAnchorSnap,
  onSelectionChange,
  onEdgeSelect,
  onAddNode,
  onAddEdge,
  'aria-label': ariaLabel = 'Canvas',
  className,
  ...rest
}) {
  const uid = useId().replace(/:/g, 'c')
  const containerRef = useRef(null)
  const [zoom, setZoom] = useState(defaultZoom)
  const [pan, setPan] = useState(defaultPan ?? { x: 0, y: 0 })
  const panRef = useRef(pan)
  const zoomRef = useRef(zoom)
  panRef.current = pan
  zoomRef.current = zoom

  const [selectedId, setSelectedId] = useState(null)
  const [selectedEdgeId, setSelectedEdgeId] = useState(null)
  const [connecting, setConnecting] = useState(null)  // fromId while drawing a connector
  const [mouseCvs, setMouseCvs] = useState({ x: 0, y: 0 })
  const [ctxMenu, setCtxMenu] = useState({ open: false, x: 0, y: 0, nodeId: null })

  // Stable refs so effects can read latest callbacks without re-running
  const onSelectionChangeRef = useRef(onSelectionChange)
  onSelectionChangeRef.current = onSelectionChange
  const onEdgeSelectRef = useRef(onEdgeSelect)
  onEdgeSelectRef.current = onEdgeSelect
  const onAddNodeRef = useRef(onAddNode)
  onAddNodeRef.current = onAddNode
  const onAddEdgeRef = useRef(onAddEdge)
  onAddEdgeRef.current = onAddEdge
  const connectingRef = useRef(connecting)
  connectingRef.current = connecting
  const modeRef = useRef(mode)
  modeRef.current = mode

  useEffect(() => { onSelectionChangeRef.current?.(selectedId) }, [selectedId])
  useEffect(() => { onEdgeSelectRef.current?.(selectedEdgeId) }, [selectedEdgeId])

  // Track cursor in canvas coords while drawing a connector (for ghost edge)
  useEffect(() => {
    if (!connecting) return
    const onMove = (e) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      setMouseCvs({
        x: (e.clientX - rect.left - panRef.current.x) / zoomRef.current,
        y: (e.clientY - rect.top - panRef.current.y) / zoomRef.current,
      })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [connecting])

  // Escape cancels connecting mode
  useEffect(() => {
    if (!connecting) return
    const onKey = (e) => { if (e.key === 'Escape') setConnecting(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [connecting])

  const isPanningRef = useRef(false)
  const panMovedRef = useRef(false)
  const panStartRef = useRef({ mx: 0, my: 0, px: 0, py: 0 })
  const nodeDragRef = useRef(null)
  const pinchRef = useRef(null)

  // Extract node and edge data from children so we can:
  // • render nodes in the viewport transform layer
  // • route edges between node boundary points in the SVG layer
  const nodeMap = {}
  const edgeDataList = []
  const nodeElements = []

  Children.forEach(children, child => {
    if (!child) return
    if (child.type === Node) {
      // Merge canvas-level defaultAnchorSnap; per-node anchorSnap wins if set
      nodeMap[child.props.id] = {
        ...child.props,
        anchorSnap: child.props.anchorSnap !== undefined ? child.props.anchorSnap : defaultAnchorSnap,
      }
      nodeElements.push(child)
    }
    if (child.type === NodeConnector) {
      edgeDataList.push(child.props)
    }
  })

  // Stable ref so callbacks can read the latest nodeMap without stale closures
  const nodeMapRef = useRef(nodeMap)
  nodeMapRef.current = nodeMap

  // Pre-compute which edge IDs are in the transitive trace from the selected node.
  // traceConnections={true} enables this: selecting a node shows all transitively reachable connectors.
  const tracedEdgeSet = traceConnections && selectedId ? computeTracedEdges(selectedId, edgeDataList) : null

  // --- Pan helpers ---
  const startPan = useCallback((mx, my) => {
    isPanningRef.current = true
    panMovedRef.current = false
    panStartRef.current = { mx, my, px: panRef.current.x, py: panRef.current.y }
  }, [])

  // --- Wheel zoom toward cursor ---
  const onWheel = useCallback((e) => {
    e.preventDefault()
    const rect = containerRef.current.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    // deltaMode 0 = pixels (trackpad) — fires many small events, needs low sensitivity
    // deltaMode 1 = lines (mouse wheel) — fires fewer large events, use fixed step
    const factor = e.deltaMode === 0
      ? 1 - Math.max(-0.15, Math.min(0.15, e.deltaY * ZOOM_TRACKPAD_SENSITIVITY))
      : (e.deltaY > 0 ? (1 - ZOOM_STEP) : (1 + ZOOM_STEP))
    setZoom(z => {
      const newZ = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, z * factor))
      const cx = (mx - panRef.current.x) / z
      const cy = (my - panRef.current.y) / z
      setPan({ x: mx - cx * newZ, y: my - cy * newZ })
      return newZ
    })
  }, [])

  // --- Touch: single-finger pan, two-finger pinch zoom ---
  const onTouchStart = useCallback((e) => {
    if (e.touches.length === 1) {
      e.preventDefault()
      startPan(e.touches[0].clientX, e.touches[0].clientY)
      pinchRef.current = null
    } else if (e.touches.length === 2) {
      e.preventDefault()
      isPanningRef.current = false
      const t0 = e.touches[0]
      const t1 = e.touches[1]
      const rect = containerRef.current.getBoundingClientRect()
      const vx = (t0.clientX + t1.clientX) / 2 - rect.left
      const vy = (t0.clientY + t1.clientY) / 2 - rect.top
      pinchRef.current = {
        startDist: Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY),
        startZoom: zoomRef.current,
        canvasX: (vx - panRef.current.x) / zoomRef.current,
        canvasY: (vy - panRef.current.y) / zoomRef.current,
        viewX: vx,
        viewY: vy,
      }
    }
  }, [startPan])

  const onTouchMove = useCallback((e) => {
    e.preventDefault()
    if (e.touches.length === 1 && isPanningRef.current) {
      const dx = e.touches[0].clientX - panStartRef.current.mx
      const dy = e.touches[0].clientY - panStartRef.current.my
      if (!panMovedRef.current && Math.hypot(dx, dy) < PAN_THRESHOLD) return
      panMovedRef.current = true
      setPan({ x: panStartRef.current.px + dx, y: panStartRef.current.py + dy })
    } else if (e.touches.length === 2 && pinchRef.current) {
      const t0 = e.touches[0]
      const t1 = e.touches[1]
      const dist = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY)
      const newZ = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, pinchRef.current.startZoom * (dist / pinchRef.current.startDist)))
      const { canvasX, canvasY, viewX, viewY } = pinchRef.current
      setZoom(newZ)
      setPan({ x: viewX - canvasX * newZ, y: viewY - canvasY * newZ })
    }
  }, [])

  const onTouchEnd = useCallback((e) => {
    if (e.touches.length === 0) {
      isPanningRef.current = false
      pinchRef.current = null
    } else if (e.touches.length === 1 && pinchRef.current) {
      pinchRef.current = null
      startPan(e.touches[0].clientX, e.touches[0].clientY)
    }
  }, [startPan])

  // Attach non-passive native listeners (wheel + touch need preventDefault)
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('touchstart', onTouchStart, { passive: false })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd, { passive: false })
    return () => {
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [onWheel, onTouchStart, onTouchMove, onTouchEnd])

  // Stable refs for drag callbacks
  const onNodeMoveRef = useRef(onNodeMove)
  onNodeMoveRef.current = onNodeMove
  const snapToGridRef = useRef(snapToGrid)
  snapToGridRef.current = snapToGrid
  const gridSpacingRef = useRef(gridSpacing)
  gridSpacingRef.current = gridSpacing

  // Global mouse move + up: pan and node drag
  useEffect(() => {
    const onMove = (e) => {
      if (isPanningRef.current) {
        const dx = e.clientX - panStartRef.current.mx
        const dy = e.clientY - panStartRef.current.my
        if (!panMovedRef.current && Math.hypot(dx, dy) < PAN_THRESHOLD) return
        panMovedRef.current = true
        setPan({ x: panStartRef.current.px + dx, y: panStartRef.current.py + dy })
        return
      }
      if (nodeDragRef.current) {
        const { id, startMx, startMy, startNx, startNy } = nodeDragRef.current
        const dx = (e.clientX - startMx) / zoomRef.current
        const dy = (e.clientY - startMy) / zoomRef.current
        let newX = startNx + dx
        let newY = startNy + dy
        if (snapToGridRef.current) {
          const snap = gridSpacingRef.current
          newX = Math.round(newX / snap) * snap
          newY = Math.round(newY / snap) * snap
        }
        onNodeMoveRef.current?.(id, newX, newY)
      }
    }
    const onUp = (e) => {
      if (isPanningRef.current && !panMovedRef.current) {
        if (connectingRef.current) {
          // Click on empty canvas cancels the draw-connector mode
          setConnecting(null)
        } else {
          setSelectedId(null)
          setSelectedEdgeId(null)
        }
      }
      isPanningRef.current = false
      nodeDragRef.current = null
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  }, [])

  // Container mousedown: left-click or middle-click → pan
  const onContainerMouseDown = useCallback((e) => {
    if (e.button === 0 || e.button === 1) {
      if (e.button === 1) e.preventDefault()
      startPan(e.clientX, e.clientY)
    }
  }, [startPan])

  // Node callbacks provided via context
  const onNodeSelect = useCallback((id) => {
    // In connecting mode: clicking a different node creates the edge
    if (connectingRef.current) {
      if (connectingRef.current !== id) {
        onAddEdgeRef.current?.(connectingRef.current, id)
      }
      setConnecting(null)
      return
    }
    setSelectedEdgeId(null)
    setSelectedId(prev => prev === id ? null : id)
  }, [])

  const onNodeDragStart = useCallback((id, nx, ny, mx, my) => {
    if (connectingRef.current) return  // don't start drag while drawing a connector
    nodeDragRef.current = { id, startMx: mx, startMy: my, startNx: nx, startNy: ny }
  }, [])

  const onNodeContextMenu = useCallback((nodeId, x, y) => {
    setSelectedEdgeId(null)
    setSelectedId(nodeId)
    setCtxMenu({ open: true, x, y, nodeId })
  }, [])
  const closeCtxMenu = useCallback(() => setCtxMenu(m => ({ ...m, open: false })), [])

  // Zoom to fit all nodes
  const zoomToFit = useCallback(() => {
    const nodes = Object.values(nodeMapRef.current)
    if (!nodes.length || !containerRef.current) return
    const { width, height } = containerRef.current.getBoundingClientRect()
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
    for (const n of nodes) {
      const { w, h } = getNodeDims(n.shape, n.size)
      x0 = Math.min(x0, n.x - w / 2); y0 = Math.min(y0, n.y - h / 2)
      x1 = Math.max(x1, n.x + w / 2); y1 = Math.max(y1, n.y + h / 2)
    }
    const pad = 48
    const newZ = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, Math.min(
      width / (x1 - x0 + pad * 2),
      height / (y1 - y0 + pad * 2)
    )))
    setZoom(newZ)
    setPan({ x: width / 2 - ((x0 + x1) / 2) * newZ, y: height / 2 - ((y0 + y1) / 2) * newZ })
  }, [])

  // Build context menu items for the right-click target
  const ctxMenuItems = (() => {
    if (ctxMenu.nodeId) {
      const custom = nodeMenuItems ? nodeMenuItems(ctxMenu.nodeId) : []
      const items = [...custom]
      if (mode === 'edit') {
        const editItems = []
        if (onDuplicateNode) {
          editItems.push({ id: 'duplicate', label: 'Duplicate', icon: 'content_copy', onClick: () => onDuplicateNode(ctxMenu.nodeId) })
        }
        if (onDeleteNode) {
          editItems.push({ id: 'delete', label: 'Delete', icon: 'delete', variant: 'destructive', onClick: () => onDeleteNode(ctxMenu.nodeId) })
        }
        if (editItems.length) {
          if (items.length) items.push({ type: 'divider', id: 'sep' })
          items.push(...editItems)
        }
      }
      return items
    }
    // Canvas background context menu
    const items = [
      { id: 'zoom-in',  label: 'Zoom in',      icon: 'add',         onClick: () => setZoom(z => Math.min(ZOOM_MAX, z * (1 + ZOOM_STEP))) },
      { id: 'zoom-out', label: 'Zoom out',      icon: 'remove',      onClick: () => setZoom(z => Math.max(ZOOM_MIN, z * (1 - ZOOM_STEP))) },
      { type: 'divider', id: 'sep1' },
      { id: 'fit',      label: 'Fit to screen', icon: 'fit_screen',  onClick: zoomToFit },
      { id: 'reset',    label: 'Reset zoom',    icon: 'zoom_in_map', onClick: () => { setZoom(1); setPan({ x: 0, y: 0 }) } },
    ]
    if (canvasMenuItems?.length) {
      items.push({ type: 'divider', id: 'sep2' })
      items.push(...canvasMenuItems)
    }
    return items
  })()

  const classes = [
    'a1-canvas',
    `a1-canvas--${background}`,
    inverse && 'a1-canvas--inverse',
    connecting && 'a1-canvas--connecting',
    className,
  ].filter(Boolean).join(' ')
  const vpTransform = `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
  const gTransform = `translate(${pan.x} ${pan.y}) scale(${zoom})`
  const gridPx = gridSpacing * zoom
  const hasNodes = Object.keys(nodeMap).length > 0

  return (
    <CanvasCtx.Provider value={{
      mode, selectedId, connecting, draggableNodes,
      onNodeSelect, onNodeDragStart, onNodeContextMenu,
      onStartConnect: setConnecting,
      onCancelConnect: () => setConnecting(null),
    }}>
      <div
        ref={containerRef}
        className={classes}
        role="application"
        aria-label={ariaLabel}
        tabIndex={0}
        onMouseDown={onContainerMouseDown}
        onDoubleClick={(e) => {
          if (modeRef.current !== 'edit' || !onAddNodeRef.current || connectingRef.current) return
          const rect = containerRef.current?.getBoundingClientRect()
          if (!rect) return
          const cx = (e.clientX - rect.left - panRef.current.x) / zoomRef.current
          const cy = (e.clientY - rect.top - panRef.current.y) / zoomRef.current
          onAddNodeRef.current(cx, cy)
        }}
        onContextMenu={(e) => { e.preventDefault(); setCtxMenu({ open: true, x: e.clientX, y: e.clientY, nodeId: null }) }}
        {...rest}
      >
        {showGrid && (
          <svg className="a1-canvas__grid" aria-hidden="true">
            <defs>
              <pattern
                id={`${uid}-grid`}
                width={gridPx}
                height={gridPx}
                x={pan.x % gridPx}
                y={pan.y % gridPx}
              >
                <path d={`M ${gridPx} 0 L 0 0 L 0 ${gridPx}`}
                  fill="none" className="a1-canvas__grid-line" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${uid}-grid)`} />
          </svg>
        )}

        {/* Edge SVG layer — drawn in canvas-space coordinates */}
        <svg className="a1-canvas__edges" aria-hidden="true">
          <defs>
            {edgeDataList.flatMap(edge => {
              const fromNode = nodeMap[edge.from]
              const toNode = nodeMap[edge.to]
              if (!fromNode || !toNode) return []
              const dir = edge.direction ?? 'to'
              const markers = []
              if (dir === 'to' || dir === 'both') {
                markers.push(
                  <marker key={`${uid}-${edge.id}-end`} id={`${uid}-${edge.id}-end`}
                    viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" className="a1-canvas__arrow" />
                  </marker>
                )
              }
              if (dir === 'from' || dir === 'both') {
                markers.push(
                  <marker key={`${uid}-${edge.id}-start`} id={`${uid}-${edge.id}-start`}
                    viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" className="a1-canvas__arrow" />
                  </marker>
                )
              }
              return markers
            })}
          </defs>
          <g transform={gTransform}>
            {edgeDataList.map(edge => {
              const fromNode = nodeMap[edge.from]
              const toNode = nodeMap[edge.to]
              if (!fromNode || !toNode) return null
              // Elbow routing exits from cardinal face centers; others exit at the angle toward the target
              const resolvedStyle = edge.curved !== undefined
                ? (edge.curved ? 'curved' : 'straight')
                : edgeStyle
              const p1 = resolvedStyle === 'elbow'
                ? getElbowBoundaryPoint(fromNode, toNode)
                : getBoundaryPoint(fromNode, toNode.x, toNode.y)
              const p2 = resolvedStyle === 'elbow'
                ? getElbowBoundaryPoint(toNode, fromNode)
                : getBoundaryPoint(toNode, fromNode.x, fromNode.y)
              const dir = edge.direction ?? 'to'
              const dashArr = edge.variant === 'dashed' ? '8,5' : edge.variant === 'dotted' ? '2,5' : null
              const d = edgePath(p1, p2, resolvedStyle)
              const isEdgeSel = selectedEdgeId === edge.id
              // traceConnections: transitive reachability from selected node
              const isTraced = !!tracedEdgeSet?.has(edge.id)
              // highlightConnections: direct connections only (ignored when traceConnections is active)
              const isConn = !traceConnections && highlightConnections && selectedId && (edge.from === selectedId || edge.to === selectedId)
              const isDimmed = (traceConnections && !!selectedId && !isTraced) || (!traceConnections && highlightConnections && !!selectedId && !isConn && !isEdgeSel)
              const edgeClass = [
                'a1-canvas__edge',
                edge.weight === 'heavy' && 'a1-canvas__edge--heavy',
                isEdgeSel && 'a1-canvas__edge--selected',
                (isConn || isTraced) && 'a1-canvas__edge--connection',
                isDimmed && 'a1-canvas__edge--dimmed',
              ].filter(Boolean).join(' ')
              const mx = (p1.x + p2.x) / 2
              const my = (p1.y + p2.y) / 2
              return (
                <g key={edge.id}>
                  {/* Wide invisible stroke for easier click targeting */}
                  <path d={d} fill="none" stroke="transparent" strokeWidth="12"
                    style={{ pointerEvents: 'stroke', cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedId(null)
                      setSelectedEdgeId(prev => prev === edge.id ? null : edge.id)
                    }}
                  />
                  <path d={d} className={edgeClass} fill="none"
                    strokeDasharray={dashArr || undefined}
                    markerEnd={(dir === 'to' || dir === 'both') ? `url(#${uid}-${edge.id}-end)` : undefined}
                    markerStart={(dir === 'from' || dir === 'both') ? `url(#${uid}-${edge.id}-start)` : undefined}
                  />
                  {edge.label && (
                    <text x={mx} y={my - 6} className="a1-canvas__edge-label" textAnchor="middle">
                      {edge.label}
                    </text>
                  )}
                </g>
              )
            })}

            {/* Ghost connector shown while drawing a new edge in edit mode */}
            {connecting && (() => {
              const fromNode = nodeMap[connecting]
              if (!fromNode) return null
              const p1 = getBoundaryPoint(fromNode, mouseCvs.x, mouseCvs.y)
              const d = edgePath(p1, mouseCvs, edgeStyle)
              return (
                <path key="ghost" d={d} className="a1-canvas__edge a1-canvas__edge--ghost"
                  fill="none" style={{ pointerEvents: 'none' }} />
              )
            })()}
          </g>
        </svg>

        {/* Viewport — Node components position themselves absolutely inside this transform layer */}
        <div className="a1-canvas__viewport" style={{ transform: vpTransform, transformOrigin: '0 0' }}>
          {nodeElements}
        </div>

        {showControls && (
          <div className="a1-canvas__controls" onMouseDown={(e) => e.stopPropagation()}>
            <button type="button" className="a1-canvas__ctrl" onClick={() => setZoom(z => Math.min(ZOOM_MAX, z * (1 + ZOOM_STEP)))} aria-label="Zoom in">
              <span className="a1-icon" aria-hidden="true">add</span>
            </button>
            <span className="a1-canvas__zoom-pct" aria-live="polite" aria-atomic="true">{Math.round(zoom * 100)}%</span>
            <button type="button" className="a1-canvas__ctrl" onClick={() => setZoom(z => Math.max(ZOOM_MIN, z * (1 - ZOOM_STEP)))} aria-label="Zoom out">
              <span className="a1-icon" aria-hidden="true">remove</span>
            </button>
            {hasNodes && (
              <button type="button" className="a1-canvas__ctrl" onClick={zoomToFit} aria-label="Zoom to fit all nodes">
                <span className="a1-icon" aria-hidden="true">fit_screen</span>
              </button>
            )}
            <button type="button" className="a1-canvas__ctrl" onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }) }} aria-label="Reset zoom and pan">
              <span className="a1-icon" aria-hidden="true">zoom_in_map</span>
            </button>
          </div>
        )}

        {ctxMenu.open && ctxMenuItems.length > 0 && (
          <ContextMenu
            open
            x={ctxMenu.x}
            y={ctxMenu.y}
            items={ctxMenuItems}
            onClose={closeCtxMenu}
            aria-label={ctxMenu.nodeId ? 'Node actions' : 'Canvas actions'}
          />
        )}
      </div>
    </CanvasCtx.Provider>
  )
}
