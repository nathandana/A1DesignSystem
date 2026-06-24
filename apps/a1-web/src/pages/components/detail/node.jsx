import {
  Button, Canvas, NodeConnector, Node, Code, Stack,
  TextField, Slider, Toolbar, ToolbarGroup, ToolbarDivider, ToolbarToggle,
} from '@gtivr4/a1-design-system-react'
import { useState } from 'react'
import { Choice, FieldState } from './configKit.jsx'

export const bareDisplay = true

// ─── Option lists ─────────────────────────────────────────────────────────────

const SHAPE_OPTIONS = [
  { value: 'circle',    label: 'Circle',    icon: 'circle' },
  { value: 'square',    label: 'Square',    icon: 'square' },
  { value: 'squircle',  label: 'Squircle',  icon: 'rounded_corner' },
  { value: 'rectangle', label: 'Rectangle', icon: 'rectangle' },
]

const SIZE_VALUES = ['sm', 'md', 'lg', 'xl']
const SIZE_DETENTS = [
  { value: 0, label: 'SM' },
  { value: 1, label: 'MD' },
  { value: 2, label: 'LG' },
  { value: 3, label: 'XL' },
]
function sizeToIndex(size) {
  const i = SIZE_VALUES.indexOf(size)
  return i >= 0 ? i : 1
}

const COLOR_SWATCHES = {
  neutral: 'var(--semantic-color-border-default)',
  info:    'var(--semantic-color-status-info-background)',
  success: 'var(--semantic-color-status-success-background)',
  warn:    'var(--semantic-color-status-warn-background)',
  error:   'var(--semantic-color-status-error-background)',
  accent:  'var(--semantic-color-action-background)',
}

const COLOR_TOOLBAR_OPTIONS = [
  { value: 'neutral', label: 'Neutral', swatch: COLOR_SWATCHES.neutral },
  { value: 'info',    label: 'Info',    swatch: COLOR_SWATCHES.info },
  { value: 'success', label: 'Success', swatch: COLOR_SWATCHES.success },
  { value: 'warn',    label: 'Warn',    swatch: COLOR_SWATCHES.warn },
  { value: 'error',   label: 'Error',   swatch: COLOR_SWATCHES.error },
  { value: 'accent',  label: 'Accent',  swatch: COLOR_SWATCHES.accent },
]

const DIRECTION_OPTIONS = [
  { value: 'to',   label: 'To',   icon: 'arrow_forward' },
  { value: 'from', label: 'From', icon: 'arrow_back' },
  { value: 'both', label: 'Both', icon: 'sync_alt' },
  { value: 'none', label: 'None', icon: 'remove' },
]

const EDGE_VARIANT_OPTIONS = [
  { value: 'solid',  label: 'Solid' },
  { value: 'dashed', label: 'Dashed' },
  { value: 'dotted', label: 'Dotted' },
]

const EDGE_STYLE_OPTIONS = [
  { value: 'straight', label: 'Straight', icon: 'remove' },
  { value: 'curved',   label: 'Curved',   icon: 'show_chart' },
  { value: 'elbow',    label: 'Elbow',    icon: 'turn_right' },
]

const ANCHOR_OPTIONS = [
  { value: 'free',      label: 'Free' },
  { value: 'cardinal',  label: '90°', icon: 'add' },
  { value: 'octagonal', label: '45°+90°', icon: 'close' },
]

// ─── Default config ───────────────────────────────────────────────────────────

const DEFAULT_NODES = [
  { id: 'tokens',    label: 'Design tokens',  sublabel: '', shape: 'circle', color: 'neutral', subtle: false, size: 'md', backgroundColor: '', foregroundColor: '', x: 300, y: 120 },
  { id: 'react',     label: 'React',          sublabel: '', shape: 'circle', color: 'info',    subtle: false, size: 'md', backgroundColor: '', foregroundColor: '', x: 140, y: 270 },
  { id: 'native',    label: 'React Native',   sublabel: '', shape: 'circle', color: 'accent',  subtle: false, size: 'md', backgroundColor: '', foregroundColor: '', x: 460, y: 270 },
  { id: 'html',      label: 'HTML / CSS',     sublabel: '', shape: 'circle', color: 'success', subtle: false, size: 'md', backgroundColor: '', foregroundColor: '', x: 300, y: 270 },
  { id: 'storybook', label: 'Storybook',      sublabel: '', shape: 'circle', color: 'warn',    subtle: false, size: 'md', backgroundColor: '', foregroundColor: '', x: 140, y: 420 },
  { id: 'docs',      label: 'Docs',           sublabel: '', shape: 'circle', color: 'error',   subtle: true,  size: 'md', backgroundColor: '', foregroundColor: '', x: 390, y: 420 },
]

