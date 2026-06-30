import { useState } from 'react'
import { Canvas, CanvasEdge, Node } from './Canvas.jsx'
import { Snackbar } from '../snackbar/Snackbar.jsx'

export default {
  title: 'Components/Canvas',
  component: Canvas,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    background: {
      control: 'inline-radio',
      options: ['page', 'panel', 'raised'],
    },
    inverse: { control: 'boolean' },
    mode: {
      control: 'inline-radio',
      options: ['view', 'edit'],
    },
    showGrid: { control: 'boolean' },
    gridType: {
      control: 'inline-radio',
      options: ['lines', 'dots'],
    },
    gridSpacing: { control: { type: 'number', min: 1, max: 64, step: 1 } },
    showControls: { control: 'boolean' },
    defaultZoom: { control: { type: 'number', min: 0.1, max: 4, step: 0.1 } },
  },
}

// Compositional API — nodes and edges as JSX children
export const Default = {
  render: (args) => (
    <div style={{ width: '100%', height: '600px' }}>
      <Canvas {...args} defaultPan={{ x: 60, y: 40 }}>
        <Node id="tokens"    x={300} y={160} label="Design Tokens"  color="neutral"  shape="circle" />
        <Node id="react"     x={160} y={340} label="React"           color="info"     shape="circle" />
        <Node id="native"    x={300} y={340} label="React Native"    color="accent"   shape="circle" />
        <Node id="pure"      x={440} y={340} label="HTML / CSS"      color="success"  shape="circle" />
        <Node id="storybook" x={300} y={510} label="Storybook"       color="warn"     shape="circle" />
        <CanvasEdge id="e1" from="tokens" to="react"     direction="to" />
        <CanvasEdge id="e2" from="tokens" to="native"    direction="to" />
        <CanvasEdge id="e3" from="tokens" to="pure"      direction="to" />
        <CanvasEdge id="e4" from="react"  to="storybook" direction="to" variant="dashed" />
        <CanvasEdge id="e5" from="pure"   to="storybook" direction="to" variant="dashed" />
      </Canvas>
    </div>
  ),
  args: {
    background: 'panel',
    mode: 'view',
    showGrid: true,
    gridType: 'lines',
    gridSpacing: 16,
    showControls: true,
    'aria-label': 'A1 Design System architecture',
  },
}

// Edit mode — drag nodes to reposition; positions tracked via onNodeMove
export const EditMode = {
  render: (args) => {
    const initial = {
      tokens:    { x: 300, y: 160 },
      react:     { x: 160, y: 340 },
      native:    { x: 300, y: 340 },
      pure:      { x: 440, y: 340 },
      storybook: { x: 300, y: 510 },
    }
    const [pos, setPos] = useState(initial)
    const move = (id, x, y) => setPos(prev => ({ ...prev, [id]: { x, y } }))
    return (
      <div style={{ width: '100%', height: '600px' }}>
        <Canvas {...args} mode="edit" onNodeMove={move} defaultPan={{ x: 60, y: 40 }}>
          <Node id="tokens"    x={pos.tokens.x}    y={pos.tokens.y}    label="Design Tokens"  color="neutral"  shape="circle" />
          <Node id="react"     x={pos.react.x}     y={pos.react.y}     label="React"           color="info"     shape="circle" />
          <Node id="native"    x={pos.native.x}    y={pos.native.y}    label="React Native"    color="accent"   shape="circle" />
          <Node id="pure"      x={pos.pure.x}      y={pos.pure.y}      label="HTML / CSS"      color="success"  shape="circle" />
          <Node id="storybook" x={pos.storybook.x} y={pos.storybook.y} label="Storybook"       color="warn"     shape="circle" />
          <CanvasEdge id="e1" from="tokens" to="react"     direction="to" />
          <CanvasEdge id="e2" from="tokens" to="native"    direction="to" />
          <CanvasEdge id="e3" from="tokens" to="pure"      direction="to" />
          <CanvasEdge id="e4" from="react"  to="storybook" direction="to" variant="dashed" />
          <CanvasEdge id="e5" from="pure"   to="storybook" direction="to" variant="dashed" />
        </Canvas>
      </div>
    )
  },
  args: {
    background: 'panel',
    showGrid: true,
    showControls: true,
    'aria-label': 'Editable canvas — drag nodes to reposition',
  },
}

