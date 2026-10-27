import { useState } from 'react'
import { Canvas, CanvasEdge, CanvasFrame, Node } from './Canvas.jsx'
import { Snackbar } from '../snackbar/Snackbar.jsx'
import { Heading } from '../heading/Heading.jsx'
import { Paragraph } from '../paragraph/Paragraph.jsx'
import { Inset } from '../inset/Inset.jsx'
import { Toolbar, ToolbarToggle } from '../toolbar/Toolbar.jsx'
import { StickyNote } from '../sticky-note/StickyNote.jsx'

export default {
  title: 'Components/Canvas',
  component: Canvas,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    background: {
      control: 'select',
      options: ['page', 'panel', 'raised', '#E8EEF4'],
      description: 'Surface token (page / panel / raised) or any custom CSS colour',
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
    controlsExpandable: { control: 'boolean', description: 'Collapse the controls to one compact toggle that expands on click' },
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

// A custom CSS colour background — the escape hatch shared with Section / Card
// `surface`. Check contrast against the grid and content manually.
export const CustomBackground = {
  render: () => (
    <div style={{ width: '100%', height: '400px' }}>
      <Canvas background="#E8EEF4" defaultPan={{ x: 60, y: 40 }} aria-label="Canvas with a custom background">
        <Node id="tokens" x={300} y={160} label="Design Tokens" color="neutral" />
        <Node id="react"  x={160} y={340} label="React"         color="info" />
        <Node id="pure"   x={440} y={340} label="HTML / CSS"    color="success" />
        <CanvasEdge id="e1" from="tokens" to="react" direction="to" />
        <CanvasEdge id="e2" from="tokens" to="pure"  direction="to" />
      </Canvas>
    </div>
  ),
}

// CanvasFrame — titled containers for arbitrary content, positioned by their
// top-left corner. Drag a frame (or focus its title and use the arrow keys) to
// move it; connectors route between frames like nodes.
function FrameContent({ title, lines }) {
  return (
    <Inset space={24}>
      <Heading as="h2" size="md">{title}</Heading>
      {Array.from({ length: lines }, (_, i) => <Paragraph key={i}>Sample content line {i + 1}.</Paragraph>)}
    </Inset>
  )
}

export const Frames = {
  render: function FramesStory() {
    const [pos, setPos] = useState({ home: { x: 0, y: 0 }, about: { x: 560, y: 80 }, contact: { x: 960, y: 0 } })
    const move = (id, x, y) => setPos((p) => ({ ...p, [id]: { x, y } }))
    return (
      <div style={{ width: '100%', height: '520px' }}>
        <Canvas draggableNodes onNodeMove={move} defaultZoom={0.6} defaultPan={{ x: 40, y: 40 }} edgeStyle="curved" aria-label="Page frames">
          <CanvasFrame id="home" {...pos.home} width={480} label="Home · LG"><FrameContent title="Home" lines={6} /></CanvasFrame>
          <CanvasFrame id="about" {...pos.about} width={320} label="About · XS"><FrameContent title="About" lines={10} /></CanvasFrame>
          <CanvasFrame id="contact" {...pos.contact} width={320} height={240} scrollable label="Contact · scrolls"><FrameContent title="Contact" lines={12} /></CanvasFrame>
          <CanvasEdge id="home-about" from="home" to="about" direction="to" />
          <CanvasEdge id="about-contact" from="about" to="contact" direction="to" />
        </Canvas>
      </div>
    )
  },
}

// Expandable controls — zoom in/out and `controlsActions` always show; the toggle
// reveals fit, reset and any `controlsContent` (here, a view-options toolbar).
export const ExpandableControls = {
  render: function ExpandableControlsStory() {
    const [grid, setGrid] = useState(true)
    return (
      <div style={{ width: '100%', height: '400px' }}>
        <Canvas
          showGrid={grid}
          controlsExpandable
          controlsActions={[{ id: 'grid', icon: 'grid_4x4', label: 'Toggle grid', onClick: () => setGrid((g) => !g) }]}
          controlsContent={(
            <Toolbar aria-label="View options">
              <ToolbarToggle icon="grid_4x4" label="Grid" pressed={grid} onChange={setGrid} />
            </Toolbar>
          )}
          defaultPan={{ x: 60, y: 40 }}
          aria-label="Canvas with expandable controls"
        >
          <Node id="tokens" x={300} y={160} label="Design Tokens" />
          <Node id="react"  x={160} y={340} label="React" color="info" />
          <CanvasEdge id="e1" from="tokens" to="react" direction="to" />
        </Canvas>
      </div>
    )
  },
}

// Sticky notes — `variant="plain"` frames carry content with its own surface.
// Add a note from the controls or "Add sticky note here" on the canvas menu: it
// lands in view, `focusZoom` zooms to it and it opens for editing in place.
export const StickyNotes = {
  render: function StickyNotesStory() {
    const [notes, setNotes] = useState([
      { id: 'n1', x: 0, y: 0, title: 'Kickoff', content: 'Agree the **launch date** with marketing.', color: 'yellow' },
      { id: 'n2', x: 320, y: 60, title: 'Copy', content: '- Hero headline\n- Pricing FAQ', color: 'blue' },
    ])
    const [editingId, setEditingId] = useState(null)
    const [focus, setFocus] = useState(null)
    const update = (id, patch) => setNotes((list) => list.map((n) => (n.id === id ? { ...n, ...patch } : n)))
    const add = (point) => {
      const id = `n${Date.now()}`
      setNotes((list) => [...list, { id, x: point.x - 128, y: point.y - 80, title: '', content: '', color: 'pink' }])
      setFocus({ id })
      setEditingId(id)
    }
    return (
      <div style={{ width: '100%', height: '480px' }}>
        <Canvas
          draggableNodes
          onNodeMove={(id, x, y) => update(id, { x, y })}
          onNodeDoubleClick={setEditingId}
          focusNodeId={focus?.id}
          focusZoom={1}
          defaultZoom={0.8}
          defaultPan={{ x: 60, y: 60 }}
          controlsExpandable
          controlsActions={[{ id: 'add', icon: 'note_add', label: 'Add sticky note', onClick: ({ center }) => add(center) }]}
          canvasMenuItems={(point) => [{ id: 'add', label: 'Add sticky note here', icon: 'note_add', onClick: () => add(point) }]}
          aria-label="Sticky notes"
        >
          {notes.map((note) => (
            <CanvasFrame key={note.id} id={note.id} variant="plain" x={note.x} y={note.y} width={256} label={note.title || 'Sticky note'}>
              <StickyNote
                title={note.title || undefined}
                color={note.color}
                width="auto"
                titleAs="p"
                editing={editingId === note.id}
                onTitleChange={(title) => update(note.id, { title })}
                onContentChange={(content) => update(note.id, { content })}
                onEditingChange={(next) => { if (!next) setEditingId(null) }}
              >
                {note.content}
              </StickyNote>
            </CanvasFrame>
          ))}
        </Canvas>
      </div>
    )
  },
}
