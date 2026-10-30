import { useState } from 'react'
import { Accordion, Button, Code, IconButton, OverflowMenu, Paragraph, Stack, TextField } from '@gtivr4/a1-design-system-react'
import { Choice, Toggle } from './configKit.jsx'
import { IconSelect } from './IconSelect.jsx'
import { nodeToJsx } from '../../../editor/definitionToJsx.ts'
import { overflowMenuActions } from '../../../editor/pageRenderer.tsx'
import { Controls as VerificationControls, fromJson as verificationFromJson, toJson as verificationToJson } from './verification-dialog.jsx'
import { createPatternNode, getPatternManifest } from '../../../../../../packages/react/src/patterns/patternPolicies.js'

const manifest = getPatternManifest('OverflowMenu')
export const jsonType = manifest.type
export const acceptsJsonChildren = true
export const bareDisplay = true

export function getDefaultConfig() { return { label: '', size: 'md', disabled: false, actions: structuredClone(manifest.examples[0].props.actions) } }
export function configFromProps(props) {
  return { ...getDefaultConfig(), ...props, sourceProps: props, actions: props.actions ?? [] }
}
export function propsFromConfig(config) {
  const props = { ...config.sourceProps }
  for (const key of ['label', 'size', 'disabled', 'actions']) delete props[key]
  if (config.label) props.label = config.label
  if (config.size && config.size !== 'md') props.size = config.size
  if (config.disabled) props.disabled = true
  if (config.actions?.length) props.actions = config.actions
  return props
}
export function fromJson(node) { return { ...configFromProps(node.props ?? {}), sourceNode: node } }
export function toJson(config) {
  const source = config.sourceNode ?? {}
  return { node: { ...source, id: source.id ?? 'overflow-menu-1', type: jsonType, patternVersion: source.patternVersion ?? manifest.version, props: propsFromConfig(config), children: [] } }
}
export const examples = manifest.examples.map(example => ({
  id: example.id,
  title: example.id === 'verify-duplicate' ? 'Verify Duplicate' : 'Edit, Duplicate, Delete',
  description: example.id === 'verify-duplicate' ? 'Any action can require verification, including Duplicate.' : 'Delete asks for verification; Edit and Duplicate run immediately.',
  config: configFromProps(example.props),
}))

export function Preview({ config }) {
  const [feedback, setFeedback] = useState('')
  // Navigation is demonstrated through feedback rather than leaving the configurator.
  const actions = overflowMenuActions((config.actions ?? []).map(({ href: _href, ...action }) => action))
  return <Stack gap="sm" align="start">
    <OverflowMenu {...propsFromConfig(config)} actions={actions} onAction={action => setFeedback(`${action.label} selected.`)} />
    {feedback && <Paragraph size="sm" role="status">{feedback}</Paragraph>}
  </Stack>
}

export function Controls({ config, setConfig }) {
  const [openIds, setOpenIds] = useState([])
  const actions = config.actions ?? []
  const update = (id, patch) => setConfig(current => ({ ...current, actions: (current.actions ?? []).map(action => action.id === id ? { ...action, ...patch } : action) }))
  function move(id, delta) {
    setConfig(current => {
      const next = [...current.actions]
      const index = next.findIndex(action => action.id === id)
      if (index + delta < 0 || index + delta >= next.length) return current
      ;[next[index], next[index + delta]] = [next[index + delta], next[index]]
      return { ...current, actions: next }
    })
  }
  return <Stack gap="md">
    <TextField label="Trigger label" value={config.label ?? ''} placeholder="More actions" onChange={event => setConfig(current => ({ ...current, label: event.target.value }))} size="compact" />
    <Choice label="Size" value={config.size} options={manifest.propsSchema.properties.size.enum.map(value => ({ value, label: value }))} onChange={size => setConfig(current => ({ ...current, size }))} />
    <Toggle label="Disabled" value={config.disabled} onChange={disabled => setConfig(current => ({ ...current, disabled }))} />
    <Paragraph size="sm" color="muted">{manifest.collections[0].rules}</Paragraph>
    {!actions.length && <Paragraph size="sm">No actions configured.</Paragraph>}
    {actions.map((action, index) => <Accordion key={action.id} label={action.label || 'Action'} open={openIds.includes(action.id)} onChange={open => setOpenIds(ids => open ? [...ids, action.id] : ids.filter(id => id !== action.id))}>
      <Stack gap="sm">
        <TextField label="Action label" value={action.label} onChange={event => update(action.id, { label: event.target.value })} size="compact" />
        <IconSelect label="Action icon" value={action.icon ?? ''} onChange={icon => update(action.id, { icon })} />
        <TextField label="Destination" value={action.href ?? ''} onChange={event => {
          const href = event.target.value
          setConfig(current => ({ ...current, actions: current.actions.map(item => {
            if (item.id !== action.id) return item
            const next = { ...item }; if (href) next.href = href; else delete next.href
            return next
          }) }))
        }} size="compact" />
        <Toggle label="Destructive" value={action.destructive} onChange={destructive => update(action.id, { destructive })} />
        <Toggle label="Action disabled" value={action.disabled} onChange={disabled => update(action.id, { disabled })} />
        <Toggle label="Verify before action" value={!!action.verification} onChange={enabled => {
          setConfig(current => ({ ...current, actions: current.actions.map(item => {
            if (item.id !== action.id) return item
            const next = { ...item }
            if (enabled) next.verification = createPatternNode('VerificationDialog', { id: `${item.id}-verification`, props: { title: `${item.label}?`, message: 'Review this action before continuing.', messageKey: 'verificationDialog.message', confirmLabel: item.label, destructive: !!item.destructive } })
            else delete next.verification
            return next
          }) }))
        }} />
        {action.verification && <VerificationControls config={verificationFromJson(action.verification)} setConfig={updater => {
          const current = verificationFromJson(action.verification)
          const next = typeof updater === 'function' ? updater(current) : updater
          update(action.id, { verification: verificationToJson(next).node })
        }} />}
        <Stack direction="row" gap="xs" wrap>
          <IconButton icon="arrow_upward" label={`Move ${action.label} up`} disabled={index === 0} onClick={() => move(action.id, -1)} />
          <IconButton icon="arrow_downward" label={`Move ${action.label} down`} disabled={index === actions.length - 1} onClick={() => move(action.id, 1)} />
          <Button size="sm" variant="tertiary" onClick={() => setConfig(current => ({ ...current, actions: current.actions.filter(item => item.id !== action.id) }))}>Remove action</Button>
        </Stack>
      </Stack>
    </Accordion>)}
    <Button size="sm" variant="secondary" icon="add" onClick={() => {
      const id = `action-${crypto.randomUUID()}`
      setConfig(current => ({ ...current, actions: [...(current.actions ?? []), { id, label: 'Action' }] }))
      setOpenIds(ids => [...ids, id])
    }}>Add action</Button>

  </Stack>
}

export function Snippet({ config, utilityClass = '' }) {
  const { node } = toJson(config)
  if (utilityClass) node.props.className = utilityClass
  return <Code variant="block" copyCode wrapping>{nodeToJsx(node)}</Code>
}
