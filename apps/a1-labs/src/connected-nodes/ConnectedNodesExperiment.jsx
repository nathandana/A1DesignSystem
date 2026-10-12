import React, { useState } from 'react'
import { Button, ChoiceGroup, IconButton, Inset, List, ListItem, SelectField, Stack, Switch, TextField } from '@gtivr4/a1-design-system-react'
import { ExperimentLayout } from '../ExperimentLayout.jsx'
import { ConnectedNodesCanvas } from './ConnectedNodesCanvas.jsx'
import { initialNodes, initialConnections } from './sample-graph.js'
import { moveStep } from './graph-model.js'

const options = values => values.map(value => ({ value, label: value.charAt(0).toUpperCase() + value.slice(1) }))
export function ConnectedNodesExperiment({ experiment, onOpenSettings }) {
  const [nodes, setNodes] = useState(initialNodes)
  const [selectedId, setSelectedId] = useState(null)
  const [nodeShape, setNodeShape] = useState('rectangle')
  const [edgeStyle, setEdgeStyle] = useState('curved')
  const [lineStyle, setLineStyle] = useState('solid')
  const [showGrid, setShowGrid] = useState(true)
  const [draggable, setDraggable] = useState(true)
  const [subtle, setSubtle] = useState(true)
  const [resetKey, setResetKey] = useState(0)
  const selected = nodes.find(node => node.id === selectedId)
  const move = (id, x, y) => setNodes(previous => previous.map(node => node.id === id ? { ...node, x, y } : node))
  const rename = label => setNodes(previous => previous.map(node => node.id === selectedId ? { ...node, label } : node))
  const configuration = (
    <Inset space={16}>
      <Stack gap={24}>
        <ChoiceGroup label="Connectors" size="compact" columns={1} value={edgeStyle} onChange={setEdgeStyle} options={options(['straight', 'curved', 'elbow'])} />
        <ChoiceGroup label="Node shape" size="compact" columns={2} value={nodeShape} onChange={setNodeShape} options={options(['circle', 'square', 'squircle', 'rectangle'])} />
        <SelectField label="Line style" value={lineStyle} onChange={event => setLineStyle(event.target.value)}>
          {options(['solid', 'dashed', 'dotted']).map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
        </SelectField>
        <Stack gap={8}>
          <Switch label="Show grid" checked={showGrid} onChange={setShowGrid} />
          <Switch label="Drag nodes" checked={draggable} onChange={setDraggable} />
          <Switch label="Subtle nodes" checked={subtle} onChange={setSubtle} />
        </Stack>
        <Stack gap={12}>
          <SelectField label="Node to edit" value={selectedId ?? ''} onChange={event => setSelectedId(event.target.value || null)}>
            <option value="">Choose a node</option>
            {nodes.map(node => <option key={node.id} value={node.id}>{node.label || node.id}</option>)}
          </SelectField>
          {selected && <>
            <TextField label="Node label" value={selected.label} maxLength={24} error={!selected.label.trim() ? 'Enter a node label.' : undefined} onChange={event => rename(event.target.value)} />
            <Stack direction="row" gap={4} aria-label="Move selected node">
              {[
                ['left', 'arrow_back', -1, 0], ['up', 'arrow_upward', 0, -1],
                ['down', 'arrow_downward', 0, 1], ['right', 'arrow_forward', 1, 0],
              ].map(([direction, icon, dx, dy]) => <IconButton key={direction} variant="tertiary" size="sm" icon={icon}
                label={`Move node ${direction}`} onClick={() => move(selected.id, selected.x + dx * moveStep, selected.y + dy * moveStep)} />)}
            </Stack>
          </>}
        </Stack>
        <Button variant="secondary" onClick={() => { setNodes(initialNodes); setSelectedId(null); setResetKey(value => value + 1) }}>Reset graph</Button>
      </Stack>
    </Inset>
  )
  const labels = Object.fromEntries(nodes.map(node => [node.id, node.label || node.id]))
  return (
    <ExperimentLayout experiment={experiment} onOpenSettings={onOpenSettings} configuration={configuration}>
      <Stack gap={16}>
        <ConnectedNodesCanvas nodes={nodes} connections={initialConnections} onNodeMove={move} onSelectionChange={id => { if (id !== null) setSelectedId(id) }}
          nodeShape={nodeShape} edgeStyle={edgeStyle} lineStyle={lineStyle} showGrid={showGrid} draggable={draggable} subtle={subtle} resetKey={resetKey} />
        <Stack as="details" gap={8}>
          <summary>Connection list</summary>
          <List size="sm">{initialConnections.map(edge => <ListItem key={edge.id}>{labels[edge.from]} → {labels[edge.to]}</ListItem>)}</List>
        </Stack>
      </Stack>
    </ExperimentLayout>
  )
}
