import { TextField } from '@gtivr4/a1-design-system-react'
import { Choice } from './configKit.jsx'
import { createFieldModule } from './fieldKit.jsx'

const TYPE_OPTIONS = ['text', 'email', 'password']

function TypeControl({ config, setConfig }) {
  return (
    <Choice prop="type"
      label="Type"
      size="compact"
      hideIndicator
      columns={3}
      value={config.type}
      onChange={(type) => setConfig((current) => ({ ...current, type }))}
      options={TYPE_OPTIONS.map((opt) => ({ label: opt.charAt(0).toUpperCase() + opt.slice(1), value: opt }))}
    />
  )
}

const mod = createFieldModule({
  Component: TextField,
  componentName: 'TextField',
  defaults: { label: 'Email address', type: 'email', hint: 'We’ll never share your email.', autoComplete: 'email' },
  ExtraControls: TypeControl,
  getExtraProps: (config) => ({ type: config.type }),
  getExtraSnippetProps: (config) => [config.type !== 'text' ? `type="${config.type}"` : null],
})

export const { getDefaultConfig, Preview, Controls, Snippet } = mod

// Page-definition JSON — kept in lockstep with the Text Field mapping in the
// Figma Component JSON plugin. The configurator stores `value`; page JSON uses
// the uncontrolled React prop name, `defaultValue`.
export const jsonType = 'TextField'

export function toJson(config) {
  const props = {}
  if (config.label) props.label = config.label
  if (config.type && config.type !== 'text') props.type = config.type
  if (config.value) props.defaultValue = config.value
  if (config.hint) props.hint = config.hint
  if (config.error) props.error = config.error
  if (config.size && config.size !== 'default') props.size = config.size
  if (config.labelPosition && config.labelPosition !== 'above') props.labelPosition = config.labelPosition
  if (config.autoComplete) props.autoComplete = config.autoComplete
  if (config.required) props.required = true
  if (config.disabled) props.disabled = true
  if (config.readOnly) props.readOnly = true
  return { node: { id: 'text-field-1', type: jsonType, props } }
}

export function fromJson(node) {
  const config = getDefaultConfig()
  const props = node.props ?? {}
  if (typeof props.label === 'string') config.label = props.label
  if (TYPE_OPTIONS.includes(props.type)) config.type = props.type
  if (typeof props.defaultValue === 'string') config.value = props.defaultValue
  if (typeof props.hint === 'string') config.hint = props.hint
  if (typeof props.error === 'string') config.error = props.error
  if (['comfortable', 'default', 'compact'].includes(props.size)) config.size = props.size
  if (['above', 'before'].includes(props.labelPosition)) config.labelPosition = props.labelPosition
  if (typeof props.autoComplete === 'string') config.autoComplete = props.autoComplete
  config.required = props.required === true
  config.disabled = props.disabled === true
  config.readOnly = props.readOnly === true
  return config
}