export const Shapes = {
  render: () => (
    <div style={{ width: '100%', height: '300px' }}>
      <Canvas defaultPan={{ x: 60, y: 80 }} aria-label="Node shapes">
        <Node id="c"  x={100} y={100} label="Circle"    shape="circle"    color="info" />
        <Node id="s"  x={260} y={100} label="Square"    shape="square"    color="success" />
        <Node id="sq" x={420} y={100} label="Squircle"  shape="squircle"  color="accent" />
        <Node id="r"  x={580} y={100} label="Rectangle" shape="rectangle" color="warn" />
        <CanvasEdge id="e1" from="c"  to="s"  direction="to" />
        <CanvasEdge id="e2" from="s"  to="sq" direction="both" />
        <CanvasEdge id="e3" from="sq" to="r"  direction="to" variant="dashed" />
      </Canvas>
    </div>
  ),
}

export const Colors = {
  render: () => (
    <div style={{ width: '100%', height: '380px' }}>
      <Canvas defaultPan={{ x: 60, y: 60 }} aria-label="Node color variants">
        <Node id="n"  x={100} y={100} label="Neutral" color="neutral" />
        <Node id="i"  x={240} y={100} label="Info"    color="info" />
        <Node id="s"  x={380} y={100} label="Success" color="success" />
        <Node id="w"  x={520} y={100} label="Warn"    color="warn" />
        <Node id="e"  x={660} y={100} label="Error"   color="error" />
        <Node id="a"  x={800} y={100} label="Accent"  color="accent" />
        <Node id="ns" x={100} y={240} label="Neutral" color="neutral" subtle />
        <Node id="is" x={240} y={240} label="Info"    color="info"    subtle />
        <Node id="ss" x={380} y={240} label="Success" color="success" subtle />
        <Node id="ws" x={520} y={240} label="Warn"    color="warn"    subtle />
        <Node id="es" x={660} y={240} label="Error"   color="error"   subtle />
        <Node id="as" x={800} y={240} label="Accent"  color="accent"  subtle />
      </Canvas>
    </div>
  ),
}

export const EdgeVariants = {
  render: () => (
    <div style={{ width: '100%', height: '380px' }}>
      <Canvas defaultPan={{ x: 60, y: 60 }} aria-label="Edge variants">
        <Node id="a" x={80}  y={80}  label="A" />
        <Node id="b" x={280} y={80}  label="B" color="info" />
        <Node id="c" x={80}  y={240} label="C" color="success" />
        <Node id="d" x={280} y={240} label="D" color="warn" />
        <Node id="f" x={480} y={160} label="E" color="accent" />
        <CanvasEdge id="e1" from="a" to="b" direction="to"   variant="solid"  label="depends on" />
        <CanvasEdge id="e2" from="a" to="c" direction="from" variant="solid" />
        <CanvasEdge id="e3" from="b" to="d" direction="both" variant="dashed" />
        <CanvasEdge id="e4" from="c" to="d" direction="none" variant="dotted" weight="heavy" />
        <CanvasEdge id="e5" from="d" to="f" direction="to"   variant="solid"  weight="heavy" />
      </Canvas>
    </div>
  ),
}

export const NoGrid = {
  render: () => (
    <div style={{ width: '100%', height: '400px' }}>
      <Canvas showGrid={false} defaultPan={{ x: 60, y: 40 }} aria-label="Canvas without grid">
        <Node id="tokens"    x={300} y={160} label="Design Tokens"  color="neutral" />
        <Node id="react"     x={160} y={340} label="React"           color="info" />
        <Node id="native"    x={300} y={340} label="React Native"    color="accent" />
        <Node id="pure"      x={440} y={340} label="HTML / CSS"      color="success" />
        <Node id="storybook" x={300} y={510} label="Storybook"       color="warn" />
        <CanvasEdge id="e1" from="tokens" to="react"     direction="to" />
        <CanvasEdge id="e2" from="tokens" to="native"    direction="to" />
        <CanvasEdge id="e3" from="tokens" to="pure"      direction="to" />
        <CanvasEdge id="e4" from="react"  to="storybook" direction="to" variant="dashed" />
        <CanvasEdge id="e5" from="pure"   to="storybook" direction="to" variant="dashed" />
      </Canvas>
    </div>
  ),
}

