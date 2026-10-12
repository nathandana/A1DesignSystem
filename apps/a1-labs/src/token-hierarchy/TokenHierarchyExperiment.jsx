import React, { useEffect, useMemo, useState } from 'react'
import { Button, ButtonContainer, Card, ChoiceGroup, Code, Grid, Heading, Inset, Paragraph, Section, SelectField, Stack, TreeMenu } from '@gtivr4/a1-design-system-react'
import { ExperimentLayout } from '../ExperimentLayout.jsx'
import { cssToken, flattenTrace, indexTokens, tracePaths, traceToken } from './hierarchy-model.js'
const documents = import.meta.glob('../../../../system/tokens/**/*.json', { eager: true, import: 'default' })
const index = indexTokens(documents)
const examples = ['semantic.color.surface.card', 'component.button.primary.background', 'component.card.borderColor', 'component.card.padding', 'component.card.borderRadius', 'semantic.spacing.gap.md', 'semantic.font.size.heading.md', 'component.link.color', 'semantic.motion.duration.slow'].filter(path => index[path])
const views = [{ value: 'cards', label: 'Linked cards' }, { value: 'tree', label: 'Nested tree' }, { value: 'breadcrumb', label: 'Breadcrumb trails' }, { value: 'steps', label: 'Step by step' }]
const format = value => typeof value === 'string' ? value : JSON.stringify(value)
function Definition({ node }) {
  return <Stack gap={8}>
    <Paragraph size="xs" color="muted">{node.path.split('.')[0]} · {node.children.length ? 'Alias' : 'Source value'}</Paragraph>
    <Code wrapping>{cssToken(node.path)}</Code>
    <Paragraph size="sm">{node.error || format(node.value)}</Paragraph>
    <Paragraph size="xs" color="muted">{node.source?.split('/system/')[1]}</Paragraph>
    {node.children.length > 0 && <Paragraph size="sm">References: {node.children.map(child => child.path).join(', ')}</Paragraph>}
  </Stack>
}
export function TokenHierarchyExperiment({ experiment, onOpenSettings }) {
  const [path, setPath] = useState(examples[0]), [view, setView] = useState('cards'), [step, setStep] = useState(0), [selected, setSelected] = useState(null), [liveValue, setLiveValue] = useState('')
  const trace = useMemo(() => traceToken(index, path), [path]), nodes = useMemo(() => flattenTrace(trace), [trace])
  const [expanded, setExpanded] = useState(nodes.map(node => node.id))
  const current = nodes.find(node => node.id === selected) ?? nodes[0]
  useEffect(() => { setStep(0); setSelected(null); setExpanded(nodes.map(node => node.id)) }, [nodes])
  useEffect(() => {
    const read = () => setLiveValue(getComputedStyle(document.documentElement).getPropertyValue(cssToken(path)).trim())
    read(); const observer = new MutationObserver(read); observer.observe(document.documentElement, { attributes: true }); return () => observer.disconnect()
  }, [path])
  const treeItem = node => ({ id: node.id, label: node.path, children: node.children.length ? node.children.map(treeItem) : undefined })
  return <ExperimentLayout experiment={experiment} onOpenSettings={onOpenSettings} configuration={
    <Inset space={16}><Stack gap={24}>
      <SelectField label="Token to trace" value={path} onChange={event => setPath(event.target.value)}>{examples.map(example => <option key={example} value={example}>{cssToken(example)}</option>)}</SelectField>
      <ChoiceGroup label="Hierarchy presentation" columns={1} size="compact" value={view} onChange={setView} options={views} />
      <Paragraph size="sm" color="muted">Trace authored references from system/tokens to their literal source. Each view uses the same data, with missing references and cycles identified explicitly.</Paragraph>
    </Stack></Inset>
  }><Section padding="none" contentWidth="md"><Stack gap={24} className="a1-token-hierarchy" data-view={view}>
    <Stack gap={8}><Code wrapping>{cssToken(path)}</Code></Stack>
    <Card><Stack gap={8}><Heading as="h3" size="sm">Active computed value</Heading><Code wrapping>{liveValue || 'No runtime CSS value'}</Code><Paragraph size="sm" color="muted">From the current theme and mode. This may differ from the source value below.</Paragraph></Stack></Card>
    {view === 'cards' && <Grid columns={{ xs: 1, lg: 2 }} gap={16}>{nodes.map((node, position) => <Card key={node.id} icon={node.children.length ? 'arrow_forward' : 'check'}><Stack gap={12}><Heading as="h3" size="sm">{position + 1}. {node.children.length ? 'References another token' : 'Source reached'}</Heading><Definition node={node} /></Stack></Card>)}</Grid>}
    {view === 'tree' && <Stack gap={16}><Card><TreeMenu aria-label="Token reference hierarchy" items={[treeItem(trace)]} expandedIds={expanded} onExpandedChange={setExpanded} selectedId={current.id} onSelect={setSelected} showExpandControls /></Card><Card><Definition node={current} /></Card></Stack>}
    {view === 'breadcrumb' && <Stack gap={16}>{tracePaths(trace).map((trail, index) => <Card key={index}><Stack gap={12}><Heading as="h3" size="sm">Reference trail {index + 1}</Heading><Stack direction="row" wrap align="center" gap={8}>{trail.slice().reverse().map((node, position) => <React.Fragment key={node.id}>{position > 0 && <Paragraph aria-hidden="true">→</Paragraph>}<Button size="sm" variant={node.id === current.id ? 'primary' : 'tertiary'} aria-pressed={node.id === current.id} onClick={() => setSelected(node.id)}>{node.path}</Button></React.Fragment>)}</Stack></Stack></Card>)}<Card><Definition node={current} /></Card></Stack>}
    {view === 'steps' && <Stack gap={16}><Paragraph role="status" aria-live="polite">Step {Math.min(step, nodes.length - 1) + 1} of {nodes.length}</Paragraph><Card><Definition node={nodes[Math.min(step, nodes.length - 1)]} /></Card><ButtonContainer align="start"><Button variant="secondary" disabled={step === 0} onClick={() => setStep(step - 1)}>Previous reference</Button><Button disabled={step >= nodes.length - 1} onClick={() => setStep(step + 1)}>Follow reference</Button></ButtonContainer></Stack>}
  </Stack></Section></ExperimentLayout>
}