const DEFAULT_EDGES = [
  { id: 'e1', from: 'tokens', to: 'react',     direction: 'to',   variant: 'solid',  weight: 'normal', label: '' },
  { id: 'e2', from: 'tokens', to: 'native',    direction: 'to',   variant: 'solid',  weight: 'normal', label: '' },
  { id: 'e3', from: 'tokens', to: 'html',      direction: 'to',   variant: 'solid',  weight: 'normal', label: '' },
  { id: 'e4', from: 'react',  to: 'storybook', direction: 'to',   variant: 'dashed', weight: 'normal', label: '' },
  { id: 'e5', from: 'html',   to: 'docs',      direction: 'to',   variant: 'dashed', weight: 'normal', label: '' },
  { id: 'e6', from: 'react',  to: 'docs',      direction: 'both', variant: 'solid',  weight: 'normal', label: '' },
]

export function getDefaultConfig() {
  return {
    nodes: DEFAULT_NODES.map(n => ({ ...n })),
    edges: DEFAULT_EDGES.map(e => ({ ...e })),
    edgeStyle: 'straight',
    anchorSnap: undefined,
    traceConnections: false,
    selectedId: 'tokens',
    selectedType: 'node',   // 'node' | 'edge'
    activeTab: 'nodes',     // 'nodes' | 'edges'
  }
}

// ─── Snippet ──────────────────────────────────────────────────────────────────

function buildSnippet(config) {
  const { nodes, edges, edgeStyle, anchorSnap, traceConnections } = config
  const canvasParts = [
    edgeStyle !== 'straight' ? `edgeStyle="${edgeStyle}"` : null,
    anchorSnap ? `defaultAnchorSnap="${anchorSnap}"` : null,
    traceConnections ? 'traceConnections' : null,
  ].filter(Boolean)
  const canvasProps = canvasParts.length ? `\n  ${canvasParts.join('\n  ')}` : ''

  const nodeLines = nodes.map(n => {
    const props = [
      `id="${n.id}"`,
      `x={${n.x}}`,
      `y={${n.y}}`,
      `label="${n.label}"`,
      n.sublabel ? `sublabel="${n.sublabel}"` : null,
      n.shape !== 'circle' ? `shape="${n.shape}"` : null,
      !n.backgroundColor && n.color !== 'neutral' ? `color="${n.color}"` : null,
      n.size !== 'md' ? `size="${n.size}"` : null,
      !n.backgroundColor && n.subtle ? 'subtle' : null,
      n.backgroundColor ? `backgroundColor="${n.backgroundColor}"` : null,
      n.foregroundColor ? `foregroundColor="${n.foregroundColor}"` : null,
    ].filter(Boolean).join(' ')
    return `  <Node ${props} />`
  }).join('\n')

  const edgeLines = edges.map(e => {
    const props = [
      `id="${e.id}"`,
      `from="${e.from}"`,
      `to="${e.to}"`,
      e.direction !== 'to' ? `direction="${e.direction}"` : null,
      e.variant !== 'solid' ? `variant="${e.variant}"` : null,
      e.weight === 'heavy' ? 'weight="heavy"' : null,
      e.label ? `label="${e.label}"` : null,
    ].filter(Boolean).join(' ')
    return `  <NodeConnector ${props} />`
  }).join('\n')

  return `<Canvas${canvasProps} aria-label="Node graph">
${nodeLines}
${edgeLines}
</Canvas>`
}

// ─── Preview ──────────────────────────────────────────────────────────────────