export const DotGrid = {
  render: () => (
    <div style={{ width: '100%', height: '400px' }}>
      <Canvas gridType="dots" gridSpacing={16} defaultPan={{ x: 60, y: 40 }} aria-label="Canvas with dot grid">
        <Node id="tokens"    x={300} y={160} label="Design Tokens"  color="neutral" />
        <Node id="react"     x={160} y={340} label="React"           color="info" />
        <Node id="native"    x={300} y={340} label="React Native"    color="accent" />
        <Node id="pure"      x={440} y={340} label="HTML / CSS"      color="success" />
        <Node id="storybook" x={300} y={510} label="Storybook"       color="warn" />
        <CanvasEdge id="e1" from="tokens" to="react"     direction="to" />
        <CanvasEdge id="e2" from="tokens" to="native"    direction="to" />
        <CanvasEdge id="e3" from="tokens" to="pure"      direction="to" />
        <CanvasEdge id="e4" from="react"  to="storybook" direction="to" variant="dashed" />
        <CanvasEdge id="e5" from="pure"   to="storybook" direction="to" variant="dashed" />
      </Canvas>
    </div>
  ),
  parameters: { docs: { description: { story: 'Dot grid: one token-coloured dot is drawn every gridSpacing pixels in both directions.' } } },
}

// Context menu + snap to grid in edit mode
export const ContextMenuAndSnap = {
  render: () => {
    const initial = {
      tokens:    { x: 312, y: 168 },
      react:     { x: 168, y: 336 },
      native:    { x: 312, y: 336 },
      pure:      { x: 456, y: 336 },
      storybook: { x: 312, y: 504 },
    }
    const [pos, setPos] = useState(initial)
    const [nodes, setNodes] = useState(Object.keys(initial))
    const [toast, setToast] = useState(null)
    const move = (id, x, y) => setPos(prev => ({ ...prev, [id]: { x, y } }))
    const deleteNode = (id) => {
      setNodes(prev => prev.filter(n => n !== id))
      setToast(`Deleted ${id}`)
    }
    const ALL = {
      tokens: { label: 'Design Tokens', color: 'neutral' },
      react:  { label: 'React',          color: 'info' },
      native: { label: 'React Native',   color: 'accent' },
      pure:   { label: 'HTML / CSS',     color: 'success' },
      storybook: { label: 'Storybook',   color: 'warn' },
    }
    const EDGES = [
      { id: 'e1', from: 'tokens', to: 'react' },
      { id: 'e2', from: 'tokens', to: 'native' },
      { id: 'e3', from: 'tokens', to: 'pure' },
      { id: 'e4', from: 'react',  to: 'storybook', variant: 'dashed' },
      { id: 'e5', from: 'pure',   to: 'storybook', variant: 'dashed' },
    ].filter(e => nodes.includes(e.from) && nodes.includes(e.to))
    return (
      <div style={{ width: '100%', height: '600px' }}>
        <Canvas
          mode="edit"
          snapToGrid
          onNodeMove={move}
          onDeleteNode={deleteNode}
          nodeMenuItems={(id) => [
            { id: 'inspect', label: 'Inspect', icon: 'info', onClick: () => setToast(`Inspecting ${id}`) },
          ]}
          defaultPan={{ x: 60, y: 40 }}
          aria-label="Context menu + snap-to-grid demo"
        >
          {nodes.map(id => (
            <Node key={id} id={id} x={pos[id].x} y={pos[id].y}
              label={ALL[id].label} color={ALL[id].color} />
          ))}
          {EDGES.map(e => <CanvasEdge key={e.id} {...e} direction="to" />)}
        </Canvas>
        <Snackbar open={!!toast} onClose={() => setToast(null)}>{toast}</Snackbar>
      </div>
    )
  },
  parameters: { docs: { description: { story: 'Edit mode with snap-to-grid and a context menu. Right-click a node to see "Inspect" and "Delete"; right-click the canvas for zoom controls.' } } },
}

