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
