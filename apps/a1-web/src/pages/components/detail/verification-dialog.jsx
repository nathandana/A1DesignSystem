import { useState } from 'react'
import { Button, Code, Paragraph, Stack, TextField, TextareaField, VerificationDialog } from '@gtivr4/a1-design-system-react'
import { Toggle, WithHelp } from './configKit.jsx'
import { LabelLookupButton } from '../../../editor/LabelLookupDialog.jsx'
import { nodeToJsx } from '../../../editor/definitionToJsx.ts'
import { RenderNode } from '../../../editor/pageRenderer.tsx'
import { patternConfigNode } from '../../../editor/patternConfig.js'
import { getPatternManifest } from '../../../../../../packages/react/src/patterns/patternPolicies.js'

const manifest = getPatternManifest('VerificationDialog')
const textFields = [
  { name: 'title', label: 'Verification title' },
  { name: 'message', label: 'Verification message' },
  { name: 'confirmLabel', label: 'Confirm label' },
  { name: 'cancelLabel', label: 'Cancel label' },
]
const keyFields = textFields.map(({ name }) => `${name}Key`)
const fields = [...textFields.map(({ name }) => name), ...keyFields, 'destructive', 'disabled']
export const jsonType = manifest.type
export const acceptsJsonChildren = true
export const bareDisplay = true
export function getDefaultConfig() { return configFromProps(manifest.examples[0].props) }
export function configFromProps(props = {}) {
  return { title: '', message: '', confirmLabel: '', cancelLabel: '', destructive: false, disabled: false, ...props, sourceProps: props }
}
export function propsFromConfig(config) {
  const props = { ...config.sourceProps }
  for (const field of fields) delete props[field]
  props.title = config.title
  props.message = config.message
  for (const field of ['confirmLabel', 'cancelLabel', ...keyFields, 'destructive', 'disabled']) if (config[field]) props[field] = config[field]
  return props
}
export function fromJson(node) { return { ...configFromProps(node.props), sourceNode: node } }
export function toJson(config) {
  return { node: patternConfigNode(jsonType, config, fields, propsFromConfig(config), {}) }
}
export function Preview({ config }) {
  const [open, setOpen] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const content = config.children ?? config.sourceNode?.children?.map(node => <RenderNode key={node.id} node={node} />)
  return <Stack gap="sm" align="start">
    <Button variant="secondary" onClick={() => { setConfirmed(false); setOpen(true) }}>Open verification</Button>
    <VerificationDialog {...propsFromConfig(config)} open={open} onClose={() => setOpen(false)} onConfirm={() => { setConfirmed(true); setOpen(false) }}>{content}</VerificationDialog>
    {confirmed && <Paragraph role="status">Action confirmed.</Paragraph>}
  </Stack>
}
export function Controls({ config, setConfig }) {
  const update = patch => setConfig(current => ({ ...current, ...patch }))
  return <Stack gap="sm">
    {textFields.map(({ name, label }) => {
      const Field = name === 'message' ? TextareaField : TextField
      const key = `${name}Key`
      return <Stack key={name} gap="xs">
        <Field label={label} value={config[name] ?? ''} onChange={event => update({ [name]: event.target.value, [key]: '' })} size="compact" />
        <WithHelp helper="Choose or add a translated label. The text above is the fallback; editing it clears the binding.">
          <Stack direction="row" gap="xs" align="end">
            <TextField label={`${label} key`} value={config[key] ?? ''} onChange={event => update({ [key]: event.target.value.trim() })} size="compact" />
            <LabelLookupButton label={`${label} label actions`} value={config[key] ?? ''} sourceText={config[name] ?? ''} suggestedKeyPrefix="verificationDialog"
              onChange={(value, option) => update({ [key]: value, [name]: option?.value || config[name] })} />
          </Stack>
        </WithHelp>
      </Stack>
    })}
    <Toggle label="Destructive confirmation" value={config.destructive} onChange={destructive => update({ destructive })} />
    <Toggle label="Confirmation disabled" value={config.disabled} onChange={disabled => update({ disabled })} />
  </Stack>
}
export function Snippet({ config, utilityClass = '' }) {
  const { node } = toJson(config)
  if (utilityClass) node.props.className = utilityClass
  return <Code variant="block" copyCode wrapping>{nodeToJsx(node)}</Code>
}