export const PageBackground = {
  render: () => (
    <div style={{ width: '100%', height: '400px' }}>
      <Canvas background="page" defaultPan={{ x: 60, y: 40 }} aria-label="Canvas on page background">
        <Node id="tokens"    x={300} y={160} label="Design Tokens"  color="neutral" />
        <Node id="react"     x={160} y={340} label="React"           color="info" />
        <Node id="native"    x={300} y={340} label="React Native"    color="accent" />
        <Node id="pure"      x={440} y={340} label="HTML / CSS"      color="success" />
        <Node id="storybook" x={300} y={510} label="Storybook"       color="warn" />
        <CanvasEdge id="e1" from="tokens" to="react"     direction="to" />
        <CanvasEdge id="e2" from="tokens" to="native"    direction="to" />
        <CanvasEdge id="e3" from="tokens" to="pure"      direction="to" />
        <CanvasEdge id="e4" from="react"  to="storybook" direction="to" variant="dashed" />
        <CanvasEdge id="e5" from="pure"   to="storybook" direction="to" variant="dashed" />
      </Canvas>
    </div>
  ),
}

export const ElbowEdges = {
  render: () => (
    <div style={{ width: '100%', height: '400px' }}>
      <Canvas edgeStyle="elbow" defaultPan={{ x: 60, y: 40 }} aria-label="Elbow edge routing">
        <Node id="tokens"    x={200} y={160} label="Design Tokens"  color="neutral" />
        <Node id="react"     x={80}  y={340} label="React"           color="info" />
        <Node id="native"    x={200} y={340} label="React Native"    color="accent" />
        <Node id="pure"      x={320} y={340} label="HTML / CSS"      color="success" />
        <Node id="storybook" x={200} y={500} label="Storybook"       color="warn" />
        <CanvasEdge id="e1" from="tokens" to="react"     direction="to" />
        <CanvasEdge id="e2" from="tokens" to="native"    direction="to" />
        <CanvasEdge id="e3" from="tokens" to="pure"      direction="to" />
        <CanvasEdge id="e4" from="react"  to="storybook" direction="to" variant="dashed" />
        <CanvasEdge id="e5" from="pure"   to="storybook" direction="to" variant="dashed" />
      </Canvas>
    </div>
  ),
  parameters: { docs: { description: { story: 'Orthogonal elbow routing: edges exit from the nearest cardinal face and turn at right angles with rounded 16px corners.' } } },
}

export const Inverse = {
  render: () => (
    <div style={{ width: '100%', height: '400px' }}>
      <Canvas inverse defaultPan={{ x: 60, y: 40 }} aria-label="Inverse canvas">
        <Node id="tokens"    x={300} y={160} label="Design Tokens"  color="neutral" subtle />
        <Node id="react"     x={160} y={340} label="React"           color="info"    subtle />
        <Node id="native"    x={300} y={340} label="React Native"    color="accent"  subtle />
        <Node id="pure"      x={440} y={340} label="HTML / CSS"      color="success" subtle />
        <Node id="storybook" x={300} y={510} label="Storybook"       color="warn"    subtle />
        <CanvasEdge id="e1" from="tokens" to="react"     direction="to" />
        <CanvasEdge id="e2" from="tokens" to="native"    direction="to" />
        <CanvasEdge id="e3" from="tokens" to="pure"      direction="to" />
        <CanvasEdge id="e4" from="react"  to="storybook" direction="to" variant="dashed" />
        <CanvasEdge id="e5" from="pure"   to="storybook" direction="to" variant="dashed" />
      </Canvas>
    </div>
  ),
  parameters: { docs: { description: { story: 'Canvas with `inverse` — dark surface with inverse text, mirroring Section\'s inverse prop.' } } },
}