export function Preview({ config, setConfig }) {
  const set = (patch) => setConfig(c => ({ ...c, ...patch }))

  const handleNodeMove = (id, x, y) => {
    set({ nodes: config.nodes.map(n => n.id === id ? { ...n, x: Math.round(x), y: Math.round(y) } : n) })
  }

  const handleSelectionChange = (id) => {
    if (id == null) return
    set({ selectedId: id, selectedType: 'node', activeTab: 'nodes' })
  }

  const handleEdgeSelect = (id) => {
    if (id == null) return
    set({ selectedId: id, selectedType: 'edge', activeTab: 'edges' })
  }

  const handleAddNode = (x, y) => {
    const id = nextId('node')
    set({
      nodes: [...config.nodes, { id, label: 'New node', sublabel: '', shape: 'circle', color: 'neutral', subtle: false, size: 'md', backgroundColor: '', foregroundColor: '', x: Math.round(x), y: Math.round(y) }],
      selectedId: id,
      selectedType: 'node',
      activeTab: 'nodes',
    })
  }

  const handleAddEdge = (fromId, toId) => {
    const id = nextId('edge')
    set({
      edges: [...config.edges, { id, from: fromId, to: toId, direction: 'to', variant: 'solid', weight: 'normal', label: '' }],
      selectedId: id,
      selectedType: 'edge',
      activeTab: 'edges',
    })
  }

  const handleDeleteNode = (id) => {
    const nextNodes = config.nodes.filter(n => n.id !== id)
    const nextEdges = config.edges.filter(e => e.from !== id && e.to !== id)
    const wasSelected = config.selectedId === id
    set({
      nodes: nextNodes,
      edges: nextEdges,
      selectedId: wasSelected ? (nextNodes[0]?.id ?? null) : config.selectedId,
      selectedType: wasSelected ? 'node' : config.selectedType,
    })
  }

  const handleDuplicateNode = (id) => {
    const node = config.nodes.find(n => n.id === id)
    if (!node) return
    const newId = nextId('node')
    const dup = { ...node, id: newId, x: node.x + 40, y: node.y + 40 }
    set({
      nodes: [...config.nodes, dup],
      selectedId: newId,
      selectedType: 'node',
      activeTab: 'nodes',
    })
  }

  return (
    <div style={{ width: '100%', height: '520px' }}>
      <Canvas
        mode="edit"
        onNodeMove={handleNodeMove}
        onAddNode={handleAddNode}
        onAddEdge={handleAddEdge}
        onDeleteNode={handleDeleteNode}
        onDuplicateNode={handleDuplicateNode}
        edgeStyle={config.edgeStyle}
        defaultAnchorSnap={config.anchorSnap || undefined}
        traceConnections={config.traceConnections}
        defaultPan={{ x: 40, y: 20 }}
        highlightConnections={!config.traceConnections}
        onSelectionChange={handleSelectionChange}
        onEdgeSelect={handleEdgeSelect}
        aria-label="Node and connector preview"
      >
        {config.nodes.map(n => (
          <Node
            key={n.id}
            id={n.id}
            x={n.x}
            y={n.y}
            label={n.label}
            sublabel={n.sublabel || undefined}
            shape={n.shape}
            color={n.backgroundColor ? undefined : n.color}
            subtle={n.backgroundColor ? false : n.subtle}
            size={n.size}
            backgroundColor={n.backgroundColor || undefined}
            foregroundColor={n.foregroundColor || undefined}
          />
        ))}
        {config.edges.map(e => (
          <NodeConnector
            key={e.id}
            id={e.id}
            from={e.from}
            to={e.to}
            direction={e.direction}
            variant={e.variant}
            weight={e.weight}
            label={e.label || undefined}
          />
        ))}
      </Canvas>
    </div>
  )
}

// ─── Controls ─────────────────────────────────────────────────────────────────

let _nextId = 1
function nextId(prefix) { return `${prefix}-${Date.now()}-${_nextId++}` }

