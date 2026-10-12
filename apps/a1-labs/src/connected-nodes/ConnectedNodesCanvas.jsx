import React, { useLayoutEffect, useRef, useState } from 'react'
import { Canvas, Node, NodeConnector } from '@gtivr4/a1-design-system-react'
import { fitGraph, moveStep } from './graph-model.js'

// Composition of existing A1 primitives: no graph rendering or interaction fork.
// The host owns graph data and configuration; resizing refits without losing positions.
export function ConnectedNodesCanvas({ nodes, connections, onNodeMove, onSelectionChange,
  nodeShape = 'rectangle', edgeStyle = 'curved', lineStyle = 'solid', showGrid = true,
  draggable = true, subtle = true, resetKey = 0, label = 'Connected nodes' }) {
  const host = useRef(null)
  const [bounds, setBounds] = useState(null)
  useLayoutEffect(() => {
    const element = host.current
    const observer = new ResizeObserver(() => {
      const { width, height } = element.getBoundingClientRect()
      setBounds(previous => previous?.width === width && previous?.height === height ? previous : { width, height })
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  const view = bounds ? fitGraph(nodes, bounds.width, bounds.height) : null
  return (
    <div ref={host} className="a1-connected-nodes" style={{ height: 'var(--base-width-xl)', minWidth: 0 }}>
      {view && <Canvas key={`${bounds.width}-${bounds.height}-${resetKey}`} aria-label={label}
        mode="view" draggableNodes={draggable} onNodeMove={onNodeMove} onSelectionChange={onSelectionChange}
        defaultZoom={view.zoom} defaultPan={view.pan} edgeStyle={edgeStyle}
        showGrid={showGrid} gridType="dots" gridSpacing={moveStep} snapToGrid
        highlightConnections background="panel">
        {nodes.map(node => <Node key={node.id} {...node} label={node.label || node.id} shape={nodeShape} subtle={subtle} />)}
        {connections.map(connection => <NodeConnector key={connection.id} {...connection} variant={lineStyle} />)}
      </Canvas>}
    </div>
  )
}
