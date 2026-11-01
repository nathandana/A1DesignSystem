import { Canvas, NodeConnector, Node, Code, Stack, Toolbar, ToolbarGroup } from '@gtivr4/a1-design-system-react'
import { useState } from 'react'
import { Choice, FieldState, WithHelp } from './configKit.jsx'
import { CustomColorDialog } from './CustomColorDialog.jsx'
import { CUSTOM_BACKGROUND, canvasBackgroundItems, isCustomCanvasBackground } from './canvasBackground.js'

export const bareDisplay = true

// Demo nodes — fixed shapes/colors (canvas config is canvas-level only)
const DEMO_NODES = [
  { id: 'tokens', x: 300, y: 160, label: 'Design Tokens', shape: 'circle',  color: 'neutral' },
  { id: 'react',  x: 160, y: 340, label: 'React',         shape: 'circle',  color: 'info' },
  { id: 'pure',   x: 440, y: 340, label: 'HTML / CSS',    shape: 'square',  color: 'success' },
]

const DEMO_EDGES = [
  { id: 'e1', from: 'tokens', to: 'react', direction: 'to' },
  { id: 'e2', from: 'tokens', to: 'pure',  direction: 'to' },
  { id: 'e3', from: 'react',  to: 'pure',  direction: 'both', variant: 'dashed' },
]

export function getDefaultConfig() {
  return {
    background: 'panel',
    inverse: false,
    showGrid: true,
    gridType: 'lines',
    gridSpacing: '16',
    showControls: true,
    controlsExpandable: false,
    mode: 'view',
    snapToGrid: false,
  }
}

function buildSnippet(config) {
  const canvasProps = [
    config.background !== 'panel' ? `background="${config.background}"` : null,
    config.inverse ? 'inverse' : null,
    !config.showGrid ? 'showGrid={false}' : null,
    config.showGrid && config.gridType !== 'lines' ? `gridType="${config.gridType}"` : null,
    config.showGrid && config.gridSpacing !== '16' ? `gridSpacing={${config.gridSpacing}}` : null,
    !config.showControls ? 'showControls={false}' : null,
    config.showControls && config.controlsExpandable ? 'controlsExpandable' : null,
    config.mode === 'edit' ? 'mode="edit"' : null,
    config.snapToGrid ? 'snapToGrid' : null,
  ].filter(Boolean)

  const propsStr = canvasProps.length ? `\n  ${canvasProps.join('\n  ')}` : ''

  return `<Canvas${propsStr}
  aria-label="Node graph"
>
  <Node id="tokens" x={300} y={160} label="Design Tokens" />
  <Node id="react"  x={160} y={340} label="React"         color="info" />
  <Node id="pure"   x={440} y={340} label="HTML / CSS"    shape="square" color="success" />
  <NodeConnector id="e1" from="tokens" to="react" />
  <NodeConnector id="e2" from="tokens" to="pure" />
  <NodeConnector id="e3" from="react"  to="pure"  direction="both" variant="dashed" />
</Canvas>`
}

export function Preview({ config }) {
  const [positions, setPositions] = useState(() =>
    Object.fromEntries(DEMO_NODES.map(n => [n.id, { x: n.x, y: n.y }]))
  )

  const handleNodeMove = (id, x, y) => {
    setPositions(prev => ({ ...prev, [id]: { x, y } }))
  }

  return (
    <div style={{ width: '100%', height: '480px' }}>
      <Canvas
        mode={config.mode}
        onNodeMove={config.mode === 'edit' ? handleNodeMove : undefined}
        background={config.background}
        inverse={config.inverse}
        showGrid={config.showGrid}
        gridType={config.gridType}
        gridSpacing={Number(config.gridSpacing)}
        showControls={config.showControls}
        controlsExpandable={config.controlsExpandable}
        snapToGrid={config.snapToGrid}
        defaultPan={{ x: 80, y: 20 }}
        aria-label="Canvas preview"
      >
        {DEMO_NODES.map(n => {
          const pos = config.mode === 'edit' ? positions[n.id] : { x: n.x, y: n.y }
          return (
            <Node
              key={n.id}
              id={n.id}
              x={pos.x}
              y={pos.y}
              label={n.label}
              shape={n.shape}
              color={n.color}
            />
          )
        })}
        {DEMO_EDGES.map(e => (
          <NodeConnector key={e.id} id={e.id} from={e.from} to={e.to}
            direction={e.direction} variant={e.variant}
          />
        ))}
      </Canvas>
    </div>
  )
}

export function Controls({ config, setConfig }) {
  const set = (patch) => setConfig((c) => ({ ...c, ...patch }))
  const [customColorOpen, setCustomColorOpen] = useState(false)
  return (
    <Stack gap="lg">
      <WithHelp helper="Sets the canvas surface — a page, panel or raised token, or a custom color. Check contrast against the grid and content when you use a custom color.">
        <Toolbar label="Background">
          <ToolbarGroup
            aria-label="Background"
            labelMode="selected"
            value={config.background}
            onChange={(background) => {
              if (background === CUSTOM_BACKGROUND) setCustomColorOpen(true)
              else set({ background })
            }}
            options={canvasBackgroundItems(config.background)}
          />
        </Toolbar>
      </WithHelp>
      <CustomColorDialog
        open={customColorOpen}
        value={isCustomCanvasBackground(config.background) ? config.background : ''}
        onClose={() => setCustomColorOpen(false)}
        onApply={(background) => set({ background })}
      />
      <FieldState
        label="Options"
        items={[
          { key: 'showGrid',     label: 'Grid',         icon: 'grid_4x4',   value: config.showGrid },
          { key: 'showControls', label: 'Controls',     icon: 'tune',        value: config.showControls },
          { key: 'controlsExpandable', label: 'Compact controls', icon: 'unfold_more', value: config.controlsExpandable },
          { key: 'inverse',      label: 'Inverse',      icon: 'dark_mode',   value: config.inverse },
          { key: 'snapToGrid',   label: 'Snap to grid', icon: 'grid_on',     value: config.snapToGrid },
        ]}
        onChange={set}
      />
      <Choice prop="mode" label="Mode" value={config.mode} onChange={(mode) => set({ mode })} options={[
        { value: 'view', label: 'View' },
        { value: 'edit', label: 'Edit' },
      ]} />
      <Choice prop="gridType" label="Grid type" value={config.gridType} onChange={(gridType) => set({ gridType })} options={[
        { value: 'lines', label: 'Lines', icon: 'grid_4x4' },
        { value: 'dots', label: 'Dots', icon: 'grain' },
      ]} />
      <Choice prop="gridSpacing" label="Grid" value={config.gridSpacing} onChange={(gridSpacing) => set({ gridSpacing })} options={[
        { value: '1',  label: '1px' },
        { value: '4',  label: '4px' },
        { value: '8',  label: '8px' },
        { value: '16', label: '16px' },
      ]} />
    </Stack>
  )
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildSnippet(config)}</Code>
}