export function Controls({ config, setConfig }) {
  const set = (patch) => setConfig(c => ({ ...c, ...patch }))
  const { nodes, edges, selectedId, selectedType, activeTab } = config

  // ── Node helpers ──
  const selectedNode = selectedType === 'node' ? nodes.find(n => n.id === selectedId) : null
  const updateNode = (id, patch) => set({ nodes: nodes.map(n => n.id === id ? { ...n, ...patch } : n) })

  const addNode = () => {
    const id = nextId('node')
    const x = 200 + (nodes.length % 4) * 80
    const y = 200 + Math.floor(nodes.length / 4) * 120
    set({ nodes: [...nodes, { id, label: 'New node', sublabel: '', shape: 'circle', color: 'neutral', subtle: false, size: 'md', backgroundColor: '', foregroundColor: '', x, y }], selectedId: id, selectedType: 'node', activeTab: 'nodes' })
  }

  const removeNode = (id) => {
    const nextNodes = nodes.filter(n => n.id !== id)
    const nextEdges = edges.filter(e => e.from !== id && e.to !== id)
    const wasSelected = selectedId === id
    set({
      nodes: nextNodes,
      edges: nextEdges,
      selectedId: wasSelected ? (nextNodes[0]?.id ?? null) : selectedId,
      selectedType: wasSelected ? 'node' : selectedType,
    })
  }

  // ── Edge helpers ──
  const selectedEdge = selectedType === 'edge' ? edges.find(e => e.id === selectedId) : null
  const updateEdge = (id, patch) => set({ edges: edges.map(e => e.id === id ? { ...e, ...patch } : e) })

  const addEdge = () => {
    const id = nextId('edge')
    const from = nodes[0]?.id ?? ''
    const to = nodes[1]?.id ?? nodes[0]?.id ?? ''
    set({ edges: [...edges, { id, from, to, direction: 'to', variant: 'solid', weight: 'normal', label: '' }], selectedId: id, selectedType: 'edge', activeTab: 'edges' })
  }

  const removeEdge = (id) => {
    const nextEdges = edges.filter(e => e.id !== id)
    const wasSelected = selectedId === id
    set({
      edges: nextEdges,
      selectedId: wasSelected ? (nextEdges[0]?.id ?? selectedId) : selectedId,
      selectedType: wasSelected ? 'edge' : selectedType,
    })
  }

  // ── Tab bar ──
  const tabStyle = (tab) => ({
    flex: 1,
    padding: 'var(--base-spacing-6) var(--base-spacing-12)',
    border: 'none',
    borderBottom: `2px solid ${activeTab === tab ? 'var(--semantic-color-action-background)' : 'transparent'}`,
    background: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: 'var(--semantic-font-size-body-sm)',
    fontWeight: activeTab === tab ? '600' : '400',
    color: activeTab === tab ? 'var(--semantic-color-action-background)' : 'var(--semantic-color-text-default)',
  })

  // ── Item row ──
  const itemRow = (isSelected, onClick, label, colorDot, onRemove) => (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--base-spacing-8)',
        padding: 'var(--base-spacing-4) var(--base-spacing-8)',
        borderRadius: 'var(--base-radius-md)',
        cursor: 'pointer',
        background: isSelected ? 'var(--semantic-color-action-surface)' : 'transparent',
      }}
    >
      {colorDot && (
        <span style={{
          display: 'inline-block', width: 10, height: 10, borderRadius: '50%',
          background: colorDot, flexShrink: 0, border: '1px solid rgba(0,0,0,0.15)',
        }} />
      )}
      <span style={{
        flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        fontSize: 'var(--semantic-font-size-body-sm)',
      }}>
        {label}
      </span>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onRemove() }}
        aria-label={`Remove ${label}`}
        style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          lineHeight: 1, color: 'var(--semantic-color-text-muted)',
          display: 'flex', alignItems: 'center',
        }}
      >
        <span className="a1-icon" aria-hidden="true" style={{ fontSize: 16 }}>close</span>
      </button>
    </div>
  )

  return (
    <Stack gap="lg">
      {/* Canvas-level settings */}
      <Choice prop="edgeStyle" label="Connector shape" value={config.edgeStyle}
        onChange={(edgeStyle) => set({ edgeStyle })} options={EDGE_STYLE_OPTIONS} />
      <Choice prop="anchorSnap" label="Anchors" value={config.anchorSnap ?? 'free'}
        onChange={(v) => set({ anchorSnap: v === 'free' ? undefined : v })}
        options={ANCHOR_OPTIONS}
      />
      <FieldState
        label="Options"
        items={[
          { key: 'traceConnections', label: 'Trace', icon: 'route', value: config.traceConnections },
        ]}
        onChange={set}
      />

      {/* Tab bar */}
      <div style={{ borderBottom: '1px solid var(--semantic-color-border-subtle)' }}>
        <div style={{ display: 'flex' }}>
          <button style={tabStyle('nodes')} onClick={() => set({ activeTab: 'nodes' })}>
            Nodes ({nodes.length})
          </button>
          <button style={tabStyle('edges')} onClick={() => set({ activeTab: 'edges' })}>
            Connections ({edges.length})
          </button>
        </div>
      </div>

      {/* ── Nodes tab ── */}
      {activeTab === 'nodes' && (
        <Stack gap="sm">
          <Stack gap="xs">
            {nodes.map(n => itemRow(
              selectedId === n.id && selectedType === 'node',
              () => set({ selectedId: n.id, selectedType: 'node' }),
              n.label || n.id,
              n.backgroundColor || COLOR_SWATCHES[n.color] || COLOR_SWATCHES.neutral,
              () => removeNode(n.id),
            ))}
          </Stack>

          <Button size="sm" variant="secondary" onClick={addNode}>Add node</Button>

          {selectedNode && (
            <Stack gap="md" style={{ paddingTop: 'var(--base-spacing-8)', borderTop: '1px solid var(--semantic-color-border-subtle)' }}>
              <TextField
                label="Label"
                size="compact"
                value={selectedNode.label}
                onChange={(e) => updateNode(selectedNode.id, { label: e.target.value })}
              />
              <TextField
                label="Sublabel"
                size="compact"
                value={selectedNode.sublabel}
                onChange={(e) => updateNode(selectedNode.id, { sublabel: e.target.value })}
              />
              <Choice prop="shape" label="Shape" iconOnly value={selectedNode.shape}
                onChange={(shape) => updateNode(selectedNode.id, { shape })} options={SHAPE_OPTIONS} />
              <Slider
                label="Size"
                min={0}
                max={3}
                step={1}
                detents={SIZE_DETENTS}
                value={sizeToIndex(selectedNode.size ?? 'md')}
                onChange={(i) => updateNode(selectedNode.id, { size: SIZE_VALUES[i] })}
                formatValue={(i) => SIZE_VALUES[i]?.toUpperCase() ?? 'MD'}
                size="compact"
              />

              {/* Color + subtle in one toolbar */}
              <div>
                <div style={{ fontSize: 'var(--semantic-font-size-body-sm)', color: 'var(--semantic-color-text-muted)', marginBottom: 'var(--base-spacing-4)' }}>
                  Color
                </div>
                <Toolbar aria-label="Node color and style">
                  <ToolbarGroup
                    value={selectedNode.backgroundColor ? null : selectedNode.color}
                    onChange={(color) => updateNode(selectedNode.id, { color, backgroundColor: '', foregroundColor: '' })}
                    labelMode="selected"
                    options={COLOR_TOOLBAR_OPTIONS}
                    aria-label="Color"
                  />
                  <ToolbarDivider />
                  <ToolbarToggle
                    icon="tonality"
                    label="Subtle"
                    pressed={!selectedNode.backgroundColor && selectedNode.subtle}
                    onChange={(subtle) => updateNode(selectedNode.id, { subtle })}
                    showLabel
                    disabled={!!selectedNode.backgroundColor}
                  />
                </Toolbar>
              </div>

              {/* Custom background color */}
              <div>
                <div style={{ fontSize: 'var(--semantic-font-size-body-sm)', color: 'var(--semantic-color-text-muted)', marginBottom: 'var(--base-spacing-4)' }}>
                  Custom background
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--base-spacing-8)' }}>
                  <input
                    type="color"
                    value={selectedNode.backgroundColor || '#7c3aed'}
                    onChange={(e) => updateNode(selectedNode.id, { backgroundColor: e.target.value })}
                    aria-label="Custom background color"
                    style={{
                      width: 36, height: 36, padding: 2, borderRadius: 'var(--base-radius-md)',
                      border: '1px solid var(--semantic-color-border-default)',
                      background: 'none', cursor: 'pointer', flexShrink: 0,
                    }}
                  />
                  {selectedNode.backgroundColor && (
                    <button
                      type="button"
                      onClick={() => updateNode(selectedNode.id, { backgroundColor: '', foregroundColor: '' })}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                        display: 'flex', alignItems: 'center', gap: 'var(--base-spacing-4)',
                        color: 'var(--semantic-color-text-muted)',
                        fontSize: 'var(--semantic-font-size-body-sm)',
                      }}
                    >
                      <span className="a1-icon" aria-hidden="true" style={{ fontSize: 16 }}>close</span>
                      Clear
                    </button>
                  )}
                </div>
                {selectedNode.backgroundColor && (
                  <div style={{ marginTop: 'var(--base-spacing-8)' }}>
                    <TextField
                      label="Text color"
                      size="compact"
                      value={selectedNode.foregroundColor}
                      onChange={(e) => updateNode(selectedNode.id, { foregroundColor: e.target.value })}
                    />
                  </div>
                )}
              </div>
            </Stack>
          )}
        </Stack>
      )}

      {/* ── Edges tab ── */}
      {activeTab === 'edges' && (
        <Stack gap="sm">
          <Stack gap="xs">
            {edges.map(e => {
              const fromLabel = nodes.find(n => n.id === e.from)?.label ?? e.from
              const toLabel   = nodes.find(n => n.id === e.to)?.label   ?? e.to
              return itemRow(
                selectedId === e.id && selectedType === 'edge',
                () => set({ selectedId: e.id, selectedType: 'edge' }),
                `${fromLabel} → ${toLabel}${e.label ? ` "${e.label}"` : ''}`,
                null,
                () => removeEdge(e.id),
              )
            })}
          </Stack>

          <Button size="sm" variant="secondary" onClick={addEdge}>Add connection</Button>

          {selectedEdge && (
            <Stack gap="md" style={{ paddingTop: 'var(--base-spacing-8)', borderTop: '1px solid var(--semantic-color-border-subtle)' }}>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--semantic-font-size-body-sm)', color: 'var(--semantic-color-text-muted)', marginBottom: 'var(--base-spacing-4)' }}>
                  From
                </label>
                <select
                  value={selectedEdge.from}
                  onChange={(e) => updateEdge(selectedEdge.id, { from: e.target.value })}
                  style={{
                    width: '100%', padding: 'var(--base-spacing-6) var(--base-spacing-8)',
                    border: '1px solid var(--semantic-color-border-default)',
                    borderRadius: 'var(--base-radius-md)',
                    background: 'var(--semantic-color-surface-panel)',
                    color: 'var(--semantic-color-text-default)',
                    fontFamily: 'inherit', fontSize: 'var(--semantic-font-size-body-sm)',
                  }}
                >
                  {nodes.map(n => <option key={n.id} value={n.id}>{n.label || n.id}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--semantic-font-size-body-sm)', color: 'var(--semantic-color-text-muted)', marginBottom: 'var(--base-spacing-4)' }}>
                  To
                </label>
                <select
                  value={selectedEdge.to}
                  onChange={(e) => updateEdge(selectedEdge.id, { to: e.target.value })}
                  style={{
                    width: '100%', padding: 'var(--base-spacing-6) var(--base-spacing-8)',
                    border: '1px solid var(--semantic-color-border-default)',
                    borderRadius: 'var(--base-radius-md)',
                    background: 'var(--semantic-color-surface-panel)',
                    color: 'var(--semantic-color-text-default)',
                    fontFamily: 'inherit', fontSize: 'var(--semantic-font-size-body-sm)',
                  }}
                >
                  {nodes.map(n => <option key={n.id} value={n.id}>{n.label || n.id}</option>)}
                </select>
              </div>
              <TextField
                label="Label"
                size="compact"
                value={selectedEdge.label}
                onChange={(e) => updateEdge(selectedEdge.id, { label: e.target.value })}
              />
              <Choice prop="direction" label="Direction" iconOnly value={selectedEdge.direction}
                onChange={(direction) => updateEdge(selectedEdge.id, { direction })} options={DIRECTION_OPTIONS} />
              <Choice prop="variant" label="Line style" value={selectedEdge.variant}
                onChange={(variant) => updateEdge(selectedEdge.id, { variant })} options={EDGE_VARIANT_OPTIONS} />
              <FieldState
                label="Options"
                items={[
                  { key: 'weight', label: 'Heavy', icon: 'line_weight', value: selectedEdge.weight === 'heavy' },
                ]}
                onChange={({ weight }) => updateEdge(selectedEdge.id, { weight: weight ? 'heavy' : 'normal' })}
              />
            </Stack>
          )}
        </Stack>
      )}
    </Stack>
  )
}

// ─── Snippet ──────────────────────────────────────────────────────────────────

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildSnippet(config)}</Code>
}
